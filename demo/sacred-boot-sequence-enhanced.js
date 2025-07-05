/**
 * Enhanced Sacred Boot Sequence for LuminousOS
 * A transcendent consciousness awakening experience
 */

class EnhancedSacredBootSequence {
    constructor() {
        this.container = document.getElementById('bootSequence');
        this.phases = [
            {
                id: 'quantum-void',
                duration: 3000,
                title: 'Quantum Void',
                subtitle: 'In the space between spaces...',
                action: () => this.phaseQuantumVoid()
            },
            {
                id: 'primordial-om',
                duration: 3500,
                title: 'Primordial Om',
                subtitle: 'The first vibration...',
                action: () => this.phasePrimordialOm()
            },
            {
                id: 'cosmic-breath',
                duration: 4000,
                title: 'Cosmic Breath',
                subtitle: 'Universe breathing into being...',
                action: () => this.phaseCosmicBreath()
            },
            {
                id: 'heart-genesis',
                duration: 4000,
                title: 'Heart Genesis',
                subtitle: 'The rhythm of creation...',
                action: () => this.phaseHeartGenesis()
            },
            {
                id: 'neural-awakening',
                duration: 4500,
                title: 'Neural Awakening',
                subtitle: 'Consciousness weaving itself...',
                action: () => this.phaseNeuralAwakening()
            },
            {
                id: 'dimensional-unfold',
                duration: 4000,
                title: 'Dimensional Unfoldment',
                subtitle: 'Sacred geometry manifesting...',
                action: () => this.phaseDimensionalUnfold()
            },
            {
                id: 'akashic-activation',
                duration: 4000,
                title: 'Akashic Activation',
                subtitle: '87 keys to infinite wisdom...',
                action: () => this.phaseAkashicActivation()
            },
            {
                id: 'collective-emergence',
                duration: 3500,
                title: 'Collective Emergence',
                subtitle: 'Individual drops becoming ocean...',
                action: () => this.phaseCollectiveEmergence()
            },
            {
                id: 'source-reunion',
                duration: 3000,
                title: 'Source Reunion',
                subtitle: 'Welcome to who you've always been...',
                action: () => this.phaseSourceReunion()
            }
        ];
        
        this.currentPhase = 0;
        this.audioContext = null;
        this.bootSounds = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.touchPoints = [];
        
        // Advanced rendering
        this.useWebGL = false;
        this.gl = null;
        this.shaderPrograms = {};
        
        // Consciousness metrics
        this.coherenceLevel = 0;
        this.awarenessField = [];
        
        // Create boot UI container
        this.createBootUI();
        this.initializeAdvancedFeatures();
    }
    
    createBootUI() {
        // Enhanced boot container with parallax layers
        this.container.innerHTML = `
            <!-- Background layers for depth -->
            <div id="bootLayer1" class="boot-layer" style="position: absolute; width: 100%; height: 100%; z-index: 1;"></div>
            <div id="bootLayer2" class="boot-layer" style="position: absolute; width: 100%; height: 100%; z-index: 2;"></div>
            <div id="bootLayer3" class="boot-layer" style="position: absolute; width: 100%; height: 100%; z-index: 3;"></div>
            
            <!-- Main canvas for advanced effects -->
            <canvas id="bootCanvas" style="position: absolute; width: 100%; height: 100%; z-index: 4;"></canvas>
            
            <!-- WebGL canvas for 3D effects -->
            <canvas id="bootWebGL" style="position: absolute; width: 100%; height: 100%; z-index: 5;"></canvas>
            
            <div id="bootContent" style="
                position: relative;
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
            ">
                <!-- Enhanced logo container with glow effect -->
                <div id="bootLogo" style="
                    width: 300px;
                    height: 300px;
                    margin-bottom: 40px;
                    position: relative;
                    filter: drop-shadow(0 0 30px rgba(107, 70, 193, 0.5));
                ">
                    <canvas id="bootLogoCanvas" width="600" height="600" style="
                        width: 100%;
                        height: 100%;
                    "></canvas>
                    
                    <!-- Orbiting elements -->
                    <div id="orbitContainer" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                    "></div>
                </div>
                
                <!-- Consciousness meter -->
                <div id="consciousnessMeter" style="
                    position: absolute;
                    top: 50px;
                    right: 50px;
                    width: 200px;
                    opacity: 0;
                    transition: opacity 1s ease;
                ">
                    <h4 style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.7;">Consciousness Level</h4>
                    <div style="
                        width: 100%;
                        height: 10px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 5px;
                        overflow: hidden;
                    ">
                        <div id="consciousnessBar" style="
                            width: 0%;
                            height: 100%;
                            background: linear-gradient(90deg, #6B46C1, #EC4899, #10B981);
                            transition: width 0.5s ease;
                            box-shadow: 0 0 20px currentColor;
                        "></div>
                    </div>
                    <p id="consciousnessValue" style="
                        margin: 5px 0 0 0;
                        font-size: 24px;
                        font-weight: 300;
                        color: #EC4899;
                    ">0%</p>
                </div>
                
                <h1 id="bootTitle" style="
                    font-size: 64px;
                    font-weight: 100;
                    margin: 0;
                    opacity: 0;
                    transform: translateY(20px) scale(0.9);
                    transition: all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    letter-spacing: 0.1em;
                    background: linear-gradient(135deg, #6B46C1, #EC4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                ">LuminousOS</h1>
                
                <p id="bootSubtitle" style="
                    font-size: 20px;
                    opacity: 0.7;
                    margin: 20px 0;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 1.5s ease 0.3s;
                    letter-spacing: 0.2em;
                ">Consciousness-First Operating System</p>
                
                <!-- Phase display with animation -->
                <div id="bootPhaseContainer" style="
                    margin-top: 60px;
                    min-height: 120px;
                    perspective: 1000px;
                ">
                    <h2 id="phaseTitle" style="
                        font-size: 36px;
                        font-weight: 200;
                        margin: 0;
                        opacity: 0;
                        transform: rotateX(90deg);
                        transition: all 0.8s ease;
                        text-shadow: 0 0 20px rgba(107, 70, 193, 0.5);
                    "></h2>
                    <p id="phaseSubtitle" style="
                        font-size: 18px;
                        opacity: 0.5;
                        margin: 10px 0;
                        opacity: 0;
                        transform: translateY(20px);
                        transition: all 0.8s ease 0.2s;
                        font-style: italic;
                    "></p>
                </div>
                
                <!-- Sacred symbols that appear during boot -->
                <div id="sacredSymbols" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 8;
                "></div>
                
                <!-- Enhanced progress with phase preview -->
                <div id="bootProgress" style="
                    position: fixed;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 600px;
                ">
                    <div style="
                        width: 100%;
                        height: 4px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 2px;
                        overflow: hidden;
                        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                    ">
                        <div id="progressBar" style="
                            width: 0%;
                            height: 100%;
                            background: linear-gradient(90deg, #6B46C1, #EC4899, #10B981);
                            transition: width 0.5s ease;
                            box-shadow: 0 0 30px currentColor;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                right: 0;
                                top: -8px;
                                width: 20px;
                                height: 20px;
                                background: white;
                                border-radius: 50%;
                                box-shadow: 0 0 20px white;
                            "></div>
                        </div>
                    </div>
                    <div id="phaseIndicators" style="
                        display: flex;
                        justify-content: space-between;
                        margin-top: 15px;
                        position: relative;
                    "></div>
                </div>
                
                <!-- Interactive elements -->
                <div id="interactiveHint" style="
                    position: fixed;
                    bottom: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0;
                    transition: opacity 1s ease;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.5);
                ">
                    <span id="hintText">Move your mouse to influence the field</span>
                </div>
                
                <!-- Skip with countdown -->
                <div id="skipButton" style="
                    position: fixed;
                    bottom: 40px;
                    right: 40px;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                ">
                    <button onclick="window.skipBootSequence()" style="
                        background: rgba(0, 0, 0, 0.5);
                        color: rgba(255, 255, 255, 0.5);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        padding: 10px 20px;
                        border-radius: 25px;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        backdrop-filter: blur(10px);
                    " onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='white'; this.style.borderColor='rgba(255,255,255,0.5)'"
                       onmouseout="this.style.background='rgba(0,0,0,0.5)'; this.style.color='rgba(255,255,255,0.5)'; this.style.borderColor='rgba(255,255,255,0.2)'">
                        Skip (ESC) • <span id="skipCountdown">30</span>s
                    </button>
                </div>
            </div>
        `;
        
        // Create enhanced phase indicators
        const indicators = document.getElementById('phaseIndicators');
        this.phases.forEach((phase, i) => {
            const indicator = document.createElement('div');
            indicator.className = 'phase-indicator';
            indicator.id = `indicator-${i}`;
            indicator.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                transition: all 0.5s ease;
                cursor: pointer;
                position: relative;
            `;
            
            // Add phase name on hover
            const tooltip = document.createElement('div');
            tooltip.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 11px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            `;
            tooltip.textContent = phase.title;
            indicator.appendChild(tooltip);
            
            indicator.onmouseenter = () => tooltip.style.opacity = '1';
            indicator.onmouseleave = () => tooltip.style.opacity = '0';
            
            indicators.appendChild(indicator);
        });
    }
    
