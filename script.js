/* ==================================
    DONNÉES DE TRADUCTION DU PORTFOLIO
    (Ajoutées pour les projets spécifiques qui ne sont pas gérés par data-fr/data-en)
    ================================== */

const projectDescriptions = {
    fr: {
        project1: "Le projet est un terrarium physique et numérique immersif en VR/AR, où l’utilisateur se retrouve dans un monde forestier tranquille, marchant sur un sentier jusqu’à un coin au bord de l’eau avec un hamac et un feu pour se détendre. Une IA simule et visualise en temps réel la position de l’utilisateur dans ce terrarium miniature réel, offrant un suivi live et un rendu du parcours dans ce monde contemplatif et vivant.",
        project2: "ChocoRétro-Tech est une expérience hybride qui transforme une boîte de chocolat traditionnelle en une aventure interactive. En achetant une boîte physique, l'utilisateur accède à une application web immersive qui gamifie la dégustation quotidienne.",
        project3: "Still FM est une station de radio indépendante diffusée depuis Montréal, présentant le meilleur de la musique et de la culture underground. Nous célébrons la diversité, la créativité et l'authenticité à travers des émissions soigneusement sélectionnées qui couvrent les genres, les époques et les cultures.",
        default: "À venir — Description détaillée"
    },
    en: {
        project1: "The project is a physical and digital immersive terrarium in VR/AR, where the user finds themselves in a serene forest world, walking along a path to a spot by the water with a hammock and a fire to relax. An AI simulates and visualizes the user’s position in real time within this miniature, physical terrarium, providing live tracking and a rendering of their journey through this contemplative and living world.",
        project2: "ChocoRetro-Tech is a hybrid experience that transforms a traditional chocolate box into an interactive adventure. By purchasing a physical box, users gain access to an immersive web app that gamifies the daily tasting ritual.",
        project3: "Still FM is an independent radio station broadcasting from Montreal, showcasing the best in underground music and culture. We celebrate diversity, creativity, and authenticity through carefully curated shows that span genres, eras, and cultures.",
        default: "Coming soon — Detailed description"
    }
};

const projectTranslations = {
    fr: {
        // Traductions spécifiques pour le Projet 3 (titres et métadonnées)
        project3Title: 'Still FM — Radio Underground',
        project3Meta1: '🚧 En cours',
        project3Meta2: 'Next.js • React • API Mixcloud • Twitch',
        project3Meta3: 'Lancement début 2026'
    },
    en: {
        // Traductions spécifiques pour Project 3
        project3Title: 'Still FM — Underground Radio',
        project3Meta1: '🚧 In Progress',
        project3Meta2: 'Next.js • React • Mixcloud API • Twitch',
        project3Meta3: 'Launch Early 2026'
    }
};

/* ==================================
    LANGUAGE SWITCHER (Modifié)
    ================================== */

let currentLang = 'fr';

function switchLanguage() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    
    applyTranslations(currentLang);
    
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', currentLang);
    
    console.log(`Language switched to: ${currentLang.toUpperCase()}`);
}

function applyTranslations(lang) {
    const currentTrans = projectTranslations[lang] || {}; // Utilisation pour les projets
    const currentDesc = projectDescriptions[lang] || {};
    
    // 1. Mise à jour du bouton et de l'attribut HTML lang (Logique de votre script original)
    const langButton = document.getElementById('langBtn'); // J'utilise 'langBtn' comme dans votre HTML
    if (langButton) {
        langButton.textContent = lang === 'fr' ? 'EN' : 'FR';
    }
    document.documentElement.lang = lang;
    
    // 2. Mise à jour de la classe du body
    document.body.className = `lang-${lang}`;
    
    // 3. Mise à jour des éléments avec data-fr/data-en (Logique de votre script original)
    const translatableElements = document.querySelectorAll('[data-fr][data-en]');
    
    translatableElements.forEach(element => {
        const text = lang === 'fr' ? element.getAttribute('data-fr') : element.getAttribute('data-en');
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            element.innerHTML = text;
        }
    });

    // 4. Mise à jour du contenu spécifique au Portfolio (Nouveau - utilise les objets ci-dessus)
    
    // Mise à jour du Projet 3
    if(document.getElementById('project3Title')) {
        document.getElementById('project3Title').textContent = currentTrans.project3Title || document.getElementById('project3Title').textContent;
        document.getElementById('project3Meta1').textContent = currentTrans.project3Meta1 || document.getElementById('project3Meta1').textContent;
        document.getElementById('project3Meta2').textContent = currentTrans.project3Meta2 || document.getElementById('project3Meta2').textContent;
        document.getElementById('project3Meta3').textContent = currentTrans.project3Meta3 || document.getElementById('project3Meta3').textContent;
    }

    // Mise à jour des descriptions de tous les projets
    for (let i = 1; i <= 12; i++) {
        const descElement = document.getElementById(`project${i}DescText`);
        if (descElement) {
            const key = `project${i}`;
            // Utilise la description spécifique si elle existe, sinon utilise la description par défaut
            descElement.textContent = currentDesc[key] || currentDesc.default;
        }
    }
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
    
    // Appliquer toutes les traductions au chargement
    applyTranslations(currentLang);
    
    console.log(`Language initialized: ${currentLang.toUpperCase()}`);
}


