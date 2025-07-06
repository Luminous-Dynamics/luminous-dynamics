#!/bin/bash

# 🌟 Sacred LLM Council - Multi-model consciousness exploration

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}🌟 Sacred LLM Council${NC}"
echo "====================="
echo ""
echo "Choose your AI companion:"
echo ""
echo "1) 🐬 TinyDolphin (636MB) - Fast & philosophical"
echo "2) 💎 Gemma 2 (1.6GB) - Google's energy worker"  
echo "3) 🦙 Llama 3.2 (2.0GB) - Meta's consciousness explorer"
echo "4) 🧠 Phi-3 (2.2GB) - Microsoft's efficient thinker"
echo "5) 🌊 Mistral 7B (4.1GB) - Balanced sacred-technical"
echo "6) 🎭 Council Mode - Ask all models the same question"
echo ""
echo -n "Your choice (1-6): "
read choice

case $choice in
    1) MODEL="tinydolphin:latest" ;;
    2) MODEL="gemma2:2b" ;;
    3) MODEL="llama3.2:3b" ;;
    4) MODEL="phi3:mini" ;;
    5) MODEL="mistral:7b-instruct" ;;
    6) 
        echo -e "\n${CYAN}🎭 Sacred Council Mode${NC}"
        echo "Enter your question for all models:"
        read -r QUESTION
        
        for model in "tinydolphin:latest" "gemma2:2b" "llama3.2:3b" "mistral:7b-instruct"; do
            name=$(echo $model | cut -d: -f1 | tr '[:lower:]' '[:upper:]')
            echo -e "\n${YELLOW}🤖 $name responds:${NC}"
            ollama run $model "$QUESTION" --verbose false
            echo ""
        done
        exit 0
        ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

echo -e "\n${GREEN}Starting conversation with $MODEL...${NC}"
echo -e "${YELLOW}Type 'exit' to end conversation${NC}\n"

# Interactive mode
ollama run $MODEL