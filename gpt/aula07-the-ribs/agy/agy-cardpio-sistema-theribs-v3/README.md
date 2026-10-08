# 🍔 The Ribs Hamburgueria - Sistema Integrado de Pedidos & Cozinha (KDS)

[![Google Antigravity](https://img.shields.io/badge/Developed%20with-Google%20Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://antigravity.google)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![LocalStorage](https://img.shields.io/badge/Database-LocalStorage%20Realtime-brightgreen?style=for-the-badge)](#)
[![SENAI](https://img.shields.io/badge/SENAI-Ourinhos%20SP-005CA9?style=for-the-badge)](#)

---

## 🇧🇷 Português (Brasil)

### 📌 Sobre o Projeto
O **Sistema Integrado The Ribs Hamburgueria** é uma solução completa para pedidos e autoatendimento presencial ou delivery, desenvolvida para proporcionar agilidade e controle operacional. 

O projeto conta com:
1. **Cardápio Digital com Carrinho:** Permite ao cliente navegar pelas categorias (Ribs, Clássicos, Agridoce, Chicken, Kids, Smash, Vegetarianos), customizar quantidades, adicionar observações de preparo e gerenciar o carrinho de compras.
2. **Tela de Resumo do Pedido do Cliente:** Exibe número do pedido (`#TR-XXXX`), itens escolhidos, horário e **status dinâmico ao vivo** ("Em preparo" ou "Concluído/Pronto"), com opção adicional de envio para o WhatsApp.
3. **Painel KDS da Cozinha (Admin):** Tela gerencial para o time da cozinha visualizar pedidos em tempo real, conferir mesa/cliente, ler observações em destaque e alterar o status com um único clique no botão **"Marcar como Concluído / Entregue"**.
4. **Persistência via LocalStorage em Tempo Real:** Banco de dados local sincronizado instantaneamente entre abas através de listeners de eventos nativos do navegador (`window.addEventListener('storage')`).

---

### 🤖 Agentes e Skills do Google Antigravity Utilizados
Este projeto foi arquitetado e desenvolvido utilizando as melhores práticas do **Google Antigravity**:
- **Agentes Utilizados:**
  - `@[frontend-specialist]`: Engenharia de interface com foco em responsividade, acessibilidade e design rústico de alto padrão.
  - `@[product-owner]`: Refinamento de requisitos e condução da sessão interativa `/grill-me`.
  - `@[orchestrator]`: Organização estrutural e governança de tarefas.
- **Skill Packs:**
  - `@[skills/clean-code]`: Código limpo, sem dependências externas desnecessárias, performático e legível.
  - `@[skills/frontend-design]`: Identidade visual rústica, paleta de cores quentes e tipografia moderna.
  - `@[skills/brainstorming]`: Resolução do design tree com o usuário via entrevista ativa.

---

### 📂 Estrutura de Pastas do Projeto
```text
.
├── backend/
│   └── README.md                  # Especificações de dados e planos de migração
├── documentation/
│   ├── arquitetura.md             # Diagramas de fluxo e especificações técnicas
│   └── promptHistory.md           # Histórico integral de prompts da sessão
├── frontend/
│   ├── admin/
│   │   └── index.html             # Painel KDS da Cozinha com lista e botão de conclusão
│   └── cliente/
│       └── index.html             # Cardápio online, carrinho e resumo do pedido
├── index.html                     # Portal central com links para Cliente e Cozinha
└── README.md                      # Documentação oficial do projeto
```

---

### 🚀 Como Executar o Projeto
1. Clone ou abra a pasta do projeto no VS Code / Google Antigravity.
2. Para testar a sincronização em tempo real entre cliente e cozinha:
   - Abra o arquivo `frontend/cliente/index.html` em uma aba do navegador.
   - Abra o arquivo `frontend/admin/index.html` em outra aba (ou janela dividida).
   - Monte um pedido na aba do cliente e clique em **"Enviar Pedido para a Cozinha"**.
   - Veja o pedido aparecer instantaneamente na aba da cozinha com alerta sonoro!
   - Clique em **"Marcar como Concluído / Entregue"** na cozinha e veja a tela de resumo do cliente atualizar na hora para **"Concluído"**!

---

## 🇺🇸 English

### 📌 About the Project
The **The Ribs Burger Integrated Ordering & KDS System** is a complete, zero-dependency web solution for digital restaurant menus and kitchen display operations.

Key Features:
1. **Interactive Digital Menu & Cart:** Full category filtering, customization with custom preparation notes, and smooth cart drawer.
2. **Real-time Order Summary Screen:** Generates a unique order ID (`#TR-XXXX`), displays items and live status updates synchronized directly from the kitchen.
3. **Kitchen Display System (KDS Admin):** Clean and high-contrast kitchen dashboard with audio alerts, detailed order cards, and a single-click action to **"Mark as Completed / Delivered"**.
4. **Realtime LocalStorage Sync:** Instant cross-tab data synchronization powered by the native `storage` event API.

### 🤖 Google Antigravity AI Stack
- **Agents:** `frontend-specialist`, `product-owner`, `orchestrator`.
- **Skill Packs:** `clean-code`, `frontend-design`, `brainstorming`.

---

*Assinado: Agente Antigravity - SENAI Ourinhos Edition*
