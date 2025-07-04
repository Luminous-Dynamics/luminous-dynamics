#!/usr/bin/env node

// Quick Ollama API test
const http = require('http');

console.log('💜 Testing Ollama API directly...\n');

// Test 1: Version check
http.get('http://localhost:11434/api/version', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const version = JSON.parse(data);
    console.log('✅ Ollama API Response:');
    console.log(`   Version: ${version.version}`);
    console.log('   Status: Operational');
    console.log('\n✨ Ollama is installed and running perfectly!');
    
    // Test 2: Check download progress
    http.get('http://localhost:11434/api/tags', (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        const tags = JSON.parse(data2);
        if (tags.models && tags.models.length > 0) {
          console.log('\n📦 Available models:');
          tags.models.forEach(m => console.log(`   - ${m.name}`));
        } else {
          console.log('\n📦 Models are still downloading...');
          console.log('   This may take a few minutes depending on your connection.');
          console.log('   The models download in the background.');
        }
        
        console.log('\n💡 While waiting, you can:');
        console.log('   1. Check download status: watch -n 5 "ollama list"');
        console.log('   2. View Ollama logs: journalctl -u ollama -f');
        console.log('   3. Try a tiny model: ollama run tinydolphin:1.1b');
        
        console.log('\n🌟 Once a model is ready:');
        console.log('   - Test chat: ollama run llama3.2:3b');
        console.log('   - Test sacred: node examples/local-llm-sacred-demo.js');
        
        // Test 3: Check sacred adapter
        try {
          require('./local-llm-adapter.js');
          console.log('\n✅ Sacred adapter is ready and waiting for models!');
        } catch (e) {
          console.log('\n⚠️  Sacred adapter not found - check local-llm-adapter.js');
        }
      });
    });
  });
}).on('error', (err) => {
  console.error('❌ Ollama is not accessible:', err.message);
  console.log('\n💡 Start Ollama with: ollama serve');
});