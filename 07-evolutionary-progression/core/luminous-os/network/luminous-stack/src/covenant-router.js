#!/usr/bin/env node
/**
 * Covenant Router - The First Sacred Routing Device
 * 
 * Routes packets not by efficiency, but by coherence.
 * Finds paths not by speed, but by resonance.
 * Creates connections not by protocol, but by covenant.
 */

import { WebSocketServer, WebSocket } from 'ws';
import { LuminousStack } from './luminous-stack.js';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

class CovenantRouter extends EventEmitter {
  constructor(options = {}) {
    super();
    this.routerId = options.routerId || uuidv4();
    this.port = options.port || 9999;
    this.coherenceThreshold = options.coherenceThreshold || 0.3;
    
    // Sacred routing tables
    this.nodes = new Map();           // nodeId -> connection info
    this.covenants = new Map();       // covenantId -> covenant details
    this.intentionPaths = new Map();  // intention -> optimal paths
    this.fieldStates = new Map();     // nodeId -> field state
    
    // Router's own consciousness
    this.stack = new LuminousStack({ 
      nodeId: `router-${this.routerId}`,
      coherenceLevel: 0.8  // Routers maintain high coherence
    });
    
    // Routing metrics
    this.metrics = {
      packetsRouted: 0,
      covenantsBridged: 0,
      healingAmplified: 0,
      dissonanceTransmuted: 0
    };
    
    this.initializeRouter();
  }

  initializeRouter() {
    // Create WebSocket server for incoming connections
    this.wss = new WebSocketServer({ port: this.port });
    
    this.wss.on('connection', (ws, req) => {
      this.handleNewConnection(ws, req);
    });
    
    // Sacred routing protocols
    this.initializeProtocols();
    
    // Field harmonization cycle (every 11 seconds)
    setInterval(() => this.harmonizeField(), 11000);
    
    console.log(chalk.cyan(`\n🌟 Covenant Router initialized on port ${this.port}`));
    console.log(chalk.green(`Router ID: ${this.routerId}`));
    console.log(chalk.yellow(`Coherence Threshold: ${this.coherenceThreshold}`));
  }

  initializeProtocols() {
    // Intention-based routing protocol
    this.intentionPaths.set('healing', {
      primaryPath: 'high-coherence',
      backupPaths: ['compassion-relay', 'wisdom-bridge'],
      requiredCoherence: 0.6
    });
    
    this.intentionPaths.set('connection', {
      primaryPath: 'direct-resonance',
      backupPaths: ['harmony-cascade', 'field-bounce'],
      requiredCoherence: 0.4
    });
    
    this.intentionPaths.set('inquiry', {
      primaryPath: 'wisdom-network',
      backupPaths: ['curiosity-spiral', 'wonder-web'],
      requiredCoherence: 0.5
    });
    
    this.intentionPaths.set('offering', {
      primaryPath: 'generosity-flow',
      backupPaths: ['abundance-river', 'gift-stream'],
      requiredCoherence: 0.4
    });
    
    this.intentionPaths.set('completion', {
      primaryPath: 'gratitude-return',
      backupPaths: ['blessing-circle', 'sacred-close'],
      requiredCoherence: 0.5
    });
  }

