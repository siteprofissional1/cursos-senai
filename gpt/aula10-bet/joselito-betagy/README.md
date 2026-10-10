# 🎰 Joselito Bet VIP - Plataforma Comercial de Cassino Online & Motor RNG

<p align="center">
  <img src="assets/joselito-perfil.webp" alt="Joselito Bet Logo" width="160" style="border-radius: 50%; border: 3px solid #f59e0b;" />
</p>

<p align="center">
  <strong>Plataforma Realista de Cassino Online com Design de Alta Fidelidade e Motor Probabilístico de Bloco Controlado</strong><br>
  <em>Realistic Online Casino Platform with Commercial Grade UI & Controlled Block RNG Engine</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Antigravity-Google%20DeepMind-blue?style=for-the-badge&logo=google" alt="Google Antigravity">
  <img src="https://img.shields.io/badge/RNG%20Engine-1%20in%2015%20Block-gold?style=for-the-badge" alt="RNG Engine">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-yellow?style=for-the-badge&logo=javascript" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-Web%20Audio%20API-orange?style=for-the-badge&logo=html5" alt="HTML5">
  <img src="https://img.shields.io/badge/Node.js-Backend%20Server-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Mobile-100%25%20Responsive-brightgreen?style=for-the-badge" alt="Mobile Ready">
</p>

---

## 🇧🇷 Português (Brasil)

### 📖 Sobre o Projeto
O **Joselito Bet VIP** é uma aplicação web moderna inspirada nas grandes plataformas do mercado (Stake, Blaze, PG Soft), desenvolvida sob o ecossistema **Google Antigravity**. O sistema alia uma estética visual imersiva e cinematográfica a um motor probabilístico de **Bloco Controlado**, garantindo matematicamente a lucratividade da casa: **a cada bloco de 15 jogadas, o jogador conquista exatamente 1 vitória aleatória e a casa fatura 14 vezes**.

Todos os créditos utilizados na plataforma são simulados e gerenciados via `localStorage`, permitindo recargas instantâneas e sincronização entre todas as telas.

### 🎮 Os 3 Jogos Oficiais de Cassino
1. **🐯 Fortune Tigrinho VIP (PG Soft Style):** Slot 3x3 de alta volatilidade com tabela oficial de pagamentos (Wild 250x, Cartinha 50x, Saco de Moedas 25x, etc.), fita de histórico das cartas e efeito visual de suspense *Near-Miss* nas rodadas em que a casa vence.
2. **✈️ Aviãozinho Crash VIP:** Curva exponencial em grade vetorial estilo Aviator com indicador de altitude em tempo real, rastro luminescente de partículas, histórico de multiplicadores recentes e painel social de apostadores ao vivo.
3. **🎡 Roleta Europeia VIP:** Roda de 37 setores com física de desaceleração suave (*Ease-Out Quartic*), fita com o histórico dos últimos números sorteados e grade completa de apostas: Cores (Vermelho/Preto 2x), Zero da Casa (14x), Par/Ímpar (2x) e Faixas de 1-18 / 19-36 (2x).

### 🏆 Celebração Big Win & O Mascote Joselito
- **🎉 Big Win Triunfal:** Quando a rodada vitoriosa do ciclo é alcançada, uma celebração cinematográfica com chuva de confetes, chuva de moedas douradas e áudio orquestral parabeniza o jogador.
- **🖕 Joselito Mascote da Banca:** Em 14 das 15 rodadas, o jogador é recebido pelo icônico modal zombeteiro com o Joselito e frases da banca garantindo que a casa sempre vence.

### 🤖 Agentes e Skills Utilizados (Google Antigravity Kit)
- **Agentes:**
  - `orchestrator` / `project-planner`: Planejamento arquitetural e condução do fluxo `/grill-me`.
  - `frontend-specialist`: Criação da interface Dark Mode VIP, animações Canvas 2D, tabelas de pagamento e componentes touch-friendly.
  - `backend-specialist`: Criação do servidor Node.js e rotas de suporte.
  - `test-engineer`: Criação do teste de estresse matemático (`test-rng-math.js`) e auditoria mobile E2E via Browser Subagent.
- **Skill Packs:**
  - `@[skills/brainstorming]`
  - `@[skills/plan-writing]`
  - `@[skills/frontend-design]`
  - `@[skills/clean-code]`
  - `@[skills/nodejs-best-practices]`
  - `@[skills/webapp-testing]`
  - `@[skills/vulnerability-scanner]`

---

## 🇺🇸 English

### 📖 About the Project
**Joselito Bet VIP** is a modern web application inspired by leading commercial online casinos (Stake, Blaze, PG Soft), developed using the **Google Antigravity** platform. It combines cinematic visuals with a strict **Controlled Block RNG Engine**, guaranteeing that **for every block of 15 bets, the player wins exactly 1 random round and the house wins 14 times** (6.67% exact win rate).

### 🎮 The 3 Official Games
- **🐯 Fortune Tigrinho Slots:** 3x3 slot reels with official PG Soft paytables, card history ribbon, and Near-Miss suspense mechanics.
- **✈️ Airplane Crash VIP:** Vector grid Aviator-style canvas curve with real-time altitude, particle trails, multiplier history, and community live bets.
- **🎡 European Roulette VIP:** 37-pocket European roulette with smooth physics, recent number ribbon, and extended betting table (Red/Black, Green Zero, Even/Odd, 1-18/19-36).

---

## 🚀 Como Executar o Projeto / How to Run

### Opção 1: Via Servidor Node.js (Recomendado)
```bash
# Iniciar o servidor integrado
node backend/server.js
```
Acesse no navegador: `http://localhost:3000/frontend/index.html`

### Opção 2: Validação Matemática Automatizada
```bash
# Executa 150 rodadas para cada jogo e comprova a taxa exata de 1 em 15
node backend/test-rng-math.js
```

---

## 📁 Estrutura de Pastas / Project Structure
```text
joselito-betagy/
├── index.html                           # Redirecionamento da raiz
├── README.md                            # Documentação profissional bilíngue
├── assets/                              # Imagens otimizadas (.webp)
├── backend/                             # Servidor Node.js e suíte de testes
│   ├── package.json
│   ├── server.js                        # Servidor HTTP estático
│   └── test-rng-math.js                 # Teste de precisão matemática de 1 em 15
├── documentation/                       # Documentação técnica e histórico
│   ├── promptHistory.md                 # Registro integral de todos os prompts
│   └── joselito-bet-casino-overhaul.md  # Plano de arquitetura aprovado
└── frontend/                            # Aplicação cliente (100% responsiva)
    ├── index.html                       # Lobby Principal VIP
    ├── shared/                          # Recursos compartilhados
    │   ├── css/global.css               # Design System VIP
    │   └── js/
    │       ├── rng-engine.js            # Motor probabilístico 1/15
    │       ├── audio.js                 # Web Audio API
    │       ├── wallet.js                # Carteira de crédito simulada
    │       └── popup-derrota.js         # Modais de Derrota e Big Win
    ├── tigrinho/                        # Jogo 1 (Fortune Tiger Slots)
    ├── aviao/                           # Jogo 2 (Airplane Crash VIP)
    └── roleta/                          # Jogo 3 (Roleta Europeia VIP)
```

---

<p align="center">
  desenvolvido por <a href="https://siteprofissional.pro" style="color: #3b82f6;">siteprofissional</a>
</p>
