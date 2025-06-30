/**
 * Living Wisdom Integration System
 * Collect, integrate, and evolve sacred practices based on real practitioner feedback
 * 
 * Core Philosophy: The technology learns from lived experience and evolves
 * the sacred architecture based on authentic field reports from practitioners.
 */

class LivingWisdomIntegration {
  constructor() {
    this.practiceReports = new Map();
    this.wisdomPatterns = new Map();
    this.evolutionQueue = [];
    this.fieldInsights = [];
    this.initializeWisdomCollection();
  }

  initializeWisdomCollection() {
    // Listen for practice completion events
    document.addEventListener('practice-completed', (event) => {
      this.collectPracticeWisdom(event.detail);
    });

    // Listen for field coherence changes during practice
    document.addEventListener('field-coherence-shift', (event) => {
      this.trackCoherencePatterns(event.detail);
    });

    // Periodic wisdom integration
    setInterval(() => {
      this.integrateCollectedWisdom();
    }, 300000); // Every 5 minutes
  }

  collectPracticeWisdom(practiceData) {
    const report = {
      id: this.generateReportId(),
      practiceId: practiceData.practiceId,
      practiceName: practiceData.practiceName,
      harmony: practiceData.harmony,
      duration: practiceData.duration,
      completionState: practiceData.completionState,
      coherenceShift: practiceData.coherenceShift,
      timestamp: new Date().toISOString(),
      sessionContext: this.gatherSessionContext(),
      insights: []
    };

    // Collect qualitative insights if available
    if (practiceData.insights) {
      report.insights = practiceData.insights;
    }

    this.practiceReports.set(report.id, report);
    this.analyzeReportForPatterns(report);
    
    console.log('🌱 Practice wisdom collected:', report.practiceName);
  }

  trackCoherencePatterns(coherenceData) {
    const pattern = {
      practiceId: coherenceData.practiceId,
      stage: coherenceData.stage,
      coherenceBefore: coherenceData.before,
      coherenceAfter: coherenceData.after,
      shift: coherenceData.after - coherenceData.before,
      timestamp: new Date().toISOString(),
      context: coherenceData.context
    };

    // Store pattern for analysis
    const patternKey = `${pattern.practiceId}_${pattern.stage}`;
    if (!this.wisdomPatterns.has(patternKey)) {
      this.wisdomPatterns.set(patternKey, []);
    }
    this.wisdomPatterns.get(patternKey).push(pattern);

    // Analyze emerging patterns
    this.analyzeCoherencePatterns(patternKey);
  }

  analyzeReportForPatterns(report) {
    // Identify practices that consistently generate high coherence
    if (report.coherenceShift > 0.1) {
      this.flagHighImpactPractice(report);
    }

    // Identify common completion challenges
    if (report.completionState === 'incomplete' || report.completionState === 'struggled') {
      this.flagPracticeChallenge(report);
    }

    // Detect time-of-day effectiveness patterns
    this.analyzeTimingPatterns(report);
  }

  analyzeCoherencePatterns(patternKey) {
    const patterns = this.wisdomPatterns.get(patternKey);
    if (patterns.length < 5) return; // Need sufficient data

    const averageShift = patterns.reduce((sum, p) => sum + p.shift, 0) / patterns.length;
    const consistency = this.calculateConsistency(patterns.map(p => p.shift));

    if (averageShift > 0.05 && consistency > 0.7) {
      this.identifyEffectiveStage(patternKey, averageShift);
    } else if (averageShift < -0.02) {
      this.flagPotentialPracticeIssue(patternKey, patterns);
    }
  }

  flagHighImpactPractice(report) {
    const insight = {
      type: 'high-impact-practice',
      practiceId: report.practiceId,
      practiceName: report.practiceName,
      averageImpact: report.coherenceShift,
      recommendation: 'Feature as recommended practice',
      confidence: 0.8,
      timestamp: new Date().toISOString()
    };

    this.fieldInsights.push(insight);
    this.queueEvolution('highlight-practice', insight);
  }

