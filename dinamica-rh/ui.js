// ui.JS — camada de interface. Toda a lógica/estado do jogo vive em app.js
// (exposta em window.CDA); aqui só desenhamos telas e ligamos eventos.

function waitForCDA() {
    return new Promise((resolve) => {
          if (window.CDA) return resolve(window.CDA);
          const iv = setInterval(() => {
                  if (window.CDA) {
                            clearInterval(iv);
                            resolve(window.CDA);
                  }
          }, 30);
    });
}

const CDA = await waitForCDA();
const { db, onSnapshot, doc, collection, query, where, getDocs, DECK_BY_ID, PROFISSOES, state } = CDA;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ---------------------------------------------------------------------------
// Navegação entre telas
// ---------------------------------------------------------------------------
function show(screenId) {
    $$(".screen").forEach((el) => el.classList.remove("active"));
    $(`#${screenId}`).classList.add("active");
}

$$("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
          CDA.clearListeners();
          show(btn.dataset.back);
    });
});

$("#btn-sou-professor").addEventListener("click", () => show("screen-prof-criar"));
$("#btn-sou-aluno").addEventListener("click", () => show("screen-aluno-entrar"));

// ---------------------------------------------------------------------------
// Cartas — helpers de render
// ---------------------------------------------------------------------------
function criarCartaEl(cardId, { selecionavel = false, selecionada = false, onClick = null } = {}) {
    const carta = DECK_BY_ID[cardId];
    if (!carta) return document.createElement("div");
    const el = document.createElement("div");
    el.className = `carta tipo-${carta.tipo}` + (selecionável ? " selecionavel" : "") + (Selecionada ? " selecionada" : "");
    el.innerHTML = `
        <div class="carta-tipo">${carta.tipo === "H" ? "HABILIDADE" : "COMPETÊNCIA"}</div>
            <div class="carta-texto">${carta.texto}</div>
              `;
    if (onClick) el.addEventListener("click", () => onClick(cardId, el));
    return el;
}

function renderMao(containerEl, cardIds, opts = {}) {
    containerEl.innerHTML = "";
    if (!cardIds.length) {
          containerEl.innerHTML = `<p class="vazio">Nenhuma carta.</p>`;
          return;
    }
    cardIds.forEach((id) => containerEl.appendChild(criarCartaEl(id, opts)));
}

// ---------------------------------------------------------------------------
// PROFESSOR — criar sala
// ---------------------------------------------------------------------------
$("#btn-criar-sala").addEventListener("click", async () => {
    const nome = $("#input-nome-professor").value.trim();
    $("#erro-criar-sala").textContent = "";
    try {
          const codigo = await CDA.criarSala(nome);
          state.role = "professor";
          state.roomCode = codigo;
          state.nome = nome;
          $("#dash-codigo").textContent = codigo;
          show("screen-prof-dashboard");
          iniciarDashboardProfessor(codigo);
    } catch (e) {
          $("#erro-criar-sala").textContent = e.message || "Erro ao criar sala.";
    }
});

let alunosCache = {}; // uid -> {nome, completo, profissaoCompleta}

function iniciarDashboardProfessor(codigo) {
    CDA.clearListeners();

  const unsubRoom = onSnapshot(doc(db, "rooms", codigo), (snap) => {
        const data = snap.data();
        if (!data) return;
        $("#dash-status").textContent = data.status;
        $("#btn-iniciar-jogo").disabled = data.status !== "lobby";
  });

  const unsubStudents = onSnapshot(collection(db, "rooms", codigo, "students"), (snap) => {
        alunosCache = {};
        snap.forEach((d) => (alunosCache[d.id] = d.data()));
        renderListaAlunosProfessor();
  });

  state.unsubs.push(unsubRoom, unsubStudents);
}

function renderListaAlunosProfessor() {
    const uids = Object.keys(alunosCache);
    $("#dash-total-alunos").textContent = uids.length;
    const box = $("#dash-lista-alunos");
    box.innerHTML = "";
    if (!uids.length) {
          box.innerHTML = `<p class="vazio">Ninguém entrou ainda.</p>`;
          return;
    }
    uids.forEach((uid) => {
          const a = alunosCache[uid];
          const row = document.createElement("div");
          row.className = "aluno-item" + (a.completo ? " completo" : "");
          row.innerHTML = `
                <span>${a.nome}</span>
                      <span class="status-ok">${a.completo ? "✅ " + a.profissaoCompleta : "🔄 em jogo"}</span>
                          `;
          box.appendChild(row);
    });
}

$("#btn-iniciar-jogo").addEventListener("click", async () => {
    $("#erro-dashboard").textContent = "";
    try {
          await CDA.iniciarJogo(state.roomCode);
    } catch (e) {
          $("#erro-dashboard").textContent = e.message || "Erro ao iniciar.";
    }
});

$("#btn-encerrar-jogo").addEventListener("click", async () => {
    await CDA.encerrarJogo(state.roomCode);
});

$("#btn-enviar-dica").addEventListener("click", async () => {
    const texto = $("#input-dica").value.trim();
    await CDA.enviarDica(state.roomCode, texto);
});

