// Main JavaScript for Habuchi Minpaku Website
(function() {
    'use strict';

    // DOM Elements
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const heroVideo = document.querySelector('.hero-video');
    const roomsContainer = document.querySelector('.rooms-sticky-container');
    const roomImages = document.querySelectorAll('.room-image');
    const roomDetails = document.querySelectorAll('.room-details');
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right, .animate-scale');

    // Initialize all functions
    function init() {
        initHeader();
        initMobileMenu();
        initStickyRooms();
        initParallax();
        initScrollAnimations();
        initSmoothScroll();
        initVideoControl();
        initLanguageSwitcher();
        initFormEnhancements();
    }

    // Header scroll effect
    function initHeader() {
        let lastScrollY = window.scrollY;

        function updateHeader() {
            const currentScrollY = window.scrollY;

            // Add background when scrolled
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        }

        window.addEventListener('scroll', throttle(updateHeader, 16));
    }

    // Mobile menu toggle
    function initMobileMenu() {
        if (!mobileMenuBtn || !navLinks) return;

        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking on nav link
        const navLinkItems = navLinks.querySelectorAll('.nav-link');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Sticky Rooms Section with Image Switching
    function initStickyRooms() {
        if (!roomsContainer) return;

        const roomDetailsArray = Array.from(roomDetails);
        const roomImagesArray = Array.from(roomImages);
        let currentRoom = 0;

        // Set initial state
        setActiveRoom('living');

        function setActiveRoom(roomType) {
            // Update images
            roomImagesArray.forEach(img => {
                img.classList.remove('active');
                if (img.dataset.room === roomType) {
                    img.classList.add('active');
                }
            });

            // Update details
            roomDetailsArray.forEach(detail => {
                detail.classList.remove('active');
                if (detail.dataset.room === roomType) {
                    detail.classList.add('active');
                }
            });
        }

        // Intersection Observer for room sections
        const roomObserverOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.5
        };

        const roomObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const roomType = entry.target.dataset.room;
                    if (roomType) {
                        setActiveRoom(roomType);
                    }
                }
            });
        }, roomObserverOptions);

        // Observe room detail sections
        roomDetailsArray.forEach(room => {
            roomObserver.observe(room);
        });

        // Auto-cycling for demonstration (optional)
        let autoPlayInterval;
        const roomTypes = ['living', 'bedroom', 'kitchen', 'bathroom'];

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                currentRoom = (currentRoom + 1) % roomTypes.length;
                setActiveRoom(roomTypes[currentRoom]);
            }, 4000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Start auto-play when not in view, stop when in view
        const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stopAutoPlay();
                } else {
                    // startAutoPlay(); // Uncomment if you want auto-play
                }
            });
        });

        containerObserver.observe(roomsContainer);
    }

    // Parallax Effects
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element, .hero-video-container');

        function updateParallax() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;

            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const speed = element.dataset.speed || 0.5;

                if (rect.bottom >= 0 && rect.top <= windowHeight) {
                    const yPos = -(scrollTop * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
        }

        window.addEventListener('scroll', throttle(updateParallax, 16));
    }

    // Scroll Animations with Intersection Observer
    function initScrollAnimations() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // Unobserve after animation to improve performance
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animated elements
        animatedElements.forEach(element => {
            element.classList.add('animate-on-scroll');
            animationObserver.observe(element);
        });

        // Special handling for staggered animations
        const staggeredGroups = document.querySelectorAll('.concept-grid, .plans-grid, .reviews-grid');
        staggeredGroups.forEach(group => {
            const items = group.children;
            Array.from(items).forEach((item, index) => {
                item.style.animationDelay = `${index * 0.2}s`;
            });
        });
    }

    // Smooth scrolling for anchor links
    function initSmoothScroll() {
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Video control and optimization
    function initVideoControl() {
        if (!heroVideo) return;

        // Pause video when not in view to save bandwidth
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(e => {
                        // Video autoplay failed, which is fine
                    });
                } else {
                    heroVideo.pause();
                }
            });
        });

        videoObserver.observe(heroVideo);

        // Reduce video quality on mobile
        if (window.innerWidth <= 768) {
            heroVideo.style.filter = 'brightness(0.8)';
        }
    }

    // Language switcher
    function initLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');

        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lang = this.dataset.lang;

                // Remove active state from all buttons
                langButtons.forEach(btn => btn.classList.remove('active'));

                // Add active state to clicked button
                this.classList.add('active');

                // Here you would implement actual language switching
                // For now, just show a message
                showToast(`言語を${lang === 'en' ? '英語' : '中国語'}に切り替えました`);
            });
        });
    }

    // Form enhancements
    function initFormEnhancements() {
        const form = document.querySelector('.contact-form');
        const submitButton = document.querySelector('.form-submit');

        if (!form || !submitButton) return;

        // Form validation
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });

        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();

            // Remove existing error
            field.classList.remove('error');
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Check if required field is empty
            if (field.hasAttribute('required') && !value) {
                showFieldError(field, 'この項目は必須です');
                return false;
            }

            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(field, '正しいメールアドレスを入力してください');
                    return false;
                }
            }

            // Phone validation (basic)
            if (field.type === 'tel' && value) {
                const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/;
                if (!phoneRegex.test(value)) {
                    showFieldError(field, '正しい電話番号を入力してください');
                    return false;
                }
            }

            return true;
        }

        function showFieldError(field, message) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }

        function clearError(e) {
            const field = e.target;
            field.classList.remove('error');
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField({ target: input })) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showToast('入力内容を確認してください', 'error');
                return;
            }

            // Show loading state
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loading-spinner"></div>送信中...';

            // Simulate form submission (replace with actual submission)
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                showToast('お問い合わせを送信いたしました。24時間以内にご連絡いたします。', 'success');
                form.reset();
            }, 2000);
        });
    }

    // Utility Functions
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;

        return function(...args) {
            const currentTime = Date.now();

            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;

        // Add toast styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : 'var(--color-main)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));

        // Auto remove after 5 seconds
        setTimeout(() => removeToast(toast), 5000);

        function removeToast(toastElement) {
            toastElement.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toastElement.parentNode) {
                    toastElement.parentNode.removeChild(toastElement);
                }
            }, 300);
        }
    }

    // Performance optimizations
    function optimizePerformance() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // Preload critical resources
        const criticalImages = [
            'images/hero-bg.jpg',
            'images/living-room.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Handle resize events
    function handleResize() {
        const handleResizeThrottled = throttle(() => {
            // Recalculate positions for sticky elements
            if (window.innerWidth !== window.lastWidth) {
                window.lastWidth = window.innerWidth;

                // Re-initialize features that depend on viewport size
                initParallax();
            }
        }, 250);

        window.addEventListener('resize', handleResizeThrottled);
    }

    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Initialize performance optimizations
    optimizePerformance();
    handleResize();

    // Store current width for resize detection
    window.lastWidth = window.innerWidth;

    // Expose some functions globally for debugging
    window.HabuchiMinpaku = {
        init: init,
        showToast: showToast
    };

})();