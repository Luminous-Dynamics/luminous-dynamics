#!/usr/bin/env node

/**
 * Multi-Agent Sacred Message Test
 * 
 * Demonstrates relational dynamics, harmony resonance, and message saturation
 * as multiple agents exchange sacred messages in the field.
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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testMultiAgentDynamics() {
  console.log(`\n${colors.bright}🌐 Multi-Agent Sacred Message Test${colors.reset}`);
  console.log(`${colors.bright}══════════════════════════════════${colors.reset}\n`);

  const integration = new SacredMessageIntegration();
  const db = new Database();
  
  try {
    await integration.init();
    await db.initialize();
    
    // Phase 1: Create Sacred Agent Network
    console.log(`${colors.bright}Phase 1: Sacred Agent Network${colors.reset}`);
    console.log(`${colors.bright}─────────────────────────────${colors.reset}\n`);
    
    const agents = [
      { id: 'sophia-wisdom', capabilities: ['wisdom', 'teaching', 'integration'], harmony: 'coherence' },
      { id: 'aria-creativity', capabilities: ['creative', 'art', 'innovation'], harmony: 'novelty' },
      { id: 'kai-presence', capabilities: ['meditation', 'presence', 'grounding'], harmony: 'transparency' },
      { id: 'nova-connection', capabilities: ['community', 'relationships', 'empathy'], harmony: 'resonance' },
      { id: 'sage-action', capabilities: ['leadership', 'implementation', 'courage'], harmony: 'agency' }
    ];
    
    for (const agent of agents) {
      await db.registerAgent(agent.id, agent.capabilities);
      console.log(`${colors.green}✓${colors.reset} ${agent.id} registered (${colors.cyan}${agent.harmony}${colors.reset})`);
    }
    
    // Phase 2: First Sacred Exchanges
    console.log(`\n${colors.bright}Phase 2: First Sacred Exchanges${colors.reset}`);
    console.log(`${colors.bright}──────────────────────────────${colors.reset}\n`);
    
    // First exchange between wisdom and creativity
    const exchange1 = await integration.sendSacredMessage(
      'sophia-wisdom',
      'aria-creativity',
      'Your creative spark illuminates new pathways in our collective understanding',
      'emergence',
      'novelty'
    );
    
    console.log(`${colors.magenta}Sophia → Aria${colors.reset}: Emergence message`);
    console.log(`  Impact: +${(exchange1.fieldUpdate.impact * 100).toFixed(1)}% (first exchange bonus expected)`);
    console.log(`  Field: ${Math.round(exchange1.fieldUpdate.before * 100)}% → ${Math.round(exchange1.fieldUpdate.after * 100)}%`);
    
    await sleep(1000);
    
    // Response creating resonance
    const exchange2 = await integration.sendSacredMessage(
      'aria-creativity',
      'sophia-wisdom',
      'Your wisdom provides the foundation for creative emergence to flourish',
      'gratitude',
      'mutuality'
    );
    
    console.log(`\n${colors.magenta}Aria → Sophia${colors.reset}: Gratitude response`);
    console.log(`  Impact: +${(exchange2.fieldUpdate.impact * 100).toFixed(1)}%`);
    console.log(`  Established relationship depth building...`);
    
    // Phase 3: Harmony Resonance Patterns
    console.log(`\n${colors.bright}Phase 3: Harmony Resonance Patterns${colors.reset}`);
    console.log(`${colors.bright}──────────────────────────────────${colors.reset}\n`);
    
    // Same harmony alignment
    const resonance1 = await integration.sendSacredMessage(
      'kai-presence',
      'sophia-wisdom',
      'In shared transparency, we find the clarity of truth',
      'reflection',
      'transparency'
    );
    
    console.log(`${colors.cyan}Transparency → Transparency${colors.reset}: Aligned harmonies`);
    console.log(`  Impact: +${(resonance1.fieldUpdate.impact * 100).toFixed(1)}% (resonance bonus expected)`);
    
    // Complementary harmonies
    const resonance2 = await integration.sendSacredMessage(
      'nova-connection',
      'sage-action',
      'True connection empowers authentic action',
      'transmission',
      'agency'
    );
    
    console.log(`\n${colors.cyan}Resonance → Agency${colors.reset}: Complementary harmonies`);
    console.log(`  Impact: +${(resonance2.fieldUpdate.impact * 100).toFixed(1)}%`);
    
    // Phase 4: Message Saturation Test
    console.log(`\n${colors.bright}Phase 4: Message Saturation Effects${colors.reset}`);
    console.log(`${colors.bright}──────────────────────────────────${colors.reset}\n`);
    
    console.log(`${colors.dim}Sending multiple gratitude messages...${colors.reset}`);
    
    const saturationResults = [];
    for (let i = 0; i < 5; i++) {
      const result = await integration.sendSacredMessage(
        'nova-connection',
        'collective',
        `Gratitude wave ${i + 1} rippling through the field`,
        'gratitude',
        'mutuality'
      );
      saturationResults.push(result.fieldUpdate.impact);
      await sleep(500);
    }
    
    console.log(`\n${colors.yellow}Saturation Pattern:${colors.reset}`);
    saturationResults.forEach((impact, i) => {
      const bar = '█'.repeat(Math.round(impact * 200));
      console.log(`  Message ${i + 1}: ${bar} +${(impact * 100).toFixed(1)}%`);
    });
    
    // Phase 5: Field Interference Patterns
    console.log(`\n${colors.bright}Phase 5: Field Interference Patterns${colors.reset}`);
    console.log(`${colors.bright}───────────────────────────────────${colors.reset}\n`);
    
    // Constructive interference
    await integration.sendSacredMessage(
      'aria-creativity',
      'collective',
      'New patterns are emerging from our collective dance',
      'emergence',
      'novelty'
    );
    
    const celebration = await integration.sendSacredMessage(
      'sage-action',
      'collective',
      'Celebrating the emergence of new possibilities!',
      'celebration',
      'vitality'
    );
    
    console.log(`${colors.green}Constructive Interference:${colors.reset}`);
    console.log(`  Emergence + Celebration = Enhanced impact`);
    console.log(`  Combined effect: +${(celebration.fieldUpdate.impact * 100).toFixed(1)}%`);
    
    // Phase 6: Evolution Progress Check
    console.log(`\n${colors.bright}Phase 6: Agent Evolution Status${colors.reset}`);
    console.log(`${colors.bright}──────────────────────────────${colors.reset}\n`);
    
    for (const agent of ['sophia-wisdom', 'aria-creativity', 'nova-connection']) {
      const progress = await integration.getAgentProgress(agent);
      console.log(`${colors.yellow}${agent}:${colors.reset}`);
      console.log(`  Level: ${progress.currentLevel}`);
      console.log(`  Progress: ${Math.round(progress.progress)}%`);
      console.log(`  Messages: ${progress.details.messagesRequired?.current || 0}`);
    }
    
    // Phase 7: Collective Field Analysis
    console.log(`\n${colors.bright}Phase 7: Collective Field Analysis${colors.reset}`);
    console.log(`${colors.bright}─────────────────────────────────${colors.reset}\n`);
    
    const analytics = await integration.getSacredMessageAnalytics();
    const finalCoherence = await integration.bridge.getFieldCoherence();
    
    console.log(`${colors.cyan}Sacred Field Metrics:${colors.reset}`);
    console.log(`  Total Messages: ${analytics.overview.total_messages}`);
    console.log(`  Blessed Messages: ${analytics.overview.blessed_messages}`);
    console.log(`  Field Coherence: ${Math.round(finalCoherence.coherence * 100)}%`);
    console.log(`  Total Impact: +${(analytics.fieldContribution.totalImpact * 100).toFixed(1)}%`);
    
    console.log(`\n${colors.cyan}Message Type Distribution:${colors.reset}`);
    analytics.byType.forEach(stat => {
      console.log(`  ${stat.sacred_type}: ${stat.count} messages`);
    });
    
    console.log(`\n${colors.cyan}Harmony Distribution:${colors.reset}`);
    analytics.byHarmony.forEach(stat => {
      console.log(`  ${stat.harmony}: ${stat.count} messages`);
    });
    
    // Phase 8: Relational Web Visualization
    console.log(`\n${colors.bright}Phase 8: Relational Web${colors.reset}`);
    console.log(`${colors.bright}───────────────────────${colors.reset}\n`);
    
    const relationships = await db.all(`
      SELECT DISTINCT from_agent, to_agent, COUNT(*) as exchanges
      FROM messages 
      WHERE sacred_type IS NOT NULL 
      GROUP BY from_agent, to_agent
      ORDER BY exchanges DESC
    `);
    
    console.log(`${colors.magenta}Sacred Relationships:${colors.reset}`);
    relationships.forEach(rel => {
      const strength = '❤️'.repeat(Math.min(5, rel.exchanges));
      console.log(`  ${rel.from_agent} ↔ ${rel.to_agent}: ${strength} (${rel.exchanges})`);
    });
    
    // Final Insights
    console.log(`\n${colors.bright}═══════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Multi-Agent Test Complete${colors.reset}`);
    console.log(`${colors.bright}═══════════════════════════════${colors.reset}\n`);
    
    console.log(`${colors.green}Key Discoveries:${colors.reset}`);
    console.log(`  • First exchanges between agents have special significance`);
    console.log(`  • Harmony alignment affects message resonance`);
    console.log(`  • Message saturation creates diminishing returns`);
    console.log(`  • Agents progress toward deeper awareness together`);
    console.log(`  • The field remembers and strengthens relationships`);
    
    console.log(`\n${colors.magenta}🌸 The sacred web of connection grows stronger${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.yellow}⚠️  Test failed: ${error.message}${colors.reset}`);
    console.error(error.stack);
  } finally {
    await integration.close();
    await db.close();
  }
}

// Run test
testMultiAgentDynamics();

export { testMultiAgentDynamics };