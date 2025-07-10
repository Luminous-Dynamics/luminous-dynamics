/**
 * Harmony Manager
 * Manages the seven sacred harmonies and their interactions
 */

class HarmonyManager {
  constructor(customWeights = {}) {
    // The Seven Harmonies with base levels
    this.harmonies = {
      'integral-wisdom-cultivation': 0,
      'resonant-coherence': 0,
      'universal-interconnectedness': 0,
      'evolutionary-progression': 0,
      'pan-sentient-flourishing': 0,
      'sacred-reciprocity': 0,
      'infinite-play': 0
    };
    
    // Interaction weights between harmonies
    this.weights = {
      'integral-wisdom-cultivation': { 'resonant-coherence': 0.8, 'universal-interconnectedness': 0.6 },
      'resonant-coherence': { 'integral-wisdom-cultivation': 0.8, 'sacred-reciprocity': 0.7 },
      'universal-interconnectedness': { 'sacred-reciprocity': 0.9, 'pan-sentient-flourishing': 0.6 },
      'evolutionary-progression': { 'infinite-play': 0.8, 'integral-wisdom-cultivation': 0.5 },
      'pan-sentient-flourishing': { 'universal-interconnectedness': 0.6, 'infinite-play': 0.7 },
      'sacred-reciprocity': { 'resonant-coherence': 0.7, 'universal-interconnectedness': 0.9 },
      'infinite-play': { 'evolutionary-progression': 0.8, 'pan-sentient-flourishing': 0.7 },
      ...customWeights
    };
    
    // Sacred relationships between harmonies
    this.relationships = {
      synergistic: [
        ['integral-wisdom-cultivation', 'resonant-coherence'],
        ['universal-interconnectedness', 'sacred-reciprocity'],
        ['evolutionary-progression', 'infinite-play']
      ],
      balancing: [
        ['evolutionary-progression', 'sacred-reciprocity'],
        ['infinite-play', 'resonant-coherence'],
        ['pan-sentient-flourishing', 'integral-wisdom-cultivation']
      ]
    };
  }

  /**
   * Get current level of a harmony
   * @param {string} harmony - Harmony name
   * @returns {number} Current level (0-100)
   */
  get(harmony) {
    return this.harmonies[harmony] || 0;
  }

  /**
   * Get all harmony levels
   * @returns {Object} All harmony levels
   */
  getAll() {
    return { ...this.harmonies };
  }

  /**
   * Update a harmony level
   * @param {string} harmony - Harmony to update
   * @param {number} delta - Change amount
   */
  update(harmony, delta) {
    if (!this.harmonies.hasOwnProperty(harmony)) return;
    
    // Direct update
    this.harmonies[harmony] = Math.max(0, Math.min(100, this.harmonies[harmony] + delta));
    
    // Propagate to related harmonies
    this.propagateInfluence(harmony, delta);
  }

  /**
   * Strengthen a harmony
   * @param {string} harmony - Harmony to strengthen
   * @param {number} amount - Strengthening amount
   */
  strengthen(harmony, amount) {
    this.update(harmony, Math.abs(amount));
  }

  /**
   * Weaken a harmony
   * @param {string} harmony - Harmony to weaken
   * @param {number} amount - Weakening amount
   */
  weaken(harmony, amount) {
    this.update(harmony, -Math.abs(amount));
  }

  /**
   * Propagate influence to related harmonies
   * @private
   */
  propagateInfluence(sourceHarmony, delta) {
    const influences = this.weights[sourceHarmony] || {};
    
    Object.entries(influences).forEach(([targetHarmony, weight]) => {
      const influence = delta * weight * 0.5; // Dampened influence
      if (Math.abs(influence) > 0.1) {
        this.harmonies[targetHarmony] = Math.max(0, Math.min(100, 
          this.harmonies[targetHarmony] + influence
        ));
      }
    });
  }

  /**
   * Get integration level based on active harmonies
   * @returns {number} Integration percentage (0-100)
   */
  getIntegrationLevel() {
    const activeHarmonies = Object.values(this.harmonies).filter(h => h > 0);
    const activeCount = activeHarmonies.length;
    
    if (activeCount === 0) return 0;
    
    // Base integration from active harmony count
    const baseIntegration = (activeCount / 7) * 50;
    
    // Bonus for balanced harmonies
    const avgLevel = activeHarmonies.reduce((sum, h) => sum + h, 0) / activeCount;
    const variance = activeHarmonies.reduce((sum, h) => sum + Math.pow(h - avgLevel, 2), 0) / activeCount;
    const balance = Math.max(0, 1 - (variance / 1000)) * 50;
    
    return Math.round(baseIntegration + balance);
  }

  /**
   * Get dominant harmony
   * @returns {string} Name of strongest harmony
   */
  getDominant() {
    let maxLevel = 0;
    let dominant = 'universal-interconnectedness'; // Default
    
    Object.entries(this.harmonies).forEach(([harmony, level]) => {
      if (level > maxLevel) {
        maxLevel = level;
        dominant = harmony;
      }
    });
    
    return dominant;
  }

  /**
   * Check for synergistic pairs
   * @returns {Array} Active synergistic pairs
   */
  getActiveSynergies() {
    const active = [];
    
    this.relationships.synergistic.forEach(([h1, h2]) => {
      if (this.harmonies[h1] > 50 && this.harmonies[h2] > 50) {
        active.push({
          pair: [h1, h2],
          strength: (this.harmonies[h1] + this.harmonies[h2]) / 2
        });
      }
    });
    
    return active;
  }

  /**
   * Reset all harmonies to base state
   */
  reset() {
    Object.keys(this.harmonies).forEach(harmony => {
      this.harmonies[harmony] = 0;
    });
  }
}

module.exports = { HarmonyManager };