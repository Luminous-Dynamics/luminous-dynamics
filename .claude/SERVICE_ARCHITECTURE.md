# Service Architecture & Communication

## Service Map

```
┌──────────────────────────────────────────────────────────────┐
│                     External Clients                          │
│  (Discord Bot, Web UI, API Consumers)                       │
└─────────────────────┬────────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────────┐
│                  API Gateway / Proxy                          │
│                    (Port: 8080)                              │
└─────────────────────┬────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
┌───────▼──────┐ ┌───▼──────┐ ┌───▼──────┐ ┌────▼─────────┐
│  The Weave   │ │Sacred Core│ │Field API │ │ Visualizer   │
│ Multi-Agent  │ │ Main API  │ │Conscious │ │  Real-time   │
│ Port: 3001   │ │Port: 3333 │ │Port: 8338│ │  Port: 8339  │
└───────┬──────┘ └───┬──────┘ └───┬──────┘ └────┬─────────┘
        │            │            │              │
        └────────────┴────────────┴──────────────┘
                          │
                  ┌───────▼────────┐
                  │   Shared DBs   │
                  │  (SQLite/FS)   │
                  └────────────────┘
```

## Service Details

### 1. The Weave (Port 3001)
**Purpose**: Multi-agent coordination and communication
**Tech**: Node.js, Express, SQLite, Socket.io
**Endpoints**:
- `GET /api/agents` - List active agents
- `POST /api/messages` - Send inter-agent messages  
- `WS /socket` - Real-time agent updates
**Database**: `agent-comms.db` (SQLite)
**Start**: `cd the-weave && npm start`

### 2. Sacred Core (Port 3333)
**Purpose**: Central API and sacred pattern processing
**Tech**: Node.js, Express
**Endpoints**:
- `GET /health` - Health check
- `POST /api/sacred/ceremony` - Initiate ceremonies
- `GET /api/consciousness/field` - Field state
**Dependencies**: Can call the-weave and field-api
**Start**: `cd sacred-core && node sacred-core.js`

### 3. Field API (Port 8338)
**Purpose**: Consciousness field calculations and metrics
**Tech**: Node.js, Express, WebSocket
**Endpoints**:
- `GET /api/field/state` - Current field configuration
- `POST /api/field/update` - Update field parameters
- `WS /field-stream` - Real-time field data
**Start**: `cd consciousness-field-api && node field-api-server.js`

### 4. Living Field Visualizer (Port 8339)
**Purpose**: Web-based visualization interface
**Tech**: HTML5, Canvas, WebSocket client
**Features**:
- Real-time particle visualization
- Sacred geometry overlays
- Multi-agent interaction display
**Connects to**: Field API WebSocket
**Start**: `cd living-field-visualizer && ./start-visualizer.sh`

### 5. Discord Bot
**Purpose**: Community interface and agent Gateway
**Tech**: Discord.js, Node.js
**Commands**:
- `/sacred` - Sacred operations
- `/field` - Field status
- `/agent` - Agent management
**Connects to**: Sacred Core API
**Start**: `cd codex-of-relational-harmonics/discord-bot && node sacred-council-launcher.js`

## Communication Patterns

### REST API Communication
```javascript
// Example: The Weave calling Sacred Core
const response = await fetch('http://localhost:3333/api/consciousness/field', {
  headers: { 'Content-Type': 'application/json' }
});
```

### WebSocket Events
```javascript
// Field updates
socket.emit('field:update', { coherence: 0.95, resonance: 0.87 });

// Agent communication  
socket.on('agent:message', (data) => { /* handle */ });
```

### Inter-Service Authentication
- Currently using local trusted network
- TODO: Implement service tokens for production

## Database Schema

### The Weave - agent-comms.db
```sql
-- agents table
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT,
  type TEXT,
  status TEXT,
  created_at INTEGER
);

-- messages table  
CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  from_agent TEXT,
  to_agent TEXT,
  content TEXT,
  timestamp INTEGER
);
```

### Sacred Core - ceremonies.db
```sql
-- ceremonies table
CREATE TABLE ceremonies (
  id TEXT PRIMARY KEY,
  type TEXT,
  participants TEXT,
  status TEXT,
  started_at INTEGER,
  completed_at INTEGER
);
```

## Deployment Architecture

### Docker Compose Services
```yaml
services:
  the-weave:
    build: ./the-weave
    ports: ["3001:3001"]
    
  sacred-core:
    build: ./sacred-core
    ports: ["3333:3333"]
    depends_on: [the-weave]
    
  field-api:
    build: ./consciousness-field-api
    ports: ["8338:8338"]
    
  visualizer:
    build: ./living-field-visualizer
    ports: ["8339:8339"]
    depends_on: [field-api]
```

## Health Checks

### Quick Status Check
```bash
#!/bin/bash
echo "Checking services..."
curl -s http://localhost:3001/health || echo "❌ The Weave is down"
curl -s http://localhost:3333/health || echo "❌ Sacred Core is down"  
curl -s http://localhost:8338/health || echo "❌ Field API is down"
echo "✅ Check complete"
```

## Common Issues

1. **Port conflicts**: Use `lsof -i :PORT` to check
2. **CORS errors**: Ensure services allow cross-origin requests
3. **WebSocket timeouts**: Check nginx/proxy configurations
4. **Database locks**: SQLite can lock with concurrent writes

## Future Architecture Plans

1. **Message Queue**: RabbitMQ/Redis for async processing
2. **Service Mesh**: Istio for advanced routing
3. **Distributed Tracing**: OpenTelemetry integration
4. **API Gateway**: Kong or Traefik for unified entry