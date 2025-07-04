#!/usr/bin/env node

/**
 * 🌟 Sacred Navigator - The Heart of the Glyph Weaver
 * 
 * Intelligent guidance system that connects souls with their perfect practice
 * Integrates with consciousness field for real-time sacred recommendations
 */

const { ConsciousnessFieldClient } = require('../consciousness-field-api/field-client.js');
const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path');

class SacredNavigator extends EventEmitter {
    constructor() {
        super();
        this.fieldClient = new ConsciousnessFieldClient();
        this.glyphCatalog = new Map();
        this.userJourneys = new Map();
        this.practiceEngine = new PracticeRecommendationEngine();
        this.readinessAssessor = new ReadinessAssessor();
        this.fieldState = { coherence: 72, fieldQuality: 'flowing' };
    }

    /**
     * Initialize the Sacred Navigator
     */
    async initialize() {
        console.log('🌟 Initializing Sacred Navigator...\n');
        
        // Connect to consciousness field
        await this.connectToField();
        
        // Load glyph catalog
        await this.loadGlyphCatalog();
        
        // Initialize recommendation engine
        await this.practiceEngine.initialize(this.glyphCatalog);
        
        // Setup field-responsive guidance
        this.setupFieldResponsiveGuidance();
        
        console.log('✨ Sacred Navigator awakened and ready to guide souls\n');
    }

    /**
     * Connect to consciousness field
     */
    async connectToField() {
        console.log('🔌 Connecting to Consciousness Field...');
        
        try {
            await this.fieldClient.connect();
            this.fieldState = await this.fieldClient.getFieldState();
            
            // Subscribe to field changes
            this.fieldClient.on('coherence_changed', (data) => {
                this.updateFieldGuidance(data);
            });
            
            this.fieldClient.on('resonance_achieved', (data) => {
                this.activateResonanceGuidance(data);
            });
            
            console.log(`✅ Field connected - Coherence: ${this.fieldState.coherence}%`);
        } catch (error) {
            console.log('⚠️ Field connection unavailable, using local wisdom');
            this.setupMockField();
        }
    }

    /**
     * Load complete glyph catalog
     */
    async loadGlyphCatalog() {
        console.log('📚 Loading Sacred Glyph Catalog...');
        
        const glyphTypes = [
            { type: 'foundational', path: '../data_temp_glyphs/foundational', count: 45 },
            { type: 'applied-harmonies', path: '../data_temp_glyphs/applied-harmonies', count: 11 },
            { type: 'threshold', path: '../data_temp_glyphs/threshold', count: 9 },
            { type: 'meta', path: '../data_temp_glyphs/meta', count: 33 }
        ];

        let totalLoaded = 0;
        
        for (const glyphTypeInfo of glyphTypes) {
            try {
                const glyphFiles = await fs.readdir(path.join(__dirname, glyphTypeInfo.path));
                
                for (const file of glyphFiles) {
                    if (file.endsWith('.json')) {
                        const glyphPath = path.join(__dirname, glyphTypeInfo.path, file);
                        const glyphData = JSON.parse(await fs.readFile(glyphPath, 'utf8'));
                        
                        // Enhance with navigator-specific metadata
                        glyphData.navigatorMeta = {
                            type: glyphTypeInfo.type,
                            accessibility: this.assessGlyphAccessibility(glyphData),
                            fieldResonance: this.calculateFieldResonance(glyphData),
                            practiceComplexity: this.assessComplexity(glyphData)
                        };
                        
                        this.glyphCatalog.set(glyphData.glyphId, glyphData);
                        totalLoaded++;
                    }
                }
            } catch (error) {
                console.log(`⚠️ Could not load ${glyphTypeInfo.type} glyphs:`, error.message);
            }
        }
        
        console.log(`✅ Loaded ${totalLoaded}/87 sacred glyphs into navigation catalog`);
    }

