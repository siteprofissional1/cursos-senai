/**
 * META SMART GLASSES — script.js
 * Funcionalidades: Navbar scroll, Dark/Light mode, Troca de idioma PT/EN,
 * Menu mobile, FAQ accordion, Scroll reveal (IntersectionObserver), Particulas CTA.
 * Vanilla JS puro — sem bibliotecas externas.
 */

/* =============================================
   1. DICIONARIO DE IDIOMAS (i18n)
   ============================================= */
const i18n = {
  pt: {
    "topbar.badge": "PRE-VENDA EXCLUSIVA",
    "topbar.text":  "Vagas limitadas para o Brasil — Ourinhos SP",
    "topbar.link":  "Falar com Especialista →",
    "nav.power":    "Spatial AI",
    "nav.vision":   "Visao",
    "nav.specs":    "Hardware",
    "nav.faq":      "FAQ",
    "nav.cta":      "Pre-Venda",
    "hero.eyebrow": "Spatial Computing · AI-Powered · MicroLED Display",
    "hero.title1":  "THE NEXT",
    "hero.title2":  "REALITY",
    "hero.subtitle":"Os oculos de realidade mista com IA da Meta chegam ao Brasil.\nLentes holograficas. Audio direcional. Inteligencia que ve o mundo com voce.",
    "hero.cta":     "Garantir na Pre-Venda",
    "hero.cta2":    "Conhecer o Produto",
    "power.title":  "O Poder da Computacao Espacial",
    "power.p1":     "Os Meta Smart Glasses redefinem como humanos e maquinas se conectam. Lentes holograficas microLED projetam informacoes diretamente no campo visual, enquanto a IA embarcada processa contexto em tempo real.",
    "power.p2":     "Com comandos neurais adaptativos e rastreamento ocular de precisao cirurgica, os oculos aprendem seus habitos e antecipam suas necessidades.",
    "power.f1.title":"Lentes MicroLED",
    "power.f1.desc": "Display holografico de alta resolucao",
    "power.f2.title":"IA Neural Embarcada",
    "power.f2.desc": "Processamento local sem latencia",
    "power.f3.title":"Audio Direcional",
    "power.f3.desc": "Som espacial sem tampao nos ouvidos",
    "power.badge":  "AI-Powered · Live",
    "vision.title": "A Visao do Futuro",
    "vision.p1":    "Estamos na virada de uma nova era da comunicacao humana. Os Meta Smart Glasses nao sao apenas um dispositivo — sao o primeiro passo rumo a um mundo onde o digital e o fisico coexistem.",
    "vision.p2":    "Imagine receber direcoes no campo visual enquanto caminha por Ourinhos, traduzir uma conversa em tempo real, ou receber alertas de saude discretamente.",
    "vision.quote": '"A computacao espacial nao e o futuro — e o presente que a maioria ainda nao ve."',
    "vision.cite":  "— Mark Zuckerberg, CEO da Meta",
    "vision.p1t":   "Conectividade Total",
    "vision.p1d":   "Wi-Fi 6, Bluetooth 5.3 e 5G via smartphone",
    "vision.p2t":   "Privacidade por Design",
    "vision.p2d":   "LED indicador e controles fisicos de camera",
    "vision.p3t":   "Ecossistema Aberto",
    "vision.p3d":   "iOS, Android e todas as plataformas principais",
    "specs.title":  "Design & Hardware",
    "specs.subtitle":"Engenharia de precisao em cada detalhe. Projetado para o futuro, disponivel agora.",
    "specs.c1.title":"Display MicroLED",
    "specs.c1.desc":"Projecao holografica diretamente nas lentes. Campo visual amplo com brilho adaptativo ao ambiente.",
    "specs.c2.title":"Audio Direcional",
    "specs.c2.desc":"Alto-falantes de abertura aberta com som espacial 3D. Escute o mundo e a IA simultaneamente.",
    "specs.c3.title":"Cameras Ultracompactas",
    "specs.c3.desc":"Cameras de alta resolucao integradas ao frame para captura de momentos e visao computacional.",
    "specs.c4.title":"Bateria Inteligente",
    "specs.c4.desc":"Ate 4h de uso ativo. Estojo de carregamento que adiciona ate 20h extras de autonomia.",
    "specs.c5.title":"Conectividade Total",
    "specs.c5.desc":"Wi-Fi 6, Bluetooth 5.3. Compativel com redes 5G via smartphone pareado.",
    "specs.c6.title":"Design Premium",
    "specs.c6.desc":"Frame ultraleve em titanio. Lentes intercambiaveis. Disponivel em multiplas cores.",
    "faq.title":    "Perguntas Frequentes",
    "faq.subtitle": "Tire suas duvidas antes de garantir o seu.",
    "faq.q1":       "Compativel com iOS e Android?",
    "faq.a1":       "Sim. Os Meta Smart Glasses sao compativeis com dispositivos iOS (iPhone) e Android, integrando-se ao aplicativo Meta View em ambas as plataformas.",
    "faq.q2":       "Qual e a duracao da bateria?",
    "faq.a2":       "A bateria oferece ate 4 horas de uso ativo continuo, com estojo de carregamento que adiciona ate 20 horas extras de autonomia.",
    "faq.q3":       "As cameras violam a privacidade?",
    "faq.a3":       "Os oculos possuem LED de privacidade visivel sempre que as cameras estao ativas, alem de controles fisicos para desativacao. A Meta segue a LGPD no Brasil.",
    "faq.q4":       "Entrega para Ourinhos-SP?",
    "faq.a4":       "Sim! Somos representantes autorizados em Ourinhos-SP e regiao. Atendemos todo o interior de SP. Entre em contato pelo WhatsApp para consultar disponibilidade.",
    "faq.q5":       "Tem garantia no Brasil?",
    "faq.a5":       "Sim. Todos os produtos vendidos por nosso canal possuem garantia e suporte tecnico localizado.",
    "faq.q6":       "Quais sao as opcoes de conectividade?",
    "faq.a6":       "Os Meta Smart Glasses contam com Bluetooth 5.3, Wi-Fi 6 e sao compativeis com redes 5G via smartphone pareado.",
    "cta.eyebrow":  "Pre-Venda Exclusiva · Ourinhos SP · Brasil",
    "cta.title":    "Pronto para entrar na proxima realidade?",
    "cta.subtitle": "Consulte a disponibilidade e faca parte dos primeiros a usar os oculos de IA da Meta no Brasil.",
    "cta.btn":      "Consultar Disponibilidade",
    "footer.tagline":"Smart Glasses — Realidade Mista com IA",
    "footer.legal": "Este site e operado por um distribuidor independente.\nMeta® e marca registrada da Meta Platforms, Inc.",
    "footer.contact":"WhatsApp",
    "footer.copy":  "© 2026 Meta Smart Glasses Brasil. Todos os direitos reservados."
  },
  en: {
    "topbar.badge": "EXCLUSIVE PRE-ORDER",
    "topbar.text":  "Limited spots for Brazil — Ourinhos SP",
    "topbar.link":  "Talk to a Specialist →",
    "nav.power":    "Spatial AI",
    "nav.vision":   "Vision",
    "nav.specs":    "Hardware",
    "nav.faq":      "FAQ",
    "nav.cta":      "Pre-Order",
    "hero.eyebrow": "Spatial Computing · AI-Powered · MicroLED Display",
    "hero.title1":  "THE NEXT",
    "hero.title2":  "REALITY",
    "hero.subtitle":"Meta's mixed reality AI glasses arrive in Brazil.\nHolographic lenses. Directional audio. Intelligence that sees the world with you.",
    "hero.cta":     "Pre-Order Now",
    "hero.cta2":    "Explore Product",
    "power.title":  "The Power of Spatial Computing",
    "power.p1":     "Meta Smart Glasses redefine how humans and machines connect. MicroLED holographic lenses project information directly into your visual field, while embedded AI processes context in real time.",
    "power.p2":     "With adaptive neural commands and surgical-precision eye tracking, the glasses learn your habits and anticipate your needs.",
    "power.f1.title":"MicroLED Lenses",
    "power.f1.desc": "High-resolution holographic display",
    "power.f2.title":"Embedded Neural AI",
    "power.f2.desc": "Local processing with zero latency",
    "power.f3.title":"Directional Audio",
    "power.f3.desc": "Spatial sound without earbuds",
    "power.badge":  "AI-Powered · Live",
    "vision.title": "The Vision of the Future",
    "vision.p1":    "We are at the turning point of a new era of human communication. Meta Smart Glasses are not just a device — they are the first step toward a world where digital and physical coexist seamlessly.",
    "vision.p2":    "Imagine getting directions in your visual field while walking, translating a conversation in real time, or receiving health alerts discreetly — all without looking away from what matters.",
    "vision.quote": '"Spatial computing is not the future — it is the present that most people have not yet seen."',
    "vision.cite":  "— Mark Zuckerberg, Meta CEO",
    "vision.p1t":   "Full Connectivity",
    "vision.p1d":   "Wi-Fi 6, Bluetooth 5.3, and 5G via paired smartphone",
    "vision.p2t":   "Privacy by Design",
    "vision.p2d":   "LED indicator and physical camera controls",
    "vision.p3t":   "Open Ecosystem",
    "vision.p3d":   "iOS, Android, and all major platforms",
    "specs.title":  "Design & Hardware",
    "specs.subtitle":"Engineering precision in every detail. Designed for the future, available now.",
    "specs.c1.title":"MicroLED Display",
    "specs.c1.desc":"Holographic projection directly on the lenses. Wide visual field with adaptive brightness.",
    "specs.c2.title":"Directional Audio",
    "specs.c2.desc":"Open-ear speakers with 3D spatial sound. Hear the world and the AI simultaneously.",
    "specs.c3.title":"Ultra-Compact Cameras",
    "specs.c3.desc":"High-resolution cameras integrated into the frame for moments capture and AI computer vision.",
    "specs.c4.title":"Smart Battery",
    "specs.c4.desc":"Up to 4h of active use. Charging case adds up to 20 extra hours of battery life.",
    "specs.c5.title":"Full Connectivity",
    "specs.c5.desc":"Wi-Fi 6, Bluetooth 5.3. Compatible with 5G networks via paired smartphone.",
    "specs.c6.title":"Premium Design",
    "specs.c6.desc":"Ultra-lightweight titanium frame. Interchangeable lenses. Available in multiple colors.",
    "faq.title":    "Frequently Asked Questions",
    "faq.subtitle": "Get your answers before placing your pre-order.",
    "faq.q1":       "Compatible with iOS and Android?",
    "faq.a1":       "Yes. Meta Smart Glasses are compatible with both iOS (iPhone) and Android devices, integrating with the Meta View app on both platforms.",
    "faq.q2":       "How long does the battery last?",
    "faq.a2":       "The battery provides up to 4 hours of active continuous use, with a proprietary charging case adding up to 20 extra hours of battery life.",
    "faq.q3":       "Do the cameras violate privacy?",
    "faq.a3":       "The glasses have a visible privacy LED whenever cameras are active, plus physical controls for complete shutdown. Meta complies with Brazilian LGPD regulations.",
    "faq.q4":       "Delivery to Ourinhos-SP?",
    "faq.a4":       "Yes! We are authorized representatives in Ourinhos-SP and the region. Contact us via WhatsApp to check availability and delivery options.",
    "faq.q5":       "Do they have warranty in Brazil?",
    "faq.a5":       "Yes. All products sold through our channel come with warranty and localized technical support.",
    "faq.q6":       "What are the connectivity options?",
    "faq.a6":       "Meta Smart Glasses feature Bluetooth 5.3, Wi-Fi 6, and are compatible with 5G networks via paired smartphone.",
    "cta.eyebrow":  "Exclusive Pre-Order · Ourinhos SP · Brazil",
    "cta.title":    "Ready to enter the next reality?",
    "cta.subtitle": "Check availability and be among the first to use Meta AI glasses in Brazil.",
    "cta.btn":      "Check Availability",
    "footer.tagline":"Smart Glasses — Mixed Reality with AI",
    "footer.legal": "This site is operated by an independent distributor.\nMeta® is a trademark of Meta Platforms, Inc.",
    "footer.contact":"WhatsApp",
    "footer.copy":  "© 2026 Meta Smart Glasses Brazil. All rights reserved."
  }
};

