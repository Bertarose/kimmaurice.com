/* ==========================================================================
   1. VARIABLES & RESET
   ========================================================================== */
:root {
    /* Palette de couleurs "Dark Mode" (Par défaut) */
    --marine: #16213e;
    --grey: #8b9bb4; /* Gris bleuté pour la lisibilité sur fond sombre */
    --cream: #FFFEF9;
    --bg: #0a0a1f; /* Bleu nuit profond */
    --neon-green: #39ff14; /* Vert Matrix/Cyberpunk */
    
    /* Effets */
    --glass: rgba(22, 33, 62, 0.6);
    --border-light: rgba(255, 254, 249, 0.1);
    
    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-smooth: 0.4s ease;
    
    /* Typographie */
    --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --font-mono: "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-primary);
    background: var(--bg);
    color: var(--cream);
    line-height: 1.5;
    overflow-x: hidden; /* Empêche le scroll horizontal accidentel */
}

a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s;
}

/* ==========================================================================
   2. ANIMATION STARFIELD (Pixels flottants en arrière-plan)
   ========================================================================== */
.starfield {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: -1; /* Derrière tout le contenu */
    background-image: 
        radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7), transparent),
        radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.7), transparent),
        radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.7), transparent),
        radial-gradient(2px 2px at 80% 10%, rgba(255,255,255,0.6), transparent),
        radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.7), transparent);
    background-size: 200% 200%;
    animation: starfield-move 100s linear infinite;
    opacity: 0.5; /* Subtil */
}

@keyframes starfield-move {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
}

/* ==========================================================================
   3. HEADER & NAVIGATION (Unifié Landing + CV)
   ========================================================================== */
header, .nav {
    padding: 2rem 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-light);
    background: rgba(10, 10, 31, 0.9); /* Effet verre fumé */
    backdrop-filter: blur(10px);
    position: relative; /* Pour la Landing */
    z-index: 100;
}

/* Spécifique à la page CV pour qu'elle colle en haut */
.nav {
    position: sticky;
    top: 0;
    padding: 1rem 4rem;
}

.nav-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
}

/* Logo rond */
.logo, .nav-logo {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s;
}

.logo:hover, .nav-logo:hover { transform: scale(1.05); }

.logo img, .logo-img { width: 100%; height: 100%; object-fit: cover; }

/* Menu Desktop (Page CV) */
.nav-menu {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-link {
    font-size: 0.9rem;
    color: var(--grey);
    text-transform: uppercase;
    letter-spacing: 0.05rem;
    font-weight: 500;
    position: relative;
}

.nav-link:hover { color: var(--neon-green); }

/* Contrôles à droite (Langue + Bouton CV + Burger) */
.header-right, .nav-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.lang-btn, .lang-switch {
    background: transparent;
    border: 1px solid rgba(255, 254, 249, 0.2);
    color: var(--grey);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    font-family: inherit;
}

.lang-btn:hover, .lang-switch:hover {
    color: var(--bg);
    background: var(--neon-green);
    border-color: var(--neon-green);
    font-weight: bold;
}

.cv-link-header {
    background: rgba(255, 254, 249, 0.05);
    border: 1px solid rgba(255, 254, 249, 0.2);
    color: var(--cream);
    padding: 0.8rem 1.5rem;
    border-radius: 20px;
    font-size: 0.85rem;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
}

.cv-link-header:hover {
    border-color: var(--neon-green);
    color: var(--neon-green);
    transform: translateY(-2px);
}

/* Burger Menu Mobile */
.mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    z-index: 200;
}

.mobile-menu-toggle span {
    width: 25px;
    height: 2px;
    background: var(--cream);
    transition: 0.3s;
}

.mobile-menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.mobile-menu-toggle.active span:nth-child(2) { opacity: 0; }
.mobile-menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* ==========================================================================
   4. STRUCTURE PRINCIPALE
   ========================================================================== */
