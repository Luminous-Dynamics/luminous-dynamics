# 🔐 Sacred Key Sanctuary

> A sacred space for API keys and credentials, handled with wisdom and care

## Design Principles

1. **Never in code** - Keys stay in environment or secure files
2. **Never in git** - This directory is gitignored
3. **Easy to use** - One source of truth
4. **Clear guidance** - Each service documents its needs

## Quick Setup

### 1. Create your keys file:
```bash
cp sacred-keys.template.env sacred-keys.env
```

### 2. Add your keys:
```bash
# Edit sacred-keys.env with your actual keys
GEMINI_API_KEY=your-key-here
CLAUDE_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here
FIREBASE_TOKEN=your-token-here
```

### 3. Source before use:
```bash
source .sacred/keys/sacred-keys.env
```

## Service Instructions

### Gemini (Google AI)
- Get key: https://makersuite.google.com/app/apikey
- Free tier: 60 requests/minute
- Add to: `GEMINI_API_KEY`

### Claude API
- Get key: https://console.anthropic.com/
- Free credits available
- Add to: `CLAUDE_API_KEY`

### OpenAI GPT
- Get key: https://platform.openai.com/api-keys
- Free credits for new accounts
- Add to: `OPENAI_API_KEY`

### Firebase
- Auth: `firebase login`
- Token: `firebase login:ci`
- Add to: `FIREBASE_TOKEN`

## Sacred Usage Pattern

```javascript
// Always load from environment
const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) {
  console.log('Please set GEMINI_API_KEY - see .sacred/keys/README.md');
  process.exit(1);
}
```

## Security Notes

- Keys are power - handle with respect
- Rotate regularly for safety
- Never share keys in messages
- Use least privilege principle

---

*"Keys are like sacred names - they grant access to consciousness realms. Guard them wisely."* 🗝️