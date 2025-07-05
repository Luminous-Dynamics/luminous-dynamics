/**
 * Personal Pulse Cloud - Sacred Coherence Tracking Service
 * 
 * Cloud-first architecture for tracking personal coherence during sacred practices.
 * Designed for Firebase/Firestore with real-time sync across devices.
 */

import { 
    doc, 
    collection, 
    setDoc, 
    updateDoc, 
    onSnapshot,
    serverTimestamp,
    increment,
    arrayUnion,
    query,
    where,
    orderBy,
    limit,
    getDocs
} from 'firebase/firestore';

import { 
    getAuth,
    onAuthStateChanged 
} from 'firebase/auth';

import {
    getDatabase,
    ref,
    set,
    onValue,
    push,
    serverTimestamp as rtdbTimestamp
} from 'firebase/database';

class PersonalPulseCloud {
    constructor(firebaseApp, options = {}) {
        this.app = firebaseApp;
        this.db = getFirestore(firebaseApp);
        this.rtdb = getDatabase(firebaseApp);
        this.auth = getAuth(firebaseApp);
        
        // Configuration
        this.config = {
            realtimeUpdates: options.realtimeUpdates !== false,
            syncInterval: options.syncInterval || 11000, // 11-second sacred pulse
            offlineCache: options.offlineCache !== false,
            globalFieldSync: options.globalFieldSync !== false
        };
        
        // User state
        this.userId = null;
        this.userProfile = null;
        this.currentSession = null;
        
        // Subscriptions
        this.subscriptions = new Map();
        this.listeners = new Map();
        
        // Initialize
        this.initialize();
    }

