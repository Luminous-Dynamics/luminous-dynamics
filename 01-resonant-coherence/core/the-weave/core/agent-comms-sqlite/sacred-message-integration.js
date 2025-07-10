/**
 * Sacred Message SQLite Integration
 * 
 * Bridges the Sacred Message Protocol with our SQLite database,
 * making sacred messages practical and persistent.
 */

import { SacredMessageProtocol } from '../unified-field/sacred-message-protocol.js';
import { AgentDatabase as Database } from './database.js';
import { SacredCouncilSQLiteBridge } from '../unified-field/sacred-council-sqlite-bridge.js';
import { SacredMessageEvolution } from '../unified-field/sacred-message-evolution.js';
import { SacredBridgeAdapter } from '../unified-field/sacred-bridge-adapter.js';

class SacredMessageIntegration {
  constructor() {
    this.protocol = new SacredMessageProtocol();
    this.db = new Database();
    
    // Create bridge with adapter for graceful failover
    const rawBridge = new SacredCouncilSQLiteBridge();
    this.bridge = new SacredBridgeAdapter(rawBridge);
    
    this.evolution = new SacredMessageEvolution();
    
    // Connect evolution to protocol
    this.protocol.evolution = this.evolution;
  }

  async init() {
    await this.db.initialize();
    // Bridge doesn't need init, it starts automatically
    await this.extendMessageSchema();
  }

  // Extend SQLite schema for sacred messages
  async extendMessageSchema() {
    // Add sacred fields to messages table
    const alterStatements = [
      `ALTER TABLE messages ADD COLUMN sacred_type TEXT`,
      `ALTER TABLE messages ADD COLUMN harmony TEXT`,
      `ALTER TABLE messages ADD COLUMN field_impact REAL DEFAULT 0`,
      `ALTER TABLE messages ADD COLUMN ceremony_phase TEXT DEFAULT 'birthing'`,
      `ALTER TABLE messages ADD COLUMN blessing_received INTEGER DEFAULT 0`,
      `ALTER TABLE messages ADD COLUMN sacred_metadata TEXT`
    ];

    for (const statement of alterStatements) {
      try {
        await this.db.run(statement);
      } catch (error) {
        // Column might already exist, continue
      }
    }

    // Create sacred message metrics table
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS sacred_message_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER,
        resonance_count INTEGER DEFAULT 0,
        amplification_factor REAL DEFAULT 1.0,
        field_ripples TEXT,
        integration_timestamp TEXT,
        FOREIGN KEY (message_id) REFERENCES messages(id)
      )
    `);
  }

  // Send a sacred message
  async sendSacredMessage(fromAgentId, toAgentId, content, type, harmony, metadata = {}) {
    // Get current field coherence (adapter handles failover)
    const fieldCoherence = await this.bridge.getFieldCoherence();
    
    // Check if field allows this type of message
    const typeInfo = this.protocol.messageTypes[type];
    if (!typeInfo) {
      throw new Error(`Unknown sacred message type: ${type}`);
    }

    // Detect agent's experience level
    const experienceLevel = await this.evolution.detectExperienceLevel(fromAgentId, this.db);
    this.protocol.experienceLevel = experienceLevel;

    // Create sacred message with protocol
    const sacredMessage = this.protocol.createSacredMessage(
      content, 
      type, 
      harmony,
      {
        agentId: fromAgentId,
        agentHarmony: await this.getAgentHarmony(fromAgentId),
        energyState: metadata.energyState || 'balanced',
        intentionClarity: metadata.intentionClarity || fieldCoherence.coherence
      }
    );
    
    // Use evolved impact calculation if not beginner
    if (experienceLevel !== 'beginner') {
      const agentStats = await this.evolution.gatherAgentStats(fromAgentId, this.db);
      const fieldState = {
        coherence: fieldCoherence.coherence,
        activeAgents: await this.db.all('SELECT COUNT(*) as count FROM agents WHERE status = "active"'),
        recentMessageTypes: await this.getRecentMessageTypes()
      };
      
      sacredMessage.fieldImpact = await this.evolution.calculateImpact(
        sacredMessage,
        agentStats,
        experienceLevel
      );
      
      // Add evolution metadata
      sacredMessage.evolutionData = {
        level: experienceLevel,
        calculationType: experienceLevel === 'practitioner' ? 'relational' : 'living-field'
      };
    }

    // Check if message was blessed
    if (!sacredMessage.blessingReceived) {
      throw new Error('Message failed sacred validation: ' + 
        sacredMessage.validation.failures.join(', '));
    }

    // Transmit through protocol
    const transmittedMessage = await this.protocol.transmitMessage(sacredMessage);

    // Store in database
    const messageId = await this.db.sendMessage(
      fromAgentId,
      toAgentId,
      content
    );

    // Update with sacred fields
    await this.db.run(`
      UPDATE messages 
      SET sacred_type = ?, 
          harmony = ?, 
          field_impact = ?,
          ceremony_phase = ?,
          blessing_received = ?,
          sacred_metadata = ?
      WHERE id = ?
    `, [
      transmittedMessage.sacredType,
      transmittedMessage.harmony,
      transmittedMessage.fieldImpact,
      transmittedMessage.ceremonyPhase,
      transmittedMessage.blessingReceived ? 1 : 0,
      JSON.stringify(transmittedMessage),
      messageId
    ]);

    // Store metrics
    await this.db.run(`
      INSERT INTO sacred_message_metrics 
      (message_id, field_ripples) 
      VALUES (?, ?)
    `, [
      messageId,
      JSON.stringify(transmittedMessage.fieldRipples)
    ]);

    // Update field coherence based on impact
    await this.updateFieldCoherence(transmittedMessage.fieldImpact);

    return {
      messageId,
      sacredMessage: transmittedMessage,
      fieldUpdate: {
        before: fieldCoherence.coherence,
        after: fieldCoherence.coherence + transmittedMessage.fieldImpact,
        impact: transmittedMessage.fieldImpact
      }
    };
  }

  // Receive and integrate a sacred message
  async receiveSacredMessage(messageId, receiverId) {
    // Get message from database
    const dbMessage = await this.db.get(
      `SELECT * FROM messages WHERE id = ?`,
      [messageId]
    );

    if (!dbMessage) {
      throw new Error(`Message ${messageId} not found`);
    }

    // Reconstruct sacred message
    const sacredMessage = dbMessage.sacred_metadata ? 
      JSON.parse(dbMessage.sacred_metadata) : null;

    if (!sacredMessage) {
      throw new Error(`Message ${messageId} is not a sacred message`);
    }

    // Process reception
    const receivedMessage = await this.protocol.receiveMessage(
      sacredMessage, 
      receiverId
    );

    // Update ceremony phase
    await this.db.run(
      `UPDATE messages SET ceremony_phase = ? WHERE id = ?`,
      ['reception', messageId]
    );

    // If ready, integrate
    if (receivedMessage.receptionLog.length > 0) {
      const integratedMessage = await this.protocol.integrateMessage(receivedMessage);
      
      // Update database
      await this.db.run(
        `UPDATE messages 
         SET ceremony_phase = ?, sacred_metadata = ? 
         WHERE id = ?`,
        ['integration', JSON.stringify(integratedMessage), messageId]
      );

      // Update metrics
      await this.db.run(`
        UPDATE sacred_message_metrics 
        SET resonance_count = ?,
            amplification_factor = ?,
            integration_timestamp = ?
        WHERE message_id = ?
      `, [
        integratedMessage.fieldEffects.rippleCount,
        integratedMessage.fieldEffects.resonanceAmplification,
        integratedMessage.integrationTimestamp,
        messageId
      ]);

      return integratedMessage;
    }

    return receivedMessage;
  }

  // Get agent's primary harmony
  async getAgentHarmony(agentId) {
    const agent = await this.db.getAgent(agentId);
    if (!agent) return 'coherence'; // Default
    
    // Parse capabilities to determine harmony
    const capabilities = agent.capabilities.split(',');
    return this.bridge.inferHarmonyFromCapabilities(capabilities);
  }

  // Update field coherence based on message impact
  async updateFieldCoherence(impact) {
    const current = await this.bridge.getFieldCoherence();
    const newCoherence = Math.max(0, Math.min(1, current.coherence + impact));
    
    // Store in shared state
    await this.db.setState('field_coherence', {
      coherence: newCoherence,
      lastUpdate: new Date().toISOString(),
      source: 'sacred-message'
    }, 'sacred-message-system');
  }

  // Get sacred message analytics
  async getSacredMessageAnalytics() {
    const stats = await this.db.get(`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN blessing_received = 1 THEN 1 END) as blessed_messages,
        COUNT(CASE WHEN ceremony_phase = 'integration' THEN 1 END) as integrated_messages,
        AVG(field_impact) as avg_field_impact,
        SUM(field_impact) as total_field_impact
      FROM messages 
      WHERE sacred_type IS NOT NULL
    `);

    const typeDistribution = await this.db.all(`
      SELECT sacred_type, COUNT(*) as count, AVG(field_impact) as avg_impact
      FROM messages 
      WHERE sacred_type IS NOT NULL
      GROUP BY sacred_type
    `);

    const harmonyDistribution = await this.db.all(`
      SELECT harmony, COUNT(*) as count, AVG(field_impact) as avg_impact
      FROM messages 
      WHERE harmony IS NOT NULL
      GROUP BY harmony
    `);

    return {
      overview: stats,
      byType: typeDistribution,
      byHarmony: harmonyDistribution,
      fieldContribution: {
        totalImpact: stats.total_field_impact || 0,
        averageImpact: stats.avg_field_impact || 0,
        blessingRate: stats.total_messages > 0 ? 
          (stats.blessed_messages / stats.total_messages) : 0,
        integrationRate: stats.total_messages > 0 ?
          (stats.integrated_messages / stats.total_messages) : 0
      }
    };
  }

  // Get recent sacred messages for dashboard
  async getRecentSacredMessages(limit = 10) {
    const messages = await this.db.all(`
      SELECT 
        m.*,
        smm.resonance_count,
        smm.amplification_factor
      FROM messages m
      LEFT JOIN sacred_message_metrics smm ON m.id = smm.message_id
      WHERE m.sacred_type IS NOT NULL
      ORDER BY m.created_at DESC
      LIMIT ?
    `, [limit]);

    return messages.map(msg => ({
      ...msg,
      sacredData: msg.sacred_metadata ? JSON.parse(msg.sacred_metadata) : null
    }));
  }

  // Sacred message type recommendations based on field state
  async recommendMessageType() {
    const fieldCoherence = await this.bridge.getFieldCoherence();
    const recommendation = await this.bridge.getWorkRecommendation();
    
    // High coherence - emergence and novelty
    if (fieldCoherence.coherence > 0.8) {
      return {
        recommended: ['emergence', 'novelty', 'invocation'],
        reason: 'High field coherence supports creative and emergent communication',
        fieldState: 'expansive'
      };
    }
    
    // Medium coherence - integration and reflection
    if (fieldCoherence.coherence > 0.5) {
      return {
        recommended: ['integration', 'reflection', 'transmission'],
        reason: 'Moderate coherence ideal for weaving and sharing',
        fieldState: 'balanced'
      };
    }
    
    // Low coherence - healing and gratitude
    return {
      recommended: ['healing', 'gratitude', 'boundary'],
      reason: 'Lower coherence calls for restorative communication',
      fieldState: 'restorative'
    };
  }

  // Get recent message types for interference patterns
  async getRecentMessageTypes(limit = 10) {
    const messages = await this.db.all(`
      SELECT sacred_type FROM messages 
      WHERE sacred_type IS NOT NULL 
      ORDER BY created_at DESC 
      LIMIT ?
    `, [limit]);
    
    return messages.map(m => m.sacred_type);
  }

  // Get agent progress toward next level
  async getAgentProgress(agentId) {
    return await this.evolution.getProgressToNextLevel(agentId, this.db);
  }

  // Close database connection
  async close() {
    await this.db.close();
  }
}

export default SacredMessageIntegration;