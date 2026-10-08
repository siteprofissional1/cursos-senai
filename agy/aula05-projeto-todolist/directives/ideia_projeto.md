# 📋 Smart To-Do List (Ordenação Inteligente) com IA

## O Tema
Organizador autônomo de afazeres cotidianos com priorização cognitiva, triagem de relevância e estimativa temporal inteligente via terminal.

## Como Funciona
O sistema recebe uma lista bruta, desordenada e caótica de tarefas informadas pelo usuário no terminal (ex: *"responder e-mail da faculdade, consertar vazamento urgente da pia da cozinha, comprar pão na padaria, finalizar relatório trimestral para o diretor às 15h, levar o cachorro para passear"*). O sistema ingere esses afazeres, avalia cada item e reestrutura todo o dia de forma estratégica.

## O Papel do Gemini (Cérebro)
Atua como analista semântico e estrategista de produtividade:
1. **Interpretação Semântica:** Compreende o contexto e o impacto real de cada afazer.
2. **Classificação de Prioridade:** Aplica matriz de priorização (Urgente/Crítica, Alta, Média, Baixa) com pontuação quantitativa (score de 1 a 5).
3. **Estimativa de Duração:** Calcula o tempo médio estimado de execução em minutos ou horas para cada tarefa.
4. **Justificativa Estratégica:** Gera uma breve justificativa explicando por que determinada atividade deve ser executada antes de outra.

## O Papel do Python (Braço)
1. **Ingestão e Validação:** Coleta os afazeres digitados pelo usuário via linha de comando (CLI).
2. **Consumo da API:** Envia os dados para a API do Gemini (`google-genai`) exigindo resposta em schema JSON estrito.
3. **Ordenação Determinística:** Processa o retorno da IA e ordena os itens por prioridade absoluta decrescente e sequenciamento lógico de execução.
4. **Persistência Local:** Grava a agenda estruturada e consolidada no arquivo `.tmp/tarefas_organizadas.json`.
5. **Visualização Rápida no Terminal:** Renderiza no console uma tabela elegante (usando caracteres de borda ou biblioteca `rich`), destacando nível de urgência, tempo individual estimado e o total acumulado do dia.

## Visualização Rápida (A Visão do Usuário no Terminal)
Substituindo interfaces complexas por agilidade, o terminal exibe um resumo limpo:
- Tabela com colunas: **Ordem**, **Prioridade**, **Tempo Estimado**, **Tarefa** e **Por que fazer agora?**.
- Rodapé com métricas: **Tempo Total de Trabalho**, **Tarefas Críticas** e **Horário Sugerido de Início/Término**.

## Prompt Base para o Orquestrador
/agent /goal Crie um sistema completo de Smart To-Do List em Python com triagem e ordenação inteligente por IA. O sistema deve contemplar: 
1) Uma interface CLI determinística para captura de afazeres caóticos digitados pelo usuário.
2) Integração com a API do Gemini para categorizar prioridades (1 a 5), estimar tempos de execução e descrever a relevância de cada tarefa com contrato de JSON Schema estrito.
3) Rotina determinística em Python para ordenação por prioridade absoluta e salvamento limpo dos dados estruturados em `.tmp/tarefas_organizadas.json`.
4) Renderização no terminal de uma visualização rápida e estilizada da agenda do dia com tabela de afazeres, cores semânticas de prioridade e tempo total estimado.