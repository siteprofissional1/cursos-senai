# Especificação Técnica do Sistema (SDD): EduScore

> **Documento:** Diretiva de Engenharia e Arquitetura de Software  
> **Classificação:** Camada 1 (Estratégia & Especificação Canônica)  
> **Perfil:** Padrão SENAI - Desenvolvimento Full-Stack de Alta Performance  
> **Versão:** 2.0 (Consolidada com Todas as Melhorias e Módulos Analíticos)

---

## 1. Visão Geral e Propósito

O **EduScore** é uma plataforma analítica educacional de alta performance desenvolvida para processar, auditar, cruzar e visualizar os indicadores oficiais dos **Microdados do ENEM 2025 (+4,81 milhões de registros)**. 

O projeto combina:
1. **Engenharia de Dados de Alta Performance:** Ingestão massiva em lote via **DuckDB** e **Polars**, atingindo tempos de resposta sub-segundo em agregações complexas sobre milhões de linhas.
2. **Telemetria em Tempo Real:** Streaming de progresso via **Server-Sent Events (SSE)**.
3. **Resolução Cadastral Multi-Provedor de Escolas:** Enriquecimento contínuo com cache permanente no DuckDB para obter Nomes Oficiais, Endereços e Telefones, com tratamento especializado para o **Sigilo Estatístico do INEP (LGPD)**.
4. **Anonimização Humanizada de Estudantes:** Geração determinística de nomes realistas brasileiros para os participantes a partir do hash do número de inscrição e gênero, preservando a privacidade dos dados.
5. **Dashboard Analítico Comparativo de Alto Impacto:** Gráficos de rosca (Donut charts) de presença/abstenção, gráfico de colunas agrupadas lado a lado (Brasil vs. Filtro) e rankings Top 10 com explosão interativa por matéria e por escola.
6. **Automação Turnkey:** Scripts nativos para Windows (`executar.bat` e `encerrar.bat`) permitindo execução em 1 clique fora de qualquer IDE.

* **Motor de Desenvolvimento:** Google Antigravity + Gemini 3.8 Flash High
* **Princípios de Engenharia:** Clean Code, SOLID, Mobile-First, Spec-Driven Development (SDD), Zero-Hallucination em métricas analíticas.

---

## 2. Arquitetura e Stack Tecnológica

### 2.1. Backend (API, Dados & Análise)
* **Linguagem & Framework:** Python 3.10+ (homologado em Python 3.12 e 3.14) com **FastAPI** assíncrono e **Uvicorn**.
* **Motor OLAP Massivo:** **DuckDB** com leitura colunar vetorial, indexação sobre `data/processed/eduscore.duckdb` e agregações em memória sem estourar RAM.
* **Processamento de Censo e Presença:** **Polars** para manipulação veloz de DataFrames e pré-cálculo de presenças/abstenções (`data/processed/geo_attendance.json`).
* **Leitura de Dicionários Oficiais:** `openpyxl` para extração de domínios e rótulos do arquivo `.xlsx` em `data/microdados_enem_2025/DICIONÁRIO/`.
* **Parser de Scripts do INEP:** Módulo para ler posicionamento e tipagem em `INPUTS/` (`.R`, `.sas`).
* **Enriquecimento Cadastral Multi-Provedor:** Web scraping assíncrono (`httpx` + `BeautifulSoup4`) com catálogo curado de colégios protegidos por sigilo (`KNOWN_SCHOOLS_CATALOG`), consulta secundária ao QEdu/BuscaEscola e fallback institucional nobre.

### 2.2. Frontend (Single-Page Workspace)
* **Framework:** **React 19** com **Vite** e **TypeScript** estruturado.
* **Estilização:** **Tailwind CSS v4** (tema Light Mode moderno, clean data intelligence).
* **Ícones:** `lucide-react` com badges semânticos.
* **Comunicação com Backend:** Fetch assíncrono tipado com proxy reverso no Vite (`/api -> http://localhost:8000`).
* **Persistência de Estado:** Sincronização automática de filtros via `localStorage` e URL query parameters.

---

## 3. Estrutura de Diretórios do Projeto

