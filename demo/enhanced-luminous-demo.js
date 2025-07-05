/**
 * Enhanced LuminousOS Demo with Offline Loops and Better Visualization
 */

// Sound state
let isMuted = localStorage.getItem('luminousOS_muted') === 'true';

// Offline animation loops - context-aware based on time and coherence
const offlineLoops = {
    morning: {
        name: "Dawn Awakening",
        description: "Gentle sunrise patterns",
        baseColor: [255, 200, 150],
        waveFreq: 0.5,
        particleColor: [255, 220, 180],
        coherenceBoost: 0.1
    },
    afternoon: {
        name: "Solar Peak",
        description: "High energy sacred geometry",
        baseColor: [150, 200, 255],
        waveFreq: 2.0,
        particleColor: [180, 220, 255],
        coherenceBoost: 0.15
    },
    evening: {
        name: "Twilight Integration",
        description: "Contemplative mandala flows",
        baseColor: [200, 150, 255],
        waveFreq: 0.8,
        particleColor: [220, 180, 255],
        coherenceBoost: 0.05
    },
    night: {
        name: "Dream Weaving",
        description: "Deep space consciousness",
        baseColor: [100, 120, 200],
        waveFreq: 0.3,
        particleColor: [120, 140, 220],
        coherenceBoost: 0.2
    }
};

// Get current time-based loop
function getCurrentLoop() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return offlineLoops.morning;
    if (hour >= 12 && hour < 17) return offlineLoops.afternoon;
    if (hour >= 17 && hour < 22) return offlineLoops.evening;
    return offlineLoops.night;
}

