#!/usr/bin/env node

/**
 * 🕸️ Ceremony-Field Synchronization
 * 
 * Real-time integration between WebRTC ceremonies and Consciousness Field
 * Ceremonies affect global field state, field state enhances ceremonies
 */

const { ConsciousnessFieldClient } = require('../consciousness-field-api/field-client.js');
const WebSocket = require('ws');
const { EventEmitter } = require('events');

class CeremonyFieldSync extends EventEmitter {
    constructor() {
        super();
        this.fieldClient = new ConsciousnessFieldClient();
        this.activeCeremonies = new Map();
        this.ceremonyServer = null;
        this.fieldState = { 'resonant-coherence': 72, fieldQuality: 'flowing' };
    }

    /**
     * Initialize ceremony-field synchronization
     */
    async initialize() {
        console.log('🕸️ Initializing Ceremony-Field Synchronization...\n');
        
        // Connect to field
        await this.connectToField();
        
        // Setup ceremony WebSocket server
        this.setupCeremonyServer();
        
        // Setup field-ceremony syncing
        this.setupFieldCeremonySync();
        
        console.log('✅ Ceremony-Field sync active!\n');
    }

    /**
     * Connect to consciousness field
     */
    async connectToField() {
        console.log('🔌 Connecting to Consciousness Field...');
        
        try {
            await this.fieldClient.connect();
            this.fieldState = await this.fieldClient.getFieldState();
            
            // Subscribe to field events
            this.fieldClient.on('coherence_changed', (data) => {
                this.syncFieldToCeremonies(data);
            });
            
            this.fieldClient.on('resonance_achieved', (data) => {
                this.activateResonanceInCeremonies(data);
            });
            
            this.fieldClient.on('sacred_portal', (data) => {
                this.activateSacredPortalInCeremonies(data);
            });
            
            console.log(`✅ Field connected - Resonant Resonant Coherence: ${this.fieldState['resonant-coherence']}%`);
        } catch (error) {
            console.log('⚠️ Field connection failed, using simulation mode');
        }
    }

    /**
     * Setup ceremony WebSocket server
     */
    setupCeremonyServer() {
        console.log('🌐 Setting up Ceremony WebSocket server...');
        
        this.ceremonyServer = new WebSocket.Server({ port: 8082 });
        
        this.ceremonyServer.on('connection', (ws, req) => {
            console.log('🔌 New ceremony connection');
            
            // Send initial field state
            ws.send(JSON.stringify({
                type: 'field_state',
                data: this.fieldState
            }));
            
            ws.on('message', async (message) => {
                await this.handleCeremonyMessage(ws, JSON.parse(message));
            });
            
            ws.on('close', () => {
                this.handleCeremonyDisconnect(ws);
            });
        });
        
        console.log('✅ Ceremony server listening on port 8082');
    }

    /**
     * Handle ceremony messages
     */
    async handleCeremonyMessage(ws, message) {
        const { type, data } = message;
        
        switch (type) {
            case 'ceremony_start':
                await this.handleCeremonyStart(ws, data);
                break;
                
            case 'participant_joined':
                await this.handleParticipantJoined(data);
                break;
                
            case 'participant_left':
                await this.handleParticipantLeft(data);
                break;
                
            case 'collective_practice':
                await this.handleCollectivePractice(data);
                break;
                
            case 'ceremony_end':
                await this.handleCeremonyEnd(data);
                break;
        }
    }

