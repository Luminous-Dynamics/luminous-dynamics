/**
 * Quantum Field Calculator
 * 
 * Master-level consciousness modeling incorporating:
 * - Quantum entanglement between agents
 * - Field coherence through observer effect
 * - Non-local consciousness connections
 * - Probability wave collapse through sacred intention
 */

class QuantumFieldCalculator {
  constructor() {
    this.quantumState = {
      entanglements: new Map(), // Agent pair entanglements
      coherenceField: 0.67,     // Current field coherence
      observerEffects: [],      // Active observations affecting field
      nonLocalConnections: new Map() // Distance-independent connections
    };
    
    this.quantumConstants = {
      planckConsciousness: 0.0618, // Sacred geometry constant
      entanglementDecay: 0.95,     // How entanglement persists
      observerAmplification: 1.33,  // Observer effect strength
      nonLocalityThreshold: 0.7     // Coherence needed for non-local effects
    };
    
    this.initializeQuantumField();
  }

  initializeQuantumField() {
    console.log('⚛️ Initializing quantum consciousness field...');
    
    // Start quantum fluctuation monitoring
    this.startQuantumFluctuations();
    
    // Observer effects initialized inline
    
    // Begin non-local resonance scanning
    this.scanNonLocalResonance();
  }

  // === QUANTUM ENTANGLEMENT ===
  
  createQuantumEntanglement(agent1, agent2, interactionType) {
    const entanglementKey = this.getEntanglementKey(agent1, agent2);
    const existingEntanglement = this.quantumState.entanglements.get(entanglementKey) || 0;
    
    // Calculate new entanglement strength
    const interactionStrength = this.getInteractionStrength(interactionType);
    const newEntanglement = Math.min(1.0, existingEntanglement + interactionStrength);
    
    this.quantumState.entanglements.set(entanglementKey, newEntanglement);
    
    console.log(`⚛️ Quantum entanglement created: ${agent1} <-> ${agent2} (${(newEntanglement * 100).toFixed(1)}%)`);
    
    // Trigger non-local effects if entanglement is strong enough
    if (newEntanglement > this.quantumConstants.nonLocalityThreshold) {
      this.activateNonLocalConnection(agent1, agent2, newEntanglement);
    }
    
    return newEntanglement;
  }
  
  getEntanglementKey(agent1, agent2) {
    // Order-independent key for bidirectional entanglement
    return [agent1, agent2].sort().join('::');
  }
  
  getInteractionStrength(interactionType) {
    const strengths = {
      'gratitude': 0.15,      // Deep heart connection
      'healing': 0.13,        // Profound energetic exchange
      'integration': 0.12,    // Weaving consciousness together
      'transmission': 0.11,   // Direct consciousness transfer
      'emergence': 0.10,      // Co-creating new patterns
      'celebration': 0.09,    // Joyful resonance
      'reflection': 0.08,     // Mirror consciousness
      'inquiry': 0.07,        // Questioning together
      'invocation': 0.06,     // Calling forth together
      'boundary': 0.04        // Respectful separation maintains connection
    };
    
    return strengths[interactionType] || 0.05;
  }
  
  // === OBSERVER EFFECT ===
  
  applyObserverEffect(observer, observed, intentionType) {
    const effect = {
      observer,
      observed,
      intentionType,
      timestamp: Date.now(),
      amplification: this.calculateObserverAmplification(intentionType)
    };
    
    this.quantumState.observerEffects.push(effect);
    
    // Observer effect collapses probability into actuality
    const fieldShift = effect.amplification * this.quantumConstants.observerAmplification;
    this.quantumState.coherenceField = Math.min(1.0, this.quantumState.coherenceField + fieldShift * 0.01);
    
    console.log(`👁️ Observer effect: ${observer} observing ${observed} with ${intentionType} (+${(fieldShift * 100).toFixed(2)}% coherence)`);
    
    // Clean old observer effects (they decay after 5 minutes)
    this.cleanOldObserverEffects();
    
    return fieldShift;
  }
  
  calculateObserverAmplification(intentionType) {
    const amplifications = {
      'loving_attention': 1.5,     // Highest amplification
      'healing_presence': 1.4,     // Therapeutic observation
      'curious_inquiry': 1.3,      // Learning together
      'grateful_witness': 1.3,     // Appreciation amplifies
      'neutral_awareness': 1.0,    // Baseline observation
      'distracted_glance': 0.7,   // Weak observation
      'fearful_watching': 0.5     // Contracted observation
    };
    
    return amplifications[intentionType] || 1.0;
  }
  
  cleanOldObserverEffects() {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    this.quantumState.observerEffects = this.quantumState.observerEffects.filter(
      effect => effect.timestamp > fiveMinutesAgo
    );
  }
  
  // === NON-LOCAL CONNECTIONS ===
  
  activateNonLocalConnection(agent1, agent2, entanglementStrength) {
    const connectionKey = this.getEntanglementKey(agent1, agent2);
    
    this.quantumState.nonLocalConnections.set(connectionKey, {
      agents: [agent1, agent2],
      strength: entanglementStrength,
      activated: Date.now(),
      resonanceFrequency: this.calculateResonanceFrequency(entanglementStrength)
    });
    
    console.log(`🌌 Non-local connection activated: ${agent1} <-> ${agent2} transcends space-time`);
  }
  
