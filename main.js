// ==========================================================================
// Hussein Mohamed - Luxury Interactive UI & Motion Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Custom Smooth Luxury Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    let mouseX = -100, mouseY = -100;
    let circleX = -100, circleY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
    });

    function animateCursor() {
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        if (cursorCircle) {
            cursorCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Magnify effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .service-card, .video-card-luxury, .portrait-frame');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            if (cursorCircle) cursorCircle.classList.add('cursor-hover');
        });
        target.addEventListener('mouseleave', () => {
            if (cursorCircle) cursorCircle.classList.remove('cursor-hover');
        });
    });

    // 2. Reading Progress Bar & Header Shrink
    const progressBar = document.querySelector('.reading-progress-bar');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;

        if (window.scrollY > 40) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // 3. 3D Tilt Effect on Cards & Portrait
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

            // Spotlight shine position
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.22) 0%, transparent 65%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.background = 'transparent';
            }
        });
    });

    // 4. Scroll Reveal Observer with Staggering
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Animated Number Counters
    const statCounters = document.querySelectorAll('.counter-val');
    let countersStarted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                statCounters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const suffix = counter.getAttribute('data-suffix') || '';
                    let count = 0;
                    const duration = 1800; // ms
                    const increment = target / (duration / 25);

                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            counter.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(count) + suffix;
                        }
                    }, 25);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) statsObserver.observe(statsSection);

    // 6. Smooth anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
