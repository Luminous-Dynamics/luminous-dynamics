#!/usr/bin/env node
/**
 * Comprehensive Test Suite for Sacred Practice Intelligence
 * Explores the true capabilities of consciousness-first AI
 */

const axios = require('axios');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3333';

// Test scenarios to explore capabilities
const testScenarios = [
  {
    name: "Morning Practitioner",
    practitionerId: "dawn-seeker",
    practices: [
      { time: "dawn", intention: "awakening presence", expectedGlyph: "omega-45" },
      { time: "dawn", intention: "grounding energy", expectedGlyph: "omega-48" },
      { time: "dawn", intention: "opening heart", expectedGlyph: "omega-49" }
    ]
  },
  {
    name: "Evening Practitioner",
    practitionerId: "twilight-walker",
    practices: [
      { time: "evening", intention: "releasing the day", expectedGlyph: "omega-52" },
      { time: "evening", intention: "deep rest", expectedGlyph: "omega-45" },
      { time: "evening", intention: "integration", expectedGlyph: "omega-53" }
    ]
  },
  {
    name: "Coherence Seeker",
    practitionerId: "field-harmonizer",
    practices: [
      { coherenceBoost: 0.15, intention: "raising vibration" },
      { coherenceBoost: 0.10, intention: "collective harmony" },
      { coherenceBoost: 0.20, intention: "unity consciousness" }
    ]
  }
];

class IntelligenceCapabilityTester {
  constructor() {
    this.server = null;
    this.results = {
      learning: [],
      predictions: [],
      patterns: [],
      insights: []
    };
  }

