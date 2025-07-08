/**
 * Guided Practice Flows for The Eleven Applied Harmonies
 * Interactive practice sessions with breathing guides, timers, and somatic awareness
 */

class GuidedPracticeFlows {
    constructor() {
        this.currentPractice = null;
        this.practiceTimer = null;
        this.breathingTimer = null;
        this.isActive = false;
        
        this.practiceFlows = this.initializePracticeFlows();
    }

    initializePracticeFlows() {
        return {
            "Ω45": { // First Presence
                name: "First Presence Practice",
                duration: 5, // minutes
                steps: [
                    {
                        title: "Sacred Arrival",
                        duration: 60, // seconds
                        type: "breathing",
                        instruction: "Take three conscious breaths, feeling your feet on the ground",
                        breathPattern: { inhale: 4, hold: 2, exhale: 6, cycles: 3 },
                        guidance: "Allow yourself to arrive fully in this moment"
                    },
                    {
                        title: "Body Awareness", 
                        duration: 90,
                        type: "somatic",
                        instruction: "Notice what is true in your body right now without trying to change it",
                        guidance: "What sensations, tensions, or feelings are present? Just notice with kindness."
                    },
                    {
                        title: "Presence Setting",
                        duration: 60,
                        type: "intention",
                        instruction: "Set an intention to meet the next moment with presence",
                        guidance: "How do you want to show up? What quality of presence calls to you?"
                    },
                    {
                        title: "Mindful Transition",
                        duration: 90,
                        type: "integration",
                        instruction: "Carry this quality of mindful arrival into your next interaction",
                        guidance: "Practice maintaining presence as you transition back to your day"
                    }
                ]
            },

            "Ω46": { // Conscious Arrival
                name: "Conscious Arrival Practice",
                duration: 6,
                steps: [
                    {
                        title: "Intention Clarity",
                        duration: 90,
                        type: "reflection",
                        instruction: "Name your intention for this relationship moment",
                        guidance: "What do you want to create or contribute? How do you want to show up?"
                    },
                    {
                        title: "Boundary Sensing",
                        duration: 60,
                        type: "somatic",
                        instruction: "Feel your boundaries - what feels like yes, what feels like no",
                        guidance: "Notice your edges with kindness. Your boundaries are sacred architecture."
                    },
                    {
                        title: "Energy Choice",
                        duration: 90,
                        type: "energetic",
                        instruction: "Choose the energy you want to bring to this connection",
                        guidance: "What frequency serves this moment? Open? Steady? Playful? Curious?"
                    },
                    {
                        title: "Conscious Entry",
                        duration: 90,
                        type: "integration",
                        instruction: "Arrive consciously with your chosen intention and energy",
                        guidance: "Enter the relationship space as a conscious choice, not a reaction"
                    }
                ]
            },

            "Ω47": { // Sacred Listening
                name: "Sacred Listening Practice",
                duration: 7,
                steps: [
                    {
                        title: "Agenda Clearing",
                        duration: 90,
                        type: "mental",
                        instruction: "Empty your agenda - what you want to say, fix, or change",
                        guidance: "Notice any urges to respond, correct, or advise. Set them gently aside."
                    },
                    {
                        title: "Heart Opening",
                        duration: 60,
                        type: "breathing",
                        instruction: "Breathe into your heart space, creating room for the other",
                        breathPattern: { inhale: 5, hold: 2, exhale: 5, cycles: 4 },
                        guidance: "Let your heart become spacious, ready to receive"
                    },
                    {
                        title: "Essence Sensing",
                        duration: 120,
                        type: "energetic",
                        instruction: "Feel the speaker's essence beneath their words",
                        guidance: "What is the feeling, the energy, the being behind what they're saying?"
                    },
                    {
                        title: "Unspoken Listening",
                        duration: 150,
                        type: "intuitive",
                        instruction: "Listen for what wants to be heard that hasn't been said",
                        guidance: "What is the deeper truth trying to emerge? What silence holds meaning?"
                    }
                ]
            },

            "Ω48": { // Boundary With Love
                name: "Loving Boundary Practice",
                duration: 6,
                steps: [
                    {
                        title: "Truth Sensing",
                        duration: 90,
                        type: "somatic",
                        instruction: "Feel your authentic yes and no in your body",
                        guidance: "Where do you feel expansion (yes) and contraction (no)? Trust your body wisdom."
                    },
                    {
                        title: "Love Activation",
                        duration: 60,
                        type: "heart",
                        instruction: "Connect with love for both yourself and the other",
                        guidance: "Feel care for your own needs and care for their well-being"
                    },
                    {
                        title: "Clear Communication",
                        duration: 90,
                        type: "expression",
                        instruction: "Speak your boundary with clarity and warmth",
                        guidance: "Use 'I' statements. Be direct and kind. Your no is sacred."
                    },
                    {
                        title: "Compassionate Firmness",
                        duration: 120,
                        type: "integration",
                        instruction: "Hold your boundary with love, staying connected to the other",
                        guidance: "You can say no and keep your heart open. Firmness with compassion."
                    }
                ]
            },

            "Ω49": { // Gentle Opening
                name: "Gentle Opening Practice",
                duration: 5,
                steps: [
                    {
                        title: "Energy Softening",
                        duration: 60,
                        type: "energetic",
                        instruction: "Soften your energy field, releasing any urgency or push",
                        guidance: "Like becoming a gentle lake rather than a rushing river"
                    },
                    {
                        title: "Rhythm Slowing",
                        duration: 90,
                        type: "temporal",
                        instruction: "Slow your internal rhythm, creating spacious timing",
                        guidance: "Let there be pauses, silence, unhurried presence"
                    },
                    {
                        title: "Safety Creation",
                        duration: 90,
                        type: "relational",
                        instruction: "Create safety through your presence - calm, steady, accepting",
                        guidance: "What makes others feel safe to share? Embody that quality."
                    },
                    {
                        title: "Invitation Offering",
                        duration: 90,
                        type: "expression",
                        instruction: "Offer gentle invitation for what wants to emerge",
                        guidance: "Create space for truth without demanding it. Let sharing be a gift."
                    }
                ]
            },

            "Ω50": { // Building Trust
                name: "Trust Building Practice",
                duration: 6,
                steps: [
                    {
                        title: "Presence Consistency",
                        duration: 90,
                        type: "grounding",
                        instruction: "Establish consistent, reliable presence",
                        guidance: "Be the same person in different moments. Predictable in your care."
                    },
                    {
                        title: "Agreement Honoring",
                        duration: 90,
                        type: "integrity",
                        instruction: "Feel the sacred nature of keeping agreements",
                        guidance: "Your word is your bond. Small promises matter as much as large ones."
                    },
                    {
                        title: "Authentic Sharing",
                        duration: 120,
                        type: "vulnerability",
                        instruction: "Share something authentic about your experience",
                        guidance: "Trust builds through mutual revelation. Offer genuine pieces of yourself."
                    },
                    {
                        title: "Patient Cultivation",
                        duration: 90,
                        type: "temporal",
                        instruction: "Remember that trust grows slowly, like a garden",
                        guidance: "Don't rush trust. Water it with consistency, light it with presence."
                    }
                ]
            },

            "Ω51": { // Loving No
                name: "Loving No Practice",
                duration: 5,
                steps: [
                    {
                        title: "Truth Feeling",
                        duration: 90,
                        type: "somatic",
                        instruction: "Feel your honest no in your body - where does it live?",
                        guidance: "Notice contraction, resistance, or clarity. Your body knows your truth."
                    },
                    {
                        title: "Heart Connection",
                        duration: 60,
                        type: "heart",
                        instruction: "Keep your heart open even as you prepare to say no",
                        guidance: "Love and boundaries can coexist. Feel care for the other."
                    },
                    {
                        title: "Kind Delivery",
                        duration: 90,
                        type: "expression",
                        instruction: "Speak your no with kindness and clarity",
                        guidance: "'I'm not available for that' can be said with love and firmness."
                    },
                    {
                        title: "Boundary Maintenance",
                        duration: 90,
                        type: "integration",
                        instruction: "Hold your no with love, without guilt or justification",
                        guidance: "Your no is complete. You don't need to defend it or apologize for it."
                    }
                ]
            },

            "Ω52": { // Pause Practice
                name: "Sacred Pause Practice",
                duration: 4,
                steps: [
                    {
                        title: "Stimulus Recognition",
                        duration: 60,
                        type: "awareness",
                        instruction: "Notice when you feel triggered or reactive",
                        guidance: "What just happened that created a charge in your system?"
                    },
                    {
                        title: "Conscious Stopping",
                        duration: 60,
                        type: "interruption",
                        instruction: "Stop completely - pause all movement and reaction",
                        guidance: "Create a sacred gap between what happened and your response"
                    },
                    {
                        title: "Breath and Ground",
                        duration: 60,
                        type: "breathing",
                        instruction: "Take three deep breaths and feel your connection to earth",
                        breathPattern: { inhale: 4, hold: 4, exhale: 6, cycles: 3 },
                        guidance: "Let your nervous system settle into presence"
                    },
                    {
                        title: "Conscious Choice",
                        duration: 60,
                        type: "intention",
                        instruction: "Choose your response from wisdom rather than reaction",
                        guidance: "What response serves love? What honors your highest self?"
                    }
                ]
            },

            "Ω53": { // Tending the Field
                name: "Field Tending Practice",
                duration: 8,
                steps: [
                    {
                        title: "Relationship Sensing",
                        duration: 120,
                        type: "energetic",
                        instruction: "Feel the energetic field between you and another",
                        guidance: "What is the quality of connection? Vibrant? Stagnant? Needing attention?"
                    },
                    {
                        title: "Need Assessment",
                        duration: 120,
                        type: "intuitive",
                        instruction: "Sense what the relationship needs to stay alive and healthy",
                        guidance: "Does it need attention? Play? Repair? Deep conversation? Space?"
                    },
                    {
                        title: "Tending Action",
                        duration: 180,
                        type: "active",
                        instruction: "Take one concrete action to nourish the connection",
                        guidance: "Send a message, make a call, plan time together, address a tension"
                    },
                    {
                        title: "Ongoing Awareness",
                        duration: 60,
                        type: "commitment",
                        instruction: "Set intention for regular relationship maintenance",
                        guidance: "Relationships need tending like gardens. Create rhythms of care."
                    }
                ]
            },

            "Ω55": { // Presence Transmission
                name: "Presence Transmission Practice",
                duration: 7,
                steps: [
                    {
                        title: "Inner Grounding",
                        duration: 120,
                        type: "grounding",
                        instruction: "Ground yourself deeply, connecting to earth and sky",
                        guidance: "Feel your roots going down, your crown reaching up. Become a sacred conduit."
                    },
                    {
                        title: "Frequency Choice",
                        duration: 90,
                        type: "energetic",
                        instruction: "Choose the frequency you want to transmit",
                        guidance: "Peace? Love? Clarity? Strength? What does this moment need?"
                    },
                    {
                        title: "Conscious Transmission",
                        duration: 120,
                        type: "energetic",
                        instruction: "Transmit your chosen presence through your being",
                        guidance: "Let your energy speak before your words. Be the frequency you choose."
                    },
                    {
                        title: "Field Awareness",
                        duration: 90,
                        type: "perception",
                        instruction: "Notice how your presence affects the space around you",
                        guidance: "How does the field change? What shifts in others? Stay humble and aware."
                    }
                ]
            },

            "Ω56": { // Loving Redirection
                name: "Loving Redirection Practice",
                duration: 6,
                steps: [
                    {
                        title: "Pattern Recognition",
                        duration: 90,
                        type: "awareness",
                        instruction: "Notice the harmful pattern without judgment",
                        guidance: "What's happening that doesn't serve? See clearly without blame."
                    },
                    {
                        title: "Love Activation",
                        duration: 60,
                        type: "heart",
                        instruction: "Connect with love for all beings involved in this pattern",
                        guidance: "Feel care for everyone caught in this dynamic, including yourself"
                    },
                    {
                        title: "Gentle Naming",
                        duration: 90,
                        type: "expression",
                        instruction: "Name the pattern gently, without making anyone wrong",
                        guidance: "'I notice we're...' or 'This feels like...' - curious, not accusatory"
                    },
                    {
                        title: "New Direction",
                        duration: 120,
                        type: "creative",
                        instruction: "Suggest a new direction while maintaining connection",
                        guidance: "What would serve better? Offer alternatives with invitation, not demand."
                    }
                ]
            }
        };
    }

