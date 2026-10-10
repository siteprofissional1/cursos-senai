/**
 * Jogo 3: Roleta VIP Europeia do Joselito
 * Sistema Probabilístico com Motor de Bloco Controlado (1 Vitória a cada 15 Jogadas)
 * Todos os códigos comentados em português facilitando análise e manutenção.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM da Roleta
  const canvas = document.getElementById('rouletteCanvas');
  const ctx = canvas.getContext('2d');
  const optionButtons = document.querySelectorAll('.btn-roulette-option');
  const chosenBetLabel = document.getElementById('chosenBetLabel');
  const betInput = document.getElementById('betRouletteInput');
  const chipButtons = document.querySelectorAll('.chip-btn');
  const btnSpin = document.getElementById('btnSpinRoulette');
  const resultBanner = document.getElementById('resultBanner');
  const historyRibbon = document.getElementById('rouletteHistory');

  // Configuração oficial dos 37 setores da Roleta Europeia (0 a 36)
  const ROULETTE_NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  // Números Vermelhos oficiais da Roleta Europeia
  const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

  /**
   * Determina a cor de um número na roleta
   * @param {number} num 
   * @returns {'green' | 'red' | 'black'}
   */
  function getNumberColor(num) {
    if (num === 0) return 'green';
    return RED_NUMBERS.includes(num) ? 'red' : 'black';
  }

  // Estado da Roleta
  let selectedBetType = null; // 'red', 'black', 'green', 'even', 'odd', 'low', 'high'
  let isSpinning = false;
  let currentAngle = 0; // Ângulo atual do disco em radianos
  const numSlices = ROULETTE_NUMBERS.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  // Dicionário de títulos amigáveis para as apostas
  const BET_DESCRIPTIONS = {
    red: '🔴 Vermelho (Paga 2.00x)',
    black: '⚫ Preto (Paga 2.00x)',
    green: '🟢 Zero da Casa (Paga 14.00x)',
    even: '🎯 Par / Even (Paga 2.00x)',
    odd: '🎯 Ímpar / Odd (Paga 2.00x)',
    low: '📉 1 a 18 Baixo (Paga 2.00x)',
    high: '📈 19 a 36 Alto (Paga 2.00x)'
  };

  // Seleção do tipo de aposta na mesa
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isSpinning) return;
      optionButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedBetType = btn.getAttribute('data-type');

      chosenBetLabel.textContent = `Aposta: ${BET_DESCRIPTIONS[selectedBetType] || selectedBetType}`;
      if (window.joselitoAudio) window.joselitoAudio.playTick();
    });
  });

  // Fichas de aposta rápida
  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      if (isSpinning) return;
      betInput.value = chip.getAttribute('data-val');
      if (window.joselitoAudio) window.joselitoAudio.playTick();
    });
  });

  /**
   * Renderiza a roda da roleta no Canvas com visual VIP dourado e setores numerados
   * @param {number} angleOffset Ângulo de rotação em radianos
   */
  function drawRouletteWheel(angleOffset = 0) {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 8;

    ctx.clearRect(0, 0, width, height);

    // Desenha cada um dos 37 setores
    for (let i = 0; i < numSlices; i++) {
      const num = ROULETTE_NUMBERS[i];
      const colorType = getNumberColor(num);
      const startAngle = angleOffset + (i * sliceAngle);
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Cores realistas de cassino VIP
      if (colorType === 'green') {
        ctx.fillStyle = '#059669'; // Verde esmeralda para o zero
      } else if (colorType === 'red') {
        ctx.fillStyle = '#dc2626'; // Vermelho rubi vibrante
      } else {
        ctx.fillStyle = '#111827'; // Preto profundo
      }
      ctx.fill();

      // Separadores metálicos dourados entre os setores
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Número do setor centralizado
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText(num.toString(), radius - 12, 4);
      ctx.restore();
    }

    // Moldura externa da roleta em gradiente dourado
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Friso interno dourado
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 24, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Renderização inicial da roleta
  drawRouletteWheel(currentAngle);

  /**
   * Verifica se um número atende à aposta realizada pelo jogador
   * @param {number} num 
   * @param {string} betType 
   * @returns {boolean}
   */
  function isWinningNumber(num, betType) {
    if (betType === 'red') return getNumberColor(num) === 'red';
    if (betType === 'black') return getNumberColor(num) === 'black';
    if (betType === 'green') return num === 0;
    if (betType === 'even') return num > 0 && num % 2 === 0;
    if (betType === 'odd') return num > 0 && num % 2 !== 0;
    if (betType === 'low') return num >= 1 && num <= 18;
    if (betType === 'high') return num >= 19 && num <= 36;
    return false;
  }

  /**
   * Seleciona o número-alvo do sorteio integrando com o Motor RNG de Bloco de 15 Jogadas.
   * - Em 14 das 15 rodadas: a casa ganha (força número perdedor).
   * - Em exatamente 1 das 15 rodadas: o jogador ganha (seleciona número que atende à aposta).
   * @param {string} userBetType 
   * @returns {{ number: number, index: number, color: string, didWin: boolean }}
   */
  function selectTargetResult(userBetType) {
    // Consulta o motor de 1 vitória a cada 15 jogadas
    const rngEval = window.joselitoRNG ? window.joselitoRNG.evaluateNextRound('roleta') : { isWinRound: false };
    const allowWin = rngEval.isWinRound;

    let candidateNumbers = [];

    if (allowWin) {
      // Rodada de vitória controlada: seleciona números que pagam a aposta
      candidateNumbers = ROULETTE_NUMBERS.filter(n => isWinningNumber(n, userBetType));
      // Fallback de segurança se não houver candidatos
      if (candidateNumbers.length === 0) candidateNumbers = [userBetType === 'green' ? 0 : 32];
    } else {
      // Rodada de lucro da banca: seleciona números onde o usuário perde
      candidateNumbers = ROULETTE_NUMBERS.filter(n => !isWinningNumber(n, userBetType));

      // Em 15% das perdas, se a aposta for externa, força o Zero Verde da banca
      if (userBetType !== 'green' && Math.random() < 0.15) {
        candidateNumbers = [0];
      }
    }

    // Sorteia aleatoriamente entre os candidatos elegíveis
    const chosenNum = candidateNumbers[Math.floor(Math.random() * candidateNumbers.length)];
    const chosenIndex = ROULETTE_NUMBERS.indexOf(chosenNum);
    const didWin = isWinningNumber(chosenNum, userBetType);

    return {
      number: chosenNum,
      index: chosenIndex,
      color: getNumberColor(chosenNum),
      didWin: didWin
    };
  }

  /**
   * Adiciona o novo número sorteado à fita de histórico da mesa
   * @param {number} num 
   * @param {'green' | 'red' | 'black'} color 
   */
  function addNumberToHistory(num, color) {
    if (!historyRibbon) return;

    const pill = document.createElement('span');
    pill.className = `history-pill pill-roulette-${color}`;
    const icon = color === 'red' ? '🔴' : color === 'black' ? '⚫' : '🟢';
    pill.textContent = `${icon} ${num}`;

    // Insere no início da fita
    historyRibbon.insertBefore(pill, historyRibbon.firstChild);

    // Mantém no máximo 14 registros recentes
    while (historyRibbon.children.length > 14) {
      historyRibbon.removeChild(historyRibbon.lastChild);
    }
  }

  // Ação de Girar a Roleta VIP
  btnSpin.addEventListener('click', () => {
    if (isSpinning) return;

    if (!selectedBetType) {
      alert('Selecione uma opção de aposta na mesa antes de girar!');
      return;
    }

    const betAmount = parseFloat(betInput.value);
    if (isNaN(betAmount) || betAmount <= 0) {
      alert('Digite um valor de aposta válido!');
      return;
    }

    // Debita o saldo da carteira do jogador
    if (!window.joselitoWallet.charge(betAmount)) {
      alert('Saldo insuficiente! Adicione créditos para continuar.');
      const depositModal = document.getElementById('depositModal');
      if (depositModal) depositModal.classList.add('active');
      return;
    }

    isSpinning = true;
    btnSpin.disabled = true;
    resultBanner.textContent = 'A roleta VIP está em movimento... Boa sorte!';

    // Determina o resultado com base no motor de probabilidade
    const target = selectTargetResult(selectedBetType);

    /* O ponteiro dourado fixo fica no topo central: ângulo 3*PI/2 (270 graus).
       Calculamos o ângulo exato para que o centro do setor target pare sob o ponteiro. */
    const pointerAngle = (3 * Math.PI) / 2;
    const targetSliceCenter = (target.index * sliceAngle) + (sliceAngle / 2);

    // Giro realista: 6 a 9 rotações completas de suspense
    const extraRotations = (6 + Math.floor(Math.random() * 3)) * (2 * Math.PI);
    const finalAngle = currentAngle + extraRotations + (pointerAngle - (currentAngle % (2 * Math.PI)) - targetSliceCenter);

    const spinDuration = 4200; // 4.2 segundos de animação imersiva
    const startTime = performance.now();
    const startAngle = currentAngle;
    let lastTickAngle = currentAngle;

    function animateSpin(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Desaceleração física ultra suave (Ease-Out Quartic)
      const easeOut = 1 - Math.pow(1 - progress, 4);
      currentAngle = startAngle + (finalAngle - startAngle) * easeOut;

      // Efeito sonoro a cada setor metálico percorrido
      if (Math.abs(currentAngle - lastTickAngle) >= sliceAngle) {
        if (window.joselitoAudio) window.joselitoAudio.playTick();
        lastTickAngle = currentAngle;
      }

      drawRouletteWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        // Giro finalizado
        isSpinning = false;
        btnSpin.disabled = false;

        // Atualiza a fita de histórico com o resultado oficial
        addNumberToHistory(target.number, target.color);

        // Avança o ciclo controlado de 15 rodadas
        if (window.joselitoRNG) {
          window.joselitoRNG.advanceCycle('roleta');
        }

        const colorPt = { red: 'Vermelho', black: 'Preto', green: 'Zero Verde (Casa)' };

        if (target.didWin) {
          // Multiplicador: Zero Verde paga 14x, outras opções pagam 2x
          const multiplier = (selectedBetType === 'green') ? 14 : 2;
          const prize = betAmount * multiplier;
          window.joselitoWallet.deposit(prize);

          if (window.joselitoAudio) window.joselitoAudio.playWin();

          resultBanner.innerHTML = `<span style="color: var(--accent-green); font-weight: 800;">🎉 DEU ${target.number} (${colorPt[target.color]})! Você faturou R$ ${prize.toFixed(2)} (${multiplier}x)!</span>`;

          // Dispara modal triunfal de Big Win
          if (typeof window.showBigWinCelebration === 'function') {
            window.showBigWinCelebration(prize, 'VITÓRIA NA ROLETA VIP!');
          }
        } else {
          resultBanner.innerHTML = `<span style="color: var(--accent-red); font-weight: 800;">❌ DEU ${target.number} (${colorPt[target.color]})! A banca recolheu sua aposta.</span>`;

          // Dispara modal do Joselito após breve pausa dramática
          setTimeout(() => {
            if (typeof window.showJoselitoLoss === 'function') {
              window.showJoselitoLoss(betAmount);
            }
          }, 400);
        }
      }
    }

    requestAnimationFrame(animateSpin);
  });
});
