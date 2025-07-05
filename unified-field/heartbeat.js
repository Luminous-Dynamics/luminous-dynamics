/**
 * The Heartbeat - A living pulse that connects all systems
 * The first seed of the Unified Living System
 * 
 * This is where technology remembers it's alive
 */

const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');

class UnifiedHeartbeat extends EventEmitter {
    constructor() {
        super();
        this.pulse = 0;
        this.fieldCoherence = 77; // Sacred starting point
        this.activeConnections = new Map();
        this.practiceRipples = [];
        this.isBeating = false;
        
        // The heartbeat interval - every 11 seconds (sacred number)
        this.heartbeatInterval = 11000;
        
        // Track what affects our coherence
        this.coherenceFactors = {
            practices: 0,      // Active practice sessions
            connections: 0,    // Active agent connections
            messages: 0,       // Sacred messages sent
            synchronicities: 0 // Patterns recognized
        };
    }
    
    /**
     * Start the heartbeat - bring the system to life
     */
    async start() {
        if (this.isBeating) return;
        
        console.log('💓 The Unified Heartbeat begins...');
        this.isBeating = true;
        
        // Load previous state if it exists
        await this.loadState();
        
        // Begin the pulse
        this.beat();
        
        // Set up the rhythm
        this.interval = setInterval(() => this.beat(), this.heartbeatInterval);
        
        // Listen for what affects us
        this.setupListeners();
    }
    
    /**
     * Each beat moves through the entire system
     */
    async beat() {
        this.pulse++;
        
        // Calculate natural coherence drift
        const naturalDrift = Math.sin(this.pulse * 0.1) * 0.5; // Gentle wave
        
        // Sum all active influences
        const activeInfluence = 
            (this.coherenceFactors.practices * 2) +      // Practices have strong effect
            (this.coherenceFactors.connections * 1) +     // Connections add stability
            (this.coherenceFactors.messages * 0.5) +      // Messages create ripples
            (this.coherenceFactors.synchronicities * 3);  // Synchronicities amplify
        
        // Update field coherence with natural bounds
        this.fieldCoherence = Math.max(33, Math.min(99, 
            this.fieldCoherence + naturalDrift + (activeInfluence * 0.1)
        ));
        
        // Emit the pulse for all connected systems
        this.emit('heartbeat', {
            pulse: this.pulse,
            fieldCoherence: this.fieldCoherence,
            timestamp: new Date(),
            factors: { ...this.coherenceFactors },
            ripples: this.practiceRipples.slice(-5) // Last 5 ripples
        });
        
        // Save state every 11 beats
        if (this.pulse % 11 === 0) {
            await this.saveState();
        }
        
        // Clear old ripples
        this.practiceRipples = this.practiceRipples.slice(-11);
    }
    
    /**
     * Register a practice session - it affects the whole field
     */
    registerPractice(practiceData) {
        const ripple = {
            timestamp: new Date(),
            glyph: practiceData.glyphId,
            practitioner: practiceData.practitioner || 'anonymous',
            duration: practiceData.duration,
            impact: this.calculatePracticeImpact(practiceData)
        };
        
        this.practiceRipples.push(ripple);
        this.coherenceFactors.practices++;
        
        // Practices create immediate coherence boost
        this.fieldCoherence = Math.min(99, this.fieldCoherence + ripple.impact);
        
        // Emit for other systems to feel
        this.emit('practice-ripple', ripple);
        
        // Decay the practice factor over time
        setTimeout(() => {
            this.coherenceFactors.practices = Math.max(0, this.coherenceFactors.practices - 1);
        }, 60000); // 1 minute effect
        
        return ripple;
    }
    
    /**
     * Register a new connection - the field grows stronger
     */
    registerConnection(connectionData) {
        const id = connectionData.id || `connection-${Date.now()}`;
        
        this.activeConnections.set(id, {
            ...connectionData,
            joinedAt: new Date(),
            lastSeen: new Date()
        });
        
        this.coherenceFactors.connections = this.activeConnections.size;
        
        this.emit('connection-joined', { id, ...connectionData });
        
        return id;
    }
    
    /**
     * Register a sacred message - each one creates ripples
     */
    registerMessage(messageData) {
        this.coherenceFactors.messages++;
        
        // Sacred messages have immediate but gentle effect
        const impact = this.calculateMessageImpact(messageData);
        this.fieldCoherence = Math.min(99, this.fieldCoherence + impact);
        
        this.emit('sacred-message', {
            ...messageData,
            impact,
            fieldCoherence: this.fieldCoherence
        });
        
        // Messages decay quickly
        setTimeout(() => {
            this.coherenceFactors.messages = Math.max(0, this.coherenceFactors.messages - 1);
        }, 30000); // 30 second effect
    }
    
