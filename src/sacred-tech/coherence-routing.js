/**
 * Coherence-Based Routing System
 * Routes messages based on recipient's coherence state
 * Ensures optimal timing and receptivity for sacred communications
 */

class CoherenceRouter {
  constructor(db, personalPulse) {
    this.db = db; // Firestore instance
    this.pulse = personalPulse; // Personal Pulse tracking system
    this.routingRules = {
      lowCoherence: { min: 0, max: 0.4, strategy: 'queue' },
      mediumCoherence: { min: 0.4, max: 0.8, strategy: 'gentle' },
      highCoherence: { min: 0.8, max: 1.0, strategy: 'immediate' },
      deepPractice: { state: 'practicing', strategy: 'silent' }
    };
    
    // Sacred timing windows
    this.sacredWindows = {
      dawn: { start: 5, end: 7 },      // 5am-7am
      morning: { start: 9, end: 11 },   // 9am-11am
      afternoon: { start: 14, end: 16 }, // 2pm-4pm
      dusk: { start: 17, end: 19 },     // 5pm-7pm
      evening: { start: 20, end: 22 }    // 8pm-10pm
    };
    
    this.initializeRouting();
  }
  
  /**
   * Route a sacred message based on coherence
   */
  async routeMessage(message) {
    try {
      // Get recipient states
      const recipientStates = await this.getRecipientStates(message.recipients);
      
      // Create routing plan
      const routingPlan = await this.createRoutingPlan(message, recipientStates);
      
      // Execute routing based on plan
      const results = await this.executeRouting(message, routingPlan);
      
      // Track field impact
      await this.trackFieldImpact(message, results);
      
      return {
        success: true,
        routed: results.delivered.length,
        queued: results.queued.length,
        fieldImpact: results.fieldImpact
      };
      
    } catch (error) {
      console.error('Routing error:', error);
      throw new Error('Failed to route message: ' + error.message);
    }
  }
  
  /**
   * Get current states of all recipients
   */
  async getRecipientStates(recipients) {
    const states = [];
    
    for (const recipientId of recipients) {
      // Get user's current coherence from Personal Pulse
      const coherenceData = await this.pulse.getUserCoherence(recipientId);
      
      // Get user's presence state
      const presenceData = await this.db
        .collection('presence')
        .doc(recipientId)
        .get();
      
      const presence = presenceData.exists ? presenceData.data() : {};
      
      // Get user's preferences
      const userDoc = await this.db
        .collection('users')
        .doc(recipientId)
        .get();
      
      const preferences = userDoc.exists ? 
        userDoc.data().messagePreferences || {} : {};
      
      states.push({
        userId: recipientId,
        coherence: coherenceData.current || 0.75,
        trend: coherenceData.trend || 'stable',
        state: presence.state || 'available',
        lastActive: presence.lastActive || new Date(),
        preferences: {
          quietHours: preferences.quietHours || [],
          coherenceThreshold: preferences.coherenceThreshold || 0.4,
          sacredWindows: preferences.sacredWindows || ['morning', 'evening']
        }
      });
    }
    
    return states;
  }
  
  /**
   * Create optimal routing plan
   */
  async createRoutingPlan(message, recipientStates) {
    const plan = {
      immediate: [],
      gentle: [],
      queued: [],
      silent: []
    };
    
    for (const recipient of recipientStates) {
      // Check if in deep practice
      if (recipient.state === 'deep-practice' || 
          recipient.state === 'ceremony') {
        plan.silent.push({
          ...recipient,
          reason: 'In sacred practice',
          deliveryTime: await this.predictNextAvailable(recipient)
        });
        continue;
      }
      
      // Check coherence level
      const coherence = recipient.coherence;
      
      if (coherence < this.routingRules.lowCoherence.max) {
        // Low coherence - queue for better timing
        const optimalTime = await this.findOptimalDeliveryTime(recipient);
        plan.queued.push({
          ...recipient,
          reason: 'Low coherence',
          deliveryTime: optimalTime,
          preparationSuggested: true
        });
        
      } else if (coherence < this.routingRules.mediumCoherence.max) {
        // Medium coherence - gentle delivery
        plan.gentle.push({
          ...recipient,
          reason: 'Moderate coherence',
          enhancements: ['breathing_reminder', 'coherence_boost']
        });
        
      } else {
        // High coherence - immediate delivery with enhancements
        plan.immediate.push({
          ...recipient,
          reason: 'High coherence',
          enhancements: ['resonance_amplification', 'field_connection']
        });
      }
      
      // Override based on message priority
      if (message.priority === 'urgent' && plan.queued.includes(recipient)) {
        // Move from queued to gentle for urgent messages
        plan.queued = plan.queued.filter(r => r.userId !== recipient.userId);
        plan.gentle.push({
          ...recipient,
          reason: 'Urgent override',
          urgentDelivery: true
        });
      }
    }
    
    return plan;
  }
  
