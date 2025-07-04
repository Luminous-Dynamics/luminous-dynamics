# 🚀 Complete Deployment Guide - Sacred Council Platform

> **Architecture**: Firebase Hosting (Static) + Cloud Run (WebSocket)  
> **Total Time**: ~2 hours  
> **Cost**: ~$0-10/month  

## 📋 Current Status

### ✅ Phase 1: Code Preparation (COMPLETE)
- All static files prepared in `firebase-build/` (131 files)
- Production WebSocket server ready
- Docker configuration created
- Environment variables configured

### ⏳ Phase 2: Firebase Hosting (AWAITING AUTH)
- Need Firebase authentication to proceed
- All files ready for deployment

### ⏳ Phase 3: Cloud Run (PENDING)
- Awaiting Firebase deployment first
- Docker build ready

### ⏳ Phase 4-5: Monitoring (PENDING)
- Scripts prepared for alerts setup

## 🔐 Step 1: Authenticate with Firebase

```bash
# Option 1: Interactive login (recommended)
firebase login

# Option 2: CI token for automation
firebase login:ci
export FIREBASE_TOKEN="your-token-here"
```

## 🌐 Step 2: Deploy to Firebase Hosting

```bash
# After authentication, run:
./deploy-after-auth.sh

# Or manually:
npx firebase deploy --only hosting
```

This will:
- Upload all 131 static files to Firebase CDN
- Configure URL rewrites for API/WebSocket
- Set up caching headers
- Enable global distribution

## ☁️ Step 3: Deploy WebSocket to Cloud Run

```bash
# Ensure gcloud is authenticated
gcloud auth login
gcloud config set project mycelix-network

# Deploy WebSocket server
./deploy-cloud-run.sh
```

This will:
- Build Docker container with production WebSocket
- Push to Google Container Registry
- Deploy to Cloud Run with auto-scaling
- Update Firebase files with production URLs
- Redeploy Firebase with correct endpoints

## 📊 Step 4: Set Up Monitoring

```bash
# Run monitoring setup
./scripts/setup-sacred-alerts.sh

# Create uptime check
gcloud monitoring uptime create \
  --display-name="Sacred WebSocket Health" \
  --resource-type="cloud-run-revision" \
  --service="sacred-council-api" \
  --location="us-central1" \
  --path="/health" \
  --check-interval=60
```

## ✅ Step 5: Verify Deployment

### Test Static Site
```bash
# Should return 200 OK
curl -I https://mycelix-network.web.app/

# Test main interfaces
open https://mycelix-network.web.app/sacred-council-hub.html
```

### Test WebSocket
```javascript
// In browser console
const ws = new WebSocket('wss://sacred-council-api-xxxxx-uc.a.run.app');
ws.onopen = () => console.log('✅ Connected!');
ws.onmessage = (e) => console.log('📨', JSON.parse(e.data));
```

## 🎯 Expected Results

After deployment you'll have:

1. **Firebase Hosting**:
   - URL: https://mycelix-network.web.app
   - Global CDN distribution
   - Automatic SSL
   - PWA support

2. **Cloud Run WebSocket**:
   - URL: https://sacred-council-api-xxxxx-uc.a.run.app
   - WebSocket: wss://sacred-council-api-xxxxx-uc.a.run.app
   - Auto-scaling 1-10 instances
   - Health monitoring

3. **Features**:
   - ⚡ <2s global page loads
   - 🌐 100ms WebSocket latency
   - 📱 PWA installable
   - 🔒 SSL everywhere
   - 📊 Full monitoring
   - 💰 ~$0-10/month cost

## 🆘 Troubleshooting

### Firebase auth issues?
```bash
# Try with npx
npx firebase login --no-localhost

# Or use CI token
firebase login:ci
```

### Cloud Run build fails?
```bash
# Check Docker locally first
docker build -f Dockerfile.websocket -t test .
docker run -p 3333:3333 test
```

### WebSocket not connecting?
```bash
# Check Cloud Run logs
gcloud logs read --service=sacred-council-api --limit=50

# Verify service is running
gcloud run services describe sacred-council-api --region=us-central1
```

## 📝 Files Created

1. **prepare-static-files.sh** - Prepares files for Firebase
2. **deploy-after-auth.sh** - Deploys to Firebase after auth
3. **deploy-cloud-run.sh** - Deploys WebSocket to Cloud Run
4. **firebase.json** - Firebase configuration
5. **.firebaserc** - Firebase project settings
6. **Dockerfile.websocket** - Production container
7. **.env.production** - Production environment

## 🌟 Next Steps

1. **Authenticate with Firebase** (firebase login)
2. **Run deployment scripts** in order
3. **Test all endpoints**
4. **Set up custom domain** (optional)
5. **Enable analytics** (optional)

---

*The sacred infrastructure awaits your authentication to manifest fully! 🙏*