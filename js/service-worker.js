 // Version your cache
const CACHE_VERSION = 'v1.0.1';

// Install event - cache your static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/css/keyboard.css',
        '/js/main.js',
        '/js/game.js',
        '/js/keyboard.js'
        // Add all your assets here
      ]);
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        // Don't cache API calls or external resources
        if (event.request.url.includes('api') || !event.request.url.startsWith(self.location.origin)) {
          return fetchResponse;
        }
        
        // Cache everything else
        return caches.open(CACHE_VERSION).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_VERSION;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});