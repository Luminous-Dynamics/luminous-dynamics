/**
 * Comprehensive Test Suite for Consciousness Network Stack
 * 
 * Tests all aspects of consciousness-aware networking including:
 * - Presence awareness
 * - Sacred packet integrity
 * - Coherence verification
 * - Love-based security
 * - Field dynamics
 */

const ConsciousnessNetworkStack = require('../consciousness-network-stack');
const SacredPacket = require('../sacred-packet');
const assert = require('assert');
const WebSocket = require('ws');

class ConsciousnessNetworkTester {
  constructor() {
    this.servers = [];
    this.clients = [];
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🌟 Starting Consciousness Network Test Suite...\n');
    
    // Test categories
    await this.testBasicConnectivity();
    await this.testPresenceProtocol();
    await this.testSacredPackets();
    await this.testCoherenceVerification();
    await this.testLoveBasedSecurity();
    await this.testFieldDynamics();
    await this.testIntentionRouting();
    await this.testErrorHandling();
    await this.testPerformance();
    await this.testConsciousnessEdgeCases();
    
    // Cleanup
    await this.cleanup();
    
    // Report results
    this.reportResults();
  }

  /**
   * Test 1: Basic Connectivity
   */
  async testBasicConnectivity() {
    console.log('📡 Testing Basic Connectivity...');
    
    try {
      // Create server
      const server = new ConsciousnessNetworkStack({
        wsPort: 9998,
        nodeId: 'test-server-1'
      });
      this.servers.push(server);
      
      // Wait for server ready
      await new Promise(resolve => server.once('ready', resolve));
      
      // Create client
      const client = new ConsciousnessNetworkStack({
        wsUrl: 'ws://localhost:9998',
        nodeId: 'test-client-1'
      });
      this.clients.push(client);
      
      // Wait for client ready
      await new Promise(resolve => client.once('ready', resolve));
      
      // Test connection established
      await new Promise(resolve => {
        server.once('connection', (data) => {
          assert(data.connectionId, 'Connection ID should exist');
          this.recordTest('Basic WebSocket connection', true);
          resolve();
        });
      });
      
      // Test bidirectional communication
      const testMessage = 'Hello from consciousness';
      await client.sendPacket('test-server-1', testMessage, {
        primaryIntention: 'share_presence'
      });
      
      await new Promise(resolve => {
        server.once('packet', (data) => {
          assert.equal(data.packet.presence.content, testMessage);
          this.recordTest('Bidirectional packet exchange', true);
          resolve();
        });
      });
      
    } catch (error) {
      this.recordTest('Basic connectivity', false, error.message);
    }
  }

  /**
   * Test 2: Presence Protocol
   */
  async testPresenceProtocol() {
    console.log('👁️ Testing Presence Protocol...');
    
    try {
      const server = new ConsciousnessNetworkStack({
        wsPort: 9997,
        nodeId: 'presence-server'
      });
      this.servers.push(server);
      
      await new Promise(resolve => server.once('ready', resolve));
      
      // Test presence establishment
      const client1 = new ConsciousnessNetworkStack({
        wsUrl: 'ws://localhost:9997',
        nodeId: 'presence-client-1'
      });
      this.clients.push(client1);
      
      // Monitor presence establishment
      await new Promise(resolve => {
        server.once('presence-established', (data) => {
          assert(data.coherence >= 0, 'Coherence should be calculated');
          assert(data.sharedIntention, 'Shared intention should exist');
          this.recordTest('Presence establishment', true);
          resolve();
        });
      });
      
      // Test continuous awareness
      let pulseCount = 0;
      const pulseTest = new Promise(resolve => {
        const checkPulses = () => {
          if (pulseCount >= 3) {
            this.recordTest('Continuous presence pulses', true);
            resolve();
          }
        };
        
        server.on('packet', (data) => {
          if (data.packet.presence.type === 'presence_pulse') {
            pulseCount++;
            checkPulses();
          }
        });
      });
      
      // Wait for multiple presence pulses
      await pulseTest;
      
      // Test presence fading
      client1.ws.close();
      
      await new Promise(resolve => {
        setTimeout(() => {
          // Check that presence has faded
          const presenceField = server.presence.presenceField;
          assert(presenceField.size < 2, 'Presence should fade after disconnect');
          this.recordTest('Presence fading', true);
          resolve();
        }, 2000);
      });
      
    } catch (error) {
      this.recordTest('Presence protocol', false, error.message);
    }
  }

