// お問い合わせフォーム JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

/**
 * お問い合わせフォーム初期化
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const submitButton = form.querySelector('.submit-button');
    const requiredFields = form.querySelectorAll('[required]');

    // リアルタイムバリデーション
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });

    // フォーム送信処理
    form.addEventListener('submit', handleFormSubmit);

    // 送信ボタンの状態管理
    updateSubmitButtonState();
    form.addEventListener('input', updateSubmitButtonState);
    form.addEventListener('change', updateSubmitButtonState);

    /**
     * フィールドバリデーション
     */
    function validateField(field) {
        const fieldGroup = field.closest('.form-group');
        const fieldName = field.name;
        const fieldValue = field.value.trim();

        // エラー表示用要素を取得または作成
        let errorElement = fieldGroup.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: var(--color-accent);
                font-size: 0.85rem;
                margin-top: 0.5rem;
                font-family: var(--font-body);
            `;
            fieldGroup.appendChild(errorElement);
        }

        let errorMessage = '';

        // 必須フィールドチェック
        if (field.hasAttribute('required') && !fieldValue) {
            errorMessage = `${getFieldDisplayName(fieldName)}は必須項目です。`;
        }
        // メールアドレス形式チェック
        else if (fieldName === 'email' && fieldValue) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(fieldValue)) {
                errorMessage = '正しいメールアドレス形式で入力してください。';
            }
        }
        // 電話番号形式チェック（任意フィールドだが値がある場合）
        else if (fieldName === 'phone' && fieldValue) {
            const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
            if (!phoneRegex.test(fieldValue) || fieldValue.replace(/[^0-9]/g, '').length < 10) {
                errorMessage = '正しい電話番号形式で入力してください。';
            }
        }
        // メッセージの最小文字数チェック
        else if (fieldName === 'message' && fieldValue && fieldValue.length < 10) {
            errorMessage = 'ご相談内容は10文字以上で入力してください。';
        }

        if (errorMessage) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            field.style.borderColor = 'var(--color-accent)';
            fieldGroup.setAttribute('data-error', 'true');
            return false;
        } else {
            errorElement.style.display = 'none';
            field.style.borderColor = 'var(--color-main)';
            fieldGroup.removeAttribute('data-error');
            return true;
        }
    }

    /**
     * フィールドエラークリア
     */
    function clearFieldError(field) {
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup.querySelector('.field-error');

        if (errorElement) {
            errorElement.style.display = 'none';
        }
        field.style.borderColor = '';
        fieldGroup.removeAttribute('data-error');
    }

    /**
     * フィールド表示名取得
     */
    function getFieldDisplayName(fieldName) {
        const displayNames = {
            'name': 'お名前',
            'email': 'メールアドレス',
            'phone': '電話番号',
            'subject': '相談分野',
            'message': 'ご相談内容',
            'privacy': 'プライバシーポリシーへの同意'
        };
        return displayNames[fieldName] || fieldName;
    }

    /**
     * 送信ボタン状態更新
     */
    function updateSubmitButtonState() {
        const allValid = Array.from(requiredFields).every(field => {
            if (field.type === 'checkbox') {
                return field.checked;
            }
            return field.value.trim() !== '';
        });

        submitButton.disabled = !allValid;
        submitButton.style.opacity = allValid ? '1' : '0.6';
        submitButton.style.cursor = allValid ? 'pointer' : 'not-allowed';
    }

    /**
     * フォーム送信処理
     */
    async function handleFormSubmit(e) {
        e.preventDefault();

        // 全フィールドのバリデーション実行
        let allValid = true;
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            showNotification('入力内容に誤りがあります。ご確認ください。', 'error');
            // 最初のエラーフィールドにフォーカス
            const firstErrorField = form.querySelector('[data-error="true"] input, [data-error="true"] select, [data-error="true"] textarea');
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }

        // 送信処理開始
        const originalButtonText = submitButton.textContent;
        const originalButtonDisabled = submitButton.disabled;

        try {
            // ローディング状態表示
            submitButton.textContent = '送信中...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';

            // FormData作成
            const formData = new FormData(form);

            // Formspreeに送信
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // 送信成功
                showNotification('お問い合わせを送信いたしました。ありがとうございます。24時間以内にご返信いたします。', 'success');
                form.reset();
                updateSubmitButtonState();

                // 送信完了後のフォーカス管理
                const successMessage = document.querySelector('.notification.success');
                if (successMessage) {
                    successMessage.focus();
                }

                // Google Analytics イベント送信（設置されている場合）
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'Contact',
                        event_label: 'Contact Form'
                    });
                }

            } else {
                throw new Error('送信エラー');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('送信中にエラーが発生しました。恐れ入りますが、お電話またはメールにて直接お問い合わせください。', 'error');
        } finally {
            // ボタン状態復元
            submitButton.textContent = originalButtonText;
            submitButton.disabled = originalButtonDisabled;
            submitButton.style.opacity = originalButtonDisabled ? '0.6' : '1';
        }
    }

    /**
     * 通知表示
     */
    function showNotification(message, type = 'info') {
        // 既存の通知を削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 新しい通知要素を作成
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        const colors = {
            success: 'var(--color-main)',
            error: 'var(--color-accent)',
            info: 'var(--color-text)'
        };

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: var(--color-white);
            padding: 1rem 2rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow-hover);
            z-index: 10000;
            max-width: 90%;
            text-align: center;
            font-family: var(--font-body);
            font-size: 0.9rem;
            line-height: 1.4;
            animation: slideInDown 0.3s ease;
        `;

        // アニメーション用CSS
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }

            @keyframes slideOutUp {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(styleSheet);

        notification.textContent = message;
        document.body.appendChild(notification);

        // 自動削除
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);

        // クリックで削除
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
}

/**
 * フォームデータの前処理（送信前のデータ整形）
 */
function preprocessFormData(formData) {
    // 電話番号の正規化
    const phone = formData.get('phone');
    if (phone) {
        const normalizedPhone = phone.replace(/[^\d\+\-]/g, '');
        formData.set('phone', normalizedPhone);
    }

    // メールアドレスの正規化
    const email = formData.get('email');
    if (email) {
        formData.set('email', email.toLowerCase().trim());
    }

    // 相談分野の日本語変換
    const subject = formData.get('subject');
    const subjectMap = {
        'divorce': '離婚・家事事件',
        'inheritance': '相続・遺言',
        'labor': '労働問題',
        'contract': '契約書作成・確認',
        'debt': '債権回収',
        'other': 'その他'
    };

    if (subject && subjectMap[subject]) {
        formData.set('subject', subjectMap[subject]);
    }

    return formData;
}

/**
 * カスタムバリデーションルール（拡張用）
 */
const customValidationRules = {
    name: (value) => {
        if (value.length < 2) {
            return 'お名前は2文字以上で入力してください。';
        }
        return null;
    },

    email: (value) => {
        // より厳密なメールバリデーション
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(value)) {
            return '正しいメールアドレス形式で入力してください。';
        }
        return null;
    },

    message: (value) => {
        if (value.length < 10) {
            return 'ご相談内容は10文字以上で入力してください。';
        }
        if (value.length > 2000) {
            return 'ご相談内容は2000文字以内で入力してください。';
        }
        return null;
    }
};

// デバッグ用：フォームデータをコンソールに出力
if (process.env.NODE_ENV === 'development') {
    window.debugForm = function() {
        const form = document.querySelector('.contact-form');
        if (form) {
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            console.log('Form Data:', data);
        }
    };
}