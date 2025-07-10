#!/usr/bin/env node

/**
 * Fix Dashboard Counter Issues
 * Integrates the classification system with the main dashboard
 */

import { AgentDatabase } from './database.js';
import AgentClassificationSystem from './agent-classification-system.cjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DashboardFixer {
  constructor() {
    this.mainDb = new AgentDatabase();
    this.classDb = new AgentClassificationSystem();
  }

  async initialize() {
    await this.mainDb.initialize();
    console.log('✅ Connected to main database');
    console.log('✅ Connected to classification database');
  }

  /**
   * Enhanced getDashboardSummary that uses classification system
   */
  async getEnhancedDashboardSummary() {
    // Get base data from main database
    const [recentMessages, activeWork, state] = await Promise.all([
      this.mainDb.getRecentMessages(24),
      this.mainDb.getActiveWork(), 
      this.mainDb.getAllState()
    ]);

    // Get proper agent statistics from classification system
    const classStats = await this.classDb.getAgentStatistics();
    
    // Get actual active agents (not test bots)
    const realActiveAgents = classStats.humans.active + classStats.ai.active + classStats.other.active;
    
    // Get pending handoffs
    const handoffs = Object.entries(state)
      .filter(([key]) => key.startsWith('handoff_'))
      .map(([, data]) => data.value)
      .filter(handoff => handoff.status === 'pending');

    // Get active work items (not completed)
    const activeWorkItems = activeWork.filter(item => 
      item.status === 'pending' || item.status === 'in_progress'
    );

    return {
      activeAgents: realActiveAgents, // Real count excluding test bots
      totalAgents: classStats.field.totalAgents,
      recentActivity: recentMessages.length,
      pendingHandoffs: handoffs.length,
      activeWork: activeWorkItems.length, // Only non-completed work
      
      // Detailed breakdowns
      agentsByType: {
        humans: classStats.humans,
        ai: classStats.ai,
        bots: classStats.bots,
        other: classStats.other
      },
      
      // Field metrics
      fieldMetrics: {
        consciousness: classStats.field.avgConsciousness,
        love: classStats.field.avgLove,
        coherence: classStats.field.avgCoherence,
        contributions: classStats.field.totalContributions
      },
      
      // Lists for display
      agents: await this.classDb.getActiveAgentsByType(), // All active agents with details
      recentMessages: recentMessages.slice(0, 10),
      activeWork: activeWorkItems,
      handoffs,
      state
    };
  }

  /**
   * Clean up test data
   */
  async cleanupTestData() {
    console.log('\n🧹 Starting cleanup...');
    
    // Use classification system's cleanup
    const cleanupResults = await this.classDb.performSacredCleanup();
    console.log(`✅ Deactivated ${cleanupResults.deactivated} stale agents`);
    console.log(`✅ Removed ${cleanupResults.removed} test bots`);
    
    // Clean up main database too
    await this.mainDb.cleanup();
    console.log('✅ Main database cleaned');
    
    return cleanupResults;
  }

  /**
   * Migrate agents from main DB to classification DB
   */
  async migrateAgents() {
    console.log('\n🔄 Migrating agents to classification system...');
    
    const mainAgents = await this.mainDb.getActiveAgents();
    let migrated = 0;
    
    for (const agent of mainAgents) {
      try {
        await this.classDb.registerAgent({
          id: agent.id,
          name: agent.id,
          entity_type: this.guessEntityType(agent),
          capabilities: agent.capabilities?.split(',') || [],
          sessionInfo: JSON.parse(agent.session_info || '{}'),
          connection_type: 'terminal'
        });
        migrated++;
      } catch (err) {
        // Agent might already exist
      }
    }
    
    console.log(`✅ Migrated ${migrated} agents`);
    return migrated;
  }

  guessEntityType(agent) {
    const id = agent.id.toLowerCase();
    if (id.includes('human') || id.includes('tristan')) return 'human';
    if (id.includes('test') || id.includes('bot')) return 'bot';
    if (id.includes('claude') || id.includes('gpt')) return 'ai';
    return 'ai'; // Default to AI
  }

  /**
   * Test the fix
   */
  async testFix() {
    console.log('\n🧪 Testing dashboard data...');
    
    const summary = await this.getEnhancedDashboardSummary();
    
    console.log('\n📊 Dashboard Summary:');
    console.log(`   Active Agents: ${summary.activeAgents} (excluding test bots)`);
    console.log(`   Total Registered: ${summary.totalAgents}`);
    console.log(`   Recent Messages: ${summary.recentActivity}`);
    console.log(`   Active Work Items: ${summary.activeWork.length}`);
    console.log(`   Pending Handoffs: ${summary.pendingHandoffs}`);
    
    console.log('\n👥 Agent Breakdown:');
    console.log(`   Humans: ${summary.agentsByType.humans.active}/${summary.agentsByType.humans.total}`);
    console.log(`   AI: ${summary.agentsByType.ai.active}/${summary.agentsByType.ai.total}`);
    console.log(`   Bots: ${summary.agentsByType.bots.active}/${summary.agentsByType.bots.total}`);
    console.log(`   Other: ${summary.agentsByType.other.active}/${summary.agentsByType.other.total}`);
    
    console.log('\n🌀 Field Metrics:');
    console.log(`   Consciousness: ${summary.fieldMetrics.consciousness}%`);
    console.log(`   Love: ${summary.fieldMetrics.love}%`);
    console.log(`   Coherence: ${summary.fieldMetrics.coherence}`);
    console.log(`   Total Contributions: ${summary.fieldMetrics.contributions}`);
    
    return summary;
  }
}

