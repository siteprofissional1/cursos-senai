# 📘 SOP: Smart To-Do List (Ordenação Inteligente)

**Status:** Concluído e Validado | **Versão:** 1.1

## 1. Objetivo Principal
Eliminar a paralisia decisória e a procrastinação causadas por listas de afazeres caóticas e desordenadas. O sistema recebe tarefas informais do usuário, utiliza Inteligência Artificial (Gemini) para ponderar importância versus urgência, estima o tempo necessário para cada atividade, reordena tudo por prioridade absoluta e exibe uma agenda pragmática e sequenciada no terminal, persistindo o resultado no arquivo `.tmp/tarefas_organizadas.json`.

## 2. Arquitetura de 3 Camadas
* **Layer 1 (Diretiva):** Este documento de procedimento operacional e o arquivo `ideia_projeto.md`, definindo as regras de negócio, taxonomia de prioridades ("Crítica", "Alta", "Média", "Baixa"), critérios de estimativa temporal e o contrato estrito de schema JSON.
* **Layer 2 (Orquestração):** O Agente de IA interpretando as instruções operacionais, validando requisitos do ambiente, controlando arquivos intermediários transitórios e invocando os scripts de execução na sequência correta.
* **Layer 3 (Execução):** Scripts Python modulares em `execution/` (`ai_service.py`, `organize_tasks.py`, `view.py`, `main.py`) para coleta de dados de entrada, chamada à API do Gemini com cascata de modelos, ordenação determinística de dados, escrita do JSON e renderização no terminal com Rich.

## 3. Entradas e Requisitos (Inputs)
* **Variáveis de Ambiente (`.env`):** `GEMINI_API_KEY` devidamente configurada.
* **Entradas de Dados:** Texto livre contendo a lista não estruturada de afazeres digitada pelo usuário via CLI ou carregada via `--demo`.
* **Ferramentas e Dependências:** Python 3.10+, SDK Google GenAI (`google-genai`), biblioteca `pydantic` para validação de esquemas e `rich` para visualização rica no terminal.

## 4. Fluxo Operacional (Passo a Passo)
1. **Inicialização:** Validar a existência do `.env` com a chave `GEMINI_API_KEY` ativa e as dependências do `requirements.txt`.
2. **Ingestão:** O usuário executa `python main.py` (ou `python main.py --demo`).
3. **Isolamento Transitório:** A lista bruta recebida é registrada temporariamente em `.tmp/raw_tasks.json` para rastreabilidade e garantia de idempotência.
4. **Triagem e Estimativa (Layer 3 via Layer 1):** O módulo `execution/ai_service.py` aciona a API do Gemini (`gemini-3.1-flash-lite` com cascata de contingência) utilizando `response_mime_type="application/json"` e Pydantic `response_schema`, extraindo para cada tarefa:
   - `titulo`: Nome normalizado da ação.
   - `prioridade`: Enum ["Crítica", "Alta", "Média", "Baixa"].
   - `score_prioridade`: Valor inteiro de 1 a 5 (onde 5 é urgência máxima).
   - `tempo_estimado_minutos`: Número inteiro representando a duração da tarefa.
   - `justificativa`: Frase curta contextualizando a precedência da tarefa.
5. **Ordenação e Persistência:** O módulo `execution/organize_tasks.py` aplica ordenação determinística decrescente (`score_prioridade` descendente e `tempo_estimado_minutos` ascendente para desempate) e salva o resultado consolidado em `.tmp/tarefas_organizadas.json`.
6. **Notificação de Emergência (SMTP):** O módulo `execution/email_service.py` intercepta a presença de tarefas com prioridade "Crítica" e despacha automaticamente um alerta formatado em HTML para o `MANAGER_EMAIL` via SMTP com SSL (Porta 465).
7. **Visualização Rápida no Terminal:** O script formata e imprime a agenda reordenada no console, apresentando tabela clara com a sequência de execução e a somatória do tempo total de dedicação.
8. **Limpeza e Finalização:** O arquivo transitório `.tmp/raw_tasks.json` é mantido para fins de auditoria, mantendo `.tmp/tarefas_organizadas.json` íntegro.

## 5. Definição de Sucesso (Outputs/Deliverables)
* **Persistência Local Obrigatória:** Arquivo `.tmp/tarefas_organizadas.json` preenchido com a lista de tarefas reordenada, validada e legível.
* **Visualização no Console:** Exibição imediata no terminal contendo a tabela de afazeres, badges visuais de prioridade e estimativa total de tempo da jornada.
* **Código Determinístico:** Scripts em `execution/` funcionando de ponta a ponta sem loops infinitos ou dependência de intervenção manual do usuário.
* **Localização dos Entregáveis:** Código-fonte na pasta raiz e `execution/`, diretrizes em `directives/` e dados gerados em `.tmp/tarefas_organizadas.json`.

## 6. Tratamento de Erros e Resiliência (Self-Annealing)
* **Entrada Vazia ou Inválida:** Se o usuário submeter texto em branco ou sem itens identificáveis, o validador deve interceptar antes da chamada de API e solicitar nova entrada de tarefas.
* **Resposta Não Conforme da IA:** Se a resposta do Gemini não respeitar o schema JSON ou falhar no parse, executar retentativa com `temperature=0.0` e prompt de correção automática.
* **Falha de Conexão ou Quota da API:** Se houver timeout ou erro de rede, registrar o incidente em `.tmp/error.log`, notificar o terminal com mensagem amigável e tentar reconexão com backoff exponencial (até 3 tentativas).
* **Ajuste Incremental de Diretivas:** Caso tarefas com prazos explícitos (ex: "entregar até as 14h") não sejam priorizadas adequadamente pela IA, refinar o prompt da Layer 1 com regras estritas de temporalidade e atualizar este documento.