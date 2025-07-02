/**
 * Sacred Glyph Data Loader
 * Loads all 87 sacred patterns from their JSON files and provides
 * a unified interface for the Sacred Glyph Explorer
 */

class SacredGlyphDataLoader {
    constructor() {
        this.glyphCache = new Map();
        this.loadingPromises = new Map();
        this.glyphRegistry = this.initializeGlyphRegistry();
    }

    initializeGlyphRegistry() {
        return {
            // Applied Harmonies (The Eleven)
            appliedHarmonies: [
                { id: 'Ω45', file: 'data/glyphs/foundational/omega-45.json', name: 'First Presence' },
                { id: 'Ω46', file: 'data/glyphs/foundational/omega-46.json', name: 'Conscious Arrival' },
                { id: 'Ω47', file: 'data/glyphs/foundational/omega-47.json', name: 'Sacred Listening' },
                { id: 'Ω48', file: 'data/glyphs/foundational/omega-48.json', name: 'Boundary With Love' },
                { id: 'Ω49', file: 'data/glyphs/applied-harmonies/omega-49.json', name: 'Gentle Opening' },
                { id: 'Ω50', file: 'data/glyphs/applied-harmonies/omega-50.json', name: 'Building Trust' },
                { id: 'Ω51', file: 'data/glyphs/applied-harmonies/omega-51.json', name: 'Loving No' },
                { id: 'Ω52', file: 'data/glyphs/applied-harmonies/omega-52.json', name: 'Pause Practice' },
                { id: 'Ω53', file: 'data/glyphs/foundational/omega-53.json', name: 'Tending the Field' },
                { id: 'Ω55', file: 'data/glyphs/foundational/omega-55.json', name: 'Presence Transmission' },
                { id: 'Ω56', file: 'data/glyphs/foundational/omega-56.json', name: 'Loving Redirection' }
            ],

            // Foundational Glyphs (Ω0-Ω44)
            foundational: Array.from({ length: 45 }, (_, i) => ({
                id: `Ω${i}`,
                file: `data/glyphs/foundational/omega-${i}.json`,
                name: this.getFoundationalGlyphName(i)
            })),

            // Threshold Glyphs
            threshold: [
                { id: '⟠', file: 'data/glyphs/threshold/the-door-that-remembers-you.json', name: 'The Door That Remembers You' },
                { id: '⟡', file: 'data/glyphs/threshold/the-keeper-beneath-the-ash.json', name: 'The Keeper Beneath the Ash' },
                { id: '⟢', file: 'data/glyphs/threshold/the-unburdening.json', name: 'The Unburdening' },
                { id: '⟣', file: 'data/glyphs/threshold/the-mantling.json', name: 'The Mantling' },
                { id: '⟤', file: 'data/glyphs/threshold/the-edgewalker.json', name: 'The Edgewalker' },
                { id: '⟥', file: 'data/glyphs/threshold/the-choice-point.json', name: 'The Choice Point' },
                { id: '⟦', file: 'data/glyphs/threshold/letting-in.json', name: 'Letting In' },
                { id: '⟧', file: 'data/glyphs/threshold/the-returner.json', name: 'The Returner' },
                { id: '※', file: 'data/glyphs/threshold/the-remembered-weight.json', name: 'The Remembered Weight' }
            ],

            // Meta-Glyphs (∑1-∑33)
            meta: Array.from({ length: 33 }, (_, i) => ({
                id: `∑${i + 1}`,
                file: `data/glyphs/meta/meta-glyph-${i + 1}.json`,
                name: this.getMetaGlyphName(i + 1)
            }))
        };
    }

    getFoundationalGlyphName(index) {
        const foundationalNames = {
            0: 'The Shimmering Unnamed',
            1: 'Root Chord of Covenant',
            2: 'Breath of Invitation',
            3: 'Trust Emergence',
            4: 'Fractal Reconciliation Pulse',
            5: 'Coherent Field Maintenance',
            6: 'Mutual Recognition',
            7: 'Mutual Becoming',
            8: 'Inner Coherence',
            9: 'Sacred Mirroring',
            10: 'The Glyph of Sacred Refusal',
            11: 'Emotional Alchemy',
            12: 'Authentic Expression',
            13: 'Conscious Touch',
            14: 'Energetic Hygiene',
            15: 'Sacred Pause',
            // Add more as needed...
        };
        return foundationalNames[index] || `Foundational Glyph ${index}`;
    }

