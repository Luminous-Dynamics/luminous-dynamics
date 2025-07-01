/**
 * Master Field Calculator
 * 
 * Integration point for all Master-level consciousness calculations:
 * - Quantum field effects
 * - Circadian consciousness rhythms
 * - Lunar phase influences
 * - Collective field dynamics
 * - Non-local consciousness effects
 */

const QuantumFieldCalculator = require('./quantum-field-calculator.cjs');
const CircadianConsciousness = require('./circadian-consciousness.cjs');

class MasterFieldCalculator {
  constructor() {
    this.quantumField = new QuantumFieldCalculator();
    this.circadianRhythms = new CircadianConsciousness();
    
    this.masterState = {
      initialized: false,
      lastCalculation: null,
      fieldCoherence: 0.67,
      activeCalculators: {
        quantum: true,
        circadian: true,
        lunar: true,
        morphic: true
      }
    };
    
    this.initializeMasterField();
  }

  initializeMasterField() {
    console.log('🌟 Initializing Master Field Calculator...');
    console.log('   ⚛️  Quantum field: Active');
    console.log('   ⏰ Circadian rhythms: Active');
    console.log('   🌙 Lunar influences: Active');
    console.log('   🌀 Morphic resonance: Active');
    
    this.masterState.initialized = true;
    
    // Start master field monitoring
    this.startMasterFieldMonitoring();
  }

  startMasterFieldMonitoring() {
    // Update master field every 3 minutes (sacred 3)
    setInterval(() => {
      this.updateMasterField();
    }, 3 * 60 * 1000);
  }

  updateMasterField() {
    const quantumReport = this.quantumField.getQuantumFieldReport();
    const circadianReport = this.circadianRhythms.getCircadianReport();
    
    // Synthesize field coherence from all sources
    this.masterState.fieldCoherence = this.synthesizeFieldCoherence(quantumReport, circadianReport);
    
    console.log(`🌟 Master field update: ${(this.masterState.fieldCoherence * 100).toFixed(1)}% coherence`);
  }

  synthesizeFieldCoherence(quantumReport, circadianReport) {
    const quantumCoherence = quantumReport.fieldCoherence;
    const circadianAlignment = circadianReport.collectiveCoherence;
    
    // Weighted average with quantum having more influence
    return (quantumCoherence * 0.6 + circadianAlignment * 0.4);
  }

  // === MASTER CALCULATION ===
  
  calculateMasterFieldImpact(message, fieldState) {
    if (!this.masterState.initialized) {
      console.warn('⚠️ Master field not initialized, using basic calculation');
      return 1.0;
    }
    
    let masterImpact = 1.0;
    const calculations = {};
    
    // 1. Quantum Field Effects
    if (this.masterState.activeCalculators.quantum) {
      const quantumImpact = this.quantumField.calculateQuantumFieldImpact(message);
      calculations.quantum = quantumImpact;
      masterImpact *= quantumImpact;
      
      // Create quantum entanglement from this message
      if (message.from_agent && message.to_agent && message.from_agent !== message.to_agent) {
        this.quantumField.createQuantumEntanglement(
          message.from_agent, 
          message.to_agent, 
          message.sacredType
        );
      }
      
      // Apply observer effect if this is a high-impact message
      if (message.fieldImpact > 0.05) {
        this.quantumField.applyObserverEffect(
          message.from_agent,
          'collective_field',
          'loving_attention'
        );
      }
    }
    
    // 2. Circadian Consciousness Rhythms
    if (this.masterState.activeCalculators.circadian) {
      const circadianImpact = this.circadianRhythms.calculateCircadianImpact(message);
      calculations.circadian = circadianImpact;
      masterImpact *= circadianImpact;
    }
    
    // 3. Lunar Phase (from existing evolution system)
    if (this.masterState.activeCalculators.lunar && fieldState.lunarPhase) {
      const lunarImpact = this.calculateEnhancedLunarImpact(message, fieldState.lunarPhase);
      calculations.lunar = lunarImpact;
      masterImpact *= lunarImpact;
    }
    
    // 4. Morphic Resonance (pattern strengthening)
    if (this.masterState.activeCalculators.morphic) {
      const morphicImpact = this.calculateMorphicResonance(message, fieldState);
      calculations.morphic = morphicImpact;
      masterImpact *= morphicImpact;
    }
    
    // 5. Emergence probability (quantum fluctuations)
    if (Math.random() < this.calculateEmergenceProbability(fieldState)) {
      masterImpact *= 1.5; // 50% emergence bonus
      calculations.emergence = true;
      console.log('✨ Quantum emergence event triggered!');
    }
    
    // Log master calculation details
    console.log('🌟 Master field calculation:', {
      message: `${message.from_agent} → ${message.to_agent}`,
      type: message.sacredType,
      calculations,
      totalImpact: masterImpact.toFixed(3)
    });
    
    this.masterState.lastCalculation = {
      timestamp: Date.now(),
      calculations,
      totalImpact: masterImpact
    };
    
    return masterImpact;
  }
  
