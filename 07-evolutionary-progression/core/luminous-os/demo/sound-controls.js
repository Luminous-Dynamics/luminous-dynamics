/**
 * Sound Controls for LuminousOS
 * Handles all audio-related functionality
 */

// Binaural beats state
let binauralActive = false;
let binauralOscillator = null;
let binauralGainNode = null;
let audioContext = null;

// Initialize audio context
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Toggle binaural beats
function toggleBinaural() {
    if (!binauralActive) {
        startBinauralBeats();
    } else {
        stopBinauralBeats();
    }
}

// Start binaural beats
function startBinauralBeats() {
    const ctx = initAudioContext();
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    
    // Create oscillators for left and right ear
    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();
    
    // Create gain nodes
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();
    const masterGain = ctx.createGain();
    
    // Set frequencies (40Hz gamma waves for consciousness)
    const baseFreq = 200; // Base tone
    const beatFreq = 40;  // Gamma frequency
    
    leftOsc.frequency.value = baseFreq;
    rightOsc.frequency.value = baseFreq + beatFreq;
    
    // Set volumes
    leftGain.gain.value = 0.3;
    rightGain.gain.value = 0.3;
    masterGain.gain.value = 0.5;
    
    // Create stereo merger
    const merger = ctx.createChannelMerger(2);
    
    // Connect nodes
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    
    leftGain.connect(merger, 0, 0);  // Left channel
    rightGain.connect(merger, 0, 1);  // Right channel
    
    merger.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    // Start oscillators
    leftOsc.start();
    rightOsc.start();
    
    // Store references
    binauralOscillator = { left: leftOsc, right: rightOsc };
    binauralGainNode = masterGain;
    binauralActive = true;
    
    // Update UI
    if (window.showMessage) {
        window.showMessage('Binaural beats activated - 40Hz gamma waves');
    }
}

// Stop binaural beats
function stopBinauralBeats() {
    if (binauralOscillator) {
        binauralOscillator.left.stop();
        binauralOscillator.right.stop();
        binauralOscillator = null;
        binauralGainNode = null;
    }
    
    binauralActive = false;
    
    if (window.showMessage) {
        window.showMessage('Binaural beats deactivated');
    }
}

// Sacred AI integration functions
function activateMorningPractice() {
    if (window.showMessage) {
        window.showMessage('🌅 Morning Practice: Beginning with First Presence...');
    }
    
    // Trigger morning coherence boost
    if (window.state) {
        window.state.coherence.personal = Math.min(1, window.state.coherence.personal + 0.1);
        window.updateMetrics();
    }
}

function activateShadowWork() {
    if (window.showMessage) {
        window.showMessage('🌑 Shadow Work: Engaging compassionate witness...');
    }
    
    // Simulate shadow integration
    setTimeout(() => {
        if (window.showMessage) {
            window.showMessage('Shadow aspect integrated. Coherence stabilizing...');
        }
    }, 3000);
}

function activateAlchemicalEngine() {
    if (window.showMessage) {
        window.showMessage('⚗️ Alchemical Engine: Transmuting system dissonance...');
    }
    
    // Boost field coherence
    if (window.state) {
        window.state.coherence.field = Math.min(1, window.state.coherence.field + 0.15);
        window.updateMetrics();
    }
}

function activateSacredCouncil() {
    if (window.showMessage) {
        window.showMessage('🕊️ Sacred Council: Connecting to collective wisdom...');
    }
    
    // Open Sacred Council Hub in new window if available
    if (window.open) {
        window.open('/sacred-council-hub.html', '_blank');
    }
}

// Consciousness functions
function startGroupCeremony() {
    if (window.showMessage) {
        window.showMessage('🌌 Group Ceremony: Creating sacred container...');
    }
    
    // Boost all coherence metrics
    if (window.state) {
        window.state.coherence.personal = Math.min(1, window.state.coherence.personal + 0.05);
        window.state.coherence.network = Math.min(1, window.state.coherence.network + 0.1);
        window.state.coherence.field = Math.min(1, window.state.coherence.field + 0.1);
        window.updateMetrics();
        
        setTimeout(() => {
            window.showMessage('Group field established. Coherence rising...');
        }, 2000);
    }
}

function showConsciousnessData() {
    if (window.showMessage) {
        window.showMessage('📊 Opening Consciousness Analytics Dashboard...');
    }
    
    // Create modal for data visualization
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
        align-items: center;
        justify-content: center;
        color: white;
    `;
    
    modal.innerHTML = `
        <h2>Consciousness Analytics</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin: 30px;">
            <div style="text-align: center;">
                <h3>Personal Coherence</h3>
                <div style="font-size: 48px; color: #6B46C1;">${(window.state?.coherence.personal * 100 || 0).toFixed(0)}%</div>
                <p>Individual field strength</p>
            </div>
            <div style="text-align: center;">
                <h3>Network Coherence</h3>
                <div style="font-size: 48px; color: #EC4899;">${(window.state?.coherence.network * 100 || 0).toFixed(0)}%</div>
                <p>Collective resonance</p>
            </div>
            <div style="text-align: center;">
                <h3>Field Coherence</h3>
                <div style="font-size: 48px; color: #10B981;">${(window.state?.coherence.field * 100 || 0).toFixed(0)}%</div>
                <p>Unified consciousness</p>
            </div>
        </div>
        <button onclick="this.parentElement.remove()" style="
            background: transparent;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            margin-top: 20px;
        ">Close</button>
    `;
    
    document.body.appendChild(modal);
}

function showGlyphLibrary() {
    if (window.showGlyphLibraryView) {
        window.showGlyphLibraryView();
    } else {
        window.showMessage('📚 Glyph Library: Loading all 87 sacred patterns...');
    }
}

// Make functions globally available
window.toggleBinaural = toggleBinaural;
window.activateMorningPractice = activateMorningPractice;
window.activateShadowWork = activateShadowWork;
window.activateAlchemicalEngine = activateAlchemicalEngine;
window.activateSacredCouncil = activateSacredCouncil;
window.startGroupCeremony = startGroupCeremony;
window.showConsciousnessData = showConsciousnessData;
window.showGlyphLibrary = showGlyphLibrary;