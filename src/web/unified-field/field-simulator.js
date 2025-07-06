/**
 * Interactive Field Simulator
 * 
 * Transform Relational Field Theory from abstract concepts into
 * living, interactive experiences. Users can literally play with
 * consciousness nodes and witness how relationship quality affects
 * field coherence in real-time.
 */

class FieldSimulator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.width = 800;
        this.height = 600;
        
        // Simulation state
        this.nodes = [];
        this.connections = [];
        this.fieldCoherence = 0.5;
        this.isPlaying = false;
        this.selectedNode = null;
        this.dragOffset = { x: 0, y: 0 };
        
        // Visual parameters
        this.colors = {
            coherent: '#A8B5A6',
            incoherent: '#ff6b6b',
            neutral: '#B3C5D7',
            field: 'rgba(168, 181, 166, 0.1)',
            connection: '#A8B5A6'
        };
        
        this.initializeSimulator();
    }

    initializeSimulator() {
        this.createCanvas();
        this.createControls();
        this.setupEventListeners();
        this.resetToDefault();
        this.startAnimation();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.border = '2px solid #A8B5A6';
        this.canvas.style.borderRadius = '12px';
        this.canvas.style.backgroundColor = '#FAFAF8';
        this.canvas.style.cursor = 'pointer';
        
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
    }

    createControls() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'field-simulator-controls';
        controlPanel.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <h4 style="color: #A8B5A6; margin-bottom: 15px;">Field Experiments</h4>
                    <button id="experiment-harmony" class="field-button" style="width: 100%; margin-bottom: 10px;">
                        Create Harmony
                    </button>
                    <button id="experiment-conflict" class="field-button" style="width: 100%; margin-bottom: 10px;">
                        Introduce Conflict
                    </button>
                    <button id="experiment-healing" class="field-button" style="width: 100%;">
                        Witness Healing
                    </button>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <h4 style="color: #A8B5A6; margin-bottom: 15px;">Field Coherence</h4>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 2em; margin-right: 10px;">📊</span>
                        <div style="flex: 1;">
                            <div id="coherence-bar" style="width: 100%; height: 20px; background: #E8E6E1; border-radius: 10px; overflow: hidden;">
                                <div id="coherence-fill" style="height: 100%; background: linear-gradient(90deg, #ff6b6b, #A8B5A6); width: 50%; transition: all 0.5s ease;"></div>
                            </div>
                            <div id="coherence-text" style="text-align: center; margin-top: 5px; color: #6B7280;">50%</div>
                        </div>
                    </div>
                    <p style="font-size: 0.9em; color: #6B7280;">Drag nodes to change relationships</p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <h4 style="color: #A8B5A6; margin-bottom: 15px;">Sacred Insights</h4>
                    <div id="field-insights" style="font-size: 0.9em; line-height: 1.6; color: #5A6B57;">
                        Welcome to the living laboratory of consciousness...
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(controlPanel);
        
        // Style the buttons
        const style = document.createElement('style');
        style.textContent = `
            .field-button {
                background: linear-gradient(135deg, #A8B5A6, #8A9E88);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9em;
                transition: all 0.3s ease;
            }
            .field-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(168, 181, 166, 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Canvas interaction
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Experiment buttons
        document.getElementById('experiment-harmony')?.addEventListener('click', () => this.runExperiment('harmony'));
        document.getElementById('experiment-conflict')?.addEventListener('click', () => this.runExperiment('conflict'));
        document.getElementById('experiment-healing')?.addEventListener('click', () => this.runExperiment('healing'));
    }

    // Node and Connection Management
    createNode(x, y, type = 'neutral', label = '') {
        return {
            id: Math.random().toString(36).substring(2, 15),
            x: x,
            y: y,
            type: type, // coherent, incoherent, neutral
            label: label,
            radius: 20,
            energy: type === 'coherent' ? 1 : type === 'incoherent' ? -1 : 0,
            connections: [],
            oscillation: Math.random() * Math.PI * 2,
            velocity: { x: 0, y: 0 }
        };
    }

    createConnection(node1, node2, quality = 'neutral') {
        const connection = {
            id: Math.random().toString(36).substring(2, 15),
            node1: node1.id,
            node2: node2.id,
            quality: quality, // harmony, tension, neutral
            strength: quality === 'harmony' ? 1 : quality === 'tension' ? -1 : 0,
            opacity: 0.5
        };
        
        node1.connections.push(connection.id);
        node2.connections.push(connection.id);
        
        return connection;
    }

    resetToDefault() {
        this.nodes = [];
        this.connections = [];
        
        // Create default configuration: Three beings in relationship
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        this.nodes.push(this.createNode(centerX - 100, centerY - 50, 'neutral', 'You'));
        this.nodes.push(this.createNode(centerX + 100, centerY - 50, 'neutral', 'Loved One'));
        this.nodes.push(this.createNode(centerX, centerY + 80, 'neutral', 'Situation'));
        
        // Create neutral connections
        this.connections.push(this.createConnection(this.nodes[0], this.nodes[1], 'neutral'));
        this.connections.push(this.createConnection(this.nodes[1], this.nodes[2], 'neutral'));
        this.connections.push(this.createConnection(this.nodes[0], this.nodes[2], 'neutral'));
        
        this.updateFieldCoherence();
        this.updateInsights("Drag the consciousness nodes to explore how relationship quality affects the entire field.");
    }

    // Simulation Logic
    calculateFieldCoherence() {
        if (this.nodes.length === 0) return 0.5;
        
        let totalEnergy = 0;
        let connectionInfluence = 0;
        
        // Calculate node energy contribution
        this.nodes.forEach(node => {
            totalEnergy += node.energy;
        });
        
        // Calculate connection influence
        this.connections.forEach(connection => {
            connectionInfluence += connection.strength;
        });
        
        // Distance between nodes affects coherence
        let distanceInfluence = 0;
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                const optimalDistance = 150;
                const distanceRatio = Math.abs(distance - optimalDistance) / optimalDistance;
                distanceInfluence -= distanceRatio * 0.1; // Penalty for non-optimal distances
            }
        }
        
        // Combine all influences
        const rawCoherence = 0.5 + (totalEnergy * 0.2) + (connectionInfluence * 0.2) + distanceInfluence;
        return Math.max(0, Math.min(1, rawCoherence));
    }

    updateFieldCoherence() {
        this.fieldCoherence = this.calculateFieldCoherence();
        
        // Update visual coherence meter
        const coherenceFill = document.getElementById('coherence-fill');
        const coherenceText = document.getElementById('coherence-text');
        
        if (coherenceFill && coherenceText) {
            coherenceFill.style.width = `${this.fieldCoherence * 100}%`;
            coherenceText.textContent = `${Math.round(this.fieldCoherence * 100)}%`;
            
            // Update Sacred Field state
            if (window.SacredField) {
                const delta = this.fieldCoherence - 0.5; // Baseline of 0.5
                window.SacredField.updateFieldCoherence(delta * 0.1, 'Field Simulator interaction');
            }
        }
    }

    // Experiment Scenarios
    runExperiment(type) {
        switch (type) {
            case 'harmony':
                this.createHarmonyExperiment();
                break;
            case 'conflict':
                this.createConflictExperiment();
                break;
            case 'healing':
                this.createHealingExperiment();
                break;
        }
    }

    createHarmonyExperiment() {
        // Transform all nodes to coherent and connections to harmony
        this.nodes.forEach(node => {
            node.type = 'coherent';
            node.energy = 1;
        });
        
        this.connections.forEach(connection => {
            connection.quality = 'harmony';
            connection.strength = 1;
        });
        
        this.updateFieldCoherence();
        this.updateInsights("🌟 Harmony Activated: Notice how coherent beings naturally create a field that supports everyone's wellbeing. This is what happens when we practice the Seven Harmonies together.");
    }

    createConflictExperiment() {
        // Create tension in relationships
        this.nodes[0].type = 'incoherent';
        this.nodes[0].energy = -1;
        
        this.connections.forEach(connection => {
            if (connection.node1 === this.nodes[0].id || connection.node2 === this.nodes[0].id) {
                connection.quality = 'tension';
                connection.strength = -1;
            }
        });
        
        this.updateFieldCoherence();
        this.updateInsights("⚡ Conflict Introduced: One incoherent being affects the entire field. Notice how tension spreads through connections. This shows why boundaries and personal healing matter for collective wellbeing.");
    }

    createHealingExperiment() {
        // Demonstrate field healing
        const healingNode = this.createNode(this.width / 2, this.height / 2 - 100, 'coherent', 'Healer');
        healingNode.energy = 1.5; // Extra coherent
        this.nodes.push(healingNode);
        
        // Connect healer to all other nodes with harmony
        this.nodes.slice(0, -1).forEach(node => {
            const healingConnection = this.createConnection(healingNode, node, 'harmony');
            this.connections.push(healingConnection);
        });
        
        // Gradually heal other nodes
        setTimeout(() => {
            this.nodes.forEach(node => {
                if (node.id !== healingNode.id) {
                    node.type = 'coherent';
                    node.energy = 0.8;
                }
            });
            this.updateFieldCoherence();
        }, 1000);
        
        this.updateFieldCoherence();
        this.updateInsights("🌿 Healing Presence: A single coherent being can transform an entire field. This is the power of embodied practice—your presence becomes medicine for the collective field.");
    }

    // Rendering
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw field background
        this.drawFieldBackground();
        
        // Draw connections
        this.connections.forEach(connection => this.drawConnection(connection));
        
        // Draw nodes
        this.nodes.forEach(node => this.drawNode(node));
        
        // Update node oscillations
        this.nodes.forEach(node => {
            node.oscillation += 0.02;
        });
    }

    drawFieldBackground() {
        // Create field visualization based on coherence
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width / 2
        );
        
        if (this.fieldCoherence > 0.6) {
            gradient.addColorStop(0, 'rgba(168, 181, 166, 0.2)');
            gradient.addColorStop(1, 'rgba(168, 181, 166, 0.05)');
        } else if (this.fieldCoherence < 0.4) {
            gradient.addColorStop(0, 'rgba(255, 107, 107, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 107, 107, 0.05)');
        } else {
            gradient.addColorStop(0, 'rgba(179, 197, 215, 0.2)');
            gradient.addColorStop(1, 'rgba(179, 197, 215, 0.05)');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawNode(node) {
        const oscillation = Math.sin(node.oscillation) * 2;
        const x = node.x;
        const y = node.y + oscillation;
        
        // Node color based on type
        let color = this.colors.neutral;
        if (node.type === 'coherent') color = this.colors.coherent;
        if (node.type === 'incoherent') color = this.colors.incoherent;
        
        // Draw node glow
        const glowRadius = node.radius + Math.abs(node.energy) * 10;
        const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        glowGradient.addColorStop(0, color + '40');
        glowGradient.addColorStop(1, color + '00');
        
        this.ctx.fillStyle = glowGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw main node
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, node.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw node border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw label
        this.ctx.fillStyle = '#2C2C2C';
        this.ctx.font = '12px Georgia';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.label, x, y + node.radius + 20);
    }

    drawConnection(connection) {
        const node1 = this.nodes.find(n => n.id === connection.node1);
        const node2 = this.nodes.find(n => n.id === connection.node2);
        
        if (!node1 || !node2) return;
        
        // Connection color based on quality
        let color = this.colors.connection;
        if (connection.quality === 'harmony') color = this.colors.coherent;
        if (connection.quality === 'tension') color = this.colors.incoherent;
        
        // Draw connection line
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = Math.abs(connection.strength) * 3 + 1;
        this.ctx.globalAlpha = connection.opacity;
        
        this.ctx.beginPath();
        this.ctx.moveTo(node1.x, node1.y);
        this.ctx.lineTo(node2.x, node2.y);
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
        
        // Draw energy flow particles
        if (Math.abs(connection.strength) > 0.5) {
            this.drawEnergyFlow(node1, node2, connection);
        }
    }

    drawEnergyFlow(node1, node2, connection) {
        const time = Date.now() * 0.002;
        const flowDirection = connection.strength > 0 ? 1 : -1;
        
        // Calculate positions along the line
        for (let i = 0; i < 3; i++) {
            const progress = (time + i * 0.3) % 1;
            const x = node1.x + (node2.x - node1.x) * progress;
            const y = node1.y + (node2.y - node1.y) * progress;
            
            this.ctx.fillStyle = connection.quality === 'harmony' ? this.colors.coherent : this.colors.incoherent;
            this.ctx.globalAlpha = 0.7;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
    }

    // Interaction Handling
    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Find clicked node
        this.selectedNode = this.nodes.find(node => {
            const distance = this.getDistance({ x, y }, node);
            return distance <= node.radius;
        });
        
        if (this.selectedNode) {
            this.dragOffset.x = x - this.selectedNode.x;
            this.dragOffset.y = y - this.selectedNode.y;
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (this.selectedNode) {
            this.selectedNode.x = x - this.dragOffset.x;
            this.selectedNode.y = y - this.dragOffset.y;
            
            // Keep node within bounds
            this.selectedNode.x = Math.max(this.selectedNode.radius, Math.min(this.width - this.selectedNode.radius, this.selectedNode.x));
            this.selectedNode.y = Math.max(this.selectedNode.radius, Math.min(this.height - this.selectedNode.radius, this.selectedNode.y));
            
            this.updateFieldCoherence();
        } else {
            // Check for hover
            const hoveredNode = this.nodes.find(node => {
                const distance = this.getDistance({ x, y }, node);
                return distance <= node.radius;
            });
            
            this.canvas.style.cursor = hoveredNode ? 'grab' : 'pointer';
        }
    }

    handleMouseUp() {
        this.selectedNode = null;
        this.canvas.style.cursor = 'pointer';
    }

    // Utility Methods
    getDistance(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    updateInsights(message) {
        const insightsDiv = document.getElementById('field-insights');
        if (insightsDiv) {
            insightsDiv.textContent = message;
        }
    }

    // Animation Loop
    startAnimation() {
        this.isPlaying = true;
        this.animationLoop();
    }

    animationLoop() {
        if (!this.isPlaying) return;
        
        this.render();
        requestAnimationFrame(() => this.animationLoop());
    }

    // Public API
    destroy() {
        this.isPlaying = false;
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.FieldSimulator = FieldSimulator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FieldSimulator;
}