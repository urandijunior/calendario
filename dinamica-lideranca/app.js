// app.js — Mercado de Talentos: Liderança (lógica de jogo + Firestore)
//   - Cada aluno escolhe 1 de 10 ramos ao entrar e recebe 6 funcionários (cartas)
//   - Trocas 1-por-1 entre alunos; cada troca aceita conta para OS DOIS (máx. 8 por aluno)
//   - Proposta expira em 1 minuto e meio; pode ser recusada na hora
//   - Ao fechar a equipe ideal (6/6), esgotar as trocas ou acabar o tempo → questionário do líder
//   - Classificação: 5 perfeitas (1,0) · 8 ideais (0,8) · 3 equilibradas (0,6) · demais 0,5

import {
  initializeApp, getAuth, signInAnonymously, onAuthStateChanged,
  getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, where,
  writeBatch, runTransaction, serverTimestamp, getDocs,
} from "./firebase.js";
import { firebaseConfig } from "./firebase-config.js";
import * as D from "./data.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const state = { uid: null, roomCode: null, role: null, nome: null, unsubs: [], offset: 0 };
const agora = () => Date.now() + state.offset; // relógio corrigido pelo servidor

function clearListeners() { state.unsubs.forEach((fn) => fn && fn()); state.unsubs = []; }

function gerarCodigoSala() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  return code;
}

const SESSAO_KEY = "dinamica-lideranca-sessao";
function salvarSessao(s) { try { localStorage.setItem(SESSAO_KEY, JSON.stringify(s)); } catch (e) {} }
function lerSessao() { try { return JSON.parse(localStorage.getItem(SESSAO_KEY) || "null"); } catch (e) { return null; } }
function limparSessao() { try { localStorage.removeItem(SESSAO_KEY); } catch (e) {} }

let loginPromise = null;
function garantirLogin() {
  if (state.uid) return Promise.resolve(state.uid);
  if (!loginPromise) {
    loginPromise = new Promise((resolve, reject) => {
      const off = onAuthStateChanged(auth, (user) => { if (user) { state.uid = user.uid; off(); resolve(user.uid); } });
      signInAnonymously(auth).catch(reject);
    });
  }
  return loginPromise;
}

// Acerta o relógio do aparelho com o do servidor (a validade da proposta depende disso)
async function sincronizarRelogio(ref) {
  try {
    const t0 = Date.now();
    await updateDoc(ref, { ping: serverTimestamp() });
    const s = await getDoc(ref);
    const t1 = Date.now();
    const srv = s.data()?.ping?.toMillis?.();
    if (srv) state.offset = srv - (t0 + t1) / 2;
  } catch (e) { /* sem ajuste: segue com o relógio local */ }
}

function jogoAberto(room) {
  if (!room || room.status !== "jogando") return false;
  if (room.fimEm && agora() > room.fimEm) return false;
  return true;
}
const ms = (t) => (t?.toMillis ? t.toMillis() : typeof t === "number" ? t : null);
function expirou(trade) {
  const t = ms(trade.criadoEm) ?? trade.criadoMs;
  return t != null && agora() - t > D.VALIDADE_PROPOSTA_MS;
}

// ---------------------------------------------------------------------------
// Professor
// ---------------------------------------------------------------------------
async function criarSala(nomeProfessor, turma) {
  await garantirLogin();
  let code;
  for (let t = 0; t < 5; t++) {
    code = gerarCodigoSala();
    const snap = await getDoc(doc(db, "rooms", code));
    if (!snap.exists()) break;
  }
  await setDoc(doc(db, "rooms", code), {
    tipo: "lideranca",
    professorUid: state.uid,
    professorNome: nomeProfessor || "Professor(a)",
    turma: (turma || "").slice(0, 60),
    criadoMs: Date.now(),
    status: "lobby", // lobby → jogando → finalizado (trocas encerradas) ; resultadoPublicado
    dica: "",
    maxTrocas: D.MAX_TROCAS,
    criadoEm: serverTimestamp(),
  });
  await sincronizarRelogio(doc(db, "rooms", code));
  return code;
}

