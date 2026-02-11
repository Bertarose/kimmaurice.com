/* ==========================================================================
   script.js — version clean (sans doublons) + mobile safe + CV safe
   - Fix: initNavScroll appelé 2x -> corrigé
   - Fix: initNavScroll désactivé sur cv.html (et sur mobile si tu veux)
   - Fix: menu mobile iOS -> supporte nav-menu qui est display:none par défaut
   - Fix: smooth scroll ferme le menu
   - Fix: swarmDots -> support touch, resize, performance, pause si onglet hidden
   ========================================================================== */

/* ==========================================================================
   1. DONNÉES DE TRADUCTION (CONTENU RICHE)
   (Landing Page)
   ========================================================================== */
const projectDescriptions = {
  fr: {
    projectLatentDesc:
      "Instrument musical expérimental combinant clavier MIDI, IA générative et visualisation 3D temps réel. Interface hybride analogique/numérique pour performance live.",
    project3DescText:
      "Radio streaming underground avec intégration Twitch et Mixcloud. Player audio personnalisé et interface responsive développée en Next.js.",
    projectFilmDesc:
      "Designer graphique sur 15+ productions incluant Bad Blood et Unité 9. Création de props numériques, interfaces et animations. Impression d'affiches, tissus, retouche photo et imprimés de toute sorte. Travail sous pression.",
    project2DescText:
      "Calendrier de l'Avent hybride transformant une boîte de chocolats en aventure interactive. Application web gamifiée.",
    project10DescText:
      "Formations interactives pour grandes organisations. Scénarisation pédagogique et gamification. Projets confidentiels.",
    project11DescText:
      "Exploration artistique des outils d'IA générative. Prompt engineering et workflows créatifs complexes.",
    project5DescText:
      "Pipeline automatisé de production créative. Documentation complète des workflows Python pour génération de contenu.",
    project9DescText:
      "Générateur de signatures sonores uniques avec visualisation temps réel. Synthèse audio interactive.",
    project1DescText:
      "Installation immersive combinant terrarium physique et monde VR/AR forestier.",
    project12DescText:
      "Pages landing programmées pour publicités, pétitions et campagnes d'impact social. Déploiement rapide sur Vercel avec code optimisé.",
    intro:
      "Designer multimédia et technologue créative explorant les intersections entre art, technologie et expérience.",
    location:
      "Montréal — Projets en cours, apprentissages actifs et explorations récentes autour des assistants IA, de l’expérimentation immersive et de formes numériques hors norme.",
    ctaPrimaryText: "Voir mon parcours complet (CV)",
    ctaSecondaryText: "ou découvrir mes projets ↓",
    bridgeTitle: "Envie d'en savoir plus sur mon parcours ?",
    bridgeText:
      "CV détaillé avec 25 ans d'expérience, compétences techniques complètes, parcours professionnel et formations.",
    bridgeButton: "Consulter le CV complet",
  },
  en: {
    projectLatentDesc:
      "Experimental musical instrument combining MIDI keyboard, generative AI and real-time 3D visualization. Hybrid analog/digital interface.",
    project3DescText:
      "Underground streaming radio with Twitch and Mixcloud integration. Custom audio player and responsive interface built with Next.js.",
    projectFilmDesc:
      "Graphic designer on 15+ productions including Bad Blood and Unité 9. Creation of digital props, interfaces and animations. Printing posters, fabrics, photo retouching and all kinds of printed materials. Working under pressure.",
    project2DescText:
      "Hybrid Advent calendar transforming a chocolate box into an interactive adventure. Gamified web app.",
    project10DescText:
      "Interactive training for major organizations. Instructional design and gamification. Confidential projects.",
    project11DescText:
      "Artistic exploration of generative AI tools. Prompt engineering and complex creative workflows.",
    project5DescText:
      "Automated creative production pipeline. Complete documentation of Python workflows for content generation.",
    project9DescText:
      "Unique sonic signature generator with real-time visualization. Interactive audio synthesis.",
    project1DescText:
      "Immersive installation combining physical terrarium and VR/AR forest world.",
    project12DescText:
      "Programmed landing pages for ads, petitions and social impact campaigns. Fast deployment on Vercel with optimized code.",
    intro:
      "Multimedia designer and creative technologist exploring intersections between art, technology and experience.",
    location:
      "Montreal — Ongoing projects, active learning, and recent explorations with AI assistants, immersive experimentation, and unconventional digital forms.",
    ctaPrimaryText: "View full background (CV)",
    ctaSecondaryText: "or discover my projects ↓",
    bridgeTitle: "Want to know more about my background?",
    bridgeText:
      "Detailed CV with 25 years of experience, complete technical skills, professional background and training.",
    bridgeButton: "View full resume",
  },
};

