/* =====================================================================
   LIMPIDE — Porte d’entrée de la démonstration privée
   ---------------------------------------------------------------------
   Demande un mot de passe avant d’afficher l’application.
   IMPORTANT : le site est statique et le dépôt est public. Cette porte
   garde la démo à l’écart des visiteurs, mais ce n’est pas une
   protection forte : quelqu’un qui lit le code source peut la contourner.

   Le mot de passe n’est pas écrit ici : seule son empreinte (SHA-256)
   l’est. Pour le changer, calculer l’empreinte de « limpide: » suivi du
   nouveau mot de passe en minuscules et sans accents, par exemple :
     printf 'limpide:%s' 'nouveau-mot-de-passe' | shasum -a 256
   puis remplacer EMPREINTE ci-dessous (et VERSION dans sw.js).
   L’accès dure le temps de l’onglet (sessionStorage), puis on redemande.
   ===================================================================== */
(function () {
  'use strict';
  const EMPREINTE = 'c142ea8c12d5c74e5d285a132dd306aa9e62eaf03ca2e1f6f9eff2befabafc41';
  const CLE = 'limpide:acces';
  const h = document.documentElement;

  // SHA-256 en JavaScript pur (fonctionne aussi hors HTTPS)
  function sha256(texte) {
    const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    const octets = Array.from(new TextEncoder().encode(texte));
    const longueur = octets.length * 8;
    octets.push(0x80);
    while (octets.length % 64 !== 56) octets.push(0);
    for (let i = 7; i >= 0; i--) octets.push(i > 3 ? 0 : (longueur >>> (i * 8)) & 0xff);
    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const r = (x, n) => (x >>> n) | (x << (32 - n));
    for (let i = 0; i < octets.length; i += 64) {
      const w = new Array(64);
      for (let j = 0; j < 16; j++) w[j] = (octets[i + j * 4] << 24) | (octets[i + j * 4 + 1] << 16) | (octets[i + j * 4 + 2] << 8) | octets[i + j * 4 + 3];
      for (let j = 16; j < 64; j++) {
        const s0 = r(w[j - 15], 7) ^ r(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = r(w[j - 2], 17) ^ r(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, hh] = H;
      for (let j = 0; j < 64; j++) {
        const t1 = (hh + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[j] + w[j]) | 0;
        const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H = H.map((v, k) => (v + [a, b, c, d, e, f, g, hh][k]) | 0);
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
  }
  const normaliser = s => s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function ouvrir() {
    h.setAttribute('data-acces', 'ok');
    const titre = document.querySelector('main h1:not([hidden])') || document.querySelector('main h1');
    const vue = document.querySelector('main .vue:not([hidden]) h1') || titre;
    if (vue) vue.focus({ preventScroll: true });
  }

  // Déjà entré pendant cette visite?
  try { if (sessionStorage.getItem(CLE) === EMPREINTE) { h.setAttribute('data-acces', 'ok'); return; } } catch (e) { /* stockage bloqué */ }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-porte');
    const champ = document.getElementById('mot-de-passe');
    const erreur = document.getElementById('erreur-porte');
    const voir = document.getElementById('voir-mdp');
    if (!form) return;
    champ.focus();
    voir.addEventListener('click', () => {
      const montre = champ.type === 'password';
      champ.type = montre ? 'text' : 'password';
      voir.setAttribute('aria-pressed', String(montre));
      champ.focus();
    });
    champ.addEventListener('input', () => { erreur.hidden = true; champ.removeAttribute('aria-invalid'); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (sha256('limpide:' + normaliser(champ.value)) === EMPREINTE) {
        try { sessionStorage.setItem(CLE, EMPREINTE); } catch (err) { /* stockage bloqué : accès pour cette page seulement */ }
        champ.value = '';
        ouvrir();
      } else {
        erreur.hidden = false;
        champ.setAttribute('aria-invalid', 'true');
        champ.select();
      }
    });
    // Bouton de langue de la porte
    const bl = document.getElementById('porte-langue');
    if (bl) bl.addEventListener('click', () => {
      const l = h.lang.startsWith('en') ? 'fr' : 'en';
      const bouton = document.getElementById('btn-langue');
      if (bouton) bouton.click(); else { h.lang = l === 'en' ? 'en-CA' : 'fr-CA'; LimpidePrefs.ecrire('langue', l); }
      bl.querySelector('.court').textContent = l === 'en' ? 'FR' : 'EN';
      bl.querySelector('.vc').textContent = l === 'en' ? ' — Français' : ' — English';
      bl.setAttribute('lang', l === 'en' ? 'fr' : 'en');
      champ.focus();
    });
  });
})();
