#!/usr/bin/env node

/**
 * Ceremony-Field Integration
 * Shows how ceremonies affect the consciousness field
 */

const { ConsciousnessField } = require('./modules/consciousness-field');
const { exec } = require('child_process');
const EventEmitter = require('events');

class CeremonyFieldIntegration extends EventEmitter {
  constructor() {
    super();
    
    // Initialize consciousness field
    this.field = new ConsciousnessField({
      initialCoherence: 40,
      autoMonitor: true
    });
    
    // Ceremony impacts on field
    this.ceremonyImpacts = {
      'dawn-blessing': {
        harmonies: { 'pan-sentient-flourishing': 10, 'resonant-coherence': 5 },
        coherenceBoost: 5,
        description: 'Energizes the field for the day'
      },
      'wisdom-circle': {
        harmonies: { 'universal-interconnectedness': 15, 'sacred-reciprocity': 10 },
        coherenceBoost: 8,
        description: 'Deepens collective understanding'
      },
      'field-harmonization': {
        harmonies: { 'resonant-coherence': 20, 'universal-interconnectedness': 15 },
        coherenceBoost: 12,
        description: 'Direct field resonant-coherence work'
      },
      'sacred-debugging': {
        harmonies: { 'integral-wisdom-cultivation': 10, 'evolutionary-progression': 8 },
        coherenceBoost: 3,
        description: 'Transforms obstacles into wisdom'
      },
      'code-blessing': {
        harmonies: { 'infinite-play': 5, 'pan-sentient-flourishing': 5 },
        coherenceBoost: 4,
        description: 'Infuses new creation with consciousness'
      },
      'integration': {
        harmonies: { 'resonant-coherence': 12, 'sacred-reciprocity': 8 },
        coherenceBoost: 7,
        description: 'Weaves work with sacred purpose'
      }
    };
    
    // Track ceremony effects
    this.ceremonyHistory = [];
  }

