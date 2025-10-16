/**
 * Service Worker for Axiom Loom Catalog
 * 
 * Provides caching and offline support for better performance
 */

const CACHE_NAME = 'axiom-loom-catalog-v1';
const API_CACHE_NAME = 'axiom-loom-api-cache-v1';
const IMAGE_CACHE_NAME = 'axiom-loom-image-cache-v1';

// Files to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/favicon.ico'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, network fallback
  cacheFirst: async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      fetch(request).then(response => {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
      });
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  },

  // Network first, cache fallback
  networkFirst: async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    
    try {
      const networkResponse = await fetch(request);
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  },

  // Stale while revalidate
  staleWhileRevalidate: async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    const networkPromise = fetch(request).then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    });
    
    return cachedResponse || networkPromise;
  }
};

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.startsWith('axiom-loom-') && 
                   cacheName !== CACHE_NAME &&
                   cacheName !== API_CACHE_NAME &&
                   cacheName !== IMAGE_CACHE_NAME;
          })
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle requests with appropriate strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // API requests - network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      CACHE_STRATEGIES.networkFirst(request, API_CACHE_NAME)
        .catch(() => {
          // Return cached response or error message
          return caches.match(request) || new Response(
            JSON.stringify({ error: 'Offline - cached data not available' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Image requests - cache first
  if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url.pathname)) {
    event.respondWith(
      CACHE_STRATEGIES.cacheFirst(request, IMAGE_CACHE_NAME)
    );
    return;
  }

  // Static assets - stale while revalidate
  if (/\.(js|css|woff2?)$/i.test(url.pathname) || url.pathname.startsWith('/static/')) {
    event.respondWith(
      CACHE_STRATEGIES.staleWhileRevalidate(request, CACHE_NAME)
    );
    return;
  }

  // HTML pages - network first for freshness
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      CACHE_STRATEGIES.networkFirst(request, CACHE_NAME)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Default - stale while revalidate
  event.respondWith(
    CACHE_STRATEGIES.staleWhileRevalidate(request, CACHE_NAME)
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-repositories') {
    event.waitUntil(syncRepositories());
  }
});

// Helper function to sync repositories
async function syncRepositories() {
  try {
    const response = await fetch('/api/repository/sync', {
      method: 'POST'
    });
    
    if (response.ok) {
      // Notify clients of successful sync
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: await response.json()
        });
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});