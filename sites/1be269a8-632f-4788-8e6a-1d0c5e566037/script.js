// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initFAQ();
    initContactForm();
    initScrollEffects();
    initSmoothScroll();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        if (header) {
            if (currentScrollY > 100) {
                header.style.background = 'rgba(254, 252, 249, 0.98)';
                header.style.boxShadow = '0 2px 10px rgba(93, 78, 55, 0.1)';
            } else {
                header.style.background = 'rgba(254, 252, 249, 0.95)';
                header.style.boxShadow = 'none';
            }
        }

        lastScrollY = currentScrollY;
    });
}

// FAQ Accordion functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        if (question && answer && toggle) {
            question.addEventListener('click', function() {
                const isActive = answer.classList.contains('active');

                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    if (otherAnswer && otherToggle && otherItem !== item) {
                        otherAnswer.classList.remove('active');
                        otherToggle.textContent = '+';
                        otherToggle.style.transform = 'rotate(0deg)';
                    }
                });

                // Toggle current FAQ item
                if (isActive) {
                    answer.classList.remove('active');
                    toggle.textContent = '+';
                    toggle.style.transform = 'rotate(0deg)';
                } else {
                    answer.classList.add('active');
                    toggle.textContent = '−';
                    toggle.style.transform = 'rotate(180deg)';
                }
            });
        }
    });
}

// Contact Form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                category: formData.get('category'),
                message: formData.get('message'),
                privacy: formData.get('privacy')
            };

            // Basic validation
            if (!validateForm(data)) {
                return;
            }

            // Show loading state
            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = '送信中...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                showSuccessMessage();
                form.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
}

// Form validation
function validateForm(data) {
    const errors = [];

    // Required fields validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('お名前を正しく入力してください（2文字以上）');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('有効なメールアドレスを入力してください');
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push('お問い合わせ内容を詳しく入力してください（10文字以上）');
    }

    if (!data.privacy) {
        errors.push('プライバシーポリシーに同意してください');
    }

    // Show errors if any
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }

    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'alert alert-success';
    message.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #C8D5A1; color: white; padding: 1rem 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999;">
            <strong>送信完了</strong><br>
            お問い合わせありがとうございます。担当者より24時間以内にご連絡いたします。
        </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(errors) {
    const message = document.createElement('div');
    message.className = 'alert alert-error';
    message.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; padding: 1rem 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999; white-space: pre-line;">
            <strong>入力エラー</strong><br>
            ${errors}
        </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .section-title,
        .problem-item,
        .service-item,
        .reason-item,
        .pricing-item,
        .case-item,
        .flow-step,
        .news-item
    `);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Smooth scroll functionality
function initSmoothScroll() {
    // Add smooth scrolling to all internal links
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions for CTA buttons
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = servicesSection.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-green);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    document.body.appendChild(backToTopButton);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', function() {
    initBackToTop();
});

// Loading animation
function initLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--warm-white);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s ease;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid var(--primary-beige);
                border-top: 3px solid var(--accent-green);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.appendChild(loader);

    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 500);
    });
}

// Initialize loading animation
initLoadingAnimation();

// Mobile menu styles
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--warm-white);
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            flex-direction: column;
            gap: 1rem;
            z-index: 999;
        }

        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
            display: flex;
        }

        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }

        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Add mobile menu styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Performance optimization - lazy loading images
function initLazyLoading() {
    const images = document.querySelectorAll('img[src*="placehold.co"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Add fade-in effect
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';

                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);

                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
});

// Form field focus effects
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('input, textarea, select');

    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('field-focused');
        });

        field.addEventListener('blur', function() {
            this.parentElement.classList.remove('field-focused');
            if (this.value) {
                this.parentElement.classList.add('field-filled');
            } else {
                this.parentElement.classList.remove('field-filled');
            }
        });
    });
});

// Add form field styles
const formFieldStyles = `
    .field-focused input,
    .field-focused textarea,
    .field-focused select {
        border-color: var(--accent-green);
        box-shadow: 0 0 0 3px rgba(200, 213, 161, 0.1);
    }

    .field-filled input,
    .field-filled textarea,
    .field-filled select {
        background: var(--primary-light);
    }
`;

const formStyleSheet = document.createElement('style');
formStyleSheet.textContent = formFieldStyles;
document.head.appendChild(formStyleSheet);

// Console welcome message
console.log(`
🌿 おーぷい法務事務所のウェブサイトへようこそ
   Website developed with care and attention to detail

   💚 若い女性の皆様をサポートします
   📞 お気軽にお問い合わせください: hatachi.keibu@gmail.com
`);

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Non-critical error occurred:', e.error);
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Skip to main content with keyboard
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const mainContent = document.querySelector('main') || document.querySelector('.hero');
        if (mainContent) {
            mainContent.focus();
        }
    }

    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Add skip link for accessibility
document.addEventListener('DOMContentLoaded', function() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'メインコンテンツにスキップ';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--accent-green);
        color: white;
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

    document.body.insertBefore(skipLink, document.body.firstChild);
});