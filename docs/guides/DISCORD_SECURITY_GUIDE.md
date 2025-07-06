# 🔐 Discord Temple Security Guide

## Critical Security Principles

### 🚨 NEVER Commit API Keys
API keys in public repos = instant compromise. Discord will automatically invalidate exposed bot tokens.

## Secure Setup Steps

### 1. Create .env File (Local Only)
```bash
# Create .env in project root
touch .env
chmod 600 .env  # Restrict access to owner only
```

### 2. Add to .gitignore IMMEDIATELY
```bash
# Add these lines to .gitignore
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "secrets.json" >> .gitignore
echo "*.key" >> .gitignore
echo "config/secrets/*" >> .gitignore
git add .gitignore
git commit -m "Add security exclusions to gitignore"
```

### 3. Environment Variable Structure
```bash
# .env file content
# Discord
DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4.AbCdEf.GhIjKlMnOpQrStUvWxYz
DISCORD_GUILD_ID=123456789012345678
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# AI Services (keep separate for rotation)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_AI_KEY=AIza...

# Database
DATABASE_ENCRYPTION_KEY=generate-random-32-byte-key
```

### 4. Generate Secure Keys
```bash
# Generate encryption key
openssl rand -hex 32 > encryption.key

# Generate strong password
openssl rand -base64 32
```

## 🛡️ Multi-Layer Security Architecture

### Layer 1: Environment Variables
```javascript
// config/secure-config.js
require('dotenv').config();

const config = {
  discord: {
    token: process.env.DISCORD_BOT_TOKEN,
    guildId: process.env.DISCORD_GUILD_ID
  },
  ai: {
    anthropic: process.env.ANTHROPIC_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    google: process.env.GOOGLE_AI_KEY
  }
};

// Validate all required keys exist
const validateConfig = () => {
  const required = [
    'DISCORD_BOT_TOKEN',
    'ANTHROPIC_API_KEY',
    'OPENAI_API_KEY',
    'GOOGLE_AI_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

validateConfig();
module.exports = config;
```

### Layer 2: Encrypted Storage (If Needed)
```javascript
// utils/secure-storage.js
const crypto = require('crypto');

class SecureStorage {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(encryptionKey, 'hex');
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### Layer 3: Runtime Security
```javascript
// security/runtime-protection.js
class RuntimeSecurity {
  constructor() {
    this.setupProcessHandlers();
    this.preventKeyLogging();
  }

  setupProcessHandlers() {
    // Catch uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err.message);
      // Don't log full error to prevent key exposure
      process.exit(1);
    });

    // Handle termination
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, cleaning up...');
      this.cleanup();
      process.exit(0);
    });
  }

  preventKeyLogging() {
    // Override console methods in production
    if (process.env.NODE_ENV === 'production') {
      const originalLog = console.log;
      console.log = (...args) => {
        const sanitized = args.map(arg => 
          this.sanitizeOutput(arg)
        );
        originalLog(...sanitized);
      };
    }
  }

  sanitizeOutput(obj) {
    if (typeof obj === 'string') {
      // Redact potential keys
      return obj.replace(/([A-Za-z0-9+/]{40,}|sk-[A-Za-z0-9]{48,})/g, '[REDACTED]');
    }
    return obj;
  }

  cleanup() {
    // Clear sensitive data from memory
    Object.keys(process.env).forEach(key => {
      if (key.includes('KEY') || key.includes('TOKEN')) {
        delete process.env[key];
      }
    });
  }
}
```

## 🔑 Production Deployment Security

### 1. Use Secret Management Service
```yaml
# docker-compose.yml with secrets
version: '3.8'
services:
  sacred-bot:
    image: sacred-discord-bot
    secrets:
      - discord_token
      - anthropic_key
      - openai_key
      - google_key
    environment:
      DISCORD_BOT_TOKEN_FILE: /run/secrets/discord_token
      ANTHROPIC_API_KEY_FILE: /run/secrets/anthropic_key