/* ==========================================================================
   2. GESTION DE LA LANGUE (CORE)
   ========================================================================== */
let currentLang = "fr";

function initLanguage() {
  const savedLang = localStorage.getItem("preferredLanguage");
  const browserLang = navigator.language || navigator.userLanguage;

  if (savedLang) currentLang = savedLang;
  else currentLang = browserLang && browserLang.startsWith("fr") ? "fr" : "en";

  applyLanguage(currentLang);
}

function switchLanguage() {
  currentLang = currentLang === "fr" ? "en" : "fr";
  localStorage.setItem("preferredLanguage", currentLang);
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  // A. HTML lang + body class
  document.documentElement.lang = lang;
  document.body.classList.remove("lang-fr", "lang-en");
  document.body.classList.add(`lang-${lang}`);

  // B. Bouton
  const langBtn =
    document.getElementById("langBtn") || document.getElementById("langSwitch");
  if (langBtn) langBtn.textContent = lang === "fr" ? "EN" : "FR";

  // C. data-fr / data-en
  const translatableElements = document.querySelectorAll("[data-fr][data-en]");
  translatableElements.forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;

    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.placeholder = text;
    else el.innerHTML = text;
  });

  // D. IDs spécifiques (Landing)
  const content = projectDescriptions[lang];
  if (!content) return;

  for (const [key, value] of Object.entries(content)) {
    if (key === "intro" && document.getElementById("introText")) {
      document.getElementById("introText").innerHTML = value;
      continue;
    }
    if (key === "location" && document.getElementById("locationText")) {
      document.getElementById("locationText").textContent = value;
      continue;
    }
    const element = document.getElementById(key);
    if (element) element.textContent = value;
  }
}

/* ==========================================================================
   3. NAVIGATION & UI
   ========================================================================== */

function isCVPage() {
  const path = (location.pathname || "").toLowerCase();
  return path.endsWith("/cv.html") || path.includes("cv.html");
}

function initMobileMenu() {
  const menuToggle = document.getElementById("mobileMenuToggle");
  // IMPORTANT: cible l'ID si possible (cv.html), sinon fallback .nav-menu
  const navMenu = document.getElementById("navMenu") || document.querySelector(".nav-menu");

  if (!menuToggle || !navMenu) return;

  // Sécurité: toujours fermé au chargement (évite bug iOS “menu toujours visible”)
  menuToggle.classList.remove("active");
  navMenu.classList.remove("active");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");

  const openMenu = () => {
    menuToggle.classList.add("active");
    navMenu.classList.add("active");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const isOpen = navMenu.classList.contains("active");
    isOpen ? closeMenu() : openMenu();
  };

  menuToggle.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    },
    { passive: false }
  );

  // Fermer quand on clique un lien
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  // Fermer quand on clique dehors
  document.addEventListener("click", (e) => {
    if (!navMenu.classList.contains("active")) return;
    if (navMenu.contains(e.target) || menuToggle.contains(e.target)) return;
    closeMenu();
  });

  // Fermer au resize (retour desktop)
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 768) closeMenu();
    },
    { passive: true }
  );

  // Expose pour smooth scroll
  window.__closeMenu = closeMenu;
}