```text
eduscore/
├── data/
│   ├── microdados_enem_2025/
│   │   ├── DADOS/                  # Arquivo bruto MICRODADOS_ENEM_2025.csv (+4.81M linhas)
│   │   ├── DICIONÁRIO/             # Planilha .xlsx com metadados oficiais do INEP
│   │   └── INPUTS/                 # Scripts oficiais (.R, .sas) para tipagem de colunas
│   └── processed/
│       ├── eduscore.duckdb         # Banco analítico DuckDB indexado (tabelas: participantes, escolas)
│       ├── geo_hierarchy.json      # Árvore hierárquica cacheada (Região -> UF -> Municípios)
│       └── geo_attendance.json     # Estatísticas pré-consolidadas de presença e abstenção
├── backend/
│   ├── app/
│   │   ├── core/                   # Configurações globais e conexão com o DuckDB
│   │   ├── routers/
│   │   │   ├── status.py           # Status do sistema e contadores
│   │   │   ├── ingestion.py        # Stream SSE e rotina de ingestão massiva
│   │   │   ├── filters.py          # Hierarquia geográfica em cascata
│   │   │   ├── analytics.py        # Médias Brasil vs Filtro e Dashboard completo
│   │   │   ├── schools.py          # Listagem de escolas, ranking e detalhes dos alunos
│   │   │   └── rag.py              # Agente de dicionário de dados do INEP
│   │   ├── services/
│   │   │   ├── school_scraper.py   # Multi-provedor cadastral de escolas e sigilo INEP
│   │   │   ├── student_service.py  # Gerador determinístico humanizado de nomes de alunos
│   │   │   ├── input_parser.py     # Parser dos scripts SAS/R
│   │   │   └── dictionary_reader.py# Leitor do dicionário .xlsx
│   │   ├── schemas.py              # Contratos Pydantic sincronizados
│   │   └── main.py                 # Ponto de entrada FastAPI com middlewares de CORS
│   ├── tests/
│   │   └── test_api.py             # 14 testes de integração automatizados (pytest)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx          # Telemetria massiva, status e tags de arquivos
│   │   │   ├── FilterBar.tsx       # Filtros em cascata com persistência em localStorage
│   │   │   ├── PerformanceCards.tsx# Cards de benchmark Nacional vs. Filtro
│   │   │   ├── AnalyticsDashboard.tsx # Donuts, Gráfico de Colunas e Top 10 com drill-down
│   │   │   ├── SchoolExplorer.tsx  # Grid de escolas com badges de rede e sigilo INEP
│   │   │   └── SchoolDrawer.tsx    # Drawer lateral com dados cadastrais e boletim dos alunos
│   │   ├── services/api.ts         # Camada de comunicação com a API
│   │   ├── types/index.ts          # Tipagens TypeScript compartilhadas
│   │   ├── App.tsx                 # Single-Page Workspace unificado
│   │   ├── main.tsx
│   │   └── index.css               # Design tokens e Tailwind CSS v4
│   ├── vite.config.ts              # Configuração Vite com proxy /api -> porta 8000
│   └── package.json
├── documentation/
│   ├── directives/                 # Diretivas e SOPs das Camadas 1 e 3
│   │   ├── projeto.md              # Esta especificação técnica
│   │   ├── design/design.md        # Guia visual e arquitetura de telas
│   │   └── script-executar-bat.md  # SOP de inicialização turnkey
│   └── promptHistory.md            # Rastreabilidade integral de todos os prompts
├── execution/                      # Scripts determinísticos de processamento em lote
│   ├── generate_geo_attendance.py  # Consolidação de presença/abstenção
│   └── enrich_all_schools_multiprovider.py # Enriquecimento em lote no DuckDB
├── executar.bat                    # Script turnkey de inicialização em 1 clique
├── encerrar.bat                    # Finalizador limpo de serviços e portas TCP
└── README.md                       # Documentação técnica bilíngue do projeto
```

---

## 4. Regras de Negócio Críticas e Decisões de Arquitetura

### 4.1. Auditoria e Transparência: Censo Total vs. Participantes Avaliados
Nos microdados do ENEM, existe uma diferença conceitual mandatória que deve ser refletida na UI e na API:
* **Total de Registros do Censo (Inscritos):** `4.810.772` registros no CSV.
* **Participantes Efetivamente Avaliados:** `3.473.543` registros (inscritos presentes que obtiveram notas válidas nas provas).
* **Diretriz de Transparência:** O Header e os endpoints devem exibir com clareza o total geral de registros processados (`4.81M`) e a quantidade de estudantes avaliados com notas (`3.47M`), eliminando qualquer falsa impressão de perda de dados.

