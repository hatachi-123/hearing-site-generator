// メインJavaScript（CLAUDE.md技法リファレンス準拠）

document.addEventListener('DOMContentLoaded', function() {
    // Scroll-triggered Animation（技法① - Intersection Observer API使用）
    initScrollAnimations();

    // FAQ機能
    initFAQ();

    // スムーススクロール
    initSmoothScroll();

    // ヘッダー背景効果
    initHeaderScroll();

    // スクロール進行インジケーター
    initScrollProgress();

    // モバイルメニュー（将来の拡張用）
    initMobileMenu();
});

/**
 * スクロールトリガーアニメーション初期化
 * threshold: 0.15が自然な発火タイミング（技法リファレンス準拠）
 * once: true で一度だけ発火（戻り再発火は疲れる）
 */
function initScrollAnimations() {
    const animationElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-up');

    // prefers-reduced-motion対応
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animationElements.forEach(el => {
            el.classList.add('animate');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.15, // 技法リファレンス推奨値
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // once: true の実装
            }
        });
    }, observerOptions);

    animationElements.forEach(el => {
        observer.observe(el);
    });

    // 選ばれる理由の数字アニメーション
    const reasonNumbers = document.querySelectorAll('.reason-number');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.3s';
                numberObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reasonNumbers.forEach(el => {
        numberObserver.observe(el);
    });
}

/**
 * FAQ機能初期化
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        question.addEventListener('click', () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';

            // 他のFAQを閉じる（アコーディオン動作）
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherToggle.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('active');
                }
            });

            // 現在のFAQを切り替え
            if (isOpen) {
                toggle.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                toggle.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });

        // キーボードアクセシビリティ対応
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

/**
 * スムーススクロール初期化
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // フォーカス管理（アクセシビリティ）
                target.focus({ preventScroll: true });
                if (!target.hasAttribute('tabindex')) {
                    target.setAttribute('tabindex', '-1');
                }
            }
        });
    });
}

/**
 * ヘッダースクロール効果初期化
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // スクロール方向に応じてヘッダーの透明度調整
        if (scrollTop > 100) {
            header.style.background = 'rgba(250, 248, 243, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(250, 248, 243, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
}

/**
 * スクロール進行インジケーター初期化
 */
function initScrollProgress() {
    // プログレスバーを作成
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;

        progressBar.style.width = progress + '%';
    }, { passive: true });
}

/**
 * モバイルメニュー初期化（将来の拡張用）
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');

            // ARIA属性更新
            const isOpen = nav.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });

        // メニュー外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // ESCキーでメニューを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.focus();
            }
        });
    }
}

/**
 * パフォーマンス最適化：デバウンス関数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * パフォーマンス最適化：スロットル関数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * レイジーローディング（将来の画像用）
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/**
 * アクセシビリティ強化
 */
function enhanceAccessibility() {
    // フォーカス可視化の強化
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // スキップリンクの追加
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'メインコンテンツにスキップ';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-main);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // メインコンテンツにIDを追加
    const mainContent = document.querySelector('.hero') || document.querySelector('main');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

/**
 * エラーハンドリング
 */
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // 本番環境では適切なエラーレポーティングサービスに送信
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // 本番環境では適切なエラーレポーティングサービスに送信
});

// パフォーマンス監視（開発用）
if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }
    });
}

// アクセシビリティ強化を初期化
document.addEventListener('DOMContentLoaded', enhanceAccessibility);