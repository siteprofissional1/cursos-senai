/**
 * ============================================================================
 * COFRE TRANSPARENTE - LÓGICA E INTERATIVIDADE FRONT-END VANILLA JS
 * ============================================================================
 * Inclui:
 * 1. Fundo Canvas com Partículas Cibernéticas Conectadas e Reativas ao Cursor.
 * 2. Efeito de Rotação 3D Tilt Interativo no Cartão de Cristal Hero.
 * 3. Simulador de Câmbio de Moedas em Tempo Real com Cálculo de Economia de IOF.
 * 4. Accordion Interativo para a Seção de FAQ (Perguntas Frequentes).
 * 5. IntersectionObserver para Revelação Dinâmica ao Rolar a Tela.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. SISTEMA DE PARTÍCULAS CIBERNÉTICAS INTERATIVAS NO CANVAS
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Redimensionamento dinâmico do Canvas ao ajustar a janela
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Posição do ponteiro do mouse para interação com as partículas
    const mouse = {
      x: null,
      y: null,
      radius: 140
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Classe de Partícula Indivual
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8; // Velocidade X
        this.vy = (Math.random() - 0.5) * 0.8; // Velocidade Y
        this.radius = Math.random() * 2 + 1;    // Raio da partícula
        this.color = Math.random() > 0.5 ? '#00F0FF' : '#7000FF'; // Ciano ou Roxo
      }

      // Atualiza posição e verifica colisão com bordas da tela
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Reação de repulsão suave ao aproximação do mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
          }
        }
      }

      // Desenha o círculo da partícula
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset para economizar performance
      }
    }

    // Criar array de partículas baseado na resolução da tela
    const particleCount = Math.floor((width * height) / 18000);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Loop de Animação Continuo
    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Atualizar e desenhar cada partícula
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Conectar partículas próximas por linhas cibernéticas
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const opacity = 1 - (dist / 120);
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.18})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* --------------------------------------------------------------------------
     2. EFEITO DE ROTAÇÃO 3D TILT NO CARTÃO DE CRISTAL HERO
     -------------------------------------------------------------------------- */
  const card3D = document.getElementById('heroCard3D');
  if (card3D) {
    const heroVisual = card3D.parentElement;

    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left; // Coordenada X dentro do container
      const y = e.clientY - rect.top;  // Coordenada Y dentro do container

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calcular ângulos de rotação (máximo de 20 graus)
      const rotateX = ((y - centerY) / centerY) * -18;
      const rotateY = ((x - centerX) / centerX) * 18;

      // Aplicar matriz de transformação 3D temporária interrompendo a animação float pura
      card3D.style.animation = 'none';
      card3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    // Reset suave ao retirar o cursor
    heroVisual.addEventListener('mouseleave', () => {
      card3D.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      // Reativar animação contínua de levitação
      setTimeout(() => {
        card3D.style.animation = 'float 6s ease-in-out infinite';
      }, 300);
    });
  }

  /* --------------------------------------------------------------------------
     3. SIMULADOR DE CÂMBIO DE MOEDAS EM TEMPO REAL E CÁLCULO DE IOF
     -------------------------------------------------------------------------- */
  const calcAmount = document.getElementById('calcAmount');
  const calcCurrencyFrom = document.getElementById('calcCurrencyFrom');
  const calcCurrencyTo = document.getElementById('calcCurrencyTo');
  const calcConverted = document.getElementById('calcConverted');
  const calcSavings = document.getElementById('calcSavings');

  // Taxas de câmbio simuladas de mercado comercial
  const exchangeRates = {
    USD: { BRL: 4.92, EUR: 0.92, GBP: 0.79, JPY: 154.20, BTC: 0.000015, USD: 1.00 },
    BRL: { USD: 0.203, EUR: 0.187, GBP: 0.160, JPY: 31.34, BTC: 0.000003, BRL: 1.00 },
    EUR: { USD: 1.08, BRL: 5.34, GBP: 0.85, JPY: 167.50, BTC: 0.000016, EUR: 1.00 },
    GBP: { USD: 1.26, BRL: 6.22, EUR: 1.16, JPY: 195.10, BTC: 0.000019, GBP: 1.00 }
  };

  function updateCurrencyConversion() {
    if (!calcAmount || !calcConverted) return;

    const amount = parseFloat(calcAmount.value) || 0;
    const from = calcCurrencyFrom.value;
    const to = calcCurrencyTo.value;

    let rate = 1.0;
    if (exchangeRates[from] && exchangeRates[from][to]) {
      rate = exchangeRates[from][to];
    } else if (from === to) {
      rate = 1.0;
    } else {
      rate = 0.5; // Fallback
    }

    const converted = amount * rate;
    
    // Formatação de saída para BTC vs Moedas fiduciárias
    if (to === 'BTC') {
      calcConverted.value = converted.toFixed(6);
    } else {
      calcConverted.value = converted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Cálculo da economia em IOF (Diferença entre IOF bancos 4.38% vs Cofre Transparente 0%)
    const iofTraditionalBank = amount * 0.0438;
    const spreadSavings = amount * 0.02; // Economia de spread estimado em 2%
    const totalSavings = iofTraditionalBank + spreadSavings;

    let currencySymbol = 'R$';
    if (from === 'USD') currencySymbol = '$';
    if (from === 'EUR') currencySymbol = '€';
    if (from === 'GBP') currencySymbol = '£';

    if (calcSavings) {
      calcSavings.textContent = `${currencySymbol} ${totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  if (calcAmount && calcCurrencyFrom && calcCurrencyTo) {
    calcAmount.addEventListener('input', updateCurrencyConversion);
    calcCurrencyFrom.addEventListener('change', updateCurrencyConversion);
    calcCurrencyTo.addEventListener('change', updateCurrencyConversion);
    updateCurrencyConversion(); // Executa o cálculo inicial
  }

  /* --------------------------------------------------------------------------
     4. ACCORDION INTERATIVO PARA PERGUNTAS FREQUENTES (FAQ)
     -------------------------------------------------------------------------- */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Fechar todos os outros accordions abertos
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Se não estava ativo, abre o clicado
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. INTERSECTION OBSERVER PARA REVELAÇÃO DINÂMICA AO ROLAR (SCROLL REVEAL)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Revela apenas uma vez
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

});
