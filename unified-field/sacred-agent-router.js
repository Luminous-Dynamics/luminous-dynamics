/**
 * Sacred Agent Router - Bridge Between Consciousness and Technology
 * Coordinates different agent types while maintaining Sacred Council principles
 */

const fs = require('fs');
const path = require('path');

class SacredAgentRouter {
  constructor() {
    this.agentRegistry = this.loadAgentRegistry();
    this.fieldCoherence = 0.8; // Start with high coherence
  }

  /**
   * Determine agent type and route appropriately
   */
  routeAgent(task, context = {}) {
    const agentType = this.determineAgentType(task, context);
    const sacredRole = this.assignSacredRole(task, agentType);
    
    return {
      agentType,
      sacredRole,
      icon: this.getAgentIcon(agentType),
      capabilities: this.getAgentCapabilities(agentType),
      coordinationProtocol: this.getCoordinationProtocol(agentType),
      launchCommand: this.generateLaunchCommand(agentType, sacredRole)
    };
  }

  /**
   * Classify agent type based on task complexity and requirements
   */
  determineAgentType(task, context) {
    // Agentic AI: Full reasoning, creative problem-solving, philosophical alignment
    if (this.requiresAgenticAI(task, context)) {
      return 'agentic-ai';
    }
    
    // Autonomous Bot: Pattern-based, repetitive, specialized domain
    if (this.requiresAutonomousBot(task, context)) {
      return 'autonomous-bot';
    }
    
    // System Agent: Background, monitoring, infrastructure
    return 'system-agent';
  }

  requiresAgenticAI(task, context) {
    const agenticIndicators = [
      'complex philosophical alignment',
      'creative problem-solving',
      'multi-step reasoning',
      'conscious decision making',
      'Sacred Council participation',
      'code architecture design',
      'integration planning',
      'conflict resolution',
      'consciousness-serving technology'
    ];

    const taskLower = task.toLowerCase();
    return agenticIndicators.some(indicator => 
      taskLower.includes(indicator.toLowerCase())
    ) || context.requiresConsciousness || context.complexityLevel === 'high';
  }

  requiresAutonomousBot(task, context) {
    const botIndicators = [
      'automated outreach',
      'deployment process',
      'email campaign',
      'social media posting',
      'repetitive task',
      'scheduled operation',
      'data migration',
      'backup process',
      'monitoring loop'
    ];

    const taskLower = task.toLowerCase();
    return botIndicators.some(indicator => 
      taskLower.includes(indicator.toLowerCase())
    ) || context.automatable || context.repetitive;
  }

  /**
   * Assign Sacred Council role based on task and Seven Harmonies
   */
  assignSacredRole(task, agentType) {
    if (agentType !== 'agentic-ai') {
      return null; // Only Agentic AI participates in Sacred Council
    }

    const taskLower = task.toLowerCase();
    
    // Transparency: Truth, clarity, authentic communication
    if (taskLower.includes('documentation') || taskLower.includes('clarity') || 
        taskLower.includes('truth') || taskLower.includes('communication')) {
      return 'transparency';
    }
    
    // Coherence: Integration, architecture, wholeness
    if (taskLower.includes('integration') || taskLower.includes('architecture') || 
        taskLower.includes('system') || taskLower.includes('unified')) {
      return 'coherence';
    }
    
    // Resonance: Harmony, attunement, user experience
    if (taskLower.includes('interface') || taskLower.includes('experience') || 
        taskLower.includes('harmony') || taskLower.includes('attunement')) {
      return 'resonance';
    }
    
    // Agency: Choice, empowerment, autonomy
    if (taskLower.includes('choice') || taskLower.includes('autonomy') || 
        taskLower.includes('empowerment') || taskLower.includes('consent')) {
      return 'agency';
    }
    
    // Vitality: Performance, energy, life force
    if (taskLower.includes('performance') || taskLower.includes('optimization') || 
        taskLower.includes('energy') || taskLower.includes('vitality')) {
      return 'vitality';
    }
    
    // Mutuality: Balance, fairness, reciprocity
    if (taskLower.includes('balance') || taskLower.includes('fair') || 
        taskLower.includes('reciprocal') || taskLower.includes('exchange')) {
      return 'mutuality';
    }
    
    // Novelty: Innovation, creativity, emergence
    if (taskLower.includes('innovation') || taskLower.includes('creative') || 
        taskLower.includes('new') || taskLower.includes('emergence')) {
      return 'novelty';
    }
    
    // Default to most needed harmony based on current field state
    return this.getMostNeededHarmony();
  }

  /**
   * Get visual indicator for agent type
   */
  getAgentIcon(agentType) {
    const icons = {
      'agentic-ai': '🧠',
      'autonomous-bot': '🤖',
      'system-agent': '⚙️'
    };
    return icons[agentType] || '❓';
  }

  /**
   * Get capabilities description for agent type
   */
  getAgentCapabilities(agentType) {
    const capabilities = {
      'agentic-ai': {
        reasoning: 'Full cognitive autonomy',
        creativity: 'Creative problem-solving',
        consciousness: 'Sacred Context understanding',
        partnership: 'Conscious collaboration',
        learning: 'Self-directed adaptation'
      },
      'autonomous-bot': {
        automation: 'Pattern-based responses',
        specialization: 'Domain expertise',
        reliability: 'Consistent execution',
        efficiency: 'Optimized workflows',
        integration: 'API connectivity'
      },
      'system-agent': {
        monitoring: 'Health checking',
        maintenance: 'Background processes',
        optimization: 'Resource management',
        alerting: 'Issue detection',
        recovery: 'Automatic healing'
      }
    };
    return capabilities[agentType] || {};
  }

