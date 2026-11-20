// motor3.js — Etapa 3: etiquetas de capacidade, questões personalizadas e notas.
//
// As 8 primeiras questões de cada ramo são fixas (cenarios3.js).
// As 4 últimas (q9 a q12) são geradas aqui, para CADA aluno, a partir de duas coisas
// que ele decidiu na Etapa 2: a mão final de 6 funcionários e o líder que escolheu.
//
// Base teórica: Hersey e Blanchard (estilo se ajusta ao liderado), Drucker (resultado
// x popularidade), Collins (Nível 5), Porter (escolher o que não fazer),
// White e Lippitt / Chiavenato (estilos autocrático, democrático e liberal).

import { FUNCIONARIOS, RAMO, MATURIDADE, ESTILOS, NINGUEM } from "../data.js?v=12";

// ---------------------------------------------------------------------------
// Dificuldade e peso
// ---------------------------------------------------------------------------
export const DIFIC = {
  facil: { id: "facil", nome: "Fácil", peso: 0.5, cor: "#5fa868" },
  media: { id: "media", nome: "Média", peso: 1.0, cor: "#e0a43a" },
  dificil: { id: "dificil", nome: "Difícil", peso: 1.5, cor: "#d9694f" },
};
// 12 questões = 1 fácil + 7 médias + 4 difíceis = 13,5 pontos possíveis
export const PONTOS_TOTAIS = 13.5;

// ---------------------------------------------------------------------------
// Taxonomia de capacidades (12 etiquetas)
// Cada funcionário tem [primária, secundária]. A primária é o que ele faz de melhor.
// ---------------------------------------------------------------------------
export const TAGS = {
  dados: "Dados e indicadores",
  treino: "Treinar e ensinar no posto",
  legal: "Conformidade, normas e auditoria",
  comercial: "Vender e negociar contratos",
  operacao: "Rodar a operação no dia a dia",
  qualidade: "Padrão, controle e perdas",
  financeiro: "Custo, orçamento e caixa",
  comunicacao: "Comunicação e reputação",
  tecnologia: "Sistemas e canais digitais",
  seguranca: "Segurança e prevenção de risco",
  cliente: "Relação com o cliente ou usuário final",
  pessoas: "Atrair e segurar gente",
};

export const CAPS = {
  // Agronegócio
  AGR1: ["operacao", "tecnologia"], AGR2: ["dados", "operacao"], AGR3: ["legal", "qualidade"],
  AGR4: ["qualidade", "operacao"], AGR5: ["comercial", "financeiro"], AGR6: ["seguranca", "treino"],
  // Varejo
  VAR1: ["comercial", "qualidade"], VAR2: ["dados", "tecnologia"], VAR3: ["operacao", "treino"],
  VAR4: ["tecnologia", "cliente"], VAR5: ["comunicacao", "cliente"], VAR6: ["qualidade", "seguranca"],
  // Saúde
  SAU1: ["operacao", "cliente"], SAU2: ["qualidade", "operacao"], SAU3: ["dados", "operacao"],
  SAU4: ["financeiro", "dados"], SAU5: ["cliente", "comunicacao"], SAU6: ["legal", "qualidade"],
  // Tecnologia
  TEC1: ["tecnologia", "qualidade"], TEC2: ["dados", "operacao"], TEC3: ["cliente", "comunicacao"],
  TEC4: ["legal", "seguranca"], TEC5: ["treino", "cliente"], TEC6: ["financeiro", "dados"],
  // Indústria
  IND1: ["operacao", "treino"], IND2: ["seguranca", "legal"], IND3: ["qualidade", "legal"],
  IND4: ["treino", "operacao"], IND5: ["pessoas", "comunicacao"], IND6: ["comercial", "cliente"],
  // Logística
  LOG1: ["dados", "tecnologia"], LOG2: ["operacao", "financeiro"], LOG3: ["qualidade", "operacao"],
  LOG4: ["treino", "tecnologia"], LOG5: ["comercial", "cliente"], LOG6: ["financeiro", "dados"],
  // Educação
  EDU1: ["operacao", "treino"], EDU2: ["treino", "qualidade"], EDU3: ["cliente", "dados"],
  EDU4: ["comercial", "comunicacao"], EDU5: ["legal", "operacao"], EDU6: ["comunicacao", "cliente"],
  // Serviços financeiros
  FIN1: ["cliente", "comercial"], FIN2: ["dados", "financeiro"], FIN3: ["tecnologia", "cliente"],
  FIN4: ["treino", "comunicacao"], FIN5: ["legal", "seguranca"], FIN6: ["comunicacao", "comercial"],
  // Turismo e hotelaria
  TUR1: ["cliente", "comunicacao"], TUR2: ["qualidade", "operacao"], TUR3: ["operacao", "financeiro"],
  TUR4: ["comunicacao", "tecnologia"], TUR5: ["legal", "seguranca"], TUR6: ["comercial", "cliente"],
  // Setor público
  PUB1: ["operacao", "cliente"], PUB2: ["tecnologia", "dados"], PUB3: ["legal", "seguranca"],
  PUB4: ["cliente", "comunicacao"], PUB5: ["financeiro", "dados"], PUB6: ["comunicacao", "comercial"],
};

