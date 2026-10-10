# Plano de Implementação: Joselito Bet (Plataforma Educacional SENAI)

**Data de Criação:** 08/10/2026  
**Objetivo:** Desenvolver uma plataforma interativa de apostas simuladas em HTML, CSS e JavaScript puro para conscientização de alunos no SENAI, demonstrando empiricamente como os algoritmos de casas de aposta são matematicamente desenhados para que a banca sempre lucre ("A Casa Sempre Ganha").

---

## 1. Visão Geral da Arquitetura

### 1.1 Estrutura de Pastas e Arquivos
```text
joselito-betagy/
├── index.html                           # Redirecionamento e entrada rápida para /frontend/
├── README.md                            # Documentação profissional bilíngue (PT-BR / EN)
├── assets/                              # Imagens originais e convertidas em .webp
│   ├── joselito-dedo-do-meio.webp
│   ├── joselito-fav-icon.webp
│   └── joselito-perfil.webp
├── backend/                             # Estrutura padrão SENAI (servidor opcional Node.js)
│   ├── package.json
│   └── server.js
├── documentation/                       # Documentação técnica e requisitos
│   ├── promptHistory.md                 # Histórico completo dos prompts da sessão
│   └── arquitetura-manipulacao.md      # Explicação dos algoritmos de manipulação
└── frontend/                            # Aplicação cliente principal
    ├── index.html                       # Hub/Menu principal estilo plataforma Bet moderna
    ├── shared/                          # Módulos reutilizáveis
    │   ├── css/
    │   │   └── global.css               # Design system escuro, tipografia, efeitos neon/glassmorphism
    │   └── js/
    │       ├── wallet.js                # Carteira persistente em LocalStorage (Saldo, Depósito Simulado)
    │       ├── audio.js                 # Sintetizador sonoro com Web Audio API (moedas, giros, derrota)
    │       └── popup-derrota.js         # Modal do Joselito zoando o jogador (dedo do meio + falas)
    ├── sorteio/                         # Jogo 1: Adivinhe o número de 1 a 10 (10% de vitória real)
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    ├── aviao/                           # Jogo 2: Aviãozinho Crash (subida multiplicadora e crash prematuro)
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    ├── roleta/                          # Jogo 3: Roleta de Cassino (cores/números manipulados pela banca)
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    └── tigrinho/                        # Jogo 4: Slots do Tigrinho (efeito "quase ganhou" com bobinas 3x3)
        ├── index.html
        ├── style.css
        └── script.js
```

---

## 2. Especificação dos Componentes

### 2.1 Carteira Unificada (`wallet.js`)
- Persistência contínua via `localStorage` (chave: `joselito_bet_balance`).
- Saldo inicial padrão: R$ 50,00 fictícios.
- Modal universal de depósito simulado rápido (+R$ 10, +R$ 50, +R$ 100 ou valor customizado com feedback imediato).
- Evento customizado `balanceUpdated` para sincronização em tempo real entre abas e elementos de interface.

### 2.2 Sistema de Efeitos Sonoros (`audio.js`)
- Criado 100% com **Web Audio API** nativa (sem dependências de arquivos de terceiros, 100% offline).
- Efeitos sonoros para:
  - Moedas/Depósito (`playCoin()`)
  - Clique e apostas (`playBet()`)
  - Giro de roleta e bobinas (`playTick()`, `playSpin()`)
  - Aceleração do avião e explosão do Crash (`playEngine()`, `playCrash()`)
  - Corneta de derrota/buzzer cômico (`playLoss()`)
  - Fanfarra rápida para as raras vitórias (`playWin()`)

### 2.3 Pop-up do Joselito Dedo do Meio (`popup-derrota.js`)
- Acionado automaticamente quando o jogador perde a aposta em qualquer um dos 4 jogos.
- Exibe em destaque a foto `assets/joselito-dedo-do-meio.webp`.
- Frases cômicas e irônicas do Joselito:
  - *"Não sabe brincar, não desce pro play!"*
  - *"A casa sempre ganha, otário!"*
  - *"Obrigado pelo seu PIX fictício!"*
  - *"Quer pegar seu dinheiro de volta? Faz outro depósito!"*
  - *"Achou que ia ficar milionário com joguinho online?"*

### 2.4 Rodapé Obrigatório
- Em **todas** as páginas HTML (`/frontend/index.html` e nos 4 jogos), a última linha centralizada terá:
  `site desenvolvido por <a href="https://siteprofissional.pro" style="color: #3b82f6;">siteprofissional.pro</a>`

---

## 3. Lógica dos 4 Jogos

1. **Jogo 1 - Sorteio 1 a 10:**
   - Multiplicador prometido: 5x a aposta.
   - Algoritmo de manipulação: A cada 10 rodadas, apenas 1 tem chance de sortear o número escolhido; nas outras 9, o sorteio é forçado a sortear um número diferente.
2. **Jogo 2 - Aviãozinho (Crash):**
   - Gráfico de subida do multiplicador em tempo real (canvas HTML5).
   - O multiplicador sobe com curva exponencial, mas o ponto de crash é manipulado (80% das vezes explode antes de 1.50x ou logo que o valor apostado for alto).
   - Botão "Sacar / Cash Out" interativo.
3. **Jogo 3 - Roleta:**
   - Roda de roleta interativa (Canvas/CSS 3D) com números e cores (Vermelho, Preto e 0 Verde).
   - O sistema calcula a aposta do jogador e desacelera propositalmente para parar em uma cor contrária ou no Zero.
4. **Jogo 4 - Tigrinho (Slot Machine 3x3):**
   - Grade 3x3 animada com ícones (Tigre, Moeda de Ouro, Saco de Dinheiro, Cartinha, Diamante).
   - Gatilho psicológico de "Near Miss": Duas colunas batem o Tigre com animações de fogo e som eletrizante, mas a terceira coluna para a 1 posição de distância!

---

## 4. Plano de Ação e Fases

- **Fase 1:** Aprovação deste plano pelo usuário.
- **Fase 2:** Implementação do núcleo compartilhado (`global.css`, `wallet.js`, `audio.js`, `popup-derrota.js`) e menu principal (`frontend/index.html`).
- **Fase 3:** Implementação dos 4 jogos nas respectivas subpastas.
- **Fase 4:** Teste e validação funcional via browser subagent.
- **Fase 5:** Documentação e README bilíngue.
