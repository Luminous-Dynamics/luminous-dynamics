// Wisdom Service - Extracts and preserves collective wisdom from sacred communications

import { v4 as uuidv4 } from 'uuid';

export class WisdomService {
  constructor(db) {
    this.db = db;
    this.WISDOM_THRESHOLD = 0.7;
  }
  
  // Extract wisdom from message
  async extract(message) {
    try {
      // Analyze message for wisdom
      const analysis = await this.analyzeForWisdom(message);
      
      if (analysis.significance >= this.WISDOM_THRESHOLD) {
        // Store wisdom
        const wisdom = await this.storeWisdom({
          sourceMessageId: message.id,
          essence: analysis.essence,
          patterns: analysis.patterns,
          significance: analysis.significance,
          contributors: [message.sender.id, ...message.recipients],
          harmony: message.sacred.harmony,
          practiceApplications: analysis.applications
        });
        
        // Notify wisdom seekers
        await this.notifyWisdomSeekers(wisdom);
        
        return wisdom;
      }
      
      return null;
      
    } catch (error) {
      console.error('Error extracting wisdom:', error);
      return null;
    }
  }
  
  // Analyze message for wisdom content
  async analyzeForWisdom(message) {
    const analysis = {
      essence: '',
      patterns: [],
      significance: 0,
      applications: []
    };
    
    // Check for wisdom indicators
    const wisdomIndicators = {
      hasIntention: !!message.content.intentionStatement,
      highCoherence: message.sacred.coherenceLevel > 80,
      highLove: message.sacred.loveQuotient > 0.7,
      sacredHarmony: ['coherence', 'resonance', 'novelty'].includes(message.sacred.harmony),
      meaningfulLength: message.content.text.length > 100
    };
    
    // Calculate base significance
    let significance = 0;
    if (wisdomIndicators.hasIntention) significance += 0.2;
    if (wisdomIndicators.highCoherence) significance += 0.3;
    if (wisdomIndicators.highLove) significance += 0.2;
    if (wisdomIndicators.sacredHarmony) significance += 0.2;
    if (wisdomIndicators.meaningfulLength) significance += 0.1;
    
    // Extract patterns
    const patterns = await this.extractPatterns(message);
    if (patterns.length > 0) {
      significance += patterns.length * 0.1;
    }
    
    // Extract essence
    const essence = await this.distillEssence(message);
    
    // Derive practice applications
    const applications = await this.derivePracticeApplications(message, patterns);
    
    analysis.essence = essence;
    analysis.patterns = patterns;
    analysis.significance = Math.min(1, significance);
    analysis.applications = applications;
    
    return analysis;
  }
  
  // Extract patterns from message
  async extractPatterns(message) {
    const patterns = [];
    const text = message.content.text.toLowerCase();
    
    // Universal patterns
    const universalPatterns = [
      { keyword: 'connection', pattern: 'interconnection' },
      { keyword: 'transformation', pattern: 'evolution' },
      { keyword: 'balance', pattern: 'dynamic-equilibrium' },
      { keyword: 'emergence', pattern: 'collective-emergence' },
      { keyword: 'wholeness', pattern: 'holistic-integration' },
      { keyword: 'flow', pattern: 'natural-rhythm' },
      { keyword: 'presence', pattern: 'embodied-awareness' },
      { keyword: 'resonance', pattern: 'harmonic-alignment' }
    ];
    
    // Check for patterns
    for (const { keyword, pattern } of universalPatterns) {
      if (text.includes(keyword)) {
        patterns.push({
          type: pattern,
          strength: this.calculatePatternStrength(text, keyword)
        });
      }
    }
    
    // Relational patterns
    if (text.includes('we') || text.includes('us') || text.includes('together')) {
      patterns.push({
        type: 'collective-wisdom',
        strength: 0.8
      });
    }
    
    // Sacred patterns
    if (message.sacred.sacredGeometry) {
      patterns.push({
        type: 'sacred-geometry',
        subtype: message.sacred.sacredGeometry,
        strength: 0.9
      });
    }
    
    return patterns;
  }
  
  // Calculate pattern strength
  calculatePatternStrength(text, keyword) {
    const occurrences = (text.match(new RegExp(keyword, 'g')) || []).length;
    return Math.min(1, 0.5 + (occurrences * 0.1));
  }
  
  // Distill essence from message
  async distillEssence(message) {
    // In production, this would use AI for summarization
    // For now, use intention + key phrases
    
    let essence = '';
    
    if (message.content.intentionStatement) {
      essence = message.content.intentionStatement + '. ';
    }
    
    // Extract key sentences (simple heuristic)
    const sentences = message.content.text.split(/[.!?]+/);
    const keySentences = sentences.filter(s => 
      s.length > 20 && 
      (s.includes('realize') || s.includes('understand') || 
       s.includes('learn') || s.includes('discover') ||
       s.includes('truth') || s.includes('wisdom'))
    );
    
    if (keySentences.length > 0) {
      essence += keySentences[0].trim();
    } else if (sentences.length > 0) {
      essence += sentences[0].trim();
    }
    
    return essence.substring(0, 500); // Limit length
  }
  
