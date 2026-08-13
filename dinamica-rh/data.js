// data.JS — Deck mestre da dinâmica (mesma lógica do material impresso)
// 10 profissões x (3 habilidades + 3 competências) = 60 cartas
// NÃO altere os códigos (Pxx) sem também atualizar o gabarito impresso (Parte 1).

export const PROFISSOES = [
  {
        codigo: "P01",
        nome: "Gestor(a) de Recursos Humanos",
        habilidades: [
                "Operar sistemas de gestão de RH (HRIS) e processos de folha de pagamento",
                "Conduzir processos de recrutamento e seleção, incluindo entrevistas e dinâmicas de grupo",
                "Construir e interpretar indicadores de pessoas (turnover, absenteísmo, People Analytics)",
              ],
        competencias: [
                "Mediar conflitos e administrar relações interpessoais no ambiente de trabalho",
                "Alinhar políticas de pessoas aos objetivos estratégicos do negócio",
                "Comunicar-se com escuta ativa para integrar perfis e demandas diversas",
              ],
  },
  {
        codigo: "P02",
        nome: "Analista Financeiro",
        habilidades: [
                "Construir modelagens financeiras e planilhas avançadas (Excel/BI)",
                "Analisar demonstrações contábeis e indicadores (ROI, EBITDA, fluxo de caixa)",
                "Utilizar ferramentas de IA e análise preditiva para projeções financeiras",
              ],
        competencias: [
                "Tomar decisões analíticas sob incerteza e pressão de prazos",
                "Garantir conformidade regulatória e tributária nas rotinas financeiras",
                "Comunicar-se em inglês em operações e negociações internacionais",
              ],
  },
  {
        codigo: "P03",
        nome: "Gerente de Marketing",
        habilidades: [
                "Planejar e executar campanhas digitais (SEO, mídia paga, redes sociais)",
                "Analisar métricas de marketing (CAC, LTV, funil de conversão)",
                "Usar ferramentas de automação e IA generativa na criação de conteúdo",
              ],
        competencias: [
                "Desenvolver visão estratégica de marca e posicionamento de mercado",
                "Comunicar-se de forma persuasiva por meio de storytelling",
                "Liderar equipes multidisciplinares e agências parceiras",
              ],
  },
  {
        codigo: "P04",
        nome: "Gerente Comercial / Consultor(a) de Vendas",
        habilidades: [
                "Aplicar técnicas de negociação e fechamento de vendas",
                "Gerenciar CRM e pipeline comercial",
                "Elaborar propostas comerciais e políticas de precificação",
              ],
        competencias: [
                "Demonstrar resiliência e persistência diante de rejeições",
                "Construir relacionamentos de confiança com clientes",
                "Manter orientação a metas e resultados",
              ],
  },
  {
        codigo: "P05",
        nome: "Analista de Dados / Business Intelligence",
        habilidades: [
                "Programar em SQL/Python para tratamento e análise de dados",
                "Construir dashboards e relatórios (Power BI, Tableau)",
                "Aplicar estatística e modelagem preditiva",
              ],
        competencias: [
                "Transformar dados em insights relevantes para decisões de negócio",
                "Comunicar resultados técnicos para públicos não especializados",
                "Manter curiosidade e aprendizado contínuo diante de novas tecnologias de IA",
              ],
  },
  {
        codigo: "P06",
        nome: "Gestor(a) de Projetos",
        habilidades: [
                "Aplicar metodologias ágeis (Scrum, Kanban) e ferramentas de gestão (Jira, MS Project)",
                "Elaborar cronogramas, orçamentos e planos de gestão de riscos",
                "Dominar certificações técnicas de referência (PMP, PMI)",
              ],
        competencias: [
                "Exercer liderança situacional sobre equipes multidisciplinares",
                "Negociar escopo, prazos e recursos com stakeholders",
                "Adaptar-se a mudanças de escopo e prioridades",
              ],
  },
  {
        codigo: "P07",
        nome: "Empreendedor(a) / Fundador(a) de Startup",
        habilidades: [
                "Elaborar plano de negócios e modelagem de viabilidade (Business Model Canvas)",
                "Captar recursos e apresentar pitches a investidores (valuation)",
                "Gerir fluxo de caixa e precificação em estágio inicial",
              ],
        competencias: [
                "Tolerar riscos e manter resiliência diante da incerteza",
                "Identificar oportunidades de mercado com visão estratégica",
                "Liderar de forma inspiradora para engajar equipe e investidores",
              ],
  },
  {
        codigo: "P08",
        nome: "Analista de Logística / Supply Chain",
        habilidades: [
                "Planejar estoques e demanda com sistemas MRP/ERP",
                "Roteirizar e otimizar operações de transporte",
                "Monitorar indicadores logísticos (OTIF, lead time, giro de estoque)",
              ],
        competencias: [
                "Aplicar pensamento sistêmico para integrar toda a cadeia de suprimentos",
                "Resolver problemas de forma colaborativa sob pressão de prazos",
                "Negociar com fornecedores e parceiros logísticos",
              ],
  },
  {
        codigo: "P09",
        nome: "Consultor(a) de Gestão / Business Consultant",
        habilidades: [
                "Diagnosticar organizações e mapear processos (BPM)",
                "Elaborar relatórios e apresentações executivas",
                "Aplicar ferramentas de análise estratégica (SWOT, 5 forças de Porter)",
              ],
        competencias: [
                "Comunicar-se e persuadir para conduzir mudanças organizacionais",
                "Exercer pensamento crítico e visão sistêmica do negócio",
                "Adaptar-se a diferentes culturas e contextos de clientes",
              ],
  },
  {
        codigo: "P10",
        nome: "Gestor(a) de Operações",
        habilidades: [
                "Gerenciar processos produtivos e indicadores de produtividade (OEE)",
                "Aplicar metodologias de melhoria contínua (Lean, Six Sigma)",
                "Elaborar e controlar orçamentos operacionais",
              ],
        competencias: [
                "Liderar equipes operacionais em ambientes de pressão",
                "Tomar decisões rápidas orientadas por dados",
                "Equilibrar estrategicamente custo, qualidade e prazo",
              ],
  },
  ];

// Achata as profissões em uma lista de 60 cartas: { id, profissaoCodigo, profissaoNome, tipo, texto }
export function buildDeck() {
    const cards = [];
    for (const p of PROFISSOES) {
          p.habilidades.forEach((texto, i) => {
                  cards.push({
                            id: `${p.codigo}-H${i + 1}`,
                            profissaoCodigo: p.codigo,
                            profissaoNome: p.nome,
                            tipo: "H",
                            texto,
                  });
          });
          p.competencias.forEach((texto, i) => {
                  cards.push({
                            id: `${p.codigo}-C${i + 1}`,
                            profissaoCodigo: p.codigo,
                            profissaoNome: p.nome,
                            tipo: "C",
                            texto,
                  });
          });
    }
    return cards;
}

// Verifica se um conjunto de 6 cartas forma o perfil correto de UMA profissão (3H + 3C, mesmo código)
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
