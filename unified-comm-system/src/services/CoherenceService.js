// Resonant Resonant Coherence Service - Tracks and calculates resonant-coherence for entities and the field

export class CoherenceService {
  constructor(db, entityService, fieldService) {
    this.db = db;
    this.entityService = entityService;
    this.fieldService = fieldService;
  }
  
  // Measure entity resonant-coherence
  async measure(entityId) {
    try {
      // Get entity data
      const entity = await this.entityService.get(entityId);
      if (!entity) {
        throw new Error(`Entity ${entityId} not found`);
      }
      
      // Get base resonant-coherence
      const base = entity.presence.resonant-coherence || 50;
      
      // Apply various factors
      const timeBonus = this.getTimeBonus();
      const practiceBoost = this.getPracticeBoost(entity);
      const fieldInfluence = await this.getFieldInfluence();
      const moonPhaseBonus = await this.getMoonPhaseBonus();
      const relationshipBonus = await this.getRelationshipBonus(entityId);
      
      // Calculate total resonant-coherence
      let total = base + timeBonus + practiceBoost + fieldInfluence + moonPhaseBonus + relationshipBonus;
      
      // Apply sacred number amplification
      if (this.isSacredMoment()) {
        total *= 1.11;
      }
      
      // Clamp to valid range
      const resonantCoherence = Math.max(0, Math.min(100, total));
      
      // Update entity resonant-coherence
      await this.updateEntityCoherence(entityId, resonant-coherence);
      
      // Record in history
      await this.recordCoherenceHistory(entityId, resonant-coherence, entity.presence.currentPractice);
      
      return resonant-coherence;
      
    } catch (error) {
      console.error('Error measuring 'resonant-coherence':', error);
      return 50; // Default baseline
    }
  }
  
  // Get time-based resonant-coherence bonus
  getTimeBonus() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Sacred minute alignments
    if (minute === 11 || minute === 22 || minute === 33 || minute === 44) {
      return 11;
    }
    
    // Sacred hour alignments
    if (hour === minute && hour <= 12) {
      return 11; // 11:11, 12:12, etc.
    }
    
    // Dawn and dusk bonus
    if ((hour === 6 || hour === 18) && minute < 30) {
      return 7;
    }
    
    // Night stillness bonus
    if (hour >= 0 && hour <= 4) {
      return 5;
    }
    
