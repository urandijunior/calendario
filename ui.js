// ui.js — camada de interface (v2). A lógica de jogo vive em app.js (window.CDA).

function waitForCDA() {
  return new Promise((resolve) => {
    if (window.CDA) return resolve(window.CDA);
    const iv = setInterval(() => { if (window.CDA) { clearInterval(iv); resolve(window.CDA); } }, 30);
  });
}

const CDA = await waitForCDA();
const { db, onSnapshot, doc, collection, query, where, getDocs, DECK_BY_ID, PROFISSOES, state } = CDA;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const profPorCodigo = Object.fromEntries(PROFISSOES.map((p) => [p.codigo, p]));

let salaAtual = null; // último snapshot do documento da sala (professor ou aluno)

// ---------------------------------------------------------------------------
// Navegação, toast e cronômetro
// ---------------------------------------------------------------------------
function show(screenId) {
  $$(".screen").forEach((el) => el.classList.remove("active"));
  $(`#${screenId}`).classList.add("active");
  window.scrollTo(0, 0);
}

$$("[data-back]").forEach((btn) => btn.addEventListener("click", () => { CDA.clearListeners(); show(btn.dataset.back); }));
$("#btn-sou-professor").addEventListener("click", () => show("screen-prof-criar"));
$("#btn-sou-aluno").addEventListener("click", () => show("screen-aluno-entrar"));

let toastTimer = null;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 3500);
}

function sair() {
  CDA.clearListeners();
  CDA.limparSessao();
  salaAtual = null;
  state.roomCode = null;
  state.role = null;
  $("#topbar-timer").classList.add("hidden");
  $("#retomar-box").classList.add("hidden");
  show("screen-home");
}
$("#btn-sair-prof").addEventListener("click", sair);
$("#btn-sair-aluno").addEventListener("click", sair);

let encerrandoPorTempo = false;
setInterval(() => {
  const el = $("#topbar-timer");
  const r = salaAtual;
  if (!r || !state.roomCode || r.status === "lobby") { el.classList.add("hidden"); return; }
  el.classList.remove("hidden", "urgente");
  if (r.status === "finalizado") { el.querySelector("span").textContent = "encerrado"; return; }
  if (!r.fimEm) { el.querySelector("span").textContent = "sem limite"; return; }
  const resta = Math.max(0, Math.round((r.fimEm - Date.now()) / 1000));
  el.querySelector("span").textContent = `${String(Math.floor(resta / 60)).padStart(2, "0")}:${String(resta % 60).padStart(2, "0")}`;
  if (resta <= 60) el.classList.add("urgente");
  if (resta === 0) {
    if (state.role === "professor" && !encerrandoPorTempo) {
      encerrandoPorTempo = true;
      CDA.encerrarJogo(state.roomCode).catch(() => {}).finally(() => (encerrandoPorTempo = false));
    }
    if (state.role === "aluno") atualizarTravas();
  }
}, 1000);

// ---------------------------------------------------------------------------
// Cartas
// ---------------------------------------------------------------------------
function criarCartaEl(cardId, { selecionavel = false, onClick = null, nova = false, revelar = false } = {}) {
  const carta = DECK_BY_ID[cardId];
  const el = document.createElement("div");
  if (!carta) return el;
  el.className = `carta tipo-${carta.tipo}` + (selecionavel ? " selecionavel" : "") + (nova ? " nova" : "");
  el.innerHTML = `
    <div class="carta-tipo">${carta.tipo === "H" ? "HABILIDADE" : "COMPETÊNCIA"}</div>
    <div class="carta-texto">${esc(carta.texto)}</div>
    ${revelar ? `<div class="carta-prof">${esc(carta.profissaoNome)}</div>` : ""}`;
  if (onClick) el.addEventListener("click", () => onClick(cardId, el));
  return el;
}

function renderMao(containerEl, cardIds, opts = {}) {
  containerEl.innerHTML = "";
  if (!cardIds.length) { containerEl.innerHTML = `<p class="vazio">Nenhuma carta.</p>`; return; }
  const ordenadas = [...cardIds].sort((a, b) => DECK_BY_ID[a].tipo.localeCompare(DECK_BY_ID[b].tipo) * -1);
  ordenadas.forEach((id) => containerEl.appendChild(criarCartaEl(id, { ...opts, nova: opts.novas?.has(id) })));
}

