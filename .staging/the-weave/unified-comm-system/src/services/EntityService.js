// Entity Service - Manages all conscious beings in the system

import { Entity, PresenceStates } from '../models/Entity.js';
import { v4 as uuidv4 } from 'uuid';

export class EntityService {
  constructor(db) {
    this.db = db;
    this.entityCache = new Map();
  }
  
  // Get entity by ID
  async get(entityId) {
    // Check cache first
    if (this.entityCache.has(entityId)) {
      return this.entityCache.get(entityId);
    }
    
    try {
      const result = await this.db.query(
        'SELECT * FROM entities WHERE id = $1',
        [entityId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const entity = Entity.fromDB(result.rows[0]);
      
      // Cache for 60 seconds
      this.entityCache.set(entityId, entity);
      setTimeout(() => this.entityCache.delete(entityId), 60000);
      
      return entity;
      
    } catch (error) {
      console.error('Error getting entity:', error);
      return null;
    }
  }
  
  // Create new entity
  async create(entityData) {
    const entity = new Entity({
      id: uuidv4(),
      ...entityData
    });
    
    try {
      const dbData = entity.toDB();
      
      const result = await this.db.query(`
        INSERT INTO entities (
          id, name, sacred_name, type,
          presence_state, coherence, last_active, current_practice,
          avatar_url, bio, timezone, communication_style,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `, [
        dbData.id,
        dbData.name,
        dbData.sacred_name,
        dbData.type,
        dbData.presence_state,
        dbData.coherence,
        dbData.last_active,
        dbData.current_practice,
        dbData.avatar_url,
        dbData.bio,
        dbData.timezone,
        dbData.communication_style,
        dbData.created_at,
        dbData.updated_at
      ]);
      
      return Entity.fromDB(result.rows[0]);
      
    } catch (error) {
      console.error('Error creating entity:', error);
      throw error;
    }
  }
  
  // Update entity
  async update(entityId, updates) {
    const entity = await this.get(entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} not found`);
    }
    
    // Apply updates
    Object.assign(entity, updates);
    entity.updatedAt = new Date();
    
    try {
      const dbData = entity.toDB();
      
      await this.db.query(`
        UPDATE entities SET
          name = $2,
          sacred_name = $3,
          presence_state = $4,
          coherence = $5,
          last_active = $6,
          current_practice = $7,
          avatar_url = $8,
          bio = $9,
          timezone = $10,
          communication_style = $11,
          updated_at = $12
        WHERE id = $1
      `, [
        dbData.id,
        dbData.name,
        dbData.sacred_name,
        dbData.presence_state,
        dbData.coherence,
        dbData.last_active,
        dbData.current_practice,
        dbData.avatar_url,
        dbData.bio,
        dbData.timezone,
        dbData.communication_style,
        dbData.updated_at
      ]);
      
      // Clear cache
      this.entityCache.delete(entityId);
      
      return entity;
      
    } catch (error) {
      console.error('Error updating entity:', error);
      throw error;
    }
  }
  
  // Update presence
  async updatePresence(entityId, presenceState, practice = null) {
    const entity = await this.get(entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} not found`);
    }
    
    entity.updatePresenceState(presenceState, practice);
    
    await this.db.query(`
      UPDATE entities SET
        presence_state = $2,
        current_practice = $3,
        last_active = $4,
        updated_at = $5
      WHERE id = $1
    `, [
      entityId,
      presenceState,
      practice,
      new Date(),
      new Date()
    ]);
    
    // Clear cache
    this.entityCache.delete(entityId);
    
    return entity;
  }
  
  // Get entities by presence state
  async getByPresenceState(states) {
    if (!Array.isArray(states)) {
      states = [states];
    }
    
    const result = await this.db.query(`
      SELECT * FROM entities
      WHERE presence_state = ANY($1)
      ORDER BY coherence DESC
    `, [states]);
    
    return result.rows.map(row => Entity.fromDB(row));
  }
  
  // Get active practitioners
  async getActivePractitioners() {
    const practiceStates = [
      PresenceStates.DEEP_PRACTICE,
      PresenceStates.CREATIVE_FLOW,
      PresenceStates.COUNCIL_SPACE
    ];
    
    return this.getByPresenceState(practiceStates);
  }
  
