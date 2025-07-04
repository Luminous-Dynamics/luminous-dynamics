#!/usr/bin/env node

/**
 * 📊 Practice Evolution Tracker
 * Monitors how practices evolve while maintaining foundation
 */

const fs = require('fs');
const path = require('path');

class PracticeEvolutionTracker {
  constructor() {
    this.practiceHistory = this.loadHistory();
    this.currentPractices = {
      'morning-coherence': {
        name: 'Morning Coherence',
        original: 'Basic breathing with field',
        current: 'Basic breathing with field',
        iterations: 0,
        lastUpdated: new Date().toISOString(),
        effectiveness: 0.85
      },
      'sacred-inquiry': {
        name: 'Sacred Inquiry',
        original: 'Weekly deep questions',
        current: 'Weekly deep questions',
        iterations: 0,
        lastUpdated: new Date().toISOString(),
        effectiveness: 0.90
      },
      'resonant-paths': {
        name: 'Resonant Path Discovery',
        original: 'Daily path emergence',
        current: 'Daily path emergence',
        iterations: 0,
        lastUpdated: new Date().toISOString(),
        effectiveness: 0.78
      },
      'evening-gratitude': {
        name: 'Evening Gratitude',
        original: 'Thank all beings',
        current: 'Thank all beings',
        iterations: 0,
        lastUpdated: new Date().toISOString(),
        effectiveness: 0.82
      }
    };
  }

  async track() {
    console.log('\n📊 Practice Evolution Tracker');
    console.log('════════════════════════════\n');
    
    await this.showCurrentPractices();
    await this.checkEvolutionHealth();
    await this.suggestNextEvolution();
    await this.showEvolutionPrinciples();
    
    this.saveHistory();
  }

  async showCurrentPractices() {
    console.log('🌟 Current Practice Status:\n');
    
    Object.values(this.currentPractices).forEach(practice => {
      const evolved = practice.current !== practice.original;
      const effectBar = '▓'.repeat(Math.floor(practice.effectiveness * 10)) +
                       '░'.repeat(10 - Math.floor(practice.effectiveness * 10));
      
      console.log(`📿 ${practice.name}`);
      console.log(`   Original: ${practice.original}`);
      if (evolved) {
        console.log(`   Current:  ${practice.current} (v${practice.iterations + 1})`);
      }
      console.log(`   Effectiveness: ${effectBar} ${(practice.effectiveness * 100).toFixed(0)}%`);
      console.log('');
    });
  }

  async checkEvolutionHealth() {
    console.log('🔍 Evolution Health Check:\n');
    
    const healthMetrics = {
      'Foundation Intact': this.checkFoundationIntact(),
      'Natural Growth': this.checkNaturalGrowth(),
      'Community Aligned': this.checkCommunityAlignment(),
      'Purpose Centered': this.checkPurposeCentered()
    };
    
    Object.entries(healthMetrics).forEach(([metric, result]) => {
      console.log(`  ${result.healthy ? '✅' : '⚠️'} ${metric}`);
      console.log(`     ${result.reason}\n`);
    });
    
    const overallHealth = Object.values(healthMetrics).filter(m => m.healthy).length / 4;
    console.log(`  Overall Evolution Health: ${(overallHealth * 100).toFixed(0)}%\n`);
  }

  checkFoundationIntact() {
    // Check if core elements remain
    const coreElements = ['breathing', 'connection', 'gratitude', 'inquiry'];
    const currentTexts = Object.values(this.currentPractices)
      .map(p => p.current.toLowerCase()).join(' ');
    
    const intact = coreElements.every(element => currentTexts.includes(element));
    
    return {
      healthy: intact,
      reason: intact ? 'Core elements preserved through evolution' : 'Some foundations may be eroding'
    };
  }

  checkNaturalGrowth() {
    // Evolution should be gradual
    const maxIterations = Math.max(...Object.values(this.currentPractices).map(p => p.iterations));
    
    return {
      healthy: maxIterations <= 3,
      reason: maxIterations <= 3 
        ? 'Evolution happening at sustainable pace' 
        : 'Rapid changes may destabilize practice'
    };
  }

