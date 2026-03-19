// Scroll-triggered Animation (TECH:①) - Intersection Observer API
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    this.init();
  }

  init() {
    this.setupScrollObserver();
    this.setupSmoothScroll();
    this.setupMicroAnimations();
  }

  setupScrollObserver() {
    // prefers-reduced-motion チェック
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // アニメーションを無効化
      document.querySelectorAll('[class*="scroll-reveal"], [class*="slide-"], [class*="scale-in"], [class*="section-reveal"]').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // 一度だけ発火
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    // 対象要素を監視
    const targets = document.querySelectorAll(
      '.scroll-reveal, .slide-left, .slide-right, .scale-in, .section-reveal, .image-reveal, .text-highlight'
    );

    targets.forEach(target => {
      observer.observe(target);
    });
  }

  setupSmoothScroll() {
    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  setupMicroAnimations() {
    // 電話ボタンのクリック時のフィードバック
    const phoneButtons = document.querySelectorAll('.phone-btn');
    phoneButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        // リップル効果
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // フォームのフォーカス効果
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', function() {
        if (!this.value) {
          this.parentElement.classList.remove('focused');
        }
      });
    });

    // カードのホバー効果強化
    const cards = document.querySelectorAll('.problem-item, .feature-item, .menu-item, .review-item');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
}

// カウンターアニメーション
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.counter');
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    this.counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.count) || parseInt(element.textContent);
    let current = 0;
    const increment = target / 60; // 1秒で完了（60fps）

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }
}

// SVGアイコンのインライン読み込み用ヘルパー
const SVGIcons = {
  phone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C10.93 21 3 13.07 3 3.08C3 2.48 3.48 2 4.08 2H7.09C7.69 2 8.09 2.48 8.09 3.08C8.09 4.58 8.34 6.03 8.81 7.39C8.94 7.78 8.83 8.21 8.53 8.51L6.84 10.2C8.1 12.68 10.32 14.9 12.8 16.16L14.49 14.47C14.79 14.17 15.22 14.06 15.61 14.19C16.97 14.66 18.42 14.91 19.92 14.91C20.52 14.91 21 15.39 21 15.99V16.92H22Z" fill="currentColor"/>
  </svg>`,

  line: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 15.2C16.34 15.82 15.66 16.24 14.92 16.24C14.64 16.24 14.34 16.18 14.02 16.04C12.62 15.48 11.14 14.64 9.86 13.36C8.58 12.08 7.74 10.6 7.18 9.2C6.82 8.24 7.04 7.14 7.8 6.38C8.56 5.62 9.66 5.4 10.62 5.76C11.18 5.96 11.62 6.42 11.82 6.98L12.28 8.2C12.42 8.56 12.38 8.96 12.18 9.28L11.58 10.26C11.46 10.46 11.46 10.72 11.58 10.92C12.02 11.68 12.66 12.32 13.42 12.76C13.62 12.88 13.88 12.88 14.08 12.76L15.06 12.16C15.38 11.96 15.78 11.92 16.14 12.06L17.36 12.52C17.92 12.72 18.38 13.16 18.58 13.72C18.94 14.68 18.72 15.78 17.96 16.54C17.86 16.64 17.76 16.72 17.64 16.78C17.32 16.92 17 17 16.64 17V15.2Z" fill="currentColor"/>
  </svg>`,

  email: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
  </svg>`,

  location: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor"/>
  </svg>`,

  time: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22S22 17.5 22 12S17.5 2 12 2ZM17 13H11V7H12.5V11.5H17V13Z" fill="currentColor"/>
  </svg>`
};

// リップル効果用CSS追加
const rippleCSS = `
@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}
`;

// CSS注入
if (!document.querySelector('#ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'ripple-styles';
  style.textContent = rippleCSS;
  document.head.appendChild(style);
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
  new CounterAnimation();

  // SVGアイコン挿入
  document.querySelectorAll('[data-icon]').forEach(el => {
    const iconName = el.dataset.icon;
    if (SVGIcons[iconName]) {
      el.innerHTML = SVGIcons[iconName];
    }
  });

  // ローディング画面対応
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });
});