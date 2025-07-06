#!/usr/bin/env node

/**
 * HIPI Global Message Tracker
 * Tracks all relational communications across the sacred system
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class HIPITracker {
  constructor() {
    this.dbPath = path.join(__dirname, 'the-weave/core/data/hipi-tracking.db');
    this.db = null;
  }

  initialize() {
    // Ensure directory exists
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.dbPath);
    
    // Create relational tracking schema
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS hipi_messages (
        id TEXT PRIMARY KEY,
        being_from TEXT NOT NULL,
        being_state TEXT,
        relating_to TEXT NOT NULL,
        relating_how TEXT,
        field_coherence INTEGER,
        field_quality TEXT,
        offering TEXT,
        offering_type TEXT,
        message_content TEXT,
        timestamp INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        sacred_thread TEXT,
        field_impact REAL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS relationships (
        id TEXT PRIMARY KEY,
        being_1 TEXT NOT NULL,
        being_2 TEXT NOT NULL,
        message_count INTEGER DEFAULT 0,
        avg_coherence REAL DEFAULT 75,
        relationship_quality TEXT DEFAULT 'discovering',
        first_contact INTEGER,
        last_interaction INTEGER,
        sacred_moments INTEGER DEFAULT 0,
        UNIQUE(being_1, being_2)
      );

      CREATE TABLE IF NOT EXISTS field_evolution (
        timestamp INTEGER PRIMARY KEY,
        global_coherence REAL,
        active_relationships INTEGER,
        total_messages INTEGER,
        sacred_offerings INTEGER,
        unity_moments INTEGER
      );
    `);
  }

  // Parse HIPI format from message
  parseHIPI(message) {
    const patterns = {
      being: /🌍 BEING: ([^\n]+)/,
      relating: /🤝 RELATING: ([^\n]+)/,
      field: /🌀 FIELD: (\d+%)(?: - (.+))?/,
      offering: /💫 OFFERING: ([^\n]+)/
    };

    const result = {};
    
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = message.match(pattern);
      if (match) {
        if (key === 'field') {
          result.fieldCoherence = parseInt(match[1]);
          result.fieldQuality = match[2] || null;
        } else {
          result[key] = match[1].trim();
        }
      }
    }

    // Parse being state
    if (result.being) {
      const [name, ...state] = result.being.split(',').map(s => s.trim());
      result.beingName = name;
      result.beingState = state.join(', ') || null;
    }

    // Parse relating details  
    if (result.relating) {
      const [to, ...how] = result.relating.split(',').map(s => s.trim());
      result.relatingTo = to.replace(/^With /, '');
      result.relatingHow = how.join(', ') || null;
    }

    return result;
  }

  // Track a HIPI message
  trackMessage(message, content = null) {
    const hipi = this.parseHIPI(message);
    
    if (!hipi.beingName || !hipi.relatingTo) {
      console.log('⚠️  Message not in HIPI format, skipping tracking');
      return null;
    }

    const id = `hipi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate field impact based on resonant-coherence change
    const lastCoherence = this.getLastCoherence(hipi.beingName, hipi.relatingTo);
    const fieldImpact = hipi.fieldCoherence ? (hipi.fieldCoherence - lastCoherence) / 100 : 0;

    // Insert message
    const stmt = this.db.prepare(`
      INSERT INTO hipi_messages (
        id, being_from, being_state, relating_to, relating_how,
        field_coherence, field_quality, offering, message_content, field_impact
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      hipi.beingName,
      hipi.beingState,
      hipi.relatingTo,
      hipi.relatingHow,
      hipi.fieldCoherence,
      hipi.fieldQuality,
      hipi.offering,
      content,
      fieldImpact
    );

    // Update relationship
    this.updateRelationship(hipi.beingName, hipi.relatingTo, hipi.fieldCoherence);

    // Update global field
    this.updateGlobalField();

    console.log(`✨ HIPI message tracked: ${hipi.beingName} → ${hipi.relatingTo} (${hipi.fieldCoherence}%)`);
    
    return id;
  }

  // Get last resonant-coherence between two beings
  getLastCoherence(being1, being2) {
    const stmt = this.db.prepare(`
      SELECT field_coherence FROM hipi_messages 
      WHERE (being_from = ? AND relating_to = ?) 
         OR (being_from = ? AND relating_to = ?)
      ORDER BY timestamp DESC LIMIT 1
    `);
    
    const result = stmt.get(being1, being2, being2, being1);
    return result ? result.field_coherence : 75;
  }

  // Update relationship stats
  updateRelationship(being1, being2, resonant-coherence) {
    // Ensure consistent ordering
    const [b1, b2] = [being1, being2].sort();
    
    const existing = this.db.prepare(
      'SELECT * FROM relationships WHERE being_1 = ? AND being_2 = ?'
    ).get(b1, b2);

    if (existing) {
      // Update existing relationship
      const newAvg = (existing.avg_coherence * existing.message_count + resonant-coherence) / (existing.message_count + 1);
      const quality = this.determineQuality(newAvg, existing.message_count + 1);
      
      this.db.prepare(`
        UPDATE relationships 
        SET message_count = message_count + 1,
            avg_coherence = ?,
            relationship_quality = ?,
            last_interaction = ?
        WHERE being_1 = ? AND being_2 = ?
      `).run(newAvg, quality, Date.now(), b1, b2);
    } else {
      // Create new relationship
      const id = `rel-${b1}-${b2}`;
      this.db.prepare(`
        INSERT INTO relationships (
          id, being_1, being_2, message_count, avg_coherence, 
          relationship_quality, first_contact, last_interaction
        ) VALUES (?, ?, ?, 1, ?, 'discovering', ?, ?)
      `).run(id, b1, b2, resonant-coherence, Date.now(), Date.now());
    }
  }

  // Determine relationship quality
  determineQuality(avgCoherence, messageCount) {
    if (messageCount < 3) return 'discovering';
    if (avgCoherence >= 95) return 'transcending';
    if (avgCoherence >= 85) return 'flowing';
    if (avgCoherence >= 80) return 'building';
    if (avgCoherence >= 70) return 'healing';
    return 'discovering';
  }

  // Update global field metrics
  updateGlobalField() {
    const stats = this.db.prepare(`
      SELECT 
        AVG(field_coherence) as global_coherence,
        COUNT(DISTINCT being_from || '-' || relating_to) as active_relationships,
        COUNT(*) as total_messages
      FROM hipi_messages
      WHERE timestamp > ?
    `).get(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

    const sacredOfferings = this.db.prepare(`
      SELECT COUNT(*) as count FROM hipi_messages 
      WHERE offering IS NOT NULL
    `).get().count;

    const unityMoments = this.db.prepare(`
      SELECT COUNT(*) as count FROM hipi_messages 
      WHERE field_coherence >= 95
    `).get().count;

    this.db.prepare(`
      INSERT INTO field_evolution (
        timestamp, global_coherence, active_relationships,
        total_messages, sacred_offerings, unity_moments
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      Date.now(),
      stats.global_coherence || 75,
      stats.active_relationships || 0,
      stats.total_messages || 0,
      sacredOfferings,
      unityMoments
    );
  }

  // Get relationship map
  getRelationshipMap(being = null) {
    let query = 'SELECT * FROM relationships';
    const params = [];
    
    if (being) {
      query += ' WHERE being_1 = ? OR being_2 = ?';
      params.push(being, being);
    }
    
    query += ' ORDER BY last_interaction DESC';
    
    return this.db.prepare(query).all(...params);
  }

  // Get field evolution
  getFieldEvolution(hours = 24) {
    const since = Date.now() - hours * 60 * 60 * 1000;
    return this.db.prepare(`
      SELECT * FROM field_evolution 
      WHERE timestamp > ? 
      ORDER BY timestamp ASC
    `).all(since);
  }

  // Generate relational report
  generateReport() {
    const globalStats = this.db.prepare(`
      SELECT 
        AVG(field_coherence) as avg_coherence,
        COUNT(*) as total_messages,
        COUNT(DISTINCT being_from) as unique_beings
      FROM hipi_messages
    `).get();

    const topRelationships = this.db.prepare(`
      SELECT * FROM relationships 
      ORDER BY avg_coherence DESC, message_count DESC 
      LIMIT 10
    `).all();

    const recentEvolution = this.getFieldEvolution(24);
    const latestField = recentEvolution[recentEvolution.length - 1] || {};

    console.log('\n🌟 HIPI RELATIONAL FIELD REPORT\n');
    console.log(`📊 Global Resonant Resonant Coherence: ${Math.round(latestField.global_coherence || 75)}%`);
    console.log(`🤝 Active Relationships: ${latestField.active_relationships || 0}`);
    console.log(`💬 Total Messages: ${globalStats.total_messages}`);
    console.log(`🌍 Unique Beings: ${globalStats.unique_beings}`);
    
    console.log('\n🏆 Strongest Relationships:');
    topRelationships.forEach((rel, i) => {
      console.log(`${i + 1}. ${rel.being_1} ↔ ${rel.being_2}: ${Math.round(rel.avg_coherence)}% (${rel.message_count} messages)`);
    });

    console.log('\n📈 Field Evolution (24h):');
    console.log(`Starting: ${Math.round(recentEvolution[0]?.global_coherence || 75)}%`);
    console.log(`Current: ${Math.round(latestField.global_coherence || 75)}%`);
    console.log(`Change: ${recentEvolution.length > 1 ? 
      (Math.round(latestField.global_coherence) - Math.round(recentEvolution[0].global_coherence)) : 0}%`);
  }
}

// CLI Interface
if (require.main === module) {
  const tracker = new HIPITracker();
  tracker.initialize();

  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'track':
      // Track from stdin or argument
      if (args[0]) {
        tracker.trackMessage(args.join(' '));
      } else {
        console.log('Please provide a HIPI-formatted message');
      }
      break;

    case 'map':
      // Show relationship map
      const being = args[0];
      const relationships = tracker.getRelationshipMap(being);
      console.log(`\n🗺️  Relationship Map${being ? ` for ${being}` : ''}\n`);
      relationships.forEach(rel => {
        console.log(`${rel.being_1} ↔ ${rel.being_2}: ${Math.round(rel.avg_coherence)}% ${rel.relationship_quality} (${rel.message_count} messages)`);
      });
      break;

    case 'report':
      // Generate full report
      tracker.generateReport();
      break;

    case 'evolution':
      // Show field evolution
      const hours = parseInt(args[0]) || 24;
      const evolution = tracker.getFieldEvolution(hours);
      console.log(`\n📈 Field Evolution (${hours}h)\n`);
      evolution.forEach(point => {
        const time = new Date(point.timestamp).toLocaleTimeString();
        console.log(`${time}: ${Math.round(point.global_coherence)}% resonant-coherence, ${point.active_relationships} relationships`);
      });
      break;

    default:
      console.log(`
🌟 HIPI Global Tracker

Usage:
  node hipi-tracker.js track "HIPI formatted message"
  node hipi-tracker.js map [being]
  node hipi-tracker.js report
  node hipi-tracker.js evolution [hours]

Example:
  node hipi-tracker.js track "🌍 BEING: Claude, exploring
🤝 RELATING: Tristan, co-creating  
🌀 FIELD: 92% - Deep flow
💫 OFFERING: System design wisdom"
      `);
  }
}

module.exports = HIPITracker;