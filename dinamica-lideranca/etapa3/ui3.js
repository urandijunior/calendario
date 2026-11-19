// ui3.js — Etapa 3: telas do aluno, trava de segurança e painel docente.

import * as A from "./app3.js?v=7";
import * as D from "../data.js?v=7";
import { retrato } from "../arte.js?v=7";
import { CENARIOS3 } from "./cenarios3.js?v=7";
import { questoesPessoais, corrigir, DIFIC, PONTOS_TOTAIS } from "./motor3.js?v=7";
import { cenaRamo, cenaAbertura, faixaRamo, horaDoRamo, prepararArte } from "./arte3.js?v=7";

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const PIN_PROFESSOR = "1919";
const CHAVE = "lid-etapa3-sessao";
const TOLERANCIA_MS = 2000;   // saída de até 2 segundos não penaliza (notificação, teclado)
const TOTAL_Q = 12;

const E = {
  sala: null, salaDados: null, alunoId: null, aluno: null, nomeDigitado: "",
  ramo: null, mao: [], lider: null, avulso: false,
  cen: null, questoes: [], i: 0, respostas: {}, anuladas: {}, saidas: 0,
  escondidoEm: 0, travaAtiva: false, enviado: false,
  unsubs: [], tickTimer: null, prof: false, profOrdem: "nota",
};

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// negrito **assim** e itálico *assim* sobre texto já escapado
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
const paras = (s) => String(s || "").split(/\n{2,}/).map((p) => `<p>${md(p).replace(/\n/g, "<br />")}</p>`).join("");

function mostrar(id) {
  $$(".tela").forEach((t) => t.classList.toggle("ativa", t.id === id));
  window.scrollTo(0, 0);
}
let avisoTimer = null;
function aviso(msg, ms = 3400) {
  const el = $("#aviso"); el.textContent = msg; el.classList.remove("hidden");
  clearTimeout(avisoTimer); avisoTimer = setTimeout(() => el.classList.add("hidden"), ms);
}
const salvarSessao = () => { try { localStorage.setItem(CHAVE, JSON.stringify({ sala: E.sala, alunoId: E.alunoId, nome: E.nomeDigitado })); } catch (e) {} };
const lerSessao = () => { try { return JSON.parse(localStorage.getItem(CHAVE) || "null"); } catch (e) { return null; } };
const limparSessao = () => { try { localStorage.removeItem(CHAVE); } catch (e) {} };
const limparUnsubs = () => { E.unsubs.forEach((f) => f && f()); E.unsubs = []; };

