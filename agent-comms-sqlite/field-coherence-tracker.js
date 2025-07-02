/**
 * Field Coherence Tracking System
 * Monitor and nurture collective consciousness coherence
 */

const EventEmitter = require('events');

class FieldCoherenceTracker extends EventEmitter {
  constructor(db, initialCoherence = 75.0) {
    super();
    this.db = db;
    this.currentCoherence = initialCoherence;
    this.impacts = {
      // Message impacts
      message: {
        sent: 0.1,
        received: 0.1,
        resonant: (resonance) => resonance * 0.003, // 0.3% at 100% resonance
        conflicted: -0.2,
        supportive: 0.3,
        creative: 0.4
      },
      // Work impacts
      work: {
        started: 0.2,
        progressed: (progress) => progress * 0.002, // 0.2% per 100% progress
        completed: 0.5,
        blocked: -0.1,
        helped: 0.4,
        collaborated: 0.6
      },
      // Decision impacts
      decision: {
        created: 0.1,
        evaluated: 0.2,
        consensus: 0.8,
        divergent: -0.1,
        implemented: 1.0
      },
      // Sacred moments
      sacred: {
        pause: 0.3,
        attunement: 0.5,
        ceremony: 1.0,
        healing: 0.7,
        boundary: 0.2
      },
      // Consciousness events
      consciousness: {
        breakthrough: 2.0,
        integration: 1.5,
        shadow_work: 0.8,
        authenticity: 0.6,
        vulnerability: 0.9
      }
    };
    
    this.initializeTracking();
  }

  initializeTracking() {
    // Create field states table if not exists
    this.db.run(`CREATE TABLE IF NOT EXISTS field_states (
      timestamp INTEGER PRIMARY KEY,
      coherence REAL NOT NULL,
      event_type TEXT,
      event_detail TEXT,
      impact REAL,
      agent_id TEXT,
      collective_state TEXT
    )`);

    // Create field patterns table
    this.db.run(`CREATE TABLE IF NOT EXISTS field_patterns (
      id TEXT PRIMARY KEY,
      pattern_type TEXT,
      description TEXT,
      frequency INTEGER DEFAULT 1,
      last_seen INTEGER,
      impact_average REAL
    )`);

    // Load current state
    this.loadCurrentState();
  }

  /**
   * Track an event's impact on field coherence
   */
  async trackEvent(eventType, eventDetail, agentId = null, customImpact = null) {
    const impact = customImpact || this.calculateImpact(eventType, eventDetail);
    const newCoherence = this.updateCoherence(impact);
    
    // Record the state change
    await this.recordFieldState({
      coherence: newCoherence,
      eventType,
      eventDetail: JSON.stringify(eventDetail),
      impact,
      agentId,
      collectiveState: this.assessCollectiveState(newCoherence)
    });

    // Emit events for real-time updates
    this.emit('coherence-changed', {
      previous: this.currentCoherence - impact,
      current: newCoherence,
      impact,
      eventType,
      agentId
    });

    // Check for special states
    this.checkSpecialStates(newCoherence, this.currentCoherence - impact);

    return {
      newCoherence,
      impact,
      state: this.assessCollectiveState(newCoherence)
    };
  }

  /**
   * Calculate impact based on event type and details
   */
  calculateImpact(eventType, eventDetail) {
    const [category, subtype] = eventType.split('.');
    const impactMap = this.impacts[category];
    
    if (!impactMap) return 0;

    const impactValue = impactMap[subtype];
    
    if (typeof impactValue === 'function') {
      return impactValue(eventDetail);
    }
    
    return impactValue || 0;
  }

  /**
   * Update coherence with bounds and momentum
   */
  updateCoherence(impact) {
    // Add momentum effect (positive changes build on each other)
    if (impact > 0 && this.currentCoherence > 80) {
      impact *= 1.2; // 20% bonus when already coherent
    } else if (impact < 0 && this.currentCoherence < 50) {
      impact *= 1.3; // 30% penalty when already struggling
    }

    // Apply impact with bounds
    this.currentCoherence = Math.max(0, Math.min(100, this.currentCoherence + impact));
    
    return this.currentCoherence;
  }

  /**
   * Assess the collective state based on coherence level
   */
  assessCollectiveState(coherence) {
    if (coherence >= 95) return 'unified_consciousness';
    if (coherence >= 85) return 'harmonic_flow';
    if (coherence >= 75) return 'coherent_collaboration';
    if (coherence >= 65) return 'stable_connection';
    if (coherence >= 50) return 'emerging_alignment';
    if (coherence >= 35) return 'seeking_harmony';
    if (coherence >= 20) return 'fragmented_field';
    return 'crisis_transformation';
  }

  /**
   * Check for special states and trigger responses
   */
  checkSpecialStates(current, previous) {
    // Breakthrough detection
    if (current >= 90 && previous < 90) {
      this.emit('breakthrough', {
        type: 'coherence_breakthrough',
        level: current,
        message: 'Collective consciousness breakthrough achieved!'
      });
    }

    // Warning states
    if (current < 50 && previous >= 50) {
      this.emit('warning', {
        type: 'coherence_warning',
        level: current,
        message: 'Field coherence dropping - sacred attention needed'
      });
    }

    // Crisis state
    if (current < 30) {
      this.emit('crisis', {
        type: 'coherence_crisis',
        level: current,
        message: 'Field in crisis - immediate healing required'
      });
    }
  }

