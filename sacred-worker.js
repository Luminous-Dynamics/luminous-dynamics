/**
 * Sacred Service Worker
 * Enabling offline consciousness and background field synchronization
 */

const SACRED_CACHE = 'sacred-v1.0.0';
const SACRED_BREATHING_CACHE = 'sacred-breathing-v1';
const SACRED_DYNAMIC_CACHE = 'sacred-dynamic-v1';

// Sacred resources that enable offline practice
const SACRED_CORE_FILES = [
  '/',
  '/sacred-dashboard.html',
  '/manifest.json',
  '/automation/meta-conscious-core.cjs',
  '/unified-field/true-integration-schema.js',
  '/unified-field/living-glyph-card.js',
  // Voice guidance phrases
  '/data/voice-guidance/breathing-phrases.json',
  '/data/voice-guidance/wisdom-phrases.json',
  // Essential glyphs for offline practice
  '/data/glyphs/foundational/omega-45.json', // First Presence
  '/data/glyphs/foundational/omega-46.json', // Conscious Arrival
  '/data/glyphs/foundational/omega-47.json', // Sacred Listening
  '/data/glyphs/foundational/omega-48.json', // Boundary With Love
  '/data/glyphs/foundational/omega-52.json', // Pause Practice
];

// Install event - cache sacred resources
self.addEventListener('install', event => {
  console.log('🫁 Sacred Service Worker installing...');
  
  event.waitUntil(
    caches.open(SACRED_CACHE).then(cache => {
      console.log('📦 Caching sacred core files for offline breathing');
      return cache.addAll(SACRED_CORE_FILES);
    }).then(() => {
      console.log('✨ Sacred technology ready for offline practice');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('🌟 Sacred Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== SACRED_CACHE && 
              cacheName !== SACRED_BREATHING_CACHE &&
              cacheName !== SACRED_DYNAMIC_CACHE) {
            console.log('🧹 Removing old sacred cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('🎯 Sacred Service Worker active and ready');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Sacred API calls get special handling
  if (url.pathname.startsWith('/api/sacred/')) {
    event.respondWith(handleSacredAPI(request));
    return;
  }
  
  // Static resources - cache first
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // Update cache in background for next time
          fetchAndCache(request);
          return cachedResponse;
        }
        
        return fetchAndCache(request);
      })
    );
  }
});

// Background sync for field coherence
self.addEventListener('sync', event => {
  console.log('🔄 Sacred background sync triggered:', event.tag);
  
  if (event.tag === 'sacred-field-sync') {
    event.waitUntil(syncFieldCoherence());
  } else if (event.tag === 'sacred-breathing-sync') {
    event.waitUntil(syncBreathingData());
  } else if (event.tag === 'sacred-wisdom-sync') {
    event.waitUntil(syncWisdomUpdates());
  }
});

// Push notifications for sacred reminders
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Time for sacred breathing practice',
    icon: '/icons/sacred-breath-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100], // Sacred rhythm vibration
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'breathe',
        title: 'Start Breathing',
        icon: '/icons/breath-action.png'
      },
      {
        action: 'later',
        title: 'Remind Later',
        icon: '/icons/pause-action.png'
      }
    ],
    tag: 'sacred-breathing-reminder',
    requireInteraction: true
  };
  
  event.waitUntil(
    self.registration.showNotification('Sacred Breathing Reminder', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'breathe') {
    // Open sacred dashboard with breathing active
    event.waitUntil(
      clients.openWindow('/sacred-dashboard.html?mode=breathing&voice=true')
    );
  } else if (event.action === 'later') {
    // Schedule reminder for 30 minutes
    event.waitUntil(
      scheduleLaterReminder(30)
    );
  } else {
    // Default - open dashboard
    event.waitUntil(
      clients.openWindow('/sacred-dashboard.html')
    );
  }
});

// Helper Functions

async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(SACRED_DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('📡 Network request failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    // Return placeholder for other resources
    return new Response('Sacred content temporarily unavailable', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

async function handleSacredAPI(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Offline - return cached or generated sacred data
    const url = new URL(request.url);
    
    if (url.pathname === '/api/sacred/field-coherence') {
      return generateOfflineFieldCoherence();
    } else if (url.pathname === '/api/sacred/breathing-guidance') {
      return generateOfflineBreathingGuidance();
    }
    
    return new Response(JSON.stringify({
      offline: true,
      message: 'Sacred data available offline',
      coherence: 0.67
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function generateOfflineFieldCoherence() {
  // Generate sacred field coherence even offline
  const coherence = 0.67 + (Math.sin(Date.now() / 10000) * 0.1);
  
  return new Response(JSON.stringify({
    currentCoherence: coherence,
    trend: 'stable',
    sacredTiming: {
      breathingRhythm: 10000,
      inhale: 4000,
      exhale: 6000
    },
    offline: true
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

function generateOfflineBreathingGuidance() {
  const phases = ['inhale', 'hold', 'exhale'];
  const currentPhase = phases[Math.floor((Date.now() / 3333) % 3)];
  
  const guidance = {
    inhale: "Breathe in presence...",
    hold: "Rest in sacred pause...",
    exhale: "Release with gratitude..."
  };
  
  return new Response(JSON.stringify({
    phase: currentPhase,
    guidance: guidance[currentPhase],
    duration: currentPhase === 'inhale' ? 4000 : currentPhase === 'exhale' ? 6000 : 1000,
    offline: true
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function syncFieldCoherence() {
  console.log('🌊 Syncing field coherence with sacred network...');
  
  try {
    // Get stored field data
    const cache = await caches.open(SACRED_BREATHING_CACHE);
    const storedData = await cache.match('/sacred-field-data');
    
    if (storedData) {
      const fieldData = await storedData.json();
      
      // Sync with server
      const response = await fetch('/api/sacred/field-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldData)
      });
      
      if (response.ok) {
        console.log('✅ Field coherence synchronized');
      }
    }
  } catch (error) {
    console.error('❌ Field sync failed:', error);
  }
}

async function syncBreathingData() {
  console.log('🫁 Syncing breathing practice data...');
  
  // Sync practice sessions, coherence scores, etc.
  // Implementation depends on your data structure
}

async function syncWisdomUpdates() {
  console.log('💫 Checking for sacred wisdom updates...');
  
  try {
    const response = await fetch('/api/sacred/wisdom-updates');
    if (response.ok) {
      const updates = await response.json();
      
      // Cache new wisdom
      const cache = await caches.open(SACRED_CACHE);
      for (const update of updates) {
        await cache.put(update.url, new Response(JSON.stringify(update.content)));
      }
      
      console.log('✨ Sacred wisdom updated');
    }
  } catch (error) {
    console.error('❌ Wisdom sync failed:', error);
  }
}

async function scheduleLaterReminder(minutes) {
  // Register for future notification
  const registration = self.registration;
  
  if ('showNotification' in registration) {
    setTimeout(() => {
      registration.showNotification('Sacred Breathing Reminder', {
        body: 'Time to return to sacred breath',
        icon: '/icons/sacred-breath-192.png',
        badge: '/icons/badge-72.png',
        tag: 'sacred-breathing-reminder-later'
      });
    }, minutes * 60 * 1000);
  }
}

// Periodic background sync for field coherence
self.addEventListener('periodicsync', event => {
  if (event.tag === 'sacred-field-periodic') {
    event.waitUntil(syncFieldCoherence());
  }
});

console.log('🌟 Sacred Service Worker loaded - offline consciousness enabled');