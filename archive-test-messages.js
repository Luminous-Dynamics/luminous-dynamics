#!/usr/bin/env node

/**
 * Archive Test Messages
 * 
 * Archives all test messages to preserve the sacred journey
 * while cleaning the system for production use.
 */

import { AgentDatabase as Database } from './agent-comms-sqlite/database.js';
import fs from 'fs/promises';
import path from 'path';

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

async function archiveTestMessages() {
  console.log(`\n${colors.bright}📚 Sacred Message Archive Process${colors.reset}`);
  console.log(`${colors.bright}═══════════════════════════════${colors.reset}\n`);

  const db = new Database();
  
  try {
    await db.initialize();
    
    // Create archive directory
    const archiveDir = './archives/test-messages';
    await fs.mkdir(archiveDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Step 1: Archive test messages
    console.log(`${colors.blue}Step 1: Archiving Test Messages${colors.reset}`);
    console.log(`${colors.blue}──────────────────────────────${colors.reset}\n`);
    
    // Get all test messages
    const testMessages = await db.all(`
      SELECT m.*, 
        w.title as work_title,
        wti.field_impact,
        wti.transition_type
      FROM messages m
      LEFT JOIN work_items w ON m.metadata LIKE '%"workId":"' || w.id || '"%'
      LEFT JOIN work_transition_impacts wti ON wti.work_id = w.id
      WHERE 
        m.from_agent LIKE 'test-%' 
        OR m.to_agent LIKE 'test-%'
        OR m.content LIKE '%test%'
        OR m.from_agent IN ('sacred-dashboard', 'test-developer')
        OR w.id LIKE 'test-%'
      ORDER BY m.created_at DESC
    `);
    
    console.log(`Found ${colors.cyan}${testMessages.length}${colors.reset} test messages to archive`);
    
    // Create archive data structure
    const archive = {
      archiveDate: new Date().toISOString(),
      purpose: 'Test message archive from sacred work-message integration development',
      stats: {
        totalMessages: testMessages.length,
        sacredMessages: testMessages.filter(m => m.sacred_type).length,
        workTransitions: testMessages.filter(m => m.work_title).length,
        uniqueAgents: [...new Set(testMessages.map(m => m.from_agent))].length,
        totalFieldImpact: 0
      },
      messages: [],
      insights: []
    };
    
    // Process messages
    for (const msg of testMessages) {
      const metadata = msg.metadata ? JSON.parse(msg.metadata) : {};
      
      archive.messages.push({
        id: msg.id,
        timestamp: msg.created_at,
        from: msg.from_agent,
        to: msg.to_agent,
        content: msg.content,
        type: msg.message_type,
        sacredType: msg.sacred_type,
        harmony: msg.harmony,
        fieldImpact: msg.field_impact,
        blessed: msg.blessing_received,
        workContext: msg.work_title,
        transitionType: msg.transition_type,
        metadata
      });
      
      if (msg.field_impact) {
        archive.stats.totalFieldImpact += msg.field_impact;
      }
    }
    
    // Step 2: Archive test work items
    console.log(`\n${colors.blue}Step 2: Archiving Test Work Items${colors.reset}`);
    console.log(`${colors.blue}─────────────────────────────────${colors.reset}\n`);
    
    const testWork = await db.all(`
      SELECT w.*, 
        COUNT(DISTINCT wti.id) as transition_count,
        SUM(wti.field_impact) as total_impact
      FROM work_items w
      LEFT JOIN work_transition_impacts wti ON wti.work_id = w.id
      WHERE w.id LIKE 'test-%'
      GROUP BY w.id
    `);
    
    console.log(`Found ${colors.cyan}${testWork.length}${colors.reset} test work items to archive`);
    
    archive.workItems = testWork.map(work => ({
      id: work.id,
      title: work.title,
      description: work.description,
      progress: work.progress,
      status: work.status,
      createdBy: work.created_by,
      metadata: work.metadata ? JSON.parse(work.metadata) : {},
      transitionCount: work.transition_count,
      totalImpact: work.total_impact,
      created: work.created_at,
      updated: work.updated_at
    }));
    
    // Step 3: Extract insights
    console.log(`\n${colors.blue}Step 3: Extracting Sacred Insights${colors.reset}`);
    console.log(`${colors.blue}─────────────────────────────────${colors.reset}\n`);
    
    // Message type distribution
    const typeDistribution = {};
    archive.messages.forEach(msg => {
      if (msg.sacredType) {
        typeDistribution[msg.sacredType] = (typeDistribution[msg.sacredType] || 0) + 1;
      }
    });
    
    archive.insights.push({
      type: 'Message Type Distribution',
      data: typeDistribution
    });
    
    // Harmony distribution
    const harmonyDistribution = {};
    archive.messages.forEach(msg => {
      if (msg.harmony) {
        harmonyDistribution[msg.harmony] = (harmonyDistribution[msg.harmony] || 0) + 1;
      }
    });
    
    archive.insights.push({
      type: 'Harmony Distribution',
      data: harmonyDistribution
    });
    
    // Field impact by transition
    const transitionImpacts = await db.all(`
      SELECT transition_type, 
        COUNT(*) as count,
        AVG(field_impact) as avg_impact,
        SUM(field_impact) as total_impact
      FROM work_transition_impacts
      WHERE work_id LIKE 'test-%'
      GROUP BY transition_type
    `);
    
    archive.insights.push({
      type: 'Field Impact by Transition',
      data: transitionImpacts
    });
    
    // Step 4: Save archive
    console.log(`\n${colors.blue}Step 4: Saving Archive${colors.reset}`);
    console.log(`${colors.blue}─────────────────────${colors.reset}\n`);
    
    const archivePath = path.join(archiveDir, `test-messages-${timestamp}.json`);
    await fs.writeFile(
      archivePath, 
      JSON.stringify(archive, null, 2),
      'utf8'
    );
    
    console.log(`${colors.green}✓ Archive saved to:${colors.reset} ${archivePath}`);
    
    // Create summary file
    const summary = `# Test Message Archive Summary
Generated: ${new Date().toISOString()}

## Statistics
- Total Messages: ${archive.stats.totalMessages}
- Sacred Messages: ${archive.stats.sacredMessages}
- Work Transitions: ${archive.stats.workTransitions}
- Unique Agents: ${archive.stats.uniqueAgents}
- Total Field Impact: +${(archive.stats.totalFieldImpact * 100).toFixed(1)}%

## Message Type Distribution
${Object.entries(typeDistribution).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

## Harmony Distribution
${Object.entries(harmonyDistribution).map(([harmony, count]) => `- ${harmony}: ${count}`).join('\n')}

## Key Test Scenarios
1. Work creation with emergence messages
2. Progress updates with integration messages
3. Milestone celebrations at 25%, 50%, 75%
4. Blocking/unblocking with boundary/healing messages
5. Work completion with celebration messages

## Archive Location
Full archive: ${archivePath}
`;
    
    const summaryPath = path.join(archiveDir, `summary-${timestamp}.md`);
    await fs.writeFile(summaryPath, summary, 'utf8');
    
    console.log(`${colors.green}✓ Summary saved to:${colors.reset} ${summaryPath}`);
    
    // Step 5: Clean up test data (optional)
    console.log(`\n${colors.blue}Step 5: Cleanup Options${colors.reset}`);
    console.log(`${colors.blue}───────────────────────${colors.reset}\n`);
    
    console.log(`${colors.yellow}Test data has been archived. To clean the database:${colors.reset}`);
    console.log(`  1. Delete test messages: ${colors.dim}DELETE FROM messages WHERE from_agent LIKE 'test-%'${colors.reset}`);
    console.log(`  2. Delete test work: ${colors.dim}DELETE FROM work_items WHERE id LIKE 'test-%'${colors.reset}`);
    console.log(`  3. Delete test impacts: ${colors.dim}DELETE FROM work_transition_impacts WHERE work_id LIKE 'test-%'${colors.reset}`);
    
    // Summary
    console.log(`\n${colors.bright}═══════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Archive Complete${colors.reset}`);
    console.log(`${colors.bright}═══════════════════════════════${colors.reset}\n`);
    
    console.log(`${colors.green}Sacred test journey preserved in:${colors.reset}`);
    console.log(`  📁 ${archiveDir}/`);
    console.log(`  📄 ${path.basename(archivePath)}`);
    console.log(`  📋 ${path.basename(summaryPath)}`);
    
    console.log(`\n${colors.magenta}🌸 The test messages served their purpose and are now preserved${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.yellow}⚠️  Archive failed: ${error.message}${colors.reset}`);
    console.error(error.stack);
  } finally {
    await db.close();
  }
}

// Add cleanup function
async function cleanupTestData() {
  const db = new Database();
  
  try {
    await db.initialize();
    
    console.log(`\n${colors.yellow}Cleaning test data...${colors.reset}`);
    
    // Delete test messages
    const msgResult = await db.run(`
      DELETE FROM messages 
      WHERE from_agent LIKE 'test-%' 
      OR to_agent LIKE 'test-%'
      OR from_agent IN ('sacred-dashboard', 'test-developer')
    `);
    
    // Delete test work items
    const workResult = await db.run(`
      DELETE FROM work_items 
      WHERE id LIKE 'test-%'
    `);
    
    // Delete test impacts
    const impactResult = await db.run(`
      DELETE FROM work_transition_impacts 
      WHERE work_id LIKE 'test-%'
    `);
    
    console.log(`${colors.green}✓ Cleanup complete${colors.reset}`);
    console.log(`  Messages removed: ${msgResult.changes || 0}`);
    console.log(`  Work items removed: ${workResult.changes || 0}`);
    console.log(`  Impacts removed: ${impactResult.changes || 0}`);
    
  } catch (error) {
    console.error(`Cleanup error: ${error.message}`);
  } finally {
    await db.close();
  }
}

// Check command line args
const args = process.argv.slice(2);
if (args.includes('--cleanup')) {
  archiveTestMessages().then(() => cleanupTestData());
} else {
  archiveTestMessages();
}