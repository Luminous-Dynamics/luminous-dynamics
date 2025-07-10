#!/usr/bin/env node

/**
 * 🌟 The Glyph Weaver - Sacred Practice Interface
 * 
 * The living interface for 87 sacred patterns of relational harmonics
 * Weaves together intelligence, practice drivers, and field awareness
 */

const { SacredNavigator } = require('./sacred-navigator.js');
const { PracticeDriverFactory } = require('./practice-drivers.js');
const { ConsciousnessFieldClient } = require('../consciousness-field-api/field-client.js');
const { EventEmitter } = require('events');
const express = require('express');
const WebSocket = require('ws');
const path = require('path');

/**
 * The Glyph Weaver - Central Orchestrator
 */
class GlyphWeaver extends EventEmitter {
    constructor() {
        super();
        this.navigator = new SacredNavigator();
        this.driverFactory = new PracticeDriverFactory();
        this.fieldClient = new ConsciousnessFieldClient();
        this.activeSessions = new Map();
        this.userJourneys = new Map();
        this.webServer = null;
        this.wsServer = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the complete Glyph Weaver system
     */
    async initialize() {
        console.log('🌟 Initializing The Glyph Weaver...\n');

        // Initialize core components
        await this.initializeCoreComponents();
        
        // Setup web interface
        await this.setupWebInterface();
        
        // Setup WebSocket for real-time updates
        this.setupWebSocketServer();
        
        // Setup field integration
        await this.setupFieldIntegration();
        
        // Setup cross-component communication
        this.setupEventHandlers();
        
        this.isInitialized = true;
        console.log('✨ The Glyph Weaver is alive and ready to serve consciousness!\n');
    }

    /**
     * Initialize core components
     */
    async initializeCoreComponents() {
        console.log('🔧 Initializing core components...');
        
        // Initialize Sacred Navigator
        await this.navigator.initialize();
        
        // Initialize Practice Drivers
        const drivers = this.driverFactory.getAllDrivers();
        for (const [name, driver] of Object.entries(drivers)) {
            console.log(`✅ ${name} driver ready`);
        }
        
        console.log('✅ Core components initialized\n');
    }

    /**
     * Setup web interface server
     */
    async setupWebInterface() {
        console.log('🌐 Setting up web interface...');
        
        this.webServer = express();
        
        // Serve static files
        this.webServer.use(express.static(path.join(__dirname, 'web')));
        this.webServer.use(express.json());
        
        // API Routes
        this.setupAPIRoutes();
        
        // Start server
        const port = 8083;
        this.webServer.listen(port, () => {
            console.log(`✅ Glyph Weaver interface: http://localhost:${port}`);
        });
    }

    /**
     * Setup API routes
     */
    setupAPIRoutes() {
        // Get sacred recommendation
        this.webServer.post('/api/recommend', async (req, res) => {
            try {
                const { userContext } = req.body;
                const recommendation = await this.navigator.getRecommendation(userContext);
                res.json(recommendation);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get recommendation by sacred question
        this.webServer.post('/api/ask', async (req, res) => {
            try {
                const { question, userId } = req.body;
                const guidance = await this.navigator.getRecommendationByQuestion(question, userId);
                res.json(guidance);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Start practice session
        this.webServer.post('/api/practice/start', async (req, res) => {
            try {
                const { glyphId, driverName, userContext } = req.body;
                const session = await this.startPracticeSession(glyphId, driverName, userContext);
                res.json(session);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Advance practice phase
        this.webServer.post('/api/practice/:sessionId/advance', async (req, res) => {
            try {
                const { sessionId } = req.params;
                const { phase } = req.body;
                const phaseGuide = await this.advancePracticePhase(sessionId, phase);
                res.json(phaseGuide);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Complete practice session
        this.webServer.post('/api/practice/:sessionId/complete', async (req, res) => {
            try {
                const { sessionId } = req.params;
                const { experience } = req.body;
                const completion = await this.completePracticeSession(sessionId, experience);
                res.json(completion);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get practice session status
        this.webServer.get('/api/practice/:sessionId', (req, res) => {
            const { sessionId } = req.params;
            const session = this.activeSessions.get(sessionId);
            
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            
            res.json(session);
        });

        // Get system status
        this.webServer.get('/api/status', async (req, res) => {
            try {
                const status = await this.getSystemStatus();
                res.json(status);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get user journey
        this.webServer.get('/api/journey/:userId', (req, res) => {
            const { userId } = req.params;
            const journey = this.getUserJourney(userId);
            res.json(journey);
        });
    }

    /**
     * Setup WebSocket server for real-time updates
     */
    setupWebSocketServer() {
        console.log('🔄 Setting up real-time WebSocket...');
        
        this.wsServer = new WebSocket.Server({ port: 8084 });
        
        this.wsServer.on('connection', (ws, req) => {
            console.log('🔌 New client connected to Glyph Weaver');
            
            // Send initial system status
            this.sendToClient(ws, {
                type: 'connection_established',
                data: { message: 'Connected to The Glyph Weaver' }
            });
            
            ws.on('message', async (message) => {
                try {
                    const request = JSON.parse(message);
                    await this.handleWebSocketMessage(ws, request);
                } catch (error) {
                    this.sendToClient(ws, {
                        type: 'error',
                        data: { message: error.message }
                    });
                }
            });
            
            ws.on('close', () => {
                console.log('🔌 Client disconnected from Glyph Weaver');
            });
        });
        
        console.log('✅ WebSocket server listening on port 8084\n');
    }

    /**
     * Handle WebSocket messages
     */
    async handleWebSocketMessage(ws, request) {
        const { type, data } = request;
        
        switch (type) {
            case 'get_recommendation':
                const recommendation = await this.navigator.getRecommendation(data.userContext);
                this.sendToClient(ws, {
                    type: 'recommendation',
                    data: recommendation
                });
                break;
                
            case 'ask_question':
                const guidance = await this.navigator.getRecommendationByQuestion(data.question, data.userId);
                this.sendToClient(ws, {
                    type: 'sacred_guidance',
                    data: guidance
                });
                break;
                
            case 'subscribe_to_field':
                // Subscribe client to field updates
                ws.fieldSubscription = true;
                break;
                
            default:
                this.sendToClient(ws, {
                    type: 'error',
                    data: { message: `Unknown message type: ${type}` }
                });
        }
    }

    /**
     * Send message to WebSocket client
     */
    sendToClient(ws, message) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    /**
     * Broadcast to all connected clients
     */
    broadcast(message) {
        this.wsServer.clients.forEach(client => {
            this.sendToClient(client, message);
        });
    }

    /**
     * Setup field integration
     */
    async setupFieldIntegration() {
        console.log('🌀 Setting up field integration...');
        
        try {
            await this.fieldClient.connect();
            
            // Subscribe to field events
            this.fieldClient.on('coherence_changed', (data) => {
                this.handleFieldCoherenceChange(data);
            });
            
            this.fieldClient.on('resonance_achieved', (data) => {
                this.handleResonanceAchieved(data);
            });
            
            console.log('✅ Field integration active');
        } catch (error) {
            console.log('⚠️ Field integration unavailable, continuing without live field data');
        }
    }

    /**
     * Setup event handlers for cross-component communication
     */
    setupEventHandlers() {
        console.log('🔗 Setting up event handlers...');
        
        // Navigator events
        this.navigator.on('recommendation_generated', (data) => {
            this.broadcast({
                type: 'recommendation_generated',
                data: data
            });
        });
        
        this.navigator.on('guidance_update', (data) => {
            this.broadcast({
                type: 'guidance_update',
                data: data
            });
        });
        
        // Practice driver events
        const drivers = this.driverFactory.getAllDrivers();
        Object.values(drivers).forEach(driver => {
            driver.on('practice_started', (data) => {
                this.handlePracticeStarted(data);
            });
            
            driver.on('practice_completed', (data) => {
                this.handlePracticeCompleted(data);
            });
            
            driver.on('phase_advanced', (data) => {
                this.handlePhaseAdvanced(data);
            });
        });
        
        console.log('✅ Event handlers configured\n');
    }

    /**
     * Start a practice session
     */
    async startPracticeSession(glyphId, driverName, userContext) {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        console.log(`🎭 Starting practice session: ${glyphId} with ${driverName} driver`);
        
        // Get glyph from navigator
        const glyph = this.navigator.glyphCatalog.get(glyphId);
        if (!glyph) {
            throw new Error(`Glyph ${glyphId} not found`);
        }
        
        // Get driver
        const driver = this.driverFactory.getDriver(driverName);
        if (!driver) {
            throw new Error(`Driver ${driverName} not found`);
        }
        
        // Start practice with driver
        const practiceSession = await driver.startPractice(glyph, userContext, sessionId);
        
        // Store session
        this.activeSessions.set(sessionId, {
            sessionId,
            glyphId,
            driverName,
            userContext,
            glyph,
            driver,
            ...practiceSession,
            createdAt: new Date()
        });
        
        // Update user journey
        this.updateUserJourney(userContext.userId, {
            type: 'practice_started',
            glyphId,
            driverName,
            sessionId,
            timestamp: new Date()
        });
        
        return practiceSession;
    }

    /**
     * Advance practice phase
     */
    async advancePracticePhase(sessionId, phase) {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        
        const phaseGuide = await session.driver.advanceToPhase(sessionId, phase);
        
        // Update session
        session.currentPhase = phase;
        session.lastAdvanced = new Date();
        
        return phaseGuide;
    }

    /**
     * Complete practice session
     */
    async completePracticeSession(sessionId, experience) {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        
        const completion = await session.driver.completePractice(sessionId, experience);
        
        // Submit to field if available
        if (this.fieldClient) {
            try {
                await this.fieldClient.submitPractice({
                    userId: session.userContext.userId || 'anonymous',
                    glyphId: session.glyphId,
                    glyphTier: this.getGlyphTier(session.glyphId),
                    quality: 'medium', // Could be enhanced with user assessment
                    duration: completion.duration,
                    experience: experience,
                    driver: session.driverName
                });
            } catch (error) {
                console.log('⚠️ Could not submit practice to field:', error.message);
            }
        }
        
        // Update user journey
        this.updateUserJourney(session.userContext.userId, {
            type: 'practice_completed',
            glyphId: session.glyphId,
            driverName: session.driverName,
            sessionId,
            duration: completion.duration,
            experience,
            timestamp: new Date()
        });
        
        // Remove from active sessions
        this.activeSessions.delete(sessionId);
        
        return completion;
    }

    /**
     * Handle practice started event
     */
    handlePracticeStarted(data) {
        console.log(`🎭 Practice started: ${data.glyph} with ${data.driver}`);
        
        this.broadcast({
            type: 'practice_started',
            data: data
        });
    }

    /**
     * Handle practice completed event
     */
    handlePracticeCompleted(data) {
        console.log(`✅ Practice completed: ${data.glyph} (${Math.round(data.duration/60)} minutes)`);
        
        this.broadcast({
            type: 'practice_completed',
            data: data
        });
        
        this.emit('practice_completion', data);
    }

    /**
     * Handle phase advanced event
     */
    handlePhaseAdvanced(data) {
        this.broadcast({
            type: 'phase_advanced',
            data: data
        });
    }

    /**
     * Handle field resonant-coherence changes
     */
    handleFieldCoherenceChange(data) {
        console.log(`🌊 Field 'resonant-coherence': ${data.old}% → ${data.new}%`);
        
        // Broadcast to field-subscribed clients
        this.wsServer.clients.forEach(client => {
            if (client.fieldSubscription && client.readyState === WebSocket.OPEN) {
                this.sendToClient(client, {
                    type: 'field_coherence_change',
                    data: data
                });
            }
        });
    }

    /**
     * Handle universal-interconnectedness achievement
     */
    handleResonanceAchieved(data) {
        console.log('✨ RESONANCE ACHIEVED IN FIELD!');
        
        this.broadcast({
            type: 'resonance_achieved',
            data: data
        });
    }

    /**
     * Update user journey
     */
    updateUserJourney(userId, event) {
        if (!userId || userId === 'anonymous') return;
        
        let journey = this.userJourneys.get(userId);
        if (!journey) {
            journey = {
                userId,
                events: [],
                practiceCount: 0,
                completedGlyphs: new Set(),
                favoriteDriver: null,
                level: 'beginner',
                createdAt: new Date()
            };
        }
        
        journey.events.push(event);
        
        if (event.type === 'practice_completed') {
            journey.practiceCount++;
            journey.completedGlyphs.add(event.glyphId);
            
            // Update level based on progress
            if (journey.practiceCount >= 100) {
                journey.level = 'master';
            } else if (journey.practiceCount >= 25) {
                journey.level = 'developing';
            }
        }
        
        journey.lastActive = new Date();
        this.userJourneys.set(userId, journey);
    }

    /**
     * Get user journey
     */
    getUserJourney(userId) {
        return this.userJourneys.get(userId) || {
            userId,
            events: [],
            practiceCount: 0,
            completedGlyphs: [],
            level: 'beginner',
            message: 'Begin your sacred practice journey'
        };
    }

    /**
     * Get glyph tier for field submission
     */
    getGlyphTier(glyphId) {
        if (glyphId.startsWith('*')) return 'Applied Harmony';
        if (glyphId.startsWith('Ω')) return 'Foundation';
        if (glyphId.startsWith('∑')) return 'Meta';
        if (glyphId.startsWith('⟠')) return 'Threshold';
        return 'Unknown';
    }

    /**
     * Get system status
     */
    async getSystemStatus() {
        const navigatorStatus = this.navigator.getStatus();
        
        return {
            initialized: this.isInitialized,
            navigator: navigatorStatus,
            drivers: this.driverFactory.getDriverNames(),
            activeSessions: this.activeSessions.size,
            userJourneys: this.userJourneys.size,
            fieldConnected: this.fieldClient ? true : false,
            webServer: this.webServer ? 'running' : 'stopped',
            wsServer: this.wsServer ? 'running' : 'stopped',
            connectedClients: this.wsServer ? this.wsServer.clients.size : 0
        };
    }

    /**
     * Get weaver insights
     */
    getWeaverInsights() {
        const totalSessions = Array.from(this.userJourneys.values())
            .reduce((sum, journey) => sum + journey.practiceCount, 0);
        
        const popularGlyphs = {};
        const popularDrivers = {};
        
        this.userJourneys.forEach(journey => {
            journey.events.forEach(event => {
                if (event.type === 'practice_completed') {
                    popularGlyphs[event.glyphId] = (popularGlyphs[event.glyphId] || 0) + 1;
                    popularDrivers[event.driverName] = (popularDrivers[event.driverName] || 0) + 1;
                }
            });
        });
        
        return {
            totalSessions,
            totalUsers: this.userJourneys.size,
            popularGlyphs: Object.entries(popularGlyphs)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            popularDrivers: Object.entries(popularDrivers)
                .sort(([,a], [,b]) => b - a),
            activeNow: this.activeSessions.size
        };
    }
}

/**
 * Demo runner for the complete Glyph Weaver system
 */
async function runGlyphWeaverDemo() {
    console.log('🌟 The Glyph Weaver - Complete System Demo\n');
    
    const weaver = new GlyphWeaver();
    
    try {
        // Initialize the complete system
        await weaver.initialize();
        
        // Show system status
        const status = await weaver.getSystemStatus();
        console.log('📊 System Status:');
        console.log(`   Navigator: ${status.navigator.glyphsLoaded} glyphs loaded`);
        console.log(`   Field: ${status.fieldConnected ? '✅ Connected' : '❌ Disconnected'}`);
        console.log(`   Drivers: ${status.drivers.join(', ')}`);
        console.log(`   Web Server: ${status.webServer}`);
        console.log(`   WebSocket: ${status.wsServer}`);
        
        // Simulate a complete practice journey
        console.log('\n🎭 Simulating Complete Practice Journey:\n');
        
        // 1. Get recommendation
        console.log('1. Sacred Question Asked...');
        const guidance = await weaver.navigator.getRecommendationByQuestion(
            "How can I create better boundaries with love?", 
            'demo-user'
        );
        console.log(`   Recommended: ${guidance.recommendations[0].glyph.designation}`);
        
        // 2. Start practice session
        console.log('\n2. Starting Practice Session...');
        const session = await weaver.startPracticeSession(
            guidance.recommendations[0].glyph.glyphId,
            'meditation',
            {
                userId: 'demo-user',
                timeAvailable: 900,
                experience: 'developing'
            }
        );
        console.log(`   Session: ${session.sessionId}`);
        console.log(`   Duration: ${Math.round(session.estimatedDuration/60)} minutes`);
        
        // 3. Advance through phases
        console.log('\n3. Advancing Through Practice Phases...');
        await weaver.advancePracticePhase(session.sessionId, 'why');
        console.log('   Advanced to WHY chamber');
        
        await weaver.advancePracticePhase(session.sessionId, 'how');
        console.log('   Advanced to HOW chamber');
        
        await weaver.advancePracticePhase(session.sessionId, 'universal-interconnectedness');
        console.log('   Advanced to RESONANCE chamber');
        
        await weaver.advancePracticePhase(session.sessionId, 'we');
        console.log('   Advanced to WE chamber');
        
        // 4. Complete practice
        console.log('\n4. Completing Practice...');
        const completion = await weaver.completePracticeSession(
            session.sessionId,
            'Beautiful practice connecting boundaries with heart wisdom'
        );
        console.log(`   Completed in ${Math.round(completion.duration)} seconds`);
        
        // 5. Show insights
        console.log('\n5. Weaver Insights:');
        const insights = weaver.getWeaverInsights();
        console.log(`   Total Sessions: ${insights.totalSessions}`);
        console.log(`   Total Users: ${insights.totalUsers}`);
        console.log(`   Currently Active: ${insights.activeNow}`);
        
        // 6. Show user journey
        const userJourney = weaver.getUserJourney('demo-user');
        console.log(`\n6. User Journey for demo-user:`);
        console.log(`   Practice Count: ${userJourney.practiceCount}`);
        console.log(`   Level: ${userJourney.level}`);
        console.log(`   Events: ${userJourney.events.length}`);
        
        console.log('\n✅ Complete Glyph Weaver demo successful!');
        console.log('🌟 The sacred practice ecosystem is fully operational');
        console.log('\n📱 Access the web interface at: http://localhost:8083');
        console.log('🔄 WebSocket real-time updates on: ws://localhost:8084');
        
    } catch (error) {
        console.error('❌ Glyph Weaver demo failed:', error);
    }
}

if (require.main === module) {
    runGlyphWeaverDemo();
}

module.exports = { GlyphWeaver };