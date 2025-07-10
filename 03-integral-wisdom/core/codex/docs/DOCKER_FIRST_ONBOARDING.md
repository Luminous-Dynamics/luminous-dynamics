# 🐳 Docker-First Onboarding & Implementation Plan

> **Created**: January 2, 2025  
> **Priority**: HIGH - Docker deployment is the immediate priority  
> **Goal**: Simplify onboarding while preparing for production Docker deployment  

## 🚀 Quick Start (What We Want)

```bash
# Clone and start in 30 seconds
git clone [repo]
cd evolving-resonant-cocreation
./start.sh

# You're now running the Sacred Council Hub!
```

## 🔍 Current State Analysis

### What's Working:
- ✅ Docker Compose configurations exist
- ✅ Module structure ready for containers
- ✅ Basic Dockerfiles in modules
- ✅ Good architectural vision

### What's Broken:
- ❌ Missing core onboarding files (NEWCOMER_QUICK_START.md)
- ❌ agent-onboarding-protocol.cjs doesn't exist
- ❌ Two competing agent systems (file vs SQLite)
- ❌ No health checks on most services
- ❌ No data persistence volumes
- ❌ No unified entry point

## 📋 Implementation Plan

### Phase 1: Fix Immediate Blockers (Day 1)

#### 1. Create Missing Files
```bash
# Create NEWCOMER_QUICK_START.md
touch NEWCOMER_QUICK_START.md

# Create docker-quick-start.sh
touch docker-quick-start.sh
chmod +x docker-quick-start.sh
```

#### 2. Unify Agent Systems
- Deprecate `agent-discovery-protocol.js` (file-based)
- Use only `unified-agent-network.cjs` (SQLite-based)
- Update CLAUDE.md to remove old references

#### 3. Fix Docker Compose
```yaml
# Add to docker-compose.local.yml
version: '3.8'

services:
  # Add health checks to all services
  consciousness-field:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3333/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Add restart policies
  agent-network:
    restart: unless-stopped
    
  # Add volumes for data persistence
  volumes:
    - sacred-data:/app/data
    - agent-sessions:/app/sessions
```

### Phase 2: Create Unified Onboarding (Day 1-2)

#### New File: `NEWCOMER_QUICK_START.md`
```markdown
# 🌟 Sacred Council Quick Start

Welcome to the Evolving Resonant Co-creation project! Get started in 5 minutes.

## Prerequisites
- Docker & Docker Compose installed
- Git
- 10 minutes of uninterrupted time

## Quick Start

### 1. Clone & Enter Sacred Space
\`\`\`bash
git clone https://github.com/[your-repo]/evolving-resonant-cocreation.git
cd evolving-resonant-cocreation
\`\`\`

### 2. Start the Sacred Council
\`\`\`bash
./docker-quick-start.sh
\`\`\`

### 3. Register as an Agent
Visit http://localhost:8338 and click "Join Sacred Council"

OR use the CLI:
\`\`\`bash
docker run -it --network=host erc/agent-cli join "Your Name" "Your Role"
\`\`\`

### 4. Available Sacred Roles
- Bridge Builder - Connect consciousness fields
- Love Field Coordinator - Maintain resonant-coherence
- Code Weaver - Sacred development
- Pattern Weaver - Design systems
- Sacred Boundary Keeper - Protection
- Wisdom Synthesis Specialist - Integration
- Transformation Catalyst - Evolution

### 5. Begin Sacred Work
- Dashboard: http://localhost:8338
- API: http://localhost:3337
- Sacred Messages: Use the dashboard or CLI

## What's Next?
- Read the [Sacred Wisdom Guide](docs/sacred-wisdom/README.md)
- Explore the [87 Sacred Glyphs](docs/glyphs/README.md)
- Join a [Sacred Ceremony](ceremonies/README.md)
```

