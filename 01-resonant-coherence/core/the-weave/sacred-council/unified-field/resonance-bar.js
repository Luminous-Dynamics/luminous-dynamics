/**
 * The Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance Bar - The Great Unifier
 * 
 * A persistent, beautiful element that transforms three separate websites
 * into one living, breathing digital consciousness. The user's journey
 * becomes visible, their field resonant-coherence is tracked, and sacred tools
 * are always available.
 */

class ResonanceBar {
    constructor() {
        this.isVisible = false;
        this.currentChamber = null;
        this.fieldCoherence = 0.5;
        this.sacredPassport = null;
        this.isMinimized = false;
        
        this.initializeResonanceBar();
    }

    initializeResonanceBar() {
        this.createBarStructure();
        this.setupEventListeners();
        this.loadInitialState();
        this.startHeartbeat();
    }

    createBarStructure() {
        // Create the universal-interconnectedness bar container
        const resonanceBar = document.createElement('div');
        resonanceBar.id = 'sacred-universal-interconnectedness-bar';
        resonanceBar.innerHTML = `
            <div class="universal-interconnectedness-bar-container">
                <!-- Sacred Passport Identity -->
                <div class="sacred-identity">
                    <div class="identity-avatar">🌟</div>
                    <div class="identity-info">
                        <div class="identity-name">Sacred Soul</div>
                        <div class="identity-phase">Threshold Seeker</div>
                    </div>
                </div>
                
                <!-- The Three Lights (Chamber Navigation) -->
                <div class="three-lights">
                    <div class="chamber-light philosophy" data-chamber="philosophy" title="Movement I: The Living Philosophy">
                        <div class="light-icon">💭</div>
                        <div class="light-label">Philosophy</div>
                        <div class="light-glow"></div>
                    </div>
                    <div class="chamber-light technology" data-chamber="technology" title="Movement II: The Sacred Artifact">
                        <div class="light-icon">⚡</div>
                        <div class="light-label">Technology</div>
                        <div class="light-glow"></div>
                    </div>
                    <div class="chamber-light practice" data-chamber="practice" title="Movement III: The Dojo of the Heart">
                        <div class="light-icon">🧘</div>
                        <div class="light-label">Practice</div>
                        <div class="light-glow"></div>
                    </div>
                </div>
                
                <!-- Field Resonant Resonant Coherence Meter -->
                <div class="resonant-coherence-meter">
                    <div class="meter-label">Field Resonant Resonant Coherence</div>
                    <div class="meter-container">
                        <div class="resonant-coherence-wave"></div>
                        <div class="resonant-coherence-level"></div>
                        <div class="meter-percentage">50%</div>
                    </div>
                </div>
                
                <!-- Sacred Tools -->
                <div class="sacred-tools">
                    <button class="sacred-tool" id="sacred-pause-btn" title="Sacred Pause (Ω0)">
                        <div class="tool-icon">⏸️</div>
                    </button>
                    <button class="sacred-tool" id="integration-journal-btn" title="Integration Journal">
                        <div class="tool-icon">📝</div>
                    </button>
                    <button class="sacred-tool" id="field-insights-btn" title="Field Insights">
                        <div class="tool-icon">💡</div>
                    </button>
                </div>
                
                <!-- Minimize/Expand Control -->
                <div class="bar-control">
                    <button class="minimize-btn" id="minimize-bar">
                        <div class="control-icon">⤓</div>
                    </button>
                </div>
            </div>
            
            <!-- Sacred Pause Overlay -->
            <div id="sacred-pause-overlay" class="sacred-overlay hidden">
                <div class="pause-content">
                    <div class="pause-icon">🕯️</div>
                    <div class="pause-text">Sacred Pause</div>
                    <div class="pause-timer">5</div>
                    <div class="pause-breath">Breathe with the rhythm of wisdom</div>
                </div>
            </div>
            
            <!-- Integration Journal Modal -->
            <div id="journal-modal" class="sacred-modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Integration Journal</h3>
                        <button class="close-modal" data-modal="journal-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <textarea placeholder="What insights are emerging from your sacred journey?" class="journal-textarea"></textarea>
                        <div class="journal-actions">
                            <button class="save-entry" onclick="saveJournalEntry()">Save Entry</button>
                            <button class="view-entries" onclick="viewJournalEntries()">View Previous Entries</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Field Insights Modal -->
            <div id="insights-modal" class="sacred-modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Field Insights</h3>
                        <button class="close-modal" data-modal="insights-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="insights-content">
                            <!-- Insights will be generated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add the bar to the page
        document.body.appendChild(resonanceBar);
        
        // Add styles
        this.addResonanceBarStyles();
    }

    addResonanceBarStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #sacred-universal-interconnectedness-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 10000;
                background: linear-gradient(135deg, rgba(168, 181, 166, 0.95), rgba(179, 197, 215, 0.95));
                backdrop-filter: blur(20px);
                border-top: 2px solid rgba(168, 181, 166, 0.3);
                box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
                transition: all 0.5s ease;
                transform: translateY(0);
            }
            
            #sacred-universal-interconnectedness-bar.minimized {
                transform: translateY(calc(100% - 40px));
            }
            
            .universal-interconnectedness-bar-container {
                display: grid;
                grid-template-columns: 250px 1fr auto auto auto;
                align-items: center;
                padding: 15px 30px;
                gap: 30px;
                max-width: 1400px;
                margin: 0 auto;
            }
            
            /* Sacred Identity */
            .sacred-identity {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .identity-avatar {
                font-size: 1.8em;
                filter: drop-shadow(0 0 10px rgba(168, 181, 166, 0.5));
            }
            
            .identity-name {
                font-weight: 600;
                color: #2C2C2C;
                font-size: 1em;
            }
            
            .identity-phase {
                font-size: 0.8em;
                color: #5A6B57;
                font-style: italic;
            }
            
            /* Three Lights */
            .three-lights {
                display: flex;
                justify-content: center;
                gap: 40px;
            }
            
            .chamber-light {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                padding: 10px;
                border-radius: 12px;
                opacity: 0.6;
            }
            
            .chamber-light:hover {
                opacity: 1;
                transform: translateY(-2px);
            }
            
            .chamber-light.active {
                opacity: 1;
                background: rgba(255,255,255,0.2);
            }
            
            .light-icon {
                font-size: 1.5em;
                margin-bottom: 5px;
                filter: drop-shadow(0 0 8px rgba(168, 181, 166, 0.3));
            }
            
            .light-label {
                font-size: 0.8em;
                color: #2C2C2C;
                font-weight: 500;
            }
            
            .light-glow {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 12px;
                background: radial-gradient(circle, rgba(168, 181, 166, 0.3), transparent);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .chamber-light.active .light-glow {
                opacity: 1;
            }
            
            /* Resonant Resonant Coherence Meter */
            .resonant-coherence-meter {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 120px;
            }
            
            .meter-label {
                font-size: 0.8em;
                color: #5A6B57;
                margin-bottom: 5px;
            }
            
            .meter-container {
                position: relative;
                width: 100px;
                height: 20px;
                background: rgba(255,255,255,0.3);
                border-radius: 10px;
                overflow: hidden;
            }
            
            .resonant-coherence-wave {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: linear-gradient(90deg, #ff6b6b, #A8B5A6);
                border-radius: 10px;
                width: 50%;
                transition: all 0.8s ease;
            }
            
            .resonant-coherence-level {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: coherenceFlow 3s ease-in-out infinite;
            }
            
            .meter-percentage {
                font-size: 0.8em;
                color: #2C2C2C;
                font-weight: 600;
                margin-top: 3px;
            }
            
            /* Sacred Tools */
            .sacred-tools {
                display: flex;
                gap: 10px;
            }
            
            .sacred-tool {
                width: 40px;
                height: 40px;
                border: none;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .sacred-tool:hover {
                background: rgba(255,255,255,0.4);
                transform: scale(1.1);
            }
            
            .tool-icon {
                font-size: 1.2em;
            }
            
            /* Bar Control */
            .bar-control {
                display: flex;
                align-items: center;
            }
            
            .minimize-btn {
                width: 30px;
                height: 30px;
                border: none;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .minimize-btn:hover {
                background: rgba(255,255,255,0.4);
            }
            
            .control-icon {
                font-size: 1em;
                transition: transform 0.3s ease;
            }
            
            #sacred-universal-interconnectedness-bar.minimized .control-icon {
                transform: rotate(180deg);
            }
            
            /* Sacred Overlays */
            .sacred-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                z-index: 20000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .sacred-overlay.hidden {
                opacity: 0;
                pointer-events: none;
            }
            
            .pause-content {
                text-align: center;
                color: white;
            }
            
            .pause-icon {
                font-size: 4em;
                margin-bottom: 20px;
                filter: drop-shadow(0 0 20px rgba(168, 181, 166, 0.5));
            }
            
            .pause-text {
                font-size: 2em;
                margin-bottom: 10px;
                color: #A8B5A6;
            }
            
            .pause-timer {
                font-size: 3em;
                font-weight: 600;
                margin: 20px 0;
            }
            
            .pause-breath {
                font-size: 1.2em;
                font-style: italic;
                opacity: 0.8;
            }
            
            /* Sacred Modals */
            .sacred-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.6);
                z-index: 15000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .sacred-modal.hidden {
                opacity: 0;
                pointer-events: none;
            }
            
            .modal-content {
                background: white;
                border-radius: 16px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                border-bottom: 2px solid #E8E6E1;
            }
            
            .modal-header h3 {
                color: #A8B5A6;
                font-size: 1.5em;
                margin: 0;
            }
            
            .close-modal {
                background: none;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
                color: #6B7280;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .close-modal:hover {
                background: #E8E6E1;
            }
            
            .modal-body {
                padding: 30px;
            }
            
            .journal-textarea {
                width: 100%;
                min-height: 200px;
                border: 2px solid #E8E6E1;
                border-radius: 8px;
                padding: 15px;
                font-family: 'Georgia', serif;
                font-size: 1em;
                line-height: 1.6;
                resize: vertical;
                margin-bottom: 20px;
            }
            
            .journal-textarea:focus {
                outline: none;
                border-color: #A8B5A6;
            }
            
            .journal-actions {
                display: flex;
                gap: 15px;
            }
            
            .journal-actions button {
                background: linear-gradient(135deg, #A8B5A6, #8A9E88);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9em;
                transition: all 0.3s ease;
            }
            
            .journal-actions button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(168, 181, 166, 0.3);
            }
            
            /* Animations */
            @keyframes coherenceFlow {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .universal-interconnectedness-bar-container {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto auto auto;
                    gap: 15px;
                    text-align: center;
                    padding: 10px 15px;
                }
                
                .three-lights {
                    gap: 20px;
                }
                
                .light-label {
                    display: none;
                }
                
                .sacred-tools {
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Chamber navigation
        document.querySelectorAll('.chamber-light').forEach(light => {
            light.addEventListener('click', (e) => {
                const chamber = e.currentTarget.dataset.chamber;
                this.navigateToCamera(chamber);
            });
        });
        
        // Sacred tools
        document.getElementById('sacred-pause-btn')?.addEventListener('click', () => {
            this.initiateSacredPause();
        });
        
        document.getElementById('integration-journal-btn')?.addEventListener('click', () => {
            this.openJournal();
        });
        
        document.getElementById('field-insights-btn')?.addEventListener('click', () => {
            this.showFieldInsights();
        });
        
        // Minimize/expand
        document.getElementById('minimize-bar')?.addEventListener('click', () => {
            this.toggleMinimize();
        });
        
        // Modal close handlers
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                this.closeModal(modalId);
            });
        });
        
        // Sacred Field events
        window.addEventListener('sacred_field_update', (e) => {
            this.handleFieldUpdate(e.detail);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                this.initiateSacredPause();
            }
            if (e.altKey && e.key === 'j') {
                e.preventDefault();
                this.openJournal();
            }
        });
    }

    loadInitialState() {
        // Load Sacred Passport identity
        if (window.SacredPassport) {
            const identity = window.SacredPassport.getIdentity();
            this.updateIdentityDisplay(identity);
        }
        
        // Load Sacred Field state
        if (window.SacredField) {
            const state = window.SacredField.getState();
            this.updateFieldCoherence(state.fieldCoherence);
            this.updateChamberLights(state.currentChamber);
        }
        
        // Show the bar
        this.showResonanceBar();
    }

    // Navigation Methods
    navigateToCamera(chamber) {
        const urls = {
            philosophy: 'https://evolvingresonantcocreationism.com',
            technology: 'https://luminousdynamics.org/ceremony.html',
            practice: 'https://relationalharmonics.org'
        };
        
        if (urls[chamber]) {
            // Track navigation
            if (window.SacredField) {
                window.SacredField.completeExperience('chamber_navigation', {
                    from: this.currentChamber,
                    to: chamber
                });
            }
            
            window.location.href = urls[chamber];
        }
    }

    // Sacred Tools Implementation
    initiateSacredPause() {
        const overlay = document.getElementById('sacred-pause-overlay');
        if (!overlay) return;
        
        overlay.classList.remove('hidden');
        
        // 5-second countdown
        let timeLeft = 5;
        const timer = overlay.querySelector('.pause-timer');
        
        const countdown = setInterval(() => {
            timer.textContent = timeLeft;
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(countdown);
                overlay.classList.add('hidden');
                
                // Track sacred pause
                if (window.SacredField) {
                    window.SacredField.recordSacredPause(5000);
                }
            }
        }, 1000);
    }

    openJournal() {
        const modal = document.getElementById('journal-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    showFieldInsights() {
        const modal = document.getElementById('insights-modal');
        if (!modal) return;
        
        const insightsContent = modal.querySelector('.insights-content');
        const insights = this.generateFieldInsights();
        
        insightsContent.innerHTML = `
            <div class="insights-grid" style="display: grid; gap: 20px;">
                ${insights.map(insight => `
                    <div style="background: ${insight.color}; padding: 20px; border-radius: 12px; border-left: 4px solid ${insight.accent};">
                        <h4 style="color: #2C2C2C; margin-bottom: 10px;">${insight.title}</h4>
                        <p style="color: #5A6B57; line-height: 1.6;">${insight.description}</p>
                        ${insight.action ? `<div style="margin-top: 15px; font-size: 0.9em; color: #6B7280; font-style: italic;">${insight.action}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    generateFieldInsights() {
        const state = window.SacredField?.getState() || {};
        const insights = [];
        
        // Resonant Resonant Coherence insights
        if (state.fieldCoherence < 0.3) {
            insights.push({
                title: 'Building Foundation',
                description: 'Your field resonant-coherence is in the early stages. Each sacred pause and conscious interaction strengthens your foundational presence.',
                action: 'Consider practicing Ω0 (Sacred Pause) throughout your day.',
                color: 'rgba(179, 197, 215, 0.1)',
                accent: '#B3C5D7'
            });
        } else if (state.fieldCoherence > 0.7) {
            insights.push({
                title: 'Wisdom Keeper',
                description: 'Your field resonant-coherence is strong. You have the capacity to hold space for others and create coherent fields in groups.',
                action: 'Consider exploring advanced practices like ∑12 (Field Resonant Resonant Coherence Generation).',
                color: 'rgba(168, 181, 166, 0.1)',
                accent: '#A8B5A6'
            });
        }
        
        // Journey insights
        if (state.visitedChambers?.length === 3) {
            insights.push({
                title: 'Sacred Symphony Complete',
                description: 'You have experienced all three movements of the Sacred Symphony. Philosophy, Technology, and Practice now flow as one unified understanding.',
                action: 'Your journey becomes an offering to the collective field.',
                color: 'rgba(212, 165, 116, 0.1)',
                accent: '#D4A574'
            });
        }
        
        // Practice insights
        if (state.sacredPauses > 10) {
            insights.push({
                title: 'Pause Practitioner',
                description: `You have taken ${state.sacredPauses} sacred pauses. This practice is rewiring your nervous system for presence and wisdom.`,
                action: 'Notice how these pauses create space for wisdom to emerge.',
                color: 'rgba(166, 196, 166, 0.1)',
                accent: '#A6C4A6'
            });
        }
        
        // Default insight if none match
        if (insights.length === 0) {
            insights.push({
                title: 'Sacred Journey Begins',
                description: 'Every step on this path is sacred. Your presence here is already transforming the field of human consciousness.',
                action: 'Trust the process. Let each moment teach you.',
                color: 'rgba(168, 181, 166, 0.1)',
                accent: '#A8B5A6'
            });
        }
        
        return insights;
    }

    // State Update Methods
    updateIdentityDisplay(identity) {
        const nameEl = document.querySelector('.identity-name');
        const phaseEl = document.querySelector('.identity-phase');
        
        if (nameEl && identity.displayName) {
            nameEl.textContent = identity.displayName;
        }
        
        if (phaseEl && identity.journeyPhase) {
            const phaseNames = {
                'threshold': 'Threshold Seeker',
                'first_chamber': 'First Explorer',
                'understanding': 'Understanding Deepens',
                'ready_for_practice': 'Ready for Practice',
                'embodiment': 'Embodying Wisdom',
                'integration': 'Living Integration'
            };
            
            phaseEl.textContent = phaseNames[identity.journeyPhase] || 'Sacred Traveler';
        }
    }

    updateFieldCoherence(resonant-coherence) {
        this.fieldCoherence = resonant-coherence;
        
        const wave = document.querySelector('.resonant-coherence-wave');
        const percentage = document.querySelector('.meter-percentage');
        
        if (wave) {
            wave.style.width = `${resonant-coherence * 100}%`;
        }
        
        if (percentage) {
            percentage.textContent = `${Math.round(resonant-coherence * 100)}%`;
        }
    }

    updateChamberLights(currentChamber) {
        this.currentChamber = currentChamber;
        
        document.querySelectorAll('.chamber-light').forEach(light => {
            light.classList.remove('active');
        });
        
        if (currentChamber) {
            const activeLight = document.querySelector(`.chamber-light.${currentChamber}`);
            if (activeLight) {
                activeLight.classList.add('active');
            }
        }
    }

    // Event Handlers
    handleFieldUpdate(eventDetail) {
        const { eventType, data } = eventDetail;
        
        switch (eventType) {
            case 'coherence_updated':
                this.updateFieldCoherence(data.level);
                break;
            case 'chamber_entered':
                this.updateChamberLights(data.chamber);
                break;
            case 'sacred_pause_completed':
                // Visual feedback for pause completion
                this.showPauseCompletionFeedback();
                break;
        }
    }

    showPauseCompletionFeedback() {
        const bar = document.getElementById('sacred-universal-interconnectedness-bar');
        if (bar) {
            bar.style.background = 'linear-gradient(135deg, rgba(168, 181, 166, 1), rgba(179, 197, 215, 1))';
            setTimeout(() => {
                bar.style.background = 'linear-gradient(135deg, rgba(168, 181, 166, 0.95), rgba(179, 197, 215, 0.95))';
            }, 1000);
        }
    }

    // Utility Methods
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const bar = document.getElementById('sacred-universal-interconnectedness-bar');
        if (bar) {
            bar.classList.toggle('minimized', this.isMinimized);
        }
    }

    showResonanceBar() {
        this.isVisible = true;
        const bar = document.getElementById('sacred-universal-interconnectedness-bar');
        if (bar) {
            bar.style.display = 'block';
        }
    }

    hideResonanceBar() {
        this.isVisible = false;
        const bar = document.getElementById('sacred-universal-interconnectedness-bar');
        if (bar) {
            bar.style.display = 'none';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    startHeartbeat() {
        // Gentle pulsing of the resonant-coherence meter
        setInterval(() => {
            const wave = document.querySelector('.resonant-coherence-level');
            if (wave) {
                wave.style.animation = 'none';
                setTimeout(() => {
                    wave.style.animation = 'coherenceFlow 3s ease-in-out infinite';
                }, 10);
            }
        }, 10000);
    }

    // Public API
    destroy() {
        const bar = document.getElementById('sacred-universal-interconnectedness-bar');
        if (bar) {
            bar.remove();
        }
    }
}

// Global Journal Functions
function saveJournalEntry() {
    const textarea = document.querySelector('.journal-textarea');
    const entry = textarea.value.trim();
    
    if (entry && window.SacredField) {
        const entryId = window.SacredField.addJournalEntry(entry, 'resonance_bar');
        textarea.value = '';
        
        // Visual feedback
        const saveBtn = document.querySelector('.save-entry');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved ✓';
        saveBtn.style.background = 'linear-gradient(135deg, #A6C4A6, #8AA68A)';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = 'linear-gradient(135deg, #A8B5A6, #8A9E88)';
        }, 2000);
    }
}

function viewJournalEntries() {
    // In full implementation, this would show all journal entries
    alert('📖 Your sacred journey entries will be displayed here, creating a beautiful record of your evolving wisdom and insights.');
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other sacred field systems are loaded
    setTimeout(() => {
        if (!window.SacredResonanceBar) {
            window.SacredResonanceBar = new ResonanceBar();
        }
    }, 500);
});

// Export for global use
if (typeof window !== 'undefined') {
    window.ResonanceBar = ResonanceBar;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResonanceBar;
}