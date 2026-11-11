/* salle.js — la « salle de projection » de Hors Champ TV.
   Un bouton allume la télé en plein écran par-dessus le site, avec un cartel et la manette (QR).
   Sur téléphone, c'est la télé de poche : on la joue au doigt.

   Utilisation :
     • Sur le site : <script src="salle.js" defer></script>, puis n'importe quel élément avec
       l'attribut data-salle (ex. <button data-salle>) ouvre la salle. kimmaurice.com/#tv l'ouvre aussi.
     • Page autonome (kimmaurice.com/tv) : <script src="/salle.js" data-autonome defer></script>

   Musique : dépose des fichiers audio (mp3, m4a, wav, ogg…) dans le dossier hors-champ-tv/media/
   du dépôt GitHub. Ils sont trouvés automatiquement et joués en boucle, dans l'ordre alphabétique
   (numérote-les, ex. « 01 Titre.mp3 », pour choisir l'ordre). La télé réagit à la musique.
*/
(function () {
  'use strict';
  var script = document.currentScript;
  var CFG = {
    page: '/hors-champ-tv/hors-champ-tv.html',
    annee: '2026',
    retour: '/',                     // page autonome : où mène « Voir le portfolio »
    media: '/hors-champ-tv/media/',  // dossier des musiques
    depot: 'Bertarose/kimmaurice.com'
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
      texte: 'Deux chaînes de films éphémères des Prelinger Archives (1930–1970), mélangées en temps réel. Le visiteur prend la manette avec son téléphone : zapper, fondre les deux chaînes, ajouter des effets. Sur la chaîne commune, tous les visiteurs voient la même télé et la mixent ensemble, en direct.',
      medium: 'Navigateur web · JavaScript · PeerJS · Internet Archive',
      ecran: 'À l’écran', manette: 'Prends la manette',
      qr: 'Scanne avec l’appareil photo de ton téléphone. Il devient la télécommande.',
      prep: 'Préparation de la manette…', err: 'Manette indisponible pour l’instant.', connecte: 'Téléphone connecté. À toi de jouer.',
      info: 'À propos', fermer: 'Fermer',
      jouer: 'Jouer la musique', pause: 'Mettre la musique en pause', stop: 'Arrêter la musique', suivant: 'Piste suivante', musique: 'Musique : Kim Maurice',
      commune: 'Chaîne commune', direct: 'En direct', relais: 'Reprise de la régie…', connexion: 'Connexion…', indispo: 'Chaîne commune indisponible',
      titreCommune: 'Chaîne commune : tout le monde voit la même télé et peut la mixer. Clique pour revenir à ta télé privée.',
      titrePrivee: 'Ta télé privée. Clique pour rejoindre la chaîne commune et mixer avec les autres visiteurs.',
      fil: {
        zapAB: 'a zappé les deux chaînes', zapA: 'a zappé la chaîne A', zapB: 'a zappé la chaîne B', mix: 'a bougé le mélange A/B',
        strobe: 'a lancé le stroboscope', noir: 'a coupé l’image', rallume: 'a rallumé l’image', nb: 'a passé l’image en noir et blanc',
        inverse: 'a inversé les couleurs', miroir: 'a mis le miroir', sujet: 'a choisi le sujet', creuse: 'a creusé', retire: 'a retiré un film',
        image: 'a retouché l’image', arrive: 'entre dans la salle', part: 'a quitté la salle', surA: 'sur la chaîne A', surB: 'sur la chaîne B'
      }
    },
    en: {
      retour: autonome ? '← See Kim’s portfolio' : '← Back to résumé', plein: 'Full screen', quitter: 'Exit full screen',
      sous: 'Archive TV, mixed live',
      texte: 'Two channels of ephemeral films from the Prelinger Archives (1930–1970), blended in real time. Visitors take the remote with their phone: zap, crossfade the channels, add effects. On the shared channel, every visitor sees the same TV and mixes it together, live.',
      medium: 'Web browser · JavaScript · PeerJS · Internet Archive',
      ecran: 'On screen', manette: 'Take the remote',
      qr: 'Scan with your phone camera. It becomes the remote.',
      prep: 'Getting the remote ready…', err: 'Remote unavailable right now.', connecte: 'Phone connected. Your turn.',
      info: 'About', fermer: 'Close',
      jouer: 'Play the music', pause: 'Pause the music', stop: 'Stop the music', suivant: 'Next track', musique: 'Music: Kim Maurice',
      commune: 'Shared channel', direct: 'Live', relais: 'Handing over the controls…', connexion: 'Connecting…', indispo: 'Shared channel unavailable',
      titreCommune: 'Shared channel: everyone sees the same TV and can mix it. Click to go back to your private TV.',
      titrePrivee: 'Your private TV. Click to join the shared channel and mix with other visitors.',
      fil: {
        zapAB: 'zapped both channels', zapA: 'zapped channel A', zapB: 'zapped channel B', mix: 'moved the A/B mix',
        strobe: 'fired the strobe', noir: 'cut to black', rallume: 'brought the picture back', nb: 'switched to black and white',
        inverse: 'inverted the colours', miroir: 'turned on the mirror', sujet: 'picked the topic', creuse: 'dug for', retire: 'removed a film',
        image: 'adjusted the picture', arrive: 'joined the room', part: 'left the room', surA: 'on channel A', surB: 'on channel B'
      }
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
    '.salle .direct{display:inline-flex;align-items:center;gap:.5rem}' +
    '.salle .direct i{width:.5rem;height:.5rem;border-radius:50%;border:1px solid currentColor;flex:none}' +
    '.salle .direct[aria-pressed="true"]{border-color:rgba(255,62,62,.7)}' +
    '.salle .direct[aria-pressed="true"] i{background:#ff3e3e;border-color:#ff3e3e;box-shadow:0 0 8px #ff3e3e;animation:salleLed 1.6s steps(2,end) infinite}' +
    '@keyframes salleLed{50%{opacity:.3}}' +
    '.salle .fil{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(16px,env(safe-area-inset-top)) + 3.2rem);width:min(440px,calc(100vw - 32px));display:grid;gap:.3rem;justify-items:center;pointer-events:none}' +
    '.salle .fil div{font:500 .68rem/1.4 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.03em;color:#f2f1f6;background:rgba(8,7,13,.7);border:1px solid rgba(242,241,246,.16);padding:.35rem .6rem;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);text-align:center;transition:opacity .8s,transform .8s}' +
    '.salle .fil div b{color:#c9ff3d;font-weight:600}' +
    '.salle .fil div.part{opacity:0;transform:translateY(-6px)}' +
    '.salle .haut > span{display:flex;gap:.5rem;flex-wrap:wrap;justify-content:flex-end}' +
    '.salle .musique{display:inline-flex;align-items:stretch}' +
    '.salle .musique[hidden]{display:none}' +
    '.salle .musique button{padding:.65rem .7rem;letter-spacing:0;font-size:.8rem;min-width:2.4rem}' +
    '.salle .musique button + button{border-left:0}' +
    '.salle .musique .m-titre{display:inline-flex;align-items:center;max-width:14rem;padding:0 .7rem;font:500 .62rem/1 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.06em;color:rgba(242,241,246,.75);background:rgba(8,7,13,.6);border:1px solid rgba(242,241,246,.3);border-left:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.salle .musique .m-jouer.attend{color:#c9ff3d;border-color:#c9ff3d;animation:salleAttend 1.4s ease-in-out infinite}' +
    '@keyframes salleAttend{50%{box-shadow:0 0 0 6px rgba(201,255,61,.18)}}' +
    '@media (max-width:767px),(hover:none) and (pointer:coarse){' +
      '.salle .manette,.salle .plein{display:none}' +
      '.salle .cartel{display:none;top:auto;bottom:max(16px,env(safe-area-inset-bottom))}' +
      '.salle.info .cartel{display:block}' +
      '.salle .mob-info{display:inline-block}' +
      '.salle .musique .m-titre,.salle .musique .m-stop{display:none}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){.salle,.salle .ui{transition:none}.salle .allumage{display:none}}' +
    'html.salle-ouverte,html.salle-ouverte body{overflow:hidden}';
  document.head.appendChild(css);

  var salle = null, cadre = null, ouverte = false, tCalme = 0, films = ['', ''];
  // Chaîne commune : activée par défaut ; le choix du visiteur est retenu
  var commune = true, direct = { n: 1 };
  try { commune = localStorage.getItem('hct-commune') !== '0'; } catch (e) {}
  function envoyerCommune() { if (cadre && cadre.contentWindow) cadre.contentWindow.postMessage({ source: 'hct-site', type: 'commune', on: commune }, location.origin); }
  function libelleDirect() {
    var b = salle.querySelector('.direct');
    b.setAttribute('aria-pressed', String(commune));
    b.title = commune ? t('titreCommune') : t('titrePrivee');
    var txt = t('commune');
    if (commune) {
      if (direct.erreur) txt = t('indispo');
      else if (direct.etape === 'relais') txt = t('relais');
      else if (!direct.role) txt = t('connexion');
      else txt = t('direct') + ' · ' + direct.n;
    }
    salle.querySelector('.l-direct').textContent = txt;
  }
  function ajouterFil(m) {
    var F = t('fil'), verbe = '';
    if (m.a === 'zap') verbe = m.d === 0 ? F.zapA : m.d === 1 ? F.zapB : F.zapAB;
    else if (m.a === 'sujet') verbe = F.sujet + ' « ' + (m.s || '') + ' » ' + (m.d === 1 ? F.surB : F.surA);
    else if (m.a === 'creuse') verbe = F.creuse + ' « ' + (m.s || '') + ' »';
    else verbe = F[m.a];
    if (!verbe) return;
    var fil = salle.querySelector('.fil'), l = document.createElement('div');
    l.innerHTML = '<b>' + esc(m.nom || '') + '</b> ' + esc(verbe);
    fil.appendChild(l);
    while (fil.children.length > 3) fil.firstChild.remove();
    setTimeout(function () { l.classList.add('part'); setTimeout(function () { l.remove(); }, 900); }, 5500);
  }

  function t(k) { return T[lang()][k]; }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function construire() {
    salle = document.createElement('div');
    salle.className = 'salle'; salle.setAttribute('role', 'dialog'); salle.setAttribute('aria-modal', 'true');
    salle.setAttribute('aria-label', 'Hors Champ TV');
    salle.insertAdjacentHTML('beforeend',
      '<div class="ui haut">' +
        (autonome ? '<a class="bouton retour" href="' + CFG.retour + '"></a>' : '<button type="button" class="retour"></button>') +
        '<span><span class="musique" hidden><button type="button" class="m-jouer">▶</button><button type="button" class="m-stop">■</button><button type="button" class="m-suivant">⏭</button><span class="m-titre"></span></span><button type="button" class="direct" aria-pressed="false"><i></i><span class="l-direct"></span></button><button type="button" class="mob-info"></button><button type="button" class="plein"></button></span>' +
      '</div>' +
      '<div class="fil" aria-live="polite"></div>' +
      '<aside class="ui cartel">' +
        '<h2>Hors Champ TV</h2><div class="qui">Kim Maurice, ' + CFG.annee + ' · <span class="l-sous"></span></div>' +
        '<p class="l-texte"></p><div class="medium l-medium"></div>' +
        '<div class="films"><b class="l-ecran"></b><span class="l-films">…</span></div>' +
        '<div class="films m-cartel" hidden><b>♪</b><span class="l-piste"></span></div>' +
      '</aside>' +
      '<aside class="ui manette"><b class="l-manette"></b><div class="qr"></div><p class="l-qr"></p></aside>');
    document.body.appendChild(salle);

    var bRetour = salle.querySelector('.retour');
    if (!autonome) bRetour.addEventListener('click', function () { fermer(true); });
    salle.querySelector('.plein').addEventListener('click', basculerPleinEcran);
    salle.querySelector('.direct').addEventListener('click', function () {
      commune = !commune;
      try { localStorage.setItem('hct-commune', commune ? '1' : '0'); } catch (e) {}
      direct = { n: 1 };
      envoyerCommune(); libelles();
    });
    salle.querySelector('.mob-info').addEventListener('click', function () { salle.classList.toggle('info'); libelles(); });
    salle.querySelector('.m-jouer').addEventListener('click', function () { Musique.basculer(); });
    salle.querySelector('.m-stop').addEventListener('click', function () { Musique.stop(true); });
    salle.querySelector('.m-suivant').addEventListener('click', function () { Musique.suivante(); });
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
    libelleDirect();
    Musique.libelles();
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

  /* ---------- Musique : pistes du dossier media, jouées en boucle, et qui font réagir la télé ---------- */
  var Musique = (function () {
    var EXT = /\.(mp3|m4a|aac|ogg|oga|opus|wav|flac|mp4)$/i;
    var pistes = null, i = 0, audio = null, ctx = null, an = null, freq = null, tmp = null, boucle = 0;
    var basseMoy = 0, prec = 0, dernierKick = 0, energieMax = 0.002, energie = 0, dernierEnvoi = 0;
    var veut = true;   // le visiteur veut-il la musique ? (retenu s'il l'arrête)
    try { veut = localStorage.getItem('hct-musique') !== '0'; } catch (e) {}

    function nomPropre(f) { return decodeURIComponent(f).replace(/\.[^.]+$/, '').replace(/^\d+[\s._-]+/, '').replace(/[_]+/g, ' ').trim(); }
    function versPiste(nom, titre) { return { url: CFG.media + encodeURIComponent(nom), titre: titre || nomPropre(nom) }; }
    // La liste vient du dépôt GitHub (rien à mettre à jour à la main) ; sinon d'un fichier media/playlist.json
    var chargement = (function () {
      try { var c = JSON.parse(sessionStorage.getItem('hct-pistes') || 'null'); if (c && Date.now() - c.t < 600000) { pistes = c.l; return Promise.resolve(pistes); } } catch (e) {}
      return fetch('https://api.github.com/repos/' + CFG.depot + '/contents' + CFG.media.replace(/\/$/, ''))
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (l) { return l.filter(function (f) { return f.type === 'file' && EXT.test(f.name); }).map(function (f) { return f.name; }).sort(function (a, b) { return a.localeCompare(b, 'fr', { numeric: true }); }).map(function (n) { return versPiste(n); }); })
        .catch(function () {
          return fetch(CFG.media + 'playlist.json').then(function (r) { if (!r.ok) throw 0; return r.json(); })
            .then(function (l) { return (Array.isArray(l) ? l : []).map(function (x) { return typeof x === 'string' ? versPiste(x) : versPiste(x.fichier, x.titre); }); });
        })
        .catch(function () { return []; })
        .then(function (l) { pistes = l; try { sessionStorage.setItem('hct-pistes', JSON.stringify({ t: Date.now(), l: l })); } catch (e) {} libelles(); return l; });
    })();

    function joue() { return !!(audio && !audio.paused); }
    function libellesMusique() {
      if (!salle) return;
      var bloc = salle.querySelector('.musique'), cart = salle.querySelector('.m-cartel');
      var ok = !!(pistes && pistes.length);
      bloc.hidden = !ok; cart.hidden = !ok;
      if (!ok) return;
      var b = salle.querySelector('.m-jouer');
      b.textContent = joue() ? '❚❚' : '▶';
      b.setAttribute('aria-label', joue() ? t('pause') : t('jouer')); b.title = b.getAttribute('aria-label');
      b.classList.toggle('attend', !joue() && veut && ouverte);
      var st = salle.querySelector('.m-stop'), su = salle.querySelector('.m-suivant');
      st.setAttribute('aria-label', t('stop')); st.title = t('stop');
      su.setAttribute('aria-label', t('suivant')); su.title = t('suivant'); su.hidden = pistes.length < 2;
      salle.querySelector('.m-titre').textContent = '♪ ' + pistes[i].titre;
      salle.querySelector('.l-piste').textContent = t('musique') + ' — ' + pistes[i].titre;
    }
    function preparer() {
      if (!audio) {
        audio = new Audio(); audio.preload = 'auto';
        audio.addEventListener('ended', function () { suivante(); });
        audio.addEventListener('play', libellesMusique); audio.addEventListener('pause', libellesMusique);
      }
      if (!ctx) {
        try {
          ctx = new (window.AudioContext || window.webkitAudioContext)();
          an = ctx.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = 0.15;
          ctx.createMediaElementSource(audio).connect(an); an.connect(ctx.destination);
          freq = new Uint8Array(an.frequencyBinCount); tmp = new Float32Array(an.fftSize);
        } catch (e) { an = null; }
      }
      if (ctx && ctx.state === 'suspended') ctx.resume();
    }
    // À appeler pendant un clic : les navigateurs ne laissent jouer le son qu'après un geste du visiteur
    function jouer() {
      if (!pistes || !pistes.length) return;
      preparer();
      if (!audio.src || audio.dataset.piste !== String(i)) { audio.src = pistes[i].url; audio.dataset.piste = String(i); }
      var p = audio.play();
      if (p && p.catch) p.catch(function () { libellesMusique(); });
      cancelAnimationFrame(boucle); boucle = requestAnimationFrame(ecouter);
      libellesMusique();
    }
    function pause() { if (audio) audio.pause(); libellesMusique(); }
    function stop(parVisiteur) {
      if (audio) { audio.pause(); try { audio.currentTime = 0; } catch (e) {} }
      if (parVisiteur) { veut = false; try { localStorage.setItem('hct-musique', '0'); } catch (e) {} }
      libellesMusique();
    }
    function basculer() {
      if (joue()) { pause(); veut = false; try { localStorage.setItem('hct-musique', '0'); } catch (e) {} }
      else { veut = true; try { localStorage.setItem('hct-musique', '1'); } catch (e) {} jouer(); }
    }
    function suivante() {
      if (!pistes || !pistes.length) return;
      i = (i + 1) % pistes.length;
      if (audio) { audio.src = pistes[i].url; audio.dataset.piste = String(i); }
      if (veut && ouverte) jouer(); else libellesMusique();
    }
    // Analyse le son et l'envoie à la télé : basses, énergie et kicks (comme l'écoute BlackHole)
    function ecouter() {
      if (!joue() || !an) { boucle = 0; return; }
      an.getByteFrequencyData(freq); an.getFloatTimeDomainData(tmp);
      var hz = ctx.sampleRate / an.fftSize, b0 = Math.max(1, Math.floor(40 / hz)), b1 = Math.ceil(130 / hz), s = 0, k;
      for (k = b0; k <= b1; k++) s += freq[k];
      var basse = s / ((b1 - b0 + 1) * 255), r = 0;
      for (k = 0; k < tmp.length; k++) r += tmp[k] * tmp[k];
      r = Math.sqrt(r / tmp.length);
      energieMax = Math.max(r, energieMax * 0.9995, 0.002);
      energie = energie * 0.85 + (r / energieMax) * 0.15;
      var maint = performance.now(), monte = basse - prec, kick = false; prec = basse;
      if (basse > basseMoy * 1.45 && basse > 0.22 && monte > 0 && maint - dernierKick > 230) { kick = true; dernierKick = maint; }
      basseMoy = basseMoy * 0.97 + basse * 0.03;
      if (cadre && cadre.contentWindow && (kick || maint - dernierEnvoi > 40)) {
        dernierEnvoi = maint;
        cadre.contentWindow.postMessage({ source: 'hct-site', type: 'audio', basse: basse, energie: energie, kick: kick }, location.origin);
      }
      boucle = requestAnimationFrame(ecouter);
    }
    return {
      // Allumage de la salle : la musique démarre si le visiteur l'a ouverte d'un clic (et ne l'a pas coupée)
      demarrer: function (parClic) { if (veut && parClic) jouer(); else libellesMusique(); },
      arreter: function () { stop(false); cancelAnimationFrame(boucle); boucle = 0; },
      basculer: basculer, stop: stop, suivante: suivante, libelles: libellesMusique, pret: chargement
    };
  })();

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
    Musique.demarrer(!autonome && !viaHistorique);
  }
  function fermer(viaBouton) {
    if (!ouverte || autonome) return;
    ouverte = false;
    if (document.fullscreenElement) document.exitFullscreen();
    Musique.arreter();
    salle.classList.remove('on');
    setTimeout(function () { if (!ouverte) { salle.style.display = 'none'; eteindreTele(); reinitManette(); } }, 500);
    document.documentElement.classList.remove('salle-ouverte');
    window.dispatchEvent(new CustomEvent('salle:etat', { detail: { ouverte: false } }));
    if (viaBouton && location.hash === '#tv') history.back();
  }
  function reinitManette() {
    var m = salle.querySelector('.manette');
    m.classList.remove('connectee'); delete m.dataset.err; m.querySelector('.qr').innerHTML = '';
    films = ['', '']; direct = { n: 1 }; var f = salle.querySelector('.fil'); if (f) f.innerHTML = ''; libelles();
  }

  // Messages de la télé (iframe)
  window.addEventListener('message', function (e) {
    if (!cadre || e.source !== cadre.contentWindow || !e.data || e.data.source !== 'hct') return;
    var m = e.data, man = salle.querySelector('.manette');
    if (m.type === 'pret') { if (!mobile) cadre.contentWindow.postMessage({ source: 'hct-site', type: 'qr' }, location.origin); envoyerCommune(); }
    else if (m.type === 'direct') { direct = { role: m.role, n: Number(m.n) || 1, etape: m.etape, erreur: !!m.erreur }; libelleDirect(); }
    else if (m.type === 'direct-action') { if (commune) ajouterFil(m); }
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