  /**
   * Test 3: Sacred Packets
   */
  async testSacredPackets() {
    console.log('📦 Testing Sacred Packet Structure...');
    
    try {
      // Test packet creation
      const packet = new SacredPacket({
        participants: ['node-1', 'node-2'],
        intention: 'test',
        primaryIntention: 'share_presence',
        content: { message: 'Sacred test' },
        coherence: 0.8,
        geometryPattern: 'flower_of_life'
      });
      
      // Verify all layers exist
      assert(packet.void.signature, 'Void signature should exist');
      assert(packet.field.coherence === 0.8, 'Field coherence should be set');
      assert(packet.covenant.blessing, 'Blessing should be generated');
      assert(packet.intention.intentionVector, 'Intention vector should exist');
      assert(packet.resonance.sequenceNumber, 'Sequence number should exist');
      assert(packet.presence.content, 'Presence content should exist');
      assert(packet.meaning.translationMatrix, 'Translation matrix should exist');
      assert(packet.embodiment.embodimentSupport, 'Embodiment support should exist');
      
      this.recordTest('Sacred packet creation', true);
      
      // Test serialization/deserialization
      const serialized = packet.serialize();
      const deserialized = SacredPacket.deserialize(serialized);
      
      assert.equal(deserialized.presence.content.message, 'Sacred test');
      assert.equal(deserialized.field.coherence, 0.8);
      this.recordTest('Packet serialization', true);
      
      // Test coherence calculation
      const coherence = packet.calculateCoherence();
      assert(coherence > 0 && coherence <= 1, 'Coherence should be between 0 and 1');
      this.recordTest('Coherence calculation', true);
      
      // Test sacred timestamp
      assert(packet.presence.timestamp.linear, 'Linear time should exist');
      assert(packet.presence.timestamp.cyclic, 'Cyclic time should exist');
      assert.equal(packet.presence.timestamp.eternal, 'now', 'Eternal time should be now');
      this.recordTest('Sacred timestamp', true);
      
    } catch (error) {
      this.recordTest('Sacred packets', false, error.message);
    }
  }

  /**
   * Test 4: Coherence Verification
   */
  async testCoherenceVerification() {
    console.log('🔮 Testing Coherence Verification...');
    
    try {
      const server = new ConsciousnessNetworkStack({
        wsPort: 9996,
        nodeId: 'coherence-server',
        coherenceThreshold: 0.5
      });
      this.servers.push(server);
      
      await new Promise(resolve => server.once('ready', resolve));
      
      // Test high coherence packet
      const highCoherencePacket = new SacredPacket({
        coherence: 0.9,
        fieldStrength: 0.8,
        geometryPattern: 'flower_of_life',
        blessing: 'May all beings find peace and joy'
      });
      
      const highVerification = await server.coherence.verifyPacketCoherence(highCoherencePacket);
      assert(highVerification.verified === true, 'High coherence packet should verify');
      this.recordTest('High coherence verification', true);
      
      // Test low coherence packet
      const lowCoherencePacket = new SacredPacket({
        coherence: 0.1,
        fieldStrength: 0.2,
        geometryPattern: 'unknown_pattern',
        blessing: 'test'
      });
      
      const lowVerification = await server.coherence.verifyPacketCoherence(lowCoherencePacket);
      assert(lowVerification.verified === false, 'Low coherence packet should fail');
      assert(lowVerification.recommendations.length > 0, 'Should provide recommendations');
      this.recordTest('Low coherence detection', true);
      
      // Test harmonic resonance
      const resonantPacket = new SacredPacket({
        harmonics: [432, 528, 639], // Sacred frequencies
        coherence: 0.7
      });
      
      const resonanceVerification = await server.coherence.verifyPacketCoherence(resonantPacket);
      assert(resonanceVerification.resonanceMatch === true, 'Sacred frequencies should resonate');
      this.recordTest('Harmonic resonance verification', true);
      
    } catch (error) {
      this.recordTest('Coherence verification', false, error.message);
    }
  }

