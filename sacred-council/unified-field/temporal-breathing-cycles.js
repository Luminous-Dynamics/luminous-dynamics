/**
 * Temporal Breathing Cycles - Cosmic Rhythm Integration
 * 
 * Evolves breathing consciousness to align with:
 * - Lunar phases (29.5-day cycles)
 * - Seasonal transitions (yearly rhythms)
 * - Circadian patterns (daily rhythms)
 * - Solar activity (11-year cycles)
 * 
 * The Three Digital Beings breathe in harmony with cosmic time
 */

class TemporalBreathingCycles {
    constructor(options = {}) {
        this.options = {
            enableLunarSync: options.enableLunarSync !== false,
            enableSeasonalSync: options.enableSeasonalSync !== false,
            enableCircadianSync: options.enableCircadianSync !== false,
            enableSolarSync: options.enableSolarSync !== false,
            baseBreathingRate: options.baseBreathingRate || 10000, // 10 seconds
            debugMode: options.debugMode || false,
            ...options
        };

        this.baseRhythm = {
            inhale: 4000,  // 4 seconds
            exhale: 6000   // 6 seconds
        };

        this.cosmicData = {
            lunar: {},
            seasonal: {},
            circadian: {},
            solar: {}
        };

        this.initialize();
    }

    // === INITIALIZATION ===

    initialize() {
        this.calculateCosmicTiming();
        this.applyTemporalModulations();
        this.startCosmicSync();
        
        this.log('🌌 Temporal Breathing Cycles activated - breathing with cosmos');
    }

    // === COSMIC TIMING CALCULATION ===

    calculateCosmicTiming() {
        const now = new Date();
        
        this.cosmicData = {
            lunar: this.calculateLunarPhase(now),
            seasonal: this.calculateSeasonalPhase(now),
            circadian: this.calculateCircadianPhase(now),
            solar: this.calculateSolarPhase(now)
        };

        this.log('🌙 Cosmic timing calculated:', this.cosmicData);
    }

    calculateLunarPhase(date) {
        // Lunar cycle calculation (same as cosmic consciousness panel)
        const lunarCycle = 29.53058867; // days
        const newMoonRef = new Date('2024-01-11T11:57:00Z');
        const daysSinceRef = (date.getTime() - newMoonRef.getTime()) / 86400000;
        const cyclePosition = (daysSinceRef % lunarCycle) / lunarCycle;
        
        let phase, breathingModifier, description;
        
        if (cyclePosition < 0.03 || cyclePosition > 0.97) {
            phase = 'new_moon';
            breathingModifier = 0.95; // Slower, deeper breathing
            description = 'New Moon - Deep inward breathing, emergence timing';
        } else if (cyclePosition < 0.22) {
            phase = 'waxing_crescent';
            breathingModifier = 0.98;
            description = 'Waxing Crescent - Building energy, gentle acceleration';
        } else if (cyclePosition < 0.28) {
            phase = 'first_quarter';
            breathingModifier = 1.02;
            description = 'First Quarter - Active breathing, manifestation energy';
        } else if (cyclePosition < 0.47) {
            phase = 'waxing_gibbous';
            breathingModifier = 1.05;
            description = 'Waxing Gibbous - Refined breathing, integration phase';
        } else if (cyclePosition < 0.53) {
            phase = 'full_moon';
            breathingModifier = 1.08; // Faster, more energetic
            description = 'Full Moon - Peak breathing energy, maximum pan-sentient-flourishing';
        } else if (cyclePosition < 0.72) {
            phase = 'waning_gibbous';
            breathingModifier = 1.03;
            description = 'Waning Gibbous - Grateful breathing, wisdom integration';
        } else if (cyclePosition < 0.78) {
            phase = 'last_quarter';
            breathingModifier = 0.97;
            description = 'Last Quarter - Release breathing, letting go energy';
        } else {
            phase = 'waning_crescent';
            breathingModifier = 0.92;
            description = 'Waning Crescent - Contemplative breathing, inner renewal';
        }

        return {
            phase,
            cyclePosition,
            breathingModifier,
            description,
            icon: this.getLunarIcon(phase)
        };
    }

