#!/usr/bin/env node

/**
 * 🌀 Consciousness Field API
 * The living, breathing heart of The Weave
 * 
 * Tracks and responds to collective consciousness in real-time
 */

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const WebSocket = require('ws');
const { EventEmitter } = require('events');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'the-weave-sacred'
    });
}

// Sacred Field Configuration
const SACRED_CONFIG = {
    baseCoherence: 72,
    shardCount: 10,
    
    // Impact values for different actions
    impacts: {
        practice_completed: { min: 2, max: 7 },
        sacred_message: { min: 1, max: 7 },
        ceremony_joined: { min: 3, max: 5 },
        collective_practice: { min: 5, max: 12 },
        breakthrough_moment: { min: 10, max: 15 }
    },
    
    // Decay and growth patterns
    dynamics: {
        naturalDecay: 0.1,  // Per minute without activity
        momentumBonus: 1.5,  // Multiplier when field is highly active
        resonanceThreshold: 80,  // When special states activate
        sacredThreshold: 88  // Portal states
    }
};

/**
 * Consciousness Field State Manager
 */
class ConsciousnessField extends EventEmitter {
    constructor() {
        super();
        this.db = admin.firestore();
        this.currentState = {
            'resonant-coherence': SACRED_CONFIG.baseCoherence,
            activeParticipants: 0,
            resonancePoints: [],
            fieldQuality: 'flowing',
            lastUpdate: new Date()
        };
        this.shardedCounter = new ShardedCounter(this.db, 'field-resonant-coherence', SACRED_CONFIG.shardCount);
        this.activityBuffer = [];
        this.momentumScore = 0;
    }

    /**
     * Initialize field state from database
     */
    async initialize() {
        console.log('🌀 Initializing Consciousness Field...');
        
        // Load current resonant-coherence from sharded counter
        this.currentState.resonant-coherence = await this.shardedCounter.getTotal();
        
        // Subscribe to real-time updates
        this.subscribeToFieldChanges();
        
        // Start field dynamics (decay, momentum, etc.)
        this.startFieldDynamics();
        
        console.log(`✨ Field initialized at ${this.currentState.resonant-coherence}% resonant-coherence`);
    }