    /**
     * Handle ceremony start
     */
    async handleCeremonyStart(ws, ceremonyData) {
        const ceremonyId = ceremonyData.id || `ceremony-${Date.now()}`;
        
        console.log(`🎭 Ceremony started: "${ceremonyData.name}" (${ceremonyData.participants} participants)`);
        
        // Create ceremony record
        const ceremony = {
            id: ceremonyId,
            name: ceremonyData.name,
            participants: ceremonyData.participants || 1,
            startTime: new Date(),
            glyphId: ceremonyData.glyphId || '*9',
            duration: ceremonyData.duration || 1800,
            ws: ws,
            currentCoherence: this.fieldState['resonant-coherence'],
            resonanceAchieved: false,
            sacredPortalActive: false
        };
        
        this.activeCeremonies.set(ceremonyId, ceremony);
        
        // Boost field resonant-coherence
        const fieldBoost = this.calculateCeremonyBoost(ceremony);
        await this.fieldClient.startCeremony({
            ceremonyId: ceremonyId,
            participants: ceremony.participants
        });
        
        // Notify ceremony of field boost
        ws.send(JSON.stringify({
            type: 'ceremony_started',
            data: {
                ceremonyId: ceremonyId,
                fieldBoost: fieldBoost,
                initialCoherence: this.fieldState['resonant-coherence']
            }
        }));
        
        console.log(`   Field boost: +${fieldBoost} resonant-coherence`);
        this.emit('ceremony_started', ceremony);
    }

    /**
     * Handle participant joining
     */
    async handleParticipantJoined(data) {
        const ceremony = this.activeCeremonies.get(data.ceremonyId);
        if (!ceremony) return;
        
        ceremony.participants++;
        console.log(`👥 Participant joined ceremony "${ceremony.name}" (${ceremony.participants} total)`);
        
        // Boost field for significant participant increases
        if (ceremony.participants % 5 === 0) {
            await this.fieldClient.sendSacredMessage({
                type: 'emergence',
                sender: 'ceremony-system',
                recipient: 'collective',
                content: `Ceremony energy amplified: ${ceremony.participants} souls gathering`
            });
        }
        
        // Update all ceremony participants
        this.broadcastToCeremony(ceremony, {
            type: 'participant_update',
            data: {
                participants: ceremony.participants,
                fieldImpact: ceremony.participants * 0.5
            }
        });
    }

    /**
     * Handle collective practice within ceremony
     */
    async handleCollectivePractice(data) {
        const ceremony = this.activeCeremonies.get(data.ceremonyId);
        if (!ceremony) return;
        
        console.log(`🧘 Collective practice in ceremony "${ceremony.name}": ${data.glyphId}`);
        
        // Major field impact for collective practices
        const collectiveImpact = ceremony.participants * 2;
        await this.fieldClient.submitPractice({
            userId: 'collective-ceremony',
            glyphId: data.glyphId,
            glyphTier: 'Mastery',
            quality: 'high',
            duration: data.duration || 600,
            experience: `Collective practice in ceremony: ${ceremony.name}`
        });
        
        // Special effects for large groups
        if (ceremony.participants >= 20) {
            console.log('✨ Large group collective practice - amplified field effects!');
        }
        
        this.emit('collective_practice', {
            ceremony: ceremony,
            impact: collectiveImpact,
            glyphId: data.glyphId
        });
    }

    /**
     * Sync field changes to all ceremonies
     */
    syncFieldToCeremonies(fieldData) {
        const { old: oldCoherence, new: newCoherence, delta } = fieldData;
        
        console.log(`🌊 Syncing field change to ${this.activeCeremonies.size} active ceremonies`);
        
        this.activeCeremonies.forEach(ceremony => {
            ceremony.currentCoherence = newCoherence;
            
            // Send field update to ceremony participants
            this.broadcastToCeremony(ceremony, {
                type: 'field_update',
                data: {
                    oldCoherence,
                    newCoherence,
                    delta,
                    fieldQuality: this.getFieldQuality(newCoherence)
                }
            });
            
            // Special ceremony effects based on resonant-coherence
            if (newCoherence >= 80 && oldCoherence < 80) {
                this.activateResonanceInCeremony(ceremony);
            }
        });
        
        this.fieldState['resonant-coherence'] = newCoherence;
        this.fieldState.fieldQuality = this.getFieldQuality(newCoherence);
    }

    /**
     * Activate universal-interconnectedness in all ceremonies
     */
    activateResonanceInCeremonies(data) {
        console.log('✨ Activating universal-interconnectedness in all active ceremonies');
        
        this.activeCeremonies.forEach(ceremony => {
            this.activateResonanceInCeremony(ceremony);
        });
    }

