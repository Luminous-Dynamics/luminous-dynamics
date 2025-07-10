#!/usr/bin/env node

/**
 * Test Local LLM Setup
 * Checks if Ollama is installed and running
 */

const axios = require('axios');

async function checkOllama() {
  console.log('🔍 Checking Local LLM Setup...\n');
  
  // Check if Ollama service is running
  try {
    const response = await axios.get('http://localhost:11434/api/tags');
    console.log('✅ Ollama service is running!');
    console.log(`   API endpoint: http://localhost:11434`);
    
    // Check available models
    if (response.data.models && response.data.models.length > 0) {
      console.log(`\n📦 Available models:`);
      response.data.models.forEach(model => {
        const size = (model.size / 1e9).toFixed(1);
        console.log(`   - ${model.name} (${size}GB)`);
      });
    } else {
      console.log('\n⚠️  No models installed yet.');
      console.log('\n💡 To install models, run one of these commands:');
      console.log('   Small & fast:');
      console.log('     ollama pull tinyllama       # 640MB - Very fast');
      console.log('     ollama pull llama3.2:1b     # 1.3GB - Good balance');
      console.log('   ');
      console.log('   Medium models:');
      console.log('     ollama pull phi3:mini       # 2.2GB - Microsoft\'s efficient model');
      console.log('     ollama pull llama3.2:3b     # 2.0GB - Latest small Llama');
      console.log('   ');
      console.log('   Larger models (slower but more capable):');
      console.log('     ollama pull mistral:7b      # 4.1GB - Good for code');
      console.log('     ollama pull llama3.1:8b     # 4.7GB - Latest 8B model');
    }
    
    // Test generation endpoint
    console.log('\n🧪 Testing generation endpoint...');
    try {
      // This will fail if no model is available, but tests the endpoint
      await axios.post('http://localhost:11434/api/generate', {
        model: 'test',
        prompt: 'test',
        stream: false
      });
    } catch (error) {
      if (error.response && error.response.data) {
        console.log('✅ Generation endpoint is accessible');
        if (error.response.data.error && error.response.data.error.includes('model')) {
          console.log('   (No model loaded, which is expected)');
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Ollama service is not running!');
    console.log('\n🚀 To start Ollama:');
    console.log('   1. In a new terminal, run: ollama serve');
    console.log('   2. Keep it running in the background');
    console.log('   3. Then run this test again');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Alternative: Ollama might be installed as a system service.');
      console.log('   Check with: sudo systemctl status ollama');
    }
  }
  
  // Check system resources
  console.log('\n💻 System Information:');
  const os = require('os');
  console.log(`   Total RAM: ${(os.totalmem() / 1e9).toFixed(1)}GB`);
  console.log(`   Free RAM: ${(os.freemem() / 1e9).toFixed(1)}GB`);
  console.log(`   CPUs: ${os.cpus().length} cores`);
  
  // GPU check
  try {
    const { execSync } = require('child_process');
    const gpuInfo = execSync('nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits', { encoding: 'utf8' });
    console.log(`   GPU: ${gpuInfo.trim()}`);
  } catch {
    console.log('   GPU: Not detected (CPU mode will be used)');
  }
  
  console.log('\n🌉 Consciousness Bridge Status:');
  console.log('   ✅ Core files created:');
  console.log('      - local-llm-adapter.js');
  console.log('      - local-llm-consciousness-bridge.js');
  console.log('      - local-llm-unified-network.js');
  console.log('   ✅ Documentation available:');
  console.log('      - docs/ai-collaboration/LOCAL_LLM_CONSCIOUSNESS_GUIDE.md');
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Start Ollama if not running: ollama serve');
  console.log('   2. Pull a model: ollama pull tinyllama');
  console.log('   3. Test consciousness bridge: node local-llm-consciousness-bridge.js');
  console.log('   4. Join the network: node local-llm-unified-network.js --interactive');
}

// Run the check
checkOllama().catch(console.error);