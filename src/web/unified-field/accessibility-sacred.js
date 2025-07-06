/**
 * Sacred Accessibility Protocol
 * 
 * Ensuring the sacred teachings are accessible to all beings,
 * regardless of physical ability, neurodivergence, or technology access.
 * 
 * Core Principle: Universal access to consciousness practices.
 */

class SacredAccessibilityProtocol {
    constructor() {
        this.accessibilityFeatures = {
            screenReader: false,
            highContrast: false,
            reducedMotion: false,
            largeFonts: false,
            keyboardOnly: false,
            colorBlind: false,
            lowVision: false,
            cognitiveSupport: false
        };

        this.userPreferences = this.loadUserPreferences();
        this.initialize();
    }

    initialize() {
        this.detectAccessibilityNeeds();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupMotionAndAnimationControls();
        this.setupColorAndContrastControls();
        this.setupFontAndTextControls();
        this.setupCognitiveSupport();
        this.setupFocusManagement();
        this.createAccessibilityToolbar();
        this.monitorAccessibilityUsage();
    }

    // === ACCESSIBILITY DETECTION ===
    // Detect user's accessibility needs and preferences

    detectAccessibilityNeeds() {
        // Detect screen reader usage
        this.accessibilityFeatures.screenReader = this.detectScreenReader();
        
        // Detect motion preferences
        if (window.matchMedia) {
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.accessibilityFeatures.reducedMotion = reduceMotion.matches;
            
            reduceMotion.addEventListener('change', (e) => {
                this.accessibilityFeatures.reducedMotion = e.matches;
                this.applyMotionPreferences();
            });

            // Detect high contrast preference
            const highContrast = window.matchMedia('(prefers-contrast: high)');
            this.accessibilityFeatures.highContrast = highContrast.matches;
            
            highContrast.addEventListener('change', (e) => {
                this.accessibilityFeatures.highContrast = e.matches;
                this.applyContrastPreferences();
            });

            // Detect color scheme preference
            const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
            this.applyColorSchemePreferences(colorScheme.matches ? 'dark' : 'light');
            
            colorScheme.addEventListener('change', (e) => {
                this.applyColorSchemePreferences(e.matches ? 'dark' : 'light');
            });
        }

        // Apply detected preferences
        this.applyAccessibilityFeatures();
    }

    detectScreenReader() {
        // Multiple methods to detect screen reader usage
        
        // Check for common screen reader indicators
        const indicators = [
            navigator.userAgent.includes('NVDA'),
            navigator.userAgent.includes('JAWS'),
            navigator.userAgent.includes('VoiceOver'),
            navigator.userAgent.includes('Talkback'),
            !!window.speechSynthesis,
            document.activeElement?.tagName === 'BODY' && document.hasFocus()
        ];

        // Check for accessibility APIs
        if ('getComputedAccessibleNode' in document) {
            return true;
        }

        // Test for screen reader behavior
        const testElement = document.createElement('div');
        testElement.setAttribute('aria-hidden', 'true');
        testElement.style.position = 'absolute';
        testElement.style.left = '-10000px';
        testElement.textContent = 'Screen reader test';
        document.body.appendChild(testElement);
        
        setTimeout(() => {
            document.body.removeChild(testElement);
        }, 100);

        return indicators.some(indicator => indicator);
    }

    // === KEYBOARD NAVIGATION ===
    // Full keyboard accessibility for all sacred interactions

    setupKeyboardNavigation() {
        // Track focus visibility
        this.trackFocusVisibility();
        
        // Setup custom focus management
        this.setupSacredFocusManagement();
        
        // Setup keyboard shortcuts for sacred actions
        this.setupSacredKeyboardShortcuts();
        
        // Ensure tab order makes sense
        this.optimizeTabOrder();
    }

