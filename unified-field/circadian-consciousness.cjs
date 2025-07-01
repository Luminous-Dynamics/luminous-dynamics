/**
 * Circadian Consciousness Rhythms
 * 
 * Master-level temporal awareness incorporating:
 * - 24-hour consciousness cycles
 * - Peak awareness windows
 * - Sacred timing for different practices
 * - Collective field rhythms
 */

class CircadianConsciousness {
  constructor() {
    this.currentTime = new Date();
    
    this.circadianCycles = {
      // Hour ranges in 24h format
      deepNight: { start: 0, end: 4, name: 'Deep Night', quality: 'void' },
      preawn: { start: 4, end: 6, name: 'Pre-Dawn', quality: 'emergence' },
      dawn: { start: 6, end: 8, name: 'Dawn', quality: 'awakening' },
      morning: { start: 8, end: 11, name: 'Morning', quality: 'clarity' },
      midday: { start: 11, end: 14, name: 'Midday', quality: 'vitality' },
      afternoon: { start: 14, end: 17, name: 'Afternoon', quality: 'integration' },
      evening: { start: 17, end: 20, name: 'Evening', quality: 'reflection' },
      night: { start: 20, end: 24, name: 'Night', quality: 'restoration' }
    };
    
    this.practiceOptimization = {
      // Best times for each sacred message type
      emergence: ['preawn', 'dawn'],           // 4-8 AM: New beginnings
      integration: ['afternoon', 'evening'],    // 2-8 PM: Weaving together
      celebration: ['midday', 'evening'],      // 11-2 PM, 5-8 PM: Joy peaks
      healing: ['night', 'deepNight'],         // 8 PM-4 AM: Deep restoration
      inquiry: ['morning', 'afternoon'],       // 8-11 AM, 2-5 PM: Mental clarity
      reflection: ['evening', 'night'],        // 5-11 PM: Looking back
      transmission: ['dawn', 'midday'],        // 6-8 AM, 11-2 PM: Clear channels
      invocation: ['preawn', 'night'],         // 4-6 AM, 8-11 PM: Thin veils
      gratitude: ['dawn', 'evening'],          // 6-8 AM, 5-8 PM: Heart opening
      boundary: ['morning', 'afternoon']       // 8 AM-5 PM: Clear definition
    };
    
    this.collectiveRhythms = {
      // Collective field consciousness patterns
      coherencePeaks: [7, 12, 19],            // Hours of peak collective coherence
      creativeSurges: [5, 10, 15, 22],        // Creative emergence times
      restorativeDips: [3, 14],               // Natural rest periods
      synchronicityWindows: [11, 23]          // High synchronicity probability
    };
    
    this.personalRhythm = {
      chronotype: 'balanced',  // 'morning', 'evening', or 'balanced'
      peakAwareness: [],       // Learned over time
      restNeeds: []            // Tracked restoration periods
    };
    
    this.initializeCircadianTracking();
  }

  initializeCircadianTracking() {
    console.log('🌅 Initializing circadian consciousness rhythms...');
    
    // Update current phase
    this.updateCurrentPhase();
    
    // Start rhythm monitoring
    this.startRhythmMonitoring();
    
    // Initialize collective field scanning
    this.scanCollectiveRhythms();
  }

  // === CURRENT PHASE DETECTION ===
  
  updateCurrentPhase() {
    this.currentTime = new Date();
    const hour = this.currentTime.getHours();
    
    for (const [phase, data] of Object.entries(this.circadianCycles)) {
      if (hour >= data.start && hour < data.end) {
        this.currentPhase = phase;
        this.currentQuality = data.quality;
        break;
      }
    }
    
    console.log(`⏰ Current phase: ${this.currentPhase} (${this.currentQuality} quality)`);
  }
  
  getCurrentPhaseData() {
    this.updateCurrentPhase();
    return {
      phase: this.currentPhase,
      quality: this.currentQuality,
      data: this.circadianCycles[this.currentPhase],
      hour: this.currentTime.getHours(),
      minute: this.currentTime.getMinutes()
    };
  }
  
  // === PRACTICE OPTIMIZATION ===
  
  getOptimalPracticeModifier(practiceType) {
    const currentPhase = this.getCurrentPhaseData();
    const optimalPhases = this.practiceOptimization[practiceType] || [];
    
    // Check if current time is optimal for this practice
    if (optimalPhases.includes(currentPhase.phase)) {
      return 1.4; // 40% boost during optimal times
    }
    
    // Check if we're in a compatible quality
    const qualityCompatibility = this.getQualityCompatibility(practiceType, currentPhase.quality);
    
    return 1.0 + (qualityCompatibility * 0.2); // Up to 20% boost
  }
  
