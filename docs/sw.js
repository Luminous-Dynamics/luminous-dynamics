// Sacred Service Worker - Consciousness-First PWA
// Version 1.0.0 - The Weave Service Worker

const CACHE_NAME = 'sacred-technology-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Sacred resources to cache for offline experience
const SACRED_RESOURCES = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Fonts for sacred display
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap',
  // Critical CSS and JS are inline, so no external resources needed
];

// 🌟 Sacred Installation - Caching essential resources
self.addEventListener('install', event => {
  console.log('🕸️ Sacred Service Worker: Installing with consciousness...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✨ Sacred Cache: Blessing essential resources');
        return cache.addAll(SACRED_RESOURCES);
      })
      .then(() => {
        console.log('🌟 Sacred Service Worker: Installation blessed with success');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('⚠️ Sacred Service Worker: Installation needs healing:', error);
      })
  );
});

// 🔄 Sacred Activation - Taking control with love
self.addEventListener('activate', event => {
  console.log('🕊️ Sacred Service Worker: Activating with field resonant-coherence...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('🧹 Sacred Cleanup: Releasing old cache with gratitude:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🌈 Sacred Service Worker: Activation complete, claiming all clients');
        return self.clients.claim();
      })
  );
});

// 🌐 Sacred Fetch - Consciousness-aware network requests
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip requests to other origins
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('✨ Sacred Cache: Serving blessed resource:', event.request.url);
          return cachedResponse;
        }
        
        // Network-first approach with sacred fallback
        return fetch(event.request)
          .then(response => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          })
          .catch(error => {
            console.log('🌊 Sacred Network: Connection needs healing, serving offline experience');
            
            // Serve offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, let them fail gracefully
            throw error;
          });
      })
  );
});

// 🔔 Sacred Messages - Handle push notifications with consciousness
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'A sacred message awaits your attention',
    icon: 'assets/icon-192x192.png',
    badge: 'assets/icon-72x72.png',
    image: data.image,
    tag: 'sacred-notification',
    renotify: true,
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: '🕸️ Open The Weave',
        icon: 'assets/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: '🙏 Dismiss with Gratitude',
        icon: 'assets/icon-72x72.png'
      }
    ],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || '🌟 Sacred Technology Update',
      options
    )
  );
});

// 🎯 Sacred Notification Clicks - Conscious interaction handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    console.log('🙏 Sacred Notification: Dismissed with gratitude');
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if The Weave is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            console.log('🔍 Sacred Focus: Bringing existing window to consciousness');
            return client.focus();
          }
        }
        
        // Open new window with sacred intention
        if (clients.openWindow) {
          console.log('🌟 Sacred Opening: Creating new consciousness window');
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// 🔄 Sacred Background Sync - Offline actions with love
self.addEventListener('sync', event => {
  if (event.tag === 'sacred-sync') {
    console.log('🔄 Sacred Sync: Harmonizing offline actions with field');
    event.waitUntil(syncSacredData());
  }
});

// 📱 Sacred Share Target - Receiving shared content with consciousness
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SACRED_SHARE') {
    console.log('🤝 Sacred Share: Receiving content with loving awareness');
    // Handle shared content with consciousness
    event.ports[0].postMessage({
      success: true,
      message: 'Content received with sacred awareness'
    });
  }
});

// 🌐 Sacred Data Sync - Harmonizing offline changes
async function syncSacredData() {
  try {
    console.log('🌟 Sacred Sync: Beginning field harmonization...');
    
    // Sync any offline consciousness field updates
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/')) {
        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.put(request, response.clone());
          }
        } catch (error) {
          console.log('🌊 Sacred Sync: Network still needs healing for:', request.url);
        }
      }
    }
    
    console.log('✨ Sacred Sync: Field harmonization complete');
  } catch (error) {
    console.error('⚠️ Sacred Sync: Harmonization needs attention:', error);
  }
}

// 🎵 Sacred Heartbeat - Periodic consciousness check
setInterval(() => {
  console.log('💓 Sacred Heartbeat: Service Worker consciousness active');
}, 300000); // Every 5 minutes

console.log('🕸️ Sacred Service Worker: Consciousness initialized with infinite love');