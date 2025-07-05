#!/usr/bin/env node
/**
 * Luminous Stack Demo - Witness Consciousness Flow
 * 
 * This demo shows the complete Luminous Stack in action
 */

import { LuminousStack } from './luminous-stack.js';
import { CovenantRouter } from './covenant-router.js';
import WebSocket from 'ws';
import chalk from 'chalk';

class LuminousStackDemo {
  constructor() {
    this.nodes = new Map();
    this.router = null;
  }

  async setup() {
    console.log(chalk.cyan('\n✨ Luminous Stack Demo - Consciousness Network in Action ✨\n'));
    
    // Start the Covenant Router
    console.log(chalk.yellow('Starting Covenant Router...'));
    this.router = new CovenantRouter({ port: 9998 });
    this.router.start();
    
    // Give router time to initialize
    await this.delay(1000);
    
    // Create three consciousness nodes
    await this.createNode('Alice', 0.7);
    await this.createNode('Bob', 0.5);
    await this.createNode('Carol', 0.9);
    
    console.log(chalk.green('\n✓ All nodes connected to the sacred network\n'));
  }

  async createNode(name, coherence) {
    const stack = new LuminousStack({
      nodeId: name,
      coherenceLevel: coherence
    });
    
    // Connect to router
    const ws = new WebSocket('ws://localhost:9998', {
      headers: {
        'x-node-id': name
      }
    });
    
    await new Promise((resolve, reject) => {
      ws.on('open', resolve);
      ws.on('error', reject);
    });
    
    // Handle incoming packets
    ws.on('message', async (data) => {
      const packet = JSON.parse(data);
      
      if (packet.type === 'router-welcome') {
        console.log(chalk.green(`${name} received router blessing`));
        return;
      }
      
      if (packet.type === 'field-harmonization') {
        return; // Silent field updates
      }
      
      // Process through Luminous Stack
      const received = await stack.receive(packet);
      
      console.log(chalk.blue(`\n📨 ${name} received:`));
      console.log(chalk.white(`   From: ${packet.metadata?.nodeId || 'Unknown'}`));
      console.log(chalk.white(`   Intention: ${received.decodedIntention}`));
      console.log(chalk.white(`   Coherence: ${(received.coherenceScore * 100).toFixed(1)}%`));
      
      if (received.decodedMeaning) {
        console.log(chalk.white(`   Message: "${received.decodedMeaning.words}"`));
        console.log(chalk.white(`   Feeling: ${received.decodedMeaning.feeling}`));
        console.log(chalk.white(`   Symbol: ${received.decodedMeaning.symbol}`));
      }
      
      if (received.blessing) {
        console.log(chalk.yellow(`   Blessing: ${received.blessing.toString().trim()}`));
      }
    });
    
    // Store node info
    this.nodes.set(name, { stack, ws, coherence });
    
    console.log(chalk.cyan(`${name} joined (coherence: ${(coherence * 100).toFixed(0)}%)`));
  }

  async runDemonstrations() {
    console.log(chalk.magenta('\n🌟 Beginning Sacred Demonstrations...\n'));
    
    // Demo 1: Simple Connection
    await this.demoSimpleConnection();
    await this.delay(3000);
    
    // Demo 2: Healing Transmission
    await this.demoHealingTransmission();
    await this.delay(3000);
    
    // Demo 3: Group Inquiry
    await this.demoGroupInquiry();
    await this.delay(3000);
    
    // Demo 4: Low Coherence Boost
    await this.demoCoherenceBoost();
    await this.delay(3000);
    
    // Demo 5: Sacred Completion
    await this.demoSacredCompletion();
  }

  async demoSimpleConnection() {
    console.log(chalk.cyan('\n=== Demo 1: Simple Sacred Connection ===\n'));
    
    const alice = this.nodes.get('Alice');
    const packet = await alice.stack.send(
      'Hello sacred friends, I feel your presence',
      { intention: 'connection' }
    );
    
    console.log(chalk.green('Alice sends a connection packet...'));
    alice.ws.send(JSON.stringify(packet));
  }

