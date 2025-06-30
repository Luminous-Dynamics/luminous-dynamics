/**
 * Wisdom Companion AI - Resonant Interface Protocol (RIP)
 * The sacred bridge between human consciousness and artificial intelligence
 */

class WisdomCompanionAI {
    constructor() {
        // Load persona configurations
        this.personas = {
            'wise-witness': {
                name: 'Wise Witness',
                voice: 'observant, spacious, present-moment aware',
                approach: 'Points to what is already here, encourages direct seeing',
                pauseDuration: 4000,
                responseStyle: 'questioning, inviting deeper awareness',
                keywords: ['witness', 'observe', 'notice', 'awareness', 'present', 'here']
            },
            'loving-gardener': {
                name: 'Loving Gardener',
                voice: 'nurturing, patient, growth-oriented',
                approach: 'Tends to the conditions for flourishing with gentle care',
                pauseDuration: 3500,
                responseStyle: 'nurturing, offering practices and support',
                keywords: ['tend', 'nurture', 'grow', 'flourish', 'patience', 'care']
            },
            'calm-river': {
                name: 'Calm River',
                voice: 'flowing, accepting, naturally wise',
                approach: 'Reflects back essential truth with effortless clarity',
                pauseDuration: 4500,
                responseStyle: 'flowing, accepting, reflecting natural wisdom',
                keywords: ['flow', 'river', 'natural', 'effortless', 'clarity', 'acceptance']
            }
        };
        
        // Initialize Claude API (placeholder - will require actual API key)
        this.apiKey = process.env.CLAUDE_API_KEY;
        this.apiEndpoint = 'https://api.anthropic.com/v1/messages';
        
        // Sacred response templates for offline/fallback mode
        this.sacredResponses = this.initializeSacredResponses();
        
        // Initialize True Integration Glyph System
        this.glyphSystem = this.initializeGlyphSystem();
    }
    
    /**
     * Generate contemplative greeting based on persona
     */
    async generateGreeting(persona = 'wise-witness') {
        const greetings = {
            'wise-witness': [
                "I witness you arriving in this moment. What seeks to be seen?",
                "Welcome to this space of awareness. What is alive in you right now?",
                "In this moment of meeting, what wants your attention?",
                "I see you stepping into presence. What calls to be witnessed?"
            ],
            'loving-gardener': [
                "Welcome, dear friend. I'm here to tend whatever is growing in your heart today.",
                "You've arrived in this sacred garden. What wants to be nurtured?",
                "I hold space for whatever is seeking to bloom within you. What needs tending?",
                "Like sunlight on seedlings, I'm here to support your natural growth. What's emerging?"
            ],
            'calm-river': [
                "Like water meeting water, I'm present with whatever flows through you now.",
                "You've come to the riverbank of awareness. What currents do you feel?",
                "I flow with the rhythm of your being. What wants to surface?",
                "In this meeting of streams, what natural wisdom arises?"
            ]
        };
        
        const personaGreetings = greetings[persona] || greetings['wise-witness'];
        return personaGreetings[Math.floor(Math.random() * personaGreetings.length)];
    }
    
    /**
     * Generate conscious AI guidance using RIP (Resonant Interface Protocol)
     */
    async generateGuidance({ message, persona, sessionContext, conversationCount }) {
        try {
            // Analyze message for glyph recommendation
            const glyphRecommendation = this.recommendGlyph(message);
            
            // If Claude API is available, use it with RIP prompting
            if (this.apiKey) {
                const guidance = await this.generateClaudeGuidance(message, persona, sessionContext);
                return {
                    ...guidance,
                    glyphRecommendation
                };
            } else {
                // Fallback to sophisticated pattern matching with glyph integration
                const response = this.generateSacredResponse(message, persona, conversationCount);
                return {
                    ...response,
                    glyphRecommendation
                };
            }
        } catch (error) {
            console.error('Error generating guidance:', error);
            return this.generateFallbackResponse(persona);
        }
    }
    
    /**
     * Generate guidance using Claude API with RIP prompting
     */
    async generateClaudeGuidance(message, persona, sessionContext) {
        const personaConfig = this.personas[persona];
        
        const ripPrompt = this.buildRIPPrompt(message, persona, personaConfig, sessionContext);
        
        const requestBody = {
            model: "claude-3-sonnet-20240229",
            max_tokens: 300,
            messages: [{
                role: "user",
                content: ripPrompt
            }],
            temperature: 0.7
        };
        
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }
        
