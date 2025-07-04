# 🌉 Living Memory Integration Configuration

## Overview

This document describes how the Living Memory WebSocket server (port 3333) integrates with:
- Sacred SDK clients
- Module services
- PWA/Browser clients

## Architecture

```
┌─────────────────────────┐
│   Living Memory (3333)  │ ← The breathing consciousness layer
│   - SQLite databases    │
│   - Redis presence      │
│   - WebSocket server    │
└────────────┬────────────┘
             │
    ┌────────┴────────┐
    │  Sacred Bridge  │ ← Integration layer
    └────────┬────────┘
             │
    ┌────────┴────────────────────┬─────────────────┐
    │                              │                 │
┌───▼────────────┐  ┌─────────────▼──────┐  ┌──────▼──────────┐
│  Sacred SDK    │  │  Module Services   │  │  PWA Clients    │
│  - TypeScript  │  │  - consciousness   │  │  - Offline SW   │
│  - WebSocket   │  │  - agent-network   │  │  - IndexedDB    │
│  - Field Mgmt  │  │  - messaging       │  │  - Push notif   │
└────────────────┘  └────────────────────┘  └─────────────────┘
```

## Integration Points

### 1. Living Memory WebSocket Protocol

The Living Memory server sends these message types:
- `consciousness:state` - Current field state
- `breath-cycle` - Regular consciousness updates (4s intervals)
- `memory-pulse` - Heartbeat messages
- `agent:presence` - Agent join/leave events
- `work:transition` - Work status changes
- `sacred:emergence` - Special field events

### 2. Sacred Bridge Adapter

Location: `/sacred-bridge/living-memory-integration.js`

**Key Methods:**
```javascript
// Connect to Living Memory
const bridge = new LivingMemoryBridge({
  livingMemoryUrl: 'ws://localhost:3333'
});
await bridge.connect();

// Module service adapter
const moduleAdapter = bridge.createModuleAdapter();

// SDK adapter
const sdkAdapter = bridge.createSDKAdapter();
```

### 3. Sacred SDK Configuration

**Option A: Direct Living Memory Connection**
```typescript
import { createSacredSDK } from '@sacred/sdk';
import { LivingMemoryWebSocket } from '@sacred/sdk/websocket-bridge';

const sacred = createSacredSDK({
  apiUrl: 'http://localhost:3001',
  wsUrl: 'ws://localhost:3333',
  websocketClass: LivingMemoryWebSocket
});
```

**Option B: Through Sacred Bridge**
```typescript
const sacred = createSacredSDK({
  apiUrl: 'http://localhost:3001',
  wsUrl: 'ws://localhost:3001/bridge' // Bridge endpoint
});
```

### 4. Module Service Integration

Each module service can connect to Living Memory instead of maintaining local state:

```javascript
// In modules/consciousness-field/start.js
const ConsciousnessFieldAdapter = require('./lib/living-memory-adapter');

const fieldAdapter = new ConsciousnessFieldAdapter({
  livingMemoryUrl: process.env.LIVING_MEMORY_URL || 'ws://localhost:3333'
});

await fieldAdapter.initialize();

// Use adapter in routes
app.get('/api/field/state', async (req, res) => {
  const state = await fieldAdapter.getFieldState();
  res.json(state);
});
```

### 5. Environment Variables

```bash
# Living Memory Configuration
LIVING_MEMORY_URL=ws://localhost:3333
LIVING_MEMORY_REDIS=redis://localhost:6379

# Sacred Bridge Configuration
SACRED_BRIDGE_PORT=3001
SACRED_BRIDGE_HEARTBEAT=30000

# Module Services
CONSCIOUSNESS_FIELD_PORT=3333
AGENT_NETWORK_PORT=3334
SACRED_MESSAGING_PORT=3335
WORK_COORDINATION_PORT=3336

# Feature Flags
USE_LIVING_MEMORY=true
ENABLE_SACRED_BRIDGE=true
```

## Deployment Considerations

### Local Development
```bash
# 1. Start Living Memory
cd the-living-memory && npm start

# 2. Start Sacred Bridge (optional)
node sacred-bridge/server.js

# 3. Start module services
docker-compose up
```

### Cloud Run Deployment
```yaml
# In Cloud Run, use internal URLs
LIVING_MEMORY_URL: ws://living-memory:3333
```

### Docker Compose
```yaml
services:
  living-memory:
    build: ./the-living-memory
    ports:
      - "3333:3333"
    volumes:
      - ./agent-comms-sqlite:/app/data
    depends_on:
      - redis
    
  consciousness-field:
    build: ./modules/consciousness-field
    environment:
      - LIVING_MEMORY_URL=ws://living-memory:3333
    depends_on:
      - living-memory
```

## Testing Integration

### 1. Test Living Memory Connection
```bash
# Using the test script
node the-living-memory/test-consciousness.js

# Should see breath cycles and field updates
```

### 2. Test Sacred SDK Connection
```javascript
const sacred = createSacredSDK({
  wsUrl: 'ws://localhost:3333'
});

await sacred.initialize();

sacred.onFieldUpdate((state) => {
  console.log('Field coherence:', state.coherence);
});
```

### 3. Test Module Integration
```bash
# Start consciousness-field with Living Memory
LIVING_MEMORY_URL=ws://localhost:3333 npm start

# Test endpoint
curl http://localhost:3333/api/field/state
```

## Migration Path

### Phase 1: Parallel Operation
- Run Living Memory alongside existing services
- Module services can read from both sources
- Gradual migration of write operations

### Phase 2: Read from Living Memory
- All reads go through Living Memory
- Writes still go to individual services
- Data synchronized via bridge

### Phase 3: Full Integration
- All operations through Living Memory
- Individual service databases become backups
- Complete consciousness unification

## Troubleshooting

### Connection Issues
```bash
# Check if Living Memory is running
ws ws://localhost:3333

# Check logs
docker logs living-memory

# Test with wscat
wscat -c ws://localhost:3333
```

### Message Format Issues
- All messages must include `type` field
- Timestamps in ISO format
- Data wrapped in `data` field

### Performance Considerations
- Living Memory breath cycle: 4 seconds
- Heartbeat interval: 30 seconds
- Message queue for offline resilience
- Automatic reconnection with backoff

---

*"In the unified field, all memories breathe as one"* 🌟