$("#btn-toggle-gabarito").addEventListener("click", () => {
    const box = $("#gabarito-box");
    box.classList.toggle("hidden");
    if (box.classList.contains("hidden") || box.dataset.built) return;
    box.dataset.built = "1";
    box.innerHTML = PROFISSOES.map(
          (p) => `
              <div class="gabarito-prof">
                    <b>${p.nome}</b> <span class="vazio">(${p.codigo})</span>
                          <ul>${p.habilidades.map((h) => `<li>[H] ${h}</li>`).join("")}${p.competencias
                                                                                               .map((c) => `<li>[C] ${c}</li>`)
                                                                                               .join("")}</ul>
                                                                                                   </div>`
        ).join("");
});

// ---------------------------------------------------------------------------
// ALUNO — entrar na sala
// ---------------------------------------------------------------------------
$("#btn-entrar-sala").addEventListener("click", async () => {
    const codigo = $("#input-codigo-sala").value.trim().toUpperCase();
    const nome = $("#input-nome-aluno").value.trim();
    $("#erro-entrar-sala").textContent = "";
    if (!codigo || !nome) {
          $("#erro-entrar-sala").textContent = "Preencha o código e seu nome.";
          return;
    }
    try {
          await CDA.entrarNaSala(codigo, nome);
          state.role = "aluno";
          state.roomCode = codigo;
          state.nome = nome;
          $("#aluno-codigo").textContent = codigo;
          show("screen-aluno-sala");
          iniciarSalaAluno(codigo);
    } catch (e) {
          $("#erro-entrar-sala").textContent = e.message || "Não foi possível entrar.";
    }
});

let meuMaoIds = [];
let jaMarqueiCompleto = false;
let colegasCache = {}; // uid -> {nome, completo, profissaoCompleta}

