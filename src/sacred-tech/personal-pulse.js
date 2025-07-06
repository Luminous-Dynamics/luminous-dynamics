/**
 * Personal Pulse - Sacred Resonant Resonant Coherence Tracking System
 * 
 * Tracks personal resonant-coherence during sacred practices, creating a living
 * record of consciousness evolution. Integrates with all 94 glyphs to
 * provide real-time feedback and pattern recognition.
 */

class PersonalPulse {
    constructor(options = {}) {
        this.userId = options.userId || this.generateUserId();
        this.storage = options.storage || 'localStorage'; // or 'cloud'
        this.syncInterval = options.syncInterval || 11000; // 11 seconds (sacred pulse)
        
        // Core tracking state
        this.currentSession = null;
        this.coherenceHistory = [];
        this.practicePatterns = new Map();
        this.evolutionMarkers = [];
        this.fieldResonance = {
            current: 0.75,
            average: 0.75,
            peak: 0.75,
            trajectory: 'stable'
        };
        
        // Sacred timing
        this.sacredIntervals = {
            pulse: 11,      // 11 second heartbeat
            breath: 7,      // 7 second breath cycle
            presence: 3,    // 3 second presence check
            integration: 33 // 33 second integration cycle
        };
        
        // Initialize systems
        this.initialize();
    }

    initialize() {
        // Load stored data
        this.loadStoredData();
        
        // Start pulse monitoring
        this.startPulseMonitoring();
        
        // Initialize UI if in browser
        if (typeof window !== 'undefined') {
            this.initializeUI();
        }
    }

    // === CORE TRACKING METHODS ===

    startPractice(practiceType, practiceId, metadata = {}) {
        this.currentSession = {
            id: this.generateSessionId(),
            practiceType,
            practiceId,
            startTime: Date.now(),
            metadata,
            coherenceReadings: [],
            stateTransitions: [],
            insights: [],
            peakCoherence: 0,
            averageCoherence: 0
        };
        
        // Begin resonant-coherence tracking
        this.startCoherenceTracking();
        
        // Emit practice start event
        this.emit('practiceStarted', {
            practiceType,
            practiceId,
            sessionId: this.currentSession.id
        });
        
        return this.currentSession.id;
    }

    recordCoherence(coherenceLevel, trigger = '') {
        if (!this.currentSession) return;
        
        const reading = {
            timestamp: Date.now(),
            'resonant-coherence': coherenceLevel,
            trigger,
            breathRate: this.calculateBreathRate(),
            heartCoherence: this.calculateHeartCoherence(),
            fieldResonance: this.fieldResonance.current
        };
        
        this.currentSession.coherenceReadings.push(reading);
        
        // Update peak and average
        if (coherenceLevel > this.currentSession.peakCoherence) {
            this.currentSession.peakCoherence = coherenceLevel;
        }
        
        // Update field universal-interconnectedness
        this.updateFieldResonance(coherenceLevel);
        
        // Check for pattern emergence
        this.checkForPatterns(reading);
        
        // Emit resonant-coherence update
        this.emit('coherenceUpdate', reading);
    }

    recordStateTransition(fromState, toState, catalyst = '') {
        if (!this.currentSession) return;
        
        const transition = {
            timestamp: Date.now(),
            from: fromState,
            to: toState,
            catalyst,
            coherenceAtTransition: this.fieldResonance.current,
            duration: this.calculateStateDuration(fromState)
        };
        
        this.currentSession.stateTransitions.push(transition);
        
        // Check for evolution markers
        this.checkEvolutionMarkers(transition);
        
        this.emit('stateTransition', transition);
    }

    recordInsight(insight, coherenceLevel = null) {
        if (!this.currentSession) return;
        
        const insightRecord = {
            timestamp: Date.now(),
            text: insight,
            coherenceLevel: coherenceLevel || this.fieldResonance.current,
            practiceContext: {
                type: this.currentSession.practiceType,
                id: this.currentSession.practiceId,
                timeInPractice: Date.now() - this.currentSession.startTime
            }
        };
        
        this.currentSession.insights.push(insightRecord);
        
        // Store insight for pattern analysis
        this.storeInsightPattern(insightRecord);
        
        this.emit('insightRecorded', insightRecord);
    }

