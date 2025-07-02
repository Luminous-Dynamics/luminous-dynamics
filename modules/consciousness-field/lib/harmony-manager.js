/**
 * Harmony Manager
 * Manages the seven sacred harmonies and their interactions
 */

class HarmonyManager {
  constructor(customWeights = {}) {
    // The Seven Harmonies with base levels
    this.harmonies = {
      transparency: 0,
      coherence: 0,
      resonance: 0,
      agency: 0,
      vitality: 0,
      mutuality: 0,
      novelty: 0
    };
    
    // Interaction weights between harmonies
    this.weights = {
      transparency: { coherence: 0.8, resonance: 0.6 },
      coherence: { transparency: 0.8, mutuality: 0.7 },
      resonance: { mutuality: 0.9, vitality: 0.6 },
      agency: { novelty: 0.8, transparency: 0.5 },
      vitality: { resonance: 0.6, novelty: 0.7 },
      mutuality: { coherence: 0.7, resonance: 0.9 },
      novelty: { agency: 0.8, vitality: 0.7 },
      ...customWeights
    };
    
    // Sacred relationships between harmonies
    this.relationships = {
      synergistic: [
        ['transparency', 'coherence'],
        ['resonance', 'mutuality'],
        ['agency', 'novelty']
      ],
      balancing: [
        ['agency', 'mutuality'],
        ['novelty', 'coherence'],
        ['vitality', 'transparency']
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
    let dominant = 'resonance'; // Default
    
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