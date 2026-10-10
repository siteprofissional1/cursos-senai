/**
 * Joselito Bet - Carteira de Saldo Simulado (Wallet Manager)
 * Persistência unificada com LocalStorage e sincronização em tempo real entre páginas e abas.
 * Comentários didáticos para análise de alunos do SENAI.
 */

const WALLET_STORAGE_KEY = 'joselito_bet_balance';
const DEFAULT_INITIAL_BALANCE = 50.00;

class WalletManager {
  constructor() {
    this.balance = this.loadBalance();
    this.initListeners();
    this.injectDepositModal();
    this.updateUI();
  }

  // Carrega o saldo do LocalStorage ou define o valor padrão inicial de R$ 50,00
  loadBalance() {
    const saved = localStorage.getItem(WALLET_STORAGE_KEY);
    if (saved !== null) {
      const num = parseFloat(saved);
      return isNaN(num) ? DEFAULT_INITIAL_BALANCE : num;
    }
    this.saveBalance(DEFAULT_INITIAL_BALANCE);
    return DEFAULT_INITIAL_BALANCE;
  }

  // Salva no LocalStorage e despacha evento para a aplicação
  saveBalance(amount) {
    this.balance = Math.max(0, parseFloat(amount));
    localStorage.setItem(WALLET_STORAGE_KEY, this.balance.toFixed(2));
    this.updateUI();

    window.dispatchEvent(new CustomEvent('joselito:balanceChange', {
      detail: { balance: this.balance }
    }));
  }

  getBalance() {
    return this.balance;
  }

  // Adiciona saldo fictício (depósito simulado)
  deposit(amount) {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      this.saveBalance(this.balance + val);
      if (window.joselitoAudio) {
        window.joselitoAudio.playCoin();
      }
      return true;
    }
    return false;
  }

  // Desconta valor da aposta (valida se o usuário tem saldo suficiente)
  charge(amount) {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return false;
    if (this.balance < val) return false;

    this.saveBalance(this.balance - val);
    if (window.joselitoAudio) {
      window.joselitoAudio.playBet();
    }
    return true;
  }

  // Atualiza todos os elementos visuais de saldo na página atual
  updateUI() {
    const formatted = this.balance.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    document.querySelectorAll('.balance-value, [data-balance]').forEach(el => {
      el.textContent = formatted;
      // Pequeno efeito visual de pulsar no valor
      el.classList.add('pulse-balance');
      setTimeout(() => el.classList.remove('pulse-balance'), 300);
    });
  }

  // Sincroniza saldo se o usuário abrir múltiplos jogos em abas diferentes
  initListeners() {
    window.addEventListener('storage', (e) => {
      if (e.key === WALLET_STORAGE_KEY) {
        this.balance = parseFloat(e.newValue) || 0;
        this.updateUI();
      }
    });
  }

  // Injeta automaticamente o Modal de Depósito se não estiver no DOM
  injectDepositModal() {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('depositModal')) return;

      const modalHtml = `
        <div id="depositModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div class="modal-content">
            <button class="modal-close" id="closeDepositModal" aria-label="Fechar">&times;</button>
            <h3 id="modalTitle" style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff;">
              💰 Recarga Instantânea de Saldo VIP
            </h3>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;">
              Créditos instantâneos para a sua banca. Selecione uma ficha ou digite o valor:
            </p>

            <div class="deposit-grid">
              <button class="btn-chip" data-val="10">+ R$ 10</button>
              <button class="btn-chip" data-val="25">+ R$ 25</button>
              <button class="btn-chip" data-val="50">+ R$ 50</button>
              <button class="btn-chip" data-val="100">+ R$ 100</button>
              <button class="btn-chip" data-val="250">+ R$ 250</button>
              <button class="btn-chip" data-val="500">+ R$ 500</button>
            </div>

            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
              <input type="number" id="customDepositInput" placeholder="Outro valor (R$)" min="1" step="1"
                     style="flex: 1; padding: 0.75rem 1rem; border-radius: 10px; background: #0a0b10; border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 1rem;">
              <button id="btnConfirmCustomDeposit" class="btn btn-deposit">Adicionar</button>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      // Eventos do Modal
      const modal = document.getElementById('depositModal');
      const closeBtn = document.getElementById('closeDepositModal');
      const customInput = document.getElementById('customDepositInput');
      const confirmCustom = document.getElementById('btnConfirmCustomDeposit');

      const closeModal = () => modal.classList.remove('active');

      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // Botões rápidos de fichas
      modal.querySelectorAll('.btn-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseFloat(btn.getAttribute('data-val'));
          this.deposit(val);
          closeModal();
        });
      });

      // Depósito customizado
      confirmCustom.addEventListener('click', () => {
        const val = parseFloat(customInput.value);
        if (val > 0) {
          this.deposit(val);
          customInput.value = '';
          closeModal();
        }
      });

      // Conecta botões com classe .btn-open-deposit
      document.querySelectorAll('.btn-open-deposit').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.add('active');
        });
      });
    });
  }
}

// Instância global da Carteira
window.joselitoWallet = new WalletManager();
