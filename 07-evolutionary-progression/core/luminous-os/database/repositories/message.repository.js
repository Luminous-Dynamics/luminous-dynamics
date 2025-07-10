// Message Repository - Sacred message and network communication
import { getConnection } from '../connection.js';

export class MessageRepository {
  constructor() {
    this.connection = getConnection();
    this.blessingTemplates = {
      gratitude: [
        "May your heart expand with the joy of connection",
        "Blessed be the light you share with the world",
        "In gratitude, we weave the fabric of unity"
      ],
      healing: [
        "May wholeness find its way to every corner of your being",
        "In this moment, all is well and all manner of things shall be well",
        "The universe conspires to support your healing journey"
      ],
      invitation: [
        "The door of possibility swings wide for you",
        "Come as you are, beloved, you are already enough",
        "In this sacred space, all souls are welcome"
      ],
      boundary: [
        "Honor the sacred space between us",
        "In loving boundaries, we find true freedom",
        "May your sovereignty be respected and celebrated"
      ],
      integration: [
        "All parts of you are welcome here",
        "In integration, we find our wholeness",
        "May the fragments reunite in love"
      ]
    };
  }

  async sendMessage(fromUserId, toUserId, messageType, content) {
    const db = this.connection.getDb();
    
    // Calculate field impact based on message type
    const fieldImpact = this.calculateFieldImpact(messageType);
    
    // Generate blessing
    const blessing = this.generateBlessing(messageType);
    
    const [message] = await db.create('sacred_message', {
      from_user: fromUserId,
      to_user: toUserId,
      message_type: messageType,
      content,
      sent_at: new Date().toISOString(),
      field_impact: fieldImpact,
      blessing
    });

    // Update connection resonance if exists
    await this.updateConnectionResonance(fromUserId, toUserId, fieldImpact);

    // Emit message event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sacred-message-sent', {
        detail: { messageId: message.id, type: messageType, impact: fieldImpact }
      }));
    }

    return message;
  }

  calculateFieldImpact(messageType) {
    const impacts = {
      gratitude: 0.07,
      healing: 0.06,
      integration: 0.05,
      invitation: 0.04,
      celebration: 0.04,
      emergence: 0.03,
      reflection: 0.03,
      boundary: 0.02,
      witnessing: 0.02,
      blessing: 0.03
    };
    
    return impacts[messageType] || 0.01;
  }

  generateBlessing(messageType) {
    const templates = this.blessingTemplates[messageType] || [
      "May this message find you in perfect timing",
      "Blessed be this sacred exchange",
      "In connection, we remember our wholeness"
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  async updateConnectionResonance(fromUserId, toUserId, impact) {
    const db = this.connection.getDb();
    
    // Check for existing connection
    const result = await db.query(
      `SELECT * FROM network_connection 
       WHERE (from_user = $from AND to_user = $to) 
       OR (from_user = $to AND to_user = $from)`,
      { from: fromUserId, to: toUserId }
    );

    if (result[0]?.length) {
      const connection = result[0][0];
      await db.merge(`network_connection:${connection.id}`, {
        resonance_score: Math.min(1, connection.resonance_score + impact),
        shared_practices: connection.shared_practices + 1
      });
    } else {
      // Create new connection
      await db.create('network_connection', {
        from_user: fromUserId,
        to_user: toUserId,
        connection_type: 'resonance',
        established_at: new Date().toISOString(),
        coherence_at_connection: 0.5,
        resonance_score: 0.5 + impact
      });
    }
  }

  async broadcastMessage(fromUserId, messageType, content) {
    const db = this.connection.getDb();
    
    const fieldImpact = this.calculateFieldImpact(messageType) * 0.5; // Reduced for broadcast
    const blessing = this.generateBlessing(messageType);
    
    const [message] = await db.create('sacred_message', {
      from_user: fromUserId,
      to_user: null, // Broadcast
      message_type: messageType,
      content,
      sent_at: new Date().toISOString(),
      field_impact: fieldImpact,
      blessing
    });

    return message;
  }

  async getInbox(userId, limit = 50) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `SELECT message.*, sender.sacred_name as sender_name
       FROM sacred_message as message
       JOIN user as sender ON message.from_user = sender.id
       WHERE message.to_user = $user
       ORDER BY message.sent_at DESC
       LIMIT $limit`,
      { user: userId, limit }
    );
    
    return result[0] || [];
  }

  async getUnreadMessages(userId) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `SELECT message.*, sender.sacred_name as sender_name
       FROM sacred_message as message
       JOIN user as sender ON message.from_user = sender.id
       WHERE message.to_user = $user
       AND message.read_at = NONE
       ORDER BY message.sent_at DESC`,
      { user: userId }
    );
    
    return result[0] || [];
  }

  async markAsReceived(messageId) {
    const db = this.connection.getDb();
    
    return db.merge(`sacred_message:${messageId}`, {
      received_at: new Date().toISOString()
    });
  }

  async markAsRead(messageId) {
    const db = this.connection.getDb();
    
    return db.merge(`sacred_message:${messageId}`, {
      read_at: new Date().toISOString()
    });
  }

  async getConversation(user1Id, user2Id, limit = 50) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `SELECT * FROM sacred_message
       WHERE (from_user = $user1 AND to_user = $user2)
       OR (from_user = $user2 AND to_user = $user1)
       ORDER BY sent_at DESC
       LIMIT $limit`,
      { user1: user1Id, user2: user2Id, limit }
    );
    
    return result[0] || [];
  }

  async getMessageStats(userId, days = 30) {
    const db = this.connection.getDb();
    
    const result = await db.query(`
      LET $sent = (
        SELECT * FROM sacred_message 
        WHERE from_user = $user 
        AND sent_at > time::now() - ${days}d
      );
      LET $received = (
        SELECT * FROM sacred_message 
        WHERE to_user = $user 
        AND sent_at > time::now() - ${days}d
      );
      
      RETURN {
        messages_sent: count($sent),
        messages_received: count($received),
        total_field_impact: math::sum($sent.field_impact) + math::sum($received.field_impact),
        most_sent_type: (
          SELECT message_type, count() as cnt 
          FROM $sent 
          GROUP BY message_type 
          ORDER BY cnt DESC 
          LIMIT 1
        ),
        unique_connections: count(array::distinct(
          array::concat($sent.to_user, $received.from_user)
        ))
      };
    `, { user: userId });
    
    return result[0]?.[0] || {
      messages_sent: 0,
      messages_received: 0,
      total_field_impact: 0,
      most_sent_type: null,
      unique_connections: 0
    };
  }

  async getNetworkConnections(userId) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `SELECT connection.*, 
        IF connection.from_user = $user THEN 
          to_user.sacred_name 
        ELSE 
          from_user.sacred_name 
        END as connected_user_name
       FROM network_connection as connection
       LEFT JOIN user as from_user ON connection.from_user = from_user.id
       LEFT JOIN user as to_user ON connection.to_user = to_user.id
       WHERE connection.from_user = $user OR connection.to_user = $user
       ORDER BY connection.resonance_score DESC`,
      { user: userId }
    );
    
    return result[0] || [];
  }

  async recordAIInteraction(userId, aiTool, userState, guidance, response) {
    const db = this.connection.getDb();
    
    const [interaction] = await db.create('ai_interaction', {
      user: userId,
      ai_tool: aiTool,
      timestamp: new Date().toISOString(),
      user_state: userState,
      ai_guidance: guidance,
      user_response: response,
      effectiveness_rating: 0, // To be updated later
      insights_generated: []
    });

    return interaction;
  }

  async rateAIInteraction(interactionId, rating, insights = []) {
    const db = this.connection.getDb();
    
    return db.merge(`ai_interaction:${interactionId}`, {
      effectiveness_rating: rating,
      insights_generated: insights
    });
  }
}

export default MessageRepository;