async function iniciarJogo(roomCode, duracaoMin, numImpostores = D.IMPOSTORES_PADRAO, votosParaDescobrir = D.VOTOS_PARA_DESCOBRIR_PADRAO) {
  const snap = await getDocs(collection(db, "rooms", roomCode, "students"));
  const alunos = snap.docs.map((d) => ({ uid: d.id, ramo: d.data().ramo })).filter((a) => D.RAMO[a.ramo]);
  const maos = D.distribuir(alunos);
  const ops = [];
  for (const a of alunos) {
    for (const cardId of maos[a.uid]) ops.push([doc(db, "rooms", roomCode, "cards", cardId), { donoUid: a.uid }]);
    ops.push([doc(db, "rooms", roomCode, "students", a.uid), { fase: "negociando", trocas: 0, equipeInicial: D.proximidade(a.ramo, maos[a.uid]) }, true]);
  }
  // Sorteio secreto dos impostores: cada aluno tem um documento de papel (o de todos existe, para não denunciar ninguém)
  const nImp = alunos.length >= D.MIN_ALUNOS_IMPOSTOR ? Math.max(0, Math.min(2, Number(numImpostores) || 0)) : 0;
  const sorteio = [...alunos].sort(() => Math.random() - 0.5).slice(0, nImp).map((a) => a.uid);
  const missoes = Object.keys(D.MISSOES).sort(() => Math.random() - 0.5);
  for (const a of alunos) {
    const i = sorteio.indexOf(a.uid);
    ops.push([doc(db, "rooms", roomCode, "papeis", a.uid), i >= 0 ? { papel: "impostor", missao: missoes[i % missoes.length] } : { papel: "equipe" }]);
  }
  // lotes de até 400 escritas
  for (let i = 0; i < ops.length; i += 400) {
    const batch = writeBatch(db);
    ops.slice(i, i + 400).forEach(([ref, data, upd]) => (upd ? batch.update(ref, data) : batch.set(ref, data)));
    await batch.commit();
  }
  const dados = { status: "jogando", iniciadoEm: serverTimestamp(), ramosAtivos: [...new Set(alunos.map((a) => a.ramo))], numImpostores: nImp, votosParaDescobrir: Math.max(1, Math.min(3, Number(votosParaDescobrir) || D.VOTOS_PARA_DESCOBRIR_PADRAO)) };
  const min = Number(duracaoMin);
  if (min > 0) dados.fimEm = agora() + min * 60000;
  await updateDoc(doc(db, "rooms", roomCode), dados);
}

const enviarDica = (roomCode, texto) => updateDoc(doc(db, "rooms", roomCode), { dica: texto });
const encerrarNegociacao = (roomCode) => updateDoc(doc(db, "rooms", roomCode), { status: "finalizado", encerradoEm: agora() });
// Ao publicar, os impostores são revelados para a turma (com o resultado de cada um)
const publicarResultado = (roomCode, v = true, revelados = []) =>
  updateDoc(doc(db, "rooms", roomCode), { resultadoPublicado: v, impostoresRevelados: v ? revelados : [] });
async function lerMeuPapel(roomCode) {
  const s = await getDoc(doc(db, "rooms", roomCode, "papeis", state.uid));
  return s.exists() ? s.data() : { papel: "equipe" };
}
const votar = (roomCode, suspeitoUid) => updateDoc(doc(db, "rooms", roomCode, "students", state.uid), { voto: suspeitoUid || "ninguem", votoEm: serverTimestamp() });

// Resultado da sala gravado no próprio documento da sala (foto da classificação e das notas)
const salvarResultado = (roomCode, resultado) => updateDoc(doc(db, "rooms", roomCode), { resultado, resultadoSalvoEm: serverTimestamp() });

