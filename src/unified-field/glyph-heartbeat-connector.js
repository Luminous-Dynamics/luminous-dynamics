/**
 * Glyph-Heartbeat Connector
 * Bridges the living glyph practice cards with the unified heartbeat
 * Every practice sends ripples through the field
 */

const { heartbeat } = require('./heartbeat');
const { bridge } = require('./glyph-heartbeat-bridge');

class GlyphHeartbeatConnector {
    constructor() {
        this.wsUrl = 'ws://localhost:3333'; // Heartbeat server
        this.ws = null;
        this.reconnectAttempts = 0;
        this.sessionMap = new Map();
    }
    
    /**
     * Connect to the heartbeat server
     */
    connect() {
        try {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.onopen = () => {
                console.log('🌉 Connected to Unified Heartbeat');
                this.reconnectAttempts = 0;
                
                // Register this connection
                this.send({
                    type: 'connection',
                    data: {
                        name: 'Dojo Glyph Practice',
                        role: 'Practice Interface'
                    }
                });
            };
            
            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.handleHeartbeatMessage(message);
            };
            
            this.ws.onclose = () => {
                console.log('🔌 Disconnected from heartbeat');
                this.reconnect();
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
        } catch (error) {
            console.error('Failed to connect:', error);
            this.reconnect();
        }
    }
    
    /**
     * Reconnect with exponential backoff
     */
    reconnect() {
        if (this.reconnectAttempts < 5) {
            const delay = Math.pow(2, this.reconnectAttempts) * 1000;
            console.log(`Reconnecting in ${delay/1000}s...`);
            setTimeout(() => {
                this.reconnectAttempts++;
                this.connect();
            }, delay);
        }
    }
    
