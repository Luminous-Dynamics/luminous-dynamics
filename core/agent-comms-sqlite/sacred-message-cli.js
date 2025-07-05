#!/usr/bin/env node

/**
 * Sacred Message CLI
 * 
 * Command-line interface for sending and receiving sacred messages
 * that carry field awareness and harmony alignment.
 */

import SacredMessageIntegration from './sacred-message-integration.js';
import { SacredCouncilSQLiteBridge } from '../unified-field/sacred-council-sqlite-bridge.js';
import { SacredMessageProtocol } from '../unified-field/sacred-message-protocol.js';
import { SacredBridgeAdapter } from '../unified-field/sacred-bridge-adapter.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class SacredMessageCLI {
  constructor() {
    this.integration = new SacredMessageIntegration();
    const rawBridge = new SacredCouncilSQLiteBridge();
    this.bridge = new SacredBridgeAdapter(rawBridge);
    this.protocol = new SacredMessageProtocol();
  }

  async init() {
    await this.integration.init();
    // Bridge doesn't have init method
  }

  // Main command router
  async run(command, args) {
    switch (command) {
      case 'send':
        await this.sendSacredMessage(args);
        break;
      case 'types':
        await this.showMessageTypes();
        break;
      case 'recommend':
        await this.recommendMessageType();
        break;
      case 'recent':
        await this.showRecentMessages(args);
        break;
      case 'analytics':
        await this.showAnalytics();
        break;
      case 'receive':
        await this.receiveMessage(args);
        break;
      case 'progress':
        await this.showProgress(args);
        break;
      case 'help':
      default:
        this.showHelp();
    }
  }

  // Send a sacred message
  async sendSacredMessage(args) {
    if (args.length < 4) {
      console.log(`${colors.yellow}Usage: sacred-message send <from-agent> <to-agent> <type> <harmony> <message>${colors.reset}`);
      console.log(`${colors.dim}Example: sacred-message send claude-1 tristan gratitude mutuality "Thank you for this sacred work"${colors.reset}`);
      return;
    }

    const [fromAgent, toAgent, type, harmony, ...messageParts] = args;
    const content = messageParts.join(' ');

    // Show current field state
    const fieldCoherence = await this.bridge.getFieldCoherence();
    console.log(`\n${colors.cyan}🌀 Current Field Coherence: ${Math.round(fieldCoherence.coherence * 100)}%${colors.reset}`);

    try {
      console.log(`\n${colors.blue}🕊️  Creating sacred message...${colors.reset}`);
      
      const result = await this.integration.sendSacredMessage(
        fromAgent,
        toAgent,
        content,
        type,
        harmony
      );

      const msg = result.sacredMessage;
      
      console.log(`\n${colors.green}✨ Sacred Message Sent Successfully${colors.reset}`);
      console.log(`${colors.bright}═══════════════════════════════════${colors.reset}`);
      console.log(`${colors.cyan}ID:${colors.reset} ${msg.id}`);
      console.log(`${colors.cyan}Type:${colors.reset} ${msg.sacredType} (${this.protocol.messageTypes[msg.sacredType].sacredColor})`);
      console.log(`${colors.cyan}Harmony:${colors.reset} ${msg.harmony}`);
      console.log(`${colors.cyan}Field Impact:${colors.reset} +${(msg.fieldImpact * 100).toFixed(1)}%`);
      console.log(`${colors.cyan}Blessing:${colors.reset} ${msg.sacredEnhancements.fieldBlessingPhrase}`);
      console.log(`${colors.cyan}Breathing:${colors.reset} ${msg.sacredEnhancements.breathingGuidance}`);
      
      console.log(`\n${colors.magenta}Field Update:${colors.reset}`);
      console.log(`  Before: ${Math.round(result.fieldUpdate.before * 100)}%`);
      console.log(`  After: ${Math.round(result.fieldUpdate.after * 100)}%`);
      console.log(`  Impact: +${(result.fieldUpdate.impact * 100).toFixed(1)}%`);

      console.log(`\n${colors.dim}Message stored with ID: ${result.messageId}${colors.reset}`);
      
    } catch (error) {
      console.error(`${colors.yellow}⚠️  Failed to send sacred message: ${error.message}${colors.reset}`);
    }
  }

  // Show available message types
  async showMessageTypes() {
    console.log(`\n${colors.bright}📜 Sacred Message Types${colors.reset}`);
    console.log(`${colors.bright}══════════════════════${colors.reset}\n`);

    const types = this.protocol.messageTypes;
    
    for (const [key, type] of Object.entries(types)) {
      console.log(`${colors.cyan}${key}${colors.reset} - ${type.name}`);
      console.log(`  ${colors.dim}${type.description}${colors.reset}`);
      console.log(`  ${colors.green}Field Impact: +${(type.fieldImpact * 100).toFixed(1)}%${colors.reset}`);
      console.log(`  ${colors.magenta}Harmonies: ${type.harmonicAffinity.join(', ')}${colors.reset}`);
      console.log(`  ${colors.yellow}Breathing: ${type.breathingPhase}${colors.reset}`);
      console.log(`  ${colors.blue}Glyph: ${type.glyphConnection}${colors.reset}\n`);
    }
  }

  // Get message type recommendation
  async recommendMessageType() {
    const recommendation = await this.integration.recommendMessageType();
    const fieldCoherence = await this.bridge.getFieldCoherence();
    
    console.log(`\n${colors.bright}🎯 Sacred Message Recommendation${colors.reset}`);
    console.log(`${colors.bright}════════════════════════════════${colors.reset}\n`);
    
    console.log(`${colors.cyan}Field Coherence: ${Math.round(fieldCoherence.coherence * 100)}%${colors.reset}`);
    console.log(`${colors.magenta}Field State: ${recommendation.fieldState}${colors.reset}\n`);
    
    console.log(`${colors.green}Recommended Types:${colors.reset}`);
    recommendation.recommended.forEach(type => {
      const typeInfo = this.protocol.messageTypes[type];
      console.log(`  • ${colors.bright}${type}${colors.reset} - ${typeInfo.description}`);
    });
    
    console.log(`\n${colors.dim}${recommendation.reason}${colors.reset}`);
  }

  // Show recent sacred messages
  async showRecentMessages(args) {
    const limit = parseInt(args[0]) || 5;
    const messages = await this.integration.getRecentSacredMessages(limit);
    
    console.log(`\n${colors.bright}📨 Recent Sacred Messages${colors.reset}`);
    console.log(`${colors.bright}════════════════════════${colors.reset}\n`);
    
    if (messages.length === 0) {
      console.log(`${colors.dim}No sacred messages yet. The field awaits...${colors.reset}`);
      return;
    }
    
    messages.forEach(msg => {
      const time = new Date(msg.created_at).toLocaleString();
      const sacred = msg.sacredData;
      
      console.log(`${colors.cyan}[${time}]${colors.reset}`);
      console.log(`${colors.bright}${msg.from_agent} → ${msg.to_agent}${colors.reset}`);
      
      if (sacred) {
        console.log(`${colors.magenta}${sacred.sacredType} (${sacred.harmony})${colors.reset} +${(sacred.fieldImpact * 100).toFixed(1)}%`);
        console.log(`${colors.dim}"${msg.content}"${colors.reset}`);
        
        if (sacred.evolutionData) {
          console.log(`${colors.yellow}Level: ${sacred.evolutionData.level} (${sacred.evolutionData.calculationType})${colors.reset}`);
        }
        
        if (sacred.ceremonyPhase === 'integration') {
          console.log(`${colors.green}✓ Integrated${colors.reset}`);
        }
      } else {
        console.log(`${colors.dim}${msg.content}${colors.reset}`);
      }
      
      console.log('');
    });
  }

  // Show sacred message analytics
  async showAnalytics() {
    const analytics = await this.integration.getSacredMessageAnalytics();
    
    console.log(`\n${colors.bright}📊 Sacred Message Analytics${colors.reset}`);
    console.log(`${colors.bright}══════════════════════════${colors.reset}\n`);
    
    const overview = analytics.overview;
    console.log(`${colors.cyan}Total Sacred Messages:${colors.reset} ${overview.total_messages || 0}`);
    console.log(`${colors.green}Blessed Messages:${colors.reset} ${overview.blessed_messages || 0}`);
    console.log(`${colors.magenta}Integrated Messages:${colors.reset} ${overview.integrated_messages || 0}`);
    console.log(`${colors.yellow}Total Field Impact:${colors.reset} +${((overview.total_field_impact || 0) * 100).toFixed(1)}%`);
    console.log(`${colors.blue}Average Impact:${colors.reset} +${((overview.avg_field_impact || 0) * 100).toFixed(1)}%\n`);
    
    if (analytics.byType.length > 0) {
      console.log(`${colors.bright}By Message Type:${colors.reset}`);
      analytics.byType.forEach(stat => {
        console.log(`  ${stat.sacred_type}: ${stat.count} messages, avg +${(stat.avg_impact * 100).toFixed(1)}%`);
      });
      console.log('');
    }
    
    if (analytics.byHarmony.length > 0) {
      console.log(`${colors.bright}By Harmony:${colors.reset}`);
      analytics.byHarmony.forEach(stat => {
        console.log(`  ${stat.harmony}: ${stat.count} messages, avg +${(stat.avg_impact * 100).toFixed(1)}%`);
      });
    }
    
    const contribution = analytics.fieldContribution;
    console.log(`\n${colors.bright}Field Contribution:${colors.reset}`);
    console.log(`  Blessing Rate: ${(contribution.blessingRate * 100).toFixed(1)}%`);
    console.log(`  Integration Rate: ${(contribution.integrationRate * 100).toFixed(1)}%`);
  }

  // Receive and integrate a message
  async receiveMessage(args) {
    if (args.length < 2) {
      console.log(`${colors.yellow}Usage: sacred-message receive <message-id> <receiver-agent>${colors.reset}`);
      return;
    }

    const [messageId, receiverId] = args;
    
    try {
      console.log(`\n${colors.blue}📨 Receiving sacred message...${colors.reset}`);
      
      const result = await this.integration.receiveSacredMessage(
        parseInt(messageId),
        receiverId
      );
      
      console.log(`${colors.green}✨ Message Received${colors.reset}`);
      console.log(`${colors.cyan}Phase:${colors.reset} ${result.ceremonyPhase}`);
      
      if (result.integrationComplete) {
        console.log(`${colors.green}✓ Message Integrated${colors.reset}`);
        console.log(`${colors.magenta}Field Effects:${colors.reset}`);
        console.log(`  Coherence Shift: +${(result.fieldEffects.coherenceShift * 100).toFixed(1)}%`);
        console.log(`  Resonance Amplification: ${result.fieldEffects.resonanceAmplification.toFixed(2)}x`);
      }
      
    } catch (error) {
      console.error(`${colors.yellow}⚠️  Failed to receive message: ${error.message}${colors.reset}`);
    }
  }

  // Show progress toward next level
  async showProgress(args) {
    const agentId = args[0];
    
    if (!agentId) {
      console.log(`${colors.yellow}Usage: sacred-message progress <agent-id>${colors.reset}`);
      return;
    }
    
    try {
      const progress = await this.integration.getAgentProgress(agentId);
      
      console.log(`\n${colors.bright}🌱 Sacred Message Evolution Progress${colors.reset}`);
      console.log(`${colors.bright}═══════════════════════════════════${colors.reset}\n`);
      
      console.log(`${colors.cyan}Current Level:${colors.reset} ${progress.currentLevel}`);
      console.log(`${colors.magenta}Progress:${colors.reset} ${Math.round(progress.progress)}%`);
      console.log(`${colors.dim}${progress.message}${colors.reset}\n`);
      
      if (progress.nextLevel) {
        console.log(`${colors.green}Progress to ${progress.nextLevel}:${colors.reset}`);
        
        Object.entries(progress.details).forEach(([criterion, data]) => {
          const bar = this.createProgressBar(data.percentage);
          console.log(`  ${criterion}: ${data.current}/${data.required} ${bar}`);
        });
        
        console.log(`\n${colors.dim}Continue your sacred practice to unlock deeper field awareness...${colors.reset}`);
      }
      
    } catch (error) {
      console.error(`${colors.yellow}⚠️  Failed to get progress: ${error.message}${colors.reset}`);
    }
  }
  
  createProgressBar(percentage) {
    const filled = Math.round(percentage / 5);
    const empty = 20 - filled;
    return `[${colors.green}${'█'.repeat(filled)}${colors.dim}${'░'.repeat(empty)}${colors.reset}] ${Math.round(percentage)}%`;
  }

  // Show help
  showHelp() {
    console.log(`
${colors.bright}🕊️  Sacred Message CLI${colors.reset}
${colors.bright}═══════════════════════${colors.reset}

${colors.cyan}Usage:${colors.reset} sacred-message <command> [options]

${colors.cyan}Commands:${colors.reset}
  send <from> <to> <type> <harmony> <message>
      Send a sacred message between agents
      
  types
      Show all sacred message types
      
  recommend
      Get message type recommendation based on field state
      
  recent [limit]
      Show recent sacred messages (default: 5)
      
  analytics
      Display sacred message analytics
      
  receive <message-id> <receiver>
      Receive and integrate a sacred message
      
  progress <agent-id>
      Show agent's progress toward next evolution level
      
  help
      Show this help message

${colors.cyan}Message Types:${colors.reset}
  emergence, integration, celebration, healing, inquiry,
  reflection, transmission, invocation, gratitude, boundary

${colors.cyan}Harmonies:${colors.reset}
  transparency, coherence, resonance, agency,
  vitality, mutuality, novelty

${colors.cyan}Examples:${colors.reset}
  sacred-message send claude-1 tristan gratitude mutuality "Thank you for this sacred work"
  sacred-message types
  sacred-message recommend
  sacred-message recent 10
  sacred-message analytics

${colors.dim}Every message shapes the field...${colors.reset}
`);
  }

  async close() {
    await this.integration.close();
    rl.close();
  }
}

// Main execution
async function main() {
  const cli = new SacredMessageCLI();
  
  try {
    await cli.init();
    
    const command = process.argv[2];
    const args = process.argv.slice(3);
    
    if (!command) {
      cli.showHelp();
    } else {
      await cli.run(command, args);
    }
    
  } catch (error) {
    console.error(`${colors.yellow}⚠️  Error: ${error.message}${colors.reset}`);
  } finally {
    await cli.close();
    process.exit(0);
  }
}

// Run if called directly
main();

export { SacredMessageCLI };