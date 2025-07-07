#!/usr/bin/env node
/**
 * Test Sacred Core - Quick verification of unified system
 */

const axios = require('axios');
const io = require('socket.io-client');

const BASE_URL = 'http://localhost:3333';

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testSacredCore() {
  console.log('\n🧪 Sacred Core Test Suite');
  console.log('========================\n');
  
  let passed = 0;
  let failed = 0;
  
  try {
    // Test 1: Health Check
    console.log('Test 1: Health Check');
    try {
      const health = await axios.get(`${BASE_URL}/health`);
      console.log(`${colors.green}✓ Health check passed${colors.reset}`);
      console.log(`  Engines: ${JSON.stringify(health.data.engines, null, 2)}`);
      passed++;
    } catch (error) {
      console.log(`${colors.red}✗ Health check failed: ${error.message}${colors.reset}`);
      failed++;
    }
    
    // Test 2: Consciousness Engine
    console.log('\nTest 2: Consciousness Engine');
    try {
      const field = await axios.get(`${BASE_URL}/api/consciousness/field`);
      console.log(`${colors.green}✓ Field state retrieved${colors.reset}`);
      console.log(`  Coherence: ${field.data.coherence}`);
      
      // Record measurement
      await axios.post(`${BASE_URL}/api/consciousness/field/measure`, {
        coherence: 0.85,
        context: { source: 'test-suite' }
      });
      console.log(`${colors.green}✓ Measurement recorded${colors.reset}`);
      passed += 2;
    } catch (error) {
      console.log(`${colors.red}✗ Consciousness test failed: ${error.message}${colors.reset}`);
      failed += 2;
    }
    
    // Test 3: Practice Engine
    console.log('\nTest 3: Practice Engine');
    try {
      const glyphs = await axios.get(`${BASE_URL}/api/practice/glyphs`);
      console.log(`${colors.green}✓ Glyphs retrieved: ${glyphs.data.length} available${colors.reset}`);
      
      // Start practice
      const practice = await axios.post(`${BASE_URL}/api/practice/glyphs/practice`, {
        glyphId: 'omega-45',
        practitioner: { id: 'test-user', name: 'Test Practitioner' }
      });
      console.log(`${colors.green}✓ Glyph practice started${colors.reset}`);
      passed += 2;
    } catch (error) {
      console.log(`${colors.red}✗ Practice test failed: ${error.message}${colors.reset}`);
      failed += 2;
    }
    
    // Test 4: Intelligence Engine
    console.log('\nTest 4: Intelligence Engine');
    try {
      const agents = await axios.get(`${BASE_URL}/api/intelligence/agents`);
      console.log(`${colors.green}✓ Agents retrieved: ${agents.data.length} active${colors.reset}`);
      
      // Spawn agent
      const agent = await axios.post(`${BASE_URL}/api/intelligence/agents/spawn`, {
        intention: 'test-helper',
        skills: ['analysis', 'communication']
      });
      console.log(`${colors.green}✓ Agent spawned: ${agent.data.id}${colors.reset}`);
      passed += 2;
    } catch (error) {
      console.log(`${colors.red}✗ Intelligence test failed: ${error.message}${colors.reset}`);
      failed += 2;
    }
    
    // Test 5: Unified Sacred API
    console.log('\nTest 5: Unified Sacred API');
    try {
      const result = await axios.post(`${BASE_URL}/api/sacred`, {
        intent: 'consciousness.analyze',
        data: {},
        observer: { id: 'test-observer' }
      });
      console.log(`${colors.green}✓ Sacred intent processed${colors.reset}`);
      passed++;
    } catch (error) {
      console.log(`${colors.red}✗ Sacred API test failed: ${error.message}${colors.reset}`);
      failed++;
    }
    
    // Test 6: WebSocket Connection
    console.log('\nTest 6: WebSocket Connection');
    await new Promise((resolve) => {
      const socket = io(BASE_URL);
      
      socket.on('connect', () => {
        console.log(`${colors.green}✓ WebSocket connected${colors.reset}`);
        passed++;
        
        socket.on('sacred:welcome', (data) => {
          console.log(`${colors.green}✓ Welcome message received${colors.reset}`);
          console.log(`  Connection ID: ${data.id}`);
          passed++;
          socket.close();
          resolve();
        });
      });
      
      socket.on('connect_error', (error) => {
        console.log(`${colors.red}✗ WebSocket connection failed: ${error.message}${colors.reset}`);
        failed += 2;
        resolve();
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        socket.close();
        resolve();
      }, 5000);
    });
    
    // Summary
    console.log('\n📊 Test Summary');
    console.log('===============');
    console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    console.log(`Total: ${passed + failed}`);
    
    const successRate = (passed / (passed + failed)) * 100;
    console.log(`\nSuccess Rate: ${successRate.toFixed(1)}%`);
    
    if (successRate >= 80) {
      console.log(`\n${colors.green}✨ Sacred Core is operational!${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}⚠️  Sacred Core needs attention${colors.reset}`);
    }
    
  } catch (error) {
    console.error(`\n${colors.red}Fatal error: ${error.message}${colors.reset}`);
  }
}

// Check if axios is installed
try {
  require('axios');
} catch (error) {
  console.log('Installing axios for testing...');
  require('child_process').execSync('npm install axios', { stdio: 'inherit' });
}

// Run tests
testSacredCore().catch(console.error);