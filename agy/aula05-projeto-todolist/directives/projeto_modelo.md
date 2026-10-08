# 📘 SOP: [NOME DO PROJETO]
**Status:** Em Desenvolvimento | **Versão:** 1.0

## 1. Objetivo Principal
[Descreva de forma clara o que o sistema deve realizar, qual problema operacional ele soluciona e qual o valor gerado.]

## 2. Arquitetura de 3 Camadas
* **Layer 1 (Diretiva):** Este documento, definindo as regras de negócio, critérios de classificação e schemas estritos.
* **Layer 2 (Orquestração):** O Agente de IA interpretando estas instruções, gerenciando o ciclo de vida da execução e coordenando as ações.
* **Layer 3 (Execução):** Scripts determinísticos em Python na pasta `execution/` para regras de cálculo, I/O e chamadas de API.

## 3. Entradas e Requisitos (Inputs)
- **Dados necessários:** [Ex: Chaves de API no `.env`, arquivos de entrada na pasta raiz ou CLI].
- **Ferramentas:** [Ex: Bibliotecas Python, SDK Google GenAI, Banco local/JSON].

## 4. Fluxo Operacional (Passo a Passo)
1. **Inicialização:** Verificar se o ambiente `.env` e as dependências estão configurados corretamente.
2. **Ingestão:** Receber os dados brutos de entrada do sistema.
3. **Isolamento Transitório:** Armazenar dados intermediários na pasta `.tmp/` durante a execução.
4. **Processamento Inteligente (Layer 3 via Layer 1):** Executar chamadas aos modelos de IA sob contratos de schema estrito.
5. **Persistência e Entrega:** Gerar os arquivos finais nos diretórios definidos na Seção 5.

## 5. Definição de Sucesso (Outputs/Deliverables)
- **Entregáveis:** [Ex: Arquivo estruturado em `.tmp/`, saída formatada no terminal, interface web].
- **Localização:** Entregáveis finais devem estar nas pastas locais designadas ou em nuvem.

## 6. Tratamento de Erros e Resiliência (Self-Annealing)
- **Falha em Script:** Ler o log de erro, ajustar o código na pasta `execution/` e testar novamente.
- **Registro do Aprendizado:** Atualizar esta diretiva com as restrições ou exceções encontradas.
- **Evolução Contínua:** O sistema deve se tornar mais robusto a cada falha corrigida.