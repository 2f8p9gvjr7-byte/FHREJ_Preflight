const CACHE = 'fhrej-v1';
const ASSETS = [
  '/FHREJ-Prevol/',
  '/FHREJ-Prevol/index.html',
  '/FHREJ-Prevol/manifest.json',
  '/FHREJ-Prevol/icon-192.png',
  '/FHREJ-Prevol/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200) return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match('/FHREJ-Prevol/index.html'));
    })
  );
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
