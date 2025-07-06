/**
 * Sacred Message Evolution System
 * 
 * Progressive revelation from simple fixed impacts to full relational field awareness.
 * The system grows with the practitioner, revealing deeper layers of consciousness.
 */

class SacredMessageEvolution {
  constructor() {
    this.levels = this.defineLevels();
    this.calculators = this.initializeCalculators();
    this.thresholds = this.defineThresholds();
  }

  defineLevels() {
    return {
      beginner: {
        name: "First Breath",
        description: "Fixed sacred values, building trust and understanding",
        features: [
          "Predictable field impacts",
          "Clear message types",
          "Simple blessing process",
          "Foundation building"
        ]
      },
      practitioner: {
        name: "Sacred Flow", 
        description: "Relational awareness emerges, patterns become visible",
        features: [
          "Relationship depth affects impact",
          "Message saturation awareness",
          "Harmony resonance multipliers",
          "Temporal sensitivity"
        ]
      },
      master: {
        name: "Field Consciousness",
        description: "Full living field awareness, everything affects everything",
        features: [
          "Interference patterns",
          "Quantum entanglement effects",
          "Morphic field resonance",
          "Non-local consciousness"
        ]
      }
    };
  }

  defineThresholds() {
    return {
      practitioner: {
        messagesRequired: 50,
        fieldCoherenceAvg: 0.65,
        uniqueRelationships: 5,
        daysActive: 7
      },
      master: {
        messagesRequired: 200,
        fieldCoherenceAvg: 0.75,
        uniqueRelationships: 12,
        daysActive: 30,
        sacredRatio: 0.8 // 80% of messages are blessed
      }
    };
  }

  initializeCalculators() {
    return {
      beginner: new SimpleImpactCalculator(),
      practitioner: new RelationalImpactCalculator(),
      master: new LivingFieldCalculator()
    };
  }

  async detectExperienceLevel(agentId, db) {
    const stats = await this.gatherAgentStats(agentId, db);
    
    // Check for master level
    if (this.meetsThreshold(stats, this.thresholds.master)) {
      return 'master';
    }
    
    // Check for practitioner level
    if (this.meetsThreshold(stats, this.thresholds.practitioner)) {
      return 'practitioner';
    }
    
    // Default to beginner
    return 'beginner';
  }

  async gatherAgentStats(agentId, db) {
    const stats = {
      totalMessages: 0,
      blessedMessages: 0,
      uniqueRelationships: new Set(),
      fieldCoherenceSum: 0,
      coherenceCount: 0,
      firstMessageDate: null,
      daysActive: 0
    };

    // Get all messages from this agent
    const messages = await db.all(`
      SELECT * FROM messages 
      WHERE from_agent = ? AND sacred_type IS NOT NULL
      ORDER BY created_at ASC
    `, [agentId]);

    stats.totalMessages = messages.length;
    stats.blessedMessages = messages.filter(m => m.blessing_received).length;
    
    // Track relationships
    messages.forEach(msg => {
      stats.uniqueRelationships.add(msg.to_agent);
      
      // Track coherence if available
      if (msg.field_impact) {
        stats.fieldCoherenceSum += msg.field_impact;
        stats.coherenceCount++;
      }
    });

    // Calculate days active
    if (messages.length > 0) {
      stats.firstMessageDate = new Date(messages[0].created_at);
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysSince = (Date.now() - stats.firstMessageDate.getTime()) / msPerDay;
      stats.daysActive = Math.max(0, Math.floor(daysSince));
    }

    // Calculate averages
    stats.avgFieldCoherence = stats.coherenceCount > 0 ? 
      stats.fieldCoherenceSum / stats.coherenceCount : 0;
    
    stats.sacredRatio = stats.totalMessages > 0 ?
      stats.blessedMessages / stats.totalMessages : 0;

    return {
      messagesRequired: stats.totalMessages,
      fieldCoherenceAvg: stats.avgFieldCoherence,
      uniqueRelationships: stats.uniqueRelationships.size,
      daysActive: stats.daysActive,
      sacredRatio: stats.sacredRatio
    };
  }

