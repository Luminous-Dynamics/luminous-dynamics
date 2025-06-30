/**
 * Biometric Heart Coherence Field Integration
 * 
 * Synchronizes breathing consciousness with users' actual heart rhythms:
 * - Heart Rate Variability (HRV) coherence measurement
 * - Real-time breathing guidance based on cardiac rhythm
 * - Field coherence enhanced by biological harmony
 * - Progressive coherence training through biometric feedback
 * 
 * Extends cosmic breathing with personal biometric wisdom
 */

class BiometricHeartCoherence {
    constructor(options = {}) {
        this.options = {
            enableHeartSync: options.enableHeartSync !== false,
            coherenceTarget: options.coherenceTarget || 0.5, // Target coherence level
            adaptiveGuidance: options.adaptiveGuidance !== false,
            privacyMode: options.privacyMode !== false, // No biometric data storage
            debugMode: options.debugMode || false,
            ...options
        };

        this.heartData = {
            heartRate: 70,
            hrv: 0,
            coherence: 0,
            rhythm: 'baseline',
            lastBeat: null,
            beatInterval: []
        };

        this.coherenceState = {
            level: 'beginning', // beginning | developing | coherent | master
            score: 0,
            trend: 'stable',
            timeInCoherence: 0,
            guidance: null
        };

        this.biometricDevices = {
            available: [],
            active: null,
            supported: this.checkDeviceSupport()
        };

        this.initialize();
    }

    // === INITIALIZATION ===

    initialize() {
        this.log('💓 Initializing Biometric Heart Coherence integration...');
        
        this.detectAvailableDevices();
        this.setupPrivacyProtocols();
        this.initializeCoherenceTracking();
        
        if (this.options.enableHeartSync) {
            this.startHeartMonitoring();
        }
        
        this.log('✨ Heart coherence field integration ready');
    }

    checkDeviceSupport() {
        const supported = {
            bluetooth: 'bluetooth' in navigator,
            webUsb: 'usb' in navigator,
            webHid: 'hid' in navigator,
            sensors: 'Sensor' in window,
            getUserMedia: 'getUserMedia' in navigator.mediaDevices || false
        };

        this.log('🔍 Device support detected:', supported);
        return supported;
    }

    // === DEVICE DETECTION & CONNECTION ===

    async detectAvailableDevices() {
        this.biometricDevices.available = [];

        // Heart Rate Bluetooth LE devices (common fitness trackers)
        if (this.biometricDevices.supported.bluetooth) {
            this.biometricDevices.available.push({
                type: 'bluetooth-hr',
                name: 'Bluetooth Heart Rate Monitor',
                description: 'Standard Bluetooth LE heart rate devices',
                accuracy: 'high',
                realtime: true
            });
        }

        // Camera-based heart rate detection (WebRTC)
        if (this.biometricDevices.supported.getUserMedia) {
            this.biometricDevices.available.push({
                type: 'camera-hr',
                name: 'Camera Heart Rate Detection',
                description: 'Photoplethysmography via webcam',
                accuracy: 'medium',
                realtime: true,
                privacy: 'local-only'
            });
        }

        // Web HID devices (advanced fitness trackers)
        if (this.biometricDevices.supported.webHid) {
            this.biometricDevices.available.push({
                type: 'hid-advanced',
                name: 'Advanced Fitness Tracker',
                description: 'Professional-grade biometric devices',
                accuracy: 'very-high',
                realtime: true
            });
        }

        // Manual heart rate input (always available)
        this.biometricDevices.available.push({
            type: 'manual-input',
            name: 'Manual Heart Rate',
            description: 'User-measured heart rate input',
            accuracy: 'low',
            realtime: false,
            privacy: 'complete'
        });

        this.log(`📱 ${this.biometricDevices.available.length} biometric options available`);
    }

