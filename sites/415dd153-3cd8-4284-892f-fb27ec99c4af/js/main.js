document.addEventListener('DOMContentLoaded', function() {

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // Intersection Observer for scroll animations
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

    // Observe all animate-on-scroll elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Header scroll behavior
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.style.background = 'rgba(248, 246, 243, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(248, 246, 243, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScrollY = currentScrollY;
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Phone number click to call
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add small vibration on mobile devices
            if ('vibrate' in navigator) {
                navigator.vibrate(100);
            }
        });
    });

    // FAQ Accordion (for FAQ page)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');

                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });

                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // Service cards hover effect enhancement
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Loading animation for buttons with data-loading attribute
    const loadingButtons = document.querySelectorAll('[data-loading]');
    loadingButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');

                // Remove loading state after specified time or default 3 seconds
                const loadingTime = parseInt(this.dataset.loading) || 3000;
                setTimeout(() => {
                    this.classList.remove('loading');
                }, loadingTime);
            }
        });
    });

    // Testimonial slider (if multiple testimonials exist)
    const testimonialContainer = document.querySelector('.testimonials-container');
    if (testimonialContainer) {
        const testimonials = testimonialContainer.querySelectorAll('.testimonial-card');
        let currentTestimonial = 0;

        if (testimonials.length > 1) {
            // Auto-rotate testimonials every 8 seconds
            setInterval(() => {
                testimonials[currentTestimonial].style.opacity = '0';
                testimonials[currentTestimonial].style.transform = 'translateX(-20px)';

                currentTestimonial = (currentTestimonial + 1) % testimonials.length;

                setTimeout(() => {
                    testimonials.forEach((testimonial, index) => {
                        testimonial.style.display = index === currentTestimonial ? 'block' : 'none';
                    });

                    testimonials[currentTestimonial].style.opacity = '1';
                    testimonials[currentTestimonial].style.transform = 'translateX(0)';
                }, 300);
            }, 8000);
        }
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Contact method selection enhancement
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            contactMethods.forEach(m => m.classList.remove('active'));
            // Add active class to clicked method
            this.classList.add('active');

            // Update form based on selected method
            const methodType = this.dataset.method;
            const contactForm = document.querySelector('#contact-form');

            if (contactForm && methodType) {
                const preferredMethodInput = contactForm.querySelector('[name="preferred_method"]');
                if (preferredMethodInput) {
                    preferredMethodInput.value = methodType;
                }
            }
        });
    });

    // Add pulse animation to important CTAs
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.classList.add('pulse-on-hover');
    });

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalNumber = parseInt(stat.textContent);
                let currentNumber = 0;
                const increment = finalNumber / 50;

                const counter = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= finalNumber) {
                        stat.textContent = finalNumber + (stat.textContent.includes('年') ? '年' : '');
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(currentNumber) + (stat.textContent.includes('年') ? '年' : '');
                    }
                }, 40);

                statsObserver.unobserve(stat);
            }
        });
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

});