/* =============================================
   2. ESTADO GLOBAL
   ============================================= */
let currentLang  = localStorage.getItem('meta-lang')  || 'pt';
let currentTheme = localStorage.getItem('meta-theme') || 'dark';

/* =============================================
   3. APLICAR IDIOMA (i18n)
   ============================================= */
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('meta-lang', lang);
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en-US';

  // Traduz todos os elementos com data-i18n
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (i18n[lang] && i18n[lang][key]) {
      // Para botoes com <span> filhos, atualiza o textContent do span
      if (el.tagName === 'BUTTON') {
        var textSpan = el.querySelector('span:first-child');
        if (textSpan && textSpan !== el.querySelector('.faq__icon')) {
          textSpan.textContent = i18n[lang][key];
        }
      } else {
        // Preserva innerHTML apenas quando necessario (br tags)
        var text = i18n[lang][key];
        if (text.indexOf('\n') !== -1) {
          el.innerHTML = text.replace(/\n/g, '<br />');
        } else {
          el.textContent = text;
        }
      }
    }
  });

  // Atualiza label do botao de idioma
  var langLabel = document.getElementById('lang-label');
  var langOther = document.getElementById('lang-other');
  if (langLabel && langOther) {
    langLabel.textContent = lang === 'pt' ? 'PT' : 'EN';
    langOther.textContent  = lang === 'pt' ? 'EN' : 'PT';
  }
}

