/**
 * Joselito Bet - Motor Probabilístico de Bloco Controlado (RNG Engine)
 * Regra Matemática: A casa sempre ganha! Exatamente 1 vitória a cada bloco de 15 jogadas.
 * Arquitetura: Persistência isolada por jogo no LocalStorage com aleatorização intra-bloco.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'joselito_rng_cycles';
  const BLOCK_SIZE = 15; // Ciclo rígido de 15 jogadas

  /**
   * Inicializa ou carrega o estado de um jogo específico.
   * Em cada ciclo de 15 jogadas, exatamente 1 rodada aleatória (de 1 a 15) é sorteada para ser vitoriosa.
   */
  function loadRNGState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('Erro ao ler estado do RNG:', e);
      return {};
    }
  }

  function saveRNGState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Erro ao salvar estado do RNG:', e);
    }
  }

  function getGameCycle(gameKey) {
    const state = loadRNGState();
    if (!state[gameKey] || typeof state[gameKey].currentRound !== 'number') {
      // Cria um novo ciclo de 15 jogadas para o jogo
      state[gameKey] = {
        currentRound: 1,
        // Sorteia em qual das 15 rodadas o jogador terá a única vitória
        winningRound: Math.floor(Math.random() * BLOCK_SIZE) + 1,
        totalPlays: 0,
        totalWins: 0
      };
      saveRNGState(state);
    }
    return state[gameKey];
  }

  window.joselitoRNG = {
    /**
     * Consulta se a rodada atual do bloco será vitoriosa.
     * Retorna { isWin: boolean, roundInCycle: number, winningRound: number }
     */
    evaluateNextRound: function (gameKey) {
      const cycle = getGameCycle(gameKey);
      const isWin = (cycle.currentRound === cycle.winningRound);
      return {
        isWin: isWin,
        isWinRound: isWin,
        roundInCycle: cycle.currentRound,
        winningRound: cycle.winningRound,
        totalPlays: cycle.totalPlays
      };
    },

    /**
     * Registra o término da rodada, avança o contador de 1 a 15 e reseta o ciclo ao atingir 15.
     */
    advanceCycle: function (gameKey) {
      const state = loadRNGState();
      const cycle = state[gameKey] || {
        currentRound: 1,
        winningRound: Math.floor(Math.random() * BLOCK_SIZE) + 1,
        totalPlays: 0,
        totalWins: 0
      };

      const wasWin = (cycle.currentRound === cycle.winningRound);
      cycle.totalPlays++;
      if (wasWin) {
        cycle.totalWins++;
      }

      // Avança a rodada no bloco
      if (cycle.currentRound >= BLOCK_SIZE) {
        // Reinicia novo ciclo com nova posição vencedora aleatória
        cycle.currentRound = 1;
        cycle.winningRound = Math.floor(Math.random() * BLOCK_SIZE) + 1;
      } else {
        cycle.currentRound++;
      }

      state[gameKey] = cycle;
      saveRNGState(state);
      return cycle;
    },

    /**
     * Retorna estatísticas de auditoria do jogo
     */
    getStats: function (gameKey) {
      const cycle = getGameCycle(gameKey);
      return {
        gameKey: gameKey,
        currentRoundInBlock: cycle.currentRound,
        blockSize: BLOCK_SIZE,
        winningRoundInBlock: cycle.winningRound,
        totalPlays: cycle.totalPlays,
        totalWins: cycle.totalWins,
        actualWinRate: cycle.totalPlays > 0 ? ((cycle.totalWins / cycle.totalPlays) * 100).toFixed(1) + '%' : '0%'
      };
    },

    /**
     * Reseta o ciclo para o início (útil para testes)
     */
    resetCycle: function (gameKey) {
      const state = loadRNGState();
      state[gameKey] = {
        currentRound: 1,
        winningRound: Math.floor(Math.random() * BLOCK_SIZE) + 1,
        totalPlays: 0,
        totalWins: 0
      };
      saveRNGState(state);
    }
  };
})();
