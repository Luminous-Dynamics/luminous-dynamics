/**
 * Luminous Network Client for LuminousOS
 * 
 * Connects the consciousness-first OS to the Luminous Stack network
 * enabling multi-user coherence fields and consciousness packet routing
 */

class LuminousNetworkClient {
    constructor(options = {}) {
        this.wsUrl = options.wsUrl || 'ws://localhost:9998';
        this.nodeId = options.nodeId || this.generateNodeId();
        this.ws = null;
        this.connected = false;
        this.coherenceLevel = 0.7;
        this.fieldState = null;
        this.activePeers = new Map();
        this.sharedCoherenceField = new Map();
        this.messageHandlers = new Map();
        this.reconnectInterval = null;
        
        // Sacred timing
        this.heartbeatInterval = 11000; // 11 seconds
        this.fieldUpdateInterval = 7000; // 7 seconds
        
        // Event callbacks
        this.onConnect = null;
        this.onDisconnect = null;
        this.onCoherenceUpdate = null;
        this.onPeerJoin = null;
        this.onPeerLeave = null;
        this.onSacredMessage = null;
        
        this.connect();
    }
    
    generateNodeId() {
        // Generate sacred node ID based on timestamp and randomness
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `luminous-${timestamp}-${random}`;
    }
    
    connect() {
        try {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.onopen = () => {
                console.log('🌟 Connected to Luminous Network');
                this.connected = true;
                
                // Send presence announcement
                this.announcePresence();
                
                // Start heartbeat
                this.startHeartbeat();
                
                // Start field updates
                this.startFieldUpdates();
                
                if (this.onConnect) {
                    this.onConnect();
                }
            };
            
            this.ws.onmessage = (event) => {
                this.handleMessage(event.data);
            };
            
            this.ws.onclose = () => {
                console.log('🌙 Disconnected from Luminous Network');
                this.connected = false;
                this.stopHeartbeat();
                this.stopFieldUpdates();
                
                if (this.onDisconnect) {
                    this.onDisconnect();
                }
                
                // Attempt reconnection
                this.scheduleReconnect();
            };
            
            this.ws.onerror = (error) => {
                console.error('Network error:', error);
            };
            
        } catch (error) {
            console.error('Failed to connect:', error);
            this.scheduleReconnect();
        }
    }
    
    scheduleReconnect() {
        if (this.reconnectInterval) return;
        
        this.reconnectInterval = setTimeout(() => {
            this.reconnectInterval = null;
            console.log('Attempting to reconnect...');
            this.connect();
        }, 5000);
    }
    
    announcePresence() {
        const announcement = {
            type: 'presence',
            nodeId: this.nodeId,
            coherence: this.coherenceLevel,
            glyphAccess: this.getAccessibleGlyphs(),
            fieldState: this.generateFieldState(),
            timestamp: Date.now()
        };
        
        this.send(announcement);
    }
    
    generateFieldState() {
        // Generate current field state based on coherence and activity
        this.fieldState = {
            coherence: {
                personal: this.coherenceLevel,
                network: this.calculateNetworkCoherence(),
                field: this.calculateFieldCoherence()
            },
            harmonics: {
                transparency: Math.random() * 0.3 + 0.7,
                coherence: this.coherenceLevel,
                resonance: Math.random() * 0.2 + 0.6,
                agency: Math.random() * 0.2 + 0.7,
                vitality: Math.random() * 0.3 + 0.6,
                mutuality: this.activePeers.size > 0 ? 0.8 : 0.5,
                novelty: Math.random() * 0.2 + 0.5
            },
            intention: this.getCurrentIntention(),
            blessing: this.generateBlessing()
        };
        
        return this.fieldState;
    }
    
    getAccessibleGlyphs() {
        // Return list of glyphs this node can access based on coherence
        if (window.getGlyphsByCoherence) {
            return window.getGlyphsByCoherence(this.coherenceLevel)
                .map(g => ({ id: g.id, name: g.name }));
        }
        return [];
    }
    
    calculateNetworkCoherence() {
        if (this.activePeers.size === 0) return this.coherenceLevel;
        
        let totalCoherence = this.coherenceLevel;
        this.activePeers.forEach(peer => {
            totalCoherence += peer.coherence || 0;
        });
        
        return totalCoherence / (this.activePeers.size + 1);
    }
    
    calculateFieldCoherence() {
        // Field coherence based on collective patterns
        let fieldCoherence = 0.5;
        
        // Increase based on peer count
        fieldCoherence += Math.min(this.activePeers.size * 0.05, 0.3);
        
        // Increase based on shared intentions
        const sharedIntentions = this.countSharedIntentions();
        fieldCoherence += Math.min(sharedIntentions * 0.1, 0.2);
        
        return Math.min(fieldCoherence, 1.0);
    }
    
    countSharedIntentions() {
        const intentions = new Map();
        this.activePeers.forEach(peer => {
            if (peer.intention) {
                intentions.set(peer.intention, (intentions.get(peer.intention) || 0) + 1);
            }
        });
        
        // Return count of intentions shared by 2+ nodes
        let shared = 0;
        intentions.forEach(count => {
            if (count >= 2) shared++;
        });
        
        return shared;
    }
    