  /**
   * Execute the routing plan
   */
  async executeRouting(message, plan) {
    const results = {
      delivered: [],
      queued: [],
      fieldImpact: 0
    };
    
    // Immediate delivery
    for (const recipient of plan.immediate) {
      await this.deliverImmediate(message, recipient);
      results.delivered.push({
        userId: recipient.userId,
        method: 'immediate',
        enhancements: recipient.enhancements
      });
    }
    
    // Gentle delivery
    for (const recipient of plan.gentle) {
      await this.deliverGentle(message, recipient);
      results.delivered.push({
        userId: recipient.userId,
        method: 'gentle',
        enhancements: recipient.enhancements
      });
    }
    
    // Queue for optimal timing
    for (const recipient of plan.queued) {
      await this.queueForDelivery(message, recipient);
      results.queued.push({
        userId: recipient.userId,
        scheduledFor: recipient.deliveryTime,
        reason: recipient.reason
      });
    }
    
    // Silent queue (no notification)
    for (const recipient of plan.silent) {
      await this.silentQueue(message, recipient);
      results.queued.push({
        userId: recipient.userId,
        scheduledFor: recipient.deliveryTime,
        reason: recipient.reason,
        silent: true
      });
    }
    
    // Calculate field impact
    results.fieldImpact = await this.calculateFieldImpact(
      message, 
      results.delivered.length, 
      plan
    );
    
    return results;
  }
  
  /**
   * Immediate delivery with coherence boost
   */
  async deliverImmediate(message, recipient) {
    // Add to inbox immediately
    await this.db.collection('messages').add({
      ...message,
      recipientId: recipient.userId,
      deliveredAt: new Date(),
      deliveryMethod: 'immediate',
      recipientCoherence: recipient.coherence,
      enhancements: recipient.enhancements,
      read: false
    });
    
    // Send push notification with enhancements
    await this.sendEnhancedNotification(recipient.userId, message, {
      type: 'resonance',
      coherenceBoost: true,
      soundProfile: 'harmonic',
      visualPulse: true
    });
    
    // Update field coherence
    await this.updateFieldFromDelivery(recipient.userId, 'immediate', message);
  }
  
