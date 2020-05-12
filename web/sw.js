const staticCacheName = "smartWater-0.1.4";

const staticCacheFileNames = [];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName)
      .then((cache) => {
        cache.addAll([
          //"/",
          "manifest.json",
          //...staticCacheFileNames
        ]);
      })
      .catch((error) => {
        console.log(`Error caching static assets: ${error}`);
      })
  );
});

self.addEventListener("activate", (event) => {
  if (self.clients && clients.claim) {
    clients.claim();
  }
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith("smartWater-") && cacheName !== staticCacheName;
        })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      ).catch((error) => {
        console.log(`Some error occurred while removing existing cache: ${error}`);
      });
    }).catch((error) => {
      console.log(`Some error occurred while removing existing cache: ${error}`);
    }));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }).catch((error) => {
      console.log(`Some error occurred while saving data to dynamic cache: ${error}`);
    })
  );
});