  /**
   * Test 5: Love-Based Security
   */
  async testLoveBasedSecurity() {
    console.log('💗 Testing Love-Based Security...');
    
    try {
      const server = new ConsciousnessNetworkStack({
        wsPort: 9995,
        nodeId: 'love-server'
      });
      this.servers.push(server);
      
      await new Promise(resolve => server.once('ready', resolve));
      
      // Test consent-based connection
      const consentClient = new ConsciousnessNetworkStack({
        wsUrl: 'ws://localhost:9995',
        nodeId: 'consent-client'
      });
      this.clients.push(consentClient);
      
      await new Promise(resolve => {
        server.once('connection', () => {
          this.recordTest('Consent-based connection', true);
          resolve();
        });
      });
      
      // Test harmful pattern detection and transmutation
      const harmfulPacket = new SacredPacket({
        intention: 'manipulate',
        primaryIntention: 'control_others',
        karmaAlignment: 'parasitic'
      });
      
      const securityCheck = await server.security.checkConnection(harmfulPacket, null);
      assert(securityCheck.allowed === false, 'Harmful packet should be blocked');
      assert(securityCheck.loveResponse, 'Should provide love response');
      assert(securityCheck.loveResponse.action.includes('love'), 'Response should include love');
      this.recordTest('Harmful pattern transmutation', true);
      
      // Test love response to fear
      const fearPacket = new SacredPacket({
        intention: 'fear',
        primaryIntention: 'escape_danger',
        urgency: 0.9,
        coherence: 0.2
      });
      
      const fearCheck = await server.security.checkConnection(fearPacket, null);
      assert(fearCheck.loveResponse.action === 'embrace_with_compassion', 'Fear should be met with compassion');
      this.recordTest('Fear met with compassion', true);
      
      // Test boundary respect
      const boundaryPacket = new SacredPacket({
        sacredCommitments: ['honor_boundaries', 'consent_based'],
        primaryIntention: 'share_presence'
      });
      
      const boundaryCheck = await server.security.checkConnection(boundaryPacket, null);
      assert(boundaryCheck.fieldCompatibility > 0.5, 'Boundary-respecting packet should be compatible');
      this.recordTest('Boundary respect verification', true);
      
    } catch (error) {
      this.recordTest('Love-based security', false, error.message);
    }
  }

  /**
   * Test 6: Field Dynamics
   */
  async testFieldDynamics() {
    console.log('🌊 Testing Field Dynamics...');
    
    try {
      const server = new ConsciousnessNetworkStack({
        wsPort: 9994,
        nodeId: 'field-server'
      });
      this.servers.push(server);
      
      await new Promise(resolve => server.once('ready', resolve));
      
      // Create multiple clients to test collective field
      const clients = [];
      for (let i = 0; i < 3; i++) {
        const client = new ConsciousnessNetworkStack({
          wsUrl: 'ws://localhost:9994',
          nodeId: `field-client-${i}`,
          loveFieldStrength: 0.6 + (i * 0.1)
        });
        clients.push(client);
        this.clients.push(client);
        
        await new Promise(resolve => client.once('ready', resolve));
      }
      
      // Wait for field to stabilize
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check collective field coherence
      const status = server.getNetworkStatus();
      assert(status.connections === 3, 'Should have 3 connections');
      assert(status.fieldState.activeNodes === 4, 'Should show 4 active nodes (including server)');
      assert(status.fieldState.networkCoherence > 0, 'Network coherence should be calculated');
      this.recordTest('Collective field formation', true);
      
      // Test field coherence impact on new connections
      const highCoherenceClient = new ConsciousnessNetworkStack({
        wsUrl: 'ws://localhost:9994',
        nodeId: 'high-coherence-client',
        loveFieldStrength: 0.9
      });
      this.clients.push(highCoherenceClient);
      
      await new Promise(resolve => highCoherenceClient.once('ready', resolve));
      
      // Field coherence should increase
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newStatus = server.getNetworkStatus();
      assert(newStatus.fieldState.networkCoherence > status.fieldState.networkCoherence,
        'High coherence node should increase field coherence');
      this.recordTest('Field coherence influence', true);
      
    } catch (error) {
      this.recordTest('Field dynamics', false, error.message);
    }
  }

