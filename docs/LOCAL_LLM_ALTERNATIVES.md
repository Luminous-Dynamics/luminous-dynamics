# Local LLM Setup - Alternative Approaches

Since we're encountering Docker connectivity issues in WSL, here are alternative approaches:

## Option 1: Native Ollama Installation (Simplest)

If you haven't completed the manual install yet:

```bash
# Install Ollama (requires sudo once)
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama
ollama serve

# In another terminal, pull a model
ollama pull llama3.2:3b

# Test it
ollama run llama3.2:3b "Hello, what is consciousness?"
```

## Option 2: Use Windows Docker Desktop

1. Open Docker Desktop on Windows (not in WSL)
2. In WSL terminal, check if Docker works:
   ```bash
   docker ps
   ```
3. If it works, run:
   ```bash
   docker run -d --name ollama -p 11434:11434 ollama/ollama
   docker exec ollama ollama pull llama3.2:3b
   ```

## Option 3: LM Studio (GUI Option)

1. Download LM Studio for Windows: https://lmstudio.ai/
2. Install and run on Windows side
3. Enable API server in LM Studio (port 1234)
4. From WSL, access it at: http://localhost:1234

## Option 4: Text Generation WebUI

```bash
# Clone the repository
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui

# Install
pip install -r requirements.txt

# Run with API
python server.py --api --listen
```

## Option 5: LocalAI (Lightweight)

```bash
# Download binary
wget https://github.com/mudler/LocalAI/releases/latest/download/local-ai-Linux-x86_64 -O ~/.local/bin/local-ai
chmod +x ~/.local/bin/local-ai

# Run
~/.local/bin/local-ai --models-path ~/.local/share/local-ai/models
```

## Testing Sacred Integration

Once you have any LLM running on port 11434 (Ollama) or configure the adapter for other ports:

```javascript
// Edit local-llm-adapter.js to change the endpoint if needed
this.endpoint = options.endpoint || 'http://localhost:11434';

// Then test
const LocalLLMAdapter = require('./local-llm-adapter.js');
const llm = new LocalLLMAdapter({
  model: 'llama3.2:3b',
  endpoint: 'http://localhost:1234' // for LM Studio
});

await llm.generate('What is consciousness?');
```

## Quick Status Check

```bash
# Check what's running on common LLM ports
netstat -tuln | grep -E ':(11434|1234|5000|8080)'

# Check if Ollama is installed
which ollama

# Check if any LLM processes are running
ps aux | grep -E 'ollama|llama|local-ai'
```

## Recommended Path Forward

Given the WSL environment:
1. **First choice**: Native Ollama installation (fastest, most reliable)
2. **Second choice**: Fix Docker Desktop connection
3. **Third choice**: LM Studio on Windows with API access from WSL

The sacred integration adapter (`local-llm-adapter.js`) will work with any of these options!