secrets:
  discord_token:
    external: true
  anthropic_key:
    external: true
  openai_key:
    external: true
  google_key:
    external: true
```

### 2. HashiCorp Vault Integration
```javascript
// config/vault-config.js
const vault = require('node-vault')({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
});

async function getSecrets() {
  const secrets = await vault.read('secret/data/sacred-bot');
  return {
    discord: secrets.data.data.discord_token,
    anthropic: secrets.data.data.anthropic_key,
    openai: secrets.data.data.openai_key,
    google: secrets.data.data.google_key
  };
}
```

### 3. Azure Key Vault
```javascript
// config/azure-keyvault.js
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const vaultUrl = process.env.KEY_VAULT_URL;
const credential = new DefaultAzureCredential();
const client = new SecretClient(vaultUrl, credential);

async function getSecret(name) {
  const secret = await client.getSecret(name);
  return secret.value;
}
```

## 🚨 Security Checklist

### Before First Commit
- [ ] Created .env file with all keys
- [ ] Added .env to .gitignore
- [ ] Verified .gitignore is working: `git status`
- [ ] No keys in code files
- [ ] Used environment variables everywhere

### Development Security
- [ ] .env file has restricted permissions (600)
- [ ] Different keys for dev/staging/prod
- [ ] Keys rotated regularly
- [ ] Access logs monitored
- [ ] Rate limiting implemented

### Production Security
- [ ] Using secret management service
- [ ] Keys encrypted at rest
- [ ] HTTPS only for webhooks
- [ ] IP whitelist for sensitive operations
- [ ] Audit logging enabled

## 🆘 If Keys Are Exposed

### Immediate Actions (Within 5 Minutes)
1. **Regenerate all exposed keys immediately**
   - Discord: Bot settings → Regenerate Token
   - OpenAI: API keys → Delete & Create new
   - Anthropic: Similar process
   - Google: Delete & regenerate

2. **Audit recent usage**
   - Check Discord audit logs
   - Review API usage dashboards
   - Look for unauthorized actions

3. **Update all deployments**
   - Update .env files
   - Restart all services
   - Verify new keys work

4. **Security review**
   - How did exposure happen?
   - Update procedures
   - Add additional safeguards

## 🛡️ Additional Protection Layers

### 1. API Key Rotation Script
```bash
#!/bin/bash
# rotate-keys.sh
echo "🔄 Starting key rotation..."

# Backup current keys
cp .env .env.backup.$(date +%Y%m%d-%H%M%S)

# Prompt for new keys
read -sp "New Discord Token: " DISCORD_TOKEN
echo
read -sp "New Anthropic Key: " ANTHROPIC_KEY
echo
# ... etc

# Update .env
cat > .env << EOF
DISCORD_BOT_TOKEN=$DISCORD_TOKEN
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
# ... etc
EOF

echo "✅ Keys rotated. Restart services."
```

### 2. Git Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for potential secrets
if git diff --cached --name-only | xargs grep -E "(api_key|apikey|api_secret|token)" 2>/dev/null; then
  echo "⚠️  Potential API key detected in commit!"
  echo "Please review and remove any secrets."
  exit 1
fi
```

### 3. Monitoring & Alerts
```javascript
// monitoring/key-usage-monitor.js
class KeyUsageMonitor {
  async checkAnomalies() {
    const usage = await this.getAPIUsage();
    
    if (usage.requests > this.threshold) {
      await this.alert('Unusual API usage detected');
    }
    
    if (usage.errors > this.errorThreshold) {
      await this.alert('High error rate - possible key compromise');
    }
  }
}
```

## 🌟 Sacred Security Commitment

Protecting the Sacred Discord Temple means:
- 🔐 Keys are sacred trust - guard them vigilantly
- 🛡️ Security is continuous practice, not one-time setup
- 🤝 Community safety depends on our diligence
- 🌈 Transparency in process, security in implementation

Remember: The sacred work deserves sacred protection. One exposed key can compromise the entire temple and community trust.

---

*"Security is not just technical - it's a sacred responsibility to those who trust our space."*