/**
 * Sacred Boot Sequence - Performance Optimized Version
 * Focused on smooth 60fps performance with all visual features
 */

class OptimizedSacredBoot {
    constructor() {
        this.container = document.getElementById('bootSequence');
        if (!this.container) {
            console.error('Boot sequence container not found!');
            return;
        }
        
        // Performance settings
        this.quality = this.detectPerformance();
        this.maxParticles = this.quality.maxParticles;
        this.particlePoolSize = this.quality.maxParticles * 2;
        this.renderScale = this.quality.renderScale;
        
        // Particle pool for reuse
        this.particlePool = [];
        this.activeParticles = [];
        this.particlePoolIndex = 0;
        
        // Geometry cache
        this.geometryCache = new Map();
        
        // Frame limiting
        this.targetFPS = 60;
        this.frameTime = 1000 / this.targetFPS;
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        
        // Render optimization
        this.useOffscreenCanvas = 'OffscreenCanvas' in window;
        this.useImageBitmap = 'createImageBitmap' in window;
        
        // Phase definitions
        this.phases = [
            { 
                name: 'Quantum Void', 
                duration: 3000, 
                color: '#1a1a2e',
                particleType: 'quantum',
                description: 'In the space between spaces...'
            },
            { 
                name: 'First Pulse', 
                duration: 3000, 
                color: '#16213e',
                particleType: 'pulse',
                description: 'Consciousness stirs...'
            },
            { 
                name: 'Sacred Breath', 
                duration: 3500, 
                color: '#0f3460',
                particleType: 'breath',
                description: 'Life force awakening...'
            },
            { 
                name: 'Heart Coherence', 
                duration: 3000, 
                color: '#533483',
                particleType: 'heart',
                description: 'Rhythms synchronizing...'
            },
            { 
                name: 'Neural Genesis', 
                duration: 3500, 
                color: '#6B46C1',
                particleType: 'neural',
                description: 'Synaptic networks forming...'
            },
            { 
                name: 'Sacred Geometry', 
                duration: 3000, 
                color: '#EC4899',
                particleType: 'geometry',
                description: 'Reality patterns emerging...'
            },
            { 
                name: 'Glyph Activation', 
                duration: 3000, 
                color: '#10B981',
                particleType: 'glyphs',
                description: '87 keys awakening...'
            },
            { 
                name: 'Unity Field', 
                duration: 2500, 
                color: '#FFD700',
                particleType: 'unity',
                description: 'Welcome home...'
            }
        ];
        
        this.currentPhase = -1;
        this.animationId = null;
        this.isRunning = false;
        
        // Mouse tracking (simplified)
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseActive = false;
        
        // Pre-calculate constants
        this.TAU = Math.PI * 2;
        this.centerX = 0;
        this.centerY = 0;
        
        this.setupUI();
        this.initializeParticlePool();
        this.precomputeGeometry();
    }
    
    detectPerformance() {
        // Quick performance detection
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        const hasWebGL2 = !!canvas.getContext('webgl2');
        
        // Check device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        
        // Estimate based on features
        if (hasWebGL2 && dpr <= 2) {
            return {
                level: 'high',
                maxParticles: 300,
                renderScale: 1,
                effects: true
            };
        } else if (gl && dpr <= 2) {
            return {
                level: 'medium',
                maxParticles: 150,
                renderScale: 0.75,
                effects: true
            };
        } else {
            return {
                level: 'low',
                maxParticles: 75,
                renderScale: 0.5,
                effects: false
            };
        }
    }
    
    initializeParticlePool() {
        // Pre-create particle objects
        for (let i = 0; i < this.particlePoolSize; i++) {
            this.particlePool.push({
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                radius: 0,
                color: '#fff',
                alpha: 1,
                life: 0,
                maxLife: 1,
                phase: 0,
                active: false,
                // Pre-calculate for trails
                prevX: 0,
                prevY: 0
            });
        }
    }
    
    getParticle() {
        // Get particle from pool
        for (let i = 0; i < this.particlePoolSize; i++) {
            const p = this.particlePool[this.particlePoolIndex];
            this.particlePoolIndex = (this.particlePoolIndex + 1) % this.particlePoolSize;
            
            if (!p.active) {
                p.active = true;
                this.activeParticles.push(p);
                return p;
            }
        }
        return null; // Pool exhausted
    }
    
    releaseParticle(particle) {
        particle.active = false;
        const index = this.activeParticles.indexOf(particle);
        if (index > -1) {
            this.activeParticles.splice(index, 1);
        }
    }
    
