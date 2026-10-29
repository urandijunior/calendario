// data.js — Deck mestre da dinâmica
// 10 profissões x (3 habilidades + 3 competências) = 60 cartas
// Os códigos (Pxx) foram mantidos. Os TEXTOS foram revisados (v2) para:
//   - reduzir cartas que serviam para várias profissões (liderança, negociação,
//     orçamento, decisão sob pressão, fluxo de caixa);
//   - deixar Habilidade = saber fazer técnico e Competência = comportamento/atitude.
// Se usar o material impresso, reimprima o gabarito com estes textos.

export const PROFISSOES = [
  {
    codigo: "P01",
    nome: "Gestor(a) de Recursos Humanos",
    vaga: "Rede varejista com 1.200 colaboradores busca líder de pessoas para reduzir o turnover.",
    habilidades: [
      "Operar sistemas de gestão de RH (HRIS) e processar a folha de pagamento",
      "Conduzir recrutamento e seleção com entrevistas por competências e dinâmicas de grupo",
      "Construir indicadores de pessoas: turnover, absenteísmo e clima organizacional",
    ],
    competencias: [
      "Mediar conflitos entre colaboradores e preservar as relações de trabalho",
      "Atuar como parceiro do negócio, alinhando as políticas de pessoas à estratégia",
      "Praticar escuta ativa e empatia ao acolher demandas de colaboradores",
    ],
  },
  {
    codigo: "P02",
    nome: "Analista Financeiro",
    vaga: "Cooperativa agroindustrial procura quem avalie investimentos de R$ 40 milhões.",
    habilidades: [
      "Construir modelagens financeiras em planilhas avançadas",
      "Analisar demonstrações contábeis e índices de liquidez, rentabilidade e endividamento",
      "Avaliar a viabilidade de investimentos com VPL, TIR e payback",
    ],
    competencias: [
      "Agir com prudência e ceticismo profissional diante de números otimistas",
      "Manter ética e sigilo no trato de informações financeiras sensíveis",
      "Ter atenção minuciosa aos detalhes ao conferir valores e projeções",
    ],
  },
  {
    codigo: "P03",
    nome: "Gerente de Marketing",
    vaga: "Marca regional de cafés quer ganhar o público jovem nas redes sociais.",
    habilidades: [
      "Planejar campanhas digitais com SEO, mídia paga e redes sociais",
      "Analisar métricas de marketing: CAC, LTV e funil de conversão",
      "Produzir conteúdo com ferramentas de automação e IA generativa",
    ],
    competencias: [
      "Desenvolver visão estratégica de marca e posicionamento diante da concorrência",
      "Persuadir o público contando histórias que geram conexão com a marca (storytelling)",
      "Estimular a criatividade de equipes de criação e agências parceiras",
    ],
  },
  {
    codigo: "P04",
    nome: "Gerente Comercial / Consultor(a) de Vendas",
    vaga: "Distribuidora de insumos agrícolas precisa bater a meta de vendas da safra.",
    habilidades: [
      "Aplicar técnicas de prospecção, contorno de objeções e fechamento de vendas",
      "Gerenciar o CRM e o funil (pipeline) de oportunidades comerciais",
      "Elaborar propostas comerciais com política de descontos e preços",
    ],
    competencias: [
      "Demonstrar resiliência e persistência diante do \"não\" dos clientes",
      "Construir relacionamentos de confiança e fidelizar a carteira de clientes",
      "Manter foco obstinado em bater as metas mensais de vendas",
    ],
  },
  {
    codigo: "P05",
    nome: "Analista de Dados / Business Intelligence",
    vaga: "Hospital privado quer usar seus dados para prever lotação e reduzir filas.",
    habilidades: [
      "Programar em SQL e Python para limpar e tratar grandes bases de dados",
      "Construir dashboards interativos em Power BI ou Tableau",
      "Aplicar estatística e modelos preditivos (machine learning)",
    ],
    competencias: [
      "Questionar os dados com curiosidade investigativa até encontrar a causa do problema",
      "Traduzir resultados técnicos em linguagem simples para gestores leigos",
      "Aprender continuamente novas tecnologias de dados e IA por conta própria",
    ],
  },
  {
    codigo: "P06",
    nome: "Gestor(a) de Projetos",
    vaga: "Construtora precisa entregar uma obra pública no prazo e sem estourar o custo.",
    habilidades: [
      "Aplicar metodologias ágeis (Scrum, Kanban) e ferramentas como Jira e MS Project",
      "Elaborar a EAP, o cronograma e o plano de riscos do projeto",
      "Controlar escopo, prazo e custo do projeto com indicadores de valor agregado",
    ],
    competencias: [
      "Adaptar o estilo de liderança à maturidade de cada membro do time de projeto",
      "Negociar mudanças de escopo e prazos com o patrocinador e os stakeholders",
      "Manter a calma e replanejar quando o projeto muda de rumo",
    ],
  },
  {
    codigo: "P07",
    nome: "Empreendedor(a) / Fundador(a) de Startup",
    vaga: "Agtech em fase inicial procura sócio(a) para transformar uma ideia em empresa.",
    habilidades: [
      "Modelar o negócio com Business Model Canvas e validar hipóteses com clientes (MVP)",
      "Apresentar pitch a investidores e negociar valuation em rodadas de investimento",
      "Controlar o caixa e a taxa de queima (burn rate) da startup",
    ],
    competencias: [
      "Tolerar riscos e manter a resiliência diante da incerteza de começar do zero",
      "Enxergar oportunidades de mercado onde outros só veem problemas",
      "Inspirar a equipe fundadora e os investidores com o propósito do negócio",
    ],
  },
  {
    codigo: "P08",
    nome: "Analista de Logística / Supply Chain",
    vaga: "Exportadora de grãos precisa levar a safra do Mato Grosso ao porto sem atrasos.",
    habilidades: [
      "Planejar estoques e demanda com sistemas MRP/ERP",
      "Roteirizar e otimizar fretes e operações de transporte",
      "Monitorar indicadores logísticos: OTIF, lead time e giro de estoque",
    ],
    competencias: [
      "Pensar de forma sistêmica, do fornecedor ao cliente final",
      "Resolver imprevistos de entrega em colaboração com outras áreas",
      "Negociar prazos e condições com fornecedores e transportadoras",
    ],
  },
  {
    codigo: "P09",
    nome: "Consultor(a) de Gestão / Business Consultant",
    vaga: "Empresa familiar em crise contrata diagnóstico externo para se reestruturar.",
    habilidades: [
      "Diagnosticar organizações e mapear processos (BPM)",
      "Elaborar relatórios e apresentações executivas para a alta direção",
      "Aplicar ferramentas de análise estratégica: SWOT e 5 Forças de Porter",
    ],
    competencias: [
      "Conduzir a gestão da mudança e vencer resistências na empresa cliente",
      "Questionar premissas com pensamento crítico e independência",
      "Adaptar-se rapidamente à cultura de cada novo cliente",
    ],
  },
  {
    codigo: "P10",
    nome: "Gestor(a) de Operações",
    vaga: "Frigorífico com três turnos precisa aumentar a produtividade da planta.",
    habilidades: [
      "Gerenciar processos produtivos e o indicador OEE da linha de produção",
      "Aplicar metodologias de melhoria contínua: Lean e Six Sigma",
      "Controlar os custos operacionais e o orçamento da planta",
    ],
    competencias: [
      "Liderar equipes de chão de fábrica em turnos e sob pressão por produção",
      "Decidir rapidamente diante de paradas e falhas na linha de produção",
      "Zelar pela segurança do trabalho e pela qualidade no dia a dia da operação",
    ],
  },
];

