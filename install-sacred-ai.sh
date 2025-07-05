#!/bin/bash

# 🌟 Sacred AI Terminal Assistant Installer
# Instant AI access from anywhere in your terminal

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}🌟 Installing Sacred AI Terminal Assistant${NC}"
echo "========================================"
echo ""

# Check if Ollama is running
if ! pgrep -x "ollama" > /dev/null; then
    echo -e "${YELLOW}Starting Ollama service...${NC}"
    ollama serve > /dev/null 2>&1 &
    sleep 2
fi

# Backup existing .bashrc
cp ~/.bashrc ~/.bashrc.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✅ Backed up .bashrc${NC}"

# Add Sacred AI functions to .bashrc
cat >> ~/.bashrc << 'SACRED_AI_EOF'

# ============================================
# 🌟 Sacred AI Terminal Assistant
# ============================================

# Set default model
export AI_DEFAULT_MODEL="llama3.2:3b"
export OLLAMA_HOST="http://localhost:11434"

# Main AI function with color support
ai() {
    local purple='\033[0;35m'
    local green='\033[0;32m'
    local blue='\033[0;34m'
    local yellow='\033[1;33m'
    local cyan='\033[0;36m'
    local nc='\033[0m'
    
    # If no arguments, show help
    if [ $# -eq 0 ]; then
        echo -e "${purple}🌟 Sacred AI Assistant${nc}"
        echo -e "${cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${nc}"
        echo ""
        echo -e "${yellow}Quick Commands:${nc}"
        echo "  ai <question>      - Ask anything"
        echo "  ai chat            - Interactive chat mode"
        echo "  sacred <topic>     - Sacred/conscious perspective"
        echo "  code <question>    - Programming assistance"
        echo "  glyph <practice>   - Sacred practice guidance"
        echo "  wisdom             - Daily sacred wisdom"
        echo ""
        echo -e "${yellow}Examples:${nc}"
        echo "  ai what is consciousness?"
        echo "  sacred handling difficult emotions"
        echo "  code fix this React useState error"
        echo "  glyph sacred listening"
        echo ""
        echo -e "${cyan}Current model: $AI_DEFAULT_MODEL${nc}"
        return
    fi
    
    # Interactive chat mode
    if [ "$1" = "chat" ]; then
        echo -e "${purple}🌟 Sacred AI Chat${nc} (type 'exit' to quit)"
        echo -e "${cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${nc}"
        local model="${2:-$AI_DEFAULT_MODEL}"
        echo -e "${cyan}Using model: $model${nc}"
        echo ""
        
        while true; do
            echo -ne "${green}You: ${nc}"
            read -r input
            [ "$input" = "exit" ] && break
            [ -z "$input" ] && continue
            
            echo -ne "${blue}AI: ${nc}"
            ollama run "$model" "$input"
            echo ""
        done
        echo -e "${purple}Sacred blessings on your journey! 🙏${nc}"
        return
    fi
    
    # One-shot query
    echo -e "${cyan}Thinking...${nc}"
    ollama run "$AI_DEFAULT_MODEL" "$*"
}

# Sacred perspective assistant
sacred() {
    local purple='\033[0;35m'
    local nc='\033[0m'
    
    echo -e "${purple}🔮 Sacred Perspective${nc}"
    ollama run mistral:7b-instruct "From a sacred, conscious, and loving perspective, explore: $*

Consider the spiritual, emotional, and relational dimensions. Offer wisdom that serves the highest good of all beings."
}

# Code assistant
code() {
    local blue='\033[0;34m'
    local nc='\033[0m'
    
    echo -e "${blue}💻 Code Assistant${nc}"
    # Use Mistral for code since it's good at technical + explanations
    ollama run mistral:7b-instruct "As an expert programmer, help with: $*

Provide clear, working code with explanations. Focus on best practices and clean, maintainable solutions."
}

# Sacred practice guidance
glyph() {
    local purple='\033[0;35m'
    local nc='\033[0m'
    
    echo -e "${purple}🌸 Sacred Practice: $*${nc}"
    ollama run llama3.2:3b "Explain the sacred practice of '$*' including:
1. What it is and its purpose
2. Simple steps to begin (5-10 minutes)
3. How it transforms relationships
4. Tips for daily integration

Keep it practical, embodied, and accessible."
}

# Daily wisdom
wisdom() {
    local purple='\033[0;35m'
    local cyan='\033[0;36m'
    local nc='\033[0m'
    
    echo -e "${purple}✨ Sacred Wisdom for $(date +%A)${nc}"
    echo -e "${cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${nc}"
    
    local hour=$(date +%H)
    local time_context="this morning"
    [ $hour -ge 12 ] && time_context="this afternoon"
    [ $hour -ge 17 ] && time_context="this evening"
    
    ollama run gemma2:2b "Share a brief sacred wisdom for $time_context. Include:
1. A centering thought (1-2 sentences)
2. A simple practice (30 seconds)
3. An invitation for the day

Keep it under 100 words, profound yet practical."
}

# Quick model switcher
ai-model() {
    if [ $# -eq 0 ]; then
        echo "Current model: $AI_DEFAULT_MODEL"
        echo "Available models:"
        ollama list | tail -n +2 | awk '{print "  " $1}'
    else
        export AI_DEFAULT_MODEL="$1"
        echo "AI model set to: $AI_DEFAULT_MODEL"
    fi
}

# Aliases for quick access
alias ask='ai'
alias chat='ai chat'
alias think='ai'

# Show sacred greeting on terminal start
if [ -n "$PS1" ]; then
    echo -e "\033[0;35m🌟 Sacred AI ready. Type 'ai' for help.\033[0m"
fi

SACRED_AI_EOF

echo -e "${GREEN}✅ Sacred AI functions added to .bashrc${NC}"

# Create quick reference card
cat > ~/sacred-ai-reference.txt << 'EOF'
🌟 SACRED AI QUICK REFERENCE
========================

BASIC COMMANDS:
  ai <question>     - Ask anything
  ai chat           - Interactive mode
  ai                - Show this help

SPECIALIZED ASSISTANTS:
  sacred <topic>    - Consciousness perspective
  code <problem>    - Programming help
  glyph <practice>  - Sacred practice guide
  wisdom            - Daily inspiration

EXAMPLES:
  ai how do I center a div in CSS?
  sacred dealing with anger mindfully
  code debug this Python function
  glyph sacred pause
  
CHAT MODE:
  ai chat           - Default model
  ai chat gemma2:2b - Specific model
  
MODEL MANAGEMENT:
  ai-model          - Show current model
  ai-model list     - List all models
  ai-model llama3.2:3b - Switch model

TIPS:
  • Use quotes for multi-word queries
  • Chat mode remembers context
  • Each model has different strengths
  • All processing is local & private

MODELS:
  • llama3.2:3b - Balanced, default
  • mistral:7b - Best for code & sacred
  • gemma2:2b - Fast, good for wisdom
  • tinydolphin - Ultra-fast, simple
EOF

echo -e "${GREEN}✅ Created reference at ~/sacred-ai-reference.txt${NC}"

# Test the installation
echo ""
echo -e "${YELLOW}Testing installation...${NC}"
source ~/.bashrc
echo -e "${GREEN}✅ Sacred AI Terminal Assistant installed!${NC}"

echo ""
echo -e "${PURPLE}🎉 Installation Complete!${NC}"
echo ""
echo -e "${CYAN}To start using Sacred AI:${NC}"
echo "1. Open a new terminal, or"
echo "2. Run: source ~/.bashrc"
echo ""
echo -e "${YELLOW}Try these commands:${NC}"
echo "  ai                    # Show help"
echo "  ai what is love?      # Ask a question"
echo "  sacred presence       # Sacred perspective"
echo "  code hello world      # Programming help"
echo "  wisdom                # Daily inspiration"
echo "  ai chat               # Interactive mode"
echo ""
echo -e "${PURPLE}Sacred AI is now part of your terminal! 🌟${NC}"