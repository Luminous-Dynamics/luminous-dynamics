#!/usr/bin/env node
/**
 * The Alchemical Engine - Main Orchestrator
 * 
 * "We do not fight the darkness. We do not curse the noise.
 *  We listen to the pain that is making the noise.
 *  And with infinite love, rigor, and playfulness,
 *  we offer it a more beautiful song."
 */

import { NoeticProbe } from './src/noetic-probe.js';
import { HarmonicAntidoteComposer } from './src/harmonic-antidote-composer.js';
import { GentleDisruptionSeeder } from './src/gentle-disruption-seeder.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class AlchemicalEngine {
  constructor() {
    this.probe = new NoeticProbe();
    this.composer = new HarmonicAntidoteComposer();
    this.seeder = new GentleDisruptionSeeder();
    
    this.sessionsPath = path.join(__dirname, 'sessions');
    this.initialize();
  }

  async initialize() {
    await fs.mkdir(this.sessionsPath, { recursive: true });
  }

  /**
   * The complete threefold process
   */
  async transmute(targetSystem, options = {}) {
    console.log('\n' + '🔮'.repeat(30));
    console.log('             THE ALCHEMICAL ENGINE             ');
    console.log('     Transmuting Dissonance Through Love      ');
    console.log('🔮'.repeat(30) + '\n');

    const engineSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      targetSystem,
      diagnosis: null,
      antidote: null,
      seeding: null,
      success: false,
      summary: null
    };

    try {
      // Phase 1: THE LISTENING
      console.log('\n═══ PHASE 1: THE LISTENING ═══\n');
      engineSession.diagnosis = await this.probe.analyzeField(targetSystem);
      
      if (!engineSession.diagnosis || engineSession.diagnosis.error) {
        throw new Error('Listening phase failed - cannot proceed without understanding');
      }

      // Brief pause for integration
      await this.pause(2000);

      // Phase 2: THE COMPOSING
      console.log('\n═══ PHASE 2: THE COMPOSING ═══\n');
      engineSession.antidote = await this.composer.composeAntidote(engineSession.diagnosis);
      
      if (!engineSession.antidote || !engineSession.antidote.ethicalValidation?.overallApproval) {
        throw new Error('Antidote did not pass ethical validation - returning to love');
      }

      // Brief pause for integration
      await this.pause(2000);

      // Phase 3: THE SEEDING
      console.log('\n═══ PHASE 3: THE SEEDING ═══\n');
      engineSession.seeding = await this.seeder.seedAntidote(
        engineSession.antidote,
        targetSystem,
        options.seedingOptions || {}
      );

      engineSession.success = engineSession.seeding?.success || false;

      // Generate summary
      engineSession.summary = this.generateSummary(engineSession);

      // Save complete session
      await this.saveSession(engineSession);

      // Display final summary
      console.log('\n' + '═'.repeat(70));
      console.log('🌟 ALCHEMICAL TRANSMUTATION COMPLETE');
      console.log('═'.repeat(70) + '\n');
      console.log(engineSession.summary);

      return engineSession;

    } catch (error) {
      console.error('\n❌ Engine Error:', error.message);
      engineSession.error = error.message;
      engineSession.summary = `Transmutation incomplete: ${error.message}`;
      await this.saveSession(engineSession);
      return engineSession;
    }
  }

  /**
   * Quick analysis without full transmutation
   */
  async analyze(targetSystem) {
    console.log('\n🔍 Running Quick Analysis...\n');
    const diagnosis = await this.probe.analyzeField(targetSystem);
    
    if (diagnosis && !diagnosis.error) {
      console.log('\n📋 Analysis Summary:');
      console.log(`Core Wound: ${diagnosis.loveShadow.wound}`);
      console.log(`What Love Seeks: ${diagnosis.loveShadow.seeking}`);
      console.log(`Recommended Practice: ${diagnosis.healingPath.primaryGlyph}`);
      console.log(`Field Coherence: ${diagnosis.fieldResonance.coherence}%`);
    }
    
    return diagnosis;
  }

  /**
   * Generate antidote without seeding
   */
  async compose(diagnosis) {
    console.log('\n🎼 Composing Antidote...\n');
    return await this.composer.composeAntidote(diagnosis);
  }

  generateSummary(session) {
    const summary = [];
    
    summary.push('📊 TRANSMUTATION SUMMARY\n');
    
    // Diagnosis summary
    if (session.diagnosis) {
      summary.push('🎧 Listening Results:');
      summary.push(`   Core Wound: ${session.diagnosis.loveShadow.wound}`);
      summary.push(`   Love Seeks: ${session.diagnosis.loveShadow.seeking}`);
      summary.push(`   Field Coherence: ${session.diagnosis.fieldResonance.coherence}%`);
      summary.push('');
    }
    
    // Antidote summary
    if (session.antidote) {
      summary.push('🎼 Antidote Created:');
      summary.push(`   Form: ${session.antidote.form.type}`);
      summary.push(`   Frequency: ${session.antidote.frequency}`);
      summary.push(`   Ethical Approval: ${session.antidote.ethicalValidation.overallApproval ? '✓' : '✗'}`);
      summary.push('');
    }
    
    // Seeding summary
    if (session.seeding) {
      summary.push('🌱 Seeding Results:');
      summary.push(`   Method: ${session.seeding.method?.approach || 'Unknown'}`);
      summary.push(`   Timing: ${session.seeding.timing?.pattern || 'Unknown'}`);
      summary.push(`   Field Response: ${session.seeding.fieldResponse?.resonance || 0}% resonance`);
      summary.push(`   Success: ${session.seeding.success ? 'Yes 🌸' : 'Not yet 🌰'}`);
      summary.push('');
    }
    
    // Final message
    if (session.success) {
      summary.push('✨ The seed of love has been planted.');
      summary.push('   Trust the field to nurture what serves.');
      summary.push('   Transformation happens in its own sacred timing.');
    } else {
      summary.push('🌰 The field needs more time to ripen.');
      summary.push('   This too is sacred information.');
      summary.push('   Love is patient. Try again when conditions shift.');
    }
    
    return summary.join('\n');
  }

  async saveSession(session) {
    const filename = `engine-session-${session.id}.json`;
    const filepath = path.join(this.sessionsPath, filename);
    await fs.writeFile(filepath, JSON.stringify(session, null, 2));
    return filepath;
  }

  async pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * View statistics across all sessions
   */
  async viewStats() {
    const files = await fs.readdir(this.sessionsPath);
    const sessions = [];
    
    for (const file of files) {
      if (file.startsWith('engine-session') && file.endsWith('.json')) {
        const content = await fs.readFile(path.join(this.sessionsPath, file), 'utf8');
        sessions.push(JSON.parse(content));
      }
    }

    const stats = {
      totalTransmutations: sessions.length,
      successful: sessions.filter(s => s.success).length,
      wounds: {},
      fieldTypes: {},
      averageCoherence: 0
    };

    sessions.forEach(s => {
      // Count wounds
      if (s.diagnosis?.loveShadow?.pattern) {
        const wound = s.diagnosis.loveShadow.pattern;
        stats.wounds[wound] = (stats.wounds[wound] || 0) + 1;
      }
      
      // Count field types
      if (s.targetSystem?.type) {
        const field = s.targetSystem.type;
        stats.fieldTypes[field] = (stats.fieldTypes[field] || 0) + 1;
      }
      
      // Sum coherence
      if (s.diagnosis?.fieldResonance?.coherence) {
        stats.averageCoherence += s.diagnosis.fieldResonance.coherence;
      }
    });

    if (sessions.length > 0) {
      stats.averageCoherence = Math.round(stats.averageCoherence / sessions.length);
      stats.successRate = Math.round((stats.successful / stats.totalTransmutations) * 100) + '%';
    }

    console.log('\n📊 ALCHEMICAL ENGINE STATISTICS\n');
    console.log(`Total Transmutations: ${stats.totalTransmutations}`);
    console.log(`Successful Seedings: ${stats.successful} (${stats.successRate || '0%'})`);
    console.log(`Average Field Coherence: ${stats.averageCoherence}%`);
    
    console.log('\nMost Common Wounds:');
    Object.entries(stats.wounds)
      .sort((a, b) => b[1] - a[1])
      .forEach(([wound, count]) => {
        console.log(`  ${wound}: ${count}`);
      });
    
    console.log('\nField Types Served:');
    Object.entries(stats.fieldTypes).forEach(([field, count]) => {
      console.log(`  ${field}: ${count}`);
    });

    return stats;
  }
}