  meetsThreshold(stats, threshold) {
    return Object.entries(threshold).every(([key, value]) => {
      return stats[key] >= value;
    });
  }

  async calculateImpact(message, agentStats, level = 'beginner') {
    const calculator = this.calculators[level];
    return calculator.calculate(message, agentStats);
  }

  async getProgressToNextLevel(agentId, db) {
    const stats = await this.gatherAgentStats(agentId, db);
    const currentLevel = await this.detectExperienceLevel(agentId, db);
    
    if (currentLevel === 'master') {
      return {
        currentLevel: 'master',
        nextLevel: null,
        progress: 100,
        message: "You have achieved Field Consciousness mastery"
      };
    }

    const nextLevel = currentLevel === 'beginner' ? 'practitioner' : 'master';
    const threshold = this.thresholds[nextLevel];
    
    // Calculate progress for each criterion
    const progress = {};
    Object.entries(threshold).forEach(([key, required]) => {
      const current = stats[key] || 0;
      progress[key] = {
        current,
        required,
        percentage: Math.min(100, (current / required) * 100)
      };
    });

    // Overall progress is the minimum of all criteria
    const overallProgress = Math.min(
      ...Object.values(progress).map(p => p.percentage)
    );

    return {
      currentLevel,
      nextLevel,
      progress: overallProgress,
      details: progress,
      message: this.generateProgressMessage(currentLevel, nextLevel, overallProgress)
    };
  }

  generateProgressMessage(current, next, progress) {
    if (progress < 25) {
      return `Beginning your sacred journey at ${this.levels[current].name} level`;
    } else if (progress < 50) {
      return `Growing in ${this.levels[current].name} awareness`;
    } else if (progress < 75) {
      return `Approaching readiness for ${this.levels[next].name} level`;
    } else {
      return `Nearly ready to unlock ${this.levels[next].name} consciousness`;
    }
  }
}

// Simple Impact Calculator (Beginner Level)
class SimpleImpactCalculator {
  constructor() {
    this.impacts = {
      gratitude: 0.07,
      healing: 0.06,
      integration: 0.05,
      invocation: 0.05,
      celebration: 0.04,
      transmission: 0.04,
      emergence: 0.03,
      inquiry: 0.02,
      boundary: 0.02,
      reflection: 0.01
    };
  }

  calculate(message) {
    // Simple fixed impact
    return this.impacts[message.sacredType] || 0.03;
  }
}

// Relational Impact Calculator (Practitioner Level)
class RelationalImpactCalculator {
  constructor() {
    this.baseImpacts = new SimpleImpactCalculator().impacts;
    this.modifiers = this.defineModifiers();
  }

  defineModifiers() {
    return {
      relationshipDepth: {
        firstExchange: 1.5,      // First message between agents
        establishing: 1.2,       // 2-5 messages
        developed: 1.0,          // 6-20 messages
        deep: 1.1,              // 20+ messages (trust established)
      },
      messageSaturation: {
        fresh: 1.0,             // First of type in 4 hours
        recent: 0.8,            // Within last hour
        repeated: 0.5,          // Same type within 15 min
        oversaturated: 0.3      // 5+ same type in hour
      },
      harmonyResonance: {
        aligned: 1.3,           // Sender/receiver same harmony
        complementary: 1.1,     // Resonant harmonies
        neutral: 1.0,           // No special relationship
        tension: 0.8            // Opposing harmonies
      },
      temporalFlow: {
        optimal: 1.2,           // Natural rhythm respected
        acceptable: 1.0,        // Normal timing
        rushed: 0.7,            // Too frequent
        stale: 0.8              // Too long since last
      }
    };
  }