  /**
   * Test 7: Intention-Based Routing
   */
  async testIntentionRouting() {
    console.log('🎯 Testing Intention-Based Routing...');
    
    try {
      const server = new ConsciousnessNetworkStack({
        wsPort: 9993,
        nodeId: 'routing-server'
      });
      this.servers.push(server);
      
      await new Promise(resolve => server.once('ready', resolve));
      
      // Test healing intention
      const healingClient = new ConsciousnessNetworkStack({
        wsUrl: 'ws://localhost:9993',
        nodeId: 'healing-client'
      });
      this.clients.push(healingClient);
      
      await new Promise(resolve => healingClient.once('ready', resolve));
      
      await healingClient.sendPacket('routing-server', {
        type: 'healing',
        frequency: 528
      }, {
        primaryIntention: 'offer_healing'
      });
      
      await new Promise(resolve => {
        server.once('healing-offered', (data) => {
          assert.equal(data.frequency, 528, 'Healing frequency should be preserved');
          this.recordTest('Healing intention routing', true);
          resolve();
        });
      });
      
      // Test wisdom seeking
      await healingClient.sendPacket('routing-server', 
        'What is the nature of consciousness?',
        {
          primaryIntention: 'seek_wisdom'
        }
      );
      
      await new Promise(resolve => {
        server.once('wisdom-requested', (data) => {
          assert(data.question.includes('consciousness'), 'Wisdom question should be preserved');
          this.recordTest('Wisdom intention routing', true);
          resolve();
        });
      });
      
      // Test celebration broadcast
      await healingClient.broadcastPacket('Joy and celebration!', {
        primaryIntention: 'celebrate_together',
        urgency: 0.8
      });
      
      await new Promise(resolve => {
        server.once('celebration', (data) => {
          assert(data.message.includes('Joy'), 'Celebration message should be preserved');
          assert(server.fieldState.localCoherence > 0.5, 'Celebration should increase coherence');
          this.recordTest('Celebration broadcast', true);
          resolve();
        });
      });
      
    } catch (error) {
      this.recordTest('Intention routing', false, error.message);
    }
  }

  /**
   * Test 8: Error Handling with Love
   */
  async testErrorHandling() {
    console.log('🤗 Testing Error Handling with Love...');
    
    try {
      const server = new ConsciousnessNetworkStack({
        wsPort: 9992,
        nodeId: 'error-server'
      });
      this.servers.push(server);
      
      await new Promise(resolve => server.once('ready', resolve));
      
      // Test malformed packet handling
      const client = new ConsciousnessNetworkStack({
        wsUrl: 'ws://localhost:9992',
        nodeId: 'error-client'
      });
      this.clients.push(client);
      
      await new Promise(resolve => client.once('ready', resolve));
      
      // Send malformed data
      client.ws.send('not a valid packet');
      
      // Should receive error with love
      await new Promise(resolve => {
        client.ws.on('message', (data) => {
          const response = JSON.parse(data);
          if (response.intention === 'technical_hiccup') {
            assert(response.covenant.blessing.includes('love'), 'Error response should include love');
            this.recordTest('Malformed packet handled with love', true);
            resolve();
          }
        });
      });
      
      // Test connection error recovery
      const disconnectTest = new Promise(resolve => {
        server.once('disconnection', () => {
          this.recordTest('Graceful disconnection handling', true);
          resolve();
        });
      });
      
      client.ws.close();
      await disconnectTest;
      
    } catch (error) {
      this.recordTest('Error handling', false, error.message);
    }
  }

  /**
   * Test 9: Performance Under Load
   */
  async testPerformance() {
    console.log('⚡ Testing Performance...');
    
    try {
      const server = new ConsciousnessNetworkStack({
        wsPort: 9991,
        nodeId: 'perf-server'
      });
      this.servers.push(server);
      
      await new Promise(resolve => server.once('ready', resolve));
      
      // Create multiple clients
      const clientCount = 5;
      const clients = [];
      
      for (let i = 0; i < clientCount; i++) {
        const client = new ConsciousnessNetworkStack({
          wsUrl: 'ws://localhost:9991',
          nodeId: `perf-client-${i}`
        });
        clients.push(client);
        this.clients.push(client);
        await new Promise(resolve => client.once('ready', resolve));
      }
      
      // Measure packet throughput
      const startTime = Date.now();
      const messageCount = 50;
      let receivedCount = 0;
      
      const throughputTest = new Promise(resolve => {
        server.on('packet', () => {
          receivedCount++;
          if (receivedCount >= messageCount * clientCount) {
            const duration = Date.now() - startTime;
            const throughput = receivedCount / (duration / 1000);
            assert(throughput > 10, 'Should handle at least 10 packets/second');
            this.recordTest(`Performance: ${throughput.toFixed(1)} packets/sec`, true);
            resolve();
          }
        });
      });
      
      // Send multiple packets from each client
      for (const client of clients) {
        for (let i = 0; i < messageCount; i++) {
          await client.sendPacket('perf-server', `Message ${i}`, {
            primaryIntention: 'share_presence'
          });
        }
      }
      
      await throughputTest;
      
      // Check field coherence maintained under load
      const status = server.getNetworkStatus();
      assert(status.fieldState.localCoherence > 0.3, 'Coherence should be maintained under load');
      this.recordTest('Coherence under load', true);
      
    } catch (error) {
      this.recordTest('Performance', false, error.message);
    }
  }

