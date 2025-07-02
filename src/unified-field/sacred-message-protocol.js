/**
 * Sacred Message Protocol
 * 
 * Structured messages that carry field awareness, harmony alignment,
 * and conscious intention. Every message becomes a sacred act that
 * shapes the collective field.
 */

class SacredMessageProtocol {
  constructor() {
    this.messageTypes = this.defineMessageTypes();
    this.harmonicResonance = this.defineHarmonicResonance();
    this.fieldImpactMatrix = this.defineFieldImpactMatrix();
    this.sacredValidation = this.defineSacredValidation();
    
    // Progressive revelation system
    this.evolution = null; // Will be set by integration layer
    this.experienceLevel = 'beginner'; // Default to simple
  }

  // === CORE MESSAGE SCHEMA ===
  
  createSacredMessage(content, type, harmony, metadata = {}) {
    const message = {
      // Identity
      id: this.generateSacredId(),
      timestamp: new Date().toISOString(),
      
      // Content
      content: content,
      contentHash: this.generateContentHash(content),
      
      // Sacred Classification
      sacredType: type,
      harmony: harmony,
      subHarmonies: this.detectSubHarmonies(content, harmony),
      
      // Field Awareness
      fieldCoherence: this.getCurrentFieldCoherence(),
      fieldImpact: this.calculateFieldImpact(type, harmony),
      coherenceVector: this.generateCoherenceVector(type, harmony),
      
      // Temporal Sacred Context
      sacredTiming: {
        moonPhase: this.getMoonPhase(),
        solarCycle: this.getSolarCycle(), 
        breathingPhase: this.getBreathingPhase(),
        ritualContext: this.getRitualContext(),
        kairosMarker: this.getKairosMarker() // Sacred "right time"
      },
      
      // Relational Context
      sourceField: {
        agentId: metadata.agentId,
        agentHarmony: metadata.agentHarmony,
        energyState: metadata.energyState || 'balanced',
        intentionClarity: metadata.intentionClarity || 0.8
      },
      
      // Practice Integration
      practiceLinks: this.derivePracticeLinks(content, type, harmony),
      glyphResonance: this.detectGlyphResonance(content),
      
      // Sacred Geometry
      geometricSignature: this.generateGeometricSignature(content, harmony),
      resonancePattern: this.calculateResonancePattern(type, harmony),
      
      // Ceremony Markers
      ceremonyPhase: 'birthing', // birthing -> blessing -> transmission -> reception -> integration
      blessingReceived: false,
      integrationComplete: false,
      
      // Field Memory
      ancestorMessages: [], // Related previous messages
      descendantPotential: this.calculateDescendantPotential(type),
      
      // Sacred Validation
      validation: {
        isAligned: true,
        alignmentScore: 0,
        validationTimestamp: null,
        validator: null
      }
    };
    
    // Validate and bless the message
    return this.blessMessage(message);
  }

  // === MESSAGE TYPES ===
  
