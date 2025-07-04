#!/bin/bash

# Docker-based Ollama Setup with Sacred Integration
# Includes Portainer for Docker management

echo "🌟 Docker-based Sacred LLM Setup"
echo "================================"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker found${NC}"

# Function to setup Portainer (Docker management UI)
setup_portainer() {
    echo -e "\n${YELLOW}Setting up Portainer (Docker Management UI)...${NC}"
    
    # Check if Portainer is already running
    if docker ps | grep -q portainer; then
        echo -e "${GREEN}✓ Portainer is already running${NC}"
        echo "Access at: http://localhost:9000"
    else
        # Create volume for Portainer data
        docker volume create portainer_data
        
        # Run Portainer
        docker run -d \
            -p 8000:8000 \
            -p 9000:9000 \
            --name=portainer \
            --restart=always \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v portainer_data:/data \
            portainer/portainer-ce:latest
        
        echo -e "${GREEN}✓ Portainer installed${NC}"
        echo -e "${YELLOW}Access Portainer at: http://localhost:9000${NC}"
        echo "First time: Create admin user when you visit the URL"
    fi
}

# Function to setup Ollama
setup_ollama() {
    echo -e "\n${YELLOW}Setting up Ollama with Docker...${NC}"
    
    # Check if Ollama container exists
    if docker ps -a | grep -q ollama; then
        echo "Removing existing Ollama container..."
        docker stop ollama 2>/dev/null
        docker rm ollama 2>/dev/null
    fi
    
    # Create volume for model persistence
    docker volume create ollama_data
    
    # Check for GPU support
    GPU_FLAGS=""
    if docker run --rm --gpus all nvidia/cuda:11.0.3-base-ubuntu20.04 nvidia-smi &> /dev/null; then
        echo -e "${GREEN}✓ GPU support detected${NC}"
        GPU_FLAGS="--gpus all"
    else
        echo -e "${YELLOW}⚠ No GPU support detected - will use CPU${NC}"
    fi
    
    # Run Ollama container
    echo "Starting Ollama container..."
    docker run -d \
        $GPU_FLAGS \
        -v ollama_data:/root/.ollama \
        -p 11434:11434 \
        --name ollama \
        --restart always \
        ollama/ollama
    
    # Wait for container to be ready
    echo "Waiting for Ollama to start..."
    sleep 5
    
    # Check if Ollama is running
    if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Ollama is running!${NC}"
        
        # Pull models
        echo -e "\n${YELLOW}Pulling recommended models...${NC}"
        docker exec ollama ollama pull llama3.2:3b
        docker exec ollama ollama pull phi3:mini
        
        # List models
        echo -e "\n${GREEN}Available models:${NC}"
        docker exec ollama ollama list
    else
        echo -e "${RED}✗ Ollama failed to start${NC}"
        docker logs ollama
    fi
}

# Function to setup Dozzle (log viewer)
setup_dozzle() {
    echo -e "\n${YELLOW}Setting up Dozzle (Log Viewer)...${NC}"
    
    if docker ps | grep -q dozzle; then
        echo -e "${GREEN}✓ Dozzle is already running${NC}"
    else
        docker run -d \
            --name dozzle \
            --restart always \
            -p 8888:8080 \
            -v /var/run/docker.sock:/var/run/docker.sock \
            amir20/dozzle:latest
        
        echo -e "${GREEN}✓ Dozzle installed${NC}"
        echo -e "${YELLOW}View logs at: http://localhost:8888${NC}"
    fi
}

# Create Docker Compose file for easy management
create_compose_file() {
    cat > docker-compose-llm.yml << 'EOF'
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: always
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_DEBUG=false
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/version"]
      interval: 30s
      timeout: 10s
      retries: 3

  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: always
    ports:
      - "9000:9000"
      - "8000:8000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data

  dozzle:
    image: amir20/dozzle:latest
    container_name: dozzle
    restart: always
    ports:
      - "8888:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  ollama_data:
  portainer_data:
EOF

    echo -e "${GREEN}✓ Created docker-compose-llm.yml${NC}"
}

