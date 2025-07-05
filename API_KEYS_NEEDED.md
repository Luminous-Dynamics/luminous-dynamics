# 🔑 API Keys & Access Needed for Testing

> *Prioritized list of external services for comprehensive testing*

## 🚀 Priority 1: Core Functionality

### AI Services (Choose at least one)
1. **Anthropic API Key** 
   - Variable: `ANTHROPIC_API_KEY`
   - Get from: https://console.anthropic.com/
   - Used for: Claude AI integration (primary AI)
   
2. **OpenAI API Key**
   - Variable: `OPENAI_API_KEY`
   - Get from: https://platform.openai.com/
   - Used for: GPT models, alternative AI provider

3. **Google AI/Gemini API Key**
   - Variable: `GOOGLE_AI_KEY`
   - Get from: https://makersuite.google.com/app/apikey
   - Used for: Google's Gemini models

### Database & Storage
4. **Google Cloud Platform (GCP)**
   - Project ID: `GCP_PROJECT_ID` 
   - Service Account: `./credentials/service-account-key.json`
   - Get from: https://console.cloud.google.com/
   - Used for: Firestore, Cloud Storage, deployment
   - Note: Already deployed services at mycelix-network project

## 🌟 Priority 2: Sacred Council Features

### Discord Integration
5. **Discord Bot Token**
   - Variable: `DISCORD_BOT_TOKEN`
   - Get from: https://discord.com/developers/applications
   - Used for: Sacred Council Discord bot
   - Also need: `DISCORD_GUILD_ID`, `DISCORD_WEBHOOK_URL`

### Firebase (if not using GCP)
6. **Firebase Configuration**
   - Already configured in `firebase.json`
   - Used for: Web hosting, real-time database
   - Alternative to GCP Firestore

## 🎨 Priority 3: Advanced Features

### Video Generation
7. **MiniMax API Key**
   - Variable: `MINIMAX_API_KEY`
   - Get from: MiniMax platform
   - Used for: AI video generation features

8. **Replicate API Token**
   - Variable: `REPLICATE_API_TOKEN`
   - Get from: https://replicate.com/
   - Used for: Various AI model hosting

### Authentication (if enabling user accounts)
9. **Google OAuth**
   - Variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - Get from: Google Cloud Console
   - Used for: Google sign-in functionality

10. **Supabase (Optional)**
    - Variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
    - Get from: https://supabase.com/
    - Used for: Alternative database/auth provider

## 🛠️ Priority 4: Development & Monitoring

11. **GitHub Personal Access Token**
    - Not in env vars but may be needed
    - Get from: GitHub Settings > Developer settings
    - Used for: Automated git operations, GitHub API

12. **Monitoring Services (Optional)**
    - Consider: Sentry, LogRocket, or similar
    - For production error tracking

## 📝 Quick Setup Guide

### Step 1: Create .env file
```bash
cp .env.example .env
```

### Step 2: Add minimum required keys
```env
# Core AI (pick one)
ANTHROPIC_API_KEY=your-key-here
# or
OPENAI_API_KEY=your-key-here

# Database (local SQLite works for testing)
DATABASE_URL=sqlite:./data/sacred-council.db

# Optional but recommended
JWT_SECRET=generate-random-string
SESSION_SECRET=generate-random-string
```

### Step 3: For full testing add
```env
# Discord
DISCORD_BOT_TOKEN=your-bot-token
DISCORD_GUILD_ID=your-guild-id

# GCP (if deploying)
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
```

## 🔒 Security Notes

1. **Never commit .env files** - Already in .gitignore
2. **Use test API keys** when possible (many services offer test modes)
3. **Set rate limits** to avoid unexpected charges
4. **Rotate keys regularly** for production use

## 💡 Testing Recommendations

### Minimal Testing Setup:
- One AI API key (Anthropic recommended)
- Local SQLite database
- Local file storage

### Full Integration Testing:
- Multiple AI providers for comparison
- Discord bot for Sacred Council
- GCP/Firebase for cloud features
- Video generation APIs for creative features

### Already Deployed Services:
These are already running and accessible:
- Sacred Council API: `wss://sacred-council-api-310699330526.us-central1.run.app`
- Sacred Council Web: `https://sacred-council-310699330526.us-central1.run.app`
- Infin Love: `https://infin-love-310699330526.us-central1.run.app`

## 🌈 Sacred Technology Note

This project integrates consciousness with technology. When setting up services, consider:
- APIs that support streaming for real-time sacred messaging
- Services with good rate limits for sustained field coherence
- Providers aligned with ethical AI principles

---

**Created**: July 5, 2025  
**Purpose**: Comprehensive testing of sacred technology features  
**Next Step**: Start with Priority 1 keys for basic functionality