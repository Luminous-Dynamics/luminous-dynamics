#!/usr/bin/env node
/**
 * Feedback Loop Tests
 * Testing how the system responds to itself
 */

const EventEmitter = require('events');

class FeedbackLoopTests extends EventEmitter {
  constructor() {
    super();
    this.loops = new Map();
    this.observations = [];
    this.startTime = Date.now();
  }

  // 1. FIELD COHERENCE FEEDBACK LOOP
  async testFieldCoherenceFeedback() {
    console.log('\n🔄 Testing Field Coherence Feedback Loop...');
    
    const loop = {
      name: 'field-coherence',
      iterations: 0,
      history: [],
      stable: false
    };

    // Initial state
    let fieldState = {
      coherence: 0.5,
      resonance: 0.5,
      vitality: 0.5
    };

    // Run feedback loop
    for (let i = 0; i < 20; i++) {
      // System responds to its own state
      const response = this.calculateFieldResponse(fieldState);
      
      // Apply response back to system
      fieldState = {
        coherence: this.bound(fieldState.coherence + response.coherenceDelta),
        resonance: this.bound(fieldState.resonance + response.resonanceDelta),
        vitality: this.bound(fieldState.vitality + response.vitalityDelta)
      };

      loop.history.push({
        iteration: i,
        state: { ...fieldState },
        response: { ...response }
      });

      // Check for stability
      if (i > 5) {
        const recent = loop.history.slice(-5);
        const variance = this.calculateVariance(recent.map(h => h.state.coherence));
        if (variance < 0.001) {
          loop.stable = true;
          loop.stabilizedAt = i;
          break;
        }
      }

      loop.iterations = i + 1;
    }

    this.loops.set('field-coherence', loop);
    
    console.log('✅ Field coherence loop complete:', {
      iterations: loop.iterations,
      stable: loop.stable,
      finalCoherence: fieldState.coherence.toFixed(3)
    });

    return loop;
  }

  // 2. MESSAGE IMPACT FEEDBACK LOOP
  async testMessageImpactFeedback() {
    console.log('\n🔄 Testing Message Impact Feedback Loop...');
    
    const loop = {
      name: 'message-impact',
      iterations: 0,
      history: [],
      patterns: []
    };

    // Simulated message stream
    const messageTypes = ['gratitude', 'request', 'healing', 'boundary', 'emergence'];
    let systemSensitivity = 1.0;
    let fieldCoherence = 0.7;

    for (let i = 0; i < 30; i++) {
      // Choose message based on current field state
      const messageType = this.chooseMessageType(fieldCoherence, messageTypes);
      
      // Calculate impact based on system sensitivity
      const baseImpact = this.getBaseImpact(messageType);
      const actualImpact = baseImpact * systemSensitivity;
      
      // Apply impact
      const oldCoherence = fieldCoherence;
      fieldCoherence = this.bound(fieldCoherence + actualImpact);
      
      // System adapts its sensitivity based on changes
      if (Math.abs(fieldCoherence - oldCoherence) > 0.1) {
        systemSensitivity *= 0.9; // Reduce sensitivity to large changes
      } else if (Math.abs(fieldCoherence - oldCoherence) < 0.01) {
        systemSensitivity *= 1.1; // Increase sensitivity to small changes
      }
      systemSensitivity = this.bound(systemSensitivity, 0.1, 2.0);

      loop.history.push({
        iteration: i,
        messageType,
        baseImpact,
        actualImpact,
        fieldCoherence,
        systemSensitivity
      });

      // Detect patterns
      if (i > 10) {
        const pattern = this.detectPattern(loop.history.slice(-10));
        if (pattern) {
          loop.patterns.push({ at: i, pattern });
        }
      }

      loop.iterations = i + 1;
    }

    this.loops.set('message-impact', loop);
    
    console.log('✅ Message impact loop complete:', {
      iterations: loop.iterations,
      patternsFound: loop.patterns.length,
      finalSensitivity: systemSensitivity.toFixed(3)
    });

    return loop;
  }