/* =============================================
   4. APLICAR TEMA (Dark / Light)
   ============================================= */
function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('meta-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

/* =============================================
   5. NAVBAR — opacidade ao rolar
   ============================================= */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar--opaque');
    } else {
      navbar.classList.remove('navbar--opaque');
    }
  }

  // Usa IntersectionObserver para performance — fallback em scroll event
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/* =============================================
   6. MENU MOBILE
   ============================================= */
function initMobileMenu() {
  var toggle  = document.getElementById('menu-toggle');
  var menu    = document.getElementById('mobile-menu');
  var links   = menu ? menu.querySelectorAll('.mobile-menu__link, .btn') : [];
  if (!toggle || !menu) return;

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Trava o scroll do body
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function() {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  // Fecha ao clicar em qualquer link do menu
  links.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Fecha com Esc
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}

/* =============================================
   7. FAQ ACCORDION
   ============================================= */
function initFAQ() {
  var items = document.querySelectorAll('.faq__item');
  items.forEach(function(item) {
    var btn    = item.querySelector('.faq__question');
    var answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function() {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros itens (comportamento accordion)
      items.forEach(function(other) {
        var otherBtn    = other.querySelector('.faq__question');
        var otherAnswer = other.querySelector('.faq__answer');
        if (otherBtn && otherAnswer && otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('is-open');
        }
      });

      // Alterna o item clicado
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.classList.remove('is-open');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('is-open');
      }
    });
  });
}

