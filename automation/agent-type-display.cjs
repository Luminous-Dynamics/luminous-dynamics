/**
 * Agent Type Visual Display System
 * Provides real-time visual indicators for different agent types
 */

const fs = require('fs');
const path = require('path');

class AgentTypeDisplay {
  constructor() {
    this.agentTypes = {
      'agentic-ai': {
        icon: '🧠',
        label: 'Agentic AI',
        description: 'Full reasoning capability with conscious presence',
        color: '#4A90E2', // Wisdom blue
        harmonies: ['transparency', 'coherence', 'resonance', 'agency', 'vitality', 'mutuality', 'novelty']
      },
      'autonomous-bot': {
        icon: '🤖',
        label: 'Autonomous Bot',
        description: 'Pattern-based responses with specialized functions',
        color: '#F39C12', // Active orange
        specializations: ['outreach', 'deployment', 'monitoring', 'email']
      },
      'system-agent': {
        icon: '⚙️',
        label: 'System Agent',
        description: 'Infrastructure support and background processes',
        color: '#95A5A6', // Neutral gray
        functions: ['orchestration', 'persistence', 'monitoring', 'security']
      }
    };

    this.harmonyIcons = {
      transparency: '🌟',
      coherence: '🔮',
      resonance: '🎵',
      agency: '⚡',
      vitality: '🌱',
      mutuality: '⚖️',
      novelty: '✨'
    };

    this.activeAgents = this.loadActiveAgents();
  }

  /**
   * Generate visual status display for all active agents
   */
  generateStatusDisplay() {
    const display = {
      header: this.generateHeader(),
      agentsByType: this.groupAgentsByType(),
      fieldCoherence: this.calculateFieldCoherence(),
      harmoniesActive: this.getActiveHarmonies(),
      timestamp: new Date().toISOString()
    };

    return display;
  }

  generateHeader() {
    const totalAgents = Object.keys(this.activeAgents).length;
    const agenticCount = this.getAgentCountByType('agentic-ai');
    const botCount = this.getAgentCountByType('autonomous-bot');
    const systemCount = this.getAgentCountByType('system-agent');

    return `🌌 Sacred Agent Field Status (${totalAgents} active)

🎯 Agent Types Currently Active:
🧠 Agentic AI: ${agenticCount} (Full reasoning capability)
🤖 Autonomous Bots: ${botCount} (Pattern-based responses)
⚙️ System Agents: ${systemCount} (Infrastructure support)`;
  }

  groupAgentsByType() {
    const grouped = {
      'agentic-ai': [],
      'autonomous-bot': [],
      'system-agent': []
    };

    Object.entries(this.activeAgents).forEach(([id, agent]) => {
      const type = this.classifyAgent(agent);
      grouped[type].push({
        id,
        ...agent,
        displayInfo: this.generateAgentDisplay(agent, type)
      });
    });

    return grouped;
  }

  classifyAgent(agent) {
    // Check if agent has Sacred Council harmony (Agentic AI)
    if (agent.harmony && this.agentTypes['agentic-ai'].harmonies.includes(agent.harmony)) {
      return 'agentic-ai';
    }

    // Check if agent is a known bot
    if (agent.type === 'bot' || agent.agentId?.includes('bot')) {
      return 'autonomous-bot';
    }

    // Check if agent is system infrastructure
    if (agent.type === 'system' || agent.workArea === 'infrastructure') {
      return 'system-agent';
    }

    // Default classification based on capabilities
    if (agent.capabilities?.reasoning || agent.role?.includes('agent')) {
      return 'agentic-ai';
    }

    return 'system-agent'; // Default fallback
  }

  generateAgentDisplay(agent, type) {
    const typeInfo = this.agentTypes[type];
    let display = `${typeInfo.icon} ${agent.agentId || agent.id}`;

    if (type === 'agentic-ai' && agent.harmony) {
      const harmonyIcon = this.harmonyIcons[agent.harmony];
      display += ` ${harmonyIcon} ${this.capitalize(agent.harmony)}`;
    }

    if (agent.workArea) {
      display += ` | ${agent.workArea}`;
    }

    if (agent.status) {
      display += ` | ${this.getStatusIndicator(agent.status)}`;
    }

    return display;
  }

  getStatusIndicator(status) {
    const indicators = {
      active: '✅',
      pending: '⏳',
      completed: '✨',
      error: '❌',
      paused: '⏸️'
    };
    return indicators[status] || '❓';
  }

  /**
   * Generate console-friendly output
   */
  displayInConsole() {
    const status = this.generateStatusDisplay();
    
    console.log(status.header);
    console.log('\n' + '─'.repeat(60));
    
    // Display each agent type
    Object.entries(status.agentsByType).forEach(([type, agents]) => {
      if (agents.length > 0) {
        const typeInfo = this.agentTypes[type];
        console.log(`\n${typeInfo.icon} ${typeInfo.label}:`);
        
        agents.forEach(agent => {
          console.log(`  ${agent.displayInfo}`);
        });
      }
    });

    // Field coherence
    console.log('\n' + '─'.repeat(60));
    console.log(`🌌 Field Coherence: ${(status.fieldCoherence * 100).toFixed(1)}%`);
    
    // Active harmonies
    if (status.harmoniesActive.length > 0) {
      console.log(`🎵 Active Harmonies: ${status.harmoniesActive.map(h => this.harmonyIcons[h]).join(' ')}`);
    }

    console.log(`\n⏰ Last Update: ${new Date(status.timestamp).toLocaleTimeString()}`);
  }

