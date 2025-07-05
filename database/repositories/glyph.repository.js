// Glyph Repository - Sacred glyph practice management
import { getConnection } from '../connection.js';

export class GlyphRepository {
  constructor() {
    this.connection = getConnection();
  }

  async getAllGlyphs() {
    const db = this.connection.getDb();
    const result = await db.query('SELECT * FROM glyph ORDER BY id');
    return result[0] || [];
  }

  async getGlyphById(id) {
    const db = this.connection.getDb();
    const [glyph] = await db.select(`glyph:${id}`);
    return glyph;
  }

  async getGlyphsByCategory(category) {
    const db = this.connection.getDb();
    const result = await db.query(
      'SELECT * FROM glyph WHERE category = $category ORDER BY id',
      { category }
    );
    return result[0] || [];
  }

  async getAvailableGlyphs(userId) {
    const db = this.connection.getDb();
    
    // Get user's current coherence and practiced glyphs
    const result = await db.query(`
      LET $coherence = fn::current_coherence($userId);
      LET $practiced = (SELECT glyph FROM glyph_mastery WHERE user = $userId);
      
      SELECT * FROM glyph 
      WHERE coherence_required <= $coherence
      ORDER BY coherence_required ASC, id ASC;
    `, { userId });
    
    return result[0] || [];
  }

  async getRecommendedGlyphs(userId) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      'SELECT fn::recommend_glyphs($user) as recommendations',
      { user: userId }
    );
    
    return result[0]?.[0]?.recommendations || [];
  }

  async startPractice(userId, glyphId, startingCoherence) {
    const db = this.connection.getDb();
    
    const [practice] = await db.create('glyph_practice', {
      user: userId,
      glyph: glyphId,
      started_at: new Date().toISOString(),
      starting_coherence: startingCoherence,
      binaural_frequency: await this.getGlyphFrequency(glyphId)
    });

    return practice;
  }

  async completePractice(practiceId, endingCoherence, peakCoherence, insights = []) {
    const db = this.connection.getDb();
    
    const now = new Date();
    const [practice] = await db.select(`glyph_practice:${practiceId}`);
    
    if (!practice) {
      throw new Error('Practice session not found');
    }

    const duration = now - new Date(practice.started_at);
    const practiceQuality = this.calculatePracticeQuality(
      practice.starting_coherence,
      endingCoherence,
      peakCoherence
    );

    // Update practice session
    const [updated] = await db.merge(`glyph_practice:${practiceId}`, {
      completed_at: now.toISOString(),
      duration: `${Math.floor(duration / 1000)}s`,
      ending_coherence: endingCoherence,
      peak_coherence: peakCoherence,
      practice_quality: practiceQuality,
      insights
    });

    // Update mastery tracking
    await this.updateMastery(practice.user, practice.glyph, duration, endingCoherence);

    return updated;
  }

  calculatePracticeQuality(starting, ending, peak) {
    // Quality based on improvement and peak achievement
    const improvement = ending - starting;
    const peakBonus = peak > 0.8 ? 0.2 : peak > 0.7 ? 0.1 : 0;
    
    let quality = 0.5; // Base quality
    quality += Math.max(0, improvement * 2); // Reward improvement
    quality += peakBonus; // Bonus for high peaks
    
    return Math.min(1, Math.max(0, quality));
  }

  async updateMastery(userId, glyphId, durationMs, coherence) {
    const db = this.connection.getDb();
    
    // Check if mastery record exists
    const existing = await db.query(
      'SELECT * FROM glyph_mastery WHERE user = $user AND glyph = $glyph',
      { user: userId, glyph: glyphId }
    );

    if (existing[0]?.length) {
      // Update existing mastery
      const current = existing[0][0];
      const newCount = current.times_practiced + 1;
      const newDuration = current.total_duration + `${Math.floor(durationMs / 1000)}s`;
      const newAvg = ((current.average_coherence * current.times_practiced) + coherence) / newCount;
      
      await db.merge(`glyph_mastery:${current.id}`, {
        times_practiced: newCount,
        total_duration: newDuration,
        average_coherence: newAvg,
        mastery_level: this.calculateMasteryLevel(newCount, newAvg)
      });
    } else {
      // Create new mastery record
      await db.create('glyph_mastery', {
        user: userId,
        glyph: glyphId,
        first_practiced: new Date().toISOString(),
        times_practiced: 1,
        total_duration: `${Math.floor(durationMs / 1000)}s`,
        average_coherence: coherence,
        mastery_level: 0,
        unlocked_variations: []
      });
    }
  }

  calculateMasteryLevel(timesPracticed, avgCoherence) {
    let level = 0;
    
    if (timesPracticed >= 3 && avgCoherence >= 0.6) level = 1;
    if (timesPracticed >= 7 && avgCoherence >= 0.65) level = 2;
    if (timesPracticed >= 21 && avgCoherence >= 0.7) level = 3;
    if (timesPracticed >= 40 && avgCoherence >= 0.75) level = 4;
    if (timesPracticed >= 100 && avgCoherence >= 0.8) level = 5;
    
    return level;
  }

  async getGlyphFrequency(glyphId) {
    const db = this.connection.getDb();
    const [glyph] = await db.select(`glyph:${glyphId}`);
    
    return glyph?.frequency || 528; // Default to love frequency
  }

  async getUserPracticeHistory(userId, limit = 50) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `SELECT * FROM glyph_practice 
       WHERE user = $user 
       ORDER BY started_at DESC 
       LIMIT $limit`,
      { user: userId, limit }
    );
    
    return result[0] || [];
  }

  async getUserMastery(userId) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      'SELECT * FROM glyph_mastery WHERE user = $user ORDER BY mastery_level DESC',
      { user: userId }
    );
    
    return result[0] || [];
  }

  async getGlyphStats(glyphId) {
    const db = this.connection.getDb();
    
    const result = await db.query(`
      LET $practices = (SELECT * FROM glyph_practice WHERE glyph = $glyph);
      
      RETURN {
        total_practices: count($practices),
        unique_practitioners: count(array::distinct($practices.user)),
        average_quality: math::mean($practices.practice_quality),
        average_duration: math::mean($practices.duration),
        peak_coherence_achieved: math::max($practices.peak_coherence)
      };
    `, { glyph: glyphId });
    
    return result[0]?.[0] || {
      total_practices: 0,
      unique_practitioners: 0,
      average_quality: 0,
      average_duration: 0,
      peak_coherence_achieved: 0
    };
  }

  async recordGroupPractice(sessionId, glyphId, participants) {
    const db = this.connection.getDb();
    
    // Create practice records for all participants
    const practices = await Promise.all(
      participants.map(p => 
        this.startPractice(p.userId, glyphId, p.startingCoherence)
      )
    );

    // Link to group session
    await Promise.all(
      practices.map(practice =>
        db.merge(`glyph_practice:${practice.id}`, {
          group_session: sessionId
        })
      )
    );

    return practices;
  }
}

export default GlyphRepository;