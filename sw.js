// Nukala Family Tree - Service Worker v6
// Added: Web Push Notification support
const CACHE_NAME = 'nukala-v6';

const STATIC_ASSETS = [
  '/shared.css', '/darkmode.css', '/manifest.json',
  '/logo.png', '/favicon.ico',
  '/icons/icon-192x192.png', '/icons/icon-512x512.png'
];

const ALWAYS_FRESH = [
  'site-data.js', 'admin.js', 'sw.js',
  'home.html', 'tree.html', 'join.html', 'history.html', 'gallery.html',
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
  const mustBeFresh = ALWAYS_FRESH.some(f => filename === f || filename.startsWith(f + '?'));
  if (mustBeFresh) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => caches.match(e.request))
    );
    return;
  }
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

// ─────────────────────────────────────────────
// PUSH NOTIFICATION HANDLER
// ─────────────────────────────────────────────
self.addEventListener('push', e => {
  let data = { title: 'Nukala Family', body: 'New update from the family!', url: '/', icon: '/icons/icon-192x192.png' };
  try { if (e.data) data = { ...data, ...JSON.parse(e.data.text()) }; } catch(err) {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'nukala-notification',
      renotify: true,
      data: { url: data.url || '/' },
      actions: [
        { action: 'open', title: '👁 View' },
        { action: 'close', title: '✕ Dismiss' }
      ]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;
  const targetUrl = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
