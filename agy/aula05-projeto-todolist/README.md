# 📋 Smart To-Do List (Ordenação Inteligente com IA)

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20GenAI-Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063?style=for-the-badge&logo=pydantic&logoColor=white)
![Rich](https://img.shields.io/badge/Rich-Terminal%20UI-00C7B7?style=for-the-badge&logo=terminal&logoColor=white)
![Google Antigravity](https://img.shields.io/badge/Google-Antigravity%20IDE-orange?style=for-the-badge)
![AG Kit](https://img.shields.io/badge/AG--Kit-Orchestration-purple?style=for-the-badge)

<br/>

**Sistema autônomo de triagem cognitiva, priorização e estimativa de tarefas cotidianas baseado na Arquitetura de 3 Camadas do Google Antigravity.**

[Português](#-português) • [English](#-english)

</div>

---

## 🇧🇷 Português

### 💡 Sobre o Projeto
O **Smart To-Do List** resolve o problema crônico de paralisia decisória e procrastinação gerado por listas de afazeres caóticas e desordenadas. Utilizando o SDK oficial `google-genai` e modelos Gemini, a aplicação interpreta semanticamente as tarefas do usuário, classifica níveis de criticidade (1 a 5), estima durações realistas e aplica uma ordenação determinística para estruturar a melhor agenda do dia no terminal.

### 🏗️ Arquitetura de 3 Camadas (Google Antigravity)
O projeto adota a arquitetura de alta confiabilidade preconizada pelo **Google Antigravity**:
- **Camada 1: Diretivas (`/directives`):** Especificações de negócios em Markdown (`projeto.md`, `ideia_projeto.md`) definindo taxonomia de prioridades, critérios de estimativa e schemas estritos de dados.
- **Camada 2: Orquestração:** Agente de IA (`@agente-orquestrador` / `@orchestrator`) coordenando dependências, tratamento de exceções (*Self-Annealing*), execução de testes e governança de prompts.
- **Camada 3: Execução (`/execution`):** Scripts Python modulares e determinísticos:
  - `execution/ai_service.py`: Triagem com Gemini via Structured Outputs (Pydantic) e cascata de resiliência.
  - `execution/organize_tasks.py`: Ordenação determinística (Score decrescente e Tempo crescente para desempate) e persistência em `.tmp/tarefas_organizadas.json`.
  - `execution/email_service.py`: Disparo automático de alertas em HTML via SMTP/SSL para tarefas de prioridade Crítica.
  - `execution/view.py`: Visualização elegante e colorida no terminal usando a biblioteca `rich`.
  - `execution/main.py` e `main.py`: Pontos de entrada com suporte a modo interativo e modo demonstração (`--demo`).

### 🤖 Agentes e Skills Utilizados
- **Agente:** `@orchestrator` / `@agente-orquestrador`
- **Skill Packs:**
  - `@[skills/clean-code]`: Padrões pragmáticos de código limpo e manutenibilidade.
  - `@[skills/python-patterns]`: Boas práticas de arquitetura Python, tipagem estrita com Pydantic e resiliência.

### 🚀 Como Executar

1. **Clone ou abra o repositório no Google Antigravity.**
2. **Crie ou configure o arquivo `.env`:**
   ```bash
   cp .env.example .env
   # Adicione sua chave GEMINI_API_KEY no arquivo .env
   ```
3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Execute em Modo Demonstração (Automático):**
   ```bash
   python main.py --demo
   ```
5. **Execute a Interface Web (Porta 8001):**
   ```bash
   python -m uvicorn backend.server:app --host 0.0.0.0 --port 8001
   # Acesse no navegador: http://localhost:8001
   ```
6. **Execute em Modo Interativo no Terminal (CLI):**
   ```bash
   python main.py
   ```
7. **Execute a Suíte de Testes Unitários:**
   ```bash
   python -m unittest discover tests
   ```

---

## 🇺🇸 English

### 💡 About the Project
**Smart To-Do List** tackles the decision paralysis and procrastination caused by chaotic, disorganized task lists. Powered by the official `google-genai` SDK and Gemini models, the system semantically analyzes everyday tasks, categorizes urgency and impact (scores 1 through 5), realistically estimates completion times, and deterministically sequences an optimal daily agenda rendered cleanly in the console.

### 🏗️ 3-Layer Architecture (Google Antigravity)
- **Layer 1: Directives (`/directives`):** Strategic SOPs (`projeto.md`, `ideia_projeto.md`) governing priority taxonomy, time estimation rubrics, and strict JSON schemas.
- **Layer 2: Orchestration:** The AI Agent (`@orchestrator` / `@agente-orquestrador`) directing environment validation, self-annealing retry loops, and pipeline execution.
- **Layer 3: Execution (`/execution`):** Modular Python scripts executing deterministic actions:
  - `execution/ai_service.py`: Structured output Gemini reasoning with model fallback cascades.
  - `execution/organize_tasks.py`: Priority score descending & duration ascending tie-break sorting, persisted to `.tmp/tarefas_organizadas.json`.
  - `execution/email_service.py`: Automated HTML email alert delivery via SMTP/SSL for Critical priority tasks.
  - `execution/view.py`: Terminal table UI and summary analytics built with `rich`.
  - `main.py`: Unified CLI supporting interactive input and `--demo` batch mode.

### 🤖 Agents & Skills Used
- **Agent:** `@orchestrator` / `@agente-orquestrador`
- **Skill Packs:**
  - `@[skills/clean-code]`
  - `@[skills/python-patterns]`

### 🚀 Getting Started
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run automated demo
python main.py --demo

# 3. Run unit tests
python -m unittest discover tests
```

---

<p align="center">Criado por <a href="https://siteprofissional.pro" style="color: blue;">siteprofissional.pro</a></p>