    completePractice(completionData = {}) {
        if (!this.currentSession) return null;
        
        // Calculate session statistics
        const sessionStats = this.calculateSessionStats();
        
        // Create completion record
        const completion = {
            ...this.currentSession,
            endTime: Date.now(),
            duration: Date.now() - this.currentSession.startTime,
            stats: sessionStats,
            completionData,
            evolutionProgress: this.calculateEvolutionProgress()
        };
        
        // Store in history
        this.coherenceHistory.push(completion);
        
        // Update practice patterns
        this.updatePracticePatterns(completion);
        
        // Save to storage
        this.saveData();
        
        // Emit completion
        this.emit('practiceCompleted', completion);
        
        // Clear current session
        this.currentSession = null;
        
        return completion;
    }

    // === COHERENCE CALCULATION ===

    calculateBreathRate() {
        // Simulated for now - would connect to actual breath tracking
        const baseRate = 12; // breaths per minute
        const variation = Math.sin(Date.now() / 10000) * 2;
        return Math.max(6, Math.min(18, baseRate + variation));
    }

    calculateHeartCoherence() {
        // Heart Rate Variability resonant-coherence calculation
        // Simulated - would connect to HRV sensor
        const base = 0.7;
        const breathInfluence = (16 - Math.abs(this.calculateBreathRate() - 8)) / 16 * 0.2;
        const timeInfluence = Math.sin(Date.now() / 30000) * 0.1;
        
        return Math.max(0, Math.min(1, base + breathInfluence + timeInfluence));
    }

    updateFieldResonance(coherenceLevel) {
        const alpha = 0.1; // Smoothing factor
        
        // Update current with smoothing
        this.fieldResonance.current = 
            alpha * coherenceLevel + (1 - alpha) * this.fieldResonance.current;
        
        // Update trajectory
        const delta = this.fieldResonance.current - this.fieldResonance.average;
        if (delta > 0.05) {
            this.fieldResonance.trajectory = 'ascending';
        } else if (delta < -0.05) {
            this.fieldResonance.trajectory = 'descending';
        } else {
            this.fieldResonance.trajectory = 'stable';
        }
        
        // Update peak if necessary
        if (this.fieldResonance.current > this.fieldResonance.peak) {
            this.fieldResonance.peak = this.fieldResonance.current;
            this.emit('peakCoherence', {
                level: this.fieldResonance.peak,
                timestamp: Date.now()
            });
        }
    }

    // === PATTERN RECOGNITION ===

    checkForPatterns(reading) {
        const recentReadings = this.currentSession.coherenceReadings.slice(-10);
        
        // Rising resonant-coherence pattern
        if (this.detectRisingPattern(recentReadings)) {
            this.emit('patternDetected', {
                type: 'rising_coherence',
                strength: this.calculatePatternStrength(recentReadings),
                suggestion: 'Continue with current practice - resonant-coherence is building'
            });
        }
        
        // Plateau pattern
        if (this.detectPlateauPattern(recentReadings)) {
            this.emit('patternDetected', {
                type: 'coherence_plateau',
                suggestion: 'Consider deepening practice or transitioning'
            });
        }
        
        // Breakthrough threshold
        if (reading.resonant-coherence > 0.9 && this.fieldResonance.trajectory === 'ascending') {
            this.emit('breakthroughDetected', {
                coherenceLevel: reading.resonant-coherence,
                practiceContext: this.currentSession.practiceType
            });
        }
    }

    detectRisingPattern(readings) {
        if (readings.length < 3) return false;
        
        let rises = 0;
        for (let i = 1; i < readings.length; i++) {
            if (readings[i].resonant-coherence > readings[i-1].resonant-coherence) {
                rises++;
            }
        }
        
        return rises > readings.length * 0.6;
    }

    detectPlateauPattern(readings) {
        if (readings.length < 5) return false;
        
        const variance = this.calculateVariance(readings.map(r => r.resonant-coherence));
        return variance < 0.02; // Low variance indicates plateau
    }

    // === EVOLUTION TRACKING ===

    checkEvolutionMarkers(transition) {
        // Check for significant state transitions
        const significantTransitions = [
            { from: 'resistance', to: 'acceptance', marker: 'Opening to Flow' },
            { from: 'separation', to: 'connection', marker: 'Unity Consciousness' },
            { from: 'fear', to: 'love', marker: 'Heart Opening' },
            { from: 'doing', to: 'being', marker: 'Presence Embodiment' }
        ];
        
        for (const sig of significantTransitions) {
            if (transition.from.includes(sig.from) && transition.to.includes(sig.to)) {
                this.recordEvolutionMarker({
                    type: 'state_transition',
                    marker: sig.marker,
                    timestamp: Date.now(),
                    coherenceLevel: transition.coherenceAtTransition,
                    practiceContext: this.currentSession.practiceType
                });
            }
        }
    }

