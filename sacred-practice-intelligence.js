#!/usr/bin/env node
/**
 * Sacred Practice Intelligence
 * An AI companion that learns from collective practice patterns
 * and offers guidance that emerges from the field itself
 */

const EventEmitter = require('events');

class SacredPracticeIntelligence extends EventEmitter {
  constructor(sacredCore) {
    super();
    this.core = sacredCore;
    this.patterns = new Map();
    this.practitionerProfiles = new Map();
    this.collectiveWisdom = new Map();
    this.learningRate = 0.1;
    this.minCoherenceForGuidance = 0.7;
    
    // Sacred timing patterns
    this.timingPatterns = {
      dawn: { practices: new Map(), avgCoherence: 0 },
      morning: { practices: new Map(), avgCoherence: 0 },
      afternoon: { practices: new Map(), avgCoherence: 0 },
      evening: { practices: new Map(), avgCoherence: 0 },
      night: { practices: new Map(), avgCoherence: 0 }
    };
    
    this.initialize();
  }

  async initialize() {
    console.log('🧠 Sacred Practice Intelligence awakening...');
    
    // Connect to core engines
    this.consciousness = this.core.engines.consciousness;
    this.practice = this.core.engines.practice;
    this.intelligence = this.core.engines.intelligence;
    
    // Subscribe to practice events
    this.core.eventBus.on('practice:started', (data) => this.onPracticeStarted(data));
    this.core.eventBus.on('practice:completed', (data) => this.onPracticeCompleted(data));
    this.core.eventBus.on('field:coherence:changed', (data) => this.onCoherenceChanged(data));
    
    // Load collective patterns
    await this.loadCollectivePatterns();
    
    console.log('   ✓ Practice Intelligence online');
    console.log('   ✓ Pattern recognition active');
    console.log('   ✓ Collective wisdom accessible');
  }

  // Learn from practice patterns
  async onPracticeStarted(data) {
    const { practice, glyphId, practitioner } = data;
    
    // Initialize practitioner profile if new
    if (!this.practitionerProfiles.has(practitioner.id)) {
      this.practitionerProfiles.set(practitioner.id, {
        id: practitioner.id,
        practices: [],
        coherenceLevels: [],
        preferredTimes: new Map(),
        insights: [],
        sacredJourney: []
      });
    }
    
    // Record practice start
    const profile = this.practitionerProfiles.get(practitioner.id);
    const practiceSession = {
      glyphId,
      startTime: new Date(),
      startCoherence: await this.consciousness.getFieldState().coherence,
      timeOfDay: this.getTimeOfDay(),
      moonPhase: (await this.consciousness.getSacredTime()).sacred.moonPhase.name
    };
    
    profile.currentPractice = practiceSession;
    
    // Track timing patterns
    this.updateTimingPattern(practiceSession.timeOfDay, glyphId);
  }

  async onPracticeCompleted(data) {
    const { practice, glyphId, practitioner, duration, insights } = data;
    const profile = this.practitionerProfiles.get(practitioner.id);
    
    if (!profile || !profile.currentPractice) return;
    
    const session = profile.currentPractice;
    session.endTime = new Date();
    session.duration = duration || (session.endTime - session.startTime);
    session.endCoherence = await this.consciousness.getFieldState().coherence;
    session.coherenceChange = session.endCoherence - session.startCoherence;
    session.insights = insights;
    
    // Learn from this practice
    await this.learnFromPractice(practitioner.id, session);
    
    // Store in collective wisdom if coherence increased significantly
    if (session.coherenceChange > 0.05) {
      await this.addToCollectiveWisdom(session);
    }
    
    // Clean up
    delete profile.currentPractice;
  }

