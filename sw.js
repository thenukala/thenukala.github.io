// Nukala Family Tree - Service Worker v3
const CACHE_NAME = 'nukala-v3';
const ASSETS = [
  '/', '/index.html', '/home.html', '/tree.html', '/history.html',
  '/gallery.html', '/contact.html', '/facts.html', '/stats.html',
  '/events.html', '/qr.html', '/shared.css', '/darkmode.css',
  '/auth.js', '/darkmode.js', '/search.js', '/transitions.js',
  '/lang.js', '/notifications.js', '/splash.js',
  '/manifest.json', '/logo.png', '/favicon.ico',
  '/icons/icon-192x192.png', '/icons/icon-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(ASSETS).catch(()=>{}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        if(res && res.status === 200 && res.type !== 'opaque'){
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        if(e.request.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});
