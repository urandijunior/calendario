// data.js — Dinâmica "Mercado de Talentos: Liderança"
// Cenário único, 10 ramos de atividade, 60 funcionários (6 por ramo, cada um com uma
// habilidade, uma competência e um jeito de liderar), questionário do líder e classificação.
//
// Base teórica (aula Liderança – Adm 4º sem): Hersey e Blanchard (situacional),
// White e Lippitt / Chiavenato (estilos), Drucker (resultado x popularidade),
// Collins (Nível 5), Kotter (8 passos da mudança). Dados de abertura: Gallup 2025-26 e DDI 2025.

export const MAX_TROCAS = 8;
export const TAM_EQUIPE = 6;
export const CARTAS_GARANTIDAS = 2; // funcionários do próprio ramo que cada aluno já recebe
export const VALIDADE_PROPOSTA_MS = 60_000; // proposta expira em 1 minuto
export const MAX_PROPOSTAS_ABERTAS = 3;
export const MAX_ALUNOS = 60;

export const NIVEIS = [
  { id: "perfeita", nome: "Equipe perfeita", nota: 1.0, vagas: 5, emoji: "🏆" },
  { id: "ideal", nome: "Equipe ideal", nota: 0.8, vagas: 8, emoji: "🥈" },
  { id: "equilibrada", nome: "Equipe equilibrada", nota: 0.6, vagas: 3, emoji: "⚖️" },
  { id: "participacao", nome: "Participação", nota: 0.5, vagas: Infinity, emoji: "🙋" },
];

export const CENARIO = {
  titulo: "Missão: a virada em 90 dias",
  texto:
    "Você acaba de assumir a diretoria de uma organização em crise. O quadro repete o que vimos em aula: " +
    "só 1 em cada 5 pessoas está engajada, a confiança no gestor imediato despencou e os melhores talentos " +
    "ameaçam sair por falta de crescimento. O conselho deu 90 dias para virar o jogo. " +
    "Sua missão: montar uma equipe de 6 pessoas que cubra as 6 frentes do negócio e, dentro dela, " +
    "escolher quem vai liderar a virada.",
  lembretes: [
    "O estilo certo depende da maturidade da equipe (Hersey e Blanchard).",
    "Popularidade não é liderança. Resultados sim (Drucker).",
    "O Nível 5 une humildade pessoal e determinação profissional (Collins).",
    "Mudança começa pelo passo que está travando a organização (Kotter).",
  ],
};

export const MATURIDADE = {
  E1: { nome: "E1 · Pouca maturidade", estilo: "DET" },
  E2: { nome: "E2 · Quer, mas não sabe", estilo: "PER" },
  E3: { nome: "E3 · Sabe, mas hesita", estilo: "COM" },
  E4: { nome: "E4 · Sabe e quer", estilo: "DEL" },
};
export const ESTILOS = { DET: "Determinar", PER: "Persuadir", COM: "Compartilhar", DEL: "Delegar" };

export const KOTTER = {
  1: "Criar senso de urgência",
  2: "Formar uma coalizão forte",
  3: "Desenvolver a visão",
  4: "Comunicar a visão",
  5: "Remover obstáculos",
  6: "Gerar vitórias rápidas",
  7: "Consolidar ganhos (não declarar vitória cedo)",
  8: "Ancorar a mudança na cultura",
};

// ---------------------------------------------------------------------------
// Como cada pessoa age quando lidera (gera a linha "Quando lidera" da carta)
//   L = líder certo do ramo: estilo que a maturidade pede + traços do Nível 5
//   K = armadilha do carisma (Drucker): popular, quer aplauso, evita cobrar
//   GA = gerente autocrático · GL = gerente liberal (White e Lippitt)
//   S = outro estilo situacional (que não serve para aquela equipe) · X = prefere executar
// ---------------------------------------------------------------------------
const LINHAS = {
  DET: [
    "Diz exatamente o que fazer, como e até quando, e confere de perto cada etapa.",
    "Monta o passo a passo, distribui as tarefas e acompanha a execução todos os dias.",
    "Dá instruções claras e detalhadas e corrige na hora o que sai do padrão.",
  ],
  PER: [
    "Explica o porquê de cada decisão e treina a equipe enquanto cobra o resultado.",
    "Ensina fazendo junto, dá retorno frequente e vende a ideia até o time comprar.",
    "Orienta de perto, mas sempre justificando: quer que a equipe entenda e se convença.",
  ],
  COM: [
    "Decide junto com a equipe e reforça a confiança de quem sabe, mas hesita.",
    "Ouve antes de decidir, divide as decisões e encoraja o time a arriscar de novo.",
    "Chama a equipe para construir a solução e apoia quem tem medo de errar.",
  ],
  DEL: [
    "Combina a meta e dá autonomia para a equipe decidir o caminho; acompanha pelos resultados.",
    "Confia em quem sabe e quer: entrega o objetivo e sai da frente.",
    "Define aonde chegar e deixa o time escolher como; só entra quando é chamado(a).",
  ],
  N5: [
    " Assume os erros, divide os méritos e não larga a meta.",
    " Discreto(a), dá o crédito à equipe e é implacável com o resultado.",
    " Fala pouco de si e muito da meta; quando algo dá errado, responde primeiro.",
  ],
  K: [
    "Carismático(a), o(a) mais querido(a) da equipe; adora ser a cara do projeto e adia decisões impopulares.",
    "Faz discursos que empolgam e coleciona curtidas; evita cobrar para não perder a simpatia do time.",
    "Inspira com a própria história e quer o palco; quando o resultado não vem, culpa o cenário.",
  ],
  GA: [
    "Decide sozinho(a) e controla cada detalhe: a produção sobe quando está por perto e trava quando sai.",
    "Não abre espaço para opinião: manda, cobra e pune o erro na frente de todos.",
  ],
  GL: [
    "Deixa cada um fazer do seu jeito e quase não acompanha: “cada um sabe o que faz”.",
    "Evita orientar e cobrar; as decisões ficam soltas e cada um puxa para um lado.",
  ],
  X: [
    "Prefere executar a liderar: rende mais com metas claras dadas por outra pessoa.",
    "Não gosta de coordenar gente; quer foco total na parte técnica.",
  ],
};

function linhaLideranca(p, i) {
  if (p.papel === "L") return LINHAS[p.estilo][i % 3] + LINHAS.N5[i % 3];
  if (p.papel === "K") return LINHAS.K[i % 3];
  if (p.papel === "GA") return LINHAS.GA[i % 2];
  if (p.papel === "GL") return LINHAS.GL[i % 2];
  if (p.papel === "X") return LINHAS.X[i % 2];
  return LINHAS[p.estilo][(i + 1) % 3]; // S
}

// ---------------------------------------------------------------------------
// Os 10 ramos
// ---------------------------------------------------------------------------
const RAMOS_BASE = [
  {
    codigo: "AGR", icone: "🌾", nome: "Agronegócio",
    empresa: "Fazenda Santa Clara · soja e milho, 12 mil hectares (Sorriso/MT)",
    contexto: "A fazenda comprou máquinas com piloto automático e sensores, mas as perdas na colheita subiram e dois compradores de exportação ameaçam cancelar contratos por falta de rastreabilidade.",
    mat: "E2",
    sinalMat: "os operadores estão animados com as máquinas novas e pedem para usá-las, mas ainda não sabem configurar os sensores nem ler os mapas de produtividade",
    kotter: 6, kotterOpcoes: [6, 1, 3, 8],
    sinalKotter: "os funcionários mais antigos duvidam que a tecnologia funcione; uma colheita bem-sucedida num talhão-piloto convenceria a todos",
    equipe: [
      { nome: "Diego Arruda", cargo: "Operador de máquinas agrícolas", hab: "Configura piloto automático, GPS e aplicação em taxa variável", comp: "Atenção minuciosa aos detalhes", frente: "Tirar o máximo das máquinas novas no campo", papel: "S", estilo: "DEL" },
      { nome: "Helena Campos", cargo: "Agrônoma de agricultura de precisão", hab: "Interpreta mapas de produtividade e análises de solo", comp: "Pensamento analítico", frente: "Transformar dados do campo em decisão de manejo", papel: "L", estilo: "PER" },
      { nome: "Rafael Nunes", cargo: "Analista de certificação e rastreabilidade", hab: "Organiza rastreabilidade de lotes e auditorias de certificação", comp: "Rigor e ética", frente: "Garantir rastreabilidade exigida pelos compradores externos", papel: "X" },
      { nome: "Sandra Lemos", cargo: "Mecânica de manutenção agrícola", hab: "Faz manutenção preventiva de colheitadeiras e plantadeiras", comp: "Disciplina com prazos", frente: "Manter a frota sem paradas na safra", papel: "S", estilo: "DET" },
      { nome: "Bruno Tavares", cargo: "Comercial de grãos", hab: "Negocia contratos com tradings e trava preço (hedge)", comp: "Comunicação persuasiva", frente: "Segurar os contratos de exportação", papel: "K" },
      { nome: "Cláudia Ribeiro", cargo: "Técnica de segurança do trabalho rural", hab: "Treina a NR-31 e fiscaliza o uso de EPIs no campo", comp: "Firmeza", frente: "Zerar acidentes no campo e na secagem", papel: "GA" },
    ],
  },
  {
    codigo: "VAR", icone: "🛒", nome: "Varejo",
    empresa: "Supermercados Rio Cuiabá · 8 lojas na Grande Cuiabá",
    contexto: "Um atacarejo nacional abriu duas lojas na cidade. A rede reagiu e as vendas voltaram a crescer, mas o estoque parado, as perdas de perecíveis e as filas ainda irritam os clientes.",
    mat: "E3",
    sinalMat: "os gerentes de loja são experientes e conhecem bem o negócio, mas, depois de um corte de 15% no quadro, ficaram inseguros e evitam decidir sem aval da diretoria",
    kotter: 7, kotterOpcoes: [7, 1, 4, 8],
    sinalKotter: "as vendas melhoraram no último trimestre e a diretoria já quer declarar vitória e encerrar o projeto de mudança",
    equipe: [
      { nome: "Patrícia Moura", cargo: "Compradora de perecíveis", hab: "Negocia com fornecedores e reduz perdas de hortifrúti", comp: "Senso de economia", frente: "Cortar as perdas de perecíveis", papel: "S", estilo: "DET" },
      { nome: "Lucas Ferraz", cargo: "Analista de dados de vendas", hab: "Monta painéis de giro de estoque e ruptura de gôndola", comp: "Curiosidade investigativa", frente: "Descobrir o que encalha e o que falta", papel: "X" },
      { nome: "Joana Prado", cargo: "Gerente de operações de loja", hab: "Organiza escalas de caixa e o fluxo de reposição", comp: "Equilíbrio sob pressão", frente: "Acabar com as filas nos horários de pico", papel: "L", estilo: "COM" },
      { nome: "Tiago Barros", cargo: "Especialista em e-commerce e delivery", hab: "Opera a loja online e o aplicativo de entregas", comp: "Agilidade para testar e ajustar", frente: "Vender também fora da loja física", papel: "S", estilo: "DEL" },
      { nome: "Marina Leal", cargo: "Coordenadora de marketing", hab: "Planeja ofertas e o programa de fidelidade", comp: "Criatividade", frente: "Trazer o cliente de volta do atacarejo", papel: "K" },
      { nome: "Otávio Rangel", cargo: "Supervisor de prevenção de perdas", hab: "Controla quebras, furtos e prazos de validade", comp: "Vigilância constante", frente: "Proteger a margem contra quebras e furtos", papel: "GA" },
    ],
  },
  {
    codigo: "SAU", icone: "🏥", nome: "Saúde",
    empresa: "Hospital Regional do Médio Norte · 180 leitos",
    contexto: "O pronto-socorro está superlotado, a espera passa de 6 horas e as reclamações na ouvidoria triplicaram. Há verba para reorganizar o fluxo de atendimento.",
    mat: "E3",
    sinalMat: "médicos e enfermeiros são experientes e sabem o que fazer, mas, após processos e críticas na imprensa, ficaram inseguros e evitam mudar a rotina",
    kotter: 2, kotterOpcoes: [2, 3, 6, 8],
    sinalKotter: "a diretoria clínica e a diretoria administrativa disputam o comando do projeto e cada uma decide sem consultar a outra",
    equipe: [
      { nome: "Renata Souza", cargo: "Enfermeira de classificação de risco", hab: "Aplica o Protocolo de Manchester na triagem", comp: "Empatia sem perder o critério", frente: "Separar o grave do não urgente logo na porta", papel: "L", estilo: "COM" },
      { nome: "Dr. Fernando Castro", cargo: "Médico emergencista", hab: "Conduz casos graves e protocolos de emergência", comp: "Sangue-frio", frente: "Dar conta dos casos críticos sem atraso", papel: "K" },
      { nome: "Simone Araújo", cargo: "Gestora de leitos", hab: "Controla ocupação, altas e transferências", comp: "Organização", frente: "Liberar leitos mais rápido", papel: "GA" },
      { nome: "Paulo Mendes", cargo: "Analista de custos hospitalares", hab: "Calcula custo por paciente e reduz glosas dos convênios", comp: "Precisão", frente: "Fazer a verba render", papel: "X" },
      { nome: "Aline Batista", cargo: "Coordenadora de humanização e ouvidoria", hab: "Trata reclamações e comunica-se com as famílias", comp: "Escuta ativa", frente: "Reconquistar a confiança de pacientes e famílias", papel: "S", estilo: "DEL" },
      { nome: "Gustavo Pires", cargo: "Farmacêutico hospitalar", hab: "Gerencia o estoque de medicamentos e a rastreabilidade", comp: "Responsabilidade", frente: "Não deixar faltar medicamento no PS", papel: "S", estilo: "DET" },
    ],
  },
  {
    codigo: "TEC", icone: "💻", nome: "Tecnologia",
    empresa: "AgroData · startup de software de gestão rural",
    contexto: "A startup recebeu um aporte e cresceu de 15 para 60 pessoas em um ano. Os clientes reclamam de falhas, o dinheiro do aporte acaba em 12 meses e os melhores programadores recebem propostas de fora.",
    mat: "E4",
    sinalMat: "o time é experiente, motivado e entrega acima da média do mercado; quer autonomia para decidir como resolver os problemas",
    kotter: 3, kotterOpcoes: [3, 1, 5, 7],
    sinalKotter: "cada equipe puxa para um lado e ninguém sabe dizer qual produto é a prioridade da empresa",
    equipe: [
      { nome: "Igor Matsuda", cargo: "Desenvolvedor back-end sênior", hab: "Corrige falhas e escala a arquitetura na nuvem", comp: "Excelência técnica", frente: "Acabar com as falhas que irritam os clientes", papel: "K" },
      { nome: "Larissa Antunes", cargo: "Gerente de produto", hab: "Prioriza o roadmap com base em dados de uso", comp: "Foco no cliente", frente: "Decidir o que construir primeiro", papel: "L", estilo: "DEL" },
      { nome: "Caio Rezende", cargo: "Designer de experiência (UX)", hab: "Testa telas com produtores rurais no campo", comp: "Empatia com o usuário", frente: "Tornar o sistema fácil para o produtor", papel: "S", estilo: "COM" },
      { nome: "Natália Freitas", cargo: "Especialista em segurança de dados", hab: "Adequa os sistemas à LGPD e previne vazamentos", comp: "Prudência", frente: "Proteger os dados dos clientes", papel: "X" },
      { nome: "Henrique Dias", cargo: "Analista de sucesso do cliente", hab: "Reduz cancelamentos e treina clientes no uso do sistema", comp: "Paciência", frente: "Segurar os clientes insatisfeitos", papel: "S", estilo: "PER" },
      { nome: "Vanessa Lima", cargo: "Analista financeira", hab: "Controla a queima de caixa e projeta o fôlego financeiro", comp: "Realismo", frente: "Fazer o dinheiro do aporte durar", papel: "GA" },
    ],
  },
  {
    codigo: "IND", icone: "🏭", nome: "Indústria",
    empresa: "Frigorífico Pantanal Carnes · 900 funcionários (Cáceres/MT)",
    contexto: "Os acidentes dobraram, o retrabalho na desossa cresceu e um importador suspendeu as compras após uma auditoria sanitária.",
    mat: "E1",
    sinalMat: "a maioria dos operários foi contratada há menos de três meses, ainda não domina as tarefas e, com a alta rotatividade, mostra pouco compromisso com o trabalho",
    kotter: 1, kotterOpcoes: [1, 4, 7, 8],
    sinalKotter: "os supervisores acham que os acidentes “sempre aconteceram” e que o importador vai voltar sozinho",
    equipe: [
      { nome: "Marcos Vieira", cargo: "Supervisor de produção", hab: "Organiza a linha de desossa e as metas por turno", comp: "Constância", frente: "Fazer a linha produzir com padrão", papel: "L", estilo: "DET" },
      { nome: "Eduarda Monteiro", cargo: "Engenheira de segurança do trabalho", hab: "Mapeia riscos e implanta a NR-36", comp: "Prevenção", frente: "Reduzir os acidentes pela metade", papel: "S", estilo: "COM" },
      { nome: "Wagner Costa", cargo: "Técnico de qualidade e inspeção (SIF)", hab: "Prepara auditorias sanitárias e controla a inspeção", comp: "Rigor", frente: "Passar na próxima auditoria sanitária", papel: "X" },
      { nome: "Bianca Rocha", cargo: "Instrutora de treinamento operacional", hab: "Treina operários novos no próprio posto de trabalho", comp: "Didática", frente: "Ensinar o básico a quem acabou de chegar", papel: "S", estilo: "PER" },
      { nome: "Roberto Sales", cargo: "Analista de RH", hab: "Organiza recrutamento e ações contra a rotatividade", comp: "Simpatia", frente: "Segurar as pessoas na empresa", papel: "GL" },
      { nome: "Fabiana Duarte", cargo: "Gerente comercial de exportação", hab: "Negocia e recupera clientes importadores", comp: "Poder de persuasão", frente: "Reconquistar o importador", papel: "K" },
    ],
  },
  {
    codigo: "LOG", icone: "🚚", nome: "Logística",
    empresa: "Transportadora Rota Oeste · 140 caminhões",
    contexto: "Os atrasos nas entregas cresceram 40%, o diesel subiu e os clientes do agronegócio ameaçam trocar de transportadora. A diretoria aprovou um novo modelo de rotas com aplicativo.",
    mat: "E2",
    sinalMat: "motoristas e conferentes estão animados com o aplicativo e querem que dê certo, mas ainda não sabem usá-lo nem entendem as novas regras de entrega",
    kotter: 4, kotterOpcoes: [4, 2, 6, 8],
    sinalKotter: "a diretoria aprovou o novo modelo há um mês, mas os motoristas só souberam dele por boatos no grupo de mensagens",
    equipe: [
      { nome: "Felipe Andrade", cargo: "Analista de roteirização", hab: "Planeja rotas e cargas no software de roteirização", comp: "Raciocínio lógico", frente: "Montar rotas que cheguem no prazo", papel: "S", estilo: "DEL" },
      { nome: "Rogério Lima", cargo: "Gestor de frota", hab: "Controla consumo de diesel e manutenção dos caminhões", comp: "Controle de custos", frente: "Gastar menos diesel e parar menos na oficina", papel: "GA" },
      { nome: "Débora Cunha", cargo: "Coordenadora de armazém", hab: "Organiza recebimento, conferência e expedição", comp: "Senso de urgência", frente: "Carregar certo e sem atraso", papel: "L", estilo: "PER" },
      { nome: "Anderson Brito", cargo: "Instrutor de motoristas", hab: "Treina direção econômica e uso do aplicativo", comp: "Paciência", frente: "Colocar os motoristas para usar o aplicativo", papel: "S", estilo: "DET" },
      { nome: "Kátia Fontes", cargo: "Executiva de contas", hab: "Negocia prazos e contratos com os clientes", comp: "Carisma comercial", frente: "Não perder os clientes do agro", papel: "K" },
      { nome: "Sérgio Paiva", cargo: "Analista de custos logísticos", hab: "Calcula custo por entrega e tabela de frete", comp: "Precisão com números", frente: "Saber quanto custa cada entrega", papel: "X" },
    ],
  },
  {
    codigo: "EDU", icone: "🎒", nome: "Educação",
    empresa: "Colégio Horizonte · ensino fundamental e médio",
    contexto: "As matrículas caíram 20% em dois anos. A escola adotou a aprendizagem por projetos, mas os pais reclamam e os resultados ainda não apareceram.",
    mat: "E3",
    sinalMat: "os professores são experientes e dominam suas disciplinas, mas, depois das críticas dos pais, ficaram inseguros com o novo método e evitam arriscar",
    kotter: 5, kotterOpcoes: [5, 1, 3, 7],
    sinalKotter: "o novo método esbarra num sistema de notas antigo e numa grade sem horário para os professores planejarem juntos",
    equipe: [
      { nome: "Cristina Valença", cargo: "Coordenadora pedagógica", hab: "Planeja o currículo por projetos e a avaliação", comp: "Visão de conjunto", frente: "Organizar o novo método na escola toda", papel: "S", estilo: "DET" },
      { nome: "Rodrigo Teles", cargo: "Professor de matemática", hab: "Aplica metodologias ativas em sala de aula", comp: "Paixão por ensinar", frente: "Mostrar o método funcionando na sala", papel: "L", estilo: "COM" },
      { nome: "Lívia Nogueira", cargo: "Psicopedagoga", hab: "Acompanha alunos com dificuldade de aprendizagem", comp: "Sensibilidade", frente: "Não deixar nenhum aluno para trás", papel: "X" },
      { nome: "Mateus Carvalho", cargo: "Analista de marketing educacional", hab: "Conduz a campanha de matrículas e as redes da escola", comp: "Comunicação envolvente", frente: "Recuperar as matrículas", papel: "K" },
      { nome: "Regina Alves", cargo: "Secretária escolar", hab: "Organiza matrículas, documentos e o sistema de notas", comp: "Cumprimento de normas", frente: "Adaptar notas e documentos ao novo método", papel: "GA" },
      { nome: "Sílvia Ramos", cargo: "Coordenadora de relacionamento com as famílias", hab: "Conduz reuniões e pesquisas com os pais", comp: "Diplomacia", frente: "Transformar pais críticos em aliados", papel: "S", estilo: "DEL" },
    ],
  },
  {
    codigo: "FIN", icone: "🏦", nome: "Serviços financeiros",
    empresa: "Cooperativa de Crédito Vale Verde · 32 mil associados",
    contexto: "A cooperativa abriu 5 agências em 2 anos e lançou o atendimento digital. Os associados aprovaram, mas os bancos digitais estão levando os jovens e a inadimplência subiu.",
    mat: "E4",
    sinalMat: "a equipe é experiente, engajada, conhece os associados pelo nome e bate as metas com folga; pede autonomia para decidir",
    kotter: 8, kotterOpcoes: [8, 1, 3, 6],
    sinalKotter: "o atendimento digital melhorou, mas cada agência nova volta ao jeito antigo de trabalhar assim que a sede deixa de acompanhar",
    equipe: [
      { nome: "Jorge Albuquerque", cargo: "Gerente de relacionamento", hab: "Atende produtores e famílias associadas", comp: "Confiança construída no longo prazo", frente: "Manter o associado perto da cooperativa", papel: "L", estilo: "DEL" },
      { nome: "Priscila Gomes", cargo: "Analista de crédito e risco", hab: "Avalia cadastros e reduz a inadimplência", comp: "Prudência", frente: "Baixar a inadimplência", papel: "X" },
      { nome: "Leonardo Bastos", cargo: "Especialista em canais digitais", hab: "Gerencia o aplicativo e o atendimento online", comp: "Inovação", frente: "Competir com os bancos digitais", papel: "S", estilo: "PER" },
      { nome: "Elaine Torres", cargo: "Educadora financeira", hab: "Conduz programas de educação financeira", comp: "Didática", frente: "Ensinar o associado a não se endividar", papel: "S", estilo: "COM" },
      { nome: "Márcio Queiroz", cargo: "Analista de conformidade (compliance)", hab: "Aplica as normas do Banco Central e a prevenção à lavagem de dinheiro", comp: "Integridade", frente: "Crescer sem descumprir as normas", papel: "GA" },
      { nome: "Yasmin Coelho", cargo: "Coordenadora de marketing cooperativista", hab: "Atrai jovens e comunica o modelo cooperativo", comp: "Influência nas redes", frente: "Trazer os jovens para a cooperativa", papel: "K" },
    ],
  },
  {
    codigo: "TUR", icone: "🛶", nome: "Turismo e hotelaria",
    empresa: "Pousada Rio Claro · ecoturismo no Pantanal",
    contexto: "A nota da pousada nos sites de avaliação caiu de 4,7 para 3,9, grupos estrangeiros cancelaram reservas e a alta temporada começa em 30 dias.",
    mat: "E1",
    sinalMat: "a equipe foi contratada às pressas para a temporada: ninguém tem experiência em hotelaria e muitos já falam em sair antes do fim do contrato",
    kotter: 6, kotterOpcoes: [6, 2, 4, 8],
    sinalKotter: "a equipe nova está desanimada com as críticas e precisa ver uma conquista concreta já na primeira semana",
    equipe: [
      { nome: "Thiago Rondon", cargo: "Guia de ecoturismo bilíngue", hab: "Conduz passeios e atende em inglês e espanhol", comp: "Encantar o visitante", frente: "Fazer o hóspede estrangeiro voltar", papel: "K" },
      { nome: "Zélia Marques", cargo: "Governanta", hab: "Padroniza limpeza e arrumação dos quartos", comp: "Exigência com a qualidade", frente: "Deixar os quartos impecáveis", papel: "L", estilo: "DET" },
      { nome: "Nilton Arantes", cargo: "Chef de cozinha", hab: "Cria cardápio regional e controla o custo dos pratos", comp: "Criatividade", frente: "Transformar a comida num motivo de visita", papel: "GL" },
      { nome: "Beatriz Lacerda", cargo: "Recepcionista sênior", hab: "Opera o sistema de reservas e responde avaliações online", comp: "Cordialidade", frente: "Responder e reverter as avaliações ruins", papel: "S", estilo: "COM" },
      { nome: "Osvaldo Pinheiro", cargo: "Técnico ambiental", hab: "Cuida das licenças e das práticas de turismo sustentável", comp: "Responsabilidade ambiental", frente: "Manter as licenças e o selo sustentável", papel: "X" },
      { nome: "Carla Bezerra", cargo: "Gerente de vendas e agências", hab: "Negocia pacotes com agências estrangeiras", comp: "Persistência", frente: "Recuperar os grupos que cancelaram", papel: "S", estilo: "DEL" },
    ],
  },
  {
    codigo: "PUB", icone: "🏛️", nome: "Setor público",
    empresa: "Prefeitura de Nova Esperança · central de atendimento ao cidadão",
    contexto: "Filas de até 4 horas, reclamações nas redes e o Tribunal de Contas cobrando resultados. A prefeitura criou o atendimento digital Cidadão+, mas poucos serviços funcionam online.",
    mat: "E2",
    sinalMat: "os servidores estão animados com o Cidadão+ e querem atender melhor, mas não sabem operar o sistema nem conhecem os novos fluxos",
    kotter: 2, kotterOpcoes: [2, 3, 5, 7],
    sinalKotter: "as secretarias de Administração e de Tecnologia disputam o projeto e não trabalham juntas",
    equipe: [
      { nome: "Adriana Siqueira", cargo: "Gestora de atendimento", hab: "Organiza filas, senhas e escalas dos atendentes", comp: "Foco no cidadão", frente: "Reduzir a fila presencial", papel: "L", estilo: "PER" },
      { nome: "Vinícius Prates", cargo: "Analista de TI", hab: "Integra os serviços ao portal digital", comp: "Resolução de problemas", frente: "Colocar os serviços para funcionar online", papel: "S", estilo: "DEL" },
      { nome: "Dra. Luciana Faria", cargo: "Assessora jurídica", hab: "Adequa os processos à Lei de Licitações e à LGPD", comp: "Rigor legal", frente: "Mudar sem descumprir a lei", papel: "GA" },
      { nome: "Gilberto Moraes", cargo: "Servidor de ouvidoria", hab: "Trata reclamações e mede a satisfação do cidadão", comp: "Escuta ativa", frente: "Ouvir e responder o cidadão", papel: "S", estilo: "COM" },
      { nome: "Teresa Brandão", cargo: "Analista de orçamento público", hab: "Planeja os recursos no PPA e na LOA", comp: "Planejamento", frente: "Garantir dinheiro no orçamento para o projeto", papel: "X" },
      { nome: "Danilo Peixoto", cargo: "Assessor de comunicação", hab: "Divulga o Cidadão+ para a população", comp: "Presença nas redes", frente: "Fazer a população usar o Cidadão+", papel: "K" },
    ],
  },
];