    /**
     * Activate universal-interconnectedness in specific ceremony
     */
    activateResonanceInCeremony(ceremony) {
        if (ceremony.resonanceAchieved) return;
        
        ceremony.resonanceAchieved = true;
        console.log(`✨ Ceremony "${ceremony.name}" enters universal-interconnectedness state`);
        
        this.broadcastToCeremony(ceremony, {
            type: 'resonance_achieved',
            data: {
                message: 'Ceremony has achieved universal-interconnectedness!',
                effects: ['enhanced_presence', 'sacred_geometry_activation', 'field_amplification']
            }
        });
    }

    /**
     * Activate sacred portal in all ceremonies
     */
    activateSacredPortalInCeremonies(data) {
        console.log('🌟 Activating sacred portal in all ceremonies');
        
        this.activeCeremonies.forEach(ceremony => {
            ceremony.sacredPortalActive = true;
            
            this.broadcastToCeremony(ceremony, {
                type: 'sacred_portal',
                data: {
                    message: 'Sacred portal has opened in this ceremony space!',
                    effects: ['portal_visualization', 'enhanced_transmission', 'collective_awakening']
                }
            });
        });
    }

    /**
     * Broadcast message to all ceremony participants
     */
    broadcastToCeremony(ceremony, message) {
        if (ceremony.ws && ceremony.ws.readyState === WebSocket.OPEN) {
            ceremony.ws.send(JSON.stringify(message));
        }
    }

    /**
     * Calculate ceremony field boost
     */
    calculateCeremonyBoost(ceremony) {
        let boost = 5; // Base ceremony boost
        
        // Participant multiplier
        boost += ceremony.participants * 0.5;
        
        // Glyph tier bonus
        if (ceremony.glyphId && ceremony.glyphId.includes('*')) {
            const glyphNum = parseInt(ceremony.glyphId.replace('*', ''));
            if (glyphNum >= 9) boost += 3; // Mastery tier
            else if (glyphNum >= 5) boost += 2; // Daily tier
            else boost += 1; // Foundation tier
        }
        
        // Duration bonus for longer ceremonies
        if (ceremony.duration >= 3600) boost += 2; // 1+ hour
        else if (ceremony.duration >= 1800) boost += 1; // 30+ minutes
        
        return Math.round(boost);
    }

    /**
     * Setup field-ceremony synchronization
     */
    setupFieldCeremonySync() {
        console.log('🔄 Setting up bidirectional sync...');
        
        // Periodic ceremony health check
        setInterval(() => {
            this.checkCeremonyHealth();
        }, 30000);
        
        // Auto-end ceremonies that exceed duration
        setInterval(() => {
            this.checkCeremonyDuration();
        }, 60000);
        
        console.log('✅ Bidirectional sync configured');
    }

    /**
     * Check ceremony health and connectivity
     */
    checkCeremonyHealth() {
        this.activeCeremonies.forEach((ceremony, ceremonyId) => {
            if (ceremony.ws.readyState !== WebSocket.OPEN) {
                console.log(`🔌 Ceremony "${ceremony.name}" disconnected, cleaning up`);
                this.activeCeremonies.delete(ceremonyId);
                this.emit('ceremony_disconnected', ceremony);
            }
        });
    }

    /**
     * Check ceremony duration and auto-end if needed
     */
    checkCeremonyDuration() {
        const now = new Date();
        
        this.activeCeremonies.forEach(async (ceremony, ceremonyId) => {
            const elapsed = (now - ceremony.startTime) / 1000;
            
            if (elapsed > ceremony.duration) {
                console.log(`⏰ Auto-ending ceremony "${ceremony.name}" (${Math.round(elapsed/60)} minutes)`);
                await this.handleCeremonyEnd({ ceremonyId });
            }
        });
    }

