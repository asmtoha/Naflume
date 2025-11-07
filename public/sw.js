// Enhanced cache versioning with build hash and timestamp
const CACHE_VERSION = Date.now();
const CACHE_NAME = `naflume-cache-v${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `naflume-static-v${CACHE_VERSION}`;
const RUNTIME_CACHE_NAME = `naflume-runtime-v${CACHE_VERSION}`;

// Assets that should always be fetched fresh
const NO_CACHE_ASSETS = [
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/version.json'
];

// Static assets that can be cached for longer
const STATIC_ASSETS = [
  '/static/',
  '/favicon.ico',
  '/favicon.svg',
  '/logo192.png'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing with cache version:', CACHE_VERSION);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating, clearing old caches');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!key.includes(`v${CACHE_VERSION}`)) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => {
      // Notify clients about the update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_UPDATED' });
        });
      });
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Always fetch fresh for critical files
  if (NO_CACHE_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(
      fetch(request, { 
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }).then(response => {
        // Update cache in background for future use
        if (response.status === 200) {
          caches.open(RUNTIME_CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
          });
        }
        return response;
      }).catch(() => {
        // Fallback to cache if network fails
        return caches.match(request);
      })
    );
    return;
  }

  // Handle static assets with longer cache
  if (STATIC_ASSETS.some(asset => url.pathname.startsWith(asset))) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.match(request).then(cached => {
          if (cached) {
            // Update cache in background
            fetch(request).then(response => {
              if (response.status === 200) {
                cache.put(request, response.clone());
              }
            }).catch(() => {});
            return cached;
          }
          
          return fetch(request).then(response => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Default caching strategy for other assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      
      return fetch(request).then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request);
      });
    })
  );
});

// Listen for messages from the main thread to force cache refresh
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    // Clear all caches when requested
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    // Send version info back to client
    event.ports[0].postMessage({
      type: 'VERSION_INFO',
      version: CACHE_VERSION,
      cacheName: CACHE_NAME
    });
  }
});


