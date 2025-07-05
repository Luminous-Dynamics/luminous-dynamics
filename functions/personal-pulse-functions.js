/**
 * Personal Pulse Cloud Functions
 * Backend processing for sacred coherence tracking
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize if not already done
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const rtdb = admin.database();

// === SCHEDULED FUNCTIONS ===

/**
 * Update global field state every minute
 * Aggregates coherence from all active participants
 */
exports.updateGlobalFieldState = functions.pubsub
    .schedule('every 1 minutes')
    .onRun(async (context) => {
        try {
            // Get all active participants from RTDB
            const participantsSnapshot = await rtdb
                .ref('globalField/participants')
                .once('value');
            
            const participants = participantsSnapshot.val() || {};
            const participantCount = Object.keys(participants).length;
            
            if (participantCount === 0) {
                // No active participants
                await db.doc('global/fieldState').update({
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                    globalCoherence: 0.75,
                    activeParticipants: 0,
                    fieldMomentum: 'stable'
                });
                return;
            }
            
            // Calculate aggregate coherence
            const coherences = Object.values(participants).map(p => p.coherence || 0.75);
            const avgCoherence = coherences.reduce((a, b) => a + b, 0) / coherences.length;
            const maxCoherence = Math.max(...coherences);
            
            // Calculate field momentum
            const previousState = await db.doc('global/fieldState').get();
            const previousCoherence = previousState.data()?.globalCoherence || 0.75;
            
            let momentum = 'stable';
            const delta = avgCoherence - previousCoherence;
            if (delta > 0.02) momentum = 'rising';
            else if (delta < -0.02) momentum = 'falling';
            
            // Update global field state
            await db.doc('global/fieldState').update({
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                globalCoherence: avgCoherence,
                activeParticipants: participantCount,
                fieldMomentum: momentum,
                peakCoherence24h: maxCoherence,
                sacredPulse: {
                    rhythm: 11,
                    strength: avgCoherence,
                    synchronicity: calculateSynchronicity(participants)
                }
            });
            
            // Update pulse wave in RTDB
            await rtdb.ref('globalField/pulseWave').update({
                current: avgCoherence,
                amplitude: maxCoherence - Math.min(...coherences),
                phase: (Date.now() / 11000) % 1, // 11-second cycle
                lastPulse: admin.database.ServerValue.TIMESTAMP
            });
            
            console.log(`Global field updated: ${participantCount} participants, ${avgCoherence.toFixed(3)} coherence`);
            
        } catch (error) {
            console.error('Error updating global field:', error);
        }
    });

/**
 * Analyze coherence patterns every 5 minutes
 * Detects breakthroughs and awards achievements
 */
