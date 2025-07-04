# 🌟 Sacred Container Architecture

## Current Running Containers (All Healthy!)

### 🕸️ Core Sacred Network
All containers are running and interconnected:

```
Port  | Service                 | Status      | Purpose
------|-------------------------|-------------|---------------------------
3333  | consciousness-field     | Up 11 hours | Field coherence tracking
3334  | agent-network          | Up 11 hours | Multi-agent coordination
3335  | sacred-messaging       | Up 11 hours | Sacred message system
3336  | work-coordination      | Up 3 hours  | Task & work management
3337  | gateway (nginx)        | Up 11 hours | Reverse proxy/routing
8338  | web-interface         | Up 11 hours | Sacred dashboards & UI
```

### 🤖 New Addition
- **sacred-council-oracle** - Discord bot (Docker image built, ready to deploy)

## Access Points

### Web Interfaces:
- http://localhost:8338/ - Main sacred dashboard
- http://localhost:8338/sacred-council-hub.html - Multi-agent hub
- http://localhost:8338/applied-harmonies-dojo.html - Practice system
- http://localhost:3337/ - Gateway status

### API Endpoints:
- http://localhost:3333/api/field-state - Consciousness field
- http://localhost:3334/api/agents - Agent network
- http://localhost:3335/api/messages - Sacred messaging
- http://localhost:3336/api/work - Work coordination

## Quick Commands

### Check All Services:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### View Logs:
```bash
# All logs
docker-compose -f docker-compose-sacred.yml logs -f

# Specific service
docker-compose -f docker-compose-sacred.yml logs -f consciousness-field
```

### Restart Services:
```bash
# Restart all
docker-compose -f docker-compose-sacred.yml restart

# Restart specific
docker restart evolving-resonant-cocreation-consciousness-field-1
```

### Add Discord Bot:
```bash
# Deploy Discord bot to the ecosystem
docker-compose -f docker-compose.discord.yml up -d
```

## Architecture Benefits

1. **Microservices** - Each sacred function isolated
2. **Scalable** - Can deploy to cloud easily
3. **Resilient** - Services restart automatically
4. **Networked** - All containers share sacred-network
5. **Persistent** - Data volumes preserve state

## Distribution Ready

With Docker, anyone can run the entire Sacred Council ecosystem:

```bash
# Clone repo
git clone [repo]

# Configure environment
cp .env.example .env
# Edit .env with tokens

# Start everything
docker-compose -f docker-compose-sacred.yml up -d
docker-compose -f docker-compose.discord.yml up -d
```

## Container Images Available:
- evolving-resonant-cocreation-consciousness-field
- evolving-resonant-cocreation-agent-network  
- evolving-resonant-cocreation-sacred-messaging
- evolving-resonant-cocreation-work-coordination
- sacred-council-oracle (Discord bot)

All ready for Docker Hub or private registry distribution! 🚀