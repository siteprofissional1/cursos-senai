/**
 * ==============================================================================
 * SERVIDOR BACKEND - CHATBOT DE RELACIONAMENTO (NATÁLIA)
 * ==============================================================================
 * Desenvolvido no contexto de capacitação técnica (Perfil SENAI) com Google Antigravity.
 * Este servidor Express cumpre duas funções essenciais:
 * 1. Servir a interface web estática localizada na pasta `/frontend`.
 * 2. Disponibilizar endpoints REST seguros para carregar a chave do arquivo `.env`
 *    e intermediar requisições para a API do Google AI Studio Gemini caso desejado.
 * ==============================================================================
 */

// Importação das bibliotecas fundamentais do ecossistema Node.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente a partir do arquivo .env (prioriza o da pasta backend ou da raiz)
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.gemini_api_key) {
    // Tenta carregar da raiz caso o usuário tenha preenchido lá
    dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

// Inicialização da aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de middlewares para tratamento de JSON, CORS e requisições codificadas
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servindo a pasta frontend como arquivos estáticos
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

/**
 * ROTA: GET /api/config
 * Finalidade: Permite que o frontend consulte se existe uma chave configurada no `.env`
 * do servidor sem expor detalhes sensíveis desnecessários.
 */
app.get('/api/config', (req, res) => {
    const apiKey = process.env.gemini_api_key ? process.env.gemini_api_key.trim() : '';
    res.json({
        hasApiKey: Boolean(apiKey),
        apiKey: apiKey // Retorna para que o frontend possa utilizar nas chamadas diretas
    });
});

/**
 * ROTA: GET /api/models
 * Finalidade: Consulta a lista oficial de modelos do Google Gemini via API REST v1beta.
 */
app.get('/api/models', async (req, res) => {
    try {
        const apiKey = req.query.key || process.env.gemini_api_key;
        if (!apiKey) {
            return res.status(400).json({ error: 'Nenhuma chave de API Gemini fornecida.' });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // Filtra apenas modelos que suportam generateContent
        const chatModels = (data.models || []).filter(model => 
            model.supportedGenerationMethods && 
            model.supportedGenerationMethods.includes('generateContent')
        );

        res.json({ models: chatModels });
    } catch (error) {
        console.error('Erro ao consultar modelos Gemini:', error);
        res.status(500).json({ error: 'Falha interna ao consultar modelos do Gemini.', details: error.message });
    }
});

/**
 * Rota curinga para direcionar qualquer requisição não encontrada para o frontend index.html
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Inicialização do servidor na porta configurada
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Chatbot Natália rodando com sucesso!`);
    console.log(`📍 Acesse no navegador: http://localhost:${PORT}`);
    console.log(`🔑 Status da Chave no .env: ${process.env.gemini_api_key ? 'Configurada ✔️' : 'Vazia (Preencha o .env ou no frontend)'}`);
    console.log(`====================================================`);
});
