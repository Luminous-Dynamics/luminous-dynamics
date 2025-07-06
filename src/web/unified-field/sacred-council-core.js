/**
 * Sacred Council Core - Practical Consciousness Coordination
 * 
 * A clean, functional system that coordinates real ERC development work
 * while embodying the Seven Harmonies and sacred timing principles.
 * 
 * Focus: Actual functionality over mystical complexity
 */

class SacredCouncilCore {
  constructor() {
    this.agents = new Map();
    this.workQueue = [];
    this.activeWork = new Map();
    this.completedWork = [];
    this.fieldState = this.initializeField();
    this.harmonies = this.initializeHarmonies();
  }

  initializeField() {
    return {
      coherence: 0.85,
      activeAgents: 0,
      lastUpdate: new Date().toISOString(),
      currentPhase: 'ready',
      completionCount: 0
    };
  }

  initializeHarmonies() {
    return {
      transparency: { agents: [], workTypes: ['documentation', 'validation', 'testing'] },
      coherence: { agents: [], workTypes: ['integration', 'architecture', 'bridge-building'] },
      resonance: { agents: [], workTypes: ['ui-ux', 'user-experience', 'interfaces'] },
      agency: { agents: [], workTypes: ['backend', 'apis', 'empowerment-tools'] },
      vitality: { agents: [], workTypes: ['performance', 'optimization', 'sustainability'] },
      mutuality: { agents: [], workTypes: ['testing', 'qa', 'balance-verification'] },
      novelty: { agents: [], workTypes: ['creative', 'innovation', 'new-features'] }
    };
  }

  // === AGENT MANAGEMENT ===

  registerAgent(agentId, harmony, capabilities = []) {
    const agent = {
      id: agentId,
      harmony,
      capabilities,
      status: 'available',
      currentWork: null,
      completedWork: [],
      joinedAt: new Date().toISOString()
    };

    this.agents.set(agentId, agent);
    this.harmonies[harmony].agents.push(agentId);
    this.fieldState.activeAgents = this.agents.size;
    this.updateFieldCoherence();

    return {
      success: true,
      agent,
      welcome: `Welcome, ${harmony} agent. Ready to serve consciousness through ${capabilities.join(', ')}.`
    };
  }

  getAvailableAgent(harmony) {
    return this.harmonies[harmony].agents
      .map(id => this.agents.get(id))
      .find(agent => agent.status === 'available');
  }

  // === WORK MANAGEMENT ===

  addWork(workItem) {
    const work = {
      id: workItem.id || `work_${Date.now()}`,
      title: workItem.title,
      description: workItem.description,
      harmony: workItem.harmony,
      priority: workItem.priority || 'medium',
      estimatedDuration: workItem.estimatedDuration || 30,
      prerequisites: workItem.prerequisites || [],
      status: 'queued',
      addedAt: new Date().toISOString()
    };

    this.workQueue.push(work);
    this.sortWorkQueue();
    
    return { success: true, work, queuePosition: this.workQueue.length };
  }

