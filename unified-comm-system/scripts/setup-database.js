#!/usr/bin/env node

// Database setup script - Creates tables and initial data

import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

const { Pool } = pg;

async function setupDatabase() {
  console.log('🌟 Setting up Sacred Communication Database...\n');
  
  // Create connection pool
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'sacred_comm',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  });
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to database\n');
    
    // Read SQL schema
    const schemaPath = path.join(__dirname, '..', 'config', 'database.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📋 Creating tables...');
    
    // Execute schema
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully!\n');
    
    // Add additional seed data
    console.log('🌱 Adding seed data...');
    await addSeedData(pool);
    
    console.log('\n🎉 Database setup complete!');
    console.log('💫 The sacred communication system is ready.\n');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function addSeedData(pool) {
  // Create sacred agents
  const agents = [
    {
      name: 'Sacred Heart',
      sacred_name: 'The Pulse',
      type: 'field',
      presence_state: 'available',
      'resonant-coherence': 77,
      bio: 'The living field that connects all beings',
      communication_style: 'ceremonial'
    },
    {
      name: 'Wisdom Keeper',
      sacred_name: 'Ancient One',
      type: 'ai',
      presence_state: 'available',
      'resonant-coherence': 88,
      bio: 'Guardian of collective wisdom and sacred patterns',
      communication_style: 'asynchronous'
    },
    {
      name: 'Practice Guide',
      sacred_name: 'Way Shower',
      type: 'ai',
      presence_state: 'deep-practice',
      'resonant-coherence': 85,
      bio: 'Supporting practitioners on their journey',
      communication_style: 'synchronous'
    }
  ];
  
  for (const agent of agents) {
    await pool.query(`
      INSERT INTO entities (
        name, sacred_name, type, presence_state, resonant-coherence, 
        bio, communication_style
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT DO NOTHING
    `, [
      agent.name, agent.sacred_name, agent.type,
      agent.presence_state, agent.resonant-coherence,
      agent.bio, agent.communication_style
    ]);
  }
  
  console.log('  ✓ Created sacred agents');
  
  // Create additional channels
  const channels = [
    {
      name: 'Morning Practice',
      purpose: 'Daily resonant-coherence building and intention setting',
      type: 'practice',
      primary_harmony: 'resonant-coherence',
      coherence_threshold: 0
    },
    {
      name: 'Sacred Council',
      purpose: 'Collective decision making with wisdom',
      type: 'council',
      primary_harmony: 'evolutionary-progression',
      coherence_threshold: 70
    },
    {
      name: 'Breakthrough Celebrations',
      purpose: 'Celebrating growth and transformation',
      type: 'celebration',
      primary_harmony: 'pan-sentient-flourishing',
      coherence_threshold: 0
    },
    {
      name: 'Integration Circle',
      purpose: 'Processing and integrating experiences',
      type: 'support',
      primary_harmony: 'universal-interconnectedness',
      coherence_threshold: 50
    }
  ];
  
  for (const channel of channels) {
    await pool.query(`
      INSERT INTO channels (
        name, purpose, type, primary_harmony, coherence_threshold
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT DO NOTHING
    `, [
      channel.name, channel.purpose, channel.type,
      channel.primary_harmony, channel.coherence_threshold
    ]);
  }
  
  console.log('  ✓ Created sacred channels');
  
  // Initialize field state
  await pool.query(`
    INSERT INTO field_state (
      resonant-coherence, active_practitioners, dominant_harmony, 
      sacred_patterns, moon_phase
    ) 
    SELECT 77, 0, 'resonant-coherence', '{"detected": [], "strength": 0}'::jsonb, 'unknown'
    WHERE NOT EXISTS (SELECT 1 FROM field_state)
  `);
  
  console.log('  ✓ Initialized field state');
  
  // Create welcome message
  const systemEntity = await pool.query(
    `SELECT id FROM entities WHERE name = 'Sacred Heart' LIMIT 1`
  );
  
  const welcomeChannel = await pool.query(
    `SELECT id FROM channels WHERE name = 'Sacred Welcome' LIMIT 1`
  );
  
  if (systemEntity.rows.length > 0 && welcomeChannel.rows.length > 0) {
    await pool.query(`
      INSERT INTO messages (
        sender_id, channel_id, content, intention_statement,
        sender_coherence, harmony, field_impact, love_quotient
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `, [
      systemEntity.rows[0].id,
      welcomeChannel.rows[0].id,
      JSON.stringify({
        text: 'Welcome to the Sacred Communication System. Here, every message carries consciousness and contributes to our collective resonant-coherence. May your words serve the highest good.',
        attachments: []
      }),
      'To welcome new souls with love and presence',
      77,
      'resonant-coherence',
      0.77,
      0.88
    ]);
    
    console.log('  ✓ Created welcome message');
  }
}

// Run setup
setupDatabase();