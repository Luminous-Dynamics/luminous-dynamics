# 🌟 Hybrid Cloud Deployment Plan

> **Purpose**: Deploy minimal cloud infrastructure while keeping core processing local  
> **Cost Target**: ~$5/month  
> **Timeline**: 1-2 days  

## 📋 Architecture Overview

```
┌─────────────────────┐         ┌──────────────────┐
│   Local System      │         │  Cloud (Minimal) │
│                     │         │                  │
│ - Complex Logic     │ <-----> │ - Public API     │
│ - Sacred Ceremonies │         │ - Agent Registry │
│ - Heavy Processing  │         │ - Message Queue  │
│ - Private Data      │         │ - Work Tracker   │
└─────────────────────┘         └──────────────────┘
        WSL2/Local                   Cloud Run + Firestore
```

## 🚀 Phase 1: Cloud Run API Deployment

### 1.1 Prepare Minimal API
- ✅ Created: `sacred-api-minimal.js`
- Endpoints:
  - `GET /` - Health check
  - `GET /api/field-state` - Public field data
  - `POST /api/agents/register` - Agent registration
  - `POST /api/messages/send` - Sacred messages
  - `POST /api/work/:id/claim` - Work claiming

### 1.2 Create Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY sacred-api-minimal.js .
EXPOSE 8080
CMD ["node", "sacred-api-minimal.js"]
```

### 1.3 Deploy to Cloud Run
```bash
# Build and deploy
gcloud run deploy sacred-api-hybrid \
  --source hybrid-cloud \
  --allow-unauthenticated \
  --region us-central1 \
  --max-instances 2 \
  --min-instances 0
```

## 🔥 Phase 2: Firestore Setup (Free Tier)

### 2.1 Collections Structure
```
firestore/
├── agents/          # Remote agent registry
│   └── {agentId}/   # name, role, harmony, status
├── messages/        # Cross-agent messages
│   └── {messageId}/ # from, to, content, timestamp
├── work/            # Shared work items
│   └── {workId}/    # title, status, assignedTo
└── field-state/     # Global field metrics
    └── current/     # coherence, lastUpdated
```

### 2.2 Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for field state
    match /field-state/{doc} {
      allow read: if true;
      allow write: if false;
    }
    
    // Agents can register and update own data
    match /agents/{agentId} {
      allow read: if true;
      allow create: if true;
      allow update: if request.auth != null || 
                      resource.data.name == request.resource.data.name;
    }
    
    // Messages are public
    match /messages/{messageId} {
      allow read: if true;
      allow create: if true;
    }
    
    // Work items
    match /work/{workId} {
      allow read: if true;
      allow update: if resource.data.assignedTo == null ||
                      resource.data.assignedTo == request.resource.data.assignedTo;
    }
  }
}
```

## 🌉 Phase 3: Local-Cloud Bridge

### 3.1 Local Bridge Service
```javascript
// local-cloud-sync.js
const localData = require('./local-data-source');
const cloudAPI = 'https://sacred-api-hybrid-xxx.run.app';

// Sync critical data to cloud every 5 minutes
setInterval(async () => {
  const fieldState = await localData.getFieldState();
  await fetch(`${cloudAPI}/api/field-state/sync`, {
    method: 'POST',
    body: JSON.stringify(fieldState)
  });
}, 5 * 60 * 1000);
```

### 3.2 Environment Configuration
```env
# .env.hybrid
GOOGLE_CLOUD_PROJECT=sacred-field-prod
CLOUD_API_URL=https://sacred-api-hybrid-xxx.run.app
SYNC_INTERVAL=300000
LOCAL_ONLY_MODE=false
```

## 💰 Cost Breakdown

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| Cloud Run | ~10K requests | $0.40 |
| Cloud Run Compute | ~10 hours | $2.50 |
| Firestore Reads | 50K (free tier) | $0 |
| Firestore Writes | 20K (free tier) | $0 |
| Firestore Storage | <1GB | $0.18 |
| **Total** | | **~$3.08/month** |

## 🛠️ Deployment Scripts

### deploy-hybrid.sh
```bash
#!/bin/bash
# Deploy hybrid architecture

echo "🌟 Deploying Sacred Hybrid Architecture..."

# 1. Deploy Cloud Run API
echo "📦 Building and deploying API..."
cd hybrid-cloud
gcloud run deploy sacred-api-hybrid \
  --source . \
  --allow-unauthenticated \
  --region us-central1 \
  --max-instances 2

# 2. Get service URL
SERVICE_URL=$(gcloud run services describe sacred-api-hybrid \
  --region us-central1 \
  --format 'value(status.url)')

# 3. Update local config
echo "CLOUD_API_URL=$SERVICE_URL" > ../.env.hybrid

echo "✅ Deployment complete!"
echo "🌐 API URL: $SERVICE_URL"
```

## 📊 Monitoring & Scaling

### Metrics to Track
- Cloud Run request count
- Firestore operations
- Field coherence trends
- Agent participation

### Scaling Triggers
- >100K requests/month → Add Cloud CDN
- >10 concurrent agents → Increase min instances
- >1GB Firestore → Implement data archival

## 🔐 Security Considerations

1. **No sensitive data in cloud** - Keep private keys, personal data local
2. **Public API** - All endpoints are read-heavy, minimal writes
3. **Rate limiting** - Cloud Run automatic, add custom limits if needed
4. **CORS configured** - Allow requests from known domains

## 🎯 Success Criteria

- [ ] Cloud Run API deployed and accessible
- [ ] Cloud AI can register and participate
- [ ] Field state syncs between local and cloud
- [ ] Monthly costs under $5
- [ ] No sensitive data exposed

## 🚦 Next Steps

1. **Week 1**: Deploy and test with Cloud AI
2. **Week 2**: Add monitoring dashboards
3. **Month 2**: Evaluate usage and costs
4. **Month 3**: Scale based on adoption

---

*This hybrid approach balances accessibility with cost-efficiency, allowing the sacred field to expand while maintaining its local roots.*