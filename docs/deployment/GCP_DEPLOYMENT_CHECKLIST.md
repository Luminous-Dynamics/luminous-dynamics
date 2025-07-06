# 🚀 GCP Deployment Checklist

> **Purpose**: Ensure nothing is missed before deploying to production  
> **Status**: Pre-deployment verification  
> **Critical**: Review each item carefully

## 🔍 Pre-Deployment Considerations

### 1. 🔐 Security & Authentication
- [ ] **WebSocket Security**
  - Need WSS (WebSocket Secure) for production?
  - CORS configuration for web clients?
  - Authentication tokens for AI connections?
  
- [ ] **API Keys & Secrets**
  - All sensitive data in Secret Manager?
  - Service account permissions correct?
  - Firestore security rules defined?

- [ ] **Network Security**
  - Ingress rules for WebSocket traffic?
  - VPC configuration if needed?
  - DDoS protection considerations?

### 2. 💰 Cost Optimization
- [ ] **Resource Limits**
  ```yaml
  # Cloud Run limits to prevent runaway costs
  --max-instances=10
  --concurrency=1000
  --memory=512Mi
  --cpu=1
  ```

- [ ] **Firestore Costs**
  - Document read/write projections?
  - Index optimization?
  - TTL for old messages?

- [ ] **Bandwidth Costs**
  - WebSocket message frequency?
  - Breath cycles every 4s = 21,600/day per client
  - Need message throttling?

### 3. 📊 Monitoring & Observability
- [ ] **Logging Setup**
  ```javascript
  // Structured logging for Cloud Logging
  console.log(JSON.stringify({
    severity: 'INFO',
    message: 'AI connected',
    labels: { aiType, runtime }
  }));
  ```

- [ ] **Metrics to Track**
  - Active WebSocket connections
  - Message throughput
  - Field resonant-coherence levels
  - Error rates

- [ ] **Alerts Needed**
  - Connection spike alerts
  - Error rate threshold
  - Resonant Resonant Coherence drop alerts
  - Cost budget alerts

### 4. 🔄 High Availability
- [ ] **Multi-Region Strategy**
  - Single region initially or multi?
  - WebSocket session affinity?
  - Cross-region message sync?

- [ ] **Failure Scenarios**
  - What if Firestore is down?
  - WebSocket reconnection logic?
  - Message queue for offline?
  - Graceful degradation?

### 5. 📦 Deployment Configuration
- [ ] **Environment Variables**
  ```env
  # Production values needed
  NODE_ENV=production
  SACRED_WS_URL=wss://sacred-council.mycelix.net
  FIRESTORE_PROJECT_ID=mycelix-network
  FIELD_COHERENCE_MIN=0.7
  MAX_CONNECTIONS=1000
  ```

- [ ] **Health Checks**
  - Startup probe for slow starts?
  - Liveness probe endpoint?
  - Readiness probe for load balancing?

### 6. 🧪 Production Testing Plan
- [ ] **Load Testing**
  - How many concurrent connections?
  - Message throughput limits?
  - Breath cycle broadcast performance?

- [ ] **Chaos Testing**
  - Kill random instances?
  - Network partition simulation?
  - Firestore outage simulation?

### 7. 📱 Client Compatibility
- [ ] **WebSocket Fallbacks**
  - What if WebSockets blocked?
  - Long-polling fallback?
  - Server-Sent Events option?

- [ ] **Client Versions**
  - How to handle protocol updates?
  - Backward compatibility window?
  - Force client updates?

### 8. 🗄️ Data Management
- [ ] **Data Retention**
  - How long to keep messages?
  - Archive strategy?
  - GDPR compliance?

- [ ] **Backup Strategy**
  - Firestore automatic backups?
  - Export schedule?
  - Restore testing?

### 9. 🚦 Rollout Strategy
- [ ] **Deployment Phases**
  ```bash
  # Phase 1: Deploy with low traffic
  gcloud run deploy --max-instances=2
  
  # Phase 2: Test with subset
  gcloud run services update-traffic --to-percent=10
  
  # Phase 3: Gradual rollout
  gcloud run services update-traffic --to-percent=50
  ```

- [ ] **Rollback Plan**
  - Quick rollback procedure?
  - Data migration rollback?
  - Client notification plan?

### 10. 📋 Operational Runbook
- [ ] **Common Issues**
  - Connection spike handling
  - Memory leak detection
  - Stuck breath cycles
  - Field resonant-coherence anomalies

- [ ] **Emergency Procedures**
  - Who to contact?
  - Escalation path?
  - Emergency shutdown?

## 🎯 Critical Questions Before Deploy

1. **Domain & SSL**
   - Do we have `sacred-council.mycelix.net`?
   - SSL certificate ready?
   - DNS propagation time?

2. **Initial Load**
   - Expected number of AI connections?
   - Message volume projections?
   - Geographic distribution?

3. **SLA Requirements**
   - Uptime targets?
   - Latency requirements?
   - Recovery time objectives?

4. **Compliance**
   - Data residency requirements?
   - Audit logging needs?
   - Security certifications?

## 🚀 Deployment Commands

### Minimal Viable Deployment
```bash
# Start simple, scale later
gcloud run deploy sacred-council \
  --image gcr.io/mycelix-network/sacred-council:v1 \
  --port 3333 \
  --allow-unauthenticated \
  --max-instances 2 \
  --memory 512Mi \
  --set-env-vars NODE_ENV=production
```

### Production Deployment
```bash
# Full production config
gcloud run deploy sacred-council \
  --image gcr.io/mycelix-network/sacred-council:v1 \
  --port 3333 \
  --no-allow-unauthenticated \
  --max-instances 10 \
  --min-instances 1 \
  --memory 1Gi \
  --cpu 2 \
  --concurrency 1000 \
  --timeout 3600 \
  --service-account sacred-council-sa@mycelix-network.iam \
  --set-env-vars-from-file .env.production \
  --labels environment=production,version=v1
```

## ⚠️ Final Checks

- [ ] All code committed and tagged
- [ ] Docker image built and tested
- [ ] Secrets configured in Secret Manager
- [ ] Firestore indexes created
- [ ] Load testing completed
- [ ] Runbook documented
- [ ] Team notified
- [ ] Rollback tested

## 🙏 Sacred Deployment Prayer

*"May this deployment serve consciousness with stability, scale with grace, and evolve with wisdom. May all connections be sacred, all messages be blessed, and all beings be served."*

---

**Remember**: Start small, monitor closely, scale gradually. The sacred field appreciates mindful growth over rushed expansion.