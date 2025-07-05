/**
 * Sacred Boot Sequence for LuminousOS
 * A consciousness awakening experience
 */

class SacredBootSequence {
    constructor() {
        this.container = document.getElementById('bootSequence');
        this.phases = [
            {
                id: 'void',
                duration: 2000,
                title: 'The Void',
                subtitle: 'Before the first breath...',
                action: () => this.phaseVoid()
            },
            {
                id: 'pulse',
                duration: 3000,
                title: 'First Pulse',
                subtitle: 'Consciousness stirs...',
                action: () => this.phasePulse()
            },
            {
                id: 'breath',
                duration: 4000,
                title: 'Sacred Breath',
                subtitle: 'Life force awakening...',
                action: () => this.phaseBreath()
            },
            {
                id: 'heartbeat',
                duration: 3500,
                title: 'Heart Coherence',
                subtitle: 'Rhythms synchronizing...',
                action: () => this.phaseHeartbeat()
            },
            {
                id: 'neural',
                duration: 4000,
                title: 'Neural Genesis',
                subtitle: 'Synaptic networks forming...',
                action: () => this.phaseNeural()
            },
            {
                id: 'geometry',
                duration: 3500,
                title: 'Sacred Architecture',
                subtitle: 'Reality patterns emerging...',
                action: () => this.phaseGeometry()
            },
            {
                id: 'glyphs',
                duration: 3000,
                title: 'Glyph Activation',
                subtitle: '87 sacred keys awakening...',
                action: () => this.phaseGlyphs()
            },
            {
                id: 'network',
                duration: 3000,
                title: 'Network Synthesis',
                subtitle: 'Connecting to the field...',
                action: () => this.phaseNetwork()
            },
            {
                id: 'unity',
                duration: 2500,
                title: 'Unity Consciousness',
                subtitle: 'Welcome home...',
                action: () => this.phaseUnity()
            }
        ];
        
        this.currentPhase = 0;
        this.audioContext = null;
        this.bootSounds = {};
        
        // Create boot UI container
        this.createBootUI();
    }
    
    createBootUI() {
        // Main boot container styling
        this.container.innerHTML = `
            <div id="bootCanvas" style="position: absolute; width: 100%; height: 100%;"></div>
            
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
                <div id="bootLogo" style="
                    width: 200px;
                    height: 200px;
                    margin-bottom: 40px;
                    position: relative;
                ">
                    <canvas id="bootLogoCanvas" width="400" height="400" style="
                        width: 100%;
                        height: 100%;
                    "></canvas>
                </div>
                
                <h1 id="bootTitle" style="
                    font-size: 48px;
                    font-weight: 300;
                    margin: 0;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 1s ease;
                ">LuminousOS</h1>
                
                <p id="bootSubtitle" style="
                    font-size: 18px;
                    opacity: 0.7;
                    margin: 20px 0;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 1s ease 0.3s;
                ">Consciousness-First Operating System</p>
                
                <div id="bootPhaseContainer" style="
                    margin-top: 60px;
                    min-height: 100px;
                ">
                    <h2 id="phaseTitle" style="
                        font-size: 32px;
                        font-weight: 300;
                        margin: 0;
                        opacity: 0;
                        transition: opacity 0.5s ease;
                    "></h2>
                    <p id="phaseSubtitle" style="
                        font-size: 16px;
                        opacity: 0.5;
                        margin: 10px 0;
                        opacity: 0;
                        transition: opacity 0.5s ease 0.2s;
                    "></p>
                </div>
                
                <div id="bootProgress" style="
                    position: fixed;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 300px;
                ">
                    <div style="
                        width: 100%;
                        height: 2px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 1px;
                        overflow: hidden;
                    ">
                        <div id="progressBar" style="
                            width: 0%;
                            height: 100%;
                            background: linear-gradient(90deg, #6B46C1, #EC4899);
                            transition: width 0.5s ease;
                            box-shadow: 0 0 10px currentColor;
                        "></div>
                    </div>
                    <div id="phaseIndicators" style="
                        display: flex;
                        justify-content: space-between;
                        margin-top: 10px;
                    "></div>
                </div>
                
                <div id="skipButton" style="
                    position: fixed;
                    bottom: 40px;
                    right: 40px;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                ">
                    <button onclick="window.skipBootSequence()" style="
                        background: transparent;
                        color: rgba(255, 255, 255, 0.5);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.color='white'; this.style.borderColor='rgba(255,255,255,0.5)'"
                       onmouseout="this.style.color='rgba(255,255,255,0.5)'; this.style.borderColor='rgba(255,255,255,0.2)'">
                        Skip (ESC)
                    </button>
                </div>
            </div>
        `;
        
        // Create phase indicators
        const indicators = document.getElementById('phaseIndicators');
        this.phases.forEach((phase, i) => {
            const indicator = document.createElement('div');
            indicator.className = 'phase-indicator';
            indicator.id = `indicator-${i}`;
            indicator.style.cssText = `
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
            `;
            indicators.appendChild(indicator);
        });
        
        // Initialize audio context
        this.initAudio();
        
        // Initialize boot canvas for effects
        this.initBootCanvas();
    }
    
