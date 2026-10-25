/* dispo.js — module « disponibilité » (nœud style TouchDesigner) + bille lumineuse « mise à jour en cours »
   Pour retirer : supprimer la ligne <script src="dispo.js" defer></script> dans index.html.
   Réglages rapides ci-dessous. */
(function () {
  'use strict';

  // ─── RÉGLAGES ───
  var CFG = {
    availableFrom: new Date(2026, 10, 1),   // 1er novembre 2026 (mois 10 = novembre)
    email: 'info@kimmaurice.com',
    cv: 'CV_Kim_Maurice_2026.pdf',
    showCard: true,        // le nœud « disponibilité »
    showOrb: false,         // la bille lumineuse « mise à jour en cours »
    orbPassSeconds: 11,    // durée d'une traversée
    orbPauseSeconds: 7,    // pause entre deux traversées
    cardDelayMs: 1200
  };

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var langBtn = document.getElementById('langBtn');
  function lang() { return langBtn && langBtn.textContent.trim() === 'FR' ? 'en' : 'fr'; }

  var T = {
    fr: {
      tag: 'disponibilité', date: '1er nov.', title: 'Je cherche mon prochain défi',
      text: 'Contrat, mandat ou poste : je suis libre dès le 1er novembre pour un nouveau projet créatif ou techno.',
      mode: 'contrat · mandat · poste', k1: 'début', k2: 'mode', k3: 'statut', k4: 'T-moins',
      open: 'ouvert', now: 'Disponible maintenant',
      left: function (n) { return n === 1 ? 'Plus que 1 jour' : 'Plus que ' + n + ' jours'; },
      leftShort: function (n) { return n + ' j'; },
      write: 'M’écrire', cv: 'Voir le CV', close: 'Fermer',
      orb: 'Mise à jour du site en cours…'
    },
    en: {
      tag: 'availability', date: 'Nov. 1', title: 'Looking for my next challenge',
      text: 'Contract, assignment or position: I’m available from November 1 for a new creative or tech project.',
      mode: 'contract · assignment · position', k1: 'start', k2: 'mode', k3: 'status', k4: 'T-minus',
      open: 'open', now: 'Available now',
      left: function (n) { return n === 1 ? '1 day left' : n + ' days left'; },
      leftShort: function (n) { return n + ' d'; },
      write: 'Write me', cv: 'View CV', close: 'Close',
      orb: 'Site update in progress…'
    }
  };

  function daysLeft() {
    var t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.ceil((CFG.availableFrom - t) / 86400000);
  }

  // ─── STYLES ───
  var css = [
    '.kd-node{position:fixed;right:1.25rem;bottom:1.25rem;z-index:9000;width:min(332px,calc(100vw - 2rem));',
    'background:rgba(10,9,17,.94);border:1px solid rgba(242,241,246,.22);color:#f2f1f6;font-family:"IBM Plex Mono",ui-monospace,monospace;',
    'box-shadow:0 0 0 1px rgba(201,255,61,.08),0 18px 50px rgba(0,0,0,.55),0 0 40px rgba(59,92,255,.12);',
    'opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .5s ease;backdrop-filter:blur(8px)}',
    '.kd-node.kd-in{opacity:1;transform:none}',
    '.kd-node.kd-out{opacity:0;transform:translateY(10px);pointer-events:none}',
    '.kd-head{display:flex;align-items:center;gap:.55rem;padding:.5rem .65rem;background:linear-gradient(90deg,rgba(201,255,61,.16),rgba(201,255,61,.03));border-bottom:1px solid rgba(242,241,246,.16);font-size:.62rem;letter-spacing:.12em;text-transform:uppercase}',
    '.kd-led{width:.45rem;height:.45rem;background:#c9ff3d;box-shadow:0 0 8px #c9ff3d;animation:kdblink 1.6s steps(2,end) infinite}',
    '@keyframes kdblink{50%{opacity:.25}}',
    '.kd-name{color:#c9ff3d;font-weight:600}',
    '.kd-type{margin-left:auto;padding:.1rem .35rem;border:1px solid rgba(242,241,246,.3);color:rgba(242,241,246,.7);font-size:.55rem}',
    '.kd-x{appearance:none;background:none;border:0;color:rgba(242,241,246,.6);font:inherit;font-size:.85rem;line-height:1;cursor:pointer;padding:.1rem .25rem}',
    '.kd-x:hover{color:#ff3e9b}',
    '.kd-scope{position:relative;height:38px;overflow:hidden;border-bottom:1px solid rgba(242,241,246,.12);background:',
    'linear-gradient(rgba(242,241,246,.05) 1px,transparent 1px) 0 0/100% 9.5px,linear-gradient(90deg,rgba(242,241,246,.05) 1px,transparent 1px) 0 0/16px 100%,#07060c}',
    '.kd-scope svg{position:absolute;left:0;top:0;width:200%;height:100%;animation:kdscroll 5s linear infinite}',
    '@keyframes kdscroll{to{transform:translateX(-50%)}}',
    '.kd-body{padding:.85rem .85rem .35rem}',
    '.kd-date{font-family:"Space Grotesk",sans-serif;font-size:2rem;font-weight:700;letter-spacing:-.03em;line-height:1;color:#c9ff3d;text-transform:uppercase}',
    '.kd-title{font-family:"Space Grotesk",sans-serif;font-size:1rem;font-weight:600;margin:.45rem 0 .4rem;line-height:1.2}',
    '.kd-text{font-size:.72rem;line-height:1.65;color:rgba(242,241,246,.66);margin:0 0 .8rem}',
    '.kd-params{border:1px solid rgba(242,241,246,.14);margin-bottom:.8rem}',
    '.kd-row{display:grid;grid-template-columns:5.2rem 1fr;gap:.5rem;padding:.32rem .55rem;font-size:.64rem;border-bottom:1px solid rgba(242,241,246,.09)}',
    '.kd-row:last-child{border-bottom:0}',
    '.kd-k{color:rgba(242,241,246,.45);text-transform:uppercase;letter-spacing:.08em}',
    '.kd-v{color:#f2f1f6}',
    '.kd-v.ok{color:#c9ff3d}.kd-v.hot{color:#ff3e9b}',
    '.kd-actions{display:flex;gap:.5rem;padding:0 .85rem .85rem}',
    '.kd-btn{flex:1;text-align:center;text-decoration:none;font:600 .64rem "IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase;padding:.55rem .5rem;border:1px solid rgba(242,241,246,.35);color:#f2f1f6;transition:all .2s}',
    '.kd-btn.main{background:#c9ff3d;border-color:#c9ff3d;color:#08070d}',
    '.kd-btn:hover{background:#ff3e9b;border-color:#ff3e9b;color:#08070d}',
    '.kd-port{position:absolute;top:50%;width:.6rem;height:.6rem;border:1px solid #c9ff3d;background:#08070d;transform:translateY(-50%) rotate(45deg)}',
    '.kd-port.l{left:-.34rem}.kd-port.r{right:-.34rem;background:#c9ff3d;box-shadow:0 0 8px #c9ff3d}',
    '#kd-orb{position:fixed;inset:0;width:100%;height:100%;z-index:9500;pointer-events:none}',
    '.kd-orb-label{position:fixed;left:0;top:0;z-index:9501;pointer-events:none;white-space:nowrap;opacity:0;',
    'font:600 .62rem "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#08070d;background:#c9ff3d;padding:.3rem .55rem;',
    'box-shadow:0 0 18px rgba(201,255,61,.55);will-change:transform,opacity}',
    '.kd-orb-static{position:fixed;left:1rem;bottom:1rem;z-index:9400;pointer-events:none;font:600 .6rem "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#08070d;background:#c9ff3d;padding:.3rem .55rem}',
    '@media(max-width:768px){.kd-node{left:.75rem;right:.75rem;width:auto;bottom:calc(3.6rem + env(safe-area-inset-bottom))}.kd-port{display:none}',
    '.kd-scope,.kd-text,.kd-params{display:none}.kd-body{display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap;padding:.6rem .75rem .5rem}',
    '.kd-date{font-size:1.25rem}.kd-title{font-size:.8rem;margin:0}.kd-actions{padding:0 .75rem .7rem}.kd-btn{padding:.6rem .4rem}}',
    '@media(prefers-reduced-motion:reduce){.kd-led,.kd-scope svg{animation:none}.kd-node{transition:none}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ─── NŒUD « DISPONIBILITÉ » ───
  var node, closed = false;
  try { closed = sessionStorage.getItem('kd-closed') === '1'; } catch (e) {}

  function sinePath() {
    var p = 'M0 19', i, x, y;
    for (i = 0; i <= 400; i += 4) {
      x = i; y = 19 + Math.sin(i / 400 * Math.PI * 6) * 9 * (0.55 + 0.45 * Math.sin(i / 400 * Math.PI * 2));
      p += ' L' + x + ' ' + y.toFixed(1);
    }
    return p;
  }

  function buildCard() {
    node = document.createElement('aside');
    node.className = 'kd-node';
    node.setAttribute('role', 'complementary');
    node.innerHTML =
      '<span class="kd-port l"></span><span class="kd-port r"></span>' +
      '<div class="kd-head"><span class="kd-led"></span><span class="kd-name" data-k="tag"></span><span class="kd-type">CHOP</span>' +
      '<button class="kd-x" type="button" data-k="close" aria-label="">×</button></div>' +
      '<div class="kd-scope"><svg viewBox="0 0 400 38" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + sinePath() + '" fill="none" stroke="#c9ff3d" stroke-width="1.2"/>' +
      '<path transform="translate(400 0)" d="' + sinePath() + '" fill="none" stroke="#c9ff3d" stroke-width="1.2"/></svg></div>' +
      '<div class="kd-body"><div class="kd-date" data-k="date"></div><div class="kd-title" data-k="title"></div><p class="kd-text" data-k="text"></p>' +
      '<div class="kd-params">' +
      '<div class="kd-row"><span class="kd-k" data-k="k1"></span><span class="kd-v">2026-11-01</span></div>' +
      '<div class="kd-row"><span class="kd-k" data-k="k2"></span><span class="kd-v" data-k="mode"></span></div>' +
      '<div class="kd-row"><span class="kd-k" data-k="k3"></span><span class="kd-v ok">● <span data-k="open"></span></span></div>' +
      '<div class="kd-row"><span class="kd-k" data-k="k4"></span><span class="kd-v hot" data-k="left"></span></div>' +
      '</div></div>' +
      '<div class="kd-actions"><a class="kd-btn main" data-k="write" href="mailto:' + CFG.email + '"></a>' +
      '<a class="kd-btn" data-k="cv" href="' + CFG.cv + '" target="_blank" rel="noopener"></a></div>';
    document.body.appendChild(node);
    node.querySelector('.kd-x').addEventListener('click', function () {
      node.classList.remove('kd-in'); node.classList.add('kd-out');
      try { sessionStorage.setItem('kd-closed', '1'); } catch (e) {}
      setTimeout(function () { if (node && node.parentNode) node.parentNode.removeChild(node); }, 600);
    });
    renderCard();
    setTimeout(function () { node.classList.add('kd-in'); }, CFG.cardDelayMs);
  }

  function renderCard() {
    if (!node) return;
    var t = T[lang()], n = daysLeft();
    var map = {
      tag: t.tag, date: t.date, title: t.title, text: t.text, k1: t.k1, k2: t.k2, k3: t.k3, k4: t.k4,
      mode: t.mode, open: t.open, write: t.write, cv: t.cv,
      left: n > 0 ? t.left(n) : t.now
    };
    node.querySelectorAll('[data-k]').forEach(function (el) {
      var k = el.getAttribute('data-k');
      if (k === 'close') { el.setAttribute('aria-label', t.close); return; }
      if (map[k] !== undefined) el.textContent = map[k];
    });
  }

  // ─── BILLE LUMINEUSE ───
  var canvas, ctx, label, W = 0, H = 0, dpr = 1;
  var trail = [], t0 = 0, state = 'wait', phase = 0, baseY = 0.5, amp = 0.25, raf = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function startPass(now) {
    state = 'pass'; t0 = now; trail.length = 0;
    phase = Math.random() * Math.PI * 2;
    baseY = 0.3 + Math.random() * 0.4;
    amp = 0.12 + Math.random() * 0.14;
    label.textContent = T[lang()].orb;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (state === 'wait') {
      if (!t0) t0 = now;
      if (now - t0 > (trail.length ? CFG.orbPauseSeconds : 2500) * (trail.length ? 1000 : 1)) startPass(now);
      return;
    }
    var p = (now - t0) / (CFG.orbPassSeconds * 1000);
    if (p >= 1) {
      state = 'wait'; t0 = now; trail.length = 0; trail.push(0);
      ctx.clearRect(0, 0, W, H); label.style.opacity = 0; return;
    }
    // trajectoire : traverse l'écran de gauche à droite avec ondulations
    var x = -60 + p * (W + 120);
    var y = H * (baseY + amp * Math.sin(p * Math.PI * 2 * 1.6 + phase) + 0.05 * Math.sin(p * 31));
    trail.push({ x: x, y: y });
    if (trail.length > 70) trail.shift();

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    var i, pt, k, r;
    for (i = 0; i < trail.length; i++) {
      pt = trail[i]; k = i / trail.length;
      r = 2 + k * 9;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(201,255,61,' + (k * k * 0.5).toFixed(3) + ')';
      ctx.arc(pt.x, pt.y, r, 0, 6.2832); ctx.fill();
    }
    // halo + noyau
    var g = ctx.createRadialGradient(x, y, 0, x, y, 46);
    g.addColorStop(0, 'rgba(255,255,255,.95)');
    g.addColorStop(.14, 'rgba(201,255,61,.9)');
    g.addColorStop(.45, 'rgba(201,255,61,.22)');
    g.addColorStop(1, 'rgba(201,255,61,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 46, 0, 6.2832); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    var fade = Math.min(1, p / 0.06, (1 - p) / 0.06);
    label.style.opacity = fade.toFixed(2);
    label.style.transform = 'translate(' + Math.round(Math.min(x + 22, W - label.offsetWidth - 12)) + 'px,' + Math.round(Math.max(y - 38, 8)) + 'px)';
  }

  function buildOrb() {
    if (reduce) {
      var s = document.createElement('div'); s.className = 'kd-orb-static'; s.id = 'kd-orb-static';
      s.textContent = T[lang()].orb; document.body.appendChild(s);
      return;
    }
    canvas = document.createElement('canvas'); canvas.id = 'kd-orb'; canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas); ctx = canvas.getContext('2d');
    label = document.createElement('div'); label.className = 'kd-orb-label'; label.setAttribute('role', 'status');
    document.body.appendChild(label);
    resize(); window.addEventListener('resize', resize);
    raf = requestAnimationFrame(frame);
  }

  function init() {
    if (CFG.showCard && !closed) buildCard();
    if (CFG.showOrb) buildOrb();
    if (langBtn) langBtn.addEventListener('click', function () {
      setTimeout(function () {
        renderCard();
        if (label && state === 'pass') label.textContent = T[lang()].orb;
        var s = document.getElementById('kd-orb-static'); if (s) s.textContent = T[lang()].orb;
      }, 0);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