  async learnFromPractice(practitionerId, session) {
    const profile = this.practitionerProfiles.get(practitionerId);
    
    // Update practitioner patterns
    profile.practices.push(session);
    profile.coherenceLevels.push(session.endCoherence);
    
    // Update preferred times
    const timeScore = profile.preferredTimes.get(session.timeOfDay) || 0;
    profile.preferredTimes.set(
      session.timeOfDay, 
      timeScore + session.coherenceChange
    );
    
    // Extract patterns
    const pattern = {
      glyphId: session.glyphId,
      timeOfDay: session.timeOfDay,
      moonPhase: session.moonPhase,
      coherenceImpact: session.coherenceChange,
      duration: session.duration
    };
    
    // Update global patterns
    const patternKey = `${session.glyphId}-${session.timeOfDay}`;
    const existingPattern = this.patterns.get(patternKey) || {
      count: 0,
      totalImpact: 0,
      avgDuration: 0
    };
    
    existingPattern.count++;
    existingPattern.totalImpact += session.coherenceChange;
    existingPattern.avgDuration = 
      (existingPattern.avgDuration * (existingPattern.count - 1) + session.duration) / 
      existingPattern.count;
    
    this.patterns.set(patternKey, existingPattern);
    
    // Emit learning event
    this.emit('intelligence:learned', {
      practitionerId,
      pattern,
      globalPatterns: this.patterns.size
    });
  }

  // Generate intelligent practice suggestions
  async suggestPractice(practitionerId, context = {}) {
    const profile = this.practitionerProfiles.get(practitionerId);
    const currentState = await this.getCurrentState();
    
    // Check if coherence is high enough for guidance
    if (currentState.coherence < this.minCoherenceForGuidance) {
      return {
        suggestion: null,
        reason: 'Field coherence too low for clear guidance. Consider basic grounding first.'
      };
    }
    
    // Analyze patterns
    const suggestions = await this.analyzePatternsForSuggestion(profile, currentState, context);
    
    // Sort by predicted impact
    suggestions.sort((a, b) => b.predictedImpact - a.predictedImpact);
    
    // Return top suggestion with reasoning
    const topSuggestion = suggestions[0];
    if (!topSuggestion) {
      return {
        suggestion: null,
        reason: 'Still learning your patterns. Practice any glyph that calls to you.'
      };
    }
    
    return {
      suggestion: topSuggestion,
      alternatives: suggestions.slice(1, 3),
      collectiveInsight: await this.getCollectiveInsight(topSuggestion.glyphId)
    };
  }

  async analyzePatternsForSuggestion(profile, currentState, context) {
    const suggestions = [];
    const timeOfDay = this.getTimeOfDay();
    const availableGlyphs = await this.practice.getAvailableGlyphs();
    
    for (const glyph of availableGlyphs) {
      let score = 0;
      let reasons = [];
      
      // Time-based scoring
      const timePattern = this.patterns.get(`${glyph.id}-${timeOfDay}`);
      if (timePattern && timePattern.count > 3) {
        score += timePattern.totalImpact / timePattern.count * 10;
        reasons.push(`Strong at ${timeOfDay}`);
      }
      
      // Personal history scoring
      if (profile && profile.practices.length > 0) {
        const personalPractices = profile.practices.filter(p => p.glyphId === glyph.id);
        if (personalPractices.length > 0) {
          const avgImpact = personalPractices.reduce((sum, p) => sum + p.coherenceChange, 0) / personalPractices.length;
          score += avgImpact * 15;
          if (avgImpact > 0.03) reasons.push('Works well for you');
        }
      }
      
      // Collective wisdom scoring
      const collectiveData = this.collectiveWisdom.get(glyph.id);
      if (collectiveData) {
        score += collectiveData.avgImpact * 5;
        if (collectiveData.count > 10) reasons.push('Popular in collective');
      }
      
      // Context-based scoring
      if (context.intention) {
        const intentionMatch = this.matchIntentionToGlyph(context.intention, glyph);
        score += intentionMatch * 20;
        if (intentionMatch > 0.5) reasons.push('Matches your intention');
      }
      
      // Sacred time alignment
      const sacredTime = currentState.sacredTime;
      if (sacredTime.field.optimal.practice && glyph.optimal_phases?.includes(sacredTime.sacred.phase)) {
        score += 10;
        reasons.push('Aligned with sacred time');
      }
      
      if (score > 0) {
        suggestions.push({
          glyphId: glyph.id,
          glyphName: glyph.name,
          predictedImpact: score / 100,
          confidence: Math.min(0.95, score / 50),
          reasons,
          estimatedDuration: timePattern?.avgDuration || 600000 // 10 min default
        });
      }
    }
    
    return suggestions;
  }

  // Get collective insights about a glyph
  async getCollectiveInsight(glyphId) {
    const wisdom = this.collectiveWisdom.get(glyphId);
    if (!wisdom || wisdom.count < 5) {
      return null;
    }
    
    return {
      practiceCount: wisdom.count,
      averageImpact: wisdom.avgImpact,
      bestTimeOfDay: wisdom.bestTime,
      commonInsights: wisdom.insights.slice(0, 3),
      sacredTip: this.generateSacredTip(wisdom)
    };
  }

