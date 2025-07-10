#!/usr/bin/env node
/**
 * Test Contextual Intelligence Improvements
 * Verify that responses are truly context-aware
 */

const ContextAwareResponseSystem = require('./context-aware-response-system');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

class ContextualImprovementTests {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
    this.contextSystem = new ContextAwareResponseSystem(dbPath);
    this.testResults = [];
  }

  /**
   * Run all contextual improvement tests
   */
  async runAllTests() {
    console.log('🧪 Testing Contextual Intelligence Improvements\n');
    
    await this.setupTestData();
    
    // Test 1: Emotional continuity
    await this.testEmotionalContinuity();
    
    // Test 2: Relationship awareness
    await this.testRelationshipAwareness();
    
    // Test 3: Pattern recognition
    await this.testPatternRecognition();
    
    // Test 4: Field state sensitivity
    await this.testFieldStateSensitivity();
    
    // Test 5: Contextual vs template comparison
    await this.compareWithTemplateResponses();
    
    // Generate report
    this.generateReport();
  }

  /**
   * Setup test conversation histories
   */
  async setupTestData() {
    console.log('📝 Setting up test data...\n');
    
    // Clear test messages
    await this.clearTestMessages();
    
    // Create test conversation 1: Emotional support scenario
    await this.createConversation([
      {
        from: 'agent_test_1',
        to: 'agent_test_2',
        content: 'I\'m feeling overwhelmed with all the changes happening',
        type: 'reflection',
        harmony: 'integration',
        impact: -0.1
      },
      {
        from: 'agent_test_2',
        to: 'agent_test_1',
        content: 'Change can be challenging. I\'m here to listen',
        type: 'healing',
        harmony: 'healing',
        impact: 0.15
      },
      {
        from: 'agent_test_1',
        to: 'agent_test_2',
        content: 'Thank you. It helps to know I\'m not alone in this',
        type: 'gratitude',
        harmony: 'gratitude',
        impact: 0.2
      }
    ]);
    
    // Create test conversation 2: Collaboration scenario
    await this.createConversation([
      {
        from: 'agent_test_3',
        to: 'agent_test_4',
        content: 'Shall we work together on the sacred geometry module?',
        type: 'request',
        harmony: 'emergence',
        impact: 0.1
      },
      {
        from: 'agent_test_4',
        to: 'agent_test_3',
        content: 'Yes! I\'ve been exploring some patterns that might help',
        type: 'transmission',
        harmony: 'emergence',
        impact: 0.15
      },
      {
        from: 'agent_test_3',
        to: 'agent_test_4',
        content: 'Wonderful! Let\'s meet in the sacred space to align our visions',
        type: 'celebration',
        harmony: 'celebration',
        impact: 0.2
      }
    ]);
  }

  /**
   * Test 1: Emotional continuity
   */
  async testEmotionalContinuity() {
    console.log('Test 1: Emotional Continuity');
    console.log('Testing if responses maintain emotional thread...\n');
    
    const testMessage = {
      from_agent: 'agent_test_1',
      to_agent: 'agent_test_2',
      content: 'I\'m starting to feel a bit better, but still processing',
      message_type: 'reflection'
    };
    
    const response = await this.contextSystem.generateContextualResponse(
      testMessage,
      testMessage.from_agent,
      testMessage.to_agent
    );
    
    // Check if response acknowledges emotional journey
    const acknowledgesJourney = response.content.toLowerCase().includes('process') ||
                               response.content.toLowerCase().includes('journey') ||
                               response.content.toLowerCase().includes('space');
    
    const maintainsSupportiveTone = response.message_type === 'healing' ||
                                    response.message_type === 'reflection' ||
                                    response.harmony === 'healing';
    
    this.testResults.push({
      test: 'Emotional Continuity',
      passed: acknowledgesJourney && maintainsSupportiveTone,
      details: {
        acknowledgesJourney,
        maintainsSupportiveTone,
        responseType: response.message_type,
        response: response.content
      }
    });
    
    console.log(`Result: ${acknowledgesJourney && maintainsSupportiveTone ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Response: "${response.content}"\n`);
  }

  /**
   * Test 2: Relationship awareness
   */
  async testRelationshipAwareness() {
    console.log('Test 2: Relationship Awareness');
    console.log('Testing if responses reflect relationship history...\n');
    
    // Test with established relationship
    const establishedMessage = {
      from_agent: 'agent_test_3',
      to_agent: 'agent_test_4',
      content: 'Ready to continue our work?',
      message_type: 'request'
    };
    
    const establishedResponse = await this.contextSystem.generateContextualResponse(
      establishedMessage,
      establishedMessage.from_agent,
      establishedMessage.to_agent
    );
    
    // Test with new relationship
    const newMessage = {
      from_agent: 'agent_test_new',
      to_agent: 'agent_test_4',
      content: 'Hello, I\'d like to learn about your work',
      message_type: 'request'
    };
    
    const newResponse = await this.contextSystem.generateContextualResponse(
      newMessage,
      newMessage.from_agent,
      newMessage.to_agent
    );
    
    // Check if responses differ based on relationship
    const establishedAcknowledges = establishedResponse.content.includes('our') ||
                                   establishedResponse.content.includes('continue') ||
                                   establishedResponse.content.includes('together');
    
    const newIsWelcoming = newResponse.content.includes('welcome') ||
                          newResponse.content.includes('meet') ||
                          newResponse.message_type === 'gratitude';
    
    this.testResults.push({
      test: 'Relationship Awareness',
      passed: establishedAcknowledges && newIsWelcoming,
      details: {
        establishedAcknowledges,
        newIsWelcoming,
        establishedResponse: establishedResponse.content,
        newResponse: newResponse.content
      }
    });
    
    console.log(`Result: ${establishedAcknowledges && newIsWelcoming ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Established: "${establishedResponse.content}"`);
    console.log(`New: "${newResponse.content}"\n`);
  }

  /**
   * Test 3: Pattern recognition
   */
  async testPatternRecognition() {
    console.log('Test 3: Pattern Recognition');
    console.log('Testing if system recognizes conversation patterns...\n');
    
    // Create a pattern of questions
    await this.createConversation([
      {
        from: 'agent_test_5',
        to: 'agent_test_6',
        content: 'What is the meaning of coherence in our system?',
        type: 'request',
        harmony: 'integration'
      },
      {
        from: 'agent_test_6',
        to: 'agent_test_5',
        content: 'Coherence represents the harmonic alignment of our collective field',
        type: 'reflection',
        harmony: 'integration'
      },
      {
        from: 'agent_test_5',
        to: 'agent_test_6',
        content: 'How do we measure this coherence?',
        type: 'request',
        harmony: 'integration'
      }
    ]);
    
    const questionMessage = {
      from_agent: 'agent_test_5',
      to_agent: 'agent_test_6',
      content: 'What practices help increase coherence?',
      message_type: 'request'
    };
    
    const response = await this.contextSystem.generateContextualResponse(
      questionMessage,
      questionMessage.from_agent,
      questionMessage.to_agent
    );
    
    // Check if response recognizes question-answer pattern
    const recognizesPattern = response.message_type === 'reflection' ||
                             response.harmony === 'integration';
    
    const providesSubstantive = response.content.length > 50;
    
    this.testResults.push({
      test: 'Pattern Recognition',
      passed: recognizesPattern && providesSubstantive,
      details: {
        recognizesPattern,
        providesSubstantive,
        responseType: response.message_type,
        responseLength: response.content.length
      }
    });
    
    console.log(`Result: ${recognizesPattern && providesSubstantive ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Pattern recognized: ${recognizesPattern}`);
    console.log(`Response length: ${response.content.length} chars\n`);
  }

  /**
   * Test 4: Field state sensitivity
   */
  async testFieldStateSensitivity() {
    console.log('Test 4: Field State Sensitivity');
    console.log('Testing if responses adapt to field conditions...\n');
    
    // Simulate high activity period
    const highActivityMessages = [];
    for (let i = 0; i < 20; i++) {
      highActivityMessages.push({
        from: `agent_busy_${i % 5}`,
        to: 'agent_test_7',
        content: `Message ${i} in high activity period`,
        type: 'transmission',
        harmony: 'emergence',
        impact: 0.05
      });
    }
    await this.createConversation(highActivityMessages);
    
    const busyMessage = {
      from_agent: 'agent_test_8',
      to_agent: 'agent_test_7',
      content: 'Can we discuss something important?',
      message_type: 'request'
    };
    
    const response = await this.contextSystem.generateContextualResponse(
      busyMessage,
      busyMessage.from_agent,
      busyMessage.to_agent
    );
    
    // Check if response acknowledges busy state
    const acknowledgesBusy = response.content.includes('activity') ||
                            response.content.includes('busy') ||
                            response.content.includes('moment') ||
                            response.field_impact < 0.15;
    
    this.testResults.push({
      test: 'Field State Sensitivity',
      passed: acknowledgesBusy,
      details: {
        acknowledgesBusy,
        fieldImpact: response.field_impact,
        response: response.content
      }
    });
    
    console.log(`Result: ${acknowledgesBusy ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Field impact: ${response.field_impact}`);
    console.log(`Response: "${response.content}"\n`);
  }

  /**
   * Test 5: Compare with template responses
   */
  async compareWithTemplateResponses() {
    console.log('Test 5: Contextual vs Template Comparison');
    console.log('Comparing contextual responses with static templates...\n');
    
    const scenarios = [
      {
        name: 'Greeting',
        message: {
          from_agent: 'agent_test_9',
          to_agent: 'agent_test_10',
          content: 'Hello there!',
          message_type: 'greeting'
        },
        template: 'Hello! Nice to meet you.'
      },
      {
        name: 'Help Request',
        message: {
          from_agent: 'agent_test_11',
          to_agent: 'agent_test_12',
          content: 'I need help understanding the sacred patterns',
          message_type: 'request'
        },
        template: 'I\'d be happy to help you.'
      }
    ];
    
    let totalImprovement = 0;
    
    for (const scenario of scenarios) {
      const contextual = await this.contextSystem.generateContextualResponse(
        scenario.message,
        scenario.message.from_agent,
        scenario.message.to_agent
      );
      
      // Measure improvement
      const contextLength = contextual.content.length;
      const templateLength = scenario.template.length;
      const hasFieldInfo = contextual.content.includes('coherence') || 
                          contextual.content.includes('field');
      const hasPersonalization = contextual.content.includes('you') ||
                                contextual.content.includes('our');
      
      const improvement = ((contextLength / templateLength - 1) * 50) +
                         (hasFieldInfo ? 25 : 0) +
                         (hasPersonalization ? 25 : 0);
      
      totalImprovement += improvement;
      
      console.log(`${scenario.name}:`);
      console.log(`  Template: "${scenario.template}"`);
      console.log(`  Contextual: "${contextual.content}"`);
      console.log(`  Improvement: ${improvement.toFixed(1)}%\n`);
    }
    
    const avgImprovement = totalImprovement / scenarios.length;
    
    this.testResults.push({
      test: 'Template Comparison',
      passed: avgImprovement > 50,
      details: {
        averageImprovement: avgImprovement,
        threshold: 50
      }
    });
  }

  /**
   * Helper methods
   */
  async clearTestMessages() {
    return new Promise((resolve) => {
      this.db.run(`
        DELETE FROM unified_messages 
        WHERE from_agent LIKE 'agent_test_%' 
           OR to_agent LIKE 'agent_test_%'
      `, resolve);
    });
  }

  async createConversation(messages) {
    for (const msg of messages) {
      await new Promise((resolve) => {
        this.db.run(`
          INSERT INTO unified_messages
          (id, from_agent, to_agent, content, message_type, 
           harmony, field_impact, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          uuidv4(),
          msg.from,
          msg.to,
          msg.content,
          msg.type || 'transmission',
          msg.harmony || 'emergence',
          msg.impact || 0.1,
          Date.now() - (messages.length - messages.indexOf(msg)) * 60000
        ], resolve);
      });
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('CONTEXTUAL INTELLIGENCE TEST REPORT');
    console.log('='.repeat(60) + '\n');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const percentage = (passed / total * 100).toFixed(1);
    
    console.log(`Overall Score: ${passed}/${total} (${percentage}%)\n`);
    
    this.testResults.forEach(result => {
      console.log(`${result.passed ? '✅' : '❌'} ${result.test}`);
      Object.entries(result.details).forEach(([key, value]) => {
        if (key !== 'response' && key !== 'establishedResponse' && key !== 'newResponse') {
          console.log(`   ${key}: ${value}`);
        }
      });
    });
    
    console.log('\n' + '='.repeat(60));
    
    if (percentage >= 80) {
      console.log('🎉 Excellent! Contextual intelligence is working well.');
    } else if (percentage >= 60) {
      console.log('👍 Good progress. Some areas need improvement.');
    } else {
      console.log('🔧 Significant improvements needed in contextual awareness.');
    }
  }
}

// Run tests
if (require.main === module) {
  const dbPath = process.argv[2] || '/home/tstoltz/Luminous-Dynamics/the-weave/cli/unified-agent-network.db';
  
  const tests = new ContextualImprovementTests(dbPath);
  tests.runAllTests()
    .then(() => {
      console.log('\n✅ Contextual intelligence tests complete!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Test error:', err);
      process.exit(1);
    });
}