# 🚀 Sacred Council Hub - Live Deployment Checklist

## Pre-Deployment Verification

### ✅ Infrastructure Ready
- [x] GCP Project: mycelix-network
- [x] Essential APIs enabled (Firestore, Cloud Run, Storage, Build)
- [x] Authentication configured
- [ ] Billing account verified

### 📋 Deployment Steps

## Phase 1: Database & Storage Setup
```bash
# 1. Create Firestore database
gcloud firestore databases create --location=us-central1

# 2. Create storage buckets
gsutil mb -l us-central1 gs://mycelix-network-sacred-data/
gsutil mb -l us-central1 gs://mycelix-network-sacred-backups/

# 3. Set bucket permissions
gsutil iam ch allUsers:objectViewer gs://mycelix-network-sacred-data/
```

## Phase 2: Build & Push Container Images
```bash
# 1. Enable Container Registry
gcloud services enable containerregistry.googleapis.com

# 2. Configure Docker
gcloud auth configure-docker

# 3. Build main API image
docker build -t gcr.io/mycelix-network/sacred-council-api:v1 .

# 4. Build module service images
cd modules/consciousness-field && docker build -t gcr.io/mycelix-network/consciousness-field:v1 .
cd ../agent-network && docker build -t gcr.io/mycelix-network/agent-network:v1 .
cd ../sacred-messaging && docker build -t gcr.io/mycelix-network/sacred-messaging:v1 .
cd ../work-coordination && docker build -t gcr.io/mycelix-network/work-coordination:v1 .

# 5. Push all images
docker push gcr.io/mycelix-network/sacred-council-api:v1
docker push gcr.io/mycelix-network/consciousness-field:v1
docker push gcr.io/mycelix-network/agent-network:v1
docker push gcr.io/mycelix-network/sacred-messaging:v1
docker push gcr.io/mycelix-network/work-coordination:v1
```

## Phase 3: Deploy Services to Cloud Run
```bash
# 1. Deploy consciousness-field service
gcloud run deploy consciousness-field \
  --image gcr.io/mycelix-network/consciousness-field:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3333

# 2. Deploy agent-network service  
gcloud run deploy agent-network \
  --image gcr.io/mycelix-network/agent-network:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3334

# 3. Deploy sacred-messaging service
gcloud run deploy sacred-messaging \
  --image gcr.io/mycelix-network/sacred-messaging:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3335

# 4. Deploy work-coordination service
gcloud run deploy work-coordination \
  --image gcr.io/mycelix-network/work-coordination:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3336

# 5. Deploy main API (with service URLs as env vars)
gcloud run deploy sacred-council-api \
  --image gcr.io/mycelix-network/sacred-council-api:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3001 \
  --memory 1Gi \
  --set-env-vars "NODE_ENV=production,PROJECT_ID=mycelix-network"
```

## Phase 4: Configure Networking & Domains
```bash
# 1. Get service URLs
gcloud run services list --platform managed --region us-central1

# 2. Set up domain mapping (if using custom domains)
gcloud beta run domain-mappings create \
  --service sacred-council-api \
  --domain sacred.mycelix.net \
  --region us-central1
```

## Phase 5: Testing & Verification

### API Health Checks
```bash
# Test each service
curl https://consciousness-field-[hash].a.run.app/health
curl https://agent-network-[hash].a.run.app/health
curl https://sacred-messaging-[hash].a.run.app/health
curl https://work-coordination-[hash].a.run.app/health
curl https://sacred-council-api-[hash].a.run.app/health
```

### Functional Tests
- [ ] Field coherence API responds
- [ ] WebSocket connections work
- [ ] Sacred messages can be sent
- [ ] PWA installs correctly
- [ ] Offline mode functions

## Phase 6: Monitoring Setup
```bash
# 1. Create uptime checks
gcloud monitoring uptime configs create sacred-api-check \
  --display-name="Sacred API Health" \
  --resource-type=uptime-url \
  --hostname=[your-service-url]

# 2. Set up alerts
gcloud alpha monitoring policies create \
  --notification-channels=[channel-id] \
  --display-name="Sacred API Down"
```

## 🔒 Security Checklist
- [ ] Enable Cloud Armor DDoS protection
- [ ] Set up SSL certificates
- [ ] Configure CORS properly
- [ ] Verify authentication flows
- [ ] Set resource quotas

## 📊 Post-Deployment
- [ ] Monitor logs for errors
- [ ] Check performance metrics
- [ ] Verify billing alerts
- [ ] Document service URLs
- [ ] Update CLAUDE.md with live endpoints

## 🚨 Rollback Plan
```bash
# If issues arise, rollback to previous version
gcloud run services update-traffic sacred-council-api \
  --to-revisions=PREVIOUS_REVISION=100
```

---

## Current Status: Ready to Deploy
Next step: Run Phase 1 commands to set up database and storage