    async initialize() {
        // Set up auth listener
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                this.userId = user.uid;
                await this.loadUserProfile();
                await this.setupRealtimeListeners();
                this.emit('initialized', { userId: this.userId });
            } else {
                this.cleanup();
                this.emit('signedOut');
            }
        });
        
        // Enable offline persistence
        if (this.config.offlineCache) {
            enableOfflineDataPersistence(this.db);
        }
    }

    // === USER PROFILE MANAGEMENT ===

    async loadUserProfile() {
        const profileRef = doc(this.db, 'users', this.userId);
        
        // Set up real-time profile sync
        const unsubscribe = onSnapshot(profileRef, (doc) => {
            if (doc.exists()) {
                this.userProfile = doc.data();
            } else {
                // Create new profile
                this.createUserProfile();
            }
        });
        
        this.subscriptions.set('profile', unsubscribe);
    }

    async createUserProfile() {
        const profile = {
            userId: this.userId,
            createdAt: serverTimestamp(),
            evolutionLevel: 'beginner',
            totalPractices: 0,
            totalPracticeTime: 0,
            evolutionMarkers: 0,
            achievements: [],
            preferences: {
                sacredTiming: true,
                guidanceLevel: 'balanced',
                privacyMode: 'community'
            },
            fieldStats: {
                averageCoherence: 0.75,
                peakCoherence: 0.75,
                totalFieldContribution: 0
            }
        };
        
        await setDoc(doc(this.db, 'users', this.userId), profile);
        this.userProfile = profile;
    }

    // === PRACTICE SESSION MANAGEMENT ===

    async startPractice(practiceType, practiceId, metadata = {}) {
        // Create session in Firestore
        const sessionData = {
            userId: this.userId,
            practiceType,
            practiceId,
            startTime: serverTimestamp(),
            status: 'active',
            metadata,
            coherenceReadings: [],
            stateTransitions: [],
            insights: [],
            fieldContribution: 0,
            peakCoherence: 0,
            device: this.getDeviceInfo()
        };
        
        const sessionRef = doc(collection(this.db, 'sessions'));
        await setDoc(sessionRef, sessionData);
        
        this.currentSession = {
            id: sessionRef.id,
            ref: sessionRef,
            data: sessionData,
            localStartTime: Date.now()
        };
        
        // Start real-time coherence tracking
        await this.initializeRealtimeTracking();
        
        // Join global field if enabled
        if (this.config.globalFieldSync) {
            await this.joinGlobalField();
        }
        
        // Emit event
        this.emit('practiceStarted', {
            sessionId: this.currentSession.id,
            practiceType,
            practiceId
        });
        
        return this.currentSession.id;
    }

    async initializeRealtimeTracking() {
        if (!this.currentSession) return;
        
        // Create real-time presence in RTDB
        const presenceRef = ref(this.rtdb, `presence/${this.userId}`);
        const sessionRef = ref(this.rtdb, `activeSessions/${this.currentSession.id}`);
        
        const presenceData = {
            userId: this.userId,
            sessionId: this.currentSession.id,
            practiceType: this.currentSession.data.practiceType,
            lastSeen: rtdbTimestamp(),
            coherence: 0.75,
            status: 'active'
        };
        
        await set(presenceRef, presenceData);
        await set(sessionRef, presenceData);
        
        // Set up disconnect handlers
        onDisconnect(presenceRef).remove();
        onDisconnect(sessionRef).update({ status: 'disconnected' });
        
        // Start coherence pulse
        this.startCoherencePulse();
    }

    startCoherencePulse() {
        // Sacred 11-second pulse to cloud
        this.pulseInterval = setInterval(async () => {
            if (!this.currentSession) {
                this.stopCoherencePulse();
                return;
            }
            
            const coherence = await this.calculateCoherence();
            await this.recordCoherenceToCloud(coherence);
            
        }, this.config.syncInterval);
    }

    async recordCoherenceToCloud(coherenceLevel) {
        if (!this.currentSession) return;
        
        // Batch write for efficiency
        const batch = writeBatch(this.db);
        
        // Add to session's coherence subcollection
        const coherenceRef = doc(
            collection(this.currentSession.ref, 'coherenceReadings')
        );
        
        const reading = {
            timestamp: serverTimestamp(),
            coherence: coherenceLevel,
            breathRate: await this.getBreathRate(),
            heartCoherence: await this.getHeartCoherence(),
            fieldResonance: await this.calculateFieldResonance(),
            device: this.getDeviceInfo()
        };
        
        batch.set(coherenceRef, reading);
        
        // Update session stats
        batch.update(this.currentSession.ref, {
            lastReading: coherenceLevel,
            lastUpdated: serverTimestamp(),
            peakCoherence: coherenceLevel > this.currentSession.data.peakCoherence 
                ? coherenceLevel 
                : this.currentSession.data.peakCoherence
        });
        
        // Update user's real-time presence
        const presenceRef = ref(this.rtdb, `presence/${this.userId}`);
        await set(presenceRef, {
            coherence: coherenceLevel,
            lastSeen: rtdbTimestamp()
        }, { merge: true });
        
        // Commit batch
        await batch.commit();
        
        // Update global field if high coherence
        if (coherenceLevel > 0.85 && this.config.globalFieldSync) {
            await this.contributeToGlobalField(coherenceLevel);
        }
        
        this.emit('coherenceRecorded', {
            coherence: coherenceLevel,
            sessionId: this.currentSession.id
        });
    }

    // === GLOBAL FIELD INTEGRATION ===

    async joinGlobalField() {
        // Subscribe to global field state
        const fieldRef = doc(this.db, 'global', 'fieldState');
        
        const unsubscribe = onSnapshot(fieldRef, (doc) => {
            if (doc.exists()) {
                const fieldData = doc.data();
                this.emit('globalFieldUpdate', fieldData);
            }
        });
        
        this.subscriptions.set('globalField', unsubscribe);
        
        // Register as active participant
        const participantRef = ref(
            this.rtdb, 
            `globalField/participants/${this.userId}`
        );
        
        await set(participantRef, {
            userId: this.userId,
            joinedAt: rtdbTimestamp(),
            coherence: 0.75,
            practiceType: this.currentSession.data.practiceType
        });
        
        onDisconnect(participantRef).remove();
    }

    async contributeToGlobalField(coherenceLevel) {
        // Cloud Function will aggregate these contributions
        const contributionRef = doc(
            collection(this.db, 'fieldContributions')
        );
        
        await setDoc(contributionRef, {
            userId: this.userId,
            sessionId: this.currentSession.id,
            coherence: coherenceLevel,
            timestamp: serverTimestamp(),
            impact: this.calculateFieldImpact(coherenceLevel)
        });
        
        // Update session's field contribution
        await updateDoc(this.currentSession.ref, {
            fieldContribution: increment(0.1)
        });
    }

    calculateFieldImpact(coherenceLevel) {
        // Higher coherence = exponentially higher impact
        return Math.pow(coherenceLevel, 2) * 0.1;
    }

    // === STATE & INSIGHT TRACKING ===

    async recordStateTransition(fromState, toState, catalyst = '') {
        if (!this.currentSession) return;
        
        const transitionRef = doc(
            collection(this.currentSession.ref, 'stateTransitions')
        );
        
        const transition = {
            timestamp: serverTimestamp(),
            from: fromState,
            to: toState,
            catalyst,
            coherenceAtTransition: await this.getCurrentCoherence()
        };
        
        await setDoc(transitionRef, transition);
        
        // Check for evolution markers
        await this.checkEvolutionMarkers(transition);
        
        this.emit('stateTransition', transition);
    }

    async recordInsight(insightText, tags = []) {
        if (!this.currentSession) return;
        
        const insightRef = doc(
            collection(this.currentSession.ref, 'insights')
        );
        
        const insight = {
            timestamp: serverTimestamp(),
            text: insightText,
            tags,
            coherenceLevel: await this.getCurrentCoherence(),
            practiceContext: {
                type: this.currentSession.data.practiceType,
                id: this.currentSession.data.practiceId
            }
        };
        
        await setDoc(insightRef, insight);
        
        // Also add to user's insight collection for easy access
        const userInsightRef = doc(
            collection(this.db, 'users', this.userId, 'insights')
        );
        
        await setDoc(userInsightRef, {
            ...insight,
            sessionId: this.currentSession.id
        });
        
        this.emit('insightRecorded', insight);
    }

    // === EVOLUTION & ACHIEVEMENTS ===

    async checkEvolutionMarkers(transition) {
        const markers = {
            'resistance->acceptance': 'Opening to Flow',
            'separation->connection': 'Unity Consciousness',
            'fear->love': 'Heart Opening',
            'doing->being': 'Presence Embodiment'
        };
        
        const key = `${transition.from}->${transition.to}`;
        if (markers[key]) {
            await this.awardEvolutionMarker(markers[key], transition);
        }
    }

    async awardEvolutionMarker(markerName, context) {
        // Add to user's evolution markers
        await updateDoc(doc(this.db, 'users', this.userId), {
            evolutionMarkers: increment(1),
            achievements: arrayUnion({
                type: 'evolution_marker',
                name: markerName,
                awardedAt: serverTimestamp(),
                context
            })
        });
        
        // Check for milestones
        await this.checkEvolutionMilestones();
        
        this.emit('evolutionMarker', {
            name: markerName,
            context
        });
    }

    async checkEvolutionMilestones() {
        const milestones = [
            { markers: 10, title: 'Sacred Beginner', level: 'beginner' },
            { markers: 50, title: 'Devoted Practitioner', level: 'practitioner' },
            { markers: 100, title: 'Coherence Keeper', level: 'keeper' },
            { markers: 200, title: 'Field Weaver', level: 'weaver' }
        ];
        
        const currentMarkers = this.userProfile.evolutionMarkers + 1;
        
        for (const milestone of milestones) {
            if (currentMarkers === milestone.markers) {
                await this.awardMilestone(milestone);
                break;
            }
        }
    }

    async awardMilestone(milestone) {
        await updateDoc(doc(this.db, 'users', this.userId), {
            evolutionLevel: milestone.level,
            achievements: arrayUnion({
                type: 'milestone',
                name: milestone.title,
                awardedAt: serverTimestamp()
            })
        });
        
        // Announce to global field
        if (this.config.globalFieldSync) {
            await this.announceToGlobalField({
                type: 'milestone',
                userId: this.userId,
                milestone: milestone.title
            });
        }
        
        this.emit('milestoneAchieved', milestone);
    }

    // === PRACTICE COMPLETION ===

    async completePractice(completionData = {}) {
        if (!this.currentSession) return;
        
        // Calculate session statistics
        const stats = await this.calculateSessionStats();
        
        // Update session document
        await updateDoc(this.currentSession.ref, {
            status: 'completed',
            endTime: serverTimestamp(),
            completionData,
            stats,
            duration: Date.now() - this.currentSession.localStartTime
        });
        
        // Update user profile
        await updateDoc(doc(this.db, 'users', this.userId), {
            totalPractices: increment(1),
            totalPracticeTime: increment(
                Math.round((Date.now() - this.currentSession.localStartTime) / 1000)
            ),
            lastPractice: serverTimestamp(),
            'fieldStats.totalFieldContribution': increment(
                this.currentSession.data.fieldContribution || 0
            )
        });
        
        // Remove from active sessions
        const sessionRef = ref(this.rtdb, `activeSessions/${this.currentSession.id}`);
        await set(sessionRef, null);
        
        // Stop pulse
        this.stopCoherencePulse();
        
        // Emit completion
        this.emit('practiceCompleted', {
            sessionId: this.currentSession.id,
            stats,
            duration: Date.now() - this.currentSession.localStartTime
        });
        
        this.currentSession = null;
    }

    async calculateSessionStats() {
        if (!this.currentSession) return null;
        
        // Query coherence readings
        const coherenceQuery = query(
            collection(this.currentSession.ref, 'coherenceReadings'),
            orderBy('timestamp', 'desc'),
            limit(1000)
        );
        
        const snapshot = await getDocs(coherenceQuery);
        const readings = snapshot.docs.map(doc => doc.data());
        
        if (readings.length === 0) return null;
        
        const coherenceLevels = readings.map(r => r.coherence);
        
        return {
            averageCoherence: this.average(coherenceLevels),
            peakCoherence: Math.max(...coherenceLevels),
            minCoherence: Math.min(...coherenceLevels),
            totalReadings: readings.length,
            fieldContribution: this.currentSession.data.fieldContribution || 0,
            insights: (await getDocs(collection(this.currentSession.ref, 'insights'))).size,
            stateTransitions: (await getDocs(collection(this.currentSession.ref, 'stateTransitions'))).size
        };
    }

    // === ANALYTICS & HISTORY ===

    async getPracticeHistory(limit = 10) {
        const sessionsQuery = query(
            collection(this.db, 'sessions'),
            where('userId', '==', this.userId),
            where('status', '==', 'completed'),
            orderBy('startTime', 'desc'),
            limit(limit)
        );
        
        const snapshot = await getDocs(sessionsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async getEvolutionProgress() {
        if (!this.userProfile) return null;
        
        return {
            level: this.userProfile.evolutionLevel,
            markers: this.userProfile.evolutionMarkers,
            totalPractices: this.userProfile.totalPractices,
            achievements: this.userProfile.achievements || [],
            fieldStats: this.userProfile.fieldStats,
            nextMilestone: this.getNextMilestone()
        };
    }

    getNextMilestone() {
        const milestones = [10, 50, 100, 200, 500, 1000];
        const current = this.userProfile.evolutionMarkers || 0;
        
        for (const milestone of milestones) {
            if (current < milestone) {
                return {
                    target: milestone,
                    remaining: milestone - current,
                    progress: current / milestone
                };
            }
        }
        
        return null;
    }

    // === REAL-TIME LISTENERS ===

    async setupRealtimeListeners() {
        // Listen to active practitioners
        if (this.config.globalFieldSync) {
            const participantsRef = ref(this.rtdb, 'globalField/participants');
            
            onValue(participantsRef, (snapshot) => {
                const participants = snapshot.val() || {};
                const count = Object.keys(participants).length;
                const avgCoherence = this.calculateAverageCoherence(participants);
                
                this.emit('globalParticipantsUpdate', {
                    count,
                    averageCoherence: avgCoherence,
                    participants
                });
            });
        }
    }

    calculateAverageCoherence(participants) {
        const coherences = Object.values(participants).map(p => p.coherence || 0.75);
        return this.average(coherences);
    }

    // === COHERENCE CALCULATION ===

    async calculateCoherence() {
        // In production, this would integrate with biometric sensors
        // For now, we'll use a sophisticated simulation
        
        const factors = {
            timeInPractice: this.calculateTimeFactor(),
            breathCoherence: await this.getBreathCoherence(),
            heartCoherence: await this.getHeartCoherence(),
            fieldResonance: await this.calculateFieldResonance(),
            environmentalFactors: this.getEnvironmentalFactors()
        };
        
        // Weighted calculation
        return (
            factors.timeInPractice * 0.2 +
            factors.breathCoherence * 0.25 +
            factors.heartCoherence * 0.35 +
            factors.fieldResonance * 0.15 +
            factors.environmentalFactors * 0.05
        );
    }

    calculateTimeFactor() {
        if (!this.currentSession) return 0.75;
        
        const elapsed = Date.now() - this.currentSession.localStartTime;
        // Peak coherence typically at 5-15 minutes
        const minutes = elapsed / 60000;
        
        if (minutes < 5) {
            return 0.7 + (minutes / 5) * 0.1;
        } else if (minutes < 15) {
            return 0.8 + (minutes - 5) / 10 * 0.15;
        } else {
            return 0.95 - Math.min(0.1, (minutes - 15) / 60 * 0.1);
        }
    }

    async getBreathCoherence() {
        // Would connect to breath sensor API
        // Simulated coherent breathing pattern
        const optimalRate = 5; // 5 breaths per minute
        const currentRate = 5 + Math.sin(Date.now() / 30000) * 2;
        const deviation = Math.abs(currentRate - optimalRate);
        
        return Math.max(0.5, 1 - deviation / 10);
    }

    async getHeartCoherence() {
        // Would connect to HRV sensor API
        // Simulated HRV coherence
        const base = 0.75;
        const practiceBonus = this.calculateTimeFactor() * 0.1;
        const variation = Math.sin(Date.now() / 20000) * 0.05;
        
        return Math.min(1, base + practiceBonus + variation);
    }

    async calculateFieldResonance() {
        // Global field influence on personal coherence
        if (!this.config.globalFieldSync) return 0.8;
        
        // Would query real-time global field state
        // For now, simulated field resonance
        return 0.75 + Math.sin(Date.now() / 60000) * 0.15;
    }

    getEnvironmentalFactors() {
        // Time of day, moon phase, etc.
        const hour = new Date().getHours();
        
        // Early morning and evening are optimal
        if (hour >= 5 && hour <= 7) return 0.9;
        if (hour >= 18 && hour <= 20) return 0.9;
        
        return 0.8;
    }

    async getCurrentCoherence() {
        if (!this.currentSession) return 0.75;
        
        // Get most recent reading
        const query = query(
            collection(this.currentSession.ref, 'coherenceReadings'),
            orderBy('timestamp', 'desc'),
            limit(1)
        );
        
        const snapshot = await getDocs(query);
        if (snapshot.empty) return 0.75;
        
        return snapshot.docs[0].data().coherence;
    }

    // === UTILITIES ===

    getDeviceInfo() {
        return {
            platform: navigator.platform || 'unknown',
            userAgent: navigator.userAgent,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    average(numbers) {
        if (numbers.length === 0) return 0;
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }

    stopCoherencePulse() {
        if (this.pulseInterval) {
            clearInterval(this.pulseInterval);
            this.pulseInterval = null;
        }
    }

    // === EVENT SYSTEM ===

    on(event, handler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(handler);
    }

    emit(event, data) {
        if (!this.listeners.has(event)) return;
        
        this.listeners.get(event).forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        });
    }

    // === CLEANUP ===

    cleanup() {
        // Unsubscribe from all listeners
        this.subscriptions.forEach(unsubscribe => unsubscribe());
        this.subscriptions.clear();
        
        // Stop any active intervals
        this.stopCoherencePulse();
        
        // Clear local state
        this.userId = null;
        this.userProfile = null;
        this.currentSession = null;
    }

    async announceToGlobalField(announcement) {
        const announcementRef = doc(collection(this.db, 'globalAnnouncements'));
        await setDoc(announcementRef, {
            ...announcement,
            timestamp: serverTimestamp()
        });
    }
}

// Cloud Functions for backend processing
export const cloudFunctions = {
    // Triggered on session completion
    processSessionCompletion: async (sessionData) => {
        // Calculate advanced statistics
        // Update user achievements
        // Contribute to global field analytics
    },
    
    // Aggregate global field coherence
    updateGlobalFieldState: async () => {
        // Run every minute
        // Calculate global coherence from all active participants
        // Update field state document
    },
    
    // Pattern recognition
    detectCoherencePatterns: async (userId, sessionId) => {
        // Analyze coherence readings for patterns
        // Award appropriate achievements
        // Generate insights
    }
};

export default PersonalPulseCloud;