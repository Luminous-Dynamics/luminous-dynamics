/**
 * Network Integration for LuminousOS
 * 
 * Integrates:
 * - Luminous Network Client (multi-user coherence)
 * - Network Visualization (collective field view)
 * - Quantum Coherence Bridge (consciousness-quantum correlations)
 */

// Global network instances
let networkClient = null;
let networkViz = null;
let quantumBridge = null;

// Initialize network components when OS is ready
function initializeNetwork() {
    // Create quantum bridge first
    quantumBridge = new QuantumCoherenceBridge({
        localQRNG: true // Use local simulation for now
    });
    
    // Set up quantum event handlers
    quantumBridge.onQuantumEvent = (event) => {
        console.log('Quantum event:', event);
        updateQuantumDisplay();
    };
    
    quantumBridge.onCorrelation = (coupling) => {
        updateQuantumDisplay();
    };
    
    quantumBridge.onEntanglement = (entanglement) => {
        console.log('New quantum entanglement:', entanglement);
        updateQuantumDisplay();
    };
    
    // Initialize display
    updateQuantumDisplay();
}

// Toggle network connection
function toggleNetwork() {
    if (!networkClient || !networkClient.connected) {
        connectToNetwork();
    } else {
        disconnectFromNetwork();
    }
}

// Connect to Luminous Network
function connectToNetwork() {
    const button = document.getElementById('networkToggle');
    button.textContent = 'Connecting...';
    button.disabled = true;
    
    // Create network client
    networkClient = new LuminousNetworkClient({
        wsUrl: 'ws://localhost:9998',
        nodeId: 'luminous-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8)
    });
    
    // Set up event handlers
    networkClient.onConnect = () => {
        console.log('Connected to Luminous Network!');
        updateNetworkStatus(true);
        
        // Create network visualization if canvas exists
        const canvas = document.getElementById('networkCanvas');
        if (canvas) {
            // Set canvas size
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            networkViz = new NetworkVisualization(canvas, networkClient);
        }
        
        // Sync coherence with quantum bridge
        if (quantumBridge) {
            const interval = setInterval(() => {
                if (networkClient.connected) {
                    networkClient.setCoherence(window.state.coherence.personal);
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        }
    };
    
    networkClient.onDisconnect = () => {
        console.log('Disconnected from Luminous Network');
        updateNetworkStatus(false);
    };
    
    networkClient.onCoherenceUpdate = (coherence) => {
        // Update local coherence display
        if (window.updateNetworkCoherence) {
            window.updateNetworkCoherence(coherence.network);
        }
    };
    
    networkClient.onPeerJoin = (peer) => {
        showMessage(`${peer.nodeId.substring(0, 8)} joined the field`);
        updateNetworkStatus(true);
    };
    
    networkClient.onPeerLeave = (nodeId) => {
        showMessage(`${nodeId.substring(0, 8)} left the field`);
        updateNetworkStatus(true);
    };
    
    networkClient.onSacredMessage = (message) => {
        // Could show in a special UI
        console.log('Sacred message:', message);
    };
    
    // Register handlers for glyph announcements
    networkClient.registerMessageHandler('glyph_activated', (message) => {
        // When a peer activates a glyph
        if (message.nodeId !== networkClient.nodeId) {
            showMessage(`Network peer activated ${message.glyphName}`);
        }
    });
}

// Disconnect from network
function disconnectFromNetwork() {
    if (networkClient) {
        networkClient.disconnect();
        networkClient = null;
    }
    
    if (networkViz) {
        networkViz = null;
    }
    
    updateNetworkStatus(false);
}

// Update network status display
function updateNetworkStatus(connected) {
    const button = document.getElementById('networkToggle');
    const routerStatus = document.getElementById('routerStatus');
    const connectionStatus = document.getElementById('connectionStatus');
    
    if (connected && networkClient) {
        button.textContent = 'Disconnect';
        button.disabled = false;
        routerStatus.textContent = 'Online';
        routerStatus.style.color = '#10B981';
        connectionStatus.textContent = 'Connected to Luminous Network';
        
        // Update stats
        const state = networkClient.getNetworkState();
        document.getElementById('connectedNodes').textContent = state.peerCount + 1;
        document.getElementById('routerCoherence').textContent = Math.round(state.networkCoherence * 100) + '%';
        
        // Update packet count periodically
        let packetCount = 0;
        setInterval(() => {
            if (networkClient && networkClient.connected) {
                packetCount += Math.floor(Math.random() * 3);
                document.getElementById('packetCount').textContent = packetCount;
            }
        }, 2000);
    } else {
        button.textContent = 'Connect to Network';
        button.disabled = false;
        routerStatus.textContent = 'Offline';
        routerStatus.style.color = '#EF4444';
        connectionStatus.textContent = 'Disconnected';
        document.getElementById('connectedNodes').textContent = '0';
        document.getElementById('routerCoherence').textContent = '0%';
    }
}

// Toggle network visualization
function toggleNetworkView() {
    const viz = document.getElementById('networkVisualization');
    if (viz.style.display === 'none') {
        viz.style.display = 'block';
        
        // Resize canvas if needed
        const canvas = document.getElementById('networkCanvas');
        if (canvas && networkViz) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    } else {
        viz.style.display = 'none';
    }
}

// Close network view
function closeNetworkView() {
    document.getElementById('networkVisualization').style.display = 'none';
}

// Update quantum display
function updateQuantumDisplay() {
    if (!quantumBridge) return;
    
    const data = quantumBridge.getVisualizationData();
    
    // Update correlation
    const correlation = Math.round(data.coupling.correlation * 100);
    document.getElementById('quantumCorrelation').style.width = correlation + '%';
    document.getElementById('quantumValue').textContent = correlation + '%';
    
    // Update entanglements
    document.getElementById('quantumEntanglements').textContent = data.entanglements.length;
    
    // Update status
    const status = document.getElementById('quantumStatus');
    if (data.coupling.resonance > 0.8) {
        status.textContent = 'High resonance detected!';
        status.style.color = '#10B981';
    } else if (data.coupling.correlation > 0.5) {
        status.textContent = 'Quantum correlation active';
        status.style.color = '#6B46C1';
    } else {
        status.textContent = 'Monitoring quantum field...';
        status.style.color = 'inherit';
    }
}

// Network-aware glyph activation
function activateGlyphNetwork(glyph) {
    if (networkClient && networkClient.connected) {
        // Announce to network
        networkClient.announceGlyphPractice(glyph.id, glyph.name);
        
        // Send custom message
        networkClient.send({
            type: 'glyph_activated',
            nodeId: networkClient.nodeId,
            glyphId: glyph.id,
            glyphName: glyph.name,
            coherence: window.state.coherence.personal,
            timestamp: Date.now()
        });
    }
}

// Quantum-enhanced glyph selection
async function quantumGlyphSelection() {
    if (!quantumBridge) return null;
    
    // Get accessible glyphs
    const glyphs = window.getGlyphsByCoherence(window.state.coherence.personal);
    if (glyphs.length === 0) return null;
    
    // Use quantum randomness to select
    const result = await quantumBridge.quantumChoice(glyphs);
    
    showMessage(`Quantum field suggests: ${result.choice.name}`);
    return result.choice;
}

// Quantum meditation integration
async function startQuantumMeditation(duration = 60000) {
    if (!quantumBridge) return;
    
    showMessage('Starting quantum-guided meditation...');
    
    const meditation = await quantumBridge.quantumMeditation(duration);
    
    // Process insights
    meditation.insights.forEach(insight => {
        setTimeout(() => {
            showMessage(insight.message);
        }, insight.time);
    });
    
    return meditation;
}

// Update network coherence display
window.updateNetworkCoherence = function(coherence) {
    const percent = Math.round(coherence * 100);
    document.getElementById('networkCoherence').style.width = percent + '%';
    document.getElementById('networkValue').textContent = percent + '%';
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNetwork);
} else {
    initializeNetwork();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (networkViz) {
        const canvas = document.getElementById('networkCanvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            networkViz.resize(window.innerWidth, window.innerHeight);
        }
    }
});

// Export for use by other modules
window.networkIntegration = {
    networkClient,
    networkViz,
    quantumBridge,
    connectToNetwork,
    disconnectFromNetwork,
    activateGlyphNetwork,
    quantumGlyphSelection,
    startQuantumMeditation
};