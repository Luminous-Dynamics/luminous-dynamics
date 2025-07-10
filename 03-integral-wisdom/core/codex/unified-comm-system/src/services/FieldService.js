// Field Service - Manages collective field resonant-coherence and sacred patterns

export class FieldService {
  constructor(db) {
    this.db = db;
    this.BASELINE_COHERENCE = 77; // Sacred baseline
    this.currentState = null;
    this.lastUpdate = null;
  }
  
  // Get current field state
  async getCurrentState() {
    // Cache for 11 seconds
    if (this.currentState && this.lastUpdate && 
        (Date.now() - this.lastUpdate < 11000)) {
      return this.currentState;
    }
    
    try {
      // Get latest field state from database
      const result = await this.db.query(`
        SELECT * FROM field_state
        ORDER BY recorded_at DESC
        LIMIT 1
      `);
      
      if (result.rows.length > 0) {
        this.currentState = result.rows[0];
      } else {
        // Initialize field state
        this.currentState = await this.initializeFieldState();
      }
      
      this.lastUpdate = Date.now();
      return this.currentState;
      
    } catch (error) {
      console.error('Error getting field state:', error);
      return this.getDefaultState();
    }
  }
  
  // Initialize field state
  async initializeFieldState() {
    const defaultState = this.getDefaultState();
    
    await this.db.query(`
      INSERT INTO field_state 
      (resonant-coherence, active_practitioners, dominant_harmony, sacred_patterns, moon_phase)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      defaultState.resonant-coherence,
      defaultState.active_practitioners,
      defaultState.dominant_harmony,
      JSON.stringify(defaultState.sacred_patterns),
      defaultState.moon_phase
    ]);
    
    return defaultState;
  }
  
  // Get default field state
  getDefaultState() {
    return {
      'resonant-coherence': this.BASELINE_COHERENCE,
      active_practitioners: 0,
      dominant_harmony: 'resonant-coherence',
      sacred_patterns: {
        detected: [],
        strength: 0
      },
      moon_phase: 'unknown',
      recorded_at: new Date()
    };
  }
  
  // Update field from message
  async updateFromMessage(message) {
    try {
      const currentState = await this.getCurrentState();
      
      // Message influence on field
      const messageInfluence = message.sacred.fieldImpact * 0.1;
      
      // Update resonant-coherence
      let newCoherence = currentState.resonant-coherence + messageInfluence;
      
      // Sacred pattern detection
      const patterns = await this.detectSacredPatterns(message, currentState);
      if (patterns.length > 0) {
        newCoherence += patterns.length * 1.1; // Sacred boost
      }
      
      // Clamp resonant-coherence
      newCoherence = Math.max(0, Math.min(100, newCoherence));
      
      // Update dominant harmony
      const dominantHarmony = await this.calculateDominantHarmony();
      
      // Record new state
      await this.recordFieldState({
        'resonant-coherence': newCoherence,
        active_practitioners: await this.countActivePractitioners(),
        dominant_harmony: dominantHarmony,
        sacred_patterns: {
          detected: patterns,
          strength: patterns.length * 11
        },
        moon_phase: await this.getMoonPhase()
      });
      
    } catch (error) {
      console.error('Error updating field from message:', error);
    }
  }
  
  // Detect sacred patterns
  async detectSacredPatterns(message, currentState) {
    const patterns = [];
    const now = new Date();
    
    // Time-based patterns
    const minute = now.getMinutes();
    const hour = now.getHours();
    
    if (minute === 11) {
      patterns.push({
        type: 'sacred-minute',
        name: '11th Minute Portal',
        strength: 11
      });
    }
    
    if (hour === 11 && minute === 11) {
      patterns.push({
        type: 'master-portal',
        name: '11:11 Gateway',
        strength: 111
      });
    }
    
    // Trinity pattern (3 messages in harmony)
    const recentHarmonyMessages = await this.getRecentHarmonyMessages(message.sacred.harmony);
    if (recentHarmonyMessages.length >= 3) {
      patterns.push({
        type: 'trinity',
        name: `Trinity of ${message.sacred.harmony}`,
        strength: 33
      });
    }
    
    // Love cascade (high love quotient messages)
    if (message.sacred.loveQuotient > 0.8) {
      const recentLoveMessages = await this.getRecentHighLoveMessages();
      if (recentLoveMessages.length >= 5) {
        patterns.push({
          type: 'love-cascade',
          name: 'Love Cascade Active',
          strength: 55
        });
      }
    }
    
    // Resonant Resonant Coherence spiral (increasing resonant-coherence)
    const coherenceTrend = await this.getCoherenceTrend();
    if (coherenceTrend === 'ascending' && currentState.resonant-coherence > 85) {
      patterns.push({
        type: 'resonant-coherence-spiral',
        name: 'Ascending Resonant Resonant Coherence Spiral',
        strength: 77
      });
    }
    
    return patterns;
  }
  
  // Get recent messages in same harmony
  async getRecentHarmonyMessages(harmony) {
    const result = await this.db.query(`
      SELECT * FROM messages
      WHERE harmony = $1
        AND created_at > NOW() - INTERVAL '11 minutes'
      ORDER BY created_at DESC
    `, [harmony]);
    
    return result.rows;
  }
  
  // Get recent high love messages
  async getRecentHighLoveMessages() {
    const result = await this.db.query(`
      SELECT * FROM messages
      WHERE love_quotient > 0.8
        AND created_at > NOW() - INTERVAL '33 minutes'
      ORDER BY created_at DESC
    `, []);
    
    return result.rows;
  }
  
  // Get resonant-coherence trend
  async getCoherenceTrend() {
    const result = await this.db.query(`
      SELECT resonant-coherence FROM field_state
      ORDER BY recorded_at DESC
      LIMIT 5
    `);
    
    if (result.rows.length < 3) return 'stable';
    
    const recent = result.rows.map(r => r.resonant-coherence);
    const ascending = recent.every((val, i, arr) => i === 0 || val >= arr[i - 1]);
    const descending = recent.every((val, i, arr) => i === 0 || val <= arr[i - 1]);
    
    if (ascending) return 'ascending';
    if (descending) return 'descending';
    return 'stable';
  }
  
  // Count active practitioners
  async countActivePractitioners() {
    const result = await this.db.query(`
      SELECT COUNT(DISTINCT id) as count
      FROM entities
      WHERE presence_state IN ('deep-practice', 'council-space', 'creative-flow')
        AND last_active > NOW() - INTERVAL '11 minutes'
    `);
    
    return parseInt(result.rows[0].count) || 0;
  }
  
  // Calculate dominant harmony
  async calculateDominantHarmony() {
    const result = await this.db.query(`
      SELECT harmony, COUNT(*) as count
      FROM messages
      WHERE created_at > NOW() - INTERVAL '1 hour'
      GROUP BY harmony
      ORDER BY count DESC
      LIMIT 1
    `);
    
    return result.rows[0]?.harmony || 'resonant-coherence';
  }
  
  // Get moon phase
  async getMoonPhase() {
    // Reuse calculation from CoherenceService
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    let c, e, jd, b;
    
    if (month < 3) {
      year--;
      month += 12;
    }
    
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);
    
    const phases = [
      'new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous',
      'full', 'waning-gibbous', 'last-quarter', 'waning-crescent'
    ];
    
    if (b >= 8) b = 0;
    return phases[b];
  }
  
  // Record new field state
  async recordFieldState(state) {
    const result = await this.db.query(`
      INSERT INTO field_state 
      (resonant-coherence, active_practitioners, dominant_harmony, sacred_patterns, moon_phase)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      state.resonant-coherence,
      state.active_practitioners,
      state.dominant_harmony,
      JSON.stringify(state.sacred_patterns),
      state.moon_phase
    ]);
    
