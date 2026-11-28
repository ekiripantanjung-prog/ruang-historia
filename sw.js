/* Simpan file aplikasi agar bisa dibuka tanpa internet.
   Naikkan angka VERSI setiap kali materi diubah, supaya HP siswa mengambil versi baru. */
const VERSI = 'historia-v51';
const FILE = ['./', 'index.html', 'app.css', 'app.js', 'manifest.webmanifest', 'data/koleksi.js', 'data/pengaturan.js', 'fonts/ArchivoBlack.ttf', 'fonts/SourceSans3.ttf', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/logo.svg', 'icons/favicon-64.png', 'lib/qrcode.js', 'lib/pptxgen.bundle.js', 'data/indonesia/bab01.js', 'data/indonesia/bab02.js', 'data/indonesia/bab03.js', 'data/indonesia/bab04.js', 'data/indonesia/bab05.js', 'data/indonesia/bab06.js', 'data/indonesia/bab07.js', 'data/indonesia/bab08.js', 'data/indonesia/bab09.js', 'data/indonesia/bab10.js', 'data/indonesia/bab11.js', 'data/dunia/bab01.js', 'data/dunia/bab02.js', 'data/dunia/bab03.js', 'data/dunia/bab04.js', 'data/dunia/bab05.js', 'data/dunia/bab06.js', 'data/dunia/bab07.js', 'data/dunia/bab08.js', 'data/dunia/bab09.js', 'data/ski/bab01.js', 'data/ski/bab02.js', 'data/ski/bab03.js', 'data/ski/bab04.js', 'data/ski/bab05.js', 'data/ski/bab06.js', 'data/ski/bab07.js', 'data/ski/bab08.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSI).then(c => c.addAll(FILE.map(f => new Request(f, { cache: 'reload' }))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSI).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('.mp4')) return; // video diputar langsung
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const salin = r.clone(); caches.open(VERSI).then(c => c.put(e.request, salin)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
