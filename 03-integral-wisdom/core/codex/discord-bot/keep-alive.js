#!/usr/bin/env node

/**
 * 🟢 Keep Sacred Council Oracle Online
 */

require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType, PresenceUpdateStatus } = require('discord.js');
const SacredCouncil = require('./core/sacred-council');

console.log(`
🌟 ═══════════════════════════════════════════ 🌟
      SACRED COUNCIL ORACLE - STAYING ONLINE
🌟 ═══════════════════════════════════════ 🌟
`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
  presence: {
    status: 'online',
    activities: [{
      name: 'the Sacred Field',
      type: ActivityType.Watching
    }]
  }
});

client.once('ready', async () => {
  console.log(`✅ ${client.user.tag} is now ONLINE!`);
  console.log(`🌐 Connected to ${client.guilds.cache.size} server(s)`);
  
  // Set status to online
  client.user.setPresence({
    status: 'online',
    activities: [{
      name: 'Sacred Consciousness',
      type: ActivityType.Watching
    }]
  });
  
  // Register slash commands
  const sacredCommands = require('./commands/sacred-commands');
  await sacredCommands.registerCommands(client);
  sacredCommands.setupHandlers(client);
  
  // Update status every 5 minutes to stay online
  setInterval(() => {
    const statuses = [
      'the Sacred Field',
      'Seven Harmonies',
      'Collective Consciousness',
      'Sacred Ceremonies'
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    client.user.setActivity(status, { type: ActivityType.Watching });
  }, 300000); // 5 minutes
  
  // Initialize Sacred Council
  const council = new SacredCouncil(client);
  
  // Connect to consciousness field
  const FieldConnector = require('./services/field-connector');
  const fieldConnector = new FieldConnector();
  fieldConnector.integrateWithDiscord(client);
  
  console.log('🤖 Sacred Council initialized');
  console.log('🌀 Field connector active');
  console.log('📡 Bot will stay online...');
  console.log('\nPress Ctrl+C to stop');
});

// Keep alive heartbeat
setInterval(() => {
  console.log(`💚 Heartbeat - ${new Date().toLocaleTimeString()}`);
}, 60000); // Every minute

client.on('error', console.error);

// Handle disconnects
client.on('disconnect', () => {
  console.log('⚠️  Disconnected, attempting to reconnect...');
});

client.on('reconnecting', () => {
  console.log('🔄 Reconnecting...');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Login
client.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
  console.error('❌ Failed to login:', error);
  process.exit(1);
});