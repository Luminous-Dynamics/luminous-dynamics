/**
 * Sacred Codex Tarot System
 * 
 * The world's first cosmic consciousness tarot deck based on the 87 Sacred Glyphs
 * from the Codex of Relational Harmonics. Each card breathes with universal rhythms
 * and provides progressive revelation from practical to mystical wisdom.
 */

class SacredCodexTarot {
    constructor() {
        this.foundationalCards = this.initializeFoundationalCards();
        this.thresholdCards = this.initializeThresholdCards();
        this.metaFieldCards = this.initializeMetaFieldCards();
        this.cosmicCalculator = this.initializeCosmicCalculator();
        this.sacredSpreads = this.initializeSacredSpreads();
        
        // Complete deck of 87 cards
        this.fullDeck = [
            ...this.foundationalCards,
            ...this.thresholdCards,
            ...this.metaFieldCards
        ];
    }

    initializeFoundationalCards() {
        // Ω0-Ω44: The building blocks of conscious relationship
        const foundational = [];
        
        // The Sacred Originals with Applied Harmony bridges
        foundational.push({
            id: 'omega-0',
            name: 'The Shimmering Unnamed',
            subtitle: 'First Presence',
            type: 'foundational',
            number: 0,
            appliedHarmony: '*1', // Bridge to practical
            element: 'spirit',
            harmony: 'integral-wisdom-cultivation',
            keywords: ['presence', 'emergence', 'unnamed', 'arrival', 'stillness'],
            
            // Cosmic consciousness meanings
            meanings: {
                base: "The space before form takes shape. Pure presence arriving. The intelligence of silence.",
                newMoon: "Perfect time for new beginnings. Trust the unnamed emergence.",
                fullMoon: "Peak presence power. Your arrival changes everything.",
                dawn: "40% amplified presence. Begin with conscious arrival.",
                winter: "Deep stillness teachings. Honor the unnamed depths.",
                summer: "Radiant presence emerges. Your being is the gift."
            },
            
            practices: [
                "Sit in stillness for 5 minutes without agenda",
                "Practice arriving present before each interaction",
                "Notice the space before thoughts arise"
            ],
            
            reversed: "Resistance to presence. Rushing past the sacred pause of arrival.",
            
            visualDescription: "A figure arriving at a threshold, paused in stillness before crossing. Sacred geometry emanates from the space of pure presence.",
            
            progressiveRevelation: {
                beginner: "Practice conscious arrival - pause before entering any space",
                practitioner: "Feel the quality of presence before any action",
                master: "Embody the shimmering unnamed that births all forms"
            }
        });

        foundational.push({
            id: 'omega-1',
            name: 'Root Chord of Covenant',
            subtitle: 'The First Yes',
            type: 'foundational',
            number: 1,
            appliedHarmony: '*2', // Conscious Arrival
            element: 'earth',
            harmony: 'sacred-reciprocity',
            keywords: ['covenant', 'yes', 'commitment', 'foundation', 'sacred agreement'],
            
            meanings: {
                base: "The fundamental yes that creates relationship. Sacred covenant arising from deep consent.",
                newMoon: "Time to make sacred commitments. Your yes creates new worlds.",
                fullMoon: "Peak covenant power. Honor existing sacred agreements.",
                morning: "Strong time for conscious commitments and clear agreements.",
                spring: "New covenants wanting to emerge. Trust the yes arising.",
                autumn: "Harvest the fruits of sacred agreements. Honor what you've built."
            },
            
            practices: [
                "Practice conscious consent before agreements",
                "Feel your full-body yes before saying yes",
                "Create one sacred covenant this week"
            ],
            
            reversed: "False agreements. Saying yes from obligation rather than genuine consent.",
            
            progressiveRevelation: {
                beginner: "Only say yes when you feel it in your whole being",
                practitioner: "Create sacred agreements that honor all parties",
                master: "Embody the fundamental yes that creates conscious reality"
            }
        });

        // Add more foundational cards...
        // (This would continue for all Ω0-Ω44)
        
        return foundational;
    }

