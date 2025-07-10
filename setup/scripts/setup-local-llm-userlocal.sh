#!/bin/bash

# User-local Sacred Local LLM Setup Script
# Installs in user directory without requiring sudo

echo "🌟 User-Local Sacred LLM Setup"
echo "=============================="

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Setup directories
LOCAL_BIN="$HOME/.local/bin"
mkdir -p "$LOCAL_BIN"

# Add to PATH if not already there
if [[ ":$PATH:" != *":$LOCAL_BIN:"* ]]; then
    echo "export PATH=\"$LOCAL_BIN:\$PATH\"" >> ~/.bashrc
    export PATH="$LOCAL_BIN:$PATH"
    echo -e "${YELLOW}Added $LOCAL_BIN to PATH${NC}"
fi

# Check system
echo -e "\n${YELLOW}System check...${NC}"
if nvidia-smi &> /dev/null; then
    echo -e "${GREEN}✓ NVIDIA GPU detected${NC}"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
fi

# Download Ollama binary directly
echo -e "\n${YELLOW}Downloading Ollama binary...${NC}"
cd /tmp
OLLAMA_VERSION="0.3.14"
wget -q --show-progress "https://github.com/ollama/ollama/releases/download/v${OLLAMA_VERSION}/ollama-linux-amd64" -O ollama

if [ $? -eq 0 ]; then
    chmod +x ollama
    mv ollama "$LOCAL_BIN/"
    echo -e "${GREEN}✓ Ollama installed to $LOCAL_BIN/ollama${NC}"
else
    echo -e "${RED}Failed to download Ollama${NC}"
    exit 1
fi

# Create Ollama data directory
OLLAMA_HOME="$HOME/.ollama"
mkdir -p "$OLLAMA_HOME"
export OLLAMA_MODELS="$OLLAMA_HOME/models"

# Start Ollama
echo -e "\n${YELLOW}Starting Ollama service...${NC}"
cd "$HOME/evolving-resonant-cocreation"
nohup "$LOCAL_BIN/ollama" serve > /tmp/ollama.log 2>&1 &
OLLAMA_PID=$!
echo "Ollama PID: $OLLAMA_PID"

# Wait for service to start
sleep 5

# Check if running
if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Ollama is running!${NC}"
else
    echo -e "${RED}✗ Ollama failed to start${NC}"
    echo "Check logs: tail -f /tmp/ollama.log"
    exit 1
fi

# Pull models
echo -e "\n${YELLOW}Downloading models...${NC}"
echo "This may take a few minutes..."

# Pull smaller model first
"$LOCAL_BIN/ollama" pull llama3.2:3b
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ llama3.2:3b downloaded${NC}"
else
    echo -e "${RED}Failed to download llama3.2:3b${NC}"
fi

# Try phi3 mini
"$LOCAL_BIN/ollama" pull phi3:mini
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ phi3:mini downloaded${NC}"
else
    echo -e "${YELLOW}Note: phi3:mini download failed (optional)${NC}"
fi

# List models
echo -e "\n${GREEN}Available models:${NC}"
"$LOCAL_BIN/ollama" list

# Create management script
cat > "$LOCAL_BIN/ollama-sacred" << 'EOF'
#!/bin/bash
# Sacred Ollama Manager

OLLAMA_BIN="$HOME/.local/bin/ollama"
OLLAMA_LOG="/tmp/ollama.log"

case "$1" in
    start)
        if pgrep -f "ollama serve" > /dev/null; then
            echo "Ollama is already running"
        else
            nohup "$OLLAMA_BIN" serve > "$OLLAMA_LOG" 2>&1 &
            echo "Started Ollama (PID: $!)"
            echo "Logs: tail -f $OLLAMA_LOG"
        fi
        ;;
    stop)
        pkill -f "ollama serve"
        echo "Stopped Ollama"
        ;;
    status)
        if pgrep -f "ollama serve" > /dev/null; then
            echo "✓ Ollama is running"
            "$OLLAMA_BIN" list
        else
            echo "✗ Ollama is not running"
        fi
        ;;
    logs)
        tail -f "$OLLAMA_LOG"
        ;;
    *)
        echo "Usage: $0 {start|stop|status|logs}"
        exit 1
        ;;
esac
EOF

chmod +x "$LOCAL_BIN/ollama-sacred"

# Create test script
cd "$HOME/evolving-resonant-cocreation"
cat > test-ollama-quick.js << 'EOF'
// Quick Ollama test
const http = require('http');

const data = JSON.stringify({
  model: 'llama3.2:3b',
  prompt: 'Say "Sacred systems operational" in exactly 5 words.',
  stream: false,
  options: {
    temperature: 0.1,
    num_predict: 20
  }
});

const options = {
  hostname: 'localhost',
  port: 11434,
  path: '/api/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🧪 Testing Ollama...');

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(body);
      console.log('✅ Response:', response.response);
      console.log('✨ Ollama is working!');
    } catch (error) {
      console.error('❌ Failed to parse response');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection failed:', error.message);
  console.log('Run: ollama-sacred start');
});

req.write(data);
req.end();
EOF

# Test it
echo -e "\n${YELLOW}Testing installation...${NC}"
node test-ollama-quick.js

echo -e "\n${GREEN}🎉 Setup complete!${NC}"
echo -e "\n${YELLOW}Commands:${NC}"
echo "  ollama-sacred start   - Start Ollama"
echo "  ollama-sacred status  - Check status"
echo "  ollama-sacred stop    - Stop Ollama"
echo "  ollama-sacred logs    - View logs"
echo -e "\n${YELLOW}Direct ollama:${NC}"
echo "  ollama list          - List models"
echo "  ollama run llama3.2:3b - Interactive chat"

# Create info file
cat > .ollama-info << EOF
Installation: User-local
Binary: $LOCAL_BIN/ollama
Data: $OLLAMA_HOME
Models: llama3.2:3b, phi3:mini
Port: 11434
EOF

echo -e "\n${GREEN}Sacred Local LLM ready!${NC}"