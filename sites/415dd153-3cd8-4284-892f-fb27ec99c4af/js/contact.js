document.addEventListener('DOMContentLoaded', function() {

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        // Form validation
        const validateForm = (form) => {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                const errorElement = field.parentNode.querySelector('.error-message');

                if (errorElement) {
                    errorElement.remove();
                }

                if (!field.value.trim()) {
                    isValid = false;
                    showFieldError(field, 'この項目は必須です');
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    isValid = false;
                    showFieldError(field, '正しいメールアドレスを入力してください');
                } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                    isValid = false;
                    showFieldError(field, '正しい電話番号を入力してください');
                }
            });

            return isValid;
        };

        const showFieldError = (field, message) => {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';

            field.parentNode.appendChild(errorElement);
            field.style.borderColor = '#e74c3c';

            // Remove error styling on focus
            field.addEventListener('focus', function() {
                field.style.borderColor = '';
                if (errorElement.parentNode) {
                    errorElement.remove();
                }
            }, { once: true });
        };

        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        const isValidPhone = (phone) => {
            const phoneRegex = /^[\d\-\(\)\s\+]{10,}$/;
            return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        };

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    showFieldError(this, 'この項目は必須です');
                } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                    showFieldError(this, '正しいメールアドレスを入力してください');
                } else if (this.type === 'tel' && this.value && !isValidPhone(this.value)) {
                    showFieldError(this, '正しい電話番号を入力してください');
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!validateForm(this)) {
                // Scroll to first error
                const firstError = this.querySelector('.error-message');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Show loading state
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';

            // Prepare form data
            const formData = new FormData(this);

            // Simulate form submission (replace with actual Formspree endpoint)
            setTimeout(() => {
                // Reset form
                this.reset();

                // Show success message
                showSuccessMessage();

                // Reset button
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

                // Scroll to success message
                document.querySelector('.success-message').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

            }, 2000);
        });

        const showSuccessMessage = () => {
            // Remove any existing success message
            const existingSuccess = document.querySelector('.success-message');
            if (existingSuccess) {
                existingSuccess.remove();
            }

            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.style.cssText = `
                background: #d4edda;
                color: #155724;
                padding: 1.5rem;
                border-radius: var(--radius);
                margin: 2rem 0;
                border: 1px solid #c3e6cb;
                text-align: center;
                font-weight: 600;
            `;
            successMessage.innerHTML = `
                <h3>お問い合わせありがとうございます</h3>
                <p>2営業日以内にご連絡いたします。<br>
                お急ぎの場合は直接お電話ください。</p>
                <p><strong>TEL: <a href="tel:079-123-4567" style="color: #155724;">079-123-4567</a></strong></p>
            `;

            contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);

            // Auto-hide success message after 10 seconds
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.style.transition = 'opacity 0.5s ease';
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        if (successMessage.parentNode) {
                            successMessage.remove();
                        }
                    }, 500);
                }
            }, 10000);
        };

        // Phone number formatting
        const phoneInput = contactForm.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');

                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = value;
                    } else if (value.length <= 7) {
                        value = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
                    } else {
                        value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
                    }
                }

                this.value = value;
            });
        }

        // Preferred contact method handling
        const contactMethodRadios = contactForm.querySelectorAll('input[name="preferred_method"]');
        const conditionalFields = {
            'phone': contactForm.querySelector('.phone-time-field'),
            'line': contactForm.querySelector('.line-id-field'),
            'email': contactForm.querySelector('.email-time-field')
        };

        contactMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Hide all conditional fields
                Object.values(conditionalFields).forEach(field => {
                    if (field) {
                        field.style.display = 'none';
                        const input = field.querySelector('input, select');
                        if (input) {
                            input.required = false;
                        }
                    }
                });

                // Show relevant field
                const selectedField = conditionalFields[this.value];
                if (selectedField) {
                    selectedField.style.display = 'block';
                    const input = selectedField.querySelector('input, select');
                    if (input) {
                        input.required = true;
                    }
                }
            });
        });

        // Character counter for textarea
        const textarea = contactForm.querySelector('textarea');
        if (textarea) {
            const maxLength = parseInt(textarea.getAttribute('maxlength')) || 1000;
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.cssText = `
                text-align: right;
                font-size: 0.875rem;
                color: #666;
                margin-top: 0.5rem;
            `;
            textarea.parentNode.appendChild(counter);

            const updateCounter = () => {
                const remaining = maxLength - textarea.value.length;
                counter.textContent = `残り ${remaining} 文字`;

                if (remaining < 50) {
                    counter.style.color = '#e74c3c';
                } else if (remaining < 100) {
                    counter.style.color = '#f39c12';
                } else {
                    counter.style.color = '#666';
                }
            };

            textarea.addEventListener('input', updateCounter);
            updateCounter();
        }
    }

    // Emergency contact information
    const emergencyInfo = document.querySelector('.emergency-contact');
    if (emergencyInfo) {
        const emergencyButton = document.createElement('button');
        emergencyButton.textContent = '緊急時の対応について';
        emergencyButton.className = 'btn btn-secondary';
        emergencyButton.style.marginTop = '1rem';

        emergencyButton.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'emergency-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: var(--radius);
                max-width: 500px;
                margin: 1rem;
                position: relative;
            `;

            modalContent.innerHTML = `
                <button class="modal-close" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                ">&times;</button>
                <h3 style="color: var(--color-main); margin-bottom: 1rem;">緊急時の連絡について</h3>
                <p><strong>平日 9:00-17:00:</strong><br>
                TEL: <a href="tel:079-123-4567">079-123-4567</a></p>
                <p><strong>夜間・休日の緊急時:</strong><br>
                TEL: <a href="tel:090-1234-5678">090-1234-5678</a><br>
                <small>※生命に関わる緊急事態の場合は、まず119番通報をしてください</small></p>
                <p><strong>LINE緊急連絡:</strong><br>
                LINE ID: @aoyama-care<br>
                <small>※深夜でも確認いたします</small></p>
            `;

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Close modal handlers
            const closeModal = () => {
                document.body.removeChild(modal);
            };

            modalContent.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });

            // ESC key to close
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        });

        emergencyInfo.appendChild(emergencyButton);
    }

});