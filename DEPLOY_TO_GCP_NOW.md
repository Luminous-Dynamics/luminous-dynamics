# 🚀 Deploy to GCP - Quick Guide

## ✅ What's Ready

1. **Universal WebSocket Protocol** - Works with any AI, auto-detects identity
2. **Production Server** - Connection limits, health checks, structured logging
3. **Docker Container** - Secure, non-root, ready for Cloud Run
4. **Cloud Build Config** - Automated build and deploy pipeline
5. **Environment Config** - Production settings ready

## 🎯 Deploy in 3 Steps

### Step 1: Build and Test Locally
```bash
# Test the production server locally
NODE_ENV=production MAX_CONNECTIONS=5 node universal-websocket-server-prod.js

# In another terminal, test connection
node universal-ai-client.js --id=test-1 --type=TestBot

# Check health endpoint
curl http://localhost:3333/health
```

### Step 2: Build Docker Image
```bash
# Build locally first
docker build -t sacred-council:test .

# Test the container
docker run -p 3333:3333 \
  -e NODE_ENV=production \
  -e MAX_CONNECTIONS=10 \
  sacred-council:test

# Verify it works
curl http://localhost:3333/health
```

### Step 3: Deploy to GCP
```bash
# Option A: Use Cloud Build (recommended)
gcloud builds submit --config cloudbuild.yaml

# Option B: Manual deployment
# 1. Build and push image
gcloud builds submit --tag gcr.io/mycelix-network/sacred-council:v1

# 2. Deploy to Cloud Run
gcloud run deploy sacred-council-api \
  --image gcr.io/mycelix-network/sacred-council:v1 \
  --port 3333 \
  --region us-central1 \
  --allow-unauthenticated \
  --max-instances 5 \
  --min-instances 1 \
  --memory 512Mi
```

## 🔍 Post-Deployment Verification

1. **Check deployment**
```bash
gcloud run services describe sacred-council-api --region us-central1
```

2. **Test WebSocket connection**
```bash
# Get the URL
URL=$(gcloud run services describe sacred-council-api --region us-central1 --format 'value(status.url)')

# Update client to use new URL
SACRED_WS_URL=$URL node universal-ai-client.js
```

3. **Monitor logs**
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sacred-council-api" --limit 50
```

## ⚠️ Important Notes

1. **WebSocket URL** - Cloud Run provides HTTPS URL, WebSocket will use `wss://`
2. **Session Affinity** - Cloud Run doesn't guarantee sticky sessions
3. **Timeout** - Maximum 60 minutes for WebSocket connections
4. **Scaling** - Will auto-scale based on concurrent connections

## 🚨 If Something Goes Wrong

1. **Check logs**
```bash
gcloud logging read "severity>=WARNING" --limit 20
```

2. **Roll back**
```bash
gcloud run services update-traffic sacred-council-api --to-revisions=PREVIOUS=100
```

3. **Emergency shutdown**
```bash
gcloud run services delete sacred-council-api
```

## 📊 Success Metrics

- ✅ Health check returns 200
- ✅ WebSocket connections work
- ✅ Multiple AI can connect
- ✅ Field coherence updates broadcast
- ✅ Logs appear in Cloud Logging

## 🎉 You're Ready!

The system is production-ready with:
- Connection limits (prevents cost overrun)
- Health checks (Cloud Run requirement)
- Structured logging (debugging in prod)
- Graceful shutdown (no data loss)
- Universal protocol (works in any environment)

**Deploy with confidence!** 🚀