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

// Painel consolidado: uma linha por sala + totais por ramo e por questão
export function renderConsolidado(linhasSalas, D) {
  if (!linhasSalas.length) return `<p class="vazio">Nenhuma sala encontrada.</p>`;
  const todos = linhasSalas.flatMap(({ res }) => res.alunos);
  const geral = resumir(todos);
  const kpis = `<div class="kpis">
    <div class="kpi"><b>${linhasSalas.length}</b><span>salas</span></div>
    <div class="kpi"><b>${geral.alunos}</b><span>alunos</span></div>
    <div class="kpi"><b>${pc(geral.fecharam6, geral.alunos)}%</b><span>fecharam 6/6</span></div>
    <div class="kpi"><b>${n1(geral.mediaTrocasFech)}</b><span>trocas médias de quem fechou</span></div>
    <div class="kpi"><b>${pc(geral.liderCerto, geral.concluiram)}%</b><span>acertaram o líder</span></div>
    <div class="kpi"><b>${pc(geral.carisma, geral.concluiram)}%</b><span>caíram no carisma</span></div>
    <div class="kpi"><b>${n1(geral.notaMedia)}</b><span>nota média</span></div>
  </div>`;
  const salas = `<div class="tabela-rolagem"><table class="tabela"><thead><tr>
      <th>Turma</th><th>Sala</th><th>Data</th><th>Status</th><th>Alunos</th><th>6/6</th><th>Trocas</th><th>Líder certo</th><th>🎭</th><th>Nota média</th><th>Salvo</th><th></th></tr></thead><tbody>
    ${linhasSalas.map(({ sala, res }) => {
      const r = res.resumo;
      return `<tr><td>${esc(sala.turma || "—")}</td><td><b>${sala.codigo}</b></td><td>${dataSala(sala)}</td><td>${STATUS[sala.status] || sala.status}${sala.resultadoPublicado ? " · publicado" : ""}</td>
        <td>${r.alunos}</td><td>${pc(r.fecharam6, r.alunos)}%</td><td>${n1(r.mediaTrocasFech)}</td><td>${pc(r.liderCerto, r.concluiram)}%</td><td>${r.carisma}</td><td>${n1(r.notaMedia)}</td>
        <td>${res.fonte === "salvo" ? `✅ <small>${new Date(res.salvoMs).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</small>` : "<small>calculado agora</small>"}</td>
        <td class="acoes-sala"><button class="btn-secondary btn-pequeno" data-abrir="${sala.codigo}">Abrir</button><button class="btn-secondary btn-pequeno" data-csv="${sala.codigo}">CSV</button></td></tr>`;
    }).join("")}</tbody></table></div>`;
  const porQ = QIDS.map((id) => {
    const p = pc(geral.questoes[id], geral.concluiram);
    return `<div class="db-barra"><span>${QNOMES[id]}</span><div class="db-trilho"><div style="width:${p}%"></div></div><b>${p}%</b><small>${geral.questoes[id]}/${geral.concluiram}</small></div>`;
  }).join("");
  const ramos = D.RAMOS.map((r) => {
    const g = todos.filter((a) => a.ramo === r.codigo);
    if (!g.length) return "";
    const s = resumir(g);
    return `<tr><td>${r.icone} ${esc(r.nome)}</td><td>${s.alunos}</td><td>${pc(s.fecharam6, s.alunos)}%</td><td>${n1(s.mediaTrocasFech)}</td><td>${pc(s.liderCerto, s.concluiram)}%</td><td>${s.carisma}</td><td>${n1(s.notaMedia)}</td></tr>`;
  }).join("");
  return `${kpis}
    <div class="painel-interno"><h3>Salas</h3>${salas}</div>
    <div class="duas-colunas">
      <div class="painel-interno"><h3>Acerto por questão (todas as salas)</h3>${porQ}</div>
      <div class="painel-interno"><h3>Por ramo (todas as salas)</h3><div class="tabela-rolagem"><table class="tabela">
        <thead><tr><th>Ramo</th><th>Alunos</th><th>6/6</th><th>Trocas</th><th>Líder certo</th><th>🎭</th><th>Nota</th></tr></thead><tbody>${ramos}</tbody></table></div></div>
    </div>`;
}