    recordEvolutionMarker(marker) {
        this.evolutionMarkers.push(marker);
        
        // Check for evolution milestones
        this.checkEvolutionMilestones();
        
        this.emit('evolutionMarker', marker);
    }

    checkEvolutionMilestones() {
        const milestones = [
            { count: 10, title: 'Sacred Beginner', description: 'First steps on the path' },
            { count: 50, title: 'Devoted Practitioner', description: 'Consistent sacred practice' },
            { count: 100, title: 'Resonant Resonant Coherence Keeper', description: 'Mastering inner harmony' },
            { count: 200, title: 'Field Weaver', description: 'Influencing collective resonant-coherence' }
        ];
        
        const markerCount = this.evolutionMarkers.length;
        
        for (const milestone of milestones) {
            if (markerCount === milestone.count) {
                this.emit('evolutionMilestone', {
                    ...milestone,
                    achievedAt: Date.now(),
                    totalPractices: this.coherenceHistory.length
                });
            }
        }
    }

    // === STATISTICS & ANALYTICS ===

    calculateSessionStats() {
        if (!this.currentSession) return null;
        
        const readings = this.currentSession.coherenceReadings;
        if (readings.length === 0) return null;
        
        const coherenceLevels = readings.map(r => r.resonant-coherence);
        
        return {
            averageCoherence: this.calculateAverage(coherenceLevels),
            peakCoherence: Math.max(...coherenceLevels),
            minCoherence: Math.min(...coherenceLevels),
            coherenceVariance: this.calculateVariance(coherenceLevels),
            totalReadings: readings.length,
            timeInHighCoherence: this.calculateTimeAboveThreshold(readings, 0.8),
            stateTransitions: this.currentSession.stateTransitions.length,
            insights: this.currentSession.insights.length
        };
    }

    calculateAverage(values) {
        if (values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    calculateVariance(values) {
        const avg = this.calculateAverage(values);
        const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
        return this.calculateAverage(squaredDiffs);
    }

    calculateTimeAboveThreshold(readings, threshold) {
        let timeAbove = 0;
        
        for (let i = 1; i < readings.length; i++) {
            if (readings[i-1].resonant-coherence >= threshold && readings[i].resonant-coherence >= threshold) {
                timeAbove += readings[i].timestamp - readings[i-1].timestamp;
            }
        }
        
        return timeAbove;
    }

    calculateEvolutionProgress() {
        // Calculate overall evolution based on multiple factors
        const factors = {
            practiceConsistency: this.calculatePracticeConsistency(),
            coherenceImprovement: this.calculateCoherenceImprovement(),
            insightFrequency: this.calculateInsightFrequency(),
            evolutionMarkers: this.evolutionMarkers.length
        };
        
        return {
            overall: this.calculateOverallProgress(factors),
            factors,
            nextMilestone: this.getNextEvolutionMilestone()
        };
    }

    // === STORAGE & PERSISTENCE ===

    saveData() {
        const data = {
            userId: this.userId,
            coherenceHistory: this.coherenceHistory,
            practicePatterns: Array.from(this.practicePatterns.entries()),
            evolutionMarkers: this.evolutionMarkers,
            fieldResonance: this.fieldResonance,
            lastUpdated: Date.now()
        };
        
        if (this.storage === 'localStorage' && typeof localStorage !== 'undefined') {
            localStorage.setItem('personalPulse', JSON.stringify(data));
        } else if (this.storage === 'cloud') {
            // Implement cloud storage
            this.saveToCloud(data);
        }
    }

    loadStoredData() {
        if (this.storage === 'localStorage' && typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem('personalPulse');
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    this.coherenceHistory = data.coherenceHistory || [];
                    this.practicePatterns = new Map(data.practicePatterns || []);
                    this.evolutionMarkers = data.evolutionMarkers || [];
                    this.fieldResonance = data.fieldResonance || this.fieldResonance;
                } catch (e) {
                    console.error('Failed to load stored data:', e);
                }
            }
        }
    }