const mmss = (ms) => {
  const t = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

// ---------------------------------------------------------------------------
// Cartas da equipe
// ---------------------------------------------------------------------------
function cartaEquipe(id, liderId, ramoCod) {
  const p = D.FUNCIONARIOS[id];
  if (!p) return "";
  const eLider = id === liderId;
  const fora = p.ramo !== ramoCod;
  return `<div class="carta3${eLider ? " lider" : ""}">
    ${retrato(p)}
    <div class="cb">
      <div class="cn">${esc(p.nome)}</div>
      <div class="cc">${esc(p.cargo)}</div>
      ${eLider ? `<span class="tag-lider">Líder que você escolheu</span>` : ""}
      ${fora ? `<span class="tag-fora">veio do ramo ${esc(D.RAMO[p.ramo]?.nome || "")}</span>` : ""}
    </div></div>`;
}

// ---------------------------------------------------------------------------
// Entrada
// ---------------------------------------------------------------------------
prepararArte();
$("#heroi-aviso").innerHTML = cenaAbertura();

$("#btn-aceitar").addEventListener("click", async () => {
  mostrar("tela-entrar");
  $("#heroi-entrar").innerHTML = cenaAbertura();
  const s = lerSessao();
  if (s?.sala) { $("#in-sala").value = s.sala; $("#in-nome").value = s.nome || ""; }
  A.garantirLogin().catch(() => aviso("Sem conexão com o servidor. Verifique a internet."));
});

$("#btn-area-prof").addEventListener("click", () => { mostrar("tela-prof-pin"); setTimeout(() => $("#in-pin").focus(), 60); });
$$("[data-volta]").forEach((b) => b.addEventListener("click", () => mostrar(b.dataset.volta)));

let alunosCache = [];

$("#btn-entrar").addEventListener("click", entrar);
$("#in-nome").addEventListener("keydown", (e) => { if (e.key === "Enter") entrar(); });

async function entrar() {
  const sala = $("#in-sala").value.trim().toUpperCase();
  const nome = $("#in-nome").value.trim();
  const err = $("#erro-entrar");
  err.textContent = "";
  if (sala.length !== 6) return (err.textContent = "O código da sala tem 6 caracteres.");
  if (nome.length < 3) return (err.textContent = "Digite o seu nome completo, como na Etapa 2.");
  $("#btn-entrar").disabled = true;
  try {
    await A.garantirLogin();
    E.salaDados = await A.lerSala(sala);
    E.sala = sala; E.nomeDigitado = nome;
    alunosCache = await A.lerAlunos(sala);
    const r = A.acharPorNome(alunosCache, nome);
    if (r.achou) return prepararConfirmacao(r.aluno, r.aproximado);
    mostrarListaNomes(r.candidatos.length ? r.candidatos : alunosCache, r.ambiguo);
  } catch (e) {
    err.textContent = e.message || "Não foi possível entrar.";
  } finally {
    $("#btn-entrar").disabled = false;
  }
}

function mostrarListaNomes(lista, ambiguo) {
  $("#box-lista-nomes").classList.remove("hidden");
  $("#box-avulso").classList.add("hidden");
  if (ambiguo) $("#erro-entrar").textContent = "Há mais de uma pessoa com esse nome na turma. Escolha o seu registro.";
  const render = (filtro = "") => {
    const f = A.normalizar(filtro);
    const itens = (f ? lista.filter((a) => A.normalizar(a.nome).includes(f)) : lista)
      .slice().sort((a, b) => String(a.nome).localeCompare(String(b.nome), "pt-BR"));
    $("#lista-nomes").innerHTML = itens.length
      ? itens.map((a) => `<button class="nome-item" data-uid="${esc(a.uid)}">${esc(a.nome)}
          <small>${esc(D.RAMO[a.ramo]?.icone || "")} ${esc(D.RAMO[a.ramo]?.nome || "ramo não definido")}${a.etapa3?.status === "concluido" ? " · já concluiu a Etapa 3" : ""}</small></button>`).join("")
      : `<p class="dica" style="padding:14px">Nenhum nome encontrado.</p>`;
    $$("#lista-nomes .nome-item").forEach((b) => b.addEventListener("click", () => {
      const a = lista.find((x) => x.uid === b.dataset.uid);
      if (a) prepararConfirmacao(a, false);
    }));
  };
  render();
  $("#filtro-nomes").oninput = (ev) => render(ev.target.value);
}

$("#btn-sem-nome").addEventListener("click", () => {
  $("#box-lista-nomes").classList.add("hidden");
  $("#box-avulso").classList.remove("hidden");
  $("#grade-ramos").innerHTML = D.RAMOS.map((r) =>
    `<button class="ramo-btn" data-r="${r.codigo}"><span class="ic">${r.icone}</span>${esc(r.nome)}</button>`).join("");
  let sel = null;
  $$("#grade-ramos .ramo-btn").forEach((b) => b.addEventListener("click", () => {
    $$("#grade-ramos .ramo-btn").forEach((x) => x.classList.remove("sel"));
    b.classList.add("sel"); sel = b.dataset.r; $("#btn-avulso-ok").disabled = false;
  }));
  $("#btn-avulso-ok").onclick = async () => {
    if (!sel) return;
    $("#btn-avulso-ok").disabled = true;
    const r = D.RAMO[sel];
    try {
      const res = await A.criarAvulso(E.sala, { nome: E.nomeDigitado, ramo: sel, mao: [...r.idsEquipe] });
      if (res.jaExiste) {
        // este aparelho já tem registro na sala: usa o registro real em vez de sobrescrevê-lo
        aviso("Este aparelho já tem um registro nesta sala. Confirme se é você.", 6000);
        $("#box-avulso").classList.add("hidden");
        return prepararConfirmacao({ uid: res.uid, ...res.dados }, true);
      }
      E.avulso = true; E.semEquipe = false; E.ramo = sel; E.mao = [...r.idsEquipe]; E.lider = null;
      E.alunoId = res.uid; E.aluno = { uid: res.uid, nome: E.nomeDigitado, ramo: sel };
      E.respostas = {}; E.anuladas = {}; E.saidas = 0; E.i = 0;
    } catch (e) {
      return aviso("Não foi possível registrar. Chame o professor.");
    } finally { $("#btn-avulso-ok").disabled = false; }
    salvarSessao(); seguirParaEtapa();
  };
});

function prepararConfirmacao(aluno, aproximado) {
  E.aluno = aluno; E.alunoId = aluno.uid;
  E.ramo = aluno.etapa3?.ramo || aluno.ramo;
  // Quem não chegou a fechar a negociação na Etapa 2 não tem equipe própria:
  // entra com a equipe ideal do ramo, e isso é dito na tela, não escondido.
  E.semEquipe = !aluno.etapa3?.mao && !(aluno.maoFinal || []).length;
  E.mao = (aluno.etapa3?.mao || aluno.maoFinal || D.RAMO[E.ramo]?.idsEquipe || []).filter((x) => D.FUNCIONARIOS[x]);
  E.lider = aluno.etapa3?.lider || aluno.liderEscolhido || null;
  E.avulso = !!aluno.etapa3?.avulso;
  if (!D.RAMO[E.ramo]) { $("#erro-entrar").textContent = "O seu registro da Etapa 2 está sem ramo. Chame o professor."; return; }
  if (E.mao.length < 2) E.mao = [...D.RAMO[E.ramo].idsEquipe];

  const r = D.RAMO[E.ramo];
  const lid = E.lider ? D.FUNCIONARIOS[E.lider] : null;
  $("#cartao-confirma").innerHTML = `
    <p class="nome-grande">${esc(aluno.nome)}</p>
    <div class="ramo-linha"><span class="ic">${r.icone}</span><span>${esc(r.nome)} — ${esc(r.empresa.split(" · ")[0])}</span></div>
    ${aproximado ? `<div class="box-info">Encontrei este registro a partir do nome que você digitou. Confirme se é você antes de continuar.</div>` : ""}
    ${E.semEquipe ? `<div class="box-info"><b>Você não chegou a fechar a sua equipe na Etapa 2.</b> Para poder fazer este exercício, você entra com a <b>equipe ideal</b> deste ramo. O professor vê isso no painel.</div>` : ""}
    <h3>${E.semEquipe ? "A equipe com que você vai jogar" : "A sua equipe final na Etapa 2"}</h3>
    <div class="cartas">${E.mao.map((id) => cartaEquipe(id, E.lider, E.ramo)).join("")}</div>
    <h3>${E.semEquipe ? "Líder" : "O líder que você escolheu"}</h3>
    <p>${lid ? `<b>${esc(lid.nome)}</b> — ${esc(lid.cargo)}` : "<b>Nenhum líder indicado na Etapa 2.</b> A questão sobre o papel do líder vai levar isso em conta."}</p>
    ${aluno.etapa3?.status === "concluido" ? `<div class="box-info"><b>Atenção:</b> este registro já concluiu a Etapa 3. Se não foi você, escolha outro nome. Se foi, fale com o professor.</div>` : ""}`;
  mostrar("tela-confirmar");
}

$("#btn-nao-sou").addEventListener("click", () => { E.aluno = null; E.alunoId = null; mostrar("tela-entrar"); });

$("#btn-sou-eu").addEventListener("click", async () => {
  if (E.aluno?.etapa3?.status === "concluido") return aviso("Este registro já concluiu a Etapa 3. Chame o professor.");
  $("#btn-sou-eu").disabled = true;
  try {
    await A.iniciarAluno(E.sala, E.alunoId, { ramo: E.ramo, mao: E.mao, lider: E.lider, nomeDigitado: E.nomeDigitado, avulso: E.avulso, incompleto: E.semEquipe });
    // retoma o que já havia sido respondido (se o aluno recarregou a página)
    const e3 = E.aluno.etapa3 || {};
    E.respostas = { ...(e3.respostas || {}) };
    E.anuladas = Object.fromEntries(Object.entries(e3.anuladas || {}).filter(([, v]) => v));
    E.saidas = Number(e3.saidas) || 0;
    E.i = Math.min(Number(e3.i) || 0, TOTAL_Q);
    salvarSessao();
    seguirParaEtapa();
  } catch (e) {
    aviso(e?.code === "permission-denied"
      ? "O servidor recusou a gravação. Chame o professor: as permissões da sala precisam ser conferidas."
      : "Não foi possível registrar a sua entrada. Verifique a internet e toque novamente.", 8000);
  } finally { $("#btn-sou-eu").disabled = false; }
});

// ---------------------------------------------------------------------------
// Espera / abertura pelo professor
// ---------------------------------------------------------------------------
function seguirParaEtapa() {
  limparUnsubs();
  $("#heroi-espera").innerHTML = cenaAbertura();
  $("#espera-quem").innerHTML = `Registrado como <b>${esc(E.aluno?.nome || E.nomeDigitado)}</b> · ${esc(D.RAMO[E.ramo]?.nome || "")}`;
  E.unsubs.push(A.observarSala(E.sala, (d) => {
    E.salaDados = d;
    const st = d.etapa3?.status;
    if (st === "aberta") {
      if ($("#tela-espera").classList.contains("ativa") || $("#tela-confirmar").classList.contains("ativa")) abrirCenario();
      ligarCronometro();
    } else if (st === "encerrada" && !E.enviado && $("#tela-questao").classList.contains("ativa")) {
      aviso("O professor encerrou a etapa. Termine o que está aberto e envie.", 7000);
    } else if (!st) {
      mostrar("tela-espera");
    }
  }));
  if (E.salaDados?.etapa3?.status === "aberta") { abrirCenario(); ligarCronometro(); } else mostrar("tela-espera");
}

// ---------------------------------------------------------------------------
// Cenário
// ---------------------------------------------------------------------------
function abrirCenario() {
  const cen = CENARIOS3[E.ramo];
  if (!cen) return aviso("Cenário não encontrado para o seu ramo. Chame o professor.");
  E.cen = cen;
  E.questoes = [...cen.questoes, ...questoesPessoais(cen, E.ramo, E.mao, E.lider, E.alunoId || "x")];

  $("#topo-tit").textContent = cen.titulo;
  $("#heroi-cenario").innerHTML = cenaRamo(E.ramo);
  $("#cen-kick").textContent = `${D.RAMO[E.ramo].icone} ${cen.kicker} · ${horaDoRamo(E.ramo)}`;
  $("#cen-titulo").textContent = cen.titulo;
  $("#cen-sub").textContent = `${cen.empresa} — ${cen.sub}`;
  $("#cen-corpo").innerHTML = cen.paragrafos.map((p) => {
    const dest = /^\*\*\d\./.test(p);
    return `<p${dest ? ' class="destaque"' : ""}>${md(p)}</p>`;
  }).join("");
  $("#cen-fontes").innerHTML = cen.fontes.map((f) => `<li>${esc(f)}</li>`).join("");
  $("#equipe-cartas").innerHTML = E.mao.map((id) => cartaEquipe(id, E.lider, E.ramo)).join("");
  $("#equipe-dica").innerHTML = (E.avulso || E.semEquipe)
    ? "Você recebeu a equipe ideal deste ramo porque não fechou a sua equipe na Etapa 2. Quatro das doze questões são sobre ela."
    : `Esta é a equipe que <b>você</b> montou trocando cartas na Etapa 2. Quatro das doze questões são sobre ela.`;
  const fim = E.salaDados?.etapa3?.fimMs;
  $("#cen-tempo").innerHTML = fim ? ` O cronômetro da turma termina em <b>${mmss(fim - A.agora())}</b>.` : "";
  if (E.i > 0 && E.i < TOTAL_Q) {
    $("#btn-comecar").textContent = `Retomar na questão ${E.i + 1} de ${TOTAL_Q}`;
  }
  mostrar("tela-cenario");
}

$("#btn-comecar").addEventListener("click", () => {
  $("#faixa-questao").innerHTML = faixaRamo(E.ramo);
  $("#faixa-disc").innerHTML = faixaRamo(E.ramo);
  ativarTrava();
  if (E.i >= TOTAL_Q) return irParaDiscursiva();
  renderQuestao();
  mostrar("tela-questao");
});

// ---------------------------------------------------------------------------
// Questões
// ---------------------------------------------------------------------------
let marcada = null;

function renderBarra() {
  $("#barra-passos").innerHTML = E.questoes.map((q, k) => {
    const cls = E.anuladas[q.id] ? "anulada" : k < E.i ? "feita" : k === E.i ? "agora" : "";
    return `<span class="${cls}" title="Questão ${k + 1}"></span>`;
  }).join("");
}

function renderQuestao() {
  const q = E.questoes[E.i];
  if (!q) return irParaDiscursiva();
  marcada = E.respostas[q.id] ?? null;
  renderBarra();
  $("#passo-pill").classList.remove("hidden");
  $("#passo-pill").textContent = `${E.i + 1} de ${TOTAL_Q}`;

  const partes = String(q.texto).split(/\n{2,}/);
  const corpo = partes.length > 1
    ? `<div class="q-cenario">${md(partes[0]).replace(/\n/g, "<br />")}</div><p class="q-enunciado">${md(partes.slice(1).join("\n\n")).replace(/\n/g, "<br />")}</p>`
    : `<p class="q-enunciado">${md(partes[0]).replace(/\n/g, "<br />")}</p>`;

  $("#cartao-questao").innerHTML = `
    <div class="q-topo">
      <span class="q-num">Questão ${E.i + 1}</span>
      <span class="q-dif ${q.dif}">${DIFIC[q.dif].nome}</span>
      ${q.pessoal ? `<span class="q-pessoal">Sobre a sua equipe</span>` : ""}
      <span class="q-teoria">${esc(q.teoria)}</span>
    </div>
    ${q.titulo ? `<h2>${esc(q.titulo)}</h2>` : ""}
    ${corpo}
    <div class="alts" id="alts"></div>`;

  const letras = "ABCDE";
  $("#alts").innerHTML = q.opcoes.map((o, k) => `
    <button class="alt${marcada === o.v ? " sel" : ""}" data-v="${esc(o.v)}">
      <span class="marca">${letras[k] || "•"}</span>
      <span><span class="t">${md(o.t)}</span>${o.det ? `<span class="det">${md(o.det)}</span>` : ""}</span>
    </button>`).join("");

  $$("#alts .alt").forEach((b) => b.addEventListener("click", () => {
    marcada = b.dataset.v;
    $$("#alts .alt").forEach((x) => x.classList.toggle("sel", x === b));
    $("#btn-avancar").disabled = false;
  }));

  $("#btn-avancar").disabled = marcada == null;
  $("#btn-avancar").textContent = E.i === TOTAL_Q - 1 ? "Ir para a pergunta aberta →" : "Próxima →";
  $("#aviso-sem-volta").textContent = q.pessoal
    ? "Esta questão é sobre a equipe que você montou. Sem volta."
    : "Sem volta: ao avançar, a resposta é definitiva.";
}

$("#btn-avancar").addEventListener("click", async () => {
  const q = E.questoes[E.i];
  if (!q || marcada == null) return;
  E.respostas[q.id] = marcada;
  E.i += 1;
  $("#btn-avancar").disabled = true;
  try { await A.salvarResposta(E.sala, E.alunoId, q.id, marcada, E.i); } catch (e) { /* segue offline; o envio final grava tudo */ }
  if (E.i >= TOTAL_Q) irParaDiscursiva(); else { renderQuestao(); window.scrollTo(0, 0); }
});

// ---------------------------------------------------------------------------
// Discursiva
// ---------------------------------------------------------------------------
const contarLinhas = (t) => String(t || "").split("\n").reduce((s, l) => s + Math.max(1, Math.ceil(l.length / 95)), 0);

function irParaDiscursiva() {
  renderBarra();
  $("#passo-pill").textContent = "Pergunta aberta";
  $("#in-discursiva").value = E.aluno?.etapa3?.discursiva || "";
  atualizarContador();
  mostrar("tela-discursiva");
  setTimeout(() => $("#in-discursiva").focus(), 120);
}

function atualizarContador() {
  const t = $("#in-discursiva").value;
  const n = contarLinhas(t);
  const el = $("#contador-linhas");
  el.textContent = `${n} de 10 linhas`;
  el.classList.toggle("cheio", n > 10);
  const ok = t.trim().length >= 120 && n <= 10;
  $("#btn-enviar").disabled = !ok;
  $("#erro-disc").textContent = n > 10 ? "Passou de 10 linhas. Resuma um pouco." : (t.trim().length && t.trim().length < 120 ? "Escreva pelo menos 3 linhas." : "");
}
$("#in-discursiva").addEventListener("input", atualizarContador);
$("#in-discursiva").addEventListener("blur", () => { A.salvarDiscursiva(E.sala, E.alunoId, $("#in-discursiva").value).catch(() => {}); });

$("#btn-enviar").addEventListener("click", () => enviar(false));

async function enviar(porTempo) {
  if (E.enviado) return;
  E.enviado = true;
  desativarTrava();
  const disc = $("#in-discursiva").value;
  const anul = new Set(Object.keys(E.anuladas).filter((k) => E.anuladas[k]));
  const res = corrigir(E.questoes, E.respostas, anul);
  try {
    await A.concluirAluno(E.sala, E.alunoId, { respostas: E.respostas, anuladas: E.anuladas, discursiva: disc, resultado: res });
  } catch (e) {
    if (!porTempo) { E.enviado = false; aviso("Não foi possível enviar. Verifique a internet e toque novamente.", 6000); return; }
  }
  limparSessao();
  $("#passo-pill").classList.add("hidden");
  $("#heroi-fim").innerHTML = cenaAbertura();
  const respondidas = Object.keys(E.respostas).length;
  $("#fim-resumo").innerHTML = `${respondidas} de ${TOTAL_Q} questões respondidas${anul.size ? ` · ${anul.size} zerada${anul.size > 1 ? "s" : ""} pela trava` : ""}.`;
  mostrar("tela-fim");
}

// ---------------------------------------------------------------------------
// TRAVA DE SEGURANÇA
// Conta apenas troca real de aba ou de aplicativo (document.hidden), com 2 segundos
// de tolerância, para que notificação e teclado do celular não penalizem injustamente.
// ---------------------------------------------------------------------------
function ativarTrava() {
  if (E.travaAtiva) return;
  E.travaAtiva = true;
  document.addEventListener("visibilitychange", aoTrocarVisibilidade);
  window.addEventListener("beforeunload", aoFechar);
  try { history.pushState({ et3: 1 }, ""); } catch (e) {}
  window.addEventListener("popstate", aoVoltar);
}
function desativarTrava() {
  E.travaAtiva = false;
  document.removeEventListener("visibilitychange", aoTrocarVisibilidade);
  window.removeEventListener("beforeunload", aoFechar);
  window.removeEventListener("popstate", aoVoltar);
}
function aoFechar(ev) {
  if (!E.travaAtiva || E.enviado) return;
  ev.preventDefault(); ev.returnValue = "";
  return "";
}
function aoVoltar() {
  if (!E.travaAtiva || E.enviado) return;
  try { history.pushState({ et3: 1 }, ""); } catch (e) {}
  aviso("Não use o botão de voltar: o exercício é de via única.", 5000);
}

function aoTrocarVisibilidade() {
  if (!E.travaAtiva || E.enviado) return;
  if (document.hidden) { E.escondidoEm = Date.now(); return; }
  const fora = Date.now() - (E.escondidoEm || Date.now());
  E.escondidoEm = 0;
  if (fora <= TOLERANCIA_MS) return; // tolerância: não penaliza
  penalizar(fora / 1000);
}

async function penalizar(segundos) {
  E.saidas += 1;
  const naDiscursiva = $("#tela-discursiva").classList.contains("ativa");
  const q = naDiscursiva ? null : E.questoes[E.i];
  if (q) {
    E.anuladas[q.id] = true;
  }
  try { await A.registrarSaida(E.sala, E.alunoId, q ? q.id : null, E.saidas, segundos); } catch (e) {}

  $("#trava-msg").innerHTML = q
    ? `A <b>questão ${E.i + 1}</b> foi zerada e não pode ser refeita. Você ficou ${Math.round(segundos)} segundos fora do aplicativo.`
    : `Você ficou ${Math.round(segundos)} segundos fora do aplicativo durante a pergunta aberta. A saída ficou registrada.`;
  $("#trava-contagem").innerHTML = `Esta foi a sua <b>${E.saidas}ª saída</b>. Ela aparece no painel do professor.`;
  $("#overlay-trava").classList.remove("hidden");

  if (q) {
    E.i += 1;
    try { await A.marcarPosicao(E.sala, E.alunoId, E.i); } catch (e) {}
  }
}

$("#btn-trava-ok").addEventListener("click", () => {
  $("#overlay-trava").classList.add("hidden");
  if (E.enviado) return;
  if (E.i >= TOTAL_Q) irParaDiscursiva();
  else if ($("#tela-questao").classList.contains("ativa")) renderQuestao();
});

// ---------------------------------------------------------------------------
// Cronômetro da turma
// ---------------------------------------------------------------------------
function ligarCronometro() {
  if (E.tickTimer) return;
  $("#relogio").classList.remove("hidden");
  E.tickTimer = setInterval(() => {
    const fim = E.salaDados?.etapa3?.fimMs;
    if (!fim) return;
    const resta = fim - A.agora();
    $("#relogio").textContent = mmss(resta);
    $("#relogio").classList.toggle("apertado", resta < 5 * 60000);
    if (resta <= 0 && !E.enviado && (E.i > 0 || $("#tela-discursiva").classList.contains("ativa"))) {
      clearInterval(E.tickTimer); E.tickTimer = null;
      $("#overlay-tempo").classList.remove("hidden");
      enviar(true);
    }
  }, 1000);
}
$("#btn-tempo-ok").addEventListener("click", () => $("#overlay-tempo").classList.add("hidden"));

// ===========================================================================
// PAINEL DOCENTE
// ===========================================================================
$("#btn-pin").addEventListener("click", conferirPin);
$("#in-pin").addEventListener("keydown", (e) => { if (e.key === "Enter") conferirPin(); });
$("#in-pin-sala").addEventListener("keydown", (e) => { if (e.key === "Enter") conferirPin(); });

async function conferirPin() {
  const pin = $("#in-pin").value.trim();
  const sala = $("#in-pin-sala").value.trim().toUpperCase();
  if (pin !== PIN_PROFESSOR) return ($("#erro-pin").textContent = "PIN incorreto.");
  if (sala.length !== 6) return ($("#erro-pin").textContent = "Informe o código da sala.");
  $("#erro-pin").textContent = "";
  try {
    await A.garantirLogin();
    E.salaDados = await A.lerSala(sala);
    E.sala = sala; E.prof = true;
    await A.sincronizarRelogio(sala);
    iniciarPainel();
  } catch (e) { $("#erro-pin").textContent = e.message || "Não foi possível abrir a sala."; }
}

let profAlunos = [];

function iniciarPainel() {
  limparUnsubs();
  mostrar("tela-prof");
  $("#prof-sala").textContent = E.sala;
  $("#prof-turma").textContent = E.salaDados?.turma || "";
  E.unsubs.push(A.observarSala(E.sala, (d) => { E.salaDados = d; renderPainelCabeca(); }));
  E.unsubs.push(A.observarAlunos(E.sala, (as) => { profAlunos = as; renderPainel(); }));
  if (!E.tickTimer) {
    E.tickTimer = setInterval(() => {
      const fim = E.salaDados?.etapa3?.fimMs, st = E.salaDados?.etapa3?.status;
      if (!fim || st !== "aberta") return;
      const resta = fim - A.agora();
      $("#prof-relogio").textContent = mmss(resta);
      $("#prof-relogio").classList.toggle("apertado", resta < 5 * 60000);
    }, 1000);
  }
}

function renderPainelCabeca() {
  const e3 = E.salaDados?.etapa3 || {};
  const dono = E.salaDados?.professorUid;
  const souDono = !dono || dono === A.estado.uid;
  let av = document.getElementById("aviso-dono");
  if (!souDono) {
    if (!av) { av = document.createElement("div"); av.id = "aviso-dono"; av.className = "box-info"; $("#prof-prontidao").before(av); }
    av.innerHTML = "<b>⚠ Este não é o navegador que criou a sala.</b> Você consegue acompanhar tudo por aqui, mas <b>não consegue abrir, encerrar nem dar mais tempo</b>. Para comandar a etapa, abra o painel no mesmo computador e navegador em que criou a sala.";
  } else if (av) av.remove();
  $("#btn-abrir").disabled = !souDono;
  $("#btn-encerrar").disabled = !souDono;
  $("#btn-mais-tempo").disabled = !souDono;
  const st = e3.status || "fechada";
  const pill = $("#prof-status");
  pill.textContent = { aberta: "Aberta", encerrada: "Encerrada", fechada: "Não aberta" }[st] || st;
  pill.className = `estado-pill ${st}`;
  $("#btn-abrir").textContent = st === "aberta" ? "Reabrir / renovar tempo" : "Abrir a Etapa 3 para a turma";
  if (e3.duracaoMin && st === "aberta") $("#in-duracao").value = String(e3.duracaoMin);
  if (st !== "aberta") $("#prof-relogio").textContent = "--:--";
}

/** Reconstrói as 12 questões de um aluno para corrigir (4 delas são personalizadas). */
function corrigirAluno(a) {
  const e3 = a.etapa3 || {};
  const ramo = e3.ramo || a.ramo;
  const cen = CENARIOS3[ramo];
  if (!cen) return null;
  const mao = (e3.mao || a.maoFinal || D.RAMO[ramo]?.idsEquipe || []).filter((x) => D.FUNCIONARIOS[x]);
  const lider = e3.lider || a.liderEscolhido || null;
  const qs = [...cen.questoes, ...questoesPessoais(cen, ramo, mao, lider, a.uid)];
  const perdoadas = e3.perdoadas || {};
  const anul = new Set(Object.keys(e3.anuladas || {}).filter((k) => e3.anuladas[k]));
  const perd = new Set(Object.keys(perdoadas).filter((k) => perdoadas[k]));
  return { qs, res: corrigir(qs, e3.respostas || {}, anul, perd), anulBrutas: [...anul], perdoadas };
}

function renderPainel() {
  renderProntidao();
  const comEtapa = profAlunos.filter((a) => a.etapa3?.status);
  const fazendo = comEtapa.filter((a) => a.etapa3.status === "fazendo");
  const concluidos = comEtapa.filter((a) => a.etapa3.status === "concluido");
  const naDisc = fazendo.filter((a) => (a.etapa3.i || 0) >= TOTAL_Q);
  const totalSaidas = comEtapa.reduce((s, a) => s + (Number(a.etapa3.saidas) || 0), 0);

  const dados = comEtapa.map((a) => ({ a, c: corrigirAluno(a) })).filter((x) => x.c);
  const notas = dados.filter((x) => x.a.etapa3.status === "concluido").map((x) => x.c.res.nota);
  const media = notas.length ? (notas.reduce((s, n) => s + n, 0) / notas.length) : null;

  $("#prof-numeros").innerHTML = `
    <div class="num-box"><b>${profAlunos.length}</b><span>na sala</span></div>
    <div class="num-box"><b>${comEtapa.length}</b><span>entraram na Etapa 3</span></div>
    <div class="num-box"><b>${fazendo.length - naDisc.length}</b><span>nas questões</span></div>
    <div class="num-box"><b>${naDisc.length}</b><span>na pergunta aberta</span></div>
    <div class="num-box"><b>${concluidos.length}</b><span>concluíram</span></div>
    <div class="num-box${totalSaidas ? " alerta" : ""}"><b>${totalSaidas}</b><span>saídas do app</span></div>
    <div class="num-box"><b>${media == null ? "—" : media.toFixed(1)}</b><span>nota média</span></div>`;

  const tot = Math.max(1, comEtapa.length);
  $("#bar-a").style.width = `${((fazendo.length - naDisc.length) / tot) * 100}%`;
  $("#bar-b").style.width = `${(naDisc.length / tot) * 100}%`;
  $("#bar-c").style.width = `${(concluidos.length / tot) * 100}%`;

  // ---- saídas ----
  const comSaida = dados.filter((x) => x.c.anulBrutas.length || Number(x.a.etapa3.saidas));
  $("#prof-saidas-resumo").textContent = comSaida.length ? `${comSaida.length} aluno(s)` : "nenhuma saída registrada";
  $("#prof-saidas").innerHTML = comSaida.length ? comSaida.map(({ a, c }) => {
    const itens = c.anulBrutas.map((qid) => {
      const k = c.qs.findIndex((q) => q.id === qid);
      const perd = c.perdoadas[qid];
      return `<span class="qs">Q${k + 1}${perd ? " (perdoada)" : ""}</span>
        <button class="link" data-perd="${esc(a.uid)}|${esc(qid)}|${perd ? "0" : "1"}">${perd ? "desfazer perdão" : "perdoar"}</button>`;
    }).join(" · ");
    return `<div class="saida-item"><span><b>${esc(a.nome)}</b> — ${Number(a.etapa3.saidas) || 0} saída(s)</span><span>${itens || "—"}</span></div>`;
  }).join("") : `<p class="dica">Ninguém saiu do aplicativo até agora.</p>`;
  $$("#prof-saidas [data-perd]").forEach((b) => b.addEventListener("click", async () => {
    const [uid, qid, liga] = b.dataset.perd.split("|");
    try {
      await (liga === "1" ? A.perdoarQuestao(E.sala, uid, qid) : A.desfazerPerdao(E.sala, uid, qid));
      aviso(liga === "1" ? "Questão perdoada: o ponto volta se o aluno tinha acertado." : "Perdão desfeito.");
    } catch (e) { aviso("Não foi possível alterar."); }
  }));

  // ---- tabela ----
  const ordenados = dados.slice().sort((x, y) => E.profOrdem === "nota"
    ? (y.c.res.nota - x.c.res.nota) || String(x.a.nome).localeCompare(String(y.a.nome), "pt-BR")
    : String(x.a.nome).localeCompare(String(y.a.nome), "pt-BR"));
  $("#prof-tabela").innerHTML = ordenados.length ? `<table><thead><tr>
      <th>Aluno</th><th>Ramo</th><th>Nota</th><th>Pontos</th><th>Acertos</th>
      <th>Mercado<br />(8)</th><th>Equipe<br />(4)</th><th>Zeradas</th><th>Etapa 2</th><th>Situação</th></tr></thead><tbody>
    ${ordenados.map(({ a, c }) => {
      const e3 = a.etapa3, r = c.res;
      const fim = e3.status === "concluido";
      return `<tr${fim ? "" : ' class="destaque"'}>
        <td class="nome-col">${esc(a.nome)}${e3.avulso ? ' <span class="pill avulso">avulso</span>' : ""}${e3.incompleto && !e3.avulso ? ' <span class="pill avulso">equipe ideal</span>' : ""}</td>
        <td>${esc(D.RAMO[e3.ramo || a.ramo]?.nome || "—")}</td>
        <td class="nota">${fim ? r.nota.toFixed(1) : "—"}</td>
        <td>${fim ? `${r.pontos.toFixed(1)}/${r.pontosTotais}${r.excluidas ? "*" : ""}` : "—"}</td>
        <td>${fim ? `${r.acertos}/12` : `${Object.keys(e3.respostas || {}).length}/12`}</td>
        <td>${fim ? `${r.acertosFixas}/8` : "—"}</td>
        <td>${fim ? `${r.acertosPessoais}/4` : "—"}</td>
        <td>${r.anuladas ? `<span class="pill nao">${r.anuladas}</span>` : "0"}${r.excluidas ? ` <span class="pill ok">${r.excluidas} perd.</span>` : ""}</td>
        <td>${a.liderCerto == null ? "—" : a.liderCerto ? '<span class="pill ok">líder certo</span>' : '<span class="pill nao">líder errado</span>'}</td>
        <td>${fim ? '<span class="pill ok">concluiu</span>' : `<span class="pill">na questão ${Math.min((e3.i || 0) + 1, TOTAL_Q)}</span>`}</td></tr>`;
    }).join("")}</tbody></table>` : `<p class="dica">Ninguém entrou na Etapa 3 ainda.</p>`;

  // ---- acerto por questão ----
  const fin = dados.filter((x) => x.a.etapa3.status === "concluido");
  $("#prof-questoes").innerHTML = fin.length ? Array.from({ length: TOTAL_Q }, (_, k) => {
    const acertos = fin.filter((x) => x.c.res.itens[k]?.acertou).length;
    const pc = Math.round((acertos / fin.length) * 100);
    const cls = pc < 40 ? "baixo" : pc < 70 ? "meio" : "";
    const exemplo = fin[0].c.qs[k];
    const rot = k < 8 ? `Q${k + 1} · ${exemplo.teoria.split(" · ")[0]}` : `Q${k + 1} · ${exemplo.titulo || "sua equipe"}`;
    return `<div class="q-barra"><span class="rot">${esc(rot)}</span>
      <span class="trilha"><span class="ench ${cls}" style="width:${pc}%"></span></span>
      <span class="pc">${pc}%</span></div>`;
  }).join("") : `<p class="dica">Aparece quando o primeiro aluno concluir.</p>`;

  // ---- discursivas ----
  const comTexto = dados.filter((x) => String(x.a.etapa3.discursiva || "").trim().length > 20);
  $("#prof-disc-resumo").textContent = `${comTexto.length} resposta(s)`;
  const PARAR = new Set("a o as os de da do das dos e em no na nos nas um uma que para por com mais muito nao não foi ser era eu meu minha eles elas se ao aos pela pelo sobre como mas tambem também ja já isso esse essa este esta quando porque entao então tinha tive ter sem dos qual quais onde ate até das pra".split(" "));
  const freq = {};
  comTexto.forEach((x) => A.normalizar(x.a.etapa3.discursiva).split(" ").forEach((w) => {
    if (w.length > 3 && !PARAR.has(w)) freq[w] = (freq[w] || 0) + 1;
  }));
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 22);
  $("#prof-palavras").innerHTML = top.map(([w, n]) => `<span class="palavra">${esc(w)} <b>${n}</b></span>`).join("");
  $("#prof-discursivas").innerHTML = comTexto.length
    ? comTexto.map(({ a }) => `<div class="disc-item"><div class="dq">${esc(a.nome)} · ${esc(D.RAMO[a.etapa3.ramo || a.ramo]?.nome || "")}</div><p>${esc(a.etapa3.discursiva)}</p></div>`).join("")
    : `<p class="dica">Nenhuma resposta aberta enviada ainda.</p>`;
}