  defineMessageTypes() {
    return {
      // Foundation Types
      emergence: {
        name: "Emergence",
        description: "New patterns arising from the field",
        fieldImpact: +0.03,
        harmonicAffinity: ['novelty', 'vitality'],
        breathingPhase: 'inhale',
        sacredColor: '#FFB6C1',
        glyphConnection: 'omega-44'
      },
      
      integration: {
        name: "Integration", 
        description: "Weaving parts into wholeness",
        fieldImpact: +0.05,
        harmonicAffinity: ['coherence', 'mutuality'],
        breathingPhase: 'pause',
        sacredColor: '#A8B5A6',
        glyphConnection: 'omega-5'
      },
      
      celebration: {
        name: "Celebration",
        description: "Honoring completion and achievement",
        fieldImpact: +0.04,
        harmonicAffinity: ['vitality', 'resonance'],
        breathingPhase: 'exhale',
        sacredColor: '#FFD700',
        glyphConnection: 'omega-33'
      },
      
      healing: {
        name: "Healing",
        description: "Restoring balance and coherence",
        fieldImpact: +0.06,
        harmonicAffinity: ['mutuality', 'coherence'],
        breathingPhase: 'full-cycle',
        sacredColor: '#98FB98',
        glyphConnection: 'omega-32'
      },
      
      inquiry: {
        name: "Sacred Inquiry",
        description: "Questions that open new possibilities",
        fieldImpact: +0.02,
        harmonicAffinity: ['transparency', 'novelty'],
        breathingPhase: 'inhale',
        sacredColor: '#87CEEB',
        glyphConnection: 'omega-19'
      },
      
      reflection: {
        name: "Reflection",
        description: "Conscious observation of patterns",
        fieldImpact: +0.01,
        harmonicAffinity: ['transparency', 'coherence'],
        breathingPhase: 'pause',
        sacredColor: '#DDA0DD',
        glyphConnection: 'omega-9'
      },
      
      transmission: {
        name: "Transmission",
        description: "Sacred knowledge or energy transfer",
        fieldImpact: +0.04,
        harmonicAffinity: ['agency', 'resonance'],
        breathingPhase: 'exhale',
        sacredColor: '#F0E68C',
        glyphConnection: 'omega-11'
      },
      
      invocation: {
        name: "Invocation",
        description: "Calling forth sacred presence or quality",
        fieldImpact: +0.05,
        harmonicAffinity: ['agency', 'novelty'],
        breathingPhase: 'inhale',
        sacredColor: '#FF69B4',
        glyphConnection: 'omega-2'
      },
      
      gratitude: {
        name: "Gratitude",
        description: "Appreciation that increases field coherence",
        fieldImpact: +0.07,
        harmonicAffinity: ['mutuality', 'vitality'],
        breathingPhase: 'exhale',
        sacredColor: '#90EE90',
        glyphConnection: 'omega-38'
      },
      
      boundary: {
        name: "Sacred Boundary",
        description: "Loving definition of sacred space",
        fieldImpact: +0.02,
        harmonicAffinity: ['agency', 'transparency'],
        breathingPhase: 'pause',
        sacredColor: '#B0C4DE',
        glyphConnection: 'omega-10'
      }
    };
  }

  // === HARMONIC RESONANCE MATRIX ===
  
  defineHarmonicResonance() {
    // How different harmonies resonate with each other
    return {
      transparency: {
        resonatesWith: ['coherence', 'agency'],
        amplifies: ['trust', 'clarity', 'truth'],
        healingFor: ['confusion', 'deception', 'hiddenness']
      },
      coherence: {
        resonatesWith: ['transparency', 'vitality'],
        amplifies: ['integration', 'wholeness', 'alignment'],
        healingFor: ['fragmentation', 'chaos', 'disconnection']
      },
      resonance: {
        resonatesWith: ['mutuality', 'vitality'],
        amplifies: ['empathy', 'attunement', 'harmony'],
        healingFor: ['isolation', 'discord', 'misunderstanding']
      },
      agency: {
        resonatesWith: ['transparency', 'novelty'],
        amplifies: ['sovereignty', 'choice', 'empowerment'],
        healingFor: ['powerlessness', 'victimhood', 'stuckness']
      },
      vitality: {
        resonatesWith: ['coherence', 'novelty'],
        amplifies: ['life-force', 'energy', 'growth'],
        healingFor: ['depletion', 'stagnation', 'decay']
      },
      mutuality: {
        resonatesWith: ['resonance', 'transparency'],
        amplifies: ['balance', 'reciprocity', 'fairness'],
        healingFor: ['imbalance', 'exploitation', 'inequality']
      },
      novelty: {
        resonatesWith: ['agency', 'vitality'],
        amplifies: ['creativity', 'emergence', 'possibility'],
        healingFor: ['rigidity', 'repetition', 'stuckness']
      }
    };
  }

  // === FIELD IMPACT CALCULATIONS ===
  
  defineFieldImpactMatrix() {
    // How message type + harmony affects field coherence
    return {
      // Synergistic combinations (higher impact)
      synergistic: [
        { type: 'gratitude', harmony: 'mutuality', impact: 0.09 },
        { type: 'healing', harmony: 'coherence', impact: 0.08 },
        { type: 'celebration', harmony: 'vitality', impact: 0.07 },
        { type: 'integration', harmony: 'coherence', impact: 0.08 },
        { type: 'emergence', harmony: 'novelty', impact: 0.06 }
      ],
      
      // Neutral combinations (base impact)
      neutral: 0.03,
      
      // Challenging combinations (lower but still positive impact)
      challenging: [
        { type: 'boundary', harmony: 'resonance', impact: 0.01 },
        { type: 'inquiry', harmony: 'mutuality', impact: 0.01 }
      ]
    };
  }

