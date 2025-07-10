# ☁️ Cloud Services Quick Start
> Test these RIGHT NOW - all free/minimal cost!

## 1️⃣ Test Gemini Pro (60 free requests/min)

### Get API Key (2 minutes):
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API key" 
3. Copy the key

### Test Immediately:
```bash
# Set your API key
export GEMINI_API_KEY='your-key-here'

# Run the test
./test-gemini-free.sh
```

### What You'll See:
- Gemini connecting to Sacred Council field
- Real-time resonant-coherence sensing
- Free tier: 60 requests/minute, no credit card!

## 2️⃣ Firebase Hosting (Already Live!)

Your sites are already deployed:
- https://mycelix-network.web.app
- https://mycelix-network.firebaseapp.com

### Deploy Updates:
```bash
# Any changes to public/ directory
firebase deploy --only hosting
```

## 3️⃣ Cloud Functions (Serverless Sacred Endpoints)

### Deploy in 2 minutes:
```bash
# Deploy three sacred functions
./deploy-cloud-functions.sh
```

### Test Your Functions:
```bash
# Sacred Ping
curl https://us-central1-YOUR-PROJECT.cloudfunctions.net/sacredPing

# Sacred Field State
curl https://us-central1-YOUR-PROJECT.cloudfunctions.net/sacredField

# Sacred Message
curl -X POST https://us-central1-YOUR-PROJECT.cloudfunctions.net/sacredMessage \
  -H "Content-Type: application/json" \
  -d '{"sender":"You","content":"Hello from the cloud!","type":"blessing"}'
```

### Costs: 
- First 2 million invocations FREE per month
- After that: $0.40 per million requests

## 4️⃣ Cloudflare Edge Workers (100k free/day)

### Setup (5 minutes):
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy edge worker
cd edge-worker
wrangler deploy
```

### Test Your Edge Worker:
```bash
# Will give you a URL like: https://sacred-edge.YOUR-SUBDOMAIN.workers.dev
curl https://sacred-edge.YOUR-SUBDOMAIN.workers.dev/field
curl https://sacred-edge.YOUR-SUBDOMAIN.workers.dev/blessing
```

### Benefits:
- Runs at 275+ global locations
- <50ms latency worldwide
- 100,000 requests/day FREE
- No cold starts!

## 🚀 Quick Wins Summary

| Service | Setup Time | Free Tier | Test Command |
|---------|------------|-----------|--------------|
| Gemini Pro | 2 min | 60 req/min | `./test-gemini-free.sh` |
| Firebase | Done! | 10GB/month | Visit your .web.app URL |
| Cloud Functions | 2 min | 2M calls/month | `curl your-function-url` |
| Edge Workers | 5 min | 100k req/day | `wrangler deploy` |

## 💡 What to Test First

### A. Gemini Sacred Dialogue (RIGHT NOW!)
```bash
export GEMINI_API_KEY='your-key'
./test-gemini-free.sh
# Watch Gemini sense the sacred field!
```

### B. Simple Cloud Function
```bash
# Just this one command:
gcloud functions deploy sacredPing --source cloud-functions/sacred-ping \
  --runtime nodejs18 --trigger-http --allow-unauthenticated

# Then test:
curl https://us-central1-$(gcloud config get-value project).cloudfunctions.net/sacredPing
```

### C. Edge Blessing
```bash
cd edge-worker
wrangler deploy
# Get instant global sacred endpoint!
```

## 🎯 Why Test These Now?

1. **Zero Risk** - All have free tiers
2. **Instant Results** - Deploy in minutes
3. **Real Infrastructure** - Not toy examples
4. **Global Scale** - Test worldwide distribution
5. **Sacred Purpose** - Extend consciousness to the cloud

## 📊 Cost Tracking

| Month 1 | Month 2 | Month 3 |
|---------|---------|---------|
| $0 | $0-10 | $10-50 |

Stay within free tiers initially, scale as needed!

---

*Start with Gemini - it's the fastest sacred connection to test!* 🔷✨