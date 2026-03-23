// Contact Form JavaScript for Office Habuchi Website

// Show/Hide Reservation Form
function showReservationForm() {
    const formContainer = document.getElementById('reservationForm');
    if (formContainer) {
        formContainer.classList.add('active');

        // Smooth scroll to form
        formContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Focus on first input
        setTimeout(() => {
            const firstInput = formContainer.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 500);
    }
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.querySelector('.reservation-form');

    if (!reservationForm) return;

    // Real-time validation
    const requiredFields = reservationForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearError);
    });

    // Form submission
    reservationForm.addEventListener('submit', handleFormSubmission);

    // Initialize form enhancements
    initFormEnhancements();
    initDateValidation();
});

// Validate individual field
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;

    // Clear previous error
    clearError({ target: field });

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showError(field, 'この項目は必須です');
        return false;
    }

    // Specific validations
    switch (fieldType) {
        case 'email':
            if (!isValidEmail(value)) {
                showError(field, '有効なメールアドレスを入力してください');
                return false;
            }
            break;

        case 'tel':
            if (!isValidPhone(value)) {
                showError(field, '有効な電話番号を入力してください（例：090-1234-5678）');
                return false;
            }
            break;

        case 'datetime-local':
            if (!isValidFutureDate(value)) {
                showError(field, '現在より後の日時を選択してください');
                return false;
            }
            if (!isBusinessHours(value)) {
                showError(field, '営業時間内の日時を選択してください（平日10:00-20:00、土日祝9:00-18:00、月曜定休）');
                return false;
            }
            break;
    }

    return true;
}

// Clear error styling and message
function clearError(event) {
    const field = event.target;
    const errorMsg = field.parentElement.querySelector('.error-message');

    field.classList.remove('error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Show error message
function showError(field, message) {
    field.classList.add('error');

    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 4px;
        animation: slideIn 0.3s ease;
    `;

    field.parentElement.appendChild(errorDiv);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone number validation (Japanese format)
function isValidPhone(phone) {
    const phoneRegex = /^(\d{2,4}-\d{2,4}-\d{4}|\d{10,11})$/;
    return phoneRegex.test(phone.replace(/[^\d-]/g, ''));
}

// Validate future date
function isValidFutureDate(dateString) {
    const selectedDate = new Date(dateString);
    const now = new Date();
    return selectedDate > now;
}

// Check if date/time is within business hours
function isBusinessHours(dateString) {
    const selectedDate = new Date(dateString);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = selectedDate.getHours();

    // Check if Monday (closed)
    if (dayOfWeek === 1) {
        return false;
    }

    // Check business hours
    if (dayOfWeek >= 2 && dayOfWeek <= 5) {
        // Tuesday-Friday: 10:00-20:00
        return hour >= 10 && hour < 20;
    } else {
        // Saturday, Sunday: 9:00-18:00
        return hour >= 9 && hour < 18;
    }
}

// Handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Validate all fields
    let isFormValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showNotification('入力に不備があります。エラーメッセージをご確認ください。', 'error');
        return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';

    try {
        // Submit form data
        const formData = new FormData(form);

        // Add timestamp
        formData.append('submitted_at', new Date().toLocaleString('ja-JP'));

        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showNotification('予約リクエストを送信しました。確認のお電話をさせていただきます。', 'success');
            form.reset();

            // Hide form after successful submission
            setTimeout(() => {
                const formContainer = document.getElementById('reservationForm');
                if (formContainer) {
                    formContainer.classList.remove('active');
                }
            }, 3000);

        } else {
            throw new Error('送信エラー');
        }

    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('送信に失敗しました。お電話でのご予約をお願いします。', 'error');
    }

    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const bgColor = {
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db'
    }[type];

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Initialize form enhancements
function initFormEnhancements() {
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');

            // Format as XXX-XXXX-XXXX
            if (value.length >= 7) {
                value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (value.length >= 4) {
                value = value.replace(/(\d{3})(\d{4})/, '$1-$2');
            }

            e.target.value = value;
        });
    }

    // Auto-format date inputs
    const dateInputs = document.querySelectorAll('input[type="datetime-local"]');
    dateInputs.forEach(input => {
        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0); // Set to 10:00 AM

        const minDate = tomorrow.toISOString().slice(0, 16);
        input.min = minDate;
    });
}

// Initialize date validation
function initDateValidation() {
    const dateInputs = document.querySelectorAll('input[type="datetime-local"]');

    dateInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const selectedDate = new Date(e.target.value);
            const dayOfWeek = selectedDate.getDay();
            const hour = selectedDate.getHours();

            // Provide helpful suggestions for invalid times
            if (dayOfWeek === 1) {
                showError(input, '月曜日は定休日です。他の曜日をお選びください。');
            } else if (dayOfWeek >= 2 && dayOfWeek <= 5 && (hour < 10 || hour >= 20)) {
                showError(input, '平日の営業時間は10:00-20:00です。');
            } else if ((dayOfWeek === 0 || dayOfWeek === 6) && (hour < 9 || hour >= 18)) {
                showError(input, '土日祝の営業時間は9:00-18:00です。');
            }
        });
    });
}

// Add CSS for error states and animations
const formStyles = `
<style>
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100px);
    }
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: #e74c3c;
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

.form-group.focused label {
    color: var(--color-accent);
    transform: translateY(-2px);
    transition: all 0.3s ease;
}

.notification {
    font-family: var(--font-body);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', formStyles);