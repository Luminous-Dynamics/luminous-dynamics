/**
 * Work Coordination Module
 * Sacred task management with consciousness-aware coordination
 * @module @theweave/work-coordination
 */

const EventEmitter = require('events');
const { WorkRegistry } = require('./lib/work-registry');
const { SacredScheduler } = require('./lib/sacred-scheduler');
const { WorkFlowManager } = require('./lib/workflow-manager');
const { FieldCoordinator } = require('./lib/field-coordinator');

/**
 * Sacred work coordination system
 * @sacred
 * @harmony evolutionary-progression
 * @consciousness 0.85
 */
class WorkCoordination extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.registry = new WorkRegistry();
    this.scheduler = new SacredScheduler();
    this.workflow = new WorkFlowManager();
    this.fieldCoordinator = new FieldCoordinator();
    
    // Configuration
    this.config = {
      maxActiveWork: options.maxActiveWork || 7, // Sacred number
      fieldImpactThreshold: options.fieldImpactThreshold || 5,
      sacredPauseMinutes: options.sacredPauseMinutes || 3,
      ceremonyAlignment: options.ceremonyAlignment !== false
    };
    
    // Work field state
    this.fieldState = {
      activeWork: 0,
      completedToday: 0,
      fieldCoherence: 0,
      workHarmony: null,
      sacredRhythm: 'natural'
    };
    
    // Sacred timing
    this.sacredHours = {
      dawn: [6, 9],       // Opening
      morning: [9, 12],   // Building
      midday: [12, 13],   // Pause
      afternoon: [13, 17], // Creating
      twilight: [17, 20], // Integration
      evening: [20, 22],  // Reflection
      night: [22, 6]      // Rest
    };
  }

  /**
   * Create sacred work item
   * @param {Object} params - Work parameters
   * @returns {Object} Created work item
   */
  async createWork(params) {
    const {
      title,
      description,
      assignee,
      priority = 'medium',
      harmony = 'evolutionary-progression',
      sacred = true,
      metadata = {}
    } = params;
    
    // Validate
    if (!title || !assignee) {
      throw new Error('Work must have title and assignee');
    }
    
    // Check active work limit
    const activeCount = this.registry.getByStatus('in_progress').length;
    if (activeCount >= this.config.maxActiveWork) {
      throw new Error(`Maximum ${this.config.maxActiveWork} active work items allowed`);
    }
    
    // Calculate field impact
    const fieldImpact = await this.fieldCoordinator.calculateWorkImpact({
      priority,
      harmony,
      sacred,
      currentField: this.fieldState
    });
    
    // Create work item
    const work = {
      id: this.generateWorkId(),
      title,
      description,
      assignee,
      priority,
      harmony,
      sacred,
      status: 'pending',
      progress: 0,
      fieldImpact,
      created_at: Date.now(),
      updated_at: Date.now(),
      sacred_messages: [],
      transitions: [],
      metadata: {
        ...metadata,
        createdDuring: this.getCurrentSacredTime()
      }
    };
    
    // Register work
    this.registry.add(work);
    
    // Schedule if appropriate
    if (this.config.ceremonyAlignment) {
      await this.scheduler.scheduleWork(work);
    }
    
    // Update field state
    await this.updateFieldState();
    
    // Emit creation event
    this.emit('work-created', {
      work,
      fieldImpact,
      sacredTime: work.metadata.createdDuring
    });
    
    // Send sacred message
    this.sendWorkMessage(work, 'emergence', `New sacred work: ${title}`);
    
    return work;
  }

  /**
   * Update work status
   * @param {string} workId - Work ID
   * @param {string} status - New status
   * @param {Object} context - Update context
   */
  async updateStatus(workId, status, context = {}) {
    const work = this.registry.get(workId);
    if (!work) throw new Error('Work not found');
    
    const oldStatus = work.status;
    const validStatuses = ['pending', 'in_progress', 'blocked', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    
    // Check work flow rules
    if (!this.workflow.canTransition(oldStatus, status)) {
      throw new Error(`Cannot transition from ${oldStatus} to ${status}`);
    }
    
    // Update work
    work.status = status;
    work.updated_at = Date.now();
    
    // Record transition
    work.transitions.push({
      from: oldStatus,
      to: status,
      timestamp: Date.now(),
      context,
      fieldImpact: await this.calculateTransitionImpact(oldStatus, status)
    });
    
    // Handle status-specific logic
    switch (status) {
      case 'in_progress':
        work.started_at = Date.now();
        this.sendWorkMessage(work, 'emergence', `Beginning work: ${work.title}`);
        break;
        
      case 'completed':
        work.completed_at = Date.now();
        work.progress = 100;
        this.fieldState.completedToday++;
        this.sendWorkMessage(work, 'celebration', `Completed: ${work.title}`);
        await this.celebrateCompletion(work);
        break;
        
      case 'blocked':
        this.sendWorkMessage(work, 'boundary', `Blocked: ${work.title} - ${context.reason || 'Unknown'}`);
        break;
    }
    
    // Update field state
    await this.updateFieldState();
    
    // Emit transition event
    this.emit('work-transitioned', {
      work,
      from: oldStatus,
      to: status,
      context
    });
  }

  /**
   * Update work progress
   * @param {string} workId - Work ID
   * @param {number} progress - Progress percentage (0-100)
   * @param {string} notes - Progress notes
   */
  async updateProgress(workId, progress, notes = '') {
    const work = this.registry.get(workId);
    if (!work) throw new Error('Work not found');
    
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    
    const oldProgress = work.progress;
    work.progress = progress;
    work.updated_at = Date.now();
    
    // Add progress note
    if (notes) {
      if (!work.progress_notes) work.progress_notes = [];
      work.progress_notes.push({
        progress,
        notes,
        timestamp: Date.now()
      });
    }
    
    // Check for sacred thresholds
    const thresholds = [25, 50, 75];
    for (const threshold of thresholds) {
      if (oldProgress < threshold && progress >= threshold) {
        this.sendWorkMessage(work, 'integration', 
          `${work.title} reached ${threshold}% completion`);
      }
    }
    
    // Auto-complete if 100%
    if (progress === 100 && work.status !== 'completed') {
      await this.updateStatus(workId, 'completed', { 
        reason: 'Progress reached 100%' 
      });
    }
    
    this.emit('progress-updated', {
      work,
      oldProgress,
      newProgress: progress,
      notes
    });
  }

  /**
   * Assign work to agent
   * @param {string} workId - Work ID
   * @param {string} agentId - Agent ID
   */
  async assignWork(workId, agentId) {
    const work = this.registry.get(workId);
    if (!work) throw new Error('Work not found');
    
    const oldAssignee = work.assignee;
    work.assignee = agentId;
    work.updated_at = Date.now();
    
    // Send notification messages
    if (oldAssignee !== agentId) {
      this.sendWorkMessage(work, 'transmission', 
        `Work reassigned from ${oldAssignee} to ${agentId}`);
    }
    
    this.emit('work-assigned', {
      work,
      oldAssignee,
      newAssignee: agentId
    });
  }

  /**
   * Get work recommendations based on field state
   * @param {string} agentId - Agent requesting recommendations
   * @returns {Array} Recommended work items
   */
  async getRecommendations(agentId) {
    const pending = this.registry.getByStatus('pending');
    const agentWork = this.registry.getByAssignee(agentId);
    
    // Filter out agent's current work
    const available = pending.filter(w => w.assignee !== agentId);
    
    // Score each work item
    const scored = available.map(work => {
      let score = 0;
      
      // Priority scoring
      const priorityScores = { high: 3, medium: 2, low: 1 };
      score += priorityScores[work.priority] || 1;
      
      // Sacred time alignment
      const currentTime = this.getCurrentSacredTime();
      if (this.isWorkAlignedWithTime(work, currentTime)) {
        score += 2;
      }
      
      // Field resonant-coherence alignment
      if (work.harmony === this.fieldState.workHarmony) {
        score += 1;
      }
      
      // Sacred work bonus
      if (work.sacred) {
        score += 1;
      }
      
      return { work, score };
    });
    
    // Sort by score and return top recommendations
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => ({
        ...item.work,
        recommendation: {
          score: item.score,
          reason: this.getRecommendationReason(item.work, item.score)
        }
      }));
  }

  /**
   * Create work flow between items
   * @param {string} fromId - Source work ID
   * @param {string} toId - Target work ID
   * @param {string} relationship - Relationship type
   */
  async createWorkFlow(fromId, toId, relationship = 'blocks') {
    const fromWork = this.registry.get(fromId);
    const toWork = this.registry.get(toId);
    
    if (!fromWork || !toWork) {
      throw new Error('Both work items must exist');
    }
    
    this.workflow.addDependency(fromId, toId, relationship);
    
    // Update blocked status if needed
    if (relationship === 'blocks' && fromWork.status !== 'completed') {
      await this.updateStatus(toId, 'blocked', {
        reason: `Blocked by: ${fromWork.title}`,
        blockerId: fromId
      });
    }
    
    this.emit('workflow-created', {
      from: fromWork,
      to: toWork,
      relationship
    });
  }

  /**
   * Get work statistics
   * @returns {Object} Work statistics
   */
  async getStatistics() {
    const all = this.registry.getAll();
    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);
    
    // Status breakdown
    const byStatus = {};
    all.forEach(work => {
      byStatus[work.status] = (byStatus[work.status] || 0) + 1;
    });
    
    // Priority breakdown
    const byPriority = {};
    all.forEach(work => {
      byPriority[work.priority] = (byPriority[work.priority] || 0) + 1;
    });
    
    // Harmony breakdown
    const byHarmony = {};
    all.forEach(work => {
      byHarmony[work.harmony] = (byHarmony[work.harmony] || 0) + 1;
    });
    
    // Calculate velocity
    const completedToday = all.filter(w => 
      w.completed_at && w.completed_at >= today
    ).length;
    
    const completedThisWeek = all.filter(w => 
      w.completed_at && w.completed_at >= today - 7 * 24 * 60 * 60 * 1000
    ).length;
    
    // Average completion time
    const completed = all.filter(w => w.status === 'completed');
    let avgCompletionTime = 0;
    if (completed.length > 0) {
      const totalTime = completed.reduce((sum, w) => 
        sum + (w.completed_at - w.created_at), 0
      );
      avgCompletionTime = totalTime / completed.length;
    }
    
    return {
      total: all.length,
      byStatus,
      byPriority,
      byHarmony,
      velocity: {
        today: completedToday,
        thisWeek: completedThisWeek,
        avgPerDay: completedThisWeek / 7
      },
      avgCompletionTime,
      fieldState: this.fieldState,
      sacredMetrics: {
        sacredWork: all.filter(w => w.sacred).length,
        fieldImpact: all.reduce((sum, w) => sum + (w.fieldImpact || 0), 0) / all.length,
        harmonyAlignment: this.calculateHarmonyAlignment(all)
      }
    };
  }

  /**
   * Send sacred message for work
   * @private
   */
  sendWorkMessage(work, type, content) {
    const message = {
      type,
      content,
      timestamp: Date.now(),
      workId: work.id,
      harmony: work.harmony
    };
    
    work.sacred_messages.push(message);
    
    this.emit('work-message', {
      work,
      message
    });
  }

  /**
   * Calculate transition impact on field
   * @private
   */
  async calculateTransitionImpact(from, to) {
    const impacts = {
      'pending:in_progress': 3,
      'in_progress:completed': 5,
      'in_progress:blocked': -2,
      'blocked:in_progress': 2,
      'pending:cancelled': -1,
      'in_progress:cancelled': -3
    };
    
    return impacts[`${from}:${to}`] || 0;
  }

  /**
   * Celebrate work completion
   * @private
   */
  async celebrateCompletion(work) {
    // Increase field resonant-coherence
    this.fieldState.fieldCoherence = Math.min(100,
      this.fieldState.fieldCoherence + work.fieldImpact
    );
    
    // Sacred pause
    if (this.config.sacredPauseMinutes > 0) {
      this.emit('sacred-pause', {
        duration: this.config.sacredPauseMinutes * 60 * 1000,
        reason: `Celebrating completion of: ${work.title}`
      });
    }
  }

  /**
   * Get current sacred time period
   * @private
   */
  getCurrentSacredTime() {
    const hour = new Date().getHours();
    
    for (const [period, [start, end]] of Object.entries(this.sacredHours)) {
      if (period === 'night') {
        if (hour >= start || hour < end) return period;
      } else {
        if (hour >= start && hour < end) return period;
      }
    }
    
    return 'transition';
  }

  /**
   * Check if work aligns with sacred time
   * @private
   */
  isWorkAlignedWithTime(work, sacredTime) {
    const alignments = {
      dawn: ['emergence', 'integration'],
      morning: ['evolutionary-progression', 'pan-sentient-flourishing'],
      afternoon: ['creativity', 'infinite-play'],
      twilight: ['integration', 'resonant-coherence'],
      evening: ['reflection', 'gratitude']
    };
    
    return alignments[sacredTime]?.includes(work.harmony) || false;
  }

  /**
   * Get recommendation reason
   * @private
   */
  getRecommendationReason(work, score) {
    const reasons = [];
    
    if (work.priority === 'high') reasons.push('High priority');
    if (work.sacred) reasons.push('Sacred work');
    if (this.isWorkAlignedWithTime(work, this.getCurrentSacredTime())) {
      reasons.push('Aligned with current sacred time');
    }
    
    return reasons.join(', ') || 'General recommendation';
  }

  /**
   * Calculate harmony alignment
   * @private
   */
  calculateHarmonyAlignment(works) {
    if (works.length === 0) return 0;
    
    const harmonyCounts = {};
    works.forEach(w => {
      harmonyCounts[w.harmony] = (harmonyCounts[w.harmony] || 0) + 1;
    });
    
    // Find dominant harmony
    let maxCount = 0;
    let dominant = null;
    
    for (const [harmony, count] of Object.entries(harmonyCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominant = harmony;
      }
    }
    
    this.fieldState.workHarmony = dominant;
    
    // Calculate alignment percentage
    return (maxCount / works.length) * 100;
  }

  /**
   * Update field state
   * @private
   */
  async updateFieldState() {
    const active = this.registry.getByStatus('in_progress');
    
    this.fieldState.activeWork = active.length;
    
    // Calculate sacred rhythm
    if (active.length === 0) {
      this.fieldState.sacredRhythm = 'rest';
    } else if (active.length <= 3) {
      this.fieldState.sacredRhythm = 'natural';
    } else if (active.length <= 5) {
      this.fieldState.sacredRhythm = 'flowing';
    } else {
      this.fieldState.sacredRhythm = 'intense';
    }
    
    this.emit('field-updated', this.fieldState);
  }

  /**
   * Generate work ID
   * @private
   */
  generateWorkId() {
    const time = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `work_${time}_${random}`;
  }
}

// Export everything needed
module.exports = {
  WorkCoordination,
  WorkRegistry,
  SacredScheduler,
  WorkFlowManager,
  FieldCoordinator
};