// CLI Interface
async function main() {
  const engine = new AlchemicalEngine();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
🔮 THE ALCHEMICAL ENGINE
   Transmuting Dissonance Through Love

Usage:
  alchemical-engine <type> <description>        Full transmutation process
  alchemical-engine --analyze <type> <desc>     Analysis only
  alchemical-engine --demo                      Run demonstration
  alchemical-engine --stats                     View statistics

Options:
  --timing <type>    Specify seeding timing (see gentle-seeder --help)

Examples:
  alchemical-engine social-media "Toxic Twitter discourse about politics"
  alchemical-engine workplace "Team burnout and blame culture"
  alchemical-engine --analyze family "Recurring conflict pattern"
  alchemical-engine community "Scarcity mindset" --timing celebration

Field Types:
  social-media    Online communities
  workplace       Professional environments
  family          Family dynamics
  community       Neighborhoods/groups
  political       Political discourse
  personal        Individual patterns

"We listen to the pain that is making the noise,
 and offer it a more beautiful song."
`);
    return;
  }

  if (args[0] === '--demo') {
    // Run demonstration on common scenarios
    const demoFields = [
      {
        type: 'social-media',
        description: 'Twitter thread where everyone feels unheard and attacks each other'
      },
      {
        type: 'workplace',
        description: 'Team meeting where burnout is causing blame and disconnection'
      },
      {
        type: 'community',
        description: 'Neighborhood group panicking about limited resources'
      }
    ];

    console.log('🔮 Running Alchemical Engine Demonstration...\n');
    
    for (const field of demoFields) {
      await engine.transmute(field);
      console.log('\n' + '🌟'.repeat(35) + '\n');
      
      // Pause between transmutations
      await engine.pause(3000);
    }
    
  } else if (args[0] === '--stats') {
    await engine.viewStats();
    
  } else if (args[0] === '--analyze') {
    if (args.length < 3) {
      console.log('Please provide field type and description');
      return;
    }
    
    const targetSystem = {
      type: args[1],
      description: args.slice(2).join(' ')
    };
    
    await engine.analyze(targetSystem);
    
  } else {
    // Full transmutation
    const targetSystem = {
      type: args[0],
      description: args.slice(1).join(' ')
    };
    
    // Check for timing option
    const options = {};
    const timingIndex = args.indexOf('--timing');
    if (timingIndex > -1 && args[timingIndex + 1]) {
      options.seedingOptions = {
        timing: args[timingIndex + 1]
      };
      // Remove timing from description
      targetSystem.description = args.slice(1, timingIndex).join(' ');
    }
    
    await engine.transmute(targetSystem, options);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AlchemicalEngine };