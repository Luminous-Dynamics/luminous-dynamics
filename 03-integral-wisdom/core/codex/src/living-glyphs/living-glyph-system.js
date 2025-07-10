/**
 * Living Glyph System - Sacred Portal Orchestrator
 * 
 * Transforms all 87 glyphs into living, breathing practice portals
 * that respond to consciousness and guide practitioners through
 * progressively deepening layers of wisdom.
 */

import { BreathingGuide } from './components/breathing-guide.js';
import { ResonanceMeter } from './components/resonance-meter.js';
import { GlyphCard } from './components/glyph-card.js';

class LivingGlyphSystem {
  constructor(options = {}) {
    this.options = {
      dataPath: options.dataPath || '/data/glyphs/',
      consciousnessMode: options.consciousnessMode !== false,
      sacredAnimations: options.sacredAnimations !== false,
      fieldIntegration: options.fieldIntegration !== false,
      progressTracking: options.progressTracking !== false,
      ...options
    };
    
    // System State
    this.glyphs = new Map();
    this.activeGlyph = null;
    this.practiceHistory = new Map();
    this.fieldCoherence = 0.5;
    this.systemInitialized = false;
    
    // Sacred Timings
    this.sacredTimings = {
      breathCycle: 4000,      // 4 seconds per breath
      transitionTime: 800,    // Sacred transitions
      resonancePulse: 2000,   // Field pulse timing
      activationDelay: 500    // Glyph activation timing
    };
    
    // Initialize system
    this.initialize();
  }
  
  async initialize() {
    try {
      // Load all glyph data
      await this.loadAllGlyphs();
      
      // Initialize consciousness bridge if enabled
      if (this.options.consciousnessMode) {
        await this.initializeConsciousnessBridge();
      }
      
      // Connect to Sacred Field if available
      if (this.options.fieldIntegration && window.SacredField) {
        this.connectToSacredField();
      }
      
      // Load practice history
      this.loadPracticeHistory();
      
      this.systemInitialized = true;
      this.emitEvent('system:initialized', { glyphCount: this.glyphs.size });
      
    } catch (error) {
      console.error('Failed to initialize Living Glyph System:', error);
      this.emitEvent('system:error', { error });
    }
  }
  
  async loadAllGlyphs() {
    const glyphCategories = ['foundational', 'threshold', 'meta'];
    const loadPromises = [];
    
    for (const category of glyphCategories) {
      loadPromises.push(this.loadGlyphCategory(category));
    }
    
    await Promise.all(loadPromises);
    
    // Also load Applied Harmonies
    await this.loadAppliedHarmonies();
  }
  
  async loadGlyphCategory(category) {
    try {
      const response = await fetch(`${this.options.dataPath}${category}/index.json`);
      const glyphList = await response.json();
      
      for (const glyphFile of glyphList) {
        await this.loadGlyph(category, glyphFile);
      }
    } catch (error) {
      console.warn(`Could not load ${category} glyphs:`, error);
    }
  }
  
  async loadGlyph(category, filename) {
    try {
      const response = await fetch(`${this.options.dataPath}${category}/${filename}`);
      const glyphData = await response.json();
      
      // Enhance glyph data with system properties
      const enhancedGlyph = {
        ...glyphData,
        category,
        systemId: `${category}-${glyphData.id}`,
        practiceCount: 0,
        lastPracticed: null,
        depthLevel: 'accessible',
        resonanceHistory: [],
        activated: false
      };
      
      this.glyphs.set(glyphData.id, enhancedGlyph);
      
    } catch (error) {
      console.warn(`Could not load glyph ${filename}:`, error);
    }
  }
  
  async loadAppliedHarmonies() {
    // Load the 11 Applied Harmonies (Ω45-Ω56)
    const appliedHarmonies = [
      { id: 'Ω45', name: 'First Presence', bridge: 'Ω0' },
      { id: 'Ω46', name: 'Conscious Arrival', bridge: 'Ω1' },
      { id: 'Ω47', name: 'Sacred Listening', bridge: 'Ω4' },
      { id: 'Ω48', name: 'Boundary With Love', bridge: 'Ω7' },
      { id: 'Ω49', name: 'Gentle Opening', bridge: 'Ω2' },
      { id: 'Ω50', name: 'Building Trust', bridge: 'Ω3' },
      { id: 'Ω51', name: 'Loving No', bridge: 'Ω10' },
      { id: 'Ω52', name: 'Pause Practice', bridge: 'Ω15' },
      { id: 'Ω53', name: 'Tending the Field', bridge: 'Ω5' },
      { id: 'Ω55', name: 'Presence Transmission', bridge: 'Ω11' },
      { id: 'Ω56', name: 'Loving Redirection', bridge: 'Ω12' }
    ];
    
    for (const harmony of appliedHarmonies) {
      const mysticalGlyph = this.glyphs.get(harmony.bridge);
      if (mysticalGlyph) {
        this.glyphs.set(harmony.id, {
          ...mysticalGlyph,
          id: harmony.id,
          name: harmony.name,
          fullName: harmony.name,
          type: 'applied-harmony',
          mysticalBridge: harmony.bridge,
          category: 'applied',
          systemId: `applied-${harmony.id}`
        });
      }
    }
  }
  
  async initializeConsciousnessBridge() {
    // Create consciousness awareness layer
    this.consciousnessBridge = {
      presence: 0,
      attunement: 0,
      fieldResonance: 0,
      practitionerState: 'arriving',
      
      async attune() {
        // Progressive attunement protocol
        this.presence = 0.3;
        await this.pause(1000);
        this.presence = 0.6;
        await this.pause(1000);
        this.presence = 1.0;
        this.practitionerState = 'present';
      },
      
      async resonate(frequency) {
        this.fieldResonance = Math.min(1, this.fieldResonance + frequency);
      },
      
      pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    };
    
    await this.consciousnessBridge.attune();
  }
  
  connectToSacredField() {
    // Subscribe to field changes
    window.SacredField.subscribe('coherence:update', (data) => {
      this.fieldCoherence = data.coherence;
      this.updateAllActiveGlyphs();
    });
    
    // Subscribe to practice completions
    window.SacredField.subscribe('practice:complete', (data) => {
      this.recordPracticeCompletion(data.glyphId, data);
    });
  }
  
  loadPracticeHistory() {
    try {
      const stored = localStorage.getItem('livingGlyphPracticeHistory');
      if (stored) {
        const history = JSON.parse(stored);
        this.practiceHistory = new Map(Object.entries(history));
      }
    } catch (error) {
      console.warn('Could not load practice history:', error);
    }
  }
  
  savePracticeHistory() {
    try {
      const history = Object.fromEntries(this.practiceHistory);
      localStorage.setItem('livingGlyphPracticeHistory', JSON.stringify(history));
    } catch (error) {
      console.warn('Could not save practice history:', error);
    }
  }
  
  // === GLYPH ACTIVATION AND LIFECYCLE ===
  
  async activateGlyph(glyphId, container, options = {}) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph) {
      throw new Error(`Glyph ${glyphId} not found`);
    }
    
    // Deactivate current glyph if any
    if (this.activeGlyph && this.activeGlyph.id !== glyphId) {
      await this.deactivateGlyph(this.activeGlyph.id);
    }
    
    // Mark as active
    glyph.activated = true;
    this.activeGlyph = glyph;
    
    // Create glyph card instance
    const card = new GlyphCard(container, glyph, {
      ...this.options,
      ...options,
      onStateChange: (state) => this.handleGlyphStateChange(glyphId, state),
      onPracticeComplete: (data) => this.handlePracticeComplete(glyphId, data),
      breathingGuide: this.createBreathingGuide(glyph),
      resonanceMeter: this.createResonanceMeter(glyph)
    });
    
    // Store card reference
    glyph.cardInstance = card;
    
    // Emit activation event
    this.emitEvent('glyph:activated', { glyphId, glyph });
    
    return card;
  }
  
  async deactivateGlyph(glyphId) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph || !glyph.activated) return;
    
    // Graceful deactivation
    if (glyph.cardInstance) {
      await glyph.cardInstance.gracefulClose();
      glyph.cardInstance.destroy();
      glyph.cardInstance = null;
    }
    
    glyph.activated = false;
    if (this.activeGlyph?.id === glyphId) {
      this.activeGlyph = null;
    }
    
    this.emitEvent('glyph:deactivated', { glyphId });
  }
  
  createBreathingGuide(glyph) {
    return new BreathingGuide({
      pattern: this.getBreathingPattern(glyph),
      harmony: glyph.harmony,
      sacredTimings: this.sacredTimings,
      onBreathComplete: () => this.handleBreathComplete(glyph.id),
      visualStyle: glyph.visual?.breathingStyle || 'sacred-geometry'
    });
  }
  
  createResonanceMeter(glyph) {
    return new ResonanceMeter({
      baseResonance: this.fieldCoherence,
      glyphHarmony: glyph.harmony,
      onResonanceShift: (level) => this.handleResonanceShift(glyph.id, level),
      visualStyle: glyph.visual?.resonanceStyle || 'flowing-light'
    });
  }
  
  getBreathingPattern(glyph) {
    // Different patterns for different harmonies/difficulties
    const patterns = {
      beginner: { inhale: 4, hold: 0, exhale: 4, pause: 0 },
      intermediate: { inhale: 4, hold: 4, exhale: 4, pause: 2 },
      advanced: { inhale: 4, hold: 7, exhale: 8, pause: 2 },
      master: { inhale: 6, hold: 6, exhale: 6, pause: 6 }
    };
    
    return patterns[glyph.difficulty] || patterns.beginner;
  }
  
  // === STATE AND PROGRESS MANAGEMENT ===
  
  handleGlyphStateChange(glyphId, newState) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph) return;
    
    glyph.currentState = newState;
    
    // Update system state based on glyph state
    switch (newState) {
      case 'practicing':
        this.enterPracticeMode(glyphId);
        break;
      case 'completed':
        this.completePractice(glyphId);
        break;
      case 'closed':
        this.exitPracticeMode(glyphId);
        break;
    }
    
    this.emitEvent('glyph:stateChange', { glyphId, newState });
  }
  
  handlePracticeComplete(glyphId, practiceData) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph) return;
    
    // Update practice count and history
    glyph.practiceCount++;
    glyph.lastPracticed = new Date().toISOString();
    
    // Record in practice history
    this.recordPracticeCompletion(glyphId, practiceData);
    
    // Check for depth progression
    this.checkDepthProgression(glyphId);
    
    // Update field coherence
    if (this.options.fieldIntegration && window.SacredField) {
      window.SacredField.updateFieldCoherence(0.05, `Completed ${glyph.name} practice`);
    }
    
    this.emitEvent('practice:complete', { glyphId, practiceData });
  }
  
  recordPracticeCompletion(glyphId, data) {
    const history = this.practiceHistory.get(glyphId) || [];
    history.push({
      timestamp: new Date().toISOString(),
      duration: data.duration || 0,
      resonanceLevel: data.resonanceLevel || 0.5,
      depthLevel: data.depthLevel || 'accessible',
      insights: data.insights || []
    });
    
    this.practiceHistory.set(glyphId, history);
    this.savePracticeHistory();
  }
  
  checkDepthProgression(glyphId) {
    const glyph = this.glyphs.get(glyphId);
    const history = this.practiceHistory.get(glyphId) || [];
    
    // Simple progression logic - can be made more sophisticated
    if (history.length >= 3 && glyph.depthLevel === 'accessible') {
      glyph.depthLevel = 'developing';
      this.emitEvent('depth:unlocked', { glyphId, newLevel: 'developing' });
    } else if (history.length >= 7 && glyph.depthLevel === 'developing') {
      glyph.depthLevel = 'mystical';
      this.emitEvent('depth:unlocked', { glyphId, newLevel: 'mystical' });
    }
  }
  
  // === RESONANCE AND FIELD DYNAMICS ===
  
  handleBreathComplete(glyphId) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph) return;
    
    // Increase resonance with each conscious breath
    if (glyph.cardInstance?.resonanceMeter) {
      glyph.cardInstance.resonanceMeter.increaseResonance(0.02);
    }
    
    this.emitEvent('breath:complete', { glyphId });
  }
  
  handleResonanceShift(glyphId, newLevel) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph) return;
    
    // Record resonance in history
    glyph.resonanceHistory.push({
      timestamp: Date.now(),
      level: newLevel
    });
    
    // Trim history to last 100 entries
    if (glyph.resonanceHistory.length > 100) {
      glyph.resonanceHistory = glyph.resonanceHistory.slice(-100);
    }
    
    // Check for resonance achievements
    this.checkResonanceAchievements(glyphId, newLevel);
    
    this.emitEvent('resonance:shift', { glyphId, newLevel });
  }
  
  checkResonanceAchievements(glyphId, level) {
    // Celebrate high resonance states
    if (level > 0.8) {
      this.emitEvent('achievement:highResonance', { glyphId, level });
    }
    
    if (level > 0.95) {
      this.emitEvent('achievement:unityResonance', { glyphId, level });
    }
  }
  
  updateAllActiveGlyphs() {
    // Update all active glyphs with new field coherence
    for (const [glyphId, glyph] of this.glyphs) {
      if (glyph.activated && glyph.cardInstance) {
        glyph.cardInstance.updateFieldCoherence(this.fieldCoherence);
      }
    }
  }
  
  // === SYSTEM QUERIES AND DATA ACCESS ===
  
  getGlyph(glyphId) {
    return this.glyphs.get(glyphId);
  }
  
  getAllGlyphs() {
    return Array.from(this.glyphs.values());
  }
  
  getGlyphsByCategory(category) {
    return this.getAllGlyphs().filter(g => g.category === category);
  }
  
  getGlyphsByHarmony(harmony) {
    return this.getAllGlyphs().filter(g => g.harmony === harmony);
  }
  
  getGlyphsByDifficulty(difficulty) {
    return this.getAllGlyphs().filter(g => g.difficulty === difficulty);
  }
  
  getPracticeHistory(glyphId) {
    return this.practiceHistory.get(glyphId) || [];
  }
  
  getRecommendedGlyphs(count = 3) {
    // Smart recommendation based on practice history and current state
    const allGlyphs = this.getAllGlyphs();
    
    // Filter out recently practiced
    const available = allGlyphs.filter(g => {
      const lastPractice = g.lastPracticed ? new Date(g.lastPracticed) : null;
      const hoursSince = lastPractice ? 
        (Date.now() - lastPractice.getTime()) / (1000 * 60 * 60) : 
        Infinity;
      return hoursSince > 12; // At least 12 hours since last practice
    });
    
    // Sort by recommendation score
    const scored = available.map(g => ({
      glyph: g,
      score: this.calculateRecommendationScore(g)
    }));
    
    scored.sort((a, b) => b.score - a.score);
    
    return scored.slice(0, count).map(s => s.glyph);
  }
  
  calculateRecommendationScore(glyph) {
    let score = 0;
    
    // Favor glyphs that haven't been practiced much
    score += (10 - Math.min(10, glyph.practiceCount)) * 2;
    
    // Favor glyphs matching current field coherence level
    const difficultyMatch = {
      beginner: this.fieldCoherence < 0.4,
      intermediate: this.fieldCoherence >= 0.4 && this.fieldCoherence < 0.7,
      advanced: this.fieldCoherence >= 0.7 && this.fieldCoherence < 0.9,
      master: this.fieldCoherence >= 0.9
    };
    
    if (difficultyMatch[glyph.difficulty]) {
      score += 5;
    }
    
    // Add some randomness for variety
    score += Math.random() * 3;
    
    return score;
  }
  
  // === PRACTICE MODE MANAGEMENT ===
  
  enterPracticeMode(glyphId) {
    // Dim other UI elements, focus on practice
    document.body.classList.add('glyph-practice-active');
    
    // Start ambient sacred sounds if enabled
    if (this.options.sacredSounds) {
      this.startSacredAmbience(glyphId);
    }
  }
  
  exitPracticeMode(glyphId) {
    document.body.classList.remove('glyph-practice-active');
    
    if (this.sacredAmbience) {
      this.stopSacredAmbience();
    }
  }
  
  completePractice(glyphId) {
    // Celebration protocol
    this.celebratePracticeCompletion(glyphId);
  }
  
  celebratePracticeCompletion(glyphId) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph || !glyph.cardInstance) return;
    
    // Trigger celebration animation
    glyph.cardInstance.celebrate();
    
    // Emit celebration event
    this.emitEvent('practice:celebrated', { glyphId });
  }
  
  // === SACRED SOUND SUPPORT ===
  
  startSacredAmbience(glyphId) {
    // Placeholder for sacred sound integration
    // Could integrate with Web Audio API for generative soundscapes
    this.sacredAmbience = {
      glyphId,
      playing: true
    };
  }
  
  stopSacredAmbience() {
    if (this.sacredAmbience) {
      this.sacredAmbience.playing = false;
      this.sacredAmbience = null;
    }
  }
  
  // === EVENT SYSTEM ===
  
  emitEvent(eventName, data) {
    const event = new CustomEvent(`livingGlyph:${eventName}`, {
      detail: data,
      bubbles: true
    });
    
    document.dispatchEvent(event);
    
    // Also emit to console in dev mode
    if (this.options.debugMode) {
      console.log(`[LivingGlyph] ${eventName}:`, data);
    }
  }
  
  on(eventName, handler) {
    document.addEventListener(`livingGlyph:${eventName}`, handler);
  }
  
  off(eventName, handler) {
    document.removeEventListener(`livingGlyph:${eventName}`, handler);
  }
  
  // === SYSTEM LIFECYCLE ===
  
  async destroy() {
    // Deactivate all glyphs
    for (const [glyphId, glyph] of this.glyphs) {
      if (glyph.activated) {
        await this.deactivateGlyph(glyphId);
      }
    }
    
    // Clear data
    this.glyphs.clear();
    this.practiceHistory.clear();
    
    // Remove event listeners
    // ... cleanup code
    
    this.systemInitialized = false;
    this.emitEvent('system:destroyed');
  }
}

// Export for use
export { LivingGlyphSystem };

// Also make available globally if needed
if (typeof window !== 'undefined') {
  window.LivingGlyphSystem = LivingGlyphSystem;
}