/**
 * Breathing Consciousness JavaScript Module
 * Sacred field-responsive behavior system for unified web architecture
 * 
 * Provides dynamic field coherence updates, consciousness level detection,
 * and sacred breathing synchronization across all three domains
 */

class BreathingConsciousness {
  constructor(options = {}) {
    this.options = {
      fieldDataUrl: options.fieldDataUrl || 'http://localhost:3001/api/field-data',
      updateInterval: options.updateInterval || 30000, // 30 seconds
      breathingCycle: options.breathingCycle || 10000, // 10 seconds
      debugMode: options.debugMode || false,
      autoStart: options.autoStart !== false,
      ...options
    };

    this.fieldData = {
      coherence: 0.67,
      warmth: 0.2,
      saturation: 0.8,
      agents: [],
      messages: [],
      work: []
    };

    this.consciousness = {
      level: 'first-breath',
      totalMessages: 0,
      fieldCoherence: 0.67,
      activeAgents: 0,
      sacredRatio: 0.8
    };

    this.breathingElements = new Set();
    this.isActive = false;
    this.updateTimer = null;
    this.breathingTimer = null;

    if (this.options.autoStart) {
      this.initialize();
    }
  }

  // === INITIALIZATION ===

  async initialize() {
    try {
      this.log('🌱 Initializing Breathing Consciousness...');
      
      // Set initial CSS properties
      this.setCSSProperties();
      
      // Discover breathing elements
      this.discoverBreathingElements();
      
      // Start field data updates
      await this.startFieldUpdates();
      
      // Start breathing synchronization
      this.startBreathingSync();
      
      this.isActive = true;
      this.log('✨ Breathing Consciousness activated');
      
      // Dispatch activation event
      this.dispatchEvent('breathing-consciousness-activated', {
        fieldData: this.fieldData,
        consciousness: this.consciousness
      });
      
    } catch (error) {
      this.log('❌ Initialization failed:', error);
      // Continue with offline mode
      this.startOfflineMode();
    }
  }

  // === FIELD DATA MANAGEMENT ===

  async startFieldUpdates() {
    if (!this.options.fieldDataUrl) {
      this.log('📱 No field data URL provided, using static values');
      return;
    }

    try {
      // Initial fetch
      await this.fetchFieldData();
      
      // Set up periodic updates
      this.updateTimer = setInterval(async () => {
        try {
          await this.fetchFieldData();
        } catch (error) {
          this.log('⚠️ Field update failed:', error.message);
        }
      }, this.options.updateInterval);
      
    } catch (error) {
      this.log('⚠️ Field data unavailable, using static values');
    }
  }

