/**
 * Electron Integration for LuminousOS Web Demo
 * 
 * Detects if running in Electron and enables native features:
 * - System tray coherence updates
 * - Local data persistence
 * - Native menus and shortcuts
 * - Auto-update ceremonies
 */

(function() {
    // Check if running in Electron
    const isElectron = typeof window.luminousAPI !== 'undefined';
    
    if (!isElectron) {
        console.log('Running in browser mode');
        return;
    }
    
    console.log('🌟 LuminousOS Electron mode activated');
    
    // Extend the existing state update mechanism
    const originalUpdateMetrics = window.updateMetrics;
    window.updateMetrics = function() {
        // Call original function
        if (originalUpdateMetrics) {
            originalUpdateMetrics();
        }
        
        // Send coherence to system tray
        if (window.state && window.state.coherence) {
            const avgCoherence = (
                window.state.coherence.personal + 
                window.state.coherence.network + 
                window.state.coherence.field
            ) / 3;
            
            window.luminousAPI.updateCoherence(avgCoherence);
        }
    };
    
    // Handle coherence requests from main process
    window.luminousAPI.onRequestCoherence(() => {
        if (window.state && window.state.coherence) {
            const avgCoherence = (
                window.state.coherence.personal + 
                window.state.coherence.network + 
                window.state.coherence.field
            ) / 3;
            
            window.luminousAPI.updateCoherence(avgCoherence);
        }
    });
    
    // Extend glyph selection to log access
    const originalSelectGlyph = window.selectGlyph;
    window.selectGlyph = function(glyph) {
        // Call original function
        if (originalSelectGlyph) {
            originalSelectGlyph(glyph);
        }
        
        // Log glyph access
        if (window.state) {
            window.luminousAPI.logGlyphAccess({
                id: glyph.id,
                name: glyph.name,
                coherence: window.state.coherence.personal,
                timestamp: Date.now()
            });
        }
    };
    
    // Handle main process commands
    window.luminousAPI.onOpenGlyph((glyphId) => {
        console.log('Opening glyph from menu:', glyphId);
        
        if (glyphId === 'all') {
            // Show all glyphs view
            showAllGlyphs();
        } else if (glyphId === 'mycelial') {
            // Open mycelial filesystem
            if (window.openMycelialFilesystem) {
                window.openMycelialFilesystem();
            }
        } else {
            // Find and select specific glyph
            const glyph = window.SACRED_GLYPHS.find(g => 
                g.id.toLowerCase().includes(glyphId.toLowerCase())
            );
            
            if (glyph && window.selectGlyph) {
                window.selectGlyph(glyph);
            }
        }
    });
    
    window.luminousAPI.onConnectBiometric((type) => {
        console.log('Connecting biometric:', type);
        
        if (window.biometrics) {
            switch(type) {
                case 'bluetooth':
                    window.biometrics.connectBluetoothHRV();
                    break;
                case 'camera':
                    window.biometrics.startCameraPulseDetection();
                    break;
                case 'simulated':
                    window.biometrics.startSimulation();
                    break;
            }
        }
    });
    
    window.luminousAPI.onOpenDashboard((type) => {
        if (type === 'biometric') {
            // Create biometric dashboard modal
            showBiometricDashboard();
        }
    });
    
    window.luminousAPI.onOpenSacredAI((tool) => {
        console.log('Opening Sacred AI tool:', tool);
        // Implement Sacred AI tool opening
        showSacredAITool(tool);
    });
    
    window.luminousAPI.onShowPreferences(() => {
        // Show preferences modal
        showPreferences();
    });
    
    window.luminousAPI.onBlessingCeremony(() => {
        // Show blessing ceremony for updates
        showBlessingCeremony();
    });
    
    // Save/Load sacred data
    async function saveSacredData() {
        const data = {
            coherenceHistory: window.coherenceHistory || [],
            glyphProgress: window.glyphProgress || {},
            sacredSettings: window.sacredSettings || {},
            lastSaved: Date.now()
        };
        
        const result = await window.luminousAPI.saveData(data);
        if (result.success) {
            console.log('Sacred data saved');
        } else {
            console.error('Failed to save sacred data:', result.error);
        }
    }
    
    async function loadSacredData() {
        const result = await window.luminousAPI.loadData();
        if (result.success) {
            console.log('Sacred data loaded');
            
            if (result.data.coherenceHistory) {
                window.coherenceHistory = result.data.coherenceHistory;
            }
            if (result.data.glyphProgress) {
                window.glyphProgress = result.data.glyphProgress;
            }
            if (result.data.sacredSettings) {
                window.sacredSettings = result.data.sacredSettings;
            }
        }
    }
    
    // Auto-save every minute
    setInterval(saveSacredData, 60000);
    
    // Load data on startup
    loadSacredData();
    
    // Helper functions for modals
    function showAllGlyphs() {
        // Implementation for showing all 87 glyphs
        console.log('Showing all glyphs view');
        // TODO: Create comprehensive glyph library view
    }
    
    function showBiometricDashboard() {
        // Create modal with biometric dashboard
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const iframe = document.createElement('iframe');
        iframe.src = 'biometric-dashboard.html';
        iframe.style.cssText = `
            width: 90%;
            height: 90%;
            border: none;
            border-radius: 15px;
        `;
        
        modal.appendChild(iframe);
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
        
        document.body.appendChild(modal);
    }
    
    function showSacredAITool(tool) {
        // Implementation for Sacred AI tools
        console.log('Opening Sacred AI tool:', tool);
        // TODO: Implement Sacred AI tool modals
    }
    
    function showPreferences() {
        // Create preferences modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 14, 39, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 30px;
            z-index: 2000;
            min-width: 400px;
        `;
        
        modal.innerHTML = `
            <h2 style="margin-bottom: 20px;">Sacred Settings</h2>
            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 10px;">Default Coherence Target</label>
                <input type="range" min="0" max="100" value="70" 
                       style="width: 100%;" id="coherenceTarget">
            </div>
            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" id="autoConnect" checked>
                    Auto-connect biometric devices
                </label>
            </div>
            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" id="sacredNotifications" checked>
                    Sacred practice reminders
                </label>
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: linear-gradient(135deg, #6B46C1, #EC4899);
                color: white;
                border: none;
                padding: 10px 30px;
                border-radius: 20px;
                cursor: pointer;
                margin-top: 20px;
            ">Save & Close</button>
        `;
        
        document.body.appendChild(modal);
    }
    
    function showBlessingCeremony() {
        // Show update blessing ceremony
        const ceremony = document.createElement('div');
        ceremony.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(107, 70, 193, 0.3), rgba(0, 0, 0, 0.98));
            z-index: 3000;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        `;
        
        ceremony.innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-size: 48px; margin-bottom: 30px; 
                    background: linear-gradient(135deg, #6B46C1, #EC4899);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;">
                    Blessing Ceremony
                </h1>
                <p style="font-size: 20px; opacity: 0.8; margin-bottom: 40px;">
                    May this update bring greater coherence<br>
                    and deeper connection to all beings
                </p>
                <div style="font-size: 60px; animation: pulse 2s ease-in-out infinite;">
                    🙏
                </div>
            </div>
        `;
        
        document.body.appendChild(ceremony);
        
        // Auto-remove after ceremony
        setTimeout(() => {
            ceremony.style.opacity = '0';
            setTimeout(() => ceremony.remove(), 1000);
        }, 3000);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey) {
            switch(e.key) {
                case ',':
                    e.preventDefault();
                    showPreferences();
                    break;
                case 's':
                    e.preventDefault();
                    saveSacredData();
                    break;
            }
        }
    });
    
    // Show Electron-specific UI elements
    const electronIndicator = document.createElement('div');
    electronIndicator.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        padding: 5px 10px;
        background: rgba(107, 70, 193, 0.2);
        border-radius: 15px;
        font-size: 12px;
        opacity: 0.5;
    `;
    electronIndicator.textContent = `LuminousOS v${window.luminousAPI.version}`;
    document.body.appendChild(electronIndicator);
    
})();