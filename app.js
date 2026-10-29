// app.js — Dinâmica de Grupo: Habilidades e Competências (versão digital, v2)
//   - Cada aluno recebe 6 cartas; o jogo usa 1 profissão por aluno (2 a 10 alunos por sala)
//   - Alunos trocam cartas 1-para-1 (proposta com argumento -> aceite/recusa)
//   - Objetivo: reunir as 6 cartas corretas (3H+3C) de UMA profissão
//   - Professor: cronômetro, dicas, ranking e encerramento com debriefing

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, where,
  writeBatch, runTransaction, serverTimestamp, orderBy, getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";
import { PROFISSOES, buildDeck, checarConjuntoCompleto, distribuir, MAX_ALUNOS } from "./data.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DECK = buildDeck();
const DECK_BY_ID = Object.fromEntries(DECK.map((c) => [c.id, c]));

const state = { uid: null, roomCode: null, role: null, nome: null, unsubs: [] };

function clearListeners() {
  state.unsubs.forEach((fn) => fn && fn());
  state.unsubs = [];
}

function gerarCodigoSala() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  return code;
}

// Sessão salva no navegador para retomar após recarregar/fechar a aba
const SESSAO_KEY = "dinamica-rh-sessao";
function salvarSessao(s) { try { localStorage.setItem(SESSAO_KEY, JSON.stringify(s)); } catch (e) {} }
function lerSessao() { try { return JSON.parse(localStorage.getItem(SESSAO_KEY) || "null"); } catch (e) { return null; } }
function limparSessao() { try { localStorage.removeItem(SESSAO_KEY); } catch (e) {} }

let loginPromise = null;
function garantirLogin() {
  if (state.uid) return Promise.resolve(state.uid);
  if (!loginPromise) {
    loginPromise = new Promise((resolve, reject) => {
      const off = onAuthStateChanged(auth, (user) => {
        if (user) { state.uid = user.uid; off(); resolve(user.uid); }
      });
      // signInAnonymously espera a restauração da sessão e reaproveita o usuário anônimo já salvo
      signInAnonymously(auth).catch(reject);
    });
  }
  return loginPromise;
}

