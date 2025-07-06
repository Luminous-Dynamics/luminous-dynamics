#!/bin/bash

echo "🚀 Quick Docker Ollama Setup"
echo "==========================="

# Simple Docker run command for Ollama
echo "Starting Ollama in Docker..."

# Stop existing if any
docker stop ollama 2>/dev/null
docker rm ollama 2>/dev/null

# Create volume for persistence
docker volume create ollama_data

# Run Ollama
docker run -d \
  --name ollama \
  --restart always \
  -p 11434:11434 \
  -v ollama_data:/root/.ollama \
  ollama/ollama

echo "Waiting for Ollama to start..."
sleep 5

# Check if running
if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
    echo "✅ Ollama is running!"
    
    # Pull a model
    echo "Downloading llama3.2:3b model..."
    docker exec ollama ollama pull llama3.2:3b
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Commands:"
    echo "  docker exec -it ollama ollama run llama3.2:3b  # Chat"
    echo "  docker exec ollama ollama list                 # List models"
    echo "  docker logs ollama                              # View logs"
    echo "  docker stop ollama                              # Stop"
    echo "  docker start ollama                             # Start"
else
    echo "❌ Failed to start Ollama"
    docker logs ollama
fi