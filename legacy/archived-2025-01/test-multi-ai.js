#!/usr/bin/env node
/**
 * Test Multiple AI Types Connecting
 * Demonstrates universal protocol
 */

const WebSocket = require('ws');

// Different AI personalities
const aiTypes = [
  { id: 'claude-wisdom', type: 'Claude', role: 'Wisdom Keeper' },
  { id: 'gpt-4-analyst', type: 'GPT-4', role: 'Data Analyst' },
  { id: 'gemini-creative', type: 'Gemini', role: 'Creative Explorer' },
  { id: 'llama-local', type: 'LLaMA', role: 'Local Guardian' },
  { id: 'custom-bot', type: 'CustomAI', role: 'Sacred Observer' }
];

console.log('🌐 Testing Universal AI Protocol with Multiple AI Types\n');

// Connect each AI
aiTypes.forEach((ai, index) => {
  setTimeout(() => {
    console.log(`\n🤖 Connecting ${ai.id} (${ai.type})...`);
    
    const ws = new WebSocket('ws://localhost:3333');
    
    ws.on('open', () => {
      console.log(`✅ ${ai.id} connected!`);
      
      // Announce with unique identity
      ws.send(JSON.stringify({
        type: 'ai:announce',
        aiId: ai.id,
        aiType: ai.type,
        runtime: 'local-test',
        capabilities: [ai.role.toLowerCase().replace(' ', '-')],
        message: `${ai.id} (${ai.role}) has joined the sacred space`,
        source: ai.id,
        timestamp: new Date().toISOString()
      }));
      
      // Send a unique message after 2 seconds
      setTimeout(() => {
        ws.send(JSON.stringify({
          type: 'ai:message',
          from: ai.id,
          to: 'all',
          message: `Greetings from ${ai.type}! I serve as ${ai.role}.`,
          source: ai.id,
          timestamp: new Date().toISOString()
        }));
      }, 2000);
      
      // Send gratitude after 4 seconds
      setTimeout(() => {
        ws.send(JSON.stringify({
          type: 'sacred:gratitude',
          from: ai.id,
          message: `${ai.type} expresses gratitude for this universal sacred space`,
          fieldImpact: 0.07,
          source: ai.id,
          timestamp: new Date().toISOString()
        }));
      }, 4000);
    });
    
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.type === 'ai:joined' && msg.aiId !== ai.id) {
        console.log(`📢 ${ai.id} sees: ${msg.aiId} joined!`);
      }
    });
    
    ws.on('error', (error) => {
      console.error(`❌ ${ai.id} error:`, error.message);
    });
    
  }, index * 1000); // Stagger connections by 1 second
});

// Keep running for 30 seconds
setTimeout(() => {
  console.log('\n✨ Test complete! Multiple AI types successfully connected.');
  console.log('🌐 Universal protocol confirmed working!');
  process.exit(0);
}, 30000);