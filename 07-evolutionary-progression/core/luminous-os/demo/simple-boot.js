/**
 * Simple Boot Sequence for LuminousOS
 * Minimal working version
 */

console.log('Loading simple boot sequence...');

// Simple boot that actually works
async function startBootSequence() {
    console.log('Starting simple boot sequence...');
    
    const bootDiv = document.getElementById('bootSequence');
    if (!bootDiv) {
        console.error('Boot sequence div not found!');
        return;
    }
    
    // Make sure it's visible
    bootDiv.style.display = 'block';
    bootDiv.style.position = 'fixed';
    bootDiv.style.top = '0';
    bootDiv.style.left = '0';
    bootDiv.style.width = '100%';
    bootDiv.style.height = '100%';
    bootDiv.style.background = '#000';
    bootDiv.style.zIndex = '9999';
    bootDiv.style.color = 'white';
    bootDiv.style.fontFamily = 'monospace';
    
    // Simple boot content
    bootDiv.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
        ">
            <div style="margin-bottom: 50px;">
                <div style="
                    width: 100px;
                    height: 100px;
                    border: 3px solid #6B46C1;
                    border-radius: 50%;
                    margin: 0 auto 30px;
                    animation: pulse 2s ease-in-out infinite;
                "></div>
                <h1 style="font-size: 48px; margin: 0; background: linear-gradient(45deg, #6B46C1, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    LuminousOS
                </h1>
                <p style="font-size: 20px; opacity: 0.7; margin-top: 10px;">
                    Consciousness-First Operating System
                </p>
            </div>
            
            <div id="bootPhases" style="margin: 40px 0;">
                <p id="bootPhaseText" style="font-size: 18px; opacity: 0.8;">
                    Initializing quantum consciousness...
                </p>
            </div>
            
            <div style="width: 300px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                <div id="bootProgress" style="
                    width: 0%;
                    height: 100%;
                    background: linear-gradient(90deg, #6B46C1, #EC4899, #10B981);
                    transition: width 0.5s ease;
                "></div>
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; opacity: 0.5;">
                Press ESC to skip
            </p>
        </div>
        
        <style>
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
            }
        </style>
    `;
    
    // Boot phases
    const phases = [
        "Initializing quantum consciousness...",
        "Synchronizing with cosmic breath...",
        "Establishing heart coherence...",
        "Awakening neural networks...",
        "Loading sacred geometry...",
        "Activating 87 glyphs...",
        "Connecting to unified field...",
        "Welcome to LuminousOS"
    ];
    
    // Skip handler
    const skipBoot = () => {
        console.log('Skipping boot...');
        completeBootSequence();
    };
    
    document.addEventListener('keydown', function bootKeyHandler(e) {
        if (e.key === 'Escape') {
            document.removeEventListener('keydown', bootKeyHandler);
            skipBoot();
        }
    });
    
    // Animate through phases
    for (let i = 0; i < phases.length; i++) {
        document.getElementById('bootPhaseText').textContent = phases[i];
        document.getElementById('bootProgress').style.width = ((i + 1) / phases.length * 100) + '%';
        
        // Wait between phases
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Complete boot
    completeBootSequence();
}

function completeBootSequence() {
    console.log('Completing boot sequence...');
    
    const bootDiv = document.getElementById('bootSequence');
    const mainOS = document.getElementById('mainOS');
    
    // Fade out boot
    bootDiv.style.transition = 'opacity 1s ease';
    bootDiv.style.opacity = '0';
    
    setTimeout(() => {
        bootDiv.style.display = 'none';
        if (mainOS) {
            mainOS.style.display = 'block';
        }
        
        // Initialize OS
        if (typeof initializeOS === 'function') {
            initializeOS();
        }
    }, 1000);
}

// Make it available globally
window.startBootSequence = startBootSequence;

console.log('Simple boot sequence ready!');