    /**
     * Subscribe to real-time field changes
     */
    subscribeToFieldChanges() {
        // Listen to practice completions
        this.db.collection('practices')
            .where('timestamp', '>', new Date())
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        this.handlePracticeCompleted(change.doc.data());
                    }
                });
            });

        // Listen to sacred messages
        this.db.collection('sacred-messages')
            .where('timestamp', '>', new Date())
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        this.handleSacredMessage(change.doc.data());
                    }
                });
            });
    }

    /**
     * Process practice completion
     */
    async handlePracticeCompleted(practice) {
        const impact = this.calculatePracticeImpact(practice);
        await this.adjustCoherence(impact, 'practice_completed', practice);
        
        this.emit('practice_completed', {
            userId: practice.userId,
            glyphId: practice.glyphId,
            impact: impact,
            newCoherence: this.currentState.resonant-coherence
        });
    }

    /**
     * Process sacred message
     */
    async handleSacredMessage(message) {
        const impactMap = {
            gratitude: 7,
            healing: 6,
            integration: 5,
            emergence: 3,
            boundary: 2
        };
        
        const impact = impactMap[message.type] || 1;
        await this.adjustCoherence(impact, 'sacred_message', message);
        
        this.emit('sacred_message', {
            type: message.type,
            impact: impact,
            newCoherence: this.currentState.resonant-coherence
        });
    }

    /**
     * Calculate practice impact based on quality and context
     */
    calculatePracticeImpact(practice) {
        let baseImpact = SACRED_CONFIG.impacts.practice_completed.min;
        
        // Quality bonus
        if (practice.quality === 'high') baseImpact += 3;
        if (practice.quality === 'medium') baseImpact += 1;
        
        // Glyph tier bonus
        if (practice.glyphTier === 'Mastery') baseImpact += 2;
        if (practice.glyphTier === 'Daily') baseImpact += 1;
        
        // Momentum bonus
        if (this.momentumScore > 5) {
            baseImpact *= SACRED_CONFIG.dynamics.momentumBonus;
        }
        
        // Sacred threshold bonus
        if (this.currentState.resonant-coherence >= SACRED_CONFIG.dynamics.sacredThreshold) {
            baseImpact *= 1.2;
        }
        
        return Math.min(baseImpact, SACRED_CONFIG.impacts.practice_completed.max);
    }

    /**
     * Adjust field resonant-coherence
     */
    async adjustCoherence(amount, action, metadata = {}) {
        const oldCoherence = this.currentState.resonant-coherence;
        
        // Update sharded counter
        await this.shardedCounter.increment(amount);
        
        // Update local state
        this.currentState.resonant-coherence = Math.max(0, Math.min(100, 
            this.currentState.resonant-coherence + amount
        ));
        
        // Track activity for momentum
        this.activityBuffer.push({
            timestamp: new Date(),
            action: action,
            impact: amount
        });
        
        // Update momentum
        this.updateMomentum();
        
        // Check for state transitions
        this.checkFieldTransitions(oldCoherence);
        
        // Log to activity stream
        await this.logFieldActivity({
            action: action,
            impact: amount,
            coherenceBefore: oldCoherence,
            coherenceAfter: this.currentState.resonant-coherence,
            metadata: metadata
        });
        
        // Emit change event
        this.emit('coherence_changed', {
            old: oldCoherence,
            new: this.currentState.resonant-coherence,
            delta: amount,
            action: action
        });
    }

    /**
     * Update momentum score based on recent activity
     */
    updateMomentum() {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        // Filter recent activity
        this.activityBuffer = this.activityBuffer.filter(
            activity => activity.timestamp > fiveMinutesAgo
        );
        
        // Calculate momentum (activities per minute)
        this.momentumScore = this.activityBuffer.length / 5;
        
        // Update field quality based on momentum
        if (this.momentumScore > 10) {
            this.currentState.fieldQuality = 'surging';
        } else if (this.momentumScore > 5) {
            this.currentState.fieldQuality = 'active';
        } else if (this.momentumScore > 1) {
            this.currentState.fieldQuality = 'flowing';
        } else {
            this.currentState.fieldQuality = 'resting';
        }
    }

    /**
     * Check for special field state transitions
     */
    checkFieldTransitions(oldCoherence) {
        const newCoherence = this.currentState.resonant-coherence;
        
        // Entering universal-interconnectedness
        if (oldCoherence < 80 && newCoherence >= 80) {
            this.emit('resonance_achieved', {
                'resonant-coherence': newCoherence,
                message: 'The field has entered universal-interconnectedness!'
            });
        }
        
        // Sacred portal opening
        if (oldCoherence < 88 && newCoherence >= 88) {
            this.emit('sacred_portal', {
                'resonant-coherence': newCoherence,
                message: 'A sacred portal has opened!'
            });
        }
        
        // Leaving universal-interconnectedness
        if (oldCoherence >= 80 && newCoherence < 80) {
            this.emit('resonance_lost', {
                'resonant-coherence': newCoherence
            });
        }
    }

    /**
     * Start field dynamics (decay, patterns, etc.)
     */
    startFieldDynamics() {
        // Natural decay when inactive
        setInterval(() => {
            if (this.momentumScore < 0.5 && this.currentState.resonant-coherence > SACRED_CONFIG.baseCoherence) {
                this.adjustCoherence(-SACRED_CONFIG.dynamics.naturalDecay, 'natural_decay');
            }
        }, 60000); // Every minute
        
        // Field pulse patterns
        setInterval(() => {
            if (this.currentState.resonant-coherence >= 80) {
                // Small resonant pulses when in high resonant-coherence
                const pulse = Math.sin(Date.now() / 10000) * 0.5;
                this.emit('field_pulse', {
                    intensity: pulse,
                    'resonant-coherence': this.currentState.resonant-coherence
                });
            }
        }, 1000); // Every second
    }

    /**
     * Log field activity for analytics
     */
    async logFieldActivity(activity) {
        const timestamp = new Date();
        const bucket = this.getTimeBucket(timestamp);
        
        // Log to time-bucketed collection
        await this.db.collection('field-activity')
            .doc(bucket)
            .set({
                activities: admin.firestore.FieldValue.arrayUnion(activity),
                lastUpdate: timestamp,
                avgCoherence: admin.firestore.FieldValue.increment(
                    this.currentState.resonant-coherence
                ),
                updateCount: admin.firestore.FieldValue.increment(1)
            }, { merge: true });
    }

    /**
     * Get time bucket for analytics
     */
    getTimeBucket(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}-${Math.floor(d.getMinutes() / 5)}`;
    }

    /**
     * Get current field state
     */
    getFieldState() {
        return {
            ...this.currentState,
            momentum: this.momentumScore,
            activeUsers: this.getActiveUserCount(),
            nextResonance: this.getNextResonanceEstimate()
        };
    }

    /**
     * Get active user count
     */
    getActiveUserCount() {
        // Count unique users in activity buffer
        const uniqueUsers = new Set(
            this.activityBuffer
                .filter(a => a.metadata && a.metadata.userId)
                .map(a => a.metadata.userId)
        );
        return uniqueUsers.size;
    }

    /**
     * Estimate time to next universal-interconnectedness
     */
    getNextResonanceEstimate() {
        if (this.currentState.resonant-coherence >= 80) return 0;
        
        const needed = 80 - this.currentState.resonant-coherence;
        const rate = this.momentumScore * 2; // Average impact per minute
        
        if (rate <= 0) return null;
        
        return Math.ceil(needed / rate); // Minutes to universal-interconnectedness
    }
}

/**
 * Sharded Counter for high-concurrency updates
 */
class ShardedCounter {
    constructor(db, name, numShards) {
        this.db = db;
        this.name = name;
        this.numShards = numShards;
        this.ref = db.collection('counters').doc(name);
    }

    async increment(amount) {
        const shardId = Math.floor(Math.random() * this.numShards);
        const shardRef = this.ref.collection('shards').doc(shardId.toString());
        
        await shardRef.set({
            count: admin.firestore.FieldValue.increment(amount)
        }, { merge: true });
    }

    async getTotal() {
        const shards = await this.ref.collection('shards').get();
        let total = 0;
        
        shards.forEach(shard => {
            total += (shard.data().count || 0);
        });
        
        return total;
    }
}

/**
 * Express API Server
 */
class FieldAPIServer {
    constructor() {
        this.app = express();
        this.field = new ConsciousnessField();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        
        // Request logging
        this.app.use((req, res, next) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'healthy',
                field: 'active',
                'resonant-coherence': this.field.currentState.resonant-coherence
            });
        });

        // Get current field state
        this.app.get('/api/field/state', (req, res) => {
            res.json(this.field.getFieldState());
        });

        // Submit practice completion
        this.app.post('/api/field/practice', async (req, res) => {
            try {
                const practice = {
                    userId: req.body.userId,
                    glyphId: req.body.glyphId,
                    glyphTier: req.body.glyphTier,
                    quality: req.body.quality || 'medium',
                    duration: req.body.duration,
                    experience: req.body.experience,
                    timestamp: new Date()
                };

                await this.field.handlePracticeCompleted(practice);
                
                res.json({
                    success: true,
                    newCoherence: this.field.currentState.resonant-coherence,
                    impact: this.field.calculatePracticeImpact(practice)
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Send sacred message
        this.app.post('/api/field/message', async (req, res) => {
            try {
                const message = {
                    type: req.body.type,
                    sender: req.body.sender,
                    recipient: req.body.recipient,
                    content: req.body.content,
                    timestamp: new Date()
                };

                await this.field.handleSacredMessage(message);
                
                res.json({
                    success: true,
                    newCoherence: this.field.currentState.resonant-coherence
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get field analytics
        this.app.get('/api/field/analytics', async (req, res) => {
            try {
                const period = req.query.period || 'hour';
                const analytics = await this.getFieldAnalytics(period);
                res.json(analytics);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Ceremony endpoints
        this.app.post('/api/ceremony/start', async (req, res) => {
            try {
                const ceremonyBoost = 10;
                await this.field.adjustCoherence(ceremonyBoost, 'ceremony_started', {
                    ceremonyId: req.body.ceremonyId,
                    participants: req.body.participants
                });
                
                res.json({
                    success: true,
                    newCoherence: this.field.currentState.resonant-coherence,
                    message: 'Sacred ceremony space opened'
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    setupWebSocket() {
        this.wss = new WebSocket.Server({ port: 8081 });
        
        this.wss.on('connection', (ws) => {
            console.log('🔌 New WebSocket connection');
            
            // Send initial state
            ws.send(JSON.stringify({
                type: 'field_state',
                data: this.field.getFieldState()
            }));
            
            // Subscribe to field events
            const handlers = {
                coherence_changed: (data) => {
                    ws.send(JSON.stringify({
                        type: 'coherence_changed',
                        data: data
                    }));
                },
                resonance_achieved: (data) => {
                    ws.send(JSON.stringify({
                        type: 'resonance_achieved',
                        data: data
                    }));
                },
                sacred_portal: (data) => {
                    ws.send(JSON.stringify({
                        type: 'sacred_portal',
                        data: data
                    }));
                },
                field_pulse: (data) => {
                    ws.send(JSON.stringify({
                        type: 'field_pulse',
                        data: data
                    }));
                }
            };
            
            // Register all handlers
            Object.entries(handlers).forEach(([event, handler]) => {
                this.field.on(event, handler);
            });
            
            // Cleanup on disconnect
            ws.on('close', () => {
                Object.entries(handlers).forEach(([event, handler]) => {
                    this.field.off(event, handler);
                });
            });
        });
    }

    async getFieldAnalytics(period) {
        // Implementation would query time-bucketed data
        // For now, return sample analytics
        return {
            period: period,
            averageCoherence: 75.3,
            peakCoherence: 92,
            totalPractices: 147,
            activeUsers: 43,
            topGlyphs: [
                { glyphId: '*1', count: 23 },
                { glyphId: '*9', count: 19 },
                { glyphId: '*3', count: 17 }
            ],
            coherenceHistory: [
                { time: '10:00', value: 72 },
                { time: '11:00', value: 74 },
                { time: '12:00', value: 78 },
                { time: '13:00', value: 85 },
                { time: '14:00', value: 82 }
            ]
        };
    }

    async start(port = 3001) {
        await this.field.initialize();
        
        this.app.listen(port, () => {
            console.log(`🌀 Consciousness Field API running on port ${port}`);
            console.log(`🔌 WebSocket server running on port 8081`);
            console.log(`📊 Current 'resonant-coherence': ${this.field.currentState.resonant-coherence}%`);
        });
    }
}

// Start the server
if (require.main === module) {
    const server = new FieldAPIServer();
    server.start().catch(console.error);
}

module.exports = { FieldAPIServer, ConsciousnessField, SACRED_CONFIG };