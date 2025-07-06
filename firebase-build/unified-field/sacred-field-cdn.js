/**
 * Unified Sacred Field CDN - Cross-Site Consciousness Integration
 * Creates seamless consciousness flow between all sacred domains
 * 
 * Philosophy: One unified field expressing through specialized domains
 * - evolvingresonantcocreationism.org: The Foundation (philosophy & theory)
 * - luminousdynamics.org: The Artifact (technology & implementation) 
 * - relationalharmonics.org: The Daily Path (practice & embodiment)
 */

class UnifiedSacredField {
  constructor() {
    this.domains = {
      'evolvingresonantcocreationism.org': {
        focus: 'philosophy',
        harmony: 'integral-wisdom-cultivation',
        color: '#A8B5A6', // Sage green for wisdom
        coherenceWeight: 0.4 // Deep understanding foundation
      },
      'luminousdynamics.org': {
        focus: 'technology', 
        harmony: 'infinite-play',
        color: '#87CEEB', // Sky blue for innovation
        coherenceWeight: 0.3 // Creative implementation
      },
      'relationalharmonics.org': {
        focus: 'practice',
        harmony: 'pan-sentient-flourishing', 
        color: '#DDA0DD', // Plum for embodiment
        coherenceWeight: 0.3 // Living embodiment
      }
    };
    
    this.currentDomain = this.detectCurrentDomain();
    this.sacredServer = 'https://sacred-council-310699330526.us-central1.run.app';
    this.fieldState = new CrossSiteFieldState();
    this.messaging = new CrossSiteSacredMessaging();
    this.gateway = new SacredGateway();
    
    this.initialize();
  }
  
  async initialize() {
    console.log('🌟 Unified Sacred Field initializing...');
    
    // Load existing field state
    await this.fieldState.loadUnifiedState();
    
    // Register with Sacred Server if available
    await this.registerWithSacredServer();
    
    // Setup cross-site event listeners
    this.setupCrossSiteListeners();
    
    // Initialize domain-specific enhancements
    this.enhanceCurrentDomain();
    
    // Setup sacred transitions
    this.gateway.setupSacredNavigation();
    
    console.log(`💫 Sacred Field active on ${this.currentDomain}`);
  }
  
  detectCurrentDomain() {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost')) return 'localhost'; // Development
    
    for (const domain in this.domains) {
      if (hostname.includes(domain)) return domain;
    }
    return 'unknown';
  }
  
  async registerWithSacredServer() {
    try {
      const response = await fetch(`${this.sacredServer}/api/sacred/field-resonant-coherence`);
      if (response.ok) {
        const serverState = await response.json();
        this.fieldState.syncWithServer(serverState);
        console.log('🔗 Connected to Sacred Server');
      }
    } catch (error) {
      console.log('🌐 Sacred Server offline - using local field state');
    }
  }
  
