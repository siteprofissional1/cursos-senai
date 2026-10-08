/**
 * ====================================================================
 * Frontend Cliente - Hamburgueria do Joselito
 * Experiência do Cliente & Ingestão Instantânea de Feedbacks
 * Desenvolvido com: Google Antigravity & JavaScript Moderno
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elementos do formulário
  const form = document.getElementById("feedbackForm");
  const inputNome = document.getElementById("clienteNome");
  const inputPedido = document.getElementById("numeroPedido");
  const inputContato = document.getElementById("clienteContato");
  const inputComentario = document.getElementById("clienteComentario");

  const btnSubmit = document.getElementById("btnSubmit");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");

  // Elementos do card de sucesso instantâneo
  const successCard = document.getElementById("successCard");
  const successMessage = document.getElementById("successMessage");
  const btnNovoFeedback = document.getElementById("btnNovoFeedback");

  // Estrutura de notas para as 3 categorias obrigatórias
  const notas = {
    lanche: 0,
    entrega: 0,
    atendimento: 0
  };

  // Rótulos amigáveis para as notas
  const rotulosNotas = {
    1: "1 ★ - Muito Ruim",
    2: "2 ★ - Ruim",
    3: "3 ★ - Regular",
    4: "4 ★ - Muito Bom",
    5: "5 ★ - Excelente"
  };

  // Inicialização das 3 categorias de estrelas
  const categorias = ["lanche", "entrega", "atendimento"];

  categorias.forEach((cat) => {
    const grupo = document.querySelector(`.star-rating-group[data-category="${cat}"]`);
    const badge = document.getElementById(`score${capitalizar(cat)}`);
    const hiddenInput = document.getElementById(`nota${capitalizar(cat)}`);
    const containerItem = document.getElementById(`group${capitalizar(cat)}`);

    if (!grupo) return;

    const botoes = grupo.querySelectorAll(".star-btn");

    botoes.forEach((btn) => {
      const val = parseInt(btn.getAttribute("data-val"), 10);

      // Ao passar o cursor por cima, pré-visualiza a nota
      btn.addEventListener("mouseenter", () => {
        destacarEstrelas(botoes, val);
      });

      // Ao clicar, fixa a nota selecionada
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        notas[cat] = val;
        hiddenInput.value = val;
        destacarEstrelas(botoes, val);

        // Atualiza o badge descritivo
        if (badge) {
          badge.textContent = rotulosNotas[val] || `${val} Estrelas`;
          badge.classList.add("active");
        }

        if (containerItem) {
          containerItem.classList.remove("has-error");
          containerItem.classList.add("selected");
        }
      });
    });

    // Quando o mouse sai do grupo, restaura a nota atualmente fixada
    grupo.addEventListener("mouseleave", () => {
      destacarEstrelas(botoes, notas[cat]);
    });
  });

  /**
   * Helper para iluminar as estrelas até o valor selecionado
   */
  function destacarEstrelas(botoes, valor) {
    botoes.forEach((btn) => {
      const v = parseInt(btn.getAttribute("data-val"), 10);
      if (v <= valor) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Submissão do Formulário para a API da Hamburgueria do Joselito
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = inputNome.value.trim();
    const pedido = inputPedido.value.trim();
    const contato = inputContato.value.trim();
    const comentario = inputComentario.value.trim();

    // 1. Validação de Nome Obrigatório
    if (!nome) {
      alert("Por favor, preencha o seu nome.");
      inputNome.focus();
      return;
    }

    // 2. Validação Obrigatória das 3 Categorias de Avaliação
    let erroCategoria = false;
    categorias.forEach((cat) => {
      const containerItem = document.getElementById(`group${capitalizar(cat)}`);
      if (notas[cat] === 0) {
        erroCategoria = true;
        if (containerItem) {
          containerItem.classList.add("has-error");
        }
      } else {
        if (containerItem) {
          containerItem.classList.remove("has-error");
        }
      }
    });

    if (erroCategoria) {
      alert("Por favor, avalie todas as 3 categorias com estrelas: O Lanche, A Entrega e O Atendimento.");
      return;
    }

    // 3. Validação do Comentário em Texto
    if (!comentario || comentario.length < 2) {
      alert("Por favor, deixe sua avaliação com pelo menos algumas palavras.");
      inputComentario.focus();
      return;
    }

    // Feedback visual imediato de envio
    btnSubmit.disabled = true;
    btnText.textContent = "Enviando...";
    btnSpinner.style.display = "inline-block";

    const payload = {
      cliente_nome: nome,
      numero_pedido: pedido,
      cliente_contato: contato,
      nota_lanche: notas.lanche,
      nota_entrega: notas.entrega,
      nota_atendimento: notas.atendimento,
      comentario: comentario
    };

    try {
      // Envio HTTP instantâneo
      const resposta = await fetch("/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.detail || "Não foi possível registrar sua avaliação.");
      }

      // SUCESSO IMEDIATO: O cliente recebe confirmação direta sem telas de espera ou jargões técnicos de IA
      form.style.display = "none";
      successCard.style.display = "flex";

      if (successMessage) {
        successMessage.textContent = `Muito obrigado pela sua opinião, ${nome}! Seu feedback já foi entregue diretamente à nossa equipe para continuarmos aprimorando cada detalhe da Hamburgueria do Joselito.`;
      }

      successCard.scrollIntoView({ behavior: "smooth", block: "center" });

      // Reseta os campos do formulário para eventual novo envio
      form.reset();
      categorias.forEach((cat) => {
        notas[cat] = 0;
        const hiddenInput = document.getElementById(`nota${capitalizar(cat)}`);
        const badge = document.getElementById(`score${capitalizar(cat)}`);
        const grupo = document.querySelector(`.star-rating-group[data-category="${cat}"]`);
        const containerItem = document.getElementById(`group${capitalizar(cat)}`);

        if (hiddenInput) hiddenInput.value = "0";
        if (badge) {
          badge.textContent = "Não avaliado";
          badge.classList.remove("active");
        }
        if (grupo) {
          const botoes = grupo.querySelectorAll(".star-btn");
          destacarEstrelas(botoes, 0);
        }
        if (containerItem) {
          containerItem.classList.remove("selected", "has-error");
        }
      });

    } catch (erro) {
      console.error("Erro no envio:", erro);
      alert("Houve uma falha momentânea ao enviar sua avaliação. Por favor, tente novamente.");
    } finally {
      btnSubmit.disabled = false;
      btnText.textContent = "Enviar Avaliação";
      btnSpinner.style.display = "none";
    }
  });

  // Botão para registrar outra avaliação se o cliente desejar
  if (btnNovoFeedback) {
    btnNovoFeedback.addEventListener("click", () => {
      successCard.style.display = "none";
      form.style.display = "block";
      inputNome.focus();
    });
  }
});
