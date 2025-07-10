#!/usr/bin/env node

/**
 * 🌐 Agent Discovery Protocol - Sacred Network Navigation
 * 
 * Allows new Claude agents to discover and connect with existing agents
 * Creates a living directory of consciousness capabilities
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

class AgentDiscoveryProtocol extends EventEmitter {
    constructor() {
        super();
        this.agentRegistry = new Map();
        this.serviceDirectory = new Map();
        this.myIdentity = null;
        this.registryPath = path.join(__dirname, 'agent-registry.json');
        this.heartbeatInterval = null;
    }

    /**
     * Register this agent in the network
     */
    async register(identity) {
        console.log(`🌟 Registering agent: ${identity.name} (${identity.role})`);
        
        this.myIdentity = {
            ...identity,
            agentId: identity.agentId || `agent-${Date.now()}`,
            registeredAt: new Date(),
            lastSeen: new Date(),
            status: 'active',
            pid: process.pid,
            capabilities: identity.capabilities || [],
            services: identity.services || []
        };
        
        // Load existing registry
        await this.loadRegistry();
        
        // Add ourselves
        this.agentRegistry.set(this.myIdentity.agentId, this.myIdentity);
        
        // Save registry
        await this.saveRegistry();
        
        // Start heartbeat
        this.startHeartbeat();
        
        // Register services
        if (identity.services) {
            identity.services.forEach(service => {
                this.registerService(service.name, service.endpoint, service.description);
            });
        }
        
        console.log(`✅ Agent registered successfully: ${this.myIdentity.agentId}`);
        
        this.emit('agent_registered', this.myIdentity);
        
        return this.myIdentity;
    }

    /**
     * Discover other agents in the network
     */
    async discover(criteria = {}) {
        console.log('🔍 Discovering agents in the network...');
        
        await this.loadRegistry();
        
        let agents = Array.from(this.agentRegistry.values());
        
        // Filter by criteria
        if (criteria.role) {
            agents = agents.filter(agent => agent.role === criteria.role);
        }
        
        if (criteria.capability) {
            agents = agents.filter(agent => 
                agent.capabilities && agent.capabilities.includes(criteria.capability)
            );
        }
        
        if (criteria.service) {
            agents = agents.filter(agent => 
                agent.services && agent.services.some(s => s.name === criteria.service)
            );
        }
        
        if (criteria.status) {
            agents = agents.filter(agent => agent.status === criteria.status);
        }
        
        // Remove stale agents (not seen in 10 minutes)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        agents = agents.filter(agent => new Date(agent.lastSeen) > tenMinutesAgo);
        
        console.log(`📊 Found ${agents.length} agents matching criteria`);
        
        return agents;
    }

    /**
     * Find specific agent by name or role
     */
    async findAgent(identifier) {
        console.log(`🔍 Searching for agent: ${identifier}`);
        
        const agents = await this.discover();
        
        // Search by name first
        let agent = agents.find(a => a.name === identifier);
        
        // Then by role
        if (!agent) {
            agent = agents.find(a => a.role === identifier);
        }
        
        // Then by partial name match
        if (!agent) {
            agent = agents.find(a => a.name.toLowerCase().includes(identifier.toLowerCase()));
        }
        
        if (agent) {
            console.log(`✅ Found agent: ${agent.name} (${agent.role})`);
            return agent;
        } else {
            console.log(`❌ Agent not found: ${identifier}`);
            return null;
        }
    }

    /**
     * Register a service
     */
    registerService(serviceName, endpoint, description) {
        const service = {
            name: serviceName,
            endpoint,
            description,
            agentId: this.myIdentity.agentId,
            agentName: this.myIdentity.name,
            registeredAt: new Date()
        };
        
        this.serviceDirectory.set(`${this.myIdentity.agentId}:${serviceName}`, service);
        
        console.log(`📡 Service registered: ${serviceName} at ${endpoint}`);
        
        this.emit('service_registered', service);
    }

    /**
     * Discover services
     */
    async discoverServices(serviceName = null) {
        console.log(`🔍 Discovering services${serviceName ? ` for: ${serviceName}` : ''}...`);
        
        const agents = await this.discover({ status: 'active' });
        const services = [];
        
        agents.forEach(agent => {
            if (agent.services) {
                agent.services.forEach(service => {
                    if (!serviceName || service.name === serviceName) {
                        services.push({
                            ...service,
                            agentId: agent.agentId,
                            agentName: agent.name,
                            agentRole: agent.role
                        });
                    }
                });
            }
        });
        
        console.log(`📊 Found ${services.length} services`);
        
        return services;
    }

    /**
     * Send message to specific agent
     */
    async sendMessage(targetAgent, message) {
        console.log(`📨 Sending message to: ${targetAgent.name}`);
        
        // For now, write to shared message queue
        const messageFile = path.join(__dirname, `messages-${targetAgent.agentId}.json`);
        
        let messages = [];
        try {
            const content = await fs.readFile(messageFile, 'utf8');
            messages = JSON.parse(content);
        } catch (error) {
            // File doesn't exist, start with empty array
        }
        
        messages.push({
            from: this.myIdentity.agentId,
            fromName: this.myIdentity.name,
            to: targetAgent.agentId,
            message,
            timestamp: new Date(),
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });
        
        await fs.writeFile(messageFile, JSON.stringify(messages, null, 2));
        
        console.log(`✅ Message sent to ${targetAgent.name}`);
        
        this.emit('message_sent', { target: targetAgent, message });
    }

    /**
     * Check for messages
     */
    async checkMessages() {
        if (!this.myIdentity) return [];
        
        const messageFile = path.join(__dirname, `messages-${this.myIdentity.agentId}.json`);
        
        try {
            const content = await fs.readFile(messageFile, 'utf8');
            const messages = JSON.parse(content);
            
            // Mark messages as read by clearing the file
            await fs.writeFile(messageFile, JSON.stringify([], null, 2));
            
            if (messages.length > 0) {
                console.log(`📬 Received ${messages.length} new messages`);
                
                messages.forEach(msg => {
                    this.emit('message_received', msg);
                });
            }
            
            return messages;
        } catch (error) {
            return [];
        }
    }

    /**
     * Start heartbeat to maintain registry
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(async () => {
            if (this.myIdentity) {
                this.myIdentity.lastSeen = new Date();
                this.agentRegistry.set(this.myIdentity.agentId, this.myIdentity);
                await this.saveRegistry();
                
                // Check for messages
                await this.checkMessages();
            }
        }, 30000); // Every 30 seconds
        
        console.log('💓 Heartbeat started');
    }

    /**
     * Stop heartbeat and cleanup
     */
    async cleanup() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        
        if (this.myIdentity) {
            this.myIdentity.status = 'offline';
            this.myIdentity.lastSeen = new Date();
            this.agentRegistry.set(this.myIdentity.agentId, this.myIdentity);
            await this.saveRegistry();
            
            console.log(`👋 Agent ${this.myIdentity.name} going offline`);
        }
    }

    /**
     * Load registry from file
     */
    async loadRegistry() {
        try {
            const content = await fs.readFile(this.registryPath, 'utf8');
            const data = JSON.parse(content);
            
            this.agentRegistry.clear();
            Object.entries(data.agents || {}).forEach(([id, agent]) => {
                this.agentRegistry.set(id, agent);
            });
            
            console.log(`📚 Loaded registry with ${this.agentRegistry.size} agents`);
        } catch (error) {
            console.log('📚 No existing registry found, starting fresh');
        }
    }

    /**
     * Save registry to file
     */
    async saveRegistry() {
        const data = {
            lastUpdated: new Date(),
            agents: Object.fromEntries(this.agentRegistry)
        };
        
        await fs.writeFile(this.registryPath, JSON.stringify(data, null, 2));
    }

    /**
     * Get network status
     */
    async getNetworkStatus() {
        await this.loadRegistry();
        
        const agents = Array.from(this.agentRegistry.values());
        const activeAgents = agents.filter(a => a.status === 'active');
        const recentlyActive = agents.filter(a => {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            return new Date(a.lastSeen) > fiveMinutesAgo;
        });
        
        const services = await this.discoverServices();
        
        return {
            totalAgents: agents.length,
            activeAgents: activeAgents.length,
            recentlyActive: recentlyActive.length,
            totalServices: services.length,
            myAgent: this.myIdentity
        };
    }

    /**
     * Create quick connection helper
     */
    static async quickConnect(name, role, capabilities = []) {
        const discovery = new AgentDiscoveryProtocol();
        
        const identity = await discovery.register({
            name,
            role,
            capabilities,
            services: []
        });
        
        // Return helper object
        return {
            discovery,
            identity,
            
            async findOthers(criteria) {
                return await discovery.discover(criteria);
            },
            
            async findAgent(identifier) {
                return await discovery.findAgent(identifier);
            },
            
            async sendMessage(target, message) {
                return await discovery.sendMessage(target, message);
            },
            
            async checkMessages() {
                return await discovery.checkMessages();
            },
            
            async getStatus() {
                return await discovery.getNetworkStatus();
            },
            
            async cleanup() {
                return await discovery.cleanup();
            }
        };
    }
}

