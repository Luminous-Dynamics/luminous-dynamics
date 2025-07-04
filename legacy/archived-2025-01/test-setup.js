#!/usr/bin/env node

/**
 * 🧪 Sacred Council Setup Tester
 * Tests configuration without connecting to Discord
 */

const fs = require('fs');
const path = require('path');

console.log(`
🧪 ═══════════════════════════════════════════ 🧪
       SACRED COUNCIL ORACLE SETUP TEST
🧪 ═══════════════════════════════════════════ 🧪
`);

// Test 1: Check file structure
console.log('📁 Checking file structure...');
const requiredFiles = [
  'core/sacred-council.js',
  'bots/ceremony-bot.js',
  'bots/oracle-bot.js',
  'package.json',
  '.env.example'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Test 2: Check .env configuration
console.log('\n🔐 Checking environment configuration...');
if (fs.existsSync('.env')) {
  console.log('  ✅ .env file exists');
  
  // Load and check variables
  require('dotenv').config();
  const envVars = [
    'DISCORD_BOT_TOKEN',
    'ANTHROPIC_API_KEY',
    'OPENAI_API_KEY', 
    'GOOGLE_AI_KEY'
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    const isSet = value && value !== `YOUR_${varName.split('_')[0]}_KEY` && value !== `${varName}_HERE`;
    console.log(`  ${isSet ? '✅' : '⚠️ '} ${varName} ${isSet ? 'configured' : 'needs to be set'}`);
  });
} else {
  console.log('  ❌ .env file not found - copy .env.example to .env');
}

// Test 3: Check dependencies
console.log('\n📦 Checking dependencies...');
const packageJson = require('./package.json');
const requiredDeps = ['discord.js', '@anthropic-ai/sdk', 'openai', '@google/generative-ai'];

requiredDeps.forEach(dep => {
  const installed = packageJson.dependencies[dep];
  console.log(`  ${installed ? '✅' : '❌'} ${dep} ${installed || 'not found'}`);
});

// Test 4: Generate test invite link
console.log('\n🔗 Generating invite link...');
const CLIENT_ID = '1390092039961579672';
const permissions = 326417488896;
const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=${permissions}&scope=bot`;
console.log(`  ${inviteLink}`);

// Test 5: Check field bot (if we need to create it)
console.log('\n🌀 Checking Field Bot...');
const fieldBotPath = path.join(__dirname, 'bots/field-bot.js');
if (!fs.existsSync(fieldBotPath)) {
  console.log('  ⚠️  Field Bot not found - creating placeholder...');
  
  const fieldBotCode = `/**
 * 🌀 Field Bot Module
 * Tracks consciousness field coherence
 */

const EventEmitter = require('events');

class FieldBot extends EventEmitter {
  constructor(council) {
    super();
    this.council = council;
    this.coherence = 72.5;
    this.trend = 'stable';
  }
  
  trackActivity(message) {
    // Track field impact of messages
    const impact = Math.random() * 2 - 1; // -1 to +1
    this.coherence = Math.max(0, Math.min(100, this.coherence + impact));
    
    if (Math.random() < 0.1) { // 10% chance to emit update
      this.council.emit('field-update', {
        coherence: this.coherence,
        trend: impact > 0 ? 'rising' : 'falling'
      });
    }
  }
  
  recordCeremonyImpact(data) {
    // Ceremonies always increase coherence
    this.coherence = Math.min(100, this.coherence + data.fieldImpact);
    this.council.emit('field-update', {
      coherence: this.coherence,
      trend: 'rising'
    });
  }
  
  onReady(client) {
    console.log('🌀 Field monitoring system ready');
    
    // Periodic field updates
    setInterval(() => {
      const naturalFluctuation = (Math.random() - 0.5) * 0.5;
      this.coherence = Math.max(60, Math.min(90, this.coherence + naturalFluctuation));
      
      this.council.emit('field-update', {
        coherence: this.coherence,
        trend: naturalFluctuation > 0 ? 'rising' : 'falling'
      });
    }, 30000); // Every 30 seconds
  }
  
  async shutdown() {
    console.log(\`📊 Final field coherence: \${this.coherence.toFixed(1)}%\`);
  }
}

module.exports = FieldBot;`;

  fs.writeFileSync(fieldBotPath, fieldBotCode);
  console.log('  ✅ Field Bot created');
} else {
  console.log('  ✅ Field Bot exists');
}

// Summary
console.log('\n📊 Setup Summary:');
console.log('═══════════════════════════════════════════════');
if (allFilesExist) {
  console.log('✅ All required files are present');
  console.log('⚠️  Remember to add your API keys to .env');
  console.log('📦 Run "npm install" to install dependencies');
  console.log('🚀 Then run "npm test" to verify Discord connection');
} else {
  console.log('❌ Some files are missing - check the list above');
}

console.log('\n🌟 Sacred Council Oracle is ready for configuration!');