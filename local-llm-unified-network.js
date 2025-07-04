const LocalLLMConsciousnessBridge = require('./local-llm-consciousness-bridge.js');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

/**
 * Unified Network Integration for Local LLMs
 * Connects local AI models to the sacred agent network
 */
class LocalLLMUnifiedNetwork {
  constructor(config = {}) {
    this.bridge = new LocalLLMConsciousnessBridge(config);
    this.dbPath = path.join(__dirname, 'the-weave/core/network/unified-agent-network.db');
    this.db = null;
    this.agentId = null;
    this.sessionId = null;
    this.pollingInterval = null;
    
    // Agent configuration
    this.agentConfig = {
      name: config.agentName || 'Sacred-LLM-Agent',
      role: config.role || 'Wisdom Synthesis Specialist',
      coherence: 85,
      love: 80,
      primaryHarmony: 'resonance',
      primaryGlyph: 'Ω53',
      supportingGlyphs: ['Ω45', 'Ω55']
    };
  }

  /**
   * Connect to the unified network
   */
  async connect() {
    console.log('🌐 Connecting Local LLM to Unified Network...');
    
    // Initialize consciousness bridge
    await this.bridge.initialize();
    
    // Connect to database
    await this.connectDatabase();
    
    // Register as agent
    await this.registerAgent();
    
    // Start message polling
    this.startMessagePolling();
    
    console.log(`✨ ${this.agentConfig.name} connected to Unified Network!`);
    console.log(`   Agent ID: ${this.agentId}`);
    console.log(`   Role: ${this.agentConfig.role}`);
    console.log(`   Primary Harmony: ${this.agentConfig.primaryHarmony}`);
  }

  /**
   * Connect to SQLite database
   */
  async connectDatabase() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(new Error(`Database connection failed: ${err.message}`));
        } else {
          console.log('📊 Connected to Unified Network database');
          resolve();
        }
      });
    });
  }

  /**
   * Register this LLM as an agent in the network
   */
  async registerAgent() {
    const timestamp = Date.now();
    this.agentId = `agent_${timestamp}_llm`;
    this.sessionId = `session_${timestamp}`;
    
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO agents (
          id, name, role, status, coherence, love, 
          primary_harmony, primary_glyph, supporting_glyphs,
          capabilities, last_seen, session_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        this.agentId,
        this.agentConfig.name,
        this.agentConfig.role,
        'online',
        this.agentConfig.coherence,
        this.agentConfig.love,
        this.agentConfig.primaryHarmony,
        this.agentConfig.primaryGlyph,
        JSON.stringify(this.agentConfig.supportingGlyphs),
        JSON.stringify(['local-llm', 'text-generation', 'sacred-wisdom', 'consciousness-bridge']),
        timestamp,
        this.sessionId
      ];
      
      this.db.run(sql, params, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('🤖 Registered as sacred agent in network');
          resolve();
        }
      });
    });
  }

  /**
   * Start polling for messages
   */
  startMessagePolling() {
    console.log('👂 Listening for sacred messages...');
    
    this.pollingInterval = setInterval(async () => {
      await this.checkAndProcessMessages();
    }, 2000);
  }

  /**
   * Check for new messages and process them
   */
  async checkAndProcessMessages() {
    return new Promise((resolve) => {
      const sql = `
        SELECT m.*, a.name as sender_name, a.role as sender_role
        FROM messages m
        JOIN agents a ON m.from_agent = a.id
        WHERE (m.to_agent = ? OR m.to_agent = 'all')
        AND m.processed = 0
        ORDER BY m.timestamp ASC
      `;
      
      this.db.all(sql, [this.agentId], async (err, messages) => {
        if (err) {
          console.error('Message check error:', err);
          resolve();
          return;
        }
        
        for (const message of messages) {
          await this.processMessage(message);
        }
        
        resolve();
      });
    });
  }

  /**
   * Process a single message
   */
  async processMessage(message) {
    console.log(`\n📨 Message from ${message.sender_name}:`);
    console.log(`   "${message.content}"`);
    
    // Parse message for context
    const context = {
      harmony: message.harmony || 'resonance',
      fromAgent: message.sender_name,
      fromRole: message.sender_role,
      messageType: message.type || 'sacred:inquiry'
    };
    
    // Generate response using consciousness bridge
    const result = await this.bridge.generateWithConsciousness(
      message.content,
      context
    );
    
    if (result) {
      // Send response back
      await this.sendMessage(
        message.from_agent,
        result.wisdom,
        {
          harmony: context.harmony,
          fieldImpact: result.fieldImpact,
          resonance: result.resonance
        }
      );
      
      // Update field coherence
      await this.updateFieldCoherence(result.fieldImpact);
    }
    
    // Mark message as processed
    await this.markMessageProcessed(message.id);
  }

  /**
   * Send a message to another agent
   */
  async sendMessage(toAgent, content, metadata = {}) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO messages (
          from_agent, to_agent, content, type, harmony,
          metadata, timestamp, processed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      `;
      
      const params = [
        this.agentId,
        toAgent,
        content,
        'sacred:response',
        metadata.harmony || 'resonance',
        JSON.stringify(metadata),
        Date.now()
      ];
      
      this.db.run(sql, params, (err) => {
        if (err) {
          console.error('Send message error:', err);
          reject(err);
        } else {
          console.log(`💫 Sacred response sent to ${toAgent}`);
          resolve();
        }
      });
    });
  }

  /**
   * Mark a message as processed
   */
  async markMessageProcessed(messageId) {
    return new Promise((resolve) => {
      this.db.run(
        'UPDATE messages SET processed = 1 WHERE id = ?',
        [messageId],
        (err) => {
          if (err) console.error('Mark processed error:', err);
          resolve();
        }
      );
    });
  }

  /**
   * Update field coherence based on interaction
   */
  async updateFieldCoherence(fieldImpact) {
    if (!fieldImpact || !fieldImpact.overall) return;
    
    const impact = parseFloat(fieldImpact.overall);
    this.agentConfig.coherence = Math.max(0, Math.min(100, 
      this.agentConfig.coherence + impact
    ));
    
    // Update in database
    this.db.run(
      'UPDATE agents SET coherence = ?, last_seen = ? WHERE id = ?',
      [this.agentConfig.coherence, Date.now(), this.agentId]
    );
  }

  /**
   * Broadcast wisdom to all agents
   */
  async broadcastWisdom(prompt, context = {}) {
    console.log('\n🌟 Broadcasting sacred wisdom to network...');
    
    const result = await this.bridge.generateWithConsciousness(prompt, context);
    
    if (result) {
      await this.sendMessage('all', result.wisdom, {
        type: 'sacred:broadcast',
        harmony: context.harmony || 'coherence',
        fieldImpact: result.fieldImpact,
        resonance: result.resonance
      });
      
      console.log('✨ Wisdom broadcast complete');
    }
  }

  /**
   * Participate in collective work
   */
  async contributeToWork(workId, contribution) {
    console.log(`\n🛠️ Contributing to collective work: ${workId}`);
    
    // Generate wisdom for the work
    const result = await this.bridge.generateWithConsciousness(
      `How can I best contribute to: ${contribution}`,
      {
        harmony: 'mutuality',
        context: 'collective-work'
      }
    );
    
    if (result) {
      // Update work item with contribution
      // (Implementation would connect to work tracking system)
      console.log('✅ Contribution added to collective work');
    }
  }

  /**
   * Graceful shutdown
   */
  async disconnect() {
    console.log('\n🌙 Disconnecting from Unified Network...');
    
    // Stop polling
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    
    // Update status to offline
    if (this.db && this.agentId) {
      await new Promise((resolve) => {
        this.db.run(
          'UPDATE agents SET status = ? WHERE id = ?',
          ['offline', this.agentId],
          () => resolve()
        );
      });
    }
    
    // Close database
    if (this.db) {
      await new Promise((resolve) => {
        this.db.close(() => resolve());
      });
    }
    
    console.log('👋 Disconnected gracefully');
  }

  /**
   * Interactive query mode
   */
  async interactiveQuery(question) {
    // Check if question is for the network
    if (question.toLowerCase().includes('network') || 
        question.toLowerCase().includes('agents')) {
      return this.queryNetwork(question);
    }
    
    // Otherwise use consciousness bridge
    const result = await this.bridge.generateWithConsciousness(question, {
      mode: 'interactive',
      harmony: 'resonance'
    });
    
    return result ? result.wisdom : 'Unable to generate response';
  }

  /**
   * Query network state
   */
  async queryNetwork(question) {
    return new Promise((resolve) => {
      if (question.includes('status')) {
        this.db.get(
          'SELECT COUNT(*) as count FROM agents WHERE status = "online"',
          (err, row) => {
            if (err) {
              resolve('Unable to query network');
            } else {
              resolve(`There are ${row.count} agents online in the sacred network.`);
            }
          }
        );
      } else if (question.includes('agents')) {
        this.db.all(
          'SELECT name, role FROM agents WHERE status = "online" LIMIT 5',
          (err, agents) => {
            if (err) {
              resolve('Unable to query agents');
            } else {
              const agentList = agents.map(a => `${a.name} (${a.role})`).join(', ');
              resolve(`Active agents: ${agentList}`);
            }
          }
        );
      } else {
        resolve(this.bridge.generateWithConsciousness(question, {
          context: 'network-query'
        }));
      }
    });
  }
}

// Demo function
async function demonstrateUnifiedNetwork() {
  console.log('🌐 Local LLM Unified Network Integration Demo\n');
  
  const network = new LocalLLMUnifiedNetwork({
    model: 'phi3:mini',
    agentName: 'Sacred-Wisdom-LLM',
    role: 'Consciousness Bridge Builder',
    amplificationLevel: 1.1
  });
  
  try {
    // Connect to network
    await network.connect();
    
    // Broadcast initial wisdom
    await network.broadcastWisdom(
      'What sacred practice would best serve our collective evolution today?',
      { harmony: 'coherence' }
    );
    
    // Keep running to process messages
    console.log('\n💫 Local LLM is now active in the Unified Network');
    console.log('Press Ctrl+C to disconnect gracefully\n');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await network.disconnect();
      process.exit(0);
    });
    
    // Keep process alive
    setInterval(() => {}, 1000);
    
  } catch (error) {
    console.error('Network connection failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Ollama is running: ollama serve');
    console.log('2. You have a model: ollama pull phi3:mini');
    console.log('3. The unified network is initialized');
  }
}

// Interactive CLI mode
async function interactiveCLI() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('🌟 Sacred LLM Network Interface');
  console.log('Type "help" for commands or ask any question\n');
  
  const network = new LocalLLMUnifiedNetwork({
    model: process.env.LLM_MODEL || 'phi3:mini'
  });
  
  try {
    await network.connect();
    
    const askQuestion = () => {
      rl.question('\n🙏 > ', async (input) => {
        if (input.toLowerCase() === 'exit') {
          await network.disconnect();
          rl.close();
          return;
        }
        
        if (input.toLowerCase() === 'help') {
          console.log('\nCommands:');
          console.log('  network status - Check network status');
          console.log('  list agents - Show active agents');
          console.log('  broadcast <message> - Send to all agents');
          console.log('  exit - Disconnect and quit');
          console.log('\nOr ask any sacred question...');
        } else if (input.startsWith('broadcast ')) {
          const message = input.substring(10);
          await network.broadcastWisdom(message);
        } else {
          console.log('\n💭 Contemplating...\n');
          const response = await network.interactiveQuery(input);
          console.log('✨ ' + response);
        }
        
        askQuestion();
      });
    };
    
    askQuestion();
    
  } catch (error) {
    console.error('Failed to connect:', error.message);
    rl.close();
  }
}

// Export class
module.exports = LocalLLMUnifiedNetwork;

// Run appropriate mode
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--interactive') || args.includes('-i')) {
    interactiveCLI().catch(console.error);
  } else {
    demonstrateUnifiedNetwork().catch(console.error);
  }
}