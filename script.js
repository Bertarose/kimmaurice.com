/* ==========================================================================
   1. TRANSLATIONS
   ========================================================================== */
const projectDescriptions = {
  fr: {
    intro: "Designer multimédia et technologue créative explorant les intersections entre art, technologie et expérience.",
    location: "Montréal — Projets en cours, apprentissages actifs et explorations récentes autour des assistants IA, de l’expérimentation immersive et de formes numériques hors norme.",
    ctaPrimaryText: "Voir mon parcours complet (CV)",
    ctaSecondaryText: "ou découvrir mes projets ↓",
    bridgeTitle: "Envie d'en savoir plus sur mon parcours ?",
    bridgeText: "CV détaillé avec 25 ans d'expérience, compétences techniques complètes, parcours professionnel et formations.",
    bridgeButton: "Consulter le CV complet"
  },
  en: {
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
   2. LANGUAGE SYSTEM
   ========================================================================== */
let currentLang = "fr";

function initLanguage() {
  const savedLang = localStorage.getItem("preferredLanguage");
  const browserLang = navigator.language || "en";

  currentLang = savedLang || (browserLang.startsWith("fr") ? "fr" : "en");
  applyLanguage(currentLang);
}

function switchLanguage() {
  currentLang = currentLang === "fr" ? "en" : "fr";
  localStorage.setItem("preferredLanguage", currentLang);
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.body.classList.remove("lang-fr", "lang-en");
  document.body.classList.add(`lang-${lang}`);

  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = lang === "fr" ? "EN" : "FR";

  document.querySelectorAll("[data-fr][data-en]").forEach(el => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });

  const content = projectDescriptions[lang];
  if (!content) return;

  Object.entries(content).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (el) el.textContent = value;
  });
}

/* ==========================================================================
   3. MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById("mobileMenuToggle");
  const navMenu = document.getElementById("navMenu");

  if (!toggle || !navMenu) return;

  toggle.addEventListener("click", e => {
    e.stopPropagation();
    toggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });

  document.addEventListener("click", e => {
    if (!navMenu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
}

/* ==========================================================================
   4. SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth"
      });
    });
  });
}

/* ==========================================================================
   5. SCROLL ANIMATIONS
   ========================================================================== */
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll(".expertise-card, .timeline-item, .exploration-card")
    .forEach(el => {
      el.style.opacity = 0;
      el.style.transform = "translateY(15px)";
      el.style.transition = "all 0.4s ease";
      observer.observe(el);
    });
}

/* ==========================================================================
   6. WAVES BACKGROUND
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
    ctx.strokeStyle = "rgba(0,0,0,0.04)";

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let x = 0; x < w; x += 8) {
        const y = h / 2 + Math.sin(x * 0.01 + t + i * 1.5) * (12 + i * 6);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   7. SWARM DOTS (MOLECULES)
   ========================================================================== */
(function swarmDots() {
  const canvas = document.getElementById("molecules");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const DOTS = 100;
  const dots = Array.from({ length: DOTS }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: 0,
    vy: 0,
    size: 1 + Math.random() * 1.5
  }));

  const mouse = { x: w / 2, y: h / 2 };

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);

    dots.forEach(p => {
      p.vx += (mouse.x - p.x) * 0.002;
      p.vy += (mouse.y - p.y) * 0.002;

      p.vx *= 0.95;
      p.vy *= 0.95;

      p.x += p.vx;
      p.y += p.vy;

      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ==========================================================================
   8. INIT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initMobileMenu();
  initSmoothScroll();
  initAnimations();
  initWaves();

  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.addEventListener("click", switchLanguage);
});
