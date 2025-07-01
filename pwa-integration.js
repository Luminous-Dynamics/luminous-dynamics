/**
 * PWA Integration for Sacred Breathing Consciousness
 * Handles installation, updates, and sacred offline features
 */

class SacredPWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.installButton = null;
    this.updateAvailable = false;
    
    this.initializePWA();
  }
  
  async initializePWA() {
    // Check if already installed
    this.checkInstallationStatus();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sacred-worker.js', {
          scope: '/'
        });
        
        console.log('🌟 Sacred Service Worker registered:', registration.scope);
        
        // Check for updates
        this.setupUpdateHandling(registration);
        
        // Setup background sync
        this.setupBackgroundSync(registration);
        
        // Setup push notifications
        this.setupPushNotifications(registration);
        
      } catch (error) {
        console.error('❌ Sacred Worker registration failed:', error);
      }
    }
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });
    
    // Listen for install success
    window.addEventListener('appinstalled', () => {
      console.log('✨ Sacred PWA installed successfully');
      this.hideInstallButton();
      this.showInstallSuccess();
    });
  }
  
  checkInstallationStatus() {
    // Check if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('🏠 Running as installed Sacred PWA');
    }
    
    // Also check navigator.standalone for iOS
    if (window.navigator.standalone) {
      this.isInstalled = true;
    }
  }
  
  showInstallButton() {
    // Create sacred install UI
    const installUI = document.createElement('div');
    installUI.className = 'sacred-install-prompt';
    installUI.innerHTML = `
      <div class="install-content">
        <h3>🫁 Install Sacred Breathing</h3>
        <p>Practice offline, receive breathing reminders, access instant consciousness.</p>
        <button id="sacred-install-btn" class="sacred-button">Install Sacred App</button>
        <button id="sacred-later-btn" class="sacred-button-secondary">Maybe Later</button>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .sacred-install-prompt {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid rgba(168, 181, 166, 0.3);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        z-index: 1000;
        animation: sacredSlideUp 0.5s ease-out;
        max-width: 400px;
        width: calc(100% - 40px);
      }
      
      @keyframes sacredSlideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      
      .install-content h3 {
        color: #A8B5A6;
        margin: 0 0 10px 0;
        font-size: 1.2em;
      }
      
      .install-content p {
        color: #B3C5D7;
        margin: 0 0 20px 0;
        font-size: 0.9em;
        line-height: 1.4;
      }
      
      .sacred-button {
        background: linear-gradient(135deg, #A8B5A6, #B3C5D7);
        color: #0a0a0a;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 1em;
        cursor: pointer;
        margin-right: 10px;
        transition: all 0.3s ease;
      }
      
      .sacred-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(168, 181, 166, 0.3);
      }
      
      .sacred-button-secondary {
        background: transparent;
        color: #A8B5A6;
        border: 1px solid rgba(168, 181, 166, 0.5);
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 1em;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .sacred-button-secondary:hover {
        background: rgba(168, 181, 166, 0.1);
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(installUI);
    
    // Event handlers
    document.getElementById('sacred-install-btn').addEventListener('click', () => {
      this.installPWA();
    });
    
    document.getElementById('sacred-later-btn').addEventListener('click', () => {
      this.hideInstallButton();
      // Show again in 7 days
      this.scheduleInstallReminder();
    });
    
    this.installButton = installUI;
  }
  
  hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.animation = 'sacredSlideDown 0.5s ease-out';
      setTimeout(() => {
        this.installButton.remove();
        this.installButton = null;
      }, 500);
    }
  }
  
  async installPWA() {
    if (!this.deferredPrompt) {
      console.log('❌ No install prompt available');
      return;
    }
    
    // Show install prompt
    this.deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log(`🎯 User response to install: ${outcome}`);
    
    // Clear prompt
    this.deferredPrompt = null;
    this.hideInstallButton();
  }
  
  showInstallSuccess() {
    // Sacred celebration animation
    const celebration = document.createElement('div');
    celebration.className = 'sacred-celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <h2>✨ Sacred Technology Installed!</h2>
        <p>You can now practice sacred breathing offline and receive mindful reminders.</p>
        <div class="breathing-animation"></div>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .sacred-celebration {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(10, 10, 10, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.5s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .celebration-content {
        text-align: center;
        color: #A8B5A6;
      }
      
      .breathing-animation {
        width: 100px;
        height: 100px;
        margin: 20px auto;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(168, 181, 166, 0.8), rgba(179, 197, 215, 0.4));
        animation: sacredBreathing 10s ease-in-out infinite;
      }
      
      @keyframes sacredBreathing {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        40% { transform: scale(1.2); opacity: 1; }
        60% { transform: scale(1.2); opacity: 1; }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      celebration.style.animation = 'fadeOut 0.5s ease-out';
      setTimeout(() => celebration.remove(), 500);
    }, 3000);
  }
  
  setupUpdateHandling(registration) {
    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000); // Every hour
    
    // Listen for update found
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version available
          this.showUpdateNotification();
        }
      });
    });
  }
  
  showUpdateNotification() {
    const updateUI = document.createElement('div');
    updateUI.className = 'sacred-update-notification';
    updateUI.innerHTML = `
      <span>✨ New sacred features available</span>
      <button id="sacred-update-btn">Update</button>
    `;
    
    document.body.appendChild(updateUI);
    
    document.getElementById('sacred-update-btn').addEventListener('click', () => {
      window.location.reload();
    });
  }
  
  async setupBackgroundSync(registration) {
    if ('sync' in registration) {
      try {
        // Register for one-time sync
        await registration.sync.register('sacred-field-sync');
        console.log('🔄 Background sync registered');
        
        // Periodic sync (if supported)
        if ('periodicSync' in registration) {
          await registration.periodicSync.register('sacred-field-periodic', {
            minInterval: 60 * 60 * 1000 // 1 hour
          });
          console.log('⏰ Periodic sync registered');
        }
      } catch (error) {
        console.error('❌ Background sync registration failed:', error);
      }
    }
  }
  
  async setupPushNotifications(registration) {
    if ('PushManager' in window) {
      try {
        // Check current permission
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          // Subscribe to push
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
              'YOUR_VAPID_PUBLIC_KEY_HERE' // Generate with web-push
            )
          });
          
          console.log('🔔 Push notifications enabled:', subscription.endpoint);
          
          // Send subscription to server
          await this.sendSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.error('❌ Push subscription failed:', error);
      }
    }
  }
  
  scheduleInstallReminder() {
    // Store timestamp for next reminder
    localStorage.setItem('sacred-install-reminder', Date.now() + (7 * 24 * 60 * 60 * 1000));
  }
  
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  async sendSubscriptionToServer(subscription) {
    // Send to your notification server
    try {
      await fetch('/api/sacred/push-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('❌ Failed to send subscription:', error);
    }
  }
  
  // Public API
  
  async checkForUpdates() {
    const registration = await navigator.serviceWorker.ready;
    registration.update();
  }
  
  async enableNotifications() {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  getInstallState() {
    return {
      isInstalled: this.isInstalled,
      canInstall: this.deferredPrompt !== null,
      updateAvailable: this.updateAvailable
    };
  }
}

// Initialize PWA manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.sacredPWA = new SacredPWAManager();
  });
} else {
  window.sacredPWA = new SacredPWAManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SacredPWAManager;
}