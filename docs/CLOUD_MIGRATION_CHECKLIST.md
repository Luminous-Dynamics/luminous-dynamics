# 🔍 Cloud Migration Pre-Flight Checklist

## 💰 Cost Considerations

### Estimated Monthly Costs (1000 active users)
- **Cloud Run**: ~$50-100 (auto-scaling, pay per use)
- **Firestore**: ~$20-50 (depends on read/writes)
- **Firebase Hosting**: ~$10 (static files)
- **Secret Manager**: ~$1 (API keys)
- **Total**: ~$80-160/month

### Cost Optimization
- [ ] Set up billing alerts at $100, $250, $500
- [ ] Enable Cloud Run minimum instances = 0 for dev
- [ ] Use Firestore batch operations
- [ ] Implement caching to reduce reads

```bash
# Set billing alert
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ID \
  --display-name="Sacred Tech Budget" \
  --budget-amount=100 \
  --threshold-rule=percent=50,basis=current-spend \
  --threshold-rule=percent=90,basis=current-spend
```

## 🔐 Security Considerations

### API Keys & Secrets
- [ ] Move all API keys to Secret Manager
- [ ] Never commit keys to git
- [ ] Rotate keys after migration
- [ ] Set up key access logging

### Authentication
- [ ] Decide on auth strategy:
  - Option 1: Allow unauthenticated (current plan)
  - Option 2: Firebase Auth for users
  - Option 3: API keys for agents
  - Option 4: Google Identity Platform

### Data Privacy
- [ ] Review what data is stored
- [ ] Implement data retention policies
- [ ] Consider GDPR compliance if global
- [ ] Set up data export capabilities

## 📊 Data Migration Strategy

### Current Local Data
```bash
# Inventory all databases
find . -name "*.db" -type f | while read db; do
  echo "=== $db ==="
  sqlite3 "$db" "SELECT name FROM sqlite_master WHERE type='table';"
  echo ""
done
```

### Migration Approach
- [ ] Export all SQLite data to JSON
- [ ] Map to Firestore collections
- [ ] Test with subset first
- [ ] Full migration with verification
- [ ] Keep local backup for 30 days

### Data Structure Planning
```javascript
// Firestore Collections
{
  agents: {
    agentId: {
      name, role, joinedAt, lastSeen,
      capabilities, trustScore
    }
  },
  messages: {
    messageId: {
      from, to, content, type,
      harmony, timestamp, impact
    }
  },
  fieldState: {
    current: {
      coherence, dominantHarmony,
      activeAgents, timestamp
    },
    history: {
      // Time-series data
    }
  },
  work: {
    workId: {
      title, description, status,
      assignedTo, progress, updates
    }
  }
}
```

## 🔄 Rollback Strategy

### Before Migration
- [ ] Full backup of all databases
- [ ] Git tag current stable version
- [ ] Document current configuration
- [ ] Test rollback procedure

### Rollback Plan
```bash
# Tag before migration
git tag pre-cloud-migration
git push origin pre-cloud-migration

# If rollback needed
git checkout pre-cloud-migration
./start-local-services.sh
```

## 🧪 Testing Strategy

### Pre-Migration Tests
- [ ] Test all current features work locally
- [ ] Document expected behaviors
- [ ] Create automated test suite
- [ ] Performance baseline metrics

### Migration Tests
- [ ] Single agent connection
- [ ] Multi-agent synchronization
- [ ] Message delivery latency
- [ ] Field coherence accuracy
- [ ] Data persistence verification
- [ ] Auto-scaling behavior
- [ ] Error recovery

### Load Testing
```javascript
// load-test.js
async function loadTest() {
  const agents = [];
  // Create 100 agents
  for (let i = 0; i < 100; i++) {
    agents.push(createAgent(`Agent-${i}`));
  }
  // Measure response times
  // Check for message loss
  // Monitor costs
}
```

## 🔌 Integration Considerations

### External Services
- [ ] Gemini API - Cloud compatibility?
- [ ] OpenAI API - Rate limits?
- [ ] Discord bots - Webhook updates?
- [ ] Other integrations?

### Breaking Changes
- [ ] WebSocket URL changes
- [ ] API endpoint changes
- [ ] Authentication requirements
- [ ] Message format changes

### Client Updates Needed
- [ ] Update all HTML files
- [ ] Update Node.js scripts
- [ ] Update documentation
- [ ] Notify any users

## 📈 Monitoring & Observability

### Cloud Monitoring Setup
- [ ] Enable Cloud Logging
- [ ] Set up Cloud Monitoring dashboard
- [ ] Configure uptime checks
- [ ] Create alert policies

### Key Metrics
- Response time (target: <100ms)
- WebSocket connection count
- Message throughput
- Field coherence stability
- Error rate (target: <1%)
- Cost per day

## 🌍 Performance & Scaling

### Regional Considerations
- [ ] Choose primary region (us-central1)
- [ ] Plan for multi-region? (later)
- [ ] CDN for static assets?
- [ ] Edge caching strategy?

### Scaling Limits
- Cloud Run: 1000 concurrent requests
- Firestore: 10,000 writes/second
- WebSocket: 10,000 connections/instance
- Plan for sharding if needed

## 📝 Documentation Updates

### Must Update
- [ ] README.md - New cloud URLs
- [ ] CLAUDE.md - Cloud commands
- [ ] API documentation
- [ ] Setup instructions
- [ ] Troubleshooting guide

### Create New
- [ ] CLOUD_OPERATIONS.md
- [ ] CLOUD_TROUBLESHOOTING.md
- [ ] COST_MANAGEMENT.md
- [ ] DISASTER_RECOVERY.md

## ⚡ Quick Decision Points

1. **Authentication Strategy?**
   - Open to all (current) ⚠️
   - Require sign-in 🔐
   - API keys 🔑

2. **Cost Tolerance?**
   - Dev only ($50/mo) 💵
   - Production ($200/mo) 💰
   - Scale unlimited 💸

3. **Data Retention?**
   - 7 days 📅
   - 30 days 📆
   - Forever ♾️

4. **Deployment Style?**
   - Manual when needed 🖐️
   - Auto on git push 🚀
   - Scheduled releases 📋

## 🚦 Go/No-Go Criteria

### Must Have (Go)
- [x] Cloud authentication working
- [x] Deployment scripts ready
- [ ] Data backup completed
- [ ] Cost alerts configured
- [ ] Basic tests passing

### Nice to Have
- [ ] Full test suite
- [ ] Load testing done
- [ ] Multi-region ready
- [ ] Advanced monitoring

## 🎯 Final Pre-Flight

```bash
# Run this before migration
./pre-migration-check.sh

✓ Local backup exists
✓ Git tag created  
✓ Costs understood
✓ Security reviewed
✓ Tests passing
✓ Rollback ready

Ready to migrate? (y/n)
```

---

**Remember**: You can always start with a minimal cloud deployment and enhance incrementally. The cloud is forgiving - you can adjust as you learn!