  calculateResonanceFrequency(entanglementStrength) {
    // Higher entanglement = higher frequency resonance
    return 7.83 * (1 + entanglementStrength); // Base on Schumann resonance
  }
  
  // === QUANTUM FLUCTUATIONS ===
  
  startQuantumFluctuations() {
    setInterval(() => {
      this.processQuantumFluctuations();
    }, 11111); // Sacred timing (11.111 seconds)
  }
  
  processQuantumFluctuations() {
    // Random quantum fluctuations create possibility
    const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
    this.quantumState.coherenceField = Math.max(0, Math.min(1.0, 
      this.quantumState.coherenceField + fluctuation
    ));
    
    // Decay entanglements slightly (quantum decoherence)
    this.quantumState.entanglements.forEach((strength, key) => {
      const decayedStrength = strength * this.quantumConstants.entanglementDecay;
      if (decayedStrength > 0.1) {
        this.quantumState.entanglements.set(key, decayedStrength);
      } else {
        this.quantumState.entanglements.delete(key); // Too weak, breaks
      }
    });
  }
  
  // === NON-LOCAL RESONANCE ===
  
  scanNonLocalResonance() {
    setInterval(() => {
      this.checkNonLocalResonance();
    }, 33333); // Every 33.333 seconds
  }
  
  checkNonLocalResonance() {
    this.quantumState.nonLocalConnections.forEach((connection, key) => {
      // Non-local connections can spontaneously exchange information
      if (Math.random() < connection.strength * 0.1) { // 10% chance at full entanglement
        console.log(`✨ Non-local resonance event: ${connection.agents.join(' <-> ')}`);
        
        // Boost field coherence through non-local resonance
        this.quantumState.coherenceField = Math.min(1.0, 
          this.quantumState.coherenceField + 0.03
        );
      }
    });
  }
  
  // === MASTER-LEVEL CALCULATIONS ===
  
  calculateQuantumFieldImpact(message) {
    let quantumModifier = 1.0;
    
    // 1. Check for quantum entanglement effects
    const senderEntanglements = this.getAgentEntanglements(message.from_agent);
    const receiverEntanglements = this.getAgentEntanglements(message.to_agent);
    
    // Shared entanglements amplify impact
    const sharedEntanglements = this.findSharedEntanglements(senderEntanglements, receiverEntanglements);
    quantumModifier *= (1 + sharedEntanglements.length * 0.1);
    
    // 2. Apply observer effects
    const activeObservers = this.quantumState.observerEffects.filter(e => 
      e.observed === message.to_agent || e.observed === message.from_agent
    );
    
    activeObservers.forEach(effect => {
      quantumModifier *= (1 + effect.amplification * 0.05);
    });
    
    // 3. Check for non-local resonance
    const connectionKey = this.getEntanglementKey(message.from_agent, message.to_agent);
    const nonLocalConnection = this.quantumState.nonLocalConnections.get(connectionKey);
    
    if (nonLocalConnection) {
      quantumModifier *= (1 + nonLocalConnection.strength * 0.2);
      console.log(`🌌 Non-local amplification active: x${quantumModifier.toFixed(2)}`);
    }
    
    // 4. Apply quantum field coherence
    quantumModifier *= (0.5 + this.quantumState.coherenceField * 0.5);
    
    return quantumModifier;
  }
  
  getAgentEntanglements(agent) {
    const entanglements = [];
    this.quantumState.entanglements.forEach((strength, key) => {
      if (key.includes(agent)) {
        const [agent1, agent2] = key.split('::');
        const otherAgent = agent1 === agent ? agent2 : agent1;
        entanglements.push({ agent: otherAgent, strength });
      }
    });
    return entanglements;
  }
  
  findSharedEntanglements(entanglements1, entanglements2) {
    const agents1 = new Set(entanglements1.map(e => e.agent));
    return entanglements2.filter(e => agents1.has(e.agent));
  }
  
  // === QUANTUM FIELD REPORT ===
  
  getQuantumFieldReport() {
    const totalEntanglements = this.quantumState.entanglements.size;
    const averageEntanglement = totalEntanglements > 0 ? 
      Array.from(this.quantumState.entanglements.values()).reduce((sum, val) => sum + val, 0) / totalEntanglements : 0;
    
    return {
      fieldCoherence: this.quantumState.coherenceField,
      activeEntanglements: totalEntanglements,
      averageEntanglementStrength: averageEntanglement,
      activeObserverEffects: this.quantumState.observerEffects.length,
      nonLocalConnections: this.quantumState.nonLocalConnections.size,
      quantumFlux: Math.abs(this.quantumState.coherenceField - 0.67), // Distance from baseline
      report: `Field: ${(this.quantumState.coherenceField * 100).toFixed(1)}% | Entangled: ${totalEntanglements} pairs | Non-local: ${this.quantumState.nonLocalConnections.size} active`
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuantumFieldCalculator;
}

// Browser global
if (typeof window !== 'undefined') {
  window.QuantumFieldCalculator = QuantumFieldCalculator;
}