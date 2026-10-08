/**
 * ==============================================================================
 * APLICAÇÃO PRINCIPAL DO FRONTEND (APP.JS) - CHATBOT NATÁLIA
 * ==============================================================================
 * Interface tranquila, simplificada e direta:
 * - A chave de API já vem configurada no .env e sincronizada em config.js
 * - O usuário não precisa configurar nada manualmente na tela!
 * - Suporta envio de mensagens, áudio simulado, status e fallback para erro 503.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
    // --- ELEMENTOS DO DOM ---
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const activeModelTag = document.getElementById('activeModelTag');
    const fallbackToast = document.getElementById('fallbackToast');
    const fallbackText = document.getElementById('fallbackText');

    // Botões e Modais
    const openProfileBtn = document.getElementById('openProfileBtn');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = document.getElementById('closeProfileBtn');

    // Chips de mensagens rápidas
    const promptChips = document.querySelectorAll('.prompt-chip');

    // Histórico de mensagens local
    let messageHistory = [];

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    async function initApp() {
        // 1. Tenta verificar se o servidor backend tem chave no .env caso rode em Node
        try {
            const resp = await fetch('/api/config');
            if (resp.ok) {
                const data = await resp.json();
                if (data.apiKey) {
                    window.APP_CONFIG.GEMINI_API_KEY = data.apiKey;
                }
            }
        } catch (e) {
            // Executando em servidor estático ou direto no navegador
        }

        // 2. Atualiza a tag do modelo ativo na barra superior
        updateModelUI();

        // 3. Carrega histórico salvo no localStorage ou mensagem de boas-vindas
        loadChatHistory();

        // 4. Configura ouvinte para fallback automático (erro 503)
        window.geminiService.onFallback((oldModel, newModel, reason) => {
            showFallbackAlert(oldModel, newModel, reason);
            updateModelUI();
        });
    }

    /**
     * Atualiza o indicador do modelo ativo no cabeçalho
     */
    function updateModelUI() {
        const active = window.geminiService.getActiveModel();
        if (activeModelTag) {
            activeModelTag.textContent = `✨ ${active}`;
        }
    }

    /**
     * Exibe aviso discreto caso o modelo sofra indisponibilidade 503 e alterne
     */
    function showFallbackAlert(oldModel, newModel, reason) {
        if (!fallbackToast || !fallbackText) return;
        fallbackText.innerHTML = `<strong>⚠️ Modelo ${oldModel} indisponível (503):</strong> Alternando automaticamente para <strong>${newModel}</strong>...`;
        fallbackToast.classList.add('show');

        setTimeout(() => {
            fallbackToast.classList.remove('show');
        }, 5000);
    }

    /**
     * Carrega mensagens salvas ou gera a saudação carinhosa inicial
     */
    function loadChatHistory() {
        const saved = localStorage.getItem('natalia_chat_history');
        if (saved) {
            try {
                messageHistory = JSON.parse(saved);
                messageHistory.forEach(msg => renderMessageToDOM(msg.role, msg.text, msg.time, msg.isVoice));
                scrollToBottom();
                return;
            } catch (err) {
                console.error('Erro ao ler histórico salvo:', err);
            }
        }

        // Mensagem inicial padrão da Natália
        const initialWelcome = "Oi meu bem... Estava aqui no camarim terminando uma sessão de fotos e pensei em você. Que bom que você veio falar comigo! Como foi o seu dia, lindo? 💋✨";
        const initialVoice = {
            role: 'assistant',
            text: initialWelcome,
            time: getCurrentTime(),
            isVoice: true
        };

        messageHistory.push(initialVoice);
        renderMessageToDOM(initialVoice.role, initialVoice.text, initialVoice.time, initialVoice.isVoice);
        saveChatHistory();
        scrollToBottom();
    }

    /**
     * Salva o histórico atual no localStorage
     */
    function saveChatHistory() {
        localStorage.setItem('natalia_chat_history', JSON.stringify(messageHistory));
    }

    /**
     * Retorna a hora atual formatada (HH:MM)
     */
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Rola o chat suavemente até a mensagem mais recente
     */
    function scrollToBottom() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    }

    /**
     * Renderiza um balão de mensagem no DOM
     */
    function renderMessageToDOM(role, text, time, isVoice = false) {
        const isUser = role === 'user';
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user' : 'natalia'}`;

        let innerContent = '';

        if (isVoice) {
            innerContent = `
                <div class="message-bubble">
                    <div class="voice-note-player">
                        <button class="play-voice-btn" title="Ouvir áudio da Natália">▶</button>
                        <div class="waveform">
                            <span class="waveform-bar"></span>
                            <span class="waveform-bar"></span>
                            <span class="waveform-bar"></span>
                            <span class="waveform-bar"></span>
                            <span class="waveform-bar"></span>
                            <span class="waveform-bar"></span>
                            <span class="waveform-bar"></span>
                        </div>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">0:15</span>
                    </div>
                    <p style="margin-top: 8px; font-size: 0.92rem; font-style: italic;">"${formatTextWithEmoji(text)}"</p>
                </div>
            `;
        } else {
            innerContent = `
                <div class="message-bubble">
                    ${formatTextWithEmoji(text)}
                </div>
            `;
        }

        const metaContent = `
            <div class="message-meta">
                <span>${time || getCurrentTime()}</span>
                ${isUser ? '<span class="check-icon">✓✓</span>' : ''}
            </div>
        `;

        msgDiv.innerHTML = innerContent + metaContent;

        if (isVoice) {
            const playBtn = msgDiv.querySelector('.play-voice-btn');
            const wave = msgDiv.querySelector('.waveform');
            playBtn.addEventListener('click', () => {
                toggleSimulatedVoice(playBtn, wave, text);
            });
        }

        chatMessages.insertBefore(msgDiv, typingIndicator);
    }

    /**
     * Formata quebras de linha e remove qualquer resquício de narração teatral entre asteriscos
     */
    function formatTextWithEmoji(text) {
        // Higieniza qualquer ação acidental entre asteriscos para manter 100% estilo chat real
        const sanitized = text.replace(/\*[^*]+\*/g, '').trim();
        return sanitized.replace(/\n/g, '<br>');
    }

    /**
     * Simula a reprodução de voz da Natália usando SpeechSynthesis
     */
    function toggleSimulatedVoice(button, waveform, textToSpeak) {
        const isPlaying = waveform.classList.contains('playing');

        if (isPlaying) {
            waveform.classList.remove('playing');
            button.textContent = '▶';
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        } else {
            waveform.classList.add('playing');
            button.textContent = '⏸';

            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const cleanText = textToSpeak.replace(/\*[^*]+\*/g, '').replace(/<[^>]*>/g, '');
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = 'pt-BR';
                utterance.rate = 1.0;
                utterance.pitch = 1.15;

                utterance.onend = () => {
                    waveform.classList.remove('playing');
                    button.textContent = '▶';
                };
                utterance.onerror = () => {
                    waveform.classList.remove('playing');
                    button.textContent = '▶';
                };

                window.speechSynthesis.speak(utterance);
            } else {
                setTimeout(() => {
                    waveform.classList.remove('playing');
                    button.textContent = '▶';
                }, 4000);
            }
        }
    }

    /**
     * Envia mensagem do usuário para a IA
     */
    async function handleSendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        // Limpa campo de entrada
        messageInput.value = '';

        // Registra mensagem do usuário
        const userMsg = {
            role: 'user',
            text: text,
            time: getCurrentTime()
        };
        messageHistory.push(userMsg);
        renderMessageToDOM('user', text, userMsg.time);
        saveChatHistory();
        scrollToBottom();

        // Mostra animação de digitação
        typingIndicator.classList.add('show');
        scrollToBottom();

        try {
            // Chamada direta para o Gemini
            const result = await window.geminiService.sendMessage(messageHistory);

            // Resposta da modelo Natália
            const nataliaMsg = {
                role: 'assistant',
                text: result.reply,
                time: getCurrentTime(),
                usedModel: result.usedModel
            };

            messageHistory.push(nataliaMsg);
            renderMessageToDOM('assistant', result.reply, nataliaMsg.time);
            saveChatHistory();
            updateModelUI();

        } catch (error) {
            console.error('Erro na conversa:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message natalia';
            errorDiv.innerHTML = `
                <div class="message-bubble" style="border-color: #ef4444; background: rgba(239, 68, 68, 0.1);">
                    <p style="color: #fca5a5;">Ai amor, tive uma oscilação na conexão com a agência... 🙈 (${error.message})</p>
                </div>
            `;
            chatMessages.insertBefore(errorDiv, typingIndicator);
        } finally {
            typingIndicator.classList.remove('show');
            scrollToBottom();
        }
    }

    // --- EVENT LISTENERS ---

    // Enviar ao clicar no botão
    sendBtn.addEventListener('click', handleSendMessage);

    // Enviar ao pressionar Enter
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Chips de mensagens rápidas
    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            messageInput.value = chip.textContent.trim();
            messageInput.focus();
        });
    });

    // Abrir e fechar perfil da Natália
    openProfileBtn.addEventListener('click', () => {
        profileModal.classList.add('open');
    });
    closeProfileBtn.addEventListener('click', () => {
        profileModal.classList.remove('open');
    });

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.classList.remove('open');
    });

    // Limpar conversa
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            if (confirm('Deseja limpar as mensagens e recomeçar a conversa com a Natália?')) {
                localStorage.removeItem('natalia_chat_history');
                location.reload();
            }
        });
    }

    // Inicia a aplicação
    await initApp();
});
