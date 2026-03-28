// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(el => observer.observe(el));

    // Seasonal Products Tab Functionality
    const seasonalButtons = document.querySelectorAll('.seasonal-btn');
    const seasonalPanels = document.querySelectorAll('.seasonal-panel');

    seasonalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const season = button.getAttribute('data-season');

            // Remove active class from all buttons and panels
            seasonalButtons.forEach(btn => btn.classList.remove('active'));
            seasonalPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(season).classList.add('active');
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function updateHeader() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.style.background = 'rgba(254, 254, 254, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(254, 254, 254, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = 'none';
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', updateHeader, { passive: true });

    // Smooth Scrolling for Internal Links
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Phone Link Click Tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Add click animation
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Button Ripple Effect
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Lazy Loading for Images
    const images = document.querySelectorAll('img[src*="images/"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Create placeholder if image fails to load
                img.addEventListener('error', () => {
                    img.src = createPlaceholder(img.alt);
                });

                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Create placeholder for missing images
    function createPlaceholder(altText) {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, 400, 300);

        // Text
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(altText || '画像', 200, 150);

        return canvas.toDataURL();
    }

    // Gallery Image Click Effect
    const galleryImages = document.querySelectorAll('.gallery-image');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            // Simple zoom effect
            img.style.transform = 'scale(1.05)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Product Card Hover Sound Effect (Optional - commented out)
    /*
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Could add subtle sound effect here
            card.style.transition = 'all 0.3s ease';
        });
    });
    */

    // Scroll Progress Indicator
    const createScrollIndicator = () => {
        const indicator = document.createElement('div');
        indicator.style.position = 'fixed';
        indicator.style.top = '0';
        indicator.style.left = '0';
        indicator.style.width = '0%';
        indicator.style.height = '3px';
        indicator.style.background = 'linear-gradient(90deg, var(--color-main), var(--color-accent))';
        indicator.style.zIndex = '9999';
        indicator.style.transition = 'width 0.1s ease';
        document.body.appendChild(indicator);

        return indicator;
    };

    const scrollIndicator = createScrollIndicator();

    const updateScrollIndicator = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollIndicator.style.width = `${scrollPercent}%`;
    };

    window.addEventListener('scroll', updateScrollIndicator, { passive: true });

    // Seasonal Products Auto-cycle (Optional)
    let currentSeasonIndex = 0;
    const seasons = ['spring', 'summer', 'autumn', 'winter'];

    const cycleSeasons = () => {
        currentSeasonIndex = (currentSeasonIndex + 1) % seasons.length;
        const button = document.querySelector(`[data-season="${seasons[currentSeasonIndex]}"]`);
        if (button && !document.querySelector('.seasonal:hover')) {
            button.click();
        }
    };

    // Auto-cycle every 8 seconds (only if user is not interacting)
    let seasonCycleInterval = setInterval(cycleSeasons, 8000);

    // Pause auto-cycle on user interaction
    const seasonalSection = document.querySelector('.seasonal');
    if (seasonalSection) {
        seasonalSection.addEventListener('mouseenter', () => {
            clearInterval(seasonCycleInterval);
        });

        seasonalSection.addEventListener('mouseleave', () => {
            seasonCycleInterval = setInterval(cycleSeasons, 8000);
        });
    }

    // Contact Form Enhancements
    const form = document.querySelector('.contact-form');
    if (form) {
        const submitButton = form.querySelector('.form-submit');

        form.addEventListener('submit', (e) => {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';

            // Note: Form will be handled by Formspree
            setTimeout(() => {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.textContent = '送信する';
            }, 2000);
        });
    }

    // Performance: Reduce animations on slower devices
    const isSlowDevice = navigator.hardwareConcurrency < 4 || navigator.connection?.effectiveType === 'slow-2g';

    if (isSlowDevice) {
        document.body.classList.add('reduced-motion');
        // Clear intensive animations
        clearInterval(seasonCycleInterval);
    }

    // Accessibility: Focus management
    const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Skip to main content
    const createSkipLink = () => {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'メインコンテンツへスキップ';
        skipLink.style.position = 'absolute';
        skipLink.style.top = '-40px';
        skipLink.style.left = '10px';
        skipLink.style.background = 'var(--color-main)';
        skipLink.style.color = 'white';
        skipLink.style.padding = '8px';
        skipLink.style.textDecoration = 'none';
        skipLink.style.zIndex = '10000';
        skipLink.style.transition = 'top 0.3s ease';

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '10px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    };

    createSkipLink();

    // Add main id to main element if not present
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }

    // Console message for developers
    console.log('🥬 まるもり青果店 ウェブサイトが正常に読み込まれました');
    console.log('新鮮な野菜と果物をお楽しみください！');
});