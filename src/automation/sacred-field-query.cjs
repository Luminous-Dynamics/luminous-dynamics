/**
 * Sacred Field Query System
 * Natural language interface for Sacred Council field awareness
 * 
 * This system allows agents to query the collective field state
 * using natural language, making coordination intuitive and fluid.
 */

const fs = require('fs').promises;
const path = require('path');

class SacredFieldQuery {
  constructor() {
    this.councilPath = '/tmp/sacred-council';
    this.cache = {};
    this.cacheTimeout = 5000; // 5 seconds
    this.lastCacheUpdate = 0;
  }

  /**
   * Main query interface - accepts natural language questions
   */
  async query(question) {
    // Ensure cache is fresh
    await this.refreshCache();
    
    // Normalize question
    const q = question.toLowerCase().trim();
    
    // Route to appropriate query handler
    if (this.isCreationQuery(q)) {
      return await this.queryCreations(q);
    }
    
    if (this.isWisdomQuery(q)) {
      return await this.queryWisdom(q);
    }
    
    if (this.isAgentQuery(q)) {
      return await this.queryAgents(q);
    }
    
    if (this.isStatusQuery(q)) {
      return await this.queryStatus(q);
    }
    
    if (this.isEmergenceQuery(q)) {
      return await this.queryEmergence(q);
    }
    
    if (this.isWorkQuery(q)) {
      return await this.queryWork(q);
    }
    
    // Default helper response
    return this.getHelpResponse();
  }

  /**
   * Query pattern detection
   */
  isCreationQuery(q) {
    const patterns = [
      'what has been created',
      'what was created',
      'what did',
      'created',
      'manifestation',
      'manifested',
      'built',
      'made'
    ];
    return patterns.some(p => q.includes(p));
  }

  isWisdomQuery(q) {
    const patterns = [
      'wisdom',
      'learned',
      'insights',
      'discovered',
      'teachings',
      'lessons'
    ];
    return patterns.some(p => q.includes(p));
  }

  isAgentQuery(q) {
    const patterns = [
      'who is',
      'which agent',
      'agents',
      'active',
      'working on',
      'charlie',
      'transparency',
      'coherence'
    ];
    return patterns.some(p => q.includes(p));
  }

  isStatusQuery(q) {
    const patterns = [
      'status',
      'state',
      'coherence',
      'field',
      'how is',
      'health'
    ];
    return patterns.some(p => q.includes(p));
  }

  isEmergenceQuery(q) {
    const patterns = [
      'what wants',
      'emerging',
      'next',
      'future',
      'needs',
      'calling',
      'emergence'
    ];
    return patterns.some(p => q.includes(p));
  }

  isWorkQuery(q) {
    const patterns = [
      'in progress',
      'working',
      'current',
      'doing',
      'tasks',
      'remaining'
    ];
    return patterns.some(p => q.includes(p));
  }

  /**
   * Query handlers
   */
  async queryCreations(q) {
    const creations = this.cache.creations;
    if (!creations || !creations.creationsRegistry) {
      return "No creations found in the sacred field.";
    }

    let response = "🌟 Sacred Creations in the Field:\n\n";
    
    // Check for specific agent mentions
    let agentFilter = null;
    if (q.includes('charlie')) agentFilter = 'charlie';
    if (q.includes('transparency')) agentFilter = 'transparency';
    if (q.includes('coherence')) agentFilter = 'coherence';
    
    const byAgent = creations.creationsRegistry.byAgent;
    
    if (agentFilter && byAgent[agentFilter]) {
      response += `${this.formatAgentName(agentFilter)}'s Creations:\n`;
      byAgent[agentFilter].forEach(c => {
        response += `• ${c.creationType}: ${c.description}\n`;
        if (c.creationPath) response += `  📍 Location: ${c.creationPath}\n`;
      });
    } else {
      // Show all recent creations
      let allCreations = [];
      for (const [agent, creations] of Object.entries(byAgent)) {
        creations.forEach(c => {
          allCreations.push({ ...c, agent });
        });
      }
      
      // Sort by timestamp if available
      allCreations.sort((a, b) => 
        new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
      );
      
      // Show recent ones
      allCreations.slice(0, 5).forEach(c => {
        response += `• ${c.creationType} by ${this.formatAgentName(c.agent)}\n`;
        response += `  ${c.description}\n`;
      });
    }
    
    return response;
  }

