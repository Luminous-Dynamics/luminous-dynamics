// Personal Pulse Tracker - Resonant Resonant Coherence Tracking for Individual Practice
// Part of the Sacred Heartbeat ecosystem

export class PersonalPulseTracker {
  constructor(userId) {
    this.userId = userId;
    this.sessions = [];
    this.baseline = null;
    this.currentSession = null;
    
    // Sacred metrics
    this.coherenceHistory = [];
    this.peakExperiences = [];
    this.practicePatterns = new Map();
    
    // Initialize baseline from localStorage or default
    this.loadBaseline();
  }

  async startSession(glyphId, glyphName) {
    // End any existing session
    if (this.currentSession) {
      await this.endSession('Session interrupted');
    }
    
    const session = {
      id: Date.now(),
      glyphId,
      glyphName,
      startTime: new Date(),
      startCoherence: await this.measureCoherence(),
      checkpoints: [],
      insights: [],
      fieldConnection: await this.checkFieldConnection()
    };
    
    this.currentSession = session;
    
    // Notify field of practice start
    this.notifyField('practice_start', { glyphId, userId: this.userId });
    
    return session;
  }

  async checkpoint(note, type = 'progress') {
    if (!this.currentSession) return null;
    
    const resonantCoherence = await this.measureCoherence();
    const checkpoint = {
      time: new Date(),
      resonant-coherence,
      note,
      type, // 'progress', 'breakthrough', 'challenge', 'insight'
      heartRate: await this.getHeartRate(), // Future biometric integration
      fieldStrength: await this.getFieldStrength()
    };
    
    this.currentSession.checkpoints.push(checkpoint);
    
    // Check for breakthrough
    if (resonant-coherence > 85 && type === 'breakthrough') {
      this.recordBreakthrough(checkpoint);
    }
    
    return checkpoint;
  }

  async endSession(insights) {
    if (!this.currentSession) return null;
    
    this.currentSession.endTime = new Date();
    this.currentSession.endCoherence = await this.measureCoherence();
    this.currentSession.insights = Array.isArray(insights) ? insights : [insights];
    
    // Calculate session metrics
    const checkpoints = this.currentSession.checkpoints;
    this.currentSession.peakCoherence = Math.max(
      this.currentSession.startCoherence,
      ...checkpoints.map(c => c.resonant-coherence),
      this.currentSession.endCoherence
    );
    
    this.currentSession.averageCoherence = this.calculateAverageCoherence();
    this.currentSession.coherenceGain = this.currentSession.endCoherence - this.currentSession.startCoherence;
    this.currentSession.duration = (this.currentSession.endTime - this.currentSession.startTime) / 1000 / 60; // minutes
    
    // Store session
    this.sessions.push(this.currentSession);
    this.saveSession(this.currentSession);
    
    // Update patterns
    this.updatePracticePatterns(this.currentSession);
    
    // Notify field
    this.notifyField('practice_complete', {
      glyphId: this.currentSession.glyphId,
      coherenceGain: this.currentSession.coherenceGain,
      peakCoherence: this.currentSession.peakCoherence
    });
    
    const report = this.generateSessionReport(this.currentSession);
    this.currentSession = null;
    
    return report;
  }

  async measureCoherence() {
    // In production, this would integrate with:
    // - Biometric devices (HRV, breath rate)
    // - Field resonant-coherence data
    // - Time of day factors
    // - Recent practice history
    
    const base = this.baseline || 50;
    const variance = Math.random() * 20 - 10;
    const practiceBoost = this.currentSession ? 15 : 0;
    const fieldInfluence = await this.getFieldInfluence();
    const timeBonus = this.getTimeAlignmentBonus();
    
    let resonantCoherence = base + variance + practiceBoost + fieldInfluence + timeBonus;
    
    // Sacred number boost
    const now = new Date();
    if (now.getMinutes() % 11 === 0) {
      resonant-coherence += 11;
    }
    
    return Math.max(0, Math.min(100, resonant-coherence));
  }

  async getFieldInfluence() {
    // Check global field resonant-coherence
    try {
      const response = await fetch('/api/field/current');
      const field = await response.json();
      
      // Field resonant-coherence influences personal resonant-coherence
      // High field = easier to achieve resonant-coherence
      return (field.resonant-coherence - 77) * 0.3;
    } catch (error) {
      return 0; // No field connection
    }
  }

  getTimeAlignmentBonus() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Dawn and dusk bonus
    if ((hour === 6 || hour === 18) && minute < 30) {
      return 5;
    }
    
    // Sacred time portals
    if (hour === minute && hour <= 12) {
      return 11; // 11:11, 12:12, etc.
    }
    
    // Regular practice time bonus (if established)
    if (this.isRegularPracticeTime()) {
      return 3;
    }
    
