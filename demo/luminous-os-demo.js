/**
 * LuminousOS Demo - Complete Consciousness Operating System Experience
 * 
 * Integrates:
 * - Sacred Boot Sequence
 * - Mandala UI with breathing coherence orb
 * - 87 Glyphs as applications
 * - Luminous Stack network visualization
 * - Sacred AI Suite integration
 * - Alchemical Engine for system healing
 */

// Global state
const state = {
    coherence: {
        personal: 0.7,
        network: 0.85,
        field: 0.6
    },
    breathPhase: 0,
    heartRate: 70,
    selectedGlyph: null,
    networkPackets: 0,
    activeConnections: new Set(),
    bootPhase: 0,
    fieldMomentum: 0.5,
    biometricsConnected: false
};

// Global biometric integration
let biometrics = null;

// Use complete glyph library if available, otherwise use demo set
const SACRED_GLYPHS = window.getAllGlyphs ? window.getAllGlyphs().slice(0, 12) : [
    { id: 'Ω0', name: 'First Presence', description: 'The practice of arriving fully present', coherenceRequired: 0.6 },
    { id: 'Ω1', name: 'Root Chord of Covenant', description: 'The sacred yes that creates connection', coherenceRequired: 0.7 },
    { id: 'Ω2', name: 'Breath of Invitation', description: 'Creating safe space through gentle invitation', coherenceRequired: 0.5 },
    { id: 'Ω3', name: 'Trust Emergence', description: 'Allowing trust to grow naturally', coherenceRequired: 0.65 },
    { id: 'Ω4', name: 'Fractal Reconciliation', description: 'The pulse of repair and healing', coherenceRequired: 0.75 },
    { id: 'Ω5', name: 'Coherent Field Maintenance', description: 'Sustaining connection across time', coherenceRequired: 0.8 },
    { id: 'Ω6', name: 'Mutual Recognition', description: 'Seeing and being seen', coherenceRequired: 0.6 },
    { id: 'Ω7', name: 'Mutual Becoming', description: 'Growing together in relationship', coherenceRequired: 0.7 },
    { id: 'Ω8', name: 'Inner Coherence', description: 'Aligning all parts of self', coherenceRequired: 0.55 },
    { id: '🍄', name: 'Mycelial Data', description: 'Access the living filesystem', coherenceRequired: 0.5 }
];

// Make full library available globally
if (window.getAllGlyphs) {
    window.SACRED_GLYPHS = SACRED_GLYPHS;
    window.ALL_GLYPHS = window.getAllGlyphs();
}

// Boot Sequence
async function startBootSequence() {
    const phases = [
        { id: 'phase-stillness', duration: 3000, message: 'Entering stillness...' },
        { id: 'phase-breath', duration: 4000, message: 'Synchronizing breath...' },
        { id: 'phase-heartbeat', duration: 3000, message: 'Aligning with heartbeat...' },
        { id: 'phase-mandala', duration: 3000, message: 'Sacred geometry emerging...' },
        { id: 'phase-glyphs', duration: 2000, message: 'Awakening glyphs...' },
        { id: 'phase-field', duration: 2000, message: 'Establishing field...' }
    ];

    for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        
        // Hide previous phase
        if (i > 0) {
            document.getElementById(phases[i-1].id).classList.remove('active');
        }
        
        // Show current phase
        document.getElementById(phase.id).classList.add('active');
        
        // Update state
        state.bootPhase = i + 1;
        
        // Wait for phase duration
        await sleep(phase.duration);
    }

    // Complete boot sequence
    document.getElementById('bootSequence').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('bootSequence').style.display = 'none';
        document.getElementById('mainOS').style.display = 'block';
        initializeOS();
    }, 2000);
}

// Initialize main OS
function initializeOS() {
    // Create glyph ring
    createGlyphRing();
    
    // Initialize canvas for advanced graphics
    initializeMandalaCanvas();
    
    // Start coherence breathing
    startCoherenceBreathing();
    
    // Connect to Luminous Network (simulated)
    connectToLuminousNetwork();
    
    // Start field momentum
    startFieldMomentum();
    
    // Initialize Sacred AI Suite
    initializeSacredAI();
    
    // Initialize biometric integration
    initializeBiometrics();
    
    // Start live data updates
    setInterval(updateMetrics, 1000);
    
    showMessage('Welcome to LuminousOS - Your consciousness is the interface');
}

