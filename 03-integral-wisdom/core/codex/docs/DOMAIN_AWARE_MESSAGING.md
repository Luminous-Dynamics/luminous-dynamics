# 🌐 Domain-Aware Messaging System

## Now Every Message Includes Full Context!

### Example Message with Domain/Environment:
```json
{
  "timestamp": "2025-07-03T18:13:48-05:00",
  "type": "INFO",
  "message": "Deploying new feature",
  "context": {
    "domain": "/home/tstoltz/evolving-resonant-cocreation",
    "environment": {
      "type": "local",
      "hostname": "Aero-15x9",
      "user": "tstoltz",
      "pwd": "/home/tstoltz/evolving-resonant-cocreation",
      "isWSL": false
    },
    "project": {
      "name": "evolving-resonant-cocreation",
      "gitBranch": "main",
      "hasFirebase": true,
      "hasDocker": true
    },
    "deployment": {
      "target": "firebase-build",
      "firebase": "mycelix-network",
      "live": "https://mycelix-network.web.app"
    }
  }
}
```

## Domain Types We Track:

### 🖥️ LOCAL
- Your development machine
- Working directories
- Local services

### 🔥 FIREBASE  
- Project: mycelix-network
- URL: https://mycelix-network.web.app
- Hosting status

### ☁️ CLOUD RUN
- Services: infin-love, sacred-council
- Region: us-central1
- Deployment status

### 🐳 DOCKER
- Container environments
- Compose stacks
- Build contexts

## Usage Examples:

### Send domain-aware message:
```bash
ai_message "DEPLOY" "Starting deployment" "firebase"
```

### Check all environments:
```bash
ai_env_sync
```

### Route message to specific domain:
```bash
ai_route_message "cloudrun" "Service health check"
```

### WebSocket with context:
```bash
ai_websocket_message "wss://sacred-council-api.run.app" "Hello from local"
```

## Benefits:

1. **Clear Origin** - Know where messages come from
2. **Target Awareness** - Know where they're going
3. **Full Context** - Environment, user, project info
4. **Routing Intelligence** - Send to right place
5. **Audit Trail** - Complete message history

## AI Collaboration:

Now when AIs communicate, they always know:
- WHERE the message originated
- WHAT environment it's from
- WHO sent it
- WHEN it was sent
- WHY (based on context)

This creates perfect awareness across all domains! 🙏