# ðŸ“œ HistÃ³rico de Prompts - Smart To-Do List

Este documento registra cronologicamente todas as instruÃ§Ãµes e diretivas enviadas pelo usuÃ¡rio durante o desenvolvimento do projeto no Google Antigravity.

---

## ðŸ“… SessÃ£o 1 - 2026-09-05

### Prompt 1
```text
/agente-orquestrador /goal /grill-me Atue como um Arquiteto de Software e Desenvolvedor Python SÃªnior especialista no ecossistema Google Antigravity e AG Kit.

Execute e construa de ponta a ponta o projeto "Smart To-Do List (OrdenaÃ§Ã£o Inteligente)", seguindo rigorosamente a arquitetura de 3 camadas especificada nos arquivos `directives/projeto.md` e `directives/ideia_projeto.md`.

=======================================================
1. CONTRATO DE ARQUITETURA DE 3 CAMADAS
=======================================================
- Layer 1 (Diretiva): Ler e respeitar as regras de negÃ³cio, taxonomia de prioridade e schemas definidos em `directives/projeto.md`.
- Layer 2 (OrquestraÃ§Ã£o): VocÃª (o Agente) coordenando a instalaÃ§Ã£o de dependÃªncias, criaÃ§Ã£o dos scripts em `execution/`, execuÃ§Ã£o dos testes e validaÃ§Ã£o dos entregÃ¡veis.
- Layer 3 (ExecuÃ§Ã£o): Scripts determinÃ­sticos e modulares em Python salvos dentro da pasta `execution/`.

=======================================================
2. ESCOPO TÃ‰CNICO E ENTREGÃVEIS (LAYER 3)
=======================================================
Crie os seguintes componentes no projeto:

1. `requirements.txt`:
   - `google-genai` (SDK oficial do Google GenAI)
   - `pydantic`
   - `python-dotenv`
   - `rich` (para visualizaÃ§Ã£o estilizada de tabelas e cores no terminal)

2. Estrutura de DiretÃ³rios:
   - Garanta a existÃªncia das pastas `directives/`, `execution/` e `.tmp/`.
   - Crie um arquivo `.env.example` com a chave `GEMINI_API_KEY=sua_chave_aqui`.

3. MÃ³dulo de Triagem com IA (`execution/ai_service.py` ou integrado):
   - FunÃ§Ã£o que recebe os afazeres caÃ³ticos e consome a API do Gemini utilizando o SDK `google-genai` (`client = genai.Client()`).
   - Aplique saÃ­da estruturada obrigatÃ³ria com schema JSON estrito contendo para cada tarefa:
     * `titulo`: string (nome claro e normalizado do afazer)
     * `prioridade`: enum ["CrÃ­tica", "Alta", "MÃ©dia", "Baixa"]
     * `score_prioridade`: int (1 a 5, sendo 5 a mÃ¡xima urgÃªncia)
     * `tempo_estimado_minutos`: int (estimativa realista de dedicaÃ§Ã£o)
     * `justificativa`: string (por que fazer agora e qual o impacto)

4. MÃ³dulo de OrdenaÃ§Ã£o e PersistÃªncia (`execution/organize_tasks.py`):
   - Algoritmo determinÃ­stico em Python que ordena a lista resultante por:
     * 1Âº critÃ©rio: `score_prioridade` descrescente (5 -> 1).
     * 2Âº critÃ©rio (desempate): `tempo_estimado_minutos` crescente (tarefas rÃ¡pidas primeiro).
   - PersistÃªncia obrigatÃ³ria: Gravar o JSON final formatado (indent=2) estritamente no arquivo `.tmp/tarefas_organizadas.json`.

5. VisualizaÃ§Ã£o RÃ¡pida no Terminal (`execution/view.py` ou integrado no CLI):
   - Renderize uma tabela rica no console (usando a biblioteca `rich`):
     * Colunas: **# Ordem**, **Prioridade (com cores semÃ¢nticas: Vermelho=CrÃ­tica, Amarelo=Alta, Azul=MÃ©dia, Verde=Baixa)**, **Tempo Estimado**, **Tarefa** e **Justificativa EstratÃ©gica**.
     * RodapÃ© / Cards de Resumo: **Tempo Total de DedicaÃ§Ã£o do Dia (horas/min)**, **Quantidade de Tarefas CrÃ­ticas** e **Dica de Produtividade**.

6. Ponto de Entrada Principal (`main.py` ou `execution/main.py`):
   - Permita dois modos de uso:
     a) Modo Interativo: O usuÃ¡rio digita ou cola sua lista desorganizada no terminal.
     b) Modo DemonstraÃ§Ã£o / Batch: Aceita uma lista caÃ³tica padrÃ£o de teste caso execute com a flag `--demo` ou sem entrada manual, para validaÃ§Ã£o autÃ´noma imediata.

=======================================================
3. RESILIÃŠNCIA E TRATAMENTO DE ERROS (SELF-ANNEALING)
=======================================================
- Se o usuÃ¡rio fornecer texto em branco, trate com mensagem orientativa sem quebrar a execuÃ§Ã£o.
- Se a chamada Ã  API do Gemini falhar por formato ou rede, execute retentativa com backoff ou fallback de sanitizaÃ§Ã£o JSON.
- Se o arquivo `.env` nÃ£o possuir `GEMINI_API_KEY`, exiba um alerta visual claro orientando o usuÃ¡rio a definir a chave.

=======================================================
4. EXECUÃ‡ÃƒO E PROVA DE SUCESSO
=======================================================
ApÃ³s escrever os cÃ³digos:
1. Instale as dependÃªncias via pip.
2. Execute o script principal em modo teste/demonstraÃ§Ã£o no terminal do Antigravity.
3. Verifique e confirme se o arquivo `.tmp/tarefas_organizadas.json` foi gerado com dados vÃ¡lidos e exiba a tabela final renderizada no console.
```

### Prompt 2
```text
observa que eu ja tenho um .env 
# Chave de Acesso para Google GenAI (Gemini)
GEMINI_API_KEY=REDACTED

# ConfiguraÃ§Ãµes do ServiÃ§o de E-mail (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=victorsan.senai@gmail.com
SMTP_PASS=czkbecnchjlywzsz

# E-mail para NotificaÃ§Ã£o 
MANAGER_EMAIL=estudantebrasileiro777@gmail.com
```

### DecisÃ£o de Design / InteraÃ§Ã£o:
- Pergunta: "Identifiquei as credenciais de SMTP e o MANAGER_EMAIL no seu arquivo .env. Deseja que a aplicaÃ§Ã£o envie automaticamente um e-mail de notificaÃ§Ã£o para o gestor quando forem detectadas tarefas de prioridade 'CrÃ­tica'?"
- Resposta Selecionada: "Sim, integrar envio automÃ¡tico de e-mail de alerta para tarefas CrÃ­ticas usando o SMTP do .env"

### Prompt 3
```text
/goal /grill-me /agente-orquestrador quero que voce execute o projeto abra a interface front end na porta 8001 para mim ver
```