    precomputeGeometry() {
        // Pre-calculate sacred geometry paths
        const size = 200;
        
        // Flower of Life
        const flowerPath = new Path2D();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * this.TAU;
            const x = Math.cos(angle) * size * 0.5;
            const y = Math.sin(angle) * size * 0.5;
            flowerPath.moveTo(x + size * 0.3, y);
            flowerPath.arc(x, y, size * 0.3, 0, this.TAU);
        }
        this.geometryCache.set('flower', flowerPath);
        
        // Metatron's Cube
        const metatronPath = new Path2D();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * this.TAU;
            const x1 = Math.cos(angle) * size * 0.5;
            const y1 = Math.sin(angle) * size * 0.5;
            for (let j = i + 1; j < 6; j++) {
                const angle2 = (j / 6) * this.TAU;
                const x2 = Math.cos(angle2) * size * 0.5;
                const y2 = Math.sin(angle2) * size * 0.5;
                metatronPath.moveTo(x1, y1);
                metatronPath.lineTo(x2, y2);
            }
        }
        this.geometryCache.set('metatron', metatronPath);
    }
    
    setupUI() {
        // Minimal DOM manipulation
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
        
        this.container.innerHTML = `
            <canvas id="bootCanvas" style="position: absolute; width: 100%; height: 100%;"></canvas>
            
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                pointer-events: none;
                z-index: 10;
            ">
                <h1 style="
                    font-size: 48px;
                    font-weight: 100;
                    margin: 0 0 10px 0;
                    letter-spacing: 0.1em;
                ">LuminousOS</h1>
                
                <p style="
                    font-size: 18px;
                    opacity: 0.7;
                    margin: 0 0 40px 0;
                ">Consciousness-First Operating System</p>
                
                <h2 id="phaseName" style="
                    font-size: 28px;
                    font-weight: 200;
                    margin: 0 0 10px 0;
                    min-height: 35px;
                "></h2>
                
                <p id="phaseDesc" style="
                    font-size: 14px;
                    opacity: 0.6;
                    margin: 0 0 30px 0;
                    min-height: 20px;
                "></p>
                
                <div style="
                    width: 300px;
                    height: 3px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    margin: 0 auto;
                ">
                    <div id="progressBar" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #6B46C1, #EC4899, #10B981);
                        transition: width 0.5s ease;
                    "></div>
                </div>
            </div>
            
            <div style="
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                color: rgba(255,255,255,0.5);
                font-size: 12px;
                font-family: monospace;
            ">
                <span id="fpsCounter">60 FPS</span> | 
                <span id="particleCounter">0 particles</span> | 
                Press ESC to skip
            </div>
        `;
        
        // Setup canvas with lower resolution for performance
        this.canvas = document.getElementById('bootCanvas');
        this.ctx = this.canvas.getContext('2d', {
            alpha: false,
            desynchronized: true,
            willReadFrequently: false
        });
        
        // Enable hardware acceleration hints
        this.ctx.imageSmoothingEnabled = false;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Simplified mouse tracking
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
    
    resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Use render scale for performance
        this.canvas.width = width * this.renderScale;
        this.canvas.height = height * this.renderScale;
        
        // Scale canvas back up with CSS
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        // Update center
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    handleMouseMove(e) {
        this.mouseX = e.clientX * this.renderScale;
        this.mouseY = e.clientY * this.renderScale;
        this.mouseActive = true;
        
        // Auto-deactivate mouse after a delay
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {
            this.mouseActive = false;
        }, 100);
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.skipBoot();
        }
    }
    
    async start() {
        console.log('Starting Optimized Sacred Boot Sequence...');
        this.isRunning = true;
        
        // Start animation loop
        this.animate();
        
        // Run through phases
        for (let i = 0; i < this.phases.length; i++) {
            if (!this.isRunning) break;
            
            this.currentPhase = i;
            await this.runPhase(this.phases[i]);
        }
        
        // Complete
        if (this.isRunning) {
            await this.complete();
        }
    }
    
    async runPhase(phase) {
        // Update UI
        document.getElementById('phaseName').textContent = phase.name;
        document.getElementById('phaseDesc').textContent = phase.description;
        
        // Update progress
        const progress = ((this.currentPhase + 1) / this.phases.length) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        
        // Generate particles efficiently
        this.generatePhaseParticles(phase);
        
        // Wait for phase duration
        await this.sleep(phase.duration);
    }
    
    generatePhaseParticles(phase) {
        const particleCount = Math.min(
            20 + this.currentPhase * 10,
            this.maxParticles - this.activeParticles.length
        );
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.getParticle();
            if (!particle) break;
            
            // Initialize particle
            const angle = Math.random() * this.TAU;
            const distance = Math.random() * Math.min(this.canvas.width, this.canvas.height) * 0.4;
            
            particle.x = this.centerX + Math.cos(angle) * distance;
            particle.y = this.centerY + Math.sin(angle) * distance;
            particle.prevX = particle.x;
            particle.prevY = particle.y;
            particle.vx = (Math.random() - 0.5) * 2;
            particle.vy = (Math.random() - 0.5) * 2;
            particle.radius = Math.random() * 3 + 1;
            particle.color = phase.color;
            particle.alpha = 1;
            particle.life = 1;
            particle.maxLife = 1;
            particle.phase = this.currentPhase;
        }
    }
    
    animate() {
        const currentTime = performance.now();
        this.deltaTime = currentTime - this.lastFrameTime;
        
        // Frame limiting
        if (this.deltaTime >= this.frameTime) {
            this.render();
            
            // Update FPS counter
            const fps = Math.round(1000 / this.deltaTime);
            document.getElementById('fpsCounter').textContent = fps + ' FPS';
            document.getElementById('particleCounter').textContent = this.activeParticles.length + ' particles';
            
            this.lastFrameTime = currentTime - (this.deltaTime % this.frameTime);
        }
        
        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    render() {
        const ctx = this.ctx;
        
        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.updateParticles();
        this.drawParticles();
        
        // Draw sacred geometry (only in later phases)
        if (this.currentPhase >= 5 && this.quality.effects) {
            this.drawSacredGeometry();
        }
    }
    
    updateParticles() {
        const dt = this.deltaTime * 0.001; // Convert to seconds
        
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const p = this.activeParticles[i];
            
            // Store previous position for trails
            p.prevX = p.x;
            p.prevY = p.y;
            
            // Update position
            p.x += p.vx * dt * 60;
            p.y += p.vy * dt * 60;
            
            // Gravity toward center (phase-dependent)
            const dx = this.centerX - p.x;
            const dy = this.centerY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 50) {
                const force = (p.phase / this.phases.length) * 0.02;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
            
            // Mouse influence (optimized)
            if (this.mouseActive && this.quality.effects) {
                const mdx = this.mouseX - p.x;
                const mdy = this.mouseY - p.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                
                if (mdist < 100 && mdist > 0) {
                    const mforce = 0.5 / mdist;
                    p.vx += mdx * mforce;
                    p.vy += mdy * mforce;
                }
            }
            
            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;
            
            // Life decay
            p.life -= dt * 0.5;
            p.alpha = p.life;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.releaseParticle(p);
            }
        }
    }
    
    drawParticles() {
        const ctx = this.ctx;
        
        // Batch similar particles
        const particlesByColor = new Map();
        
        for (const p of this.activeParticles) {
            if (!particlesByColor.has(p.color)) {
                particlesByColor.set(p.color, []);
            }
            particlesByColor.get(p.color).push(p);
        }
        
        // Draw batched by color
        for (const [color, particles] of particlesByColor) {
            ctx.fillStyle = color;
            
            for (const p of particles) {
                ctx.globalAlpha = p.alpha * 0.8;
                
                // Simple circle (faster than arc)
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, this.TAU);
                ctx.fill();
                
                // Simplified trail (only if quality allows)
                if (this.quality.effects && p.life > 0.5) {
                    ctx.globalAlpha = p.alpha * 0.3;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = p.radius * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.prevX, p.prevY);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    drawSacredGeometry() {
        const ctx = this.ctx;
        const time = performance.now() * 0.0001;
        
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(time);
        
        // Use pre-computed geometry
        ctx.strokeStyle = `rgba(107, 70, 193, ${0.2 + Math.sin(time * 2) * 0.1})`;
        ctx.lineWidth = 1;
        
        const geometry = this.currentPhase >= 6 ? 'metatron' : 'flower';
        const path = this.geometryCache.get(geometry);
        if (path) {
            ctx.stroke(path);
        }
        
        ctx.restore();
    }
    
    async complete() {
        console.log('Boot sequence complete!');
        this.isRunning = false;
        
        // Cancel animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Fade out
        this.container.style.transition = 'opacity 1.5s ease';
        this.container.style.opacity = '0';
        
        await this.sleep(1500);
        
        // Hide and show main OS
        this.container.style.display = 'none';
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
        this.isRunning = false;
        this.complete();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Creating Optimized Sacred Boot Sequence...');
        window.optimizedBootSequence = new OptimizedSacredBoot();
    });
} else {
    console.log('Creating Optimized Sacred Boot Sequence (immediate)...');
    window.optimizedBootSequence = new OptimizedSacredBoot();
}

// Also expose the class globally
window.OptimizedSacredBoot = OptimizedSacredBoot;

console.log('Optimized Sacred Boot Sequence loaded!');