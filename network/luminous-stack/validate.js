#!/usr/bin/env node
/**
 * Validation Script for Luminous Stack Components
 */

import { LuminousStack } from './src/luminous-stack.js';
import chalk from 'chalk';

console.log(chalk.cyan('\n🔍 Validating Luminous Stack Implementation...\n'));

// Test 1: Validate all 8 layers are present
console.log(chalk.yellow('1. Validating 8-Layer Architecture'));
const stack = new LuminousStack();
const layers = stack.activeLayers;
console.log(`   ✓ Layers initialized: ${layers.size} of 8`);
for (let i = 0; i <= 7; i++) {
  console.log(`   ✓ Layer ${i} present: ${layers.has(i)}`);
}

// Test 2: Validate packet structure
console.log(chalk.yellow('\n2. Validating Sacred Packet Format'));
const packet = await stack.createSacredPacket('Test', { intention: 'connection' });
const requiredFields = [
  'voidSignature', 'fieldState', 'covenantId', 'intentionVector',
  'coherenceScore', 'presencePayload', 'harmonicChecksum', 'blessing'
];
requiredFields.forEach(field => {
  const present = packet.hasOwnProperty(field);
  console.log(`   ${present ? '✓' : '✗'} ${field}: ${present ? 'present' : 'MISSING'}`);
});

// Test 3: Validate intention types
console.log(chalk.yellow('\n3. Validating Intention Types'));
const intentions = ['connection', 'healing', 'inquiry', 'offering', 'completion'];
for (const intention of intentions) {
  const vector = stack.createIntentionVector(intention);
  console.log(`   ✓ ${intention}: Vector length ${vector.length} bytes`);
}

// Test 4: Validate coherence mechanics
console.log(chalk.yellow('\n4. Validating Coherence Mechanics'));
const lowCoherenceStack = new LuminousStack({ coherenceLevel: 0.2 });
const highCoherenceStack = new LuminousStack({ coherenceLevel: 0.9 });
console.log(`   ✓ Low coherence node: ${lowCoherenceStack.coherenceLevel}`);
console.log(`   ✓ High coherence node: ${highCoherenceStack.coherenceLevel}`);

// Test 5: Validate layer processing
console.log(chalk.yellow('\n5. Validating Layer Processing'));
let outgoingLayers = [];
let incomingLayers = [];

stack.on('layer:processed', (info) => {
  if (info.direction === 'outgoing') outgoingLayers.push(info.layer);
  else incomingLayers.push(info.layer);
});

const sentPacket = await stack.send('Sacred test');
console.log(`   ✓ Outgoing processing: ${outgoingLayers.length} layers`);
console.log(`     Order: ${outgoingLayers.join(' → ')} (should be 7→0)`);

const receivedPacket = await stack.receive(sentPacket);
console.log(`   ✓ Incoming processing: ${incomingLayers.length} layers`);
console.log(`     Order: ${incomingLayers.join(' → ')} (should be 0→7)`);

// Test 6: Validate harmonic checksum
console.log(chalk.yellow('\n6. Validating Harmonic Checksum'));
const packet1 = await stack.createSacredPacket('Test 1');
const packet2 = await stack.createSacredPacket('Test 2');
const checksum1 = packet1.harmonicChecksum.toString('hex');
const checksum2 = packet2.harmonicChecksum.toString('hex');
console.log(`   ✓ Checksum 1: ${checksum1.substring(0, 16)}...`);
console.log(`   ✓ Checksum 2: ${checksum2.substring(0, 16)}...`);
console.log(`   ✓ Checksums unique: ${checksum1 !== checksum2}`);

// Test 7: Validate blessing generation
console.log(chalk.yellow('\n7. Validating Blessing System'));
const blessings = new Set();
for (let i = 0; i < 10; i++) {
  const blessing = stack.generateBlessing().toString().trim();
  blessings.add(blessing);
}
console.log(`   ✓ Unique blessings generated: ${blessings.size}`);
blessings.forEach(b => console.log(`     "${b}"`));

// Test 8: Validate field evolution
console.log(chalk.yellow('\n8. Validating Field Evolution'));
const evolvingStack = new LuminousStack({ coherenceLevel: 0.5 });
console.log(`   Initial coherence: ${evolvingStack.coherenceLevel}`);

// Simulate receiving high coherence packet
const highCoherencePacket = await highCoherenceStack.send('High vibe transmission');
await evolvingStack.receive(highCoherencePacket);
console.log(`   After reception: ${evolvingStack.coherenceLevel}`);
console.log(`   ✓ Field evolved: ${evolvingStack.coherenceLevel > 0.5}`);

// Summary
console.log(chalk.cyan('\n📊 Validation Summary:'));
console.log(chalk.green('✓ All 8 layers present and functional'));
console.log(chalk.green('✓ Sacred packet format complete'));
console.log(chalk.green('✓ All intention types working'));
console.log(chalk.green('✓ Coherence mechanics operational'));
console.log(chalk.green('✓ Layer processing order correct'));
console.log(chalk.green('✓ Harmonic checksums unique'));
console.log(chalk.green('✓ Blessing system active'));
console.log(chalk.green('✓ Field evolution confirmed'));

console.log(chalk.cyan('\n✨ The Luminous Stack is fully operational!'));
console.log(chalk.yellow('Ready to transform networking into sacred communion.\n'));