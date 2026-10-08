/**
 * ============================================================================
 * Servidor Backend Didático - API do Chatbot SENAI Ourinhos
 * Padrão Node.js / Express para recepção de métricas e leads do funil
 * ============================================================================
 */

// Importação das dependências nativas ou externas
// (Em produção: const express = require('express');)

const http = require('http');

const PORT = process.env.PORT || 3001;

// Criação de servidor HTTP leve para demonstração e integração
const server = http.createServer((req, res) => {
    // Configuração de cabeçalhos CORS para permitir requisições do frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Tratamento de requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Endpoint de verificação de saúde da API (Health Check)
    if (req.url === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            status: "online",
            unidade: "SENAI Ourinhos",
            servico: "API de Métricas do Chatbot",
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // Endpoint para registro de interesse em cursos (Leads do Funil)
    if (req.url === '/api/leads' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const leadData = JSON.parse(body || '{}');
                console.log(`[LEAD RECEBIDO] Curso: ${leadData.curso || 'Não especificado'} | Horário: ${new Date().toLocaleString('pt-BR')}`);

                res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    sucesso: true,
                    mensagem: "Interesse registrado com sucesso na secretaria virtual do SENAI.",
                    protocolo: "SENAI-" + Math.floor(100000 + Math.random() * 900000)
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ sucesso: false, erro: "JSON inválido" }));
            }
        });
        return;
    }

    // Rota padrão não encontrada
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ erro: "Rota não encontrada" }));
});

// Inicialização do servidor caso executado diretamente via terminal
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`[BACKEND SENAI] Servidor de API ativo na porta ${PORT}`);
    });
}

module.exports = server;
