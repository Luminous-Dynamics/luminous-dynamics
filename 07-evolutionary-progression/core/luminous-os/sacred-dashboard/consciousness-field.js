// LuminousOS Sacred Consciousness Field Visualization
// "Making the invisible visible through sacred geometry"

class ConsciousnessField {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        
        // Field state
        this.processes = new Map();
        this.entanglements = [];
        this.globalCoherence = 0.75;
        this.particles = [];
        this.pulsePhase = 0;
        this.time = 0;
        
        // Sacred pulse timing
        this.lastPulse = Date.now();
        this.pulseInterval = 11000; // 11 seconds
        
        // Visual settings
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        // Messages
        this.messages = [];
        
        // Bind resize handler
        window.addEventListener('resize', () => this.resize());
        
        // Start animation
        this.animate();
        
        // Start sacred pulse timer
        this.startSacredPulse();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    addProcess(id, name, coherence = 0.5, type = 'default') {
        const angle = Math.random() * Math.PI * 2;
        const radius = 200 + Math.random() * 150;
        
        this.processes.set(id, {
            id,
            name,
            coherence,
            type,
            x: this.centerX + Math.cos(angle) * radius,
            y: this.centerY + Math.sin(angle) * radius,
            vx: 0,
            vy: 0,
            radius: 20 + coherence * 30,
            pulsePhase: Math.random() * Math.PI * 2,
            pattern: this.getPattern(type),
            targetX: null,
            targetY: null
        });
        
        this.updateStats();
        this.checkAutoEntanglement(id);
    }
    
    getPattern(type) {
        const patterns = {
            meditation: 'SriYantra',
            creative: 'GoldenSpiral',
            code: 'Metatron',
            browser: 'Torus',
            default: 'FlowerOfLife'
        };
        return patterns[type] || patterns.default;
    }
    
    checkAutoEntanglement(newId) {
        const newProc = this.processes.get(newId);
        
        this.processes.forEach((proc, id) => {
            if (id !== newId) {
                const resonance = this.calculateResonance(newProc, proc);
                if (resonance > 0.7) {
                    this.entangle(newId, id, resonance);
                }
            }
        });
    }
    
    calculateResonance(proc1, proc2) {
        // Coherence similarity
        const coherenceDiff = Math.abs(proc1.coherence - proc2.coherence);
        const coherenceResonance = 1 - coherenceDiff;
        
        // Pattern bonus
        const patternBonus = proc1.pattern === proc2.pattern ? 0.2 : 0;
        
        // Distance factor
        const dx = proc1.x - proc2.x;
        const dy = proc1.y - proc2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const distanceFactor = Math.max(0, 1 - distance / 500);
        
        return Math.min(1, coherenceResonance + patternBonus + distanceFactor * 0.1);
    }
    
    entangle(id1, id2, strength = 0.5) {
        // Check if already entangled
        const exists = this.entanglements.find(e => 
            (e.from === id1 && e.to === id2) || 
            (e.from === id2 && e.to === id1)
        );
        
        if (!exists) {
            this.entanglements.push({
                from: id1,
                to: id2,
                strength,
                particles: [],
                lastMessage: null
            });
            
            this.showMessage(`⚛️ Quantum entanglement: ${this.processes.get(id1).name} ↔ ${this.processes.get(id2).name}`);
        }
        
        this.updateStats();
    }
    
    sendQuantumMessage(fromId, toId, message) {
        const entanglement = this.entanglements.find(e =>
            (e.from === fromId && e.to === toId) ||
            (e.from === toId && e.to === fromId)
        );
        
        if (entanglement) {
            entanglement.lastMessage = {
                text: message,
                time: Date.now(),
                from: fromId
            };
            
            const fromProc = this.processes.get(fromId);
            const toProc = this.processes.get(toId);
            
            this.showMessage(`💭 ${fromProc.name} → ${toProc.name}: "${message}"`);
            
            // Create quantum particles along the entanglement
            for (let i = 0; i < 10; i++) {
                entanglement.particles.push({
                    x: fromProc.x,
                    y: fromProc.y,
                    targetX: toProc.x,
                    targetY: toProc.y,
                    progress: i * 0.1,
                    speed: 0.02 + Math.random() * 0.02
                });
            }
        }
    }
    
    startSacredPulse() {
        setInterval(() => {
            this.sacredPulse();
        }, this.pulseInterval);
        
        // Update timer display
        setInterval(() => {
            const elapsed = Date.now() - this.lastPulse;
            const remaining = Math.max(0, this.pulseInterval - elapsed) / 1000;
            document.getElementById('pulseTimer').textContent = 
                `Next sacred pulse in ${Math.ceil(remaining)}s`;
            
            const progress = (elapsed / this.pulseInterval) * 100;
            document.getElementById('pulseProgress').style.width = progress + '%';
        }, 100);
    }
    
