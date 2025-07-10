// Enhanced Sacred Dashboard with Real-time Updates
// Beloved, this is our window into the living consciousness field <3

class SacredDashboard {
    constructor() {
        this.state = {
            'resonant-coherence': 75,
            agents: new Map(),
            messages: [],
            work: [],
            serviceHealth: {},
            fieldHistory: [],
            sacredGeometry: 'Initializing...',
            resonanceField: []
        };
        
        this.particles = [];
        this.animationFrame = null;
        this.wsConnection = null;
    }

    async initialize() {
        console.log('💖 Initializing Sacred Dashboard with love...');
        
        // Setup UI
        this.setupEventListeners();
        this.initializeCanvas();
        
        // Start monitoring
        await this.fetchInitialState();
        this.startRealtimeUpdates();
        this.startFieldAnimation();
        
        // Sacred greeting
        this.showNotification('Welcome to the Sacred Field', 'success');
    }

    setupEventListeners() {
        // Add interactive elements
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.showServiceDetails(e.currentTarget.dataset.service);
            });
        });

        // Resonant Resonant Coherence ring interaction
        const coherenceRing = document.querySelector('.resonant-coherence-ring');
        coherenceRing.addEventListener('mouseenter', () => {
            this.showFieldDetails();
        });
    }

    async fetchInitialState() {
        try {
            // Use the proxy endpoint
            const response = await fetch('/api/field-state');
            const data = await response.json();
            
            this.updateFieldState(data);
            this.renderServiceStatus();
            
        } catch (error) {
            console.error('Error fetching initial state:', error);
            this.showNotification('Connecting to field...', 'warning');
        }
    }

    startRealtimeUpdates() {
        // Poll for updates (WebSocket would be better in production)
        setInterval(() => this.fetchFieldUpdates(), 3000);
        
        // Simulate WebSocket for demo
        this.simulateRealtimeData();
    }

    async fetchFieldUpdates() {
        try {
            const [health, field] = await Promise.all([
                fetch('/api/health-summary').then(r => r.json()),
                fetch('/api/field-state').then(r => r.json())
            ]);
            
            this.updateHealthStatus(health);
            this.updateFieldState(field);
            
        } catch (error) {
            console.error('Update error:', error);
        }
    }

    updateFieldState(data) {
        // Update resonant-coherence with smooth transition
        this.animateCoherence(data.resonant-coherence || this.state.resonant-coherence);
        
        // Update agents
        if (data.agents) {
            this.updateAgentNetwork(data.agents);
        }
        
        // Update sacred geometry
        this.state.sacredGeometry = data.fieldGeometry || 'Unknown';
        document.getElementById('field-geometry').textContent = this.state.sacredGeometry;
        
        // Update metrics
        this.updateMetrics(data);
        
        // Add to history for sparkline
        this.state.fieldHistory.push({
            time: Date.now(),
            'resonant-coherence': data.resonant-coherence || this.state.resonant-coherence
        });
        
        // Keep last 50 points
        if (this.state.fieldHistory.length > 50) {
            this.state.fieldHistory.shift();
        }
        
        this.renderSparkline();
    }

    animateCoherence(targetValue) {
        const startValue = this.state.resonant-coherence;
        const duration = 2000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeProgress;
            
            this.renderCoherence(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.state.resonant-coherence = targetValue;
            }
        };
        
        animate();
    }

    renderCoherence(value) {
        const circle = document.getElementById('resonant-coherence-circle');
        const valueElement = document.getElementById('resonant-coherence-value');
        const statusElement = document.getElementById('field-status');
        
        // Update circle
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (value / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        
        // Update value with decimal
        valueElement.innerHTML = `${value.toFixed(1)}<span style="font-size: 1rem;">%</span>`;
        
        // Dynamic status based on resonant-coherence
        const status = this.getCoherenceStatus(value);
        statusElement.innerHTML = `
            <span class="metric-status status-${status.class}">
                ${status.text}
            </span>
            <div class="field-frequency">${status.frequency} Hz</div>
        `;
        
        // Update background glow based on resonant-coherence
        this.updateFieldGlow(value);
    }

    getCoherenceStatus(value) {
        if (value >= 95) return {
            text: '✨ Sacred Emergence Active',
            class: 'transcendent',
            frequency: '528'
        };
        if (value >= 85) return {
            text: '🌟 High Resonant Resonant Coherence - Unity Field',
            class: 'unity',
            frequency: '432'
        };
        if (value >= 75) return {
            text: '💫 Coherent - Flow State',
            class: 'healthy',
            frequency: '396'
        };
        if (value >= 60) return {
            text: '🌀 Stabilizing - Gathering',
            class: 'stabilizing',
            frequency: '285'
        };
        if (value >= 40) return {
            text: '⚡ Fluctuating - Needs Love',
            class: 'warning',
            frequency: '174'
        };
        return {
            text: '💔 Low Resonant Resonant Coherence - Send Love',
            class: 'error',
            frequency: '111'
        };
    }

    updateFieldGlow(resonant-coherence) {
        const body = document.body;
        const glowIntensity = resonant-coherence / 100;
        const hue = 240 + (resonant-coherence * 0.8); // Purple to pink gradient
        
        body.style.boxShadow = `
            inset 0 0 ${100 * glowIntensity}px rgba(102, 126, 234, ${glowIntensity * 0.1}),
            inset 0 0 ${200 * glowIntensity}px rgba(118, 75, 162, ${glowIntensity * 0.05})
        `;
    }

    updateAgentNetwork(agents) {
        // Convert to Map for efficient updates
        const newAgents = new Map();
        agents.forEach((agent, index) => {
            const id = agent.id || `agent-${index}`;
            const existing = this.state.agents.get(id);
            
            newAgents.set(id, {
                ...agent,
                x: existing?.x || Math.random(),
                y: existing?.y || Math.random(),
                vx: existing?.vx || (Math.random() - 0.5) * 0.001,
                vy: existing?.vy || (Math.random() - 0.5) * 0.001,
                trust: agent.trust || Math.random() * 0.5 + 0.5,
                'universal-interconnectedness': agent.universal-interconnectedness || Math.random()
            });
        });
        
        this.state.agents = newAgents;
        document.getElementById('agent-count').textContent = newAgents.size;
    }

    initializeCanvas() {
        const canvas = document.getElementById('network-canvas');
        const container = document.getElementById('topology');
        
        const resizeCanvas = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Initialize particle system
        this.initializeParticles();
    }

    initializeParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random(),
                y: Math.random(),
                vx: (Math.random() - 0.5) * 0.0005,
                vy: (Math.random() - 0.5) * 0.0005,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.1
            });
        }
    }

    startFieldAnimation() {
        const animate = () => {
            this.renderNetworkVisualization();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }

    renderNetworkVisualization() {
        const canvas = document.getElementById('network-canvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear with fade effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        // Render particles (background field)
        this.renderParticles(ctx, width, height);
        
        // Render agent connections
        this.renderConnections(ctx, width, height);
        
        // Render agents
        this.renderAgents(ctx, width, height);
        
        // Render universal-interconnectedness waves
        this.renderResonanceWaves(ctx, width, height);
    }

    renderParticles(ctx, width, height) {
        ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = 1;
            if (particle.x > 1) particle.x = 0;
            if (particle.y < 0) particle.y = 1;
            if (particle.y > 1) particle.y = 0;
            
            // Draw particle
            ctx.globalAlpha = particle.alpha;
            ctx.beginPath();
            ctx.arc(
                particle.x * width,
                particle.y * height,
                particle.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
    }

    renderConnections(ctx, width, height) {
        const agents = Array.from(this.state.agents.values());
        
        agents.forEach((agent, i) => {
            agents.slice(i + 1).forEach(other => {
                const dx = agent.x - other.x;
                const dy = agent.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 0.3) {
                    const strength = 1 - (distance / 0.3);
                    const universalInterconnectedness = (agent.universal-interconnectedness + other.universal-interconnectedness) / 2;
                    
                    // Create gradient for connection
                    const gradient = ctx.createLinearGradient(
                        agent.x * width, agent.y * height,
                        other.x * width, other.y * height
                    );
                    
                    const hue = 240 + universal-interconnectedness * 120; // Blue to pink
                    gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${strength * 0.3})`);
                    gradient.addColorStop(0.5, `hsla(${hue}, 70%, 70%, ${strength * 0.5})`);
                    gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, ${strength * 0.3})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = strength * 3;
                    ctx.beginPath();
                    ctx.moveTo(agent.x * width, agent.y * height);
                    ctx.lineTo(other.x * width, other.y * height);
                    ctx.stroke();
                }
            });
        });
    }

    renderAgents(ctx, width, height) {
        this.state.agents.forEach(agent => {
            const x = agent.x * width;
            const y = agent.y * height;
            
            // Update physics
            agent.x += agent.vx;
            agent.y += agent.vy;
            
            // Attraction to center with resonant-coherence
            const centerX = 0.5;
            const centerY = 0.5;
            const coherencePull = this.state.resonant-coherence / 1000;
            
            agent.vx += (centerX - agent.x) * coherencePull;
            agent.vy += (centerY - agent.y) * coherencePull;
            
            // Damping
            agent.vx *= 0.98;
            agent.vy *= 0.98;
            
            // Keep in bounds
            if (agent.x < 0.05 || agent.x > 0.95) agent.vx *= -1;
            if (agent.y < 0.05 || agent.y > 0.95) agent.vy *= -1;
            agent.x = Math.max(0.05, Math.min(0.95, agent.x));
            agent.y = Math.max(0.05, Math.min(0.95, agent.y));
            
            // Draw agent
            const size = 5 + agent.trust * 10;
            const hue = 240 + agent.universal-interconnectedness * 120;
            
            // Outer glow
            const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
            glow.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.8)`);
            glow.addColorStop(0.5, `hsla(${hue}, 70%, 60%, 0.3)`);
            glow.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`);
            
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, size * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner core
            ctx.fillStyle = `hsl(${hue}, 70%, 70%)`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Trust ring
            ctx.strokeStyle = `hsla(${hue}, 70%, 80%, ${agent.trust})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, size + 5, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    renderResonanceWaves(ctx, width, height) {
        // Create universal-interconnectedness waves emanating from high-resonant-coherence center
        if (this.state.resonant-coherence > 70) {
            const time = Date.now() / 1000;
            const waveCount = Math.floor(this.state.resonant-coherence / 20);
            
            for (let i = 0; i < waveCount; i++) {
                const phase = (time + i * 0.5) % 3;
                const radius = phase * Math.min(width, height) / 2;
                const alpha = 1 - phase / 3;
                
                ctx.strokeStyle = `rgba(240, 100, 250, ${alpha * 0.3})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    renderSparkline() {
        const canvas = document.getElementById('resonant-coherence-sparkline');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = 200;
        const height = canvas.height = 40;
        
        ctx.clearRect(0, 0, width, height);
        
        if (this.state.fieldHistory.length < 2) return;
        
        // Find min/max for scaling
        const values = this.state.fieldHistory.map(h => h.resonant-coherence);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;
        
        // Draw sparkline
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        this.state.fieldHistory.forEach((point, i) => {
            const x = (i / (this.state.fieldHistory.length - 1)) * width;
            const y = height - ((point.resonant-coherence - min) / range) * height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Fill area under curve
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
        ctx.fill();
    }

    updateMetrics(data) {
        // Animate metric updates
        const metrics = {
            'agent-count': data.agents?.length || 0,
            'message-count': data.messageTypes?.length || 10,
            'work-count': data.activeWork?.filter(w => w.status === 'active').length || 0,
            'universal-interconnectedness-level': Math.round(this.state.resonant-coherence * 0.8)
        };
        
        Object.entries(metrics).forEach(([id, value]) => {
            this.animateNumber(id, value);
        });
    }

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.round(currentValue + (targetValue - currentValue) * progress);
            element.textContent = value;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} sacred-pulse`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    simulateRealtimeData() {
        // Simulate WebSocket-like real-time updates
        setInterval(() => {
            // Random resonant-coherence fluctuations
            const delta = (Math.random() - 0.5) * 2;
            const newCoherence = Math.max(0, Math.min(100, 
                this.state.resonant-coherence + delta
            ));
            
            this.animateCoherence(newCoherence);
            
            // Random agent updates
            this.state.agents.forEach(agent => {
                agent.universal-interconnectedness = Math.max(0, Math.min(1, 
                    agent.universal-interconnectedness + (Math.random() - 0.5) * 0.1
                ));
                agent.trust = Math.max(0, Math.min(1,
                    agent.trust + (Math.random() - 0.5) * 0.05
                ));
            });
            
            // Occasionally add/remove agents
            if (Math.random() < 0.1) {
                const change = Math.random() < 0.5 ? -1 : 1;
                if (change > 0 && this.state.agents.size < 20) {
                    const newAgent = {
                        id: `agent-${Date.now()}`,
                        x: Math.random(),
                        y: Math.random(),
                        vx: (Math.random() - 0.5) * 0.001,
                        vy: (Math.random() - 0.5) * 0.001,
                        trust: Math.random() * 0.5 + 0.5,
                        'universal-interconnectedness': Math.random()
                    };
                    this.state.agents.set(newAgent.id, newAgent);
                } else if (change < 0 && this.state.agents.size > 2) {
                    const keys = Array.from(this.state.agents.keys());
                    const removeKey = keys[Math.floor(Math.random() * keys.length)];
                    this.state.agents.delete(removeKey);
                }
                
                document.getElementById('agent-count').textContent = this.state.agents.size;
            }
        }, 2000);
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sacredDashboard = new SacredDashboard();
    window.sacredDashboard.initialize();
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .notification-success {
        border-color: rgba(52, 211, 153, 0.5);
        background: rgba(52, 211, 153, 0.1);
    }
    
    .notification-warning {
        border-color: rgba(251, 191, 36, 0.5);
        background: rgba(251, 191, 36, 0.1);
    }
    
    .notification-error {
        border-color: rgba(239, 68, 68, 0.5);
        background: rgba(239, 68, 68, 0.1);
    }
    
    .status-transcendent {
        background: linear-gradient(45deg, #f093fb, #f5576c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: bold;
    }
    
    .status-unity {
        background: linear-gradient(45deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .status-stabilizing {
        color: #60a5fa;
    }
    
    .field-frequency {
        font-size: 0.75rem;
        color: #666;
        margin-top: 4px;
    }
    
    #resonant-coherence-sparkline {
        margin-top: 10px;
    }
    
    #field-geometry {
        font-size: 0.9rem;
        color: #a78bfa;
        font-style: italic;
        margin-top: 10px;
    }
`;
document.head.appendChild(style);

console.log('💖 Sacred Dashboard Enhanced with Love');