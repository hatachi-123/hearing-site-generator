// Contact.js - フォーム処理専用ファイル
// CLAUDE.md 共通ルール準拠 - console.log禁止

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // Contact Form Configuration
    // ========================================
    const contactForm = document.querySelector('.contact-form');
    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        plan: document.getElementById('plan'),
        checkin: document.getElementById('checkin'),
        guests: document.getElementById('guests'),
        message: document.getElementById('message')
    };

    // ========================================
    // Form Validation Rules
    // ========================================
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[^\d<>{}]*$/,
            errorMessage: 'お名前は2文字以上で入力してください'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: '有効なメールアドレスを入力してください'
        },
        phone: {
            required: false,
            pattern: /^[\d\-\(\)\+\s]*$/,
            errorMessage: '有効な電話番号を入力してください'
        },
        plan: {
            required: false
        },
        checkin: {
            required: false,
            validate: function(value) {
                if (value) {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate >= today;
                }
                return true;
            },
            errorMessage: '本日以降の日付を選択してください'
        },
        guests: {
            required: false
        },
        message: {
            required: false,
            maxLength: 1000,
            errorMessage: 'メッセージは1000文字以内で入力してください'
        }
    };

    // ========================================
    // Real-time Validation
    // ========================================
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        const field = formFields[fieldName];

        if (!rules || !field) return true;

        // Clear previous errors
        clearFieldError(field);

        // Required field validation
        if (rules.required && (!value || value.trim() === '')) {
            showFieldError(field, `${getFieldLabel(fieldName)}は必須項目です`);
            return false;
        }

        // Skip further validation if field is empty and not required
        if (!value || value.trim() === '') {
            return true;
        }

        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(field, rules.errorMessage);
            return false;
        }

        // Max length validation
        if (rules.maxLength && value.length > rules.maxLength) {
            showFieldError(field, rules.errorMessage);
            return false;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(field, rules.errorMessage);
            return false;
        }

        // Custom validation
        if (rules.validate && !rules.validate(value)) {
            showFieldError(field, rules.errorMessage);
            return false;
        }

        return true;
    }

    function showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';

        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #e74c3c;
                font-size: 0.8rem;
                margin-top: 4px;
                display: block;
            `;
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearFieldError(field) {
        field.style.borderColor = 'rgba(26, 26, 26, 0.2)';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function getFieldLabel(fieldName) {
        const labels = {
            name: 'お名前',
            email: 'メールアドレス',
            phone: '電話番号',
            plan: 'プラン',
            checkin: 'チェックイン日',
            guests: '宿泊人数',
            message: 'メッセージ'
        };
        return labels[fieldName] || fieldName;
    }

    // ========================================
    // Form Field Event Listeners
    // ========================================
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        if (field) {
            // Real-time validation on blur
            field.addEventListener('blur', function() {
                validateField(fieldName, this.value);
            });

            // Clear error on focus
            field.addEventListener('focus', function() {
                clearFieldError(this);
            });

            // Special handling for specific fields
            if (fieldName === 'email') {
                field.addEventListener('input', debounce(function() {
                    validateField(fieldName, this.value);
                }, 500));
            }

            if (fieldName === 'phone') {
                field.addEventListener('input', function() {
                    // Format phone number as user types
                    let value = this.value.replace(/\D/g, '');
                    if (value.length > 0) {
                        if (value.length <= 3) {
                            value = value;
                        } else if (value.length <= 7) {
                            value = value.slice(0, 3) + '-' + value.slice(3);
                        } else {
                            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
                        }
                    }
                    this.value = value;
                });
            }
        }
    });

    // ========================================
    // Form Submission
    // ========================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            const formData = new FormData();

            Object.keys(formFields).forEach(fieldName => {
                const field = formFields[fieldName];
                if (field) {
                    const value = field.value;
                    if (!validateField(fieldName, value)) {
                        isValid = false;
                    }
                    formData.append(fieldName, value);
                }
            });

            if (!isValid) {
                showFormMessage('入力内容を確認してください', 'error');
                return;
            }

            submitForm(formData);
        });
    }

    function submitForm(formData) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Update button state
        submitBtn.textContent = '送信中...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Add timestamp and additional data
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', '羽淵民泊ウェブサイト');
        formData.append('user_agent', navigator.userAgent);

        // Submit to Formspree (replace with your actual form ID)
        fetch('https://formspree.io/f/your-form-id', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showFormMessage('お問い合わせを受け付けました。24時間以内にご連絡いたします。', 'success');
                contactForm.reset();
                clearAllErrors();

                // Track form submission (if analytics is implemented)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'Contact',
                        'event_label': 'Reservation Inquiry'
                    });
                }
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            showFormMessage('送信に失敗しました。お電話またはWhatsAppでお問い合わせください。', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        });
    }

    function showFormMessage(message, type) {
        let messageElement = document.querySelector('.form-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            contactForm.insertBefore(messageElement, contactForm.querySelector('.form-submit'));
        }

        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;

        const styles = {
            success: {
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                color: '#2e7d32',
                border: '1px solid rgba(46, 125, 50, 0.3)'
            },
            error: {
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                color: '#e74c3c',
                border: '1px solid rgba(231, 76, 60, 0.3)'
            }
        };

        Object.assign(messageElement.style, {
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            marginBottom: '20px',
            fontSize: '0.9rem',
            textAlign: 'center',
            ...styles[type]
        });

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement) {
                    messageElement.style.opacity = '0';
                    setTimeout(() => {
                        if (messageElement && messageElement.parentNode) {
                            messageElement.parentNode.removeChild(messageElement);
                        }
                    }, 300);
                }
            }, 5000);
        }
    }

    function clearAllErrors() {
        Object.values(formFields).forEach(field => {
            if (field) {
                clearFieldError(field);
            }
        });
    }

    // ========================================
    // Quick Contact Actions
    // ========================================
    function initializeQuickContact() {
        // WhatsApp quick contact
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const plan = formFields.plan?.value;
                const checkin = formFields.checkin?.value;

                if (plan || checkin) {
                    const message = encodeURIComponent(
                        `羽淵民泊の件でお問い合わせです。` +
                        (plan ? `\nご希望プラン: ${plan}` : '') +
                        (checkin ? `\nチェックイン予定日: ${checkin}` : '') +
                        `\n詳細について相談させてください。`
                    );

                    const url = new URL(this.href);
                    url.searchParams.set('text', decodeURIComponent(message));
                    this.href = url.toString();
                }

                // Track WhatsApp click
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'WhatsApp'
                    });
                }
            });
        });

        // Phone call tracking
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Phone Call'
                    });
                }
            });
        });
    }

    initializeQuickContact();

    // ========================================
    // Calendar Integration (if needed)
    // ========================================
    function initializeDatePicker() {
        const checkinField = formFields.checkin;
        if (checkinField) {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            checkinField.setAttribute('min', today);

            // Set maximum date to 1 year from now
            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 1);
            checkinField.setAttribute('max', maxDate.toISOString().split('T')[0]);
        }
    }

    initializeDatePicker();

    // ========================================
    // Utility Functions
    // ========================================
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
    // Form Auto-save (Optional)
    // ========================================
    function initializeAutoSave() {
        const STORAGE_KEY = 'habuchi_minpaku_form_data';

        // Load saved data on page load
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    if (formFields[key] && data[key]) {
                        formFields[key].value = data[key];
                    }
                });
            }
        } catch (error) {
            // Ignore localStorage errors
        }

        // Save data on input change
        Object.values(formFields).forEach(field => {
            if (field) {
                field.addEventListener('input', debounce(function() {
                    const formData = {};
                    Object.keys(formFields).forEach(key => {
                        if (formFields[key]) {
                            formData[key] = formFields[key].value;
                        }
                    });

                    try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
                    } catch (error) {
                        // Ignore localStorage errors
                    }
                }, 1000));
            }
        });

        // Clear saved data on successful submission
        if (contactForm) {
            contactForm.addEventListener('submit', function() {
                try {
                    localStorage.removeItem(STORAGE_KEY);
                } catch (error) {
                    // Ignore localStorage errors
                }
            });
        }
    }

    // Uncomment the line below to enable auto-save functionality
    // initializeAutoSave();
});