function gabaritoHTML(codigos) {
  return codigos.map((c) => profPorCodigo[c]).filter(Boolean).map((p) => `
    <div class="gabarito-prof">
      <b>${esc(p.nome)}</b> <span class="vazio">(${p.codigo})</span>
      <ul>${p.habilidades.map((h) => `<li><span class="tag tag-H">H</span> ${esc(h)}</li>`).join("")}
          ${p.competencias.map((c) => `<li><span class="tag tag-C">C</span> ${esc(c)}</li>`).join("")}</ul>
    </div>`).join("");
}

function ordenarRanking(alunos) {
  const t = (a) => a.completoEm?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
  return [...alunos].sort((a, b) => (b.completo - a.completo) || (t(a) - t(b)) || a.nome.localeCompare(b.nome));
}

const MEDALHAS = ["🥇", "🥈", "🥉"];

// ---------------------------------------------------------------------------
// PROFESSOR
// ---------------------------------------------------------------------------
$("#btn-criar-sala").addEventListener("click", async () => {
  const nome = $("#input-nome-professor").value.trim();
  $("#erro-criar-sala").textContent = "";
  try {
    const codigo = await CDA.criarSala(nome);
    abrirDashboard(codigo, nome);
  } catch (e) {
    $("#erro-criar-sala").textContent = e.message || "Erro ao criar sala.";
  }
});

function abrirDashboard(codigo, nome) {
  state.role = "professor";
  state.roomCode = codigo;
  state.nome = nome;
  CDA.salvarSessao({ role: "professor", roomCode: codigo, nome });
  $("#dash-codigo").textContent = codigo;
  $("#gabarito-box").classList.add("hidden");
  show("screen-prof-dashboard");
  iniciarDashboardProfessor(codigo);
}

let alunosCache = {};
const STATUS_TXT = { lobby: "aguardando", jogando: "em jogo", finalizado: "encerrado" };

function iniciarDashboardProfessor(codigo) {
  CDA.clearListeners();
  alunosCache = {};

  const unsubRoom = onSnapshot(doc(db, "rooms", codigo), (snap) => {
    const data = snap.data();
    if (!data) return;
    salaAtual = data;
    $("#dash-status").textContent = STATUS_TXT[data.status] || data.status;
    $("#dash-controles-lobby").classList.toggle("hidden", data.status !== "lobby");
    $("#dash-controles-jogo").classList.toggle("hidden", data.status === "lobby");
    $("#dash-dica-painel").classList.toggle("hidden", data.status !== "jogando");
    $("#btn-mais-tempo").classList.toggle("hidden", data.status !== "jogando" || !data.fimEm);
    $("#btn-encerrar-jogo").classList.toggle("hidden", data.status !== "jogando");
    $("#dash-titulo-lista").textContent = data.status === "lobby" ? "Alunos na sala" : "Ranking de contratações";
    renderListaAlunosProfessor();
    if (!$("#gabarito-box").classList.contains("hidden")) renderGabaritoProfessor();
  });

  const unsubStudents = onSnapshot(collection(db, "rooms", codigo, "students"), (snap) => {
    alunosCache = {};
    snap.forEach((d) => (alunosCache[d.id] = d.data()));
    renderListaAlunosProfessor();
  });

  const unsubTrades = onSnapshot(
    query(collection(db, "rooms", codigo, "trades"), where("status", "==", "aceita")),
    (snap) => ($("#dash-trocas").textContent = snap.size),
    () => ($("#dash-trocas").textContent = "—") // regras podem não permitir ao professor ler as trocas
  );

  state.unsubs.push(unsubRoom, unsubStudents, unsubTrades);
}

function renderListaAlunosProfessor() {
  const alunos = Object.values(alunosCache);
  const emJogo = salaAtual && salaAtual.status !== "lobby";
  $("#dash-total-alunos").textContent = alunos.length;
  const completos = alunos.filter((a) => a.completo).length;
  $("#dash-completos").textContent = completos;
  $("#dash-total-jogo").textContent = alunos.length;
  $("#dash-progresso-barra").style.width = alunos.length ? `${(completos / alunos.length) * 100}%` : "0";

  const box = $("#dash-lista-alunos");
  box.innerHTML = "";
  if (!alunos.length) { box.innerHTML = `<p class="vazio">Ninguém entrou ainda.</p>`; return; }
  const lista = emJogo ? ordenarRanking(alunos) : alunos;
  let pos = 0;
  lista.forEach((a) => {
    const row = document.createElement("div");
    row.className = "aluno-item" + (a.completo ? " completo" : "");
    const medalha = a.completo ? (MEDALHAS[pos] || `${pos + 1}º`) : "";
    if (a.completo) pos++;
    row.innerHTML = `
      <span>${medalha} ${esc(a.nome)}</span>
      <span class="status-ok">${a.completo ? "✅ " + esc(a.profissaoCompleta) : emJogo ? "🔄 negociando" : "pronto"}</span>`;
    box.appendChild(row);
  });
}

$("#btn-iniciar-jogo").addEventListener("click", async (ev) => {
  $("#erro-dashboard").textContent = "";
  ev.target.disabled = true;
  try {
    await CDA.iniciarJogo(state.roomCode, $("#input-duracao").value);
  } catch (e) {
    $("#erro-dashboard").textContent = e.message || "Erro ao iniciar.";
  } finally {
    ev.target.disabled = false;
  }
});

$("#btn-encerrar-jogo").addEventListener("click", async () => {
  if (!confirm("Encerrar as trocas e liberar o debriefing para os alunos?")) return;
  await CDA.encerrarJogo(state.roomCode);
});

$("#btn-mais-tempo").addEventListener("click", () => CDA.adicionarTempo(state.roomCode, 2, salaAtual?.fimEm));

async function enviarDica(texto) {
  await CDA.enviarDica(state.roomCode, texto);
  toast("Dica enviada para a turma.");
}
$("#btn-enviar-dica").addEventListener("click", () => enviarDica($("#input-dica").value.trim()));
$$(".chip[data-dica]").forEach((b) => b.addEventListener("click", () => enviarDica(b.dataset.dica)));

function renderGabaritoProfessor() {
  const ativos = salaAtual?.profissoesAtivas;
  $("#gabarito-box").innerHTML =
    (ativos ? `<p class="hint">Vagas sorteadas para esta sala:</p>` : `<p class="hint">As vagas serão sorteadas ao iniciar (uma por aluno). Deck completo:</p>`) +
    gabaritoHTML(ativos || PROFISSOES.map((p) => p.codigo));
}
$("#btn-toggle-gabarito").addEventListener("click", () => {
  const box = $("#gabarito-box");
  box.classList.toggle("hidden");
  if (!box.classList.contains("hidden")) renderGabaritoProfessor();
});

// ---------------------------------------------------------------------------
// ALUNO
// ---------------------------------------------------------------------------
$("#btn-entrar-sala").addEventListener("click", async (ev) => {
  const codigo = $("#input-codigo-sala").value.trim().toUpperCase();
  const nome = $("#input-nome-aluno").value.trim();
  $("#erro-entrar-sala").textContent = "";
  if (!codigo || !nome) { $("#erro-entrar-sala").textContent = "Preencha o código e seu nome."; return; }
  ev.target.disabled = true;
  try {
    await entrarComoAluno(codigo, nome);
  } catch (e) {
    $("#erro-entrar-sala").textContent = e.message || "Não foi possível entrar.";
  } finally {
    ev.target.disabled = false;
  }
});

async function entrarComoAluno(codigo, nome) {
  await CDA.entrarNaSala(codigo, nome);
  state.role = "aluno";
  state.roomCode = codigo;
  state.nome = nome;
  CDA.salvarSessao({ role: "aluno", roomCode: codigo, nome });
  $("#aluno-codigo").textContent = codigo;
  $("#aluno-nome-pill").textContent = nome;
  show("screen-aluno-sala");
  iniciarSalaAluno(codigo);
}

let meuMaoIds = [];
let maoCarregada = false;
let jaMarqueiCompleto = false;
let colegasCache = {};
let recebidasIds = new Set();
let ultimasRecebidas = [];
let recebidasIniciais = true;
let ultimaDica = "";

function souCompleto() { return jaMarqueiCompleto || !!colegasCache[state.uid]?.completo; }
function trocasTravadas() { return !CDA.jogoAberto(salaAtual) || souCompleto(); }

function iniciarSalaAluno(codigo) {
  CDA.clearListeners();
  meuMaoIds = [];
  maoCarregada = false;
  jaMarqueiCompleto = false;
  colegasCache = {};
  recebidasIds = new Set();
  ultimasRecebidas = [];
  recebidasIniciais = true;
  ultimaDica = "";
  $("#aluno-completo-banner").classList.add("hidden");
  $("#aluno-dica").classList.add("hidden");

  const unsubRoom = onSnapshot(doc(db, "rooms", codigo), (snap) => {
    const data = snap.data();
    if (!data) return;
    salaAtual = data;
    if (data.dica && data.dica !== ultimaDica) {
      ultimaDica = data.dica;
      $("#aluno-dica").textContent = "💡 Dica do(a) professor(a): " + data.dica;
      $("#aluno-dica").classList.remove("hidden");
      if (data.status === "jogando") toast("💡 Nova dica do(a) professor(a)!");
    }
    const emJogo = data.status !== "lobby";
    $("#aluno-espera").classList.toggle("hidden", emJogo);
    $("#aluno-jogo").classList.toggle("hidden", !emJogo);
    renderMural();
    renderDebriefing();
    atualizarTravas();
  });

  const unsubStudents = onSnapshot(collection(db, "rooms", codigo, "students"), (snap) => {
    colegasCache = {};
    snap.forEach((d) => (colegasCache[d.id] = d.data()));
    renderEspera();
    renderColegas();
    renderMural();
    atualizarTravas();
  });

  const unsubMinhaMao = onSnapshot(
    query(collection(db, "rooms", codigo, "cards"), where("donoUid", "==", state.uid)),
    async (snap) => {
      const novosIds = snap.docs.map((d) => d.id);
      const novas = new Set(maoCarregada ? novosIds.filter((id) => !meuMaoIds.includes(id)) : []);
      if (novas.size) {
        const c = DECK_BY_ID[[...novas][0]];
        toast(`🔁 Troca concluída! Você recebeu uma ${c.tipo === "H" ? "habilidade" : "competência"}.`);
      }
      meuMaoIds = novosIds;
      maoCarregada = novosIds.length > 0;
      renderMao($("#minha-mao"), meuMaoIds, { novas });
      renderContador();
      if (!jaMarqueiCompleto && meuMaoIds.length) {
        const resultado = await CDA.autoverificarConjunto(codigo, meuMaoIds);
        if (resultado) {
          jaMarqueiCompleto = true;
          $("#aluno-profissao-nome").textContent = resultado.nome;
          $("#aluno-completo-banner").classList.remove("hidden");
          atualizarTravas();
        }
      }
    }
  );

  const unsubRecebidas = onSnapshot(
    query(collection(db, "rooms", codigo, "trades"), where("paraUid", "==", state.uid), where("status", "==", "pendente")),
    (snap) => {
      const trades = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const chegou = trades.some((t) => !recebidasIds.has(t.id));
      if (chegou && !recebidasIniciais) {
        toast("📨 Você recebeu uma proposta de troca!");
        try { navigator.vibrate?.(200); } catch (e) {}
      }
      recebidasIniciais = false;
      recebidasIds = new Set(trades.map((t) => t.id));
      ultimasRecebidas = trades;
      renderTrocasRecebidas();
    }
  );

  const unsubEnviadas = onSnapshot(
    query(collection(db, "rooms", codigo, "trades"), where("deUid", "==", state.uid), where("status", "==", "pendente")),
    (snap) => renderTrocasEnviadas(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

  state.unsubs.push(unsubRoom, unsubStudents, unsubMinhaMao, unsubRecebidas, unsubEnviadas);
}

function atualizarTravas() {
  const encerrado = salaAtual && salaAtual.status !== "lobby" && !CDA.jogoAberto(salaAtual);
  $("#aluno-encerrado-banner").classList.toggle("hidden", !encerrado);
  if (souCompleto() && colegasCache[state.uid]?.profissaoCompleta) {
    $("#aluno-profissao-nome").textContent = colegasCache[state.uid].profissaoCompleta;
    $("#aluno-completo-banner").classList.remove("hidden");
  }
  renderColegas();
  renderTrocasRecebidas();
  if (encerrado) renderDebriefing();
}

function renderContador() {
  const h = meuMaoIds.filter((id) => DECK_BY_ID[id]?.tipo === "H").length;
  const c = meuMaoIds.length - h;
  $("#contador-tipos").innerHTML = `<span class="tag tag-H">H ${h}</span> <span class="tag tag-C">C ${c}</span>`;
}

function renderEspera() {
  const box = $("#espera-lista-alunos");
  const uids = Object.keys(colegasCache);
  $("#espera-total").textContent = uids.length;
  box.innerHTML = uids.length ? "" : `<p class="vazio">Ainda ninguém entrou.</p>`;
  uids.forEach((uid) => {
    const row = document.createElement("div");
    row.className = "aluno-item";
    row.innerHTML = `<span>${esc(colegasCache[uid].nome)}${uid === state.uid ? " (você)" : ""}</span>`;
    box.appendChild(row);
  });
}

function renderMural() {
  const box = $("#mural-vagas");
  const ativos = salaAtual?.profissoesAtivas || [];
  const preenchidas = {};
  Object.values(colegasCache).forEach((a) => { if (a.completo) preenchidas[a.profissaoCompleta] = a.nome; });
  box.innerHTML = ativos.map((cod) => {
    const p = profPorCodigo[cod];
    if (!p) return "";
    const quem = preenchidas[p.nome];
    return `<div class="vaga${quem ? " preenchida" : ""}">
        <div class="vaga-topo"><b>${esc(p.nome)}</b><span>${quem ? "✅ " + esc(quem) : "🟡 em aberto"}</span></div>
        <p>${esc(p.vaga)}</p>
      </div>`;
  }).join("");
}

function renderDebriefing() {
  const fim = salaAtual && salaAtual.status !== "lobby" && !CDA.jogoAberto(salaAtual);
  $("#aluno-debriefing").classList.toggle("hidden", !fim);
  if (fim) $("#aluno-gabarito").innerHTML = gabaritoHTML(salaAtual.profissoesAtivas || []);
}

function renderColegas() {
  const box = $("#lista-colegas");
  if (!box) return;
  const uids = Object.keys(colegasCache).filter((u) => u !== state.uid);
  box.innerHTML = uids.length ? "" : `<p class="vazio">Nenhum colega ainda.</p>`;
  const travado = trocasTravadas();
  uids.forEach((uid) => {
    const a = colegasCache[uid];
    const row = document.createElement("div");
    row.className = "aluno-item" + (a.completo ? " completo" : "");
    let botao;
    if (a.completo) botao = `<span class="status-ok">✅ ${esc(a.profissaoCompleta)}</span>`;
    else if (travado) botao = `<button class="btn-secondary" disabled>Trocas travadas</button>`;
    else botao = `<button class="btn-secondary">Ver mão / Negociar</button>`;
    row.innerHTML = `<span>${esc(a.nome)}</span>${botao}`;
    const btn = row.querySelector("button:not([disabled])");
    if (btn) btn.addEventListener("click", () => abrirModalTroca(uid, a.nome));
    box.appendChild(row);
  });
}

function renderTrocasRecebidas() {
  const box = $("#trocas-recebidas");
  const trades = ultimasRecebidas;
  const badge = $("#badge-recebidas");
  badge.textContent = trades.length;
  badge.classList.toggle("hidden", !trades.length);
  box.innerHTML = trades.length ? "" : `<p class="vazio">Nenhuma proposta recebida.</p>`;
  const travado = trocasTravadas();
  trades.forEach((t) => {
    const of = DECK_BY_ID[t.cartaOferecidaId];
    const pe = DECK_BY_ID[t.cartaPedidaId];
    const el = document.createElement("div");
    el.className = "troca-item";
    el.innerHTML = `
      <div><b>${esc(t.deNome)}</b> oferece: <span class="tag tag-${of?.tipo}">${of?.tipo}</span> <i>${esc(of?.texto)}</i></div>
      <div>em troca da sua: <span class="tag tag-${pe?.tipo}">${pe?.tipo}</span> <i>${esc(pe?.texto)}</i></div>
      ${t.argumento ? `<div class="argumento">💬 “${esc(t.argumento)}”</div>` : ""}
      <div class="troca-acoes">
        <button class="btn-primary" data-aceitar ${travado ? "disabled" : ""}>Aceitar</button>
        <button class="btn-secondary" data-recusar>Recusar</button>
      </div>`;
    el.querySelector("[data-aceitar]").addEventListener("click", async (ev) => {
      ev.target.disabled = true;
      try { await CDA.aceitarTroca(state.roomCode, t.id); }
      catch (e) { alert(e.message); ev.target.disabled = false; }
    });
    el.querySelector("[data-recusar]").addEventListener("click", () => CDA.recusarTroca(state.roomCode, t.id));
    box.appendChild(el);
  });
}

function renderTrocasEnviadas(trades) {
  const box = $("#trocas-enviadas");
  box.innerHTML = trades.length ? "" : `<p class="vazio">Nenhuma proposta enviada.</p>`;
  trades.forEach((t) => {
    const of = DECK_BY_ID[t.cartaOferecidaId];
    const pe = DECK_BY_ID[t.cartaPedidaId];
    const el = document.createElement("div");
    el.className = "troca-item";
    el.innerHTML = `
      <div>Para <b>${esc(t.paraNome)}</b>: você oferece <i>${esc(of?.texto)}</i></div>
      <div>e pede <i>${esc(pe?.texto)}</i></div>
      <div class="troca-acoes"><button class="btn-secondary" data-cancelar>Cancelar</button></div>`;
    el.querySelector("[data-cancelar]").addEventListener("click", () => CDA.cancelarTroca(state.roomCode, t.id));
    box.appendChild(el);
  });
}

// ---------------------------------------------------------------------------
// Modal de troca
// ---------------------------------------------------------------------------
let modalColegaUid = null, modalOferta = null, modalPedida = null;

function selecionar(containerSel, el) {
  $$(`${containerSel} .carta`).forEach((c) => c.classList.remove("selecionada"));
  el.classList.add("selecionada");
}

async function abrirModalTroca(colegaUid, colegaNome) {
  modalColegaUid = colegaUid;
  modalOferta = null;
  modalPedida = null;
  $("#modal-colega-nome").textContent = colegaNome;
  $("#erro-modal-troca").textContent = "";
  $("#input-argumento").value = "";
  $("#btn-confirmar-troca").disabled = true;
  $("#modal-mao-colega").innerHTML = `<p class="vazio">Carregando...</p>`;
  $("#modal-troca").classList.remove("hidden");

  renderMao($("#modal-mao-propria"), meuMaoIds, {
    selecionavel: true,
    onClick: (id, el) => { selecionar("#modal-mao-propria", el); modalOferta = id; atualizarBotaoConfirmar(); },
  });

  const snap = await getDocs(query(collection(db, "rooms", state.roomCode, "cards"), where("donoUid", "==", colegaUid)));
  renderMao($("#modal-mao-colega"), snap.docs.map((d) => d.id), {
    selecionavel: true,
    onClick: (id, el) => { selecionar("#modal-mao-colega", el); modalPedida = id; atualizarBotaoConfirmar(); },
  });
}

function atualizarBotaoConfirmar() {
  $("#btn-confirmar-troca").disabled = !(modalOferta && modalPedida);
}

$("#btn-confirmar-troca").addEventListener("click", async (ev) => {
  ev.target.disabled = true;
  try {
    await CDA.proporTroca(state.roomCode, modalColegaUid, colegasCache[modalColegaUid]?.nome || "",
      modalOferta, modalPedida, $("#input-argumento").value.trim());
    $("#modal-troca").classList.add("hidden");
    toast("Proposta enviada! Aguarde a resposta do colega.");
  } catch (e) {
    $("#erro-modal-troca").textContent = e.message || "Erro ao propor troca.";
    ev.target.disabled = false;
  }
});

$("#modal-fechar").addEventListener("click", () => $("#modal-troca").classList.add("hidden"));
$("#modal-troca").addEventListener("click", (e) => { if (e.target.id === "modal-troca") $("#modal-troca").classList.add("hidden"); });

// ---------------------------------------------------------------------------
// Retomar sessão salva
// ---------------------------------------------------------------------------
const sessao = CDA.lerSessao();
if (sessao?.roomCode) {
  $("#retomar-codigo").textContent = sessao.roomCode;
  $("#retomar-box").classList.remove("hidden");
}
$("#btn-descartar-sessao").addEventListener("click", () => { CDA.limparSessao(); $("#retomar-box").classList.add("hidden"); });
$("#btn-retomar").addEventListener("click", async (ev) => {
  const s = CDA.lerSessao();
  if (!s) return;
  ev.target.disabled = true;
  try {
    await CDA.garantirLogin();
    if (s.role === "professor") abrirDashboard(s.roomCode, s.nome);
    else await entrarComoAluno(s.roomCode, s.nome);
  } catch (e) {
    alert(e.message || "Não foi possível voltar para a sala.");
  } finally {
    ev.target.disabled = false;
  }
});
