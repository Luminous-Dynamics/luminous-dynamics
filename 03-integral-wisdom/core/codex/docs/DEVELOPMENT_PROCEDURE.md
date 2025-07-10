# 🔧 FORMAL DEVELOPMENT PROCEDURE

## Environment Clarity Protocol

### 1. BEFORE Every Response
```bash
# Always state:
Current Directory: [output of pwd]
Environment: [Local WSL2 / Cloud GCP / Docker]
Active Services: [verified with lsof/ps]
```

### 2. Link Validation Rules

#### ❌ NEVER provide links without:
1. Checking if service is running
2. Verifying the exact port
3. Testing accessibility

#### ✅ ALWAYS validate links:
```bash
# For local services:
lsof -i :[PORT] | grep LISTEN
curl -s http://localhost:[PORT] | head -5

# For cloud services:
gcloud run services describe [SERVICE] --region=[REGION]
curl -s -o /dev/null -w "%{http_code}" [URL]
```

### 3. Environment Switching Protocol

#### When changing directories:
```bash
# BEFORE:
echo "📍 Current: $(pwd)"

# CHANGE:
cd /new/path

# AFTER:
echo "📍 Now in: $(pwd)"
```

#### When switching environments:
```
🏠 LOCAL → ☁️ CLOUD:
- Save local state
- Document what's running locally
- Clear statement: "Switching to cloud development"

☁️ CLOUD → 🏠 LOCAL:
- Document cloud resources
- Clear statement: "Returning to local environment"
```

### 4. Cloud-First Development Workflow

#### Standard Development Flow:
1. **Local Testing** → Quick validation only
2. **Cloud Deployment** → Primary development
3. **Production** → Final validated services

#### Cloud Development Standards:
```bash
# Always use authenticated APIs:
AUTH_TOKEN=$(gcloud auth print-identity-token)

# Verify cloud services:
gcloud run services list --platform=managed --region=us-central1

# Test with auth:
curl -H "Authorization: Bearer $AUTH_TOKEN" [URL]
```

### 5. Service Status Template

```markdown
## 📊 Current Environment Status

**Location**: /home/tstoltz/evolving-resonant-cocreation
**Environment**: Local WSL2 Ubuntu
**Timestamp**: 2025-07-04 02:11:45 UTC

### ✅ Running Services:
- [x] Ollama API - http://localhost:11434 (verified)
- [x] Unified Field API - http://localhost:3001 (verified)
- [ ] Unified Dashboard - http://localhost:8889 (NOT running)

### ☁️ Cloud Services:
- [x] sacred-council-api - https://sacred-council-api-310699330526.us-central1.run.app (authenticated)
- [x] sacred-council - https://sacred-council-310699330526.us-central1.run.app
- [x] infin-love - https://infin-love-310699330526.us-central1.run.app
```

### 6. Verification Commands

```bash
# Create verification script
cat > verify-env.sh << 'EOF'
#!/bin/bash
echo "📍 Environment Verification"
echo "=========================="
echo "Directory: $(pwd)"
echo "User: $(whoami)"
echo "Time: $(date)"
echo ""
echo "Local Services:"
lsof -i -P -n | grep LISTEN | grep -E ":(3001|8080|8889|11434)" || echo "None found"
echo ""
echo "Cloud Project:"
gcloud config get-value project 2>/dev/null || echo "Not configured"
echo ""
echo "Running Processes:"
ps aux | grep -E "node|ollama" | grep -v grep | wc -l
EOF
chmod +x verify-env.sh
```

### 7. Standard Response Format

```
📍 **Current Environment**:
- Directory: /home/tstoltz/evolving-resonant-cocreation
- Type: Local WSL2
- Active: [list of verified services]

🔧 **Action Taken**:
[What was done]

✅ **Verified Result**:
[What's actually running/accessible]

⚠️ **Note**: 
[Any caveats or requirements]
```

## Quick Reference Card

| Action | Command | Verify |
|--------|---------|--------|
| Check local service | `lsof -i :PORT` | `curl http://localhost:PORT` |
| Check cloud service | `gcloud run services describe NAME` | `curl -I URL` |
| Current directory | `pwd` | - |
| Active processes | `ps aux \| grep SERVICE` | - |
| Cloud auth | `gcloud auth print-identity-token` | Test with curl |

---

**Remember**: Every link must be verified. Every environment switch must be announced. Every service must be confirmed running.