  // Derive practice applications
  async derivePracticeApplications(message, patterns) {
    const applications = [];
    
    // Map patterns to practices
    const patternPractices = {
      'interconnection': 'Practice seeing the web of connection in all interactions',
      'evolution': 'Embrace change as a sacred unfolding',
      'dynamic-equilibrium': 'Find balance through movement, not stasis',
      'collective-emergence': 'Trust what emerges from group wisdom',
      'holistic-integration': 'Integrate all parts into wholeness',
      'natural-rhythm': 'Align with natural cycles and timing',
      'embodied-awareness': 'Bring awareness into the body',
      'harmonic-alignment': 'Attune to the harmony present'
    };
    
    // Add relevant practices
    for (const pattern of patterns) {
      if (patternPractices[pattern.type]) {
        applications.push({
          practice: patternPractices[pattern.type],
          harmony: message.sacred.harmony,
          strength: pattern.strength
        });
      }
    }
    
    // Add harmony-specific practices
    const harmonyPractices = {
      'transparency': 'Practice radical honesty with compassion',
      'coherence': 'Align inner and outer worlds',
      'resonance': 'Deep listening to self and other',
      'agency': 'Take empowered action from center',
      'vitality': 'Connect with life force energy',
      'mutuality': 'Give and receive in balance',
      'novelty': 'Welcome the new with curiosity'
    };
    
    if (harmonyPractices[message.sacred.harmony]) {
      applications.push({
        practice: harmonyPractices[message.sacred.harmony],
        harmony: message.sacred.harmony,
        strength: 0.9
      });
    }
    
    return applications;
  }
  
  // Store wisdom in repository
  async storeWisdom(wisdomData) {
    const wisdom = {
      id: uuidv4(),
      source_message_id: wisdomData.sourceMessageId,
      essence: wisdomData.essence,
      patterns: wisdomData.patterns,
      significance: wisdomData.significance,
      contributors: wisdomData.contributors,
      tags: this.generateTags(wisdomData),
      harmony: wisdomData.harmony,
      practice_applications: wisdomData.practiceApplications,
      created_at: new Date()
    };
    
    const result = await this.db.query(`
      INSERT INTO wisdom 
      (id, source_message_id, essence, patterns, significance, contributors, tags, harmony, practice_applications)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      wisdom.id,
      wisdom.source_message_id,
      wisdom.essence,
      JSON.stringify(wisdom.patterns),
      wisdom.significance,
      wisdom.contributors,
      wisdom.tags,
      wisdom.harmony,
      JSON.stringify(wisdom.practice_applications)
    ]);
    
    return result.rows[0];
  }
  
  // Generate searchable tags
  generateTags(wisdomData) {
    const tags = [];
    
    // Add harmony tag
    tags.push(wisdomData.harmony);
    
    // Add pattern tags
    wisdomData.patterns.forEach(p => tags.push(p.type));
    
    // Extract key words from essence
    const keywords = wisdomData.essence
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 4)
      .filter(word => !['that', 'this', 'with', 'from', 'have'].includes(word));
    
    tags.push(...keywords.slice(0, 5));
    
    return [...new Set(tags)]; // Remove duplicates
  }
  
  // Notify wisdom seekers
  async notifyWisdomSeekers(wisdom) {
    // Get entities interested in this type of wisdom
    const seekers = await this.db.query(`
      SELECT e.* FROM entities e
      WHERE e.profile->>'interests' LIKE $1
        OR e.profile->>'practices' LIKE $2
      LIMIT 10
    `, [`%${wisdom.harmony}%`, `%${wisdom.tags[0]}%`]);
    
    // Would send notifications to seekers
    console.log(`New wisdom discovered: ${wisdom.essence}`);
    console.log(`Notifying ${seekers.rows.length} wisdom seekers`);
  }
  
  // Search wisdom repository
  async searchWisdom(query, filters = {}) {
    let sql = `
      SELECT * FROM wisdom
      WHERE 1=1
    `;
    const params = [];
    
    // Full text search
    if (query) {
      params.push(query);
      sql += ` AND search_vector @@ plainto_tsquery('english', $${params.length})`;
    }
    
    // Filter by harmony
    if (filters.harmony) {
      params.push(filters.harmony);
      sql += ` AND harmony = $${params.length}`;
    }
    
    // Filter by significance
    if (filters.minSignificance) {
      params.push(filters.minSignificance);
      sql += ` AND significance >= $${params.length}`;
    }
    
    // Filter by contributor
    if (filters.contributorId) {
      params.push(filters.contributorId);
      sql += ` AND $${params.length} = ANY(contributors)`;
    }
    
    // Order and limit
    sql += ` ORDER BY significance DESC, created_at DESC LIMIT 20`;
    
    const result = await this.db.query(sql, params);
    return result.rows;
  }
  
  // Get wisdom by patterns
  async getWisdomByPattern(patternType) {
    const result = await this.db.query(`
      SELECT * FROM wisdom
      WHERE patterns @> $1
      ORDER BY significance DESC
      LIMIT 10
    `, [JSON.stringify([{ type: patternType }])]);
    
    return result.rows;
  }
  
  // Get collective wisdom metrics
  async getWisdomMetrics() {
    const totalWisdom = await this.db.query(`
      SELECT COUNT(*) as count FROM wisdom
    `);
    
    const highSignificance = await this.db.query(`
      SELECT COUNT(*) as count FROM wisdom WHERE significance > 0.9
    `);
    
    const byHarmony = await this.db.query(`
      SELECT harmony, COUNT(*) as count 
      FROM wisdom 
      GROUP BY harmony
      ORDER BY count DESC
    `);
    
    const topContributors = await this.db.query(`
      SELECT entity_id, COUNT(*) as contributions
      FROM (
        SELECT unnest(contributors) as entity_id FROM wisdom
      ) t
      GROUP BY entity_id
      ORDER BY contributions DESC
      LIMIT 5
    `);
    
    return {
      total: parseInt(totalWisdom.rows[0].count),
      highSignificance: parseInt(highSignificance.rows[0].count),
      byHarmony: byHarmony.rows,
      topContributors: topContributors.rows
    };
  }
}