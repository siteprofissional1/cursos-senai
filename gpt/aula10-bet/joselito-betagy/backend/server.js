/**
 * Joselito Bet - Servidor Web Educacional Backend (Node.js Nativo)
 * Desenvolvido sem dependências externas obrigatórias (funciona com node server.js direto).
 * Comentários didáticos para análise de alunos do SENAI.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');

// Mapa de tipos MIME para arquivos estáticos
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Rota de API didática: Status do servidor
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      app: 'Joselito Bet Educacional',
      version: '1.0.0',
      status: 'online',
      message: 'A casa sempre ganha!',
      houseMargin: '90%'
    }));
  }

  // Normalização de URL para servir arquivos
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/frontend/index.html';
  }

  const filePath = path.join(ROOT_DIR, reqPath);

  // Segurança: Previne Path Traversal (Directory Traversal)
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Acesso Negado');
  }

  // Verifica existência do arquivo
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Arquivo Não Encontrado');
    }

    // Se for diretório, tenta servir o index.html daquele diretório
    let finalPath = filePath;
    if (stats.isDirectory()) {
      finalPath = path.join(filePath, 'index.html');
    }

    fs.readFile(finalPath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('404 Arquivo Não Encontrado');
      }

      const ext = path.extname(finalPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎰 Joselito Bet - Servidor Educacional Rodando!`);
  console.log(`🌐 Acesse em: http://localhost:${PORT}/frontend/index.html`);
  console.log(`🎓 Perfil: SENAI - Demonstração Didática de Cassino`);
  console.log(`====================================================`);
});