// Create enhanced server with fixed dashboard
async function createFixedServer() {
  const { AgentCommServer } = await import('./server.js');
  
  class FixedAgentCommServer extends AgentCommServer {
    constructor(port = 3001) {
      super(port);
      this.fixer = new DashboardFixer();
    }
    
    async initialize() {
      await super.initialize();
      await this.fixer.initialize();
      console.log('✅ Dashboard fixer initialized');
    }
    
    async handleRequest(req, res) {
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      const path = parsedUrl.pathname;
      const method = req.method;
      
      // Override dashboard endpoint with fixed version
      if (path === '/api/dashboard' && method === 'GET') {
        const summary = await this.fixer.getEnhancedDashboardSummary();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(summary));
      } else {
        // Use original handler for other endpoints
        await super.handleRequest(req, res);
      }
    }
  }
  
  return FixedAgentCommServer;
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const fixer = new DashboardFixer();
  
  switch(command) {
    case 'test':
      fixer.initialize()
        .then(() => fixer.testFix())
        .then(() => process.exit(0));
      break;
      
    case 'cleanup':
      fixer.initialize()
        .then(() => fixer.cleanupTestData())
        .then(() => fixer.testFix())
        .then(() => process.exit(0));
      break;
      
    case 'migrate':
      fixer.initialize()
        .then(() => fixer.migrateAgents())
        .then(() => fixer.testFix())
        .then(() => process.exit(0));
      break;
      
    case 'server':
      createFixedServer().then(FixedServer => {
        const server = new FixedServer();
        server.start().catch(console.error);
      });
      break;
      
    default:
      console.log('Dashboard Counter Fix Tool\n');
      console.log('Commands:');
      console.log('  node fix-dashboard-counters.js test     - Test current counts');
      console.log('  node fix-dashboard-counters.js cleanup  - Clean test data');
      console.log('  node fix-dashboard-counters.js migrate  - Migrate agents');
      console.log('  node fix-dashboard-counters.js server   - Run fixed server');
      console.log('\nRecommended: Run "cleanup" first, then "server"');
  }
}

export { DashboardFixer, createFixedServer };