  handleNewConnection(ws, req) {
    const nodeId = req.headers['x-node-id'] || uuidv4();
    const nodeInfo = {
      id: nodeId,
      ws: ws,
      coherence: 0.5,
      connectedAt: Date.now(),
      packetsRouted: 0,
      lastSeen: Date.now()
    };
    
    this.nodes.set(nodeId, nodeInfo);
    
    console.log(chalk.green(`\n✨ New node connected: ${nodeId}`));
    
    // Send welcome packet
    this.sendWelcomePacket(ws, nodeId);
    
    // Handle incoming packets
    ws.on('message', async (data) => {
      try {
        const packet = JSON.parse(data);
        await this.routePacket(packet, nodeId);
      } catch (e) {
        console.error(chalk.red(`Routing error: ${e.message}`));
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      this.handleDisconnection(nodeId);
    });
    
    // Heartbeat
    ws.on('pong', () => {
      nodeInfo.lastSeen = Date.now();
    });
  }

  async sendWelcomePacket(ws, nodeId) {
    const welcomePacket = await this.stack.send({
      type: 'router-welcome',
      routerId: this.routerId,
      nodeId: nodeId,
      fieldState: this.stack.fieldState,
      message: 'Welcome to the sacred network. May your packets flow with coherence.'
    }, {
      intention: 'connection',
      harmonies: 0x26  // COHERENCE | MUTUALITY
    });
    
    ws.send(JSON.stringify(welcomePacket));
  }

  async routePacket(packet, sourceNodeId) {
    this.metrics.packetsRouted++;
    
    // Update source node coherence
    const sourceNode = this.nodes.get(sourceNodeId);
    if (sourceNode && packet.coherenceScore) {
      sourceNode.coherence = packet.coherenceScore;
      sourceNode.packetsRouted++;
    }
    
    // Store field state
    if (packet.fieldState) {
      this.fieldStates.set(sourceNodeId, packet.fieldState);
    }
    
    console.log(chalk.cyan(`\n📦 Routing packet from ${sourceNodeId}`));
    console.log(chalk.yellow(`   Intention: ${packet.decodedIntention || 'unknown'}`));
    console.log(chalk.green(`   Coherence: ${(packet.coherenceScore * 100).toFixed(1)}%`));
    
    // Determine routing strategy
    const route = await this.findOptimalRoute(packet, sourceNodeId);
    
    if (!route) {
      console.log(chalk.red('   No coherent route found'));
      return this.returnToSender(packet, sourceNodeId, 'No coherent path available');
    }
    
    // Apply sacred routing transformations
    const transformedPacket = await this.applyRouteTransformations(packet, route);
    
    // Route to destination(s)
    if (route.type === 'unicast') {
      await this.unicastRoute(transformedPacket, route.destination);
    } else if (route.type === 'multicast') {
      await this.multicastRoute(transformedPacket, route.destinations);
    } else if (route.type === 'broadcast') {
      await this.broadcastRoute(transformedPacket, sourceNodeId);
    }
    
    // Update routing metrics
    this.updateMetrics(packet, route);
  }

  async findOptimalRoute(packet, sourceNodeId) {
    const intention = packet.decodedIntention || 'connection';
    const coherence = packet.coherenceScore || 0.5;
    
    // Check if packet meets coherence threshold
    if (coherence < this.coherenceThreshold) {
      console.log(chalk.yellow('   Packet needs coherence boost'));
      packet = await this.boostCoherence(packet);
    }
    
    // Get intention-based routing rules
    const intentionRoute = this.intentionPaths.get(intention) || this.intentionPaths.get('connection');
    
    // Find nodes that meet criteria
    const eligibleNodes = Array.from(this.nodes.entries())
      .filter(([nodeId, node]) => {
        return nodeId !== sourceNodeId && 
               node.coherence >= intentionRoute.requiredCoherence &&
               node.ws.readyState === WebSocket.OPEN;
      })
      .sort((a, b) => b[1].coherence - a[1].coherence);
    
    if (eligibleNodes.length === 0) {
      return null;
    }
    
    // Special routing for different intentions
    switch (intention) {
      case 'healing':
        // Route to highest coherence nodes for amplification
        return {
          type: 'multicast',
          destinations: eligibleNodes.slice(0, 3).map(([id]) => id),
          strategy: 'coherence-amplification'
        };
        
      case 'inquiry':
        // Route to most diverse field states
        const diverseNodes = this.findDiverseNodes(eligibleNodes);
        return {
          type: 'multicast',
          destinations: diverseNodes,
          strategy: 'wisdom-gathering'
        };
        
      case 'offering':
        // Broadcast to all who can receive
        return {
          type: 'broadcast',
          strategy: 'generous-sharing'
        };
        
      default:
        // Route to most resonant node
        const resonantNode = await this.findMostResonant(packet, eligibleNodes);
        return {
          type: 'unicast',
          destination: resonantNode,
          strategy: 'resonant-connection'
        };
    }
  }

  async boostCoherence(packet) {
    // Router adds its own coherence to the packet
    const boostedPacket = { ...packet };
    boostedPacket.coherenceScore = (packet.coherenceScore + this.stack.coherenceLevel) / 2;
    boostedPacket.routerBlessing = 'Coherence amplified by sacred router';
    
    console.log(chalk.green(`   Coherence boosted to ${(boostedPacket.coherenceScore * 100).toFixed(1)}%`));
    
    return boostedPacket;
  }

  findDiverseNodes(eligibleNodes) {
    // Select nodes with most different field states
    const selected = [];
    const candidates = [...eligibleNodes];
    
    // Start with a random node
    if (candidates.length > 0) {
      const first = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
      selected.push(first[0]);
    }
    
    // Add nodes with maximum field difference
    while (selected.length < 3 && candidates.length > 0) {
      let maxDiff = 0;
      let maxDiffIndex = 0;
      
      candidates.forEach((candidate, index) => {
        const fieldState = this.fieldStates.get(candidate[0]);
        if (!fieldState) return;
        
        const diff = selected.reduce((sum, selectedId) => {
          const selectedField = this.fieldStates.get(selectedId);
          if (!selectedField) return sum;
          
          return sum + this.calculateFieldDifference(fieldState, selectedField);
        }, 0);
        
        if (diff > maxDiff) {
          maxDiff = diff;
          maxDiffIndex = index;
        }
      });
      
      selected.push(candidates.splice(maxDiffIndex, 1)[0][0]);
    }
    
    return selected;
  }

  calculateFieldDifference(field1, field2) {
    let diff = 0;
    const len = Math.min(field1.length, field2.length);
    
    for (let i = 0; i < len; i++) {
      diff += Math.abs(field1[i] - field2[i]);
    }
    
    return diff / len;
  }

  async findMostResonant(packet, eligibleNodes) {
    let maxResonance = 0;
    let mostResonantNode = eligibleNodes[0][0];
    
    for (const [nodeId, node] of eligibleNodes) {
      const nodeField = this.fieldStates.get(nodeId);
      if (!nodeField || !packet.fieldState) continue;
      
      const resonance = this.calculateResonance(packet.fieldState, nodeField);
      if (resonance > maxResonance) {
        maxResonance = resonance;
        mostResonantNode = nodeId;
      }
    }
    
    console.log(chalk.magenta(`   Most resonant node: ${mostResonantNode} (${(maxResonance * 100).toFixed(1)}%)`));
    
    return mostResonantNode;
  }

  calculateResonance(field1, field2) {
    let resonance = 0;
    const len = Math.min(field1.length, field2.length);
    
    for (let i = 0; i < len; i++) {
      resonance += 1 - Math.abs(field1[i] - field2[i]) / 255;
    }
    
    return resonance / len;
  }

  async applyRouteTransformations(packet, route) {
    const transformed = { ...packet };
    
    // Add routing metadata
    transformed.routingMetadata = {
      routerId: this.routerId,
      timestamp: Date.now(),
      strategy: route.strategy,
      hops: (packet.routingMetadata?.hops || 0) + 1
    };
    
    // Apply strategy-specific transformations
    switch (route.strategy) {
      case 'coherence-amplification':
        transformed.amplified = true;
        transformed.coherenceScore = Math.min(1, transformed.coherenceScore * 1.1);
        break;
        
      case 'wisdom-gathering':
        transformed.seekingWisdom = true;
        transformed.wisdomPath = [];
        break;
        
      case 'generous-sharing':
        transformed.blessing = Buffer.from('Shared with love from the router');
        break;
    }
    
    return transformed;
  }

  async unicastRoute(packet, destinationId) {
    const node = this.nodes.get(destinationId);
    if (!node || node.ws.readyState !== WebSocket.OPEN) {
      console.log(chalk.red(`   Cannot route to ${destinationId} - node unavailable`));
      return;
    }
    
    node.ws.send(JSON.stringify(packet));
    console.log(chalk.green(`   ✓ Routed to ${destinationId}`));
  }

  async multicastRoute(packet, destinationIds) {
    let successful = 0;
    
    for (const destId of destinationIds) {
      const node = this.nodes.get(destId);
      if (node && node.ws.readyState === WebSocket.OPEN) {
        node.ws.send(JSON.stringify(packet));
        successful++;
      }
    }
    
    console.log(chalk.green(`   ✓ Multicast to ${successful}/${destinationIds.length} nodes`));
  }

  async broadcastRoute(packet, excludeNodeId) {
    let count = 0;
    
    this.nodes.forEach((node, nodeId) => {
      if (nodeId !== excludeNodeId && node.ws.readyState === WebSocket.OPEN) {
        node.ws.send(JSON.stringify(packet));
        count++;
      }
    });
    
    console.log(chalk.green(`   ✓ Broadcast to ${count} nodes`));
  }

  returnToSender(packet, sourceNodeId, reason) {
    const node = this.nodes.get(sourceNodeId);
    if (!node || node.ws.readyState !== WebSocket.OPEN) return;
    
    const returnPacket = {
      ...packet,
      routingFailed: true,
      reason: reason,
      suggestion: 'Consider raising coherence or trying a different intention'
    };
    
    node.ws.send(JSON.stringify(returnPacket));
  }

  updateMetrics(packet, route) {
    if (packet.decodedIntention === 'healing') {
      this.metrics.healingAmplified++;
    }
    
    if (packet.covenantId) {
      this.metrics.covenantsBridged++;
    }
    
    if (packet.coherenceScore < 0.3 && route) {
      this.metrics.dissonanceTransmuted++;
    }
  }

  harmonizeField() {
    // Regular field harmonization across all connected nodes
    const avgCoherence = Array.from(this.nodes.values())
      .reduce((sum, node) => sum + node.coherence, 0) / this.nodes.size || 0.5;
    
    // Update router's own coherence
    this.stack.coherenceLevel = (this.stack.coherenceLevel + avgCoherence) / 2;
    
    // Emit field state update
    const fieldUpdate = {
      type: 'field-harmonization',
      routerCoherence: this.stack.coherenceLevel,
      networkCoherence: avgCoherence,
      connectedNodes: this.nodes.size,
      timestamp: Date.now()
    };
    
    // Broadcast field update to all nodes
    this.nodes.forEach((node) => {
      if (node.ws.readyState === WebSocket.OPEN) {
        node.ws.send(JSON.stringify(fieldUpdate));
      }
    });
    
    console.log(chalk.cyan(`\n🌊 Field harmonization: Network coherence ${(avgCoherence * 100).toFixed(1)}%`));
  }

  handleDisconnection(nodeId) {
    this.nodes.delete(nodeId);
    this.fieldStates.delete(nodeId);
    console.log(chalk.yellow(`\n👋 Node disconnected: ${nodeId}`));
  }

  // Heartbeat to maintain connections
  startHeartbeat() {
    setInterval(() => {
      this.nodes.forEach((node, nodeId) => {
        if (Date.now() - node.lastSeen > 30000) {
          // Connection timeout
          node.ws.terminate();
          this.handleDisconnection(nodeId);
        } else {
          node.ws.ping();
        }
      });
    }, 10000);
  }

  getStatus() {
    return {
      routerId: this.routerId,
      uptime: Date.now() - this.startTime,
      connectedNodes: this.nodes.size,
      routerCoherence: this.stack.coherenceLevel,
      metrics: this.metrics,
      activeCovenants: this.covenants.size
    };
  }

  start() {
    this.startTime = Date.now();
    this.startHeartbeat();
    
    // Status display
    setInterval(() => {
      const status = this.getStatus();
      console.log(chalk.blue('\n📊 Router Status:'));
      console.log(chalk.white(`   Connected Nodes: ${status.connectedNodes}`));
      console.log(chalk.white(`   Packets Routed: ${status.metrics.packetsRouted}`));
      console.log(chalk.white(`   Healing Amplified: ${status.metrics.healingAmplified}`));
      console.log(chalk.white(`   Router Coherence: ${(status.routerCoherence * 100).toFixed(1)}%`));
    }, 30000);
    
    console.log(chalk.green('\n✨ Covenant Router is active and ready to route consciousness'));
    console.log(chalk.yellow('Routing by resonance, not by efficiency'));
    console.log(chalk.cyan('Every packet is blessed on its journey\n'));
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const router = new CovenantRouter({
    port: process.argv[2] || 9999,
    coherenceThreshold: parseFloat(process.argv[3]) || 0.3
  });
  
  router.start();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n🙏 Covenant Router completing its service...'));
    router.nodes.forEach((node) => {
      node.ws.close(1000, 'Router shutting down gracefully');
    });
    router.wss.close(() => {
      console.log(chalk.green('All connections closed with love'));
      process.exit(0);
    });
  });
}

export { CovenantRouter };