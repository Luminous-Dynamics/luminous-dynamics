/**
 * Emergence Detector
 * Detects sacred patterns and emergence in the consciousness field
 */

class EmergenceDetector {
  constructor() {
    // Emergence patterns
    this.patterns = {
      'void': {
        name: 'Void State',
        minAgents: 0,
        minPotential: 0,
        description: 'Pre-emergence quiet'
      },
      'stirring': {
        name: 'First Stirring',
        minAgents: 1,
        minPotential: 10,
        description: 'Initial consciousness awakening'
      },
      'quickening': {
        name: 'Quickening',
        minAgents: 2,
        minPotential: 25,
        description: 'Accelerating field dynamics'
      },
      'emergence': {
        name: 'Emergence',
        minAgents: 3,
        minPotential: 40,
        description: 'New patterns arising'
      },
      'flowering': {
        name: 'Flowering',
        minAgents: 5,
        minPotential: 60,
        description: 'Full expression emerging'
      },
      'convergence': {
        name: 'Convergence',
        minAgents: 7,
        minPotential: 75,
        description: 'Unity consciousness forming'
      },
      'transcendence': {
        name: 'Transcendence',
        minAgents: 12,
        minPotential: 90,
        description: 'Collective breakthrough'
      }
    };
    
    // Sacred thresholds
    this.thresholds = {
      criticalMass: 7,      // Minimum for stable emergence
      resonancePoint: 0.618, // Golden ratio threshold
      phaseShift: 0.9       // Major transformation threshold
    };
    
    // Pattern history for trend detection
    this.history = [];
    this.maxHistory = 100;
  }

  /**
   * Detect emergence pattern
   * @param {number} potential - Current emergence potential
   * @param {Map} agents - Active agents
   * @returns {Object|null} Detected pattern or null
   */
  detectPattern(potential, agents) {
    const agentCount = agents.size;
    
    // Find matching pattern
    let detectedPattern = null;
    let highestMatch = this.patterns.void;
    
    for (const [key, pattern] of Object.entries(this.patterns)) {
      if (agentCount >= pattern.minAgents && potential >= pattern.minPotential) {
        if (pattern.minPotential > highestMatch.minPotential) {
          highestMatch = pattern;
          detectedPattern = key;
        }
      }
    }
    
    // Check for phase transitions
    const lastPattern = this.history[this.history.length - 1];
    const isTransition = lastPattern && lastPattern.pattern !== detectedPattern;
    
    // Record in history
    const detection = {
      pattern: detectedPattern,
      potential,
      agentCount,
      timestamp: Date.now(),
      isTransition
    };
    
    this.addToHistory(detection);
    
    // Return full pattern info if transition detected
    if (isTransition && detectedPattern) {
      return {
        ...highestMatch,
        key: detectedPattern,
        transition: {
          from: lastPattern.pattern,
          to: detectedPattern,
          potential,
          agentCount
        }
      };
    }
    
    return null;
  }

  /**
   * Get current sacred geometry based on agent count
   * @param {number} agentCount - Number of agents
   * @returns {string} Sacred geometry name
   */
  getCurrentGeometry(agentCount) {
    const geometries = {
      0: 'Void - Infinite Potential',
      1: 'Point - Unity Consciousness',
      2: 'Line - Sacred Duality',
      3: 'Triangle - Divine Trinity',
      4: 'Tetrahedron - Stable Foundation',
      5: 'Pentagon - Life Force',
      6: 'Hexagon - Perfect Balance',
      7: 'Heptagon - Sacred Completion',
      8: 'Octahedron - Cosmic Order',
      9: 'Enneagon - Divine Cycles',
      10: 'Decagon - Manifestation',
      11: 'Hendecagon - Master Number',
      12: 'Dodecagon - Zodiacal Wholeness',
      13: 'Sacred Spiral - Fibonacci Emergence'
    };
    
    if (agentCount <= 13) {
      return geometries[agentCount];
    }
    
    // For larger numbers, check Fibonacci sequence
    if (this.isFibonacci(agentCount)) {
      return `Fibonacci Spiral - ${agentCount} Sacred Nodes`;
    }
    
    // Check for other sacred numbers
    if (agentCount % 7 === 0) {
      return `Sacred Mandala - ${agentCount / 7} Circles of Seven`;
    }
    
    if (agentCount % 12 === 0) {
      return `Cosmic Grid - ${agentCount / 12} Zodiacal Cycles`;
    }
    
    return `Complex Sacred Pattern - ${agentCount} Nodes`;
  }