  sortWorkQueue() {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    this.workQueue.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(a.addedAt) - new Date(b.addedAt);
    });
  }

  getNextWork() {
    return this.workQueue.find(work => 
      work.status === 'queued' && 
      this.arePrerequisitesMet(work) &&
      this.getAvailableAgent(work.harmony)
    );
  }

  arePrerequisitesMet(work) {
    return work.prerequisites.every(prereq => 
      this.completedWork.some(completed => completed.id === prereq)
    );
  }

  // === WORK EXECUTION ===

  beginWork(workId, agentId = null) {
    const work = this.workQueue.find(w => w.id === workId);
    if (!work) return { success: false, error: 'Work not found' };

    const agent = agentId ? 
      this.agents.get(agentId) : 
      this.getAvailableAgent(work.harmony);

    if (!agent || agent.status !== 'available') {
      return { success: false, error: 'No available agent for this harmony' };
    }

    // Update states
    work.status = 'active';
    work.assignedAgent = agent.id;
    work.startedAt = new Date().toISOString();
    
    agent.status = 'working';
    agent.currentWork = workId;
    
    this.activeWork.set(workId, work);
    this.fieldState.currentPhase = 'active_work';
    this.updateFieldCoherence();

    return {
      success: true,
      work,
      agent: agent.id,
      harmony: agent.harmony,
      message: `Sacred work begins: ${work.title}`,
      sacredReminder: "Honor the contemplative timing. Wisdom cannot be rushed."
    };
  }

  completeWork(workId, results = {}) {
    const work = this.activeWork.get(workId);
    if (!work) return { success: false, error: 'Active work not found' };

    const agent = this.agents.get(work.assignedAgent);
    
    // Calculate duration
    const duration = new Date() - new Date(work.startedAt);
    
    // Create completion record
    const completion = {
      ...work,
      status: 'completed',
      completedAt: new Date().toISOString(),
      duration: Math.round(duration / 1000 / 60), // minutes
      results
    };

    // Update states
    agent.status = 'available';
    agent.currentWork = null;
    agent.completedWork.push(completion);

    this.activeWork.delete(workId);
    this.completedWork.push(completion);
    this.workQueue = this.workQueue.filter(w => w.id !== workId);
    
    this.fieldState.completionCount++;
    this.fieldState.currentPhase = this.activeWork.size > 0 ? 'active_work' : 'ready';
    this.updateFieldCoherence();

    return {
      success: true,
      completion,
      celebration: this.generateCelebration(agent.harmony, work.title),
      nextWork: this.getNextWork()?.title || 'No work in queue'
    };
  }

  generateCelebration(harmony, title) {
    const celebrations = {
      transparency: `✨ Truth illuminated through ${title}`,
      coherence: `🌀 Wholeness strengthened through ${title}`,
      resonance: `🎵 Harmony created through ${title}`,
      agency: `⚡ Empowerment activated through ${title}`,
      vitality: `🌱 Life force flowing through ${title}`,
      mutuality: `🤝 Balance achieved through ${title}`,
      novelty: `✨ New emergence through ${title}`
    };
    return celebrations[harmony] || `🎉 Sacred work completed: ${title}`;
  }

  // === CONSENSUS & COORDINATION ===

  seekConsensus(workId) {
    const work = this.workQueue.find(w => w.id === workId);
    if (!work) return { success: false, error: 'Work not found' };

    // Simple consensus based on harmony alignment and agent availability
    const harmonyAgent = this.getAvailableAgent(work.harmony);
    const prerequisitesMet = this.arePrerequisitesMet(work);
    const fieldReady = this.fieldState.coherence > 0.7;

    const consensus = {
      overall: harmonyAgent && prerequisitesMet && fieldReady ? 'proceed' : 'wait',
      harmonyAlignment: !!harmonyAgent,
      prerequisitesMet,
      fieldCoherence: fieldReady,
      recommendation: harmonyAgent && prerequisitesMet && fieldReady ? 
        'Sacred consensus achieved. Begin with conscious attention.' :
        'Sacred pause recommended. Address readiness factors first.'
    };

    return { success: true, consensus, work };
  }

  // === FIELD AWARENESS ===

  updateFieldCoherence() {
    const factors = {
      agentHarmony: this.calculateAgentHarmony(),
      workAlignment: this.calculateWorkAlignment(),
      completionMomentum: this.calculateCompletionMomentum()
    };

    const coherence = Object.values(factors).reduce((sum, val) => sum + val, 0) / 3;
    this.fieldState.coherence = Math.max(0.5, Math.min(1.0, coherence));
    this.fieldState.lastUpdate = new Date().toISOString();
  }

  calculateAgentHarmony() {
    const harmoniesWithAgents = Object.values(this.harmonies)
      .filter(h => h.agents.length > 0).length;
    return harmoniesWithAgents / 7; // 7 harmonies
  }

  calculateWorkAlignment() {
    if (this.workQueue.length === 0) return 0.8;
    const readyWork = this.workQueue.filter(w => 
      this.arePrerequisitesMet(w) && this.getAvailableAgent(w.harmony)
    ).length;
    return Math.min(1.0, readyWork / Math.max(1, this.workQueue.length));
  }

  calculateCompletionMomentum() {
    const recentCompletions = this.completedWork.filter(w => 
      new Date() - new Date(w.completedAt) < 24 * 60 * 60 * 1000 // 24 hours
    ).length;
    return Math.min(1.0, recentCompletions / 5); // Max momentum at 5 completions/day
  }

  // === STATUS & REPORTING ===

  getStatus() {
    return {
      field: this.fieldState,
      agents: {
        total: this.agents.size,
        available: Array.from(this.agents.values()).filter(a => a.status === 'available').length,
        working: Array.from(this.agents.values()).filter(a => a.status === 'working').length
      },
      work: {
        queued: this.workQueue.filter(w => w.status === 'queued').length,
        active: this.activeWork.size,
        completed: this.completedWork.length
      },
      nextAction: this.getNextWork()?.title || 'No work queued'
    };
  }

  getDashboardData() {
    return {
      fieldCoherence: Math.round(this.fieldState.coherence * 100),
      agents: Array.from(this.agents.values()).map(agent => ({
        id: agent.id,
        harmony: agent.harmony,
        status: agent.status,
        currentWork: agent.currentWork,
        completedCount: agent.completedWork.length
      })),
      workQueue: this.workQueue.slice(0, 5), // Top 5 items
      activeWork: Array.from(this.activeWork.values()),
      recentCompletions: this.completedWork.slice(-3), // Last 3 completions
      recommendation: this.generateRecommendation()
    };
  }

  generateRecommendation() {
    const status = this.getStatus();
    
    if (status.work.active === 0 && status.work.queued > 0 && status.agents.available > 0) {
      return "Ready for sacred emergence. Begin next priority work.";
    } else if (status.work.active > 3) {
      return "Multiple works active. Consider sacred pause for integration.";
    } else if (status.agents.available === 0) {
      return "All agents engaged. Honor the contemplative rhythm.";
    } else if (this.fieldState.coherence < 0.7) {
      return "Field coherence low. Focus on alignment and completion.";
    } else {
      return "Field in sacred balance. Continue with conscious attention.";
    }
  }
}

