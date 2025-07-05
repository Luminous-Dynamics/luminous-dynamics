/**
 * Mycelial Filesystem for LuminousOS
 * 
 * A living data ecosystem where:
 * - Files are nodes in a mycelial network
 * - Data exchanges nutrients through hyphae connections
 * - Access requires coherence-based rituals
 * - Information evolves through use
 * - Spore-based distributed backup
 */

class MycelialFilesystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = new Map();
        this.connections = new Map();
        this.nutrients = [];
        this.spores = [];
        this.selectedNode = null;
        this.coherenceLevel = 0.7;
        this.time = 0;
        
        // Visual settings
        this.settings = {
            nodeMinSize: 20,
            nodeMaxSize: 60,
            connectionOpacity: 0.3,
            nutrientSpeed: 0.5,
            sporeEmissionRate: 0.02,
            glowIntensity: 0.8,
            hyphaePulseSpeed: 0.001
        };
        
        // Node types with sacred properties
        this.nodeTypes = {
            wisdom: { color: '#6B46C1', resonance: 0.9, nutrientType: 'insight' },
            memory: { color: '#EC4899', resonance: 0.7, nutrientType: 'experience' },
            vision: { color: '#10B981', resonance: 0.8, nutrientType: 'possibility' },
            practice: { color: '#F59E0B', resonance: 0.6, nutrientType: 'embodiment' },
            shadow: { color: '#1E293B', resonance: 0.4, nutrientType: 'integration' },
            collective: { color: '#3B82F6', resonance: 1.0, nutrientType: 'unity' }
        };
        
        this.init();
    }
    
    init() {
        // Create initial mycelial network
        this.generateInitialNetwork();
        
        // Start animation
        this.animate();
        
        // Handle interactions
        this.setupInteractions();
    }
    
    generateInitialNetwork() {
        // Create root node (The Source)
        const rootId = 'source';
        this.createNode(rootId, {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            type: 'collective',
            name: 'The Source',
            size: 60,
            vitality: 1.0,
            lastAccessed: Date.now(),
            nutrients: 100,
            sacred: true
        });
        
        // Create primary nodes around the source
        const primaryTypes = ['wisdom', 'memory', 'vision', 'practice'];
        const angleStep = (Math.PI * 2) / primaryTypes.length;
        
        primaryTypes.forEach((type, i) => {
            const angle = i * angleStep;
            const radius = 150;
            const x = this.canvas.width / 2 + Math.cos(angle) * radius;
            const y = this.canvas.height / 2 + Math.sin(angle) * radius;
            
            const nodeId = `primary-${type}`;
            this.createNode(nodeId, {
                x, y,
                type,
                name: this.generateNodeName(type),
                size: 40,
                vitality: 0.8,
                lastAccessed: Date.now() - Math.random() * 1000000,
                nutrients: 50,
                sacred: false
            });
            
            // Connect to source
            this.createConnection(rootId, nodeId, 0.8);
            
            // Create secondary nodes
            this.generateSecondaryNodes(nodeId, type, x, y);
        });
        
        // Add some shadow nodes for integration work
        this.generateShadowNodes();
    }
    
    generateSecondaryNodes(parentId, parentType, parentX, parentY) {
        const count = 3 + Math.floor(Math.random() * 3);
        const angleSpread = Math.PI / 2;
        const baseAngle = Math.atan2(parentY - this.canvas.height / 2, parentX - this.canvas.width / 2);
        
        for (let i = 0; i < count; i++) {
            const angle = baseAngle + (Math.random() - 0.5) * angleSpread;
            const radius = 80 + Math.random() * 50;
            const x = parentX + Math.cos(angle) * radius;
            const y = parentY + Math.sin(angle) * radius;
            
            // Keep within bounds
            if (x < 50 || x > this.canvas.width - 50 || y < 50 || y > this.canvas.height - 50) {
                continue;
            }
            
            const nodeId = `${parentId}-child-${i}`;
            const type = Math.random() < 0.7 ? parentType : this.randomType();
            
            this.createNode(nodeId, {
                x, y,
                type,
                name: this.generateNodeName(type),
                size: 20 + Math.random() * 20,
                vitality: 0.3 + Math.random() * 0.5,
                lastAccessed: Date.now() - Math.random() * 10000000,
                nutrients: 10 + Math.random() * 30,
                sacred: Math.random() < 0.1
            });
            
            // Connect to parent
            this.createConnection(parentId, nodeId, 0.5 + Math.random() * 0.3);
            
            // Occasionally create cross-connections
            if (Math.random() < 0.3) {
                const otherNodes = Array.from(this.nodes.keys()).filter(id => 
                    id !== nodeId && id !== parentId && id !== 'source'
                );
                if (otherNodes.length > 0) {
                    const otherId = otherNodes[Math.floor(Math.random() * otherNodes.length)];
                    this.createConnection(nodeId, otherId, 0.2 + Math.random() * 0.3);
                }
            }
        }
    }
    
    generateShadowNodes() {
        // Shadow nodes represent hidden or suppressed data
        const shadowCount = 3;
        
        for (let i = 0; i < shadowCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 200 + Math.random() * 100;
            const x = this.canvas.width / 2 + Math.cos(angle) * radius;
            const y = this.canvas.height / 2 + Math.sin(angle) * radius;
            
            const nodeId = `shadow-${i}`;
            this.createNode(nodeId, {
                x, y,
                type: 'shadow',
                name: this.generateShadowName(),
                size: 30,
                vitality: 0.2 + Math.random() * 0.3,
                lastAccessed: Date.now() - Math.random() * 100000000,
                nutrients: 5 + Math.random() * 15,
                sacred: true,
                hidden: true
            });
            
            // Shadow nodes have weak connections
            const connectedNodes = Array.from(this.nodes.keys()).filter(id => 
                id !== nodeId && Math.random() < 0.2
            );
            
            connectedNodes.forEach(otherId => {
                this.createConnection(nodeId, otherId, 0.1 + Math.random() * 0.2);
            });
        }
    }
    
    createNode(id, properties) {
        this.nodes.set(id, {
            id,
            ...properties,
            pulsePhase: Math.random() * Math.PI * 2,
            glowIntensity: 0,
            accessRitual: this.generateAccessRitual(properties.type),
            evolution: 0,
            connections: new Set()
        });
    }
    
    createConnection(fromId, toId, strength = 0.5) {
        const connectionId = `${fromId}-${toId}`;
        const reverseId = `${toId}-${fromId}`;
        
        // Avoid duplicate connections
        if (this.connections.has(connectionId) || this.connections.has(reverseId)) {
            return;
        }
        
        this.connections.set(connectionId, {
            from: fromId,
            to: toId,
            strength,
            pulseOffset: Math.random() * Math.PI * 2,
            nutrientFlow: 0,
            active: true
        });
        
        // Update node connections
        const fromNode = this.nodes.get(fromId);
        const toNode = this.nodes.get(toId);
        if (fromNode && toNode) {
            fromNode.connections.add(toId);
            toNode.connections.add(fromId);
        }
    }
    
    generateNodeName(type) {
        const names = {
            wisdom: ['Ancient Knowing', 'Sacred Teaching', 'Elder Memory', 'Deep Truth', 'Hidden Wisdom'],
            memory: ['First Meeting', 'Shared Journey', 'Sacred Moment', 'Held Experience', 'Living Story'],
            vision: ['Future Self', 'Emerging Pattern', 'Quantum Possibility', 'Dream Seed', 'Tomorrow\'s Gift'],
            practice: ['Daily Ritual', 'Sacred Method', 'Embodied Way', 'Living Practice', 'Active Prayer'],
            shadow: ['Hidden Truth', 'Forgotten Self', 'Dark Teaching', 'Shadow Gift', 'Buried Treasure'],
            collective: ['We Space', 'Shared Field', 'Unity Point', 'Collective Heart', 'One Mind']
        };
        
        const typeNames = names[type] || names.wisdom;
        return typeNames[Math.floor(Math.random() * typeNames.length)];
    }
    
    generateShadowName() {
        const shadowNames = [
            'What Was Denied',
            'The Unspoken',
            'Hidden Pattern',
            'Shadow Teaching',
            'Dark Mirror',
            'Forgotten Truth'
        ];
        return shadowNames[Math.floor(Math.random() * shadowNames.length)];
    }
    
    generateAccessRitual(type) {
        const rituals = {
            wisdom: { gesture: 'bow', breathCount: 3, minCoherence: 0.7 },
            memory: { gesture: 'touch-heart', breathCount: 1, minCoherence: 0.5 },
            vision: { gesture: 'open-hands', breathCount: 2, minCoherence: 0.6 },
            practice: { gesture: 'ground', breathCount: 1, minCoherence: 0.4 },
            shadow: { gesture: 'embrace', breathCount: 4, minCoherence: 0.8 },
            collective: { gesture: 'circle', breathCount: 7, minCoherence: 0.9 }
        };
        
        return rituals[type] || rituals.wisdom;
    }
    
    randomType() {
        const types = Object.keys(this.nodeTypes);
        return types[Math.floor(Math.random() * types.length)];
    }
    
    animate() {
        this.time += 1;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw connections (hyphae)
        this.updateConnections();
        this.drawConnections();
        
        // Update and draw nutrients
        this.updateNutrients();
        this.drawNutrients();
        
        // Update and draw nodes
        this.updateNodes();
        this.drawNodes();
        
        // Update and draw spores
        this.updateSpores();
        this.drawSpores();
        
        // Draw field effects
        this.drawFieldEffects();
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateNodes() {
        this.nodes.forEach(node => {
            // Pulse based on vitality
            node.pulsePhase += 0.02 * node.vitality;
            
            // Decay vitality over time (aging)
            const age = Date.now() - node.lastAccessed;
            const ageDecay = age / (1000 * 60 * 60 * 24); // Days
            node.vitality = Math.max(0.1, node.vitality - ageDecay * 0.001);
            
            // Glow when selected or recently accessed
            if (node === this.selectedNode) {
                node.glowIntensity = Math.min(1, node.glowIntensity + 0.1);
            } else if (age < 5000) {
                node.glowIntensity = Math.min(0.5, node.glowIntensity + 0.05);
            } else {
                node.glowIntensity = Math.max(0, node.glowIntensity - 0.02);
            }
            
            // Emit spores based on nutrients and coherence
            if (node.nutrients > 30 && Math.random() < this.settings.sporeEmissionRate * this.coherenceLevel) {
                this.emitSpore(node);
            }
            
            // Evolution through use
            if (node.evolution < 1) {
                node.evolution += 0.0001 * node.vitality;
            }
        });
    }
    
    updateConnections() {
        this.connections.forEach(conn => {
            // Pulse along connections
            conn.pulseOffset += this.settings.hyphaePulseSpeed * (1 + this.coherenceLevel);
            
            // Nutrient flow based on gradient
            const fromNode = this.nodes.get(conn.from);
            const toNode = this.nodes.get(conn.to);
            
            if (fromNode && toNode) {
                const gradient = (fromNode.nutrients - toNode.nutrients) / 100;
                conn.nutrientFlow = gradient * conn.strength * 0.1;
                
                // Exchange nutrients
                if (Math.abs(conn.nutrientFlow) > 0.01 && this.time % 10 === 0) {
                    this.exchangeNutrients(fromNode, toNode, conn.nutrientFlow);
                }
            }
        });
    }
    
    updateNutrients() {
        // Update traveling nutrients
        this.nutrients = this.nutrients.filter(nutrient => {
            const target = this.nodes.get(nutrient.targetId);
            if (!target) return false;
            
            // Move toward target
            const dx = target.x - nutrient.x;
            const dy = target.y - nutrient.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 5) {
                // Nutrient reached target
                target.nutrients += nutrient.value;
                target.vitality = Math.min(1, target.vitality + 0.1);
                target.lastAccessed = Date.now(); // Refresh on nutrient arrival
                return false;
            }
            
            // Move nutrient
            nutrient.x += (dx / dist) * this.settings.nutrientSpeed * (1 + this.coherenceLevel);
            nutrient.y += (dy / dist) * this.settings.nutrientSpeed * (1 + this.coherenceLevel);
            nutrient.phase += 0.1;
            
            return true;
        });
    }
    
    updateSpores() {
        // Update floating spores
        this.spores = this.spores.filter(spore => {
            // Float upward and drift
            spore.y -= spore.speed;
            spore.x += Math.sin(spore.phase) * 0.5;
            spore.phase += 0.05;
            spore.life -= 0.005;
            
            // Fade out
            if (spore.life <= 0 || spore.y < -20) {
                return false;
            }
            
            // Check for germination opportunities
            if (Math.random() < 0.001 * this.coherenceLevel) {
                this.germinateSpore(spore);
                return false;
            }
            
            return true;
        });
    }
    
    exchangeNutrients(fromNode, toNode, amount) {
        const actualAmount = Math.min(Math.abs(amount), fromNode.nutrients * 0.1);
        
        if (amount > 0) {
            fromNode.nutrients -= actualAmount;
            toNode.nutrients += actualAmount;
        } else {
            toNode.nutrients -= actualAmount;
            fromNode.nutrients += actualAmount;
        }
        
        // Create visual nutrient particle
        this.nutrients.push({
            x: fromNode.x,
            y: fromNode.y,
            targetId: toNode.id,
            value: actualAmount,
            type: this.nodeTypes[fromNode.type].nutrientType,
            phase: 0,
            color: this.nodeTypes[fromNode.type].color
        });
    }
    
    emitSpore(node) {
        this.spores.push({
            x: node.x,
            y: node.y,
            speed: 0.5 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
            life: 1,
            sourceType: node.type,
            sourceId: node.id,
            data: {
                name: node.name,
                wisdom: node.evolution,
                nutrients: Math.floor(node.nutrients * 0.1)
            }
        });
    }
    
    germinateSpore(spore) {
        // Create new node from spore
        const nodeId = `germinated-${Date.now()}-${Math.random()}`;
        
        this.createNode(nodeId, {
            x: spore.x,
            y: spore.y,
            type: spore.sourceType,
            name: `${spore.data.name} (Reborn)`,
            size: 15,
            vitality: 0.5,
            lastAccessed: Date.now(),
            nutrients: spore.data.nutrients,
            sacred: false,
            evolution: spore.data.wisdom * 0.5
        });
        
        // Connect to nearby nodes
        const nearbyNodes = this.findNearbyNodes(spore.x, spore.y, 150);
        nearbyNodes.forEach(nearId => {
            this.createConnection(nodeId, nearId, 0.2 + Math.random() * 0.3);
        });
        
        // Visual effect
        this.createGerminationEffect(spore.x, spore.y);
    }
    
    findNearbyNodes(x, y, radius) {
        const nearby = [];
        
        this.nodes.forEach((node, id) => {
            const dx = node.x - x;
            const dy = node.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < radius && dist > 0) {
                nearby.push(id);
            }
        });
        
        return nearby;
    }
    
    createGerminationEffect(x, y) {
        // Create nutrients burst
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const targetNode = this.findNearbyNodes(x, y, 200)[0];
            
            if (targetNode) {
                this.nutrients.push({
                    x: x + Math.cos(angle) * 10,
                    y: y + Math.sin(angle) * 10,
                    targetId: targetNode,
                    value: 2,
                    type: 'emergence',
                    phase: 0,
                    color: '#10B981'
                });
            }
        }
    }
    
    drawConnections() {
        this.connections.forEach(conn => {
            const fromNode = this.nodes.get(conn.from);
            const toNode = this.nodes.get(conn.to);
            
            if (!fromNode || !toNode) return;
            
            const ctx = this.ctx;
            
            // Draw mycelial connection
            ctx.save();
            
            // Base connection
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.settings.connectionOpacity * conn.strength})`;
            ctx.lineWidth = 1 + conn.strength * 2;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = conn.pulseOffset * 10;
            
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            
            // Organic curve
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const cx = fromNode.x + dx * 0.5 + Math.sin(conn.pulseOffset) * 20;
            const cy = fromNode.y + dy * 0.5 + Math.cos(conn.pulseOffset) * 20;
            
            ctx.quadraticCurveTo(cx, cy, toNode.x, toNode.y);
            ctx.stroke();
            
            // Nutrient flow visualization
            if (Math.abs(conn.nutrientFlow) > 0.01) {
                ctx.strokeStyle = `rgba(16, 185, 129, ${Math.abs(conn.nutrientFlow) * 5})`;
                ctx.lineWidth = Math.abs(conn.nutrientFlow) * 20;
                ctx.setLineDash([]);
                ctx.stroke();
            }
            
            ctx.restore();
        });
    }
    
    drawNodes() {
        // Sort nodes by z-order (selected on top)
        const sortedNodes = Array.from(this.nodes.values()).sort((a, b) => {
            if (a === this.selectedNode) return 1;
            if (b === this.selectedNode) return -1;
            return a.size - b.size;
        });
        
        sortedNodes.forEach(node => {
            if (node.hidden && node.vitality < 0.3) return;
            
            const ctx = this.ctx;
            const type = this.nodeTypes[node.type];
            
            // Calculate visual properties
            const displaySize = node.size * (0.8 + Math.sin(node.pulsePhase) * 0.2);
            const alpha = node.hidden ? node.vitality * 0.5 : node.vitality;
            
            // Draw glow
            if (node.glowIntensity > 0) {
                const gradient = ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, displaySize * 2
                );
                gradient.addColorStop(0, `${type.color}88`);
                gradient.addColorStop(1, `${type.color}00`);
                
                ctx.fillStyle = gradient;
                ctx.globalAlpha = node.glowIntensity * this.settings.glowIntensity;
                ctx.beginPath();
                ctx.arc(node.x, node.y, displaySize * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            
            // Draw node
            const nodeGradient = ctx.createRadialGradient(
                node.x - displaySize * 0.3, 
                node.y - displaySize * 0.3, 
                0,
                node.x, node.y, displaySize
            );
            nodeGradient.addColorStop(0, this.lightenColor(type.color, 30));
            nodeGradient.addColorStop(1, type.color);
            
            ctx.fillStyle = nodeGradient;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(node.x, node.y, displaySize, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw inner ring for sacred nodes
            if (node.sacred) {
                ctx.strokeStyle = '#F59E0B';
                ctx.lineWidth = 2;
                ctx.globalAlpha = alpha * 0.8;
                ctx.beginPath();
                ctx.arc(node.x, node.y, displaySize * 0.8, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Draw evolution indicator
            if (node.evolution > 0.1) {
                ctx.strokeStyle = '#10B981';
                ctx.lineWidth = 3;
                ctx.globalAlpha = alpha * node.evolution;
                ctx.beginPath();
                ctx.arc(node.x, node.y, displaySize + 5, 0, Math.PI * 2 * node.evolution);
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
            
            // Draw name on hover or selection
            if (node === this.selectedNode || node.glowIntensity > 0.3) {
                ctx.font = '12px monospace';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.textAlign = 'center';
                ctx.fillText(node.name, node.x, node.y - displaySize - 10);
                
                // Show nutrients
                ctx.font = '10px monospace';
                ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
                ctx.fillText(`◉ ${Math.floor(node.nutrients)}`, node.x, node.y - displaySize - 25);
            }
        });
    }
    
    drawNutrients() {
        this.nutrients.forEach(nutrient => {
            const ctx = this.ctx;
            
            // Glowing particle
            const size = 3 + Math.sin(nutrient.phase) * 2;
            
            const gradient = ctx.createRadialGradient(
                nutrient.x, nutrient.y, 0,
                nutrient.x, nutrient.y, size * 2
            );
            gradient.addColorStop(0, `${nutrient.color}FF`);
            gradient.addColorStop(1, `${nutrient.color}00`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(nutrient.x, nutrient.y, size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Core
            ctx.fillStyle = nutrient.color;
            ctx.beginPath();
            ctx.arc(nutrient.x, nutrient.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawSpores() {
        this.spores.forEach(spore => {
            const ctx = this.ctx;
            
            // Floating spore with glow
            ctx.save();
            ctx.globalAlpha = spore.life;
            
            // Glow
            const glowGradient = ctx.createRadialGradient(
                spore.x, spore.y, 0,
                spore.x, spore.y, 10
            );
            glowGradient.addColorStop(0, 'rgba(249, 158, 11, 0.5)');
            glowGradient.addColorStop(1, 'rgba(249, 158, 11, 0)');
            
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(spore.x, spore.y, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Spore body
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(spore.x, spore.y, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Trail
            ctx.strokeStyle = 'rgba(249, 158, 11, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(spore.x, spore.y);
            ctx.lineTo(spore.x - Math.sin(spore.phase) * 5, spore.y + 10);
            ctx.stroke();
            
            ctx.restore();
        });
    }
    
    drawFieldEffects() {
        const ctx = this.ctx;
        
        // Draw coherence field
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const fieldGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        
        fieldGradient.addColorStop(0, `rgba(107, 70, 193, ${this.coherenceLevel * 0.1})`);
        fieldGradient.addColorStop(0.5, `rgba(107, 70, 193, ${this.coherenceLevel * 0.05})`);
        fieldGradient.addColorStop(1, 'rgba(107, 70, 193, 0)');
        
        ctx.fillStyle = fieldGradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    setupInteractions() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find node under cursor
            let hoveredNode = null;
            this.nodes.forEach(node => {
                const dx = node.x - x;
                const dy = node.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < node.size) {
                    hoveredNode = node;
                }
            });
            
            // Update cursor
            this.canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
            
            // Update hover state
            if (hoveredNode && hoveredNode !== this.selectedNode) {
                hoveredNode.glowIntensity = Math.min(0.5, hoveredNode.glowIntensity + 0.1);
            }
        });
        
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find clicked node
            let clickedNode = null;
            this.nodes.forEach(node => {
                const dx = node.x - x;
                const dy = node.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < node.size) {
                    clickedNode = node;
                }
            });
            
            if (clickedNode) {
                this.accessNode(clickedNode);
            } else {
                this.selectedNode = null;
            }
        });
    }
    
    accessNode(node) {
        // Check coherence requirement
        const ritual = node.accessRitual;
        
        if (this.coherenceLevel < ritual.minCoherence) {
            this.showAccessDenied(node, ritual);
            return;
        }
        
        // Node accessed successfully
        this.selectedNode = node;
        node.lastAccessed = Date.now();
        node.vitality = Math.min(1, node.vitality + 0.2);
        node.nutrients += 10;
        
        // Send nutrients to connected nodes
        node.connections.forEach(connectedId => {
            const target = this.nodes.get(connectedId);
            if (target) {
                this.nutrients.push({
                    x: node.x,
                    y: node.y,
                    targetId: connectedId,
                    value: 5,
                    type: this.nodeTypes[node.type].nutrientType,
                    phase: 0,
                    color: this.nodeTypes[node.type].color
                });
            }
        });
        
        // Emit access event
        this.onNodeAccess(node);
    }
    
    showAccessDenied(node, ritual) {
        // Visual feedback for denied access
        const ctx = this.ctx;
        ctx.save();
        
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;
        
        // Draw X
        const size = node.size;
        ctx.beginPath();
        ctx.moveTo(node.x - size, node.y - size);
        ctx.lineTo(node.x + size, node.y + size);
        ctx.moveTo(node.x + size, node.y - size);
        ctx.lineTo(node.x - size, node.y + size);
        ctx.stroke();
        
        // Show requirement
        ctx.font = '14px monospace';
        ctx.fillStyle = '#EF4444';
        ctx.textAlign = 'center';
        ctx.fillText(
            `Requires ${Math.floor(ritual.minCoherence * 100)}% coherence`,
            node.x, node.y + size + 20
        );
        
        ctx.restore();
        
        // Emit denied event
        this.onAccessDenied(node, ritual);
    }
    
    // Event handlers (to be overridden)
    onNodeAccess(node) {
        console.log(`Accessed: ${node.name} (${node.type})`);
    }
    
    onAccessDenied(node, ritual) {
        console.log(`Access denied: ${node.name} requires ${ritual.minCoherence} coherence`);
    }
    
    // Utility methods
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
    
    // Public API
    setCoherence(level) {
        this.coherenceLevel = Math.max(0, Math.min(1, level));
    }
    
    getNodeInfo(nodeId) {
        return this.nodes.get(nodeId);
    }
    
    getAllNodes() {
        return Array.from(this.nodes.values());
    }
    
    getConnections() {
        return Array.from(this.connections.values());
    }
}

// Export for use
window.MycelialFilesystem = MycelialFilesystem;