/* Hors Champ TV en fond de page : chaque visiteur peut la mixer avec son téléphone.
 *
 * Ajoute cette ligne avant </body> sur n'importe quelle page du site
 * (hors-champ-tv.html doit être dans le même dossier que ce fichier) :
 *   <script src="/hors-champ-tv/hors-champ-tv-fond.js" defer></script>
 *
 * Options, en attributs sur la même balise :
 *   data-opacite="0.6"            télé plus discrète (1 par défaut)
 *   data-qr="non"                 pas de bouton téléphone
 *   data-texte="Mixe la télé avec ton téléphone"   texte du bouton
 */
(function () {
  'use strict';
  var script = document.currentScript;
  if (!script) return;
  var base = new URL('.', script.src);
  var d = script.dataset;

  function demarrer() {
    // --- Le décor : la télé dans une iframe fixe, derrière tout le contenu ---
    var cadre = document.createElement('iframe');
    cadre.src = new URL('hors-champ-tv.html?fond', base).href;
    cadre.title = 'Hors Champ TV';
    cadre.setAttribute('aria-hidden', 'true');
    cadre.setAttribute('allow', 'autoplay');
    cadre.tabIndex = -1;
    var st = cadre.style;
    st.position = 'fixed'; st.top = st.left = '0'; st.width = '100%'; st.height = '100%';
    st.border = '0'; st.zIndex = '-1'; st.pointerEvents = 'none'; st.opacity = d.opacite || '1';
    document.body.insertBefore(cadre, document.body.firstChild);

    // Sur un téléphone, la télé reste un simple décor.
    var tactile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (d.qr === 'non' || tactile) return;

    // --- Le bouton et le QR, isolés du style du site (shadow DOM) ---
    var hote = document.createElement('div');
    hote.style.cssText = 'position:fixed;right:max(20px, env(safe-area-inset-right));bottom:max(20px, env(safe-area-inset-bottom));z-index:2147483000;';
    var ombre = hote.attachShadow({ mode: 'open' });
    var texteBouton = d.texte || 'Mixe la télé avec ton téléphone';
    ombre.innerHTML =
      '<style>' +
      ':host{all:initial}' +
      '[hidden]{display:none!important}' +
      '.boite{--fond:rgba(5,6,5,.86);--trait:#2f7a4a;--encre:#e9e4d6;--doux:#9fb3a5;--vert:#6dff9a;font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;position:relative}' +
      '.pill{display:flex;align-items:center;gap:8px;font:500 12px/1 "IBM Plex Mono",ui-monospace,Menlo,monospace;letter-spacing:.02em;color:var(--vert);background:var(--fond);border:1px solid var(--trait);border-radius:6px;padding:11px 14px;cursor:pointer;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 0 18px rgba(109,255,154,.15);text-shadow:0 0 6px rgba(109,255,154,.5);transition:transform .15s}' +
      '.pill:active{transform:scale(.97)}' +
      '.pill:focus-visible,.fermer:focus-visible{outline:2px solid var(--vert);outline-offset:2px}' +
      '.pill i{display:none;width:8px;height:8px;border-radius:50%;background:#ff4a3d;box-shadow:0 0 8px #ff4a3d}' +
      '.pill.connecte i{display:inline-block}' +
      '.pop{position:absolute;right:0;bottom:calc(100% + 10px);width:250px;box-sizing:border-box;padding:16px;border-radius:8px;background:var(--fond);border:1px solid var(--trait);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 10px 40px rgba(0,0,0,.4);display:grid;gap:10px;text-align:center;color:var(--encre)}' +
      '.titre{font:400 24px/1 VT323,"Courier New",monospace;color:var(--vert);text-shadow:0 0 8px rgba(109,255,154,.5);letter-spacing:.03em}' +
      '.qr{width:176px;height:176px;justify-self:center;background:#fff;border-radius:4px;padding:8px;box-sizing:border-box;display:grid;place-items:center}' +
      '.qr img{width:100%;height:100%;image-rendering:pixelated}' +
      'p{margin:0;font-size:11px;line-height:1.55;color:var(--doux)}' +
      '.fermer{justify-self:center;border:0;background:none;padding:4px;font:11px "IBM Plex Mono",ui-monospace,monospace;color:var(--doux);text-decoration:underline;cursor:pointer}' +
      '</style>' +
      '<div class="boite">' +
      '<div class="pop" hidden role="dialog" aria-label="Télécommande par téléphone">' +
      '<span class="titre">● TÉLÉCOMMANDE</span>' +
      '<div class="qr"></div>' +
      '<p class="texte">Préparation…</p>' +
      '<button class="fermer" type="button">Fermer</button>' +
      '</div>' +
      '<button class="pill" type="button"><i></i><span class="libelle"></span></button>' +
      '</div>';
    ombre.querySelector('.libelle').textContent = texteBouton;
    document.body.appendChild(hote);

    var boite = ombre.querySelector('.boite'), pop = ombre.querySelector('.pop'), pill = ombre.querySelector('.pill');
    var qr = ombre.querySelector('.qr'), texte = ombre.querySelector('.texte'), libelle = ombre.querySelector('.libelle');
    var pret = false, attente = false;

    function demanderQR() {
      if (!pret) { attente = true; return; }
      cadre.contentWindow.postMessage({ source: 'hct-site', type: 'qr' }, base.origin);
    }
    pill.addEventListener('click', function () {
      if (!pop.hidden) { pop.hidden = true; return; }
      pop.hidden = false;
      if (!qr.firstChild) { texte.textContent = 'Préparation…'; demanderQR(); }
    });
    ombre.querySelector('.fermer').addEventListener('click', function () { pop.hidden = true; pill.focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pop.hidden = true; });

    window.addEventListener('message', function (e) {
      if (e.source !== cadre.contentWindow || !e.data || e.data.source !== 'hct') return;
      var m = e.data;
      if (m.type === 'pret') { pret = true; if (attente) { attente = false; demanderQR(); } }
      else if (m.type === 'qr') {
        qr.innerHTML = '';
        if (m.img) { var img = document.createElement('img'); img.alt = 'Code QR de la télécommande'; img.src = m.img; qr.appendChild(img); }
        texte.textContent = "Scanne avec l'appareil photo de ton téléphone : zappe, mélange les deux chaînes, ajoute des effets.";
      }
      else if (m.type === 'erreur') texte.textContent = "Connexion impossible pour l'instant. Réessaie dans un moment.";
      else if (m.type === 'connexion') {
        pill.classList.toggle('connecte', m.n > 0);
        libelle.textContent = m.n > 0 ? 'Téléphone connecté · tu as la main' : texteBouton;
        if (m.n > 0) pop.hidden = true;
      }
    });
  }

  if (document.body) demarrer(); else document.addEventListener('DOMContentLoaded', demarrer);
})();