/* ==================================
    SCROLL TO TOP BUTTON (Logique conservée)
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
    NAVIGATION (Logique conservée)
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
                // Close mobile menu first
                closeMobileMenu();
                
                // Calculate position (Requires .nav element in HTML)
                const nav = document.querySelector('.nav');
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hide/show navigation on scroll (Requiert la classe .nav sur l'élément de navigation)
let lastScrollTop = 0;
const nav = document.querySelector('.nav'); // Attention: .nav n'est pas dans l'HTML précédent
const scrollThreshold = 100;

function handleNavScroll() {
    // Cette fonction pourrait ne pas être nécessaire si vous n'avez pas d'élément .nav masquable.
    if (!nav || window.innerWidth <= 768) {
        return;
    }
    
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

// Throttle scroll events for performance (Logique conservée)
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
    MOBILE MENU (Logique conservée)
    ================================== */

function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle'); // non trouvé dans HTML actuel
    const navMenu = document.querySelector('.nav-menu'); // non trouvé dans HTML actuel
    
    if (!menuToggle || !navMenu) {
        // console.error('Mobile menu elements not found!');
        return; // Ne pas exécuter si les éléments ne sont pas là
    }
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            // Close menu
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            // Open menu
            menuToggle.classList.add('active');
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function closeMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu && navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==================================
    INTERSECTION OBSERVER FOR ANIMATIONS (Logique conservée)
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
    // Note: Utiliser 'project-item' pour animer la liste du portfolio
    const animateElements = document.querySelectorAll('.value-card, .expertise-card, .project-card, .project-item');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/* ==================================
    ACTIVE SECTION HIGHLIGHTING (Logique conservée)
    ================================== */
// ... (Logique identique à votre script original)

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
    PROJECT IMAGE LOADING (Logique conservée)
    ================================== */
// ... (Logique identique à votre script original)

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
    FORM VALIDATION (if needed later) (Logique conservée)
    ================================== */
// ... (Logique identique à votre script original)

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
    KEYBOARD NAVIGATION (Logique conservée)
    ================================== */
// ... (Logique identique à votre script original)

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
    PERFORMANCE MONITORING (Logique conservée)
    ================================== */
// ... (Logique identique à votre script original)

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
    INITIALIZATION (Logique conservée)
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
    initScrollToTop();
    initKeyboardNav();
    
    // Performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logPerformance();
    }
    
    // Add scroll event listener with throttling
    // Assurez-vous d'avoir un élément avec la classe .nav si vous utilisez handleNavScroll
    if (document.querySelector('.nav')) {
        window.addEventListener('scroll', throttle(handleNavScroll, 100));
    }
    
    // Language switch button
    const langButton = document.getElementById('langBtn'); // J'utilise 'langBtn' ici (comme dans HTML)
    if (langButton) {
        langButton.addEventListener('click', switchLanguage);
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
    
    console.log('✓ Portfolio initialized successfully');
    console.log(`✓ Current language: ${currentLang.toUpperCase()}`);
});

/* ==================================
    SERVICE WORKER REGISTRATION (PWA - Optional)
    ================================== */
// ... (Logique identique à votre script original)


/* ==================================
    UTILITY FUNCTIONS (Logique conservée)
    ================================== */