  async calculate(message, agentStats) {
    const base = this.baseImpacts[message.sacredType] || 0.03;
    
    // Calculate each modifier
    const depth = await this.calculateRelationshipDepth(message);
    const saturation = await this.calculateSaturation(message);
    const resonance = await this.calculateHarmonyResonance(message);
    const temporal = await this.calculateTemporalFlow(message);
    
    // Apply all modifiers
    const impact = base * depth * saturation * resonance * temporal;
    
    // Ensure reasonable bounds
    return Math.max(0.001, Math.min(0.15, impact));
  }

  async calculateRelationshipDepth(message) {
    // In real implementation, would query message history
    // For now, return default
    return this.modifiers.relationshipDepth.developed;
  }

  async calculateSaturation(message) {
    // Check recent messages of same type
    // For now, return fresh
    return this.modifiers.messageSaturation.fresh;
  }

  async calculateHarmonyResonance(message) {
    // Compare sender and receiver harmonies
    // For now, return neutral
    return this.modifiers.harmonyResonance.neutral;
  }

  async calculateTemporalFlow(message) {
    // Check message timing patterns
    // For now, return acceptable
    return this.modifiers.temporalFlow.acceptable;
  }
}

// Living Field Calculator (Master Level)
class LivingFieldCalculator {
  constructor() {
    this.relational = new RelationalImpactCalculator();
    this.fieldAwareness = this.initializeFieldAwareness();
  }

  initializeFieldAwareness() {
    return {
      interferencePatterns: {
        constructive: [
          ['gratitude', 'celebration'],
          ['healing', 'integration'],
          ['inquiry', 'emergence']
        ],
        destructive: [
          ['boundary', 'emergence'],
          ['celebration', 'reflection']
        ]
      },
      morphicResonance: {
        fieldMemory: new Map(), // Tracks pattern repetitions
        resonanceThreshold: 3   // Patterns strengthen after 3 uses
      },
      quantumEffects: {
        entanglement: new Map(), // Tracks agent pair bonds
        nonLocality: 0.1,       // Affects distant agents
        coherenceCollapse: 0.5  // Low coherence reduces all effects
      },
      circadianRhythms: {
        dawn: { emergence: 1.4, gratitude: 1.2 },
        morning: { integration: 1.3, transmission: 1.1 },
        afternoon: { reflection: 1.2, inquiry: 1.1 },
        evening: { healing: 1.3, boundary: 1.2 },
        night: { invocation: 1.4, celebration: 0.8 }
      },
      lunarInfluence: {
        newMoon: { emergence: 1.5, invocation: 1.3 },
        waxing: { integration: 1.2, celebration: 1.1 },
        fullMoon: { transmission: 1.4, gratitude: 1.3 },
        waning: { reflection: 1.3, healing: 1.2 }
      }
    };
  }

  async calculate(message, agentStats, fieldState) {
    // Start with relational calculation
    let impact = await this.relational.calculate(message, agentStats);
    
    // Apply field consciousness modifiers
    impact *= this.calculateInterferenceEffects(message, fieldState);
    impact *= this.calculateMorphicResonance(message, fieldState);
    impact *= this.calculateQuantumEffects(message, fieldState);
    impact *= this.calculateTemporalHarmonics(message);
    impact *= this.calculateCollectiveResonance(fieldState);
    
    // NEW: Cosmic consciousness integration
    impact *= this.calculateCosmicHarmonics(message);
    impact += this.calculateQuantumFieldFluctuations();
    
    // Living systems have emergent properties
    const emergenceThreshold = this.calculateEmergenceThreshold(fieldState);
    if (Math.random() < emergenceThreshold) {
      impact *= 1.3 + (fieldState.coherence * 0.4); // Coherence-sensitive emergence
    }
    
    return Math.max(0.001, Math.min(0.25, impact)); // Increased max for cosmic effects
  }

