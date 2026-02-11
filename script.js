/* ==========================================================================
   1. DONNÉES DE TRADUCTION (CONTENU RICHE)
   Ces textes sont injectés dynamiquement pour la Landing Page
   ========================================================================== */
const projectDescriptions = {
    fr: {
        projectLatentDesc: "Instrument musical expérimental combinant clavier MIDI, IA générative et visualisation 3D temps réel. Interface hybride analogique/numérique pour performance live.",
        project3DescText: "Radio streaming underground avec intégration Twitch et Mixcloud. Player audio personnalisé et interface responsive développée en Next.js.",
        projectFilmDesc: "Designer graphique sur 15+ productions incluant Bad Blood et Unité 9. Création de props numériques, interfaces et animations. Impression d'affiches, tissus, retouche photo et imprimés de toute sorte. Travail sous pression.",
        project2DescText: "Calendrier de l'Avent hybride transformant une boîte de chocolats en aventure interactive. Application web gamifiée.",
        project10DescText: "Formations interactives pour grandes organisations. Scénarisation pédagogique et gamification. Projets confidentiels.",
        project11DescText: "Exploration artistique des outils d'IA générative. Prompt engineering et workflows créatifs complexes.",
        project5DescText: "Pipeline automatisé de production créative. Documentation complète des workflows Python pour génération de contenu.",
        project9DescText: "Générateur de signatures sonores uniques avec visualisation temps réel. Synthèse audio interactive.",
        project1DescText: "Installation immersive combinant terrarium physique et monde VR/AR forestier.",
        project12DescText: "Pages landing programmées pour publicités, pétitions et campagnes d'impact social. Déploiement rapide sur Vercel avec code optimisé.",
        intro: "Designer multimédia et technologue créative explorant les intersections entre art, technologie et expérience.",
        location: "Montréal — Projets en cours, apprentissages actifs et explorations récentes autour des assistants IA, de l’expérimentation immersive et de formes numériques hors norme.",
        ctaPrimaryText: "Voir mon parcours complet (CV)",
        ctaSecondaryText: "ou découvrir mes projets ↓",
        bridgeTitle: "Envie d'en savoir plus sur mon parcours ?",
        bridgeText: "CV détaillé avec 25 ans d'expérience, compétences techniques complètes, parcours professionnel et formations.",
        bridgeButton: "Consulter le CV complet"
    },
    en: {
        projectLatentDesc: "Experimental musical instrument combining MIDI keyboard, generative AI and real-time 3D visualization. Hybrid analog/digital interface.",
        project3DescText: "Underground streaming radio with Twitch and Mixcloud integration. Custom audio player and responsive interface built with Next.js.",
        projectFilmDesc: "Graphic designer on 15+ productions including Bad Blood and Unité 9. Creation of digital props, interfaces and animations. Printing posters, fabrics, photo retouching and all kinds of printed materials. Working under pressure.",
        project2DescText: "Hybrid Advent calendar transforming a chocolate box into an interactive adventure. Gamified web app.",
        project10DescText: "Interactive training for major organizations. Instructional design and gamification. Confidential projects.",
        project11DescText: "Artistic exploration of generative AI tools. Prompt engineering and complex creative workflows.",
        project5DescText: "Automated creative production pipeline. Complete documentation of Python workflows for content generation.",
        project9DescText: "Unique sonic signature generator with real-time visualization. Interactive audio synthesis.",
        project1DescText: "Immersive installation combining physical terrarium and VR/AR forest world.",
        project12DescText: "Programmed landing pages for ads, petitions and social impact campaigns. Fast deployment on Vercel with optimized code.",
        intro: "Multimedia designer and creative technologist exploring intersections between art, technology and experience.",
        location: "Montreal — Ongoing projects, active learning, and recent explorations with AI assistants, immersive experimentation, and unconventional digital forms.",
        ctaPrimaryText: "View full background (CV)",
        ctaSecondaryText: "or discover my projects ↓",
        bridgeTitle: "Want to know more about my background?",
        bridgeText: "Detailed CV with 25 years of experience, complete technical skills, professional background and training.",
        bridgeButton: "View full resume"
    }
};

/* ==========================================================================
   2. GESTION DE LA LANGUE (CORE)
   ========================================================================== */
let currentLang = 'fr';

function initLanguage() {
    // 1. Récupérer la préférence sauvegardée ou celle du navigateur
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language || navigator.userLanguage;
    
    // 2. Définir la langue initiale
    if (savedLang) {
        currentLang = savedLang;
    } else {
        currentLang = browserLang.startsWith('fr') ? 'fr' : 'en';
    }

    // 3. Appliquer la langue
    applyLanguage(currentLang);
}

function switchLanguage() {
    // Basculer fr <-> en
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    
    // Sauvegarder le choix
    localStorage.setItem('preferredLanguage', currentLang);
    
    // Appliquer
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    // A. Mettre à jour l'attribut HTML (Bon pour le SEO et le CSS)
    document.documentElement.lang = lang;
    document.body.classList.remove('lang-fr', 'lang-en');
    document.body.classList.add(`lang-${lang}`);

    // B. Mettre à jour le bouton (On cherche les deux IDs possibles selon la page)
    const langBtn = document.getElementById('langBtn') || document.getElementById('langSwitch');
    if (langBtn) {
        langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
    }

    // C. Traduction via attributs data-fr / data-en (Méthode générique)
    const translatableElements = document.querySelectorAll('[data-fr][data-en]');
    translatableElements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text;
            }
        }
    });

    // D. Traduction via IDs spécifiques (Méthode Landing Page)
    const content = projectDescriptions[lang];
    if (content) {
        for (const [key, value] of Object.entries(content)) {
            const element = document.getElementById(key);
            if (key === 'intro' && document.getElementById('introText')) {
                document.getElementById('introText').innerHTML = value;
            } 
            else if (key === 'location' && document.getElementById('locationText')) {
                document.getElementById('locationText').textContent = value;
            }
            else if (element) {
                element.textContent = value;
            }
        }
    }
}