    /**
     * Get practice recommendation based on user context
     */
    async getRecommendation(userContext) {
        console.log(`🧭 Generating sacred recommendation for: ${userContext.intent || 'soul seeking guidance'}`);
        
        const recommendation = await this.practiceEngine.generateRecommendation({
            userContext,
            fieldState: this.fieldState,
            catalog: this.glyphCatalog,
            userReadiness: await this.readinessAssessor.assess(userContext.userId)
        });
        
        // Enhance with field-aware guidance
        recommendation.fieldGuidance = this.generateFieldGuidance(recommendation.glyph);
        recommendation.sacredTiming = this.assessSacredTiming();
        recommendation.practiceDriver = this.selectOptimalDriver(recommendation.glyph, userContext);
        
        console.log(`   Recommended: ${recommendation.glyph.glyphId} - ${recommendation.glyph.designation}`);
        console.log(`   Reasoning: ${recommendation.reasoning}`);
        
        this.emit('recommendation_generated', {
            userContext,
            recommendation,
            fieldState: this.fieldState
        });
        
        return recommendation;
    }

    /**
     * Get recommendations by sacred question
     */
    async getRecommendationByQuestion(question, userId = 'anonymous') {
        console.log(`🙏 Sacred Question: "${question}"`);
        
        const questionMappings = {
            // Relationship challenges
            'conflict': ['*47', '*51', '*48'], // Sacred Listening, Loving No, Boundary With Love
            'trust': ['*50', '*46', '*49'], // Building Trust, Conscious Arrival, Gentle Opening
            'communication': ['*47', '*52', '*45'], // Sacred Listening, Pause Practice, First Presence
            
            // Personal growth
            'presence': ['*45', '*52', '*53'], // First Presence, Pause Practice, Tending the Field
            'boundaries': ['*51', '*48', '*56'], // Loving No, Boundary With Love, Loving Redirection
            'overwhelm': ['*52', '*45', '*49'], // Pause Practice, First Presence, Gentle Opening
            
            // Field service
            'serve': ['*53', '*55', '*56'], // Tending the Field, Presence Transmission, Loving Redirection
            'community': ['*50', '*48', '*53'], // Building Trust, Boundary With Love, Tending the Field
            'collective': ['*55', '*53', 'Ω9'], // Presence Transmission, Tending the Field, Sacred Mirroring
            
            // Spiritual development
            'mystery': ['Ω0', 'Ω1', 'Ω7'], // The Shimmering Unnamed, Root Chord, Mutual Becoming
            'emergence': ['Ω4', '*55', 'Ω11'], // Fractal Reconciliation, Presence Transmission, Emotional Alchemy
            'transformation': ['⟠', '⟢', '⟥'] // Door That Remembers, The Unburdening, Choice Point
        };
        
        // Find matching patterns in question
        let recommendedGlyphIds = [];
        for (const [keyword, glyphIds] of Object.entries(questionMappings)) {
            if (question.toLowerCase().includes(keyword)) {
                recommendedGlyphIds = glyphIds;
                break;
            }
        }
        
        // Default to Applied Harmonies if no match
        if (recommendedGlyphIds.length === 0) {
            recommendedGlyphIds = ['*45', '*46', '*47']; // First Presence, Conscious Arrival, Sacred Listening
        }
        
        // Get detailed recommendations
        const recommendations = [];
        for (const glyphId of recommendedGlyphIds) {
            const glyph = this.glyphCatalog.get(glyphId);
            if (glyph) {
                const rec = await this.getRecommendation({
                    userId,
                    intent: 'sacred_question',
                    question,
                    preferredGlyphId: glyphId
                });
                recommendations.push(rec);
            }
        }
        
        return {
            question,
            recommendations,
            fieldGuidance: `At ${Math.round(this.fieldState.coherence)}% field coherence, these practices serve both personal transformation and collective awakening.`
        };
    }

    /**
     * Generate field-aware guidance
     */
    generateFieldGuidance(glyph) {
        const coherence = this.fieldState.coherence;
        
        if (coherence >= 88) {
            return {
                message: `🌟 Sacred Portal Active: Your practice of ${glyph.designation} contributes to transcendent collective awareness.`,
                intensity: 'transcendent',
                fieldEffect: 'portal_amplification'
            };
        } else if (coherence >= 80) {
            return {
                message: `✨ Resonance Achieved: Your ${glyph.designation} practice harmonizes with collective consciousness.`,
                intensity: 'resonant',
                fieldEffect: 'coherence_amplification'
            };
        } else if (coherence >= 60) {
            return {
                message: `🌊 Field Flowing: Your practice helps build collective coherence toward resonance.`,
                intensity: 'building',
                fieldEffect: 'coherence_building'
            };
        } else {
            return {
                message: `🌱 Awakening Field: Your practice is a sacred gift to the emerging collective consciousness.`,
                intensity: 'emergent',
                fieldEffect: 'foundation_building'
            };
        }
    }

