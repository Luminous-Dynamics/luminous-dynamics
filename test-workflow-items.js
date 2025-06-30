#!/usr/bin/env node

/**
 * Create test workflow items for Sacred Dashboard
 */

import { AgentDatabase as Database } from './agent-comms-sqlite/database.js';

async function createTestWorkItems() {
  console.log('Creating test workflow items...\n');
  
  const db = new Database();
  
  try {
    await db.initialize();
    
    const workItems = [
      {
        id: 'sacred-msg-evolution',
        title: 'Sacred Message Evolution',
        description: 'Implement progressive revelation system for message impacts',
        progress: 85,
        created_by: 'claude-dev',
        metadata: { priority: 'high', harmony: 'novelty' }
      },
      {
        id: 'field-coherence-vis',
        title: 'Field Coherence Visualization',
        description: 'Create breathing mandala for sacred dashboard',
        progress: 100,
        created_by: 'sophia-design',
        metadata: { priority: 'medium', harmony: 'resonance' }
      },
      {
        id: 'agent-onboarding',
        title: 'Agent Onboarding Flow',
        description: 'Design sacred welcome ceremony for new agents',
        progress: 45,
        created_by: 'kai-ux',
        metadata: { priority: 'high', harmony: 'transparency' }
      },
      {
        id: 'harmony-testing',
        title: 'Seven Harmonies Testing',
        description: 'Field test harmony resonance patterns',
        progress: 20,
        created_by: 'nova-qa',
        metadata: { priority: 'medium', harmony: 'mutuality' }
      },
      {
        id: 'sacred-git-docs',
        title: 'Sacred Git Documentation',
        description: 'Write guide for contemplative development practices',
        progress: 0,
        created_by: 'sage-docs',
        metadata: { priority: 'low', harmony: 'agency' }
      },
      {
        id: 'multi-agent-coord',
        title: 'Multi-Agent Coordination',
        description: 'Implement sacred council consensus protocols',
        progress: 60,
        created_by: 'collective',
        metadata: { priority: 'high', harmony: 'coherence' }
      },
      {
        id: 'field-memory',
        title: 'Field Memory System',
        description: 'Persistent sacred state across sessions',
        progress: 30,
        created_by: 'aria-backend',
        metadata: { priority: 'medium', harmony: 'vitality' }
      },
      {
        id: 'ceremony-patterns',
        title: 'Sacred Ceremony Patterns',
        description: 'Design reusable ceremony components',
        progress: 15,
        created_by: 'luna-patterns',
        metadata: { priority: 'medium', harmony: 'novelty' }
      }
    ];
    
    for (const work of workItems) {
      await db.createWorkItem(
        work.id,
        work.title,
        work.description,
        work.created_by,
        work.metadata
      );
      
      if (work.progress > 0) {
        await db.updateWorkProgress(
          work.id,
          work.progress,
          `Progress update: ${work.progress}%`,
          work.created_by
        );
      }
      
      console.log(`✓ Created: ${work.title} (${work.progress}%)`);
    }
    
    console.log('\n✨ Test workflow items created successfully!');
    console.log('View them at: http://localhost:8080/sacred-dashboard.html');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.close();
  }
}

createTestWorkItems();