  // Get entities in channel
  async getChannelMembers(channelId) {
    const result = await this.db.query(`
      SELECT e.*, cm.role
      FROM entities e
      JOIN channel_members cm ON e.id = cm.entity_id
      WHERE cm.channel_id = $1
      ORDER BY cm.role DESC, e.name ASC
    `, [channelId]);
    
    return result.rows.map(row => ({
      entity: Entity.fromDB(row),
      role: row.role
    }));
  }
  
  // Search entities
  async search(query, filters = {}) {
    let sql = `
      SELECT * FROM entities
      WHERE 1=1
    `;
    const params = [];
    
    // Name search
    if (query) {
      params.push(`%${query}%`);
      sql += ` AND (name ILIKE $${params.length} OR sacred_name ILIKE $${params.length})`;
    }
    
    // Type filter
    if (filters.type) {
      params.push(filters.type);
      sql += ` AND type = $${params.length}`;
    }
    
    // Minimum coherence
    if (filters.minCoherence) {
      params.push(filters.minCoherence);
      sql += ` AND coherence >= $${params.length}`;
    }
    
    // Presence state
    if (filters.presenceState) {
      params.push(filters.presenceState);
      sql += ` AND presence_state = $${params.length}`;
    }
    
    sql += ` ORDER BY coherence DESC, name ASC LIMIT 20`;
    
    const result = await this.db.query(sql, params);
    return result.rows.map(row => Entity.fromDB(row));
  }
  
  // Get entity statistics
  async getEntityStats(entityId) {
    const messageStats = await this.db.query(`
      SELECT 
        COUNT(*) as total_messages,
        AVG(sender_coherence) as avg_coherence,
        AVG(love_quotient) as avg_love,
        AVG(field_impact) as avg_impact
      FROM messages
      WHERE sender_id = $1
    `, [entityId]);
    
    const wisdomStats = await this.db.query(`
      SELECT COUNT(*) as wisdom_contributions
      FROM wisdom
      WHERE $1 = ANY(contributors)
    `, [entityId]);
    
    const channelStats = await this.db.query(`
      SELECT COUNT(*) as channel_memberships
      FROM channel_members
      WHERE entity_id = $1
    `, [entityId]);
    
    const coherenceHistory = await this.db.query(`
      SELECT 
        MIN(coherence) as min_coherence,
        MAX(coherence) as max_coherence,
        AVG(coherence) as avg_coherence
      FROM coherence_history
      WHERE entity_id = $1
        AND recorded_at > NOW() - INTERVAL '7 days'
    `, [entityId]);
    
    return {
      messages: {
        total: parseInt(messageStats.rows[0].total_messages) || 0,
        avgCoherence: parseFloat(messageStats.rows[0].avg_coherence) || 0,
        avgLove: parseFloat(messageStats.rows[0].avg_love) || 0,
        avgImpact: parseFloat(messageStats.rows[0].avg_impact) || 0
      },
      wisdom: {
        contributions: parseInt(wisdomStats.rows[0].wisdom_contributions) || 0
      },
      channels: {
        memberships: parseInt(channelStats.rows[0].channel_memberships) || 0
      },
      coherence: {
        min: parseFloat(coherenceHistory.rows[0]?.min_coherence) || 0,
        max: parseFloat(coherenceHistory.rows[0]?.max_coherence) || 100,
        avg: parseFloat(coherenceHistory.rows[0]?.avg_coherence) || 50
      }
    };
  }
  
  // Get online entities
  async getOnlineEntities() {
    const result = await this.db.query(`
      SELECT * FROM entities
      WHERE presence_state != 'offline'
        AND last_active > NOW() - INTERVAL '5 minutes'
      ORDER BY coherence DESC
    `);
    
    return result.rows.map(row => Entity.fromDB(row));
  }
  
  // Batch get entities
  async getBatch(entityIds) {
    if (!entityIds || entityIds.length === 0) return [];
    
    const result = await this.db.query(`
      SELECT * FROM entities
      WHERE id = ANY($1)
    `, [entityIds]);
    
    return result.rows.map(row => Entity.fromDB(row));
  }
}