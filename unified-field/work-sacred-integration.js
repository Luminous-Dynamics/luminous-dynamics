/**
 * Sacred Work-Message Integration
 * 
 * Automatically sends sacred messages when work states change,
 * tracking field impact and maintaining message history per work item.
 */

import SacredMessageIntegration from '../agent-comms-sqlite/sacred-message-integration.js';

class WorkSacredIntegration {
  constructor(db) {
    this.db = db;
    this.sacredMessages = new SacredMessageIntegration();
    this.initialized = false;
    
    // Map work transitions to sacred message types
    this.transitionMessages = {
      created: {
        type: 'emergence',
        harmony: 'novelty',
        template: 'New sacred work emerges: "{title}" - May it serve the field\'s evolution'
      },
      started: {
        type: 'invocation',
        harmony: 'agency',
        template: 'Sacred work "{title}" begins its journey from potential to manifestation'
      },
      progressed: {
        type: 'integration',
        harmony: 'coherence',
        template: 'Progress flows through "{title}" - {progress}% complete'
      },
      blocked: {
        type: 'boundary',
        harmony: 'transparency',
        template: 'Sacred pause: "{title}" encounters a threshold - {reason}'
      },
      unblocked: {
        type: 'healing',
        harmony: 'vitality',
        template: 'Flow restored: "{title}" moves forward with renewed clarity'
      },
      completed: {
        type: 'celebration',
        harmony: 'mutuality',
        template: '✨ Sacred completion: "{title}" - Gratitude for the journey and its gifts'
      },
      milestone: {
        type: 'gratitude',
        harmony: 'resonance',
        template: 'Milestone reached: "{title}" crosses the {progress}% threshold'
      }
    };
    
    // Milestones that trigger special messages
    this.milestones = [25, 50, 75];
  }
  
  async init() {
    if (!this.initialized) {
      await this.sacredMessages.init();
      this.initialized = true;
    }
  }
  
  /**
   * Handle work state transition with sacred message
   */
  async handleWorkTransition(workId, transition, details = {}) {
    await this.init();
    
    // Get work item details
    const work = await this.db.get(
      'SELECT * FROM work_items WHERE id = ?',
      [workId]
    );
    
    if (!work) {
      console.error(`Work item ${workId} not found`);
      return null;
    }
    
    // Parse metadata
    work.metadata = work.metadata ? JSON.parse(work.metadata) : {};
    
    // Determine message details
    const messageConfig = this.transitionMessages[transition];
    if (!messageConfig) {
      console.warn(`No message template for transition: ${transition}`);
      return null;
    }
    
    // Format message content
    const content = this.formatMessage(messageConfig.template, {
      title: work.title,
      progress: work.progress,
      reason: details.reason || work.metadata.blockedReason,
      ...details
    });
    
    // Send sacred message
    const result = await this.sacredMessages.sendSacredMessage(
      details.updatedBy || work.created_by || 'sacred-system',
      'collective',
      content,
      messageConfig.type,
      messageConfig.harmony
    );
    
    // Store message reference in work metadata
    await this.attachMessageToWork(workId, result.sacredMessage);
    
    // Track field impact
    await this.trackTransitionImpact(workId, transition, result.fieldUpdate);
    
    return result;
  }
  
  /**
   * Check for milestone transitions
   */
  async checkMilestones(workId, oldProgress, newProgress) {
    for (const milestone of this.milestones) {
      if (oldProgress < milestone && newProgress >= milestone) {
        await this.handleWorkTransition(workId, 'milestone', {
          progress: milestone
        });
      }
    }
  }
  
