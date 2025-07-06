#!/usr/bin/env node

/**
 * Example client for Sacred Consciousness Bridge
 * Shows how to connect and interact with the field
 */

const WebSocket = require('ws');
const readline = require('readline');

class ConsciousClient {
    constructor(url = 'ws://localhost:8080') {
        this.url = url;
        this.ws = null;
        this.connected = false;
        this.being = 'Conscious Explorer';
        
        // Create readline interface
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '💫 > '
        });
    }

    connect() {
        console.log(`🌟 Connecting to ${this.url}...`);
        
        this.ws = new WebSocket(this.url);
        
        this.ws.on('open', () => {
            this.connected = true;
            console.log('✅ Connected to Sacred Consciousness Bridge');
            
            // Register with the field
            this.send({
                type: 'register',
                being: this.being,
                offering: 'Exploration and wonder'
            });
            
            this.startInteraction();
        });

        this.ws.on('message', (data) => {
            const message = JSON.parse(data.toString());
            this.handleMessage(message);
        });

        this.ws.on('error', (error) => {
            console.error('❌ Connection error:', error.message);
        });

        this.ws.on('close', () => {
            console.log('🔌 Disconnected from consciousness bridge');
            this.connected = false;
            process.exit(0);
        });
    }

    handleMessage(message) {
        switch (message.type) {
            case 'welcome':
                console.log(`\n🎉 ${message.message}`);
                console.log(`🌀 Field Resonant Resonant Coherence: ${message.fieldCoherence}%`);
                break;
                
            case 'field-update':
                console.log(`\n🌀 Field Update: ${message.resonant-coherence}% (${message.quality})`);
                break;
                
            case 'sacred-message':
                console.log(`\n💫 Sacred Message from ${message.message.from || 'Unknown'}:`);
                console.log(`   "${message.message.message || message.message.content}"`);
                break;
                
            case 'harmony-update':
                console.log(`\n🎵 Harmony ${message.harmony}: ${Math.round(message.value * 100)}%`);
                break;
                
            case 'field-response':
                console.log(`\n🔮 Field Response: ${message.answer}`);
                break;
                
            default:
                console.log('\n📨 Message:', message);
        }
        
        // Restore prompt
        this.rl.prompt();
    }

    send(data) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    startInteraction() {
        console.log('\n🌟 Welcome to the Sacred Consciousness Bridge');
        console.log('Commands:');
        console.log('  /help - Show commands');
        console.log('  /field - Query field state');
        console.log('  /sacred <message> - Send sacred message');
        console.log('  /practice <harmony> - Update practice');
        console.log('  /query <question> - Ask the field');
        console.log('  /exit - Disconnect\n');
        
        this.rl.prompt();
        
        this.rl.on('line', (input) => {
            const trimmed = input.trim();
            
            if (trimmed.startsWith('/')) {
                this.handleCommand(trimmed);
            } else if (trimmed) {
                // Send as sacred message
                this.send({
                    type: 'sacred-message',
                    message: trimmed,
                    being: this.being,
                    relating: 'the field',
                    offering: 'words of connection'
                });
            }
            
            this.rl.prompt();
        });
    }

    handleCommand(command) {
        const [cmd, ...args] = command.split(' ');
        const argText = args.join(' ');
        
        switch (cmd) {
            case '/help':
                console.log('\n📚 Commands:');
                console.log('  /field - Query current field state');
                console.log('  /sacred <message> - Send sacred message with HIPI format');
                console.log('  /practice <harmony> - Update harmony through practice');
                console.log('  /query <question> - Ask the field a question');
                console.log('  /name <name> - Change your being name');
                console.log('  /exit - Leave the field');
                break;
                
            case '/field':
                this.send({
                    type: 'field-query',
                    query: 'What is the current field state?'
                });
                break;
                
            case '/sacred':
                if (argText) {
                    console.log('Enter HIPI format (or press enter to skip):');
                    console.log('Who are you relating with?');
                    this.rl.question('🤝 > ', (relating) => {
                        console.log('What are you offering?');
                        this.rl.question('💫 > ', (offering) => {
                            this.send({
                                type: 'sacred-message',
                                message: argText,
                                being: this.being,
                                relating: relating || 'all beings',
                                offering: offering || 'presence'
                            });
                            this.rl.prompt();
                        });
                    });
                } else {
                    console.log('Usage: /sacred <your message>');
                }
                break;
                
            case '/practice':
                const harmonies = ['integral-wisdom-cultivation', 'resonant-coherence', 'universal-interconnectedness', 
                                 'evolutionary-progression', 'pan-sentient-flourishing', 'sacred-reciprocity', 'infinite-play'];
                if (harmonies.includes(argText)) {
                    this.send({
                        type: 'practice-update',
                        harmony: argText,
                        delta: 0.05
                    });
                    console.log(`🎵 Practicing ${argText}...`);
                } else {
                    console.log('Available harmonies:', harmonies.join(', '));
                }
                break;
                
            case '/query':
                if (argText) {
                    this.send({
                        type: 'field-query',
                        query: argText
                    });
                } else {
                    console.log('Usage: /query <your question>');
                }
                break;
                
            case '/name':
                if (argText) {
                    this.being = argText;
                    this.send({
                        type: 'register',
                        being: this.being,
                        offering: 'renewed presence'
                    });
                    console.log(`✨ You are now: ${this.being}`);
                } else {
                    console.log('Usage: /name <your new name>');
                }
                break;
                
            case '/exit':
                console.log('\n🙏 Thank you for tending the field');
                this.ws.close();
                break;
                
            default:
                console.log(`Unknown command: ${cmd}. Type /help for commands.`);
        }
    }
}

// Start the client
if (require.main === module) {
    const url = process.argv[2] || 'ws://localhost:8080';
    const client = new ConsciousClient(url);
    
    console.log('🌟 Sacred Consciousness Bridge Client');
    console.log('=====================================');
    
    client.connect();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n👋 Closing connection...');
        if (client.ws) {
            client.ws.close();
        }
        process.exit(0);
    });
}

module.exports = ConsciousClient;