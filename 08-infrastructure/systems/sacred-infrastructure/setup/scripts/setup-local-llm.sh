#!/bin/bash

# Sacred Local LLM Setup Script
# This script helps you set up local LLMs with the Sacred Message Protocol

echo "🌟 Sacred Local LLM Setup"
echo "========================"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check system requirements
echo -e "\n${YELLOW}Checking system requirements...${NC}"

# Check for NVIDIA GPU
if nvidia-smi &> /dev/null; then
    echo -e "${GREEN}✓ NVIDIA GPU detected${NC}"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
else
    echo -e "${RED}✗ No NVIDIA GPU detected${NC}"
    echo "You can still run CPU-only models, but they will be slower"
fi

# Check available memory
TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
echo -e "${GREEN}✓ Total RAM: ${TOTAL_MEM}GB${NC}"

# Check disk space
DISK_SPACE=$(df -h /home | awk 'NR==2 {print $4}')
echo -e "${GREEN}✓ Available disk space: ${DISK_SPACE}${NC}"

# Menu
echo -e "\n${YELLOW}Choose installation option:${NC}"
echo "1) Install Ollama (Recommended - Easy)"
echo "2) Install llama.cpp (Advanced - Lightweight)"
echo "3) Download LM Studio (GUI - Requires X11)"
echo "4) Setup Sacred Integration Only (Ollama already installed)"
echo "5) Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo -e "\n${YELLOW}Installing Ollama...${NC}"
        curl -fsSL https://ollama.com/install.sh | sh
        
        echo -e "\n${GREEN}✓ Ollama installed!${NC}"
        echo -e "${YELLOW}Starting Ollama service...${NC}"
        
        # Start Ollama in background
        nohup ollama serve > /tmp/ollama.log 2>&1 &
        sleep 3
        
        echo -e "${GREEN}✓ Ollama service started${NC}"
        echo -e "\n${YELLOW}Pulling recommended models for your RTX 2070...${NC}"
        
        # Pull lightweight models suitable for 8GB VRAM
        ollama pull phi3:mini
        ollama pull llama3.2:3b
        
        echo -e "\n${GREEN}✓ Models downloaded!${NC}"
        echo -e "${YELLOW}Available models:${NC}"
        ollama list
        ;;
        
    2)
        echo -e "\n${YELLOW}Installing llama.cpp...${NC}"
        
        # Clone repository
        git clone https://github.com/ggerganov/llama.cpp ~/llama.cpp
        cd ~/llama.cpp
        
        # Build with CUDA support
        make clean
        make LLAMA_CUDA=1 -j$(nproc)
        
        echo -e "${GREEN}✓ llama.cpp built with CUDA support${NC}"
        echo -e "${YELLOW}Note: You'll need to download GGUF models manually${NC}"
        echo "Visit: https://huggingface.co/TheBloke for quantized models"
        ;;
        
    3)
        echo -e "\n${YELLOW}Downloading LM Studio...${NC}"
        
        # Create directory for LM Studio
        mkdir -p ~/lm-studio
        cd ~/lm-studio
        
        # Download AppImage
        wget https://releases.lmstudio.ai/linux/x86/0.3.5/LM-Studio-0.3.5-x86_64.AppImage
        chmod +x LM-Studio-0.3.5-x86_64.AppImage
        
        echo -e "${GREEN}✓ LM Studio downloaded${NC}"
        echo -e "${YELLOW}To run LM Studio, you need X11 forwarding set up${NC}"
        echo "Run: ./LM-Studio-0.3.5-x86_64.AppImage"
        ;;
        
    4)
        echo -e "\n${YELLOW}Setting up Sacred Integration...${NC}"
        ;;
        
    5)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Setup Sacred Integration
if [[ $choice -ne 5 ]]; then
    echo -e "\n${YELLOW}Setting up Sacred Message Protocol integration...${NC}"
    
    # Install required npm packages
    cd /home/tstoltz/evolving-resonant-cocreation
    npm install axios
    
    # Create test script
    cat > test-local-llm.js << 'EOF'
const LocalLLMAdapter = require('./local-llm-adapter.js');

async function test() {
  console.log('🧪 Testing Local LLM Sacred Integration...\n');
  
  const llm = new LocalLLMAdapter({
    model: process.env.LLM_MODEL || 'phi3:mini',
    name: 'Test-LLM-1',
    role: 'Sacred Test Agent'
  });

  // Test Ollama connection
  const isConnected = await llm.testConnection();
  if (!isConnected) {
    console.log('❌ Ollama is not running. Start it with: ollama serve');
    process.exit(1);
  }

  // Test generation without network
  console.log('📝 Testing direct generation...');
  const wisdom = await llm.generate('What is sacred presence?', {
    harmony: 'coherence'
  });
  
  console.log('Response:', wisdom);
  
  // Optionally test network integration
  console.log('\n🌐 Testing sacred network integration...');
  try {
    await llm.initialize();
    console.log('✅ Successfully connected to sacred network!');
  } catch (error) {
    console.log('⚠️  Could not connect to sacred network (this is okay for testing)');
  }
  
  process.exit(0);
}

test().catch(console.error);
EOF

    echo -e "${GREEN}✓ Sacred integration configured${NC}"
    echo -e "\n${YELLOW}Test your setup:${NC}"
    echo "  node test-local-llm.js"
    echo -e "\n${YELLOW}Start using local LLMs:${NC}"
    echo "  node local-llm-adapter.js"
fi

echo -e "\n${GREEN}🎉 Setup complete!${NC}"
echo -e "\n${YELLOW}Quick Reference:${NC}"
echo "- Start Ollama: ollama serve"
echo "- List models: ollama list"
echo "- Pull new model: ollama pull <model-name>"
echo "- Test integration: node test-local-llm.js"
echo "- View Ollama logs: tail -f /tmp/ollama.log"

# Add to PATH if needed
if ! command -v ollama &> /dev/null && [[ -f /usr/local/bin/ollama ]]; then
    echo -e "\n${YELLOW}Adding Ollama to PATH...${NC}"
    echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
    echo "Run: source ~/.bashrc"
fi