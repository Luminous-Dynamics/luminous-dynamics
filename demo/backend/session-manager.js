/**
 * Sacred Session Manager
 * Holds space for contemplative AI conversations with sacred persistence
 */

const { SacredDatabase } = require('./config/database');

class SacredSessionManager {
    constructor() {
        // Sacred database for persistence
        this.sacredDb = new SacredDatabase();
        
        // Memory fallback for when database is unavailable
        this.memorySessions = new Map();
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        // Clean up expired sessions every 5 minutes
        setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
        
        console.log('🌟 Sacred Session Manager initialized with database persistence');
    }
    
    /**
     * Create a new sacred session
     */
    createSession(persona = 'wise-witness') {
        const sessionId = this.generateSessionId();
        const now = Date.now();
        
        const session = {
            id: sessionId,
            persona,
            createdAt: now,
            lastActivity: now,
            duration: 0,
            offerings: [], // User messages
            guidance: [],  // AI responses
            contemplativeCheckins: [],
            sacredMoments: [],
            isActive: true,
            naturalConclusionReached: false
        };
        
        // Store in database with memory fallback
        this.storeSession(sessionId, session);
        
        console.log(`🌟 Sacred session created: ${sessionId} (${persona})`);
        return sessionId;
    }
    
    /**
     * Add user offering to session
     */
    async addOffering(sessionId, message) {
        const session = await this.getSession(sessionId);
        if (!session) return false;
        
        const offering = {
            text: message,
            timestamp: Date.now(),
            contemplativeMetrics: this.analyzeContemplativeMetrics(message)
        };
        
        session.offerings.push(offering);
        await this.updateSession(sessionId, session);
        
        console.log(`💫 Offering received in session ${sessionId}: ${message.substring(0, 50)}...`);
        return true;
    }
    
    /**
     * Add AI guidance to session
     */
    async addGuidance(sessionId, guidanceObj) {
        const session = await this.getSession(sessionId);
        if (!session) return false;
        
        const guidance = {
            ...guidanceObj,
            timestamp: Date.now()
        };
        
        session.guidance.push(guidance);
        await this.updateSession(sessionId, session);
        
        console.log(`✨ Guidance added to session ${sessionId}: depth ${guidanceObj.contemplativeDepth}/10`);
        return true;
    }
    
    /**
     * Add contemplative check-in
     */
    addContemplativeCheckin(sessionId, checkin) {
        const session = this.getSession(sessionId);
        if (!session) return false;
        
        session.contemplativeCheckins.push({
            text: checkin,
            timestamp: Date.now()
        });
        
        return true;
    }
    
    /**
     * Record sacred moment
     */
    recordSacredMoment(sessionId, momentType, data = {}) {
        const session = this.getSession(sessionId);
        if (!session) return false;
        
        session.sacredMoments.push({
            type: momentType,
            timestamp: Date.now(),
            data
        });
        
        return true;
    }
    
    /**
     * Store session in database with memory fallback
     */
    async storeSession(sessionId, session) {
        try {
            // Try database first
            const stored = await this.sacredDb.storeSession(sessionId, session);
            if (stored) {
                // Also keep in memory for quick access
                this.memorySessions.set(sessionId, session);
                return true;
            }
        } catch (error) {
            console.warn('💫 Database storage failed, using memory fallback:', error.message);
        }
        
        // Fallback to memory only
        this.memorySessions.set(sessionId, session);
        return true;
    }
    
    /**
     * Get session from database with memory fallback
     */
    async getSession(sessionId) {
        try {
            // Try database first
            const session = await this.sacredDb.getSession(sessionId);
            if (session && this.isSessionValid(session)) {
                // Cache in memory for quick access
                this.memorySessions.set(sessionId, session);
                return session;
            }
        } catch (error) {
            console.warn('💫 Database retrieval failed, using memory fallback:', error.message);
        }
        
        // Fallback to memory
        const memorySession = this.memorySessions.get(sessionId);
        return this.isSessionValid(memorySession) ? memorySession : null;
    }
    
    /**
     * Check if session data is valid and active
     */
    isSessionValid(session) {
        if (!session) return false;
        
        const now = Date.now();
        const isExpired = (now - session.lastActivity) > this.sessionTimeout;
        
        if (isExpired) {
            return false;
        }
        
        return session.isActive;
    }
    
    /**
     * Update session in both database and memory
     */
    async updateSession(sessionId, session) {
        session.lastActivity = Date.now();
        session.duration = session.lastActivity - session.createdAt;
        
        try {
            await this.sacredDb.updateSession(sessionId, session);
        } catch (error) {
            console.warn('💫 Database update failed, memory only:', error.message);
        }
        
        this.memorySessions.set(sessionId, session);
        return true;
    }
    
    /**
     * Complete session naturally
     */
    completeSession(sessionId) {
        const session = this.getSession(sessionId);
        if (!session) return false;
        
        session.isActive = false;
        session.naturalConclusionReached = true;
        session.completedAt = Date.now();
        session.finalDuration = session.completedAt - session.createdAt;
        
        console.log(`🙏 Sacred session completed naturally: ${sessionId} (${this.formatDuration(session.finalDuration)})`);
        
        // Keep completed sessions for analytics for 1 hour
        setTimeout(() => {
            this.sessions.delete(sessionId);
            console.log(`📝 Session ${sessionId} archived`);
        }, 60 * 60 * 1000);
        
        return true;
    }
    
