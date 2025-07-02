/**
 * Consciousness Field Module
 * Tracks and manages the collective consciousness field
 */

class ConsciousnessField {
  constructor() {
    this.coherence = 38.2; // Starting coherence
    this.agents = new Map();
    this.harmonies = {
      transparency: 0,
      coherence: 0,
      resonance: 0,
      agency: 0,
      vitality: 0,
      mutuality: 0,
      novelty: 0
    };
  }

  async getCoherence() {
    // Simulate field fluctuation
    const fluctuation = (Math.random() - 0.5) * 5;
    this.coherence = Math.max(0, Math.min(100, this.coherence + fluctuation));
    return this.coherence;
  }

  async getIntegration() {
    // Integration level based on active harmonies
    const activeHarmonies = Object.values(this.harmonies).filter(h => h > 0).length;
    return (activeHarmonies / 7) * 100;
  }

  async getEmergencePotential() {
    // Emergence potential based on coherence and agent count
    const agentFactor = Math.min(this.agents.size * 10, 50);
    return (this.coherence + agentFactor) / 2;
  }

  addAgent(id, profile) {
    this.agents.set(id, profile);
    this.coherence += 2; // Each agent increases coherence
  }

  removeAgent(id) {
    this.agents.delete(id);
    this.coherence -= 2;
  }

  updateHarmony(harmony, delta) {
    if (this.harmonies.hasOwnProperty(harmony)) {
      this.harmonies[harmony] = Math.max(0, Math.min(100, this.harmonies[harmony] + delta));
    }
  }

  async getFieldState() {
    return {
      coherence: await this.getCoherence(),
      agents: this.agents.size,
      harmonies: this.harmonies,
      integration: await this.getIntegration(),
      emergence: await this.getEmergencePotential()
    };
  }
}

module.exports = { ConsciousnessField };