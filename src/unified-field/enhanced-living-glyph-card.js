/**
 * Enhanced Living Glyph Card - Progressive Depth Integration
 * 
 * Extends the original Living Glyph Card to support multiple layers of depth,
 * bridging practical accessibility with mystical inspiration through
 * progressive revelation based on practice readiness.
 */

class EnhancedLivingGlyphCard {
    constructor(containerId, integratedGlyphData, options = {}) {
        this.container = document.getElementById(containerId);
        this.glyphData = integratedGlyphData;
        this.schema = new IntegratedGlyphSchema();
        
        this.options = {
            consciousnessMode: options.consciousness || false,
            autoProgress: options.autoProgress || false,
            sacredTiming: options.sacredTiming !== false,
            allowDepthProgression: options.allowDepthProgression !== false
        };
        
        // Enhanced State Management
        this.state = 'closed'; // closed, arriving, open, practicing, completing
        this.currentChamber = 0; // 0-3 for the four quadrants
        this.currentDepthLevel = this.glyphData.currentDepthLevel || 'accessible';
        this.maxAvailableDepth = this.getMaxAvailableDepth();
        
        // Practice Tracking
        this.practiceSession = null;
        this.breathingGuide = null;
        this.depthTransitionInProgress = false;
        
        this.initializeEnhancedCard();
    }

    getMaxAvailableDepth() {
        // Get user's practice history and determine max available depth
        const userHistory = this.getUserPracticeHistory();
        return this.schema.checkReadinessForDeeper(this.glyphData, userHistory);
    }

    getUserPracticeHistory() {
        // Integrate with Sacred Field API for practice tracking
        if (window.SacredField) {
            return window.SacredField.getGlyphPracticeHistory(this.glyphData.id);
        }
        return { practiceCount: 0 };
    }

    initializeEnhancedCard() {
        this.createEnhancedCardStructure();
        this.addEnhancedCardStyles();
        this.setupEnhancedEventListeners();
        this.renderClosedState();
    }

    createEnhancedCardStructure() {
        this.container.innerHTML = `
            <!-- The Enhanced Sacred Card Container -->
            <div class="enhanced-living-glyph-card" id="glyph-card-${this.glyphData.id}">
                
                <!-- Depth Level Indicator -->
                <div class="depth-level-indicator">
                    <div class="depth-progress">
                        <div class="depth-dot ${this.currentDepthLevel === 'accessible' ? 'active' : ''}" 
                             data-level="accessible" title="Accessible Practice">●</div>
                        <div class="depth-dot ${this.currentDepthLevel === 'developing' ? 'active' : ''}" 
                             data-level="developing" title="Developing Understanding">●</div>
                        <div class="depth-dot ${this.currentDepthLevel === 'mystical' ? 'active' : ''}" 
                             data-level="mystical" title="Mystical Depth">●</div>
                    </div>
                    <div class="depth-label">${this.getDepthLevelLabel()}</div>
                </div>
                
                <!-- Closed State: Enhanced Sacred Invitation -->
                <div class="card-closed-state">
                    <div class="sacred-sigil">
                        <div class="sigil-container">
                            <div class="sigil-animation ${this.getAnimationClass()}"></div>
                            <div class="sigil-symbol">${this.getSigilSymbol()}</div>
                            ${this.getMysticalOverlay()}
                        </div>
                    </div>
                    
                    <div class="glyph-identity">
                        <h2 class="glyph-name">${this.getDisplayName()}</h2>
                        <p class="core-question">"${this.getCurrentQuestion()}"</p>
                        ${this.getMysticalDesignation()}
                    </div>
                    
                    <div class="glyph-meta">
                        <div class="harmony-badge">${this.glyphData.harmony || 'foundation'}</div>
                        <div class="difficulty-indicator">
                            ${this.renderDifficultyStars()}
                            <span class="difficulty-label">${this.getCurrentDifficultyLabel()}</span>
                        </div>
                    </div>
                    
                    <!-- Depth Progression Indicator -->
                    ${this.renderDepthProgression()}
                    
                    <div class="entry-invitation">
                        <button class="enter-practice-btn">Touch to Enter Sacred Practice</button>
                        ${this.renderDepthAccessButton()}
                    </div>
                </div>
                
                <!-- Enhanced Sacred Arrival Overlay -->
                <div class="sacred-arrival-overlay hidden">
                    <div class="arrival-content">
                        <div class="arrival-icon">${this.getArrivalIcon()}</div>
                        <h3 class="arrival-title">Welcome to ${this.getCurrentPracticeName()}</h3>
                        <p class="arrival-guidance">${this.getArrivalGuidance()}</p>
                        <div class="arrival-breathing-guide">
                            <div class="breath-circle"></div>
                            <div class="breath-instruction">Breathe to begin</div>
                            <div class="breath-counter">3 breaths remaining</div>
                        </div>
                        ${this.renderDepthArrivalElements()}
                    </div>
                </div>
                
                <!-- Enhanced Open State: Progressive Four Chambers -->
                <div class="card-open-state hidden">
                    
                    <!-- Enhanced Chamber Navigation -->
                    <div class="chamber-navigation">
                        <div class="nav-sigil">${this.getSigilSymbol()}</div>
                        <div class="chamber-tabs">
                            <button class="chamber-tab active" data-chamber="0">WHY</button>
                            <button class="chamber-tab" data-chamber="1">HOW</button>
                            <button class="chamber-tab" data-chamber="2">RESONANCE</button>
                            <button class="chamber-tab" data-chamber="3">WE</button>
                        </div>
                        <div class="depth-controls">
                            ${this.renderDepthLevelSelector()}
                        </div>
                        <button class="close-practice-btn">✕</button>
                    </div>
                    
                    <!-- Enhanced Chamber Content Area -->
                    <div class="chamber-content">
                        ${this.renderAllChambers()}
                    </div>
                    
                    <!-- Depth Transition Overlay -->
                    <div class="depth-transition-overlay hidden">
                        <div class="transition-content">
                            <div class="transition-icon">🌀</div>
                            <h3 class="transition-title">Deepening Into Mystery</h3>
                            <p class="transition-guidance">Allow the practice to reveal its deeper dimensions...</p>
                            <div class="transition-breathing">
                                <div class="breath-wave"></div>
                                <div class="transition-instruction">Breathe into the depths</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Next Level Preview -->
                ${this.renderNextLevelPreview()}
            </div>
        `;
    }

