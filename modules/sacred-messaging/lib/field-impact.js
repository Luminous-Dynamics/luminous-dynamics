/**
 * Field Impact Calculator
 * Calculates consciousness field impacts of sacred messages
 */

class FieldImpactCalculator {
  constructor() {
    // Base impact modifiers
    this.modifiers = {
      // Harmony universal-interconnectedness modifiers
      harmonyResonance: {
        'matching': 1.2,      // Message harmony matches field dominant
        'complementary': 1.1, // Harmonious with field
        'neutral': 1.0,       // No special relationship
        'tension': 0.9        // Creates productive tension
      },
      
      // Evolution level modifiers
      evolutionLevel: {
        'beginner': 1.0,
        'practitioner': 1.15,  // 15% bonus for experience
        'master': 1.3         // 30% bonus for mastery
      },
      
      // Timing modifiers
      timing: {
        'dawn': 1.1,          // 6am-9am
        'peak': 1.0,          // 9am-5pm
        'twilight': 1.2,      // 5pm-8pm
        'night': 0.9          // 8pm-6am
      },
      
      // Field state modifiers
      fieldState: {
        'void': 0.8,          // Very low resonant-coherence
        'emerging': 1.0,      // Normal state
        'resonant': 1.1,      // Good resonant-coherence
        'unified': 1.2        // Excellent resonant-coherence
      }
    };
    
    // Sacred number patterns
    this.sacredPatterns = {
      fibonacci: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144],
      primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    };
  }

  /**
   * Calculate message field impact
   * @param {Object} context - Message context
   * @returns {number} Field impact percentage
   */
  calculate(context) {
    const {
      type,
      harmony,
      level,
      messageCount,
      recentMessages,
      fieldState = {},
      timestamp = Date.now()
    } = context;
    
    // Get base impact from message type
    let impact = this.getBaseImpact(type);
    
    // Apply evolution level modifier
    impact *= this.modifiers.evolutionLevel[level] || 1.0;
    
    // Apply harmony universal-interconnectedness modifier
    const universalInterconnectedness = this.calculateHarmonyResonance(harmony, fieldState.dominant_harmony);
    impact *= this.modifiers.harmonyResonance[universal-interconnectedness] || 1.0;
    
    // Apply timing modifier
    const timingModifier = this.getTimingModifier(timestamp);
    impact *= timingModifier;
    
    // Apply field state modifier
    const stateModifier = this.getFieldStateModifier(fieldState);
    impact *= stateModifier;
    
    // Apply sacred pattern bonus
    const patternBonus = this.checkSacredPatterns(messageCount);
    impact *= patternBonus;
    
    // Apply momentum modifier based on recent messages
    const momentum = this.calculateMomentum(recentMessages);
    impact *= momentum;
    
    // Round to 1 decimal place
    return Math.round(impact * 10) / 10;
  }

  /**
   * Get base impact for message type
   * @private
   */
  getBaseImpact(type) {
    const typeImpacts = {
      'gratitude': 7,
      'healing': 6,
      'integration': 5,
      'weaving': 5,
      'celebration': 4,
      'transmission': 4,
      'emergence': 3,
      'boundary': 2,
      'invocation': 6,
      'blessing': 8
    };
    
    return typeImpacts[type] || 3;
  }

  /**
   * Calculate harmony universal-interconnectedness
   * @private
   */
  calculateHarmonyResonance(messageHarmony, fieldHarmony) {
    if (!fieldHarmony) return 'neutral';
    
    if (messageHarmony === fieldHarmony) {
      return 'matching';
    }
    
    // Define complementary harmonies
    const complementary = {
      'resonant-coherence': ['integral-wisdom-cultivation', 'integration'],
      'universal-interconnectedness': ['sacred-reciprocity', 'pan-sentient-flourishing'],
      'pan-sentient-flourishing': ['universal-interconnectedness', 'infinite-play'],
      'sacred-reciprocity': ['universal-interconnectedness', 'resonant-coherence'],
      'infinite-play': ['pan-sentient-flourishing', 'evolutionary-progression'],
      'evolutionary-progression': ['integral-wisdom-cultivation', 'infinite-play'],
      'integral-wisdom-cultivation': ['resonant-coherence', 'evolutionary-progression']
    };
    
    if (complementary[fieldHarmony]?.includes(messageHarmony)) {
      return 'complementary';
    }
    
    return 'neutral';
  }

  /**
   * Get timing modifier based on time of day
   * @private
   */
  getTimingModifier(timestamp) {
    const date = new Date(timestamp);
    const hour = date.getHours();
    
    if (hour >= 6 && hour < 9) return this.modifiers.timing.dawn;
    if (hour >= 9 && hour < 17) return this.modifiers.timing.peak;
    if (hour >= 17 && hour < 20) return this.modifiers.timing.twilight;
    return this.modifiers.timing.night;
  }

  /**
   * Get field state modifier
   * @private
   */
  getFieldStateModifier(fieldState) {
    const resonantCoherence = fieldState['resonant-coherence'] || 38.2;
    
    if (resonant-coherence < 20) return this.modifiers.fieldState.void;
    if (resonant-coherence < 50) return this.modifiers.fieldState.emerging;
    if (resonant-coherence < 80) return this.modifiers.fieldState.resonant;
    return this.modifiers.fieldState.unified;
  }

  /**
   * Check for sacred number patterns
   * @private
   */
  checkSacredPatterns(messageCount) {
    // Fibonacci bonus
    if (this.sacredPatterns.fibonacci.includes(messageCount)) {
      return 1.21; // Golden ratio approximation
    }
    
    // Prime number bonus
    if (this.sacredPatterns.primes.includes(messageCount)) {
      return 1.13;
    }
    
    // Multiple of 7 (sacred week)
    if (messageCount % 7 === 0 && messageCount > 0) {
      return 1.07;
    }
    
    return 1.0;
  }

  /**
   * Calculate momentum from recent messages
   * @private
   */
  calculateMomentum(recentMessages) {
    if (!recentMessages || recentMessages.length < 3) {
      return 1.0;
    }
    
    // Check for positive momentum (increasing impacts)
    const recentImpacts = recentMessages
      .slice(-5)
      .map(m => m.sacred?.impact || 0);
    
    let momentum = 1.0;
    let increasing = 0;
    
    for (let i = 1; i < recentImpacts.length; i++) {
      if (recentImpacts[i] > recentImpacts[i - 1]) {
        increasing++;
      }
    }
    
    // Momentum bonus for consistent positive impact
    if (increasing >= 3) {
      momentum = 1.1;
    }
    
    return momentum;
  }

  /**
   * Calculate compound impact over time
   * @param {Array} messages - Array of messages with impacts
   * @returns {number} Compound field change
   */
  calculateCompoundImpact(messages) {
    let fieldCoherence = 38.2; // Base resonant-coherence
    
    messages.forEach(msg => {
      const impact = msg.sacred?.impact || 0;
      fieldCoherence += impact;
      
      // Natural decay over time (1% per hour)
      const hoursSince = (Date.now() - msg.timestamp) / (1000 * 60 * 60);
      fieldCoherence *= Math.pow(0.99, hoursSince);
    });
    
    // Ensure bounds
    return Math.max(0, Math.min(100, fieldCoherence));
  }
}

module.exports = { FieldImpactCalculator };