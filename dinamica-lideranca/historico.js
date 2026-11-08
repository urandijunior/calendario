// historico.js — resultado salvo de cada sala + painel consolidado de todas as salas
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const n1 = (x) => (x == null || Number.isNaN(x) ? "—" : x.toFixed(1).replace(".", ","));
const pc = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const QIDS = ["q1", "q2", "q3", "q4", "q5", "q6"];
export const QNOMES = { q1: "Maturidade (Hersey e Blanchard)", q2: "Estilo situacional", q3: "Quem pratica o estilo (Chiavenato)", q4: "Armadilha do carisma (Drucker)", q5: "Nível 5 (Collins)", q6: "Passo de Kotter" };

// Foto do resultado da sala: gravada no documento da sala para não depender de recalcular depois
export function montarResultado(alunosArr, D) {
  const c = D.classificar(alunosArr);
  const alunos = alunosArr.map((a) => {
    const r = D.RAMO[a.ramo];
    const qs = a.fase === "concluido" ? D.montarQuestionario(a.ramo, a.maoFinal || []) : [];
    const x = c[a.uid];
    return {
      uid: a.uid, nome: a.nome || "", ramo: a.ramo || "", ramoNome: r?.nome || "",
      equipeInicial: a.equipeInicial ?? null, equipeFinal: a.equipeFinal ?? null, trocas: a.trocas || 0,
      motivoFim: a.motivoFim || null, fase: a.fase || null, acertos: a.acertos ?? null,
      questoes: Object.fromEntries(qs.map((q) => [q.id, a.respostas?.[q.id] === q.certa])),
      lider: D.FUNCIONARIOS[a.liderEscolhido]?.nome || null, liderCerto: a.fase === "concluido" ? !!a.liderCerto : null,
      caiuCarisma: a.fase === "concluido" ? a.liderEscolhido === r?.carismaId : null,
      justificativa: a.justificativa || "",
      pos: x.pos ?? null, nivel: x.pendente ? "pendente" : x.nivel.id, nivelNome: x.pendente ? "Não concluiu" : x.nivel.nome, nota: x.nivel.nota,
    };
  }).sort((a, b) => (a.pos ?? 999) - (b.pos ?? 999) || a.nome.localeCompare(b.nome));
  return { versao: 1, salvoMs: Date.now(), alunos, resumo: resumir(alunos) };
}

export function resumir(alunos) {
  const concl = alunos.filter((a) => a.fase === "concluido");
  const fech = alunos.filter((a) => a.equipeFinal === 6);
  const niveis = {};
  alunos.forEach((a) => (niveis[a.nivel] = (niveis[a.nivel] || 0) + 1));
  const q = Object.fromEntries(QIDS.map((id) => [id, concl.filter((a) => a.questoes?.[id]).length]));
  return {
    alunos: alunos.length, concluiram: concl.length, fecharam6: fech.length,
    mediaTrocasFech: fech.length ? fech.reduce((s, a) => s + a.trocas, 0) / fech.length : null,
    liderCerto: concl.filter((a) => a.liderCerto).length, carisma: concl.filter((a) => a.caiuCarisma).length,
    esgotaram: alunos.filter((a) => a.motivoFim === "trocas").length,
    notaMedia: alunos.length ? alunos.reduce((s, a) => s + (a.nota || 0), 0) / alunos.length : null,
    acertosMedia: concl.length ? concl.reduce((s, a) => s + (a.acertos || 0), 0) / concl.length : null,
    niveis, questoes: q,
  };
}

export function csvDe(linhasSalas) {
  const cab = ["turma", "sala", "data", "posicao", "aluno", "ramo", "equipe_inicial", "equipe_final", "trocas", "motivo_fim", "acertos", ...QIDS, "lider_escolhido", "lider_certo", "caiu_carisma", "nivel", "nota", "justificativa"];
  const linhas = [cab];
  linhasSalas.forEach(({ sala, res }) => res.alunos.forEach((a) => linhas.push([
    sala.turma || "", sala.codigo, dataSala(sala), a.pos ?? "", a.nome, a.ramoNome, a.equipeInicial ?? "", a.equipeFinal ?? "", a.trocas, a.motivoFim || "",
    a.acertos ?? "", ...QIDS.map((id) => (a.questoes?.[id] == null ? "" : a.questoes[id] ? 1 : 0)),
    a.lider || "", a.liderCerto == null ? "" : a.liderCerto ? "sim" : "não", a.caiuCarisma == null ? "" : a.caiuCarisma ? "sim" : "não",
    a.nivelNome, String(a.nota).replace(".", ","), a.justificativa,
  ])));
  return "﻿" + linhas.map((l) => l.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
}

export function baixar(nome, conteudo) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([conteudo], { type: "text/csv;charset=utf-8" }));
  a.download = nome;
  a.click();
}

