/* ==========================================================================
   KIM MAURICE - SITE PORTFOLIO
   JavaScript nettoyé - Sans effets de fond liquid
   ========================================================================== */

/* ==========================================================================
   1. DONNÉES DE TRADUCTION
   ========================================================================== */
const projectDescriptions = {
  fr: {
    projectHorsChampDesc:
      "<strong>Hors Champ</strong> est une application de performance musicale en temps réel contrôlée par MIDI, conçue pour l'expérimentation sonore et conceptuelle. L'application combine génération musicale par IA (Google Gemini), synthèse audio, effets en temps réel, looper multi-pistes et contrôle MIDI pour créer une expérience de création musicale live interactive.",
    projectAtelierDesc:
      "Site web conçu et réalisé pour l'artiste — conception visuelle, architecture de contenu et mise en ligne via Cargo Collective.",
    projectInsulaDesc:
      "Site web réalisé pour Insula Care — identité visuelle en ligne, structure éditoriale et déploiement via Cargo Collective.",
    projectLatentDesc:
      "Desktop version: Instrument musical expérimental combinant clavier MIDI, IA générative et visualisation 3D temps réel. Interface hybride analogique/numérique pour performance live.",
    project3DescText:
      "Radio streaming underground avec intégration Twitch et Mixcloud. Player audio personnalisé et interface responsive développée en Next.js.",
    projectFilmDesc:
      "Designer graphique sur 15+ productions incluant Bad Blood et Unité 9. Création de props numériques, interfaces et animations. Impression d'affiches, tissus, retouche photo et imprimés de toute sorte. Travail sous pression.",
    project2DescText:
      "Calendrier de l'Avent hybride transformant une boîte de chocolats en aventure interactive. Application web gamifiée.",
    project10DescText:
      "Extrait de formations interactives pour grandes organisations. Scénarisation pédagogique et gamification. Projets confidentiels.",
    project11DescText:
      "Exploration artistique des outils d'IA générative. Prompt engineering et workflows créatifs complexes.",
    project5DescText:
      "Pipeline automatisé de production créative. Documentation complète des workflows Python pour génération de contenu.",
    project9DescText:
      "Générateur de signatures sonores uniques avec visualisation temps réel. Synthèse audio interactive.",
    project1DescText:
      "Futur projet : Installation immersive combinant terrarium physique et monde VR/AR forestier.",
    project12DescText:
      "Exemple de pages avec code caché : landing programmées pour publicités, pétitions et campagnes d'impact social. Déploiement rapide sur Vercel avec code optimisé.",
    introText:
      "Designer multimédia et technologue créative explorant les intersections entre art, technologie et expérience.",
    locationText: "Montréal — Projets en cours, apprentissages actifs et explorations récentes autour des assistants IA, de l'expérimentation immersive et de formes numériques hors norme.",
    ctaPrimaryText: "Voir mon parcours complet (CV)",
    ctaSecondaryText: "ou découvrir mes projets ↓",
    bridgeTitle: "Envie d'en savoir plus sur mon parcours ?",
    bridgeText:
      "CV détaillé avec 25 ans d'expérience, compétences techniques complètes, parcours professionnel et formations.",
    bridgeButton: "Consulter le CV complet",
    footerText: "© 2025 Kim Maurice",
  },
  en: {
    projectHorsChampDesc:
      "<strong>Hors Champ</strong> is a real-time MIDI-controlled music performance application designed for sonic and conceptual experimentation.",
    projectAtelierDesc:
      "Website designed and built for the artist — visual identity, content architecture and deployment via Cargo Collective.",
    projectInsulaDesc:
      "Website created for Insula Care — online visual identity, editorial structure and deployment via Cargo Collective.",
    projectLatentDesc:
      "Experimental musical instrument combining MIDI keyboard, generative AI and real-time 3D visualization.",
    project3DescText:
      "Underground streaming radio with Twitch and Mixcloud integration. Custom audio player built with Next.js.",
    projectFilmDesc:
      "Graphic designer on 15+ productions including Bad Blood and Unité 9. Digital props, interfaces and animations.",
    project2DescText:
      "Hybrid Advent calendar transforming a chocolate box into an interactive adventure.",
    project10DescText:
      "Interactive training for major organizations. Instructional design and gamification.",
    project11DescText:
      "Artistic exploration of generative AI tools. Prompt engineering and complex creative workflows.",
    project5DescText:
      "Automated creative production pipeline. Complete Python workflow documentation.",
    project9DescText:
      "Unique sonic signature generator with real-time visualization.",
    project1DescText:
      "Immersive installation combining physical terrarium and VR/AR forest world.",
    project12DescText:
      "Landing pages for ads, petitions and social impact campaigns.",
    introText:
      "Multimedia designer and creative technologist exploring intersections between art, technology and experience.",
    locationText: "Montreal — Ongoing projects, active learning, and recent explorations around AI assistants, immersive experimentation, and unconventional digital forms.",
    ctaPrimaryText: "View full background (CV)",
    ctaSecondaryText: "or discover my projects ↓",
    bridgeTitle: "Want to know more about my background?",
    bridgeText:
      "Detailed CV with 25 years of experience and complete technical skills.",
    bridgeButton: "View full resume",
    footerText: "© 2025 Kim Maurice",
  },
};

let currentLang = localStorage.getItem("preferredLanguage") || "fr";

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.body.classList.remove("lang-fr","lang-en");
    document.body.classList.add(`lang-${lang}`);

    const btn = document.getElementById("langBtn");
    if (btn) btn.textContent = lang === "fr" ? "EN" : "FR";

    document.querySelectorAll("[data-fr][data-en]").forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });

    const content = projectDescriptions[lang];
    if (!content) return;

    for (const [key, value] of Object.entries(content)) {
        const element = document.getElementById(key);
        if (element) element.innerHTML = value;
    }
}

function switchLanguage() {
    currentLang = currentLang === "fr" ? "en" : "fr";
    localStorage.setItem("preferredLanguage", currentLang);
    applyLanguage(currentLang);
}

/* ==========================================================================
   2. MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
    const toggle = document.getElementById("mobileMenuToggle");
    const menu = document.querySelector(".nav-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
        menu.classList.toggle("active");
        toggle.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    });

    menu.querySelectorAll("a").forEach(link =>
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            toggle.classList.remove("active");
            document.body.classList.remove("menu-open");
        })
    );
}

/* ==========================================================================
   3. ACTIVE PROJECT ON SCROLL
   ========================================================================== */
function initProjectScroll() {
  const items = document.querySelectorAll('.project-item');
  if(!items.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        items.forEach(x=>x.classList.remove('is-active'));
        e.target.classList.add('is-active');
      }
    });
  }, { threshold: 0.35 });

  items.forEach(item=>io.observe(item));
}

/* ==========================================================================
   4. INIT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);

    const btn = document.getElementById("langBtn");
    if (btn) btn.addEventListener("click", switchLanguage);

    initMobileMenu();
    initProjectScroll();
});


// ── Grid hover descriptions ──
document.querySelectorAll('.grid-item[data-desc]').forEach(item => {
  const desc = item.querySelector('.grid-hover-desc');
  if (desc) desc.textContent = item.dataset.desc;
});