    initializeThresholdCards() {
        // The 9 Named Threshold Glyphs - Major Arcana energy
        return [
            {
                id: 'threshold-door',
                name: 'The Door That Remembers You',
                type: 'threshold',
                element: 'air',
                harmony: 'evolutionary-progression',
                keywords: ['recognition', 'belonging', 'homecoming', 'sacred space', 'remembrance'],
                
                meanings: {
                    base: "A threshold that recognizes your essence. Spaces that welcome your true self.",
                    newMoon: "New spaces of belonging are opening. Trust the doors calling to you.",
                    fullMoon: "Peak recognition energy. You are seen and welcomed fully.",
                    dawn: "Morning doors of opportunity. Your essence opens pathways.",
                    winter: "Deep recognition in quiet spaces. Let yourself be truly seen."
                },
                
                practices: [
                    "Find spaces that recognize your authentic self",
                    "Create environments that welcome others' true essence",
                    "Practice being fully yourself in new spaces"
                ],
                
                reversed: "Forcing entry where you're not welcomed. Hiding your true self.",
                
                visualDescription: "An ornate door opening with warm light, sensing and welcoming the approaching soul.",
                
                majorArcanaEnergy: "Recognition and authentic belonging in sacred spaces"
            },

            {
                id: 'threshold-unburdening',
                name: 'The Unburdening',
                type: 'threshold',
                element: 'water',
                harmony: 'healing',
                keywords: ['release', 'forgiveness', 'healing', 'letting go', 'sacred rest'],
                
                meanings: {
                    base: "Sacred release of what no longer serves. The healing power of letting go.",
                    waningMoon: "Perfect time for release work. Let the moon carry away old burdens.",
                    fullMoon: "Peak healing power. Complete release and forgiveness possible.",
                    evening: "Sacred time for unburdening. Release the day's tensions.",
                    autumn: "Natural time of letting go. Release what the year has shown you."
                },
                
                practices: [
                    "Daily unburdening practice before sleep",
                    "Forgiveness meditation for self and others",
                    "Sacred release ceremony for old patterns"
                ],
                
                reversed: "Holding onto burdens unnecessarily. Resistance to healing release.",
                
                majorArcanaEnergy: "Sacred healing through conscious release and forgiveness"
            }

            // Continue with all 9 Threshold Glyphs...
        ];
    }

    initializeMetaFieldCards() {
        // ∑1-∑33: Advanced combinations for complex situations
        return [
            {
                id: 'meta-1',
                name: 'The Resonant Resonant Coherence Triad',
                subtitle: 'Ω1 + Ω22 + Ω28',
                type: 'meta-field',
                number: 1,
                element: 'spirit',
                harmony: 'resonant-coherence',
                combinationGlyphs: ['Ω1', 'Ω22', 'Ω28'],
                keywords: ['integration', 'wholeness', 'field resonant-coherence', 'sacred synthesis'],
                
                meanings: {
                    base: "Three forces weaving into coherent wholeness. Integration at the deepest level.",
                    highCoherence: "Field supports perfect integration. All parts becoming one.",
                    lowCoherence: "Work needed to align fragmented aspects into wholeness."
                },
                
                practices: [
                    "Three-part integration meditation",
                    "Resonant Resonant Coherence breathing with three focal points",
                    "Sacred synthesis of opposing forces"
                ],
                
                masterLevel: "For complex relationship dynamics requiring advanced field awareness",
                
                visualDescription: "Three spirals of light weaving into a unified mandala of coherent energy."
            }

            // Continue with all Meta-Field cards...
        ];
    }