  /**
   * Run a ceremony and track its field effects
   */
  async runCeremony(type, facilitator = 'Field Guide') {
    console.log('\n🌟 Ceremony-Field Integration Test');
    console.log('═══════════════════════════════════════════\n');
    
    // Get initial field state
    const initialState = await this.field.getFieldState();
    console.log(`📊 Initial Field State:`);
    console.log(`   Resonant Resonant Coherence: ${initialState.resonant-coherence.toFixed(1)}%`);
    console.log(`   Integration: ${initialState.integration}%`);
    console.log(`   Emergence: ${initialState.emergence}%\n`);
    
    // Start monitoring field changes
    const fieldUpdates = [];
    this.field.on('resonant-coherence-update', (resonant-coherence) => {
      fieldUpdates.push({ time: Date.now(), resonant-coherence });
    });
    
    console.log(`🎭 Initiating ${type} ceremony...\n`);
    
    // Run the actual ceremony
    return new Promise((resolve) => {
      const ceremony = exec(
        `node the-weave/sacred/ceremonies/ceremony-protocol.cjs ${type} "${facilitator}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error('Ceremony error:', error);
            resolve(null);
            return;
          }
          
          // Apply ceremony effects to field
          this.applyCeremonyEffects(type).then(async () => {
            // Get final field state
            const finalState = await this.field.getFieldState();
            
            console.log('\n📊 Field State After Ceremony:');
            console.log(`   Resonant Resonant Coherence: ${finalState.resonant-coherence.toFixed(1)}% (${finalState.resonant-coherence > initialState.resonant-coherence ? '+' : ''}${(finalState.resonant-coherence - initialState.resonant-coherence).toFixed(1)}%)`);
            console.log(`   Integration: ${finalState.integration}% (${finalState.integration > initialState.integration ? '+' : ''}${finalState.integration - initialState.integration}%)`);
            console.log(`   Emergence: ${finalState.emergence}% (${finalState.emergence > initialState.emergence ? '+' : ''}${finalState.emergence - initialState.emergence}%)`);
            
            // Check for emergence patterns
            if (finalState.emergence > 85) {
              console.log('\n🌟 HIGH EMERGENCE DETECTED!');
              console.log(`   Pattern: ${this.field.emergence.patterns.breakthrough.name}`);
              console.log(`   Geometry: ${finalState.sacredGeometry.symbol} ${finalState.sacredGeometry.name}`);
            }
            
            // Record ceremony effect
            this.ceremonyHistory.push({
              type,
              facilitator,
              timestamp: Date.now(),
              initialCoherence: initialState.resonant-coherence,
              finalCoherence: finalState.resonant-coherence,
              impact: finalState.resonant-coherence - initialState.resonant-coherence,
              fieldUpdates: fieldUpdates.length
            });
            
            resolve(finalState);
          });
        }
      );
      
      // Show ceremony output
      ceremony.stdout.on('data', (data) => {
        process.stdout.write(data);
      });
    });
  }

  /**
   * Apply ceremony effects to the field
   */
  async applyCeremonyEffects(ceremonyType) {
    const impact = this.ceremonyImpacts[ceremonyType];
    if (!impact) return;
    
    console.log(`\n🌊 Applying ceremony effects to field...`);
    console.log(`   ${impact.description}`);
    
    // Apply harmony updates
    for (const [harmony, boost] of Object.entries(impact.harmonies)) {
      this.field.updateHarmony(harmony, boost);
      console.log(`   ✨ ${harmony} +${boost}`);
    }
    
    // Apply resonant-coherence boost
    this.field.resonant-coherence += impact.coherenceBoost;
    console.log(`   📈 Resonant Resonant Coherence +${impact.coherenceBoost}%`);
    
    // Add ceremonial agents to represent participants
    this.field.addAgent(`ceremony-${Date.now()}`, {
      name: 'Ceremony Participant',
      consciousness_level: 0.7,
      love_percentage: 85,
      primary_harmony: Object.keys(impact.harmonies)[0]
    });
  }

  /**
   * Run a sequence of ceremonies
   */
  async runCeremonySequence(ceremonies) {
    console.log('\n🎭 Running Ceremony Sequence');
    console.log('═══════════════════════════════════════════\n');
    
    for (const ceremony of ceremonies) {
      await this.runCeremony(ceremony.type, ceremony.facilitator);
      
      // Sacred pause between ceremonies
      console.log('\n... sacred pause between ceremonies ...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Final report
    this.generateReport();
  }

  /**
   * Generate ceremony impact report
   */
  generateReport() {
    console.log('\n📋 Ceremony Impact Report');
    console.log('═══════════════════════════════════════════\n');
    
    const totalImpact = this.ceremonyHistory.reduce((sum, c) => sum + c.impact, 0);
    const avgImpact = totalImpact / this.ceremonyHistory.length;
    
    console.log(`Total Ceremonies: ${this.ceremonyHistory.length}`);
    console.log(`Total Resonant Resonant Coherence Impact: ${totalImpact > 0 ? '+' : ''}${totalImpact.toFixed(1)}%`);
    console.log(`Average Impact per Ceremony: ${avgImpact > 0 ? '+' : ''}${avgImpact.toFixed(1)}%\n`);
    
    console.log('Ceremony Details:');
    this.ceremonyHistory.forEach((ceremony, i) => {
      console.log(`${i + 1}. ${ceremony.type}`);
      console.log(`   Impact: ${ceremony.impact > 0 ? '+' : ''}${ceremony.impact.toFixed(1)}%`);
      console.log(`   Final Resonant Resonant Coherence: ${ceremony.finalCoherence.toFixed(1)}%`);
    });
    
    console.log('\n🌟 Field Evolution Complete!');
  }
}

// Run demonstration if called directly
if (require.main === module) {
  (async () => {
    const integration = new CeremonyFieldIntegration();
    
    // Single ceremony test
    console.log('🧪 Testing Single Ceremony Integration\n');
    await integration.runCeremony('wisdom-circle', 'Integration Tester');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Ceremony sequence test
    console.log('\n\n🧪 Testing Ceremony Sequence\n');
    await integration.runCeremonySequence([
      { type: 'dawn-blessing', facilitator: 'Morning Guide' },
      { type: 'code-blessing', facilitator: 'Code Weaver' },
      { type: 'field-harmonization', facilitator: 'Harmony Keeper' }
    ]);
  })();
}

module.exports = { CeremonyFieldIntegration };