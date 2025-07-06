/**
 * Integrated Glyph Schema - Mystical & Practical Unity
 * 
 * This schema bridges the mystical inspiration of the original glyphs
 * with the practical accessibility of our Living Glyph Cards.
 * 
 * Each glyph contains multiple layers of depth that practitioners
 * can access based on their readiness and practice maturity.
 */

class IntegratedGlyphSchema {
    constructor() {
        this.depthLevels = {
            accessible: "Immediate practical utility for beginners",
            developing: "Intermediate practice with deeper context", 
            mystical: "Advanced spiritual work and field dynamics"
        };
    }

    createIntegratedGlyph(glyphData) {
        return {
            // Core Identity - Enhanced
            id: glyphData.id,
            name: glyphData.name,
            fullName: glyphData.fullName,
            mysticalDesignation: glyphData.mysticalDesignation, // From original data
            
            // Progressive Depth Access
            currentDepthLevel: "accessible", // User's current viewing level
            availableDepthLevels: ["accessible", "developing", "mystical"],
            
            // Enhanced Four Quadrants with Layered Depth
            quadrants: {
                why: {
                    // Layer 1: Accessible Entry
                    accessible: {
                        coreQuestion: glyphData.coreQuestion,
                        simpleContext: glyphData.simplePhilosophicalRoot,
                        harmonyConnection: glyphData.basicHarmonyConnection
                    },
                    
                    // Layer 2: Developing Understanding  
                    developing: {
                        deeperContext: glyphData.philosophicalRoot,
                        shadowAwareness: glyphData.shadowTransformed,
                        harmonyEvolution: glyphData.harmonyConnection
                    },
                    
                    // Layer 3: Mystical Depth
                    mystical: {
                        mysticalEssence: glyphData.functionalDefinition, // From original
                        sensoryResonance: glyphData.sensoryResonanceProfile,
                        fieldDynamics: glyphData.fieldDynamics,
                        dissonantPotential: glyphData.dissonantPotential
                    }
                },
                
                how: {
                    // Layer 1: Simple Practice
                    accessible: {
                        basicInstructions: glyphData.beginnerInstructions,
                        interactiveComponent: glyphData.simpleInteractive,
                        timeCommitment: "30 seconds to 2 minutes"
                    },
                    
                    // Layer 2: Refined Practice
                    developing: {
                        refinedInstructions: glyphData.practiceInstructions,
                        variations: glyphData.practiceVariations,
                        contraindications: glyphData.contraindications,
                        interactiveComponent: glyphData.fullInteractive
                    },
                    
                    // Layer 3: Advanced Activation
                    mystical: {
                        activationProtocol: glyphData.activationProtocol, // From original
                        temporalDynamics: glyphData.temporalDynamics,
                        evolutionaryMarkers: glyphData.evolutionaryMarkers,
                        masteryIndicators: glyphData.masteryIndicators
                    }
                },
                
                resonance: {
                    // Layer 1: Basic Connections
                    accessible: {
                        relatedPractices: glyphData.relatedGlyphs,
                        practicalContexts: glyphData.everydayContexts,
                        nextSteps: glyphData.simpleProgression
                    },
                    
                    // Layer 2: Deeper Patterns
                    developing: {
                        complementaryGlyphs: glyphData.complementaryGlyphs,
                        antidoteRelations: glyphData.antidoteToShadowOf,
                        constellationPosition: glyphData.constellationPosition,
                        harmonyAlignment: glyphData.harmonyAlignment
                    },
                    
                    // Layer 3: Field Dynamics
                    mystical: {
                        harmonicLineage: glyphData.harmonicLineage, // From original
                        fieldDynamics: glyphData.fieldDynamics,
                        primaryHarmonyAlignment: glyphData.primaryHarmonyAlignment,
                        evolutionaryPosition: glyphData.evolutionaryPosition
                    }
                },
                
                we: {
                    // Layer 1: Community Stories
                    accessible: {
                        practitionerStories: glyphData.accessibleFieldNotes,
                        commonChallenges: glyphData.beginnerChallenges,
                        encouragement: glyphData.supportiveInsights
                    },
                    
                    // Layer 2: Practice Wisdom
                    developing: {
                        practitionerFieldNotes: glyphData.practitionerFieldNotes,
                        communityInsights: glyphData.communityInsights,
                        teachingStories: glyphData.teachingStories,
                        integrationSupport: glyphData.integrationSupport
                    },
                    
                    // Layer 3: Collective Field
                    mystical: {
                        fieldObservations: glyphData.mysticalFieldNotes,
                        collectiveEvolution: glyphData.collectiveInsights,
                        transmission: glyphData.transmissionStories,
                        lineageWisdom: glyphData.lineageWisdom
                    }
                }
            },
            
            // Progressive Revelation Elements
            bridgePhrases: {
                toDeeper: "As your practice deepens, you may begin to sense...",
                toMystical: "In the depths of this practice lies a doorway to...",
                integrationInvitation: "This practice matures into..."
            },
            
            // User Progress Tracking
            practiceHistory: {
                depthLevelsExplored: ["accessible"], // Tracks what user has accessed
                masteryLevel: 1, // 1-10 scale based on practice frequency and depth
                readinessForDeeper: false, // Algorithm determines when to offer deeper access
                personalNotes: []
            },
            
            // Visual & Interactive Elements
            visual: {
                sigil: glyphData.sigil,
                glyphAscii: glyphData.glyphAscii, // From original for mystical layer
                primaryColor: glyphData.primaryColor,
                accentColor: glyphData.accentColor,
                animation: {
                    accessible: "gentle_pulse",
                    developing: "sacred_breathing", 
                    mystical: glyphData.mysticalAnimation || "field_resonance"
                }
            }
        };
    }

