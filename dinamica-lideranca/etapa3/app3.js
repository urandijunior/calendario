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
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, collection, getDocs, serverTimestamp,
} from "../firebase.js?v=12";
import { firebaseConfig } from "../firebase-config.js?v=12";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const estado = { uid: null, sala: null, alunoId: null, offset: 0 };
export const agora = () => Date.now() + estado.offset;

// Identidade do professor. O aluno entra anônimo (não precisa de conta); o professor
// pode entrar com e-mail e senha, e aí o painel o reconhece em QUALQUER computador —
// o uid anônimo muda de navegador para navegador, o e-mail não.
export const professor = { email: null };
export const ehProfessorLogado = () => !!professor.email;

let loginPromise = null;
export function garantirLogin() {
  if (estado.uid) return Promise.resolve(estado.uid);
  if (!loginPromise) {
    loginPromise = new Promise((resolve, reject) => {
      // Não entra anônimo às cegas: se já existe uma sessão de professor guardada
      // neste navegador, entrar anônimo aqui a derrubaria.
      const off = onAuthStateChanged(auth, (u) => {
        if (u) {
          estado.uid = u.uid;
          professor.email = u.isAnonymous ? null : u.email;
          off();
          resolve(u.uid);
        } else {
          signInAnonymously(auth).catch(reject);
        }
      });
    });
  }
  return loginPromise;
}

export async function entrarProfessor(email, senha) {
  try {
    await signInWithEmailAndPassword(auth, email, senha);
  } catch (e) {
    const semConta = e?.code === "auth/user-not-found" || e?.code === "auth/invalid-credential";
    if (!semConta) throw e;
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
    } catch (e2) {
      // o e-mail já existe: então o que não bateu foi a senha
      if (e2?.code === "auth/email-already-in-use") throw new Error("senha");
      throw e2;
    }
  }
  estado.uid = auth.currentUser.uid;
  professor.email = auth.currentUser.email;
  return estado.uid;
}

export async function sairProfessor() {
  await signOut(auth);
  estado.uid = null;
  professor.email = null;
  loginPromise = null;
  return garantirLogin();
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
/** duracaoMin em minutos, ou "livre" para deixar a etapa aberta sem cronômetro. */
export async function abrirEtapa3(sala, duracaoMin) {
  await garantirLogin();
  await sincronizarRelogio(sala);
  const semPrazo = String(duracaoMin) === "livre";
  const min = semPrazo ? null : Math.min(300, Math.max(5, Number(duracaoMin) || 60));
  await updateDoc(refSala(sala), {
    "etapa3.status": "aberta",
    "etapa3.semPrazo": semPrazo,
    "etapa3.duracaoMin": min,
    "etapa3.iniciadoMs": agora(),
    // sem prazo = sem fimMs: nada de cronômetro regressivo nem de envio automático
    "etapa3.fimMs": semPrazo ? null : agora() + min * 60000,
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
/**
 * Aluno que não está na sala da Etapa 2 (faltou à aula anterior).
 * As regras do Firestore só permitem CRIAR o documento de aluno cujo id é o próprio uid
 * — por isso o avulso é gravado com o uid do aparelho, e não com um id inventado.
 * Devolve {uid, jaExiste}: se este aparelho já tem registro na sala, nada é sobrescrito.
 */
export async function criarAvulso(sala, { nome, ramo, mao }) {
  const uid = await garantirLogin();
  const atual = await getDoc(refAluno(sala, uid));
  if (atual.exists()) return { uid, jaExiste: true, dados: atual.data() };
  // Dois passos de propósito: a criação usa exatamente o formato que a Etapa 2 grava
  // (é o que as regras do Firestore aceitam na criação); a etapa3 entra depois, por update.
  await setDoc(refAluno(sala, uid), {
    nome, ramo, fase: "espera", trocas: 0, entrouEm: serverTimestamp(),
  }, { merge: true });
  await iniciarAluno(sala, uid, { ramo, mao, lider: null, nomeDigitado: nome, avulso: true });
  return { uid, jaExiste: false };
}

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
