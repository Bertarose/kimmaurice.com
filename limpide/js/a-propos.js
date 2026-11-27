/* LIMPIDE — Page « À propos » : bouton de langue */
(function () {
  'use strict';
  const h = document.documentElement;
  const b = document.getElementById('btn-langue');
  function maj() {
    const en = h.lang.startsWith('en');
    document.getElementById('btn-langue-court').textContent = en ? 'FR' : 'EN';
    document.getElementById('btn-langue-long').textContent = en ? ' — Français' : ' — English';
    b.setAttribute('lang', en ? 'fr' : 'en');
    document.title = en ? 'How Limpide was designed — Case study' : 'Comment Limpide a été conçu — Étude de cas';
  }
  b.addEventListener('click', () => {
    const l = h.lang.startsWith('en') ? 'fr' : 'en';
    h.lang = l === 'en' ? 'en-CA' : 'fr-CA';
    LimpidePrefs.ecrire('langue', l);
    maj();
  });
  maj();
})();