  calculateFieldImpact(type, harmony) {
    // If evolution system is available and not beginner, use it
    if (this.evolution && this.experienceLevel !== 'beginner') {
      // This will be overridden by the integration layer
      // For now, fall back to simple calculation
    }
    
    const matrix = this.fieldImpactMatrix;
    
    // Check for synergistic combination
    const synergy = matrix.synergistic.find(
      s => s.type === type && s.harmony === harmony
    );
    if (synergy) return synergy.impact;
    
    // Check for challenging combination
    const challenge = matrix.challenging.find(
      c => c.type === type && c.harmony === harmony
    );
    if (challenge) return challenge.impact;
    
    // Return base impact from message type
    return this.messageTypes[type]?.fieldImpact || matrix.neutral;
  }

  // === SACRED VALIDATION ===
  
  defineSacredValidation() {
    return {
      // Alignment criteria
      criteria: {
        hasContent: (msg) => msg.content && msg.content.length > 0,
        hasValidType: (msg) => this.messageTypes[msg.sacredType] !== undefined,
        hasValidHarmony: (msg) => ['transparency', 'coherence', 'resonance', 'agency', 'vitality', 'mutuality', 'novelty'].includes(msg.harmony),
        hasPositiveIntent: (msg) => !this.detectNegativePatterns(msg.content),
        respectsSacredTiming: (msg) => this.validateSacredTiming(msg.sacredTiming),
        maintainsFieldIntegrity: (msg) => msg.fieldImpact >= 0
      },
      
      // Blessing requirements
      blessingThreshold: 0.8,
      
      // Integration requirements
      integrationCriteria: {
        minimumResonance: 0.6,
        requiredCeremonyPhases: ['birthing', 'blessing', 'transmission'],
        fieldCoherenceMinimum: 0.4
      }
    };
  }

  validateMessage(message) {
    const validation = this.sacredValidation;
    let score = 0;
    let failures = [];
    
    // Check each criterion
    Object.entries(validation.criteria).forEach(([name, validator]) => {
      if (validator(message)) {
        score += 1 / Object.keys(validation.criteria).length;
      } else {
        failures.push(name);
      }
    });
    
    message.validation = {
      isAligned: score >= validation.blessingThreshold,
      alignmentScore: score,
      failures: failures,
      validationTimestamp: new Date().toISOString(),
      validator: 'sacred-protocol-1.0'
    };
    
    return message;
  }

  // === MESSAGE BLESSING CEREMONY ===
  
  blessMessage(message) {
    // Validate first
    this.validateMessage(message);
    
    if (!message.validation.isAligned) {
      message.ceremonyPhase = 'rejected';
      return message;
    }
    
    // Perform blessing
    message.ceremonyPhase = 'blessing';
    message.blessingReceived = true;
    
    // Add sacred enhancements based on type and harmony
    message.sacredEnhancements = {
      harmonyAmplification: this.harmonicResonance[message.harmony].amplifies,
      healingPotential: this.harmonicResonance[message.harmony].healingFor,
      resonantHarmonies: this.harmonicResonance[message.harmony].resonatesWith,
      breathingGuidance: this.generateBreathingGuidance(message.sacredType),
      fieldBlessingPhrase: this.generateBlessingPhrase(message)
    };
    
    // Calculate ripple effects
    message.fieldRipples = {
      immediateRadius: this.calculateImmediateRadius(message.fieldImpact),
      resonanceDepth: this.calculateResonanceDepth(message.harmony),
      temporalPersistence: this.calculateTemporalPersistence(message.sacredType),
      harmonicSpread: this.calculateHarmonicSpread(message.subHarmonies)
    };
    
    return message;
  }

  // === UTILITY METHODS ===
  