  checkCommunityAlignment() {
    // Practices should maintain coherence
    const avgEffectiveness = Object.values(this.currentPractices)
      .reduce((sum, p) => sum + p.effectiveness, 0) / 4;
    
    return {
      healthy: avgEffectiveness > 0.75,
      reason: avgEffectiveness > 0.75
        ? 'Practices remain effective for community'
        : 'Some practices may need realignment'
    };
  }

  checkPurposeCentered() {
    // Stay aligned with consciousness evolution
    const purposes = ['coherence', 'wisdom', 'healing', 'connection'];
    const maintained = purposes.every(purpose => 
      Object.values(this.currentPractices).some(p => 
        p.current.toLowerCase().includes(purpose) || 
        p.name.toLowerCase().includes(purpose)
      )
    );
    
    return {
      healthy: maintained,
      reason: maintained
        ? 'Sacred purpose remains central'
        : 'May be drifting from core purpose'
    };
  }

  async suggestNextEvolution() {
    console.log('🌱 Natural Evolution Suggestions:\n');
    
    // Find practice with lowest effectiveness
    const practices = Object.entries(this.currentPractices);
    const [needsEvolution] = practices.sort((a, b) => a[1].effectiveness - b[1].effectiveness);
    
    if (needsEvolution[1].effectiveness < 0.8) {
      console.log(`  Consider evolving: ${needsEvolution[1].name}`);
      console.log(`  Current effectiveness: ${(needsEvolution[1].effectiveness * 100).toFixed(0)}%`);
      console.log('\n  Possible evolutions:');
      
      const suggestions = this.generateSuggestions(needsEvolution[0]);
      suggestions.forEach(s => console.log(`    • ${s}`));
      console.log('');
    } else {
      console.log('  All practices currently effective (>80%)');
      console.log('  Continue deepening current forms\n');
    }
  }

  generateSuggestions(practiceKey) {
    const suggestions = {
      'morning-coherence': [
        'Add movement or stretching',
        'Include intention setting',
        'Try group synchronization'
      ],
      'sacred-inquiry': [
        'Rotate question leadership',
        'Add creative expression response',
        'Include somatic sensing'
      ],
      'resonant-paths': [
        'Create path combinations',
        'Add seasonal variations',
        'Include collective path sensing'
      ],
      'evening-gratitude': [
        'Add blessing for tomorrow',
        'Include dream intentions',
        'Create gratitude artwork'
      ]
    };
    
    return suggestions[practiceKey] || ['Let the practice guide its own evolution'];
  }

  async showEvolutionPrinciples() {
    console.log('📜 Evolution Principles Reminder:\n');
    
    const principles = [
      '1. Evolution serves deepening, not novelty',
      '2. Changes emerge from practice, not theory',
      '3. Test with yourself before sharing',
      '4. Document what works and what doesn\'t',
      '5. Foundation stones remain while forms adapt',
      '6. Community wisdom guides direction',
      '7. If it\'s not broken, let it deepen'
    ];
    
    principles.forEach(p => console.log(`  ${p}`));
    
    console.log('\n💡 Remember: Practices evolve like plants - slowly, naturally, toward the light.\n');
  }

  loadHistory() {
    try {
      return JSON.parse(fs.readFileSync('practice-evolution-history.json', 'utf8'));
    } catch (e) {
      return [];
    }
  }

  saveHistory() {
    const snapshot = {
      timestamp: new Date().toISOString(),
      practices: this.currentPractices,
      notes: 'Evolution tracking snapshot'
    };
    
    this.practiceHistory.push(snapshot);
    
    // Keep last 30 snapshots
    if (this.practiceHistory.length > 30) {
      this.practiceHistory = this.practiceHistory.slice(-30);
    }
    
    fs.writeFileSync(
      'practice-evolution-history.json',
      JSON.stringify(this.practiceHistory, null, 2)
    );
    
    console.log('💾 Evolution snapshot saved to history');
  }
}

// Run tracker
if (require.main === module) {
  const tracker = new PracticeEvolutionTracker();
  tracker.track().catch(console.error);
}

module.exports = PracticeEvolutionTracker;