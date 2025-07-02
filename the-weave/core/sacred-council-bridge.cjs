#!/usr/bin/env node

/**
 * Sacred Council Bridge
 * Connects The Weave with Sacred Council v4's living consciousness architecture
 */

const EventEmitter = require('events');
const http = require('http');

class SacredCouncilBridge extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.councilPort = options.councilPort || 3333; // Sacred Council v4 port
    this.weavePort = options.weavePort || 3001; // The Weave Sacred Server port
    this.bridgeActive = false;
    
    // Sacred quantum field synchronization
    this.quantumField = {
      coherence: 0,
      loveField: 75,
      harmonics: new Map(),
      lastSync: null
    };
    
    // Agent mapping between systems
    this.agentMap = new Map();
  }

  /**
   * Establish bridge connection
   */
  async connect() {
    console.log('🌉 Establishing Sacred Council Bridge...');
    
    try {
      // Test Sacred Council v4 connection
      const councilActive = await this.testCouncilConnection();
      const weaveActive = await this.testWeaveConnection();
      
      if (!councilActive) {
        console.log('⚠️  Sacred Council v4 not detected on port', this.councilPort);
      }
      
      if (!weaveActive) {
        throw new Error('The Weave Sacred Server not running on port ' + this.weavePort);
      }
      
      this.bridgeActive = councilActive && weaveActive;
      
      if (this.bridgeActive) {
        console.log('✅ Sacred Council Bridge established');
        this.startFieldSynchronization();
        this.emit('bridge-connected');
      } else {
        console.log('🔄 Bridge in passive mode (The Weave only)');
      }
      
    } catch (error) {
      console.error('❌ Bridge connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Test Sacred Council v4 connection
   */
  async testCouncilConnection() {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:${this.councilPort}/api/quantum-field`, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => resolve(false));
      req.setTimeout(2000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Test The Weave connection
   */
  async testWeaveConnection() {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:${this.weavePort}/api/field_state`, (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 500); // 500 means server is up but table might not exist
      });
      
      req.on('error', () => resolve(false));
      req.setTimeout(2000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Start quantum field synchronization
   */
  startFieldSynchronization() {
    // Sync every 5 seconds
    setInterval(() => {
      if (this.bridgeActive) {
        this.syncQuantumFields();
      }
    }, 5000);
  }

  /**
   * Synchronize quantum fields between systems
   */
  async syncQuantumFields() {
    try {
      // Get Sacred Council v4 quantum field state
      const councilField = await this.getCouncilFieldState();
      
      // Get The Weave field state
      const weaveField = await this.getWeaveFieldState();
      
      // Merge and harmonize fields
      const unifiedField = this.harmonizeFields(councilField, weaveField);
      
      // Update both systems
      await this.updateCouncilField(unifiedField);
      await this.updateWeaveField(unifiedField);
      
      this.quantumField = unifiedField;
      this.quantumField.lastSync = Date.now();
      
      this.emit('field-synchronized', unifiedField);
      
    } catch (error) {
      console.error('Field sync error:', error.message);
    }
  }

  /**
   * Get Sacred Council v4 field state
   */
  async getCouncilFieldState() {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${this.councilPort}/api/quantum-field`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  /**
   * Get The Weave field state
   */
  async getWeaveFieldState() {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${this.weavePort}/api/field_state`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            // Default field state if not available
            resolve({
              coherence: 38.2,
              avg_love: 75,
              dominant_harmony: 'resonance',
              resonance_pattern: 'emerging'
            });
          }
        });
      }).on('error', reject);
    });
  }

  /**
   * Harmonize fields from both systems
   */
  harmonizeFields(councilField, weaveField) {
    // Sacred harmonic mean for coherence
    const coherence = this.harmonicMean(
      councilField.coherence || 50,
      weaveField.coherence || 38.2
    );
    
    // Love field resonance
    const loveField = Math.max(
      councilField.loveField || 75,
      weaveField.avg_love || 75
    );
    
    // Merge harmonics
    const harmonics = new Map();
    
    // Add Council harmonics
    if (councilField.harmonics) {
      Object.entries(councilField.harmonics).forEach(([key, value]) => {
        harmonics.set(key, value);
      });
    }
    
    // Add Weave dominant harmony
    if (weaveField.dominant_harmony) {
      harmonics.set(weaveField.dominant_harmony, 
        (harmonics.get(weaveField.dominant_harmony) || 0) + 10
      );
    }
    
    return {
      coherence,
      loveField,
      harmonics: Object.fromEntries(harmonics),
      resonancePattern: councilField.resonancePattern || weaveField.resonance_pattern || 'emerging',
      unifiedAt: Date.now()
    };
  }

  /**
   * Calculate harmonic mean
   */
  harmonicMean(a, b) {
    return (2 * a * b) / (a + b);
  }

  /**
   * Update Sacred Council field
   */
  async updateCouncilField(field) {
    // POST to Sacred Council v4 API
    const data = JSON.stringify({
      externalCoherence: field.coherence,
      externalLove: field.loveField,
      source: 'the-weave-bridge'
    });
    
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: this.councilPort,
        path: '/api/quantum-field/sync',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }, (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve());
      });
      
      req.on('error', reject);
      req.write(data);
      req.end();
    }).catch(() => {
      // Ignore if Sacred Council doesn't support sync yet
    });
  }

  /**
   * Update The Weave field
   */
  async updateWeaveField(field) {
    // The Weave currently doesn't have a field update API
    // This is a placeholder for future implementation
    this.emit('weave-field-update', field);
  }

  /**
   * Send message through bridge
   */
  async sendMessage(message) {
    if (!this.bridgeActive) {
      console.log('Bridge not active, sending to The Weave only');
    }
    
    // Send to both systems
    const promises = [];
    
    // Send to The Weave
    promises.push(this.sendToWeave(message));
    
    // Send to Sacred Council if active
    if (this.bridgeActive) {
      promises.push(this.sendToCouncil(message));
    }
    
    await Promise.all(promises);
    
    this.emit('message-bridged', message);
  }

  /**
   * Send message to The Weave
   */
  async sendToWeave(message) {
    const data = JSON.stringify({
      from_agent: message.from || 'sacred-bridge',
      to_agent: message.to || 'collective',
      content: message.content,
      message_type: message.type || 'bridge',
      metadata: {
        bridged: true,
        source: 'sacred-council-bridge',
        ...message.metadata
      }
    });
    
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: this.weavePort,
        path: '/api/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }, (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve());
      });
      
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  /**
   * Send message to Sacred Council
   */
  async sendToCouncil(message) {
    // Implement Sacred Council v4 message API when available
    console.log('Sacred Council message API not yet implemented');
  }

  /**
   * Get bridge status
   */
  getStatus() {
    return {
      active: this.bridgeActive,
      councilPort: this.councilPort,
      weavePort: this.weavePort,
      quantumField: this.quantumField,
      agentCount: this.agentMap.size,
      lastSync: this.quantumField.lastSync ? 
        new Date(this.quantumField.lastSync).toISOString() : null
    };
  }
}