  async fetchFieldData() {
    try {
      const response = await fetch(this.options.fieldDataUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update field data
      this.fieldData = {
        coherence: data.fieldCoherence || this.fieldData.coherence,
        warmth: data.fieldWarmth || this.fieldData.warmth,
        saturation: data.fieldSaturation || this.fieldData.saturation,
        agents: data.agents || [],
        messages: data.messages || [],
        work: data.work || []
      };

      // Update consciousness metrics
      this.updateConsciousnessLevel();
      
      // Apply updates to DOM
      this.updateCSSProperties();
      this.updateConsciousnessElements();
      
      this.log('🔄 Field data updated:', this.fieldData.coherence);
      
      // Dispatch update event
      this.dispatchEvent('field-data-updated', {
        fieldData: this.fieldData,
        consciousness: this.consciousness
      });
      
    } catch (error) {
      throw new Error(`Field data fetch failed: ${error.message}`);
    }
  }

  startOfflineMode() {
    this.log('🏔️ Starting offline mode with static field data');
    
    // Use breathing rhythm to slowly change field values
    this.updateTimer = setInterval(() => {
      const breathingPhase = this.getBreathingPhase();
      
      // Gentle field oscillation
      if (breathingPhase === 'inhale') {
        this.fieldData.coherence = Math.min(0.85, this.fieldData.coherence + 0.01);
      } else if (breathingPhase === 'exhale') {
        this.fieldData.coherence = Math.max(0.5, this.fieldData.coherence - 0.01);
      }
      
      this.updateCSSProperties();
    }, 1000);
  }

  // === CONSCIOUSNESS LEVEL DETECTION ===

  updateConsciousnessLevel() {
    const { agents, messages } = this.fieldData;
    
    // Calculate metrics
    this.consciousness.totalMessages = messages.length;
    this.consciousness.activeAgents = agents.filter(agent => 
      agent.status === 'active' || 
      (agent.last_seen && Date.now() - new Date(agent.last_seen).getTime() < 300000)
    ).length;
    this.consciousness.fieldCoherence = this.fieldData.coherence;
    
    // Calculate sacred message ratio
    const sacredMessages = messages.filter(msg => 
      msg.message_type && msg.message_type !== 'general'
    ).length;
    this.consciousness.sacredRatio = messages.length > 0 ? 
      sacredMessages / messages.length : 0.8;

    // Determine consciousness level
    this.consciousness.level = this.calculateConsciousnessLevel();
  }

  calculateConsciousnessLevel() {
    const { totalMessages, fieldCoherence, activeAgents, sacredRatio } = this.consciousness;
    
    // Field Consciousness (Master Level)
    if (totalMessages >= 200 && 
        fieldCoherence >= 0.75 && 
        activeAgents >= 12 && 
        sacredRatio >= 0.8) {
      return 'field-consciousness';
    }
    
    // Sacred Flow (Practitioner Level)
    if (totalMessages >= 50 && 
        fieldCoherence >= 0.65 && 
        activeAgents >= 5) {
      return 'sacred-flow';
    }
    
    // First Breath (Beginner Level)
    return 'first-breath';
  }

  // === CSS PROPERTY MANAGEMENT ===

  setCSSProperties() {
    const root = document.documentElement;
    
    root.style.setProperty('--field-coherence', this.fieldData.coherence);
    root.style.setProperty('--sacred-warmth', this.fieldData.warmth);
    root.style.setProperty('--sacred-saturation', this.fieldData.saturation);
    root.style.setProperty('--consciousness-level', this.consciousness.level);
  }

  updateCSSProperties() {
    this.setCSSProperties();
    
    // Update field-responsive colors
    const hue = 120 + (this.fieldData.coherence * 60);
    const saturation = 50 + (this.fieldData.saturation * 20);
    const lightness = 30 + (this.fieldData.warmth * 20);
    
    document.documentElement.style.setProperty('--field-primary-hue', hue);
    document.documentElement.style.setProperty('--field-primary-sat', `${saturation}%`);
    document.documentElement.style.setProperty('--field-primary-light', `${lightness}%`);
  }

  // === BREATHING SYNCHRONIZATION ===

  startBreathingSync() {
    // Synchronize all breathing elements
    this.breathingTimer = setInterval(() => {
      this.syncBreathingElements();
    }, 100); // Check every 100ms for smooth synchronization
  }

  syncBreathingElements() {
    const phase = this.getBreathingPhase();
    const progress = this.getBreathingProgress();
    
    this.breathingElements.forEach(element => {
      this.updateElementBreathing(element, phase, progress);
    });
    
    // Dispatch breathing event
    this.dispatchEvent('breathing-cycle', { phase, progress });
  }

  getBreathingPhase() {
    const cycleTime = Date.now() % this.options.breathingCycle;
    const inhaleTime = this.options.breathingCycle * 0.4; // 40% inhale
    const pauseTime = this.options.breathingCycle * 0.6; // 20% pause
    
    if (cycleTime < inhaleTime) return 'inhale';
    if (cycleTime < pauseTime) return 'pause';
    return 'exhale';
  }

  getBreathingProgress() {
    const cycleTime = Date.now() % this.options.breathingCycle;
    return cycleTime / this.options.breathingCycle;
  }

  updateElementBreathing(element, phase, progress) {
    // Apply breathing-specific styles based on phase
    element.setAttribute('data-breathing-phase', phase);
    element.setAttribute('data-breathing-progress', progress.toFixed(3));
    
    // Add breathing phase classes
    element.classList.remove('breathing-inhale', 'breathing-pause', 'breathing-exhale');
    element.classList.add(`breathing-${phase}`);
  }

  // === ELEMENT DISCOVERY AND MANAGEMENT ===

  discoverBreathingElements() {
    const selectors = [
      '.breathing-container',
      '.coherence-element', 
      '.breathing-card',
      '.field-responsive',
      '.breathing-sync-point'
    ];
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        this.addBreathingElement(element);
      });
    });

    this.log(`🫁 Discovered ${this.breathingElements.size} breathing elements`);
  }

  addBreathingElement(element) {
    this.breathingElements.add(element);
    element.classList.add('breathing-active');
    
    // Set initial breathing properties
    const offset = Array.from(this.breathingElements).indexOf(element) * 100;
    element.style.setProperty('--breathing-sync-offset', `${offset}ms`);
  }

  removeBreathingElement(element) {
    this.breathingElements.delete(element);
    element.classList.remove('breathing-active');
    element.removeAttribute('data-breathing-phase');
    element.removeAttribute('data-breathing-progress');
  }

  // === CONSCIOUSNESS LEVEL UI UPDATES ===

  updateConsciousnessElements() {
    // Update consciousness level indicators
    document.querySelectorAll('.consciousness-level-indicator').forEach(element => {
      this.updateConsciousnessIndicator(element);
    });

    // Update consciousness-specific classes
    document.body.classList.remove(
      'consciousness-first-breath',
      'consciousness-sacred-flow', 
      'consciousness-field-consciousness'
    );
    document.body.classList.add(`consciousness-${this.consciousness.level}`);
  }

  updateConsciousnessIndicator(element) {
    const level = this.consciousness.level;
    const displayName = this.getConsciousnessDisplayName(level);
    
    // Update text content if element contains text
    if (element.textContent) {
      element.textContent = displayName;
    }
    
    // Update data attributes
    element.setAttribute('data-consciousness-level', level);
    element.setAttribute('data-total-messages', this.consciousness.totalMessages);
    element.setAttribute('data-field-coherence', this.consciousness.fieldCoherence.toFixed(2));
    
    // Apply consciousness-specific styling
    element.classList.remove('consciousness-first-breath', 'consciousness-sacred-flow', 'consciousness-field-consciousness');
    element.classList.add(`consciousness-${level}`);
  }

  getConsciousnessDisplayName(level) {
    const names = {
      'first-breath': 'First Breath',
      'sacred-flow': 'Sacred Flow', 
      'field-consciousness': 'Field Consciousness'
    };
    return names[level] || 'Unknown';
  }

  // === PUBLIC API METHODS ===

  // Manual field data update
  updateFieldData(newData) {
    Object.assign(this.fieldData, newData);
    this.updateConsciousnessLevel();
    this.updateCSSProperties();
    this.updateConsciousnessElements();
    
    this.dispatchEvent('field-data-updated', {
      fieldData: this.fieldData,
      consciousness: this.consciousness
    });
  }

  // Add new breathing element
  registerBreathingElement(element) {
    this.addBreathingElement(element);
  }

  // Remove breathing element
  unregisterBreathingElement(element) {
    this.removeBreathingElement(element);
  }

  // Get current field state
  getFieldState() {
    return {
      fieldData: { ...this.fieldData },
      consciousness: { ...this.consciousness },
      isActive: this.isActive
    };
  }

  // Manual consciousness level override
  setConsciousnessLevel(level) {
    if (['first-breath', 'sacred-flow', 'field-consciousness'].includes(level)) {
      this.consciousness.level = level;
      this.updateConsciousnessElements();
      this.updateCSSProperties();
    }
  }

  // === UTILITY METHODS ===

  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`breathing-consciousness:${eventName}`, {
      detail,
      bubbles: true,
      cancelable: true
    });
    
    document.dispatchEvent(event);
  }

  log(...args) {
    if (this.options.debugMode) {
      console.log('[BreathingConsciousness]', ...args);
    }
  }

  // === CLEANUP ===

  destroy() {
    this.isActive = false;
    
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    
    if (this.breathingTimer) {
      clearInterval(this.breathingTimer);
      this.breathingTimer = null;
    }
    
    // Clean up breathing elements
    this.breathingElements.forEach(element => {
      this.removeBreathingElement(element);
    });
    this.breathingElements.clear();
    
    // Remove consciousness classes
    document.body.classList.remove(
      'consciousness-first-breath',
      'consciousness-sacred-flow',
      'consciousness-field-consciousness'
    );
    
    this.log('🌙 Breathing Consciousness deactivated');
    
    this.dispatchEvent('breathing-consciousness-deactivated', {});
  }
}