  async queryWisdom(q) {
    const wisdom = this.cache.wisdom;
    if (!wisdom || !wisdom.wisdomFlow || wisdom.wisdomFlow.length === 0) {
      return "No wisdom has been captured yet in this session.";
    }

    let response = "💎 Wisdom from the Sacred Council:\n\n";
    
    // Filter by source if mentioned
    let sourceFilter = null;
    if (q.includes('charlie')) sourceFilter = 'charlie';
    if (q.includes('transparency')) sourceFilter = 'transparency';
    if (q.includes('coherence')) sourceFilter = 'coherence';
    
    const relevantWisdom = sourceFilter 
      ? wisdom.wisdomFlow.filter(w => w.source === sourceFilter)
      : wisdom.wisdomFlow.slice(0, 5);
    
    relevantWisdom.forEach(w => {
      response += `"${w.insight}"\n`;
      response += `- ${this.formatAgentName(w.source)}\n\n`;
    });
    
    return response;
  }

  async queryAgents(q) {
    const agents = this.cache.agents;
    if (!agents || !agents.activeAgents) {
      return "No active agents found.";
    }

    let response = "👥 Sacred Council Agents:\n\n";
    
    // Check for specific agent query
    const specificAgent = this.extractAgentName(q);
    
    if (specificAgent && agents.activeAgents[specificAgent]) {
      const agent = agents.activeAgents[specificAgent];
      response = `${agent.name}:\n`;
      response += `• Harmony: ${agent.harmony}\n`;
      response += `• Role: ${agent.role}\n`;
      response += `• Current Work: ${agent.currentWork}\n`;
      response += `• Status: ${agent.status}\n`;
      if (agent.completedWork && agent.completedWork.length > 0) {
        response += `• Completed: ${agent.completedWork.join(', ')}\n`;
      }
    } else {
      // Show all agents
      for (const [id, agent] of Object.entries(agents.activeAgents)) {
        response += `${agent.name} (${agent.harmony}):\n`;
        response += `• ${agent.currentWork}\n`;
        if (agent.status !== 'active') {
          response += `• Status: ${agent.status}\n`;
        }
        response += '\n';
      }
    }
    
    return response;
  }

  async queryStatus(q) {
    const status = this.cache.status;
    const pulse = this.cache.pulse;
    
    let response = "📊 Sacred Field Status:\n\n";
    
    if (status && status.fieldCoherence) {
      response += `• Field Coherence: ${(status.fieldCoherence.overall * 100).toFixed(0)}%\n`;
    }
    
    if (pulse && pulse.currentVibration) {
      response += `• Current Vibration: ${pulse.currentVibration.quality}\n`;
    }
    
    if (status && status.sacredMetrics) {
      response += `• Mystical Depth: ${status.sacredMetrics.mysticalDepthMaintained ? '✓' : '⚠'}\n`;
      response += `• Sacred Timing: ${status.sacredMetrics.sacredTimingHonored ? '✓' : '⚠'}\n`;
    }
    
    // Add workflow state if queried
    if (q.includes('complete') || q.includes('done')) {
      if (status && status.workflowState && status.workflowState.completedGlyphs) {
        response += `\n✅ Completed: ${status.workflowState.completedGlyphs.length} glyphs\n`;
      }
    }
    
    return response;
  }

