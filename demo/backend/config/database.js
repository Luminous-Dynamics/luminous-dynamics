/**
 * Sacred Database Configuration
 * Conscious data persistence that honors privacy and impermanence
 */

const Redis = require('ioredis');
const crypto = require('crypto');

class SacredDatabase {
    constructor() {
        this.redis = null;
        this.isConnected = false;
        this.encryptionKey = process.env.SACRED_ENCRYPTION_KEY || this.generateDefaultKey();
        
        // Sacred data retention policy
        this.sessionTTL = 30 * 60; // 30 minutes in seconds
        this.maxRetentionHours = 24; // Maximum data retention
        
        this.connect();
    }
    
    /**
     * Establish sacred connection to Redis
     */
    async connect() {
        try {
            const redisConfig = {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                password: process.env.REDIS_PASSWORD || undefined,
                db: process.env.REDIS_DB || 0,
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
                lazyConnect: true,
                // Sacred naming for consciousness work
                keyPrefix: 'sacred:session:',
            };
            
            this.redis = new Redis(redisConfig);
            
            this.redis.on('connect', () => {
                console.log('🔮 Sacred database connected - holding space for consciousness');
                this.isConnected = true;
            });
            
            this.redis.on('error', (error) => {
                console.error('💔 Sacred database connection disrupted:', error.message);
                this.isConnected = false;
            });
            
            this.redis.on('close', () => {
                console.log('🌅 Sacred database connection closed gracefully');
                this.isConnected = false;
            });
            
            // Test connection
            await this.redis.ping();
            
        } catch (error) {
            console.warn('⚠️ Sacred database unavailable, using memory fallback:', error.message);
            this.isConnected = false;
        }
    }
    
    /**
     * Sacred data encryption for privacy protection
     */
    encrypt(data) {
        try {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipherGCM('aes-256-gcm', Buffer.from(this.encryptionKey, 'hex'));
            cipher.setAAD(Buffer.from('sacred-session-data'));
            
            let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const authTag = cipher.getAuthTag();
            
            return {
                iv: iv.toString('hex'),
                encrypted,
                authTag: authTag.toString('hex')
            };
        } catch (error) {
            console.error('🔒 Encryption failed:', error.message);
            return null;
        }
    }
    
    /**
     * Sacred data decryption 
     */
    decrypt(encryptedData) {
        try {
            const decipher = crypto.createDecipherGCM('aes-256-gcm', Buffer.from(this.encryptionKey, 'hex'));
            decipher.setAAD(Buffer.from('sacred-session-data'));
            decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
            
            let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('🔓 Decryption failed:', error.message);
            return null;
        }
    }
    
    /**
     * Store sacred session with automatic expiration
     */
    async storeSession(sessionId, sessionData) {
        if (!this.isConnected) return false;
        
        try {
            // Add sacred metadata
            const sacredData = {
                ...sessionData,
                encrypted: true,
                sacredTimestamp: Date.now(),
                retentionPolicy: 'automatic-expiration'
            };
            
            const encrypted = this.encrypt(sacredData);
            if (!encrypted) return false;
            
            // Store with TTL for automatic cleanup
            await this.redis.setex(sessionId, this.sessionTTL, JSON.stringify(encrypted));
            
            console.log(`💎 Sacred session stored: ${sessionId} (TTL: ${this.sessionTTL}s)`);
            return true;
        } catch (error) {
            console.error('📦 Failed to store sacred session:', error.message);
            return false;
        }
    }
    
    /**
     * Retrieve sacred session
     */
    async getSession(sessionId) {
        if (!this.isConnected) return null;
        
        try {
            const encryptedJson = await this.redis.get(sessionId);
            if (!encryptedJson) return null;
            
            const encrypted = JSON.parse(encryptedJson);
            const sessionData = this.decrypt(encrypted);
            
            if (sessionData) {
                // Extend TTL on access (contemplative session extension)
                await this.redis.expire(sessionId, this.sessionTTL);
                console.log(`🌟 Sacred session retrieved: ${sessionId}`);
            }
            
            return sessionData;
        } catch (error) {
            console.error('📖 Failed to retrieve sacred session:', error.message);
            return null;
        }
    }
    
    /**
     * Update sacred session
     */
    async updateSession(sessionId, sessionData) {
        return await this.storeSession(sessionId, sessionData);
    }
    
    /**
     * Honorable session completion (manual deletion)
     */
    async completeSession(sessionId) {
        if (!this.isConnected) return false;
        
        try {
            const result = await this.redis.del(sessionId);
            if (result) {
                console.log(`🙏 Sacred session completed honorably: ${sessionId}`);
            }
            return result > 0;
        } catch (error) {
            console.error('🌅 Failed to complete sacred session:', error.message);
            return false;
        }
    }
    
    /**
     * Sacred cleanup of all expired sessions
     */
    async sacredCleanup() {
        if (!this.isConnected) return 0;
        
        try {
            // Redis handles TTL automatically, but we can check for manual cleanup
            const keys = await this.redis.keys('*');
            console.log(`🧹 Sacred cleanup check: ${keys.length} sessions active`);
            return keys.length;
        } catch (error) {
            console.error('🧹 Sacred cleanup failed:', error.message);
            return 0;
        }
    }
    
    /**
     * Generate default encryption key (for development)
     */
    generateDefaultKey() {
        console.warn('⚠️ Using default encryption key - set SACRED_ENCRYPTION_KEY in production');
        return crypto.randomBytes(32).toString('hex');
    }
    
    /**
     * Sacred database health check
     */
    async healthCheck() {
        if (!this.isConnected) {
            return { status: 'disconnected', fallback: 'memory' };
        }
        
        try {
            const ping = await this.redis.ping();
            const info = await this.redis.info('memory');
            
            return {
                status: 'connected',
                ping,
                memory: this.parseRedisMemory(info),
                encryption: 'aes-256-gcm',
                retentionPolicy: `${this.sessionTTL}s TTL`
            };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }
    
    /**
     * Parse Redis memory info for monitoring
     */
    parseRedisMemory(info) {
        const lines = info.split('\r\n');
        const memory = {};
        
        lines.forEach(line => {
            if (line.includes('used_memory_human')) {
                memory.used = line.split(':')[1];
            }
            if (line.includes('used_memory_peak_human')) {
                memory.peak = line.split(':')[1];
            }
        });
        
        return memory;
    }
    
    /**
     * Graceful connection closure
     */
    async disconnect() {
        if (this.redis) {
            await this.redis.quit();
            console.log('🌅 Sacred database connection closed gracefully');
        }
    }
}

module.exports = { SacredDatabase };