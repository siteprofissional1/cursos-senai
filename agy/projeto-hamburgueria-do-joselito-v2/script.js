/**
 * ==========================================================================
 * HAMBURGUERIA DO JOSELITO - OURINHOS/SP
 * SCRIPT PRINCIPAL DE INTERATIVIDADE E EXPERIÊNCIA DO USUÁRIO
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. CONTROLE DO HEADER STICKY (EFEITO DE BLUR E SOMBRA NO SCROLL)
     ========================================================================== */
  const header = document.getElementById('header');

  /**
   * Monitora a posição de rolagem para aplicar classes visuais no header
   */
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Execução inicial para checar posição pós-reload

  /* ==========================================================================
     2. ROLAGEM SUAVE PARA ÂNCORAS INTERNAS DO MENU
     ========================================================================== */
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // Se for apenas "#", ignora
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Compensação da altura do header fixo
        const headerOffset = header ? header.offsetHeight + 10 : 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     3. EFEITO 3D TILT INTERATIVO NOS CARDS DO CARDÁPIO (PROFUNDIDADE 3D)
     ========================================================================== */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    // Evento ao mover o mouse dentro do card
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Posição X dentro do elemento
      const y = e.clientY - rect.top;  // Posição Y dentro do elemento
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Cálculo de rotação suave (-6deg a +6deg)
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    // Restaura o estado normal quando o mouse sai do card
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none'; // Movimento imediato ao interagir
    });
  });

  /* ==========================================================================
     4. BOTÃO DE COPIAR ENDEREÇO (EXPERIÊNCIA RÁPIDA E FEEDBACK VISUAL)
     ========================================================================== */
  const btnCopyAddress = document.getElementById('btn-copy-address');
  const copyBtnText = document.getElementById('copy-btn-text');
  const fullAddressElement = document.getElementById('full-address');

  if (btnCopyAddress && fullAddressElement && copyBtnText) {
    btnCopyAddress.addEventListener('click', async () => {
      const addressText = fullAddressElement.innerText.trim();

      try {
        await navigator.clipboard.writeText(addressText);
        
        // Feedback visual imediato
        const originalText = copyBtnText.innerText;
        copyBtnText.innerText = 'Endereço Copiado! ✅';
        btnCopyAddress.style.borderColor = 'var(--gold-neon)';
        btnCopyAddress.style.color = 'var(--gold-neon)';

        setTimeout(() => {
          copyBtnText.innerText = originalText;
          btnCopyAddress.style.borderColor = '';
          btnCopyAddress.style.color = '';
        }, 2500);

      } catch (err) {
        // Fallback caso clipboard API esteja indisponível
        const tempInput = document.createElement('textarea');
        tempInput.value = addressText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        copyBtnText.innerText = 'Endereço Copiado! ✅';
        setTimeout(() => {
          copyBtnText.innerText = 'Copiar Endereço';
        }, 2500);
      }
    });
  }

  /* ==========================================================================
     5. REVELAÇÃO SUAVE DE ELEMENTOS AO ROLAR A PÁGINA (INTERSECTION OBSERVER)
     ========================================================================== */
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Revela apenas uma vez para manter a performance
      }
    });
  }, observerOptions);

  // Observa seções e cards principais
  const revealElements = document.querySelectorAll('.burger-card, .pillar-card, .location-card, .quote-card, .cta-banner');
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // Aplica classe visível no CSS dinamicamente
  const styleSheet = document.createElement('style');
  styleSheet.innerHTML = `
    .is-visible {
      opacity: 1 !important;
      transform: translateY(0px) !important;
    }
  `;
  document.head.appendChild(styleSheet);

  /* ==========================================================================
     6. LOG DE INICIALIZAÇÃO COM ESTILO DE BRASA
     ========================================================================== */
  console.log(
    '%c🔥 Hamburgueria do Joselito - Ourinhos/SP | Landing Page Pronta e Otimizada!',
    'background: #0a0a0a; color: #ffb800; font-size: 13px; font-weight: bold; padding: 6px 12px; border: 1px solid #e50914; border-radius: 4px;'
  );
});
