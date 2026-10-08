# ⚡ Chatbot Especialista na Norma 1000 da ANEEL (REN 1000/2021)
### *ANEEL Regulation 1000 Expert AI Assistant for the Brazilian Electric Energy Sector*

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Antigravity-Engineered-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Antigravity" />
  <img src="https://img.shields.io/badge/Gemini%20API-Google%20AI%20Studio-EA4335?style=for-the-badge&logo=google&logoColor=white" alt="Gemini API" />
  <img src="https://img.shields.io/badge/Status-100%25%20Operacional-00C853?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Arquitetura-Single--File%20HTML%2FCSS%2FJS-0284c7?style=for-the-badge" alt="Single File" />
</p>

---

## 🇧🇷 Português (Brasil)

### 📌 Sobre o Projeto
O **Chatbot Especialista na Norma 1000 da ANEEL** é uma aplicação web interativa em arquivo único (HTML5, CSS3 e JavaScript puro) desenvolvida com assistência do **Google Antigravity**. O sistema foi concebido para atender tanto atendentes técnicos de distribuidoras de eletricidade quanto consumidores finais que necessitam consultar direitos, deveres, prazos e procedimentos regulatórios.

A inteligência é alimentada diretamente pela API do **Google AI Studio (Gemini)**, conectada a uma base de conhecimento sintetizada a partir da íntegra da **Resolução Normativa ANEEL nº 1.000/2021** (266 páginas oficiais).

### 🎯 Principais Funcionalidades
1. **Escopo Estrito e Especializado:** O assistente responde com exclusividade sobre energia elétrica e regulamentação da ANEEL, recusando formalmente e educadamente temas alheios ao setor elétrico.
2. **Dois Modos de Atendimento (Alternador de Perfil):**
   - **👤 Consumidor Final:** Respostas didáticas, linguagem clara, orientação de direitos e prazos práticos.
   - **⚡ Atendente Técnico:** Respostas aprofundadas com fundamentação jurídica, artigos da REN 1000 e procedimentos operacionais.
3. **Mecanismo de Failover Automático (Resiliência 503 / 429):**
   - Caso um modelo retorne código HTTP 503 (Serviço Indisponível) ou 429 (Limite Excedido), o sistema alterna automaticamente e de forma transparente para o próximo modelo prioritário:
     - `gemini-flash-latest` (Padrão)
     - `gemini-3.1-flash-lite` (Ultra rápido)
     - `gemini-flash-lite-latest`
     - `gemini-3.5-flash`
     - `gemini-3.7-flash`
     - `gemini-3.8-flash`
     - `gemma-4-26b-a4b-it`
4. **Interface Temática de Alta Estética:**
   - Paleta em Branco, Azul Elétrico Profundo e Dourado/Amarelo Raio.
   - Ícone de energia elétrica com pulsação e brilho neon.
   - Chips de perguntas rápidas (religação, corte na sexta-feira, queima de aparelhos, Tarifa Social, TOI).
   - Rodapé com créditos conforme diretriz: `Criado por siteprofissional.pro`.

### 🤖 Agentes e Skills do Google Antigravity Utilizados
- **Agentes:**
  - `orchestrator`: Coordenação global do fluxo de trabalho e roteamento.
  - `project-planner`: Elaboração do plano de execução e mapeamento de dependências.
  - `frontend-specialist`: Criação da interface com design system elétrico e responsividade.
  - `test-engineer`: Execução de benchmarks de latência dos modelos e validação de failover.
- **Skill Packs:**
  - `app-builder`: Estruturação da aplicação web moderna.
  - `frontend-design`: Aplicação de estética visual refinada, microanimações e contrastes de acessibilidade.
  - `clean-code`: Práticas de código limpo, comentado em português e sem dependências externas pesadas.

---

## 🇺🇸 English

### 📌 About the Project
The **ANEEL Regulation 1000 Expert Chatbot** is a self-contained single-file web application (HTML5, CSS3, and Vanilla JavaScript) developed with the assistance of **Google Antigravity**. Built for electric utility customer service representatives and end consumers, it provides accurate guidance on consumer rights, deadlines, and regulatory procedures under Brazilian electricity regulations.

Powered by the **Google AI Studio (Gemini) API**, the system grounds its answers on the official **ANEEL Normative Resolution No. 1,000/2021** (266 pages).

### 🚀 Key Features
- **Strict Domain Boundary:** Exclusively answers queries regarding electrical energy and ANEEL regulations, rejecting non-related topics.
- **Dual User Profiles:** Toggle between "End Consumer" (clear, rights-oriented) and "Technical Agent" (article-cited, regulatory rigor).
- **Auto-Failover Architecture:** Resilient automatic fallback mechanism when encountering HTTP 503 or 429 errors across multiple pre-tested Gemini models.
- **Vibrant Electric Theme:** Clean white canvas with electric blue gradients and lightning yellow accents.

---

## 📂 Estrutura do Repositório

```text
├── index.html                    # Aplicação completa pronta para abrir no navegador
├── REN1000.pdf                   # Documento oficial da Resolução Normativa ANEEL nº 1.000/2021
├── ren1000_texto.txt             # Extração integral de texto (UTF-8)
├── frontend/
│   └── index.html                # Código fonte da interface e lógica do cliente
├── backend/
│   └── gerar_base_conhecimento.py # Script de estruturação da base regulatória
├── documentation/
│   ├── base_conhecimento_ren1000.json # Base estruturada dos artigos e tópicos da REN 1000
│   ├── chatbot-aneel-norma-1000.md    # Plano de desenvolvimento da aplicação
│   └── promptHistory.md              # Histórico integral de prompts da sessão
└── README.md                     # Documentação oficial do projeto
```

---

<p align="center">
  Criado por <a href="https://siteprofissional.pro" style="color: #2563eb; font-weight: bold;">siteprofissional.pro</a>
</p>