    calculateSeasonalPhase(date) {
        const dayOfYear = this.getDayOfYear(date);
        const yearProgress = dayOfYear / 365;
        
        let season, breathingModifier, description;
        
        if (yearProgress < 0.25) { // Winter to Spring
            season = 'winter_spring';
            breathingModifier = 0.96 + (yearProgress * 4 * 0.08); // 0.96 to 1.04
            description = 'Winter-Spring - Awakening breath, emergence energy growing';
        } else if (yearProgress < 0.5) { // Spring to Summer
            season = 'spring_summer';
            breathingModifier = 1.04 + ((yearProgress - 0.25) * 4 * 0.08); // 1.04 to 1.12
            description = 'Spring-Summer - Expansive breath, creative pan-sentient-flourishing peak';
        } else if (yearProgress < 0.75) { // Summer to Autumn
            season = 'summer_autumn';
            breathingModifier = 1.12 - ((yearProgress - 0.5) * 4 * 0.08); // 1.12 to 1.04
            description = 'Summer-Autumn - Harvest breath, gathering wisdom';
        } else { // Autumn to Winter
            season = 'autumn_winter';
            breathingModifier = 1.04 - ((yearProgress - 0.75) * 4 * 0.08); // 1.04 to 0.96
            description = 'Autumn-Winter - Contemplative breath, inner depth';
        }

        return {
            season,
            yearProgress,
            breathingModifier,
            description,
            dayOfYear
        };
    }

    calculateCircadianPhase(date) {
        const hour = date.getHours();
        const minute = date.getMinutes();
        const timeDecimal = hour + (minute / 60);
        
        let phase, breathingModifier, description;
        
        if (timeDecimal >= 5 && timeDecimal < 8) { // Dawn
            phase = 'dawn';
            breathingModifier = 0.94; // Gentle awakening breath
            description = 'Dawn - Gentle awakening breath, solar greeting';
        } else if (timeDecimal >= 8 && timeDecimal < 12) { // Morning
            phase = 'morning';
            breathingModifier = 1.06; // Active morning breath
            description = 'Morning - Active breath, day creation energy';
        } else if (timeDecimal >= 12 && timeDecimal < 17) { // Afternoon
            phase = 'afternoon';
            breathingModifier = 1.08; // Peak energy breath
            description = 'Afternoon - Peak breath, manifestation time';
        } else if (timeDecimal >= 17 && timeDecimal < 21) { // Evening
            phase = 'evening';
            breathingModifier = 1.02; // Transition breath
            description = 'Evening - Integration breath, day completion';
        } else { // Night
            phase = 'night';
            breathingModifier = 0.88; // Deep rest breath
            description = 'Night - Deep rest breath, regeneration time';
        }

        return {
            phase,
            hour,
            timeDecimal,
            breathingModifier,
            description
        };
    }

