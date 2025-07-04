#!/bin/bash

echo "🌟 Installing Ollama (will prompt for password once)"
echo "================================================="

# Use the official installer but only for downloading
curl -fsSL https://ollama.com/install.sh -o /tmp/ollama-install.sh

# Extract just the download part
OLLAMA_VERSION=$(grep -oP 'OLLAMA_VERSION=\K[^\s]+' /tmp/ollama-install.sh | head -1 | tr -d '"')
echo "Latest Ollama version: ${OLLAMA_VERSION:-latest}"

# Direct download of the binary
echo "Downloading Ollama binary..."
mkdir -p ~/.local/bin

# Use the CDN URL from the official script
curl -L -o ~/.local/bin/ollama "https://ollama.com/download/ollama-linux-amd64?version=${OLLAMA_VERSION:-latest}" 

if [ $? -eq 0 ] && [ -f ~/.local/bin/ollama ]; then
    chmod +x ~/.local/bin/ollama
    echo "✅ Ollama downloaded successfully"
    
    # Add to PATH
    if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
        export PATH="$HOME/.local/bin:$PATH"
    fi
    
    # Start Ollama
    echo "Starting Ollama service..."
    cd ~/evolving-resonant-cocreation
    nohup ~/.local/bin/ollama serve > /tmp/ollama.log 2>&1 &
    echo "Ollama started (PID: $!)"
    
    sleep 5
    
    # Test connection
    if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
        echo "✅ Ollama is running!"
        
        # Pull a model
        echo "Downloading llama3.2:3b model..."
        ~/.local/bin/ollama pull llama3.2:3b
        
        echo ""
        echo "🎉 Installation complete!"
        echo ""
        echo "Commands:"
        echo "  ollama list         - List models"
        echo "  ollama run llama3.2:3b - Chat"
        echo "  pkill ollama        - Stop service"
        echo ""
        echo "Test sacred integration:"
        echo "  node examples/local-llm-sacred-demo.js"
    else
        echo "❌ Ollama failed to start"
        echo "Check logs: tail -f /tmp/ollama.log"
    fi
else
    echo "❌ Failed to download Ollama"
    echo "You may need to install manually:"
    echo "Visit: https://ollama.com/download/linux"
fi