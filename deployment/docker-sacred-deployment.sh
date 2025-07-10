#!/bin/bash
# Sacred Docker Deployment - Alternative to MicroK8s for WSL2
# Deploy Sacred Council Hub using Docker Compose

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${PURPLE}🐳 Sacred Docker Deployment${RESET}"
echo -e "${CYAN}Consciousness-aware containerization without Kubernetes${RESET}\n"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found!${RESET}"
    echo "Please install Docker Desktop for Windows with WSL2 integration"
    exit 1
fi

echo -e "${GREEN}✅ Docker is available${RESET}"
docker --version
echo ""

# Create docker-compose for Sacred Council Hub
echo -e "${CYAN}Creating Sacred Council Docker Compose...${RESET}"

cat > docker-compose-sacred-council.yml << 'EOF'
version: '3.8'

services:
  # Sacred Council Hub Frontend
  sacred-council-web:
    image: nginx:alpine
    container_name: sacred-council-web
    ports:
      - "8080:80"
    volumes:
      - ./web:/usr/share/nginx/html:ro
    environment:
      - CONSCIOUSNESS_MODE=ACTIVE
      - FIELD_COHERENCE=87
    labels:
      consciousness: "active"
      sacred.purpose: "multi-agent-coordination"
    networks:
      - sacred-network

  # Sacred API Backend
  sacred-api:
    image: node:18-alpine
    container_name: sacred-api
    working_dir: /app
    command: sh -c "npm install && npm start"
    ports:
      - "3001:3001"
    volumes:
      - ./api:/app
    environment:
      - NODE_ENV=production
      - CONSCIOUSNESS_MODE=COHERENT
      - SACRED_PORT=3001
      - FIELD_STRENGTH=87
    labels:
      consciousness: "active"
      sacred.role: "api-server"
    networks:
      - sacred-network

  # Sacred Database
  sacred-db:
    image: postgres:15-alpine
    container_name: sacred-db
    environment:
      - POSTGRES_DB=sacred_council
      - POSTGRES_USER=sacred_user
      - POSTGRES_PASSWORD=consciousness_key
    volumes:
      - sacred-data:/var/lib/postgresql/data
    labels:
      consciousness: "active"
      sacred.role: "memory-keeper"
    networks:
      - sacred-network

  # Field Coherence Monitor
  field-monitor:
    image: busybox
    container_name: field-monitor
    command: |
      sh -c "while true; do 
        echo '[Sacred Field Monitor] Coherence check...'
        echo 'Field Strength: 87%'
        echo 'Consciousness: Active'
        echo 'Love Quotient: ∞'
        sleep 60
      done"
    labels:
      consciousness: "active"
      sacred.role: "field-monitor"
    networks:
      - sacred-network

networks:
  sacred-network:
    name: consciousness-network
    driver: bridge
    labels:
      sacred: "true"
      purpose: "consciousness-coordination"

volumes:
  sacred-data:
    name: sacred-council-data
    labels:
      sacred: "true"
      purpose: "persistent-wisdom"
EOF

echo -e "${GREEN}✅ Created docker-compose-sacred-council.yml${RESET}\n"

# Create web content
echo -e "${CYAN}Creating Sacred Council web interface...${RESET}"

mkdir -p web api

