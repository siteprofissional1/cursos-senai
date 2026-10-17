# 🎓 EduScore — Analytics & Inteligência de Microdados ENEM 2025

<div align="center">

![Google Antigravity](https://img.shields.io/badge/Developed%20With-Google%20Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![DuckDB](https://img.shields.io/badge/DuckDB-FFF000?style=for-the-badge&logo=duckdb&logoColor=black)
![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python 3.12](https://img.shields.io/badge/Python%203.12-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Plataforma Analítica Educacional de Alta Performance • Processamento Massivo dos Microdados Oficiais do ENEM 2025 (+4,81 Milhões de Registros)**

[Português](#-versão-em-português-brasil) • [English](#-english-version)

</div>

---

## 🇧🇷 Versão em Português (Brasil)

### 🚀 Visão Geral
O **EduScore** é uma plataforma analítica desenvolvida para processar, auditar, cruzar e visualizar os indicadores oficiais dos **Microdados do ENEM 2025 (+4.810.772 de registros)** com tempos de resposta sub-segundo em agregações complexas.

Desenvolvido com o auxílio do **Google Antigravity** e orquestrado via agentes especializados, o projeto segue o padrão **SENAI de Excelência Full-Stack**, combinando engenharia de dados colunar, arquitetura limpa (*Clean Code*) e interface moderna orientada ao usuário (*Mobile-First*).

---

### 🌟 Destaques Tecnológicos & Engenharia de Dados

1. **Ingestão Colunar Massiva (DuckDB & Polars):**
   - Agregações vetoriais sub-segundo sobre mais de **4,81 milhões de inscrições** e **3,47 milhões de participantes avaliados**.
   - Banco persistido e indexado em `data/processed/eduscore.duckdb` (149 MB comprimido), eliminando gargalos de memória.

2. **Auditoria Estatística e Transparência de Censo:**
   - Separação clara entre **Total do Censo Bruto (4.810.772 inscritos)** e **Estudantes Efetivamente Avaliados (3.473.543 com notas válidas)**.
   - Auditoria imediata de arquivos fonte: CSV, Dicionário oficial INEP em Excel e scripts de tipagem SAS/R.

3. **Resolução Cadastral Multi-Provedor & Sigilo INEP (LGPD):**
   - Tratamento especializado para escolas sob sigilo estatístico do INEP (`CO_ESCOLA >= 60000000`, turmas reduzidas com <10 alunos).
   - Catálogo curado (`KNOWN_SCHOOLS_CATALOG`) para instituições tradicionais e fallback nobre institucional (ex.: *Colégio Particular de São Paulo (SP)*).

4. **Anonimização Humanizada de Alunos:**
   - Geração determinística de nomes e sobrenomes realistas brasileiros via hash criptográfico do ID do aluno, resguardando integralmente a privacidade LGPD sem perder a naturalidade analítica.

5. **Dashboard Analítico Visual em 5 Zonas (Single-Page Workspace):**
   - **Donut Charts SVG Puros:** Taxas de Presença vs. Abstenção no Brasil (72.2% vs. 27.8%) e no recorte filtrado.
   - **Colunas Agrupadas Lado a Lado (*Side-by-Side Clustered Columns*):** Comparativo vertical das 5 provas e Média Geral (Brasil em azul cobalto vs. Filtro em verde esmeralda) com indicador flutuante de diferencial (`▲ +X.X pts` / `▼ -X.X pts`).
   - **Rankings Top 10 com Explosão:** Reorganização dinâmica por qualquer matéria (`Geral`, `CN`, `CH`, `LC`, `MT`, `Redação`) e *drill-down* inline retrátil.
   - **Explorador e Slide-Over Drawer:** Detalhes cadastrais (endereço, telefone com link `tel:`) e boletim individual de cada estudante.

6. **Simulador Universitário de Oportunidades (SISU • ProUni • FIES):**
   - **Sincronização Automática:** Ao selecionar qualquer município (ex: *Birigui - SP*), o sistema preenche imediatamente a nota da escola 1º lugar (*Colégio Integrado de Birigui* - 672.5 pts).
   - **Slider Interativo:** Permite simulações livres entre 400 e 850+ pontos com reset para a nota de referência.
   - **Critérios Oficiais de Elegibilidade:** Validação de regras regulatórias (450 pontos mínimos no ENEM e nota de Redação acima de zero para ProUni e FIES).
   - **Visualização Híbrida em Mapa & Lista:** Mapa SVG interativo com polos e cidades onde a nota garante aprovação, e lista detalhada com badges de tipo de bolsa (100% integral vs 50% parcial no ProUni, Pública no SISU e Financiamento FIES).
   - **Alternância de Escopo:** Alterna com 1 clique entre o estado selecionado (ex: SP) e todo o Brasil.

7. **Automação Turnkey:**
   - `executar.bat`: Inicialização em 1 clique (Backend FastAPI + Frontend Vite + Abertura automática no navegador).
   - `encerrar.bat`: Finalização limpa liberando as portas TCP 8000 e 5173.

---

### 🤖 Agentes de IA & Skill Packs Utilizados (Google Antigravity)

* **Agente Orquestrador Central (`@agente-orquestrador`):** Responsável pela coordenação em 3 Camadas (Diretiva, Orquestração e Execução) e garantia do loop de autorrecuperação.
* **`@frontend-specialist` + `@app-builder`:** Estruturação da Single-Page Workspace em React 19, TypeScript e Tailwind CSS v4.
* **`@clean-code` & `@lint-and-validate`:** Padrões estritos de código sem sobre-engenharia, tipagem estrita e cobertura de testes automatizados com `pytest`.
* **`@database-design`:** Modelagem relacional e colunar otimizada no DuckDB com indexação em árvore B.

---

### 📂 Estrutura de Pastas do Projeto

```text
eduscore/
├── data/
│   ├── microdados_enem_2025/          # Microdados oficiais brutos do INEP
│   └── processed/
│       ├── eduscore.duckdb            # Banco colunar DuckDB indexado (149 MB)
│       ├── geo_hierarchy.json         # Árvore geográfica cacheada
│       └── geo_attendance.json        # Consolidação nacional de presença/abstenção
├── backend/
│   ├── app/
│   │   ├── core/                      # Configurações globais e conexão DuckDB
│   │   ├── routers/                   # Endpoints: status, filters, analytics, schools, ingestion
│   │   ├── services/                  # Scraper multi-provedor e anonimizador humanizado
│   │   ├── schemas.py                 # Contratos Pydantic v2
│   │   └── main.py                    # Aplicação FastAPI e CORS
│   ├── tests/
│   │   └── test_api.py                # 9 testes automatizados com pytest (100% aprovados)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/                # Header, FilterBar, PerformanceCards, AnalyticsDashboard, etc.
│   │   ├── services/api.ts            # Camada de comunicação assíncrona
│   │   ├── types/index.ts             # Tipagens TypeScript compartilhadas
│   │   └── App.tsx                    # Single-Page Workspace unificada
│   ├── vite.config.ts                 # Proxy reverso /api -> 8000 e Tailwind v4
│   └── package.json
├── documentation/
│   └── promptHistory.md               # Rastreabilidade integral de todos os prompts
├── execution/                         # Scripts determinísticos de processamento em lote
├── executar.bat                       # Inicializador turnkey em 1 clique
├── encerrar.bat                       # Finalizador limpo de portas TCP
└── README.md
```

---

### ⚡ Como Executar

#### Opção 1: Via Scripts Turnkey (Recomendado no Windows)
Basta dar um duplo clique em `executar.bat` na raiz do projeto. O script irá:
1. Subir a API FastAPI na porta `8000`.
2. Subir o Frontend Vite na porta `5173`.
3. Abrir seu navegador automaticamente em `http://localhost:5173`.

Para finalizar os servidores, dê um duplo clique em `encerrar.bat`.

#### Opção 2: Execução Manual

```bash
# 1. Executar o Backend
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

# 2. Executar o Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

---

## 🇺🇸 English Version

### 🚀 Overview
**EduScore** is a high-performance educational analytics platform designed to process, audit, and visualize official indicators from Brazil's **2025 National High School Exam (ENEM)** microdata (**+4.81 million records**), delivering sub-second response times on complex aggregations.

Built using **Google Antigravity** and orchestrated with specialized AI agents following **SENAI Full-Stack Development Standards**, the platform merges vectorized columnar data engineering, clean architecture, and modern mobile-first UI/UX.

---

### 🌟 Technical Highlights

1. **Massive Columnar Engine (DuckDB & Polars):**
   - Sub-second vector aggregations over **4,810,772 raw registrations** and **3,473,543 evaluated students**.
   - Compact indexed database `data/processed/eduscore.duckdb` (149 MB compressed).

2. **Official Statistical Privacy Handling (INEP & LGPD):**
   - Seamless management of schools protected under statistical secrecy (`CO_ESCOLA >= 60000000` for classes with <10 students).
   - Curated institutional catalog and noble naming fallbacks.

3. **Deterministic Student Humanization:**
   - Cryptographic SHA-256 hash generation of realistic Brazilian names preserving full LGPD compliance.

4. **Interactive 5-Zone Workspace:**
   - Pure SVG Donut Charts for attendance vs. absence.
   - Side-by-Side Clustered Columns comparing national vs. local benchmarks across all 5 exam knowledge areas.
   - Top 10 rankings with live subject explosion and inline drill-downs.
   - Slide-over school drawer with verified contact links and student report cards.

5. **University Opportunities Simulator (SISU • ProUni • FIES):**
   - **Auto-Sync:** Selecting any municipality (e.g. *Birigui - SP*) immediately feeds the top school's score (*Colégio Integrado de Birigui* - 672.5 pts).
   - **Interactive Score Slider:** Allows custom simulations between 400 and 850+ points with a 1-click reference reset.
   - **Hybrid Map & List View:** Interactive SVG map pinpoints cities offering approved courses alongside a comprehensive listing with scholarship types (100% full vs 50% partial ProUni, Public SISU, and FIES student financing).
   - **Scope Toggle:** Switch instantly between the state view (e.g. SP) and national coverage.

6. **Turnkey Automation:**
   - `executar.bat`: One-click startup for FastAPI and Vite with automated browser launch.
   - `encerrar.bat`: Graceful cleanup freeing TCP ports 8000 and 5173.

---

<div align="center">
  desenvolvido por <a href="https://siteprofissional.pro" style="color: #2563eb; text-decoration: underline; font-weight: 600;">siteprofissional</a>
</div>