/* ==========================================================================
   3. NAVIGATION & UI
   ========================================================================== */

// --- Menu Mobile ---
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) {
        console.log('Menu mobile elements not found');
        return;
    }

    console.log('Mobile menu initialized');

    // Ouvrir/Fermer au clic
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Fermer quand on clique sur un lien
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Fermer quand on clique en dehors
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('menu-open') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    function toggleMenu() {
        const isOpen = menuToggle.classList.contains('active');
        console.log('Toggling menu, currently:', isOpen ? 'open' : 'closed');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        menuToggle.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        console.log('Menu opened');
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        console.log('Menu closed');
    }
}

// --- Scroll Smooth (Ancres) ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

// --- Masquer la Nav au Scroll (Optionnel) ---
function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            nav.style.transform = 'translateY(0)';
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
}

/* ==========================================================================
   4. ANIMATIONS (Scroll Reveal) - VERSION OPTIMISÉE
   ========================================================================== */
function initAnimations() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.project-item, .expertise-card, .timeline-item, .exploration-card');
    
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(15px)";
        // Réduire le délai pour une animation plus rapide
        el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        observer.observe(el);
    });
}

/* ==========================================================================
   5. INITIALISATION GÉNÉRALE
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Portfolio Script Loaded");

    // 1. Initialiser la langue
    initLanguage();

    // 2. Gestionnaire d'événements pour le bouton de langue
    const langBtn = document.getElementById('langBtn') || document.getElementById('langSwitch');
    if (langBtn) {
        langBtn.addEventListener('click', switchLanguage);
    }

    // 3. Initialiser l'interface
    initMobileMenu();
    initSmoothScroll();
   if (!location.pathname.includes('cv.html')) {
    initNavScroll();
}
    initNavScroll();
    initAnimations();
    
    // 4. Initialiser le bouton "Retour en haut" (si présent)
    const scrollTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) scrollTopBtn.classList.add('visible');
            else scrollTopBtn.classList.remove('visible');
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    console.log("✅ All features initialized");
});


(function initMoleculesBackground() {
  const canvas = document.getElementById("molecules");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  // ---- Réglages (feel) ----
  const DOTS = 100;         // tu voulais ~100
  const CLUSTER = 48;       // "taille" du nuage (plus petit = plus compact)
  const DOT_MIN = 1.2;
  const DOT_MAX = 2.2;

  // Suivi: spring + damping (accélération/décélération naturelle)
  const SPRING = 0.12;      // force vers la souris (0.08 doux, 0.14 plus nerveux)
  const DAMPING = 0.78;     // friction (0.75 plus amorti, 0.85 plus glissant)

  // Mouvement organique interne (très subtil)
  const DRIFT = 0.012;      // vitesse
  const WIGGLE = 6;         // amplitude (3–10)

  // Couleur
  const DOT_COLOR = "rgba(0,0,0,0.55)"; // noir doux (monte à 0.7 si tu veux plus noir)

  // ---- Canvas setup ----
  let w = 0, h = 0;
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // ---- Target (souris) + position actuelle (centre du cluster) ----
  const target = { x: w * 0.5, y: h * 0.4 };
  const center = { x: target.x, y: target.y, vx: 0, vy: 0 };

  // Suivi souris / touch
  window.addEventListener("mousemove", (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    target.x = t.clientX;
    target.y = t.clientY;
  }, { passive: true });

  // ---- Points: distribution "dense" sans trou au centre ----
  // Technique: rayon = sqrt(rand) -> densité uniforme dans un disque
  const dots = Array.from({ length: DOTS }, () => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * CLUSTER; // pas de centre vide
    return {
      ox: Math.cos(a) * r,       // offset de base autour du centre
      oy: Math.sin(a) * r,
      x: center.x,
      y: center.y,
      vx: 0,
      vy: 0,
      size: DOT_MIN + Math.random() * (DOT_MAX - DOT_MIN),
      seed: Math.random() * 1000
    };
  });

  let tick = 0;

  function animate() {
    tick++;

    // ---- Centre: spring vers target (accélération + freinage) ----
    const dx = target.x - center.x;
    const dy = target.y - center.y;

    center.vx += dx * SPRING;
    center.vy += dy * SPRING;

    center.vx *= DAMPING;
    center.vy *= DAMPING;

    center.x += center.vx;
    center.y += center.vy;

    // ---- Draw ----
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = DOT_COLOR;

    // Points: suivent le centre + petit wiggle interne
    for (const p of dots) {
      const t = tick * DRIFT + p.seed;

      // wiggle très subtil (organique)
      const wx = Math.sin(t) * WIGGLE * 0.15;
      const wy = Math.cos(t * 1.07) * WIGGLE * 0.15;

      // cible point = centre + offset + wiggle
      const tx = center.x + p.ox + wx;
      const ty = center.y + p.oy + wy;

      // point spring (moins fort que centre)
      p.vx += (tx - p.x) * 0.10;
      p.vy += (ty - p.y) * 0.10;

      p.vx *= 0.70;
      p.vy *= 0.70;

      p.x += p.vx;
      p.y += p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