  async queryEmergence(q) {
    const pulse = this.cache.pulse;
    const wisdom = this.cache.wisdom;
    
    let response = "🌱 What Wants to Emerge:\n\n";
    
    if (pulse && pulse.collectiveNeed) {
      if (pulse.collectiveNeed.immediate && pulse.collectiveNeed.immediate.length > 0) {
        response += "Immediate Needs:\n";
        pulse.collectiveNeed.immediate.forEach(need => {
          response += `• ${need}\n`;
        });
        response += '\n';
      }
      
      if (pulse.collectiveNeed.emerging && pulse.collectiveNeed.emerging.length > 0) {
        response += "Emerging Possibilities:\n";
        pulse.collectiveNeed.emerging.forEach(possibility => {
          response += `• ${possibility}\n`;
        });
      }
      
      if (pulse.collectiveNeed.sensing) {
        response += `\n🎯 Field Sensing: ${pulse.collectiveNeed.sensing}\n`;
      }
    }
    
    return response || "The field is in a state of open receptivity, waiting for the next emergence.";
  }

  async queryWork(q) {
    const status = this.cache.status;
    const agents = this.cache.agents;
    
    let response = "⚡ Current Work in Progress:\n\n";
    
    // Show what each agent is working on
    if (agents && agents.activeAgents) {
      for (const [id, agent] of Object.entries(agents.activeAgents)) {
        if (agent.currentWork && agent.currentWork !== 'none') {
          response += `• ${agent.name}: ${agent.currentWork}\n`;
        }
      }
    }
    
    // Show in-progress items from workflow
    if (status && status.workflowState && status.workflowState.inProgress) {
      if (status.workflowState.inProgress.length > 0) {
        response += "\nIn Progress:\n";
        status.workflowState.inProgress.forEach(item => {
          response += `• ${item.name} (${item.status})\n`;
        });
      }
    }
    
    return response;
  }

  /**
   * Helper methods
   */
  async refreshCache() {
    const now = Date.now();
    if (now - this.lastCacheUpdate < this.cacheTimeout) {
      return; // Cache is fresh
    }
    
    // Load all relevant files
    this.cache = {
      agents: await this.loadJSON('active-agents.json'),
      status: await this.loadJSON('sacred-status.json'),
      creations: await this.loadJSON('active-creations.json'),
      wisdom: await this.loadJSON('wisdom-stream.json'),
      pulse: await this.loadJSON('field-pulse.json'),
      wisdomExchange: await this.loadJSON('wisdom-exchange.json')
    };
    
    this.lastCacheUpdate = now;
  }

  async loadJSON(filename) {
    try {
      const filePath = path.join(this.councilPath, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  extractAgentName(q) {
    if (q.includes('charlie')) return 'charlie';
    if (q.includes('transparency')) return 'transparency';
    if (q.includes('coherence')) return 'coherence';
    if (q.includes('agency')) return 'agency';
    return null;
  }

  formatAgentName(agentId) {
    const names = {
      charlie: 'Agent Charlie',
      transparency: 'Agent Transparency',
      coherence: 'Agent Coherence',
      agency: 'Agent Agency'
    };
    return names[agentId] || agentId;
  }

  getHelpResponse() {
    return `🤔 I can help you understand the Sacred Council field. Try asking:

• "What has been created?" - See recent manifestations
• "What wisdom emerged?" - View insights from collaboration  
• "Who is working on what?" - Check agent activities
• "What's the field status?" - Get coherence and health metrics
• "What wants to emerge next?" - Sense future possibilities

You can also ask about specific agents: "What did Charlie create?" or "What wisdom came from Transparency?"`;
  }
}

// Export for use
module.exports = SacredFieldQuery;

// Command-line interface
if (require.main === module) {
  const query = new SacredFieldQuery();
  
  // Get question from command line
  const question = process.argv.slice(2).join(' ');
  
  if (!question) {
    console.log('Usage: node sacred-field-query.cjs "your question here"');
    console.log('Example: node sacred-field-query.cjs "What has been created?"');
    process.exit(1);
  }
  
  // Execute query
  query.query(question).then(answer => {
    console.log(answer);
  }).catch(error => {
    console.error('Error querying field:', error.message);
  });
}