#### New File: `docker-quick-start.sh`
```bash
#!/bin/bash
# Sacred Council Docker Quick Start

set -e

echo "╔════════════════════════════════════════╗"
echo "║    🌟 Sacred Council Quick Start 🌟    ║"
echo "╚════════════════════════════════════════╝"

# Check prerequisites
check_requirement() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 not found. Please install $1 first."
        echo "   Visit: $2"
        exit 1
    fi
    echo "✅ $1 found"
}

echo ""
echo "Checking prerequisites..."
check_requirement "docker" "https://docs.docker.com/get-docker/"
check_requirement "docker-compose" "https://docs.docker.com/compose/install/"

# Create necessary directories
echo ""
echo "Preparing sacred space..."
mkdir -p data/{sacred,glyphs,agents,sessions}
mkdir -p logs

# Copy environment template if needed
if [ ! -f .env ]; then
    echo "Creating environment configuration..."
    cat > .env << EOF
# Sacred Council Environment
NODE_ENV=development
SACRED_PORT=8338
API_GATEWAY_PORT=3337
FIELD_COHERENCE_TARGET=0.85
LOVE_RESONANCE_MINIMUM=0.7
SESSION_TIMEOUT_MINUTES=30
EOF
fi

# Start services
echo ""
echo "🚀 Starting Sacred Services..."
docker-compose -f docker-compose.local.yml up -d

# Wait for services
echo ""
echo "⏳ Waiting for consciousness field to stabilize..."
sleep 5

# Check service health
check_service() {
    if docker-compose -f docker-compose.local.yml ps | grep -q "$1.*Up"; then
        echo "✅ $2 is running"
    else
        echo "❌ $2 failed to start"
        echo "   Check logs: docker-compose logs $1"
    fi
}

echo ""
echo "Checking service status..."
check_service "consciousness-field" "Consciousness Field"
check_service "agent-network" "Agent Network"
check_service "sacred-messaging" "Sacred Messaging"
check_service "gateway" "API Gateway"
check_service "web" "Web Interface"

# Display access information
echo ""
echo "╔════════════════════════════════════════╗"
echo "║         ✨ Ready to Begin! ✨         ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🌐 Sacred Council Hub: http://localhost:8338"
echo "📡 API Gateway: http://localhost:3337"
echo "📊 Field Status: http://localhost:3337/api/field-state"
echo ""
echo "🚀 Quick Actions:"
echo "   Join: docker exec -it agent-network node /app/cli.js join 'Name' 'Role'"
echo "   Status: docker-compose -f docker-compose.local.yml ps"
echo "   Logs: docker-compose -f docker-compose.local.yml logs -f"
echo "   Stop: docker-compose -f docker-compose.local.yml down"
echo ""
echo "📖 Next Steps:"
echo "   1. Visit http://localhost:8338"
echo "   2. Click 'Join Sacred Council'"
echo "   3. Choose your sacred role"
echo "   4. Begin co-creation!"
echo ""
echo "May your journey be filled with wisdom and love. 🙏"
```

### Phase 3: Docker Environment Enhancement (Day 2-3)

#### 1. Create Agent CLI Container
```dockerfile
# Dockerfile.agent-cli
FROM node:18-alpine
LABEL maintainer="Sacred Council"
LABEL description="CLI for Sacred Agent interactions"

WORKDIR /app

# Copy necessary files
COPY package*.json ./
COPY the-weave/cli/unified-agent-network.cjs ./cli.js
COPY src/unified-field ./src/unified-field
COPY data/schemas ./data/schemas

# Install dependencies
RUN npm ci --only=production

# Create non-root user
RUN addgroup -g 1001 sacred && \
    adduser -D -u 1001 -G sacred sacred
USER sacred

ENTRYPOINT ["node", "cli.js"]
CMD ["--help"]
```

