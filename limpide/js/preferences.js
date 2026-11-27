/* LIMPIDE — Préférences d’affichage
   Appliquées avant l’affichage de la page pour éviter un clignotement.
   Seuls le thème, la taille du texte et la langue sont gardés sur
   l’appareil (localStorage). Le rapport n’est jamais enregistré. */
(function () {
  var p = {};
  try { p = JSON.parse(localStorage.getItem('limpide:preferences') || '{}') || {}; } catch (e) { p = {}; }
  var params = new URLSearchParams(location.search);
  var l = params.get('lang');
  if (l === 'fr' || l === 'en') p.langue = l;
  if (!p.langue) p.langue = (navigator.language || 'fr').toLowerCase().indexOf('en') === 0 ? 'en' : 'fr';
  var h = document.documentElement;
  h.setAttribute('lang', p.langue === 'en' ? 'en-CA' : 'fr-CA');
  h.setAttribute('data-theme', p.theme === 'light' || p.theme === 'dark' ? p.theme : 'auto');
  h.setAttribute('data-taille', p.taille === '2' || p.taille === '3' ? p.taille : '1');
  window.LimpidePrefs = {
    lire: function () { return { langue: p.langue, theme: h.getAttribute('data-theme'), taille: h.getAttribute('data-taille') }; },
    ecrire: function (cle, valeur) {
      p[cle] = valeur;
      try { localStorage.setItem('limpide:preferences', JSON.stringify({ langue: p.langue, theme: p.theme, taille: p.taille })); } catch (e) { /* navigation privée : on ignore */ }
    }
  };
})();
