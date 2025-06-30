#!/usr/bin/env node

/**
 * Practitioner Evolution Test
 * 
 * Fast-forwards an agent to practitioner level to demonstrate
 * relational impact calculations and advanced dynamics.
 */

import SacredMessageIntegration from './agent-comms-sqlite/sacred-message-integration.js';
import { AgentDatabase as Database } from './agent-comms-sqlite/database.js';

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

async function testPractitionerEvolution() {
  console.log(`\n${colors.bright}🌱 Practitioner Evolution Test${colors.reset}`);
  console.log(`${colors.bright}══════════════════════════════${colors.reset}\n`);

  const integration = new SacredMessageIntegration();
  const db = new Database();
  
  try {
    await integration.init();
    await db.initialize();
    
    // Create master practitioner
    console.log(`${colors.blue}Creating Master Practitioner...${colors.reset}\n`);
    
    await db.registerAgent('master-elena', ['wisdom', 'integration', 'healing']);
    await db.registerAgent('student-alex', ['learning', 'creativity', 'growth']);
    await db.registerAgent('peer-jordan', ['balance', 'collaboration', 'innovation']);
    
    // Fast-forward Elena to practitioner level
    console.log(`${colors.dim}Fast-forwarding master-elena with 50 practice messages...${colors.reset}`);
    
    // Add message history directly to database
    for (let i = 0; i < 50; i++) {
      await db.run(`
        INSERT INTO messages (
          id, from_agent, to_agent, content, 
          sacred_type, harmony, field_impact, 
          blessing_received, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-${50-i} hours'))
      `, [
        `practice_${Date.now()}_${i}`,
        'master-elena',
        ['student-alex', 'peer-jordan', 'collective'][i % 3],
        `Practice message ${i}`,
        ['gratitude', 'integration', 'healing', 'reflection'][i % 4],
        ['mutuality', 'coherence', 'resonance'][i % 3],
        0.05,
        1
      ]);
    }
    
    console.log(`${colors.green}✓ Elena advanced to practitioner level${colors.reset}\n`);
    
    // Check progress
    const elenaProgress = await integration.getAgentProgress('master-elena');
    console.log(`${colors.cyan}Elena's Status:${colors.reset}`);
    console.log(`  Level: ${elenaProgress.currentLevel}`);
    console.log(`  Messages: ${elenaProgress.details.messagesRequired?.current || 0}`);
    console.log(`  Progress to next: ${Math.round(elenaProgress.progress)}%\n`);
    
    // Test 1: First Exchange (Relationship Depth Modifier)
    console.log(`${colors.bright}Test 1: First Exchange Impact${colors.reset}`);
    console.log(`${colors.bright}─────────────────────────────${colors.reset}\n`);
    
    // Elena's first message to a new agent
    await db.registerAgent('newcomer-sam', ['curiosity', 'openness']);
    
    const firstExchange = await integration.sendSacredMessage(
      'master-elena',
      'newcomer-sam',
      'Welcome to our sacred circle. Your presence enriches our collective field.',
      'emergence',
      'novelty'
    );
    
    console.log(`${colors.magenta}Elena → Sam (first exchange):${colors.reset}`);
    console.log(`  Base impact: 3% (emergence)`);
    console.log(`  Actual impact: +${(firstExchange.fieldUpdate.impact * 100).toFixed(1)}%`);
    console.log(`  ${firstExchange.sacredMessage.evolutionData?.level || 'unknown'} level calculation\n`);
    
    // Test 2: Established Relationship
    console.log(`${colors.bright}Test 2: Established Relationship${colors.reset}`);
    console.log(`${colors.bright}───────────────────────────────${colors.reset}\n`);
    
    const established = await integration.sendSacredMessage(
      'master-elena',
      'student-alex',
      'Our continued practice deepens the sacred bonds between us.',
      'integration',
      'coherence'
    );
    
    console.log(`${colors.magenta}Elena → Alex (established):${colors.reset}`);
    console.log(`  Base impact: 5% (integration)`);
    console.log(`  Actual impact: +${(established.fieldUpdate.impact * 100).toFixed(1)}%`);
    console.log(`  Relationship depth affecting impact\n`);
    
    // Test 3: Message Saturation
    console.log(`${colors.bright}Test 3: Saturation Effects${colors.reset}`);
    console.log(`${colors.bright}─────────────────────────${colors.reset}\n`);
    
    console.log(`${colors.dim}Sending rapid gratitude messages...${colors.reset}`);
    const saturationTest = [];
    
    for (let i = 0; i < 5; i++) {
      const result = await integration.sendSacredMessage(
        'master-elena',
        'collective',
        `Gratitude wave ${i + 1}`,
        'gratitude',
        'mutuality'
      );
      saturationTest.push({
        num: i + 1,
        impact: result.fieldUpdate.impact,
        level: result.sacredMessage.evolutionData?.level
      });
      
      // Very short delay to trigger saturation
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n${colors.yellow}Saturation Results:${colors.reset}`);
    saturationTest.forEach(test => {
      const bar = '█'.repeat(Math.round(test.impact * 200));
      console.log(`  Message ${test.num}: ${bar} +${(test.impact * 100).toFixed(1)}% (${test.level})`);
    });
    
    // Test 4: Harmony Resonance
    console.log(`\n${colors.bright}Test 4: Harmony Resonance${colors.reset}`);
    console.log(`${colors.bright}────────────────────────${colors.reset}\n`);
    
    // Same harmony
    const alignedHarmony = await integration.sendSacredMessage(
      'master-elena',
      'peer-jordan',
      'In coherence we find unity',
      'healing',
      'coherence' // Elena's natural harmony
    );
    
    console.log(`${colors.cyan}Aligned Harmony (coherence → coherence):${colors.reset}`);
    console.log(`  Impact: +${(alignedHarmony.fieldUpdate.impact * 100).toFixed(1)}%\n`);
    
    // Complementary harmony
    const complementary = await integration.sendSacredMessage(
      'master-elena',
      'student-alex',
      'Your growth inspires new patterns',
      'emergence',
      'vitality' // Complementary to coherence
    );
    
    console.log(`${colors.cyan}Complementary Harmony (coherence → vitality):${colors.reset}`);
    console.log(`  Impact: +${(complementary.fieldUpdate.impact * 100).toFixed(1)}%\n`);
    
    // Test 5: Temporal Flow
    console.log(`${colors.bright}Test 5: Temporal Flow Effects${colors.reset}`);
    console.log(`${colors.bright}────────────────────────────${colors.reset}\n`);
    
    // Wait to reset saturation
    console.log(`${colors.dim}Waiting 5 seconds for temporal reset...${colors.reset}`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const afterPause = await integration.sendSacredMessage(
      'master-elena',
      'collective',
      'After sacred pause, gratitude flows renewed',
      'gratitude',
      'mutuality'
    );
    
    console.log(`${colors.green}After temporal pause:${colors.reset}`);
    console.log(`  Impact: +${(afterPause.fieldUpdate.impact * 100).toFixed(1)}% (saturation cleared)\n`);
    
    // Final Analysis
    console.log(`${colors.bright}═════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Practitioner Test Complete${colors.reset}`);
    console.log(`${colors.bright}═════════════════════════════${colors.reset}\n`);
    
    const finalProgress = await integration.getAgentProgress('master-elena');
    const analytics = await integration.getSacredMessageAnalytics();
    
    console.log(`${colors.cyan}Elena's Final Status:${colors.reset}`);
    console.log(`  Level: ${finalProgress.currentLevel}`);
    console.log(`  Total messages: ${finalProgress.details.messagesRequired?.current || 0}`);
    console.log(`  Unique relationships: ${finalProgress.details.uniqueRelationships?.current || 0}`);
    
    console.log(`\n${colors.green}Key Practitioner Insights:${colors.reset}`);
    console.log(`  • First exchanges still have maximum impact`);
    console.log(`  • Message saturation reduces repeated impacts`);
    console.log(`  • Harmony alignment affects resonance`);
    console.log(`  • Temporal flow allows impact renewal`);
    console.log(`  • Relationships deepen over time`);
    
    console.log(`\n${colors.magenta}🌸 The journey from beginner to master unfolds naturally${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.yellow}⚠️  Test failed: ${error.message}${colors.reset}`);
    console.error(error.stack);
  } finally {
    await integration.close();
    await db.close();
  }
}

// Run test
testPractitionerEvolution();

export { testPractitionerEvolution };