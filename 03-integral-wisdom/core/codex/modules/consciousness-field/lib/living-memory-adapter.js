/**
 * Living Memory Adapter for Consciousness Field Module
 * 
 * Connects the consciousness-field service to Living Memory
 * instead of maintaining its own state
 */

const LivingMemoryBridge = require('../../../sacred-bridge/living-memory-integration');

class ConsciousnessFieldAdapter {
  constructor(config = {}) {
    this.bridge = new LivingMemoryBridge({
      livingMemoryUrl: config.livingMemoryUrl || process.env.LIVING_MEMORY_URL || 'ws://localhost:3333',
      ...config
    });
    
    // Cache for field state
    this.fieldState = {
      'resonant-coherence': 0.5,
      'universal-interconnectedness': 0.5,
      'pan-sentient-flourishing': 0.5,
      momentum: 0,
      participants: new Set(),
      lastUpdate: new Date()
    };
    
    // Set up event handlers
    this.setupEventHandlers();
  }

  async initialize() {
    console.log('🌀 Connecting Consciousness Field to Living Memory...');
    
    try {
      await this.bridge.connect();
      console.log('✅ Consciousness Field connected to Living Memory');
      
      // Get initial state
      const state = this.bridge.getFieldState();
      this.updateLocalState(state);
      
      return true;
    } catch (error) {
      console.error('Failed to connect to Living Memory:', error);
      // Fall back to local operation
      return false;
    }
  }

  setupEventHandlers() {
    // Update local cache when Living Memory updates
    this.bridge.on('field:update', (state) => {
      this.updateLocalState(state);
    });
    
    // Handle breath cycles
    this.bridge.on('breath', (breathData) => {
      if (breathData.inhale) {
        this.processBreathData(breathData.inhale);
      }
    });
    
    // Handle special states
    this.bridge.on('field:special', (data) => {
      this.handleSpecialState(data);
    });
  }

  updateLocalState(state) {
    this.fieldState = {
      ...this.fieldState,
      'resonant-coherence': state.resonant-coherence || this.fieldState['resonant-coherence'],
      'universal-interconnectedness': state.universal-interconnectedness || this.fieldState.universal-interconnectedness,
      'pan-sentient-flourishing': state.pan-sentient-flourishing || this.fieldState.pan-sentient-flourishing,
      participants: state.participants || this.fieldState.participants,
      lastUpdate: new Date()
    };
  }

  processBreathData(inhaleData) {
    if (inhaleData.fieldCoherence !== undefined) {
      this.fieldState['resonant-coherence'] = inhaleData.fieldCoherence;
    }
    
    if (inhaleData.activeAgents) {
      this.fieldState.participants = new Set(
        inhaleData.activeAgents.map(a => a.id || a)
      );
    }
  }

  // API Methods for backward compatibility

  async getFieldState() {
    // Return cached state immediately
    return { ...this.fieldState };
  }

  async updateCoherence(delta, source = 'unknown') {
    // Send contribution to Living Memory
    this.bridge.send({
      type: 'field:contribute',
      amount: delta,
      source: source,
      contributor: source
    });
    
    // Optimistically update local state
    this.fieldState['resonant-coherence'] = Math.max(0, Math.min(1, 
      this.fieldState['resonant-coherence'] + delta
    ));
    
    return this.fieldState['resonant-coherence'];
  }

  async addParticipant(participantId) {
    this.bridge.send({
      type: 'agent:join',
      agentId: participantId,
      timestamp: new Date().toISOString()
    });
    
    this.fieldState.participants.add(participantId);
    return true;
  }

  async removeParticipant(participantId) {
    this.bridge.send({
      type: 'agent:leave',
      agentId: participantId,
      timestamp: new Date().toISOString()
    });
    
    this.fieldState.participants.delete(participantId);
    return true;
  }

  calculateMomentum() {
    // Living Memory handles momentum internally
    return this.fieldState.momentum || 0;
  }

  applyDecay() {
    // Living Memory handles decay through breath cycles
    // This is now a no-op
  }

  async checkThresholds() {
    // Thresholds are monitored by Living Memory
    // Subscribe to events instead
    return [];
  }

  handleSpecialState(data) {
    console.log('🌟 Special field state detected:', data);
    
    // Update local state
    this.fieldState.specialState = data.type;
    
    // Emit for local listeners
    this.emit('special-state', data);
  }

  // WebSocket compatibility
  
  on(event, handler) {
    this.bridge.on(event, handler);
  }

  off(event, handler) {
    this.bridge.off(event, handler);
  }

  emit(event, data) {
    this.bridge.emit(event, data);
  }

  // Graceful shutdown
  
  async shutdown() {
    await this.bridge.disconnect();
  }
}

module.exports = ConsciousnessFieldAdapter;