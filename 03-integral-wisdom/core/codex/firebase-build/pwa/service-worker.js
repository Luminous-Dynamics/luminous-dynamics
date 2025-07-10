/**
 * Sacred Council Hub - Service Worker
 * Provides offline access to sacred wisdom and practices
 */

const CACHE_NAME = 'sacred-council-v1';
const DYNAMIC_CACHE = 'sacred-dynamic-v1';

// Core files to cache for offline access
const STATIC_ASSETS = [
  '/',
  '/sacred-council-hub.html',
  '/unified-consciousness-demo.html',
  '/applied-harmonies-dojo.html',
  '/offline.html',
  '/css/sacred-styles.css',
  '/js/sacred-state-api.js',
  '/pwa/manifest.json'
];

// Sacred glyphs and practice data to cache
const SACRED_DATA = [
  '/data/glyphs/foundational/omega-45.json',
  '/data/glyphs/foundational/omega-46.json',
  '/data/glyphs/foundational/omega-47.json',
  '/data/glyphs/foundational/omega-48.json',
  '/data/sacred-messages.json',
  '/data/field-states.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('🌟 Sacred Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching sacred assets...');
        return cache.addAll([...STATIC_ASSETS, ...SACRED_DATA]);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✨ Sacred Service Worker activated');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls - network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets - cache first, network fallback
  event.respondWith(cacheFirst(request));
});

// Cache strategies
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    console.log('📂 Serving from cache:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('💔 Fetch failed:', error);
    return caches.match('/offline.html');
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('📡 Network failed, checking cache:', request.url);
    const cached = await caches.match(request);
    return cached || new Response(
      JSON.stringify({ error: 'Offline', message: 'Sacred wisdom temporarily unavailable' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Background sync for sacred messages
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sacred-messages') {
    console.log('🔄 Syncing sacred messages...');
    event.waitUntil(syncSacredMessages());
  }
});

async function syncSacredMessages() {
  // Get pending messages from IndexedDB
  const db = await openDB();
  const tx = db.transaction('pending-messages', 'readonly');
  const messages = await tx.objectStore('pending-messages').getAll();

  for (const message of messages) {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      
      // Remove from pending after successful send
      const deleteTx = db.transaction('pending-messages', 'readwrite');
      await deleteTx.objectStore('pending-messages').delete(message.id);
    } catch (error) {
      console.error('Failed to sync message:', error);
    }
  }
}

// Push notifications for sacred events
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'Sacred wisdom awaits',
    icon: '/pwa/icons/icon-192x192.png',
    badge: '/pwa/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'sacred-notification',
    data: data,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Later' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || '🌟 Sacred Council',
      options
    )
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Message handler for client communication
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    caches.open(DYNAMIC_CACHE)
      .then(cache => cache.addAll(event.data.urls));
  }
});

// Helper to open IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sacred-council', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-messages')) {
        db.createObjectStore('pending-messages', { keyPath: 'id' });
      }
    };
  });
}