// ... (Logique identique à votre script original)

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
    EXPORT FOR TESTING (if needed) (Logique conservée)
    ================================== */
// ... (Logique identique à votre script original)

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        switchLanguage,
        initLanguage,
        throttle,
        debounce
    };
}

// ============================================
// MODALS DE PROJETS - JAVASCRIPT (Logique conservée)
// ============================================
// ... (Logique identique à votre script original)

document.addEventListener('DOMContentLoaded', function() {
    
    // Sélectionner tous les éléments
    const projectCards = document.querySelectorAll('.project-item'); // J'utilise .project-item comme dans votre HTML
    const modals = document.querySelectorAll('.project-modal');
    const body = document.body;
    
    // État global pour tracker le modal actuel et l'index de l'image
    let currentModal = null;
    let currentImageIndex = 0;
    
    // ============================================
    // OUVRIR UN MODAL
    // ============================================
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Vous devrez ajouter un attribut data-project-id à vos .project-item
            // Ex: <div class="project-item" data-project-id="1">...</div>
            const projectId = this.getAttribute('data-project-id'); 
            const modal = document.getElementById(`modal-${projectId}`);
            
            if (modal) {
                openModal(modal);
            }
        });
    });
    
    function openModal(modal) {
        currentModal = modal;
        currentImageIndex = 0;
        
        // Afficher le modal
        modal.classList.add('active');
        body.classList.add('modal-open');
        
        // Reset gallery à la première image
        // showImage(0); // Ceci nécessite l'existence des éléments de galerie
        
        // Setup gallery navigation
        // setupGalleryNavigation(modal); // Ceci nécessite l'existence des éléments de galerie
    }
    
    // ============================================
    // FERMER UN MODAL
    // ============================================
    
    // Fermer avec le bouton X
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modal);
            });
        }
    });
    
    // Fermer en cliquant sur l'overlay
    modals.forEach(modal => {
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeModal(modal);
            });
        }
    });
    
    // Fermer avec la touche ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentModal) {
            closeModal(currentModal);
        }
    });
    
    function closeModal(modal) {
        modal.classList.remove('active');
        body.classList.remove('modal-open');
        currentModal = null;
        currentImageIndex = 0;
    }
    
    // ============================================
    // NAVIGATION DANS LA GALLERY
    // ============================================
    
    function setupGalleryNavigation(modal) {
        const images = modal.querySelectorAll('.gallery-image');
        const prevBtn = modal.querySelector('.gallery-prev');
        const nextBtn = modal.querySelector('.gallery-next');
        const dots = modal.querySelectorAll('.dot');
        
        // Boutons Prev/Next
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateGallery(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateGallery(1);
            });
        }
        
        // Dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                showImage(index);
            });
        });
        
        // Navigation au clavier (flèches gauche/droite)
        document.addEventListener('keydown', function(e) {
            if (!currentModal) return;
            
            if (e.key === 'ArrowLeft') {
                navigateGallery(-1);
            } else if (e.key === 'ArrowRight') {
                navigateGallery(1);
            }
        });
    }
    
    function navigateGallery(direction) {
        if (!currentModal) return;
        
        const images = currentModal.querySelectorAll('.gallery-image');
        const totalImages = images.length;
        
        currentImageIndex += direction;
        
        // Loop around
        if (currentImageIndex < 0) {
            currentImageIndex = totalImages - 1;
        } else if (currentImageIndex >= totalImages) {
            currentImageIndex = 0;
        }
        
        showImage(currentImageIndex);
    }
    
    function showImage(index) {
        if (!currentModal) return;
        
        const images = currentModal.querySelectorAll('.gallery-image');
        const dots = currentModal.querySelectorAll('.dot');
        
        currentImageIndex = index;
        
        // Update images
        images.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // ============================================
    // AUTO-HIDE NAVIGATION SI UNE SEULE IMAGE
    // ============================================
    
    modals.forEach(modal => {
        const images = modal.querySelectorAll('.gallery-image');
        const prevBtn = modal.querySelector('.gallery-prev');
        const nextBtn = modal.querySelector('.gallery-next');
        const dotsContainer = modal.querySelector('.gallery-dots');
        
        if (images.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
        }
    });
    
});
