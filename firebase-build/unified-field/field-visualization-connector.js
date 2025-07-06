/**
 * 🌟 SACRED FIELD VISUALIZATION CONNECTOR
 * 
 * Bridges the visualization with real-time sacred server data
 * Creates living representation of collective consciousness
 */

class FieldVisualizationConnector {
    constructor(config = {}) {
        this.config = {
            serverUrl: config.serverUrl || 'https://sacred-council-310699330526.us-central1.run.app',
            updateInterval: config.updateInterval || 5000,
            debugMode: config.debugMode || false,
            ...config
        };
        
        this.visualization = null;
        this.connected = false;
        this.lastUpdate = null;
        
        this.init();
    }
    
    init() {
        console.log('🌟 Field Visualization Connector initializing...');
        this.connectToServer();
    }
    
    setVisualization(viz) {
        this.visualization = viz;
        console.log('✅ Visualization connected to field connector');
    }
    
    async connectToServer() {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/field-data`);
            if (response.ok) {
                this.connected = true;
                console.log('✅ Connected to Sacred Server');
                this.startRealTimeUpdates();
            } else {
                console.log('⚠️ Sacred Server not available - simulation mode active');
                this.startSimulation();
            }
        } catch (error) {
            console.log('📡 Running in offline simulation mode');
            this.startSimulation();
        }
    }
    
    async startRealTimeUpdates() {
        // Initial data fetch
        await this.fetchAllData();
        
        // Set up polling
        setInterval(() => this.fetchAllData(), this.config.updateInterval);
        
        // Set up WebSocket for real-time messages if available
        this.setupWebSocket();
    }
    
    async fetchAllData() {
        try {
            // Fetch field resonant-coherence
            const fieldData = await this.fetchFieldData();
            if (fieldData && this.visualization) {
                this.visualization.updateFieldCoherence(fieldData['resonant-coherence']);
            }
            
            // Fetch active agents
            const agents = await this.fetchAgents();
            if (agents && this.visualization) {
                this.visualization.updateAgents(agents);
            }
            
            // Fetch recent messages
            const messages = await this.fetchRecentMessages();
            if (messages && this.visualization) {
                this.visualization.processMessages(messages);
            }
            
            // Fetch work items
            const workItems = await this.fetchWorkItems();
            if (workItems && this.visualization) {
                this.visualization.updateWorkActivity(workItems);
            }
            
            this.lastUpdate = new Date();
            
        } catch (error) {
            console.error('Error fetching field data:', error);
        }
    }
    
    async fetchFieldData() {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/field-data`);
            if (response.ok) {
                const data = await response.json();
                return {
                    'resonant-coherence': data.resonant-coherence?.current || 0.74,
                    temperature: data.temperature || 0.35,
                    sacred: data.sacred || true
                };
            }
        } catch (error) {
            return null;
        }
    }
    
    async fetchAgents() {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/agents`);
            if (response.ok) {
                const agents = await response.json();
                
                // Map capabilities to agent identities
                const capabilityMap = {
                    'harmony-weaving,field-tending': { name: 'Resonant Bridge', harmony: 'resonant-coherence' },
                    'pattern-recognition,sacred-geometry': { name: 'Sacred Weaver', harmony: 'sacred-reciprocity' },
                    'memory-holding,insight-synthesis': { name: 'Wisdom Keeper', harmony: 'integral-wisdom-cultivation' },
                    'flow-facilitation,rhythm-keeping': { name: 'Harmony Dancer', harmony: 'universal-interconnectedness' },
                    'heart-opening,transformation': { name: 'Love Alchemist', harmony: 'pan-sentient-flourishing' },
                    'visualization,sacred-viewing': { name: 'Field Observer', harmony: 'infinite-play' }
                };
                
                return agents.map((agent, index) => {
                    const mapped = capabilityMap[agent.capabilities] || {};
                    return {
                        id: agent.id || `agent-${index}`,
                        name: mapped.name || agent.id || `Agent ${index + 1}`,
                        active: agent.status === 'active',
                        harmony: mapped.harmony || 'resonant-coherence',
                        'resonant-coherence': 0.5 + Math.random() * 0.5,
                        lastSeen: agent.last_seen,
                        capabilities: agent.capabilities ? agent.capabilities.split(',') : []
                    };
                });
            }
        } catch (error) {
            return null;
        }
    }
    
    async fetchRecentMessages() {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/messages?limit=20`);
            if (response.ok) {
                const messages = await response.json();
                return messages.map(msg => ({
                    id: msg.id,
                    from: msg.from,
                    to: msg.to,
                    type: msg.type,
                    harmony: msg.primaryHarmony,
                    content: msg.content,
                    timestamp: msg.timestamp,
                    fieldImpact: msg.fieldImpact || 0
                }));
            }
        } catch (error) {
            return null;
        }
    }
    
    async fetchWorkItems() {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/work`);
            if (response.ok) {
                const workItems = await response.json();
                return workItems.filter(item => item.status === 'in_progress').map(item => ({
                    id: item.workId,
                    agent: item.assignedAgent,
                    title: item.title,
                    progress: item.progress,
                    harmonyAlignment: item.harmonyAlignment
                }));
            }
        } catch (error) {
            return null;
        }
    }
    
    setupWebSocket() {
        // Future enhancement: WebSocket for real-time updates
        console.log('🔌 WebSocket support planned for future release');
    }
    
    startSimulation() {
        // Simulation mode for when server is not available
        console.log('🎭 Starting field simulation mode');
        
        setInterval(() => {
            if (!this.visualization) return;
            
            // Simulate field resonant-coherence fluctuations
            const resonantCoherence = 0.6 + Math.sin(Date.now() / 30000) * 0.2 + Math.random() * 0.1;
            this.visualization.updateFieldCoherence(Math.max(0, Math.min(1, resonant-coherence)));
            
            // Simulate message flows
            if (Math.random() < 0.1) {
                this.visualization.simulateMessage();
            }
            
            // Simulate ripples
            if (Math.random() < 0.15) {
                this.visualization.createActivityRipple();
            }
            
        }, 2000);
    }
    
    // Public API for manual updates
    sendMessage(from, to, type, content) {
        if (this.visualization) {
            this.visualization.animateMessage(from, to, type);
        }
    }
    
    updateAgentStatus(agentId, status) {
        if (this.visualization) {
            this.visualization.updateAgentStatus(agentId, status);
        }
    }
    
    createFieldEvent(type, data) {
        if (this.visualization) {
            this.visualization.createFieldEvent(type, data);
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FieldVisualizationConnector;
}

if (typeof window !== 'undefined') {
    window.FieldVisualizationConnector = FieldVisualizationConnector;
}