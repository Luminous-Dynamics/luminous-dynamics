#!/usr/bin/env node
/**
 * End-to-end flow test for Luminous Stack
 */

import { LuminousStack } from './src/luminous-stack.js';
import { CovenantRouter } from './src/covenant-router.js';
import WebSocket from 'ws';
import chalk from 'chalk';

async function testCompleteFlow() {
  console.log(chalk.cyan('\n🌊 Testing Complete Luminous Stack Flow...\n'));
  
  // Start router on different port
  const router = new CovenantRouter({ port: 8899 });
  router.start();
  
  // Wait for router to initialize
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create sender node
  console.log(chalk.yellow('1. Creating sender node...'));
  const sender = new LuminousStack({ nodeId: 'sender', coherenceLevel: 0.8 });
  const senderWs = new WebSocket('ws://localhost:8899', {
    headers: { 'x-node-id': 'sender' }
  });
  
  // Create receiver node
  console.log(chalk.yellow('2. Creating receiver node...'));
  const receiver = new LuminousStack({ nodeId: 'receiver', coherenceLevel: 0.6 });
  const receiverWs = new WebSocket('ws://localhost:8899', {
    headers: { 'x-node-id': 'receiver' }
  });
  
  // Wait for connections
  await Promise.all([
    new Promise(resolve => senderWs.on('open', resolve)),
    new Promise(resolve => receiverWs.on('open', resolve))
  ]);
  
  console.log(chalk.green('✓ Both nodes connected to router\n'));
  
  // Set up receiver
  receiverWs.on('message', async (data) => {
    const packet = JSON.parse(data);
    
    if (packet.type === 'router-welcome' || packet.type === 'field-harmonization') {
      return; // Skip system messages
    }
    
    console.log(chalk.blue('4. Receiver processing packet...'));
    const received = await receiver.receive(packet);
    
    console.log(chalk.green('\n✅ Complete Flow Successful!'));
    console.log(chalk.white(`   Message: "${received.presencePayload}"`));
    console.log(chalk.white(`   Coherence: ${(received.coherenceScore * 100).toFixed(1)}%`));
    console.log(chalk.white(`   Field Compatibility: ${(received.fieldCompatibility * 100).toFixed(1)}%`));
    console.log(chalk.white(`   Intention: ${received.decodedIntention}`));
    
    // Clean up
    senderWs.close();
    receiverWs.close();
    router.wss.close(() => {
      console.log(chalk.cyan('\n✨ Test complete! All connections closed gracefully.\n'));
      process.exit(0);
    });
  });
  
  // Send packet
  console.log(chalk.yellow('3. Sending sacred packet through router...'));
  const packet = await sender.send(
    'Hello through the Luminous Stack!',
    { intention: 'connection' }
  );
  
  senderWs.send(JSON.stringify(packet));
}

// Run test
testCompleteFlow().catch(error => {
  console.error(chalk.red('Test failed:'), error);
  process.exit(1);
});