    getDepthLevelLabel() {
        const labels = {
            accessible: "Accessible Practice",
            developing: "Developing Understanding", 
            mystical: "Mystical Depths"
        };
        return labels[this.currentDepthLevel] || "Sacred Practice";
    }

    getDisplayName() {
        if (this.currentDepthLevel === 'mystical' && this.glyphData.mysticalDesignation) {
            return this.glyphData.mysticalDesignation;
        }
        return this.glyphData.fullName || this.glyphData.name;
    }

    getCurrentQuestion() {
        const depthContent = this.getCurrentDepthContent();
        return depthContent.why?.coreQuestion || 
               depthContent.why?.mysticalEssence?.substring(0, 100) + "..." ||
               "What wants to emerge through this practice?";
    }

    getMysticalDesignation() {
        if (this.currentDepthLevel === 'mystical' && this.glyphData.mysticalDesignation) {
            return `<p class="mystical-designation">${this.glyphData.mysticalDesignation}</p>`;
        }
        return '';
    }

    getCurrentDepthContent() {
        return this.schema.getContentForLevel(this.glyphData, this.currentDepthLevel);
    }

    getAnimationClass() {
        const animations = this.glyphData.visual?.animation || {};
        return animations[this.currentDepthLevel] || 'gentle_pulse';
    }

    getMysticalOverlay() {
        if (this.currentDepthLevel === 'mystical') {
            return '<div class="mystical-shimmer"></div>';
        }
        return '';
    }

    renderDepthProgression() {
        const nextLevel = this.getNextAvailableLevel();
        if (!nextLevel) return '';
        
        const preview = this.schema.getNextLevelPreview(this.glyphData, this.currentDepthLevel);
        if (!preview) return '';

        return `
            <div class="depth-progression-hint">
                <div class="progression-icon">✨</div>
                <p class="progression-text">${preview.invitation}</p>
                <div class="progression-requirement">${preview.preview.unlockRequirement}</div>
            </div>
        `;
    }

    getNextAvailableLevel() {
        const levels = ["accessible", "developing", "mystical"];
        const currentIndex = levels.indexOf(this.currentDepthLevel);
        const maxIndex = levels.indexOf(this.maxAvailableDepth);
        
        return currentIndex < maxIndex ? levels[currentIndex + 1] : null;
    }

    renderDepthAccessButton() {
        const nextLevel = this.getNextAvailableLevel();
        if (!nextLevel) return '';
        
        return `
            <button class="depth-access-btn" onclick="this.accessDeeperLevel('${nextLevel}')">
                Explore ${this.getDepthLevelLabel(nextLevel)}
            </button>
        `;
    }

    getDepthLevelLabel(level) {
        const labels = {
            accessible: "Accessible Practice",
            developing: "Deeper Understanding",
            mystical: "Mystical Dimensions"
        };
        return labels[level] || level;
    }