// Smooth scroll (ancres) — ferme le menu mobile
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      // Ferme menu si ouvert
      if (typeof window.__closeMenu === "function") window.__closeMenu();

      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    });
  });
}

/* Optionnel: Masquer la nav au scroll
   -> Désactivé sur cv.html (ça causait ton "header bug")
   -> Je le désactive aussi sur mobile (souvent “trop” sur iOS), mais tu peux enlever ce if.
*/
function initNavScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  // Désactive sur mobile pour éviter les glitchs iOS
  if (window.matchMedia("(max-width: 768px)").matches) return;

  let lastScroll = 0;
  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.pageYOffset || 0;

      if (currentScroll <= 0) {
        nav.style.transform = "translateY(0)";
        lastScroll = 0;
        return;
      }

      if (currentScroll > lastScroll && currentScroll > 120) {
        nav.style.transform = "translateY(-100%)";
      } else {
        nav.style.transform = "translateY(0)";
      }

      lastScroll = currentScroll;
    },
    { passive: true }
  );
}

/* ==========================================================================
   4. ANIMATIONS (Scroll Reveal) — safe si pas supporté
   ========================================================================== */
function initAnimations() {
  if (!("IntersectionObserver" in window)) return;

  const observerOptions = { threshold: 0.05, rootMargin: "0px 0px -30px 0px" };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll(
    ".project-item, .expertise-card, .timeline-item, .exploration-card"
  );

  elementsToAnimate.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(15px)";
    el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
    observer.observe(el);
  });
}

/* ==========================================================================
   5. BACKGROUND — Swarm dots (molecules)
   - 100 points
   - Noir #000
   - Individuels, pas “tous pareil”
   - Suivi fluide (accel/decel via easing + damping)
   ========================================================================== */
