// Service Worker for Dolab Event Manager PWA
const CACHE_NAME = 'dolab-events-v1.0.0';
const STATIC_CACHE_NAME = 'dolab-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'dolab-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Add other static assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/events/,
  /\/api\/attendees/,
  /\/api\/analytics/,
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static files - cache first
    if (STATIC_FILES.some(file => url.pathname === file || url.pathname.includes(file))) {
      event.respondWith(
        caches.match(request)
          .then((response) => {
            return response || fetch(request);
          })
      );
      return;
    }

    // API requests - network first, cache fallback
    if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Clone response before caching
            const responseClone = response.clone();
            
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
            
            return response;
          })
          .catch(() => {
            // Network failed, try cache
            return caches.match(request);
          })
      );
      return;
    }

    // Images and other assets - cache first
    if (request.destination === 'image' || 
        url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      event.respondWith(
        caches.match(request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            return fetch(request)
              .then((response) => {
                const responseClone = response.clone();
                
                caches.open(DYNAMIC_CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
                
                return response;
              });
          })
      );
      return;
    }

    // All other requests - network first
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Network failed, try cache
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              
              // Return offline page for navigation requests
              if (request.mode === 'navigate') {
                return caches.match('/');
              }
              
              // Return a generic offline response
              return new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain',
                }),
              });
            });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-checkins') {
    event.waitUntil(syncCheckIns());
  }
  
  if (event.tag === 'sync-tickets') {
    event.waitUntil(syncTicketPurchases());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Dolab Events',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icon-96.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-96.png',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification('Dolab Events', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for background sync
async function syncCheckIns() {
  try {
    // Get pending check-ins from IndexedDB or localStorage
    const pendingCheckIns = await getPendingCheckIns();
    
    for (const checkIn of pendingCheckIns) {
      try {
        await fetch('/api/checkin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkIn),
        });
        
        // Remove from pending list
        await removePendingCheckIn(checkIn.id);
      } catch (error) {
        console.error('Failed to sync check-in:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncTicketPurchases() {
  try {
    // Get pending ticket purchases
    const pendingPurchases = await getPendingTicketPurchases();
    
    for (const purchase of pendingPurchases) {
      try {
        await fetch('/api/tickets/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(purchase),
        });
        
        // Remove from pending list
        await removePendingTicketPurchase(purchase.id);
      } catch (error) {
        console.error('Failed to sync ticket purchase:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingCheckIns() {
  // Implementation would use IndexedDB
  return [];
}

async function removePendingCheckIn(id) {
  // Implementation would use IndexedDB
  console.log('Removing pending check-in:', id);
}

async function getPendingTicketPurchases() {
  // Implementation would use IndexedDB
  return [];
}

async function removePendingTicketPurchase(id) {
  // Implementation would use IndexedDB
  console.log('Removing pending ticket purchase:', id);
}

// Cache size management
async function cleanupCache() {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const requests = await cache.keys();
  
  if (requests.length > 100) {
    // Remove oldest entries
    const toDelete = requests.slice(0, requests.length - 50);
    await Promise.all(toDelete.map(request => cache.delete(request)));
  }
}

// Periodic cache cleanup
setInterval(cleanupCache, 24 * 60 * 60 * 1000); // Daily cleanup