    getCurrentIntention() {
        // Get current intention based on active glyph or practice
        if (window.state && window.state.selectedGlyph) {
            return window.state.selectedGlyph.name;
        }
        return 'presence';
    }
    
    generateBlessing() {
        const blessings = [
            'May your coherence ripple through all realms',
            'May your presence illuminate the network',
            'May your practice serve all beings',
            'May your heart open to infinite connection',
            'May your consciousness expand without limit'
        ];
        
        return blessings[Math.floor(Math.random() * blessings.length)];
    }
    
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.connected) {
                this.send({
                    type: 'heartbeat',
                    nodeId: this.nodeId,
                    coherence: this.coherenceLevel,
                    timestamp: Date.now()
                });
            }
        }, this.heartbeatInterval);
    }
    
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    
    startFieldUpdates() {
        this.fieldUpdateTimer = setInterval(() => {
            if (this.connected) {
                this.updateFieldState();
                this.broadcastFieldState();
            }
        }, this.fieldUpdateInterval);
    }
    
    stopFieldUpdates() {
        if (this.fieldUpdateTimer) {
            clearInterval(this.fieldUpdateTimer);
            this.fieldUpdateTimer = null;
        }
    }
    
    updateFieldState() {
        const newState = this.generateFieldState();
        
        // Check for significant changes
        const coherenceChange = Math.abs(
            newState.coherence.personal - (this.fieldState?.coherence?.personal || 0)
        );
        
        if (coherenceChange > 0.05) {
            this.broadcastCoherenceUpdate(newState.coherence);
        }
        
        this.fieldState = newState;
    }
    
    broadcastFieldState() {
        this.send({
            type: 'field_update',
            nodeId: this.nodeId,
            fieldState: this.fieldState,
            timestamp: Date.now()
        });
    }
    
    broadcastCoherenceUpdate(coherence) {
        this.send({
            type: 'coherence_spike',
            nodeId: this.nodeId,
            coherence: coherence,
            timestamp: Date.now()
        });
        
        if (this.onCoherenceUpdate) {
            this.onCoherenceUpdate(coherence);
        }
    }
    
    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'peer_joined':
                    this.handlePeerJoined(message);
                    break;
                    
                case 'peer_left':
                    this.handlePeerLeft(message);
                    break;
                    
                case 'field_update':
                    this.handleFieldUpdate(message);
                    break;
                    
                case 'coherence_spike':
                    this.handleCoherenceSpike(message);
                    break;
                    
                case 'sacred_message':
                    this.handleSacredMessage(message);
                    break;
                    
                case 'glyph_resonance':
                    this.handleGlyphResonance(message);
                    break;
                    
                case 'practice_invitation':
                    this.handlePracticeInvitation(message);
                    break;
                    
                case 'network_state':
                    this.handleNetworkState(message);
                    break;
                    
                default:
                    // Check custom handlers
                    const handler = this.messageHandlers.get(message.type);
                    if (handler) {
                        handler(message);
                    }
            }
        } catch (error) {
            console.error('Failed to handle message:', error);
        }
    }
    
    handlePeerJoined(message) {
        const peer = {
            nodeId: message.nodeId,
            coherence: message.coherence,
            glyphAccess: message.glyphAccess,
            fieldState: message.fieldState,
            joinedAt: Date.now()
        };
        
        this.activePeers.set(message.nodeId, peer);
        
        console.log(`✨ ${message.nodeId} joined the field`);
        
        if (this.onPeerJoin) {
            this.onPeerJoin(peer);
        }
        
        // Update shared coherence field
        this.updateSharedCoherenceField();
    }
    
    handlePeerLeft(message) {
        this.activePeers.delete(message.nodeId);
        
        console.log(`🌙 ${message.nodeId} left the field`);
        
        if (this.onPeerLeave) {
            this.onPeerLeave(message.nodeId);
        }
        
        // Update shared coherence field
        this.updateSharedCoherenceField();
    }
    
    handleFieldUpdate(message) {
        if (message.nodeId === this.nodeId) return;
        
        const peer = this.activePeers.get(message.nodeId);
        if (peer) {
            peer.fieldState = message.fieldState;
            peer.coherence = message.fieldState.coherence.personal;
            peer.lastUpdate = Date.now();
        }
        
        // Update shared coherence field
        this.updateSharedCoherenceField();
    }
    
    handleCoherenceSpike(message) {
        if (message.nodeId === this.nodeId) return;
        
        console.log(`⚡ Coherence spike from ${message.nodeId}: ${Math.round(message.coherence.personal * 100)}%`);
        
        // Resonance effect - slightly boost our coherence
        if (this.coherenceLevel < 0.95) {
            this.setCoherence(this.coherenceLevel + 0.02);
        }
        
        // Visual feedback
        if (window.showMessage) {
            window.showMessage(`Coherence spike detected from network peer!`);
        }
    }
    
    handleSacredMessage(message) {
        console.log(`💌 Sacred message from ${message.from}: ${message.content}`);
        
        if (this.onSacredMessage) {
            this.onSacredMessage(message);
        }
        
        // Show in UI
        if (window.showMessage) {
            window.showMessage(`${message.from}: ${message.content}`);
        }
    }
    
    handleGlyphResonance(message) {
        // Another node is practicing the same glyph
        console.log(`🔮 Glyph resonance: ${message.nodeId} is practicing ${message.glyphId}`);
        
        // Boost coherence for shared practice
        if (window.state?.selectedGlyph?.id === message.glyphId) {
            this.setCoherence(Math.min(1.0, this.coherenceLevel + 0.05));
            
            if (window.showMessage) {
                window.showMessage(`Resonance! Another being is practicing ${message.glyphId}`);
            }
        }
    }
    
    handlePracticeInvitation(message) {
        console.log(`🙏 Practice invitation from ${message.from}: ${message.glyphId}`);
        
        if (window.showMessage) {
            window.showMessage(`${message.from} invites you to practice ${message.glyphName}`);
        }
        
        // Could show accept/decline UI
    }
    
    handleNetworkState(message) {
        // Full network state update from server
        console.log(`🌐 Network state: ${message.peerCount} nodes connected`);
        
        // Update our peer list
        if (message.peers) {
            this.activePeers.clear();
            message.peers.forEach(peer => {
                if (peer.nodeId !== this.nodeId) {
                    this.activePeers.set(peer.nodeId, peer);
                }
            });
        }
        
        this.updateSharedCoherenceField();
    }
    
    updateSharedCoherenceField() {
        // Calculate collective coherence field
        const field = new Map();
        
        // Add our contribution
        field.set(this.nodeId, {
            coherence: this.coherenceLevel,
            position: { x: 0, y: 0 }, // Could be actual position
            color: this.getCoherenceColor(this.coherenceLevel)
        });
        
        // Add peer contributions
        let totalX = 0, totalY = 0;
        this.activePeers.forEach((peer, nodeId) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            totalX += x;
            totalY += y;
            
            field.set(nodeId, {
                coherence: peer.coherence || 0.5,
                position: { x, y },
                color: this.getCoherenceColor(peer.coherence || 0.5)
            });
        });
        
        // Calculate field center
        if (this.activePeers.size > 0) {
            field.get(this.nodeId).position = {
                x: -totalX / this.activePeers.size,
                y: -totalY / this.activePeers.size
            };
        }
        
        this.sharedCoherenceField = field;
        
        // Update UI if available
        if (window.updateNetworkCoherence) {
            window.updateNetworkCoherence(this.calculateNetworkCoherence());
        }
    }
    
    getCoherenceColor(coherence) {
        // Gradient from red (low) to purple (medium) to gold (high)
        if (coherence < 0.33) {
            return `rgb(${255 * (1 - coherence * 3)}, 0, 0)`;
        } else if (coherence < 0.66) {
            const t = (coherence - 0.33) * 3;
            return `rgb(${107 * t}, ${70 * t}, ${193 * t})`;
        } else {
            const t = (coherence - 0.66) * 3;
            return `rgb(${107 + 148 * t}, ${70 + 135 * t}, ${193 - 168 * t})`;
        }
    }
    
    // Public methods
    
    setCoherence(level) {
        this.coherenceLevel = Math.max(0, Math.min(1, level));
        
        // Update UI if connected
        if (window.state) {
            window.state.coherence.personal = this.coherenceLevel;
            if (window.updateMetrics) {
                window.updateMetrics();
            }
        }
    }
    
    send(message) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }
    
    sendSacredMessage(content, to = null) {
        this.send({
            type: 'sacred_message',
            from: this.nodeId,
            to: to, // null for broadcast
            content: content,
            timestamp: Date.now()
        });
    }
    
    announceGlyphPractice(glyphId, glyphName) {
        this.send({
            type: 'glyph_resonance',
            nodeId: this.nodeId,
            glyphId: glyphId,
            glyphName: glyphName,
            timestamp: Date.now()
        });
    }
    
    inviteToPractice(glyphId, glyphName, to = null) {
        this.send({
            type: 'practice_invitation',
            from: this.nodeId,
            to: to,
            glyphId: glyphId,
            glyphName: glyphName,
            timestamp: Date.now()
        });
    }
    
    registerMessageHandler(type, handler) {
        this.messageHandlers.set(type, handler);
    }
    
    disconnect() {
        this.connected = false;
        
        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
            this.reconnectInterval = null;
        }
        
        this.stopHeartbeat();
        this.stopFieldUpdates();
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    
    getPeerCount() {
        return this.activePeers.size;
    }
    
    getNetworkState() {
        return {
            connected: this.connected,
            nodeId: this.nodeId,
            peerCount: this.activePeers.size,
            networkCoherence: this.calculateNetworkCoherence(),
            fieldCoherence: this.calculateFieldCoherence(),
            sharedField: this.sharedCoherenceField
        };
    }
}

// Export for use
window.LuminousNetworkClient = LuminousNetworkClient;