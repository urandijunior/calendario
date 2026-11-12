// arte.js — ilustrações desenhadas em SVG no próprio aparelho (nenhuma imagem é baixada).
// Cenas das 10 empresas e retratos dos 60 funcionários, em traço de aquarela.

function hash(s) { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }

// Filtro de "traço à mão" e degradês, definidos uma única vez no documento
const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="lid-aq" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter>
  <linearGradient id="lid-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9dcf0"/><stop offset=".62" stop-color="#dff2f3"/><stop offset="1" stop-color="#fdf3d2"/></linearGradient>
  <linearGradient id="lid-vidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfeee6"/><stop offset="1" stop-color="#6fc3c9"/></linearGradient>
  <linearGradient id="lid-rio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd9ea"/><stop offset="1" stop-color="#5fb4d0"/></linearGradient>
</defs></svg>`;
if (typeof document !== "undefined" && !document.getElementById("lid-aq")) document.body.insertAdjacentHTML("afterbegin", DEFS);

// ---------------------------------------------------------------------------
// Peças de cenário
// ---------------------------------------------------------------------------
const nuvem = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="26" ry="7" fill="#e3f1f4"/><ellipse cx="-12" cy="0" rx="13" ry="9" fill="#fffdf6"/><ellipse cx="3" cy="-6" rx="15" ry="12" fill="#fffdf6"/><ellipse cx="17" cy="1" rx="11" ry="8" fill="#fffdf6"/></g>`;
const arvore = (x, y, s = 1, cor = "#6fae6c") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2" y="-6" width="4" height="14" rx="1.5" fill="#8a6a48"/><ellipse cx="0" cy="-16" rx="12" ry="13" fill="${cor}"/><ellipse cx="-5" cy="-19" rx="6" ry="6" fill="#9fd08d" opacity=".7"/></g>`;
const palmeira = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 Q3 -18 -1 -36" stroke="#9a7650" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#5fa868"><path d="M-1 -36 Q-18 -44 -24 -30 Q-12 -36 -1 -36"/><path d="M-1 -36 Q16 -46 24 -32 Q10 -36 -1 -36"/><path d="M-1 -36 Q-10 -54 -22 -48 Q-10 -46 -1 -36"/><path d="M-1 -36 Q8 -56 20 -50 Q8 -46 -1 -36"/></g></g>`;
const janelas = (x, y, cols, rows, w, h, gx, gy, cor = "#bfe6ef") => { let o = ""; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) o += `<rect x="${x + c * (w + gx)}" y="${y + r * (h + gy)}" width="${w}" height="${h}" rx="1.5" fill="${cor}"/>`; return o; };
const fumaca = (x, y) => `<g fill="#f3f1ea" opacity=".9"><ellipse cx="${x}" cy="${y}" rx="7" ry="5"/><ellipse cx="${x + 8}" cy="${y - 9}" rx="9" ry="6"/><ellipse cx="${x + 20}" cy="${y - 17}" rx="11" ry="7"/></g>`;
const pessoa = (x, y, cor) => `<g transform="translate(${x} ${y})"><circle cx="0" cy="-9" r="2.6" fill="#e9b98f"/><path d="M-3 0 Q-3 -7 0 -7 Q3 -7 3 0Z" fill="${cor}"/></g>`;

// Fundo comum: céu, sol, nuvens, morros e chão
function fundo(w, seed, { chao = "#cfe3a6", morro = true } = {}) {
  const h = hash(seed);
  const sx = 40 + (h % (w - 80));
  return `<rect width="${w}" height="180" fill="url(#lid-ceu)"/>
    <circle cx="${sx}" cy="34" r="26" fill="#fff6c9" opacity=".55"/><circle cx="${sx}" cy="34" r="15" fill="#ffe9a0"/>
    ${nuvem((sx + w * 0.38) % w, 30 + (h % 14), 1)}${nuvem((sx + w * 0.72) % w, 52 + (h % 9), 0.7)}${w > 400 ? nuvem((sx + w * 0.2) % w, 22, 0.85) : ""}
    ${morro ? `<path d="M0 112 Q${w * 0.18} 78 ${w * 0.38} 104 T${w * 0.74} 96 T${w} 108 V180 H0Z" fill="#b6d8ae"/><path d="M0 124 Q${w * 0.25} 100 ${w * 0.5} 120 T${w} 114 V180 H0Z" fill="#93c58a"/>` : ""}
    <rect y="128" width="${w}" height="52" fill="${chao}"/>`;
}