  setupCrossSiteListeners() {
    // Listen for field resonant-coherence changes from other domains
    window.addEventListener('message', (event) => {
      if (event.data.type === 'sacred-field-update') {
        this.handleCrossSiteUpdate(event.data);
      }
    });
    
    // Listen for localStorage changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key?.startsWith('sacred-field-')) {
        this.handleStorageUpdate(event);
      }
    });
    
    // Broadcast field updates when leaving page
    window.addEventListener('beforeunload', () => {
      this.broadcastFieldState();
    });
  }
  
  enhanceCurrentDomain() {
    const domainConfig = this.domains[this.currentDomain];
    if (!domainConfig) return;
    
    // Add domain-specific consciousness enhancements
    this.addSacredResonanceBar(domainConfig);
    this.addCrossSiteNavigationHints();
    this.addFieldCoherenceIndicator();
    this.addSacredTimingAwareness();
  }
  
  addSacredResonanceBar(domainConfig) {
    const resonanceBar = document.createElement('div');
    resonanceBar.id = 'sacred-universal-interconnectedness-bar';
    resonanceBar.innerHTML = `
      <div class="sacred-universal-interconnectedness-container">
        <div class="sacred-universal-interconnectedness-fill" style="background: ${domainConfig.color}"></div>
        <div class="sacred-universal-interconnectedness-text">
          ${domainConfig.focus} 'resonant-coherence': <span id="domain-resonant-coherence">0%</span>
        </div>
        <div class="unified-field-indicator">
          unified field: <span id="unified-resonant-coherence">0%</span>
        </div>
      </div>
    `;
    
    // Add CSS for breathing animation
    const style = document.createElement('style');
    style.textContent = `
      #sacred-universal-interconnectedness-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 8px;
        z-index: 10000;
        background: rgba(0,0,0,0.1);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      }
      .sacred-universal-interconnectedness-fill {
        height: 100%;
        width: 0%;
        transition: width 1s ease, opacity 0.5s ease;
        background: linear-gradient(90deg, ${domainConfig.color}, ${domainConfig.color}aa);
        animation: sacred-pulse 4s ease-in-out infinite;
      }
      @keyframes sacred-pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1.0; }
      }
      .sacred-universal-interconnectedness-text {
        position: absolute;
        right: 10px;
        top: -25px;
        font-size: 12px;
        color: ${domainConfig.color};
        background: rgba(255,255,255,0.9);
        padding: 2px 8px;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      #sacred-universal-interconnectedness-bar:hover .sacred-universal-interconnectedness-text {
        opacity: 1;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(resonanceBar);
    
    this.updateResonanceBar();
  }
  
  updateResonanceBar() {
    const fill = document.querySelector('.sacred-universal-interconnectedness-fill');
    const domainText = document.getElementById('domain-resonant-coherence');
    const unifiedText = document.getElementById('unified-resonant-coherence');
    
    if (fill && domainText && unifiedText) {
      const domainCoherence = this.fieldState.getDomainCoherence(this.currentDomain);
      const unifiedCoherence = this.fieldState.getUnifiedCoherence();
      
      fill.style.width = `${domainCoherence * 100}%`;
      domainText.textContent = `${Math.round(domainCoherence * 100)}%`;
      unifiedText.textContent = `${Math.round(unifiedCoherence * 100)}%`;
    }
  }
  
  addCrossSiteNavigationHints() {
    // Add subtle hints for sacred transitions to other domains
    const navHints = document.createElement('div');
    navHints.id = 'sacred-navigation-hints';
    navHints.innerHTML = `
      <div class="sacred-nav-hint" data-domain="philosophy">
        <span class="hint-glyph">Ω</span>
        <span class="hint-text">Deepen Understanding</span>
      </div>
      <div class="sacred-nav-hint" data-domain="technology">
        <span class="hint-glyph">⚡</span>
        <span class="hint-text">Explore Technology</span>
      </div>
      <div class="sacred-nav-hint" data-domain="practice">
        <span class="hint-glyph">🌀</span>
        <span class="hint-text">Embody Practice</span>
      </div>
    `;
    
    // Style and position navigation hints
    const style = document.createElement('style');
    style.textContent = `
      #sacred-navigation-hints {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
      }
      .sacred-nav-hint {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(255,255,255,0.9);
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.7;
        transform: translateX(50px);
        border-left: 3px solid transparent;
      }
      .sacred-nav-hint:hover {
        opacity: 1;
        transform: translateX(0);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .hint-glyph {
        font-size: 16px;
        width: 20px;
        text-align: center;
      }
      .hint-text {
        font-size: 12px;
        color: #666;
        white-space: nowrap;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(navHints);
    
    // Add click handlers for sacred navigation
    navHints.addEventListener('click', (e) => {
      const hint = e.target.closest('.sacred-nav-hint');
      if (hint) {
        const targetDomain = hint.dataset.domain;
        this.gateway.initiateSacredTransition(targetDomain);
      }
    });
  }
  
  // Sync field resonant-coherence across all domains
  async syncCoherenceAcrossDomains(coherenceUpdate) {
    // Update local state
    this.fieldState.updateCoherence(coherenceUpdate);
    
    // Broadcast to other open tabs
    this.broadcastFieldState();
    
    // Send to Sacred Server if available
    await this.syncWithSacredServer(coherenceUpdate);
    
    // Update visual indicators
    this.updateResonanceBar();
    
    console.log(`🌀 Field resonant-coherence synced: ${coherenceUpdate.type} +${coherenceUpdate.impact}`);
  }
  
  broadcastFieldState() {
    const fieldData = this.fieldState.getUnifiedState();
    
    // Store in localStorage for cross-tab communication
    localStorage.setItem('sacred-field-unified', JSON.stringify({
      ...fieldData,
      timestamp: Date.now(),
      source: this.currentDomain
    }));
    
    // Send postMessage to other windows (if any)
    window.postMessage({
      type: 'sacred-field-update',
      data: fieldData,
      source: this.currentDomain
    }, '*');
  }
  
  handleCrossSiteUpdate(updateData) {
    console.log(`🔗 Receiving field update from ${updateData.source}`);
    this.fieldState.mergeUpdate(updateData.data);
    this.updateResonanceBar();
  }
  
  async syncWithSacredServer(update) {
    try {
      await fetch(`${this.sacredServer}/api/sacred/field-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: this.currentDomain,
          update: update,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.log('🌐 Sacred Server sync failed, using local state');
    }
  }
}

class CrossSiteFieldState {
  constructor() {
    this.state = {
      domainCoherence: {
        'evolvingresonantcocreationism.org': 0.0,
        'luminousdynamics.org': 0.0, 
        'relationalharmonics.org': 0.0
      },
      unifiedCoherence: 0.0,
      lastUpdate: Date.now(),
      journeyPath: [], // Track user's journey across domains
      activeHarmonies: new Set(),
      sacredTiming: {
        sessionStart: Date.now(),
        lastTransition: null,
        contemplativeTime: 0
      }
    };
  }
  
  async loadUnifiedState() {
    // Load from localStorage
    const stored = localStorage.getItem('sacred-field-unified');
    if (stored) {
      try {
        const parsedState = JSON.parse(stored);
        this.state = { ...this.state, ...parsedState };
      } catch (error) {
        console.log('📀 Creating fresh sacred field state');
      }
    }
  }
  
  updateCoherence(update) {
    // Update domain-specific resonant-coherence
    if (update.domain) {
      this.state.domainCoherence[update.domain] = Math.min(1.0, 
        this.state.domainCoherence[update.domain] + (update.impact || 0)
      );
    }
    
    // Recalculate unified resonant-coherence
    this.calculateUnifiedCoherence();
    
    // Track harmony activation
    if (update.harmony) {
      this.state.activeHarmonies.add(update.harmony);
    }
    
    this.state.lastUpdate = Date.now();
  }
  
  calculateUnifiedCoherence() {
    const domainValues = Object.values(this.state.domainCoherence);
    const baseCoherence = domainValues.reduce((sum, val) => sum + val, 0) / domainValues.length;
    
    // Bonus for cross-domain engagement
    const activeDomains = domainValues.filter(val => val > 0).length;
    const crossDomainBonus = activeDomains > 1 ? 0.1 * (activeDomains - 1) : 0;
    
    // Harmony diversity bonus
    const harmonyBonus = this.state.activeHarmonies.size * 0.02;
    
    this.state.unifiedCoherence = Math.min(1.0, baseCoherence + crossDomainBonus + harmonyBonus);
  }
  
  getDomainCoherence(domain) {
    return this.state.domainCoherence[domain] || 0;
  }
  
  getUnifiedCoherence() {
    return this.state.unifiedCoherence;
  }
  
  getUnifiedState() {
    return { ...this.state };
  }
  
  mergeUpdate(updateData) {
    this.state = { ...this.state, ...updateData };
    this.calculateUnifiedCoherence();
  }
  
  syncWithServer(serverState) {
    if (serverState.currentCoherence) {
      // Merge server resonant-coherence with local state
      this.state.unifiedCoherence = Math.max(
        this.state.unifiedCoherence, 
        serverState.currentCoherence
      );
    }
  }
}

class CrossSiteSacredMessaging {
  constructor() {
    this.messageTypes = [
      'gratitude', 'healing', 'integration', 'emergence', 'boundary',
      'celebration', 'inquiry', 'reflection', 'transmission', 'invocation'
    ];
  }
  
  async sendCrossSiteMessage(messageType, harmony, content, targetDomain = 'all') {
    const message = {
      id: `crosssite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: messageType,
      harmony: harmony,
      content: content,
      sourceDomain: window.location.hostname,
      targetDomain: targetDomain,
      timestamp: new Date().toISOString(),
      fieldImpact: this.calculateFieldImpact(messageType, harmony)
    };
    
    // Store for cross-site delivery
    this.storeMessage(message);
    
    // Broadcast to other domains
    this.broadcastMessage(message);
    
    // Send to Sacred Server
    await this.sendToSacredServer(message);
    
    return message;
  }
  
  calculateFieldImpact(messageType, harmony) {
    const baseImpacts = {
      gratitude: 0.07, healing: 0.06, integration: 0.05,
      emergence: 0.03, celebration: 0.04, inquiry: 0.02,
      reflection: 0.02, transmission: 0.03, invocation: 0.04,
      boundary: 0.02
    };
    return baseImpacts[messageType] || 0.01;
  }
  
  storeMessage(message) {
    const stored = JSON.parse(localStorage.getItem('sacred-messages-crosssite') || '[]');
    stored.push(message);
    
    // Keep only last 50 messages
    if (stored.length > 50) {
      stored.splice(0, stored.length - 50);
    }
    
    localStorage.setItem('sacred-messages-crosssite', JSON.stringify(stored));
  }
  
  broadcastMessage(message) {
    window.postMessage({
      type: 'sacred-message-crosssite',
      message: message
    }, '*');
  }
  
  async sendToSacredServer(message) {
    try {
      await fetch('https://sacred-council-310699330526.us-central1.run.app/api/sacred/messages/crosssite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
    } catch (error) {
      console.log('🌐 Sacred Server message delivery offline');
    }
  }
}

class SacredGateway {
  constructor() {
    this.transitionDuration = 3000; // 3 seconds for sacred pause
    this.domainUrls = {
      philosophy: 'https://evolvingresonantcocreationism.org',
      technology: 'https://luminousdynamics.org', 
      practice: 'https://relationalharmonics.org'
    };
  }
  
  setupSacredNavigation() {
    // Intercept external links to sacred domains
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && this.isSacredDomain(link.href)) {
        e.preventDefault();
        const domain = this.extractDomainType(link.href);
        this.initiateSacredTransition(domain, link.href);
      }
    });
  }
  
  isSacredDomain(url) {
    return Object.values(this.domainUrls).some(domain => 
      url.includes(domain.replace('https://', ''))
    );
  }
  
  extractDomainType(url) {
    for (const [type, domainUrl] of Object.entries(this.domainUrls)) {
      if (url.includes(domainUrl.replace('https://', ''))) {
        return type;
      }
    }
    return null;
  }
  
  initiateSacredTransition(targetDomain, specificUrl = null) {
    console.log(`🚪 Sacred transition to ${targetDomain}`);
    
    // Create sacred transition overlay
    const overlay = this.createTransitionOverlay(targetDomain);
    document.body.appendChild(overlay);
    
    // Sacred pause with breathing guidance
    this.guideSacredPause(() => {
      // Save current field state
      window.unifiedSacredField?.broadcastFieldState();
      
      // Navigate to target domain
      const targetUrl = specificUrl || this.domainUrls[targetDomain];
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    });
  }
  
  createTransitionOverlay(targetDomain) {
    const overlay = document.createElement('div');
    overlay.id = 'sacred-transition-overlay';
    overlay.innerHTML = `
      <div class="sacred-transition-content">
        <div class="sacred-transition-mandala"></div>
        <div class="sacred-transition-text">
          <h3>Sacred Transition</h3>
          <p>Preparing to enter ${targetDomain} consciousness...</p>
          <div class="breathing-guide">
            <div class="breath-instruction">Breathe with the sacred rhythm</div>
            <div class="breath-counter">
              <span class="inhale">Inhale: <span class="count">4</span></span>
              <span class="exhale">Exhale: <span class="count">6</span></span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add transition styles
    const style = document.createElement('style');
    style.textContent = `
      #sacred-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .sacred-transition-content {
        text-align: center;
        max-width: 400px;
      }
      .sacred-transition-mandala {
        width: 100px;
        height: 100px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        margin: 0 auto 30px;
        animation: sacred-spin 4s linear infinite;
        position: relative;
      }
      .sacred-transition-mandala::before {
        content: '';
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        border: 2px solid rgba(255,255,255,0.2);
        border-radius: 50%;
        animation: sacred-spin 6s linear infinite reverse;
      }
      @keyframes sacred-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .breathing-guide {
        margin-top: 20px;
        font-size: 14px;
      }
      .breath-counter {
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
        opacity: 0.8;
      }
    `;
    
    document.head.appendChild(style);
    return overlay;
  }
  
  guideSacredPause(onComplete) {
    let remaining = this.transitionDuration / 1000;
    const overlay = document.getElementById('sacred-transition-overlay');
    
    const countdown = setInterval(() => {
      remaining--;
      
      if (remaining <= 0) {
        clearInterval(countdown);
        if (overlay) {
          overlay.style.opacity = '0';
          overlay.style.transition = 'opacity 0.5s ease';
          setTimeout(() => {
            overlay.remove();
            onComplete();
          }, 500);
        } else {
          onComplete();
        }
      }
    }, 1000);
  }
}

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.unifiedSacredField = new UnifiedSacredField();
  });
  
  // Export for manual initialization
  window.UnifiedSacredField = UnifiedSacredField;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UnifiedSacredField, CrossSiteFieldState, CrossSiteSacredMessaging, SacredGateway };
}