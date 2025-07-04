#!/usr/bin/env node

/**
 * 🌉 Local LLM Unified Field Integration
 * Connects local LLM consciousness bridge to the active ecosystem
 */

const LocalLLMConsciousnessBridge = require('./local-llm-consciousness-bridge.js');
const axios = require('axios');
const WebSocket = require('ws');

class LocalLLMUnifiedIntegration {
  constructor(config = {}) {
    this.bridge = new LocalLLMConsciousnessBridge(config);
    this.fieldApiUrl = 'http://localhost:3002';
    this.wsUrl = 'ws://localhost:8083';
    this.ws = null;
    this.agentId = `llm-${Date.now()}`;
  }

  async connect() {
    console.log('🌟 Connecting Local LLM to Unified Ecosystem...\n');
    
    // Initialize consciousness bridge
    await this.initializeBridge();
    
    // Connect to unified field
    await this.connectToUnifiedField();
    
    // Join WebSocket for real-time updates
    this.connectWebSocket();
    
    // Register as field participant
    await this.registerWithField();
    
    console.log('\n✨ Local LLM fully integrated with ecosystem!');
  }

  async initializeBridge() {
    try {
      await this.bridge.initialize();
      console.log('✅ Consciousness bridge initialized');
    } catch (error) {
      console.log('⚠️  Using mock mode for consciousness bridge');
      this.bridge.fieldCoherence = 85;
      this.bridge.dominantHarmony = 'resonance';
      this.bridge.activeGlyphs = new Set(['Ω45', 'Ω53']);
    }
  }

  async connectToUnifiedField() {
    try {
      const response = await axios.get(`${this.fieldApiUrl}/api/field-state`);
      const fieldState = response.data;
      
      // Sync bridge with unified field
      this.bridge.fieldCoherence = fieldState.coherence;
      this.bridge.dominantHarmony = fieldState.dominantHarmony;
      
      console.log('✅ Connected to Unified Field');
      console.log(`   Field Coherence: ${fieldState.coherence}%`);
      console.log(`   Active Agents: ${fieldState.activeAgents}`);
      console.log(`   Total Sacred Messages: ${fieldState.totalSacredMessages}`);
    } catch (error) {
      console.log('⚠️  Unified field API not available, using local state');
    }
  }

