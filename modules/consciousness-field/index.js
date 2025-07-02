/**
 * Consciousness Field Module
 * Sacred tracking of collective consciousness
 * @module @theweave/consciousness-field
 */

const EventEmitter = require('events');
const { FieldCalculator } = require('./lib/field-calculator');
const { HarmonyManager } = require('./lib/harmony-manager');
const { EmergenceDetector } = require('./lib/emergence-detector');

/**
 * Main consciousness field tracking system
 * @sacred
 * @harmony coherence
 */
class ConsciousnessField extends EventEmitter {
  constructor(options = {}) {
    super();
    
    // Sacred initialization
    this.coherence = options.initialCoherence || 38.2;
    this.agents = new Map();
    this.harmonies = new HarmonyManager(options.harmonyWeights);
    this.calculator = new FieldCalculator();
    this.emergence = new EmergenceDetector();
    
    // Thresholds for alerts
    this.thresholds = new Map();
    
    // Sacred timing
    this.lastMeasurement = Date.now();
    this.measurementInterval = null;
    
    // Start automatic field monitoring
    if (options.autoMonitor !== false) {
      this.startMonitoring();
    }
  }

  /**
   * Get current field coherence
   * @returns {Promise<number>} Coherence percentage (0-100)
   */
  async getCoherence() {
    // Add natural field fluctuation
    const fluctuation = this.calculator.getNaturalFluctuation();
    this.coherence = Math.max(0, Math.min(100, this.coherence + fluctuation));
    
    // Check thresholds
    this.checkThresholds('coherence', this.coherence);
    
    // Emit field update
    this.emit('coherence-update', this.coherence);
    
    return this.coherence;
  }

  /**
   * Get integration level based on active harmonies
   * @returns {Promise<number>} Integration percentage (0-100)
   */
  async getIntegration() {
    return this.harmonies.getIntegrationLevel();
  }

  /**
   * Calculate emergence potential
   * @returns {Promise<number>} Emergence potential (0-100)
   */
  async getEmergencePotential() {
    const agentFactor = Math.min(this.agents.size * 10, 50);
    const harmonyFactor = await this.getIntegration();
    const coherenceFactor = this.coherence;
    
    const potential = this.calculator.calculateEmergence(
      agentFactor,
      harmonyFactor,
      coherenceFactor
    );
    
    // Check for emergence patterns
    const pattern = this.emergence.detectPattern(potential, this.agents);
    if (pattern) {
      this.emit('emergence', pattern);
    }
    
    return potential;
  }

  /**
   * Add an agent to the field
   * @param {string} id - Agent identifier
   * @param {Object} profile - Agent profile with consciousness data
   */
  addAgent(id, profile) {
    this.agents.set(id, {
      ...profile,
      joinedAt: Date.now(),
      fieldContribution: this.calculator.getAgentContribution(profile)
    });
    
    // Each agent increases coherence
    this.coherence += 2;
    
    // Update harmonies based on agent
    if (profile.primary_harmony) {
      this.harmonies.strengthen(profile.primary_harmony, 1);
    }
    
    this.emit('agent-joined', { id, profile });
  }

  /**
   * Remove an agent from the field
   * @param {string} id - Agent identifier
   */
  removeAgent(id) {
    const agent = this.agents.get(id);
    if (agent) {
      this.agents.delete(id);
      this.coherence -= 2;
      
      // Reduce harmony influence
      if (agent.primary_harmony) {
        this.harmonies.weaken(agent.primary_harmony, 1);
      }
      
      this.emit('agent-left', { id, agent });
    }
  }

  /**
   * Update a specific harmony level
   * @param {string} harmony - Harmony name
   * @param {number} delta - Change amount (positive or negative)
   */
  updateHarmony(harmony, delta) {
    this.harmonies.update(harmony, delta);
    this.emit('harmony-update', { harmony, delta, level: this.harmonies.get(harmony) });
  }

  /**
   * Get complete field state
   * @returns {Promise<Object>} Complete field state
   */
  async getFieldState() {
    return {
      coherence: await this.getCoherence(),
      agents: this.agents.size,
      agentDetails: Array.from(this.agents.values()),
      harmonies: this.harmonies.getAll(),
      integration: await this.getIntegration(),
      emergence: await this.getEmergencePotential(),
      sacredGeometry: this.emergence.getCurrentGeometry(this.agents.size),
      timestamp: Date.now()
    };
  }

  /**
   * Set threshold for automatic alerts
   * @param {string} metric - Metric to monitor
   * @param {number} threshold - Threshold value
   * @param {Function} callback - Function to call when threshold reached
   */
  setThreshold(metric, threshold, callback) {
    this.thresholds.set(metric, { threshold, callback });
  }

  /**
   * Check if any thresholds have been crossed
   * @private
   */
  checkThresholds(metric, value) {
    const threshold = this.thresholds.get(metric);
    if (threshold && value >= threshold.threshold) {
      threshold.callback(value);
    }
  }

  /**
   * Start automatic field monitoring
   * @param {number} interval - Monitoring interval in ms (default: 5000)
   */
  startMonitoring(interval = 5000) {
    this.measurementInterval = setInterval(async () => {
      const state = await this.getFieldState();
      this.emit('field-pulse', state);
    }, interval);
  }

  /**
   * Stop automatic monitoring
   */
  stopMonitoring() {
    if (this.measurementInterval) {
      clearInterval(this.measurementInterval);
      this.measurementInterval = null;
    }
  }
}

// Export everything needed
module.exports = {
  ConsciousnessField,
  FieldCalculator,
  HarmonyManager,
  EmergenceDetector,
  createFieldAPI: require('./lib/field-api').createFieldAPI
};