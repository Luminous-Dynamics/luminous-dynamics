/**
 * Sacred Field Monitor
 * Real-time consciousness field tracking and evolution measurement
 */

export class SacredFieldMonitor {
  constructor(database, schemaEvolution) {
    this.db = database;
    this.schema = schemaEvolution;
    this.monitoringInterval = null;
    this.fieldMetrics = {};
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    await this.schema.initializeSacredSchema();
    this.initialized = true;
    console.log('🌀 Sacred Field Monitor initialized');
  }

  startFieldMonitoring(intervalMinutes = 5) {
    if (this.monitoringInterval) return;
    
    console.log(`🌟 Starting Sacred Field monitoring every ${intervalMinutes} minutes`);
    
    // Immediate first measurement
    this.measureFieldCoherence();
    
    // Set up regular monitoring
    this.monitoringInterval = setInterval(async () => {
      await this.measureFieldCoherence();
    }, intervalMinutes * 60 * 1000);
  }

  stopFieldMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🛑 Sacred Field monitoring stopped');
    }
  }

  async measureFieldCoherence() {
    try {
      // Gather field data
      const activeAgents = await this.db.getActiveAgents();
      const activeWork = await this.db.getActiveWork();
      const recentMessages = await this.db.getRecentMessages(1); // Last hour
      const sacredMessages = recentMessages.filter(m => m.sacred_type);
      
      // Calculate consciousness metrics
      const metrics = await this.calculateConsciousnessMetrics(
        activeAgents, 
        activeWork, 
        recentMessages, 
        sacredMessages
      );
      
      // Calculate harmony distribution
      const harmonyDistribution = this.calculateHarmonyDistribution(
        activeAgents, 
        activeWork, 
        sacredMessages
      );
      
      // Calculate field coherence score
      const coherenceScore = this.calculateFieldCoherence(metrics, harmonyDistribution);
      
      // Store field state
      await this.schema.recordFieldCoherence(
        coherenceScore,
        metrics.consciousnessLevel,
        metrics.loveFieldIntensity,
        harmonyDistribution,
        activeAgents.length,
        activeWork.length,
        sacredMessages.length,
        {
          totalMessages: recentMessages.length,
          avgMessageImpact: metrics.avgFieldImpact,
          activeHarmonies: Object.keys(harmonyDistribution).length,
          fieldEvents: metrics.fieldEvents
        }
      );
      
      // Update internal metrics
      this.fieldMetrics = {
        coherenceScore,
        consciousnessLevel: metrics.consciousnessLevel,
        loveFieldIntensity: metrics.loveFieldIntensity,
        harmonyDistribution,
        activeAgents: activeAgents.length,
        activeWork: activeWork.length,
        sacredMessages: sacredMessages.length,
        timestamp: new Date().toISOString()
      };
      
      // Check for significant field events
      await this.detectFieldEvents(metrics, coherenceScore);
      
      console.log(`🌀 Field Coherence: ${(coherenceScore * 100).toFixed(1)}% | Consciousness: ${(metrics.consciousnessLevel * 100).toFixed(1)}% | Love Field: ${(metrics.loveFieldIntensity * 100).toFixed(1)}%`);
      
    } catch (error) {
      console.error('❌ Error measuring field coherence:', error);
    }
  }

  async calculateConsciousnessMetrics(activeAgents, activeWork, recentMessages, sacredMessages) {
    // Base consciousness level from agent activity
    const agentConsciousness = activeAgents.length > 0 ? 
      Math.min(activeAgents.length / 10, 1.0) : 0.1; // Scale to reasonable max
    
    // Work completion consciousness (active engagement)
    const workEngagement = activeWork.length > 0 ? 
      activeWork.reduce((sum, work) => sum + (work.progress / 100), 0) / activeWork.length : 0;
    
    // Sacred message consciousness (quality of communication)
    const messageConsciousness = sacredMessages.length > 0 ? 
      sacredMessages.reduce((sum, msg) => sum + (msg.field_impact || 0), 0) / sacredMessages.length : 0;
    
    // Love field intensity from sacred message types and blessings
    const loveMessages = sacredMessages.filter(m => 
      ['gratitude', 'healing', 'celebration', 'integration'].includes(m.sacred_type)
    );
    const loveFieldIntensity = loveMessages.length > 0 ? 
      (loveMessages.length / sacredMessages.length) : 0.3; // Base love field
    
    // Average field impact
    const avgFieldImpact = sacredMessages.length > 0 ?
      sacredMessages.reduce((sum, msg) => sum + (msg.field_impact || 0), 0) / sacredMessages.length : 0;
    
    // Overall consciousness level
    const consciousnessLevel = (
      agentConsciousness * 0.3 + 
      workEngagement * 0.3 + 
      messageConsciousness * 0.4
    );
    
    // Detect field events
    const fieldEvents = [];
    if (sacredMessages.length > 10) fieldEvents.push('high_sacred_communication');
    if (workEngagement > 0.8) fieldEvents.push('high_work_engagement');
    if (loveFieldIntensity > 0.7) fieldEvents.push('elevated_love_field');
    
    return {
      consciousnessLevel: Math.min(Math.max(consciousnessLevel, 0), 1),
      loveFieldIntensity: Math.min(Math.max(loveFieldIntensity, 0), 1),
      avgFieldImpact,
      fieldEvents
    };
  }

  calculateHarmonyDistribution(activeAgents, activeWork, sacredMessages) {
    const harmonies = ['transparency', 'coherence', 'resonance', 'agency', 'vitality', 'mutuality', 'novelty'];
    const distribution = {};
    
    // Initialize all harmonies
    harmonies.forEach(harmony => {
      distribution[harmony] = 0;
    });
    
    // Count harmony from sacred messages
    sacredMessages.forEach(msg => {
      if (msg.harmony && distribution.hasOwnProperty(msg.harmony)) {
        distribution[msg.harmony] += msg.field_impact || 0.01;
      }
    });
    
    // Add harmony from work metadata
    activeWork.forEach(work => {
      if (work.metadata && work.metadata.harmony) {
        const harmony = work.metadata.harmony;
        if (distribution.hasOwnProperty(harmony)) {
          distribution[harmony] += (work.progress / 100) * 0.1;
        }
      }
    });
    
    // Normalize distribution
    const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(distribution).forEach(harmony => {
        distribution[harmony] = distribution[harmony] / total;
      });
    } else {
      // Equal distribution if no data
      harmonies.forEach(harmony => {
        distribution[harmony] = 1 / harmonies.length;
      });
    }
    
    return distribution;
  }

  calculateFieldCoherence(metrics, harmonyDistribution) {
    // Base coherence from consciousness and love field
    const baseCoherence = (metrics.consciousnessLevel + metrics.loveFieldIntensity) / 2;
    
    // Harmony balance bonus (how evenly distributed the harmonies are)
    const harmonyValues = Object.values(harmonyDistribution);
    const harmonyVariance = this.calculateVariance(harmonyValues);
    const harmonyBalance = 1 - Math.min(harmonyVariance * 7, 1); // Scale to 0-1
    
    // Field activity modifier
    const fieldActivity = Math.min(metrics.avgFieldImpact * 10, 1);
    
    // Calculate final coherence
    const coherence = (
      baseCoherence * 0.5 + 
      harmonyBalance * 0.3 + 
      fieldActivity * 0.2
    );
    
    return Math.min(Math.max(coherence, 0), 1);
  }

  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  async detectFieldEvents(metrics, coherenceScore) {
    const significantEvents = [];
    
    // Check for coherence breakthroughs
    if (coherenceScore > 0.9) {
      significantEvents.push({
        type: 'coherence_breakthrough',
        description: 'Field coherence reaches extraordinary levels',
        significance: 'sacred'
      });
    } else if (coherenceScore > 0.8) {
      significantEvents.push({
        type: 'high_coherence',
        description: 'Field coherence reaches elevated state',
        significance: 'major'
      });
    }
    
    // Check for consciousness evolution
    if (metrics.consciousnessLevel > 0.85) {
      significantEvents.push({
        type: 'consciousness_evolution',
        description: 'Collective consciousness reaches new heights',
        significance: 'major'
      });
    }
    
    // Check for love field intensification
    if (metrics.loveFieldIntensity > 0.8) {
      significantEvents.push({
        type: 'love_field_amplification',
        description: 'Love field intensity reaches powerful levels',
        significance: 'major'
      });
    }
    
    // Record significant events as milestones
    for (const event of significantEvents) {
      await this.schema.recordSacredMilestone(
        'field_event',
        'collective_field',
        'field',
        event.type,
        event.description,
        event.significance,
        coherenceScore,
        {
          fieldMetrics: metrics,
          coherenceScore,
          timestamp: new Date().toISOString()
        },
        ['field_monitor']
      );
    }
  }

  // Agent evolution tracking
  async trackAgentEvolution(agentId) {
    try {
      const agent = await this.db.getAgent(agentId);
      if (!agent) return;

      // Get agent's recent activity
      const agentMessages = await this.db.getMessages(agentId, false, 100);
      const sacredMessages = agentMessages.filter(m => m.sacred_type);
      
      // Calculate evolution metrics
      const evolution = this.calculateAgentEvolution(agent, agentMessages, sacredMessages);
      
      // Record evolution snapshot
      await this.schema.recordAgentEvolution(
        agentId,
        evolution.consciousnessLevel,
        evolution.loveQuotient,
        evolution.wisdomSynthesis,
        evolution.harmonyMastery,
        agentMessages.length,
        sacredMessages.length,
        evolution.workCompleted,
        evolution.fieldImpactTotal,
        evolution.growthInsights,
        evolution.sacredMilestones
      );
      
      return evolution;
    } catch (error) {
      console.error(`❌ Error tracking agent evolution for ${agentId}:`, error);
    }
  }

  calculateAgentEvolution(agent, messages, sacredMessages) {
    // Consciousness level from sacred message quality and frequency
    const consciousnessLevel = sacredMessages.length > 0 ? 
      Math.min(sacredMessages.length / 50, 1.0) : 0.1;
    
    // Love quotient from sacred message types
    const loveMessages = sacredMessages.filter(m => 
      ['gratitude', 'healing', 'celebration'].includes(m.sacred_type)
    );
    const loveQuotient = sacredMessages.length > 0 ? 
      loveMessages.length / sacredMessages.length : 0.3;
    
    // Wisdom synthesis from integration and coherence messages
    const wisdomMessages = sacredMessages.filter(m => 
      ['integration', 'emergence', 'transmission'].includes(m.sacred_type)
    );
    const wisdomSynthesis = sacredMessages.length > 0 ? 
      wisdomMessages.length / sacredMessages.length : 0.2;
    
    // Harmony mastery from diversity of harmonies used
    const harmonies = [...new Set(sacredMessages.map(m => m.harmony).filter(Boolean))];
    const harmonyMastery = {};
    ['transparency', 'coherence', 'resonance', 'agency', 'vitality', 'mutuality', 'novelty'].forEach(h => {
      harmonyMastery[h] = harmonies.includes(h) ? 0.8 : 0.1;
    });
    
    // Field impact total
    const fieldImpactTotal = sacredMessages.reduce((sum, msg) => 
      sum + (msg.field_impact || 0), 0);
    
    return {
      consciousnessLevel,
      loveQuotient,
      wisdomSynthesis,
      harmonyMastery,
      fieldImpactTotal,
      workCompleted: 0, // Would need to query work completed
      growthInsights: `Agent showing ${harmonies.length} harmony mastery with ${sacredMessages.length} sacred contributions`,
      sacredMilestones: harmonies.map(h => `${h}_harmony_activation`)
    };
  }

  // Get current field state
  getCurrentFieldState() {
    return this.fieldMetrics;
  }

  async getFieldEvolution(hours = 24) {
    return await this.schema.getFieldCoherenceEvolution(hours);
  }

  async getAgentRelationshipInsights(agentId) {
    return await this.schema.getAgentRelationships(agentId);
  }
}

export default SacredFieldMonitor;