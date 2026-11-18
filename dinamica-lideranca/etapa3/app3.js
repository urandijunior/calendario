// app3.js — Etapa 3: camada de dados (Firestore).
//
// Decisão de arquitetura: as respostas da Etapa 3 são gravadas DENTRO do documento do
// aluno da Etapa 2 (rooms/{sala}/students/{uid}), num campo aninhado "etapa3", e o controle
// da etapa fica em rooms/{sala}.etapa3.
//
// Por quê: as regras do Firestore do projeto permitem escrita autenticada nesses dois
// caminhos, mas NEGAM subcoleções novas em rooms/{sala}/... e coleções novas no topo.
// Gravar aqui dispensa qualquer mudança nas regras de segurança e, principalmente, permite
// que o aluno entre de QUALQUER aparelho — o documento é encontrado pelo nome, não pelo uid
// do navegador, que uma semana depois pode não existir mais.

import {
  initializeApp, getAuth, signInAnonymously, onAuthStateChanged,
  getFirestore, doc, getDoc, updateDoc, onSnapshot, collection, getDocs, serverTimestamp,
} from "../firebase.js";
import { firebaseConfig } from "../firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const estado = { uid: null, sala: null, alunoId: null, offset: 0 };
export const agora = () => Date.now() + estado.offset;

let loginPromise = null;
export function garantirLogin() {
  if (estado.uid) return Promise.resolve(estado.uid);
  if (!loginPromise) {
    loginPromise = new Promise((resolve, reject) => {
      const off = onAuthStateChanged(auth, (u) => { if (u) { estado.uid = u.uid; off(); resolve(u.uid); } });
      signInAnonymously(auth).catch(reject);
    });
  }
  return loginPromise;
}

const refSala = (sala) => doc(db, "rooms", sala);
const refAluno = (sala, id) => doc(db, "rooms", sala, "students", id);

// Acerta o relógio do aparelho com o do servidor (o cronômetro depende disso)
export async function sincronizarRelogio(sala) {
  try {
    const t0 = Date.now();
    await updateDoc(refSala(sala), { ping3: serverTimestamp() });
    const s = await getDoc(refSala(sala));
    const t1 = Date.now();
    const srv = s.data()?.ping3?.toMillis?.();
    if (srv) estado.offset = srv - (t0 + t1) / 2;
  } catch (e) { /* segue com o relógio local */ }
}

// ---------------------------------------------------------------------------
// Nomes: comparação tolerante a acento, caixa e espaço duplo
// ---------------------------------------------------------------------------
export const normalizar = (s) => String(s || "")
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/** Procura o aluno da Etapa 2 pelo nome. Devolve {achou, aluno, candidatos}. */
export function acharPorNome(alunos, nome) {
  const n = normalizar(nome);
  if (!n) return { achou: false, candidatos: [] };
  const exato = alunos.filter((a) => normalizar(a.nome) === n);
  if (exato.length === 1) return { achou: true, aluno: exato[0], candidatos: [] };
  if (exato.length > 1) return { achou: false, candidatos: exato, ambiguo: true };
  // tolerância: primeiro nome + sobrenome iniciando igual, ou nome contido
  const parciais = alunos.filter((a) => {
    const an = normalizar(a.nome);
    return an.startsWith(n) || n.startsWith(an) || (n.length >= 5 && an.includes(n));
  });
  if (parciais.length === 1) return { achou: true, aluno: parciais[0], candidatos: [], aproximado: true };
  return { achou: false, candidatos: parciais };
}

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------
export async function lerSala(sala) {
  const s = await getDoc(refSala(sala));
  if (!s.exists()) throw new Error("Código de sala não encontrado.");
  const d = s.data();
  if (d.tipo !== "lideranca") throw new Error("Este código é de outra dinâmica.");
  if (d.removida) throw new Error("Esta sala foi removida pelo(a) professor(a).");
  return d;
}