main {
    padding: 6rem 4rem;
    max-width: 1400px;
    margin: 0 auto;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

section { padding: 6rem 0; }

/* Typographie de base */
h1, h2, h3 { font-weight: 300; }

.section-header {
    margin-bottom: 4rem;
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 1rem;
}

.section-header h2 { font-size: 2.5rem; color: var(--cream); }

/* TICKER BANNER (Bandeau défilant) */
.ticker-container {
    background: rgba(255, 254, 249, 0.03);
    border-bottom: 1px solid var(--border-light);
    overflow: hidden;
    padding: 1rem 0;
}
.ticker-wrapper { display: flex; animation: scroll 30s linear infinite; }
.ticker-item { display: flex; align-items: center; white-space: nowrap; padding: 0 4rem; font-size: 0.9rem; color: var(--grey); }
.ticker-item::before { content: '→'; margin-right: 1rem; color: var(--neon-green); }
@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* HERO (Intro) */
.hero {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4rem 0;
}

.intro h1, .hero-title {
    font-size: 3rem;
    line-height: 1.3;
    color: var(--cream);
    max-width: 900px;
}

.intro p, .hero-subtitle {
    font-size: 1.1rem;
    color: var(--grey);
    margin-top: 2rem;
    max-width: 600px;
}

/* Call to Actions (Boutons) */
.hero-cta, .cta-group { margin-top: 3rem; display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center; }

.cta-primary, .btn-primary {
    background: linear-gradient(135deg, var(--neon-green), #2ecc71);
    color: var(--bg);
    padding: 1rem 2rem;
    border-radius: 30px;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    transition: transform 0.3s;
    box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
    border: none;
}

.cta-primary:hover, .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 30px rgba(57, 255, 20, 0.6);
}

.cta-secondary, .btn-secondary {
    background: transparent;
    color: var(--grey);
    padding: 1rem 2rem;
    border: 1px solid var(--grey);
    border-radius: 30px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
}

.cta-secondary:hover, .btn-secondary:hover {
    color: var(--neon-green);
    border-color: var(--neon-green);
}

/* ==========================================================================
   5. LISTE DES PROJETS (Landing Page)
   ========================================================================== */
.projects { margin-top: 2rem; }

.project-item, .project-card-link {
    display: block;
    padding: 4rem 0;
    border-bottom: 1px solid var(--border-light);
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;
}

.project-item:hover, .project-card-link:hover {
    padding-left: 2rem;
    background: linear-gradient(90deg, rgba(22, 33, 62, 0.3), transparent);
    border-color: rgba(255, 254, 249, 0.3);
}

.project-number {
    font-size: 0.85rem;
    color: var(--neon-green);
    margin-bottom: 1rem;
    font-family: var(--font-mono);
}

.project-title {
    font-size: 3.5rem;
    font-weight: 300;
    color: rgba(255, 254, 249, 0.7);
    transition: color 0.3s;
    line-height: 1.1;
}

.project-item:hover .project-title { color: var(--cream); }

.project-meta {
    display: flex;
    gap: 2rem;
    margin-top: 1.5rem;
    font-size: 0.85rem;
    color: var(--grey);
    flex-wrap: wrap;
    font-family: var(--font-mono);
}

/* Badges de statut */
.badge-complete { color: var(--neon-green); border: 1px solid var(--neon-green); padding: 2px 8px; border-radius: 4px; }
.badge-dev { color: #ffc107; border: 1px solid #ffc107; padding: 2px 8px; border-radius: 4px; }
.year-future { color: var(--neon-green); font-weight: 700; }

/* Description (Visible au survol Desktop / Toujours visible Mobile) */
.project-description {
    background: var(--glass);
    color: var(--cream);
    padding: 1.5rem;
    margin-top: 2rem;
    border-left: 3px solid var(--neon-green);
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: all 0.4s ease;
}

.project-item:hover .project-description {
    opacity: 1;
    max-height: 300px;
}

/* ==========================================================================
   6. CONTENU DU CV (Expertise & Timeline)
   ========================================================================== */

/* Grilles */
.expertise-grid, .explorations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

/* Cartes */
.expertise-card, .exploration-card {
    background: rgba(255, 255, 255, 0.03); /* Verre foncé */
    border: 1px solid var(--border-light);
    padding: 2.5rem;
    transition: transform 0.3s;
    border-radius: 4px;
}

.expertise-card:hover, .exploration-card:hover {
    transform: translateY(-5px);
    border-color: var(--neon-green);
    background: rgba(57, 255, 20, 0.02);
}

.expertise-number {
    font-family: var(--font-mono);
    color: var(--neon-green);
    margin-bottom: 1rem;
    opacity: 0.8;
}

.expertise-card h3, .exploration-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--cream);
}

.expertise-card ul { list-style: none; }
.expertise-card li {
    color: var(--grey);
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.expertise-card li:last-child { border-bottom: none; }

.exploration-icon { font-size: 2.5rem; margin-bottom: 1rem; }

/* Timeline (Parcours) */
.timeline-item {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid var(--border-light);
}

.timeline-date {
    font-family: var(--font-mono);
    color: var(--neon-green);
    font-size: 0.9rem;
    padding-top: 0.5rem;
}

.timeline-content h3 { font-size: 1.5rem; color: var(--cream); margin-bottom: 0.5rem; }
.timeline-content h4 { font-size: 1.1rem; color: var(--grey); margin-bottom: 1.5rem; font-style: italic; }

.timeline-list { list-style: none; }
.timeline-list li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.8rem;
    color: #b0bacc;
}
.timeline-list li::before {
    content: '▹';
    position: absolute;
    left: 0;
    color: var(--neon-green);
}
.timeline-list strong { color: var(--cream); font-weight: normal; border-bottom: 1px solid rgba(57, 255, 20, 0.3); }

