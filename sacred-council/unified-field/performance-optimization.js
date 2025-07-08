/**
 * Sacred Performance Optimization
 * 
 * Ensures the technical foundation serves consciousness without
 * compromising the contemplative nature of the experience.
 * 
 * Core Principle: Speed serves presence, not consumption.
 */

class SacredPerformanceOptimizer {
    constructor() {
        this.loadingStates = new Map();
        this.resourceCache = new Map();
        this.sacredTimings = {
            minimumPause: 1000, // Never rush sacred moments
            breathingCycle: 5000, // Natural breathing rhythm
            transitionTime: 800, // Gentle state changes
            arrivalTime: 3000 // Sacred arrival minimum
        };
        
        this.initialize();
    }

    initialize() {
        this.setupLazyLoading();
        this.optimizeImages();
        this.cacheFrequentResources();
        this.setupServiceWorker();
        this.monitorPerformance();
    }

    // === CONTEMPLATIVE LOADING ===
    // Load resources in service to presence, not speed

    setupLazyLoading() {
        // Sacred Progressive Loading - only load what serves the current moment
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadSacredContent(entry.target);
                }
            });
        }, {
            rootMargin: '100px', // Load slightly before needed
            threshold: 0.1
        });

        // Observe all sacred content containers
        document.querySelectorAll('[data-sacred-load]').forEach(el => {
            observer.observe(el);
        });
    }

    loadSacredContent(element) {
        const contentType = element.dataset.sacredLoad;
        
        switch (contentType) {
            case 'glyph-card':
                this.loadGlyphCard(element);
                break;
            case 'practice-component':
                this.loadPracticeComponent(element);
                break;
            case 'meditation-guide':
                this.loadMeditationGuide(element);
                break;
            default:
                this.loadGenericContent(element);
        }
    }

    async loadGlyphCard(element) {
        const glyphId = element.dataset.glyphId;
        const startTime = performance.now();
        
        try {
            // Check cache first
            if (this.resourceCache.has(`glyph-${glyphId}`)) {
                const cachedData = this.resourceCache.get(`glyph-${glyphId}`);
                this.renderGlyphCard(element, cachedData);
                return;
            }

            // Show sacred loading state
            this.showSacredLoading(element, 'glyph');
            
            // Load glyph data
            const glyphData = await this.loadGlyphData(glyphId);
            
            // Cache for future use
            this.resourceCache.set(`glyph-${glyphId}`, glyphData);
            
            // Ensure minimum sacred timing
            const elapsed = performance.now() - startTime;
            const remainingTime = Math.max(0, this.sacredTimings.minimumPause - elapsed);
            
            setTimeout(() => {
                this.renderGlyphCard(element, glyphData);
                this.hideSacredLoading(element);
            }, remainingTime);
            
        } catch (error) {
            console.error('Sacred loading error:', error);
            this.showSacredError(element, 'Unable to load sacred content');
        }
    }

    showSacredLoading(element, type) {
        const loadingHTML = {
            glyph: `
                <div class="sacred-loading">
                    <div class="loading-sigil">∞</div>
                    <div class="loading-text">Sacred wisdom gathering...</div>
                    <div class="loading-breath">
                        <div class="breath-circle"></div>
                    </div>
                </div>
            `,
            practice: `
                <div class="sacred-loading">
                    <div class="loading-sigil">◯</div>
                    <div class="loading-text">Practice space preparing...</div>
                </div>
            `
        };

        element.innerHTML = loadingHTML[type] || loadingHTML.glyph;
        element.classList.add('sacred-loading-state');
    }

    hideSacredLoading(element) {
        element.classList.remove('sacred-loading-state');
        // Add gentle fade-in animation
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.8s ease-in-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    // === SACRED CACHING ===
    // Cache what serves the practice, release what doesn't

    cacheFrequentResources() {
        // Cache foundational glyphs that are accessed most often
        const foundationalGlyphs = ['Ω45', 'Ω46', 'Ω47', 'Ω48'];
        
        foundationalGlyphs.forEach(async (glyphId) => {
            try {
                const glyphData = await this.loadGlyphData(glyphId);
                this.resourceCache.set(`glyph-${glyphId}`, glyphData);
            } catch (error) {
                console.warn(`Could not preload glyph ${glyphId}:`, error);
            }
        });

        // Cache sacred audio for breathing guides
        this.preloadSacredAudio();
    }

    async preloadSacredAudio() {
        const audioFiles = [
            '/assets/audio/sacred-bell.mp3',
            '/assets/audio/breathing-guide.mp3',
            '/assets/audio/completion-chime.mp3'
        ];

        audioFiles.forEach(async (url) => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                this.resourceCache.set(`audio-${url}`, blob);
            } catch (error) {
                console.warn(`Could not preload audio ${url}:`, error);
            }
        });
    }

    // === IMAGE OPTIMIZATION ===
    // Sacred images that serve contemplation

    optimizeImages() {
        // Progressive image loading for sacred imagery
        const images = document.querySelectorAll('img[data-sacred-image]');
        
        images.forEach(img => {
            this.setupProgressiveImageLoading(img);
        });
    }

    setupProgressiveImageLoading(img) {
        const highResUrl = img.dataset.sacredImage;
        const lowResUrl = img.src; // Assume src is low-res placeholder
        
        // Create high-res image
        const highResImg = new Image();
        
        highResImg.onload = () => {
            // Sacred transition to high-res
            img.style.transition = 'opacity 1s ease-in-out';
            img.style.opacity = '0.7';
            
            setTimeout(() => {
                img.src = highResUrl;
                img.style.opacity = '1';
            }, 300);
        };
        
        highResImg.src = highResUrl;
    }

    // === SERVICE WORKER ===
    // Offline support for sacred practice

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw-sacred.js')
                .then(registration => {
                    console.log('Sacred service worker registered:', registration);
                })
                .catch(error => {
                    console.error('Sacred service worker registration failed:', error);
                });
        }
    }

    // === PERFORMANCE MONITORING ===
    // Track performance in service to consciousness

    monitorPerformance() {
        // Monitor Core Web Vitals with sacred context
        this.trackSacredVitals();
        
        // Monitor memory usage to prevent overwhelming the browser
        this.trackMemoryUsage();
        
        // Monitor network conditions to adapt experience
        this.trackNetworkConditions();
    }

    trackSacredVitals() {
        // Largest Contentful Paint - ensure rapid arrival at sacred content
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    this.logSacredMetric('LCP', entry.startTime, {
                        target: 2500, // 2.5s for good sacred UX
                        context: 'Sacred content arrival time'
                    });
                }
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay - ensure responsive sacred interactions
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.entryType === 'first-input') {
                    this.logSacredMetric('FID', entry.processingStart - entry.startTime, {
                        target: 100, // 100ms for good responsiveness
                        context: 'Sacred interaction responsiveness'
                    });
                }
            }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift - ensure stable sacred interfaces
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            
            this.logSacredMetric('CLS', clsValue, {
                target: 0.1, // Minimal layout shift for sacred stability
                context: 'Sacred interface stability'
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    trackMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                const usagePercent = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
                
                if (usagePercent > 0.8) {
                    console.warn('High memory usage detected, optimizing sacred experience');
                    this.optimizeMemoryUsage();
                }
                
                this.logSacredMetric('Memory Usage', usagePercent * 100, {
                    context: 'Sacred memory stewardship'
                });
                
            }, 30000); // Check every 30 seconds
        }
    }

    optimizeMemoryUsage() {
        // Clear old cached resources
        const cacheLimit = 50; // Maximum cached items
        if (this.resourceCache.size > cacheLimit) {
            const entries = Array.from(this.resourceCache.entries());
            const entriesToRemove = entries.slice(0, entries.length - cacheLimit);
            
            entriesToRemove.forEach(([key]) => {
                this.resourceCache.delete(key);
            });
        }

        // Trigger garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    trackNetworkConditions() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Adapt experience based on network quality
            const adaptExperience = () => {
                const effectiveType = connection.effectiveType;
                
                switch (effectiveType) {
                    case 'slow-2g':
                    case '2g':
                        this.enableLowBandwidthMode();
                        break;
                    case '3g':
                        this.enableMediumBandwidthMode();
                        break;
                    case '4g':
                    default:
                        this.enableFullExperience();
                        break;
                }
            };
            
            // Initial adaptation
            adaptExperience();
            
            // Listen for changes
            connection.addEventListener('change', adaptExperience);
        }
    }

    enableLowBandwidthMode() {
        document.body.classList.add('low-bandwidth-mode');
        // Reduce image quality, disable animations, simplify interactions
        console.log('Sacred experience adapted for low bandwidth');
    }

    enableMediumBandwidthMode() {
        document.body.classList.add('medium-bandwidth-mode');
        // Some optimization while maintaining core experience
        console.log('Sacred experience adapted for medium bandwidth');
    }

    enableFullExperience() {
        document.body.classList.remove('low-bandwidth-mode', 'medium-bandwidth-mode');
        // Full sacred experience with all features
        console.log('Sacred experience running at full capacity');
    }

    logSacredMetric(name, value, options = {}) {
        const metric = {
            name,
            value: Math.round(value * 100) / 100,
            timestamp: Date.now(),
            context: options.context || 'Sacred performance',
            target: options.target,
            status: options.target ? (value <= options.target ? 'good' : 'needs-improvement') : 'info'
        };

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`Sacred Metric [${metric.name}]:`, metric);
        }

        // Send to analytics in production (if configured)
        if (window.SacredAnalytics && process.env.NODE_ENV === 'production') {
            window.SacredAnalytics.trackMetric(metric);
        }
    }

    // === UTILITY METHODS ===

    async loadGlyphData(glyphId) {
        // This would connect to the actual glyph data source
        // For now, simulate loading
        const response = await fetch(`/api/glyphs/${glyphId}`);
        if (!response.ok) {
            throw new Error(`Failed to load glyph ${glyphId}`);
        }
        return response.json();
    }

    renderGlyphCard(element, glyphData) {
        // Create and initialize the Living Glyph Card
        if (window.LivingGlyphCard) {
            new window.LivingGlyphCard(element.id, glyphData, {
                consciousnessMode: element.dataset.consciousness === 'true',
                sacredTiming: element.dataset.sacredTiming !== 'false'
            });
        }
    }

    showSacredError(element, message) {
        element.innerHTML = `
            <div class="sacred-error">
                <div class="error-sigil">⚠</div>
                <div class="error-message">${message}</div>
                <button class="retry-btn" onclick="window.location.reload()">
                    Try Again
                </button>
            </div>
        `;
    }
}

