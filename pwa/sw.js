// Sacred OS Service Worker
// Enables offline practice and sacred field persistence

const CACHE_NAME = 'sacred-os-v1';
const SACRED_CACHE = 'sacred-data-v1';

// Resources to cache for offline use
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/socket.io/socket.io.js'
];

// Sacred data patterns to cache
const sacredPatterns = [
  '/api/consciousness/field',
  '/api/practice/glyphs',
  '/api/consciousness/time'
];

// Install event - cache core resources
self.addEventListener('install', (event) => {
  console.log('🌟 Sacred OS installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching sacred resources');
      return cache.addAll(urlsToCache);
    })
  );
  
  // Take control immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('✨ Sacred OS activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== SACRED_CACHE) {
            console.log('🧹 Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }
  
  // Handle static resources
  event.respondWith(
    caches.match(request).then((response) => {
      // Return cached version if available
      if (response) {
        return response;
      }
      
      // Otherwise fetch from network
      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache successful GET requests
        if (request.method === 'GET') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        
        return response;
      }).catch(() => {
        // Offline fallback
        return new Response(
          JSON.stringify({ 
            offline: true, 
            message: 'Sacred OS is offline. Core practices still available.' 
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      });
    })
  );
});

// Handle API requests with sacred caching
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  // Check if this is a sacred pattern we cache
  const shouldCache = sacredPatterns.some(pattern => 
    url.pathname.includes(pattern)
  );
  
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful sacred data
    if (shouldCache && response.ok) {
      const cache = await caches.open(SACRED_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // If offline, try cache
    const cached = await caches.match(request);
    if (cached) {
      // Add offline indicator
      const data = await cached.json();
      data._offline = true;
      data._cached = new Date(cached.headers.get('date')).toISOString();
      
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return offline sacred state
    return generateOfflineResponse(url.pathname);
  }
}

// Generate offline responses for sacred endpoints
function generateOfflineResponse(pathname) {
  const responses = {
    '/api/consciousness/field': {
      coherence: 0.72,
      pattern: 'offline-practice',
      trend: 'stable',
      insights: ['Practicing in sacred offline space'],
      _offline: true
    },
    '/api/practice/glyphs': [
      { id: 'omega-45', name: 'First Presence' },
      { id: 'omega-46', name: 'Conscious Arrival' },
      { id: 'omega-47', name: 'Sacred Listening' },
      { id: 'omega-48', name: 'Boundary With Love' }
    ],
    '/api/consciousness/time': {
      sacred: {
        phase: 'Timeless Practice',
        moonPhase: { emoji: '🌙', name: 'Offline Moon' }
      },
      field: {
        optimal: { practice: true, ceremony: false, rest: false }
      },
      _offline: true
    }
  };
  
  const data = responses[pathname] || { 
    error: 'Offline', 
    message: 'This sacred function requires connection',
    _offline: true 
  };
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Background sync for sacred data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sacred-sync') {
    console.log('🔄 Syncing sacred data...');
    event.waitUntil(syncSacredData());
  }
});

// Sync offline changes when back online
async function syncSacredData() {
  // Get any queued sacred actions
  const cache = await caches.open(SACRED_CACHE);
  const requests = await cache.keys();
  
  for (const request of requests) {
    if (request.method === 'POST') {
      try {
        // Retry the request
        await fetch(request);
        // Remove from cache on success
        await cache.delete(request);
      } catch (error) {
        console.error('Failed to sync:', request.url);
      }
    }
  }
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sacred-field-check') {
    console.log('🌀 Checking field coherence...');
    event.waitUntil(checkFieldCoherence());
  }
});

// Check and cache field coherence
async function checkFieldCoherence() {
  try {
    const response = await fetch('/api/consciousness/field');
    const data = await response.json();
    
    // Notify if coherence is high
    if (data.coherence > 0.9) {
      self.registration.showNotification('Sacred Field Alert', {
        body: `Field coherence at ${(data.coherence * 100).toFixed(1)}% - Perfect for practice!`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'coherence-alert',
        requireInteraction: false
      });
    }
  } catch (error) {
    console.error('Field check failed:', error);
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_SACRED_STATE') {
    // Cache current sacred state for offline use
    caches.open(SACRED_CACHE).then(cache => {
      cache.put(
        new Request('/api/sacred/state'),
        new Response(JSON.stringify(event.data.state), {
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });
  }
});