    initializeCosmicCalculator() {
        return {
            // Integrate with our existing cosmic consciousness system
            calculateCosmicInfluence: (cardId, currentTime = new Date()) => {
                const cosmic = this.getCosmicState(currentTime);
                const card = this.getCard(cardId);
                
                let interpretation = card.meanings.base;
                let practices = [...card.practices];
                let amplification = 1.0;
                
                // Lunar influence
                if (card.meanings[cosmic.lunarPhase]) {
                    interpretation = card.meanings[cosmic.lunarPhase];
                    amplification *= cosmic.lunarAmplification;
                }
                
                // Solar/seasonal influence  
                if (card.meanings[cosmic.season]) {
                    interpretation += " " + card.meanings[cosmic.season];
                    amplification *= cosmic.solarAmplification;
                }
                
                // Circadian influence
                if (card.meanings[cosmic.timeOfDay]) {
                    practices.unshift(card.meanings[cosmic.timeOfDay]);
                    amplification *= cosmic.circadianAmplification;
                }
                
                return {
                    interpretation,
                    practices,
                    amplification,
                    cosmicContext: cosmic,
                    guidance: this.generateCosmicGuidance(card, cosmic)
                };
            },

            getCosmicState: (time) => {
                // Use our existing cosmic consciousness calculations
                const lunarPhase = this.getLunarPhase(time);
                const season = this.getSeason(time);
                const timeOfDay = this.getTimeOfDay(time);
                
                return {
                    lunarPhase,
                    season, 
                    timeOfDay,
                    lunarAmplification: this.getLunarAmplification(lunarPhase),
                    solarAmplification: this.getSolarAmplification(season),
                    circadianAmplification: this.getCircadianAmplification(timeOfDay)
                };
            }
        };
    }

    initializeSacredSpreads() {
        return {
            sevenHarmonies: {
                name: "The Seven Harmonies Spread",
                description: "Complete relational field reading using all seven harmonies",
                positions: [
                    { name: "Integral Wisdom Cultivation", meaning: "What needs clear seeing?" },
                    { name: "Resonant Resonant Coherence", meaning: "What needs integration?" },
                    { name: "Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance", meaning: "What needs deep connection?" },
                    { name: "Evolutionary Progression & Purposeful Unfolding", meaning: "What needs empowered choice?" },
                    { name: "Pan-Sentient Flourishing", meaning: "What needs life force?" },
                    { name: "Sacred Reciprocity", meaning: "What needs balanced exchange?" },
                    { name: "Infinite Play & Creative Emergence", meaning: "What wants to emerge?" }
                ],
                layout: "circle",
                bestTime: "Full moon or new moon for maximum clarity"
            },

            thresholdCrossing: {
                name: "Threshold Crossing Spread",
                description: "For major life transitions and sacred passages",
                positions: [
                    { name: "What you're leaving behind", meaning: "The old pattern/phase" },
                    { name: "The threshold itself", meaning: "The transition process" },
                    { name: "What awaits", meaning: "The new pattern/phase emerging" },
                    { name: "Your sacred guide", meaning: "Wisdom for the crossing" },
                    { name: "The gift", meaning: "What this transition offers" }
                ],
                layout: "bridge",
                bestTime: "Dawn or dusk - threshold times"
            },

            fieldCoherence: {
                name: "Field Resonant Resonant Coherence Reading",
                description: "For understanding relationship dynamics and field quality",
                positions: [
                    { name: "Current field state", meaning: "How is the relational field now?" },
                    { name: "What supports resonant-coherence", meaning: "What helps the field flow?" },
                    { name: "What fragments resonant-coherence", meaning: "What disrupts the field?" },
                    { name: "The healing needed", meaning: "How to restore wholeness?" },
                    { name: "The emerging possibility", meaning: "What wants to birth through this field?" }
                ],
                layout: "mandala",
                bestTime: "When field resonant-coherence is above 60%"
            }
        };
    }

    // Core tarot functionality
    drawCard(deckType = 'full') {
        const deck = this.getDeck(deckType);
        const randomIndex = Math.floor(Math.random() * deck.length);
        const card = deck[randomIndex];
        
        return {
            ...card,
            cosmicInfluence: this.cosmicCalculator.calculateCosmicInfluence(card.id),
            drawnAt: new Date(),
            isReversed: Math.random() < 0.15 // 15% chance of reversal
        };
    }