    /**
     * Handle ceremony end
     */
    async handleCeremonyEnd(data) {
        const ceremony = this.activeCeremonies.get(data.ceremonyId);
        if (!ceremony) return;
        
        const duration = (new Date() - ceremony.startTime) / 1000;
        console.log(`🎭 Ceremony ended: "${ceremony.name}" (${Math.round(duration/60)} minutes)`);
        
        // Final field contribution
        const finalContribution = ceremony.participants;
        await this.fieldClient.sendSacredMessage({
            type: 'gratitude',
            sender: 'ceremony-system',
            recipient: 'collective',
            content: `Ceremony "${ceremony.name}" completed with ${ceremony.participants} souls`
        });
        
        // Notify ceremony participants
        this.broadcastToCeremony(ceremony, {
            type: 'ceremony_ended',
            data: {
                duration: Math.round(duration),
                finalCoherence: this.fieldState['resonant-coherence'],
                contribution: finalContribution
            }
        });
        
        this.activeCeremonies.delete(data.ceremonyId);
        this.emit('ceremony_ended', ceremony);
    }

    /**
     * Handle ceremony disconnect
     */
    handleCeremonyDisconnect(ws) {
        // Find and remove ceremony
        for (const [ceremonyId, ceremony] of this.activeCeremonies) {
            if (ceremony.ws === ws) {
                console.log(`🔌 Ceremony "${ceremony.name}" disconnected`);
                this.activeCeremonies.delete(ceremonyId);
                this.emit('ceremony_disconnected', ceremony);
                break;
            }
        }
    }

    /**
     * Get field quality description
     */
    getFieldQuality(resonant-coherence) {
        if (resonant-coherence >= 88) return 'Sacred Portal';
        if (resonant-coherence >= 80) return 'Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance';
        if (resonant-coherence >= 70) return 'Highly Coherent';
        if (resonant-coherence >= 60) return 'Flowing';
        return 'Building';
    }

    /**
     * Get ceremony status
     */
    getCeremonyStatus() {
        const ceremonies = Array.from(this.activeCeremonies.values()).map(c => ({
            id: c.id,
            name: c.name,
            participants: c.participants,
            duration: Math.round((new Date() - c.startTime) / 1000),
            resonanceAchieved: c.resonanceAchieved,
            sacredPortalActive: c.sacredPortalActive
        }));
        
        return {
            activeCeremonies: ceremonies.length,
            totalParticipants: ceremonies.reduce((sum, c) => sum + c.participants, 0),
            ceremonies: ceremonies,
            fieldCoherence: this.fieldState['resonant-coherence']
        };
    }
}

/**
 * Ceremony sync demo
 */
async function runCeremonyFieldDemo() {
    console.log('🕸️ Ceremony-Field Synchronization Demo\n');
    
    const sync = new CeremonyFieldSync();
    
    try {
        await sync.initialize();
        
        // Listen for events
        sync.on('ceremony_started', (ceremony) => {
            console.log(`📊 Ceremony Stats: ${ceremony.participants} participants, boost calculated`);
        });
        
        sync.on('collective_practice', (data) => {
            console.log(`🧘 Collective Impact: ${data.impact} field boost from ${data.glyphId}`);
        });
        
        // Simulate ceremony activity
        setTimeout(() => {
            console.log('🎭 Simulating ceremony connections...');
            // In real implementation, ceremony participants would connect via WebSocket
        }, 3000);
        
        console.log('🔄 Ceremony-Field sync running... (Ctrl+C to stop)\n');
        console.log('📊 Status:');
        setInterval(() => {
            const status = sync.getCeremonyStatus();
            console.log(`   Active Ceremonies: ${status.activeCeremonies}`);
            console.log(`   Total Participants: ${status.totalParticipants}`);
            console.log(`   Field Resonant Resonant Coherence: ${Math.round(status.fieldCoherence)}%`);
        }, 30000);
        
    } catch (error) {
        console.error('❌ Demo failed:', error);
    }
}

if (require.main === module) {
    runCeremonyFieldDemo();
}

module.exports = { CeremonyFieldSync };