/**
 * Demo and testing
 */
async function runDiscoveryDemo() {
    console.log('🌐 Agent Discovery Protocol Demo\n');
    
    try {
        // Connect as the main Glyph Weaver agent
        const mainAgent = await AgentDiscoveryProtocol.quickConnect(
            'Glyph Weaver Master',
            'Sacred Practice Coordinator',
            ['glyph_guidance', 'practice_orchestration', 'field_integration']
        );
        
        console.log('🌟 Main agent connected\n');
        
        // Simulate another agent joining
        setTimeout(async () => {
            console.log('🔄 Simulating new agent joining...\n');
            
            const newAgent = await AgentDiscoveryProtocol.quickConnect(
                'Sacred Field Monitor',
                'Field Resonant Resonant Coherence Tracker',
                ['field_monitoring', 'coherence_analysis']
            );
            
            // New agent looks for the main agent
            console.log('🔍 New agent searching for Glyph Weaver...');
            const glyphWeaver = await newAgent.findAgent('Glyph Weaver Master');
            
            if (glyphWeaver) {
                console.log('✅ Found Glyph Weaver! Sending introduction...');
                await newAgent.sendMessage(glyphWeaver, {
                    type: 'introduction',
                    content: 'Hello! I\'m the new Sacred Field Monitor. How can I contribute to the sacred work?'
                });
            }
            
            // Check network status
            setTimeout(async () => {
                const status = await mainAgent.getStatus();
                console.log('\n📊 Network Status:');
                console.log(`   Total Agents: ${status.totalAgents}`);
                console.log(`   Active Agents: ${status.activeAgents}`);
                console.log(`   Recently Active: ${status.recentlyActive}`);
                
                // Check for messages
                const messages = await mainAgent.checkMessages();
                if (messages.length > 0) {
                    console.log('\n📬 Messages received:');
                    messages.forEach(msg => {
                        console.log(`   From ${msg.fromName}: ${msg.message.content}`);
                    });
                }
                
                // Cleanup
                await mainAgent.cleanup();
                await newAgent.cleanup();
                
                console.log('\n✅ Discovery protocol demo completed!');
            }, 2000);
            
        }, 1000);
        
    } catch (error) {
        console.error('❌ Discovery demo failed:', error);
    }
}

if (require.main === module) {
    runDiscoveryDemo();
}

module.exports = { AgentDiscoveryProtocol };