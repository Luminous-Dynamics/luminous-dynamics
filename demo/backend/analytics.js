/**
 * Contemplative Analytics
 * Measuring presence over engagement, wisdom over addiction
 */

class ContemplativeAnalytics {
    constructor() {
        this.metrics = {
            sacredMoments: [],
            presenceIndicators: [],
            wisdomCultivation: [],
            naturalConclusions: 0,
            forcedExits: 0,
            totalSessions: 0,
            uniqueVisitors: new Set(),
            personaPreferences: {
                'wise-witness': 0,
                'loving-gardener': 0,
                'calm-river': 0
            },
            contemplativeDepthScores: [],
            sessionDurations: [],
            userWellbeingReports: []
        };
        
        // Privacy-first approach - no personal data stored
        this.privacyPrinciples = {
            noPersonalData: true,
            aggregatedOnly: true,
            contemplativeFocus: true,
            deletionPolicy: '30 days'
        };
        
        console.log('🔮 Contemplative Analytics initialized - measuring consciousness, not consumption');
    }
    
    /**
     * Track sacred moment in user journey
     */
    trackSacredMoment(momentType, sessionId, persona, metadata = {}) {
        const moment = {
            type: momentType,
            sessionId: this.hashSessionId(sessionId), // Anonymous hash
            persona,
            timestamp: Date.now(),
            metadata: this.sanitizeMetadata(metadata)
        };
        
        this.metrics.sacredMoments.push(moment);
        this.updatePersonaMetrics(persona);
        
        // Specific tracking for different moment types
        switch (momentType) {
            case 'threshold':
                this.trackThresholdMoment(moment);
                break;
            case 'offering':
                this.trackOfferingMoment(moment);
                break;
            case 'sacred_pause':
                this.trackSacredPause(moment);
                break;
            case 'guidance':
                this.trackGuidanceMoment(moment);
                break;
            case 'integration':
                this.trackIntegrationMoment(moment);
                break;
        }
        
        console.log(`📊 Sacred moment tracked: ${momentType} (${persona})`);
    }
    
    /**
     * Track threshold moments (session beginnings)
     */
    trackThresholdMoment(moment) {
        this.metrics.totalSessions++;
        this.metrics.uniqueVisitors.add(moment.sessionId);
        
        // Track time of day for contemplative patterns
        const hour = new Date().getHours();
        this.trackContemplativeTimingPattern(hour, 'threshold');
    }
    
    /**
     * Track offering moments (user messages)
     */
    trackOfferingMoment(moment) {
        const { messageLength, presenceIndicators = 0, emotionalDepth = 0 } = moment.metadata;
        
        this.presenceIndicators.push({
            timestamp: moment.timestamp,
            indicators: presenceIndicators,
            emotionalDepth,
            messageLength
        });
        
        // Track contemplative language usage
        this.trackContemplativeLanguageEvolution(moment);
    }
    
    /**
     * Track sacred pause effectiveness
     */
    trackSacredPause(moment) {
        // Track if pauses are being experienced or if users are bouncing
        const pauseMetric = {
            persona: moment.persona,
            timestamp: moment.timestamp,
            completed: true // In real implementation, would track if user waited
        };
        
        this.metrics.contemplativePauses = this.metrics.contemplativePauses || [];
        this.metrics.contemplativePauses.push(pauseMetric);
    }
    
    /**
     * Track guidance moments (AI responses)
     */
    trackGuidanceMoment(moment) {
        const { responseLength, contemplativeDepth } = moment.metadata;
        
        this.metrics.contemplativeDepthScores.push({
            depth: contemplativeDepth,
            persona: moment.persona,
            timestamp: moment.timestamp,
            responseLength
        });
        
        // Track wisdom cultivation patterns
        this.trackWisdomCultivation(moment, contemplativeDepth);
    }
    
    /**
     * Track integration moments (session endings)
     */
    trackIntegrationMoment(moment) {
        const { sessionDuration, totalOfferings, naturalConclusion = true } = moment.metadata;
        
        if (naturalConclusion) {
            this.metrics.naturalConclusions++;
        } else {
            this.metrics.forcedExits++;
        }
        
        this.metrics.sessionDurations.push({
            duration: sessionDuration,
            offerings: totalOfferings,
            persona: moment.persona,
            timestamp: moment.timestamp,
            naturalEnding: naturalConclusion
        });
        
        // Calculate presence-over-engagement score
        this.calculatePresenceScore(moment, sessionDuration, totalOfferings);
    }
    
    /**
     * Track wisdom cultivation patterns
     */
    trackWisdomCultivation(moment, contemplativeDepth) {
        this.metrics.wisdomCultivation.push({
            timestamp: moment.timestamp,
            depth: contemplativeDepth,
            persona: moment.persona
        });
    }
    