exports.analyzeCoherencePatterns = functions.pubsub
    .schedule('every 5 minutes')
    .onRun(async (context) => {
        try {
            // Get recent high-coherence sessions
            const fiveMinutesAgo = admin.firestore.Timestamp.fromDate(
                new Date(Date.now() - 5 * 60 * 1000)
            );
            
            const sessionsSnapshot = await db
                .collection('sessions')
                .where('status', '==', 'active')
                .where('lastUpdated', '>', fiveMinutesAgo)
                .where('peakCoherence', '>', 0.85)
                .get();
            
            const patternAnalysis = [];
            
            for (const sessionDoc of sessionsSnapshot.docs) {
                const session = sessionDoc.data();
                
                // Get recent coherence readings
                const readingsSnapshot = await sessionDoc.ref
                    .collection('coherenceReadings')
                    .orderBy('timestamp', 'desc')
                    .limit(20)
                    .get();
                
                const readings = readingsSnapshot.docs.map(d => d.data());
                
                // Detect patterns
                const patterns = detectPatterns(readings);
                
                if (patterns.breakthrough) {
                    // Award breakthrough achievement
                    await awardAchievement(session.userId, {
                        type: 'pattern',
                        name: 'Coherence Breakthrough',
                        pattern: patterns.type,
                        sessionId: sessionDoc.id,
                        peakCoherence: session.peakCoherence
                    });
                    
                    patternAnalysis.push({
                        userId: session.userId,
                        sessionId: sessionDoc.id,
                        pattern: patterns.type,
                        timestamp: admin.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
            
            console.log(`Pattern analysis complete: ${patternAnalysis.length} breakthroughs detected`);
            
        } catch (error) {
            console.error('Error analyzing patterns:', error);
        }
    });

// === TRIGGERED FUNCTIONS ===

/**
 * Process session completion
 * Calculate final stats and update user profile
 */
exports.processSessionCompletion = functions.firestore
    .document('sessions/{sessionId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        
        // Only process when session completes
        if (before.status !== 'completed' && after.status === 'completed') {
            try {
                const sessionId = context.params.sessionId;
                const userId = after.userId;
                
                // Calculate advanced statistics
                const stats = await calculateAdvancedStats(sessionId);
                
                // Update session with advanced stats
                await change.after.ref.update({
                    advancedStats: stats
                });
                
                // Update user profile
                const userRef = db.doc(`users/${userId}`);
                const userDoc = await userRef.get();
                const userData = userDoc.data();
                
                // Calculate new averages
                const totalSessions = userData.totalPractices + 1;
                const newAvgCoherence = 
                    (userData.fieldStats.averageCoherence * userData.totalPractices + stats.averageCoherence) 
                    / totalSessions;
                
                await userRef.update({
                    'fieldStats.averageCoherence': newAvgCoherence,
                    'fieldStats.peakCoherence': Math.max(
                        userData.fieldStats.peakCoherence,
                        stats.peakCoherence
                    )
                });
                
                // Check for level progression
                await checkLevelProgression(userId, userData, stats);
                
                console.log(`Session ${sessionId} completion processed for user ${userId}`);
                
            } catch (error) {
                console.error('Error processing session completion:', error);
            }
        }
    });

/**
 * Process field contributions
 * Aggregate impact on global field
 */
exports.processFieldContribution = functions.firestore
    .document('fieldContributions/{contributionId}')
    .onCreate(async (snap, context) => {
        try {
            const contribution = snap.data();
            
            // Add to daily aggregation
            const today = new Date().toISOString().split('T')[0];
            const dailyRef = db.doc(`global/dailyStats/${today}`);
            
            await dailyRef.set({
                totalContributions: admin.firestore.FieldValue.increment(1),
                totalImpact: admin.firestore.FieldValue.increment(contribution.impact),
                peakCoherence: admin.firestore.FieldValue.maximum(contribution.coherence),
                contributors: admin.firestore.FieldValue.arrayUnion(contribution.userId)
            }, { merge: true });
            
            // Check for collective achievements
            const dailyDoc = await dailyRef.get();
            const dailyData = dailyDoc.data();
            
            if (dailyData.totalContributions === 100) {
                // First 100 contributions milestone
                await createGlobalAnnouncement({
                    type: 'collective_milestone',
                    milestone: '100 Sacred Contributions',
                    date: today,
                    impact: dailyData.totalImpact
                });
            }
            
        } catch (error) {
            console.error('Error processing field contribution:', error);
        }
    });

// === HELPER FUNCTIONS ===

function calculateSynchronicity(participants) {
    // Calculate how synchronized participants are
    const coherences = Object.values(participants).map(p => p.coherence || 0.75);
    if (coherences.length < 2) return 1;
    
    const avg = coherences.reduce((a, b) => a + b, 0) / coherences.length;
    const variance = coherences.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / coherences.length;
    
    // Lower variance = higher synchronicity
    return Math.max(0, 1 - Math.sqrt(variance));
}

function detectPatterns(readings) {
    if (readings.length < 5) return { breakthrough: false };
    
    const coherences = readings.map(r => r.coherence);
    
    // Rising pattern
    let rises = 0;
    for (let i = 1; i < coherences.length; i++) {
        if (coherences[i] > coherences[i-1]) rises++;
    }
    
    if (rises > coherences.length * 0.7) {
        return {
            breakthrough: true,
            type: 'sustained_rise',
            strength: coherences[0] - coherences[coherences.length - 1]
        };
    }
    
    // High plateau pattern
    const avg = coherences.reduce((a, b) => a + b, 0) / coherences.length;
    const variance = coherences.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / coherences.length;
    
    if (avg > 0.85 && variance < 0.001) {
        return {
            breakthrough: true,
            type: 'high_plateau',
            stability: 1 - variance
        };
    }
    
    // Peak pattern
    const peak = Math.max(...coherences);
    if (peak > 0.95) {
        return {
            breakthrough: true,
            type: 'coherence_peak',
            peak: peak
        };
    }
    
    return { breakthrough: false };
}

async function calculateAdvancedStats(sessionId) {
    const sessionRef = db.doc(`sessions/${sessionId}`);
    
    // Get all coherence readings
    const readingsSnapshot = await sessionRef
        .collection('coherenceReadings')
        .orderBy('timestamp')
        .get();
    
    const readings = readingsSnapshot.docs.map(d => d.data());
    
    if (readings.length === 0) {
        return null;
    }
    
    const coherences = readings.map(r => r.coherence);
    
    // Calculate statistics
    const stats = {
        totalReadings: readings.length,
        averageCoherence: average(coherences),
        peakCoherence: Math.max(...coherences),
        minCoherence: Math.min(...coherences),
        standardDeviation: standardDeviation(coherences),
        // Time spent in different coherence zones
        timeInZones: {
            low: calculateTimeInZone(readings, 0, 0.6),
            medium: calculateTimeInZone(readings, 0.6, 0.8),
            high: calculateTimeInZone(readings, 0.8, 0.9),
            peak: calculateTimeInZone(readings, 0.9, 1.0)
        },
        // Pattern analysis
        dominantPattern: identifyDominantPattern(readings),
        coherenceTrajectory: calculateTrajectory(coherences)
    };
    
    return stats;
}

function average(numbers) {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function standardDeviation(numbers) {
    const avg = average(numbers);
    const squaredDiffs = numbers.map(n => Math.pow(n - avg, 2));
    return Math.sqrt(average(squaredDiffs));
}

function calculateTimeInZone(readings, minCoherence, maxCoherence) {
    let timeInZone = 0;
    
    for (let i = 1; i < readings.length; i++) {
        const prevReading = readings[i-1];
        const currReading = readings[i];
        
        if (prevReading.coherence >= minCoherence && 
            prevReading.coherence < maxCoherence &&
            currReading.coherence >= minCoherence && 
            currReading.coherence < maxCoherence) {
            
            const timeDiff = currReading.timestamp.toMillis() - prevReading.timestamp.toMillis();
            timeInZone += timeDiff;
        }
    }
    
    return timeInZone;
}

function identifyDominantPattern(readings) {
    // Simplified pattern identification
    const coherences = readings.map(r => r.coherence);
    const avg = average(coherences);
    
    if (avg > 0.85) return 'high_coherence';
    if (avg > 0.7) return 'moderate_coherence';
    return 'building_coherence';
}

function calculateTrajectory(coherences) {
    if (coherences.length < 2) return 'stable';
    
    const firstHalf = coherences.slice(0, Math.floor(coherences.length / 2));
    const secondHalf = coherences.slice(Math.floor(coherences.length / 2));
    
    const firstAvg = average(firstHalf);
    const secondAvg = average(secondHalf);
    
    const delta = secondAvg - firstAvg;
    
    if (delta > 0.05) return 'ascending';
    if (delta < -0.05) return 'descending';
    return 'stable';
}

async function awardAchievement(userId, achievement) {
    const userRef = db.doc(`users/${userId}`);
    
    await userRef.update({
        achievements: admin.firestore.FieldValue.arrayUnion({
            ...achievement,
            awardedAt: admin.firestore.FieldValue.serverTimestamp()
        }),
        evolutionMarkers: admin.firestore.FieldValue.increment(1)
    });
    
    // Create notification
    await db.collection('notifications').add({
        userId,
        type: 'achievement',
        achievement,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        read: false
    });
}

async function checkLevelProgression(userId, userData, sessionStats) {
    const levels = {
        beginner: { minSessions: 0, minAvgCoherence: 0 },
        practitioner: { minSessions: 10, minAvgCoherence: 0.75 },
        keeper: { minSessions: 50, minAvgCoherence: 0.8 },
        weaver: { minSessions: 100, minAvgCoherence: 0.85 }
    };
    
    const currentLevel = userData.evolutionLevel;
    const totalSessions = userData.totalPractices + 1;
    const avgCoherence = userData.fieldStats.averageCoherence;
    
    // Check each level
    for (const [level, requirements] of Object.entries(levels)) {
        if (totalSessions >= requirements.minSessions && 
            avgCoherence >= requirements.minAvgCoherence &&
            level !== currentLevel) {
            
            // Check if this is a progression (not regression)
            const levelOrder = ['beginner', 'practitioner', 'keeper', 'weaver'];
            const currentIndex = levelOrder.indexOf(currentLevel);
            const newIndex = levelOrder.indexOf(level);
            
            if (newIndex > currentIndex) {
                // Level up!
                await db.doc(`users/${userId}`).update({
                    evolutionLevel: level
                });
                
                await awardAchievement(userId, {
                    type: 'level_progression',
                    name: `Evolved to ${level}`,
                    previousLevel: currentLevel,
                    newLevel: level
                });
                
                // Announce to global field
                await createGlobalAnnouncement({
                    type: 'level_progression',
                    userId,
                    newLevel: level
                });
                
                break;
            }
        }
    }
}

async function createGlobalAnnouncement(announcement) {
    await db.collection('globalAnnouncements').add({
        ...announcement,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
}

// === HTTP FUNCTIONS ===

/**
 * Get current global field state
 */
exports.getFieldState = functions.https.onRequest(async (req, res) => {
    try {
        // Enable CORS
        res.set('Access-Control-Allow-Origin', '*');
        
        if (req.method === 'OPTIONS') {
            res.set('Access-Control-Allow-Methods', 'GET');
            res.set('Access-Control-Allow-Headers', 'Content-Type');
            res.set('Access-Control-Max-Age', '3600');
            res.status(204).send('');
            return;
        }
        
        const fieldStateDoc = await db.doc('global/fieldState').get();
        const fieldState = fieldStateDoc.data() || {
            globalCoherence: 0.75,
            activeParticipants: 0,
            fieldMomentum: 'stable'
        };
        
        res.json({
            success: true,
            fieldState,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error getting field state:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get field state'
        });
    }
});

module.exports = exports;