/* ==========================================================================
   KIM MAURICE - LIQUID GRADIENT BACKGROUND
   Three.js Shader Animation with Touch Interaction
   ========================================================================== */

/* ==========================================================================
   1. DONNÉES DE TRADUCTION
   ========================================================================== */
const projectDescriptions = {
  fr: {
    projectHorsChampDesc:
      "<strong>Hors Champ</strong> est une application de performance musicale en temps réel contrôlée par MIDI, conçue pour l'expérimentation sonore et conceptuelle. L'application combine génération musicale par IA (Google Gemini), synthèse audio, effets en temps réel, looper multi-pistes et contrôle MIDI pour créer une expérience de création musicale live interactive.",
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
    introText:
      "Designer multimédia et technologue créative explorant les intersections entre art, technologie et expérience.",
    locationText: "Montréal — Projets en cours, apprentissages actifs et explorations récentes autour des assistants IA, de l’expérimentation immersive et de formes numériques hors norme.",
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
    locationText: "Continuous learning",
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
   3. LIQUID GRADIENT BACKGROUND (Three.js)
   ========================================================================== */

// TouchTexture class for mouse/touch interaction
class TouchTexture {
  constructor() {
    this.size = 64;
    this.width = this.height = this.size;
    this.maxAge = 64;
    this.radius = 0.15 * this.size;
    this.trail = [];
    this.initTexture();
  }

  initTexture() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.clear();
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      let age = point.age / this.maxAge;
      let force = 1 - age;
      point.x += point.vx * force * 0.01;
      point.y += point.vy * force * 0.01;
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawPoint(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(point) {
    let force = 0;
    let vx = 0;
    let vy = 0;
    
    if (this.trail.length > 0) {
      const last = this.trail[this.trail.length - 1];
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      const dd = dx * dx + dy * dy;
      let d = Math.sqrt(dd);
      if (d > 0) {
        vx = dx / d;
        vy = dy / d;
        force = Math.min(dd * 10000, 1.0);
      }
    }
    
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(point) {
    const pos = {
      x: point.x * this.width,
      y: (1 - point.y) * this.height
    };

    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = point.age / (this.maxAge * 0.3);
    } else {
      intensity = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
    }
    intensity *= point.force;

    const radius = this.radius;
    this.ctx.shadowBlur = radius;
    this.ctx.shadowColor = `rgba(255, 255, 255, ${0.5 * intensity})`;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
    this.ctx.arc(pos.x, pos.y, radius * intensity, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

// Main Liquid Gradient class
function initLiquidBackground() {
  const canvas = document.getElementById("liquidCanvas");
  if (!canvas) return;

  let renderer, scene, camera, mesh, touchTexture;
  let isAnimating = true;

  function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      antialias: false,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Touch texture
    touchTexture = new TouchTexture();

    // Shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: touchTexture.texture },
        uColor1: { value: new THREE.Color(0xffffff) },
        uColor2: { value: new THREE.Color(0xf0f0f0) },
        uColor3: { value: new THREE.Color(0xe0e0e0) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform sampler2D uTexture;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          
          // Subtle wave distortion
          uv.x += sin(uv.y * 10.0 + uTime * 0.3) * 0.01;
          uv.y += cos(uv.x * 10.0 + uTime * 0.2) * 0.01;
          
          // Touch interaction
          vec4 touch = texture2D(uTexture, uv);
          float dist = length(uv - 0.5);
          
          // Gradient mix
          vec3 color = mix(uColor1, uColor2, dist);
          color = mix(color, uColor3, touch.r * 0.3);
          
          // Subtle animated overlay
          float noise = sin(uv.x * 20.0 + uTime) * cos(uv.y * 20.0 - uTime) * 0.02;
          color += vec3(noise);
          
          gl_FragColor = vec4(color, 0.8);
        }
      `,
      transparent: true
    });

    // Mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse/Touch events
    const getPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height
      };
    };

    const onPointerMove = (e) => {
      touchTexture.addTouch(getPointer(e));
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // Handle resize
    window.addEventListener('resize', onResize, { passive: true });
  }

  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    if (!isAnimating) return;
    
    touchTexture.update();
    mesh.material.uniforms.uTime.value += 0.01;
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    isAnimating = !document.hidden;
    if (isAnimating) animate();
  });

  init();
  animate();
}

/* ==========================================================================
   4. INIT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);

    const btn = document.getElementById("langBtn");
    if (btn) btn.addEventListener("click", switchLanguage);

    initMobileMenu();
    initLiquidBackground();
});
