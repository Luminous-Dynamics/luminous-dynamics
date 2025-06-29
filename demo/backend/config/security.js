/**
 * Sacred Security Configuration
 * Protecting the bridge between human and artificial consciousness
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class SacredSecurity {
    constructor() {
        this.initializeSecurityConfig();
        this.validateEnvironment();
    }

    initializeSecurityConfig() {
        this.config = {
            // API Key Management
            claude: {
                keyPath: process.env.CLAUDE_API_KEY,
                rotationSchedule: '90_days', // Quarterly rotation
                encryptionKey: this.generateEncryptionKey(),
                rateLimits: {
                    requestsPerMinute: parseInt(process.env.RATE_LIMIT_REQUESTS) || 60,
                    maxTokensPerHour: 50000, // Contemplative pacing
                    maxSessionsPerUser: 3 // Quality over quantity
                }
            },

            // Session Security
            sessions: {
                encryption: 'aes-256-gcm',
                tokenExpiry: parseInt(process.env.SESSION_TIMEOUT_MINUTES) * 60 * 1000 || 1800000, // 30 minutes
                maxConcurrent: parseInt(process.env.MAX_CONCURRENT_SESSIONS) || 100,
                ipRateLimiting: true
            },

            // Privacy Protection
            privacy: {
                dataRetentionDays: parseInt(process.env.DATA_RETENTION_DAYS) || 30,
                anonymizeAfterDays: 7, // Remove identifiers after 1 week
                exportDataEncryption: true,
                contemplativeDataProtection: true // Extra protection for sacred conversations
            },

            // CORS and Network Security
            network: {
                allowedOrigins: this.parseAllowedOrigins(),
                corsCredentials: process.env.CORS_CREDENTIALS === 'true',
                requireHTTPS: process.env.NODE_ENV === 'production',
                trustProxy: true,
                securityHeaders: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'X-XSS-Protection': '1; mode=block',
                    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
                }
            },

            // Sacred Circle Access Control
            sacredCircle: {
                maxPractitioners: parseInt(process.env.MAX_PRACTITIONERS) || 50,
                accessTokenExpiry: '6_weeks', // Duration of First Breath Circle
                invitationCodeLength: 32,
                practitionerVerification: true,
                contemplativeCredentials: true // Verify contemplative practice background
            }
        };
    }

    /**
     * Generate encryption key for sensitive data
     */
    generateEncryptionKey() {
        const existingKeyPath = path.join(__dirname, '.encryption-key');
        
        if (fs.existsSync(existingKeyPath)) {
            return fs.readFileSync(existingKeyPath, 'utf8');
        }
        
        const newKey = crypto.randomBytes(32).toString('hex');
        
        // Store securely (only in production)
        if (process.env.NODE_ENV === 'production') {
            fs.writeFileSync(existingKeyPath, newKey, { mode: 0o600 });
        }
        
        return newKey;
    }

    /**
     * Parse allowed origins from environment
     */
    parseAllowedOrigins() {
        const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
        return origins.split(',').map(origin => origin.trim());
    }

    /**
     * Validate environment configuration
     */
    validateEnvironment() {
        const required = [
            'CLAUDE_API_KEY',
            'NODE_ENV'
        ];

        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            console.error('🔐 Sacred Security Error: Missing required environment variables:');
            missing.forEach(key => console.error(`   - ${key}`));
            
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            } else {
                console.warn('🔄 Development mode: Continuing with fallback values');
            }
        }

        // Validate API key format
        if (process.env.CLAUDE_API_KEY && !this.isValidClaudeApiKey(process.env.CLAUDE_API_KEY)) {
            console.error('🔐 Sacred Security Error: Invalid Claude API key format');
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
        }

        console.log('🛡️ Sacred Security: Configuration validated');
    }

    /**
     * Validate Claude API key format
     */
    isValidClaudeApiKey(key) {
        // Basic validation - Claude API keys start with 'sk-ant-'
        return typeof key === 'string' && key.startsWith('sk-ant-') && key.length > 20;
    }

    /**
     * Encrypt sensitive data
     */
    encryptSacredData(data) {
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(this.config.claude.encryptionKey, 'hex');
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipher(algorithm, key);
        
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    /**
     * Decrypt sensitive data
     */
    decryptSacredData(encryptedData) {
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(this.config.claude.encryptionKey, 'hex');
        
        const decipher = crypto.createDecipher(algorithm, key);
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }

    /**
     * Generate secure access token for First Breath Circle
     */
    generateSacredAccessToken(practitionerEmail) {
        const payload = {
            email: practitionerEmail,
            circle: 'first_breath',
            issued: Date.now(),
            expires: Date.now() + (6 * 7 * 24 * 60 * 60 * 1000), // 6 weeks
            permissions: ['ai_dialogue', 'contemplative_feedback', 'circle_calls']
        };

        return this.encryptSacredData(payload);
    }

    /**
     * Validate sacred access token
     */
    validateSacredAccessToken(token) {
        try {
            const payload = this.decryptSacredData(token);
            
            // Check expiration
            if (Date.now() > payload.expires) {
                return { valid: false, reason: 'Token expired' };
            }

            // Check circle membership
            if (payload.circle !== 'first_breath') {
                return { valid: false, reason: 'Invalid circle access' };
            }

            return { valid: true, practitioner: payload };
        } catch (error) {
            return { valid: false, reason: 'Invalid token format' };
        }
    }

    /**
     * Rate limiting for API calls
     */
    createRateLimiter() {
        const rateLimits = new Map();
        
        return {
            checkLimit: (identifier, maxRequests = this.config.claude.rateLimits.requestsPerMinute) => {
                const now = Date.now();
                const windowStart = now - (60 * 1000); // 1 minute window
                
                if (!rateLimits.has(identifier)) {
                    rateLimits.set(identifier, []);
                }
                
                const requests = rateLimits.get(identifier);
                
                // Remove old requests outside window
                const recentRequests = requests.filter(timestamp => timestamp > windowStart);
                rateLimits.set(identifier, recentRequests);
                
                // Check if limit exceeded
                if (recentRequests.length >= maxRequests) {
                    return {
                        allowed: false,
                        retryAfter: Math.ceil((recentRequests[0] - windowStart) / 1000)
                    };
                }
                
                // Add current request
                recentRequests.push(now);
                rateLimits.set(identifier, recentRequests);
                
                return { allowed: true };
            }
        };
    }

    /**
     * Sanitize logs to remove sensitive data
     */
    sanitizeForLogging(data) {
        const sanitized = JSON.parse(JSON.stringify(data));
        
        // Remove sensitive fields
        const sensitiveFields = [
            'apiKey', 'password', 'token', 'secret', 'key',
            'email', 'personalData', 'sacredData'
        ];
        
        function cleanObject(obj) {
            for (const key in obj) {
                if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                    obj[key] = '[REDACTED]';
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    cleanObject(obj[key]);
                }
            }
        }
        
        cleanObject(sanitized);
        return sanitized;
    }

    /**
     * Get security configuration for express middleware
     */
    getMiddlewareConfig() {
        return {
            cors: {
                origin: this.config.network.allowedOrigins,
                credentials: this.config.network.corsCredentials,
                methods: ['GET', 'POST', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization', 'X-Sacred-Token']
            },
            
            rateLimit: {
                windowMs: 60 * 1000, // 1 minute
                max: this.config.claude.rateLimits.requestsPerMinute,
                message: {
                    error: 'Sacred pace exceeded. Please pause and breathe.',
                    retryAfter: '60 seconds'
                }
            },
            
            helmet: {
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        styleSrc: ["'self'", "'unsafe-inline'"],
                        scriptSrc: ["'self'"],
                        imgSrc: ["'self'", "data:", "https:"],
                        connectSrc: ["'self'", "https://api.anthropic.com"],
                        fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"]
                    }
                }
            }
        };
    }
}

module.exports = SacredSecurity;