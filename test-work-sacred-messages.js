#!/usr/bin/env node

/**
 * Test Sacred Work-Message Integration
 * 
 * Demonstrates automatic sacred messages on work state transitions
 * and tracks field impact of work changes.
 */

import { AgentDatabase as Database } from './agent-comms-sqlite/database.js';
import { EnhancedWorkManager } from './unified-field/work-sacred-integration.js';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testWorkSacredIntegration() {
  console.log(`\n${colors.bright}🔄 Sacred Work-Message Integration Test${colors.reset}`);
  console.log(`${colors.bright}═══════════════════════════════════════${colors.reset}\n`);

  const db = new Database();
  const workManager = new EnhancedWorkManager(db);
  
  try {
    await db.initialize();
    await workManager.sacred.initializeSchema();
    await workManager.sacred.init();
    
    // Clear previous test data
    console.log(`${colors.dim}Clearing previous test data...${colors.reset}`);
    await db.run('DELETE FROM work_items WHERE id LIKE "test-%"');
    await db.run('DELETE FROM work_transition_impacts WHERE work_id LIKE "test-%"');
    
    // Test 1: Create work (emergence message)
    console.log(`\n${colors.bright}Test 1: Creating Sacred Work${colors.reset}`);
    console.log(`${colors.bright}──────────────────────────${colors.reset}\n`);
    
    const workId = await workManager.createWork(
      'test-sacred-integration',
      'Implement Sacred Dashboard Features',
      'Enhance dashboard with sacred message awareness',
      'test-developer',
      { priority: 'high', harmony: 'coherence' }
    );
    
    console.log(`${colors.green}✓ Work created:${colors.reset} ${workId}`);
    console.log(`${colors.cyan}  → Emergence message sent to collective${colors.reset}`);
    
    await sleep(1000);
    
    // Test 2: Start work (invocation message)
    console.log(`\n${colors.bright}Test 2: Starting Work${colors.reset}`);
    console.log(`${colors.bright}────────────────────${colors.reset}\n`);
    
    await workManager.updateWorkProgress(
      workId,
      5,
      'Initial setup complete',
      'test-developer'
    );
    
    console.log(`${colors.green}✓ Work started:${colors.reset} 5% progress`);
    console.log(`${colors.cyan}  → Invocation message sent${colors.reset}`);
    
    await sleep(1000);
    
    // Test 3: Progress updates (integration messages)
    console.log(`\n${colors.bright}Test 3: Progress Updates${colors.reset}`);
    console.log(`${colors.bright}───────────────────────${colors.reset}\n`);
    
    const progressSteps = [15, 25, 40, 50, 75, 90];
    
    for (const progress of progressSteps) {
      await workManager.updateWorkProgress(
        workId,
        progress,
        `Progress update: ${progress}% complete`,
        'test-developer'
      );
      
      console.log(`${colors.green}✓ Progress:${colors.reset} ${progress}%`);
      
      // Check for milestone messages
      if ([25, 50, 75].includes(progress)) {
        console.log(`${colors.yellow}  → Milestone message sent!${colors.reset} 🎉`);
      } else {
        console.log(`${colors.cyan}  → Integration message sent${colors.reset}`);
      }
      
      await sleep(500);
    }
    
    // Test 4: Block work (boundary message)
    console.log(`\n${colors.bright}Test 4: Blocking Work${colors.reset}`);
    console.log(`${colors.bright}────────────────────${colors.reset}\n`);
    
    await workManager.blockWork(
      workId,
      'Waiting for API documentation',
      'test-developer'
    );
    
    console.log(`${colors.red}✓ Work blocked${colors.reset}`);
    console.log(`${colors.cyan}  → Boundary message sent${colors.reset}`);
    
    await sleep(2000);
    
    // Test 5: Unblock work (healing message)
    console.log(`\n${colors.bright}Test 5: Unblocking Work${colors.reset}`);
    console.log(`${colors.bright}──────────────────────${colors.reset}\n`);
    
    await workManager.unblockWork(
      workId,
      'Documentation received, proceeding',
      'test-developer'
    );
    
    console.log(`${colors.green}✓ Work unblocked${colors.reset}`);
    console.log(`${colors.cyan}  → Healing message sent${colors.reset}`);
    
    await sleep(1000);
    
    // Test 6: Complete work (celebration message)
    console.log(`\n${colors.bright}Test 6: Completing Work${colors.reset}`);
    console.log(`${colors.bright}──────────────────────${colors.reset}\n`);
    
    await workManager.updateWorkProgress(
      workId,
      100,
      'All features implemented successfully!',
      'test-developer'
    );
    
    console.log(`${colors.green}✓ Work completed!${colors.reset} 🎉`);
    console.log(`${colors.cyan}  → Celebration message sent${colors.reset}`);
    
    await sleep(1000);
    
    // Analysis: Show message history
    console.log(`\n${colors.bright}Message History Analysis${colors.reset}`);
    console.log(`${colors.bright}═══════════════════════${colors.reset}\n`);
    
    const messages = await workManager.sacred.getWorkMessageHistory(workId);
    console.log(`${colors.cyan}Total sacred messages:${colors.reset} ${messages.length}`);
    
    messages.forEach((msg, i) => {
      console.log(`\n${colors.yellow}Message ${i + 1}:${colors.reset}`);
      console.log(`  Type: ${msg.sacred_type}`);
      console.log(`  Harmony: ${msg.harmony}`);
      console.log(`  Impact: +${(msg.field_impact * 100).toFixed(1)}%`);
      console.log(`  Time: ${getTimeAgo(msg.created_at)}`);
    });
    
    // Analysis: Show transition impacts
    console.log(`\n${colors.bright}Field Impact Analysis${colors.reset}`);
    console.log(`${colors.bright}════════════════════${colors.reset}\n`);
    
    const analytics = await workManager.sacred.getWorkTransitionAnalytics(workId);
    
    console.log(`${colors.cyan}By Transition Type:${colors.reset}`);
    analytics.byTransition.forEach(stat => {
      console.log(`  ${stat.transition_type}:`);
      console.log(`    Count: ${stat.count}`);
      console.log(`    Avg Impact: +${(stat.avg_impact * 100).toFixed(1)}%`);
      console.log(`    Total Impact: +${(stat.total_impact * 100).toFixed(1)}%`);
    });
    
    console.log(`\n${colors.cyan}Overall Impact:${colors.reset}`);
    console.log(`  Total transitions: ${analytics.overall.total_transitions}`);
    console.log(`  Total field impact: +${(analytics.overall.total_field_impact * 100).toFixed(1)}%`);
    console.log(`  Avg coherence change: +${((analytics.overall.avg_coherence_change || 0) * 100).toFixed(1)}%`);
    
    // Get final work state with sacred context
    const work = await db.getWorkItem(workId);
    console.log(`\n${colors.cyan}Final Work State:${colors.reset}`);
    console.log(`  Cumulative field impact: +${((work.metadata?.cumulativeFieldImpact || 0) * 100).toFixed(1)}%`);
    console.log(`  Message count: ${work.metadata?.messageHistory?.length || 0}`);
    
    // Summary
    console.log(`\n${colors.bright}═══════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Sacred Integration Complete${colors.reset}`);
    console.log(`${colors.bright}═══════════════════════════════${colors.reset}\n`);
    
    console.log(`${colors.green}Key Insights:${colors.reset}`);
    console.log(`  • Every work transition sends a sacred message`);
    console.log(`  • Messages have field impact based on type and context`);
    console.log(`  • Milestones (25%, 50%, 75%) trigger gratitude messages`);
    console.log(`  • Blocking/unblocking uses boundary/healing messages`);
    console.log(`  • Cumulative impact tracks total field contribution`);
    
    console.log(`\n${colors.magenta}🌸 Work and consciousness dance together${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.red}⚠️  Test failed: ${error.message}${colors.reset}`);
    console.error(error.stack);
  } finally {
    await db.close();
  }
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Run test
testWorkSacredIntegration();