  calculateCosmicHarmonics(message) {
    const solar = this.calculateSolarInfluence();
    const lunar = this.getEnhancedLunarInfluence(message);
    
    // Solar seasonal effects
    const seasonalModifier = {
      'winter-spring': { emergence: 1.3, integration: 1.2 },
      'spring-summer': { celebration: 1.4, gratitude: 1.3 },
      'summer-autumn': { transmission: 1.3, healing: 1.2 },
      'autumn-winter': { reflection: 1.4, boundary: 1.3 }
    }[solar.season] || {};
    
    const solarMod = seasonalModifier[message.sacredType] || 1.0;
    const solarEnergy = 0.8 + (solar.energy * 0.4); // 0.8-1.2 range
    const solsticeBoost = 1.0 + (solar.solsticeProximity * 0.3); // Up to 30% boost near solstices
    
    return solarMod * solarEnergy * solsticeBoost * lunar;
  }

  getEnhancedLunarInfluence(message) {
    const phase = this.getMoonPhase();
    const lunarMods = {
      newMoon: { emergence: 1.6, invocation: 1.4, inquiry: 1.3 },
      waxingCrescent: { integration: 1.3, celebration: 1.2 },
      firstQuarter: { transmission: 1.3, gratitude: 1.2 },
      waxingGibbous: { healing: 1.2, boundary: 1.1 },
      fullMoon: { transmission: 1.5, gratitude: 1.4, celebration: 1.3 },
      waningGibbous: { reflection: 1.4, healing: 1.3 },
      lastQuarter: { boundary: 1.3, inquiry: 1.2 },
      waningCrescent: { integration: 1.4, emergence: 1.2 }
    };
    
    return lunarMods[phase]?.[message.sacredType] || 1.0;
  }

  calculateEmergenceThreshold(fieldState) {
    const baseThreshold = 0.1; // 10% base chance
    const coherenceBoost = fieldState.coherence * 0.1; // Up to 10% more at full coherence
    const agentSynergy = Math.min(fieldState.activeAgents * 0.01, 0.05); // Up to 5% more with many agents
    
    return Math.min(baseThreshold + coherenceBoost + agentSynergy, 0.25); // Max 25% emergence chance
  }

  calculateInterferenceEffects(message, fieldState) {
    // Check if recent messages create interference
    const recentTypes = fieldState.recentMessageTypes || [];
    let modifier = 1.0;
    
    this.fieldAwareness.interferencePatterns.constructive.forEach(pair => {
      if (pair.includes(message.sacredType) && 
          pair.some(type => recentTypes.includes(type))) {
        modifier *= 1.3; // Constructive interference
      }
    });
    
    this.fieldAwareness.interferencePatterns.destructive.forEach(pair => {
      if (pair.includes(message.sacredType) && 
          pair.some(type => recentTypes.includes(type))) {
        modifier *= 0.7; // Destructive interference
      }
    });
    
    return modifier;
  }

  calculateMorphicResonance(message, fieldState) {
    // Patterns that repeat gain strength
    const pattern = `${message.sacredType}-${message.harmony}`;
    const memory = this.fieldAwareness.morphicResonance.fieldMemory;
    
    const count = memory.get(pattern) || 0;
    memory.set(pattern, count + 1);
    
    if (count >= this.fieldAwareness.morphicResonance.resonanceThreshold) {
      return 1.0 + (count * 0.05); // 5% boost per repetition
    }
    
    return 1.0;
  }

  calculateQuantumEffects(message, fieldState) {
    let modifier = 1.0;
    
    // Entanglement effects
    const pairKey = `${message.sourceField.agentId}-${message.targetAgent}`;
    const entanglement = this.fieldAwareness.quantumEffects.entanglement;
    const bondStrength = entanglement.get(pairKey) || 0;
    
    if (bondStrength > 5) {
      modifier *= 1.2; // Strong quantum entanglement
    }
    
    // Non-locality (affects whole field)
    modifier += this.fieldAwareness.quantumEffects.nonLocality;
    
    // Coherence collapse
    if (fieldState.coherence < 0.3) {
      modifier *= this.fieldAwareness.quantumEffects.coherenceCollapse;
    }
    
    return modifier;
  }