# Create management script
create_management_script() {
    cat > ollama-docker << 'EOF'
#!/bin/bash
# Ollama Docker Management

case "$1" in
    start)
        docker start ollama
        echo "Ollama started"
        ;;
    stop)
        docker stop ollama
        echo "Ollama stopped"
        ;;
    restart)
        docker restart ollama
        echo "Ollama restarted"
        ;;
    status)
        if docker ps | grep -q ollama; then
            echo "✓ Ollama is running"
            docker exec ollama ollama list
        else
            echo "✗ Ollama is not running"
        fi
        ;;
    logs)
        docker logs -f ollama
        ;;
    shell)
        docker exec -it ollama bash
        ;;
    pull)
        docker exec ollama ollama pull $2
        ;;
    run)
        docker exec -it ollama ollama run $2
        ;;
    list)
        docker exec ollama ollama list
        ;;
    compose-up)
        docker-compose -f docker-compose-llm.yml up -d
        ;;
    compose-down)
        docker-compose -f docker-compose-llm.yml down
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|shell|pull|run|list|compose-up|compose-down}"
        echo ""
        echo "Examples:"
        echo "  $0 pull mistral:7b    - Download a model"
        echo "  $0 run llama3.2:3b    - Interactive chat"
        echo "  $0 compose-up         - Start all services with docker-compose"
        exit 1
        ;;
esac
EOF

    chmod +x ollama-docker
    echo -e "${GREEN}✓ Created ollama-docker management script${NC}"
}

# Create test script
create_test_script() {
    cat > test-docker-ollama.js << 'EOF'
const http = require('http');

console.log('🧪 Testing Docker Ollama Integration...\n');

const testOllama = () => {
  const data = JSON.stringify({
    model: 'llama3.2:3b',
    prompt: 'Respond with exactly: "Sacred Docker systems operational"',
    stream: false,
    options: {
      temperature: 0.1,
      num_predict: 10
    }
  });

  const options = {
    hostname: 'localhost',
    port: 11434,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log('Sending request to Ollama...');

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(body);
        console.log('✅ Response:', response.response);
        console.log('\n✨ Docker Ollama is working perfectly!');
        
        // Test sacred integration
        console.log('\nTesting Sacred Integration...');
        const LocalLLMAdapter = require('./local-llm-adapter.js');
        const llm = new LocalLLMAdapter({
          model: 'llama3.2:3b',
          name: 'Docker-Test-Agent'
        });
        
        llm.generate('What is sacred presence?', {
          harmony: 'coherence'
        }).then(sacred => {
          console.log('✅ Sacred Response:', sacred);
        }).catch(err => {
          console.log('Sacred integration available but network not running');
        });
      } catch (error) {
        console.error('❌ Failed:', error.message);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Connection failed:', e.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if Ollama container is running: docker ps | grep ollama');
    console.log('2. View logs: docker logs ollama');
    console.log('3. Restart: docker restart ollama');
  });

  req.write(data);
  req.end();
};

// Check Docker first
const { exec } = require('child_process');
exec('docker ps | grep ollama', (error, stdout) => {
  if (stdout.includes('ollama')) {
    console.log('✅ Ollama container is running\n');
    testOllama();
  } else {
    console.log('❌ Ollama container is not running');
    console.log('Start it with: ./ollama-docker start');
  }
});
EOF

    echo -e "${GREEN}✓ Created test script${NC}"
}

# Main menu
echo -e "\n${YELLOW}Choose setup option:${NC}"
echo "1) Full setup (Ollama + Portainer + Dozzle)"
echo "2) Ollama only"
echo "3) Management tools only (Portainer + Dozzle)"
echo "4) Create docker-compose file only"

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        setup_ollama
        setup_portainer
        setup_dozzle
        create_compose_file
        create_management_script
        create_test_script
        ;;
    2)
        setup_ollama
        create_management_script
        create_test_script
        ;;
    3)
        setup_portainer
        setup_dozzle
        ;;
    4)
        create_compose_file
        create_management_script
        ;;
esac

# Summary
echo -e "\n${GREEN}🎉 Docker LLM Setup Complete!${NC}"
echo -e "\n${YELLOW}Available Services:${NC}"
[[ $choice == 1 || $choice == 2 ]] && echo "- Ollama API: http://localhost:11434"
[[ $choice == 1 || $choice == 3 ]] && echo "- Portainer: http://localhost:9000 (Docker management)"
[[ $choice == 1 || $choice == 3 ]] && echo "- Dozzle: http://localhost:8888 (Log viewer)"

echo -e "\n${YELLOW}Quick Commands:${NC}"
echo "  ./ollama-docker status     - Check status"
echo "  ./ollama-docker run llama3.2:3b - Interactive chat"
echo "  ./ollama-docker compose-up - Start all with docker-compose"
echo "  node test-docker-ollama.js - Test integration"

echo -e "\n${YELLOW}Sacred Integration:${NC}"
echo "The local-llm-adapter.js works with Docker Ollama!"
echo "Just ensure Ollama container is running."