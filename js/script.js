document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. MENU MOBILE
       ============================================================ */
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileMenu.setAttribute('aria-expanded', isOpen);
            const icon = mobileMenu.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
                const icon = mobileMenu.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });
    }

    /* ============================================================
       2. HEADER STICKY + LIEN ACTIF AU SCROLL
       ============================================================ */
    const header = document.getElementById('mainHeader');
    const backToTop = document.getElementById('backToTop');
    const whatsappFloat = document.getElementById('whatsappFloat');
    const navAnchors = document.querySelectorAll('.nav-links a');

    // --- Lien de nav actif selon la PAGE courante (site multi-pages) ---
    const currentFile = (location.pathname.split('/').pop() || 'index.html');
    navAnchors.forEach(a => {
        const hrefFile = a.getAttribute('href').split('/').pop();
        a.classList.toggle('active-link', hrefFile === currentFile || (hrefFile === 'index.html' && currentFile === ''));
    });

    function onScrollHeader() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 60);
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
        // N'affiche WhatsApp qu'après le hero, pour ne jamais chevaucher
        // ses boutons sur mobile (hero en plein écran au chargement).
        if (whatsappFloat) whatsappFloat.classList.toggle('visible', window.scrollY > 300);
    }
    window.addEventListener('scroll', onScrollHeader);
    onScrollHeader();

    /* ============================================================
       3. ANIMATIONS D'APPARITION AU SCROLL
       ============================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ============================================================
       4. SMOOTH SCROLL AVEC OFFSET HEADER
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 84,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================================
       5. FORMULAIRE DE CONTACT
       ⚠️ Pas de backend pour le moment : ceci simule l'envoi.
       Pour un envoi réel, brancher un service comme Web3Forms
       ou EmailJS (aucune modification HTML nécessaire, juste
       remplacer la logique ci-dessous par un fetch() vers l'API
       du service choisi).
       ============================================================ */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Envoi en cours...';
            btn.disabled = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            setTimeout(() => {
                formStatus.textContent = 'Merci ! Votre demande a bien été enregistrée, nous vous recontactons rapidement.';
                formStatus.classList.add('success');
                btn.innerText = originalText;
                btn.disabled = false;
                contactForm.reset();
            }, 1400);
        });
    }

    /* ============================================================
       6. FAQ ACCORDÉON
       ============================================================ */
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ============================================================
       7. PLANNING — FILTRE PAR JOUR + JOUR ACTUEL AUTO-DÉTECTÉ
       (revérifié chaque minute, utile si la page reste ouverte
       sur un écran affiché en continu en salle)
       ============================================================ */
    const dayButtons = document.querySelectorAll('.day-btn');
    const scheduleRows = document.querySelectorAll('#scheduleTable tbody tr');
    const scheduleEmpty = document.getElementById('scheduleEmpty');

    if (dayButtons.length && scheduleEmpty) {
        const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        let userSelectedDay = false;

        function filterSchedule(day) {
            let visibleCount = 0;
            scheduleRows.forEach(row => {
                const match = day === 'all' || row.dataset.day === day;
                row.hidden = !match;
                if (match) visibleCount++;
            });
            scheduleEmpty.hidden = visibleCount > 0;
        }

        dayButtons.forEach(btn => {
            const day = btn.dataset.day;
            btn.addEventListener('click', () => {
                userSelectedDay = true;
                dayButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterSchedule(day);
            });
        });

        function selectToday() {
            const todayName = dayNames[new Date().getDay()];

            // Met à jour le point "aujourd'hui" sur le bon bouton
            dayButtons.forEach(b => b.classList.toggle('is-today', b.dataset.day === todayName));

            // Ne force le filtre que si l'utilisateur n'a pas cliqué sur un jour lui-même
            if (userSelectedDay) return;

            const todayBtn = document.querySelector(`.day-btn[data-day="${todayName}"]`);
            const fallbackBtn = document.querySelector('.day-btn[data-day="all"]');
            dayButtons.forEach(b => b.classList.remove('active'));
            if (todayBtn) {
                todayBtn.classList.add('active');
                filterSchedule(todayName);
            } else if (fallbackBtn) {
                fallbackBtn.classList.add('active');
                filterSchedule('all');
            }
        }

        selectToday();
        setInterval(selectToday, 60000); // revérifie toutes les 60 secondes
    }

    /* ============================================================
       8. MODAL "PAIEMENT EN LIGNE À VENIR"
       ============================================================ */
    const subscribeModal = document.getElementById('subscribeModal');
    const modalClose = document.getElementById('modalClose');

    if (subscribeModal && modalClose) {
        document.querySelectorAll('.js-subscribe').forEach(btn => {
            btn.addEventListener('click', () => subscribeModal.classList.add('open'));
        });
        modalClose.addEventListener('click', () => subscribeModal.classList.remove('open'));
        subscribeModal.addEventListener('click', (e) => {
            if (e.target === subscribeModal) subscribeModal.classList.remove('open');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') subscribeModal.classList.remove('open');
        });
    }

    /* ============================================================
       9. RETOUR EN HAUT
       (backToTop est déjà déclaré au bloc 2, plus haut dans ce fichier)
       ============================================================ */
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ============================================================
       10. ANNÉE AUTOMATIQUE DANS LE FOOTER
       ============================================================ */
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

});