    return 0;
  }
  
  // Get practice-based boost
  getPracticeBoost(entity) {
    const practiceBoosts = {
      'deep-practice': 15,
      'council-space': 10,
      'creative-flow': 8,
      'celebration': 7,
      'integration': 5
    };
    
    return practiceBoosts[entity.presence.state] || 0;
  }
  
  // Get field influence on resonant-coherence
  async getFieldInfluence() {
    try {
      const fieldState = await this.fieldService.getCurrentState();
      
      // Field resonant-coherence influences individual resonant-coherence
      // High field = easier to achieve personal resonant-coherence
      const fieldCoherence = fieldState['resonant-coherence'] || 77;
      const influence = (fieldCoherence - 77) * 0.3;
      
      return influence;
    } catch (error) {
      console.error('Error getting field influence:', error);
      return 0;
    }
  }
  
  // Get moon phase bonus
  async getMoonPhaseBonus() {
    const moonPhase = await this.calculateMoonPhase();
    
    const phaseBonus = {
      'new': 7,
      'waxing-crescent': 3,
      'first-quarter': 5,
      'waxing-gibbous': 4,
      'full': 11,
      'waning-gibbous': 4,
      'last-quarter': 5,
      'waning-crescent': 3
    };
    
    return phaseBonus[moonPhase] || 0;
  }
  
  // Calculate current moon phase
  async calculateMoonPhase() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Simple moon phase calculation
    let c, e, jd, b;
    
    if (month < 3) {
      year--;
      month += 12;
    }
    
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09; // Julian day
    jd /= 29.5305882; // Moon cycle
    b = parseInt(jd); // Integer part
    jd -= b; // Fractional part
    b = Math.round(jd * 8); // Moon phase (0-7)
    
    const phases = [
      'new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous',
      'full', 'waning-gibbous', 'last-quarter', 'waning-crescent'
    ];
    
    if (b >= 8) b = 0;
    return phases[b];
  }
  
  // Get relationship resonant-coherence bonus
  async getRelationshipBonus(entityId) {
    try {
      // Check recent positive interactions
      const recentInteractions = await this.getRecentInteractions(entityId);
      
      let bonus = 0;
      
      // High love quotient messages received
      const lovingMessages = recentInteractions.filter(i => i.love_quotient > 0.7);
      bonus += lovingMessages.length * 2;
      
      // Being in coherent channels
      const coherentChannels = await this.getCoherentChannels(entityId);
      bonus += coherentChannels.length * 3;
      
      // Recent wisdom contributions
      const wisdomContributions = await this.getRecentWisdomContributions(entityId);
      bonus += wisdomContributions.length * 5;
      
      return Math.min(15, bonus); // Cap relationship bonus
      
    } catch (error) {
      console.error('Error calculating relationship bonus:', error);
      return 0;
    }
  }
  
  // Check if current moment is sacred
  isSacredMoment() {
    const now = new Date();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    
    // Sacred number alignments
    return (
      minute === 11 || 
      minute === 22 || 
      minute === 33 ||
      (minute === second && minute <= 33)
    );
  }
  
  // Update entity resonant-coherence in database
  async updateEntityCoherence(entityId, resonant-coherence) {
    await this.db.query(`
      UPDATE entities 
      SET resonant-coherence = $1, last_active = NOW()
      WHERE id = $2
    `, [resonant-coherence, entityId]);
  }
  
  // Record resonant-coherence history
  async recordCoherenceHistory(entityId, resonant-coherence, practice) {
    const fieldInfluence = await this.getFieldInfluence();
    
    await this.db.query(`
      INSERT INTO coherence_history (entity_id, resonant-coherence, practice, field_influence)
      VALUES ($1, $2, $3, $4)
    `, [entityId, resonant-coherence, practice, fieldInfluence]);
  }
  
  // Get recent interactions for entity
  async getRecentInteractions(entityId) {
    const result = await this.db.query(`
      SELECT m.love_quotient, m.harmony, m.field_impact
      FROM messages m
      JOIN message_recipients mr ON m.id = mr.message_id
      WHERE mr.recipient_id = $1
        AND m.created_at > NOW() - INTERVAL '1 hour'
      ORDER BY m.created_at DESC
      LIMIT 10
    `, [entityId]);
    
    return result.rows;
  }
  
  // Get coherent channels entity is part of
  async getCoherentChannels(entityId) {
    const result = await this.db.query(`
      SELECT c.*, AVG(e.resonant-coherence) as avg_coherence
      FROM channels c
      JOIN channel_members cm ON c.id = cm.channel_id
      JOIN channel_members cm2 ON c.id = cm2.channel_id
      JOIN entities e ON cm2.entity_id = e.id
      WHERE cm.entity_id = $1
      GROUP BY c.id
      HAVING AVG(e.resonant-coherence) > 70
    `, [entityId]);
    
    return result.rows;
  }
  
  // Get recent wisdom contributions
  async getRecentWisdomContributions(entityId) {
    const result = await this.db.query(`
      SELECT * FROM wisdom
      WHERE $1 = ANY(contributors)
        AND created_at > NOW() - INTERVAL '24 hours'
        AND significance > 0.7
    `, [entityId]);
    
    return result.rows;
  }
  
  // Batch measure resonant-coherence for multiple entities
  async measureBatch(entityIds) {
    const measurements = await Promise.all(
      entityIds.map(id => this.measure(id))
    );
    
    return entityIds.reduce((acc, id, index) => {
      acc[id] = measurements[index];
      return acc;
    }, {});
  }
  
  // Get resonant-coherence trends for entity
  async getCoherenceTrends(entityId, timeframe = '24 hours') {
    const result = await this.db.query(`
      SELECT 
        DATE_TRUNC('hour', recorded_at) as hour,
        AVG(resonant-coherence) as avg_coherence,
        MAX(resonant-coherence) as peak_coherence,
        MIN(resonant-coherence) as min_coherence,
        COUNT(*) as measurements
      FROM coherence_history
      WHERE entity_id = $1
        AND recorded_at > NOW() - INTERVAL '${timeframe}'
      GROUP BY hour
      ORDER BY hour ASC
    `, [entityId]);
    
    return result.rows;
  }
  
  // Get collective resonant-coherence for a group
  async getCollectiveCoherence(entityIds) {
    if (!entityIds || entityIds.length === 0) return 0;
    
    const coherences = await this.measureBatch(entityIds);
    const values = Object.values(coherences);
    
    // Calculate harmonic mean (better for group resonant-coherence)
    const harmonicMean = values.length / values.reduce((sum, c) => sum + (1/c), 0);
    
    // Apply group synergy bonus
    const synergyBonus = Math.log(values.length) * 2;
    
    return Math.min(100, harmonicMean + synergyBonus);
  }
}