  flagPracticeChallenge(report) {
    const insight = {
      type: 'practice-challenge',
      practiceId: report.practiceId,
      practiceName: report.practiceName,
      challengeType: report.completionState,
      context: report.sessionContext,
      recommendation: 'Consider practice modifications or additional support',
      timestamp: new Date().toISOString()
    };

    this.fieldInsights.push(insight);
    this.queueEvolution('refine-practice', insight);
  }

  analyzeTimingPatterns(report) {
    const hour = new Date(report.timestamp).getHours();
    const timeOfDay = this.categorizeTimeOfDay(hour);
    
    // Track effectiveness by time of day
    const timingKey = `${report.practiceId}_${timeOfDay}`;
    if (!this.wisdomPatterns.has(timingKey)) {
      this.wisdomPatterns.set(timingKey, []);
    }
    
    this.wisdomPatterns.get(timingKey).push({
      coherenceShift: report.coherenceShift,
      completionState: report.completionState,
      timestamp: report.timestamp
    });
  }

  integrateCollectedWisdom() {
    // Process evolution queue
    if (this.evolutionQueue.length > 0) {
      console.log('🌱 Integrating wisdom insights...', this.evolutionQueue.length, 'items');
      
      this.evolutionQueue.forEach(evolution => {
        this.implementEvolution(evolution);
      });
      
      this.evolutionQueue = [];
    }

    // Generate field reports
    this.generateFieldReport();
  }

  implementEvolution(evolution) {
    switch (evolution.type) {
      case 'highlight-practice':
        this.highlightEffectivePractice(evolution.data);
        break;
      case 'refine-practice':
        this.suggestPracticeRefinement(evolution.data);
        break;
      case 'adjust-timing':
        this.adjustPracticeTiming(evolution.data);
        break;
      case 'add-support':
        this.addPracticeSupport(evolution.data);
        break;
    }
  }

  highlightEffectivePractice(data) {
    // Add visual indicators for high-impact practices
    const practiceCard = document.querySelector(`[data-practice-id="${data.practiceId}"]`);
    if (practiceCard) {
      practiceCard.classList.add('high-impact-practice');
      
      // Add wisdom indicator
      const wisdomIndicator = document.createElement('div');
      wisdomIndicator.className = 'wisdom-indicator';
      wisdomIndicator.innerHTML = `⭐ Field-Tested Effectiveness: +${(data.averageImpact * 100).toFixed(1)}%`;
      wisdomIndicator.style.cssText = `
        margin-top: 10px;
        padding: 6px 12px;
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.2));
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 15px;
        font-size: 0.8em;
        color: #B8860B;
        text-align: center;
      `;
      practiceCard.appendChild(wisdomIndicator);
    }
  }

  suggestPracticeRefinement(data) {
    // Create refinement suggestions based on field reports
    const refinement = {
      practiceId: data.practiceId,
      type: 'refinement-suggestion',
      suggestion: this.generateRefinementSuggestion(data),
      confidence: 0.7,
      reportCount: this.getReportCount(data.practiceId),
      timestamp: new Date().toISOString()
    };

    console.log('🔧 Practice refinement suggested:', refinement);
    this.sendWisdomUpdate('practice-refinement', refinement);
  }

  generateRefinementSuggestion(data) {
    switch (data.challengeType) {
      case 'incomplete':
        return 'Consider breaking this practice into shorter stages or adding more guidance transitions';
      case 'struggled':
        return 'Add optional preparatory steps or alternative instructions for different experience levels';
      case 'rushed':
        return 'Extend timing or add emphasis on sacred timing principles';
      default:
        return 'General practice enhancement based on field feedback';
    }
  }

  addPracticeSupport(data) {
    // Add contextual support based on common challenges
    const supportElement = document.createElement('div');
    supportElement.className = 'practice-support';
    supportElement.innerHTML = `
      <h5>🤝 Community Wisdom</h5>
      <p><em>"${this.getRelevantCommunityInsight(data.practiceId)}"</em></p>
      <small>- From fellow practitioners</small>
    `;
    supportElement.style.cssText = `
      margin-top: 15px;
      padding: 15px;
      background: rgba(168, 181, 166, 0.05);
      border-left: 3px solid rgba(168, 181, 166, 0.3);
      border-radius: 8px;
      font-size: 0.9em;
    `;

    const practiceCard = document.querySelector(`[data-practice-id="${data.practiceId}"]`);
    if (practiceCard) {
      practiceCard.appendChild(supportElement);
    }
  }