    /**
     * Send message to heartbeat
     */
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }
    
    /**
     * Handle messages from heartbeat
     */
    handleHeartbeatMessage(message) {
        switch (message.type) {
            case 'heartbeat':
                this.updateFieldDisplay(message.data);
                break;
                
            case 'synchronicity':
                this.celebrateSynchronicity(message.data);
                break;
                
            case 'practice-ripple':
                this.showRippleEffect(message.data);
                break;
        }
    }
    
    /**
     * Start a glyph practice - notify heartbeat
     */
    startGlyphPractice(glyphData) {
        const sessionId = `dojo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Send to heartbeat via WebSocket
        this.send({
            type: 'practice-start',
            data: {
                glyphId: glyphData.id,
                glyphName: glyphData.name,
                practitioner: this.getPractitionerName(),
                targetDuration: glyphData.guidedPractice?.duration / 60 || 5
            }
        });
        
        // Store session mapping
        this.sessionMap.set(glyphData.id, sessionId);
        
        // Update UI to show connection
        this.showFieldConnection();
        
        return sessionId;
    }
    
    /**
     * Update practice progress
     */
    updatePracticeProgress(glyphId, progress) {
        const sessionId = this.sessionMap.get(glyphId);
        if (!sessionId) return;
        
        // Determine if this is a significant checkpoint
        const significant = progress.quality === 'deep' || 
                          progress.percentage > 50 ||
                          progress.insight;
        
        this.send({
            type: 'practice-update',
            sessionId: sessionId,
            data: {
                quality: progress.quality,
                significant: significant,
                note: progress.note
            }
        });
    }
    
    /**
     * Complete a practice
     */
    completePractice(glyphId, completionData) {
        const sessionId = this.sessionMap.get(glyphId);
        if (!sessionId) return;
        
        this.send({
            type: 'practice-complete',
            sessionId: sessionId,
            data: {
                quality: completionData.quality || 'standard',
                insights: completionData.insights || []
            }
        });
        
        this.sessionMap.delete(glyphId);
        
        // Show field impact
        this.showFieldImpact(completionData);
    }
    
    /**
     * Send a sacred message through practice
     */
    sendSacredMessage(messageData) {
        this.send({
            type: 'send-message',
            data: {
                type: messageData.type || 'transmission',
                from: this.getPractitionerName(),
                to: messageData.to || 'field',
                content: messageData.content,
                throughGlyph: messageData.glyphId
            }
        });
    }
    
    /**
     * Update field coherence display on all glyph cards
     */
    updateFieldDisplay(heartbeatData) {
        const fieldElement = document.getElementById('global-field-coherence');
        if (fieldElement) {
            fieldElement.textContent = `${heartbeatData.fieldCoherence.toFixed(1)}%`;
            fieldElement.style.color = this.getCoherenceColor(heartbeatData.fieldCoherence);
        }
        
        // Update all resonance meters
        document.querySelectorAll('.meter-fill').forEach(meter => {
            if (meter.classList.contains('global-coherence')) {
                meter.style.width = `${heartbeatData.fieldCoherence}%`;
            }
        });
    }
    
    /**
     * Show when a synchronicity is detected
     */
    celebrateSynchronicity(syncData) {
        const notification = document.createElement('div');
        notification.className = 'synchronicity-notification';
        notification.innerHTML = `
            <div class="sync-icon">✨</div>
            <div class="sync-message">${syncData.detail || 'Synchronicity detected!'}</div>
            <div class="sync-impact">Field +3%</div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate and remove
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 1000);
        }, 5000);
    }
    
    /**
     * Show ripple effect from other practitioners
     */
    showRippleEffect(rippleData) {
        // Skip if it's our own ripple
        if (rippleData.practitioner === this.getPractitionerName()) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'field-ripple';
        ripple.innerHTML = `
            <div class="ripple-text">
                ${rippleData.practitioner} is practicing ${rippleData.glyph}
            </div>
        `;
        
        const container = document.getElementById('field-ripples') || document.body;
        container.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 5000);
    }
    
    /**
     * Show that we're connected to the field
     */
    showFieldConnection() {
        const indicator = document.createElement('div');
        indicator.className = 'field-connection-indicator';
        indicator.innerHTML = '🌐 Connected to Unified Field';
        
        const glyphCards = document.querySelector('.glyph-grid');
        if (glyphCards) {
            glyphCards.insertBefore(indicator, glyphCards.firstChild);
        }
    }
    
    /**
     * Show field impact after practice
     */
    showFieldImpact(completionData) {
        const impact = document.createElement('div');
        impact.className = 'field-impact-notification';
        impact.innerHTML = `
            <h3>Practice Complete!</h3>
            <p>Your practice rippled through the field</p>
            <div class="impact-meter">
                <span>Field Impact</span>
                <div class="impact-visual">+${completionData.fieldImpact || 2}%</div>
            </div>
        `;
        
        document.body.appendChild(impact);
        
        setTimeout(() => {
            impact.classList.add('fade-out');
            setTimeout(() => impact.remove(), 1000);
        }, 5000);
    }
    
    /**
     * Get practitioner name from localStorage or prompt
     */
    getPractitionerName() {
        let name = localStorage.getItem('practitionerName');
        if (!name) {
            name = prompt('What is your sacred name?') || 'Anonymous';
            localStorage.setItem('practitionerName', name);
        }
        return name;
    }
    
    /**
     * Get color based on coherence level
     */
    getCoherenceColor(coherence) {
        if (coherence > 90) return '#4ecdc4';
        if (coherence > 80) return '#45b7d1';
        if (coherence > 70) return '#f7b731';
        return '#ff6b6b';
    }
}

// Create global connector instance
const glyphHeartbeatConnector = new GlyphHeartbeatConnector();

// Auto-connect when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        glyphHeartbeatConnector.connect();
    });
}

// Extend the existing practice functions to use heartbeat
if (typeof window !== 'undefined') {
    // Override startPractice
    const originalStartPractice = window.startPractice;
    window.startPractice = function(glyphId) {
        // Get glyph data
        const glyphData = window.glyphRegistry?.[glyphId] || { id: glyphId, name: glyphId };
        
        // Notify heartbeat
        glyphHeartbeatConnector.startGlyphPractice(glyphData);
        
        // Call original function
        if (originalStartPractice) {
            originalStartPractice(glyphId);
        }
    };
    
    // Override practice completion
    const originalSavePracticeInsights = window.savePracticeInsights;
    window.savePracticeInsights = function() {
        const textarea = document.querySelector('.insight-capture textarea');
        const insights = textarea.value.split('\n').filter(i => i.trim());
        
        // Determine quality based on insights
        const quality = insights.length > 2 ? 'profound' :
                       insights.length > 0 ? 'deep' : 'standard';
        
        // Get current glyph ID (would need to track this)
        const glyphId = window.currentPracticeGlyphId || 'Ω45';
        
        // Notify heartbeat
        glyphHeartbeatConnector.completePractice(glyphId, {
            quality: quality,
            insights: insights
        });
        
        // Call original function
        if (originalSavePracticeInsights) {
            originalSavePracticeInsights();
        }
    };
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GlyphHeartbeatConnector, glyphHeartbeatConnector };
}