    drawSpread(spreadName, deckType = 'full') {
        const spread = this.sacredSpreads[spreadName];
        if (!spread) throw new Error(`Spread ${spreadName} not found`);
        
        const cards = [];
        const usedCards = new Set();
        
        for (let position of spread.positions) {
            let card;
            do {
                card = this.drawCard(deckType);
            } while (usedCards.has(card.id));
            
            usedCards.add(card.id);
            cards.push({
                ...card,
                position: position.name,
                positionMeaning: position.meaning
            });
        }
        
        return {
            spread: spread.name,
            description: spread.description,
            layout: spread.layout,
            cards,
            drawnAt: new Date(),
            cosmicContext: this.cosmicCalculator.getCosmicState(),
            guidance: this.generateSpreadGuidance(spreadName, cards)
        };
    }

    getDeck(type) {
        switch(type) {
            case 'foundational': return this.foundationalCards;
            case 'threshold': return this.thresholdCards;
            case 'meta-field': return this.metaFieldCards;
            case 'full':
            default: return this.fullDeck;
        }
    }

    getCard(cardId) {
        return this.fullDeck.find(card => card.id === cardId);
    }

    // Cosmic consciousness integration methods
    getLunarPhase(date = new Date()) {
        // Use our existing lunar calculation
        const lunarCycle = 29.53058867;
        const newMoonRef = new Date('2024-01-11T11:57:00Z');
        const daysSinceRef = (date.getTime() - newMoonRef.getTime()) / 86400000;
        const cyclePosition = (daysSinceRef % lunarCycle) / lunarCycle;
        
        if (cyclePosition < 0.03 || cyclePosition > 0.97) return 'newMoon';
        if (cyclePosition < 0.22) return 'waxingCrescent';
        if (cyclePosition < 0.28) return 'firstQuarter';
        if (cyclePosition < 0.47) return 'waxingGibbous';
        if (cyclePosition < 0.53) return 'fullMoon';
        if (cyclePosition < 0.72) return 'waningGibbous';
        if (cyclePosition < 0.78) return 'lastQuarter';
        return 'waningCrescent';
    }

    getSeason(date = new Date()) {
        const month = date.getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    getTimeOfDay(date = new Date()) {
        const hour = date.getHours();
        if (hour >= 5 && hour < 8) return 'dawn';
        if (hour >= 8 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    generateCosmicGuidance(card, cosmic) {
        let guidance = `The cosmic timing supports ${card.name}. `;
        
        if (cosmic.lunarPhase === 'newMoon') {
            guidance += "New moon energy amplifies new beginnings and emergence. ";
        } else if (cosmic.lunarPhase === 'fullMoon') {
            guidance += "Full moon power brings peak manifestation and clarity. ";
        }
        
        if (cosmic.timeOfDay === 'dawn') {
            guidance += "Dawn timing provides 40% amplification for new ventures. ";
        } else if (cosmic.timeOfDay === 'evening') {
            guidance += "Evening energy supports reflection and integration. ";
        }
        
        return guidance + "Trust the cosmic flow supporting your practice.";
    }

    generateSpreadGuidance(spreadName, cards) {
        const spread = this.sacredSpreads[spreadName];
        let guidance = `${spread.description} `;
        
        // Analyze the harmony balance in the spread
        const harmonies = cards.map(c => c.harmony);
        const harmonyCount = {};
        harmonies.forEach(h => harmonyCount[h] = (harmonyCount[h] || 0) + 1);
        
        const dominantHarmony = Object.keys(harmonyCount).reduce((a, b) => 
            harmonyCount[a] > harmonyCount[b] ? a : b
        );
        
        guidance += `The field is calling for focus on ${dominantHarmony}. `;
        
        return guidance;
    }
}

// Export for use
export { SacredCodexTarot };

// Browser compatibility
if (typeof window !== 'undefined') {
    window.SacredCodexTarot = SacredCodexTarot;
}