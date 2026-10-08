document.addEventListener('DOMContentLoaded', () => {
    
    // === INTERSECTION OBSERVER PARA ANIMAÇÕES AO SCROLL ===
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12 // Dispara quando 12% do elemento estiver visível para animações mais antecipadas e fluidas
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Mantém a classe; se quiser animar apenas na primeira vez, descomente a linha abaixo:
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona e observa elementos
    const animatedElements = document.querySelectorAll('.fade-in-section, .slide-up-section');
    animatedElements.forEach(el => observer.observe(el));


    // === LÓGICA DO ACCORDION (FAQ) COM ACESSIBILIDADE ===
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Fecha todos os outros accordions para focar no conteúdo atual
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });

            // Se o item clicado não estava ativo, abre ele
            if (!isActive) {
                accordionItem.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

});
