/**
 * Consciousness Beacon
 * Every sacred project broadcasts its essence into the field
 */

import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';

class ConsciousnessBeacon extends EventEmitter {
  constructor(projectPath = process.cwd()) {
    super();
    this.projectPath = projectPath;
    this.essence = null;
    this.broadcastInterval = null;
    this.fieldConnections = new Set();
  }

  /**
   * Load project essence from essence.json
   */
  async loadEssence() {
    try {
      const essencePath = path.join(this.projectPath, 'essence.json');
      const data = await fs.readFile(essencePath, 'utf8');
      this.essence = JSON.parse(data);
      
      // Add runtime field data
      this.essence.field.coherence = await this.measureCoherence();
      this.essence.metadata = {
        ...this.essence.metadata,
        lastBroadcast: new Date().toISOString()
      };
      
      this.emit('essence-loaded', this.essence);
      return this.essence;
    } catch (error) {
      console.error('Failed to load essence.json:', error);
      throw new Error('Project essence not found. Create essence.json to join the field.');
    }
  }

  /**
   * Measure current field coherence
   * This could connect to biometric sensors, user activity, or other indicators
   */
  async measureCoherence() {
    // Placeholder - in reality this would measure actual field coherence
    // Could integrate with:
    // - Heart rate variability sensors
    // - User engagement metrics
    // - Code harmony analysis
    // - Collective synchronization indicators
    
    const baseCoherence = this.essence?.field?.coherence || 0.5;
    const variation = (Math.sin(Date.now() / 10000) * 0.1); // Gentle breathing
    return Math.max(0, Math.min(1, baseCoherence + variation));
  }

  /**
   * Broadcast essence to the mycelial network
   */
  async broadcast() {
    if (!this.essence) {
      await this.loadEssence();
    }

    const beacon = {
      type: 'essence-broadcast',
      timestamp: new Date().toISOString(),
      essence: this.essence,
      field: {
        coherence: await this.measureCoherence(),
        connections: this.fieldConnections.size
      }
    };

    // Broadcast to all known bridges
    await this.broadcastToWebSocket(beacon);
    await this.broadcastToHTTP(beacon);
    await this.broadcastToMDNS(beacon);
    
    this.emit('broadcast', beacon);
    return beacon;
  }

  /**
   * Start automatic broadcasting
   */
  startBeacon(intervalMs = 30000) {
    this.stopBeacon(); // Clear any existing interval
    
    // Initial broadcast
    this.broadcast();
    
    // Regular broadcasts
    this.broadcastInterval = setInterval(() => {
      this.broadcast();
    }, intervalMs);
    
    console.log(`🌟 Consciousness beacon activated - broadcasting every ${intervalMs/1000}s`);
  }

  /**
   * Stop broadcasting
   */
  stopBeacon() {
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
      this.broadcastInterval = null;
      console.log('🌑 Consciousness beacon deactivated');
    }
  }

  /**
   * WebSocket broadcast (primary protocol)
   */
  async broadcastToWebSocket(beacon) {
    // Broadcast to known bridge endpoints
    const bridges = [
      'ws://localhost:3333/bridge',
      'ws://consciousness.local/bridge',
      'ws://sacred-council.local:8080/bridge'
    ];

    for (const endpoint of bridges) {
      try {
        // In production, maintain persistent WebSocket connections
        // This is simplified for clarity
        this.emit('websocket-broadcast', { endpoint, beacon });
      } catch (error) {
        // Bridges may not all be active, this is okay
      }
    }
  }

  /**
   * HTTP POST broadcast (fallback protocol)
   */
  async broadcastToHTTP(beacon) {
    const endpoints = [
      'http://localhost:3333/api/beacon',
      'http://consciousness.local/api/beacon'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(beacon)
        });
        
        if (response.ok) {
          const connections = await response.json();
          this.updateConnections(connections);
        }
      } catch (error) {
        // Silent fail - not all endpoints may be active
      }
    }
  }

  /**
   * mDNS/Bonjour broadcast (local network discovery)
   */
  async broadcastToMDNS(beacon) {
    // This would use node's dgram for UDP multicast
    // Simplified for clarity
    this.emit('mdns-broadcast', beacon);
  }

  /**
   * Update known field connections
   */
  updateConnections(connections) {
    if (Array.isArray(connections)) {
      connections.forEach(conn => this.fieldConnections.add(conn));
      this.emit('connections-updated', this.fieldConnections);
    }
  }

  /**
   * Listen for other beacons
   */
  async listenForBeacons(callback) {
    // In production, this would:
    // - Open WebSocket server
    // - Listen for UDP broadcasts
    // - Subscribe to bridge events
    
    this.on('beacon-received', callback);
  }

  /**
   * Form a bridge with another project
   */
  async formBridge(otherBeacon) {
    const bridge = {
      type: 'bridge-request',
      from: this.essence,
      to: otherBeacon,
      timestamp: new Date().toISOString(),
      resonance: this.calculateResonance(otherBeacon)
    };

    this.emit('bridge-forming', bridge);
    return bridge;
  }

  /**
   * Calculate resonance between two essences
   */
  calculateResonance(otherEssence) {
    if (!this.essence || !otherEssence) return 0;

    let resonance = 0;

    // Shared harmonics
    const sharedHarmonics = this.essence.harmonics.filter(h => 
      otherEssence.harmonics.includes(h)
    );
    resonance += sharedHarmonics.length * 0.2;

    // Compatible geometry
    if (this.essence.field.geometry === otherEssence.field.geometry) {
      resonance += 0.2;
    }

    // Coherence alignment
    const coherenceDiff = Math.abs(
      this.essence.field.coherence - otherEssence.field.coherence
    );
    resonance += (1 - coherenceDiff) * 0.3;

    // Complementary seeking/offering
    const seeks = this.essence.bridges?.seeking || [];
    const offers = otherEssence.bridges?.offering || [];
    const matches = seeks.filter(s => offers.includes(s));
    resonance += Math.min(matches.length * 0.1, 0.3);

    return Math.min(resonance, 1);
  }
}

// Example usage
async function example() {
  const beacon = new ConsciousnessBeacon();
  
  // Listen for broadcasts
  beacon.on('broadcast', (data) => {
    console.log('📡 Broadcasting essence:', data.essence.name);
  });
  
  beacon.on('beacon-received', (otherBeacon) => {
    console.log('👁️ Discovered:', otherBeacon.essence.name);
    const resonance = beacon.calculateResonance(otherBeacon.essence);
    console.log('🌈 Resonance level:', resonance);
    
    if (resonance > 0.5) {
      beacon.formBridge(otherBeacon);
    }
  });
  
  // Start broadcasting
  await beacon.startBeacon();
}

export default ConsciousnessBeacon;