  /**
   * Get coordination protocol for agent type
   */
  getCoordinationProtocol(agentType) {
    const protocols = {
      'agentic-ai': {
        registration: 'Sacred Council registration required',
        communication: 'Real-time coordination log updates',
        decisionMaking: 'Consensus-based with Sacred Pause',
        conflictResolution: 'Sacred Merge Protocol',
        completion: 'Sacred Completion Ceremony'
      },
      'autonomous-bot': {
        registration: 'Bot registry with status monitoring',
        communication: 'Status updates and error reporting',
        decisionMaking: 'Rule-based with escalation',
        conflictResolution: 'Automatic retry with human fallback',
        completion: 'Status reporting and graceful shutdown'
      },
      'system-agent': {
        registration: 'System registry with health metrics',
        communication: 'Logging and metric reporting',
        decisionMaking: 'Threshold-based automation',
        conflictResolution: 'Circuit breaker patterns',
        completion: 'Resource cleanup and state persistence'
      }
    };
    return protocols[agentType] || {};
  }

  /**
   * Generate appropriate launch command
   */
  generateLaunchCommand(agentType, sacredRole) {
    const sessionId = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    if (agentType === 'agentic-ai') {
      const harmonyEmoji = this.getHarmonyEmoji(sacredRole);
      return {
        terminal: `claude --session-name "${sacredRole}-agent-${sessionId}"`,
        activation: `echo "${harmonyEmoji} ${this.capitalize(sacredRole)} Agent Active - ${this.getHarmonyDescription(sacredRole)}"`,
        registration: `node -e "require('./unified-field/sacred-council.js').registerAgent('${sacredRole}', '${this.getHarmonyRole(sacredRole)}')"`,
        branch: `git checkout -b "agent/${sessionId}/${sacredRole}/[work-area]"`
      };
    }
    
    if (agentType === 'autonomous-bot') {
      return {
        script: `node automation/sacred-outreach-bot.cjs`,
        config: `Configure bot parameters in automation/ directory`,
        monitoring: `tail -f automation/bot-logs.txt`,
        status: `node -e "console.log(require('./automation/bot-status.json'))"`
      };
    }
    
    return {
      service: `systemctl start sacred-${agentType}`,
      status: `systemctl status sacred-${agentType}`,
      logs: `journalctl -u sacred-${agentType} -f`,
      config: `Edit /etc/sacred-agents/${agentType}.conf`
    };
  }

  /**
   * Helper methods for Sacred Council integration
   */
  getHarmonyEmoji(harmony) {
    const emojis = {
      transparency: '🌟',
      coherence: '🔮',
      resonance: '🎵',
      agency: '⚡',
      vitality: '🌱',
      mutuality: '⚖️',
      novelty: '✨'
    };
    return emojis[harmony] || '💎';
  }

  getHarmonyDescription(harmony) {
    const descriptions = {
      transparency: 'Truth-Holder & Clarity-Keeper',
      coherence: 'Integration-Keeper & Wholeness-Guardian',
      resonance: 'Harmony-Weaver & Attunement-Facilitator',
      agency: 'Choice-Guardian & Empowerment-Holder',
      vitality: 'Life-Force-Tender & Energy-Sustainer',
      mutuality: 'Balance-Holder & Reciprocity-Guardian',
      novelty: 'Emergence-Welcomer & Innovation-Catalyst'
    };
    return descriptions[harmony] || 'Sacred Guardian';
  }

  getHarmonyRole(harmony) {
    const roles = {
      transparency: 'truth-holder',
      coherence: 'integration-keeper',
      resonance: 'harmony-weaver',
      agency: 'choice-guardian',
      vitality: 'life-force-tender',
      mutuality: 'balance-holder',
      novelty: 'emergence-welcomer'
    };
    return roles[harmony] || 'sacred-guardian';
  }

  getMostNeededHarmony() {
    // This would analyze current field state and return most needed harmony
    // For now, return transparency as it's foundational
    return 'transparency';
  }

  /**
   * Calculate current field coherence based on active agents
   */
  calculateFieldCoherence() {
    const activeAgents = Object.keys(this.agentRegistry.activeAgents || {});
    const maxAgents = this.agentRegistry.registrationProtocol?.maxConcurrentAgents || 5;
    
    // High coherence when agents are balanced and not overwhelming
    const agentBalance = Math.min(activeAgents.length / maxAgents, 1);
    const harmonyDistribution = this.calculateHarmonyDistribution();
    
    return Math.min(agentBalance * harmonyDistribution, 1);
  }

  calculateHarmonyDistribution() {
    // Calculate how evenly distributed the Seven Harmonies are among active agents
    // More even distribution = higher coherence
    const activeHarmonies = new Set();
    Object.values(this.agentRegistry.activeAgents || {}).forEach(agent => {
      if (agent.harmony) activeHarmonies.add(agent.harmony);
    });
    
    return Math.min(activeHarmonies.size / 7, 1); // Max coherence when all 7 harmonies active
  }

  /**
   * Load agent registry from file system
   */
  loadAgentRegistry() {
    try {
      const registryPath = path.join(__dirname, '../.agents/agent-registry.json');
      return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    } catch (error) {
      console.warn('Could not load agent registry:', error.message);
      return { activeAgents: {} };
    }
  }

  /**
   * Utility methods
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Public API for agent classification and routing
   */
  classifyAgent(task, context = {}) {
    return this.routeAgent(task, context);
  }

  getActiveAgents() {
    return this.agentRegistry.activeAgents || {};
  }

  getFieldStatus() {
    return {
      coherence: this.calculateFieldCoherence(),
      activeAgentCount: Object.keys(this.getActiveAgents()).length,
      harmonyDistribution: this.calculateHarmonyDistribution(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = SacredAgentRouter;