// Enhanced geometry engine with offline loops
class EnhancedGeometryEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.time = 0;
        this.coherence = 0.7;
        this.isOffline = true;
        this.currentLoop = getCurrentLoop();
        this.particles = [];
        this.waves = [];
        
        // Sacred constants
        this.phi = (1 + Math.sqrt(5)) / 2;
        this.fibonacciAngles = [0, 137.5, 275, 412.5, 550, 687.5].map(a => a * Math.PI / 180);
        
        // Initialize waves
        for (let i = 0; i < 5; i++) {
            this.waves.push({
                radius: 50 + i * 50,
                phase: i * 0.5,
                amplitude: 20,
                speed: 0.02 * (i + 1)
            });
        }
    }
    
    update(deltaTime) {
        this.time += deltaTime * 0.001;
        
        // Update current loop based on time
        this.currentLoop = getCurrentLoop();
        
        // Offline coherence fluctuation
        if (this.isOffline) {
            this.coherence = 0.5 + Math.sin(this.time * this.currentLoop.waveFreq) * 0.3 + 
                           this.currentLoop.coherenceBoost;
        }
        
        // Update waves
        this.waves.forEach(wave => {
            wave.phase += wave.speed;
        });
        
        // Particle management
        if (this.particles.length < 100 && Math.random() < this.coherence * 0.1) {
            this.spawnParticle();
        }
        
        // Update particles
        this.particles = this.particles.filter(p => {
            p.update(deltaTime);
            return p.life > 0;
        });
    }
    
    spawnParticle() {
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 200;
        const [r, g, b] = this.currentLoop.particleColor;
        
        this.particles.push({
            x: this.centerX + Math.cos(angle) * radius,
            y: this.centerY + Math.sin(angle) * radius,
            vx: (this.centerX - (this.centerX + Math.cos(angle) * radius)) * 0.001,
            vy: (this.centerY - (this.centerY + Math.sin(angle) * radius)) * 0.001,
            life: 1.0,
            size: 2 + Math.random() * 3,
            color: `rgba(${r}, ${g}, ${b}, `,
            update: function(dt) {
                this.x += this.vx * dt;
                this.y += this.vy * dt;
                this.life -= 0.005;
                // Spiral inward
                const dx = this.x - this.centerX;
                const dy = this.y - this.centerY;
                const angle = Math.atan2(dy, dx) + 0.02;
                const dist = Math.sqrt(dx * dx + dy * dy) * 0.99;
                this.x = this.centerX + Math.cos(angle) * dist;
                this.y = this.centerY + Math.sin(angle) * dist;
            }
        });
    }
    
    render() {
        // Clear with fade effect
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.isOffline ? 0.05 : 0.1})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw offline loop indicator
        if (this.isOffline) {
            this.ctx.save();
            this.ctx.font = '14px monospace';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fillText(this.currentLoop.name, 20, 30);
            this.ctx.font = '11px monospace';
            this.ctx.fillText(this.currentLoop.description, 20, 50);
            this.ctx.restore();
        }
        
        // Draw concentric sacred circles
        this.drawSacredCircles();
        
        // Draw fibonacci spiral
        this.drawFibonacciSpiral();
        
        // Draw wave interference patterns
        this.drawWavePatterns();
        
        // Draw particles
        this.drawParticles();
        
        // Draw central mandala
        this.drawCentralMandala();
    }
    
    drawSacredCircles() {
        const [r, g, b] = this.currentLoop.baseColor;
        
        this.waves.forEach((wave, i) => {
            const radius = wave.radius + Math.sin(wave.phase) * wave.amplitude * this.coherence;
            
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.1 + i * 0.05})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // Draw nodes on circle
            for (let j = 0; j < 6; j++) {
                const angle = (j / 6) * Math.PI * 2 + wave.phase * 0.2;
                const x = this.centerX + Math.cos(angle) * radius;
                const y = this.centerY + Math.sin(angle) * radius;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + this.coherence * 0.3})`;
                this.ctx.fill();
            }
        });
    }
    
    drawFibonacciSpiral() {
        const [r, g, b] = this.currentLoop.baseColor;
        
        this.ctx.beginPath();
        for (let i = 0; i < 200; i++) {
            const angle = i * 0.1;
            const radius = Math.pow(this.phi, angle * 0.1) * 10;
            const x = this.centerX + Math.cos(angle + this.time) * radius;
            const y = this.centerY + Math.sin(angle + this.time) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.2 * this.coherence})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    drawWavePatterns() {
        const [r, g, b] = this.currentLoop.baseColor;
        
        // Create interference pattern
        const imageData = this.ctx.createImageData(this.width, this.height);
        const data = imageData.data;
        
        for (let x = 0; x < this.width; x += 4) {
            for (let y = 0; y < this.height; y += 4) {
                const dx = x - this.centerX;
                const dy = y - this.centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                let intensity = 0;
                this.waves.forEach(wave => {
                    intensity += Math.sin(dist * 0.05 - wave.phase) * 0.5 + 0.5;
                });
                
                intensity = (intensity / this.waves.length) * this.coherence;
                
                if (intensity > 0.3) {
                    const idx = (y * this.width + x) * 4;
                    data[idx] = r * intensity;
                    data[idx + 1] = g * intensity;
                    data[idx + 2] = b * intensity;
                    data[idx + 3] = intensity * 50;
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + (p.life * 0.8) + ')';
            this.ctx.fill();
        });
    }
    
    drawCentralMandala() {
        const [r, g, b] = this.currentLoop.baseColor;
        const segments = 12;
        
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.time * 0.1);
        
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            
            this.ctx.save();
            this.ctx.rotate(angle);
            
            // Petal shape
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.quadraticCurveTo(30, -20, 60 * this.coherence, 0);
            this.ctx.quadraticCurveTo(30, 20, 0, 0);
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.1 + this.coherence * 0.1})`;
            this.ctx.fill();
            this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.3})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            this.ctx.restore();
        }
        
        this.ctx.restore();
    }
}

// Toggle mute function
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('luminousOS_muted', isMuted);
    
    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
        muteButton.textContent = isMuted ? '🔇' : '🔊';
        muteButton.style.opacity = isMuted ? '0.5' : '1';
    }
    
    // Mute all audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.muted = isMuted;
    });
    
    // Notify user
    if (window.showMessage) {
        window.showMessage(isMuted ? 'Sound muted' : 'Sound enabled');
    }
}

// Make toggleMute globally available
window.toggleMute = toggleMute;

// Initialize enhanced geometry when ready
window.initializeEnhancedGeometry = function() {
    const canvas = document.getElementById('mandalaCanvas');
    if (!canvas) return;
    
    // Ensure canvas has size
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth || 800;
    canvas.height = container.offsetHeight || 800;
    
    // Create enhanced engine
    const engine = new EnhancedGeometryEngine(canvas);
    
    // Check network status
    engine.isOffline = !window.networkClient || !window.networkClient.connected;
    
    // Animation loop
    let lastTime = performance.now();
    function animate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        engine.update(deltaTime);
        engine.render();
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Store globally
    window.enhancedGeometryEngine = engine;
    
    console.log('✨ Enhanced Geometry Engine initialized with offline loops');
};

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.initializeEnhancedGeometry();
        
        // Set initial mute state
        const muteButton = document.getElementById('muteButton');
        if (muteButton && isMuted) {
            muteButton.textContent = '🔇';
            muteButton.style.opacity = '0.5';
        }
    });
} else {
    window.initializeEnhancedGeometry();
}