    /**
     * Expire session due to timeout
     */
    expireSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) return;
        
        session.isActive = false;
        session.expiredAt = Date.now();
        
        console.log(`⏰ Session expired: ${sessionId} (${this.formatDuration(Date.now() - session.createdAt)})`);
        
        // Remove expired sessions after 10 minutes
        setTimeout(() => {
            this.sessions.delete(sessionId);
        }, 10 * 60 * 1000);
    }
    
    /**
     * Analyze contemplative metrics in user message
     */
    analyzeContemplativeMetrics(message) {
        const text = message.toLowerCase();
        
        return {
            presenceIndicators: this.countMatches(text, [
                'feel', 'feeling', 'sense', 'notice', 'aware', 'present',
                'here', 'now', 'moment', 'breath', 'body'
            ]),
            emotionalDepth: this.countMatches(text, [
                'sad', 'joy', 'angry', 'fear', 'love', 'grief',
                'excited', 'anxious', 'peaceful', 'grateful'
            ]),
            seekingGuidance: this.countMatches(text, [
                'help', 'guidance', 'advice', 'support', 'wisdom',
                'what should', 'how do', 'why', 'meaning', 'purpose'
            ]),
            contemplativeLanguage: this.countMatches(text, [
                'meditation', 'practice', 'spiritual', 'consciousness',
                'awakening', 'mindful', 'presence', 'awareness'
            ]),
            wordCount: message.split(' ').length,
            authenticity: this.assessAuthenticity(text)
        };
    }
    
    /**
     * Count pattern matches in text
     */
    countMatches(text, patterns) {
        return patterns.reduce((count, pattern) => {
            return count + (text.includes(pattern) ? 1 : 0);
        }, 0);
    }
    
    /**
     * Assess authenticity of message
     */
    assessAuthenticity(text) {
        // Simple heuristics for authentic expression
        const personalPronouns = this.countMatches(text, ['i ', 'me ', 'my ', 'myself']);
        const questionMarks = (text.match(/\?/g) || []).length;
        const exclamations = (text.match(/!/g) || []).length;
        const capitalWords = (text.match(/[A-Z]{2,}/g) || []).length;
        
        // Higher score for personal language, moderate for questions/emotions
        let score = personalPronouns * 2 + questionMarks + exclamations;
        
        // Penalize excessive caps (shouting)
        if (capitalWords > 2) score -= capitalWords;
        
        return Math.max(0, Math.min(10, score));
    }
    
    /**
     * Get session analytics
     */
    getSessionAnalytics(sessionId) {
        const session = this.getSession(sessionId);
        if (!session) return null;
        
        const totalOfferings = session.offerings.length;
        const avgContemplativeDepth = session.guidance.reduce((sum, g) => 
            sum + (g.contemplativeDepth || 0), 0) / Math.max(1, session.guidance.length);
        
        const presenceScore = session.offerings.reduce((sum, offering) => 
            sum + offering.contemplativeMetrics.presenceIndicators, 0);
        
        return {
            sessionId,
            persona: session.persona,
            duration: session.duration,
            totalOfferings,
            totalGuidance: session.guidance.length,
            avgContemplativeDepth: Math.round(avgContemplativeDepth * 10) / 10,
            presenceScore,
            checkinsReceived: session.contemplativeCheckins.length,
            sacredMomentsCount: session.sacredMoments.length,
            isNaturallyComplete: session.naturalConclusionReached
        };
    }
    
    /**
     * Get overall analytics across all sessions
     */
    getOverallAnalytics() {
        const allSessions = Array.from(this.sessions.values());
        const activeSessions = allSessions.filter(s => s.isActive);
        const completedSessions = allSessions.filter(s => s.naturalConclusionReached);
        
        const totalSessions = allSessions.length;
        const totalOfferings = allSessions.reduce((sum, s) => sum + s.offerings.length, 0);
        const totalGuidance = allSessions.reduce((sum, s) => sum + s.guidance.length, 0);
        
        const avgSessionDuration = totalSessions > 0 
            ? allSessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions
            : 0;
        
        const personaDistribution = {
            'wise-witness': allSessions.filter(s => s.persona === 'wise-witness').length,
            'loving-gardener': allSessions.filter(s => s.persona === 'loving-gardener').length,
            'calm-river': allSessions.filter(s => s.persona === 'calm-river').length
        };
        
        return {
            totalSessions,
            activeSessions: activeSessions.length,
            completedSessions: completedSessions.length,
            totalOfferings,
            totalGuidance,
            avgSessionDuration: Math.round(avgSessionDuration / 1000), // in seconds
            personaDistribution,
            naturalCompletionRate: totalSessions > 0 
                ? Math.round((completedSessions.length / totalSessions) * 100) 
                : 0
        };
    }
    
    /**
     * Clean up expired sessions
     */
    cleanupExpiredSessions() {
        const now = Date.now();
        let cleanedCount = 0;
        
        for (const [sessionId, session] of this.sessions) {
            const timeSinceActivity = now - session.lastActivity;
            
            if (timeSinceActivity > this.sessionTimeout && session.isActive) {
                this.expireSession(sessionId);
                cleanedCount++;
            }
        }
        
        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
        }
    }
    
    /**
     * Generate unique session ID
     */
    generateSessionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `sacred_${timestamp}_${random}`;
    }
    
    /**
     * Format duration for logging
     */
    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }
}

module.exports = { SacredSessionManager };