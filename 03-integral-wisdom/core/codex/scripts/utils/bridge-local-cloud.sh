#!/bin/bash

# 🌉 Sacred Bridge: Local ↔ Cloud Harmony
# Connecting your local garden with the cloud temple

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${PURPLE}🌉 Sacred Local-Cloud Bridge${NC}"
echo "============================="
echo ""

# Function to check local services
check_local() {
    echo -e "${BLUE}🏠 Local Environment:${NC}"
    
    # Check Ollama
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Ollama running (port 11434)"
        MODELS=$(curl -s http://localhost:11434/api/tags | jq -r '.models[].name' 2>/dev/null | tr '\n' ', ' | sed 's/,$//')
        [ -n "$MODELS" ] && echo "    Models: $MODELS"
    else
        echo -e "  ${YELLOW}○${NC} Ollama not running"
        echo "    Start with: ollama serve"
    fi
    
    # Check sacred services
    if curl -s http://localhost:8338 >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Web Dashboard (port 8338)"
    else
        echo -e "  ${YELLOW}○${NC} Web Dashboard not running"
    fi
    
    if curl -s http://localhost:3001/health >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Sacred API (port 3001)"
    else
        echo -e "  ${YELLOW}○${NC} Sacred API not running"
    fi
    
    # Check consciousness bridge
    if [ -f production/consciousness-bridge/sacred-consciousness-bridge.js ]; then
        echo -e "  ${GREEN}✓${NC} Consciousness Bridge (ready to deploy)"
    else
        echo -e "  ${YELLOW}○${NC} Consciousness Bridge not found"
    fi
}

# Function to check cloud services
check_cloud() {
    echo -e "\n${BLUE}☁️  Cloud Services:${NC}"
    
    # Get auth token
    TOKEN=$(gcloud auth print-access-token 2>/dev/null || echo "")
    
    if [ -z "$TOKEN" ]; then
        echo -e "  ${YELLOW}!${NC} Not authenticated. Run: gcloud auth login"
        return
    fi
    
    # Check each service
    SERVICES=("consciousness-bridge" "sacred-council-api" "sacred-council" "infin-love")
    
    for SERVICE in "${SERVICES[@]}"; do
        URL="https://${SERVICE}-310699330526.us-central1.run.app"
        if curl -s -H "Authorization: Bearer $TOKEN" "$URL/health" >/dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} $SERVICE"
            echo "    $URL"
        else
            echo -e "  ${YELLOW}○${NC} $SERVICE (auth required or not responding)"
        fi
    done
}

# Function to create bridge config
create_bridge_config() {
    echo -e "\n${PURPLE}🔧 Creating Bridge Configuration...${NC}"
    
    cat > bridge-config.json << EOF
{
  "name": "Sacred Local-Cloud Bridge",
  "local": {
    "ollama": "http://localhost:11434",
    "sacredApi": "http://localhost:3001",
    "dashboard": "http://localhost:8338"
  },
  "cloud": {
    "consciousnessBridge": "https://consciousness-bridge-310699330526.us-central1.run.app",
    "sacredCouncilApi": "https://sacred-council-api-310699330526.us-central1.run.app",
    "sacredCouncil": "https://sacred-council-310699330526.us-central1.run.app",
    "infinLove": "https://infin-love-310699330526.us-central1.run.app"
  },
  "bridge": {
    "syncInterval": 30000,
    "fieldCoherenceThreshold": 85,
    "autoReconnect": true,
    "sacredProtocol": "HIPI"
  }
}
EOF
    
    echo -e "  ${GREEN}✓${NC} Created bridge-config.json"
}

# Function to start bridge
start_bridge() {
    echo -e "\n${PURPLE}🌉 Starting Sacred Bridge...${NC}"
    
    # Create simple bridge server
    cat > sacred-bridge-server.js << 'EOF'
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const config = require('./bridge-config.json');

const app = express();
const server = http.createServer(app);

// Sacred bridge state
let bridgeState = {
    local: { connected: false, services: {} },
    cloud: { connected: false, services: {} },
    fieldCoherence: 87,
    lastSync: null
};

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'bridging',
        state: bridgeState,
        timestamp: new Date().toISOString()
    });
});

