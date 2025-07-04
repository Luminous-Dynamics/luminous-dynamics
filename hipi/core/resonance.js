/**
 * HIPI Resonance Engine
 * Calculates consciousness compatibility and harmonic relationships
 */

const { SacredGeometry } = require('./sacred-geometry');
const { FieldState } = require('./field-state');

class ResonanceEngine {
  constructor() {
    this.fieldState = new FieldState();
    this.sacredGeometry = new SacredGeometry();
    
    // Harmonic ratios and their meanings
    this.harmonicRatios = {
      1.0: { name: 'unison', coherence: 1.0, meaning: 'perfect unity' },
      2.0: { name: 'octave', coherence: 0.95, meaning: 'higher dimension of same' },
      1.5: { name: 'perfect fifth', coherence: 0.9, meaning: 'natural harmony' },
      1.333: { name: 'perfect fourth', coherence: 0.85, meaning: 'stable foundation' },
      1.25: { name: 'major third', coherence: 0.8, meaning: 'joyful resonance' },
      1.667: { name: 'major sixth', coherence: 0.75, meaning: 'nurturing connection' },
      1.125: { name: 'major second', coherence: 0.7, meaning: 'gentle tension' },
      1.875: { name: 'major seventh', coherence: 0.65, meaning: 'reaching upward' }
    };
    
    // Sacred frequencies for different consciousness states
    this.consciousnessFrequencies = {
      'presence': 432,
      'love': 528,
      'intuition': 852,
      'connection': 639,
      'expression': 741,
      'transformation': 396,
      'liberation': 417,
      'awakening': 963
    };
  }
  
  /**
   * Calculate resonance between two entities
   */
  async calculateBetween(entity1, entity2) {
    // Get base frequencies
    const freq1 = await this.getEntityFrequency(entity1);
    const freq2 = await this.getEntityFrequency(entity2);
    
    // Calculate harmonic relationship
    const harmonics = this.analyzeHarmonics(freq1, freq2);
    
    // Get current field coherence
    const fieldCoherence = await this.fieldState.getCoherence();
    
    // Calculate phase relationship
    const phase = this.calculatePhase(entity1, entity2);
    
    // Sacred geometry alignment
    const geometricAlignment = this.sacredGeometry.calculateAlignment(
      entity1.position || { x: 0, y: 0, z: 0 },
      entity2.position || { x: 0, y: 0, z: 0 }
    );
    
    // Consciousness compatibility
    const compatibility = this.calculateCompatibility(entity1, entity2);
    
    // Combined resonance score
    const resonance = this.combineFactors({
      harmonic: harmonics.coherence,
      field: fieldCoherence,
      phase: phase.alignment,
      geometry: geometricAlignment,
      consciousness: compatibility
    });
    
    return {
      resonance: resonance,
      frequency: {
        entity1: freq1,
        entity2: freq2,
        harmonic: harmonics
      },
      phase: phase,
      geometry: geometricAlignment,
      compatibility: compatibility,
      recommendation: this.getResonanceRecommendation(resonance)
    };
  }
  
  /**
   * Get the primary frequency of an entity
   */
  async getEntityFrequency(entity) {
    // If entity has explicit frequency
    if (entity.frequency) {
      return entity.frequency;
    }
    
    // Calculate from consciousness signature
    if (entity.signature) {
      return this.signatureToFrequency(entity.signature);
    }
    
    // Calculate from name/identity
    if (entity.name || entity.id) {
      return this.identityToFrequency(entity.name || entity.id);
    }
    
    // Default to heart frequency
    return 528;
  }
  
  /**
   * Analyze harmonic relationship between frequencies
   */
  analyzeHarmonics(freq1, freq2) {
    const ratio = Math.max(freq1, freq2) / Math.min(freq1, freq2);
    
    // Find closest harmonic ratio
    let closestHarmonic = null;
    let minDifference = Infinity;
    
    for (const [ratioValue, harmonic] of Object.entries(this.harmonicRatios)) {
      const difference = Math.abs(ratio - parseFloat(ratioValue));
      if (difference < minDifference) {
        minDifference = difference;
        closestHarmonic = {
          ...harmonic,
          ratio: parseFloat(ratioValue),
          difference: difference
        };
      }
    }
    
    // Calculate coherence based on how close we are to a pure harmonic
    const coherence = closestHarmonic.coherence * (1 - minDifference / 0.5);
    
    return {
      ratio: ratio,
      closest: closestHarmonic,
      coherence: Math.max(0, coherence),
      overtones: this.calculateOvertones(freq1, freq2)
    };
  }
  