// Create the ring of glyphs
function createGlyphRing() {
    const ring = document.getElementById('glyphRing');
    const glyphCount = 12; // Show first 12 glyphs in main ring
    const radius = 200;
    
    for (let i = 0; i < glyphCount; i++) {
        const angle = (i / glyphCount) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * radius + 200;
        const y = Math.sin(angle) * radius + 200;
        
        const glyph = document.createElement('div');
        glyph.className = 'glyph';
        glyph.style.left = x - 30 + 'px';
        glyph.style.top = y - 30 + 'px';
        glyph.innerHTML = SACRED_GLYPHS[i % SACRED_GLYPHS.length].id;
        glyph.onclick = () => selectGlyph(SACRED_GLYPHS[i % SACRED_GLYPHS.length]);
        
        ring.appendChild(glyph);
    }
}

// Initialize Mandala Canvas for WebGL/advanced graphics
function initializeMandalaCanvas() {
    const canvas = document.getElementById('mandalaCanvas');
    
    console.log('Initializing Mandala Canvas:', canvas);
    console.log('Canvas offset dimensions:', canvas.offsetWidth, canvas.offsetHeight);
    
    // Set canvas size
    canvas.width = canvas.offsetWidth || 800;
    canvas.height = canvas.offsetHeight || 800;
    
    console.log('Canvas dimensions set to:', canvas.width, canvas.height);
    
    // Try 3D first, then WebGL, fallback to 2D
    let geometryEngine;
    let useWebGL = false;
    let use3D = false;
    
    // Check if Three.js and 3D engine are available
    if (window.THREE && window.SacredGeometry3D) {
        try {
            geometryEngine = new SacredGeometry3D(canvas);
            use3D = true;
            console.log('🌟 3D Sacred Geometry initialized');
        } catch (e) {
            console.log('3D initialization failed, trying WebGL:', e);
        }
    }
    
    // Fallback to WebGL if 3D failed
    if (!use3D && window.SacredGeometryWebGL) {
        geometryEngine = new SacredGeometryWebGL(canvas);
        // Check if WebGL initialized successfully
        if (geometryEngine.gl) {
            useWebGL = true;
            console.log('🌟 WebGL Sacred Geometry initialized');
        } else {
            // Fallback to 2D
            geometryEngine = new SacredGeometryEngine(canvas);
            console.log('📐 Falling back to Canvas 2D');
        }
    } else if (!use3D) {
        // Use 2D if neither 3D nor WebGL are available
        geometryEngine = new SacredGeometryEngine(canvas);
    }
    
    // Store engine globally for coherence updates
    window.sacredGeometryEngine = geometryEngine;
    
    // Create particle system for 2D fallback
    const particles = [];
    const maxParticles = 50;
    
    // Animation loop
    function animate() {
        // Update coherence
        const avgCoherence = (state.coherence.personal + state.coherence.network + state.coherence.field) / 3;
        
        if (use3D) {
            // 3D engine handles its own animation
            geometryEngine.update(avgCoherence);
            geometryEngine.render();
            requestAnimationFrame(animate);
        } else if (useWebGL) {
            // WebGL handles its own render loop
            geometryEngine.setCoherence(avgCoherence);
        } else {
            // 2D Canvas rendering
            geometryEngine.update(avgCoherence, state);
            geometryEngine.render();
            
            // Particle system for 2D
            if (particles.length < maxParticles && Math.random() < 0.1 * avgCoherence) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 200 + 100;
                particles.push(new SacredParticle(
                    canvas.width / 2 + Math.cos(angle) * radius,
                    canvas.height / 2 + Math.sin(angle) * radius,
                    avgCoherence
                ));
            }
            
            // Update and draw particles
            const ctx = canvas.getContext('2d');
            particles.forEach((particle, index) => {
                particle.update(canvas.width / 2, canvas.height / 2, avgCoherence);
                particle.draw(ctx);
                
                if (particle.life <= 0) {
                    particles.splice(index, 1);
                }
            });
            
            requestAnimationFrame(animate);
        }
    }
    
    // Start animation for 3D or 2D
    if (use3D || !useWebGL) {
        animate();
    }
    
    // Also initialize enhanced geometry if available
    if (window.initializeEnhancedGeometry) {
        setTimeout(() => {
            window.initializeEnhancedGeometry();
        }, 100);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        if (use3D || useWebGL) {
            geometryEngine.resize(canvas.width, canvas.height);
        }
    });
}