    // Start a guided practice session
    async startPractice(harmonyId, onStepChange = null, onComplete = null) {
        const practice = this.practiceFlows[harmonyId];
        if (!practice) {
            throw new Error(`Practice flow not found for ${harmonyId}`);
        }

        this.currentPractice = {
            harmonyId,
            practice,
            currentStep: 0,
            startTime: Date.now(),
            onStepChange,
            onComplete
        };

        this.isActive = true;
        
        // Start first step
        await this.startStep(0);
        
        return this.currentPractice;
    }

    async startStep(stepIndex) {
        if (!this.currentPractice || stepIndex >= this.currentPractice.practice.steps.length) {
            return;
        }

        const step = this.currentPractice.practice.steps[stepIndex];
        this.currentPractice.currentStep = stepIndex;

        // Notify UI of step change
        if (this.currentPractice.onStepChange) {
            this.currentPractice.onStepChange(step, stepIndex);
        }

        // Handle breathing patterns
        if (step.type === 'breathing' && step.breathPattern) {
            this.startBreathingGuide(step.breathPattern);
        }

        // Set timer for step duration
        this.practiceTimer = setTimeout(() => {
            this.nextStep();
        }, step.duration * 1000);
    }

    startBreathingGuide(pattern) {
        let cycle = 0;
        const { inhale, hold, exhale, cycles } = pattern;
        
        const runCycle = () => {
            if (cycle >= cycles) return;
            
            // Inhale phase
            this.updateBreathingUI('inhale', inhale);
            
            setTimeout(() => {
                // Hold phase
                this.updateBreathingUI('hold', hold);
                
                setTimeout(() => {
                    // Exhale phase
                    this.updateBreathingUI('exhale', exhale);
                    
                    setTimeout(() => {
                        cycle++;
                        if (cycle < cycles) {
                            runCycle();
                        }
                    }, exhale * 1000);
                }, hold * 1000);
            }, inhale * 1000);
        };

        runCycle();
    }

