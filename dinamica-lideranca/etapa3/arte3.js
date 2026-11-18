// arte3.js — cenas ilustradas da Etapa 3, desenhadas em SVG no próprio aparelho.
// Nenhuma imagem é baixada: tudo é vetor, o que carrega instantâneo mesmo no wi-fi da sala.
//
// Linguagem visual: aquarela pintada à mão, no registro do anime clássico —
// camadas de profundidade, neblina entre os planos, luz de amanhecer ou de fim de tarde,
// pétalas e poeira luminosa no ar. Todas as cenas são originais, criadas para esta atividade.
//
// Cada ramo tem a sua paleta e a sua hora do dia, para que o aluno reconheça o seu cenário
// de longe. A arte é decorativa: aria-hidden em tudo, nada aqui carrega informação.

function hash(s) { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
const rnd = (seed) => { let h = hash(seed); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507), h = Math.imul(h ^ (h >>> 13), 3266489909), ((h ^= h >>> 16) >>> 0) / 4294967296)); };

// ---------------------------------------------------------------------------
// Paletas: céu (3 paradas), morros (3 planos), chão, luz e acento
// ---------------------------------------------------------------------------
export const PALETA = {
  AGR: { hora: "Amanhecer na lavoura", ceu: ["#8fc9e8", "#d9eef0", "#ffe7b0"], sol: "#fff0bd", morros: ["#b7cfc0", "#9ec493", "#7faa6c"], chao: "#d8cf8e", luz: "#ffe9a8", acento: "#7fae6a", nevoa: "#eaf4f0" },
  VAR: { hora: "Fim de tarde na cidade", ceu: ["#f6b58f", "#fbd9b0", "#fdf0d8"], sol: "#ffd9a0", morros: ["#c7aeb0", "#b89494", "#8f6f74"], chao: "#cfc3b4", luz: "#ffd2a8", acento: "#e9745a", nevoa: "#fbe8da" },
  SAU: { hora: "Manhã clara", ceu: ["#a6dce9", "#d9f1f2", "#f3fbf7"], sol: "#ffffff", morros: ["#bcd9d6", "#9ec9c4", "#7eafab"], chao: "#d7e4d2", luz: "#e8fbff", acento: "#4fa3a0", nevoa: "#eefaf9" },
  TEC: { hora: "Crepúsculo", ceu: ["#4c5b96", "#8b8fc4", "#e9b7c0"], sol: "#ffd6c4", morros: ["#5b6391", "#484f78", "#343a5c"], chao: "#3e4466", luz: "#c9b5ff", acento: "#7d8fe0", nevoa: "#8d93c4" },
  IND: { hora: "Manhã enevoada", ceu: ["#b9c6cf", "#dbe3e6", "#f3eee4"], sol: "#fff4dc", morros: ["#b4bcc2", "#9aa4ab", "#7c868f"], chao: "#c2bcae", luz: "#fdf2de", acento: "#8c9aa8", nevoa: "#e8edee" },
  LOG: { hora: "Estrada ao amanhecer", ceu: ["#7fb6dd", "#cfe4ec", "#ffdca8"], sol: "#ffe3a8", morros: ["#a9bfbe", "#8fab9c", "#6f8c79"], chao: "#b9b2a4", luz: "#ffe0a6", acento: "#e0a43a", nevoa: "#e6eff0" },
  EDU: { hora: "Tarde dourada", ceu: ["#9ccfe4", "#e3f0e4", "#ffe9c2"], sol: "#ffeeb8", morros: ["#bcd2ae", "#a2c291", "#7fa473"], chao: "#dcd3a8", luz: "#ffeec2", acento: "#d97a8c", nevoa: "#f0f6e9" },
  FIN: { hora: "Manhã serena", ceu: ["#a9dce0", "#dcf0e6", "#f6f6e2"], sol: "#fffbe0", morros: ["#b6d2bf", "#98bda4", "#769c85"], chao: "#d4ddc0", luz: "#eafbf0", acento: "#5aa58c", nevoa: "#edf7f0" },
  TUR: { hora: "Aurora no Pantanal", ceu: ["#f3a9b4", "#ffd4bd", "#bfe7e0"], sol: "#ffe2c4", morros: ["#9fc4bd", "#7faea8", "#5f8f8c"], chao: "#a9c89c", luz: "#ffd9c4", acento: "#48a898", nevoa: "#f6ded8" },
  PUB: { hora: "Meio-dia alto", ceu: ["#8ec8ea", "#c9e4f2", "#f4f2e4"], sol: "#ffffff", morros: ["#c2cfbe", "#a9bda6", "#8aa088"], chao: "#d9d6c2", luz: "#f4faff", acento: "#9a86c9", nevoa: "#eef4f4" },
};

// Cena de abertura (telas de aviso e de entrada): trilha subindo o morro ao amanhecer
const PALETA_ABERTURA = { hora: "", ceu: ["#86c3e6", "#dceff0", "#ffe3ad"], sol: "#fff1c2", morros: ["#b4cdc4", "#9bc396", "#7aa76b"], chao: "#cfd99a", luz: "#ffe9a8", acento: "#5fa868", nevoa: "#eaf4f0" };

// ---------------------------------------------------------------------------
// Definições: filtros, degradês e a animação (uma vez por documento)
// ---------------------------------------------------------------------------
const DEFS = `
<svg id="et3-defs" width="0" height="0" style="position:absolute;pointer-events:none" aria-hidden="true"><defs>
  <filter id="et3-aq" x="-3%" y="-3%" width="106%" height="106%">
    <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="11" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/>
  </filter>
  <filter id="et3-grao" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="5"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <filter id="et3-suave" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="et3-nevoa" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
</defs></svg>
<style id="et3-anim">
  @keyframes et3-deriva { from { transform: translateX(-9%); } to { transform: translateX(109%); } }
  @keyframes et3-flutua { 0% { transform: translate(0,0) rotate(0deg); opacity:0; }
    10% { opacity:.85; } 90% { opacity:.6; }
    100% { transform: translate(var(--dx,40px), 115%) rotate(var(--rot,220deg)); opacity:0; } }
  @keyframes et3-brilho { 0%,100% { opacity:.26; } 50% { opacity:.5; } }
  @keyframes et3-asa { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(.45); } }
  .et3-nuvem { animation: et3-deriva linear infinite; will-change: transform; }
  .et3-part { animation: et3-flutua linear infinite; will-change: transform, opacity; }
  .et3-raios { animation: et3-brilho ease-in-out 9s infinite; }
  .et3-passaro { animation: et3-asa ease-in-out 1.1s infinite; transform-origin: center; }
  @media (prefers-reduced-motion: reduce) {
    .et3-nuvem, .et3-part, .et3-raios, .et3-passaro { animation: none !important; }
    .et3-part { opacity: .5; }
  }
</style>`;

let pronto = false;
export function prepararArte() {
  if (pronto || typeof document === "undefined") return;
  if (!document.getElementById("et3-defs")) document.body.insertAdjacentHTML("afterbegin", DEFS);
  pronto = true;
}

// ---------------------------------------------------------------------------
// Peças
// ---------------------------------------------------------------------------
const W = 1200, H = 560, LINHA = 410; // linha do chão

const nuvem = (s = 1, cor = "#fffdf6") => `<g transform="scale(${s})">
  <ellipse cx="0" cy="10" rx="62" ry="13" fill="${cor}" opacity=".55"/>
  <ellipse cx="-28" cy="0" rx="30" ry="20" fill="${cor}"/>
  <ellipse cx="4" cy="-12" rx="36" ry="27" fill="${cor}"/>
  <ellipse cx="38" cy="2" rx="26" ry="18" fill="${cor}"/>
  <ellipse cx="-50" cy="6" rx="18" ry="12" fill="${cor}" opacity=".85"/></g>`;

const nuvensAnimadas = (p, seed) => {
  const r = rnd(seed + "nuv");
  return [0, 1, 2, 3].map((i) => {
    const dur = 85 + r() * 110, y = 36 + i * 46 + r() * 20, s = 0.55 + r() * 0.75, atraso = -r() * dur;
    return `<g class="et3-nuvem" style="animation-duration:${dur.toFixed(0)}s;animation-delay:${atraso.toFixed(0)}s">
      <g transform="translate(0 ${y.toFixed(0)})" opacity="${(0.42 + r() * 0.4).toFixed(2)}">${nuvem(s, "#fffdf6")}</g></g>`;
  }).join("");
};

const raiosDeLuz = (sx, cor) => `<g class="et3-raios" opacity=".34">
  ${[-1, 0, 1, 2].map((i) => {
    const x = sx + i * 86;
    return `<path d="M${x} 0 L${x - 52 + i * 10} ${LINHA + 70} L${x + 46 + i * 10} ${LINHA + 70} Z" fill="${cor}" opacity="${0.5 - Math.abs(i) * 0.1}"/>`;
  }).join("")}</g>`;

const particulas = (seed, cor, n = 16) => {
  const r = rnd(seed + "part");
  return `<g>${Array.from({ length: n }, () => {
    const x = r() * W, y = -40 - r() * 120, dur = 16 + r() * 26, atraso = -r() * dur;
    const t = r(), raio = 1.6 + r() * 3.2, dx = (r() * 180 - 60).toFixed(0), rot = (120 + r() * 420).toFixed(0);
    const forma = t > 0.55
      ? `<ellipse rx="${raio * 1.7}" ry="${raio * 0.8}" fill="${cor}" opacity=".85"/>`
      : `<circle r="${raio * 0.7}" fill="#fffdf6" opacity=".9"/>`;
    return `<g class="et3-part" style="--dx:${dx}px;--rot:${rot}deg;animation-duration:${dur.toFixed(1)}s;animation-delay:${atraso.toFixed(1)}s">
      <g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${forma}</g></g>`;
  }).join("")}</g>`;
};

const passaros = (x, y, seed) => {
  const r = rnd(seed + "ave");
  return `<g opacity=".55" fill="none" stroke="#5a6a74" stroke-width="2.6" stroke-linecap="round">
    ${[0, 1, 2, 3].map((i) => {
      const px = x + i * (34 + r() * 26), py = y + (r() * 34 - 17), s = 0.7 + r() * 0.5;
      return `<g class="et3-passaro" style="animation-delay:${(-r() * 1.1).toFixed(2)}s" transform="translate(${px.toFixed(0)} ${py.toFixed(0)}) scale(${s.toFixed(2)})">
        <path d="M-11 0 q5.5 -7 11 0 q5.5 -7 11 0"/></g>`;
    }).join("")}</g>`;
};

