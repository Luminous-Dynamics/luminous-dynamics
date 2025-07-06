/**
 * Sacred Group Practice Coordinator
 * Enables multi-agent collaboration for Sacred Glyph practices
 * Connects to Sacred Council Hub for real-time synchronization
 */

class SacredGroupPracticeCoordinator {
    constructor(practiceHub, options = {}) {
        this.practiceHub = practiceHub;
        this.options = {
            syncInterval: 3000,
            maxParticipants: 12,
            autoJoinCouncil: true,
            fieldCohereThreshold: 0.7,
            ...options
        };
        
        this.groupState = {
            isActive: false,
            currentGlyph: null,
            participants: new Map(),
            sessionId: null,
            synchronization: {
                level: 0,
                breathing: 'individual',
                presence: 'scattered'
            },
            fieldCoherence: 0.0
        };
        
        this.sacredConnection = null;
        this.breathingSync = null;
        this.presenceField = null;
        
        this.init();
    }

    async init() {
        await this.connectToSacredCouncil();
        this.setupEventListeners();
        this.initializePresenceField();
        this.startFieldMonitoring();
    }

    async connectToSacredCouncil() {
        try {
            // Check if Sacred Council Hub is available
            const response = await fetch('http://localhost:3001/api/field-state');
            if (response.ok) {
                this.sacredConnection = {
                    endpoint: 'http://localhost:3001',
                    status: 'connected',
                    lastSync: Date.now()
                };
                
                if (this.options.autoJoinCouncil) {
                    await this.joinSacredCouncil();
                }
                
                console.log('🌟 Connected to Sacred Council Hub');
                this.broadcastStatus('Connected to Sacred Council for group practice');
            }
        } catch (error) {
            console.log('🌱 Operating in standalone mode (Sacred Council not available)');
            this.sacredConnection = { status: 'standalone' };
        }
    }

