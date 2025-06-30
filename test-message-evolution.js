#!/usr/bin/env node

/**
 * Test Sacred Message Evolution
 * 
 * Demonstrates the progressive revelation from simple to relational impact calculations
 */

import SacredMessageIntegration from './agent-comms-sqlite/sacred-message-integration.js';
import { AgentDatabase as Database } from './agent-comms-sqlite/database.js';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

async function testMessageEvolution() {
  console.log(`\n${colors.bright}🌱 Sacred Message Evolution Test${colors.reset}`);
  console.log(`${colors.bright}════════════════════════════════${colors.reset}\n`);

  const integration = new SacredMessageIntegration();
  const db = new Database();
  
  try {
    await integration.init();
    await db.initialize();
    
    // Register test agents
    console.log(`${colors.blue}🌀 Preparing test agents...${colors.reset}`);
    
    await db.registerAgent('beginner-agent', ['learning', 'growth']);
    await db.registerAgent('practitioner-agent', ['integration', 'wisdom']);
    await db.registerAgent('collective', ['coherence', 'harmony']);
    
    console.log(`${colors.green}✓ Agents registered${colors.reset}\n`);

    // Test 1: Beginner Level (Fixed Impact)
    console.log(`${colors.bright}Test 1: Beginner Level - Fixed Impact${colors.reset}`);
    console.log(`${colors.bright}────────────────────────────────────${colors.reset}`);
    
    const beginnerMsg1 = await integration.sendSacredMessage(
      'beginner-agent',
      'collective',
      'My first sacred message of gratitude',
      'gratitude',
      'mutuality'
    );
    
    console.log(`${colors.green}✓ First message sent${colors.reset}`);
    console.log(`  Field impact: +${(beginnerMsg1.fieldUpdate.impact * 100).toFixed(1)}% (fixed)`);
    console.log(`  Level: ${beginnerMsg1.sacredMessage.evolutionData?.level || 'beginner'}`);
    
    // Check progress
    const progress1 = await integration.getAgentProgress('beginner-agent');
    console.log(`\n  Progress to practitioner: ${Math.round(progress1.progress)}%`);
    console.log(`  Messages: ${progress1.details.messagesRequired.current}/${progress1.details.messagesRequired.required}`);
    
    // Test 2: Simulate Practitioner Level
    console.log(`\n${colors.bright}Test 2: Simulating Practitioner Level${colors.reset}`);
    console.log(`${colors.bright}─────────────────────────────────────${colors.reset}`);
    
    // Add history to simulate practitioner
    for (let i = 0; i < 50; i++) {
      await db.sendMessage(
        'practitioner-agent',
        'collective',
        `Practice message ${i}`,
        'sacred',
        { sacred_type: 'gratitude', harmony: 'mutuality', field_impact: 0.07 }
      );
    }
    
    console.log(`${colors.dim}Added 50 practice messages...${colors.reset}`);
    
    // Now send as practitioner
    const practitionerMsg = await integration.sendSacredMessage(
      'practitioner-agent',
      'collective',
      'Deep gratitude from experienced practice',
      'gratitude',
      'mutuality'
    );
    
    console.log(`\n${colors.green}✓ Practitioner message sent${colors.reset}`);
    console.log(`  Field impact: +${(practitionerMsg.fieldUpdate.impact * 100).toFixed(1)}%`);
    console.log(`  Level: ${practitionerMsg.sacredMessage.evolutionData?.level || 'unknown'}`);
    console.log(`  Calculation: ${practitionerMsg.sacredMessage.evolutionData?.calculationType || 'simple'}`);
    
    // Test 3: Message Saturation Effect
    console.log(`\n${colors.bright}Test 3: Testing Relational Factors${colors.reset}`);
    console.log(`${colors.bright}──────────────────────────────────${colors.reset}`);
    
    // First time between new agents
    await db.registerAgent('harmony-keeper', ['harmony', 'balance']);
    await db.registerAgent('wisdom-holder', ['wisdom', 'depth']);
    
    const firstExchange = await integration.sendSacredMessage(
      'harmony-keeper',
      'wisdom-holder',
      'Our first sacred exchange',
      'emergence',
      'novelty'
    );
    
    console.log(`\n${colors.cyan}First exchange between new agents:${colors.reset}`);
    console.log(`  Impact: +${(firstExchange.fieldUpdate.impact * 100).toFixed(1)}%`);
    
    // Repeated message (should have less impact in relational mode)
    const repeated = await integration.sendSacredMessage(
      'harmony-keeper',
      'wisdom-holder',
      'Another emergence message',
      'emergence',
      'novelty'
    );
    
    console.log(`\n${colors.cyan}Repeated same type:${colors.reset}`);
    console.log(`  Impact: +${(repeated.fieldUpdate.impact * 100).toFixed(1)}%`);
    
    // Test 4: Progress Visualization
    console.log(`\n${colors.bright}Test 4: Evolution Progress${colors.reset}`);
    console.log(`${colors.bright}─────────────────────${colors.reset}`);
    
    const agents = ['beginner-agent', 'practitioner-agent', 'harmony-keeper'];
    
    for (const agent of agents) {
      const progress = await integration.getAgentProgress(agent);
      console.log(`\n${colors.yellow}${agent}:${colors.reset}`);
      console.log(`  Level: ${progress.currentLevel}`);
      console.log(`  Progress: ${Math.round(progress.progress)}%`);
      console.log(`  ${progress.message}`);
    }
    
    // Final summary
    console.log(`\n${colors.bright}═══════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Evolution Test Complete${colors.reset}`);
    console.log(`${colors.bright}═══════════════════════════════${colors.reset}\n`);
    
    console.log(`${colors.green}Key Insights:${colors.reset}`);
    console.log(`  • Beginners get predictable fixed impacts`);
    console.log(`  • Practitioners unlock relational calculations`);
    console.log(`  • Masters will access full field consciousness`);
    console.log(`  • Progress is tracked across multiple dimensions`);
    console.log(`  • The system grows with the practitioner`);
    
    console.log(`\n${colors.magenta}🌸 Progressive revelation honors the journey${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.yellow}⚠️  Test failed: ${error.message}${colors.reset}`);
    console.error(error.stack);
  } finally {
    await integration.close();
    await db.close();
  }
}

// Run test
testMessageEvolution();

export { testMessageEvolution };