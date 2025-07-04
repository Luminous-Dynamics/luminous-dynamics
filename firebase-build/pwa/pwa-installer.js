/**
 * PWA Installer - Handles PWA installation and updates
 */

class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.installButton = null;
    this.updateBanner = null;
    
    this.init();
  }

  init() {
    // Check if already installed
    this.checkInstallState();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallUI();
    });
    
    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      console.log('🎉 Sacred Council Hub installed!');
      this.hideInstallUI();
      this.isInstalled = true;
      this.showSuccessMessage();
    });
  }

  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/pwa/service-worker.js');
      console.log('✅ Service Worker registered:', registration.scope);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.showUpdateBanner(newWorker);
          }
        });
      });
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Every hour
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }

  checkInstallState() {
    // Check if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('📱 Running as installed PWA');
    }
    
    // Check iOS
    if (window.navigator.standalone) {
      this.isInstalled = true;
      console.log('📱 Running as iOS PWA');
    }
  }

  showInstallUI() {
    // Create install button if it doesn't exist
    if (!this.installButton) {
      this.installButton = this.createInstallButton();
    }
    
    // Show with animation
    requestAnimationFrame(() => {
      this.installButton.classList.add('show');
    });
  }

  hideInstallUI() {
    if (this.installButton) {
      this.installButton.classList.remove('show');
      setTimeout(() => {
        this.installButton.remove();
        this.installButton = null;
      }, 300);
    }
  }

  createInstallButton() {
    const button = document.createElement('div');
    button.className = 'pwa-install-prompt';
    button.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">🌟</div>
        <div class="pwa-install-text">
          <div class="pwa-install-title">Install Sacred Council Hub</div>
          <div class="pwa-install-subtitle">Access sacred wisdom offline</div>
        </div>
        <button class="pwa-install-btn" onclick="pwaInstaller.install()">Install</button>
        <button class="pwa-install-dismiss" onclick="pwaInstaller.dismiss()">✕</button>
      </div>
    `;
    
    document.body.appendChild(button);
    return button;
  }

  async install() {
    if (!this.deferredPrompt) return;
    
    // Show the install prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user to respond
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log(`Install prompt outcome: ${outcome}`);
    
    // Clear the deferredPrompt
    this.deferredPrompt = null;
    this.hideInstallUI();
  }

  dismiss() {
    this.hideInstallUI();
    
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now());
  }

  showUpdateBanner(worker) {
    if (this.updateBanner) return;
    
    this.updateBanner = document.createElement('div');
    this.updateBanner.className = 'pwa-update-banner';
    this.updateBanner.innerHTML = `
      <div class="pwa-update-content">
        <span>✨ New version available!</span>
        <button onclick="pwaInstaller.applyUpdate('${worker}')">Update</button>
      </div>
    `;
    
    document.body.appendChild(this.updateBanner);
    
    requestAnimationFrame(() => {
      this.updateBanner.classList.add('show');
    });
  }

  applyUpdate(worker) {
    worker.postMessage({ type: 'SKIP_WAITING' });
    
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'pwa-success-message';
    message.innerHTML = `
      <div class="pwa-success-content">
        <div class="pwa-success-icon">✨</div>
        <div class="pwa-success-text">Sacred Council Hub installed successfully!</div>
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }

  // Utility methods
  async checkOnlineStatus() {
    if (!navigator.onLine) {
      this.showOfflineIndicator();
    }
    
    window.addEventListener('online', () => this.hideOfflineIndicator());
    window.addEventListener('offline', () => this.showOfflineIndicator());
  }

  showOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator') || 
                     this.createOfflineIndicator();
    indicator.classList.add('show');
  }

  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.classList.remove('show');
    }
  }

  createOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'offline-indicator';
    indicator.innerHTML = '🔗 Offline - Sacred wisdom cached locally';
    document.body.appendChild(indicator);
    return indicator;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pwaInstaller = new PWAInstaller();
  });
} else {
  window.pwaInstaller = new PWAInstaller();
}