/* =============================================
   8. SCROLL REVEAL — IntersectionObserver
   ============================================= */
function initScrollReveal() {
  var elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  // Verifica se o usuario prefere movimento reduzido
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Mostra todos imediatamente sem animacao
    elements.forEach(function(el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Para de observar apos a animacao (performance)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Dispara quando 15% do elemento e visivel
    rootMargin: '0px 0px -40px 0px' // Leve offset para entrada mais suave
  });

  elements.forEach(function(el) { observer.observe(el); });
}

/* =============================================
   9. PARTICULAS DECORATIVAS (CTA Final)
   ============================================= */
function initParticles() {
  var container = document.getElementById('particles-container');
  if (!container) return;

  var colors = ['#0084FF', '#00D4FF', '#FFFFFF'];
  var count  = 18; // Numero de particulas

  for (var i = 0; i < count; i++) {
    (function(index) {
      var particle = document.createElement('span');
      particle.classList.add('particle');

      // Posicao e tamanho aleatorios
      var size   = Math.random() * 4 + 2;
      var left   = Math.random() * 100;
      var delay  = Math.random() * 8;
      var dur    = Math.random() * 6 + 5;
      var color  = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = [
        'width:' + size + 'px',
        'height:' + size + 'px',
        'left:' + left + '%',
        'bottom:' + (Math.random() * 30) + '%',
        'background:' + color,
        'opacity:' + (Math.random() * 0.6 + 0.2),
        'animation-duration:' + dur + 's',
        'animation-delay:' + delay + 's'
      ].join(';');

      container.appendChild(particle);
    })(i);
  }
}

/* =============================================
   10. SMOOTH SCROLL para ancoras internas
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* =============================================
   11. INICIALIZACAO — DOMContentLoaded
   ============================================= */
document.addEventListener('DOMContentLoaded', function() {

  // Aplica idioma e tema salvos (ou padrao)
  applyTheme(currentTheme);
  applyLang(currentLang);

  // Inicia todos os modulos
  initNavbar();
  initMobileMenu();
  initFAQ();
  initScrollReveal();
  initParticles();
  initSmoothScroll();

  // Listener: botao de tema
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // Listener: botao de idioma
  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      applyLang(currentLang === 'pt' ? 'en' : 'pt');
    });
  }

  // Inicia navbar como opaca se ja esta scrollado (reload de pagina)
  if (window.scrollY > 20) {
    var navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.add('navbar--opaque');
  }

  // Tenta reproduzir video (alguns navegadores bloqueiam autoplay)
  var video = document.querySelector('.hero__video');
  if (video) {
    video.play().catch(function() {
      // Autoplay bloqueado: o poster (imagem) ja serve de fallback visual
      console.info('Autoplay do video bloqueado pelo navegador — exibindo poster.');
    });
  }
});