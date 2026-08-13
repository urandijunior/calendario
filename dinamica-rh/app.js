// app.js — Dinâmica de Grupo: Habilidades e Competências (versão digital)
// Preserva 1:1 a lógica do jogo físico:
//   - 60 cartas (10 profissões x 3 habilidades + 3 competências)
//   - Cada aluno recebe 6 cartas embaralhadas aleatoriamente
//   - Alunos trocam cartas 1-para-1 entre si (proposta -> aceite/recusa)
//   - Objetivo: reunir as 6 cartas corretas (3H+3C) de UMA profissão
//   - Professor pode dar dicas e acompanha o progresso em tempo real
//
// Todo o conteúdo das cartas (texto, tipo, profissão) vive em data.JS e NUNCA
// trafega "a resposta pronta" para o aluno — a checagem de conjunto completo
// é feita localmente a partir do id da carta, e só então revelada ao aluno.

import { InitializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    collection,
    query,
    where,
    writeBatch,
    runTransaction,
    serverTimestamp,
    orderBy,
    getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { FirebaseConfig } from "./firebase-config.js";
import { PROFISSOES, buildDeck, checarConjuntoCompleto, Embaralhar } from "./data.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DECK = buildDeck(); // 60 cartas estáticas, indexadas por id
const DECK_BY_ID = Object.fromEntries(DECK.map((c) => [c.id, c]));

// ---------------------------------------------------------------------------
// Estado local
// ---------------------------------------------------------------------------
const state = {
    uid: null,
    roomCode: null,
    role: null, // "professor" | "aluno"
    nome: null,
    unsubs: [], // listeners ativos para limpar ao trocar de tela
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function clearListeners() {
    state.unsubs.forEach((fn) => fn && fn());
    state.unsubs = [];
}

function gerarCodigoSala() {
    const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem O/0/I/1 (evita confusão)
  let code = "";
    for (let i = 0; i < 6; i++) code += alfabeto[Math.floor(Math.random() * alfabeto.length)];
    return code;
}

// ---------------------------------------------------------------------------
// Autenticação (anônima — cada aba/dispositivo vira um uid estável)
// ---------------------------------------------------------------------------
function garantirLogin() {
    return new Promise((resolve, reject) => {
          onAuthStateChanged(auth, (user) => {
                  if (user) {
                            state.uid = user.uid;
                            resolve(user.uid);
                  }
          });
          signInAnonymously(auth).catch(reject);
    });
}

// ---------------------------------------------------------------------------
// Ações — Professor
// ---------------------------------------------------------------------------
async function criarSala(nomeProfessor) {
    await garantirLogin();
    let code;
    for (let tentativa = 0; tentativa < 5; tentativa++) {
          code = gerarCodigoSala();
          const snap = await getDoc(doc(db, "rooms", code));
          if (!snap.exists()) break;
    }
    await setDoc(doc(db, "rooms", code), {
          professorUid: state.uid,
          professorNome: NomeProfessor || "Professor(a)",
          status: "lobby", // lobby -> jogando -> finalizado
          dica: "",
          criadoEm: serverTimestamp(),
    });
    return code;
}

async function iniciarJogo(roomCode) {
    // 1) Descobrir quem já entrou na sala
  const studentsSnap = await getDocsOnce(collection(db, "rooms", roomCode, "students"));
    const uids = studentsSnap.map((d) => d.id);
    if (uids.length < 2) {
          throw new Error("É preciso pelo menos 2 alunos na sala para iniciar o jogo.");
    }

  // 2) Embaralhar as 60 cartas e distribuir em rodízio (round-robin) entre os presentes
  const baralho = embaralhar(DECK.map((c) => c.id));
    const maoPorAluno = Object.fromEntries(uids.map((u) => [u, []]));
    baralho.forEach((cardId, i) => {
          const uid = uids[i % uids.length];
          maoPorAluno[uid].push(cardId);
    });

  // 3) Gravar a posse inicial de cada carta (documento leve: só o dono)
  const batch = writeBatch(db);
    for (const uid of uids) {
          for (const cardId of maoPorAluno[uid]) {
                  batch.set(doc(db, "rooms", roomCode, "cards", cardId), { donoUid: Uid });
          }
    }
    batch.update(doc(db, "rooms", roomCode), { status: "jogando", iniciadoEm: serverTimestamp() });
    await batch.commit();
}

async function enviarDica(roomCode, texto) {
    await updateDoc(doc(db, "rooms", roomCode), { dica: Texto });
}

async function encerrarJogo(roomCode) {
    await updateDoc(doc(db, "rooms", roomCode), { status: "finalizado" });
}

// helper: leitura única de uma coleção (sem listener)
async function getDocsOnce(colRef) {
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---------------------------------------------------------------------------
// Ações — Aluno
// ---------------------------------------------------------------------------
async function entrarNaSala(roomCode, nomeAluno) {
    await garantirLogin();
    const roomSnap = await getDoc(doc(db, "rooms", roomCode));
    if (!roomSnap.exists()) throw new Error("Código de sala não encontrado.");
    await setDoc(
          doc(db, "rooms", roomCode, "students", state.uid),
      {
              nome: nomeAluno,
              entrouEm: serverTimestamp(),
              completo: false,
              profissaoCompleta: null,
      },
      { merge: true }
        );
    return roomSnap.data();
}

// Propor troca: eu ofereço `cartaOferecidaId` (minha) em troca de `cartaPedidaId` (do colega `paraUid`)
async function proporTroca(roomCode, paraUid, paraNome, cartaOferecidaId, cartaPedidaId) {
    const tradeRef = doc(collection(db, "rooms", roomCode, "trades"));
    await setDoc(tradeRef, {
          deUid: state.uid,
          deNome: state.nome,
          paraUid,
          paraNome,
          cartaOferecidaId,
          cartaPedidaId,
          status: "pendente",
          criadoEm: serverTimestamp(),
    });
}

async function cancelarTroca(roomCode, tradeId) {
    await updateDoc(doc(db, "rooms", roomCode, "trades", tradeId), { status: "cancelada" });
}

async function recusarTroca(roomCode, tradeId) {
    await updateDoc(doc(db, "rooms", roomCode, "trades", tradeId), { status: "recusada" });
}

// Aceitar troca: transação garante que as duas cartas ainda pertencem a quem a proposta diz
async function aceitarTroca(roomCode, tradeId) {
    await runTransaction(db, async (tx) => {
          const tradeRef = doc(db, "rooms", roomCode, "trades", tradeId);
          const tradeSnap = await tx.get(tradeRef);
          if (!tradeSnap.exists()) throw new Error("Proposta não existe mais.");
          const trade = tradeSnap.data();
          if (trade.status !== "pendente") throw new Error("Esta proposta já foi resolvida.");

                             const cardOferecidaRef = doc(db, "rooms", roomCode, "cards", trade.cartaOferecidaId);
          const cardPedidaRef = doc(db, "rooms", roomCode, "cards", trade.cartaPedidaId);
          const [cardOferecidaSnap, cardPedidaSnap] = await Promise.all([
                  tx.get(cardOferecidaRef),
                  tx.get(cardPedidaRef),
                ]);

                             if (cardOferecidaSnap.data()?.donoUid !== trade.deUid) {
                                     throw new Error("A carta oferecida já mudou de dono. Peça para propor a troca novamente.");
                             }
          if (cardPedidaSnap.data()?.donoUid !== trade.paraUid) {
                  throw new Error("A carta pedida já mudou de dono. Peça para propor a troca novamente.");
          }

                             // swap
                             tx.update(cardOferecidaRef, { donoUid: trade.paraUid });
          tx.update(cardPedidaRef, { donoUid: trade.deUid });
          tx.update(tradeRef, { status: "aceita", resolvidoEm: serverTimestamp() });
    });
}

// Cada cliente verifica a PRÓPRIA mão e se autodeclara "completo" — nenhum
// outro usuário precisa (nem consegue, pelas regras) declarar isso por ele.
async function autoverificarConjunto(roomCode, minhasCartaIds) {
    const minhasCartas = minhasCartaIds.map((id) => DECK_BY_ID[id]).filter(Boolean);
    const resultado = checarConjuntoCompleto(minhasCartas);
    if (resultado) {
          await updateDoc(doc(db, "rooms", roomCode, "students", state.uid), {
                  completo: true,
                  profissaoCompleta: resultado.nome,
                  completoEm: serverTimestamp(),
          });
    }
    return resultado;
}

// ---------------------------------------------------------------------------
// Exporta para o escopo global (index.html referencia essas funções nos onclick)
// ---------------------------------------------------------------------------
window.CDA = {
    state,
    DECK,
    DECK_BY_ID,
    PROFISSOES,
    garantirLogin,
    criarSala,
    iniciarJogo,
    enviarDica,
    encerrarJogo,
    entrarNaSala,
    proporTroca,
    cancelarTroca,
    recusarTroca,
    aceitarTroca,
    autoverificarConjunto,
    clearListeners,
    db,
    onSnapshot,
    doc,
    collection,
    query,
    where,
    orderBy,
    getDocs,
};