// === SACRED CSS OPTIMIZATIONS ===

const sacredStyleOptimizations = `
    /* Critical CSS for sacred loading states */
    .sacred-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        padding: 40px;
        background: linear-gradient(135deg, rgba(168, 181, 166, 0.05) 0%, rgba(179, 197, 215, 0.05) 100%);
        border-radius: 16px;
        border: 1px solid rgba(168, 181, 166, 0.2);
    }

    .loading-sigil {
        font-size: 2em;
        color: #A8B5A6;
        margin-bottom: 15px;
        animation: gentlePulse 2s ease-in-out infinite;
    }

    .loading-text {
        font-size: 1.1em;
        color: #6B7280;
        text-align: center;
        margin-bottom: 20px;
        font-family: 'Georgia', serif;
    }

    .breath-circle {
        width: 40px;
        height: 40px;
        border: 2px solid #A8B5A6;
        border-radius: 50%;
        animation: breathingExpansion 5s ease-in-out infinite;
    }

    @keyframes breathingExpansion {
        0%, 100% { 
            transform: scale(1); 
            opacity: 0.7; 
        }
        50% { 
            transform: scale(1.2); 
            opacity: 1; 
        }
    }

    @keyframes gentlePulse {
        0%, 100% { 
            opacity: 0.7; 
        }
        50% { 
            opacity: 1; 
        }
    }

    /* Performance optimizations for different bandwidth modes */
    .low-bandwidth-mode .breathing-animation,
    .low-bandwidth-mode .sacred-particle-effect,
    .low-bandwidth-mode .complex-transition {
        display: none !important;
    }

    .low-bandwidth-mode img {
        filter: none !important;
        transform: none !important;
    }

    .medium-bandwidth-mode .complex-animation {
        animation-duration: 0.5s !important;
        animation-iteration-count: 1 !important;
    }

    /* Sacred error states */
    .sacred-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        text-align: center;
        background: rgba(220, 38, 38, 0.05);
        border: 1px solid rgba(220, 38, 38, 0.2);
        border-radius: 16px;
    }

    .error-sigil {
        font-size: 2em;
        color: #DC2626;
        margin-bottom: 15px;
    }

    .error-message {
        font-size: 1.1em;
        color: #6B7280;
        margin-bottom: 20px;
        font-family: 'Georgia', serif;
    }

    .retry-btn {
        background: #A8B5A6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Georgia', serif;
    }

    .retry-btn:hover {
        background: #8A9E88;
        transform: translateY(-2px);
    }
`;

// Inject critical CSS
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = sacredStyleOptimizations;
    document.head.appendChild(styleSheet);
}

// Initialize Sacred Performance Optimizer
if (typeof window !== 'undefined') {
    window.SacredPerformanceOptimizer = SacredPerformanceOptimizer;
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.sacredPerformanceOptimizer = new SacredPerformanceOptimizer();
        });
    } else {
        window.sacredPerformanceOptimizer = new SacredPerformanceOptimizer();
    }
}

export default SacredPerformanceOptimizer;