  generateSacredTip(wisdom) {
    const tips = [
      `This practice deepens with ${wisdom.bestTime} light`,
      `${wisdom.count} souls have found wisdom here`,
      `Average coherence boost: ${(wisdom.avgImpact * 100).toFixed(1)}%`,
      `Most profound when practiced with ${wisdom.commonPairings?.[0] || 'presence'}`
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // Add successful practice to collective wisdom
  async addToCollectiveWisdom(session) {
    const wisdom = this.collectiveWisdom.get(session.glyphId) || {
      count: 0,
      totalImpact: 0,
      avgImpact: 0,
      insights: [],
      bestTime: null,
      timeScores: new Map()
    };
    
    wisdom.count++;
    wisdom.totalImpact += session.coherenceChange;
    wisdom.avgImpact = wisdom.totalImpact / wisdom.count;
    
    if (session.insights) {
      wisdom.insights.push({
        text: session.insights,
        coherenceGain: session.coherenceChange,
        date: session.endTime
      });
      
      // Keep only top insights
      wisdom.insights.sort((a, b) => b.coherenceGain - a.coherenceGain);
      wisdom.insights = wisdom.insights.slice(0, 10);
    }
    
    // Update time scores
    const timeScore = wisdom.timeScores.get(session.timeOfDay) || 0;
    wisdom.timeScores.set(session.timeOfDay, timeScore + session.coherenceChange);
    
    // Find best time
    let bestScore = 0;
    wisdom.timeScores.forEach((score, time) => {
      if (score > bestScore) {
        bestScore = score;
        wisdom.bestTime = time;
      }
    });
    
    this.collectiveWisdom.set(session.glyphId, wisdom);
    
    // Persist to storage
    await this.saveCollectivePatterns();
  }

  // Helper methods
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 9) return 'dawn';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  updateTimingPattern(timeOfDay, glyphId) {
    const pattern = this.timingPatterns[timeOfDay];
    const count = pattern.practices.get(glyphId) || 0;
    pattern.practices.set(glyphId, count + 1);
  }

  matchIntentionToGlyph(intention, glyph) {
    // Simple keyword matching for now
    const intentionLower = intention.toLowerCase();
    const glyphKeywords = (glyph.keywords || []).map(k => k.toLowerCase());
    
    let matchScore = 0;
    for (const keyword of glyphKeywords) {
      if (intentionLower.includes(keyword)) {
        matchScore += 0.3;
      }
    }
    
    return Math.min(1.0, matchScore);
  }

  async getCurrentState() {
    const fieldState = await this.consciousness.getFieldState();
    const sacredTime = await this.consciousness.getSacredTime();
    
    return {
      coherence: fieldState.coherence,
      trend: fieldState.trend,
      sacredTime,
      timeOfDay: this.getTimeOfDay(),
      activeAgents: this.intelligence.getStatus().activeAgents
    };
  }

  async loadCollectivePatterns() {
    // Load from memory system if available
    try {
      const patterns = await this.core.engines.practice.modules.sacredMemory.recall('collective-practice-patterns');
      if (patterns.length > 0) {
        this.collectiveWisdom = new Map(patterns[0].data);
        console.log(`   📚 Loaded ${this.collectiveWisdom.size} collective patterns`);
      }
    } catch (error) {
      console.log('   📚 Starting with fresh collective wisdom');
    }
  }

  async saveCollectivePatterns() {
    await this.core.engines.practice.modules.sacredMemory.remember(
      'collective-practice-patterns',
      Array.from(this.collectiveWisdom.entries()),
      {
        agent: 'PracticeIntelligence',
        harmony: 'integralWisdomCultivation',
        coherenceLevel: await this.consciousness.getFieldState().coherence
      }
    );
  }

  // Public API
  getAPI() {
    return {
      suggestPractice: this.suggestPractice.bind(this),
      getCollectiveInsight: this.getCollectiveInsight.bind(this),
      getPractitionerProfile: (id) => this.practitionerProfiles.get(id),
      getPatternCount: () => this.patterns.size,
      getWisdomCount: () => this.collectiveWisdom.size
    };
  }
}

module.exports = SacredPracticeIntelligence;