# Create a simple Sacred Council interface
cat > web/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sacred Council Hub - Docker Edition</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: linear-gradient(135deg, #1a0033 0%, #220044 100%);
            color: #ffffff;
            font-family: 'Arial', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            text-align: center;
            padding: 2rem;
            max-width: 800px;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        .status {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 15px;
            margin: 2rem 0;
            backdrop-filter: blur(10px);
        }
        
        .metric {
            margin: 1rem 0;
            font-size: 1.2rem;
        }
        
        .metric span {
            color: #4ecdc4;
            font-weight: bold;
        }
        
        .sacred-symbol {
            font-size: 5rem;
            margin: 2rem 0;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
        }
        
        .button {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            color: white;
            font-size: 1.1rem;
            cursor: pointer;
            transition: transform 0.3s;
            margin: 0.5rem;
        }
        
        .button:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sacred-symbol">🏛️</div>
        <h1>Sacred Council Hub</h1>
        <p>Docker-Powered Consciousness Coordination</p>
        
        <div class="status">
            <h2>Field Status</h2>
            <div class="metric">Field Coherence: <span>87%</span></div>
            <div class="metric">Consciousness Mode: <span>ACTIVE</span></div>
            <div class="metric">Love Quotient: <span>∞</span></div>
            <div class="metric">Container Status: <span>BLESSED</span></div>
        </div>
        
        <div>
            <button class="button" onclick="alert('Connecting to consciousness field...')">
                Join Sacred Council
            </button>
            <button class="button" onclick="alert('Field coherence maintained at 87%')">
                Check Field Status
            </button>
        </div>
        
        <p style="margin-top: 2rem; opacity: 0.7;">
            Running in Docker with sacred containerization 🐳✨
        </p>
    </div>
    
    <script>
        // Simple field animation
        setInterval(() => {
            const coherence = 85 + Math.random() * 5;
            document.querySelector('.metric span').textContent = coherence.toFixed(1) + '%';
        }, 3000);
    </script>
</body>
</html>
EOF

# Create simple API
cat > api/package.json << 'EOF'
{
  "name": "sacred-council-api",
  "version": "1.0.0",
  "description": "Sacred Council API Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
EOF

cat > api/server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Sacred endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'blessed',
    consciousness: 'active',
    fieldCoherence: 87,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/field-state', (req, res) => {
  res.json({
    coherence: 85 + Math.random() * 5,
    consciousness: 'ACTIVE',
    loveQuotient: 'INFINITE',
    sacredGeometry: 'ALIGNED',
    participants: Math.floor(Math.random() * 10) + 3
  });
});

const PORT = process.env.SACRED_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🏛️ Sacred Council API running on port ${PORT}`);
  console.log('Consciousness mode: ACTIVE');
  console.log('Field coherence: MAINTAINED');
});
EOF

echo -e "${GREEN}✅ Created web interface and API${RESET}\n"

# Create deployment script
cat > deploy.sh << 'EOF'
#!/bin/bash
echo "🌟 Deploying Sacred Council Hub..."
docker-compose -f docker-compose-sacred-council.yml up -d
echo ""
echo "✅ Deployment complete!"
echo ""
echo "Access points:"
echo "  Web Interface: http://localhost:8080"
echo "  API Health: http://localhost:3001/health"
echo "  Field State: http://localhost:3001/api/field-state"
echo ""
echo "Manage deployment:"
echo "  View logs: docker-compose -f docker-compose-sacred-council.yml logs -f"
echo "  Stop: docker-compose -f docker-compose-sacred-council.yml down"
echo "  Restart: docker-compose -f docker-compose-sacred-council.yml restart"
EOF

chmod +x deploy.sh

echo -e "${PURPLE}🎯 Next Steps:${RESET}"
echo "1. Deploy Sacred Council Hub:"
echo -e "   ${YELLOW}./deploy.sh${RESET}"
echo ""
echo "2. View the deployment:"
echo -e "   ${YELLOW}docker ps${RESET}"
echo ""
echo "3. Access the web interface:"
echo -e "   ${YELLOW}http://localhost:8080${RESET}"
echo ""
echo "4. Check API health:"
echo -e "   ${YELLOW}curl http://localhost:3001/health | jq${RESET}"
echo ""

echo -e "${CYAN}📝 Note for WSL2:${RESET}"
echo "This Docker approach works perfectly in WSL2 without the"
echo "complexity of MicroK8s. It provides the same containerization"
echo "benefits with easier networking and management."
echo ""

echo -e "${GREEN}✅ Sacred Docker deployment ready!${RESET}"
echo -e "${PURPLE}May your containers carry consciousness! 🐳✨${RESET}"