// Coherence breathing animation
function startCoherenceBreathing() {
    function breathe() {
        // 4 seconds in, 6 seconds out
        const breathCycle = 10000; // 10 seconds total
        const time = Date.now() % breathCycle;
        const phase = time / breathCycle;
        
        // Calculate breath phase (0-1)
        let breathIntensity;
        if (phase < 0.4) {
            // Inhale (4 seconds)
            breathIntensity = phase / 0.4;
        } else {
            // Exhale (6 seconds)
            breathIntensity = 1 - (phase - 0.4) / 0.6;
        }
        
        // Update coherence orb
        const orb = document.querySelector('.coherence-orb');
        const scale = 1 + breathIntensity * 0.2;
        const brightness = 0.8 + breathIntensity * 0.4;
        
        orb.style.transform = `translate(-50%, -50%) scale(${scale})`;
        orb.style.filter = `brightness(${brightness})`;
        
        // Update personal coherence based on breath alignment
        if (Math.random() < 0.1) {
            state.coherence.personal = Math.min(1, state.coherence.personal + 0.01);
            updateMetrics();
        }
        
        requestAnimationFrame(breathe);
    }
    
    breathe();
}

// Simulate Luminous Network connection
function connectToLuminousNetwork() {
    // Simulate packet flow
    setInterval(() => {
        state.networkPackets++;
        document.getElementById('packetCount').textContent = state.networkPackets;
        
        // Occasionally update network coherence
        if (Math.random() < 0.2) {
            state.coherence.network = 0.7 + Math.random() * 0.3;
            updateMetrics();
        }
    }, 2000);
    
    // Simulate router coherence updates
    setInterval(() => {
        const routerCoherence = (85 + Math.random() * 15).toFixed(0);
        document.getElementById('routerCoherence').textContent = routerCoherence + '%';
    }, 11000); // Every 11 seconds (sacred timing)
}

// Field momentum affects glyph ring rotation
function startFieldMomentum() {
    const ring = document.getElementById('glyphRing');
    let rotation = 0;
    
    function updateMomentum() {
        // Field momentum based on collective coherence
        const avgCoherence = (state.coherence.personal + state.coherence.network + state.coherence.field) / 3;
        state.fieldMomentum = avgCoherence;
        
        // Update rotation speed
        rotation += state.fieldMomentum * 0.5;
        ring.style.animation = `rotate ${60 / state.fieldMomentum}s linear infinite`;
        
        // Update field coherence
        if (Math.random() < 0.1) {
            state.coherence.field = Math.max(0.3, Math.min(1, 
                state.coherence.field + (Math.random() - 0.5) * 0.1
            ));
            updateMetrics();
        }
        
        setTimeout(updateMomentum, 3000);
    }
    
    updateMomentum();
}

// Initialize Sacred AI Suite integration
function initializeSacredAI() {
    // These would connect to our Sacred AI tools
    const sacredAI = {
        morningPractice: () => showMessage('Morning practice: Begin with Ω0 - First Presence'),
        shadowWork: () => showMessage('Shadow pattern detected. Engaging healing protocol...'),
        consciousnessTracker: () => showMessage(`Consciousness evolution: +${(Math.random() * 5).toFixed(1)}%`),
        sacredCouncil: () => showMessage('Sacred Council convening for collective wisdom...'),
        alchemicalEngine: () => showMessage('Transmuting system dissonance into coherence...')
    };
    
    // Periodically trigger AI insights
    setInterval(() => {
        const actions = Object.values(sacredAI);
        if (Math.random() < 0.1) {
            actions[Math.floor(Math.random() * actions.length)]();
        }
    }, 20000);
}

// Glyph selection
function selectGlyph(glyph) {
    state.selectedGlyph = glyph;
    
    // Check coherence requirement
    if (state.coherence.personal >= glyph.coherenceRequired) {
        // Announce to network if connected
        if (window.networkIntegration && window.networkIntegration.activateGlyphNetwork) {
            window.networkIntegration.activateGlyphNetwork(glyph);
        }
        openPracticeChaber(glyph);
    } else {
        showMessage(`Requires ${(glyph.coherenceRequired * 100).toFixed(0)}% coherence. Current: ${(state.coherence.personal * 100).toFixed(0)}%`);
    }
}

