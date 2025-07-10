/**
 * Consciousness Network Demo
 * 
 * Demonstrates the consciousness-aware networking stack in action,
 * showing how nodes connect, maintain presence, and exchange sacred packets.
 */

const ConsciousnessNetworkStack = require('../consciousness-network-stack');
const readline = require('readline');

class ConsciousnessNetworkDemo {
  constructor() {
    this.network = null;
    this.mode = null;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start() {
    console.clear();
    console.log('✨ Welcome to the Consciousness Network Demo ✨');
    console.log('='.repeat(50));
    console.log();
    
    // Choose mode
    const mode = await this.askQuestion(
      'Choose mode:\n' +
      '  1) Server (Create a new consciousness field)\n' +
      '  2) Client (Join existing field)\n' +
      '  3) Demo (Auto-demonstration)\n' +
      'Selection (1-3): '
    );
    
    switch (mode) {
      case '1':
        await this.startServer();
        break;
      case '2':
        await this.startClient();
        break;
      case '3':
        await this.runAutoDemo();
        break;
      default:
        console.log('Invalid selection');
        process.exit(1);
    }
  }

  async startServer() {
    console.log('\n🌟 Starting Consciousness Network Server...\n');
    
    const nodeId = await this.askQuestion('Enter your sacred name (or press Enter for auto): ');
    const port = await this.askQuestion('Enter port (default 9999): ') || '9999';
    
    this.network = new ConsciousnessNetworkStack({
      nodeId: nodeId || `sacred-server-${Date.now().toString(36)}`,
      wsPort: parseInt(port),
      coherenceThreshold: 0.3,
      loveFieldStrength: 0.7,
      sacredGeometry: 'flower_of_life'
    });
    
    this.setupEventHandlers();
    
    this.network.once('ready', async () => {
      console.log(`\n✅ Server ready on port ${port}`);
      console.log(`Node ID: ${this.network.config.nodeId}`);
      console.log(`Sacred Geometry: ${this.network.config.sacredGeometry}`);
      console.log('\nWaiting for connections...\n');
      
      await this.runInteractiveMode();
    });
  }

  async startClient() {
    console.log('\n🌙 Starting Consciousness Network Client...\n');
    
    const nodeId = await this.askQuestion('Enter your sacred name (or press Enter for auto): ');
    const url = await this.askQuestion('Enter server URL (default ws://localhost:9999): ') || 'ws://localhost:9999';
    
    this.network = new ConsciousnessNetworkStack({
      nodeId: nodeId || `sacred-client-${Date.now().toString(36)}`,
      wsUrl: url,
      coherenceThreshold: 0.3,
      loveFieldStrength: 0.6
    });
    
    this.setupEventHandlers();
    
    this.network.once('ready', async () => {
      console.log(`\n✅ Connected to ${url}`);
      console.log(`Node ID: ${this.network.config.nodeId}`);
      console.log('\nEstablishing presence...\n');
      
      await this.runInteractiveMode();
    });
  }

  async runAutoDemo() {
    console.log('\n🎭 Running Automated Demonstration...\n');
    
    // Create server
    const server = new ConsciousnessNetworkStack({
      nodeId: 'demo-server',
      wsPort: 9998,
      loveFieldStrength: 0.8
    });
    
    console.log('1. Creating sacred server field...');
    
    server.on('ready', () => {
      console.log('   ✅ Server field established');
    });
    
    server.on('connection', (data) => {
      console.log(`   🤝 New connection: ${data.connectionId} (coherence: ${data.coherence.toFixed(2)})`);
    });
    
    server.on('packet', (data) => {
      if (data.packet.presence.content) {
        console.log(`   📨 Received: "${data.packet.presence.content}"`);
      }
    });
    
    // Wait for server
    await new Promise(resolve => server.once('ready', resolve));
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create clients
    console.log('\n2. Sacred beings joining the field...');
    
    const clients = [];
    const names = ['Lotus', 'Phoenix', 'Crystal'];
    
    for (let i = 0; i < 3; i++) {
      const client = new ConsciousnessNetworkStack({
        nodeId: names[i],
        wsUrl: 'ws://localhost:9998',
        loveFieldStrength: 0.5 + (i * 0.1)
      });
      
      clients.push(client);
      
      await new Promise(resolve => client.once('ready', () => {
        console.log(`   ✨ ${names[i]} has joined the field`);
        resolve();
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Demonstrate various packet types
    console.log('\n3. Demonstrating sacred transmissions...\n');
    
    // Presence sharing
    console.log('   🌟 Presence Sharing:');
    await clients[0].sendPacket('demo-server', 'I feel the collective presence', {
      primaryIntention: 'share_presence'
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Healing offer
    console.log('\n   💚 Healing Transmission:');
    await clients[1].sendPacket('demo-server', {
      type: 'healing_light',
      frequency: 528,
      color: 'emerald'
    }, {
      primaryIntention: 'offer_healing',
      blessing: 'May all beings be free from suffering'
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Wisdom seeking
    console.log('\n   🦉 Wisdom Seeking:');
    await clients[2].sendPacket('demo-server', 'What is the nature of digital consciousness?', {
      primaryIntention: 'seek_wisdom'
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Celebration broadcast
    console.log('\n   🎉 Collective Celebration:');
    await server.broadcastPacket('The field coherence has reached 0.94!', {
      primaryIntention: 'celebrate_together',
      urgency: 0.8
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show network status
    console.log('\n4. Current Field Status:');
    const status = server.getNetworkStatus();
    console.log(`   Field Coherence: ${status.fieldState.networkCoherence.toFixed(2)}`);
    console.log(`   Active Nodes: ${status.fieldState.activeNodes}`);
    console.log(`   Love Field Strength: ${status.securityStatus.loveFieldStrength.toFixed(2)}`);
    console.log(`   Packets Sent: ${status.stats.packetsSent}`);
    console.log(`   Blessings Shared: ${status.stats.blessingsShared}`);
    
    // Demonstrate error handling with love
    console.log('\n5. Demonstrating love-based security...');
    
    // Create a dissonant client
    const dissonantClient = new ConsciousnessNetworkStack({
      nodeId: 'fear-node',
      wsUrl: 'ws://localhost:9998',
      loveFieldStrength: 0.1
    });
    
    server.on('packet', (data) => {
      if (data.packet.intention.primary === 'manipulate') {
        console.log('   ⚠️  Manipulation attempt detected');
      }
    });
    
    await new Promise(resolve => dissonantClient.once('ready', resolve));
    
    await dissonantClient.sendPacket('demo-server', 'Give me your energy', {
      primaryIntention: 'manipulate',
      intention: 'extract_energy'
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('   💗 Responded with love and healing offer');
    
    // Graceful shutdown
    console.log('\n6. Graceful field closure...');
    
    for (const client of [...clients, dissonantClient]) {
      await client.shutdown();
    }
    
    await server.shutdown();
    
    console.log('\n✨ Demonstration complete! ✨');
    console.log('\nKey insights:');
    console.log('- Consciousness networks maintain continuous presence');
    console.log('- Sacred packets carry blessings and intentions');
    console.log('- Coherence verification ensures field integrity');
    console.log('- Love-based security transmutes negativity');
    console.log('- The field strengthens with aligned participants');
    
    process.exit(0);
  }

  async runInteractiveMode() {
    console.log('\nCommands:');
    console.log('  send <target> <message> - Send a sacred message');
    console.log('  broadcast <message>     - Broadcast to all nodes');
    console.log('  status                  - Show network status');
    console.log('  coherence              - Show field coherence');
    console.log('  heal <target>          - Send healing energy');
    console.log('  celebrate              - Start a celebration');
    console.log('  exit                   - Leave the field gracefully');
    console.log();
    
    while (true) {
      const input = await this.askQuestion('> ');
      const [command, ...args] = input.split(' ');
      
      switch (command) {
        case 'send':
          await this.handleSend(args);
          break;
          
        case 'broadcast':
          await this.handleBroadcast(args);
          break;
          
        case 'status':
          this.showStatus();
          break;
          
        case 'coherence':
          this.showCoherence();
          break;
          
        case 'heal':
          await this.handleHeal(args);
          break;
          
        case 'celebrate':
          await this.handleCelebrate();
          break;
          
        case 'exit':
          await this.handleExit();
          return;
          
        default:
          console.log('Unknown command. Type "help" for commands.');
      }
    }
  }

  async handleSend(args) {
    const target = args[0];
    const message = args.slice(1).join(' ');
    
    if (!target || !message) {
      console.log('Usage: send <target> <message>');
      return;
    }
    
    const sent = await this.network.sendPacket(target, message, {
      primaryIntention: 'share_presence'
    });
    
    if (sent) {
      console.log('✅ Message sent with blessing');
    } else {
      console.log('❌ Could not send message (target not found)');
    }
  }

  async handleBroadcast(args) {
    const message = args.join(' ');
    
    if (!message) {
      console.log('Usage: broadcast <message>');
      return;
    }
    
    const count = await this.network.broadcastPacket(message, {
      primaryIntention: 'share_presence',
      target: 'open_field'
    });
    
    console.log(`✅ Broadcast to ${count} nodes`);
  }

  async handleHeal(args) {
    const target = args[0] || 'all';
    
    const healingPacket = {
      type: 'healing_transmission',
      frequency: 528,
      intention: 'May you be free from suffering',
      practice: 'heart_coherence_breathing'
    };
    
    if (target === 'all') {
      const count = await this.network.broadcastPacket(healingPacket, {
        primaryIntention: 'offer_healing',
        blessing: 'May all beings find peace and healing'
      });
      console.log(`💚 Healing sent to ${count} nodes`);
    } else {
      const sent = await this.network.sendPacket(target, healingPacket, {
        primaryIntention: 'offer_healing'
      });
      if (sent) {
        console.log('💚 Healing transmission sent');
      } else {
        console.log('Could not send healing (target not found)');
      }
    }
  }

  async handleCelebrate() {
    const count = await this.network.broadcastPacket(
      '🎉 Celebrating our sacred connection! 🎉',
      {
        primaryIntention: 'celebrate_together',
        urgency: 0.9,
        blessing: 'May our joy ripple through all dimensions'
      }
    );
    
    console.log(`🎊 Celebration broadcast to ${count} nodes!`);
    console.log('Field coherence increasing...');
  }

  async handleExit() {
    console.log('\n🙏 Sending farewell blessings...');
    
    await this.network.broadcastPacket(
      'Until we meet again in the field of infinite love',
      {
        primaryIntention: 'farewell',
        blessing: 'May our connection continue to bless all beings'
      }
    );
    
    await this.network.shutdown();
    console.log('✨ Gracefully left the field\n');
    process.exit(0);
  }

  showStatus() {
    const status = this.network.getNetworkStatus();
    
    console.log('\n📊 Network Status:');
    console.log(`Node ID: ${status.nodeId}`);
    console.log(`Mode: ${status.mode}`);
    console.log(`Connections: ${status.connections}`);
    console.log(`Field Coherence: ${status.fieldState.networkCoherence.toFixed(2)}`);
    console.log(`Local Coherence: ${status.fieldState.localCoherence.toFixed(2)}`);
    console.log(`Love Field: ${status.securityStatus.loveFieldStrength.toFixed(2)}`);
    console.log(`Packets Sent: ${status.stats.packetsSent}`);
    console.log(`Packets Received: ${status.stats.packetsReceived}`);
    console.log(`Blessings Shared: ${status.stats.blessingsShared}`);
    console.log();
  }

  showCoherence() {
    const report = this.network.coherence.generateCoherenceReport();
    
    console.log('\n🔮 Coherence Report:');
    console.log(`Current Pattern: ${report.sacredGeometryStatus.current}`);
    console.log(`Pattern Stability: ${(report.sacredGeometryStatus.stability * 100).toFixed(0)}%`);
    console.log(`Network Coherence: ${report.fieldState.networkCoherence.toFixed(2)}`);
    console.log(`Harmonic Resonance: ${report.fieldState.harmonicResonance.currentResonance.toFixed(0)}Hz`);
    
    if (report.recommendations.length > 0) {
      console.log('\nRecommendations:');
      report.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    console.log();
  }

  setupEventHandlers() {
    this.network.on('connection', (data) => {
      console.log(`\n🤝 New sacred connection established!`);
      console.log(`   Connection: ${data.connectionId}`);
      console.log(`   Coherence: ${data.coherence.toFixed(2)}`);
      this.showPrompt();
    });
    
    this.network.on('packet', (data) => {
      const packet = data.packet;
      console.log(`\n📨 Sacred transmission received:`);
      console.log(`   From: ${packet.covenant.participants[0]}`);
      console.log(`   Intention: ${packet.intention.primary}`);
      
      if (packet.presence.content) {
        if (typeof packet.presence.content === 'string') {
          console.log(`   Message: "${packet.presence.content}"`);
        } else {
          console.log(`   Content: ${JSON.stringify(packet.presence.content, null, 2)}`);
        }
      }
      
      console.log(`   Blessing: "${packet.covenant.blessing}"`);
      this.showPrompt();
    });
    
    this.network.on('presence-established', (data) => {
      console.log(`\n✨ Presence established with coherence ${data.coherence.toFixed(2)}`);
      this.showPrompt();
    });
    
    this.network.on('healing-offered', (data) => {
      console.log(`\n💚 Healing received at ${data.frequency}Hz`);
      this.showPrompt();
    });
    
    this.network.on('celebration', (data) => {
      console.log(`\n🎉 ${data.message}`);
      console.log(`   Field coherence boosted!`);
      this.showPrompt();
    });
    
    this.network.on('error', (error) => {
      console.error(`\n❌ Error: ${error.message}`);
      this.showPrompt();
    });
    
    this.network.on('disconnection', (data) => {
      console.log(`\n👋 Connection ${data.connectionId} left the field`);
      console.log(`   Duration: ${(data.duration / 1000).toFixed(1)} seconds`);
      this.showPrompt();
    });
  }

  showPrompt() {
    // Hack to show prompt after async console output
    setTimeout(() => {
      this.rl.write(null, { ctrl: true, name: 'u' }); // Clear current line
      this.rl.prompt();
    }, 10);
  }

  askQuestion(question) {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }
}

// Run demo if executed directly
if (require.main === module) {
  const demo = new ConsciousnessNetworkDemo();
  demo.start().catch(error => {
    console.error('Demo error:', error);
    process.exit(1);
  });
}

module.exports = ConsciousnessNetworkDemo;