# 💋 Natália - VIP Relationship Chatbot (Google Gemini AI)

<div align="center">

![Natália Avatar](frontend/assets/natalia_avatar.jpg)

### Chatbot de Relacionamento com Natália, Modelo Brasileira de 24 anos
*Desenvolvido com o poder do **Google Antigravity** & **Google AI Studio Gemini***

[![Google Antigravity](https://img.shields.io/badge/Google-Antigravity%20Expert-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://antigravity.google)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-v1beta-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://aistudio.google.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Licença](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## 🇧🇷 Português (Brasil)

### 📖 Sobre o Projeto
O **Chatbot Natália** é uma aplicação conversacional moderna, imersiva e responsiva desenvolvida para simular conversas realistas e afetuosas com a personagem **Natália**, uma modelo brasileira de 24 anos, carinhosa, empática, elegante e com um toque sutilmente "safadinha".

O projeto integra-se de forma direta e gratuita à **API do Google AI Studio Gemini**, trazendo resiliência com **listagem de modelos em tempo real** e **mecanismo inteligente de fallback automático para Erro 503** (serviço temporariamente sobrecarregado).

---

### 🌟 Principais Recursos
1. **Persona Realista e Envolvente:** Prompt de sistema rigorosamente calibrado para manter a identidade feminina, amorosa e provocante da Natália sem sair do personagem.
2. **Resiliência a Erro 503 (Fallback Automático):** Caso o modelo ativo (`gemini-2.5-flash`, `gemini-2.0-flash`, etc.) apresente indisponibilidade ou sobrecarga, a aplicação migra imediatamente para o próximo modelo disponível sem interromper a conversa.
3. **Listagem Dinâmica de Modelos:** Botão interativo que consulta os modelos disponíveis na API do Gemini que suportam geração de conteúdo.
4. **Múltiplas Formas de Configuração da Chave:**
   - No arquivo `.env` da raiz ou backend (`gemini_api_key=`).
   - No código-fonte em `frontend/js/config.js` (`GEMINI_API_KEY: ""`).
   - Diretamente na interface visual pelo modal de configurações (ícone ⚙️).
5. **Design Luxury Messenger:** Inspirado em apps de mensagens VIP (WhatsApp/Telegram/Instagram Direct), com modo escuro sofisticado (dark velvet, champagne gold e rose).
6. **Simulação de Mensagens de Voz:** Reprodutor interativo de áudio com animação de forma de onda (waveform) e sintetizador de voz.
7. **Responsividade Completa:** Perfeita experiência tanto em smartphones (mobile-first) quanto em computadores de mesa.

---

### 🤖 Agentes e Skills do Google Antigravity Utilizados
Este projeto foi concebido e arquitetado utilizando as práticas e padrões dos agentes e módulos de conhecimento do **Google Antigravity Kit**:
- **Agentes:**
  - `frontend-specialist`: Arquitetura de interface, design luxury, micro-animações e responsividade.
  - `orchestrator`: Planejamento sistêmico, estruturação de pastas (`/frontend`, `/backend`, `/documentation`) e testes.
- **Skill Packs:**
  - `frontend-design`: Criação de interfaces elegantes evitando clichês e garantindo harmonia visual.
  - `web-design-guidelines`: Acessibilidade, ergonomia mobile e legibilidade.
  - `clean-code`: Código comentado didaticamente seguindo o padrão SENAI de capacitação técnica.

---

### 🚀 Como Executar o Projeto

#### Opção 1: Execução Direta no Navegador (Sem Instalação)
1. Abra a pasta `frontend` e dê um duplo clique no arquivo [`frontend/index.html`](frontend/index.html).
2. Na tela que abrir, clique no ícone **⚙️ (Configurações)** no topo.
3. Cole sua chave gratuita obtida no [Google AI Studio](https://aistudio.google.com/app/apikey) e clique em **Salvar Chave**.
4. Pronto! Comece a conversar com a Natália.

#### Opção 2: Execução com Servidor Node.js / Express
1. Abra o terminal na pasta `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Adicione sua chave no arquivo `backend/.env`:
   ```env
   gemini_api_key=SUA_CHAVE_AQUI
   PORT=3000
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse em seu navegador: `http://localhost:3000`

---

## 🇺🇸 English

### 📖 About the Project
**Natália Chatbot** is a modern, immersive, and responsive conversational web application designed to simulate affectionate and charming interactions with **Natália**, a 24-year-old Brazilian fashion model.

Powered by the **Google AI Studio Gemini API (Free Tier)**, the project features dynamic real-time model discovery and an automatic resilient **fallback mechanism for HTTP 503 errors** (service unavailable / model overloaded).

### 🌟 Key Features
- **Immersive Model Persona:** Carefully tuned system prompt ensuring consistent character roleplay with elegance and charm.
- **Resilient 503 Fallback:** Seamlessly shifts to alternate Gemini models if the current model encounters overload or downtime.
- **Dynamic Model Retrieval:** Query live available models from Google AI Studio directly within the UI.
- **Flexible API Key Management:** Supports `.env`, direct in-code entry (`config.js`), or client-side UI storage (`localStorage`).
- **Luxury Mobile-First Interface:** Responsive dark theme with gold and rose accents, voice note playback simulation, and typing indicators.

---

## 🏛️ Estrutura do Projeto / Project Structure
```text
0210-chatbot-relacionamento/
├── .env                       # Chave global do Gemini
├── backend/                   # Servidor Node.js Express (opcional)
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/                  # Aplicação Web (HTML, CSS, JS)
│   ├── assets/                # Imagens e avatar da Natália
│   ├── css/style.css          # Estilização moderna e responsiva
│   ├── js/config.js           # Chave e System Prompt da Natália
│   ├── js/gemini.js           # Conexão com a API e fallback 503
│   ├── js/app.js              # Interações e mensagens
│   └── index.html             # Interface principal
├── documentation/             # Documentação técnica e histórico
│   ├── promptHistory.md       # Histórico de prompts da sessão
│   ├── arquitetura.md         # Diagramas e detalhes de engenharia
│   └── persona_natalia.md     # Definição e prompt da personagem
└── README.md                  # Este arquivo
```

---

<div align="center" style="margin-top: 2rem;">
  Criado por <a href="https://siteprofissional.pro" target="_blank" style="color: #2563eb; font-weight: bold;">siteprofissional.pro</a>
</div>