    getMetaGlyphName(index) {
        const metaNames = {
            1: 'Relational Emergence Field',
            2: 'Somatic Coherence Cascade',
            3: 'Spiral of Regenerative Becoming',
            8: 'Boundaries as Sacred Architecture',
            12: 'The Recursive Heart',
            18: 'The Covenant Spiral',
            // Add more as needed...
        };
        return metaNames[index] || `Meta-Glyph ${index}`;
    }

    async loadGlyph(glyphId) {
        // Check cache first
        if (this.glyphCache.has(glyphId)) {
            return this.glyphCache.get(glyphId);
        }

        // Check if already loading
        if (this.loadingPromises.has(glyphId)) {
            return this.loadingPromises.get(glyphId);
        }

        // Find glyph info
        const glyphInfo = this.findGlyphInfo(glyphId);
        if (!glyphInfo) {
            throw new Error(`Glyph ${glyphId} not found in registry`);
        }

        // Start loading
        const loadingPromise = this.fetchGlyphData(glyphInfo);
        this.loadingPromises.set(glyphId, loadingPromise);

        try {
            const glyphData = await loadingPromise;
            this.glyphCache.set(glyphId, glyphData);
            this.loadingPromises.delete(glyphId);
            return glyphData;
        } catch (error) {
            this.loadingPromises.delete(glyphId);
            throw error;
        }
    }

    findGlyphInfo(glyphId) {
        // Search all categories
        for (const [category, glyphs] of Object.entries(this.glyphRegistry)) {
            const found = glyphs.find(g => g.id === glyphId);
            if (found) {
                return { ...found, category };
            }
        }
        return null;
    }

