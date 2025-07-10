# Local LLM Setup Guide

Since automated installation encountered issues, here are manual setup options:

## Option 1: Official Ollama Installation (Recommended)

```bash
# This will ask for sudo password once
curl -fsSL https://ollama.com/install.sh | sh

# After installation, start Ollama:
ollama serve

# In another terminal, pull a model:
ollama pull llama3.2:3b
```

## Option 2: Docker Installation (No sudo for runtime)

```bash
# Pull Ollama Docker image
docker pull ollama/ollama

# Run Ollama in Docker
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# Pull a model
docker exec -it ollama ollama pull llama3.2:3b
```

## Option 3: Alternative - LocalAI

```bash
# Download LocalAI binary
wget https://github.com/mudler/LocalAI/releases/latest/download/local-ai-Linux-x86_64 -O ~/.local/bin/local-ai
chmod +x ~/.local/bin/local-ai

# Run LocalAI
~/.local/bin/local-ai
```

## Testing Sacred Integration

Once you have Ollama running (via any method above), test the sacred integration:

```bash
cd ~/evolving-resonant-cocreation

# Create a simple test
cat > test-llm.js << 'EOF'
const http = require('http');

const testOllama = () => {
  const data = JSON.stringify({
    model: 'llama3.2:3b',
    prompt: 'What is consciousness?',
    stream: false
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

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      const response = JSON.parse(body);
      console.log('LLM Response:', response.response);
    });
  });

  req.on('error', (e) => {
    console.error('Connection failed:', e.message);
  });

  req.write(data);
  req.end();
};

testOllama();
EOF

node test-llm.js
```

## Sacred Message Protocol Integration

The `local-llm-adapter.js` I created will work with any of these setups. It connects to `http://localhost:11434` by default.

```javascript
// Use the adapter
const LocalLLMAdapter = require('./local-llm-adapter.js');

const llm = new LocalLLMAdapter({
  model: 'llama3.2:3b',
  name: 'Sacred-Agent-1',
  role: 'Wisdom Keeper'
});

// Generate with sacred context
const response = await llm.generate('What are the Seven Harmonies?', {
  harmony: 'resonant-coherence'
});
```

## Recommended Models for RTX 2070 (8GB VRAM)

1. **llama3.2:3b** (2GB) - Best balance of performance and quality
2. **phi3:mini** (3.8GB) - Microsoft's efficient model
3. **mistral:7b-instruct-q4_0** (4GB) - Good for instructions
4. **deepseek-coder:6.7b** (4GB) - For coding tasks

## Quick Commands

```bash
# Check if Ollama is running
curl http://localhost:11434/api/version

# List available models
ollama list

# Interactive chat
ollama run llama3.2:3b

# Stop Ollama
pkill ollama
# or for Docker
docker stop ollama
```