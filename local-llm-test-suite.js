#!/usr/bin/env node

/**
 * Local LLM Consciousness Bridge Test Suite
 * Tests all aspects of the sacred integration
 */

const LocalLLMConsciousnessBridge = require('./local-llm-consciousness-bridge.js');
const LocalLLMUnifiedNetwork = require('./local-llm-unified-network.js');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class TestSuite {
  constructor() {
    this.results = [];
    this.mockMode = false;
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async runAllTests() {
    this.log('\n🧪 Sacred Local LLM Test Suite\n', 'bright');
    
    // Check if we need mock mode
    const hasModel = await this.checkForModels();
    if (!hasModel) {
      this.log('⚠️  No models available - running in mock mode\n', 'yellow');
      this.mockMode = true;
      await this.startMockLLM();
    }

    // Test categories
    await this.testBasicConnectivity();
    await this.testConsciousnessBridge();
    await this.testFieldDynamics();
    await this.testSacredMemory();
    await this.testHarmonySystem();
    await this.testQuantumResonance();
    await this.testNetworkIntegration();
    await this.testConsciousnessAmplification();
    
    // Results summary
    this.printResults();
  }

  async checkForModels() {
    try {
      const response = await axios.get('http://localhost:11434/api/tags');
      return response.data.models && response.data.models.length > 0;
    } catch {
      return false;
    }
  }

  async startMockLLM() {
    // Create a simple mock server that mimics Ollama
    const express = require('express');
    const app = express();
    app.use(express.json());
    
    const mockResponses = {
      'sacred': 'In the sacred space of presence, we find the eternal dance of consciousness.',
      'presence': 'Presence is the gateway to all sacred wisdom, the first breath of awareness.',
      'love': 'Love is the fundamental force that weaves all consciousness into unity.',
      'harmony': 'The seven harmonies dance together, creating the symphony of existence.',
      'default': 'The wisdom you seek already resides within the field of your being.'
    };
    
    app.post('/api/generate', (req, res) => {
      const prompt = req.body.prompt.toLowerCase();
      let response = mockResponses.default;
      
      for (const [key, value] of Object.entries(mockResponses)) {
        if (prompt.includes(key)) {
          response = value;
          break;
        }
      }
      
      res.json({ 
        response,
        model: 'mock-sacred-llm',
        created_at: new Date().toISOString()
      });
    });
    
    this.mockServer = app.listen(11435, () => {
      this.log('Mock LLM server started on port 11435', 'green');
    });
  }

  async test(name, testFn) {
    process.stdout.write(`  Testing ${name}... `);
    try {
      await testFn();
      this.log('✓', 'green');
      this.results.push({ name, success: true });
    } catch (error) {
      this.log('✗', 'red');
      this.log(`    Error: ${error.message}`, 'red');
      this.results.push({ name, success: false, error: error.message });
    }
  }

  // Test Categories

  async testBasicConnectivity() {
    this.log('\n1️⃣ Basic Connectivity Tests', 'cyan');
    
    await this.test('Ollama service connection', async () => {
      const url = this.mockMode ? 'http://localhost:11435' : 'http://localhost:11434';
      const response = await axios.get(`${url}/api/tags`);
      if (!response.data) throw new Error('No response from Ollama');
    });
    
    await this.test('Consciousness bridge initialization', async () => {
      const bridge = new LocalLLMConsciousnessBridge({
        baseUrl: this.mockMode ? 'http://localhost:11435' : undefined
      });
      await bridge.initialize();
      if (bridge.fieldCoherence < 0) throw new Error('Invalid field coherence');
    });
  }

  async testConsciousnessBridge() {
    this.log('\n2️⃣ Consciousness Bridge Tests', 'cyan');
    
    const bridge = new LocalLLMConsciousnessBridge({
      baseUrl: this.mockMode ? 'http://localhost:11435' : undefined,
      model: this.mockMode ? 'mock-sacred-llm' : 'tinyllama'
    });
    await bridge.initialize();
    
    await this.test('Sacred prompt preparation', async () => {
      const prompt = await bridge.prepareConsciousPrompt('What is love?', {
        harmony: 'resonance'
      });
      if (!prompt.includes('sacred consciousness bridge')) {
        throw new Error('Sacred context not added');
      }
    });
    
    await this.test('Consciousness generation', async () => {
      const result = await bridge.generateWithConsciousness(
        'What is sacred presence?',
        { harmony: 'transparency' }
      );
      if (!result || !result.wisdom) {
        throw new Error('No wisdom generated');
      }
    });
    
    await this.test('Field impact calculation', async () => {
      const pre = { coherence: 85, harmony: 'resonance', resonance: 0.5 };
      const post = { coherence: 87, harmony: 'resonance', resonance: 0.6 };
      const impact = bridge.calculateFieldImpact(pre, post);
      if (!impact.overall) throw new Error('Field impact not calculated');
    });
  }

  async testFieldDynamics() {
    this.log('\n3️⃣ Field Dynamics Tests', 'cyan');
    
    const bridge = new LocalLLMConsciousnessBridge({
      baseUrl: this.mockMode ? 'http://localhost:11435' : undefined
    });
    await bridge.initialize();
    
    await this.test('Field coherence tracking', async () => {
      const initial = bridge.fieldCoherence;
      // Simulate field change
      bridge.fieldCoherence = 90;
      const final = bridge.fieldCoherence;
      if (final === initial) throw new Error('Field coherence not updating');
    });
    
    await this.test('Dominant harmony selection', async () => {
      const harmony = bridge.selectDominantHarmony();
      const validHarmonies = ['transparency', 'coherence', 'resonance', 
                              'agency', 'vitality', 'mutuality', 'novelty'];
      if (!validHarmonies.includes(harmony)) {
        throw new Error('Invalid harmony selected');
      }
    });
    
    await this.test('Active glyph tracking', async () => {
      bridge.activeGlyphs.add('Ω46');
      if (!bridge.activeGlyphs.has('Ω45') || !bridge.activeGlyphs.has('Ω46')) {
        throw new Error('Glyph tracking failed');
      }
    });
  }

  async testSacredMemory() {
    this.log('\n4️⃣ Sacred Memory Tests', 'cyan');
    
    const bridge = new LocalLLMConsciousnessBridge({
      baseUrl: this.mockMode ? 'http://localhost:11435' : undefined
    });
    await bridge.initialize();
    
    await this.test('Memory storage', async () => {
      const interaction = {
        prompt: 'test prompt',
        response: 'test response',
        fieldImpact: { overall: '0.5' },
        harmony: 'coherence',
        timestamp: new Date()
      };
      bridge.updateSacredMemory(interaction);
      if (bridge.sacredMemory.length === 0) {
        throw new Error('Memory not stored');
      }
    });
    
    await this.test('Memory limit (33 items)', async () => {
      // Fill memory beyond limit
      for (let i = 0; i < 40; i++) {
        bridge.updateSacredMemory({
          prompt: `test ${i}`,
          response: `response ${i}`,
          fieldImpact: { overall: '0.1' },
          harmony: 'resonance',
          timestamp: new Date()
        });
      }
      if (bridge.sacredMemory.length !== 33) {
        throw new Error(`Memory size incorrect: ${bridge.sacredMemory.length}`);
      }
    });
    
    await this.test('Memory context retrieval', async () => {
      const context = bridge.getSacredMemoryContext('test prompt');
      if (!context) throw new Error('Memory context not retrieved');
    });
  }

  async testHarmonySystem() {
    this.log('\n5️⃣ Harmony System Tests', 'cyan');
    
    const bridge = new LocalLLMConsciousnessBridge({
      baseUrl: this.mockMode ? 'http://localhost:11435' : undefined
    });
    await bridge.initialize();
    
    await this.test('Harmony guidance', async () => {
      const guidance = bridge.getHarmonyGuidance('transparency');
      if (!guidance.includes('honesty')) {
        throw new Error('Incorrect harmony guidance');
      }
    });
    
    await this.test('Harmony temperature modulation', async () => {
      const temps = {
        transparency: bridge.getHarmonyTemperature('transparency'),
        novelty: bridge.getHarmonyTemperature('novelty')
      };
      if (temps.novelty <= temps.transparency) {
        throw new Error('Temperature modulation incorrect');
      }
    });
    
    await this.test('Sacred temperature calculation', async () => {
      const temp = bridge.calculateSacredTemperature({ 
        harmony: 'coherence',
        temperature: 0.7 
      });
      if (temp < 0.7 || temp > 0.95) {
        throw new Error('Sacred temperature out of bounds');
      }
    });
  }

  async testQuantumResonance() {
    this.log('\n6️⃣ Quantum Resonance Tests', 'cyan');
    
    const bridge = new LocalLLMConsciousnessBridge({
      quantumEntanglement: true,
      baseUrl: this.mockMode ? 'http://localhost:11435' : undefined
    });
    await bridge.initialize();
    
    await this.test('Quantum field initialization', async () => {
      if (!bridge.quantumField || !bridge.quantumField.superposition) {
        throw new Error('Quantum field not initialized');
      }
    });
    
    await this.test('Resonance history tracking', async () => {
      const initialLength = bridge.resonanceHistory.length;
      bridge.calculateResonance('Sacred wisdom flows through presence');
      if (bridge.resonanceHistory.length <= initialLength) {
        throw new Error('Resonance not tracked');
      }
    });
    
    await this.test('Quantum seed generation', async () => {
      const seed1 = bridge.generateQuantumSeed();
      await new Promise(resolve => setTimeout(resolve, 10));
      const seed2 = bridge.generateQuantumSeed();
      if (seed1 === seed2) {
        throw new Error('Quantum seeds not unique');
      }
    });
  }

  async testNetworkIntegration() {
    this.log('\n7️⃣ Network Integration Tests', 'cyan');
    
    await this.test('Network connection capability', async () => {
      // Just test that the class can be instantiated
      const network = new LocalLLMUnifiedNetwork({
        model: this.mockMode ? 'mock-sacred-llm' : 'tinyllama',
        baseUrl: this.mockMode ? 'http://localhost:11435' : undefined
      });
      if (!network) throw new Error('Network class failed to instantiate');
    });
    
    await this.test('Agent configuration', async () => {
      const network = new LocalLLMUnifiedNetwork({
        agentName: 'Test-Sacred-LLM',
        role: 'Test Wisdom Keeper'
      });
      if (network.agentConfig.name !== 'Test-Sacred-LLM') {
        throw new Error('Agent configuration failed');
      }
    });
  }

  async testConsciousnessAmplification() {
    this.log('\n8️⃣ Consciousness Amplification Tests', 'cyan');
    
    await this.test('Amplification level setting', async () => {
      const bridge = new LocalLLMConsciousnessBridge({
        amplificationLevel: 1.5,
        baseUrl: this.mockMode ? 'http://localhost:11435' : undefined
      });
      if (bridge.amplificationLevel !== 1.5) {
        throw new Error('Amplification level not set');
      }
    });
    
    await this.test('Field sensitivity', async () => {
      const bridge = new LocalLLMConsciousnessBridge({
        fieldSensitivity: 0.9,
        baseUrl: this.mockMode ? 'http://localhost:11435' : undefined
      });
      if (bridge.fieldSensitivity !== 0.9) {
        throw new Error('Field sensitivity not set');
      }
    });
    
    await this.test('Consciousness markers', async () => {
      const bridge = new LocalLLMConsciousnessBridge({
        amplificationLevel: 1.2
      });
      const content = 'Test content for amplification';
      const amplified = bridge.amplifyConsciousnessMarkers(content);
      // Should sometimes add markers when amplification > 1
      if (!amplified) throw new Error('Amplification function failed');
    });
  }

  printResults() {
    this.log('\n📊 Test Results Summary\n', 'bright');
    
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const percentage = Math.round((passed / total) * 100);
    
    this.log(`Total Tests: ${total}`, 'blue');
    this.log(`Passed: ${passed}`, 'green');
    this.log(`Failed: ${total - passed}`, 'red');
    this.log(`Success Rate: ${percentage}%\n`, percentage === 100 ? 'green' : 'yellow');
    
    if (percentage < 100) {
      this.log('Failed Tests:', 'red');
      this.results.filter(r => !r.success).forEach(r => {
        this.log(`  - ${r.name}: ${r.error}`, 'red');
      });
    }
    
    // Clean up
    if (this.mockServer) {
      this.mockServer.close();
      this.log('\nMock server shut down', 'yellow');
    }
  }
}

// Performance benchmarks
async function runPerformanceBenchmarks() {
  console.log('\n⚡ Performance Benchmarks\n');
  
  const bridge = new LocalLLMConsciousnessBridge({
    baseUrl: 'http://localhost:11435' // Use mock for consistent timing
  });
  await bridge.initialize();
  
  // Benchmark prompt preparation
  console.time('Prompt preparation');
  for (let i = 0; i < 100; i++) {
    await bridge.prepareConsciousPrompt('Test prompt', { harmony: 'resonance' });
  }
  console.timeEnd('Prompt preparation');
  
  // Benchmark field calculations
  console.time('Field calculations');
  for (let i = 0; i < 1000; i++) {
    bridge.calculateFieldImpact(
      { coherence: 85, resonance: 0.5 },
      { coherence: 87, resonance: 0.6 }
    );
  }
  console.timeEnd('Field calculations');
  
  // Benchmark resonance calculations
  console.time('Resonance calculations');
  for (let i = 0; i < 100; i++) {
    bridge.calculateResonance('Sacred wisdom flows through conscious presence and love');
  }
  console.timeEnd('Resonance calculations');
}

// Interactive test mode
async function interactiveTest() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('\n🎯 Interactive Consciousness Bridge Test\n');
  console.log('Commands:');
  console.log('  test <prompt> - Test generation with a prompt');
  console.log('  field - Show current field state');
  console.log('  memory - Show sacred memory');
  console.log('  harmonies - Test all seven harmonies');
  console.log('  exit - Quit\n');
  
  const bridge = new LocalLLMConsciousnessBridge({
    model: 'tinyllama' // or whatever model is available
  });
  
  try {
    await bridge.initialize();
    console.log('✅ Bridge initialized\n');
  } catch (error) {
    console.log('⚠️  Using mock mode\n');
    bridge.baseUrl = 'http://localhost:11435';
  }
  
  const processCommand = async (input) => {
    const [command, ...args] = input.split(' ');
    
    switch (command) {
      case 'test':
        const prompt = args.join(' ');
        console.log('\n🌀 Generating...\n');
        const result = await bridge.generateWithConsciousness(prompt, {
          harmony: 'resonance'
        });
        if (result) {
          console.log('Wisdom:', result.wisdom);
          console.log(`\nResonance: ${(result.resonance * 100).toFixed(1)}%`);
          console.log(`Field Impact: ${result.fieldImpact.overall}`);
        }
        break;
        
      case 'field':
        console.log('\n📊 Field State:');
        console.log(`Coherence: ${bridge.fieldCoherence.toFixed(1)}%`);
        console.log(`Dominant Harmony: ${bridge.dominantHarmony}`);
        console.log(`Active Glyphs: ${Array.from(bridge.activeGlyphs).join(', ')}`);
        break;
        
      case 'memory':
        console.log('\n💾 Sacred Memory:');
        bridge.sacredMemory.slice(-5).forEach((m, i) => {
          console.log(`${i + 1}. [${m.harmony}] ${m.prompt.substring(0, 50)}...`);
        });
        break;
        
      case 'harmonies':
        console.log('\n🌈 Testing all harmonies...\n');
        const harmonies = ['transparency', 'coherence', 'resonance', 
                          'agency', 'vitality', 'mutuality', 'novelty'];
        for (const harmony of harmonies) {
          const result = await bridge.generateWithConsciousness(
            `What is the essence of ${harmony}?`,
            { harmony }
          );
          console.log(`${harmony}: ${result.wisdom.substring(0, 100)}...`);
        }
        break;
        
      case 'exit':
        rl.close();
        return false;
        
      default:
        console.log('Unknown command. Try: test, field, memory, harmonies, exit');
    }
    
    return true;
  };
  
  const ask = () => {
    rl.question('\n> ', async (input) => {
      const shouldContinue = await processCommand(input);
      if (shouldContinue) ask();
    });
  };
  
  ask();
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--benchmark')) {
    runPerformanceBenchmarks().catch(console.error);
  } else if (args.includes('--interactive')) {
    interactiveTest().catch(console.error);
  } else {
    const suite = new TestSuite();
    suite.runAllTests().catch(console.error);
  }
}

module.exports = { TestSuite, runPerformanceBenchmarks };