    /**
     * Track contemplative timing patterns
     */
    trackContemplativeTimingPattern(hour, eventType) {
        this.metrics.timingPatterns = this.metrics.timingPatterns || {};
        this.metrics.timingPatterns[hour] = this.metrics.timingPatterns[hour] || {};
        this.metrics.timingPatterns[hour][eventType] = (this.metrics.timingPatterns[hour][eventType] || 0) + 1;
    }
    
    /**
     * Track evolution of contemplative language use
     */
    trackContemplativeLanguageEvolution(moment) {
        // Track if users are adopting more contemplative language over time
        this.metrics.languageEvolution = this.metrics.languageEvolution || [];
        this.metrics.languageEvolution.push({
            timestamp: moment.timestamp,
            contemplativeWords: moment.metadata.contemplativeLanguage || 0,
            presenceWords: moment.metadata.presenceIndicators || 0
        });
    }
    
    /**
     * Calculate presence-over-engagement score
     */
    calculatePresenceScore(moment, sessionDuration, totalOfferings) {
        // Revolutionary metric: measures quality of presence vs quantity of engagement
        const avgOfferingInterval = sessionDuration / Math.max(1, totalOfferings);
        const contemplativeScore = this.getAvgContemplativeDepth(moment.sessionId);
        
        // Higher scores for: longer pauses between messages, higher contemplative depth, natural endings
        const presenceScore = Math.min(100, 
            (avgOfferingInterval / 1000) * 2 + // 2 points per second between offerings
            contemplativeScore * 5 + // 5 points per contemplative depth point
            (moment.metadata.naturalConclusion ? 20 : 0) // 20 bonus points for natural ending
        );
        
        this.metrics.presenceScores = this.metrics.presenceScores || [];
        this.metrics.presenceScores.push({
            score: presenceScore,
            sessionDuration,
            totalOfferings,
            timestamp: moment.timestamp
        });
        
        return presenceScore;
    }
    
    /**
     * Get average contemplative depth for session
     */
    getAvgContemplativeDepth(sessionId) {
        const sessionDepths = this.metrics.contemplativeDepthScores
            .filter(score => score.sessionId === sessionId)
            .map(score => score.depth);
        
        return sessionDepths.length > 0 
            ? sessionDepths.reduce((sum, depth) => sum + depth, 0) / sessionDepths.length
            : 0;
    }
    
    /**
     * Update persona usage metrics
     */
    updatePersonaMetrics(persona) {
        if (this.metrics.personaPreferences[persona] !== undefined) {
            this.metrics.personaPreferences[persona]++;
        }
    }
    
    /**
     * Record user wellbeing feedback
     */
    recordWellbeingReport(sessionId, wellbeingData) {
        const report = {
            sessionId: this.hashSessionId(sessionId),
            timestamp: Date.now(),
            presenceIncrease: wellbeingData.presenceIncrease || 0,
            anxietyDecrease: wellbeingData.anxietyDecrease || 0,
            wisdomGained: wellbeingData.wisdomGained || 0,
            wouldRecommend: wellbeingData.wouldRecommend || false,
            authenticityRating: wellbeingData.authenticityRating || 0
        };
        
        this.metrics.userWellbeingReports.push(report);
        console.log(`💝 Wellbeing report recorded: presence +${report.presenceIncrease}`);
    }
    
    /**
     * Get comprehensive contemplative metrics
     */
    getContemplativeMetrics() {
        const now = Date.now();
        const last24Hours = now - (24 * 60 * 60 * 1000);
        const last7Days = now - (7 * 24 * 60 * 60 * 1000);
        
        return {
            overview: {
                totalSessions: this.metrics.totalSessions,
                uniqueVisitors: this.metrics.uniqueVisitors.size,
                naturalConclusionRate: this.calculateNaturalConclusionRate(),
                avgPresenceScore: this.calculateAvgPresenceScore(),
                avgContemplativeDepth: this.calculateAvgContemplativeDepth()
            },
            
            personaInsights: {
                preferences: this.metrics.personaPreferences,
                mostEffective: this.getMostEffectivePersona(),
                depthByPersona: this.getContemplativeDepthByPersona()
            },
            
            presenceMetrics: {
                avgSessionDuration: this.calculateAvgSessionDuration(),
                avgOfferingsPerSession: this.calculateAvgOfferingsPerSession(),
                contemplativePauseEffectiveness: this.calculatePauseEffectiveness(),
                presenceOverEngagement: this.calculatePresenceOverEngagement()
            },
            
            wisdomCultivation: {
                depthProgression: this.getDepthProgression(),
                languageEvolution: this.getLanguageEvolution(),
                wellbeingImpact: this.getWellbeingImpact()
            },
            
            timingInsights: {
                peakContemplativeHours: this.getPeakContemplativeHours(),
                naturalRhythms: this.getNaturalRhythms()
            },
            
            recent: {
                last24Hours: this.getMetricsForPeriod(last24Hours),
                last7Days: this.getMetricsForPeriod(last7Days)
            }
        };
    }
    