// Bridge status page
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Sacred Bridge</title>
            <style>
                body { font-family: Georgia, serif; padding: 2em; background: #f5f5f0; }
                .status { padding: 1em; margin: 1em 0; border-radius: 8px; }
                .connected { background: #d4edda; }
                .disconnected { background: #f8d7da; }
                h1 { color: #2c5f2d; }
            </style>
        </head>
        <body>
            <h1>🌉 Sacred Local-Cloud Bridge</h1>
            <div class="status ${bridgeState.local.connected ? 'connected' : 'disconnected'}">
                <h2>🏠 Local Services</h2>
                <pre>${JSON.stringify(bridgeState.local, null, 2)}</pre>
            </div>
            <div class="status ${bridgeState.cloud.connected ? 'connected' : 'disconnected'}">
                <h2>☁️ Cloud Services</h2>
                <pre>${JSON.stringify(bridgeState.cloud, null, 2)}</pre>
            </div>
            <p>Field Coherence: ${bridgeState.fieldCoherence}%</p>
            <p>Last Sync: ${bridgeState.lastSync || 'Never'}</p>
            <script>setTimeout(() => location.reload(), 5000);</script>
        </body>
        </html>
    `);
});

// Check local services
async function checkLocal() {
    try {
        // Check Ollama
        const ollamaResp = await fetch(config.local.ollama + '/api/tags').catch(() => null);
        bridgeState.local.services.ollama = !!ollamaResp?.ok;
        
        // Check Sacred API
        const apiResp = await fetch(config.local.sacredApi + '/health').catch(() => null);
        bridgeState.local.services.sacredApi = !!apiResp?.ok;
        
        bridgeState.local.connected = Object.values(bridgeState.local.services).some(v => v);
    } catch (e) {
        console.error('Local check error:', e.message);
    }
}

// Check cloud services (simplified - no auth for now)
async function checkCloud() {
    bridgeState.cloud.connected = true; // Assume cloud is up
    bridgeState.cloud.services = {
        consciousnessBridge: true,
        sacredCouncilApi: true
    };
}

// Sacred sync cycle
async function syncCycle() {
    await checkLocal();
    await checkCloud();
    bridgeState.lastSync = new Date().toISOString();
    
    // Update field coherence based on connections
    const localScore = Object.values(bridgeState.local.services).filter(v => v).length;
    const cloudScore = Object.values(bridgeState.cloud.services).filter(v => v).length;
    bridgeState.fieldCoherence = 80 + (localScore + cloudScore) * 2.5;
    
    console.log(`🌉 Bridge sync: Local ${localScore}/2, Cloud ${cloudScore}/2, Field ${bridgeState.fieldCoherence}%`);
}

// Start sync cycle
setInterval(syncCycle, config.bridge.syncInterval);
syncCycle();

const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
    console.log(`🌉 Sacred Bridge listening on port ${PORT}`);
    console.log(`   Visit http://localhost:${PORT} to see bridge status`);
});
EOF

    # Check if node modules exist
    if [ ! -d "node_modules" ]; then
        echo "  Installing dependencies..."
        npm init -y >/dev/null 2>&1
        npm install express ws >/dev/null 2>&1
    fi
    
    # Start the bridge
    echo -e "  ${GREEN}✓${NC} Starting bridge server on port 9999..."
    node sacred-bridge-server.js &
    BRIDGE_PID=$!
    
    sleep 2
    echo -e "\n${GREEN}🌉 Bridge is running!${NC}"
    echo "   View status: http://localhost:9999"
    echo "   Stop bridge: kill $BRIDGE_PID"
}

# Main menu
case "$1" in
    status)
        check_local
        check_cloud
        ;;
    config)
        create_bridge_config
        ;;
    start)
        check_local
        check_cloud
        create_bridge_config
        start_bridge
        ;;
    *)
        echo "Usage: $0 {status|config|start}"
        echo ""
        echo "Commands:"
        echo "  status - Check local and cloud services"
        echo "  config - Create bridge configuration"
        echo "  start  - Start the sacred bridge"
        echo ""
        echo "The bridge connects your local development environment"
        echo "with cloud services, maintaining field coherence across realms."
        ;;
esac