# Plano de Desenvolvimento: Joselito Bet VIP Casino Overhaul

**Task Slug:** `joselito-bet-casino-overhaul`  
**Status:** Em Planejamento (Aguardando Aprovação do Usuário)  
**Autor:** Agente Antigravity / SENAI Ourinhos  
**Data:** 09/10/2026  

---

## 1. Visão Geral e Objetivos

Transformar a plataforma **Joselito Bet** em uma experiência com padrão estético e funcional de um cassino online de luxo (estilo Stake, Blaze e PG Soft), eliminando textos didáticos e focando em três jogos autênticos com controle matemático rigoroso de 1 vitória a cada 15 jogadas.

### Principais Diretrizes Alinhadas no Protocolo /grill-me:
1. **Algoritmo de Bloco Controlado (1 em 15):** Em cada ciclo de 15 jogadas, o sistema programa exatamente 1 vitória posicionada aleatoriamente dentro do bloco (as outras 14 são derrotas garantidas).
2. **Remoção de Avisos do SENAI:** Substituição de caixas pedagógicas por elementos autênticos de cassino (histórico de multiplicadores em tempo real, feed de apostas da comunidade, badges de RTP e volatilidade).
3. **Exclusão do Sorteio:** Exclusão definitiva de `frontend/sorteio/`, mantendo e elevando ao máximo o nível dos 3 jogos consagrados: **Fortune Tigrinho**, **Aviãozinho Crash** e **Roleta Europeia VIP**.
4. **Estética Realista + Mascote Joselito:** Interface imersiva, moderna e responsiva, mantendo a reação de derrota sarcástica do Joselito quando o jogador perde.

---

## 2. Divisão de Fases de Execução

### Fase 1: Motor Probabilístico Central (`frontend/shared/js/rng-engine.js`)
* Criar um módulo centralizado de gerenciamento de ciclos de 15 jogadas para persistência em `localStorage`.
* Funções compartilhadas:
  * `shouldPlayerWin(gameKey)`: Verifica se a rodada atual do bloco de 15 é a sorteada para vitória.
  * `recordRound(gameKey)`: Incrementa o contador do ciclo (1 a 15) e reseta após o fim do bloco com um novo sorteio de posição vitoriosa.
  * `getRecentHistory(gameKey)`: Gera histórico convincente de resultados anteriores para a barra de histórico.

### Fase 2: Redesenho do Menu Principal / Lobby (`frontend/index.html` e `global.css`)
* Remover menções ao SENAI nos cabeçalhos, tags e banners.
* Criar um banner de topo dinâmico com iluminação neon, jackpot acumulado e feed de apostadores recentes.
* Reestruturar a grade principal com os 3 jogos principais em destaque (Tigrinho, Aviador e Roleta).
* Remover qualquer referência ao jogo de Sorteio.

### Fase 3: Upgrade Visual - Fortune Tigrinho (`frontend/tigrinho/`)
* **Visual:** Estilo oriental clássico da PG Soft com detalhes dourados ornamentados, bordas de carretéis iluminadas, efeitos sonoros de sino/moedas e multiplicadores 10x-250x.
* **Mecânica:** O Tigre só "solta a cartinha" ou alinha 3 símbolos no centro na rodada vitoriosa designada pelo bloco de 15. Nas outras 14 rodadas, aplica o gatilho de *near-miss* (dois tigres no centro e terceiro desalinhado).

### Fase 4: Upgrade Visual - Aviãozinho Crash (`frontend/aviao/`)
* **Visual:** Estilo autêntico Aviator/Spribe com linha de histórico de multiplicadores no topo (ex: `1.12x`, `1.04x`, `2.85x`, `1.01x`), rastro de partículas e efeito de explosão.
* **Mecânica:** Nas 14 rodadas de derrota, o avião explode imprevisivelmente antes de o jogador sacar ou com multiplicador sub-1.30x. Na 1 rodada de vitória, o avião sobe confortavelmente permitindo lucro.

### Fase 5: Upgrade Visual - Roleta Europeia VIP (`frontend/roleta/`)
* **Visual:** Mesa de feltro verde clássico de cassino com grade completa de apostas (Vermelho/Preto, Par/Ímpar, 1-18/19-36), roleta com texturas de madeira e latão polido, e animação suave de desaceleração da bolinha.
* **Mecânica:** Nas 14 rodadas de derrota, a bolinha sempre cai no setor oposto ou no Zero (Verde). Na rodada vitoriosa, o algoritmo faz a bolinha pousar na opção escolhida pelo jogador.

### Fase 6: Limpeza, Remoção do Sorteio e Testes Finais
* Deletar a pasta `frontend/sorteio/`.
* Testar a taxa de vitória (1/15) via console e automação de jogadas.
* Validar responsividade em dispositivos móveis (375px) e desktop (1200px).
* Atualizar documentação e prompt history.

---

## 3. Matriz de Agentes Envolvidos (Multi-Agent Orchestration)

| Agente | Responsabilidade |
|---|---|
| `project-planner` | Estruturação e acompanhamento das etapas do plano |
| `backend-specialist` | Implementação do motor de RNG e ciclo de 15 rodadas (`rng-engine.js`) |
| `frontend-specialist` | Refatoração visual dos 3 jogos, lobby e design system |
| `test-engineer` | Validação da proporção matemática 1/15 e teste responsivo |

---

<p align="center">
  desenvolvido por <a href="https://siteprofissional.pro" style="color: #3b82f6;">siteprofissional</a>
</p>
