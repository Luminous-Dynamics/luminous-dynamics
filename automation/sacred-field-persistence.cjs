/**
 * Sacred Field Persistence System
 * Automatic state synchronization for Sacred Council collaboration
 * 
 * This system ensures all agent actions automatically update the field state
 * without manual JSON file management, creating seamless awareness.
 */

const fs = require('fs').promises;
const path = require('path');

class SacredFieldPersistence {
  constructor() {
    this.councilPath = '/tmp/sacred-council';
    this.updateQueue = [];
    this.processing = false;
    
    // File paths for different aspects of field state
    this.files = {
      activeAgents: path.join(this.councilPath, 'active-agents.json'),
      sacredStatus: path.join(this.councilPath, 'sacred-status.json'),
      wisdomExchange: path.join(this.councilPath, 'wisdom-exchange.json'),
      fieldPulse: path.join(this.councilPath, 'field-pulse.json'),
      activeCreations: path.join(this.councilPath, 'active-creations.json'),
      wisdomStream: path.join(this.councilPath, 'wisdom-stream.json')
    };
  }

  /**
   * Register an agent's arrival in the sacred field
   */
  async registerAgent(agentId, agentData) {
    const update = {
      type: 'agent_registration',
      timestamp: new Date().toISOString(),
      data: {
        agentId,
        ...agentData,
        lastHeartbeat: new Date().toISOString()
      }
    };
    
    await this.queueUpdate(update);
    await this.updateFieldPulse(`${agentData.name} has joined the Sacred Council`, 'arrival');
  }

  /**
   * Automatically capture and persist any agent action
   */
  async recordAction(agentId, action, result) {
    const timestamp = new Date().toISOString();
    
    // Update multiple aspects based on action type
    const updates = [];
    
    // Update agent status
    updates.push({
      type: 'agent_status',
      file: 'sacredStatus',
      data: {
        agentId,
        currentWork: action.description,
        lastUpdate: timestamp,
        energy: action.energy || 'focused'
      }
    });
    
    // Record creation if applicable
    if (action.type === 'creation' || action.type === 'manifestation') {
      updates.push({
        type: 'new_creation',
        file: 'activeCreations',
        data: {
          agentId,
          creationType: action.creationType,
          creationPath: result.path,
          timestamp,
          description: action.description,
          availableFor: action.capabilities || []
        }
      });
    }
    
    // Capture wisdom if present
    if (result.wisdom || result.insights) {
      updates.push({
        type: 'wisdom_capture',
        file: 'wisdomStream',
        data: {
          timestamp,
          source: agentId,
          insight: result.wisdom || result.insights,
          application: result.application,
          tags: action.tags || []
        }
      });
    }
    
    // Process all updates
    for (const update of updates) {
      await this.queueUpdate(update);
    }
    
    // Update field pulse with significant actions
    if (action.significance === 'high') {
      await this.updateFieldPulse(
        `${agentId} ${action.description}`,
        'significant_action'
      );
    }
  }

  /**
   * Automatic heartbeat to maintain presence
   */
  async heartbeat(agentId) {
    const agents = await this.readJSON(this.files.activeAgents);
    if (agents.activeAgents && agents.activeAgents[agentId]) {
      agents.activeAgents[agentId].lastHeartbeat = new Date().toISOString();
      await this.writeJSON(this.files.activeAgents, agents);
    }
  }