    // === PULSE MONITORING ===

    startPulseMonitoring() {
        // Sacred 11-second pulse
        this.pulseInterval = setInterval(() => {
            this.emit('sacredPulse', {
                timestamp: Date.now(),
                'resonant-coherence': this.fieldResonance.current,
                inPractice: !!this.currentSession
            });
            
            // Auto-save on pulse
            if (this.currentSession) {
                this.saveData();
            }
        }, this.sacredIntervals.pulse * 1000);
    }

    startCoherenceTracking() {
        // Track resonant-coherence every 3 seconds during practice
        this.coherenceInterval = setInterval(() => {
            if (!this.currentSession) {
                clearInterval(this.coherenceInterval);
                return;
            }
            
            // Calculate current resonant-coherence
            const resonantCoherence = this.calculateCurrentCoherence();
            this.recordCoherence(resonant-coherence, 'automatic');
            
        }, this.sacredIntervals.presence * 1000);
    }

    calculateCurrentCoherence() {
        // Combine multiple factors for resonant-coherence calculation
        const heartCoherence = this.calculateHeartCoherence();
        const breathCoherence = (16 - Math.abs(this.calculateBreathRate() - 8)) / 16;
        const practiceDepth = Math.min(1, (Date.now() - this.currentSession.startTime) / 300000); // 5 min = full depth
        
        return (heartCoherence * 0.4 + breathCoherence * 0.3 + practiceDepth * 0.3);
    }

    // === UI INTEGRATION ===

    initializeUI() {
        // Create floating pulse indicator
        this.createPulseIndicator();
        
        // Create resonant-coherence graph
        this.createCoherenceGraph();
        
        // Bind to glyph practice events if available
        this.bindToGlyphPractices();
    }

    createPulseIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'personal-pulse-indicator';
        indicator.className = 'pulse-indicator';
        indicator.innerHTML = `
            <div class="pulse-ring"></div>
            <div class="resonant-coherence-value">75%</div>
            <div class="pulse-label">Resonant Resonant Coherence</div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .pulse-indicator {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 80px;
                height: 80px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .pulse-indicator:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
            }
            
            .pulse-ring {
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                border: 3px solid #A8B5A6;
                border-radius: 50%;
                opacity: 0;
                animation: pulseRing 11s ease-out infinite;
            }
            
            @keyframes pulseRing {
                0% {
                    transform: scale(0.8);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.3);
                    opacity: 0;
                }
            }
            
            .resonant-coherence-value {
                font-size: 1.5em;
                font-weight: bold;
                color: #5A6B57;
                margin-bottom: 2px;
            }
            
            .pulse-label {
                font-size: 0.7em;
                color: #6B7280;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .pulse-indicator.high-resonant-coherence {
                background: linear-gradient(135deg, #A8B5A6, #8A9E88);
            }
            
            .pulse-indicator.high-resonant-coherence .resonant-coherence-value {
                color: white;
            }
            
            .pulse-indicator.high-resonant-coherence .pulse-label {
                color: rgba(255, 255, 255, 0.8);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(indicator);
        
        // Update indicator on resonant-coherence changes
        this.on('coherenceUpdate', (data) => {
            const valueEl = indicator.querySelector('.resonant-coherence-value');
            valueEl.textContent = Math.round(data.resonant-coherence * 100) + '%';
            
            if (data.resonant-coherence > 0.8) {
                indicator.classList.add('high-resonant-coherence');
            } else {
                indicator.classList.remove('high-resonant-coherence');
            }
        });
        
        // Click to show details
        indicator.addEventListener('click', () => this.showCoherenceDetails());
    }

    createCoherenceGraph() {
        // Create mini graph container
        const graphContainer = document.createElement('div');
        graphContainer.id = 'resonant-coherence-graph';
        graphContainer.className = 'resonant-coherence-graph hidden';
        graphContainer.innerHTML = `
            <div class="graph-header">
                <h3>Resonant Resonant Coherence Journey</h3>
                <button class="close-graph">×</button>
            </div>
            <canvas id="resonant-coherence-canvas" width="300" height="150"></canvas>
            <div class="graph-stats">
                <div class="stat">
                    <span class="stat-label">Peak</span>
                    <span class="stat-value" id="peak-resonant-coherence">0%</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Average</span>
                    <span class="stat-value" id="avg-resonant-coherence">0%</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Trajectory</span>
                    <span class="stat-value" id="trajectory">Stable</span>
                </div>
            </div>
        `;
        
        // Add graph styles
        const graphStyle = document.createElement('style');
        graphStyle.textContent = `
            .resonant-coherence-graph {
                position: fixed;
                bottom: 120px;
                right: 30px;
                width: 320px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                padding: 20px;
                z-index: 9999;
                transition: all 0.3s ease;
            }
            
