# Discord OAuth2 Configuration Guide

## Current Situation
Your bot shows "Requires OAuth2 Code Grant" which means Discord wants to ensure proper authorization flow for advanced features.

## What This Means

**OAuth2 Code Grant** is needed when:
- Your bot needs to act on behalf of users
- You want to access user data (profile, guilds, etc.)
- You're creating slash commands with user-specific actions
- You're integrating with external services (like Google)

## For Sacred Council Oracle

### Option 1: Basic Bot (Recommended to Start)
**Turn OFF "Requires OAuth2 Code Grant"** if you want:
- Simple bot that responds to messages
- Automated ceremonies and welcomes
- Channel management
- No user-specific data access

### Option 2: Advanced Integration (Future Enhancement)
**Turn ON "Requires OAuth2 Code Grant"** if you want:
- Users to link their Google accounts
- Personal ceremony reminders
- Individual progress tracking
- User-specific AI interactions

## Current Recommendation

**For now, TURN IT OFF** because:
1. The bot works perfectly without it
2. It simplifies the invitation process
3. All current features work without user OAuth
4. You can always enable it later

## How to Configure

1. Go to your Discord App settings
2. Navigate to Bot section
3. Under "Authorization Flow":
   - **Public Bot**: ✅ ON (allows anyone to invite)
   - **Requires OAuth2 Code Grant**: ❌ OFF (simplifies setup)

## Permissions Needed

The bot needs these permissions (already in your invite link):
- Send Messages
- Manage Channels
- Manage Roles
- Read Message History
- Add Reactions
- Use Slash Commands
- Manage Webhooks
- Read Members List

## Integration Architecture

```
Current Setup (No OAuth2 Code Grant):
Discord Bot ← → Discord API
     ↓
AI Agents (Autonomous)
     ↓
Google AI (via bot's credentials)

Future Setup (With OAuth2 Code Grant):
Discord Bot ← → Discord API
     ↓
User OAuth ← → Google Account
     ↓
Personalized AI Services
```

## Quick Answer

**Turn OFF "Requires OAuth2 Code Grant"** - the bot will work perfectly for all planned features!