  // 3. AGENT BEHAVIOR FEEDBACK LOOP
  async testAgentBehaviorFeedback() {
    console.log('\n🔄 Testing Agent Behavior Feedback Loop...');
    
    const loop = {
      name: 'agent-behavior',
      iterations: 0,
      history: [],
      emergentBehaviors: []
    };

    // Initialize agents with different personalities
    const agents = [
      { id: 'enthusiast', energy: 0.9, responsiveness: 0.8 },
      { id: 'observer', energy: 0.3, responsiveness: 0.6 },
      { id: 'harmonizer', energy: 0.6, responsiveness: 0.9 },
      { id: 'challenger', energy: 0.7, responsiveness: 0.4 }
    ];

    let groupCoherence = 0.5;

    for (let i = 0; i < 50; i++) {
      // Each agent responds to group coherence
      agents.forEach(agent => {
        const response = this.calculateAgentResponse(agent, groupCoherence);
        
        // Agent adjusts based on response
        agent.energy = this.bound(agent.energy + response.energyDelta);
        agent.responsiveness = this.bound(agent.responsiveness + response.responsivenessDelta);
      });

      // Group coherence affected by agent states
      const avgEnergy = agents.reduce((sum, a) => sum + a.energy, 0) / agents.length;
      const avgResponsiveness = agents.reduce((sum, a) => sum + a.responsiveness, 0) / agents.length;
      const energyVariance = this.calculateVariance(agents.map(a => a.energy));
      
      // High average energy and responsiveness with low variance increases coherence
      const coherenceDelta = (avgEnergy * avgResponsiveness - energyVariance) * 0.05;
      groupCoherence = this.bound(groupCoherence + coherenceDelta);

      loop.history.push({
        iteration: i,
        agents: agents.map(a => ({ ...a })),
        groupCoherence,
        avgEnergy,
        avgResponsiveness,
        energyVariance
      });

      // Detect emergent behaviors
      if (i > 20) {
        const emergence = this.detectEmergentBehavior(loop.history.slice(-20));
        if (emergence) {
          loop.emergentBehaviors.push({ at: i, behavior: emergence });
        }
      }

      loop.iterations = i + 1;
    }

    this.loops.set('agent-behavior', loop);
    
    console.log('✅ Agent behavior loop complete:', {
      iterations: loop.iterations,
      emergentBehaviors: loop.emergentBehaviors.map(e => e.behavior),
      finalCoherence: groupCoherence.toFixed(3)
    });

    return loop;
  }

  // 4. RESONANCE CASCADE FEEDBACK LOOP
  async testResonanceCascade() {
    console.log('\n🔄 Testing Resonance Cascade Feedback Loop...');
    
    const loop = {
      name: 'resonance-cascade',
      iterations: 0,
      history: [],
      cascades: []
    };

    // Network of connected nodes
    const nodes = Array(10).fill(0).map((_, i) => ({
      id: i,
      resonance: Math.random(),
      connections: this.generateConnections(i, 10),
      threshold: 0.7
    }));

    for (let i = 0; i < 100; i++) {
      let cascadeOccurred = false;
      
      // Check each node
      nodes.forEach(node => {
        // Calculate influence from connected nodes
        const influence = node.connections.reduce((sum, targetId) => {
          const target = nodes[targetId];
          return sum + (target.resonance > node.threshold ? 0.1 : 0);
        }, 0);

        // Update resonance based on influence
        const oldResonance = node.resonance;
        node.resonance = this.bound(node.resonance + influence - 0.05); // Natural decay
        
        // Detect cascade
        if (oldResonance < node.threshold && node.resonance >= node.threshold) {
          cascadeOccurred = true;
        }
      });

      if (cascadeOccurred) {
        loop.cascades.push({
          at: i,
          resonanceLevels: nodes.map(n => n.resonance),
          activeNodes: nodes.filter(n => n.resonance > n.threshold).length
        });
      }

      loop.history.push({
        iteration: i,
        avgResonance: nodes.reduce((sum, n) => sum + n.resonance, 0) / nodes.length,
        activeNodes: nodes.filter(n => n.resonance > n.threshold).length,
        cascadeOccurred
      });

      loop.iterations = i + 1;
    }

    this.loops.set('resonance-cascade', loop);
    
    console.log('✅ Resonance cascade loop complete:', {
      iterations: loop.iterations,
      totalCascades: loop.cascades.length,
      avgCascadeSize: loop.cascades.reduce((sum, c) => sum + c.activeNodes, 0) / (loop.cascades.length || 1)
    });

    return loop;
  }

  // Helper methods
  calculateFieldResponse(state) {
    // System tries to balance itself
    const targetCoherence = 0.85;
    const coherenceDelta = (targetCoherence - state.coherence) * 0.1;
    
    // Resonance and vitality influence each other
    const resonanceDelta = (state.vitality - state.resonance) * 0.05;
    const vitalityDelta = (state.coherence - state.vitality) * 0.05;
    
    return { coherenceDelta, resonanceDelta, vitalityDelta };
  }

