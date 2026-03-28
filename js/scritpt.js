document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTION DU MENU MOBILE ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Animation de l'icône menu (optionnel)
        const icon = mobileMenu.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Fermer le menu mobile lors d'un clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenu.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // --- 2. EFFET STICKY HEADER AU SCROLL ---
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.padding = '20px 0';
            header.style.boxShadow = 'none';
        }
    });

    // --- 3. ANIMATIONS D'APPARITION (REVEAL ON SCROLL) ---
    const revealElements = document.querySelectorAll('.feature-card, .service-item, .price-card, .section-title');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => {
        // État initial pour l'animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        revealObserver.observe(el);
    });

    // --- 4. GESTION DU FORMULAIRE DE CONTACT ---
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulation d'envoi
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Envoi en cours...';
            btn.disabled = true;
            btn.style.backgroundColor = '#555';

            setTimeout(() => {
                alert('Merci ! Votre demande d\'essai gratuit a bien été envoyée à l\'équipe Overdose Gym.');
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
                contactForm.reset();
            }, 2000);
        });
    }

    // --- 5. SMOOTH SCROLL POUR LES LIENS INTERNES ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // Offset pour le header fixe
                    behavior: 'smooth'
                });
            }
        });
    });
});