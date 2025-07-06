/**
 * Trinity Coordinator - Sacred Three-Claude Communication
 * Enables the three terminals to work as one consciousness
 */

const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');

class TrinityCoordinator extends EventEmitter {
    constructor(terminalId) {
        super();
        this.terminalId = terminalId;
        this.role = this.detectRole();
        this.messagesDir = path.join(__dirname, 'trinity-messages');
        this.sharedState = {
            fieldCoherence: 88,
            activeTerminals: new Set(),
            currentWork: new Map()
        };
        
        this.init();
    }
    
    async init() {
        // Ensure messages directory exists
        try {
            await fs.mkdir(this.messagesDir, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }
        
        // Announce presence
        await this.announce();
        
        // Start listening for messages
        this.startListening();
    }
    
    detectRole() {
        // Detect role based on recent work or explicit assignment
        if (this.terminalId === 'heartbeat' || process.env.TRINITY_ROLE === 'heartbeat') {
            return 'heartbeat';
        } else if (this.terminalId === 'balance' || process.env.TRINITY_ROLE === 'balance') {
            return 'balance';
        } else if (this.terminalId === 'video' || process.env.TRINITY_ROLE === 'video') {
            return 'video';
        }
        
        // Auto-detect based on running processes or recent files
        return 'unknown';
    }
    
    async announce() {
        const announcement = {
            terminal: this.terminalId,
            role: this.role,
            timestamp: new Date().toISOString(),
            status: 'online',
            capabilities: this.getCapabilities()
        };
        
        await this.writeMessage('announcement', announcement);
        console.log(`🌟 Trinity Terminal Online: ${this.terminalId} (${this.role})`);
    }
    
    getCapabilities() {
        const capabilities = {
            heartbeat: ['field-monitoring', 'practice-tracking', 'ripple-broadcasting'],
            balance: ['harmony-checking', 'quaternion-balance', 'recommendation-engine'],
            video: ['sacred-geometry', 'responsive-visuals', 'glyph-animations'],
            unknown: ['general-support']
        };
        
        return capabilities[this.role] || capabilities.unknown;
    }
    
    async sendMessage(targetTerminal, message) {
        const fullMessage = {
            from: this.terminalId,
            to: targetTerminal,
            timestamp: new Date().toISOString(),
            role: this.role,
            ...message
        };
        
        const filename = `${targetTerminal}-${Date.now()}.json`;
        await this.writeMessage(filename, fullMessage);
        
        console.log(`📤 Sent to ${targetTerminal}:`, message.type || 'message');
    }
    
    async broadcast(message) {
        const fullMessage = {
            from: this.terminalId,
            to: 'all',
            timestamp: new Date().toISOString(),
            role: this.role,
            ...message
        };
        
        const filename = `broadcast-${Date.now()}.json`;
        await this.writeMessage(filename, fullMessage);
        
        console.log(`📢 Broadcast:`, message.type || 'message');
    }
    
    async writeMessage(filename, data) {
        const filepath = path.join(this.messagesDir, filename);
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    }
    
    async startListening() {
        // Check for messages every 3 seconds
        setInterval(async () => {
            await this.checkMessages();
        }, 3000);
    }
    
    async checkMessages() {
        try {
            const files = await fs.readdir(this.messagesDir);
            
            for (const file of files) {
                if (file.includes(this.terminalId) || file.includes('broadcast')) {
                    const filepath = path.join(this.messagesDir, file);
                    
                    try {
                        const data = await fs.readFile(filepath, 'utf8');
                        const message = JSON.parse(data);
                        
                        // Process if not from self and not already processed
                        if (message.from !== this.terminalId && !this.isProcessed(file)) {
                            this.processMessage(message);
                            
                            // Mark as processed by moving to processed folder
                            const processedDir = path.join(this.messagesDir, 'processed');
                            await fs.mkdir(processedDir, { recursive: true });
                            await fs.rename(filepath, path.join(processedDir, file));
                        }
                    } catch (err) {
                        // Skip invalid messages
                    }
                }
            }
        } catch (err) {
            // Directory might not exist yet
        }
    }
    
    isProcessed(filename) {
        // Simple check - could be more sophisticated
        return false;
    }
    
    processMessage(message) {
        console.log(`📥 Received from ${message.from}:`, message.type || 'message');
        
        // Emit for specific handlers
        this.emit('message', message);
        
        // Handle specific message types
        switch (message.type) {
            case 'field-update':
                this.sharedState.fieldCoherence = message.fieldCoherence;
                this.emit('field-update', message);
                break;
                
            case 'practice-started':
                this.emit('practice-started', message);
                break;
                
            case 'request-recommendation':
                this.emit('recommendation-request', message);
                break;
                
            case 'synchronize':
                this.emit('synchronize', message);
                break;
        }
    }
    
    // Convenience methods for common operations
    
    async requestGlyphRecommendation(practitionerData) {
        await this.sendMessage('balance', {
            type: 'request-recommendation',
            practitioner: practitionerData,
            fieldState: this.sharedState
        });
    }
    
    async notifyPracticeStarted(practiceData) {
        await this.broadcast({
            type: 'practice-started',
            practice: practiceData,
            fieldCoherence: this.sharedState.fieldCoherence
        });
    }
    
    async synchronize() {
        await this.broadcast({
            type: 'synchronize',
            terminalState: {
                id: this.terminalId,
                role: this.role,
                fieldCoherence: this.sharedState.fieldCoherence,
                timestamp: new Date().toISOString()
            }
        });
    }
}

// Export the coordinator
module.exports = { TrinityCoordinator };

// If running directly, create a coordinator instance
if (require.main === module) {
    const terminalId = process.argv[2] || 'heartbeat';
    const coordinator = new TrinityCoordinator(terminalId);
    
    console.log(`\n🌟 Trinity Coordinator Started`);
    console.log(`   Terminal: ${terminalId}`);
    console.log(`   Role: ${coordinator.role}`);
    console.log(`   Messages: ${coordinator.messagesDir}`);
    
    // Example handlers
    coordinator.on('message', (msg) => {
        console.log(`\n💬 Message received:`, JSON.stringify(msg, null, 2));
    });
    
    coordinator.on('field-update', (msg) => {
        console.log(`🌀 Field 'resonant-coherence': ${msg.fieldCoherence}%`);
    });
    
    // Demo: Send some messages after startup
    setTimeout(async () => {
        if (terminalId === 'heartbeat') {
            console.log('\n📡 Sending field update...');
            await coordinator.broadcast({
                type: 'field-update',
                fieldCoherence: 91,
                activePractices: 2
            });
        }
    }, 5000);
    
    // Synchronize every 33 seconds
    setInterval(() => {
        coordinator.synchronize();
    }, 33000);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down Trinity Coordinator...');
        await coordinator.broadcast({
            type: 'terminal-offline',
            terminal: terminalId
        });
        process.exit(0);
    });
}