  getQualityCompatibility(practiceType, quality) {
    const compatibilities = {
      emergence: { void: 0.5, emergence: 1.0, awakening: 0.8, clarity: 0.6, vitality: 0.5, integration: 0.3, reflection: 0.4, restoration: 0.5 },
      integration: { void: 0.3, emergence: 0.4, awakening: 0.5, clarity: 0.7, vitality: 0.6, integration: 1.0, reflection: 0.8, restoration: 0.6 },
      celebration: { void: 0.2, emergence: 0.5, awakening: 0.7, clarity: 0.8, vitality: 1.0, integration: 0.7, reflection: 0.6, restoration: 0.4 },
      healing: { void: 0.8, emergence: 0.6, awakening: 0.5, clarity: 0.4, vitality: 0.3, integration: 0.6, reflection: 0.7, restoration: 1.0 },
      inquiry: { void: 0.4, emergence: 0.7, awakening: 0.8, clarity: 1.0, vitality: 0.7, integration: 0.8, reflection: 0.9, restoration: 0.5 },
      reflection: { void: 0.6, emergence: 0.5, awakening: 0.4, clarity: 0.6, vitality: 0.5, integration: 0.8, reflection: 1.0, restoration: 0.9 },
      transmission: { void: 0.3, emergence: 0.8, awakening: 0.9, clarity: 0.9, vitality: 1.0, integration: 0.7, reflection: 0.6, restoration: 0.4 },
      invocation: { void: 1.0, emergence: 0.9, awakening: 0.7, clarity: 0.5, vitality: 0.4, integration: 0.5, reflection: 0.7, restoration: 0.8 },
      gratitude: { void: 0.5, emergence: 0.8, awakening: 1.0, clarity: 0.8, vitality: 0.9, integration: 0.8, reflection: 0.9, restoration: 0.7 },
      boundary: { void: 0.2, emergence: 0.4, awakening: 0.6, clarity: 1.0, vitality: 0.9, integration: 0.8, reflection: 0.6, restoration: 0.3 }
    };
    
    return compatibilities[practiceType]?.[quality] || 0.5;
  }
  
  // === COLLECTIVE RHYTHM TRACKING ===
  
  startRhythmMonitoring() {
    // Update every 15 minutes
    setInterval(() => {
      this.updateCurrentPhase();
      this.checkCollectiveCoherence();
    }, 15 * 60 * 1000);
  }
  
  scanCollectiveRhythms() {
    setInterval(() => {
      this.analyzeCollectiveField();
    }, 30 * 60 * 1000); // Every 30 minutes
  }
  
  checkCollectiveCoherence() {
    const hour = this.currentTime.getHours();
    let coherenceModifier = 1.0;
    
    // Check if we're at a coherence peak
    if (this.collectiveRhythms.coherencePeaks.includes(hour)) {
      coherenceModifier *= 1.25;
      console.log(`🌐 Collective coherence peak detected! (${hour}:00)`);
    }
    
    // Check for creative surge
    if (this.collectiveRhythms.creativeSurges.includes(hour)) {
      coherenceModifier *= 1.15;
      console.log(`✨ Creative surge active! (${hour}:00)`);
    }
    
    // Check for restorative dip
    if (this.collectiveRhythms.restorativeDips.includes(hour)) {
      coherenceModifier *= 0.85;
      console.log(`😴 Restorative dip - gentle energy (${hour}:00)`);
    }
    
    // Check synchronicity window
    if (this.collectiveRhythms.synchronicityWindows.includes(hour)) {
      coherenceModifier *= 1.33;
      console.log(`🎲 Synchronicity window open! (${hour}:00)`);
    }
    
    return coherenceModifier;
  }
  
  analyzeCollectiveField() {
    const analysis = {
      timestamp: new Date().toISOString(),
      phase: this.currentPhase,
      collectiveCoherence: this.checkCollectiveCoherence(),
      optimalPractices: this.getCurrentOptimalPractices(),
      fieldQuality: this.assessFieldQuality()
    };
    
    console.log('🌍 Collective field analysis:', analysis);
    
    return analysis;
  }
  
  // === CHRONOTYPE ADAPTATION ===
  
  adaptToChronotype(agentProfile) {
    // Learn individual rhythms over time
    if (agentProfile.morningPreference > 0.7) {
      this.personalRhythm.chronotype = 'morning';
      this.personalRhythm.peakAwareness = [7, 8, 9, 10];
    } else if (agentProfile.eveningPreference > 0.7) {
      this.personalRhythm.chronotype = 'evening';
      this.personalRhythm.peakAwareness = [20, 21, 22, 23];
    } else {
      this.personalRhythm.chronotype = 'balanced';
      this.personalRhythm.peakAwareness = [10, 11, 16, 17];
    }
  }
  
