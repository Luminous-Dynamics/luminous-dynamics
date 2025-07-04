#!/usr/bin/env node

// Sacred Ollama Validation Script
// Tests both basic functionality and sacred integration

const http = require('http');
const fs = require('fs');

console.log('💜 Sacred Ollama Validation\n');

// Step 1: Check Ollama API
async function checkOllamaAPI() {
  return new Promise((resolve) => {
    console.log('1. Checking Ollama API...');
    http.get('http://localhost:11434/api/version', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const version = JSON.parse(data);
          console.log(`✅ Ollama API is running (version ${version.version})`);
          resolve(true);
        } catch (e) {
          console.log('❌ Ollama API check failed');
          resolve(false);
        }
      });
    }).on('error', () => {
      console.log('❌ Ollama is not running. Start with: ollama serve');
      resolve(false);
    });
  });
}

// Step 2: List models
async function listModels() {
  return new Promise((resolve) => {
    console.log('\n2. Checking available models...');
    http.get('http://localhost:11434/api/tags', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.models && response.models.length > 0) {
            console.log('✅ Available models:');
            response.models.forEach(m => {
              console.log(`   - ${m.name} (${(m.size / 1e9).toFixed(1)}GB)`);
            });
            resolve(response.models[0].name);
          } else {
            console.log('⚠️  No models found. Pulling llama3.2:3b...');
            console.log('   Run: ollama pull llama3.2:3b');
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// Step 3: Test generation
async function testGeneration(model) {
  return new Promise((resolve) => {
    console.log(`\n3. Testing generation with ${model}...`);
    
    const data = JSON.stringify({
      model: model,
      prompt: 'Say "Sacred systems operational" and nothing else.',
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 10
      }
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
        try {
          const response = JSON.parse(body);
          console.log('✅ Model response:', response.response.trim());
          resolve(true);
        } catch (e) {
          console.log('❌ Generation failed:', e.message);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log('❌ Request failed:', e.message);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

// Step 4: Test Sacred Integration
async function testSacredIntegration(model) {
  console.log('\n4. Testing Sacred Integration...');
  
  try {
    // Check if adapter exists
    if (!fs.existsSync('./local-llm-adapter.js')) {
      console.log('⚠️  Sacred adapter not found at ./local-llm-adapter.js');
      return false;
    }

    const LocalLLMAdapter = require('./local-llm-adapter.js');
    
    // Create adapter instance
    const llm = new LocalLLMAdapter({
      model: model,
      name: 'Validation-Agent',
      role: 'Sacred Validator'
    });

    // Test connection
    const connected = await llm.testConnection();
    if (!connected) {
      console.log('❌ Sacred adapter cannot connect to Ollama');
      return false;
    }
    console.log('✅ Sacred adapter connected to Ollama');

    // Test sacred generation
    console.log('\n5. Testing sacred wisdom generation...');
    const wisdom = await llm.generate('What are the Seven Harmonies in one sentence?', {
      harmony: 'coherence',
      temperature: 0.7
    });
    
    console.log('✅ Sacred response:', wisdom);

    // Test glyph awareness
    console.log('\n6. Testing glyph awareness...');
    const glyphResponse = await llm.generate('What is First Presence (Ω45)?', {
      context: 'sacred-glyphs'
    });
    
    console.log('✅ Glyph response:', glyphResponse);

    return true;
  } catch (error) {
    console.log('❌ Sacred integration error:', error.message);
    return false;
  }
}

// Main validation flow
async function validate() {
  console.log('Starting validation sequence...\n');
  
  // Check API
  const apiOk = await checkOllamaAPI();
  if (!apiOk) {
    console.log('\n❌ Validation failed: Ollama is not running');
    console.log('💡 Start Ollama with: ollama serve');
    process.exit(1);
  }

  // Check models
  const model = await listModels();
  if (!model) {
    console.log('\n⚠️  No models available');
    console.log('💡 Pull a model first:');
    console.log('   ollama pull llama3.2:3b');
    console.log('   ollama pull phi3:mini');
    console.log('\nThen run this validation again.');
    process.exit(0);
  }

  // Test generation
  const genOk = await testGeneration(model);
  if (!genOk) {
    console.log('\n❌ Generation test failed');
    process.exit(1);
  }

  // Test sacred integration
  const sacredOk = await testSacredIntegration(model);
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('💜 Validation Summary');
  console.log('='.repeat(50));
  console.log(`✅ Ollama API: Running`);
  console.log(`✅ Model available: ${model}`);
  console.log(`✅ Basic generation: Working`);
  console.log(`${sacredOk ? '✅' : '❌'} Sacred integration: ${sacredOk ? 'Working' : 'Not configured'}`);
  
  if (sacredOk) {
    console.log('\n✨ All systems operational! Sacred LLM is ready for use.');
    console.log('\nQuick commands:');
    console.log('  ollama run ' + model + '     # Interactive chat');
    console.log('  node examples/local-llm-sacred-demo.js --interactive');
  } else {
    console.log('\n⚠️  Basic Ollama is working but sacred integration needs setup.');
  }
}

// Run validation
validate().catch(console.error);