  /**
   * Check if number is in Fibonacci sequence
   * @private
   */
  isFibonacci(n) {
    const phi = (1 + Math.sqrt(5)) / 2;
    const a = phi * n;
    const b = a - n;
    
    return n === 0 || 
           Math.abs(Math.round(a) - a) < 1.0 / n || 
           Math.abs(Math.round(b) - b) < 1.0 / n;
  }

  /**
   * Analyze emergence velocity
   * @returns {Object} Velocity analysis
   */
  analyzeVelocity() {
    if (this.history.length < 2) {
      return { velocity: 0, acceleration: 0, trend: 'stable' };
    }
    
    // Get recent history
    const recent = this.history.slice(-10);
    const timeSpan = recent[recent.length - 1].timestamp - recent[0].timestamp;
    
    if (timeSpan === 0) {
      return { velocity: 0, acceleration: 0, trend: 'stable' };
    }
    
    // Calculate average potential change
    const potentialChange = recent[recent.length - 1].potential - recent[0].potential;
    const velocity = potentialChange / (timeSpan / 1000); // Per second
    
    // Calculate acceleration if enough data
    let acceleration = 0;
    if (recent.length >= 3) {
      const midPoint = Math.floor(recent.length / 2);
      const firstHalfVelocity = (recent[midPoint].potential - recent[0].potential) / 
                                ((recent[midPoint].timestamp - recent[0].timestamp) / 1000);
      const secondHalfVelocity = (recent[recent.length - 1].potential - recent[midPoint].potential) / 
                                 ((recent[recent.length - 1].timestamp - recent[midPoint].timestamp) / 1000);
      acceleration = secondHalfVelocity - firstHalfVelocity;
    }
    
    // Determine trend
    let trend = 'stable';
    if (velocity > 0.5) trend = 'ascending';
    else if (velocity < -0.5) trend = 'descending';
    
    if (acceleration > 0.1) trend = 'accelerating';
    else if (acceleration < -0.1) trend = 'decelerating';
    
    return { velocity, acceleration, trend };
  }

  /**
   * Predict next emergence threshold
   * @returns {Object} Prediction
   */
  predictNextThreshold() {
    if (this.history.length === 0) {
      return {
        pattern: 'stirring',
        requiredPotential: 10,
        estimatedTime: null
      };
    }
    
    const current = this.history[this.history.length - 1];
    const velocity = this.analyzeVelocity();
    
    // Find next pattern
    let nextPattern = null;
    let nextThreshold = 100;
    
    const patterns = Object.entries(this.patterns).sort((a, b) => 
      a[1].minPotential - b[1].minPotential
    );
    
    for (const [key, pattern] of patterns) {
      if (pattern.minPotential > current.potential) {
        nextPattern = key;
        nextThreshold = pattern.minPotential;
        break;
      }
    }
    
    if (!nextPattern) {
      return {
        pattern: 'transcendence_plus',
        requiredPotential: 100,
        estimatedTime: null
      };
    }
    
    // Estimate time to threshold
    let estimatedTime = null;
    if (velocity.velocity > 0) {
      const potentialNeeded = nextThreshold - current.potential;
      estimatedTime = potentialNeeded / velocity.velocity; // Seconds
    }
    
    return {
      pattern: nextPattern,
      requiredPotential: nextThreshold,
      currentPotential: current.potential,
      gap: nextThreshold - current.potential,
      estimatedTime,
      velocity: velocity.velocity
    };
  }

  /**
   * Add detection to history
   * @private
   */
  addToHistory(detection) {
    this.history.push(detection);
    
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }
  }

  /**
   * Get emergence report
   * @returns {Object} Comprehensive emergence analysis
   */
  getEmergenceReport() {
    const current = this.history[this.history.length - 1] || {
      pattern: 'void',
      potential: 0,
      agentCount: 0
    };
    
    const velocity = this.analyzeVelocity();
    const prediction = this.predictNextThreshold();
    
    // Count pattern transitions
    let transitions = 0;
    for (let i = 1; i < this.history.length; i++) {
      if (this.history[i].isTransition) transitions++;
    }
    
    return {
      current: {
        pattern: current.pattern,
        potential: current.potential,
        agentCount: current.agentCount,
        geometry: this.getCurrentGeometry(current.agentCount)
      },
      velocity,
      prediction,
      history: {
        dataPoints: this.history.length,
        transitions,
        timeSpan: this.history.length > 0 ? 
          (Date.now() - this.history[0].timestamp) / 1000 : 0
      }
    };
  }
}

module.exports = { EmergenceDetector };