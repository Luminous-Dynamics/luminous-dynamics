/**
 * Biometric Integration for LuminousOS
 * 
 * Supports:
 * - Web Bluetooth for HRV sensors (Polar H10, etc)
 * - WebUSB for breath sensors
 * - Camera-based pulse detection
 * - Microphone-based breath detection
 * - Mock data for development
 */

class BiometricIntegration {
    constructor() {
        this.devices = {
            hrv: null,
            breath: null
        };
        
        this.data = {
            heartRate: 70,
            hrv: 50,
            breathRate: 12,
            breathPhase: 0,
            coherence: 0.7
        };
        
        this.listeners = new Set();
        this.isSimulated = true;
        this.simulationInterval = null;
        
        // Check available APIs
        this.capabilities = {
            bluetooth: 'bluetooth' in navigator,
            usb: 'usb' in navigator,
            camera: 'mediaDevices' in navigator,
            microphone: 'mediaDevices' in navigator
        };
    }
    
    // Add listener for data updates
    addListener(callback) {
        this.listeners.add(callback);
    }
    
    removeListener(callback) {
        this.listeners.delete(callback);
    }
    
    // Notify all listeners of data update
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.data));
    }
    
    // Initialize biometric monitoring
    async initialize() {
        console.log('🫀 Initializing biometric integration...');
        console.log('Available APIs:', this.capabilities);
        
        // Try to connect to real devices
        let connected = false;
        
        if (this.capabilities.bluetooth) {
            connected = await this.connectBluetoothHRV();
        }
        
        if (!connected && this.capabilities.camera) {
            connected = await this.startCameraPulseDetection();
        }
        
        if (!connected) {
            console.log('📊 No biometric devices found, using simulated data');
            this.startSimulation();
        }
        
        return true;
    }
    
    // Connect to Bluetooth HRV sensor
    async connectBluetoothHRV() {
        try {
            // Request device with heart rate service
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }],
                optionalServices: ['battery_service']
            });
            
            console.log('🔗 Connecting to', device.name);
            const server = await device.gatt.connect();
            
            // Get heart rate service
            const service = await server.getPrimaryService('heart_rate');
            const characteristic = await service.getCharacteristic('heart_rate_measurement');
            
            // Start notifications
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                this.handleHeartRateData(event.target.value);
            });
            
            this.devices.hrv = device;
            this.isSimulated = false;
            
            console.log('✅ Bluetooth HRV connected');
            return true;
            
        } catch (error) {
            console.log('Bluetooth connection failed:', error.message);
            return false;
        }
    }
    
    // Handle heart rate data from Bluetooth
    handleHeartRateData(value) {
        // Parse heart rate measurement characteristic
        const flags = value.getUint8(0);
        const rate16Bits = flags & 0x1;
        let heartRate;
        
        if (rate16Bits) {
            heartRate = value.getUint16(1, true);
        } else {
            heartRate = value.getUint8(1);
        }
        
        // Update data
        this.data.heartRate = heartRate;
        
        // Calculate HRV (simplified - real HRV needs RR intervals)
        this.calculateHRV();
        
        // Update coherence
        this.updateCoherence();
        
        this.notifyListeners();
    }
    
    // Camera-based pulse detection
    async startCameraPulseDetection() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });
            
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            
            let samples = [];
            const sampleRate = 30; // fps
            const windowSize = 256; // samples for FFT
            
            const processFrame = () => {
                ctx.drawImage(video, 0, 0);
                const imageData = ctx.getImageData(320, 240, 50, 50); // Sample center
                
                // Extract red channel average (blood flow indicator)
                let redSum = 0;
                for (let i = 0; i < imageData.data.length; i += 4) {
                    redSum += imageData.data[i];
                }
                const redAvg = redSum / (imageData.data.length / 4);
                
                samples.push(redAvg);
                if (samples.length > windowSize) {
                    samples.shift();
                }
                
                // Detect pulse when we have enough samples
                if (samples.length === windowSize) {
                    const heartRate = this.detectPulseFromSamples(samples, sampleRate);
                    if (heartRate > 40 && heartRate < 180) {
                        this.data.heartRate = heartRate;
                        this.calculateHRV();
                        this.updateCoherence();
                        this.notifyListeners();
                    }
                }
                
                requestAnimationFrame(processFrame);
            };
            
            processFrame();
            this.isSimulated = false;
            console.log('📷 Camera pulse detection started');
            return true;
            
        } catch (error) {
            console.log('Camera access failed:', error.message);
            return false;
        }
    }
    
    // Detect pulse from camera samples using FFT
    detectPulseFromSamples(samples, sampleRate) {
        // Simple peak detection (real implementation would use FFT)
        const normalized = this.normalizeSignal(samples);
        const peaks = this.findPeaks(normalized);
        
        if (peaks.length < 2) return 70; // Default
        
        // Calculate average interval between peaks
        let intervals = [];
        for (let i = 1; i < peaks.length; i++) {
            intervals.push(peaks[i] - peaks[i-1]);
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const beatsPerSample = 1 / avgInterval;
        const bpm = beatsPerSample * sampleRate * 60;
        
        return Math.round(bpm);
    }
    
    // Normalize signal for processing
    normalizeSignal(samples) {
        const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
        const normalized = samples.map(s => s - mean);
        
        // Apply simple moving average filter
        const filtered = [];
        const windowSize = 5;
        
        for (let i = 0; i < normalized.length; i++) {
            let sum = 0;
            let count = 0;
            
            for (let j = Math.max(0, i - windowSize); j <= Math.min(normalized.length - 1, i + windowSize); j++) {
                sum += normalized[j];
                count++;
            }
            
            filtered.push(sum / count);
        }
        
        return filtered;
    }
    
    // Find peaks in signal
    findPeaks(signal) {
        const peaks = [];
        const threshold = Math.max(...signal) * 0.6;
        
        for (let i = 1; i < signal.length - 1; i++) {
            if (signal[i] > threshold &&
                signal[i] > signal[i-1] &&
                signal[i] > signal[i+1]) {
                peaks.push(i);
            }
        }
        
        return peaks;
    }
    
    // Calculate HRV from heart rate data
    calculateHRV() {
        // Simplified HRV calculation
        // Real HRV requires RR intervals over time
        const baseHRV = 50;
        const variation = (Math.random() - 0.5) * 20;
        this.data.hrv = Math.max(20, Math.min(100, baseHRV + variation));
    }
    
    // Update coherence based on HRV and breath
    updateCoherence() {
        // HeartMath coherence algorithm approximation
        // High HRV + steady breath rate = high coherence
        
        const hrvScore = this.data.hrv / 100;
        const breathScore = Math.abs(this.data.breathRate - 6) < 2 ? 1 : 0.5;
        
        // Coherence is combination of HRV and breath rhythm
        this.data.coherence = (hrvScore * 0.7 + breathScore * 0.3);
    }
    
    // Breath detection via microphone
    async startMicrophoneBreathDetection() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { echoCancellation: false, noiseSuppression: false } 
            });
            
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            
            source.connect(analyser);
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            let breathSamples = [];
            
            const detectBreath = () => {
                analyser.getByteFrequencyData(dataArray);
                
                // Low frequency energy (breath sounds are typically < 300Hz)
                let lowFreqEnergy = 0;
                const lowFreqBins = Math.floor(300 * bufferLength / (audioContext.sampleRate / 2));
                
                for (let i = 0; i < lowFreqBins; i++) {
                    lowFreqEnergy += dataArray[i];
                }
                
                lowFreqEnergy /= lowFreqBins;
                breathSamples.push(lowFreqEnergy);
                
                if (breathSamples.length > 300) { // 10 seconds at 30fps
                    breathSamples.shift();
                    
                    // Detect breath rate from energy pattern
                    const breathRate = this.detectBreathRate(breathSamples);
                    this.data.breathRate = breathRate;
                    this.data.breathPhase = (breathSamples[breathSamples.length - 1] / 255);
                    
                    this.updateCoherence();
                    this.notifyListeners();
                }
                
                requestAnimationFrame(detectBreath);
            };
            
            detectBreath();
            console.log('🎤 Microphone breath detection started');
            return true;
            
        } catch (error) {
            console.log('Microphone access failed:', error.message);
            return false;
        }
    }
    
    // Detect breath rate from audio samples
    detectBreathRate(samples) {
        // Find breath cycles (peaks and valleys)
        const peaks = this.findPeaks(samples);
        
        if (peaks.length < 2) return 12; // Default breath rate
        
        // Calculate average cycle length
        let cycleLengths = [];
        for (let i = 1; i < peaks.length; i++) {
            cycleLengths.push(peaks[i] - peaks[i-1]);
        }
        
        const avgCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
        const breathsPerMinute = (30 * 60) / avgCycleLength; // 30fps
        
        return Math.round(breathsPerMinute);
    }
    
    // Start simulated biometric data
    startSimulation() {
        this.isSimulated = true;
        
        // Simulate coherent breathing pattern
        let time = 0;
        
        this.simulationInterval = setInterval(() => {
            time += 0.1;
            
            // Simulate 4-7 breath pattern (coherent breathing)
            const breathCycle = 11; // seconds
            const breathPhase = (time % breathCycle) / breathCycle;
            
            if (breathPhase < 0.36) { // 4 seconds in
                this.data.breathPhase = breathPhase / 0.36;
            } else { // 7 seconds out
                this.data.breathPhase = 1 - (breathPhase - 0.36) / 0.64;
            }
            
            // Heart rate varies with breath (RSA - Respiratory Sinus Arrhythmia)
            const baseHR = 70;
            const rsaAmplitude = 10;
            this.data.heartRate = Math.round(baseHR + rsaAmplitude * Math.sin(breathPhase * Math.PI * 2));
            
            // HRV increases with coherent breathing
            this.data.hrv = 40 + Math.random() * 20 + (this.data.breathPhase * 20);
            
            // Breath rate
            this.data.breathRate = 60 / breathCycle;
            
            // Update coherence
            this.updateCoherence();
            
            this.notifyListeners();
            
        }, 100);
    }
    
    // Stop simulation
    stopSimulation() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }
    
    // Get current biometric data
    getData() {
        return { ...this.data };
    }
    
    // Connect to USB breath sensor
    async connectUSBBreathSensor() {
        try {
            const device = await navigator.usb.requestDevice({
                filters: [
                    { vendorId: 0x2341 }, // Arduino
                    { vendorId: 0x0403 }  // FTDI
                ]
            });
            
            await device.open();
            await device.selectConfiguration(1);
            await device.claimInterface(0);
            
            console.log('🌬️ USB breath sensor connected');
            
            // Read data loop
            const readData = async () => {
                const result = await device.transferIn(1, 64);
                if (result.data && result.data.byteLength > 0) {
                    const decoder = new TextDecoder();
                    const data = decoder.decode(result.data);
                    
                    // Parse breath sensor data (format depends on device)
                    const values = data.split(',');
                    if (values.length >= 2) {
                        this.data.breathRate = parseFloat(values[0]) || this.data.breathRate;
                        this.data.breathPhase = parseFloat(values[1]) || this.data.breathPhase;
                        
                        this.updateCoherence();
                        this.notifyListeners();
                    }
                }
                
                // Continue reading
                setTimeout(readData, 50);
            };
            
            readData();
            this.isSimulated = false;
            return true;
            
        } catch (error) {
            console.log('USB connection failed:', error.message);
            return false;
        }
    }
    
    // Disconnect all devices
    async disconnect() {
        this.stopSimulation();
        
        if (this.devices.hrv && this.devices.hrv.gatt.connected) {
            await this.devices.hrv.gatt.disconnect();
        }
        
        // Stop any media streams
        const tracks = document.querySelectorAll('video').forEach(video => {
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
            }
        });
        
        console.log('🔌 Biometric devices disconnected');
    }
}

// Export for use in LuminousOS
window.BiometricIntegration = BiometricIntegration;