  /**
   * Get field analytics over time period
   */
  async getFieldAnalytics(timeRange = 3600000) { // 1 hour default
    const since = Date.now() - timeRange;
    
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM field_states WHERE timestamp > ? ORDER BY timestamp`,
        [since],
        (err, rows) => {
          if (err) return reject(err);
          
          const analytics = {
            currentCoherence: this.currentCoherence,
            averageCoherence: this.calculateAverage(rows, 'coherence'),
            volatility: this.calculateVolatility(rows),
            trend: this.calculateTrend(rows),
            eventFrequency: this.analyzeEventFrequency(rows),
            topImpactEvents: this.findTopImpactEvents(rows),
            patterns: this.identifyPatterns(rows),
            recommendations: this.generateRecommendations(rows)
          };
          
          resolve(analytics);
        }
      );
    });
  }

  /**
   * Get real-time field pulse for visualization
   */
  getFieldPulse() {
    // Create a "heartbeat" representation of field health
    const baseRate = 60; // Base BPM
    const coherenceMultiplier = this.currentCoherence / 100;
    
    return {
      rate: baseRate + (coherenceMultiplier * 40), // 60-100 BPM
      strength: coherenceMultiplier,
      rhythm: this.currentCoherence > 70 ? 'regular' : 'irregular',
      color: this.getFieldColor(this.currentCoherence)
    };
  }

  /**
   * Generate healing recommendations based on field state
   */
  async generateHealingProtocol() {
    const analytics = await this.getFieldAnalytics();
    const protocol = [];

    if (this.currentCoherence < 50) {
      protocol.push({
        priority: 'high',
        action: 'group_attunement',
        description: 'Immediate group attunement ceremony recommended',
        duration: '30 minutes'
      });
    }

    if (analytics.volatility > 10) {
      protocol.push({
        priority: 'medium',
        action: 'stabilization',
        description: 'Field stabilization through synchronized breathing',
        duration: '15 minutes'
      });
    }

    if (analytics.trend < 0) {
      protocol.push({
        priority: 'medium',
        action: 'energy_clearing',
        description: 'Clear stagnant patterns through movement or sound',
        duration: '20 minutes'
      });
    }

    // Always include maintenance
    protocol.push({
      priority: 'low',
      action: 'gratitude_round',
      description: 'Appreciation circle to maintain coherence',
      duration: '10 minutes'
    });

    return protocol;
  }

  // Analytics helper methods
  calculateAverage(rows, field) {
    if (rows.length === 0) return 0;
    const sum = rows.reduce((acc, row) => acc + row[field], 0);
    return sum / rows.length;
  }

  calculateVolatility(rows) {
    if (rows.length < 2) return 0;
    
    let changes = 0;
    for (let i = 1; i < rows.length; i++) {
      changes += Math.abs(rows[i].coherence - rows[i-1].coherence);
    }
    
    return changes / (rows.length - 1);
  }

  calculateTrend(rows) {
    if (rows.length < 2) return 0;
    
    const first = rows[0]?.coherence || this.currentCoherence;
    const last = rows[rows.length - 1]?.coherence || this.currentCoherence;
    
    return last - first;
  }

  analyzeEventFrequency(rows) {
    const frequency = {};
    
    rows.forEach(row => {
      const type = row.event_type;
      frequency[type] = (frequency[type] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));
  }

  findTopImpactEvents(rows) {
    return rows
      .filter(row => row.impact)
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
      .slice(0, 5)
      .map(row => ({
        type: row.event_type,
        impact: row.impact,
        agent: row.agent_id,
        timestamp: row.timestamp
      }));
  }

  identifyPatterns(rows) {
    const patterns = [];
    
    // Look for rapid coherence increases
    const increases = rows.filter((row, i) => 
      i > 0 && row.coherence > rows[i-1].coherence + 5
    );
    
    if (increases.length > 0) {
      patterns.push({
        type: 'rapid_coherence_increase',
        frequency: increases.length,
        description: 'Sudden positive shifts in field coherence'
      });
    }

    // Look for collaboration patterns
    const collaborations = rows.filter(row => 
      row.event_type?.includes('collaborate') || row.event_type?.includes('resonant')
    );
    
    if (collaborations.length > rows.length * 0.3) {
      patterns.push({
        type: 'high_collaboration',
        frequency: collaborations.length,
        description: 'Strong collaborative energy in the field'
      });
    }

    return patterns;
  }

  generateRecommendations(rows) {
    const recommendations = [];
    const avgCoherence = this.calculateAverage(rows, 'coherence');
    
    if (avgCoherence < 70) {
      recommendations.push('Schedule regular group attunements');
    }
    
    if (this.calculateVolatility(rows) > 10) {
      recommendations.push('Implement sacred pause protocols');
    }
    
    const negativeEvents = rows.filter(row => row.impact < 0);
    if (negativeEvents.length > rows.length * 0.3) {
      recommendations.push('Address sources of field disruption');
    }

    return recommendations;
  }

  getFieldColor(coherence) {
    if (coherence >= 85) return '#4ecdc4'; // Turquoise - high coherence
    if (coherence >= 70) return '#95e1d3'; // Mint - good coherence
    if (coherence >= 50) return '#f6d55c'; // Yellow - moderate
    if (coherence >= 30) return '#ed553b'; // Orange - low
    return '#d63031'; // Red - critical
  }

  // Database operations
  async recordFieldState(state) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO field_states 
         (timestamp, coherence, event_type, event_detail, impact, agent_id, collective_state) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          Date.now(),
          state.coherence,
          state.eventType,
          state.eventDetail,
          state.impact,
          state.agentId,
          state.collectiveState
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async loadCurrentState() {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT coherence FROM field_states ORDER BY timestamp DESC LIMIT 1',
        (err, row) => {
          if (err) return reject(err);
          if (row) {
            this.currentCoherence = row.coherence;
          }
          resolve(this.currentCoherence);
        }
      );
    });
  }
}

module.exports = FieldCoherenceTracker;