function initSwarmDots() {
  const canvas = document.getElementById("molecules");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  // SETTINGS
  const DOTS = 100;
  const CLUSTER_RADIUS = 58; // taille du nuage (plus grand = plus dispersé)

  // Noir pur, mais opacité variable
  const ALPHA_MIN = 0.35;
  const ALPHA_MAX = 0.95;

  // Follow target
  const TARGET_FORCE = 0.018;
  const TARGET_DAMP = 0.86;

  // Boids-like
  const COHESION = 0.0038;
  const SEPARATION = 0.040;
  const SEPARATION_DIST = 13;
  const ALIGNMENT = 0.010;

  const MAX_SPEED = 2.4;

  // Micro noise individuel
  const NOISE = 0.030;
  const NOISE_SPEED = 0.010;

  // Leader pull (celui “en avant” entraîne)
  const LEADER_PULL = 0.060;

  let w = 0, h = 0;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

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

  // Target
  const target = { x: w * 0.5, y: h * 0.45 };
  const prevTarget = { x: target.x, y: target.y };

  // souris
  window.addEventListener(
    "mousemove",
    (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    },
    { passive: true }
  );

  // touch (mobile)
  window.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      target.x = t.clientX;
      target.y = t.clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      target.x = t.clientX;
      target.y = t.clientY;
    },
    { passive: true }
  );

  // Init dots (dense, pas de trou au centre)
  const dots = Array.from({ length: DOTS }, () => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * CLUSTER_RADIUS;
    const x = target.x + Math.cos(a) * r;
    const y = target.y + Math.sin(a) * r;

    return {
      x, y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: 1.1 + Math.random() * 1.4,      // variations
      alpha: ALPHA_MIN + Math.random() * (ALPHA_MAX - ALPHA_MIN),
      seed: Math.random() * 1000,
    };
  });

  function clampSpeed(p) {
    const s = Math.hypot(p.vx, p.vy);
    if (s > MAX_SPEED) {
      p.vx = (p.vx / s) * MAX_SPEED;
      p.vy = (p.vy / s) * MAX_SPEED;
    }
  }

  let t = 0;
  let rafId = null;
  let running = true;

  function step() {
    if (!running) return;
    t++;

    // direction du mouvement du target
    const tx = target.x - prevTarget.x;
    const ty = target.y - prevTarget.y;
    prevTarget.x = target.x;
    prevTarget.y = target.y;

    const moveLen = Math.hypot(tx, ty) || 1;
    const dirx = tx / moveLen;
    const diry = ty / moveLen;

    // centre du groupe
    let cx = 0, cy = 0;
    for (const p of dots) { cx += p.x; cy += p.y; }
    cx /= DOTS; cy /= DOTS;

    // leader (le plus "en avant")
    let leader = dots[0];
    let best = -Infinity;
    for (const p of dots) {
      const vx = p.x - cx;
      const vy = p.y - cy;
      const score = vx * dirx + vy * diry;
      if (score > best) { best = score; leader = p; }
    }

    // update physics
    for (let i = 0; i < DOTS; i++) {
      const p = dots[i];

      let ax = (cx - p.x) * COHESION;
      let ay = (cy - p.y) * COHESION;

      ax += (target.x - p.x) * TARGET_FORCE;
      ay += (target.y - p.y) * TARGET_FORCE;

      if (p === leader) {
        ax += (target.x - p.x) * LEADER_PULL;
        ay += (target.y - p.y) * LEADER_PULL;
      }

      // separation + alignment
      let avx = 0, avy = 0, neighbors = 0;
      let sx = 0, sy = 0;

      for (let j = 0; j < DOTS; j++) {
        if (i === j) continue;
        const q = dots[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d = Math.hypot(dx, dy);

        if (d > 0 && d < SEPARATION_DIST) {
          const push = (SEPARATION_DIST - d) / SEPARATION_DIST;
          sx += (dx / d) * push;
          sy += (dy / d) * push;
        }

        if (d < 60) {
          avx += q.vx;
          avy += q.vy;
          neighbors++;
        }
      }

      ax += sx * SEPARATION;
      ay += sy * SEPARATION;

      if (neighbors > 0) {
        avx /= neighbors;
        avy /= neighbors;
        ax += (avx - p.vx) * ALIGNMENT;
        ay += (avy - p.vy) * ALIGNMENT;
      }

      // micro noise (indépendant)
      const n = t * NOISE_SPEED + p.seed;
      ax += Math.sin(n) * NOISE;
      ay += Math.cos(n * 1.13) * NOISE;

      p.vx = (p.vx + ax) * TARGET_DAMP;
      p.vy = (p.vy + ay) * TARGET_DAMP;

      clampSpeed(p);

      p.x += p.vx;
      p.y += p.vy;
    }

    // draw (NOIR)
    ctx.clearRect(0, 0, w, h);
    for (const p of dots) {
      ctx.fillStyle = `rgba(0,0,0,${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(step);
  }

  // pause si onglet caché (perf)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    } else {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(step);
      }
    }
  });

  rafId = requestAnimationFrame(step);
}

/* ==========================================================================
   6. INITIALISATION GÉNÉRALE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1) Langue
  initLanguage();

  // 2) Bouton de langue
  const langBtn =
    document.getElementById("langBtn") || document.getElementById("langSwitch");
  if (langBtn) langBtn.addEventListener("click", switchLanguage);

  // 3) UI
  initMobileMenu();
  initSmoothScroll();

  // 4) Nav hide scroll: seulement hors cv.html
  if (!isCVPage()) initNavScroll();

  // 5) Animations
  initAnimations();

  // 6) Swarm dots (si canvas présent)
  initSwarmDots();

  // 7) Scroll-to-top (si présent)
  const scrollTopBtn = document.getElementById("scrollToTopBtn");
  if (scrollTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        if ((window.pageYOffset || 0) > 300) scrollTopBtn.classList.add("visible");
        else scrollTopBtn.classList.remove("visible");
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
