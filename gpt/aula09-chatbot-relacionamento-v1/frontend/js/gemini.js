/**
 * ==============================================================================
 * SERVIÇO DE INTEGRAÇÃO COM A API DO GOOGLE AI STUDIO GEMINI
 * ==============================================================================
 * Desenvolvido para o perfil SENAI com foco em clareza, modularidade e resiliência.
 * 
 * Funcionalidades principais:
 * 1. Resolução dinâmica da chave de API (LocalStorage -> config.js -> Backend .env).
 * 2. Consulta e listagem dos modelos disponíveis via endpoint /v1beta/models.
 * 3. Envio de mensagens com histórico contextual e System Instruction.
 * 4. Fallback Automático: Em caso de Erro 503 (ou 429/500), tenta automaticamente
 *    o próximo modelo da lista sem travar a experiência do usuário.
 * ==============================================================================
 */

class GeminiService {
    constructor() {
        // Inicializa a lista de modelos padrão do config
        this.availableModels = [...(window.APP_CONFIG.DEFAULT_MODELS || ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"])];
        this.currentModelIndex = 0;
        this.onModelFallbackCallback = null;
    }

    /**
     * Obtém a chave de API ativa segundo a ordem de prioridade
     * @returns {string} Chave da API
     */
    getApiKey() {
        // 1. Prioriza a chave do arquivo .env / config.js
        if (window.APP_CONFIG && window.APP_CONFIG.GEMINI_API_KEY && window.APP_CONFIG.GEMINI_API_KEY.trim().length > 0) {
            return window.APP_CONFIG.GEMINI_API_KEY.trim();
        }

        // 2. Recupera do LocalStorage se houver
        const localKey = localStorage.getItem('gemini_api_key');
        if (localKey && localKey.trim().length > 0) {
            return localKey.trim();
        }

        return "";
    }

    /**
     * Salva a chave no armazenamento local do navegador
     * @param {string} key Chave de API
     */
    setApiKey(key) {
        if (key && key.trim()) {
            localStorage.setItem('gemini_api_key', key.trim());
        } else {
            localStorage.removeItem('gemini_api_key');
        }
    }

    /**
     * Define o modelo atualmente selecionado
     * @param {string} modelName Nome do modelo (ex: gemini-2.5-flash)
     */
    setActiveModel(modelName) {
        const cleanName = modelName.replace(/^models\//, '');
        const idx = this.availableModels.indexOf(cleanName);
        if (idx !== -1) {
            this.currentModelIndex = idx;
        } else {
            this.availableModels.unshift(cleanName);
            this.currentModelIndex = 0;
        }
    }

    /**
     * Retorna o nome do modelo atualmente em uso
     * @returns {string}
     */
    getActiveModel() {
        if (this.availableModels.length === 0) return "gemini-2.5-flash";
        return this.availableModels[this.currentModelIndex] || this.availableModels[0];
    }

    /**
     * Registra callback para ser avisado quando ocorrer uma troca de modelo por erro 503
     * @param {Function} callback (oldModel, newModel, reason) => {}
     */
    onFallback(callback) {
        this.onModelFallbackCallback = callback;
    }

    /**
     * Consulta a lista de modelos oficiais disponíveis diretamente na API do Gemini
     * @param {string} [customKey] Chave opcional para validação
     * @returns {Promise<Array<string>>} Lista de nomes de modelos compatíveis
     */
    async fetchModelsList(customKey = null) {
        const apiKey = customKey || this.getApiKey();
        if (!apiKey) {
            throw new Error("Chave de API não informada. Insira sua chave para listar os modelos.");
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const msg = errorData.error?.message || `Erro ${response.status}: ${response.statusText}`;
                throw new Error(msg);
            }

            const data = await response.json();
            
            // Filtra modelos com capacidade de geração de texto (generateContent)
            const validModels = (data.models || [])
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                .map(m => m.name.replace(/^models\//, ''))
                // Prioriza os modelos modernos da família Gemini (flash, pro)
                .sort((a, b) => {
                    const score = name => (name.includes('flash') ? 2 : name.includes('pro') ? 1 : 0);
                    return score(b) - score(a);
                });

            if (validModels.length > 0) {
                this.availableModels = validModels;
                this.currentModelIndex = 0;
            }

            return this.availableModels;
        } catch (error) {
            console.warn("Falha ao buscar modelos na API do Gemini. Utilizando modelos padrão locais.", error);
            throw error;
        }
    }

    /**
     * Envia mensagem para o Gemini com histórico e mecanismo resiliente de Fallback para erro 503
     * @param {Array<{role: string, text: string}>} chatHistory Histórico formatado da conversa
     * @returns {Promise<{reply: string, usedModel: string}>} Resposta da modelo Natália
     */
    async sendMessage(chatHistory) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error("Chave de API do Gemini não configurada! Por favor, insira sua chave no botão de configurações ou no arquivo config.js.");
        }

        // Tenta enviar utilizando o modelo atual e, caso ocorra 503/429/indisponibilidade,
        // avança iterativamente para os próximos modelos da lista de fallback.
        let attempts = 0;
        const totalModels = this.availableModels.length;

        while (attempts < totalModels) {
            const modelName = this.getActiveModel();
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

            // Constrói o corpo da requisição com o formato oficial da API v1beta do Gemini
            const contents = chatHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            const requestBody = {
                contents: contents,
                systemInstruction: {
                    parts: [{ text: window.APP_CONFIG.SYSTEM_INSTRUCTION }]
                },
                generationConfig: window.APP_CONFIG.GENERATION_CONFIG
            };

            try {
                console.log(`[GeminiService] Enviando requisição para o modelo: ${modelName}`);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                // Se o servidor retornar 503 (Serviço Indisponível / Sobrecarregado) ou 429
                if (response.status === 503 || response.status === 429) {
                    const errorJson = await response.json().catch(() => ({}));
                    console.warn(`[GeminiService] Modelo ${modelName} retornou status ${response.status}. Iniciando fallback para o próximo modelo.`, errorJson);

                    // Notifica sobre a alternância
                    const oldModel = modelName;
                    this.currentModelIndex = (this.currentModelIndex + 1) % this.availableModels.length;
                    const nextModel = this.getActiveModel();

                    if (this.onModelFallbackCallback) {
                        this.onModelFallbackCallback(oldModel, nextModel, `Erro ${response.status} (Serviço sobrecarregado)`);
                    }

                    attempts++;
                    continue; // Tenta o próximo modelo
                }

                if (!response.ok) {
                    const errorJson = await response.json().catch(() => ({}));
                    // Se for erro de sobrecarga, cota, 503, ou modelo não suportado/descontinuado (404), tenta o próximo
                    if (errorMsg.toLowerCase().includes('quota') || 
                        errorMsg.toLowerCase().includes('overloaded') || 
                        errorMsg.toLowerCase().includes('not found') || 
                        errorMsg.toLowerCase().includes('no longer available') ||
                        response.status === 404 || 
                        response.status >= 500) {
                        console.warn(`[GeminiService] Modelo ${modelName} indisponível (${errorMsg}). Alternando automaticamente para o próximo...`);
                        const oldModel = modelName;
                        this.currentModelIndex = (this.currentModelIndex + 1) % this.availableModels.length;
                        const nextModel = this.getActiveModel();
                        if (this.onModelFallbackCallback) {
                            this.onModelFallbackCallback(oldModel, nextModel, errorMsg);
                        }
                        attempts++;
                        continue;
                    }

                    throw new Error(errorMsg);
                }

                const data = await response.json();

                // Valida e extrai o texto de resposta
                const candidate = data.candidates?.[0];
                if (!candidate || !candidate.content || !candidate.content.parts?.[0]?.text) {
                    // Caso o filtro de segurança tenha bloqueado ou resposta vazia
                    if (candidate?.finishReason === 'SAFETY') {
                        return {
                            reply: "Meu bem, vamos falar sobre outra coisa mais gostosa? Me conta o que você fez de bom hoje... 💋✨",
                            usedModel: modelName
                        };
                    }
                    throw new Error("A API retornou uma resposta sem conteúdo legível.");
                }

                const replyText = candidate.content.parts[0].text;
                return {
                    reply: replyText,
                    usedModel: modelName
                };

            } catch (networkError) {
                console.error(`[GeminiService] Erro de rede ou exceção no modelo ${modelName}:`, networkError);
                
                // Se ainda restarem modelos para testar
                if (attempts < totalModels - 1) {
                    const oldModel = modelName;
                    this.currentModelIndex = (this.currentModelIndex + 1) % this.availableModels.length;
                    const nextModel = this.getActiveModel();
                    if (this.onModelFallbackCallback) {
                        this.onModelFallbackCallback(oldModel, nextModel, networkError.message);
                    }
                    attempts++;
                    continue;
                } else {
                    throw networkError;
                }
            }
        }

        throw new Error("Todos os modelos disponíveis retornaram erro 503 ou indisponibilidade temporária. Por favor, aguarde alguns instantes e tente novamente.");
    }
}

// Instância global do serviço
window.geminiService = new GeminiService();