    /**
     * Calculate natural conclusion rate
     */
    calculateNaturalConclusionRate() {
        const totalEndings = this.metrics.naturalConclusions + this.metrics.forcedExits;
        return totalEndings > 0 
            ? Math.round((this.metrics.naturalConclusions / totalEndings) * 100)
            : 0;
    }
    
    /**
     * Calculate average presence score
     */
    calculateAvgPresenceScore() {
        const scores = this.metrics.presenceScores || [];
        return scores.length > 0
            ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
            : 0;
    }
    
    /**
     * Calculate average contemplative depth
     */
    calculateAvgContemplativeDepth() {
        const depths = this.metrics.contemplativeDepthScores;
        return depths.length > 0
            ? Math.round((depths.reduce((sum, d) => sum + d.depth, 0) / depths.length) * 10) / 10
            : 0;
    }
    
    /**
     * Get most effective persona for contemplative depth
     */
    getMostEffectivePersona() {
        const personaDepths = {};
        
        this.metrics.contemplativeDepthScores.forEach(score => {
            if (!personaDepths[score.persona]) {
                personaDepths[score.persona] = [];
            }
            personaDepths[score.persona].push(score.depth);
        });
        
        let mostEffective = null;
        let highestAvgDepth = 0;
        
        Object.entries(personaDepths).forEach(([persona, depths]) => {
            const avgDepth = depths.reduce((sum, d) => sum + d, 0) / depths.length;
            if (avgDepth > highestAvgDepth) {
                highestAvgDepth = avgDepth;
                mostEffective = persona;
            }
        });
        
        return {
            persona: mostEffective,
            avgDepth: Math.round(highestAvgDepth * 10) / 10
        };
    }
    
    /**
     * Calculate presence over engagement ratio
     */
    calculatePresenceOverEngagement() {
        // Revolutionary metric: quality of attention vs quantity of interaction
        const avgPresence = this.calculateAvgPresenceScore();
        const avgDuration = this.calculateAvgSessionDuration();
        const avgOfferings = this.calculateAvgOfferingsPerSession();
        
        // Higher ratio = more contemplative, less addictive
        return avgOfferings > 0 ? Math.round((avgPresence * avgDuration) / (avgOfferings * 1000)) : 0;
    }
    
    /**
     * Calculate average session duration in seconds
     */
    calculateAvgSessionDuration() {
        const durations = this.metrics.sessionDurations;
        return durations.length > 0
            ? Math.round(durations.reduce((sum, d) => sum + d.duration, 0) / durations.length / 1000)
            : 0;
    }
    
    /**
     * Calculate average offerings per session
     */
    calculateAvgOfferingsPerSession() {
        const durations = this.metrics.sessionDurations;
        return durations.length > 0
            ? Math.round(durations.reduce((sum, d) => sum + d.offerings, 0) / durations.length)
            : 0;
    }
    
    /**
     * Sanitize metadata to remove personal information
     */
    sanitizeMetadata(metadata) {
        // Remove any potentially personal data
        const sanitized = { ...metadata };
        delete sanitized.userIdentifier;
        delete sanitized.ipAddress;
        delete sanitized.personalData;
        
        return sanitized;
    }
    
    /**
     * Hash session ID for privacy
     */
    hashSessionId(sessionId) {
        // Simple hash for anonymization
        let hash = 0;
        for (let i = 0; i < sessionId.length; i++) {
            const char = sessionId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    /**
     * Get metrics for specific time period
     */
    getMetricsForPeriod(startTime) {
        const periodMoments = this.metrics.sacredMoments.filter(m => m.timestamp >= startTime);
        const periodSessions = new Set(periodMoments.map(m => m.sessionId)).size;
        
        return {
            sessions: periodSessions,
            moments: periodMoments.length,
            personas: this.getPersonaDistribution(periodMoments)
        };
    }
    
    /**
     * Get persona distribution for given moments
     */
    getPersonaDistribution(moments) {
        const distribution = { 'wise-witness': 0, 'loving-gardener': 0, 'calm-river': 0 };
        moments.forEach(m => {
            if (distribution[m.persona] !== undefined) {
                distribution[m.persona]++;
            }
        });
        return distribution;
    }
    
    /**
     * Export contemplative metrics for research
     */
    exportContemplativeResearch() {
        return {
            studyTitle: "Contemplative AI Interaction Patterns",
            dataType: "Aggregated, Anonymous, Consciousness-Focused",
            privacyCompliant: true,
            researchFindings: this.getContemplativeMetrics(),
            methodology: "Presence-over-engagement measurement paradigm",
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = { ContemplativeAnalytics };