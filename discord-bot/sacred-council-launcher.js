#!/usr/bin/env node

/**
 * 🌟 Sacred Council Oracle - Main Launcher
 * Unified entry point for the Discord bot
 */

require('dotenv').config();
const SacredCouncil = require('./core/sacred-council');

console.log(`
🌟 ═══════════════════════════════════════════ 🌟
      SACRED COUNCIL ORACLE INITIALIZING
🌟 ═══════════════════════════════════════════ 🌟
`);

// Validate environment
const validateEnvironment = () => {
  const required = [
    'DISCORD_BOT_TOKEN',
    'ANTHROPIC_API_KEY', 
    'OPENAI_API_KEY',
    'GOOGLE_AI_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease check your .env file');
    process.exit(1);
  }
  
  console.log('✅ Environment validated');
};

// Initialize Sacred Council
const initializeSacredCouncil = async () => {
  try {
    validateEnvironment();
    
    const council = new SacredCouncil({
      mode: process.env.BOT_MODE || 'unified'
    });
    
    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      console.log('\n🌙 Received shutdown signal...');
      await council.shutdown();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🌙 Received termination signal...');
      await council.shutdown();
      process.exit(0);
    });
    
    // Start the Sacred Council
    await council.start();
    
  } catch (error) {
    console.error('❌ Failed to initialize Sacred Council:', error);
    process.exit(1);
  }
};

// Launch
initializeSacredCouncil();