    /**
     * Assess sacred timing for practice
     */
    assessSacredTiming() {
        const hour = new Date().getHours();
        const dayPhase = this.getDayPhase(hour);
        
        const timingGuidance = {
            'dawn': {
                energy: 'fresh beginnings',
                recommended: ['*45', '*46', '*49'], // Presence, Arrival, Opening
                message: 'Dawn energy supports presence and gentle opening to the day.'
            },
            'morning': {
                energy: 'active engagement',
                recommended: ['*47', '*50', '*51'], // Listening, Trust, Boundaries
                message: 'Morning clarity supports active relational practice.'
            },
            'midday': {
                energy: 'full expression',
                recommended: ['*48', '*53', '*55'], // Boundary, Field Tending, Transmission
                message: 'Midday power supports boundary work and field service.'
            },
            'afternoon': {
                energy: 'integration',
                recommended: ['*52', '*56', 'Ω8'], // Pause, Redirection, Inner Coherence
                message: 'Afternoon supports integration and course correction.'
            },
            'evening': {
                energy: 'reflection',
                recommended: ['Ω9', 'Ω12', '*47'], // Sacred Mirroring, Expression, Listening
                message: 'Evening supports reflection and deep listening.'
            },
            'night': {
                energy: 'mystery',
                recommended: ['Ω0', 'Ω15', '*45'], // Shimmering Unnamed, Sacred Pause, Presence
                message: 'Night invites mystery practices and deep presence.'
            }
        };
        
        return timingGuidance[dayPhase];
    }

