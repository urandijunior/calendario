// ui.js — interface da dinâmica Mercado de Talentos: Liderança. A lógica vive em app.js (window.LID).
import { montarDebriefing } from "./debriefing.js";
import * as H from "./historico.js";

function waitFor() {
  return new Promise((resolve) => {
    if (window.LID) return resolve(window.LID);
    const iv = setInterval(() => { if (window.LID) { clearInterval(iv); resolve(window.LID); } }, 30);
  });
}
const L = await waitFor();
const { D, db, onSnapshot, doc, collection, query, where, state } = L;

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const F = (cardId) => D.FUNCIONARIOS[D.funcId(cardId)];
const fmtNota = (n) => n.toFixed(1).replace(".", ",");

let sala = null; // snapshot da sala

// ---------------------------------------------------------------------------
// Navegação, toast, cronômetro
// ---------------------------------------------------------------------------
function show(id) {
  $$(".screen").forEach((el) => el.classList.remove("active"));
  $(`#${id}`).classList.add("active");
  $("#app").classList.toggle("largo", id === "screen-prof-dashboard");
  window.scrollTo(0, 0);
}
$$("[data-back]").forEach((b) => b.addEventListener("click", () => { L.clearListeners(); show(b.dataset.back); }));
// PIN do professor (vale até fechar o navegador)
const PIN_PROFESSOR = "1919";
const PIN_KEY = "lid-prof-pin-ok";
const pinOk = () => { try { return sessionStorage.getItem(PIN_KEY) === "1"; } catch (e) { return false; } };
let depoisDoPin = null;
function exigirPin(acao) {
  if (pinOk()) return acao();
  depoisDoPin = acao;
  $("#input-pin").value = ""; $("#erro-pin").textContent = "";
  show("screen-prof-pin");
  setTimeout(() => $("#input-pin").focus(), 50);
}
function conferirPin() {
  if ($("#input-pin").value.trim() !== PIN_PROFESSOR) { $("#erro-pin").textContent = "PIN incorreto."; return; }
  try { sessionStorage.setItem(PIN_KEY, "1"); } catch (e) {}
  const acao = depoisDoPin; depoisDoPin = null;
  (acao || (() => show("screen-prof-criar")))();
}
$("#btn-pin").addEventListener("click", conferirPin);
$("#input-pin").addEventListener("keydown", (e) => { if (e.key === "Enter") conferirPin(); });
$("#btn-sou-professor").addEventListener("click", () => exigirPin(() => show("screen-prof-criar")));
$("#btn-sou-aluno").addEventListener("click", () => show("screen-aluno-entrar"));

let toastTimer = null;
function toast(msg, ms = 3500) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), ms);
}

function sair() {
  L.clearListeners(); L.limparSessao();
  sala = null; state.roomCode = null; state.role = null;
  $("#topbar-timer").classList.add("hidden"); $("#retomar-box").classList.add("hidden");
  show("screen-home");
}
$("#btn-sair-prof").addEventListener("click", sair);
$("#btn-sair-aluno").addEventListener("click", sair);

let encerrandoPorTempo = false;
setInterval(() => {
  const el = $("#topbar-timer");
  const r = sala;
  if (r && state.roomCode && r.status !== "lobby") {
    el.classList.remove("hidden", "urgente");
    let txt;
    if (r.status === "finalizado") txt = "encerrado";
    else if (!r.fimEm) txt = "sem limite";
    else {
      const resta = Math.max(0, Math.round((r.fimEm - L.agora()) / 1000));
      txt = `${String(Math.floor(resta / 60)).padStart(2, "0")}:${String(resta % 60).padStart(2, "0")}`;
      if (resta <= 60) el.classList.add("urgente");
      if (resta === 0 && state.role === "professor" && !encerrandoPorTempo && r.status === "jogando") {
        encerrandoPorTempo = true;
        L.encerrarNegociacao(state.roomCode).catch(() => {}).finally(() => (encerrandoPorTempo = false));
      }
    }
    el.querySelector("span").textContent = txt;
  } else el.classList.add("hidden");
  if (state.role === "aluno") tickAluno();
}, 1000);

// ---------------------------------------------------------------------------
// Componentes
// ---------------------------------------------------------------------------
function ramosGrid(container, selecionado, onPick) {
  container.innerHTML = D.RAMOS.map((r) => `
    <button type="button" class="ramo-opcao${r.codigo === selecionado ? " sel" : ""}" data-ramo="${r.codigo}">
      <span class="ramo-icone">${r.icone}</span><b>${esc(r.nome)}</b><small>${esc(r.empresa)}</small>
    </button>`).join("");
  container.querySelectorAll(".ramo-opcao").forEach((b) => b.addEventListener("click", () => {
    container.querySelectorAll(".ramo-opcao").forEach((x) => x.classList.toggle("sel", x === b));
    onPick(b.dataset.ramo);
  }));
}

function cartaEl(cardId, { selecionavel = false, onClick = null, nova = false, repetida = false, compacta = false } = {}) {
  const p = F(cardId);
  const el = document.createElement("div");
  if (!p) return el;
  el.className = "carta" + (selecionavel ? " selecionavel" : "") + (nova ? " nova" : "") + (repetida ? " repetida" : "") + (compacta ? " compacta" : "");
  el.innerHTML = `
    <div class="carta-topo"><b>${esc(p.nome)}</b><span>${esc(p.cargo)}</span></div>
    <div class="carta-corpo">
      <div><span class="tag tag-H">Habilidade</span> ${esc(p.hab)}</div>
      <div><span class="tag tag-C">Competência</span> ${esc(p.comp)}</div>
      ${compacta ? "" : `<div class="carta-lidera"><span class="tag tag-L">Quando lidera</span> ${esc(p.lidera)}</div>`}
    </div>
    ${repetida ? `<div class="carta-repetida">🔁 repetida: ofereça em troca</div>` : ""}`;
  if (onClick) el.addEventListener("click", () => onClick(cardId, el));
  return el;
}

function renderMao(container, cardIds, opts = {}) {
  container.innerHTML = "";
  if (!cardIds.length) { container.innerHTML = `<p class="vazio">Nenhum funcionário.</p>`; return; }
  const vistas = new Set();
  [...cardIds].sort().forEach((id) => {
    const f = D.funcId(id);
    const repetida = opts.marcarRepetidas && vistas.has(f);
    vistas.add(f);
    container.appendChild(cartaEl(id, { ...opts, nova: opts.novas?.has(id), repetida }));
  });
}

function quadroNiveis(alunosArr) {
  const c = D.classificar(alunosArr);
  const cont = {};
  Object.values(c).forEach((x) => { if (!x.pendente) cont[x.nivel.id] = (cont[x.nivel.id] || 0) + 1; });
  return D.NIVEIS.map((n) => `<div class="nivel nivel-${n.id}"><span>${n.emoji} ${n.nome}</span><b>${fmtNota(n.nota)}</b>
      <small>${n.vagas === Infinity ? `${cont[n.id] || 0} alunos` : `${cont[n.id] || 0} de ${n.vagas} vagas`}</small></div>`).join("");
}

const FASE_TXT = { espera: "aguardando", negociando: "🔄 negociando", lider: "🧭 escolhendo o líder", concluido: "✅ concluiu" };

// ---------------------------------------------------------------------------
// PROFESSOR
// ---------------------------------------------------------------------------
$("#btn-criar-sala").addEventListener("click", async () => {
  const nome = $("#input-nome-professor").value.trim();
  const turma = $("#input-turma").value.trim();
  $("#erro-criar-sala").textContent = "";
  if (!turma) { $("#erro-criar-sala").textContent = "Informe a turma: é ela que identifica a sala no histórico."; return; }
  try { abrirDashboard(await L.criarSala(nome, turma), nome); }
  catch (e) { $("#erro-criar-sala").textContent = e.message || "Erro ao criar sala."; }
});

function abrirDashboard(codigo, nome) {
  state.role = "professor"; state.roomCode = codigo; state.nome = nome;
  L.salvarSessao({ role: "professor", roomCode: codigo, nome });
  $("#dash-codigo").textContent = codigo;
  show("screen-prof-dashboard");
  iniciarDashboard(codigo);
}

let proxCache = {}; // uid → proximidade atual (calculada pelas cartas, só no painel)
let cardsUnsub = null;
let alunosProf = {};
let tradesProf = [];
let debriefTimer = null;
function agendarDebriefing() {
  if ($("#tab-debriefing").classList.contains("hidden")) return;
  clearTimeout(debriefTimer);
  debriefTimer = setTimeout(renderDebriefing, 1200);
}
function renderDebriefing() {
  $("#debriefing-conteudo").innerHTML = montarDebriefing({ room: sala, alunos: alunosProf, trades: tradesProf, D });
}
$$(".aba").forEach((b) => b.addEventListener("click", () => {
  $$(".aba").forEach((x) => x.classList.toggle("ativa", x === b));
  $("#tab-aovivo").classList.toggle("hidden", b.dataset.aba !== "tab-aovivo");
  $("#tab-debriefing").classList.toggle("hidden", b.dataset.aba !== "tab-debriefing");
  if (b.dataset.aba === "tab-debriefing") renderDebriefing();
}));
const STATUS_TXT = { lobby: "aguardando", jogando: "em jogo", finalizado: "negociação encerrada" };

function iniciarDashboard(codigo) {
  L.clearListeners();
  alunosProf = {}; tradesProf = []; ultimoSalvo = ""; statusVisto = null;
  L.sincronizarRelogio(doc(db, "rooms", codigo));
  state.unsubs.push(onSnapshot(doc(db, "rooms", codigo), (snap) => {
    const r = snap.data(); if (!r) return;
    sala = r;
    if (statusVisto && statusVisto !== r.status) agendarSalvamento(true); // salva na hora ao encerrar
    statusVisto = r.status;
    $("#dash-turma").textContent = r.turma || "";
    const salvoMs = r.resultado?.salvoMs;
    $("#dash-salvo").textContent = r.status === "lobby" ? "" : salvoMs ? `💾 resultado salvo às ${new Date(salvoMs).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "💾 aguardando o primeiro salvamento";
    $("#dash-status").textContent = STATUS_TXT[r.status] + (r.resultadoPublicado ? " · resultado publicado" : "");
    $("#dash-controles-lobby").classList.toggle("hidden", r.status !== "lobby");
    $("#dash-controles-jogo").classList.toggle("hidden", r.status === "lobby");
    $("#dash-dica-painel").classList.toggle("hidden", r.status !== "jogando");
    $("#btn-mais-tempo").classList.toggle("hidden", r.status !== "jogando" || !r.fimEm);
    $("#btn-encerrar-jogo").classList.toggle("hidden", r.status !== "jogando");
    $("#btn-publicar").classList.toggle("hidden", r.status !== "finalizado");
    $("#dash-titulo-rodada").textContent = r.status === "jogando" ? "Rodada em andamento" : "Negociação encerrada";
    $("#btn-publicar").textContent = r.resultadoPublicado ? "Ocultar resultado da turma" : "Publicar resultado para a turma";
    renderListaProf(); agendarDebriefing();
    if (!$("#gabarito-box").classList.contains("hidden")) renderGabarito();
  }));
  state.unsubs.push(onSnapshot(collection(db, "rooms", codigo, "students"), (snap) => {
    alunosProf = {};
    snap.forEach((d) => (alunosProf[d.id] = { uid: d.id, ...d.data() }));
    renderListaProf(); agendarDebriefing(); agendarSalvamento();
  }));
  state.unsubs.push(onSnapshot(collection(db, "rooms", codigo, "trades"), (snap) => {
    tradesProf = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    $("#dash-trocas").textContent = tradesProf.filter((t) => t.status === "aceita").length;
    agendarDebriefing();
  }, () => ($("#dash-trocas").textContent = "—")));
  observarCartasProf(codigo);
}

// Salvamento automático: com o painel aberto, a foto do resultado é regravada na sala
// alguns segundos depois de cada mudança dos alunos (e na hora de encerrar e publicar).
let salvarTimer = null, ultimoSalvo = "", statusVisto = null;
function agendarSalvamento(imediato = false) {
  if (!sala || sala.status === "lobby" || !state.roomCode || state.role !== "professor") return;
  clearTimeout(salvarTimer);
  salvarTimer = setTimeout(salvarAgora, imediato ? 0 : 4000);
}
async function salvarAgora() {
  const arr = Object.values(alunosProf);
  if (!arr.length) return;
  const res = H.montarResultado(arr, D);
  const chave = JSON.stringify(res.alunos);
  if (chave === ultimoSalvo) return;
  try { await L.salvarResultado(state.roomCode, res); ultimoSalvo = chave; }
  catch (e) { $("#dash-salvo").textContent = "⚠️ não foi possível salvar o resultado agora; nova tentativa em instantes"; setTimeout(() => agendarSalvamento(), 10000); }
}

function linhasNotas() {
  const arr = Object.values(alunosProf);
  const c = D.classificar(arr);
  return arr.map((a) => ({ a, c: c[a.uid] })).sort((x, y) =>
    (x.c.pos ?? 999) - (y.c.pos ?? 999) || (y.a.equipeFinal ?? proxCache[y.a.uid] ?? 0) - (x.a.equipeFinal ?? proxCache[x.a.uid] ?? 0) || x.a.nome.localeCompare(y.a.nome));
}

function renderListaProf() {
  const arr = Object.values(alunosProf);
  $("#dash-total-alunos").textContent = arr.length;
  const box = $("#dash-lista-alunos");
  if (!sala || sala.status === "lobby") {
    $("#dash-titulo-lista").textContent = "Alunos na sala";
    $("#dash-niveis").innerHTML = "";
    const cont = {};
    arr.forEach((a) => (cont[a.ramo] = (cont[a.ramo] || 0) + 1));
    $("#dash-ramos-lobby").innerHTML = D.RAMOS.map((r) => `<span class="ramo-chip">${r.icone} ${esc(r.nome)} <b>${cont[r.codigo] || 0}</b></span>`).join("");
    box.innerHTML = arr.length ? `<div class="lista-alunos">${arr.map((a) => `<div class="aluno-item"><span>${esc(a.nome)}</span><span class="hint">${D.RAMO[a.ramo]?.icone || ""} ${esc(D.RAMO[a.ramo]?.nome || "sem ramo")}</span></div>`).join("")}</div>` : `<p class="vazio">Ninguém entrou ainda.</p>`;
    return;
  }
  const n = { negociando: 0, lider: 0, concluido: 0 };
  arr.forEach((a) => (n[a.fase] = (n[a.fase] || 0) + 1));
  const tot = arr.length || 1;
  $("#n-neg").textContent = n.negociando; $("#n-lid").textContent = n.lider; $("#n-ok").textContent = n.concluido;
  $("#bar-neg").style.width = `${(n.negociando / tot) * 100}%`;
  $("#bar-lid").style.width = `${(n.lider / tot) * 100}%`;
  $("#bar-ok").style.width = `${(n.concluido / tot) * 100}%`;
  $("#dash-titulo-lista").textContent = "🏁 Classificação ao vivo";
  $("#dash-niveis").innerHTML = quadroNiveis(arr);
  box.innerHTML = `<table class="tabela"><thead><tr><th>#</th><th>Aluno</th><th>Ramo</th><th>Equipe</th><th>Trocas</th><th>Fase</th><th>Questionário</th><th>Líder</th><th>Nível</th><th>Nota</th></tr></thead><tbody>
    ${linhasNotas().map(({ a, c }) => {
      const r = D.RAMO[a.ramo];
      const eq = a.equipeFinal ?? proxCache[a.uid];
      return `<tr class="${c.pendente ? "pendente" : ""}">
        <td>${c.pos ?? "—"}</td><td>${esc(a.nome)}</td><td>${r?.icone || ""} ${esc(r?.nome || "")}</td>
        <td>${eq ?? "?"}/6</td><td>${a.trocas || 0}/${D.MAX_TROCAS}</td><td>${FASE_TXT[a.fase] || a.fase}</td>
        <td>${a.fase === "concluido" ? `${a.acertos}/6` : "—"}</td>
        <td>${a.fase === "concluido" ? (a.liderCerto ? "✅ " : "❌ ") + esc(D.FUNCIONARIOS[a.liderEscolhido]?.nome || "") : "—"}</td>
        <td>${c.pendente ? "<small>em andamento</small>" : `${c.nivel.emoji} ${c.nivel.nome}`}</td><td><b>${fmtNota(c.nivel.nota)}</b></td></tr>`;
    }).join("")}</tbody></table>`;
}

// Proximidade dos alunos que ainda negociam (lê as cartas só quando o painel está aberto)
function observarCartasProf(codigo) {
  cardsUnsub?.();
  cardsUnsub = onSnapshot(collection(db, "rooms", codigo, "cards"), (snap) => {
    const maos = {};
    snap.forEach((d) => (maos[d.data().donoUid] ||= []).push(d.id));
    proxCache = Object.fromEntries(Object.entries(maos).map(([u, ids]) => [u, D.proximidade(alunosProf[u]?.ramo, ids)]));
    renderListaProf();
  }, () => {});
  state.unsubs.push(() => { cardsUnsub?.(); cardsUnsub = null; });
}

$("#btn-iniciar-jogo").addEventListener("click", async (ev) => {
  $("#erro-dashboard").textContent = "";
  const semRamo = Object.values(alunosProf).filter((a) => !D.RAMO[a.ramo]).length;
  if (semRamo) { $("#erro-dashboard").textContent = `${semRamo} aluno(s) sem ramo escolhido.`; return; }
  ev.target.disabled = true;
  try { await L.iniciarJogo(state.roomCode, $("#input-duracao").value); }
  catch (e) { $("#erro-dashboard").textContent = e.message || "Erro ao iniciar."; }
  finally { ev.target.disabled = false; }
});
$("#btn-encerrar-jogo").addEventListener("click", async () => {
  if (!confirm("Encerrar a negociação? As trocas ficam travadas e quem ainda negocia vai direto para a escolha do líder.")) return;
  await L.encerrarNegociacao(state.roomCode);
});
$("#btn-publicar").addEventListener("click", async () => { await salvarAgora(); await L.publicarResultado(state.roomCode, !sala?.resultadoPublicado); });
$("#btn-mais-tempo").addEventListener("click", () => L.adicionarTempo(state.roomCode, 2, sala?.fimEm));
async function enviarDica(t) { if (!t) return; await L.enviarDica(state.roomCode, t); toast("Dica enviada para a turma."); }
$("#btn-enviar-dica").addEventListener("click", () => enviarDica($("#input-dica").value.trim()));
$$(".chip[data-dica]").forEach((b) => b.addEventListener("click", () => enviarDica(b.dataset.dica)));

$("#btn-csv").addEventListener("click", () => {
  const res = H.montarResultado(Object.values(alunosProf), D);
  H.baixar(`lideranca-${(sala?.turma || "").replace(/[^\w-]+/g, "_")}-${state.roomCode}.csv`, H.csvDe([{ sala: { ...sala, codigo: state.roomCode }, res }]));
});

function gabaritoRamoHTML(r, destaque = null) {
  const est = D.MATURIDADE[r.mat].estilo;
  return `<div class="gabarito-prof">
    <b>${r.icone} ${esc(r.nome)}</b> <span class="vazio">${esc(r.empresa)}</span>
    <p class="gab-linha">Maturidade <b>${D.MATURIDADE[r.mat].nome}</b> → estilo <b>${D.ESTILOS[est]}</b> · Kotter: <b>${r.kotter}. ${esc(D.KOTTER[r.kotter])}</b></p>
    <ul>${r.equipe.map((p) => `<li class="${p.id === r.liderId ? "gab-lider" : p.id === r.carismaId ? "gab-carisma" : ""}${destaque?.has?.(p.id) ? " gab-tinha" : ""}">
      ${p.id === r.liderId ? "👑 " : p.id === r.carismaId ? "🎭 " : "• "}<b>${esc(p.nome)}</b> · ${esc(p.cargo)} <small>(${esc(p.frente)})</small></li>`).join("")}</ul>
    <small>👑 líder certo · 🎭 armadilha do carisma (Drucker)</small>
  </div>`;
}
function renderGabarito() {
  const ativos = sala?.ramosAtivos || D.RAMOS.map((r) => r.codigo);
  $("#gabarito-box").innerHTML = D.RAMOS.filter((r) => ativos.includes(r.codigo)).map((r) => gabaritoRamoHTML(r)).join("");
}
$("#btn-toggle-gabarito").addEventListener("click", () => {
  const box = $("#gabarito-box");
  box.classList.toggle("hidden");
  if (!box.classList.contains("hidden")) renderGabarito();
});

// ---------------------------------------------------------------------------
// ALUNO: entrada
// ---------------------------------------------------------------------------
let ramoEscolhido = null;
ramosGrid($("#escolha-ramos"), null, (r) => (ramoEscolhido = r));

$("#btn-entrar-sala").addEventListener("click", async (ev) => {
  const codigo = $("#input-codigo-sala").value.trim().toUpperCase();
  const nome = $("#input-nome-aluno").value.trim();
  $("#erro-entrar-sala").textContent = "";
  if (!codigo || !nome) { $("#erro-entrar-sala").textContent = "Preencha o código e seu nome."; return; }
  if (!ramoEscolhido) { $("#erro-entrar-sala").textContent = "Escolha o ramo de atividade."; return; }
  ev.target.disabled = true;
  try { await entrarComoAluno(codigo, nome, ramoEscolhido); }
  catch (e) { $("#erro-entrar-sala").textContent = e.message || "Não foi possível entrar."; }
  finally { ev.target.disabled = false; }
});

async function entrarComoAluno(codigo, nome, ramo) {
  await L.entrarNaSala(codigo, nome, ramo);
  state.role = "aluno"; state.roomCode = codigo; state.nome = nome;
  L.salvarSessao({ role: "aluno", roomCode: codigo, nome, ramo });
  $("#aluno-codigo").textContent = codigo;
  $("#aluno-nome-pill").textContent = nome;
  show("screen-aluno-sala");
  iniciarSalaAluno(codigo);
}

// ---------------------------------------------------------------------------
// ALUNO: estado e listeners
// ---------------------------------------------------------------------------
let eu = null;          // meu doc de aluno
let colegas = {};       // uid → aluno
let cartas = {};        // cardId → donoUid
let minhaMao = [];
let maoCarregada = false;
let recebidas = [], enviadas = [];
let recebidasIds = new Set(), primeiraRecebida = true;
let ultimaDica = "";
let encerrandoMinha = false;
let proxAnterior = null;
let ultimaFaseTela = null;

const minhaProx = () => (eu ? D.proximidade(eu.ramo, minhaMao) : 0);
const negociando = () => eu?.fase === "negociando";
const trocasTravadas = () => !L.jogoAberto(sala) || !negociando() || (eu?.trocas || 0) >= D.MAX_TROCAS;

function iniciarSalaAluno(codigo) {
  L.clearListeners();
  eu = null; colegas = {}; cartas = {}; minhaMao = []; maoCarregada = false;
  recebidas = []; enviadas = []; recebidasIds = new Set(); primeiraRecebida = true; ultimaDica = ""; proxAnterior = null; ultimaFaseTela = null;
  quiz = null; quizNaTela = false;
  $("#aluno-dica").classList.add("hidden");

  state.unsubs.push(onSnapshot(doc(db, "rooms", codigo), (snap) => {
    const r = snap.data(); if (!r) return;
    sala = r;
    if (r.dica && r.dica !== ultimaDica) {
      ultimaDica = r.dica;
      $("#aluno-dica").textContent = "💡 Dica do(a) professor(a): " + r.dica;
      $("#aluno-dica").classList.remove("hidden");
      if (r.status === "jogando") toast("💡 Nova dica do(a) professor(a)!");
    }
    renderTudo();
  }));

  state.unsubs.push(onSnapshot(collection(db, "rooms", codigo, "students"), (snap) => {
    colegas = {};
    snap.forEach((d) => (colegas[d.id] = { uid: d.id, ...d.data() }));
    const antes = eu;
    eu = colegas[state.uid] || null;
    if (antes && eu && (eu.trocas || 0) > (antes.trocas || 0)) toast(`🔁 Troca concluída · restam ${D.MAX_TROCAS - eu.trocas} trocas.`);
    renderTudo();
  }));

  state.unsubs.push(onSnapshot(collection(db, "rooms", codigo, "cards"), (snap) => {
    cartas = {};
    snap.forEach((d) => (cartas[d.id] = d.data().donoUid));
    const nova = Object.keys(cartas).filter((id) => cartas[id] === state.uid);
    const novas = new Set(maoCarregada ? nova.filter((id) => !minhaMao.includes(id)) : []);
    minhaMao = nova;
    maoCarregada = nova.length > 0;
    if (eu && maoCarregada) {
      const p = minhaProx();
      if (proxAnterior != null && p !== proxAnterior) toast(p > proxAnterior ? `✅ Sua equipe subiu para ${p}/6!` : `⚠️ Sua equipe caiu para ${p}/6.`, 4500);
      proxAnterior = p;
    }
    renderMinhaMao(novas);
    renderTudo();
  }));

  state.unsubs.push(onSnapshot(query(collection(db, "rooms", codigo, "trades"), where("paraUid", "==", state.uid), where("status", "==", "pendente")), (snap) => {
    recebidas = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (recebidas.some((t) => !recebidasIds.has(t.id)) && !primeiraRecebida) {
      toast("📨 Você recebeu uma proposta de troca! (vale 1 minuto e meio)");
      try { navigator.vibrate?.(200); } catch (e) {}
    }
    primeiraRecebida = false;
    recebidasIds = new Set(recebidas.map((t) => t.id));
    renderPropostas(); limparObsoletas();
  }));

  state.unsubs.push(onSnapshot(query(collection(db, "rooms", codigo, "trades"), where("deUid", "==", state.uid), where("status", "==", "pendente")), (snap) => {
    enviadas = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderPropostas(); limparObsoletas();
  }));
}

// Avança de fase sozinho: equipe completa, trocas esgotadas ou tempo encerrado
function avaliarFase() {
  if (!eu || !sala || !negociando() || !maoCarregada || encerrandoMinha) return;
  let motivo = null;
  if (minhaProx() === D.TAM_EQUIPE) motivo = "completa";
  else if ((eu.trocas || 0) >= D.MAX_TROCAS) motivo = "trocas";
  else if (sala.status !== "lobby" && !L.jogoAberto(sala)) motivo = "tempo";
  if (!motivo) return;
  encerrandoMinha = true;
  L.encerrarMinhaNegociacao(state.roomCode, eu.ramo, minhaMao, motivo)
    .then(() => {
      const msg = { completa: "🎉 Equipe ideal fechada! Agora escolha o líder.", trocas: "Suas 8 trocas acabaram. Agora escolha o líder com a equipe que você tem.", tempo: "Tempo encerrado. Agora escolha o líder com a equipe que você tem." }[motivo];
      toast(msg, 5000);
    })
    .catch(() => {})
    .finally(() => (encerrandoMinha = false));
}

$("#btn-encerrar-minha").addEventListener("click", async () => {
  if (!eu || !negociando()) return;
  const p = minhaProx();
  if (!confirm(`Encerrar a negociação com ${p}/6 da equipe ideal? Não será possível voltar a trocar. Só alcança o topo quem fecha 6/6 com o líder certo.`)) return;
  await L.encerrarMinhaNegociacao(state.roomCode, eu.ramo, minhaMao, "voluntario");
});

// Propostas que perderam o sentido somem sozinhas; as minhas expiram em 1 minuto e meio
const jaLimpas = new Set();
function limparObsoletas() {
  if (!maoCarregada || !state.roomCode) return;
  const tenho = new Set(minhaMao);
  const travado = !negociando();
  enviadas.filter((t) => !jaLimpas.has(t.id)).forEach((t) => {
    if (travado || !tenho.has(t.cartaOferecidaId) || colegas[t.paraUid]?.fase !== "negociando") { jaLimpas.add(t.id); L.cancelarTroca(state.roomCode, t.id).catch(() => {}); }
    else if (L.expirou(t)) { jaLimpas.add(t.id); L.expirarTroca(state.roomCode, t.id).catch(() => {}); }
  });
  recebidas.filter((t) => !jaLimpas.has(t.id)).forEach((t) => {
    if (travado || !tenho.has(t.cartaPedidaId)) { jaLimpas.add(t.id); L.recusarTroca(state.roomCode, t.id).catch(() => {}); }
    else if (L.expirou(t)) { jaLimpas.add(t.id); L.expirarTroca(state.roomCode, t.id).catch(() => {}); }
  });
}

function tickAluno() {
  if (!sala || sala.status === "lobby") return;
  limparObsoletas();
  avaliarFase();
  $$("[data-expira]").forEach((el) => {
    const resta = Math.max(0, Math.ceil((Number(el.dataset.expira) - L.agora()) / 1000));
    el.textContent = `⏳ ${resta}s`;
    el.classList.toggle("urgente", resta <= 15);
  });
}

// ---------------------------------------------------------------------------
// ALUNO: renderização
// ---------------------------------------------------------------------------
function renderTudo() {
  if (!eu) return;
  const r = D.RAMO[eu.ramo];
  // cenário e ramo
  $("#cenario-titulo").textContent = "🎯 " + D.CENARIO.titulo;
  $("#cenario-texto").textContent = D.CENARIO.texto;
  $("#cenario-lembretes").innerHTML = D.CENARIO.lembretes.map((t) => `<li>${esc(t)}</li>`).join("");
  $("#ramo-icone").textContent = r.icone;
  $("#ramo-nome").textContent = r.nome;
  $("#ramo-empresa").textContent = r.empresa;
  $("#ramo-contexto").textContent = r.contexto;
  $("#ramo-frentes").innerHTML = r.equipe.map((p) => p.frente).sort().map((f) => `<li>${esc(f)}</li>`).join("");

  const lobby = !sala || sala.status === "lobby";
  $("#aluno-espera").classList.toggle("hidden", !lobby);
  $("#aluno-jogo").classList.toggle("hidden", lobby || !negociando());
  $("#aluno-lider").classList.toggle("hidden", eu.fase !== "lider");
  $("#aluno-resultado").classList.toggle("hidden", eu.fase !== "concluido");
  $("#aluno-ranking-painel").classList.toggle("hidden", lobby);
  $("#aluno-encerrado-banner").classList.toggle("hidden", lobby || L.jogoAberto(sala) || !negociando());
  // A missão fica aberta na espera e se recolhe uma vez quando o jogo começa (o aluno pode reabrir)
  const faseTela = lobby ? "lobby" : eu.fase;
  if (faseTela !== ultimaFaseTela) { $("#cenario-box").open = faseTela === "lobby"; ultimaFaseTela = faseTela; }

  if (lobby) renderEspera();
  if (negociando()) { renderPlacar(); renderMural(); renderPropostas(); }
  if (eu.fase === "lider" && !quizNaTela) { quizNaTela = true; renderQuiz(); }
  if (eu.fase === "concluido") renderResultado();
  if (!lobby) renderRanking();
  avaliarFase();
}

function renderEspera() {
  const uids = Object.keys(colegas);
  $("#espera-total").textContent = uids.length;
  $("#espera-lista-alunos").innerHTML = uids.map((u) => `<div class="aluno-item"><span>${esc(colegas[u].nome)}${u === state.uid ? " (você)" : ""}</span><span class="hint">${D.RAMO[colegas[u].ramo]?.icone || ""}</span></div>`).join("");
}
$("#btn-trocar-ramo").addEventListener("click", () => {
  const box = $("#trocar-ramo-box");
  box.classList.toggle("hidden");
  ramosGrid($("#trocar-ramos"), eu?.ramo, async (rc) => {
    try { await L.trocarRamo(state.roomCode, rc); proxAnterior = null; toast("Ramo alterado."); box.classList.add("hidden"); }
    catch (e) { toast(e.message); }
  });
});

function renderPlacar() {
  const p = minhaProx();
  const rest = Math.max(0, D.MAX_TROCAS - (eu.trocas || 0));
  $("#prox-num").textContent = p;
  $("#prox-barra").style.width = `${(p / 6) * 100}%`;
  $("#prox-barra").className = p >= 5 ? "alto" : p >= 3 ? "medio" : "baixo";
  $("#trocas-rest").textContent = rest;
  $("#trocas-fichas").innerHTML = Array.from({ length: D.MAX_TROCAS }, (_, i) => `<span class="${i < rest ? "on" : ""}"></span>`).join("");
  $("#btn-encerrar-minha").disabled = !negociando();
}

function renderMinhaMao(novas = new Set()) {
  renderMao($("#minha-mao"), minhaMao, { novas, marcarRepetidas: true });
}

const filtroMural = () => ($("#filtro-mural").value || "").trim().toLowerCase();
function renderMural() {
  const box = $("#mural");
  const f = filtroMural();
  const disp = Object.entries(cartas)
    .filter(([, dono]) => dono !== state.uid && colegas[dono]?.fase === "negociando" && (colegas[dono]?.trocas || 0) < D.MAX_TROCAS)
    .map(([id, dono]) => ({ id, dono, p: F(id) }))
    .filter((x) => x.p && (!f || `${x.p.nome} ${x.p.cargo} ${x.p.hab} ${x.p.comp} ${colegas[x.dono].nome}`.toLowerCase().includes(f)))
    .sort((a, b) => a.p.nome.localeCompare(b.p.nome) || colegas[a.dono].nome.localeCompare(colegas[b.dono].nome));
  $("#mural-resumo").textContent = `${disp.length} disponíveis`;
  const travado = trocasTravadas();
  box.innerHTML = disp.length ? "" : `<p class="vazio">${f ? "Nada encontrado." : "Nenhum funcionário disponível."}</p>`;
  disp.slice(0, 120).forEach((x) => {
    const row = document.createElement("div");
    row.className = "mural-item";
    row.innerHTML = `<div><b>${esc(x.p.nome)}</b> · ${esc(x.p.cargo)}<br /><small><span class="tag tag-H">H</span> ${esc(x.p.hab)}</small><br /><small class="mural-dono">com ${esc(colegas[x.dono].nome)} · ${D.MAX_TROCAS - (colegas[x.dono].trocas || 0)} trocas restantes</small></div>
      <button class="btn-secondary btn-pequeno" ${travado ? "disabled" : ""}>Pedir</button>`;
    row.querySelector("button").addEventListener("click", () => abrirModal(x.dono, x.id));
    box.appendChild(row);
  });
  // recados
  const recados = Object.values(colegas).filter((a) => a.uid !== state.uid && a.recado && a.fase === "negociando");
  $("#mural-recados").innerHTML = recados.map((a) => `<div class="recado"><b>${esc(a.nome)}:</b> ${esc(a.recado)}</div>`).join("");
}
$("#filtro-mural").addEventListener("input", renderMural);
$("#btn-recado").addEventListener("click", async () => {
  try { await L.salvarRecado(state.roomCode, $("#input-recado").value.trim()); toast("Recado publicado no mural."); }
  catch (e) { toast("Não foi possível publicar o recado."); }
});

function expiraEm(t) { return (L.ms(t.criadoEm) ?? t.criadoMs ?? L.agora()) + D.VALIDADE_PROPOSTA_MS; }

function renderPropostas() {
  if (!negociando()) return;
  const vivas = recebidas.filter((t) => !L.expirou(t));
  const badge = $("#badge-recebidas");
  badge.textContent = vivas.length;
  badge.classList.toggle("hidden", !vivas.length);
  const travado = trocasTravadas();
  const boxR = $("#trocas-recebidas");
  boxR.innerHTML = vivas.length ? "" : `<p class="vazio">Nenhuma proposta recebida.</p>`;
  vivas.forEach((t) => {
    const of = F(t.cartaOferecidaId), pe = F(t.cartaPedidaId);
    const el = document.createElement("div");
    el.className = "troca-item";
    el.innerHTML = `
      <div class="troca-topo"><b>${esc(t.deNome)}</b><span class="expira" data-expira="${expiraEm(t)}"></span></div>
      <div>oferece: <b>${esc(of?.nome)}</b> · ${esc(of?.cargo)}</div>
      <div>e pede o(a) seu(sua): <b>${esc(pe?.nome)}</b> · ${esc(pe?.cargo)}</div>
      ${t.argumento ? `<div class="argumento">💬 “${esc(t.argumento)}”</div>` : ""}
      <div class="troca-acoes">
        <button class="btn-primary" data-a ${travado ? "disabled" : ""}>Aceitar (gasta 1 troca)</button>
        <button class="btn-secondary" data-r>Recusar</button>
      </div>`;
    el.querySelector("[data-a]").addEventListener("click", async (ev) => {
      ev.target.disabled = true;
      try { await L.aceitarTroca(state.roomCode, t.id); }
      catch (e) { toast(e.message); }
    });
    el.querySelector("[data-r]").addEventListener("click", () => L.recusarTroca(state.roomCode, t.id));
    boxR.appendChild(el);
  });
  const boxE = $("#trocas-enviadas");
  const vivasE = enviadas.filter((t) => !L.expirou(t));
  boxE.innerHTML = vivasE.length ? "" : `<p class="vazio">Nenhuma proposta enviada.</p>`;
  vivasE.forEach((t) => {
    const of = F(t.cartaOferecidaId), pe = F(t.cartaPedidaId);
    const el = document.createElement("div");
    el.className = "troca-item";
    el.innerHTML = `
      <div class="troca-topo">Para <b>${esc(t.paraNome)}</b><span class="expira" data-expira="${expiraEm(t)}"></span></div>
      <div>você oferece <b>${esc(of?.nome)}</b> e pede <b>${esc(pe?.nome)}</b></div>
      <div class="troca-acoes"><button class="btn-secondary" data-c>Cancelar</button></div>`;
    el.querySelector("[data-c]").addEventListener("click", () => L.cancelarTroca(state.roomCode, t.id));
    boxE.appendChild(el);
  });
  tickAluno();
}

function renderRanking() {
  const arr = Object.values(colegas);
  $("#aluno-niveis").innerHTML = quadroNiveis(arr);
  const c = D.classificar(arr);
  const concl = arr.filter((a) => !c[a.uid].pendente).sort((a, b) => c[a.uid].pos - c[b.uid].pos);
  const andamento = arr.filter((a) => c[a.uid].pendente).sort((a, b) => (b.trocas || 0) - (a.trocas || 0));
  const linha = (a) => {
    const x = c[a.uid];
    const meu = a.uid === state.uid;
    return `<div class="aluno-item${meu ? " eu" : ""}${x.pendente ? "" : " completo"}">
      <span>${x.pos ? `${x.pos}º` : "—"} ${esc(a.nome)}${meu ? " (você)" : ""}</span>
      <span class="status-ok">${x.pendente ? `${FASE_TXT[a.fase] || ""} · ${a.trocas || 0} trocas` : `${x.nivel.emoji} ${x.nivel.nome} · ${a.trocas || 0} trocas`}</span></div>`;
  };
  $("#aluno-ranking").innerHTML = concl.map(linha).join("") + andamento.map(linha).join("");
}

// ---------------------------------------------------------------------------
// Modal de troca
// ---------------------------------------------------------------------------
let mColega = null, mOferta = null, mPedida = null;
function selecionar(sel, el) { $$(`${sel} .carta`).forEach((c) => c.classList.remove("selecionada")); el.classList.add("selecionada"); }
function abrirModal(colegaUid, cartaPedida = null) {
  if (trocasTravadas()) { toast("Suas trocas estão travadas."); return; }
  mColega = colegaUid; mOferta = null; mPedida = cartaPedida;
  const c = colegas[colegaUid];
  $("#modal-colega-nome").textContent = c.nome;
  $("#modal-colega-info").textContent = `${D.MAX_TROCAS - (c.trocas || 0)} trocas restantes${c.recado ? ` · recado: “${c.recado}”` : ""}`;
  $("#erro-modal-troca").textContent = ""; $("#input-argumento").value = "";
  const deles = Object.keys(cartas).filter((id) => cartas[id] === colegaUid);
  renderMao($("#modal-mao-colega"), deles, { selecionavel: true, onClick: (id, el) => { selecionar("#modal-mao-colega", el); mPedida = id; atualizarConfirmar(); } });
  if (cartaPedida) $$("#modal-mao-colega .carta").forEach((el, i) => { if ([...deles].sort()[i] === cartaPedida) el.classList.add("selecionada"); });
  renderMao($("#modal-mao-propria"), minhaMao, { selecionavel: true, marcarRepetidas: true, onClick: (id, el) => { selecionar("#modal-mao-propria", el); mOferta = id; atualizarConfirmar(); } });
  atualizarConfirmar();
  $("#modal-troca").classList.remove("hidden");
}
function atualizarConfirmar() { $("#btn-confirmar-troca").disabled = !(mOferta && mPedida); }
$("#btn-confirmar-troca").addEventListener("click", async (ev) => {
  ev.target.disabled = true;
  try {
    await L.proporTroca(state.roomCode, { uid: mColega, nome: colegas[mColega]?.nome || "" }, mOferta, mPedida, $("#input-argumento").value.trim(), enviadas.filter((t) => !L.expirou(t)).length);
    $("#modal-troca").classList.add("hidden");
    toast("Proposta enviada! Ela vale por 1 minuto e meio.");
  } catch (e) { $("#erro-modal-troca").textContent = e.message || "Erro ao propor troca."; ev.target.disabled = false; }
});
$("#modal-fechar").addEventListener("click", () => $("#modal-troca").classList.add("hidden"));
$("#modal-troca").addEventListener("click", (e) => { if (e.target.id === "modal-troca") $("#modal-troca").classList.add("hidden"); });

// ---------------------------------------------------------------------------
// Questionário do líder
// ---------------------------------------------------------------------------
let quiz = null; // { qs, i, resp, lider, just }
let quizNaTela = false; // evita redesenhar o questionário a cada atualização da sala
function hash(s) { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
function ordenarSemente(arr, semente) {
  return arr.map((x, i) => ({ x, k: hash(semente + i + (x.v || "")) })).sort((a, b) => a.k - b.k).map((o) => o.x);
}
const QUIZ_KEY = () => `lid-quiz-${state.roomCode}-${state.uid}`;
function salvarRascunho() { try { localStorage.setItem(QUIZ_KEY(), JSON.stringify({ i: quiz.i, resp: quiz.resp, lider: quiz.lider, just: quiz.just })); } catch (e) {} }

function iniciarQuiz() {
  const mao = eu.maoFinal || minhaMao.map(D.funcId);
  const qs = D.montarQuestionario(eu.ramo, mao).map((q) => ({
    ...q, opcoes: q.pessoas ? [...ordenarSemente(q.opcoes.filter((o) => o.v !== D.NINGUEM), state.uid + q.id), q.opcoes.find((o) => o.v === D.NINGUEM)] : (q.id === "q6" ? ordenarSemente(q.opcoes, state.uid + q.id) : q.opcoes),
  }));
  let rasc = null;
  try { rasc = JSON.parse(localStorage.getItem(QUIZ_KEY()) || "null"); } catch (e) {}
  quiz = { qs, mao: [...new Set(mao)], i: rasc?.i || 0, resp: rasc?.resp || {}, lider: rasc?.lider || null, just: rasc?.just || "" };
}

function renderQuiz() {
  if (!quiz) iniciarQuiz();
  const total = quiz.qs.length + 1;
  const motivo = { completa: "Você fechou a equipe ideal (6/6).", trocas: `Suas trocas acabaram com ${eu.equipeFinal}/6 da equipe ideal.`, tempo: `O tempo acabou com ${eu.equipeFinal}/6 da equipe ideal.`, voluntario: `Você encerrou com ${eu.equipeFinal}/6 da equipe ideal.` }[eu.motivoFim] || "";
  $("#lider-intro").textContent = `${motivo} Responda às ${quiz.qs.length} questões: elas cruzam a teoria com o cenário e com a sua equipe e levam à escolha do líder.`;
  $("#lider-passos").innerHTML = Array.from({ length: total }, (_, k) => `<span class="${k < quiz.i ? "feito" : k === quiz.i ? "atual" : ""}">${k < quiz.qs.length ? k + 1 : "👑"}</span>`).join("");
  const box = $("#lider-pergunta");
  if (quiz.i < quiz.qs.length) {
    const q = quiz.qs[quiz.i];
    box.innerHTML = `<p class="q-teoria">${esc(q.teoria)}</p><p class="q-texto">${esc(q.texto)}</p>
      <div class="opcoes">${q.opcoes.map((o) => `<label class="opcao${quiz.resp[q.id] === o.v ? " sel" : ""}"><input type="radio" name="op" value="${esc(o.v)}" ${quiz.resp[q.id] === o.v ? "checked" : ""} />
        <span><b>${esc(o.t)}</b>${o.det ? `<small>${esc(o.det)}</small>` : ""}</span></label>`).join("")}</div>`;
    box.querySelectorAll("input").forEach((inp) => inp.addEventListener("change", () => {
      quiz.resp[q.id] = inp.value; salvarRascunho();
      box.querySelectorAll(".opcao").forEach((l) => l.classList.toggle("sel", l.contains(inp)));
      $("#btn-q-avancar").disabled = false;
    }));
    $("#btn-q-avancar").disabled = !quiz.resp[q.id];
    $("#btn-q-avancar").textContent = "Próxima →";
  } else {
    box.innerHTML = `<p class="q-teoria">Decisão final</p><p class="q-texto">Com base nas suas respostas, quem vai liderar a virada de 90 dias na ${esc(D.RAMO[eu.ramo].empresa.split(" · ")[0])}?</p>
      <div class="mao-cartas mao-selecionavel" id="escolha-lider"></div>
      <label style="margin-top:12px">Por que essa pessoa? (opcional, vai para o debriefing)
        <input type="text" id="input-justificativa" maxlength="280" value="${esc(quiz.just)}" placeholder="Ex.: a equipe sabe, mas hesita; ela decide junto e assume os erros." /></label>`;
    renderMao($("#escolha-lider"), quiz.mao.map((f) => `${f}-0`), { selecionavel: true, onClick: (id, el) => {
      selecionar("#escolha-lider", el); quiz.lider = D.funcId(id); salvarRascunho(); $("#btn-q-avancar").disabled = false;
    } });
    if (quiz.lider) $$("#escolha-lider .carta").forEach((el, k) => { if ([...quiz.mao].sort()[k] === quiz.lider) el.classList.add("selecionada"); });
    $("#input-justificativa").addEventListener("input", (e) => { quiz.just = e.target.value; salvarRascunho(); });
    $("#btn-q-avancar").disabled = !quiz.lider;
    $("#btn-q-avancar").textContent = "Confirmar líder ✔";
  }
  $("#btn-q-voltar").disabled = quiz.i === 0;
}
$("#btn-q-voltar").addEventListener("click", () => { if (quiz.i > 0) { quiz.i--; salvarRascunho(); renderQuiz(); } });
$("#btn-q-avancar").addEventListener("click", async (ev) => {
  if (quiz.i < quiz.qs.length) { quiz.i++; salvarRascunho(); renderQuiz(); window.scrollTo({ top: $("#aluno-lider").offsetTop - 70, behavior: "smooth" }); return; }
  if (!quiz.lider) return;
  const nome = D.FUNCIONARIOS[quiz.lider].nome;
  if (!confirm(`Confirmar ${nome} como líder? Depois não dá para mudar.`)) return;
  ev.target.disabled = true;
  try { await L.concluirQuestionario(state.roomCode, eu, quiz.resp, quiz.lider, quiz.just); }
  catch (e) { $("#erro-lider").textContent = e.message || "Erro ao enviar."; ev.target.disabled = false; }
});

// ---------------------------------------------------------------------------
// Resultado do aluno
// ---------------------------------------------------------------------------
function renderResultado() {
  const r = D.RAMO[eu.ramo];
  const c = D.classificar(Object.values(colegas))[state.uid];
  const publicado = !!sala?.resultadoPublicado;
  const lider = D.FUNCIONARIOS[eu.liderEscolhido];
  let html = `<div class="painel resultado nivel-${c.nivel.id}">
    <p class="hint">${publicado ? "Resultado final" : "Resultado provisório: pode mudar até todos concluírem"}</p>
    <div class="res-nivel">${c.nivel.emoji} <b>${c.nivel.nome}</b> <span class="res-nota">${fmtNota(c.nivel.nota)}</span></div>
    <div class="kpis">
      <div class="kpi"><b>${eu.equipeFinal}/6</b><span>da equipe ideal</span></div>
      <div class="kpi"><b>${eu.trocas || 0}</b><span>trocas usadas</span></div>
      <div class="kpi"><b>${c.pos ?? "—"}º</b><span>posição na turma</span></div>
      <div class="kpi"><b>${publicado ? `${eu.acertos}/6` : "?"}</b><span>acertos no questionário</span></div>
    </div>
    <p>Líder escolhido: <b>${esc(lider?.nome)}</b> · ${esc(lider?.cargo)} ${publicado ? (eu.liderCerto ? "✅ certo" : "❌ não era o líder ideal") : ""}</p>
    <p class="hint">Topo (5 vagas · 1,0) e ideal (8 vagas · 0,8) exigem 6/6 e o líder certo; desempate por menos trocas, depois mais acertos e quem concluiu primeiro. As 3 posições seguintes ficam com a equipe equilibrada (0,6).</p>
  </div>`;
  if (publicado) {
    const qs = D.montarQuestionario(eu.ramo, eu.maoFinal || []);
    html += `<div class="painel"><h2>Gabarito comentado · ${r.icone} ${esc(r.nome)}</h2>
      ${gabaritoRamoHTML(r, new Set(eu.maoFinal || []))}
      <ol class="correcao">${qs.map((q) => {
        const ok = eu.respostas?.[q.id] === q.certa;
        return `<li class="${ok ? "ok" : "erro"}"><b>${ok ? "✅" : "❌"} ${esc(q.teoria)}</b><br />${esc(q.explica)}</li>`;
      }).join("")}</ol></div>`;
  } else {
    html += `<div class="painel"><p>⏳ O gabarito comentado aparece quando o(a) professor(a) publicar o resultado. Enquanto isso, acompanhe a corrida abaixo.</p></div>`;
  }
  $("#aluno-resultado").innerHTML = html;
}

// ---------------------------------------------------------------------------
// Retomar sessão
// ---------------------------------------------------------------------------
const sessao = L.lerSessao();
if (sessao?.roomCode) { $("#retomar-codigo").textContent = sessao.roomCode; $("#retomar-box").classList.remove("hidden"); }
$("#btn-descartar-sessao").addEventListener("click", () => { L.limparSessao(); $("#retomar-box").classList.add("hidden"); });
$("#btn-retomar").addEventListener("click", async (ev) => {
  const s = L.lerSessao(); if (!s) return;
  ev.target.disabled = true;
  try {
    await L.garantirLogin();
    if (s.role === "professor") exigirPin(() => abrirDashboard(s.roomCode, s.nome));
    else await entrarComoAluno(s.roomCode, s.nome, s.ramo);
  } catch (e) { alert(e.message || "Não foi possível voltar para a sala."); }
  finally { ev.target.disabled = false; }
});

// ---------------------------------------------------------------------------
// PROFESSOR: histórico de salas e painel consolidado
// ---------------------------------------------------------------------------
let historico = []; // [{ sala, res, dinamica }]
$("#btn-ver-historico").addEventListener("click", () => exigirPin(() => { show("screen-prof-historico"); $("#app").classList.add("largo"); carregarHistorico(); }));
$("#btn-hist-atualizar").addEventListener("click", carregarHistorico);
$("#filtro-historico").addEventListener("input", renderHistorico);
$("#filtro-dinamica").addEventListener("change", renderHistorico);

async function carregarHistorico() {
  $("#hist-status").textContent = "Carregando salas...";
  $("#hist-conteudo").innerHTML = "";
  try {
    await L.garantirLogin();
    const salas = await L.listarSalas();
    historico = await Promise.all(salas.map(async (sala) => {
      if (sala.dinamica === "rh") {
        const [alunos, trades] = await Promise.all([L.lerAlunos(sala.codigo).catch(() => []), L.lerTrades(sala.codigo)]);
        return { sala, dinamica: "rh", res: H.resultadoRH(sala, alunos, trades) };
      }
      if (sala.resultado?.alunos) return { sala, dinamica: "lideranca", res: { ...sala.resultado, resumo: H.resumir(sala.resultado.alunos), fonte: "salvo" } };
      const alunos = await L.lerAlunos(sala.codigo).catch(() => []); // sala nunca salva: calcula agora
      return { sala, dinamica: "lideranca", res: { ...H.montarResultado(alunos, D), fonte: "calculado" } };
    }));
    // salas vazias (criadas e abandonadas) não poluem o histórico
    historico = historico.filter((x) => x.res.alunos.length);
    $("#hist-status").textContent = `${historico.length} sala(s) com alunos.`;
    renderHistorico();
  } catch (e) { $("#hist-status").textContent = "Não foi possível carregar o histórico: " + (e.message || e); }
}
function historicoFiltrado() {
  const f = ($("#filtro-historico").value || "").trim().toLowerCase();
  const din = $("#filtro-dinamica").value;
  return historico.filter(({ sala, dinamica }) => (!din || dinamica === din) && (!f || `${sala.turma || ""} ${sala.codigo}`.toLowerCase().includes(f)));
}
const nomeArq = (item) => `${item.dinamica === "rh" ? "rh" : "lideranca"}-${(item.sala.turma || "sem-turma").replace(/[^\w-]+/g, "_")}-${item.sala.codigo}.csv`;
const csvItens = (itens) => (itens[0]?.dinamica === "rh" ? H.csvRH(itens) : H.csvDe(itens));
function renderHistorico() {
  const lista = historicoFiltrado();
  const box = $("#hist-conteudo");
  box.innerHTML = H.renderHistorico(lista, D);
  const achar = (cod) => historico.find((x) => x.sala.codigo === cod);
  box.querySelectorAll("[data-abrir]").forEach((b) => b.addEventListener("click", () => abrirDashboard(b.dataset.abrir, state.nome || "")));
  box.querySelectorAll("[data-csv]").forEach((b) => b.addEventListener("click", () => { const it = achar(b.dataset.csv); H.baixar(nomeArq(it), csvItens([it])); }));
  box.querySelectorAll("[data-ver]").forEach((b) => b.addEventListener("click", () => {
    const det = $("#hist-detalhe");
    det.innerHTML = H.renderDetalhe(achar(b.dataset.ver));
    det.querySelector("[data-fechar-detalhe]").addEventListener("click", () => (det.innerHTML = ""));
    det.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  box.querySelectorAll("[data-rotular]").forEach((b) => b.addEventListener("click", async () => {
    const it = achar(b.dataset.rotular);
    const novo = prompt(`Nome da turma da sala ${it.sala.codigo}:`, it.sala.turma || "");
    if (novo == null) return;
    try { await L.rotularSala(it.sala.codigo, novo.trim()); it.sala.turma = novo.trim(); renderHistorico(); toast("Turma atualizada."); }
    catch (e) { toast("Não foi possível salvar o nome da turma."); }
  }));
}
$("#btn-hist-csv").addEventListener("click", () => {
  const lista = historicoFiltrado();
  const dia = new Date().toISOString().slice(0, 10);
  const lid = lista.filter((x) => x.dinamica === "lideranca"), rh = lista.filter((x) => x.dinamica === "rh");
  if (lid.length) H.baixar(`historico-lideranca-${dia}.csv`, H.csvDe(lid));
  if (rh.length) setTimeout(() => H.baixar(`historico-rh-${dia}.csv`, H.csvRH(rh)), 400);
});
