const CACHE_NAME = 'heritage-reader-v1';
const URLS_TO_CACHE = [
    '/',
    '/icon.png',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(URLS_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Stale-While-Revalidate strategy for faster loading
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                const fetchPromise = fetch(event.request)
                    .then((networkResponse) => {
                        // Check valid response
                        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                            // Clone and cache
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Could return offline fallback here
                    });
                return response || fetchPromise;
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