export async function lerAlunos(sala) {
  const snap = await getDocs(collection(db, "rooms", sala, "students"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export const observarSala = (sala, cb) => onSnapshot(refSala(sala), (s) => cb(s.data() || {}));
export const observarAlunos = (sala, cb) =>
  onSnapshot(collection(db, "rooms", sala, "students"), (s) => cb(s.docs.map((d) => ({ uid: d.id, ...d.data() }))));

// ---------------------------------------------------------------------------
// Professor
// ---------------------------------------------------------------------------
export async function abrirEtapa3(sala, duracaoMin) {
  await garantirLogin();
  await sincronizarRelogio(sala);
  const min = Math.max(5, Number(duracaoMin) || 60);
  await updateDoc(refSala(sala), {
    "etapa3.status": "aberta",
    "etapa3.duracaoMin": min,
    "etapa3.iniciadoMs": agora(),
    "etapa3.fimMs": agora() + min * 60000,
    "etapa3.abertoPor": estado.uid,
  });
}

export const encerrarEtapa3 = (sala) => updateDoc(refSala(sala), { "etapa3.status": "encerrada", "etapa3.encerradoMs": agora() });
export const reabrirEtapa3 = (sala) => updateDoc(refSala(sala), { "etapa3.status": "aberta" });

export async function maisTempo(sala, min, fimAtual) {
  const base = Math.max(agora(), Number(fimAtual) || agora());
  await updateDoc(refSala(sala), { "etapa3.fimMs": base + min * 60000 });
}

/** Perdoa uma questão zerada pela trava (o aluno recebe o ponto se tiver acertado). */
export const perdoarQuestao = (sala, alunoId, qid) =>
  updateDoc(refAluno(sala, alunoId), { [`etapa3.perdoadas.${qid}`]: true });

export const desfazerPerdao = (sala, alunoId, qid) =>
  updateDoc(refAluno(sala, alunoId), { [`etapa3.perdoadas.${qid}`]: false });

/** Libera um aluno para refazer a Etapa 3 (apaga o progresso dele nesta etapa). */
export const liberarRefazer = (sala, alunoId) =>
  updateDoc(refAluno(sala, alunoId), {
    "etapa3.status": "liberado", "etapa3.respostas": {}, "etapa3.anuladas": {},
    "etapa3.perdoadas": {}, "etapa3.saidas": 0, "etapa3.i": 0, "etapa3.discursiva": "",
    "etapa3.nota": null, "etapa3.liberadoMs": agora(),
  });

// ---------------------------------------------------------------------------
// Aluno
// ---------------------------------------------------------------------------
/** Marca o início. ramo/mao/lider vêm da Etapa 2; para o aluno avulso, vêm da escolha dele. */
export async function iniciarAluno(sala, alunoId, { ramo, mao, lider, nomeDigitado, avulso = false, incompleto = false }) {
  await garantirLogin();
  estado.alunoId = alunoId;
  await updateDoc(refAluno(sala, alunoId), {
    "etapa3.status": "fazendo",
    "etapa3.ramo": ramo,
    "etapa3.mao": mao,
    "etapa3.lider": lider || null,
    "etapa3.avulso": !!avulso,
    "etapa3.incompleto": !!incompleto,
    "etapa3.nomeDigitado": nomeDigitado || "",
    "etapa3.aparelhoUid": estado.uid,
    "etapa3.iniciadoMs": agora(),
    "etapa3.i": 0,
  });
}

export const salvarResposta = (sala, alunoId, qid, valor, indice) =>
  updateDoc(refAluno(sala, alunoId), {
    [`etapa3.respostas.${qid}`]: valor,
    "etapa3.i": indice,
    "etapa3.ultimoMs": agora(),
  });

export const marcarPosicao = (sala, alunoId, indice) =>
  updateDoc(refAluno(sala, alunoId), { "etapa3.i": indice, "etapa3.ultimoMs": agora() });

/** Trava de segurança: registra a saída do aplicativo e zera a questão em que o aluno estava. */
export const registrarSaida = (sala, alunoId, qid, n, segundos) =>
  updateDoc(refAluno(sala, alunoId), {
    ...(qid ? { [`etapa3.anuladas.${qid}`]: true } : {}),
    "etapa3.saidas": n,
    [`etapa3.eventos.s${n}`]: { q: qid || "discursiva", ms: agora(), seg: Math.round(segundos) },
  });

export const salvarDiscursiva = (sala, alunoId, texto) =>
  updateDoc(refAluno(sala, alunoId), { "etapa3.discursiva": String(texto || "").slice(0, 1200) });

export async function concluirAluno(sala, alunoId, { respostas, anuladas, discursiva, resultado }) {
  await updateDoc(refAluno(sala, alunoId), {
    "etapa3.status": "concluido",
    "etapa3.respostas": respostas,
    "etapa3.anuladas": anuladas,
    "etapa3.discursiva": String(discursiva || "").slice(0, 1200),
    "etapa3.nota": resultado.nota,
    "etapa3.pontos": resultado.pontos,
    "etapa3.acertos": resultado.acertos,
    "etapa3.acertosFixas": resultado.acertosFixas,
    "etapa3.acertosPessoais": resultado.acertosPessoais,
    "etapa3.concluidoMs": agora(),
    "etapa3.concluidoEm": serverTimestamp(),
  });
}

export { db, doc, getDoc, updateDoc, collection, getDocs, onSnapshot };