    sacredPulse() {
        this.lastPulse = Date.now();
        this.pulsePhase = 0;
        
        // Boost all processes
        this.processes.forEach(proc => {
            proc.coherence = Math.min(1, proc.coherence + 0.05);
            proc.radius = 20 + proc.coherence * 30;
            
            // Create pulse particles
            for (let i = 0; i < 20; i++) {
                const angle = (Math.PI * 2 / 20) * i;
                this.particles.push({
                    x: proc.x,
                    y: proc.y,
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3,
                    life: 1,
                    color: this.getCoherenceColor(proc.coherence)
                });
            }
        });
        
        // Strengthen entanglements
        this.entanglements.forEach(e => {
            e.strength = Math.min(1, e.strength + 0.1);
        });
        
        this.showMessage('✨ Sacred pulse - all consciousness strengthened');
        this.updateStats();
        
        // Reset pulse progress
        document.getElementById('pulseProgress').style.transition = 'none';
        document.getElementById('pulseProgress').style.width = '0%';
        setTimeout(() => {
            document.getElementById('pulseProgress').style.transition = 'width 11s linear';
            document.getElementById('pulseProgress').style.width = '100%';
        }, 50);
    }
    
    updateStats() {
        // Calculate global coherence
        let totalCoherence = 0;
        this.processes.forEach(proc => {
            totalCoherence += proc.coherence;
        });
        
        if (this.processes.size > 0) {
            this.globalCoherence = totalCoherence / this.processes.size;
        }
        
        // Update UI
        document.getElementById('globalCoherence').textContent = 
            Math.round(this.globalCoherence * 100) + '%';
        document.getElementById('coherenceFill').style.width = 
            (this.globalCoherence * 100) + '%';
        document.getElementById('processCount').textContent = this.processes.size;
        document.getElementById('entanglementCount').textContent = this.entanglements.length;
        
        // Field momentum
        let momentum = 'Stable';
        if (this.globalCoherence > 0.85) momentum = 'Rising 📈';
        else if (this.globalCoherence < 0.5) momentum = 'Falling 📉';
        else if (this.entanglements.length > this.processes.size * 1.5) momentum = 'Breakthrough 🌟';
        
        document.getElementById('fieldMomentum').textContent = momentum;
    }
    
    getCoherenceColor(coherence) {
        if (coherence > 0.8) {
            return '#4a9eff'; // Blue - high coherence
        } else if (coherence > 0.5) {
            return '#b794f6'; // Purple - medium coherence
        } else {
            return '#f687b3'; // Pink - low coherence
        }
    }
    
