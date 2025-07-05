/**
 * Sacred Boot Sequence - Working Version
 * A beautiful but reliable boot experience
 */

class SacredBootSequence {
    constructor() {
        this.container = document.getElementById('bootSequence');
        if (!this.container) {
            console.error('Boot sequence container not found!');
            return;
        }
        
        this.phases = [
            { name: 'Quantum Void', duration: 2000, color: '#1a1a2e' },
            { name: 'First Pulse', duration: 2500, color: '#16213e' },
            { name: 'Sacred Breath', duration: 3000, color: '#0f3460' },
            { name: 'Heart Coherence', duration: 2500, color: '#533483' },
            { name: 'Neural Genesis', duration: 3000, color: '#6B46C1' },
            { name: 'Sacred Geometry', duration: 2500, color: '#EC4899' },
            { name: 'Glyph Activation', duration: 2000, color: '#10B981' },
            { name: 'Unity Field', duration: 2000, color: '#FFD700' }
        ];
        
        this.currentPhase = 0;
        this.particles = [];
        this.animationId = null;
        
        this.setupBootUI();
    }
    
    setupBootUI() {
        // Ensure container is visible
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 9999;
            overflow: hidden;
        `;
        
        // Create UI structure
        this.container.innerHTML = `
            <canvas id="bootCanvas" style="position: absolute; width: 100%; height: 100%;"></canvas>
            
            <div style="
                position: relative;
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <!-- Logo -->
                <div id="bootLogo" style="
                    width: 200px;
                    height: 200px;
                    margin-bottom: 40px;
                    position: relative;
                ">
                    <canvas id="logoCanvas" width="400" height="400" style="width: 100%; height: 100%;"></canvas>
                </div>
                
                <!-- Title -->
                <h1 style="
                    font-size: 48px;
                    font-weight: 100;
                    margin: 0 0 10px 0;
                    letter-spacing: 0.1em;
                    opacity: 0;
                    animation: fadeIn 2s ease forwards;
                ">LuminousOS</h1>
                
                <p style="
                    font-size: 18px;
                    opacity: 0.7;
                    margin: 0 0 60px 0;
                    opacity: 0;
                    animation: fadeIn 2s ease 0.5s forwards;
                ">Consciousness-First Operating System</p>
                
                <!-- Phase Display -->
                <h2 id="phaseName" style="
                    font-size: 32px;
                    font-weight: 200;
                    margin: 0 0 10px 0;
                    min-height: 40px;
                    transition: all 0.5s ease;
                "></h2>
                
                <p id="phaseDesc" style="
                    font-size: 16px;
                    opacity: 0.6;
                    margin: 0 0 40px 0;
                    min-height: 20px;
                    transition: all 0.5s ease;
                "></p>
                
                <!-- Progress -->
                <div style="
                    width: 400px;
                    max-width: 80vw;
                    height: 4px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-bottom: 20px;
                ">
                    <div id="progressBar" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #6B46C1, #EC4899, #10B981);
                        transition: width 0.5s ease;
                        box-shadow: 0 0 10px currentColor;
                    "></div>
                </div>
                
                <!-- Phase dots -->
                <div id="phaseDots" style="
                    display: flex;
                    gap: 10px;
                    margin-bottom: 40px;
                "></div>
                
                <!-- Skip -->
                <button onclick="window.skipBoot()" style="
                    background: transparent;
                    color: rgba(255,255,255,0.5);
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    opacity: 0;
                    animation: fadeIn 1s ease 3s forwards;
                " onmouseover="this.style.borderColor='rgba(255,255,255,0.5)'; this.style.color='white'"
                   onmouseout="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.color='rgba(255,255,255,0.5)'">
                    Skip (ESC)
                </button>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        `;
        
        // Setup canvases
        this.canvas = document.getElementById('bootCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.logoCanvas = document.getElementById('logoCanvas');
        this.logoCtx = this.logoCanvas.getContext('2d');
        
        // Set canvas sizes
        this.resizeCanvases();
        window.addEventListener('resize', () => this.resizeCanvases());
        
        // Create phase dots
        const dotsContainer = document.getElementById('phaseDots');
        this.phases.forEach((phase, i) => {
            const dot = document.createElement('div');
            dot.id = `dot-${i}`;
            dot.style.cssText = `
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                transition: all 0.3s ease;
            `;
            dotsContainer.appendChild(dot);
        });
        
        // Keyboard handler
        document.addEventListener('keydown', this.handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.skipBoot();
            }
        });
    }
    
    resizeCanvases() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Logo canvas stays fixed size
    }
    
    async start() {
        console.log('Starting Sacred Boot Sequence...');
        
        // Start animation loop
        this.animate();
        
        // Run through phases
        for (let i = 0; i < this.phases.length; i++) {
            this.currentPhase = i;
            await this.runPhase(this.phases[i]);
        }
        
        // Complete
        await this.complete();
    }
    
    async runPhase(phase) {
        console.log(`Boot Phase: ${phase.name}`);
        
        // Update UI
        document.getElementById('phaseName').textContent = phase.name;
        document.getElementById('phaseDesc').textContent = this.getPhaseDescription(phase.name);
        
        // Update progress
        const progress = ((this.currentPhase + 1) / this.phases.length) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        
        // Update phase dots
        for (let i = 0; i < this.phases.length; i++) {
            const dot = document.getElementById(`dot-${i}`);
            if (i < this.currentPhase) {
                dot.style.background = '#10B981';
            } else if (i === this.currentPhase) {
                dot.style.background = phase.color;
                dot.style.transform = 'scale(1.5)';
                dot.style.boxShadow = `0 0 10px ${phase.color}`;
            }
        }
        
        // Generate particles for this phase
        this.generatePhaseParticles(phase);
        
        // Wait for phase duration
        await this.sleep(phase.duration);
    }
    
    getPhaseDescription(phaseName) {
        const descriptions = {
            'Quantum Void': 'In the space between spaces...',
            'First Pulse': 'Consciousness stirs...',
            'Sacred Breath': 'Life force awakening...',
            'Heart Coherence': 'Rhythms synchronizing...',
            'Neural Genesis': 'Synaptic networks forming...',
            'Sacred Geometry': 'Reality patterns emerging...',
            'Glyph Activation': '87 keys awakening...',
            'Unity Field': 'Welcome home...'
        };
        return descriptions[phaseName] || '';
    }
    
    generatePhaseParticles(phase) {
        const particleCount = 20 + this.currentPhase * 10;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1,
                color: phase.color,
                life: 1,
                maxLife: 1,
                phase: this.currentPhase
            });
        }
    }
    
    animate() {
        if (!this.animationId) {
            const loop = () => {
                this.clearCanvas();
                this.updateParticles();
                this.drawParticles();
                this.drawLogo();
                this.animationId = requestAnimationFrame(loop);
            };
            loop();
        }
    }
    
    clearCanvas() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    updateParticles() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.particles = this.particles.filter(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Gravity toward center (stronger in later phases)
            const dx = centerX - p.x;
            const dy = centerY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 50) {
                const force = (p.phase / this.phases.length) * 0.05;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
            
            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;
            
            // Life decay
            p.life -= 0.01;
            
            return p.life > 0;
        });
    }
    
    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            // Glow effect
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
            gradient.addColorStop(0, p.color + '40');
            gradient.addColorStop(1, p.color + '00');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawLogo() {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        const time = Date.now() * 0.001;
        
        ctx.clearRect(0, 0, size, size);
        
        // Draw based on current phase
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(time * 0.1);
        
        if (this.currentPhase >= 0) {
            // Outer circle
            ctx.beginPath();
            ctx.arc(0, 0, 80, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(107, 70, 193, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        if (this.currentPhase >= 2) {
            // Inner triangles
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * 50;
                const y = Math.sin(angle) * 50;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
            ctx.stroke();
        }
        
        if (this.currentPhase >= 4) {
            // Sacred geometry
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * 40, Math.sin(angle) * 40, 20, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
                ctx.stroke();
            }
        }
        
        if (this.currentPhase >= 6) {
            // Center glow
            const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
            glow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(-100, -100, 200, 200);
        }
        
        ctx.restore();
    }
    
    async complete() {
        console.log('Boot sequence complete!');
        
        // Stop animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove keyboard handler
        if (this.handleKeydown) {
            document.removeEventListener('keydown', this.handleKeydown);
        }
        
        // Fade out
        this.container.style.transition = 'opacity 2s ease';
        this.container.style.opacity = '0';
        
        await this.sleep(2000);
        
        // Hide container
        this.container.style.display = 'none';
        
        // Show main OS
        const mainOS = document.getElementById('mainOS');
        if (mainOS) {
            mainOS.style.display = 'block';
        }
        
        // Initialize OS
        if (typeof initializeOS === 'function') {
            initializeOS();
        }
    }
    
    skipBoot() {
        console.log('Skipping boot sequence...');
        this.complete();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global skip function
window.skipBoot = function() {
    if (window.sacredBootInstance) {
        window.sacredBootInstance.skipBoot();
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Creating Sacred Boot Sequence...');
        window.sacredBootInstance = new SacredBootSequence();
        window.sacredBootSequence = window.sacredBootInstance; // Compatibility
    });
} else {
    console.log('Creating Sacred Boot Sequence (immediate)...');
    window.sacredBootInstance = new SacredBootSequence();
    window.sacredBootSequence = window.sacredBootInstance;
}

// Also expose the class globally
window.SacredBootSequence = SacredBootSequence;

console.log('Sacred Boot Sequence script loaded!');