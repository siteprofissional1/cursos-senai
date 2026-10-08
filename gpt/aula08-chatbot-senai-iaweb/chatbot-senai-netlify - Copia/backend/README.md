# 🖥️ Módulo Backend - Chatbot SENAI Ourinhos

Este diretório contém a lógica de servidor, funções serverless e pontos de integração para expansão futura do chatbot.

## 🎯 Arquitetura e Propósito

Embora a interface atual funcione de forma estática e leve (hospedada no Netlify), esta camada backend está preparada para:
1. **Captura e Registro de Leads:** Armazenar os cliques de pré-matrícula em banco de dados (ex: Firebase Firestore).
2. **Integração com CRM/WhatsApp Business API:** Notificar a secretaria do SENAI instantaneamente a cada interesse em cursos.
3. **Métricas de Engajamento:** Analisar quais cursos geram maior interesse no funil de botões.

## 📂 Arquivos Disponíveis

- `server.js`: Servidor Express.js opcional para execução local ou container Docker.
- `package.json`: Definição de dependências do ecossistema Node.js.
