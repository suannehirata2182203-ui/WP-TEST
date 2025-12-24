document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initBurgerMenu();
    initCookieBanner();
    initSmoothScroll();
    initAnimations();
});

window.addEventListener('pageshow', function(event) {
    var loader = document.querySelector('.page-loader');
    if (loader) {
        if (event.persisted) {
            loader.classList.add('hidden');
            sessionStorage.removeItem('isNavigating');
        }
    }
});

function initPageLoader() {
    var loader = document.querySelector('.page-loader');
    if (!loader) return;
    
    var isNavigating = sessionStorage.getItem('isNavigating');
    
    if (isNavigating === 'true') {
        loader.classList.remove('hidden');
        sessionStorage.removeItem('isNavigating');
        
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 800);
    } else {
        loader.classList.add('hidden');
    }
    
    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.getAttribute('href');
        
        if (href && 
            link.hostname === window.location.hostname && 
            !link.hasAttribute('target') && 
            href.indexOf('#') !== 0 &&
            href.indexOf('mailto:') !== 0 &&
            href.indexOf('tel:') !== 0 &&
            href !== '#') {
            
            link.addEventListener('click', handleLinkClick);
        }
    }
    
    function handleLinkClick(e) {
        var href = this.getAttribute('href');
        if (href && href !== '#' && href.indexOf('#') !== 0) {
            e.preventDefault();
            sessionStorage.setItem('isNavigating', 'true');
            loader.classList.remove('hidden');
            
            var targetHref = href;
            setTimeout(function() {
                window.location.href = targetHref;
            }, 400);
        }
    }
}

function initBurgerMenu() {
    var burger = document.querySelector('.burger-menu');
    var mobileNav = document.querySelector('.mobile-nav');
    
    if (!burger || !mobileNav) return;
    
    burger.addEventListener('click', function() {
        var isActive = burger.classList.contains('active');
        
        if (isActive) {
            burger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            burger.setAttribute('aria-expanded', 'false');
        } else {
            burger.classList.add('active');
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
            burger.setAttribute('aria-expanded', 'true');
        }
    });
    
    var mobileLinks = mobileNav.querySelectorAll('a');
    for (var i = 0; i < mobileLinks.length; i++) {
        mobileLinks[i].addEventListener('click', function() {
            burger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            burger.setAttribute('aria-expanded', 'false');
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            burger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            burger.setAttribute('aria-expanded', 'false');
        }
    });
}