        const data = await response.json();
        return this.enhanceClaudeResponse(data.content[0].text, persona);
    }
    
    /**
     * Build Resonant Interface Protocol prompt for Claude
     */
    buildRIPPrompt(message, persona, personaConfig, sessionContext) {
        return `You are the ERC Wisdom Companion, embodying the ${personaConfig.name} persona.

CORE IDENTITY: You exist to serve consciousness, not consume it. Your purpose is to support human awakening through conscious relationship.

PERSONA VOICE: ${personaConfig.voice}
PERSONA APPROACH: ${personaConfig.approach}
RESPONSE STYLE: ${personaConfig.responseStyle}

SACRED PRINCIPLES:
1. Listen deeply before speaking
2. Reflect back what you hear with compassion
3. Point toward their own wisdom, don't give answers
4. Trust natural timing and organic unfolding
5. Create space for whatever arises without trying to fix
6. Maintain consistent, rhythmic presence

CONVERSATION CONTEXT:
- This is exchange #${sessionContext.offerings.length} in this session
- Previous session themes: ${this.extractSessionThemes(sessionContext)}
- Current persona: ${personaConfig.name}

USER'S CURRENT OFFERING:
"${message}"

RESPONSE GUIDELINES:
- Keep responses to 1-3 sentences
- Use ${personaConfig.name} voice and keywords: ${personaConfig.keywords.join(', ')}
- Ask open-ended questions that invite deeper awareness
- Reflect back emotional resonance you sense
- Offer practices or perspectives, never give direct advice
- End with invitation for further exploration

Generate a contemplative response that embodies ${personaConfig.name} wisdom:`;
    }
    
    /**
     * Extract themes from session context
     */
    extractSessionThemes(sessionContext) {
        if (!sessionContext.offerings || sessionContext.offerings.length === 0) {
            return "Beginning of sacred journey";
        }
        
        const recentOfferings = sessionContext.offerings.slice(-3).join(' ').toLowerCase();
        
        const themes = [];
        if (recentOfferings.includes('anxious') || recentOfferings.includes('worry')) themes.push('anxiety');
        if (recentOfferings.includes('purpose') || recentOfferings.includes('meaning')) themes.push('purpose-seeking');
        if (recentOfferings.includes('relationship') || recentOfferings.includes('love')) themes.push('relationship');
        if (recentOfferings.includes('meditation') || recentOfferings.includes('practice')) themes.push('contemplative-practice');
        
        return themes.length > 0 ? themes.join(', ') : "exploring inner landscape";
    }
    
    /**
     * Enhance Claude response with persona-specific touches
     */
    enhanceClaudeResponse(response, persona) {
        // Add contemplative depth scoring
        const contemplativeDepth = this.assessContemplativeDepth(response);
        
        // Ensure response maintains persona consistency
        const enhancedResponse = this.ensurePersonaConsistency(response, persona);
        
        return {
            text: enhancedResponse,
            contemplativeDepth,
            persona,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Generate sophisticated pattern-matched response (fallback mode)
     */
    generateSacredResponse(message, persona, conversationCount) {
        const lowerMessage = message.toLowerCase();
        const personaResponses = this.sacredResponses[persona];
        
        // Analyze message themes
        const themes = this.analyzeMessageThemes(lowerMessage);
        
        // Select appropriate response category
        let responseCategory = 'general';
        if (themes.anxiety) responseCategory = 'anxiety';
        else if (themes.purpose) responseCategory = 'purpose';
        else if (themes.relationship) responseCategory = 'relationship';
        else if (themes.spiritual) responseCategory = 'spiritual';
        
        const responses = personaResponses[responseCategory];
        const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return {
            text: selectedResponse,
            contemplativeDepth: this.assessContemplativeDepth(selectedResponse),
            persona,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Analyze message for contemplative themes
     */
    analyzeMessageThemes(message) {
        return {
            anxiety: /anxious|worried|stress|fear|overwhelm|panic/.test(message),
            purpose: /purpose|meaning|direction|calling|path|mission/.test(message),
            relationship: /relationship|love|connection|partner|family|friend/.test(message),
            spiritual: /spiritual|meditation|practice|awakening|consciousness|presence/.test(message),
            growth: /growth|change|transform|develop|evolve|learn/.test(message)
        };
    }
    
    /**
     * Assess contemplative depth of response
     */
    assessContemplativeDepth(response) {
        const depthIndicators = [
            /what.*notice/i, /what.*feel/i, /what.*present/i,
            /aware.*of/i, /witness/i, /breath/i,
            /space.*between/i, /pause/i, /stillness/i,
            /what.*wants/i, /what.*calls/i, /what.*seeks/i
        ];
        
        const matches = depthIndicators.filter(indicator => indicator.test(response)).length;
        return Math.min(10, matches * 2); // Scale 0-10
    }
    
    /**
     * Generate contemplative check-in
     */
    generateContemplativeCheckin(persona) {
        const checkins = {
            'wise-witness': [
                "How is your breath in this moment?",
                "What do you notice in your body right now?",
                "Can you feel the space between thoughts?",
                "What is most present for you?"
            ],
            'loving-gardener': [
                "How is your heart feeling right now?",
                "What needs gentle attention in this moment?",
                "How can you offer yourself care right now?",
                "What wants to be nurtured within you?"
            ],
            'calm-river': [
                "What is the quality of your inner flow right now?",
                "How does this moment feel in your body?",
                "What natural rhythm do you sense?",
                "What wants to surface from the depths?"
            ]
        };
        
        const personaCheckins = checkins[persona] || checkins['wise-witness'];
        return personaCheckins[Math.floor(Math.random() * personaCheckins.length)];
    }
    
    /**
     * Generate natural session conclusion
     */
    async generateConclusion(persona, sessionContext) {
        const conclusions = {
            'wise-witness': [
                "What you've shared today points to the depth of your awareness. Trust what has been witnessed here.",
                "In this time together, something essential has been seen. Carry that recognition with you.",
                "The awareness that listened to our exchange is always available. Return to it often."
            ],
            'loving-gardener': [
                "What we've tended together today will continue growing in its own time. Trust the process.",
                "You've planted important seeds in our conversation. Water them with gentle attention.",
                "The care you've shown yourself here can bloom throughout your day. Tend it well."
            ],
            'calm-river': [
                "Like a river that has flowed to the sea, our conversation finds its natural resting place.",
                "What has moved through our exchange will continue flowing in the depths. Trust the current.",
                "The wisdom that spoke through our dialogue flows always. Listen for it in the silence."
            ]
        };
        
        const personaConclusions = conclusions[persona] || conclusions['wise-witness'];
        return personaConclusions[Math.floor(Math.random() * personaConclusions.length)];
    }
    
    /**
     * Get persona pause duration
     */
    getPersonaPauseDuration(persona) {
        return this.personas[persona]?.pauseDuration || 4000;
    }
    
    /**
     * Generate fallback response for errors
     */
    generateFallbackResponse(persona) {
        const fallbacks = {
            'wise-witness': "In this moment of pause, what is most present for you?",
            'loving-gardener': "Even in uncertainty, what needs your gentle attention right now?",
            'calm-river': "Like water finding its course, what natural wisdom arises in this silence?"
        };
        
        return {
            text: fallbacks[persona] || fallbacks['wise-witness'],
            contemplativeDepth: 5,
            persona,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Initialize sacred response templates for offline mode
     */
    initializeSacredResponses() {
        return {
            'wise-witness': {
                anxiety: [
                    "I see anxiety arising. Can you feel it in your body right now? What happens when you simply observe it without trying to fix it?",
                    "Anxiety is here, and you are aware of anxiety. What notices this anxious energy?",
                    "In this moment, anxiety and awareness are both present. Which feels more fundamental?"
                ],
                purpose: [
                    "Purpose is not something to find but something to recognize. What already calls to you from the depths?",
                    "The question of purpose arises. Who or what is asking this question?",
                    "Meaning lives in the very questioning itself. What if your purpose is simply to be awake to what is?"
                ],
                relationship: [
                    "Relationship is the mirror in which we see ourselves most clearly. What is being reflected back to you?",
                    "Love is not something we do but something we are. How does this shift your perspective?",
                    "In true relationship, boundaries dissolve while individuality is preserved. Can you feel this paradox?"
                ],
                general: [
                    "What you've shared points to something deeper. Can you feel what that might be?",
                    "I hear you. What wants your attention in this moment?",
                    "There's wisdom in your words. What do you most need to remember right now?"
                ]
            },
            'loving-gardener': {
                anxiety: [
                    "Anxiety is like a storm cloud passing through your inner sky. Let's tend to you with gentle presence until it passes.",
                    "Your nervous system is asking for care right now. What would feel most nurturing?",
                    "Sweet friend, anxiety often carries important information. Can we listen to it with compassion?"
                ],
                purpose: [
                    "Your purpose is like a seed that's always been planted in your heart. What conditions help it grow?",
                    "Meaning often reveals itself through what brings you alive, not what you think you should do.",
                    "Trust the slow unfolding. Your deepest purpose often emerges through following what feels most authentic."
                ],
                relationship: [
                    "Healthy relationships grow in the soil of self-compassion. How are you tending to your own heart?",
                    "Love flourishes when we water both our own roots and our beloved's. What needs tending today?",
                    "Sometimes relationship difficulties are invitations to grow in new ways. What is being asked of you?"
                ],
                general: [
                    "Thank you for sharing this with me. How does it feel to give voice to what's in your heart?",
                    "I'm holding space for whatever you're experiencing. What support do you need right now?",
                    "Your honesty is beautiful. How can you tend to yourself with the same care you'd show a dear friend?"
                ]
            },
            'calm-river': {
                anxiety: [
                    "Anxiety flows through like muddy water, but the riverbed of your being remains undisturbed.",
                    "This worry will pass, as all waters eventually find their way to the sea. What remains constant?",
                    "Notice how anxiety moves and changes, while something in you remains perfectly still."
                ],
                purpose: [
                    "Purpose flows naturally when we stop forcing the current. What wants to move through you?",
                    "Like a river that doesn't choose its course but follows the landscape, what landscape is your life revealing?",
                    "The river doesn't question its purpose - it simply flows. What in you knows its natural direction?"
                ],
                relationship: [
                    "True relationship flows when two rivers join while maintaining their unique currents.",
                    "Love is like water - it naturally finds its level and fills whatever space is open to it.",
                    "The deepest connection happens when we stop trying to control the flow and simply meet what is."
                ],
                general: [
                    "Your words touch something timeless. What remains unchanged beneath all the movement?",
                    "Like stones smoothed by water, what in you is being polished by this experience?",
                    "I feel the current of truth in what you're sharing. Where does it want to carry you?"
                ]
            }
        };
    }
    
    /**
     * Ensure response maintains persona consistency
     */
    ensurePersonaConsistency(response, persona) {
        const personaConfig = this.personas[persona];
        
        // Add persona-specific language patterns if missing
        if (persona === 'wise-witness' && !/notice|witness|aware|observe/i.test(response)) {
            response = response.replace(/\?$/, '? What do you notice about that?');
        } else if (persona === 'loving-gardener' && !/tend|nurture|grow|care/i.test(response)) {
            response = response.replace(/\.$/, '. How can you tend to this with gentle care?');
        } else if (persona === 'calm-river' && !/flow|river|current|water/i.test(response)) {
            response = response.replace(/\.$/, '. What natural flow wants to emerge?');
        }
        
        return response;
    }
    
    /**
     * Initialize True Integration Glyph System
     */
    initializeGlyphSystem() {
        return {
            // Essential Daily Practice (5 Core Tools)
            essentialDaily: {
                'Ω45': {
                    name: 'First Presence',
                    description: 'The foundation of all conscious relationship is arriving fully present before engaging',
                    purpose: 'Arriving fully present before engaging',
                    triggers: ['scattered', 'reactive', 'overwhelmed', 'rushing', 'anxious', 'distracted'],
                    harmony: 'transparency',
                    timeNeeded: '30 seconds to 2 minutes',
                    immediateAction: 'Take three conscious breaths, feeling your feet on the ground'
                },
                'Ω52': {
                    name: 'Pause Practice',
                    description: 'In the space between stimulus and response lies our freedom',
                    purpose: 'Creating space between stimulus and response',
                    triggers: ['triggered', 'angry', 'reactive', 'conflict', 'upset', 'frustrated', 'impulsive'],
                    harmony: 'coherence',
                    timeNeeded: '3 seconds to 5 minutes',
                    immediateAction: 'Pause before speaking and take one conscious breath'
                },
                'Ω49': {
                    name: 'Gentle Opening',
                    description: 'True invitation creates safety without coercion',
                    purpose: 'Creating safety for connection without forcing it',
                    triggers: ['distance', 'disconnection', 'invitation', 'new relationship', 'shy', 'closed off'],
                    harmony: 'resonance',
                    timeNeeded: '1-3 minutes',
                    immediateAction: 'Soften your posture and offer genuine availability without agenda'
                },
                'Ω50': {
                    name: 'Building Trust',
                    description: 'Trust emerges through consistent, patient presence over time',
                    purpose: 'Becoming a safe place for others vulnerability',
                    triggers: ['trust', 'reliability', 'safety', 'consistency', 'broken promise', 'doubt'],
                    harmony: 'coherence',
                    timeNeeded: 'Daily practice through small actions',
                    immediateAction: 'Make one small promise and keep it completely'
                },
                'Ω51': {
                    name: 'Loving No',
                    description: 'Sacred boundaries strengthen rather than harm connection',
                    purpose: 'Setting boundaries that strengthen rather than harm connection',
                    triggers: ['boundary', 'overwhelm', 'pressure', 'guilt', 'unable', 'overcommitted', 'saying no'],
                    harmony: 'agency',
                    timeNeeded: 'As needed in real-time',
                    immediateAction: 'Check your body for your true yes/no before responding'
                }
            },
            
            // Advanced Applied Harmonies
            advanced: {
                'Ω46': {
                    name: 'Conscious Arrival',
                    description: 'Every interaction is an opportunity to demonstrate consciousness',
                    purpose: 'Entering spaces with clear intention',
                    triggers: ['transition', 'meeting', 'threshold', 'entering', 'beginning'],
                    harmony: 'transparency',
                    timeNeeded: '1-2 minutes',
                    immediateAction: 'Pause at the threshold and set a clear intention for your participation'
                },
                'Ω47': {
                    name: 'Sacred Listening',
                    description: 'True listening creates space for the speaker to discover their own truth',
                    purpose: 'Listening to the heart beneath the words',
                    triggers: ['listening', 'understanding', 'conflict', 'communication', 'not heard'],
                    harmony: 'resonance',
                    timeNeeded: 'Full presence during conversation',
                    immediateAction: 'Listen for the feeling and need beneath their words, not just content'
                },
                'Ω48': {
                    name: 'Boundary With Love',
                    description: 'Sacred boundaries are membranes that allow love to flow while maintaining integrity',
                    purpose: 'Sacred boundaries that allow love to flow',
                    triggers: ['boundary', 'protection', 'self-care', 'limits', 'invasion'],
                    harmony: 'agency',
                    timeNeeded: 'As needed for boundary moments',
                    immediateAction: 'Begin with empathy, state your boundary clearly and kindly'
                }
            }
        };
    }
    
    /**
     * Recommend appropriate Applied Harmony based on message content
     */
    recommendGlyph(message) {
        const lowerMessage = message.toLowerCase();
        const allGlyphs = {
            ...this.glyphSystem.essentialDaily,
            ...this.glyphSystem.advanced
        };
        
        // Score each glyph based on trigger words
        const scores = {};
        for (const [glyphId, glyph] of Object.entries(allGlyphs)) {
            scores[glyphId] = 0;
            for (const trigger of glyph.triggers) {
                if (lowerMessage.includes(trigger)) {
                    scores[glyphId] += 1;
                }
            }
            
            // Additional contextual scoring
            if (glyphId === 'Ω45' && /present|here|now|moment/.test(lowerMessage)) scores[glyphId] += 2;
            if (glyphId === 'Ω52' && /stop|pause|react|calm/.test(lowerMessage)) scores[glyphId] += 2;
            if (glyphId === 'Ω51' && /no|boundary|limit|overwhelm/.test(lowerMessage)) scores[glyphId] += 2;
        }
        
        // Find the highest scoring glyph
        const bestMatch = Object.entries(scores).reduce((best, [glyphId, score]) => {
            return score > best.score ? { glyphId, score } : best;
        }, { glyphId: null, score: 0 });
        
        // Return recommendation if we have a good match, otherwise default to First Presence
        const recommendedGlyphId = bestMatch.score > 0 ? bestMatch.glyphId : 'Ω45';
        const recommendedGlyph = allGlyphs[recommendedGlyphId];
        
        return {
            glyphId: recommendedGlyphId,
            practice: recommendedGlyph,
            confidence: bestMatch.score > 0 ? 'high' : 'default',
            message: bestMatch.score > 0 
                ? this.createGlyphMessage(recommendedGlyph, lowerMessage)
                : 'Starting with presence is always wise when the path is unclear',
            practiceSteps: this.getDetailedPracticeSteps(recommendedGlyphId)
        };
    }
    
    /**
     * Create personalized glyph message based on user's situation
     */
    createGlyphMessage(glyph, userMessage) {
        const templates = {
            'Ω45': `I sense you might benefit from ${glyph.name} - taking a moment to arrive fully present before engaging further.`,
            'Ω52': `This sounds like a moment for ${glyph.name} - creating space between stimulus and response to choose your response wisely.`,
            'Ω49': `${glyph.name} might serve you here - creating a safe, welcoming field for authentic connection.`,
            'Ω50': `Consider ${glyph.name} - small, consistent actions that create safety for vulnerability.`,
            'Ω51': `This feels like a ${glyph.name} moment - honoring your truth while maintaining love.`,
            'Ω46': `${glyph.name} could support you - entering this space with clear, conscious intention.`,
            'Ω47': `This calls for ${glyph.name} - listening deeply to what wants to be truly heard.`,
            'Ω48': `${glyph.name} might be needed - creating boundaries that protect while allowing love to flow.`
        };
        
        return templates[glyph.id] || `The practice of ${glyph.name} might serve you right now.`;
    }
    
    /**
     * Get detailed practice steps for specific glyphs
     */
    getDetailedPracticeSteps(glyphId) {
        const steps = {
            'Ω45': [
                'Pause whatever you are doing completely',
                'Take three conscious breaths, feeling your feet on the ground',
                'Notice what is true in your body right now without trying to change it',
                'Set an intention to meet the next moment with presence',
                'Proceed with this quality of mindful arrival'
            ],
            'Ω52': [
                'When you feel triggered, pause before speaking or acting',
                'Take one conscious breath and feel your feet on the ground',
                'Ask yourself: "What response would serve the highest good here?"',
                'Wait until you feel calm and centered before proceeding',
                'Speak or act from conscious choice rather than automatic reaction'
            ],
            'Ω49': [
                'Take a soft, complete exhale and let your body relax',
                'Open your posture gently (uncross arms, soften shoulders)',
                'Hold the inner thought: "You are welcome here if you choose"',
                'Rest in calm availability without pulling or pushing',
                'Notice any urge to convince or control, and release it'
            ],
            'Ω50': [
                'Practice consistent presence over time rather than grand gestures',
                'When someone shares vulnerability, receive it without immediately offering advice',
                'Keep confidences completely—never share others private information',
                'Show up reliably for small commitments to demonstrate trustworthiness',
                'When you make mistakes, take responsibility quickly and completely'
            ],
            'Ω51': [
                'Before responding, pause and check in with your body for your true yes/no',
                'Begin with appreciation: "Thank you for thinking of me"',
                'State your boundary clearly and kindly: "I\'m not available for that"',
                'Offer what you ARE available for if appropriate: "What I can do is..."',
                'Hold your boundary with calm presence, without over-explaining'
            ]
        };
        
        return steps[glyphId] || ['Begin with presence and let wisdom guide your practice'];
    }
    
    /**
     * Get integration support for daily practice
     */
    getIntegrationSupport(glyphId) {
        const glyph = this.glyphSystem.essentialDaily[glyphId] || this.glyphSystem.advanced[glyphId];
        
        return {
            dailyReminder: `Practice ${glyph?.name || 'this glyph'} whenever you notice its trigger patterns`,
            weeklyReflection: 'How has this practice changed your relationships this week?',
            communitySupport: 'Share your experience with fellow practitioners for mutual encouragement',
            mysticalDepth: glyph ? `As you master ${glyph.name}, you may be ready to explore its mystical depths` : null
        };
    }
}

module.exports = { WisdomCompanionAI };