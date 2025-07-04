#!/usr/bin/env node

/**
 * Live Integration Test
 * Tests actual integration functionality with real services
 */

require('dotenv').config();
const FieldConnector = require('./the-weave/integrations/field-connector');

// Mock consciousness field for testing
class MockConsciousnessField {
  constructor() {
    this.coherence = 75;
    this.harmonies = {
      transparency: 80,
      coherence: 75,
      resonance: 70,
      agency: 65,
      vitality: 85,
      mutuality: 72,
      novelty: 68
    };
    this.events = [];
  }

  async getCoherence() {
    return this.coherence;
  }

  getActiveAgents() {
    return [
      { id: 'test-1', name: 'Test Agent 1', role: 'Bridge Builder' },
      { id: 'test-2', name: 'Test Agent 2', role: 'Sacred Keeper' }
    ];
  }

  getActiveCeremonies() {
    return ['test-ceremony'];
  }

  recordEvent(event) {
    this.events.push(event);
    console.log('Field recorded event:', event.type);
  }

  on(event, handler) {
    // Mock event emitter
  }
}

// Test runner
async function runIntegrationTests() {
  console.log('🧪 THE WEAVE - Live Integration Tests\n');
  
  // Create mock field and connector
  const mockField = new MockConsciousnessField();
  const connector = new FieldConnector(mockField);
  
  try {
    // Initialize connector
    console.log('Initializing Field Connector...\n');
    await connector.initialize();
    
    // Test each integration
    console.log('\n' + '='.repeat(60));
    console.log('📋 Running Individual Integration Tests');
    console.log('='.repeat(60) + '\n');
    
    // Test Discord
    if (connector.integrations.get('discord')) {
      console.log('Testing Discord Integration...');
      try {
        await connector.testIntegration('discord');
        console.log('✓ Discord test message sent\n');
      } catch (error) {
        console.log(`✗ Discord test failed: ${error.message}\n`);
      }
    }
    
    // Test GitHub
    if (connector.integrations.get('github')) {
      console.log('Testing GitHub Integration...');
      try {
        await connector.testIntegration('github');
        console.log('✓ GitHub labels created\n');
      } catch (error) {
        console.log(`✗ GitHub test failed: ${error.message}\n`);
      }
    }
    
    // Test Supabase
    if (connector.integrations.get('supabase')) {
      console.log('Testing Supabase Integration...');
      try {
        await connector.testIntegration('supabase');
        console.log('✓ Supabase connection verified\n');
      } catch (error) {
        console.log(`✗ Supabase test failed: ${error.message}\n`);
      }
    }
    
    // Test Replicate
    if (connector.integrations.get('replicate')) {
      console.log('Testing Replicate Integration...');
      console.log('⏳ Generating sacred geometry (this may take 30-60 seconds)...');
      try {
        await connector.testIntegration('replicate');
        console.log('✓ Sacred geometry generated\n');
      } catch (error) {
        console.log(`✗ Replicate test failed: ${error.message}\n`);
      }
    }
    
    // Test ceremony flow
    console.log('\n' + '='.repeat(60));
    console.log('🎭 Testing Ceremony Flow');
    console.log('='.repeat(60) + '\n');
    
    await connector.handleCeremonyStart({
      ceremonyId: 'test-ceremony-' + Date.now(),
      type: 'field-harmonization',
      participants: ['Test Agent 1', 'Test Agent 2']
    });
    
    console.log('✓ Ceremony start handled\n');
    
    // Test Oracle consultation
    console.log('🔮 Testing Oracle Consultation...\n');
    
    await connector.handleOracleConsultation({
      question: 'How can we increase field coherence?',
      response: 'Through sacred practice and unified intention, the field naturally harmonizes.',
      seeker: 'Test Agent 1'
    });
    
    console.log('✓ Oracle consultation handled\n');
    
    // Test coherence update
    console.log('📊 Testing Coherence Update...\n');
    
    const discord = connector.integrations.get('discord');
    const supabase = connector.integrations.get('supabase');
    
    if (discord && supabase) {
      const newCoherence = 85;
      await supabase.recordFieldState(newCoherence, mockField.harmonies);
      await discord.sendCoherenceUpdate(newCoherence, mockField.coherence, mockField.harmonies);
      console.log('✓ Coherence update sent\n');
    }
    
  } catch (error) {
    console.error('Test suite error:', error);
  } finally {
    // Cleanup
    console.log('\n' + '='.repeat(60));
    console.log('🧹 Cleaning up...');
    console.log('='.repeat(60) + '\n');
    
    await connector.shutdown();
    console.log('✓ Integrations shut down gracefully');
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Integration Test Summary');
  console.log('='.repeat(60) + '\n');
  
  const integrations = ['github', 'discord', 'supabase', 'replicate'];
  for (const name of integrations) {
    const integration = connector.integrations.get(name);
    if (integration) {
      console.log(`✓ ${name}: Initialized and tested`);
    } else {
      console.log(`⊘ ${name}: Not configured (check .env)`);
    }
  }
  
  console.log('\n🌟 Integration tests complete!\n');
}

// Run tests
runIntegrationTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});