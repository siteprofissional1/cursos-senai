# 🏛️ Arquitetura do Sistema: Analisador de Feedbacks Hamburgueria Gourmet

Este documento descreve a topologia técnica e o fluxo de dados do sistema, estruturado com base no **Framework de 3 Camadas** do **Google Antigravity**.

---

## 📐 Visão Geral da Arquitetura de 3 Camadas

```mermaid
flowchart TD
    subgraph L1["Camada 1: Diretiva (Estratégia)"]
        D1["directives/projeto.md<br/>• Regras de Negócio<br/>• Taxonomia de Sentimento e Tags<br/>• Critérios de Contingência"]
    end

    subgraph L2["Camada 2: Orquestração (Inteligência & APIs)"]
        O1["backend/main.py (FastAPI)<br/>• Roteamento HTTP<br/>• Ingestão de Dados<br/>• Coordenação dos Scripts"]
        O2[".tmp/raw_feedback_{id}.json<br/>• Isolamento Transitório Idempotente"]
    end

    subgraph L3["Camada 3: Execução (Ação Determinística)"]
        E1["execution/analyze_feedback.py<br/>• Google GenAI (Gemini)<br/>• Schema Pydantic Estrito<br/>• Self-Annealing & Fallback"]
        E2["execution/send_alert.py<br/>• Disparo SMTP Imediato<br/>• Fila Local em .tmp/"]
        E3["execution/manage_data.py<br/>• Persistência em JSON<br/>• Filtros & Métricas"]
    end

    subgraph UI["Interfaces Web"]
        U1["frontend/index.html<br/>• Avaliação do Cliente"]
        U2["frontend/admin.html<br/>• Dashboard do Gerente"]
    end

    U1 -->|1. Submete review| O1
    O1 -->|2. Grava transitório| O2
    O1 -->|3. Invoca análise| E1
    E1 -->|4. Retorna sentimento & tags| O1
    O1 -->|5. Se Crítico: dispara alerta| E2
    O1 -->|6. Persiste registro final| E3
    O1 -->|7. Remove transitório| O2
    E3 -->|8. Alimenta KPIs e dados| U2
    U2 -->|9. Atualiza tratativa PATCH| O1
```

---

## 🔄 Fluxo de Processamento de Feedback (Ciclo de Vida)

1. **Ingestão:** O cliente acessa a página pública (`/`), preenche o formulário e envia uma requisição `POST /api/feedbacks`.
2. **Isolamento Transitório:** A requisição é imediatamente gravada em `.tmp/raw_feedback_{id}.json`, garantindo persistência temporária antes do processamento.
3. **Análise Semântica (IA):** O script `execution/analyze_feedback.py` consome a API do Google Gemini com schema rigoroso:
   - **Sentimento:** `Positivo`, `Neutro` ou `Crítico`.
   - **Tags:** `Entrega`, `Sabor` e/ou `Atendimento`.
   - **Resiliência (Self-Annealing):** Retentativa com múltiplos modelos suportados (`gemini-3.8-flash`, `gemini-3.6-flash`, etc.), sanitização de JSON, temperatura 0 e fallback determinístico local.
4. **Triagem de Urgência:** Se a classificação for `Crítico`, aciona `execution/send_alert.py`:
   - Disparo de e-mail via servidor SMTP com template HTML executivo para o gerente.
   - Em caso de falha de conexão ou ausência de credenciais, o alerta é preservado com segurança na fila de contingência `.tmp/failed_alerts_queue.json`.
5. **Persistência Estruturada:** O registro consolidado é salvo no banco de dados JSON (`backend/data/feedbacks.json`) e o arquivo transitório é removido.
6. **Moderação Administrativa:** O gestor acessa o Painel (`/admin`), onde visualiza métricas em tempo real, filtra por sentimento/tag e marca as ocorrências como tratadas.

---

## 🛡️ Padrões de Tolerância a Falhas e Resiliência

| Componente | Possível Ponto de Falha | Mecanismo de Recuperação (Self-Annealing) |
|---|---|---|
| **Google GenAI** | Cota de API excedida / Erro 503 / 404 | Troca automática entre modelos da família Gemini, sanitização de JSON com temperatura zero e fallback determinístico. |
| **Servidor SMTP** | Timeout de rede ou credenciais pendentes | Enfileiramento na contingência `.tmp/failed_alerts_queue.json` sem interromper a experiência do usuário. |
| **Integridade de Dados** | Queda abrupta de energia durante requisição | Isolamento em arquivo `.tmp/` prévio à análise para garantir reprocessamento idempotente. |

---

*Documento gerado sob o padrão Google Antigravity - SENAI Edition.*
