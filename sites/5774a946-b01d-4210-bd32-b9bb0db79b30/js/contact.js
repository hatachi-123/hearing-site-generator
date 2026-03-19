// お問い合わせフォーム管理
class ContactForm {
  constructor() {
    this.form = document.querySelector('#contact-form');
    this.submitBtn = document.querySelector('#submit-btn');
    this.originalBtnText = 'ご予約・お問い合わせ';
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.setupFieldValidation();
    this.setupPhoneFormat();
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.showMessage('入力内容をご確認ください。', 'error');
      return;
    }

    this.setSubmitting(true);

    try {
      const formData = new FormData(this.form);

      // Formspreeに送信（実際のプロジェクトでは適切なエンドポイントを設定）
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.showMessage('お問い合わせありがとうございます。24時間以内にご連絡いたします。', 'success');
        this.form.reset();
        this.resetFieldStates();
      } else {
        throw new Error('送信に失敗しました');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage('送信中にエラーが発生しました。お電話でのご連絡をお願いします。', 'error');
    } finally {
      this.setSubmitting(false);
    }
  }

  validateForm() {
    let isValid = true;
    const fields = [
      { name: 'name', label: 'お名前', required: true },
      { name: 'phone', label: 'お電話番号', required: true, pattern: /^[\d\-\(\)\+\s]+$/ },
      { name: 'email', label: 'メールアドレス', required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { name: 'date', label: 'ご希望日時', required: true },
      { name: 'symptoms', label: 'お悩みの症状', required: true }
    ];

    fields.forEach(field => {
      const input = this.form.querySelector(`[name="${field.name}"]`);
      const value = input.value.trim();

      // 必須チェック
      if (field.required && !value) {
        this.showFieldError(input, `${field.label}は必須項目です。`);
        isValid = false;
        return;
      }

      // パターンチェック
      if (value && field.pattern && !field.pattern.test(value)) {
        let errorMsg = '';
        if (field.name === 'phone') {
          errorMsg = '正しい電話番号を入力してください。';
        } else if (field.name === 'email') {
          errorMsg = '正しいメールアドレスを入力してください。';
        }
        this.showFieldError(input, errorMsg);
        isValid = false;
        return;
      }

      this.clearFieldError(input);
    });

    return isValid;
  }

  setupFieldValidation() {
    const fields = this.form.querySelectorAll('input, textarea');

    fields.forEach(field => {
      field.addEventListener('blur', () => {
        this.validateSingleField(field);
      });

      field.addEventListener('input', () => {
        this.clearFieldError(field);
      });
    });
  }

  validateSingleField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');

    if (isRequired && !value) {
      this.showFieldError(field, 'この項目は必須です。');
      return false;
    }

    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.showFieldError(field, '正しいメールアドレスを入力してください。');
      return false;
    }

    if (field.name === 'phone' && value && !/^[\d\-\(\)\+\s]+$/.test(value)) {
      this.showFieldError(field, '正しい電話番号を入力してください。');
      return false;
    }

    this.clearFieldError(field);
    return true;
  }

  setupPhoneFormat() {
    const phoneField = this.form.querySelector('[name="phone"]');
    if (!phoneField) return;

    phoneField.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^\d]/g, '');

      // 11桁の場合のフォーマット（例：090-1234-5678）
      if (value.length >= 11) {
        value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      } else if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{4})/, '$1-$2');
      } else if (value.length >= 4) {
        value = value.replace(/(\d{3})/, '$1-');
      }

      e.target.value = value;
    });
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;

    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  resetFieldStates() {
    const fields = this.form.querySelectorAll('input, textarea');
    fields.forEach(field => {
      this.clearFieldError(field);
      field.parentElement.classList.remove('focused');
    });
  }

  setSubmitting(isSubmitting) {
    if (isSubmitting) {
      this.submitBtn.disabled = true;
      this.submitBtn.textContent = '送信中...';
      this.submitBtn.classList.add('submitting');
    } else {
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = this.originalBtnText;
      this.submitBtn.classList.remove('submitting');
    }
  }

  showMessage(message, type) {
    // 既存のメッセージを削除
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) {
      existingMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    this.form.insertBefore(messageDiv, this.form.firstChild);

    // 5秒後に自動で消す
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);

    // メッセージまでスクロール
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 電話発信機能
class PhoneHandler {
  constructor() {
    this.setupPhoneLinks();
  }

  setupPhoneLinks() {
    document.querySelectorAll('.phone-btn, .tel-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // タッチデバイスでない場合は確認ダイアログ
        if (!('ontouchstart' in window)) {
          const phoneNumber = btn.href.replace('tel:', '') || btn.dataset.phone;
          if (!confirm(`${phoneNumber} に電話をかけますか？`)) {
            e.preventDefault();
          }
        }
      });
    });
  }
}

// LINE連携
class LineIntegration {
  constructor() {
    this.setupLineButtons();
  }

  setupLineButtons() {
    document.querySelectorAll('.line-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        // モバイルの場合はLINEアプリを開く
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          window.location.href = 'https://line.me/ti/p/@YOUR_LINE_ID';
        } else {
          // PCの場合は新しいタブで開く
          window.open('https://line.me/ti/p/@YOUR_LINE_ID', '_blank');
        }
      });
    });
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
  new PhoneHandler();
  new LineIntegration();
});