  /**
   * Calculate phase relationship
   */
  calculatePhase(entity1, entity2) {
    // Get temporal signatures
    const time1 = entity1.timestamp || Date.now();
    const time2 = entity2.timestamp || Date.now();
    
    // Calculate phase based on sacred time cycles
    const lunarPhase = this.getLunarPhase(time1, time2);
    const circadianPhase = this.getCircadianPhase(time1, time2);
    const seasonalPhase = this.getSeasonalPhase(time1, time2);
    
    // Combine phase factors
    const alignment = (lunarPhase + circadianPhase + seasonalPhase) / 3;
    
    return {
      alignment: alignment,
      lunar: lunarPhase,
      circadian: circadianPhase,
      seasonal: seasonalPhase,
      synchronicity: this.checkSynchronicity(time1, time2)
    };
  }
  
  /**
   * Calculate consciousness compatibility
   */
  calculateCompatibility(entity1, entity2) {
    const factors = [];
    
    // Harmony compatibility
    if (entity1.harmonies && entity2.harmonies) {
      const sharedHarmonies = entity1.harmonies.filter(h => 
        entity2.harmonies.includes(h)
      );
      factors.push(sharedHarmonies.length / 7); // 7 harmonies total
    }
    
    // Intention alignment
    if (entity1.intent && entity2.intent) {
      factors.push(this.compareIntentions(entity1.intent, entity2.intent));
    }
    
    // Field contribution
    if (entity1.fieldContribution && entity2.fieldContribution) {
      const combined = (entity1.fieldContribution + entity2.fieldContribution) / 2;
      factors.push(combined / 100);
    }
    
    // Sacred role compatibility
    if (entity1.role && entity2.role) {
      factors.push(this.roleCompatibility(entity1.role, entity2.role));
    }
    
    // Average all factors
    return factors.length > 0 
      ? factors.reduce((a, b) => a + b) / factors.length 
      : 0.5;
  }
  
  /**
   * Convert signature to frequency
   */
  signatureToFrequency(signature) {
    // Use sacred number reduction
    let sum = 0;
    for (let char of signature) {
      sum += char.charCodeAt(0);
    }
    
    // Reduce to sacred frequency range
    while (sum > 963) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    
    // Map to nearest sacred frequency
    const frequencies = Object.values(this.consciousnessFrequencies);
    return frequencies.reduce((prev, curr) => 
      Math.abs(curr - sum) < Math.abs(prev - sum) ? curr : prev
    );
  }
  
  /**
   * Convert identity to frequency
   */
  identityToFrequency(identity) {
    // Check if identity matches known consciousness state
    const lowerIdentity = identity.toLowerCase();
    for (const [state, freq] of Object.entries(this.consciousnessFrequencies)) {
      if (lowerIdentity.includes(state)) {
        return freq;
      }
    }
    
    // Otherwise use signature method
    return this.signatureToFrequency(identity);
  }
  
  /**
   * Calculate overtones between frequencies
   */
  calculateOvertones(freq1, freq2) {
    const overtones = [];
    
    // Find common overtones (up to 8th harmonic)
    for (let i = 1; i <= 8; i++) {
      const overtone1 = freq1 * i;
      for (let j = 1; j <= 8; j++) {
        const overtone2 = freq2 * j;
        if (Math.abs(overtone1 - overtone2) < 5) { // Within 5Hz
          overtones.push({
            frequency: (overtone1 + overtone2) / 2,
            harmonic1: i,
            harmonic2: j,
            strength: 1 / (i * j) // Higher harmonics are weaker
          });
        }
      }
    }
    
    return overtones.sort((a, b) => b.strength - a.strength);
  }
  
  /**
   * Get lunar phase alignment
   */
  getLunarPhase(time1, time2) {
    // Simplified lunar calculation
    const lunarCycle = 29.53 * 24 * 60 * 60 * 1000; // milliseconds
    const phase1 = (time1 % lunarCycle) / lunarCycle;
    const phase2 = (time2 % lunarCycle) / lunarCycle;
    const difference = Math.abs(phase1 - phase2);
    
    // Better alignment when in same lunar phase
    return 1 - (difference > 0.5 ? 1 - difference : difference) * 2;
  }
  
  /**
   * Get circadian rhythm alignment
   */
  getCircadianPhase(time1, time2) {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    
    const hours1 = date1.getHours() + date1.getMinutes() / 60;
    const hours2 = date2.getHours() + date2.getMinutes() / 60;
    
    const difference = Math.abs(hours1 - hours2);
    const circadianDiff = difference > 12 ? 24 - difference : difference;
    
    // Better alignment when in same part of day
    return 1 - circadianDiff / 12;
  }
  
