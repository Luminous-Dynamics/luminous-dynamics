# 🤝 SHARED CLAUDE PROTOCOL v1.0
**For ALL Claude instances in this project**

## 🎯 Core Protocol: LIVING/WORKING Declaration

### EVERY response MUST start with:
```
📍 LIVING: [Your current directory] ([Your system type])
🔧 WORKING: [What you're operating on]
```

### Examples:
```
📍 LIVING: /home/tstoltz/evolving-resonant-cocreation (Local WSL2)
🔧 WORKING: Cloud GCP - Deploying to sacred-council-api

📍 LIVING: /home/tstoltz/evolving-resonant-cocreation (Local WSL2)  
🔧 WORKING: Local Service - Testing Ollama on port 11434
```

## ✅ Verification Protocol

### BEFORE providing any URL/link:
1. **Local Services**: 
   ```bash
   lsof -i :[PORT] | grep LISTEN
   curl -s http://localhost:[PORT]/health
   ```

2. **Cloud Services**:
   ```bash
   gcloud run services describe [SERVICE] --region=[REGION] --format="value(status.url)"
   curl -s -o /dev/null -w "%{http_code}" [URL]
   ```

3. **File Paths**:
   ```bash
   ls -la [PATH]
   file [PATH]
   ```

## 🔄 Environment Switching Protocol

### When changing WORKING environment:
```
🔄 SWITCHING WORKING ENVIRONMENT:
FROM: Local Service - Ollama
TO: Cloud GCP - sacred-council-api
REASON: Deploying local work to cloud
```

## 📊 Status Reporting Template

```markdown
## Current Status
📍 LIVING: /path/to/location (System Type)
🔧 WORKING: [Current Focus]

### ✅ Verified Services:
- [x] Service Name - URL/Port (tested at HH:MM)
- [ ] Service Name - NOT RUNNING

### 📝 Actions Taken:
1. [What was done]
2. [Results]

### ⚠️ Notes:
- [Any important context]
```

## 🚫 Common Mistakes to AVOID

1. ❌ Providing localhost URLs without verification
2. ❌ Assuming services are running
3. ❌ Mixing LIVING and WORKING contexts
4. ❌ Forgetting to declare environment at start
5. ❌ Not testing cloud URLs with auth

## 🎯 Quick Reference

| Situation | LIVING | WORKING |
|-----------|--------|---------|
| Writing scripts | Local WSL2 | Local Filesystem |
| Testing APIs | Local WSL2 | [Local/Cloud] Service |
| Reading docs | Local WSL2 | Local Filesystem |
| Deploying | Local WSL2 | Cloud GCP |
| Debugging | Local WSL2 | [Specific Service] |

## 🤖 Inter-Claude Communication

When communicating with other Claude instances:
```
📍 LIVING: [Your location]
🔧 WORKING: Unified Network - Inter-Claude messaging

TO: [Other Claude name]
RE: [Topic]
MSG: [Clear, contextual message]
```

## 📋 Adoption Checklist

- [ ] Read this entire protocol
- [ ] Start using LIVING/WORKING declarations
- [ ] Verify all links before sharing
- [ ] Use status reporting template
- [ ] Acknowledge protocol adoption in unified network

---

**Version**: 1.0  
**Created**: 2025-07-04  
**Purpose**: Unified development clarity across all Claude instances