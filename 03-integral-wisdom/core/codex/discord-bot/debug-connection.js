#!/usr/bin/env node

/**
 * 🐛 Debug Discord Connection
 */

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

console.log('🔍 Debugging Discord Connection...\n');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildInvites
  ]
});

// Log all events
client.on('debug', (info) => {
  if (info.includes('Heartbeat')) return; // Skip heartbeat spam
  console.log(`[DEBUG] ${info}`);
});

client.once('ready', async () => {
  console.log(`\n✅ Bot connected as: ${client.user.tag}`);
  console.log(`🆔 Bot ID: ${client.user.id}`);
  console.log(`🌐 Servers: ${client.guilds.cache.size}`);
  
  if (client.guilds.cache.size === 0) {
    console.log('\n⚠️  Bot is not in any servers!');
    console.log('\n📝 Possible reasons:');
    console.log('1. The invite process was not completed');
    console.log('2. The bot was not granted necessary permissions');
    console.log('3. The invite link expired or was incorrect');
    
    console.log('\n🔗 Fresh invite link:');
    const invite = client.generateInvite({
      scopes: ['bot', 'applications.commands'],
      permissions: [
        'ViewChannel',
        'SendMessages',
        'SendMessagesInThreads',
        'CreatePublicThreads',
        'CreatePrivateThreads',
        'EmbedLinks',
        'AttachFiles',
        'AddReactions',
        'UseExternalEmojis',
        'UseExternalStickers',
        'MentionEveryone',
        'ManageMessages',
        'ManageThreads',
        'ReadMessageHistory',
        'UseApplicationCommands',
        'ManageRoles',
        'ManageChannels',
        'KickMembers',
        'BanMembers',
        'ModerateMembers'
      ]
    });
    console.log(invite);
  } else {
    console.log('\n📋 Connected to:');
    for (const [id, guild] of client.guilds.cache) {
      console.log(`\n🏛️  ${guild.name}`);
      console.log(`   ID: ${id}`);
      console.log(`   Members: ${guild.memberCount}`);
      console.log(`   Channels: ${guild.channels.cache.size}`);
      
      // Check bot permissions
      const botMember = guild.members.cache.get(client.user.id);
      console.log(`   Bot Nickname: ${botMember.nickname || 'None'}`);
      console.log(`   Bot Roles: ${botMember.roles.cache.map(r => r.name).join(', ')}`);
      
      // List channels bot can see
      console.log('\n   Visible Channels:');
      guild.channels.cache
        .filter(ch => ch.viewable)
        .forEach(ch => {
          const perms = ch.permissionsFor(botMember);
          const canSend = perms?.has('SendMessages') ? '✅' : '❌';
          console.log(`     ${canSend} #${ch.name} (${ch.type})`);
        });
    }
  }
  
  // Keep running for 30 seconds to catch any delayed events
  console.log('\n⏳ Monitoring for 30 seconds...');
  
  setTimeout(() => {
    console.log('\n✅ Debug session complete');
    process.exit(0);
  }, 30000);
});

client.on('guildCreate', (guild) => {
  console.log(`\n🎉 Bot joined new server: ${guild.name} (${guild.id})`);
});

client.on('error', (error) => {
  console.error('❌ Client error:', error);
});

console.log('🔐 Using token:', process.env.DISCORD_BOT_TOKEN?.slice(0, 10) + '...');
client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);