function initCookieBanner() {
    var banner = document.querySelector('.cookie-banner');
    if (!banner) return;
    
    var pathname = window.location.pathname;
    var isHomePage = pathname.endsWith('home.html') || 
                     pathname === '/' ||
                     pathname.endsWith('/') ||
                     pathname === '';
    
    var cookieConsent = localStorage.getItem('cookieConsent');
    
    if (isHomePage && !cookieConsent) {
        setTimeout(function() {
            banner.classList.add('show');
            banner.classList.remove('hidden');
        }, 1500);
    } else {
        banner.classList.add('hidden');
        banner.classList.remove('show');
    }
    
    var acceptBtn = banner.querySelector('.cookie-btn-accept');
    var declineBtn = banner.querySelector('.cookie-btn-decline');
    var settingsBtn = banner.querySelector('.cookie-btn-settings');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            hideCookieBanner();
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            hideCookieBanner();
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showCookieSettings();
        });
    }
    
    function hideCookieBanner() {
        banner.classList.remove('show');
        setTimeout(function() {
            banner.classList.add('hidden');
        }, 500);
    }
    
    function showCookieSettings() {
        var settingsModal = document.createElement('div');
        settingsModal.className = 'cookie-settings-modal';
        settingsModal.setAttribute('role', 'dialog');
        settingsModal.setAttribute('aria-labelledby', 'cookie-settings-title');
        settingsModal.innerHTML = 
            '<div class="cookie-settings-content">' +
                '<h3 id="cookie-settings-title">Cookie Settings</h3>' +
                '<div class="cookie-option">' +
                    '<label>' +
                        '<input type="checkbox" id="essential-cookies" checked disabled>' +
                        '<span>Essential Cookies (Required)</span>' +
                    '</label>' +
                    '<p>These cookies are necessary for the website to function properly.</p>' +
                '</div>' +
                '<div class="cookie-option">' +
                    '<label>' +
                        '<input type="checkbox" id="analytics-cookies">' +
                        '<span>Analytics Cookies</span>' +
                    '</label>' +
                    '<p>Help us understand how visitors interact with our website.</p>' +
                '</div>' +
                '<div class="cookie-option">' +
                    '<label>' +
                        '<input type="checkbox" id="marketing-cookies">' +
                        '<span>Marketing Cookies</span>' +
                    '</label>' +
                    '<p>Used to track visitors across websites for advertising purposes.</p>' +
                '</div>' +
                '<div class="cookie-settings-buttons">' +
                    '<button type="button" class="cookie-btn cookie-btn-save">Save Preferences</button>' +
                    '<button type="button" class="cookie-btn cookie-btn-close">Close</button>' +
                '</div>' +
            '</div>';
        
        settingsModal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;';
        
        var content = settingsModal.querySelector('.cookie-settings-content');
        content.style.cssText = 'background:#242424;padding:2rem;border-radius:16px;max-width:500px;width:90%;border:1px solid #3d3d3d;';
        
        var h3 = settingsModal.querySelector('h3');
        h3.style.cssText = 'font-family:"Playfair Display",serif;font-size:1.5rem;color:#e8e8e8;margin-bottom:1.5rem;';
        
        var options = settingsModal.querySelectorAll('.cookie-option');
        for (var i = 0; i < options.length; i++) {
            options[i].style.cssText = 'margin-bottom:1.5rem;padding:1rem;background:#1a1a1a;border-radius:8px;';
        }
        
        var labels = settingsModal.querySelectorAll('.cookie-option label');
        for (var j = 0; j < labels.length; j++) {
            labels[j].style.cssText = 'display:flex;align-items:center;gap:0.5rem;color:#e8e8e8;font-weight:500;cursor:pointer;';
        }
        
        var paragraphs = settingsModal.querySelectorAll('.cookie-option p');
        for (var k = 0; k < paragraphs.length; k++) {
            paragraphs[k].style.cssText = 'font-size:0.9rem;color:#a0a0a0;margin-top:0.5rem;';
        }
        
        var buttonsDiv = settingsModal.querySelector('.cookie-settings-buttons');
        buttonsDiv.style.cssText = 'display:flex;gap:1rem;margin-top:1.5rem;';
        
        var buttons = settingsModal.querySelectorAll('.cookie-btn');
        for (var m = 0; m < buttons.length; m++) {
            buttons[m].style.cssText = 'padding:0.8rem 1.5rem;border-radius:30px;border:none;cursor:pointer;font-family:"Bebas Neue",sans-serif;letter-spacing:1px;';
        }
        
        var saveBtn = settingsModal.querySelector('.cookie-btn-save');
        saveBtn.style.background = 'linear-gradient(135deg,#c9853e,#e6a55a)';
        saveBtn.style.color = '#1a1a1a';
        
        var closeBtn = settingsModal.querySelector('.cookie-btn-close');
        closeBtn.style.background = 'transparent';
        closeBtn.style.color = '#a0a0a0';
        closeBtn.style.border = '1px solid #3d3d3d';
        
        document.body.appendChild(settingsModal);
        
        saveBtn.addEventListener('click', function() {
            var analytics = document.getElementById('analytics-cookies').checked;
            var marketing = document.getElementById('marketing-cookies').checked;
            
            localStorage.setItem('cookieConsent', 'custom');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            localStorage.setItem('analyticsConsent', analytics.toString());
            localStorage.setItem('marketingConsent', marketing.toString());
            
            if (settingsModal.parentNode) {
                document.body.removeChild(settingsModal);
            }
            hideCookieBanner();
        });
        
        closeBtn.addEventListener('click', function() {
            if (settingsModal.parentNode) {
                document.body.removeChild(settingsModal);
            }
        });
        
        settingsModal.addEventListener('click', function(e) {
            if (e.target === settingsModal) {
                if (settingsModal.parentNode) {
                    document.body.removeChild(settingsModal);
                }
            }
        });
        
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape' && settingsModal.parentNode) {
                document.body.removeChild(settingsModal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
}

function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

function initAnimations() {
    if (!('IntersectionObserver' in window)) {
        var elements = document.querySelectorAll('.article-card, .stat-item, .timeline-item');
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add('fade-in');
        }
        return;
    }
    
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    var observer = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        }
    }, observerOptions);
    
    var animElements = document.querySelectorAll('.article-card, .stat-item, .timeline-item');
    for (var j = 0; j < animElements.length; j++) {
        animElements[j].style.opacity = '0';
        observer.observe(animElements[j]);
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});
