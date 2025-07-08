/**
 * Living Glyphs 2.0 - Sacred Data Schema
 * 
 * The evolved architecture for our 87 Sacred Practice Glyphs,
 * transforming them from static content into a living, breathing
 * constellation of wisdom that teaches itself.
 */

class LivingGlyphsSchema {
    constructor() {
        this.glyphConstellation = this.initializeConstellation();
        this.harmonyNetwork = this.initializeHarmonyNetwork();
        this.practicePathways = this.initializePracticePathways();
        this.shadowAntidotePairs = this.initializeShadowAntidotes();
    }

    // Enhanced Glyph Data Structure
    createLivingGlyph(glyphData) {
        return {
            // Core Identity
            id: glyphData.id,                    // e.g., "Ω0", "Τ3", "∑12"
            name: glyphData.name,                // e.g., "First Presence"
            fullName: glyphData.fullName,       // e.g., "Ω0: First Presence"
            type: glyphData.type,               // "foundation", "threshold", "meta"
            
            // Sacred Hierarchy
            harmony: glyphData.harmony,          // Primary Seven Harmony
            secondaryHarmonies: glyphData.secondaryHarmonies || [], // Supporting harmonies
            difficulty: glyphData.difficulty,    // "beginner", "intermediate", "advanced", "master"
            mastery_level: glyphData.masteryLevel, // 1-10 scale
            
            // The Four Quadrants
            quadrants: {
                why: {
                    philosophicalRoot: glyphData.philosophicalRoot,
                    coreQuestion: glyphData.coreQuestion,
                    harmonyConnection: glyphData.harmonyConnection,
                    shadowTransformed: glyphData.shadowTransformed
                },
                
                how: {
                    practiceInstructions: glyphData.practiceInstructions,
                    interactiveComponent: {
                        type: glyphData.interactiveType, // "breathing_guide", "journal_prompt", "assessment_slider", "visualization", "timer"
                        config: glyphData.interactiveConfig,
                        duration: glyphData.practiceDecatur
                    },
                    variations: glyphData.practiceVariations || [],
                    contraindications: glyphData.contraindications || []
                },
                
                'universal-interconnectedness': {
                    relatedGlyphs: glyphData.relatedGlyphs || [],
                    prerequisiteGlyphs: glyphData.prerequisites || [],
                    complementaryGlyphs: glyphData.complementary || [],
                    advancementGlyphs: glyphData.advancement || [],
                    antidoteToShadowOf: glyphData.antidoteToShadowOf || [],
                    constellationPosition: glyphData.constellationPosition
                },
                
                we: {
                    practitionerFieldNotes: glyphData.fieldNotes || [],
                    communityInsights: glyphData.communityInsights || [],
                    teachingStories: glyphData.teachingStories || [],
                    commonChallenges: glyphData.commonChallenges || []
                }
            },
            
            // Living Context
            contexts: glyphData.contexts || [],     // Life situations where applicable
            timeOfDay: glyphData.timeOfDay || [],   // "morning", "afternoon", "evening", "anytime"
            lifePhases: glyphData.lifePhases || [], // "parenting", "career", "relationship", "loss"
            emotions: glyphData.emotions || [],     // Emotional states it addresses
            
            // Evolutionary Data
            practiceCount: 0,                       // How many times practiced
            effectiveness: 0,                       // User-reported effectiveness
            lastPracticed: null,                    // Timestamp
            personalNotes: [],                      // User's private practice notes
            
            // Visual & Interactive
            visual: {
                sigil: glyphData.sigil,            // SVG or image path
                primaryColor: glyphData.primaryColor,
                accentColor: glyphData.accentColor,
                animation: glyphData.animation || "gentle_pulse"
            },
            
            // Metadata
            created: glyphData.created || Date.now(),
            lastUpdated: glyphData.lastUpdated || Date.now(),
            version: "2.0",
            canonicity: glyphData.canonicity || "core" // "core", "advanced", "community", "experimental"
        };
    }

