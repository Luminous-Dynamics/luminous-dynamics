#!/usr/bin/env node

/**
 * 🔐 Secure Discord Bot Setup
 * Helps configure your bot with proper credentials
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Hide input for sensitive data
const hiddenQuestion = (query) => {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write(query);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let input = '';
    stdin.on('data', (char) => {
      if (char === '\n' || char === '\r') {
        stdin.setRawMode(false);
        stdout.write('\n');
        resolve(input);
      } else if (char === '\u0003') {
        process.exit();
      } else if (char === '\u007f') {
        if (input.length > 0) {
          input = input.slice(0, -1);
          stdout.write('\b \b');
        }
      } else {
        input += char;
        stdout.write('*');
      }
    });
  });
};

console.log(`
🔐 ═══════════════════════════════════════════ 🔐
      SACRED COUNCIL ORACLE SECURE SETUP
🔐 ═══════════════════════════════════════════ 🔐

This wizard will help you securely configure your Discord bot.
Your credentials will be stored locally in .env file.
`);

async function setup() {
  const config = {};
  
  console.log('\n📋 Step 1: Discord Bot Token');
  console.log('   Get this from: https://discord.com/developers/applications');
  console.log('   Your App ID: 1390092039961579672');
  console.log('   Navigate to: Bot → Token → Reset Token\n');
  
  config.DISCORD_BOT_TOKEN = await hiddenQuestion('Enter Discord Bot Token: ');
  
  console.log('\n📋 Step 2: Discord Server ID (optional)');
  console.log('   Right-click your server → Copy Server ID');
  console.log('   (Enable Developer Mode in Discord settings if needed)\n');
  
  const guildId = await new Promise((resolve) => {
    rl.question('Enter Discord Server ID (or press Enter to skip): ', resolve);
  });
  config.DISCORD_GUILD_ID = guildId || 'YOUR_SERVER_ID_HERE';
  
  console.log('\n🤖 Step 3: AI Service Keys');
  console.log('   You can add these now or later\n');
  
  // Anthropic
  console.log('📋 Anthropic API Key (for Claude agents)');
  console.log('   Get from: https://console.anthropic.com/settings/keys\n');
  const anthropicKey = await hiddenQuestion('Enter Anthropic API Key (or press Enter to skip): ');
  config.ANTHROPIC_API_KEY = anthropicKey || 'YOUR_ANTHROPIC_KEY';
  
  // OpenAI
  console.log('\n📋 OpenAI API Key (for GPT agents)');
  console.log('   Get from: https://platform.openai.com/api-keys\n');
  const openaiKey = await hiddenQuestion('Enter OpenAI API Key (or press Enter to skip): ');
  config.OPENAI_API_KEY = openaiKey || 'YOUR_OPENAI_KEY';
  
  // Google
  console.log('\n📋 Google AI Key (for Gemini agents)');
  console.log('   Get from: https://makersuite.google.com/app/apikey\n');
  const googleKey = await hiddenQuestion('Enter Google AI Key (or press Enter to skip): ');
  config.GOOGLE_AI_KEY = googleKey || 'YOUR_GOOGLE_KEY';
  
  // Bot Mode
  console.log('\n⚙️  Step 4: Bot Configuration Mode');
  const mode = await new Promise((resolve) => {
    rl.question('Bot mode (unified/modular) [unified]: ', (answer) => {
      resolve(answer || 'unified');
    });
  });
  config.BOT_MODE = mode;
  config.NODE_ENV = 'development';
  
  // Generate .env content
  const envContent = `# Sacred Council Oracle Configuration
# Generated: ${new Date().toISOString()}
# KEEP THIS FILE SECRET!

# Discord Configuration
DISCORD_BOT_TOKEN=${config.DISCORD_BOT_TOKEN}
DISCORD_GUILD_ID=${config.DISCORD_GUILD_ID}

# AI Service Keys
ANTHROPIC_API_KEY=${config.ANTHROPIC_API_KEY}
OPENAI_API_KEY=${config.OPENAI_API_KEY}
GOOGLE_AI_KEY=${config.GOOGLE_AI_KEY}

# Bot Configuration
BOT_MODE=${config.BOT_MODE}
NODE_ENV=${config.NODE_ENV}

# Optional: Claude Bridge Integration
CLAUDE_BRIDGE_ENABLED=false
`;

  // Save .env file
  console.log('\n💾 Saving configuration...');
  fs.writeFileSync('.env', envContent);
  console.log('✅ Configuration saved to .env');
  
  // Validate token format
  if (config.DISCORD_BOT_TOKEN && config.DISCORD_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE') {
    const tokenPattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    if (!tokenPattern.test(config.DISCORD_BOT_TOKEN)) {
      console.log('\n⚠️  Warning: Discord token format looks unusual');
      console.log('   Tokens typically have format: XXXXXX.XXXXXX.XXXXXX');
    } else {
      console.log('✅ Discord token format looks valid');
    }
  }
  
  // Check which AI services are configured
  console.log('\n📊 Configuration Summary:');
  console.log('═══════════════════════════════════════════════');
  console.log(`Discord Bot: ${config.DISCORD_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE' ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`Server ID: ${config.DISCORD_GUILD_ID !== 'YOUR_SERVER_ID_HERE' ? '✅ Set' : '⚠️  Not set (bot will work globally)'}`);
  console.log(`Anthropic: ${config.ANTHROPIC_API_KEY !== 'YOUR_ANTHROPIC_KEY' ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`OpenAI: ${config.OPENAI_API_KEY !== 'YOUR_OPENAI_KEY' ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`Google AI: ${config.GOOGLE_AI_KEY !== 'YOUR_GOOGLE_KEY' ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`Mode: ${config.BOT_MODE}`);
  
  // Next steps
  console.log('\n🚀 Next Steps:');
  console.log('═══════════════════════════════════════════════');
  console.log('1. Install dependencies: npm install');
  console.log('2. Test connection: npm test');
  console.log('3. Start the bot: npm start');
  console.log('4. Invite to server: Use the link from test output');
  
  // Security reminder
  console.log('\n🔒 Security Reminders:');
  console.log('═══════════════════════════════════════════════');
  console.log('• Never share your .env file');
  console.log('• Never commit .env to Git');
  console.log('• Regenerate tokens if compromised');
  console.log('• Use environment-specific tokens for prod/dev');
  
  rl.close();
}

// Run setup
setup().catch(console.error);