// Cada empresa é desenhada num quadro de 320 x 180 (chão em y = 128)
const PREDIOS = {
  AGR: () => `<g>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${150 + i * 6} 128 L${40 + i * 52} 180 L${92 + i * 52} 180 L${156 + i * 6} 128Z" fill="${i % 2 ? "#e8cf7a" : "#a8cf7e"}"/>`).join("")}
    <rect x="28" y="88" width="54" height="40" fill="#d9694f"/><path d="M22 90 L34 70 L76 70 L88 90Z" fill="#b24f3a"/><rect x="46" y="104" width="18" height="24" fill="#f6ead0"/><path d="M46 104 L64 128 M64 104 L46 128" stroke="#d9694f" stroke-width="1.6"/>
    <rect x="94" y="72" width="22" height="56" rx="2" fill="#c9d7de"/><path d="M94 74 Q105 56 116 74Z" fill="#9fb4bf"/><path d="M94 90 H116 M94 106 H116" stroke="#9fb4bf" stroke-width="1.5"/>
    <g transform="translate(214 118)"><rect x="-22" y="-16" width="34" height="14" rx="3" fill="#5fa868"/><rect x="-2" y="-28" width="14" height="14" rx="2" fill="#7cc188"/><rect x="1" y="-25" width="8" height="8" fill="#dff2f3"/><circle cx="-14" cy="2" r="9" fill="#4a5560"/><circle cx="-14" cy="2" r="4" fill="#e8cf7a"/><circle cx="10" cy="4" r="6" fill="#4a5560"/><rect x="-40" y="-8" width="18" height="6" fill="#e0a43a"/></g>
    ${arvore(280, 120, 1.1)}</g>`,
  VAR: () => `<g><rect x="56" y="70" width="210" height="58" fill="#fff3d6"/><rect x="56" y="62" width="210" height="12" fill="#e9745a"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<path d="M${56 + i * 21} 86 h21 l-3 12 h-15z" fill="${i % 2 ? "#fffaf0" : "#ef8d70"}"/>`).join("")}
    ${janelas(66, 102, 4, 1, 34, 20, 8, 0)}<rect x="234" y="100" width="22" height="28" fill="#8fd0de"/><path d="M245 100 V128" stroke="#fff3d6" stroke-width="1.5"/>
    <circle cx="161" cy="68" r="9" fill="#fffaf0"/><path d="M156 66 h9 l-1.5 5 h-6z M158 73.5 a1 1 0 1 0 .1 0 M163 73.5 a1 1 0 1 0 .1 0" fill="#e9745a"/>
    <rect y="140" width="320" height="40" fill="#d9d4c3"/><path d="M30 150 V180 M70 150 V180 M110 150 V180" stroke="#fffaf0" stroke-width="2"/>
    <g transform="translate(190 150)"><path d="M0 0 h18 l-3 9 h-12z" fill="none" stroke="#5a7a8c" stroke-width="2"/><circle cx="5" cy="13" r="2" fill="#5a7a8c"/><circle cx="13" cy="13" r="2" fill="#5a7a8c"/></g>
    ${pessoa(214, 158, "#e9745a")}${pessoa(140, 150, "#4fa3a0")}${arvore(34, 126, 1.1)}${arvore(292, 126, 0.95, "#84bd72")}</g>`,
  SAU: () => `<g><rect x="70" y="56" width="96" height="72" fill="#fbfaf3"/><rect x="166" y="78" width="92" height="50" fill="#f1f0e6"/><rect x="66" y="52" width="104" height="6" fill="#7fc4c9"/><rect x="162" y="74" width="100" height="6" fill="#7fc4c9"/>
    ${janelas(80, 66, 4, 3, 14, 11, 7, 7)}${janelas(176, 88, 4, 1, 14, 11, 6, 0)}<rect x="196" y="108" width="30" height="20" fill="#8fd0de"/><path d="M186 106 h50 v-4 h-50z" fill="#4fa3a0"/>
    <circle cx="118" cy="40" r="13" fill="#4fa3a0"/><path d="M114 32 h8 v5 h5 v8 h-5 v5 h-8 v-5 h-5 v-8 h5z" fill="#fffdf6"/>
    <rect y="142" width="320" height="38" fill="#d9d4c3"/>
    <g transform="translate(246 150)"><rect x="-30" y="-18" width="44" height="20" rx="3" fill="#fffdf6"/><path d="M14 -10 h12 l6 8 v4 h-18z" fill="#fffdf6"/><rect x="-30" y="-8" width="62" height="4" fill="#e9745a"/><rect x="17" y="-8" width="8" height="5" fill="#bfe6ef"/><circle cx="-16" cy="4" r="5" fill="#4a5560"/><circle cx="20" cy="4" r="5" fill="#4a5560"/><rect x="-10" y="-23" width="6" height="5" fill="#e9745a"/></g>
    ${arvore(40, 126, 1.2)}${arvore(292, 124, 0.9, "#84bd72")}</g>`,
  TEC: () => `<g><path d="M96 128 V58 L176 40 V128Z" fill="url(#lid-vidro)"/><path d="M176 128 V64 L232 76 V128Z" fill="#a8dfe0"/>
    <path d="M96 76 L176 62 M96 94 L176 84 M96 112 L176 106 M122 52 V128 M150 46 V128 M176 84 L232 92 M176 106 L232 110 M204 70 V128" stroke="#fffdf6" stroke-width="1.6" opacity=".85"/>
    <rect x="128" y="108" width="20" height="20" fill="#fffdf6" opacity=".8"/>
    <path d="M214 76 V42" stroke="#5a7a8c" stroke-width="2"/><circle cx="214" cy="40" r="3" fill="#e9745a"/><path d="M206 36 Q214 26 222 36 M201 31 Q214 16 227 31" stroke="#e9745a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <g transform="translate(52 126)"><path d="M-22 0 L-14 -16 H14 L22 0Z" fill="#3f6f8f"/><path d="M-14 -16 L-10 0 M0 -16 V0 M14 -16 L10 0 M-18 -8 H18" stroke="#9fd9ea" stroke-width="1.2"/></g>
    <g transform="translate(266 62)"><rect x="-7" y="-2" width="14" height="5" rx="2.5" fill="#4a5560"/><path d="M-14 -4 h10 M4 -4 h10" stroke="#4a5560" stroke-width="2" stroke-linecap="round"/><path d="M0 3 v7" stroke="#4a5560" stroke-width="1"/><path d="M-10 26 Q0 12 10 26" stroke="#e0a43a" stroke-width="1" fill="none" stroke-dasharray="2 2"/></g>
    ${[0, 1, 2, 3].map((i) => `<path d="M${236 + i * 22} 128 l10 52 h-14z" fill="${i % 2 ? "#e8cf7a" : "#a8cf7e"}" opacity=".9"/>`).join("")}
    ${arvore(84, 126, 0.9)}${pessoa(160, 140, "#7d8fe0")}${pessoa(172, 142, "#e9745a")}</g>`,
  IND: () => `<g><rect x="196" y="40" width="12" height="64" fill="#c9b6a4"/><rect x="220" y="52" width="12" height="52" fill="#c9b6a4"/><rect x="196" y="40" width="12" height="5" fill="#e9745a"/><rect x="220" y="52" width="12" height="5" fill="#e9745a"/>
    ${fumaca(206, 32)}${fumaca(230, 44)}
    <path d="M48 128 V92 L80 72 V92 L112 72 V92 L144 72 V92 L176 72 V128Z" fill="#e7ddc6"/><path d="M48 92 L80 72 V92Z M80 92 L112 72 V92Z M112 92 L144 72 V92Z M144 92 L176 72 V92Z" fill="#9fd0d8"/>
    <rect x="176" y="96" width="76" height="32" fill="#d9cdb2"/>${janelas(58, 102, 5, 1, 14, 10, 8, 0)}<rect x="196" y="106" width="22" height="22" fill="#8a9aa6"/><path d="M196 112 h22 M196 118 h22" stroke="#d9cdb2" stroke-width="1"/>
    <rect x="262" y="88" width="26" height="40" rx="12" fill="#c9d7de"/><path d="M262 104 h26" stroke="#9fb4bf" stroke-width="1.5"/>
    <rect y="142" width="320" height="38" fill="#d9d4c3"/>${arvore(26, 126, 1.1)}${pessoa(236, 142, "#e0a43a")}${pessoa(120, 146, "#5a7a8c")}</g>`,
  LOG: () => `<g><path d="M40 128 V88 L130 70 L220 88 V128Z" fill="#f1e6c8"/><path d="M34 90 L130 68 L226 90 L226 84 L130 62 L34 84Z" fill="#e0a43a"/>
    ${[0, 1, 2].map((i) => `<rect x="${58 + i * 52}" y="100" width="36" height="28" fill="#8fb4c4"/><path d="M${58 + i * 52} 107 h36 M${58 + i * 52} 114 h36 M${58 + i * 52} 121 h36" stroke="#f1e6c8" stroke-width="1"/>`).join("")}
    <rect y="140" width="320" height="40" fill="#b9bdb4"/><path d="M0 160 H320" stroke="#fffdf6" stroke-width="2.5" stroke-dasharray="16 12"/>
    <g transform="translate(232 152)"><rect x="-70" y="-30" width="62" height="28" rx="2" fill="#fffdf6"/><rect x="-70" y="-14" width="62" height="5" fill="#4fa3a0"/><path d="M-6 -24 h16 l10 10 v12 h-26z" fill="#e9745a"/><path d="M-2 -20 h10 l7 7 h-17z" fill="#bfe6ef"/><circle cx="-54" cy="2" r="6" fill="#4a5560"/><circle cx="-26" cy="2" r="6" fill="#4a5560"/><circle cx="10" cy="2" r="6" fill="#4a5560"/></g>
    <rect x="236" y="112" width="14" height="14" fill="#d9a877"/><rect x="250" y="116" width="11" height="10" fill="#c9966a"/><rect x="240" y="100" width="12" height="12" fill="#e2b98a"/>
    ${arvore(290, 124, 1.1)}${pessoa(30, 142, "#e0a43a")}</g>`,
  EDU: () => `<g><rect x="52" y="84" width="216" height="44" fill="#fff3d6"/><path d="M46 86 L160 70 L274 86 L274 80 L160 62 L46 80Z" fill="#d9694f"/>
    <rect x="140" y="50" width="40" height="78" fill="#fbe9c2"/><path d="M134 52 L160 28 L186 52Z" fill="#b24f3a"/><circle cx="160" cy="66" r="9" fill="#fffdf6" stroke="#b24f3a" stroke-width="2"/><path d="M160 66 V60 M160 66 L164 68" stroke="#4a5560" stroke-width="1.5" stroke-linecap="round"/>
    ${janelas(62, 96, 3, 1, 18, 16, 7, 0)}${janelas(192, 96, 3, 1, 18, 16, 7, 0)}<path d="M150 128 V104 Q160 94 170 104 V128Z" fill="#8a6a48"/>
    <path d="M286 128 V70" stroke="#8a9aa6" stroke-width="2"/><path d="M286 70 h18 l-4 6 l4 6 h-18z" fill="#4fa3a0"/>
    <path d="M150 128 L130 180 H190 L170 128Z" fill="#ead9b0"/>${arvore(28, 126, 1.3)}${pessoa(120, 148, "#d97a8c")}${pessoa(206, 146, "#4fa3a0")}${pessoa(214, 152, "#e0a43a")}</g>`,
  FIN: () => `<g><rect x="74" y="78" width="172" height="50" fill="#fbf4e2"/><path d="M64 80 L160 44 L256 80Z" fill="#f1e6c8"/><path d="M64 80 L160 44 L256 80 V84 H64Z" fill="none" stroke="#5aa58c" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="160" cy="66" r="9" fill="#5aa58c"/><path d="M156 69 Q160 58 165 62 Q163 70 156 69Z" fill="#fffdf6"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${86 + i * 28}" y="86" width="9" height="38" rx="2" fill="#fffdf6"/>`).join("")}<rect x="148" y="100" width="24" height="28" fill="#5aa58c"/><path d="M160 100 V128" stroke="#fbf4e2" stroke-width="1.5"/>
    <rect x="66" y="124" width="188" height="5" fill="#e3d6b4"/><rect x="58" y="129" width="204" height="5" fill="#d7c9a3"/>
    <rect y="142" width="320" height="38" fill="#e7e0c9"/>${arvore(36, 126, 1.2)}${arvore(288, 126, 1.2, "#84bd72")}${pessoa(118, 146, "#5aa58c")}${pessoa(204, 148, "#e9745a")}</g>`,
  TUR: () => `<g><path d="M0 146 Q80 132 160 148 T320 140 V180 H0Z" fill="url(#lid-rio)"/><path d="M20 162 q10 -4 20 0 M120 168 q10 -4 20 0 M230 158 q10 -4 20 0" stroke="#fffdf6" stroke-width="1.5" fill="none" opacity=".8"/>
    <path d="M188 128 V104 H268 V128Z" fill="#f6e3b8"/><path d="M176 106 L228 74 L280 106Z" fill="#c9a064"/><path d="M190 100 L228 78 L266 100" stroke="#b58a50" stroke-width="2" fill="none"/>
    <rect x="198" y="110" width="14" height="12" fill="#8fd0de"/><rect x="222" y="108" width="12" height="20" fill="#8a6a48"/><rect x="244" y="110" width="14" height="12" fill="#8fd0de"/>
    <rect x="170" y="128" width="112" height="5" fill="#b58a50"/><path d="M178 133 V144 M206 133 V146 M246 133 V144 M274 133 V142" stroke="#8a6a48" stroke-width="3"/>
    <g transform="translate(92 158)"><path d="M-30 -4 Q0 10 30 -4 Q0 3 -30 -4Z" fill="#b5653c"/><path d="M-30 -4 Q0 2 30 -4" stroke="#8a4a2a" stroke-width="1.5" fill="none"/>${pessoa(-6, -3, "#e9745a")}<path d="M2 -12 L14 6" stroke="#8a6a48" stroke-width="1.6" stroke-linecap="round"/></g>
    ${palmeira(150, 130, 1)}${palmeira(300, 132, 0.85)}${arvore(30, 130, 1.3, "#5fa868")}
    <path d="M60 50 q5 -5 10 0 q5 -5 10 0 M92 40 q4 -4 8 0 q4 -4 8 0" stroke="#5a7a8c" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>`,
  PUB: () => `<g><rect x="60" y="82" width="200" height="46" fill="#fbf4e2"/><rect x="54" y="76" width="212" height="8" fill="#e3d6b4"/>
    <path d="M128 76 Q160 30 192 76Z" fill="#9a86c9"/><rect x="154" y="34" width="12" height="10" fill="#fbf4e2"/><path d="M160 34 V16" stroke="#8a9aa6" stroke-width="2"/><path d="M160 16 h16 l-4 5 l4 5 h-16z" fill="#5fa868"/><path d="M164 21 l4 0" stroke="#ffe9a0" stroke-width="3"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${70 + i * 27} 128 V104 Q${79 + i * 27} 92 ${88 + i * 27} 104 V128Z" fill="${i === 3 ? "#8a6a48" : "#bfe6ef"}"/>`).join("")}
    <rect x="52" y="128" width="216" height="5" fill="#d7c9a3"/><rect y="140" width="320" height="40" fill="#e7e0c9"/>
    <g transform="translate(160 158)"><ellipse cx="0" cy="4" rx="26" ry="7" fill="#9fd9ea"/><ellipse cx="0" cy="4" rx="26" ry="7" fill="none" stroke="#d7c9a3" stroke-width="3"/><path d="M0 2 V-10 M0 -10 q-8 2 -9 10 M0 -10 q8 2 9 10" stroke="#fffdf6" stroke-width="1.6" fill="none"/></g>
    ${arvore(30, 126, 1.2)}${arvore(292, 126, 1.2, "#84bd72")}${pessoa(104, 150, "#9a86c9")}${pessoa(222, 152, "#e9745a")}${pessoa(232, 148, "#4fa3a0")}</g>`,
};

/** Cena ilustrada da empresa de um ramo (320 x 180). */
export function cena(codigo) {
  const f = PREDIOS[codigo];
  if (!f) return "";
  const semMorro = codigo === "VAR" || codigo === "LOG";
  return `<svg class="cena-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true"><g filter="url(#lid-aq)">${fundo(320, codigo, { morro: !semMorro, chao: codigo === "TUR" ? "#b9dc9c" : "#cfe3a6" })}${f()}</g></svg>`;
}

/** Panorama da cidade com várias empresas (tela inicial). */
export function cidade() {
  const ordem = ["EDU", "FIN", "TEC", "VAR", "IND"];
  const pos = [[-30, 0.62], [120, 0.66], [262, 0.72], [420, 0.66], [560, 0.62]];
  return `<svg class="cena-svg" viewBox="0 0 760 180" preserveAspectRatio="xMidYMax slice" role="img" aria-hidden="true"><g filter="url(#lid-aq)">${fundo(760, "cidade")}
    ${ordem.map((c, i) => `<g transform="translate(${pos[i][0]} ${128 - 128 * pos[i][1]}) scale(${pos[i][1]})">${PREDIOS[c]()}</g>`).join("")}
    <rect y="150" width="760" height="30" fill="#d9d4c3"/><path d="M0 165 H760" stroke="#fffdf6" stroke-width="2.5" stroke-dasharray="18 14"/></g></svg>`;
}

// ---------------------------------------------------------------------------
// Retratos
// ---------------------------------------------------------------------------
const PELE = ["#f8d9bd", "#f0c8a0", "#dfa97c", "#c08a5e", "#96623f"];
const CABELO = ["#2b2320", "#3d2a1f", "#5e4029", "#8a5a2b", "#b9853f", "#1f1f29", "#6f6a66"];
export const COR_RAMO = { AGR: "#7fae6a", VAR: "#e9745a", SAU: "#5fb6bd", TEC: "#7d8fe0", IND: "#8c9aa8", LOG: "#e0a43a", EDU: "#d97a8c", FIN: "#5aa58c", TUR: "#48a898", PUB: "#9a86c9" };
const FEM = new Set(["Aline", "Simone", "Yasmin", "Beatriz", "Elaine"]);
const ehMulher = (nome) => { const n = nome.replace(/^Dra?\.\s*/, "").split(" ")[0]; return /^Dra\./.test(nome) || FEM.has(n) || /a$/.test(n); };

/** Retrato de um funcionário (objeto de D.FUNCIONARIOS). Sempre o mesmo para a mesma pessoa. */
export function retrato(p, classe = "retrato") {
  if (!p) return "";
  const h = hash(p.nome), mulher = ehMulher(p.nome);
  const pele = PELE[h % PELE.length], cab = CABELO[(h >>> 3) % CABELO.length];
  const roupa = COR_RAMO[p.ramo] || "#7fa8b8";
  const estilo = (h >>> 7) % 5, oculos = (h >>> 11) % 4 === 0, barba = !mulher && (h >>> 13) % 4 === 0;
  const jaleco = /Médic|Enfermeir|Farmacêutic/.test(p.cargo), capacete = /segurança do trabalho|Supervisor de produção|Mecânic|Operador|Técnico de qualidade/.test(p.cargo), chef = /Chef/.test(p.cargo);
  const franja = `<path d="M19 27 Q20 13 32 13 Q44 13 45 27 Q40 19 32 20 Q25 19 19 27Z" fill="${cab}"/>`;
  let atras = "", frente = "";
  if (mulher) {
    if (estilo === 0) { atras = `<path d="M16 28 Q14 9 32 9 Q50 9 48 28 L50 50 Q41 45 32 45 Q23 45 14 50Z" fill="${cab}"/>`; frente = franja; }
    else if (estilo === 1) { atras = `<path d="M16 30 Q14 9 32 9 Q50 9 48 30 L47 39 Q32 44 17 39Z" fill="${cab}"/>`; frente = `<path d="M19 28 Q18 13 34 13 Q45 14 45 27 Q41 20 35 20 Q27 23 19 28Z" fill="${cab}"/>`; }
    else if (estilo === 2) { atras = `<circle cx="32" cy="9" r="6.5" fill="${cab}"/>`; frente = franja; }
    else if (estilo === 3) { atras = `<path d="M44 20 Q56 22 53 42 Q49 36 46 34Z" fill="${cab}"/>`; frente = franja; }
    else { atras = [[19, 20], [17, 29], [19, 38], [25, 12], [32, 10], [39, 12], [45, 20], [47, 29], [45, 38]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${cab}"/>`).join(""); frente = `<path d="M20 25 Q24 15 32 15 Q40 15 44 25 Q38 20 32 21 Q26 20 20 25Z" fill="${cab}"/>`; }
  } else {
    if (estilo === 0) frente = `<path d="M19 26 Q19 12 32 12 Q45 12 45 26 Q42 18 32 18 Q22 18 19 26Z" fill="${cab}"/>`;
    else if (estilo === 1) frente = `<path d="M19 27 Q18 11 33 11 Q46 12 45 27 Q43 19 36 19 Q28 22 21 20Z" fill="${cab}"/>`;
    else if (estilo === 2) frente = [[21, 19], [26, 14], [32, 12], [38, 14], [43, 19]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${cab}"/>`).join("");
    else if (estilo === 3) frente = `<path d="M19 28 Q18 20 22 17 Q21 24 19 28Z M45 28 Q46 20 42 17 Q43 24 45 28Z" fill="#8a8580"/><path d="M23 17 Q32 12 41 17 Q32 15 23 17Z" fill="#8a8580"/>`;
    else frente = `<path d="M19 26 Q20 11 32 11 Q44 11 45 26 Q41 16 32 17 Q23 16 19 26Z" fill="${cab}"/><path d="M27 12 Q32 6 37 12Z" fill="${cab}"/>`;
  }
  if (capacete) frente = `<path d="M18 23 Q18 9 32 9 Q46 9 46 23Z" fill="#f2c23e"/><rect x="16" y="22" width="32" height="3.5" rx="1.5" fill="#d9a520"/>`;
  if (chef) frente = `<path d="M22 20 Q16 8 26 8 Q32 2 38 8 Q48 8 42 20Z" fill="#fffdf6" stroke="#e3d6b4" stroke-width="1"/>`;
  return `<svg class="${classe}" viewBox="0 0 64 64" role="img" aria-hidden="true">
    <circle cx="32" cy="32" r="32" fill="${roupa}" opacity=".22"/><circle cx="32" cy="32" r="32" fill="#fffaf0" opacity=".5"/>
    ${atras}<path d="M7 66 Q9 46 32 46 Q55 46 57 66Z" fill="${jaleco ? "#fffdf6" : roupa}"/>${jaleco ? `<path d="M26 47 L32 58 L38 47" fill="none" stroke="${roupa}" stroke-width="2.5"/>` : `<path d="M27 46.5 L32 53 L37 46.5Z" fill="#fffdf6"/>`}
    <rect x="27.5" y="38" width="9" height="10" rx="3" fill="${pele}"/><rect x="27.5" y="40" width="9" height="4" fill="#000" opacity=".08"/>
    <ellipse cx="32" cy="28" rx="12.5" ry="14" fill="${pele}"/><ellipse cx="19.5" cy="29" rx="2" ry="3" fill="${pele}"/><ellipse cx="44.5" cy="29" rx="2" ry="3" fill="${pele}"/>
    ${barba ? `<path d="M21 31 Q22 44 32 44 Q42 44 43 31 Q40 38 32 37.5 Q24 38 21 31Z" fill="${cab}" opacity=".85"/>` : ""}
    ${frente}
    <ellipse cx="27" cy="29.5" rx="1.8" ry="2.5" fill="#2b2320"/><ellipse cx="37" cy="29.5" rx="1.8" ry="2.5" fill="#2b2320"/><circle cx="27.6" cy="28.6" r=".7" fill="#fff"/><circle cx="37.6" cy="28.6" r=".7" fill="#fff"/>
    <path d="M24.5 25.2 q2.5 -1.4 5 0 M34.5 25.2 q2.5 -1.4 5 0" stroke="${cab}" stroke-width="1" fill="none" stroke-linecap="round"/>
    <circle cx="24" cy="34" r="2.4" fill="#f08a7a" opacity=".4"/><circle cx="40" cy="34" r="2.4" fill="#f08a7a" opacity=".4"/>
    <path d="M29 35.5 Q32 38 35 35.5" stroke="#7a3f33" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    ${oculos ? `<g fill="none" stroke="#4a5560" stroke-width="1.1"><circle cx="27" cy="29.5" r="4"/><circle cx="37" cy="29.5" r="4"/><path d="M31 29.5 h2"/></g>` : ""}
  </svg>`;
}
