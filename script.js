/* ==================================
   LANGUAGE SWITCHER
   ================================== */

let currentLang = 'fr';

function switchLanguage() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    
    // Update button text
    const langButton = document.getElementById('langSwitch');
    langButton.textContent = currentLang === 'fr' ? 'EN' : 'FR';
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // Update body class for language
    document.body.className = `lang-${currentLang}`;
    
    // Update all elements with data-fr and data-en attributes
    const translatableElements = document.querySelectorAll('[data-fr][data-en]');
    
    translatableElements.forEach(element => {
        const text = currentLang === 'fr' ? element.getAttribute('data-fr') : element.getAttribute('data-en');
        
        // Check if element is an input/textarea
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            // Use innerHTML to preserve HTML tags like <strong>
            element.innerHTML = text;
        }
    });
    
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', currentLang);
    
    console.log(`Language switched to: ${currentLang.toUpperCase()}`);
}

// Initialize language on page load
function initLanguage() {
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    
    // Check browser language if no saved preference
    const browserLang = navigator.language || navigator.userLanguage;
    const isFrench = browserLang.startsWith('fr');
    
    // Set initial language
    currentLang = savedLang || (isFrench ? 'fr' : 'en');
    
    // Set body class for language
    document.body.className = `lang-${currentLang}`;
    
    // Update button text
    const langButton = document.getElementById('langSwitch');
    if (langButton) {
        langButton.textContent = currentLang === 'fr' ? 'EN' : 'FR';
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // If not French, apply English translations
    if (currentLang === 'en') {
        const translatableElements = document.querySelectorAll('[data-fr][data-en]');
        translatableElements.forEach(element => {
            const text = element.getAttribute('data-en');
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.innerHTML = text;
            }
        });
    }
    
    console.log(`Language initialized: ${currentLang.toUpperCase()}`);
}

/* ==================================
   SCROLL TO TOP BUTTON
   ================================== */

function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTopBtn');
    
    if (!scrollButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }, 200));
    
    // Scroll to top on click
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==================================
   NAVIGATION
   ================================== */

// Smooth scroll for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Hide/show navigation on scroll
let lastScrollTop = 0;
const nav = document.querySelector('.nav');
const scrollThreshold = 100;

function handleNavScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
            // Scrolling down - hide nav
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show nav
            nav.style.transform = 'translateY(0)';
        }
    } else {
        // At top of page - always show
        nav.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
}

// Throttle scroll events for performance
function throttle(func, wait) {
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

/* ==================================
   MOBILE MENU
   ================================== */

function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
}

function closeMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.getElementById('mobileMenuToggle');
    
    if (navMenu && menuToggle) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    }
});

// Close mobile menu on window resize to desktop size
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

/* ==================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ================================== */

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.value-card, .expertise-card, .project-card');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/* ==================================
   ACTIVE SECTION HIGHLIGHTING
   ================================== */

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ==================================
   PROJECT IMAGE LOADING
   ================================== */

function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/* ==================================
   FORM VALIDATION (if needed later)
   ================================== */

function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add form validation logic here
            console.log('Form submitted');
            
            // Example: Send form data
            const formData = new FormData(contactForm);
            
            // Add your form submission logic here
            // fetch('/api/contact', { method: 'POST', body: formData })
        });
    }
}

/* ==================================
   SCROLL TO TOP BUTTON
   ================================== */

/* ==================================
   KEYBOARD NAVIGATION
   ================================== */

function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
        
        // Language switch with Ctrl/Cmd + L
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            switchLanguage();
        }
    });
}

/* ==================================
   PERFORMANCE MONITORING
   ================================== */

function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                    console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.fetchStart, 'ms');
                }
            }, 0);
        });
    }
}

/* ==================================
   INITIALIZATION
   ================================== */

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kim Maurice Portfolio - Initializing...');
    
    // Core functionality
    initLanguage();
    initSmoothScroll();
    initMobileMenu();
    initScrollAnimations();
    highlightActiveSection();
    initLazyLoading();
    initFormValidation();
    initScrollToTop();  // New scroll to top
    initKeyboardNav();
    
    // Performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logPerformance();
    }
    
    // Add scroll event listener with throttling
    window.addEventListener('scroll', throttle(handleNavScroll, 100));
    
    // Language switch button
    const langButton = document.getElementById('langSwitch');
    if (langButton) {
        langButton.addEventListener('click', switchLanguage);
    }
    
    console.log('✓ Portfolio initialized successfully');
    console.log(`✓ Current language: ${currentLang.toUpperCase()}`);
});

/* ==================================
   SERVICE WORKER REGISTRATION (PWA - Optional)
   ================================== */

// Uncomment to enable PWA functionality
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
*/

/* ==================================
   UTILITY FUNCTIONS
   ================================== */

// Debounce function for performance
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

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Copy to clipboard function
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            textArea.remove();
            return Promise.resolve();
        } catch (error) {
            textArea.remove();
            return Promise.reject(error);
        }
    }
}

/* ==================================
   EXPORT FOR TESTING (if needed)
   ================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        switchLanguage,
        initLanguage,
        throttle,
        debounce
    };
}
