// Coherence Repository - Sacred coherence data management
import { getConnection } from '../connection.js';

export class CoherenceRepository {
  constructor() {
    this.connection = getConnection();
  }

  async recordReading(reading) {
    const db = this.connection.getDb();
    
    const [coherenceReading] = await db.create('coherence_reading', {
      ...reading,
      timestamp: new Date().toISOString(),
      environmental_factors: await this.getEnvironmentalFactors()
    });

    // Check for milestones
    await this.checkMilestones(reading.user, coherenceReading);

    return coherenceReading;
  }

  async getEnvironmentalFactors() {
    const now = new Date();
    const hour = now.getHours();
    
    // Calculate moon phase (simplified)
    const moonCycle = 29.53;
    const knownNewMoon = new Date('2024-01-11');
    const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
    const moonPhase = (daysSince % moonCycle) / moonCycle;

    return {
      time_of_day: hour,
      day_of_week: now.getDay(),
      moon_phase: moonPhase,
      season: this.getSeason(now),
      time_zone_offset: now.getTimezoneOffset()
    };
  }

  getSeason(date) {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  async checkMilestones(userId, reading) {
    const db = this.connection.getDb();
    
    // Define milestone thresholds
    const milestones = [
      { type: 'first_60', threshold: 0.6, message: 'First time reaching 60% coherence!' },
      { type: 'first_70', threshold: 0.7, message: 'Breakthrough: 70% coherence achieved!' },
      { type: 'first_80', threshold: 0.8, message: 'Sacred threshold: 80% coherence!' },
      { type: 'first_90', threshold: 0.9, message: 'Master level: 90% coherence!' },
      { type: 'sustained_70', threshold: 0.7, sustained: true, message: 'Sustained 70%+ for 5 minutes' }
    ];

    for (const milestone of milestones) {
      if (reading.personal_coherence >= milestone.threshold) {
        // Check if milestone already achieved
        const existing = await db.query(
          'SELECT * FROM coherence_milestone WHERE user = $user AND milestone_type = $type',
          { user: userId, type: milestone.type }
        );

        if (!existing[0]?.length) {
          // Check sustained if required
          if (milestone.sustained) {
            const recent = await this.getRecentReadings(userId, 5);
            const allAboveThreshold = recent.every(r => r.personal_coherence >= milestone.threshold);
            
            if (!allAboveThreshold) continue;
          }

          // Create milestone
          await db.create('coherence_milestone', {
            user: userId,
            milestone_type: milestone.type,
            coherence_value: reading.personal_coherence,
            achieved_at: new Date().toISOString()
          });

          // Emit event for UI celebration
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('coherence-milestone', {
              detail: { type: milestone.type, message: milestone.message }
            }));
          }
        }
      }
    }
  }

  async getRecentReadings(userId, minutes = 5) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `SELECT * FROM coherence_reading 
       WHERE user = $user 
       AND timestamp > time::now() - ${minutes}m
       ORDER BY timestamp DESC`,
      { user: userId }
    );
    
    return result[0] || [];
  }

  async getUserCoherenceHistory(userId, hours = 24) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `SELECT * FROM coherence_reading 
       WHERE user = $user 
       AND timestamp > time::now() - ${hours}h
       ORDER BY timestamp ASC`,
      { user: userId }
    );
    
    return result[0] || [];
  }

  async getCurrentCoherence(userId) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      'SELECT fn::current_coherence($user) as coherence',
      { user: userId }
    );
    
    return result[0]?.[0]?.coherence || 0.5;
  }

  async getNetworkCoherence() {
    const db = this.connection.getDb();
    
    const result = await db.query(`
      LET $recent = (
        SELECT network_coherence 
        FROM coherence_reading 
        WHERE timestamp > time::now() - 5m
      );
      
      RETURN math::mean($recent.network_coherence) OR 0.5;
    `);
    
    return result[0]?.[0] || 0.5;
  }

  async getFieldCoherence() {
    const db = this.connection.getDb();
    
    const result = await db.query(`
      LET $recent = (
        SELECT field_coherence 
        FROM coherence_reading 
        WHERE timestamp > time::now() - 5m
      );
      
      RETURN math::mean($recent.field_coherence) OR 0.5;
    `);
    
    return result[0]?.[0] || 0.5;
  }

  async getCoherenceStats(userId, days = 7) {
    const db = this.connection.getDb();
    
    const result = await db.query(`
      LET $readings = (
        SELECT * FROM coherence_reading 
        WHERE user = $user 
        AND timestamp > time::now() - ${days}d
      );
      
      RETURN {
        average: math::mean($readings.personal_coherence),
        peak: math::max($readings.personal_coherence),
        minimum: math::min($readings.personal_coherence),
        total_readings: count($readings),
        trend: IF count($readings) > 10 THEN
          math::mean(array::slice($readings.personal_coherence, -5)) - 
          math::mean(array::slice($readings.personal_coherence, 0, 5))
        ELSE 0 END
      };
    `, { user: userId });
    
    return result[0]?.[0] || {
      average: 0.5,
      peak: 0.5,
      minimum: 0.5,
      total_readings: 0,
      trend: 0
    };
  }

  async getMilestones(userId) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      'SELECT * FROM coherence_milestone WHERE user = $user ORDER BY achieved_at DESC',
      { user: userId }
    );
    
    return result[0] || [];
  }

  async recordQuantumCorrelation(userId, quantumData, coherence) {
    const db = this.connection.getDb();
    
    return db.create('quantum_experiment', {
      user: userId,
      experiment_type: 'correlation',
      quantum_data: quantumData,
      coherence_at_time: coherence,
      correlation_score: this.calculateQuantumCorrelation(quantumData, coherence),
      timestamp: new Date().toISOString()
    });
  }

  calculateQuantumCorrelation(quantumData, coherence) {
    // Simple correlation calculation
    // In production, this would use more sophisticated algorithms
    const quantumAvg = quantumData.reduce((a, b) => a + b, 0) / quantumData.length;
    const normalizedQuantum = quantumAvg / 255; // Assuming 0-255 range
    
    return Math.abs(normalizedQuantum - coherence);
  }
}

export default CoherenceRepository;