/**
 * Advanced Consciousness Features for LuminousOS
 * 
 * Implements:
 * - Binaural beat generation with sacred frequencies
 * - Living mandalas responsive to breath
 * - Group coherence ceremonies
 * - Consciousness data visualization dashboard
 */

class AdvancedConsciousness {
    constructor() {
        this.breathResponsiveGeometry = null;
        this.groupCoherenceSession = null;
        this.dataVisualizer = null;
        this.ceremonyActive = false;
        
        this.initialize();
    }
    
    initialize() {
        // Initialize breath-responsive sacred geometry
        this.initializeBreathGeometry();
        
        // Initialize group coherence system
        this.initializeGroupCoherence();
        
        // Initialize consciousness data visualizer
        this.initializeDataVisualizer();
        
        console.log('🌌 Advanced Consciousness Features initialized');
    }
    
    initializeBreathGeometry() {
        // Create living mandala system
        this.breathResponsiveGeometry = {
            canvas: null,
            ctx: null,
            breathPhase: 0,
            coherence: 0.7,
            heartRate: 70,
            patterns: [],
            animationId: null
        };
        
        // Sacred geometry patterns that respond to breath
        this.sacredPatterns = {
            flowerOfLife: {
                circles: 19,
                baseRadius: 50,
                breathScale: 0.3,
                rotationSpeed: 0.001
            },
            merkaba: {
                vertices: 8,
                edges: 12,
                breathPulse: 0.2,
                spinSpeed: 0.002
            },
            toroid: {
                rings: 36,
                points: 18,
                breathFlow: 0.4,
                fieldStrength: 1.0
            },
            fibonacci: {
                spirals: 8,
                growth: 1.618,
                breathExpansion: 0.3,
                pulseRate: 0.003
            }
        };
    }
    
    createBreathCanvas(container) {
        // Create canvas for breath-responsive geometry
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '10';
        container.appendChild(canvas);
        
        this.breathResponsiveGeometry.canvas = canvas;
        this.breathResponsiveGeometry.ctx = canvas.getContext('2d');
        
        // Start animation
        this.startBreathAnimation();
    }
    
    startBreathAnimation() {
        const geo = this.breathResponsiveGeometry;
        const ctx = geo.ctx;
        const canvas = geo.canvas;
        
        const animate = () => {
            // Clear with fade effect
            ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Update breath phase from biometrics or simulate
            if (window.biometrics?.biometricData) {
                geo.breathPhase = window.biometrics.biometricData.breathPhase;
                geo.coherence = window.biometrics.biometricData.coherence;
                geo.heartRate = window.biometrics.biometricData.heartRate;
            } else {
                // Simulate breath: 4 seconds in, 6 seconds out
                const time = Date.now() / 1000;
                const breathCycle = 10; // 10 seconds total
                const phase = (time % breathCycle) / breathCycle;
                geo.breathPhase = phase < 0.4 ? phase / 0.4 : 1 - (phase - 0.4) / 0.6;
            }
            
            // Draw active pattern based on coherence level
            if (geo.coherence > 0.8) {
                this.drawMerkaba(ctx, canvas.width / 2, canvas.height / 2, geo.breathPhase);
            } else if (geo.coherence > 0.6) {
                this.drawFlowerOfLife(ctx, canvas.width / 2, canvas.height / 2, geo.breathPhase);
            } else {
                this.drawFibonacciSpiral(ctx, canvas.width / 2, canvas.height / 2, geo.breathPhase);
            }
            
            // Add heart pulse overlay
            this.drawHeartPulse(ctx, canvas.width, canvas.height, geo.heartRate);
            
            geo.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    drawFlowerOfLife(ctx, cx, cy, breathPhase) {
        const pattern = this.sacredPatterns.flowerOfLife;
        const radius = pattern.baseRadius * (1 + breathPhase * pattern.breathScale);
        const rotation = Date.now() * pattern.rotationSpeed;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        
        // Central circle
        ctx.strokeStyle = `rgba(107, 70, 193, ${0.3 + breathPhase * 0.5})`;
        ctx.lineWidth = 1 + breathPhase;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Surrounding circles
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Second ring
            for (let j = 0; j < 6; j++) {
                const angle2 = angle + (j / 6) * Math.PI * 2;
                const x2 = x + Math.cos(angle2) * radius;
                const y2 = y + Math.sin(angle2) * radius;
                
                ctx.globalAlpha = 0.3 + breathPhase * 0.3;
                ctx.beginPath();
                ctx.arc(x2, y2, radius * 0.5, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
    
    drawMerkaba(ctx, cx, cy, breathPhase) {
        const pattern = this.sacredPatterns.merkaba;
        const size = 100 * (1 + breathPhase * pattern.breathPulse);
        const rotation = Date.now() * pattern.spinSpeed;
        
        ctx.save();
        ctx.translate(cx, cy);
        
        // Draw two interlocking tetrahedrons
        ctx.strokeStyle = `rgba(236, 72, 153, ${0.5 + breathPhase * 0.5})`;
        ctx.lineWidth = 2;
        
        // Upper tetrahedron
        ctx.save();
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.866, size * 0.5);
        ctx.lineTo(-size * 0.866, size * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        
        // Lower tetrahedron
        ctx.save();
        ctx.rotate(-rotation);
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(size * 0.866, -size * 0.5);
        ctx.lineTo(-size * 0.866, -size * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        
        // Energy field
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
        gradient.addColorStop(0, `rgba(236, 72, 153, ${breathPhase * 0.3})`);
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(-size * 2, -size * 2, size * 4, size * 4);
        
        ctx.restore();
    }
    
    drawFibonacciSpiral(ctx, cx, cy, breathPhase) {
        const pattern = this.sacredPatterns.fibonacci;
        const scale = 1 + breathPhase * pattern.breathExpansion;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Date.now() * pattern.pulseRate);
        
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.4 + breathPhase * 0.4})`;
        ctx.lineWidth = 1.5;
        
        // Draw Fibonacci spiral
        ctx.beginPath();
        let a = 0, b = 1;
        let angle = 0;
        
        for (let i = 0; i < 100; i++) {
            const radius = b * scale;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Fibonacci sequence
            const temp = a + b;
            a = b;
            b = temp;
            angle += 0.1;
            
            // Limit spiral size
            if (radius > 200) break;
        }
        
        ctx.stroke();
        ctx.restore();
    }
    
    drawHeartPulse(ctx, width, height, heartRate) {
        // Draw subtle heart pulse indicator
        const pulsePhase = (Date.now() % (60000 / heartRate)) / (60000 / heartRate);
        const pulseSize = 10 + pulsePhase * 5;
        
        ctx.save();
        ctx.globalAlpha = 0.3 * (1 - pulsePhase);
        
        const gradient = ctx.createRadialGradient(
            width - 50, 50, 0,
            width - 50, 50, pulseSize
        );
        gradient.addColorStop(0, '#EC4899');
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(width - 50, 50, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Group Coherence Ceremony System
    
    initializeGroupCoherence() {
        this.groupCoherenceSession = {
            active: false,
            participants: new Map(),
            sharedField: null,
            ceremonyType: null,
            startTime: null,
            targetCoherence: 0.8,
            ritualPhase: 'gathering'
        };
    }
    
    async startGroupCeremony(type = 'heart-sync', targetCoherence = 0.8) {
        if (this.ceremonyActive) {
            console.log('Ceremony already in progress');
            return;
        }
        
        this.ceremonyActive = true;
        this.groupCoherenceSession.ceremonyType = type;
        this.groupCoherenceSession.targetCoherence = targetCoherence;
        this.groupCoherenceSession.startTime = Date.now();
        
        // Announce ceremony to network
        if (window.networkClient?.connected) {
            window.networkClient.send({
                type: 'ceremony_invitation',
                ceremonyType: type,
                targetCoherence: targetCoherence,
                host: window.networkClient.nodeId,
                timestamp: Date.now()
            });
        }
        
        // Initialize ceremony based on type
        switch (type) {
            case 'heart-sync':
                await this.initializeHeartSync();
                break;
            case 'breath-wave':
                await this.initializeBreathWave();
                break;
            case 'field-weaving':
                await this.initializeFieldWeaving();
                break;
            case 'collective-healing':
                await this.initializeCollectiveHealing();
                break;
        }
        
        // Start ceremony phases
        this.runCeremonyPhases();
    }
    
    async initializeHeartSync() {
        // Heart synchronization ceremony
        console.log('💓 Initiating Heart Sync Ceremony');
        
        // Play heartbeat rhythm
        if (window.sacredAI?.startBinauralBeat) {
            window.sacredAI.startBinauralBeat('love'); // 528 Hz
        }
        
        // Visual cue
        if (window.showMessage) {
            window.showMessage('💓 Heart Sync Ceremony beginning... Breathe with the rhythm');
        }
        
        // Set up heart coherence tracking
        this.groupCoherenceSession.sharedField = {
            averageHeartRate: 70,
            coherenceLevel: 0.5,
            syncScore: 0
        };
    }
    
    async initializeBreathWave() {
        // Collective breathing ceremony
        console.log('🌊 Initiating Breath Wave Ceremony');
        
        // Guide breathing pattern: 4-7-8
        this.breathPattern = {
            inhale: 4,
            hold: 7,
            exhale: 8,
            phase: 'inhale',
            startTime: Date.now()
        };
        
        // Visual breathing guide
        this.createBreathingGuide();
    }
    
    async initializeFieldWeaving() {
        // Consciousness field weaving
        console.log('🕸️ Initiating Field Weaving Ceremony');
        
        // Create shared intention field
        this.groupCoherenceSession.sharedField = {
            intention: 'Weaving unified consciousness',
            threads: new Map(),
            pattern: 'sacred-web'
        };
    }
    
    async initializeCollectiveHealing() {
        // Group healing ceremony
        console.log('🌟 Initiating Collective Healing Ceremony');
        
        // Activate Alchemical Engine in group mode
        if (window.sacredAI) {
            const alchemy = await window.sacredAI.activateAlchemicalEngine();
            this.groupCoherenceSession.sharedField = {
                healingFrequency: alchemy.antidote?.frequency || 528,
                healingPattern: 'spiral',
                participants: new Map()
            };
        }
    }
    
    async runCeremonyPhases() {
        const phases = [
            { name: 'gathering', duration: 30000, message: 'Gathering the circle...' },
            { name: 'attunement', duration: 60000, message: 'Attuning to shared field...' },
            { name: 'deepening', duration: 120000, message: 'Deepening into unity...' },
            { name: 'peak', duration: 60000, message: 'Peak coherence achieved!' },
            { name: 'integration', duration: 30000, message: 'Integrating the experience...' },
            { name: 'closing', duration: 20000, message: 'Closing sacred space...' }
        ];
        
        for (const phase of phases) {
            this.groupCoherenceSession.ritualPhase = phase.name;
            
            if (window.showMessage) {
                window.showMessage(`🕊️ ${phase.message}`);
            }
            
            // Update ceremony based on phase
            this.updateCeremonyPhase(phase.name);
            
            // Wait for phase duration
            await new Promise(resolve => setTimeout(resolve, phase.duration));
            
            // Check if ceremony was cancelled
            if (!this.ceremonyActive) break;
        }
        
        // Complete ceremony
        this.completeCeremony();
    }
    
    updateCeremonyPhase(phaseName) {
        // Update visuals and audio based on ceremony phase
        switch (phaseName) {
            case 'gathering':
                // Gentle invitation energy
                this.updateFieldIntensity(0.3);
                break;
            case 'attunement':
                // Synchronizing rhythms
                this.updateFieldIntensity(0.5);
                this.syncParticipantRhythms();
                break;
            case 'deepening':
                // Increasing coherence
                this.updateFieldIntensity(0.7);
                break;
            case 'peak':
                // Maximum coherence
                this.updateFieldIntensity(1.0);
                this.activatePeakEffects();
                break;
            case 'integration':
                // Gentle decrease
                this.updateFieldIntensity(0.6);
                break;
            case 'closing':
                // Return to baseline
                this.updateFieldIntensity(0.3);
                break;
        }
    }
    
    updateFieldIntensity(intensity) {
        // Update visual and audio intensity
        if (this.breathResponsiveGeometry) {
            this.breathResponsiveGeometry.coherence = intensity;
        }
        
        // Adjust binaural beat volume
        if (window.sacredAI?.binauralGenerator?.leftGain) {
            const volume = intensity * 0.3;
            window.sacredAI.binauralGenerator.leftGain.gain.value = volume;
            window.sacredAI.binauralGenerator.rightGain.gain.value = volume;
        }
    }
    
    syncParticipantRhythms() {
        // Synchronize breathing and heart rhythms across participants
        if (window.networkClient?.connected) {
            window.networkClient.send({
                type: 'rhythm_sync',
                breathPhase: this.breathResponsiveGeometry?.breathPhase || 0.5,
                heartRate: window.biometrics?.biometricData?.heartRate || 70,
                coherence: window.state?.coherence?.personal || 0.7
            });
        }
    }
    
    activatePeakEffects() {
        // Special effects for peak coherence
        console.log('✨ Peak coherence achieved!');
        
        // Flash of unity
        if (this.breathResponsiveGeometry?.ctx) {
            const ctx = this.breathResponsiveGeometry.ctx;
            const canvas = this.breathResponsiveGeometry.canvas;
            
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
        
        // Play celebration tone
        if (window.sacredAI?.playHealingTone) {
            window.sacredAI.playHealingTone(963); // Unity frequency
        }
    }
    
    completeCeremony() {
        this.ceremonyActive = false;
        
        // Calculate ceremony results
        const duration = Date.now() - this.groupCoherenceSession.startTime;
        const participants = this.groupCoherenceSession.participants.size;
        const averageCoherence = this.calculateAverageCoherence();
        
        // Show results
        if (window.showMessage) {
            window.showMessage(
                `🎉 Ceremony complete! ${participants} participants, ` +
                `${Math.round(averageCoherence * 100)}% average coherence`
            );
        }
        
        // Stop binaural beats
        if (window.sacredAI?.stopBinauralBeat) {
            window.sacredAI.stopBinauralBeat();
        }
        
        // Reset session
        this.groupCoherenceSession = {
            active: false,
            participants: new Map(),
            sharedField: null,
            ceremonyType: null,
            startTime: null
        };
    }
    
    calculateAverageCoherence() {
        let total = window.state?.coherence?.personal || 0.7;
        let count = 1;
        
        this.groupCoherenceSession.participants.forEach(participant => {
            total += participant.coherence;
            count++;
        });
        
        return total / count;
    }
    
    // Consciousness Data Visualization
    
    initializeDataVisualizer() {
        this.dataVisualizer = {
            canvas: null,
            ctx: null,
            data: {
                coherenceHistory: [],
                hrvHistory: [],
                networkHistory: [],
                glyphActivations: []
            },
            timeWindow: 300000, // 5 minutes
            updateInterval: 1000
        };
    }
    
    createDashboard(container) {
        // Create dashboard UI
        const dashboard = document.createElement('div');
        dashboard.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            font-family: monospace;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 20px;
        `;
        
        // Create visualization panels
        const panels = [
            { title: 'Coherence Timeline', type: 'coherence' },
            { title: 'HRV Patterns', type: 'hrv' },
            { title: 'Network Field', type: 'network' },
            { title: 'Glyph Activations', type: 'glyphs' }
        ];
        
        panels.forEach(panel => {
            const panelDiv = document.createElement('div');
            panelDiv.style.cssText = `
                background: rgba(107, 70, 193, 0.1);
                border: 1px solid rgba(107, 70, 193, 0.3);
                border-radius: 10px;
                padding: 15px;
                display: flex;
                flex-direction: column;
            `;
            
            const title = document.createElement('h3');
            title.textContent = panel.title;
            title.style.margin = '0 0 10px 0';
            panelDiv.appendChild(title);
            
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 200;
            canvas.id = `viz-${panel.type}`;
            panelDiv.appendChild(canvas);
            
            dashboard.appendChild(panelDiv);
        });
        
        container.appendChild(dashboard);
        
        // Start data collection and visualization
        this.startDataCollection();
        this.startVisualization();
    }
    
    startDataCollection() {
        setInterval(() => {
            const now = Date.now();
            
            // Collect coherence data
            this.dataVisualizer.data.coherenceHistory.push({
                time: now,
                personal: window.state?.coherence?.personal || 0.7,
                network: window.state?.coherence?.network || 0.85,
                field: window.state?.coherence?.field || 0.6
            });
            
            // Collect HRV data
            if (window.biometrics?.biometricData) {
                this.dataVisualizer.data.hrvHistory.push({
                    time: now,
                    hrv: window.biometrics.biometricData.hrv,
                    heartRate: window.biometrics.biometricData.heartRate
                });
            }
            
            // Collect network data
            if (window.networkClient?.connected) {
                const state = window.networkClient.getNetworkState();
                this.dataVisualizer.data.networkHistory.push({
                    time: now,
                    nodes: state.peerCount + 1,
                    coherence: state.networkCoherence
                });
            }
            
            // Trim old data
            const cutoff = now - this.dataVisualizer.timeWindow;
            Object.keys(this.dataVisualizer.data).forEach(key => {
                this.dataVisualizer.data[key] = this.dataVisualizer.data[key]
                    .filter(d => d.time > cutoff);
            });
        }, this.dataVisualizer.updateInterval);
    }
    
    startVisualization() {
        const visualize = () => {
            this.drawCoherenceTimeline();
            this.drawHRVPatterns();
            this.drawNetworkField();
            this.drawGlyphActivations();
            
            requestAnimationFrame(visualize);
        };
        
        visualize();
    }
    
    drawCoherenceTimeline() {
        const canvas = document.getElementById('viz-coherence');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.dataVisualizer.data.coherenceHistory;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (data.length < 2) return;
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
            const y = (i / 10) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw coherence lines
        const types = ['personal', 'network', 'field'];
        const colors = ['#6B46C1', '#EC4899', '#10B981'];
        
        types.forEach((type, index) => {
            ctx.strokeStyle = colors[index];
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            data.forEach((point, i) => {
                const x = (i / (data.length - 1)) * canvas.width;
                const y = canvas.height - (point[type] * canvas.height);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        });
        
        // Legend
        ctx.font = '12px monospace';
        types.forEach((type, index) => {
            ctx.fillStyle = colors[index];
            ctx.fillText(type, 10, 20 + index * 15);
        });
    }
    
    drawHRVPatterns() {
        const canvas = document.getElementById('viz-hrv');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.dataVisualizer.data.hrvHistory;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (data.length < 2) return;
        
        // Draw HRV wave
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, i) => {
            const x = (i / (data.length - 1)) * canvas.width;
            const y = canvas.height / 2 - (point.hrv - 50) * 2;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Current HRV value
        if (data.length > 0) {
            const current = data[data.length - 1];
            ctx.fillStyle = '#EC4899';
            ctx.font = '16px monospace';
            ctx.fillText(`HRV: ${Math.round(current.hrv)}ms`, 10, 30);
            ctx.fillText(`HR: ${current.heartRate}bpm`, 10, 50);
        }
    }
    
    drawNetworkField() {
        const canvas = document.getElementById('viz-network');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw network nodes visualization
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Current network state
        const nodes = window.networkClient?.getNetworkState()?.sharedField || new Map();
        
        // Draw field background
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, 100
        );
        gradient.addColorStop(0, 'rgba(107, 70, 193, 0.3)');
        gradient.addColorStop(1, 'rgba(107, 70, 193, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw nodes
        let nodeIndex = 0;
        nodes.forEach((node, nodeId) => {
            const angle = (nodeIndex / nodes.size) * Math.PI * 2;
            const radius = 60;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Node glow
            const nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
            nodeGradient.addColorStop(0, node.color || '#6B46C1');
            nodeGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = nodeGradient;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Node core
            ctx.fillStyle = node.color || '#6B46C1';
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
            
            nodeIndex++;
        });
        
        // Network stats
        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.fillText(`Nodes: ${nodes.size}`, 10, 20);
    }
    
    drawGlyphActivations() {
        const canvas = document.getElementById('viz-glyphs');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw recent glyph activations
        const glyphs = this.dataVisualizer.data.glyphActivations.slice(-10);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px monospace';
        
        glyphs.forEach((activation, i) => {
            const y = 30 + i * 18;
            const age = Date.now() - activation.time;
            const opacity = Math.max(0.3, 1 - age / 60000);
            
            ctx.globalAlpha = opacity;
            ctx.fillText(
                `${activation.glyph} - ${activation.user}`,
                10, y
            );
        });
        
        ctx.globalAlpha = 1;
    }
    
    // Public methods
    
    recordGlyphActivation(glyphId, userId = 'local') {
        this.dataVisualizer.data.glyphActivations.push({
            time: Date.now(),
            glyph: glyphId,
            user: userId
        });
    }
    
    stopBreathAnimation() {
        if (this.breathResponsiveGeometry.animationId) {
            cancelAnimationFrame(this.breathResponsiveGeometry.animationId);
        }
    }
}

// Export for use
window.AdvancedConsciousness = AdvancedConsciousness;