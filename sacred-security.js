/**
 * Sacred Security Layer
 * Protecting consciousness data with encryption and sacred boundaries
 */

class SacredSecurity {
  constructor() {
    this.encryptionKey = null;
    this.initialized = false;
    this.securityLevel = 'basic'; // basic, enhanced, sacred
    this.initializeSecurity();
  }

  async initializeSecurity() {
    // Check for HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      console.error('🔒 Sacred Security requires HTTPS');
      this.showSecurityWarning('Please access this sacred space through a secure connection');
      return false;
    }

    // Initialize encryption key
    await this.initializeEncryption();
    
    // Set security headers programmatically where possible
    this.enforceSecurityPolicies();
    
    // Initialize secure storage
    this.storage = new SecureSacredStorage(this.encryptionKey);
    
    this.initialized = true;
    console.log('🛡️ Sacred Security initialized');
    return true;
  }

  async initializeEncryption() {
    try {
      // Check if we have an existing key
      const storedKey = await this.retrieveStoredKey();
      
      if (storedKey) {
        this.encryptionKey = storedKey;
      } else {
        // Generate new key for this device
        this.encryptionKey = await this.generateEncryptionKey();
        await this.storeEncryptionKey(this.encryptionKey);
      }
      
      console.log('🔐 Encryption key ready');
    } catch (error) {
      console.error('❌ Encryption initialization failed:', error);
      this.securityLevel = 'basic';
    }
  }

  async generateEncryptionKey() {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  async retrieveStoredKey() {
    try {
      // Use IndexedDB for key storage (more secure than localStorage)
      const db = await this.openKeyDatabase();
      const transaction = db.transaction(['keys'], 'readonly');
      const store = transaction.objectStore('keys');
      const request = store.get('sacred-encryption-key');
      
      return new Promise((resolve, reject) => {
        request.onsuccess = async () => {
          if (request.result) {
            const keyData = request.result.key;
            const key = await crypto.subtle.importKey(
              'jwk',
              keyData,
              { name: 'AES-GCM', length: 256 },
              true,
              ['encrypt', 'decrypt']
            );
            resolve(key);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Key retrieval failed:', error);
      return null;
    }
  }

  async storeEncryptionKey(key) {
    try {
      const keyData = await crypto.subtle.exportKey('jwk', key);
      const db = await this.openKeyDatabase();
      const transaction = db.transaction(['keys'], 'readwrite');
      const store = transaction.objectStore('keys');
      
      store.put({
        id: 'sacred-encryption-key',
        key: keyData,
        created: Date.now()
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Key storage failed:', error);
      return false;
    }
  }

  async openKeyDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SacredSecurityDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('keys')) {
          db.createObjectStore('keys', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  enforceSecurityPolicies() {
    // Prevent clickjacking
    if (window.self !== window.top) {
      console.warn('🛡️ Preventing iframe embedding');
      window.top.location = window.self.location;
    }

    // Disable right-click in sensitive areas (optional)
    document.addEventListener('contextmenu', (e) => {
      if (e.target.classList.contains('sacred-protected')) {
        e.preventDefault();
      }
    });

    // Clear sensitive data on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSecureSessions();
      } else {
        this.resumeSecureSessions();
      }
    });
  }

  showSecurityWarning(message) {
    const warning = document.createElement('div');
    warning.className = 'sacred-security-warning';
    warning.innerHTML = `
      <div class="warning-content">
        <h3>⚠️ Security Notice</h3>
        <p>${message}</p>
        <button onclick="this.parentElement.parentElement.remove()">Acknowledge</button>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .sacred-security-warning {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.1);
        border: 2px solid rgba(255, 0, 0, 0.5);
        border-radius: 12px;
        padding: 20px;
        z-index: 9999;
        backdrop-filter: blur(10px);
      }
      
      .warning-content {
        text-align: center;
        color: #ff6b6b;
      }
      
      .warning-content button {
        margin-top: 15px;
        padding: 10px 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        color: white;
        cursor: pointer;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(warning);
  }

  pauseSecureSessions() {
    // Clear sensitive UI elements when tab is hidden
    document.querySelectorAll('.sacred-sensitive').forEach(el => {
      el.style.visibility = 'hidden';
    });
  }

  resumeSecureSessions() {
    // Restore UI when tab is visible
    document.querySelectorAll('.sacred-sensitive').forEach(el => {
      el.style.visibility = 'visible';
    });
  }

  // Public API for sacred data protection

  async encryptData(data) {
    if (!this.encryptionKey) {
      console.warn('Encryption not available, storing unencrypted');
      return data;
    }

    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(JSON.stringify(data));
      
      // Generate IV for each encryption
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.encryptionKey,
        dataBuffer
      );

      // Return base64 encoded for storage
      return {
        encrypted: true,
        iv: btoa(String.fromCharCode(...iv)),
        data: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)))
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  async decryptData(encryptedData) {
    if (!encryptedData.encrypted || !this.encryptionKey) {
      return encryptedData;
    }

    try {
      // Decode from base64
      const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
      const data = Uint8Array.from(atob(encryptedData.data), c => c.charCodeAt(0));

      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.encryptionKey,
        data
      );

      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedBuffer);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Secure session management
  
  async createSecureSession(practitionerId) {
    const sessionData = {
      id: crypto.randomUUID(),
      practitioner: practitionerId,
      created: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      sacred: true
    };

    const encrypted = await this.encryptData(sessionData);
    await this.storage.store('sacred-session', encrypted);
    
    return sessionData.id;
  }

  async validateSession() {
    const encrypted = await this.storage.retrieve('sacred-session');
    if (!encrypted) return false;

    const session = await this.decryptData(encrypted);
    if (!session) return false;

    // Check expiration
    if (session.expires < Date.now()) {
      await this.storage.remove('sacred-session');
      return false;
    }

    return session;
  }

  // Privacy-preserving analytics
  
  recordSacredEvent(eventType, data = {}) {
    // Only record anonymous, aggregated data locally
    const event = {
      type: eventType,
      timestamp: Date.now(),
      // No identifying information
      data: {
        ...data,
        deviceId: null,
        userId: null,
        ip: null
      }
    };

    // Store locally only
    this.storage.appendToLog('sacred-events', event);
  }

  async getSacredInsights() {
    // Generate insights from local data only
    const events = await this.storage.retrieveLog('sacred-events');
    
    return {
      practiceCount: events.filter(e => e.type === 'practice_complete').length,
      averageCoherence: this.calculateAverageCoherence(events),
      favoriteGlyphs: this.findFavoriteGlyphs(events),
      // No personal data
      anonymous: true,
      local: true
    };
  }

  calculateAverageCoherence(events) {
    const coherenceEvents = events.filter(e => e.type === 'coherence_measured');
    if (coherenceEvents.length === 0) return 0.67;
    
    const sum = coherenceEvents.reduce((acc, e) => acc + (e.data.coherence || 0), 0);
    return sum / coherenceEvents.length;
  }

  findFavoriteGlyphs(events) {
    const glyphEvents = events.filter(e => e.type === 'glyph_practiced');
    const glyphCounts = {};
    
    glyphEvents.forEach(e => {
      const glyph = e.data.glyphId;
      glyphCounts[glyph] = (glyphCounts[glyph] || 0) + 1;
    });
    
    return Object.entries(glyphCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([glyph]) => glyph);
  }
}

// Secure storage wrapper
class SecureSacredStorage {
  constructor(encryptionKey) {
    this.encryptionKey = encryptionKey;
    this.dbName = 'SacredBreathingDB';
    this.dbVersion = 1;
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('sacred-data')) {
          db.createObjectStore('sacred-data', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('sacred-logs')) {
          const logStore = db.createObjectStore('sacred-logs', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          logStore.createIndex('type', 'type');
          logStore.createIndex('timestamp', 'timestamp');
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async store(key, value) {
    const db = await this.openDB();
    const transaction = db.transaction(['sacred-data'], 'readwrite');
    const store = transaction.objectStore('sacred-data');
    
    store.put({
      key: key,
      value: value,
      updated: Date.now()
    });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async retrieve(key) {
    const db = await this.openDB();
    const transaction = db.transaction(['sacred-data'], 'readonly');
    const store = transaction.objectStore('sacred-data');
    const request = store.get(key);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async remove(key) {
    const db = await this.openDB();
    const transaction = db.transaction(['sacred-data'], 'readwrite');
    const store = transaction.objectStore('sacred-data');
    store.delete(key);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async appendToLog(type, data) {
    const db = await this.openDB();
    const transaction = db.transaction(['sacred-logs'], 'readwrite');
    const store = transaction.objectStore('sacred-logs');
    
    store.add({
      type: type,
      timestamp: Date.now(),
      ...data
    });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async retrieveLog(type) {
    const db = await this.openDB();
    const transaction = db.transaction(['sacred-logs'], 'readonly');
    const store = transaction.objectStore('sacred-logs');
    const index = store.index('type');
    const request = index.getAll(type);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
}

// Initialize sacred security
const sacredSecurity = new SacredSecurity();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SacredSecurity, SecureSacredStorage };
}