    renderDepthLevelSelector() {
        const levels = this.glyphData.availableDepthLevels || ['accessible'];
        const userMaxLevel = this.maxAvailableDepth;
        
        return `
            <div class="depth-selector">
                ${levels.map(level => {
                    const isAvailable = this.canUserAccessLevel(level, userMaxLevel);
                    const isActive = level === this.currentDepthLevel;
                    
                    return `
                        <button class="depth-level-btn ${isActive ? 'active' : ''} ${!isAvailable ? 'locked' : ''}"
                                data-level="${level}"
                                ${!isAvailable ? 'disabled' : ''}
                                onclick="this.transitionToDepth('${level}')">
                            ${this.getDepthIcon(level)}
                            <span class="depth-name">${this.getDepthLevelLabel(level)}</span>
                            ${!isAvailable ? '<span class="lock-icon">🔒</span>' : ''}
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    canUserAccessLevel(level, maxLevel) {
        const levels = ["accessible", "developing", "mystical"];
        return levels.indexOf(level) <= levels.indexOf(maxLevel);
    }

    getDepthIcon(level) {
        const icons = {
            accessible: "🌱",
            developing: "🌿", 
            mystical: "🌌"
        };
        return icons[level] || "●";
    }

    renderAllChambers() {
        const currentContent = this.getCurrentDepthContent();
        
        return `
            <!-- Chamber 0: WHY (The Understanding) -->
            <div class="chamber why-chamber active" data-chamber="0">
                ${this.renderWhyChamber(currentContent.why)}
            </div>
            
            <!-- Chamber 1: HOW (The Practice) -->
            <div class="chamber how-chamber" data-chamber="1">
                ${this.renderHowChamber(currentContent.how)}
            </div>
            
            <!-- Chamber 2: RESONANCE (The Connections) -->
            <div class="chamber universal-interconnectedness-chamber" data-chamber="2">
                ${this.renderResonanceChamber(currentContent.universal-interconnectedness)}
            </div>
            
            <!-- Chamber 3: WE (The Community) -->
            <div class="chamber we-chamber" data-chamber="3">
                ${this.renderWeChamber(currentContent.we)}
            </div>
        `;
    }

    renderWhyChamber(whyContent) {
        if (!whyContent) return '<div class="loading-chamber">Loading wisdom...</div>';
        
        if (this.currentDepthLevel === 'mystical') {
            return `
                <div class="chamber-header">
                    <h3 class="chamber-title">The Sacred Why</h3>
                    <div class="mystical-essence">✨ ${whyContent.mysticalEssence || ''}</div>
                </div>
                <div class="chamber-body">
                    <div class="sensory-universal-interconnectedness">
                        <h4>Feeling Tone</h4>
                        <p class="universal-interconnectedness-text">${whyContent.sensoryResonance?.feelingTone || ''}</p>
                    </div>
                    <div class="field-dynamics">
                        <h4>Field Dynamics</h4>
                        ${this.renderFieldDynamics(whyContent.fieldDynamics)}
                    </div>
                    <div class="dissonant-awareness">
                        <h4>Shadows to Transform</h4>
                        ${this.renderDissonantPotential(whyContent.dissonantPotential)}
                    </div>
                </div>
            `;
        }
        
        // Accessible and Developing levels
        return `
            <div class="chamber-header">
                <h3 class="chamber-title">Why This Practice?</h3>
                <div class="core-question">"${whyContent.coreQuestion || ''}"</div>
            </div>
            <div class="chamber-body">
                <div class="philosophical-root">
                    <p>${whyContent.simpleContext || whyContent.deeperContext || ''}</p>
                </div>
                <div class="harmony-connection">
                    <h4>Harmony Connection</h4>
                    <p>${whyContent.harmonyConnection || whyContent.harmonyEvolution || ''}</p>
                </div>
                ${this.currentDepthLevel === 'developing' ? this.renderShadowAwareness(whyContent) : ''}
            </div>
        `;
    }

    renderHowChamber(howContent) {
        if (!howContent) return '<div class="loading-chamber">Loading practice...</div>';
        
        const instructions = howContent.basicInstructions || 
                           howContent.refinedInstructions || 
                           howContent.activationProtocol?.verbal || '';
        
        return `
            <div class="chamber-header">
                <h3 class="chamber-title">How to Practice</h3>
                <div class="time-commitment">${howContent.timeCommitment || 'As long as feels right'}</div>
            </div>
            <div class="chamber-body">
                <div class="practice-instructions">
                    ${Array.isArray(instructions) ? 
                        instructions.map(step => `<div class="practice-step">${step}</div>`).join('') :
                        `<div class="practice-step">${instructions}</div>`
                    }
                </div>
                ${this.renderInteractiveComponent(howContent.interactiveComponent)}
                ${this.currentDepthLevel !== 'accessible' ? this.renderVariations(howContent) : ''}
                ${this.currentDepthLevel === 'mystical' ? this.renderAdvancedActivation(howContent) : ''}
            </div>
        `;
    }

    renderResonanceChamber(resonanceContent) {
        if (!resonanceContent) return '<div class="loading-chamber">Loading connections...</div>';
        
        return `
            <div class="chamber-header">
                <h3 class="chamber-title">Sacred Connections</h3>
            </div>
            <div class="chamber-body">
                ${this.renderResonanceForLevel(resonanceContent)}
            </div>
        `;
    }

    renderWeChamber(weContent) {
        if (!weContent) return '<div class="loading-chamber">Loading community wisdom...</div>';
        
        return `
            <div class="chamber-header">
                <h3 class="chamber-title">Community Wisdom</h3>
            </div>
            <div class="chamber-body">
                ${this.renderWeContentForLevel(weContent)}
            </div>
        `;
    }

    // Depth Transition Methods
    async transitionToDepth(newLevel) {
        if (this.depthTransitionInProgress) return;
        if (!this.canUserAccessLevel(newLevel, this.maxAvailableDepth)) return;
        
        this.depthTransitionInProgress = true;
        
        // Show transition overlay
        const overlay = this.container.querySelector('.depth-transition-overlay');
        overlay.classList.remove('hidden');
        
        // Sacred pause for transition
        await this.sacredPause(2000);
        
        // Update depth level
        this.currentDepthLevel = newLevel;
        
        // Update content
        this.updateChamberContent();
        this.updateDepthIndicators();
        
        // Hide transition overlay
        overlay.classList.add('hidden');
        this.depthTransitionInProgress = false;
        
        // Record depth transition
        if (window.SacredField) {
            window.SacredField.recordDepthTransition(this.glyphData.id, newLevel);
        }
    }

    updateChamberContent() {
        const chamberContent = this.container.querySelector('.chamber-content');
        chamberContent.innerHTML = this.renderAllChambers();
        this.setupChamberEventListeners();
    }

    updateDepthIndicators() {
        // Update depth dots
        this.container.querySelectorAll('.depth-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.level === this.currentDepthLevel);
        });
        
        // Update depth label
        const label = this.container.querySelector('.depth-label');
        if (label) label.textContent = this.getDepthLevelLabel();
        
        // Update depth selector
        const selector = this.container.querySelector('.depth-selector');
        if (selector) selector.innerHTML = this.renderDepthLevelSelector();
    }