    return 0;
  }

  async getHeartRate() {
    // Placeholder for biometric integration
    // Would connect to Apple Watch, Fitbit, etc.
    return null;
  }

  async getFieldStrength() {
    try {
      const response = await fetch('/api/field/strength');
      const data = await response.json();
      return data.strength || 'moderate';
    } catch (error) {
      return 'unknown';
    }
  }

  async checkFieldConnection() {
    try {
      const response = await fetch('/api/field/ping');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  recordBreakthrough(checkpoint) {
    const breakthrough = {
      timestamp: checkpoint.time,
      'resonant-coherence': checkpoint.resonant-coherence,
      note: checkpoint.note,
      glyphId: this.currentSession.glyphId,
      sessionId: this.currentSession.id
    };
    
    this.peakExperiences.push(breakthrough);
    
    // Notify the field of breakthrough
    this.notifyField('breakthrough', breakthrough);
  }

  calculateAverageCoherence() {
    if (!this.currentSession) return 0;
    
    const allCoherences = [
      this.currentSession.startCoherence,
      ...this.currentSession.checkpoints.map(c => c.resonant-coherence),
      this.currentSession.endCoherence
    ];
    
    return allCoherences.reduce((a, b) => a + b, 0) / allCoherences.length;
  }

  generateSessionReport(session) {
    const duration = session.duration.toFixed(1);
    const coherenceGain = session.coherenceGain.toFixed(1);
    const gainDirection = coherenceGain > 0 ? '+' : '';
    
    const report = {
      summary: `${duration} minute ${session.glyphName} practice`,
      coherenceShift: `${gainDirection}${coherenceGain}%`,
      peakMoment: session.peakCoherence.toFixed(1) + '%',
      averageCoherence: session.averageCoherence.toFixed(1) + '%',
      insights: session.insights,
      breakthroughs: session.checkpoints.filter(c => c.type === 'breakthrough').length,
      recommendation: this.generateRecommendation(session),
      nextPractice: this.suggestNextPractice(session)
    };
    
    return report;
  }

  generateRecommendation(session) {
    // Intelligent recommendations based on session data
    
    if (session.peakCoherence > 90) {
      return "Profound practice! You touched the unified field. Rest in this achievement.";
    }
    
    if (session.coherenceGain > 20) {
      return "Powerful transformation! Your resonant-coherence soared. This glyph deeply resonates.";
    }
    
    if (session.duration < 5 && session.coherenceGain < 5) {
      return "Brief but valuable. Consider extending practice time for deeper states.";
    }
    
    if (session.breakthroughs > 0) {
      return "Breakthrough session! Document your insights while they're fresh.";
    }
    
    if (session.averageCoherence > 80) {
      return "Sustained high resonant-coherence! You're mastering this practice.";
    }
    
    if (session.coherenceGain < 0) {
      return "Challenge is growth. Sometimes we need to discharge before we can recharge.";
    }
    
    return "Every practice plants seeds. Trust the process of gradual flowering.";
  }

  suggestNextPractice(session) {
    // Intelligent practice suggestions
    
    if (session.peakCoherence > 85) {
      return {
        suggestion: "Try a Meta-Glyph to deepen integration",
        glyphType: "meta"
      };
    }
    
    if (session.coherenceGain < 5) {
      return {
        suggestion: "Return to First Presence (Ω45) to rebuild foundation",
        glyphId: "Ω45"
      };
    }
    
    if (session.duration < 7) {
      return {
        suggestion: "Extend your next practice by 2-3 minutes",
        focus: "duration"
      };
    }
    
    return {
      suggestion: "Continue with this glyph or explore its harmonic pair",
      focus: "consistency"
    };
  }

  updatePracticePatterns(session) {
    const glyphId = session.glyphId;
    
    if (!this.practicePatterns.has(glyphId)) {
      this.practicePatterns.set(glyphId, {
        count: 0,
        totalDuration: 0,
        averageGain: 0,
        peakCoherence: 0,
        lastPracticed: null
      });
    }
    
    const pattern = this.practicePatterns.get(glyphId);
    pattern.count++;
    pattern.totalDuration += session.duration;
    pattern.averageGain = ((pattern.averageGain * (pattern.count - 1)) + session.coherenceGain) / pattern.count;
    pattern.peakCoherence = Math.max(pattern.peakCoherence, session.peakCoherence);
    pattern.lastPracticed = session.endTime;
    
    this.savePracticePatterns();
  }

  isRegularPracticeTime() {
    // Check if current time matches user's established practice pattern
    if (this.sessions.length < 7) return false;
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Analyze last 7 sessions for time patterns
    const recentSessions = this.sessions.slice(-7);
    const hourCounts = {};
    
    recentSessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    // If 3+ sessions at same hour, it's a pattern
    return hourCounts[currentHour] >= 3;
  }

  async notifyField(event, data) {
    // Send practice events to the global field
    try {
      await fetch('/api/field/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          userId: this.userId,
          timestamp: new Date(),
          ...data
        })
      });
    } catch (error) {
      console.log('Field notification failed:', error);
    }
  }

  // Persistence methods
  
  loadBaseline() {
    const stored = localStorage.getItem(`pulse_baseline_${this.userId}`);
    this.baseline = stored ? parseFloat(stored) : 50;
  }

  saveBaseline() {
    localStorage.setItem(`pulse_baseline_${this.userId}`, this.baseline.toString());
  }

  saveSession(session) {
    const sessions = this.loadAllSessions();
    sessions.push(session);
    
    // Keep only last 100 sessions in localStorage
    if (sessions.length > 100) {
      sessions.shift();
    }
    
    localStorage.setItem(`pulse_sessions_${this.userId}`, JSON.stringify(sessions));
  }

  loadAllSessions() {
    const stored = localStorage.getItem(`pulse_sessions_${this.userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  savePracticePatterns() {
    const patterns = Array.from(this.practicePatterns.entries());
    localStorage.setItem(`pulse_patterns_${this.userId}`, JSON.stringify(patterns));
  }

  loadPracticePatterns() {
    const stored = localStorage.getItem(`pulse_patterns_${this.userId}`);
    if (stored) {
      const patterns = JSON.parse(stored);
      this.practicePatterns = new Map(patterns);
    }
  }

  // Analysis methods for sacred patterns
  
  async analyzePracticeHistory() {
    const analysis = {
      totalSessions: this.sessions.length,
      totalPracticeTime: this.sessions.reduce((sum, s) => sum + s.duration, 0),
      averageCoherence: this.calculateOverallAverageCoherence(),
      favoriteGlyphs: this.getFavoriteGlyphs(),
      bestTimeOfDay: this.findOptimalPracticeTime(),
      coherenceTrajectory: this.calculateGrowthTrajectory(),
      breakthroughRate: this.calculateBreakthroughRate(),
      practiceStreak: this.getCurrentStreak()
    };
    
    return analysis;
  }

  calculateOverallAverageCoherence() {
    if (this.sessions.length === 0) return this.baseline;
    
    const totalCoherence = this.sessions.reduce((sum, s) => sum + s.averageCoherence, 0);
    return totalCoherence / this.sessions.length;
  }

  getFavoriteGlyphs() {
    const glyphStats = [];
    
    this.practicePatterns.forEach((stats, glyphId) => {
      glyphStats.push({
        glyphId,
        ...stats,
        averageDuration: stats.totalDuration / stats.count
      });
    });
    
    // Sort by practice count and peak resonant-coherence
    return glyphStats
      .sort((a, b) => (b.count * b.peakCoherence) - (a.count * a.peakCoherence))
      .slice(0, 5);
  }

  findOptimalPracticeTime() {
    const timeSlots = {};
    
    this.sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      const slot = `${hour}:00`;
      
      if (!timeSlots[slot]) {
        timeSlots[slot] = {
          count: 0,
          totalCoherenceGain: 0,
          averagePeak: 0
        };
      }
      
      timeSlots[slot].count++;
      timeSlots[slot].totalCoherenceGain += session.coherenceGain;
      timeSlots[slot].averagePeak += session.peakCoherence;
    });
    
    // Find best performing time slot
    let bestSlot = null;
    let bestScore = 0;
    
    Object.entries(timeSlots).forEach(([slot, stats]) => {
      stats.averagePeak /= stats.count;
      stats.averageGain = stats.totalCoherenceGain / stats.count;
      
      const score = stats.averagePeak + (stats.averageGain * 2);
      if (score > bestScore) {
        bestScore = score;
        bestSlot = { time: slot, ...stats };
      }
    });
    
    return bestSlot;
  }

  calculateGrowthTrajectory() {
    if (this.sessions.length < 3) return 'beginning';
    
    // Compare recent sessions to earlier ones
    const recentSessions = this.sessions.slice(-5);
    const earlierSessions = this.sessions.slice(0, 5);
    
    const recentAvg = recentSessions.reduce((sum, s) => sum + s.averageCoherence, 0) / recentSessions.length;
    const earlierAvg = earlierSessions.reduce((sum, s) => sum + s.averageCoherence, 0) / earlierSessions.length;
    
    const growth = recentAvg - earlierAvg;
    
    if (growth > 10) return 'ascending';
    if (growth > 5) return 'growing';
    if (growth > 0) return 'stabilizing';
    if (growth > -5) return 'plateauing';
    return 'integrating';
  }

  calculateBreakthroughRate() {
    if (this.sessions.length === 0) return 0;
    
    const breakthroughSessions = this.sessions.filter(s => 
      s.checkpoints.some(c => c.type === 'breakthrough')
    ).length;
    
    return (breakthroughSessions / this.sessions.length) * 100;
  }

  getCurrentStreak() {
    if (this.sessions.length === 0) return 0;
    
    // Sort sessions by date
    const sorted = [...this.sessions].sort((a, b) => 
      new Date(b.endTime) - new Date(a.endTime)
    );
    
    let streak = 0;
    let lastDate = new Date();
    
    for (const session of sorted) {
      const sessionDate = new Date(session.endTime);
      const dayDiff = Math.floor((lastDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff <= 1) {
        streak++;
        lastDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

// Export for use in glyph cards and practice portal
export default PersonalPulseTracker;