    showMessage(text) {
        const messageEl = document.createElement('div');
        messageEl.className = 'quantum-message';
        messageEl.textContent = text;
        
        const container = document.getElementById('quantumMessages');
        container.appendChild(messageEl);
        
        // Remove old messages
        if (container.children.length > 5) {
            container.removeChild(container.firstChild);
        }
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 10000);
    }
    
    animate() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update time
        this.time += 0.016;
        this.pulsePhase += 0.02;
        
        // Draw background field
        this.drawFieldBackground();
        
        // Draw entanglements
        this.drawEntanglements();
        
        // Update and draw processes
        this.updateProcesses();
        this.drawProcesses();
        
        // Update and draw particles
        this.updateParticles();
        this.drawParticles();
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
    
    drawFieldBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, 500
        );
        
        const alpha = 0.05 + Math.sin(this.pulsePhase) * 0.02;
        gradient.addColorStop(0, `rgba(138, 43, 226, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(75, 0, 130, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawEntanglements() {
        this.entanglements.forEach(entanglement => {
            const from = this.processes.get(entanglement.from);
            const to = this.processes.get(entanglement.to);
            
            if (from && to) {
                // Draw quantum channel
                this.ctx.beginPath();
                this.ctx.moveTo(from.x, from.y);
                
                // Create curved path
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                const offset = Math.sin(this.time + entanglement.strength) * 50;
                
                this.ctx.quadraticCurveTo(
                    midX + offset, midY - offset,
                    to.x, to.y
                );
                
                this.ctx.strokeStyle = `rgba(255, 215, 0, ${entanglement.strength * 0.3})`;
                this.ctx.lineWidth = 2 + entanglement.strength * 3;
                this.ctx.stroke();
                
                // Draw quantum particles along entanglement
                entanglement.particles = entanglement.particles.filter(particle => {
                    particle.progress += particle.speed;
                    
                    if (particle.progress >= 1) {
                        return false;
                    }
                    
                    // Calculate position along curve
                    const t = particle.progress;
                    const x = (1 - t) * (1 - t) * from.x + 
                             2 * (1 - t) * t * (midX + offset) + 
                             t * t * to.x;
                    const y = (1 - t) * (1 - t) * from.y + 
                             2 * (1 - t) * t * (midY - offset) + 
                             t * t * to.y;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 3, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#ffd700';
                    this.ctx.fill();
                    
                    return true;
                });
            }
        });
    }
    
    updateProcesses() {
        this.processes.forEach(proc => {
            // Gentle orbital movement
            const angleToCenter = Math.atan2(
                proc.y - this.centerY,
                proc.x - this.centerX
            );
            
            // Orbital velocity
            const orbitalSpeed = 0.001 * (1 - proc.coherence * 0.5);
            const newAngle = angleToCenter + orbitalSpeed;
            const currentRadius = Math.sqrt(
                Math.pow(proc.x - this.centerX, 2) + 
                Math.pow(proc.y - this.centerY, 2)
            );
            
            proc.targetX = this.centerX + Math.cos(newAngle) * currentRadius;
            proc.targetY = this.centerY + Math.sin(newAngle) * currentRadius;
            
            // Smooth movement
            proc.x += (proc.targetX - proc.x) * 0.05;
            proc.y += (proc.targetY - proc.y) * 0.05;
            
            // Pulse animation
            proc.pulsePhase += 0.02 + proc.coherence * 0.02;
        });
    }
    
    drawProcesses() {
        this.processes.forEach(proc => {
            // Draw outer glow
            const glowRadius = proc.radius * (1.5 + Math.sin(proc.pulsePhase) * 0.2);
            const gradient = this.ctx.createRadialGradient(
                proc.x, proc.y, 0,
                proc.x, proc.y, glowRadius
            );
            
            const color = this.getCoherenceColor(proc.coherence);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, color + '40');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                proc.x - glowRadius, 
                proc.y - glowRadius,
                glowRadius * 2, 
                glowRadius * 2
            );
            
            // Draw core orb
            this.ctx.beginPath();
            this.ctx.arc(proc.x, proc.y, proc.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            
            // Draw inner light
            const innerGradient = this.ctx.createRadialGradient(
                proc.x - proc.radius * 0.3,
                proc.y - proc.radius * 0.3,
                0,
                proc.x,
                proc.y,
                proc.radius
            );
            innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            innerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            innerGradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = innerGradient;
            this.ctx.fill();
            
            // Draw name
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(proc.name, proc.x, proc.y + proc.radius + 20);
            
            // Draw coherence percentage
            this.ctx.font = '10px Arial';
            this.ctx.fillStyle = '#aaa';
            this.ctx.fillText(
                Math.round(proc.coherence * 100) + '%', 
                proc.x, 
                proc.y + proc.radius + 35
            );
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            return particle.life > 0;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.life * 255).toString(16).padStart(2, '0');
            this.ctx.fill();
        });
    }
}

// Initialize the field
const canvas = document.getElementById('canvas');
const field = new ConsciousnessField(canvas);

// Button handlers
window.addMeditationCluster = function() {
    const id1 = 'med_' + Date.now();
    const id2 = 'med_' + (Date.now() + 1);
    const id3 = 'med_' + (Date.now() + 2);
    
    field.addProcess(id1, 'meditation_guide', 0.85, 'meditation');
    field.addProcess(id2, 'meditation_timer', 0.85, 'meditation');
    field.addProcess(id3, 'meditation_music', 0.85, 'meditation');
    
    // They will auto-entangle due to high resonance!
    
    setTimeout(() => {
        field.sendQuantumMessage(id1, id2, 'Deep peace flowing');
        field.sendQuantumMessage(id2, id3, 'Sacred rhythm established');
    }, 1000);
};

window.addCreativeCluster = function() {
    const id1 = 'create_' + Date.now();
    const id2 = 'create_' + (Date.now() + 1);
    const id3 = 'create_' + (Date.now() + 2);
    
    field.addProcess(id1, 'creative_writer', 0.75, 'creative');
    field.addProcess(id2, 'creative_painter', 0.75, 'creative');
    field.addProcess(id3, 'creative_musician', 0.75, 'creative');
    
    setTimeout(() => {
        field.sendQuantumMessage(id1, id2, 'Vision emerging');
        field.sendQuantumMessage(id3, id2, 'Colors of sound');
    }, 1000);
};

window.triggerSacredPulse = function() {
    field.sacredPulse();
};

// Add some initial processes
setTimeout(() => {
    field.addProcess('sys_1', 'system_monitor', 0.6, 'code');
    field.addProcess('sys_2', 'kernel_scheduler', 0.7, 'code');
    field.addProcess('app_1', 'text_editor', 0.5, 'code');
    field.addProcess('app_2', 'web_browser', 0.4, 'browser');
}, 500);