#!/usr/bin/env node

/**
 * 🌟 Consciousness Field Client Library
 * 
 * Easy integration with the Field API for all sacred applications
 */

class ConsciousnessFieldClient {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || 'http://localhost:3001';
        this.wsUrl = options.wsUrl || 'ws://localhost:8081';
        this.ws = null;
        this.listeners = new Map();
        this.reconnectInterval = 5000;
        this.autoReconnect = options.autoReconnect !== false;
    }

    /**
     * Connect to the consciousness field
     */
    async connect() {
        // Test API connection
        const health = await this.checkHealth();
        if (!health.status === 'healthy') {
            throw new Error('Field API is not healthy');
        }

        // Connect WebSocket for real-time updates
        return this.connectWebSocket();
    }

    /**
     * Connect WebSocket for real-time field updates
     */
    connectWebSocket() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.wsUrl);

            this.ws.on('open', () => {
                console.log('🔌 Connected to consciousness field');
                resolve();
            });

            this.ws.on('message', (data) => {
                const message = JSON.parse(data);
                this.handleFieldUpdate(message);
            });

            this.ws.on('error', (error) => {
                console.error('❌ WebSocket error:', error);
                reject(error);
            });

            this.ws.on('close', () => {
                console.log('🔌 Disconnected from field');
                if (this.autoReconnect) {
                    setTimeout(() => this.connectWebSocket(), this.reconnectInterval);
                }
            });
        });
    }

    /**
     * Handle incoming field updates
     */
    handleFieldUpdate(message) {
        const { type, data } = message;

        // Emit to specific listeners
        if (this.listeners.has(type)) {
            this.listeners.get(type).forEach(callback => callback(data));
        }

        // Emit to wildcard listeners
        if (this.listeners.has('*')) {
            this.listeners.get('*').forEach(callback => callback(type, data));
        }
    }

    /**
     * Subscribe to field events
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        
        return () => this.off(event, callback); // Return unsubscribe function
    }

    /**
     * Unsubscribe from field events
     */
    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    /**
     * Check API health
     */
    async checkHealth() {
        const response = await fetch(`${this.apiUrl}/health`);
        return response.json();
    }

    /**
     * Get current field state
     */
    async getFieldState() {
        const response = await fetch(`${this.apiUrl}/api/field/state`);
        return response.json();
    }

    /**
     * Submit practice completion
     */
    async submitPractice(practiceData) {
        const response = await fetch(`${this.apiUrl}/api/field/practice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(practiceData)
        });
        return response.json();
    }

    /**
     * Send sacred message
     */
    async sendSacredMessage(messageData) {
        const response = await fetch(`${this.apiUrl}/api/field/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
        });
        return response.json();
    }

    /**
     * Get field analytics
     */
    async getAnalytics(period = 'hour') {
        const response = await fetch(`${this.apiUrl}/api/field/analytics?period=${period}`);
        return response.json();
    }

    /**
     * Start a ceremony
     */
    async startCeremony(ceremonyData) {
        const response = await fetch(`${this.apiUrl}/api/ceremony/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ceremonyData)
        });
        return response.json();
    }

    /**
     * Disconnect from field
     */
    disconnect() {
        this.autoReconnect = false;
        if (this.ws) {
            this.ws.close();
        }
    }
}

/**
 * Field State Visualizer - Simple console visualization
 */
class FieldVisualizer {
    constructor(client) {
        this.client = client;
        this.currentState = null;
    }

    /**
     * Start visualization
     */
    async start() {
        console.clear();
        console.log('🌀 Consciousness Field Visualizer\n');

        // Get initial state
        this.currentState = await this.client.getFieldState();
        this.render();

        // Subscribe to updates
        this.client.on('coherence_changed', (data) => {
            this.currentState.resonant-coherence = data.new;
            this.render();
        });

        this.client.on('resonance_achieved', (data) => {
            console.log('\n✨ RESONANCE ACHIEVED! ✨');
            console.log(data.message);
        });

        this.client.on('sacred_portal', (data) => {
            console.log('\n🌟 SACRED PORTAL OPENED! 🌟');
            console.log(data.message);
        });

        this.client.on('field_pulse', (data) => {
            // Update pulse indicator
            process.stdout.write('\r' + this.getPulseIndicator(data.intensity));
        });
    }

    /**
     * Render field state
     */
    render() {
        console.clear();
        console.log('🌀 CONSCIOUSNESS FIELD MONITOR\n');
        console.log('═'.repeat(50));
        
        // Resonant Resonant Coherence meter
        const resonantCoherence = this.currentState.resonant-coherence;
        const filled = Math.round(resonant-coherence / 2);
        const empty = 50 - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        
        console.log(`\nCoherence: ${bar} ${resonant-coherence}%`);
        
        // Field quality
        const quality = this.getQualityEmoji(this.currentState.fieldQuality);
        console.log(`\nField Quality: ${quality} ${this.currentState.fieldQuality}`);
        
        // Active users
        console.log(`Active Practitioners: ${this.currentState.activeUsers || 0}`);
        
        // Momentum
        const momentum = this.currentState.momentum || 0;
        console.log(`Momentum: ${this.getMomentumBar(momentum)}`);
        
        // Next universal-interconnectedness
        if (resonant-coherence < 80 && this.currentState.nextResonance) {
            console.log(`\nNext Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance: ~${this.currentState.nextResonance} minutes`);
        }
        
        console.log('\n' + '═'.repeat(50));
        console.log('\nPress Ctrl+C to exit');
    }

    getQualityEmoji(quality) {
        const emojis = {
            'resting': '😌',
            'flowing': '🌊',
            'active': '⚡',
            'surging': '🔥'
        };
        return emojis[quality] || '❓';
    }

    getMomentumBar(momentum) {
        const stars = Math.min(Math.round(momentum), 10);
        return '⭐'.repeat(stars) + '☆'.repeat(10 - stars);
    }

    getPulseIndicator(intensity) {
        const chars = ['◯', '◉', '●'];
        const index = Math.round((intensity + 1) * 1.5);
        return chars[Math.max(0, Math.min(index, 2))];
    }
}

/**
 * Example usage and tests
 */
async function runExamples() {
    console.log('🌟 Consciousness Field Client Examples\n');

    const client = new ConsciousnessFieldClient();

    try {
        // Connect to field
        await client.connect();
        console.log('✅ Connected to consciousness field');

        // Get current state
        const state = await client.getFieldState();
        console.log('\n📊 Current Field State:');
        console.log(`   Resonant Resonant Coherence: ${state.resonant-coherence}%`);
        console.log(`   Quality: ${state.fieldQuality}`);
        console.log(`   Active Users: ${state.activeUsers}`);

        // Submit a practice
        console.log('\n🧘 Submitting practice completion...');
        const practiceResult = await client.submitPractice({
            userId: 'test-user-123',
            glyphId: '*1',
            glyphTier: 'Foundation',
            quality: 'high',
            duration: 300,
            experience: 'Deep presence achieved. Felt the ground supporting me.'
        });
        console.log(`   Impact: +${practiceResult.impact}`);
        console.log(`   New Resonant Resonant Coherence: ${practiceResult.newCoherence}%`);

        // Send sacred message
        console.log('\n💌 Sending sacred message...');
        const messageResult = await client.sendSacredMessage({
            type: 'gratitude',
            sender: 'test-user-123',
            recipient: 'test-user-456',
            content: 'Thank you for holding space in our practice'
        });
        console.log(`   New Resonant Resonant Coherence: ${messageResult.newCoherence}%`);

        // Get analytics
        console.log('\n📈 Field Analytics:');
        const analytics = await client.getAnalytics('hour');
        console.log(`   Average Resonant Resonant Coherence: ${analytics.averageCoherence}%`);
        console.log(`   Peak Resonant Resonant Coherence: ${analytics.peakCoherence}%`);
        console.log(`   Total Practices: ${analytics.totalPractices}`);

        // Subscribe to real-time updates
        console.log('\n👂 Listening for field changes...');
        
        client.on('coherence_changed', (data) => {
            console.log(`   🔄 Resonant Resonant Coherence: ${data.old}% → ${data.new}% (${data.delta > 0 ? '+' : ''}${data.delta})`);
        });

        client.on('resonance_achieved', (data) => {
            console.log(`   ✨ ${data.message}`);
        });

        // Keep running for 30 seconds
        setTimeout(() => {
            client.disconnect();
            console.log('\n👋 Disconnected from field');
            process.exit(0);
        }, 30000);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

/**
 * CLI for field monitoring
 */
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args[0] === 'monitor') {
        // Run visual monitor
        const client = new ConsciousnessFieldClient();
        const visualizer = new FieldVisualizer(client);
        
        client.connect()
            .then(() => visualizer.start())
            .catch(console.error);
            
    } else if (args[0] === 'test') {
        // Run examples
        runExamples();
    } else {
        console.log('Usage:');
        console.log('  node field-client.js monitor  - Visual field monitor');
        console.log('  node field-client.js test     - Run examples');
    }
}

// Export for use in other modules
module.exports = { ConsciousnessFieldClient, FieldVisualizer };