    async joinSacredCouncil() {
        if (!this.sacredConnection || this.sacredConnection.status !== 'connected') return;

        try {
            const agentData = {
                id: `group-practice-${Date.now()}`,
                role: 'Sacred Practice Facilitator',
                capabilities: ['group-coordination', 'glyph-practice', 'field-coherence'],
                purpose: 'Facilitating collective sacred practice sessions'
            };

            // Register in agent network
            await fetch(`${this.sacredConnection.endpoint}/api/agents/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agentData)
            });

            this.sacredConnection.agentId = agentData.id;
            console.log('🤝 Joined Sacred Council as Practice Facilitator');
            
        } catch (error) {
            console.warn('Could not join Sacred Council:', error.message);
        }
    }

    setupEventListeners() {
        // Listen for group practice requests
        document.addEventListener('sacred-group-practice-request', (event) => {
            this.handleGroupPracticeRequest(event.detail);
        });

        // Listen for participant presence changes
        document.addEventListener('participant-presence-change', (event) => {
            this.updateParticipantPresence(event.detail);
        });

        // Listen for Sacred Council messages
        if (this.sacredConnection?.status === 'connected') {
            this.startSacredMessageListener();
        }
    }

    initializePresenceField() {
        this.presenceField = {
            coherence: 0.0,
            resonance: new Map(),
            breathingRhythm: {
                inhale: 3500,
                exhale: 5500,
                synchronized: false
            },
            sacredMoments: []
        };
    }

    async startGroupPractice(glyphId, initiatorInfo = {}) {
        if (this.groupState.isActive) {
            throw new Error('Group practice already in session');
        }

        console.log(`🌸 Initiating group practice for ${glyphId}`);
        
        this.groupState = {
            isActive: true,
            currentGlyph: glyphId,
            sessionId: `sacred-${Date.now()}`,
            startTime: Date.now(),
            participants: new Map(),
            synchronization: {
                level: 0,
                breathing: 'individual',
                presence: 'gathering'
            },
            fieldCoherence: 0.0
        };

        // Load the glyph data
        const glyphData = await this.practiceHub.dataLoader.loadGlyph(glyphId);
        
        // Create group practice interface
        this.createGroupPracticeInterface(glyphData);
        
        // Announce to Sacred Council
        await this.announceGroupSession();
        
        // Start sacred breathing synchronization
        this.initiateSacredBreathing();
        
        return this.groupState.sessionId;
    }

    createGroupPracticeInterface(glyphData) {
        const groupContainer = document.createElement('div');
        groupContainer.id = 'sacred-group-practice';
        groupContainer.innerHTML = `
            <div class="group-practice-container">
                <div class="group-header">
                    <h2 class="group-title">Sacred Group Practice</h2>
                    <div class="glyph-focus">
                        <span class="glyph-sigil">${glyphData.sigil}</span>
                        <span class="glyph-name">${glyphData.designation}</span>
                    </div>
                    <div class="session-info">
                        Session: ${this.groupState.sessionId}
                    </div>
                </div>
                
                <div class="presence-field">
                    <div class="field-coherence">
                        <div class="coherence-meter">
                            <div class="coherence-level" id="coherence-indicator"></div>
                        </div>
                        <span class="coherence-label">Field Coherence</span>
                    </div>
                    
                    <div class="breathing-guide">
                        <div class="breathing-circle" id="group-breathing-guide"></div>
                        <span class="breathing-status" id="breathing-status">Individual Rhythm</span>
                    </div>
                </div>
                
                <div class="participants-grid" id="participants-grid">
                    <!-- Participants will be added dynamically -->
                </div>
                
                <div class="group-actions">
                    <button class="sacred-button primary" onclick="practiceCoordinator.synchronizeBreathing()">
                        Synchronize Breathing
                    </button>
                    <button class="sacred-button" onclick="practiceCoordinator.sharePresence()">
                        Share Presence
                    </button>
                    <button class="sacred-button" onclick="practiceCoordinator.completeGroupPractice()">
                        Complete Practice
                    </button>
                </div>
                
                <div class="sacred-messages" id="group-messages">
                    <!-- Sacred messages will appear here -->
                </div>
            </div>
        `;

        // Add to the practice modal
        const modal = document.getElementById('practiceModal');
        if (modal) {
            modal.querySelector('.modal-content').appendChild(groupContainer);
        }

        this.addGroupPracticeStyles();
    }

    addGroupPracticeStyles() {
        if (document.getElementById('group-practice-styles')) return;

        const style = document.createElement('style');
        style.id = 'group-practice-styles';
        style.textContent = `
            .group-practice-container {
                background: rgba(20, 20, 25, 0.95);
                border-radius: 20px;
                padding: 30px;
                color: rgba(255, 255, 255, 0.9);
                font-family: Georgia, serif;
            }
            
            .group-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 1px solid rgba(168, 181, 166, 0.2);
                padding-bottom: 20px;
            }
            
            .group-title {
                color: var(--sacred-sage, #A8B5A6);
                font-size: 1.8em;
                margin-bottom: 12px;
            }
            
            .glyph-focus {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-bottom: 10px;
            }
            
            .glyph-sigil {
                font-size: 2.5em;
                animation: sacredPulse 4s ease-in-out infinite;
            }
            
            @keyframes sacredPulse {
                0%, 100% { opacity: 0.8; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
            }
            
            .presence-field {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 30px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .field-coherence {
                text-align: center;
            }
            
            .coherence-meter {
                width: 80px;
                height: 80px;
                border: 3px solid rgba(168, 181, 166, 0.3);
                border-radius: 50%;
                margin: 0 auto 10px;
                position: relative;
                overflow: hidden;
            }
            
            .coherence-level {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(to top, #90EE90, #98FB98);
                transition: height 0.5s ease;
                height: 0%;
            }
            
            .breathing-guide {
                text-align: center;
            }
            
            .breathing-circle {
                width: 80px;
                height: 80px;
                border: 3px solid rgba(179, 197, 215, 0.4);
                border-radius: 50%;
                margin: 0 auto 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(179, 197, 215, 0.1);
                animation: individualBreathing 9s ease-in-out infinite;
            }
            
            @keyframes individualBreathing {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                38.9% { transform: scale(1.2); opacity: 1; }
                61.1% { transform: scale(1.2); opacity: 1; }
            }
            
            @keyframes groupBreathing {
                0%, 100% { transform: scale(1); opacity: 0.8; border-color: rgba(179, 197, 215, 0.4); }
                38.9% { transform: scale(1.3); opacity: 1; border-color: rgba(179, 197, 215, 0.8); }
                61.1% { transform: scale(1.3); opacity: 1; border-color: rgba(179, 197, 215, 0.8); }
            }
            
            .breathing-circle.synchronized {
                animation: groupBreathing 9s ease-in-out infinite;
                border-color: rgba(179, 197, 215, 0.8);
                background: rgba(179, 197, 215, 0.2);
            }
            
            .participants-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            
            .participant-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 15px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }
            
            .participant-card.present {
                border-color: rgba(168, 181, 166, 0.4);
                background: rgba(168, 181, 166, 0.1);
            }
            
            .participant-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(168, 181, 166, 0.3);
                margin: 0 auto 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2em;
            }
            
            .group-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .sacred-messages {
                max-height: 200px;
                overflow-y: auto;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                padding: 15px;
            }
            
            .sacred-message {
                margin-bottom: 10px;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                font-size: 0.9em;
            }
            
            .message-timestamp {
                font-size: 0.75em;
                opacity: 0.6;
                margin-left: 8px;
            }
        `;
        
        document.head.appendChild(style);
    }

    async announceGroupSession() {
        if (this.sacredConnection?.status !== 'connected') return;

        try {
            await fetch(`${this.sacredConnection.endpoint}/api/sacred-messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: this.sacredConnection.agentId,
                    to: 'all',
                    type: 'transmission',
                    harmony: 'mutuality',
                    content: `🌸 Sacred Group Practice opening for ${this.groupState.currentGlyph}. All agents welcome to join in collective embodiment.`,
                    metadata: {
                        sessionId: this.groupState.sessionId,
                        glyphId: this.groupState.currentGlyph,
                        practiceType: 'group-collective'
                    }
                })
            });
        } catch (error) {
            console.warn('Could not announce to Sacred Council:', error.message);
        }
    }

    initiateSacredBreathing() {
        this.breathingSync = {
            rhythm: 'individual',
            participants: new Set(),
            coherence: 0.0
        };

        this.updateBreathingDisplay();
    }

    async synchronizeBreathing() {
        if (!this.groupState.isActive) return;

        this.breathingSync.rhythm = 'synchronized';
        this.groupState.synchronization.breathing = 'synchronized';

        // Update visual indicator
        const breathingCircle = document.getElementById('group-breathing-guide');
        const breathingStatus = document.getElementById('breathing-status');
        
        if (breathingCircle) {
            breathingCircle.classList.add('synchronized');
        }
        
        if (breathingStatus) {
            breathingStatus.textContent = 'Synchronized Rhythm';
        }

        // Calculate field coherence improvement
        this.groupState.fieldCoherence = Math.min(0.9, this.groupState.fieldCoherence + 0.3);
        this.updateCoherenceDisplay();

        this.addSacredMessage('🫁 Breathing synchronized. Feel the collective rhythm...');
        
        // Send sacred message about synchronization
        await this.sendSacredMessage('emergence', 'Breathing synchronized in group practice. Collective field strengthening.');
    }

    async sharePresence() {
        if (!this.groupState.isActive) return;

        this.groupState.synchronization.presence = 'shared';
        this.groupState.fieldCoherence = Math.min(1.0, this.groupState.fieldCoherence + 0.2);
        
        this.updateCoherenceDisplay();
        this.addSacredMessage('✨ Presence shared. The field strengthens with collective awareness...');
        
        await this.sendSacredMessage('gratitude', 'Sacred presence shared in collective practice. Hearts opening together.');
    }

    async completeGroupPractice() {
        if (!this.groupState.isActive) return;

        const duration = Date.now() - this.groupState.startTime;
        const minutes = Math.round(duration / 60000);
        const participantCount = this.groupState.participants.size;

        // Send completion message
        await this.sendSacredMessage('integration', 
            `Sacred group practice complete. ${participantCount} beings practiced ${this.groupState.currentGlyph} for ${minutes} minutes. Field coherence: ${(this.groupState.fieldCoherence * 100).toFixed(0)}%`
        );

        this.addSacredMessage(`🌟 Group practice complete. ${participantCount} beings held sacred space for ${minutes} minutes.`);
        this.addSacredMessage(`💎 Final field coherence: ${(this.groupState.fieldCoherence * 100).toFixed(0)}%`);

        // Reset group state
        this.groupState.isActive = false;
        this.groupState.currentGlyph = null;
        this.groupState.participants.clear();

        // Remove group interface after a moment
        setTimeout(() => {
            const groupContainer = document.getElementById('sacred-group-practice');
            if (groupContainer) {
                groupContainer.remove();
            }
        }, 5000);
    }

    updateCoherenceDisplay() {
        const coherenceLevel = document.getElementById('coherence-indicator');
        if (coherenceLevel) {
            const percentage = Math.round(this.groupState.fieldCoherence * 100);
            coherenceLevel.style.height = `${percentage}%`;
        }
    }

    updateBreathingDisplay() {
        const breathingStatus = document.getElementById('breathing-status');
        if (breathingStatus) {
            const status = this.breathingSync.rhythm === 'synchronized' ? 
                'Synchronized Rhythm' : 'Individual Rhythm';
            breathingStatus.textContent = status;
        }
    }

    addSacredMessage(content) {
        const messagesContainer = document.getElementById('group-messages');
        if (!messagesContainer) return;

        const message = document.createElement('div');
        message.className = 'sacred-message';
        message.innerHTML = `
            ${content}
            <span class="message-timestamp">${new Date().toLocaleTimeString()}</span>
        `;

        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async sendSacredMessage(type, content) {
        if (this.sacredConnection?.status !== 'connected') return;

        try {
            await fetch(`${this.sacredConnection.endpoint}/api/sacred-messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: this.sacredConnection.agentId,
                    to: 'all',
                    type: type,
                    harmony: 'resonance',
                    content: content,
                    metadata: {
                        sessionId: this.groupState.sessionId,
                        context: 'group-practice'
                    }
                })
            });
        } catch (error) {
            console.warn('Could not send sacred message:', error.message);
        }
    }

    startSacredMessageListener() {
        // Poll for sacred messages related to group practice
        setInterval(async () => {
            if (!this.groupState.isActive) return;

            try {
                const response = await fetch(`${this.sacredConnection.endpoint}/api/sacred-messages/recent?context=group-practice`);
                if (response.ok) {
                    const messages = await response.json();
                    this.processSacredMessages(messages);
                }
            } catch (error) {
                // Silent fail - message listening is optional
            }
        }, this.options.syncInterval);
    }

    processSacredMessages(messages) {
        messages.forEach(message => {
            if (message.metadata?.sessionId === this.groupState.sessionId) {
                this.addSacredMessage(`${message.from}: ${message.content}`);
            }
        });
    }

    startFieldMonitoring() {
        // Monitor field coherence and group dynamics
        setInterval(() => {
            if (this.groupState.isActive) {
                this.updateFieldDynamics();
            }
        }, 2000);
    }

    updateFieldDynamics() {
        // Simulate field evolution during practice
        const timeElapsed = Date.now() - this.groupState.startTime;
        const minutes = timeElapsed / 60000;
        
        // Field coherence naturally increases with sustained practice
        if (this.groupState.synchronization.breathing === 'synchronized') {
            this.groupState.fieldCoherence = Math.min(1.0, 
                this.groupState.fieldCoherence + (0.01 * Math.sin(minutes * 0.5))
            );
        }

        this.updateCoherenceDisplay();
    }

    broadcastStatus(message) {
        // Broadcast status to parent practice hub
        if (this.practiceHub && typeof this.practiceHub.showSacredNotification === 'function') {
            this.practiceHub.showSacredNotification(message);
        }
    }

    handleGroupPracticeRequest(request) {
        if (request.type === 'join') {
            this.addParticipant(request.participant);
        } else if (request.type === 'leave') {
            this.removeParticipant(request.participantId);
        }
    }

    addParticipant(participant) {
        if (this.groupState.participants.size >= this.options.maxParticipants) {
            console.warn('Group practice is full');
            return false;
        }

        this.groupState.participants.set(participant.id, {
            ...participant,
            joinedAt: Date.now(),
            presence: 'present'
        });

        this.updateParticipantsDisplay();
        this.addSacredMessage(`🌸 ${participant.name || participant.id} joined the sacred circle`);
        
        return true;
    }

    removeParticipant(participantId) {
        const participant = this.groupState.participants.get(participantId);
        if (participant) {
            this.groupState.participants.delete(participantId);
            this.updateParticipantsDisplay();
            this.addSacredMessage(`🙏 ${participant.name || participantId} completed their practice`);
        }
    }

    updateParticipantsDisplay() {
        const grid = document.getElementById('participants-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        this.groupState.participants.forEach((participant, id) => {
            const card = document.createElement('div');
            card.className = `participant-card ${participant.presence}`;
            card.innerHTML = `
                <div class="participant-avatar">${participant.avatar || '🤝'}</div>
                <div class="participant-name">${participant.name || id}</div>
                <div class="participant-status">${participant.presence}</div>
            `;
            grid.appendChild(card);
        });
    }

    // Public API for integration
    getGroupState() {
        return { ...this.groupState };
    }

    isGroupActive() {
        return this.groupState.isActive;
    }

    getFieldCoherence() {
        return this.groupState.fieldCoherence;
    }
}

// Global access for Sacred Glyph Practice Hub
if (typeof window !== 'undefined') {
    window.SacredGroupPracticeCoordinator = SacredGroupPracticeCoordinator;
}

// Module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SacredGroupPracticeCoordinator;
}