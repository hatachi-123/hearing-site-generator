// まるもり青果店 メインJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // アニメーション制御
    initializeAnimations();

    // スムーススクロール
    initializeSmoothScroll();

    // 統計数字のカウンターアニメーション
    initializeCounterAnimation();

    // 電話番号クリック追跡
    initializePhoneTracking();

    // パララックス効果（軽微）
    initializeParallax();
});

// Intersection Observer を使用したアニメーション制御
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // アニメーション対象要素の監視
    const animateElements = document.querySelectorAll([
        '.section-header',
        '.about-text',
        '.about-image',
        '.stat-item',
        '.product-card',
        '.point-item',
        '.testimonial-card',
        '.owner-image',
        '.owner-text',
        '.info-item',
        '.phone-contact',
        '.visit-info',
        '.special-services'
    ].join(', '));

    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// スムーススクロール
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 統計数字のカウンターアニメーション
function initializeCounterAnimation() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.textContent;

                // 数字の場合のみカウンターアニメーション実行
                if (/^\d+$/.test(target)) {
                    animateCounter(counter, parseInt(target));
                }

                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.7
    });

    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// カウンターアニメーション実行
function animateCounter(element, target) {
    const duration = 2000; // 2秒
    const increment = target / (duration / 16); // 60fps想定
    let current = 0;

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

// 電話番号クリック追跡
function initializePhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // アナリティクス送信等の処理がある場合はここに追加
            // 現在はクリック追跡のみ
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            // gtag('event', 'phone_call', { 'phone_number': phoneNumber });
        });
    });
}

// 軽微なパララックス効果
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.hero::before');

    if (parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach(element => {
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// ページトップへのスクロールボタン（必要に応じて）
function initializeScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--color-accent);
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    document.body.appendChild(scrollButton);

    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
}

// 営業時間の現在状態表示
function initializeBusinessHours() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday

    const businessStatus = document.createElement('div');
    businessStatus.className = 'business-status';

    let isOpen = false;
    let message = '';

    // 水曜日は定休日（day === 3）
    if (currentDay === 3) {
        message = '本日は定休日です';
    } else if (currentDay === 0 || currentDay === 6) {
        // 土日祝：8:00-18:00
        isOpen = currentHour >= 8 && currentHour < 18;
        message = isOpen ? '営業中（〜18:00）' : '営業時間外';
    } else {
        // 平日：7:00-19:00
        isOpen = currentHour >= 7 && currentHour < 19;
        message = isOpen ? '営業中（〜19:00）' : '営業時間外';
    }

    businessStatus.innerHTML = `
        <span class="status-indicator ${isOpen ? 'open' : 'closed'}"></span>
        ${message}
    `;

    businessStatus.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: ${isOpen ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.position = 'relative';
        heroSection.appendChild(businessStatus);
    }
}

// 画像遅延読み込み（必要に応じて）
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ウィンドウリサイズ時の処理
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // リサイズ時の処理があればここに追加
    }, 250);
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    // プロダクション環境では適切なエラー追跡サービスに送信
    // 開発時のデバッグ用（本番では削除）
});

// パフォーマンス監視（必要に応じて）
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            // パフォーマンス指標の記録
        });
    });

    observer.observe({ entryTypes: ['navigation', 'measure'] });
}

// サービスワーカー登録（PWA対応時）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js');
    });
}