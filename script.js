/* ==========================================================================
   script.js — version clean + mobile safe + CV safe
   ========================================================================== */

/* ==========================================================================
   1. DONNÉES DE TRADUCTION
   ========================================================================== */
const projectDescriptions = {
  fr: {
    intro:
      "Designer multimédia et technologue créative explorant les intersections entre art, technologie et expérience.",
    location:
      "Montréal — Projets en cours, apprentissages actifs et explorations récentes autour des assistants IA, de l’expérimentation immersive et de formes numériques hors norme.",
    ctaPrimaryText: "Voir mon parcours complet (CV)",
    ctaSecondaryText: "ou découvrir mes projets ↓",
    bridgeTitle: "Envie d'en savoir plus sur mon parcours ?",
    bridgeText:
      "CV détaillé avec 25 ans d'expérience, compétences techniques complètes et parcours professionnel.",
    bridgeButton: "Consulter le CV complet",
  },
  en: {
    intro:
      "Multimedia designer and creative technologist exploring intersections between art, technology and experience.",
    location:
      "Montreal — Ongoing projects, active learning, and recent explorations with AI assistants and immersive experimentation.",
    ctaPrimaryText: "View full background (CV)",
    ctaSecondaryText: "or discover my projects ↓",
    bridgeTitle: "Want to know more about my background?",
    bridgeText:
      "Detailed CV with 25 years of experience, complete technical skills and professional background.",
    bridgeButton: "View full resume",
  },
};

/* ==========================================================================
   2. LANGUAGE
   ========================================================================== */
let currentLang = "fr";

function initLanguage() {
  const savedLang = localStorage.getItem("preferredLanguage");
  const browserLang = navigator.language || "en";

  if (savedLang) currentLang = savedLang;
  else currentLang = browserLang.startsWith("fr") ? "fr" : "en";

  applyLanguage(currentLang);
}

function switchLanguage() {
  currentLang = currentLang === "fr" ? "en" : "fr";
  localStorage.setItem("preferredLanguage", currentLang);
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;

  const langBtn =
    document.getElementById("langBtn") || document.getElementById("langSwitch");
  if (langBtn) langBtn.textContent = lang === "fr" ? "EN" : "FR";

  const content = projectDescriptions[lang];
  if (!content) return;

  Object.entries(content).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (el) el.textContent = value;
  });

  if (document.getElementById("introText"))
    document.getElementById("introText").innerHTML = content.intro;

  if (document.getElementById("locationText"))
    document.getElementById("locationText").textContent = content.location;
}

/* ==========================================================================
   3. PAGE HELPERS
   ========================================================================== */
function isCVPage() {
  return location.pathname.toLowerCase().includes("cv.html");
}

/* ==========================================================================
   4. MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById("mobileMenuToggle");
  const menu = document.getElementById("navMenu");

  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.classList.remove("active");
    menu.classList.remove("active");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    toggle.classList.add("active");
    menu.classList.add("active");
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const toggleMenu = () => {
    menu.classList.contains("active") ? closeMenu() : openMenu();
  };

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", closeMenu)
  );

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("active")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

  window.__closeMenu = closeMenu;
}

/* ==========================================================================
   5. SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      if (window.__closeMenu) window.__closeMenu();

      const offset = 80;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ==========================================================================
   6. NAV SCROLL (desktop only)
   ========================================================================== */
function initNavScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  if (window.matchMedia("(max-width: 768px)").matches) return;
  if (isCVPage()) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.pageYOffset;

    if (current > lastScroll && current > 120)
      nav.style.transform = "translateY(-100%)";
    else nav.style.transform = "translateY(0)";

    lastScroll = current;
  });
}

/* ==========================================================================
   7. SCROLL ANIMATIONS
   ========================================================================== */
function initAnimations() {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    });
  });

  document
    .querySelectorAll(".project-item, .expertise-card, .timeline-item")
    .forEach((el) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(15px)";
      el.style.transition = "all 0.4s ease";
      observer.observe(el);
    });
}

/* ==========================================================================
   8. MOLECULES BACKGROUND
   ========================================================================== */
function initSwarmDots() {
  const canvas = document.getElementById("molecules");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const DOTS = 100;

  let w, h;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const mouse = { x: w / 2, y: h / 2 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
  });

  const dots = Array.from({ length: DOTS }, () => ({
    x: mouse.x + Math.random() * 40 - 20,
    y: mouse.y + Math.random() * 40 - 20,
    vx: Math.random() - 0.5,
    vy: Math.random() - 0.5,
    size: 1 + Math.random() * 1.5,
    alpha: 0.3 + Math.random() * 0.7,
  }));

   /* ==========================================================================
   WAVES BACKGROUND (ultra subtle)
   ========================================================================== */
function initWaves() {
  const canvas = document.getElementById("waves");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  let t = 0;

  function draw() {
    t += 0.005;

    ctx.clearRect(0, 0, w, h);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,0.04)"; // TRÈS pâle

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();

      for (let x = 0; x < w; x += 8) {
        const y =
          h / 2 +
          Math.sin(x * 0.01 + t + i * 1.5) * (12 + i * 6);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

  function animate() {
    ctx.clearRect(0, 0, w, h);

    dots.forEach((p) => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;

      p.vx += dx * 0.0005;
      p.vy += dy * 0.0005;

      p.vx *= 0.95;
      p.vy *= 0.95;

      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = `rgba(0,0,0,${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initLanguage();

  const langBtn =
    document.getElementById("langBtn") || document.getElementById("langSwitch");
  if (langBtn) langBtn.addEventListener("click", switchLanguage);

  initMobileMenu();
  initSmoothScroll();
  initNavScroll();
  initAnimations();
  initSwarmDots();
});
