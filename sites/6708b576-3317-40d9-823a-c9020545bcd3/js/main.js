// メイン機能JavaScript

document.addEventListener('DOMContentLoaded', function() {

    // Intersection Observer API でスクロール連動アニメーション（TECH:①）
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

    if (animateOnScrollElements.length > 0) {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // 一度だけ発火させる（戻り再発火は疲れるため）
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateOnScrollElements.forEach(function(element) {
            observer.observe(element);
        });
    }

    // スムーズスクロール
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ヘッダーのスクロール制御
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // スクロール位置が100px以上の場合にヘッダーを表示
        if (scrollTop > 100) {
            if (scrollTop > lastScrollTop) {
                // 下スクロール時：ヘッダーを隠す
                header.style.transform = 'translateY(-100%)';
            } else {
                // 上スクロール時：ヘッダーを表示
                header.style.transform = 'translateY(0)';
            }
        } else {
            // トップ付近では常に表示
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // 電話番号リンクのクリック追跡（分析用）
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Google Analytics等でイベント追跡する場合はここに記述
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    event_category: 'contact',
                    event_label: 'phone_call'
                });
            }
        });
    });

    // LINEリンクのクリック追跡（分析用）
    const lineLinks = document.querySelectorAll('a[href*="line.me"]');
    lineLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'line_click', {
                    event_category: 'contact',
                    event_label: 'line_official'
                });
            }
        });
    });

    // 営業時間の動的表示
    function updateBusinessHours() {
        const now = new Date();
        const day = now.getDay(); // 0:日 1:月 2:火 3:水 4:木 5:金 6:土
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute;

        let isOpen = false;

        // 営業時間判定
        // 月火木金: 9:00-12:00, 15:00-20:00
        // 土: 9:00-15:00
        // 水日祝: 定休日

        if (day === 1 || day === 2 || day === 4 || day === 5) { // 月火木金
            if ((currentTime >= 540 && currentTime < 720) || // 9:00-12:00
                (currentTime >= 900 && currentTime < 1200)) { // 15:00-20:00
                isOpen = true;
            }
        } else if (day === 6) { // 土
            if (currentTime >= 540 && currentTime < 900) { // 9:00-15:00
                isOpen = true;
            }
        }

        // 営業状態をヘッダーに表示（オプション）
        const phoneButton = document.querySelector('.btn-phone');
        if (phoneButton && !isOpen) {
            phoneButton.setAttribute('title', '現在は営業時間外です。お急ぎの場合はLINEまたはメールでお問い合わせください。');
        }
    }

    // 初回実行
    updateBusinessHours();

    // 1分ごとに営業時間をチェック
    setInterval(updateBusinessHours, 60000);

    // パフォーマンス最適化：画像の遅延読み込み
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // マウス追跡エフェクト（カード要素用）
    const cards = document.querySelectorAll('.problem-card, .menu-card, .testimonial-card, .contact-method');

    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // prefers-reduced-motionの検出
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        // アニメーション無効時の処理
        animateOnScrollElements.forEach(function(element) {
            element.classList.add('animate');
            element.style.opacity = '1';
            element.style.transform = 'none';
        });

        // マウス追跡エフェクトも無効化
        cards.forEach(function(card) {
            card.style.transform = 'none';
        });
    }

    // メディアクエリの変更を監視
    prefersReducedMotion.addEventListener('change', function() {
        if (prefersReducedMotion.matches) {
            animateOnScrollElements.forEach(function(element) {
                element.classList.add('animate');
                element.style.opacity = '1';
                element.style.transform = 'none';
            });
        }
    });

});

// レスポンシブ対応：ウィンドウリサイズ時の処理
window.addEventListener('resize', function() {
    // モバイル表示時はマウス追跡エフェクトを無効化
    const isMobile = window.innerWidth < 768;
    const cards = document.querySelectorAll('.problem-card, .menu-card, .testimonial-card, .contact-method');

    if (isMobile) {
        cards.forEach(function(card) {
            card.style.transform = 'none';
        });
    }
});

// サービスワーカー（PWA対応の準備）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // 将来的にPWA化する場合はここでサービスワーカーを登録
        // navigator.serviceWorker.register('/sw.js');
    });
}