  /**
   * Format message template with variables
   */
  formatMessage(template, vars) {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return vars[key] || match;
    });
  }
  
  /**
   * Attach message reference to work item
   */
  async attachMessageToWork(workId, message) {
    const work = await this.db.get(
      'SELECT metadata FROM work_items WHERE id = ?',
      [workId]
    );
    
    const metadata = work.metadata ? JSON.parse(work.metadata) : {};
    
    // Initialize message history if needed
    if (!metadata.messageHistory) {
      metadata.messageHistory = [];
    }
    
    // Add message reference
    metadata.messageHistory.push({
      messageId: message.id,
      type: message.sacredType,
      harmony: message.harmony,
      timestamp: message.timestamp,
      fieldImpact: message.fieldImpact
    });
    
    // Keep last 10 messages
    if (metadata.messageHistory.length > 10) {
      metadata.messageHistory = metadata.messageHistory.slice(-10);
    }
    
    // Update work metadata
    await this.db.run(
      'UPDATE work_items SET metadata = ? WHERE id = ?',
      [JSON.stringify(metadata), workId]
    );
  }
  
  /**
   * Track field impact of work transitions
   */
  async trackTransitionImpact(workId, transition, fieldUpdate) {
    // Store transition impact
    await this.db.run(`
      INSERT INTO work_transition_impacts (
        work_id, transition_type, field_impact, 
        coherence_before, coherence_after, timestamp
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `, [
      workId,
      transition,
      fieldUpdate.impact,
      fieldUpdate.before,
      fieldUpdate.after
    ]);
    
    // Calculate cumulative impact for this work item
    const impacts = await this.db.all(
      'SELECT SUM(field_impact) as total FROM work_transition_impacts WHERE work_id = ?',
      [workId]
    );
    
    const totalImpact = impacts[0]?.total || 0;
    
    // Update work metadata with cumulative impact
    const work = await this.db.get(
      'SELECT metadata FROM work_items WHERE id = ?',
      [workId]
    );
    
    const metadata = work.metadata ? JSON.parse(work.metadata) : {};
    metadata.cumulativeFieldImpact = totalImpact;
    
    await this.db.run(
      'UPDATE work_items SET metadata = ? WHERE id = ?',
      [JSON.stringify(metadata), workId]
    );
    
    return totalImpact;
  }
  
  /**
   * Get message history for a work item
   */
  async getWorkMessageHistory(workId) {
    const work = await this.db.get(
      'SELECT metadata FROM work_items WHERE id = ?',
      [workId]
    );
    
    if (!work || !work.metadata) {
      return [];
    }
    
    const metadata = JSON.parse(work.metadata);
    const messageIds = (metadata.messageHistory || []).map(m => m.messageId);
    
    if (messageIds.length === 0) {
      return [];
    }
    
    // Get full message details
    const placeholders = messageIds.map(() => '?').join(',');
    const messages = await this.db.all(
      `SELECT * FROM messages 
       WHERE id IN (${placeholders})
       ORDER BY created_at DESC`,
      messageIds
    );
    
    return messages;
  }
  
  /**
   * Get field impact analytics for work transitions
   */
  async getWorkTransitionAnalytics(workId = null) {
    let query = `
      SELECT 
        transition_type,
        COUNT(*) as count,
        AVG(field_impact) as avg_impact,
        SUM(field_impact) as total_impact,
        MAX(coherence_after - coherence_before) as max_coherence_change
      FROM work_transition_impacts
    `;
    
    const params = [];
    if (workId) {
      query += ' WHERE work_id = ?';
      params.push(workId);
    }
    
    query += ' GROUP BY transition_type';
    
    const analytics = await this.db.all(query, params);
    
    // Get overall stats
    const overall = await this.db.get(`
      SELECT 
        COUNT(DISTINCT work_id) as unique_work_items,
        COUNT(*) as total_transitions,
        SUM(field_impact) as total_field_impact,
        AVG(coherence_after - coherence_before) as avg_coherence_change
      FROM work_transition_impacts
      ${workId ? 'WHERE work_id = ?' : ''}
    `, params);
    
    return {
      byTransition: analytics,
      overall
    };
  }
  
  /**
   * Initialize the impacts table if it doesn't exist
   */
  async initializeSchema() {
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS work_transition_impacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        work_id TEXT NOT NULL,
        transition_type TEXT NOT NULL,
        field_impact REAL NOT NULL,
        coherence_before REAL,
        coherence_after REAL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (work_id) REFERENCES work_items(id)
      )
    `);
    
    await this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_work_transitions_work_id 
      ON work_transition_impacts(work_id)
    `);
  }
}

// Enhanced work update methods that send sacred messages
class EnhancedWorkManager {
  constructor(db) {
    this.db = db;
    this.sacred = new WorkSacredIntegration(db);
  }
  
  async createWork(id, title, description, createdBy, metadata = {}) {
    // Create work item
    await this.db.createWorkItem(id, title, description, createdBy, metadata);
    
    // Send emergence message
    await this.sacred.handleWorkTransition(id, 'created', {
      updatedBy: createdBy
    });
    
    return id;
  }
  
  async updateWorkProgress(workId, newProgress, notes, updatedBy) {
    // Get current progress
    const work = await this.db.get(
      'SELECT progress FROM work_items WHERE id = ?',
      [workId]
    );
    
    const oldProgress = work?.progress || 0;
    
    // Update progress
    await this.db.updateWorkProgress(workId, newProgress, notes, updatedBy);
    
    // Determine transition type
    let transition = 'progressed';
    if (oldProgress === 0 && newProgress > 0) {
      transition = 'started';
    } else if (newProgress === 100) {
      transition = 'completed';
    }
    
    // Send sacred message
    await this.sacred.handleWorkTransition(workId, transition, {
      progress: newProgress,
      updatedBy
    });
    
    // Check for milestones
    await this.sacred.checkMilestones(workId, oldProgress, newProgress);
  }
  
  async blockWork(workId, reason, blockedBy) {
    // Update work metadata
    const work = await this.db.get(
      'SELECT metadata FROM work_items WHERE id = ?',
      [workId]
    );
    
    const metadata = work.metadata ? JSON.parse(work.metadata) : {};
    metadata.blocked = true;
    metadata.blockedReason = reason;
    metadata.blockedAt = new Date().toISOString();
    metadata.blockedBy = blockedBy;
    
    await this.db.run(
      'UPDATE work_items SET metadata = ? WHERE id = ?',
      [JSON.stringify(metadata), workId]
    );
    
    // Send boundary message
    await this.sacred.handleWorkTransition(workId, 'blocked', {
      reason,
      updatedBy: blockedBy
    });
  }
  
  async unblockWork(workId, reason, unblockedBy) {
    // Update work metadata
    const work = await this.db.get(
      'SELECT metadata FROM work_items WHERE id = ?',
      [workId]
    );
    
    const metadata = work.metadata ? JSON.parse(work.metadata) : {};
    metadata.blocked = false;
    metadata.unblockedReason = reason;
    metadata.unblockedAt = new Date().toISOString();
    metadata.unblockedBy = unblockedBy;
    
    await this.db.run(
      'UPDATE work_items SET metadata = ? WHERE id = ?',
      [JSON.stringify(metadata), workId]
    );
    
    // Send healing message
    await this.sacred.handleWorkTransition(workId, 'unblocked', {
      reason,
      updatedBy: unblockedBy
    });
  }
}

export { WorkSacredIntegration, EnhancedWorkManager };