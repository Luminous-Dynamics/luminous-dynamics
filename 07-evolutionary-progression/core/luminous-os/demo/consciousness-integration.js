/**
 * Consciousness Integration for LuminousOS
 * 
 * Brings together Sacred AI and Advanced Consciousness features
 */

// Global instances
let sacredAI = null;
let advancedConsciousness = null;
let binauralActive = false;

// Initialize consciousness features when OS is ready
function initializeConsciousnessFeatures() {
    // Create Sacred AI integration
    sacredAI = new SacredAIIntegration();
    window.sacredAI = sacredAI;
    
    // Create Advanced Consciousness features
    advancedConsciousness = new AdvancedConsciousness();
    window.advancedConsciousness = advancedConsciousness;
    
    // Add breath-responsive geometry to mandala
    const mandalaContainer = document.getElementById('mandalaContainer');
    if (mandalaContainer) {
        advancedConsciousness.createBreathCanvas(mandalaContainer);
    }
    
    console.log('🌟 Consciousness features initialized');
}

// Sacred AI activation functions

async function activateMorningPractice() {
    if (!sacredAI) {
        showMessage('Sacred AI not initialized');
        return;
    }
    
    const practice = await sacredAI.activateMorningPractice();
    console.log('Morning practice activated:', practice);
}

async function activateShadowWork() {
    if (!sacredAI) {
        showMessage('Sacred AI not initialized');
        return;
    }
    
    const shadow = await sacredAI.activateShadowWork();
    console.log('Shadow work activated:', shadow);
}

async function activateAlchemicalEngine() {
    if (!sacredAI) {
        showMessage('Sacred AI not initialized');
        return;
    }
    
    const alchemy = await sacredAI.activateAlchemicalEngine();
    console.log('Alchemical Engine activated:', alchemy);
}

async function activateSacredCouncil() {
    if (!sacredAI) {
        showMessage('Sacred AI not initialized');
        return;
    }
    
    const council = await sacredAI.activateSacredCouncil();
    console.log('Sacred Council activated:', council);
    
    if (council.status === 'offline') {
        showMessage('Connect to network first for Sacred Council');
    }
}

// Advanced Consciousness functions

function startGroupCeremony() {
    if (!advancedConsciousness) {
        showMessage('Advanced consciousness not initialized');
        return;
    }
    
    // Show ceremony type selection
    const ceremonies = [
        { type: 'heart-sync', name: '💓 Heart Synchronization' },
        { type: 'breath-wave', name: '🌊 Breath Wave' },
        { type: 'field-weaving', name: '🕸️ Field Weaving' },
        { type: 'collective-healing', name: '🌟 Collective Healing' }
    ];
    
    // Create selection dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(107, 70, 193, 0.5);
        border-radius: 20px;
        padding: 30px;
        z-index: 1000;
        text-align: center;
    `;
    
    dialog.innerHTML = `
        <h2 style="color: #6B46C1; margin-bottom: 20px;">Select Ceremony Type</h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
            ${ceremonies.map(c => `
                <button onclick="selectCeremony('${c.type}')" style="
                    background: linear-gradient(135deg, #6B46C1, #EC4899);
                    color: white;
                    border: none;
                    padding: 15px 20px;
                    border-radius: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.05)'" 
                   onmouseout="this.style.transform='scale(1)'">
                    ${c.name}
                </button>
            `).join('')}
        </div>
        <button onclick="closeCeremonyDialog()" style="
            background: transparent;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 10px 20px;
            border-radius: 20px;
            margin-top: 20px;
            cursor: pointer;
        ">Cancel</button>
    `;
    
    document.body.appendChild(dialog);
    window.ceremonyDialog = dialog;
}

function selectCeremony(type) {
    if (window.ceremonyDialog) {
        window.ceremonyDialog.remove();
        window.ceremonyDialog = null;
    }
    
    advancedConsciousness.startGroupCeremony(type);
}

function closeCeremonyDialog() {
    if (window.ceremonyDialog) {
        window.ceremonyDialog.remove();
        window.ceremonyDialog = null;
    }
}

function toggleBinaural() {
    if (!sacredAI) {
        showMessage('Sacred AI not initialized');
        return;
    }
    
    if (binauralActive) {
        sacredAI.stopBinauralBeat();
        binauralActive = false;
        showMessage('🎵 Binaural beats stopped');
    } else {
        // Show frequency selection
        const frequencies = Object.keys(sacredAI.sacredFrequencies);
        const selection = prompt(
            'Select frequency:\n' +
            frequencies.map((f, i) => `${i + 1}. ${f} (${sacredAI.sacredFrequencies[f].base}Hz)`).join('\n'),
            '4'
        );
        
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < frequencies.length) {
            const frequency = frequencies[index];
            sacredAI.startBinauralBeat(frequency);
            binauralActive = true;
            showMessage(`🎵 Binaural beat started: ${frequency}`);
        }
    }
}

function showConsciousnessData() {
    if (!advancedConsciousness) {
        showMessage('Advanced consciousness not initialized');
        return;
    }
    
    // Create dashboard modal
    const modal = document.createElement('div');
    modal.id = 'consciousnessDataModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 1000;
        overflow: auto;
    `;
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.onclick = closeConsciousnessData;
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: transparent;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        z-index: 1001;
    `;
    modal.appendChild(closeBtn);
    
    // Dashboard container
    const dashboardContainer = document.createElement('div');
    dashboardContainer.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        padding: 20px;
    `;
    modal.appendChild(dashboardContainer);
    
    document.body.appendChild(modal);
    
    // Create visualization dashboard
    advancedConsciousness.createDashboard(dashboardContainer);
}

function closeConsciousnessData() {
    const modal = document.getElementById('consciousnessDataModal');
    if (modal) {
        modal.remove();
    }
}

// Integration with main OS

// Override glyph selection to include AI recommendations
const originalSelectGlyph = window.selectGlyph;
window.selectGlyph = function(glyph) {
    // Call original function
    if (originalSelectGlyph) {
        originalSelectGlyph(glyph);
    }
    
    // Record activation for visualization
    if (advancedConsciousness) {
        advancedConsciousness.recordGlyphActivation(glyph.id);
    }
    
    // Check if shadow work is needed
    if (sacredAI && glyph.id === 'Ω24') { // Shadow Welcoming
        setTimeout(() => {
            sacredAI.activateShadowWork();
        }, 2000);
    }
};

// Enhanced practice chamber with AI guidance
const originalOpenPractice = window.openPracticeChaber;
window.openPracticeChaber = function(glyph) {
    // Add AI guidance to practice chamber
    if (sacredAI && glyph) {
        const chamber = document.getElementById('practiceChaber');
        if (chamber) {
            // Add AI guidance section
            const guidanceDiv = document.createElement('div');
            guidanceDiv.id = 'aiGuidance';
            guidanceDiv.style.cssText = `
                background: rgba(107, 70, 193, 0.1);
                border: 1px solid rgba(107, 70, 193, 0.3);
                border-radius: 10px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                line-height: 1.6;
            `;
            
            // Get AI guidance based on glyph
            let guidance = '🤖 AI Guidance: ';
            if (glyph.id === 'Ω0') {
                guidance += 'Begin with three deep breaths. Let each exhale release tension.';
            } else if (glyph.id === 'Ω1') {
                guidance += 'Feel into your deepest YES. What wants to emerge through you?';
            } else if (glyph.id === 'Ω8') {
                guidance += 'Notice all parts of yourself. Which voice needs to be heard?';
            } else {
                guidance += 'Trust your inner wisdom. The practice knows the way.';
            }
            
            guidanceDiv.textContent = guidance;
            
            // Insert before buttons
            const practiceContent = chamber.querySelector('.practice-content');
            const buttons = practiceContent.querySelector('button');
            practiceContent.insertBefore(guidanceDiv, buttons);
        }
    }
    
    // Call original function
    if (originalOpenPractice) {
        originalOpenPractice(glyph);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConsciousnessFeatures);
} else {
    initializeConsciousnessFeatures();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (sacredAI?.binauralGenerator?.isPlaying) {
        sacredAI.stopBinauralBeat();
    }
    if (advancedConsciousness?.breathResponsiveGeometry?.animationId) {
        advancedConsciousness.stopBreathAnimation();
    }
});

// Export functions for global use
window.activateMorningPractice = activateMorningPractice;
window.activateShadowWork = activateShadowWork;
window.activateAlchemicalEngine = activateAlchemicalEngine;
window.activateSacredCouncil = activateSacredCouncil;
window.startGroupCeremony = startGroupCeremony;
window.selectCeremony = selectCeremony;
window.closeCeremonyDialog = closeCeremonyDialog;
window.toggleBinaural = toggleBinaural;
window.showConsciousnessData = showConsciousnessData;
window.closeConsciousnessData = closeConsciousnessData;