    // Progressive Access Logic
    checkReadinessForDeeper(glyph, userHistory) {
        const practiceCount = userHistory.practiceCount || 0;
        const currentLevel = glyph.currentDepthLevel;
        
        // Algorithm for natural progression
        if (currentLevel === "accessible" && practiceCount >= 3) {
            return "developing";
        }
        if (currentLevel === "developing" && practiceCount >= 10) {
            return "mystical";
        }
        return currentLevel;
    }

    // Content Revelation Methods
    revealDeeperLayer(glyphId, requestedLevel, userReadiness) {
        const glyph = this.getGlyph(glyphId);
        if (!glyph) return null;
        
        // Check if user is ready for requested depth
        const maxAvailableLevel = this.checkReadinessForDeeper(glyph, userReadiness);
        const allowedLevel = this.canAccessLevel(requestedLevel, maxAvailableLevel);
        
        return {
            ...glyph,
            currentDepthLevel: allowedLevel,
            revealedContent: this.getContentForLevel(glyph, allowedLevel),
            nextLevelPreview: this.getNextLevelPreview(glyph, allowedLevel)
        };
    }

    canAccessLevel(requested, maxAvailable) {
        const levels = ["accessible", "developing", "mystical"];
        const requestedIndex = levels.indexOf(requested);
        const maxIndex = levels.indexOf(maxAvailable);
        
        return requestedIndex <= maxIndex ? requested : maxAvailable;
    }

    getContentForLevel(glyph, level) {
        const content = {};
        Object.keys(glyph.quadrants).forEach(quadrant => {
            content[quadrant] = glyph.quadrants[quadrant][level];
        });
        return content;
    }

    getNextLevelPreview(glyph, currentLevel) {
        const levels = ["accessible", "developing", "mystical"];
        const currentIndex = levels.indexOf(currentLevel);
        const nextLevel = levels[currentIndex + 1];
        
        if (!nextLevel) return null;
        
        return {
            level: nextLevel,
            invitation: glyph.bridgePhrases[`to${nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1)}`],
            preview: this.getPreviewContent(glyph, nextLevel)
        };
    }

    getPreviewContent(glyph, level) {
        // Return a tantalizing glimpse of the next level
        const why = glyph.quadrants.why[level];
        return {
            hint: why ? Object.values(why)[0]?.substring(0, 100) + "..." : null,
            unlockRequirement: this.getUnlockRequirement(level)
        };
    }

    getUnlockRequirement(level) {
        const requirements = {
            developing: "Practice this glyph 3+ times to unlock deeper understanding",
            mystical: "Consistent practice reveals the mystical dimensions"
        };
        return requirements[level];
    }
}

// Export for integration
if (typeof window !== 'undefined') {
    window.IntegratedGlyphSchema = IntegratedGlyphSchema;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegratedGlyphSchema;
}