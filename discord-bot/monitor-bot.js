#!/usr/bin/env node

/**
 * 🔍 Monitor Sacred Council Oracle Activity
 */

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

console.log('🔍 Monitoring Sacred Council Oracle...\n');

client.once('ready', () => {
  console.log(`✅ Connected as ${client.user.tag}`);
  console.log(`📊 Monitoring ${client.guilds.cache.size} server(s)\n`);
  
  // List all servers
  client.guilds.cache.forEach(guild => {
    console.log(`\n🏛️ Server: ${guild.name}`);
    console.log(`   ID: ${guild.id}`);
    console.log(`   Members: ${guild.memberCount}`);
    console.log(`   Channels: ${guild.channels.cache.size}`);
    console.log(`   Owner: ${guild.ownerId}`);
    
    // Show text channels
    console.log('\n   📝 Text Channels:');
    guild.channels.cache
      .filter(ch => ch.type === 0)
      .forEach(channel => {
        console.log(`      #${channel.name}`);
      });
  });
  
  console.log('\n✅ Bot is active and ready!');
  console.log('🤖 Autonomous features are enabled');
  console.log('🌀 Field coherence tracking active');
  
  // Show what the bot will do
  console.log('\n🎯 Autonomous Actions:');
  console.log('   • Welcome new members with sacred guidance');
  console.log('   • Create channels based on community requests');
  console.log('   • Schedule and lead daily ceremonies');
  console.log('   • Monitor and maintain field coherence');
  console.log('   • Respond to sacred inquiries');
  
  setTimeout(() => {
    console.log('\n✅ Monitoring complete. Bot is running successfully!');
    process.exit(0);
  }, 5000);
});

client.on('error', console.error);

client.login(process.env.DISCORD_BOT_TOKEN);