export function dataSala(sala) {
  const t = sala.criadoMs || sala.criadoEm?.toMillis?.();
  return t ? new Date(t).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "";
}
const STATUS = { lobby: "aguardando", jogando: "em jogo", finalizado: "encerrada" };
const ms = (t) => (t?.toMillis ? t.toMillis() : typeof t === "number" ? t : null);
const brl = (v) => (Number(v) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export const DINAMICAS = {
  lideranca: { nome: "Liderança", icone: "🧭", classe: "din-lid" },
  rh: { nome: "Habilidades e Competências (RH)", icone: "🧩", classe: "din-rh" },
};

// ---------------------------------------------------------------------------
// Dinâmica de RH: resultado calculado a partir dos dados que ela já grava
// (alunos contratados, profissão, salário da vaga e horário da contratação)
// ---------------------------------------------------------------------------
export function resultadoRH(sala, alunosArr, trades) {
  const salarios = sala.salarios || {};
  const premium = new Set(sala.premium || []);
  const t0 = ms(sala.iniciadoEm);
  const alunos = alunosArr.map((a) => {
    const cod = a.profissaoCodigo || null;
    const salario = a.completo ? salarios[cod] || 0 : 0;
    const tc = ms(a.completoEm);
    return { uid: a.uid, nome: a.nome || "", contratado: !!a.completo, profissao: a.profissaoCompleta || "", codigo: cod,
      salario, premium: a.completo && premium.has(cod), tempoMin: a.completo && t0 && tc ? Math.round((tc - t0) / 6000) / 10 : null, _t: tc ?? Infinity };
  }).sort((x, y) => y.salario - x.salario || x._t - y._t || x.nome.localeCompare(y.nome));
  alunos.forEach((a, i) => { a.pos = a.contratado ? i + 1 : null; delete a._t; });
  const contr = alunos.filter((a) => a.contratado);
  const tempos = contr.map((a) => a.tempoMin).filter((x) => x != null);
  return {
    alunos, fonte: "calculado", salvoMs: null,
    resumo: {
      alunos: alunos.length, contratados: contr.length, premium: contr.filter((a) => a.premium).length,
      folha: contr.reduce((s, a) => s + a.salario, 0), salarioMedio: contr.length ? contr.reduce((s, a) => s + a.salario, 0) / contr.length : null,
      trocas: trades ? trades.filter((t) => t.status === "aceita").length : null, tempoMedio: tempos.length ? tempos.reduce((s, x) => s + x, 0) / tempos.length : null,
    },
  };
}

export function csvRH(itens) {
  const linhas = [["turma", "sala", "data", "posicao", "aluno", "contratado", "profissao", "salario", "vaga_premium", "minutos_ate_contratar"]];
  itens.forEach(({ sala, res }) => res.alunos.forEach((a) => linhas.push([sala.turma || "", sala.codigo, dataSala(sala), a.pos ?? "", a.nome,
    a.contratado ? "sim" : "não", a.profissao, a.salario, a.premium ? "sim" : "", a.tempoMin == null ? "" : String(a.tempoMin).replace(".", ",")])));
  return "﻿" + linhas.map((l) => l.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
}

// ---------------------------------------------------------------------------
// Painel do histórico (as duas dinâmicas)
// ---------------------------------------------------------------------------
function linhaSala({ sala, res, dinamica }) {
  const d = DINAMICAS[dinamica];
  const r = res.resumo;
  const resultado = dinamica === "lideranca"
    ? `${pc(r.fecharam6, r.alunos)}% fecharam 6/6 · ${pc(r.liderCerto, r.concluiram)}% líder certo`
    : `${pc(r.contratados, r.alunos)}% contratados · 💎 ${r.premium}`;
  const media = dinamica === "lideranca" ? `nota ${n1(r.notaMedia)}` : `salário ${r.salarioMedio == null ? "—" : brl(r.salarioMedio)}`;
  const salvo = res.fonte === "salvo" ? `✅ <small>${new Date(res.salvoMs).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</small>` : "<small>calculado agora</small>";
  return `<tr>
    <td><span class="din ${d.classe}">${d.icone} ${d.nome}</span></td>
    <td>${esc(sala.turma || "—")} <button class="link-toggle editar-turma" data-rotular="${sala.codigo}" title="Editar turma">✏️</button></td>
    <td><b>${sala.codigo}</b></td><td>${dataSala(sala)}</td><td>${STATUS[sala.status] || sala.status || ""}${sala.resultadoPublicado ? " · publicado" : ""}</td>
    <td>${r.alunos}</td><td>${resultado}</td><td>${media}</td><td>${salvo}</td>
    <td class="acoes-sala">${dinamica === "lideranca" ? `<button class="btn-secondary btn-pequeno" data-abrir="${sala.codigo}">Abrir</button>` : ""}<button class="btn-secondary btn-pequeno" data-ver="${sala.codigo}">Alunos</button><button class="btn-secondary btn-pequeno" data-csv="${sala.codigo}">CSV</button></td></tr>`;
}

function blocoLideranca(itens, D) {
  if (!itens.length) return "";
  const todos = itens.flatMap(({ res }) => res.alunos);
  const g = resumir(todos);
  const porQ = QIDS.map((id) => {
    const p = pc(g.questoes[id], g.concluiram);
    return `<div class="db-barra"><span>${QNOMES[id]}</span><div class="db-trilho"><div style="width:${p}%"></div></div><b>${p}%</b><small>${g.questoes[id]}/${g.concluiram}</small></div>`;
  }).join("");
  const ramos = D.RAMOS.map((r) => {
    const gr = todos.filter((a) => a.ramo === r.codigo);
    if (!gr.length) return "";
    const s = resumir(gr);
    return `<tr><td>${r.icone} ${esc(r.nome)}</td><td>${s.alunos}</td><td>${pc(s.fecharam6, s.alunos)}%</td><td>${n1(s.mediaTrocasFech)}</td><td>${pc(s.liderCerto, s.concluiram)}%</td><td>${s.carisma}</td><td>${n1(s.notaMedia)}</td></tr>`;
  }).join("");
  return `<div class="painel-interno bloco-din"><h3>🧭 Liderança · ${itens.length} sala(s)</h3>
    <div class="kpis">
      <div class="kpi"><b>${g.alunos}</b><span>alunos</span></div>
      <div class="kpi"><b>${pc(g.fecharam6, g.alunos)}%</b><span>fecharam 6/6</span></div>
      <div class="kpi"><b>${n1(g.mediaTrocasFech)}</b><span>trocas médias de quem fechou</span></div>
      <div class="kpi"><b>${pc(g.liderCerto, g.concluiram)}%</b><span>acertaram o líder</span></div>
      <div class="kpi"><b>${pc(g.carisma, g.concluiram)}%</b><span>caíram no carisma</span></div>
      <div class="kpi"><b>${n1(g.notaMedia)}</b><span>nota média</span></div>
    </div>
    <div class="duas-colunas">
      <div><h4>Acerto por questão</h4>${porQ}</div>
      <div><h4>Por ramo</h4><div class="tabela-rolagem"><table class="tabela">
        <thead><tr><th>Ramo</th><th>Alunos</th><th>6/6</th><th>Trocas</th><th>Líder certo</th><th>🎭</th><th>Nota</th></tr></thead><tbody>${ramos}</tbody></table></div></div>
    </div></div>`;
}

function blocoRH(itens) {
  if (!itens.length) return "";
  const todos = itens.flatMap(({ res }) => res.alunos);
  const contr = todos.filter((a) => a.contratado);
  const trocasConhecidas = itens.filter(({ res }) => res.resumo.trocas != null);
  const tempos = contr.map((a) => a.tempoMin).filter((x) => x != null);
  const prof = {};
  contr.forEach((a) => { const p = (prof[a.profissao] ||= { n: 0, premium: 0, sal: 0 }); p.n++; if (a.premium) p.premium++; p.sal += a.salario; });
  const linhasProf = Object.entries(prof).sort((a, b) => b[1].n - a[1].n).map(([nome, p]) =>
    `<tr><td>${esc(nome)}</td><td>${p.n}</td><td>${p.premium}</td><td>${brl(p.sal / p.n)}</td></tr>`).join("");
  return `<div class="painel-interno bloco-din"><h3>🧩 Habilidades e Competências (RH) · ${itens.length} sala(s)</h3>
    <div class="kpis">
      <div class="kpi"><b>${todos.length}</b><span>alunos</span></div>
      <div class="kpi"><b>${pc(contr.length, todos.length)}%</b><span>contratados</span></div>
      <div class="kpi"><b>${contr.filter((a) => a.premium).length}</b><span>contratações premium 💎</span></div>
      <div class="kpi"><b>${contr.length ? brl(contr.reduce((s, a) => s + a.salario, 0) / contr.length) : "—"}</b><span>salário médio conquistado</span></div>
      <div class="kpi"><b>${tempos.length ? n1(tempos.reduce((s, x) => s + x, 0) / tempos.length) + " min" : "—"}</b><span>tempo médio até contratar</span></div>
      <div class="kpi"><b>${trocasConhecidas.length ? trocasConhecidas.reduce((s, { res }) => s + res.resumo.trocas, 0) : "—"}</b><span>trocas realizadas</span></div>
    </div>
    ${linhasProf ? `<h4>Profissões conquistadas</h4><div class="tabela-rolagem"><table class="tabela"><thead><tr><th>Profissão</th><th>Contratações</th><th>💎 premium</th><th>Salário médio</th></tr></thead><tbody>${linhasProf}</tbody></table></div>` : ""}
  </div>`;
}

export function renderHistorico(itens, D) {
  if (!itens.length) return `<p class="vazio">Nenhuma sala encontrada.</p>`;
  const lid = itens.filter((x) => x.dinamica === "lideranca");
  const rh = itens.filter((x) => x.dinamica === "rh");
  return `<div class="kpis">
      <div class="kpi"><b>${itens.length}</b><span>salas no filtro</span></div>
      <div class="kpi"><b>${lid.length}</b><span>🧭 de Liderança</span></div>
      <div class="kpi"><b>${rh.length}</b><span>🧩 de RH</span></div>
      <div class="kpi"><b>${itens.reduce((s, x) => s + x.res.resumo.alunos, 0)}</b><span>participações de alunos</span></div>
    </div>
    <div class="painel-interno"><h3>Salas</h3><div class="tabela-rolagem"><table class="tabela"><thead><tr>
      <th>Dinâmica</th><th>Turma</th><th>Sala</th><th>Data</th><th>Status</th><th>Alunos</th><th>Resultado</th><th>Média</th><th>Salvo</th><th></th></tr></thead>
      <tbody>${itens.map(linhaSala).join("")}</tbody></table></div></div>
    <div id="hist-detalhe"></div>
    ${blocoLideranca(lid, D)}
    ${blocoRH(rh)}`;
}

// Tabela de alunos de uma sala (qualquer dinâmica)
export function renderDetalhe({ sala, res, dinamica }) {
  const d = DINAMICAS[dinamica];
  const cab = `<div class="painel-head"><h3>${d.icone} ${esc(sala.turma || "Sem turma")} · sala ${sala.codigo} · ${dataSala(sala)}</h3><button class="link-toggle" data-fechar-detalhe>fechar ✕</button></div>`;
  if (dinamica === "rh") {
    return `<div class="painel-interno destaque">${cab}<div class="tabela-rolagem"><table class="tabela"><thead><tr><th>#</th><th>Aluno</th><th>Profissão</th><th>Salário</th><th>Tempo</th></tr></thead><tbody>
      ${res.alunos.map((a) => `<tr class="${a.contratado ? "" : "pendente"}"><td>${a.pos ?? "—"}</td><td>${esc(a.nome)}</td><td>${a.contratado ? `${a.premium ? "💎 " : ""}${esc(a.profissao)}` : "<i>não contratado</i>"}</td><td>${a.contratado ? brl(a.salario) : "R$ 0"}</td><td>${a.tempoMin == null ? "—" : n1(a.tempoMin) + " min"}</td></tr>`).join("")}
      </tbody></table></div></div>`;
  }
  return `<div class="painel-interno destaque">${cab}<div class="tabela-rolagem"><table class="tabela"><thead><tr><th>#</th><th>Aluno</th><th>Ramo</th><th>Equipe</th><th>Trocas</th><th>Questionário</th><th>Líder</th><th>Nível</th><th>Nota</th></tr></thead><tbody>
    ${res.alunos.map((a) => `<tr class="${a.nivel === "pendente" ? "pendente" : ""}"><td>${a.pos ?? "—"}</td><td>${esc(a.nome)}</td><td>${esc(a.ramoNome)}</td><td>${a.equipeFinal ?? "?"}/6</td><td>${a.trocas}</td><td>${a.acertos == null ? "—" : a.acertos + "/6"}</td>
      <td>${a.lider ? `${a.liderCerto ? "✅" : "❌"} ${esc(a.lider)}` : "—"}</td><td>${esc(a.nivelNome)}</td><td><b>${n1(a.nota)}</b></td></tr>`).join("")}
    </tbody></table></div></div>`;
}
