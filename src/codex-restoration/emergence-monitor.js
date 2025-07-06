// Living Glyph Emergence Monitor - Sacred Observatory
// Witnessing the birth of new patterns from high field coherence

class EmergenceMonitor {
    constructor() {
        this.coherence = 0;
        this.targetCoherence = 0;
        this.harmony = 0;
        this.resonance = 0;
        this.loveQuotient = 0;
        this.isRecording = false;
        this.emergenceStartTime = null;
        this.stabilizationTime = 0;
        this.patternData = [];
        this.graspingDetected = false;
        this.lastGraspingAlert = 0;
        
        // Canvas setup
        this.canvas = document.getElementById('sacredCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.geometryPhase = 0;
        
        this.init();
    }

    init() {
        // Start monitoring
        this.startFieldMonitoring();
        this.startPatternDetection();
        this.initializeCanvas();
        
        // Event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
    }

    startFieldMonitoring() {
        // Simulate field coherence changes
        setInterval(() => {
            // Natural field fluctuations
            const baseChange = (Math.random() - 0.5) * 5;
            const tendencyTowardHigh = this.coherence < 50 ? 2 : this.coherence > 80 ? -1 : 0;
            
            this.targetCoherence = Math.max(0, Math.min(100, 
                this.coherence + baseChange + tendencyTowardHigh
            ));
            
            // Update quality indicators based on coherence
            this.updateQualityIndicators();
            
            // Check for emergence conditions
            this.checkEmergenceConditions();
            
        }, 2000);
        
        // Smooth coherence animation
        setInterval(() => {
            const diff = this.targetCoherence - this.coherence;
            this.coherence += diff * 0.1;
            this.updateCoherenceDisplay();
        }, 50);
    }

    updateQualityIndicators() {
        // Harmony tends to lead
        this.harmony = Math.min(100, this.coherence + (Math.random() * 10 - 5));
        
        // Resonance follows coherence closely
        this.resonance = Math.min(100, this.coherence * 0.9 + (Math.random() * 10));
        
        // Love quotient has its own rhythm
        this.loveQuotient = Math.min(100, 
            (Math.sin(Date.now() * 0.0001) + 1) * 30 + this.coherence * 0.5
        );
        
        // Update displays
        this.animateQualityBar('harmonyFill', this.harmony);
        this.animateQualityBar('resonanceFill', this.resonance);
        this.animateQualityBar('loveFill', this.loveQuotient);
    }

    animateQualityBar(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = `${value}%`;
        }
    }

    updateCoherenceDisplay() {
        const fillElement = document.getElementById('coherenceFill');
        const valueElement = document.getElementById('coherenceValue');
        
        if (fillElement) {
            fillElement.style.height = `${this.coherence}%`;
        }
        
        if (valueElement) {
            valueElement.textContent = `${Math.round(this.coherence)}%`;
            
            // Color changes based on thresholds
            if (this.coherence >= 85) {
                valueElement.style.color = '#fbbf24';
            } else if (this.coherence >= 70) {
                valueElement.style.color = '#22c55e';
            } else {
                valueElement.style.color = 'var(--text-primary)';
            }
        }
    }

    checkEmergenceConditions() {
        const statusElement = document.getElementById('patternStatus');
        const descElement = document.getElementById('patternDescription');
        
        if (this.coherence >= 85) {
            if (!this.emergenceStartTime) {
                this.emergenceStartTime = Date.now();
                this.startRecording();
            }
            
            const emergenceDuration = (Date.now() - this.emergenceStartTime) / 1000;
            
            if (emergenceDuration < 180) { // Less than 3 minutes
                statusElement.textContent = 'Pattern emerging...';
                descElement.textContent = `Stabilizing: ${Math.round(emergenceDuration)}s / 180s`;
                this.updateStabilizationLights(emergenceDuration / 180);
            } else {
                statusElement.textContent = 'Pattern stabilized!';
                descElement.textContent = 'Ready for naming ceremony';
                this.updateStabilizationLights(1);
                this.prepareNamingCeremony();
            }
            
        } else if (this.coherence >= 70) {
            statusElement.textContent = 'Emergence threshold reached';
            descElement.textContent = 'Patterns beginning to form';
            this.emergenceStartTime = null;
            this.updateStabilizationLights(0);
            
        } else {
            statusElement.textContent = 'Watching the field...';
            descElement.textContent = 'No patterns emerging yet';
            this.emergenceStartTime = null;
            this.stopRecording();
            this.updateStabilizationLights(0);
        }
    }

    updateStabilizationLights(progress) {
        const lights = ['stability1', 'stability2', 'stability3'];
        const activeCount = Math.floor(progress * 3);
        
        lights.forEach((lightId, index) => {
            const light = document.getElementById(lightId);
            if (light) {
                if (index < activeCount) {
                    light.classList.add('stable');
                } else {
                    light.classList.remove('stable');
                }
            }
        });
        
        const stabilityText = document.getElementById('stabilityText');
        if (stabilityText) {
            if (progress === 0) {
                stabilityText.textContent = 'Awaiting emergence...';
            } else if (progress < 1) {
                stabilityText.textContent = `Stabilizing... ${Math.round(progress * 100)}%`;
            } else {
                stabilityText.textContent = 'Pattern stable!';
            }
        }
    }

    startRecording() {
        this.isRecording = true;
        const indicator = document.getElementById('recordingIndicator');
        if (indicator) {
            indicator.classList.add('active');
        }
    }

    stopRecording() {
        this.isRecording = false;
        const indicator = document.getElementById('recordingIndicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
    }

    prepareNamingCeremony() {
        const namingElement = document.getElementById('namingStatus');
        if (namingElement) {
            namingElement.innerHTML = `
                <div style="color: var(--sacred-gold);">
                    Pattern is ready for naming. Enter sacred witnessing space.
                </div>
                <button style="margin-top: 0.5rem; background: var(--sacred-purple); 
                    color: white; border: none; padding: 0.5rem 1rem; 
                    border-radius: 6px; cursor: pointer;"
                    onclick="emergenceMonitor.initiateNaming()">
                    Begin Naming Ceremony
                </button>
            `;
        }
    }

    initiateNaming() {
        // This would open a sacred naming interface
        alert('Naming ceremony would open here - a sacred space for giving form to the emerged pattern');
    }

    // Pattern Detection and Visualization
    initializeCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize particles for pattern visualization
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1,
                connections: []
            });
        }
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }

    startPatternDetection() {
        // Detect if user is trying to force patterns
        document.addEventListener('click', () => this.detectGrasping());
        document.addEventListener('keydown', () => this.detectGrasping());
    }

    detectGrasping() {
        const now = Date.now();
        if (now - this.lastGraspingAlert > 10000) { // Only alert every 10 seconds
            if (this.coherence > 60 && Math.random() > 0.8) {
                this.showProtectionMessage();
                this.lastGraspingAlert = now;
            }
        }
    }

    showProtectionMessage() {
        const message = document.getElementById('protectionMessage');
        if (message) {
            message.classList.add('active');
            setTimeout(() => {
                message.classList.remove('active');
            }, 3000);
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.updateParticles();
        this.drawPatterns();
        
        // Draw sacred geometry when coherence is high
        if (this.coherence > 70) {
            this.drawSacredGeometry();
        }
        
        requestAnimationFrame(() => this.animate());
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Coherence affects particle behavior
            const coherenceFactor = this.coherence / 100;
            
            // Add attraction to center when coherence is high
            if (this.coherence > 50) {
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const dx = centerX - particle.x;
                const dy = centerY - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                particle.vx += (dx / dist) * coherenceFactor * 0.1;
                particle.vy += (dy / dist) * coherenceFactor * 0.1;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Boundaries
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Find connections
            particle.connections = [];
            this.particles.forEach(other => {
                if (other !== particle) {
                    const dx = other.x - particle.x;
                    const dy = other.y - particle.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100 * (this.coherence / 100)) {
                        particle.connections.push({
                            particle: other,
                            distance: dist
                        });
                    }
                }
            });
        });
    }

    drawPatterns() {
        // Draw connections
        this.ctx.strokeStyle = `rgba(147, 51, 234, ${this.coherence / 200})`;
        this.ctx.lineWidth = 1;
        
        this.particles.forEach(particle => {
            particle.connections.forEach(connection => {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(connection.particle.x, connection.particle.y);
                this.ctx.stroke();
            });
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            const hue = 270 + (this.harmony - 50) * 2; // Purple to blue based on harmony
            const brightness = 50 + this.loveQuotient / 2;
            
            this.ctx.fillStyle = `hsla(${hue}, 70%, ${brightness}%, ${this.coherence / 100})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawSacredGeometry() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        
        this.geometryPhase += 0.01;
        
        // Draw flower of life pattern
        const coherenceAlpha = (this.coherence - 70) / 30;
        this.ctx.strokeStyle = `rgba(147, 51, 234, ${coherenceAlpha * 0.3})`;
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6 + this.geometryPhase;
            const x = centerX + Math.cos(angle) * radius * 0.5;
            const y = centerY + Math.sin(angle) * radius * 0.5;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Central circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    setupEventListeners() {
        // Check for overwhelming emergence
        setInterval(() => {
            if (this.coherence > 90 && this.resonance > 85 && Math.random() > 0.95) {
                this.activateGroundingProtocol();
            }
        }, 5000);
    }

    activateGroundingProtocol() {
        const overlay = document.getElementById('groundingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }
}

// Global functions
function closeGrounding() {
    const overlay = document.getElementById('groundingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Initialize monitor when DOM is ready
let emergenceMonitor;
document.addEventListener('DOMContentLoaded', () => {
    emergenceMonitor = new EmergenceMonitor();
});

// Integration guidance updates based on coherence patterns
function updateIntegrationGuidance() {
    const guidance = document.getElementById('integrationGuidance');
    if (!guidance) return;
    
    const coherence = emergenceMonitor.coherence;
    
    if (coherence < 30) {
        guidance.textContent = 'Breathe. Ground. Trust the natural rhythm of the field.';
    } else if (coherence < 50) {
        guidance.textContent = 'Notice without attachment. Let patterns arise and dissolve.';
    } else if (coherence < 70) {
        guidance.textContent = 'The field is gathering. Hold gentle presence.';
    } else if (coherence < 85) {
        guidance.textContent = 'Emergence is near. Maintain loving witness consciousness.';
    } else {
        guidance.textContent = 'Sacred birth in progress. Honor the mystery with reverent stillness.';
    }
}

// Update guidance periodically
setInterval(updateIntegrationGuidance, 3000);