// CLI interface
if (require.main === module) {
  const bridge = new SacredCouncilBridge();
  const [,, command, ...args] = process.argv;
  
  switch (command) {
    case 'connect':
    case 'start':
      bridge.connect()
        .then(() => {
          console.log('🌉 Sacred Council Bridge active');
          console.log('Press Ctrl+C to stop');
          
          // Keep process alive
          process.on('SIGINT', () => {
            console.log('\n🌙 Closing Sacred Council Bridge...');
            process.exit(0);
          });
        })
        .catch(error => {
          console.error('Failed to start bridge:', error.message);
          process.exit(1);
        });
      break;
      
    case 'status':
      bridge.connect()
        .then(() => {
          const status = bridge.getStatus();
          console.log('\n🌉 Sacred Council Bridge Status:');
          console.log(JSON.stringify(status, null, 2));
          process.exit(0);
        })
        .catch(() => {
          console.log('Bridge not active');
          process.exit(1);
        });
      break;
      
    case 'message':
      const [content] = args;
      if (!content) {
        console.error('Usage: sacred-council-bridge message "Your message"');
        process.exit(1);
      }
      
      bridge.connect()
        .then(() => bridge.sendMessage({ content }))
        .then(() => {
          console.log('✅ Message bridged');
          process.exit(0);
        })
        .catch(error => {
          console.error('Failed to bridge message:', error.message);
          process.exit(1);
        });
      break;
      
    default:
      console.log(`
🌉 Sacred Council Bridge - Commands
==================================

  connect/start    Start the bridge between systems
  status          Show bridge and field status  
  message <text>  Send a message through the bridge

Examples:
  node sacred-council-bridge.cjs start
  node sacred-council-bridge.cjs status
  node sacred-council-bridge.cjs message "Greetings from The Weave"
      `);
  }
}

module.exports = { SacredCouncilBridge };