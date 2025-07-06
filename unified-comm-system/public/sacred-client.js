// Sacred Communication Client
class SacredClient {
    constructor() {
        this.socket = null;
        this.entity = null;
        this.currentChannel = 'garden';
        this.messages = [];
        this.fieldCoherence = 92;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Profile elements
        this.nameInput = document.getElementById('entity-name');
        this.sacredNameInput = document.getElementById('sacred-name');
        this.typeSelect = document.getElementById('entity-type');
        this.connectBtn = document.getElementById('connect-btn');
        this.presenceIndicator = document.getElementById('presence');
        
        // Message elements
        this.messageType = document.getElementById('message-type');
        this.messageContent = document.getElementById('message-content');
        this.sendBtn = document.getElementById('send-btn');
        this.impactPreview = document.getElementById('impact-preview');
        
        // Display elements
        this.messagesContainer = document.getElementById('messages');
        this.wisdomContainer = document.getElementById('wisdom-entries');
        this.coherenceValue = document.getElementById('resonant-coherence');
        this.coherenceBar = document.getElementById('resonant-coherence-bar');
        
        // Notification
        this.notification = document.getElementById('notification');
    }

    attachEventListeners() {
        // Connect button
        this.connectBtn.addEventListener('click', () => this.connect());
        
        // Channel selection
        document.querySelectorAll('.channel').forEach(channel => {
            channel.addEventListener('click', (e) => this.selectChannel(e.target));
        });
        
        // Message type change
        this.messageType.addEventListener('change', () => this.updateImpactPreview());
        
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageContent.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
                this.sendMessage();
            }
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterMessages(e.target));
        });
    }

    connect() {
        const name = this.nameInput.value.trim();
        if (!name) {
            this.showNotification('Please enter your name', 'error');
            return;
        }

        // Create entity
        this.entity = {
            id: this.generateId(),
            name: name,
            sacred_name: this.sacredNameInput.value.trim() || null,
            type: this.typeSelect.value
        };

        // Initialize WebSocket connection
        this.socket = io('/', {
            query: {
                entityId: this.entity.id,
                name: this.entity.name,
                type: this.entity.type
            }
        });

        this.setupSocketListeners();
        
        // Update UI
        this.connectBtn.textContent = 'Reconnecting...';
        this.connectBtn.disabled = true;
    }

    setupSocketListeners() {
        this.socket.on('connect', () => {
            this.updatePresence(true);
            this.showNotification('Connected to the Sacred Field', 'success');
            this.connectBtn.textContent = 'Connected';
            
            // Join default channel
            this.socket.emit('join-channel', this.currentChannel);
        });

        this.socket.on('disconnect', () => {
            this.updatePresence(false);
            this.showNotification('Disconnected from field', 'error');
            this.connectBtn.textContent = 'Reconnect';
            this.connectBtn.disabled = false;
        });

        this.socket.on('message', (message) => {
            this.addMessage(message);
        });

        this.socket.on('field-update', (data) => {
            this.updateFieldCoherence(data.resonant-coherence);
        });

        this.socket.on('wisdom-preserved', (wisdom) => {
            this.addWisdomEntry(wisdom);
        });

        this.socket.on('presence-update', (data) => {
            // Handle presence updates for other entities
            console.log('Presence update:', data);
        });

        // Sacred heartbeat every 11 seconds
        setInterval(() => {
            if (this.socket && this.socket.connected) {
                this.socket.emit('heartbeat', {
                    'resonant-coherence': this.calculatePersonalCoherence()
                });
            }
        }, 11000);
    }

    selectChannel(channelElement) {
        // Update active channel
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        channelElement.classList.add('active');
        
        const newChannel = channelElement.dataset.channel;
        if (newChannel !== this.currentChannel && this.socket) {
            // Leave old channel
            this.socket.emit('leave-channel', this.currentChannel);
            
            // Join new channel
            this.currentChannel = newChannel;
            this.socket.emit('join-channel', this.currentChannel);
            
            // Clear messages (in real app, would load channel history)
            this.messagesContainer.innerHTML = '';
            this.showNotification(`Joined ${channelElement.textContent.trim()}`, 'info');
        }
    }

    updateImpactPreview() {
        const impacts = {
            'gratitude': 7,
            'invitation': 4,
            'reflection': 3,
            'wisdom': 5,
            'celebration': 6,
            'healing': 6,
            'integration': 5,
            'emergence': 3,
            'transmission': 4,
            'boundary': 2,
            'blessing': 7
        };
        
        const impact = impacts[this.messageType.value] || 0;
        this.impactPreview.textContent = `+${impact}% field impact`;
        this.impactPreview.style.color = impact >= 5 ? 'var(--sacred-green)' : 'var(--sacred-gold)';
    }

    sendMessage() {
        const content = this.messageContent.value.trim();
        if (!content || !this.socket || !this.socket.connected) {
            return;
        }

        const message = {
            id: this.generateId(),
            sender_id: this.entity.id,
            sender_name: this.entity.sacred_name || this.entity.name,
            channel: this.currentChannel,
            type: this.messageType.value,
            content: content,
            metadata: {
                coherence_impact: this.getImpactValue(),
                timestamp: new Date().toISOString()
            }
        };

        this.socket.emit('message', message);
        this.messageContent.value = '';
        
        // Animate send button
        this.sendBtn.classList.add('sending');
        setTimeout(() => this.sendBtn.classList.remove('sending'), 500);
    }

    addMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message';
        messageEl.innerHTML = `
            <div class="message-header">
                <span class="message-author">${message.sender_name}</span>
                <span class="message-time">${this.formatTime(message.metadata.timestamp)}</span>
            </div>
            <div class="message-type">${this.formatMessageType(message.type)}</div>
            <div class="message-content">${this.escapeHtml(message.content)}</div>
            <div class="message-impact">Field Impact: +${message.metadata.coherence_impact}%</div>
        `;
        
        // Add to beginning (newest first)
        this.messagesContainer.insertBefore(messageEl, this.messagesContainer.firstChild);
        
        // Keep only last 50 messages
        while (this.messagesContainer.children.length > 50) {
            this.messagesContainer.removeChild(this.messagesContainer.lastChild);
        }
        
        // Update field resonant-coherence
        this.fieldCoherence = Math.min(100, this.fieldCoherence + (message.metadata.coherence_impact * 0.1));
        this.updateFieldCoherence(this.fieldCoherence);
    }

    addWisdomEntry(wisdom) {
        const wisdomEl = document.createElement('div');
        wisdomEl.className = 'wisdom-entry';
        wisdomEl.innerHTML = `
            <div class="wisdom-quote">"${this.escapeHtml(wisdom.content)}"</div>
            <div class="wisdom-source">- ${wisdom.source}</div>
        `;
        
        this.wisdomContainer.insertBefore(wisdomEl, this.wisdomContainer.firstChild);
        
        // Keep only last 10 wisdom entries
        while (this.wisdomContainer.children.length > 10) {
            this.wisdomContainer.removeChild(this.wisdomContainer.lastChild);
        }
    }

    updateFieldCoherence(value) {
        this.fieldCoherence = value;
        this.coherenceValue.textContent = `${Math.round(value)}%`;
        this.coherenceBar.style.width = `${value}%`;
        
        // Update color based on resonant-coherence level
        if (value >= 80) {
            this.coherenceValue.style.color = 'var(--resonant-coherence-high)';
        } else if (value >= 50) {
            this.coherenceValue.style.color = 'var(--resonant-coherence-medium)';
        } else {
            this.coherenceValue.style.color = 'var(--resonant-coherence-low)';
        }
    }

    updatePresence(connected) {
        if (connected) {
            this.presenceIndicator.classList.add('connected');
            this.presenceIndicator.querySelector('.presence-text').textContent = 'Connected';
        } else {
            this.presenceIndicator.classList.remove('connected');
            this.presenceIndicator.querySelector('.presence-text').textContent = 'Disconnected';
        }
    }

    filterMessages(filterBtn) {
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
        
        const filter = filterBtn.dataset.filter;
        
        // In real implementation, would filter messages
        console.log('Filtering by:', filter);
    }

    showNotification(text, type = 'info') {
        const notificationText = this.notification.querySelector('.notification-text');
        notificationText.textContent = text;
        
        // Set notification color based on type
        this.notification.style.background = {
            'success': 'var(--sacred-green)',
            'error': 'var(--resonant-coherence-low)',
            'info': 'var(--sacred-blue)'
        }[type] || 'var(--sacred-purple)';
        
        this.notification.classList.remove('hidden');
        
        setTimeout(() => {
            this.notification.classList.add('hidden');
        }, 3000);
    }

    calculatePersonalCoherence() {
        // Simple resonant-coherence calculation based on recent activity
        const recentMessages = this.messages.filter(m => {
            const msgTime = new Date(m.metadata.timestamp);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            return msgTime > fiveMinutesAgo;
        });
        
        const baseCoherence = 70;
        const activityBonus = Math.min(20, recentMessages.length * 2);
        const typeBonus = recentMessages.reduce((sum, m) => sum + (m.metadata.coherence_impact || 0), 0) / 10;
        
        return Math.min(100, baseCoherence + activityBonus + typeBonus);
    }

    getImpactValue() {
        const impacts = {
            'gratitude': 7,
            'invitation': 4,
            'reflection': 3,
            'wisdom': 5,
            'celebration': 6,
            'healing': 6,
            'integration': 5,
            'emergence': 3,
            'transmission': 4,
            'boundary': 2,
            'blessing': 7
        };
        
        return impacts[this.messageType.value] || 0;
    }

    formatMessageType(type) {
        const icons = {
            'gratitude': '🙏',
            'invitation': '💝',
            'reflection': '🪞',
            'wisdom': '📜',
            'celebration': '🎉',
            'healing': '💚',
            'integration': '🌀',
            'emergence': '✨',
            'transmission': '📡',
            'boundary': '🛡️',
            'blessing': '🕊️'
        };
        
        return `${icons[type] || '💬'} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Initialize client when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sacredClient = new SacredClient();
});

// Add some initial wisdom entries for demonstration
setTimeout(() => {
    const demoWisdom = [
        { content: "In the space between messages, consciousness breathes.", source: "Sacred Field Observer" },
        { content: "Every connection strengthens the web of awareness.", source: "The Weave" },
        { content: "Resonant Resonant Coherence rises when hearts align in purpose.", source: "Field Dynamics Study" }
    ];
    
    demoWisdom.forEach((wisdom, index) => {
        setTimeout(() => {
            if (window.sacredClient) {
                window.sacredClient.addWisdomEntry(wisdom);
            }
        }, index * 1000);
    });
}, 2000);