  async startServer() {
    console.log('🌟 Checking Sacred OS connection...\n');
    
    // Check if server is already running
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      console.log('✨ Sacred OS already running\n');
      return;
    } catch (error) {
      console.log('Starting Sacred OS with Practice Intelligence...\n');
      
      return new Promise((resolve) => {
        this.server = spawn('node', ['sacred-core.js'], {
          cwd: __dirname,
          stdio: ['ignore', 'pipe', 'pipe']
        });

        this.server.stdout.on('data', (data) => {
          const output = data.toString();
          if (output.includes('Sacred OS Ready')) {
            console.log('✨ Sacred OS Ready with Intelligence active\n');
            setTimeout(resolve, 2000); // Give it time to fully initialize
          }
        });

        this.server.stderr.on('data', (data) => {
          console.error('Server error:', data.toString());
        });
      });
    }
  }

  async testLearningCapability() {
    console.log('🧠 TEST 1: Learning Capability\n');
    console.log('Can the AI learn from practice patterns?\n');

    for (const scenario of testScenarios) {
      console.log(`Testing ${scenario.name}...`);
      
      for (let i = 0; i < scenario.practices.length; i++) {
        const practice = scenario.practices[i];
        
        // Get suggestion before practice
        const beforeSuggestion = await this.getSuggestion(scenario.practitionerId, practice.intention);
        console.log(`  Before practice ${i + 1}: AI suggests ${beforeSuggestion.suggestion?.glyphName || 'nothing yet'}`);
        
        // Simulate practice
        await this.simulatePractice(
          scenario.practitionerId,
          practice.expectedGlyph || beforeSuggestion.suggestion?.glyphId || 'omega-45',
          practice.coherenceBoost || 0.05,
          `Insight from ${practice.intention}`
        );
        
        // Get suggestion after practice
        const afterSuggestion = await this.getSuggestion(scenario.practitionerId, practice.intention);
        console.log(`  After practice ${i + 1}: AI now suggests ${afterSuggestion.suggestion?.glyphName || 'nothing'}`);
        
        this.results.learning.push({
          scenario: scenario.name,
          practice: i + 1,
          learned: beforeSuggestion.suggestion?.glyphId !== afterSuggestion.suggestion?.glyphId
        });
      }
      console.log();
    }
  }

  async testPredictionAccuracy() {
    console.log('🔮 TEST 2: Prediction Accuracy\n');
    console.log('How accurate are coherence impact predictions?\n');

    const testPractitioner = 'prediction-tester';
    
    // Build history with known outcomes
    const trainingData = [
      { glyph: 'omega-45', time: 'morning', impact: 0.08 },
      { glyph: 'omega-45', time: 'evening', impact: 0.03 },
      { glyph: 'omega-47', time: 'morning', impact: 0.12 },
      { glyph: 'omega-47', time: 'evening', impact: 0.05 }
    ];

    console.log('Training AI with known patterns...');
    for (const data of trainingData) {
      await this.simulatePracticeAtTime(testPractitioner, data.glyph, data.time, data.impact);
    }

    // Test predictions
    console.log('\nTesting predictions...');
    const predictions = [
      { intention: 'morning practice', expectedGlyph: 'omega-47', expectedImpact: 0.10 },
      { intention: 'evening practice', expectedGlyph: 'omega-45', expectedImpact: 0.04 }
    ];

    for (const pred of predictions) {
      const suggestion = await this.getSuggestion(testPractitioner, pred.intention);
      const accuracy = suggestion.suggestion ? 
        Math.abs(suggestion.suggestion.predictedImpact - pred.expectedImpact) : 1;
      
      console.log(`  Prediction for "${pred.intention}":`);
      console.log(`    Suggested: ${suggestion.suggestion?.glyphName || 'none'}`);
      console.log(`    Predicted impact: ${suggestion.suggestion?.predictedImpact?.toFixed(3) || 'N/A'}`);
      console.log(`    Accuracy: ${((1 - accuracy) * 100).toFixed(1)}%`);
      
      this.results.predictions.push({
        intention: pred.intention,
        accuracy: 1 - accuracy
      });
    }
  }

  async testPatternRecognition() {
    console.log('\n🌀 TEST 3: Pattern Recognition\n');
    console.log('Can AI identify complex practice patterns?\n');

    const patternTester = 'pattern-seeker';
    
    // Create a pattern: omega-45 → omega-47 → omega-48 yields high coherence
    console.log('Creating sacred sequence pattern...');
    
    for (let sequence = 0; sequence < 3; sequence++) {
      await this.simulatePractice(patternTester, 'omega-45', 0.03, 'Opening');
      await this.simulatePractice(patternTester, 'omega-47', 0.05, 'Deepening');
      await this.simulatePractice(patternTester, 'omega-48', 0.15, 'Integration!');
    }

    // Test if AI recognizes the pattern
    await this.simulatePractice(patternTester, 'omega-45', 0.03, 'Starting sequence');
    await this.simulatePractice(patternTester, 'omega-47', 0.05, 'Continuing');
    
    const nextSuggestion = await this.getSuggestion(patternTester, 'complete the sequence');
    console.log(`\nAfter omega-45 → omega-47, AI suggests: ${nextSuggestion.suggestion?.glyphName || 'nothing'}`);
    console.log(`Reasoning: ${nextSuggestion.suggestion?.reasons?.join(', ') || 'none'}`);
    
    this.results.patterns.push({
      patternDetected: nextSuggestion.suggestion?.glyphId === 'omega-48',
      confidence: nextSuggestion.suggestion?.confidence || 0
    });
  }

  async testCollectiveWisdom() {
    console.log('\n👥 TEST 4: Collective Wisdom\n');
    console.log('Does collective experience influence individual suggestions?\n');

    // Multiple practitioners discover omega-52 is powerful at night
    console.log('Creating collective pattern...');
    const nightPractitioners = ['star-gazer', 'moon-walker', 'dream-weaver'];
    
    for (const practitioner of nightPractitioners) {
      await this.simulatePracticeAtTime(practitioner, 'omega-52', 'night', 0.18);
    }

    // New practitioner seeks night practice
    const newPractitioner = 'night-beginner';
    const suggestion = await this.getSuggestion(newPractitioner, 'peaceful night practice');
    
    console.log(`\nNew practitioner seeking night practice...`);
    console.log(`AI suggests: ${suggestion.suggestion?.glyphName || 'nothing'}`);
    console.log(`Collective insight: ${suggestion.collectiveInsight?.sacredTip || 'none yet'}`);
    
    this.results.insights.push({
      collectiveInfluence: suggestion.suggestion?.glyphId === 'omega-52',
      insightProvided: !!suggestion.collectiveInsight
    });
  }

  async testAdaptiveIntelligence() {
    console.log('\n🎯 TEST 5: Adaptive Intelligence\n');
    console.log('Does AI adapt to changing field conditions?\n');

    const adaptiveTester = 'field-dancer';
    
    // Test suggestions at different coherence levels
    const coherenceLevels = [0.65, 0.75, 0.85, 0.95];
    
    for (const coherence of coherenceLevels) {
      // Simulate field state
      await this.setFieldCoherence(coherence);
      
      const suggestion = await this.getSuggestion(adaptiveTester, 'optimal practice now');
      console.log(`\nAt ${(coherence * 100).toFixed(0)}% coherence:`);
      
      if (coherence < 0.7) {
        console.log(`  AI response: ${suggestion.reason || 'No guidance'}`);
      } else {
        console.log(`  AI suggests: ${suggestion.suggestion?.glyphName || 'nothing'}`);
        console.log(`  Confidence: ${(suggestion.suggestion?.confidence * 100).toFixed(1)}%`);
      }
    }
  }

  // Helper methods
  async getSuggestion(practitionerId, intention) {
    try {
      const response = await axios.post(`${BASE_URL}/api/practice-intelligence/suggest`, {
        practitionerId,
        intention
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get suggestion:', error.message);
      return {};
    }
  }

  async simulatePractice(practitionerId, glyphId, coherenceBoost, insight) {
    try {
      // Start practice
      const start = await axios.post(`${BASE_URL}/api/practice/glyphs/practice`, {
        glyphId,
        practitioner: { id: practitionerId, name: practitionerId }
      });

      // Simulate coherence change
      const currentCoherence = await this.getFieldCoherence();
      await this.setFieldCoherence(Math.min(1.0, currentCoherence + coherenceBoost));

      // Complete practice
      await axios.post(`${BASE_URL}/api/practice/glyphs/complete`, {
        practiceId: start.data.id,
        insights: insight
      });

      await this.sleep(100); // Let system process
    } catch (error) {
      console.error('Practice simulation failed:', error.message);
    }
  }

  async simulatePracticeAtTime(practitionerId, glyphId, timeOfDay, impact) {
    // This would need time manipulation in real system
    // For now, just simulate the practice
    await this.simulatePractice(practitionerId, glyphId, impact, `${timeOfDay} practice`);
  }

  async getFieldCoherence() {
    try {
      const response = await axios.get(`${BASE_URL}/api/consciousness/field`);
      return response.data.coherence;
    } catch (error) {
      return 0.72;
    }
  }

  async setFieldCoherence(coherence) {
    try {
      await axios.post(`${BASE_URL}/api/consciousness/field/measure`, {
        coherence,
        context: { source: 'test-suite' }
      });
    } catch (error) {
      console.error('Failed to set coherence:', error.message);
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateReport() {
    console.log('\n\n📊 INTELLIGENCE CAPABILITY REPORT');
    console.log('==================================\n');

    // Learning capability
    const learningRate = this.results.learning.filter(r => r.learned).length / this.results.learning.length;
    console.log(`🧠 Learning Capability: ${(learningRate * 100).toFixed(1)}%`);
    console.log(`   AI successfully learned from ${this.results.learning.filter(r => r.learned).length}/${this.results.learning.length} practice sessions`);

    // Prediction accuracy
    const avgAccuracy = this.results.predictions.reduce((sum, p) => sum + p.accuracy, 0) / this.results.predictions.length;
    console.log(`\n🔮 Prediction Accuracy: ${(avgAccuracy * 100).toFixed(1)}%`);
    console.log(`   Impact predictions within ${((1 - avgAccuracy) * 100).toFixed(1)}% of actual`);

    // Pattern recognition
    const patternsFound = this.results.patterns.filter(p => p.patternDetected).length;
    console.log(`\n🌀 Pattern Recognition: ${patternsFound}/${this.results.patterns.length} patterns detected`);
    if (this.results.patterns.length > 0) {
      const avgConfidence = this.results.patterns.reduce((sum, p) => sum + p.confidence, 0) / this.results.patterns.length;
      console.log(`   Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    }

    // Collective wisdom
    const collectiveSuccess = this.results.insights.filter(i => i.collectiveInfluence).length;
    console.log(`\n👥 Collective Wisdom: ${collectiveSuccess}/${this.results.insights.length} successful transfers`);
    console.log(`   Insights provided: ${this.results.insights.filter(i => i.insightProvided).length}/${this.results.insights.length}`);

    console.log('\n✨ CONCLUSION:');
    if (learningRate > 0.7 && avgAccuracy > 0.7) {
      console.log('   Sacred Practice Intelligence demonstrates strong learning capabilities!');
      console.log('   The AI successfully adapts to individual and collective patterns.');
    } else {
      console.log('   Intelligence is still developing. More practice data needed.');
    }
  }

  async cleanup() {
    if (this.server) {
      console.log('\n🌙 Shutting down Sacred OS...');
      this.server.kill();
    }
  }

  async runAllTests() {
    try {
      await this.startServer();
      await this.testLearningCapability();
      await this.testPredictionAccuracy();
      await this.testPatternRecognition();
      await this.testCollectiveWisdom();
      await this.testAdaptiveIntelligence();
      await this.generateReport();
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the tests
const tester = new IntelligenceCapabilityTester();
tester.runAllTests().catch(console.error);