// Monta ids, a linha "Quando lidera" e o índice de funcionários
export const RAMOS = RAMOS_BASE.map((r) => {
  const equipe = r.equipe.map((p, i) => ({ ...p, id: `${r.codigo}${i + 1}`, ramo: r.codigo, lidera: linhaLideranca(p, i + r.codigo.charCodeAt(0)) }));
  return { ...r, equipe, liderId: equipe.find((p) => p.papel === "L").id, carismaId: equipe.find((p) => p.papel === "K").id, idsEquipe: equipe.map((p) => p.id) };
});
export const RAMO = Object.fromEntries(RAMOS.map((r) => [r.codigo, r]));
export const FUNCIONARIOS = Object.fromEntries(RAMOS.flatMap((r) => r.equipe).map((p) => [p.id, p]));

// id de cópia da carta: "AGR2-3" → funcionário "AGR2"
export const funcId = (cardId) => String(cardId).split("-")[0];

// Quantos dos 6 funcionários do ramo estão na mão (repetidos contam uma vez)
export function proximidade(ramoCod, cardIds) {
  const ramo = RAMO[ramoCod];
  if (!ramo) return 0;
  const tenho = new Set(cardIds.map(funcId));
  return ramo.idsEquipe.filter((id) => tenho.has(id)).length;
}

