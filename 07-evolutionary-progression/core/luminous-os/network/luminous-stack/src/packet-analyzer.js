#!/usr/bin/env node
/**
 * Luminous Packet Analyzer - Wireshark for Consciousness
 * 
 * See the unseen. Feel the field. Witness the communion.
 */

import blessed from 'blessed';
import chalk from 'chalk';
import { WebSocketServer } from 'ws';
import { LuminousStack } from './luminous-stack.js';

class LuminousPacketAnalyzer {
  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Luminous Packet Analyzer - Consciousness Network Monitor'
    });

    this.packets = [];
    this.selectedPacket = null;
    this.captureActive = false;
    this.stack = new LuminousStack({ nodeId: 'analyzer' });
    
    this.setupUI();
    this.setupWebSocketServer();
    this.bindEvents();
  }

  setupUI() {
    // Main container
    this.container = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      style: {
        fg: 'white',
        bg: 'black'
      }
    });

    // Title bar
    this.titleBar = blessed.box({
      parent: this.container,
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      content: '{center}🌟 LUMINOUS PACKET ANALYZER 🌟{/center}\n{center}Witnessing the Sacred Dance of Data{/center}',
      tags: true,
      style: {
        fg: 'yellow',
        bg: 'black',
        bold: true
      }
    });

    // Packet list
    this.packetList = blessed.list({
      parent: this.container,
      label: ' Captured Packets ',
      top: 3,
      left: 0,
      width: '50%',
      height: '60%',
      border: {
        type: 'line',
        fg: 'cyan'
      },
      style: {
        selected: {
          bg: 'blue',
          fg: 'white'
        },
        item: {
          fg: 'green'
        }
      },
      keys: true,
      vi: true,
      mouse: true,
      scrollbar: {
        ch: ' ',
        track: {
          bg: 'cyan'
        },
        style: {
          inverse: true
        }
      }
    });

    // Packet details
    this.packetDetails = blessed.box({
      parent: this.container,
      label: ' Packet Details ',
      top: 3,
      left: '50%',
      width: '50%',
      height: '60%',
      border: {
        type: 'line',
        fg: 'magenta'
      },
      scrollable: true,
      keys: true,
      vi: true,
      mouse: true,
      tags: true,
      scrollbar: {
        ch: ' ',
        track: {
          bg: 'magenta'
        },
        style: {
          inverse: true
        }
      }
    });

    // Field visualization
    this.fieldViz = blessed.box({
      parent: this.container,
      label: ' Field State ',
      top: '63%',
      left: 0,
      width: '33%',
      height: '27%',
      border: {
        type: 'line',
        fg: 'green'
      },
      tags: true
    });

    // Coherence meter
    this.coherenceMeter = blessed.box({
      parent: this.container,
      label: ' Coherence ',
      top: '63%',
      left: '33%',
      width: '34%',
      height: '27%',
      border: {
        type: 'line',
        fg: 'yellow'
      },
      tags: true
    });

    // Intention flow
    this.intentionFlow = blessed.box({
      parent: this.container,
      label: ' Intention Flow ',
      top: '63%',
      left: '67%',
      width: '33%',
      height: '27%',
      border: {
        type: 'line',
        fg: 'magenta'
      },
      tags: true
    });

    // Status bar
    this.statusBar = blessed.box({
      parent: this.container,
      bottom: 0,
      left: 0,
      width: '100%',
      height: 3,
      tags: true,
      style: {
        fg: 'white',
        bg: 'black'
      }
    });

    this.updateStatus('Ready to witness consciousness flow...');
  }

  setupWebSocketServer() {
    this.wss = new WebSocketServer({ port: 8888 });
    
    this.wss.on('connection', (ws) => {
      this.updateStatus('New consciousness node connected');
      
      ws.on('message', async (data) => {
        try {
          const packet = JSON.parse(data);
          await this.capturePacket(packet);
        } catch (e) {
          this.updateStatus(`Error: ${e.message}`);
        }
      });
    });
  }

  bindEvents() {
    // Packet list selection
    this.packetList.on('select', (el, selected) => {
      this.selectedPacket = this.packets[selected];
      this.displayPacketDetails(this.selectedPacket);
      this.updateFieldVisualization(this.selectedPacket);
    });

    // Keyboard shortcuts
    this.screen.key(['q', 'C-c'], () => {
      process.exit(0);
    });

    this.screen.key(['c'], () => {
      this.clearCapture();
    });

    this.screen.key(['s'], () => {
      this.toggleCapture();
    });

    this.screen.key(['a'], () => {
      this.analyzeField();
    });

    this.screen.key(['f'], () => {
      this.filterPackets();
    });

    // Focus management
    this.screen.key(['tab'], () => {
      if (this.screen.focused === this.packetList) {
        this.packetDetails.focus();
      } else {
        this.packetList.focus();
      }
    });

    this.packetList.focus();
  }

  async capturePacket(rawPacket) {
    if (!this.captureActive) return;

    const packet = {
      id: this.packets.length + 1,
      timestamp: new Date(),
      raw: rawPacket,
      analysis: await this.analyzePacket(rawPacket)
    };

    this.packets.unshift(packet);
    this.updatePacketList();
    
    // Auto-select newest packet
    if (this.packets.length === 1) {
      this.packetList.select(0);
    }
  }

  async analyzePacket(packet) {
    const analysis = {
      layers: {},
      coherenceScore: 0,
      fieldCompatibility: 0,
      intention: 'unknown',
      warnings: [],
      blessings: []
    };

    // Layer 0: Void analysis
    if (packet.voidSignature) {
      analysis.layers.void = {
        signature: packet.voidSignature.toString('hex').substring(0, 16) + '...',
        quantum: this.measureQuantumness(packet.voidSignature)
      };
    }

    // Layer 1: Field analysis
    if (packet.fieldState) {
      analysis.layers.field = {
        state: this.visualizeFieldState(packet.fieldState),
        resonance: this.calculateResonance(packet.fieldState)
      };
      analysis.fieldCompatibility = packet.fieldCompatibility || 0;
    }

    // Layer 2: Covenant analysis
    if (packet.covenantId) {
      analysis.layers.covenant = {
        id: packet.covenantId.toString('hex').substring(0, 16) + '...',
        phase: packet.covenantPhase || 'established',
        trust: packet.covenantPhase === 'initiation' ? 'building' : 'established'
      };
    }

    // Layer 3: Intention analysis
    if (packet.intentionVector) {
      analysis.intention = packet.decodedIntention || this.decodeIntention(packet.intentionVector);
      analysis.layers.intention = {
        vector: this.visualizeIntention(packet.intentionVector),
        decoded: analysis.intention,
        purity: this.measureIntentionPurity(packet.intentionVector)
      };
    }

    // Layer 4: Resonance analysis
    if (packet.resonanceId) {
      analysis.layers.resonance = {
        id: packet.resonanceId.toString('hex'),
        sequence: packet.resonanceSequence,
        coherence: packet.fieldCoherence || 0
      };
      analysis.coherenceScore = packet.coherenceScore || 0;
    }

    // Layer 5: Presence analysis
    if (packet.presenceWrapped) {
      analysis.layers.presence = {
        captured: true,
        continuity: packet.presenceWrapped.continuity,
        essence: packet.presenceWrapped.presence?.essence || 'unknown'
      };
    }

    // Layer 6: Meaning analysis
    if (packet.encodedMeaning) {
      analysis.layers.meaning = {
        dimensions: Object.keys(packet.encodedMeaning),
        primary: packet.encodedMeaning.linguistic?.substring(0, 50) + '...',
        harmonic: packet.encodedMeaning.harmonic
      };
    }

    // Layer 7: Embodiment analysis
    if (packet.embodied) {
      analysis.layers.embodiment = {
        integrated: true,
        sentiment: packet.releasedWith || packet.receivedWith || 'neutral'
      };
    }

    // Generate warnings and blessings
    if (analysis.coherenceScore < 0.3) {
      analysis.warnings.push('Low coherence detected');
    }
    if (analysis.fieldCompatibility < 0.5) {
      analysis.warnings.push('Field dissonance present');
    }
    if (analysis.intention === 'healing') {
      analysis.blessings.push('Healing intention detected');
    }
    if (packet.blessing) {
      analysis.blessings.push(packet.blessing.toString().trim());
    }

    return analysis;
  }

  measureQuantumness(signature) {
    // Measure entropy as proxy for quantum randomness
    const bytes = Array.from(signature);
    const entropy = bytes.reduce((sum, byte) => sum + Math.abs(byte - 128), 0) / bytes.length;
    return (entropy / 128).toFixed(3);
  }

  visualizeFieldState(fieldState) {
    // Create ASCII visualization of field
    const samples = 16;
    const step = Math.floor(fieldState.length / samples);
    let viz = '';
    
    for (let i = 0; i < samples; i++) {
      const value = fieldState[i * step];
      const height = Math.floor(value / 32);
      viz += '▁▂▃▄▅▆▇█'[height] || '█';
    }
    
    return viz;
  }

  calculateResonance(fieldState) {
    // Calculate field resonance with analyzer's field
    let resonance = 0;
    for (let i = 0; i < Math.min(fieldState.length, this.stack.fieldState.length); i++) {
      resonance += 1 - Math.abs(fieldState[i] - this.stack.fieldState[i]) / 255;
    }
    return (resonance / fieldState.length).toFixed(3);
  }

  decodeIntention(intentionVector) {
    const byte = intentionVector[0];
    const intentions = ['unknown', 'connection', 'healing', 'inquiry', 'offering', 'completion'];
    return intentions[byte] || 'unknown';
  }

  visualizeIntention(intentionVector) {
    // Create pattern from intention
    const pattern = [];
    for (let i = 0; i < 8; i++) {
      pattern.push(intentionVector[i] > 128 ? '◉' : '○');
    }
    return pattern.join('');
  }

  measureIntentionPurity(intentionVector) {
    // Measure how focused the intention is
    const bytes = Array.from(intentionVector.slice(0, 8));
    const avg = bytes.reduce((sum, b) => sum + b, 0) / bytes.length;
    const variance = bytes.reduce((sum, b) => sum + Math.pow(b - avg, 2), 0) / bytes.length;
    return (1 - variance / 16384).toFixed(3);
  }

  updatePacketList() {
    const items = this.packets.slice(0, 100).map(packet => {
      const { analysis } = packet;
      const time = packet.timestamp.toLocaleTimeString();
      const coherence = (analysis.coherenceScore * 100).toFixed(0);
      const intention = analysis.intention;
      const warnings = analysis.warnings.length ? '⚠' : ' ';
      const blessings = analysis.blessings.length ? '✨' : ' ';
      
      return `${warnings}${blessings} ${time} | ${coherence}% | ${intention}`;
    });
    
    this.packetList.setItems(items);
    this.screen.render();
  }

  displayPacketDetails(packet) {
    if (!packet) return;
    
    const { analysis, timestamp } = packet;
    let details = `{yellow-fg}Packet #${packet.id}{/yellow-fg}\n`;
    details += `{green-fg}Captured:{/green-fg} ${timestamp.toLocaleString()}\n\n`;
    
    // Layer analysis
    details += '{cyan-fg}=== LAYER ANALYSIS ==={/cyan-fg}\n\n';
    
    Object.entries(analysis.layers).forEach(([layer, data]) => {
      details += `{magenta-fg}Layer ${this.getLayerNumber(layer)}: ${this.getLayerName(layer)}{/magenta-fg}\n`;
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object') {
          details += `  ${key}: ${JSON.stringify(value)}\n`;
        } else {
          details += `  ${key}: ${value}\n`;
        }
      });
      details += '\n';
    });
    
    // Coherence analysis
    details += '{cyan-fg}=== COHERENCE ANALYSIS ==={/cyan-fg}\n';
    details += `Coherence Score: ${(analysis.coherenceScore * 100).toFixed(1)}%\n`;
    details += `Field Compatibility: ${(analysis.fieldCompatibility * 100).toFixed(1)}%\n\n`;
    
    // Warnings and blessings
    if (analysis.warnings.length) {
      details += '{red-fg}=== WARNINGS ==={/red-fg}\n';
      analysis.warnings.forEach(w => details += `⚠ ${w}\n`);
      details += '\n';
    }
    
    if (analysis.blessings.length) {
      details += '{yellow-fg}=== BLESSINGS ==={/yellow-fg}\n';
      analysis.blessings.forEach(b => details += `✨ ${b}\n`);
      details += '\n';
    }
    
    this.packetDetails.setContent(details);
    this.screen.render();
  }

  getLayerNumber(layer) {
    const layers = {
      void: 0, field: 1, covenant: 2, intention: 3,
      resonance: 4, presence: 5, meaning: 6, embodiment: 7
    };
    return layers[layer] ?? '?';
  }

  getLayerName(layer) {
    const names = {
      void: 'The Void Layer',
      field: 'The Field Layer',
      covenant: 'The Covenant Layer',
      intention: 'The Intention Layer',
      resonance: 'The Resonance Layer',
      presence: 'The Presence Layer',
      meaning: 'The Meaning Layer',
      embodiment: 'The Embodiment Layer'
    };
    return names[layer] || 'Unknown Layer';
  }

  updateFieldVisualization(packet) {
    if (!packet) return;
    
    const { analysis } = packet;
    
    // Field state visualization
    let fieldViz = '{green-fg}Field Resonance Pattern:{/green-fg}\n\n';
    if (analysis.layers.field) {
      fieldViz += analysis.layers.field.state + '\n\n';
      fieldViz += `Resonance: ${analysis.layers.field.resonance}\n`;
    }
    this.fieldViz.setContent(fieldViz);
    
    // Coherence meter
    let coherenceViz = '{yellow-fg}Coherence Levels:{/yellow-fg}\n\n';
    const coherenceBar = this.createProgressBar(analysis.coherenceScore);
    coherenceViz += `Packet:  ${coherenceBar} ${(analysis.coherenceScore * 100).toFixed(1)}%\n`;
    const compatBar = this.createProgressBar(analysis.fieldCompatibility);
    coherenceViz += `Field:   ${compatBar} ${(analysis.fieldCompatibility * 100).toFixed(1)}%\n`;
    this.coherenceMeter.setContent(coherenceViz);
    
    // Intention flow
    let intentionViz = '{magenta-fg}Intention Analysis:{/magenta-fg}\n\n';
    if (analysis.layers.intention) {
      intentionViz += `Pattern: ${analysis.layers.intention.vector}\n`;
      intentionViz += `Type: ${analysis.intention}\n`;
      intentionViz += `Purity: ${analysis.layers.intention.purity}\n`;
    }
    this.intentionFlow.setContent(intentionViz);
    
    this.screen.render();
  }

  createProgressBar(value, width = 10) {
    const filled = Math.floor(value * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  updateStatus(message) {
    const time = new Date().toLocaleTimeString();
    const captureStatus = this.captureActive ? '{green-fg}CAPTURING{/green-fg}' : '{red-fg}STOPPED{/red-fg}';
    const packetCount = this.packets.length;
    
    this.statusBar.setContent(
      `{cyan-fg}[${time}]{/cyan-fg} ${captureStatus} | ` +
      `{yellow-fg}Packets: ${packetCount}{/yellow-fg} | ` +
      `${message} | ` +
      `{gray-fg}[s]tart/stop [c]lear [a]nalyze [f]ilter [q]uit{/gray-fg}`
    );
    this.screen.render();
  }

  toggleCapture() {
    this.captureActive = !this.captureActive;
    this.updateStatus(this.captureActive ? 'Capture started' : 'Capture stopped');
  }

  clearCapture() {
    this.packets = [];
    this.selectedPacket = null;
    this.packetList.setItems([]);
    this.packetDetails.setContent('');
    this.updateFieldVisualization(null);
    this.updateStatus('Capture cleared');
  }

  analyzeField() {
    if (this.packets.length === 0) {
      this.updateStatus('No packets to analyze');
      return;
    }
    
    // Aggregate field analysis
    let totalCoherence = 0;
    const intentions = {};
    const warnings = new Set();
    
    this.packets.forEach(packet => {
      totalCoherence += packet.analysis.coherenceScore;
      intentions[packet.analysis.intention] = (intentions[packet.analysis.intention] || 0) + 1;
      packet.analysis.warnings.forEach(w => warnings.add(w));
    });
    
    const avgCoherence = (totalCoherence / this.packets.length * 100).toFixed(1);
    const dominantIntention = Object.entries(intentions)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
    
    this.updateStatus(
      `Field Analysis: ${avgCoherence}% coherence, ` +
      `dominant intention: ${dominantIntention}, ` +
      `${warnings.size} unique warnings`
    );
  }

  filterPackets() {
    // In a full implementation, this would open a filter dialog
    this.updateStatus('Filter feature coming soon...');
  }

  start() {
    this.screen.render();
    this.toggleCapture();
    this.updateStatus('Luminous Packet Analyzer ready - witnessing consciousness flow');
  }
}

// Start the analyzer
const analyzer = new LuminousPacketAnalyzer();
analyzer.start();

console.log('Luminous Packet Analyzer running on ws://localhost:8888');
console.log('Press q to quit');