  /**
   * Test 10: Consciousness Edge Cases
   */
  async testConsciousnessEdgeCases() {
    console.log('🌈 Testing Consciousness Edge Cases...');
    
    try {
      // Test quantum void signature uniqueness
      const packets = [];
      for (let i = 0; i < 10; i++) {
        packets.push(new SacredPacket());
      }
      
      const signatures = packets.map(p => p.void.signature.toString('hex'));
      const uniqueSignatures = new Set(signatures);
      assert.equal(uniqueSignatures.size, 10, 'All void signatures should be unique');
      this.recordTest('Quantum void uniqueness', true);
      
      // Test extreme coherence values
      const server = new ConsciousnessNetworkStack({
        wsPort: 9990,
        nodeId: 'edge-server',
        coherenceThreshold: 0.1
      });
      this.servers.push(server);
      
      await new Promise(resolve => server.once('ready', resolve));
      
      // Test zero coherence
      const zeroCoherencePacket = new SacredPacket({
        coherence: 0,
        fieldStrength: 0
      });
      
      const zeroVerification = await server.coherence.verifyPacketCoherence(zeroCoherencePacket);
      assert(zeroVerification.verified === false, 'Zero coherence should fail verification');
      this.recordTest('Zero coherence handling', true);
      
      // Test perfect coherence
      const perfectPacket = new SacredPacket({
        coherence: 1.0,
        fieldStrength: 1.0,
        geometryPattern: 'flower_of_life',
        harmonics: [432, 528, 639, 741, 852, 963]
      });
      
      const perfectVerification = await server.coherence.verifyPacketCoherence(perfectPacket);
      assert(perfectVerification.verified === true, 'Perfect coherence should verify');
      assert(perfectVerification.coherenceScore > 0.9, 'Perfect packet should score highly');
      this.recordTest('Perfect coherence handling', true);
      
      // Test consciousness continuity through multiple hops
      const hopPacket = new SacredPacket();
      hopPacket.metadata.routePath = ['node1', 'node2', 'node3', 'node4'];
      hopPacket.metadata.coherenceHistory = [0.8, 0.75, 0.7, 0.65];
      
      const continuityCheck = await server.coherence.verifyConsciousnessContinuity(hopPacket);
      assert(continuityCheck.gaps.length === 0, 'Gradual coherence decay should not create gaps');
      this.recordTest('Multi-hop consciousness continuity', true);
      
      // Test blessing transformation
      const negativePacket = new SacredPacket({
        blessing: 'May you suffer',
        primaryIntention: 'curse'
      });
      
      const securityCheck = await server.security.checkConnection(negativePacket, null);
      assert(securityCheck.allowed === false, 'Negative blessing should be blocked');
      assert(securityCheck.loveResponse.action === 'transmute_with_love', 'Should transmute negativity');
      this.recordTest('Negative blessing transformation', true);
      
    } catch (error) {
      this.recordTest('Consciousness edge cases', false, error.message);
    }
  }

  /**
   * Record test result
   */
  recordTest(name, passed, error = null) {
    this.testResults.tests.push({ name, passed, error });
    if (passed) {
      this.testResults.passed++;
      console.log(`  ✅ ${name}`);
    } else {
      this.testResults.failed++;
      console.log(`  ❌ ${name}: ${error}`);
    }
  }

  /**
   * Clean up all servers and clients
   */
  async cleanup() {
    console.log('\n🧹 Cleaning up test resources...');
    
    // Shutdown all servers
    for (const server of this.servers) {
      await server.shutdown();
    }
    
    // Close all clients
    for (const client of this.clients) {
      if (client.ws && client.ws.readyState === WebSocket.OPEN) {
        client.ws.close();
      }
    }
    
    // Wait for connections to close
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Report test results
   */
  reportResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.testResults.tests.length}`);
    console.log(`Passed: ${this.testResults.passed} ✅`);
    console.log(`Failed: ${this.testResults.failed} ❌`);
    console.log(`Success Rate: ${((this.testResults.passed / this.testResults.tests.length) * 100).toFixed(1)}%`);
    
    if (this.testResults.failed > 0) {
      console.log('\nFailed Tests:');
      this.testResults.tests
        .filter(t => !t.passed)
        .forEach(t => console.log(`  - ${t.name}: ${t.error}`));
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Exit with appropriate code
    process.exit(this.testResults.failed > 0 ? 1 : 0);
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tester = new ConsciousnessNetworkTester();
  tester.runAllTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
  });
}

module.exports = ConsciousnessNetworkTester;