  /**
   * Gentle delivery with preparation
   */
  async deliverGentle(message, recipient) {
    // Pre-notification to prepare recipient
    if (recipient.enhancements.includes('breathing_reminder')) {
      await this.sendPreparationNotification(recipient.userId, {
        type: 'breathing',
        message: 'Sacred message arriving. Take three deep breaths...',
        duration: 15000 // 15 seconds
      });
      
      // Wait for preparation
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
    
    // Add to inbox
    await this.db.collection('messages').add({
      ...message,
      recipientId: recipient.userId,
      deliveredAt: new Date(),
      deliveryMethod: 'gentle',
      recipientCoherence: recipient.coherence,
      enhancements: recipient.enhancements,
      read: false
    });
    
    // Gentle notification
    await this.sendEnhancedNotification(recipient.userId, message, {
      type: 'gentle',
      soundProfile: 'soft-chime',
      fadeIn: true,
      vibrationPattern: [100, 200, 100] // Gentle pulse
    });
  }
  
  /**
   * Queue message for optimal delivery
   */
  async queueForDelivery(message, recipient) {
    await this.db.collection('messageQueue').add({
      ...message,
      recipientId: recipient.userId,
      queuedAt: new Date(),
      scheduledFor: recipient.deliveryTime,
      reason: recipient.reason,
      status: 'queued',
      preparationSuggested: recipient.preparationSuggested
    });
    
    // Schedule delivery
    await this.scheduleDelivery(message, recipient);
  }
  
  /**
   * Silent queue - no notifications
   */
  async silentQueue(message, recipient) {
    await this.db.collection('messageQueue').add({
      ...message,
      recipientId: recipient.userId,
      queuedAt: new Date(),
      scheduledFor: recipient.deliveryTime,
      reason: recipient.reason,
      status: 'silent_queued',
      notificationOnDelivery: false
    });
  }
  
  /**
   * Find optimal delivery time based on patterns
   */
  async findOptimalDeliveryTime(recipient) {
    // Get historical coherence patterns
    const patterns = await this.analyzeCoherencePatterns(recipient.userId);
    
    // Find next peak coherence window
    const nextWindows = this.findUpcomingSacredWindows(recipient.preferences);
    
    // Cross-reference with patterns
    for (const window of nextWindows) {
      const predictedCoherence = patterns.predictCoherenceAt(window.start);
      if (predictedCoherence > recipient.preferences.coherenceThreshold) {
        return window.start;
      }
    }
    
    // Default to next morning window
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
  }
  
  /**
   * Analyze user's coherence patterns
   */
  async analyzeCoherencePatterns(userId) {
    // Get last 7 days of coherence data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const sessions = await this.db
      .collection('sessions')
      .where('userId', '==', userId)
      .where('startTime', '>', sevenDaysAgo)
      .orderBy('startTime', 'desc')
      .get();
    
    const patterns = {
      byHour: new Array(24).fill(null).map(() => []),
      byDayOfWeek: new Array(7).fill(null).map(() => []),
      peaks: [],
      valleys: []
    };
    
    sessions.forEach(doc => {
      const data = doc.data();
      const startTime = data.startTime.toDate();
      const hour = startTime.getHours();
      const dayOfWeek = startTime.getDay();
      
      patterns.byHour[hour].push(data.peakCoherence || 0.75);
      patterns.byDayOfWeek[dayOfWeek].push(data.peakCoherence || 0.75);
      
      if (data.peakCoherence > 0.85) {
        patterns.peaks.push({
          time: startTime,
          coherence: data.peakCoherence
        });
      }
    });
    
    // Calculate averages and create prediction function
    patterns.predictCoherenceAt = (targetTime) => {
      const hour = targetTime.getHours();
      const hourData = patterns.byHour[hour];
      if (hourData.length > 0) {
        return hourData.reduce((a, b) => a + b) / hourData.length;
      }
      return 0.75; // Default baseline
    };
    
    return patterns;
  }
  
  /**
   * Find upcoming sacred windows
   */
  findUpcomingSacredWindows(preferences) {
    const windows = [];
    const now = new Date();
    
    // Check today's remaining windows
    for (const [name, window] of Object.entries(this.sacredWindows)) {
      if (preferences.sacredWindows.includes(name)) {
        const windowTime = new Date();
        windowTime.setHours(window.start, 0, 0, 0);
        
        if (windowTime > now) {
          windows.push({
            name,
            start: windowTime,
            end: new Date(windowTime.getTime() + (window.end - window.start) * 60 * 60 * 1000)
          });
        }
      }
    }
    
    // Add tomorrow's windows if needed
    if (windows.length < 3) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      for (const [name, window] of Object.entries(this.sacredWindows)) {
        if (preferences.sacredWindows.includes(name)) {
          const windowTime = new Date(tomorrow);
          windowTime.setHours(window.start, 0, 0, 0);
          
          windows.push({
            name,
            start: windowTime,
            end: new Date(windowTime.getTime() + (window.end - window.start) * 60 * 60 * 1000)
          });
        }
      }
    }
    
    return windows.sort((a, b) => a.start - b.start);
  }
  
