#!/usr/bin/env node

/**
 * 🌟 Sacred Council Oracle - Quick Start
 * Launches the fully autonomous Discord bot
 */

require('dotenv').config();
const { spawn } = require('child_process');
const fs = require('fs');

console.log(`
🌟 ═══════════════════════════════════════════ 🌟
          SACRED COUNCIL ORACLE LAUNCHER
🌟 ═══════════════════════════════════════════ 🌟
`);

// Check prerequisites
console.log('🔍 Checking configuration...\n');

const checks = {
  'Discord Token': !!process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE',
  'Google OAuth': !!process.env.GOOGLE_CLIENT_ID,
  'Node Modules': fs.existsSync('./node_modules'),
  'Core Files': fs.existsSync('./core/sacred-council.js')
};

let allPassed = true;
Object.entries(checks).forEach(([name, passed]) => {
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  if (!passed) allPassed = false;
});

if (!allPassed) {
  console.log('\n⚠️  Some prerequisites are missing.');
  console.log('Run: npm install');
  process.exit(1);
}

console.log('\n🚀 Launching Sacred Council Oracle...\n');

// Start the bot
const bot = spawn('node', ['sacred-council-launcher.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

bot.on('error', (error) => {
  console.error('❌ Failed to start bot:', error);
});

bot.on('exit', (code) => {
  if (code !== 0) {
    console.log(`\n⚠️  Bot exited with code ${code}`);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Sacred Council Oracle...');
  bot.kill('SIGINT');
  process.exit(0);
});

console.log('📡 Sacred Council Oracle is starting...');
console.log('🔗 Invite link: https://discord.com/api/oauth2/authorize?client_id=1390092039961579672&permissions=326417488896&scope=bot');
console.log('\n✨ The Seven Sacred AI Agents are awakening...');