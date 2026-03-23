// Main JavaScript for Office Habuchi Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initScrollAnimations();
    initParallax();
    initMenuTabs();
    initBeforeAfterSlider();
    initScrollProgress();
    initSmoothScroll();
    initHeroVideoFallback();

    // Load hero content with staggered animation
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-content .animate-fadeInUp');
        heroElements.forEach(element => {
            element.classList.add('animated');
        });
    }, 500);
});

// Scroll-triggered Animations using Intersection Observer API (TECH: ①)
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Special handling for section titles
                if (entry.target.classList.contains('section-title')) {
                    entry.target.classList.add('animated');
                }

                // Special handling for reason cards with number animation
                if (entry.target.classList.contains('reason-card')) {
                    entry.target.classList.add('animated');
                }

                // Disconnect after animation (once: true equivalent)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-fadeInUp');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Also observe section titles for underline animation
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        observer.observe(title);
    });
}

// Parallax Scrolling Effect (TECH: ⑩)
function initParallax() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const parallaxElements = document.querySelectorAll('.parallax-element');
    const heroVideo = document.querySelector('.hero-video');
    const heroContent = document.querySelector('.hero-content');

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Hero parallax effect
        if (heroVideo && scrolled < window.innerHeight) {
            heroVideo.style.transform = `translate3d(0, ${rate}px, 0)`;
        }

        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translate3d(0, ${rate * 0.3}px, 0)`;
        }

        // Other parallax elements
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    // Throttle scroll event for better performance
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
        ticking = false;
    });
}

// Menu Tabs Functionality
function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const contents = document.querySelectorAll('.menu-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');

                // Trigger animation for menu items
                const menuItems = targetContent.querySelectorAll('.menu-item');
                menuItems.forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.classList.add('menu-item-animate');
                });
            }
        });
    });
}

// Before/After Slider
function initBeforeAfterSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.ba-slide');
    const dots = document.querySelectorAll('.ba-dot');
    const prevBtn = document.querySelector('.ba-prev');
    const nextBtn = document.querySelector('.ba-next');

    if (!slides.length) return;

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Scroll Progress Indicator
function initScrollProgress() {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.classList.add('scroll-progress');
        document.body.appendChild(progressBar);
    }

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);
}

// Smooth Scroll for Navigation Links
function initSmoothScroll() {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                e.preventDefault();

                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero Video Fallback (TECH: ⑫)
function initHeroVideoFallback() {
    const video = document.querySelector('.hero-video-element');
    const heroSection = document.querySelector('.hero');

    if (!video) return;

    // Handle video load errors
    video.addEventListener('error', function() {
        console.log('Video failed to load, using background image fallback');
        heroSection.style.background = `
            linear-gradient(135deg, rgba(232,244,253,0.8) 0%, rgba(250,250,250,0.6) 100%),
            url('images/hero-poster.jpg') center/cover no-repeat
        `;
        video.style.display = 'none';
    });

    // Ensure video is muted for autoplay
    video.muted = true;

    // Handle video loaded
    video.addEventListener('loadeddata', function() {
        video.style.opacity = '1';
    });

    // Pause video when not in viewport for performance
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(e => {
                    console.log('Video autoplay failed:', e);
                    // Use poster image as fallback
                    heroSection.style.background = `
                        linear-gradient(135deg, rgba(232,244,253,0.8) 0%, rgba(250,250,250,0.6) 100%),
                        url('images/hero-poster.jpg') center/cover no-repeat
                    `;
                });
            } else {
                video.pause();
            }
        });
    });

    videoObserver.observe(video);
}

// Utility Functions

// Throttle function for performance optimization
function throttle(func, wait) {
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

// Debounce function for performance optimization
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Micro Animations (TECH: ⑨)
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn, .method-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Card hover effects
    const cards = document.querySelectorAll('.problem-card, .reason-card, .menu-item, .staff-card, .review-card, .reservation-method');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Form input focus effects
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Star rating hover effect
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
        const stars = card.querySelectorAll('.review-stars svg');
        card.addEventListener('mouseenter', function() {
            stars.forEach((star, index) => {
                setTimeout(() => {
                    star.style.transform = 'scale(1.1)';
                }, index * 50);
            });
        });

        card.addEventListener('mouseleave', function() {
            stars.forEach(star => {
                star.style.transform = 'scale(1)';
            });
        });
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
});

// Error handling for missing images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create a placeholder div with the same aspect ratio
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = `
                width: 100%;
                height: 200px;
                background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                           linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                           linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                           linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
                background-size: 20px 20px;
                background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 14px;
                border-radius: var(--radius);
            `;
            placeholder.textContent = '画像を読み込み中...';

            // Replace the broken image with placeholder
            this.parentNode.replaceChild(placeholder, this);
        });
    });
});