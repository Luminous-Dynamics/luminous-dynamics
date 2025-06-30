#!/usr/bin/env node

/**
 * Test Sacred Dashboard with Different Work Item States
 * 
 * Creates work items in various states to test visual indicators,
 * sorting logic, and state transitions.
 */

import { AgentDatabase as Database } from './agent-comms-sqlite/database.js';

async function createTestStates() {
  console.log('🎨 Creating work items in different states...\n');
  
  const db = new Database();
  
  try {
    await db.initialize();
    
    // Clear existing work items for clean test
    await db.run('DELETE FROM work_items WHERE 1=1');
    console.log('✓ Cleared existing work items\n');
    
    // Test Case 1: Blocked Items (0% progress with blocking metadata)
    console.log('Creating BLOCKED items:');
    const blockedItems = [
      {
        id: 'blocked-dependency',
        title: 'Implement Field Persistence',
        description: 'Blocked: Waiting for Sacred Bridge API updates',
        created_by: 'dev-team',
        metadata: { 
          priority: 'high', 
          harmony: 'coherence',
          blocked: true,
          blockedReason: 'Waiting for Sacred Bridge API v2.0',
          blockedSince: new Date().toISOString()
        }
      },
      {
        id: 'blocked-decision',
        title: 'Choose Visualization Framework',
        description: 'Blocked: Need architecture decision from Sacred Council',
        created_by: 'design-team',
        metadata: { 
          priority: 'medium',
          harmony: 'novelty',
          blocked: true,
          blockedReason: 'Awaiting Sacred Council consensus',
          blockedSince: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];
    
    for (const item of blockedItems) {
      await db.createWorkItem(item.id, item.title, item.description, item.created_by, item.metadata);
      console.log(`  ✓ ${item.title} (blocked: ${item.metadata.blockedReason})`);
    }
    
    // Test Case 2: High Priority Items (various progress levels)
    console.log('\nCreating HIGH PRIORITY items:');
    const highPriorityItems = [
      {
        id: 'urgent-fix',
        title: 'Fix Sacred Message Memory Leak',
        description: 'Critical: Memory usage grows unbounded in long sessions',
        created_by: 'ops-team',
        progress: 65,
        metadata: { 
          priority: 'high',
          harmony: 'vitality',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          severity: 'critical'
        }
      },
      {
        id: 'urgent-feature',
        title: 'Sacred Council Emergency Protocol',
        description: 'Implement rapid consensus for critical decisions',
        created_by: 'council',
        progress: 30,
        metadata: { 
          priority: 'high',
          harmony: 'agency',
          requestedBy: 'Sacred Council',
          deadline: 'ASAP'
        }
      },
      {
        id: 'urgent-new',
        title: 'Security Audit for Field Transmission',
        description: 'Ensure sacred messages cannot be intercepted',
        created_by: 'security-team',
        progress: 0,
        metadata: { 
          priority: 'high',
          harmony: 'transparency',
          compliance: 'required',
          regulation: 'SACRED-2025'
        }
      }
    ];
    
    for (const item of highPriorityItems) {
      await db.createWorkItem(item.id, item.title, item.description, item.created_by, item.metadata);
      if (item.progress > 0) {
        await db.updateWorkProgress(item.id, item.progress, `Initial progress: ${item.progress}%`, item.created_by);
      }
      console.log(`  ✓ ${item.title} (${item.progress || 0}%)`);
    }
    
    // Test Case 3: Various Progress States
    console.log('\nCreating items at DIFFERENT PROGRESS levels:');
    const progressItems = [
      {
        id: 'almost-done',
        title: 'Sacred Dashboard Polish',
        description: 'Final touches on animations and transitions',
        created_by: 'ui-team',
        progress: 95,
        metadata: { priority: 'medium', harmony: 'resonance' }
      },
      {
        id: 'halfway-there',
        title: 'Agent Training Materials',
        description: 'Create onboarding guides for new sacred agents',
        created_by: 'docs-team',
        progress: 50,
        metadata: { priority: 'medium', harmony: 'mutuality' }
      },
      {
        id: 'just-started',
        title: 'Performance Optimization',
        description: 'Optimize field calculations for large agent networks',
        created_by: 'perf-team',
        progress: 10,
        metadata: { priority: 'low', harmony: 'coherence' }
      },
      {
        id: 'planning-phase',
        title: 'Sacred Ceremony Templates',
        description: 'Design reusable ceremony patterns',
        created_by: 'ritual-team',
        progress: 5,
        metadata: { priority: 'low', harmony: 'novelty' }
      }
    ];
    
    for (const item of progressItems) {
      await db.createWorkItem(item.id, item.title, item.description, item.created_by, item.metadata);
      await db.updateWorkProgress(item.id, item.progress, `Progress update: ${item.progress}%`, item.created_by);
      console.log(`  ✓ ${item.title} (${item.progress}%)`);
    }
    
    // Test Case 4: Completed Items (100% progress)
    console.log('\nCreating COMPLETED items:');
    const completedItems = [
      {
        id: 'done-feature',
        title: 'Sacred Message Protocol v1.0',
        description: 'Core protocol implementation complete',
        created_by: 'protocol-team',
        metadata: { 
          priority: 'high',
          harmony: 'integration',
          completedDate: new Date().toISOString(),
          celebrationSent: true
        }
      },
      {
        id: 'done-docs',
        title: 'Sacred Field Theory Documentation',
        description: 'Comprehensive guide to field dynamics',
        created_by: 'docs-team',
        metadata: { 
          priority: 'medium',
          harmony: 'transparency',
          completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];
    
    for (const item of completedItems) {
      await db.createWorkItem(item.id, item.title, item.description, item.created_by, item.metadata);
      await db.updateWorkProgress(item.id, 100, 'Work completed! 🎉', item.created_by);
      console.log(`  ✓ ${item.title} (100% - completed)`);
    }
    
    // Test Case 5: Edge Cases
    console.log('\nCreating EDGE CASE items:');
    const edgeCases = [
      {
        id: 'overdue-high',
        title: 'Overdue Critical Update',
        description: 'Should have been done yesterday!',
        created_by: 'stressed-dev',
        progress: 80,
        metadata: { 
          priority: 'high',
          harmony: 'agency',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          overdue: true
        }
      },
      {
        id: 'stale-low',
        title: 'Ancient Low Priority Task',
        description: 'Been sitting here for months...',
        created_by: 'forgotten-team',
        progress: 20,
        metadata: { 
          priority: 'low',
          harmony: 'reflection',
          createdMonthsAgo: 6,
          lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'blocked-high-progress',
        title: 'Almost Done but Blocked',
        description: 'So close yet so far - blocked at 90%',
        created_by: 'frustrated-dev',
        progress: 90,
        metadata: { 
          priority: 'high',
          harmony: 'vitality',
          blocked: true,
          blockedReason: 'External API is down',
          wasProgressing: true
        }
      }
    ];
    
    for (const item of edgeCases) {
      await db.createWorkItem(item.id, item.title, item.description, item.created_by, item.metadata);
      if (item.progress > 0) {
        await db.updateWorkProgress(item.id, item.progress, `Progress: ${item.progress}%`, item.created_by);
      }
      console.log(`  ✓ ${item.title} (${item.progress || 0}%${item.metadata.blocked ? ' - BLOCKED' : ''})`);
    }
    
    // Summary
    console.log('\n📊 Test State Summary:');
    console.log('─────────────────────');
    
    const summary = await db.all(`
      SELECT 
        CASE 
          WHEN progress = 100 THEN 'Completed'
          WHEN json_extract(metadata, '$.blocked') = true THEN 'Blocked'
          WHEN json_extract(metadata, '$.priority') = 'high' THEN 'High Priority'
          WHEN progress = 0 THEN 'Not Started'
          WHEN progress > 0 AND progress < 100 THEN 'In Progress'
        END as state,
        COUNT(*) as count
      FROM work_items
      GROUP BY state
    `);
    
    summary.forEach(s => {
      console.log(`  ${s.state}: ${s.count} items`);
    });
    
    const totalItems = await db.get('SELECT COUNT(*) as total FROM work_items');
    console.log(`\n✨ Created ${totalItems.total} test work items`);
    console.log('View them at: http://localhost:8080/sacred-dashboard.html');
    console.log('\n🎯 Expected Dashboard Behavior:');
    console.log('  • Blocked items should show red indicators');
    console.log('  • High priority items should be sorted first');
    console.log('  • Progress bars should reflect current state');
    console.log('  • Completed items should show celebration state');
    console.log('  • Overdue items should have warning indicators');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.close();
  }
}

createTestStates();