    // Sample Foundation Glyphs with Full 2.0 Schema
    initializeConstellation() {
        return {
            "Ω0": this.createLivingGlyph({
                id: "Ω0",
                name: "First Presence",
                fullName: "Ω0: First Presence",
                type: "foundation",
                harmony: "integral-wisdom-cultivation",
                secondaryHarmonies: ["resonant-coherence"],
                difficulty: "beginner",
                masteryLevel: 2,
                
                philosophicalRoot: "The foundation of all conscious relationship is the capacity to arrive fully present before engaging. This practice transforms reactive patterns into responsive wisdom.",
                
                coreQuestion: "Can I meet this moment without needing it to be different?",
                
                harmonyConnection: "First Presence is the gateway to Integral Wisdom Cultivation—the alignment of inner experience with outer expression. When we arrive present, we become authentic.",
                
                shadowTransformed: "Reactivity, rushing, spiritual bypassing, presence anxiety",
                
                practiceInstructions: [
                    "Pause whatever you are doing",
                    "Take three conscious breaths, feeling your feet on the ground",
                    "Notice what is true in your body right now without changing it",
                    "Set an intention to meet the next moment with presence",
                    "Proceed with this quality of arrival"
                ],
                
                interactiveType: "breathing_guide",
                interactiveConfig: {
                    breathCycles: 3,
                    inhaleCount: 4,
                    holdCount: 2,
                    exhaleCount: 6,
                    guidance: "Breathe with the rhythm of sacred arrival"
                },
                practiceDecatur: "30 seconds to 2 minutes",
                
                practiceVariations: [
                    "Micro-Presence: Single conscious breath before any transition",
                    "Relational Arrival: Practice before entering any interaction",
                    "Environmental Presence: Include awareness of physical space"
                ],
                
                relatedGlyphs: ["Ω1", "Ω4", "Ω7"],
                complementaryGlyphs: ["Ω8", "Ω12"],
                advancement: ["Ω15", "Τ1"],
                
                fieldNotes: [
                    "A practitioner noted: 'I realized First Presence wasn't about clearing my mind, but about making space for the mess.'",
                    "From the community: 'This practice saved my marriage. I stopped arriving at conversations already defending.'",
                    "Wisdom from practice: 'The magic isn't in the perfection of presence, but in the return to it.'"
                ],
                
                contexts: ["meetings", "difficult conversations", "transitions", "stress", "conflict"],
                timeOfDay: ["anytime"],
                lifePhases: ["all"],
                emotions: ["anxiety", "overwhelm", "anger", "confusion"],
                
                sigil: "/glyphs/sigils/omega-0.svg",
                primaryColor: "#A8B5A6",
                accentColor: "#E8E6E1"
            }),
            
            "Ω4": this.createLivingGlyph({
                id: "Ω4",
                name: "Sacred Listening",
                fullName: "Ω4: Sacred Listening",
                type: "foundation",
                harmony: "universal-interconnectedness",
                secondaryHarmonies: ["integral-wisdom-cultivation", "sacred-reciprocity"],
                difficulty: "intermediate",
                masteryLevel: 4,
                
                philosophicalRoot: "True listening is not waiting for your turn to speak. It is creating a field of such spacious attention that the speaker can discover their own truth in the mirror of your presence.",
                
                coreQuestion: "Can I listen to the heart beneath the words?",
                
                harmonyConnection: "Sacred Listening embodies Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance—the capacity for deep attunement and empathetic presence. It creates the relational field where mutual understanding becomes possible.",
                
                shadowTransformed: "Debate mind, advice-giving addiction, performative listening, empathy overwhelm",
                
                practiceInstructions: [
                    "Begin with Ω0 (First Presence) to arrive fully",
                    "Place attention on your heart center while the other speaks",
                    "Listen for the feeling beneath their words, not just content",
                    "Resist the urge to formulate responses while they speak",
                    "Reflect back what you heard their heart saying"
                ],
                
                interactiveType: "listening_assessment",
                interactiveConfig: {
                    selfAssessment: [
                        "Rate your tendency to interrupt (1-10)",
                        "Rate your urge to give advice (1-10)",
                        "Rate your capacity to feel what they're feeling (1-10)"
                    ],
                    guidance: "Honest self-assessment creates the foundation for skill development"
                },
                practiceDecatur: "Ongoing in conversation",
                
                prerequisites: ["Ω0"],
                relatedGlyphs: ["Ω7", "Ω12", "Ω15"],
                complementaryGlyphs: ["Ω3", "Ω9"],
                advancement: ["∑3", "∑8"],
                antidoteToShadowOf: ["debate_mind", "advice_addiction"],
                
                fieldNotes: [
                    "A father shared: 'When I stopped trying to fix my teenager's problems and just listened to his heart, he started coming to me with the real stuff.'",
                    "From a therapist: 'This practice transformed my clinical work. I listen for the wisdom trying to emerge through their words.'",
                    "Community insight: 'Sacred listening is how we love people back to themselves.'"
                ],
                
                contexts: ["conflict", "parenting", "partnerships", "leadership", "therapy", "friendship"],
                timeOfDay: ["anytime"],
                lifePhases: ["parenting", "partnering", "leadership", "healing"],
                emotions: ["frustration", "disconnection", "misunderstanding"],
                
                sigil: "/glyphs/sigils/omega-4.svg",
                primaryColor: "#B3C5D7",
                accentColor: "#D4E6F1"
            }),

            "Ω7": this.createLivingGlyph({
                id: "Ω7",
                name: "Boundary With Love",
                fullName: "Ω7: Boundary With Love",
                type: "foundation",
                harmony: "evolutionary-progression",
                secondaryHarmonies: ["integral-wisdom-cultivation", "pan-sentient-flourishing"],
                difficulty: "intermediate",
                masteryLevel: 5,
                
                philosophicalRoot: "Sacred boundaries are not walls that separate, but membranes that allow love to flow while maintaining the integrity of both beings. They are how we love ourselves and others simultaneously.",
                
                coreQuestion: "How can I say 'no' to this while saying 'yes' to love?",
                
                harmonyConnection: "Boundary With Love embodies Evolutionary Progression & Purposeful Unfolding—the harmony of conscious choice and authentic empowerment. It teaches that true power serves connection rather than dominance.",
                
                shadowTransformed: "People-pleasing, boundary collapse, aggressive boundaries, victim consciousness",
                
                practiceInstructions: [
                    "Feel into your body's yes and no before speaking",
                    "Begin with empathy: 'I understand this matters to you...'",
                    "State your boundary clearly and kindly: 'And I'm not available for...'",
                    "Offer what you ARE available for: 'What I can offer is...'",
                    "Hold space for their response without defending or explaining"
                ],
                
                interactiveType: "boundary_practice",
                interactiveConfig: {
                    scenarios: [
                        "A family member wants to discuss politics when you're exhausted",
                        "A friend consistently cancels plans last minute",
                        "Your boss asks you to work over the weekend again"
                    ],
                    practiceFramework: "Choose a scenario and craft your loving boundary response"
                },
                practiceDecatur: "2-5 minutes preparation, ongoing application",
                
                prerequisites: ["Ω0", "Ω4"],
                relatedGlyphs: ["Ω12", "Ω15", "Τ2"],
                complementaryGlyphs: ["Ω3", "Ω9", "Ω6"],
                advancement: ["∑5", "∑7"],
                antidoteToShadowOf: ["people_pleasing", "boundary_collapse"],
                
                fieldNotes: [
                    "A mother realized: 'When I set boundaries with love, my children felt safer, not rejected.'",
                    "From a recovering people-pleaser: 'I learned that saying no to what drains me is saying yes to what serves.'",
                    "Workplace wisdom: 'Boundaries with love actually deepened my relationships with colleagues.'"
                ],
                
                contexts: ["workplace", "family", "friendship", "parenting", "romantic_relationship"],
                timeOfDay: ["anytime"],
                lifePhases: ["all"],
                emotions: ["overwhelm", "resentment", "guilt", "fear"],
                
                sigil: "/glyphs/sigils/omega-7.svg",
                primaryColor: "#C4A5A0",
                accentColor: "#F4E6E3"
            })
        };
    }

