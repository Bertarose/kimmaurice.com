/* ==========================================================================
   DISPO — petit pop-up « nouveau défi dès le 1er novembre »
   Autonome : injecte son CSS + son HTML. Pour le retirer, supprimer
   la balise <script src="dispo.js"> dans index.html (et ce fichier).
   ========================================================================== */
(function () {
  const START = new Date(2026, 10, 1);          // 1er novembre 2026 (mois 0-indexé)
  const STORE_KEY = 'km-dispo-closed';
  const EMAIL = 'info@kimmaurice.com';

  const T = {
    fr: {
      subject: 'Un nouveau défi pour toi dès le 1er novembre',
      days: n => n === 1 ? 'Plus que 1 jour' : `Plus que ${n} jours`,
      now: 'Disponible dès maintenant',
      pill: 'Dispo le 1er nov.',
      pillNow: 'Dispo maintenant',
      yay: ['Allô!', 'Engage-moi!', 'Yé!', 'On jase?', '✦ bonne idée ✦', 'Encore!']
    },
    en: {
      subject: 'A new challenge for you from November 1st',
      days: n => n === 1 ? 'Just 1 day to go' : `${n} days to go`,
      now: 'Available now',
      pill: 'Free Nov 1',
      pillNow: 'Available now',
      yay: ['Hi!', 'Hire me!', 'Yay!', "Let's talk?", '✦ good idea ✦', 'Again!']
    }
  };

  /* ---------- CSS ---------- */
  const css = `
  .dispo{position:fixed;right:1.5rem;bottom:1.5rem;z-index:998;width:min(340px,calc(100vw - 1.5rem));
    font-family:var(--ff);color:var(--text);pointer-events:none}
  @media(max-width:767px){.dispo{right:.75rem;left:.75rem;width:auto;bottom:calc(56px + .75rem + env(safe-area-inset-bottom,0px))}}
  .dispo-card{pointer-events:auto;position:relative;margin-top:44px;padding:1.6rem 1.4rem 1.3rem;
    background:var(--surface);border:1px solid rgba(242,241,246,.3);border-radius:14px;
    box-shadow:5px 5px 0 var(--pink);transform-origin:85% 100%;
    transform:translateY(24px) rotate(2deg) scale(.9);opacity:0;visibility:hidden;
    transition:transform .5s cubic-bezier(.34,1.56,.64,1),opacity .3s,visibility 0s .5s}
  .dispo.open .dispo-card{transform:rotate(-1.5deg);opacity:1;visibility:visible;
    transition:transform .5s cubic-bezier(.34,1.56,.64,1),opacity .3s,visibility 0s}
  .dispo-close{position:absolute;top:.55rem;right:.6rem;width:30px;height:30px;border-radius:50%;
    border:1px solid transparent;background:none;color:var(--sub);font-size:1.1rem;line-height:1;cursor:pointer;
    font-family:var(--ff-head);transition:color .2s,border-color .2s}
  .dispo-close:hover{color:var(--text);border-color:var(--line)}

  /* la bestiole */
  .dispo-blob{position:absolute;left:1.1rem;top:-52px;width:78px;height:66px;padding:0;border:0;background:none;
    cursor:pointer;-webkit-tap-highlight-color:transparent}
  .dispo-blob svg{width:100%;height:100%;overflow:visible;display:block;transform-origin:50% 100%;
    animation:dispo-bob 3.2s ease-in-out infinite}
  .dispo-blob.squish svg{animation:dispo-squish .45s cubic-bezier(.34,1.56,.64,1)}
  .dispo-lid{transform-box:fill-box;transform-origin:center;animation:dispo-blink 4.6s infinite}
  @keyframes dispo-bob{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-3px) scale(.98,1.03)}}
  @keyframes dispo-squish{0%{transform:scale(1,1)}35%{transform:scale(1.22,.74)}70%{transform:scale(.9,1.12)}100%{transform:scale(1,1)}}
  @keyframes dispo-blink{0%,92%,100%{transform:scaleY(0)}95%{transform:scaleY(1)}}
  .dispo-blob:focus-visible{outline:2px solid var(--green);outline-offset:4px;border-radius:50%}
  .dispo-say{position:absolute;left:92px;top:-44px;padding:.35rem .6rem;border-radius:10px 10px 10px 2px;
    background:var(--text);color:var(--bg);font-family:var(--ff-head);font-weight:600;font-size:.8rem;white-space:nowrap;
    opacity:0;transform:translateY(6px) scale(.9);transition:opacity .2s,transform .25s cubic-bezier(.34,1.56,.64,1);pointer-events:none}
  .dispo-say.show{opacity:1;transform:none}

  .dispo-date{font-family:var(--ff-head);font-weight:700;font-size:2.6rem;line-height:.9;letter-spacing:-.03em;
    color:var(--green);margin:.35rem 0 .7rem}
  .dispo-title{font-family:var(--ff-head);font-weight:600;font-size:1.15rem;line-height:1.2;margin-bottom:.45rem}
  .dispo-text{font-size:.78rem;line-height:1.65;color:var(--sub);margin-bottom:1rem;max-width:34ch}
  .dispo-count{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;color:var(--text);
    border:1px dashed rgba(242,241,246,.3);border-radius:999px;padding:.3rem .75rem;margin-bottom:1.1rem}
  .dispo-count::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);
    animation:blink-dot 2s infinite}
  .dispo-actions{display:flex;gap:.5rem;flex-wrap:wrap}
  .dispo-actions .btn{padding:.7rem 1.1rem;border-radius:999px}
  .dispo-actions .btn-primary{background:var(--green)}
  .dispo-actions .btn-primary:hover{background:var(--text)}

  /* pastille quand c'est fermé */
  .dispo-pill{pointer-events:auto;position:absolute;right:0;bottom:0;display:flex;align-items:center;gap:.5rem;
    padding:.35rem .9rem .35rem .35rem;border-radius:999px;border:1px solid rgba(242,241,246,.3);
    background:var(--surface);color:var(--text);font-family:var(--ff);font-size:.72rem;font-weight:600;cursor:pointer;
    box-shadow:3px 3px 0 var(--pink);opacity:0;visibility:hidden;transform:scale(.6);
    transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .25s,visibility 0s .4s}
  .dispo.mini .dispo-pill{opacity:1;visibility:visible;transform:none;transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .25s,visibility 0s}
  .dispo-pill:hover{transform:translateY(-2px) rotate(-2deg)}
  .dispo-pill svg{width:30px;height:26px;overflow:visible}
  .dispo-pill:focus-visible,.dispo-close:focus-visible,.dispo-actions .btn:focus-visible{outline:2px solid var(--green);outline-offset:3px}

  .dispo-bit{position:fixed;z-index:999;pointer-events:none;font-size:.9rem;line-height:1}

  @media(prefers-reduced-motion:reduce){
    .dispo-blob svg,.dispo-lid{animation:none}
    .dispo-card,.dispo.open .dispo-card{transition:opacity .2s,visibility 0s;transform:none}
  }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- la bestiole (SVG) ---------- */
  const blobSVG = (id, small) => `
  <svg viewBox="0 0 80 68" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c9ff3d"/><stop offset="1" stop-color="#8ff0b0"/></linearGradient></defs>
    <path d="M40 4C60 4 76 18 77 38c1 17-8 27-37 27S2 55 3 38C4 18 20 4 40 4Z" fill="url(#${id})"/>
    ${small ? '' : '<ellipse cx="20" cy="44" rx="6" ry="3.5" fill="#ff3e9b" opacity=".55"/><ellipse cx="60" cy="44" rx="6" ry="3.5" fill="#ff3e9b" opacity=".55"/>'}
    <g class="dispo-eye" data-cx="30" data-cy="32">
      <ellipse cx="30" cy="32" rx="7.5" ry="9" fill="#fff"/>
      <circle class="dispo-pupil" cx="30" cy="33" r="4.2" fill="#08070d"/>
      <ellipse class="dispo-lid" cx="30" cy="32" rx="8" ry="9.5" fill="#c9ff3d"/>
    </g>
    <g class="dispo-eye" data-cx="50" data-cy="32">
      <ellipse cx="50" cy="32" rx="7.5" ry="9" fill="#fff"/>
      <circle class="dispo-pupil" cx="50" cy="33" r="4.2" fill="#08070d"/>
      <ellipse class="dispo-lid" cx="50" cy="32" rx="8" ry="9.5" fill="#b0f76a"/>
    </g>
    <path d="M35 49q5 5 10 0" stroke="#08070d" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </svg>`;

  /* ---------- HTML ---------- */
  const root = document.createElement('aside');
  root.className = 'dispo';
  root.setAttribute('aria-label', 'Disponibilité');
  root.innerHTML = `
    <div class="dispo-card" role="dialog" aria-labelledby="dispoTitle">
      <button class="dispo-blob" type="button" aria-label="Clique-moi">${blobSVG('dispoG1')}</button>
      <span class="dispo-say" aria-live="polite"></span>
      <button class="dispo-close" type="button" aria-label="Fermer">×</button>
      <p class="dispo-date" data-fr="1er nov." data-en="Nov 1">1er nov.</p>
      <h2 class="dispo-title" id="dispoTitle" data-fr="Je cherche mon prochain défi" data-en="Looking for my next challenge">Je cherche mon prochain défi</h2>
      <p class="dispo-text"
         data-fr="Contrat, mandat ou poste : je suis libre dès le 1er novembre pour un nouveau projet créatif ou techno."
         data-en="Contract, mandate or full-time role: I'm free from November 1st for a new creative or tech project.">Contrat, mandat ou poste : je suis libre dès le 1er novembre pour un nouveau projet créatif ou techno.</p>
      <div class="dispo-count"></div>
      <div class="dispo-actions">
        <a class="btn btn-primary dispo-mail" href="#"><span data-fr="M'écrire" data-en="Email me">M'écrire</span></a>
        <a class="btn btn-secondary" href="Kim_Maurice_CV_2026_MTL.pdf" target="_blank"><span data-fr="Voir le CV" data-en="See my CV">Voir le CV</span></a>
      </div>
    </div>
    <button class="dispo-pill" type="button" aria-label="Voir ma disponibilité">${blobSVG('dispoG2', true)}<span class="dispo-pill-txt"></span></button>`;
  document.body.appendChild(root);

  const $ = s => root.querySelector(s);
  const card = $('.dispo-card'), blob = $('.dispo-blob'), say = $('.dispo-say');
  const closeBtn = $('.dispo-close'), pill = $('.dispo-pill');
  const langBtn = document.getElementById('langBtn');
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- langue (suit le bouton FR/EN du site) ---------- */
  const lang = () => (langBtn && langBtn.textContent.trim() === 'FR') ? 'en' : 'fr';
  function render() {
    const t = T[lang()];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.round((START - today) / 864e5);
    const ready = days <= 0;
    $('.dispo-count').textContent = ready ? t.now : t.days(days);
    $('.dispo-pill-txt').textContent = ready ? t.pillNow : t.pill;
    $('.dispo-mail').href = `mailto:${EMAIL}?subject=${encodeURIComponent(t.subject)}`;
    closeBtn.setAttribute('aria-label', lang() === 'fr' ? 'Fermer' : 'Close');
  }
  if (langBtn) langBtn.addEventListener('click', () => setTimeout(render, 0));
  render();

  /* ---------- ouvrir / fermer ---------- */
  function open() {
    root.classList.remove('mini'); root.classList.add('open');
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
  }
  function close() {
    root.classList.remove('open'); root.classList.add('mini');
    try { localStorage.setItem(STORE_KEY, '1'); } catch (e) {}
  }
  closeBtn.addEventListener('click', () => { close(); pill.focus({ preventScroll: true }); });
  pill.addEventListener('click', open);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('open')) close(); });

  let wasClosed = false;
  try { wasClosed = localStorage.getItem(STORE_KEY) === '1'; } catch (e) {}
  if (wasClosed) root.classList.add('mini');
  else setTimeout(open, 2200);

  /* ---------- les yeux suivent le curseur ---------- */
  const eyes = [...root.querySelectorAll('.dispo-eye')];
  function look(x, y) {
    eyes.forEach(eye => {
      const svg = eye.ownerSVGElement, r = svg.getBoundingClientRect();
      if (!r.width) return;
      const k = r.width / 80;
      const ex = r.left + (+eye.dataset.cx) * k, ey = r.top + (+eye.dataset.cy) * k;
      const a = Math.atan2(y - ey, x - ex);
      const d = Math.min(3.2, Math.hypot(x - ex, y - ey) / 40);
      const p = eye.querySelector('.dispo-pupil');
      p.setAttribute('cx', +eye.dataset.cx + Math.cos(a) * d);
      p.setAttribute('cy', +eye.dataset.cy + 1 + Math.sin(a) * d * 1.2);
    });
  }
  let raf = 0;
  window.addEventListener('pointermove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; look(e.clientX, e.clientY); });
  }, { passive: true });
  window.addEventListener('pointerdown', e => look(e.clientX, e.clientY), { passive: true });

  /* ---------- clic sur la bestiole : squish + confettis + petite phrase ---------- */
  let sayTimer, sayIdx = 0;
  blob.addEventListener('click', () => {
    blob.classList.remove('squish'); void blob.offsetWidth; blob.classList.add('squish');
    const words = T[lang()].yay;
    say.textContent = words[sayIdx++ % words.length];
    say.classList.add('show');
    clearTimeout(sayTimer); sayTimer = setTimeout(() => say.classList.remove('show'), 1400);
    if (!reduce) burst(blob.getBoundingClientRect());
  });

  function burst(r) {
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const glyphs = ['◆', '✦', '●', '♥'], colors = ['#c9ff3d', '#ff3e9b', '#3b5cff', '#f2f1f6'];
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      s.className = 'dispo-bit';
      s.textContent = glyphs[i % glyphs.length];
      s.style.color = colors[(i * 7) % colors.length];
      s.style.left = cx + 'px'; s.style.top = cy + 'px';
      document.body.appendChild(s);
      const a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.4;
      const dist = 50 + Math.random() * 70;
      const dx = Math.cos(a) * dist, dy = Math.sin(a) * dist;
      s.animate([
        { transform: 'translate(-50%,-50%) scale(.4) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: .6 },
        { transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy + 60}px)) scale(.7) rotate(${Math.random() * 540}deg)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => s.remove();
    }
  }
})();
