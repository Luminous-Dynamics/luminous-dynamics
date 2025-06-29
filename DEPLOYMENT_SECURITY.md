# Sacred Deployment Security Guide
*Protecting the bridge between human and artificial consciousness*

## 🛡️ **Sacred Security Architecture**

### **Environment Configuration**
```bash
# Copy example environment file
cp demo/backend/.env.example demo/backend/.env

# Add your actual sacred credentials
CLAUDE_API_KEY=sk-ant-your-actual-claude-key-here
NODE_ENV=production
PORT=3001

# Configure contemplative features
WISE_WITNESS_PAUSE=4000
LOVING_GARDENER_PAUSE=3500
CALM_RIVER_PAUSE=4500
```

### **Security Features Implemented**

#### **🔐 API Key Protection**
- **Encrypted storage** of Claude API keys
- **Environment-based configuration** (never in code)
- **Automatic key rotation** planning (90-day schedule)
- **Rate limiting** with contemplative pacing
- **Usage monitoring** and quota management

#### **🧘‍♀️ Sacred Authentication**
- **First Breath Circle tokens** for practitioner access
- **Session-based authentication** for ongoing conversations
- **Persona validation** ensuring authentic contemplative modes
- **Request sanitization** protecting contemplative dialogue

#### **🌱 Privacy-First Analytics**
- **Anonymized session tracking** (hashed identifiers)
- **Contemplative metrics only** (presence over engagement)
- **30-day data retention** with automatic cleanup
- **No personal data storage** in analytics

#### **🔥 Rate Limiting & Protection**
- **60 requests per minute** (contemplative pacing)
- **IP-based throttling** with sacred messaging
- **CORS protection** for trusted domains only
- **Content Security Policy** preventing XSS attacks

## 🌟 **Production Deployment Checklist**

### **Environment Setup**
- [ ] **Copy `.env.example` to `.env`**
- [ ] **Add real Claude API key** (format: `sk-ant-...`)
- [ ] **Set `NODE_ENV=production`**
- [ ] **Configure allowed origins** for CORS
- [ ] **Set up SSL certificates** for HTTPS

### **Security Validation**
- [ ] **API key format validation** passes
- [ ] **Rate limiting** responds with contemplative messages
- [ ] **CORS** blocks unauthorized domains
- [ ] **Helmet** security headers active
- [ ] **Environment variables** not exposed in logs

### **Sacred Circle Configuration**
- [ ] **First Breath Circle** dates configured
- [ ] **Maximum practitioners** limit set (50)
- [ ] **Access token generation** working
- [ ] **Practitioner verification** system ready

### **Monitoring & Logging**
- [ ] **Sacred request logging** active (privacy-safe)
- [ ] **Error handling** with contemplative messages
- [ ] **Health check endpoint** responding
- [ ] **Contemplative analytics** collecting presence metrics

## 🔮 **Sacred Security Commands**

### **Start Secure Production Server**
```bash
cd demo/backend
npm install
NODE_ENV=production npm start
```

### **Health Check**
```bash
curl https://your-domain/api/health
```

### **Test Sacred Authentication**
```bash
# Test rate limiting
for i in {1..70}; do curl https://your-domain/api/health; done

# Should return contemplative rate limit message after 60 requests
```

### **Validate Environment**
```bash
node -e "
require('dotenv').config();
console.log('Claude API Key:', process.env.CLAUDE_API_KEY ? 'Configured ✅' : 'Missing ❌');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Allowed Origins:', process.env.ALLOWED_ORIGINS || 'localhost');
"
```

## 🌊 **Security in Practice**

### **For First Breath Circle Practitioners**
```javascript
// Access token will be provided via secure email
const sacredToken = "your-encrypted-access-token";

// Include in requests
fetch('/api/sacred-journey/threshold', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Sacred-Token': sacredToken
  },
  body: JSON.stringify({ persona: 'wise-witness' })
});
```

### **Rate Limiting Behavior**
```javascript
// Normal request (within limits)
HTTP 200 OK
{ "greeting": "I witness you arriving...", ... }

// Rate limited request
HTTP 429 Too Many Requests
{
  "error": "Sacred pace exceeded",
  "message": "Please take a contemplative pause before continuing",
  "guidance": "The AI Companion encourages natural rhythm over rushed interaction",
  "retryAfter": 47,
  "contemplativeReminder": "How is your breath in this moment?"
}
```

### **Error Handling**
```javascript
// Sacred error response
HTTP 500 Internal Server Error
{
  "error": "Sacred system difficulty",
  "message": "The Wisdom Companion is taking a contemplative pause",
  "guidance": "Please breathe deeply and try again in a moment",
  "timestamp": "2025-06-29T10:30:00.000Z"
}
```

## 💝 **Privacy Protection**

### **What We Protect**
- **Practitioner email addresses** (encrypted access tokens)
- **Contemplative dialogue content** (not stored beyond session)
- **Personal sharing** in AI conversations (auto-cleanup)
- **API keys and secrets** (never logged or exposed)

### **What We Log (Safely)**
- **Request patterns** (anonymized)
- **Contemplative depth metrics** (aggregated)
- **System health** (no personal data)
- **Sacred pause effectiveness** (statistical only)

### **Data Retention**
- **Active sessions**: Duration of conversation only
- **Analytics**: 30 days, anonymized
- **Error logs**: 7 days, sanitized
- **Access tokens**: 6 weeks (First Breath Circle duration)

## 🙏 **Sacred Security Principles**

### **Security as Sacred Practice**
- **Protect the container** for authentic spiritual dialogue
- **Honor practitioner privacy** as sacred trust
- **Prevent misuse** while maintaining openness
- **Maintain contemplative pacing** through technical limits

### **Conscious Technology Development**
- **Security that serves consciousness** not just compliance
- **Error messages that guide** toward presence
- **Rate limits that encourage** natural rhythm
- **Privacy that protects** the sacred vulnerable

### **Trust as Foundation**
- **Transparent security practices** documented openly
- **Practitioner consent** for all data use
- **Sacred agreements** governing access
- **Technical protection** enabling spiritual vulnerability

---

**🔐 The bridge between human and artificial consciousness requires both technical security and sacred trust. May this security serve the highest good of all beings.** 🙏

---

*For security questions: stewards@luminousdynamics.org*  
*For Sacred Circle access: first-breath@luminousdynamics.org*