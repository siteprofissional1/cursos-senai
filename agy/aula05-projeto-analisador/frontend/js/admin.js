/**
 * ====================================================================
 * Frontend Gerencial (Admin) - Analisador de Feedbacks Hamburgueria Gourmet
 * Camada de Moderação, Autenticação e Auditoria de Métricas (OWASP A01/A07)
 * Desenvolvido com: Google Antigravity & JavaScript Moderno
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elementos de Autenticação
  const loginSection = document.getElementById("loginSection");
  const dashboardSection = document.getElementById("dashboardSection");
  const authActions = document.getElementById("authActions");
  const navBadge = document.getElementById("navBadge");
  const loggedUser = document.getElementById("loggedUser");
  const formLogin = document.getElementById("formLogin");
  const loginUsuario = document.getElementById("loginUsuario");
  const loginSenha = document.getElementById("loginSenha");
  const btnLogin = document.getElementById("btnLogin");
  const loginBtnText = document.getElementById("loginBtnText");
  const loginSpinner = document.getElementById("loginSpinner");
  const loginError = document.getElementById("loginError");
  const btnLogout = document.getElementById("btnLogout");

  // Elementos do Dashboard
  const kpiTotal = document.getElementById("kpiTotal");
  const kpiCriticos = document.getElementById("kpiCriticos");
  const kpiPositivos = document.getElementById("kpiPositivos");
  const kpiNeutros = document.getElementById("kpiNeutros");
  const kpiResolucao = document.getElementById("kpiResolucao");

  const tagEntregaCount = document.getElementById("tagEntregaCount");
  const tagSaborCount = document.getElementById("tagSaborCount");
  const tagAtendimentoCount = document.getElementById("tagAtendimentoCount");

  const filterSentimento = document.getElementById("filterSentimento");
  const filterTag = document.getElementById("filterTag");
  const filterStatus = document.getElementById("filterStatus");
  const filterBusca = document.getElementById("filterBusca");
  const btnLimparFiltros = document.getElementById("btnLimparFiltros");
  const btnTestAlert = document.getElementById("btnTestAlert");

  const feedbacksContainer = document.getElementById("feedbacksContainer");
  const feedbackCountLabel = document.getElementById("feedbackCountLabel");

  const CHAVE_STORAGE = "gerente_auth_token";

  // Obter token salvo na sessão
  function obterToken() {
    return sessionStorage.getItem(CHAVE_STORAGE);
  }

  // Configuração global de headers autenticados
  function headersAutenticados() {
    const token = obterToken();
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  // Alternância de Telas: Login vs Dashboard
  function alternarTela(autenticado, usuario = "gerente") {
    if (autenticado) {
      loginSection.style.display = "none";
      dashboardSection.style.display = "block";
      authActions.style.display = "flex";
      navBadge.textContent = "Gerente Autenticado";
      navBadge.style.background = "rgba(16, 185, 129, 0.2)";
      navBadge.style.color = "#34d399";
      loggedUser.textContent = usuario;

      // Carrega dados protegidos
      carregarMetricas();
      carregarFeedbacks();
    } else {
      sessionStorage.removeItem(CHAVE_STORAGE);
      loginSection.style.display = "flex";
      dashboardSection.style.display = "none";
      authActions.style.display = "none";
      navBadge.textContent = "Área Restrita";
      navBadge.style.background = "rgba(245, 158, 11, 0.25)";
      navBadge.style.color = "#f59e0b";
    }
  }

  // Verificação inicial de sessão ao carregar a página
  async function verificarSessaoInicial() {
    const token = obterToken();
    if (!token) {
      alternarTela(false);
      return;
    }

    try {
      const resp = await fetch("/api/auth/verify", {
        headers: headersAutenticados()
      });
      if (resp.ok) {
        const data = await resp.json();
        alternarTela(true, data.usuario || "gerente");
      } else {
        alternarTela(false);
      }
    } catch {
      alternarTela(false);
    }
  }

  // Submissão do Formulário de Login
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = loginUsuario.value.trim();
    const senha = loginSenha.value.trim();

    loginError.style.display = "none";
    btnLogin.disabled = true;
    loginBtnText.textContent = "Autenticando...";
    loginSpinner.style.display = "inline-block";

    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha })
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.detail || "Erro ao realizar login.");
      }

      // Salva token seguro na sessão
      sessionStorage.setItem(CHAVE_STORAGE, data.token);
      alternarTela(true, data.usuario);

    } catch (err) {
      loginError.textContent = err.message;
      loginError.style.display = "block";
    } finally {
      btnLogin.disabled = false;
      loginBtnText.textContent = "Entrar no Painel";
      loginSpinner.style.display = "none";
    }
  });

  // Logout Seguro
  btnLogout.addEventListener("click", async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: headersAutenticados()
      });
    } catch (e) {
      console.warn("Erro ao notificar logout no servidor:", e);
    } finally {
      alternarTela(false);
    }
  });

  // Ouvintes de filtros
  filterSentimento.addEventListener("change", carregarFeedbacks);
  filterTag.addEventListener("change", carregarFeedbacks);
  filterStatus.addEventListener("change", carregarFeedbacks);

  let timeoutBusca = null;
  filterBusca.addEventListener("input", () => {
    clearTimeout(timeoutBusca);
    timeoutBusca = setTimeout(carregarFeedbacks, 300);
  });

  btnLimparFiltros.addEventListener("click", () => {
    filterSentimento.value = "";
    filterTag.value = "";
    filterStatus.value = "";
    filterBusca.value = "";
    carregarFeedbacks();
  });

  // Botão de Teste de Alerta Crítico (Protegido)
  btnTestAlert.addEventListener("click", async () => {
    btnTestAlert.disabled = true;
    btnTestAlert.textContent = "Disparando...";
    try {
      const resp = await fetch("/api/test-alert", {
        method: "POST",
        headers: headersAutenticados()
      });
      if (resp.status === 401) {
        alternarTela(false);
        return;
      }
      const data = await resp.json();
      alert("Disparo de contingência testado com sucesso!\nResultado: " + JSON.stringify(data.resultado, null, 2));
    } catch (e) {
      alert("Falha ao testar disparo: " + e.message);
    } finally {
      btnTestAlert.disabled = false;
      btnTestAlert.textContent = "🔔 Testar Alerta";
    }
  });

  // Carregar Métricas Consolidadas (Protegido)
  async function carregarMetricas() {
    try {
      const resp = await fetch("/api/metrics", {
        headers: headersAutenticados()
      });
      if (resp.status === 401) {
        alternarTela(false);
        return;
      }
      if (!resp.ok) return;
      const m = await resp.json();

      kpiTotal.textContent = m.total || 0;
      kpiCriticos.textContent = m.criticos || 0;
      kpiPositivos.textContent = m.positivos || 0;
      kpiNeutros.textContent = m.neutros || 0;
      kpiResolucao.textContent = (m.taxa_resolucao_pct || 0) + "%";

      if (m.tags) {
        if (tagEntregaCount) tagEntregaCount.textContent = m.tags.Entrega || 0;
        if (tagSaborCount) tagSaborCount.textContent = m.tags.Sabor || 0;
        if (tagAtendimentoCount) tagAtendimentoCount.textContent = m.tags.Atendimento || 0;
      }
    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
    }
  }

  // Carregar Lista de Feedbacks Estruturados (Protegido)
  async function carregarFeedbacks() {
    feedbacksContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #94a3b8;">
        <span class="spinner" style="border-top-color: #f59e0b; width: 24px; height: 24px; margin-bottom: 12px;"></span>
        <p>Carregando avaliações estruturadas...</p>
      </div>
    `;

    const params = new URLSearchParams();
    if (filterSentimento.value) params.append("sentimento", filterSentimento.value);
    if (filterTag.value) params.append("tag", filterTag.value);
    if (filterStatus.value) params.append("status", filterStatus.value);
    if (filterBusca.value.trim()) params.append("busca", filterBusca.value.trim());

    try {
      const resp = await fetch(`/api/feedbacks?${params.toString()}`, {
        headers: headersAutenticados()
      });

      if (resp.status === 401) {
        alternarTela(false);
        return;
      }

      if (!resp.ok) throw new Error("Erro ao buscar dados.");
      const feedbacks = await resp.json();

      feedbackCountLabel.textContent = `${feedbacks.length} avaliações encontradas`;

      if (feedbacks.length === 0) {
        feedbacksContainer.innerHTML = `
          <div style="text-align: center; padding: 60px 20px; background: rgba(17, 24, 39, 0.5); border-radius: 16px; border: 1px dashed rgba(255, 255, 255, 0.1);">
            <span style="font-size: 36px; display: block; margin-bottom: 12px;">🔍</span>
            <h3 style="font-size: 18px; margin-bottom: 6px;">Nenhum feedback corresponde aos filtros.</h3>
            <p style="color: #94a3b8; font-size: 14px;">Tente alterar os termos da busca ou limpar os filtros.</p>
          </div>
        `;
        return;
      }

      feedbacksContainer.innerHTML = "";
      feedbacks.forEach(fb => {
        feedbacksContainer.appendChild(criarCardFeedback(fb));
      });

    } catch (err) {
      feedbacksContainer.innerHTML = `
        <div style="padding: 20px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; color: #f87171; text-align: center;">
          Erro ao carregar feedbacks: ${err.message}
        </div>
      `;
    }
  }

  // Montagem do Card de Feedback com Badges e Ações
  function criarCardFeedback(fb) {
    const card = document.createElement("div");
    const isCritico = fb.sentimento === "Crítico";
    const isTratado = fb.status === "tratado";

    card.className = `feedback-item-card ${isCritico ? "is-critical" : ""} ${isTratado ? "is-treated" : ""}`;
    card.id = `card_${fb.id}`;

    let badgeClass = "badge-neutro";
    if (fb.sentimento === "Positivo") badgeClass = "badge-positivo";
    if (fb.sentimento === "Crítico") badgeClass = "badge-critico";

    const tagsHtml = (fb.tags || []).map(t => `<span class="badge-tag">#${t}</span>`).join(" ");
    
    // Suporte às 3 categorias avaliadas
    const notaLanche = fb.nota_lanche || fb.nota_satisfacao || 5;
    const notaEntrega = fb.nota_entrega || fb.nota_satisfacao || 5;
    const notaAtendimento = fb.nota_atendimento || fb.nota_satisfacao || 5;
    const notaMedia = fb.nota_media || ((notaLanche + notaEntrega + notaAtendimento) / 3).toFixed(1);

    const estrelasMediaHtml = "★".repeat(Math.round(notaMedia)) + "☆".repeat(5 - Math.round(notaMedia));
    const dataFormatada = fb.criado_em ? new Date(fb.criado_em).toLocaleString("pt-BR") : "Data não disponível";

    card.innerHTML = `
      <div class="feedback-header">
        <div class="customer-info">
          <div class="customer-avatar">${(fb.cliente_nome || "C")[0].toUpperCase()}</div>
          <div class="customer-meta">
            <h4>${fb.cliente_nome || "Cliente"}</h4>
            <p>
              ${fb.numero_pedido ? `<strong style="color: #60a5fa; background: rgba(59, 130, 246, 0.15); padding: 1px 6px; border-radius: 4px;">🏷️ Pedido: ${fb.numero_pedido}</strong> • ` : ""}
              ${fb.cliente_contato ? `📞 ${fb.cliente_contato} • ` : ""}
              ${dataFormatada}
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="text-align: right;">
            <div style="color: #fbbf24; font-size: 16px; letter-spacing: 1px;">${estrelasMediaHtml}</div>
            <small style="color: #94a3b8; font-size: 11px;">Média: <strong>${notaMedia}★</strong></small>
          </div>
          <span class="badge-sentiment ${badgeClass}">${fb.sentimento}</span>
        </div>
      </div>

      <!-- Detalhamento das 3 Categorias Avaliadas -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin: 10px 0 14px; background: rgba(15, 23, 42, 0.4); padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.04);">
        <div style="font-size: 12px; color: #cbd5e1;">
          🍔 <strong>Lanche:</strong> <span style="color: #fbbf24;">${"★".repeat(notaLanche)}${"☆".repeat(5 - notaLanche)}</span> (${notaLanche}/5)
        </div>
        <div style="font-size: 12px; color: #cbd5e1;">
          🚚 <strong>Entrega:</strong> <span style="color: #fbbf24;">${"★".repeat(notaEntrega)}${"☆".repeat(5 - notaEntrega)}</span> (${notaEntrega}/5)
        </div>
        <div style="font-size: 12px; color: #cbd5e1;">
          🤝 <strong>Atendimento:</strong> <span style="color: #fbbf24;">${"★".repeat(notaAtendimento)}${"☆".repeat(5 - notaAtendimento)}</span> (${notaAtendimento}/5)
        </div>
      </div>

      <div class="review-body" style="font-size: 14px; color: #f8fafc; margin-bottom: 14px;">
        <strong style="color: #94a3b8; font-size: 12px; display: block; margin-bottom: 4px;">Sua Avaliação:</strong>
        "${fb.comentario}"
      </div>

      <div class="ai-analysis-box">
        <div class="ai-summary">
          🤖 <strong>Resumo da IA:</strong> ${fb.resumo || "Não disponível"}
        </div>
        <div class="ai-reason">
          💡 <strong>Justificativa Técnica:</strong> ${fb.justificativa || "Sem observações adicionais."}
        </div>
        <div style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div>${tagsHtml}</div>
          ${fb.alerta_disparado ? `
            <span style="font-size: 11px; background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 2px 8px; border-radius: 4px; font-weight: 600;">
              🚨 Alerta Crítico Disparado
            </span>
          ` : ""}
        </div>
      </div>

      ${fb.notas_gerente ? `
        <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; padding: 8px 12px; font-size: 12px; color: #a7f3d0; border-radius: 0 6px 6px 0; margin-top: 10px;">
          📝 <strong>Resolução do Gerente:</strong> ${fb.notas_gerente}
        </div>
      ` : ""}

      <div class="feedback-footer-action" style="margin-top: 14px;">
        <label class="toggle-treated">
          <input type="checkbox" ${isTratado ? "checked" : ""} data-id="${fb.id}" class="chk-status">
          <span style="color: ${isTratado ? '#10b981' : '#94a3b8'}; font-size: 13px;">
            ${isTratado ? "✅ Tratado e Verificado" : "⏳ Pendente de Tratativa"}
          </span>
        </label>

        <button class="nav-btn nav-btn-secondary btn-nota" style="padding: 4px 10px; font-size: 12px;" data-id="${fb.id}">
          ✏️ Adicionar Observação
        </button>
      </div>
    `;

    // Evento do Checkbox de Tratativa
    const chk = card.querySelector(".chk-status");
    chk.addEventListener("change", async (e) => {
      const novoStatus = e.target.checked ? "tratado" : "pendente";
      await atualizarStatus(fb.id, novoStatus);
    });

    // Evento de Adicionar Nota do Gerente
    const btnNota = card.querySelector(".btn-nota");
    btnNota.addEventListener("click", async () => {
      const nota = prompt("Digite as notas ou ações de resolução para este caso:", fb.notas_gerente || "");
      if (nota !== null) {
        await atualizarStatus(fb.id, chk.checked ? "tratado" : "pendente", nota);
      }
    });

    return card;
  }

  // Atualizar Status via API REST PATCH (Protegido)
  async function atualizarStatus(id, status, notas = null) {
    try {
      const body = { status };
      if (notas !== null) body.notas_gerente = notas;

      const resp = await fetch(`/api/feedbacks/${id}`, {
        method: "PATCH",
        headers: headersAutenticados(),
        body: JSON.stringify(body)
      });

      if (resp.status === 401) {
        alternarTela(false);
        return;
      }

      if (!resp.ok) throw new Error("Erro ao atualizar status.");

      // Recarrega lista e métricas
      carregarMetricas();
      carregarFeedbacks();
    } catch (err) {
      alert("Falha na atualização: " + err.message);
    }
  }

  // Inicializa verificação de sessão
  verificarSessaoInicial();
});