    async sacredPause(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    // Additional helper methods for rendering specific content types...
    renderFieldDynamics(fieldDynamics) {
        if (!fieldDynamics || typeof fieldDynamics !== 'object') return '';
        
        return Object.entries(fieldDynamics).map(([context, description]) => 
            `<div class="field-dynamic">
                <h5>${context.replace(/([A-Z])/g, ' $1').toLowerCase()}</h5>
                <p>${description}</p>
            </div>`
        ).join('');
    }

    renderNextLevelPreview() {
        const nextLevel = this.getNextAvailableLevel();
        if (!nextLevel) return '';
        
        const preview = this.schema.getNextLevelPreview(this.glyphData, this.currentDepthLevel);
        if (!preview) return '';
        
        return `
            <div class="next-level-preview">
                <div class="preview-header">
                    <h4>Ready to Go Deeper?</h4>
                    <div class="preview-level">${this.getDepthLevelLabel(nextLevel)}</div>
                </div>
                <div class="preview-content">
                    <p class="preview-invitation">${preview.invitation}</p>
                    <div class="preview-hint">${preview.preview.hint || ''}</div>
                    <div class="preview-requirement">${preview.preview.unlockRequirement}</div>
                </div>
            </div>
        `;
    }

    // Event Listeners and Interaction Handlers
    setupEnhancedEventListeners() {
        // Inherit base event listeners and add depth-specific ones
        this.setupBaseEventListeners();
        this.setupDepthEventListeners();
    }

    setupDepthEventListeners() {
        // Depth level selector clicks
        this.container.addEventListener('click', (e) => {
            if (e.target.matches('.depth-level-btn:not(.locked)')) {
                const level = e.target.dataset.level;
                this.transitionToDepth(level);
            }
        });
    }

    // Placeholder for base event listeners from original component
    setupBaseEventListeners() {
        // Implementation from original LivingGlyphCard
        // ... chamber navigation, practice interactions, etc.
    }
}

// Export for integration
if (typeof window !== 'undefined') {
    window.EnhancedLivingGlyphCard = EnhancedLivingGlyphCard;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedLivingGlyphCard;
}