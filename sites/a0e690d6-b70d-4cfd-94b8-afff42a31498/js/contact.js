// Contact Form Management for Habuchi Minpaku
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        formspreeEndpoint: 'YOUR_FORM_ID', // Replace with actual Formspree form ID
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        animationDuration: 300
    };

    // DOM Elements
    const contactForm = document.querySelector('.contact-form');
    const submitButton = document.querySelector('.form-submit');
    const formGroups = document.querySelectorAll('.form-group');
    const checkInInput = document.querySelector('#checkin');

    // Initialize contact functionality
    function initContact() {
        if (!contactForm) return;

        setupFormValidation();
        setupDateRestrictions();
        setupFormSubmission();
        setupFieldInteractions();
        setupRealTimeValidation();
        setupCalendarIntegration();
    }

    // Enhanced form validation
    function setupFormValidation() {
        const validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[^\d]*$/,
                message: 'お名前は2文字以上で、数字を含まないでください'
            },
            email: {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: '正しいメールアドレスを入力してください'
            },
            phone: {
                required: false,
                pattern: /^[\d\-\+\(\)\s]{10,}$/,
                message: '正しい電話番号を入力してください（10桁以上）'
            },
            checkin: {
                required: false,
                customValidation: validateCheckInDate,
                message: '本日以降の日付を選択してください'
            },
            message: {
                required: false,
                maxLength: 1000,
                message: 'メッセージは1000文字以内で入力してください'
            }
        };

        // Add validation to each field
        Object.keys(validationRules).forEach(fieldName => {
            const field = contactForm.querySelector(`[name="${fieldName}"]`);
            if (!field) return;

            const rule = validationRules[fieldName];

            // Real-time validation on blur
            field.addEventListener('blur', () => validateField(field, rule));

            // Clear errors on input
            field.addEventListener('input', () => clearFieldError(field));
        });
    }

    // Field validation function
    function validateField(field, rule) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required check
        if (rule.required && !value) {
            isValid = false;
            errorMessage = 'この項目は必須です';
        }
        // Pattern check
        else if (value && rule.pattern && !rule.pattern.test(value)) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Length checks
        else if (value && rule.minLength && value.length < rule.minLength) {
            isValid = false;
            errorMessage = rule.message;
        }
        else if (value && rule.maxLength && value.length > rule.maxLength) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Custom validation
        else if (value && rule.customValidation && !rule.customValidation(value)) {
            isValid = false;
            errorMessage = rule.message;
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError(field);
        }

        return isValid;
    }

    // Custom validation for check-in date
    function validateCheckInDate(dateString) {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return selectedDate >= today;
    }

    // Show field error
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        clearFieldError(field);

        // Add error class
        field.classList.add('error');
        formGroup.classList.add('error');

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        // Add animation
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(-10px)';
        formGroup.appendChild(errorDiv);

        // Animate in
        setTimeout(() => {
            errorDiv.style.transition = `all ${CONFIG.animationDuration}ms ease`;
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    // Clear field error
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        field.classList.remove('error');
        formGroup.classList.remove('error');

        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.opacity = '0';
            errorMessage.style.transform = 'translateY(-10px)';
            setTimeout(() => errorMessage.remove(), CONFIG.animationDuration);
        }
    }

    // Date restrictions for check-in
    function setupDateRestrictions() {
        if (!checkInInput) return;

        // Set minimum date to today
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        checkInInput.setAttribute('min', todayString);

        // Set maximum date to 1 year from today
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        const maxDateString = maxDate.toISOString().split('T')[0];
        checkInInput.setAttribute('max', maxDateString);

        // Disable unavailable dates (example: fully booked dates)
        const unavailableDates = [
            '2024-12-25', '2024-12-31', '2025-01-01'
            // Add more unavailable dates as needed
        ];

        checkInInput.addEventListener('input', function() {
            const selectedDate = this.value;
            if (unavailableDates.includes(selectedDate)) {
                showFieldError(this, 'この日は満室のためご利用いただけません');
                this.value = '';
            }
        });
    }

    // Form submission handling
    function setupFormSubmission() {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate all fields
            const isFormValid = validateAllFields();
            if (!isFormValid) {
                showNotification('入力内容をご確認ください', 'error');
                return;
            }

            // Show loading state
            setSubmitButtonState('loading');

            try {
                // Prepare form data
                const formData = new FormData(contactForm);

                // Add additional data
                formData.append('_subject', '羽淵民泊 - 新しい予約リクエスト');
                formData.append('_replyto', formData.get('email'));
                formData.append('_language', 'ja');

                // Submit to Formspree
                const response = await fetch(`https://formspree.io/f/${CONFIG.formspreeEndpoint}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    handleSubmissionSuccess();
                } else {
                    throw new Error('送信に失敗しました');
                }

            } catch (error) {
                handleSubmissionError(error);
            }
        });
    }

    // Validate all form fields
    function validateAllFields() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            const value = field.value.trim();
            if (!value) {
                showFieldError(field, 'この項目は必須です');
                isValid = false;
            }
        });

        // Email validation
        const emailField = contactForm.querySelector('[name="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(emailField.value)) {
                showFieldError(emailField, '正しいメールアドレスを入力してください');
                isValid = false;
            }
        }

        return isValid;
    }

    // Handle successful form submission
    function handleSubmissionSuccess() {
        setSubmitButtonState('success');

        showNotification(
            'お問い合わせありがとうございます。24時間以内にご連絡いたします。',
            'success'
        );

        // Reset form after delay
        setTimeout(() => {
            contactForm.reset();
            setSubmitButtonState('normal');
        }, 3000);

        // Send confirmation email info
        setTimeout(() => {
            showNotification(
                '確認メールをお送りいたします。迷惑メールフォルダもご確認ください。',
                'info'
            );
        }, 1000);
    }

    // Handle form submission error
    function handleSubmissionError(error) {
        setSubmitButtonState('error');

        showNotification(
            '送信に失敗しました。お手数ですが、お電話でお問い合わせください。',
            'error'
        );

        setTimeout(() => {
            setSubmitButtonState('normal');
        }, 3000);
    }

    // Set submit button state
    function setSubmitButtonState(state) {
        if (!submitButton) return;

        const states = {
            normal: {
                text: '予約リクエストを送信',
                disabled: false,
                className: ''
            },
            loading: {
                text: '送信中...',
                disabled: true,
                className: 'loading'
            },
            success: {
                text: '送信完了',
                disabled: true,
                className: 'success'
            },
            error: {
                text: '送信失敗',
                disabled: true,
                className: 'error'
            }
        };

        const currentState = states[state];
        if (currentState) {
            submitButton.textContent = currentState.text;
            submitButton.disabled = currentState.disabled;
            submitButton.className = `form-submit ${currentState.className}`;

            if (state === 'loading') {
                submitButton.innerHTML = `
                    <div class="loading-spinner"></div>
                    ${currentState.text}
                `;
            }
        }
    }

    // Enhanced field interactions
    function setupFieldInteractions() {
        // Add floating labels effect
        const inputFields = contactForm.querySelectorAll('input, select, textarea');

        inputFields.forEach(field => {
            // Add focus classes
            field.addEventListener('focus', function() {
                this.closest('.form-group').classList.add('focused');
            });

            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.closest('.form-group').classList.remove('focused');
                }
            });

            // Add filled class for pre-filled fields
            if (field.value.trim()) {
                field.closest('.form-group').classList.add('focused');
            }
        });

        // Plan selection interaction
        const planSelect = contactForm.querySelector('[name="plan"]');
        if (planSelect) {
            planSelect.addEventListener('change', function() {
                const selectedPlan = this.value;
                updatePlanInfo(selectedPlan);
            });
        }

        // Guest number interaction
        const guestsSelect = contactForm.querySelector('[name="guests"]');
        if (guestsSelect) {
            guestsSelect.addEventListener('change', function() {
                const guestCount = parseInt(this.value);
                if (guestCount > 2) {
                    showNotification('3名様以上でのご利用をご希望の場合は、メッセージ欄にご記入ください。', 'info');
                }
            });
        }
    }

    // Update plan information
    function updatePlanInfo(planValue) {
        const planInfo = {
            standard: {
                price: '¥100,000〜',
                features: ['完全プライベート空間', '高級家具完備', 'コンシェルジュサービス']
            },
            deluxe: {
                price: '¥150,000〜',
                features: ['スタンダード全内容', '専属シェフ夕食', 'ワインペアリング', 'アロマトリートメント']
            },
            anniversary: {
                price: '¥180,000〜',
                features: ['デラックス全内容', '特別装飾', '記念写真撮影', 'ケーキ・シャンパン']
            }
        };

        if (planValue && planInfo[planValue]) {
            const info = planInfo[planValue];
            showNotification(`${info.price} - ${info.features.slice(0, 2).join('、')}など`, 'info');
        }
    }

    // Real-time validation feedback
    function setupRealTimeValidation() {
        const emailField = contactForm.querySelector('[name="email"]');
        const phoneField = contactForm.querySelector('[name="phone"]');

        // Email validation with suggestions
        if (emailField) {
            emailField.addEventListener('input', debounce(function() {
                const email = this.value.trim();
                if (email.length > 5) {
                    validateEmailFormat(email);
                }
            }, 500));
        }

        // Phone number formatting
        if (phoneField) {
            phoneField.addEventListener('input', function() {
                formatPhoneNumber(this);
            });
        }
    }

    // Email format validation with suggestions
    function validateEmailFormat(email) {
        const commonDomains = ['gmail.com', 'yahoo.co.jp', 'outlook.com', 'icloud.com'];
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return;
        }

        // Suggest common domains if there's a typo
        const domain = email.split('@')[1];
        if (domain && !commonDomains.includes(domain)) {
            const suggestion = findClosestMatch(domain, commonDomains);
            if (suggestion && suggestion !== domain) {
                showEmailSuggestion(email, suggestion);
            }
        }
    }

    // Phone number formatting
    function formatPhoneNumber(field) {
        let value = field.value.replace(/[^\d]/g, '');

        if (value.length >= 10) {
            // Format as XXX-XXXX-XXXX
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (value.length >= 7) {
            // Format as XXX-XXXX
            value = value.replace(/(\d{3})(\d{4})/, '$1-$2');
        }

        field.value = value;
    }

    // Find closest string match for suggestions
    function findClosestMatch(str, options) {
        let closest = null;
        let minDistance = Infinity;

        options.forEach(option => {
            const distance = levenshteinDistance(str, option);
            if (distance < minDistance && distance <= 2) {
                minDistance = distance;
                closest = option;
            }
        });

        return closest;
    }

    // Levenshtein distance calculation
    function levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    // Show email suggestion
    function showEmailSuggestion(currentEmail, suggestedDomain) {
        const emailField = contactForm.querySelector('[name="email"]');
        const userPart = currentEmail.split('@')[0];
        const suggestedEmail = `${userPart}@${suggestedDomain}`;

        const suggestion = document.createElement('div');
        suggestion.className = 'email-suggestion';
        suggestion.innerHTML = `
            <p>もしかして: <strong>${suggestedEmail}</strong> ですか？</p>
            <button type="button" class="use-suggestion">使用する</button>
            <button type="button" class="dismiss-suggestion">×</button>
        `;

        const formGroup = emailField.closest('.form-group');

        // Remove existing suggestion
        const existingSuggestion = formGroup.querySelector('.email-suggestion');
        if (existingSuggestion) {
            existingSuggestion.remove();
        }

        formGroup.appendChild(suggestion);

        // Handle suggestion click
        suggestion.querySelector('.use-suggestion').addEventListener('click', function() {
            emailField.value = suggestedEmail;
            suggestion.remove();
            clearFieldError(emailField);
        });

        suggestion.querySelector('.dismiss-suggestion').addEventListener('click', function() {
            suggestion.remove();
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (suggestion.parentNode) {
                suggestion.remove();
            }
        }, 10000);
    }

    // Calendar integration (availability checking)
    function setupCalendarIntegration() {
        if (!checkInInput) return;

        // Mock availability data (in real implementation, this would come from an API)
        const unavailableDates = [
            '2024-12-25', '2024-12-31', '2025-01-01', '2025-01-02'
        ];

        const fullyBookedDates = [
            '2024-12-28', '2024-12-29', '2024-12-30'
        ];

        checkInInput.addEventListener('change', function() {
            const selectedDate = this.value;

            if (unavailableDates.includes(selectedDate)) {
                showFieldError(this, 'この日はメンテナンスのためご利用いただけません');
                this.value = '';
            } else if (fullyBookedDates.includes(selectedDate)) {
                showFieldError(this, 'この日は満室です。別の日程をお選びください');
                this.value = '';
            } else {
                clearFieldError(this);
                showNotification('ご希望の日程は空室です', 'success');
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Use the global toast function if available
        if (window.HabuchiMinpaku && window.HabuchiMinpaku.showToast) {
            window.HabuchiMinpaku.showToast(message, type);
            return;
        }

        // Fallback notification
        alert(message);
    }

    // Utility function - debounce
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContact);
    } else {
        initContact();
    }

})();