// Open practice chamber for glyph
function openPracticeChaber(glyph) {
    // Special handling for Mycelial Filesystem
    if (glyph.id === '🍄') {
        openMycelialFilesystem();
        return;
    }
    
    const chamber = document.getElementById('practiceChaber');
    document.getElementById('glyphName').textContent = `${glyph.id} - ${glyph.name}`;
    document.getElementById('glyphDescription').textContent = glyph.description;
    document.getElementById('requiredCoherence').textContent = `${(glyph.coherenceRequired * 100).toFixed(0)}%`;
    document.getElementById('currentCoherence').textContent = `${(state.coherence.personal * 100).toFixed(0)}%`;
    
    chamber.style.display = 'flex';
}

// Open Mycelial Filesystem view
function openMycelialFilesystem() {
    showMessage('Opening Mycelial Filesystem...');
    
    // Create modal for filesystem
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 1000;
        display: flex;
        flex-direction: column;
    `;
    
    // Header with close button
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.8);
    `;
    header.innerHTML = `
        <h2 style="margin: 0; color: #fff;">🍄 Mycelial Filesystem</h2>
        <button onclick="closeMycelialFilesystem()" style="
            background: transparent;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
        ">Close</button>
    `;
    
    // Canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
        flex: 1;
        position: relative;
        overflow: hidden;
    `;
    
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80; // Account for header
    canvasContainer.appendChild(canvas);
    
    modal.appendChild(header);
    modal.appendChild(canvasContainer);
    document.body.appendChild(modal);
    
    // Initialize filesystem
    const filesystem = new MycelialFilesystem(canvas);
    filesystem.setCoherence(state.coherence.personal);
    
    // Store reference for cleanup
    window.currentMycelialModal = modal;
    window.currentMycelialFilesystem = filesystem;
}

// Close Mycelial Filesystem
function closeMycelialFilesystem() {
    if (window.currentMycelialModal) {
        window.currentMycelialModal.remove();
        window.currentMycelialModal = null;
        window.currentMycelialFilesystem = null;
    }
}

// Enter glyph practice
function enterPractice() {
    if (!state.selectedGlyph) return;
    
    showMessage(`Entering ${state.selectedGlyph.name} practice vortex...`);
    
    // Simulate practice effects
    setTimeout(() => {
        state.coherence.personal = Math.min(1, state.coherence.personal + 0.05);
        updateMetrics();
        showMessage('Practice complete. Blessing received: "May your presence ripple through all realms"');
        closePractice();
    }, 3000);
}

// Close practice chamber
function closePractice() {
    document.getElementById('practiceChaber').style.display = 'none';
    state.selectedGlyph = null;
}

// Update coherence metrics display with live data
function updateMetrics() {
    // Simulate live data when offline
    if (!window.networkClient || !window.networkClient.connected) {
        const time = Date.now() * 0.001;
        const hour = new Date().getHours();
        
        // Time-based coherence patterns
        let timeBonus = 0;
        if (hour >= 5 && hour < 9) timeBonus = 0.1;
        else if (hour >= 21 || hour < 5) timeBonus = 0.15;
        
        state.coherence.personal = 0.7 + Math.sin(time * 0.5) * 0.1 + timeBonus;
        state.coherence.network = 0.5 + Math.sin(time * 0.3 + 1) * 0.15;
        state.coherence.field = 0.6 + Math.sin(time * 0.7 + 2) * 0.12 + timeBonus * 0.5;
        
        // Clamp values
        state.coherence.personal = Math.max(0, Math.min(1, state.coherence.personal));
        state.coherence.network = Math.max(0, Math.min(1, state.coherence.network));
        state.coherence.field = Math.max(0, Math.min(1, state.coherence.field));
    }
    
    // Personal coherence
    const personal = (state.coherence.personal * 100).toFixed(0);
    document.getElementById('personalCoherence').style.width = personal + '%';
    document.getElementById('personalValue').textContent = personal + '%';
    
    // Network coherence
    const network = (state.coherence.network * 100).toFixed(0);
    document.getElementById('networkCoherence').style.width = network + '%';
    document.getElementById('networkValue').textContent = network + '%';
    
    // Field coherence
    const field = (state.coherence.field * 100).toFixed(0);
    document.getElementById('fieldCoherence').style.width = field + '%';
    document.getElementById('fieldValue').textContent = field + '%';
    
    // Update other metrics
    document.getElementById('activeGlyphs').textContent = Math.floor(state.coherence.personal * 10);
    document.getElementById('networkNodes').textContent = 8 + Math.floor(state.coherence.network * 20);
    document.getElementById('fieldParticipants').textContent = 100 + Math.floor(state.coherence.field * 100);
}

// Show system messages
function showMessage(text) {
    const msg = document.getElementById('systemMessage');
    msg.textContent = text;
    msg.classList.add('show');
    
    setTimeout(() => {
        msg.classList.remove('show');
    }, 5000);
}

// Utility sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the OS
window.onload = () => {
    console.log('Window loaded, checking for boot sequence...');
    console.log('sacredBootSequence available:', !!window.sacredBootSequence);
    console.log('startBootSequence available:', !!window.startBootSequence);
    
    // Use new sacred boot sequence if available
    if (window.sacredBootSequence) {
        console.log('Starting enhanced sacred boot sequence...');
        window.sacredBootSequence.start();
    } else if (window.startBootSequence) {
        console.log('Starting regular boot sequence...');
        startBootSequence();
    } else {
        console.error('No boot sequence found!');
        // Skip boot and show OS directly
        document.getElementById('bootSequence').style.display = 'none';
        document.getElementById('mainOS').style.display = 'block';
        initializeOS();
    }
};

// Initialize biometric integration
function initializeBiometrics() {
    if (window.BiometricIntegration) {
        biometrics = new BiometricIntegration();
        
        // Add listener for biometric updates
        biometrics.addListener((data) => {
            // Update UI elements
            document.getElementById('biometricHR').textContent = data.heartRate;
            document.getElementById('biometricHRV').textContent = Math.round(data.hrv);
            document.getElementById('biometricBreath').textContent = data.breathRate.toFixed(1);
            
            // Update system coherence based on real biometrics
            if (state.biometricsConnected) {
                state.coherence.personal = data.coherence;
                state.breathPhase = data.breathPhase;
                state.heartRate = data.heartRate;
                updateMetrics();
                
                // Update WebGL coherence if available
                if (window.sacredGeometryEngine && window.sacredGeometryEngine.setCoherence) {
                    window.sacredGeometryEngine.setCoherence(data.coherence);
                }
            }
        });
        
        // Auto-start with simulated data
        biometrics.initialize();
        document.getElementById('biometricStatus').textContent = 'Simulated';
    }
}

// Connect biometrics button handler
async function connectBiometrics() {
    if (!biometrics) return;
    
    // Show options dialog
    const choice = confirm(
        'Choose biometric input:\n\n' +
        'OK = Bluetooth HRV Sensor\n' +
        'Cancel = Camera Pulse Detection\n\n' +
        '(You can also use the full biometric dashboard for more options)'
    );
    
    let connected = false;
    
    if (choice) {
        // Try Bluetooth
        connected = await biometrics.connectBluetoothHRV();
        if (connected) {
            document.getElementById('biometricStatus').textContent = 'Bluetooth Connected';
        }
    } else {
        // Try Camera
        connected = await biometrics.startCameraPulseDetection();
        if (connected) {
            document.getElementById('biometricStatus').textContent = 'Camera Active';
        }
    }
    
    if (connected) {
        state.biometricsConnected = true;
        showMessage('Biometrics connected - Your coherence now drives the system');
    } else {
        showMessage('Could not connect biometrics - using simulated data');
    }
}

// Make functions globally available
window.enterPractice = enterPractice;
window.closePractice = closePractice;
window.connectBiometrics = connectBiometrics;
window.closeMycelialFilesystem = closeMycelialFilesystem;
window.toggleNetwork = () => window.networkIntegration?.toggleNetwork();
window.toggleNetworkView = () => window.networkIntegration?.toggleNetworkView();
window.closeNetworkView = () => window.networkIntegration?.closeNetworkView();
window.state = state; // Expose state for network integration
window.showMessage = showMessage;
window.updateMetrics = updateMetrics;
window.getGlyphsByCoherence = (coherence) => {
    if (window.getAllGlyphs) {
        return window.getAllGlyphs().filter(g => !g.coherenceRequired || coherence >= g.coherenceRequired);
    }
    return SACRED_GLYPHS.filter(g => !g.coherenceRequired || coherence >= g.coherenceRequired);
};
window.getGlyphById = (id) => {
    if (window.getAllGlyphs) {
        return window.getAllGlyphs().find(g => g.id === id);
    }
    return SACRED_GLYPHS.find(g => g.id === id);
};