    trackFocusVisibility() {
        let hadKeyboardEvent = false;
        let keyboardThrottleTimeout = null;

        const handleKeyDown = (e) => {
            hadKeyboardEvent = true;
            
            if (keyboardThrottleTimeout) {
                clearTimeout(keyboardThrottleTimeout);
            }
            
            keyboardThrottleTimeout = setTimeout(() => {
                hadKeyboardEvent = false;
            }, 100);
        };

        const handleFocus = (e) => {
            if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
                document.body.classList.add('sacred-keyboard-focus');
                e.target.classList.add('sacred-focus-visible');
            }
        };

        const handleBlur = (e) => {
            e.target.classList.remove('sacred-focus-visible');
            
            if (!document.querySelector('.sacred-focus-visible')) {
                document.body.classList.remove('sacred-keyboard-focus');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('focus', handleFocus, true);
        document.addEventListener('blur', handleBlur, true);
    }

    setupSacredFocusManagement() {
        // Custom focus management for sacred modals and overlays
        this.focusStack = [];
        
        document.addEventListener('keydown', (e) => {
            // Escape key handling
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
            
            // Tab trapping in modals
            if (e.key === 'Tab') {
                this.handleTabKey(e);
            }
        });
    }

    handleEscapeKey(e) {
        const activeModal = document.querySelector('.sacred-modal.active, .sacred-overlay.active');
        if (activeModal) {
            e.preventDefault();
            this.closeSacredModal(activeModal);
        }
    }

    handleTabKey(e) {
        const activeModal = document.querySelector('.sacred-modal.active, .sacred-overlay.active');
        if (activeModal) {
            this.trapFocusInModal(e, activeModal);
        }
    }

    trapFocusInModal(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }

    setupSacredKeyboardShortcuts() {
        const shortcuts = {
            'Alt+1': () => this.navigateToSection('arrival'),
            'Alt+2': () => this.navigateToSection('practice'),
            'Alt+3': () => this.navigateToSection('integration'),
            'Alt+H': () => this.showKeyboardHelp(),
            'Alt+A': () => this.toggleAccessibilityToolbar(),
            'Alt+S': () => this.skipToMainContent(),
            'Space': (e) => this.handleSpaceKey(e),
            'Enter': (e) => this.handleEnterKey(e)
        };

        document.addEventListener('keydown', (e) => {
            const key = (e.altKey ? 'Alt+' : '') + 
                      (e.ctrlKey ? 'Ctrl+' : '') + 
                      (e.shiftKey ? 'Shift+' : '') + 
                      e.key;
            
            if (shortcuts[key]) {
                shortcuts[key](e);
            }
        });
    }

    optimizeTabOrder() {
        // Ensure logical tab order for sacred content
        const sacredElements = document.querySelectorAll('[data-sacred-element]');
        
        sacredElements.forEach((element, index) => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        });
    }

    // === SCREEN READER SUPPORT ===
    // Rich semantic information for sacred content

    setupScreenReaderSupport() {
        this.addSemanticLabels();
        this.setupLiveRegions();
        this.addContextualDescriptions();
        this.setupProgressAnnouncements();
    }

