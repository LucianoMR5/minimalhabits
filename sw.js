const CACHE_NAME = 'minimal-discipline-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Try to cache assets, log warning if some fail (non-critical)
      return cache.addAll(ASSETS).catch(err => {
        console.warn('PWA: Some assets could not be cached automatically.', err);
      });
    })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch events
self.addEventListener('fetch', (event) => {
  // Only handle standard GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request).catch(() => {
        // Optional: return a fallback for specific types (e.g., images or pages)
        return null; 
      });
    })
  );
});