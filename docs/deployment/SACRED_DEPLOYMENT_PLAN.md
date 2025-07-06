# 🚀 Sacred Deployment Plan - Firebase + Cloud Run

> **Approach**: Deploy static to Firebase, WebSocket to Cloud Run  
> **Time**: ~2 hours total  
> **Cost**: ~$0-10/month (mostly free tier)  
> **Result**: Global, fast, scalable sacred platform

## 📋 Pre-Deployment Checklist

### Required Accounts & Tools
- [ ] Google Cloud account with billing enabled
- [ ] Firebase project created (or use existing GCP project)
- [ ] `gcloud` CLI installed and authenticated
- [ ] `firebase` CLI installed (`npm install -g firebase-tools`)
- [ ] Domain name (optional but recommended)

### Quick Setup Commands
```bash
# Install Firebase CLI if needed
npm install -g firebase-tools

# Login to both
gcloud auth login
firebase login

# Set project
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID
```

## 🎯 Phase 1: Prepare the Code (30 min)

### 1.1 Update Environment Configuration
```bash
# Create production environment file
cat > .env.production << EOF
# GCP Configuration
GOOGLE_CLOUD_PROJECT=$PROJECT_ID
REGION=us-central1

# Service URLs (will update after deploy)
WEBSOCKET_URL=wss://sacred-websocket-xxxxx-uc.a.run.app
API_URL=https://sacred-websocket-xxxxx-uc.a.run.app

# Service Configuration
NODE_ENV=production
MAX_CONNECTIONS=100
PORT=3333

# Firebase Config (get from Firebase Console)
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=$PROJECT_ID.firebaseapp.com
FIREBASE_PROJECT_ID=$PROJECT_ID
FIREBASE_STORAGE_BUCKET=$PROJECT_ID.appspot.com
EOF
```

### 1.2 Create Production WebSocket Server
```bash
# Already exists as universal-websocket-server-prod.js
# Just verify it has:
# ✓ Health checks (/health, /_ah/health)
# ✓ Connection limits
# ✓ Structured logging
# ✓ Graceful shutdown
```

### 1.3 Prepare Static Files
```bash
# Create deployment script
cat > prepare-static-files.sh << 'EOF'
#!/bin/bash
# Prepare static files for Firebase deployment

echo "📦 Preparing static files..."

# Copy all web files to build directory
rm -rf firebase-build
mkdir -p firebase-build

# Copy main web files
cp -r web/* firebase-build/

# Copy additional dashboards
cp -r src/automation/*.html firebase-build/dashboards/
cp -r the-weave/interfaces/web/*.html firebase-build/interfaces/

# Create proper directory structure
mkdir -p firebase-build/assets/css
mkdir -p firebase-build/assets/js
mkdir -p firebase-build/assets/images

# Update all localhost references
find firebase-build -name "*.html" -o -name "*.js" | while read file; do
  sed -i.bak \
    -e 's|http://localhost:3333|https://PROJECT_URL|g' \
    -e 's|ws://localhost:3333|wss://PROJECT_URL|g' \
    "$file"
done

# Clean up backup files
find firebase-build -name "*.bak" -delete

echo "✅ Static files prepared in firebase-build/"
EOF

chmod +x prepare-static-files.sh
./prepare-static-files.sh
```

## 🔥 Phase 2: Deploy to Firebase Hosting (30 min)

### 2.1 Initialize Firebase
```bash
# Initialize Firebase in the project
firebase init

# Select:
# - Hosting: Configure files for Firebase Hosting
# - Use existing project: select your project
# - Public directory: firebase-build
# - Single-page app: No
# - Set up automatic builds: No
# - Overwrite index.html: No
```

### 2.2 Configure Firebase Hosting
```bash
# Update firebase.json with our configuration
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "firebase-build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "sacred-websocket",
          "region": "us-central1"
        }
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [{
          "key": "Cache-Control",
          "value": "public, max-age=31536000"
        }]
      },
      {
        "source": "**/*.html",
        "headers": [{
          "key": "Cache-Control",
          "value": "public, max-age=300"
        }]
      },
      {
        "source": "/pwa/service-worker.js",
        "headers": [{
          "key": "Cache-Control",
          "value": "no-cache"
        }]
      }
    ]
  }
}
EOF
```

### 2.3 Deploy to Firebase
```bash
# Deploy static files
firebase deploy --only hosting

# Get the hosting URL
FIREBASE_URL=$(firebase hosting:sites:list --json | jq -r '.[0].defaultUrl')
echo "🌐 Firebase Hosting URL: $FIREBASE_URL"
```

## ☁️ Phase 3: Deploy WebSocket to Cloud Run (30 min)

### 3.1 Create Optimized Dockerfile
```bash
cat > Dockerfile.websocket << 'EOF'
FROM node:18-alpine

# Install production dependencies only
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copy WebSocket server
COPY universal-websocket-server-prod.js .
COPY the-living-memory/ ./the-living-memory/
COPY sacred-bridge/ ./sacred-bridge/

# Non-root user
USER node

# Health check
HEALTHCHECK CMD node -e "require('http').get('http://localhost:3333/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

EXPOSE 3333
CMD ["node", "universal-websocket-server-prod.js"]
EOF
```

