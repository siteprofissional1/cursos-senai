/**
 * ============================================================================
 * Lógica do Chatbot SENAI Ourinhos - Arquitetura em Funil 100% por Botões
 * Desenvolvido para o perfil de capacitação profissional do SENAI
 * ============================================================================
 */

// Configurações institucionais de contato
const SENAI_CONFIG = {
    nomeUnidade: "Escola SENAI Ourinhos",
    telefone: "(14) 3302-1250",
    whatsappNumero: "551433021250", // Número no formato internacional sem caracteres especiais
    endereco: "R. Vitório Christoni, 1500 - Vila Sao Luiz, Ourinhos - SP, 19911-200",
    horarios: "Segunda a Sexta das 07:30 às 20:30 | Sábados das 08:00 às 12:00"
};

/**
 * Função utilitária para gerar links diretos de WhatsApp com mensagem personalizada codificada.
 * Atende ao alinhamento de conversão imediata do funil.
 * @param {string} cursoNome - Nome do curso de interesse do estudante
 * @returns {string} URL completa da API do WhatsApp
 */
function gerarLinkWhatsApp(cursoNome) {
    const mensagem = `Olá, equipe de atendimento do SENAI Ourinhos! Tenho interesse no curso de "${cursoNome}" e gostaria de receber mais informações sobre turmas, requisitos e pré-matrícula.`;
    return `https://wa.me/${SENAI_CONFIG.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Catálogo e Árvore de Decisão do Funil (Chatbot Flow).
 * Cada chave representa um nó (estado) do funil de navegação guiada.
 */
const chatFlow = {
    // ------------------------------------------------------------------------
    // NÓ INICIAL / MENU PRINCIPAL
    // ------------------------------------------------------------------------
    'inicio': {
        botMessage: `Olá! Seja bem-vindo ao atendimento interativo da <strong>${SENAI_CONFIG.nomeUnidade}</strong>.<br><br>Explore nossas áreas industriais e tecnológicas através das opções abaixo:`,
        options: [
            { label: "🎓 Ver Catálogo Completo de Cursos", nextNode: "menu_areas", isCta: false },
            { label: "🕒 Horários de Atendimento", nextNode: "info_horarios", isCta: false },
            { label: "📍 Localização e Contato", nextNode: "info_contato", isCta: false },
            { label: "🌐 Redes Sociais Oficiais", nextNode: "info_redes", isCta: false }
        ]
    },

    // ------------------------------------------------------------------------
    // MENU DAS 5 GRANDES ÁREAS INDUSTRIAIS DO FUTURO
    // ------------------------------------------------------------------------
    'menu_areas': {
        botMessage: "Selecione uma das <strong>5 áreas tecnológicas</strong> para ver os cursos disponíveis e oportunidades de formação:",
        options: [
            { label: "💻 1. TI & Inteligência Artificial", nextNode: "area_ti", isCta: false },
            { label: "🤖 2. Robótica & Automação Industrial", nextNode: "area_robotica", isCta: false },
            { label: "⚡ 3. Eletroeletrônica & Energia Solar", nextNode: "area_eletro", isCta: false },
            { label: "⚙️ 4. Mecânica de Precisão & Usinagem CNC", nextNode: "area_mecanica", isCta: false },
            { label: "📊 5. Gestão da Produção & Logística 4.0", nextNode: "area_gestao", isCta: false },
            { label: "⬅️ Voltar ao Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },

    // ------------------------------------------------------------------------
    // ÁREA 1: TI & INTELIGÊNCIA ARTIFICIAL
    // ------------------------------------------------------------------------
    'area_ti': {
        botMessage: "A área de <strong>Tecnologia da Informação & IA</strong> forma profissionais altamente demandados pelo mercado global de software e dados.<br><br>Escolha o curso desejado:",
        options: [
            { label: "🌐 Desenvolvimento Web Full Stack", nextNode: "curso_fullstack" },
            { label: "🧠 Inteligência Artificial Generativa & Prompts", nextNode: "curso_ia_prompts" },
            { label: "🛡️ Cibersegurança & Defesa Digital", nextNode: "curso_ciberseguranca" },
            { label: "📈 Ciência de Dados & Python para Negócios", nextNode: "curso_ciencia_dados" },
            { label: "⬅️ Escolher outra área", nextNode: "menu_areas", isSecondary: true }
        ]
    },
    'curso_fullstack': {
        botMessage: `
            <h3>Desenvolvimento Web Full Stack</h3>
            <p>Formação completa para criação de portais, plataformas web e sistemas corporativos modernos do zero ao deploy.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 240 horas</p>
                <p><strong>📅 Turnos:</strong> Noite (Seg a Sex)</p>
                <p><strong>🛠️ Tecnologias:</strong> HTML5, CSS3, JavaScript moderno, React, Node.js e Bancos de Dados SQL/NoSQL</p>
                <p><strong>🎯 Mercado:</strong> Desenvolvedor Front-end, Back-end ou Full Stack Júnior</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Desenvolvimento Web Full Stack"), isCta: true },
            { label: "⬅️ Ver outros cursos de TI & IA", nextNode: "area_ti", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_ia_prompts': {
        botMessage: `
            <h3>Inteligência Artificial Generativa & Prompts</h3>
            <p>Aprenda a aplicar modelos de linguagem (LLMs), automação de fluxos industriais e engenharia de prompts para elevar a produtividade profissional.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 60 horas</p>
                <p><strong>📅 Turnos:</strong> Aos Sábados ou EAD com mentorias</p>
                <p><strong>🛠️ Conteúdo:</strong> Engenharia de Prompts avançada, integração de APIs de IA, automações no-code e ética em IA</p>
                <p><strong>🎯 Mercado:</strong> Profissionais de todas as áreas buscando alavancar projetos com IA</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Inteligência Artificial Generativa & Prompts"), isCta: true },
            { label: "⬅️ Ver outros cursos de TI & IA", nextNode: "area_ti", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_ciberseguranca': {
        botMessage: `
            <h3>Cibersegurança & Defesa Digital</h3>
            <p>Capacitação prática em defesa de redes, análise de vulnerabilidades, conformidade com a LGPD e respostas a incidentes de segurança.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 120 horas</p>
                <p><strong>📅 Turnos:</strong> Noite (Seg a Qui)</p>
                <p><strong>🛠️ Conteúdo:</strong> Segurança em Redes, Criptografia, Pentest defensivo, Hardening de Servidores e LGPD</p>
                <p><strong>🎯 Mercado:</strong> Analista de Segurança Júnior, Suporte a Redes e Auditoria</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Cibersegurança & Defesa Digital"), isCta: true },
            { label: "⬅️ Ver outros cursos de TI & IA", nextNode: "area_ti", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_ciencia_dados': {
        botMessage: `
            <h3>Ciência de Dados & Python para Negócios</h3>
            <p>Domine a linguagem Python aplicada à extração, limpeza e modelagem de dados estratégicos com dashboards analíticos de alto impacto.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 160 horas</p>
                <p><strong>📅 Turnos:</strong> Noite</p>
                <p><strong>🛠️ Tecnologias:</strong> Python (Pandas, NumPy, Matplotlib), SQL e Microsoft Power BI</p>
                <p><strong>🎯 Mercado:</strong> Analista de Dados, Especialista em Business Intelligence (BI)</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Ciência de Dados & Python para Negócios"), isCta: true },
            { label: "⬅️ Ver outros cursos de TI & IA", nextNode: "area_ti", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },

    // ------------------------------------------------------------------------
    // ÁREA 2: ROBÓTICA & AUTOMAÇÃO INDUSTRIAL
    // ------------------------------------------------------------------------
    'area_robotica': {
        botMessage: "A área de <strong>Robótica & Automação Industrial</strong> é o coração das fábricas modernas e da Indústria 4.0.<br><br>Selecione uma especialização:",
        options: [
            { label: "🤖 Robótica Industrial & Células Automatizadas", nextNode: "curso_robotica_celulas" },
            { label: "🔌 Automação com CLP e Sensores Industriais", nextNode: "curso_clp_sensores" },
            { label: "📡 Internet das Coisas Industrial (IIoT)", nextNode: "curso_iiot" },
            { label: "⬅️ Escolher outra área", nextNode: "menu_areas", isSecondary: true }
        ]
    },
    'curso_robotica_celulas': {
        botMessage: `
            <h3>Robótica Industrial & Células Automatizadas</h3>
            <p>Aprenda a operar e programar manipuladores robóticos industriais em células de soldagem, paletização e montagem fabril.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 180 horas</p>
                <p><strong>📅 Turnos:</strong> Manhã ou Tarde</p>
                <p><strong>🛠️ Equipamentos:</strong> Braços robóticos KUKA/ABB, Teach Pendant, Programação de trajetórias e NR12</p>
                <p><strong>🎯 Mercado:</strong> Montadoras, indústrias alimentícias, metalúrgicas e farmacêuticas</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Robótica Industrial & Células Automatizadas"), isCta: true },
            { label: "⬅️ Ver outros cursos de Robótica", nextNode: "area_robotica", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_clp_sensores': {
        botMessage: `
            <h3>Automação com CLP e Sensores Industriais</h3>
            <p>Capacitação voltada para a lógica de controle programável em processos industriais automatizados e plantas contínuas.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 120 horas</p>
                <p><strong>📅 Turnos:</strong> Noite</p>
                <p><strong>🛠️ Conteúdo:</strong> Lógica Ladder, CLPs Siemens TIA Portal e Rockwell, sensores indutivos, ópticos e encoders</p>
                <p><strong>🎯 Mercado:</strong> Técnico em Automação, Eletricista de Manutenção e Montador de Painéis</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Automação com CLP e Sensores Industriais"), isCta: true },
            { label: "⬅️ Ver outros cursos de Robótica", nextNode: "area_robotica", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_iiot': {
        botMessage: `
            <h3>Internet das Coisas Industrial (IIoT)</h3>
            <p>Conecte o maquinário físico aos sistemas em nuvem, permitindo monitoramento preventivo e manutenção preditiva em tempo real.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 80 horas</p>
                <p><strong>📅 Turnos:</strong> Noite</p>
                <p><strong>🛠️ Conteúdo:</strong> Microcontroladores industriais, protocolo MQTT, dashboards web e análise de telemetria</p>
                <p><strong>🎯 Mercado:</strong> Integrador de soluções Indústria 4.0</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Internet das Coisas Industrial (IIoT)"), isCta: true },
            { label: "⬅️ Ver outros cursos de Robótica", nextNode: "area_robotica", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },

    // ------------------------------------------------------------------------
    // ÁREA 3: ELETROELETRÔNICA & ENERGIA SOLAR
    // ------------------------------------------------------------------------
    'area_eletro': {
        botMessage: "A área de <strong>Eletroeletrônica & Energia Solar</strong> combina os princípios fundamentais da eletricidade com as tecnologias sustentáveis mais promissoras do Brasil.<br><br>Selecione um curso:",
        options: [
            { label: "⚡ Eletricista Instalador Residencial e Industrial", nextNode: "curso_eletricista" },
            { label: "☀️ Energia Solar Fotovoltaica (Projetos e Instalação)", nextNode: "curso_energia_solar" },
            { label: "🎛️ Comandos Elétricos e Inversores de Frequência", nextNode: "curso_comandos_eletricos" },
            { label: "⬅️ Escolher outra área", nextNode: "menu_areas", isSecondary: true }
        ]
    },
    'curso_eletricista': {
        botMessage: `
            <h3>Eletricista Instalador Residencial e Industrial</h3>
            <p>Formação prática completa com bancadas industriais, medições com multímetro, cabeamento e proteção de circuitos elétricos.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 160 horas</p>
                <p><strong>📅 Turnos:</strong> Tarde ou Noite</p>
                <p><strong>🛠️ Conteúdo:</strong> Quadros de distribuição, disjuntores DR, diagramas unifilares e norma de segurança NR10</p>
                <p><strong>🎯 Mercado:</strong> Profissional autônomo, instalador predial e prestador de serviços industriais</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Eletricista Instalador Residencial e Industrial"), isCta: true },
            { label: "⬅️ Ver outros cursos de Elétrica", nextNode: "area_eletro", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_energia_solar': {
        botMessage: `
            <h3>Energia Solar Fotovoltaica (Projetos e Instalação)</h3>
            <p>Um dos setores de maior crescimento no país. Aprenda o dimensionamento de sistemas geradores solares, fixação e integração com a rede.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 80 horas</p>
                <p><strong>📅 Turnos:</strong> Sábados ou Noite</p>
                <p><strong>🛠️ Conteúdo:</strong> Módulos fotovoltaicos, inversores de corrente, proteção contra surtos (DPS) e homologação</p>
                <p><strong>🎯 Mercado:</strong> Empresas integradoras solares e empreendedorismo no ramo sustentável</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Energia Solar Fotovoltaica"), isCta: true },
            { label: "⬅️ Ver outros cursos de Elétrica", nextNode: "area_eletro", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_comandos_eletricos': {
        botMessage: `
            <h3>Comandos Elétricos e Inversores de Frequência</h3>
            <p>Especialização no acionamento, controle e proteção de motores elétricos trifásicos de grande porte utilizados na indústria.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 100 horas</p>
                <p><strong>📅 Turnos:</strong> Noite</p>
                <p><strong>🛠️ Conteúdo:</strong> Contatores, relés térmicos, parametrização de inversores e chaves de partida estrela-triângulo</p>
                <p><strong>🎯 Mercado:</strong> Eletricista de força e controle, manutenção eletromecânica</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Comandos Elétricos e Inversores de Frequência"), isCta: true },
            { label: "⬅️ Ver outros cursos de Elétrica", nextNode: "area_eletro", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },

    // ------------------------------------------------------------------------
    // ÁREA 4: MECÂNICA DE PRECISÃO & USINAGEM CNC
    // ------------------------------------------------------------------------
    'area_mecanica': {
        botMessage: "A <strong>Mecânica de Precisão e Usinagem</strong> é tradicionalmente o pilar de excelência da Escola SENAI Ourinhos, com alta taxa de contratação.<br><br>Selecione um curso:",
        options: [
            { label: "⚙️ Programação e Operação de Torno e Fresa CNC", nextNode: "curso_torno_cnc" },
            { label: "🔧 Mecânico de Manutenção de Máquinas Industriais", nextNode: "curso_manutencao_mecanica" },
            { label: "📐 Modelagem 3D e CAD Industrial (SolidWorks)", nextNode: "curso_cad_solidworks" },
            { label: "⬅️ Escolher outra área", nextNode: "menu_areas", isSecondary: true }
        ]
    },
    'curso_torno_cnc': {
        botMessage: `
            <h3>Programação e Operação de Torno e Fresa CNC</h3>
            <p>Aprenda a operar máquinas computadorizadas que produzem componentes metálicos com tolerância de milésimos de milímetro.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 180 horas</p>
                <p><strong>📅 Turnos:</strong> Tarde ou Noite</p>
                <p><strong>🛠️ Máquinas:</strong> Centros de usinagem e tornos CNC comandos Siemens/Fanuc, cálculo de avanço e velocidade de corte</p>
                <p><strong>🎯 Mercado:</strong> Indústrias metalmecânicas, automobilísticas, agrícolas e de bens de capital</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Programação e Operação de Torno e Fresa CNC"), isCta: true },
            { label: "⬅️ Ver outros cursos de Mecânica", nextNode: "area_mecanica", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_manutencao_mecanica': {
        botMessage: `
            <h3>Mecânico de Manutenção de Máquinas Industriais</h3>
            <p>Diagnóstico de falhas, montagem e desmontagem de redutores, substituição de rolamentos, alinhamento de polias e esteiras industriais.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 200 horas</p>
                <p><strong>📅 Turnos:</strong> Manhã ou Noite</p>
                <p><strong>🛠️ Conteúdo:</strong> Elementos de fixação, circuitos hidráulicos e pneumáticos proporcionais, lubrificação industrial</p>
                <p><strong>🎯 Mercado:</strong> Mecânico de manutenção geral em indústrias sucroalcooleiras e alimentícias</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Mecânico de Manutenção de Máquinas Industriais"), isCta: true },
            { label: "⬅️ Ver outros cursos de Mecânica", nextNode: "area_mecanica", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_cad_solidworks': {
        botMessage: `
            <h3>Modelagem 3D e CAD Industrial (SolidWorks)</h3>
            <p>Desenvolvimento de peças técnicas, conjuntos mecânicos, simulações de esforços e detalhamento para manufatura industrial.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 80 horas</p>
                <p><strong>📅 Turnos:</strong> Noite</p>
                <p><strong>🛠️ Conteúdo:</strong> SolidWorks 3D, geração de folhas 2D com normas ABNT, renderização e exportação para impressão 3D</p>
                <p><strong>🎯 Mercado:</strong> Desenhista projetista mecânico, auxiliar de engenharia de produto</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Modelagem 3D e CAD Industrial"), isCta: true },
            { label: "⬅️ Ver outros cursos de Mecânica", nextNode: "area_mecanica", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },

    // ------------------------------------------------------------------------
    // ÁREA 5: GESTÃO DA PRODUÇÃO & LOGÍSTICA 4.0
    // ------------------------------------------------------------------------
    'area_gestao': {
        botMessage: "A área de <strong>Gestão da Produção & Logística</strong> prepara líderes técnicos e analistas para otimizar fluxos de trabalho e estoques corporativos.<br><br>Selecione um curso:",
        options: [
            { label: "🏭 Gestão da Produção e Lean Manufacturing", nextNode: "curso_lean" },
            { label: "📦 Logística Integrada e Supply Chain", nextNode: "curso_logistica" },
            { label: "⛑️ Segurança do Trabalho e Normas Industriais", nextNode: "curso_seguranca" },
            { label: "⬅️ Escolher outra área", nextNode: "menu_areas", isSecondary: true }
        ]
    },
    'curso_lean': {
        botMessage: `
            <h3>Gestão da Produção e Lean Manufacturing</h3>
            <p>Implementação prática de metodologias ágeis de manufatura para eliminação de desperdícios, redução de custos e aumento de produtividade.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 120 horas</p>
                <p><strong>📅 Turnos:</strong> Noite</p>
                <p><strong>🛠️ Metodologias:</strong> 5S, Kaizen, Mapeamento de Fluxo de Valor (VSM), Kanban e indicadores OEE</p>
                <p><strong>🎯 Mercado:</strong> Analista de Processos Industriais, Líder de Produção, Consultor de Eficiência</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Gestão da Produção e Lean Manufacturing"), isCta: true },
            { label: "⬅️ Ver outros cursos de Gestão", nextNode: "area_gestao", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_logistica': {
        botMessage: `
            <h3>Logística Integrada e Supply Chain</h3>
            <p>Gerenciamento estratégico de compras, estoques físicos, sistemas WMS de armazenagem e distribuição logística regional e internacional.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 100 horas</p>
                <p><strong>📅 Turnos:</strong> Noite</p>
                <p><strong>🛠️ Conteúdo:</strong> Curva ABC de materiais, roteirização de entregas, gestão de modais de transporte e inventários</p>
                <p><strong>🎯 Mercado:</strong> Encarregado de Almoxarifado, Analista de Logística e Expedição</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Logística Integrada e Supply Chain"), isCta: true },
            { label: "⬅️ Ver outros cursos de Gestão", nextNode: "area_gestao", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'curso_seguranca': {
        botMessage: `
            <h3>Segurança do Trabalho e Normas Industriais</h3>
            <p>Capacitação voltada para a prevenção de acidentes de trabalho, aplicação de NRs e criação de ambientes industriais seguros.</p>
            <div class="course-info-card">
                <p><strong>⏱️ Carga Horária:</strong> 60 horas</p>
                <p><strong>📅 Turnos:</strong> Sábados ou Noite</p>
                <p><strong>🛠️ Conteúdo:</strong> Aplicação prática de NR-10 (Elétrica), NR-12 (Máquinas), NR-35 (Altura) e análise de risco (APR)</p>
                <p><strong>🎯 Mercado:</strong> Membros de CIPA, operadores de máquinas e supervisores de área</p>
            </div>
        `,
        options: [
            { label: "📲 Falar no WhatsApp sobre este curso", externalLink: gerarLinkWhatsApp("Segurança do Trabalho e Normas Industriais"), isCta: true },
            { label: "⬅️ Ver outros cursos de Gestão", nextNode: "area_gestao", isSecondary: true },
            { label: "🏠 Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },

    // ------------------------------------------------------------------------
    // INFORMAÇÕES INSTITUCIONAIS
    // ------------------------------------------------------------------------
    'info_horarios': {
        botMessage: `
            <h3>🕒 Horários de Atendimento da Secretaria</h3>
            <p>Nossa equipe presencial e telefônica atende nos seguintes horários:</p>
            <ul>
                <li><strong>Segunda a Sexta-feira:</strong> 07:30 às 20:30 (ininterrupto)</li>
                <li><strong>Sábados letivos:</strong> 08:00 às 12:00</li>
                <li><strong>Domingos e Feriados:</strong> Fechado</li>
            </ul>
        `,
        options: [
            { label: "📍 Onde fica a escola? (Endereço)", nextNode: "info_contato" },
            { label: "🎓 Ver Cursos Disponíveis", nextNode: "menu_areas" },
            { label: "🏠 Voltar ao Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'info_contato': {
        botMessage: `
            <h3>📍 Endereço e Contato Oficial</h3>
            <p><strong>Escola SENAI Ourinhos</strong></p>
            <ul>
                <li><strong>Endereço:</strong> ${SENAI_CONFIG.endereco}</li>
                <li><strong>Telefone Fixo:</strong> ${SENAI_CONFIG.telefone}</li>
                <li><strong>WhatsApp Secretaria:</strong> (14) 3302-1250</li>
            </ul>
        `,
        options: [
            { label: "📲 Abrir Conversa no WhatsApp", externalLink: `https://wa.me/${SENAI_CONFIG.whatsappNumero}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20gerais%20sobre%20a%20Escola%20SENAI%20Ourinhos.`, isCta: true },
            { label: "🕒 Ver Horários de Funcionamento", nextNode: "info_horarios" },
            { label: "🏠 Voltar ao Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    },
    'info_redes': {
        botMessage: `
            <h3>🌐 Redes Sociais Oficiais</h3>
            <p>Fique por dentro de eventos, vagas de estágio e novos cursos acompanhando nossos canais oficiais:</p>
            <ul>
                <li>📸 <a href="https://www.instagram.com/senaiourinhos/" target="_blank" rel="noopener noreferrer">Instagram Oficial (@senaiourinhos)</a></li>
                <li>📘 <a href="https://www.facebook.com/senaisp.ourinhos/" target="_blank" rel="noopener noreferrer">Página do Facebook</a></li>
                <li>💼 <a href="https://br.linkedin.com/company/senaisp-ourinhos" target="_blank" rel="noopener noreferrer">LinkedIn Institucional</a></li>
            </ul>
        `,
        options: [
            { label: "🎓 Explorar Cursos Industriais", nextNode: "menu_areas" },
            { label: "🏠 Voltar ao Menu Principal", nextNode: "inicio", isSecondary: true }
        ]
    }
};

/**
 * Elementos do DOM
 */
const chatMessagesContainer = document.getElementById('chat-messages');
const chatOptionsContainer = document.getElementById('chat-options');
const btnResetFlow = document.getElementById('btn-reset-flow');

/**
 * Função para renderizar balões de mensagem na tela.
 * @param {string} htmlContent - Conteúdo HTML da mensagem
 * @param {'bot' | 'user'} sender - Remetente da mensagem
 */
function renderMessage(htmlContent, sender) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('msg-wrapper', sender);

    const bubble = document.createElement('div');
    bubble.classList.add('msg-bubble');
    bubble.innerHTML = htmlContent;

    wrapper.appendChild(bubble);
    chatMessagesContainer.appendChild(wrapper);

    // Rola suavemente para a mensagem mais recente
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

/**
 * Exibe o indicador visual de que o assistente está digitando.
 * @returns {HTMLElement} Elemento criado para poder ser removido em seguida
 */
function showTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('msg-wrapper', 'bot');
    wrapper.id = 'active-typing-indicator';

    const bubble = document.createElement('div');
    bubble.classList.add('msg-bubble', 'typing-indicator');
    bubble.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;

    wrapper.appendChild(bubble);
    chatMessagesContainer.appendChild(wrapper);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    return wrapper;
}

/**
 * Remove o indicador de digitação da tela.
 */
function hideTypingIndicator() {
    const indicator = document.getElementById('active-typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Carrega e renderiza um nó específico da árvore de decisão do funil.
 * @param {string} nodeId - Chave do nó no objeto chatFlow
 */
function loadNode(nodeId) {
    const node = chatFlow[nodeId];
    if (!node) {
        console.error(`Nó não encontrado na árvore de fluxo: ${nodeId}`);
        return;
    }

    // Limpa a área de botões anterior para evitar cliques concorrentes
    chatOptionsContainer.innerHTML = '';

    // Exibe indicador de digitação por 350ms para sensação fluida e natural
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        renderMessage(node.botMessage, 'bot');

        // Cria os novos botões da etapa em lista vertical clássica
        node.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('btn-funnel-option');
            button.type = 'button';

            // Aplica estilos visuais conforme a intenção do botão
            if (option.isCta) {
                button.classList.add('btn-cta');
            } else if (option.isSecondary) {
                button.classList.add('btn-secondary');
            }

            button.textContent = option.label;

            // Manipulador de clique do botão
            button.addEventListener('click', () => {
                if (option.externalLink) {
                    // Se for link externo (WhatsApp), abre diretamente em nova aba
                    window.open(option.externalLink, '_blank', 'noopener,noreferrer');
                    renderMessage(`📲 Abrindo WhatsApp para o curso...`, 'user');
                } else if (option.nextNode) {
                    // Exibe a escolha do usuário no chat
                    renderMessage(option.label, 'user');
                    // Avança para o próximo estágio do funil
                    loadNode(option.nextNode);
                }
            });

            chatOptionsContainer.appendChild(button);
        });

        // Garante que o scroll acompanhe a chegada dos novos botões
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }, 350);
}

/**
 * Reinicia a conversa para o início, limpando o histórico de mensagens.
 */
function reiniciarChatbot() {
    chatMessagesContainer.innerHTML = '';
    chatOptionsContainer.innerHTML = '';
    loadNode('inicio');
}

// Configura o ouvinte do botão de reiniciar no cabeçalho
if (btnResetFlow) {
    btnResetFlow.addEventListener('click', () => {
        reiniciarChatbot();
    });
}

// Inicializa o chatbot assim que a página carregar
window.addEventListener('DOMContentLoaded', () => {
    loadNode('inicio');
});
