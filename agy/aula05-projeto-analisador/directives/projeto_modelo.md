# 📘 SOP: [NOME DO PROJETO]
**Status:** Em Desenvolvimento | **Versão:** 1.0

## 1. Objetivo Principal
[Descreva de forma clara o que o sistema deve realizar e qual problema ele resolve.]

## [cite_start]2. Arquitetura de 3 Camadas [cite: 2]
* [cite_start]**Layer 1 (Diretiva):** Este documento, definindo as regras de negócio[cite: 2].
* [cite_start]**Layer 2 (Orquestração):** O Agente interpretando estas instruções e coordenando as ações[cite: 5].
* [cite_start]**Layer 3 (Execução):** Scripts determinísticos em Python na pasta `execution/`[cite: 5].

## 3. Entradas e Requisitos (Inputs)
- [cite_start]**Dados necessários:** [Ex: Chaves de API no .env, arquivos de entrada na pasta raiz][cite: 5, 20].
- [cite_start]**Ferramentas:** [Ex: Bibliotecas Python, Google Stitch, Firebase, n8n][cite: 5].

## 4. Fluxo Operacional (Passo a Passo)
1.  [cite_start]**Inicialização:** Verificar se o ambiente `.env` está configurado corretamente[cite: 5, 20].
2.  **Processamento:** [Descreva a sequência lógica que o Agente deve seguir].
3.  [cite_start]**Gerenciamento de Dados:** Armazenar dados temporários na pasta `.tmp/` durante a execução.
4.  [cite_start]**Entrega:** Gerar o resultado final conforme os padrões definidos na Seção 5[cite: 19].

## 5. Definição de Sucesso (Outputs/Deliverables)
- [cite_start]**Entregáveis:** [Ex: Planilha no Google Sheets, Landing Page modular, Banco de Dados atualizado][cite: 21].
- [cite_start]**Localização:** Entregáveis finais devem estar em nuvem ou pastas designadas[cite: 21].

## [cite_start]6. Tratamento de Erros e Resiliência (Self-Annealing) 
- [cite_start]Se houver falha em um script: Ler o log de erro, ajustar o código na pasta `execution/` e testar novamente.
- [cite_start]Registrar o aprendizado: Atualizar esta diretiva com as limitações encontradas[cite: 13, 14].
- [cite_start]O sistema deve se tornar mais robusto a cada falha corrigida[cite: 19, 25].