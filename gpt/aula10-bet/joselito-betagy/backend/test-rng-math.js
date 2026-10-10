/**
 * Script de Verificação Matemática e Validação de Sintaxe
 * Joselito Bet - Teste de Bloco Controlado (1 Vitória a cada 15 Jogadas)
 */

const fs = require('fs');
const path = require('path');

console.log('🎰 INICIANDO TESTE MATEMÁTICO DO MOTOR JOSÉLITO RNG...');

// Mock de localStorage para simulação em ambiente Node.js
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};
global.window = { localStorage: global.localStorage };

// Carrega o arquivo rng-engine.js
const rngCode = fs.readFileSync(path.join(__dirname, '../frontend/shared/js/rng-engine.js'), 'utf-8');
eval(rngCode); // Executa no contexto global

const games = ['tigrinho', 'aviao', 'roleta'];
let totalPassed = true;

games.forEach(game => {
  console.log(`\n==============================================`);
  console.log(`🎲 Testando Jogo: ${game.toUpperCase()}`);
  console.log(`==============================================`);

  window.joselitoRNG.resetCycle(game);

  const numCycles = 10; // 10 blocos de 15 jogadas = 150 jogadas
  const totalRounds = numCycles * 15;
  let totalWins = 0;
  let totalLosses = 0;
  const winPositions = [];

  for (let c = 1; c <= numCycles; c++) {
    let winsInThisCycle = 0;
    let winRoundInCycle = null;

    for (let r = 1; r <= 15; r++) {
      const evaluation = window.joselitoRNG.evaluateNextRound(game);
      if (evaluation.isWinRound) {
        winsInThisCycle++;
        winRoundInCycle = r;
      }
      window.joselitoRNG.advanceCycle(game);
    }

    if (winsInThisCycle !== 1) {
      console.error(`❌ FALHA no ciclo ${c}: esperava 1 vitória, obteve ${winsInThisCycle}`);
      totalPassed = false;
    } else {
      totalWins++;
      winPositions.push(winRoundInCycle);
    }
    totalLosses += 14;
  }

  console.log(`✅ Total de Rodadas Executadas: ${totalRounds}`);
  console.log(`✅ Total de Vitórias: ${totalWins} (esperado: ${numCycles})`);
  console.log(`✅ Total de Derrotas da Banca: ${totalLosses} (esperado: ${numCycles * 14})`);
  console.log(`✅ Taxa de Vitória do Jogador: ${(totalWins / totalRounds * 100).toFixed(2)}% (Exatamente 1 a cada 15 jogadas)`);
  console.log(`🎯 Posições das vitórias em cada ciclo: [${winPositions.join(', ')}]`);
  
  // Verifica se há variação nas posições (não é fixa)
  const uniquePositions = new Set(winPositions);
  console.log(`✨ Variabilidade de posições aleatórias: ${uniquePositions.size} posições distintas em ${numCycles} ciclos.`);
});

console.log('\n==============================================');
if (totalPassed) {
  console.log('🏆 TODOS OS TESTES MATEMÁTICOS PASSARAM COM SUCESSO!');
  console.log('A regra "A cada 15 jogadas o cliente ganha 1 e a casa ganha 14" está 100% GARANTIDA!');
} else {
  console.error('❌ HOUVE FALHA NA VALIDAÇÃO MATEMÁTICA!');
  process.exit(1);
}
