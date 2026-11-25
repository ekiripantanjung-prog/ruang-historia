/* Simpan file aplikasi agar bisa dibuka tanpa internet.
   Naikkan angka VERSI setiap kali materi diubah, supaya HP siswa mengambil versi baru. */
const VERSI = 'historia-v2';
const FILE = ['./', 'index.html', 'app.css', 'app.js', 'manifest.webmanifest',
  'data/koleksi.js', 'data/indonesia/bab01.js', 'fonts/ArchivoBlack.ttf', 'fonts/SourceSans3.ttf',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/logo.svg', 'icons/favicon-64.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSI).then(c => c.addAll(FILE))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSI).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('.mp4')) return; // video diputar langsung
  e.respondWith(fetch(e.request).then(r => { const salin = r.clone(); caches.open(VERSI).then(c => c.put(e.request, salin)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