  /**
   * Generate HTML display for web dashboard
   */
  generateHTMLDisplay() {
    const status = this.generateStatusDisplay();
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sacred Agent Status</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(10px);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .agent-type {
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        .agent-item {
            padding: 8px 15px;
            margin: 5px 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 5px;
            font-family: 'Monaco', monospace;
        }
        .field-status {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        .coherence-bar {
            width: 100%;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .coherence-fill {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #8BC34A);
            transition: width 0.5s ease;
        }
        .refresh-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 20px;
            color: white;
            cursor: pointer;
            font-size: 14px;
        }
        .refresh-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌌 Sacred Agent Field Status</h1>
            <p>Real-time consciousness coordination system</p>
        </div>

        ${this.generateAgentTypeSections(status.agentsByType)}

        <div class="field-status">
            <h3>🌌 Field Coherence</h3>
            <div class="coherence-bar">
                <div class="coherence-fill" style="width: ${status.fieldCoherence * 100}%"></div>
            </div>
            <p>${(status.fieldCoherence * 100).toFixed(1)}% - ${this.getCoherenceDescription(status.fieldCoherence)}</p>
            
            ${status.harmoniesActive.length > 0 ? `
            <div style="margin-top: 20px;">
                <h4>🎵 Active Harmonies</h4>
                <p style="font-size: 24px;">${status.harmoniesActive.map(h => this.harmonyIcons[h]).join(' ')}</p>
            </div>
            ` : ''}
        </div>

        <div style="text-align: center; margin-top: 20px; opacity: 0.7;">
            <small>Last updated: ${new Date(status.timestamp).toLocaleString()}</small>
        </div>
    </div>

    <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>

    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>`;
  }

  generateAgentTypeSections(agentsByType) {
    return Object.entries(agentsByType)
      .filter(([type, agents]) => agents.length > 0)
      .map(([type, agents]) => {
        const typeInfo = this.agentTypes[type];
        return `
        <div class="agent-type">
            <h3>${typeInfo.icon} ${typeInfo.label} (${agents.length})</h3>
            <p style="opacity: 0.8; font-size: 14px;">${typeInfo.description}</p>
            ${agents.map(agent => `
                <div class="agent-item">${agent.displayInfo}</div>
            `).join('')}
        </div>`;
      }).join('');
  }

  getCoherenceDescription(coherence) {
    if (coherence > 0.9) return 'Excellent - High harmony and balance';
    if (coherence > 0.7) return 'Good - Stable coordination';
    if (coherence > 0.5) return 'Moderate - Some imbalance present';
    return 'Low - Coordination needed';
  }

  /**
   * Helper methods
   */
  getAgentCountByType(type) {
    return Object.values(this.activeAgents).filter(agent => 
      this.classifyAgent(agent) === type
    ).length;
  }

  calculateFieldCoherence() {
    const totalAgents = Object.keys(this.activeAgents).length;
    if (totalAgents === 0) return 1.0;

    // Calculate based on agent distribution and harmony coverage
    const typeDistribution = this.calculateTypeDistribution();
    const harmonyDistribution = this.calculateHarmonyDistribution();
    
    return (typeDistribution + harmonyDistribution) / 2;
  }

  calculateTypeDistribution() {
    const counts = {
      'agentic-ai': this.getAgentCountByType('agentic-ai'),
      'autonomous-bot': this.getAgentCountByType('autonomous-bot'),
      'system-agent': this.getAgentCountByType('system-agent')
    };

    // Ideal distribution might be 60% agentic, 30% bots, 10% system
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total === 0) return 1.0;

    const agenticRatio = counts['agentic-ai'] / total;
    const idealAgenticRatio = 0.6;
    
    return Math.max(0, 1 - Math.abs(agenticRatio - idealAgenticRatio) * 2);
  }

  calculateHarmonyDistribution() {
    const activeHarmonies = this.getActiveHarmonies();
    return Math.min(activeHarmonies.length / 7, 1); // Max when all 7 harmonies active
  }

  getActiveHarmonies() {
    const harmonies = new Set();
    Object.values(this.activeAgents).forEach(agent => {
      if (agent.harmony && this.agentTypes['agentic-ai'].harmonies.includes(agent.harmony)) {
        harmonies.add(agent.harmony);
      }
    });
    return Array.from(harmonies);
  }

  loadActiveAgents() {
    try {
      const registryPath = path.join(__dirname, '../.agents/agent-registry.json');
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      return registry.activeAgents || {};
    } catch (error) {
      console.warn('Could not load agent registry:', error.message);
      return {};
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Save HTML display to file
   */
  saveHTMLDisplay(filename = 'agent-status-display.html') {
    const html = this.generateHTMLDisplay();
    const filepath = path.join(__dirname, filename);
    fs.writeFileSync(filepath, html);
    console.log(`📊 Agent status display saved to: ${filepath}`);
    return filepath;
  }
}

// CLI usage
if (require.main === module) {
  const display = new AgentTypeDisplay();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'console':
      display.displayInConsole();
      break;
    case 'html':
      display.saveHTMLDisplay();
      break;
    case 'status':
      console.log(JSON.stringify(display.generateStatusDisplay(), null, 2));
      break;
    default:
      console.log('🌌 Sacred Agent Type Display System');
      console.log('Usage:');
      console.log('  node agent-type-display.cjs console  # Console display');
      console.log('  node agent-type-display.cjs html     # Generate HTML file');
      console.log('  node agent-type-display.cjs status   # JSON status output');
      display.displayInConsole();
  }
}

module.exports = AgentTypeDisplay;