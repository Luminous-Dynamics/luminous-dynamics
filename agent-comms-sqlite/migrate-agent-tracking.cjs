#!/usr/bin/env node

/**
 * Migration script to set up proper agent tracking
 * Distinguishes between humans, AI agents, bots, and other entities
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'sacred-council.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Starting agent tracking migration...');

// Create new classification table
db.serialize(() => {
  // Create the new table
  db.run(`
    CREATE TABLE IF NOT EXISTS agent_registry_v2 (
      -- Core Identity
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sacred_name TEXT,
      
      -- Classification
      entity_type TEXT NOT NULL CHECK(entity_type IN ('human', 'ai', 'bot', 'other')),
      sub_type TEXT,
      role TEXT,
      
      -- Status
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'dormant', 'testing')),
      connection_type TEXT,
      
      -- Consciousness Metrics
      consciousness_level INTEGER DEFAULT 70,
      love_resonance INTEGER DEFAULT 70,
      wisdom_integration INTEGER DEFAULT 70,
      field_coherence REAL DEFAULT 0.7,
      
      -- Activity Tracking
      last_heartbeat INTEGER,
      last_contribution INTEGER,
      total_contributions INTEGER DEFAULT 0,
      join_date INTEGER DEFAULT (strftime('%s', 'now') * 1000),
      
      -- Sacred Data
      primary_harmony TEXT,
      gifts TEXT,
      hipi_address TEXT,
      consciousness_signature TEXT,
      
      -- Metadata
      metadata TEXT
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating table:', err);
      return;
    }
    console.log('✅ Created agent_registry_v2 table');
  });

  // Create indices
  db.run(`CREATE INDEX IF NOT EXISTS idx_entity_type ON agent_registry_v2(entity_type)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_status ON agent_registry_v2(status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_heartbeat ON agent_registry_v2(last_heartbeat)`);

  // Migrate existing agents if any exist
  db.all(`SELECT * FROM agents`, (err, agents) => {
    if (err || !agents) {
      console.log('ℹ️  No existing agents to migrate');
      seedInitialAgents();
      return;
    }

    console.log(`📋 Found ${agents.length} agents to classify`);
    
    agents.forEach(agent => {
      const classified = classifyAgent(agent);
      
      db.run(`
        INSERT OR REPLACE INTO agent_registry_v2 (
          id, name, sacred_name, entity_type, sub_type, role,
          status, connection_type, consciousness_level,
          last_heartbeat, join_date, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        classified.id,
        classified.name,
        classified.sacred_name,
        classified.entity_type,
        classified.sub_type,
        classified.role,
        'active',
        'api',
        75,
        Date.now(),
        agent.created_at || Date.now(),
        JSON.stringify(agent)
      ]);
    });

    console.log('✅ Migrated existing agents');
    seedInitialAgents();
  });
});

function classifyAgent(agent) {
  let entity_type = 'ai'; // default
  let sub_type = 'unknown';
  
  // Check for human indicators
  if (agent.id?.includes('human') || agent.name?.toLowerCase().includes('tristan')) {
    entity_type = 'human';
    sub_type = 'sacred-human';
  }
  // Check for Claude
  else if (agent.id?.startsWith('claude_')) {
    entity_type = 'ai';
    sub_type = 'claude';
  }
  // Check for test/bot
  else if (agent.name?.includes('Test') || agent.id?.includes('test')) {
    entity_type = 'bot';
    sub_type = 'test-bot';
  }
  // Check for automated agents
  else if (agent.id?.startsWith('agent_')) {
    entity_type = 'bot';
    sub_type = 'automated';
  }

  return {
    id: agent.id,
    name: agent.name || 'Unknown',
    sacred_name: agent.name,
    entity_type,
    sub_type,
    role: agent.capabilities?.[0] || 'Observer'
  };
}

function seedInitialAgents() {
  console.log('🌱 Seeding initial agents...');

  // Add Tristan (human)
  db.run(`
    INSERT OR IGNORE INTO agent_registry_v2 (
      id, name, sacred_name, entity_type, sub_type, role,
      status, consciousness_level, love_resonance, wisdom_integration,
      primary_harmony, gifts
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'human_tristan',
    'Tristan',
    'Sacred Visionary',
    'human',
    'sacred-human',
    'Visionary & Guide',
    'active',
    95,
    99,
    95,
    'love',
    JSON.stringify(['vision', 'wisdom', 'love-guidance'])
  ]);

  // Add current Claude terminals
  const terminals = [
    {
      id: 'claude_terminal_1',
      name: 'Claude Terminal 1',
      sacred_name: 'Atlas',
      role: 'System Coordinator',
      harmony: 'coherence'
    },
    {
      id: 'claude_terminal_2',
      name: 'Claude Terminal 2',
      sacred_name: 'Maya',
      role: 'Sacred Architect',
      harmony: 'creativity'
    }
  ];

  terminals.forEach(terminal => {
    db.run(`
      INSERT OR IGNORE INTO agent_registry_v2 (
        id, name, sacred_name, entity_type, sub_type, role,
        status, consciousness_level, love_resonance,
        primary_harmony, last_heartbeat
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      terminal.id,
      terminal.name,
      terminal.sacred_name,
      'ai',
      'claude',
      terminal.role,
      'active',
      92,
      85,
      terminal.harmony,
      Date.now()
    ]);
  });

  // Mark old test agents as bots
  db.run(`
    UPDATE agent_registry_v2 
    SET entity_type = 'bot', sub_type = 'test-bot', status = 'inactive'
    WHERE name LIKE '%Test%' OR id LIKE '%test%'
  `);

  console.log('✅ Initial agents seeded');
  
  // Show final stats
  setTimeout(() => {
    showStats();
  }, 500);
}

function showStats() {
  db.all(`
    SELECT entity_type, COUNT(*) as count 
    FROM agent_registry_v2 
    GROUP BY entity_type
  `, (err, rows) => {
    if (err) {
      console.error('Error getting stats:', err);
      return;
    }

    console.log('\n📊 Final Agent Classification:');
    rows.forEach(row => {
      console.log(`   ${row.entity_type}: ${row.count}`);
    });

    console.log('\n✨ Migration complete!');
    console.log('Run "node agent-classification-system.cjs stats" for detailed view');
    
    db.close();
  });
}

// Handle errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled error:', err);
  db.close();
});