  /**
   * Calculate field impact of message delivery
   */
  async calculateFieldImpact(message, deliveredCount, plan) {
    let impact = 0;
    
    // Base impact from message harmony
    const harmonyImpacts = {
      transparency: 0.05,
      coherence: 0.10,
      resonance: 0.08,
      agency: 0.06,
      vitality: 0.07,
      mutuality: 0.09,
      novelty: 0.04
    };
    
    impact += harmonyImpacts[message.harmony] || 0.05;
    
    // Multiply by coherence of recipients
    const avgRecipientCoherence = plan.immediate
      .concat(plan.gentle)
      .reduce((sum, r) => sum + r.coherence, 0) / deliveredCount || 1;
    
    impact *= avgRecipientCoherence;
    
    // Bonus for high-coherence delivery
    const highCoherenceCount = plan.immediate.length;
    impact += highCoherenceCount * 0.02;
    
    // Love quotient multiplier
    impact *= (message.loveQuotient || 0.5);
    
    return Math.min(impact, 0.5); // Cap at 0.5 per message
  }
  
  /**
   * Update global field from delivery
   */
  async updateFieldFromDelivery(userId, method, message) {
    const contribution = {
      userId,
      messageId: message.id,
      timestamp: new Date(),
      deliveryMethod: method,
      harmony: message.harmony,
      impact: message.fieldImpact || 0.05
    };
    
    await this.db.collection('fieldContributions').add(contribution);
  }
  
  /**
   * Send enhanced notification
   */
  async sendEnhancedNotification(userId, message, enhancements) {
    // This would integrate with FCM or other push service
    console.log(`🔔 Enhanced notification for ${userId}:`, {
      title: message.title || 'Sacred Message',
      body: message.preview || message.content.substring(0, 100),
      data: {
        messageId: message.id,
        ...enhancements
      }
    });
  }
  
  /**
   * Send preparation notification
   */
  async sendPreparationNotification(userId, preparation) {
    console.log(`🧘 Preparation notification for ${userId}:`, preparation);
  }
  
  /**
   * Schedule future delivery
   */
  async scheduleDelivery(message, recipient) {
    // In production, this would use Cloud Scheduler or similar
    console.log(`📅 Scheduled delivery for ${recipient.userId} at ${recipient.deliveryTime}`);
  }
  
  /**
   * Initialize routing system
   */
  initializeRouting() {
    // Set up scheduled job to process queued messages
    setInterval(() => {
      this.processQueuedMessages();
    }, 60000); // Check every minute
  }
  
  /**
   * Process messages that are ready for delivery
   */
  async processQueuedMessages() {
    const now = new Date();
    
    const readyMessages = await this.db
      .collection('messageQueue')
      .where('status', '==', 'queued')
      .where('scheduledFor', '<=', now)
      .get();
    
    for (const doc of readyMessages.docs) {
      const queuedMessage = doc.data();
      
      // Re-check recipient coherence
      const currentState = await this.getRecipientStates([queuedMessage.recipientId]);
      
      if (currentState[0].coherence >= currentState[0].preferences.coherenceThreshold) {
        // Deliver now
        await this.deliverGentle(queuedMessage, currentState[0]);
        
        // Mark as delivered
        await doc.ref.update({
          status: 'delivered',
          deliveredAt: new Date()
        });
      } else {
        // Re-queue for next window
        const nextTime = await this.findOptimalDeliveryTime(currentState[0]);
        await doc.ref.update({
          scheduledFor: nextTime,
          requeueCount: (queuedMessage.requeueCount || 0) + 1
        });
      }
    }
  }
  
  /**
   * Predict when user will be available next
   */
  async predictNextAvailable(recipient) {
    // Simple prediction based on patterns
    if (recipient.state === 'deep-practice') {
      // Assume 30-60 minute practice
      const practiceEnd = new Date();
      practiceEnd.setMinutes(practiceEnd.getMinutes() + 45);
      return practiceEnd;
    }
    
    if (recipient.state === 'ceremony') {
      // Ceremonies typically 60-90 minutes
      const ceremonyEnd = new Date();
      ceremonyEnd.setMinutes(ceremonyEnd.getMinutes() + 75);
      return ceremonyEnd;
    }
    
    // Default to next sacred window
    const windows = this.findUpcomingSacredWindows(recipient.preferences);
    return windows[0]?.start || new Date(Date.now() + 3600000); // 1 hour
  }
}

// Export for use
export default CoherenceRouter;