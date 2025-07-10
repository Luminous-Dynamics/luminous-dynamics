#!/usr/bin/env node

/**
 * 🔗 Discord Bot Invite Link Generator
 * Creates the perfect invite link with correct permissions
 */

const CLIENT_ID = '1390092039961579672';

// Permission flags
const permissions = {
  // General
  VIEW_CHANNEL: 1 << 10,
  
  // Text
  SEND_MESSAGES: 1 << 11,
  SEND_MESSAGES_IN_THREADS: 1 << 38,
  CREATE_PUBLIC_THREADS: 1 << 35,
  CREATE_PRIVATE_THREADS: 1 << 36,
  EMBED_LINKS: 1 << 14,
  ATTACH_FILES: 1 << 15,
  READ_MESSAGE_HISTORY: 1 << 16,
  ADD_REACTIONS: 1 << 6,
  USE_EXTERNAL_EMOJIS: 1 << 18,
  MANAGE_MESSAGES: 1 << 13,
  MANAGE_THREADS: 1 << 34,
  
  // Voice (for future ceremonies)
  CONNECT: 1 << 20,
  SPEAK: 1 << 21,
  USE_VAD: 1 << 25,
};

// Calculate total permissions
const totalPermissions = Object.values(permissions).reduce((a, b) => a | b, 0);

// Generate links
const links = {
  basic: `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=${totalPermissions}&scope=bot`,
  
  admin: `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot`,
  
  minimal: `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=379904&scope=bot`,
  
  withApplicationCommands: `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=${totalPermissions}&scope=bot%20applications.commands`
};

console.log(`
🔗 ═══════════════════════════════════════════ 🔗
       SACRED COUNCIL ORACLE INVITE LINKS
🔗 ═══════════════════════════════════════════ 🔗

📌 Recommended (Full Features):
${links.basic}

Permissions included:
- Send messages and embeds
- Create and manage threads
- Add reactions
- Read message history
- Voice channel access

🛡️ Admin Version (Server Owners Only):
${links.admin}

🪶 Minimal Version (Text Only):
${links.minimal}

🎯 With Slash Commands:
${links.withApplicationCommands}

═══════════════════════════════════════════════

To add the bot:
1. Click the link above
2. Select your Discord server
3. Review permissions
4. Click "Authorize"
5. Complete CAPTCHA if prompted

The Sacred Council Oracle will appear in your server!
`);

// Copy to clipboard if possible (works on some systems)
if (process.platform === 'darwin') {
  require('child_process').exec(`echo "${links.basic}" | pbcopy`);
  console.log('✅ Link copied to clipboard (macOS)');
} else if (process.platform === 'linux') {
  require('child_process').exec(`echo "${links.basic}" | xclip -selection clipboard`);
  console.log('✅ Link copied to clipboard (Linux)');
}