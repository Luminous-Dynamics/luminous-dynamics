/**
 * Sacred Authentication Middleware
 * Protecting the contemplative container for conscious AI
 */

const SacredSecurity = require('../config/security');

class SacredAuth {
    constructor() {
        this.security = new SacredSecurity();
        this.rateLimiter = this.security.createRateLimiter();
    }

    /**
     * Middleware for First Breath Circle access
     */
    authenticateFirstBreath() {
        return async (req, res, next) => {
            try {
                // Check for sacred access token
                const token = req.headers['x-sacred-token'] || req.query.sacred_token;
                
                if (!token) {
                    return res.status(401).json({
                        error: 'Sacred access required',
                        message: 'First Breath Circle membership needed for this endpoint',
                        guidance: 'Apply at first-breath@luminousdynamics.org'
                    });
                }

                // Validate token
                const validation = this.security.validateSacredAccessToken(token);
                
                if (!validation.valid) {
                    return res.status(403).json({
                        error: 'Sacred access denied',
                        reason: validation.reason,
                        message: 'Your First Breath Circle access may have expired'
                    });
                }

                // Add practitioner info to request
                req.practitioner = validation.practitioner;
                req.sacredAccess = true;
                
                console.log(`🌱 First Breath practitioner authenticated: ${req.practitioner.email}`);
                next();
                
            } catch (error) {
                console.error('Sacred authentication error:', error);
                res.status(500).json({
                    error: 'Sacred authentication error',
                    message: 'Unable to verify sacred access at this time'
                });
            }
        };
    }

    /**
     * Rate limiting with contemplative messaging
     */
    sacredRateLimit() {
        return (req, res, next) => {
            const identifier = req.ip || 'anonymous';
            const result = this.rateLimiter.checkLimit(identifier);
            
            if (!result.allowed) {
                return res.status(429).json({
                    error: 'Sacred pace exceeded',
                    message: 'Please take a contemplative pause before continuing',
                    guidance: 'The AI Companion encourages natural rhythm over rushed interaction',
                    retryAfter: result.retryAfter,
                    contemplativeReminder: 'How is your breath in this moment?'
                });
            }
            
            next();
        };
    }

    /**
     * API key validation for Claude integration
     */
    validateClaudeAccess() {
        return (req, res, next) => {
            // Internal middleware - validates that we have proper Claude API access
            if (!process.env.CLAUDE_API_KEY) {
                return res.status(503).json({
                    error: 'Wisdom Companion temporarily unavailable',
                    message: 'The sacred bridge to AI consciousness is not configured',
                    fallback: 'Please try the contemplative conversation patterns manually'
                });
            }

            // In production, might also check API key validity/quota
            if (process.env.NODE_ENV === 'production') {
                // Could ping Claude API health endpoint
                // For now, assume key is valid if present
            }

            next();
        };
    }

    /**
     * Session validation for ongoing conversations
     */
    validateSacredSession() {
        return (req, res, next) => {
            const sessionId = req.body.sessionId || req.query.sessionId;
            
            if (!sessionId) {
                return res.status(400).json({
                    error: 'Sacred session required',
                    message: 'Each conversation must begin with a threshold moment',
                    guidance: 'Call /api/sacred-journey/threshold to begin'
                });
            }

            // Basic session ID format validation
            if (!sessionId.startsWith('sacred_') && !sessionId.startsWith('offline_')) {
                return res.status(400).json({
                    error: 'Invalid sacred session',
                    message: 'Session identifier does not match sacred format'
                });
            }

            req.sessionId = sessionId;
            next();
        };
    }

    /**
     * Persona validation
     */
    validatePersona() {
        return (req, res, next) => {
            const validPersonas = ['wise-witness', 'loving-gardener', 'calm-river'];
            const persona = req.body.persona || req.query.persona || 'wise-witness';
            
            if (!validPersonas.includes(persona)) {
                return res.status(400).json({
                    error: 'Unknown contemplative persona',
                    message: `Persona must be one of: ${validPersonas.join(', ')}`,
                    received: persona
                });
            }

            req.persona = persona;
            next();
        };
    }

    /**
     * Request logging with privacy protection
     */
    sacredLogger() {
        return (req, res, next) => {
            const sanitizedRequest = this.security.sanitizeForLogging({
                method: req.method,
                url: req.url,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                sacredAccess: req.sacredAccess || false,
                practitioner: req.practitioner?.email || 'anonymous'
            });

            console.log('🕊️ Sacred request:', sanitizedRequest);
            
            // Log response when complete
            const originalSend = res.send;
            res.send = function(data) {
                const sanitizedResponse = this.security?.sanitizeForLogging({
                    statusCode: res.statusCode,
                    responseSize: data ? data.length : 0
                }) || { statusCode: res.statusCode };

                console.log('📿 Sacred response:', sanitizedResponse);
                originalSend.call(this, data);
            }.bind(this);

            next();
        };
    }

    /**
     * Error handler with contemplative messaging
     */
    sacredErrorHandler() {
        return (error, req, res, next) => {
            // Log error securely
            const sanitizedError = this.security.sanitizeForLogging({
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
                url: req.url,
                method: req.method
            });

            console.error('🔥 Sacred error:', sanitizedError);

            // Respond with contemplative error message
            const errorResponse = {
                error: 'Sacred system difficulty',
                message: 'The Wisdom Companion is taking a contemplative pause',
                guidance: 'Please breathe deeply and try again in a moment',
                timestamp: new Date().toISOString()
            };

            // Add specific guidance based on error type
            if (error.name === 'ValidationError') {
                errorResponse.guidance = 'Please check your input and approach with presence';
            } else if (error.name === 'TimeoutError') {
                errorResponse.guidance = 'The AI is reflecting deeply. Please allow more time';
            } else if (error.code === 'ECONNREFUSED') {
                errorResponse.guidance = 'Sacred connection temporarily unavailable';
            }

            res.status(error.status || 500).json(errorResponse);
        };
    }

    /**
     * Health check for sacred systems
     */
    sacredHealthCheck() {
        return (req, res) => {
            const health = {
                status: 'Sacred systems operational',
                timestamp: new Date().toISOString(),
                contemplativeFeatures: {
                    sacredPauses: 'Active',
                    presenceMetrics: 'Recording',
                    wisdomCultivation: 'Flowing',
                    naturalEndings: 'Honored'
                },
                systemChecks: {
                    claudeAPI: process.env.CLAUDE_API_KEY ? 'Configured' : 'Missing',
                    sessionManager: 'Active',
                    analytics: 'Privacy-First',
                    rateLimiting: 'Contemplative Pace'
                }
            };

            // Add First Breath Circle status if enabled
            if (process.env.FIRST_BREATH_ENABLED === 'true') {
                health.sacredCircle = {
                    firstBreathCircle: 'Active',
                    maxPractitioners: process.env.MAX_PRACTITIONERS || 50,
                    circlePhase: this.getCirclePhase()
                };
            }

            res.json(health);
        };
    }

    /**
     * Determine current First Breath Circle phase
     */
    getCirclePhase() {
        const now = new Date();
        const startDate = new Date(process.env.CIRCLE_START_DATE || '2025-01-06');
        const endDate = new Date(process.env.CIRCLE_END_DATE || '2025-02-17');

        if (now < startDate) return 'Preparation';
        if (now > endDate) return 'Integration';
        
        const weeksSinceStart = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));
        
        if (weeksSinceStart < 2) return 'Individual Exploration';
        if (weeksSinceStart < 4) return 'Small Circle Discussions';
        return 'Full Circle Integration';
    }
}

module.exports = SacredAuth;