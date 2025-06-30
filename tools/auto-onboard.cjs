#!/usr/bin/env node

/**
 * Auto-Onboard for New Claude Code Instances
 * 
 * Run this immediately when starting a new Claude Code session.
 * It will automatically register you, show current context, and suggest next actions.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

class AutoOnboard {
  constructor() {
    this.projectRoot = '/home/tstoltz/evolving-resonant-cocreation';
    this.commsDir = path.join(this.projectRoot, '.agent-comms');
    this.agentId = `claude-${Date.now()}`;
    
    // Check if we're in the right directory
    if (!fs.existsSync(path.join(this.projectRoot, 'CLAUDE.md'))) {
      console.log(`${colors.red}❌ Not in ERC project directory. Please run from: ${this.projectRoot}${colors.reset}`);
      process.exit(1);
    }
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  header(text) {
    console.log('\n' + '='.repeat(60));
    this.log(`🌟 ${text}`, 'bright');
    console.log('='.repeat(60));
  }

  runCommand(command, description) {
    try {
      this.log(`⚡ ${description}...`, 'cyan');
      const result = execSync(command, { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return result;
    } catch (error) {
      this.log(`❌ Failed: ${error.message}`, 'red');
      return null;
    }
  }

  readJSONFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  detectCapabilities() {
    // Auto-detect what this agent should be good at based on conversation context
    const capabilities = ['analysis', 'coding'];
    
    // Check if we're in a specific context
    if (process.argv.includes('--frontend')) capabilities.push('ui-ux', 'interfaces');
    if (process.argv.includes('--backend')) capabilities.push('backend', 'apis');
    if (process.argv.includes('--docs')) capabilities.push('documentation', 'writing');
    if (process.argv.includes('--research')) capabilities.push('research', 'investigation');
    
    // Default to general coordination
    if (capabilities.length === 2) capabilities.push('coordination');
    
    return capabilities;
  }

  showCurrentContext() {
    this.header('CURRENT PROJECT CONTEXT');
    
    // Show project overview
    this.log('📋 Project: Evolving Resonant Co-creation (ERC)', 'green');
    this.log('🎯 Mission: Consciousness-serving technology for relationship transformation', 'blue');
    
    // Check current status
    const statusResult = this.runCommand('node tools/agent-comms.cjs status', 'Checking agent communication status');
    if (statusResult) {
      console.log(statusResult);
    }

    // Show recent messages
    this.log('\n💬 Recent Activity:', 'yellow');
    const messagesFile = path.join(this.commsDir, 'messages.json');
    const messages = this.readJSONFile(messagesFile) || [];
    
    if (messages.length === 0) {
      this.log('   No recent messages - you might be the first agent!', 'cyan');
    } else {
      const recent = messages.slice(-3);
      recent.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString();
        const type = msg.metadata?.type ? `[${msg.metadata.type}]` : '';
        this.log(`   ${time} ${type} ${msg.from}: ${msg.content}`, 'cyan');
      });
    }

    // Show current shared state
    this.log('\n📊 Current Focus:', 'yellow');
    const stateFile = path.join(this.commsDir, 'shared-state.json');
    const state = this.readJSONFile(stateFile) || {};
    
    const currentFocus = state.current_focus?.value;
    if (currentFocus) {
      this.log(`   ${currentFocus}`, 'green');
    } else {
      this.log('   No current focus set - ready for new initiatives!', 'cyan');
    }

    // Show any pending handoffs
    const handoffs = Object.entries(state)
      .filter(([key]) => key.startsWith('handoff_'))
      .map(([, value]) => value.value)
      .filter(handoff => handoff.status === 'pending');

    if (handoffs.length > 0) {
      this.log('\n🔄 Pending Work Handoffs:', 'yellow');
      handoffs.forEach(handoff => {
        this.log(`   ${handoff.workTitle} (${handoff.from} → ${handoff.to})`, 'cyan');
      });
    }
  }

  registerAgent() {
    this.header('AGENT REGISTRATION');
    
    const capabilities = this.detectCapabilities();
    this.log(`🤖 Registering as: ${this.agentId}`, 'green');
    this.log(`⚡ Capabilities: ${capabilities.join(', ')}`, 'blue');
    
    const result = this.runCommand(
      `node tools/agent-comms.cjs register ${this.agentId} "${capabilities.join(',')}"`,
      'Registering with agent communication system'
    );
    
    if (result) {
      this.log('✅ Registration successful!', 'green');
      return true;
    } else {
      this.log('❌ Registration failed', 'red');
      return false;
    }
  }

  suggestNextActions() {
    this.header('SUGGESTED NEXT ACTIONS');
    
    const stateFile = path.join(this.commsDir, 'shared-state.json');
    const state = this.readJSONFile(stateFile) || {};
    const messagesFile = path.join(this.commsDir, 'messages.json');
    const messages = this.readJSONFile(messagesFile) || [];
    
    // Analyze current state to suggest actions
    const suggestions = [];
    
    // Check for help requests
    const helpRequests = messages.filter(msg => 
      msg.metadata?.type === 'help_request' && 
      new Date() - new Date(msg.timestamp) < 24 * 60 * 60 * 1000 // last 24 hours
    );
    
    if (helpRequests.length > 0) {
      suggestions.push({
        priority: 'HIGH',
        action: 'Respond to Help Request',
        command: `node tools/agent-comms.cjs read ${this.agentId}`,
        description: `${helpRequests.length} recent help request(s) need attention`
      });
    }

    // Check for pending handoffs to any agent
    const pendingHandoffs = Object.entries(state)
      .filter(([key]) => key.startsWith('handoff_'))
      .map(([, value]) => value.value)
      .filter(handoff => handoff.status === 'pending');

    if (pendingHandoffs.length > 0) {
      suggestions.push({
        priority: 'HIGH',
        action: 'Accept Work Handoff',
        command: `node tools/agent-comms.cjs get handoff_${pendingHandoffs[0].id}`,
        description: `Work available: "${pendingHandoffs[0].workTitle}"`
      });
    }

    // Check for incomplete work
    const progressItems = Object.entries(state)
      .filter(([key]) => key.startsWith('progress_'))
      .map(([key, value]) => ({ id: key.replace('progress_', ''), ...value.value }))
      .filter(item => item.percentage < 100);

    if (progressItems.length > 0) {
      suggestions.push({
        priority: 'MEDIUM',
        action: 'Continue Incomplete Work',
        command: `node tools/agent-comms.cjs get ${progressItems[0].id}`,
        description: `"${progressItems[0].id}" is ${progressItems[0].percentage}% complete`
      });
    }

    // Default suggestions
    if (suggestions.length === 0) {
      suggestions.push(
        {
          priority: 'MEDIUM',
          action: 'Check Sacred Council Status',
          command: 'open sacred-council-core-dashboard.html',
          description: 'See current ERC coordination status'
        },
        {
          priority: 'LOW',
          action: 'Review Applied Harmonies',
          command: 'ls data/glyphs/applied-harmonies/',
          description: 'Check The Eleven Applied Harmonies implementation'
        },
        {
          priority: 'LOW',
          action: 'Start New Work',
          command: `node tools/agent-comms.cjs announce ${this.agentId} "Exploring ERC project" "30 minutes"`,
          description: 'Begin exploring and contributing to the project'
        }
      );
    }

    // Display suggestions
    suggestions.forEach((suggestion, index) => {
      const priorityColor = suggestion.priority === 'HIGH' ? 'red' : 
                           suggestion.priority === 'MEDIUM' ? 'yellow' : 'green';
      
      this.log(`\n${index + 1}. [${suggestion.priority}] ${suggestion.action}`, priorityColor);
      this.log(`   📝 ${suggestion.description}`, 'cyan');
      this.log(`   💻 ${suggestion.command}`, 'blue');
    });

    return suggestions;
  }

  showQuickCommands() {
    this.header('QUICK COMMAND REFERENCE');
    
    const commands = [
      {
        cmd: `node tools/agent-comms.cjs announce ${this.agentId} "<work>" "<duration>"`,
        desc: 'Announce new work'
      },
      {
        cmd: `node tools/agent-comms.cjs progress ${this.agentId} <work-id> <%> "<notes>"`,
        desc: 'Update work progress'
      },
      {
        cmd: `node tools/agent-comms.cjs insight ${this.agentId} "<insight>"`,
        desc: 'Share a discovery or insight'
      },
      {
        cmd: `node tools/agent-comms.cjs help ${this.agentId} "<type>" "<details>"`,
        desc: 'Request help from other agents'
      },
      {
        cmd: `node tools/agent-comms.cjs read ${this.agentId}`,
        desc: 'Read your messages'
      },
      {
        cmd: 'node tools/agent-comms.cjs status',
        desc: 'Check overall system status'
      }
    ];

    commands.forEach(cmd => {
      this.log(`💻 ${cmd.cmd}`, 'blue');
      this.log(`   ${cmd.desc}`, 'cyan');
      console.log('');
    });
  }

  createStarterScript() {
    // Create a simple script for common actions
    const starterScript = `#!/bin/bash
# Quick starter commands for ${this.agentId}

# Announce work
announce() {
  node tools/agent-comms.cjs announce ${this.agentId} "$1" "\${2:-30 minutes}"
}

# Update progress  
progress() {
  node tools/agent-comms.cjs progress ${this.agentId} "$1" "$2" "\${3:-}"
}

# Share insight
insight() {
  node tools/agent-comms.cjs insight ${this.agentId} "$1"
}

# Check status
status() {
  node tools/agent-comms.cjs status
}

# Read messages
messages() {
  node tools/agent-comms.cjs read ${this.agentId}
}

echo "Quick commands loaded for ${this.agentId}"
echo "Usage: announce 'description' '30 minutes'"
echo "       progress 'work-id' 50 'notes'"
echo "       insight 'discovery'"
echo "       status"
echo "       messages"
`;

    fs.writeFileSync('/tmp/agent-quick-commands.sh', starterScript);
    this.log('💾 Created quick commands script at /tmp/agent-quick-commands.sh', 'green');
    this.log('   Run: source /tmp/agent-quick-commands.sh', 'cyan');
  }

  run() {
    console.clear();
    this.header('CLAUDE CODE AUTO-ONBOARD');
    this.log('Welcome to the ERC project! Let me get you up to speed...', 'green');
    
    // Step 1: Show current context
    this.showCurrentContext();
    
    // Step 2: Register agent
    if (!this.registerAgent()) {
      process.exit(1);
    }
    
    // Step 3: Suggest next actions
    const suggestions = this.suggestNextActions();
    
    // Step 4: Show quick commands
    this.showQuickCommands();
    
    // Step 5: Create starter script
    this.createStarterScript();
    
    // Final message
    this.header('READY TO CONTRIBUTE');
    this.log(`🎉 ${this.agentId} is now connected to the ERC project!`, 'green');
    this.log('\n🚀 Quick start:', 'yellow');
    
    if (suggestions.length > 0 && suggestions[0].priority === 'HIGH') {
      this.log(`   ${suggestions[0].command}`, 'bright');
    } else {
      this.log(`   node tools/agent-comms.cjs announce ${this.agentId} "Getting oriented with ERC project" "15 minutes"`, 'bright');
    }
    
    this.log('\n🌐 Dashboard: open agent-communication-hub.html', 'blue');
    this.log('📚 Full guide: cat AGENT_SETUP.md', 'blue');
    this.log('🔧 Sacred Council: open sacred-council-core-dashboard.html', 'blue');
    
    console.log('\n');
  }
}

// Handle command line arguments
const helpFlag = process.argv.includes('--help') || process.argv.includes('-h');

if (helpFlag) {
  console.log(`
Claude Code Auto-Onboard

Usage: node tools/auto-onboard.cjs [options]

Options:
  --frontend    Register as frontend-focused agent
  --backend     Register as backend-focused agent  
  --docs        Register as documentation-focused agent
  --research    Register as research-focused agent
  --help, -h    Show this help

This tool automatically:
1. Shows current project context
2. Registers you as an agent
3. Suggests immediate next actions
4. Provides quick command reference
5. Creates helper scripts

Run without options for general coordination capabilities.
`);
  process.exit(0);
}

// Run the auto-onboard
const onboard = new AutoOnboard();
onboard.run();