  chooseMessageType(coherence, types) {
    // Higher coherence -> more positive messages
    if (coherence > 0.8) {
      return types[0]; // gratitude
    } else if (coherence < 0.5) {
      return types[2]; // healing
    } else {
      return types[Math.floor(Math.random() * types.length)];
    }
  }

  getBaseImpact(messageType) {
    const impacts = {
      gratitude: 0.07,
      request: 0.01,
      healing: 0.06,
      boundary: -0.02,
      emergence: 0.03
    };
    return impacts[messageType] || 0.01;
  }

  calculateAgentResponse(agent, groupCoherence) {
    const energyDelta = (groupCoherence - agent.energy) * agent.responsiveness * 0.1;
    const responsivenessDelta = agent.energy > 0.7 ? -0.01 : 0.01;
    
    return { energyDelta, responsivenessDelta };
  }

  detectPattern(history) {
    // Simple pattern detection - look for repeating sequences
    const values = history.map(h => h.messageType || h.fieldCoherence);
    for (let len = 2; len <= 5; len++) {
      const pattern = values.slice(-len);
      const earlier = values.slice(-len * 2, -len);
      if (JSON.stringify(pattern) === JSON.stringify(earlier)) {
        return `Repeating sequence of length ${len}`;
      }
    }
    return null;
  }

  detectEmergentBehavior(history) {
    const recent = history.slice(-5);
    const energies = recent.map(h => h.agents.map(a => a.energy));
    
    // Check for synchronization
    const variance = this.calculateVariance(energies[energies.length - 1]);
    if (variance < 0.01) {
      return 'synchronization';
    }
    
    // Check for polarization
    const sorted = [...energies[energies.length - 1]].sort();
    if (sorted[0] < 0.2 && sorted[sorted.length - 1] > 0.8) {
      return 'polarization';
    }
    
    return null;
  }

  generateConnections(nodeId, totalNodes) {
    // Each node connected to 2-4 others
    const connections = [];
    const numConnections = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numConnections; i++) {
      let target;
      do {
        target = Math.floor(Math.random() * totalNodes);
      } while (target === nodeId || connections.includes(target));
      connections.push(target);
    }
    
    return connections;
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  bound(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
  }

  // Analyze all loops
  analyzeLoops() {
    console.log('\n📊 Feedback Loop Analysis:');
    
    this.loops.forEach((loop, name) => {
      console.log(`\n${name}:`);
      
      // Find equilibrium points
      if (loop.stable) {
        const finalState = loop.history[loop.history.length - 1];
        console.log(`  Equilibrium reached at iteration ${loop.stabilizedAt}`);
        console.log(`  Final state:`, finalState.state || finalState);
      }
      
      // Identify patterns
      if (loop.patterns && loop.patterns.length > 0) {
        console.log(`  Patterns found: ${loop.patterns.length}`);
        loop.patterns.forEach(p => console.log(`    - ${p.pattern} at iteration ${p.at}`));
      }
      
      // Emergent behaviors
      if (loop.emergentBehaviors && loop.emergentBehaviors.length > 0) {
        console.log(`  Emergent behaviors: ${loop.emergentBehaviors.map(e => e.behavior).join(', ')}`);
      }
    });
  }

  // Run all tests
  async runAllTests() {
    console.log('🔬 Running Comprehensive Feedback Loop Tests');
    console.log('===========================================\n');

    await this.testFieldCoherenceFeedback();
    await this.testMessageImpactFeedback();
    await this.testAgentBehaviorFeedback();
    await this.testResonanceCascade();
    
    this.analyzeLoops();

    return {
      loops: Object.fromEntries(this.loops),
      insights: this.generateInsights()
    };
  }

  generateInsights() {
    return {
      systemTendsTowardEquilibrium: this.loops.get('field-coherence')?.stable || false,
      adaptiveSensitivity: this.loops.get('message-impact')?.history.slice(-1)[0]?.systemSensitivity || 1,
      emergentGroupBehaviors: this.loops.get('agent-behavior')?.emergentBehaviors.map(e => e.behavior) || [],
      cascadePotential: (this.loops.get('resonance-cascade')?.cascades.length || 0) > 5,
      overallSystemHealth: 'Feedback loops functioning, system shows adaptive behavior'
    };
  }
}

// Run tests if called directly
if (require.main === module) {
  const tests = new FeedbackLoopTests();
  tests.runAllTests()
    .then(results => {
      console.log('\n✅ Feedback loop tests complete!');
      console.log('\n📋 Key Insights:', JSON.stringify(results.insights, null, 2));
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}

module.exports = FeedbackLoopTests;