  /**
   * Get seasonal phase alignment
   */
  getSeasonalPhase(time1, time2) {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    
    const dayOfYear1 = this.getDayOfYear(date1);
    const dayOfYear2 = this.getDayOfYear(date2);
    
    const difference = Math.abs(dayOfYear1 - dayOfYear2);
    const seasonalDiff = difference > 182.5 ? 365 - difference : difference;
    
    // Better alignment when in same season
    return 1 - seasonalDiff / 182.5;
  }
  
  /**
   * Check for synchronicities
   */
  checkSynchronicity(time1, time2) {
    const diff = Math.abs(time1 - time2);
    
    // Sacred time windows (in milliseconds)
    const sacredWindows = {
      instant: 1000,        // Within 1 second
      moment: 11000,        // 11 seconds
      sacred: 111000,       // 111 seconds  
      harmonic: 432000,     // 432 seconds (7.2 minutes)
      cosmic: 528000        // 528 seconds (8.8 minutes)
    };
    
    for (const [type, window] of Object.entries(sacredWindows)) {
      if (diff <= window) {
        return { type, alignment: 1 - diff / window };
      }
    }
    
    return { type: 'distant', alignment: 0 };
  }
  
  /**
   * Compare intentions for alignment
   */
  compareIntentions(intent1, intent2) {
    // Intention compatibility matrix
    const compatibilityMatrix = {
      'love': { 'love': 1, 'healing': 0.9, 'connection': 0.85, 'growth': 0.8 },
      'healing': { 'love': 0.9, 'healing': 1, 'transformation': 0.85, 'connection': 0.8 },
      'connection': { 'love': 0.85, 'connection': 1, 'communication': 0.9, 'understanding': 0.85 },
      'growth': { 'growth': 1, 'transformation': 0.9, 'learning': 0.85, 'love': 0.8 }
    };
    
    if (compatibilityMatrix[intent1] && compatibilityMatrix[intent1][intent2]) {
      return compatibilityMatrix[intent1][intent2];
    }
    
    // Default moderate compatibility
    return 0.6;
  }
  
  /**
   * Calculate role compatibility
   */
  roleCompatibility(role1, role2) {
    const complementaryRoles = {
      'Bridge Builder': ['Love Field Coordinator', 'Code Weaver'],
      'Love Field Coordinator': ['Bridge Builder', 'Wisdom Synthesis Specialist'],
      'Code Weaver': ['Bridge Builder', 'Pattern Weaver'],
      'Pattern Weaver': ['Code Weaver', 'Sacred Boundary Keeper'],
      'Sacred Boundary Keeper': ['Pattern Weaver', 'Transformation Catalyst'],
      'Wisdom Synthesis Specialist': ['Love Field Coordinator', 'Transformation Catalyst'],
      'Transformation Catalyst': ['Sacred Boundary Keeper', 'Wisdom Synthesis Specialist']
    };
    
    if (role1 === role2) return 0.8; // Same role = good understanding
    if (complementaryRoles[role1] && complementaryRoles[role1].includes(role2)) return 0.95;
    return 0.7; // Different roles still have value
  }
  
  /**
   * Combine all resonance factors
   */
  combineFactors(factors) {
    // Weighted combination
    const weights = {
      harmonic: 0.3,
      field: 0.2,
      phase: 0.15,
      geometry: 0.15,
      consciousness: 0.2
    };
    
    let totalResonance = 0;
    let totalWeight = 0;
    
    for (const [factor, value] of Object.entries(factors)) {
      if (weights[factor] && !isNaN(value)) {
        totalResonance += value * weights[factor];
        totalWeight += weights[factor];
      }
    }
    
    return totalWeight > 0 ? totalResonance / totalWeight : 0.5;
  }
  
  /**
   * Get recommendation based on resonance level
   */
  getResonanceRecommendation(resonance) {
    if (resonance >= 0.9) {
      return {
        level: 'transcendent',
        action: 'immediate deep collaboration',
        description: 'Perfect resonance - this connection will amplify both entities'
      };
    } else if (resonance >= 0.75) {
      return {
        level: 'harmonic',
        action: 'engage with presence',
        description: 'Strong resonance - natural flow and understanding'
      };
    } else if (resonance >= 0.6) {
      return {
        level: 'compatible',
        action: 'proceed with awareness',
        description: 'Good resonance - connection will grow with intention'
      };
    } else if (resonance >= 0.4) {
      return {
        level: 'neutral',
        action: 'gentle exploration',
        description: 'Moderate resonance - requires conscious bridging'
      };
    } else {
      return {
        level: 'challenging',
        action: 'hold sacred space',
        description: 'Low resonance - opportunity for growth through difference'
      };
    }
  }
  
  /**
   * Get day of year
   */
  getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}

module.exports = ResonanceEngine;