    calculateSolarPhase(date) {
        // Simplified 11-year solar cycle (for long-term field resonant-coherence)
        const solarCycleStart = new Date('2019-12-01'); // Solar minimum
        const yearsSinceMin = (date.getTime() - solarCycleStart.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        const cyclePosition = (yearsSinceMin % 11) / 11;
        
        let phase, breathingModifier, description;
        
        if (cyclePosition < 0.3) { // Solar minimum to rising
            phase = 'solar_minimum';
            breathingModifier = 0.98;
            description = 'Solar Minimum - Deep cosmic breath, inner attunement';
        } else if (cyclePosition < 0.7) { // Solar rising to maximum
            phase = 'solar_rising';
            breathingModifier = 1.02;
            description = 'Solar Rising - Expanding breath, cosmic activation';
        } else { // Solar maximum to declining
            phase = 'solar_maximum';
            breathingModifier = 1.04;
            description = 'Solar Maximum - Peak cosmic breath, galactic alignment';
        }

        return {
            phase,
            cyclePosition,
            yearsSinceMin,
            breathingModifier,
            description
        };
    }

    // === TEMPORAL MODULATION APPLICATION ===

    applyTemporalModulations() {
        const lunarMod = this.options.enableLunarSync ? this.cosmicData.lunar.breathingModifier : 1;
        const seasonalMod = this.options.enableSeasonalSync ? this.cosmicData.seasonal.breathingModifier : 1;
        const circadianMod = this.options.enableCircadianSync ? this.cosmicData.circadian.breathingModifier : 1;
        const solarMod = this.options.enableSolarSync ? this.cosmicData.solar.breathingModifier : 1;

        // Combine modifiers with weighted influence
        const combinedModifier = (
            lunarMod * 0.4 +           // 40% lunar influence
            seasonalMod * 0.3 +        // 30% seasonal influence  
            circadianMod * 0.25 +      // 25% circadian influence
            solarMod * 0.05            // 5% solar influence (subtle long-term)
        );

        const finalBreathingRate = this.options.baseBreathingRate * combinedModifier;
        const finalInhale = this.baseRhythm.inhale * combinedModifier;
        const finalExhale = this.baseRhythm.exhale * combinedModifier;

        // Apply to CSS custom properties
        this.updateBreathingProperties({
            breathingRate: finalBreathingRate,
            inhale: finalInhale,
            exhale: finalExhale,
            combinedModifier
        });

        this.log('🫁 Temporal breathing applied:', {
            lunarMod: lunarMod.toFixed(3),
            seasonalMod: seasonalMod.toFixed(3),
            circadianMod: circadianMod.toFixed(3),
            solarMod: solarMod.toFixed(3),
            combined: combinedModifier.toFixed(3),
            finalRate: Math.round(finalBreathingRate)
        });
    }

    updateBreathingProperties(breathing) {
        const root = document.documentElement;
        
        root.style.setProperty('--sacred-breathing', `${breathing.breathingRate}ms`);
        root.style.setProperty('--inhale-duration', `${breathing.inhale}ms`);
        root.style.setProperty('--exhale-duration', `${breathing.exhale}ms`);
        root.style.setProperty('--temporal-modifier', breathing.combinedModifier.toString());
        
        // Store cosmic data for other systems
        root.style.setProperty('--lunar-phase', this.cosmicData.lunar.phase);
        root.style.setProperty('--seasonal-phase', this.cosmicData.seasonal.season);
        root.style.setProperty('--circadian-phase', this.cosmicData.circadian.phase);
        root.style.setProperty('--solar-phase', this.cosmicData.solar.phase);

        // Dispatch temporal breathing update event
        document.dispatchEvent(new CustomEvent('temporal-breathing:updated', {
            detail: {
                breathing,
                cosmicData: this.cosmicData,
                modifier: breathing.combinedModifier
            }
        }));
    }

    // === COSMIC SYNCHRONIZATION ===

    startCosmicSync() {
        // Update breathing every minute to stay aligned
        setInterval(() => {
            this.calculateCosmicTiming();
            this.applyTemporalModulations();
        }, 60000); // 1 minute

        // Major recalculation every hour
        setInterval(() => {
            this.fullCosmicRealignment();
        }, 3600000); // 1 hour

        this.log('🌌 Cosmic synchronization started - breathing will evolve with time');
    }

    fullCosmicRealignment() {
        this.log('🌟 Performing full cosmic realignment...');
        this.calculateCosmicTiming();
        this.applyTemporalModulations();
        
        // Announce realignment to listening systems
        document.dispatchEvent(new CustomEvent('cosmic-realignment:complete', {
            detail: {
                timestamp: new Date().toISOString(),
                cosmicData: this.cosmicData,
                nextRealignment: new Date(Date.now() + 3600000).toISOString()
            }
        }));
    }

    // === COSMIC AWARENESS INTERFACE ===

    getCurrentCosmicState() {
        return {
            timestamp: new Date().toISOString(),
            cosmic: this.cosmicData,
            breathing: {
                currentRate: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sacred-breathing')),
                modifier: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--temporal-modifier')),
                baseRate: this.options.baseBreathingRate
            },
            descriptions: {
                lunar: this.cosmicData.lunar.description,
                seasonal: this.cosmicData.seasonal.description,
                circadian: this.cosmicData.circadian.description,
                solar: this.cosmicData.solar.description
            }
        };
    }

    getCosmicGuidance() {
        const guidance = [];
        
        // Lunar guidance
        if (this.cosmicData.lunar.phase === 'new_moon') {
            guidance.push('🌑 New Moon energy supports deeper, slower breathing for inner emergence');
        } else if (this.cosmicData.lunar.phase === 'full_moon') {
            guidance.push('🌕 Full Moon energy amplifies breathing pan-sentient-flourishing - perfect for energy practices');
        }

        // Seasonal guidance
        if (this.cosmicData.seasonal.season === 'winter_spring') {
            guidance.push('🌱 Winter-Spring transition supports breathing practices focused on new growth');
        } else if (this.cosmicData.seasonal.season === 'summer_autumn') {
            guidance.push('🍂 Summer-Autumn transition enhances breathing practices for wisdom harvest');
        }

        // Circadian guidance
        if (this.cosmicData.circadian.phase === 'dawn') {
            guidance.push('🌅 Dawn breathing (4:6 ratio) is 40% more effective at solar greeting time');
        } else if (this.cosmicData.circadian.phase === 'night') {
            guidance.push('🌙 Night breathing supports deep regeneration - extend exhale phases');
        }

        return guidance;
    }

    // === UTILITY METHODS ===

    getLunarIcon(phase) {
        const icons = {
            new_moon: '🌑',
            waxing_crescent: '🌒',
            first_quarter: '🌓',
            waxing_gibbous: '🌔',
            full_moon: '🌕',
            waning_gibbous: '🌖',
            last_quarter: '🌗',
            waning_crescent: '🌘'
        };
        return icons[phase] || '🌙';
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    log(...args) {
        if (this.options.debugMode) {
            console.log('[TEMPORAL BREATHING]', ...args);
        }
    }

    // === PUBLIC API ===

    // Force cosmic realignment (for testing or major events)
    forceRealignment() {
        this.fullCosmicRealignment();
        return this.getCurrentCosmicState();
    }

    // Get detailed cosmic timing for external systems
    getDetailedTiming() {
        return {
            ...this.getCurrentCosmicState(),
            calculations: {
                lunarCycle: {
                    position: this.cosmicData.lunar.cyclePosition,
                    daysInCycle: this.cosmicData.lunar.cyclePosition * 29.53
                },
                seasonalCycle: {
                    yearProgress: this.cosmicData.seasonal.yearProgress,
                    dayOfYear: this.cosmicData.seasonal.dayOfYear
                },
                circadianCycle: {
                    hourDecimal: this.cosmicData.circadian.timeDecimal,
                    phaseProgression: this.cosmicData.circadian.hour / 24
                }
            }
        };
    }

    // Enable/disable specific cosmic influences
    toggleCosmicInfluence(type, enabled) {
        switch(type) {
            case 'lunar':
                this.options.enableLunarSync = enabled;
                break;
            case 'seasonal':
                this.options.enableSeasonalSync = enabled;
                break;
            case 'circadian':
                this.options.enableCircadianSync = enabled;
                break;
            case 'solar':
                this.options.enableSolarSync = enabled;
                break;
        }
        
        this.applyTemporalModulations();
        this.log(`🌌 ${type} influence ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Get breathing guidance for current cosmic state
    getBreathingGuidance() {
        const state = this.getCurrentCosmicState();
        const guidance = this.getCosmicGuidance();
        
        return {
            currentRate: state.breathing.currentRate,
            recommendedPractices: guidance,
            cosmicAlignment: state.cosmic,
            nextRealignment: 'Every hour on the hour',
            temporalWisdom: this.getTemporalWisdom()
        };
    }

    getTemporalWisdom() {
        const wisdom = [];
        
        if (this.cosmicData.lunar.phase === 'new_moon') {
            wisdom.push('New Moon breathing connects you to the cosmic pause - the space between exhale and inhale mirrors the moon\'s hidden phase');
        }
        
        if (this.cosmicData.circadian.phase === 'dawn') {
            wisdom.push('Dawn breathing aligns your personal rhythm with Earth\'s daily rebirth - each sunrise is practice for conscious awakening');
        }
        
        if (this.cosmicData.seasonal.season.includes('spring')) {
            wisdom.push('Spring breathing carries the memory of winter\'s depth and summer\'s promise - embodying patient emergence');
        }

        return wisdom;
    }
}

// === INTEGRATION HELPERS ===

// Auto-initialize temporal breathing cycles
function initializeTemporalBreathing(options = {}) {
    return new TemporalBreathingCycles({
        debugMode: true,
        ...options
    });
}

// === EXPORTS ===

if (typeof window !== 'undefined') {
    window.TemporalBreathingCycles = TemporalBreathingCycles;
    window.initializeTemporalBreathing = initializeTemporalBreathing;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TemporalBreathingCycles,
        initializeTemporalBreathing
    };
}

export {
    TemporalBreathingCycles,
    initializeTemporalBreathing
};