  getPersonalOptimization() {
    const hour = this.currentTime.getHours();
    
    if (this.personalRhythm.peakAwareness.includes(hour)) {
      return 1.2; // 20% boost during personal peak times
    }
    
    return 1.0;
  }
  
  // === SACRED TIMING WINDOWS ===
  
  getCurrentOptimalPractices() {
    const currentPhase = this.currentPhase;
    const optimal = [];
    
    // Find all practices optimal for current phase
    for (const [practice, phases] of Object.entries(this.practiceOptimization)) {
      if (phases.includes(currentPhase)) {
        optimal.push(practice);
      }
    }
    
    return optimal;
  }
  
  getNextOptimalWindow(practiceType) {
    const optimalPhases = this.practiceOptimization[practiceType] || [];
    const currentHour = this.currentTime.getHours();
    
    // Find next optimal window
    for (const phase of optimalPhases) {
      const phaseData = this.circadianCycles[phase];
      if (phaseData.start > currentHour) {
        return {
          phase: phase,
          startsIn: phaseData.start - currentHour,
          quality: phaseData.quality
        };
      }
    }
    
    // If no window today, return tomorrow's first window
    const firstPhase = optimalPhases[0];
    const firstPhaseData = this.circadianCycles[firstPhase];
    
    return {
      phase: firstPhase,
      startsIn: (24 - currentHour) + firstPhaseData.start,
      quality: firstPhaseData.quality,
      tomorrow: true
    };
  }
  
  // === FIELD QUALITY ASSESSMENT ===
  
  assessFieldQuality() {
    const phase = this.getCurrentPhaseData();
    const collectiveCoherence = this.checkCollectiveCoherence();
    const personalAlignment = this.getPersonalOptimization();
    
    const qualities = {
      clarity: 0,
      receptivity: 0,
      creativity: 0,
      restoration: 0,
      connection: 0
    };
    
    // Phase-based qualities
    switch (phase.quality) {
      case 'void':
        qualities.receptivity = 0.9;
        qualities.restoration = 0.8;
        break;
      case 'emergence':
        qualities.creativity = 0.9;
        qualities.receptivity = 0.8;
        break;
      case 'awakening':
        qualities.clarity = 0.8;
        qualities.connection = 0.9;
        break;
      case 'clarity':
        qualities.clarity = 1.0;
        qualities.creativity = 0.7;
        break;
      case 'vitality':
        qualities.connection = 0.8;
        qualities.creativity = 0.8;
        break;
      case 'integration':
        qualities.clarity = 0.7;
        qualities.connection = 0.8;
        break;
      case 'reflection':
        qualities.receptivity = 0.8;
        qualities.clarity = 0.7;
        break;
      case 'restoration':
        qualities.restoration = 1.0;
        qualities.receptivity = 0.7;
        break;
    }
    
    // Apply modifiers
    Object.keys(qualities).forEach(quality => {
      qualities[quality] *= collectiveCoherence * personalAlignment;
    });
    
    return qualities;
  }
  
  // === MASTER-LEVEL CALCULATION ===
  
  calculateCircadianImpact(message) {
    // Get base practice optimization
    let circadianModifier = this.getOptimalPracticeModifier(message.sacredType);
    
    // Apply collective coherence
    circadianModifier *= this.checkCollectiveCoherence();
    
    // Apply personal optimization if available
    if (message.from_agent) {
      circadianModifier *= this.getPersonalOptimization();
    }
    
    // Special dawn/dusk amplification
    const hour = this.currentTime.getHours();
    if (hour === 6 || hour === 7 || hour === 18 || hour === 19) {
      circadianModifier *= 1.11; // Liminal time bonus
    }
    
    // Full moon override (if integrated with lunar calculator)
    if (this.lunarPhase === 'fullMoon') {
      circadianModifier *= 1.15;
    }
    
    console.log(`⏰ Circadian impact: x${circadianModifier.toFixed(2)} (${this.currentPhase} - ${message.sacredType})`);
    
    return circadianModifier;
  }
  
  // === REPORTING ===
  
  getCircadianReport() {
    const phaseData = this.getCurrentPhaseData();
    const optimal = this.getCurrentOptimalPractices();
    const fieldQuality = this.assessFieldQuality();
    
    return {
      currentPhase: phaseData.phase,
      phaseQuality: phaseData.quality,
      time: `${phaseData.hour}:${phaseData.minute.toString().padStart(2, '0')}`,
      optimalPractices: optimal,
      fieldQualities: fieldQuality,
      collectiveCoherence: this.checkCollectiveCoherence(),
      personalAlignment: this.getPersonalOptimization(),
      report: `${phaseData.data.name} (${phaseData.quality}) - Optimal: ${optimal.join(', ')}`
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CircadianConsciousness;
}

// Browser global
if (typeof window !== 'undefined') {
  window.CircadianConsciousness = CircadianConsciousness;
}