/* Service worker: precache + stale-while-revalidate. Incrementare VERSION a ogni rilascio. */
const VERSION = 'registro-v1.0.4';
const ASSETS = [
 "./",
 "manifest.json",
 "pages/agenda.html",
 "pages/annotazioni.html",
 "pages/argomenti.html",
 "pages/assenze.html",
 "pages/compiti.html",
 "pages/elezioni.html",
 "pages/home.html",
 "pages/note.html",
 "pages/orario.html",
 "pages/voti.html",
 "css/agenda.css",
 "css/annotazioni.css",
 "css/argomenti.css",
 "css/assenze.css",
 "css/compiti.css",
 "css/elezioni.css",
 "css/global.css",
 "css/header.css",
 "css/home.css",
 "css/note.css",
 "css/orario.css",
 "css/responsive.css",
 "css/sidebar.css",
 "css/variables.css",
 "css/voti.css",
 "js/agenda.js",
 "js/annotazioni.js",
 "js/app.js",
 "js/argomenti.js",
 "js/assenze.js",
 "js/compiti.js",
 "js/data.js",
 "js/elezioni.js",
 "js/forms.js",
 "js/home.js",
 "js/navigation.js",
 "js/note.js",
 "js/orario.js",
 "js/storage.js",
 "js/ui.js",
 "js/util.js",
 "js/voti.js",
 "assets/fonts/roboto-latin-700-normal.woff2",
 "assets/fonts/ubuntu-latin-400-normal.woff2",
 "assets/fonts/ubuntu-latin-500-normal.woff2",
 "assets/fonts/ubuntu-latin-700-normal.woff2",
 "assets/logo/logo.png",
 "assets/icons/icon-192.png",
 "assets/icons/icon-512.png",
 "assets/icons/icon-maskable-512.png",
 "assets/icons/menu-agenda.png",
 "assets/icons/menu-annotazioni.png",
 "assets/icons/menu-argomenti.png",
 "assets/icons/menu-assenze.png",
 "assets/icons/menu-bacheca.png",
 "assets/icons/menu-carrello.png",
 "assets/icons/menu-colloqui.png",
 "assets/icons/menu-compiti.png",
 "assets/icons/menu-documenti.png",
 "assets/icons/menu-elezioni.png",
 "assets/icons/menu-gruppi.png",
 "assets/icons/menu-messaggi.png",
 "assets/icons/menu-negozio.png",
 "assets/icons/menu-note.png",
 "assets/icons/menu-notifiche.png",
 "assets/icons/menu-orario.png",
 "assets/icons/menu-pagelle-doc.png",
 "assets/icons/menu-pagelle-riep.png",
 "assets/icons/menu-voti.png"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(req, { ignoreSearch: true });
    const net = fetch(req).then(r => { if (r && r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }          // dalla cache, aggiornata in background
    const r = await net;
    if (r) return r;
    if (req.mode === 'navigate') return (await cache.match('index.html')) || (await cache.match('./'));   // fallback offline
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }));
});