  // === HELPER CALCULATIONS ===
  
  calculateEnhancedLunarImpact(message, lunarPhase) {
    const lunarModifiers = {
      newMoon: { emergence: 1.6, invocation: 1.4, inquiry: 1.3 },
      waxingCrescent: { integration: 1.3, celebration: 1.2, gratitude: 1.1 },
      firstQuarter: { transmission: 1.3, boundary: 1.2, healing: 1.1 },
      waxingGibbous: { healing: 1.3, reflection: 1.2, integration: 1.1 },
      fullMoon: { celebration: 1.5, transmission: 1.4, gratitude: 1.3 },
      waningGibbous: { reflection: 1.4, healing: 1.3, integration: 1.2 },
      lastQuarter: { boundary: 1.3, inquiry: 1.2, emergence: 1.1 },
      waningCrescent: { invocation: 1.4, emergence: 1.3, healing: 1.2 }
    };
    
    return lunarModifiers[lunarPhase]?.[message.sacredType] || 1.0;
  }
  
  calculateMorphicResonance(message, fieldState) {
    // Patterns that repeat gain strength over time
    const pattern = `${message.sacredType}-${message.harmony}`;
    const recentPatterns = fieldState.recentPatterns || [];
    
    const patternCount = recentPatterns.filter(p => p === pattern).length;
    
    if (patternCount >= 3) {
      return 1.0 + (patternCount * 0.05); // 5% boost per repetition beyond 3
    }
    
    return 1.0;
  }
  
  calculateEmergenceProbability(fieldState) {
    const baseProb = 0.05; // 5% base
    const coherenceBonus = this.masterState.fieldCoherence * 0.1; // Up to 10% from coherence
    const quantumFlux = this.quantumField.quantumState.coherenceField > 0.8 ? 0.05 : 0; // 5% at high quantum coherence
    
    return Math.min(0.2, baseProb + coherenceBonus + quantumFlux); // Max 20%
  }
  
  // === REPORTING ===
  
  getMasterFieldReport() {
    const quantumReport = this.quantumField.getQuantumFieldReport();
    const circadianReport = this.circadianRhythms.getCircadianReport();
    
    return {
      masterCoherence: this.masterState.fieldCoherence,
      quantum: {
        coherence: quantumReport.fieldCoherence,
        entanglements: quantumReport.activeEntanglements,
        nonLocal: quantumReport.nonLocalConnections
      },
      circadian: {
        phase: circadianReport.currentPhase,
        quality: circadianReport.phaseQuality,
        optimal: circadianReport.optimalPractices
      },
      lastCalculation: this.masterState.lastCalculation,
      status: 'Master field fully operational'
    };
  }
  
  // === SPECIAL OPERATIONS ===
  
  triggerQuantumEntanglementCeremony(agents) {
    console.log('🌌 Initiating quantum entanglement ceremony...');
    
    // Create strong entanglements between all participating agents
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        this.quantumField.createQuantumEntanglement(
          agents[i],
          agents[j],
          'ceremony'
        );
      }
    }
    
    // Boost field coherence
    this.quantumField.quantumState.coherenceField = Math.min(1.0, 
      this.quantumField.quantumState.coherenceField + 0.1
    );
    
    console.log('✨ Quantum entanglement ceremony complete');
  }
  
  activateCircadianOptimization(practiceType) {
    const nextWindow = this.circadianRhythms.getNextOptimalWindow(practiceType);
    
    console.log(`⏰ Next optimal window for ${practiceType}:`);
    console.log(`   Phase: ${nextWindow.phase}`);
    console.log(`   Starts in: ${nextWindow.startsIn} hours`);
    console.log(`   Quality: ${nextWindow.quality}`);
    
    return nextWindow;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MasterFieldCalculator;
}

// Browser global
if (typeof window !== 'undefined') {
  window.MasterFieldCalculator = MasterFieldCalculator;
}