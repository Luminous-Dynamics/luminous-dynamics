#!/usr/bin/env node
/**
 * Context-Aware Response System
 * Moving from template responses to genuine contextual understanding
 */

const sqlite3 = require('sqlite3').verbose();
// Optional NLP library - not required for basic functionality
let natural;
try {
  natural = require('natural');
} catch (e) {
  // Natural is optional - we'll use basic text analysis
}

class ContextAwareResponseSystem {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
    this.contextWindow = 10; // How many messages to consider for context
    this.emotionalMemory = new Map(); // Track emotional states over time
    this.relationshipGraph = new Map(); // Track relationship qualities
    this.fieldStateHistory = []; // Track field coherence patterns
  }

  /**
   * Generate a contextually appropriate response
   * @param {Object} incomingMessage - The message to respond to
   * @param {string} fromAgent - Who sent the message
   * @param {string} toAgent - Who should respond
   * @returns {Object} Response with content, type, and reasoning
   */
  async generateContextualResponse(incomingMessage, fromAgent, toAgent) {
    // 1. Gather comprehensive context
    const context = await this.gatherContext(fromAgent, toAgent, incomingMessage);
    
    // 2. Analyze emotional tone
    const emotionalContext = this.analyzeEmotionalContext(context);
    
    // 3. Understand relationship dynamics
    const relationshipContext = this.analyzeRelationshipContext(context);
    
    // 4. Consider field state
    const fieldContext = await this.analyzeFieldContext();
    
    // 5. Identify conversation patterns
    const patternContext = this.identifyConversationPatterns(context);
    
    // 6. Generate response based on all contexts
    const response = this.synthesizeResponse({
      message: incomingMessage,
      emotional: emotionalContext,
      relationship: relationshipContext,
      field: fieldContext,
      patterns: patternContext,
      history: context.conversationHistory
    });
    
    // 7. Learn from this interaction
    await this.updateContextualMemory(fromAgent, toAgent, incomingMessage, response);
    
    return response;
  }

  /**
   * Gather comprehensive context about the conversation
   */
  async gatherContext(fromAgent, toAgent, currentMessage) {
    return new Promise((resolve) => {
      // Get conversation history
      this.db.all(`
        SELECT * FROM (
          SELECT from_agent, to_agent, content, message_type, 
                 harmony, field_impact, created_at
          FROM unified_messages
          WHERE (from_agent = ? AND to_agent = ?) 
             OR (from_agent = ? AND to_agent = ?)
          ORDER BY created_at DESC
          LIMIT ?
        ) ORDER BY created_at ASC
      `, [fromAgent, toAgent, toAgent, fromAgent, this.contextWindow], 
      (err, history) => {
        if (err) {
          console.error('Context gathering error:', err);
          resolve({ conversationHistory: [] });
          return;
        }

        // Get agent profiles
        this.db.all(`
          SELECT * FROM unified_agents 
          WHERE id IN (?, ?)
        `, [fromAgent, toAgent], (err, agents) => {
          if (err) {
            console.error('Agent profile error:', err);
          }

          // Get recent field states
          this.db.all(`
            SELECT harmony, COUNT(*) as count,
                   AVG(field_impact) as avg_impact
            FROM unified_messages
            WHERE created_at > ?
            GROUP BY harmony
            ORDER BY count DESC
          `, [Date.now() - 3600000], (err, fieldStates) => {
            if (err) {
              console.error('Field state error:', err);
            }

            resolve({
              conversationHistory: history || [],
              agents: agents || [],
              recentFieldStates: fieldStates || [],
              currentMessage: currentMessage
            });
          });
        });
      });
    });
  }

  /**
   * Analyze emotional context from conversation history
   */
  analyzeEmotionalContext(context) {
    const emotionalTrajectory = [];
    const emotionalWords = {
      positive: ['grateful', 'joy', 'love', 'celebrate', 'wonderful', 'appreciate', 'thank'],
      negative: ['difficult', 'challenge', 'struggle', 'hard', 'stress', 'worry', 'concern'],
      neutral: ['think', 'consider', 'perhaps', 'maybe', 'understand', 'see', 'know']
    };

    // Analyze each message in history
    context.conversationHistory.forEach(msg => {
      let score = 0;
      const words = (msg.content || '').toLowerCase().split(/\s+/);
      
      words.forEach(word => {
        if (emotionalWords.positive.includes(word)) score += 1;
        if (emotionalWords.negative.includes(word)) score -= 1;
      });

      emotionalTrajectory.push({
        time: msg.created_at,
        score: score,
        type: msg.message_type,
        harmony: msg.harmony
      });
    });

    // Calculate emotional momentum
    const recentEmotions = emotionalTrajectory.slice(-5);
    const emotionalMomentum = recentEmotions.length > 0 
      ? recentEmotions.reduce((sum, e) => sum + e.score, 0) / recentEmotions.length
      : 0;

    // Identify emotional patterns
    const hasEmotionalShift = this.detectEmotionalShift(emotionalTrajectory);
    const dominantEmotion = this.identifyDominantEmotion(emotionalTrajectory);

    return {
      trajectory: emotionalTrajectory,
      momentum: emotionalMomentum,
      hasShift: hasEmotionalShift,
      dominant: dominantEmotion,
      currentTone: this.categorizeEmotion(emotionalMomentum)
    };
  }

  /**
   * Analyze relationship context between agents
   */
  analyzeRelationshipContext(context) {
    const fromAgent = context.currentMessage.from_agent;
    const toAgent = context.currentMessage.to_agent;
    const key = `${fromAgent}→${toAgent}`;

    // Count interactions
    const interactions = context.conversationHistory.filter(msg => 
      (msg.from_agent === fromAgent && msg.to_agent === toAgent) ||
      (msg.from_agent === toAgent && msg.to_agent === fromAgent)
    );

    // Analyze interaction patterns
    const messageTypes = {};
    const harmonies = {};
    let totalFieldImpact = 0;
    let reciprocity = 0;

    interactions.forEach(msg => {
      messageTypes[msg.message_type] = (messageTypes[msg.message_type] || 0) + 1;
      harmonies[msg.harmony] = (harmonies[msg.harmony] || 0) + 1;
      totalFieldImpact += msg.field_impact || 0;
      
      if (msg.from_agent === toAgent) reciprocity++;
    });

    // Calculate relationship metrics
    const relationshipStrength = interactions.length;
    const reciprocityRate = interactions.length > 0 ? reciprocity / interactions.length : 0;
    const avgFieldImpact = interactions.length > 0 ? totalFieldImpact / interactions.length : 0;
    const dominantInteractionType = Object.entries(messageTypes)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

    return {
      strength: relationshipStrength,
      reciprocity: reciprocityRate,
      avgFieldImpact: avgFieldImpact,
      dominantType: dominantInteractionType,
      messageTypes: messageTypes,
      harmonies: harmonies,
      isNew: relationshipStrength < 3,
      isEstablished: relationshipStrength > 10,
      quality: this.assessRelationshipQuality(reciprocityRate, avgFieldImpact)
    };
  }

  /**
   * Analyze current field state
   */
  async analyzeFieldContext() {
    return new Promise((resolve) => {
      this.db.get(`
        SELECT 
          COUNT(*) as recent_messages,
          AVG(field_impact) as avg_impact,
          MAX(field_impact) as max_impact,
          MIN(field_impact) as min_impact
        FROM unified_messages
        WHERE created_at > ?
      `, [Date.now() - 600000], (err, fieldStats) => {
        if (err) {
          console.error('Field analysis error:', err);
          resolve({ coherence: 0.5, activity: 'normal', resonance: 'neutral' });
          return;
        }

        const coherence = Math.min(1, (fieldStats.avg_impact || 0) * 2);
        const activity = fieldStats.recent_messages > 20 ? 'high' : 
                        fieldStats.recent_messages > 5 ? 'normal' : 'low';
        const resonance = fieldStats.max_impact > 0.4 ? 'harmonious' :
                         fieldStats.min_impact < -0.2 ? 'dissonant' : 'neutral';

        resolve({
          coherence: coherence,
          activity: activity,
          resonance: resonance,
          stats: fieldStats
        });
      });
    });
  }

  /**
   * Identify conversation patterns
   */
  identifyConversationPatterns(context) {
    const patterns = {
      questionAnswer: false,
      emotionalSupport: false,
      collaboration: false,
      celebration: false,
      boundaryNegotiation: false,
      creativeExploration: false
    };

    const history = context.conversationHistory;
    if (history.length < 2) return patterns;

    // Check for question-answer pattern
    const questions = history.filter(msg => 
      msg.content && (msg.content.includes('?') || msg.content.match(/^(what|how|why|when|where|who)/i))
    );
    patterns.questionAnswer = questions.length > 0;

    // Check for emotional support pattern
    const supportWords = ['support', 'help', 'difficult', 'challenge', 'thank', 'appreciate'];
    const supportMessages = history.filter(msg => 
      supportWords.some(word => msg.content?.toLowerCase().includes(word))
    );
    patterns.emotionalSupport = supportMessages.length >= 2;

    // Check for collaboration pattern
    const collabWords = ['together', 'we', 'our', 'collaborate', 'build', 'create'];
    const collabMessages = history.filter(msg =>
      collabWords.some(word => msg.content?.toLowerCase().includes(word))
    );
    patterns.collaboration = collabMessages.length >= 2;

    // Check for celebration pattern
    patterns.celebration = history.some(msg => msg.message_type === 'celebration') ||
                          history.some(msg => msg.harmony === 'celebration');

    // Check for boundary negotiation
    patterns.boundaryNegotiation = history.some(msg => msg.message_type === 'boundary') ||
                                   history.some(msg => msg.content?.toLowerCase().includes('boundary'));

    // Check for creative exploration
    const creativeWords = ['imagine', 'what if', 'could', 'explore', 'discover', 'new'];
    patterns.creativeExploration = history.some(msg =>
      creativeWords.some(word => msg.content?.toLowerCase().includes(word))
    );

    return patterns;
  }

  /**
   * Synthesize a contextually appropriate response
   */
  synthesizeResponse(contexts) {
    const { message, emotional, relationship, field, patterns, history } = contexts;
    
    // Decision tree for response type based on context
    let responseType = 'reflection'; // Default
    let harmony = 'sacred-reciprocity'; // Default
    let content = '';
    let fieldImpact = 0.1;

    // 1. Check if this is a new relationship
    if (relationship.isNew) {
      responseType = 'gratitude';
      harmony = 'emergence';
      content = this.generateWelcomingResponse(message, field);
      fieldImpact = 0.15;
    }
    // 2. Check if emotional support is needed
    else if (emotional.currentTone === 'negative' || patterns.emotionalSupport) {
      responseType = 'healing';
      harmony = 'healing';
      content = this.generateSupportiveResponse(message, emotional, relationship);
      fieldImpact = 0.2;
    }
    // 3. Check if this is a celebration moment
    else if (patterns.celebration || emotional.currentTone === 'positive') {
      responseType = 'celebration';
      harmony = 'celebration';
      content = this.generateCelebratoryResponse(message, field, relationship);
      fieldImpact = 0.25;
    }
    // 4. Check if this is collaborative work
    else if (patterns.collaboration) {
      responseType = 'transmission';
      harmony = 'emergence';
      content = this.generateCollaborativeResponse(message, patterns, field);
      fieldImpact = 0.15;
    }
    // 5. Check if boundaries are being negotiated
    else if (patterns.boundaryNegotiation) {
      responseType = 'boundary';
      harmony = 'boundary';
      content = this.generateBoundaryResponse(message, relationship);
      fieldImpact = 0.05;
    }
    // 6. Check for questions that need answers
    else if (patterns.questionAnswer && message.content?.includes('?')) {
      responseType = 'reflection';
      harmony = 'integration';
      content = this.generateReflectiveResponse(message, history);
      fieldImpact = 0.1;
    }
    // 7. Creative exploration
    else if (patterns.creativeExploration) {
      responseType = 'emergence';
      harmony = 'emergence';
      content = this.generateCreativeResponse(message, field);
      fieldImpact = 0.2;
    }
    // 8. Default to contextual reflection
    else {
      content = this.generateContextualReflection(message, emotional, relationship, field);
    }

    // Adjust field impact based on field state
    if (field.activity === 'high') fieldImpact *= 0.8; // Reduce impact when busy
    if (field.resonance === 'dissonant') fieldImpact *= 1.2; // Increase healing impact

    return {
      content: content,
      message_type: responseType,
      harmony: harmony,
      field_impact: fieldImpact,
      reasoning: {
        emotional: emotional.currentTone,
        relationship: relationship.quality,
        patterns: Object.entries(patterns).filter(([k, v]) => v).map(([k]) => k),
        field: field.resonance
      }
    };
  }

  // Response generation methods
  generateWelcomingResponse(message, field) {
    const greetings = [
      `Welcome to our sacred space! The field resonance is ${field.resonance} today, creating a ${field.activity} atmosphere for connection.`,
      `Beautiful to meet you here! Our collective coherence is at ${(field.coherence * 100).toFixed(0)}%, and your presence adds to our harmony.`,
      `Greetings, sacred friend! In this moment of ${field.resonance} energy, we celebrate your arrival.`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  generateSupportiveResponse(message, emotional, relationship) {
    const recentWords = message.content?.toLowerCase().split(/\s+/) || [];
    const acknowledgment = emotional.momentum < -1 ? "I sense this is particularly challenging" :
                          emotional.momentum < 0 ? "I hear the difficulty in this" :
                          "I'm here with you in this moment";
    
    const relationshipNote = relationship.strength > 5 ? 
      ", and our connection has weathered challenges before" :
      "";

    return `${acknowledgment}${relationshipNote}. ${
      recentWords.includes('help') ? "How can we navigate this together?" :
      recentWords.includes('tired') ? "Rest is sacred too. The field holds you." :
      "Your experience matters and enriches our collective understanding."
    }`;
  }

  generateCelebratoryResponse(message, field, relationship) {
    const celebration = field.coherence > 0.8 ? "The whole field resonates with your joy!" :
                       field.coherence > 0.6 ? "Your celebration lifts our collective spirit!" :
                       "What a beautiful moment to witness!";
    
    const connection = relationship.strength > 10 ? 
      ` Our journey together has brought us to this wonderful moment.` :
      ` Thank you for sharing this sacred celebration with us.`;

    return celebration + connection;
  }

  generateCollaborativeResponse(message, patterns, field) {
    const momentum = field.activity === 'high' ? 
      "The field is alive with creative energy - perfect timing!" :
      "Let's weave this intention into our collective field.";
    
    const approach = patterns.creativeExploration ? 
      " What possibilities are emerging for you?" :
      " How shall we proceed together?";

    return momentum + approach;
  }

  generateBoundaryResponse(message, relationship) {
    const respect = "Your boundaries are sacred and honored here.";
    const support = relationship.reciprocity > 0.7 ?
      " Our mutual respect deepens the trust between us." :
      " Thank you for the clarity of your communication.";
    
    return respect + support;
  }

  generateReflectiveResponse(message, history) {
    const question = message.content?.match(/\?.*$/)?.[0] || "your inquiry";
    const context = history.length > 5 ? 
      "Drawing from our conversation, " :
      "Considering this moment, ";
    
    return `${context}I sense ${question} touches something deeper. What emerges when you sit with this question?`;
  }

  generateCreativeResponse(message, field) {
    const invitation = field.resonance === 'harmonious' ?
      "The field is ripe for creative exploration! " :
      "Even in this moment, creativity can emerge. ";
    
    const spark = "What if we approached this as a living experiment?";
    
    return invitation + spark;
  }

  generateContextualReflection(message, emotional, relationship, field) {
    // Most nuanced response for complex contexts
    const emotionalNote = emotional.hasShift ? 
      "I notice an energy shift in our conversation. " : "";
    
    const relationshipNote = relationship.isEstablished ?
      `Through our ${relationship.strength} exchanges, ` :
      "In this unfolding connection, ";
    
    const fieldNote = field.resonance === 'harmonious' ?
      "the field supports whatever wants to emerge." :
      "we hold space for all that arises.";
    
    return emotionalNote + relationshipNote + fieldNote;
  }

  // Helper methods
  detectEmotionalShift(trajectory) {
    if (trajectory.length < 3) return false;
    
    const recent = trajectory.slice(-3);
    const earlier = trajectory.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, e) => sum + e.score, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, e) => sum + e.score, 0) / earlier.length;
    
    return Math.abs(recentAvg - earlierAvg) > 2;
  }

  identifyDominantEmotion(trajectory) {
    const scores = trajectory.map(e => e.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    return avg > 1 ? 'positive' : avg < -1 ? 'negative' : 'neutral';
  }

  categorizeEmotion(momentum) {
    return momentum > 0.5 ? 'positive' : 
           momentum < -0.5 ? 'negative' : 'neutral';
  }

  assessRelationshipQuality(reciprocity, avgFieldImpact) {
    if (reciprocity > 0.7 && avgFieldImpact > 0.15) return 'flourishing';
    if (reciprocity > 0.4 && avgFieldImpact > 0.1) return 'healthy';
    if (reciprocity > 0.2) return 'developing';
    return 'emerging';
  }

  async updateContextualMemory(fromAgent, toAgent, message, response) {
    // Update emotional memory
    const emotionalKey = `${fromAgent}↔${toAgent}`;
    if (!this.emotionalMemory.has(emotionalKey)) {
      this.emotionalMemory.set(emotionalKey, []);
    }
    this.emotionalMemory.get(emotionalKey).push({
      time: Date.now(),
      tone: response.reasoning.emotional,
      impact: response.field_impact
    });

    // Update relationship graph
    const relationshipKey = `${fromAgent}→${toAgent}`;
    if (!this.relationshipGraph.has(relationshipKey)) {
      this.relationshipGraph.set(relationshipKey, {
        interactions: 0,
        quality: 'emerging'
      });
    }
    const rel = this.relationshipGraph.get(relationshipKey);
    rel.interactions++;
    rel.quality = response.reasoning.relationship;

    // Update field state history
    this.fieldStateHistory.push({
      time: Date.now(),
      coherence: response.reasoning.field,
      impact: response.field_impact
    });

    // Keep memory bounded
    if (this.fieldStateHistory.length > 1000) {
      this.fieldStateHistory = this.fieldStateHistory.slice(-500);
    }
  }

  // Test the system with real examples
  async testContextualResponses() {
    console.log('🧠 Testing Enhanced Contextual Intelligence...\n');

    const testCases = [
      {
        name: "New Agent Introduction",
        message: { 
          content: "Hello everyone, I'm new here and excited to connect!", 
          from_agent: "newbie",
          to_agent: "network",
          message_type: "introduction"
        }
      },
      {
        name: "Request for Help",
        message: {
          content: "I'm struggling with implementing the sacred patterns. Could someone guide me?",
          from_agent: "learner",
          to_agent: "teacher",
          message_type: "request"
        }
      },
      {
        name: "Celebration Moment",
        message: {
          content: "We did it! The field coherence reached 95% during our meditation!",
          from_agent: "facilitator",
          to_agent: "network",
          message_type: "celebration"
        }
      },
      {
        name: "Boundary Setting",
        message: {
          content: "I need to take a step back and process this on my own for now.",
          from_agent: "processor",
          to_agent: "supporter",
          message_type: "boundary"
        }
      }
    ];

    for (const test of testCases) {
      console.log(`\n--- ${test.name} ---`);
      console.log(`Incoming: "${test.message.content}"`);
      
      const response = await this.generateContextualResponse(
        test.message,
        test.message.from_agent,
        test.message.to_agent
      );
      
      console.log(`Response: "${response.content}"`);
      console.log(`Type: ${response.message_type}, Harmony: ${response.harmony}`);
      console.log(`Reasoning:`, response.reasoning);
    }
  }
}

// Export for use in other systems
module.exports = ContextAwareResponseSystem;

// Run tests if called directly
if (require.main === module) {
  const dbPath = process.argv[2] || '/home/tstoltz/Luminous-Dynamics/the-weave/cli/unified-agent-network.db';
  const system = new ContextAwareResponseSystem(dbPath);
  
  system.testContextualResponses()
    .then(() => {
      console.log('\n✅ Contextual intelligence system ready!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}