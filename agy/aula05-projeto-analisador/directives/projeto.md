# 📘 SOP: Avaliador de Feedback Hamburgueria

**Status:** Em Desenvolvimento | **Versão:** 1.0

## 1. Objetivo Principal

Automatizar a coleta, análise semântica e gestão de avaliações dos clientes de uma hamburgueria gourmet. O sistema soluciona o tempo de resposta lento a falhas graves de atendimento e produto, identificando comentários críticos em tempo real por meio de Inteligência Artificial, notificando imediatamente o gerente via e-mail e centralizando o acompanhamento das demandas em um painel administrativo seguro com filtros e controle de status de resolução.

## 2. Arquitetura de 3 Camadas



* **Layer 1 (Diretiva):** Especificação das regras de negócio, critérios de classificação de sentimento ("Positivo", "Neutro", "Crítico"), taxonomia das tags obrigatórias ("Entrega", "Sabor", "Atendimento"), parâmetros de urgência e políticas de notificação.


* **Layer 2 (Orquestração):** O Agente de IA interpretando as instruções operacionais, validando o estado das dependências, coordenando os estágios de execução em arquivos de trabalho e invocando os scripts pertinentes na ordem correta.


* **Layer 3 (Execução):** Scripts determinísticos em Python alocados na pasta `execution/` para interagir com a API do Gemini, persistir dados, conectar ao servidor SMTP e servir os endpoints da aplicação web.



## 3. Entradas e Requisitos (Inputs)

* **Variáveis de Ambiente (`.env`):** `GEMINI_API_KEY`, credenciais do servidor SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) e `MANAGER_EMAIL` de destino para envio dos alertas.


* **Entradas de Dados:** Payloads JSON recebidos do formulário público contendo texto descritivo do cliente, identificação de contato e carimbo de data/hora.


* **Ferramentas e Dependências:** Python 3.10+, SDK Google GenAI (`google-genai`), framework de backend (FastAPI ou Flask), cliente SMTP (`smtplib` ou serviço transacional em nuvem) e bibliotecas de teste determinístico.



## 4. Fluxo Operacional (Passo a Passo)

1. **Inicialização:** Validar se o ambiente `.env` e as dependências do `requirements.txt` estão instalados e configurados corretamente.


2. **Ingestão:** A interface pública submete a avaliação textual do cliente para a rota da API de ingestão no backend.


3. **Isolamento Transitório:** A requisição bruta recebida é registrada temporariamente no diretório `.tmp/raw_feedback_{id}.json` para garantir idempotência e evitar perda de mensagens durante o processamento.


4. **Processamento Semântico (Layer 3 via Layer 1):** O script `execution/analyze_feedback.py` consome a API do Gemini aplicando o contrato estrito de schema JSON: sentimento ("Positivo", "Neutro", "Crítico") e tags ("Entrega", "Sabor", "Atendimento").


5. **Triagem e Alerta:** Caso o sentimento retornado seja "Crítico", acionar imediatamente o script determinístico `execution/send_alert.py` para disparar e-mail com a síntese do problema e dados do review ao gerente.


6. **Gerenciamento de Dados:** Salvar o feedback analisado na base de dados persistente, registrar o log operacional e remover os registros transitórios da pasta `.tmp/`.


7. **Moderação Administrativa:** O Dashboard do gerente consulta as avaliações estruturadas, disponibilizando ordenação cronológica, filtros por tag/sentimento e atualização do status de tratativa (checkbox "lido/tratado").


8. **Entrega:** Publicar ou sincronizar o estado da aplicação e base consolidada na infraestrutura de nuvem definida.



## 5. Definição de Sucesso (Outputs/Deliverables)

* **Frontend Público:** Interface responsiva para submissão de feedbacks com validação de campos e feedback visual imediato.


* **Backend Integrado:** Serviços em Python para orquestração da API do Gemini, análise semântica e rotinas assíncronas de notificação.


* **Dashboard Administrativo:** Interface interativa para o gerente com métricas, filtragem dinâmica por sentimento e tags, e controle de status de tratativa.


* **Alerta Crítico Automatizado:** Disparo comprovado de e-mail de contingência sempre que uma avaliação apresentar sentimento "Crítico".


* **Localização dos Entregáveis:** Código-fonte versionado em repositório remoto na nuvem, banco de dados persistente em nuvem (Cloud DB / Firestore / Storage Gerenciado) e diretório local `.tmp/` limpo ao final do ciclo.



## 6. Tratamento de Erros e Resiliência (Self-Annealing)

* **Falha de Formatação na Resposta da IA:** Se a resposta do Gemini não atender ao schema estrito de JSON (ex: payload quebrado ou ausência de tags obrigatórias), o orquestrador aciona uma rotina de fallback de sanitização e retentativa em `execution/analyze_feedback.py` com temperatura zero.
* **Falha no Disparo de Notificação (SMTP):** Se houver timeout ou rejeição de conexão ao enviar o e-mail crítico, salvar o payload pendente em `.tmp/failed_alerts_queue.json`, executar até 3 retentativas com recuo exponencial e alertar o log do sistema sobre a retenção.
* **Ajuste Incremental de Diretivas:** Caso novos padrões de feedbacks negativos recorrentes não sejam mapeados adequadamente nas tags vigentes, registrar a limitação nos logs de erro, atualizar as regras de negócio deste SOP (Layer 1) e refinar os scripts da pasta `execution/`.


* **Validação de Código:** A cada correção nos scripts em `execution/`, executar a suíte de testes locais contra casos de borda antes de liberar para o fluxo de orquestração.