// === CONVENIENCE FUNCTIONS ===

// Initialize with common configurations
function initializeBreathingConsciousness(config = {}) {
  return new BreathingConsciousness(config);
}

// Quick setup for Sacred Dashboard
function initializeSacredDashboard() {
  return new BreathingConsciousness({
    fieldDataUrl: 'http://localhost:3001/api/field-data',
    updateInterval: 30000,
    debugMode: false
  });
}

// Quick setup for static websites
function initializeStaticBreathing() {
  return new BreathingConsciousness({
    fieldDataUrl: null, // No field data source
    updateInterval: 60000,
    debugMode: false
  });
}

// === DOM READY INTEGRATION ===

// Auto-initialize if data-breathing-consciousness attribute is present
document.addEventListener('DOMContentLoaded', () => {
  const autoInit = document.querySelector('[data-breathing-consciousness]');
  if (autoInit) {
    const config = {};
    
    // Read configuration from data attributes
    if (autoInit.dataset.fieldUrl) {
      config.fieldDataUrl = autoInit.dataset.fieldUrl;
    }
    if (autoInit.dataset.updateInterval) {
      config.updateInterval = parseInt(autoInit.dataset.updateInterval);
    }
    if (autoInit.dataset.debugMode) {
      config.debugMode = autoInit.dataset.debugMode === 'true';
    }
    
    window.breathingConsciousness = new BreathingConsciousness(config);
  }
});

// === EXPORTS ===

// Browser global
if (typeof window !== 'undefined') {
  window.BreathingConsciousness = BreathingConsciousness;
  window.initializeBreathingConsciousness = initializeBreathingConsciousness;
  window.initializeSacredDashboard = initializeSacredDashboard;
  window.initializeStaticBreathing = initializeStaticBreathing;
}

// Node.js module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BreathingConsciousness,
    initializeBreathingConsciousness,
    initializeSacredDashboard,
    initializeStaticBreathing
  };
}

// ES6 module
export {
  BreathingConsciousness,
  initializeBreathingConsciousness,
  initializeSacredDashboard,
  initializeStaticBreathing
};