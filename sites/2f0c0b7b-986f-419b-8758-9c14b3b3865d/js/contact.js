// Contact functionality for おいしい酒場

document.addEventListener('DOMContentLoaded', function() {
    initializeContact();
});

function initializeContact() {
    initPhoneLinks();
    initReservationTracking();
    initSNSLinks();
    initMapInteraction();
    initBusinessHours();
}

// Phone link functionality with click tracking
function initPhoneLinks() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Track phone call attempts for analytics
            const phoneNumber = link.getAttribute('href').replace('tel:', '');
            trackEvent('phone_call', {
                phone_number: phoneNumber,
                source: 'website'
            });

            // Add visual feedback
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Reservation button tracking and enhancement
function initReservationTracking() {
    const reservationButtons = document.querySelectorAll('a[href*="reservation"], a[href*="gnavi"], .btn[href*="reservation"]');

    reservationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Track reservation clicks
            trackEvent('reservation_click', {
                button_text: button.textContent.trim(),
                location: getButtonContext(button)
            });

            // Add loading state for external links
            if (button.getAttribute('target') === '_blank') {
                button.classList.add('loading');
                setTimeout(() => {
                    button.classList.remove('loading');
                }, 1000);
            }
        });
    });
}

// SNS link tracking and validation
function initSNSLinks() {
    const snsLinks = document.querySelectorAll('.sns-link, .footer-sns-links a');

    snsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const snsType = getSNSType(link.getAttribute('href'));

            trackEvent('sns_click', {
                platform: snsType,
                location: 'website'
            });

            // Check if mobile app should be opened
            if (isMobileDevice() && snsType === 'line') {
                // Try to open LINE app first
                const lineUrl = link.getAttribute('href');
                const fallbackUrl = lineUrl;

                setTimeout(() => {
                    window.location = fallbackUrl;
                }, 500);
            }
        });
    });
}

// Map interaction enhancements
function initMapInteraction() {
    const mapContainer = document.querySelector('.access-map');
    const mapIframe = document.querySelector('.access-map iframe');

    if (!mapContainer || !mapIframe) return;

    // Add click overlay to prevent accidental scrolling on mobile
    const overlay = document.createElement('div');
    overlay.className = 'map-overlay';
    overlay.innerHTML = '<div class="map-click-hint">タップで地図を操作</div>';

    mapContainer.style.position = 'relative';
    mapContainer.appendChild(overlay);

    // Remove overlay on click
    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        trackEvent('map_interaction', {
            action: 'activate'
        });
    });

    // Show overlay again when scrolling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (overlay.style.display === 'none') {
                overlay.style.display = 'flex';
            }
        }, 2000);
    }, { passive: true });
}

// Business hours display with current status
function initBusinessHours() {
    updateBusinessStatus();

    // Update every minute
    setInterval(updateBusinessStatus, 60000);
}

function updateBusinessStatus() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes

    // Business hours (17:00 - 24:00, Sunday until 23:00)
    const openTime = 17 * 60; // 17:00
    const closeTimeWeekday = 24 * 60; // 24:00
    const closeTimeSunday = 23 * 60; // 23:00

    // Closed on Tuesday (2) and third Monday of month
    const isTuesday = currentDay === 2;
    const isThirdMonday = currentDay === 1 && getWeekOfMonth(now) === 3;

    let isOpen = false;
    let statusText = '';
    let nextOpenTime = '';

    if (isTuesday || isThirdMonday) {
        statusText = '定休日';
        nextOpenTime = getNextOpenDay();
    } else if (currentDay === 0) { // Sunday
        if (currentTime >= openTime && currentTime < closeTimeSunday) {
            isOpen = true;
            statusText = '営業中（23時まで）';
        } else if (currentTime < openTime) {
            statusText = '本日17時開店';
        } else {
            statusText = '本日は終了';
            nextOpenTime = '明日17時から営業';
        }
    } else { // Monday, Wednesday-Saturday
        if (currentTime >= openTime && currentTime < closeTimeWeekday) {
            isOpen = true;
            statusText = '営業中（24時まで）';
        } else if (currentTime < openTime) {
            statusText = '本日17時開店';
        } else {
            statusText = '本日は終了';
            nextOpenTime = '明日17時から営業';
        }
    }

    // Update status display
    updateStatusDisplay(isOpen, statusText, nextOpenTime);
}

function updateStatusDisplay(isOpen, statusText, nextOpenTime) {
    // Create or update status indicator
    let statusElement = document.querySelector('.business-status');

    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.className = 'business-status';

        const hoursSection = document.querySelector('.hours');
        if (hoursSection) {
            hoursSection.querySelector('.container').insertBefore(statusElement, hoursSection.querySelector('.section-title'));
        }
    }

    statusElement.innerHTML = `
        <div class="status-indicator ${isOpen ? 'open' : 'closed'}">
            <span class="status-dot"></span>
            <span class="status-text">${statusText}</span>
            ${nextOpenTime ? `<span class="next-open">${nextOpenTime}</span>` : ''}
        </div>
    `;
}

// Utility functions
function getButtonContext(button) {
    const section = button.closest('section');
    return section ? section.className || section.id || 'unknown' : 'unknown';
}

function getSNSType(url) {
    if (url.includes('instagram')) return 'instagram';
    if (url.includes('line') || url.includes('lin.ee')) return 'line';
    if (url.includes('twitter')) return 'twitter';
    if (url.includes('facebook')) return 'facebook';
    return 'other';
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getWeekOfMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay();
    const dayOfMonth = date.getDate();

    return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
}

function getNextOpenDay() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    // Find next non-Tuesday
    while (tomorrow.getDay() === 2) {
        tomorrow.setDate(tomorrow.getDate() + 1);
    }

    return `${dayNames[tomorrow.getDay()]}曜日17時から営業`;
}

// Simple analytics tracking function
function trackEvent(eventName, parameters = {}) {
    // This can be replaced with actual analytics implementation
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    } else if (typeof ga !== 'undefined') {
        ga('send', 'event', eventName, parameters);
    }

    // Console log for development
    console.log('Event tracked:', eventName, parameters);
}

// Email link enhancement
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="mailto:"]')) {
        trackEvent('email_click', {
            email: e.target.getAttribute('href').replace('mailto:', '')
        });
    }
});

// Form validation helper (for future use if forms are added)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\-\(\)\+\s]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Error handling for external links
window.addEventListener('beforeunload', (e) => {
    // Clear any loading states
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => el.classList.remove('loading'));
});