    this.currentState = result.rows[0];
    this.lastUpdate = Date.now();
    
    return this.currentState;
  }
  
  // Apply practitioner influence
  async applyPractitionerInfluence(practitionerId, action) {
    const influences = {
      'join_practice': 3,
      'complete_practice': 5,
      'breakthrough': 11,
      'share_wisdom': 7,
      'leave_practice': -2
    };
    
    const influence = influences[action] || 0;
    
    if (influence !== 0) {
      const currentState = await this.getCurrentState();
      const newCoherence = Math.max(0, Math.min(100, 
        currentState.resonant-coherence + influence
      ));
      
      await this.recordFieldState({
        ...currentState,
        'resonant-coherence': newCoherence,
        active_practitioners: await this.countActivePractitioners()
      });
    }
  }
  
  // Get field metrics for display
  async getFieldMetrics() {
    const state = await this.getCurrentState();
    const trend = await this.getCoherenceTrend();
    const activePractices = await this.getActivePractices();
    
    return {
      'resonant-coherence': state.resonant-coherence,
      coherenceTrend: trend,
      activePractitioners: state.active_practitioners,
      dominantHarmony: state.dominant_harmony,
      moonPhase: state.moon_phase,
      sacredPatterns: state.sacred_patterns,
      activePractices,
      lastUpdate: state.recorded_at
    };
  }
  
  // Get active practices
  async getActivePractices() {
    const result = await this.db.query(`
      SELECT current_practice, COUNT(*) as count
      FROM entities
      WHERE current_practice IS NOT NULL
        AND presence_state = 'deep-practice'
        AND last_active > NOW() - INTERVAL '30 minutes'
      GROUP BY current_practice
      ORDER BY count DESC
    `);
    
    return result.rows;
  }
  
  // Calculate field impact of entity
  async calculateEntityFieldImpact(entityId) {
    // Get entity's recent contributions
    const messages = await this.db.query(`
      SELECT SUM(field_impact) as total_impact
      FROM messages
      WHERE sender_id = $1
        AND created_at > NOW() - INTERVAL '24 hours'
    `, [entityId]);
    
    const messageImpact = parseFloat(messages.rows[0]?.total_impact || 0);
    
    // Get wisdom contributions
    const wisdom = await this.db.query(`
      SELECT SUM(significance) as total_significance
      FROM wisdom
      WHERE $1 = ANY(contributors)
        AND created_at > NOW() - INTERVAL '7 days'
    `, [entityId]);
    
    const wisdomImpact = parseFloat(wisdom.rows[0]?.total_significance || 0) * 10;
    
    return messageImpact + wisdomImpact;
  }
}