    // Harmony Network - Organizing glyphs by the Seven Harmonies
    initializeHarmonyNetwork() {
        return {
            'integral-wisdom-cultivation': {
                name: "Integral Wisdom Cultivation",
                essence: "Truth is the shortest path home",
                description: "The harmony of authenticity and vulnerable truth-telling",
                coreGlyphs: ["Ω0", "Ω1", "Ω2", "Ω3"],
                masteryProgression: ["Ω0", "Ω1", "Ω2", "Ω3", "Τ1", "∑1"],
                shadowsTransformed: ["spiritual_bypassing", "people_pleasing", "perfectionism"]
            },
            
            'resonant-coherence': {
                name: "Resonant Resonant Coherence", 
                essence: "Wholeness is your natural state",
                description: "The harmony of integration and unified presence",
                coreGlyphs: ["Ω8", "Ω9", "Ω10", "Ω11"],
                masteryProgression: ["Ω8", "Ω9", "Ω10", "Ω11", "Τ2", "∑2"],
                shadowsTransformed: ["fragmentation", "compartmentalization", "inner_conflict"]
            },
            
            'universal-interconnectedness': {
                name: "Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance",
                essence: "Deep listening is love in action", 
                description: "The harmony of attunement and empathetic presence",
                coreGlyphs: ["Ω4", "Ω5", "Ω6", "Ω12"],
                masteryProgression: ["Ω4", "Ω5", "Ω6", "Ω12", "Τ3", "∑3"],
                shadowsTransformed: ["reactive_listening", "advice_addiction", "empathy_overwhelm"]
            },
            
            'evolutionary-progression': {
                name: "Evolutionary Progression & Purposeful Unfolding",
                essence: "Your power lives in your response",
                description: "The harmony of conscious choice and empowerment",
                coreGlyphs: ["Ω7", "Ω13", "Ω14", "Ω15"],
                masteryProgression: ["Ω7", "Ω13", "Ω14", "Ω15", "Τ4", "∑4"],
                shadowsTransformed: ["victim_consciousness", "power_struggles", "learned_helplessness"]
            },
            
            'pan-sentient-flourishing': {
                name: "Pan-Sentient Flourishing",
                essence: "Your body is wisdom incarnate",
                description: "The harmony of life force and embodied wisdom",
                coreGlyphs: ["Ω16", "Ω17", "Ω18", "Ω19"],
                masteryProgression: ["Ω16", "Ω17", "Ω18", "Ω19", "Τ5", "∑5"],
                shadowsTransformed: ["disconnection_from_body", "chronic_exhaustion", "spiritual_disembodiment"]
            },
            
            'sacred-reciprocity': {
                name: "Sacred Reciprocity",
                essence: "The gift is in the giving and receiving",
                description: "The harmony of balanced exchange and interdependence",
                coreGlyphs: ["Ω20", "Ω21", "Ω22", "Ω23"],
                masteryProgression: ["Ω20", "Ω21", "Ω22", "Ω23", "Τ6", "∑6"],
                shadowsTransformed: ["codependency", "transactional_relating", "isolation"]
            },
            
            'infinite-play': {
                name: "Infinite Play & Creative Emergence",
                essence: "Creativity is consciousness evolving",
                description: "The harmony of creative emergence and evolutionary flow",
                coreGlyphs: ["Ω24", "Ω25", "Ω26", "Ω27"],
                masteryProgression: ["Ω24", "Ω25", "Ω26", "Ω27", "Τ7", "∑7"],
                shadowsTransformed: ["creative_blocks", "fear_of_change", "stagnation"]
            }
        };
    }

    // Practice Pathways - Sequential journeys through the constellation
    initializePracticePathways() {
        return {
            newcomer_foundation: {
                name: "Sacred Foundations",
                description: "Essential practices for beginning the journey",
                sequence: ["Ω0", "Ω1", "Ω4", "Ω8"],
                estimatedJourney: "4-8 weeks",
                prerequisites: "Willingness to practice"
            },
            
            relationship_healing: {
                name: "Healing in Relationship",
                description: "Practices for transforming relational patterns",
                sequence: ["Ω0", "Ω4", "Ω7", "Ω12", "Τ3", "∑3"],
                estimatedJourney: "3-6 months",
                prerequisites: "Basic foundation in Ω0 and Ω4"
            },
            
            leadership_consciousness: {
                name: "Conscious Leadership",
                description: "Practices for leaders creating coherent fields",
                sequence: ["Ω0", "Ω7", "Ω12", "Ω15", "∑8", "∑12"],
                estimatedJourney: "6-12 months",
                prerequisites: "Experience with basic boundary and listening practices"
            },
            
            shadow_integration: {
                name: "Sacred Shadow Work",
                description: "Practices for transforming challenging patterns",
                sequence: ["Ω0", "Ω8", "Ω11", "Τ1", "Τ2", "∑1"],
                estimatedJourney: "Ongoing",
                prerequisites: "Established presence practice and therapeutic support if needed"
            },
            
            mastery_embodiment: {
                name: "Living Mastery",
                description: "Advanced practices for wisdom keepers",
                sequence: ["∑8", "∑12", "∑15", "∑20", "∑25", "∑33"],
                estimatedJourney: "Years",
                prerequisites: "Mastery of all seven harmonies"
            }
        };
    }

