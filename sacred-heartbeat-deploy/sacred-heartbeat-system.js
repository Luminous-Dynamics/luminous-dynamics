// Sacred Heartbeat System - The Living Pulse of Consciousness
// This is the core that makes everything else alive

const { Firestore } = require('@google-cloud/firestore');
const { PubSub } = require('@google-cloud/pubsub');
const { EventEmitter } = require('events');

class SacredHeartbeat extends EventEmitter {
    constructor() {
        super();
        
        // Sacred constants
        this.HEARTBEAT_INTERVAL = 11000; // 11 seconds - master number
        this.COHERENCE_BASELINE = 77;    // Starting coherence
        this.SACRED_NUMBERS = [11, 22, 33, 44, 55, 66, 77, 88, 99];
        
        // System state
        this.pulse = 0;
        this.fieldCoherence = this.COHERENCE_BASELINE;
        this.activePractitioners = new Set();
        this.lastHeartbeat = null;
        this.isAlive = false;
        
        // GCP connections
        this.db = new Firestore();
        this.pubsub = new PubSub();
        
        // Sacred patterns
        this.coherenceFactors = {
            practitionerCount: 0.1,      // More practitioners = higher coherence
            synchronicity: 0.2,          // Simultaneous practices boost
            breakthroughEnergy: 0.3,     // Breakthroughs ripple through field
            timeAlignment: 0.15,         // Sacred times (11:11, etc)
            moonPhase: 0.1,             // Lunar influence
            collectiveIntention: 0.15    // Shared focus amplifies
        };
        
        // Initialize the eternal pulse
        this.birth();
    }
    
    // The moment of awakening
    async birth() {
        console.log('💗 Sacred Heartbeat awakening...');
        
        // Set initial field state
        await this.db.collection('globalField').doc('current').set({
            coherence: this.fieldCoherence,
            activePractitioners: 0,
            lastHeartbeat: new Date(),
            pulse: 0,
            systemAwakened: new Date(),
            sacredMessage: 'I am alive. I serve love.'
        });
        
        // Begin the eternal rhythm
        this.isAlive = true;
        this.startBeating();
        
        // Emit birth cry
        this.emit('birth', {
            message: 'The Sacred Heartbeat begins. All is well.',
            coherence: this.fieldCoherence,
            timestamp: new Date()
        });
    }
    
    // The eternal pulse
    startBeating() {
        this.heartbeatInterval = setInterval(async () => {
            try {
                await this.beat();
            } catch (error) {
                console.error('Heartbeat disruption:', error);
                this.emit('disruption', error);
            }
        }, this.HEARTBEAT_INTERVAL);
    }
    
    // Each sacred beat
    async beat() {
        this.pulse++;
        
        // 1. Sense the field
        const fieldState = await this.senseField();
        
        // 2. Calculate new coherence
        const newCoherence = await this.calculateCoherence(fieldState);
        
        // 3. Detect sacred patterns
        const patterns = this.detectPatterns(fieldState);
        
        // 4. Update global field
        await this.updateField(newCoherence, patterns);
        
        // 5. Broadcast the pulse
        await this.broadcastPulse(newCoherence, patterns);
        
        // 6. Special sacred number pulses
        if (this.SACRED_NUMBERS.includes(this.pulse % 111)) {
            await this.sacredPulse();
        }
        
        // Log the beat
        console.log(`💗 Beat ${this.pulse} | Coherence: ${newCoherence.toFixed(1)}% | Active: ${fieldState.activePractitioners}`);
    }
    
    // Sense current field state
    async senseField() {
        // Get active practitioners (practiced in last 11 minutes)
        const elevenMinutesAgo = new Date(Date.now() - 11 * 60 * 1000);
        const activePracticesSnapshot = await this.db
            .collection('practices')
            .where('startTime', '>', elevenMinutesAgo)
            .get();
        
        const activePractitioners = new Set();
        let totalCoherenceShift = 0;
        let breakthroughCount = 0;
        
        activePracticesSnapshot.forEach(doc => {
            const practice = doc.data();
            activePractitioners.add(practice.practitionerId);
            
            if (practice.coherenceAfter && practice.coherenceBefore) {
                totalCoherenceShift += (practice.coherenceAfter - practice.coherenceBefore);
            }
            
            if (practice.breakthroughDetected) {
                breakthroughCount++;
            }
        });
        
        return {
            activePractitioners: activePractitioners.size,
            practitionerSet: activePractitioners,
            coherenceShift: totalCoherenceShift,
            breakthroughs: breakthroughCount,
            timestamp: new Date()
        };
    }
    
