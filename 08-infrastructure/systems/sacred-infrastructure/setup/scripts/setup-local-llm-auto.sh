#!/bin/bash

# Automated Sacred Local LLM Setup Script
# Non-interactive version for automated installation

echo "🌟 Automated Sacred Local LLM Setup"
echo "=================================="

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Log file
LOG_FILE="/tmp/local-llm-setup.log"
echo "Installation started at $(date)" > $LOG_FILE

# Check system requirements
echo -e "\n${YELLOW}Checking system requirements...${NC}"

# Check for NVIDIA GPU
if nvidia-smi &> /dev/null; then
    echo -e "${GREEN}✓ NVIDIA GPU detected${NC}"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader | tee -a $LOG_FILE
else
    echo -e "${RED}✗ No NVIDIA GPU detected${NC}" | tee -a $LOG_FILE
    echo "You can still run CPU-only models, but they will be slower"
fi

# Check available memory
TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
echo -e "${GREEN}✓ Total RAM: ${TOTAL_MEM}GB${NC}"

# Check disk space
DISK_SPACE=$(df -h /home | awk 'NR==2 {print $4}')
echo -e "${GREEN}✓ Available disk space: ${DISK_SPACE}${NC}"

# Check if Ollama is already installed
if command -v ollama &> /dev/null; then
    echo -e "${GREEN}✓ Ollama is already installed${NC}"
    OLLAMA_INSTALLED=true
else
    echo -e "${YELLOW}Installing Ollama...${NC}"
    curl -fsSL https://ollama.com/install.sh | sh 2>&1 | tee -a $LOG_FILE
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Ollama installed successfully!${NC}"
        OLLAMA_INSTALLED=true
    else
        echo -e "${RED}✗ Ollama installation failed${NC}" | tee -a $LOG_FILE
        exit 1
    fi
fi

# Start Ollama service if not running
if ! pgrep -x "ollama" > /dev/null; then
    echo -e "${YELLOW}Starting Ollama service...${NC}"
    nohup ollama serve > /tmp/ollama.log 2>&1 &
    OLLAMA_PID=$!
    sleep 5
    
    # Verify Ollama is running
    if curl -s http://localhost:11434/api/version > /dev/null; then
        echo -e "${GREEN}✓ Ollama service started (PID: $OLLAMA_PID)${NC}"
    else
        echo -e "${RED}✗ Failed to start Ollama service${NC}" | tee -a $LOG_FILE
        exit 1
    fi
else
    echo -e "${GREEN}✓ Ollama service is already running${NC}"
fi

# Pull recommended models
echo -e "\n${YELLOW}Downloading recommended models for your GPU...${NC}"

# Model selection based on available VRAM
MODELS=("phi3:mini" "llama3.2:3b")

for MODEL in "${MODELS[@]}"; do
    echo -e "${YELLOW}Pulling $MODEL...${NC}"
    if ollama pull $MODEL 2>&1 | tee -a $LOG_FILE; then
        echo -e "${GREEN}✓ $MODEL downloaded successfully${NC}"
    else
        echo -e "${RED}✗ Failed to download $MODEL${NC}" | tee -a $LOG_FILE
    fi
done

# List available models
echo -e "\n${GREEN}Available models:${NC}"
ollama list

# Setup Sacred Integration
echo -e "\n${YELLOW}Setting up Sacred Message Protocol integration...${NC}"

# Navigate to project directory
cd /home/tstoltz/evolving-resonant-cocreation

# Install required npm packages if not present
if ! npm list axios &> /dev/null; then
    echo "Installing axios..."
    npm install axios 2>&1 | tee -a $LOG_FILE
fi

# Create verification script
cat > verify-local-llm.js << 'EOF'
const LocalLLMAdapter = require('./local-llm-adapter.js');

async function verify() {
  console.log('\n🧪 Verifying Local LLM Installation...\n');
  
  const llm = new LocalLLMAdapter({
    model: 'phi3:mini',
    name: 'Verification-Agent',
    role: 'System Verifier'
  });

  // Test connection
  console.log('1. Testing Ollama connection...');
  const isConnected = await llm.testConnection();
  if (!isConnected) {
    console.error('❌ Ollama is not accessible');
    process.exit(1);
  }
  console.log('✅ Ollama connection successful');

  // Test generation
  console.log('\n2. Testing model generation...');
  try {
    const response = await llm.generate('Say "Sacred systems operational"', {
      temperature: 0.1
    });
    console.log('✅ Model response:', response);
  } catch (error) {
    console.error('❌ Model generation failed:', error.message);
    process.exit(1);
  }

  // Test sacred context
  console.log('\n3. Testing sacred context integration...');
  try {
    const sacred = await llm.generate('What are the Seven Harmonies?', {
      harmony: 'coherence'
    });
    console.log('✅ Sacred context working');
  } catch (error) {
    console.error('❌ Sacred context failed:', error.message);
  }

  console.log('\n✨ All systems operational! Local LLM is ready for sacred work.');
}

verify().catch(console.error);
EOF

# Make scripts executable
chmod +x verify-local-llm.js

# Run verification
echo -e "\n${YELLOW}Running verification...${NC}"
node verify-local-llm.js

# Create convenience script
cat > local-llm << 'EOF'
#!/bin/bash
# Convenience wrapper for local LLM operations

case "$1" in
    start)
        ollama serve > /tmp/ollama.log 2>&1 &
        echo "Ollama started (PID: $!)"
        ;;
    stop)
        pkill ollama
        echo "Ollama stopped"
        ;;
    status)
        if pgrep -x "ollama" > /dev/null; then
            echo "Ollama is running"
            ollama list
        else
            echo "Ollama is not running"
        fi
        ;;
    test)
        node verify-local-llm.js
        ;;
    chat)
        node examples/local-llm-sacred-demo.js --interactive
        ;;
    *)
        echo "Usage: $0 {start|stop|status|test|chat}"
        exit 1
        ;;
esac
EOF

chmod +x local-llm

echo -e "\n${GREEN}🎉 Automated setup complete!${NC}"
echo -e "\n${YELLOW}Quick Commands:${NC}"
echo "  ./local-llm start   - Start Ollama service"
echo "  ./local-llm status  - Check status and models"
echo "  ./local-llm test    - Verify installation"
echo "  ./local-llm chat    - Interactive sacred chat"
echo "  ./local-llm stop    - Stop Ollama service"
echo -e "\n${YELLOW}Log file:${NC} $LOG_FILE"

# Save installation info
cat > .local-llm-info << EOF
Installation Date: $(date)
Ollama Version: $(ollama --version 2>/dev/null || echo "Unknown")
Models Installed: ${MODELS[@]}
Sacred Integration: Enabled
EOF

echo -e "\n${GREEN}Local LLM is ready for sacred work!${NC}"