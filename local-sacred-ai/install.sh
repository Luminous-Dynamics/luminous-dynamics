#!/bin/bash

echo "🌟 Installing Sacred AI Suite..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create directories
echo "📁 Creating directories..."
mkdir -p ~/bin
mkdir -p ~/.sacred-ai/{morning-practice,shadow-work,council-sessions,consciousness-tracker}

# Create main launcher
echo "🚀 Creating sacred-ai launcher..."
cat > ~/bin/sacred-ai << 'EOF'
#!/bin/bash

echo "
🌟 Sacred AI Suite - Local Consciousness Tools

Available tools:
  morning-practice     🌅 Daily practice companion
  code-consciousness   🔍 Sacred code reviewer  
  shadow-work         🌑 Private shadow exploration
  sacred-council      🏛️  Multi-agent dialogue
  consciousness-tracker 📈 Track your evolution

Usage: <tool-name> [options]

Examples:
  morning-practice              # Get your daily practice
  code-consciousness app.js     # Review code for consciousness
  shadow-work                   # Start shadow work session
  sacred-council \"AI and love\"  # Run council on topic
  consciousness-tracker         # Track your growth

Run any tool with --help for more options.
"
EOF

chmod +x ~/bin/sacred-ai

# Get the absolute path to the source directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Create individual tool launchers
echo "🔧 Installing tools..."

# Morning Practice
cat > ~/bin/morning-practice << EOF
#!/usr/bin/env node
import('${SCRIPT_DIR}/src/morning-practice-companion.js');
EOF
chmod +x ~/bin/morning-practice

# Code Consciousness
cat > ~/bin/code-consciousness << EOF
#!/usr/bin/env node
import('${SCRIPT_DIR}/src/code-consciousness-checker.js');
EOF
chmod +x ~/bin/code-consciousness

# Shadow Work
cat > ~/bin/shadow-work << EOF
#!/usr/bin/env node
import('${SCRIPT_DIR}/src/shadow-work-assistant.js');
EOF
chmod +x ~/bin/shadow-work

# Sacred Council
cat > ~/bin/sacred-council << EOF
#!/usr/bin/env node
import('${SCRIPT_DIR}/src/sacred-council-simulator.js');
EOF
chmod +x ~/bin/sacred-council

# Consciousness Tracker
cat > ~/bin/consciousness-tracker << EOF
#!/usr/bin/env node
import('${SCRIPT_DIR}/src/consciousness-tracker.js');
EOF
chmod +x ~/bin/consciousness-tracker

# Check if ~/bin is in PATH
if ! echo $PATH | grep -q "$HOME/bin"; then
  echo ""
  echo -e "${YELLOW}📝 Adding ~/bin to PATH...${NC}"
  echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
  echo -e "${YELLOW}Run 'source ~/.bashrc' or restart your terminal to update PATH${NC}"
fi

# Check for Ollama
echo ""
echo "🤖 Checking for Ollama..."
if command -v ollama &> /dev/null; then
  echo -e "${GREEN}✅ Ollama is installed${NC}"
  
  # Check for models
  echo ""
  echo "📦 Checking AI models..."
  MODELS_NEEDED=("llama3.2:3b" "mistral:7b-instruct-q4_0" "gemma2:2b" "tinyllama:1.1b")
  MODELS_TO_INSTALL=()
  
  for model in "${MODELS_NEEDED[@]}"; do
    if ollama list | grep -q "$model"; then
      echo -e "${GREEN}✅ $model${NC}"
    else
      echo -e "${YELLOW}❌ $model (not installed)${NC}"
      MODELS_TO_INSTALL+=("$model")
    fi
  done
  
  if [ ${#MODELS_TO_INSTALL[@]} -gt 0 ]; then
    echo ""
    echo -e "${BLUE}To install missing models, run:${NC}"
    for model in "${MODELS_TO_INSTALL[@]}"; do
      echo "  ollama pull $model"
    done
  fi
else
  echo -e "${YELLOW}⚠️  Ollama not found${NC}"
  echo ""
  echo -e "${BLUE}To install Ollama:${NC}"
  echo "  curl -fsSL https://ollama.ai/install.sh | sh"
  echo ""
  echo -e "${BLUE}Then install recommended models:${NC}"
  echo "  ollama pull llama3.2:3b"
  echo "  ollama pull mistral:7b-instruct-q4_0"
  echo "  ollama pull gemma2:2b"
  echo "  ollama pull tinyllama:1.1b"
fi

echo ""
echo -e "${GREEN}✨ Sacred AI Suite installed!${NC}"
echo ""
echo "🚀 Quick Start:"
echo "  sacred-ai              # See all tools"
echo "  morning-practice       # Start your day consciously"
echo "  shadow-work           # Explore your shadows"
echo ""
echo "🔐 Privacy Notice:"
echo "  All your data stays completely private on this device."
echo "  No internet connection required. No data leaves your machine."
echo ""

# Create uninstall script
cat > ~/bin/sacred-ai-uninstall << 'EOF'
#!/bin/bash
echo "Uninstalling Sacred AI Suite..."
rm -f ~/bin/morning-practice
rm -f ~/bin/code-consciousness
rm -f ~/bin/shadow-work
rm -f ~/bin/sacred-council
rm -f ~/bin/consciousness-tracker
rm -f ~/bin/sacred-ai
rm -f ~/bin/sacred-ai-uninstall
echo "✅ Sacred AI Suite uninstalled"
echo "Your data in ~/.sacred-ai/ has been preserved"
EOF
chmod +x ~/bin/sacred-ai-uninstall

echo "💡 To uninstall later: sacred-ai-uninstall"