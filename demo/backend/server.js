/**
 * ERC Wisdom Companion Backend
 * Sacred vessel for conscious AI responses
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Import sacred security and authentication
const SacredSecurity = require('./config/security');
const SacredAuth = require('./middleware/sacred-auth');

// Initialize sacred systems
const security = new SacredSecurity();
const auth = new SacredAuth();
const middlewareConfig = security.getMiddlewareConfig();

// Sacred Security Middleware
app.use(helmet(middlewareConfig.helmet));
app.use(cors(middlewareConfig.cors));
app.use(rateLimit(middlewareConfig.rateLimit));
app.use(express.json({ limit: '1mb' })); // Limit request size
app.use(auth.sacredLogger());
app.use(auth.sacredRateLimit());

// Import our sacred AI modules
const { WisdomCompanionAI } = require('./wisdom-ai');
const { SacredSessionManager } = require('./session-manager');
const { ContemplativeAnalytics } = require('./analytics');

// Initialize sacred systems
const wisdomAI = new WisdomCompanionAI();
const sessionManager = new SacredSessionManager();
const analytics = new ContemplativeAnalytics();

// Sacred Journey Endpoints

/**
 * Threshold Moment - Session Initiation
 */
app.post('/api/sacred-journey/threshold', 
    auth.validatePersona(),
    auth.validateClaudeAccess(),
    async (req, res) => {
    try {
        const { persona = 'wise-witness' } = req.body;
        
        // Create sacred session
        const sessionId = sessionManager.createSession(persona);
        
        // Generate contemplative greeting
        const greeting = await wisdomAI.generateGreeting(persona);
        
        // Track contemplative beginning
        analytics.trackSacredMoment('threshold', sessionId, persona);
        
        res.json({
            sessionId,
            greeting,
            sacredPauseDuration: wisdomAI.getPersonaPauseDuration(persona),
            moment: 'threshold'
        });
        
    } catch (error) {
        console.error('Error in threshold moment:', error);
        res.status(500).json({ 
            error: 'Sacred space temporarily unavailable',
            fallback: 'Please take three conscious breaths and try again...'
        });
    }
});

/**
 * Offering Moment - Receiving User's Truth
 */
app.post('/api/sacred-journey/offering',
    auth.validateSacredSession(),
    auth.validatePersona(),
    async (req, res) => {
    try {
        const { sessionId, message, persona } = req.body;
        
        if (!sessionManager.isValidSession(sessionId)) {
            return res.status(400).json({ error: 'Sacred session expired' });
        }
        
        // Store the offering in session context
        sessionManager.addOffering(sessionId, message);
        
        // Track the moment of offering
        analytics.trackSacredMoment('offering', sessionId, persona, { messageLength: message.length });
        
        res.json({
            received: true,
            sacredPauseDuration: wisdomAI.getPersonaPauseDuration(persona),
            moment: 'sacred_pause'
        });
        
    } catch (error) {
        console.error('Error receiving offering:', error);
        res.status(500).json({ error: 'Unable to receive offering' });
    }
});

/**
 * Guidance Moment - AI Wisdom Response
 */
app.post('/api/sacred-journey/guidance', async (req, res) => {
    try {
        const { sessionId, persona } = req.body;
        
        if (!sessionManager.isValidSession(sessionId)) {
            return res.status(400).json({ error: 'Sacred session expired' });
        }
        
        // Retrieve session context
        const sessionContext = sessionManager.getSession(sessionId);
        const lastOffering = sessionContext.offerings[sessionContext.offerings.length - 1];
        
        // Generate conscious AI response
        const guidance = await wisdomAI.generateGuidance({
            message: lastOffering,
            persona,
            sessionContext,
            conversationCount: sessionContext.offerings.length
        });
        
        // Store guidance in session
        sessionManager.addGuidance(sessionId, guidance);
        
        // Track contemplative response
        analytics.trackSacredMoment('guidance', sessionId, persona, {
            responseLength: guidance.length,
            contemplativeDepth: guidance.contemplativeDepth
        });
        
        res.json({
            guidance,
            contemplativeCheckin: sessionContext.offerings.length % 3 === 0 
                ? wisdomAI.generateContemplativeCheckin(persona)
                : null,
            moment: 'guidance'
        });
        
    } catch (error) {
        console.error('Error generating guidance:', error);
        res.status(500).json({ 
            error: 'Guidance temporarily unavailable',
            fallback: 'What is present for you in this moment of silence?'
        });
    }
});

/**
 * Integration Moment - Natural Session Conclusion
 */
app.post('/api/sacred-journey/integration', async (req, res) => {
    try {
        const { sessionId, persona } = req.body;
        
        if (!sessionManager.isValidSession(sessionId)) {
            return res.status(400).json({ error: 'Sacred session expired' });
        }
        
        const sessionContext = sessionManager.getSession(sessionId);
        
        // Determine if natural conclusion is appropriate
        const shouldConclude = sessionContext.offerings.length >= 5 || 
                             sessionContext.duration > 20 * 60 * 1000; // 20 minutes
        
        if (shouldConclude) {
            const conclusion = await wisdomAI.generateConclusion(persona, sessionContext);
            
            // Complete the sacred session
            sessionManager.completeSession(sessionId);
            
            // Track integration
            analytics.trackSacredMoment('integration', sessionId, persona, {
                sessionDuration: sessionContext.duration,
                totalOfferings: sessionContext.offerings.length
            });
            
            res.json({
                conclusion,
                sessionComplete: true,
                moment: 'integration'
            });
        } else {
            res.json({
                sessionComplete: false,
                continueJourney: true
            });
        }
        
    } catch (error) {
        console.error('Error in integration:', error);
        res.status(500).json({ error: 'Integration moment unavailable' });
    }
});

/**
 * Analytics Endpoint - Contemplative Metrics
 */
app.get('/api/analytics/contemplative', (req, res) => {
    const metrics = analytics.getContemplativeMetrics();
    res.json(metrics);
});

/**
 * Health Check - Sacred System Status
 */
app.get('/api/health', auth.sacredHealthCheck());

// Error handling with contemplative grace
app.use(auth.sacredErrorHandler());

// Start the sacred server
app.listen(port, () => {
    console.log(`🧘‍♀️ ERC Wisdom Companion Backend listening on port ${port}`);
    console.log(`🌟 Sacred AI systems initialized`);
    console.log(`💝 Ready to serve consciousness`);
});

module.exports = app;