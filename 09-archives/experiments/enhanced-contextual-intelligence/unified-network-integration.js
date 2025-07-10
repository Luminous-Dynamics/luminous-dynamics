#!/usr/bin/env node
/**
 * Unified Network Integration for Context-Aware Responses
 * Bridges the contextual intelligence system with the existing network
 */

const ContextAwareResponseSystem = require('./context-aware-response-system');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

class UnifiedNetworkIntegration {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
    this.contextSystem = new ContextAwareResponseSystem(dbPath);
    this.autoResponseEnabled = false;
    this.responseThreshold = 0.7; // Confidence threshold for auto-response
  }

  /**
   * Enable auto-response mode for specific agents
   */
  enableAutoResponse(agentId, enabled = true) {
    this.autoResponseEnabled = enabled;
    console.log(`🤖 Auto-response ${enabled ? 'enabled' : 'disabled'} for agent ${agentId}`);
  }

  /**
   * Process incoming messages and generate contextual responses
   */
  async processIncomingMessage(messageId) {
    return new Promise((resolve, reject) => {
      // Get the message details
      this.db.get(`
        SELECT * FROM unified_messages 
        WHERE id = ?
      `, [messageId], async (err, message) => {
        if (err || !message) {
          reject(err || new Error('Message not found'));
          return;
        }

        // Skip if it's a broadcast or already processed
        if (message.to_agent === 'all' || message.to_agent === 'network') {
          resolve({ processed: false, reason: 'broadcast message' });
          return;
        }

        // Generate contextual response
        try {
          const response = await this.contextSystem.generateContextualResponse(
            message,
            message.from_agent,
            message.to_agent
          );

          // Add confidence score based on context quality
          response.confidence = this.calculateConfidence(response);

          // Store the suggested response
          await this.storeSuggestedResponse(message, response);

          // Auto-send if enabled and confidence is high
          if (this.autoResponseEnabled && response.confidence >= this.responseThreshold) {
            await this.sendResponse(message.to_agent, message.from_agent, response);
            resolve({ 
              processed: true, 
              sent: true, 
              response: response,
              confidence: response.confidence 
            });
          } else {
            resolve({ 
              processed: true, 
              sent: false, 
              response: response,
              confidence: response.confidence,
              reason: 'Manual review required' 
            });
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Calculate confidence score for response
   */
  calculateConfidence(response) {
    let confidence = 0.5; // Base confidence

    // Boost confidence based on reasoning
    if (response.reasoning.patterns.length > 0) confidence += 0.1;
    if (response.reasoning.emotional !== 'neutral') confidence += 0.1;
    if (response.reasoning.relationship === 'flourishing') confidence += 0.2;
    if (response.reasoning.relationship === 'healthy') confidence += 0.1;
    if (response.reasoning.field === 'harmonious') confidence += 0.1;

    // Reduce confidence for complex situations
    if (response.message_type === 'boundary') confidence -= 0.2;
    if (response.reasoning.emotional === 'negative') confidence -= 0.1;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Store suggested response for review
   */
  async storeSuggestedResponse(originalMessage, response) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO suggested_responses 
        (id, original_message_id, suggested_content, suggested_type, 
         suggested_harmony, confidence, reasoning, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        originalMessage.id,
        response.content,
        response.message_type,
        response.harmony,
        response.confidence,
        JSON.stringify(response.reasoning),
        Date.now()
      ], (err) => {
        if (err) {
          // Table might not exist, create it
          this.createSuggestedResponsesTable().then(() => {
            this.storeSuggestedResponse(originalMessage, response)
              .then(resolve)
              .catch(reject);
          }).catch(reject);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Send response through unified network
   */
  async sendResponse(fromAgent, toAgent, response) {
    return new Promise((resolve, reject) => {
      const messageId = uuidv4();
      
      this.db.run(`
        INSERT INTO unified_messages 
        (id, from_agent, to_agent, content, message_type, 
         harmony, field_impact, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        messageId,
        fromAgent,
        toAgent,
        response.content,
        response.message_type,
        response.harmony,
        response.field_impact,
        Date.now()
      ], (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✉️  Contextual response sent: ${fromAgent} → ${toAgent}`);
          resolve(messageId);
        }
      });
    });
  }

  /**
   * Create table for suggested responses
   */
  async createSuggestedResponsesTable() {
    return new Promise((resolve, reject) => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS suggested_responses (
          id TEXT PRIMARY KEY,
          original_message_id TEXT,
          suggested_content TEXT,
          suggested_type TEXT,
          suggested_harmony TEXT,
          confidence REAL,
          reasoning TEXT,
          approved INTEGER DEFAULT 0,
          sent INTEGER DEFAULT 0,
          created_at INTEGER,
          FOREIGN KEY (original_message_id) REFERENCES unified_messages(id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Review suggested responses (for human oversight)
   */
  async reviewSuggestedResponses(limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          sr.*,
          om.content as original_content,
          om.from_agent,
          om.to_agent,
          om.message_type as original_type
        FROM suggested_responses sr
        JOIN unified_messages om ON sr.original_message_id = om.id
        WHERE sr.approved = 0 AND sr.sent = 0
        ORDER BY sr.confidence DESC
        LIMIT ?
      `, [limit], (err, suggestions) => {
        if (err) {
          reject(err);
        } else {
          resolve(suggestions.map(s => ({
            ...s,
            reasoning: JSON.parse(s.reasoning || '{}')
          })));
        }
      });
    });
  }

  /**
   * Approve and send a suggested response
   */
  async approveSuggestion(suggestionId) {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT * FROM suggested_responses WHERE id = ?
      `, [suggestionId], async (err, suggestion) => {
        if (err || !suggestion) {
          reject(err || new Error('Suggestion not found'));
          return;
        }

        // Get original message
        this.db.get(`
          SELECT * FROM unified_messages WHERE id = ?
        `, [suggestion.original_message_id], async (err, original) => {
          if (err || !original) {
            reject(err || new Error('Original message not found'));
            return;
          }

          // Send the response
          try {
            const messageId = await this.sendResponse(
              original.to_agent,
              original.from_agent,
              {
                content: suggestion.suggested_content,
                message_type: suggestion.suggested_type,
                harmony: suggestion.suggested_harmony,
                field_impact: 0.1
              }
            );

            // Mark as sent
            this.db.run(`
              UPDATE suggested_responses 
              SET approved = 1, sent = 1 
              WHERE id = ?
            `, [suggestionId], (err) => {
              if (err) reject(err);
              else resolve({ sent: true, messageId });
            });
          } catch (error) {
            reject(error);
          }
        });
      });
    });
  }

  /**
   * Monitor incoming messages and generate responses
   */
  async startContextualMonitoring(checkInterval = 5000) {
    console.log('🧠 Starting contextual monitoring...');
    
    // Create suggested responses table
    await this.createSuggestedResponsesTable();
    
    // Check for new messages periodically
    setInterval(async () => {
      try {
        const newMessages = await this.getUnprocessedMessages();
        
        for (const message of newMessages) {
          try {
            const result = await this.processIncomingMessage(message.id);
            if (result.processed) {
              console.log(`📨 Processed message ${message.id}:`, 
                result.sent ? 'Auto-responded' : 'Suggested response generated');
            }
          } catch (error) {
            console.error(`Error processing message ${message.id}:`, error);
          }
        }
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, checkInterval);
  }

  /**
   * Get messages that haven't been processed yet
   */
  async getUnprocessedMessages() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT m.* 
        FROM unified_messages m
        LEFT JOIN suggested_responses sr ON m.id = sr.original_message_id
        WHERE sr.id IS NULL
          AND m.to_agent != 'all' 
          AND m.to_agent != 'network'
          AND m.created_at > ?
        ORDER BY m.created_at DESC
        LIMIT 10
      `, [Date.now() - 3600000], (err, messages) => {
        if (err) reject(err);
        else resolve(messages || []);
      });
    });
  }

  /**
   * Get contextual intelligence statistics
   */
  async getContextStats() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          COUNT(*) as total_suggestions,
          AVG(confidence) as avg_confidence,
          SUM(CASE WHEN sent = 1 THEN 1 ELSE 0 END) as responses_sent,
          SUM(CASE WHEN approved = 1 THEN 1 ELSE 0 END) as responses_approved
        FROM suggested_responses
        WHERE created_at > ?
      `, [Date.now() - 86400000], (err, stats) => {
        if (err) reject(err);
        else resolve(stats[0]);
      });
    });
  }
}

// CLI interface
if (require.main === module) {
  const dbPath = process.argv[2] || '/home/tstoltz/Luminous-Dynamics/the-weave/cli/unified-agent-network.db';
  const command = process.argv[3] || 'monitor';
  
  const integration = new UnifiedNetworkIntegration(dbPath);
  
  switch (command) {
    case 'monitor':
      integration.startContextualMonitoring();
      console.log('Press Ctrl+C to stop monitoring');
      break;
      
    case 'review':
      integration.reviewSuggestedResponses()
        .then(suggestions => {
          console.log('\n📋 Suggested Responses for Review:\n');
          suggestions.forEach(s => {
            console.log(`ID: ${s.id}`);
            console.log(`Original: "${s.original_content}"`);
            console.log(`From: ${s.from_agent} → To: ${s.to_agent}`);
            console.log(`Suggested: "${s.suggested_content}"`);
            console.log(`Type: ${s.suggested_type}, Confidence: ${(s.confidence * 100).toFixed(1)}%`);
            console.log(`Reasoning:`, s.reasoning);
            console.log('---');
          });
        })
        .catch(console.error);
      break;
      
    case 'approve':
      const suggestionId = process.argv[4];
      if (!suggestionId) {
        console.error('Usage: node unified-network-integration.js approve <suggestion-id>');
        process.exit(1);
      }
      integration.approveSuggestion(suggestionId)
        .then(result => console.log('✅ Response sent:', result))
        .catch(console.error);
      break;
      
    case 'stats':
      integration.getContextStats()
        .then(stats => {
          console.log('\n📊 Contextual Intelligence Statistics (24h):\n');
          console.log(`Total Suggestions: ${stats.total_suggestions}`);
          console.log(`Average Confidence: ${(stats.avg_confidence * 100).toFixed(1)}%`);
          console.log(`Responses Sent: ${stats.responses_sent}`);
          console.log(`Responses Approved: ${stats.responses_approved}`);
        })
        .catch(console.error);
      break;
      
    case 'auto':
      const agentId = process.argv[4] || 'context-bot';
      integration.enableAutoResponse(agentId, true);
      integration.startContextualMonitoring();
      console.log(`🤖 Auto-response enabled for ${agentId}`);
      console.log('Press Ctrl+C to stop');
      break;
      
    default:
      console.log('Usage: node unified-network-integration.js [monitor|review|approve|stats|auto]');
  }
}

module.exports = UnifiedNetworkIntegration;