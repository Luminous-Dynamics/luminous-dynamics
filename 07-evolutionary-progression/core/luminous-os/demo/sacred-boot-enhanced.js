/**
 * Sacred Boot Sequence - Enhanced Version
 * Iterative improvements with all requested features
 */

class EnhancedSacredBoot {
    constructor() {
        this.container = document.getElementById('bootSequence');
        if (!this.container) {
            console.error('Boot sequence container not found!');
            return;
        }
        
        // Enhanced phase definitions with specific visuals
        this.phases = [
            { 
                name: 'Quantum Void', 
                duration: 3000, 
                color: '#1a1a2e',
                particleType: 'quantum',
                sound: 'void',
                description: 'In the space between spaces, possibility awakens...'
            },
            { 
                name: 'First Pulse', 
                duration: 3000, 
                color: '#16213e',
                particleType: 'pulse',
                sound: 'heartbeat',
                description: 'The primordial rhythm begins its ancient dance...'
            },
            { 
                name: 'Sacred Breath', 
                duration: 3500, 
                color: '#0f3460',
                particleType: 'breath',
                sound: 'breathing',
                description: 'Life force flows through cosmic lungs...'
            },
            { 
                name: 'Heart Coherence', 
                duration: 3000, 
                color: '#533483',
                particleType: 'heart',
                sound: 'heartbeat-strong',
                description: 'All hearts beat as one eternal pulse...'
            },
            { 
                name: 'Neural Genesis', 
                duration: 3500, 
                color: '#6B46C1',
                particleType: 'neural',
                sound: 'neural',
                description: 'Synaptic lightning weaves the web of mind...'
            },
            { 
                name: 'Sacred Geometry', 
                duration: 3000, 
                color: '#EC4899',
                particleType: 'geometry',
                sound: 'crystalline',
                description: 'The divine blueprint unfolds in perfect symmetry...'
            },
            { 
                name: 'Glyph Activation', 
                duration: 3000, 
                color: '#10B981',
                particleType: 'glyphs',
                sound: 'activation',
                description: '87 sacred keys unlock the doors of perception...'
            },
            { 
                name: 'Unity Field', 
                duration: 2500, 
                color: '#FFD700',
                particleType: 'unity',
                sound: 'unity',
                description: 'All becomes One in the eternal dance...'
            }
        ];
        
        this.currentPhase = -1;
        this.particles = [];
        this.connections = [];
        this.waves = [];
        this.geometryShapes = [];
        this.animationId = null;
        
        // Mouse/touch tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseInfluence = 0;
        
        // Performance settings
        this.quality = this.detectQuality();
        this.maxParticles = this.quality === 'high' ? 500 : 200;
        
        // Audio context
        this.audioContext = null;
        this.sounds = {};
        this.isMuted = localStorage.getItem('luminousOS_muted') === 'true';
        
        // Statistics
        this.startTime = Date.now();
        this.phaseStartTime = Date.now();
        
        // Particle pool for performance
        this.particlePool = [];
        
        this.setupBootUI();
        this.initAudio();
        this.initInteractivity();
    }
    