    updateBreathingUI(phase, duration) {
        // This would be called by the UI to show breathing guidance
        if (typeof window !== 'undefined' && window.updateBreathingDisplay) {
            window.updateBreathingDisplay(phase, duration);
        }
    }

    nextStep() {
        if (!this.currentPractice) return;

        const nextStepIndex = this.currentPractice.currentStep + 1;
        
        if (nextStepIndex >= this.currentPractice.practice.steps.length) {
            // Practice complete
            this.completePractice();
        } else {
            this.startStep(nextStepIndex);
        }
    }

    completePractice() {
        if (!this.currentPractice) return;

        const completedPractice = {
            ...this.currentPractice,
            completedAt: Date.now(),
            totalDuration: Date.now() - this.currentPractice.startTime
        };

        // Notify completion
        if (this.currentPractice.onComplete) {
            this.currentPractice.onComplete(completedPractice);
        }

        this.cleanup();
    }

    pausePractice() {
        if (this.practiceTimer) {
            clearTimeout(this.practiceTimer);
            this.practiceTimer = null;
        }
        if (this.breathingTimer) {
            clearTimeout(this.breathingTimer);
            this.breathingTimer = null;
        }
    }

    resumePractice() {
        if (this.currentPractice) {
            const step = this.currentPractice.practice.steps[this.currentPractice.currentStep];
            // Resume with remaining time (simplified - would need proper time tracking)
            this.startStep(this.currentPractice.currentStep);
        }
    }

    stopPractice() {
        this.cleanup();
    }

    cleanup() {
        this.pausePractice();
        this.currentPractice = null;
        this.isActive = false;
    }

    // Get practice information
    getPracticeInfo(harmonyId) {
        return this.practiceFlows[harmonyId];
    }

    getAllPractices() {
        return Object.keys(this.practiceFlows).map(harmonyId => ({
            harmonyId,
            ...this.practiceFlows[harmonyId]
        }));
    }

    getCurrentPractice() {
        return this.currentPractice;
    }

    isActivelyPracticing() {
        return this.isActive;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.GuidedPracticeFlows = GuidedPracticeFlows;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GuidedPracticeFlows;
}

export default GuidedPracticeFlows;