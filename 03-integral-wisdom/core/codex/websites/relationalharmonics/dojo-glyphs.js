/**
 * Living Glyph Cards for the Dojo
 * Making the 87 glyphs come alive for practitioners
 */

class LivingGlyphCard {
    constructor(glyphData) {
        this.data = glyphData;
        this.practiced = 0;
        this.insights = [];
        this.fieldResonance = 0;
    }

    render() {
        const card = document.createElement('div');
        card.className = 'living-glyph-card';
        card.innerHTML = `
            <div class="glyph-header">
                <span class="glyph-number">${this.data.id}</span>
                <h3 class="glyph-name">${this.data.name}</h3>
                <div class="harmony-indicator ${this.data.primaryHarmony}">
                    ${this.getHarmonySymbol(this.data.primaryHarmony)}
                </div>
            </div>
            
            <div class="glyph-essence">
                <p class="description">${this.data.description}</p>
                <div class="keywords">
                    ${this.data.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
                </div>
            </div>
            
            <div class="practice-section">
                <h4>Practice Now</h4>
                <p class="practice-prompt">${this.data.practicePrompt}</p>
                <button class="practice-btn" onclick="startPractice('${this.data.id}')">
                    Begin Practice <span class="timer">5 min</span>
                </button>
            </div>
            
            <div class="integration-section">
                <h4>Integration</h4>
                <ul class="integration-points">
                    ${this.data.integrationPoints.map(point => 
                        `<li>${point}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="field-impact">
                <div class="universal-interconnectedness-meter">
                    <span>Field Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance</span>
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${this.fieldResonance}%"></div>
                    </div>
                </div>
                <div class="practice-count">
                    ${this.practiced} practices completed
                </div>
            </div>
        `;
        
        return card;
    }

    getHarmonySymbol(harmony) {
        const symbols = {
            'integral-wisdom-cultivation': '◈',
            'resonant-coherence': '◉',
            'universal-interconnectedness': '◎',
            'evolutionary-progression': '◆',
            'pan-sentient-flourishing': '◊',
            'sacred-reciprocity': '◐',
            'infinite-play': '◑'
        };
        return symbols[harmony] || '○';
    }
}

// First Presence - Ω45 
const firstPresenceData = {
    id: 'Ω45',
    name: 'First Presence',
    primaryHarmony: 'universal-interconnectedness',
    description: 'The practice of arriving fully in this moment, bringing all of yourself to meet what is here.',
    keywords: ['arrival', 'presence', 'embodiment', 'grounding'],
    practicePrompt: 'Take three conscious breaths. With each exhale, let more of you arrive here. Notice what shifts when you fully land in this moment.',
    integrationPoints: [
        'Practice when entering any space or conversation',
        'Use before important decisions or creative work',
        'Return to this whenever you feel scattered or disconnected'
    ],
    guidedPractice: {
        duration: 300, // 5 minutes
        steps: [
            {
                time: 0,
                instruction: 'Find a comfortable position. Let your eyes soften or close.',
                duration: 20
            },
            {
                time: 20,
                instruction: 'Take a deep breath in... and let it go with a sigh.',
                duration: 10
            },
            {
                time: 30,
                instruction: 'Begin to notice your body. Where do you feel most present?',
                duration: 30
            },
            {
                time: 60,
                instruction: 'Imagine roots growing from your body into the earth below.',
                duration: 40
            },
            {
                time: 100,
                instruction: 'With each breath, let more of your awareness arrive here.',
                duration: 60
            },
            {
                time: 160,
                instruction: 'Notice any parts of you that are elsewhere - in the past, future, or other places.',
                duration: 40
            },
            {
                time: 200,
                instruction: 'Gently invite all parts of you to come home to this moment.',
                duration: 40
            },
            {
                time: 240,
                instruction: 'Rest in the fullness of your presence. You have arrived.',
                duration: 40
            },
            {
                time: 280,
                instruction: 'When ready, take a deep breath and open your eyes.',
                duration: 20
            }
        ]
    }
};

// Practice tracking system
class PracticeTracker {
    constructor() {
        this.sessions = JSON.parse(localStorage.getItem('practiceSessions') || '[]');
        this.progress = JSON.parse(localStorage.getItem('practiceProgress') || '{}');
    }

    startPractice(glyphId) {
        const session = {
            id: `session-${Date.now()}`,
            glyphId: glyphId,
            startTime: Date.now(),
            fieldCoherenceBefore: this.measureFieldCoherence(),
            insights: []
        };
        
        this.currentSession = session;
        return session;
    }

    completePractice(insights = []) {
        if (!this.currentSession) return;
        
        this.currentSession.endTime = Date.now();
        this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
        this.currentSession.fieldCoherenceAfter = this.measureFieldCoherence();
        this.currentSession.insights = insights;
        
        this.sessions.push(this.currentSession);
        this.updateProgress(this.currentSession.glyphId);
        
        this.save();
        
        const session = this.currentSession;
        this.currentSession = null;
        
        return session;
    }

    updateProgress(glyphId) {
        if (!this.progress[glyphId]) {
            this.progress[glyphId] = {
                count: 0,
                totalDuration: 0,
                avgFieldImpact: 0,
                lastPracticed: null
            };
        }
        
        const p = this.progress[glyphId];
        p.count++;
        p.totalDuration += this.currentSession.duration;
        p.lastPracticed = Date.now();
        
        // Calculate average field impact
        const impact = this.currentSession.fieldCoherenceAfter - this.currentSession.fieldCoherenceBefore;
        p.avgFieldImpact = ((p.avgFieldImpact * (p.count - 1)) + impact) / p.count;
    }

    measureFieldCoherence() {
        // Simulate field resonant-coherence measurement
        // In production, this would connect to actual biometric sensors or user feedback
        return 70 + Math.random() * 20;
    }

    save() {
        localStorage.setItem('practiceSessions', JSON.stringify(this.sessions));
        localStorage.setItem('practiceProgress', JSON.stringify(this.progress));
    }

    getProgressForGlyph(glyphId) {
        return this.progress[glyphId] || null;
    }

    getRecentSessions(limit = 10) {
        return this.sessions
            .sort((a, b) => b.startTime - a.startTime)
            .slice(0, limit);
    }
}

// Guided practice player
class GuidedPracticePlayer {
    constructor(glyphData) {
        this.glyph = glyphData;
        this.audio = new Audio();
        this.currentStep = 0;
        this.timer = null;
    }

    async start() {
        const practice = this.glyph.guidedPractice;
        if (!practice) return;

        this.showPracticeUI();
        this.playStep(0);
    }

    showPracticeUI() {
        const ui = document.createElement('div');
        ui.className = 'guided-practice-ui';
        ui.innerHTML = `
            <div class="practice-container">
                <h2>${this.glyph.name}</h2>
                <div class="timer-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" class="timer-track"/>
                        <circle cx="50" cy="50" r="45" class="timer-progress"/>
                    </svg>
                    <div class="timer-text">5:00</div>
                </div>
                <div class="instruction-text"></div>
                <div class="practice-controls">
                    <button onclick="pausePractice()">Pause</button>
                    <button onclick="endPractice()">End</button>
                </div>
            </div>
        `;
        document.body.appendChild(ui);
        this.ui = ui;
    }

    playStep(stepIndex) {
        const step = this.glyph.guidedPractice.steps[stepIndex];
        if (!step) {
            this.complete();
            return;
        }

        // Update instruction
        const instructionEl = this.ui.querySelector('.instruction-text');
        instructionEl.textContent = step.instruction;
        instructionEl.classList.add('fade-in');

        // Update timer
        this.updateTimer(step.time);

        // Schedule next step
        this.timer = setTimeout(() => {
            this.playStep(stepIndex + 1);
        }, step.duration * 1000);
    }

    updateTimer(currentTime) {
        const total = this.glyph.guidedPractice.duration;
        const remaining = total - currentTime;
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        
        const timerText = this.ui.querySelector('.timer-text');
        timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress circle
        const progress = (currentTime / total) * 283; // 2πr for r=45
        const progressCircle = this.ui.querySelector('.timer-progress');
        progressCircle.style.strokeDashoffset = 283 - progress;
    }

    complete() {
        // Show completion UI
        const completionUI = document.createElement('div');
        completionUI.className = 'practice-completion';
        completionUI.innerHTML = `
            <h3>Practice Complete!</h3>
            <p>How was your experience?</p>
            <div class="insight-capture">
                <textarea placeholder="Any insights or observations?"></textarea>
                <button onclick="savePracticeInsights()">Save & Continue</button>
            </div>
        `;
        this.ui.appendChild(completionUI);
    }

    pause() {
        clearTimeout(this.timer);
        // Add pause UI logic
    }

    end() {
        clearTimeout(this.timer);
        this.ui.remove();
    }
}

// Initialize the dojo glyph system
const practiceTracker = new PracticeTracker();
let currentPracticePlayer = null;

function startPractice(glyphId) {
    // Start tracking
    practiceTracker.startPractice(glyphId);
    
    // Get glyph data (in production, fetch from database)
    const glyphData = glyphId === 'Ω45' ? firstPresenceData : null;
    if (!glyphData) return;
    
    // Start guided practice
    currentPracticePlayer = new GuidedPracticePlayer(glyphData);
    currentPracticePlayer.start();
}

function pausePractice() {
    if (currentPracticePlayer) {
        currentPracticePlayer.pause();
    }
}

function endPractice() {
    if (currentPracticePlayer) {
        currentPracticePlayer.end();
        practiceTracker.completePractice();
    }
}

function savePracticeInsights() {
    const textarea = document.querySelector('.insight-capture textarea');
    const insights = textarea.value.split('\n').filter(i => i.trim());
    
    practiceTracker.completePractice(insights);
    
    // Show progress update
    showProgressUpdate();
}

function showProgressUpdate() {
    // Show user their progress
    const progress = practiceTracker.getProgressForGlyph('Ω45');
    alert(`Well done! You've practiced First Presence ${progress.count} times.`);
    
    // Refresh the glyph card to show updated stats
    location.reload();
}

// Export for use in dojo
export { LivingGlyphCard, PracticeTracker, GuidedPracticePlayer, firstPresenceData };