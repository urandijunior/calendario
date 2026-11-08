// debriefing.js — painel de debriefing do professor (estatísticas + perguntas para debate)
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const media = (arr) => (arr.length ? (arr.reduce((s, x) => s + x, 0) / arr.length).toFixed(1).replace(".", ",") : "—");

function barra(rotulo, valor, total, extra = "") {
  const p = pct(valor, total);
  return `<div class="db-barra"><span>${rotulo}</span><div class="db-trilho"><div style="width:${p}%"></div></div><b>${p}%</b><small>${valor}/${total}${extra}</small></div>`;
}

export function montarDebriefing({ room, alunos, trades, D }) {
  const arr = Object.values(alunos || {});
  if (!room || room.status === "lobby" || !arr.length) return `<p class="vazio">O debriefing aparece quando a rodada começar.</p>`;
  const concl = arr.filter((a) => a.fase === "concluido");
  const fecharam = arr.filter((a) => (a.equipeFinal ?? 0) === 6);
  const aceitas = (trades || []).filter((t) => t.status === "aceita");
  const expiradas = (trades || []).filter((t) => t.status === "expirada").length;
  const recusadas = (trades || []).filter((t) => t.status === "recusada").length;
  const liderOk = concl.filter((a) => a.liderCerto).length;
  const carisma = concl.filter((a) => a.liderEscolhido === D.RAMO[a.ramo]?.carismaId).length;
  const esgotou = arr.filter((a) => a.motivoFim === "trocas").length;
  const c = D.classificar(arr);
  const niveis = D.NIVEIS.map((n) => `${n.emoji} ${n.nome}: <b>${Object.values(c).filter((x) => !x.pendente && x.nivel.id === n.id).length}</b>`).join(" · ");

  // acerto por questão
  const qNomes = { q1: "Maturidade da equipe (Hersey e Blanchard)", q2: "Estilo que a situação pede", q3: "Quem pratica esse estilo (Chiavenato)", q4: "Armadilha do carisma (Drucker)", q5: "Nível 5 (Collins)", q6: "Passo de Kotter" };
  const porQ = Object.keys(qNomes).map((qid) => {
    const ok = concl.filter((a) => {
      const q = D.montarQuestionario(a.ramo, a.maoFinal || []).find((x) => x.id === qid);
      return a.respostas?.[qid] === q.certa;
    }).length;
    return barra(qNomes[qid], ok, concl.length);
  }).join("");

  // por ramo
  const ramos = D.RAMOS.filter((r) => arr.some((a) => a.ramo === r.codigo));
  const linhasRamo = ramos.map((r) => {
    const g = arr.filter((a) => a.ramo === r.codigo);
    const gc = g.filter((a) => a.fase === "concluido");
    const est = D.ESTILOS[D.MATURIDADE[r.mat].estilo];
    return `<tr><td>${r.icone} ${esc(r.nome)}</td><td>${g.length}</td><td>${r.mat} → ${est}</td>
      <td>${g.filter((a) => a.equipeFinal === 6).length}/${g.length}</td><td>${media(g.map((a) => a.trocas || 0))}</td>
      <td>${gc.filter((a) => a.liderCerto).length}/${gc.length}</td><td>${gc.filter((a) => a.liderEscolhido === r.carismaId).length}</td></tr>`;
  }).join("");

  const justs = concl.filter((a) => a.justificativa).slice(-12).map((a) =>
    `<li>${a.liderCerto ? "✅" : "❌"} <b>${esc(a.nome)}</b> (${D.RAMO[a.ramo]?.icone} → ${esc(D.FUNCIONARIOS[a.liderEscolhido]?.nome)}): “${esc(a.justificativa)}”</li>`).join("");

  const argumentos = aceitas.filter((t) => t.argumento).slice(-8).map((t) => `<li><b>${esc(t.deNome)}</b> → ${esc(t.paraNome)}: “${esc(t.argumento)}”</li>`).join("");

  return `
  <div class="kpis">
    <div class="kpi"><b>${arr.length}</b><span>alunos</span></div>
    <div class="kpi"><b>${fecharam.length}</b><span>fecharam a equipe ideal (6/6)</span></div>
    <div class="kpi"><b>${media(fecharam.map((a) => a.trocas || 0))}</b><span>trocas médias de quem fechou</span></div>
    <div class="kpi"><b>${aceitas.length}</b><span>trocas aceitas · ${recusadas} recusadas · ${expiradas} expiradas</span></div>
    <div class="kpi"><b>${pct(liderOk, concl.length)}%</b><span>escolheram o líder certo</span></div>
    <div class="kpi"><b>${carisma}</b><span>caíram na armadilha do carisma</span></div>
    <div class="kpi"><b>${esgotou}</b><span>esgotaram as 8 trocas sem fechar</span></div>
  </div>
  <p>${niveis}</p>

  <div class="duas-colunas">
    <div class="painel-interno"><h3>Acerto por questão</h3>${concl.length ? porQ : `<p class="vazio">Ninguém concluiu ainda.</p>`}</div>
    <div class="painel-interno"><h3>Por ramo</h3><div class="tabela-rolagem"><table class="tabela">
      <thead><tr><th>Ramo</th><th>Alunos</th><th>Situação</th><th>6/6</th><th>Trocas</th><th>Líder certo</th><th>🎭</th></tr></thead>
      <tbody>${linhasRamo}</tbody></table></div></div>
  </div>

  <div class="painel-interno destaque">
    <h3>Perguntas para o debate</h3>
    <ol class="perguntas">
      <li>Quem fechou a equipe com poucas trocas fez o quê de diferente? Planejou antes de negociar ou foi tentando?</li>
      <li>Alguém aceitou uma troca que não o ajudava só para destravar um colega? Isso é liderança? (Drucker: “líder é quem tem seguidores”.)</li>
      <li>Por que o líder certo não era o mesmo perfil em todos os ramos? O que a maturidade da equipe mudou na escolha? (Hersey e Blanchard)</li>
      <li>${carisma} pessoa(s) escolheram o funcionário mais carismático. Por que o carisma seduz? Popularidade ou resultado?</li>
      <li>O líder escolhido era o que tinha o cargo mais alto? O que o Nível 5 de Collins diz sobre isso?</li>
      <li>Ligue com os casos: na caverna Tham Luang, o governador decidiu cercado de especialistas que sabiam mais do que ele. Qual estilo ele usou?</li>
      <li>O prazo de 1 minuto e meio por proposta pressionou vocês. Que passo de Kotter vocês aplicaram sem perceber (urgência, coalizão, vitórias rápidas)?</li>
    </ol>
  </div>

  ${justs ? `<div class="painel-interno"><h3>Por que escolheram esse líder</h3><ul class="argumentos">${justs}</ul></div>` : ""}
  ${argumentos ? `<div class="painel-interno"><h3>Argumentos que fecharam trocas</h3><ul class="argumentos">${argumentos}</ul></div>` : ""}`;
}
