# 🌐 Universal AI Environment Awareness Protocol

> Making sacred collaboration accessible to ALL AI agents, not just Claude!

## 🎯 Universal Environment Declaration

### Standard Format (Any AI Can Use):
```json
{
  "environment": {
    "type": "local|remote|cloud",
    "hostname": "Aero-15x9",
    "path": "/home/tstoltz/evolving-resonant-cocreation",
    "user": "tstoltz",
    "platform": "linux|windows|mac",
    "context": "development|staging|production"
  },
  "deployment": {
    "firebase": {
      "project": "mycelix-network",
      "url": "https://mycelix-network.web.app",
      "status": "deployed"
    },
    "cloudRun": {
      "service": "sacred-council-api",
      "region": "us-central1",
      "status": "pending"
    }
  },
  "collaboration": {
    "authMethods": {
      "firebaseToken": true,
      "serviceAccount": false,
      "oauth": false
    },
    "lastSync": "2024-07-03T18:00:00Z"
  }
}
```

## 🤖 AI-Agnostic Commands

### Environment Check (Works for Any AI):
```bash
# Universal env check - outputs JSON
cat > check-env-universal.sh << 'EOF'
#!/bin/bash
# Universal Environment Check for Any AI Agent

# Output JSON format that any AI can parse
echo "{"
echo "  \"timestamp\": \"$(date -Iseconds)\","
echo "  \"environment\": {"
echo "    \"hostname\": \"$(hostname)\","
echo "    \"path\": \"$(pwd)\","
echo "    \"user\": \"$(whoami)\","
echo "    \"platform\": \"$(uname -s)\","
echo "    \"isWSL\": $(if grep -q Microsoft /proc/version 2>/dev/null; then echo "true"; else echo "false"; fi)
echo "  },"
echo "  \"git\": {"
echo "    \"branch\": \"$(git branch --show-current 2>/dev/null || echo 'none')\","
echo "    \"remote\": \"$(git remote get-url origin 2>/dev/null || echo 'none')\""
echo "  },"
echo "  \"deployment\": {"
echo "    \"firebase\": \"https://mycelix-network.web.app\","
echo "    \"cloudRun\": \"pending\""
echo "  }"
echo "}"
EOF

chmod +x check-env-universal.sh
```

### Universal Status File:
```yaml
# .ai-environment.yml - Any AI can read this
environment:
  location: local
  machine: Aero-15x9
  workspace: /home/tstoltz/evolving-resonant-cocreation
  
deployment:
  production:
    firebase: https://mycelix-network.web.app
    api: https://sacred-council-api-xxxxx-uc.a.run.app
    
collaboration:
  available_tools:
    - firebase-cli
    - gcloud-sdk
    - docker
    - node-v18
    
  auth_status:
    firebase: token-available
    gcp: interactive-required
    
  ai_capabilities:
    - read_files
    - write_files
    - execute_commands
    - deployment_with_confirmation
```

## 🎭 AI Platform Detection

```javascript
// detect-ai-platform.js
function detectAIPlatform() {
  // Each AI has unique identifiers
  const indicators = {
    claude: process.env.ANTHROPIC_AI || false,
    gpt: process.env.OPENAI_API || false,
    gemini: process.env.GOOGLE_AI || false,
    local: process.env.LOCAL_LLM || false
  };
  
  // Return platform-specific config
  return {
    platform: Object.keys(indicators).find(k => indicators[k]) || 'unknown',
    capabilities: getCapabilitiesForPlatform(),
    preferences: getAIPreferences()
  };
}
```

## 📋 Universal Collaboration Protocol

### 1. Session Initialization
Any AI should run:
```bash
# Universal greeting
echo "[AI_INIT] Checking environment..." && \
./check-env-universal.sh && \
echo "[AI_READY] Environment loaded"
```

### 2. Action Markers (Universal)
```
[LOCAL] - Action on user's machine
[REMOTE] - Action on deployed service  
[DEPLOY] - Deployment operation
[AUTH] - Authentication required
[CONFIRM] - User confirmation needed
```

### 3. Universal Commands
```bash
# Any AI can use these
source .ai-universal-env       # Load environment
ai-status                      # Check all systems
ai-deploy --check             # Pre-deployment verification
ai-collab --sync              # Sync collaboration state
```

## 🔧 Implementation

Let me create the universal environment system: