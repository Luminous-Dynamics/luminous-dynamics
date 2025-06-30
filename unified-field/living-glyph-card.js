/**
 * Living Glyph Card - The Sacred Practice Vessel
 * 
 * A breathing, responsive interface that transforms from invitation card
 * into full practice space. Each glyph becomes a sacred chamber for
 * embodied wisdom practice.
 */

class LivingGlyphCard {
    constructor(containerId, glyphData, options = {}) {
        this.container = document.getElementById(containerId);
        this.glyphData = glyphData;
        this.options = {
            consciousnessMode: options.consciousness || false,
            autoProgress: options.autoProgress || false,
            sacredTiming: options.sacredTiming !== false // Default true
        };
        
        this.state = 'closed'; // closed, arriving, open, practicing, completing
        this.currentChamber = 0; // 0-3 for the four quadrants
        this.practiceSession = null;
        this.breathingGuide = null;
        
        this.initializeCard();
    }

    initializeCard() {
        this.createCardStructure();
        this.addCardStyles();
        this.setupEventListeners();
        this.renderClosedState();
    }

    createCardStructure() {
        this.container.innerHTML = `
            <!-- The Sacred Card Container -->
            <div class="living-glyph-card" id="glyph-card-${this.glyphData.id}">
                
                <!-- Closed State: The Sacred Invitation -->
                <div class="card-closed-state">
                    <div class="sacred-sigil">
                        <div class="sigil-container">
                            <div class="sigil-animation"></div>
                            <div class="sigil-symbol">${this.getSigilSymbol()}</div>
                        </div>
                    </div>
                    
                    <div class="glyph-identity">
                        <h2 class="glyph-name">${this.glyphData.fullName}</h2>
                        <p class="core-question">"${this.glyphData.quadrants.why.coreQuestion}"</p>
                    </div>
                    
                    <div class="glyph-meta">
                        <div class="harmony-badge">${this.glyphData.harmony}</div>
                        <div class="difficulty-indicator">
                            ${this.renderDifficultyStars()}
                            <span class="difficulty-label">${this.glyphData.difficulty}</span>
                        </div>
                    </div>
                    
                    <div class="entry-invitation">
                        <button class="enter-practice-btn">Touch to Enter Sacred Practice</button>
                    </div>
                </div>
                
                <!-- Sacred Arrival Overlay -->
                <div class="sacred-arrival-overlay hidden">
                    <div class="arrival-content">
                        <div class="arrival-icon">🕯️</div>
                        <h3 class="arrival-title">Welcome to ${this.glyphData.name}</h3>
                        <p class="arrival-guidance">Take three conscious breaths to arrive fully in this sacred space</p>
                        <div class="arrival-breathing-guide">
                            <div class="breath-circle"></div>
                            <div class="breath-instruction">Breathe to begin</div>
                            <div class="breath-counter">3 breaths remaining</div>
                        </div>
                    </div>
                </div>
                
                <!-- Open State: The Four Sacred Chambers -->
                <div class="card-open-state hidden">
                    
                    <!-- Chamber Navigation -->
                    <div class="chamber-navigation">
                        <div class="nav-sigil">${this.getSigilSymbol()}</div>
                        <div class="chamber-tabs">
                            <button class="chamber-tab active" data-chamber="0">WHY</button>
                            <button class="chamber-tab" data-chamber="1">HOW</button>
                            <button class="chamber-tab" data-chamber="2">RESONANCE</button>
                            <button class="chamber-tab" data-chamber="3">WE</button>
                        </div>
                        <button class="close-practice-btn">✕</button>
                    </div>
                    
                    <!-- Chamber Content Area -->
                    <div class="chamber-content">
                        
                        <!-- Chamber 0: WHY (The Understanding) -->
                        <div class="chamber why-chamber active" data-chamber="0">
                            <div class="chamber-header">
                                <h3 class="chamber-title">The Sacred Understanding</h3>
                                <p class="chamber-subtitle">Why this practice serves consciousness</p>
                            </div>
                            
                            <div class="understanding-content">
                                <div class="philosophical-root">
                                    <h4>Wisdom Teaching</h4>
                                    <p>${this.glyphData.quadrants.why.philosophicalRoot}</p>
                                </div>
                                
                                <div class="harmony-connection">
                                    <h4>Harmony of ${this.glyphData.harmony}</h4>
                                    <p>${this.glyphData.quadrants.why.harmonyConnection}</p>
                                </div>
                                
                                <div class="shadow-transformation">
                                    <h4>Shadow Transformed</h4>
                                    <p>This practice transforms: ${this.glyphData.quadrants.why.shadowTransformed}</p>
                                </div>
                            </div>
                            
                            <div class="chamber-navigation-footer">
                                <button class="next-chamber-btn" data-next="1">Begin Practice →</button>
                            </div>
                        </div>
                        
                        <!-- Chamber 1: HOW (The Practice) -->
                        <div class="chamber how-chamber" data-chamber="1">
                            <div class="chamber-header">
                                <h3 class="chamber-title">The Sacred Practice</h3>
                                <p class="chamber-subtitle">Embodying this wisdom</p>
                            </div>
                            
                            <div class="practice-content">
                                <div class="practice-instructions">
                                    <h4>Practice Steps</h4>
                                    <ol class="instruction-list">
                                        ${this.glyphData.quadrants.how.practiceInstructions.map(instruction => 
                                            `<li>${instruction}</li>`
                                        ).join('')}
                                    </ol>
                                </div>
                                
                                <div class="interactive-practice-area">
                                    <h4>Interactive Practice</h4>
                                    <div id="practice-component-${this.glyphData.id}">
                                        <!-- Interactive component will be rendered here -->
                                    </div>
                                </div>
                                
                                <div class="practice-variations">
                                    <h4>Practice Variations</h4>
                                    <ul class="variations-list">
                                        ${(this.glyphData.quadrants.how.variations || []).map(variation => 
                                            `<li>${variation}</li>`
                                        ).join('')}
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="chamber-navigation-footer">
                                <button class="prev-chamber-btn" data-prev="0">← Understanding</button>
                                <button class="next-chamber-btn" data-next="2">Explore Connections →</button>
                            </div>
                        </div>
                        
                        <!-- Chamber 2: RESONANCE (The Constellation) -->
                        <div class="chamber resonance-chamber" data-chamber="2">
                            <div class="chamber-header">
                                <h3 class="chamber-title">The Sacred Web</h3>
                                <p class="chamber-subtitle">How this practice connects to all wisdom</p>
                            </div>
                            
                            <div class="constellation-content">
                                <div class="constellation-map">
                                    <h4>Practice Constellation</h4>
                                    <div class="glyph-web-visualization" id="constellation-${this.glyphData.id}">
                                        <!-- Constellation visualization will be rendered here -->
                                    </div>
                                </div>
                                
                                <div class="related-practices">
                                    <div class="practice-relationships">
                                        ${this.renderPracticeRelationships()}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="chamber-navigation-footer">
                                <button class="prev-chamber-btn" data-prev="1">← Practice</button>
                                <button class="next-chamber-btn" data-next="3">Join Community →</button>
                            </div>
                        </div>
                        
                        <!-- Chamber 3: WE (The Community) -->
                        <div class="chamber we-chamber" data-chamber="3">
                            <div class="chamber-header">
                                <h3 class="chamber-title">The Sacred Community</h3>
                                <p class="chamber-subtitle">Wisdom from fellow practitioners</p>
                            </div>
                            
                            <div class="community-content">
                                <div class="field-notes">
                                    <h4>Field Notes from Practice</h4>
                                    <div class="notes-container">
                                        ${this.renderFieldNotes()}
                                    </div>
                                </div>
                                
                                <div class="community-sharing">
                                    <h4>Share Your Experience</h4>
                                    <div class="sharing-area">
                                        <textarea placeholder="What insights emerged from your practice? (Optional - your wisdom enriches the community)" class="experience-sharing"></textarea>
                                        <button class="share-insight-btn">Share Anonymously</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="chamber-navigation-footer">
                                <button class="prev-chamber-btn" data-prev="2">← Constellation</button>
                                <button class="complete-practice-btn">Complete Practice ✨</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sacred Completion Overlay -->
                <div class="sacred-completion-overlay hidden">
                    <div class="completion-content">
                        <div class="completion-icon">✨</div>
                        <h3 class="completion-title">Practice Complete</h3>
                        <p class="completion-message">Take a moment to feel what has shifted in your being</p>
                        <div class="completion-reflection">
                            <input type="text" placeholder="One word for your experience..." class="completion-word">
                            <button class="completion-done-btn">Honor This Practice</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addCardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .living-glyph-card {
                position: relative;
                max-width: 400px;
                margin: 0 auto;
                font-family: 'Georgia', serif;
                transition: all 0.8s ease;
            }
            
            /* Closed State Styles */
            .card-closed-state {
                background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,248,248,0.95));
                border-radius: 20px;
                padding: 40px 30px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                border: 2px solid transparent;
                cursor: pointer;
                transition: all 0.5s ease;
                text-align: center;
            }
            
            .card-closed-state:hover {
                transform: translateY(-5px);
                box-shadow: 0 25px 60px rgba(0,0,0,0.15);
                border-color: ${this.getHarmonyColor()};
            }
            
            .sacred-sigil {
                margin-bottom: 30px;
            }
            
            .sigil-container {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto;
            }
            
            .sigil-animation {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 50%;
                background: radial-gradient(circle, ${this.getHarmonyColor()}20, transparent);
                animation: sigilPulse 4s ease-in-out infinite;
            }
            
            .sigil-symbol {
                position: relative;
                z-index: 2;
                font-size: 2.5em;
                color: ${this.getHarmonyColor()};
                line-height: 80px;
                filter: drop-shadow(0 0 10px ${this.getHarmonyColor()}40);
            }
            
            .glyph-identity {
                margin-bottom: 30px;
            }
            
            .glyph-name {
                font-size: 1.8em;
                color: #2C2C2C;
                margin-bottom: 15px;
                font-weight: 600;
            }
            
            .core-question {
                font-size: 1.1em;
                color: #5A6B57;
                font-style: italic;
                line-height: 1.6;
            }
            
            .glyph-meta {
                margin-bottom: 30px;
            }
            
            .harmony-badge {
                display: inline-block;
                background: ${this.getHarmonyColor()}20;
                color: ${this.getHarmonyColor()};
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9em;
                font-weight: 600;
                margin-bottom: 15px;
            }
            
            .difficulty-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-size: 0.9em;
                color: #6B7280;
            }
            
            .difficulty-stars {
                color: ${this.getHarmonyColor()};
            }
            
            .enter-practice-btn {
                background: linear-gradient(135deg, ${this.getHarmonyColor()}, ${this.getDarkerHarmonyColor()});
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 1em;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 5px 20px ${this.getHarmonyColor()}30;
                font-family: 'Georgia', serif;
            }
            
            .enter-practice-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 30px ${this.getHarmonyColor()}40;
            }
            
            /* Open State Styles */
            .card-open-state {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #FAFAF8, #F5F3F0);
                z-index: 10000;
                overflow-y: auto;
            }
            
            .chamber-navigation {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 30px;
                background: rgba(255,255,255,0.9);
                border-bottom: 2px solid #E8E6E1;
                backdrop-filter: blur(10px);
                position: sticky;
                top: 0;
                z-index: 100;
            }
            
            .nav-sigil {
                font-size: 1.5em;
                color: ${this.getHarmonyColor()};
            }
            
            .chamber-tabs {
                display: flex;
                gap: 10px;
            }
            
            .chamber-tab {
                background: transparent;
                border: 2px solid #E8E6E1;
                color: #6B7280;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Georgia', serif;
                font-size: 0.9em;
            }
            
            .chamber-tab.active,
            .chamber-tab:hover {
                border-color: ${this.getHarmonyColor()};
                color: ${this.getHarmonyColor()};
                background: ${this.getHarmonyColor()}10;
            }
            
            .close-practice-btn {
                background: none;
                border: none;
                font-size: 1.5em;
                color: #6B7280;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .close-practice-btn:hover {
                background: #E8E6E1;
            }
            
            /* Chamber Content */
            .chamber-content {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 30px;
            }
            
            .chamber {
                display: none;
            }
            
            .chamber.active {
                display: block;
                animation: chamberFadeIn 0.8s ease-out;
            }
            
            .chamber-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .chamber-title {
                font-size: 2.2em;
                color: ${this.getHarmonyColor()};
                margin-bottom: 10px;
            }
            
            .chamber-subtitle {
                font-size: 1.1em;
                color: #6B7280;
                font-style: italic;
            }
            
            /* WHY Chamber */
            .understanding-content > div {
                background: white;
                padding: 30px;
                border-radius: 16px;
                margin-bottom: 25px;
                border-left: 4px solid ${this.getHarmonyColor()};
                box-shadow: 0 5px 20px rgba(0,0,0,0.05);
            }
            
            .understanding-content h4 {
                color: ${this.getHarmonyColor()};
                font-size: 1.3em;
                margin-bottom: 15px;
            }
            
            .understanding-content p {
                color: #2C2C2C;
                line-height: 1.8;
                font-size: 1.1em;
            }
            
            /* HOW Chamber */
            .practice-content > div {
                background: white;
                padding: 30px;
                border-radius: 16px;
                margin-bottom: 25px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.05);
            }
            
            .practice-content h4 {
                color: ${this.getHarmonyColor()};
                font-size: 1.3em;
                margin-bottom: 20px;
            }
            
            .instruction-list {
                padding-left: 20px;
            }
            
            .instruction-list li {
                margin-bottom: 12px;
                line-height: 1.6;
                color: #2C2C2C;
            }
            
            .interactive-practice-area {
                border: 2px solid ${this.getHarmonyColor()}30;
                background: ${this.getHarmonyColor()}05;
            }
            
            /* Chamber Navigation Footer */
            .chamber-navigation-footer {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 2px solid #E8E6E1;
            }
            
            .prev-chamber-btn,
            .next-chamber-btn,
            .complete-practice-btn {
                background: linear-gradient(135deg, ${this.getHarmonyColor()}, ${this.getDarkerHarmonyColor()});
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Georgia', serif;
            }
            
            .prev-chamber-btn {
                background: linear-gradient(135deg, #B3C5D7, #95A8C4);
            }
            
            .prev-chamber-btn:hover,
            .next-chamber-btn:hover,
            .complete-practice-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            /* Sacred Overlays */
            .sacred-arrival-overlay,
            .sacred-completion-overlay {
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
                transition: all 0.5s ease;
            }
            
            .sacred-arrival-overlay.hidden,
            .sacred-completion-overlay.hidden {
                opacity: 0;
                pointer-events: none;
            }
            
            .arrival-content,
            .completion-content {
                background: white;
                padding: 50px;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .arrival-icon,
            .completion-icon {
                font-size: 3em;
                margin-bottom: 20px;
                filter: drop-shadow(0 0 20px ${this.getHarmonyColor()}50);
            }
            
            .arrival-title,
            .completion-title {
                font-size: 1.8em;
                color: ${this.getHarmonyColor()};
                margin-bottom: 15px;
            }
            
            .arrival-guidance,
            .completion-message {
                color: #5A6B57;
                line-height: 1.8;
                margin-bottom: 30px;
                font-size: 1.1em;
            }
            
            /* Breathing Guide */
            .arrival-breathing-guide {
                margin-top: 30px;
            }
            
            .breath-circle {
                width: 80px;
                height: 80px;
                border: 3px solid ${this.getHarmonyColor()};
                border-radius: 50%;
                margin: 0 auto 20px;
                transition: all 1s ease;
            }
            
            .breath-circle.expanding {
                transform: scale(1.3);
                background: ${this.getHarmonyColor()}20;
            }
            
            .breath-instruction {
                font-size: 1.2em;
                color: ${this.getHarmonyColor()};
                margin-bottom: 10px;
            }
            
            .breath-counter {
                color: #6B7280;
                font-size: 0.9em;
            }
            
            /* Completion Input */
            .completion-reflection {
                margin-top: 30px;
            }
            
            .completion-word {
                width: 100%;
                padding: 15px;
                border: 2px solid #E8E6E1;
                border-radius: 8px;
                text-align: center;
                font-size: 1.1em;
                margin-bottom: 20px;
                font-family: 'Georgia', serif;
            }
            
            .completion-word:focus {
                outline: none;
                border-color: ${this.getHarmonyColor()};
            }
            
            .completion-done-btn {
                background: linear-gradient(135deg, ${this.getHarmonyColor()}, ${this.getDarkerHarmonyColor()});
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Georgia', serif;
                font-size: 1em;
            }
            
            .completion-done-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px ${this.getHarmonyColor()}40;
            }
            
            /* Animations */
            @keyframes sigilPulse {
                0%, 100% { 
                    transform: scale(1); 
                    opacity: 0.7; 
                }
                50% { 
                    transform: scale(1.1); 
                    opacity: 1; 
                }
            }
            
            @keyframes chamberFadeIn {
                from { 
                    opacity: 0; 
                    transform: translateY(20px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            /* Utility Classes */
            .hidden {
                display: none !important;
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .chamber-content {
                    padding: 20px 15px;
                }
                
                .chamber-navigation {
                    padding: 15px 20px;
                }
                
                .chamber-tabs {
                    gap: 5px;
                }
                
                .chamber-tab {
                    padding: 8px 12px;
                    font-size: 0.8em;
                }
                
                .arrival-content,
                .completion-content {
                    padding: 30px 20px;
                    margin: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Utility Methods
    getSigilSymbol() {
        const sigilMap = {
            'Ω0': '🕯️',
            'Ω1': '🌅',
            'Ω4': '👂',
            'Ω7': '🛡️',
            'Ω8': '💎'
        };
        return sigilMap[this.glyphData.id] || '✨';
    }

    getHarmonyColor() {
        const harmonyColors = {
            transparency: '#A8B5A6',
            coherence: '#B3C5D7',
            resonance: '#D4A574',
            agency: '#C4A5A0',
            vitality: '#A6C4A6',
            mutuality: '#B5A6C4',
            novelty: '#C4B5A6'
        };
        return harmonyColors[this.glyphData.harmony] || '#A8B5A6';
    }

    getDarkerHarmonyColor() {
        const harmonyColors = {
            transparency: '#8A9E88',
            coherence: '#95A8C4',
            resonance: '#B8965F',
            agency: '#A68B86',
            vitality: '#8AA68A',
            mutuality: '#9B8AA6',
            novelty: '#A69B8A'
        };
        return harmonyColors[this.glyphData.harmony] || '#8A9E88';
    }

    renderDifficultyStars() {
        const levels = {
            beginner: 2,
            intermediate: 4,
            advanced: 6,
            master: 8
        };
        
        const level = levels[this.glyphData.difficulty] || 2;
        const maxStars = 8;
        
        let stars = '';
        for (let i = 0; i < maxStars; i++) {
            stars += i < level ? '●' : '○';
        }
        
        return `<span class="difficulty-stars">${stars}</span>`;
    }

    renderPracticeRelationships() {
        const relationships = this.glyphData.quadrants.resonance;
        let html = '';
        
        if (relationships.relatedGlyphs?.length) {
            html += `
                <div class="relationship-group">
                    <h5>Related Practices</h5>
                    <div class="glyph-links">
                        ${relationships.relatedGlyphs.map(glyphId => 
                            `<span class="glyph-link" data-glyph="${glyphId}">${glyphId}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        if (relationships.complementaryGlyphs?.length) {
            html += `
                <div class="relationship-group">
                    <h5>Deepens With</h5>
                    <div class="glyph-links">
                        ${relationships.complementaryGlyphs.map(glyphId => 
                            `<span class="glyph-link" data-glyph="${glyphId}">${glyphId}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        if (relationships.advancementGlyphs?.length) {
            html += `
                <div class="relationship-group">
                    <h5>Opens Path To</h5>
                    <div class="glyph-links">
                        ${relationships.advancementGlyphs.map(glyphId => 
                            `<span class="glyph-link" data-glyph="${glyphId}">${glyphId}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        return html;
    }

    renderFieldNotes() {
        const notes = this.glyphData.quadrants.we.practitionerFieldNotes || [];
        
        return notes.map(note => `
            <div class="field-note">
                <div class="note-content">"${note}"</div>
                <div class="note-attribution">— A fellow practitioner</div>
            </div>
        `).join('');
    }

    // Event Handlers
    setupEventListeners() {
        // Enter practice
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('enter-practice-btn')) {
                this.enterPractice();
            }
        });
        
        // Chamber navigation
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('chamber-tab')) {
                const chamber = parseInt(e.target.dataset.chamber);
                this.navigateToChamber(chamber);
            }
            
            if (e.target.classList.contains('next-chamber-btn')) {
                const next = parseInt(e.target.dataset.next);
                this.navigateToChamber(next);
            }
            
            if (e.target.classList.contains('prev-chamber-btn')) {
                const prev = parseInt(e.target.dataset.prev);
                this.navigateToChamber(prev);
            }
        });
        
        // Close practice
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-practice-btn')) {
                this.closePractice();
            }
        });
        
        // Complete practice
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('complete-practice-btn')) {
                this.completePractice();
            }
        });
        
        // Completion done
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('completion-done-btn')) {
                this.finalizePractice();
            }
        });
        
        // Share insight
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('share-insight-btn')) {
                this.shareInsight();
            }
        });
    }

    // State Management
    renderClosedState() {
        this.state = 'closed';
        this.container.querySelector('.card-closed-state').classList.remove('hidden');
        this.container.querySelector('.card-open-state').classList.add('hidden');
        this.container.querySelector('.sacred-arrival-overlay').classList.add('hidden');
        this.container.querySelector('.sacred-completion-overlay').classList.add('hidden');
    }

    enterPractice() {
        if (this.options.sacredTiming) {
            this.initiateSacredArrival();
        } else {
            this.openPracticeSpace();
        }
    }

    initiateSacredArrival() {
        this.state = 'arriving';
        this.container.querySelector('.sacred-arrival-overlay').classList.remove('hidden');
        
        // Start breathing guide
        this.startArrivalBreathing();
    }

    startArrivalBreathing() {
        let breathsRemaining = 3;
        const circle = this.container.querySelector('.breath-circle');
        const instruction = this.container.querySelector('.breath-instruction');
        const counter = this.container.querySelector('.breath-counter');
        
        const breathCycle = () => {
            if (breathsRemaining <= 0) {
                this.openPracticeSpace();
                return;
            }
            
            // Inhale
            instruction.textContent = 'Breathe in...';
            circle.classList.add('expanding');
            
            setTimeout(() => {
                // Exhale
                instruction.textContent = 'Breathe out...';
                circle.classList.remove('expanding');
                
                setTimeout(() => {
                    breathsRemaining--;
                    counter.textContent = `${breathsRemaining} breaths remaining`;
                    
                    if (breathsRemaining > 0) {
                        breathCycle();
                    } else {
                        instruction.textContent = 'You are ready';
                        setTimeout(() => this.openPracticeSpace(), 1000);
                    }
                }, 3000); // Exhale duration
            }, 2000); // Inhale duration
        };
        
        breathCycle();
    }

    openPracticeSpace() {
        this.state = 'open';
        this.container.querySelector('.card-closed-state').classList.add('hidden');
        this.container.querySelector('.sacred-arrival-overlay').classList.add('hidden');
        this.container.querySelector('.card-open-state').classList.remove('hidden');
        
        // Initialize chamber 0
        this.navigateToChamber(0);
        
        // Initialize interactive components
        this.initializeInteractiveComponents();
        
        // Track Sacred Field engagement
        if (window.SacredField) {
            window.SacredField.completeExperience('glyph_practice_started', {
                glyphId: this.glyphData.id,
                glyphName: this.glyphData.name
            });
        }
    }

    navigateToChamber(chamberIndex) {
        this.currentChamber = chamberIndex;
        
        // Update chamber tabs
        this.container.querySelectorAll('.chamber-tab').forEach((tab, index) => {
            tab.classList.toggle('active', index === chamberIndex);
        });
        
        // Update chamber content
        this.container.querySelectorAll('.chamber').forEach((chamber, index) => {
            chamber.classList.toggle('active', index === chamberIndex);
        });
        
        // Initialize chamber-specific components
        if (chamberIndex === 1) {
            this.initializePracticeComponent();
        } else if (chamberIndex === 2) {
            this.initializeConstellationVisualization();
        }
    }

    initializeInteractiveComponents() {
        // This will be extended based on glyph type
        // For now, placeholder for practice component initialization
    }

    initializePracticeComponent() {
        const componentContainer = this.container.querySelector(`#practice-component-${this.glyphData.id}`);
        if (!componentContainer) return;
        
        // Initialize based on interactive component type
        const componentType = this.glyphData.quadrants.how.interactiveComponent?.type;
        
        switch (componentType) {
            case 'breathing_guide':
                this.createBreathingGuide(componentContainer);
                break;
            case 'assessment_slider':
                this.createAssessmentSliders(componentContainer);
                break;
            case 'journal_prompt':
                this.createJournalPrompt(componentContainer);
                break;
            default:
                this.createGenericPracticeSpace(componentContainer);
        }
    }

    createBreathingGuide(container) {
        container.innerHTML = `
            <div class="breathing-guide-component">
                <div class="breathing-circle"></div>
                <div class="breathing-instruction">Ready to begin breathing practice</div>
                <div class="breathing-controls">
                    <button class="start-breathing-btn">Start Breathing Guide</button>
                </div>
                <div class="breathing-progress">
                    <div class="progress-indicator">○○○</div>
                    <div class="progress-text">3 cycles remaining</div>
                </div>
            </div>
        `;
        
        // Add breathing guide functionality
        const startBtn = container.querySelector('.start-breathing-btn');
        startBtn.addEventListener('click', () => this.startBreathingPractice(container));
    }

    startBreathingPractice(container) {
        const config = this.glyphData.quadrants.how.interactiveComponent.config;
        let cyclesRemaining = config.breathCycles || 3;
        
        const circle = container.querySelector('.breathing-circle');
        const instruction = container.querySelector('.breathing-instruction');
        const progress = container.querySelector('.progress-indicator');
        const progressText = container.querySelector('.progress-text');
        
        const breathCycle = () => {
            if (cyclesRemaining <= 0) {
                instruction.textContent = 'Breathing practice complete';
                circle.classList.remove('breathing-in', 'breathing-out');
                
                // Track completion
                if (window.SacredField) {
                    window.SacredField.updateFieldCoherence(0.05, 'Completed breathing practice');
                }
                return;
            }
            
            // Inhale phase
            instruction.textContent = config.guidance || 'Breathe in slowly...';
            circle.classList.add('breathing-in');
            
            setTimeout(() => {
                // Hold phase (if configured)
                if (config.holdCount) {
                    instruction.textContent = 'Hold gently...';
                    setTimeout(() => continueToExhale(), config.holdCount * 1000);
                } else {
                    continueToExhale();
                }
            }, (config.inhaleCount || 4) * 1000);
            
            function continueToExhale() {
                // Exhale phase
                instruction.textContent = 'Breathe out completely...';
                circle.classList.remove('breathing-in');
                circle.classList.add('breathing-out');
                
                setTimeout(() => {
                    circle.classList.remove('breathing-out');
                    cyclesRemaining--;
                    
                    // Update progress
                    const dots = '●'.repeat(config.breathCycles - cyclesRemaining) + 
                                 '○'.repeat(cyclesRemaining);
                    progress.textContent = dots;
                    progressText.textContent = `${cyclesRemaining} cycles remaining`;
                    
                    if (cyclesRemaining > 0) {
                        setTimeout(breathCycle, 1000); // Brief pause between cycles
                    } else {
                        breathCycle(); // Complete
                    }
                }, (config.exhaleCount || 6) * 1000);
            }
        };
        
        // Hide start button and begin
        container.querySelector('.breathing-controls').style.display = 'none';
        breathCycle();
    }

    createGenericPracticeSpace(container) {
        container.innerHTML = `
            <div class="generic-practice-space">
                <div class="practice-timer">
                    <div class="timer-display">0:00</div>
                    <button class="start-timer-btn">Begin Practice</button>
                </div>
                <div class="practice-reflection">
                    <textarea placeholder="Reflect on your practice experience..." class="practice-notes"></textarea>
                </div>
            </div>
        `;
    }

    initializeConstellationVisualization() {
        const container = this.container.querySelector(`#constellation-${this.glyphData.id}`);
        if (!container) return;
        
        container.innerHTML = `
            <div class="constellation-web">
                <div class="central-glyph">${this.glyphData.id}</div>
                <div class="connected-glyphs">
                    ${this.renderConnectedGlyphs()}
                </div>
            </div>
        `;
    }

    renderConnectedGlyphs() {
        const related = this.glyphData.quadrants.resonance.relatedGlyphs || [];
        return related.map(glyphId => `
            <div class="connected-glyph" data-glyph="${glyphId}">
                <div class="connection-line"></div>
                <div class="glyph-node">${glyphId}</div>
            </div>
        `).join('');
    }

    completePractice() {
        this.state = 'completing';
        this.container.querySelector('.sacred-completion-overlay').classList.remove('hidden');
    }

    finalizePractice() {
        const completionWord = this.container.querySelector('.completion-word').value;
        
        // Track completion in Sacred Field
        if (window.SacredField) {
            window.SacredField.completeExperience('glyph_practice_completed', {
                glyphId: this.glyphData.id,
                glyphName: this.glyphData.name,
                completionWord: completionWord,
                timeSpent: Date.now() - this.practiceStartTime
            });
            
            window.SacredField.updateFieldCoherence(0.1, `Completed ${this.glyphData.name} practice`);
        }
        
        // Close practice
        this.closePractice();
    }

    shareInsight() {
        const insight = this.container.querySelector('.experience-sharing').value;
        if (!insight.trim()) return;
        
        // In full implementation, this would submit to community system
        alert('🙏 Thank you for sharing your wisdom. Your insight enriches the sacred community.');
        
        // Clear the textarea
        this.container.querySelector('.experience-sharing').value = '';
    }

    closePractice() {
        this.state = 'closed';
        this.renderClosedState();
        
        // Reset current chamber
        this.currentChamber = 0;
    }

    // Public API
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    getCurrentState() {
        return {
            state: this.state,
            currentChamber: this.currentChamber,
            glyphId: this.glyphData.id
        };
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.LivingGlyphCard = LivingGlyphCard;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LivingGlyphCard;
}