const arvore = (x, y, s, cor, escura) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-3 0 q1 -22 0 -40" stroke="#7d5f42" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-52" rx="30" ry="30" fill="${cor}"/>
  <ellipse cx="-14" cy="-60" rx="17" ry="16" fill="${escura}" opacity=".55"/>
  <ellipse cx="15" cy="-44" rx="15" ry="14" fill="${escura}" opacity=".4"/></g>`;

const palmeira = (x, y, s, cor) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 0 Q7 -46 -2 -92" stroke="#9a7650" stroke-width="9" fill="none" stroke-linecap="round"/>
  <g fill="${cor}">${[[-62, -74], [62, -78], [-54, -118], [52, -122], [0, -132]].map(([dx, dy]) =>
    `<path d="M-2 -92 Q${dx} ${dy} ${dx * 1.05} ${dy + 26} Q${dx * 0.42} ${dy + 12} -2 -92"/>`).join("")}</g></g>`;

const capim = (seed, cor, escura) => {
  const r = rnd(seed + "capim");
  return `<g>${Array.from({ length: 46 }, () => {
    const x = r() * W, h = 16 + r() * 40, inc = r() * 22 - 11, c = r() > 0.5 ? cor : escura;
    return `<path d="M${x.toFixed(0)} ${H} q${(inc / 2).toFixed(0)} ${(-h * 0.6).toFixed(0)} ${inc.toFixed(0)} ${(-h).toFixed(0)}" stroke="${c}" stroke-width="${(2 + r() * 2.4).toFixed(1)}" fill="none" stroke-linecap="round" opacity="${(0.5 + r() * 0.45).toFixed(2)}"/>`;
  }).join("")}</g>`;
};

const janelas = (x, y, cols, rows, w, h, gx, gy, cor, acesa) => {
  let o = ""; const r = rnd(`${x}${y}${cols}`);
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++)
    o += `<rect x="${x + j * (w + gx)}" y="${y + i * (h + gy)}" width="${w}" height="${h}" rx="2" fill="${r() > 0.68 ? acesa : cor}" opacity="${(0.75 + r() * 0.25).toFixed(2)}"/>`;
  return o;
};

// ---------------------------------------------------------------------------
// Fundo comum: céu, sol, nuvens, três planos de morro com neblina entre eles
// ---------------------------------------------------------------------------
function fundo(p, seed) {
  const r = rnd(seed), sx = 190 + r() * 760;
  const g = `et3-ceu-${hash(seed) % 100000}`;
  const morro = (y, amp, cor, op = 1) => {
    const q = rnd(seed + y);
    let d = `M0 ${y}`;
    for (let x = 0; x <= W; x += 150) d += ` Q${x + 75} ${(y - amp * (0.45 + q() * 0.85)).toFixed(0)} ${x + 150} ${(y - amp * (q() * 0.42)).toFixed(0)}`;
    return `<path d="${d} L${W} ${H} L0 ${H} Z" fill="${cor}" opacity="${op}"/>`;
  };
  return `
  <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.ceu[0]}"/><stop offset=".58" stop-color="${p.ceu[1]}"/><stop offset="1" stop-color="${p.ceu[2]}"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#${g})"/>
  <circle cx="${sx.toFixed(0)}" cy="118" r="96" fill="${p.sol}" opacity=".3" filter="url(#et3-suave)"/>
  <circle cx="${sx.toFixed(0)}" cy="118" r="42" fill="${p.sol}" opacity=".9"/>
  ${raiosDeLuz(sx, p.luz)}
  ${nuvensAnimadas(p, seed)}
  ${passaros(sx > 600 ? 170 : 820, 128, seed)}
  <g filter="url(#et3-aq)">
    ${morro(300, 118, p.morros[0], 0.9)}
    <rect y="286" width="${W}" height="54" fill="${p.nevoa}" opacity=".5" filter="url(#et3-nevoa)"/>
    ${morro(352, 86, p.morros[1], 0.95)}
    <rect y="340" width="${W}" height="48" fill="${p.nevoa}" opacity=".42" filter="url(#et3-nevoa)"/>
    ${morro(LINHA, 54, p.morros[2])}
  </g>
  <rect y="${LINHA + 2}" width="${W}" height="${H - LINHA}" fill="${p.chao}"/>`;
}

