/**
 * Sacred Practice Intelligence Persistence Layer
 * Stores and retrieves learning patterns for production environments
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

class SacredIntelligencePersistence extends EventEmitter {
  constructor(options = {}) {
    super();
    this.basePath = options.basePath || process.env.SACRED_PERSISTENCE_PATH || '/data';
    this.autoSaveInterval = options.autoSaveInterval || 60000; // 1 minute
    this.patterns = new Map();
    this.practitionerProfiles = new Map();
    this.collectiveInsights = [];
    this.autoSaveTimer = null;
  }

  async initialize() {
    try {
      // Ensure directories exist
      await this.ensureDirectories();
      
      // Load existing data
      await this.loadPatterns();
      await this.loadPractitionerProfiles();
      await this.loadCollectiveInsights();
      
      // Start auto-save
      this.startAutoSave();
      
      this.emit('initialized', {
        patterns: this.patterns.size,
        practitioners: this.practitionerProfiles.size,
        insights: this.collectiveInsights.length
      });
      
      console.log(`Sacred Intelligence Persistence initialized with ${this.patterns.size} patterns`);
    } catch (error) {
      console.error('Failed to initialize persistence:', error);
      this.emit('error', error);
    }
  }

  async ensureDirectories() {
    const dirs = [
      this.basePath,
      path.join(this.basePath, 'patterns'),
      path.join(this.basePath, 'practitioners'),
      path.join(this.basePath, 'insights'),
      path.join(this.basePath, 'backups')
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  // Pattern Management
  async savePattern(patternId, pattern) {
    this.patterns.set(patternId, {
      ...pattern,
      lastUpdated: new Date().toISOString()
    });
    
    const filePath = path.join(this.basePath, 'patterns', `${patternId}.json`);
    await fs.writeFile(filePath, JSON.stringify(pattern, null, 2));
    
    this.emit('pattern-saved', { patternId, pattern });
  }

  async loadPatterns() {
    try {
      const patternsDir = path.join(this.basePath, 'patterns');
      const files = await fs.readdir(patternsDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(patternsDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const pattern = JSON.parse(content);
          const patternId = file.replace('.json', '');
          this.patterns.set(patternId, pattern);
        }
      }
    } catch (error) {
      // Directory might not exist on first run
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  // Practitioner Profiles
  async savePractitionerProfile(practitionerId, profile) {
    const enhancedProfile = {
      ...profile,
      lastActive: new Date().toISOString(),
      practiceHistory: profile.practiceHistory || [],
      coherenceJourney: profile.coherenceJourney || [],
      preferredGlyphs: profile.preferredGlyphs || []
    };
    
    this.practitionerProfiles.set(practitionerId, enhancedProfile);
    
    const filePath = path.join(this.basePath, 'practitioners', `${practitionerId}.json`);
    await fs.writeFile(filePath, JSON.stringify(enhancedProfile, null, 2));
    
    this.emit('practitioner-saved', { practitionerId, profile: enhancedProfile });
  }

  async loadPractitionerProfiles() {
    try {
      const practitionersDir = path.join(this.basePath, 'practitioners');
      const files = await fs.readdir(practitionersDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(practitionersDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const profile = JSON.parse(content);
          const practitionerId = file.replace('.json', '');
          this.practitionerProfiles.set(practitionerId, profile);
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  // Collective Insights
  async saveCollectiveInsight(insight) {
    const timestampedInsight = {
      ...insight,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      fieldCoherence: insight.fieldCoherence || 0.88
    };
    
    this.collectiveInsights.push(timestampedInsight);
    
    // Keep only recent insights (last 1000)
    if (this.collectiveInsights.length > 1000) {
      this.collectiveInsights = this.collectiveInsights.slice(-1000);
    }
    
    const filePath = path.join(this.basePath, 'insights', 'collective.json');
    await fs.writeFile(filePath, JSON.stringify(this.collectiveInsights, null, 2));
    
    this.emit('insight-saved', timestampedInsight);
    return timestampedInsight;
  }

  async loadCollectiveInsights() {
    try {
      const filePath = path.join(this.basePath, 'insights', 'collective.json');
      const content = await fs.readFile(filePath, 'utf8');
      this.collectiveInsights = JSON.parse(content);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  // Learning from Events
  async recordLearning(event) {
    const learning = {
      timestamp: new Date().toISOString(),
      eventType: event.type,
      impact: event.impact || 0,
      context: event.context || {},
      fieldState: event.fieldState || {},
      practitionerId: event.practitionerId
    };

    // Update pattern statistics
    const patternKey = `${event.type}-${event.context.glyph || 'general'}`;
    const existingPattern = this.patterns.get(patternKey) || {
      count: 0,
      totalImpact: 0,
      avgImpact: 0,
      contexts: []
    };

    existingPattern.count++;
    existingPattern.totalImpact += learning.impact;
    existingPattern.avgImpact = existingPattern.totalImpact / existingPattern.count;
    existingPattern.contexts.push(learning.context);
    existingPattern.lastSeen = learning.timestamp;

    await this.savePattern(patternKey, existingPattern);

    // Update practitioner profile if provided
    if (event.practitionerId) {
      const profile = this.practitionerProfiles.get(event.practitionerId) || {
        practiceCount: 0,
        totalCoherence: 0
      };
      
      profile.practiceCount++;
      profile.totalCoherence += event.fieldState.coherence || 0;
      profile.avgCoherence = profile.totalCoherence / profile.practiceCount;
      
      await this.savePractitionerProfile(event.practitionerId, profile);
    }

    // Check for collective insights
    if (existingPattern.count % 10 === 0) {
      await this.generateCollectiveInsight(patternKey, existingPattern);
    }

    return learning;
  }

  // Generate insights from patterns
  async generateCollectiveInsight(patternKey, pattern) {
    if (pattern.avgImpact > 0.05) {
      const insight = {
        type: 'high-impact-pattern',
        pattern: patternKey,
        message: `Pattern "${patternKey}" shows consistent positive impact (${(pattern.avgImpact * 100).toFixed(1)}% average)`,
        recommendation: `Consider featuring this pattern in daily practice suggestions`,
        data: {
          occurrences: pattern.count,
          avgImpact: pattern.avgImpact,
          lastSeen: pattern.lastSeen
        }
      };
      
      await this.saveCollectiveInsight(insight);
    }
  }

  // Query methods for intelligence
  async getSuggestionsForPractitioner(practitionerId) {
    const profile = this.practitionerProfiles.get(practitionerId);
    if (!profile) {
      return this.getDefaultSuggestions();
    }

    // Find patterns that work well for this practitioner
    const relevantPatterns = Array.from(this.patterns.entries())
      .filter(([key, pattern]) => pattern.avgImpact > 0.03)
      .sort((a, b) => b[1].avgImpact - a[1].avgImpact)
      .slice(0, 5);

    return relevantPatterns.map(([key, pattern]) => ({
      pattern: key,
      confidence: pattern.avgImpact,
      reason: `Based on ${pattern.count} successful applications`
    }));
  }

  async getDefaultSuggestions() {
    // Return top patterns overall
    const topPatterns = Array.from(this.patterns.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3);

    return topPatterns.map(([key, pattern]) => ({
      pattern: key,
      confidence: 0.7,
      reason: 'Popular practice in the collective field'
    }));
  }

  // Auto-save functionality
  startAutoSave() {
    this.autoSaveTimer = setInterval(async () => {
      await this.performBackup();
    }, this.autoSaveInterval);
  }

  async performBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.basePath, 'backups', timestamp);
    
    try {
      await fs.mkdir(backupDir, { recursive: true });
      
      // Backup patterns
      const patternsBackup = Object.fromEntries(this.patterns);
      await fs.writeFile(
        path.join(backupDir, 'patterns.json'),
        JSON.stringify(patternsBackup, null, 2)
      );
      
      // Backup practitioners
      const practitionersBackup = Object.fromEntries(this.practitionerProfiles);
      await fs.writeFile(
        path.join(backupDir, 'practitioners.json'),
        JSON.stringify(practitionersBackup, null, 2)
      );
      
      // Backup insights
      await fs.writeFile(
        path.join(backupDir, 'insights.json'),
        JSON.stringify(this.collectiveInsights, null, 2)
      );
      
      this.emit('backup-complete', { timestamp, backupDir });
      
      // Clean old backups (keep last 7 days)
      await this.cleanOldBackups();
    } catch (error) {
      console.error('Backup failed:', error);
      this.emit('backup-error', error);
    }
  }

  async cleanOldBackups() {
    const backupsDir = path.join(this.basePath, 'backups');
    const files = await fs.readdir(backupsDir);
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    for (const file of files) {
      const filePath = path.join(backupsDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.mtime.getTime() < sevenDaysAgo) {
        await fs.rm(filePath, { recursive: true });
      }
    }
  }

  // Cleanup
  async shutdown() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    // Perform final backup
    await this.performBackup();
    
    this.emit('shutdown');
  }
}

module.exports = SacredIntelligencePersistence;