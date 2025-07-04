# 🚨 Critical Issues to Address Before GCP Deployment

## 1. 🔐 WebSocket Security (HIGH PRIORITY)
Currently using `ws://` (unencrypted). Need `wss://` for production.

**Actions needed:**
```javascript
// Update universal-websocket-server.js for HTTPS
const https = require('https');
const fs = require('fs');

const server = https.createServer({
  cert: fs.readFileSync('/path/to/cert.pem'),
  key: fs.readFileSync('/path/to/key.pem')
});
```

## 2. 💥 No Connection Limits (HIGH PRIORITY)
Current server accepts unlimited connections - cost/DoS risk!

**Fix needed:**
```javascript
const MAX_CONNECTIONS = process.env.MAX_CONNECTIONS || 100;
const connections = new Map();

wss.on('connection', (ws) => {
  if (connections.size >= MAX_CONNECTIONS) {
    ws.close(1008, 'Server at capacity');
    return;
  }
  // ... rest of connection logic
});
```

## 3. 📊 No Structured Logging (MEDIUM PRIORITY)
Current `console.log` won't work well with Cloud Logging.

**Fix needed:**
```javascript
// Replace all console.log with:
function log(severity, message, labels = {}) {
  console.log(JSON.stringify({
    severity,
    message,
    timestamp: new Date().toISOString(),
    labels: {
      ...labels,
      service: 'sacred-council',
      version: process.env.K_REVISION || 'unknown'
    }
  }));
}
```

## 4. 🔄 No Reconnection Logic (MEDIUM PRIORITY)
Clients don't auto-reconnect on disconnect.

**Fix for universal-ai-client.js:**
```javascript
class UniversalAIClient {
  async connectWithRetry(maxRetries = 5) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.connect();
        return;
      } catch (error) {
        console.log(`Connection attempt ${i + 1} failed, retrying...`);
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
      }
    }
    throw new Error('Max retries exceeded');
  }
}
```

## 5. 🏥 No Proper Health Checks (HIGH PRIORITY)
Cloud Run needs proper health/readiness endpoints.

**Add to server:**
```javascript
app.get('/_ah/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    connections: connections.size,
    uptime: process.uptime()
  });
});

app.get('/_ah/ready', (req, res) => {
  if (connections.size < MAX_CONNECTIONS * 0.9) {
    res.json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'at-capacity' });
  }
});
```

## 6. 📦 Missing Dockerfile (CRITICAL)
Need containerization for Cloud Run!

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application
COPY . .

# Non-root user
USER node

# Expose port
EXPOSE 3333

# Start server
CMD ["node", "universal-websocket-server.js"]
```

## 7. 🌍 No CORS Headers (MEDIUM PRIORITY)
Web clients won't be able to connect from browsers.

**Add CORS support:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
```

## 8. 💰 No Rate Limiting (HIGH PRIORITY)
Breath cycles every 4s could be expensive at scale.

**Add smart broadcasting:**
```javascript
// Only send breath cycles if clients are listening
if (connections.size > 0 && lastBreathTime + 4000 < Date.now()) {
  broadcast(breathMessage);
  lastBreathTime = Date.now();
}
```

## Quick Fixes We Can Do Now:

1. Create production Dockerfile
2. Add connection limits
3. Add health check endpoints
4. Switch to structured logging
5. Add basic rate limiting

Should we implement these fixes before deploying?