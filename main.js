// ==========================================================================
// Hussein Mohamed - Luxury Interactive Engine & Accessible Video Modal
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Drawer Navigation
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta a');

    function toggleMobileMenu(forceState) {
        const isOpen = typeof forceState === 'boolean' ? forceState : !mobileNav.classList.contains('open');
        mobileToggle?.classList.toggle('open', isOpen);
        mobileNav?.classList.toggle('open', isOpen);
        mobileToggle?.setAttribute('aria-expanded', isOpen.toString());
        mobileNav?.setAttribute('aria-hidden', (!isOpen).toString());
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    mobileToggle?.addEventListener('click', () => toggleMobileMenu());

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // 2. Reading Progress Bar & Header Scroll State
    const progressBar = document.querySelector('.reading-progress-bar');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
        if (progressBar) progressBar.style.width = `${progress}%`;

        if (window.scrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }, { passive: true });

    // 3. Smooth Non-Disruptive Luxury Cursor (Pointer devices only)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && cursorDot && cursorCircle) {
        let mouseX = -100, mouseY = -100;
        let circleX = -100, circleY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }, { passive: true });

        function renderCursor() {
            circleX += (mouseX - circleX) * 0.18;
            circleY += (mouseY - circleY) * 0.18;
            cursorCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;
            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        const interactiveTargets = document.querySelectorAll('a, button, [data-tilt], .btn-play-trigger');
        interactiveTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorCircle.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorCircle.classList.remove('cursor-hover'));
        });
    }

    // 4. Subtle 3D Tilt Effect on Desktop
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const tiltCards = document.querySelectorAll('[data-tilt]');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

                const shine = card.querySelector('.card-shine');
                if (shine) {
                    shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.15) 0%, transparent 60%)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                const shine = card.querySelector('.card-shine');
                if (shine) shine.style.background = '';
            });
        });
    }

    // 5. Scroll Reveal Observer
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }

    // 6. Accessible On-Demand Video Modal Engine
    const videoModal = document.getElementById('videoModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalIframe = document.getElementById('modalIframe');
    const modalTitle = document.getElementById('modalVideoTitle');
    const modalBadge = document.getElementById('modalVideoBadge');
    const modalDirectLink = document.getElementById('modalDirectLink');
    const modalFallbackLink = document.getElementById('modalFallbackLink');
    const modalContainer = document.getElementById('modalPlayerContainer');
    const modalDialog = videoModal?.querySelector('.video-modal-dialog');
    const modalSpinner = document.getElementById('modalSpinner');

    let previousActiveElement = null;

    function openVideoModal(triggerBtn) {
        if (!videoModal || !modalIframe) return;

        previousActiveElement = triggerBtn || document.activeElement;

        const videoId = triggerBtn.getAttribute('data-video-id');
        const title = triggerBtn.getAttribute('data-video-title') || 'Featured Project';
        const category = triggerBtn.getAttribute('data-video-category') || 'Video Showcase';
        const aspect = triggerBtn.getAttribute('data-video-aspect') || 'landscape';
        const previewUrl = `https://drive.google.com/file/d/${videoId}/preview`;
        const directViewUrl = `https://drive.google.com/file/d/${videoId}/view`;

        // Update Modal Metadata
        if (modalTitle) modalTitle.textContent = title;
        if (modalBadge) modalBadge.textContent = category;
        if (modalDirectLink) modalDirectLink.href = directViewUrl;
        if (modalFallbackLink) modalFallbackLink.href = directViewUrl;

        // Toggle Landscape vs 9:16 Vertical Reel Mode
        if (aspect === 'vertical') {
            modalContainer?.classList.remove('landscape-mode');
            modalContainer?.classList.add('vertical-mode');
            modalDialog?.classList.add('vertical-dialog');
        } else {
            modalContainer?.classList.remove('vertical-mode');
            modalContainer?.classList.add('landscape-mode');
            modalDialog?.classList.remove('vertical-dialog');
        }

        // Show Spinner until load
        if (modalSpinner) modalSpinner.style.display = 'flex';

        modalIframe.onload = () => {
            if (modalSpinner) modalSpinner.style.display = 'none';
        };

        // Load iframe only on demand
        modalIframe.src = previewUrl;

        // Open modal
        videoModal.classList.add('active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus close button for accessible keyboard nav
        setTimeout(() => {
            modalCloseBtn?.focus();
        }, 100);
    }

    function closeVideoModal() {
        if (!videoModal || !modalIframe) return;

        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Stop video playback immediately
        modalIframe.src = 'about:blank';

        // Return focus to triggering button
        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        }
    }

    // Attach trigger clicks to all play buttons
    document.querySelectorAll('.btn-play-trigger, .btn-play-trigger-circle, .btn-card-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openVideoModal(btn);
        });
    });

    modalCloseBtn?.addEventListener('click', closeVideoModal);
    modalBackdrop?.addEventListener('click', closeVideoModal);

    // Escape Key Listener to dismiss modal & mobile menu
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (videoModal?.classList.contains('active')) {
                closeVideoModal();
            } else if (mobileNav?.classList.contains('open')) {
                toggleMobileMenu(false);
            }
        }
    });

    // 7. Accessible Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
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
