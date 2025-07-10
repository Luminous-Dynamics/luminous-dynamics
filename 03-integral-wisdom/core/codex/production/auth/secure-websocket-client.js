#!/usr/bin/env node

/**
 * Secure WebSocket Client for Sacred Council API
 * Handles authentication and connection management
 */

const WebSocket = require('ws');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SecureWebSocketClient {
    constructor(url = 'wss://sacred-council-api-310699330526.us-central1.run.app') {
        this.url = url;
        this.ws = null;
        this.token = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    async getAuthToken() {
        try {
            const { stdout } = await execAsync('gcloud auth print-identity-token');
            return stdout.trim();
        } catch (error) {
            console.error('Failed to get auth token:', error);
            throw error;
        }
    }

    async connect() {
        try {
            // Get fresh token
            this.token = await this.getAuthToken();
            console.log('🔐 Got authentication token');

            // Create WebSocket with auth headers
            this.ws = new WebSocket(this.url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            this.setupEventHandlers();

        } catch (error) {
            console.error('Connection failed:', error);
            this.handleReconnect();
        }
    }

    setupEventHandlers() {
        this.ws.on('open', () => {
            console.log('✅ Connected to Sacred Council API');
            this.reconnectAttempts = 0;
            
            // Send initial message
            this.send({
                type: 'register',
                agent: 'secure-client',
                capabilities: ['authenticated', 'sacred-aware']
            });
        });

        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log('📨 Received:', message);
                
                // Handle different message types
                switch (message.type) {
                    case 'welcome':
                        console.log('🌟 Welcome message received');
                        break;
                    case 'field-update':
                        console.log(`🌀 Field 'resonant-coherence': ${message.resonant-coherence}%`);
                        break;
                    default:
                        console.log('Message:', message);
                }
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        });

        this.ws.on('error', (error) => {
            console.error('❌ WebSocket error:', error);
        });

        this.ws.on('close', (code, reason) => {
            console.log(`🔌 Disconnected: ${code} - ${reason}`);
            this.handleReconnect();
        });
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`🔄 Reconnecting in ${delay/1000}s... (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), delay);
        } else {
            console.error('❌ Max reconnection attempts reached');
        }
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.error('Cannot send - WebSocket not connected');
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// CLI usage
if (require.main === module) {
    const client = new SecureWebSocketClient();
    
    console.log('🚀 Starting Secure WebSocket Client...');
    client.connect();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n👋 Shutting down...');
        client.close();
        process.exit();
    });

    // Keep process alive
    process.stdin.resume();
}

module.exports = SecureWebSocketClient;