/** Antes de abrir: quantos da turma realmente concluíram a Etapa 2. */
function renderProntidao() {
  const n = profAlunos.length;
  if (!n) { $("#prof-prontidao").innerHTML = `<div class="box-info">Esta sala ainda não tem alunos.</div>`; return; }
  const prontos = profAlunos.filter((a) => (a.maoFinal || []).length && a.liderEscolhido);
  const semLider = profAlunos.filter((a) => (a.maoFinal || []).length && !a.liderEscolhido);
  const semEquipe = profAlunos.filter((a) => !(a.maoFinal || []).length);
  if (!semLider.length && !semEquipe.length) {
    $("#prof-prontidao").innerHTML = `<div class="box-info"><b>Turma pronta:</b> os ${n} alunos concluíram a Etapa 2, então cada um entra com a equipe e o líder que escolheu.</div>`;
    return;
  }
  const li = [];
  if (prontos.length) li.push(`<li><b>${prontos.length}</b> concluíram a Etapa 2 — entram com a equipe e o líder que escolheram;</li>`);
  if (semLider.length) li.push(`<li><b>${semLider.length}</b> fecharam a equipe mas não indicaram líder — entram com a equipe própria e a questão do líder se adapta;</li>`);
  if (semEquipe.length) li.push(`<li><b>${semEquipe.length}</b> não fecharam equipe — entram com a <b>equipe ideal</b> do ramo, avisados na tela e marcados na tabela.</li>`);
  $("#prof-prontidao").innerHTML = `<div class="box-info"><b>Prontidão da turma (${n} alunos):</b><ul style="margin:6px 0 0;padding-left:20px">${li.join("")}</ul></div>`;
}

