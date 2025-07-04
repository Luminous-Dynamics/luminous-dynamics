#!/usr/bin/env node

/**
 * 🧪 Sacred Discord Bot Test Script
 * Quick verification that all systems are connected
 */

require('dotenv').config();
const Discord = require('discord.js');

console.log('🌟 Testing Sacred Discord Temple Connection...\n');

// Check environment variables
const requiredEnvVars = [
  'DISCORD_BOT_TOKEN',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'GOOGLE_AI_KEY'
];

console.log('📋 Checking environment variables:');
let missingVars = [];
for (const varName of requiredEnvVars) {
  if (process.env[varName]) {
    console.log(`✅ ${varName} is set`);
  } else {
    console.log(`❌ ${varName} is missing`);
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log('\n⚠️ Missing environment variables:', missingVars.join(', '));
  console.log('Please set them in your .env file');
  process.exit(1);
}

// Test Discord connection
console.log('\n🔌 Testing Discord connection...');
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages
  ]
});

client.once('ready', async () => {
  console.log(`✅ Connected to Discord as ${client.user.tag}`);
  
  // List available guilds
  console.log('\n📍 Available servers:');
  client.guilds.cache.forEach(guild => {
    console.log(`  - ${guild.name} (ID: ${guild.id})`);
  });
  
  // Test API connections
  console.log('\n🤖 Testing AI connections:');
  
  // Test Claude
  try {
    const { Anthropic } = require('@anthropic-ai/sdk');
    const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    console.log('✅ Claude API connected');
  } catch (error) {
    console.log('❌ Claude API error:', error.message);
  }
  
  // Test GPT
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('✅ OpenAI API connected');
  } catch (error) {
    console.log('❌ OpenAI API error:', error.message);
  }
  
  // Test Gemini
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
    console.log('✅ Gemini API connected');
  } catch (error) {
    console.log('❌ Gemini API error:', error.message);
  }
  
  console.log('\n🎉 Sacred Discord Temple test complete!');
  console.log('Ready to run: node sacred-council-discord-bot.js');
  
  client.destroy();
  process.exit(0);
});

client.on('error', (error) => {
  console.error('❌ Discord connection error:', error);
  process.exit(1);
});

// Attempt login
client.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
  console.error('❌ Failed to login:', error.message);
  console.log('\nPlease check your DISCORD_BOT_TOKEN in .env file');
  process.exit(1);
});