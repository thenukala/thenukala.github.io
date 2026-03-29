// Nukala Family Tree - Service Worker v4
// Strategy: Network-first for HTML and JS data files, cache-first for static assets
const CACHE_NAME = 'nukala-v4';

// Static assets that rarely change - cache these
const STATIC_ASSETS = [
  '/shared.css', '/darkmode.css', '/manifest.json',
  '/logo.png', '/favicon.ico',
  '/icons/icon-192x192.png', '/icons/icon-512x512.png'
];

// Files that must ALWAYS be fresh (never serve from cache)
const ALWAYS_FRESH = [
  'site-data.js',
  'home.html', 'tree.html', 'history.html', 'gallery.html',
  'facts.html', 'stats.html', 'events.html', 'recipes.html',
  'achievements.html', 'videos.html', 'polls.html', 'map.html',
  'qr.html', 'contact.html', 'index.html', 'admin.html',
  'nukala.js', 'auth.js', 'lang.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(STATIC_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const filename = url.pathname.split('/').pop();

  // Always fetch fresh for HTML pages, JS files and data files
  // This ensures admin changes always show immediately after publish
  const mustBeFresh = ALWAYS_FRESH.some(f => filename === f || filename.startsWith(f + '?'));

  if (mustBeFresh) {
    // Network-first: always try network, fall back to cache only if offline
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for static assets (images, CSS, icons)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        if (e.request.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});