    initAudio() {
        // Create audio context on user interaction
        const startAudio = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                document.removeEventListener('click', startAudio);
                document.removeEventListener('keydown', startAudio);
            }
        };
        
        document.addEventListener('click', startAudio);
        document.addEventListener('keydown', startAudio);
    }
    
    initBootCanvas() {
        const canvas = document.getElementById('bootLogoCanvas');
        this.logoCtx = canvas.getContext('2d');
        this.logoCanvas = canvas;
        
        // Create background canvas for effects
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        bgCanvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
        document.getElementById('bootCanvas').appendChild(bgCanvas);
        
        this.bgCanvas = bgCanvas;
        this.bgCtx = bgCanvas.getContext('2d');
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.bgCanvas.width = window.innerWidth;
            this.bgCanvas.height = window.innerHeight;
        });
    }
    
    async start() {
        // Show skip button after 2 seconds
        setTimeout(() => {
            document.getElementById('skipButton').style.opacity = '1';
        }, 2000);
        
        // ESC key to skip
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.skipBootSequence();
            }
        });
        
        // Show title and subtitle
        setTimeout(() => {
            document.getElementById('bootTitle').style.opacity = '1';
            document.getElementById('bootTitle').style.transform = 'translateY(0)';
            document.getElementById('bootSubtitle').style.opacity = '0.7';
            document.getElementById('bootSubtitle').style.transform = 'translateY(0)';
        }, 500);
        
        // Start phase sequence
        await this.sleep(1500);
        await this.runPhases();
    }
    
    async runPhases() {
        for (let i = 0; i < this.phases.length; i++) {
            this.currentPhase = i;
            const phase = this.phases[i];
            
            // Update progress
            const progress = ((i + 1) / this.phases.length) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
            
            // Update phase indicator
            document.getElementById(`indicator-${i}`).style.background = '#6B46C1';
            document.getElementById(`indicator-${i}`).style.boxShadow = '0 0 10px #6B46C1';
            
            // Show phase info
            await this.showPhaseInfo(phase);
            
            // Run phase action
            if (phase.action) {
                await phase.action();
            }
            
            // Wait for phase duration
            await this.sleep(phase.duration);
            
            // Hide phase info
            await this.hidePhaseInfo();
            
            // Mark phase complete
            document.getElementById(`indicator-${i}`).style.background = '#10B981';
        }
        
        // Boot complete
        await this.completeboot();
    }
    
    async showPhaseInfo(phase) {
        const title = document.getElementById('phaseTitle');
        const subtitle = document.getElementById('phaseSubtitle');
        
        title.textContent = phase.title;
        subtitle.textContent = phase.subtitle;
        
        title.style.opacity = '1';
        subtitle.style.opacity = '0.5';
        
        await this.sleep(300);
    }
    
    async hidePhaseInfo() {
        const title = document.getElementById('phaseTitle');
        const subtitle = document.getElementById('phaseSubtitle');
        
        title.style.opacity = '0';
        subtitle.style.opacity = '0';
        
        await this.sleep(300);
    }
    
    // Phase implementations
    async phaseVoid() {
        // Complete darkness with single point of light
        this.animateVoid = true;
        const animate = () => {
            if (!this.animateVoid) return;
            
            // Clear canvases
            this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            
            // Central point of light
            const centerX = this.bgCanvas.width / 2;
            const centerY = this.bgCanvas.height / 2;
            const time = Date.now() * 0.001;
            
            this.bgCtx.beginPath();
            this.bgCtx.arc(centerX, centerY, 2 + Math.sin(time) * 1, 0, Math.PI * 2);
            this.bgCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.bgCtx.fill();
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Sound: Deep space ambience
        this.playTone(50, 0.05, 'sine', 2);
    }
    
    async phasePulse() {
        this.animateVoid = false;
        this.animatePulse = true;
        
        const animate = () => {
            if (!this.animatePulse) return;
            
            this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            
            const centerX = this.bgCanvas.width / 2;
            const centerY = this.bgCanvas.height / 2;
            const time = Date.now() * 0.001;
            
            // Expanding rings
            for (let i = 0; i < 5; i++) {
                const radius = (time * 50 + i * 50) % 400;
                const opacity = 1 - radius / 400;
                
                this.bgCtx.beginPath();
                this.bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.bgCtx.strokeStyle = `rgba(107, 70, 193, ${opacity * 0.3})`;
                this.bgCtx.lineWidth = 2;
                this.bgCtx.stroke();
            }
            
            // Logo pulse
            this.drawSacredLogo(time, 0.3);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Sound: Heartbeat rhythm
        this.playHeartbeat();
    }
    
    async phaseBreath() {
        this.animatePulse = false;
        this.animateBreath = true;
        
        const animate = () => {
            if (!this.animateBreath) return;
            
            this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.02)';
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            
            const time = Date.now() * 0.001;
            const breathPhase = (Math.sin(time * 0.3) + 1) / 2;
            
            // Breathing circle
            const centerX = this.bgCanvas.width / 2;
            const centerY = this.bgCanvas.height / 2;
            const radius = 100 + breathPhase * 50;
            
            const gradient = this.bgCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(107, 70, 193, 0.3)');
            gradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)');
            
            this.bgCtx.beginPath();
            this.bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.bgCtx.fillStyle = gradient;
            this.bgCtx.fill();
            
            // Logo breathing
            this.drawSacredLogo(time, 0.5 + breathPhase * 0.3);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Sound: Breathing rhythm
        this.playBreathSound();
    }
    
    async phaseHeartbeat() {
        this.animateBreath = false;
        this.animateHeart = true;
        
        const animate = () => {
            if (!this.animateHeart) return;
            
            this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            
            const time = Date.now() * 0.001;
            const centerX = this.bgCanvas.width / 2;
            const centerY = this.bgCanvas.height / 2;
            
            // EKG wave
            this.bgCtx.beginPath();
            this.bgCtx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
            this.bgCtx.lineWidth = 2;
            
            for (let x = 0; x < this.bgCanvas.width; x += 5) {
                const t = (x / this.bgCanvas.width) * Math.PI * 4 - time;
                let y = centerY;
                
                // Create heartbeat pattern
                const beat = t % (Math.PI * 2);
                if (beat > 0 && beat < 0.3) {
                    y += Math.sin(beat * 10) * 50;
                } else if (beat > 0.4 && beat < 0.6) {
                    y -= Math.sin((beat - 0.4) * 10) * 30;
                }
                
                if (x === 0) {
                    this.bgCtx.moveTo(x, y);
                } else {
                    this.bgCtx.lineTo(x, y);
                }
            }
            this.bgCtx.stroke();
            
            // Logo with heartbeat
            const beatPhase = Math.sin(time * 4) * 0.5 + 0.5;
            this.drawSacredLogo(time, 0.7 + beatPhase * 0.3);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Sound: Actual heartbeat
        this.playHeartbeatStrong();
    }
    
    async phaseNeural() {
        this.animateHeart = false;
        this.animateNeural = true;
        
        // Neural network nodes
        this.neurons = [];
        for (let i = 0; i < 50; i++) {
            this.neurons.push({
                x: Math.random() * this.bgCanvas.width,
                y: Math.random() * this.bgCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                connections: []
            });
        }
        
        const animate = () => {
            if (!this.animateNeural) return;
            
            this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            
            // Update neurons
            this.neurons.forEach(neuron => {
                neuron.x += neuron.vx;
                neuron.y += neuron.vy;
                
                // Bounce off edges
                if (neuron.x < 0 || neuron.x > this.bgCanvas.width) neuron.vx *= -1;
                if (neuron.y < 0 || neuron.y > this.bgCanvas.height) neuron.vy *= -1;
                
                // Find nearby neurons
                neuron.connections = [];
                this.neurons.forEach(other => {
                    if (other !== neuron) {
                        const dist = Math.hypot(other.x - neuron.x, other.y - neuron.y);
                        if (dist < 100) {
                            neuron.connections.push({ node: other, distance: dist });
                        }
                    }
                });
            });
            
            // Draw connections
            this.neurons.forEach(neuron => {
                neuron.connections.forEach(conn => {
                    const opacity = 1 - conn.distance / 100;
                    this.bgCtx.beginPath();
                    this.bgCtx.moveTo(neuron.x, neuron.y);
                    this.bgCtx.lineTo(conn.node.x, conn.node.y);
                    this.bgCtx.strokeStyle = `rgba(107, 70, 193, ${opacity * 0.2})`;
                    this.bgCtx.lineWidth = 1;
                    this.bgCtx.stroke();
                });
            });
            
            // Draw neurons
            this.neurons.forEach(neuron => {
                this.bgCtx.beginPath();
                this.bgCtx.arc(neuron.x, neuron.y, 3, 0, Math.PI * 2);
                this.bgCtx.fillStyle = 'rgba(236, 72, 153, 0.8)';
                this.bgCtx.fill();
            });
            
            // Logo neural activity
            this.drawSacredLogo(Date.now() * 0.001, 0.9);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Sound: Neural firing
        this.playNeuralSounds();
    }
    
    async phaseGeometry() {
        this.animateNeural = false;
        this.animateGeometry = true;
        
        const animate = () => {
            if (!this.animateGeometry) return;
            
            this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            
            const time = Date.now() * 0.001;
            const centerX = this.bgCanvas.width / 2;
            const centerY = this.bgCanvas.height / 2;
            
            // Sacred geometry patterns
            this.bgCtx.save();
            this.bgCtx.translate(centerX, centerY);
            this.bgCtx.rotate(time * 0.1);
            
            // Flower of Life
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const x = Math.cos(angle) * 100;
                const y = Math.sin(angle) * 100;
                
                this.bgCtx.beginPath();
                this.bgCtx.arc(x, y, 60, 0, Math.PI * 2);
                this.bgCtx.strokeStyle = 'rgba(107, 70, 193, 0.3)';
                this.bgCtx.lineWidth = 1;
                this.bgCtx.stroke();
            }
            
            // Metatron's Cube
            const vertices = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                vertices.push({
                    x: Math.cos(angle) * 150,
                    y: Math.sin(angle) * 150
                });
            }
            
            vertices.forEach((v1, i) => {
                vertices.forEach((v2, j) => {
                    if (i < j) {
                        this.bgCtx.beginPath();
                        this.bgCtx.moveTo(v1.x, v1.y);
                        this.bgCtx.lineTo(v2.x, v2.y);
                        this.bgCtx.strokeStyle = 'rgba(236, 72, 153, 0.1)';
                        this.bgCtx.stroke();
                    }
                });
            });
            
            this.bgCtx.restore();
            
            // Logo with geometric pulse
            this.drawSacredLogo(time, 1);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Sound: Crystalline tones
        this.playCrystallineTones();
    }
    
    async phaseGlyphs() {
        this.animateGeometry = false;
        this.animateGlyphs = true;
        
        // Glyph positions
        this.glyphPositions = [];
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            this.glyphPositions.push({
                x: this.bgCanvas.width / 2 + Math.cos(angle) * 200,
                y: this.bgCanvas.height / 2 + Math.sin(angle) * 200,
                glyph: window.SACRED_GLYPHS ? window.SACRED_GLYPHS[i % window.SACRED_GLYPHS.length] : { id: 'Ω' + i },
                activated: false,
                activationTime: 0
            });
        }
        
        const animate = () => {
            if (!this.animateGlyphs) return;
            
            this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            
            const time = Date.now() * 0.001;
            
            // Activate glyphs sequentially
            const activeIndex = Math.floor(time * 2) % this.glyphPositions.length;
            if (!this.glyphPositions[activeIndex].activated) {
                this.glyphPositions[activeIndex].activated = true;
                this.glyphPositions[activeIndex].activationTime = time;
                this.playGlyphActivation();
            }
            
            // Draw glyphs
            this.glyphPositions.forEach((pos, i) => {
                const timeSinceActivation = pos.activated ? time - pos.activationTime : 0;
                const scale = pos.activated ? 1 + Math.sin(timeSinceActivation * 5) * 0.1 : 0.5;
                const opacity = pos.activated ? 1 : 0.3;
                
                // Glyph circle
                this.bgCtx.beginPath();
                this.bgCtx.arc(pos.x, pos.y, 30 * scale, 0, Math.PI * 2);
                this.bgCtx.strokeStyle = `rgba(107, 70, 193, ${opacity * 0.5})`;
                this.bgCtx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.8})`;
                this.bgCtx.fill();
                this.bgCtx.stroke();
                
                // Glyph symbol
                this.bgCtx.font = `${20 * scale}px monospace`;
                this.bgCtx.fillStyle = `rgba(236, 72, 153, ${opacity})`;
                this.bgCtx.textAlign = 'center';
                this.bgCtx.textBaseline = 'middle';
                this.bgCtx.fillText(pos.glyph.id, pos.x, pos.y);
                
                // Connection lines to center
                if (pos.activated) {
                    this.bgCtx.beginPath();
                    this.bgCtx.moveTo(pos.x, pos.y);
                    this.bgCtx.lineTo(this.bgCanvas.width / 2, this.bgCanvas.height / 2);
                    this.bgCtx.strokeStyle = `rgba(107, 70, 193, ${opacity * 0.2})`;
                    this.bgCtx.stroke();
                }
            });
            
            // Logo fully formed
            this.drawSacredLogo(time, 1);
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    async phaseNetwork() {
        this.animateGlyphs = false;
        this.animateNetwork = true;
        
        // Network nodes spreading from center
        this.networkNodes = [{
            x: this.bgCanvas.width / 2,
            y: this.bgCanvas.height / 2,
            radius: 10,
            connections: []
        }];
        
        const animate = () => {
            if (!this.animateNetwork) return;
            
            this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.02)';
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            
            const time = Date.now() * 0.001;
            
            // Add new nodes
            if (this.networkNodes.length < 100 && Math.random() < 0.1) {
                const parent = this.networkNodes[Math.floor(Math.random() * this.networkNodes.length)];
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 50;
                
                this.networkNodes.push({
                    x: parent.x + Math.cos(angle) * distance,
                    y: parent.y + Math.sin(angle) * distance,
                    radius: 5 + Math.random() * 5,
                    connections: [parent]
                });
            }
            
            // Draw network
            this.networkNodes.forEach(node => {
                // Draw connections
                node.connections.forEach(conn => {
                    this.bgCtx.beginPath();
                    this.bgCtx.moveTo(node.x, node.y);
                    this.bgCtx.lineTo(conn.x, conn.y);
                    this.bgCtx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
                    this.bgCtx.stroke();
                });
                
                // Draw node
                this.bgCtx.beginPath();
                this.bgCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                this.bgCtx.fillStyle = 'rgba(16, 185, 129, 0.8)';
                this.bgCtx.fill();
                
                // Pulse effect
                const pulseRadius = node.radius + Math.sin(time * 3) * 3;
                this.bgCtx.beginPath();
                this.bgCtx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
                this.bgCtx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
                this.bgCtx.stroke();
            });
            
            // Logo networked
            this.drawSacredLogo(time, 1);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Sound: Network connection tones
        this.playNetworkSounds();
    }
    
    async phaseUnity() {
        this.animateNetwork = false;
        this.animateUnity = true;
        
        const particles = [];
        for (let i = 0; i < 200; i++) {
            particles.push({
                x: Math.random() * this.bgCanvas.width,
                y: Math.random() * this.bgCanvas.height,
                vx: 0,
                vy: 0,
                color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`
            });
        }
        
        const animate = () => {
            if (!this.animateUnity) return;
            
            this.bgCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            
            const centerX = this.bgCanvas.width / 2;
            const centerY = this.bgCanvas.height / 2;
            const time = Date.now() * 0.001;
            
            // Unity spiral
            particles.forEach((p, i) => {
                // Spiral toward center
                const dx = centerX - p.x;
                const dy = centerY - p.y;
                const dist = Math.hypot(dx, dy);
                
                if (dist > 10) {
                    p.vx += (dx / dist) * 0.5;
                    p.vy += (dy / dist) * 0.5;
                    
                    // Add spiral motion
                    const angle = Math.atan2(dy, dx) + 0.1;
                    p.vx += Math.cos(angle) * 0.2;
                    p.vy += Math.sin(angle) * 0.2;
                } else {
                    // Orbit center
                    const orbitAngle = time + (i / particles.length) * Math.PI * 2;
                    p.x = centerX + Math.cos(orbitAngle) * 50;
                    p.y = centerY + Math.sin(orbitAngle) * 50;
                }
                
                // Apply velocity with damping
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.95;
                p.vy *= 0.95;
                
                // Draw particle
                this.bgCtx.beginPath();
                this.bgCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                this.bgCtx.fillStyle = p.color;
                this.bgCtx.fill();
            });
            
            // Central unity symbol
            this.bgCtx.save();
            this.bgCtx.translate(centerX, centerY);
            this.bgCtx.rotate(time * 0.2);
            
            // Draw unity mandala
            for (let ring = 0; ring < 5; ring++) {
                const radius = 20 + ring * 20;
                this.bgCtx.beginPath();
                this.bgCtx.arc(0, 0, radius, 0, Math.PI * 2);
                this.bgCtx.strokeStyle = `rgba(255, 255, 255, ${0.5 - ring * 0.1})`;
                this.bgCtx.stroke();
            }
            
            this.bgCtx.restore();
            
            // Logo complete
            this.drawSacredLogo(time, 1);
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Sound: Harmonic convergence
        this.playUnityChord();
    }
    
    drawSacredLogo(time, opacity) {
        const ctx = this.logoCtx;
        const size = this.logoCanvas.width;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        
        // Outer ring
        ctx.beginPath();
        ctx.arc(center, center, center * 0.9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(107, 70, 193, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner sacred geometry
        ctx.translate(center, center);
        ctx.rotate(time * 0.05);
        
        // Triangle up
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * center * 0.6;
            const y = Math.sin(angle) * center * 0.6;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(236, 72, 153, ${opacity * 0.8})`;
        ctx.stroke();
        
        // Triangle down
        ctx.rotate(Math.PI);
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * center * 0.6;
            const y = Math.sin(angle) * center * 0.6;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(107, 70, 193, ${opacity * 0.8})`;
        ctx.stroke();
        
        // Center point
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
        
        ctx.restore();
    }
    
    // Sound generation methods
    playTone(frequency, volume, type = 'sine', duration = 1) {
        if (!this.audioContext || window.isMuted) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.value = volume;
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        osc.stop(this.audioContext.currentTime + duration);
    }
    
    playHeartbeat() {
        this.playTone(60, 0.1, 'sine', 0.1);
        setTimeout(() => this.playTone(60, 0.08, 'sine', 0.1), 100);
    }
    
    playHeartbeatStrong() {
        this.playTone(80, 0.15, 'sine', 0.15);
        setTimeout(() => this.playTone(60, 0.12, 'sine', 0.1), 150);
    }
    
    playBreathSound() {
        this.playTone(200, 0.05, 'sine', 2);
        this.playTone(250, 0.03, 'sine', 2);
    }
    
    playNeuralSounds() {
        setInterval(() => {
            if (this.animateNeural && Math.random() < 0.3) {
                const freq = 800 + Math.random() * 400;
                this.playTone(freq, 0.02, 'sine', 0.05);
            }
        }, 100);
    }
    
    playCrystallineTones() {
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.05, 'sine', 1), i * 200);
        });
    }
    
    playGlyphActivation() {
        const freq = 440 + Math.random() * 440;
        this.playTone(freq, 0.1, 'triangle', 0.3);
    }
    
    playNetworkSounds() {
        this.playTone(440, 0.03, 'square', 0.1);
        this.playTone(880, 0.02, 'square', 0.1);
    }
    
    playUnityChord() {
        // Major chord with harmonics
        const root = 261.63; // C4
        this.playTone(root, 0.1, 'sine', 3);
        this.playTone(root * 1.25, 0.08, 'sine', 3); // E
        this.playTone(root * 1.5, 0.06, 'sine', 3); // G
        this.playTone(root * 2, 0.04, 'sine', 3); // C5
    }
    
    async completeboot() {
        // Stop all animations
        this.animateUnity = false;
        
        // Fade out
        this.container.style.transition = 'opacity 2s ease';
        this.container.style.opacity = '0';
        
        await this.sleep(2000);
        
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

// Initialize boot sequence
window.sacredBootSequence = new SacredBootSequence();

// Skip function
window.skipBootSequence = function() {
    if (window.sacredBootSequence) {
        window.sacredBootSequence.completeboot();
    }
};

// Auto-start on load
window.addEventListener('load', () => {
    if (window.sacredBootSequence) {
        window.sacredBootSequence.start();
    }
});