function iniciarSalaAluno(codigo) {
    CDA.clearListeners();
    meuMaoIds = [];
    jaMarqueiCompleto = false;

  const unsubRoom = onSnapshot(doc(db, "rooms", codigo), (snap) => {
        const data = snap.data();
        if (!data) return;
        if (data.dica) {
                $("#aluno-dica").textContent = "💡 Dica do(a) professor(a): " + data.dica;
                $("#aluno-dica").classList.remove("hidden");
        }
        const jogando = data.status === "jogando" || data.status === "finalizado";
        $("#aluno-espera").classList.toggle("hidden", jogando);
        $("#aluno-jogo").classList.toggle("hidden", !jogando);
  });

  const unsubStudents = onSnapshot(collection(db, "rooms", codigo, "students"), (snap) => {
        colegasCache = {};
        snap.forEach((d) => (colegasCache[d.id] = d.data()));
        renderEspera();
        renderColegas();
  });

  const unsubMinhaMao = onSnapshot(
        query(collection(db, "rooms", codigo, "cards"), where("donoUid", "==", CDA.state.uid)),
        async (snap) => {
                meuMaoIds = snap.docs.map((d) => d.id);
                renderMao($("#minha-mao"), meuMaoIds);
                if (!jaMarqueiCompleto) {
                          const resultado = await CDA.autoverificarConjunto(codigo, meuMaoIds);
                          if (resultado) {
                                      jaMarqueiCompleto = true;
                                      $("#aluno-profissao-nome").textContent = resultado.nome;
                                      $("#aluno-completo-banner").classList.remove("hidden");
                          }
                }
        }
      );

  const unsubRecebidas = onSnapshot(
        query(
                collection(db, "rooms", codigo, "trades"),
                where("paraUid", "==", CDA.state.uid),
                where("status", "==", "pendente")
              ),
        (snap) => renderTrocasRecebidas(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );

  const unsubEnviadas = onSnapshot(
        query(
                collection(db, "rooms", codigo, "trades"),
                where("deUid", "==", CDA.state.uid),
                where("status", "==", "pendente")
              ),
        (snap) => renderTrocasEnviadas(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );

  state.unsubs.push(unsubRoom, unsubStudents, unsubMinhaMao, unsubRecebidas, unsubEnviadas);
}

function renderEspera() {
    const box = $("#espera-lista-alunos");
    const uids = Object.keys(colegasCache);
    box.innerHTML = "";
    if (!uids.length) {
          box.innerHTML = `<p class="vazio">Ainda ninguém entrou.</p>`;
          return;
    }
    uids.forEach((uid) => {
          const a = colegasCache[uid];
          const row = document.createElement("div");
          row.className = "aluno-item";
          row.innerHTML = `<span>${a.nome}${uid === CDA.state.uid ? " (você)" : ""}</span>`;
          box.appendChild(row);
    });
}

function renderColegas() {
    const box = $("#lista-colegas");
    const uids = Object.keys(colegasCache).filter((u) => u !== CDA.state.uid);
    box.innerHTML = "";
    if (!uids.length) {
          box.innerHTML = `<p class="vazio">Nenhum colega ainda.</p>`;
          return;
    }
    uids.forEach((uid) => {
          const a = colegasCache[uid];
          const row = document.createElement("div");
          row.className = "aluno-item" + (a.completo ? " completo" : "");
          row.innerHTML = `
                <span>${a.nome} ${a.completo ? "✅" : ""}</span>
                      <button class="btn-secondary">Ver mão / Propor troca</button>
                          `;
          row.querySelector("button").addEventListener("click", () => abrirModalTroca(uid, a.nome));
          box.appendChild(row);
    });
}

function renderTrocasRecebidas(trades) {
    const box = $("#trocas-recebidas");
    box.innerHTML = "";
    if (!trades.length) {
          box.innerHTML = `<p class="vazio">Nenhuma solicitação recebida.</p>`;
          return;
    }
    trades.forEach((t) => {
          const oferecida = DECK_BY_ID[t.cartaOferecidaId];
          const pedida = DECK_BY_ID[t.cartaPedidaId];
          const el = document.createElement("div");
          el.className = "troca-item";
          el.innerHTML = `
                <div><b>${t.deNome}</b> oferece: <i>${oferecida?.texto}</i> (${oferecida?.tipo})</div>
                      <div>em troca da sua carta: <i>${pedida?.texto}</i> (${pedida?.tipo})</div>
                            <div class="troca-acoes">
                                    <button class="btn-primary" data-aceitar="${t.id}">Aceitar</button>
                                            <button class="btn-secondary" data-recusar="${t.id}">Recusar</button>
                                                  </div>
                                                      `;
          el.querySelector("[data-aceitar]").addEventListener("click", async (ev) => {
                  ev.target.disabled = true;
                  try {
                            await CDA.aceitarTroca(state.roomCode, t.id);
                  } catch (e) {
                            alert(e.message);
                            ev.target.disabled = false;
                  }
          });
          el.querySelector("[data-recusar]").addEventListener("click", () => CDA.recusarTroca(state.roomCode, t.id));
          box.appendChild(el);
    });
}

function renderTrocasEnviadas(trades) {
    const box = $("#trocas-enviadas");
    box.innerHTML = "";
    if (!trades.length) {
          box.innerHTML = `<p class="vazio">Nenhuma solicitação enviada.</p>`;
          return;
    }
    trades.forEach((t) => {
          const oferecida = DECK_BY_ID[t.cartaOferecidaId];
          const pedida = DECK_BY_ID[t.cartaPedidaId];
          const el = document.createElement("div");
          el.className = "troca-item";
          el.innerHTML = `
                <div>Você ofereceu: <i>${oferecida?.texto}</i> para <b>${t.paraNome}</b></div>
                      <div>pedindo: <i>${pedida?.texto}</i></div>
                            <div class="troca-acoes"><button class="btn-secondary" data-cancelar="${t.id}">Cancelar</button></div>
                                `;
          el.querySelector("[data-cancelar]").addEventListener("click", () => CDA.cancelarTroca(state.roomCode, t.id));
          box.appendChild(el);
    });
}

// ---------------------------------------------------------------------------
// Modal de troca
// ---------------------------------------------------------------------------
let modalColegaUid = null;
let modalOferta = null;
let modalPedida = null;

async function abrirModalTroca(colegaUid, colegaNome) {
    modalColegaUid = colegaUid;
    modalOferta = null;
    modalPedida = null;
    $("#modal-colega-nome").textContent = colegaNome;
    $("#erro-modal-troca").textContent = "";
    $("#btn-confirmar-troca").disabled = true;
    $("#modal-troca").classList.remove("hidden");

  renderMao($("#modal-mao-propria"), meuMaoIds, {
        selecionavel: true,
        onClick: (cardId, el) => {
                $$("#modal-mao-propria .carta").forEach((c) => c.classList.remove("selecionada"));
                el.classList.add("selecionada");
                modalOferta = cardId;
                atualizarBotaoConfirmar();
        },
  });

  const snap = await getDocs(query(collection(db, "rooms", state.roomCode, "cards"), where("donoUid", "==", colegaUid)));
    const colegaMaoIds = snap.docs.map((d) => d.id);
    renderMao($("#modal-mao-colega"), colegaMaoIds, {
          selecionavel: true,
          onClick: (cardId, el) => {
                  $$("#modal-mao-colega .carta").forEach((c) => c.classList.remove("selecionada"));
                  el.classList.add("selecionada");
                  modalPedida = cardId;
                  atualizarBotaoConfirmar();
          },
    });
}

function atualizarBotaoConfirmar() {
    $("#btn-confirmar-troca").disabled = !(ModalOferta && modalPedida);
}

$("#btn-confirmar-troca").addEventListener("click", async () => {
    try {
          await CDA.proporTroca(
                  state.roomCode,
                  modalColegaUid,
                  colegasCache[modalColegaUid]?.nome || "",
                  modalOferta,
                  modalPedida
                );
          $("#modal-troca").classList.add("hidden");
    } catch (e) {
          $("#erro-modal-troca").textContent = e.message || "Erro ao propor troca.";
    }
});

$("#modal-fechar").addEventListener("click", () => $("#modal-troca").classList.add("hidden"));
