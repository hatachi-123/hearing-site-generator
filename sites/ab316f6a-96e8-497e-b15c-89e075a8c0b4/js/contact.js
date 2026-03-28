// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {

    const form = document.querySelector('.contact-form');
    if (!form) return;

    const formInputs = form.querySelectorAll('input, select, textarea');
    const submitButton = form.querySelector('.form-submit');

    // Form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[^<>\"\'&]*$/,
            message: 'お名前は2文字以上で入力してください'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '正しいメールアドレスを入力してください'
        },
        phone: {
            required: false,
            pattern: /^[\d\-\(\)\s\+]+$/,
            message: '正しい電話番号を入力してください'
        },
        subject: {
            required: true,
            message: 'お問い合わせ種類を選択してください'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'メッセージは10文字以上1000文字以内で入力してください'
        }
    };

    // Create error message element
    function createErrorElement(inputElement) {
        const errorId = `error-${inputElement.name}`;
        let errorElement = document.getElementById(errorId);

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'form-error';
            errorElement.style.color = 'var(--color-accent)';
            errorElement.style.fontSize = '0.9rem';
            errorElement.style.marginTop = '0.5rem';
            errorElement.style.display = 'none';
            errorElement.setAttribute('aria-live', 'polite');

            inputElement.parentNode.appendChild(errorElement);
        }

        return errorElement;
    }

    // Validate individual field
    function validateField(input) {
        const rule = validationRules[input.name];
        if (!rule) return true;

        const value = input.value.trim();
        const errorElement = createErrorElement(input);

        // Clear previous error state
        input.style.borderColor = '#E0E0E0';
        errorElement.style.display = 'none';
        input.setAttribute('aria-invalid', 'false');

        // Required field check
        if (rule.required && !value) {
            showFieldError(input, errorElement, rule.message);
            return false;
        }

        // Skip other validations if field is empty and not required
        if (!value && !rule.required) return true;

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
            showFieldError(input, errorElement, rule.message);
            return false;
        }

        // Length validation
        if (rule.minLength && value.length < rule.minLength) {
            showFieldError(input, errorElement, rule.message);
            return false;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
            showFieldError(input, errorElement, rule.message);
            return false;
        }

        return true;
    }

    // Show field error
    function showFieldError(input, errorElement, message) {
        input.style.borderColor = 'var(--color-accent)';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
    }

    // Real-time validation
    formInputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => {
            validateField(input);
        });

        // Clear error on focus
        input.addEventListener('focus', () => {
            const errorElement = document.getElementById(`error-${input.name}`);
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            input.style.borderColor = 'var(--color-main)';
        });

        // Character counter for textarea
        if (input.tagName === 'TEXTAREA') {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.fontSize = '0.8rem';
            counter.style.color = '#666';
            counter.style.textAlign = 'right';
            counter.style.marginTop = '0.25rem';
            input.parentNode.appendChild(counter);

            const updateCounter = () => {
                const length = input.value.length;
                const maxLength = validationRules[input.name]?.maxLength || 1000;
                counter.textContent = `${length}/${maxLength}文字`;

                if (length > maxLength * 0.9) {
                    counter.style.color = 'var(--color-accent)';
                } else {
                    counter.style.color = '#666';
                }
            };

            input.addEventListener('input', updateCounter);
            updateCounter();
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Focus on first error field
            const firstError = form.querySelector('input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        const originalText = submitButton.textContent;
        submitButton.textContent = '送信中...';

        try {
            // Submit to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showSuccessMessage();
                form.reset();
                // Reset character counters
                const counters = form.querySelectorAll('.character-counter');
                counters.forEach(counter => {
                    counter.textContent = '0/1000文字';
                    counter.style.color = '#666';
                });
            } else {
                throw new Error('送信に失敗しました');
            }
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            submitButton.textContent = originalText;
        }
    });

    // Success message
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.innerHTML = `
            <div style="background: var(--color-main); color: white; padding: 1.5rem; border-radius: var(--radius); margin: 1rem 0; text-align: center;">
                <h4 style="margin-bottom: 0.5rem;">送信完了</h4>
                <p style="margin: 0;">お問い合わせありがとうございます。24時間以内にご返信いたします。</p>
            </div>
        `;

        form.insertBefore(message, form.firstChild);
        message.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove message after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Error message
    function showErrorMessage(errorText) {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.innerHTML = `
            <div style="background: var(--color-accent); color: white; padding: 1.5rem; border-radius: var(--radius); margin: 1rem 0; text-align: center;">
                <h4 style="margin-bottom: 0.5rem;">送信エラー</h4>
                <p style="margin: 0;">${errorText}。しばらく時間をおいて再度お試しください。</p>
            </div>
        `;

        form.insertBefore(message, form.firstChild);
        message.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove message after 7 seconds
        setTimeout(() => {
            message.remove();
        }, 7000);
    }

    // Auto-save form data to localStorage (optional)
    const autoSaveKey = 'marumori-contact-form';

    function saveFormData() {
        const formData = {};
        formInputs.forEach(input => {
            if (input.type !== 'submit') {
                formData[input.name] = input.value;
            }
        });
        localStorage.setItem(autoSaveKey, JSON.stringify(formData));
    }

    function loadFormData() {
        try {
            const savedData = localStorage.getItem(autoSaveKey);
            if (savedData) {
                const formData = JSON.parse(savedData);
                formInputs.forEach(input => {
                    if (formData[input.name] && input.type !== 'submit') {
                        input.value = formData[input.name];
                        // Trigger character counter update
                        if (input.tagName === 'TEXTAREA') {
                            input.dispatchEvent(new Event('input'));
                        }
                    }
                });
            }
        } catch (error) {
            console.warn('フォームデータの復元に失敗しました:', error);
        }
    }

    // Load saved form data on page load
    loadFormData();

    // Save form data on input
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 500));
    });

    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
        if (form.checkValidity()) {
            localStorage.removeItem(autoSaveKey);
        }
    });

    // Debounce function
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

    // Accessibility: Announce form submission status
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';

        document.body.appendChild(announcement);
        announcement.textContent = message;

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Custom form field interactions
    const selectElements = form.querySelectorAll('select');
    selectElements.forEach(select => {
        select.addEventListener('change', () => {
            if (select.value) {
                select.style.color = 'var(--color-text)';
            } else {
                select.style.color = '#999';
            }
        });

        // Initialize color
        if (select.value) {
            select.style.color = 'var(--color-text)';
        } else {
            select.style.color = '#999';
        }
    });

    // Phone number formatting (Japanese style)
    const phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^\d]/g, '');

            // Format as Japanese phone number
            if (value.length > 0) {
                if (value.startsWith('0')) {
                    // Landline or mobile
                    if (value.length <= 3) {
                        value = value;
                    } else if (value.length <= 7) {
                        value = value.slice(0, 3) + '-' + value.slice(3);
                    } else {
                        value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
                    }
                }
            }

            e.target.value = value;
        });
    }

    console.log('📧 お問い合わせフォームが正常に初期化されました');
});