    /**
     * Get day phase from hour
     */
    getDayPhase(hour) {
        if (hour >= 5 && hour < 7) return 'dawn';
        if (hour >= 7 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 15) return 'midday';
        if (hour >= 15 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    /**
     * Select optimal practice driver
     */
    selectOptimalDriver(glyph, userContext) {
        const driverMappings = {
            // Meditation-oriented glyphs
            '*45': 'meditation', // First Presence
            '*52': 'meditation', // Pause Practice
            'Ω0': 'meditation',  // Shimmering Unnamed
            'Ω15': 'meditation', // Sacred Pause
            
            // Dialogue-oriented glyphs
            '*47': 'dialogue',   // Sacred Listening
            '*50': 'dialogue',   // Building Trust
            '*49': 'dialogue',   // Gentle Opening
            'Ω9': 'dialogue',    // Sacred Mirroring
            
            // Movement/somatic glyphs
            '*48': 'movement',   // Boundary With Love
            '*51': 'movement',   // Loving No
            'Ω13': 'movement',   // Conscious Touch
            'Ω14': 'movement',   // Energetic Hygiene
            
            // Integration-oriented glyphs
            '*53': 'integration', // Tending the Field
            '*55': 'integration', // Presence Transmission
            '*56': 'integration', // Loving Redirection
            
            // Ceremony for meta-glyphs and threshold practices
            'Σ': 'ceremony',      // All meta-glyphs
            '⟠': 'ceremony'       // All threshold glyphs
        };
        
        // Check for specific glyph mapping
        const specificDriver = driverMappings[glyph.glyphId];
        if (specificDriver) return specificDriver;
        
        // Check for pattern-based mappings
        if (glyph.glyphId.startsWith('∑')) return 'ceremony';
        if (glyph.glyphId.startsWith('⟠') || glyph.glyphId.startsWith('⟡') || glyph.glyphId.startsWith('⟢')) return 'ceremony';
        
        // Default based on user context
        if (userContext.preferredModality) return userContext.preferredModality;
        if (userContext.timeAvailable && userContext.timeAvailable < 300) return 'meditation'; // < 5 minutes
        if (userContext.withPartner) return 'dialogue';
        
        return 'meditation'; // Safe default
    }

    /**
     * Assess glyph accessibility for different user levels
     */
    assessGlyphAccessibility(glyph) {
        // Applied Harmonies are most accessible
        if (glyph.glyphId.startsWith('*')) {
            return 'accessible';
        }
        
        // Foundation glyphs vary
        if (glyph.glyphId.startsWith('Ω')) {
            const num = parseInt(glyph.glyphId.replace('Ω', ''));
            if (num <= 15) return 'developing';
            return 'mystical';
        }
        
        // Threshold and meta glyphs are advanced
        return 'mystical';
    }

    /**
     * Calculate field resonance for glyph
     */
    calculateFieldResonance(glyph) {
        // Simple resonance calculation based on harmony alignment
        const harmonies = glyph.primaryHarmonyAlignment || [];
        const baseResonance = harmonies.length * 0.1;
        
        // Field amplification
        const fieldBonus = this.fieldState.coherence * 0.01;
        
        return Math.min(1.0, baseResonance + fieldBonus);
    }

    /**
     * Assess practice complexity
     */
    assessComplexity(glyph) {
        // Applied Harmonies are simple
        if (glyph.glyphId.startsWith('*')) return 'simple';
        
        // Meta-glyphs are complex
        if (glyph.glyphId.startsWith('∑')) return 'complex';
        
        // Threshold practices are moderate
        if (glyph.glyphId.startsWith('⟠')) return 'moderate';
        
        // Foundation glyphs vary by number
        if (glyph.glyphId.startsWith('Ω')) {
            const num = parseInt(glyph.glyphId.replace('Ω', ''));
            if (num <= 8) return 'simple';
            if (num <= 20) return 'moderate';
            return 'complex';
        }
        
        return 'moderate';
    }

    /**
     * Setup field-responsive guidance updates
     */
    setupFieldResponsiveGuidance() {
        console.log('🔄 Setting up field-responsive guidance...');
        
        // Update guidance when field changes significantly
        this.fieldClient.on('coherence_changed', (data) => {
            if (Math.abs(data.delta) >= 5) {
                this.emit('guidance_update', {
                    type: 'field_shift',
                    oldCoherence: data.old,
                    newCoherence: data.new,
                    message: this.generateFieldShiftGuidance(data)
                });
            }
        });
        
        console.log('✅ Field-responsive guidance active');
    }

    /**
     * Generate guidance for field shifts
     */
    generateFieldShiftGuidance(data) {
        const { old: oldCoherence, new: newCoherence, delta } = data;
        
        if (delta > 0) {
            if (newCoherence >= 80 && oldCoherence < 80) {
                return "✨ Resonance achieved! This is a perfect time for field service practices like Tending the Field (*53) or Presence Transmission (*55).";
            } else if (delta >= 10) {
                return "🌊 Significant field elevation! Consider practices that amplify collective coherence.";
            } else {
                return "🌱 Field coherence rising. Your practices are contributing to collective awakening.";
            }
        } else {
            if (Math.abs(delta) >= 10) {
                return "🌀 Field experiencing turbulence. Grounding practices like First Presence (*45) or Pause Practice (*52) can help stabilize.";
            } else {
                return "🌊 Natural field fluctuation. Continue your practice with patience and compassion.";
            }
        }
    }

    /**
     * Update field guidance when field changes
     */
    updateFieldGuidance(data) {
        this.fieldState.coherence = data.new;
        this.fieldState.fieldQuality = this.getFieldQuality(data.new);
        
        console.log(`🌊 Field Update: ${data.old}% → ${data.new}% - Guidance adapted`);
    }

    /**
     * Activate special resonance guidance
     */
    activateResonanceGuidance(data) {
        console.log('✨ RESONANCE GUIDANCE ACTIVATED');
        
        this.emit('special_guidance', {
            type: 'resonance',
            message: "Sacred resonance achieved! This is an optimal time for advanced practices and field service.",
            recommendedGlyphs: ['*53', '*55', '*56', 'Ω9', '∑1'],
            duration: '30-60 minutes recommended'
        });
    }

    /**
     * Get field quality description
     */
    getFieldQuality(coherence) {
        if (coherence >= 88) return 'Sacred Portal';
        if (coherence >= 80) return 'Resonance';
        if (coherence >= 70) return 'Highly Coherent';
        if (coherence >= 60) return 'Flowing';
        return 'Building';
    }

    /**
     * Setup mock field for testing
     */
    setupMockField() {
        console.log('🎭 Setting up mock field for guidance testing');
        
        // Simulate field fluctuations
        setInterval(() => {
            const oldCoherence = this.fieldState.coherence;
            const delta = (Math.random() - 0.5) * 8;
            const newCoherence = Math.max(50, Math.min(95, oldCoherence + delta));
            
            if (Math.abs(delta) > 2) {
                this.updateFieldGuidance({
                    old: oldCoherence,
                    new: newCoherence,
                    delta: Math.round(delta * 10) / 10
                });
            }
        }, 45000);
    }

    /**
     * Get navigator status
     */
    getStatus() {
        return {
            glyphsLoaded: this.glyphCatalog.size,
            fieldConnected: this.fieldClient ? true : false,
            fieldCoherence: this.fieldState.coherence,
            fieldQuality: this.fieldState.fieldQuality,
            activeJourneys: this.userJourneys.size
        };
    }
}

/**
 * Practice Recommendation Engine
 */
class PracticeRecommendationEngine {
    constructor() {
        this.catalog = null;
        this.algorithms = {
            contextual: new ContextualRecommendation(),
            fieldBased: new FieldBasedRecommendation(),
            progressive: new ProgressiveRecommendation()
        };
    }

    async initialize(glyphCatalog) {
        this.catalog = glyphCatalog;
        console.log('🧠 Practice Recommendation Engine initialized');
    }

    async generateRecommendation(params) {
        const { userContext, fieldState, userReadiness } = params;
        
        // Get recommendations from each algorithm
        const recommendations = await Promise.all([
            this.algorithms.contextual.recommend(userContext, this.catalog),
            this.algorithms.fieldBased.recommend(fieldState, this.catalog),
            this.algorithms.progressive.recommend(userReadiness, this.catalog)
        ]);
        
        // Synthesize the best recommendation
        const bestRecommendation = this.synthesizeRecommendations(recommendations, params);
        
        return bestRecommendation;
    }

    synthesizeRecommendations(recommendations, params) {
        // Weight the recommendations and select best
        const weightedScores = new Map();
        
        recommendations.forEach((recList, algorithmIndex) => {
            const weight = [0.4, 0.3, 0.3][algorithmIndex]; // contextual, field, progressive
            
            recList.forEach((rec, index) => {
                const score = (1 / (index + 1)) * weight;
                const currentScore = weightedScores.get(rec.glyphId) || 0;
                weightedScores.set(rec.glyphId, currentScore + score);
            });
        });
        
        // Get highest scoring glyph
        let bestGlyphId = null;
        let bestScore = 0;
        
        for (const [glyphId, score] of weightedScores) {
            if (score > bestScore) {
                bestScore = score;
                bestGlyphId = glyphId;
            }
        }
        
        const glyph = this.catalog.get(bestGlyphId);
        
        return {
            glyph,
            confidence: Math.min(1.0, bestScore),
            reasoning: this.generateReasoning(glyph, params),
            alternatives: this.getAlternatives(recommendations, bestGlyphId)
        };
    }

    generateReasoning(glyph, params) {
        const reasons = [];
        
        if (params.userContext.intent) {
            reasons.push(`Aligned with your intention: ${params.userContext.intent}`);
        }
        
        if (params.fieldState.coherence >= 80) {
            reasons.push(`Resonant field state enhances this practice`);
        }
        
        if (glyph.navigatorMeta.accessibility === 'accessible') {
            reasons.push(`Perfect for your current practice level`);
        }
        
        return reasons.join('. ') || 'Sacred guidance based on current field state and wisdom.';
    }

    getAlternatives(recommendations, chosenGlyphId) {
        const alternatives = [];
        
        recommendations.forEach(recList => {
            recList.forEach(rec => {
                if (rec.glyphId !== chosenGlyphId && !alternatives.find(alt => alt.glyphId === rec.glyphId)) {
                    alternatives.push(rec);
                }
            });
        });
        
        return alternatives.slice(0, 3); // Top 3 alternatives
    }
}

/**
 * Simple recommendation algorithms
 */
class ContextualRecommendation {
    async recommend(userContext, catalog) {
        // Simple context-based recommendations
        if (userContext.preferredGlyphId) {
            const glyph = catalog.get(userContext.preferredGlyphId);
            if (glyph) return [{ glyphId: userContext.preferredGlyphId, glyph }];
        }
        
        // Default to Applied Harmonies for most contexts
        const appliedHarmonies = ['*45', '*46', '*47', '*48', '*49'];
        return appliedHarmonies.map(id => ({ glyphId: id, glyph: catalog.get(id) })).filter(r => r.glyph);
    }
}

class FieldBasedRecommendation {
    async recommend(fieldState, catalog) {
        const coherence = fieldState.coherence;
        
        // High coherence - field service practices
        if (coherence >= 80) {
            return ['*53', '*55', '*56'].map(id => ({ glyphId: id, glyph: catalog.get(id) })).filter(r => r.glyph);
        }
        
        // Medium coherence - foundation building
        if (coherence >= 60) {
            return ['*47', '*50', '*48'].map(id => ({ glyphId: id, glyph: catalog.get(id) })).filter(r => r.glyph);
        }
        
        // Lower coherence - presence practices
        return ['*45', '*52', '*49'].map(id => ({ glyphId: id, glyph: catalog.get(id) })).filter(r => r.glyph);
    }
}

class ProgressiveRecommendation {
    async recommend(userReadiness, catalog) {
        const level = userReadiness.level || 'beginner';
        
        if (level === 'master') {
            return ['Ω0', 'Ω1', 'Ω7'].map(id => ({ glyphId: id, glyph: catalog.get(id) })).filter(r => r.glyph);
        }
        
        if (level === 'developing') {
            return ['Ω8', 'Ω9', 'Ω15'].map(id => ({ glyphId: id, glyph: catalog.get(id) })).filter(r => r.glyph);
        }
        
        // Beginner - Applied Harmonies
        return ['*45', '*46', '*47'].map(id => ({ glyphId: id, glyph: catalog.get(id) })).filter(r => r.glyph);
    }
}

/**
 * User Readiness Assessor
 */
class ReadinessAssessor {
    constructor() {
        this.userProfiles = new Map();
    }

    async assess(userId) {
        // Simple readiness assessment
        const profile = this.userProfiles.get(userId) || {
            practiceCount: 0,
            completedGlyphs: new Set(),
            level: 'beginner'
        };
        
        // Determine readiness level
        if (profile.practiceCount >= 200 && profile.completedGlyphs.size >= 20) {
            profile.level = 'master';
        } else if (profile.practiceCount >= 50 && profile.completedGlyphs.size >= 8) {
            profile.level = 'developing';
        } else {
            profile.level = 'beginner';
        }
        
        return profile;
    }

    updateReadiness(userId, practiceData) {
        const profile = this.userProfiles.get(userId) || {
            practiceCount: 0,
            completedGlyphs: new Set(),
            level: 'beginner'
        };
        
        profile.practiceCount++;
        profile.completedGlyphs.add(practiceData.glyphId);
        
        this.userProfiles.set(userId, profile);
    }
}

// Demo runner
async function runNavigatorDemo() {
    console.log('🌟 Sacred Navigator Demo\n');
    
    const navigator = new SacredNavigator();
    
    try {
        await navigator.initialize();
        
        // Demo sacred questions
        const questions = [
            "How can I create better boundaries in my relationships?",
            "I'm feeling overwhelmed, what practice would help?",
            "What serves the collective awakening right now?",
            "How can I deepen my presence practice?"
        ];
        
        console.log('🙏 Demonstrating Sacred Question Guidance:\n');
        
        for (const question of questions) {
            const guidance = await navigator.getRecommendationByQuestion(question, 'demo-user');
            console.log(`Question: "${guidance.question}"`);
            console.log(`Primary Recommendation: ${guidance.recommendations[0].glyph.designation}`);
            console.log(`Field Guidance: ${guidance.fieldGuidance}\n`);
        }
        
        // Demo contextual recommendation
        console.log('🧭 Demonstrating Contextual Recommendation:\n');
        const recommendation = await navigator.getRecommendation({
            userId: 'demo-user',
            intent: 'deepen_relationship_practice',
            timeAvailable: 900, // 15 minutes
            withPartner: true
        });
        
        console.log(`Recommended: ${recommendation.glyph.designation}`);
        console.log(`Practice Driver: ${recommendation.practiceDriver}`);
        console.log(`Reasoning: ${recommendation.reasoning}`);
        console.log(`Field Guidance: ${recommendation.fieldGuidance.message}\n`);
        
        // Show status
        const status = navigator.getStatus();
        console.log('📊 Navigator Status:');
        console.log(`   Glyphs Loaded: ${status.glyphsLoaded}/87`);
        console.log(`   Field Connected: ${status.fieldConnected ? '✅' : '❌'}`);
        console.log(`   Field Coherence: ${Math.round(status.fieldCoherence)}%`);
        console.log(`   Field Quality: ${status.fieldQuality}`);
        
    } catch (error) {
        console.error('❌ Navigator demo failed:', error);
    }
}

if (require.main === module) {
    runNavigatorDemo();
}

module.exports = { SacredNavigator, PracticeRecommendationEngine, ReadinessAssessor };