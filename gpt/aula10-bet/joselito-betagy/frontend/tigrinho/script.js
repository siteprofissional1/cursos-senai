/**
 * Jogo 4: Fortune Tigrinho - Manipulação de Slots e Gatilho de "Near-Miss"
 * Demonstração Didática SENAI: A casa sempre ganha!
 * Comentários didáticos para análise de alunos.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const reelsMachine = document.getElementById('reelsMachine');
  const reel1 = document.getElementById('reel1');
  const reel2 = document.getElementById('reel2');
  const reel3 = document.getElementById('reel3');
  const reelContainer1 = document.getElementById('reelContainer1');
  const reelContainer2 = document.getElementById('reelContainer2');
  const reelContainer3 = document.getElementById('reelContainer3');
  const slotsStatus = document.getElementById('slotsStatus');
  const betInput = document.getElementById('betSlotsInput');
  const chipButtons = document.querySelectorAll('.chip-btn');
  const btnSpin = document.getElementById('btnSpinSlots');

  // Símbolos disponíveis na máquina com multiplicadores reais estilo PG Soft
  const SYMBOLS = [
    { icon: '🐯', name: 'Tigrinho Wild', mult: 250 },
    { icon: '🧧', name: 'Cartinha da Sorte', mult: 50 },
    { icon: '💰', name: 'Saco de Ouro', mult: 25 },
    { icon: '💎', name: 'Diamante', mult: 15 },
    { icon: '🪙', name: 'Moeda da Sorte', mult: 8 },
    { icon: '🍊', name: 'Laranja Imperial', mult: 5 }
  ];

  let isSpinning = false;

  // Fichas rápidas
  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      if (isSpinning) return;
      betInput.value = chip.getAttribute('data-val');
      if (window.joselitoAudio) window.joselitoAudio.playTick();
    });
  });

  // Renderiza 3 símbolos dentro de uma coluna (Linha Superior, Linha Central/Payline, Linha Inferior)
  function renderReel(container, topSym, centerSym, bottomSym) {
    container.innerHTML = `
      <div class="reel-symbol"><span>${topSym.icon}</span><span class="reel-symbol-name">${topSym.name}</span></div>
      <div class="reel-symbol"><span>${centerSym.icon}</span><span class="reel-symbol-name">${centerSym.name}</span></div>
      <div class="reel-symbol"><span>${bottomSym.icon}</span><span class="reel-symbol-name">${bottomSym.name}</span></div>
    `;
  }

  // Gera símbolo aleatório
  function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  btnSpin.addEventListener('click', () => {
    if (isSpinning) return;

    const betAmount = parseFloat(betInput.value);
    if (isNaN(betAmount) || betAmount <= 0) {
      alert('Digite um valor de aposta válido!');
      return;
    }

    if (!window.joselitoWallet.charge(betAmount)) {
      alert('Saldo insuficiente! Adicione saldo fictício.');
      const depositModal = document.getElementById('depositModal');
      if (depositModal) depositModal.classList.add('active');
      return;
    }

    isSpinning = true;
    btnSpin.disabled = true;
    reelsMachine.classList.remove('near-miss');
    reel3.classList.remove('suspense');
    slotsStatus.innerHTML = '🔥 Rodando as bobinas... O Tigre está acordando!';

    // Avalia no motor central se esta rodada do bloco de 15 é a vitoriosa
    const rngResult = window.joselitoRNG ? window.joselitoRNG.evaluateNextRound('tigrinho') : { isWin: false };
    const isWin = rngResult.isWin;
    const isNearMiss = !isWin && (Math.random() < 0.82); // 82% de gatilho Near-Miss psicológico nas derrotas

    // Define os símbolos da linha de pagamento central
    let c1, c2, c3;
    let t1 = getRandomSymbol(), b1 = getRandomSymbol();
    let t2 = getRandomSymbol(), b2 = getRandomSymbol();
    let t3 = getRandomSymbol(), b3 = getRandomSymbol();

    if (isWin) {
      // Vitória do jogador: alinha 3 símbolos iguais na linha central!
      // Sorteia entre Tigre Wild (250x), Cartinha (50x) ou Saco de Ouro (25x)
      const winOptions = [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]];
      const winSym = winOptions[Math.floor(Math.random() * winOptions.length)];
      c1 = winSym;
      c2 = winSym;
      c3 = winSym;
    } else if (isNearMiss) {
      // Near-Miss: Coluna 1 e Coluna 2 recebem o Tigrinho Wild (250x)
      const tiger = SYMBOLS[0];
      c1 = tiger;
      c2 = tiger;
      // Coluna 3: Tigre fica em cima ou embaixo, mas no centro cai Laranja ou Moeda
      t3 = tiger;
      c3 = SYMBOLS[5]; // Laranja
      b3 = getRandomSymbol();
    } else {
      // Perda comum aleatória
      c1 = getRandomSymbol();
      c2 = getRandomSymbol();
      c3 = getRandomSymbol();
      // Garante que não são todos iguais
      if (c1.name === c2.name && c2.name === c3.name) {
        c3 = (c3.name === 'Laranja Imperial') ? SYMBOLS[3] : SYMBOLS[5];
      }
    }

    // Animação de giro contínuo
    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      // Gera símbolos transitórios simulando giro em alta velocidade
      renderReel(reelContainer1, getRandomSymbol(), getRandomSymbol(), getRandomSymbol());
      renderReel(reelContainer2, getRandomSymbol(), getRandomSymbol(), getRandomSymbol());
      renderReel(reelContainer3, getRandomSymbol(), getRandomSymbol(), getRandomSymbol());

      if (window.joselitoAudio && ticks % 2 === 0) {
        window.joselitoAudio.playTick();
      }

      // Para a Coluna 1 aos 1.2s
      if (ticks === 15) {
        renderReel(reelContainer1, t1, c1, b1);
      }

      // Para a Coluna 2 aos 1.8s
      if (ticks === 22) {
        renderReel(reelContainer2, t2, c2, b2);

        // Se for Near-Miss ou Vitória de Tigre, aciona efeito de suspense na Coluna 3!
        if (c1.name === 'Tigrinho Wild' && c2.name === 'Tigrinho Wild') {
          reel3.classList.add('suspense');
          slotsStatus.innerHTML = '<span style="color: #fbbf24; font-weight: 800;">⚡ ATENÇÃO! DOIS TIGRES! VAI SOLTAR A CARTINHA?! ⚡</span>';
        }
      }

      // Para a Coluna 3 aos 2.8s
      if (ticks >= 34) {
        clearInterval(interval);
        renderReel(reelContainer3, t3, c3, b3);
        reel3.classList.remove('suspense');
        isSpinning = false;
        btnSpin.disabled = false;

        // Avança o ciclo estrito no motor RNG
        if (window.joselitoRNG) {
          window.joselitoRNG.advanceCycle('tigrinho');
        }

        // Processa o resultado
        if (isWin) {
          const prize = betAmount * c1.mult;
          window.joselitoWallet.deposit(prize);

          slotsStatus.innerHTML = `<span style="color: var(--accent-green); font-weight: 800;">🎉 O TIGRE SOLTOU A CARTINHA! 3x ${c1.name}! Prêmio: R$ ${prize.toFixed(2)} (${c1.mult}x)!</span>`;

          // Dispara modal triunfal de Big Win
          window.showBigWinCelebration(prize, `🐯 O TIGRE SOLTOU A CARTINHA! 3x ${c1.name}!`);
        } else if (isNearMiss) {
          reelsMachine.classList.add('near-miss');
          slotsStatus.innerHTML = `<span style="color: var(--accent-red); font-weight: 800;">😱 QUASE! O terceiro Tigre passou raspando por 1 milímetro! A casa levou sua aposta.</span>`;

          // Dispara o Pop-up do Joselito Dedo do Meio
          setTimeout(() => {
            window.showJoselitoLoss(betAmount);
          }, 500);
        } else {
          slotsStatus.innerHTML = `<span style="color: var(--accent-red); font-weight: 800;">❌ Deu nada! O Tigrinho engoliu sua aposta.</span>`;

          // Dispara o Pop-up do Joselito Dedo do Meio
          setTimeout(() => {
            window.showJoselitoLoss(betAmount);
          }, 450);
        }
      }
    }, 80);
  });
});