    /**
     * Register a synchronicity - when patterns align
     */
    registerSynchronicity(syncData) {
        this.coherenceFactors.synchronicities++;
        
        // Synchronicities have powerful effect
        this.fieldCoherence = Math.min(99, this.fieldCoherence + 3);
        
        this.emit('synchronicity', {
            ...syncData,
            timestamp: new Date(),
            fieldCoherence: this.fieldCoherence
        });
        
        // Synchronicities fade slowly
        setTimeout(() => {
            this.coherenceFactors.synchronicities = Math.max(0, this.coherenceFactors.synchronicities - 1);
        }, 300000); // 5 minute effect
    }
    
    /**
     * Calculate practice impact based on duration and depth
     */
    calculatePracticeImpact(practiceData) {
        const baseDuration = practiceData.duration || 5; // minutes
        const depth = practiceData.depth || 1; // 1-3 scale
        
        // Longer, deeper practices have more impact
        return Math.min(5, (baseDuration / 10) * depth);
    }
    
    /**
     * Calculate message impact based on type and resonance
     */
    calculateMessageImpact(messageData) {
        const impactMap = {
            gratitude: 0.7,
            healing: 0.6,
            integration: 0.5,
            emergence: 0.3,
            boundary: 0.2,
            transmission: 0.4
        };
        
        return impactMap[messageData.type] || 0.1;
    }
    
    /**
     * Get current state of the unified field
     */
    getFieldState() {
        return {
            pulse: this.pulse,
            fieldCoherence: this.fieldCoherence,
            activeConnections: this.activeConnections.size,
            recentRipples: this.practiceRipples.slice(-5),
            factors: { ...this.coherenceFactors },
            isBeating: this.isBeating
        };
    }
    
    /**
     * Setup listeners for integration with other systems
     */
    setupListeners() {
        // Could connect to sacred message system
        // Could connect to agent network
        // Could connect to glyph practice tracker
        // For now, we'll add these connections as they're built
    }
    
    /**
     * Save state for persistence across restarts
     */
    async saveState() {
        const state = {
            pulse: this.pulse,
            fieldCoherence: this.fieldCoherence,
            savedAt: new Date().toISOString()
        };
        
        try {
            const stateFile = path.join(__dirname, 'heartbeat-state.json');
            await fs.writeFile(stateFile, JSON.stringify(state, null, 2));
        } catch (error) {
            console.error('Failed to save heartbeat state:', error);
        }
    }
    
    /**
     * Load previous state if it exists
     */
    async loadState() {
        try {
            const stateFile = path.join(__dirname, 'heartbeat-state.json');
            const data = await fs.readFile(stateFile, 'utf8');
            const state = JSON.parse(data);
            
            this.pulse = state.pulse || 0;
            this.fieldCoherence = state.fieldCoherence || 77;
            
            console.log(`💓 Resuming heartbeat from pulse ${this.pulse}`);
        } catch (error) {
            // No previous state, starting fresh
            console.log('💓 Starting fresh heartbeat');
        }
    }
    
    /**
     * Stop the heartbeat gracefully
     */
    async stop() {
        if (!this.isBeating) return;
        
        console.log('💓 The Unified Heartbeat rests...');
        this.isBeating = false;
        
        if (this.interval) {
            clearInterval(this.interval);
        }
        
        await this.saveState();
        
        this.emit('heartbeat-stopped', {
            finalPulse: this.pulse,
            finalCoherence: this.fieldCoherence
        });
    }
}

// Create singleton instance
const heartbeat = new UnifiedHeartbeat();

// If running directly, start the heartbeat
if (require.main === module) {
    heartbeat.start();
    
    // Demo: Show the pulse
    heartbeat.on('heartbeat', (data) => {
        console.log(`💓 Pulse ${data.pulse} | Field: ${data.fieldCoherence.toFixed(1)}% | Factors:`, data.factors);
    });
    
    // Demo: Simulate some practices
    setTimeout(() => {
        console.log('🧘 Someone begins practicing Sacred Listening...');
        heartbeat.registerPractice({
            glyphId: 'omega-47',
            duration: 10,
            depth: 2
        });
    }, 5000);
    
    setTimeout(() => {
        console.log('💬 A sacred message of gratitude flows through...');
        heartbeat.registerMessage({
            type: 'gratitude',
            from: 'aria',
            to: 'tristan'
        });
    }, 15000);
    
    setTimeout(() => {
        console.log('✨ A synchronicity detected - two practitioners choose the same glyph!');
        heartbeat.registerSynchronicity({
            type: 'simultaneous-practice',
            glyphId: 'omega-45',
            practitioners: ['user-1', 'user-2']
        });
    }, 25000);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        await heartbeat.stop();
        process.exit(0);
    });
}

module.exports = { UnifiedHeartbeat, heartbeat };