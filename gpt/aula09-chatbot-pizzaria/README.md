# 🍕 D Thales Pizza Delivery — Landing Page & Chatbot Interativo

<div align="center">

![Google Antigravity](https://img.shields.io/badge/Powered%20By-Google%20Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white)
![SENAI](https://img.shields.io/badge/SENAI-Ourinhos%20Edition-E31B23?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

<p align="center">
  <b>Solução completa de presença digital e pedidos automatizados para a D Thales Pizza Delivery (Ourinhos - SP)</b><br>
  <i>A complete digital presence and automated ordering solution for D Thales Pizza Delivery (Ourinhos - SP)</i>
</p>

</div>

---

## 🇧🇷 Português (Brasil)

### 📌 Visão Geral do Projeto
O projeto **D Thales Pizza Delivery** combina uma **Landing Page Institucional** de alta conversão no estilo *Trattoria Moderna e Vibrante* com um **Chatbot Interativo de Pedidos** integrado diretamente ao WhatsApp oficial da pizzaria.

Desenvolvido com foco no padrão de ensino e desenvolvimento do **SENAI**, utilizando a plataforma de inteligência artificial generativa **Google Antigravity**.

### 🌟 Principais Recursos
1. **Landing Page (`/frontend/index.html`)**:
   - Visual gastronômico acolhedor (Off-White, Vermelho Napolitano, Verde Manjericão e Dourado do Forno).
   - Indicador de status de abertura em tempo real (**Segunda a Domingo, das 18:30 às 23:30**).
   - Imagens em alta resolução de pizzas artesanais geradas por IA.
   - Chamadas diretas (CTA) para o fluxo de pedido.
   - Integração com Google Maps, Instagram oficial (`@dthalespizza`) e Facebook.
2. **Chatbot de Pedidos (`/frontend/pedido/index.html`)**:
   - Máquina de estados conversacional intuitiva.
   - **Mais de 35 sabores** baseados no cardápio real do iFood da D Thales.
   - **Busca instantânea e abas de categorias** (Tradicionais, Especiais Gourmet e Doces).
   - Suporte a tamanhos Pequena (1 sabor) e Grande (até 2 sabores, metade/metade).
   - Bordas recheadas doces e salgadas (Catupiry, Cheddar, Mussarela, Chocolate, Romeu e Julieta).
   - Cálculo dinâmico e transparente de preços em tempo real com barra de subtotal no topo.
   - Fluxo completo para Delivery (coleta de endereço completo) ou Retirada no Balcão.
   - Formas de pagamento (Cartão, Pix, Dinheiro com troco).
   - Despacho automático formatado profissionalmente para o WhatsApp `(14) 99608-1601`.
3. **Backend Didático (`/backend/server.js`)**:
   - Servidor Node.js nativo com API REST (`/api/cardapio`, `/api/horario-status`).
   - Base de dados estruturada em `cardapio.json`.
4. **SEO Local & GEO (Generative Engine Optimization)**:
   - Meta tags geográficas (`geo.position`, `geo.placename`, `geo.region`) calibradas para Ourinhos - SP.
   - Dados Estruturados Schema.org completos (`Pizzeria`, `FAQPage`, `BreadcrumbList`, `OrderAction`).
   - Seção de cobertura dos principais bairros de Ourinhos (Jardim São Silvestre, Centro, Matilde, Vila Nova Sá, etc.).
   - FAQ estratégico otimizado para citação por IA generativa (Perplexity, ChatGPT, Claude, Gemini).
   - `sitemap.xml` e `robots.txt` configurados para indexação veloz.

### 🤖 Agentes e Skills Utilizados (Google Antigravity)
- **Agentes**: `project-planner`, `frontend-specialist`, `backend-specialist`, `seo-specialist`, `documentation-writer`, `test-engineer`.
- **Skill Packs**: `@seo-fundamentals`, `@geo-fundamentals`, `@frontend-design`, `@clean-code`, `@nodejs-best-practices`, `@api-patterns`, `@documentation-templates`.

### 📁 Estrutura de Pastas
```text
0210-chatbotpizzaria/
├── frontend/
│   ├── index.html            # Landing Page Institucional
│   ├── pedido/
│   │   └── index.html        # Chatbot de Pedidos Interativo
│   └── assets/
│       └── images/           # Fotos das pizzas e ambiente trattoria
├── backend/
│   ├── server.js             # Servidor Node.js e API REST
│   ├── cardapio.json         # Base de dados estruturada
│   └── package.json          # Manifesto do backend
├── documentation/
│   └── promptHistory.md      # Histórico completo dos prompts da sessão
├── dthales-pizza-delivery.md # Plano de tarefas e arquitetura
└── README.md                 # Documentação bilíngue
```

### 🚀 Como Executar o Projeto
#### Opção 1: Execução Direta (Sem dependências)
- Basta abrir o arquivo `frontend/index.html` em qualquer navegador web ou com a extensão **Live Server** do VS Code / Antigravity IDE.
- Para testar o chatbot diretamente, abra `frontend/pedido/index.html`.

#### Opção 2: Servidor Node.js Integrado
No terminal, execute:
```bash
cd backend
node server.js
```
Acesse no seu navegador:
- **Landing Page**: `http://localhost:3000`
- **Chatbot de Pedidos**: `http://localhost:3000/pedido`
- **API do Cardápio**: `http://localhost:3000/api/cardapio`

---

## 🇺🇸 English

### 📌 Project Overview
The **D Thales Pizza Delivery** project delivers a high-converting **Institutional Landing Page** styled with a *Modern & Vibrant Italian Trattoria* visual, paired with an **Interactive Ordering Chatbot** that sends formatted orders straight to the pizzeria's official WhatsApp.

Built under **SENAI** vocational coding standards utilizing **Google Antigravity** generative development workflows.

### 🌟 Key Features
- **Modern Trattoria Aesthetic**: Warm cream base, Neapolitan red accents, fresh basil green, and wood-fired oven gold.
- **Real-Time Opening Hours**: Automatically detects business hours (**Monday to Sunday, 6:30 PM to 11:30 PM**).
- **Interactive Conversational Flow**: Step-by-step pizza customization (Small & Large sizes, up to 2 flavors, stuffed crusts, drinks, custom notes).
- **Search & Category Filters**: Instant search bar and category tabs to navigate 35+ flavors with zero friction.
- **Real-Time Dynamic Total Calculation**: Transparent pricing subtotal bar updated live.
- **WhatsApp Integration**: Sends structured order summaries directly to `+55 (14) 99608-1601`.

### 🚀 How to Run
- Double click `frontend/index.html` in your browser or run via Live Server.
- Or start the Node.js server via `node backend/server.js` and visit `http://localhost:3000`.

---

<div align="center">
  <sub>Criado com o apoio de <b>Google Antigravity</b> • SENAI Ourinhos Edition</sub><br>
  <sub>Criado por <a href="https://siteprofissional.pro" style="color: #2563eb;" target="_blank">siteprofissional.pro</a></sub>
</div>