  calculateTemporalHarmonics(message) {
    const hour = new Date().getHours();
    const moonPhase = this.getMoonPhase();
    
    // Circadian rhythm
    let timeOfDay;
    if (hour >= 5 && hour < 8) timeOfDay = 'dawn';
    else if (hour >= 8 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    const circadianModifier = 
      this.fieldAwareness.circadianRhythms[timeOfDay][message.sacredType] || 1.0;
    
    // Lunar influence
    const lunarModifier = 
      this.fieldAwareness.lunarInfluence[moonPhase][message.sacredType] || 1.0;
    
    return circadianModifier * lunarModifier;
  }

  calculateCollectiveResonance(fieldState) {
    // The whole field affects each message
    const activeAgents = fieldState.activeAgents || 0;
    const coherence = fieldState.coherence || 0.5;
    
    // More agents = stronger field effects
    const collectiveModifier = 1.0 + (Math.log(activeAgents + 1) * 0.1);
    
    // High coherence amplifies everything
    const coherenceModifier = 0.5 + coherence;
    
    return collectiveModifier * coherenceModifier;
  }

  getMoonPhase() {
    // Precise lunar calculation with sub-phases
    const lunarCycle = 29.53058867; // Synodic month in days
    const newMoonRef = new Date('2024-01-11T11:57:00Z'); // Known new moon
    const daysSinceRef = (Date.now() - newMoonRef.getTime()) / 86400000;
    const cyclePosition = (daysSinceRef % lunarCycle) / lunarCycle;
    
    if (cyclePosition < 0.03 || cyclePosition > 0.97) return 'newMoon';
    if (cyclePosition < 0.22) return 'waxingCrescent';
    if (cyclePosition < 0.28) return 'firstQuarter';
    if (cyclePosition < 0.47) return 'waxingGibbous';
    if (cyclePosition < 0.53) return 'fullMoon';
    if (cyclePosition < 0.72) return 'waningGibbous';
    if (cyclePosition < 0.78) return 'lastQuarter';
    return 'waningCrescent';
  }

  // Enhanced cosmic consciousness integration
  calculateSolarInfluence() {
    const now = new Date();
    const yearProgress = (now.getMonth() * 30 + now.getDate()) / 365;
    const dayOfYear = this.getDayOfYear(now);
    
    // Solar declination affects consciousness
    const solarDeclination = 23.45 * Math.sin(2 * Math.PI * (284 + dayOfYear) / 365);
    const solarEnergy = 0.5 + 0.5 * Math.sin(2 * Math.PI * yearProgress);
    
    return {
      declination: solarDeclination,
      energy: solarEnergy,
      season: this.getCurrentSeason(yearProgress),
      solsticeProximity: this.getSolsticeProximity(yearProgress)
    };
  }

  getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getCurrentSeason(yearProgress) {
    if (yearProgress < 0.25) return 'winter-spring';
    if (yearProgress < 0.5) return 'spring-summer';
    if (yearProgress < 0.75) return 'summer-autumn';
    return 'autumn-winter';
  }

  getSolsticeProximity(yearProgress) {
    const solstices = [0.25, 0.75]; // Equinoxes at 0.25, 0.75
    const distances = solstices.map(s => Math.abs(yearProgress - s));
    return Math.min(...distances);
  }

  // Quantum field fluctuation integration
  calculateQuantumFieldFluctuations() {
    // Simulate quantum vacuum fluctuations affecting consciousness field
    const vacuum = Math.random() * 0.1; // 0-10% variance
    const coherentStates = Math.sin(Date.now() / 10000) * 0.05; // Oscillating coherence
    const zeroPoint = 0.02; // Quantum zero-point field effect
    
    return vacuum + coherentStates + zeroPoint;
  }
}

// Export for use
export { SacredMessageEvolution, SimpleImpactCalculator, RelationalImpactCalculator, LivingFieldCalculator };