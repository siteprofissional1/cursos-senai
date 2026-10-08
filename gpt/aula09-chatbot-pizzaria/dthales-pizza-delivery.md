# Plano de Implementação - D Thales Pizza Delivery

## 1. Visão Geral do Projeto
Desenvolvimento de uma solução web moderna, atrativa e de alta conversão para a **D Thales Pizza Delivery** (Ourinhos - SP), composta por:
1. **Landing Page Institucional e Promocional** (`/frontend/index.html`): Apresentação da marca, galeria de destaques do cardápio, depoimentos, diferenciais artesanais, horário de funcionamento em tempo real, localização e Call to Action (CTA) proeminente.
2. **Sistema de Pedidos Interativo via Chatbot** (`/frontend/pedido/index.html`): Experiência guiada e conversacional para montagem de pedidos de pizzas (Pequena e Grande, até 2 sabores), bordas recheadas, bebidas, observações personalizadas, cálculo dinâmico de valores e despacho automatizado para o WhatsApp oficial `(14) 99608-1601`.
3. **Identidade Visual**: Estilo *Trattoria Moderna e Vibrante* com tons claros acolhedores, vermelho napolitano, verde manjericão fresco, dourado do forno e tipografia refinada.
4. **Estrutura de Pastas Padrão**:
   - `/frontend`: Interface completa (Landing Page, Chatbot, assets de estilos e imagens).
   - `/backend`: Estrutura de serviços, API mock / simulação de pedidos e regras de negócio.
   - `/documentation`: Histórico de prompts (`promptHistory.md`), especificações e arquitetura.
   - `README.md`: Documentação bilíngue (PT-BR / EN) com badges e destaque ao Google Antigravity.
   - Rodapé com assinatura obrigatória: `Criado por siteprofissional.pro`.

---

## 2. Análise Crítica do Código Anterior (Chatbot Pizzaria Fornalha)
- **Pontos Positivos Identificados**:
  - Máquina de estados conversacional simples e funcional em JavaScript puro.
  - Verificação de horário de funcionamento com bloqueio por modal/overlay.
  - Coleta sequencial de dados para entrega e retirada.
  - Geração de mensagem codificada para o WhatsApp.
- **Limitações e Gaps a Superar**:
  - Falta de landing page institucional: o usuário caía direto numa tela escura sem contexto da marca.
  - Não calculava o valor total do pedido em tempo real (deixava o cliente sem saber o subtotal).
  - Sem categorização ou busca para dezenas de sabores (lista com dezenas de botões empilhados causava fadiga de rolagem).
  - Identidade visual escura genérica sem elementos fotográficos ou atmosfera de pizzaria.
  - Horários e dados da empresa antiga hardcoded.

---

## 3. Especificações Técnicas e Arquitetura
- **Frontend Stack**: HTML5 Semântico, CSS3 Moderno (Custom Properties, Grid, Flexbox, Micro-interações), JavaScript ES6+ modular.
- **Cardápio Base (D Thales Delivery - iFood)**:
  - **Tamanhos**:
    - *Pequena*: Salgada (R$ 40,00) / Doce (R$ 40,00 - 4 pedaços).
    - *Grande*: Salgada 8 pedaços (a partir de R$ 60,00, até 2 sabores) / Doce 8 pedaços (a partir de R$ 68,00, até 2 sabores).
  - **Mais de 30 Sabores cadastrados com ingredientes detalhados**:
    - *Salgadas*: Vegetariana, Strogonoff de Carne, Siciliana, Portuguesa, Palmito Especial, Palmito, Napoletana, Mussarela, Milho Verde, Marguerita, Lombo, Lenheira, Hot Dog, Fricassê, Frango com Catupiry, Frango, Francesa, Escarola, Doritos, Do Cheff, Delicia, Da Gleice, Dadona, Croata, Catulombo, Canadense, Campineira, Calabresa, Caipira, Brócolis, Burguesa, Bauru, Baiana, Atum, Americana, 5 Queijos, 4 Queijos.
    - *Doces*: Chocolate, Romeu e Julieta, etc.
  - **Bordas**:
    - Salgadas: Mussarela (+R$ 12), Catupiry (+R$ 7), Cheddar (+R$ 9), Presunto e Mussarela (+R$ 18).
    - Doces: Chocolate (+R$ 18), Romeu e Julieta (+R$ 18).
  - **Bebidas**:
    - Coca-Cola Original 2L (R$ 16,00), Coca-Cola Zero 2L (R$ 16,00), Fanta Laranja 2L (R$ 14,00), Guaraná Conquista 2L (R$ 9,00).
- **Horário de Funcionamento Oficial**:
  - Segunda a Domingo: 18:30 às 23:30.
- **Integração Externa**:
  - WhatsApp: `5514996081601`
  - Instagram: `https://www.instagram.com/dthalespizza/`
  - Facebook: `https://www.facebook.com/Dthalespizza/`
  - Google Maps: `https://share.google/U6z1ScsJX85yfl40X`

---

## 4. Cronograma de Execução e Responsabilidades dos Agentes
1. **Fase 1 (Design & Ativos)**: Geração de imagens apetitosas e tokens de estilo (*Trattoria Moderna*).
2. **Fase 2 (Landing Page - `/frontend/index.html`)**:
   - Header com navegação e status de funcionamento aberto/fechado em tempo real.
   - Hero Section convidativa com botão de ação direta para o Chatbot (`/pedido`).
   - Seção "Sobre Nós & Tradição" e Diferenciais (Massa artesanal, ingredientes selecionados).
   - Menu Preview interativo com fotos e detalhes dos sabores mais pedidos.
   - Seção de Depoimentos e Avaliações reais de Ourinhos.
   - Informações de Contato, Endereço com link para o Google Maps e Redes Sociais.
   - Rodapé com créditos de `siteprofissional.pro`.
3. **Fase 3 (Chatbot de Pedidos - `/frontend/pedido/index.html`)**:
   - Interface conversacional aprimorada com avatar da D Thales, status dinâmico e som/efeitos sutis.
   - Abas de categorias (Todas, Tradicionais, Especiais, Doces) e barra de busca instantânea de sabores.
   - Montagem de pizza com cálculo de preço exato, seleção de 1 ou 2 sabores, bordas e personalização.
   - Carrinho dinâmico com subtotal visível a qualquer momento.
   - Coleta de dados completa para entrega/retirada e troco.
   - Geração de mensagem estruturada e link do WhatsApp.
4. **Fase 4 (Backend Mock & Documentação)**:
   - Configuração de `/backend` com catálogo estruturado em JSON e servidor demonstrativo.
   - `README.md` completo e bilíngue na raiz.
   - Verificação de código e links.
