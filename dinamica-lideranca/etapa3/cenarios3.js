// cenarios3.js — Etapa 3: um cenário novo por ramo, 18 meses depois da virada.
//
// Cada cenário traz: o que aconteceu com a empresa, dados reais de mercado de 2025-2026
// com a fonte citada, a equipe partida em duas maturidades, uma frente nova descoberta
// e um trade-off. As 8 questões fixas misturam esses dados com a teoria da aula
// (Drucker, Chiavenato, Hersey e Blanchard, Porter, Mintzberg, Kotter, Collins).
//
// dif: "facil" (1 por ramo) · "media" (4 por ramo) · "dificil" (3 por ramo)
// As questões q9 a q12 são geradas por aluno em motor3.js.

export const CENARIOS3 = {

  // =========================================================================
  AGR: {
    titulo: "Safra recorde, margem apertada",
    kicker: "18 meses depois",
    empresa: "Fazenda Santa Clara",
    sub: "Sorriso (MT) · soja e milho · agora 16 mil hectares",
    paragrafos: [
      "A virada deu certo. A rastreabilidade foi implantada, os dois compradores de exportação renovaram contrato e a fazenda colheu a melhor safra da sua história — acompanhando Mato Grosso, que fechou a safra 2025/26 com **51,56 milhões de toneladas de soja** e produtividade média de **66,03 sacas por hectare**, contra 60,45 sacas no ciclo anterior.",
      "Só que a safra recorde trouxe quatro problemas novos, todos ao mesmo tempo.",
      "**1. O frete comeu o lucro.** O frete rodoviário fechou março de 2026 a **R$ 7,99 por quilômetro rodado**, e o diesel responde por cerca de **35% do custo operacional** das transportadoras. Com todo mundo colhendo junto, a fazenda pagou frete de pico para escoar na janela mais cara do ano. Há duas saídas na mesa: construir armazenagem própria (investimento alto, retorno em safras) ou travar contratos de frete antecipados (barato, mas amarra o preço).",
      "**2. A área nova veio com gente nova.** O arrendamento de 4 mil hectares exigiu **9 operadores contratados há menos de dois meses**. Eles não dominam as máquinas, não leem mapa de produtividade e, com a rotatividade da região, vários já falam em sair antes do fim da safra. A equipe original, treinada nos 18 meses anteriores, hoje é autônoma e entrega acima da meta.",
      "**3. O comprador europeu subiu a régua.** Não basta mais rastrear o lote: ele exige comprovação de origem livre de desmatamento, com laudo auditável talhão por talhão.",
      "**4. A diretoria quer encerrar o projeto de mudança.** “Deu certo, bateu recorde, acabou.” Os conselheiros querem desmobilizar o comitê da virada e voltar à rotina antiga de gestão.",
      "Você tem **120 dias** e a mesma equipe que montou — com o líder que escolheu.",
    ],
    fontes: [
      "Imea — Imea em Campo, Etapa Soja, março de 2026 (51,56 Mt; 66,03 sc/ha; 103 municípios, 97,92% da área de MT)",
      "NTC & Logística e Índice de Frete Rodoviário Edenred Repom — março de 2026 (R$ 7,99/km; diesel ≈ 35% do custo operacional)",
    ],
    matAntiga: "E4", matNova: "E1", kotter: 7,
    frenteNova: {
      exige: "legal",
      texto: "O comprador europeu quer o **laudo de origem livre de desmatamento**, talhão por talhão, auditável por terceiros. Sem o laudo, o contrato de exportação não é renovado — e ele responde por boa parte da receita da fazenda.",
    },
    trocaTexto: "Você conseguiu autorização para contratar **um especialista em laudo ambiental e geomonitoramento**, que resolveria a exigência europeia de forma definitiva.",
    prioridade: ["legal", "treino", "financeiro", "dados", "operacao", "qualidade", "comercial", "seguranca", "comunicacao", "tecnologia", "cliente", "pessoas"],
    questoes: [
      { id: "q1", dif: "media", teoria: "Dados de mercado · Imea",
        texto: "A produtividade média da soja em Mato Grosso passou de 60,45 para 66,03 sacas por hectare na safra 2025/26 (Imea). Para a Fazenda Santa Clara, qual é a consequência de gestão mais imediata desse ganho?",
        opcoes: [
          { v: "a", t: "Nenhuma: produtividade maior é apenas resultado melhor." },
          { v: "b", t: "Mais volume na mesma janela de colheita pressiona escoamento e armazenagem — o gargalo migra do campo para a logística." },
          { v: "c", t: "O ganho reduz automaticamente o custo do frete por tonelada." },
          { v: "d", t: "O ganho dispensa a rastreabilidade exigida pelos compradores." },
        ], certa: "b",
        explica: "Produtividade é volume por hectare; a janela de colheita não aumenta. Se todos colhem mais ao mesmo tempo, a disputa por caminhão e armazém aperta e o custo de escoamento sobe. O gargalo se desloca — e quem lidera precisa enxergar isso antes de celebrar o recorde.",
        fonte: "Imea, março de 2026" },

      { id: "q2", dif: "dificil", teoria: "Porter · escolher o que não fazer",
        texto: "Com o frete a R$ 7,99/km e o diesel em cerca de 35% do custo das transportadoras, a diretoria quer fazer três coisas no mesmo ano: construir armazenagem própria, manter a expansão de área **e** travar contratos antecipados de frete. Pela lógica de estratégia de Porter, qual deve ser a posição do líder?",
        opcoes: [
          { v: "a", t: "Aprovar as três: todas aumentam receita ou reduzem custo." },
          { v: "b", t: "Recusar pelo menos uma. Estratégia é criar uma posição única e fazer trade-offs; dispersar capital nas três destrói a vantagem de qualquer uma delas." },
          { v: "c", t: "Terceirizar a decisão para o comercial de grãos, que conhece o mercado de frete." },
          { v: "d", t: "Esperar a próxima safra, quando haverá mais informação para decidir." },
        ], certa: "b",
        explica: "Porter (1996): a essência da estratégia é escolher o que não fazer. As três iniciativas competem pelo mesmo capital e pela mesma atenção da gestão; feitas juntas, nenhuma fica bem-feita. Cabe à liderança defender a escolha contra a pressão por crescer em todas as frentes — e esperar não é neutro, porque a janela de frete é sazonal.",
        fonte: "NTC & Logística / Edenred Repom, março de 2026" },

      { id: "q3", dif: "facil", teoria: "Hersey e Blanchard · maturidade",
        texto: "A equipe original, treinada nos últimos 18 meses, hoje é autônoma, motivada e entrega acima da meta. Em que nível de maturidade ela está?",
        opcoes: [
          { v: "E1", t: "E1 · Pouca maturidade" },
          { v: "E2", t: "E2 · Quer, mas não sabe" },
          { v: "E3", t: "E3 · Sabe, mas hesita" },
          { v: "E4", t: "E4 · Sabe e quer" },
        ], certa: "E4",
        explica: "Maturidade, em Hersey e Blanchard, é competência somada a disposição. Sabe fazer e quer fazer: E4 — o nível que pede Delegar." },

      { id: "q4", dif: "media", teoria: "Liderança situacional",
        texto: "Os 9 operadores recém-contratados não dominam as tarefas e vários já falam em sair. Qual estilo o líder precisa usar **com eles**?",
        opcoes: [
          { v: "DET", t: "Determinar — dizer o que fazer, como e até quando, conferindo de perto" },
          { v: "PER", t: "Persuadir — explicar o porquê e vender a ideia até o time comprar" },
          { v: "COM", t: "Compartilhar — decidir junto e reforçar a confiança de quem hesita" },
          { v: "DEL", t: "Delegar — combinar a meta e dar autonomia no caminho" },
        ], certa: "DET",
        explica: "Pouca competência somada a pouca disposição é E1, e E1 pede Determinar: alta tarefa e baixo relacionamento. Persuadir serve a quem quer mas não sabe (E2); aqui ainda falta o querer." },

      { id: "q5", dif: "dificil", teoria: "Hersey e Blanchard · duas maturidades",
        texto: "O líder agora tem, debaixo dele, uma equipe E4 e uma equipe E1 ao mesmo tempo. O que a liderança situacional prescreve?",
        opcoes: [
          { v: "a", t: "Adotar o estilo intermediário (Persuadir) com todos, para tratar as duas turmas de forma igual." },
          { v: "b", t: "Usar estilos diferentes simultaneamente: Delegar com a equipe antiga e Determinar com a nova, porque o estilo se ajusta ao liderado, não ao organograma." },
          { v: "c", t: "Adotar Determinar com todos, já que o risco está concentrado na equipe nova." },
          { v: "d", t: "Dividir a operação em duas unidades com dois líderes distintos." },
        ], certa: "b",
        explica: "A unidade de análise da liderança situacional é o liderado, não a equipe inteira nem o cargo. O mesmo líder pratica dois estilos ao mesmo tempo. Tratar igual quem está em níveis diferentes é o erro clássico: trava quem já é autônomo e abandona quem ainda não sabe." },

      { id: "q6", dif: "media", teoria: "Kotter · 8 passos",
        texto: "A diretoria quer desmobilizar o comitê da virada porque “bateu recorde”. Qual passo de Kotter está sendo violado?",
        opcoes: [
          { v: "1", t: "1. Criar senso de urgência" },
          { v: "4", t: "4. Comunicar a visão" },
          { v: "7", t: "7. Consolidar ganhos — não declarar vitória cedo" },
          { v: "8", t: "8. Ancorar a mudança na cultura" },
        ], certa: "7",
        explica: "Kotter (1996) alerta que a maioria das transformações falha porque pula etapas, e declarar vitória antes da hora é o erro do passo 7: a mudança ainda não está na cultura (passo 8) e, sem o comitê, a organização volta ao jeito antigo na primeira pressão." },

      { id: "q7", dif: "media", teoria: "Drucker · eficiência x eficácia",
        texto: "A fazenda pode comprar colheitadeiras mais rápidas (colher mais em menos tempo) ou construir armazenagem própria (escolher quando vender). Pela distinção de Drucker, qual leitura está correta?",
        opcoes: [
          { v: "a", t: "As duas são eficácia, porque ambas aumentam o lucro." },
          { v: "b", t: "A colheitadeira é eficiência — fazer melhor o que já se faz. A armazenagem muda o que a fazenda decide fazer: é eficácia." },
          { v: "c", t: "As duas são eficiência, porque ambas são investimento em ativo imobilizado." },
          { v: "d", t: "Eficiência e eficácia são a mesma coisa aplicada a prazos diferentes." },
        ], certa: "b",
        explica: "Drucker (1967): eficiência é fazer as coisas direito; eficácia é fazer as coisas certas. Colher mais rápido otimiza a tarefa existente. Armazenar muda a decisão de negócio — a fazenda deixa de ser refém da janela de venda. Dá para ser muito eficiente fazendo a coisa errada." },

      { id: "q8", dif: "dificil", teoria: "Collins · Nível 5",
        texto: "Entrevistado sobre o recorde, o líder precisa responder publicamente. Considerando que a produtividade subiu em **todo** o estado de Mato Grosso, e não só na fazenda, qual resposta corresponde ao executivo Nível 5 de Collins?",
        opcoes: [
          { v: "a", t: "“Foi o plano de 90 dias que eu desenhei que virou o jogo” — assumir o mérito é o que o mercado espera de um líder forte." },
          { v: "b", t: "“A equipe executou, e o ano ajudou: Mato Grosso todo subiu de 60,45 para 66,03 sacas por hectare. O que é nosso é a rastreabilidade, que nos manteve no contrato.”" },
          { v: "c", t: "“O resultado fala por si, não comento números” — discrição total é a marca do Nível 5." },
          { v: "d", t: "“Foi sorte do clima” — humildade máxima, atribuindo tudo ao fator externo." },
        ], certa: "b",
        explica: "Collins (2001): o líder Nível 5 une humildade pessoal e determinação profissional — olha pela janela para atribuir o sucesso (equipe, fatores externos) e pelo espelho para assumir o fracasso. A alternativa b faz as duas coisas e ainda separa o que foi maré favorável do que foi desempenho próprio. Humildade não é negar o resultado (d), nem se calar (c).",
        fonte: "Imea, março de 2026" },
    ],
  },

  // =========================================================================
  VAR: {
    titulo: "O cliente voltou, a margem não",
    kicker: "18 meses depois",
    empresa: "Supermercados Rio Cuiabá",
    sub: "Grande Cuiabá · agora 11 lojas",
    paragrafos: [
      "As filas acabaram, as perdas de perecíveis caíram e a rede abriu três lojas novas. O desempenho acompanhou o setor: no Brasil, os **hiper e supermercados foram o segmento que sustentou o varejo** em 2026, crescendo quando quase todo o comércio recuava — em abril, o varejo caiu 1,5% no mês, o pior resultado em quase quatro anos, e hiper e supermercados subiram 1,3%.",
      "Mas o varejo como um todo acumula apenas **+1,7% em 2026** e opera abaixo do pico histórico de março. Dentro da rede, o quadro ficou assim:",
      "**1. Crescer custou margem.** As três lojas novas foram abertas em bairros disputados pelo atacarejo. Elas vendem, mas com margem menor e estoque maior do que as oito antigas. A diretoria quer abrir mais duas no ano que vem.",
      "**2. Trinta e dois repositores e operadores de caixa novos.** Contratados às pressas para as lojas novas, não conhecem o padrão da rede, não sabem operar o sistema de reposição e a rotatividade no setor é alta. Os gerentes das lojas antigas, que passaram a decidir sozinhos depois da virada, hoje batem meta com folga.",
      "**3. O atacarejo mudou de tática.** Parou de brigar só no preço e lançou um programa de fidelidade com cashback. Parte dos clientes que a rede recuperou começou a dividir a compra entre os dois.",
      "**4. O painel de dados virou briga interna.** Comercial e operações leem o mesmo relatório de giro e chegam a conclusões opostas sobre o que tirar da gôndola. Cada um decide por si.",
      "Você tem **120 dias** e a mesma equipe que montou — com o líder que escolheu.",
    ],
    fontes: [
      "IBGE — Pesquisa Mensal de Comércio, 2026 (varejo -1,5% em abril, pior resultado em quase quatro anos; hiper e supermercados +1,3% no mesmo mês; varejo acumula +1,7% no ano)",
    ],
    matAntiga: "E4", matNova: "E1", kotter: 2,
    frenteNova: {
      exige: "dados",
      texto: "Para decidir o que sai da gôndola e o que entra no programa de fidelidade, alguém precisa **transformar o giro de estoque e a ruptura em decisão** — e sustentar essa leitura diante do comercial e das operações, que hoje leem o mesmo número de formas opostas.",
    },
    trocaTexto: "A diretoria liberou a contratação de **um especialista em precificação e inteligência de mercado**, que montaria a resposta ao cashback do atacarejo.",
    prioridade: ["dados", "treino", "operacao", "comercial", "qualidade", "cliente", "financeiro", "comunicacao", "tecnologia", "seguranca", "legal", "pessoas"],
    questoes: [
      { id: "q1", dif: "media", teoria: "Dados de mercado · IBGE",
        texto: "Em abril de 2026 o varejo brasileiro caiu 1,5% no mês — o pior resultado em quase quatro anos — enquanto hiper e supermercados cresceram 1,3% (IBGE/PMC). O que esse contraste diz ao gestor da rede?",
        opcoes: [
          { v: "a", t: "Que o setor de alimentos está imune a crises e a rede pode crescer sem cuidado com a margem." },
          { v: "b", t: "Que alimento é consumo pouco postergável: a rede cresce mesmo em retração, mas isso não garante margem, porque o cliente aperta o quanto gasta e troca de marca e de loja." },
          { v: "c", t: "Que o varejo de alimentos não é afetado por juros e crédito, logo o estoque pode ser ampliado livremente." },
          { v: "d", t: "Que o IBGE mede o setor de forma inadequada e o dado não serve para decisão." },
        ], certa: "b",
        explica: "O que sustentou o segmento foi a natureza do produto, não a competência da rede. Comida se compra em qualquer cenário; o que muda é quanto e onde. Ler o crescimento como blindagem é o erro que leva a crescer em volume e perder em margem — exatamente o que aconteceu nas três lojas novas.",
        fonte: "IBGE/PMC, abril de 2026" },

      { id: "q2", dif: "media", teoria: "Mintzberg · estratégia emergente",
        texto: "O plano aprovado era brigar no preço contra o atacarejo. O concorrente mudou para fidelidade com cashback e parte dos clientes passou a dividir a compra. Pela visão de Mintzberg sobre estratégia, o que a liderança deve fazer?",
        opcoes: [
          { v: "a", t: "Manter o plano aprovado até o fim do exercício: mudar no meio desorganiza a execução." },
          { v: "b", t: "Reconhecer o padrão que está emergindo no comportamento do cliente e ajustar o rumo — a estratégia realizada combina partes deliberadas e partes aprendidas na prática." },
          { v: "c", t: "Abandonar qualquer planejamento: no varejo só a intuição do dono funciona." },
          { v: "d", t: "Copiar imediatamente o programa do concorrente, sem avaliar o efeito na margem." },
        ], certa: "b",
        explica: "Mintzberg (1987) trata a estratégia como artesanato: o líder percebe padrões no que está acontecendo e ajusta. Não é abandonar o plano (c) nem ignorar o mercado (a) — e copiar sem medir margem (d) é trocar um erro por outro." },

      { id: "q3", dif: "facil", teoria: "Hersey e Blanchard · maturidade",
        texto: "Os 32 repositores e operadores de caixa recém-contratados não conhecem o padrão da rede nem o sistema de reposição, e a rotatividade do setor é alta. Em que nível de maturidade está esse grupo?",
        opcoes: [
          { v: "E1", t: "E1 · Pouca maturidade" },
          { v: "E2", t: "E2 · Quer, mas não sabe" },
          { v: "E3", t: "E3 · Sabe, mas hesita" },
          { v: "E4", t: "E4 · Sabe e quer" },
        ], certa: "E1",
        explica: "Falta competência (não conhecem o padrão) e falta disposição firmada (alta rotatividade, vínculo recente): E1, que pede Determinar." },

      { id: "q4", dif: "dificil", teoria: "Kotter · 8 passos",
        texto: "Comercial e operações leem o mesmo relatório de giro, chegam a conclusões opostas e cada um decide por si. Qual passo de Kotter precisa ser atacado primeiro?",
        opcoes: [
          { v: "2", t: "2. Formar uma coalizão administrativa forte" },
          { v: "3", t: "3. Desenvolver a visão" },
          { v: "6", t: "6. Gerar vitórias rápidas" },
          { v: "8", t: "8. Ancorar a mudança na cultura" },
        ], certa: "2",
        explica: "Duas áreas com poder decidindo em direções opostas é falta de coalizão (passo 2). Sem um grupo com autoridade suficiente agindo junto, uma visão nova (passo 3) não sai do papel e qualquer vitória rápida (passo 6) é desfeita pela área que não participou da decisão." },

      { id: "q5", dif: "media", teoria: "Drucker · resultado x popularidade",
        texto: "O gerente mais querido da rede propõe manter nas gôndolas das lojas novas os itens de giro baixo “porque os clientes antigos gostam e reclamariam”. Os dados mostram que esses itens travam capital e aumentam perdas. Como Drucker enquadraria a decisão?",
        opcoes: [
          { v: "a", t: "Manter os itens: liderança é construir consenso, e um líder que contraria a equipe perde seguidores." },
          { v: "b", t: "A decisão tem de ser tomada pelo resultado, não pela aprovação. Popularidade não é liderança; cabe ao líder explicar a retirada e sustentar a impopularidade." },
          { v: "c", t: "Transferir a decisão para votação entre os gerentes, para diluir o desgaste." },
          { v: "d", t: "Manter os itens apenas nas lojas antigas e não comunicar nada a ninguém." },
        ], certa: "b",
        explica: "Drucker: “popularidade não é liderança, resultados sim”, e líder eficaz é aquele cujos seguidores fazem as coisas certas. Evitar o desgaste por votação (c) ou por omissão (d) é adiar a decisão, não liderar." },

      { id: "q6", dif: "dificil", teoria: "Porter · trade-off",
        texto: "A diretoria quer abrir mais duas lojas no ano que vem, no mesmo tipo de bairro disputado pelo atacarejo, onde as três últimas vendem com margem menor e estoque maior. Qual análise estratégica sustenta melhor a posição do líder?",
        opcoes: [
          { v: "a", t: "Abrir: crescer em número de lojas é a única defesa possível contra uma rede nacional." },
          { v: "b", t: "Expor o trade-off com número: abrir mais lojas na mesma posição replica a margem baixa e consome o capital que faria a rede ser diferente do atacarejo em algo — é escolher não fazer para poder fazer bem outra coisa." },
          { v: "c", t: "Abrir, mas sem contratar, aproveitando a equipe atual nas lojas novas." },
          { v: "d", t: "Decidir pela média do setor: se o varejo cresceu 1,7% no ano, abrir duas lojas é proporcional." },
        ], certa: "b",
        explica: "Porter: posição única exige trade-offs e alinhamento de atividades. Replicar um formato que já se mostrou de margem baixa é crescer sem posição. A alternativa c agrava o problema que o cenário descreve (equipe nova sem padrão) e d confunde média setorial com decisão de investimento.",
        fonte: "IBGE/PMC, 2026" },

      { id: "q7", dif: "media", teoria: "Chiavenato · estilos de liderança",
        texto: "Os gerentes das lojas antigas passaram a decidir sozinhos depois da virada e batem meta com folga. Um diretor sugere voltar a centralizar todas as decisões de compra na matriz “para padronizar as lojas novas”. Com base no experimento de White e Lippitt descrito por Chiavenato, qual é o risco?",
        opcoes: [
          { v: "a", t: "Nenhum: centralizar sempre aumenta a produção e reduz o erro." },
          { v: "b", t: "O estilo autocrático eleva o volume enquanto o líder está por perto, mas gera tensão e queda quando ele sai — e aqui ainda desmonta a autonomia que já produz resultado nas lojas antigas." },
          { v: "c", t: "O risco é só de imagem: os gerentes podem se sentir desprestigiados, sem efeito no resultado." },
          { v: "d", t: "O estilo liberal é o único que funciona em rede com muitas lojas." },
        ], certa: "b",
        explica: "No experimento de 1939, o grupo autocrático produziu muito com o líder presente, com tensão e frustração, e o trabalho caiu quando ele saiu; o democrático produziu um pouco menos, com mais qualidade e comprometimento. Aplicar autocracia a um grupo já maduro desfaz ganho conquistado." },

      { id: "q8", dif: "dificil", teoria: "Collins · Nível 5 e as pessoas antes do quê",
        texto: "Collins defende que as empresas que saltaram de boas para excelentes definiram **quem** antes de definir **o quê**. Aplicado à rede, qual decisão é mais coerente com esse princípio?",
        opcoes: [
          { v: "a", t: "Definir primeiro a meta de abrir duas lojas e depois contratar quem der conta, no ritmo da obra." },
          { v: "b", t: "Garantir que as frentes críticas estejam cobertas por gente certa — inclusive quem lê dado e quem treina os 32 novos — antes de assumir mais compromisso de expansão." },
          { v: "c", t: "Contratar o máximo de pessoas possível agora, porque equipe grande resolve qualquer estratégia." },
          { v: "d", t: "Promover os gerentes mais populares das lojas antigas, para motivar a equipe nova." },
        ], certa: "b",
        explica: "“Primeiro quem, depois o quê”: a composição do time precede a definição da estratégia, porque é ela que torna a estratégia executável. Não se trata de contratar em volume (c) nem de premiar simpatia (d) — isso é a armadilha que Drucker alerta." },
    ],
  },

  // =========================================================================
  SAU: {
    titulo: "A fila diminuiu, a pressão aumentou",
    kicker: "18 meses depois",
    empresa: "Hospital Regional do Médio Norte",
    sub: "180 leitos · referência para 11 municípios",
    paragrafos: [
      "O fluxo foi reorganizado e a espera no pronto-socorro caiu de mais de 6 horas para pouco mais de 1 hora na maior parte do dia. O resultado tem paralelo real: um hospital estadual em Goiânia reduziu em cerca de **61% o tempo de espera do primeiro atendimento** no horário de pico com reorganização de fluxo apoiada por tecnologia, e outro, em Minas, levou o tempo porta-médico a cair **37,3%** em seis meses.",
      "Mas o contexto nacional não melhorou: dados do Conselho Federal de Medicina indicam que **mais de 70% dos prontos-socorros do SUS operam acima da capacidade**, e o *boarding* — paciente que já tem indicação de internação e segue no PS esperando leito — responde por até **40% da superlotação**. Cada hora de atraso no atendimento de emergências está associada a aumento de cerca de **5% na mortalidade**.",
      "Três fatos novos mudaram o jogo:",
      "**1. O hospital virou referência regional.** Com o resultado, a Secretaria ampliou a área de cobertura: dois municípios novos passaram a encaminhar pacientes para cá. A demanda subiu antes de o quadro de pessoal subir.",
      "**2. Catorze profissionais recém-contratados.** Técnicos de enfermagem e administrativos chegaram no mês passado. Não conhecem o protocolo de classificação de risco nem o fluxo novo, e a rotina de pronto-socorro assusta: dois já pediram transferência. A equipe antiga, que no início hesitava em mudar a rotina, hoje domina o protocolo e o defende.",
      "**3. A diretoria clínica quer medir tudo por tempo de espera.** Só que o gargalo migrou: a espera na porta caiu, mas o *boarding* cresceu e ninguém está medindo ocupação de leito de forma sistemática.",
      "Você tem **120 dias** e a mesma equipe que montou — com o líder que escolheu.",
    ],
    fontes: [
      "Conselho Federal de Medicina — mais de 70% dos prontos-socorros do SUS acima da capacidade; boarding responde por até 40% da superlotação; cerca de 5% de aumento de mortalidade por hora de atraso em emergências",
      "Hospital Estadual e Maternidade Nossa Senhora de Lourdes (Goiânia), 2026 — redução de ~61% no tempo de espera no pico; Santa Casa de Guaxupé, 2026 — tempo porta-médico -37,3% em seis meses",
    ],
    matAntiga: "E4", matNova: "E1", kotter: 7,
    frenteNova: {
      exige: "dados",
      texto: "O gargalo migrou da porta para o leito. Alguém precisa **medir ocupação, boarding e tempo de permanência de forma sistemática** e transformar isso em decisão de alta e transferência — hoje ninguém acompanha esse número.",
    },
    trocaTexto: "A Secretaria autorizou **um profissional dedicado à regulação de leitos da rede regional**, que negociaria vagas nos hospitais vizinhos e destravaria o boarding.",
    prioridade: ["dados", "treino", "operacao", "qualidade", "cliente", "legal", "financeiro", "comunicacao", "seguranca", "tecnologia", "comercial", "pessoas"],
    questoes: [
      { id: "q1", dif: "dificil", teoria: "Dados de mercado · CFM",
        texto: "O tempo de espera na porta caiu de 6 horas para pouco mais de 1 hora, mas o *boarding* — que responde por até 40% da superlotação — cresceu. A diretoria quer avaliar o pronto-socorro apenas pelo tempo de espera na porta. Qual é o problema dessa decisão?",
        opcoes: [
          { v: "a", t: "Nenhum: tempo de espera na porta é o indicador que o paciente percebe, logo é o que importa." },
          { v: "b", t: "Medir só a porta esconde o gargalo que se deslocou: o paciente entra rápido e fica preso esperando leito, com risco clínico real — o indicador melhora enquanto o problema piora." },
          { v: "c", t: "O problema é apenas de comunicação com a imprensa, não de gestão." },
          { v: "d", t: "O erro é medir: em saúde pública, indicadores de tempo não se aplicam." },
        ], certa: "b",
        explica: "Indicador parcial cria incentivo perverso: a equipe otimiza o que é medido e o problema migra para onde ninguém olha. Como cada hora de atraso em emergências se associa a cerca de 5% mais mortalidade, o custo do indicador cego não é administrativo — é clínico.",
        fonte: "CFM" },

      { id: "q2", dif: "media", teoria: "Kotter · 8 passos",
        texto: "Com a espera na porta reduzida, a diretoria considera encerrar o projeto de reorganização de fluxo e divulgar o resultado. Qual passo de Kotter está em risco?",
        opcoes: [
          { v: "1", t: "1. Criar senso de urgência" },
          { v: "4", t: "4. Comunicar a visão" },
          { v: "7", t: "7. Consolidar ganhos — não declarar vitória cedo" },
          { v: "5", t: "5. Remover obstáculos" },
        ], certa: "7",
        explica: "Kotter: vitórias de curto prazo (passo 6) servem para alimentar a mudança, não para encerrá-la. Declarar vitória com o boarding em alta é o caso-escola do passo 7 — e a melhora conquistada se desfaz quando a demanda regional cresce." },

      { id: "q3", dif: "media", teoria: "Hersey e Blanchard · maturidade",
        texto: "A equipe antiga, que no início hesitava em mudar a rotina, hoje domina o protocolo novo e o defende. Qual foi a trajetória de maturidade desse grupo?",
        opcoes: [
          { v: "a", t: "Saiu de E3 (sabe, mas hesita) para E4 (sabe e quer)." },
          { v: "b", t: "Saiu de E1 (pouca maturidade) para E2 (quer, mas não sabe)." },
          { v: "c", t: "Permaneceu em E3, porque a competência técnica nunca esteve em questão." },
          { v: "d", t: "Saiu de E4 para E3, porque a chegada dos novos reduziu sua segurança." },
        ], certa: "a",
        explica: "No cenário da Etapa 2 o grupo tinha competência e faltava disposição depois de processos e críticas — E3, que pede Compartilhar. Com apoio e resultado, a disposição voltou: E4, que pede Delegar. É a lógica do desenvolvimento do liderado em Hersey e Blanchard." },

      { id: "q4", dif: "facil", teoria: "Liderança situacional",
        texto: "Os 14 recém-contratados não conhecem o protocolo de classificação de risco, a rotina os assusta e dois já pediram transferência. Qual estilo o líder precisa usar com eles?",
        opcoes: [
          { v: "DET", t: "Determinar" },
          { v: "PER", t: "Persuadir" },
          { v: "COM", t: "Compartilhar" },
          { v: "DEL", t: "Delegar" },
        ], certa: "DET",
        explica: "Sem competência no protocolo e sem disposição consolidada, o grupo está em E1: instrução clara, acompanhamento de perto e correção imediata." },

      { id: "q5", dif: "media", teoria: "Drucker · eficiência x eficácia",
        texto: "Há verba para uma das duas coisas: contratar mais um médico para o plantão (atender mais rápido os mesmos casos) ou criar a regulação de leitos da rede regional (destravar quem está internado no PS esperando vaga). Pela distinção de Drucker, como enquadrar?",
        opcoes: [
          { v: "a", t: "Mais um médico é eficácia, porque amplia a capacidade de atendimento." },
          { v: "b", t: "Mais um médico é eficiência — faz melhor o que já se faz. A regulação de leitos ataca a causa de até 40% da superlotação: é eficácia, fazer a coisa certa." },
          { v: "c", t: "As duas são eficácia, porque ambas beneficiam o paciente." },
          { v: "d", t: "Nenhuma das duas: o problema é exclusivamente de orçamento federal." },
        ], certa: "b",
        explica: "Drucker: eficiência é fazer direito; eficácia é fazer o certo. Acelerar a porta com o leito travado é otimizar a etapa errada. Identificar onde está a causa do problema, e não onde é mais fácil agir, é a decisão de eficácia.",
        fonte: "CFM" },

      { id: "q6", dif: "dificil", teoria: "Chiavenato · influência na situação",
        texto: "Na ampliação da cobertura regional, o líder do hospital não tem autoridade formal sobre os hospitais vizinhos nem sobre a Secretaria, mas precisa que eles aceitem transferências. Pela definição de liderança de Chiavenato, o que isso exige?",
        opcoes: [
          { v: "a", t: "Nada a fazer: sem autoridade formal não existe liderança possível." },
          { v: "b", t: "Exercer influência interpessoal pela comunicação, na situação concreta e dirigida a um objetivo — liderança é influência, não cargo, e aqui ela se constrói com dado, relação e reciprocidade." },
          { v: "c", t: "Recorrer imediatamente ao Ministério Público para obrigar os vizinhos a aceitar." },
          { v: "d", t: "Delegar integralmente o problema à Secretaria e aguardar a decisão." },
        ], certa: "b",
        explica: "Chiavenato, apoiado em Tannenbaum, Weschler e Massarik: liderança é a influência interpessoal exercida numa situação e dirigida, pela comunicação humana, a objetivos específicos. É exatamente o caso em que a liderança aparece sem hierarquia — e Drucker completa: líder é quem tem seguidores." },

      { id: "q7", dif: "media", teoria: "Collins · o espelho e a janela",
        texto: "A redução da espera foi divulgada na imprensa regional. Internamente, dois erros graves de classificação de risco aconteceram no mês passado, por falha de quem acabou de chegar. Qual postura corresponde ao líder Nível 5?",
        opcoes: [
          { v: "a", t: "Dar o crédito do resultado à equipe e assumir pessoalmente a responsabilidade pelas falhas, corrigindo a formação dos recém-chegados." },
          { v: "b", t: "Dar o crédito do resultado à própria gestão e atribuir as falhas à inexperiência dos contratados." },
          { v: "c", t: "Não comentar nenhuma das duas coisas, para preservar a imagem do hospital." },
          { v: "d", t: "Atribuir tudo — resultado e falhas — ao acaso e à falta de recursos." },
        ], certa: "a",
        explica: "Collins: o Nível 5 olha pela janela para atribuir o sucesso e pelo espelho para assumir o fracasso. A falha de quem acabou de chegar aponta para quem o integrou e treinou — responsabilidade do líder, não do novato." },

      { id: "q8", dif: "dificil", teoria: "Porter · escolher o que não fazer",
        texto: "Com a demanda regional crescendo antes do quadro de pessoal, a diretoria quer manter todos os serviços atuais, absorver os dois municípios novos e ainda abrir um ambulatório de especialidades. Qual é a posição estrategicamente defensável?",
        opcoes: [
          { v: "a", t: "Aceitar tudo: hospital público não pode recusar demanda." },
          { v: "b", t: "Explicitar à Secretaria o que o hospital deixará de fazer bem se absorver tudo, e negociar escopo ou recurso — assumir demanda sem capacidade não é generosidade, é risco clínico." },
          { v: "c", t: "Abrir o ambulatório primeiro, porque gera receita e depois financia o resto." },
          { v: "d", t: "Recusar os dois municípios novos sem apresentar dado nem alternativa." },
        ], certa: "b",
        explica: "Trade-off não é escolher entre bom e ruim, é escolher entre bons. Porter: alinhar atividades e recusar o que dispersa. Em serviço essencial, o líder não recusa por preferência (d) nem aceita tudo (a): leva dado, mostra a consequência e negocia escopo ou recurso." },
    ],
  },

  // =========================================================================
  TEC: {
    titulo: "Cresceu, estabilizou, e agora o time é assediado",
    kicker: "18 meses depois",
    empresa: "AgroData",
    sub: "Software de gestão rural · 60 pessoas · clientes em MT, MS, GO e BA",
    paragrafos: [
      "As falhas que irritavam os clientes foram corrigidas, o cancelamento caiu e a empresa fechou uma rodada nova. O produto virou referência entre produtores do Centro-Oeste. Só que o mercado de talento cobrou a conta.",
      "A rotatividade em tecnologia no Brasil está entre **30% e 35% ao ano em startups e scale-ups**, e substituir um profissional custa entre **50% e 200% do salário anual** dele, dependendo da senioridade. A Brasscom aponta cerca de **30% mais vagas abertas do que profissionais qualificados** disponíveis. Pesquisas de retenção indicam que **61% dos profissionais pretendiam trocar de emprego em 2026**.",
      "O que mudou na AgroData:",
      "**1. Três pessoas-chave receberam proposta.** Dois desenvolvedores seniores e a pessoa que mais entende do cliente receberam ofertas com salário acima do que a empresa paga. Nenhuma saiu ainda.",
      "**2. Dezoito contratados em quatro meses.** Para dar conta da base nova de clientes, o time cresceu rápido. Os recém-chegados não conhecem o domínio (agronegócio é específico), não dominam o sistema legado e chegaram animados, querendo entregar — mas erram no que não conhecem.",
      "**3. Um quase-incidente de dados.** Uma rotina de exportação deixou dados de produtores acessíveis por três dias. Ninguém de fora acessou, mas o episódio expôs que a adequação à LGPD parou no meio.",
      "**4. O time pede autonomia total.** A equipe original é experiente, motivada e entrega acima da média — e reage mal a qualquer acompanhamento próximo. Para os 18 novos, autonomia tem significado retrabalho.",
      "Você tem **120 dias** e a mesma equipe que montou — com o líder que escolheu.",
    ],
    fontes: [
      "LinkedIn Workforce Report — rotatividade de 30% a 35% ao ano em startups e scale-ups de tecnologia no Brasil",
      "Robert Half — custo de substituição de um colaborador entre 50% e 200% do salário anual",
      "Brasscom — cerca de 30% mais vagas abertas do que profissionais qualificados; pesquisas de retenção 2025-26: 61% dos profissionais pretendiam trocar de emprego em 2026",
    ],
    matAntiga: "E4", matNova: "E2", kotter: 5,
    frenteNova: {
      exige: "legal",
      texto: "O quase-incidente expôs que a **adequação à LGPD** parou no meio. Alguém precisa fechar isso antes que um vazamento real aconteça — e os contratos novos com cooperativas já estão pedindo cláusula de conformidade.",
    },
    trocaTexto: "O aporte permite contratar **um engenheiro de plataforma sênior especializado em segurança e dados**, que resolveria a LGPD e a arquitetura de uma vez.",
    prioridade: ["legal", "treino", "tecnologia", "dados", "cliente", "qualidade", "financeiro", "operacao", "pessoas", "comunicacao", "comercial", "seguranca"],
    questoes: [
      { id: "q1", dif: "media", teoria: "Dados de mercado · retenção",
        texto: "A rotatividade em startups de tecnologia no Brasil está entre 30% e 35% ao ano e substituir alguém custa de 50% a 200% do salário anual. Com 60 pessoas, qual é a leitura de gestão mais correta?",
        opcoes: [
          { v: "a", t: "O número é de mercado e não se aplica a uma empresa que acabou de captar." },
          { v: "b", t: "No patamar do setor, perder cerca de 18 a 21 pessoas por ano é o cenário-base — e o custo de reposição é alto o bastante para que retenção seja decisão estratégica, não assunto só de RH." },
          { v: "c", t: "Como o custo é percentual do salário, basta reduzir salários para reduzir o custo da rotatividade." },
          { v: "d", t: "Rotatividade alta é desejável em tecnologia, porque renova o conhecimento técnico do time." },
        ], certa: "b",
        explica: "30% a 35% de 60 pessoas é da ordem de 18 a 21 saídas por ano. Multiplicado por um custo de reposição de 50% a 200% do salário anual, o valor rivaliza com qualquer investimento de produto — e o dado da DDI visto em aula mostra o caminho: talento com 3,7 vezes mais chance de sair quando o gestor não oferece crescimento.",
        fonte: "LinkedIn Workforce Report; Robert Half" },

      { id: "q2", dif: "facil", teoria: "Hersey e Blanchard · maturidade",
        texto: "Os 18 recém-contratados chegaram animados e querendo entregar, mas não conhecem o domínio do agronegócio nem o sistema legado. Em que nível de maturidade estão?",
        opcoes: [
          { v: "E1", t: "E1 · Pouca maturidade" },
          { v: "E2", t: "E2 · Quer, mas não sabe" },
          { v: "E3", t: "E3 · Sabe, mas hesita" },
          { v: "E4", t: "E4 · Sabe e quer" },
        ], certa: "E2",
        explica: "Há disposição (chegaram animados, querem entregar) e falta competência no domínio e no sistema: E2, que pede Persuadir — ensinar fazendo junto, explicando o porquê, enquanto se cobra o resultado." },

      { id: "q3", dif: "dificil", teoria: "Hersey e Blanchard · o custo de errar o estilo",
        texto: "A equipe original reage mal a acompanhamento próximo; para os 18 novos, autonomia tem gerado retrabalho. Um diretor propõe uma regra única: “autonomia total para todos, é a nossa cultura”. Qual é o diagnóstico correto?",
        opcoes: [
          { v: "a", t: "A proposta está certa: cultura precisa valer para todos igualmente, sem exceção." },
          { v: "b", t: "A proposta aplica Delegar a quem está em E2. Delegar a quem quer mas não sabe produz exatamente o retrabalho observado — o estilo se ajusta ao liderado, e cultura não substitui diagnóstico de maturidade." },
          { v: "c", t: "A proposta está errada porque autonomia nunca funciona em equipes de tecnologia." },
          { v: "d", t: "A proposta está certa, mas deve ser aplicada só depois de seis meses para todos." },
        ], certa: "b",
        explica: "Delegar com E2 é o erro de estilo mais comum em time que cresceu rápido: confunde confiança com ausência de direção. Com os E4 a autonomia é o estilo certo; com os E2 ela vira retrabalho. Chamar isso de cultura só impede o diagnóstico." },

      { id: "q4", dif: "media", teoria: "Kotter · 8 passos",
        texto: "A adequação à LGPD parou no meio porque depende de uma mudança no sistema legado que dois times precisam priorizar — e ambos têm metas próprias que não incluem isso. Qual passo de Kotter precisa ser atacado?",
        opcoes: [
          { v: "3", t: "3. Desenvolver a visão" },
          { v: "5", t: "5. Remover obstáculos (dar autonomia e tirar o que trava)" },
          { v: "6", t: "6. Gerar vitórias rápidas" },
          { v: "8", t: "8. Ancorar a mudança na cultura" },
        ], certa: "5",
        explica: "A mudança não anda porque a estrutura de metas impede quem deveria executá-la. É o passo 5: remover obstáculos — aqui, realinhar prioridades e dar mandato — e não comunicar mais a visão a quem já a conhece." },

      { id: "q5", dif: "media", teoria: "Drucker · resultado x popularidade",
        texto: "O desenvolvedor mais admirado do time, referência técnica para todos, recebeu proposta de fora e pede para liderar a plataforma como contraproposta. Ele nunca coordenou pessoas e evita conversas difíceis. Como decidir?",
        opcoes: [
          { v: "a", t: "Promover: reter o talento é prioridade, e a admiração do time garante que a liderança funcione." },
          { v: "b", t: "Separar retenção de promoção: oferecer crescimento real na trilha técnica e não entregar a liderança a quem evita decisão difícil só para não perdê-lo." },
          { v: "c", t: "Deixar que ele saia: quem pede contrapartida já está fora." },
          { v: "d", t: "Promover e, em paralelo, contratar um gerente de fora para fazer a parte difícil do papel dele." },
        ], certa: "b",
        explica: "É a armadilha que Drucker descreve: confundir prestígio técnico e popularidade com capacidade de liderar. Reter com crescimento é certo; promover para reter é como a empresa ganha um líder que adia o que precisa ser decidido. A alternativa d mantém o problema e cria confusão de papéis." },

      { id: "q6", dif: "dificil", teoria: "Porter e Mintzberg · posição e aprendizado",
        texto: "Com o aporte novo, a empresa pode: (i) aprofundar o produto para o agronegócio, onde já é referência; (ii) adaptá-lo para pecuária, mercado adjacente; ou (iii) virar plataforma genérica de gestão rural e urbana. Qual leitura combina Porter e Mintzberg corretamente?",
        opcoes: [
          { v: "a", t: "Fazer as três: aporte existe para financiar experimentação ampla." },
          { v: "b", t: "Recusar a terceira, que dissolve a posição única conquistada, e tratar a segunda como aposta deliberada e medida — mantendo abertura para o que o uso real dos clientes revelar." },
          { v: "c", t: "Escolher a terceira: mercado maior sempre vale mais que posição defensável." },
          { v: "d", t: "Congelar tudo e só executar o plano aprovado na rodada anterior, sem revisão." },
        ], certa: "b",
        explica: "Porter: posição única exige trade-off — virar genérica é abandonar a vantagem construída. Mintzberg: a estratégia realizada combina plano deliberado e aprendizado na prática, então a aposta adjacente entra como hipótese medida, não como dispersão. As alternativas a e d são os dois extremos que nenhum dos dois autores defende." },

      { id: "q7", dif: "media", teoria: "Chiavenato · estilos de liderança",
        texto: "Depois do quase-incidente de dados, um diretor propõe passar a revisar pessoalmente todo código antes de qualquer publicação, em toda a empresa. Com base nos estilos descritos por Chiavenato, qual é a avaliação?",
        opcoes: [
          { v: "a", t: "É a medida correta: controle total elimina risco." },
          { v: "b", t: "É resposta autocrática a um problema de processo: produz gargalo e tensão, cai de rendimento quando o revisor não está, e não cria a capacidade que faltou. Melhor instituir o padrão e formar quem o aplica." },
          { v: "c", t: "É resposta liberal, porque deixa a decisão final com o diretor." },
          { v: "d", t: "É indiferente: o estilo de liderança não afeta risco técnico." },
        ], certa: "b",
        explica: "Centralizar a revisão é o estilo autocrático clássico: volume e padrão enquanto o líder está presente, queda e dependência quando sai. O problema do cenário é de capacidade e processo — forma-se padrão e gente, não um gargalo." },

      { id: "q8", dif: "dificil", teoria: "Collins · disciplina e os fatos brutos",
        texto: "Collins descreve como característica das empresas que se tornaram excelentes a disposição de encarar os fatos brutos sem perder a fé no resultado. Qual atitude da liderança da AgroData expressa isso diante do quase-incidente?",
        opcoes: [
          { v: "a", t: "Tratar o episódio como sorte — ninguém de fora acessou — e seguir o roadmap de produto." },
          { v: "b", t: "Comunicar o fato internamente como o que é (uma falha de conformidade que não virou vazamento por sorte), medir o que faltou e repriorizar, sem transformar isso em pânico que paralise a entrega." },
          { v: "c", t: "Reunir o time para apontar o responsável individual pela rotina de exportação." },
          { v: "d", t: "Manter o episódio em sigilo absoluto, inclusive internamente, para não abalar a confiança do time." },
        ], certa: "b",
        explica: "Encarar os fatos brutos é nomear a falha sem a maquiagem da sorte — e sem desmoralizar. Caçar culpado individual (c) e esconder (d) são as duas formas de impedir que a organização aprenda; ignorar (a) garante a repetição." },
    ],
  },

  // =========================================================================
  IND: {
    titulo: "A auditoria passou. A próxima é a dura",
    kicker: "18 meses depois",
    empresa: "Frigorífico Pantanal Carnes",
    sub: "Cáceres (MT) · agora 1.150 funcionários",
    paragrafos: [
      "Os acidentes caíram pela metade, o retrabalho na desossa foi controlado e o importador suspenso voltou a comprar. A planta passou na auditoria sanitária e entrou na lista de habilitadas para um mercado asiático novo — um movimento que o setor viveu de verdade em 2026, quando o Brasil **ampliou de 52 para 73 o número de frigoríficos habilitados a exportar carne e miúdos bovinos à Indonésia**, após auditoria presencial realizada entre 27 de junho e 5 de julho.",
      "Mas habilitação ganha-se e perde-se. No mesmo ano, três plantas brasileiras precisaram ser **reabilitadas pela China** depois de suspensão, e casos sanitários foram identificados em frigoríficos — um deles em **Nova Canaã do Norte, em Mato Grosso**. A indústria exportadora passou a operar com **geomonitoramento digital para auditar fornecedores diretos de gado**, e o mercado europeu mantém auditorias sobre protocolo.",
      "O que mudou na planta:",
      "**1. Turno novo, gente nova.** A habilitação exigiu abrir um terceiro turno: **96 operários contratados nos últimos 60 dias**. Não dominam a desossa, a rotatividade da região é alta e a maioria nunca trabalhou em frigorífico. A equipe dos dois turnos antigos, treinada na virada, hoje cumpre o padrão sem supervisão constante.",
      "**2. A auditoria europeia é em 90 dias.** É mais rigorosa que a asiática e inclui rastreabilidade de fornecedor, não só processo interno.",
      "**3. Os fornecedores de gado resistem ao geomonitoramento.** Dizem que é burocracia e ameaçam vender para a concorrência, que não exige o mesmo.",
      "**4. Os supervisores antigos acham que “agora está resolvido”.** Dois já voltaram a liberar exceção de procedimento no turno da noite para bater meta.",
      "Você tem **120 dias** e a mesma equipe que montou — com o líder que escolheu.",
    ],
    fontes: [
      "Ministério da Agricultura e Pecuária (Mapa), setembro de 2026 — Brasil amplia de 52 para 73 os estabelecimentos habilitados a exportar carne e miúdos bovinos à Indonésia, após auditoria presencial de 27/06 a 05/07/2026",
      "Abrafrigo, maio de 2026 — China reabilita três frigoríficos brasileiros, elevando a 66 as unidades aptas ao mercado chinês; casos sanitários identificados incluem planta em Nova Canaã do Norte (MT)",
      "SIAL Paris 2026 — 23 frigoríficos brasileiros e US$ 530 milhões em contratos diretos; setor opera com geomonitoramento de fornecedores diretos",
    ],
    matAntiga: "E4", matNova: "E1", kotter: 8,
    frenteNova: {
      exige: "qualidade",
      texto: "A **auditoria europeia em 90 dias** é mais rigorosa que a asiática: exige padrão de processo documentado e inspeção consistente nos três turnos. Perder a habilitação significa perder o contrato que acabou de ser conquistado.",
    },
    trocaTexto: "A diretoria liberou **um auditor interno dedicado à rastreabilidade de fornecedores**, que faria o geomonitoramento do rebanho e prepararia a documentação europeia.",
    prioridade: ["qualidade", "treino", "legal", "operacao", "seguranca", "comercial", "dados", "pessoas", "financeiro", "comunicacao", "cliente", "tecnologia"],
    questoes: [
      { id: "q1", dif: "media", teoria: "Dados de mercado · Mapa",
        texto: "Em 2026 o Brasil ampliou de 52 para 73 os frigoríficos habilitados a exportar à Indonésia após auditoria presencial, e no mesmo ano três plantas precisaram ser reabilitadas pela China depois de suspensão. O que esse par de fatos ensina à gestão da planta?",
        opcoes: [
          { v: "a", t: "Que a habilitação, uma vez obtida, é um ativo permanente da empresa." },
          { v: "b", t: "Que habilitação é condição revogável e auditada de forma recorrente: conquistá-la é um projeto, mantê-la é rotina — e a rotina é onde a planta costuma relaxar." },
          { v: "c", t: "Que o número de habilitações depende apenas de negociação diplomática, não de desempenho da planta." },
          { v: "d", t: "Que suspensões são sempre injustas e devem ser contestadas judicialmente." },
        ], certa: "b",
        explica: "Os dois movimentos são o mesmo fenômeno visto dos dois lados: auditoria aprova e auditoria suspende. Para quem lidera, a consequência prática é que o padrão precisa sobreviver à ausência do projeto de mudança — e é justamente isso que os supervisores que “acham que está resolvido” estão colocando em risco.",
        fonte: "Mapa, set/2026; Abrafrigo, mai/2026" },

      { id: "q2", dif: "facil", teoria: "Hersey e Blanchard · maturidade",
        texto: "Os 96 operários do turno novo não dominam a desossa, a maioria nunca trabalhou em frigorífico e a rotatividade da região é alta. Em que nível de maturidade está esse grupo?",
        opcoes: [
          { v: "E1", t: "E1 · Pouca maturidade" },
          { v: "E2", t: "E2 · Quer, mas não sabe" },
          { v: "E3", t: "E3 · Sabe, mas hesita" },
          { v: "E4", t: "E4 · Sabe e quer" },
        ], certa: "E1",
        explica: "Sem competência na tarefa e sem vínculo consolidado com o trabalho: E1, que pede Determinar — instrução detalhada, acompanhamento diário e correção imediata do desvio." },

      { id: "q3", dif: "dificil", teoria: "Kotter · ancorar na cultura",
        texto: "Os supervisores antigos voltaram a liberar exceção de procedimento no turno da noite para bater meta, mesmo depois de 18 meses de mudança bem-sucedida. Qual passo de Kotter explica melhor essa recaída?",
        opcoes: [
          { v: "1", t: "1. Criar senso de urgência — faltou urgência desde o começo" },
          { v: "6", t: "6. Gerar vitórias rápidas — faltaram conquistas de curto prazo" },
          { v: "8", t: "8. Ancorar a mudança na cultura — o novo padrão não substituiu o jeito antigo de trabalhar" },
          { v: "4", t: "4. Comunicar a visão — os supervisores não entenderam o objetivo" },
        ], certa: "8",
        explica: "Houve urgência, houve vitória e a visão foi compreendida — o padrão funcionou por 18 meses. O que não aconteceu é o passo 8: a nova prática não virou “como se faz aqui”, então na primeira pressão de meta a cultura antiga reaparece. É o passo que Kotter descreve como o mais lento e o mais frequentemente abandonado." },

      { id: "q4", dif: "media", teoria: "Drucker · responsabilidade, não posto",
        texto: "Um supervisor diz: “eu liberei a exceção porque a meta do turno é minha responsabilidade; qualidade é responsabilidade do SIF”. Como Drucker responderia?",
        opcoes: [
          { v: "a", t: "Corretamente: cada um responde pelo seu indicador, e é assim que a organização funciona." },
          { v: "b", t: "Liderança é responsabilidade, não posto: quem lidera responde pelo resultado certo da operação, não apenas pelo número do seu quadro — e bater meta violando o padrão é ser eficiente no caminho errado." },
          { v: "c", t: "O supervisor deve ser demitido imediatamente, sem conversa." },
          { v: "d", t: "A meta deve ser eliminada, porque qualquer meta induz à violação de padrão." },
        ], certa: "b",
        explica: "Drucker trata liderança como responsabilidade e eficácia como fazer as coisas certas. O supervisor otimizou o indicador sob sua guarda e comprometeu o que sustenta o negócio — a habilitação. A resposta não é eliminar meta (d) nem punir sem formar (c): é realinhar o que se cobra." },

      { id: "q5", dif: "media", teoria: "Chiavenato · influência sem autoridade",
        texto: "Os fornecedores de gado resistem ao geomonitoramento e ameaçam vender para a concorrência. O frigorífico não tem autoridade sobre eles. O que a definição de liderança de Chiavenato indica?",
        opcoes: [
          { v: "a", t: "Nada: fora da empresa não existe liderança, apenas contrato." },
          { v: "b", t: "Influência interpessoal exercida pela comunicação na situação concreta: mostrar ao fornecedor que o acesso ao mercado europeu é interesse dele também, e tornar a adesão vantajosa — não só obrigatória." },
          { v: "c", t: "Romper imediatamente com os fornecedores resistentes, para dar exemplo." },
          { v: "d", t: "Aceitar gado sem rastreabilidade enquanto a auditoria europeia não chegar." },
        ], certa: "b",
        explica: "Liderança é influência dirigida a um objetivo, por meio da comunicação — e vale para quem não está no organograma. A alternativa d é o risco que suspende habilitação; a c descarta a cadeia de suprimento antes de tentar convencê-la." },

      { id: "q6", dif: "dificil", teoria: "Porter · trade-off e posição",
        texto: "A planta pode: (i) investir no padrão dos três turnos para garantir a auditoria europeia; (ii) ampliar volume para atender mais mercados asiáticos agora; ou (iii) as duas, cortando o programa de treinamento para financiar. Qual é a leitura estratégica?",
        opcoes: [
          { v: "a", t: "Opção iii: as duas frentes geram receita e treinamento é custo postergável." },
          { v: "b", t: "Opção i: a habilitação é a condição de acesso a todos os mercados. Cortar treinamento com 96 operários em E1 destrói exatamente o padrão que sustenta a posição — é economizar no que não pode ser economizado." },
          { v: "c", t: "Opção ii: volume primeiro, qualidade se ajusta depois com a escala." },
          { v: "d", t: "Nenhuma: a decisão cabe só ao Mapa e ao importador." },
        ], certa: "b",
        explica: "Porter: alinhar atividades em torno da posição escolhida. Aqui a posição é “planta habilitada e confiável”, e o treinamento não é periferia, é o que a sustenta. A opção iii é o caso clássico de trade-off mal feito: corta a atividade que suporta a vantagem para financiar expansão." },

      { id: "q7", dif: "media", teoria: "Hersey e Blanchard · duas maturidades",
        texto: "Dois turnos em E4 e um turno novo em E1, com o mesmo líder de produção. Qual é a prescrição correta?",
        opcoes: [
          { v: "a", t: "Um padrão único de supervisão para os três turnos, por isonomia." },
          { v: "b", t: "Delegar com os dois turnos maduros e Determinar com o turno novo, simultaneamente — e usar os operários experientes como referência de padrão para os recém-chegados." },
          { v: "c", t: "Determinar com os três turnos, porque o risco sanitário é igual em todos." },
          { v: "d", t: "Transferir metade dos novatos para os turnos antigos e dissolver o terceiro turno." },
        ], certa: "b",
        explica: "Estilo se ajusta ao liderado. Supervisão igual para todos (a, c) ou trava os maduros ou abandona os novatos. A segunda parte da alternativa b é o uso correto de uma equipe E4: ela não só executa, ela sustenta o padrão para quem chega." },

      { id: "q8", dif: "dificil", teoria: "Collins · Nível 5 e a disciplina do padrão",
        texto: "Faltando 90 dias para a auditoria europeia, um comprador oferece um pedido grande com prazo que só seria cumprido liberando exceções de procedimento. Qual decisão corresponde ao líder Nível 5 de Collins?",
        opcoes: [
          { v: "a", t: "Aceitar o pedido: receita garantida hoje vale mais que auditoria incerta amanhã." },
          { v: "b", t: "Recusar o prazo e negociar outro, assumindo publicamente a perda de curto prazo — determinação profissional é manter a disciplina do padrão mesmo quando o custo imediato recai sobre o próprio líder." },
          { v: "c", t: "Aceitar e não registrar as exceções, para não deixar rastro na documentação." },
          { v: "d", t: "Transferir a decisão ao comercial, que é quem responde pela receita." },
        ], certa: "b",
        explica: "Collins: humildade pessoal somada a intensa vontade profissional — e a vontade se expressa em não abrir mão do que sustenta o resultado de longo prazo. A alternativa c é o que gera suspensão de habilitação; a d é transferir responsabilidade, o oposto do que Drucker define como liderança." },
    ],
  },

  // =========================================================================
  LOG: {
    titulo: "Entrega no prazo, conta no vermelho",
    kicker: "18 meses depois",
    empresa: "Transportadora Rota Oeste",
    sub: "Mato Grosso · agora 175 caminhões",
    paragrafos: [
      "O aplicativo pegou, os atrasos caíram e os clientes do agronegócio renovaram contrato. A frota cresceu. Só que o custo do setor andou mais rápido que o frete.",
      "O frete rodoviário fechou março de 2026 a **R$ 7,99 por quilômetro rodado**, alta de 3,36% em um mês, e o diesel responde por cerca de **35% do custo operacional** das transportadoras brasileiras. O custo operacional do transporte subiu **6,84%** no ano encerrado em setembro de 2026, e a NTC & Logística apontou uma **defasagem de 10,5% entre o frete praticado e o custo efetivo**. As vendas de caminhões acumulavam queda superior a **15%** no primeiro quadrimestre de 2026. O transporte rodoviário move cerca de **65% de toda a carga do país**, com safra recorde de grãos pressionando a malha.",
      "O que mudou na transportadora:",
      "**1. Crescer a frota comprimiu a margem.** Os 35 caminhões novos foram financiados com juros altos e rodam em rotas que a empresa não dominava. O custo por entrega subiu e ninguém sabe dizer em quais rotas a empresa perde dinheiro.",
      "**2. Vinte e oito motoristas novos.** Contratados para a frota ampliada, estão motivados com o aplicativo e querem acertar, mas não conhecem as rotas novas, erram na conferência e não dominam as regras de entrega. Os motoristas antigos usam o aplicativo melhor que o setor de roteirização.",
      "**3. Um cliente grande pediu redução de 8% no frete.** Ameaça levar o contrato para uma transportadora que opera com margem menor. Esse cliente representa parcela relevante do faturamento.",
      "**4. A diretoria quer comprar mais 20 caminhões.** Com o argumento de que os clientes estão pedindo capacidade.",
      "Você tem **120 dias** e a mesma equipe que montou — com o líder que escolheu.",
    ],
    fontes: [
      "NTC & Logística e Índice de Frete Rodoviário Edenred Repom — março de 2026 (R$ 7,99/km, alta de 3,36%; diesel ≈ 35% do custo operacional); Comunicado CONET de 27/08/2026 (defasagem de 10,5% entre frete e custo)",
      "Transporte Moderno, 2026 — vendas de caminhões com queda superior a 15% no primeiro quadrimestre; custo operacional +6,84% no ano encerrado em setembro de 2026",
      "ANTAQ e CNT — transporte rodoviário responde por cerca de 65% da carga movida no Brasil",
    ],
    matAntiga: "E4", matNova: "E2", kotter: 7,
    frenteNova: {
      exige: "financeiro",
      texto: "Com defasagem de 10,5% entre frete e custo no setor, alguém precisa **calcular o custo por entrega e por rota** antes de responder ao cliente que pediu 8% de desconto. Hoje a empresa não sabe em quais rotas ganha e em quais perde dinheiro.",
    },
    trocaTexto: "A diretoria liberou **um analista de pricing e rentabilidade de rota**, que montaria a tabela de frete por rota e sustentaria a negociação com os grandes clientes.",
    prioridade: ["financeiro", "treino", "dados", "operacao", "comercial", "qualidade", "tecnologia", "cliente", "seguranca", "comunicacao", "pessoas", "legal"],
    questoes: [
      { id: "q1", dif: "dificil", teoria: "Dados de mercado · NTC & Logística",
        texto: "O setor opera com defasagem de 10,5% entre o frete praticado e o custo efetivo, e o custo operacional subiu 6,84% no ano. Um cliente grande pede 8% de redução no frete. Qual é a leitura de gestão correta?",
        opcoes: [
          { v: "a", t: "Conceder os 8%: perder um cliente grande é pior que operar com margem menor." },
          { v: "b", t: "O pedido levaria a empresa a operar abaixo do custo em parte das rotas. Antes de responder, é preciso saber o custo por rota — sem esse número, aceitar ou recusar são as duas decisões no escuro." },
          { v: "c", t: "Recusar de imediato: 8% é inviável em qualquer cenário de transporte." },
          { v: "d", t: "Repassar integralmente o aumento de 6,84% a todos os clientes de uma vez." },
        ], certa: "b",
        explica: "Com o frete já defasado em relação ao custo, um desconto linear de 8% pode tornar algumas rotas deficitárias e outras ainda viáveis — e a empresa não sabe quais. Recusar sem número (c) perde o cliente sem necessidade; conceder sem número (a) pode financiar o concorrente com o próprio prejuízo.",
        fonte: "NTC & Logística, CONET 27/08/2026" },

      { id: "q2", dif: "media", teoria: "Drucker · eficiência x eficácia",
        texto: "Há recurso para uma das duas: treinar os motoristas em direção econômica (reduzir consumo nas rotas atuais) ou mapear a rentabilidade por rota (descobrir quais rotas não deveriam existir). Pela distinção de Drucker, como enquadrar?",
        opcoes: [
          { v: "a", t: "Treinamento é eficácia, porque mexe em pessoas, e mapeamento é eficiência, porque é cálculo." },
          { v: "b", t: "Treinar é eficiência — fazer melhor a rota que já se faz. Mapear rentabilidade pode revelar que algumas rotas não deveriam ser feitas: é eficácia, fazer as coisas certas." },
          { v: "c", t: "As duas são eficiência, porque ambas reduzem custo." },
          { v: "d", t: "As duas são eficácia, porque ambas aumentam o lucro." },
        ], certa: "b",
        explica: "Drucker: não há nada tão inútil quanto fazer com eficiência o que não deveria ser feito. Economizar diesel numa rota deficitária reduz o prejuízo; descobrir que a rota é deficitária permite eliminá-lo." },

      { id: "q3", dif: "facil", teoria: "Hersey e Blanchard · maturidade",
        texto: "Os 28 motoristas novos estão motivados com o aplicativo e querem acertar, mas não conhecem as rotas novas nem as regras de entrega. Em que nível de maturidade estão?",
        opcoes: [
          { v: "E1", t: "E1 · Pouca maturidade" },
          { v: "E2", t: "E2 · Quer, mas não sabe" },
          { v: "E3", t: "E3 · Sabe, mas hesita" },
          { v: "E4", t: "E4 · Sabe e quer" },
        ], certa: "E2",
        explica: "Há disposição (motivados, querem acertar) e falta competência (não conhecem rotas nem regras): E2, que pede Persuadir — orientar de perto, mas sempre justificando, até o time entender e se convencer." },

      { id: "q4", dif: "media", teoria: "Kotter · 8 passos",
        texto: "Com os atrasos resolvidos e os contratos renovados, a diretoria quer encerrar o comitê do projeto do aplicativo e partir para a compra de 20 caminhões. Qual passo de Kotter está em risco?",
        opcoes: [
          { v: "6", t: "6. Gerar vitórias rápidas" },
          { v: "7", t: "7. Consolidar ganhos — não declarar vitória cedo" },
          { v: "2", t: "2. Formar coalizão forte" },
          { v: "3", t: "3. Desenvolver a visão" },
        ], certa: "7",
        explica: "A entrega melhorou, mas 28 motoristas em E2 ainda não dominam o aplicativo e as rotas novas. Encerrar o projeto agora é declarar vitória com a mudança sustentada por metade do time — exatamente o alerta do passo 7." },

      { id: "q5", dif: "dificil", teoria: "Porter · escolher o que não fazer",
        texto: "Comprar 20 caminhões “porque os clientes pedem capacidade”, com a frota recém-ampliada rodando em rotas não dominadas, juros altos e vendas de caminhão em queda de mais de 15% no setor. Qual é a análise estratégica?",
        opcoes: [
          { v: "a", t: "Comprar: capacidade é o ativo central de uma transportadora e demanda de cliente não se recusa." },
          { v: "b", t: "Recusar ou adiar: ampliar capacidade antes de saber a rentabilidade por rota aumenta a exposição ao custo sem garantir margem. Estratégia é escolher o que não fazer, inclusive não crescer agora." },
          { v: "c", t: "Comprar metade, como meio-termo que agrada diretoria e clientes." },
          { v: "d", t: "Comprar e repassar o custo financeiro integralmente aos clientes atuais." },
        ], certa: "b",
        explica: "Porter: a pressão por crescer indiscriminadamente é justamente o que a liderança precisa conter. O meio-termo (c) é dispersão disfarçada de prudência, e o repasse integral (d) ignora que o mercado não aceita o repasse — é o que o dado de defasagem de 10,5% mostra.",
        fonte: "Transporte Moderno, 2026" },

      { id: "q6", dif: "media", teoria: "Chiavenato · estilos de liderança",
        texto: "Os motoristas antigos passaram a usar o aplicativo melhor que o setor de roteirização e sugerem mudanças nas rotas. Um diretor quer proibir sugestões “para não desorganizar o planejamento”. Qual é a avaliação pelos estilos de Chiavenato?",
        opcoes: [
          { v: "a", t: "A proibição é correta: planejamento central é mais eficiente que sugestão de campo." },
          { v: "b", t: "A proibição é resposta autocrática que descarta o conhecimento de quem está na ponta e já domina a ferramenta. Com equipe madura, decidir junto gera mais qualidade e comprometimento." },
          { v: "c", t: "A proibição é estilo liberal, porque reduz o envolvimento do líder." },
          { v: "d", t: "Indiferente: sugestões de motorista nunca afetam o custo." },
        ], certa: "b",
        explica: "No experimento de White e Lippitt, o estilo democrático produziu um pouco menos que o autocrático em volume, porém com mais qualidade, satisfação e comprometimento. Com um grupo em E4 que domina a ferramenta melhor que a área central, fechar o canal é desperdiçar o ativo mais barato que a empresa tem." },

      { id: "q7", dif: "media", teoria: "Mintzberg · estratégia emergente",
        texto: "O uso real do aplicativo pelos motoristas revelou um padrão de rota que ninguém havia planejado e que reduz quilometragem em duas regiões. Como Mintzberg leria isso?",
        opcoes: [
          { v: "a", t: "Como desvio de processo a ser corrigido: o que não foi planejado não é estratégia." },
          { v: "b", t: "Como estratégia emergente: o padrão surgiu da prática e cabe ao líder percebê-lo e incorporá-lo ao plano deliberado — estratégia é artesanato, aprende-se com o material." },
          { v: "c", t: "Como sorte, sem valor para a gestão." },
          { v: "d", t: "Como prova de que planejamento é inútil no transporte." },
        ], certa: "b",
        explica: "Mintzberg (1987): a estratégia realizada combina partes deliberadas e partes emergentes, e o papel do líder é perceber padrões e ajustar o rumo. Nem corrigir o desvio (a) nem abandonar o plano (d)." },

      { id: "q8", dif: "dificil", teoria: "Collins · Nível 5 diante do cliente grande",
        texto: "O cálculo mostra que atender o cliente grande com 8% de desconto daria prejuízo em três das cinco rotas dele. A diretoria quer aceitar “para não aparecer na imprensa setorial como transportadora que perdeu a conta”. Qual postura corresponde ao Nível 5?",
        opcoes: [
          { v: "a", t: "Aceitar: reputação de mercado vale mais que margem de curto prazo." },
          { v: "b", t: "Levar o número à mesa, propor atender apenas as duas rotas rentáveis com o desconto e recusar as três deficitárias, assumindo o desgaste público da decisão em vez de empurrá-lo para a frente." },
          { v: "c", t: "Aceitar tudo e compensar aumentando o preço dos clientes pequenos, que não têm alternativa." },
          { v: "d", t: "Recusar sem apresentar cálculo, para não revelar a estrutura de custo." },
        ], certa: "b",
        explica: "Nível 5 é humildade com determinação: o líder não decide pela imagem (a), nem transfere o custo para quem não pode reagir (c), nem recusa sem fundamentar (d). Ele encara o fato bruto, apresenta a alternativa possível e carrega o desgaste." },
    ],
  },

  // =========================================================================
  EDU: {
    titulo: "O método funcionou. Faltam alunos",
    kicker: "18 meses depois",
    empresa: "Colégio Horizonte",
    sub: "Ensino fundamental e médio · 740 alunos",
    paragrafos: [
      "A aprendizagem por projetos deixou de ser disputa interna: os professores dominam o método, as famílias que criticavam viraram defensoras e o colégio recuperou parte das matrículas. Mas a demografia virou contra o setor inteiro.",
      "O Censo Escolar divulgado em fevereiro de 2026 registrou **46,018 milhões de matrículas na educação básica**, queda de **2,29%** em relação a 2024 — **1,082 milhão de estudantes a menos**, a maior retração em duas décadas. A **rede privada caiu 2,9%**, mais que a pública (-2,1%), e na pré-escola privada a queda chegou a **5,9%**. O Inep atribui o movimento à redução da população em idade escolar, sobretudo nas faixas de 0 a 4 e de 15 a 17 anos. No ensino médio, o movimento se inverte: as redes estaduais perderam quase meio milhão de alunos, enquanto as **escolas particulares cresceram 2,46%**.",
      "O que mudou no colégio:",
      "**1. Menos crianças na cidade, e isso não volta.** A entrada do fundamental I encolheu dois anos seguidos. Não é concorrência: é população.",
      "**2. Onze professores novos.** Contratados para o ensino médio em expansão, dominam suas disciplinas, mas não conhecem o método por projetos e hesitam em aplicá-lo diante de turmas de terceiro ano com pressão de vestibular. Os professores antigos aplicam o método com segurança e já formam colegas.",
      "**3. O ensino médio é a única porta de crescimento.** É o segmento em que a rede privada cresce no país — e exige investimento que concorre com tudo o mais.",
      "**4. A evasão mudou de cara.** Não é mais insatisfação com o método: são famílias que perderam renda e saem no meio do ano, sem avisar.",
      "Você tem **120 dias** e a mesma equipe que montou — com o líder que escolheu.",
    ],
    fontes: [
      "Inep/MEC — Censo Escolar da Educação Básica 2025, divulgado em 26/02/2026: 46,018 milhões de matrículas, queda de 2,29% (1,082 milhão a menos); rede privada -2,9% e pública -2,1%; pré-escola privada -5,9%",
      "Inep/MEC — ensino médio: redes estaduais com perda de quase meio milhão de matrículas e escolas particulares em alta de 2,46%",
    ],
    matAntiga: "E4", matNova: "E3", kotter: 3,
    frenteNova: {
      exige: "cliente",
      texto: "A evasão mudou de natureza: são **famílias que perderam renda e saem no meio do ano sem avisar**. Alguém precisa identificar o aluno em risco antes da saída e construir a alternativa com a família — bolsa parcial, parcelamento, acompanhamento.",
    },
    trocaTexto: "A mantenedora autorizou **um coordenador de captação e retenção para o ensino médio**, único segmento em que a rede privada cresce no país.",
    prioridade: ["cliente", "treino", "comercial", "operacao", "comunicacao", "dados", "qualidade", "legal", "financeiro", "pessoas", "tecnologia", "seguranca"],
    questoes: [
      { id: "q1", dif: "dificil", teoria: "Dados de mercado · Censo Escolar",
        texto: "O Censo Escolar 2025 mostra queda de 2,29% nas matrículas da educação básica, com a rede privada caindo 2,9%, enquanto as escolas particulares de ensino médio cresceram 2,46%. Qual conclusão estratégica esses números sustentam?",
        opcoes: [
          { v: "a", t: "Que o colégio deve reduzir preços em todos os segmentos para disputar os alunos que restam." },
          { v: "b", t: "Que a queda é demográfica e atinge principalmente a entrada, mas há um segmento em expansão — o ensino médio privado. O crescimento tem de vir de onde o mercado cresce, não de onde a população encolheu." },
          { v: "c", t: "Que o setor privado de educação está em colapso e a saída é migrar para o ensino superior." },
          { v: "d", t: "Que a queda é consequência da qualidade das escolas privadas e se resolve melhorando o método." },
        ], certa: "b",
        explica: "Os dois movimentos aparecem no mesmo censo: a base encolhe por demografia (0 a 4 e 15 a 17 anos), e ainda assim o ensino médio particular cresce 2,46% enquanto a rede estadual perde quase meio milhão. Confundir causa demográfica com causa de qualidade (d) ou com causa de preço (a) leva a investir no lugar errado.",
        fonte: "Inep/MEC, Censo Escolar 2025" },

      { id: "q2", dif: "media", teoria: "Hersey e Blanchard · maturidade",
        texto: "Os 11 professores novos dominam suas disciplinas, mas não conhecem o método por projetos e hesitam em aplicá-lo diante de turmas de terceiro ano. Em que nível de maturidade estão **em relação ao método**?",
        opcoes: [
          { v: "E1", t: "E1 · Pouca maturidade" },
          { v: "E2", t: "E2 · Quer, mas não sabe" },
          { v: "E3", t: "E3 · Sabe, mas hesita" },
          { v: "E4", t: "E4 · Sabe e quer" },
        ], certa: "E3",
        explica: "São professores experientes e competentes na própria disciplina — a competência existe —, mas hesitam diante da pressão do vestibular. Competência com insegurança é E3, que pede Compartilhar: decidir junto e reforçar a confiança de quem sabe, mas hesita. Tratá-los como E1 seria desperdiçar experiência." },

      { id: "q3", dif: "facil", teoria: "Liderança situacional",
        texto: "Se esses professores estão em E3, qual estilo o líder precisa adotar com eles?",
        opcoes: [
          { v: "DET", t: "Determinar" },
          { v: "PER", t: "Persuadir" },
          { v: "COM", t: "Compartilhar" },
          { v: "DEL", t: "Delegar" },
        ], certa: "COM",
        explica: "E3 pede Compartilhar: baixa tarefa e alto relacionamento — ouvir antes de decidir, dividir a decisão e encorajar quem tem medo de errar." },

      { id: "q4", dif: "media", teoria: "Kotter · 8 passos",
        texto: "O colégio precisa decidir onde crescer: ensino médio, educação infantil bilíngue ou contraturno. Cada coordenação defende a sua, e não existe uma definição de para onde a escola vai nos próximos cinco anos. Qual passo de Kotter precisa ser atacado?",
        opcoes: [
          { v: "2", t: "2. Formar coalizão forte" },
          { v: "3", t: "3. Desenvolver a visão" },
          { v: "6", t: "6. Gerar vitórias rápidas" },
          { v: "7", t: "7. Consolidar ganhos" },
        ], certa: "3",
        explica: "Cada área puxa para um lado porque não existe rumo definido — é o passo 3: desenvolver a visão e a estratégia que a sustenta. Coalizão (passo 2) se forma em torno de uma visão; sem ela, a coalizão não tem o que unir." },

      { id: "q5", dif: "dificil", teoria: "Porter · escolher o que não fazer",
        texto: "A mantenedora quer investir simultaneamente em expansão do ensino médio, bilíngue na educação infantil e contraturno esportivo, mantendo o preço atual. A entrada do fundamental I encolheu dois anos seguidos por razão demográfica. Qual é a posição estratégica defensável?",
        opcoes: [
          { v: "a", t: "Investir nas três: diversificar protege a escola da demografia." },
          { v: "b", t: "Concentrar no ensino médio, onde o mercado comprova crescimento, e recusar explicitamente as outras duas neste ciclo — inclusive assumindo que a escola vai ficar menor na base." },
          { v: "c", t: "Investir em bilíngue na educação infantil: produto premium reverte queda populacional." },
          { v: "d", t: "Não investir em nada e esperar a demografia se recuperar." },
        ], certa: "b",
        explica: "Porter: posição única, trade-offs e alinhamento de atividades. Diversificar com o mesmo orçamento (a) dilui tudo; investir premium onde a população caiu 5,9% na pré-escola privada (c) é remar contra a demografia; esperar (d) não é estratégia. Aceitar ficar menor em um segmento para crescer onde há mercado é exatamente escolher o que não fazer.",
        fonte: "Inep/MEC, Censo Escolar 2025" },

      { id: "q6", dif: "media", teoria: "Drucker · resultado x popularidade",
        texto: "A coordenadora mais querida pela equipe defende manter o contraturno esportivo, que é deficitário e muito apreciado pelos professores. Os números mostram que ele consome a verba necessária para a expansão do ensino médio. Como Drucker enquadraria?",
        opcoes: [
          { v: "a", t: "Manter: liderança se exerce preservando o que a equipe valoriza." },
          { v: "b", t: "A decisão se mede pelo resultado da escola, não pela aprovação interna. Cabe ao líder encerrar ou redesenhar o contraturno e explicar o motivo — popularidade não é liderança." },
          { v: "c", t: "Submeter a decisão a votação do corpo docente." },
          { v: "d", t: "Manter o contraturno e cortar o investimento em formação dos 11 professores novos." },
        ], certa: "b",
        explica: "Drucker: popularidade não é liderança, resultados sim. A alternativa d troca um custo deficitário pela capacidade de executar a única frente de crescimento — e votação (c) transfere a responsabilidade que é do líder." },

      { id: "q7", dif: "media", teoria: "Chiavenato · influência e comunicação",
        texto: "A evasão agora vem de famílias que perderam renda e saem no meio do ano sem avisar. Pela definição de liderança como influência exercida pela comunicação numa situação, qual é a ação coerente?",
        opcoes: [
          { v: "a", t: "Enviar carta de cobrança assim que a mensalidade atrasa, para formalizar a situação." },
          { v: "b", t: "Abrir canal de conversa antes da saída: identificar o sinal de risco, procurar a família e construir junto a alternativa possível — a influência se exerce na situação concreta, pela comunicação." },
          { v: "c", t: "Nada a fazer: perda de renda da família é externa à escola." },
          { v: "d", t: "Aumentar o preço dos demais alunos para compensar a inadimplência." },
        ], certa: "b",
        explica: "Liderança é influência interpessoal exercida numa situação, dirigida a objetivos, por meio da comunicação. A saída silenciosa é um problema de comunicação antes de ser financeiro: quem não é procurado não negocia, apenas vai embora." },

      { id: "q8", dif: "dificil", teoria: "Collins · Nível 5 e os fatos brutos",
        texto: "Em reunião com a mantenedora, o líder precisa apresentar o cenário. Qual postura corresponde ao executivo Nível 5 de Collins?",
        opcoes: [
          { v: "a", t: "Apresentar a recuperação parcial de matrículas como resultado da própria gestão e tratar a queda da base como problema conjuntural a ser resolvido no ano seguinte." },
          { v: "b", t: "Dizer com clareza que a base vai continuar encolhendo por razão demográfica, que isso não se reverte com método nem com preço, e sustentar que a escola pode crescer no ensino médio — fatos brutos sem perder a fé no resultado." },
          { v: "c", t: "Minimizar os números do censo para não desgastar a confiança da mantenedora na gestão." },
          { v: "d", t: "Atribuir integralmente a queda à demografia e não apresentar nenhuma alternativa de crescimento." },
        ], certa: "b",
        explica: "Collins: encarar os fatos brutos e, ao mesmo tempo, manter a convicção de que se chega ao resultado. A alternativa d encara o fato e desiste; a c e a a maquiam o fato. Só a b faz as duas coisas que o Nível 5 exige ao mesmo tempo." },
    ],
  },

  // =========================================================================
  FIN: {
    titulo: "Cresceu rápido. Agora a conta do risco",
    kicker: "18 meses depois",
    empresa: "Cooperativa de Crédito Vale Verde",
    sub: "Mato Grosso · agora 41 mil associados · 7 agências",
    paragrafos: [
      "O atendimento digital funcionou, os jovens começaram a chegar e a cooperativa abriu duas agências novas. O movimento acompanha o setor: o cooperativismo de crédito brasileiro encerrou 2025 com **21,2 milhões de cooperados**, crescimento de **10,4%** em um ano, **mais de R$ 1 trilhão em ativos** e presença em **59% dos municípios** do país. Hoje representa cerca de **6% dos ativos** do Sistema Financeiro Nacional, quase **8% da carteira de crédito** e aproximadamente **10% dos depósitos** — e o Banco Central declarou a intenção de levar a participação do setor a **20% do mercado de crédito**.",
      "Em Mato Grosso o peso é maior ainda: o cooperativismo de crédito já é **líder de mercado em cinco estados**, entre eles MT, e no Centro-Oeste **12% da população** está associada a alguma cooperativa. Em 1.072 municípios brasileiros a cooperativa é a **única alternativa de atendimento presencial**.",
      "O problema é o outro lado do crescimento:",
      "**1. A inadimplência rural chegou perto de dois dígitos.** Segundo dados apresentados pelo Banco Central, a inadimplência do crédito rural no cooperativismo se aproxima de **10%**, e no consignado fica perto de **7%**. A carteira da Vale Verde é majoritariamente agro.",
      "**2. Juros altos e crédito caro.** Com a Selic no patamar de **14,75% ao ano**, o custo do dinheiro aperta o associado e o spread da cooperativa ao mesmo tempo.",
      "**3. Vinte e dois funcionários novos.** Contratados para as duas agências, chegaram motivados e querendo atender bem, mas não conhecem a análise de crédito da casa nem o perfil do produtor da região. A equipe antiga conhece os associados pelo nome e bate meta com folga.",
      "**4. A diretoria não vê urgência.** Como a carteira cresce e o número de associados sobe, o conselho entende que a inadimplência “se dilui no crescimento”.",
      "Você tem **120 dias** e a mesma equipe que montou — com o líder que escolheu.",
    ],
    fontes: [
      "Banco Central — Panorama do Sistema Nacional de Crédito Cooperativo (SNCC): 21,2 milhões de cooperados ao final de 2025 (+10,4%), mais de R$ 1 trilhão em ativos, presença em 59% dos municípios; cerca de 6% dos ativos do SFN, quase 8% da carteira de crédito e ~10% dos depósitos; liderança de mercado em RS, SC, PR, MT e RO; única alternativa presencial em 1.072 municípios; Centro-Oeste com 12% da população associada",
      "Banco Central no Concred 2026 — inadimplência do crédito rural cooperativo próxima de 10% e do consignado próxima de 7%; intenção declarada de levar o setor a 20% do mercado de crédito",
      "Sistema OCB / Banco Central, 2026 — Selic no patamar de 14,75% ao ano",
    ],
    matAntiga: "E4", matNova: "E2", kotter: 1,
    frenteNova: {
      exige: "dados",
      texto: "Com a inadimplência do crédito rural cooperativo perto de **10%** e a carteira da Vale Verde concentrada no agro, alguém precisa **reler o risco da carteira safra por safra** e endurecer o critério de concessão sem matar a relação com o associado.",
    },
    trocaTexto: "O conselho autorizou **um especialista em modelagem de risco de crédito rural**, que reconstruiria o critério de concessão a partir de dados de safra, preço e endividamento do produtor.",
    prioridade: ["dados", "legal", "treino", "cliente", "tecnologia", "comunicacao", "financeiro", "comercial", "operacao", "qualidade", "pessoas", "seguranca"],
    questoes: [
      { id: "q1", dif: "dificil", teoria: "Dados de mercado · Banco Central",
        texto: "A carteira de associados cresce 10% ao ano e a inadimplência do crédito rural cooperativo está perto de 10%. O conselho diz que a inadimplência “se dilui no crescimento”. Qual é o erro desse raciocínio?",
        opcoes: [
          { v: "a", t: "Não há erro: carteira maior reduz o peso relativo da inadimplência." },
          { v: "b", t: "Crescer a carteira com o mesmo critério de concessão multiplica o problema em vez de diluí-lo: a inadimplência é um percentual da carteira, então o crescimento aumenta o valor absoluto em risco — e crédito concedido hoje só vira inadimplência adiante." },
          { v: "c", t: "O erro é só de comunicação: o conselho entende o risco, apenas se expressa mal." },
          { v: "d", t: "O erro é que inadimplência rural não afeta cooperativas, apenas bancos comerciais." },
        ], certa: "b",
        explica: "Diluição exigiria que o crédito novo fosse de qualidade melhor que o antigo — e nada no cenário indica isso, porque o critério de concessão não mudou. Pior: a inadimplência é defasada em relação à concessão, então a carteira que cresce hoje ainda não mostrou o seu prejuízo. O Banco Central apontou esse ponto no Concred: o aumento da inadimplência afeta diretamente a sustentabilidade das instituições.",
        fonte: "Banco Central, Concred 2026" },

      { id: "q2", dif: "media", teoria: "Kotter · senso de urgência",
        texto: "O conselho não enxerga problema porque os números de crescimento são bons. Qual passo de Kotter precisa ser atacado antes de qualquer outro?",
        opcoes: [
          { v: "1", t: "1. Criar senso de urgência" },
          { v: "4", t: "4. Comunicar a visão" },
          { v: "6", t: "6. Gerar vitórias rápidas" },
          { v: "8", t: "8. Ancorar a mudança na cultura" },
        ], certa: "1",
        explica: "Kotter: sem senso de urgência compartilhado, nenhuma das etapas seguintes acontece — a coalizão não se forma e a visão não encontra quem a execute. Aqui a urgência é especialmente difícil de criar porque os indicadores visíveis são positivos: é o caso em que o líder precisa tornar visível um risco que ainda não doeu." },

      { id: "q3", dif: "facil", teoria: "Hersey e Blanchard · maturidade",
        texto: "Os 22 funcionários novos chegaram motivados e querendo atender bem, mas não conhecem a análise de crédito da casa nem o perfil do produtor da região. Em que nível de maturidade estão?",
        opcoes: [
          { v: "E1", t: "E1 · Pouca maturidade" },
          { v: "E2", t: "E2 · Quer, mas não sabe" },
          { v: "E3", t: "E3 · Sabe, mas hesita" },
          { v: "E4", t: "E4 · Sabe e quer" },
        ], certa: "E2",
        explica: "Disposição alta (motivados, querem atender bem) e competência baixa (não conhecem a análise nem o perfil do produtor): E2, que pede Persuadir." },

      { id: "q4", dif: "media", teoria: "Drucker · eficácia na decisão",
        texto: "Com a Selic no patamar de 14,75% ao ano, a diretoria propõe aumentar o volume de crédito concedido para compensar o spread apertado. Pela lógica de eficácia de Drucker, qual é a avaliação?",
        opcoes: [
          { v: "a", t: "Correta: volume maior compensa margem menor, é aritmética de mercado financeiro." },
          { v: "b", t: "É fazer mais do mesmo com eficiência, sem perguntar se é a coisa certa: aumentar volume com critério inalterado e inadimplência perto de 10% troca margem por risco, não por resultado." },
          { v: "c", t: "Correta, desde que o aumento seja concentrado no crédito consignado." },
          { v: "d", t: "Irrelevante: a Selic não influencia a decisão de uma cooperativa." },
        ], certa: "b",
        explica: "Drucker: eficácia é fazer as coisas certas, e a pergunta anterior ao “quanto” é “qual crédito”. A alternativa c não resolve: o consignado cooperativo também aparece com inadimplência perto de 7% nos dados do Banco Central.",
        fonte: "Banco Central, Concred 2026" },

      { id: "q5", dif: "media", teoria: "Chiavenato · estilos de liderança",
        texto: "Para endurecer o critério de concessão, um diretor propõe centralizar toda aprovação de crédito na sede, retirando a alçada dos gerentes das agências antigas — que conhecem os associados pelo nome e batem meta com folga. Qual é a avaliação pelos estilos de Chiavenato?",
        opcoes: [
          { v: "a", t: "Correta: centralizar decisão de crédito elimina o risco de favorecimento local." },
          { v: "b", t: "É resposta autocrática que descarta a informação que só existe na ponta — o conhecimento do produtor — e desmonta a autonomia de uma equipe madura. O critério pode ser endurecido sem retirar alçada de quem já entrega." },
          { v: "c", t: "É estilo democrático, porque envolve a sede na decisão." },
          { v: "d", t: "É indiferente: alçada não afeta qualidade de crédito." },
        ], certa: "b",
        explica: "O estilo autocrático rende enquanto o líder está presente e trava quando sai; aplicado a um grupo em E4, destrói comprometimento. Em crédito rural, além disso, a relação local é informação de risco: centralizar joga fora dado que nenhum modelo tem." },

      { id: "q6", dif: "dificil", teoria: "Porter · posição e trade-off",
        texto: "A cooperativa pode: (i) apertar o critério e aceitar crescer menos que os 10% do setor; (ii) manter o ritmo de crescimento e provisionar mais; ou (iii) abrir duas agências novas em municípios onde seria a única opção presencial, ampliando base. Qual leitura é estrategicamente consistente?",
        opcoes: [
          { v: "a", t: "Opção iii: ser a única opção presencial garante base cativa e resolve o risco pelo volume." },
          { v: "b", t: "Opção i: a posição da cooperativa é relação de longo prazo com o associado, e isso não sobrevive a uma carteira deteriorada. Crescer menos agora é o trade-off que preserva a posição — e Porter diz que a liderança existe para defender essa escolha contra a pressão por crescer." },
          { v: "c", t: "Opção ii: provisão resolve inadimplência sem exigir decisão difícil." },
          { v: "d", t: "As três ao mesmo tempo, aproveitando a meta do Banco Central de levar o setor a 20% do mercado de crédito." },
        ], certa: "b",
        explica: "A meta setorial do Banco Central é contexto, não mandato para esta cooperativa. Provisionar (c) reconhece a perda sem evitá-la, e expandir presença (a, iii) com critério deteriorado espalha o problema. Porter: a essência da estratégia é escolher o que não fazer — inclusive não crescer no ritmo do setor.",
        fonte: "Banco Central" },

      { id: "q7", dif: "media", teoria: "Hersey e Blanchard · duas maturidades",
        texto: "Equipe antiga em E4, 22 novos em E2, um único líder. Qual é a prescrição?",
        opcoes: [
          { v: "a", t: "Um só estilo para a cooperativa toda, para garantir padrão de atendimento." },
          { v: "b", t: "Delegar com a equipe antiga e Persuadir com os novos ao mesmo tempo — e usar os gerentes experientes para ensinar o perfil do produtor a quem chegou." },
          { v: "c", t: "Determinar com todos, porque o risco de crédito não admite variação." },
          { v: "d", t: "Separar as agências novas em uma estrutura própria, com líder próprio." },
        ], certa: "b",
        explica: "O estilo se ajusta ao liderado. Persuadir é o estilo de E2 — ensinar fazendo junto e explicando o porquê — e é diferente de Determinar (c), que seria desperdiçar a disposição que os novos já trazem." },

      { id: "q8", dif: "dificil", teoria: "Collins · Nível 5 e os fatos brutos",
        texto: "Na assembleia de associados, o líder precisa falar sobre o ano. Qual postura corresponde ao executivo Nível 5 de Collins?",
        opcoes: [
          { v: "a", t: "Destacar o crescimento de associados e as agências novas, deixando a inadimplência para um relatório técnico que poucos leem." },
          { v: "b", t: "Apresentar o crescimento, nomear a inadimplência rural como o risco central do próximo ciclo, assumir que o critério de concessão foi insuficiente e explicar o aperto que virá — dar o crédito do crescimento à equipe e assumir a falha de critério como sua." },
          { v: "c", t: "Atribuir a inadimplência exclusivamente à safra e aos juros, fatores externos à cooperativa." },
          { v: "d", t: "Evitar o tema na assembleia para não gerar corrida de saques entre os associados." },
        ], certa: "b",
        explica: "Collins: janela para o sucesso, espelho para o fracasso — e encarar os fatos brutos sem perder a fé no resultado. Esconder (a, d) é o oposto, e culpar o externo (c) é usar o espelho ao contrário. Numa cooperativa, em que o associado é dono, a transparência não é só ética: é condição de governança." },
    ],
  },

  // =========================================================================
  TUR: {
    titulo: "A nota subiu. A temporada é curta",
    kicker: "18 meses depois",
    empresa: "Pousada Rio Claro",
    sub: "Ecoturismo no Pantanal mato-grossense · agora 26 apartamentos",
    paragrafos: [
      "A nota voltou a 4,7, os grupos estrangeiros que cancelaram retornaram e a pousada ampliou de 18 para 26 apartamentos. O destino também ganhou força: Mato Grosso levou **Pantanal e Amazônia à World Travel Market de Londres em novembro de 2026**, com a meta declarada de ampliar a taxa de ocupação da hotelaria, e a **FIT Pantanal 2026**, em Cuiabá, reuniu cerca de **100 mil visitantes** e projetou **R$ 36 milhões** em negócios, com participação de **43 municípios** mato-grossenses.",
      "Dois dados da feira dizem muito sobre como o cliente chega hoje: **62% dos participantes** foram atraídos pelas redes sociais e **61%** estavam ali pela primeira vez. No Carnaval, empreendimentos de ecoturismo do Pantanal chegaram a **100% de ocupação** — mas na região pantaneira a ocupação de alta temporada gira em torno de **60%**.",
      "O que mudou na pousada:",
      "**1. A temporada concentra tudo.** A ampliação só se paga se a pousada vender fora da alta. Hoje, quatro meses sustentam o ano e oito operam no vermelho.",
      "**2. Quatorze contratados para a temporada.** Camareiras, auxiliares de cozinha e recepção. Ninguém tem experiência em hotelaria, a rotina é dura e vários já falam em sair antes do fim do contrato. A equipe que sobreviveu à virada hoje mantém o padrão sem ninguém cobrando.",
      "**3. Operadores internacionais pediram certificação de sustentabilidade.** Querem comprovação de práticas, não discurso — e dois deles mencionaram acessibilidade.",
      "**4. A reputação virou tempo real.** Uma sequência de três avaliações ruins na semana de abertura da temporada derruba o posicionamento construído em 18 meses, e a equipe nova é quem está na linha de frente.",
      "Você tem **120 dias** — a temporada começa em 30 — e a mesma equipe que montou, com o líder que escolheu.",
    ],
    fontes: [
      "Sedec-MT / World Travel Market London 2026 (3 a 5 de novembro) — Pantanal e Amazônia promovidos com meta de ampliar a taxa de ocupação hoteleira",
      "FIT Pantanal 2026 (Fecomércio-Sesc-Senac-MT e Governo de MT), Cuiabá — cerca de 100 mil visitantes, R$ 36 milhões projetados em negócios, 43 municípios, 61% do público pela primeira vez e 62% atraídos pelas redes sociais",
      "Sebrae-MT, 2026 — Centro de Eventos Pantanal movimentou cerca de R$ 30 milhões; ocupação hoteleira na região pantaneira em torno de 60% na alta temporada",
    ],
    matAntiga: "E4", matNova: "E1", kotter: 4,
    frenteNova: {
      exige: "comunicacao",
      texto: "Com **62% dos visitantes chegando pelas redes sociais** e 61% vindo pela primeira vez, a reputação online passou a ser o principal canal de venda. Alguém precisa **responder avaliação por avaliação e construir presença** antes e durante a temporada — e fazer isso na mesma semana em que 14 pessoas sem experiência começam a atender hóspede.",
    },
    trocaTexto: "Há orçamento para **um especialista em certificação de sustentabilidade e acessibilidade**, exigência que os operadores internacionais colocaram como condição para fechar os pacotes da próxima temporada.",
    prioridade: ["comunicacao", "legal", "treino", "qualidade", "comercial", "cliente", "operacao", "financeiro", "dados", "tecnologia", "seguranca", "pessoas"],
    questoes: [
      { id: "q1", dif: "media", teoria: "Dados de mercado · FIT Pantanal",
        texto: "Na FIT Pantanal 2026, 62% do público foi atraído pelas redes sociais e 61% participava pela primeira vez. Para a pousada, qual é a implicação de gestão mais direta?",
        opcoes: [
          { v: "a", t: "Que basta aumentar o investimento em anúncios para encher a pousada fora da temporada." },
          { v: "b", t: "Que o canal de entrada é digital e o visitante é majoritariamente novo: quem decide pela rede social não tem experiência própria com a pousada, então julga pela reputação pública — e cada avaliação vale mais do que qualquer folheto." },
          { v: "c", t: "Que o público é regional e portanto a certificação internacional é irrelevante." },
          { v: "d", t: "Que a feira não representa o perfil do hóspede de ecoturismo e o dado não serve." },
        ], certa: "b",
        explica: "Público majoritariamente de primeira viagem decide por prova social, não por memória de marca. Isso muda a prioridade de gestão: a reputação online deixa de ser pós-venda e passa a ser o canal de venda. Anúncio (a) não resolve avaliação ruim — amplifica o alcance dela.",
        fonte: "FIT Pantanal 2026" },

      { id: "q2", dif: "facil", teoria: "Hersey e Blanchard · maturidade",
        texto: "Os 14 contratados para a temporada não têm experiência em hotelaria, a rotina é dura e vários já falam em sair antes do fim do contrato. Em que nível de maturidade estão?",
        opcoes: [
          { v: "E1", t: "E1 · Pouca maturidade" },
          { v: "E2", t: "E2 · Quer, mas não sabe" },
          { v: "E3", t: "E3 · Sabe, mas hesita" },
          { v: "E4", t: "E4 · Sabe e quer" },
        ], certa: "E1",
        explica: "Falta competência (nenhuma experiência em hotelaria) e falta disposição (já falam em sair): E1, que pede Determinar — padrão explícito, acompanhamento de perto e correção imediata." },

      { id: "q3", dif: "dificil", teoria: "Hersey e Blanchard · o risco de delegar cedo",
        texto: "A temporada começa em 30 dias. O líder propõe “dar autonomia total à equipe nova para que aprenda fazendo, como fizemos com a equipe antiga”. Qual é a avaliação técnica dessa decisão?",
        opcoes: [
          { v: "a", t: "Correta: foi assim que a equipe antiga chegou a E4, e aprender fazendo é o método mais rápido." },
          { v: "b", t: "Equivocada: a equipe antiga chegou a E4 depois de 18 meses de acompanhamento. Delegar a um grupo em E1 na semana de abertura expõe o hóspede ao erro justamente quando a reputação é o canal de venda — o estilo se ajusta ao estágio atual, não ao estágio que se deseja." },
          { v: "c", t: "Equivocada, porque autonomia nunca funciona em hotelaria." },
          { v: "d", t: "Correta, desde que a equipe antiga seja responsabilizada pelos erros dos novos." },
        ], certa: "b",
        explica: "Confundir o ponto de chegada com o ponto de partida é o erro de estilo mais custoso aqui, porque o custo do erro é público e imediato: três avaliações ruins na abertura desfazem 18 meses. A alternativa d transfere responsabilidade a quem não tem o papel — o oposto do que Drucker define como liderança." },

      { id: "q4", dif: "media", teoria: "Kotter · comunicar a visão",
        texto: "O posicionamento de sustentabilidade foi decidido pela direção há dois meses, mas os 14 contratados souberam dele por comentário de corredor e não sabem explicá-lo ao hóspede. Qual passo de Kotter está falhando?",
        opcoes: [
          { v: "3", t: "3. Desenvolver a visão" },
          { v: "4", t: "4. Comunicar a visão" },
          { v: "6", t: "6. Gerar vitórias rápidas" },
          { v: "8", t: "8. Ancorar a mudança na cultura" },
        ], certa: "4",
        explica: "A visão existe (passo 3 cumprido) e não chegou a quem precisa executá-la — é o passo 4. Em serviço, quem entrega a visão ao cliente é a linha de frente: se ela não sabe explicar, a visão não existe para o hóspede." },

      { id: "q5", dif: "media", teoria: "Porter · posição única",
        texto: "Para cobrir os oito meses de baixa temporada, surgem três caminhos: (i) baixar diária e disputar público de passagem; (ii) criar pacotes de observação de fauna fora da alta, com operadores internacionais; (iii) alugar a estrutura para eventos corporativos. Qual é o caminho mais coerente com a posição construída?",
        opcoes: [
          { v: "a", t: "Opção i: preço é o único instrumento que preenche baixa temporada." },
          { v: "b", t: "Opção ii: mantém a posição de ecoturismo, usa a certificação que os operadores já pedem e vende justamente o que só esta pousada tem — fauna e localização. É aprofundar a posição, não diluí-la." },
          { v: "c", t: "Opção iii: eventos corporativos garantem volume previsível e não dependem de clima." },
          { v: "d", t: "As três simultaneamente, para maximizar ocupação." },
        ], certa: "b",
        explica: "Porter: estratégia é posição única mais trade-offs mais alinhamento de atividades. Baixar diária (a) atrai público que não valoriza o que a pousada faz de melhor e corrói a marca; eventos corporativos (c) exigem outra estrutura e outra equipe; fazer tudo (d) é não ter posição. A opção ii alinha produto, canal e certificação." },

      { id: "q6", dif: "dificil", teoria: "Drucker · resultado x popularidade",
        texto: "O guia mais carismático da pousada, adorado pelos hóspedes e pela equipe, vem descumprindo o protocolo de distância da fauna porque “o turista quer a foto de perto” — e as fotos rendem elogios nas redes. Isso ameaça a certificação de sustentabilidade. Como decidir?",
        opcoes: [
          { v: "a", t: "Manter: ele gera as avaliações positivas que sustentam a reputação da pousada." },
          { v: "b", t: "Cobrar o protocolo imediatamente, mesmo custando elogios e desgastando a relação: o que gera aplauso hoje destrói a condição de vender para o mercado internacional amanhã — popularidade não é liderança, resultado sim." },
          { v: "c", t: "Deixar como está até o fim da temporada e tratar o assunto na baixa." },
          { v: "d", t: "Transferir a decisão para o técnico ambiental, que responde pelas licenças." },
        ], certa: "b",
        explica: "Drucker: popularidade não é liderança, e líder eficaz é aquele cujos seguidores fazem as coisas certas. Postergar (c) é decidir por omissão no pior momento possível, e delegar o desgaste a quem não tem autoridade sobre o guia (d) é fugir da responsabilidade que define o papel." },

      { id: "q7", dif: "media", teoria: "Chiavenato · estilos e clima",
        texto: "Com a temporada em 30 dias, a governanta quer impor o padrão de arrumação por checklist obrigatório e punição pública do erro. A equipe nova é de primeira experiência. Qual é a avaliação pelos estilos descritos por Chiavenato?",
        opcoes: [
          { v: "a", t: "Correta: padrão em hotelaria exige rigor absoluto desde o primeiro dia." },
          { v: "b", t: "O checklist é adequado para E1 — direção clara é o que esse grupo precisa —, mas a punição pública é o traço autocrático que gera tensão e agressividade e acelera a saída de quem já fala em desistir. Padrão firme com correção reservada." },
          { v: "c", t: "Incorreta: com equipe nova o estilo liberal é o mais indicado." },
          { v: "d", t: "Indiferente: o estilo não afeta rotatividade em trabalho sazonal." },
        ], certa: "b",
        explica: "A questão separa duas coisas que costumam vir juntas: a estrutura da tarefa (alta, e correta para E1) e o tratamento da pessoa. No experimento de White e Lippitt, o traço autocrático produziu tensão, frustração e agressividade — exatamente o que faria 14 pessoas já desanimadas saírem no meio da temporada." },

      { id: "q8", dif: "dificil", teoria: "Collins · Nível 5",
        texto: "A nota voltou a 4,7 e um jornal regional quer uma matéria sobre a recuperação. Nesse mesmo período, Mato Grosso promoveu o destino na World Travel Market de Londres e a FIT Pantanal movimentou cerca de R$ 36 milhões. Qual resposta corresponde ao líder Nível 5?",
        opcoes: [
          { v: "a", t: "“A recuperação é resultado da gestão que implantamos; o destino apenas acompanhou.”" },
          { v: "b", t: "“A equipe reconstruiu o padrão quarto por quarto, e o destino ajudou: MT levou o Pantanal a Londres e a FIT trouxe 100 mil pessoas. O que é nosso é o padrão; o fluxo é do destino — e agora precisamos vender fora da alta.”" },
          { v: "c", t: "“Preferimos não comentar resultados” — discrição total." },
          { v: "d", t: "“Foi o movimento do destino; a pousada só aproveitou a onda.”" },
        ], certa: "b",
        explica: "Nível 5 é humildade com determinação: dá o crédito à equipe, separa honestamente o que foi esforço próprio do que foi maré favorável e, mesmo no momento do elogio, aponta o problema que continua aberto. Negar o fator externo (a) é vaidade; negar o próprio mérito (d) é falsa modéstia que apaga o trabalho da equipe.",
        fonte: "Sedec-MT / FIT Pantanal 2026" },
    ],
  },

  // =========================================================================
  PUB: {
    titulo: "Digitalizou. E deixou gente de fora",
    kicker: "18 meses depois",
    empresa: "Prefeitura de Nova Esperança",
    sub: "Central de atendimento ao cidadão · plataforma Cidadão+",
    paragrafos: [
      "A fila presencial caiu de 4 horas para menos de 40 minutos, 28 serviços entraram no Cidadão+ e o Tribunal de Contas elogiou o avanço. O município acompanhou um movimento nacional: a plataforma GOV.BR reúne cerca de **4.600 serviços públicos federais, com aproximadamente 92% já digitalizados**, e em 2025 **mais de 130 milhões de brasileiros** a usaram, com **3,5 bilhões de autenticações**.",
      "Só que em novembro de 2026 o **Tribunal de Contas da União** publicou um dado que mudou a conversa: **84 milhões de brasileiros não usam o Gov.br**, e dos **5.616 serviços federais** catalogados, **4.056 — ou 72% — não ofereciam atendimento presencial em nenhuma etapa**. A **Lei nº 14.129/2021**, que disciplina o Governo Digital, preserva o direito ao atendimento presencial. No âmbito federal, o Balcão GOV.BR mantinha **292 unidades presenciais em 24 estados** em agosto de 2026, justamente para quem não consegue usar o digital.",
      "O que mudou na prefeitura:",
      "**1. A fila sumiu do balcão e apareceu na ouvidoria.** As reclamações caíram no total, mas mudaram de assunto: idosos, pessoas sem internet em casa e quem não consegue validar a conta digital simplesmente pararam de ser atendidos — e não reclamam, desaparecem.",
      "**2. Dezenove servidores novos.** Aprovados em concurso, chegaram motivados e querendo servir bem, mas não conhecem o fluxo do Cidadão+ nem a legislação de proteção de dados aplicada ao atendimento. Os servidores antigos, treinados na virada, hoje resolvem sem consultar a chefia.",
      "**3. A expansão travou.** O plano é levar 40 serviços novos ao Cidadão+, mas cada secretaria mantém o seu próprio sistema e nenhuma quer abrir base de dados. O projeto está parado há três meses sem que ninguém o tenha cancelado.",
      "**4. A nova gestão quer anunciar.** Quer divulgar a digitalização como conquista antes de resolver o atendimento de quem ficou fora.",
      "Você tem **120 dias** e a mesma equipe que montou — com o líder que escolheu.",
    ],
    fontes: [
      "Tribunal de Contas da União, novembro de 2026 — 84 milhões de brasileiros não usam o Gov.br; 4.056 de 5.616 serviços federais catalogados (72%) não ofereciam atendimento presencial em nenhuma etapa; Lei nº 14.129/2021 preserva o direito ao atendimento presencial",
      "Ministério da Gestão e da Inovação em Serviços Públicos (MGI), 2026 — GOV.BR com cerca de 4.600 serviços federais e ~92% digitalizados; 292 unidades de Balcão GOV.BR em 24 estados em agosto de 2026; mais de 80 milhões de usuários únicos em um mês e 1,7 bilhão de acessos no primeiro trimestre de 2026",
      "MGI — em 2025, mais de 130 milhões de brasileiros usaram o gov.br, com 3,5 bilhões de autenticações",
    ],
    matAntiga: "E4", matNova: "E2", kotter: 5,
    frenteNova: {
      exige: "cliente",
      texto: "O dado do TCU — **84 milhões de brasileiros fora do Gov.br** e 72% dos serviços federais sem nenhuma etapa presencial — tem equivalente local: um grupo de cidadãos parou de ser atendido e **não reclama, desaparece**. Alguém precisa encontrar essas pessoas, medir quem ficou fora e construir o canal que a Lei 14.129/2021 garante.",
    },
    trocaTexto: "A prefeitura abriu **uma vaga para agente de inclusão digital no atendimento**, que faria o papel do Balcão: atender presencialmente quem não consegue usar o Cidadão+ e ensinar a usar.",
    prioridade: ["cliente", "legal", "treino", "tecnologia", "operacao", "comunicacao", "financeiro", "dados", "qualidade", "seguranca", "comercial", "pessoas"],
    questoes: [
      { id: "q1", dif: "dificil", teoria: "Dados de mercado · TCU",
        texto: "O TCU apontou que 84 milhões de brasileiros não usam o Gov.br e que 72% dos serviços federais catalogados não ofereciam atendimento presencial em nenhuma etapa, enquanto cerca de 92% dos serviços estão digitalizados. Qual é a leitura correta desse conjunto?",
        opcoes: [
          { v: "a", t: "Que a digitalização está incompleta e a solução é digitalizar os 8% restantes." },
          { v: "b", t: "Que digitalizar a oferta não é o mesmo que universalizar o acesso: o indicador de serviços digitalizados pode chegar perto de 100% enquanto dezenas de milhões de pessoas ficam sem atendimento — e a lei garante a elas o canal presencial." },
          { v: "c", t: "Que 84 milhões é número absoluto e por isso não indica problema de política pública." },
          { v: "d", t: "Que o problema é exclusivamente de conectividade e não cabe à gestão do serviço." },
        ], certa: "b",
        explica: "São dois indicadores diferentes medindo coisas diferentes: oferta digitalizada e cidadão efetivamente atendido. Otimizar o primeiro e ignorar o segundo é o risco que o TCU nomeou, e a Lei 14.129/2021 transforma isso em obrigação jurídica, não só em escolha de gestão.",
        fonte: "TCU, novembro de 2026" },

      { id: "q2", dif: "media", teoria: "Kotter · remover obstáculos",
        texto: "A expansão para 40 serviços novos está parada há três meses: cada secretaria mantém o seu sistema e nenhuma quer abrir base de dados. Ninguém cancelou o projeto. Qual passo de Kotter precisa ser atacado?",
        opcoes: [
          { v: "1", t: "1. Criar senso de urgência" },
          { v: "4", t: "4. Comunicar a visão" },
          { v: "5", t: "5. Remover obstáculos (dar autonomia e tirar o que trava)" },
          { v: "7", t: "7. Consolidar ganhos" },
        ], certa: "5",
        explica: "A visão é conhecida e a urgência existe — o que impede é estrutural: sistemas isolados e incentivo de cada secretaria para não abrir base. É o passo 5. Projeto parado que ninguém cancelou é o sintoma clássico de obstáculo não removido." },

      { id: "q3", dif: "facil", teoria: "Hersey e Blanchard · maturidade",
        texto: "Os 19 servidores aprovados em concurso chegaram motivados e querendo servir bem, mas não conhecem o fluxo do Cidadão+ nem a legislação de proteção de dados aplicada ao atendimento. Em que nível de maturidade estão?",
        opcoes: [
          { v: "E1", t: "E1 · Pouca maturidade" },
          { v: "E2", t: "E2 · Quer, mas não sabe" },
          { v: "E3", t: "E3 · Sabe, mas hesita" },
          { v: "E4", t: "E4 · Sabe e quer" },
        ], certa: "E2",
        explica: "Disposição alta (motivados, querem servir bem) e competência baixa no fluxo e na norma: E2, que pede Persuadir — orientar de perto, sempre justificando, até o servidor entender e se convencer." },

      { id: "q4", dif: "media", teoria: "Drucker · eficiência x eficácia",
        texto: "A fila caiu de 4 horas para 40 minutos, mas um grupo de cidadãos parou de ser atendido e não aparece em nenhum indicador. Pela distinção de Drucker, como enquadrar o resultado?",
        opcoes: [
          { v: "a", t: "É eficácia plena: o tempo de espera, que era o problema, foi resolvido." },
          { v: "b", t: "É ganho de eficiência no atendimento de quem consegue usar o sistema, mas não é eficácia: a finalidade do serviço é atender o cidadão, e parte dele deixou de ser atendida — a fila não foi resolvida, ela saiu da medição." },
          { v: "c", t: "É ineficiência, porque o custo por atendimento aumentou." },
          { v: "d", t: "É irrelevante: quem não procura o serviço não precisa dele." },
        ], certa: "b",
        explica: "Drucker: eficiência é fazer direito, eficácia é fazer o certo. Melhorar o tempo de quem já era atendido é fazer direito. A pergunta da eficácia é se o serviço cumpre sua finalidade — e um cidadão que desaparece do indicador sem ter sido atendido é a definição de problema que a métrica esconde." },

      { id: "q5", dif: "media", teoria: "Chiavenato · influência sem autoridade",
        texto: "O líder do projeto não tem autoridade sobre as secretarias que se recusam a abrir base de dados. Pela definição de liderança de Chiavenato, qual é o caminho?",
        opcoes: [
          { v: "a", t: "Aguardar decreto do prefeito: sem autoridade formal não há o que fazer." },
          { v: "b", t: "Exercer influência pela comunicação na situação concreta — mostrar a cada secretaria o ganho próprio na integração, formar coalizão com as que aderirem primeiro e usar o resultado delas para convencer as demais." },
          { v: "c", t: "Denunciar as secretarias resistentes ao Tribunal de Contas." },
          { v: "d", t: "Desistir da integração e manter os 28 serviços atuais." },
        ], certa: "b",
        explica: "Liderança, em Chiavenato, é influência interpessoal exercida numa situação e dirigida a objetivos, pela comunicação humana — e não depende do organograma. Esperar decreto (a) é terceirizar o papel; denunciar (c) resolve o conflito destruindo a relação de que o projeto depende." },

      { id: "q6", dif: "dificil", teoria: "Porter · escolher o que não fazer",
        texto: "Há equipe e orçamento para uma frente só: (i) levar os 40 serviços novos ao Cidadão+; ou (ii) criar o atendimento presencial assistido para quem ficou fora, como manda a Lei 14.129/2021. A nova gestão prefere a primeira, por ser mais visível. Qual é a posição defensável?",
        opcoes: [
          { v: "a", t: "Opção i: ampliar a oferta digital beneficia mais gente por real investido." },
          { v: "b", t: "Opção ii: a frente presencial é obrigação legal e corrige a exclusão que a própria digitalização criou. Escolher não ampliar agora é o trade-off; ampliar serviço para quem já é atendido, deixando o excluído de fora, aprofunda o problema que o TCU nomeou." },
          { v: "c", t: "Dividir o orçamento ao meio entre as duas, como solução equilibrada." },
          { v: "d", t: "Opção i, porque visibilidade política garante orçamento futuro para a opção ii." },
        ], certa: "b",
        explica: "Porter: a essência da estratégia é escolher o que não fazer, e cabe à liderança defender a escolha contra a pressão por crescimento visível. Dividir ao meio (c) é dispersão que não entrega nenhuma das duas, e a alternativa d aposta o cumprimento de uma obrigação legal em orçamento futuro incerto.",
        fonte: "TCU, novembro de 2026; Lei nº 14.129/2021" },

      { id: "q7", dif: "media", teoria: "Hersey e Blanchard · duas maturidades",
        texto: "Servidores antigos em E4, resolvendo sem consultar a chefia, e 19 novos em E2. Qual é a prescrição?",
        opcoes: [
          { v: "a", t: "Padronizar o acompanhamento para todos, por isonomia no serviço público." },
          { v: "b", t: "Delegar com os antigos e Persuadir com os novos ao mesmo tempo, usando os servidores experientes como referência de fluxo para quem chegou." },
          { v: "c", t: "Determinar com todos, porque atendimento ao público não admite variação de conduta." },
          { v: "d", t: "Alocar todos os novos em funções de retaguarda até que aprendam sozinhos." },
        ], certa: "b",
        explica: "O estilo se ajusta ao liderado. Isonomia (a) e padronização (c) confundem igualdade de tratamento jurídico com igualdade de estilo de supervisão — e a alternativa d espera que E2 vire E4 sem ninguém ensinar, o que é a definição de abandono." },

      { id: "q8", dif: "dificil", teoria: "Collins · Nível 5 e os fatos brutos",
        texto: "A nova gestão quer anunciar a digitalização como conquista antes de resolver o atendimento de quem ficou fora. Qual postura corresponde ao executivo Nível 5 de Collins?",
        opcoes: [
          { v: "a", t: "Anunciar a conquista: o resultado é real e o reconhecimento público sustenta o projeto politicamente." },
          { v: "b", t: "Apresentar o resultado junto com o dado da exclusão e o plano de correção, dando o crédito da fila reduzida à equipe e assumindo como própria a falha de ter deixado gente fora — mesmo que isso reduza o brilho do anúncio." },
          { v: "c", t: "Não anunciar nada até que o problema esteja totalmente resolvido." },
          { v: "d", t: "Anunciar e atribuir a exclusão à falta de conectividade do município, que é responsabilidade de outro ente." },
        ], certa: "b",
        explica: "Collins: janela para o sucesso, espelho para o fracasso — e encarar os fatos brutos sem perder a fé no resultado. Anunciar sem o dado (a) é o que o TCU encontrou no agregado nacional; silenciar (c) desperdiça o apoio que o resultado real pode gerar; culpar outro ente (d) é o espelho virado para fora." },
    ],
  },
};