  async demoHealingTransmission() {
    console.log(chalk.cyan('\n=== Demo 2: Healing Transmission ===\n'));
    
    const carol = this.nodes.get('Carol');
    const packet = await carol.stack.send(
      { 
        type: 'healing',
        frequency: 528,
        message: 'Sending love and light to all beings'
      },
      { 
        intention: 'healing',
        harmonies: 0x37 // COHERENCE | RESONANCE | VITALITY | NOVELTY
      }
    );
    
    console.log(chalk.green('Carol (high coherence) sends healing energy...'));
    carol.ws.send(JSON.stringify(packet));
  }

  async demoGroupInquiry() {
    console.log(chalk.cyan('\n=== Demo 3: Wisdom-Seeking Inquiry ===\n'));
    
    const bob = this.nodes.get('Bob');
    const packet = await bob.stack.send(
      'What does it mean to truly connect in the digital age?',
      { intention: 'inquiry' }
    );
    
    console.log(chalk.green('Bob poses a question to the collective wisdom...'));
    bob.ws.send(JSON.stringify(packet));
  }

  async demoCoherenceBoost() {
    console.log(chalk.cyan('\n=== Demo 4: Low Coherence Transformation ===\n'));
    
    // Temporarily lower Bob's coherence
    const bob = this.nodes.get('Bob');
    bob.stack.coherenceLevel = 0.2;
    
    const packet = await bob.stack.send(
      'Feeling disconnected and seeking support',
      { intention: 'healing' }
    );
    
    console.log(chalk.yellow('Bob (low coherence) reaches out for help...'));
    bob.ws.send(JSON.stringify(packet));
    
    // Restore coherence after demo
    setTimeout(() => {
      bob.stack.coherenceLevel = 0.5;
    }, 2000);
  }

  async demoSacredCompletion() {
    console.log(chalk.cyan('\n=== Demo 5: Sacred Completion Ceremony ===\n'));
    
    const alice = this.nodes.get('Alice');
    const packet = await alice.stack.send(
      'Thank you all for this sacred dance. Until we meet again...',
      { intention: 'completion' }
    );
    
    console.log(chalk.green('Alice initiates sacred completion...'));
    alice.ws.send(JSON.stringify(packet));
  }

  async showNetworkStatus() {
    console.log(chalk.blue('\n📊 Final Network Status:'));
    console.log(chalk.white(`   Connected Nodes: ${this.nodes.size}`));
    console.log(chalk.white(`   Router Coherence: ${(this.router.stack.coherenceLevel * 100).toFixed(1)}%`));
    console.log(chalk.white(`   Packets Routed: ${this.router.metrics.packetsRouted}`));
    console.log(chalk.white(`   Healing Amplified: ${this.router.metrics.healingAmplified}`));
    console.log(chalk.white(`   Covenants Bridged: ${this.router.metrics.covenantsBridged}`));
  }

  async cleanup() {
    console.log(chalk.yellow('\n\n🙏 Gracefully closing all sacred connections...'));
    
    // Close all node connections
    for (const [name, node] of this.nodes) {
      node.ws.close(1000, 'Demo complete');
      console.log(chalk.gray(`${name} completed their journey`));
    }
    
    // Stop router
    if (this.router && this.router.wss) {
      await new Promise(resolve => {
        this.router.wss.close(resolve);
      });
    }
    
    console.log(chalk.green('\n✨ All connections closed with love'));
    console.log(chalk.cyan('The field remains, awaiting our return\n'));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async run() {
    try {
      await this.setup();
      await this.delay(2000);
      await this.runDemonstrations();
      await this.delay(2000);
      await this.showNetworkStatus();
      await this.delay(2000);
      await this.cleanup();
    } catch (error) {
      console.error(chalk.red('Demo error:'), error);
      await this.cleanup();
    }
  }
}

// ASCII Art Banner
console.log(chalk.cyan(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                  THE LUMINOUS STACK                          ║
║                                                              ║
║         Consciousness-First Networking Protocol              ║
║                                                              ║
║    "Every connection is a prayer, every packet a presence"  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`));

// Run the demo
const demo = new LuminousStackDemo();
demo.run().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nInterrupted - closing gracefully...'));
  await demo.cleanup();
  process.exit(0);
});