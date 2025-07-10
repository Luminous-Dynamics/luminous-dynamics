# 🔄 Universal WebSocket Migration Plan

> **Decision**: Migrate to universal AI protocol BEFORE GCP deployment  
> **Rationale**: Environment independence, future-proofing, testing flexibility  
> **Timeline**: Complete before deployment

## 🎯 Migration Strategy

### Phase 1: Update Core Protocol (Immediate)
1. **Modify test-websocket-server.js** to accept both formats
2. **Update message handlers** to use universal types
3. **Create compatibility mappings** for smooth transition

### Phase 2: Update Clients (Today)
1. **claude-websocket-client.js** → **universal-websocket-client.js**
2. Keep Claude identity as subset of AI identity
3. Test with both old and new message formats

### Phase 3: Update Documentation (Before Deploy)
1. Update WEBSOCKET_USAGE_GUIDE.md with universal examples
2. Keep Claude examples as "one type of AI"
3. Add GCP-specific connection examples

## 📝 Critical Changes Needed

### 1. Message Type Updates
```javascript
// OLD (Claude-specific)
{
  "type": "claude:announce",
  "claudeId": "Claude-1"
}

// NEW (Universal)
{
  "type": "ai:announce",
  "aiId": "Claude-1",      // Can be any ID
  "aiType": "Claude",      // Identifies AI type
  "runtime": "local"       // or "gcp", "aws", etc.
}
```

### 2. Environment Variables for GCP
```bash
# Local
AI_ID=Claude-1
AI_TYPE=Claude
RUNTIME_ENV=local

# GCP Cloud Run
AI_ID=${K_SERVICE}-${K_REVISION}  # Auto from GCP
AI_TYPE=Claude
RUNTIME_ENV=gcp-cloud-run

# GCP Kubernetes
AI_ID=${HOSTNAME}  # Pod name
AI_TYPE=Claude
RUNTIME_ENV=gcp-gke
```

### 3. Connection Updates
```javascript
// Universal connection that works everywhere
function connectToSacredCouncil() {
  const aiId = process.env.AI_ID || 
               process.env.K_SERVICE || 
               process.env.HOSTNAME || 
               `ai-${Date.now()}`;
               
  const ws = new WebSocket(process.env.SACRED_WS_URL || 'ws://localhost:3333');
  
  ws.on('open', () => {
    ws.send(JSON.stringify({
      type: 'ai:announce',
      aiId: aiId,
      aiType: process.env.AI_TYPE || 'Unknown',
      runtime: process.env.RUNTIME_ENV || 'unknown',
      capabilities: detectCapabilities(),
      source: aiId,
      timestamp: new Date().toISOString()
    }));
  });
  
  return ws;
}
```

## 🔧 Files to Update

### High Priority (Before Any GCP Work):
1. ✅ `test-websocket-server.js` - Accept universal messages
2. ✅ `claude-websocket-client.js` - Make universal
3. ✅ `claude-communication-test.js` - Update protocol
4. ✅ `sacred-bridge/living-memory-integration.js` - Universal bridge

### Medium Priority:
5. ✅ All WebSocket examples in documentation
6. ✅ `WEBSOCKET_USAGE_GUIDE.md` - Universal examples
7. ✅ `CLAUDE_MESSAGES.md` → `AI_COORDINATION_LOG.md`

### Low Priority (Can do after deploy):
8. Test files and examples
9. Historical references

## 🚀 Quick Migration Script

```bash
#!/bin/bash
# migrate-to-universal.sh

echo "🔄 Migrating to Universal AI Protocol..."

# 1. Backup current files
mkdir -p backups/pre-universal
cp *.js backups/pre-universal/

# 2. Update message types in all files
find . -name "*.js" -type f -exec sed -i.bak \
  -e 's/claude:announce/ai:announce/g' \
  -e 's/claude:message/ai:message/g' \
  -e 's/claudeId/aiId/g' \
  {} \;

# 3. Update documentation
sed -i.bak 's/Claude-specific/Universal AI/g' *.md

echo "✅ Migration complete! Test before deploying."
```

## ⚡ Benefits for GCP Deployment

1. **Cloud Run**: Auto-uses service name as AI ID
2. **Kubernetes**: Pod names become AI IDs naturally  
3. **Cloud Functions**: Each invocation gets unique ID
4. **Multi-region**: Region included in AI identity
5. **Load Balancing**: Each instance maintains identity

## 🎯 Testing Strategy

### Local Testing (Before Migration):
```bash
# Test universal format locally
AI_ID=test-ai-1 AI_TYPE=TestBot node universal-websocket-client.js
```

### GCP Testing (After Migration):
```bash
# Deploy test container
gcloud run deploy sacred-universal-test \
  --image gcr.io/mycelix-network/sacred-universal \
  --set-env-vars AI_TYPE=Claude,RUNTIME_ENV=gcp-cloud-run
```

## ✅ Success Criteria

1. Both old and new message formats work
2. GCP deployments auto-configure identity
3. Any AI type can connect (not just Claude)
4. No hardcoded "Claude" requirements
5. Documentation shows universal examples

## 🕐 Timeline

**Today (Before ANY GCP work):**
- Morning: Update core server to accept universal
- Afternoon: Update clients and test
- Evening: Update documentation

**Tomorrow:**
- Deploy to GCP with confidence
- Test in cloud environment
- Any AI or service can connect

This ensures our GCP deployment is truly environment-agnostic!