# Plano de Desenvolvimento: Chatbot Especialista na Norma 1000 da ANEEL

## 1. Visão Geral
Desenvolvimento de uma aplicação web completa (HTML, CSS e JavaScript integrados em arquivo único) para atender atendentes de concessionárias e consumidores finais. O assistente é especialista estrito na Resolução Normativa ANEEL nº 1.000/2021 (Regras de Prestação do Serviço Público de Distribuição de Energia Elétrica), utilizando a API do Google AI Studio (Gemini).

## 2. Requisitos Atendidos
- **Base de Conhecimento:** Resolução Normativa nº 1.000/2021 da ANEEL (REN 1000 extraída e estruturada a partir do PDF oficial de 266 páginas).
- **Escopo Estrito:** O assistente responde exclusivamente sobre energia elétrica e regulamentações da REN 1000/ANEEL, recusando formalmente e educadamente qualquer tema alheio.
- **Integração Gemini:**
  - Chave de API configurável via variável de ambiente ou arquivo local seguro.
  - Lista dinâmica de modelos via API Google AI Studio.
  - Mecanismo de failover automático para erros 503, 429 ou falhas temporárias, alternando para o próximo modelo testado e funcional.
  - Modelos pré-validados no ambiente: `gemini-flash-latest`, `gemini-3.1-flash-lite`, `gemini-flash-lite-latest`, `gemini-3.5-flash`, `gemini-3.7-flash`, `gemini-3.8-flash`, `gemma-4-26b-a4b-it`.
- **Interface e Experiência (UI/UX):**
  - Paleta com Branco puro, Azul elétrico (#0284c7 / #1e40af / #0f172a) e Detalhes Amarelos relâmpago (#eab308 / #facc15).
  - Animações sutis de raios de energia elétrica em SVG e gradientes vivos.
  - Alternador de perfil de público: Modo "Atendente Técnico" (com artigos, prazos exatos e fundamentação legal) vs Modo "Consumidor Final" (linguagem clara, direta e orientações práticas de direitos).
  - Sugestões de perguntas rápidas (chips de temas mais comuns).
  - Exportação de histórico de conversa e formatação Markdown nas respostas.
- **Rodapé Obrigatório:** "Criado por [siteprofissional.pro](https://siteprofissional.pro)" centralizado na última linha com link azul.
- **Organização do Repositório:**
  - `/frontend`: Aplicação `index.html`.
  - `/backend`: Scripts auxiliares de extração e documentação de integração.
  - `/documentation`: Histórico de prompts (`promptHistory.md`) e documentação técnica.
  - `README.md`: Bilíngue com destaque ao Google Antigravity e perfis de agentes.

## 3. Fases de Execução
1. **Fase 1 (Planejamento e Dados):** Extração completa e sintetização dos principais artigos e diretrizes da REN 1000 em base de conhecimento estruturada.
2. **Fase 2 (Desenvolvimento do Frontend):** Construção da interface responsiva e visual de alta fidelidade com efeitos elétricos e chat interativo.
3. **Fase 3 (Lógica de IA e Failover):** Implementação da chamada à API Gemini com streaming/geração de conteúdo, prompt de sistema especialista e fallback automático entre modelos.
4. **Fase 4 (Validação e Testes):** Testes em navegador, verificação de responsividade, validação de segurança e conformidade de regras.
