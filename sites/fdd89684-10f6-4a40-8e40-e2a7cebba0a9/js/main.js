// メインJavaScript
(function() {
  'use strict';

  // DOM要素の取得
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const fadeInElements = document.querySelectorAll('.fade-in');

  // Intersection Observer for fade-in animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    fadeInElements.forEach(function(element) {
      observer.observe(element);
    });
  }

  // ヘッダーのスクロール効果
  function handleHeaderScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // スムーススクロール
  function initSmoothScroll() {
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // モバイルメニューを閉じる
          if (window.innerWidth < 768) {
            navMenu.classList.remove('nav__menu--open');
            navToggle.classList.remove('nav__toggle--open');
          }
        }
      });
    });

    // CTAボタンのスムーススクロール
    const ctaButtons = document.querySelectorAll('a[href="#reservation"]');
    ctaButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const targetElement = document.querySelector('#reservation');

        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // モバイルナビゲーション
  function initMobileNav() {
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('nav__menu--open');
        navToggle.classList.toggle('nav__toggle--open');
      });

      // メニュー外クリックで閉じる
      document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('nav__menu--open');
          navToggle.classList.remove('nav__toggle--open');
        }
      });
    }
  }

  // 電話番号リンクの処理
  function initPhoneLinks() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        // モバイルデバイスでない場合は確認ダイアログを表示
        if (!(/Mobi|Android/i.test(navigator.userAgent))) {
          const phoneNumber = this.getAttribute('href').replace('tel:', '');
          if (!confirm('電話番号 ' + phoneNumber + ' に発信しますか？')) {
            e.preventDefault();
          }
        }
      });
    });
  }

  // パララックス効果（軽量版）
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero');

    if (window.innerWidth > 768) {
      window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach(function(element) {
          element.style.transform = 'translateY(' + rate + 'px)';
        });
      });
    }
  }

  // ページトップに戻るボタン（オプション）
  function initScrollToTop() {
    let scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.setAttribute('aria-label', 'ページトップに戻る');
    document.body.appendChild(scrollTopBtn);

    // スタイル設定
    scrollTopBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background-color: var(--color-accent);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);
    `;

    // スクロール時の表示/非表示
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
      }
    });

    // クリック時のアクション
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // フォーム入力の改善
  function initFormEnhancements() {
    const formInputs = document.querySelectorAll('.form__input, .form__textarea');

    formInputs.forEach(function(input) {
      // プレースホルダーテキストの動的変更
      input.addEventListener('focus', function() {
        if (this.type === 'datetime-local') {
          this.setAttribute('placeholder', '例：2026-04-01T18:00');
        }
      });

      // バリデーションフィードバック
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
          this.style.borderColor = '#e74c3c';
        } else {
          this.style.borderColor = '';
        }
      });

      input.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(231, 76, 60)') {
          this.style.borderColor = '';
        }
      });
    });
  }

  // レスポンシブ画像の遅延読み込み（プレースホルダー用）
  function initLazyLoading() {
    const placeholders = document.querySelectorAll('[class*="placeholder"]');

    const placeholderObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scale(1)';
        }
      });
    });

    placeholders.forEach(function(placeholder) {
      placeholder.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      placeholder.style.opacity = '0.8';
      placeholder.style.transform = 'scale(0.98)';
      placeholderObserver.observe(placeholder);
    });
  }

  // アクセシビリティの向上
  function initAccessibility() {
    // キーボードナビゲーション
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        navMenu.classList.remove('nav__menu--open');
        navToggle.classList.remove('nav__toggle--open');
      }
    });

    // フォーカス管理
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    navToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // 初期化関数
  function init() {
    // 基本機能の初期化
    initScrollAnimations();
    initSmoothScroll();
    initMobileNav();
    initPhoneLinks();
    initFormEnhancements();
    initLazyLoading();
    initAccessibility();
    initScrollToTop();

    // デスクトップでのみパララックスを有効化
    if (window.innerWidth > 768) {
      initParallax();
    }

    // スクロールイベントリスナー
    window.addEventListener('scroll', handleHeaderScroll);

    // リサイズ対応
    window.addEventListener('resize', function() {
      // モバイルメニューを閉じる
      if (window.innerWidth >= 768) {
        navMenu.classList.remove('nav__menu--open');
        navToggle.classList.remove('nav__toggle--open');
      }
    });
  }

  // DOMContentLoaded イベントで初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();