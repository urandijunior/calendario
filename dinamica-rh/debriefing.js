// debriefing.js — análise da rodada para o painel do professor (aba "Debriefing").
// Tudo é calculado a partir dos dados que o jogo já grava: alunos, trocas e a sala.

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ms = (ts) => ts?.toMillis?.() ?? null;
const mmss = (t) => {
  if (t == null || t < 0) return "—";
  const s = Math.round(t / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : "—");

export function montarDebriefing({ room, alunos, trades, DECK_BY_ID, PROFISSOES, baseId, profissaoDe, fmt }) {
  if (!room || room.status === "lobby") {
    return `<p class="vazio">O debriefing aparece assim que a rodada começa e vai se atualizando enquanto a turma joga.</p>`;
  }
  const t0 = ms(room.iniciadoEm) || Date.now();
  const nomePorCod = Object.fromEntries(PROFISSOES.map((p) => [p.codigo, p.nome]));
  const codPorNome = Object.fromEntries(PROFISSOES.map((p) => [p.nome, p.codigo]));
  const premium = new Set(room.premium || []);
  const salarios = room.salarios || {};
  const lista = Object.entries(alunos).map(([uid, a]) => ({ uid, ...a, cod: a.profissaoCodigo || codPorNome[a.profissaoCompleta] }));
  const porUid = Object.fromEntries(lista.map((a) => [a.uid, a]));
  const cartaTxt = (id) => DECK_BY_ID[id]?.texto || id;
  const cartaTipo = (id) => DECK_BY_ID[id]?.tipo || "?";
  const tag = (id) => `<span class="tag tag-${cartaTipo(id)}">${cartaTipo(id)}</span>`;
  const resolvidas = trades.filter((t) => t.status === "aceita" || t.status === "recusada");
  const aceitas = trades.filter((t) => t.status === "aceita");
  const recusadas = trades.filter((t) => t.status === "recusada");
  const contratados = lista.filter((a) => a.completo);
  const fim = room.status === "finalizado" || (room.fimEm && Date.now() > room.fimEm);
  const agora = fim ? Math.max(...lista.map((a) => ms(a.completoEm) || 0), ...trades.map((t) => ms(t.resolvidoEm) || 0), t0) : Date.now();

  // ---------- resumo ----------
  const folha = contratados.reduce((s, a) => s + (salarios[a.cod] || 0), 0);
  const tempos = contratados.map((a) => ms(a.completoEm) - t0).filter((x) => x >= 0).sort((a, b) => a - b);
  const mediana = tempos.length ? tempos[Math.floor(tempos.length / 2)] : null;
  const kpis = `
    <div class="kpis">
      <div class="kpi"><b>${contratados.length}/${lista.length}</b><span>contratados</span></div>
      <div class="kpi"><b>${aceitas.length}</b><span>trocas feitas</span></div>
      <div class="kpi"><b>${pct(aceitas.length, resolvidas.length)}</b><span>propostas aceitas</span></div>
      <div class="kpi"><b>${mmss(mediana)}</b><span>tempo mediano até contratar</span></div>
      <div class="kpi"><b>${fmt(folha)}</b><span>folha contratada</span></div>
    </div>`;

  // ---------- cartas mais disputadas e mais recusadas ----------
  const porCarta = {};
  const conta = (id) => (porCarta[baseId(id)] ||= { id, pedida: 0, recusada: 0, aceita: 0 });
  for (const t of trades) {
    if (t.status === "cancelada") continue;
    const c = conta(t.cartaPedidaId);
    c.pedida++;
    if (t.status === "recusada") c.recusada++;
    if (t.status === "aceita") c.aceita++;
  }
  const disputadas = Object.values(porCarta).sort((a, b) => b.pedida - a.pedida || b.recusada - a.recusada).slice(0, 8);
  const tabelaCartas = disputadas.length
    ? `<table class="tabela"><tr><th>Carta</th><th>Vaga</th><th>Pedida</th><th>Recusada</th></tr>
        ${disputadas.map((c) => `<tr><td>${tag(c.id)} ${esc(cartaTxt(c.id))}</td><td>${esc(nomePorCod[profissaoDe(c.id)])}</td><td>${c.pedida}×</td><td>${c.recusada}× <small>(${pct(c.recusada, c.pedida)})</small></td></tr>`).join("")}
       </table>`
    : `<p class="vazio">Ainda não há propostas.</p>`;

  // ---------- cartas que confundiram (pedidas por quem acabou em outra vaga) ----------
  const confusao = {};
  const foraPorAluno = {};
  for (const t of trades) {
    const quem = porUid[t.deUid];
    if (!quem?.completo || t.status === "cancelada") continue;
    if (profissaoDe(t.cartaPedidaId) !== quem.cod) {
      const b = baseId(t.cartaPedidaId);
      (confusao[b] ||= { id: t.cartaPedidaId, vezes: 0, quem: new Set(), finais: new Set() }).vezes++;
      confusao[b].quem.add(quem.nome);
      confusao[b].finais.add(nomePorCod[quem.cod]);
      foraPorAluno[quem.uid] = (foraPorAluno[quem.uid] || 0) + 1;
    }
  }
  const confusas = Object.values(confusao).sort((a, b) => b.quem.size - a.quem.size || b.vezes - a.vezes).slice(0, 6);
  const tabelaConfusao = confusas.length
    ? `<table class="tabela"><tr><th>Carta pedida</th><th>É da vaga</th><th>Pedida por quem virou</th></tr>
        ${confusas.map((c) => `<tr><td>${tag(c.id)} ${esc(cartaTxt(c.id))}</td><td>${esc(nomePorCod[profissaoDe(c.id)])}</td><td>${[...c.finais].map(esc).join(", ")} <small>(${c.quem.size} aluno${c.quem.size > 1 ? "s" : ""})</small></td></tr>`).join("")}
       </table>`
    : `<p class="vazio">Aparece conforme os alunos são contratados.</p>`;

  // ---------- perfil de negociação por aluno ----------
  const perfil = lista.map((a) => {
    const env = trades.filter((t) => t.deUid === a.uid && t.status !== "cancelada");
    const envAceitas = env.filter((t) => t.status === "aceita").length;
    const envResolvidas = env.filter((t) => t.status === "aceita" || t.status === "recusada").length;
    const rec = trades.filter((t) => t.paraUid === a.uid && (t.status === "aceita" || t.status === "recusada"));
    const recusou = rec.filter((t) => t.status === "recusada").length;
    const trocas = aceitas.filter((t) => t.deUid === a.uid || t.paraUid === a.uid).length;
    const tempo = a.completo ? ms(a.completoEm) - t0 : null;
    return { ...a, propostas: env.length, envAceitas, envResolvidas, recusou, recebidas: rec.length, trocas, tempo, fora: foraPorAluno[a.uid] || 0 };
  }).sort((x, y) => (x.tempo ?? Infinity) - (y.tempo ?? Infinity) || x.nome.localeCompare(y.nome));
  const tabelaPerfil = `<table class="tabela"><tr><th>Aluno</th><th>Vaga / salário</th><th>Tempo</th><th>Propostas</th><th>Convenceu</th><th>Recusou</th><th>Trocas</th></tr>
    ${perfil.map((a) => `<tr class="${a.completo ? "" : "pendente"}">
      <td>${esc(a.nome)}</td>
      <td>${a.completo ? `${premium.has(a.cod) ? "💎 " : ""}${esc(nomePorCod[a.cod])} <small>${fmt(salarios[a.cod])}</small>` : fim ? "<i>sem vaga (R$ 0)</i>" : "—"}</td>
      <td>${a.completo ? mmss(a.tempo) : fim ? "—" : "negociando"}</td>
      <td>${a.propostas}</td>
      <td>${pct(a.envAceitas, a.envResolvidas)} <small>(${a.envAceitas}/${a.envResolvidas})</small></td>
      <td>${a.recusou}/${a.recebidas}</td>
      <td>${a.trocas}</td></tr>`).join("")}
  </table>`;

  // ---------- disputa pelas vagas premium ----------
  const tentaram = new Set(trades.filter((t) => premium.has(profissaoDe(t.cartaPedidaId))).map((t) => t.deUid));
  const ganharam = lista.filter((a) => a.completo && premium.has(a.cod));
  const desistiram = [...tentaram].map((u) => porUid[u]).filter((a) => a && a.completo && !premium.has(a.cod));
  const semVaga = [...tentaram].map((u) => porUid[u]).filter((a) => a && !a.completo);
  const nomes = (arr) => (arr.length ? arr.map((a) => esc(a.nome)).join(", ") : "—");
  const vagasPremium = [...premium].reduce((s, c) => s + (room.vagas?.[c] || 0), 0);
  const blocoPremium = `
    <div class="kpis">
      <div class="kpi"><b>${vagasPremium}</b><span>vagas premium</span></div>
      <div class="kpi"><b>${tentaram.size}</b><span>alunos tentaram</span></div>
      <div class="kpi"><b>${ganharam.length}</b><span>conseguiram</span></div>
      <div class="kpi"><b>${desistiram.length}</b><span>mudaram de alvo e garantiram outra</span></div>
    </div>
    <p><b>💎 Conseguiram:</b> ${nomes(ganharam)}</p>
    <p><b>↪ Mudaram de estratégia a tempo:</b> ${nomes(desistiram)}</p>
    ${semVaga.length ? `<p><b>⚠ Insistiram e ${fim ? "ficaram sem vaga" : "ainda não fecharam"}:</b> ${nomes(semVaga)}</p>` : ""}`;

  // ---------- argumentos ----------
  const comArg = resolvidas.filter((t) => t.argumento);
  const semArg = resolvidas.filter((t) => !t.argumento);
  const taxaCom = pct(comArg.filter((t) => t.status === "aceita").length, comArg.length);
  const taxaSem = pct(semArg.filter((t) => t.status === "aceita").length, semArg.length);
  const recentes = (arr) => [...arr].sort((a, b) => (ms(b.resolvidoEm) || 0) - (ms(a.resolvidoEm) || 0));
  const convenceram = recentes(comArg.filter((t) => t.status === "aceita")).slice(0, 6);
  const naoConvenceram = recentes(comArg.filter((t) => t.status === "recusada")).slice(0, 4);
  const argItem = (t) => `<li>“${esc(t.argumento)}” <small>— ${esc(t.deNome)} → ${esc(t.paraNome)}</small></li>`;
  const blocoArg = `
    <p>Propostas <b>com argumento</b> foram aceitas em <b>${taxaCom}</b> dos casos; <b>sem argumento</b>, em <b>${taxaSem}</b>.</p>
    <div class="duas-colunas">
      <div><h4>✅ Convenceram</h4>${convenceram.length ? `<ul class="argumentos">${convenceram.map(argItem).join("")}</ul>` : `<p class="vazio">Nenhum ainda.</p>`}</div>
      <div><h4>❌ Não convenceram</h4>${naoConvenceram.length ? `<ul class="argumentos">${naoConvenceram.map(argItem).join("")}</ul>` : `<p class="vazio">Nenhum ainda.</p>`}</div>
    </div>`;

  // ---------- linha do tempo ----------
  const W = 640, H = 220, P = 36;
  const dur = Math.max(agora - t0, 60000);
  const total = Math.max(lista.length, 1);
  const x = (t) => P + ((W - 2 * P) * Math.min(t, dur)) / dur;
  const y = (n) => H - P - ((H - 2 * P) * n) / total;
  let d = `M ${x(0)} ${y(0)}`;
  tempos.forEach((t, i) => { d += ` H ${x(t).toFixed(1)} V ${y(i + 1).toFixed(1)}`; });
  d += ` H ${x(dur).toFixed(1)}`;
  const trocasTempo = aceitas.map((t) => ms(t.resolvidoEm) - t0).filter((t) => t >= 0);
  const marcasTrocas = trocasTempo.map((t) => `<line x1="${x(t).toFixed(1)}" x2="${x(t).toFixed(1)}" y1="${H - P}" y2="${H - P + 6}" class="tick-troca"/>`).join("");
  const minutos = Math.ceil(dur / 60000);
  const passo = minutos > 10 ? 2 : 1;
  let eixo = "";
  for (let m = 0; m <= minutos; m += passo) eixo += `<text x="${x(m * 60000)}" y="${H - 8}" class="eixo">${m}min</text>`;
  const linha = `
    <svg viewBox="0 0 ${W} ${H}" class="grafico" role="img" aria-label="Contratações acumuladas ao longo da rodada">
      <line x1="${P}" x2="${W - P}" y1="${y(total)}" y2="${y(total)}" class="meta"/>
      <text x="${W - P}" y="${y(total) - 6}" class="eixo" text-anchor="end">${total} alunos</text>
      <line x1="${P}" x2="${W - P}" y1="${H - P}" y2="${H - P}" class="base"/>
      ${marcasTrocas}
      <path d="${d}" class="curva"/>
      ${eixo}
    </svg>
    <p class="hint">Degraus = contratações acumuladas. Tracinhos no eixo = cada troca realizada. Trechos planos mostram quando a turma travou.</p>
    ${tempos.length ? `<p>Primeira contratação: <b>${mmss(tempos[0])}</b> · última: <b>${mmss(tempos[tempos.length - 1])}</b></p>` : ""}`;

  // ---------- perguntas sugeridas a partir dos dados ----------
  const perguntas = [];
  const maisRecusada = Object.values(porCarta).filter((c) => c.recusada >= 2).sort((a, b) => b.recusada - a.recusada)[0];
  if (maisRecusada) perguntas.push(`A carta “${esc(cartaTxt(maisRecusada.id))}” foi recusada ${maisRecusada.recusada} vezes. Por que ninguém queria abrir mão dela, ou não a reconhecia?`);
  if (confusas[0]) perguntas.push(`“${esc(cartaTxt(confusas[0].id))}” é de ${esc(nomePorCod[profissaoDe(confusas[0].id)])}, mas foi pedida por quem virou ${[...confusas[0].finais].map(esc).join(" e ")}. O que a torna ambígua?`);
  const rapido = perfil.find((a) => a.completo);
  if (rapido) perguntas.push(`${esc(rapido.nome)} foi contratado(a) em ${mmss(rapido.tempo)}. Qual foi a estratégia?`);
  const persuasivo = perfil.filter((a) => a.envResolvidas >= 3).sort((a, b) => b.envAceitas / b.envResolvidas - a.envAceitas / a.envResolvidas)[0];
  if (persuasivo) perguntas.push(`${esc(persuasivo.nome)} convenceu em ${pct(persuasivo.envAceitas, persuasivo.envResolvidas)} das propostas. Que competências de negociação usou?`);
  if (desistiram.length) perguntas.push(`${desistiram.length} aluno(s) desistiram da vaga premium e garantiram outra. Como decidiram a hora de mudar?`);
  if (comArg.length >= 3) perguntas.push(`Com argumento, ${taxaCom} de aceite; sem argumento, ${taxaSem}. O que isso diz sobre comunicação persuasiva?`);

  return `
    ${kpis}
    ${perguntas.length ? `<div class="painel-interno destaque"><h3>🗣 Perguntas sugeridas para a conversa</h3><ol class="perguntas">${perguntas.map((p) => `<li>${p}</li>`).join("")}</ol></div>` : ""}
    <div class="painel-interno"><h3>📈 Linha do tempo das contratações</h3>${linha}</div>
    <div class="painel-interno"><h3>🔥 Cartas mais disputadas e mais recusadas</h3>${tabelaCartas}</div>
    <div class="painel-interno"><h3>🧩 Cartas que confundiram</h3><p class="hint">Cartas pedidas por alunos que acabaram contratados em OUTRA vaga: sinal de classificação ambígua ou de mudança de estratégia.</p>${tabelaConfusao}</div>
    <div class="painel-interno"><h3>💎 Disputa pelas vagas premium</h3>${blocoPremium}</div>
    <div class="painel-interno"><h3>💬 Argumentos usados nas propostas</h3>${blocoArg}</div>
    <div class="painel-interno"><h3>🤝 Perfil de negociação de cada aluno</h3><p class="hint">Em ordem de contratação. “Convenceu” = propostas enviadas que foram aceitas. “Recusou” = propostas recebidas que recusou.</p><div class="tabela-rolagem">${tabelaPerfil}</div></div>`;
}
