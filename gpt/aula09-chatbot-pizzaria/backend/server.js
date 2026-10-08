/**
 * ============================================================================
 * SERVIDOR DIDÁTICO NODE.JS - D THALES PIZZA DELIVERY (PADRÃO SENAI)
 * ============================================================================
 * Objetivo: Disponibilizar a API REST do cardápio, status de funcionamento e
 * servir os arquivos estáticos da Landing Page e do Chatbot.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const CARDAPIO_PATH = path.join(__dirname, 'cardapio.json');

// Mapa de tipos MIME para servir arquivos estáticos corretamente
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8'
};

/**
 * Função utilitária para verificar se a pizzaria está aberta
 * Horário: Segunda a Domingo, das 18:30 às 23:30
 */
function verificarStatusAberto() {
    const agora = new Date();
    const hora = agora.getHours();
    const minuto = agora.getMinutes();
    const minutosAtuais = hora * 60 + minuto;

    const abertura = 18 * 60 + 30;  // 18:30
    const fechamento = 23 * 60 + 30; // 23:30

    const aberto = minutosAtuais >= abertura && minutosAtuais < fechamento;
    return {
        aberto,
        horarioAtual: `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`,
        horarioAbertura: "18:30",
        horarioFechamento: "23:30",
        mensagem: aberto ? "Pizzaria aberta para pedidos!" : "Fechado no momento (Abre hoje às 18:30)"
    };
}

// Criação do servidor HTTP nativo (sem depender obrigatoriamente de pacotes externos)
const server = http.createServer((req, res) => {
    // Configuração de CORS para permitir requisições de desenvolvimento
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // ------------------------------------------------------------------------
    // ROTAS DA API REST
    // ------------------------------------------------------------------------

    // Rota 1: /api/cardapio - Retorna o cardápio completo em JSON
    if (pathname === '/api/cardapio') {
        fs.readFile(CARDAPIO_PATH, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Erro ao carregar o cardápio.' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(data);
        });
        return;
    }

    // Rota 2: /api/horario-status - Retorna o status de abertura em tempo real
    if (pathname === '/api/horario-status') {
        const status = verificarStatusAberto();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(status));
        return;
    }

    // ------------------------------------------------------------------------
    // SERVIÇO DE ARQUIVOS ESTÁTICOS DO FRONTEND
    // ------------------------------------------------------------------------
    if (pathname === '/') {
        pathname = '/index.html';
    } else if (pathname === '/pedido' || pathname === '/pedido/') {
        pathname = '/pedido/index.html';
    }

    const filePath = path.join(FRONTEND_DIR, pathname);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 - Página ou recurso não encontrado.');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n🍕 [SENAI Antigravity] Servidor D Thales Pizza Delivery rodando com sucesso!`);
    console.log(`🌐 Landing Page: http://localhost:${PORT}`);
    console.log(`💬 Chatbot de Pedidos: http://localhost:${PORT}/pedido`);
    console.log(`📊 API Cardápio: http://localhost:${PORT}/api/cardapio\n`);
});
