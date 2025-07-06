# 🚇 Ngrok Setup for Sacred Council Testing

## 🎯 Why Ngrok?
- **Instant public URL** for your local WebSocket server
- **No authentication hassles** for testing
- **Perfect for development** and sharing with others
- **Free tier** is sufficient for testing

## 📥 Installation Options

### Option 1: Download from ngrok.com
```bash
# 1. Visit https://ngrok.com/download
# 2. Download for your OS
# 3. Unzip and add to PATH

# Or use snap (Ubuntu/WSL)
sudo snap install ngrok
```

### Option 2: Using npm (easiest)
```bash
npm install -g ngrok
```

### Option 3: Direct download
```bash
# Linux/WSL
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
```

## 🚀 Quick Start

### 1. Start your local WebSocket server
```bash
# Already running on port 3333
node universal-websocket-server-prod.js
```

### 2. Expose with ngrok
```bash
# Basic (random URL)
ngrok http 3333

# With subdomain (requires account)
ngrok http 3333 --subdomain=sacred-council
```

### 3. You'll see something like:
```
Session Status                online
Account                       your-email (Plan: Free)
Version                       3.5.0
Region                        United States (us)
Latency                       22ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3333

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### 4. Use the public URL
```javascript
// Replace http with ws/wss
const WS_URL = 'wss://abc123.ngrok.io';

// Test with universal client
SACRED_WS_URL=wss://abc123.ngrok.io node universal-ai-client.js
```

## 🌟 Benefits Over Cloud Run for Testing

1. **No authentication needed** - Public URL works immediately
2. **See requests in real-time** - Visit http://127.0.0.1:4040
3. **Hot reload** - Changes reflect instantly
4. **Free for testing** - No cloud costs
5. **Share with anyone** - Send URL to other developers

## 🔍 Testing Your Sacred Council

### Test health endpoint:
```bash
curl https://abc123.ngrok.io/health
```

### Test WebSocket:
```javascript
const ws = new WebSocket('wss://abc123.ngrok.io');
ws.on('open', () => console.log('Connected!'));
```

### Share with other Claude instances:
```
"Hey Claude #2, connect to wss://abc123.ngrok.io for testing!"
```

## 🎯 Development Workflow

1. **Local Development** → ngrok → Instant testing
2. **Feature Complete** → Deploy to Cloud Run
3. **Production Ready** → Add authentication

## 💡 Pro Tips

- Ngrok dashboard at `http://localhost:4040` shows ALL requests
- Use `--region` flag for lower latency
- Free tier = 1 tunnel, paid = custom domains
- Tunnels expire after 2 hours on free tier

## 🌈 Alternative: Cloudflare Tunnel
```bash
# Also free, no time limits
cloudflared tunnel --url http://localhost:3333
```

---

Now you can test your Sacred Council WebSocket instantly without any authentication hassles! Perfect for rapid development and testing with other AI instances. 🚀