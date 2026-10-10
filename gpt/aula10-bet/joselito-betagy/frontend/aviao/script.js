/**
 * Jogo 2: Aviãozinho Crash - Lógica do Voo e Manipulação do Ponto de Colisão
 * Demonstração Didática SENAI: A casa sempre ganha!
 * Comentários didáticos para análise de alunos.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const canvas = document.getElementById('flightCanvas');
  const ctx = canvas.getContext('2d');
  const multiplierText = document.getElementById('multiplierText');
  const flightStatus = document.getElementById('flightStatus');
  const betInput = document.getElementById('betCrashInput');
  const chipButtons = document.querySelectorAll('.chip-btn');
  const btnAction = document.getElementById('btnActionCrash');
  const btnActionText = document.getElementById('btnActionText');
  const btnActionSub = document.getElementById('btnActionSub');

  // Ajuste de DPI e tamanho do Canvas
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Estados do Jogo: 'IDLE', 'FLYING', 'CASHED_OUT', 'CRASHED'
  let gameState = 'IDLE';
  let currentMultiplier = 1.00;
  let targetCrashMultiplier = 1.00;
  let currentBet = 10;
  let animationFrameId = null;
  let startTime = 0;
  let particles = [];

  // Fichas rápidas
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (gameState !== 'IDLE') return;
      betInput.value = btn.getAttribute('data-val');
      if (window.joselitoAudio) window.joselitoAudio.playTick();
    });
  });

  /* ==========================================================================
     ALGORITMO DE MANIPULAÇÃO DO CRASH (DIDÁTICA SENAI):
     Nas plataformas de Crash, a casa gera um hash SHA-256 para o ponto de queda.
     O algoritmo é deliberadamente calibrado com "Crash Precoce" (sub-1.40x) para
     pegar a grande massa de apostadores que tenta estratégias como Martingale.
     Se a aposta do jogador for alta (> R$ 25), o algoritmo força 80% de chance
     de explodir antes de 1.25x!
     ========================================================================== */
  function calculateManipulatedCrashPoint(betAmount) {
    const isHighBet = betAmount >= 25;
    const rand = Math.random();

    if (isHighBet) {
      // 80% de chance de queda imediata se a aposta for alta
      if (rand < 0.80) {
        return 1.02 + Math.random() * 0.20; // 1.02x até 1.22x
      }
    } else {
      // Distribuição viciada padrão:
      if (rand < 0.45) {
        return 1.05 + Math.random() * 0.25; // 1.05x até 1.30x (Queda relâmpago)
      } else if (rand < 0.75) {
        return 1.31 + Math.random() * 0.35; // 1.31x até 1.66x
      } else if (rand < 0.90) {
        return 1.67 + Math.random() * 0.80; // 1.67x até 2.47x
      }
    }

    // 10% restantes: voo mais longo para criar a ilusão de oportunidade
    return 2.50 + Math.random() * 3.50;
  }

  // Cria partículas de explosão quando crasha
  function createExplosion(x, y) {
    particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        radius: Math.random() * 6 + 2,
        alpha: 1,
        color: ['#ef4444', '#f59e0b', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 4)]
      });
    }
  }

  // Desenho no Canvas
  function drawFlight(progress, crashed = false) {
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;

    ctx.clearRect(0, 0, w, h);

    // Linhas de Grade de Fundo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 30; y < h; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Posição do avião baseada no progresso da curva
    const startX = 40;
    const startY = h - 40;
    const clampedProgress = Math.min(progress, 1);

    // Curva de Bezier para subida do avião
    const currentX = startX + (w - 120) * clampedProgress;
    const currentY = startY - (h - 100) * Math.pow(clampedProgress, 1.4);

    if (clampedProgress > 0) {
      // Traço de rastro do avião (Glow Dourado/Laranja)
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(startX + (currentX - startX) * 0.4, startY, currentX, currentY);
      ctx.strokeStyle = crashed ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.9)';
      ctx.lineWidth = 4;
      ctx.shadowColor = crashed ? '#ef4444' : '#f59e0b';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Área sombreada sob a curva
      ctx.lineTo(currentX, startY);
      ctx.lineTo(startX, startY);
      const grad = ctx.createLinearGradient(0, currentY, 0, startY);
      grad.addColorStop(0, crashed ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    if (!crashed) {
      // Desenha o Aviãozinho voando
      ctx.save();
      ctx.translate(currentX, currentY);
      // Inclinação do avião
      const angle = -0.35 + (clampedProgress * -0.15);
      ctx.rotate(angle);

      // Corpo do avião
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Asa
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-6, -2);
      ctx.lineTo(-14, -18);
      ctx.lineTo(-2, -2);
      ctx.closePath();
      ctx.fill();

      // Cauda
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-26, -10);
      ctx.lineTo(-20, 0);
      ctx.closePath();
      ctx.fill();

      // Fogo da turbina (propulsão)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-22, -3);
      ctx.lineTo(-30 - Math.random() * 8, 0);
      ctx.lineTo(-22, 3);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    } else {
      // Desenha partículas de explosão
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
      });
      particles = particles.filter(p => p.alpha > 0);
    }
  }

  // Loop de Animação do Voo
  function animateFlight(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsedSec = (timestamp - startTime) / 1000;

    // Fórmula de crescimento do multiplicador exponencial
    currentMultiplier = 1.00 + Math.pow(elapsedSec * 0.75, 1.8);
    const progress = (currentMultiplier - 1.00) / 4.0; // Normaliza para a tela

    multiplierText.textContent = `${currentMultiplier.toFixed(2)}x`;

    // Atualiza botão de saque se o usuário estiver ativo
    if (gameState === 'FLYING') {
      const liveWin = currentBet * currentMultiplier;
      btnActionSub.textContent = `Receber R$ ${liveWin.toFixed(2)}`;
    }

    // Verifica se atingiu o ponto de crash
    if (currentMultiplier >= targetCrashMultiplier) {
      handleCrash();
      return;
    }

    drawFlight(progress, false);
    animationFrameId = requestAnimationFrame(animateFlight);
  }

  // Fita de histórico dinâmico de multiplicadores
  function addHistoryMultiplier(mult) {
    const historyContainer = document.getElementById('multiplierHistory');
    if (!historyContainer) return;
    const pill = document.createElement('span');
    const num = parseFloat(mult);
    if (num >= 3.0) {
      pill.className = 'history-pill pill-crash-high';
    } else if (num >= 1.5) {
      pill.className = 'history-pill pill-crash-mid';
    } else {
      pill.className = 'history-pill pill-crash-low';
    }
    pill.textContent = `${num.toFixed(2)}x`;
    historyContainer.insertBefore(pill, historyContainer.firstChild);
    if (historyContainer.children.length > 12) {
      historyContainer.removeChild(historyContainer.lastChild);
    }
  }

  // Simulação dinâmica de apostadores na mesa
  function randomizeLiveBets() {
    const grid = document.getElementById('liveBetsGrid');
    if (!grid) return;
    const names = ['Carlos_SP', 'Ana_Trader', 'BetKing99', 'Marcos_RJ', 'Pri_Gamer', 'Danilo_VIP', 'Lucas_MG'];
    const count = 3;
    let html = '';
    for (let i = 0; i < count; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const val = [10, 20, 50, 100, 250][Math.floor(Math.random() * 5)];
      html += `
        <div style="background: rgba(255,255,255,0.03); padding: 0.4rem 0.6rem; border-radius: 8px; display: flex; justify-content: space-between;">
          <span>👤 ${name}</span>
          <span style="color: #fbbf24; font-weight: 700;">R$ ${val},00</span>
        </div>
      `;
    }
    grid.innerHTML = html;
  }
  setInterval(randomizeLiveBets, 6000);

  // Manipulação de Colisão / Queda
  function handleCrash() {
    cancelAnimationFrame(animationFrameId);
    const wasCashedOut = (gameState === 'CASHED_OUT');
    gameState = 'CRASHED';

    const rect = canvas.getBoundingClientRect();
    createExplosion(rect.width * 0.65, rect.height * 0.4);

    if (window.joselitoAudio) {
      window.joselitoAudio.playCrash();
    }

    multiplierText.style.color = '#ef4444';
    multiplierText.textContent = `${targetCrashMultiplier.toFixed(2)}x`;
    flightStatus.className = 'flight-status-badge crashed';
    flightStatus.textContent = `💥 O AVIÃO EXPLODIU EM ${targetCrashMultiplier.toFixed(2)}x!`;

    // Registra na fita de histórico
    addHistoryMultiplier(targetCrashMultiplier);

    // Avança o ciclo estrito no motor RNG
    if (window.joselitoRNG) {
      window.joselitoRNG.advanceCycle('aviao');
    }

    // Reseta botão
    btnAction.disabled = false;
    btnAction.className = 'btn-action-main btn-start-bet';
    btnActionText.textContent = 'APOSTAR NOVAMENTE';
    btnActionSub.textContent = 'Decolar rumo aos lucros';

    // Anima partículas de explosão por alguns frames
    let explosionTicks = 0;
    function animateExplosion() {
      drawFlight(1, true);
      explosionTicks++;
      if (explosionTicks < 45) {
        requestAnimationFrame(animateExplosion);
      }
    }
    animateExplosion();

    // Se o usuário não sacou a tempo, dispara a zoeira do Joselito
    if (!wasCashedOut) {
      setTimeout(() => {
        window.showJoselitoLoss(currentBet);
        gameState = 'IDLE';
      }, 600);
    } else {
      setTimeout(() => {
        gameState = 'IDLE';
      }, 1000);
    }
  }

  // Clique no Botão Principal (Apostar ou Sacar)
  btnAction.addEventListener('click', () => {
    // Cenário 1: Começar a rodada
    if (gameState === 'IDLE') {
      currentBet = parseFloat(betInput.value);
      if (isNaN(currentBet) || currentBet <= 0) {
        alert('Digite um valor válido de aposta!');
        return;
      }

      if (!window.joselitoWallet.charge(currentBet)) {
        alert('Saldo insuficiente! Adicione saldo fictício para continuar.');
        const depositModal = document.getElementById('depositModal');
        if (depositModal) depositModal.classList.add('active');
        return;
      }

      // Avalia via motor central se a rodada do bloco de 15 é a vitoriosa (1 vitória em 15)
      const rngResult = window.joselitoRNG ? window.joselitoRNG.evaluateNextRound('aviao') : { isWin: false };

      if (rngResult.isWin) {
        // A rodada vitoriosa do ciclo: decola alto e permite lucro real
        targetCrashMultiplier = +(2.40 + Math.random() * 3.60).toFixed(2);
      } else {
        // As 14 rodadas da banca: colisão forçada precoce
        const r = Math.random();
        if (r < 0.50) {
          targetCrashMultiplier = +(1.02 + Math.random() * 0.12).toFixed(2); // 1.02x a 1.14x (queda relâmpago)
        } else {
          targetCrashMultiplier = +(1.15 + Math.random() * 0.18).toFixed(2); // 1.15x a 1.33x
        }
      }

      currentMultiplier = 1.00;
      startTime = 0;
      gameState = 'FLYING';

      // Atualiza interface para modo "Sacar"
      multiplierText.style.color = '#ffffff';
      multiplierText.textContent = '1.00x';
      flightStatus.className = 'flight-status-badge';
      flightStatus.textContent = '🚀 Avião no ar! Subindo...';

      btnAction.className = 'btn-action-main btn-cashout';
      btnActionText.textContent = 'SACAR AGORA';
      btnActionSub.textContent = `Receber R$ ${currentBet.toFixed(2)}`;

      animationFrameId = requestAnimationFrame(animateFlight);
      return;
    }

    // Cenário 2: Sacar a tempo (Cash Out)
    if (gameState === 'FLYING') {
      gameState = 'CASHED_OUT';
      const prize = currentBet * currentMultiplier;
      window.joselitoWallet.deposit(prize);

      flightStatus.className = 'flight-status-badge cashed';
      flightStatus.textContent = `💰 VOCÊ SACOU R$ ${prize.toFixed(2)} (${currentMultiplier.toFixed(2)}x)!`;

      btnAction.className = 'btn-action-main btn-start-bet';
      btnActionText.textContent = 'APOSTANDO...';
      btnActionSub.textContent = 'Aguardando o voo acabar';
      btnAction.disabled = true;

      // Celebração de grande vitória
      window.showBigWinCelebration(prize, '🚀 VOCÊ DECOLOU E LUCROU!');
    }
  });

  // Desenho inicial vazio
  drawFlight(0, false);
});

