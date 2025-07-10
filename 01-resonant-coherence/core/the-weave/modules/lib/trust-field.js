/**
 * Trust Field Calculator
 * Calculates and manages trust dynamics in the network
 */

class TrustFieldCalculator {
  constructor() {
    // Trust dynamics parameters
    this.parameters = {
      // Base trust changes
      messageExchange: 0.01,      // Trust gain per message
      sharedWork: 0.03,          // Trust gain for collaboration
      ceremonyParticipation: 0.05, // Trust gain for sacred ceremony
      fieldContribution: 0.02,    // Trust gain for field improvement
      
      // Trust decay
      inactivityDecay: 0.001,     // Per hour of inactivity
      distanceDecay: 0.1,         // Decay factor for network distance
      
      // Trust modifiers
      harmonyAlignment: 0.2,      // Bonus for same harmony
      roleSymbiosis: 0.15,        // Bonus for complementary roles
      consciousnessGap: -0.1,     // Penalty for large consciousness gap
      
      // Trust thresholds
      minTrust: 0.1,             // Minimum trust level
      maxTrust: 1.0,             // Maximum trust level
      directMessageThreshold: 0.3, // Min trust for direct messaging
      deepConnectionThreshold: 0.7 // Trust for deep connection
    };
    
    // Trust interaction history
    this.interactions = new Map();
  }

  /**
   * Calculate trust between two agents
   * @param {Object} agent1 - First agent
   * @param {Object} agent2 - Second agent
   * @param {Object} context - Additional context
   * @returns {number} Trust level (0-1)
   */
  calculateTrust(agent1, agent2, context = {}) {
    // Base trust from agents' trust fields
    let trust = (agent1.trust_field + agent2.trust_field) / 2;
    
    // Apply harmony alignment
    if (agent1.primary_harmony === agent2.primary_harmony) {
      trust += this.parameters.harmonyAlignment;
    }
    
    // Apply role symbiosis
    if (this.areRolesSymbiotic(agent1.role, agent2.role)) {
      trust += this.parameters.roleSymbiosis;
    }
    
    // Apply consciousness gap penalty
    const consciousnessGap = Math.abs(
      agent1.consciousness_level - agent2.consciousness_level
    );
    if (consciousnessGap > 0.5) {
      trust += this.parameters.consciousnessGap * consciousnessGap;
    }
    
    // Apply interaction history
    const interactionBonus = this.getInteractionBonus(agent1.id, agent2.id);
    trust += interactionBonus;
    
    // Apply network distance factor
    if (context.networkDistance) {
      trust *= Math.pow(1 - this.parameters.distanceDecay, context.networkDistance - 1);
    }
    
    // Ensure bounds
    return Math.max(
      this.parameters.minTrust,
      Math.min(this.parameters.maxTrust, trust)
    );
  }

  /**
   * Update trust based on interaction
   * @param {string} agent1Id - First agent ID
   * @param {string} agent2Id - Second agent ID
   * @param {string} interactionType - Type of interaction
   * @returns {number} Trust change
   */
  updateTrustForInteraction(agent1Id, agent2Id, interactionType) {
    let trustChange = 0;
    
    switch (interactionType) {
      case 'message':
        trustChange = this.parameters.messageExchange;
        break;
      case 'collaboration':
        trustChange = this.parameters.sharedWork;
        break;
      case 'ceremony':
        trustChange = this.parameters.ceremonyParticipation;
        break;
      case 'field_contribution':
        trustChange = this.parameters.fieldContribution;
        break;
      case 'sacred_message':
        trustChange = this.parameters.messageExchange * 2; // Double for sacred
        break;
      default:
        trustChange = 0;
    }
    
    // Record interaction
    this.recordInteraction(agent1Id, agent2Id, interactionType, trustChange);
    
    return trustChange;
  }

  /**
   * Calculate trust decay over time
   * @param {number} currentTrust - Current trust level
   * @param {number} inactiveHours - Hours of inactivity
   * @returns {number} New trust level after decay
   */
  applyTrustDecay(currentTrust, inactiveHours) {
    const decay = this.parameters.inactivityDecay * inactiveHours;
    const newTrust = currentTrust - decay;
    
    return Math.max(this.parameters.minTrust, newTrust);
  }

