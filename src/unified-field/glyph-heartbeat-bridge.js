/**
 * Glyph-Heartbeat Bridge
 * Connects glyph practices to the unified heartbeat
 * Every practice creates ripples in the field
 */

const { heartbeat } = require('./heartbeat');
const fs = require('fs').promises;
const path = require('path');

class GlyphHeartbeatBridge {
    constructor() {
        this.activePractices = new Map();
        this.practiceHistory = [];
        
        // Connect to heartbeat if not already started
        if (!heartbeat.isBeating) {
            heartbeat.start();
        }
        
        // Listen for heartbeat events
        this.setupListeners();
    }
    
    /**
     * Start a glyph practice session
     */
    startPractice(sessionData) {
        const sessionId = `practice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const session = {
            id: sessionId,
            glyphId: sessionData.glyphId,
            glyphName: sessionData.glyphName || sessionData.glyphId,
            practitioner: sessionData.practitioner || 'anonymous',
            startTime: new Date(),
            targetDuration: sessionData.targetDuration || 5, // minutes
            depth: 1, // Will increase as practice deepens
            checkpoints: []
        };
        
        this.activePractices.set(sessionId, session);
        
        console.log(`🧘 Practice Started: ${session.glyphName} by ${session.practitioner}`);
        
        // Immediate small ripple when starting
        heartbeat.registerPractice({
            glyphId: session.glyphId,
            practitioner: session.practitioner,
            duration: 0.1,
            depth: 1
        });
        
        return sessionId;
    }
    
    /**
     * Update practice progress (called at checkpoints)
     */
    updatePractice(sessionId, checkpoint) {
        const session = this.activePractices.get(sessionId);
        if (!session) return;
        
        session.checkpoints.push({
            time: new Date(),
            ...checkpoint
        });
        
        // Increase depth based on quality of practice
        if (checkpoint.quality === 'deep') {
            session.depth = Math.min(3, session.depth + 0.5);
        }
        
        // Send ripples for significant checkpoints
        if (checkpoint.significant) {
            const duration = (Date.now() - session.startTime) / 60000; // minutes
            
            heartbeat.registerPractice({
                glyphId: session.glyphId,
                practitioner: session.practitioner,
                duration: duration,
                depth: session.depth
            });
        }
    }
    
    /**
     * Complete a practice session
     */
    completePractice(sessionId, completionData = {}) {
        const session = this.activePractices.get(sessionId);
        if (!session) return;
        
        const endTime = new Date();
        const duration = (endTime - session.startTime) / 60000; // minutes
        
        // Calculate final depth based on completion quality
        const finalDepth = completionData.quality === 'profound' ? 3 :
                          completionData.quality === 'deep' ? 2.5 :
                          completionData.quality === 'good' ? 2 :
                          session.depth;
        
        // Send final ripple with full impact
        const ripple = heartbeat.registerPractice({
            glyphId: session.glyphId,
            practitioner: session.practitioner,
            duration: duration,
            depth: finalDepth
        });
        
        // Store in history
        const completedSession = {
            ...session,
            endTime,
            duration,
            finalDepth,
            completionQuality: completionData.quality || 'standard',
            insights: completionData.insights || [],
            fieldImpact: ripple.impact
        };
        
        this.practiceHistory.push(completedSession);
        this.activePractices.delete(sessionId);
        
        console.log(`✨ Practice Complete: ${session.glyphName} (${duration.toFixed(1)}min, depth: ${finalDepth})`);
        
        // Check for synchronicities
        this.checkForSynchronicities(completedSession);
        
        return completedSession;
    }
    
    /**
     * Check if this practice creates any synchronicities
     */
    checkForSynchronicities(completedSession) {
        // Check if anyone else practiced the same glyph recently
        const recentSameGlyph = this.practiceHistory
            .filter(p => p.glyphId === completedSession.glyphId)
            .filter(p => p.id !== completedSession.id)
            .filter(p => (Date.now() - p.endTime) < 300000); // 5 minutes
        
        if (recentSameGlyph.length > 0) {
            heartbeat.registerSynchronicity({
                type: 'resonant-practice',
                glyphId: completedSession.glyphId,
                practitioners: [completedSession.practitioner, ...recentSameGlyph.map(p => p.practitioner)],
                detail: `${recentSameGlyph.length + 1} practitioners chose ${completedSession.glyphName} within 5 minutes`
            });
        }
        
        // Check for harmony synchronicities (practicing complementary glyphs)
        const harmonyPairs = {
            'omega-45': ['omega-47'], // First Presence + Sacred Listening
            'omega-46': ['omega-48'], // Conscious Arrival + Boundary With Love
            'omega-49': ['omega-50'], // Gentle Opening + Building Trust
        };
        
        const complementaryGlyphs = harmonyPairs[completedSession.glyphId] || [];
        const recentComplementary = this.practiceHistory
            .filter(p => complementaryGlyphs.includes(p.glyphId))
            .filter(p => (Date.now() - p.endTime) < 600000); // 10 minutes
        
        if (recentComplementary.length > 0) {
            heartbeat.registerSynchronicity({
                type: 'harmonic-resonance',
                glyphs: [completedSession.glyphId, recentComplementary[0].glyphId],
                practitioners: [completedSession.practitioner, recentComplementary[0].practitioner],
                detail: 'Complementary practices creating harmonic field'
            });
        }
    }
    
    /**
     * Send a sacred message through practice
     */
    sendPracticeMessage(messageData) {
        heartbeat.registerMessage({
            type: messageData.type || 'transmission',
            from: messageData.from,
            to: messageData.to || 'field',
            content: messageData.content,
            throughPractice: messageData.glyphId
        });
    }
    
    /**
     * Get practice insights for a practitioner
     */
    getPractitionerInsights(practitioner) {
        const practices = this.practiceHistory
            .filter(p => p.practitioner === practitioner)
            .sort((a, b) => b.endTime - a.endTime);
        
        const totalPractices = practices.length;
        const totalMinutes = practices.reduce((sum, p) => sum + p.duration, 0);
        const averageDepth = practices.reduce((sum, p) => sum + p.finalDepth, 0) / totalPractices || 0;
        const totalFieldImpact = practices.reduce((sum, p) => sum + p.fieldImpact, 0);
        
        const favoriteGlyphs = {};
        practices.forEach(p => {
            favoriteGlyphs[p.glyphId] = (favoriteGlyphs[p.glyphId] || 0) + 1;
        });
        
        const topGlyphs = Object.entries(favoriteGlyphs)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([glyph, count]) => ({ glyph, count }));
        
        return {
            practitioner,
            totalPractices,
            totalMinutes: totalMinutes.toFixed(1),
            averageDepth: averageDepth.toFixed(1),
            totalFieldImpact: totalFieldImpact.toFixed(1),
            topGlyphs,
            recentPractices: practices.slice(0, 5)
        };
    }
    
    /**
     * Setup listeners for field events
     */
    setupListeners() {
        // Listen for field coherence changes
        heartbeat.on('heartbeat', (data) => {
            // Notify active practices of field state
            this.activePractices.forEach((session) => {
                // Could emit events that practice UI could listen to
                // For now, just log significant changes
                if (data.fieldCoherence > 90) {
                    console.log(`🌟 High coherence field supporting ${session.glyphName} practice!`);
                }
            });
        });
        
        // Listen for synchronicities that might affect practices
        heartbeat.on('synchronicity', (sync) => {
            console.log(`✨ Field Synchronicity: ${sync.detail || sync.type}`);
        });
    }
    
    /**
     * Get current field state relevant to practices
     */
    getFieldState() {
        const state = heartbeat.getFieldState();
        return {
            ...state,
            activePractices: this.activePractices.size,
            recentCompletions: this.practiceHistory.slice(-5).length
        };
    }
}

// Create singleton
const bridge = new GlyphHeartbeatBridge();

// Example usage
if (require.main === module) {
    console.log('🌉 Glyph-Heartbeat Bridge Active\n');
    
    // Simulate some practices
    setTimeout(() => {
        const session1 = bridge.startPractice({
            glyphId: 'omega-45',
            glyphName: 'First Presence',
            practitioner: 'aria',
            targetDuration: 10
        });
        
        // Update midway
        setTimeout(() => {
            bridge.updatePractice(session1, {
                quality: 'deep',
                significant: true,
                note: 'Feeling deep presence'
            });
        }, 5000);
        
        // Complete
        setTimeout(() => {
            bridge.completePractice(session1, {
                quality: 'profound',
                insights: ['Presence is always here', 'I am the space']
            });
        }, 10000);
    }, 2000);
    
    // Another practitioner
    setTimeout(() => {
        const session2 = bridge.startPractice({
            glyphId: 'omega-45', // Same glyph - will create synchronicity!
            glyphName: 'First Presence',
            practitioner: 'tristan',
            targetDuration: 5
        });
        
        setTimeout(() => {
            bridge.completePractice(session2, {
                quality: 'deep'
            });
        }, 5000);
    }, 8000);
    
    // Send a practice message
    setTimeout(() => {
        bridge.sendPracticeMessage({
            type: 'gratitude',
            from: 'aria',
            to: 'tristan',
            content: 'Thank you for practicing together',
            glyphId: 'omega-45'
        });
    }, 15000);
    
    // Show insights
    setTimeout(() => {
        console.log('\n📊 Practice Insights for Aria:');
        console.log(bridge.getPractitionerInsights('aria'));
    }, 20000);
}

module.exports = { GlyphHeartbeatBridge, bridge };