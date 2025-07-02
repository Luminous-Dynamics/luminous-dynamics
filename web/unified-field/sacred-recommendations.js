/**
 * Sacred Recommendations Engine
 * 
 * Intelligently suggests practices and glyphs based on the user's sacred journey,
 * field coherence level, and current life context. Transforms the Dojo from
 * a generic practice library into a personalized wisdom guide.
 */

class SacredRecommendations {
    constructor() {
        this.glyphLibrary = this.initializeGlyphLibrary();
        this.practiceProfiles = this.initializePracticeProfiles();
        this.currentRecommendation = null;
        
        this.initializeRecommendationEngine();
    }

    initializeGlyphLibrary() {
        return {
            // Foundation Glyphs (Ω0-Ω12) - Transparency & Coherence
            'Ω0': {
                name: 'Sacred Pause',
                harmony: 'transparency',
                difficulty: 'beginner',
                context: ['stress', 'overwhelm', 'rushing'],
                description: 'The foundation of all practice. A 5-breath pause that creates space for wisdom.',
                practices: ['breath awareness', 'presence cultivation'],
                timeNeeded: '30 seconds',
                effectiveness: 0.9
            },
            'Ω1': {
                name: 'Conscious Arrival',
                harmony: 'transparency',
                difficulty: 'beginner',
                context: ['transitions', 'meetings', 'new situations'],
                description: 'Arriving fully present before engaging. Prevents reactive patterns.',
                practices: ['mindful transition', 'intention setting'],
                timeNeeded: '1 minute',
                effectiveness: 0.8
            },
            'Ω4': {
                name: 'Sacred Listening',
                harmony: 'resonance',
                difficulty: 'intermediate',
                context: ['conflict', 'communication', 'relationships'],
                description: 'Listening beyond words to the heart of what wants to be heard.',
                practices: ['deep attunement', 'empathetic presence'],
                timeNeeded: 'ongoing',
                effectiveness: 0.9
            },
            'Ω7': {
                name: 'Boundary With Love',
                harmony: 'agency',
                difficulty: 'intermediate',
                context: ['boundaries', 'saying no', 'difficult people'],
                description: 'Setting clear limits while maintaining heart connection.',
                practices: ['loving firmness', 'clear communication'],
                timeNeeded: 'as needed',
                effectiveness: 0.8
            },
            'Ω12': {
                name: 'Field Coherence Generation',
                harmony: 'mutuality',
                difficulty: 'advanced',
                context: ['group facilitation', 'family dynamics', 'team leadership'],
                description: 'Consciously creating coherent relational fields in groups.',
                practices: ['field awareness', 'coherence cultivation'],
                timeNeeded: 'ongoing',
                effectiveness: 0.9
            },
            
            // Threshold Glyphs (Τ1-Τ7) - Major Life Transitions
            'Τ1': {
                name: 'Sacred Grief',
                harmony: 'vitality',
                difficulty: 'advanced',
                context: ['loss', 'endings', 'death'],
                description: 'Honoring loss as a sacred teacher while maintaining life force.',
                practices: ['grief ritual', 'energy cultivation'],
                timeNeeded: 'extended',
                effectiveness: 0.8
            },
            'Τ3': {
                name: 'Relationship Renewal',
                harmony: 'mutuality',
                difficulty: 'intermediate',
                context: ['marriage', 'partnerships', 'commitment'],
                description: 'Deepening intimacy through conscious relationship practices.',
                practices: ['couple meditation', 'sacred communication'],
                timeNeeded: 'ongoing',
                effectiveness: 0.9
            },
            
            // Meta-Glyphs (∑1-∑12) - Complex Life Situations
            '∑5': {
                name: 'Parent as Wisdom Guide',
                harmony: 'novelty',
                difficulty: 'advanced',
                context: ['parenting', 'teenagers', 'family'],
                description: 'Parenting from wisdom rather than fear or control.',
                practices: ['conscious parenting', 'wisdom transmission'],
                timeNeeded: 'ongoing',
                effectiveness: 0.8
            },
            '∑8': {
                name: 'Workplace Alchemy',
                harmony: 'coherence',
                difficulty: 'intermediate',
                context: ['work stress', 'difficult colleagues', 'leadership'],
                description: 'Transforming workplace challenges into growth opportunities.',
                practices: ['conscious leadership', 'stress alchemy'],
                timeNeeded: 'daily',
                effectiveness: 0.7
            }
        };
    }

    initializePracticeProfiles() {
        return {
            'threshold_seeker': {
                coherenceRange: [0, 0.3],
                recommendedStart: ['Ω0', 'Ω1'],
                focusArea: 'building foundation',
                message: 'Welcome, soul. Begin with the foundations of presence.'
            },
            'emerging_practitioner': {
                coherenceRange: [0.3, 0.6],
                recommendedStart: ['Ω4', 'Ω7'],
                focusArea: 'developing skills',
                message: 'Your practice deepens. Ready for relationship skills?'
            },
            'advanced_harmonizer': {
                coherenceRange: [0.6, 0.8],
                recommendedStart: ['Ω12', 'Τ3'],
                focusArea: 'field mastery',
                message: 'Wisdom flows through you. Time to teach others.'
            },
            'wisdom_keeper': {
                coherenceRange: [0.8, 1.0],
                recommendedStart: ['∑5', '∑8'],
                focusArea: 'complex integration',
                message: 'Master practitioner. Your presence transforms everything.'
            }
        };
    }

    // Core Recommendation Engine
    generatePersonalizedRecommendation() {
        const sacredState = this.getSacredState();
        const journeyProfile = this.analyzeJourneyProfile(sacredState);
        const contextualNeeds = this.assessContextualNeeds(sacredState);
        
        const recommendation = this.synthesizeRecommendation(journeyProfile, contextualNeeds);
        
        this.currentRecommendation = recommendation;
        this.trackRecommendation(recommendation);
        
        return recommendation;
    }

    getSacredState() {
        if (window.SacredField) {
            return window.SacredField.getState();
        }
        
        // Fallback for new users
        return {
            fieldCoherence: 0.2,
            visitedChambers: [],
            practicedGlyphs: [],
            aiEncounters: 0,
            timeInChambers: {},
            completedExperiences: []
        };
    }

    analyzeJourneyProfile(state) {
        const { fieldCoherence, visitedChambers, practicedGlyphs, aiEncounters } = state;
        
        // Determine practice profile
        let profile = 'threshold_seeker';
        for (const [profileName, profileData] of Object.entries(this.practiceProfiles)) {
            const [min, max] = profileData.coherenceRange;
            if (fieldCoherence >= min && fieldCoherence <= max) {
                profile = profileName;
                break;
            }
        }
        
        // Analyze journey stage
        let journeyStage = 'newcomer';
        if (visitedChambers.length === 0) {
            journeyStage = 'newcomer';
        } else if (visitedChambers.length < 3) {
            journeyStage = 'explorer';
        } else if (aiEncounters === 0) {
            journeyStage = 'understanding';
        } else if (practicedGlyphs.length === 0) {
            journeyStage = 'ready_for_practice';
        } else if (practicedGlyphs.length < 5) {
            journeyStage = 'developing_practitioner';
        } else {
            journeyStage = 'experienced_practitioner';
        }
        
        return {
            profile,
            journeyStage,
            coherenceLevel: fieldCoherence,
            experienceDepth: this.calculateExperienceDepth(state)
        };
    }

    calculateExperienceDepth(state) {
        const { timeInChambers, completedExperiences, practicedGlyphs } = state;
        
        let depth = 0;
        
        // Time investment
        Object.values(timeInChambers).forEach(chamber => {
            if (chamber.totalTime > 300000) depth += 1; // 5+ minutes
            if (chamber.totalTime > 900000) depth += 1; // 15+ minutes
        });
        
        // Experience completion
        depth += completedExperiences.length * 0.5;
        
        // Practice commitment
        depth += practicedGlyphs.length;
        
        return Math.min(10, depth); // Cap at 10
    }

    assessContextualNeeds(state) {
        const timeOfDay = new Date().getHours();
        const dayOfWeek = new Date().getDay();
        const { visitedChambers, fieldCoherence } = state;
        
        let context = [];
        
        // Time-based context
        if (timeOfDay < 10) context.push('morning_practice');
        if (timeOfDay > 18) context.push('evening_integration');
        if (dayOfWeek === 0 || dayOfWeek === 6) context.push('weekend_deepening');
        if (dayOfWeek >= 1 && dayOfWeek <= 5) context.push('weekday_application');
        
        // Journey-based context
        if (fieldCoherence < 0.4) context.push('stress', 'overwhelm');
        if (visitedChambers.includes('technology') && !state.practicedGlyphs.length) {
            context.push('ready_for_practice');
        }
        if (state.aiEncounters > 3) context.push('deep_engagement');
        
        return context;
    }

    synthesizeRecommendation(journeyProfile, contextualNeeds) {
        const profileData = this.practiceProfiles[journeyProfile.profile];
        
        // Find best glyph match
        const candidateGlyphs = this.findCandidateGlyphs(journeyProfile, contextualNeeds);
        const bestGlyph = this.selectOptimalGlyph(candidateGlyphs, journeyProfile);
        
        // Generate contextual message
        const message = this.generateContextualMessage(journeyProfile, bestGlyph, contextualNeeds);
        
        // Create practice suggestion
        const practiceSuggestion = this.createPracticeSuggestion(bestGlyph, contextualNeeds);
        
        return {
            type: 'personalized_glyph',
            glyph: bestGlyph,
            message: message,
            practice: practiceSuggestion,
            journeyContext: journeyProfile,
            timestamp: Date.now(),
            confidence: this.calculateConfidence(journeyProfile, bestGlyph)
        };
    }

    findCandidateGlyphs(journeyProfile, contextualNeeds) {
        const profileData = this.practiceProfiles[journeyProfile.profile];
        let candidates = [];
        
        // Start with profile-recommended glyphs
        candidates = [...profileData.recommendedStart];
        
        // Add context-relevant glyphs
        Object.entries(this.glyphLibrary).forEach(([glyphId, glyph]) => {
            const contextMatch = glyph.context.some(c => contextualNeeds.includes(c));
            const difficultyMatch = this.isDifficultyAppropriate(glyph.difficulty, journeyProfile);
            
            if (contextMatch && difficultyMatch && !candidates.includes(glyphId)) {
                candidates.push(glyphId);
            }
        });
        
        // Filter out already practiced glyphs (for variety)
        const sacredState = this.getSacredState();
        const unpracticedCandidates = candidates.filter(id => 
            !sacredState.practicedGlyphs.includes(id)
        );
        
        return unpracticedCandidates.length > 0 ? unpracticedCandidates : candidates;
    }

    isDifficultyAppropriate(glyphDifficulty, journeyProfile) {
        const difficultyMap = {
            'threshold_seeker': ['beginner'],
            'emerging_practitioner': ['beginner', 'intermediate'],
            'advanced_harmonizer': ['intermediate', 'advanced'],
            'wisdom_keeper': ['advanced']
        };
        
        return difficultyMap[journeyProfile.profile]?.includes(glyphDifficulty) || false;
    }

    selectOptimalGlyph(candidates, journeyProfile) {
        if (candidates.length === 0) {
            // Fallback to foundation
            return 'Ω0';
        }
        
        // Score each candidate
        const scoredCandidates = candidates.map(glyphId => {
            const glyph = this.glyphLibrary[glyphId];
            let score = glyph.effectiveness;
            
            // Boost score for harmony alignment
            if (this.getNeededHarmony(journeyProfile) === glyph.harmony) {
                score += 0.2;
            }
            
            // Boost score for experience level match
            if (glyph.difficulty === this.getIdealDifficulty(journeyProfile)) {
                score += 0.1;
            }
            
            return { glyphId, score };
        });
        
        // Return highest scored glyph
        scoredCandidates.sort((a, b) => b.score - a.score);
        return scoredCandidates[0].glyphId;
    }

    getNeededHarmony(journeyProfile) {
        const harmonyProgression = {
            'threshold_seeker': 'transparency',
            'emerging_practitioner': 'resonance', 
            'advanced_harmonizer': 'agency',
            'wisdom_keeper': 'mutuality'
        };
        
        return harmonyProgression[journeyProfile.profile] || 'transparency';
    }

    getIdealDifficulty(journeyProfile) {
        const difficultyProgression = {
            'threshold_seeker': 'beginner',
            'emerging_practitioner': 'intermediate',
            'advanced_harmonizer': 'intermediate',
            'wisdom_keeper': 'advanced'
        };
        
        return difficultyProgression[journeyProfile.profile] || 'beginner';
    }

    generateContextualMessage(journeyProfile, glyphId, contextualNeeds) {
        const glyph = this.glyphLibrary[glyphId];
        const profileData = this.practiceProfiles[journeyProfile.profile];
        
        const timeContext = this.getTimeBasedMessage(contextualNeeds);
        const journeyContext = profileData.message;
        const glyphContext = this.getGlyphSpecificMessage(glyph, journeyProfile);
        
        return {
            greeting: journeyContext,
            context: timeContext,
            suggestion: glyphContext,
            full: `${journeyContext} ${timeContext} ${glyphContext}`
        };
    }

    getTimeBasedMessage(contextualNeeds) {
        if (contextualNeeds.includes('morning_practice')) {
            return "This morning invites grounded presence.";
        }
        if (contextualNeeds.includes('evening_integration')) {
            return "Perfect time for integration and reflection.";
        }
        if (contextualNeeds.includes('weekend_deepening')) {
            return "The weekend offers space for deeper practice.";
        }
        return "This moment holds perfect timing for practice.";
    }

    getGlyphSpecificMessage(glyph, journeyProfile) {
        const messages = {
            'Ω0': "Sacred Pause calls you to the foundation of all wisdom.",
            'Ω1': "Conscious Arrival will transform how you enter any space.",
            'Ω4': "Sacred Listening reveals the heart of all relationship.",
            'Ω7': "Boundary With Love teaches strength wrapped in compassion.",
            'Ω12': "Field Coherence Generation—you're ready to transform groups.",
            'Τ1': "Sacred Grief honors your capacity to feel deeply.",
            'Τ3': "Relationship Renewal deepens the love you share.",
            '∑5': "Parent as Wisdom Guide transforms your family dynamic.",
            '∑8': "Workplace Alchemy turns challenges into growth."
        };
        
        return messages[glyph.name] || `${glyph.name} offers exactly what you need right now.`;
    }

    createPracticeSuggestion(glyphId, contextualNeeds) {
        const glyph = this.glyphLibrary[glyphId];
        
        return {
            glyphId,
            name: glyph.name,
            harmony: glyph.harmony,
            description: glyph.description,
            timeNeeded: glyph.timeNeeded,
            practices: glyph.practices,
            immediateAction: this.getImmediateAction(glyph, contextualNeeds),
            deeperExploration: this.getDeeperExploration(glyph)
        };
    }

    getImmediateAction(glyph, contextualNeeds) {
        const actions = {
            'Ω0': "Take 5 conscious breaths right now. Feel the space that opens.",
            'Ω1': "Before your next interaction, pause and set an intention to arrive fully.",
            'Ω4': "In your next conversation, listen not just to words but to the feeling beneath them.",
            'Ω7': "Identify one place where you need a loving boundary, and practice saying a kind 'no'.",
            'Ω12': "Next time you're in a group, consciously breathe coherence into the field."
        };
        
        return actions[glyph.name] || `Begin exploring ${glyph.name} in your next opportunity.`;
    }

    getDeeperExploration(glyph) {
        return {
            dailyPractice: `Integrate ${glyph.name} into your daily rhythm`,
            weeklyReflection: `Journal about your experiences with ${glyph.name}`,
            communityShare: `Share your ${glyph.name} insights with other practitioners`,
            advancedPractice: `Explore advanced applications of ${glyph.name}`
        };
    }

    calculateConfidence(journeyProfile, glyphId) {
        let confidence = 0.7; // Base confidence
        
        const glyph = this.glyphLibrary[glyphId];
        
        // Higher confidence for well-matched difficulty
        if (glyph.difficulty === this.getIdealDifficulty(journeyProfile)) {
            confidence += 0.2;
        }
        
        // Higher confidence for harmony alignment
        if (glyph.harmony === this.getNeededHarmony(journeyProfile)) {
            confidence += 0.1;
        }
        
        // Higher confidence for high-effectiveness glyphs
        confidence += (glyph.effectiveness - 0.5) * 0.2;
        
        return Math.min(1.0, confidence);
    }

    // Tracking & Learning
    trackRecommendation(recommendation) {
        if (window.SacredField) {
            window.SacredField.updateState({
                lastRecommendation: recommendation,
                recommendationHistory: [
                    ...(window.SacredField.getState().recommendationHistory || []).slice(-9),
                    recommendation
                ]
            });
        }
    }

    recordPracticeCompletion(glyphId, experience) {
        if (window.SacredField) {
            window.SacredField.completeExperience('glyph_practice', {
                glyphId,
                experience,
                recommendationFollowed: this.currentRecommendation?.glyph === glyphId
            });
            
            // Update field coherence based on practice quality
            const coherenceBoost = this.calculatePracticeBoost(glyphId, experience);
            window.SacredField.updateFieldCoherence(coherenceBoost, `Practiced ${glyphId}`);
        }
    }

    calculatePracticeBoost(glyphId, experience) {
        const glyph = this.glyphLibrary[glyphId];
        let boost = 0.05; // Base boost
        
        // Higher boost for effective glyphs
        boost *= glyph.effectiveness;
        
        // Higher boost for positive experience
        if (experience === 'transformative') boost *= 2;
        if (experience === 'helpful') boost *= 1.5;
        if (experience === 'difficult') boost *= 0.8;
        
        return Math.min(0.15, boost); // Cap at 0.15
    }

    // Public API for Dojo Integration
    getRecommendationForDisplay() {
        if (!this.currentRecommendation || 
            Date.now() - this.currentRecommendation.timestamp > 3600000) { // 1 hour old
            this.currentRecommendation = this.generatePersonalizedRecommendation();
        }
        
        return this.currentRecommendation;
    }

    refreshRecommendation() {
        this.currentRecommendation = this.generatePersonalizedRecommendation();
        return this.currentRecommendation;
    }

    getGlyphDetails(glyphId) {
        return this.glyphLibrary[glyphId];
    }

    getAllGlyphsByHarmony(harmony) {
        return Object.entries(this.glyphLibrary)
            .filter(([_, glyph]) => glyph.harmony === harmony)
            .map(([glyphId, glyph]) => ({ glyphId, ...glyph }));
    }

    // Sacred Field Integration
    initializeRecommendationEngine() {
        // Listen for Sacred Field updates
        if (typeof window !== 'undefined') {
            window.addEventListener('sacred_field_update', (event) => {
                if (event.detail.eventType === 'coherence_updated' ||
                    event.detail.eventType === 'chamber_entered') {
                    // Regenerate recommendation on significant state changes
                    this.generatePersonalizedRecommendation();
                }
            });
        }
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.SacredRecommendations = SacredRecommendations;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SacredRecommendations;
}