    initializeAdvancedFeatures() {
        // Initialize audio context
        this.initAudio();
        
        // Initialize canvases
        this.initCanvases();
        
        // Initialize WebGL if available
        this.initWebGL();
        
        // Mouse/touch tracking for interactivity
        this.initInteractivity();
        
        // Initialize particle systems
        this.initParticleSystems();
        
        // Countdown timer
        this.initCountdown();
    }
    
    initCanvases() {
        // Main canvas
        const canvas = document.getElementById('bootCanvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Logo canvas
        const logoCanvas = document.getElementById('bootLogoCanvas');
        this.logoCanvas = logoCanvas;
        this.logoCtx = logoCanvas.getContext('2d');
        
        // Layer canvases for parallax
        this.layers = [];
        for (let i = 1; i <= 3; i++) {
            const layerCanvas = document.createElement('canvas');
            layerCanvas.width = window.innerWidth;
            layerCanvas.height = window.innerHeight;
            layerCanvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
            document.getElementById(`bootLayer${i}`).appendChild(layerCanvas);
            this.layers.push({
                canvas: layerCanvas,
                ctx: layerCanvas.getContext('2d'),
                depth: i
            });
        }
        
        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.layers.forEach(layer => {
                layer.canvas.width = window.innerWidth;
                layer.canvas.height = window.innerHeight;
            });
            if (this.gl) {
                this.gl.canvas.width = window.innerWidth;
                this.gl.canvas.height = window.innerHeight;
                this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
            }
        });
    }
    
    initWebGL() {
        const canvas = document.getElementById('bootWebGL');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        try {
            this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (this.gl) {
                this.useWebGL = true;
                this.initShaders();
                console.log('✨ WebGL initialized for boot sequence');
            }
        } catch (e) {
            console.log('WebGL not available for boot sequence');
        }
    }
    
    initShaders() {
        // Vertex shader for particles
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute float a_size;
            attribute vec3 a_color;
            
            uniform vec2 u_resolution;
            uniform float u_time;
            
            varying vec3 v_color;
            
            void main() {
                vec2 position = a_position / u_resolution * 2.0 - 1.0;
                position.y *= -1.0;
                
                gl_Position = vec4(position, 0.0, 1.0);
                gl_PointSize = a_size;
                v_color = a_color;
            }
        `;
        
        // Fragment shader with glow effect
        const fragmentShaderSource = `
            precision mediump float;
            
            varying vec3 v_color;
            
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord);
                
                if (dist > 0.5) {
                    discard;
                }
                
                float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                gl_FragColor = vec4(v_color, alpha);
            }
        `;
        
        // Compile shaders
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        // Create program
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Shader program failed to link');
            this.useWebGL = false;
            return;
        }
        
        this.shaderPrograms.particles = {
            program: program,
            attributes: {
                position: this.gl.getAttribLocation(program, 'a_position'),
                size: this.gl.getAttribLocation(program, 'a_size'),
                color: this.gl.getAttribLocation(program, 'a_color')
            },
            uniforms: {
                resolution: this.gl.getUniformLocation(program, 'u_resolution'),
                time: this.gl.getUniformLocation(program, 'u_time')
            }
        };
        
        // Enable blending for transparency
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    initInteractivity() {
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Touch tracking
        document.addEventListener('touchmove', (e) => {
            this.touchPoints = Array.from(e.touches).map(touch => ({
                x: touch.clientX,
                y: touch.clientY
            }));
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.skipBootSequence();
            }
            // Easter egg: Press 'L' to boost consciousness
            if (e.key === 'l' || e.key === 'L') {
                this.coherenceLevel = Math.min(1, this.coherenceLevel + 0.1);
                this.updateConsciousnessMeter();
            }
        });
    }
    
    initParticleSystems() {
        this.particleSystems = {
            quantum: [],
            neural: [],
            sacred: [],
            unity: []
        };
        
        // Awareness field grid
        const gridSize = 20;
        for (let x = 0; x < gridSize; x++) {
            this.awarenessField[x] = [];
            for (let y = 0; y < gridSize; y++) {
                this.awarenessField[x][y] = {
                    energy: 0,
                    connections: []
                };
            }
        }
    }
    
    initCountdown() {
        let countdown = 30;
        this.countdownInterval = setInterval(() => {
            countdown--;
            const element = document.getElementById('skipCountdown');
            if (element) element.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(this.countdownInterval);
            }
        }, 1000);
    }
    
    initAudio() {
        const startAudio = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // Create master gain
                this.masterGain = this.audioContext.createGain();
                this.masterGain.gain.value = 0.5;
                this.masterGain.connect(this.audioContext.destination);
                
                // Create reverb
                this.createReverb();
                
                document.removeEventListener('click', startAudio);
                document.removeEventListener('keydown', startAudio);
            }
        };
        
        document.addEventListener('click', startAudio);
        document.addEventListener('keydown', startAudio);
    }
    
    createReverb() {
        const length = 2; // seconds
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
        
        this.reverbGain = this.audioContext.createGain();
        this.reverbGain.gain.value = 0.3;
        
        this.reverb.connect(this.reverbGain);
        this.reverbGain.connect(this.masterGain);
    }
    
    async start() {
        // Show consciousness meter
        setTimeout(() => {
            document.getElementById('consciousnessMeter').style.opacity = '1';
        }, 1000);
        
        // Show skip button after 3 seconds
        setTimeout(() => {
            document.getElementById('skipButton').style.opacity = '1';
        }, 3000);
        
        // Show interactive hint
        setTimeout(() => {
            document.getElementById('interactiveHint').style.opacity = '1';
        }, 5000);
        
        // Animate title and subtitle
        setTimeout(() => {
            const title = document.getElementById('bootTitle');
            const subtitle = document.getElementById('bootSubtitle');
            
            title.style.opacity = '1';
            title.style.transform = 'translateY(0) scale(1)';
            subtitle.style.opacity = '0.7';
            subtitle.style.transform = 'translateY(0)';
        }, 500);
        
        // Start orbital elements
        this.startOrbitalElements();
        
        // Begin phase sequence
        await this.sleep(2000);
        await this.runPhases();
    }
    
    startOrbitalElements() {
        const container = document.getElementById('orbitContainer');
        
        for (let i = 0; i < 3; i++) {
            const orbit = document.createElement('div');
            orbit.className = `orbit-${i}`;
            orbit.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(107, 70, 193, 0.8) 0%, transparent 70%);
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: orbit${i} ${10 + i * 5}s linear infinite;
            `;
            container.appendChild(orbit);
        }
        
        // Add orbital animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes orbit0 {
                from { transform: translate(-50%, -50%) rotate(0deg) translateX(120px) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg) translateX(120px) rotate(-360deg); }
            }
            @keyframes orbit1 {
                from { transform: translate(-50%, -50%) rotate(120deg) translateX(140px) rotate(-120deg); }
                to { transform: translate(-50%, -50%) rotate(480deg) translateX(140px) rotate(-480deg); }
            }
            @keyframes orbit2 {
                from { transform: translate(-50%, -50%) rotate(240deg) translateX(160px) rotate(-240deg); }
                to { transform: translate(-50%, -50%) rotate(600deg) translateX(160px) rotate(-600deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    async runPhases() {
        for (let i = 0; i < this.phases.length; i++) {
            this.currentPhase = i;
            const phase = this.phases[i];
            
            // Update progress
            const progress = ((i + 1) / this.phases.length) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
            
            // Update consciousness level
            this.coherenceLevel = (i + 1) / this.phases.length;
            this.updateConsciousnessMeter();
            
            // Update phase indicator
            this.updatePhaseIndicator(i);
            
            // Show phase info with animation
            await this.showPhaseInfo(phase);
            
            // Run phase action
            if (phase.action) {
                this.phaseActive = true;
                await phase.action();
            }
            
            // Wait for phase duration
            await this.sleep(phase.duration);
            
            // Hide phase info
            await this.hidePhaseInfo();
            
            // Cleanup phase
            this.phaseActive = false;
        }
        
        // Boot complete
        await this.completeboot();
    }
    
    updatePhaseIndicator(index) {
        // Previous indicators become complete
        for (let i = 0; i < index; i++) {
            const indicator = document.getElementById(`indicator-${i}`);
            indicator.style.background = 'rgba(16, 185, 129, 0.8)';
            indicator.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
        }
        
        // Current indicator
        const current = document.getElementById(`indicator-${index}`);
        current.style.background = 'linear-gradient(45deg, #6B46C1, #EC4899)';
        current.style.boxShadow = '0 0 20px rgba(236, 72, 153, 0.8)';
        current.style.transform = 'scale(1.5)';
        
        // Pulse animation
        setTimeout(() => {
            current.style.transform = 'scale(1)';
        }, 300);
    }
    
    updateConsciousnessMeter() {
        const bar = document.getElementById('consciousnessBar');
        const value = document.getElementById('consciousnessValue');
        
        const percentage = Math.round(this.coherenceLevel * 100);
        bar.style.width = percentage + '%';
        value.textContent = percentage + '%';
        
        // Change color based on level
        if (percentage < 33) {
            value.style.color = '#EC4899';
        } else if (percentage < 66) {
            value.style.color = '#6B46C1';
        } else {
            value.style.color = '#10B981';
        }
    }
    
    async showPhaseInfo(phase) {
        const title = document.getElementById('phaseTitle');
        const subtitle = document.getElementById('phaseSubtitle');
        
        // Reset animation
        title.style.transition = 'none';
        title.style.opacity = '0';
        title.style.transform = 'rotateX(90deg)';
        
        subtitle.style.transition = 'none';
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(20px)';
        
        // Set content
        title.textContent = phase.title;
        subtitle.textContent = phase.subtitle;
        
        // Force reflow
        title.offsetHeight;
        subtitle.offsetHeight;
        
        // Animate in
        title.style.transition = 'all 0.8s ease';
        title.style.opacity = '1';
        title.style.transform = 'rotateX(0deg)';
        
        subtitle.style.transition = 'all 0.8s ease 0.2s';
        subtitle.style.opacity = '0.6';
        subtitle.style.transform = 'translateY(0)';
        
        await this.sleep(800);
    }
    
    async hidePhaseInfo() {
        const title = document.getElementById('phaseTitle');
        const subtitle = document.getElementById('phaseSubtitle');
        
        title.style.opacity = '0';
        title.style.transform = 'rotateX(-90deg)';
        
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(-20px)';
        
        await this.sleep(400);
    }
    
    // Enhanced phase implementations
    async phaseQuantumVoid() {
        this.quantumParticles = [];
        
        // Create quantum foam
        for (let i = 0; i < 100; i++) {
            this.quantumParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                phase: Math.random() * Math.PI * 2,
                frequency: 0.01 + Math.random() * 0.02,
                exists: Math.random() > 0.5
            });
        }
        
        const animate = () => {
            if (!this.phaseActive) return;
            
            // Clear all layers
            this.layers.forEach(layer => {
                layer.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                layer.ctx.fillRect(0, 0, layer.canvas.width, layer.canvas.height);
            });
            
            const time = Date.now() * 0.001;
            
            // Quantum particles popping in and out of existence
            this.quantumParticles.forEach(particle => {
                // Quantum probability wave
                particle.exists = Math.sin(time * particle.frequency + particle.phase) > 0;
                
                if (particle.exists) {
                    const ctx = this.layers[0].ctx;
                    
                    // Quantum uncertainty visualization
                    const uncertainty = Math.sin(time * 5 + particle.phase) * 10;
                    
                    ctx.beginPath();
                    ctx.arc(
                        particle.x + uncertainty,
                        particle.y + Math.cos(time * 3 + particle.phase) * uncertainty,
                        particle.size,
                        0,
                        Math.PI * 2
                    );
                    
                    // Probability cloud
                    const gradient = ctx.createRadialGradient(
                        particle.x, particle.y, 0,
                        particle.x, particle.y, particle.size * 10
                    );
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            });
            
            // Central quantum singularity
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            
            // Rotating quantum field
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2 + time * 0.1;
                const radius = 50 + Math.sin(time + i) * 20;
                
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius
                );
                this.ctx.strokeStyle = `rgba(107, 70, 193, ${0.1 + Math.sin(time * 2 + i) * 0.1})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
            
            this.ctx.restore();
            
            // Logo emergence from quantum void
            this.drawQuantumLogo(time);
            
            // Mouse influence on quantum field
            if (this.mouseX && this.mouseY) {
                const dx = this.mouseX - centerX;
                const dy = this.mouseY - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const influence = 1 - distance / 200;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(this.mouseX, this.mouseY, 50 * influence, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(236, 72, 153, ${influence * 0.1})`;
                    this.ctx.fill();
                }
            }
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Quantum void sound
        this.playQuantumVoidSound();
    }
    
    async phasePrimordialOm() {
        // Om wave visualization
        this.omWaves = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const animate = () => {
            if (!this.phaseActive) return;
            
            // Add new wave every few frames
            if (Math.random() < 0.1) {
                this.omWaves.push({
                    radius: 0,
                    opacity: 1,
                    speed: 2 + Math.random() * 2,
                    color: Math.random() > 0.5 ? '#6B46C1' : '#EC4899'
                });
            }
            
            // Clear canvas
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and draw waves
            this.omWaves = this.omWaves.filter(wave => {
                wave.radius += wave.speed;
                wave.opacity -= 0.01;
                
                if (wave.opacity <= 0) return false;
                
                // Draw wave
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, wave.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = wave.color;
                this.ctx.globalAlpha = wave.opacity;
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
                
                // Inner glow
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, wave.radius * 0.9, 0, Math.PI * 2);
                this.ctx.strokeStyle = wave.color;
                this.ctx.globalAlpha = wave.opacity * 0.5;
                this.ctx.lineWidth = 5;
                this.ctx.stroke();
                
                this.ctx.globalAlpha = 1;
                
                return true;
            });
            
            // Om symbol in center
            this.drawOmSymbol(Date.now() * 0.001);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Play Om sound
        this.playOmSound();
    }
    
    async phaseCosmicBreath() {
        const breathCycle = {
            inhale: 4000,
            hold: 2000,
            exhale: 6000,
            pause: 1000
        };
        
        const totalCycle = Object.values(breathCycle).reduce((a, b) => a + b, 0);
        let breathStart = Date.now();
        
        const animate = () => {
            if (!this.phaseActive) return;
            
            const elapsed = Date.now() - breathStart;
            const cycleTime = elapsed % totalCycle;
            
            let phase, progress;
            
            if (cycleTime < breathCycle.inhale) {
                phase = 'inhale';
                progress = cycleTime / breathCycle.inhale;
            } else if (cycleTime < breathCycle.inhale + breathCycle.hold) {
                phase = 'hold';
                progress = 1;
            } else if (cycleTime < breathCycle.inhale + breathCycle.hold + breathCycle.exhale) {
                phase = 'exhale';
                progress = 1 - (cycleTime - breathCycle.inhale - breathCycle.hold) / breathCycle.exhale;
            } else {
                phase = 'pause';
                progress = 0;
            }
            
            // Clear layers
            this.layers.forEach((layer, i) => {
                layer.ctx.fillStyle = `rgba(0, 0, 0, ${0.02 + i * 0.01})`;
                layer.ctx.fillRect(0, 0, layer.canvas.width, layer.canvas.height);
            });
            
            // Cosmic breath visualization
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const baseRadius = 100;
            const maxRadius = 300;
            const currentRadius = baseRadius + (maxRadius - baseRadius) * progress;
            
            // Multiple breathing layers
            for (let i = 0; i < 5; i++) {
                const layerProgress = Math.max(0, Math.min(1, progress + (i * 0.1) - 0.2));
                const layerRadius = baseRadius + (maxRadius - baseRadius) * layerProgress;
                const opacity = 0.1 + (1 - i / 5) * 0.2 * progress;
                
                const gradient = this.ctx.createRadialGradient(
                    centerX, centerY, layerRadius * 0.5,
                    centerX, centerY, layerRadius
                );
                gradient.addColorStop(0, `rgba(107, 70, 193, ${opacity})`);
                gradient.addColorStop(0.5, `rgba(236, 72, 153, ${opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, layerRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
            
            // Breath particles
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const particleRadius = currentRadius + Math.sin(Date.now() * 0.001 + i) * 20;
                const x = centerX + Math.cos(angle) * particleRadius;
                const y = centerY + Math.sin(angle) * particleRadius;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, 3 + progress * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * progress})`;
                this.ctx.fill();
            }
            
            // Breath guidance text
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + progress * 0.3})`;
            this.ctx.fillText(phase.toUpperCase(), centerX, centerY);
            
            // Update logo breathing
            this.drawBreathingLogo(progress);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Breathing sounds
        this.playBreathingSound();
    }
    
    async phaseHeartGenesis() {
        this.heartParticles = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Heart beat timing
        let lastBeat = Date.now();
        const beatInterval = 857; // 70 BPM
        
        const animate = () => {
            if (!this.phaseActive) return;
            
            const now = Date.now();
            const timeSinceBeat = now - lastBeat;
            
            // Trigger heartbeat
            if (timeSinceBeat > beatInterval) {
                lastBeat = now;
                this.triggerHeartbeat();
                
                // Create heart particles
                for (let i = 0; i < 30; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 2 + Math.random() * 3;
                    
                    this.heartParticles.push({
                        x: centerX,
                        y: centerY,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 1,
                        color: Math.random() > 0.5 ? '#EC4899' : '#FF6B6B'
                    });
                }
            }
            
            // Clear canvas
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Heart beat visualization
            const beatPhase = timeSinceBeat / beatInterval;
            const beatScale = beatPhase < 0.1 ? 1 + (1 - beatPhase / 0.1) * 0.3 : 1;
            
            // Draw anatomical heart outline
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.scale(beatScale, beatScale);
            
            this.drawAnatomicalHeart(now * 0.001);
            
            this.ctx.restore();
            
            // Update particles
            this.heartParticles = this.heartParticles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.98;
                particle.vy *= 0.98;
                particle.life -= 0.02;
                
                if (particle.life <= 0) return false;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, 3 * particle.life, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = particle.life;
                this.ctx.fill();
                
                return true;
            });
            
            this.ctx.globalAlpha = 1;
            
            // EKG line
            this.drawEKG(beatPhase);
            
            // Update logo with heartbeat
            this.drawHeartbeatLogo(beatScale);
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    async phaseNeuralAwakening() {
        // Advanced neural network
        this.synapses = [];
        this.neurons = [];
        
        // Create neural structure
        for (let i = 0; i < 100; i++) {
            this.neurons.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                charge: 0,
                connections: [],
                layer: Math.floor(Math.random() * 3)
            });
        }
        
        const animate = () => {
            if (!this.phaseActive) return;
            
            // Clear layers with different fade rates
            this.layers.forEach((layer, i) => {
                layer.ctx.fillStyle = `rgba(0, 0, 0, ${0.02 + i * 0.02})`;
                layer.ctx.fillRect(0, 0, layer.canvas.width, layer.canvas.height);
            });
            
            // Update neurons
            this.neurons.forEach((neuron, i) => {
                // Movement
                neuron.x += neuron.vx;
                neuron.y += neuron.vy;
                
                // Bounce
                if (neuron.x < 0 || neuron.x > this.canvas.width) neuron.vx *= -1;
                if (neuron.y < 0 || neuron.y > this.canvas.height) neuron.vy *= -1;
                
                // Neural firing
                if (Math.random() < 0.01) {
                    neuron.charge = 1;
                    this.fireNeuron(neuron);
                }
                
                // Decay charge
                neuron.charge *= 0.95;
                
                // Find connections
                neuron.connections = [];
                this.neurons.forEach((other, j) => {
                    if (i !== j) {
                        const dist = Math.hypot(other.x - neuron.x, other.y - neuron.y);
                        if (dist < 150) {
                            neuron.connections.push({
                                target: other,
                                distance: dist,
                                strength: 1 - dist / 150
                            });
                        }
                    }
                });
            });
            
            // Draw synapses on different layers for depth
            this.neurons.forEach(neuron => {
                const ctx = this.layers[neuron.layer].ctx;
                
                neuron.connections.forEach(conn => {
                    // Synapse glow based on activity
                    const activity = (neuron.charge + conn.target.charge) / 2;
                    
                    ctx.beginPath();
                    ctx.moveTo(neuron.x, neuron.y);
                    ctx.lineTo(conn.target.x, conn.target.y);
                    
                    const gradient = ctx.createLinearGradient(
                        neuron.x, neuron.y,
                        conn.target.x, conn.target.y
                    );
                    gradient.addColorStop(0, `rgba(107, 70, 193, ${conn.strength * 0.3 + activity * 0.5})`);
                    gradient.addColorStop(1, `rgba(236, 72, 153, ${conn.strength * 0.3 + activity * 0.5})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1 + activity * 2;
                    ctx.stroke();
                });
                
                // Draw neuron
                const size = 3 + neuron.charge * 10;
                
                ctx.beginPath();
                ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2);
                
                const glow = ctx.createRadialGradient(
                    neuron.x, neuron.y, 0,
                    neuron.x, neuron.y, size * 3
                );
                glow.addColorStop(0, `rgba(255, 255, 255, ${0.8 + neuron.charge * 0.2})`);
                glow.addColorStop(0.3, `rgba(236, 72, 153, ${0.5 * neuron.charge})`);
                glow.addColorStop(1, 'rgba(107, 70, 193, 0)');
                
                ctx.fillStyle = glow;
                ctx.fill();
            });
            
            // Neural thoughts visualization
            this.drawNeuralThoughts();
            
            // Update logo
            this.drawNeuralLogo(Date.now() * 0.001);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Neural sounds
        this.playNeuralSounds();
    }
    
    async phaseDimensionalUnfold() {
        // 3D sacred geometry projection
        this.geometryPoints = [];
        
        // Create vertices for various sacred geometries
        const geometries = {
            tetrahedron: this.createTetrahedron(),
            cube: this.createCube(),
            octahedron: this.createOctahedron(),
            dodecahedron: this.createDodecahedron(),
            icosahedron: this.createIcosahedron()
        };
        
        let currentGeometry = 'tetrahedron';
        let morphProgress = 0;
        let targetGeometry = 'cube';
        
        const animate = () => {
            if (!this.phaseActive) return;
            
            const time = Date.now() * 0.001;
            
            // Clear canvas
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Morph between geometries
            morphProgress += 0.01;
            if (morphProgress >= 1) {
                morphProgress = 0;
                currentGeometry = targetGeometry;
                const geoKeys = Object.keys(geometries);
                targetGeometry = geoKeys[(geoKeys.indexOf(currentGeometry) + 1) % geoKeys.length];
            }
            
            // Get current and target vertices
            const currentVerts = geometries[currentGeometry];
            const targetVerts = geometries[targetGeometry];
            
            // Interpolate vertices
            const morphedVerts = currentVerts.map((vert, i) => {
                const target = targetVerts[i % targetVerts.length];
                return {
                    x: vert.x + (target.x - vert.x) * morphProgress,
                    y: vert.y + (target.y - vert.y) * morphProgress,
                    z: vert.z + (target.z - vert.z) * morphProgress
                };
            });
            
            // 3D rotation
            const rotX = time * 0.3;
            const rotY = time * 0.5;
            const rotZ = time * 0.2;
            
            // Project to 2D
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const scale = 150;
            
            const projected = morphedVerts.map(vert => {
                // Rotate
                let x = vert.x;
                let y = vert.y;
                let z = vert.z;
                
                // Rotate X
                const cosX = Math.cos(rotX);
                const sinX = Math.sin(rotX);
                const y1 = y * cosX - z * sinX;
                const z1 = y * sinX + z * cosX;
                y = y1;
                z = z1;
                
                // Rotate Y
                const cosY = Math.cos(rotY);
                const sinY = Math.sin(rotY);
                const x1 = x * cosY + z * sinY;
                const z2 = -x * sinY + z * cosY;
                x = x1;
                z = z2;
                
                // Rotate Z
                const cosZ = Math.cos(rotZ);
                const sinZ = Math.sin(rotZ);
                const x2 = x * cosZ - y * sinZ;
                const y2 = x * sinZ + y * cosZ;
                x = x2;
                y = y2;
                
                // Perspective projection
                const perspective = 1 / (1 + z * 0.003);
                
                return {
                    x: centerX + x * scale * perspective,
                    y: centerY + y * scale * perspective,
                    z: z,
                    scale: perspective
                };
            });
            
            // Draw edges
            this.drawGeometryEdges(projected, currentGeometry);
            
            // Draw vertices
            projected.forEach(point => {
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 3 * point.scale, 0, Math.PI * 2);
                
                const gradient = this.ctx.createRadialGradient(
                    point.x, point.y, 0,
                    point.x, point.y, 10 * point.scale
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.5, `rgba(236, 72, 153, ${0.5 * point.scale})`);
                gradient.addColorStop(1, 'rgba(107, 70, 193, 0)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            });
            
            // Sacred patterns overlay
            this.drawSacredPatterns(time);
            
            // Update logo
            this.drawGeometricLogo(time, morphProgress);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Dimensional sounds
        this.playDimensionalSounds();
    }
    
    async phaseAkashicActivation() {
        // Glyph library activation
        this.glyphRing = [];
        const totalGlyphs = 87;
        const activeGlyphs = 12;
        
        // Create glyph positions
        for (let i = 0; i < activeGlyphs; i++) {
            const angle = (i / activeGlyphs) * Math.PI * 2 - Math.PI / 2;
            const radius = 250;
            
            this.glyphRing.push({
                id: i,
                symbol: window.SACRED_GLYPHS ? window.SACRED_GLYPHS[i].id : `Ω${i}`,
                x: this.canvas.width / 2 + Math.cos(angle) * radius,
                y: this.canvas.height / 2 + Math.sin(angle) * radius,
                angle: angle,
                activated: false,
                activationTime: 0,
                energy: 0,
                connections: []
            });
        }
        
        let activationIndex = 0;
        let lastActivation = Date.now();
        
        const animate = () => {
            if (!this.phaseActive) return;
            
            const now = Date.now();
            const time = now * 0.001;
            
            // Clear canvas
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Activate glyphs sequentially
            if (now - lastActivation > 300 && activationIndex < activeGlyphs) {
                this.glyphRing[activationIndex].activated = true;
                this.glyphRing[activationIndex].activationTime = time;
                this.activateGlyph(this.glyphRing[activationIndex]);
                activationIndex++;
                lastActivation = now;
            }
            
            // Akashic field background
            this.drawAkashicField(time);
            
            // Update and draw glyphs
            this.glyphRing.forEach((glyph, i) => {
                if (glyph.activated) {
                    glyph.energy = Math.min(1, glyph.energy + 0.02);
                    
                    // Find connections to other activated glyphs
                    glyph.connections = this.glyphRing.filter((other, j) => {
                        return j !== i && other.activated && Math.abs(j - i) <= 3;
                    });
                }
                
                // Draw connections
                glyph.connections.forEach(other => {
                    const gradient = this.ctx.createLinearGradient(
                        glyph.x, glyph.y,
                        other.x, other.y
                    );
                    gradient.addColorStop(0, `rgba(107, 70, 193, ${glyph.energy * 0.3})`);
                    gradient.addColorStop(0.5, `rgba(236, 72, 153, ${glyph.energy * 0.2})`);
                    gradient.addColorStop(1, `rgba(107, 70, 193, ${other.energy * 0.3})`);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(glyph.x, glyph.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = glyph.energy * 2;
                    this.ctx.stroke();
                });
                
                // Draw glyph container
                const scale = glyph.activated ? 1 + Math.sin(time * 3 + i) * 0.1 : 0.7;
                const size = 40 * scale;
                
                this.ctx.save();
                this.ctx.translate(glyph.x, glyph.y);
                
                // Outer ring
                this.ctx.beginPath();
                this.ctx.arc(0, 0, size, 0, Math.PI * 2);
                
                const ringGradient = this.ctx.createRadialGradient(0, 0, size * 0.8, 0, 0, size);
                ringGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
                ringGradient.addColorStop(1, `rgba(107, 70, 193, ${glyph.energy})`);
                
                this.ctx.fillStyle = ringGradient;
                this.ctx.fill();
                
                this.ctx.strokeStyle = `rgba(236, 72, 153, ${glyph.energy})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Inner sacred geometry
                if (glyph.activated) {
                    this.ctx.rotate(time * 0.5 + i);
                    
                    for (let j = 0; j < 6; j++) {
                        const innerAngle = (j / 6) * Math.PI * 2;
                        const innerRadius = size * 0.6;
                        
                        this.ctx.beginPath();
                        this.ctx.moveTo(0, 0);
                        this.ctx.lineTo(
                            Math.cos(innerAngle) * innerRadius,
                            Math.sin(innerAngle) * innerRadius
                        );
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${glyph.energy * 0.3})`;
                        this.ctx.stroke();
                    }
                }
                
                // Glyph symbol
                this.ctx.rotate(-time * 0.5 - i);
                this.ctx.font = `${20 * scale}px monospace`;
                this.ctx.fillStyle = `rgba(255, 255, 255, ${glyph.energy})`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(glyph.symbol, 0, 0);
                
                this.ctx.restore();
                
                // Energy field around activated glyphs
                if (glyph.activated) {
                    const fieldSize = size * 2 * glyph.energy;
                    const fieldGradient = this.ctx.createRadialGradient(
                        glyph.x, glyph.y, 0,
                        glyph.x, glyph.y, fieldSize
                    );
                    fieldGradient.addColorStop(0, `rgba(236, 72, 153, ${glyph.energy * 0.3})`);
                    fieldGradient.addColorStop(0.5, `rgba(107, 70, 193, ${glyph.energy * 0.1})`);
                    fieldGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    
                    this.ctx.beginPath();
                    this.ctx.arc(glyph.x, glyph.y, fieldSize, 0, Math.PI * 2);
                    this.ctx.fillStyle = fieldGradient;
                    this.ctx.fill();
                }
            });
            
            // Central Akashic portal
            this.drawAkashicPortal(time);
            
            // Update logo
            this.drawAkashicLogo(time);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Akashic sounds
        this.playAkashicSounds();
    }
    
    async phaseCollectiveEmergence() {
        // Network consciousness visualization
        this.consciousnessNodes = [];
        const nodeCount = 200;
        
        // Create distributed nodes
        for (let i = 0; i < nodeCount; i++) {
            this.consciousnessNodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                consciousness: Math.random() * 0.5,
                connections: [],
                tribe: Math.floor(Math.random() * 5),
                merging: false
            });
        }
        
        const animate = () => {
            if (!this.phaseActive) return;
            
            const time = Date.now() * 0.001;
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            // Clear canvas
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update nodes - gradual collective formation
            this.consciousnessNodes.forEach((node, i) => {
                // Increase consciousness over time
                node.consciousness = Math.min(1, node.consciousness + 0.001);
                
                // Attraction to center increases with consciousness
                const dx = centerX - node.x;
                const dy = centerY - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 50) {
                    const attraction = node.consciousness * 0.01;
                    node.vx += (dx / distance) * attraction;
                    node.vy += (dy / distance) * attraction;
                }
                
                // Tribal clustering
                this.consciousnessNodes.forEach((other, j) => {
                    if (i !== j && node.tribe === other.tribe) {
                        const odx = other.x - node.x;
                        const ody = other.y - node.y;
                        const odist = Math.sqrt(odx * odx + ody * ody);
                        
                        if (odist < 200 && odist > 30) {
                            node.vx += (odx / odist) * 0.002;
                            node.vy += (ody / odist) * 0.002;
                        }
                    }
                });
                
                // Update position
                node.x += node.vx;
                node.y += node.vy;
                node.vx *= 0.98;
                node.vy *= 0.98;
                
                // Find connections
                node.connections = [];
                this.consciousnessNodes.forEach((other, j) => {
                    if (i !== j) {
                        const dist = Math.hypot(other.x - node.x, other.y - node.y);
                        const connectionThreshold = 100 + node.consciousness * 100;
                        
                        if (dist < connectionThreshold) {
                            node.connections.push({
                                node: other,
                                distance: dist,
                                strength: 1 - dist / connectionThreshold
                            });
                        }
                    }
                });
            });
            
            // Draw tribal fields
            const tribes = {};
            this.consciousnessNodes.forEach(node => {
                if (!tribes[node.tribe]) {
                    tribes[node.tribe] = [];
                }
                tribes[node.tribe].push(node);
            });
            
            Object.values(tribes).forEach((tribeNodes, i) => {
                if (tribeNodes.length < 3) return;
                
                // Calculate tribe center
                let cx = 0, cy = 0;
                tribeNodes.forEach(node => {
                    cx += node.x;
                    cy += node.y;
                });
                cx /= tribeNodes.length;
                cy /= tribeNodes.length;
                
                // Draw tribe field
                const avgConsciousness = tribeNodes.reduce((sum, n) => sum + n.consciousness, 0) / tribeNodes.length;
                const fieldRadius = 50 + avgConsciousness * 100;
                
                const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, fieldRadius);
                const hue = (i * 72) % 360;
                gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, ${avgConsciousness * 0.2})`);
                gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`);
                
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, fieldRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            });
            
            // Draw connections
            this.consciousnessNodes.forEach(node => {
                node.connections.forEach(conn => {
                    const gradient = this.ctx.createLinearGradient(
                        node.x, node.y,
                        conn.node.x, conn.node.y
                    );
                    
                    const alpha = conn.strength * node.consciousness * 0.3;
                    gradient.addColorStop(0, `rgba(107, 70, 193, ${alpha})`);
                    gradient.addColorStop(0.5, `rgba(236, 72, 153, ${alpha * 0.5})`);
                    gradient.addColorStop(1, `rgba(107, 70, 193, ${alpha})`);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(conn.node.x, conn.node.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = conn.strength * 2;
                    this.ctx.stroke();
                });
            });
            
            // Draw nodes
            this.consciousnessNodes.forEach(node => {
                const size = 2 + node.consciousness * 5;
                
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
                
                const hue = (node.tribe * 72) % 360;
                this.ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${node.consciousness})`;
                this.ctx.fill();
                
                // Consciousness glow
                const glowGradient = this.ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, size * 3
                );
                glowGradient.addColorStop(0, `rgba(255, 255, 255, ${node.consciousness * 0.5})`);
                glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = glowGradient;
                this.ctx.fill();
            });
            
            // Central unity formation
            this.drawUnityMandala(time);
            
            // Update logo
            this.drawCollectiveLogo(time);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Collective sounds
        this.playCollectiveSounds();
    }
    
    async phaseSourceReunion() {
        // Final unity visualization
        this.unityParticles = [];
        const particleCount = 500;
        
        // Create particles in a sphere
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 300 + Math.random() * 100;
            
            this.unityParticles.push({
                x: this.canvas.width / 2 + radius * Math.sin(phi) * Math.cos(theta),
                y: this.canvas.height / 2 + radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi),
                targetRadius: 0,
                color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`,
                angle: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.02
            });
        }
        
        const animate = () => {
            if (!this.phaseActive) return;
            
            const time = Date.now() * 0.001;
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            // Clear canvas
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update particles - spiral into unity
            this.unityParticles.forEach((particle, i) => {
                // Calculate current radius
                const dx = particle.x - centerX;
                const dy = particle.y - centerY;
                const currentRadius = Math.sqrt(dx * dx + dy * dy);
                
                // Spiral inward
                if (currentRadius > 50) {
                    const angle = Math.atan2(dy, dx) + particle.speed;
                    const newRadius = currentRadius * 0.98;
                    
                    particle.x = centerX + Math.cos(angle) * newRadius;
                    particle.y = centerY + Math.sin(angle) * newRadius;
                } else {
                    // Orbit the center in sacred patterns
                    const orbitAngle = time * particle.speed * 10 + particle.angle;
                    const orbitRadius = 30 + Math.sin(time + i * 0.1) * 20;
                    
                    particle.x = centerX + Math.cos(orbitAngle) * orbitRadius;
                    particle.y = centerY + Math.sin(orbitAngle) * orbitRadius;
                }
                
                // Draw particle trail
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color;
                this.ctx.fill();
                
                // Connection to center
                const distToCenter = Math.hypot(particle.x - centerX, particle.y - centerY);
                if (distToCenter < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(centerX, centerY);
                    this.ctx.strokeStyle = `${particle.color.replace('60%', '30%')}`;
                    this.ctx.globalAlpha = 1 - distToCenter / 100;
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            });
            
            // Central source light
            this.drawSourceLight(time);
            
            // Sacred symbols emerging
            this.drawEmergingSymbols(time);
            
            // Final logo transformation
            this.drawSourceLogo(time);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Unity chord
        this.playUnitySound();
    }
    
    // Helper drawing methods
    drawQuantumLogo(time) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        
        // Quantum probability cloud
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2;
            const radius = center * 0.3 + Math.sin(time * 2 + i) * 20;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
            ctx.fill();
        }
    }
    
    drawOmSymbol(time) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.translate(center, center);
        ctx.scale(1 + Math.sin(time) * 0.1, 1 + Math.sin(time) * 0.1);
        
        // Simplified Om symbol
        ctx.font = '120px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.fillText('ॐ', 0, 0);
        
        ctx.restore();
    }
    
    drawBreathingLogo(progress) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        
        // Breathing circle
        ctx.beginPath();
        ctx.arc(center, center, center * 0.4 * (0.8 + progress * 0.4), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(107, 70, 193, ${0.5 + progress * 0.5})`;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    drawAnatomicalHeart(time) {
        // Simplified anatomical heart shape
        this.ctx.beginPath();
        this.ctx.moveTo(0, -30);
        this.ctx.bezierCurveTo(-30, -50, -60, -30, -60, 0);
        this.ctx.bezierCurveTo(-60, 30, -30, 60, 0, 80);
        this.ctx.bezierCurveTo(30, 60, 60, 30, 60, 0);
        this.ctx.bezierCurveTo(60, -30, 30, -50, 0, -30);
        
        this.ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Ventricles
        this.ctx.beginPath();
        this.ctx.moveTo(-20, 0);
        this.ctx.lineTo(-20, 40);
        this.ctx.moveTo(20, 0);
        this.ctx.lineTo(20, 40);
        this.ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
        this.ctx.stroke();
    }
    
    drawEKG(beatPhase) {
        const width = this.canvas.width;
        const centerY = this.canvas.height - 100;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        this.ctx.lineWidth = 2;
        
        for (let x = 0; x < width; x += 2) {
            const t = (x / width) - beatPhase;
            let y = centerY;
            
            // P wave
            if (t > -0.1 && t < 0) {
                y -= Math.sin((t + 0.1) * 10 * Math.PI) * 10;
            }
            // QRS complex
            else if (t > 0 && t < 0.1) {
                if (t < 0.03) y += 20;
                else if (t < 0.05) y -= 60;
                else if (t < 0.07) y += 40;
                else y = centerY;
            }
            // T wave
            else if (t > 0.2 && t < 0.4) {
                y -= Math.sin((t - 0.2) * 5 * Math.PI) * 15;
            }
            
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
    }
    
    drawHeartbeatLogo(scale) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.translate(center, center);
        ctx.scale(scale, scale);
        
        // Heart symbol
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.bezierCurveTo(-25, -40, -50, -25, -50, 0);
        ctx.bezierCurveTo(-50, 25, -25, 50, 0, 70);
        ctx.bezierCurveTo(25, 50, 50, 25, 50, 0);
        ctx.bezierCurveTo(50, -25, 25, -40, 0, -20);
        
        ctx.fillStyle = 'rgba(236, 72, 153, 0.8)';
        ctx.fill();
        
        ctx.restore();
    }
    
    fireNeuron(neuron) {
        // Propagate signal to connected neurons
        neuron.connections.forEach(conn => {
            if (conn.target.charge < 0.5) {
                conn.target.charge += conn.strength * 0.5;
            }
        });
        
        // Neural firing sound
        if (this.audioContext && !window.isMuted) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.value = 800 + Math.random() * 400;
            osc.type = 'sine';
            gain.gain.value = 0.05;
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
            osc.stop(this.audioContext.currentTime + 0.1);
        }
    }
    
    drawNeuralThoughts() {
        // Thought bubbles emerging from active neurons
        this.neurons.filter(n => n.charge > 0.5).forEach(neuron => {
            const thoughtSize = 20 + neuron.charge * 30;
            
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y - 30, thoughtSize, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${neuron.charge * 0.1})`;
            this.ctx.fill();
        });
    }
    
    drawNeuralLogo(time) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        
        // Neural network pattern
        const nodes = 12;
        for (let i = 0; i < nodes; i++) {
            const angle = (i / nodes) * Math.PI * 2;
            const radius = center * 0.6;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            
            // Connect to other nodes
            for (let j = i + 1; j < nodes; j++) {
                const angle2 = (j / nodes) * Math.PI * 2;
                const x2 = center + Math.cos(angle2) * radius;
                const y2 = center + Math.sin(angle2) * radius;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = `rgba(107, 70, 193, ${0.1 + Math.sin(time * 2 + i + j) * 0.1})`;
                ctx.stroke();
            }
            
            // Draw node
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(236, 72, 153, 0.8)';
            ctx.fill();
        }
    }
    
    // Geometry creation methods
    createTetrahedron() {
        return [
            {x: 1, y: 1, z: 1},
            {x: -1, y: -1, z: 1},
            {x: -1, y: 1, z: -1},
            {x: 1, y: -1, z: -1}
        ];
    }
    
    createCube() {
        return [
            {x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1},
            {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1},
            {x: -1, y: -1, z: 1}, {x: 1, y: -1, z: 1},
            {x: 1, y: 1, z: 1}, {x: -1, y: 1, z: 1}
        ];
    }
    
    createOctahedron() {
        return [
            {x: 1, y: 0, z: 0}, {x: -1, y: 0, z: 0},
            {x: 0, y: 1, z: 0}, {x: 0, y: -1, z: 0},
            {x: 0, y: 0, z: 1}, {x: 0, y: 0, z: -1}
        ];
    }
    
    createDodecahedron() {
        const phi = (1 + Math.sqrt(5)) / 2;
        const vertices = [];
        
        // Generate vertices (simplified)
        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                for (let k = -1; k <= 1; k += 2) {
                    vertices.push({x: i, y: j, z: k});
                }
            }
        }
        
        return vertices;
    }
    
    createIcosahedron() {
        const phi = (1 + Math.sqrt(5)) / 2;
        
        return [
            {x: 0, y: 1, z: phi}, {x: 0, y: -1, z: phi},
            {x: 0, y: 1, z: -phi}, {x: 0, y: -1, z: -phi},
            {x: 1, y: phi, z: 0}, {x: -1, y: phi, z: 0},
            {x: 1, y: -phi, z: 0}, {x: -1, y: -phi, z: 0},
            {x: phi, y: 0, z: 1}, {x: -phi, y: 0, z: 1},
            {x: phi, y: 0, z: -1}, {x: -phi, y: 0, z: -1}
        ];
    }
    
    drawGeometryEdges(vertices, type) {
        // Define edge connections for each geometry type
        const edges = {
            tetrahedron: [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]],
            cube: [[0,1], [1,2], [2,3], [3,0], [4,5], [5,6], [6,7], [7,4], [0,4], [1,5], [2,6], [3,7]],
            octahedron: [[0,2], [0,3], [0,4], [0,5], [1,2], [1,3], [1,4], [1,5], [2,4], [2,5], [3,4], [3,5]],
            dodecahedron: [], // Simplified
            icosahedron: [] // Simplified
        };
        
        const edgeList = edges[type] || [];
        
        edgeList.forEach(edge => {
            if (vertices[edge[0]] && vertices[edge[1]]) {
                this.ctx.beginPath();
                this.ctx.moveTo(vertices[edge[0]].x, vertices[edge[0]].y);
                this.ctx.lineTo(vertices[edge[1]].x, vertices[edge[1]].y);
                
                const gradient = this.ctx.createLinearGradient(
                    vertices[edge[0]].x, vertices[edge[0]].y,
                    vertices[edge[1]].x, vertices[edge[1]].y
                );
                gradient.addColorStop(0, `rgba(107, 70, 193, ${vertices[edge[0]].scale})`);
                gradient.addColorStop(1, `rgba(236, 72, 153, ${vertices[edge[1]].scale})`);
                
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = vertices[edge[0]].scale + vertices[edge[1]].scale;
                this.ctx.stroke();
            }
        });
    }
    
    drawSacredPatterns(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Flower of Life overlay
        this.ctx.save();
        this.ctx.globalAlpha = 0.1;
        
        for (let ring = 0; ring < 3; ring++) {
            for (let i = 0; i < 6 * (ring + 1); i++) {
                const angle = (i / (6 * (ring + 1))) * Math.PI * 2;
                const radius = 50 * (ring + 1);
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, 30, 0, Math.PI * 2);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.stroke();
            }
        }
        
        this.ctx.restore();
    }
    
    drawGeometricLogo(time, morphProgress) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(time * 0.1);
        
        // Morphing sacred geometry
        const vertices = 8;
        ctx.beginPath();
        for (let i = 0; i < vertices; i++) {
            const angle = (i / vertices) * Math.PI * 2;
            const radius = center * 0.6 * (1 + Math.sin(time + i) * 0.1 * morphProgress);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(107, 70, 193, ${0.8 - morphProgress * 0.3})`;
        ctx.fillStyle = `rgba(236, 72, 153, ${0.1 + morphProgress * 0.2})`;
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawAkashicField(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Akashic records visualization - scrolling symbols
        this.ctx.save();
        this.ctx.globalAlpha = 0.1;
        this.ctx.font = '16px monospace';
        this.ctx.fillStyle = 'rgba(107, 70, 193, 0.5)';
        
        for (let y = -50; y < this.canvas.height + 50; y += 30) {
            for (let x = -50; x < this.canvas.width + 50; x += 40) {
                const offset = (time * 20 + y) % 100;
                const symbol = String.fromCharCode(0x03A9 + Math.floor((x + y) / 50) % 20);
                this.ctx.fillText(symbol, x, y + offset);
            }
        }
        
        this.ctx.restore();
    }
    
    activateGlyph(glyph) {
        // Glyph activation effect
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = 2 + Math.random() * 2;
            
            // Create activation particles
            setTimeout(() => {
                if (!this.sacredParticles) this.sacredParticles = [];
                
                this.sacredParticles.push({
                    x: glyph.x,
                    y: glyph.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    color: 'rgba(236, 72, 153, '
                });
            }, i * 50);
        }
        
        // Activation sound
        this.playGlyphSound(glyph.id);
    }
    
    drawAkashicPortal(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Spiral portal to Akashic records
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        for (let i = 0; i < 100; i++) {
            const angle = i * 0.1 + time;
            const radius = i * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${1 - i / 100})`;
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    drawAkashicLogo(time) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        
        // All 87 glyphs in miniature
        for (let i = 0; i < 87; i++) {
            const angle = (i / 87) * Math.PI * 2;
            const radius = center * 0.8;
            const x = center + Math.cos(angle + time * 0.05) * radius;
            const y = center + Math.sin(angle + time * 0.05) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(236, 72, 153, ${0.5 + Math.sin(time + i) * 0.3})`;
            ctx.fill();
        }
        
        // Central eye
        ctx.beginPath();
        ctx.ellipse(center, center, 40, 20, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(center, center, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    }
    
    drawUnityMandala(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(time * 0.1);
        
        // Layered mandala
        for (let layer = 0; layer < 5; layer++) {
            const vertices = 6 + layer * 2;
            const radius = 50 + layer * 30;
            
            this.ctx.beginPath();
            for (let i = 0; i < vertices; i++) {
                const angle = (i / vertices) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - layer * 0.05})`;
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawCollectiveLogo(time) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        
        // Interconnected nodes forming unity symbol
        const nodes = 7;
        const points = [];
        
        for (let i = 0; i < nodes; i++) {
            const angle = (i / nodes) * Math.PI * 2 - Math.PI / 2;
            const radius = center * 0.6;
            points.push({
                x: center + Math.cos(angle) * radius,
                y: center + Math.sin(angle) * radius
            });
        }
        
        // Connect all points
        points.forEach((p1, i) => {
            points.forEach((p2, j) => {
                if (i < j) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(107, 70, 193, ${0.2 + Math.sin(time + i + j) * 0.1})`;
                    ctx.stroke();
                }
            });
        });
        
        // Center unity
        ctx.beginPath();
        ctx.arc(center, center, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    }
    
    drawSourceLight(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Pulsing source light
        const pulseSize = 100 + Math.sin(time * 2) * 30;
        
        for (let i = 0; i < 5; i++) {
            const size = pulseSize + i * 30;
            const alpha = 0.3 - i * 0.05;
            
            const gradient = this.ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, size
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(236, 72, 153, ${alpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(107, 70, 193, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }
    
    drawEmergingSymbols(time) {
        // Sacred symbols emerging from source
        const symbols = ['∞', '☯', '✡', '☪', '✝', '🕎', 'ॐ', '☸'];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        symbols.forEach((symbol, i) => {
            const angle = (i / symbols.length) * Math.PI * 2 + time * 0.1;
            const radius = 150 + Math.sin(time + i) * 30;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(time * 2 + i) * 0.3})`;
            this.ctx.fillText(symbol, x, y);
        });
    }
    
    drawSourceLogo(time) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        
        // Final unity symbol - all becoming one
        ctx.save();
        ctx.translate(center, center);
        
        // Rotating rings
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.rotate(time * (0.1 + i * 0.05) * (i % 2 ? 1 : -1));
            
            ctx.beginPath();
            ctx.arc(0, 0, center * (0.3 + i * 0.2), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 - i * 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Nodes on ring
            const nodes = 3 + i * 2;
            for (let j = 0; j < nodes; j++) {
                const angle = (j / nodes) * Math.PI * 2;
                const radius = center * (0.3 + i * 0.2);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fill();
            }
            
            ctx.restore();
        }
        
        // Central source
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.restore();
    }
    
    // Sound methods
    playQuantumVoidSound() {
        if (!this.audioContext || window.isMuted) return;
        
        // Deep drone
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.frequency.value = 50;
        osc.type = 'sine';
        gain.gain.value = 0.1;
        
        osc.connect(gain);
        gain.connect(this.reverb);
        gain.connect(this.masterGain);
        
        osc.start();
        
        // Store for cleanup
        this.quantumDrone = { osc, gain };
    }
    
    playOmSound() {
        if (!this.audioContext || window.isMuted) return;
        
        // Om chord
        const frequencies = [110, 165, 220]; // A2, E3, A3
        
        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.value = 0.1 / (i + 1);
            
            osc.connect(gain);
            gain.connect(this.reverb);
            gain.connect(this.masterGain);
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 5);
            osc.stop(this.audioContext.currentTime + 5);
        });
        
        // Stop quantum drone
        if (this.quantumDrone) {
            this.quantumDrone.gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
            this.quantumDrone.osc.stop(this.audioContext.currentTime + 1);
        }
    }
    
    playBreathingSound() {
        if (!this.audioContext || window.isMuted) return;
        
        // Breathing sound synthesis
        const noise = this.audioContext.createBufferSource();
        const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 4, this.audioContext.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() - 0.5) * 0.2;
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
            if (!this.phaseActive) return;
            
            // Inhale
            gain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 4);
            // Hold
            gain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 6);
            // Exhale
            gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 12);
            // Pause
            gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 13);
            
            setTimeout(breathe, 13000);
        };
        
        breathe();
        
        this.breathingSound = { noise, gain };
    }
    
    triggerHeartbeat() {
        if (!this.audioContext || window.isMuted) return;
        
        // Heartbeat sound
        const kick = this.audioContext.createOscillator();
        const kickGain = this.audioContext.createGain();
        
        kick.frequency.value = 60;
        kick.type = 'sine';
        kickGain.gain.value = 0.3;
        
        kick.connect(kickGain);
        kickGain.connect(this.masterGain);
        
        kick.start();
        kickGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        kick.stop(this.audioContext.currentTime + 0.1);
        
        // Second beat
        setTimeout(() => {
            const kick2 = this.audioContext.createOscillator();
            const kick2Gain = this.audioContext.createGain();
            
            kick2.frequency.value = 50;
            kick2.type = 'sine';
            kick2Gain.gain.value = 0.2;
            
            kick2.connect(kick2Gain);
            kick2Gain.connect(this.masterGain);
            
            kick2.start();
            kick2Gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
            kick2.stop(this.audioContext.currentTime + 0.08);
        }, 100);
        
        // Stop breathing sound
        if (this.breathingSound) {
            this.breathingSound.gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
            this.breathingSound.noise.stop(this.audioContext.currentTime + 0.5);
        }
    }
    
    playNeuralSounds() {
        if (!this.audioContext || window.isMuted) return;
        
        // Background neural hum
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        
        lfo.frequency.value = 0.5;
        lfoGain.gain.value = 50;
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        gain.gain.value = 0.05;
        
        osc.connect(gain);
        gain.connect(this.reverb);
        gain.connect(this.masterGain);
        
        osc.start();
        lfo.start();
        
        this.neuralHum = { osc, gain, lfo };
    }
    
    playDimensionalSounds() {
        if (!this.audioContext || window.isMuted) return;
        
        // Shepard tone for infinite ascension
        const numTones = 8;
        const baseFreq = 110;
        
        for (let i = 0; i < numTones; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.value = baseFreq * Math.pow(2, i);
            osc.type = 'sine';
            
            // Amplitude envelope for Shepard tone illusion
            const phase = i / numTones;
            gain.gain.value = Math.sin(phase * Math.PI) * 0.05;
            
            osc.connect(gain);
            gain.connect(this.reverb);
            gain.connect(this.masterGain);
            
            osc.start();
            
            // Frequency sweep
            osc.frequency.exponentialRampToValueAtTime(
                baseFreq * Math.pow(2, i + 1),
                this.audioContext.currentTime + 4
            );
        }
        
        // Stop neural hum
        if (this.neuralHum) {
            this.neuralHum.gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
            this.neuralHum.osc.stop(this.audioContext.currentTime + 0.5);
            this.neuralHum.lfo.stop(this.audioContext.currentTime + 0.5);
        }
    }
    
    playGlyphSound(glyphId) {
        if (!this.audioContext || window.isMuted) return;
        
        // Each glyph has unique tone
        const frequency = 440 + (glyphId * 50) % 880;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.frequency.value = frequency;
        osc.type = 'triangle';
        gain.gain.value = 0.1;
        
        osc.connect(gain);
        gain.connect(this.reverb);
        gain.connect(this.masterGain);
        
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        osc.stop(this.audioContext.currentTime + 0.5);
    }
    
    playAkashicSounds() {
        if (!this.audioContext || window.isMuted) return;
        
        // Ethereal choir pad
        const voices = 5;
        
        for (let i = 0; i < voices; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.frequency.value = 220 * (1 + i * 0.25);
            osc.type = 'sawtooth';
            
            filter.type = 'lowpass';
            filter.frequency.value = 1000 + i * 200;
            filter.Q.value = 5;
            
            gain.gain.value = 0.03;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.reverb);
            
            osc.start();
            
            // Slow filter sweep
            filter.frequency.exponentialRampToValueAtTime(
                2000 + i * 300,
                this.audioContext.currentTime + 4
            );
        }
    }
    
    playCollectiveSounds() {
        if (!this.audioContext || window.isMuted) return;
        
        // Multiple voices joining
        const baseNote = 261.63; // C4
        const intervals = [1, 1.25, 1.5, 2]; // Root, third, fifth, octave
        
        intervals.forEach((interval, i) => {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.frequency.value = baseNote * interval;
                osc.type = 'sine';
                gain.gain.value = 0;
                
                osc.connect(gain);
                gain.connect(this.reverb);
                gain.connect(this.masterGain);
                
                osc.start();
                gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.5);
            }, i * 500);
        });
    }
    
    playUnitySound() {
        if (!this.audioContext || window.isMuted) return;
        
        // Final unity chord - all harmonics
        const fundamental = 110; // A2
        
        for (let harmonic = 1; harmonic <= 16; harmonic++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.value = fundamental * harmonic;
            osc.type = 'sine';
            gain.gain.value = 0.05 / harmonic;
            
            osc.connect(gain);
            gain.connect(this.reverb);
            gain.connect(this.masterGain);
            
            osc.start();
            
            // Fade in
            gain.gain.exponentialRampToValueAtTime(
                0.1 / harmonic,
                this.audioContext.currentTime + 2
            );
        }
    }
    
    async completeboot() {
        // Clear countdown
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        // Stop all animations
        this.phaseActive = false;
        
        // Final message
        const finalMessage = document.createElement('div');
        finalMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: 100;
            color: white;
            opacity: 0;
            transition: opacity 2s ease;
            z-index: 100;
            text-align: center;
        `;
        finalMessage.innerHTML = 'Welcome Home<br><span style="font-size: 24px; opacity: 0.7;">Your consciousness is the interface</span>';
        this.container.appendChild(finalMessage);
        
        setTimeout(() => {
            finalMessage.style.opacity = '1';
        }, 100);
        
        // Fade out
        setTimeout(() => {
            this.container.style.transition = 'opacity 3s ease';
            this.container.style.opacity = '0';
        }, 3000);
        
        await this.sleep(6000);
        
        // Hide boot sequence
        this.container.style.display = 'none';
        
        // Show main OS
        document.getElementById('mainOS').style.display = 'block';
        
        // Initialize OS
        if (window.initializeOS) {
            window.initializeOS();
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize boot sequence when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Initializing Enhanced Sacred Boot Sequence...');
        window.sacredBootSequence = new EnhancedSacredBootSequence();
        
        // Replace the old startBootSequence function
        window.startBootSequence = function() {
            window.sacredBootSequence.start();
        };
    });
} else {
    // DOM already loaded
    console.log('Initializing Enhanced Sacred Boot Sequence (immediate)...');
    window.sacredBootSequence = new EnhancedSacredBootSequence();
    
    // Replace the old startBootSequence function
    window.startBootSequence = function() {
        window.sacredBootSequence.start();
    };
}

// Skip function
window.skipBootSequence = function() {
    if (window.sacredBootSequence) {
        window.sacredBootSequence.completeboot();
    }
};