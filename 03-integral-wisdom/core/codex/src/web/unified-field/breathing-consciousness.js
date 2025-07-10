/**
 * Breathing Consciousness JavaScript Module
 * Sacred field-responsive behavior system for unified web architecture
 * 
 * Provides dynamic field resonant-coherence updates, consciousness level detection,
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
      enableBiometricSync: options.enableBiometricSync !== false,
      enableTemporalSync: options.enableTemporalSync !== false,
      ...options
    };

    this.fieldData = {
      'resonant-coherence': 0.67,
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

    // Biometric integration state
    this.biometricData = {
      enabled: false,
      heartRate: 70,
      'resonant-coherence': 0,
      guidance: null,
      modifier: 1.0
    };

    // Temporal integration state  
    this.temporalData = {
      enabled: false,
      modifier: 1.0,
      cosmic: null
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
      
      // Initialize temporal breathing cycles (cosmic synchronization)
      this.initializeTemporalBreathing();
      
      // Initialize biometric heart resonant-coherence integration
      this.initializeBiometricIntegration();
      
      this.isActive = true;
      this.log('✨ Breathing Consciousness activated with cosmic and biometric integration');
      
      // Dispatch activation event
      this.dispatchEvent('breathing-consciousness:activated', {
        fieldData: this.fieldData,
        consciousness: this.consciousness,
        biometricEnabled: this.biometricData.enabled,
        temporalEnabled: this.temporalData.enabled
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
        'resonant-coherence': data.fieldCoherence || this.fieldData['resonant-coherence'],
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
      
      this.log('🔄 Field data updated:', this.fieldData['resonant-coherence']);
      
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
        this.fieldData['resonant-coherence'] = Math.min(0.85, this.fieldData['resonant-coherence'] + 0.01);
      } else if (breathingPhase === 'exhale') {
        this.fieldData['resonant-coherence'] = Math.max(0.5, this.fieldData['resonant-coherence'] - 0.01);
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
    this.consciousness.fieldCoherence = this.fieldData['resonant-coherence'];
    
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
    
    root.style.setProperty('--field-resonant-coherence', this.fieldData['resonant-coherence']);
    root.style.setProperty('--sacred-warmth', this.fieldData.warmth);
    root.style.setProperty('--sacred-saturation', this.fieldData.saturation);
    root.style.setProperty('--consciousness-level', this.consciousness.level);
  }

  updateCSSProperties() {
    this.setCSSProperties();
    
    // Update field-responsive colors
    const hue = 120 + (this.fieldData['resonant-coherence'] * 60);
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
      '.resonant-coherence-element', 
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
    element.setAttribute('data-field-resonant-coherence', this.consciousness.fieldCoherence.toFixed(2));
    
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

  // === BIOMETRIC HEART COHERENCE INTEGRATION ===

  initializeBiometricIntegration() {
    if (!this.options.enableBiometricSync) {
      this.log('💓 Biometric sync disabled');
      return;
    }

    // Listen for biometric heart resonant-coherence events
    document.addEventListener('heart-resonant-coherence:updated', (event) => {
      this.handleBiometricUpdate(event.detail);
    });

    document.addEventListener('biometric-breathing:updated', (event) => {
      this.handleBiometricBreathingUpdate(event.detail);
    });

    this.biometricData.enabled = true;
    this.log('💓 Biometric heart resonant-coherence integration initialized');
  }

  handleBiometricUpdate(biometricData) {
    const { heartData, resonant-coherence } = biometricData;
    
    // Update our biometric state
    this.biometricData.heartRate = heartData.heartRate;
    this.biometricData.resonant-coherence = heartData.resonant-coherence;
    this.biometricData.guidance = resonant-coherence.guidance;
    
    // Integrate heart resonant-coherence with field resonant-coherence
    const enhancedFieldCoherence = this.calculateBiometricFieldIntegration(
      this.fieldData['resonant-coherence'],
      heartData.resonant-coherence
    );

    // Update field resonant-coherence with biometric enhancement
    this.fieldData['resonant-coherence'] = enhancedFieldCoherence;
    
    // Update consciousness and CSS
    this.updateConsciousnessLevel();
    this.updateCSSProperties();
    
    this.log(`💓 Biometric update: HR ${heartData.heartRate} | HC ${(heartData.resonant-coherence * 100).toFixed(1)}% | Field ${(enhancedFieldCoherence * 100).toFixed(1)}%`);
    
    // Dispatch enhanced field update
    this.dispatchEvent('breathing-consciousness:biometric-enhanced', {
      fieldData: this.fieldData,
      biometricData: this.biometricData,
      enhancedCoherence: enhancedFieldCoherence
    });
  }

  handleBiometricBreathingUpdate(breathingData) {
    const { biometricRate, heartRate, resonant-coherence } = breathingData;
    
    // Update breathing modifier based on biometric guidance
    this.biometricData.modifier = biometricRate / this.options.breathingCycle;
    
    // Apply biometric breathing adjustment
    this.applyBiometricBreathingAdjustment(biometricRate);
    
    this.log(`🫁 Biometric breathing: ${Math.round(biometricRate)}ms (${this.biometricData.modifier.toFixed(2)}x)`);
  }

  calculateBiometricFieldIntegration(fieldCoherence, heartCoherence) {
    // Weighted integration: 70% field resonant-coherence, 30% heart resonant-coherence
    const integrated = (fieldCoherence * 0.7) + (heartCoherence * 0.3);
    
    // Apply heart resonant-coherence bonus for high resonant-coherence states
    let bonus = 0;
    if (heartCoherence > 0.7) {
      bonus = (heartCoherence - 0.7) * 0.1; // Up to 3% bonus for perfect resonant-coherence
    }
    
    return Math.min(1.0, integrated + bonus);
  }

  applyBiometricBreathingAdjustment(biometricRate) {
    // Update CSS properties with biometric guidance
    const root = document.documentElement;
    
    root.style.setProperty('--biometric-breathing-rate', `${biometricRate}ms`);
    root.style.setProperty('--breathing-modifier', this.biometricData.modifier.toString());
    
    // Calculate adjusted inhale/exhale based on biometric guidance
    const adjustedInhale = biometricRate * 0.4; // 40% inhale
    const adjustedExhale = biometricRate * 0.6; // 60% exhale
    
    root.style.setProperty('--adjusted-inhale', `${adjustedInhale}ms`);
    root.style.setProperty('--adjusted-exhale', `${adjustedExhale}ms`);
    
    // Update breathing cycle for synchronization
    this.options.breathingCycle = biometricRate;
  }

  // === TEMPORAL BREATHING INTEGRATION ===

  initializeTemporalBreathing() {
    if (!this.options.enableTemporalSync) {
      this.log('🌌 Temporal sync disabled');
      return;
    }

    // Listen for temporal breathing events
    document.addEventListener('temporal-breathing:updated', (event) => {
      this.handleTemporalUpdate(event.detail);
    });

    document.addEventListener('cosmic-realignment:complete', (event) => {
      this.handleCosmicRealignment(event.detail);
    });

    this.temporalData.enabled = true;
    this.log('🌌 Temporal breathing integration initialized');
  }

  handleTemporalUpdate(temporalData) {
    const { breathing, cosmicData, modifier } = temporalData;
    
    // Update temporal state
    this.temporalData.modifier = modifier;
    this.temporalData.cosmic = cosmicData;
    
    // Apply temporal breathing adjustments
    this.applyTemporalBreathingAdjustment(breathing);
    
    this.log(`🌌 Temporal breathing: ${Math.round(breathing.breathingRate)}ms (${modifier.toFixed(2)}x cosmic)`);
  }

  handleCosmicRealignment(realignmentData) {
    const { cosmicData } = realignmentData;
    
    this.log('🌟 Cosmic realignment complete - breathing synchronized with universe');
    
    // Dispatch cosmic integration event
    this.dispatchEvent('breathing-consciousness:cosmic-aligned', {
      fieldData: this.fieldData,
      cosmicData,
      timestamp: new Date().toISOString()
    });
  }

  applyTemporalBreathingAdjustment(breathing) {
    // Integrate temporal modifier with any existing biometric modifier
    let finalModifier = this.temporalData.modifier;
    
    if (this.biometricData.enabled && this.biometricData.modifier !== 1.0) {
      // Combine temporal and biometric modifiers
      finalModifier = (this.temporalData.modifier * 0.6) + (this.biometricData.modifier * 0.4);
    }
    
    const finalBreathingRate = this.options.breathingCycle * finalModifier;
    
    // Update CSS properties with cosmic guidance
    const root = document.documentElement;
    root.style.setProperty('--cosmic-breathing-rate', `${finalBreathingRate}ms`);
    root.style.setProperty('--temporal-modifier', finalModifier.toString());
    
    // Update breathing cycle for full integration
    this.options.breathingCycle = Math.round(finalBreathingRate);
  }

  // === UNIFIED BREATHING ORCHESTRATION ===

  calculateFinalBreathingRate() {
    let baseRate = 10000; // Base 10-second cycle
    
    // Apply temporal cosmic modulation
    if (this.temporalData.enabled && this.temporalData.modifier !== 1.0) {
      baseRate *= this.temporalData.modifier;
    }
    
    // Apply biometric heart resonant-coherence modulation
    if (this.biometricData.enabled && this.biometricData.modifier !== 1.0) {
      // Weighted combination: 60% temporal, 40% biometric
      const temporalContribution = this.temporalData.enabled ? this.temporalData.modifier * 0.6 : 0.6;
      const biometricContribution = this.biometricData.modifier * 0.4;
      const combinedModifier = temporalContribution + biometricContribution;
      
      baseRate = 10000 * combinedModifier;
    }
    
    return Math.round(baseRate);
  }

  getBreathingStatus() {
    return {
      finalRate: this.calculateFinalBreathingRate(),
      baseRate: 10000,
      temporal: {
        enabled: this.temporalData.enabled,
        modifier: this.temporalData.modifier,
        cosmic: this.temporalData.cosmic
      },
      biometric: {
        enabled: this.biometricData.enabled,
        modifier: this.biometricData.modifier,
        heartRate: this.biometricData.heartRate,
        'resonant-coherence': this.biometricData.resonant-coherence
      },
      integration: {
        active: this.temporalData.enabled || this.biometricData.enabled,
        type: this.temporalData.enabled && this.biometricData.enabled ? 'cosmic-biometric' : 
              this.temporalData.enabled ? 'cosmic' : 
              this.biometricData.enabled ? 'biometric' : 'baseline'
      }
    };
  }

  // === PUBLIC API METHODS ===

  // Manual field data update
  updateFieldData(newData) {
    Object.assign(this.fieldData, newData);
    this.updateConsciousnessLevel();
    this.updateCSSProperties();
    this.updateConsciousnessElements();
    
    this.dispatchEvent('breathing-consciousness:field-data-updated', {
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

  // === TEMPORAL BREATHING INTEGRATION ===

  // Initialize temporal breathing cycles integration
  initializeTemporalBreathing() {
    if (typeof window !== 'undefined' && window.TemporalBreathingCycles) {
      this.temporalBreathing = new window.TemporalBreathingCycles({
        debugMode: this.options.debugMode,
        baseBreathingRate: this.options.breathingCycle
      });

      // Listen for temporal breathing updates
      document.addEventListener('temporal-breathing:updated', (event) => {
        const { breathing, cosmicData, modifier } = event.detail;
        
        // Update our field data with cosmic timing
        this.fieldData.cosmicAlignment = {
          modifier,
          lunar: cosmicData.lunar.phase,
          seasonal: cosmicData.seasonal.season,
          circadian: cosmicData.circadian.phase,
          breathingRate: breathing.breathingRate
        };

        // Update our breathing cycle to match cosmic timing
        this.options.breathingCycle = breathing.breathingRate;

        // Dispatch enhanced field data event
        this.dispatchEvent('cosmic-sync', {
          fieldData: this.fieldData,
          consciousness: this.consciousness,
          cosmicData,
          temporalModifier: modifier
        });

        this.log(`🌌 Cosmic breathing sync: ${cosmicData.lunar.phase} | ${cosmicData.circadian.phase} | Rate: ${Math.round(breathing.breathingRate)}ms`);
      });

      // Listen for cosmic realignment
      document.addEventListener('cosmic-realignment:complete', (event) => {
        this.log('🌟 Cosmic realignment complete - breathing consciousness synchronized');
        
        // Update field resonant-coherence with cosmic alignment
        this.fieldData.cosmicCoherence = this.calculateCosmicCoherence(event.detail.cosmicData);
        this.updateCSSProperties();
      });

      this.log('🫁 Temporal breathing cycles integrated with consciousness');
    } else {
      this.log('⚠️ TemporalBreathingCycles not available, continuing without cosmic sync');
    }
  }

  calculateCosmicCoherence(cosmicData) {
    // Calculate how aligned the current cosmic timing is
    const lunarAlignment = this.getLunarCoherence(cosmicData.lunar);
    const seasonalAlignment = this.getSeasonalCoherence(cosmicData.seasonal);
    const circadianAlignment = this.getCircadianCoherence(cosmicData.circadian);
    
    return (lunarAlignment + seasonalAlignment + circadianAlignment) / 3;
  }

  getLunarCoherence(lunar) {
    // Higher resonant-coherence during new moon and full moon
    if (lunar.phase === 'new_moon' || lunar.phase === 'full_moon') return 0.9;
    if (lunar.phase === 'first_quarter' || lunar.phase === 'last_quarter') return 0.7;
    return 0.6; // Crescent phases
  }

  getSeasonalCoherence(seasonal) {
    // Higher resonant-coherence during transition periods
    const transitions = ['winter_spring', 'summer_autumn'];
    return transitions.includes(seasonal.season) ? 0.8 : 0.7;
  }

  getCircadianCoherence(circadian) {
    // Higher resonant-coherence during dawn and evening
    if (circadian.phase === 'dawn' || circadian.phase === 'evening') return 0.9;
    if (circadian.phase === 'morning' || circadian.phase === 'afternoon') return 0.7;
    return 0.6; // Night
  }

  // Get current cosmic state from temporal breathing system
  getCosmicState() {
    if (this.temporalBreathing) {
      return this.temporalBreathing.getCurrentCosmicState();
    }
    return null;
  }

  // Get cosmic breathing guidance
  getCosmicGuidance() {
    if (this.temporalBreathing) {
      return this.temporalBreathing.getBreathingGuidance();
    }
    return {
      message: 'Cosmic breathing synchronization not available',
      fallback: 'Continue with standard 4:6 breathing rhythm'
    };
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