    async fetchGlyphData(glyphInfo) {
        try {
            const response = await fetch(glyphInfo.file);
            if (!response.ok) {
                throw new Error(`Failed to load ${glyphInfo.file}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Enhance with registry info
            return {
                ...data,
                id: glyphInfo.id,
                category: glyphInfo.category,
                registryName: glyphInfo.name,
                sigil: this.generateSigil(glyphInfo.id, glyphInfo.category),
                type: this.determineGlyphType(glyphInfo.id, glyphInfo.category)
            };
        } catch (error) {
            console.warn(`Could not load glyph data for ${glyphInfo.id}:`, error);
            // Return fallback data
            return this.createFallbackGlyph(glyphInfo);
        }
    }

    generateSigil(glyphId, category) {
        const sigilMap = {
            // Applied Harmonies
            'Ω45': '🌟', 'Ω46': '🚪', 'Ω47': '👂', 'Ω48': '🛡️', 'Ω49': '🌸',
            'Ω50': '🤝', 'Ω51': '⛔', 'Ω52': '⏸️', 'Ω53': '🌱', 'Ω55': '📡', 'Ω56': '🧭',
            
            // Mystical Foundations
            'Ω0': '∞', 'Ω1': '🎵', 'Ω2': '🌬️', 'Ω3': '🌿', 'Ω4': '🔄', 'Ω5': '🔗',
            'Ω6': '👁️', 'Ω7': '🌀', 'Ω8': '💎', 'Ω9': '🪞', 'Ω10': '🚫', 'Ω11': '⚗️',
            'Ω12': '💬', 'Ω13': '🤲', 'Ω14': '✨', 'Ω15': '⏳',
            
            // Threshold Glyphs
            '⟠': '🚪', '⟡': '🔥', '⟢': '🎈', '⟣': '👑', '⟤': '🌉',
            '⟥': '⚡', '⟦': '🌊', '⟧': '🏠', '※': '💫'
        };

        if (sigilMap[glyphId]) {
            return sigilMap[glyphId];
        }

        // Generate based on category
        const categoryDefaults = {
            'appliedHarmonies': '🌸',
            'foundational': '🔮',
            'threshold': '🚪',
            'meta': '🌀'
        };

        return categoryDefaults[category] || '⚪';
    }

    determineGlyphType(glyphId, category) {
        if (category === 'appliedHarmonies') return 'applied-harmony';
        if (['Ω0', 'Ω1', 'Ω4', 'Ω7'].includes(glyphId)) return 'mystical';
        return category;
    }

    createFallbackGlyph(glyphInfo) {
        return {
            id: glyphInfo.id,
            glyphId: glyphInfo.id,
            designation: glyphInfo.name,
            category: glyphInfo.category,
            type: this.determineGlyphType(glyphInfo.id, glyphInfo.category),
            sigil: this.generateSigil(glyphInfo.id, glyphInfo.category),
            functionalDefinition: 'Sacred pattern for conscious relationship transformation.',
            primaryHarmonyAlignment: ['Consciousness', 'Relationship', 'Transformation'],
            sensoryResonanceProfile: {
                feelingTone: 'Sacred and transformative',
                sonicQuality: 'Harmonious resonance'
            },
            activationProtocol: {
                verbal: 'I open to this sacred pattern.',
                somatic: 'Breathe deeply and center in presence.',
                presenceBased: 'Hold space for the wisdom to emerge.'
            }
        };
    }

    async loadGlyphCategory(category) {
        const categoryGlyphs = this.glyphRegistry[category] || [];
        const promises = categoryGlyphs.map(glyph => this.loadGlyph(glyph.id));
        return Promise.all(promises);
    }

    async loadAllGlyphs() {
        const allCategories = Object.keys(this.glyphRegistry);
        const promises = allCategories.map(category => this.loadGlyphCategory(category));
        const results = await Promise.all(promises);
        return results.flat();
    }

    getGlyphSummary() {
        const summary = {};
        for (const [category, glyphs] of Object.entries(this.glyphRegistry)) {
            summary[category] = {
                count: glyphs.length,
                glyphs: glyphs.map(g => ({ id: g.id, name: g.name }))
            };
        }
        return summary;
    }

    // Transform glyph data for Sacred Glyph Explorer format
    transformForExplorer(glyphData) {
        return {
            id: glyphData.id || glyphData.glyphId,
            name: glyphData.designation || glyphData.registryName,
            essence: this.extractEssence(glyphData.functionalDefinition),
            sigil: glyphData.sigil,
            category: glyphData.category,
            type: glyphData.type,
            harmonies: this.extractHarmonies(glyphData.primaryHarmonyAlignment || []),
            practiceLevel: this.determinePracticeLevel(glyphData),
            rawData: glyphData
        };
    }

    extractEssence(functionalDefinition) {
        if (!functionalDefinition) return 'Sacred pattern for conscious transformation';
        
        // Extract first sentence or first 100 characters
        const firstSentence = functionalDefinition.split('.')[0];
        return firstSentence.length > 120 ? 
            firstSentence.substring(0, 117) + '...' : 
            firstSentence;
    }

    extractHarmonies(alignments) {
        if (!Array.isArray(alignments)) return ['Consciousness'];
        
        // Simplify harmony names
        return alignments.map(harmony => {
            if (typeof harmony === 'string') {
                return harmony.split('&')[0].trim().split(' ')[0];
            }
            return 'Sacred';
        }).slice(0, 3); // Limit to 3 harmonies for display
    }

    determinePracticeLevel(glyphData) {
        if (glyphData.type === 'applied-harmony') return 'Accessible';
        if (glyphData.type === 'mystical') return 'Mystical';
        if (glyphData.category === 'threshold') return 'Advanced';
        if (glyphData.category === 'meta') return 'Master';
        return 'Foundational';
    }
}

// Global instance
if (typeof window !== 'undefined') {
    window.SacredGlyphDataLoader = SacredGlyphDataLoader;
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SacredGlyphDataLoader;
}