/**
 * script.js — Interactive Events
 * 
 * 5 Interaction Events:
 * 1. Active Navigation Link Highlighting (scroll-based)
 * 2. Scroll-Triggered Section Animations (IntersectionObserver)
 * 3. Animated Skill Progress Bars with Counter
 * 4. Hobby Tag Toggle / Click Effect
 * 5. Contact Button Enhanced Hover + Click Ripple
 * 6: Dark Mode Toggle
 * 7: Smooth Scroll with Navbar Collapse
 */

document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // INTERACTION 1: Active Navigation Highlighting
    // Highlights the nav link matching the current
    // visible section as the user scrolls.
    // =============================================
    const navLinks = document.querySelectorAll('#mainNav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        let currentId = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                currentId = section.id;
            }
        });

        // Default to intro if at top
        if (scrollY < 80) currentId = 'intro';

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav(); // run once on load


    // =============================================
    // INTERACTION 2: Scroll-Triggered Animations
    // Uses IntersectionObserver to fade-in elements
    // when they enter the viewport.
    // =============================================
    const animateObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger child items if container has multiple
                entry.target.classList.add('visible');
                animateObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.animate-item, .edu-card').forEach((el, i) => {
        // Stagger delay for siblings
        el.style.transitionDelay = (i % 4) * 0.08 + 's';
        animateObserver.observe(el);
    });


    // =============================================
    // INTERACTION 3: Skill Progress Bar Animation
    // with Live Percentage Counter
    // Bars animate from 0 to target width when the
    // skills section scrolls into view.
    // =============================================
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = parseInt(bar.getAttribute('aria-valuenow'));
                const pctEl = bar.closest('.skill-item').querySelector('.skill-pct');

                // Animate bar width
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 80);

                // Animate counter
                let count = 0;
                const duration = 1300;
                const steps = 60;
                const increment = targetWidth / steps;
                const interval = duration / steps;

                const counter = setInterval(() => {
                    count += increment;
                    if (count >= targetWidth) {
                        count = targetWidth;
                        clearInterval(counter);
                    }
                    if (pctEl) pctEl.textContent = Math.round(count) + '%';
                }, interval);

                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));


    // =============================================
    // INTERACTION 4: Hobby Tag Click Toggle
    // Clicking a hobby tag toggles its active
    // highlight state with a ripple effect.
    // =============================================
    const hobbyTags = document.querySelectorAll('.hobby-tag');

    hobbyTags.forEach(tag => {
        tag.addEventListener('click', function (e) {
            // Toggle active style
            this.classList.toggle('active-tag');

            // Create ripple element
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(225, 16, 16, 0.35);
                transform: scale(0);
                animation: tagRipple 0.55s ease-out forwards;
                pointer-events: none;
            `;

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width  = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left   = x + 'px';
            ripple.style.top    = y + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Inject ripple keyframe
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes tagRipple {
            to { transform: scale(3.5); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);


    // =============================================
    // INTERACTION 5: Contact Button Click Ripple
    // A ripple burst effect on clicking the
    // SEND MESSAGE button.
    // =============================================
    const contactBtn = document.getElementById('contactBtn');

    if (contactBtn) {
        contactBtn.addEventListener('click', function (e) {
            // Prevent double-fire during href navigation
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: btnRipple 0.6s ease-out forwards;
                pointer-events: none;
                z-index: 0;
            `;

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width  = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left   = x + 'px';
            ripple.style.top    = y + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });

        // Inject btn ripple keyframe
        const btnRippleStyle = document.createElement('style');
        btnRippleStyle.textContent = `
            @keyframes btnRipple {
                to { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(btnRippleStyle);
    }


    // =============================================
    // 6: Smooth Scroll + Navbar Collapse
    // Clicking a nav link smooth-scrolls to target
    // section and collapses mobile navbar.
    // =============================================
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navH = document.getElementById('mainNav').offsetHeight;
                    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navH - 4;
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });
                }

                // Collapse Bootstrap mobile navbar
                const navCollapse = document.getElementById('navbarNav');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });


    // =============================================
    // 7: Dark / Light Mode Toggle
    // Uses class on <html> element + localStorage.
    // Toggle button lives in the navbar.
    // Default is DARK mode (no class = dark).
    // Adding class "light-mode" switches to light.
    // =============================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon   = document.getElementById('themeIcon');
    const htmlEl      = document.documentElement;

    // Update icon & button label based on current theme
    function applyThemeUI(isLight) {
        if (isLight) {
            themeIcon.className = 'fas fa-moon';
            themeToggle.setAttribute('data-label', 'Dark Mode');
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        } else {
            themeIcon.className = 'fas fa-sun';
            themeToggle.setAttribute('data-label', 'Light Mode');
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
    }

    // Apply saved preference on load
    const savedTheme = localStorage.getItem('cvTheme');
    if (savedTheme === 'light') {
        htmlEl.classList.add('light-mode');
        applyThemeUI(true);
    } else {
        applyThemeUI(false);
    }

    // Toggle on click
    themeToggle.addEventListener('click', function () {
        const isNowLight = htmlEl.classList.toggle('light-mode');
        localStorage.setItem('cvTheme', isNowLight ? 'light' : 'dark');
        applyThemeUI(isNowLight);

        // Brief spin animation on icon
        themeIcon.style.transform = 'rotate(360deg)';
        themeIcon.style.transition = 'transform 0.45s ease';
        setTimeout(() => {
            themeIcon.style.transform = '';
            themeIcon.style.transition = '';
        }, 450);
    });


    // =============================================
    // Bootstrap Carousel Enhancement
    // Pause on hover, resume on leave
    // =============================================
    const carouselEl = document.getElementById('portfolioCarousel');
    if (carouselEl) {
        const bsCarousel = bootstrap.Carousel.getInstance(carouselEl) ||
                           new bootstrap.Carousel(carouselEl, {
                               interval: 4000,
                               wrap: true,
                               touch: true
                           });

        carouselEl.addEventListener('mouseenter', () => bsCarousel.pause());
        carouselEl.addEventListener('mouseleave', () => bsCarousel.cycle());

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft')  bsCarousel.prev();
            if (e.key === 'ArrowRight') bsCarousel.next();
        });
    }


    // =============================================
    // Console signature
    // =============================================
    console.log('%c CV ', 'background:#ff2d78;color:#fff;font-family:monospace;font-size:14px;padding:4px 8px;');
    console.log('%c5 Interactions Active:', 'color:#ff2d78;font-weight:bold;');
    console.log('  1. Active Nav Highlighting (scroll)');
    console.log('  2. Scroll-Triggered Fade-In Animations');
    console.log('  3. Skill Bar + Counter Animation');
    console.log('  4. Hobby Tag Toggle + Ripple');
    console.log('  5. Contact Button Click Ripple');
    console.log('%c+ Bonus: Dark/Light Mode Toggle (navbar button)', 'color:#00e5ff;');
});