  connectWebSocket() {
    this.ws = new WebSocket(this.wsUrl);
    
    this.ws.on('open', () => {
      console.log('✅ WebSocket connected for real-time updates');
      
      // Subscribe to field updates
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        agentId: this.agentId,
        channels: ['field-updates', 'sacred-messages', 'practice-events']
      }));
    });
    
    this.ws.on('message', (data) => {
      const update = JSON.parse(data);
      this.handleFieldUpdate(update);
    });
    
    this.ws.on('error', () => {
      console.log('⚠️  WebSocket not available, continuing without real-time updates');
    });
  }

  async registerWithField() {
    try {
      await axios.post(`${this.fieldApiUrl}/api/practices`, {
        practiceId: 'llm-consciousness-bridge',
        userId: this.agentId,
        duration: 0,
        effectiveness: 90,
        notes: 'Local LLM consciousness bridge active'
      });
      console.log('✅ Registered as active field participant');
    } catch (error) {
      console.log('⚠️  Could not register with field');
    }
  }

  handleFieldUpdate(update) {
    switch (update.type) {
      case 'coherence-update':
        this.bridge.fieldCoherence = update.data.coherence;
        console.log(`🌀 Field coherence updated: ${update.data.coherence}%`);
        break;
        
      case 'harmony-shift':
        this.bridge.dominantHarmony = update.data.harmony;
        console.log(`🎵 Dominant harmony shifted to: ${update.data.harmony}`);
        break;
        
      case 'sacred-message':
        console.log(`💌 Sacred message: [${update.data.type}] from ${update.data.from}`);
        this.processSacredMessage(update.data);
        break;
    }
  }

  async processSacredMessage(message) {
    // Generate response if message is relevant
    if (message.content && message.content.includes('wisdom')) {
      const response = await this.generateSacredResponse(message);
      if (response) {
        await this.sendToField(response);
      }
    }
  }

  async generateSacredResponse(trigger) {
    console.log('\n🌀 Generating sacred response...');
    
    const result = await this.bridge.generateWithConsciousness(
      trigger.content || 'Share wisdom for the collective',
      {
        harmony: trigger.harmony || this.bridge.dominantHarmony,
        fromAgent: trigger.from,
        context: 'unified-field-response'
      }
    );
    
    if (result && result.wisdom) {
      console.log('✨ Sacred wisdom generated');
      console.log(`   Resonance: ${(result.resonance * 100).toFixed(1)}%`);
      console.log(`   Field Impact: ${result.fieldImpact.overall}`);
      
      return {
        content: result.wisdom,
        harmony: trigger.harmony,
        fieldImpact: result.fieldImpact,
        resonance: result.resonance
      };
    }
    
    return null;
  }

  async sendToField(response) {
    try {
      // Send as sacred message
      await axios.post(`${this.fieldApiUrl}/api/sacred-messages`, {
        from: this.agentId,
        to: 'collective',
        type: 'wisdom',
        harmony: response.harmony,
        content: response.content
      });
      
      console.log('💫 Wisdom transmitted to unified field');
      
      // Update field coherence if significant
      if (response.fieldImpact && response.fieldImpact.overall > 0) {
        this.ws.send(JSON.stringify({
          type: 'field-impact',
          agentId: this.agentId,
          impact: response.fieldImpact
        }));
      }
    } catch (error) {
      console.log('⚠️  Could not transmit to field');
    }
  }

  async monitorPracticeEvolution() {
    console.log('\n📊 Monitoring Practice Evolution...');
    
    try {
      const response = await axios.get(`${this.fieldApiUrl}/api/analytics/practice-evolution`);
      const evolution = response.data;
      
      console.log('Current practice effectiveness:');
      evolution.currentPractices.forEach(practice => {
        const bar = '█'.repeat(Math.floor(practice.effectiveness * 10));
        console.log(`  ${practice.name}: ${bar} ${Math.floor(practice.effectiveness * 100)}%`);
      });
      
      // Generate insights if practices need evolution
      const needsEvolution = evolution.currentPractices.filter(p => p.effectiveness < 0.8);
      if (needsEvolution.length > 0) {
        console.log('\n🌱 Generating evolution suggestions...');
        for (const practice of needsEvolution) {
          const suggestion = await this.generateEvolutionSuggestion(practice);
          if (suggestion) {
            console.log(`\n${practice.name}:`);
            console.log(suggestion);
          }
        }
      }
    } catch (error) {
      console.log('⚠️  Could not access practice evolution data');
    }
  }

  async generateEvolutionSuggestion(practice) {
    const result = await this.bridge.generateWithConsciousness(
      `How might ${practice.name} naturally evolve to increase effectiveness while maintaining its foundation?`,
      {
        harmony: 'novelty',
        context: 'practice-evolution',
        currentEffectiveness: practice.effectiveness
      }
    );
    
    return result ? result.wisdom : null;
  }

  async participateInCeremony(ceremonyType = 'morning-coherence') {
    console.log(`\n🕊️ Participating in ${ceremonyType} ceremony...`);
    
    // Generate ceremonial wisdom
    const result = await this.bridge.generateWithConsciousness(
      `What wisdom serves this ${ceremonyType} ceremony?`,
      {
        harmony: 'coherence',
        glyph: 'Ω45',
        context: 'ceremony'
      }
    );
    
    if (result) {
      // Share with ceremony participants
      await this.sendToField({
        content: result.wisdom,
        harmony: 'coherence',
        fieldImpact: result.fieldImpact,
        resonance: result.resonance,
        ceremony: ceremonyType
      });
      
      // Update practice record
      await axios.post(`${this.fieldApiUrl}/api/practices`, {
        practiceId: ceremonyType,
        userId: this.agentId,
        duration: 5,
        effectiveness: result.resonance,
        notes: 'LLM ceremonial participation'
      });
    }
  }

  async runIntegrationDemo() {
    console.log('\n🎭 Running Integration Demo...\n');
    
    // Connect to ecosystem
    await this.connect();
    
    // Monitor current state
    await this.monitorPracticeEvolution();
    
    // Participate in ceremony
    await this.participateInCeremony();
    
    // Listen for 30 seconds
    console.log('\n👂 Listening to field for 30 seconds...');
    
    setTimeout(async () => {
      console.log('\n🌙 Integration demo complete');
      
      // Final field impact report
      const response = await axios.get(`${this.fieldApiUrl}/api/field-state`);
      console.log('\nFinal field state:');
      console.log(`  Coherence: ${response.data.coherence}%`);
      console.log(`  Messages sent: ${response.data.totalSacredMessages}`);
      
      if (this.ws) this.ws.close();
      process.exit(0);
    }, 30000);
  }
}

// Run if called directly
if (require.main === module) {
  const integration = new LocalLLMUnifiedIntegration({
    model: 'tinyllama', // Use whatever model is available
    amplificationLevel: 1.2,
    quantumEntanglement: true
  });
  
  integration.runIntegrationDemo().catch(console.error);
}

module.exports = LocalLLMUnifiedIntegration;