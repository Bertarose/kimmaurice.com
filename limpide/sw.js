/* LIMPIDE — Travailleur hors ligne
   Garde une copie des fichiers de l’application pour qu’elle fonctionne
   sans connexion. Il ne voit jamais le contenu des rapports : ceux-ci
   ne quittent pas la page. Changer VERSION à chaque mise en ligne. */
const VERSION = 'limpide-2.1.0';
const FICHIERS = [
  './', './index.html', './a-propos.html', './manifest.webmanifest',
  './css/limpide.css',
  './js/preferences.js', './js/porte.js', './js/exemples.js', './js/glossaire.js', './js/regles.js', './js/moteur.js', './js/app.js', './js/a-propos.js',
  './img/icone.svg', './img/icone-32.png', './img/icone-192.png', './img/icone-512.png', './img/icone-masquable-512.png', './img/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(cles => Promise.all(cles.filter(k => k.startsWith('limpide-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réseau d’abord pour les pages (mises à jour rapides), copie locale sinon
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copie = r.clone(); caches.open(VERSION).then(c => c.put(req, copie)); return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
