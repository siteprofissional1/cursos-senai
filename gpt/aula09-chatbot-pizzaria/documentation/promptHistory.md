# Histórico de Prompts

## Sessão: 02/10/2026

### Prompt 1
```text
/goal /grill-me /orchestrate analisa o codigo <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot - Pizzaria</title>
    <style>
        :root {
            --bg-color: #0f0f1a;
            --chat-bg: #1c1c2b;
            --header-bg: #2a2a40;
            --bot-msg-bg: #2a2a40;
            --user-msg-bg: #ff4757;
            --text-color: #ffffff;
            --text-muted: #a0a0b5;
            --border-color: #3a3a50;
            --accent-color: #ff4757;
            --accent-hover: #ff6b78;
            --success-color: #2ed573;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
        }

        .app-container {
            width: 100%;
            max-width: 450px;
            height: 100vh;
            background-color: var(--chat-bg);
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            position: relative;
        }

        @media (min-width: 480px) {
            .app-container {
                height: 90vh;
                border-radius: 20px;
                overflow: hidden;
            }
        }

        .chat-header {
            background-color: var(--header-bg);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            border-bottom: 1px solid var(--border-color);
            z-index: 10;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .avatar {
            width: 45px;
            height: 45px;
            background-color: var(--accent-color);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            box-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
            flex-shrink: 0;
        }

        .header-info h1 {
            font-size: 18px;
            margin-bottom: 3px;
        }

        .header-info p {
            font-size: 12px;
            color: var(--success-color);
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .header-info p::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: var(--success-color);
            border-radius: 50%;
        }

        .chat-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
            scroll-behavior: smooth;
        }

        .chat-body::-webkit-scrollbar { width: 6px; }
        .chat-body::-webkit-scrollbar-thumb {
            background-color: var(--border-color);
            border-radius: 3px;
        }

        .message-row {
            display: flex;
            width: 100%;
            animation: fadeIn 0.4s ease forwards;
        }

        .msg-bot-row { justify-content: flex-start; }
        .msg-user-row { justify-content: flex-end; }

        .message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 15px;
            line-height: 1.4;
            position: relative;
            word-wrap: break-word;
        }

        .msg-bot {
            background-color: var(--bot-msg-bg);
            color: var(--text-color);
            border-bottom-left-radius: 4px;
        }

        .msg-user {
            background-color: var(--user-msg-bg);
            color: white;
            border-bottom-right-radius: 4px;
        }

        .options-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
            width: 100%;
            max-width: 90%;
            align-self: flex-start;
            animation: slideUp 0.3s ease forwards;
        }

        .option-btn {
            background-color: var(--header-bg);
            border: 1.5px solid var(--border-color);
            color: var(--text-color);
            padding: 14px 16px;
            border-radius: 16px;
            cursor: pointer;
            font-size: 14px;
            text-align: left;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            gap: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        }

        .option-btn:hover {
            border-color: var(--accent-color);
            background-color: rgba(255, 71, 87, 0.08);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.18);
        }

        .option-btn:active {
            transform: translateY(0);
        }

        .option-btn:hover .pizza-ingredients {
            color: var(--text-muted);
        }

        .option-btn.disabled {
            opacity: 0.5;
            pointer-events: none;
            border-color: var(--border-color);
            color: var(--text-muted);
            box-shadow: none;
        }

        .pizza-btn-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            gap: 10px;
        }

        .pizza-btn-top > span:first-child {
            font-weight: 600;
            font-size: 14.5px;
        }

        .option-price {
            background-color: rgba(255, 71, 87, 0.15);
            color: var(--accent-color);
            font-weight: bold;
            font-size: 13px;
            padding: 4px 10px;
            border-radius: 8px;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .pizza-ingredients {
            font-size: 11.5px;
            color: var(--text-muted);
            font-style: italic;
            line-height: 1.4;
            transition: color 0.2s ease;
        }

        .chat-footer {
            padding: 15px;
            background-color: var(--header-bg);
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 10px;
        }

        .chat-input {
            flex: 1;
            background-color: var(--chat-bg);
            border: 1px solid var(--border-color);
            color: white;
            padding: 12px 15px;
            border-radius: 25px;
            outline: none;
            font-size: 15px;
            transition: border 0.3s;
        }

        .chat-input:focus { border-color: var(--accent-color); }
        .chat-input:disabled { opacity: 0.6; cursor: not-allowed; }

        .send-btn {
            background-color: var(--accent-color);
            border: none;
            color: white;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.2s, transform 0.1s;
        }

        .send-btn:hover:not(:disabled) { background-color: var(--accent-hover); }
        .send-btn:active:not(:disabled) { transform: scale(0.95); }
        .send-btn:disabled {
            background-color: var(--border-color);
            cursor: not-allowed;
            color: var(--text-muted);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .typing-indicator { display: flex; gap: 4px; padding: 5px 0; }
        .dot {
            width: 6px;
            height: 6px;
            background-color: var(--text-muted);
            border-radius: 50%;
            animation: bounce 1.3s linear infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
        }

        /* Overlay de fechado */
        .closed-overlay {
            position: absolute;
            inset: 0;
            background: rgba(15, 15, 26, 0.92);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 100;
            padding: 30px;
            text-align: center;
            backdrop-filter: blur(4px);
        }

        .closed-icon {
            font-size: 64px;
            margin-bottom: 20px;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
        }

        .closed-title {
            font-size: 22px;
            font-weight: bold;
            color: var(--accent-color);
            margin-bottom: 12px;
        }

        .closed-text {
            font-size: 15px;
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .closed-hours {
            background: var(--header-bg);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            padding: 16px 24px;
            font-size: 14px;
            color: var(--text-color);
            line-height: 1.8;
        }

        .closed-hours span {
            color: var(--success-color);
            font-weight: bold;
        }

        /* Indicador de status no header */
        .status-closed p {
            color: var(--accent-color) !important;
        }

        .status-closed p::before {
            background-color: var(--accent-color) !important;
        }
    </style>
</head>
<body>

    <div class="app-container">
        <header class="chat-header" id="chat-header">
            <div class="avatar">🍕</div>
            <div class="header-info">
                <h1>Pizzaria Fornalha de Ourinhos</h1>
                <p id="status-text">No final, um atendente te informará o tempo para entrega ou retirada.</p>
            </div>
        </header>

        <!-- Overlay exibido fora do horário de funcionamento -->
        <div class="closed-overlay" id="closed-overlay" style="display:none;">
            <div class="closed-icon">🍕</div>
            <div class="closed-title">Estamos fechados no momento</div>
            <div class="closed-text">
                Nosso sistema de pedidos online está disponível<br>
                apenas durante o horário de funcionamento.
            </div>
            <div class="closed-hours">
                🗓️ <strong>Segunda a Sábado</strong><br>
                <span>18:00</span> às <span>23:30</span>
            </div>
            <div style="margin-top:20px; font-size:13px; color:var(--text-muted);">
                Volte mais tarde e faça seu pedido! 😊
            </div>
        </div>

        <main class="chat-body" id="chat-body"></main>

        <footer class="chat-footer">
            <input type="text" id="user-input" class="chat-input" placeholder="Selecione uma opção acima..." disabled autocomplete="off">
            <button id="send-btn" class="send-btn" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </footer>
    </div>

    <script>
        const ZAP_NUMBER = "5514996213939";
        
        const CARDAPIO = {
            pizzas: [
                { 
                    id: 'p1', 
                    name: 'Mussarela',
                    ingredients: 'Molho de tomate, mussarela, tomate, orégano e azeitonas',
                    prices: { broto: 39, media: 45, grande: 53 } 
                },
                { 
                    id: 'p2', 
                    name: 'Dois queijos',
                    ingredients: 'Molho de tomate, mussarela, catupiry, tomate, orégano e azeitonas',
                    prices: { broto: 39, media: 45, grande: 53 } 
                },
                { 
                    id: 'p3', 
                    name: 'Três queijos',
                    ingredients: 'Molho de tomate, mussarela, catupiry, provolone, tomate, orégano e azeitonas',
                    prices: { broto: 40, media: 46, grande: 54 } 
                },
                { 
                    id: 'p4', 
                    name: 'Quatro queijos',
                    ingredients: 'Molho de tomate, mussarela, catupiry, provolone, gorgonzola, tomate, orégano e azeitonas',
                    prices: { broto: 42, media: 48, grande: 56 } 
                },
                { 
                    id: 'p5', 
                    name: 'Cinco queijos',
                    ingredients: 'Molho de tomate, mussarela, catupiry, provolone, gorgonzola, parmesão, tomate, orégano e azeitonas',
                    prices: { broto: 43, media: 49, grande: 57 } 
                },
                { 
                    id: 'p6', 
                    name: 'Seis queijos',
                    ingredients: 'Molho de tomate, mussarela, catupiry, provolone, gorgonzola, parmesão, cheddar, tomate, orégano e azeitonas',
                    prices: { broto: 46, media: 52, grande: 60 } 
                },
                { 
                    id: 'p7', 
                    name: 'Alho e óleo',
                    ingredients: 'Molho de tomate, mussarela, alho, orégano e azeitonas',
                    prices: { broto: 40, media: 46, grande: 54 } 
                },
                { 
                    id: 'p8', 
                    name: 'Atum',
                    ingredients: 'Molho de tomate, mussarela, atum ralado, cebola, orégano e azeitonas',
                    prices: { broto: 50, media: 56, grande: 64 } 
                },
                { 
                    id: 'p9', 
                    name: 'Bacon',
                    ingredients: 'Molho de tomate, mussarela, bacon, orégano e azeitonas',
                    prices: { broto: 40, media: 46, grande: 54 } 
                },
                { 
                    id: 'p10', 
                    name: 'Baiana',
                    ingredients: 'Molho de tomate, mussarela, calabresa moída, cebola, pimenta, orégano e azeitonas',
                    prices: { broto: 40, media: 46, grande: 54 } 
                },
                { 
                    id: 'p11', 
                    name: 'Brócolis',
                    ingredients: 'Molho de tomate, mussarela, brócolis, orégano e azeitonas',
                    prices: { broto: 42, media: 48, grande: 56 } 
                },
                { 
                    id: 'p12', 
                    name: 'Brócolis com bacon',
                    ingredients: 'Molho de tomate, mussarela, brócolis, bacon, orégano e azeitonas',
                    prices: { broto: 48, media: 54, grande: 62 } 
                },
                { 
                    id: 'p13', 
                    name: 'Calabresa',
                    ingredients: 'Molho de tomate, mussarela, calabresa, cebola, orégano e azeitonas',
                    prices: { broto: 40, media: 46, grande: 54 } 
                },
                { 
                    id: 'p14', 
                    name: 'Canadense',
                    ingredients: 'Molho de tomate, mussarela, lombinho, bacon, orégano e azeitonas',
                    prices: { broto: 44, media: 50, grande: 58 } 
                },
                { 
                    id: 'p15', 
                    name: 'Capitão',
                    ingredients: 'Molho de tomate, mussarela, calabresa moída, bacon, orégano e azeitonas',
                    prices: { broto: 42, media: 48, grande: 56 } 
                },
                { 
                    id: 'p16', 
                    name: 'Carne seca',
                    ingredients: 'Molho de tomate, mussarela, catupiry, carne seca desfiada, cebola, orégano e azeitonas',
                    prices: { broto: 59, media: 65, grande: 73 } 
                },
                { 
                    id: 'p17', 
                    name: 'Champignon',
                    ingredients: 'Molho de tomate, mussarela, champignon, milho, alho, orégano e azeitonas',
                    prices: { broto: 44, media: 50, grande: 58 } 
                },
                { 
                    id: 'p18', 
                    name: 'Domichel',
                    ingredients: 'Molho de tomate, mussarela, champignon, palmito, alho, orégano e azeitonas',
                    prices: { broto: 52, media: 58, grande: 66 } 
                },
                { 
                    id: 'p19', 
                    name: 'Escarola',
                    ingredients: 'Molho de tomate, mussarela, escarola, orégano e azeitonas',
                    prices: { broto: 40, media: 46, grande: 54 } 
                },
                { 
                    id: 'p20', 
                    name: 'Escarola 2',
                    ingredients: 'Molho de tomate, mussarela, escarola, bacon, orégano e azeitonas',
                    prices: { broto: 42, media: 48, grande: 56 } 
                },
                { 
                    id: 'p21', 
                    name: 'Escarola 3',
                    ingredients: 'Molho de tomate, mussarela, escarola, aliche, alho, orégano e azeitonas',
                    prices: { broto: 44, media: 50, grande: 58 } 
                },
                { 
                    id: 'p22', 
                    name: 'Fornalha',
                    ingredients: 'Molho de tomate, mussarela, champignon, palmito, milho, ervilha, orégano e azeitonas',
                    prices: { broto: 44, media: 50, grande: 58 } 
                },
                { 
                    id: 'p23', 
                    name: 'Fortaleza',
                    ingredients: 'Molho de tomate, mussarela, presunto, bacon, ervilha, milho, palmito, ovo, orégano e azeitonas',
                    prices: { broto: 52, media: 58, grande: 66 } 
                },
                { 
                    id: 'p24', 
                    name: 'Francesa',
                    ingredients: 'Molho de tomate, mussarela, frango desfiado, milho, bacon, orégano e azeitonas',
                    prices: { broto: 46, media: 52, grande: 60 } 
                },
                { 
                    id: 'p25', 
                    name: 'Frango com catupiry',
                    ingredients: 'Molho de tomate, frango desfiado, catupiry, orégano e azeitonas',
                    prices: { broto: 42, media: 48, grande: 56 } 
                },
                { 
                    id: 'p26', 
                    name: 'Frango com mussarela',
                    ingredients: 'Molho de tomate, frango desfiado, mussarela, orégano e azeitonas',
                    prices: { broto: 42, media: 48, grande: 56 } 
                },
                { 
                    id: 'p27', 
                    name: 'Italiana',
                    ingredients: 'Molho de tomate, mussarela, presunto, bacon, milho, orégano e azeitonas',
                    prices: { broto: 44, media: 50, grande: 58 } 
                },
                { 
                    id: 'p28', 
                    name: 'Lenheira',
                    ingredients: 'Molho de tomate, mussarela, atum ralado, ervilha, cebola, ovo, orégano e azeitonas',
                    prices: { broto: 52, media: 58, grande: 66 } 
                },
                { 
                    id: 'p29', 
                    name: 'Lombo',
                    ingredients: 'Molho de tomate, mussarela, lombinho, orégano e azeitonas',
                    prices: { broto: 42, media: 48, grande: 56 } 
                },
                { 
                    id: 'p30', 
                    name: 'Margherita',
                    ingredients: 'Molho de tomate, mussarela, manjericão, orégano e azeitonas',
                    prices: { broto: 44, media: 50, grande: 58 } 
                },
                { 
                    id: 'p31', 
                    name: 'Milho',
                    ingredients: 'Molho de tomate, mussarela, milho, orégano e azeitonas',
                    prices: { broto: 40, media: 46, grande: 54 } 
                },
                { 
                    id: 'p32', 
                    name: 'Moda da Casa',
                    ingredients: 'Molho de tomate, mussarela, presunto, ervilha, palmito, ovo, orégano e azeitonas',
                    prices: { broto: 46, media: 52, grande: 60 } 
                },
                { 
                    id: 'p33', 
                    name: 'Napolitana',
                    ingredients: 'Molho de tomate, mussarela, provolone, orégano e azeitonas',
                    prices: { broto: 39, media: 45, grande: 53 } 
                },
                { 
                    id: 'p34', 
                    name: 'Palmito',
                    ingredients: 'Molho de tomate, mussarela, palmito, orégano e azeitonas',
                    prices: { broto: 44, media: 50, grande: 58 } 
                },
                { 
                    id: 'p35', 
                    name: 'Peperone',
                    ingredients: 'Molho de tomate, mussarela, peperone, orégano e azeitonas',
                    prices: { broto: 52, media: 58, grande: 66 } 
                },
                { 
                    id: 'p36', 
                    name: 'Portuguesa',
                    ingredients: 'Molho de tomate, mussarela, presunto, ervilha, cebola, ovo, orégano e azeitonas',
                    prices: { broto: 44, media: 50, grande: 58 } 
                },
                { 
                    id: 'p37', 
                    name: 'Presunto',
                    ingredients: 'Molho de tomate, mussarela, presunto, orégano e azeitonas',
                    prices: { broto: 40, media: 46, grande: 54 } 
                },
                { 
                    id: 'p38', 
                    name: 'Romana',
                    ingredients: 'Molho de tomate, mussarela, aliche, parmesão, orégano e azeitonas',
                    prices: { broto: 45, media: 51, grande: 59 } 
                },
                { 
                    id: 'p39', 
                    name: 'Strogonoff de Carne',
                    ingredients: 'Molho de tomate, mussarela, strogonoff de carne, batata palha, orégano e azeitonas',
                    prices: { broto: 56, media: 62, grande: 70 } 
                },
                {
                    id: 'p40', 
                    name: 'Strogonoff de Frango',
                    ingredients: 'Molho de tomate, mussarela, strogonoff de frango, batata palha, orégano e azeitonas',
                    prices: { broto: 56, media: 62, grande: 70 } 
                },
                { 
                    id: 'p41', 
                    name: 'Tomate seco',
                    ingredients: 'Molho de tomate, mussarela, tomate seco, rúcula, orégano e azeitonas',
                    prices: { broto: 44, media: 50, grande: 58 } 
                },
                {
                    id: 'p42', 
                    name: 'Chocolate',
                    ingredients: 'Creme de leite, chocolate ao leite e chocolate branco',
                    prices: { broto: 56, media: 62, grande: 70 } 
                },
                { 
                    id: 'p43', 
                    name: 'Romeu e Julieta',
                    ingredients: 'Goiabada e mussarela',
                    prices: { broto: 39, media: 45, grande: 53 } 
                }
            ],
            bebidas: [
                { id: 'b1', name: 'Coca-Cola 2L', price: 15.00 },
                { id: 'b2', name: 'Coca-Cola Zero 2L', price: 15.00 },
                { id: 'b3', name: 'Coca-Cola 1L', price: 10.00 },
                { id: 'b4', name: 'Coca-Cola Zero 1L', price: 10.00},
                { id: 'b5', name: 'Guaraná Antárctica 2L', price: 15.00 },
                { id: 'b6', name: 'Guaraná Antártica Zero 2L', price: 15.00 },
                { id: 'b7', name: 'Guaraná Antárctica 1L', price: 10.00 },
                { id: 'b8', name: 'Fanta Laranja 2L', price: 12.00 },
                { id: 'b9', name: 'Sprite 2L', price: 12.00 },
                { id: 'b10', name: 'Conquista Guaraná 2L', price: 9.00},
                { id: 'b11', name: 'Conti Cola 2L', price: 9.00 },
                { id: 'b12', name: 'H2O Limoneto 500ml', price: 4.50},
                { id: 'b13', name: 'Coca-Cola Lata', price: 5.00 },
                { id: 'b14', name: 'Coca-Cola  Zero Lata', price: 5.00 },
                { id: 'b15', name: 'Guaraná Antárctica Lata', price: 5.00},
                { id: 'b16', name: 'Guaraná Antárctica Zero Lata', price: 5.00},
                { id: 'b17', name: 'Fanta Lata', price: 5.00},
                { id: 'b18', name: 'Sprite Lata', price: 5.00 },
                { id: 'b19', name: 'Energético Monster Lata', price: 12.00 },
                { id: 'b20', name: 'Energético Red Bull Lata', price: 12.00 },
                { id: 'b21', name: 'Cerveja Skol Lata', price: 5.00},
                { id: 'b22', name: 'Cerveja Brahma Lata', price: 5.00 },
                { id: 'b23', name: 'Cerveja Boa Lata', price: 5.00 },
                { id: 'b24', name: 'Cerveja Malzbeer', price: 5.00 }
            ],
            bordas: {
                doce: [
                    { id: 'bd1', name: 'Chocolate', price: 18.00 },
                    { id: 'bd2', name: 'Romeu e Julieta', price: 18.00 }
                ],
                salgada: [
                    { id: 'bs1', name: 'Mussarela', price: 12.00 },
                    { id: 'bs2', name: 'Presunto e Mussarela', price: 18.00 },
                    { id: 'bs3', name: 'Catupiry', price: 7.00 },
                    { id: 'bs4', name: 'Cheddar', price: 9.00 }
                ]
            }
        };

        const TAMANHOS = {
            'broto': { label: 'Broto (4 pedaços)', maxSabores: 2 },
            'media': { label: 'Média (6 pedaços)', maxSabores: 3 },
            'grande': { label: 'Grande (8 pedaços)', maxSabores: 4 }
        };

        let cart = [];
        let state = 'INIT';
        let tempOrder = {};
        let cliente = { nome: '', telefone: '', tipoEntrega: '', rua: '', numero: '', bairro: '', complemento: '' };

        const chatBody = document.getElementById('chat-body');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');

        // ==== LÓGICA DE PROMOÇÃO ====
        function isDiaDePromocao() {
            const diaSemana = new Date().getDay();
            return diaSemana >= 1 && diaSemana <= 5;
        }

        function getPrecoPizza(sabor, tamanhoId) {
            let preco = sabor.prices[tamanhoId];
            let isPromo = false;

            if (isDiaDePromocao() && tamanhoId === 'grande') {
                if (sabor.id === 'p1' || sabor.id === 'p2' || sabor.id === 'p10' || sabor.id === 'p13' || sabor.id === 'p19' || sabor.id === 'p20'  || sabor.id === 'p25' || sabor.id === 'p30' || sabor.id === 'p31'){
                    preco = 50.00;
                    isPromo = true;
                }
            }
            return { preco, isPromo };
        }
        // ============================

        function formatarMoeda(valor) {
            return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        function scrollToBottom() {
            setTimeout(() => { chatBody.scrollTop = chatBody.scrollHeight; }, 50);
        }

        function desabilitarBotoesAnteriores() {
            document.querySelectorAll('.option-btn:not(.disabled)').forEach(btn => {
                btn.classList.add('disabled');
                btn.removeAttribute('onclick');
            });
        }

        function setInputMode(enabled, placeholder) {
            userInput.disabled = !enabled;
            sendBtn.disabled = !enabled;
            userInput.placeholder = placeholder;
            if (enabled) {
                userInput.focus();
                userInput.onkeypress = function(e) { if(e.key === 'Enter') handleTextInput(); };
                sendBtn.onclick = handleTextInput;
            }
        }

        function addUserMessage(text) {
            desabilitarBotoesAnteriores();
            chatBody.insertAdjacentHTML('beforeend', `
                <div class="message-row msg-user-row">
                    <div class="message msg-user">${text}</div>
                </div>
            `);
            scrollToBottom();
        }

        function addBotMessage(text, options = null) {
            desabilitarBotoesAnteriores();
            
            const typingId = 'typing-' + Date.now();
            chatBody.insertAdjacentHTML('beforeend', `
                <div class="message-row msg-bot-row" id="${typingId}">
                    <div class="message msg-bot">
                        <div class="typing-indicator">
                            <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                        </div>
                    </div>
                </div>
            `);
            scrollToBottom();

            setTimeout(() => {
                document.getElementById(typingId).remove();
                
                chatBody.insertAdjacentHTML('beforeend', `
                    <div class="message-row msg-bot-row">
                        <div class="message msg-bot">${text}</div>
                    </div>
                `);
                
                if (options && options.length > 0) {
                    let optionsHtml = `<div class="options-container">`;
                    options.forEach(opt => {
                        const param = typeof opt.value === 'string' ? `'${opt.value}'` : opt.value;

                        if (opt.ingredients) {
                            optionsHtml += `
                                <button class="option-btn" onclick="handleOptionClick('${opt.action}', ${param}, '${opt.label}')">
                                    <div class="pizza-btn-top">
                                        <span>${opt.label}</span>
                                    </div>
                                    <span class="pizza-ingredients">${opt.ingredients}</span>
                                </button>`;
                        } else {
                            optionsHtml += `
                                <button class="option-btn" onclick="handleOptionClick('${opt.action}', ${param}, '${opt.label}')">
                                    <div class="pizza-btn-top">
                                        <span>${opt.label}</span>
                                    </div>
                                </button>`;
                        }
                    });
                    optionsHtml += `</div>`;
                    chatBody.insertAdjacentHTML('beforeend', optionsHtml);
                }
                scrollToBottom();
            }, 600);
        }

        // ─── Verificação de horário de funcionamento ───────────────────────────
        // Seg-Sáb: 17:30 às 23:30  (domingo: fechado)
        function verificarHorario() {
            const agora = new Date();
            const diaSemana = agora.getDay(); // 0=Dom, 1=Seg … 6=Sáb
            const hora = agora.getHours();
            const minuto = agora.getMinutes();
            const totalMinutos = hora * 60 + minuto;

            const abertura = 17 * 60 + 30;  // 17:30
            const fechamento = 23 * 60 + 30; // 23:30

            // Seg(1) a Sáb(6) e dentro do horário
            const aberto = diaSemana >= 1 && diaSemana <= 6
                        && totalMinutos >= abertura
                        && totalMinutos < fechamento;

            return aberto;
        }

        window.onload = () => {
            if (!verificarHorario()) {
                // Fora do horário: mostra overlay e oculta o chat
                document.getElementById('closed-overlay').style.display = 'flex';
                document.getElementById('chat-header').classList.add('status-closed');
                document.getElementById('status-text').textContent = 'Fechado no momento';
                // Desabilita input para garantia
                userInput.disabled = true;
                sendBtn.disabled = true;
                return; // Não inicia o bot
            }

            addBotMessage("Olá! 👋 Sou o assistente virtual da Pizzaria Fornalha de Ourinhos.");
            setTimeout(perguntarTipoEntrega, 1200);
        };

        function perguntarTipoEntrega() {
            state = 'TIPO_ENTREGA';
            addBotMessage("Seu pedido é para <b>entrega</b> ou <b>retirada</b>?", [
                { label: '🛵 Entrega', action: 'ESCOLHER_ENTREGA', value: 'entrega' },
                { label: '🏪 Retirada no local', action: 'ESCOLHER_ENTREGA', value: 'retirada' }
            ]);
        }

        window.handleOptionClick = function(action, value, label) {
            addUserMessage(label);
            
            switch(action) {
                case 'ESCOLHER_ENTREGA':    escolherTipoEntrega(value); break;
                case 'MENU_PRINCIPAL':      mostrarMenuPrincipal(); break;
                case 'VER_PIZZAS':          iniciarPedidoPizza(); break;
                case 'VER_BEBIDAS':         iniciarPedidoBebida(); break;
                case 'VER_CARRINHO':        mostrarCarrinho(); break;
                case 'FINALIZAR':           iniciarFinalizacao(); break;
                case 'SET_PIZZA_SIZE':      selecionarTamanhoPizza(value); break;
                case 'SET_PIZZA_QTD_SABOR': selecionarQtdSabores(value); break;  // ← CORRIGIDO
                case 'ADD_PIZZA_SABOR':     adicionarSaborPizza(value); break;
                case 'SEM_ALTERACAO':       confirmarSaborSemAlteracao(); break;
                case 'PEDIR_ALTERACAO':
                    state = 'WAITING_ALTERACAO';
                    setTimeout(() => {
                        addBotMessage("Digite a alteração desejada:");
                        setInputMode(true, "Ex: sem cebola, sem azeitona...");
                    }, 300);
                    break;
                case 'ADD_BEBIDA':          adicionarBebidaCarrinho(value); break;
                case 'ESCOLHER_TIPO_BORDA': escolherTipoBorda(value); break;
                case 'SET_BORDA':           selecionarBorda(value); break;
                case 'SEM_BORDA':           finalizarMontagemPizza(); break;
                case 'CANCELAR_ITEM':
                    tempOrder = {};
                    addBotMessage("Item cancelado.");
                    mostrarMenuPrincipal();
                    break;
                case 'PAGAMENTO_CARTAO':
                    cliente.pagamento = 'Cartão de crédito/débito';
                    enviarParaWhatsApp();
                    break;
                case 'PAGAMENTO_PIX':
                    cliente.pagamento = 'Pix';
                    enviarParaWhatsApp();
                    break;
                case 'PAGAMENTO_DINHEIRO':
                    cliente.pagamento = 'Dinheiro';
                    perguntarTroco();
                    break;
                case 'TROCO_NAO':
                    cliente.troco = 'Sem troco';
                    enviarParaWhatsApp();
                    break;
            }
        };

        function handleTextInput() {
            const text = userInput.value.trim();
            if (!text) return;
            addUserMessage(text);
            userInput.value = '';

            if (state === 'WAITING_NAME_ENTREGA') {
                cliente.nome = text;
                state = 'WAITING_RUA';
                setTimeout(() => { addBotMessage(`Ótimo, ${cliente.nome}! Agora me informe a <b>rua</b> para entrega:`); setInputMode(true, "Digite a rua..."); }, 500);
            } else if (state === 'WAITING_RUA') {
                cliente.rua = text;
                state = 'WAITING_NUMERO';
                setTimeout(() => { addBotMessage("Qual o <b>número</b> do endereço?"); setInputMode(true, "Digite o número..."); }, 500);
            } else if (state === 'WAITING_NUMERO') {
                cliente.numero = text;
                state = 'WAITING_BAIRRO';
                setTimeout(() => { addBotMessage("Qual o <b>bairro</b>?"); setInputMode(true, "Digite o bairro..."); }, 500);
            } else if (state === 'WAITING_BAIRRO') {
                cliente.complemento = text; // wait, let's keep it clean
            }
        }
    </script>
</body>
</html>
e vamos fazer um bem semelhante mas melhor, vamos fazer uma especie de landing page para uma pizzaria e um botao na landing page que leva para fazer pedido, ai leva para outro index, uma subpasdta dentro dela

https://www.instagram.com/dthalespizza/
https://www.facebook.com/Dthalespizza/
https://share.google/U6z1ScsJX85yfl40X

Endereço: R. Rubéns Saladine, 199 - JARDIM SAO SILVESTRE, Ourinhos - SP, 19902-446
Telefone: (14) 99608-1601
Horário de funcionamento: 
sexta-feira	18:30–23:30
sábado	18:30–23:30
domingo	18:30–23:30
segunda-feira	18:30–23:30
terça-feira	18:30–23:30
quarta-feira	18:30–23:30
quinta-feira	18:30–23:30

cardápio dela no ifood para usar como base no nosso chatbot:
```

### Prompt 2
```text
eu gostei mas faltou ter o seo e geo para ranquear na cidade de ourinhos, consegue fazer um seo e geo completo?
```
