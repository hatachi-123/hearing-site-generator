// コンタクトフォーム機能JavaScript

document.addEventListener('DOMContentLoaded', function() {

    const contactForm = document.querySelector('.contact-form');
    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    const submitButton = contactForm.querySelector('.form-submit');

    // リアルタイムバリデーション
    formInputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(input);
        });

        input.addEventListener('input', function() {
            // エラー状態をクリア
            clearFieldError(input);
        });
    });

    // フィールドバリデーション関数
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // 必須フィールドのチェック
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'この項目は必須です';
        }

        // 個別フィールドバリデーション
        switch (fieldName) {
            case 'name':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'お名前は2文字以上で入力してください';
                }
                break;

            case 'phone':
                if (value && !isValidPhoneNumber(value)) {
                    isValid = false;
                    errorMessage = '正しい電話番号を入力してください（例：090-1234-5678）';
                }
                break;

            case 'email':
                if (value && !isValidEmail(value)) {
                    isValid = false;
                    errorMessage = '正しいメールアドレスを入力してください';
                }
                break;
        }

        // バリデーション結果の表示
        if (isValid) {
            clearFieldError(field);
        } else {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    // エラー表示
    function showFieldError(field, message) {
        clearFieldError(field);

        field.classList.add('error');
        field.style.borderColor = '#e74c3c';

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 4px;
            margin-bottom: 8px;
        `;

        field.parentNode.appendChild(errorElement);
    }

    // エラークリア
    function clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';

        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // 電話番号バリデーション
    function isValidPhoneNumber(phone) {
        const phoneRegex = /^[\d\-\(\)\+\s]{10,}$/;
        return phoneRegex.test(phone);
    }

    // メールアドレスバリデーション
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // フォーム送信処理
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 全フィールドをバリデーション
        let isFormValid = true;
        formInputs.forEach(function(input) {
            const fieldValid = validateField(input);
            if (!fieldValid) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // エラーがある場合は最初のエラーフィールドにフォーカス
            const firstErrorField = contactForm.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
                firstErrorField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            return;
        }

        // 送信処理
        submitForm();
    });

    // フォーム送信関数
    function submitForm() {
        // ボタンを無効化
        submitButton.disabled = true;
        const originalText = submitButton.querySelector('span').textContent;
        submitButton.querySelector('span').textContent = '送信中...';
        submitButton.style.opacity = '0.7';

        // フォームデータを取得
        const formData = new FormData(contactForm);

        // Formspreeに送信
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('送信に失敗しました');
        })
        .then(function(data) {
            // 成功時の処理
            showSuccessMessage();
            contactForm.reset();

            // Google Analytics イベント送信
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'contact',
                    event_label: 'email_form'
                });
            }
        })
        .catch(function(error) {
            // エラー時の処理
            showErrorMessage();
        })
        .finally(function() {
            // ボタンを復元
            submitButton.disabled = false;
            submitButton.querySelector('span').textContent = originalText;
            submitButton.style.opacity = '1';
        });
    }

    // 成功メッセージ表示
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-message success';
        successMessage.innerHTML = `
            <div style="
                background: #d4edda;
                color: #155724;
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
                border: 1px solid #c3e6cb;
                text-align: center;
            ">
                <h4 style="margin-bottom: 8px;">送信完了</h4>
                <p style="margin-bottom: 0;">お問い合わせありがとうございます。<br>2営業日以内にご返信いたします。</p>
            </div>
        `;

        contactForm.parentNode.insertBefore(successMessage, contactForm);

        // 3秒後にメッセージを削除
        setTimeout(function() {
            successMessage.remove();
        }, 5000);

        // ページトップへスクロール
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // エラーメッセージ表示
    function showErrorMessage() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-message error';
        errorMessage.innerHTML = `
            <div style="
                background: #f8d7da;
                color: #721c24;
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
                border: 1px solid #f5c6cb;
                text-align: center;
            ">
                <h4 style="margin-bottom: 8px;">送信エラー</h4>
                <p style="margin-bottom: 0;">送信に失敗しました。<br>お手数ですがお電話またはLINEでお問い合わせください。</p>
            </div>
        `;

        contactForm.parentNode.insertBefore(errorMessage, contactForm);

        // 5秒後にメッセージを削除
        setTimeout(function() {
            errorMessage.remove();
        }, 5000);
    }

    // 入力支援機能

    // 電話番号の自動フォーマット
    const phoneInput = contactForm.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            // 自動フォーマット（ハイフンを追加）
            if (value.length >= 7) {
                if (value.startsWith('0') && value.length === 11) {
                    // 携帯電話: 090-1234-5678
                    value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                } else if (value.startsWith('0') && value.length === 10) {
                    // 固定電話: 079-123-4567
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                }
            }

            e.target.value = value;
        });
    }

    // 日時入力の支援
    const dateInput = contactForm.querySelector('input[name="date"]');
    if (dateInput) {
        dateInput.addEventListener('focus', function() {
            if (!this.value) {
                // 明日の日付を候補として表示
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const month = tomorrow.getMonth() + 1;
                const date = tomorrow.getDate();
                const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
                const dayName = dayNames[tomorrow.getDay()];

                this.placeholder = `例：${month}月${date}日（${dayName}）15:00頃`;
            }
        });
    }

    // 文字数カウンター
    const textareas = contactForm.querySelectorAll('.form-textarea');
    textareas.forEach(function(textarea) {
        const maxLength = 500;

        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.75rem;
            color: #666;
            margin-top: 4px;
        `;
        counter.textContent = `0/${maxLength}文字`;

        textarea.parentNode.appendChild(counter);
        textarea.setAttribute('maxlength', maxLength);

        textarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/${maxLength}文字`;

            if (length > maxLength * 0.9) {
                counter.style.color = '#e74c3c';
            } else {
                counter.style.color = '#666';
            }
        });
    });

    // プライバシー保護
    window.addEventListener('beforeunload', function() {
        // ページを離れる際にフォームデータを一時保存
        const formData = {};
        formInputs.forEach(function(input) {
            if (input.value.trim()) {
                formData[input.name] = input.value;
            }
        });

        if (Object.keys(formData).length > 0) {
            sessionStorage.setItem('contactFormData', JSON.stringify(formData));
        }
    });

    // ページ読み込み時にフォームデータを復元
    const savedData = sessionStorage.getItem('contactFormData');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            formInputs.forEach(function(input) {
                if (formData[input.name]) {
                    input.value = formData[input.name];
                }
            });
            sessionStorage.removeItem('contactFormData');
        } catch (e) {
            // エラーは無視
        }
    }

});

// フォーム外クリックでのオートセーブ
document.addEventListener('click', function(e) {
    if (!e.target.closest('.contact-form')) {
        // フォーム外をクリックした時の処理（必要に応じて実装）
    }
});