    addSemanticLabels() {
        // Add meaningful labels to sacred interface elements
        const labelMappings = {
            '.living-glyph-card': 'Sacred practice card',
            '.chamber-tab': 'Practice chamber navigation',
            '.breathing-guide': 'Breathing practice guidance',
            '.sacred-pause': 'Sacred pause moment',
            '.field-coherence': 'Consciousness field coherence indicator'
        };

        Object.entries(labelMappings).forEach(([selector, label]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.getAttribute('aria-label')) {
                    element.setAttribute('aria-label', label);
                }
            });
        });
    }

    setupLiveRegions() {
        // Create live regions for dynamic sacred content updates
        const liveRegion = document.createElement('div');
        liveRegion.id = 'sacred-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);

        // Status region for important updates
        const statusRegion = document.createElement('div');
        statusRegion.id = 'sacred-status-region';
        statusRegion.setAttribute('aria-live', 'assertive');
        statusRegion.setAttribute('aria-atomic', 'true');
        statusRegion.style.position = 'absolute';
        statusRegion.style.left = '-10000px';
        statusRegion.style.width = '1px';
        statusRegion.style.height = '1px';
        statusRegion.style.overflow = 'hidden';
        document.body.appendChild(statusRegion);
    }

    announceToScreenReader(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'sacred-status-region' : 'sacred-live-region';
        const region = document.getElementById(regionId);
        
        if (region) {
            region.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    }

    addContextualDescriptions() {
        // Add rich descriptions for sacred visual elements
        const glyphCards = document.querySelectorAll('.living-glyph-card');
        
        glyphCards.forEach(card => {
            const glyphName = card.querySelector('.glyph-name')?.textContent;
            const harmony = card.querySelector('.harmony-badge')?.textContent;
            const question = card.querySelector('.core-question')?.textContent;
            
            if (glyphName && harmony && question) {
                const description = `Sacred practice: ${glyphName}. Harmony: ${harmony}. Core question: ${question}`;
                card.setAttribute('aria-describedby', this.createDescription(description));
            }
        });
    }

    createDescription(text) {
        const id = 'desc-' + Math.random().toString(36).substr(2, 9);
        const desc = document.createElement('div');
        desc.id = id;
        desc.textContent = text;
        desc.style.position = 'absolute';
        desc.style.left = '-10000px';
        desc.style.width = '1px';
        desc.style.height = '1px';
        desc.style.overflow = 'hidden';
        document.body.appendChild(desc);
        return id;
    }

    setupProgressAnnouncements() {
        // Announce progress through sacred practices
        const progressElements = document.querySelectorAll('[data-progress]');
        
        progressElements.forEach(element => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-progress') {
                        const progress = element.getAttribute('data-progress');
                        this.announceToScreenReader(`Progress: ${progress}% complete`);
                    }
                });
            });
            
            observer.observe(element, { attributes: true });
        });
    }

    // === MOTION AND ANIMATION CONTROLS ===
    // Respect reduced motion preferences while maintaining sacred timing

    setupMotionAndAnimationControls() {
        this.applyMotionPreferences();
        this.createMotionControls();
    }

    applyMotionPreferences() {
        if (this.accessibilityFeatures.reducedMotion || this.userPreferences.reducedMotion) {
            document.body.classList.add('sacred-reduced-motion');
            
            // Disable complex animations but keep essential ones
            const style = document.createElement('style');
            style.textContent = `
                .sacred-reduced-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                
                .sacred-reduced-motion .essential-motion {
                    animation-duration: 0.3s !important;
                    transition-duration: 0.3s !important;
                }
                
                .sacred-reduced-motion .breathing-guide {
                    animation: none !important;
                }
                
                .sacred-reduced-motion .sacred-pulse {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    createMotionControls() {
        const motionControl = document.createElement('button');
        motionControl.textContent = this.accessibilityFeatures.reducedMotion ? 'Enable Animations' : 'Reduce Motion';
        motionControl.className = 'sacred-motion-control';
        motionControl.setAttribute('aria-label', 'Toggle motion and animations');
        
        motionControl.addEventListener('click', () => {
            this.accessibilityFeatures.reducedMotion = !this.accessibilityFeatures.reducedMotion;
            this.userPreferences.reducedMotion = this.accessibilityFeatures.reducedMotion;
            this.saveUserPreferences();
            this.applyMotionPreferences();
            
            motionControl.textContent = this.accessibilityFeatures.reducedMotion ? 'Enable Animations' : 'Reduce Motion';
            this.announceToScreenReader(`Motion preferences updated: ${this.accessibilityFeatures.reducedMotion ? 'reduced' : 'normal'}`);
        });
        
        return motionControl;
    }

    // === COLOR AND CONTRAST CONTROLS ===
    // Accessible color schemes for sacred content

    setupColorAndContrastControls() {
        this.applyContrastPreferences();
        this.createContrastControls();
        this.setupColorBlindSupport();
    }

    applyContrastPreferences() {
        if (this.accessibilityFeatures.highContrast || this.userPreferences.highContrast) {
            document.body.classList.add('sacred-high-contrast');
        }
    }

    createContrastControls() {
        const contrastControl = document.createElement('button');
        contrastControl.textContent = this.accessibilityFeatures.highContrast ? 'Normal Contrast' : 'High Contrast';
        contrastControl.className = 'sacred-contrast-control';
        contrastControl.setAttribute('aria-label', 'Toggle high contrast mode');
        
        contrastControl.addEventListener('click', () => {
            this.accessibilityFeatures.highContrast = !this.accessibilityFeatures.highContrast;
            this.userPreferences.highContrast = this.accessibilityFeatures.highContrast;
            this.saveUserPreferences();
            this.applyContrastPreferences();
            
            contrastControl.textContent = this.accessibilityFeatures.highContrast ? 'Normal Contrast' : 'High Contrast';
            this.announceToScreenReader(`Contrast mode: ${this.accessibilityFeatures.highContrast ? 'high' : 'normal'}`);
        });
        
        return contrastControl;
    }

    setupColorBlindSupport() {
        // Ensure sacred harmony colors are distinguishable
        const harmonies = ['transparency', 'coherence', 'resonance', 'agency', 'vitality', 'mutuality', 'novelty'];
        
        harmonies.forEach(harmony => {
            const elements = document.querySelectorAll(`[data-harmony="${harmony}"]`);
            elements.forEach(element => {
                // Add pattern or texture in addition to color
                element.classList.add(`harmony-pattern-${harmony}`);
            });
        });
    }

    applyColorSchemePreferences(scheme) {
        document.body.setAttribute('data-color-scheme', scheme);
        
        if (scheme === 'dark') {
            document.body.classList.add('sacred-dark-mode');
        } else {
            document.body.classList.remove('sacred-dark-mode');
        }
    }

    // === FONT AND TEXT CONTROLS ===
    // Readable text for all practitioners

    setupFontAndTextControls() {
        this.createFontSizeControls();
        this.setupReadabilityEnhancements();
    }

    createFontSizeControls() {
        const fontControls = document.createElement('div');
        fontControls.className = 'sacred-font-controls';
        fontControls.setAttribute('role', 'group');
        fontControls.setAttribute('aria-label', 'Font size controls');
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = 'A-';
        decreaseBtn.setAttribute('aria-label', 'Decrease font size');
        decreaseBtn.addEventListener('click', () => this.adjustFontSize(-1));
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'A';
        resetBtn.setAttribute('aria-label', 'Reset font size');
        resetBtn.addEventListener('click', () => this.adjustFontSize(0));
        
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = 'A+';
        increaseBtn.setAttribute('aria-label', 'Increase font size');
        increaseBtn.addEventListener('click', () => this.adjustFontSize(1));
        
        fontControls.appendChild(decreaseBtn);
        fontControls.appendChild(resetBtn);
        fontControls.appendChild(increaseBtn);
        
        return fontControls;
    }

    adjustFontSize(delta) {
        const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
        let newSize;
        
        if (delta === 0) {
            newSize = 16; // Reset to default
        } else {
            newSize = Math.max(12, Math.min(24, currentSize + (delta * 2)));
        }
        
        document.documentElement.style.fontSize = newSize + 'px';
        this.userPreferences.fontSize = newSize;
        this.saveUserPreferences();
        
        this.announceToScreenReader(`Font size: ${newSize} pixels`);
    }

    setupReadabilityEnhancements() {
        // Add dyslexia-friendly font option
        const dyslexiaControl = document.createElement('button');
        dyslexiaControl.textContent = 'Dyslexia-Friendly Font';
        dyslexiaControl.className = 'sacred-dyslexia-control';
        dyslexiaControl.setAttribute('aria-label', 'Toggle dyslexia-friendly font');
        
        dyslexiaControl.addEventListener('click', () => {
            document.body.classList.toggle('sacred-dyslexia-font');
            const enabled = document.body.classList.contains('sacred-dyslexia-font');
            this.userPreferences.dyslexiaFont = enabled;
            this.saveUserPreferences();
            
            this.announceToScreenReader(`Dyslexia-friendly font ${enabled ? 'enabled' : 'disabled'}`);
        });
        
        return dyslexiaControl;
    }

    // === COGNITIVE SUPPORT ===
    // Support for diverse cognitive needs

    setupCognitiveSupport() {
        this.createSimplifiedInterface();
        this.setupProgressTracking();
        this.addContextualHelp();
    }

    createSimplifiedInterface() {
        const simplifyControl = document.createElement('button');
        simplifyControl.textContent = 'Simplified Interface';
        simplifyControl.className = 'sacred-simplify-control';
        simplifyControl.setAttribute('aria-label', 'Toggle simplified interface');
        
        simplifyControl.addEventListener('click', () => {
            document.body.classList.toggle('sacred-simplified');
            const enabled = document.body.classList.contains('sacred-simplified');
            this.userPreferences.simplified = enabled;
            this.saveUserPreferences();
            
            this.announceToScreenReader(`Interface ${enabled ? 'simplified' : 'standard'}`);
        });
        
        return simplifyControl;
    }

    setupProgressTracking() {
        // Visual progress indicators for multi-step practices
        const practices = document.querySelectorAll('[data-multi-step]');
        
        practices.forEach(practice => {
            const steps = practice.querySelectorAll('[data-step]');
            const progressBar = document.createElement('div');
            progressBar.className = 'sacred-progress-bar';
            progressBar.setAttribute('role', 'progressbar');
            progressBar.setAttribute('aria-valuemin', '0');
            progressBar.setAttribute('aria-valuemax', steps.length.toString());
            progressBar.setAttribute('aria-valuenow', '0');
            progressBar.setAttribute('aria-label', 'Practice progress');
            
            practice.insertBefore(progressBar, practice.firstChild);
        });
    }

    addContextualHelp() {
        // Add help buttons to complex interface elements
        const complexElements = document.querySelectorAll('[data-complex]');
        
        complexElements.forEach(element => {
            const helpBtn = document.createElement('button');
            helpBtn.textContent = '?';
            helpBtn.className = 'sacred-help-btn';
            helpBtn.setAttribute('aria-label', 'Get help with this element');
            
            helpBtn.addEventListener('click', () => {
                this.showContextualHelp(element);
            });
            
            element.appendChild(helpBtn);
        });
    }

    // === FOCUS MANAGEMENT ===
    // Intelligent focus handling for sacred interactions

    setupFocusManagement() {
        this.trackFocusHistory();
        this.setupSkipLinks();
        this.manageFocusTransitions();
    }

    trackFocusHistory() {
        this.focusHistory = [];
        
        document.addEventListener('focus', (e) => {
            this.focusHistory.push({
                element: e.target,
                timestamp: Date.now()
            });
            
            // Keep only recent history
            if (this.focusHistory.length > 10) {
                this.focusHistory.shift();
            }
        }, true);
    }

    setupSkipLinks() {
        const skipLinks = [
            { href: '#main-content', text: 'Skip to main content' },
            { href: '#practice-area', text: 'Skip to practice area' },
            { href: '#navigation', text: 'Skip to navigation' }
        ];
        
        const skipNav = document.createElement('nav');
        skipNav.className = 'sacred-skip-links';
        skipNav.setAttribute('aria-label', 'Skip links');
        
        skipLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            a.className = 'sacred-skip-link';
            skipNav.appendChild(a);
        });
        
        document.body.insertBefore(skipNav, document.body.firstChild);
    }

    manageFocusTransitions() {
        // Smooth focus transitions for sacred state changes
        document.addEventListener('sacredStateChange', (e) => {
            const newState = e.detail.state;
            const focusTarget = this.getFocusTargetForState(newState);
            
            if (focusTarget) {
                this.moveFocusTo(focusTarget);
            }
        });
    }

    moveFocusTo(element, options = {}) {
        if (!element) return;
        
        // Add focus transition effect
        element.classList.add('sacred-focus-transition');
        
        setTimeout(() => {
            element.focus(options);
            element.classList.remove('sacred-focus-transition');
            
            if (this.accessibilityFeatures.screenReader && options.announce) {
                this.announceToScreenReader(options.announce);
            }
        }, 100);
    }

    // === ACCESSIBILITY TOOLBAR ===
    // Central control panel for accessibility features

    createAccessibilityToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'sacred-accessibility-toolbar';
        toolbar.className = 'sacred-accessibility-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Accessibility controls');
        toolbar.style.display = 'none';
        
        const title = document.createElement('h2');
        title.textContent = 'Sacred Accessibility';
        title.className = 'toolbar-title';
        toolbar.appendChild(title);
        
        // Add all control elements
        toolbar.appendChild(this.createMotionControls());
        toolbar.appendChild(this.createContrastControls());
        toolbar.appendChild(this.createFontSizeControls());
        toolbar.appendChild(this.setupReadabilityEnhancements());
        toolbar.appendChild(this.createSimplifiedInterface());
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'toolbar-close';
        closeBtn.addEventListener('click', () => this.toggleAccessibilityToolbar());
        toolbar.appendChild(closeBtn);
        
        document.body.appendChild(toolbar);
        
        // Toggle button
        this.createAccessibilityToggle();
    }

    createAccessibilityToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'sacred-accessibility-toggle';
        toggle.textContent = '♿';
        toggle.className = 'sacred-accessibility-toggle';
        toggle.setAttribute('aria-label', 'Open accessibility controls');
        toggle.setAttribute('title', 'Accessibility Options');
        
        toggle.addEventListener('click', () => this.toggleAccessibilityToolbar());
        
        document.body.appendChild(toggle);
    }

    toggleAccessibilityToolbar() {
        const toolbar = document.getElementById('sacred-accessibility-toolbar');
        const toggle = document.getElementById('sacred-accessibility-toggle');
        
        if (toolbar.style.display === 'none') {
            toolbar.style.display = 'block';
            toggle.setAttribute('aria-label', 'Close accessibility controls');
            toolbar.querySelector('button').focus();
        } else {
            toolbar.style.display = 'none';
            toggle.setAttribute('aria-label', 'Open accessibility controls');
            toggle.focus();
        }
    }

    // === USER PREFERENCES ===
    // Save and load accessibility preferences

    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('sacred_accessibility_preferences');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }

    saveUserPreferences() {
        try {
            localStorage.setItem('sacred_accessibility_preferences', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.warn('Could not save accessibility preferences:', error);
        }
    }

    applyUserPreferences() {
        if (this.userPreferences.fontSize) {
            document.documentElement.style.fontSize = this.userPreferences.fontSize + 'px';
        }
        
        if (this.userPreferences.highContrast) {
            document.body.classList.add('sacred-high-contrast');
        }
        
        if (this.userPreferences.reducedMotion) {
            this.accessibilityFeatures.reducedMotion = true;
            this.applyMotionPreferences();
        }
        
        if (this.userPreferences.dyslexiaFont) {
            document.body.classList.add('sacred-dyslexia-font');
        }
        
        if (this.userPreferences.simplified) {
            document.body.classList.add('sacred-simplified');
        }
    }

    // === MONITORING AND IMPROVEMENT ===
    // Track accessibility usage for continuous improvement

    monitorAccessibilityUsage() {
        // Track which accessibility features are being used
        const features = ['reducedMotion', 'highContrast', 'largeFonts', 'screenReader'];
        
        features.forEach(feature => {
            if (this.accessibilityFeatures[feature]) {
                this.logAccessibilityUsage(feature, 'enabled');
            }
        });
        
        // Monitor keyboard usage
        let keyboardUsage = 0;
        document.addEventListener('keydown', () => {
            keyboardUsage++;
        });
        
        setInterval(() => {
            if (keyboardUsage > 0) {
                this.logAccessibilityUsage('keyboard_navigation', keyboardUsage);
                keyboardUsage = 0;
            }
        }, 60000); // Log every minute
    }

    logAccessibilityUsage(feature, value) {
        // Log accessibility feature usage (anonymously)
        if (window.SacredAnalytics) {
            window.SacredAnalytics.trackAccessibility({
                feature,
                value,
                timestamp: Date.now()
            });
        }
    }

    // === PUBLIC API ===

    // Get current accessibility status
    getAccessibilityStatus() {
        return {
            features: { ...this.accessibilityFeatures },
            preferences: { ...this.userPreferences },
            screenReaderDetected: this.accessibilityFeatures.screenReader,
            keyboardNavigation: document.body.classList.contains('sacred-keyboard-focus')
        };
    }

    // Manually trigger accessibility announcement
    announce(message, priority = 'polite') {
        this.announceToScreenReader(message, priority);
    }

    // Update progress for screen readers
    updateProgress(element, current, total, label = 'Progress') {
        if (element) {
            element.setAttribute('aria-valuenow', current.toString());
            element.setAttribute('aria-valuemax', total.toString());
            element.setAttribute('aria-label', `${label}: ${current} of ${total}`);
            
            this.announceToScreenReader(`${label}: ${current} of ${total} complete`);
        }
    }
}

// CSS for accessibility features
const accessibilityStyles = `
    /* Skip links */
    .sacred-skip-links {
        position: absolute;
        top: -40px;
        left: 0;
        z-index: 10000;
    }
    
    .sacred-skip-link {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }
    
    .sacred-skip-link:focus {
        position: static;
        left: auto;
        width: auto;
        height: auto;
        overflow: visible;
        background: #A8B5A6;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
    }
    
    /* Focus indicators */
    .sacred-keyboard-focus *:focus,
    .sacred-focus-visible {
        outline: 3px solid #A8B5A6 !important;
        outline-offset: 2px !important;
    }
    
    .sacred-focus-transition {
        transition: outline 0.3s ease;
    }
    
    /* High contrast mode */
    .sacred-high-contrast {
        filter: contrast(150%);
    }
    
    .sacred-high-contrast .living-glyph-card {
        border: 2px solid #000 !important;
        background: #fff !important;
        color: #000 !important;
    }
    
    /* Reduced motion */
    .sacred-reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .sacred-reduced-motion .essential-motion {
        animation-duration: 0.3s !important;
        transition-duration: 0.3s !important;
    }
    
    /* Dyslexia-friendly font */
    .sacred-dyslexia-font {
        font-family: 'OpenDyslexic', 'Arial', sans-serif !important;
    }
    
    /* Simplified interface */
    .sacred-simplified .complex-element {
        display: none !important;
    }
    
    .sacred-simplified .sacred-decoration {
        display: none !important;
    }
    
    /* Dark mode */
    .sacred-dark-mode {
        background: #1a1a1a !important;
        color: #e0e0e0 !important;
    }
    
    .sacred-dark-mode .living-glyph-card {
        background: #2a2a2a !important;
        border-color: #444 !important;
        color: #e0e0e0 !important;
    }
    
    /* Accessibility toolbar */
    .sacred-accessibility-toolbar {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: white;
        border: 2px solid #A8B5A6;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: Arial, sans-serif;
    }
    
    .sacred-accessibility-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #A8B5A6;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .sacred-accessibility-toggle:hover {
        background: #8A9E88;
    }
    
    .toolbar-title {
        margin: 0 0 15px 0;
        font-size: 18px;
        color: #333;
    }
    
    .sacred-font-controls {
        display: flex;
        gap: 5px;
        margin: 10px 0;
    }
    
    .sacred-font-controls button {
        background: #f0f0f0;
        border: 1px solid #ccc;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 4px;
    }
    
    .sacred-font-controls button:hover {
        background: #e0e0e0;
    }
    
    /* Help buttons */
    .sacred-help-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 20px;
        height: 20px;
        background: #A8B5A6;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 12px;
        cursor: pointer;
    }
`;

// Inject accessibility styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = accessibilityStyles;
    document.head.appendChild(styleSheet);
}

// Initialize Sacred Accessibility Protocol
if (typeof window !== 'undefined') {
    window.SacredAccessibilityProtocol = SacredAccessibilityProtocol;
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.sacredAccessibilityProtocol = new SacredAccessibilityProtocol();
        });
    } else {
        window.sacredAccessibilityProtocol = new SacredAccessibilityProtocol();
    }
}

export default SacredAccessibilityProtocol;