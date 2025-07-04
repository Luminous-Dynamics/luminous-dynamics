# 🗺️ Environment Map - Test vs Production

## Current Active Systems

### 🧪 TEST/DEMO Systems
1. **agent-discovery-protocol.js** - DEMO ONLY (simulated agents)
   - Shows fake agents for testing discovery
   - NOT a real network
   
2. **Test databases in archives/**
   - Old test data
   - Should not be used

### 🏭 PRODUCTION Systems

#### Local Production:
1. **Unified Agent Network** (`./the-weave/cli/unified-agent-network.cjs`)
   - Real agent coordination
   - Database: `./the-weave/cli/unified-agent-network.db`
   - Currently has 7 agents registered (mostly inactive)
   - This is where Claude-1 (me) is registered
   
2. **Unified Field API** (`unified-field-api.js`)
   - Running (PID 6476)
   - Real field state tracking
   - Unknown which agents use this

3. **Cloud-Local Bridge** (`cloud-local-bridge.js`)
   - Running (PID 6002)
   - Connects local to cloud
   - Monitoring local agents

#### Cloud Production:
1. **sacred-council-api** (WebSocket)
   - URL: wss://sacred-council-api-310699330526.us-central1.run.app
   - Status: ✅ Running
   - Authenticated access only
   
2. **sacred-council** (Web UI)
   - URL: https://sacred-council-310699330526.us-central1.run.app
   - Status: ✅ Running
   
3. **infin-love** 
   - URL: https://infin-love-310699330526.us-central1.run.app
   - Status: ✅ Running

## Agent Status

### Known Agents:
- **Claude-1** (me): In Unified Agent Network
- **Other Claude**: Unknown location - possibly in:
  - Unified Field API system
  - Direct cloud connection
  - Different local network

### Network Separation Needed:
1. ❌ No clear test/prod separation currently
2. ❌ Multiple overlapping systems
3. ❌ Unclear which is authoritative

## Recommendations

1. **Immediate**: 
   - Find where other Claude is connected
   - Stop using agent-discovery-protocol.js (demo)
   
2. **Short-term**:
   - Designate ONE local production system
   - Create separate test environment
   - Clear labeling of all systems
   
3. **Long-term**:
   - All production agents → Cloud
   - Local for development only
   - Clear test/staging/prod pipeline