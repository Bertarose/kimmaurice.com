/* salle.js — la « salle de projection » de Hors Champ TV.
   Un bouton allume la télé en plein écran par-dessus le site, avec un cartel et la manette (QR).
   Sur téléphone, c'est la télé de poche : on la joue au doigt.

   Utilisation :
     • Sur le site : <script src="salle.js" defer></script>, puis n'importe quel élément avec
       l'attribut data-salle (ex. <button data-salle>) ouvre la salle. kimmaurice.com/#tv l'ouvre aussi.
     • Page autonome (kimmaurice.com/tv) : <script src="/salle.js" data-autonome defer></script>
*/
(function () {
  'use strict';
  var script = document.currentScript;
  var CFG = {
    page: '/hors-champ-tv/hors-champ-tv.html',
    annee: '2026',
    retour: '/'                      // page autonome : où mène « Voir le portfolio »
  };
  var autonome = !!(script && 'autonome' in script.dataset);
  var mobile = window.matchMedia('(hover: none) and (pointer: coarse), (max-width: 767px)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var langBtn = document.getElementById('langBtn');
  function lang() { return langBtn && langBtn.textContent.trim() === 'FR' ? 'en' : 'fr'; }
  var T = {
    fr: {
      retour: autonome ? '← Voir le portfolio de Kim' : '← Retour au CV', plein: 'Plein écran', quitter: 'Quitter le plein écran',
      sous: 'Télé d’archives mixée en direct',
      texte: 'Deux chaînes de films éphémères des Prelinger Archives (1930–1970), mélangées en temps réel. Le visiteur prend la manette avec son téléphone : zapper, fondre les deux chaînes, ajouter des effets.',
      medium: 'Navigateur web · JavaScript · PeerJS · Internet Archive',
      ecran: 'À l’écran', manette: 'Prends la manette',
      qr: 'Scanne avec l’appareil photo de ton téléphone. Il devient la télécommande.',
      prep: 'Préparation de la manette…', err: 'Manette indisponible pour l’instant.', connecte: 'Téléphone connecté. À toi de jouer.',
      info: 'À propos', fermer: 'Fermer'
    },
    en: {
      retour: autonome ? '← See Kim’s portfolio' : '← Back to résumé', plein: 'Full screen', quitter: 'Exit full screen',
      sous: 'Archive TV, mixed live',
      texte: 'Two channels of ephemeral films from the Prelinger Archives (1930–1970), blended in real time. Visitors take the remote with their phone: zap, crossfade the channels, add effects.',
      medium: 'Web browser · JavaScript · PeerJS · Internet Archive',
      ecran: 'On screen', manette: 'Take the remote',
      qr: 'Scan with your phone camera. It becomes the remote.',
      prep: 'Getting the remote ready…', err: 'Remote unavailable right now.', connecte: 'Phone connected. Your turn.',
      info: 'About', fermer: 'Close'
    }
  };

  var css = document.createElement('style');
  css.textContent =
    '.salle{position:fixed;inset:0;z-index:2147483600;background:#000;color:#f2f1f6;font-family:Inter,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;opacity:0;transition:opacity .5s}' +
    '.salle.on{opacity:1}' +
    '.salle iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}' +
    '.salle .allumage{position:absolute;inset:0;background:#fff;pointer-events:none;transform-origin:center;animation:salleOn .9s cubic-bezier(.2,.8,.2,1) forwards}' +
    '@keyframes salleOn{0%{transform:scale(1,.003);opacity:1}35%{transform:scale(1,.003);opacity:1}70%{transform:scale(1,1);opacity:.85}100%{transform:scale(1,1);opacity:0}}' +
    '.salle .ui{transition:opacity .5s}' +
    '.salle.calme .ui{opacity:0;pointer-events:none}' +
    '.salle .haut{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;gap:.5rem;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) 0 max(16px,env(safe-area-inset-left))}' +
    '.salle button,.salle a.bouton{font:600 .66rem/1 "IBM Plex Mono",ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:#f2f1f6;background:rgba(8,7,13,.6);border:1px solid rgba(242,241,246,.3);padding:.65rem .85rem;cursor:pointer;text-decoration:none;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}' +
    '.salle button:hover,.salle a.bouton:hover{border-color:#c9ff3d;color:#c9ff3d}' +
    '.salle button:focus-visible,.salle a.bouton:focus-visible{outline:2px solid #c9ff3d;outline-offset:2px}' +
    '.salle .cartel{position:absolute;left:max(16px,env(safe-area-inset-left));bottom:max(16px,env(safe-area-inset-bottom));width:min(360px,calc(100vw - 32px));box-sizing:border-box;padding:1rem 1.1rem;background:rgba(8,7,13,.72);border-left:2px solid #c9ff3d;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}' +
    '.salle .cartel h2{margin:0;font:600 1.35rem/1.05 "Inter Tight",Inter,-apple-system,sans-serif;letter-spacing:-.02em}' +
    '.salle .cartel .qui{margin:.2rem 0 .7rem;font-size:.82rem;color:rgba(242,241,246,.7)}' +
    '.salle .cartel p{margin:0 0 .6rem;font-size:.8rem;line-height:1.55;color:rgba(242,241,246,.82)}' +
    '.salle .cartel .medium,.salle .cartel .films{font:500 .62rem/1.6 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.06em;color:rgba(242,241,246,.55);text-transform:uppercase}' +
    '.salle .cartel .films{margin-top:.6rem;padding-top:.6rem;border-top:1px solid rgba(242,241,246,.14);text-transform:none;letter-spacing:.02em}' +
    '.salle .cartel .films b{color:#c9ff3d;font-weight:600;margin-right:.4rem}' +
    '.salle .manette{position:absolute;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));width:212px;padding:1rem;box-sizing:border-box;background:rgba(8,7,13,.72);border:1px solid rgba(242,241,246,.22);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);text-align:center}' +
    '.salle .manette b{display:block;font:600 1rem/1.1 "Inter Tight",Inter,sans-serif;margin-bottom:.6rem}' +
    '.salle .manette .qr{width:156px;height:156px;margin:0 auto .6rem;background:#fff;padding:7px;box-sizing:border-box;display:grid;place-items:center}' +
    '.salle .manette .qr img{width:100%;height:100%;image-rendering:pixelated}' +
    '.salle .manette p{margin:0;font-size:.72rem;line-height:1.45;color:rgba(242,241,246,.72)}' +
    '.salle .manette.connectee{border-color:#c9ff3d}' +
    '.salle .manette.connectee .qr{display:none}' +
    '.salle .mob-info{display:none}' +
    '@media (max-width:767px),(hover:none) and (pointer:coarse){' +
      '.salle .manette,.salle .plein{display:none}' +
      '.salle .cartel{display:none;top:auto;bottom:max(16px,env(safe-area-inset-bottom))}' +
      '.salle.info .cartel{display:block}' +
      '.salle .mob-info{display:inline-block}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){.salle,.salle .ui{transition:none}.salle .allumage{display:none}}' +
    'html.salle-ouverte,html.salle-ouverte body{overflow:hidden}';
  document.head.appendChild(css);

  var salle = null, cadre = null, ouverte = false, tCalme = 0, films = ['', ''];

  function t(k) { return T[lang()][k]; }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function construire() {
    salle = document.createElement('div');
    salle.className = 'salle'; salle.setAttribute('role', 'dialog'); salle.setAttribute('aria-modal', 'true');
    salle.setAttribute('aria-label', 'Hors Champ TV');
    salle.insertAdjacentHTML('beforeend',
      '<div class="ui haut">' +
        (autonome ? '<a class="bouton retour" href="' + CFG.retour + '"></a>' : '<button type="button" class="retour"></button>') +
        '<span><button type="button" class="mob-info"></button> <button type="button" class="plein"></button></span>' +
      '</div>' +
      '<aside class="ui cartel">' +
        '<h2>Hors Champ TV</h2><div class="qui">Kim Maurice, ' + CFG.annee + ' · <span class="l-sous"></span></div>' +
        '<p class="l-texte"></p><div class="medium l-medium"></div>' +
        '<div class="films"><b class="l-ecran"></b><span class="l-films">…</span></div>' +
      '</aside>' +
      '<aside class="ui manette"><b class="l-manette"></b><div class="qr"></div><p class="l-qr"></p></aside>');
    document.body.appendChild(salle);

    var bRetour = salle.querySelector('.retour');
    if (!autonome) bRetour.addEventListener('click', function () { fermer(true); });
    salle.querySelector('.plein').addEventListener('click', basculerPleinEcran);
    salle.querySelector('.mob-info').addEventListener('click', function () { salle.classList.toggle('info'); libelles(); });
    // Interface qui s'efface au repos, comme au cinéma (ordinateur)
    salle.addEventListener('pointermove', reveiller);
    document.addEventListener('fullscreenchange', libelles);
    libelles();
  }

  function libelles() {
    if (!salle) return;
    salle.querySelector('.retour').textContent = t('retour');
    salle.querySelector('.plein').textContent = document.fullscreenElement ? t('quitter') : t('plein');
    salle.querySelector('.mob-info').textContent = salle.classList.contains('info') ? t('fermer') : t('info');
    salle.querySelector('.l-sous').textContent = t('sous');
    salle.querySelector('.l-texte').textContent = t('texte');
    salle.querySelector('.l-medium').textContent = t('medium');
    salle.querySelector('.l-ecran').textContent = t('ecran');
    salle.querySelector('.l-manette').textContent = t('manette');
    var m = salle.querySelector('.manette');
    if (m.classList.contains('connectee')) salle.querySelector('.l-qr').textContent = t('connecte');
    else if (!m.querySelector('.qr img')) salle.querySelector('.l-qr').textContent = m.dataset.err ? t('err') : t('prep');
    else salle.querySelector('.l-qr').textContent = t('qr');
    majFilms();
  }
  function majFilms() {
    var l = films.filter(Boolean);
    salle.querySelector('.l-films').innerHTML = l.length ? l.map(esc).join('<br>') : '…';
  }

  function reveiller(delai) {
    if (mobile) return;
    salle.classList.remove('calme'); clearTimeout(tCalme);
    tCalme = setTimeout(function () { if (ouverte) salle.classList.add('calme'); }, typeof delai === 'number' ? delai : 3500);
  }
  function basculerPleinEcran() {
    if (!document.fullscreenElement) (salle.requestFullscreen ? salle.requestFullscreen() : Promise.reject()).catch(function () {});
    else document.exitFullscreen && document.exitFullscreen();
  }

  // La télé est recréée à chaque allumage : une iframe neuve, son adresse posée AVANT son insertion.
  // Ainsi elle repart toujours de zéro et n'ajoute aucune étape à l'historique du navigateur
  // (changer l'adresse d'une iframe existante, ex. about:blank, crée des étapes que « Retour » rejouait).
  function allumerTele() {
    eteindreTele();
    cadre = document.createElement('iframe');
    cadre.title = 'Hors Champ TV';
    cadre.setAttribute('allow', 'autoplay; fullscreen');
    cadre.src = CFG.page + '?fond' + (mobile ? '&poche' : '') + '&t=' + Date.now();
    salle.insertBefore(cadre, salle.firstChild);
    if (!reduce) { var a = document.createElement('div'); a.className = 'allumage'; cadre.after(a); setTimeout(function () { a.remove(); }, 1000); }
  }
  function eteindreTele() {
    if (cadre) { cadre.remove(); cadre = null; }
    var a = salle && salle.querySelector('.allumage'); if (a) a.remove();
  }

  function ouvrir(viaHistorique) {
    if (ouverte) return;
    ouverte = true;
    if (!salle) construire();
    reinitManette();
    allumerTele();
    document.documentElement.classList.add('salle-ouverte');
    window.dispatchEvent(new CustomEvent('salle:etat', { detail: { ouverte: true } }));
    salle.style.display = '';
    requestAnimationFrame(function () { salle.classList.add('on'); });
    if (!autonome && !viaHistorique && location.hash !== '#tv') history.pushState({ salle: 1 }, '', '#tv');
    salle.querySelector('.retour').focus({ preventScroll: true });
    reveiller(9000);   // au premier allumage, le cartel reste le temps d'être lu
  }
  function fermer(viaBouton) {
    if (!ouverte || autonome) return;
    ouverte = false;
    if (document.fullscreenElement) document.exitFullscreen();
    salle.classList.remove('on');
    setTimeout(function () { if (!ouverte) { salle.style.display = 'none'; eteindreTele(); reinitManette(); } }, 500);
    document.documentElement.classList.remove('salle-ouverte');
    window.dispatchEvent(new CustomEvent('salle:etat', { detail: { ouverte: false } }));
    if (viaBouton && location.hash === '#tv') history.back();
  }
  function reinitManette() {
    var m = salle.querySelector('.manette');
    m.classList.remove('connectee'); delete m.dataset.err; m.querySelector('.qr').innerHTML = '';
    films = ['', '']; libelles();
  }

  // Messages de la télé (iframe)
  window.addEventListener('message', function (e) {
    if (!cadre || e.source !== cadre.contentWindow || !e.data || e.data.source !== 'hct') return;
    var m = e.data, man = salle.querySelector('.manette');
    if (m.type === 'pret') { if (!mobile) cadre.contentWindow.postMessage({ source: 'hct-site', type: 'qr' }, location.origin); }
    else if (m.type === 'qr') {
      var q = man.querySelector('.qr'); q.innerHTML = '';
      if (m.img) { var img = document.createElement('img'); img.alt = 'QR'; img.src = m.img; q.appendChild(img); }
      libelles();
    }
    else if (m.type === 'erreur') { man.dataset.err = '1'; libelles(); }
    else if (m.type === 'connexion') { man.classList.toggle('connectee', m.n > 0); libelles(); }
    else if (m.type === 'activite') reveiller();
    else if (m.type === 'echap') { if (!document.fullscreenElement) fermer(true); }
    else if (m.type === 'film' && (m.deck === 0 || m.deck === 1)) {
      films[m.deck] = (m.deck === 0 ? 'A · ' : 'B · ') + m.titre + (m.annee ? ' (' + m.annee + ')' : '');
      majFilms();
    }
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ouverte && !document.fullscreenElement) fermer(true); });
  window.addEventListener('popstate', function () { if (location.hash === '#tv') ouvrir(true); else if (ouverte) fermer(false); });
  if (langBtn) langBtn.addEventListener('click', function () { setTimeout(libelles, 0); });

  // Déclencheurs : tout élément avec data-salle
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-salle]');
    if (el) { e.preventDefault(); ouvrir(false); }
  });

  window.SalleTV = { ouvrir: function () { ouvrir(false); }, fermer: function () { fermer(true); } };
  if (autonome || location.hash === '#tv') ouvrir(true);
})();
