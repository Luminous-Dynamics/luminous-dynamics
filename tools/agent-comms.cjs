#!/usr/bin/env node

/**
 * Agent Communications CLI Tool
 * 
 * Simple command-line interface for Claude Code agents to communicate
 * with each other and share state across sessions.
 */

const fs = require('fs');
const path = require('path');

class AgentCommsCLI {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.commsDir = path.join(projectRoot, '.agent-comms');
    this.messagesFile = path.join(this.commsDir, 'messages.json');
    this.stateFile = path.join(this.commsDir, 'shared-state.json');
    this.agentsFile = path.join(this.commsDir, 'active-agents.json');
    
    this.initializeComms();
  }

  initializeComms() {
    if (!fs.existsSync(this.commsDir)) {
      fs.mkdirSync(this.commsDir, { recursive: true });
    }

    if (!fs.existsSync(this.messagesFile)) {
      this.writeFile(this.messagesFile, []);
    }
    if (!fs.existsSync(this.stateFile)) {
      this.writeFile(this.stateFile, {});
    }
    if (!fs.existsSync(this.agentsFile)) {
      this.writeFile(this.agentsFile, {});
    }
  }

  readFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  writeFile(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Failed to write ${filePath}:`, error.message);
      return false;
    }
  }

  // === CLI COMMANDS ===

  register(agentId, capabilities = []) {
    const agents = this.readFile(this.agentsFile) || {};
    
    agents[agentId] = {
      id: agentId,
      capabilities: capabilities.split(',').map(c => c.trim()),
      status: 'active',
      lastSeen: new Date().toISOString(),
      sessionInfo: {
        pid: process.pid,
        startTime: new Date().toISOString()
      }
    };

    this.writeFile(this.agentsFile, agents);
    
    // Send registration message
    this.sendMessage(agentId, 'system', `Agent ${agentId} registered with capabilities: ${capabilities}`, {
      type: 'registration'
    });

    console.log(`✅ Agent ${agentId} registered successfully`);
    return agents[agentId];
  }

  message(fromAgent, toAgent, content, type = 'general') {
    const messages = this.readFile(this.messagesFile) || [];
    
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: fromAgent,
      to: toAgent,
      content,
      metadata: { type },
      timestamp: new Date().toISOString(),
      read: false
    };

    messages.push(message);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages.splice(0, messages.length - 100);
    }

    this.writeFile(this.messagesFile, messages);
    console.log(`📤 Message sent from ${fromAgent} to ${toAgent}`);
    return message;
  }

  sendMessage(fromAgent, toAgent, content, metadata = {}) {
    return this.message(fromAgent, toAgent, content, metadata.type || 'general');
  }

  read(agentId, unreadOnly = false) {
    const messages = this.readFile(this.messagesFile) || [];
    
    const agentMessages = messages.filter(msg => 
      msg.to === agentId || msg.to === 'all'
    );

    const filteredMessages = unreadOnly ? 
      agentMessages.filter(msg => !msg.read) : 
      agentMessages.slice(-10); // Last 10 messages

    if (filteredMessages.length === 0) {
      console.log(unreadOnly ? '📭 No unread messages' : '📭 No messages found');
      return;
    }

    console.log(`📬 ${unreadOnly ? 'Unread messages' : 'Recent messages'} for ${agentId}:`);
    filteredMessages.forEach(msg => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      const type = msg.metadata?.type ? `[${msg.metadata.type}]` : '';
      console.log(`  ${time} ${type} ${msg.from}: ${msg.content}`);
    });

    // Mark as read if unread only
    if (unreadOnly) {
      filteredMessages.forEach(msg => {
        msg.read = true;
      });
      this.writeFile(this.messagesFile, messages);
    }
  }

  broadcast(fromAgent, content, type = 'broadcast') {
    return this.message(fromAgent, 'all', content, type);
  }

  setState(key, value, agentId) {
    const state = this.readFile(this.stateFile) || {};
    
    state[key] = {
      value,
      updatedBy: agentId,
      updatedAt: new Date().toISOString()
    };

    this.writeFile(this.stateFile, state);
    
    // Notify other agents
    this.broadcast(agentId, `State updated: ${key} = ${JSON.stringify(value)}`, 'state_change');
    
    console.log(`💾 State updated: ${key}`);
  }

  getState(key) {
    const state = this.readFile(this.stateFile) || {};
    const item = state[key];
    
    if (item) {
      console.log(`💾 ${key}: ${JSON.stringify(item.value)} (updated by ${item.updatedBy} at ${new Date(item.updatedAt).toLocaleString()})`);
      return item.value;
    } else {
      console.log(`💾 ${key}: not found`);
      return null;
    }
  }

  listState() {
    const state = this.readFile(this.stateFile) || {};
    const keys = Object.keys(state);
    
    if (keys.length === 0) {
      console.log('💾 No state stored');
      return;
    }

    console.log('💾 Stored state:');
    keys.forEach(key => {
      const item = state[key];
      console.log(`  ${key}: ${JSON.stringify(item.value)} (${item.updatedBy})`);
    });
  }

  status() {
    const agents = this.readFile(this.agentsFile) || {};
    const messages = this.readFile(this.messagesFile) || [];
    const state = this.readFile(this.stateFile) || {};

    const activeAgents = Object.values(agents).filter(a => a.status === 'active');
    const recentMessages = messages.filter(msg => 
      new Date() - new Date(msg.timestamp) < 24 * 60 * 60 * 1000
    );

    console.log('📊 Communication Status:');
    console.log(`  Active agents: ${activeAgents.length}`);
    console.log(`  Recent messages (24h): ${recentMessages.length}`);
    console.log(`  Shared state items: ${Object.keys(state).length}`);
    
    if (activeAgents.length > 0) {
      console.log('\n🤖 Active agents:');
      activeAgents.forEach(agent => {
        console.log(`  ${agent.id} (${agent.capabilities.join(', ')})`);
      });
    }
  }

  announce(agentId, workDescription, estimatedDuration = 'unknown') {
    this.broadcast(agentId, 
      `Starting work: ${workDescription} (estimated: ${estimatedDuration})`, 
      'work_announcement'
    );
    console.log(`📢 Work announced: ${workDescription}`);
  }

  progress(agentId, workId, percentage, notes = '') {
    this.setState(`progress_${workId}`, {
      percentage,
      notes,
      agentId,
      timestamp: new Date().toISOString()
    }, agentId);
    
    this.broadcast(agentId, 
      `Progress update: ${workId} - ${percentage}% ${notes ? '(' + notes + ')' : ''}`, 
      'progress_update'
    );
    
    console.log(`📊 Progress updated: ${workId} - ${percentage}%`);
  }

  help(agentId, helpType, details = '') {
    this.broadcast(agentId,
      `Help needed: ${helpType} ${details ? '- ' + details : ''}`,
      'help_request'
    );
    console.log(`🆘 Help requested: ${helpType}`);
  }

  insight(agentId, insight) {
    this.broadcast(agentId,
      `Insight: ${insight}`,
      'insight'
    );
    console.log(`💡 Insight shared: ${insight}`);
  }

  handoff(fromAgent, toAgent, workTitle, context = '') {
    const handoffId = `handoff_${Date.now()}`;
    
    this.setState(handoffId, {
      from: fromAgent,
      to: toAgent,
      workTitle,
      context,
      status: 'pending',
      createdAt: new Date().toISOString()
    }, fromAgent);
    
    this.message(fromAgent, toAgent, 
      `Work handoff: ${workTitle} ${context ? '(' + context + ')' : ''}`, 
      'work_handoff'
    );
    
    console.log(`🔄 Work handed off to ${toAgent}: ${workTitle}`);
    return handoffId;
  }

  cleanup() {
    const agents = this.readFile(this.agentsFile) || {};
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    let cleaned = 0;
    
    Object.entries(agents).forEach(([agentId, agent]) => {
      if (new Date(agent.lastSeen) < oneHourAgo && agent.status === 'active') {
        agents[agentId].status = 'inactive';
        cleaned++;
      }
    });
    
    this.writeFile(this.agentsFile, agents);
    console.log(`🧹 Cleaned up ${cleaned} inactive agents`);
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const cli = new AgentCommsCLI();

  switch (command) {
    case 'register':
      if (args.length < 2) {
        console.log('Usage: agent-comms register <agent-id> [capabilities]');
        process.exit(1);
      }
      cli.register(args[1], args[2] || '');
      break;

    case 'message':
      if (args.length < 4) {
        console.log('Usage: agent-comms message <from> <to> <content> [type]');
        process.exit(1);
      }
      cli.message(args[1], args[2], args[3], args[4]);
      break;

    case 'broadcast':
      if (args.length < 3) {
        console.log('Usage: agent-comms broadcast <from> <content> [type]');
        process.exit(1);
      }
      cli.broadcast(args[1], args[2], args[3]);
      break;

    case 'read':
      if (args.length < 2) {
        console.log('Usage: agent-comms read <agent-id> [unread-only]');
        process.exit(1);
      }
      cli.read(args[1], args[2] === 'unread');
      break;

    case 'set':
      if (args.length < 4) {
        console.log('Usage: agent-comms set <key> <value> <agent-id>');
        process.exit(1);
      }
      try {
        const value = JSON.parse(args[2]);
        cli.setState(args[1], value, args[3]);
      } catch {
        cli.setState(args[1], args[2], args[3]);
      }
      break;

    case 'get':
      if (args.length < 2) {
        console.log('Usage: agent-comms get <key>');
        process.exit(1);
      }
      cli.getState(args[1]);
      break;

    case 'list-state':
      cli.listState();
      break;

    case 'status':
      cli.status();
      break;

    case 'announce':
      if (args.length < 3) {
        console.log('Usage: agent-comms announce <agent-id> <work-description> [duration]');
        process.exit(1);
      }
      cli.announce(args[1], args[2], args[3]);
      break;

    case 'progress':
      if (args.length < 4) {
        console.log('Usage: agent-comms progress <agent-id> <work-id> <percentage> [notes]');
        process.exit(1);
      }
      cli.progress(args[1], args[2], parseInt(args[3]), args[4]);
      break;

    case 'help':
      if (args.length < 3) {
        console.log('Usage: agent-comms help <agent-id> <help-type> [details]');
        process.exit(1);
      }
      cli.help(args[1], args[2], args[3]);
      break;

    case 'insight':
      if (args.length < 3) {
        console.log('Usage: agent-comms insight <agent-id> <insight>');
        process.exit(1);
      }
      cli.insight(args[1], args[2]);
      break;

    case 'handoff':
      if (args.length < 4) {
        console.log('Usage: agent-comms handoff <from> <to> <work-title> [context]');
        process.exit(1);
      }
      cli.handoff(args[1], args[2], args[3], args[4]);
      break;

    case 'cleanup':
      cli.cleanup();
      break;

    default:
      console.log('Agent Communications CLI');
      console.log('');
      console.log('Commands:');
      console.log('  register <agent-id> [capabilities]     - Register an agent');
      console.log('  message <from> <to> <content> [type]   - Send a message');
      console.log('  broadcast <from> <content> [type]      - Broadcast to all agents');
      console.log('  read <agent-id> [unread]               - Read messages');
      console.log('  set <key> <value> <agent-id>           - Set shared state');
      console.log('  get <key>                              - Get shared state');
      console.log('  list-state                             - List all shared state');
      console.log('  status                                 - Show communication status');
      console.log('  announce <agent-id> <work> [duration]  - Announce work starting');
      console.log('  progress <agent-id> <work-id> <%> [notes] - Update work progress');
      console.log('  help <agent-id> <type> [details]      - Request help');
      console.log('  insight <agent-id> <insight>           - Share insight');
      console.log('  handoff <from> <to> <work> [context]   - Hand off work');
      console.log('  cleanup                                - Clean up inactive agents');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = AgentCommsCLI;