### 4.2. Tratamento do Sigilo Estatístico do INEP e Nomes de Escolas
* **O Problema Regulatório:** Por determinação da LGPD e salvaguarda estatística do INEP, escolas com turmas reduzidas (<10 avaliados) têm seu código de 8 dígitos substituído por identificadores fictícios de sigilo na faixa `60000000+` (ex.: `60006573`).
* **A Solução Multi-Provedor:**
  1. **Catálogo Curado (`KNOWN_SCHOOLS_CATALOG`):** Mapeamento prioritário de colégios tradicionais sob sigilo (ex.: `60006573` -> `Colégio e Curso Motiva (Unidade João Pessoa)`).
  2. **Scraper Secundário:** Consulta aos portais públicos QEdu e BuscaEscola.
  3. **Fallback Institucional Elegante:** Nenhuma escola deve exibir rótulos sintéticos ou números no nome como `(INEP #...)`. Quando não houver nome específico de fachada, aplica-se a nomenclatura nobre: `Colégio Particular de {Município} ({UF})` ou `Escola Estadual de {Município} ({UF})`.
  4. **Badge Visual de Sigilo:** Ativação do atributo booleano `is_sigilo_inep: true`, renderizando na interface o badge `🔒 Sigilo INEP` com tooltip explicativo sobre proteção estatística de turmas reduzidas.
  5. **Hidratação Imediata no Primeiro Carregamento:** A busca por município deve retornar os nomes das escolas imediatamente já na primeira chamada (sem necessidade de recarregar a página).

### 4.3. Anonimização Humanizada de Alunos
* O INEP não divulga os nomes dos estudantes nos microdados públicos por motivos de privacidade.
* O sistema implementa o serviço `student_service.py` que gera deterministamente um nome e sobrenome brasileiro consistente (ex: "Gabriel Santos Oliveira", "Beatriz Costa Silva") combinando o hash MD5/SHA do `NU_INSCRICAO` com o campo `TP_SEXO`.
* O número de inscrição permanece acessível em badge secundário discreto.

### 4.4. Precisão Decimal e Nomenclatura das Áreas
* **Arredondamento:** Todas as notas individuais e médias de escolas e regiões devem ser estritamente arredondadas a **1 casa decimal** (função `_round1()`), evitando dízimas como `654.8999999999999` que estouram o layout visual dos cards.
* **Nomenclatura Canônica das Áreas:**
  * `Ciências da Natureza (CN)`
  * `Ciências Humanas (CH)`
  * `Linguagens e Códigos (LC)`
  * `Matemática (MT)`
  * `Redação`
  * `Média Geral`

### 4.5. Dashboard Analítico Comparativo (Substituindo o Botão RAG)
O botão isolado de "Perguntar ao RAG" foi removido da interface principal. Em seu lugar, foi criada uma seção de inteligência visual antes da listagem de escolas:
1. **Donut Charts de Participação (SVG):**
   * Avaliados vs. Abstenções no Brasil.
   * Avaliados vs. Abstenções no Filtro Selecionado.
2. **Gráfico de Colunas Agrupadas Lado a Lado (Side-by-Side Clustered Columns):**
   * Comparação vertical lado a lado (Brasil em azul vs. Filtro em verde esmeralda) para Média Geral e para cada uma das 5 áreas do exame.
   * Indicador visual de diferencial (`▲ +X.X pts` ou `▼ -X.X pts`).
   * Escala de 0 a 1000 pontos e cards de síntese no rodapé.
3. **Rankings Top 10 Escolas:**
   * Top 10 Melhores Escolas do Brasil.
   * Top 10 Melhores Escolas do Filtro.
   * Seletor de explosão para reorganizar os rankings por qualquer uma das áreas avaliadas.
   * Drill-down retrátil para visualizar o boletim da escola diretamente no ranking.

### 4.6. Persistência de Filtros
* Todos os seletores da barra superior salvam seu estado no `localStorage` do navegador (`eduscore_filters_v2`), restaurando imediatamente a seleção (Região, UF, Município, Rede) quando o usuário atualiza a página (`F5`).

---

## 5. Contratos de API (FastAPI)

### `GET /api/status`
Retorna arquivos detectados, total de inscritos no censo (`total_rows: 4810772`) e total de avaliados (`evaluated_rows: 3473543`).

### `GET /api/filters/locations`
Retorna a árvore hierárquica cacheada de Regiões, UFs e Municípios disponíveis para os comboboxes.

### `GET /api/analytics/summary`
Parâmetros: `regiao`, `uf`, `municipio`, `dependencia_adm`, `localizacao`.
Retorna os comparativos das 5 notas e da média geral entre o Brasil e o filtro selecionado.

