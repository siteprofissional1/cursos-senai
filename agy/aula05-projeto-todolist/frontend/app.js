/**
 * Smart To-Do List - Lógica da Interface Web (Client Logic)
 * Conecta o Frontend à API FastAPI para triagem com Gemini e persistência local.
 */

const DEMO_TASKS = "responder e-mail da faculdade, consertar vazamento urgente da pia da cozinha, comprar pão na padaria, finalizar relatório trimestral para o diretor às 15h, levar o cachorro para passear";

let currentTasks = [];
let activeFilter = 'all';

// Elementos do DOM
const taskInput = document.getElementById('taskInput');
const btnOrganize = document.getElementById('btnOrganize');
const btnDemo = document.getElementById('btnDemo');
const btnClear = document.getElementById('btnClear');
const tasksList = document.getElementById('tasksList');
const filterPills = document.getElementById('filterPills');
const emailAlertBanner = document.getElementById('emailAlertBanner');
const emailAlertText = document.getElementById('emailAlertText');

// Métricas
const valTotalTempo = document.getElementById('valTotalTempo');
const valCriticas = document.getElementById('valCriticas');
const valTotalTarefas = document.getElementById('valTotalTarefas');
const valDica = document.getElementById('valDica');

function formatarTempo(minutos) {
  minutos = parseInt(minutos, 10) || 0;
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const minsRestantes = minutos % 60;
    return minsRestantes > 0 ? `${horas}h ${minsRestantes}min` : `${horas}h`;
  }
  return `${minutos} min`;
}

function atualizarMetricas(tasks) {
  const totalMinutos = tasks.reduce((acc, t) => acc + (parseInt(t.tempo_estimado_minutos, 10) || 0), 0);
  const totalCriticas = tasks.filter(t => t.prioridade === 'Crítica').length;

  valTotalTempo.textContent = formatarTempo(totalMinutos);
  valCriticas.textContent = totalCriticas;
  valTotalTarefas.textContent = tasks.length;

  if (totalCriticas > 0) {
    valDica.textContent = "🚨 Comece imediatamente pela Tarefa #01 (Prioridade Crítica) para mitigar riscos graves hoje!";
  } else if (tasks.length > 0) {
    valDica.textContent = "💡 Agenda equilibrada! Programe blocos Pomodoro de 25 a 50 minutos de dedicação focada.";
  } else {
    valDica.textContent = "Nenhuma tarefa cadastrada. Digite seus afazeres acima para receber uma estratégia diária.";
  }
}

function renderizarTarefas() {
  if (!currentTasks || currentTasks.length === 0) {
    tasksList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <p>Nenhuma tarefa no momento. Insira seus afazeres acima e clique em <strong>Triar & Organizar com IA</strong>.</p>
      </div>
    `;
    return;
  }

  const filtered = activeFilter === 'all' 
    ? currentTasks 
    : currentTasks.filter(t => t.prioridade === activeFilter);

  if (filtered.length === 0) {
    tasksList.innerHTML = `
      <div class="empty-state">
        <p>Nenhuma tarefa encontrada para a prioridade <strong>${activeFilter}</strong>.</p>
      </div>
    `;
    return;
  }

  tasksList.innerHTML = filtered.map((tarefa, idx) => {
    const prioridadeClass = (tarefa.prioridade || 'media').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const tempoFmt = formatarTempo(tarefa.tempo_estimado_minutos);
    const ordem = String(idx + 1).padStart(2, '0');

    return `
      <div class="task-item" id="task-${idx}">
        <input type="checkbox" class="task-check" onchange="toggleTask(${idx})" aria-label="Marcar como concluída">
        <div class="task-order-pill">#${ordem}</div>
        <div class="task-content">
          <div class="task-title-row">
            <span class="task-title">${tarefa.titulo}</span>
            <span class="badge-priority ${prioridadeClass}">${tarefa.prioridade}</span>
          </div>
          <p class="task-justification">💡 ${tarefa.justificativa}</p>
        </div>
        <div class="task-time-badge">⏱️ ${tempoFmt}</div>
      </div>
    `;
  }).join('');
}

window.toggleTask = function(index) {
  const item = document.getElementById(`task-${index}`);
  if (item) {
    item.classList.toggle('completed');
  }
};

async function carregarTarefasSalvas() {
  try {
    const res = await fetch('/api/tasks');
    if (res.ok) {
      const data = await res.json();
      currentTasks = data.tasks || [];
      atualizarMetricas(currentTasks);
      renderizarTarefas();
    }
  } catch (err) {
    console.warn("Não foi possível carregar tarefas iniciais:", err);
  }
}

async function organizarTarefas() {
  const texto = taskInput.value.trim();
  if (!texto) {
    alert("Por favor, digite ou cole sua lista de afazeres antes de organizar.");
    taskInput.focus();
    return;
  }

  btnOrganize.disabled = true;
  btnOrganize.classList.add('loading');
  emailAlertBanner.classList.add('hidden');

  try {
    const response = await fetch('/api/organize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texto })
    });

    if (!response.ok) {
      const erroData = await response.json();
      throw new Error(erroData.detail || "Erro ao processar tarefas na IA");
    }

    const data = await response.json();
    currentTasks = data.tasks || [];
    atualizarMetricas(currentTasks);
    renderizarTarefas();

    if (data.email_enviado) {
      emailAlertText.textContent = data.mensagem_email || "E-mail de alerta de tarefas críticas enviado com sucesso ao gestor!";
      emailAlertBanner.classList.remove('hidden');
    }
  } catch (err) {
    alert(`Erro ao organizar: ${err.message}`);
  } finally {
    btnOrganize.disabled = false;
    btnOrganize.classList.remove('loading');
  }
}

// Event Listeners
btnDemo.addEventListener('click', () => {
  taskInput.value = DEMO_TASKS;
});

btnClear.addEventListener('click', () => {
  taskInput.value = '';
  taskInput.focus();
});

btnOrganize.addEventListener('click', organizarTarefas);

filterPills.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-pill')) {
    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    activeFilter = e.target.getAttribute('data-filter');
    renderizarTarefas();
  }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarTarefasSalvas();
});
