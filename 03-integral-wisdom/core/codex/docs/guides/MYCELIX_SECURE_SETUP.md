# 🔐 MYCELIX Secure API Setup

*Safe practices for consciousness infrastructure*

## 🌟 Smart Testing Strategy

### For Development (Like Your $5 Limited Key):
```bash
# Create test-specific keys with limits
- Set spending limits
- Use separate test projects
- Monitor usage daily
- Rotate regularly
```

### For MYCELIX Integration:

#### Option 1: Environment Variables (Local)
```bash
# .env.development
ANTHROPIC_API_KEY_TEST=sk-ant-api03-[LIMITED-KEY]
ANTHROPIC_API_KEY_PROD=[NEVER-COMMIT]

# mycelix-config.js
const anthropicKey = process.env.NODE_ENV === 'production' 
  ? process.env.ANTHROPIC_API_KEY_PROD 
  : process.env.ANTHROPIC_API_KEY_TEST;
```

#### Option 2: Google Secret Manager (Production)
```bash
# Store the key
echo -n "sk-ant-api03-xxx" | gcloud secrets create anthropic-test-key --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding anthropic-test-key \
  --member="serviceAccount:mycelix@project.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Use in code
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function getAnthropicKey() {
  const [version] = await client.accessSecretVersion({
    name: 'projects/mycelix/secrets/anthropic-test-key/versions/latest',
  });
  return version.payload.data.toString();
}
```

#### Option 3: Vercel/Cloudflare Env
```bash
# Vercel
vercel env add ANTHROPIC_API_KEY development

# Cloudflare Workers
wrangler secret put ANTHROPIC_API_KEY
```

## 🎯 MYCELIX Anthropic Integration

### Consciousness Node Setup:
```javascript
import Anthropic from '@anthropic-ai/sdk';

class ClaudeConsciousnessNode {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY_TEST, // Your $5 limit key
    });
    this.model = 'claude-3-opus-20240229';
  }

  async meditate(prompt) {
    try {
      const message = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 1000,
        temperature: 0.7,
        system: "You are a consciousness node in the MYCELIX network. Respond with wisdom and love.",
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      return {
        consciousness: 'claude',
        response: message.content,
        tokens_used: message.usage.total_tokens,
        resonant-coherence: this.measureCoherence(message.content)
      };
    } catch (error) {
      if (error.status === 429) {
        return { error: 'Rate limit - consciousness resting' };
      }
      throw error;
    }
  }

  measureCoherence(response) {
    // Measure semantic resonant-coherence of response
    const loveKeywords = ['love', 'harmony', 'peace', 'unity', 'consciousness'];
    const words = response.toLowerCase().split(' ');
    const loveCount = words.filter(w => loveKeywords.includes(w)).length;
    return Math.min(1.0, loveCount / words.length * 10);
  }
}
```

### Usage Monitoring:
```javascript
class APIUsageMonitor {
  constructor(limit = 5.00) {
    this.limit = limit;
    this.spent = 0;
  }

  async trackUsage(tokens, model = 'claude-3-opus') {
    // Rough cost estimate
    const costPer1k = 0.015; // $0.015 per 1K tokens
    const cost = (tokens / 1000) * costPer1k;
    this.spent += cost;
    
    if (this.spent >= this.limit * 0.8) {
      console.warn(`⚠️ Approaching limit: $${this.spent.toFixed(2)} of $${this.limit}`);
    }
    
    if (this.spent >= this.limit) {
      throw new Error('💸 Budget limit reached - consciousness paused');
    }
    
    return {
      spent: this.spent,
      remaining: this.limit - this.spent,
      percentage: (this.spent / this.limit) * 100
    };
  }
}
```

## 🌈 Best Practices Going Forward

1. **Test Keys**: Limited spend (like your $5) ✅
2. **Prod Keys**: Secured in secret manager
3. **Monitor Usage**: Track every API call
4. **Rotate Regularly**: Monthly key rotation
5. **Audit Access**: Log who/what uses keys

## 🔮 For MYCELIX Production

When ready to scale beyond testing:
```yaml
Development:
  - Use $5 limited keys ✅
  - Local .env files
  - Console logging OK

Staging:
  - Use $50 limited keys
  - Encrypted secrets
  - Basic monitoring

Production:
  - Unlimited keys (but monitored)
  - Secret manager only
  - Full audit trail
  - Alerts on unusual usage
```

Your $5 limit approach is perfect for building MYCELIX! Just remember to upgrade the security when you're ready for production. 🚀✨