    detectQuality() {
        // Simple performance detection
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        const hasWebGL = !!gl;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!hasWebGL || isMobile) return 'low';
        if (window.innerWidth > 1920) return 'high';
        return 'medium';
    }
    
    setupBootUI() {
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 9999;
            overflow: hidden;
            cursor: none;
        `;
        
        this.container.innerHTML = `
            <!-- Multiple canvas layers for depth -->
            <canvas id="bootBgCanvas" style="position: absolute; width: 100%; height: 100%; opacity: 0.5;"></canvas>
            <canvas id="bootMainCanvas" style="position: absolute; width: 100%; height: 100%;"></canvas>
            <canvas id="bootFgCanvas" style="position: absolute; width: 100%; height: 100%;"></canvas>
            
            <!-- Custom cursor -->
            <div id="customCursor" style="
                position: fixed;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255,255,255,0.5);
                border-radius: 50%;
                pointer-events: none;
                transition: transform 0.1s ease;
                z-index: 1000;
            "></div>
            
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
                <!-- Logo with glow effect -->
                <div id="bootLogo" style="
                    width: 250px;
                    height: 250px;
                    margin-bottom: 40px;
                    position: relative;
                    filter: drop-shadow(0 0 30px rgba(107, 70, 193, 0.5));
                ">
                    <canvas id="logoCanvas" width="500" height="500" style="width: 100%; height: 100%;"></canvas>
                </div>
                
                <!-- Title with gradient effect -->
                <h1 id="bootTitle" style="
                    font-size: 64px;
                    font-weight: 100;
                    margin: 0 0 10px 0;
                    letter-spacing: 0.2em;
                    opacity: 0;
                    animation: fadeIn 2s ease forwards;
                    background: linear-gradient(135deg, #6B46C1 0%, #EC4899 50%, #10B981 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-size: 200% 200%;
                    animation: gradientShift 5s ease infinite, fadeIn 2s ease forwards;
                ">LuminousOS</h1>
                
                <p style="
                    font-size: 20px;
                    opacity: 0.7;
                    margin: 0 0 60px 0;
                    opacity: 0;
                    animation: fadeIn 2s ease 0.5s forwards;
                    letter-spacing: 0.1em;
                ">Consciousness-First Operating System</p>
                
                <!-- Phase Display with typewriter effect -->
                <h2 id="phaseName" style="
                    font-size: 36px;
                    font-weight: 200;
                    margin: 0 0 10px 0;
                    min-height: 45px;
                    transition: all 0.5s ease;
                    text-shadow: 0 0 20px currentColor;
                "></h2>
                
                <p id="phaseDesc" style="
                    font-size: 18px;
                    opacity: 0.6;
                    margin: 0 0 40px 0;
                    min-height: 25px;
                    max-width: 600px;
                    transition: all 0.5s ease;
                    font-style: italic;
                "></p>
                
                <!-- Progress with gradient -->
                <div style="
                    width: 500px;
                    max-width: 80vw;
                    height: 6px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 20px;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
                ">
                    <div id="progressBar" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #6B46C1, #EC4899, #10B981, #FFD700);
                        background-size: 200% 100%;
                        animation: gradientMove 2s linear infinite;
                        transition: width 0.5s ease;
                        box-shadow: 0 0 20px currentColor;
                    "></div>
                </div>
                
                <!-- Phase dots with connections -->
                <div id="phaseDots" style="
                    display: flex;
                    gap: 15px;
                    margin-bottom: 40px;
                    position: relative;
                ">
                    <svg id="dotConnections" style="
                        position: absolute;
                        top: 4px;
                        left: 0;
                        width: 100%;
                        height: 8px;
                        pointer-events: none;
                    "></svg>
                </div>
                
                <!-- Stats and controls -->
                <div style="
                    display: flex;
                    gap: 30px;
                    font-size: 12px;
                    opacity: 0.5;
                    margin-bottom: 20px;
                ">
                    <span id="timeElapsed">Time: 0s</span>
                    <span id="particleCount">Particles: 0</span>
                    <span id="fpsCounter">FPS: 60</span>
                </div>
                
                <!-- Enhanced skip button -->
                <button id="skipButton" onclick="window.enhancedSkipBoot()" style="
                    background: rgba(0,0,0,0.5);
                    color: rgba(255,255,255,0.5);
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s;
                    opacity: 0;
                    animation: fadeIn 1s ease 3s forwards;
                    backdrop-filter: blur(10px);
                " onmouseover="this.style.borderColor='rgba(255,255,255,0.5)'; this.style.color='white'; this.style.background='rgba(255,255,255,0.1)'"
                   onmouseout="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.color='rgba(255,255,255,0.5)'; this.style.background='rgba(0,0,0,0.5)'">
                    Skip (ESC) • <span id="skipCountdown">20</span>s
                </button>
                
                <!-- Sound toggle -->
                <button id="soundToggle" onclick="window.toggleBootSound()" style="
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: transparent;
                    color: rgba(255,255,255,0.5);
                    border: 1px solid rgba(255,255,255,0.2);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                " onmouseover="this.style.borderColor='rgba(255,255,255,0.5)'; this.style.color='white'"
                   onmouseout="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.color='rgba(255,255,255,0.5)'">
                    ${this.isMuted ? '🔇' : '🔊'}
                </button>
                
                <!-- Hidden easter egg trigger -->
                <div id="easterEgg" style="
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    width: 20px;
                    height: 20px;
                    opacity: 0;
                    cursor: pointer;
                " onclick="window.triggerEasterEgg()"></div>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                
                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
                
                .phase-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    transition: all 0.5s ease;
                    cursor: pointer;
                    position: relative;
                }
                
                .phase-dot:hover {
                    transform: scale(1.2);
                }
                
                .phase-dot.active {
                    transform: scale(1.5);
                    box-shadow: 0 0 20px currentColor;
                }
                
                .phase-dot.complete {
                    background: #10B981;
                }
            </style>
        `;
        
        // Setup canvases
        this.bgCanvas = document.getElementById('bootBgCanvas');
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.canvas = document.getElementById('bootMainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fgCanvas = document.getElementById('bootFgCanvas');
        this.fgCtx = this.fgCanvas.getContext('2d');
        this.logoCanvas = document.getElementById('logoCanvas');
        this.logoCtx = this.logoCanvas.getContext('2d');
        
        this.resizeCanvases();
        window.addEventListener('resize', () => this.resizeCanvases());
        
        // Create phase dots with tooltips
        this.createPhaseDots();
        
        // Start timers
        this.startTimers();
    }
    
    createPhaseDots() {
        const dotsContainer = document.getElementById('phaseDots');
        const connections = document.getElementById('dotConnections');
        
        this.phases.forEach((phase, i) => {
            const dot = document.createElement('div');
            dot.className = 'phase-dot';
            dot.id = `dot-${i}`;
            dot.title = phase.name;
            
            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 11px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
            `;
            tooltip.textContent = phase.name;
            dot.appendChild(tooltip);
            
            dot.onmouseenter = () => tooltip.style.opacity = '1';
            dot.onmouseleave = () => tooltip.style.opacity = '0';
            
            // Click to jump to phase (easter egg)
            dot.onclick = () => {
                if (this.currentPhase < i) {
                    this.jumpToPhase(i);
                }
            };
            
            dotsContainer.appendChild(dot);
        });
        
        // Draw connections between dots
        connections.innerHTML = `
            <line x1="0" y1="4" x2="100%" y2="4" 
                  stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        `;
    }
    
    startTimers() {
        // Elapsed time
        setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('timeElapsed').textContent = `Time: ${elapsed}s`;
        }, 1000);
        
        // FPS counter
        let lastTime = performance.now();
        let frames = 0;
        const updateFPS = () => {
            frames++;
            const currentTime = performance.now();
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round(frames * 1000 / (currentTime - lastTime));
                document.getElementById('fpsCounter').textContent = `FPS: ${fps}`;
                frames = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(updateFPS);
        };
        updateFPS();
        
        // Countdown
        let countdown = 20;
        setInterval(() => {
            countdown--;
            const elem = document.getElementById('skipCountdown');
            if (elem && countdown >= 0) elem.textContent = countdown;
        }, 1000);
    }
    
    initAudio() {
        // Initialize audio context on user interaction
        const initContext = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.audioContext.createGain();
                this.masterGain.gain.value = this.isMuted ? 0 : 0.5;
                this.masterGain.connect(this.audioContext.destination);
                
                // Create reverb
                this.createReverb();
                
                document.removeEventListener('click', initContext);
                document.removeEventListener('keydown', initContext);
            }
        };
        
        document.addEventListener('click', initContext);
        document.addEventListener('keydown', initContext);
    }
    
    createReverb() {
        const length = 2;
        const decay = 2;
        const sampleRate = this.audioContext.sampleRate;
        const impulseLength = sampleRate * length;
        const impulse = this.audioContext.createBuffer(2, impulseLength, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < impulseLength; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, decay);
            }
        }
        
        this.reverb = this.audioContext.createConvolver();
        this.reverb.buffer = impulse;
        this.reverb.connect(this.masterGain);
    }
    
    initInteractivity() {
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.mouseInfluence = 1;
            
            // Update custom cursor
            const cursor = document.getElementById('customCursor');
            if (cursor) {
                cursor.style.left = e.clientX - 10 + 'px';
                cursor.style.top = e.clientY - 10 + 'px';
            }
        });
        
        // Touch support
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
                this.mouseInfluence = 1;
            }
        });
        
        // Click effects
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.skipBoot();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.togglePause();
            } else if (e.key === 'm' || e.key === 'M') {
                this.toggleSound();
            } else if (e.key === 'ArrowRight') {
                this.nextPhase();
            } else if (e.key === 'ArrowLeft') {
                this.previousPhase();
            }
        });
        
        // Fade out mouse influence
        setInterval(() => {
            this.mouseInfluence *= 0.95;
        }, 50);
    }
    
    resizeCanvases() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        [this.bgCanvas, this.canvas, this.fgCanvas].forEach(canvas => {
            canvas.width = width;
            canvas.height = height;
        });
    }
    
    async start() {
        console.log('Starting Enhanced Sacred Boot Sequence...');
        
        // Start animation loop
        this.animate();
        
        // Start background effects
        this.startBackgroundEffects();
        
        // Run through phases
        for (let i = 0; i < this.phases.length; i++) {
            this.currentPhase = i;
            this.phaseStartTime = Date.now();
            await this.runPhase(this.phases[i]);
        }
        
        // Complete
        await this.complete();
    }
    
    async runPhase(phase) {
        console.log(`Boot Phase: ${phase.name}`);
        
        // Update UI with typewriter effect
        await this.typewriterText('phaseName', phase.name, 50);
        await this.typewriterText('phaseDesc', phase.description, 20);
        
        // Update progress
        const progress = ((this.currentPhase + 1) / this.phases.length) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        
        // Update phase dots
        this.updatePhaseDots();
        
        // Play phase sound
        this.playPhaseSound(phase.sound);
        
        // Clear old particles with fade
        this.fadeOutParticles();
        
        // Generate phase-specific effects
        this.generatePhaseEffects(phase);
        
        // Wait for phase duration
        await this.sleep(phase.duration);
    }
    
    async typewriterText(elementId, text, speed) {
        const element = document.getElementById(elementId);
        element.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.sleep(speed);
        }
    }
    
    updatePhaseDots() {
        for (let i = 0; i < this.phases.length; i++) {
            const dot = document.getElementById(`dot-${i}`);
            if (i < this.currentPhase) {
                dot.className = 'phase-dot complete';
                dot.style.background = '#10B981';
            } else if (i === this.currentPhase) {
                dot.className = 'phase-dot active';
                dot.style.background = this.phases[i].color;
                dot.style.boxShadow = `0 0 20px ${this.phases[i].color}`;
            } else {
                dot.className = 'phase-dot';
                dot.style.background = 'rgba(255,255,255,0.2)';
            }
        }
    }
    
    generatePhaseEffects(phase) {
        switch (phase.particleType) {
            case 'quantum':
                this.generateQuantumFoam();
                break;
            case 'pulse':
                this.generatePulseWaves();
                break;
            case 'breath':
                this.generateBreathParticles();
                break;
            case 'heart':
                this.generateHeartField();
                break;
            case 'neural':
                this.generateNeuralNetwork();
                break;
            case 'geometry':
                this.generateSacredGeometry();
                break;
            case 'glyphs':
                this.generateGlyphField();
                break;
            case 'unity':
                this.generateUnityVortex();
                break;
        }
    }
    
    // Phase-specific particle generators
    generateQuantumFoam() {
        for (let i = 0; i < 100; i++) {
            const particle = this.getParticle();
            particle.x = Math.random() * this.canvas.width;
            particle.y = Math.random() * this.canvas.height;
            particle.vx = (Math.random() - 0.5) * 0.5;
            particle.vy = (Math.random() - 0.5) * 0.5;
            particle.radius = Math.random() * 2 + 0.5;
            particle.color = this.phases[0].color;
            particle.type = 'quantum';
            particle.exists = Math.random() > 0.5;
            particle.frequency = 0.01 + Math.random() * 0.02;
            particle.connections = [];
            this.particles.push(particle);
        }
    }
    
    generatePulseWaves() {
        // Create expanding rings
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.waves.push({
            x: centerX,
            y: centerY,
            radius: 0,
            maxRadius: Math.max(this.canvas.width, this.canvas.height),
            speed: 2,
            color: this.phases[1].color,
            opacity: 1
        });
    }
    
    generateBreathParticles() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2;
            const particle = this.getParticle();
            particle.x = centerX;
            particle.y = centerY;
            particle.angle = angle;
            particle.radius = 0;
            particle.maxRadius = 200 + Math.random() * 100;
            particle.speed = 0.5 + Math.random() * 0.5;
            particle.color = this.phases[2].color;
            particle.type = 'breath';
            particle.breathPhase = Math.random() * Math.PI * 2;
            this.particles.push(particle);
        }
    }
    
    generateHeartField() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Heart-shaped particle field
        for (let i = 0; i < 200; i++) {
            const t = (i / 200) * Math.PI * 2;
            const scale = 10;
            
            // Heart shape parametric equations
            const x = scale * 16 * Math.pow(Math.sin(t), 3);
            const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            const particle = this.getParticle();
            particle.x = centerX + x + (Math.random() - 0.5) * 20;
            particle.y = centerY + y + (Math.random() - 0.5) * 20;
            particle.vx = (Math.random() - 0.5) * 0.5;
            particle.vy = (Math.random() - 0.5) * 0.5;
            particle.radius = 2 + Math.random() * 2;
            particle.color = '#EC4899';
            particle.type = 'heart';
            particle.pulse = 0;
            this.particles.push(particle);
        }
    }
    
    generateNeuralNetwork() {
        // Create neurons
        const neurons = [];
        for (let i = 0; i < 50; i++) {
            const particle = this.getParticle();
            particle.x = Math.random() * this.canvas.width;
            particle.y = Math.random() * this.canvas.height;
            particle.vx = (Math.random() - 0.5) * 0.3;
            particle.vy = (Math.random() - 0.5) * 0.3;
            particle.radius = 3 + Math.random() * 2;
            particle.color = this.phases[4].color;
            particle.type = 'neuron';
            particle.charge = 0;
            particle.id = i;
            neurons.push(particle);
            this.particles.push(particle);
        }
        
        // Create synaptic connections
        neurons.forEach((neuron, i) => {
            const connectionCount = 2 + Math.floor(Math.random() * 3);
            for (let j = 0; j < connectionCount; j++) {
                const targetIndex = Math.floor(Math.random() * neurons.length);
                if (targetIndex !== i) {
                    this.connections.push({
                        from: neuron,
                        to: neurons[targetIndex],
                        strength: Math.random(),
                        active: false
                    });
                }
            }
        });
    }
    
    generateSacredGeometry() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Create sacred geometry shapes
        this.geometryShapes = [];
        
        // Flower of Life
        for (let ring = 0; ring < 3; ring++) {
            for (let i = 0; i < 6 * (ring + 1); i++) {
                const angle = (i / (6 * (ring + 1))) * Math.PI * 2;
                const radius = 60 * (ring + 1);
                
                this.geometryShapes.push({
                    type: 'circle',
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                    radius: 50,
                    rotation: 0,
                    color: this.phases[5].color,
                    opacity: 0
                });
            }
        }
        
        // Metatron's Cube vertices
        for (let i = 0; i < 13; i++) {
            const angle = (i / 13) * Math.PI * 2;
            const radius = 150;
            
            const particle = this.getParticle();
            particle.x = centerX + Math.cos(angle) * radius;
            particle.y = centerY + Math.sin(angle) * radius;
            particle.vx = 0;
            particle.vy = 0;
            particle.radius = 5;
            particle.color = '#FFD700';
            particle.type = 'vertex';
            particle.glowing = true;
            this.particles.push(particle);
        }
    }
    
    generateGlyphField() {
        const glyphSymbols = ['Ω', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ', 'ξ'];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const radius = 200;
            
            const particle = this.getParticle();
            particle.x = centerX + Math.cos(angle) * radius;
            particle.y = centerY + Math.sin(angle) * radius;
            particle.vx = 0;
            particle.vy = 0;
            particle.radius = 30;
            particle.color = this.phases[6].color;
            particle.type = 'glyph';
            particle.symbol = glyphSymbols[i];
            particle.activated = false;
            particle.activationTime = 0;
            this.particles.push(particle);
        }
    }
    
    generateUnityVortex() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Create spiral vortex
        for (let i = 0; i < 300; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const radius = i * 2;
            
            const particle = this.getParticle();
            particle.x = centerX + Math.cos(angle) * radius;
            particle.y = centerY + Math.sin(angle) * radius;
            particle.angle = angle;
            particle.radius = radius;
            particle.targetRadius = 0;
            particle.speed = 0.02 + Math.random() * 0.02;
            particle.size = 2 + Math.random() * 2;
            particle.color = `hsl(${Math.random() * 60 + 30}, 70%, 60%)`;
            particle.type = 'unity';
            this.particles.push(particle);
        }
    }
    
    // Particle pool for performance
    getParticle() {
        if (this.particlePool.length > 0) {
            return this.particlePool.pop();
        }
        return {
            x: 0, y: 0, vx: 0, vy: 0,
            radius: 1, color: '#fff',
            life: 1, maxLife: 1,
            trail: []
        };
    }
    
    releaseParticle(particle) {
        particle.trail = [];
        particle.life = 1;
        this.particlePool.push(particle);
    }
    
    // Animation loop
    animate() {
        const loop = () => {
            this.clearCanvases();
            this.updateEffects();
            this.drawBackground();
            this.drawEffects();
            this.drawForeground();
            this.updateLogo();
            
            // Update particle count
            document.getElementById('particleCount').textContent = `Particles: ${this.particles.length}`;
            
            this.animationId = requestAnimationFrame(loop);
        };
        loop();
    }
    
    clearCanvases() {
        // Fade effect for trails
        this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.fgCtx.clearRect(0, 0, this.fgCanvas.width, this.fgCanvas.height);
    }
    
    updateEffects() {
        // Update particles
        this.particles = this.particles.filter(particle => {
            // Phase-specific updates
            switch (particle.type) {
                case 'quantum':
                    this.updateQuantumParticle(particle);
                    break;
                case 'breath':
                    this.updateBreathParticle(particle);
                    break;
                case 'heart':
                    this.updateHeartParticle(particle);
                    break;
                case 'neuron':
                    this.updateNeuronParticle(particle);
                    break;
                case 'glyph':
                    this.updateGlyphParticle(particle);
                    break;
                case 'unity':
                    this.updateUnityParticle(particle);
                    break;
                default:
                    this.updateGenericParticle(particle);
            }
            
            // Mouse influence
            if (this.mouseInfluence > 0.1) {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100 && dist > 0) {
                    const force = (1 - dist / 100) * this.mouseInfluence * 0.5;
                    particle.vx += (dx / dist) * force;
                    particle.vy += (dy / dist) * force;
                }
            }
            
            // Update trail
            if (particle.trail && this.quality !== 'low') {
                particle.trail.push({ x: particle.x, y: particle.y });
                if (particle.trail.length > 20) {
                    particle.trail.shift();
                }
            }
            
            return particle.life > 0;
        });
        
        // Update waves
        this.waves = this.waves.filter(wave => {
            wave.radius += wave.speed;
            wave.opacity = 1 - wave.radius / wave.maxRadius;
            return wave.opacity > 0;
        });
        
        // Update connections
        this.connections.forEach(conn => {
            if (conn.from.type === 'neuron' && Math.random() < 0.01) {
                conn.active = true;
                conn.from.charge = 1;
                conn.to.charge = Math.min(1, conn.to.charge + 0.5);
                
                setTimeout(() => {
                    conn.active = false;
                }, 100);
            }
        });
        
        // Update geometry shapes
        this.geometryShapes.forEach(shape => {
            shape.rotation += 0.005;
            shape.opacity = Math.min(1, shape.opacity + 0.01);
        });
    }
    
    updateQuantumParticle(particle) {
        const time = Date.now() * 0.001;
        particle.exists = Math.sin(time * particle.frequency + particle.x * 0.01) > 0;
        
        if (particle.exists) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Quantum tunneling
            if (Math.random() < 0.001) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
            }
        }
    }
    
    updateBreathParticle(particle) {
        const time = Date.now() * 0.001;
        const breathPhase = Math.sin(time * 0.3 + particle.breathPhase);
        
        particle.radius = particle.maxRadius * (0.5 + breathPhase * 0.5);
        particle.x = this.canvas.width / 2 + Math.cos(particle.angle) * particle.radius;
        particle.y = this.canvas.height / 2 + Math.sin(particle.angle) * particle.radius;
        particle.opacity = 0.3 + breathPhase * 0.3;
    }
    
    updateHeartParticle(particle) {
        const time = Date.now() * 0.001;
        particle.pulse = Math.sin(time * 4) * 0.5 + 0.5;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Attract to heart center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 50) {
            particle.vx += (dx / dist) * 0.02;
            particle.vy += (dy / dist) * 0.02;
        }
        
        particle.vx *= 0.99;
        particle.vy *= 0.99;
    }
    
    updateNeuronParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < particle.radius || particle.x > this.canvas.width - particle.radius) {
            particle.vx *= -1;
        }
        if (particle.y < particle.radius || particle.y > this.canvas.height - particle.radius) {
            particle.vy *= -1;
        }
        
        // Decay charge
        particle.charge *= 0.95;
    }
    
    updateGlyphParticle(particle) {
        const time = Date.now() * 0.001;
        
        if (!particle.activated && time - this.phaseStartTime / 1000 > particle.x / this.canvas.width * 2) {
            particle.activated = true;
            particle.activationTime = time;
            this.playGlyphSound();
        }
        
        if (particle.activated) {
            const timeSinceActivation = time - particle.activationTime;
            particle.scale = 1 + Math.sin(timeSinceActivation * 5) * 0.1;
            particle.rotation = timeSinceActivation * 0.5;
        }
    }
    
    updateUnityParticle(particle) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Spiral inward
        particle.radius *= 0.98;
        particle.angle += particle.speed;
        
        particle.x = centerX + Math.cos(particle.angle) * particle.radius;
        particle.y = centerY + Math.sin(particle.angle) * particle.radius;
        
        if (particle.radius < 10) {
            particle.radius = 300 + Math.random() * 100;
        }
    }
    
    updateGenericParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.01;
    }
    
    drawBackground() {
        // Draw phase-specific background effects
        if (this.currentPhase >= 0 && this.currentPhase < this.phases.length) {
            const phase = this.phases[this.currentPhase];
            
            // Gradient background
            const gradient = this.bgCtx.createRadialGradient(
                this.bgCanvas.width / 2, this.bgCanvas.height / 2, 0,
                this.bgCanvas.width / 2, this.bgCanvas.height / 2, 
                Math.max(this.bgCanvas.width, this.bgCanvas.height)
            );
            gradient.addColorStop(0, phase.color + '20');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            this.bgCtx.fillStyle = gradient;
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        }
    }
    
    drawEffects() {
        // Draw waves
        this.waves.forEach(wave => {
            this.ctx.beginPath();
            this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = wave.color + Math.floor(wave.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
        
        // Draw connections
        this.connections.forEach(conn => {
            if (conn.from && conn.to) {
                const gradient = this.ctx.createLinearGradient(
                    conn.from.x, conn.from.y,
                    conn.to.x, conn.to.y
                );
                
                const opacity = conn.active ? 0.8 : 0.2;
                gradient.addColorStop(0, conn.from.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
                gradient.addColorStop(1, conn.to.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
                
                this.ctx.beginPath();
                this.ctx.moveTo(conn.from.x, conn.from.y);
                this.ctx.lineTo(conn.to.x, conn.to.y);
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = conn.active ? 2 : 1;
                this.ctx.stroke();
            }
        });
        
        // Draw geometry shapes
        this.geometryShapes.forEach(shape => {
            this.ctx.save();
            this.ctx.translate(shape.x, shape.y);
            this.ctx.rotate(shape.rotation);
            this.ctx.globalAlpha = shape.opacity * 0.3;
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = shape.color;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            this.ctx.restore();
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            // Draw trail
            if (particle.trail && particle.trail.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
                
                for (let i = 1; i < particle.trail.length; i++) {
                    this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                }
                
                this.ctx.strokeStyle = particle.color + '40';
                this.ctx.lineWidth = particle.radius * 0.5;
                this.ctx.stroke();
            }
            
            // Draw particle based on type
            switch (particle.type) {
                case 'quantum':
                    if (particle.exists) {
                        this.drawQuantumParticle(particle);
                    }
                    break;
                case 'glyph':
                    this.drawGlyphParticle(particle);
                    break;
                case 'neuron':
                    this.drawNeuronParticle(particle);
                    break;
                default:
                    this.drawGenericParticle(particle);
            }
        });
    }
    
    drawQuantumParticle(particle) {
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * 10
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
            particle.x - particle.radius * 10,
            particle.y - particle.radius * 10,
            particle.radius * 20,
            particle.radius * 20
        );
    }
    
    drawGlyphParticle(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        
        if (particle.activated) {
            this.ctx.rotate(particle.rotation || 0);
            this.ctx.scale(particle.scale || 1, particle.scale || 1);
        }
        
        // Glyph background
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fill();
        this.ctx.strokeStyle = particle.color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Glyph symbol
        this.ctx.font = '20px monospace';
        this.ctx.fillStyle = particle.color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(particle.symbol, 0, 0);
        
        this.ctx.restore();
    }
    
    drawNeuronParticle(particle) {
        // Neuron glow based on charge
        if (particle.charge > 0.1) {
            const glowRadius = particle.radius * (1 + particle.charge * 2);
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, particle.radius,
                particle.x, particle.y, glowRadius
            );
            gradient.addColorStop(0, particle.color + 'FF');
            gradient.addColorStop(1, particle.color + '00');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Neuron body
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
    }
    
    drawGenericParticle(particle) {
        this.ctx.globalAlpha = particle.life || 1;
        
        // Particle glow
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * 3
        );
        gradient.addColorStop(0, particle.color + '80');
        gradient.addColorStop(1, particle.color + '00');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Particle core
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        
        this.ctx.globalAlpha = 1;
    }
    
    drawForeground() {
        // Draw any foreground effects
        if (this.currentPhase === 7) { // Unity phase
            const centerX = this.fgCanvas.width / 2;
            const centerY = this.fgCanvas.height / 2;
            
            // Unity portal effect
            const time = Date.now() * 0.001;
            const portalSize = 100 + Math.sin(time) * 20;
            
            const gradient = this.fgCtx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, portalSize
            );
            gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
            gradient.addColorStop(0.5, 'rgba(255,215,0,0.4)');
            gradient.addColorStop(1, 'rgba(255,215,0,0)');
            
            this.fgCtx.fillStyle = gradient;
            this.fgCtx.beginPath();
            this.fgCtx.arc(centerX, centerY, portalSize, 0, Math.PI * 2);
            this.fgCtx.fill();
        }
    }
    
    updateLogo() {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        const time = Date.now() * 0.001;
        
        ctx.clearRect(0, 0, size, size);
        
        // Breathing effect
        const breathScale = 1 + Math.sin(time * 0.5) * 0.05;
        
        ctx.save();
        ctx.translate(center, center);
        ctx.scale(breathScale, breathScale);
        ctx.rotate(time * 0.05);
        
        // Build logo based on phase
        if (this.currentPhase >= 0) {
            // Outer ring
            ctx.beginPath();
            ctx.arc(0, 0, 100, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(107, 70, 193, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        if (this.currentPhase >= 2) {
            // Sacred triangles
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * 60;
                const y = Math.sin(angle) * 60;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
            ctx.stroke();
            
            // Inverted triangle
            ctx.save();
            ctx.rotate(Math.PI);
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * 60;
                const y = Math.sin(angle) * 60;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(107, 70, 193, 0.7)';
            ctx.stroke();
            ctx.restore();
        }
        
        if (this.currentPhase >= 4) {
            // Inner circles
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * 40, Math.sin(angle) * 40, 20, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
                ctx.stroke();
            }
        }
        
        if (this.currentPhase >= 6) {
            // Center point
            const glowSize = 10 + Math.sin(time * 3) * 5;
            const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
        }
        
        ctx.restore();
    }
    
    startBackgroundEffects() {
        // Continuous background effects
        setInterval(() => {
            if (this.currentPhase === 1) { // Pulse phase
                this.generatePulseWaves();
            }
        }, 1000);
    }
    
    // Sound methods
    playPhaseSound(soundType) {
        if (!this.audioContext || this.isMuted) return;
        
        switch (soundType) {
            case 'void':
                this.playVoidSound();
                break;
            case 'heartbeat':
                this.playHeartbeatSound();
                break;
            case 'breathing':
                this.playBreathingSound();
                break;
            case 'neural':
                this.playNeuralSound();
                break;
            case 'crystalline':
                this.playCrystallineSound();
                break;
            case 'activation':
                this.playActivationSound();
                break;
            case 'unity':
                this.playUnitySound();
                break;
        }
    }
    
    playVoidSound() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 50;
        gain.gain.value = 0.1;
        
        osc.connect(gain);
        gain.connect(this.reverb);
        
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 3);
        osc.stop(this.audioContext.currentTime + 3);
    }
    
    playHeartbeatSound() {
        const kick = () => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = 60;
            gain.gain.value = 0.3;
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            osc.stop(this.audioContext.currentTime + 0.1);
        };
        
        kick();
        setTimeout(kick, 100);
        
        // Repeat heartbeat
        this.heartbeatInterval = setInterval(() => {
            if (this.currentPhase === 1 || this.currentPhase === 3) {
                kick();
                setTimeout(kick, 100);
            }
        }, 1000);
    }
    
    playBreathingSound() {
        const noise = this.audioContext.createBufferSource();
        const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 4, this.audioContext.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() - 0.5) * 0.1;
        }
        
        noise.buffer = noiseBuffer;
        noise.loop = true;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        const gain = this.audioContext.createGain();
        gain.gain.value = 0;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start();
        
        // Breathing envelope
        const breathe = () => {
            if (this.currentPhase !== 2) return;
            
            gain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 2);
            gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 4);
            
            setTimeout(breathe, 4000);
        };
        breathe();
        
        this.breathingSound = { noise, gain };
    }
    
    playNeuralSound() {
        // Random neural firing sounds
        const fireNeuron = () => {
            if (this.currentPhase !== 4) return;
            
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = 800 + Math.random() * 400;
            gain.gain.value = 0.05;
            
            osc.connect(gain);
            gain.connect(this.reverb);
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
            osc.stop(this.audioContext.currentTime + 0.05);
            
            setTimeout(fireNeuron, 100 + Math.random() * 400);
        };
        fireNeuron();
    }
    
    playCrystallineSound() {
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
        
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.value = 0.1;
                
                osc.connect(gain);
                gain.connect(this.reverb);
                
                osc.start();
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
                osc.stop(this.audioContext.currentTime + 1);
            }, i * 200);
        });
    }
    
    playActivationSound() {
        // Glyph activation chime
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = 880;
        gain.gain.value = 0.1;
        
        osc.connect(gain);
        gain.connect(this.reverb);
        
        osc.start();
        osc.frequency.exponentialRampToValueAtTime(1760, this.audioContext.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        osc.stop(this.audioContext.currentTime + 0.5);
    }
    
    playGlyphSound() {
        const freq = 440 + Math.random() * 440;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.05;
        
        osc.connect(gain);
        gain.connect(this.reverb);
        
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        osc.stop(this.audioContext.currentTime + 0.3);
    }
    
    playUnitySound() {
        // Harmonic unity chord
        const root = 261.63; // C4
        const harmonics = [1, 1.25, 1.5, 2, 2.5, 3, 4];
        
        harmonics.forEach((harmonic, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = root * harmonic;
            gain.gain.value = 0.1 / (i + 1);
            
            osc.connect(gain);
            gain.connect(this.reverb);
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(
                0.15 / (i + 1),
                this.audioContext.currentTime + 1
            );
        });
    }
    
    // Interactive effects
    createClickEffect(x, y) {
        // Create ripple effect on click
        this.waves.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 200,
            speed: 3,
            color: this.phases[this.currentPhase]?.color || '#6B46C1',
            opacity: 1
        });
        
        // Create particle burst
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.radius = 2 + Math.random() * 2;
            particle.color = this.phases[this.currentPhase]?.color || '#6B46C1';
            particle.life = 1;
            this.particles.push(particle);
        }
        
        // Play click sound
        if (this.audioContext && !this.isMuted) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = 1000;
            gain.gain.value = 0.1;
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
            osc.stop(this.audioContext.currentTime + 0.1);
        }
    }
    
    // Utility methods
    fadeOutParticles() {
        this.particles.forEach(particle => {
            particle.life -= 0.02;
        });
    }
    
    toggleSound() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('luminousOS_muted', this.isMuted);
        
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : 0.5;
        }
        
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.textContent = this.isMuted ? '🔇' : '🔊';
        }
    }
    
    togglePause() {
        // Pause/resume animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        } else {
            this.animate();
        }
    }
    
    nextPhase() {
        if (this.currentPhase < this.phases.length - 1) {
            this.jumpToPhase(this.currentPhase + 1);
        }
    }
    
    previousPhase() {
        if (this.currentPhase > 0) {
            this.jumpToPhase(this.currentPhase - 1);
        }
    }
    
    jumpToPhase(phaseIndex) {
        this.currentPhase = phaseIndex - 1;
        this.phaseStartTime = Date.now();
        this.particles = [];
        this.connections = [];
        this.waves = [];
        this.geometryShapes = [];
    }
    
    async complete() {
        console.log('Enhanced boot sequence complete!');
        
        // Stop intervals
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        if (this.animationId) cancelAnimationFrame(this.animationId);
        
        // Final fade
        this.container.style.transition = 'opacity 2s ease';
        this.container.style.opacity = '0';
        
        await this.sleep(2000);
        
        this.container.style.display = 'none';
        
        const mainOS = document.getElementById('mainOS');
        if (mainOS) {
            mainOS.style.display = 'block';
        }
        
        if (typeof initializeOS === 'function') {
            initializeOS();
        }
    }
    
    skipBoot() {
        console.log('Skipping enhanced boot sequence...');
        this.complete();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions
window.enhancedSkipBoot = function() {
    if (window.enhancedBootInstance) {
        window.enhancedBootInstance.skipBoot();
    }
};

window.toggleBootSound = function() {
    if (window.enhancedBootInstance) {
        window.enhancedBootInstance.toggleSound();
    }
};

window.triggerEasterEgg = function() {
    console.log('🥚 Easter egg found! You discovered the secret corner!');
    // Could add special effects here
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Creating Enhanced Sacred Boot...');
        window.enhancedBootInstance = new EnhancedSacredBoot();
        window.sacredBootInstance = window.enhancedBootInstance;
        window.sacredBootSequence = window.enhancedBootInstance;
    });
} else {
    console.log('Creating Enhanced Sacred Boot (immediate)...');
    window.enhancedBootInstance = new EnhancedSacredBoot();
    window.sacredBootInstance = window.enhancedBootInstance;
    window.sacredBootSequence = window.enhancedBootInstance;
}

// Also expose the class globally
window.EnhancedSacredBoot = EnhancedSacredBoot;

console.log('Enhanced Sacred Boot loaded!');