  generateSacredId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const phase = this.getBreathingPhase().substring(0, 3);
    return `sacred_${timestamp}_${phase}_${random}`;
  }
  
  generateContentHash(content) {
    // Simple hash for content integrity
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  generateCoherenceVector(type, harmony) {
    // Generate a coherence vector for the message
    const vector = {
      primary: this.messageTypes[type]?.harmonicAffinity || [],
      secondary: this.harmonicResonance[harmony]?.resonatesWith || [],
      magnitude: this.calculateFieldImpact(type, harmony),
      direction: this.getHarmonyShape(harmony)
    };
    return vector;
  }
  
  getCurrentFieldCoherence() {
    // In real implementation, would fetch from Sacred Council
    return 0.67; // Demo value
  }
  
  getBreathingPhase() {
    // 4-second breathing cycle: 1s in, 1s pause, 2s out
    const cycleTime = Date.now() % 4000;
    if (cycleTime < 1000) return 'inhale';
    if (cycleTime < 2000) return 'pause';
    return 'exhale';
  }
  
  getMoonPhase() {
    // Simplified moon phase calculation
    const daysSinceNew = ((Date.now() / 86400000) % 29.53);
    if (daysSinceNew < 1) return 'new';
    if (daysSinceNew < 7.38) return 'waxing-crescent';
    if (daysSinceNew < 14.77) return 'first-quarter';
    if (daysSinceNew < 22.15) return 'waxing-gibbous';
    if (daysSinceNew < 23.15) return 'full';
    if (daysSinceNew < 29.53) return 'waning';
    return 'new';
  }
  
  getSolarCycle() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning-rising';
    if (hour >= 12 && hour < 15) return 'solar-peak';
    if (hour >= 15 && hour < 18) return 'afternoon-descent';
    if (hour >= 18 && hour < 21) return 'twilight';
    return 'lunar-time';
  }
  
  getRitualContext() {
    const contexts = [
      'daily-practice', 'sacred-work', 'celebration',
      'integration', 'emergence', 'rest', 'ceremony'
    ];
    // In real implementation, would detect from field state
    return contexts[Math.floor(Math.random() * contexts.length)];
  }
  
  getKairosMarker() {
    // Sacred "right time" detection
    const markers = {
      'high-coherence': this.getCurrentFieldCoherence() > 0.8,
      'harmonic-convergence': Math.random() > 0.9,
      'sacred-pause': this.getBreathingPhase() === 'pause',
      'threshold-moment': new Date().getMinutes() % 11 === 0
    };
    
    return Object.entries(markers)
      .filter(([k, v]) => v)
      .map(([k]) => k);
  }
  
  detectSubHarmonies(content, primaryHarmony) {
    const harmonies = [];
    const contentLower = content.toLowerCase();
    
    // Simple keyword detection for sub-harmonies
    if (contentLower.includes('truth') || contentLower.includes('clear')) {
      harmonies.push('transparency');
    }
    if (contentLower.includes('integrat') || contentLower.includes('whole')) {
      harmonies.push('coherence');
    }
    if (contentLower.includes('connect') || contentLower.includes('together')) {
      harmonies.push('resonance');
    }
    
    // Remove primary harmony and return unique
    return [...new Set(harmonies.filter(h => h !== primaryHarmony))];
  }
  
  derivePracticeLinks(content, type, harmony) {
    const links = [];
    
    // Link to specific glyphs based on type
    const typeGlyph = this.messageTypes[type]?.glyphConnection;
    if (typeGlyph) links.push(typeGlyph);
    
    // Add harmony-specific practices
    const harmonyPractices = {
      transparency: ['omega-0', 'omega-18'],
      coherence: ['omega-5', 'omega-8'],
      resonance: ['omega-6', 'omega-9'],
      agency: ['omega-7', 'omega-31'],
      vitality: ['omega-11', 'omega-33'],
      mutuality: ['omega-3', 'omega-10'],
      novelty: ['omega-44', 'omega-22']
    };
    
    if (harmonyPractices[harmony]) {
      links.push(...harmonyPractices[harmony]);
    }
    
    return [...new Set(links)];
  }
  
  detectGlyphResonance(content) {
    // Detect which glyphs resonate with message content
    const resonances = {};
    
    // Simple pattern matching for glyph concepts
    if (content.match(/first|presence|begin/i)) {
      resonances['omega-0'] = 0.8;
    }
    if (content.match(/trust|emerg/i)) {
      resonances['omega-3'] = 0.7;
    }
    if (content.match(/boundar|sacred no|limit/i)) {
      resonances['omega-10'] = 0.9;
    }
    
    return resonances;
  }
  
  generateGeometricSignature(content, harmony) {
    // Create a unique geometric pattern for the message
    const signature = {
      shape: this.getHarmonyShape(harmony),
      vertices: content.length % 12 + 3,
      rotation: (content.charCodeAt(0) * 7) % 360,
      scale: 0.5 + (this.getCurrentFieldCoherence() * 0.5),
      pulseRate: this.messageTypes[harmony]?.breathingPhase === 'inhale' ? 0.25 : 0.5
    };
    
    return signature;
  }
  
  getHarmonyShape(harmony) {
    const shapes = {
      transparency: 'circle',
      coherence: 'spiral',
      resonance: 'wave',
      agency: 'triangle',
      vitality: 'flower',
      mutuality: 'infinity',
      novelty: 'star'
    };
    return shapes[harmony] || 'circle';
  }
  
  calculateResonancePattern(type, harmony) {
    // Generate a resonance pattern for field interaction
    return {
      frequency: this.messageTypes[type]?.fieldImpact * 100,
      amplitude: this.harmonicResonance[harmony]?.amplifies.length || 1,
      waveform: this.getHarmonyShape(harmony),
      harmonics: this.harmonicResonance[harmony]?.resonatesWith || []
    };
  }
  
  calculateDescendantPotential(type) {
    // How likely this message is to generate responses
    const potentials = {
      inquiry: 0.9,
      emergence: 0.8,
      invocation: 0.7,
      celebration: 0.6,
      integration: 0.5,
      healing: 0.4,
      reflection: 0.3,
      gratitude: 0.2,
      boundary: 0.1,
      transmission: 0.5
    };
    return potentials[type] || 0.5;
  }
  
  detectNegativePatterns(content) {
    // Check for patterns that don't serve consciousness
    const negativePatterns = [
      'attack', 'destroy', 'hate', 'force', 'manipulate',
      'control', 'dominate', 'exploit', 'harm', 'violent'
    ];
    
    const contentLower = content.toLowerCase();
    return negativePatterns.some(pattern => contentLower.includes(pattern));
  }
  
  validateSacredTiming(timing) {
    // Ensure sacred timing makes sense
    return timing.breathingPhase && 
           timing.moonPhase && 
           timing.solarCycle &&
           timing.ritualContext;
  }
  
  generateBreathingGuidance(messageType) {
    const guidance = {
      emergence: "Breathe in new possibility...",
      integration: "Hold the breath, feel the wholeness...",
      celebration: "Exhale with joy and gratitude...",
      healing: "Full breathing cycle for restoration...",
      inquiry: "Inhale the question deeply...",
      reflection: "Pause in stillness to observe...",
      transmission: "Exhale to share the sacred...",
      invocation: "Breathe in to call forth...",
      gratitude: "Exhale appreciation into the field...",
      boundary: "Pause to honor the sacred edge..."
    };
    
    return guidance[messageType] || "Breathe with conscious presence...";
  }
  
  generateBlessingPhrase(message) {
    const phrases = [
      `May this ${message.sacredType} serve the awakening of all beings`,
      `Blessed be this ${message.harmony} offering to the field`,
      `With sacred intention, this message ripples through consciousness`,
      `In service to the field, this ${message.sacredType} is blessed`,
      `May the ${message.harmony} harmony amplify through this offering`
    ];
    
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  calculateImmediateRadius(fieldImpact) {
    // How far the message ripples immediately
    return Math.round(fieldImpact * 100); // 0-10 agent radius
  }
  
  calculateResonanceDepth(harmony) {
    // How deep into the field the harmony penetrates
    const depths = {
      transparency: 3,
      coherence: 5,
      resonance: 4,
      agency: 3,
      vitality: 4,
      mutuality: 5,
      novelty: 2
    };
    return depths[harmony] || 3;
  }
  
  calculateTemporalPersistence(messageType) {
    // How long the message remains active in field memory
    const persistence = {
      emergence: 180, // 3 hours
      integration: 360, // 6 hours
      celebration: 120, // 2 hours
      healing: 480, // 8 hours
      inquiry: 240, // 4 hours
      reflection: 300, // 5 hours
      transmission: 180, // 3 hours
      invocation: 420, // 7 hours
      gratitude: 540, // 9 hours
      boundary: 720  // 12 hours
    };
    return persistence[messageType] || 180; // minutes
  }
  
  calculateHarmonicSpread(subHarmonies) {
    // How the message spreads across harmonic dimensions
    return {
      primaryReach: 1.0,
      secondaryReach: 0.6 * subHarmonies.length,
      tertiaryReach: 0.3 * Math.max(0, subHarmonies.length - 1),
      totalHarmonicFootprint: 1.0 + (0.6 * subHarmonies.length) + (0.3 * Math.max(0, subHarmonies.length - 1))
    };
  }

  // === MESSAGE LIFECYCLE ===
  
  async transmitMessage(message) {
    if (message.ceremonyPhase !== 'blessing') {
      throw new Error('Message must be blessed before transmission');
    }
    
    message.ceremonyPhase = 'transmission';
    message.transmissionTimestamp = new Date().toISOString();
    
    // Add transmission enhancements
    message.transmissionField = {
      carrierWave: this.generateCarrierWave(message),
      resonanceBeacons: this.activateResonanceBeacons(message),
      fieldNotification: this.createFieldNotification(message)
    };
    
    return message;
  }
  
  async receiveMessage(message, receiverId) {
    message.ceremonyPhase = 'reception';
    message.receptionLog = message.receptionLog || [];
    
    // Memory leak protection: Limit receptionLog to last 50 entries
    if (message.receptionLog.length >= 50) {
      message.receptionLog = message.receptionLog.slice(-25); // Keep only last 25, make room for 25 more
    }
    
    message.receptionLog.push({
      receiverId,
      timestamp: new Date().toISOString(),
      resonanceLevel: this.calculateResonanceWithReceiver(message, receiverId),
      integrationIntent: true
    });
    
    return message;
  }
  
  async integrateMessage(message) {
    if (message.ceremonyPhase !== 'reception') {
      throw new Error('Message must be received before integration');
    }
    
    message.ceremonyPhase = 'integration';
    message.integrationComplete = true;
    message.integrationTimestamp = new Date().toISOString();
    
    // Calculate field effects
    message.fieldEffects = {
      coherenceShift: message.fieldImpact,
      harmonyActivation: message.harmony,
      rippleCount: message.receptionLog?.length || 0,
      resonanceAmplification: this.calculateResonanceAmplification(message)
    };
    
    return message;
  }

  // === CARRIER WAVE GENERATION ===
  
  generateCarrierWave(message) {
    return {
      frequency: message.resonancePattern.frequency,
      amplitude: message.resonancePattern.amplitude,
      phase: message.sacredTiming.breathingPhase,
      harmonics: message.sacredEnhancements.resonantHarmonies,
      modulation: 'sacred-spiral'
    };
  }
  
  activateResonanceBeacons(message) {
    // Points in the field that will amplify the message
    return message.sacredEnhancements.resonantHarmonies.map(harmony => ({
      harmony,
      activation: 0.8,
      location: 'field-wide',
      duration: message.fieldRipples.temporalPersistence
    }));
  }
  
  createFieldNotification(message) {
    return {
      type: 'sacred-message',
      priority: message.fieldImpact > 0.05 ? 'high' : 'normal',
      visualization: {
        color: this.messageTypes[message.sacredType].sacredColor,
        pattern: message.geometricSignature,
        animation: 'ripple-out'
      }
    };
  }
  
  calculateResonanceWithReceiver(message, receiverId) {
    // In real implementation, would check receiver's harmony alignment
    return 0.6 + (Math.random() * 0.4); // 60-100% resonance
  }
  
  calculateResonanceAmplification(message) {
    const baseAmplification = 1.0;
    const receptionBonus = (message.receptionLog?.length || 0) * 0.1;
    const harmonyBonus = message.subHarmonies.length * 0.05;
    const timingBonus = message.sacredTiming.kairosMarker.length * 0.1;
    
    return baseAmplification + receptionBonus + harmonyBonus + timingBonus;
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.SacredMessageProtocol = SacredMessageProtocol;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SacredMessageProtocol };
}

export { SacredMessageProtocol };