### `GET /api/analytics/dashboard`
Parâmetros: `regiao`, `uf`, `municipio`, `dependencia_adm`, `localizacao`.
Retorna:
* `top_brasil`: Top 10 escolas nacionais.
* `top_filtro`: Top 10 escolas no filtro ativo.
* `nacional_scores`: Médias nacionais das 5 matérias e geral.
* `filtro_scores`: Médias do filtro das 5 matérias e geral com percentual comparativo.
* `attendance_brasil`: Estatísticas de inscritos, avaliados e taxa de abstenção nacional.
* `attendance_filtro`: Estatísticas de inscritos, avaliados e taxa de abstenção da localidade.

### `GET /api/schools`
Parâmetros: `uf`, `municipio`, `dependencia_adm`, `search`, `sort_by`, `page`, `limit`.
Retorna a lista paginada de escolas com nomes 100% hidratados, códigos INEP, rede administrativa, total de alunos avaliados, média geral e flag `is_sigilo_inep`.

### `GET /api/schools/{co_escola}/details`
Retorna dados cadastrais da escola (Nome Oficial, Endereço, Telefone, Rede, `is_sigilo_inep`), médias por matéria e a lista completa dos alunos daquela escola com nomes humanizados, número de inscrição e notas por matéria arredondadas a 1 casa decimal.

---

## 6. Roteiro Acelerado de Implementação para Alunos (Fast-Track)

Ao recomeçar o projeto do zero com os alunos, siga este passo a passo sequencial para alcançar a arquitetura final em tempo recorde:

```
[Etapa 1: Estrutura & DuckDB] ──> [Etapa 2: Multi-Provedor Escolas] ──> [Etapa 3: API FastAPI]
                                                                                │
[Etapa 6: Automação .BAT]    <── [Etapa 5: Dashboard Visual]     <── [Etapa 4: Frontend React]
```

### Passo 1: Ingestão Massiva Direta no DuckDB
* Criar o script de ingestão que lê `MICRODADOS_ENEM_2025.csv` em blocos colunares via DuckDB, gerando as tabelas:
  * `participantes` (indexada por `CO_ESCOLA`, `SG_UF_PROVA`, `CO_MUNICIPIO_PROVA`).
  * `escolas` (resumo pré-agregado com total de alunos e médias das 5 notas).
* Pré-calcular o arquivo `data/processed/geo_attendance.json` com presença/abstenção por UF e Região.

### Passo 2: Implementação do Serviço Multi-Provedor de Escolas
* Criar `backend/app/services/school_scraper.py` contendo:
  * O dicionário `KNOWN_SCHOOLS_CATALOG` com as escolas de sigilo INEP mapeadas.
  * O crawler secundário assíncrono para QEdu.
  * A função de fallback com formatação institucional nobre.
  * O detector de sigilo estatístico `is_sigilo_inep()`.
* Criar `backend/app/services/student_service.py` com o algoritmo de nomes humanizados brasileiros.

### Passo 3: Criação dos Endpoints da API FastAPI
* Implementar os roteadores modulares em `backend/app/routers/` (`status`, `filters`, `analytics`, `schools`).
* Aplicar o helper `_round1()` em todas as saídas numéricas de notas.
* Validar a suíte de testes com `pytest backend/tests/test_api.py`.

### Passo 4: Estruturação do Frontend (Vite + React 19 + Tailwind v4)
* Configurar o proxy reverso em `frontend/vite.config.ts`.
* Criar os tipos TypeScript em `frontend/src/types/index.ts`.
* Implementar o `Header.tsx` com telemetria dos 4.81M de inscritos e 3.47M de avaliados.
* Implementar a `FilterBar.tsx` com persistência em `localStorage`.

### Passo 5: Construção do Dashboard Analítico e Explorador
* Implementar `AnalyticsDashboard.tsx` contendo:
  * Donut charts de presença e abstenção (SVG responsivo).
  * Side-by-side grouped column chart (Brasil vs. Filtro por matéria).
  * Rankings Top 10 com seletor de matérias e expansão retrátil de escolas.
* Implementar `SchoolExplorer.tsx` e `SchoolDrawer.tsx` com listagem de estudantes humanizados e badge `🔒 Sigilo INEP`.

### Passo 6: Criação dos Scripts Turnkey
* Criar `executar.bat` e `encerrar.bat` na raiz do projeto para permitir execução imediata com 1 clique fora do Antigravity.