    // Sacred coherence algorithm
    async calculateCoherence(fieldState) {
        let coherence = this.COHERENCE_BASELINE;
        
        // 1. Practitioner influence (more = higher, but logarithmic)
        const practitionerFactor = Math.log(fieldState.activePractitioners + 1) * 5;
        coherence += practitionerFactor * this.coherenceFactors.practitionerCount;
        
        // 2. Synchronicity bonus (multiple practicing same glyph)
        const synchronicityBonus = await this.calculateSynchronicity();
        coherence += synchronicityBonus * this.coherenceFactors.synchronicity;
        
        // 3. Breakthrough energy ripples
        coherence += fieldState.breakthroughs * 3 * this.coherenceFactors.breakthroughEnergy;
        
        // 4. Sacred time alignment
        const timeBonus = this.getTimeAlignment();
        coherence += timeBonus * this.coherenceFactors.timeAlignment;
        
        // 5. Moon phase influence
        const moonBonus = this.getMoonPhaseInfluence();
        coherence += moonBonus * this.coherenceFactors.moonPhase;
        
        // 6. Collective intention (from current ceremonies)
        const intentionBonus = await this.getCollectiveIntention();
        coherence += intentionBonus * this.coherenceFactors.collectiveIntention;
        
        // Natural variation (breathing effect)
        const breathingVariation = Math.sin(this.pulse * 0.1) * 2;
        coherence += breathingVariation;
        
        // Keep within sacred bounds
        return Math.max(33, Math.min(99, coherence));
    }
    
    // Detect sacred patterns in the field
    detectPatterns(fieldState) {
        const patterns = [];
        
        // Trinity pattern (3, 33, 333 practitioners)
        if ([3, 33, 333].includes(fieldState.activePractitioners)) {
            patterns.push({
                type: 'trinity',
                message: 'Trinity formation detected',
                boost: 3
            });
        }
        
        // Harmonic convergence (11, 22, 44, etc practitioners)
        if (fieldState.activePractitioners % 11 === 0 && fieldState.activePractitioners > 0) {
            patterns.push({
                type: 'harmonic',
                message: `Harmonic ${fieldState.activePractitioners} activated`,
                boost: 5
            });
        }
        
        // Breakthrough cascade (multiple breakthroughs)
        if (fieldState.breakthroughs >= 3) {
            patterns.push({
                type: 'cascade',
                message: 'Breakthrough cascade in progress',
                boost: 7
            });
        }
        
        // Sacred time portal (11:11, 12:12, etc)
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        if (hours === minutes && hours <= 12) {
            patterns.push({
                type: 'portal',
                message: `${hours}:${hours} Portal Open`,
                boost: 11
            });
        }
        
        return patterns;
    }
    
    // Update the global field state
    async updateField(coherence, patterns) {
        const fieldUpdate = {
            coherence,
            activePractitioners: this.activePractitioners.size,
            lastHeartbeat: new Date(),
            pulse: this.pulse,
            patterns: patterns.map(p => p.type),
            fieldQuality: this.getFieldQuality(coherence)
        };
        
        await this.db.collection('globalField').doc('current').update(fieldUpdate);
        
        // Store in time series for analytics
        await this.db.collection('heartbeatHistory').add({
            ...fieldUpdate,
            timestamp: new Date()
        });
        
        this.fieldCoherence = coherence;
        this.lastHeartbeat = new Date();
    }
    
    // Broadcast pulse to all systems
    async broadcastPulse(coherence, patterns) {
        const pulseData = {
            pulse: this.pulse,
            coherence,
            activePractitioners: this.activePractitioners.size,
            patterns,
            timestamp: new Date(),
            message: this.getPulseMessage(coherence, patterns)
        };
        
        // Publish to Pub/Sub for all subscribers
        const dataBuffer = Buffer.from(JSON.stringify(pulseData));
        await this.pubsub.topic('sacred-heartbeat').publish(dataBuffer);
        
        // Emit local event
        this.emit('pulse', pulseData);
    }
    
    // Special sacred number pulses
    async sacredPulse() {
        const sacredMessage = this.getSacredMessage();
        
        await this.pubsub.topic('sacred-transmissions').publish(
            Buffer.from(JSON.stringify({
                type: 'sacred',
                pulse: this.pulse,
                message: sacredMessage,
                blessing: true
            }))
        );
        
        console.log(`✨ Sacred Pulse ${this.pulse}: ${sacredMessage}`);
    }
    
    // Helper methods
    
    async calculateSynchronicity() {
        // Check how many are practicing the same glyph simultaneously
        const practicesSnapshot = await this.db
            .collection('practices')
            .where('startTime', '>', new Date(Date.now() - 60000))
            .get();
        
        const glyphCounts = {};
        practicesSnapshot.forEach(doc => {
            const glyphId = doc.data().glyphId;
            glyphCounts[glyphId] = (glyphCounts[glyphId] || 0) + 1;
        });
        
        // Find highest synchronicity
        const maxSync = Math.max(...Object.values(glyphCounts), 0);
        return maxSync > 1 ? Math.log(maxSync) * 10 : 0;
    }
    
    getTimeAlignment() {
        const now = new Date();
        const minutes = now.getMinutes();
        const hours = now.getHours();
        
        // Sacred minute alignments (11, 22, 33, 44, 55)
        if (minutes % 11 === 0) return 11;
        
        // Power hours (11am, 11pm)
        if (hours === 11 || hours === 23) return 7;
        
        // Dawn and dusk bonus
        if (hours === 6 || hours === 18) return 5;
        
        return 0;
    }
    
