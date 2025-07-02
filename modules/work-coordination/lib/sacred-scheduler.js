/**
 * Sacred Scheduler
 * Schedules work according to sacred timing and field coherence
 */

class SacredScheduler {
  constructor() {
    // Sacred time periods and their qualities
    this.sacredTimes = {
      dawn: {
        hours: [6, 9],
        qualities: ['emergence', 'new beginnings', 'clarity'],
        harmonies: ['transparency', 'emergence'],
        workTypes: ['planning', 'visioning', 'meditation']
      },
      morning: {
        hours: [9, 12],
        qualities: ['building', 'focus', 'momentum'],
        harmonies: ['agency', 'vitality'],
        workTypes: ['creation', 'problem-solving', 'deep work']
      },
      midday: {
        hours: [12, 13],
        qualities: ['pause', 'nourishment', 'integration'],
        harmonies: ['coherence', 'mutuality'],
        workTypes: ['reflection', 'sharing', 'rest']
      },
      afternoon: {
        hours: [13, 17],
        qualities: ['creativity', 'collaboration', 'flow'],
        harmonies: ['novelty', 'resonance'],
        workTypes: ['innovation', 'teamwork', 'experimentation']
      },
      twilight: {
        hours: [17, 20],
        qualities: ['integration', 'completion', 'gratitude'],
        harmonies: ['integration', 'coherence'],
        workTypes: ['review', 'documentation', 'celebration']
      },
      evening: {
        hours: [20, 22],
        qualities: ['reflection', 'wisdom', 'preparation'],
        harmonies: ['transparency', 'wisdom'],
        workTypes: ['planning', 'learning', 'contemplation']
      },
      night: {
        hours: [22, 6],
        qualities: ['rest', 'dreams', 'regeneration'],
        harmonies: ['void', 'potential'],
        workTypes: ['rest', 'processing', 'unconscious work']
      }
    };
    
    // Work rhythm patterns
    this.rhythms = {
      natural: {
        workPeriod: 90,  // minutes
        restPeriod: 20   // minutes
      },
      focused: {
        workPeriod: 45,
        restPeriod: 15
      },
      gentle: {
        workPeriod: 25,
        restPeriod: 10
      }
    };
    
    // Scheduled work queue
    this.queue = [];
  }

  /**
   * Schedule work according to sacred timing
   * @param {Object} work - Work item to schedule
   * @returns {Object} Schedule recommendation
   */
  async scheduleWork(work) {
    const currentTime = this.getCurrentSacredTime();
    const workQualities = this.analyzeWorkQualities(work);
    
    // Find best time slot
    const bestTime = this.findBestTimeSlot(workQualities, currentTime);
    
    // Calculate rhythm
    const rhythm = this.selectRhythm(work);
    
    // Create schedule
    const schedule = {
      workId: work.id,
      recommendedStart: bestTime.start,
      recommendedPeriod: bestTime.period,
      sacredTime: bestTime.sacredTime,
      rhythm: rhythm,
      reason: bestTime.reason,
      fieldAlignment: this.calculateFieldAlignment(work, bestTime.sacredTime)
    };
    
    // Add to queue if future
    if (bestTime.start > Date.now()) {
      this.queue.push(schedule);
      this.queue.sort((a, b) => a.recommendedStart - b.recommendedStart);
    }
    
    return schedule;
  }

  /**
   * Get current sacred time period
   */
  getCurrentSacredTime() {
    const hour = new Date().getHours();
    
    for (const [period, config] of Object.entries(this.sacredTimes)) {
      const [start, end] = config.hours;
      
      if (period === 'night') {
        if (hour >= start || hour < end) return period;
      } else {
        if (hour >= start && hour < end) return period;
      }
    }
    
    return 'transition';
  }

  /**
   * Analyze work qualities for scheduling
   * @private
   */
  analyzeWorkQualities(work) {
    const qualities = {
      harmonies: [work.harmony],
      workTypes: [],
      priority: work.priority,
      sacred: work.sacred
    };
    
    // Infer work types from title and description
    const text = `${work.title} ${work.description}`.toLowerCase();
    
    if (text.includes('plan') || text.includes('design')) {
      qualities.workTypes.push('planning');
    }
    if (text.includes('create') || text.includes('build')) {
      qualities.workTypes.push('creation');
    }
    if (text.includes('review') || text.includes('analyze')) {
      qualities.workTypes.push('review');
    }
    if (text.includes('collaborate') || text.includes('team')) {
      qualities.workTypes.push('teamwork');
    }
    
    return qualities;
  }