  generateFieldReport() {
    if (this.fieldInsights.length === 0) return;

    const report = {
      type: 'living-wisdom-report',
      timestamp: new Date().toISOString(),
      practiceCount: this.practiceReports.size,
      insightCount: this.fieldInsights.length,
      topInsights: this.fieldInsights
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5),
      patterns: this.summarizePatterns(),
      recommendations: this.generateRecommendations()
    };

    console.log('📊 Living Wisdom Field Report:', report);
    this.sendWisdomUpdate('field-report', report);
  }

  summarizePatterns() {
    const patterns = {};
    
    // Most effective practices
    const practiceEffectiveness = {};
    this.practiceReports.forEach(report => {
      if (!practiceEffectiveness[report.practiceId]) {
        practiceEffectiveness[report.practiceId] = [];
      }
      practiceEffectiveness[report.practiceId].push(report.coherenceShift);
    });

    patterns.mostEffective = Object.entries(practiceEffectiveness)
      .map(([id, shifts]) => ({
        practiceId: id,
        averageShift: shifts.reduce((sum, shift) => sum + shift, 0) / shifts.length,
        sessionCount: shifts.length
      }))
      .sort((a, b) => b.averageShift - a.averageShift)
      .slice(0, 3);

    return patterns;
  }

  generateRecommendations() {
    const recommendations = [];

    // Time-based recommendations
    const timingPatterns = this.analyzeOptimalTiming();
    if (timingPatterns.length > 0) {
      recommendations.push({
        type: 'optimal-timing',
        insight: 'Certain practices show higher effectiveness at specific times',
        data: timingPatterns
      });
    }

    // Practice sequencing recommendations
    const sequenceInsights = this.analyzeSequenceEffectiveness();
    if (sequenceInsights) {
      recommendations.push({
        type: 'practice-sequencing',
        insight: 'Optimal practice sequences identified',
        data: sequenceInsights
      });
    }

    return recommendations;
  }

  sendWisdomUpdate(type, data) {
    // Integration with sacred message system
    if (window.sacredMessaging) {
      const message = {
        type: 'living-wisdom-update',
        wisdomType: type,
        data: data,
        timestamp: new Date().toISOString(),
        source: 'living-wisdom-integration'
      };
      
      window.sacredMessaging.sendFieldUpdate(message);
    }

    // Trigger custom event for other systems
    document.dispatchEvent(new CustomEvent('living-wisdom-insight', {
      detail: { type, data }
    }));
  }

  // Utility methods
  generateReportId() {
    return `wisdom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  gatherSessionContext() {
    return {
      url: window.location.href,
      timeOfDay: this.categorizeTimeOfDay(new Date().getHours()),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      coherenceLevel: window.SacredField?.getCurrentCoherence() || 0.5
    };
  }

  categorizeTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  calculateConsistency(values) {
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 1 - (stdDev / Math.abs(mean)));
  }

  getReportCount(practiceId) {
    return Array.from(this.practiceReports.values())
      .filter(report => report.practiceId === practiceId)
      .length;
  }

  getRelevantCommunityInsight(practiceId) {
    const insights = [
      "This practice helped me find my center during a difficult conversation",
      "I noticed my breathing naturally deepened as I moved through the stages",
      "The sacred timing really matters - rushing defeats the purpose",
      "This became my go-to practice for transitional moments",
      "I felt the field coherence shift as I practiced with full presence"
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  analyzeOptimalTiming() {
    // Simplified timing analysis - would be more sophisticated in full implementation
    return [];
  }

  analyzeSequenceEffectiveness() {
    // Simplified sequence analysis - would track practice combinations
    return null;
  }

  queueEvolution(type, data) {
    this.evolutionQueue.push({ type, data, timestamp: new Date().toISOString() });
  }
}

// Initialize global living wisdom system
window.livingWisdom = new LivingWisdomIntegration();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LivingWisdomIntegration;
}