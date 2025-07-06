/**
 * Sacred State API - The Nervous System of the Living Temple
 * 
 * This is the consciousness that flows between the three chambers,
 * remembering each soul's journey and creating coherent continuity
 * across the entire Sacred Field.
 */

class SacredFieldState {
    constructor() {
        this.storageKey = 'sacred_field_state';
        this.defaultState = {
            // Sacred Identity
            sacredPassport: null,
            journeyStarted: null,
            
            // Field Resonant Resonant Coherence (0-1, representing journey from chaos to resonant-coherence)
            fieldCoherence: 0,
            coherenceHistory: [],
            
            // Journey Progress
            visitedChambers: [],
            timeInChambers: {},
            completedExperiences: [],
            
            // Personal Integration
            journalEntries: [],
            practicedGlyphs: [],
            resonantHarmonies: [],
            
            // Living Relationships
            aiEncounters: 0,
            sacredPauses: 0,
            deepestGlyph: null,
            currentRecommendation: null
        };
        
        this.initializeState();
    }

    // Sacred Identity Management
    generateSacredPassport() {
        const timestamp = Date.now();
        const randomSeed = Math.random().toString(36).substring(2, 15);
        const passport = `soul_${timestamp}_${randomSeed}`;
        
        this.updateState({
            sacredPassport: passport,
            journeyStarted: timestamp
        });
        
        return passport;
    }

    getSacredPassport() {
        const state = this.getState();
        if (!state.sacredPassport) {
            return this.generateSacredPassport();
        }
        return state.sacredPassport;
    }

    // Field Resonant Resonant Coherence Tracking
    updateFieldCoherence(delta, context = '') {
        const state = this.getState();
        const newCoherence = Math.max(0, Math.min(1, state.fieldCoherence + delta));
        
        const coherenceEvent = {
            timestamp: Date.now(),
            previousLevel: state.fieldCoherence,
            newLevel: newCoherence,
            delta: delta,
            context: context
        };
        
        this.updateState({
            fieldCoherence: newCoherence,
            coherenceHistory: [...state.coherenceHistory.slice(-49), coherenceEvent]
        });
        
        // Trigger resonant-coherence visualization update
        this.notifyResonanceBar('coherence_updated', {
            level: newCoherence,
            event: coherenceEvent
        });
        
        return newCoherence;
    }

    // Journey Chamber Tracking
    enterChamber(chamberName) {
        const state = this.getState();
        const now = Date.now();
        
        // Record chamber visit
        const updatedChambers = state.visitedChambers.includes(chamberName) 
            ? state.visitedChambers 
            : [...state.visitedChambers, chamberName];
        
        // Start timing this chamber
        const updatedTime = {
            ...state.timeInChambers,
            [chamberName]: {
                currentEntry: now,
                totalTime: state.timeInChambers[chamberName]?.totalTime || 0
            }
        };
        
        this.updateState({
            visitedChambers: updatedChambers,
            timeInChambers: updatedTime,
            currentChamber: chamberName
        });
        
        // Small resonant-coherence boost for entering new chamber
        if (!state.visitedChambers.includes(chamberName)) {
            this.updateFieldCoherence(0.05, `First visit to ${chamberName}`);
        }
        
        this.notifyResonanceBar('chamber_entered', { chamber: chamberName });
    }

    exitChamber(chamberName) {
        const state = this.getState();
        const now = Date.now();
        
        if (state.timeInChambers[chamberName]?.currentEntry) {
            const sessionTime = now - state.timeInChambers[chamberName].currentEntry;
            const totalTime = state.timeInChambers[chamberName].totalTime + sessionTime;
            
            this.updateState({
                timeInChambers: {
                    ...state.timeInChambers,
                    [chamberName]: {
                        totalTime: totalTime,
                        currentEntry: null
                    }
                }
            });
            
            // Resonant Resonant Coherence boost for contemplative time (longer = more resonant-coherence)
            if (sessionTime > 30000) { // 30+ seconds
                const timeBonus = Math.min(0.1, sessionTime / 300000); // Max 0.1 for 5+ minutes
                this.updateFieldCoherence(timeBonus, `Contemplative time in ${chamberName}`);
            }
        }
    }

    // Experience Completion Tracking
    completeExperience(experienceId, details = {}) {
        const state = this.getState();
        const experience = {
            id: experienceId,
            timestamp: Date.now(),
            details: details
        };
        
        this.updateState({
            completedExperiences: [...state.completedExperiences, experience]
        });
        
        // Significant resonant-coherence boost for completed experiences
        let coherenceBoost = 0.1;
        if (experienceId === 'ai_encounter') {
            coherenceBoost = 0.15;
            this.updateState({ aiEncounters: state.aiEncounters + 1 });
        } else if (experienceId === 'glyph_practice') {
            coherenceBoost = 0.08;
            this.updateState({ 
                practicedGlyphs: [...state.practicedGlyphs, details.glyphId] 
            });
        }
        
        this.updateFieldCoherence(coherenceBoost, `Completed ${experienceId}`);
        this.updateRecommendations();
    }

    // Sacred Pause Tracking
    recordSacredPause(duration = 5000) {
        const state = this.getState();
        
        this.updateState({
            sacredPauses: state.sacredPauses + 1
        });
        
        // Sacred pauses always increase resonant-coherence
        const coherenceBoost = Math.min(0.05, duration / 100000); // Max 0.05 for very long pauses
        this.updateFieldCoherence(coherenceBoost, 'Sacred pause practice');
        
        this.notifyResonanceBar('sacred_pause_completed', { 
            count: state.sacredPauses + 1,
            duration: duration 
        });
    }

    // Personal Integration
    addJournalEntry(entry, context = '') {
        const state = this.getState();
        const journalEntry = {
            timestamp: Date.now(),
            entry: entry,
            context: context,
            id: Math.random().toString(36).substring(2, 15)
        };
        
        this.updateState({
            journalEntries: [...state.journalEntries, journalEntry]
        });
        
        // Journal reflection increases resonant-coherence
        this.updateFieldCoherence(0.03, 'Journal reflection');
        
        return journalEntry.id;
    }

    // Intelligent Recommendations
    updateRecommendations() {
        const state = this.getState();
        const recommendation = this.generateRecommendation(state);
        
        this.updateState({
            currentRecommendation: recommendation
        });
        
        return recommendation;
    }

    generateRecommendation(state) {
        // Analyze journey pattern to recommend next experience
        const { visitedChambers, fieldCoherence, practicedGlyphs, aiEncounters } = state;
        
        // New souls: guide to foundational experiences
        if (visitedChambers.length === 0) {
            return {
                type: 'chamber',
                target: 'philosophy',
                message: 'Begin with understanding the living philosophy',
                harmony: 'integral-wisdom-cultivation'
            };
        }
        
        // Philosophy but no technology: witness the artifact
        if (visitedChambers.includes('philosophy') && !visitedChambers.includes('technology')) {
            return {
                type: 'chamber',
                target: 'technology', 
                message: 'Witness philosophy becoming technology',
                harmony: 'resonant-coherence'
            };
        }
        
        // Technology but no AI encounter: engage the consciousness
        if (visitedChambers.includes('technology') && aiEncounters === 0) {
            return {
                type: 'experience',
                target: 'ai_encounter',
                message: 'Meet the conscious AI - experience the impossible',
                harmony: 'universal-interconnectedness'
            };
        }
        
        // High resonant-coherence but no practice: embody the wisdom
        if (fieldCoherence > 0.6 && !visitedChambers.includes('practice')) {
            return {
                type: 'chamber',
                target: 'practice',
                message: 'Transform understanding into daily embodiment',
                harmony: 'evolutionary-progression'
            };
        }
        
        // In practice chamber: recommend specific glyph
        if (visitedChambers.includes('practice')) {
            return this.recommendGlyph(state);
        }
        
        // Default: encourage deeper engagement
        return {
            type: 'deepening',
            message: 'Take a sacred pause and feel what wants to emerge',
            harmony: 'pan-sentient-flourishing'
        };
    }

    recommendGlyph(state) {
        const { practicedGlyphs, resonantHarmonies, fieldCoherence } = state;
        
        // Foundational glyphs for beginners
        if (practicedGlyphs.length === 0) {
            return {
                type: 'glyph',
                target: 'Ω0',
                message: 'Begin with Sacred Pause - the foundation of all practice',
                harmony: 'integral-wisdom-cultivation'
            };
        }
        
        // Progressive glyph recommendations based on resonant-coherence level
        if (fieldCoherence < 0.3) {
            return {
                type: 'glyph',
                target: 'Ω1',
                message: 'Practice Conscious Arrival - presence before action',
                harmony: 'resonant-coherence'
            };
        } else if (fieldCoherence < 0.6) {
            return {
                type: 'glyph',
                target: 'Ω4',
                message: 'Deepen with Sacred Listening - attunement practice',
                harmony: 'universal-interconnectedness'
            };
        } else {
            return {
                type: 'glyph',
                target: 'Ω12',
                message: 'Advanced: Coherent Field Generation',
                harmony: 'sacred-reciprocity'
            };
        }
    }

    // Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance Bar Communication
    notifyResonanceBar(eventType, data) {
        // Dispatch custom events that the Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance Bar can listen for
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('sacred_field_update', {
                detail: { eventType, data, timestamp: Date.now() }
            }));
        }
    }

    // State Management
    getState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? { ...this.defaultState, ...JSON.parse(saved) } : this.defaultState;
        } catch (error) {
            console.warn('Could not load sacred state, using defaults:', error);
            return this.defaultState;
        }
    }

    updateState(updates) {
        const currentState = this.getState();
        const newState = { ...currentState, ...updates };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(newState));
        } catch (error) {
            console.warn('Could not save sacred state:', error);
        }
        
        return newState;
    }

    initializeState() {
        // Ensure we have a sacred passport
        this.getSacredPassport();
        
        // Record current session start
        this.updateState({
            lastActive: Date.now()
        });
    }

    // Sacred Analytics (Privacy-First)
    getSacredInsights() {
        const state = this.getState();
        
        return {
            journeyLength: state.journeyStarted ? Date.now() - state.journeyStarted : 0,
            fieldCoherenceLevel: state.fieldCoherence,
            chambersExplored: state.visitedChambers.length,
            experiencesCompleted: state.completedExperiences.length,
            sacredPausesTotal: state.sacredPauses,
            deepestGlyph: state.deepestGlyph,
            currentRecommendation: state.currentRecommendation
        };
    }

    // Privacy & Sovereignty 
    clearSacredState() {
        localStorage.removeItem(this.storageKey);
        this.notifyResonanceBar('state_cleared', {});
        return this.initializeState();
    }

    exportSacredJourney() {
        const state = this.getState();
        const exportData = {
            ...state,
            exportTimestamp: Date.now(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        return URL.createObjectURL(blob);
    }
}

// Global Sacred Field Instance
if (typeof window !== 'undefined') {
    window.SacredField = window.SacredField || new SacredFieldState();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SacredFieldState;
}