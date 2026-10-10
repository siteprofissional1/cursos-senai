/**
 * Joselito Bet - Módulo de Pop-up de Derrota (Joselito Dedo do Meio)
 * Dispara modal com a foto do Joselito e frases cômicas de conscientização quando o usuário perde.
 * Comentários didáticos para análise de alunos do SENAI.
 */

const JOSELITO_PHRASES = [
  "Não sabe brincar, não desce pro play!",
  "A casa sempre ganha, otário!",
  "Obrigado pela contribuição pro churrasco do Joselito!",
  "Quer recuperar o loss? Faz outro depósito aí!",
  "Achou mesmo que ia ficar milionário clicando em botão?",
  "Estatística pura: 99% dos apostadores perdem tudo!",
  "Perdeu, playboy! O Joselito mandou um abraço!",
  "Nem o algoritmo do tigrinho perdoa quem confia em bet!",
  "Calma, na próxima rodada você perde o dobro!"
];

class LossModalManager {
  constructor() {
    this.injectModal();
  }

  // Detecta o caminho relativo correto para a pasta assets dependendo de onde a página está rodando
  getAssetPath(filename) {
    // Se a página estiver em uma subpasta (ex: /sorteio/, /aviao/), precisa de ../assets/
    const isSubfolder = window.location.pathname.includes('/sorteio/') ||
                        window.location.pathname.includes('/aviao/') ||
                        window.location.pathname.includes('/roleta/') ||
                        window.location.pathname.includes('/tigrinho/');
    return isSubfolder ? `../assets/${filename}` : `assets/${filename}`;
  }

  injectModal() {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('lossModal')) return;

      const imageSrc = this.getAssetPath('joselito-dedo-do-meio.webp');

      const modalHtml = `
        <div id="lossModal" class="loss-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="lossTitle">
          <div class="loss-card">
            <div class="loss-image-wrapper">
              <img id="lossImage" src="${imageSrc}" alt="Joselito mostrando o dedo do meio" onerror="this.src='../assets/joselito-dedo-do-meio.jpg'">
            </div>
            <h2 id="lossTitle" class="loss-title">VOCÊ PERDEU!</h2>
            <p id="lossPhrase" class="loss-phrase">"Não sabe brincar, não desce pro play!"</p>
            <p class="loss-lost-amount">
              Valor levado pela casa: <span id="lossValueText">R$ 0,00</span>
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <button id="btnCloseLoss" class="btn btn-gold" style="flex: 1; min-width: 140px;">
                Tentar de Novo 🔄
              </button>
              <button id="btnDepositFromLoss" class="btn btn-deposit" style="flex: 1; min-width: 140px;">
                Adicionar Saldo 💰
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      // Eventos
      const modal = document.getElementById('lossModal');
      const btnClose = document.getElementById('btnCloseLoss');
      const btnDeposit = document.getElementById('btnDepositFromLoss');

      const hide = () => modal.classList.remove('active');

      btnClose.addEventListener('click', hide);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) hide();
      });

      btnDeposit.addEventListener('click', () => {
        hide();
        const depositModal = document.getElementById('depositModal');
        if (depositModal) {
          depositModal.classList.add('active');
        }
      });
    });
  }

  // Exibe o modal com áudio e frase aleatória
  show(amountLost = 0) {
    const modal = document.getElementById('lossModal');
    if (!modal) return;

    // Reproduz efeito sonoro de derrota via Web Audio
    if (window.joselitoAudio) {
      window.joselitoAudio.playLoss();
    }

    // Seleciona frase aleatória
    const phrase = JOSELITO_PHRASES[Math.floor(Math.random() * JOSELITO_PHRASES.length)];
    const phraseEl = document.getElementById('lossPhrase');
    if (phraseEl) phraseEl.textContent = `"${phrase}"`;

    // Atualiza valor perdido
    const valEl = document.getElementById('lossValueText');
    if (valEl) {
      valEl.textContent = amountLost.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }

    modal.classList.add('active');
  }
}

// Modal de Grande Vitória (Big Win / Jackpot)
class BigWinModalManager {
  constructor() {
    this.injectModal();
  }

  injectModal() {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('bigWinModal')) return;

      const modalHtml = `
        <div id="bigWinModal" class="bigwin-overlay" role="dialog" aria-modal="true">
          <div class="bigwin-box">
            <div style="font-size: 3rem; margin-bottom: 0.5rem; animation: pulseRotate 1s infinite;">🎰 💎 💰</div>
            <h2 id="bigWinTitle" class="bigwin-title">GRANDE VITÓRIA!</h2>
            <p style="color: #cbd5e1; font-size: 1rem; font-weight: 600;">O Tigre soltou a cartinha da sorte!</p>
            <div id="bigWinAmount" class="bigwin-amount">R$ 0,00</div>
            <button id="btnCloseBigWin" class="btn btn-gold" style="width: 100%; font-size: 1.1rem; padding: 0.85rem;">
              COLETAR PRÊMIO 🏆
            </button>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      const modal = document.getElementById('bigWinModal');
      const btnClose = document.getElementById('btnCloseBigWin');
      if (btnClose) {
        btnClose.addEventListener('click', () => modal.classList.remove('active'));
      }
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.remove('active');
        });
      }
    });
  }

  show(amount = 0, title = 'GRANDE VITÓRIA!') {
    const modal = document.getElementById('bigWinModal');
    if (!modal) return;

    if (window.joselitoAudio) {
      window.joselitoAudio.playWin();
    }

    const titleEl = document.getElementById('bigWinTitle');
    if (titleEl) titleEl.textContent = title;

    const amountEl = document.getElementById('bigWinAmount');
    if (amountEl) {
      amountEl.textContent = amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }

    modal.classList.add('active');
  }
}

// Instâncias globais
window.joselitoLoss = new LossModalManager();
window.joselitoBigWin = new BigWinModalManager();

// Funções helpers globais
window.showJoselitoLoss = (amount) => {
  window.joselitoLoss.show(amount);
};

window.showBigWinCelebration = (amount, title) => {
  window.joselitoBigWin.show(amount, title);
};