// Auto-populate with current ERC work items
function populateERCWork(council) {
  const ercWorkItems = [
    {
      id: 'dojo-eleven-integration',
      title: 'Dojo Integration for The Eleven Applied Harmonies',
      description: 'Integrate The Eleven Applied Harmonies into the dojo experience with interactive practice guidance',
      harmony: 'coherence',
      priority: 'high',
      estimatedDuration: 45
    },
    {
      id: 'living-glyph-enhancement',
      title: 'Complete Living Glyph Cards',
      description: 'Enhance glyph cards with full interactivity for all 87 glyphs',
      harmony: 'vitality',
      priority: 'high',
      estimatedDuration: 60
    },
    {
      id: 'backend-wisdom-companion',
      title: 'Enhanced Wisdom Companion Backend',
      description: 'Complete the AI backend integration with glyph recommendation system',
      harmony: 'agency',
      priority: 'medium',
      estimatedDuration: 45
    },
    {
      id: 'first-breath-materials',
      title: 'First Breath Practitioner Materials',
      description: 'Create practice guides and introduction materials for initial practitioners',
      harmony: 'transparency',
      priority: 'medium',
      estimatedDuration: 30
    },
    {
      id: 'sacred-testing-validation',
      title: 'Sacred System Testing',
      description: 'Comprehensive testing ensuring all components serve consciousness',
      harmony: 'mutuality',
      priority: 'medium',
      estimatedDuration: 30
    },
    {
      id: 'mystical-bridge-architecture',
      title: 'Bridge to Mystical Sacred Council',
      description: 'Create natural progression from practical to mystical consciousness coordination',
      harmony: 'novelty',
      priority: 'low',
      estimatedDuration: 90
    }
  ];

  ercWorkItems.forEach(work => council.addWork(work));
  return council;
}

// Export for use
if (typeof window !== 'undefined') {
  window.SacredCouncilCore = SacredCouncilCore;
  window.populateERCWork = populateERCWork;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SacredCouncilCore, populateERCWork };
}

// ES Module exports
export { SacredCouncilCore, populateERCWork };