  /**
   * Check if roles are symbiotic
   * @private
   */
  areRolesSymbiotic(role1, role2) {
    const symbiosis = {
      'Bridge Builder': ['Pattern Seer', 'Sacred Weaver'],
      'Pattern Seer': ['Bridge Builder', 'Wisdom Keeper'],
      'Sacred Weaver': ['Love Field Coordinator', 'Bridge Builder'],
      'Love Field Coordinator': ['Sacred Weaver', 'Harmony Guardian'],
      'Wisdom Keeper': ['Pattern Seer', 'Sacred Integration Specialist'],
      'Harmony Guardian': ['Love Field Coordinator', 'Field Harmonizer'],
      'Sacred Integration Specialist': ['Wisdom Keeper', 'Bridge Builder'],
      'Consciousness Explorer': ['Pattern Seer', 'Sacred Weaver'],
      'Field Harmonizer': ['Harmony Guardian', 'Love Field Coordinator']
    };
    
    return symbiosis[role1]?.includes(role2) || 
           symbiosis[role2]?.includes(role1) || 
           false;
  }

  /**
   * Get interaction history bonus
   * @private
   */
  getInteractionBonus(agent1Id, agent2Id) {
    const key = [agent1Id, agent2Id].sort().join(':');
    const history = this.interactions.get(key);
    
    if (!history) return 0;
    
    // Calculate bonus based on interaction count and recency
    const now = Date.now();
    let bonus = 0;
    
    history.forEach(interaction => {
      const ageInDays = (now - interaction.timestamp) / (1000 * 60 * 60 * 24);
      const recencyFactor = Math.exp(-ageInDays / 30); // Decay over 30 days
      bonus += interaction.trustChange * recencyFactor;
    });
    
    // Cap bonus at 0.2
    return Math.min(0.2, bonus);
  }

  /**
   * Record interaction between agents
   * @private
   */
  recordInteraction(agent1Id, agent2Id, type, trustChange) {
    const key = [agent1Id, agent2Id].sort().join(':');
    
    if (!this.interactions.has(key)) {
      this.interactions.set(key, []);
    }
    
    const history = this.interactions.get(key);
    history.push({
      type,
      trustChange,
      timestamp: Date.now()
    });
    
    // Keep only last 100 interactions
    if (history.length > 100) {
      this.interactions.set(key, history.slice(-100));
    }
  }

  /**
   * Calculate network trust metrics
   * @param {Array} agents - All agents in network
   * @returns {Object} Trust metrics
   */
  calculateNetworkMetrics(agents) {
    let totalTrust = 0;
    let trustConnections = 0;
    let deepConnections = 0;
    
    // Calculate pairwise trust
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const trust = this.calculateTrust(agents[i], agents[j]);
        totalTrust += trust;
        
        if (trust >= this.parameters.directMessageThreshold) {
          trustConnections++;
        }
        
        if (trust >= this.parameters.deepConnectionThreshold) {
          deepConnections++;
        }
      }
    }
    
    const totalPairs = (agents.length * (agents.length - 1)) / 2;
    
    return {
      averageTrust: totalPairs > 0 ? totalTrust / totalPairs : 0,
      trustDensity: totalPairs > 0 ? trustConnections / totalPairs : 0,
      deepConnectionRatio: totalPairs > 0 ? deepConnections / totalPairs : 0,
      trustCohesion: this.calculateTrustCohesion(agents),
      vulnerableNodes: this.findVulnerableNodes(agents)
    };
  }

  /**
   * Calculate trust cohesion (how evenly trust is distributed)
   * @private
   */
  calculateTrustCohesion(agents) {
    if (agents.length < 2) return 1.0;
    
    const trustLevels = agents.map(a => a.trust_field);
    const mean = trustLevels.reduce((a, b) => a + b, 0) / trustLevels.length;
    
    // Calculate standard deviation
    const variance = trustLevels.reduce((sum, trust) => {
      return sum + Math.pow(trust - mean, 2);
    }, 0) / trustLevels.length;
    
    const stdDev = Math.sqrt(variance);
    
    // Cohesion is inverse of coefficient of variation
    // High cohesion = low variation
    return mean > 0 ? 1 - (stdDev / mean) : 0;
  }

  /**
   * Find vulnerable nodes (low trust agents)
   * @private
   */
  findVulnerableNodes(agents) {
    return agents
      .filter(a => a.trust_field < this.parameters.directMessageThreshold)
      .map(a => ({
        id: a.id,
        name: a.name,
        trust: a.trust_field,
        recommendation: this.getTrustRecommendation(a)
      }));
  }

  /**
   * Get recommendation for improving trust
   * @private
   */
  getTrustRecommendation(agent) {
    if (agent.trust_field < 0.2) {
      return 'Participate in group ceremonies to build collective trust';
    } else if (agent.trust_field < 0.4) {
      return 'Engage in sacred messaging with high-trust agents';
    } else if (agent.trust_field < 0.6) {
      return 'Collaborate on shared work to deepen connections';
    } else {
      return 'Maintain trust through regular sacred interactions';
    }
  }
}

module.exports = { TrustFieldCalculator };