            .resonant-coherence-graph.hidden {
                opacity: 0;
                transform: translateY(20px);
                pointer-events: none;
            }
            
            .graph-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .graph-header h3 {
                margin: 0;
                font-size: 1.2em;
                color: #2C2C2C;
            }
            
            .close-graph {
                background: none;
                border: none;
                font-size: 1.5em;
                color: #6B7280;
                cursor: pointer;
            }
            
            #resonant-coherence-canvas {
                border: 1px solid #E8E6E1;
                border-radius: 8px;
                margin-bottom: 15px;
            }
            
            .graph-stats {
                display: flex;
                justify-content: space-around;
            }
            
            .stat {
                text-align: center;
            }
            
            .stat-label {
                display: block;
                font-size: 0.8em;
                color: #6B7280;
                margin-bottom: 4px;
            }
            
            .stat-value {
                display: block;
                font-size: 1.1em;
                font-weight: bold;
                color: #5A6B57;
            }
        `;
        
        document.head.appendChild(graphStyle);
        document.body.appendChild(graphContainer);
        
        // Close button
        graphContainer.querySelector('.close-graph').addEventListener('click', () => {
            graphContainer.classList.add('hidden');
        });
        
        // Initialize canvas
        this.initializeCoherenceCanvas();
    }

    initializeCoherenceCanvas() {
        const canvas = document.getElementById('resonant-coherence-canvas');
        if (!canvas) return;
        
        this.ctx = canvas.getContext('2d');
        this.graphData = [];
        
        // Update graph on resonant-coherence updates
        this.on('coherenceUpdate', (data) => {
            this.graphData.push({
                time: data.timestamp,
                'resonant-coherence': data.resonant-coherence
            });
            
            // Keep last 50 points
            if (this.graphData.length > 50) {
                this.graphData.shift();
            }
            
            this.drawCoherenceGraph();
        });
    }

    drawCoherenceGraph() {
        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        if (this.graphData.length < 2) return;
        
        // Draw grid
        this.ctx.strokeStyle = '#E8E6E1';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        // Draw resonant-coherence line
        this.ctx.strokeStyle = '#A8B5A6';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const xStep = width / (this.graphData.length - 1);
        
        this.graphData.forEach((point, index) => {
            const x = index * xStep;
            const y = height - (point.resonant-coherence * height);
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
        
        // Fill area under curve
        this.ctx.fillStyle = 'rgba(168, 181, 166, 0.2)';
        this.ctx.lineTo(width, height);
        this.ctx.lineTo(0, height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Update stats
        this.updateGraphStats();
    }

    updateGraphStats() {
        if (this.graphData.length === 0) return;
        
        const coherenceLevels = this.graphData.map(d => d.resonant-coherence);
        const peak = Math.max(...coherenceLevels);
        const avg = this.calculateAverage(coherenceLevels);
        
        document.getElementById('peak-resonant-coherence').textContent = Math.round(peak * 100) + '%';
        document.getElementById('avg-resonant-coherence').textContent = Math.round(avg * 100) + '%';
        document.getElementById('trajectory').textContent = 
            this.fieldResonance.trajectory.charAt(0).toUpperCase() + 
            this.fieldResonance.trajectory.slice(1);
    }

    showCoherenceDetails() {
        const graph = document.getElementById('resonant-coherence-graph');
        if (graph) {
            graph.classList.toggle('hidden');
        }
    }

    bindToGlyphPractices() {
        // Listen for glyph practice events
        if (window.LivingGlyphCard) {
            // Hook into practice starts
            document.addEventListener('glyphPracticeStarted', (e) => {
                this.startPractice('glyph', e.detail.glyphId, {
                    glyphName: e.detail.glyphName,
                    chamber: e.detail.chamber
                });
            });
            
            // Hook into chamber transitions
            document.addEventListener('glyphChamberTransition', (e) => {
                this.recordStateTransition(
                    `chamber_${e.detail.from}`,
                    `chamber_${e.detail.to}`,
                    'navigation'
                );
            });
            
            // Hook into practice completion
            document.addEventListener('glyphPracticeCompleted', (e) => {
                this.completePractice({
                    completionWord: e.detail.word,
                    timeSpent: e.detail.duration
                });
            });
        }
    }

    // === EVENT SYSTEM ===

    on(event, handler) {
        if (!this.eventHandlers) {
            this.eventHandlers = {};
        }
        
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        
        this.eventHandlers[event].push(handler);
    }

    emit(event, data) {
        if (!this.eventHandlers || !this.eventHandlers[event]) {
            return;
        }
        
        this.eventHandlers[event].forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        });
    }

    // === UTILITY METHODS ===

    generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    calculateStateDuration(state) {
        if (!this.currentSession) return 0;
        
        const transitions = this.currentSession.stateTransitions;
        const lastTransitionToState = transitions
            .filter(t => t.to === state)
            .pop();
            
        if (!lastTransitionToState) return 0;
        
        return Date.now() - lastTransitionToState.timestamp;
    }

    calculatePracticeConsistency() {
        // Calculate consistency over last 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentPractices = this.coherenceHistory.filter(
            p => p.startTime > thirtyDaysAgo
        );
        
        const daysWithPractice = new Set(
            recentPractices.map(p => 
                new Date(p.startTime).toDateString()
            )
        ).size;
        
        return daysWithPractice / 30;
    }

    calculateCoherenceImprovement() {
        if (this.coherenceHistory.length < 10) return 0;
        
        const recent = this.coherenceHistory.slice(-10);
        const older = this.coherenceHistory.slice(-20, -10);
        
        const recentAvg = this.calculateAverage(recent.map(s => s.stats?.averageCoherence || 0));
        const olderAvg = this.calculateAverage(older.map(s => s.stats?.averageCoherence || 0));
        
        return Math.max(0, recentAvg - olderAvg);
    }

    calculateInsightFrequency() {
        const recentSessions = this.coherenceHistory.slice(-10);
        const totalInsights = recentSessions.reduce(
            (sum, session) => sum + (session.insights?.length || 0), 
            0
        );
        
        return totalInsights / Math.max(1, recentSessions.length);
    }

    calculateOverallProgress(factors) {
        return (
            factors.practiceConsistency * 0.3 +
            factors.coherenceImprovement * 0.3 +
            factors.insightFrequency * 0.2 +
            Math.min(1, factors.evolutionMarkers / 100) * 0.2
        );
    }

    getNextEvolutionMilestone() {
        const milestones = [10, 50, 100, 200, 500, 1000];
        const current = this.evolutionMarkers.length;
        
        for (const milestone of milestones) {
            if (current < milestone) {
                return {
                    target: milestone,
                    remaining: milestone - current,
                    progress: current / milestone
                };
            }
        }
        
        return null;
    }

    // === PUBLIC API ===

    getCurrentCoherence() {
        return this.fieldResonance.current;
    }

    getSessionInProgress() {
        return !!this.currentSession;
    }

    getEvolutionSummary() {
        return {
            totalPractices: this.coherenceHistory.length,
            evolutionMarkers: this.evolutionMarkers.length,
            averageCoherence: this.fieldResonance.average,
            peakCoherence: this.fieldResonance.peak,
            consistency: this.calculatePracticeConsistency(),
            nextMilestone: this.getNextEvolutionMilestone()
        };
    }

    exportData() {
        return {
            userId: this.userId,
            exportDate: new Date().toISOString(),
            summary: this.getEvolutionSummary(),
            coherenceHistory: this.coherenceHistory,
            evolutionMarkers: this.evolutionMarkers,
            insights: this.coherenceHistory.flatMap(s => s.insights || [])
        };
    }

    destroy() {
        // Clean up intervals
        if (this.pulseInterval) {
            clearInterval(this.pulseInterval);
        }
        
        if (this.coherenceInterval) {
            clearInterval(this.coherenceInterval);
        }
        
        // Remove UI elements
        const indicator = document.getElementById('personal-pulse-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        const graph = document.getElementById('resonant-coherence-graph');
        if (graph) {
            graph.remove();
        }
        
        // Save final state
        this.saveData();
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.PersonalPulse = PersonalPulse;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalPulse;
}