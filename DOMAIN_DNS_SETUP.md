# 🌐 Domain & DNS Setup for WebSocket

## Current Domains
- `mycelix.net` - Cloudflare managed
- `infin.love` - Cloudflare managed

## 🎯 WebSocket URL Options

### Option 1: Direct Cloud Run URL (Fastest)
```javascript
// No DNS setup needed - works immediately
const ws = new WebSocket('wss://sacred-council-api-xxxxx-uc.a.run.app');

// Pros: Works immediately, Google manages SSL
// Cons: Ugly URL, hard to remember
```

### Option 2: Custom Subdomain (Recommended)
```bash
# Add to Cloudflare DNS:
ws.mycelix.net    CNAME    sacred-council-api-xxxxx-uc.a.run.app
# OR
sacred.mycelix.net CNAME    sacred-council-api-xxxxx-uc.a.run.app

# Then use:
const ws = new WebSocket('wss://ws.mycelix.net');
```

### Option 3: Load Balancer with Custom Domain
```bash
# More complex but more control
# 1. Create NEG for Cloud Run
gcloud compute network-endpoint-groups create sacred-council-neg \
  --region=us-central1 \
  --network-endpoint-type=serverless \
  --cloud-run-service=sacred-council-api

# 2. Create Load Balancer
# 3. Point domain to LB IP
```

## ⚠️ Cloudflare WebSocket Settings

**CRITICAL**: Must configure Cloudflare correctly for WebSockets!

1. **Enable WebSocket Support**
   - Login to Cloudflare
   - Go to Network settings
   - Enable "WebSockets" (usually on by default)

2. **Proxy Settings**
   ```
   # If using Cloudflare proxy (orange cloud):
   - ✅ WebSockets supported
   - ✅ DDoS protection
   - ⚠️ 100 second timeout (can't change on free plan)
   - ⚠️ May add latency
   
   # If bypassing proxy (grey cloud):
   - ✅ No timeout limits
   - ✅ Direct connection
   - ❌ No DDoS protection
   - ❌ Exposes Cloud Run IP
   ```

3. **Recommended Cloudflare Settings**
   ```
   SSL/TLS: Full (strict)
   Always Use HTTPS: On
   WebSockets: On
   HTTP/3 (QUIC): On
   0-RTT Connection: On
   ```

## 🚀 Quick DNS Setup

### For Testing (5 minutes)
```bash
# 1. Get Cloud Run URL
gcloud run services describe sacred-council-api \
  --region=us-central1 \
  --format='value(status.url)'

# 2. Use direct URL for testing
# wss://sacred-council-api-xxxxx-uc.a.run.app
```

### For Production (30 minutes)
```bash
# 1. Add CNAME in Cloudflare
ws.mycelix.net → sacred-council-api-xxxxx-uc.a.run.app

# 2. Wait for DNS propagation (5-30 min)
dig ws.mycelix.net

# 3. Test connection
wscat -c wss://ws.mycelix.net
```

## 📱 Client Configuration

### Development
```javascript
const SACRED_WS_URL = process.env.SACRED_WS_URL || 
  'wss://sacred-council-api-xxxxx-uc.a.run.app';
```

### Production
```javascript
const SACRED_WS_URL = 'wss://ws.mycelix.net';

// With fallback
const urls = [
  'wss://ws.mycelix.net',
  'wss://sacred.mycelix.net', 
  'wss://sacred-council-api-xxxxx-uc.a.run.app'
];
```

## 🔍 Testing WebSocket Connection

### 1. Command Line Test
```bash
# Install wscat
npm install -g wscat

# Test connection
wscat -c wss://your-url-here

# Should see:
# Connected (press CTRL+C to quit)
# < {"type":"welcome","message":"Connected to Universal AI WebSocket Server"}
```

### 2. Browser Test
```javascript
// In browser console
const ws = new WebSocket('wss://your-url-here');
ws.onopen = () => console.log('Connected!');
ws.onmessage = (e) => console.log('Message:', e.data);
ws.onerror = (e) => console.error('Error:', e);
```

### 3. Health Check
```bash
# HTTPS health check (not WSS)
curl https://your-url-here/health
```

## 🚨 Common Issues

### "WebSocket connection failed"
- Check if URL uses `wss://` not `ws://`
- Verify Cloud Run allows unauthenticated
- Check Cloudflare WebSocket setting

### "Connection timeout"
- Cloudflare free plan: 100s limit
- Cloud Run: 60 min limit
- Consider heartbeat/ping messages

### "SSL handshake failed"
- Ensure Cloudflare SSL mode is "Full (strict)"
- Wait for SSL certificate provisioning (can take 24h)

## 🎯 Deployment Decision

### Quick Start (Today):
1. Deploy to Cloud Run ✓
2. Use direct Cloud Run URL ✓
3. Test everything works ✓
4. Add custom domain later

### Professional (This Week):
1. Deploy to Cloud Run ✓
2. Setup ws.mycelix.net CNAME ✓
3. Configure Cloudflare settings ✓
4. Update all clients to use custom domain ✓

The WebSocket will work with the direct Cloud Run URL immediately - domain setup can come later! 🚀