// Achata as profissões em cartas: { id, profissaoCodigo, profissaoNome, tipo, texto }
export function buildDeck(codigos = null) {
  const cards = [];
  for (const p of PROFISSOES) {
    if (codigos && !codigos.includes(p.codigo)) continue;
    p.habilidades.forEach((texto, i) => {
      cards.push({ id: `${p.codigo}-H${i + 1}`, profissaoCodigo: p.codigo, profissaoNome: p.nome, tipo: "H", texto });
    });
    p.competencias.forEach((texto, i) => {
      cards.push({ id: `${p.codigo}-C${i + 1}`, profissaoCodigo: p.codigo, profissaoNome: p.nome, tipo: "C", texto });
    });
  }
  return cards;
}

// Verifica se a mão (6 cartas) forma o perfil correto de UMA profissão (3H + 3C, mesmo código)
export function checarConjuntoCompleto(cartas) {
  if (!cartas || cartas.length !== 6) return null;
  const codigos = new Set(cartas.map((c) => c.profissaoCodigo));
  if (codigos.size !== 1) return null;
  const nH = cartas.filter((c) => c.tipo === "H").length;
  const nC = cartas.filter((c) => c.tipo === "C").length;
  if (nH !== 3 || nC !== 3) return null;
  const codigo = [...codigos][0];
  const prof = PROFISSOES.find((p) => p.codigo === codigo);
  return prof ? { codigo, nome: prof.nome } : null;
}

// Fisher-Yates shuffle (não muta o array original)
export function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MAX_ALUNOS = PROFISSOES.length; // 1 profissão por aluno
export const CARTAS_POR_ALUNO = 6;

// Distribui as cartas: escolhe N profissões (N = nº de alunos), embaralha
// as 6N cartas e entrega 6 para cada um. Refaz o embaralhamento se alguém
// começar com 4+ cartas da mesma profissão (para garantir que todos negociem).
export function distribuir(uids) {
  const n = uids.length;
  if (n < 2) throw new Error("É preciso pelo menos 2 alunos na sala para iniciar o jogo.");
  if (n > MAX_ALUNOS) {
    throw new Error(
      `Esta sala tem ${n} alunos; o máximo é ${MAX_ALUNOS} (uma profissão por aluno). ` +
        "Crie outra sala para o restante da turma ou formem duplas em um mesmo aparelho."
    );
  }
  const codigos = embaralhar(PROFISSOES.map((p) => p.codigo)).slice(0, n);
  const ids = buildDeck(codigos).map((c) => c.id);
  let maos = null;
  for (let tentativa = 0; tentativa < 200; tentativa++) {
    const b = embaralhar(ids);
    const candidata = Object.fromEntries(uids.map((u, i) => [u, b.slice(i * 6, i * 6 + 6)]));
    const ok = Object.values(candidata).every((mao) => {
      const cont = {};
      mao.forEach((id) => (cont[id.slice(0, 3)] = (cont[id.slice(0, 3)] || 0) + 1));
      return Math.max(...Object.values(cont)) <= 3;
    });
    maos = candidata;
    if (ok) break;
  }
  return { codigos, maos };
}
