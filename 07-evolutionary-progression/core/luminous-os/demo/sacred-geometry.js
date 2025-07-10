/**
 * Sacred Geometry Engine for LuminousOS Mandala UI
 * Creates living, breathing geometric patterns that respond to consciousness
 */

class SacredGeometryEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.time = 0;
        this.coherence = 0.7;
        this.fieldState = new Float32Array(128); // Simulated field state
        
        // Sacred ratios
        this.phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
        this.sacredAngles = [0, 60, 120, 180, 240, 300].map(a => a * Math.PI / 180);
        
        // Initialize field state with harmonic frequencies
        for (let i = 0; i < this.fieldState.length; i++) {
            this.fieldState[i] = Math.sin(i * 0.1) * 0.5 + 0.5;
        }
    }

    update(coherence, networkState) {
        this.coherence = coherence;
        this.time += 0.01;
        
        // Update field state based on network
        for (let i = 0; i < this.fieldState.length; i++) {
            this.fieldState[i] = (this.fieldState[i] * 0.95) + 
                (Math.sin(this.time + i * 0.1) * 0.05 * coherence);
        }
    }

    render() {
        // Clear with subtle trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw Flower of Life base pattern
        this.drawFlowerOfLife();
        
        // Draw Sri Yantra inspired triangles
        this.drawSacredTriangles();
        
        // Draw coherence waves
        this.drawCoherenceWaves();
        
        // Draw field state visualization
        this.drawFieldState();
        
        // Draw Metatron's Cube connections
        this.drawMetatronsCube();
    }

    drawFlowerOfLife() {
        const baseRadius = 60;
        const circles = 7;
        
        this.ctx.strokeStyle = `rgba(107, 70, 193, ${0.1 * this.coherence})`;
        this.ctx.lineWidth = 1;
        
        // Center circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, baseRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Surrounding circles
        for (let i = 0; i < 6; i++) {
            const angle = this.sacredAngles[i] + this.time * 0.1;
            const x = this.centerX + Math.cos(angle) * baseRadius;
            const y = this.centerY + Math.sin(angle) * baseRadius;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Second ring
            for (let j = 0; j < 6; j++) {
                const angle2 = this.sacredAngles[j] + this.time * 0.05;
                const x2 = x + Math.cos(angle2) * baseRadius;
                const y2 = y + Math.sin(angle2) * baseRadius;
                
                this.ctx.beginPath();
                this.ctx.arc(x2, y2, baseRadius * 0.5, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }
    }

    drawSacredTriangles() {
        const triangleSize = 150;
        
        // Upward triangle
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.time * 0.02);
        
        this.ctx.strokeStyle = `rgba(236, 72, 153, ${0.3 * this.coherence})`;
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * triangleSize;
            const y = Math.sin(angle) * triangleSize;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Downward triangle
        this.ctx.rotate(Math.PI);
        this.ctx.strokeStyle = `rgba(107, 70, 193, ${0.3 * this.coherence})`;
        
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * triangleSize;
            const y = Math.sin(angle) * triangleSize;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawCoherenceWaves() {
        const waveCount = 5;
        const maxRadius = Math.min(this.width, this.height) * 0.4;
        
        for (let i = 0; i < waveCount; i++) {
            const phase = (i / waveCount) + this.time;
            const radius = (Math.sin(phase) + 1) * 0.5 * maxRadius;
            const alpha = (1 - i / waveCount) * 0.2 * this.coherence;
            
            this.ctx.strokeStyle = `rgba(107, 70, 193, ${alpha})`;
            this.ctx.lineWidth = 2;
            
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    drawFieldState() {
        const segments = 64;
        const maxRadius = Math.min(this.width, this.height) * 0.35;
        
        this.ctx.strokeStyle = `rgba(16, 185, 129, ${0.5 * this.coherence})`;
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const fieldIndex = Math.floor((i / segments) * this.fieldState.length);
            const radius = maxRadius * (0.7 + 0.3 * this.fieldState[fieldIndex]);
            
            const x = this.centerX + Math.cos(angle - Math.PI / 2) * radius;
            const y = this.centerY + Math.sin(angle - Math.PI / 2) * radius;
            
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawMetatronsCube() {
        const nodeRadius = 100;
        const nodes = [];
        
        // Create nodes
        for (let i = 0; i < 6; i++) {
            const angle = this.sacredAngles[i];
            nodes.push({
                x: this.centerX + Math.cos(angle) * nodeRadius,
                y: this.centerY + Math.sin(angle) * nodeRadius
            });
        }
        
        // Add center node
        nodes.push({ x: this.centerX, y: this.centerY });
        
        // Draw connections with varying opacity based on coherence
        this.ctx.strokeStyle = `rgba(255, 215, 0, ${0.1 * this.coherence})`;
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(nodes[i].x - nodes[j].x, 2) + 
                    Math.pow(nodes[i].y - nodes[j].y, 2)
                );
                
                // Only draw connections within sacred distance
                if (distance < nodeRadius * 2.5) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(nodes[i].x, nodes[i].y);
                    this.ctx.lineTo(nodes[j].x, nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        nodes.forEach(node => {
            this.ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * this.coherence})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}

// Particle system for sacred energy visualization
class SacredParticle {
    constructor(x, y, coherence) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.maxLife = 1;
        this.coherence = coherence;
        this.size = Math.random() * 3 + 1;
    }

    update(centerX, centerY, coherence) {
        // Attract to center based on coherence
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) {
            this.vx += (dx / distance) * coherence * 0.1;
            this.vy += (dy / distance) * coherence * 0.1;
        }
        
        // Apply velocity with damping
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // Fade out
        this.life -= 0.01;
    }

    draw(ctx) {
        const alpha = this.life * this.coherence;
        ctx.fillStyle = `rgba(107, 70, 193, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Export for use in main demo
window.SacredGeometryEngine = SacredGeometryEngine;
window.SacredParticle = SacredParticle;