// ---------------------------------------------------------------------------
// Distribuição: o baralho tem exatamente os 6 funcionários de cada aluno (oferta = demanda).
// Cada aluno recebe 2 do próprio ramo e 4 sorteados; ninguém começa com 5 ou 6 certos.
// ---------------------------------------------------------------------------
function embaralhar(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function distribuir(alunos /* [{uid, ramo}] */, rnd = Math.random) {
  const n = alunos.length;
  if (n < 2) throw new Error("É preciso pelo menos 2 alunos na sala para iniciar.");
  if (n > MAX_ALUNOS) throw new Error(`Esta sala tem ${n} alunos; o máximo é ${MAX_ALUNOS}.`);
  for (let tentativa = 0; tentativa < 500; tentativa++) {
    const copias = {};
    const novaCarta = (fid) => `${fid}-${(copias[fid] = (copias[fid] || 0) + 1)}`;
    const maos = alunos.map(() => []);
    let resto = [];
    alunos.forEach((a, i) => {
      const ids = embaralhar(RAMO[a.ramo].idsEquipe, rnd);
      ids.slice(0, CARTAS_GARANTIDAS).forEach((fid) => maos[i].push(novaCarta(fid)));
      ids.slice(CARTAS_GARANTIDAS).forEach((fid) => resto.push(novaCarta(fid)));
    });
    resto = embaralhar(resto, rnd);
    alunos.forEach((a, i) => { while (maos[i].length < TAM_EQUIPE) maos[i].push(resto.pop()); });
    const ok = alunos.every((a, i) => proximidade(a.ramo, maos[i]) <= 4 && new Set(maos[i].map(funcId)).size === TAM_EQUIPE);
    if (ok || tentativa === 499) return Object.fromEntries(alunos.map((a, i) => [a.uid, maos[i]]));
  }
}

// ---------------------------------------------------------------------------
// Questionário do líder (6 questões): teoria × cenário × a equipe que o aluno montou.
// As opções "pessoa" são os funcionários da mão do aluno + "ninguém da minha equipe".
// ---------------------------------------------------------------------------
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
export const NINGUEM = "__ninguem__";

export function montarQuestionario(ramoCod, maoFuncIds) {
  const r = RAMO[ramoCod];
  const est = MATURIDADE[r.mat].estilo;
  const pessoas = [...new Set(maoFuncIds)].map((id) => FUNCIONARIOS[id]).filter(Boolean);
  const temLider = pessoas.some((p) => p.id === r.liderId);
  const temCarisma = pessoas.some((p) => p.id === r.carismaId);
  const opPessoas = pessoas.map((p) => ({ v: p.id, t: `${p.nome} · ${p.cargo}`, det: p.lidera }));
  const opNinguem = { v: NINGUEM, t: "Ninguém da minha equipe tem esse perfil" };
  return [
    {
      id: "q1", teoria: "Hersey e Blanchard · cenário",
      texto: `Cenário (${r.empresa.split(" · ")[0]}): ${cap(r.sinalMat)}. Em que nível de maturidade está essa equipe?`,
      opcoes: Object.entries(MATURIDADE).map(([k, m]) => ({ v: k, t: m.nome })),
      certa: r.mat,
      explica: `${MATURIDADE[r.mat].nome}: ${r.sinalMat}.`,
    },
    {
      id: "q2", teoria: "Liderança situacional",
      texto: "Se a maturidade da equipe é essa, qual estilo o líder precisa adotar nos próximos 90 dias?",
      opcoes: Object.entries(ESTILOS).map(([k, t]) => ({ v: k, t })),
      certa: est,
      explica: `Hersey e Blanchard: ${r.mat} pede o estilo ${ESTILOS[est]}.`,
    },
    {
      id: "q3", teoria: "Chiavenato · influência na situação", pessoas: true,
      texto: "Leia como cada pessoa da sua equipe age quando lidera. Quem pratica o estilo que essa situação pede?",
      opcoes: [...opPessoas, opNinguem],
      certa: temLider ? r.liderId : NINGUEM,
      explica: `Quem lidera no estilo ${ESTILOS[est]} é ${FUNCIONARIOS[r.liderId].nome}.`,
    },
    {
      id: "q4", teoria: "Drucker · resultado x popularidade", pessoas: true,
      texto: "Drucker: “Popularidade não é liderança. Resultados sim.” Quem da sua equipe corre o maior risco de ser escolhido(a) para liderar pela popularidade, e não pelos resultados?",
      opcoes: [...opPessoas, opNinguem],
      certa: temCarisma ? r.carismaId : NINGUEM,
      explica: `A armadilha do carisma era ${FUNCIONARIOS[r.carismaId].nome}: querido(a), mas evita decisões difíceis.`,
    },
    {
      id: "q5", teoria: "Collins · Nível 5", pessoas: true,
      texto: "Collins: o executivo Nível 5 une humildade pessoal e determinação profissional. Quem da sua equipe mais se aproxima disso?",
      opcoes: [...opPessoas, opNinguem],
      certa: temLider ? r.liderId : NINGUEM,
      explica: `${FUNCIONARIOS[r.liderId].nome} assume os erros, divide os méritos e não larga a meta.`,
    },
    {
      id: "q6", teoria: "Kotter · cenário",
      texto: `Cenário (${r.empresa.split(" · ")[0]}): ${cap(r.sinalKotter)}. Qual passo de Kotter o líder deve atacar primeiro?`,
      opcoes: r.kotterOpcoes.map((k) => ({ v: String(k), t: `${k}. ${KOTTER[k]}` })),
      certa: String(r.kotter),
      explica: `Passo ${r.kotter}: ${KOTTER[r.kotter]}.`,
    },
  ];
}

export function corrigirQuestionario(ramoCod, maoFuncIds, respostas) {
  const qs = montarQuestionario(ramoCod, maoFuncIds);
  return qs.filter((q) => respostas?.[q.id] === q.certa).length;
}

// ---------------------------------------------------------------------------
// Classificação da turma (5 · 8 · 3 · demais)
//   Elegíveis ao topo: fecharam 6/6 E escolheram o líder certo.
//     Ordem: menos trocas → mais acertos no questionário → quem concluiu primeiro.
//     1º–5º = perfeita (1,0) · 6º–13º = ideal (0,8).
//   Equilibrada (0,6): as 3 próximas posições entre quem concluiu o questionário
//     (sobras do topo, depois 6/6 com líder errado, depois quem ficou mais perto: 5/6...).
//   Demais: 0,5 por participar.
// ---------------------------------------------------------------------------
export function classificar(alunos /* [{uid, ...dados do aluno}] */) {
  const ms = (t) => (t?.toMillis ? t.toMillis() : typeof t === "number" ? t : Number.MAX_SAFE_INTEGER);
  const concluiu = alunos.filter((a) => a.fase === "concluido");
  const elegivel = (a) => a.equipeFinal === TAM_EQUIPE && a.liderCerto;
  const ordemTopo = (a, b) => (a.trocas || 0) - (b.trocas || 0) || (b.acertos || 0) - (a.acertos || 0) || ms(a.concluidoEm) - ms(b.concluidoEm);
  const topo = concluiu.filter(elegivel).sort(ordemTopo);
  const res = {};
  let pos = 0;
  topo.slice(0, 5).forEach((a) => (res[a.uid] = { nivel: NIVEIS[0], pos: ++pos }));
  topo.slice(5, 13).forEach((a) => (res[a.uid] = { nivel: NIVEIS[1], pos: ++pos }));
  const sobra = topo.slice(13);
  const outros = concluiu.filter((a) => !elegivel(a)).sort((a, b) =>
    (b.equipeFinal || 0) - (a.equipeFinal || 0) || (b.liderCerto ? 1 : 0) - (a.liderCerto ? 1 : 0) || ordemTopo(a, b));
  const fila = [...sobra, ...outros];
  fila.slice(0, 3).forEach((a) => (res[a.uid] = { nivel: NIVEIS[2], pos: ++pos }));
  fila.slice(3).forEach((a) => (res[a.uid] = { nivel: NIVEIS[3], pos: ++pos }));
  alunos.filter((a) => !res[a.uid]).forEach((a) => (res[a.uid] = { nivel: NIVEIS[3], pos: null, pendente: true }));
  return res;
}
