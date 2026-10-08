/**
 * ============================================================================
 * TRIPCARD - FRONT-END ENGINE & INTERATIVIDADE PRO (VANILLA JS)
 * ============================================================================
 * Funcionalidades:
 * 1. Fundo Canvas Cibernético com Partículas Interativas Reativas ao Cursor.
 * 2. Barra de Progresso Superior e Botão Voltar ao Topo com Anel SVG.
 * 3. Menu Mobile Acessível com Drawer Lateral Glassmorphism.
 * 4. Cartão 3D Hero com Efeito Tilt, Flip 3D (Frente/Verso) e Chip Realista no Meio à Esquerda.
 * 5. Live Studio: Personalizador tripcard em Tempo Real com Gerador WhatsApp.
 * 6. Simulador Multimoeda com Inversor (Swap), Chips de Atalho e Tabela Comparativa.
 * 7. Depoimentos com Filtro por Categoria (Nômades, Startups, Freelancers).
 * 8. FAQ Inteligente com Busca em Tempo Real, Filtro por Categorias e Accordion.
 * 9. Sistema de Notificações Toast e Cópia para Área de Transferência.
 * 10. Destaque Automático de Links Ativos no Menu Durante o Scroll (ScrollSpy).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. SISTEMA DE TOASTS NOTIFICAÇÕES (FEEDBACK VISUAL HÁPTICO)
     -------------------------------------------------------------------------- */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, icon = 'fa-circle-check', duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  /* --------------------------------------------------------------------------
     2. FUNDO CANVAS COM PARTÍCULAS CIBERNÉTICAS INTERATIVAS
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

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

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00F0FF' : '#7928CA';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= Math.cos(angle) * force * 2.5;
            this.y -= Math.sin(angle) * force * 2.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const particleCount = Math.min(Math.floor((width * height) / 20000), 75);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const opacity = 1 - (dist / 115);
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.16})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* --------------------------------------------------------------------------
     3. BARRA DE PROGRESSO SUPERIOR & BOTÃO VOLTAR AO TOPO COM ANEL SVG
     -------------------------------------------------------------------------- */
  const scrollProgressBar = document.getElementById('scroll-progress');
  const btnBackToTop = document.getElementById('btnBackToTop');
  const progressCircle = document.querySelector('.progress-ring-circle');
  const circumference = 2 * Math.PI * 18; // Raio 18 = ~113.1

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    // Atualizar barra superior
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercentage}%`;
    }

    // Atualizar botão voltar ao topo e anel SVG
    if (btnBackToTop) {
      if (scrollTop > 350) {
        btnBackToTop.classList.add('visible');
      } else {
        btnBackToTop.classList.remove('visible');
      }

      if (progressCircle) {
        const offset = circumference - (scrollPercentage / 100) * circumference;
        progressCircle.style.strokeDashoffset = `${offset}`;
      }
    }
  });

  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. MENU MOBILE HAMBÚRGUER & DRAWER LATERAL
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openMobileDrawer() {
    if (mobileNavDrawer && drawerOverlay && mobileMenuBtn) {
      mobileNavDrawer.classList.add('active');
      drawerOverlay.classList.add('active');
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
      drawerOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileDrawer() {
    if (mobileNavDrawer && drawerOverlay && mobileMenuBtn) {
      mobileNavDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
      drawerOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer && mobileNavDrawer.classList.contains('active');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  /* --------------------------------------------------------------------------
     5. CARTÃO HERO 3D COM TILT, FLIP 3D E SELETOR DE SHADERS
     -------------------------------------------------------------------------- */
  const card3D = document.getElementById('heroCard3D');
  const btnFlipCard = document.getElementById('btnFlipCard');
  const flipBtnText = document.getElementById('flipBtnText');
  const themeDots = document.querySelectorAll('.theme-dot');

  // Efeito Flip 3D (Frente e Verso)
  if (btnFlipCard && card3D) {
    btnFlipCard.addEventListener('click', () => {
      const isFlipped = card3D.classList.toggle('flipped');
      if (flipBtnText) {
        flipBtnText.textContent = isFlipped ? 'Ver Frente' : 'Ver Verso';
      }
      showToast(isFlipped ? 'Exibindo verso do tripcard com Token FIDO2' : 'Exibindo frente do tripcard de cristal');
    });
  }

  // Seletor de Acabamento no Cartão Hero
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const style = dot.getAttribute('data-style');
      if (card3D) {
        card3D.setAttribute('data-style', style);
        showToast(`Estilo alterado para: tripcard ${style.toUpperCase()}`);
      }
    });
  });

  // Efeito de Rotação Tilt Tridimensional Interativo
  const heroCardScene = document.getElementById('heroCardScene');
  if (heroCardScene && card3D) {
    heroCardScene.addEventListener('mousemove', (e) => {
      if (card3D.classList.contains('flipped')) return;

      const rect = heroCardScene.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -16;
      const rotateY = ((x - centerX) / centerX) * 16;

      card3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    heroCardScene.addEventListener('mouseleave', () => {
      if (!card3D.classList.contains('flipped')) {
        card3D.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. NOVO MÓDULO LIVE STUDIO: PERSONALIZADOR EM TEMPO REAL & GERADOR WHATSAPP
     -------------------------------------------------------------------------- */
  const studioCard = document.getElementById('studioCard');
  const studioInner = studioCard ? studioCard.querySelector('.studio-card-inner') : null;
  const studioHolderDisplay = document.getElementById('studioHolderDisplay');
  const studioTypeDisplay = document.getElementById('studioTypeDisplay');
  const studioEditionBadge = document.getElementById('studioEditionBadge');
  const studioCurrencyBadge = document.getElementById('studioCurrencyBadge');
  const inputLaserName = document.getElementById('inputLaserName');
  const selectPrimaryCurrency = document.getElementById('selectPrimaryCurrency');
  const pillBtns = document.querySelectorAll('.pill-btn');
  const finishCards = document.querySelectorAll('.finish-card');
  const btnCustomWhatsApp = document.getElementById('btnCustomWhatsApp');

  // Estado do configurador com Joselito de Cascatinha como padrão
  const customizerState = {
    accountType: 'Nômade Digital (PF)',
    finishName: 'Translúcido Cyan',
    finishId: 'cyan',
    holderName: 'JOSELITO DE CASCATINHA',
    currency: 'BRL'
  };

  function updateCustomWhatsAppUrl() {
    if (!btnCustomWhatsApp) return;

    const rawMsg = `Oi! Personalizei meu cartão tripcard no site:\n` +
      `• Titular: ${customizerState.holderName}\n` +
      `• Tipo de Conta: ${customizerState.accountType}\n` +
      `• Acabamento: Cristal ${customizerState.finishName}\n` +
      `• Moeda Principal: ${customizerState.currency}\n` +
      `Gostaria de solicitar a abertura e emissão do meu tripcard!`;

    const encodedMsg = encodeURIComponent(rawMsg);
    btnCustomWhatsApp.href = `https://wa.me/5514998951657?text=${encodedMsg}`;
  }

  // 1. Tipo de Conta
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const isPj = btn.getAttribute('data-account') === 'pj';
      customizerState.accountType = isPj ? 'Startup / Empresa (PJ)' : 'Nômade Digital (PF)';

      if (studioTypeDisplay) {
        studioTypeDisplay.textContent = isPj ? 'STARTUP GLOBAL (PJ)' : 'NÔMADE GLOBAL (PF)';
        studioTypeDisplay.style.color = isPj ? 'var(--cyber-purple)' : 'var(--soft-neon-green)';
      }

      updateCustomWhatsAppUrl();
      showToast(`Perfil selecionado: ${customizerState.accountType}`);
    });
  });

  // 2. Acabamento de Cristal
  finishCards.forEach(card => {
    card.addEventListener('click', () => {
      finishCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const finish = card.getAttribute('data-finish');
      customizerState.finishId = finish;

      if (studioInner) {
        studioInner.className = 'studio-card-inner';
        if (finish === 'obsidian') {
          studioInner.classList.add('style-obsidian');
          customizerState.finishName = 'Obsidian Titanium';
        } else if (finish === 'emerald') {
          studioInner.classList.add('style-emerald');
          customizerState.finishName = 'Holo Emerald';
        } else {
          customizerState.finishName = 'Translúcido Cyan';
        }
      }

      if (studioEditionBadge) {
        studioEditionBadge.textContent = `EDITION: ${customizerState.finishName.toUpperCase()}`;
      }

      updateCustomWhatsAppUrl();
      showToast(`Visual atualizado: Cristal ${customizerState.finishName}`);
    });
  });

  // 3. Nome Gravado a Laser (Atualização em Tempo Real)
  if (inputLaserName && studioHolderDisplay) {
    inputLaserName.addEventListener('input', (e) => {
      const val = e.target.value.trim().toUpperCase();
      if (val.length > 0) {
        studioHolderDisplay.textContent = val;
        customizerState.holderName = val;
      } else {
        studioHolderDisplay.textContent = 'JOSELITO DE CASCATINHA';
        customizerState.holderName = 'JOSELITO DE CASCATINHA';
      }
      updateCustomWhatsAppUrl();
    });
  }

  // 4. Moeda Principal
  if (selectPrimaryCurrency && studioCurrencyBadge) {
    selectPrimaryCurrency.addEventListener('change', (e) => {
      const curr = e.target.value;
      customizerState.currency = curr;
      studioCurrencyBadge.textContent = `${curr} / MULTI`;
      updateCustomWhatsAppUrl();
      showToast(`Moeda base alterada para: ${curr}`);
    });
  }

  // Inicializa o link customizado
  updateCustomWhatsAppUrl();

  /* --------------------------------------------------------------------------
     7. SIMULADOR MULTIMOEDA TURBINADO COM COMPARATIVO & INVERSOR SWAP
     -------------------------------------------------------------------------- */
  const calcAmount = document.getElementById('calcAmount');
  const calcCurrencyFrom = document.getElementById('calcCurrencyFrom');
  const calcCurrencyTo = document.getElementById('calcCurrencyTo');
  const calcConverted = document.getElementById('calcConverted');
  const calcSavings = document.getElementById('calcSavings');
  const symbolFrom = document.getElementById('symbolFrom');
  const symbolTo = document.getElementById('symbolTo');
  const btnSwapCurrencies = document.getElementById('btnSwapCurrencies');
  const quickAmountChips = document.querySelectorAll('.chip-btn');

  // Elementos da Tabela Comparativa
  const tableCofreAmount = document.getElementById('tableCofreAmount');
  const tableBankAmount = document.getElementById('tableBankAmount');
  const tableOtherAmount = document.getElementById('tableOtherAmount');

  // Cotações comerciais de mercado
  const currencySymbols = {
    USD: '$',
    BRL: 'R$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    BTC: '₿'
  };

  const exchangeRates = {
    USD: { BRL: 4.92, EUR: 0.92, GBP: 0.79, JPY: 154.20, BTC: 0.000015, USD: 1.00 },
    BRL: { USD: 0.20325, EUR: 0.18726, GBP: 0.16077, JPY: 31.34, BTC: 0.00000305, BRL: 1.00 },
    EUR: { USD: 1.087, BRL: 5.34, GBP: 0.858, JPY: 167.50, BTC: 0.0000163, EUR: 1.00 },
    GBP: { USD: 1.265, BRL: 6.22, EUR: 1.165, JPY: 195.10, BTC: 0.0000190, GBP: 1.00 }
  };

  function updateCurrencyConversion() {
    if (!calcAmount || !calcConverted) return;

    const amount = parseFloat(calcAmount.value) || 0;
    const from = calcCurrencyFrom ? calcCurrencyFrom.value : 'BRL';
    const to = calcCurrencyTo ? calcCurrencyTo.value : 'USD';

    // Atualizar símbolos prefixos
    if (symbolFrom) symbolFrom.textContent = currencySymbols[from] || from;
    if (symbolTo) symbolTo.textContent = currencySymbols[to] || to;

    let rate = 1.0;
    if (exchangeRates[from] && exchangeRates[from][to]) {
      rate = exchangeRates[from][to];
    } else if (from === to) {
      rate = 1.0;
    } else {
      rate = 0.5;
    }

    const converted = amount * rate;

    // Formatação do valor convertido
    if (to === 'BTC') {
      calcConverted.value = converted.toFixed(6);
    } else {
      calcConverted.value = converted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Economia calculada (IOF Banco 4.38% vs tripcard 0% + Spread Turismo Banco 3.5%)
    const iofTraditionalBank = amount * 0.0438;
    const spreadSavings = amount * 0.025;
    const totalSavings = iofTraditionalBank + spreadSavings;

    const fromSym = currencySymbols[from] || 'R$';
    const toSym = currencySymbols[to] || '$';

    if (calcSavings) {
      calcSavings.textContent = `${fromSym} ${totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Atualizar Tabela Comparativa de Total Recebido
    if (tableCofreAmount) {
      tableCofreAmount.textContent = `${toSym} ${converted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (tableBankAmount) {
      const bankConverted = converted * (1 - 0.0438 - 0.035);
      tableBankAmount.textContent = `${toSym} ${bankConverted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (tableOtherAmount) {
      const otherConverted = converted * (1 - 0.011 - 0.018);
      tableOtherAmount.textContent = `${toSym} ${otherConverted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  if (calcAmount && calcCurrencyFrom && calcCurrencyTo) {
    calcAmount.addEventListener('input', updateCurrencyConversion);
    calcCurrencyFrom.addEventListener('change', updateCurrencyConversion);
    calcCurrencyTo.addEventListener('change', updateCurrencyConversion);
  }

  // Inversor de Moedas (Swap)
  if (btnSwapCurrencies && calcCurrencyFrom && calcCurrencyTo) {
    btnSwapCurrencies.addEventListener('click', () => {
      const oldFrom = calcCurrencyFrom.value;
      const oldTo = calcCurrencyTo.value;

      const canSwap = Array.from(calcCurrencyFrom.options).some(opt => opt.value === oldTo);

      if (canSwap) {
        calcCurrencyFrom.value = oldTo;
        calcCurrencyTo.value = oldFrom;
        updateCurrencyConversion();
        showToast(`Moedas invertidas: ${oldTo} ⇄ ${oldFrom}`);
      } else {
        calcCurrencyFrom.value = 'USD';
        calcCurrencyTo.value = 'BRL';
        updateCurrencyConversion();
        showToast(`Câmbio ajustado para USD ⇄ BRL`);
      }
    });
  }

  // Chips de Valor Rápido
  quickAmountChips.forEach(chip => {
    chip.addEventListener('click', () => {
      quickAmountChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const val = chip.getAttribute('data-val');
      if (calcAmount) {
        calcAmount.value = val;
        updateCurrencyConversion();
      }
    });
  });

  // Executa o cálculo inicial
  updateCurrencyConversion();

  /* --------------------------------------------------------------------------
     8. DEPOIMENTOS COM FILTROS INTERATIVOS POR CATEGORIA
     -------------------------------------------------------------------------- */
  const testimonialFilterPills = document.querySelectorAll('.filter-pill');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  testimonialFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      testimonialFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      testimonialCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.display = 'flex';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     9. FAQ INTELIGENTE COM BUSCA INSTANTÂNEA & FILTRO POR CATEGORIAS
     -------------------------------------------------------------------------- */
  const faqSearch = document.getElementById('faqSearch');
  const faqClearBtn = document.getElementById('faqClearBtn');
  const faqPills = document.querySelectorAll('.faq-pill');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const faqSearchStatus = document.getElementById('faqSearchStatus');
  const faqSearchQuery = document.getElementById('faqSearchQuery');
  const faqMatchCount = document.getElementById('faqMatchCount');
  const faqEmptyState = document.getElementById('faqEmptyState');

  let currentFaqCategory = 'all';

  function filterFaqItems() {
    const query = faqSearch ? faqSearch.value.trim().toLowerCase() : '';
    let matches = 0;

    if (faqClearBtn) {
      faqClearBtn.style.display = query.length > 0 ? 'flex' : 'none';
    }

    if (faqSearchStatus && faqSearchQuery && faqMatchCount) {
      if (query.length > 0) {
        faqSearchStatus.style.display = 'block';
        faqSearchQuery.textContent = query;
      } else {
        faqSearchStatus.style.display = 'none';
      }
    }

    accordionItems.forEach(item => {
      const itemCat = item.getAttribute('data-faq-cat');
      const itemKeywords = (item.getAttribute('data-keywords') || '').toLowerCase();
      const questionText = (item.querySelector('.accordion-question') ? item.querySelector('.accordion-question').textContent : '').toLowerCase();
      const contentText = (item.querySelector('.accordion-content') ? item.querySelector('.accordion-content').textContent : '').toLowerCase();

      const matchesCat = currentFaqCategory === 'all' || itemCat === currentFaqCategory;
      const matchesQuery = query === '' || questionText.includes(query) || contentText.includes(query) || itemKeywords.includes(query);

      if (matchesCat && matchesQuery) {
        item.style.display = 'block';
        matches++;
      } else {
        item.style.display = 'none';
      }
    });

    if (faqMatchCount) faqMatchCount.textContent = matches;

    if (faqEmptyState) {
      faqEmptyState.style.display = matches === 0 ? 'block' : 'none';
    }
  }

  if (faqSearch) {
    faqSearch.addEventListener('input', filterFaqItems);
  }

  if (faqClearBtn && faqSearch) {
    faqClearBtn.addEventListener('click', () => {
      faqSearch.value = '';
      filterFaqItems();
      faqSearch.focus();
    });
  }

  faqPills.forEach(pill => {
    pill.addEventListener('click', () => {
      faqPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFaqCategory = pill.getAttribute('data-faq-cat');
      filterFaqItems();
    });
  });

  // Accordion Expansão/Colapso
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherHeader = otherItem.querySelector('.accordion-header');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --------------------------------------------------------------------------
     10. CÓPIA RÁPIDA DE CNPJ E ENDEREÇO COM FEEDBACK TOAST
     -------------------------------------------------------------------------- */
  const btnCopyCnpj = document.getElementById('btnCopyCnpj');
  const btnCopyAddress = document.getElementById('btnCopyAddress');

  if (btnCopyCnpj) {
    btnCopyCnpj.addEventListener('click', () => {
      navigator.clipboard.writeText('45.982.103/0001-87').then(() => {
        showToast('CNPJ tripcard copiado: 45.982.103/0001-87', 'fa-copy');
      }).catch(() => {
        showToast('CNPJ: 45.982.103/0001-87', 'fa-id-card');
      });
    });
  }

  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', () => {
      const addr = 'R. Vitório Christoni, 1500 - Vila Sao Luiz, Ourinhos - SP, 19911-200';
      navigator.clipboard.writeText(addr).then(() => {
        showToast('Endereço corporativo copiado!', 'fa-copy');
      }).catch(() => {
        showToast('Sede: R. Vitório Christoni, 1500 - Ourinhos SP', 'fa-map-pin');
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. DESTAQUE AUTOMÁTICO DE LINKS NO MENU AO ROLAR (SCROLLSPY)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .bottom-bar-item');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  /* --------------------------------------------------------------------------
     12. INTERSECTION OBSERVER PARA REVELAÇÃO DINÂMICA AO ROLAR
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

});