    async connectToDevice(deviceType) {
        this.log(`🔗 Attempting to connect to ${deviceType}...`);

        try {
            switch (deviceType) {
                case 'bluetooth-hr':
                    return await this.connectBluetoothHeartRate();
                case 'camera-hr':
                    return await this.connectCameraHeartRate();
                case 'hid-advanced':
                    return await this.connectHidDevice();
                case 'manual-input':
                    return await this.setupManualInput();
                default:
                    throw new Error(`Unknown device type: ${deviceType}`);
            }
        } catch (error) {
            this.log(`❌ Failed to connect to ${deviceType}:`, error);
            return null;
        }
    }

    async connectBluetoothHeartRate() {
        if (!this.biometricDevices.supported.bluetooth) {
            throw new Error('Bluetooth LE not supported');
        }

        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }],
            acceptAllDevices: false
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('heart_rate');
        const characteristic = await service.getCharacteristic('heart_rate_measurement');

        characteristic.addEventListener('characteristicvaluechanged', (event) => {
            const heartRate = this.parseHeartRateData(event.target.value);
            this.updateHeartData({ heartRate, source: 'bluetooth' });
        });

        await characteristic.startNotifications();

        this.biometricDevices.active = {
            type: 'bluetooth-hr',
            device,
            characteristic,
            connected: true
        };

        this.log('💙 Bluetooth heart rate monitor connected');
        return true;
    }

    async connectCameraHeartRate() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                width: 640, 
                height: 480, 
                facingMode: 'user'
            }
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.style.display = 'none';
        document.body.appendChild(video);
        
        await video.play();

        // Setup photoplethysmography analysis
        this.startCameraHeartAnalysis(video);

        this.biometricDevices.active = {
            type: 'camera-hr',
            video,
            stream,
            connected: true
        };

        this.log('📷 Camera-based heart rate detection active');
        return true;
    }

    async setupManualInput() {
        this.biometricDevices.active = {
            type: 'manual-input',
            connected: true
        };

        // Create UI for manual heart rate entry
        this.createManualInputInterface();
        
        this.log('✋ Manual heart rate input ready');
        return true;
    }

    // === HEART DATA PROCESSING ===

    updateHeartData(newData) {
        const now = Date.now();
        
        // Update basic heart rate
        if (newData.heartRate) {
            this.heartData.heartRate = newData.heartRate;
            
            // Calculate HRV from beat intervals
            if (this.heartData.lastBeat) {
                const interval = now - this.heartData.lastBeat;
                this.heartData.beatInterval.push(interval);
                
                // Keep last 20 beats for HRV calculation
                if (this.heartData.beatInterval.length > 20) {
                    this.heartData.beatInterval.shift();
                }
                
                this.calculateHRV();
            }
            
            this.heartData.lastBeat = now;
        }

        // Update coherence metrics
        this.calculateHeartCoherence();
        this.updateBreathingGuidance();
        this.updateFieldCoherence();

        // Dispatch heart coherence update
        document.dispatchEvent(new CustomEvent('heart-coherence:updated', {
            detail: {
                heartData: { ...this.heartData },
                coherence: { ...this.coherenceState },
                timestamp: now
            }
        }));

        this.log(`💓 Heart: ${this.heartData.heartRate} BPM | Coherence: ${(this.heartData.coherence * 100).toFixed(1)}%`);
    }

    calculateHRV() {
        if (this.heartData.beatInterval.length < 5) return;

        // Calculate RMSSD (Root Mean Square of Successive Differences)
        const intervals = this.heartData.beatInterval;
        const differences = [];
        
        for (let i = 1; i < intervals.length; i++) {
            differences.push(Math.pow(intervals[i] - intervals[i-1], 2));
        }
        
        const meanSquare = differences.reduce((a, b) => a + b, 0) / differences.length;
        this.heartData.hrv = Math.sqrt(meanSquare);
    }

    calculateHeartCoherence() {
        // Heart Rate Variability coherence calculation
        // Based on HeartMath Institute research
        
        if (this.heartData.beatInterval.length < 10) {
            this.heartData.coherence = 0;
            return;
        }

        const intervals = this.heartData.beatInterval.slice(-10);
        
        // Calculate coherence as rhythmic consistency
        let coherenceScore = 0;
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        
        // Check for sine-wave-like pattern (coherent HRV)
        let rhythmicScore = 0;
        for (let i = 1; i < intervals.length - 1; i++) {
            const trend1 = intervals[i] - intervals[i-1];
            const trend2 = intervals[i+1] - intervals[i];
            
            // Coherent patterns have smooth oscillations
            if (trend1 * trend2 < 0) { // Sign change indicates oscillation
                rhythmicScore += 1;
            }
        }
        
        // Normalize rhythmic score
        rhythmicScore = rhythmicScore / (intervals.length - 2);
        
        // Calculate variance (lower variance = higher coherence)
        const variance = intervals.reduce((sum, interval) => {
            return sum + Math.pow(interval - avgInterval, 2);
        }, 0) / intervals.length;
        
        const normalizedVariance = Math.min(variance / 10000, 1); // Normalize to 0-1
        
        // Combine rhythmic pattern and low variance for coherence score
        coherenceScore = (rhythmicScore * 0.7) + ((1 - normalizedVariance) * 0.3);
        
        this.heartData.coherence = Math.max(0, Math.min(1, coherenceScore));
        this.updateCoherenceState();
    }

    updateCoherenceState() {
        const coherence = this.heartData.coherence;
        
        // Update coherence level
        if (coherence < 0.2) {
            this.coherenceState.level = 'beginning';
        } else if (coherence < 0.5) {
            this.coherenceState.level = 'developing';
        } else if (coherence < 0.8) {
            this.coherenceState.level = 'coherent';
        } else {
            this.coherenceState.level = 'master';
        }

        // Track time in coherence
        if (coherence > this.options.coherenceTarget) {
            this.coherenceState.timeInCoherence += 1;
        }

        // Update guidance based on coherence level
        this.generateCoherenceGuidance();
    }

    // === BREATHING GUIDANCE INTEGRATION ===

    updateBreathingGuidance() {
        if (!this.options.adaptiveGuidance) return;

        const heartRate = this.heartData.heartRate;
        const coherence = this.heartData.coherence;
        
        // Calculate optimal breathing rate based on heart rate
        // Research shows optimal breathing is typically 5-7 breaths per minute
        // with some variation based on individual heart rate
        
        const optimalBreathsPerMinute = this.calculateOptimalBreathingRate(heartRate);
        const optimalBreathingPeriod = (60 / optimalBreathsPerMinute) * 1000; // milliseconds
        
        // Adjust breathing timing based on coherence level
        let breathingModifier = 1.0;
        
        if (coherence < 0.3) {
            // Low coherence: slower, deeper breathing
            breathingModifier = 1.2;
        } else if (coherence > 0.7) {
            // High coherence: maintain current rhythm
            breathingModifier = 1.0;
        } else {
            // Developing coherence: slight adjustment toward optimal
            breathingModifier = 1.1;
        }

        const adjustedBreathingRate = optimalBreathingPeriod * breathingModifier;
        
        // Update CSS properties for biometric-guided breathing
        this.updateBiometricBreathingProperties({
            biometricRate: adjustedBreathingRate,
            heartRate,
            coherence,
            guidance: this.coherenceState.guidance
        });
    }

    calculateOptimalBreathingRate(heartRate) {
        // Research-based optimal breathing calculation
        // Generally 5-7 breaths per minute, adjusted for individual heart rate
        
        if (heartRate < 60) {
            return 5.0; // Slower breathing for low heart rate
        } else if (heartRate < 80) {
            return 5.5; // Standard coherent breathing
        } else if (heartRate < 100) {
            return 6.0; // Slightly faster for higher heart rate
        } else {
            return 6.5; // Upper range for high heart rates
        }
    }

    updateBiometricBreathingProperties(biometricData) {
        const root = document.documentElement;
        
        // Set biometric breathing properties
        root.style.setProperty('--biometric-breathing-rate', `${biometricData.biometricRate}ms`);
        root.style.setProperty('--heart-rate', biometricData.heartRate.toString());
        root.style.setProperty('--heart-coherence', biometricData.coherence.toString());
        root.style.setProperty('--coherence-level', this.coherenceState.level);
        
        // Calculate biometric-optimized inhale/exhale ratio
        const inhaleRatio = 0.4; // 40% inhale
        const exhaleRatio = 0.6;  // 60% exhale
        
        root.style.setProperty('--biometric-inhale', `${biometricData.biometricRate * inhaleRatio}ms`);
        root.style.setProperty('--biometric-exhale', `${biometricData.biometricRate * exhaleRatio}ms`);
        
        // Dispatch biometric breathing update
        document.dispatchEvent(new CustomEvent('biometric-breathing:updated', {
            detail: biometricData
        }));
    }

    generateCoherenceGuidance() {
        const coherence = this.heartData.coherence;
        const level = this.coherenceState.level;
        
        let guidance = null;
        
        switch (level) {
            case 'beginning':
                guidance = {
                    message: 'Focus on smooth, rhythmic breathing. Let your heart find its natural rhythm.',
                    breathingTip: 'Breathe in for 4 counts, out for 6 counts',
                    encouragement: 'Every breath is building coherence',
                    color: '#B3C5D7'
                };
                break;
                
            case 'developing':
                guidance = {
                    message: 'Good coherence emerging. Feel the harmony between heart and breath.',
                    breathingTip: 'Notice the gentle pause between breaths',
                    encouragement: 'Your heart rhythm is finding balance',
                    color: '#A8B5A6'
                };
                break;
                
            case 'coherent':
                guidance = {
                    message: 'Beautiful coherence! Your heart and breath are in harmony.',
                    breathingTip: 'Maintain this gentle, flowing rhythm',
                    encouragement: 'You are in the coherent flow state',
                    color: '#8A9E88'
                };
                break;
                
            case 'master':
                guidance = {
                    message: 'Exceptional heart coherence achieved. Pure harmony.',
                    breathingTip: 'Trust your inner wisdom to guide the rhythm',
                    encouragement: 'Your coherence radiates into the field',
                    color: '#6B7853'
                };
                break;
        }
        
        this.coherenceState.guidance = guidance;
    }

    // === FIELD COHERENCE INTEGRATION ===

    updateFieldCoherence() {
        // Integrate heart coherence with existing field coherence
        const currentFieldCoherence = parseFloat(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--field-coherence')
        ) || 0.67;
        
        const heartCoherence = this.heartData.coherence;
        
        // Weighted combination: 60% existing field, 40% heart coherence
        const integratedCoherence = (currentFieldCoherence * 0.6) + (heartCoherence * 0.4);
        
        // Update field coherence with biometric enhancement
        document.documentElement.style.setProperty(
            '--field-coherence', 
            integratedCoherence.toString()
        );
        
        // Update biometric-specific field properties
        document.documentElement.style.setProperty(
            '--biometric-field-enhancement', 
            heartCoherence.toString()
        );
        
        this.log(`🌐 Field coherence: ${(integratedCoherence * 100).toFixed(1)}% (${(heartCoherence * 100).toFixed(1)}% biometric)`);
    }

    // === PRIVACY & SECURITY ===

    setupPrivacyProtocols() {
        if (!this.options.privacyMode) return;
        
        // Ensure no biometric data is stored persistently
        this.privacyProtocols = {
            dataRetention: 'session-only',
            storage: 'memory-only',
            transmission: 'none',
            analytics: 'disabled'
        };
        
        // Clear any existing biometric data on page unload
        window.addEventListener('beforeunload', () => {
            this.clearBiometricData();
        });
        
        this.log('🔒 Privacy protocols enabled - no biometric data storage');
    }

    clearBiometricData() {
        this.heartData = {
            heartRate: 70,
            hrv: 0,
            coherence: 0,
            rhythm: 'baseline',
            lastBeat: null,
            beatInterval: []
        };
        
        // Disconnect from devices
        if (this.biometricDevices.active) {
            this.disconnectDevice();
        }
        
        this.log('🧹 Biometric data cleared for privacy');
    }

    // === DEVICE MANAGEMENT ===

    async startHeartMonitoring() {
        if (this.biometricDevices.active) {
            this.log('💓 Heart monitoring already active');
            return;
        }
        
        // Try to connect to the best available device
        for (const device of this.biometricDevices.available) {
            if (await this.connectToDevice(device.type)) {
                this.log(`✅ Connected to ${device.name}`);
                break;
            }
        }
    }

    disconnectDevice() {
        if (!this.biometricDevices.active) return;
        
        const device = this.biometricDevices.active;
        
        try {
            switch (device.type) {
                case 'bluetooth-hr':
                    device.characteristic?.stopNotifications();
                    device.device?.gatt?.disconnect();
                    break;
                case 'camera-hr':
                    device.stream?.getTracks().forEach(track => track.stop());
                    device.video?.remove();
                    break;
            }
        } catch (error) {
            this.log('⚠️ Error disconnecting device:', error);
        }
        
        this.biometricDevices.active = null;
        this.log('🔌 Biometric device disconnected');
    }

    // === UI INTERFACES ===

    createManualInputInterface() {
        // Create a simple interface for manual heart rate input
        const container = document.createElement('div');
        container.id = 'biometric-manual-input';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(232, 230, 225, 0.95);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            z-index: 1000;
            font-family: Georgia, serif;
        `;
        
        container.innerHTML = `
            <div style="margin-bottom: 15px; color: #A8B5A6; font-weight: bold;">
                💓 Heart Rate Input
            </div>
            <input type="number" id="manual-heart-rate" 
                   placeholder="Enter BPM" 
                   min="40" max="200" 
                   style="width: 100px; padding: 8px; border: 1px solid #A8B5A6; border-radius: 6px;">
            <button id="update-heart-rate" 
                    style="margin-left: 10px; padding: 8px 15px; background: #A8B5A6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                Update
            </button>
            <div style="font-size: 0.8em; color: #6B7280; margin-top: 10px;">
                Current: <span id="current-hr">${this.heartData.heartRate}</span> BPM
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Add event listeners
        const input = container.querySelector('#manual-heart-rate');
        const button = container.querySelector('#update-heart-rate');
        const display = container.querySelector('#current-hr');
        
        button.addEventListener('click', () => {
            const heartRate = parseInt(input.value);
            if (heartRate >= 40 && heartRate <= 200) {
                this.updateHeartData({ heartRate });
                display.textContent = heartRate;
                input.value = '';
            }
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                button.click();
            }
        });
    }

    // === UTILITY METHODS ===

    parseHeartRateData(dataValue) {
        // Parse Bluetooth LE heart rate data
        const flags = dataValue.getUint8(0);
        let heartRate;
        
        if (flags & 0x01) {
            heartRate = dataValue.getUint16(1, true);
        } else {
            heartRate = dataValue.getUint8(1);
        }
        
        return heartRate;
    }

    startCameraHeartAnalysis(video) {
        // Simplified photoplethysmography
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 480;
        
        const analyzeFrame = () => {
            ctx.drawImage(video, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Calculate average red channel intensity (simplified PPG)
            let redSum = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                redSum += imageData.data[i]; // Red channel
            }
            
            const avgRed = redSum / (imageData.data.length / 4);
            
            // Store reading for heart rate calculation
            this.processCameraHeartData(avgRed);
            
            if (this.biometricDevices.active?.type === 'camera-hr') {
                requestAnimationFrame(analyzeFrame);
            }
        };
        
        analyzeFrame();
    }

    processCameraHeartData(redIntensity) {
        // Simplified heart rate detection from camera data
        // In production, this would use more sophisticated signal processing
        
        if (!this.cameraHeartBuffer) {
            this.cameraHeartBuffer = [];
        }
        
        this.cameraHeartBuffer.push({
            intensity: redIntensity,
            timestamp: Date.now()
        });
        
        // Keep 10 seconds of data
        const tenSecondsAgo = Date.now() - 10000;
        this.cameraHeartBuffer = this.cameraHeartBuffer.filter(
            reading => reading.timestamp > tenSecondsAgo
        );
        
        // Detect peaks for heart rate calculation
        if (this.cameraHeartBuffer.length > 30) {
            const heartRate = this.calculateHeartRateFromCamera();
            if (heartRate > 0) {
                this.updateHeartData({ heartRate, source: 'camera' });
            }
        }
    }

    calculateHeartRateFromCamera() {
        // Simplified peak detection for heart rate
        const readings = this.cameraHeartBuffer.map(r => r.intensity);
        const timestamps = this.cameraHeartBuffer.map(r => r.timestamp);
        
        // Find peaks in red intensity signal
        const peaks = [];
        for (let i = 1; i < readings.length - 1; i++) {
            if (readings[i] > readings[i-1] && readings[i] > readings[i+1]) {
                const threshold = Math.max(...readings) * 0.6;
                if (readings[i] > threshold) {
                    peaks.push(timestamps[i]);
                }
            }
        }
        
        if (peaks.length < 2) return 0;
        
        // Calculate average interval between peaks
        const intervals = [];
        for (let i = 1; i < peaks.length; i++) {
            intervals.push(peaks[i] - peaks[i-1]);
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const heartRate = 60000 / avgInterval; // Convert to BPM
        
        // Validate reasonable heart rate
        return (heartRate >= 40 && heartRate <= 200) ? Math.round(heartRate) : 0;
    }

    log(...args) {
        if (this.options.debugMode) {
            console.log('[BIOMETRIC COHERENCE]', ...args);
        }
    }

    // === PUBLIC API ===

    async enableHeartSync(deviceType = 'auto') {
        this.options.enableHeartSync = true;
        
        if (deviceType === 'auto') {
            return await this.startHeartMonitoring();
        } else {
            return await this.connectToDevice(deviceType);
        }
    }

    disableHeartSync() {
        this.options.enableHeartSync = false;
        this.disconnectDevice();
    }

    getCurrentHeartState() {
        return {
            heartData: { ...this.heartData },
            coherence: { ...this.coherenceState },
            device: this.biometricDevices.active ? {
                type: this.biometricDevices.active.type,
                connected: true
            } : null,
            timestamp: new Date().toISOString()
        };
    }

    getAvailableDevices() {
        return this.biometricDevices.available.map(device => ({
            type: device.type,
            name: device.name,
            description: device.description,
            accuracy: device.accuracy,
            privacy: device.privacy || 'standard'
        }));
    }

    // Get coherence training progress
    getCoherenceProgress() {
        return {
            currentLevel: this.coherenceState.level,
            coherenceScore: this.heartData.coherence,
            timeInCoherence: this.coherenceState.timeInCoherence,
            heartRate: this.heartData.heartRate,
            hrv: this.heartData.hrv,
            guidance: this.coherenceState.guidance,
            nextTarget: this.getNextCoherenceTarget()
        };
    }

    getNextCoherenceTarget() {
        const level = this.coherenceState.level;
        const targets = {
            beginning: 'Achieve 20% coherence consistently',
            developing: 'Maintain 50% coherence for 2 minutes',
            coherent: 'Reach 80% coherence state',
            master: 'Share your coherence with the field'
        };
        
        return targets[level] || 'Continue practicing';
    }

    // Force coherence recalculation (for testing)
    recalculateCoherence() {
        this.calculateHeartCoherence();
        this.updateBreathingGuidance();
        this.updateFieldCoherence();
        return this.getCurrentHeartState();
    }
}

// === INTEGRATION HELPERS ===

// Auto-initialize biometric heart coherence
function initializeBiometricCoherence(options = {}) {
    return new BiometricHeartCoherence({
        debugMode: true,
        privacyMode: true, // Always protect user privacy
        ...options
    });
}

// === EXPORTS ===

if (typeof window !== 'undefined') {
    window.BiometricHeartCoherence = BiometricHeartCoherence;
    window.initializeBiometricCoherence = initializeBiometricCoherence;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BiometricHeartCoherence,
        initializeBiometricCoherence
    };
}

export {
    BiometricHeartCoherence,
    initializeBiometricCoherence
};