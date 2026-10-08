# 🍔 Analisador de Feedbacks com Alerta Crítico (Hamburgueria do Joselito)
### *Feedback Analyzer with Critical Alert for Hamburgueria do Joselito*

[![Google Antigravity](https://img.shields.io/badge/Google-Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://antigravity.google)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5%20%2F%203.8-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Status](https://img.shields.io/badge/Status-Completo_&_Testado-brightgreen?style=for-the-badge)](#)

---

## 🇧🇷 Português (Brasil)

### 📌 Sobre o Projeto
O **Analisador de Feedbacks** é uma solução completa de inteligência aplicada desenvolvida para a **Hamburgueria do Joselito** em Ourinhos/SP. O sistema automatiza a recepção, classificação semântica e gestão de opiniões de clientes em tempo real, resolvendo o atraso no tratamento de falhas críticas na operação.

O projeto foi construído seguindo a **Arquitetura de 3 Camadas** do **Google Antigravity**:
1. **Camada 1 (Diretiva):** Procedimentos operacionais padrão em [`directives/projeto.md`](directives/projeto.md).
2. **Camada 2 (Orquestração):** API FastAPI em [`backend/main.py`](backend/main.py) e coordenação inteligente pelo Agente Antigravity.
3. **Camada 3 (Execução Determinística):** Scripts isolados em [`execution/`](execution/) com tolerância a falhas (*Self-Annealing*).

---

### 🤖 Agentes e Skills Utilizados (Antigravity Kit)
- **Agentes:**
  - `@[orchestrator]` (Agente Orquestrador Central)
  - `@[project-planner]` (Planejamento de Arquitetura e Fases)
  - `@[frontend-specialist]` (Interface do Usuário e Experiência do Cliente)
  - `@[backend-specialist]` (Serviços REST e Integrações de Nuvem)
- **Skill Packs:**
  - `@app-builder` (Estruturação e Scaffold Full-stack)
  - `@clean-code` (Padrões de Código Limpo e Direto)
  - `@python-patterns` (Boas Práticas de Desenvolvimento Python)
  - `@frontend-design` (Design Responsivo e Temático Gourmet)

---

### 🔐 Autenticação e Segurança (OWASP Top 10)
- **Área do Gerente Protegida:** Acesso restrito com autenticação Bearer token.
- **Credenciais Padrão:**
  - **Usuário:** `gerente`
  - **Senha:** `gerente`
- **Mitigações OWASP Implementadas:**
  - **A01 (Broken Access Control):** Bloqueio estrito de endpoints administrativos (`/api/feedbacks`, `/api/metrics`, `/api/test-alert`) para usuários não autenticados.
  - **A07 (Identification and Authentication Failures):** Comparação em tempo constante (`secrets.compare_digest`) para prevenir *Timing Attacks*, controle de taxa contra força bruta (bloqueio temporário após 5 tentativas) e tokens de sessão criptograficamente seguros com expiração e revogação no logout.

---

### 🚀 Funcionalidades Principais
- **Interface do Cliente (`/`):** Formulário temático para envio de avaliações com classificação por estrelas e feedback instantâneo da IA.
- **Análise Semântica com Gemini:** Extração estrita de sentimento (`Positivo`, `Neutro`, `Crítico`), tags (`Entrega`, `Sabor`, `Atendimento`) e justificativa técnica.
- **Alertas Críticos Automáticos:** Envio imediato de e-mail ao gerente caso um feedback aponte falhas severas, com fila de contingência local em `.tmp/failed_alerts_queue.json`.
- **Dashboard Administrativo Autenticado (`/admin`):** Tela de login segura, KPIs em tempo real, filtros combináveis, busca textual e marcação manual de tratativa com botão de logout seguro.

---

### 🛠️ Instalação e Execução

1. **Clone o repositório e acesse a pasta:**
   ```bash
   cd aula05-projeto-analisador
   ```

2. **Instale as dependências:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure as Variáveis de Ambiente (`.env`):**
   ```env
   GEMINI_API_KEY=seu_token_aqui
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu_email@gmail.com
   SMTP_PASS=sua_senha_de_app
   MANAGER_EMAIL=gerente@hamburgueria.com.br
   ```

4. **Inicie o servidor:**
   ```bash
   python backend/main.py
   ```
   Acesse no navegador:
   - **Página de Avaliações:** [http://localhost:8000/](http://localhost:8000/)
   - **Painel do Gerente:** [http://localhost:8000/admin](http://localhost:8000/admin)
   - **Documentação da API:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🇺🇸 English

### 📌 About the Project
The **Feedback Analyzer** is a full-stack AI-driven system built for a gourmet burger restaurant. It automates customer review collection, semantic analysis, and incident management in real-time.

Built following the **Google Antigravity 3-Layer Architecture**:
1. **Layer 1 (Directive):** Standard Operating Procedures in [`directives/projeto.md`](directives/projeto.md).
2. **Layer 2 (Orchestration):** FastAPI backend in [`backend/main.py`](backend/main.py) and decision engine.
3. **Layer 3 (Deterministic Execution):** Modular Python scripts in [`execution/`](execution/) with *Self-Annealing* resilience.

---

### 🤖 Agents & Skill Packs Applied
- **Agents:** `@orchestrator`, `@project-planner`, `@frontend-specialist`, `@backend-specialist`
- **Skills:** `@app-builder`, `@clean-code`, `@python-patterns`, `@frontend-design`

---

### 🚀 Key Features
- **Public Customer Form (`/`):** Gourmet-themed review page with star rating and instant AI confirmation.
- **Gemini Semantic Processing:** Strict classification into `Positivo`, `Neutro`, `Crítico` + domain tags (`Entrega`, `Sabor`, `Atendimento`).
- **Critical Incident Dispatch:** Immediate SMTP email notification for critical reviews with local fallback queue in `.tmp/failed_alerts_queue.json`.
- **Manager Dashboard (`/admin`):** KPI cards, dynamic multi-filtering, search bar, and interactive status checkboxes to mark items as resolved.

---

### 🛠️ Setup & Running

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run the unified application
python backend/main.py
```

Open in your browser:
- Customer Page: [http://localhost:8000/](http://localhost:8000/)
- Manager Dashboard: [http://localhost:8000/admin](http://localhost:8000/admin)
- Interactive API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

<div align="center">
Criado por <a href="https://siteprofissional.pro" target="_blank" rel="noopener noreferrer" style="color: #3b82f6;">siteprofissional.pro</a>
</div>
