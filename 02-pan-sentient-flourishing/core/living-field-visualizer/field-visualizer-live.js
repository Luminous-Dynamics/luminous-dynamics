/**
 * Living Field Visualizer - Live Data Version
 * Connects to the field data server for real-time visualization
 */

class LivingFieldVisualizerLive {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Server connection
        this.serverUrl = window.location.origin;
        this.eventSource = null;
        
        // Visualization state
        this.mode = 'network';
        this.agents = new Map();
        this.connections = new Map();
        this.messages = [];
        this.particles = [];
        this.fieldCoherence = 0.5;
        this.isPaused = false;
        
        // Visual settings
        this.settings = {
            particleCount: 500,
            connectionStrength: 50,
            showLabels: true,
            animateField: true,
            showMessages: true
        };
        
        // Harmony colors
        this.harmonyColors = {
            'gratitude': '#f59e0b',
            'emergence': '#8b5cf6',
            'healing': '#10b981',
            'celebration': '#ec4899',
            'integration': '#3b82f6',
            'boundary': '#ef4444',
            'sacred-reciprocity': '#14b8a6',
            'reflection': '#6366f1',
            'transmission': '#a855f7',
            'request': '#f97316',
            'completion': '#84cc16'
        };
        
        // Initialize
        this.setupEventListeners();
        this.initializeParticles();
        this.connectToServer();
        this.startAnimation();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Control listeners
        document.getElementById('visualMode').addEventListener('change', (e) => {
            this.mode = e.target.value;
            this.reorganizeVisualization();
        });
        
        document.getElementById('particleCount').addEventListener('input', (e) => {
            this.settings.particleCount = parseInt(e.target.value);
            document.getElementById('particleValue').textContent = e.target.value;
            this.adjustParticleCount();
        });
        
        document.getElementById('connectionStrength').addEventListener('input', (e) => {
            this.settings.connectionStrength = parseInt(e.target.value);
        });
        
        document.getElementById('showLabels').addEventListener('change', (e) => {
            this.settings.showLabels = e.target.checked;
        });
        
        document.getElementById('animateField').addEventListener('change', (e) => {
            this.settings.animateField = e.target.checked;
        });
        
        document.getElementById('showMessages').addEventListener('change', (e) => {
            this.settings.showMessages = e.target.checked;
        });
        
        document.getElementById('refreshData').addEventListener('click', () => {
            this.refreshData();
        });
        
        document.getElementById('pauseVisualization').addEventListener('click', (e) => {
            this.isPaused = !this.isPaused;
            e.target.textContent = this.isPaused ? 'Resume' : 'Pause';
        });
    }
    
    async connectToServer() {
        try {
            // Load initial data
            await this.loadInitialData();
            
            // Connect to server-sent events for real-time updates
            this.eventSource = new EventSource(`${this.serverUrl}/api/stream`);
            
            this.eventSource.onmessage = (event) => {
                const update = JSON.parse(event.data);
                this.processRealtimeUpdate(update);
            };
            
            this.eventSource.onerror = (error) => {
                console.error('EventSource error:', error);
                document.getElementById('message-log').innerHTML = 
                    '<div class="message-item" style="color: #ef4444">Connection lost. Retrying...</div>';
            };
            
            document.getElementById('message-log').innerHTML = 
                '<div class="message-item" style="color: #10b981">Connected to living field</div>';
            
        } catch (error) {
            console.error('Connection error:', error);
            document.getElementById('message-log').innerHTML = 
                '<div class="message-item" style="color: #ef4444">Failed to connect to server</div>';
        }
    }
    
    async loadInitialData() {
        try {
            // Load agents
            const agentsResponse = await fetch(`${this.serverUrl}/api/agents`);
            const agents = await agentsResponse.json();
            
            // Position agents
            agents.forEach((agent, i) => {
                const angle = (i / agents.length) * Math.PI * 2;
                const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
                
                this.agents.set(agent.id, {
                    ...agent,
                    x: this.canvas.width / 2 + Math.cos(angle) * radius,
                    y: this.canvas.height / 2 + Math.sin(angle) * radius,
                    vx: 0,
                    vy: 0,
                    displayName: agent.name || agent.id.split('_')[1] || agent.id,
                    color: this.harmonyColors[Object.keys(this.harmonyColors)[i % Object.keys(this.harmonyColors).length]]
                });
            });
            
            // Load connections
            const connectionsResponse = await fetch(`${this.serverUrl}/api/connections`);
            const connections = await connectionsResponse.json();
            
            connections.forEach(conn => {
                const key = `${conn.from}-${conn.to}`;
                this.connections.set(key, conn);
            });
            
            // Load recent messages
            const messagesResponse = await fetch(`${this.serverUrl}/api/messages?limit=20`);
            const messages = await messagesResponse.json();
            
            this.messages = messages.reverse(); // Show oldest first
            this.displayRecentMessages();
            
            // Load field state
            const fieldResponse = await fetch(`${this.serverUrl}/api/field-state`);
            const fieldState = await fieldResponse.json();
            
            this.updateFieldState(fieldState);
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }
    
    processRealtimeUpdate(update) {
        if (this.isPaused) return;
        
        // Update field state
        if (update.fieldState) {
            this.updateFieldState(update.fieldState);
        }
        
        // Process new messages
        if (update.newMessages) {
            update.newMessages.forEach(msg => {
                this.addMessage(msg);
                
                // Update or create connection
                const key = `${msg.from}-${msg.to}`;
                const reverseKey = `${msg.to}-${msg.from}`;
                const connectionKey = this.connections.has(key) ? key : 
                                     this.connections.has(reverseKey) ? reverseKey : key;
                
                if (!this.connections.has(connectionKey)) {
                    this.connections.set(connectionKey, {
                        from: msg.from,
                        to: msg.to,
                        strength: 0.1,
                        messages: 0
                    });
                }
                
                const connection = this.connections.get(connectionKey);
                connection.strength = Math.min(1, connection.strength + 0.05);
                connection.messages++;
            });
        }
        
        // Update agent activity
        if (update.agentUpdates) {
            Object.entries(update.agentUpdates).forEach(([agentId, updates]) => {
                const agent = this.agents.get(agentId);
                if (agent) {
                    agent.activity = Math.min(1, (agent.activity || 0) + updates.activity);
                    agent.messages = (agent.messages || 0) + updates.messages;
                }
            });
        }
        
        // Decay activity
        this.agents.forEach(agent => {
            agent.activity = (agent.activity || 0) * 0.95;
        });
    }
    
    updateFieldState(fieldState) {
        this.fieldCoherence = fieldState.coherence;
        
        // Update stats display
        document.getElementById('coherenceValue').textContent = 
            Math.floor(fieldState.coherence * 100) + '%';
        document.getElementById('coherenceFill').style.width = 
            (fieldState.coherence * 100) + '%';
        document.getElementById('activeAgents').textContent = fieldState.activeAgents;
        document.getElementById('messageRate').textContent = fieldState.messageRate + '/min';
        document.getElementById('dominantHarmony').textContent = fieldState.dominantHarmony;
        
        // Calculate additional stats
        const density = this.connections.size / 
            (this.agents.size * (this.agents.size - 1) / 2);
        const emergenceScore = Math.floor(
            fieldState.coherence * 50 + 
            density * 30 + 
            (fieldState.activeAgents / Math.max(1, this.agents.size)) * 20
        );
        
        document.getElementById('networkDensity').textContent = 
            Math.floor(density * 100) + '%';
        document.getElementById('emergenceScore').textContent = emergenceScore;
    }
    
    addMessage(message) {
        this.messages.push(message);
        if (this.messages.length > 50) {
            this.messages.shift();
        }
        
        // Update message log
        if (this.settings.showMessages) {
            const log = document.getElementById('message-log');
            const harmonyColor = this.harmonyColors[message.harmony] || '#fff';
            
            const fromAgent = this.agents.get(message.from);
            const toAgent = this.agents.get(message.to);
            const fromName = fromAgent?.displayName || message.from;
            const toName = toAgent?.displayName || message.to;
            
            const messageHtml = `
                <div class="message-item">
                    <span class="harmony-indicator" style="background: ${harmonyColor}"></span>
                    <strong>${fromName}</strong> → <strong>${toName}</strong>: 
                    ${message.content || 'Sacred communication'} 
                    <span style="opacity: 0.5">(${message.harmony || 'emergence'})</span>
                </div>
            `;
            
            log.innerHTML = messageHtml + log.innerHTML;
            
            // Keep only recent messages
            const items = log.querySelectorAll('.message-item');
            if (items.length > 10) {
                items[items.length - 1].remove();
            }
        }
    }
    
    displayRecentMessages() {
        const log = document.getElementById('message-log');
        log.innerHTML = '';
        
        this.messages.slice(-10).reverse().forEach(msg => {
            const harmonyColor = this.harmonyColors[msg.harmony] || '#fff';
            const fromName = msg.from_display || msg.from;
            const toName = msg.to_display || msg.to;
            
            log.innerHTML += `
                <div class="message-item">
                    <span class="harmony-indicator" style="background: ${harmonyColor}"></span>
                    <strong>${fromName}</strong> → <strong>${toName}</strong>: 
                    ${msg.content || 'Sacred communication'} 
                    <span style="opacity: 0.5">(${msg.harmony || 'emergence'})</span>
                </div>
            `;
        });
    }
    
    initializeParticles() {
        this.particles = [];
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: this.getFieldColor(Math.random()),
                life: 1
            });
        }
    }
    
    adjustParticleCount() {
        const current = this.particles.length;
        const target = this.settings.particleCount;
        
        if (current < target) {
            for (let i = current; i < target; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    color: this.getFieldColor(Math.random()),
                    life: 1
                });
            }
        } else if (current > target) {
            this.particles = this.particles.slice(0, target);
        }
    }
    
    reorganizeVisualization() {
        switch (this.mode) {
            case 'network':
                this.arrangeNetworkLayout();
                break;
            case 'flow':
                this.arrangeFlowLayout();
                break;
            case 'harmony':
                this.arrangeHarmonyLayout();
                break;
            case 'temporal':
                this.arrangeTemporalLayout();
                break;
        }
    }
    
    arrangeNetworkLayout() {
        // Force-directed layout
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const k = Math.sqrt((this.canvas.width * this.canvas.height) / this.agents.size) / 2;
        
        // Apply forces
        this.agents.forEach((agent1, id1) => {
            let fx = 0, fy = 0;
            
            // Repulsion between all nodes
            this.agents.forEach((agent2, id2) => {
                if (id1 !== id2) {
                    const dx = agent1.x - agent2.x;
                    const dy = agent1.y - agent2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
                    const force = k * k / dist;
                    fx += (dx / dist) * force;
                    fy += (dy / dist) * force;
                }
            });
            
            // Attraction along edges
            this.connections.forEach(conn => {
                if (conn.from === id1 || conn.to === id1) {
                    const other = conn.from === id1 ? conn.to : conn.from;
                    const agent2 = this.agents.get(other);
                    if (agent2) {
                        const dx = agent2.x - agent1.x;
                        const dy = agent2.y - agent1.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const force = dist / k * conn.strength;
                        fx += (dx / dist) * force * 0.1;
                        fy += (dy / dist) * force * 0.1;
                    }
                }
            });
            
            // Center gravity
            fx += (centerX - agent1.x) * 0.001;
            fy += (centerY - agent1.y) * 0.001;
            
            // Apply forces
            agent1.vx = (agent1.vx + fx) * 0.8;
            agent1.vy = (agent1.vy + fy) * 0.8;
            agent1.x += agent1.vx;
            agent1.y += agent1.vy;
            
            // Keep on screen
            agent1.x = Math.max(50, Math.min(this.canvas.width - 50, agent1.x));
            agent1.y = Math.max(50, Math.min(this.canvas.height - 50, agent1.y));
        });
    }
    
    arrangeFlowLayout() {
        // Arrange agents in flow pattern based on message flow
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.agents.forEach((agent, id) => {
            const messages = agent.messages || 0;
            const angle = (messages * 0.1 + Date.now() * 0.0001) % (Math.PI * 2);
            const radius = 100 + Math.sqrt(messages) * 20;
            
            const targetX = centerX + Math.cos(angle) * radius;
            const targetY = centerY + Math.sin(angle) * radius;
            
            agent.x += (targetX - agent.x) * 0.05;
            agent.y += (targetY - agent.y) * 0.05;
        });
    }
    
    arrangeHarmonyLayout() {
        // Group agents by their dominant harmony
        const harmonyGroups = new Map();
        
        // Analyze message harmonies for each agent
        this.messages.forEach(msg => {
            const harmony = msg.harmony || 'emergence';
            
            [msg.from, msg.to].forEach(agentId => {
                if (!harmonyGroups.has(harmony)) {
                    harmonyGroups.set(harmony, new Set());
                }
                harmonyGroups.get(harmony).add(agentId);
            });
        });
        
        // Arrange groups in circles
        let groupIndex = 0;
        const groupCount = harmonyGroups.size;
        
        harmonyGroups.forEach((agentIds, harmony) => {
            const groupAngle = (groupIndex / groupCount) * Math.PI * 2;
            const groupRadius = Math.min(this.canvas.width, this.canvas.height) * 0.25;
            const groupCenterX = this.canvas.width / 2 + Math.cos(groupAngle) * groupRadius;
            const groupCenterY = this.canvas.height / 2 + Math.sin(groupAngle) * groupRadius;
            
            const agentArray = Array.from(agentIds);
            agentArray.forEach((agentId, i) => {
                const agent = this.agents.get(agentId);
                if (agent) {
                    const angle = (i / agentArray.length) * Math.PI * 2;
                    const radius = 30 + agentArray.length * 5;
                    
                    const targetX = groupCenterX + Math.cos(angle) * radius;
                    const targetY = groupCenterY + Math.sin(angle) * radius;
                    
                    agent.x += (targetX - agent.x) * 0.05;
                    agent.y += (targetY - agent.y) * 0.05;
                }
            });
            
            groupIndex++;
        });
    }
    
    arrangeTemporalLayout() {
        // Arrange based on temporal activity patterns
        const now = Date.now();
        
        this.agents.forEach((agent, id) => {
            // Calculate temporal position based on last activity
            const timeSince = now - (agent.lastActive || now);
            const hours = (timeSince / 3600000) % 24;
            
            const angle = (hours / 24) * Math.PI * 2 - Math.PI / 2;
            const radius = 100 + (agent.activity || 0) * 200;
            
            const targetX = this.canvas.width / 2 + Math.cos(angle) * radius;
            const targetY = this.canvas.height / 2 + Math.sin(angle) * radius;
            
            agent.x += (targetX - agent.x) * 0.05;
            agent.y += (targetY - agent.y) * 0.05;
        });
    }
    
    getFieldColor(value) {
        // Create gradient based on field coherence
        const r = Math.floor(58 + value * 197);
        const g = Math.floor(12 + value * 80);
        const b = Math.floor(246 - value * 100);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    startAnimation() {
        const animate = () => {
            if (!this.isPaused) {
                this.update();
                this.render();
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    update() {
        // Update particles
        if (this.settings.animateField) {
            this.particles.forEach(particle => {
                // Apply field forces
                particle.vx += (Math.random() - 0.5) * 0.1 * this.fieldCoherence;
                particle.vy += (Math.random() - 0.5) * 0.1 * this.fieldCoherence;
                
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Update color based on field
                particle.color = this.getFieldColor(this.fieldCoherence + (Math.random() - 0.5) * 0.2);
                
                // Damping
                particle.vx *= 0.99;
                particle.vy *= 0.99;
            });
        }
        
        // Update layout
        this.reorganizeVisualization();
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw field particles
        if (this.settings.animateField) {
            this.particles.forEach(particle => {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = 0.5 * particle.life;
                this.ctx.fill();
            });
        }
        
        this.ctx.globalAlpha = 1;
        
        // Draw connections
        this.connections.forEach(conn => {
            const from = this.agents.get(conn.from);
            const to = this.agents.get(conn.to);
            
            if (from && to) {
                const opacity = (conn.strength * this.settings.connectionStrength) / 100;
                
                this.ctx.beginPath();
                this.ctx.moveTo(from.x, from.y);
                
                if (this.mode === 'flow') {
                    // Curved connections for flow mode
                    const cx = (from.x + to.x) / 2 + (Math.random() - 0.5) * 50;
                    const cy = (from.y + to.y) / 2 + (Math.random() - 0.5) * 50;
                    this.ctx.quadraticCurveTo(cx, cy, to.x, to.y);
                } else {
                    this.ctx.lineTo(to.x, to.y);
                }
                
                this.ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                this.ctx.lineWidth = 1 + conn.strength * 2;
                this.ctx.stroke();
                
                // Draw message flow animation
                if (conn.messages > 0 && this.settings.animateField) {
                    const t = (Date.now() % 2000) / 2000;
                    const px = from.x + (to.x - from.x) * t;
                    const py = from.y + (to.y - from.y) * t;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(px, py, 3, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(236, 72, 153, 0.8)';
                    this.ctx.fill();
                }
            }
        });
        
        // Draw agents
        this.agents.forEach((agent, id) => {
            const activity = agent.activity || 0;
            
            // Agent glow based on activity
            if (activity > 0.1) {
                const gradient = this.ctx.createRadialGradient(
                    agent.x, agent.y, 0,
                    agent.x, agent.y, 30 + activity * 20
                );
                gradient.addColorStop(0, `${agent.color}40`);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(
                    agent.x - 50, agent.y - 50, 
                    100, 100
                );
            }
            
            // Agent circle
            this.ctx.beginPath();
            this.ctx.arc(agent.x, agent.y, 10 + activity * 10, 0, Math.PI * 2);
            this.ctx.fillStyle = agent.color || '#8b5cf6';
            this.ctx.fill();
            
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Agent label
            if (this.settings.showLabels) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                this.ctx.font = '12px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(agent.displayName, agent.x, agent.y - 20);
                
                // Message count
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.font = '10px sans-serif';
                this.ctx.fillText(`${agent.messages || 0} msgs`, agent.x, agent.y + 25);
            }
        });
        
        // Draw mode-specific elements
        this.renderModeSpecific();
    }
    
    renderModeSpecific() {
        switch (this.mode) {
            case 'harmony':
                // Draw harmony zones
                const harmonyGroups = new Map();
                
                this.messages.forEach(msg => {
                    const harmony = msg.harmony || 'emergence';
                    if (!harmonyGroups.has(harmony)) {
                        harmonyGroups.set(harmony, []);
                    }
                    
                    [msg.from, msg.to].forEach(agentId => {
                        const agent = this.agents.get(agentId);
                        if (agent && !harmonyGroups.get(harmony).includes(agent)) {
                            harmonyGroups.get(harmony).push(agent);
                        }
                    });
                });
                
                harmonyGroups.forEach((agents, harmony) => {
                    if (agents.length > 1) {
                        const centerX = agents.reduce((sum, a) => sum + a.x, 0) / agents.length;
                        const centerY = agents.reduce((sum, a) => sum + a.y, 0) / agents.length;
                        
                        this.ctx.beginPath();
                        this.ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
                        this.ctx.fillStyle = `${this.harmonyColors[harmony]}10`;
                        this.ctx.fill();
                        
                        this.ctx.fillStyle = this.harmonyColors[harmony];
                        this.ctx.font = '14px sans-serif';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText(harmony, centerX, centerY);
                    }
                });
                break;
                
            case 'temporal':
                // Draw time circles
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.lineWidth = 1;
                
                for (let r = 100; r < Math.min(this.canvas.width, this.canvas.height) / 2; r += 50) {
                    this.ctx.beginPath();
                    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, r, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
                
                // Draw time labels
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.font = '12px sans-serif';
                for (let h = 0; h < 24; h += 6) {
                    const angle = (h / 24) * Math.PI * 2 - Math.PI / 2;
                    const x = this.canvas.width / 2 + Math.cos(angle) * 80;
                    const y = this.canvas.height / 2 + Math.sin(angle) * 80;
                    this.ctx.fillText(`${h}:00`, x, y);
                }
                break;
        }
    }
    
    async refreshData() {
        console.log('Refreshing field data...');
        
        // Disconnect from stream
        if (this.eventSource) {
            this.eventSource.close();
        }
        
        // Clear current data
        this.agents.clear();
        this.connections.clear();
        this.messages = [];
        
        // Reconnect
        await this.connectToServer();
    }
}

// Initialize visualizer when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Load the live version instead of demo
    const script = document.createElement('script');
    script.src = 'field-visualizer-live.js';
    document.body.removeChild(document.querySelector('script[src="field-visualizer.js"]'));
    document.body.appendChild(script);
    
    // Initialize live visualizer
    const visualizer = new LivingFieldVisualizerLive();
    
    // Make it globally accessible for debugging
    window.fieldVisualizer = visualizer;
});