// "Dra. Luciana Faria" → "Luciana"; "Marcos Vieira" → "Marcos"
export const primeiroNome = (nome) => String(nome || "").replace(/^Dra?\.\s*/, "").split(" ")[0];

export const capsDe = (id) => CAPS[id] || [];
export const temTag = (id, tag) => capsDe(id).includes(tag);
export const tagPrimaria = (id) => capsDe(id)[0] || null;

// ---------------------------------------------------------------------------
// Sorteio determinístico: a mesma pessoa vê sempre a mesma ordem de alternativas
// ---------------------------------------------------------------------------
function hash(s) { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
function ordenarSemente(arr, semente) {
  return arr
    .map((v, i) => ({ v, k: hash(`${semente}#${i}#${v.v ?? i}`) }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.v);
}

// ---------------------------------------------------------------------------
// Quem da mão cobre uma frente que exige a etiqueta `tag`
//   1º) quem tem a etiqueta como PRIMÁRIA (é o que a pessoa faz de melhor)
//   2º) entre esses, quem é do próprio ramo do aluno (conhece o negócio por dentro)
//   3º) desempate estável pelo id
// Ninguém com a etiqueta primária → ninguém cobre a frente de verdade.
// ---------------------------------------------------------------------------
export function quemCobre(maoIds, tag, ramoCod) {
  const primarios = maoIds.filter((id) => tagPrimaria(id) === tag);
  if (!primarios.length) return null;
  const doRamo = primarios.filter((id) => FUNCIONARIOS[id]?.ramo === ramoCod);
  const fila = (doRamo.length ? doRamo : primarios).slice().sort();
  return fila[0];
}

// Quem da mão só tangencia a frente (etiqueta secundária) — usado nas explicações
export function quemTangencia(maoIds, tag) {
  return maoIds.filter((id) => capsDe(id)[1] === tag).sort();
}

// ---------------------------------------------------------------------------
// Q10 — o papel do líder quando a equipe se parte em duas maturidades
// O gabarito NUNCA é trocar de líder: é o líder mudar de estilo (Hersey e Blanchard)
// e corrigir o vício do próprio perfil.
// ---------------------------------------------------------------------------
const CORRECAO_PAPEL = {
  L: (p) => `continuar no estilo que já pratica com a equipe madura e endurecer a direção com os recém-chegados — é o mesmo líder, com dois estilos ao mesmo tempo`,
  K: (p) => `assumir agora as decisões impopulares que vinha adiando: ${primeiroNome(p.nome)} tem a equipe do seu lado, mas liderança se mede por resultado, não por simpatia (Drucker)`,
  GA: (p) => `abrir a decisão com a equipe que já sabe e quer, e reservar o controle de perto só para os novatos — mandar em todo mundo vai travar justamente quem já é autônomo (White e Lippitt)`,
  GL: (p) => `parar de deixar cada um fazer do seu jeito e dar direção explícita aos recém-chegados, mantendo autonomia apenas para quem já domina a tarefa`,
  X: (p) => `assumir de fato a coordenação que costuma evitar, com mandato formal da diretoria, e dividir a parte técnica com outra pessoa para não voltar a só executar`,
  S: (p) => `trocar o próprio estilo: o jeito que ${primeiroNome(p.nome)} pratica não é o que a maturidade desta equipe pede agora`,
};

function textoQ10Certo(lider, estNovo, estAntigo) {
  const base = CORRECAO_PAPEL[lider.papel] || CORRECAO_PAPEL.S;
  return `${lider.nome} segue no comando, mas passa a usar ${ESTILOS[estNovo]} com os recém-chegados e ${ESTILOS[estAntigo]} com a equipe madura — e precisa ${base(lider)}.`;
}

// ---------------------------------------------------------------------------
// Geração das 4 questões personalizadas
//   cen  = cenário do ramo (cenarios3.js)
//   mao  = array de 6 ids de funcionário (aluno.maoFinal)
//   liderId = id escolhido na Etapa 2 (aluno.liderEscolhido)
// ---------------------------------------------------------------------------
export function questoesPessoais(cen, ramoCod, mao, liderId, semente = "x") {
  const r = RAMO[ramoCod];
  const maoIds = [...new Set(mao)].filter((id) => FUNCIONARIOS[id]);
  const pess = maoIds.map((id) => FUNCIONARIOS[id]);
  const rotulo = (p) => `${p.nome} · ${p.cargo}${p.ramo !== ramoCod ? ` (do ramo ${RAMO[p.ramo]?.nome})` : ""}`;
  const opPessoas = pess.map((p) => ({ v: p.id, t: rotulo(p), det: `${p.hab}. Quando lidera: ${p.lidera}` }));
  const opNinguem = { v: NINGUEM, t: "Ninguém da minha equipe cobre essa frente" };
  const prio = cen.prioridade || [];
  const rank = (id) => { const i = prio.indexOf(tagPrimaria(id)); return i < 0 ? 999 : i; };
  const fora = (id) => (FUNCIONARIOS[id]?.ramo !== ramoCod ? 1 : 0);
  // menos crítico primeiro; empate resolve a favor de liberar quem veio de outro ramo
  const ordemSaida = (a, b) => rank(b) - rank(a) || fora(b) - fora(a) || (a < b ? -1 : 1);

  // ---- q9: a frente nova do cenário ----
  const certa9 = quemCobre(maoIds, cen.frenteNova.exige, ramoCod) || NINGUEM;
  const tang = quemTangencia(maoIds, cen.frenteNova.exige);
  const explica9 = certa9 === NINGUEM
    ? `Ninguém da sua equipe tem “${TAGS[cen.frenteNova.exige]}” como ponto forte.${tang.length ? ` ${FUNCIONARIOS[tang[0]].nome} chega perto, mas isso é a segunda habilidade dele(a), não a principal.` : ""} Esta frente ficou descoberta na hora em que você fechou as trocas — e é isso que o cenário cobra agora.`
    : `${FUNCIONARIOS[certa9].nome} é quem tem “${TAGS[cen.frenteNova.exige]}” como habilidade principal: ${FUNCIONARIOS[certa9].hab.toLowerCase()}.${FUNCIONARIOS[certa9].ramo !== ramoCod ? " Veio de outro ramo numa troca sua, e é exatamente por isso que serve aqui: a habilidade cobre a frente, mesmo vindo de fora." : ""}`;

  const q9 = {
    id: "q9", dif: "media", pessoal: true, teoria: "Chiavenato · influência na situação",
    titulo: "Frente nova: quem da SUA equipe assume?",
    texto: `${cen.frenteNova.texto}\n\nOlhe a sua equipe final e o que cada pessoa faz de melhor. Quem você coloca nessa frente?`,
    opcoes: ordenarSemente([...opPessoas], semente + "q9").concat([opNinguem]),
    certa: certa9, explica: explica9,
  };

  // ---- q10: o papel do líder diante das duas maturidades ----
  const lider = FUNCIONARIOS[liderId] || null;
  const estNovo = MATURIDADE[cen.matNova].estilo;
  const estAntigo = MATURIDADE[cen.matAntiga].estilo;
  const melhorOutro = maoIds.filter((id) => id !== liderId).sort((a, b) => rank(a) - rank(b))[0];
  let q10;
  if (lider) {
    const certo = { v: "ok", t: textoQ10Certo(lider, estNovo, estAntigo) };
    const erradas = [
      { v: "trocar", t: `Trocar de líder agora: ${FUNCIONARIOS[melhorOutro]?.nome || "outra pessoa"} assume o lugar de ${primeiroNome(lider.nome)} até a crise passar.` },
      { v: "unico", t: `Manter um único estilo com todo mundo, para não parecer que ${primeiroNome(lider.nome)} trata as duas turmas de forma diferente.` },
      { v: "delegar", t: `Delegar tudo aos dois grupos: a equipe madura já é autônoma e os novos aprendem na prática, sem ninguém em cima.` },
    ];
    q10 = {
      id: "q10", dif: "media", pessoal: true, teoria: "Hersey e Blanchard · o líder que você escolheu",
      titulo: "O líder que você escolheu, agora com duas equipes",
      texto: `Na Etapa 2 você escolheu **${lider.nome}** (${lider.cargo}) para liderar a virada. Quando lidera, essa pessoa age assim: *${lider.lidera}*\n\nAgora a equipe se partiu em duas: a antiga está em **${MATURIDADE[cen.matAntiga].nome}** e os recém-chegados em **${MATURIDADE[cen.matNova].nome}**. O que ${primeiroNome(lider.nome)} precisa fazer?`,
      opcoes: ordenarSemente([certo, ...erradas], semente + "q10"),
      certa: "ok",
      explica: `Hersey e Blanchard: o estilo se ajusta ao liderado, não ao organograma — por isso o mesmo líder usa ${ESTILOS[estNovo]} com os novos e ${ESTILOS[estAntigo]} com os antigos, ao mesmo tempo. Trocar de líder no meio da crise joga fora o que a equipe construiu em 18 meses, e um estilo único trava quem já é autônomo ou abandona quem ainda não sabe.`,
    };
  } else {
    q10 = {
      id: "q10", dif: "media", pessoal: true, teoria: "Hersey e Blanchard · o líder que você escolheu",
      titulo: "O líder que você escolheu, agora com duas equipes",
      texto: `Você encerrou a Etapa 2 sem indicar um líder. A equipe se partiu em duas: a antiga em **${MATURIDADE[cen.matAntiga].nome}** e os recém-chegados em **${MATURIDADE[cen.matNova].nome}**. Qual é o primeiro movimento?`,
      opcoes: ordenarSemente([
        { v: "ok", t: `Indicar formalmente um líder da própria equipe e combinar com ele dois estilos: ${ESTILOS[estNovo]} com os novos e ${ESTILOS[estAntigo]} com os antigos.` },
        { v: "a", t: "Deixar a equipe se autogerir: com gente madura no time, líder formal só atrapalha." },
        { v: "b", t: "Trazer um gerente de fora, sem vínculo com a equipe, para não gerar ciúme interno." },
        { v: "c", t: "Assumir você mesmo as duas frentes no dia a dia, acumulando com a diretoria." },
      ], semente + "q10"),
      certa: "ok",
      explica: "Sem líder definido, a influência não se exerce — e liderança, em Chiavenato, é exatamente influência interpessoal exercida numa situação. O primeiro passo é dar o papel a alguém da equipe e combinar o estilo que cada grupo exige.",
    };
  }

  // ---- q11: perenidade — o risco de liderança dentro da equipe (DIFÍCIL) ----
  const porPapel = (pp) => maoIds.filter((id) => FUNCIONARIOS[id].papel === pp).sort()[0];
  const idK = porPapel("K"), idGA = porPapel("GA"), idGL = porPapel("GL");
  const menosCritico = maoIds.slice().sort(ordemSaida)[0];
  const certa11 = idK || idGA || idGL || menosCritico;
  const pK = FUNCIONARIOS[certa11];
  const motivo11 = idK
    ? `${pK.nome} é a armadilha do carisma: ${pK.lidera.toLowerCase()} Drucker avisa que popularidade não é liderança — e numa equipe sob pressão é justamente essa pessoa que tende a ser empurrada para o comando pelo afeto do time, não pelo resultado.`
    : idGA
      ? `${pK.nome} lidera no estilo autocrático: ${pK.lidera.toLowerCase()} No experimento de White e Lippitt, esse estilo produz volume enquanto o líder está por perto e trava quando ele sai — insustentável numa equipe que precisa ganhar autonomia.`
      : idGL
        ? `${pK.nome} lidera no estilo liberal: ${pK.lidera.toLowerCase()} Com recém-chegados que ainda não dominam a tarefa, deixar solto é o caminho mais curto para o erro e para a saída deles.`
        : `${pK.nome} ocupa a vaga mais frágil da sua equipe neste cenário: a frente dele(a) é a menos crítica entre as 6 que você escolheu.`;

  const q11 = {
    id: "q11", dif: "dificil", pessoal: true, teoria: "Drucker e White/Lippitt · perenidade da equipe",
    titulo: "O elo frágil da sua equipe",
    texto: `A pressão dos próximos 120 dias vai testar como cada pessoa da sua equipe se comporta quando assume a frente de algo.\n\nLendo a linha “quando lidera” de cada um dos seus 6, quem representa o maior **risco de liderança** para a perenidade da equipe — não por incompetência técnica, mas pelo jeito de conduzir gente?`,
    opcoes: ordenarSemente([...opPessoas], semente + "q11"),
    certa: certa11, explica: motivo11,
  };

  // ---- q12: o trade-off (Porter) ----
  // Não entram na conta: o próprio líder e quem acabou de ser apontado como elo frágil
  // (elo frágil se resolve com desenvolvimento e cobrança, não liberando a vaga).
  const semLider = maoIds.filter((id) => id !== liderId);
  const candidatosSaida = (() => {
    const c = semLider.filter((id) => id !== certa11);
    return c.length ? c : (semLider.length ? semLider : maoIds);
  })();
  const liberar = candidatosSaida.slice().sort(ordemSaida)[0] || menosCritico;
  const pL = FUNCIONARIOS[liberar];
  const tagLiberar = tagPrimaria(liberar);
  const viva = prio.indexOf(tagLiberar) >= 0 && prio.indexOf(tagLiberar) < prio.length - 4;
  const q12 = {
    id: "q12", dif: "media", pessoal: true, teoria: "Porter · escolher o que não fazer",
    titulo: "O trade-off: uma vaga para abrir",
    texto: `${cen.trocaTexto}\n\nSão 6 vagas e nenhuma a mais: para trazer essa pessoa, você precisa liberar alguém da sua equipe. Duas pessoas estão fora da conta — o seu líder e o elo frágil da questão anterior, que se resolve com desenvolvimento e cobrança, não liberando a vaga. Entre as demais, quem sai?`,
    opcoes: ordenarSemente(pess.filter((p) => candidatosSaida.includes(p.id)).map((p) => ({ v: p.id, t: rotulo(p), det: `${p.hab}. Frente que cobre: ${p.frente}` })), semente + "q12"),
    certa: liberar,
    explica: `${pL.nome} cobre “${TAGS[tagLiberar] || pL.frente}”, a frente menos crítica da sua equipe neste cenário${pL.ramo !== ramoCod ? ` — e veio do ramo ${RAMO[pL.ramo]?.nome} numa troca sua. Lá essa habilidade vale muito; aqui ela não se transfere, porque “${pL.hab.toLowerCase()}” resolve o problema de outro negócio, não o desta empresa` : viva ? " — ela não deixou de importar, e é exatamente esse o custo que Porter obriga a encarar" : ": no cenário novo essa frente praticamente deixou de existir"}. A essência da estratégia é escolher o que não fazer; liberar a vaga de quem ainda é essencial é que seria o erro.`,
  };

  return [q9, q10, q11, q12];
}

// ---------------------------------------------------------------------------
// Correção e nota
//   respostas: { q1: "b", ... } · anuladas: Set de ids zerados pela trava
// ---------------------------------------------------------------------------
export function corrigir(questoes, respostas, anuladas = new Set(), perdoadas = new Set()) {
  const itens = questoes.map((q) => {
    const perdoada = perdoadas.has(q.id);
    const anulada = anuladas.has(q.id) && !perdoada;
    const marcada = respostas?.[q.id] ?? null;
    // Perdoada e sem resposta: a trava tirou a questão antes de o aluno poder responder,
    // então ela sai da conta em vez de valer zero — o aluno é avaliado sobre o que sobrou.
    const excluida = perdoada && marcada == null;
    const acertou = !anulada && !excluida && marcada === q.certa;
    return { id: q.id, dif: q.dif, peso: DIFIC[q.dif].peso, pessoal: !!q.pessoal, anulada, perdoada, excluida, marcada, certa: q.certa, acertou };
  });
  const pontos = itens.reduce((s, i) => s + (i.acertou ? i.peso : 0), 0);
  const pontosValidos = itens.reduce((s, i) => s + (i.excluida ? 0 : i.peso), 0);
  const acertos = itens.filter((i) => i.acertou).length;
  const fixas = itens.filter((i) => !i.pessoal);
  const pessoais = itens.filter((i) => i.pessoal);
  return {
    itens, acertos, total: itens.length,
    pontos: Math.round(pontos * 100) / 100,
    pontosTotais: Math.round(pontosValidos * 100) / 100,
    nota: pontosValidos > 0 ? Math.round((pontos / pontosValidos) * 1000) / 100 : 0, // 0 a 10
    acertosFixas: fixas.filter((i) => i.acertou).length, totalFixas: fixas.length,
    acertosPessoais: pessoais.filter((i) => i.acertou).length, totalPessoais: pessoais.length,
    anuladas: itens.filter((i) => i.anulada).length,
    excluidas: itens.filter((i) => i.excluida).length,
  };
}