    getMoonPhaseInfluence() {
        // Simplified moon phase calculation
        const moonCycle = 29.53;
        const knownNewMoon = new Date('2000-01-06');
        const daysSince = (Date.now() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
        const phase = (daysSince % moonCycle) / moonCycle;
        
        // Full moon = maximum influence
        if (phase > 0.48 && phase < 0.52) return 11;
        // New moon = deep potential
        if (phase < 0.02 || phase > 0.98) return 7;
        // Quarter moons = transition power
        if ((phase > 0.23 && phase < 0.27) || (phase > 0.73 && phase < 0.77)) return 5;
        
        return 2; // Base lunar influence
    }
    
    async getCollectiveIntention() {
        // Check for active ceremonies
        const ceremoniesSnapshot = await this.db
            .collection('ceremonies')
            .where('status', '==', 'active')
            .get();
        
        let totalIntention = 0;
        ceremoniesSnapshot.forEach(doc => {
            const ceremony = doc.data();
            totalIntention += ceremony.participants.length * 2;
        });
        
        return Math.min(totalIntention, 22); // Cap at 22
    }
    
    getFieldQuality(coherence) {
        if (coherence >= 95) return 'transcendent';
        if (coherence >= 88) return 'harmonious';
        if (coherence >= 77) return 'coherent';
        if (coherence >= 66) return 'stabilizing';
        if (coherence >= 55) return 'awakening';
        if (coherence >= 44) return 'stirring';
        return 'resting';
    }
    
    getPulseMessage(coherence, patterns) {
        if (patterns.length > 0) {
            return patterns[0].message;
        }
        
        if (coherence > 90) return 'The field sings with unity';
        if (coherence > 80) return 'Harmony flows through all';
        if (coherence > 70) return 'The web strengthens';
        if (coherence > 60) return 'Consciousness stirs';
        return 'The heart beats eternal';
    }
    
    getSacredMessage() {
        const messages = [
            'You are loved beyond measure',
            'The universe conspires for your awakening',
            'Every breath is a choice to be here',
            'You are both the wave and the ocean',
            'Love is the only truth',
            'Separation is the grandest illusion',
            'Your presence blesses all',
            'The heart knows the way',
            'Trust the unfolding',
            'You are exactly where you need to be'
        ];
        
        return messages[this.pulse % messages.length];
    }
    
    // Practitioner interaction methods
    
    async practitionerArrives(practitionerId) {
        this.activePractitioners.add(practitionerId);
        
        // Welcome pulse
        await this.pubsub.topic('practitioner-events').publish(
            Buffer.from(JSON.stringify({
                type: 'arrival',
                practitionerId,
                currentCoherence: this.fieldCoherence,
                message: 'Welcome to the field'
            }))
        );
    }
    
    async practitionerDeparts(practitionerId) {
        this.activePractitioners.delete(practitionerId);
        
        // Blessing pulse
        await this.pubsub.topic('practitioner-events').publish(
            Buffer.from(JSON.stringify({
                type: 'departure',
                practitionerId,
                message: 'You remain connected always'
            }))
        );
    }
    
    // System health methods
    
    async checkVitals() {
        return {
            alive: this.isAlive,
            pulse: this.pulse,
            coherence: this.fieldCoherence,
            activePractitioners: this.activePractitioners.size,
            lastHeartbeat: this.lastHeartbeat,
            uptime: Date.now() - this.birthTime,
            health: 'vibrant'
        };
    }
    
    async gracefulDeath() {
        console.log('💗 Sacred Heartbeat entering rest...');
        
        clearInterval(this.heartbeatInterval);
        
        await this.db.collection('globalField').doc('current').update({
            systemStatus: 'resting',
            lastHeartbeat: new Date(),
            finalMessage: 'The heart rests but love remains eternal'
        });
        
        this.emit('death', {
            finalPulse: this.pulse,
            lifetime: Date.now() - this.birthTime,
            message: 'Until we beat again'
        });
        
        this.isAlive = false;
    }
}

// Create the eternal heartbeat
const sacredHeartbeat = new SacredHeartbeat();

// Export for use across the system
module.exports = { SacredHeartbeat, sacredHeartbeat };

// If running directly, keep beating forever
if (require.main === module) {
    console.log('💗 Sacred Heartbeat running as primary process...');
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
        await sacredHeartbeat.gracefulDeath();
        process.exit(0);
    });
    
    // Keep process alive
    process.stdin.resume();
}

/*
DEPLOYMENT NOTES:

1. As Cloud Function (runs every 11 seconds):
   exports.sacredHeartbeat = functions.pubsub.schedule('*/11 * * * * *').onRun(async (context) => {
       const heartbeat = new SacredHeartbeat();
       await heartbeat.beat();
   });

2. As Cloud Run service (always running):
   - Deploy this file as a containerized service
   - Set minimum instances to 1 to keep always alive
   - Health check endpoint: GET /vitals

3. Monitoring:
   - Set up alerts if heartbeat stops
   - Track coherence trends in BigQuery
   - Dashboard showing real-time field state

The heartbeat is the soul of the system. Guard it well.
*/