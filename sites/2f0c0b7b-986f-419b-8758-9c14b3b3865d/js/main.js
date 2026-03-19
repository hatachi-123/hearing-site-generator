// Main JavaScript for おいしい酒場

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initScrollAnimations();
    initParallaxScrolling();
    initStickyScroll();
    initVideoHero();
    initNavigation();
    initSmoothScrolling();
    initImageLoading();
    initScrollProgress();
    initMobileMenu();
}

// Intersection Observer for Scroll Animations (TECH: Scroll-triggered Animation)
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-up elements
    const fadeUpElements = document.querySelectorAll('.fade-up');
    fadeUpElements.forEach(el => {
        observer.observe(el);
    });

    // Observe news items for slide animation
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(el => {
        observer.observe(el);
    });
}

// Parallax Scrolling Implementation (TECH:⑩)
function initParallaxScrolling() {
    const parallaxElements = document.querySelectorAll('.parallax-element');

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function updateParallax() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;

        parallaxElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const elementHeight = element.offsetHeight;

            // Calculate if element is in viewport
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                const yPos = -(scrollTop - elementTop) * 0.5; // Parallax speed
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Throttled scroll event
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

// Sticky Scroll Effects (TECH:④)
function initStickyScroll() {
    const stickySection = document.querySelector('.sticky-section');
    if (!stickySection) return;

    let ticking = false;

    function updateStickyEffects() {
        const scrollTop = window.pageYOffset;
        const rect = stickySection.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop;
        const sectionHeight = stickySection.offsetHeight;

        // Calculate scroll progress within the section
        const scrollProgress = Math.max(0, Math.min(1, (scrollTop - sectionTop) / sectionHeight));

        // Apply parallax effect to concept section background
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
            const yPos = scrollTop * 0.3;
            stickySection.style.backgroundPositionY = `${yPos}px`;
        }

        ticking = false;
    }

    function requestStickyUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateStickyEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestStickyUpdate, { passive: true });
}

// Video Hero Implementation (TECH:⑫)
function initVideoHero() {
    const video = document.querySelector('.hero-video video');
    if (!video) return;

    // Ensure video plays on mobile
    video.muted = true;
    video.playsInline = true;

    // Handle video load
    video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => {
            // Fallback to poster image if video fails
            console.log('Video autoplay failed:', e);
        });
    });

    // Pause video when not in viewport for performance
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.1 });

    videoObserver.observe(video);

    // Handle video errors
    video.addEventListener('error', (e) => {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundImage = `url('${video.poster}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    });
}

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    // Sticky navigation
    let lastScrollTop = 0;
    let ticking = false;

    function updateNavigation() {
        const scrollTop = window.pageYOffset;

        // Add/remove scrolled class
        if (scrollTop > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show navigation based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
        ticking = false;
    }

    function requestNavUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateNavigation);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestNavUpdate, { passive: true });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveNav() {
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Image lazy loading and fade-in effect
function initImageLoading() {
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loading');

                // Load image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }

                img.addEventListener('load', () => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                });

                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    let ticking = false;

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        ticking = false;
    }

    function requestProgressUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestProgressUpdate, { passive: true });
}

// Mobile menu functionality
function initMobileMenu() {
    // Add mobile menu toggle if needed
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');

    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    mobileMenuBtn.setAttribute('aria-label', 'メニューを開く');

    nav.querySelector('.nav-container').appendChild(mobileMenuBtn);

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        mobileMenuBtn.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Update aria-label
        const isOpen = navLinks.classList.contains('mobile-open');
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });

    // Close mobile menu when clicking on links
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
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

// Performance optimizations
function initPerformanceOptimizations() {
    // Preload critical resources
    const criticalImages = [
        'images/hero-poster.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
    });

    // Lazy load non-critical CSS
    const nonCriticalCSS = [];
    nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = function() { this.media = 'all'; };
        document.head.appendChild(link);
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Resize handler
window.addEventListener('resize', debounce(() => {
    // Recalculate parallax elements on resize
    const parallaxElements = document.querySelectorAll('.parallax-element');
    parallaxElements.forEach(el => {
        el.style.transform = 'translate3d(0, 0, 0)';
    });
}, 250));

// Initialize performance optimizations
initPerformanceOptimizations();