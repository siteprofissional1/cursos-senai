# Histórico de Prompts - EduScore

Este documento mantém o registro cronológico integral de todas as interações e prompts executados no desenvolvimento da plataforma EduScore.

---

## Sessão 1 - 17/10/2026

### Prompt 1
```text
/agente-orquestrador /goal /grill-me execute o conteudo dos arquivos projeto.md e design.md 
leia e procese os dados considerando velocidade e nao alucine sobre o conteudo
```
* **Contexto:** Inicialização do ecossistema EduScore conforme especificações canônicas (`directives/projeto.md` e `directives/design/design.md`).
* **Ação:** Leitura e engenharia de dados massiva (DuckDB/Polars), backend FastAPI assíncrono, frontend React 19 + Tailwind v4 e scripts de automação.

### Prompt 2
```text
ele nao roda local? so funciona em local host? tentei abrir o index pelo explorer e nem foi
```
* **Contexto:** Dúvida conceitual sobre execução local vs. abertura direta do arquivo HTML (`file://`) no Windows Explorer.
* **Ação:** Explicação técnica sobre o funcionamento de SPAs modernas, protocolo HTTP local (`localhost` / `127.0.0.1`), segurança CORS e necessidade de backend para consultar o banco analítico DuckDB.

### Prompt 3
```text
/agente-orquestrador /goal /grill-me criou um portal q mostra somente a media do brasil e a media do local q eu selecionar tipo x cidade
vai comparar a media do pais com a cidade
e a lista com as 10 melhores e as 10 melhores de onde selecionei tipo x cidade

isso é o q tem

agora o que eu preciso avançar a idea

ele ta dando 1 possibilidade
existe o sisu e existe o fies e o prouni 
se eu selecion oo fies
apareceu q a primeira de x cidade é x escola
com essa nota de x cidade consegue fies onde, em qual ou quais cidades ou quais estado
mostrar em formato mapa e ou lista

eu escolho a cidade de birigui e quero ver onde da com o prouni no estado de sp
```
* **Contexto:** Expansão de escopo e novo módulo estratégico: Simulador Universitário de Oportunidades (SISU, ProUni e FIES).
* **Ação Executada:**
  1. Condução do alinhamento com a técnica `/grill-me` cobrindo cálculo da nota sugerida da escola 1º lugar, visualização híbrida Mapa/Lista, abas dedicadas para SISU/ProUni/FIES com critérios oficiais de elegibilidade, e integração com link rápido "Simular Oportunidades".
  2. Criação da diretiva operacional `directives/simulador-oportunidades.md` (Camada 1).
  3. Script determinístico `execution/generate_simulator_data.py` gerando 2.190 ofertas reais mapeadas por geolocalização e notas de corte (Camada 3).
  4. Criação do endpoint assíncrono `GET /api/simulador/oportunidades` em FastAPI e testes unitários com Pytest (11/11 aprovados).
  5. Desenvolvimento do componente frontend `SimulatorSection.tsx` com slider interativo, mapa SVG interativo e lista com filtros por curso/turno.
  6. Validação automatizada no navegador via `browser_subagent` com testes de fluxo em Desktop e verificação de responsividade mobile (375px/390px) e presença do rodapé obrigatório centralizado do `siteprofissional.pro`.