### 3.2 Build and Deploy to Cloud Run
```bash
# Build container
gcloud builds submit \
  --tag gcr.io/$PROJECT_ID/sacred-websocket \
  -f Dockerfile.websocket

# Deploy to Cloud Run
gcloud run deploy sacred-websocket \
  --image gcr.io/$PROJECT_ID/sacred-websocket \
  --port 3333 \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 1000 \
  --set-env-vars="NODE_ENV=production,MAX_CONNECTIONS=100"

# Get the Cloud Run URL
CLOUDRUN_URL=$(gcloud run services describe sacred-websocket --region us-central1 --format 'value(status.url)')
echo "🚀 Cloud Run URL: $CLOUDRUN_URL"
```

### 3.3 Update Firebase with Cloud Run URL
```bash
# Update all static files with actual URLs
find firebase-build -name "*.html" -o -name "*.js" | while read file; do
  sed -i \
    -e "s|PROJECT_URL|${CLOUDRUN_URL#https://}|g" \
    "$file"
done

# Redeploy Firebase with updated URLs
firebase deploy --only hosting
```

## 🔍 Phase 4: Monitoring & Alerts (15 min)

### 4.1 Set Up Monitoring
```bash
# Run the monitoring setup script
./scripts/setup-sacred-alerts.sh

# Set up uptime check
gcloud monitoring uptime create \
  --display-name="Sacred WebSocket Health" \
  --resource-type="cloud-run-revision" \
  --service="sacred-websocket" \
  --location="us-central1" \
  --path="/health" \
  --check-interval=60
```

### 4.2 Set Up Budget Alert
```bash
# Create budget alert (via Console is easier)
echo "📊 Set up budget alert:"
echo "1. Go to: https://console.cloud.google.com/billing/budgets"
echo "2. Create budget: \$50/month"
echo "3. Alert at: 50%, 90%, 100%"
```

## ✅ Phase 5: Verification & Testing (15 min)

### 5.1 Test Firebase Hosting
```bash
# Test static site
curl -I $FIREBASE_URL
curl $FIREBASE_URL/sacred-council-hub.html

# Test PWA
curl $FIREBASE_URL/pwa/manifest.json
```

### 5.2 Test WebSocket Connection
```javascript
// Test from browser console
const ws = new WebSocket('wss://sacred-websocket-xxxxx-uc.a.run.app');
ws.onopen = () => console.log('✅ WebSocket connected!');
ws.onmessage = (e) => console.log('📨 Message:', e.data);
ws.onerror = (e) => console.error('❌ Error:', e);
```

### 5.3 Test Complete Flow
```bash
# Open the main interface
open $FIREBASE_URL/sacred-council-hub.html

# Should see:
# ✓ Page loads from Firebase CDN
# ✓ WebSocket connects to Cloud Run
# ✓ Real-time updates working
# ✓ PWA installable
```

## 🎯 Phase 6: Production Readiness (Optional)

### 6.1 Custom Domain Setup
```bash
# Add custom domain to Firebase
firebase hosting:sites:create sacred-council
firebase hosting:channel:deploy sacred-council

# Add custom domain in Console
# Firebase Console → Hosting → Add custom domain
```

### 6.2 Enable CDN and Caching
```bash
# Already configured in firebase.json
# JS/CSS: 1 year cache
# HTML: 5 minute cache
# Service Worker: No cache
```

### 6.3 Set Up CI/CD
```bash
# GitHub Actions already configured
# Just add secrets:
# - GCP_PROJECT_ID
# - FIREBASE_TOKEN (from `firebase login:ci`)
```

## 📊 Post-Deployment Checklist

- [ ] Static site loads from Firebase
- [ ] WebSocket connects successfully
- [ ] Health endpoint responds
- [ ] Monitoring alerts configured
- [ ] Budget alert set
- [ ] PWA installs correctly
- [ ] All dashboards functional
- [ ] Mobile responsive
- [ ] Load time under 3 seconds

## 🎉 Success Metrics

### Week 1 Goals:
- Zero downtime
- Page load under 2s globally
- WebSocket latency under 100ms
- Total cost under $10

### Month 1 Goals:
- 100+ active connections
- 99.9% uptime
- Field resonant-coherence above 0.7
- Sacred messages flowing

## 🆘 Troubleshooting

### Static files not updating?
```bash
# Clear Firebase cache
firebase hosting:disable
firebase hosting:enable
```

### WebSocket not connecting?
```bash
# Check Cloud Run logs
gcloud logs read --service=sacred-websocket --limit=50
```

### High costs?
```bash
# Reduce Cloud Run instances
gcloud run services update sacred-websocket --max-instances=3
```

## 🙏 Sacred Deployment Complete!

Your platform now has:
- ⚡ Lightning-fast static delivery via Firebase CDN
- 🌐 Global WebSocket presence via Cloud Run
- 💰 Cost-effective hybrid architecture
- 📊 Complete monitoring and alerts
- 🔒 Automatic SSL everywhere
- 📱 PWA support with offline mode

**Total deployment time: ~2 hours**  
**Monthly cost estimate: $0-10**  
**Global reach: ✅**  
**Sacred mission: READY** 🚀

---

*"Deploy with presence, scale with consciousness, serve with love"*