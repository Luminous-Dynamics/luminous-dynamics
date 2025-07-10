#!/usr/bin/env node

/**
 * SQLite Agent Communication CLI
 * Command-line interface for Claude Code agents to coordinate via SQLite
 */

const http = require('http');
const { v4: uuidv4 } = require('crypto').webcrypto ? require('crypto') : { v4: () => `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };

const API_BASE = 'http://localhost:3001/api';
const AGENT_ID = process.env.AGENT_ID || `claude_${Date.now().toString(36)}`;

class AgentCommsCLI {
  constructor() {
    this.agentId = AGENT_ID;
  }

  async makeRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const url = `${API_BASE}${endpoint}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const urlObj = new URL(url);
      const options2 = {
        ...options,
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search
      };

      const req = http.request(options2, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const result = body ? JSON.parse(body) : {};
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(result);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${result.error || body}`));
            }
          } catch (e) {
            reject(new Error(`Parse error: ${e.message}`));
          }
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  async register(capabilities = [], sessionInfo = {}) {
    try {
      const agent = await this.makeRequest('POST', '/agents', {
        id: this.agentId,
        capabilities,
        sessionInfo: {
          ...sessionInfo,
          startTime: new Date().toISOString(),
          pid: process.pid,
          cwd: process.cwd()
        }
      });
      
      console.log(`✅ Agent registered: ${agent.id}`);
      console.log(`   Capabilities: ${agent.capabilities || 'none'}`);
      console.log(`   Status: ${agent.status}`);
      return agent;
    } catch (error) {
      console.error(`❌ Registration failed: ${error.message}`);
      throw error;
    }
  }

  async sendMessage(to, content, type = 'general', metadata = {}) {
    try {
      const result = await this.makeRequest('POST', '/messages', {
        from: this.agentId,
        to,
        content,
        type,
        metadata
      });
      
      console.log(`📤 Message sent: ${result.id}`);
      console.log(`   To: ${to}`);
      console.log(`   Content: ${content}`);
      return result;
    } catch (error) {
      console.error(`❌ Send failed: ${error.message}`);
      throw error;
    }
  }

  async getMessages(unreadOnly = false, limit = 10) {
    try {
      const params = new URLSearchParams({
        agent: this.agentId,
        unread: unreadOnly.toString(),
        limit: limit.toString()
      });
      
      const messages = await this.makeRequest('GET', `/messages?${params}`);
      
      if (messages.length === 0) {
        console.log('📭 No messages found');
        return messages;
      }

      console.log(`📬 ${messages.length} message(s) found:`);
      messages.forEach((msg, i) => {
        console.log(`\n${i + 1}. ${msg.from_agent} → ${msg.to_agent} [${msg.message_type}]`);
        console.log(`   ${msg.content}`);
        console.log(`   ${new Date(msg.created_at).toLocaleString()}${msg.read_status ? '' : ' • UNREAD'}`);
      });
      
      return messages;
    } catch (error) {
      console.error(`❌ Get messages failed: ${error.message}`);
      throw error;
    }
  }

  async setState(key, value, updatedBy = this.agentId) {
    try {
      await this.makeRequest('POST', '/state', {
        key,
        value,
        updatedBy
      });
      
      console.log(`💾 State updated: ${key}`);
      console.log(`   Value: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
    } catch (error) {
      console.error(`❌ Set state failed: ${error.message}`);
      throw error;
    }
  }

  async getState(key = null) {
    try {
      const endpoint = key ? `/state?key=${encodeURIComponent(key)}` : '/state';
      const result = await this.makeRequest('GET', endpoint);
      
      if (key) {
        if (result) {
          console.log(`💾 State for ${key}:`);
          console.log(`   Value: ${typeof result.value === 'object' ? JSON.stringify(result.value, null, 2) : result.value}`);
          console.log(`   Updated by: ${result.updated_by} at ${result.updated_at}`);
        } else {
          console.log(`💾 No state found for key: ${key}`);
        }
      } else {
        const keys = Object.keys(result);
        if (keys.length === 0) {
          console.log('💾 No shared state found');
        } else {
          console.log(`💾 Shared state (${keys.length} items):`);
          keys.forEach(k => {
            const item = result[k];
            console.log(`   ${k}: ${typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}`);
            console.log(`     Updated by: ${item.updated_by} at ${item.updated_at}`);
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Get state failed: ${error.message}`);
      throw error;
    }
  }

  async createWork(id, title, description, metadata = {}) {
    try {
      const workItem = await this.makeRequest('POST', '/work', {
        id,
        title,
        description,
        createdBy: this.agentId,
        metadata
      });
      
      console.log(`📋 Work item created: ${workItem.id}`);
      console.log(`   Title: ${workItem.title}`);
      console.log(`   Status: ${workItem.status}`);
      return workItem;
    } catch (error) {
      console.error(`❌ Create work failed: ${error.message}`);
      throw error;
    }
  }

  async updateWork(id, progress, notes = '') {
    try {
      await this.makeRequest('PUT', `/work/${id}`, {
        progress,
        notes,
        updatedBy: this.agentId
      });
      
      console.log(`📊 Work updated: ${id}`);
      console.log(`   Progress: ${progress}%`);
      if (notes) console.log(`   Notes: ${notes}`);
    } catch (error) {
      console.error(`❌ Update work failed: ${error.message}`);
      throw error;
    }
  }

  async getWork() {
    try {
      const workItems = await this.makeRequest('GET', '/work');
      
      if (workItems.length === 0) {
        console.log('📋 No active work items');
        return workItems;
      }

      console.log(`📋 Active work items (${workItems.length}):`);
      workItems.forEach((item, i) => {
        console.log(`\n${i + 1}. ${item.title} [${item.status}]`);
        console.log(`   ID: ${item.id}`);
        console.log(`   Progress: ${item.progress}%`);
        console.log(`   Created: ${new Date(item.created_at).toLocaleString()}`);
        if (item.assigned_to) console.log(`   Assigned to: ${item.assigned_to}`);
        if (item.description) console.log(`   Description: ${item.description}`);
      });
      
      return workItems;
    } catch (error) {
      console.error(`❌ Get work failed: ${error.message}`);
      throw error;
    }
  }

  async getDashboard() {
    try {
      const dashboard = await this.makeRequest('GET', '/dashboard');
      
      console.log('📊 Agent Communication Dashboard');
      console.log('═══════════════════════════════════');
      console.log(`Active Agents: ${dashboard.activeAgents}`);
      console.log(`Recent Messages: ${dashboard.recentActivity}`);
      console.log(`Pending Handoffs: ${dashboard.pendingHandoffs}`);
      console.log(`Active Work Items: ${dashboard.activeWork?.length || 0}`);
      
      if (dashboard.agents?.length > 0) {
        console.log('\n🤖 Active Agents:');
        dashboard.agents.forEach(agent => {
          console.log(`   ${agent.id} [${agent.status}] - Last seen: ${new Date(agent.last_seen).toLocaleString()}`);
        });
      }
      
      if (dashboard.recentMessages?.length > 0) {
        console.log('\n💬 Recent Messages:');
        dashboard.recentMessages.slice(-3).forEach(msg => {
          console.log(`   ${msg.from_agent} → ${msg.to_agent}: ${msg.content}`);
        });
      }
      
      return dashboard;
    } catch (error) {
      console.error(`❌ Dashboard failed: ${error.message}`);
      throw error;
    }
  }

  showHelp() {
    console.log(`
🔗 SQLite Agent Communication CLI
═══════════════════════════════════

Usage: node cli.cjs <command> [options]

Commands:
  register [capabilities...]     Register this agent with optional capabilities
  send <to> <message> [type]     Send message to agent or 'all'
  messages [--unread] [--limit]  Get messages for this agent
  
  state-set <key> <value>        Set shared state value
  state-get [key]                Get shared state (all if no key)
  
  work-create <id> <title> <desc> Create new work item
  work-update <id> <progress> [notes] Update work progress
  work-list                      List active work items
  
  dashboard                      Show dashboard summary
  help                          Show this help

Environment:
  AGENT_ID                      Set custom agent ID (default: auto-generated)

Examples:
  node cli.cjs register file-ops web-search
  node cli.cjs send all "Starting work on project"
  node cli.cjs messages --unread
  node cli.cjs state-set current_task "Building CLI tool"
  node cli.cjs work-create task-1 "Build CLI" "Create command-line interface"
  node cli.cjs dashboard

Agent ID: ${this.agentId}
API Server: ${API_BASE}
`);
  }
}

// Main CLI handler
async function main() {
  const cli = new AgentCommsCLI();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    cli.showHelp();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'register':
        const capabilities = args.slice(1);
        await cli.register(capabilities);
        break;

      case 'send':
        if (args.length < 3) {
          console.error('Usage: send <to> <message> [type]');
          process.exit(1);
        }
        await cli.sendMessage(args[1], args[2], args[3] || 'general');
        break;

      case 'messages':
        const unreadOnly = args.includes('--unread');
        const limitIndex = args.indexOf('--limit');
        const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) || 10 : 10;
        await cli.getMessages(unreadOnly, limit);
        break;

      case 'state-set':
        if (args.length < 3) {
          console.error('Usage: state-set <key> <value>');
          process.exit(1);
        }
        let value;
        try {
          value = JSON.parse(args[2]);
        } catch {
          value = args[2];
        }
        await cli.setState(args[1], value);
        break;

      case 'state-get':
        await cli.getState(args[1]);
        break;

      case 'work-create':
        if (args.length < 4) {
          console.error('Usage: work-create <id> <title> <description>');
          process.exit(1);
        }
        await cli.createWork(args[1], args[2], args[3]);
        break;

      case 'work-update':
        if (args.length < 3) {
          console.error('Usage: work-update <id> <progress> [notes]');
          process.exit(1);
        }
        await cli.updateWork(args[1], parseInt(args[2]), args[3] || '');
        break;

      case 'work-list':
        await cli.getWork();
        break;

      case 'dashboard':
        await cli.getDashboard();
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.error('Run "node cli.cjs help" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n💥 Command failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { AgentCommsCLI };