  /**
   * Find best time slot for work
   * @private
   */
  findBestTimeSlot(workQualities, currentTime) {
    let bestScore = -1;
    let bestSlot = null;
    
    // Check each sacred time period
    for (const [period, config] of Object.entries(this.sacredTimes)) {
      let score = 0;
      
      // Harmony alignment
      const harmonyMatch = workQualities.harmonies.some(h => 
        config.harmonies.includes(h)
      );
      if (harmonyMatch) score += 3;
      
      // Work type alignment
      const workTypeMatch = workQualities.workTypes.some(t => 
        config.workTypes.includes(t)
      );
      if (workTypeMatch) score += 2;
      
      // Sacred work bonus
      if (workQualities.sacred && ['dawn', 'twilight'].includes(period)) {
        score += 2;
      }
      
      // Priority adjustment
      if (workQualities.priority === 'high' && period === currentTime) {
        score += 1;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestSlot = {
          sacredTime: period,
          ...this.getTimeSlotDetails(period),
          score,
          reason: this.getScheduleReason(period, harmonyMatch, workTypeMatch)
        };
      }
    }
    
    return bestSlot;
  }

  /**
   * Get time slot details
   * @private
   */
  getTimeSlotDetails(period) {
    const config = this.sacredTimes[period];
    const now = new Date();
    const [startHour, endHour] = config.hours;
    
    // Calculate next occurrence
    let start = new Date(now);
    start.setHours(startHour, 0, 0, 0);
    
    // If already past, schedule for tomorrow
    if (start < now) {
      start.setDate(start.getDate() + 1);
    }
    
    return {
      start: start.getTime(),
      period: period,
      duration: (endHour - startHour) * 60 * 60 * 1000
    };
  }

  /**
   * Select work rhythm
   * @private
   */
  selectRhythm(work) {
    if (work.priority === 'high') {
      return this.rhythms.focused;
    }
    
    if (work.sacred) {
      return this.rhythms.natural;
    }
    
    return this.rhythms.gentle;
  }

  /**
   * Calculate field alignment
   * @private
   */
  calculateFieldAlignment(work, sacredTime) {
    const timeConfig = this.sacredTimes[sacredTime];
    
    // Check harmony alignment
    const harmonyAligned = timeConfig.harmonies.includes(work.harmony);
    
    // Check work type alignment
    const workTypes = this.analyzeWorkQualities(work).workTypes;
    const typeAligned = workTypes.some(t => timeConfig.workTypes.includes(t));
    
    // Calculate alignment score
    let alignment = 0;
    if (harmonyAligned) alignment += 50;
    if (typeAligned) alignment += 30;
    if (work.sacred) alignment += 20;
    
    return Math.min(100, alignment);
  }

  /**
   * Get schedule reason
   * @private
   */
  getScheduleReason(period, harmonyMatch, workTypeMatch) {
    const reasons = [];
    
    if (harmonyMatch) {
      reasons.push(`Harmony alignment with ${period}`);
    }
    
    if (workTypeMatch) {
      reasons.push(`Work type suited for ${period}`);
    }
    
    if (!reasons.length) {
      reasons.push(`General scheduling for ${period}`);
    }
    
    return reasons.join('; ');
  }

  /**
   * Get upcoming scheduled work
   * @param {number} limit - Max items to return
   * @returns {Array} Upcoming scheduled work
   */
  getUpcoming(limit = 10) {
    // Remove past items
    const now = Date.now();
    this.queue = this.queue.filter(s => s.recommendedStart > now);
    
    return this.queue.slice(0, limit);
  }

  /**
   * Check if work should start now
   * @param {string} workId - Work ID
   * @returns {boolean} True if work should start
   */
  shouldStartNow(workId) {
    const schedule = this.queue.find(s => s.workId === workId);
    if (!schedule) return false;
    
    const now = Date.now();
    const startWindow = 5 * 60 * 1000; // 5 minute window
    
    return Math.abs(schedule.recommendedStart - now) < startWindow;
  }

  /**
   * Get sacred work windows for a day
   * @param {Date} date - Date to check
   * @returns {Array} Sacred work windows
   */
  getSacredWindows(date = new Date()) {
    const windows = [];
    
    for (const [period, config] of Object.entries(this.sacredTimes)) {
      if (period === 'night') continue; // Skip rest period
      
      const [startHour, endHour] = config.hours;
      const start = new Date(date);
      start.setHours(startHour, 0, 0, 0);
      
      const end = new Date(date);
      end.setHours(endHour, 0, 0, 0);
      
      windows.push({
        period,
        start: start.getTime(),
        end: end.getTime(),
        qualities: config.qualities,
        harmonies: config.harmonies,
        workTypes: config.workTypes
      });
    }
    
    return windows;
  }
}

module.exports = { SacredScheduler };