// お問い合わせフォーム処理
(function() {
  'use strict';

  // フォーム要素の取得
  const contactForm = document.querySelector('.reservation__form');
  const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

  // バリデーションルール
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      message: 'お名前は2文字以上50文字以内で入力してください。'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '正しいメールアドレスを入力してください。'
    },
    phone: {
      required: false,
      pattern: /^[\d\-\(\)\+\s]+$/,
      message: '正しい電話番号を入力してください。'
    },
    message: {
      required: false,
      maxLength: 1000,
      message: 'お問い合わせ内容は1000文字以内で入力してください。'
    }
  };

  // エラーメッセージの表示
  function showError(input, message) {
    // 既存のエラーメッセージを削除
    const existingError = input.parentNode.querySelector('.form__error');
    if (existingError) {
      existingError.remove();
    }

    // エラーメッセージ要素の作成
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form__error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #e74c3c;
      font-size: 0.9rem;
      margin-top: 8px;
      padding: 4px 0;
    `;

    // エラーメッセージの挿入
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#e74c3c';
  }

  // エラーメッセージの削除
  function removeError(input) {
    const errorDiv = input.parentNode.querySelector('.form__error');
    if (errorDiv) {
      errorDiv.remove();
    }
    input.style.borderColor = '';
  }

  // バリデーション実行
  function validateField(input) {
    const fieldName = input.name;
    const value = input.value.trim();
    const rules = validationRules[fieldName];

    if (!rules) return true;

    // 必須フィールドのチェック
    if (rules.required && !value) {
      showError(input, rules.message || 'この項目は必須です。');
      return false;
    }

    // 値が入力されている場合のみ以下のバリデーションを実行
    if (value) {
      // 最小文字数チェック
      if (rules.minLength && value.length < rules.minLength) {
        showError(input, rules.message);
        return false;
      }

      // 最大文字数チェック
      if (rules.maxLength && value.length > rules.maxLength) {
        showError(input, rules.message);
        return false;
      }

      // パターンマッチング
      if (rules.pattern && !rules.pattern.test(value)) {
        showError(input, rules.message);
        return false;
      }
    }

    removeError(input);
    return true;
  }

  // フォーム全体のバリデーション
  function validateForm() {
    if (!contactForm) return false;

    let isValid = true;
    const inputs = contactForm.querySelectorAll('input, textarea, select');

    inputs.forEach(function(input) {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // 送信状態の表示
  function showSubmitState(state, message) {
    if (!submitButton) return;

    switch (state) {
      case 'loading':
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';
        submitButton.style.backgroundColor = '#95a5a6';
        break;
      case 'success':
        submitButton.style.backgroundColor = '#27ae60';
        submitButton.textContent = '送信完了';
        setTimeout(function() {
          submitButton.disabled = false;
          submitButton.textContent = '送信する';
          submitButton.style.backgroundColor = '';
        }, 3000);
        break;
      case 'error':
        submitButton.disabled = false;
        submitButton.textContent = '送信する';
        submitButton.style.backgroundColor = '';
        break;
    }
  }

  // 成功メッセージの表示
  function showSuccessMessage() {
    // 既存のメッセージを削除
    const existingMessage = contactForm.parentNode.querySelector('.form__success');
    if (existingMessage) {
      existingMessage.remove();
    }

    // 成功メッセージの作成
    const successDiv = document.createElement('div');
    successDiv.className = 'form__success';
    successDiv.innerHTML = `
      <h3>お問い合わせありがとうございます</h3>
      <p>メッセージを受け付けました。<br>
      1〜2営業日以内にご返信いたします。<br>
      お急ぎの場合は、お電話にてお問い合わせください。</p>
    `;
    successDiv.style.cssText = `
      background: linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(46, 204, 113, 0.1));
      border: 2px solid #27ae60;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      text-align: center;
      color: #27ae60;
    `;

    // メッセージの挿入
    contactForm.parentNode.insertBefore(successDiv, contactForm);

    // フォームをリセット
    contactForm.reset();

    // 成功メッセージにスクロール
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // エラーメッセージの表示
  function showErrorMessage(message) {
    // 既存のメッセージを削除
    const existingMessage = contactForm.parentNode.querySelector('.form__error-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // エラーメッセージの作成
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form__error-message';
    errorDiv.innerHTML = `
      <h3>送信エラー</h3>
      <p>${message || '送信中にエラーが発生しました。お手数ですが、再度お試しいただくか、お電話にてお問い合わせください。'}</p>
    `;
    errorDiv.style.cssText = `
      background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(192, 57, 43, 0.1));
      border: 2px solid #e74c3c;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      text-align: center;
      color: #e74c3c;
    `;

    // メッセージの挿入
    contactForm.parentNode.insertBefore(errorDiv, contactForm);

    // エラーメッセージにスクロール
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // フォーム送信処理
  function handleFormSubmit(e) {
    e.preventDefault();

    // バリデーション実行
    if (!validateForm()) {
      return;
    }

    // 送信状態に変更
    showSubmitState('loading');

    // FormData作成
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
        showSubmitState('success');
        showSuccessMessage();
      } else {
        throw new Error('送信に失敗しました');
      }
    })
    .catch(function(error) {
      showSubmitState('error');
      showErrorMessage();
    });
  }

  // リアルタイムバリデーション
  function initRealtimeValidation() {
    if (!contactForm) return;

    const inputs = contactForm.querySelectorAll('input, textarea, select');

    inputs.forEach(function(input) {
      // フォーカス時のイベント
      input.addEventListener('focus', function() {
        removeError(this);
      });

      // 入力時のイベント
      input.addEventListener('input', function() {
        if (this.parentNode.querySelector('.form__error')) {
          setTimeout(() => validateField(this), 300);
        }
      });

      // フォーカス離脱時のイベント
      input.addEventListener('blur', function() {
        validateField(this);
      });
    });
  }

  // 入力補助機能
  function initInputHelpers() {
    if (!contactForm) return;

    // 電話番号フィールドの自動フォーマット
    const phoneInput = contactForm.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/[^\d]/g, '');
        if (value.length >= 10) {
          value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (value.length >= 7) {
          value = value.replace(/(\d{3})(\d{4})/, '$1-$2');
        }
        this.value = value;
      });
    }

    // 人数選択の動的ヘルプテキスト
    const guestsSelect = contactForm.querySelector('select[name="guests"]');
    if (guestsSelect) {
      guestsSelect.addEventListener('change', function() {
        const value = this.value;
        let helpText = '';

        if (value === '6') {
          helpText = '6名様以上の場合は、事前にお電話でのご相談をお願いいたします。';
        } else if (parseInt(value) >= 4) {
          helpText = '4名様以上のお席をご希望の場合は、お早めのご予約をおすすめいたします。';
        }

        // 既存のヘルプテキストを削除
        const existingHelp = this.parentNode.querySelector('.form__help');
        if (existingHelp) {
          existingHelp.remove();
        }

        // ヘルプテキストの表示
        if (helpText) {
          const helpDiv = document.createElement('div');
          helpDiv.className = 'form__help';
          helpDiv.textContent = helpText;
          helpDiv.style.cssText = `
            color: #f39c12;
            font-size: 0.9rem;
            margin-top: 8px;
            padding: 8px 12px;
            background-color: rgba(243, 156, 18, 0.1);
            border-radius: 6px;
            border-left: 3px solid #f39c12;
          `;
          this.parentNode.appendChild(helpDiv);
        }
      });
    }
  }

  // 初期化関数
  function init() {
    if (!contactForm) return;

    // イベントリスナーの設定
    contactForm.addEventListener('submit', handleFormSubmit);

    // バリデーション機能の初期化
    initRealtimeValidation();

    // 入力補助機能の初期化
    initInputHelpers();

    // 日時入力フィールドの最小値設定（現在時刻以降のみ選択可能）
    const dateInput = contactForm.querySelector('input[name="date"]');
    if (dateInput) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      dateInput.setAttribute('min', minDateTime);
    }
  }

  // DOMContentLoaded イベントで初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();