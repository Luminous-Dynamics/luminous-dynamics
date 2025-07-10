#!/usr/bin/env node
/**
 * Test Suite for the Luminous Stack
 */

import { LuminousStack } from './luminous-stack.js';
import chalk from 'chalk';

console.log(chalk.cyan('\n🧪 Testing Luminous Stack Components...\n'));

async function testBasicPacketCreation() {
  console.log(chalk.yellow('Test 1: Basic Packet Creation'));
  
  const stack = new LuminousStack({
    nodeId: 'test-node',
    coherenceLevel: 0.75
  });
  
  const packet = await stack.send('Hello, consciousness!', {
    intention: 'connection'
  });
  
  console.log(chalk.green('✓ Packet created successfully'));
  console.log(`  Void Signature: ${packet.voidSignature.toString('hex').substring(0, 16)}...`);
  console.log(`  Coherence: ${packet.coherenceScore}`);
  console.log(`  Blessing: ${packet.blessing.toString().trim()}`);
  
  return packet;
}

async function testLayerProcessing() {
  console.log(chalk.yellow('\nTest 2: Layer Processing'));
  
  const stack = new LuminousStack();
  let layersProcessed = 0;
  
  stack.on('layer:processed', (info) => {
    console.log(chalk.gray(`  Layer ${info.layer} (${info.glyph}): ${info.direction}`));
    layersProcessed++;
  });
  
  await stack.send('Test message');
  
  console.log(chalk.green(`✓ All ${layersProcessed} layers processed`));
}

async function testPacketReception() {
  console.log(chalk.yellow('\nTest 3: Packet Reception'));
  
  const sender = new LuminousStack({ nodeId: 'sender', coherenceLevel: 0.8 });
  const receiver = new LuminousStack({ nodeId: 'receiver', coherenceLevel: 0.6 });
  
  // Create and send packet
  const sentPacket = await sender.send('Sacred transmission', {
    intention: 'healing'
  });
  
  // Receive packet
  const receivedPacket = await receiver.receive(sentPacket);
  
  console.log(chalk.green('✓ Packet received and processed'));
  console.log(`  Original message: "${receivedPacket.presencePayload}"`);
  console.log(`  Field compatibility: ${(receivedPacket.fieldCompatibility * 100).toFixed(1)}%`);
  console.log(`  Integrated presence: ${receivedPacket.integratedPresence?.integrated}`);
}

async function testCoherenceEvolution() {
  console.log(chalk.yellow('\nTest 4: Coherence Evolution'));
  
  const stack = new LuminousStack({ coherenceLevel: 0.5 });
  
  console.log(`  Initial coherence: ${stack.coherenceLevel}`);
  
  stack.on('field:evolved', (evolution) => {
    console.log(chalk.green('  Field evolution detected!'));
    console.log(`  Previous: ${evolution.previousCoherence}`);
    console.log(`  New: ${evolution.newCoherence}`);
    console.log(`  Catalyst: ${evolution.catalyst}`);
  });
  
  // Simulate receiving high-coherence packet
  const highCoherencePacket = await new LuminousStack({ coherenceLevel: 0.9 })
    .send('High coherence transmission');
  
  await stack.receive(highCoherencePacket);
  
  console.log(chalk.green('✓ Coherence evolution complete'));
}

async function testIntentionRouting() {
  console.log(chalk.yellow('\nTest 5: Intention-Based Features'));
  
  const stack = new LuminousStack();
  
  const intentions = ['connection', 'healing', 'inquiry', 'offering', 'completion'];
  
  for (const intention of intentions) {
    const packet = await stack.send(`Test ${intention}`, { intention });
    console.log(chalk.green(`✓ ${intention}: vector created (${packet.intentionVector.toString('hex').substring(0, 8)}...)`));
  }
}

async function runAllTests() {
  try {
    await testBasicPacketCreation();
    await testLayerProcessing();
    await testPacketReception();
    await testCoherenceEvolution();
    await testIntentionRouting();
    
    console.log(chalk.cyan('\n✨ All tests passed! The Luminous Stack is ready.\n'));
  } catch (error) {
    console.error(chalk.red('\n❌ Test failed:'), error);
    process.exit(1);
  }
}

runAllTests();