// ---------------------------------------------------------------------------
// Primeiro plano de cada ramo (desenhado sobre a linha do chão, y = 410)
// ---------------------------------------------------------------------------
const FRENTE = {
  AGR: (p) => `<g>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${520 + i * 16} ${LINHA} L${120 + i * 150} ${H} L${230 + i * 150} ${H} L${536 + i * 16} ${LINHA} Z" fill="${i % 2 ? "#e2c96f" : "#bcd47c"}" opacity=".82"/>`).join("")}
    <g transform="translate(150 ${LINHA})"><rect x="-42" y="-96" width="84" height="96" rx="5" fill="#d9cdb2"/><path d="M-50 -94 Q0 -142 50 -94 Z" fill="#c1b28f"/>${janelas(-28, -72, 2, 2, 22, 20, 12, 14, "#9fb4bf", "#ffe9a8")}</g>
    <g transform="translate(286 ${LINHA})"><rect x="-34" y="-128" width="68" height="128" rx="34" fill="#cfd9de"/><path d="M-34 -128 Q0 -156 34 -128" fill="#aebfc7"/><path d="M-34 -92 H34 M-34 -56 H34" stroke="#aebfc7" stroke-width="3"/></g>
    <g transform="translate(910 ${LINHA - 14})"><rect x="-70" y="-46" width="104" height="40" rx="7" fill="${p.acento}"/><rect x="-8" y="-82" width="42" height="40" rx="5" fill="#9fd08d"/><rect x="0" y="-74" width="26" height="22" fill="#dff2f3"/><circle cx="-46" cy="6" r="25" fill="#43505c"/><circle cx="-46" cy="6" r="11" fill="#e2c96f"/><circle cx="28" cy="10" r="17" fill="#43505c"/><rect x="-124" y="-26" width="56" height="18" rx="3" fill="#e0a43a"/></g>
    ${arvore(1096, H - 24, 1.5, "#7fae6a", "#9fd08d")}${capim("agr", "#b5c96a", "#8fae52")}</g>`,

  VAR: (p) => `<g>
    <rect x="236" y="${LINHA - 150}" width="660" height="150" fill="#fff3d6"/>
    <rect x="228" y="${LINHA - 172}" width="676" height="26" rx="4" fill="${p.acento}"/>
    ${[...Array(16)].map((_, i) => `<path d="M${240 + i * 41} ${LINHA - 118} h41 l-7 30 h-27 z" fill="${i % 2 ? "#fffaf0" : "#ef8d70"}"/>`).join("")}
    ${janelas(266, LINHA - 78, 5, 1, 92, 56, 24, 0, "#bfe6ef", "#ffe9a8")}
    <rect x="800" y="${LINHA - 80}" width="68" height="80" rx="3" fill="#8fd0de"/><path d="M834 ${LINHA - 80} V${LINHA}" stroke="#fff3d6" stroke-width="4"/>
    <circle cx="566" cy="${LINHA - 196}" r="26" fill="#fffaf0"/><path d="M552 ${LINHA - 202} h28 l-5 15 h-18 z M557 ${LINHA - 183} a3 3 0 1 0 .1 0 M572 ${LINHA - 183} a3 3 0 1 0 .1 0" fill="${p.acento}"/>
    <rect y="${LINHA + 34}" width="${W}" height="${H - LINHA - 34}" fill="#cfc3b4"/>
    <path d="M0 ${H - 52} H${W}" stroke="#fffdf6" stroke-width="6" stroke-dasharray="44 34" opacity=".8"/>
    ${arvore(120, LINHA + 26, 1.25, "#9a8f7a", "#b8ab92")}${arvore(1072, LINHA + 30, 1.1, "#8f8571", "#aba08a")}
    <g transform="translate(676 ${LINHA + 20})"><path d="M0 0 h50 l-8 26 h-34 z" fill="none" stroke="#6b7a86" stroke-width="5"/><circle cx="13" cy="34" r="6" fill="#6b7a86"/><circle cx="37" cy="34" r="6" fill="#6b7a86"/></g>
    ${capim("var", "#b3a890", "#978c76")}</g>`,

  SAU: (p) => `<g>
    <rect x="300" y="${LINHA - 206}" width="300" height="206" fill="#fbfaf3"/>
    <rect x="600" y="${LINHA - 148}" width="286" height="148" fill="#f1f0e6"/>
    <rect x="292" y="${LINHA - 218}" width="316" height="14" fill="${p.acento}"/><rect x="592" y="${LINHA - 160}" width="302" height="14" fill="${p.acento}"/>
    ${janelas(326, LINHA - 186, 5, 4, 34, 26, 18, 18, "#bfe6ef", "#ffe9a8")}
    ${janelas(626, LINHA - 126, 5, 2, 34, 26, 18, 18, "#bfe6ef", "#ffe9a8")}
    <rect x="700" y="${LINHA - 56}" width="92" height="56" fill="#8fd0de"/><rect x="684" y="${LINHA - 64}" width="124" height="10" fill="${p.acento}"/>
    <circle cx="450" cy="${LINHA - 254}" r="34" fill="${p.acento}"/><path d="M438 ${LINHA - 276} h24 v12 h12 v24 h-12 v12 h-24 v-12 h-12 v-24 h12 z" fill="#fffdf6"/>
    <rect y="${LINHA + 40}" width="${W}" height="${H - LINHA - 40}" fill="#cfd4c6"/>
    <g transform="translate(980 ${LINHA + 22})"><rect x="-86" y="-54" width="124" height="54" rx="7" fill="#fffdf6"/><path d="M38 -34 h34 l18 22 v12 h-52 z" fill="#fffdf6"/><rect x="-86" y="-26" width="176" height="11" fill="${p.acento}"/><rect x="46" y="-28" width="22" height="14" fill="#bfe6ef"/><circle cx="-46" cy="6" r="15" fill="#43505c"/><circle cx="58" cy="6" r="15" fill="#43505c"/><rect x="-28" y="-68" width="16" height="14" rx="2" fill="#e9745a"/></g>
    ${arvore(136, LINHA + 34, 1.45, "#7fae8a", "#a3cfae")}${arvore(1116, LINHA + 24, 1.15, "#6f9e7c", "#95c4a2")}
    ${capim("sau", "#a9c4a2", "#89a884")}</g>`,

  TEC: (p) => `<g>
    <path d="M330 ${LINHA} V${LINHA - 272} L560 ${LINHA - 318} V${LINHA} Z" fill="#8fb6d8" opacity=".92"/>
    <path d="M560 ${LINHA} V${LINHA - 290} L700 ${LINHA - 254} V${LINHA} Z" fill="#a8cfe0" opacity=".9"/>
    <path d="M700 ${LINHA} V${LINHA - 212} L856 ${LINHA - 240} V${LINHA} Z" fill="#7d9fc4" opacity=".92"/>
    <g stroke="#fffdf6" stroke-width="3" opacity=".6">
      ${[...Array(9)].map((_, i) => `<path d="M330 ${LINHA - 254 + i * 28} L560 ${LINHA - 296 + i * 28}"/>`).join("")}
      ${[...Array(7)].map((_, i) => `<path d="M700 ${LINHA - 196 + i * 28} L856 ${LINHA - 222 + i * 28}"/>`).join("")}
      <path d="M404 ${LINHA - 302} V${LINHA} M482 ${LINHA - 318} V${LINHA} M770 ${LINHA - 236} V${LINHA}"/></g>
    ${janelas(586, LINHA - 258, 3, 5, 26, 22, 18, 24, "#cfe8f2", "#ffe0a8")}
    <path d="M820 ${LINHA - 244} V${LINHA - 320}" stroke="#4f5a74" stroke-width="5"/><circle cx="820" cy="${LINHA - 326}" r="7" fill="#e9745a"/>
    <path d="M800 ${LINHA - 342} q20 -26 40 0 M786 ${LINHA - 360} q34 -42 68 0" stroke="#e9745a" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M${880 + i * 52} ${LINHA} l26 ${H - LINHA} h-38 z" fill="#c9d87c" opacity=".55"/>`).join("")}
    <g transform="translate(196 ${LINHA})"><path d="M-56 0 L-34 -62 H34 L56 0 Z" fill="#46527a"/><path d="M-34 -62 L-24 0 M0 -62 V0 M34 -62 L24 0 M-46 -30 H46" stroke="#9fd9ea" stroke-width="3" opacity=".7"/></g>
    ${arvore(1118, H - 16, 1.3, "#4d6a7e", "#6d8ea0")}${capim("tec", "#5b6c84", "#46556b")}
    ${[...Array(30)].map((_, i) => { const r = rnd("tecstar" + i); return `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * 190).toFixed(0)}" r="${(0.9 + r() * 1.5).toFixed(1)}" fill="#fffdf6" opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`; }).join("")}</g>`,

  IND: (p) => `<g>
    <rect x="770" y="${LINHA - 268}" width="34" height="268" fill="#c9b6a4"/><rect x="836" y="${LINHA - 224}" width="34" height="224" fill="#c0ad9c"/>
    <rect x="770" y="${LINHA - 268}" width="34" height="14" fill="#e9745a"/><rect x="836" y="${LINHA - 224}" width="34" height="14" fill="#e9745a"/>
    <g fill="#f3f1ea" opacity=".88" filter="url(#et3-suave)"><ellipse cx="788" cy="${LINHA - 290}" rx="28" ry="18"/><ellipse cx="814" cy="${LINHA - 330}" rx="38" ry="24"/><ellipse cx="856" cy="${LINHA - 372}" rx="46" ry="28"/></g>
    <path d="M176 ${LINHA} V${LINHA - 124} L286 ${LINHA - 194} V${LINHA - 124} L396 ${LINHA - 194} V${LINHA - 124} L506 ${LINHA - 194} V${LINHA - 124} L616 ${LINHA - 194} V${LINHA} Z" fill="#e7ddc6"/>
    <g fill="#9fd0d8">${[0, 1, 2, 3].map((i) => `<path d="M${176 + i * 110} ${LINHA - 124} L${286 + i * 110} ${LINHA - 194} V${LINHA - 124} Z"/>`).join("")}</g>
    <rect x="616" y="${LINHA - 110}" width="200" height="110" fill="#d9cdb2"/>
    ${janelas(206, LINHA - 100, 6, 1, 42, 30, 24, 0, "#9fb4bf", "#ffe9a8")}
    <rect x="652" y="${LINHA - 78}" width="76" height="78" fill="#8a9aa6"/><path d="M652 ${LINHA - 58} h76 M652 ${LINHA - 38} h76" stroke="#d9cdb2" stroke-width="3"/>
    <rect x="896" y="${LINHA - 128}" width="76" height="128" rx="38" fill="#cfd9de"/><path d="M896 ${LINHA - 86} h76" stroke="#aebfc7" stroke-width="3"/>
    <rect y="${LINHA + 44}" width="${W}" height="${H - LINHA - 44}" fill="#bcb6a8"/>
    ${arvore(94, LINHA + 40, 1.4, "#7d8f7a", "#9db09a")}${capim("ind", "#9a9f86", "#7d836c")}</g>`,

  LOG: (p) => `<g>
    <path d="M150 ${LINHA} V${LINHA - 130} L470 ${LINHA - 196} L790 ${LINHA - 130} V${LINHA} Z" fill="#f1e6c8"/>
    <path d="M138 ${LINHA - 128} L470 ${LINHA - 200} L802 ${LINHA - 128} V${LINHA - 142} L470 ${LINHA - 214} L138 ${LINHA - 142} Z" fill="${p.acento}"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${196 + i * 152}" y="${LINHA - 98}" width="110" height="98" fill="#8fb4c4"/>${[0, 1, 2].map((j) => `<path d="M${196 + i * 152} ${LINHA - 76 + j * 24} h110" stroke="#f1e6c8" stroke-width="3"/>`).join("")}`).join("")}
    <rect y="${LINHA + 26}" width="${W}" height="${H - LINHA - 26}" fill="#b2b0a4"/>
    <path d="M0 ${H - 58} H${W}" stroke="#fffdf6" stroke-width="7" stroke-dasharray="52 40" opacity=".85"/>
    <g transform="translate(930 ${LINHA + 12})"><rect x="-196" y="-104" width="206" height="98" rx="5" fill="#fffdf6"/><rect x="-196" y="-56" width="206" height="14" fill="#4fa3a0"/><path d="M8 -84 h58 l36 36 v42 h-94 z" fill="${p.acento}"/><path d="M18 -74 h36 l26 26 h-62 z" fill="#bfe6ef"/><circle cx="-150" cy="4" r="21" fill="#43505c"/><circle cx="-150" cy="4" r="9" fill="#9aa6b0"/><circle cx="-60" cy="4" r="21" fill="#43505c"/><circle cx="-60" cy="4" r="9" fill="#9aa6b0"/><circle cx="56" cy="4" r="21" fill="#43505c"/><circle cx="56" cy="4" r="9" fill="#9aa6b0"/></g>
    <g transform="translate(846 ${LINHA - 28})"><rect x="0" y="0" width="44" height="30" fill="#d9a877"/><rect x="46" y="8" width="34" height="22" fill="#c9966a"/><rect x="12" y="-28" width="36" height="28" fill="#e2b98a"/></g>
    ${arvore(1132, H - 20, 1.25, "#7f9a86", "#9fbaa6")}${capim("log", "#9ba58e", "#7e8872")}</g>`,

  EDU: (p) => `<g>
    <rect x="216" y="${LINHA - 150}" width="700" height="150" fill="#fff3d6"/>
    <path d="M200 ${LINHA - 148} L566 ${LINHA - 212} L932 ${LINHA - 148} V${LINHA - 164} L566 ${LINHA - 228} L200 ${LINHA - 164} Z" fill="#d9694f"/>
    <rect x="498" y="${LINHA - 272}" width="136" height="272" fill="#fbe9c2"/>
    <path d="M482 ${LINHA - 270} L566 ${LINHA - 342} L650 ${LINHA - 270} Z" fill="#b24f3a"/>
    <circle cx="566" cy="${LINHA - 228}" r="32" fill="#fffdf6" stroke="#b24f3a" stroke-width="6"/>
    <path d="M566 ${LINHA - 228} V${LINHA - 248} M566 ${LINHA - 228} l14 7" stroke="#43505c" stroke-width="5" stroke-linecap="round"/>
    ${janelas(254, LINHA - 122, 4, 1, 54, 48, 26, 0, "#bfe6ef", "#ffe9a8")}
    ${janelas(692, LINHA - 122, 4, 1, 54, 48, 26, 0, "#bfe6ef", "#ffe9a8")}
    <path d="M530 ${LINHA} V${LINHA - 72} Q566 ${LINHA - 104} 602 ${LINHA - 72} V${LINHA} Z" fill="#8a6a48"/>
    <path d="M1006 ${LINHA} V${LINHA - 206}" stroke="#8a9aa6" stroke-width="6"/><path d="M1006 ${LINHA - 206} h60 l-14 20 l14 20 h-60 z" fill="${p.acento}"/>
    <rect y="${LINHA + 40}" width="${W}" height="${H - LINHA - 40}" fill="#d2cba4"/>
    <path d="M520 ${LINHA + 40} L446 ${H} H686 L612 ${LINHA + 40} Z" fill="#e3d6a8" opacity=".8"/>
    ${arvore(104, LINHA + 40, 1.6, "#7fae6a", "#a8cf8e")}${arvore(1128, LINHA + 30, 1.2, "#8fbd78", "#b4d89c")}
    ${capim("edu", "#b9c47e", "#98a362")}</g>`,

  FIN: (p) => `<g>
    <rect x="276" y="${LINHA - 168}" width="576" height="168" fill="#fbf4e2"/>
    <path d="M254 ${LINHA - 166} L564 ${LINHA - 268} L874 ${LINHA - 166} Z" fill="#f1e6c8"/>
    <path d="M254 ${LINHA - 166} L564 ${LINHA - 268} L874 ${LINHA - 166} V${LINHA - 154} H254 Z" fill="none" stroke="${p.acento}" stroke-width="7" stroke-linejoin="round"/>
    <circle cx="564" cy="${LINHA - 212}" r="26" fill="${p.acento}"/><path d="M552 ${LINHA - 202} Q564 ${LINHA - 234} 578 ${LINHA - 224} Q572 ${LINHA - 200} 552 ${LINHA - 202} Z" fill="#fffdf6"/>
    ${[...Array(7)].map((_, i) => `<rect x="${308 + i * 82}" y="${LINHA - 144}" width="26" height="128" rx="5" fill="#fffdf6"/><path d="M${308 + i * 82} ${LINHA - 150} h26" stroke="#e3d6b4" stroke-width="6"/>`).join("")}
    <rect x="516" y="${LINHA - 86}" width="96" height="86" fill="${p.acento}"/><path d="M564 ${LINHA - 86} V${LINHA}" stroke="#fbf4e2" stroke-width="4"/>
    <rect x="256" y="${LINHA - 18}" width="616" height="12" fill="#e3d6b4"/><rect x="236" y="${LINHA - 6}" width="656" height="12" fill="#d7c9a3"/>
    <rect y="${LINHA + 40}" width="${W}" height="${H - LINHA - 40}" fill="#d0d6ba"/>
    ${arvore(136, LINHA + 36, 1.5, "#6f9e7c", "#95c4a2")}${arvore(1092, LINHA + 40, 1.5, "#7fae8a", "#a3cfae")}
    ${capim("fin", "#a9bf96", "#89a07a")}</g>`,

  TUR: (p) => `<g>
    <path d="M0 ${LINHA + 52} Q300 ${LINHA + 20} 600 ${LINHA + 62} T${W} ${LINHA + 36} V${H} H0 Z" fill="#7fc3d8"/>
    <path d="M0 ${LINHA + 92} Q300 ${LINHA + 60} 600 ${LINHA + 102} T${W} ${LINHA + 76} V${H} H0 Z" fill="#5fa8c4" opacity=".8"/>
    <g stroke="#fffdf6" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round">
      ${[...Array(9)].map((_, i) => { const r = rnd("onda" + i); return `<path d="M${(r() * W).toFixed(0)} ${(LINHA + 110 + r() * 110).toFixed(0)} q22 -9 44 0"/>`; }).join("")}</g>
    <rect x="640" y="${LINHA - 86}" width="300" height="86" fill="#f6e3b8"/>
    <path d="M608 ${LINHA - 84} L790 ${LINHA - 202} L972 ${LINHA - 84} Z" fill="#c9a064"/>
    <path d="M636 ${LINHA - 98} L790 ${LINHA - 190} L944 ${LINHA - 98}" stroke="#b58a50" stroke-width="6" fill="none"/>
    ${janelas(672, LINHA - 66, 2, 1, 46, 38, 36, 0, "#8fd0de", "#ffe9a8")}
    <rect x="776" y="${LINHA - 70}" width="40" height="70" fill="#8a6a48"/>
    ${janelas(858, LINHA - 66, 2, 1, 46, 38, 36, 0, "#8fd0de", "#ffe9a8")}
    <rect x="596" y="${LINHA}" width="388" height="14" fill="#b58a50"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M${626 + i * 86} ${LINHA + 14} V${LINHA + 62}" stroke="#8a6a48" stroke-width="9"/>`).join("")}
    <g transform="translate(276 ${LINHA + 96})"><path d="M-96 -10 Q0 32 96 -10 Q0 10 -96 -10 Z" fill="#b5653c"/><path d="M-96 -10 Q0 6 96 -10" stroke="#8a4a2a" stroke-width="5" fill="none"/>
      <g transform="translate(-14 -12)"><circle cx="0" cy="-26" r="8" fill="#e9b98f"/><path d="M-9 0 Q-9 -20 0 -20 Q9 -20 9 0 Z" fill="#e9745a"/></g>
      <path d="M4 -40 L44 16" stroke="#8a6a48" stroke-width="5" stroke-linecap="round"/></g>
    ${palmeira(470, LINHA + 16, 1.15, "#5fa868")}${palmeira(1096, LINHA + 30, 0.95, "#4f9a5c")}
    ${arvore(104, LINHA + 24, 1.5, "#4f9a7c", "#78bda0")}
    <g fill="none" stroke="#5a7a8c" stroke-width="4" opacity=".5" stroke-linecap="round"><path d="M150 108 q12 -14 24 0 q12 -14 24 0"/><path d="M1000 84 q10 -12 20 0 q10 -12 20 0"/></g></g>`,

  PUB: (p) => `<g>
    <rect x="240" y="${LINHA - 150}" width="700" height="150" fill="#fbf4e2"/>
    <rect x="226" y="${LINHA - 170}" width="728" height="22" fill="#e3d6b4"/>
    <path d="M460 ${LINHA - 170} Q590 ${LINHA - 318} 720 ${LINHA - 170} Z" fill="${p.acento}"/>
    <rect x="570" y="${LINHA - 306}" width="40" height="34" rx="4" fill="#fbf4e2"/>
    <path d="M590 ${LINHA - 306} V${LINHA - 362}" stroke="#8a9aa6" stroke-width="6"/>
    <path d="M590 ${LINHA - 362} h56 l-14 16 l14 16 h-56 z" fill="#5fa868"/><path d="M604 ${LINHA - 348} h14" stroke="#ffe9a8" stroke-width="8"/>
    ${[...Array(9)].map((_, i) => `<path d="M${268 + i * 76} ${LINHA} V${LINHA - 110} Q${296 + i * 76} ${LINHA - 150} ${324 + i * 76} ${LINHA - 110} V${LINHA} Z" fill="${i === 4 ? "#8a6a48" : "#bfe6ef"}" opacity="${i === 4 ? 1 : 0.9}"/>`).join("")}
    <rect x="226" y="${LINHA - 14}" width="728" height="14" fill="#d7c9a3"/>
    <rect y="${LINHA + 40}" width="${W}" height="${H - LINHA - 40}" fill="#d4d1bc"/>
    <g transform="translate(590 ${LINHA + 120})"><ellipse cx="0" cy="14" rx="112" ry="30" fill="#9fd9ea"/><ellipse cx="0" cy="14" rx="112" ry="30" fill="none" stroke="#d7c9a3" stroke-width="11"/>
      <path d="M0 8 V-48 M0 -48 q-34 9 -38 44 M0 -48 q34 9 38 44" stroke="#fffdf6" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="0" cy="-56" r="9" fill="#fffdf6"/></g>
    ${arvore(118, LINHA + 44, 1.5, "#8aa088", "#a9bfa6")}${arvore(1104, LINHA + 40, 1.5, "#7f9a7c", "#9fb89c")}
    ${capim("pub", "#aab294", "#8c957a")}</g>`,
};

// Cena de abertura: trilha subindo o morro, figura pequena a caminho
const FRENTE_ABERTURA = (p) => `<g>
  <path d="M560 ${H} Q600 ${LINHA + 60} 660 ${LINHA + 10} T760 ${LINHA - 56}" stroke="#e7dfae" stroke-width="54" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M560 ${H} Q600 ${LINHA + 60} 660 ${LINHA + 10} T760 ${LINHA - 56}" stroke="#d6cd93" stroke-width="40" fill="none" stroke-linecap="round" opacity=".6"/>
  <g transform="translate(652 ${LINHA + 24}) scale(1.35)">
    <path d="M-10 0 Q-10 -24 0 -24 Q10 -24 10 0 Z" fill="${p.acento}"/>
    <circle cx="0" cy="-31" r="9" fill="#e9b98f"/><path d="M-9 -34 Q0 -44 9 -34 Q0 -39 -9 -34 Z" fill="#3d2a1f"/>
    <path d="M9 -18 L26 4" stroke="#8a6a48" stroke-width="4" stroke-linecap="round"/>
    <rect x="-16" y="-20" width="12" height="16" rx="3" fill="#b5653c"/></g>
  ${arvore(236, LINHA + 54, 1.7, "#6f9e62", "#9fd08d")}${arvore(1030, LINHA + 30, 1.35, "#7fae6a", "#a8cf8e")}
  ${arvore(880, LINHA + 10, 0.95, "#89b878", "#b0d89c")}
  ${capim("abertura", "#b9c97e", "#96a862")}</g>`;

// ---------------------------------------------------------------------------
// Montagem
// ---------------------------------------------------------------------------
function montar(p, seed, frente, { particulasN = 16, classe = "cena3" } = {}) {
  return `<svg class="${classe}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" focusable="false">
    ${fundo(p, seed)}
    ${frente(p)}
    ${particulas(seed, p.luz, particulasN)}
    <rect width="${W}" height="${H}" fill="url(#et3-vinheta-${hash(seed) % 9999})" opacity="0"/>
    <defs><radialGradient id="et3-vinheta-${hash(seed) % 9999}" cx=".5" cy=".46" r=".78">
      <stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3a2f22" stop-opacity=".3"/>
    </radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#et3-vinheta-${hash(seed) % 9999})"/>
    <rect width="${W}" height="${H}" filter="url(#et3-grao)" opacity=".055" style="mix-blend-mode:multiply"/>
  </svg>`;
}

/** Cena de tela cheia do ramo (1200 x 560). */
export function cenaRamo(codigo) {
  prepararArte();
  const p = PALETA[codigo];
  const f = FRENTE[codigo];
  if (!p || !f) return "";
  return montar(p, "et3" + codigo, f, { particulasN: codigo === "TUR" || codigo === "EDU" ? 22 : 16 });
}

/** Cena das telas de abertura (aviso, entrada, confirmação). */
export function cenaAbertura() {
  prepararArte();
  return montar(PALETA_ABERTURA, "et3abertura", FRENTE_ABERTURA, { particulasN: 20 });
}

/** Faixa estreita para o cabeçalho enquanto o aluno responde (mesma paleta, sem prédios). */
export function faixaRamo(codigo) {
  prepararArte();
  const p = PALETA[codigo] || PALETA_ABERTURA;
  const seed = "faixa" + codigo;
  const r = rnd(seed), sx = 200 + r() * 800;
  const g = `et3-fx-${hash(seed) % 99999}`;
  return `<svg class="faixa3" viewBox="0 0 ${W} 150" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" focusable="false">
    <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.ceu[0]}"/><stop offset="1" stop-color="${p.ceu[2]}"/></linearGradient></defs>
    <rect width="${W}" height="150" fill="url(#${g})"/>
    <circle cx="${sx.toFixed(0)}" cy="46" r="56" fill="${p.sol}" opacity=".32" filter="url(#et3-suave)"/>
    <circle cx="${sx.toFixed(0)}" cy="46" r="22" fill="${p.sol}" opacity=".85"/>
    ${nuvensAnimadas(p, seed)}
    <g filter="url(#et3-aq)">
      <path d="M0 108 Q200 70 400 100 T800 86 T${W} 104 V150 H0 Z" fill="${p.morros[1]}" opacity=".9"/>
      <path d="M0 126 Q260 100 520 122 T${W} 114 V150 H0 Z" fill="${p.morros[2]}"/></g>
    <rect width="${W}" height="150" filter="url(#et3-grao)" opacity=".05" style="mix-blend-mode:multiply"/>
  </svg>`;
}

export const horaDoRamo = (codigo) => (PALETA[codigo] || {}).hora || "";
export const acentoDoRamo = (codigo) => (PALETA[codigo] || PALETA_ABERTURA).acento;