// Jogo aberto para trocas? (status jogando e cronômetro não esgotado)
function jogoAberto(room) {
  if (!room || room.status !== "jogando") return false;
  if (room.fimEm && Date.now() > room.fimEm) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Professor
// ---------------------------------------------------------------------------
async function criarSala(nomeProfessor) {
  await garantirLogin();
  let code;
  for (let t = 0; t < 5; t++) {
    code = gerarCodigoSala();
    const snap = await getDoc(doc(db, "rooms", code));
    if (!snap.exists()) break;
  }
  await setDoc(doc(db, "rooms", code), {
    professorUid: state.uid,
    professorNome: nomeProfessor || "Professor(a)",
    status: "lobby", // lobby -> jogando -> finalizado
    dica: "",
    criadoEm: serverTimestamp(),
  });
  return code;
}

async function iniciarJogo(roomCode, duracaoMin) {
  const snap = await getDocs(collection(db, "rooms", roomCode, "students"));
  const uids = snap.docs.map((d) => d.id);
  const { codigos, maos } = distribuir(uids); // valida 2..10 alunos

  const batch = writeBatch(db);
  for (const uid of uids) {
    for (const cardId of maos[uid]) {
      batch.set(doc(db, "rooms", roomCode, "cards", cardId), { donoUid: uid });
    }
  }
  const dados = { status: "jogando", iniciadoEm: serverTimestamp(), profissoesAtivas: codigos };
  const min = Number(duracaoMin);
  if (min > 0) dados.fimEm = Date.now() + min * 60000;
  batch.update(doc(db, "rooms", roomCode), dados);
  await batch.commit();
}

async function enviarDica(roomCode, texto) {
  await updateDoc(doc(db, "rooms", roomCode), { dica: texto });
}

async function encerrarJogo(roomCode) {
  await updateDoc(doc(db, "rooms", roomCode), { status: "finalizado" });
}

async function adicionarTempo(roomCode, minutos, fimAtual) {
  const base = Math.max(Date.now(), fimAtual || Date.now());
  await updateDoc(doc(db, "rooms", roomCode), { fimEm: base + minutos * 60000 });
}

// ---------------------------------------------------------------------------
// Aluno
// ---------------------------------------------------------------------------
async function entrarNaSala(roomCode, nomeAluno) {
  await garantirLogin();
  const roomSnap = await getDoc(doc(db, "rooms", roomCode));
  if (!roomSnap.exists()) throw new Error("Código de sala não encontrado.");
  const room = roomSnap.data();
  const meuRef = doc(db, "rooms", roomCode, "students", state.uid);
  const meu = await getDoc(meuRef);

  if (meu.exists()) return room; // reconexão: mantém cartas e progresso

  if (room.status !== "lobby") {
    throw new Error("O jogo desta sala já começou. Peça ao(à) professor(a) o código de outra sala.");
  }
  const alunos = await getDocs(collection(db, "rooms", roomCode, "students"));
  if (alunos.size >= MAX_ALUNOS) {
    throw new Error(`Esta sala já tem ${MAX_ALUNOS} alunos (lotada). Peça o código de outra sala.`);
  }
  await setDoc(meuRef, { nome: nomeAluno, entrouEm: serverTimestamp(), completo: false, profissaoCompleta: null }, { merge: true });
  return room;
}

async function lerSala(roomCode) {
  const s = await getDoc(doc(db, "rooms", roomCode));
  return s.exists() ? s.data() : null;
}

async function proporTroca(roomCode, paraUid, paraNome, cartaOferecidaId, cartaPedidaId, argumento) {
  const room = await lerSala(roomCode);
  if (!jogoAberto(room)) throw new Error("As trocas estão encerradas.");
  const tradeRef = doc(collection(db, "rooms", roomCode, "trades"));
  const dados = {
    deUid: state.uid, deNome: state.nome, paraUid, paraNome,
    cartaOferecidaId, cartaPedidaId, status: "pendente", criadoEm: serverTimestamp(),
  };
  if (argumento) dados.argumento = argumento.slice(0, 140);
  await setDoc(tradeRef, dados);
}

async function cancelarTroca(roomCode, tradeId) {
  await updateDoc(doc(db, "rooms", roomCode, "trades", tradeId), { status: "cancelada" });
}

async function recusarTroca(roomCode, tradeId) {
  await updateDoc(doc(db, "rooms", roomCode, "trades", tradeId), { status: "recusada" });
}

async function aceitarTroca(roomCode, tradeId) {
  const room = await lerSala(roomCode);
  if (!jogoAberto(room)) throw new Error("As trocas estão encerradas.");
  await runTransaction(db, async (tx) => {
    const tradeRef = doc(db, "rooms", roomCode, "trades", tradeId);
    const tradeSnap = await tx.get(tradeRef);
    if (!tradeSnap.exists()) throw new Error("Proposta não existe mais.");
    const trade = tradeSnap.data();
    if (trade.status !== "pendente") throw new Error("Esta proposta já foi resolvida.");

    const ofRef = doc(db, "rooms", roomCode, "cards", trade.cartaOferecidaId);
    const peRef = doc(db, "rooms", roomCode, "cards", trade.cartaPedidaId);
    const [ofSnap, peSnap] = await Promise.all([tx.get(ofRef), tx.get(peRef)]);
    if (ofSnap.data()?.donoUid !== trade.deUid) throw new Error("A carta oferecida já mudou de dono. Peça uma nova proposta.");
    if (peSnap.data()?.donoUid !== trade.paraUid) throw new Error("A carta pedida já mudou de dono. Peça uma nova proposta.");

    tx.update(ofRef, { donoUid: trade.paraUid });
    tx.update(peRef, { donoUid: trade.deUid });
    tx.update(tradeRef, { status: "aceita", resolvidoEm: serverTimestamp() });
  });
}

// Cada aluno verifica a própria mão e se autodeclara "completo" (uma única vez)
async function autoverificarConjunto(roomCode, minhasCartaIds) {
  const resultado = checarConjuntoCompleto(minhasCartaIds.map((id) => DECK_BY_ID[id]).filter(Boolean));
  if (!resultado) return null;
  const ref = doc(db, "rooms", roomCode, "students", state.uid);
  const atual = await getDoc(ref);
  if (!atual.data()?.completo) {
    await updateDoc(ref, { completo: true, profissaoCompleta: resultado.nome, completoEm: serverTimestamp() });
  }
  return resultado;
}

window.CDA = {
  state, DECK, DECK_BY_ID, PROFISSOES, MAX_ALUNOS,
  garantirLogin, criarSala, iniciarJogo, enviarDica, encerrarJogo, adicionarTempo,
  entrarNaSala, proporTroca, cancelarTroca, recusarTroca, aceitarTroca, autoverificarConjunto,
  jogoAberto, salvarSessao, lerSessao, limparSessao, clearListeners,
  db, onSnapshot, doc, collection, query, where, orderBy, getDocs,
};
