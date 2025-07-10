/**
 * Network Visualization for LuminousOS
 * 
 * Visualizes the collective coherence field with:
 * - Connected nodes as coherence orbs
 * - Energy flows between nodes
 * - Collective field strength
 * - Real-time coherence updates
 */

class NetworkVisualization {
    constructor(canvas, networkClient) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.client = networkClient;
        
        // Visual settings
        this.settings = {
            nodeSize: 40,
            connectionOpacity: 0.3,
            pulseSpeed: 0.001,
            flowSpeed: 0.5,
            glowIntensity: 0.8
        };
        
        // Animation state
        this.particles = [];
        this.connections = new Map();
        this.pulsePhase = 0;
        this.time = 0;
        
        // Start animation
        this.animate();
    }
    
    animate() {
        this.time += 1;
        this.pulsePhase += this.settings.pulseSpeed;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Get current network state
        const networkState = this.client.getNetworkState();
        
        if (networkState.connected) {
            // Draw field background
            this.drawCoherenceField(networkState);
            
            // Draw connections
            this.drawConnections(networkState);
            
            // Draw nodes
            this.drawNodes(networkState);
            
            // Update and draw particles
            this.updateParticles(networkState);
            this.drawParticles();
            
            // Draw statistics
            this.drawStatistics(networkState);
        } else {
            this.drawDisconnectedState();
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawCoherenceField(networkState) {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Field strength based on collective coherence
        const fieldStrength = networkState.fieldCoherence;
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        
        // Colors based on field strength
        const innerAlpha = fieldStrength * 0.3;
        const outerAlpha = fieldStrength * 0.1;
        
        gradient.addColorStop(0, `rgba(107, 70, 193, ${innerAlpha})`);
        gradient.addColorStop(0.5, `rgba(236, 72, 153, ${outerAlpha})`);
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add sacred geometry overlay
        this.drawSacredPattern(fieldStrength);
    }
    
    drawSacredPattern(intensity) {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        ctx.save();
        ctx.globalAlpha = intensity * 0.2;
        ctx.strokeStyle = '#6B46C1';
        ctx.lineWidth = 1;
        
        // Draw flower of life pattern
        const radius = 100 * (1 + Math.sin(this.pulsePhase) * 0.1);
        const count = 6;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawConnections(networkState) {
        const ctx = this.ctx;
        const sharedField = networkState.sharedField;
        
        if (!sharedField || sharedField.size < 2) return;
        
        const nodes = Array.from(sharedField.values());
        
        // Draw connections between all nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                
                // Connection strength based on coherence similarity
                const coherenceDiff = Math.abs(node1.coherence - node2.coherence);
                const connectionStrength = 1 - coherenceDiff;
                
                ctx.save();
                ctx.strokeStyle = `rgba(255, 255, 255, ${connectionStrength * this.settings.connectionOpacity})`;
                ctx.lineWidth = connectionStrength * 3;
                ctx.setLineDash([5, 5]);
                ctx.lineDashOffset = this.time * 0.1;
                
                const x1 = this.canvas.width / 2 + node1.position.x;
                const y1 = this.canvas.height / 2 + node1.position.y;
                const x2 = this.canvas.width / 2 + node2.position.x;
                const y2 = this.canvas.height / 2 + node2.position.y;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                
                ctx.restore();
                
                // Create energy flow particles
                if (Math.random() < connectionStrength * 0.02) {
                    this.createFlowParticle(x1, y1, x2, y2, connectionStrength);
                }
            }
        }
    }
    
    drawNodes(networkState) {
        const ctx = this.ctx;
        const sharedField = networkState.sharedField;
        
        if (!sharedField) return;
        
        sharedField.forEach((node, nodeId) => {
            const x = this.canvas.width / 2 + node.position.x;
            const y = this.canvas.height / 2 + node.position.y;
            const isLocal = nodeId === networkState.nodeId;
            
            // Draw glow
            const glowSize = this.settings.nodeSize * (1 + Math.sin(this.pulsePhase + node.coherence * Math.PI) * 0.2);
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize * 2);
            
            glowGradient.addColorStop(0, `${node.color}88`);
            glowGradient.addColorStop(1, `${node.color}00`);
            
            ctx.fillStyle = glowGradient;
            ctx.globalAlpha = this.settings.glowIntensity * node.coherence;
            ctx.beginPath();
            ctx.arc(x, y, glowSize * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Draw node
            const nodeGradient = ctx.createRadialGradient(
                x - glowSize * 0.3,
                y - glowSize * 0.3,
                0,
                x, y, glowSize
            );
            
            nodeGradient.addColorStop(0, this.lightenColor(node.color, 30));
            nodeGradient.addColorStop(1, node.color);
            
            ctx.fillStyle = nodeGradient;
            ctx.beginPath();
            ctx.arc(x, y, glowSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw ring for local node
            if (isLocal) {
                ctx.strokeStyle = '#F59E0B';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(x, y, glowSize + 5, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Draw coherence percentage
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.round(node.coherence * 100)}%`, x, y);
            
            // Draw node ID
            ctx.font = '12px monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText(nodeId.substring(0, 8), x, y + glowSize + 15);
        });
    }
    
    createFlowParticle(x1, y1, x2, y2, strength) {
        this.particles.push({
            x: x1,
            y: y1,
            targetX: x2,
            targetY: y2,
            progress: 0,
            speed: this.settings.flowSpeed * (0.5 + strength * 0.5),
            size: 3 + strength * 3,
            color: `rgba(255, 255, 255, ${strength * 0.8})`,
            life: 1
        });
    }
    
    updateParticles(networkState) {
        this.particles = this.particles.filter(particle => {
            // Move particle along path
            particle.progress += particle.speed * 0.02;
            
            if (particle.progress >= 1) {
                // Particle reached destination
                return false;
            }
            
            // Update position
            const t = particle.progress;
            particle.x = particle.x + (particle.targetX - particle.x) * particle.speed * 0.02;
            particle.y = particle.y + (particle.targetY - particle.y) * particle.speed * 0.02;
            
            return true;
        });
        
        // Create coherence burst particles
        if (networkState.peerCount > 0 && Math.random() < 0.02) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 200;
            
            this.particles.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                targetX: centerX,
                targetY: centerY,
                progress: 0,
                speed: 1,
                size: 5,
                color: 'rgba(16, 185, 129, 0.8)',
                life: 1
            });
        }
    }
    
    drawParticles() {
        const ctx = this.ctx;
        
        this.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.life * (1 - particle.progress);
            
            // Glow
            const glowGradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            glowGradient.addColorStop(0, particle.color);
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Core
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }
    
    drawStatistics(networkState) {
        const ctx = this.ctx;
        const x = 20;
        const y = this.canvas.height - 100;
        
        ctx.save();
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x - 10, y - 20, 300, 90);
        
        // Text
        ctx.fillStyle = '#fff';
        ctx.font = '14px monospace';
        
        ctx.fillText(`Network Nodes: ${networkState.peerCount + 1}`, x, y);
        ctx.fillText(`Network Coherence: ${Math.round(networkState.networkCoherence * 100)}%`, x, y + 20);
        ctx.fillText(`Field Coherence: ${Math.round(networkState.fieldCoherence * 100)}%`, x, y + 40);
        ctx.fillText(`Status: ${networkState.connected ? 'Connected' : 'Disconnected'}`, x, y + 60);
        
        ctx.restore();
    }
    
    drawDisconnectedState() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText('Connecting to Luminous Network...', centerX, centerY);
        
        // Spinning loader
        ctx.save();
        ctx.translate(centerX, centerY + 50);
        ctx.rotate(this.time * 0.05);
        
        ctx.strokeStyle = 'rgba(107, 70, 193, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 1.5);
        ctx.stroke();
        
        ctx.restore();
    }
    
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
    
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

// Export for use
window.NetworkVisualization = NetworkVisualization;