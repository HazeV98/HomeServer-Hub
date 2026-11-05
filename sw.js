const CACHE_NAME = 'app-hub-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './data.json',
    './manifest.json',
    './icon.svg'
];

// Installazione: memorizza gli asset principali nella cache
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Attivazione: pulisce le vecchie versioni della cache
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Prova prima la rete, se fallisce (offline) carica dalla cache
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                const resClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});
 