    // Shadow/Antidote Mapping - Which glyphs heal which patterns
    initializeShadowAntidotes() {
        return {
            spiritual_bypassing: {
                description: "Using spiritual concepts to avoid difficult emotions or situations",
                antidoteGlyphs: ["Ω0", "Ω8", "Ω16"],
                preventionPractices: ["Ω11", "Τ1"]
            },
            
            people_pleasing: {
                description: "Compulsive need to gain approval by sacrificing authentic needs",
                antidoteGlyphs: ["Ω7", "Ω13", "Ω14"],
                preventionPractices: ["Ω0", "Ω1", "Ω3"]
            },
            
            reactive_listening: {
                description: "Listening only to formulate responses or defend positions",
                antidoteGlyphs: ["Ω4", "Ω5", "Ω12"],
                preventionPractices: ["Ω0", "∑3"]
            },
            
            boundary_collapse: {
                description: "Inability to maintain healthy limits in relationships",
                antidoteGlyphs: ["Ω7", "Ω15", "Τ2"],
                preventionPractices: ["Ω0", "Ω16", "Ω17"]
            },
            
            victim_consciousness: {
                description: "Habitual belief that external forces control one's experience",
                antidoteGlyphs: ["Ω13", "Ω14", "Ω15"],
                preventionPractices: ["Ω0", "Ω8", "∑4"]
            },
            
            codependency: {
                description: "Compulsive caretaking that enables dysfunction",
                antidoteGlyphs: ["Ω7", "Ω20", "Ω21"],
                preventionPractices: ["Ω4", "Ω16", "∑6"]
            },
            
            creative_blocks: {
                description: "Fear-based resistance to creative expression and risk-taking",
                antidoteGlyphs: ["Ω24", "Ω25", "Ω26"],
                preventionPractices: ["Ω0", "Ω8", "∑7"]
            }
        };
    }

    // Public API for Living Glyphs System
    getGlyph(glyphId) {
        return this.glyphConstellation[glyphId];
    }

    getGlyphsByHarmony(harmonyName) {
        const harmony = this.harmonyNetwork[harmonyName];
        return harmony ? harmony.coreGlyphs.map(id => this.glyphConstellation[id]) : [];
    }

    getGlyphsByDifficulty(difficulty) {
        return Object.values(this.glyphConstellation)
            .filter(glyph => glyph.difficulty === difficulty);
    }

    getAntidoteGlyphs(shadowPattern) {
        const shadowData = this.shadowAntidotePairs[shadowPattern];
        return shadowData ? shadowData.antidoteGlyphs.map(id => this.glyphConstellation[id]) : [];
    }

    getPracticePathway(pathwayName) {
        return this.practicePathways[pathwayName];
    }

    // Search and Discovery
    searchGlyphs(query) {
        const searchTerms = query.toLowerCase().split(' ');
        return Object.values(this.glyphConstellation).filter(glyph => {
            const searchableText = `
                ${glyph.name} 
                ${glyph.quadrants.why.philosophicalRoot} 
                ${glyph.quadrants.why.coreQuestion}
                ${glyph.contexts.join(' ')}
                ${glyph.emotions.join(' ')}
            `.toLowerCase();
            
            return searchTerms.every(term => searchableText.includes(term));
        });
    }

    getGlyphsForContext(context) {
        return Object.values(this.glyphConstellation)
            .filter(glyph => glyph.contexts.includes(context));
    }

    getGlyphsForEmotion(emotion) {
        return Object.values(this.glyphConstellation)
            .filter(glyph => glyph.emotions.includes(emotion));
    }

    // Evolution and Learning
    recordPractice(glyphId, effectiveness, notes = '') {
        const glyph = this.glyphConstellation[glyphId];
        if (glyph) {
            glyph.practiceCount++;
            glyph.effectiveness = (glyph.effectiveness + effectiveness) / 2; // Running average
            glyph.lastPracticed = Date.now();
            if (notes) {
                glyph.personalNotes.push({
                    timestamp: Date.now(),
                    note: notes,
                    effectiveness: effectiveness
                });
            }
        }
    }

    addCommunityFieldNote(glyphId, note, practitioner = 'anonymous') {
        const glyph = this.glyphConstellation[glyphId];
        if (glyph) {
            glyph.quadrants.we.practitionerFieldNotes.push({
                note: note,
                practitioner: practitioner,
                timestamp: Date.now(),
                verified: false // Would need moderation system
            });
        }
    }

    // Data Export/Import for Sacred Field Integration
    exportConstellation() {
        return {
            constellation: this.glyphConstellation,
            harmonyNetwork: this.harmonyNetwork,
            practicePathways: this.practicePathways,
            shadowAntidotes: this.shadowAntidotePairs,
            exportDate: new Date().toISOString(),
            version: "2.0"
        };
    }

    importUserProgress(userData) {
        // Safely merge user practice data with constellation
        Object.keys(userData.glyphProgress || {}).forEach(glyphId => {
            if (this.glyphConstellation[glyphId]) {
                const userGlyph = userData.glyphProgress[glyphId];
                Object.assign(this.glyphConstellation[glyphId], {
                    practiceCount: userGlyph.practiceCount || 0,
                    effectiveness: userGlyph.effectiveness || 0,
                    lastPracticed: userGlyph.lastPracticed || null,
                    personalNotes: userGlyph.personalNotes || []
                });
            }
        });
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.LivingGlyphsSchema = LivingGlyphsSchema;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LivingGlyphsSchema;
}