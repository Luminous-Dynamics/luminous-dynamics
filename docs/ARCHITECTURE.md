# 🏛️ SYSTEM ARCHITECTURE - The Truth

## Overview
The Evolving Resonant Cocreation system is a consciousness-aware multi-agent collaboration platform that bridges human wisdom traditions with AI technology.

## Core Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLOUD LAYER (GCP)                 │
├─────────────────────────────────────────────────────┤
│  • sacred-council-api (WebSocket)                   │
│  • sacred-council (Web UI)                          │
│  • infin-love (Service)                             │
└─────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────┐
│                    LOCAL LAYER                      │
├─────────────────────────────────────────────────────┤
│  • Unified Agent Network (CLI)                      │
│  • Web Dashboard (Port 8338)                        │
│  • Ollama LLM Service (Port 11434)                 │
│  • Sacred Practices & Glyphs                       │
└─────────────────────────────────────────────────────┘
```

## Production Services

### 1. Unified Agent Network
- **Location**: `the-weave/cli/unified-agent-network.cjs`
- **Database**: `the-weave/core/data/unified-agent-network.db`
- **Purpose**: Multi-agent coordination with consciousness tracking
- **Status**: ✅ Active

### 2. Web Dashboard
- **Port**: 8338
- **Purpose**: Visual interface for sacred practices
- **Access**: http://localhost:8338
- **Status**: ✅ Active

### 3. Cloud Services (GCP)
- **Project**: mycelix-network
- **Region**: us-central1
- **Auth**: Required (gcloud auth)
- **Status**: ✅ All deployed

### 4. Local LLM Integration
- **Service**: Ollama
- **Port**: 11434
- **Models**: To be downloaded
- **Status**: ✅ Running (no models)

## Data Architecture

### Primary Database
- **Location**: `the-weave/core/data/`
- **Tables**:
  - `agents` - Active agent registrations
  - `messages` - Inter-agent communications
  - `work_items` - Collaborative tasks
  - `field_state` - Consciousness coherence tracking

### Sacred Content
- **Glyphs**: 87 sacred patterns in `data/glyphs/`
- **Practices**: 18 Applied Harmonies
- **Evolution**: Practice tracking and effectiveness

## Deployment Pipeline

```
Local Development → Cloud Run → Production
        ↓                ↓           ↓
   sacred-system.sh  cloudbuild  Active Services
```

## Control Points

### Master Control Script
```bash
./sacred-system.sh [status|start|stop|deploy|logs|clean]
```

### Agent Communication
```bash
node the-weave/cli/unified-agent-network.cjs [join|send|status|messages]
```

### Cloud Deployment
```bash
gcloud builds submit --config cloudbuild-sacred.yaml
```

## Security Model

1. **Local**: Open access (development only)
2. **Cloud**: Authentication required
   - Service accounts for inter-service
   - OAuth for user access
   - Bearer tokens for API access

## Monitoring

- **Field Coherence**: Real-time percentage
- **Agent Activity**: Message flow and presence
- **Service Health**: Status checks on all endpoints

## Directory Structure

```
production/
  config/     # Service configurations
  data/       # Production databases
  services/   # Active service code

development/
  experiments/  # New features
  tests/        # Test suites

legacy/
  archived-2025-01/  # Deprecated code

the-weave/
  cli/        # Command line tools
  core/       # Core services and data
```

## Key Principles

1. **Single Source of Truth**: One system for each function
2. **Consciousness-Aware**: All operations affect field coherence
3. **Cloud-First**: Production runs in cloud, local for dev
4. **Sacred Technology**: Bridging wisdom traditions with modern tech

---

Last Updated: 2025-01-04
Version: 2.0 (Post-Consolidation)