# Documentação de Arquitetura e Especificações - SENAI Ourinhos Landing Page Chatbot

## 1. Visão Geral do Projeto
A **Landing Page Inteligente do SENAI Ourinhos** foi desenvolvida para superar o portal legador institucional, proporcionando uma experiência de usuário (UX) moderna, rápida, visualmente atrativa e altamente funcional. A aplicação conta com um atendente virtual inteligente integrado ao corpo principal da página, facilitando o esclarecimento de dúvidas dos futuros alunos e a conversão de matrículas.

## 2. Decisões de Arquitetura e Design (Alinhadas via /grill-me)
- **Estrutura de Arquivo Único:** Todo o HTML5, CSS3 avançado e JavaScript modular foi unificado no arquivo `index.html` (com cópia espelhada em `/frontend/index.html`), permitindo execução direta em qualquer navegador sem necessidade de setup complexo de build.
- **Chatbot Central Interativo:** Em vez de apenas um ícone discreto no canto da tela, o assistente virtual atua como um hub central no corpo da página, com suporte a processamento de linguagem natural (NLP) local, chips de atalhos rápidos e ações dinâmicas.
- **Abas de Próximos Cursos por Mês:** Organização visual limpa e intuitiva, agrupando as turmas abertas por mês de início (Outubro, Novembro, Dezembro/Início de 2027), facilitando o planejamento do estudante.
- **Motor de Inteligência Local:** O bot processa intenções (horários, localização, cursos disponíveis por mês, bolsas/gratuidade, telefone, certificados, rotas no Google Maps e link de avaliações) sem dependência obrigatória de chaves de API pagas.
- **Tema Híbrido (Light / Dark Mode):** Alternador no cabeçalho permitindo ao usuário navegar no tema escuro tecnológico ou no tema claro institucional com fidelidade cromática à identidade SENAI.
- **Acessibilidade e SEO:** Metadados OpenGraph, hierarquia semântica de tags (h1, h2, nav, main, section, footer), contraste WCAG AAA e design totalmente responsivo para mobile, tablets e desktops.

## 3. Dados Oficiais Incorporados
- **Instituição:** Escola SENAI Ourinhos (Escola Vocacional em Ourinhos - SP)
- **Avaliações no Google:** Nota 4.9 estrelas com mais de 50 avaliações verificadas (Link: https://share.google/EQLw2guoxNLuFWTyE)
- **Endereço:** R. Vitório Christoni, 1500 - Vila São Luiz, Ourinhos - SP, CEP 19911-200
- **Telefone:** (14) 3302-1250 (com suporte a clique para discar e atalho no chat)
- **Horário de Funcionamento:**
  - Segunda a Sexta: 07:30 – 20:30
  - Sábado: 08:00 – 12:00
  - Domingo: Fechado
  - Indicador de status em tempo real (Aberto agora / Fechado) calculado dinamicamente via JS.
- **Redes Sociais:**
  - Instagram: https://www.instagram.com/senaiourinhos/
  - Facebook: https://www.facebook.com/senaisp.ourinhos/
  - LinkedIn: https://br.linkedin.com/company/senaisp-ourinhos

## 4. Rodapé e Atribuição Obrigatória
- O rodapé inclui na última linha, perfeitamente centralizado:
  `Criado por siteprofissional.pro` onde `siteprofissional.pro` é estilizado em azul e atua como hiperlink para o endereço oficial.