// Histórico: salas desta dinâmica e da dinâmica de RH (Habilidades e Competências),
// que usa a mesma coleção "rooms" do projeto "aplicativos" sem o campo "tipo".
const tempoSala = (r) => r.criadoMs || r.criadoEm?.toMillis?.() || 0;
async function listarSalas() {
  let salas;
  try {
    const snap = await getDocs(collection(db, "rooms"));
    salas = snap.docs.map((d) => ({ codigo: d.id, ...d.data() }))
      .map((r) => ({ ...r, dinamica: r.tipo === "lideranca" ? "lideranca" : r.tipo ? r.tipo : r.professorUid ? "rh" : "outra" }))
      .filter((r) => r.dinamica === "lideranca" || r.dinamica === "rh");
  } catch (e) {
    // se as regras não permitirem listar tudo, mostra ao menos as salas de liderança
    const snap = await getDocs(query(collection(db, "rooms"), where("tipo", "==", "lideranca")));
    salas = snap.docs.map((d) => ({ codigo: d.id, ...d.data(), dinamica: "lideranca" }));
  }
  return salas.sort((a, b) => tempoSala(b) - tempoSala(a));
}
async function lerTrades(roomCode) {
  try {
    const snap = await getDocs(collection(db, "rooms", roomCode, "trades"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) { return null; }
}
const rotularSala = (roomCode, turma) => updateDoc(doc(db, "rooms", roomCode), { turma: (turma || "").slice(0, 60) });
async function lerAlunos(roomCode) {
  const snap = await getDocs(collection(db, "rooms", roomCode, "students"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}
async function adicionarTempo(roomCode, minutos, fimAtual) {
  const base = Math.max(agora(), fimAtual || agora());
  await updateDoc(doc(db, "rooms", roomCode), { fimEm: base + minutos * 60000 });
}

// ---------------------------------------------------------------------------
// Aluno
// ---------------------------------------------------------------------------
async function entrarNaSala(roomCode, nomeAluno, ramo) {
  await garantirLogin();
  const roomSnap = await getDoc(doc(db, "rooms", roomCode));
  if (!roomSnap.exists()) throw new Error("Código de sala não encontrado.");
  const room = roomSnap.data();
  if (room.tipo !== "lideranca") throw new Error("Este código é de outra dinâmica.");
  const meuRef = doc(db, "rooms", roomCode, "students", state.uid);
  const meu = await getDoc(meuRef);
  if (meu.exists()) { await sincronizarRelogio(meuRef); return { room, aluno: meu.data() }; } // reconexão
  if (room.status !== "lobby") throw new Error("A dinâmica desta sala já começou. Avise o(a) professor(a).");
  if (!D.RAMO[ramo]) throw new Error("Escolha um ramo de atividade.");
  const alunos = await getDocs(collection(db, "rooms", roomCode, "students"));
  if (alunos.size >= D.MAX_ALUNOS) throw new Error(`Esta sala já tem ${D.MAX_ALUNOS} alunos.`);
  const dados = { nome: nomeAluno, ramo, entrouEm: serverTimestamp(), fase: "espera", trocas: 0 };
  await setDoc(meuRef, dados, { merge: true });
  await sincronizarRelogio(meuRef);
  return { room, aluno: dados };
}

async function trocarRamo(roomCode, ramo) {
  const room = (await getDoc(doc(db, "rooms", roomCode))).data();
  if (room?.status !== "lobby") throw new Error("O jogo já começou: o ramo não pode mais ser trocado.");
  await updateDoc(doc(db, "rooms", roomCode, "students", state.uid), { ramo });
}

const salvarRecado = (roomCode, texto) => updateDoc(doc(db, "rooms", roomCode, "students", state.uid), { recado: texto.slice(0, 80) });

async function proporTroca(roomCode, para, cartaOferecidaId, cartaPedidaId, argumento, abertas) {
  const [roomSnap, euSnap, eleSnap] = await Promise.all([
    getDoc(doc(db, "rooms", roomCode)),
    getDoc(doc(db, "rooms", roomCode, "students", state.uid)),
    getDoc(doc(db, "rooms", roomCode, "students", para.uid)),
  ]);
  if (!jogoAberto(roomSnap.data())) throw new Error("As trocas estão encerradas.");
  const eu = euSnap.data(), ele = eleSnap.data();
  if (eu?.fase !== "negociando") throw new Error("Você já encerrou a negociação.");
  if ((eu.trocas || 0) >= D.MAX_TROCAS) throw new Error("Você já usou as suas 8 trocas.");
  if (ele?.fase !== "negociando") throw new Error(`${para.nome} já encerrou a negociação.`);
  if ((ele.trocas || 0) >= D.MAX_TROCAS) throw new Error(`${para.nome} já usou as 8 trocas.`);
  if (abertas >= D.MAX_PROPOSTAS_ABERTAS) throw new Error(`Você já tem ${D.MAX_PROPOSTAS_ABERTAS} propostas abertas. Espere uma resposta ou cancele.`);
  const dados = {
    deUid: state.uid, deNome: state.nome, paraUid: para.uid, paraNome: para.nome,
    cartaOferecidaId, cartaPedidaId, status: "pendente", criadoEm: serverTimestamp(), criadoMs: agora(),
  };
  if (argumento) dados.argumento = argumento.slice(0, 140);
  await setDoc(doc(collection(db, "rooms", roomCode, "trades")), dados);
}

async function resolverSePendente(roomCode, tradeId, status) {
  await runTransaction(db, async (tx) => {
    const ref = doc(db, "rooms", roomCode, "trades", tradeId);
    const snap = await tx.get(ref);
    if (snap.exists() && snap.data().status === "pendente") tx.update(ref, { status, resolvidoEm: serverTimestamp() });
  });
}
const cancelarTroca = (r, t) => resolverSePendente(r, t, "cancelada");
const recusarTroca = (r, t) => resolverSePendente(r, t, "recusada");
const expirarTroca = (r, t) => resolverSePendente(r, t, "expirada");

async function aceitarTroca(roomCode, tradeId) {
  const room = (await getDoc(doc(db, "rooms", roomCode))).data();
  if (!jogoAberto(room)) throw new Error("As trocas estão encerradas.");
  const r = await runTransaction(db, async (tx) => {
    const tradeRef = doc(db, "rooms", roomCode, "trades", tradeId);
    const tradeSnap = await tx.get(tradeRef);
    if (!tradeSnap.exists()) throw new Error("Proposta não existe mais.");
    const t = tradeSnap.data();
    if (t.status !== "pendente") throw new Error("Esta proposta já foi resolvida.");
    if (expirou(t)) { tx.update(tradeRef, { status: "expirada", resolvidoEm: serverTimestamp() }); return "expirada"; }
    const ofRef = doc(db, "rooms", roomCode, "cards", t.cartaOferecidaId);
    const peRef = doc(db, "rooms", roomCode, "cards", t.cartaPedidaId);
    const deRef = doc(db, "rooms", roomCode, "students", t.deUid);
    const paraRef = doc(db, "rooms", roomCode, "students", t.paraUid);
    const [of, pe, de, pa] = await Promise.all([tx.get(ofRef), tx.get(peRef), tx.get(deRef), tx.get(paraRef)]);
    const A = de.data(), B = pa.data();
    const fechou = A?.fase !== "negociando" || B?.fase !== "negociando";
    const semTrocas = (A?.trocas || 0) >= D.MAX_TROCAS || (B?.trocas || 0) >= D.MAX_TROCAS;
    if (fechou || semTrocas) { tx.update(tradeRef, { status: "cancelada", resolvidoEm: serverTimestamp() }); return fechou ? "fechou" : "semtrocas"; }
    if (of.data()?.donoUid !== t.deUid || pe.data()?.donoUid !== t.paraUid) {
      tx.update(tradeRef, { status: "cancelada", resolvidoEm: serverTimestamp() });
      return "mudou";
    }
    tx.update(ofRef, { donoUid: t.paraUid });
    tx.update(peRef, { donoUid: t.deUid });
    tx.update(deRef, { trocas: (A.trocas || 0) + 1 });
    tx.update(paraRef, { trocas: (B.trocas || 0) + 1 });
    const efeito = {
      [t.deUid]: D.efeitoTroca(A.ramo, t.cartaPedidaId, t.cartaOferecidaId),
      [t.paraUid]: D.efeitoTroca(B.ramo, t.cartaOferecidaId, t.cartaPedidaId),
    };
    tx.update(tradeRef, { status: "aceita", resolvidoEm: serverTimestamp(), aceitaMs: agora(), efeito });
    return "ok";
  });
  const msg = {
    expirada: "⌛ Essa proposta expirou (passou de 1 minuto e meio).",
    fechou: "Essa proposta perdeu o efeito: um dos dois já encerrou a negociação.",
    semtrocas: "Essa proposta perdeu o efeito: um dos dois já usou as 8 trocas.",
    mudou: "⌛ Essa proposta ficou desatualizada: a carta já mudou de mãos.",
  }[r];
  if (msg) throw new Error(msg);
}

// Encerra a negociação do aluno e congela a equipe para o questionário do líder
async function encerrarMinhaNegociacao(roomCode, ramo, cardIds, motivo) {
  const ref = doc(db, "rooms", roomCode, "students", state.uid);
  await runTransaction(db, async (tx) => {
    const s = await tx.get(ref);
    if (s.data()?.fase !== "negociando") return;
    tx.update(ref, {
      fase: "lider", motivoFim: motivo, equipeFinal: D.proximidade(ramo, cardIds),
      maoFinal: cardIds.map(D.funcId), negociacaoFimEm: serverTimestamp(),
    });
  });
}

async function concluirQuestionario(roomCode, aluno, respostas, liderEscolhido, justificativa) {
  const mao = aluno.maoFinal || [];
  const acertos = D.corrigirQuestionario(aluno.ramo, mao, respostas);
  await updateDoc(doc(db, "rooms", roomCode, "students", state.uid), {
    fase: "concluido", respostas, liderEscolhido, justificativa: (justificativa || "").slice(0, 280),
    liderCerto: liderEscolhido === D.RAMO[aluno.ramo].liderId, acertos, concluidoEm: serverTimestamp(),
  });
}

window.LID = {
  state, D, agora, expirou, ms, jogoAberto,
  garantirLogin, criarSala, iniciarJogo, enviarDica, encerrarNegociacao, publicarResultado, adicionarTempo, salvarResultado, lerMeuPapel, votar, listarSalas, lerAlunos, lerTrades, rotularSala,
  entrarNaSala, trocarRamo, salvarRecado, proporTroca, cancelarTroca, recusarTroca, expirarTroca, aceitarTroca,
  encerrarMinhaNegociacao, concluirQuestionario, sincronizarRelogio,
  salvarSessao, lerSessao, limparSessao, clearListeners,
  db, onSnapshot, doc, collection, query, where, getDocs,
};
