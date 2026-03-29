// お問い合わせ・連絡機能関連JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 電話番号の表示・非表示切り替え
    initializePhoneDisplay();

    // 営業時間チェック
    initializeBusinessHourCheck();

    // 地図関連機能
    initializeMapFeatures();

    // お問い合わせフォーム（将来的にFormspree対応）
    initializeContactForm();
});

// 電話番号の表示制御
function initializePhoneDisplay() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        // モバイルデバイスでない場合の処理
        if (!isMobileDevice()) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const phoneNumber = this.getAttribute('href').replace('tel:', '');
                showPhoneModal(phoneNumber);
            });
        }

        // 長押し時のコンテキストメニュー対応
        link.addEventListener('contextmenu', function(e) {
            if (isMobileDevice()) {
                // モバイルでは標準の動作を許可
                return;
            }
            e.preventDefault();
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            copyToClipboard(phoneNumber);
        });
    });
}

// デバイス判定
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 電話番号モーダル表示（PC用）
function showPhoneModal(phoneNumber) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    modalContent.innerHTML = `
        <h3 style="margin-bottom: 20px; color: var(--color-main); font-family: var(--font-heading);">お電話でのお問い合わせ</h3>
        <p style="font-size: 1.5rem; font-weight: bold; color: var(--color-accent); margin-bottom: 20px;">${phoneNumber}</p>
        <p style="margin-bottom: 20px; color: var(--color-text); line-height: 1.6;">
            営業時間内でしたら、いつでもお気軽にお電話ください。<br>
            野菜の入荷状況や予約も承ります。
        </p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="copyPhone" style="
                background: var(--color-main);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            ">番号をコピー</button>
            <button id="closeModal" style="
                background: var(--color-accent);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            ">閉じる</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // イベントリスナー
    document.getElementById('copyPhone').addEventListener('click', () => {
        copyToClipboard(phoneNumber);
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// クリップボードにコピー
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('電話番号をコピーしました');
        });
    } else {
        // フォールバック
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('電話番号をコピーしました');
    }
}

// 通知表示
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-accent);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10001;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease-out;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 営業時間チェック機能
function initializeBusinessHourCheck() {
    const phoneButtons = document.querySelectorAll('a[href^="tel:"]');

    phoneButtons.forEach(button => {
        // ホバー時に営業状況を表示
        button.addEventListener('mouseenter', function() {
            if (!isMobileDevice()) {
                showBusinessStatus(this);
            }
        });

        button.addEventListener('mouseleave', function() {
            hideBusinessStatus();
        });
    });
}

// 営業状況表示
function showBusinessStatus(element) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    let isOpen = false;
    let message = '';
    let nextOpen = '';

    if (currentDay === 3) { // 水曜日
        message = '本日は定休日です';
        nextOpen = '明日の営業開始は8:00です';
    } else if (currentDay === 0 || currentDay === 6) { // 土日
        isOpen = currentHour >= 8 && currentHour < 18;
        message = isOpen ? '営業中です' : '営業時間外です';
        if (!isOpen) {
            if (currentHour < 8) {
                nextOpen = `本日8:00から営業開始します`;
            } else {
                nextOpen = '明日8:00から営業開始です';
            }
        }
    } else { // 平日
        isOpen = currentHour >= 7 && currentHour < 19;
        message = isOpen ? '営業中です' : '営業時間外です';
        if (!isOpen) {
            if (currentHour < 7) {
                nextOpen = `本日7:00から営業開始します`;
            } else {
                nextOpen = '明日7:00から営業開始です';
            }
        }
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'business-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: ${isOpen ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.9rem;
        white-space: nowrap;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        pointer-events: none;
    `;

    tooltip.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 3px;">${message}</div>
        ${nextOpen ? `<div style="font-size: 0.8rem; opacity: 0.9;">${nextOpen}</div>` : ''}
    `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
}

// 営業状況非表示
function hideBusinessStatus() {
    const tooltip = document.getElementById('business-tooltip');
    if (tooltip) {
        document.body.removeChild(tooltip);
    }
}

// 地図関連機能
function initializeMapFeatures() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            const address = '島根県浜田市相生町1-15-8';
            const encodedAddress = encodeURIComponent(address);

            if (isMobileDevice()) {
                // モバイルでは Google Maps アプリを起動
                window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
            } else {
                // PCでは Google Maps を新しいタブで開く
                window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
            }
        });

        // ホバー効果
        mapPlaceholder.style.cursor = 'pointer';
        mapPlaceholder.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        mapPlaceholder.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// お問い合わせフォーム初期化（将来的にFormspree対応）
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // バリデーション
        if (!validateForm(data)) {
            return;
        }

        // 送信処理（Formspree等）
        submitForm(this, data);
    });
}

// フォームバリデーション
function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push('お名前を正しく入力してください');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('メールアドレスを正しく入力してください');
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push('お問い合わせ内容は10文字以上で入力してください');
    }

    if (errors.length > 0) {
        showValidationErrors(errors);
        return false;
    }

    return true;
}

// メールアドレス validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// バリデーションエラー表示
function showValidationErrors(errors) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: #ffebee;
        color: #c62828;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #c62828;
    `;

    errorDiv.innerHTML = `
        <strong>入力内容を確認してください：</strong>
        <ul style="margin: 10px 0 0 20px;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;

    const form = document.getElementById('contact-form');
    const existingError = form.querySelector('.validation-errors');
    if (existingError) {
        existingError.remove();
    }

    errorDiv.className = 'validation-errors';
    form.insertBefore(errorDiv, form.firstChild);

    // エラー箇所までスクロール
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// フォーム送信処理
function submitForm(form, data) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // 送信中の状態
    submitButton.textContent = '送信中...';
    submitButton.disabled = true;
    form.classList.add('loading');

    // Formspree や他のサービスへの送信処理をここに実装
    // 現在はダミー処理
    setTimeout(() => {
        showSuccessMessage();
        form.reset();

        // 状態を戻す
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        form.classList.remove('loading');
    }, 2000);
}

// 送信成功メッセージ
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        background: #e8f5e8;
        color: #2e7d32;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #4caf50;
        text-align: center;
    `;

    successDiv.innerHTML = `
        <strong>お問い合わせありがとうございます</strong>
        <p style="margin: 10px 0 0 0;">
            内容を確認させていただき、2-3営業日以内にご連絡いたします。<br>
            お急ぎの場合は、お電話（0855-22-3456）でお問い合わせください。
        </p>
    `;

    const form = document.getElementById('contact-form');
    form.insertBefore(successDiv, form.firstChild);

    // 成功メッセージまでスクロール
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// CSS アニメーション定義（動的追加）
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);