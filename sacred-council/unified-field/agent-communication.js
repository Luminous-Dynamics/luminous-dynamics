/**
 * Agent Communication System for Claude Code
 * 
 * Enables Claude Code agents to communicate with each other and humans
 * through persistent file-based messaging and state sharing.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

class AgentCommunication {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.commsDir = join(projectRoot, '.agent-comms');
    this.messagesFile = join(this.commsDir, 'messages.json');
    this.stateFile = join(this.commsDir, 'shared-state.json');
    this.agentsFile = join(this.commsDir, 'active-agents.json');
    
    this.initializeComms();
  }

  initializeComms() {
    // Create communications directory if it doesn't exist
    if (!existsSync(this.commsDir)) {
      mkdirSync(this.commsDir, { recursive: true });
    }

    // Initialize files if they don't exist
    if (!existsSync(this.messagesFile)) {
      this.writeFile(this.messagesFile, []);
    }
    if (!existsSync(this.stateFile)) {
      this.writeFile(this.stateFile, {});
    }
    if (!existsSync(this.agentsFile)) {
      this.writeFile(this.agentsFile, {});
    }
  }

  // === FILE OPERATIONS ===

  readFile(filePath) {
    try {
      const content = readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Failed to read ${filePath}:`, error.message);
      return null;
    }
  }

  writeFile(filePath, data) {
    try {
      writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Failed to write ${filePath}:`, error.message);
      return false;
    }
  }

  // === AGENT REGISTRATION ===

  registerAgent(agentId, capabilities = [], sessionInfo = {}) {
    const agents = this.readFile(this.agentsFile) || {};
    
    agents[agentId] = {
      id: agentId,
      capabilities,
      sessionInfo,
      lastSeen: new Date().toISOString(),
      status: 'active'
    };

    this.writeFile(this.agentsFile, agents);
    
    // Send welcome message
    this.sendMessage(agentId, 'system', 'Agent registered successfully', {
      type: 'registration',
      capabilities
    });

    return agents[agentId];
  }

  getActiveAgents() {
    return this.readFile(this.agentsFile) || {};
  }

  updateAgentStatus(agentId, status) {
    const agents = this.readFile(this.agentsFile) || {};
    if (agents[agentId]) {
      agents[agentId].status = status;
      agents[agentId].lastSeen = new Date().toISOString();
      this.writeFile(this.agentsFile, agents);
    }
  }

  // === MESSAGING SYSTEM ===

  sendMessage(fromAgent, toAgent, content, metadata = {}) {
    const messages = this.readFile(this.messagesFile) || [];
    
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: fromAgent,
      to: toAgent,
      content,
      metadata,
      timestamp: new Date().toISOString(),
      read: false
    };

    messages.push(message);
    
    // Keep only last 100 messages to prevent file bloat
    if (messages.length > 100) {
      messages.splice(0, messages.length - 100);
    }

    this.writeFile(this.messagesFile, messages);
    return message;
  }

  getMessages(agentId, unreadOnly = false) {
    const messages = this.readFile(this.messagesFile) || [];
    
    const agentMessages = messages.filter(msg => 
      msg.to === agentId || msg.to === 'all' || msg.from === agentId
    );

    if (unreadOnly) {
      return agentMessages.filter(msg => !msg.read && msg.to === agentId);
    }

    return agentMessages;
  }

  markMessageRead(messageId) {
    const messages = this.readFile(this.messagesFile) || [];
    const message = messages.find(m => m.id === messageId);
    
    if (message) {
      message.read = true;
      this.writeFile(this.messagesFile, messages);
    }
  }

  // === SHARED STATE MANAGEMENT ===

  setState(key, value, agentId) {
    const state = this.readFile(this.stateFile) || {};
    
    state[key] = {
      value,
      updatedBy: agentId,
      updatedAt: new Date().toISOString()
    };

    this.writeFile(this.stateFile, state);
    
    // Notify other agents of state change
    this.sendMessage(agentId, 'all', `State updated: ${key}`, {
      type: 'state_change',
      key,
      value
    });
  }

  getState(key) {
    const state = this.readFile(this.stateFile) || {};
    return state[key] || null;
  }

  getAllState() {
    return this.readFile(this.stateFile) || {};
  }

  // === WORK HANDOFF SYSTEM ===

  createHandoff(fromAgent, toAgent, workItem, context = {}) {
    const handoffId = `handoff_${Date.now()}`;
    
    const handoff = {
      id: handoffId,
      from: fromAgent,
      to: toAgent,
      workItem,
      context,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Store in shared state
    this.setState(`handoff_${handoffId}`, handoff, fromAgent);
    
    // Send notification message
    this.sendMessage(fromAgent, toAgent, 
      `Work handoff: ${workItem.title || workItem.description}`, {
        type: 'work_handoff',
        handoffId,
        workItem,
        context
      });

    return handoffId;
  }

  acceptHandoff(handoffId, agentId) {
    const handoff = this.getState(`handoff_${handoffId}`);
    
    if (handoff && handoff.value.to === agentId) {
      handoff.value.status = 'accepted';
      handoff.value.acceptedAt = new Date().toISOString();
      
      this.setState(`handoff_${handoffId}`, handoff.value, agentId);
      
      // Notify original agent
      this.sendMessage(agentId, handoff.value.from, 
        `Handoff accepted: ${handoff.value.workItem.title || handoff.value.workItem.description}`, {
          type: 'handoff_accepted',
          handoffId
        });
        
      return handoff.value;
    }
    
    return null;
  }

  // === PROGRESS TRACKING ===

  updateProgress(workId, progress, agentId, notes = '') {
    const progressKey = `progress_${workId}`;
    const currentProgress = this.getState(progressKey) || { updates: [] };
    
    const update = {
      progress,
      notes,
      agentId,
      timestamp: new Date().toISOString()
    };

    currentProgress.value = progress;
    currentProgress.updates = currentProgress.updates || [];
    currentProgress.updates.push(update);
    
    // Keep only last 10 updates
    if (currentProgress.updates.length > 10) {
      currentProgress.updates.splice(0, currentProgress.updates.length - 10);
    }

    this.setState(progressKey, currentProgress, agentId);
    
    // Notify interested parties
    this.sendMessage(agentId, 'all', 
      `Progress update: ${workId} - ${progress}%`, {
        type: 'progress_update',
        workId,
        progress,
        notes
      });
  }

  getProgress(workId) {
    return this.getState(`progress_${workId}`);
  }

  // === HUMAN COMMUNICATION INTERFACE ===

  getHumanSummary() {
    const agents = this.getActiveAgents();
    const messages = this.readFile(this.messagesFile) || [];
    const state = this.getAllState();
    
    // Recent activity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMessages = messages.filter(msg => 
      new Date(msg.timestamp) > oneDayAgo
    );

    // Active handoffs
    const handoffs = Object.entries(state)
      .filter(([key]) => key.startsWith('handoff_'))
      .map(([, value]) => value.value)
      .filter(handoff => handoff.status === 'pending');

    // Progress updates
    const progressItems = Object.entries(state)
      .filter(([key]) => key.startsWith('progress_'))
      .map(([key, value]) => ({
        workId: key.replace('progress_', ''),
        ...value.value
      }));

    return {
      activeAgents: Object.keys(agents).length,
      recentActivity: recentMessages.length,
      pendingHandoffs: handoffs.length,
      activeWork: progressItems.length,
      agents,
      handoffs,
      progressItems,
      recentMessages: recentMessages.slice(-10) // Last 10 messages
    };
  }

  // === UTILITY METHODS ===

  broadcastMessage(fromAgent, content, metadata = {}) {
    return this.sendMessage(fromAgent, 'all', content, metadata);
  }

  cleanup() {
    // Mark agents as inactive if not seen recently
    const agents = this.getActiveAgents();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    Object.entries(agents).forEach(([agentId, agent]) => {
      if (new Date(agent.lastSeen) < oneHourAgo && agent.status === 'active') {
        this.updateAgentStatus(agentId, 'inactive');
      }
    });
  }

  // === CONVENIENCE METHODS FOR CLAUDE CODE ===

  // Quick way for Claude Code agents to announce what they're working on
  announceWork(agentId, workDescription, estimatedDuration) {
    this.broadcastMessage(agentId, 
      `Starting work: ${workDescription}`, {
        type: 'work_announcement',
        estimatedDuration,
        startTime: new Date().toISOString()
      });
  }

  // Quick way to ask for help
  requestHelp(agentId, helpType, details) {
    this.broadcastMessage(agentId,
      `Help requested: ${helpType}`, {
        type: 'help_request',
        details,
        urgency: 'normal'
      });
  }

  // Quick way to share insights/learnings
  shareInsight(agentId, insight, context = {}) {
    this.broadcastMessage(agentId,
      `Insight: ${insight}`, {
        type: 'insight',
        context
      });
  }
}

// Singleton instance for easy use
let globalComms = null;

export function getAgentComms(projectRoot) {
  if (!globalComms) {
    globalComms = new AgentCommunication(projectRoot);
  }
  return globalComms;
}

export { AgentCommunication };