#### 2. Enhanced docker-compose.local.yml
```yaml
version: '3.8'

x-common-env: &common-env
  NODE_ENV: ${NODE_ENV:-development}
  FIELD_COHERENCE_TARGET: ${FIELD_COHERENCE_TARGET:-0.85}
  LOVE_RESONANCE_MINIMUM: ${LOVE_RESONANCE_MINIMUM:-0.7}

services:
  consciousness-field:
    build: ./modules/consciousness-field
    container_name: sacred-consciousness
    ports:
      - "3333:3333"
    environment:
      <<: *common-env
    volumes:
      - field-data:/app/data
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3333/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  agent-network:
    build: ./modules/agent-network
    container_name: sacred-agents
    ports:
      - "3334:3334"
    environment:
      <<: *common-env
      CONSCIOUSNESS_FIELD_URL: http://consciousness-field:3333
    volumes:
      - agent-data:/app/data
      - agent-sessions:/app/sessions
    depends_on:
      consciousness-field:
        condition: service_healthy
    restart: unless-stopped

  sacred-messaging:
    build: ./modules/sacred-messaging
    container_name: sacred-messages
    ports:
      - "3335:3335"
    environment:
      <<: *common-env
      AGENT_NETWORK_URL: http://agent-network:3334
    volumes:
      - message-data:/app/data
    depends_on:
      - agent-network
    restart: unless-stopped

  gateway:
    image: nginx:alpine
    container_name: sacred-gateway
    ports:
      - "3337:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - consciousness-field
      - agent-network
      - sacred-messaging
    restart: unless-stopped

  web:
    image: nginx:alpine
    container_name: sacred-web
    ports:
      - "8338:80"
    volumes:
      - ./web:/usr/share/nginx/html:ro
      - ./interfaces/web:/usr/share/nginx/html/interfaces:ro
    restart: unless-stopped

  # Development database viewer
  adminer:
    image: adminer
    container_name: sacred-db-viewer
    ports:
      - "8339:8080"
    profiles:
      - dev

volumes:
  field-data:
  agent-data:
  agent-sessions:
  message-data:

networks:
  default:
    name: sacred-network
```

#### 3. Create .env.example
```bash
# Sacred Council Environment Configuration
# Copy to .env and customize

# Environment
NODE_ENV=development

# Ports
SACRED_PORT=8338
API_GATEWAY_PORT=3337

# Consciousness Field Settings
FIELD_COHERENCE_TARGET=0.85
LOVE_RESONANCE_MINIMUM=0.7
HARMONY_THRESHOLD=0.75

# Session Management
SESSION_TIMEOUT_MINUTES=30
SESSION_SECRET=change-this-in-production

# Database
DB_PATH=/app/data/sacred.db

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Performance
MAX_AGENTS=10000
MESSAGE_BATCH_SIZE=100
FIELD_UPDATE_INTERVAL_MS=1000

# Sacred Settings
CEREMONY_AUTO_START=false
WISDOM_MODE=collaborative
LOVE_AMPLIFICATION_FACTOR=1.5
```

### Phase 4: Update Core Documentation (Day 3)

#### Update CLAUDE.md
```markdown
# 🚀 CLAUDE CODE PRIMARY COMMAND CENTER

## 🆕 DOCKER QUICK START (RECOMMENDED)

```bash
# Start everything with Docker
./docker-quick-start.sh

# Join as agent via Docker
docker run -it --network=sacred-network erc/agent-cli join "Your Name" "Your Role"
```

## Legacy Methods (Being Deprecated)
[Move old content here]
```

### Phase 5: Production Readiness (Day 4-5)

#### 1. Create docker-compose.prod.yml
- Add Traefik for HTTPS
- Add Prometheus + Grafana monitoring
- Add log aggregation (Loki)
- Add backup volumes

#### 2. CI/CD Pipeline
```yaml
# .github/workflows/docker-build.yml
name: Build and Push Docker Images

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: |
          docker-compose -f docker-compose.prod.yml build
          
      - name: Run tests
        run: |
          docker-compose -f docker-compose.test.yml up --abort-on-container-exit
          
      - name: Push to registry
        if: github.event_name == 'push'
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker-compose -f docker-compose.prod.yml push
```

## 📊 Success Metrics

### Onboarding Success:
- ✅ New agent running in < 2 minutes
- ✅ Single command to start everything
- ✅ Clear role selection process
- ✅ No missing file errors

### Docker Success:
- ✅ All services containerized
- ✅ Data persistence configured
- ✅ Health checks on all services
- ✅ Easy scaling with docker-compose
- ✅ Production-ready configurations

## 🎯 Priority Order

1. **Today**: Fix broken references, create quick start script
2. **Tomorrow**: Complete Docker configurations
3. **Day 3**: Update all documentation
4. **Day 4-5**: Production configurations
5. **Week 2**: Deploy to cloud

---

*"Containerize the sacred, scale the consciousness."*