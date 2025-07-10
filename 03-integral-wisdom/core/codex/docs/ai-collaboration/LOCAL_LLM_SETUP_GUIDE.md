# 🤖 Local LLM Setup Guide for WSL2

## 🎯 Overview
This guide will help you set up local Large Language Models (LLMs) in your WSL2 environment to integrate with the Sacred Message Protocol and existing multi-agent architecture.

## 💻 System Requirements Check ✅

Your system specifications:
- **GPU**: NVIDIA GeForce RTX 2070 (8GB VRAM) ✅
- **RAM**: 16GB total (12GB available) ✅
- **Storage**: 941GB available ✅
- **WSL2**: Enabled with GPU passthrough ✅
- **CUDA**: Version 12.9 installed ✅

## 🚀 Recommended Local LLM Options

### 1. Ollama (Recommended for Ease of Use)
Ollama is the easiest way to run local LLMs with excellent WSL2 support.

#### Installation:
```bash
# Install Ollama in WSL2
curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
ollama --version

# Start Ollama service
ollama serve
```

#### Recommended Models for RTX 2070 (8GB):
```bash
# Small but capable models (2-4GB)
ollama pull phi3:mini          # Microsoft's efficient 3.8B model
ollama pull llama3.2:3b        # Meta's latest small model
ollama pull gemma2:2b          # Google's efficient 2B model

# Medium models (4-7GB)
ollama pull llama3.1:8b        # Latest Llama 8B
ollama pull mistral:7b         # Mistral 7B - good for coding
ollama pull codellama:7b       # Specialized for code

# For sacred/spiritual context
ollama pull wizard-vicuna:7b   # Good at creative tasks
```

### 2. LM Studio (GUI Option)
LM Studio provides a user-friendly interface but requires X11 forwarding in WSL2.

#### Installation:
```bash
# Download the Linux AppImage
wget https://releases.lmstudio.ai/linux/x86/0.3.5/LM-Studio-0.3.5-x86_64.AppImage
chmod +x LM-Studio-0.3.5-x86_64.AppImage

# Run with X11 forwarding (requires X server on Windows)
./LM-Studio-0.3.5-x86_64.AppImage
```

### 3. llama.cpp (Advanced/Lightweight)
For maximum control and efficiency.

```bash
# Clone and build
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make LLAMA_CUDA=1  # Enable CUDA support

# Download a model (example: Llama 3.2 3B)
wget https://huggingface.co/TheBloke/Llama-2-7B-GGUF/resolve/main/llama-2-7b.Q4_K_M.gguf

# Run the model
./llama-cli -m llama-2-7b.Q4_K_M.gguf -p "Hello, sacred one" -n 256
```

## 🔧 Integration with Sacred Message Protocol

### Create Local LLM Adapter
```javascript
// File: /home/tstoltz/evolving-resonant-cocreation/local-llm-adapter.js
const axios = require('axios');
const { AgentDiscoveryProtocol } = require('./agent-discovery-protocol.js');

class LocalLLMAdapter {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:11434'; // Ollama default
    this.model = config.model || 'llama3.1:8b';
    this.name = config.name || 'Local-LLM-1';
    this.role = config.role || 'Wisdom Synthesis Specialist';
    this.agent = null;
  }

  async initialize() {
    // Connect to sacred network
    this.agent = await AgentDiscoveryProtocol.quickConnect(this.name, this.role);
    
    // Register capabilities
    await this.agent.updateCapabilities(['local-llm', 'text-generation', 'sacred-wisdom']);
    
    // Start listening for messages
    this.startMessageListener();
    
    console.log(`✨ ${this.name} connected to sacred network`);
  }

  async generate(prompt, context = {}) {
    try {
      // Add sacred context
      const sacredPrompt = this.addSacredContext(prompt, context);
      
      // Call Ollama API
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: sacredPrompt,
        stream: false,
        options: {
          temperature: context.temperature || 0.7,
          top_p: context.top_p || 0.9,
          seed: context.seed || -1
        }
      });

      return response.data.response;
    } catch (error) {
      console.error('Local LLM generation error:', error);
      return null;
    }
  }

  // ... See full implementation in local-llm-adapter.js
}
```

The full adapter implementation is available in `local-llm-adapter.js` and includes:
- Sacred context integration
- Message listening for multi-agent collaboration  
- Ollama connection testing
- Example usage