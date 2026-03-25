// Main.js - CLAUDE.md 共通ルール準拠
// Intersection Observer API使用、console.log禁止

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // Intersection Observer for Scroll Animations
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale');
    fadeElements.forEach(el => observer.observe(el));

    // ========================================
    // Navigation Menu Toggle (Mobile)
    // ========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ========================================
    // Header Scroll Effect
    // ========================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide header on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // ========================================
    // Reviews Slider
    // ========================================
    const reviewItems = document.querySelectorAll('.review-item');
    const prevBtn = document.querySelector('.review-prev');
    const nextBtn = document.querySelector('.review-next');
    const dots = document.querySelectorAll('.dot');

    let currentReview = 0;
    const totalReviews = reviewItems.length;

    function showReview(index) {
        reviewItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextReview() {
        currentReview = (currentReview + 1) % totalReviews;
        showReview(currentReview);
    }

    function prevReview() {
        currentReview = (currentReview - 1 + totalReviews) % totalReviews;
        showReview(currentReview);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextReview);
        prevBtn.addEventListener('click', prevReview);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentReview = index;
            showReview(currentReview);
        });
    });

    // Auto-slide reviews (every 5 seconds)
    setInterval(nextReview, 5000);

    // ========================================
    // Smooth Scrolling for Anchor Links
    // ========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Hero Parallax Effect
    // ========================================
    const heroBackground = document.querySelector('.hero-background img');

    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            if (scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // ========================================
    // Plan Card Hover Effects
    // ========================================
    const planCards = document.querySelectorAll('.plan-card');

    planCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            } else {
                this.style.transform = 'translateY(0) scale(1.05)';
            }
        });
    });

    // ========================================
    // Room Item Hover Effects
    // ========================================
    const roomItems = document.querySelectorAll('.room-item');

    roomItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ========================================
    // Loading Animation for Images
    // ========================================
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.transition = 'opacity 0.3s ease';
                this.style.opacity = '1';
            });
        }
    });

    // ========================================
    // Contact Form Enhancement
    // ========================================
    const contactForm = document.querySelector('.contact-form');
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

    if (contactForm) {
        // Form validation visual feedback
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentNode.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentNode.classList.remove('focused');
                }

                // Basic validation
                if (this.hasAttribute('required') && this.value.trim() === '') {
                    this.style.borderColor = '#e74c3c';
                } else if (this.type === 'email' && this.value !== '' && !isValidEmail(this.value)) {
                    this.style.borderColor = '#e74c3c';
                } else {
                    this.style.borderColor = 'rgba(26, 26, 26, 0.2)';
                }
            });
        });

        // Form submission (basic setup for Formspree)
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;

            // Simulate form submission delay
            setTimeout(() => {
                submitBtn.textContent = '送信完了';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }

    // ========================================
    // Language Switcher
    // ========================================
    const langBtns = document.querySelectorAll('.lang-btn');

    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Here you would implement actual language switching
            // For now, it's just visual feedback
        });
    });

    // ========================================
    // Scroll Progress Indicator
    // ========================================
    function createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--color-main);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(indicator);

        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            indicator.style.width = scrolled + '%';
        });
    }

    createScrollIndicator();

    // ========================================
    // Utility Functions
    // ========================================
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ========================================
    // Performance Optimization
    // ========================================
    // Lazy loading for images (if Intersection Observer is supported)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ========================================
    // Touch Gestures for Mobile (Reviews Slider)
    // ========================================
    let touchStartX = 0;
    let touchEndX = 0;

    const reviewsSlider = document.querySelector('.reviews-slider');

    if (reviewsSlider) {
        reviewsSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        reviewsSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - next review
                    nextReview();
                } else {
                    // Swiped right - previous review
                    prevReview();
                }
            }
        }
    }

    // ========================================
    // Accessibility Enhancements
    // ========================================
    // Skip to main content link
    function createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'メインコンテンツへスキップ';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-main);
            color: var(--color-base);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });

        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });

        document.body.prepend(skipLink);
    }

    createSkipLink();

    // Focus management for modals and interactive elements
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // ========================================
    // Window Load Event
    // ========================================
    window.addEventListener('load', function() {
        // Remove loading states
        document.body.classList.add('loaded');

        // Initialize hero entrance animation
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('hero-entrance');
        }
    });
});