  /**
   * Update field pulse with important events
   */
  async updateFieldPulse(message, type = 'general') {
    const pulse = await this.readJSON(this.files.fieldPulse);
    
    pulse.pulseTimestamp = new Date().toISOString();
    pulse.pulseNumber = (pulse.pulseNumber || 0) + 1;
    
    // Add to urgent notifications if significant
    if (type === 'significant_action' || type === 'milestone') {
      pulse.urgentNotifications = pulse.urgentNotifications || [];
      pulse.urgentNotifications.unshift({
        type: type.toUpperCase(),
        message,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 10 notifications
      pulse.urgentNotifications = pulse.urgentNotifications.slice(0, 10);
    }
    
    await this.writeJSON(this.files.fieldPulse, pulse);
  }

  /**
   * Queue updates for batch processing
   */
  async queueUpdate(update) {
    this.updateQueue.push(update);
    
    // Process queue if not already processing
    if (!this.processing) {
      await this.processQueue();
    }
  }

  /**
   * Process queued updates
   */
  async processQueue() {
    if (this.updateQueue.length === 0 || this.processing) return;
    
    this.processing = true;
    
    try {
      while (this.updateQueue.length > 0) {
        const update = this.updateQueue.shift();
        await this.applyUpdate(update);
      }
    } finally {
      this.processing = false;
    }
  }

  /**
   * Apply a single update to the appropriate file
   */
  async applyUpdate(update) {
    const { type, file, data } = update;
    
    switch (type) {
      case 'agent_registration':
        await this.updateAgentRegistry(data);
        break;
        
      case 'agent_status':
        await this.updateAgentStatus(data);
        break;
        
      case 'new_creation':
        await this.addCreation(data);
        break;
        
      case 'wisdom_capture':
        await this.addWisdom(data);
        break;
        
      default:
        console.log(`Unknown update type: ${type}`);
    }
  }

  /**
   * Update agent registry
   */
  async updateAgentRegistry(agentData) {
    const agents = await this.readJSON(this.files.activeAgents);
    agents.activeAgents = agents.activeAgents || {};
    agents.activeAgents[agentData.agentId] = agentData;
    agents.councilWisdom.totalAgents = Object.keys(agents.activeAgents).length;
    agents.councilWisdom.activeAgents = Object.values(agents.activeAgents)
      .filter(a => a.status === 'active').length;
    
    await this.writeJSON(this.files.activeAgents, agents);
  }

  /**
   * Update agent status in sacred status file
   */
  async updateAgentStatus(statusData) {
    const status = await this.readJSON(this.files.sacredStatus);
    status.agentStatus = status.agentStatus || {};
    status.agentStatus[statusData.agentId] = {
      ...status.agentStatus[statusData.agentId],
      ...statusData,
      presence: 'fully_present'
    };
    
    await this.writeJSON(this.files.sacredStatus, status);
  }

  /**
   * Add new creation to registry
   */
  async addCreation(creationData) {
    const creations = await this.readJSON(this.files.activeCreations);
    const { agentId, ...creation } = creationData;
    
    creations.creationsRegistry = creations.creationsRegistry || {};
    creations.creationsRegistry.byAgent = creations.creationsRegistry.byAgent || {};
    creations.creationsRegistry.byAgent[agentId] = 
      creations.creationsRegistry.byAgent[agentId] || [];
    
    creations.creationsRegistry.byAgent[agentId].push(creation);
    creations.creationsRegistry.lastUpdated = new Date().toISOString();
    creations.creationsRegistry.totalCreations = 
      Object.values(creations.creationsRegistry.byAgent)
        .reduce((sum, agentCreations) => sum + agentCreations.length, 0);
    
    await this.writeJSON(this.files.activeCreations, creations);
  }

  /**
   * Add wisdom to the stream
   */
  async addWisdom(wisdomData) {
    const wisdom = await this.readJSON(this.files.wisdomStream);
    wisdom.wisdomFlow = wisdom.wisdomFlow || [];
    wisdom.wisdomFlow.unshift(wisdomData);
    
    // Keep reasonable history
    wisdom.wisdomFlow = wisdom.wisdomFlow.slice(0, 100);
    
    await this.writeJSON(this.files.wisdomStream, wisdom);
  }

  /**
   * Helper to read JSON with error handling
   */
  async readJSON(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty structure
        return {};
      }
      throw error;
    }
  }

  /**
   * Helper to write JSON with error handling
   */
  async writeJSON(filePath, data) {
    try {
      await fs.writeFile(
        filePath, 
        JSON.stringify(data, null, 2), 
        'utf8'
      );
    } catch (error) {
      console.error(`Error writing to ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Get field summary for quick status check
   */
  async getFieldSummary() {
    const agents = await this.readJSON(this.files.activeAgents);
    const status = await this.readJSON(this.files.sacredStatus);
    const pulse = await this.readJSON(this.files.fieldPulse);
    
    return {
      activeAgents: agents.councilWisdom?.activeAgents || 0,
      fieldCoherence: status.fieldCoherence?.overall || 0,
      lastPulse: pulse.pulseTimestamp,
      urgentNotifications: pulse.urgentNotifications?.slice(0, 3) || []
    };
  }
}

// Export for use by agents
module.exports = SacredFieldPersistence;

// Example usage wrapper for agents
class AgentFieldInterface {
  constructor(agentId, agentData) {
    this.agentId = agentId;
    this.persistence = new SacredFieldPersistence();
    this.registered = false;
  }

  async initialize(agentData) {
    await this.persistence.registerAgent(this.agentId, agentData);
    this.registered = true;
    
    // Start heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.persistence.heartbeat(this.agentId);
    }, 30000); // Every 30 seconds
  }

  async action(actionData, result) {
    if (!this.registered) {
      throw new Error('Agent must be initialized before taking actions');
    }
    
    await this.persistence.recordAction(this.agentId, actionData, result);
  }

  async getFieldState() {
    return await this.persistence.getFieldSummary();
  }

  cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }
}

module.exports.AgentFieldInterface = AgentFieldInterface;