/* Bridge (Lien CV dans Landing) */
.cv-bridge {
    margin: 8rem 0;
    padding: 4rem;
    background: linear-gradient(135deg, rgba(22, 33, 62, 0.5), rgba(57, 255, 20, 0.05));
    border: 1px solid rgba(57, 255, 20, 0.2);
    border-radius: 20px;
    text-align: center;
}
.btn-cv {
    background: rgba(57, 255, 20, 0.1);
    border: 2px solid var(--neon-green);
    color: var(--neon-green);
    padding: 1rem 2rem;
    border-radius: 30px;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    margin-top: 2rem;
    transition: all 0.3s;
}
.btn-cv:hover { background: var(--neon-green); color: var(--bg); }

/* ==========================================================================
   7. FOOTER
   ========================================================================== */
footer, .footer-cta {
    padding: 4rem;
    border-top: 1px solid var(--border-light);
    background: #050510;
    margin-top: 4rem;
}

.footer-content { text-align: center; max-width: 800px; margin: 0 auto; }
.footer-links { display: flex; justify-content: center; gap: 2rem; margin: 2rem 0; flex-wrap: wrap; }
.footer-links a, .footer-link { color: var(--grey); text-decoration: none; transition: color 0.3s; }
.footer-links a:hover, .footer-link:hover { color: var(--neon-green); }
.footer-copyright { font-size: 0.8rem; color: rgba(255,255,255,0.3); margin-top: 2rem; }

/* ==========================================================================
   8. RESPONSIVE (Mobile & Tablette)
   ========================================================================== */
@media (max-width: 768px) {
    header, .nav { padding: 1.5rem; }
    main { padding: 4rem 1.5rem; }
    
    .intro h1 { font-size: 2rem; }
    .project-title { font-size: 2.2rem; }
    
    .mobile-menu-toggle { display: flex; }
    
    /* Menu Mobile Fullscreen Dark */
    .nav-menu {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: var(--bg);
        flex-direction: column;
        justify-content: center;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 150;
    }
    .nav-menu.active { transform: translateX(0); }
    .nav-link { font-size: 1.5rem; margin: 1rem 0; }
    
    /* Adaptations Mobile */
    .timeline-item { grid-template-columns: 1fr; gap: 0.5rem; }
    .timeline-date { margin-bottom: 0.5rem; }
    .project-meta { flex-direction: column; gap: 0.5rem; }
    
    /* Afficher description projet sans survol sur mobile */
    .project-description { 
        opacity: 1; 
        max-height: none; 
        margin-top: 1rem; 
        padding: 1rem; 
        background: transparent; 
        border-left: 2px solid var(--neon-green); 
        padding-left: 1rem; 
    }
    .project-item:hover { padding-left: 0; }
    
    .footer-links { flex-direction: column; gap: 1rem; }
}

body.menu-open { overflow: hidden; }

/* ==========================================================================
   9. OPTION "LIGHT MODE" (Pour la page CV/Parcours)
   Pour activer : ajouter <body class="light-mode">
   ========================================================================== */
body.light-mode {
    background: #f4f4f4; /* Gris très clair pro */
    color: #1a1a2e;
}

body.light-mode header, 
body.light-mode .nav {
    background: rgba(255, 255, 255, 0.95);
    border-bottom: 1px solid #e0e0e0;
}

body.light-mode .nav-link { color: #555; }
body.light-mode .nav-link:hover { color: #16213e; }
body.light-mode .logo, body.light-mode .nav-logo { filter: invert(1); } /* Inverse le logo en noir */
body.light-mode .mobile-menu-toggle span { background: #1a1a2e; } /* Burger noir */
body.light-mode .nav-menu { background: #f4f4f4; } /* Menu mobile fond clair */

/* Textes */
body.light-mode h1, body.light-mode h2, body.light-mode h3, body.light-mode strong { color: #16213e; }
body.light-mode p, body.light-mode li, body.light-mode .hero-subtitle { color: #555; }

/* Cartes CV en mode clair */
body.light-mode .expertise-card,
body.light-mode .exploration-card,
body.light-mode .timeline-item {
    background: #ffffff;
    border: 1px solid #ddd;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

body.light-mode .expertise-card:hover {
    border-color: var(--marine);
    transform: translateY(-3px);
}

body.light-mode .timeline-date { color: #666; font-weight: bold; }
body.light-mode .timeline-content h4 { color: #777; }
body.light-mode .timeline-list li::before { color: var(--marine); }

/* Boutons */
body.light-mode .btn-secondary { border-color: var(--marine); color: var(--marine); }
body.light-mode .btn-secondary:hover { background: var(--marine); color: white; }

/* Footer maintenu foncé pour le contraste */
body.light-mode footer { background: #16213e; color: white; }
body.light-mode footer a { color: #b0bacc; }
body.light-mode footer h2 { color: white; }