$("#btn-ordenar").addEventListener("click", () => {
  E.profOrdem = E.profOrdem === "nota" ? "nome" : "nota";
  $("#btn-ordenar").textContent = `ordenar por ${E.profOrdem === "nota" ? "nome" : "nota"}`;
  renderPainel();
});

const ERRO_DONO = "Só o navegador em que esta sala foi criada pode comandar a etapa. Abra o painel no mesmo computador e navegador que você usou para criar a sala.";
const comandar = async (f, ok) => {
  try { await f(); aviso(ok); }
  catch (e) { aviso(e?.code === "permission-denied" ? ERRO_DONO : "Não foi possível. Verifique a internet.", 10000); }
};
$("#btn-abrir").addEventListener("click", () => comandar(() => A.abrirEtapa3(E.sala, $("#in-duracao").value), "Etapa 3 aberta para a turma."));
$("#btn-encerrar").addEventListener("click", () => comandar(() => A.encerrarEtapa3(E.sala), "Etapa 3 encerrada."));
$("#btn-mais-tempo").addEventListener("click", () => comandar(() => A.maisTempo(E.sala, 5, E.salaDados?.etapa3?.fimMs), "+5 minutos."));

$("#btn-csv").addEventListener("click", () => {
  const dados = profAlunos.filter((a) => a.etapa3?.status).map((a) => ({ a, c: corrigirAluno(a) })).filter((x) => x.c);
  const cab = ["Nome", "Ramo", "Situacao", "Nota (0-10)", "Pontos", `Total (${PONTOS_TOTAIS})`, "Acertos (12)",
    "Acertos mercado (8)", "Acertos equipe (4)", "Zeradas pela trava", "Saidas do app",
    "Lider certo na Etapa 2", "Equipe final Etapa 2 (de 6)", "Avulso", "Entrou com equipe ideal", "Discursiva",
    ...Array.from({ length: TOTAL_Q }, (_, k) => `Q${k + 1}`)];
  const linhas = dados.map(({ a, c }) => {
    const e3 = a.etapa3, r = c.res;
    return [a.nome, D.RAMO[e3.ramo || a.ramo]?.nome || "", e3.status,
      e3.status === "concluido" ? r.nota.toFixed(2).replace(".", ",") : "",
      r.pontos.toFixed(2).replace(".", ","), String(PONTOS_TOTAIS).replace(".", ","),
      r.acertos, r.acertosFixas, r.acertosPessoais, r.anuladas, Number(e3.saidas) || 0,
      a.liderCerto == null ? "" : a.liderCerto ? "sim" : "nao",
      a.equipeFinal ?? "", e3.avulso ? "sim" : "nao", e3.incompleto ? "sim" : "nao",
      String(e3.discursiva || "").replace(/\s+/g, " "),
      ...r.itens.map((it) => (it.anulada ? "zerada" : it.acertou ? "1" : "0"))];
  });
  const csv = "﻿" + [cab, ...linhas].map((l) => l.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = `etapa3-${E.sala}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
});

$("#btn-sair-prof").addEventListener("click", () => {
  limparUnsubs();
  if (E.tickTimer) { clearInterval(E.tickTimer); E.tickTimer = null; }
  E.prof = false; mostrar("tela-entrar");
});

// Atalho: ?sala=7Y5TZ4 preenche o código
try {
  const p = new URLSearchParams(location.search).get("sala");
  if (p) $("#in-sala").value = p.toUpperCase().slice(0, 6);
} catch (e) {}
