const CACHE_NAME = 'telugu-wordle-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/keyboard.css',
    '/js/game.js',
    '/js/keyboard.js',
    '/js/telugu-utils.js',
    '/js/word-list.js',
    '/js/storage.js',
    '/js/main.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});