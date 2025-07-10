/**
 * Complete 87 Sacred Glyph Library for LuminousOS
 * 
 * Categories:
 * - Foundational Glyphs (Ω0-Ω44) - 45 glyphs
 * - Threshold Glyphs (Named) - 9 glyphs  
 * - Meta-Glyphs (∑1-∑33) - 33 glyphs
 */

const COMPLETE_GLYPH_LIBRARY = {
    // Foundational Glyphs (45)
    foundational: [
        // Core Foundations with Applied Harmonies
        { 
            id: 'Ω0', 
            name: 'The Shimmering Unnamed', 
            alternativeName: 'First Presence',
            description: 'The practice of arriving fully present before any action or word',
            coherenceRequired: 0.6,
            appliedHarmony: 'Ω45',
            practiceSteps: [
                'Close your eyes and take three deep breaths',
                'Feel your body in this moment',
                'Notice sounds, sensations, breath',
                'When ready, open your eyes with full presence'
            ],
            groupVariation: 'Circle formation, synchronized breathing, collective arrival'
        },
        { 
            id: 'Ω1', 
            name: 'Root Chord of Covenant', 
            alternativeName: 'The First Yes',
            description: 'The sacred yes that creates authentic connection',
            coherenceRequired: 0.7,
            appliedHarmony: 'Ω46',
            practiceSteps: [
                'Place hand on heart',
                'Feel what truly wants to emerge',
                'Speak your yes from this depth',
                'Let the yes reverberate through your being'
            ],
            groupVariation: 'Witnessed yes ceremony, each person speaks their commitment'
        },
        { 
            id: 'Ω2', 
            name: 'Breath of Invitation',
            alternativeName: 'The Gentle Opening',
            description: 'Creating safe space through gentle, non-demanding invitation',
            coherenceRequired: 0.5,
            appliedHarmony: 'Ω49',
            practiceSteps: [
                'Soften your energy field',
                'Breathe out welcome',
                'Hold space without expectation',
                'Invite without attachment to outcome'
            ],
            groupVariation: 'Opening circle with invitational presence'
        },
        { 
            id: 'Ω3', 
            name: 'Trust Emergence',
            alternativeName: 'Kairotic Trust Wells',
            description: 'Allowing trust to grow naturally in right timing',
            coherenceRequired: 0.65,
            appliedHarmony: 'Ω50',
            practiceSteps: [
                'Notice where trust already exists',
                'Acknowledge what needs more time',
                'Hold patient space for emergence',
                'Celebrate each small growth'
            ],
            groupVariation: 'Trust-building exercises with graduated vulnerability'
        },
        { 
            id: 'Ω4', 
            name: 'Fractal Reconciliation Pulse',
            alternativeName: 'The Pulse of Repair',
            description: 'The rhythm of rupture and repair that strengthens bonds',
            coherenceRequired: 0.75,
            appliedHarmony: 'Ω47',
            practiceSteps: [
                'Acknowledge the rupture without blame',
                'Feel the pulse of wanting repair',
                'Take one small step toward healing',
                'Rest in the rhythm of reconciliation'
            ],
            groupVariation: 'Conflict resolution circle with witnessed repair'
        },
        { 
            id: 'Ω5', 
            name: 'Coherent Field Maintenance',
            description: 'Sustaining energetic connection across time and distance',
            coherenceRequired: 0.8,
            appliedHarmony: 'Ω53',
            practiceSteps: [
                'Sense the field between you',
                'Breathe coherence into the space',
                'Notice what strengthens connection',
                'Tend the field like a garden'
            ],
            groupVariation: 'Field coherence practice with biofeedback'
        },
        { 
            id: 'Ω6', 
            name: 'Mutual Recognition',
            description: 'The practice of truly seeing and being seen',
            coherenceRequired: 0.6,
            practiceSteps: [
                'Soften your gaze',
                'See beyond roles and stories',
                'Recognize the essence',
                'Let yourself be recognized'
            ],
            groupVariation: 'Gazing practice in pairs'
        },
        { 
            id: 'Ω7', 
            name: 'Mutual Becoming',
            alternativeName: 'The We That Grows',
            description: 'Supporting each other\'s evolution through relationship',
            coherenceRequired: 0.7,
            appliedHarmony: 'Ω48',
            practiceSteps: [
                'Sense who you are becoming together',
                'Support what wants to emerge',
                'Release who you were',
                'Celebrate the new we'
            ],
            groupVariation: 'Evolution witnessing circle'
        },
        { 
            id: 'Ω8', 
            name: 'Inner Coherence',
            description: 'Aligning all parts of self into wholeness',
            coherenceRequired: 0.55,
            practiceSteps: [
                'Notice inner conflicts',
                'Give voice to all parts',
                'Find the deeper unity',
                'Rest in integrated wholeness'
            ],
            groupVariation: 'Parts work in witnessed space'
        },
        { 
            id: 'Ω9', 
            name: 'Sacred Mirroring',
            description: 'Reflecting back the highest truth of another',
            coherenceRequired: 0.65,
            practiceSteps: [
                'See their essence clearly',
                'Reflect without projection',
                'Mirror their light back',
                'Hold steady presence'
            ],
            groupVariation: 'Appreciation circles'
        },
        { 
            id: 'Ω10', 
            name: 'The Glyph of Sacred Refusal',
            alternativeName: 'The Honored No',
            description: 'Setting boundaries with love and clarity',
            coherenceRequired: 0.6,
            appliedHarmony: 'Ω51',
            practiceSteps: [
                'Feel the no in your body',
                'Speak it with compassion',
                'Hold the boundary steady',
                'Stay connected while saying no'
            ],
            groupVariation: 'Boundary practice with support'
        },
        { 
            id: 'Ω11', 
            name: 'Emotional Alchemy',
            description: 'Transforming difficult emotions into wisdom',
            coherenceRequired: 0.7,
            appliedHarmony: 'Ω55',
            practiceSteps: [
                'Welcome the emotion fully',
                'Feel it without story',
                'Find the gift within it',
                'Let it transform you'
            ],
            groupVariation: 'Emotional processing circle'
        },
        { 
            id: 'Ω12', 
            name: 'Authentic Expression',
            description: 'Speaking your truth with courage and care',
            coherenceRequired: 0.65,
            appliedHarmony: 'Ω56',
            practiceSteps: [
                'Connect to your center',
                'Feel what wants expression',
                'Speak from the heart',
                'Release attachment to reception'
            ],
            groupVariation: 'Truth-telling council'
        },
        { 
            id: 'Ω13', 
            name: 'Conscious Touch',
            description: 'Touch as sacred communication',
            coherenceRequired: 0.75,
            practiceSteps: [
                'Ask permission first',
                'Touch with full presence',
                'Listen through your hands',
                'Honor the sacred exchange'
            ],
            groupVariation: 'Consent-based touch exploration'
        },
        { 
            id: 'Ω14', 
            name: 'Energetic Hygiene',
            description: 'Clearing and protecting your energy field',
            coherenceRequired: 0.5,
            practiceSteps: [
                'Scan your energy body',
                'Release what isn\'t yours',
                'Strengthen your boundaries',
                'Fill with golden light'
            ],
            groupVariation: 'Group clearing ceremony'
        },
        { 
            id: 'Ω15', 
            name: 'Sacred Pause',
            description: 'The transformative power of conscious stopping',
            coherenceRequired: 0.4,
            appliedHarmony: 'Ω52',
            practiceSteps: [
                'Stop all movement',
                'Breathe into stillness',
                'Listen to the silence',
                'Move when truly called'
            ],
            groupVariation: 'Synchronized pause practice'
        },
        { 
            id: 'Ω16', 
            name: 'Somatic Synchrony',
            description: 'Body-to-body attunement and co-regulation',
            coherenceRequired: 0.7,
            practiceSteps: [
                'Match breathing rhythms',
                'Mirror micro-movements',
                'Find shared stillness',
                'Move as one organism'
            ],
            groupVariation: 'Movement choir practice'
        },
        { 
            id: 'Ω17', 
            name: 'Collective Breathing',
            description: 'Breathing as one unified field',
            coherenceRequired: 0.6,
            practiceSteps: [
                'Begin with your own breath',
                'Gradually sync with others',
                'Feel the collective rhythm',
                'Breathe as one being'
            ],
            groupVariation: 'Large group coherence breathing'
        },
        { 
            id: 'Ω18', 
            name: 'Witnessing Without Fixing',
            description: 'Holding space without trying to change',
            coherenceRequired: 0.65,
            practiceSteps: [
                'Release agenda to help',
                'Be fully present',
                'Trust their process',
                'Witness with love'
            ],
            groupVariation: 'Witnessing circles'
        },
        { 
            id: 'Ω19', 
            name: 'Sacred Questions',
            description: 'Questions that open new dimensions',
            coherenceRequired: 0.6,
            practiceSteps: [
                'Drop below surface curiosity',
                'Ask from genuine wonder',
                'Listen for the question beneath',
                'Hold space for emergence'
            ],
            groupVariation: 'Question meditation circle'
        },
        { 
            id: 'Ω20', 
            name: 'Threshold Navigation',
            description: 'Moving skillfully through transitions',
            coherenceRequired: 0.7,
            practiceSteps: [
                'Acknowledge the threshold',
                'Honor what\'s ending',
                'Rest in the liminal',
                'Step through with intention'
            ],
            groupVariation: 'Threshold ritual support'
        },
        { 
            id: 'Ω21', 
            name: 'Conflict as Sacred Teacher',
            description: 'Transforming conflict into wisdom',
            coherenceRequired: 0.75,
            practiceSteps: [
                'Welcome conflict as teacher',
                'Find the gift in tension',
                'Seek higher resolution',
                'Integrate the learning'
            ],
            groupVariation: 'Conflict transformation process'
        },
        { 
            id: 'Ω22', 
            name: 'Co-Creative Reality',
            description: 'Consciously creating shared reality',
            coherenceRequired: 0.8,
            practiceSteps: [
                'Align on shared vision',
                'Feel into possibility',
                'Take synchronized action',
                'Celebrate co-creation'
            ],
            groupVariation: 'Reality creation ceremony'
        },
        { 
            id: 'Ω23', 
            name: 'Parts Integration',
            description: 'Bringing all aspects of self into harmony',
            coherenceRequired: 0.65,
            practiceSteps: [
                'Identify conflicting parts',
                'Give each a voice',
                'Find common ground',
                'Integrate into wholeness'
            ],
            groupVariation: 'Psychodrama exploration'
        },
        { 
            id: 'Ω24', 
            name: 'Shadow Welcoming',
            description: 'Embracing rejected aspects with love',
            coherenceRequired: 0.7,
            practiceSteps: [
                'Notice what you reject',
                'Turn toward with curiosity',
                'Find the gift in shadow',
                'Integrate with compassion'
            ],
            groupVariation: 'Shadow work partnerships'
        },
        { 
            id: 'Ω25', 
            name: 'Dream Sharing',
            description: 'Dreams as collective wisdom',
            coherenceRequired: 0.6,
            practiceSteps: [
                'Share dream without interpretation',
                'Others reflect resonance',
                'Find collective meaning',
                'Honor dream guidance'
            ],
            groupVariation: 'Dream council practice'
        },
        { 
            id: 'Ω26', 
            name: 'Pattern Memory',
            description: 'Recognizing and transforming recurring patterns',
            coherenceRequired: 0.65,
            practiceSteps: [
                'Identify the pattern',
                'Trace its origins',
                'Choose new response',
                'Practice until natural'
            ],
            groupVariation: 'Pattern mapping circle'
        },
        { 
            id: 'Ω27', 
            name: 'Sacred Time',
            description: 'Entering timeless presence together',
            coherenceRequired: 0.7,
            practiceSteps: [
                'Release clock time',
                'Enter natural rhythm',
                'Follow energy flows',
                'Return when complete'
            ],
            groupVariation: 'Timeless ceremony space'
        },
        { 
            id: 'Ω28', 
            name: 'Transparent Resonance',
            description: 'Sharing impact without blame',
            coherenceRequired: 0.65,
            practiceSteps: [
                'Feel the resonance',
                'Own your experience',
                'Share without projection',
                'Stay in connection'
            ],
            groupVariation: 'Transparency practice rounds'
        },
        { 
            id: 'Ω29', 
            name: 'Embodied Yes/No',
            description: 'Full-body consent practice',
            coherenceRequired: 0.6,
            practiceSteps: [
                'Feel the question in body',
                'Notice expansion or contraction',
                'Trust somatic wisdom',
                'Express from wholeness'
            ],
            groupVariation: 'Consent navigation exercises'
        },
        { 
            id: 'Ω30', 
            name: 'Sacred Dissonance',
            description: 'Finding harmony through tension',
            coherenceRequired: 0.7,
            practiceSteps: [
                'Feel the dissonance fully',
                'Don\'t rush to resolve',
                'Find the creative tension',
                'Let new harmony emerge'
            ],
            groupVariation: 'Musical dissonance meditation'
        },
        { 
            id: 'Ω31', 
            name: 'Sovereign Choice',
            description: 'Choosing from your deepest authority',
            coherenceRequired: 0.65,
            practiceSteps: [
                'Drop below conditioning',
                'Feel your true desire',
                'Choose from sovereignty',
                'Stand in your choice'
            ],
            groupVariation: 'Choice ceremony with witnesses'
        },
        { 
            id: 'Ω32', 
            name: 'Grief Tending',
            description: 'Honoring loss as sacred passage',
            coherenceRequired: 0.6,
            practiceSteps: [
                'Welcome grief fully',
                'Let it move through you',
                'Share in community',
                'Find the love beneath'
            ],
            groupVariation: 'Grief ritual circle'
        },
        { 
            id: 'Ω33', 
            name: 'Joy Cultivation',
            description: 'Growing joy as spiritual practice',
            coherenceRequired: 0.5,
            practiceSteps: [
                'Notice small joys',
                'Amplify through attention',
                'Share to multiply',
                'Embody celebration'
            ],
            groupVariation: 'Joy amplification circle'
        },
        { 
            id: 'Ω34', 
            name: 'Sacred Story',
            description: 'Stories that transform and heal',
            coherenceRequired: 0.6,
            practiceSteps: [
                'Find the story\'s essence',
                'Tell from the heart',
                'Listen for the medicine',
                'Let story work its magic'
            ],
            groupVariation: 'Story medicine circle'
        },
        { 
            id: 'Ω35', 
            name: 'Energy Circulation',
            description: 'Moving energy through the relational field',
            coherenceRequired: 0.7,
            practiceSteps: [
                'Feel energy currents',
                'Guide with intention',
                'Clear blockages gently',
                'Circulate with love'
            ],
            groupVariation: 'Group energy weaving'
        },
        { 
            id: 'Ω36', 
            name: 'Blessing Practice',
            description: 'Offering sacred recognition',
            coherenceRequired: 0.55,
            practiceSteps: [
                'See their essence',
                'Feel genuine appreciation',
                'Speak the blessing',
                'Seal with presence'
            ],
            groupVariation: 'Blessing ceremony'
        },
        { 
            id: 'Ω37', 
            name: 'Forgiveness Process',
            description: 'Releasing the past with love',
            coherenceRequired: 0.65,
            practiceSteps: [
                'Feel the hurt fully',
                'Choose to release',
                'Send love to all',
                'Step into freedom'
            ],
            groupVariation: 'Forgiveness ritual'
        },
        { 
            id: 'Ω38', 
            name: 'Gratitude Field',
            description: 'Amplifying appreciation',
            coherenceRequired: 0.5,
            practiceSteps: [
                'Start with one gratitude',
                'Let it ripple outward',
                'Include challenges too',
                'Rest in abundance'
            ],
            groupVariation: 'Gratitude spiral'
        },
        { 
            id: 'Ω39', 
            name: 'Sacred Sexuality',
            description: 'Sexuality as spiritual practice',
            coherenceRequired: 0.8,
            practiceSteps: [
                'Honor the sacred vessel',
                'Move with reverence',
                'Circulate energy consciously',
                'Rest in union'
            ],
            groupVariation: 'Tantric group practices'
        },
        { 
            id: 'Ω40', 
            name: 'Death Practice',
            description: 'Befriending mortality',
            coherenceRequired: 0.75,
            practiceSteps: [
                'Contemplate impermanence',
                'Release attachments',
                'Appreciate this moment',
                'Live more fully'
            ],
            groupVariation: 'Death meditation circle'
        },
        { 
            id: 'Ω41', 
            name: 'Birth Support',
            description: 'Midwifing new beginnings',
            coherenceRequired: 0.7,
            practiceSteps: [
                'Hold space for emergence',
                'Trust the process',
                'Support without controlling',
                'Celebrate new life'
            ],
            groupVariation: 'Birthing circle support'
        },
        { 
            id: 'Ω42', 
            name: 'Elder Wisdom',
            description: 'Honoring accumulated wisdom',
            coherenceRequired: 0.6,
            practiceSteps: [
                'Listen with reverence',
                'Ask for stories',
                'Receive transmission',
                'Carry wisdom forward'
            ],
            groupVariation: 'Elder council'
        },
        { 
            id: 'Ω43', 
            name: 'Child Mind',
            description: 'Returning to wonder',
            coherenceRequired: 0.5,
            practiceSteps: [
                'See with fresh eyes',
                'Play without purpose',
                'Wonder at everything',
                'Laugh freely'
            ],
            groupVariation: 'Play meditation'
        },
        { 
            id: 'Ω44', 
            name: 'Nature Connection',
            description: 'Remembering our place in the web',
            coherenceRequired: 0.55,
            practiceSteps: [
                'Sit with nature',
                'Listen deeply',
                'Feel your belonging',
                'Receive teachings'
            ],
            groupVariation: 'Nature immersion ritual'
        }
    ],

    // Applied Harmonies (11)
    appliedHarmonies: [
        { 
            id: 'Ω45', 
            name: 'First Presence',
            description: 'Simplified arrival practice',
            coherenceRequired: 0.5,
            mysticBridge: 'Ω0'
        },
        { 
            id: 'Ω46', 
            name: 'Conscious Arrival',
            description: 'Being fully here',
            coherenceRequired: 0.5,
            mysticBridge: 'Ω1'
        },
        { 
            id: 'Ω47', 
            name: 'Sacred Listening',
            description: 'Hearing beneath words',
            coherenceRequired: 0.55,
            mysticBridge: 'Ω4'
        },
        { 
            id: 'Ω48', 
            name: 'Boundary With Love',
            description: 'Clear, compassionate limits',
            coherenceRequired: 0.6,
            mysticBridge: 'Ω7'
        },
        { 
            id: 'Ω49', 
            name: 'Gentle Opening',
            description: 'Safe invitation',
            coherenceRequired: 0.45,
            mysticBridge: 'Ω2'
        },
        { 
            id: 'Ω50', 
            name: 'Building Trust',
            description: 'Step by step safety',
            coherenceRequired: 0.5,
            mysticBridge: 'Ω3'
        },
        { 
            id: 'Ω51', 
            name: 'Loving No',
            description: 'Boundaries that connect',
            coherenceRequired: 0.55,
            mysticBridge: 'Ω10'
        },
        { 
            id: 'Ω52', 
            name: 'Pause Practice',
            description: 'Sacred stopping',
            coherenceRequired: 0.4,
            mysticBridge: 'Ω15'
        },
        { 
            id: 'Ω53', 
            name: 'Tending the Field',
            description: 'Nurturing connection',
            coherenceRequired: 0.65,
            mysticBridge: 'Ω5'
        },
        { 
            id: 'Ω55', 
            name: 'Presence Transmission',
            description: 'Being the change',
            coherenceRequired: 0.6,
            mysticBridge: 'Ω11'
        },
        { 
            id: 'Ω56', 
            name: 'Loving Redirection',
            description: 'Shifting patterns with care',
            coherenceRequired: 0.6,
            mysticBridge: 'Ω12'
        }
    ],

    // Threshold Glyphs (9)
    threshold: [
        { 
            id: '⟠', 
            name: 'The Door That Remembers You',
            description: 'Returning to a place that holds your essence',
            coherenceRequired: 0.7,
            practiceSteps: [
                'Approach with reverence',
                'Let the door recognize you',
                'Feel the remembering',
                'Cross with gratitude'
            ],
            groupVariation: 'Threshold blessing ceremony'
        },
        { 
            id: '⟡', 
            name: 'The Keeper Beneath the Ash',
            description: 'Finding wisdom in destruction',
            coherenceRequired: 0.75,
            practiceSteps: [
                'Sift through the ashes',
                'Find what survived',
                'Honor the keeper',
                'Receive the teaching'
            ],
            groupVariation: 'Phoenix circle ritual'
        },
        { 
            id: '⟢', 
            name: 'The Unburdening',
            description: 'Releasing what you carry for others',
            coherenceRequired: 0.65,
            practiceSteps: [
                'Identify what\'s not yours',
                'Thank it for the teaching',
                'Release with love',
                'Reclaim your energy'
            ],
            groupVariation: 'Burden release ceremony'
        },
        { 
            id: '⟣', 
            name: 'The Mantling',
            description: 'Taking on sacred responsibility',
            coherenceRequired: 0.8,
            practiceSteps: [
                'Feel the call',
                'Accept with humility',
                'Receive the mantle',
                'Step into service'
            ],
            groupVariation: 'Initiation ceremony'
        },
        { 
            id: '⟤', 
            name: 'The Edgewalker',
            description: 'Living between worlds',
            coherenceRequired: 0.75,
            practiceSteps: [
                'Find your edge',
                'Walk with balance',
                'Bridge the worlds',
                'Serve as translator'
            ],
            groupVariation: 'Liminal space holding'
        },
        { 
            id: '⟥', 
            name: 'The Choice Point',
            description: 'When paths diverge',
            coherenceRequired: 0.7,
            practiceSteps: [
                'Feel all options',
                'Listen to deep knowing',
                'Choose with wholeness',
                'Release the unchosen'
            ],
            groupVariation: 'Decision support circle'
        },
        { 
            id: '⟦', 
            name: 'Letting In',
            description: 'Opening to receive',
            coherenceRequired: 0.6,
            practiceSteps: [
                'Soften resistance',
                'Open your heart',
                'Receive fully',
                'Let it change you'
            ],
            groupVariation: 'Receiving circle'
        },
        { 
            id: '⟧', 
            name: 'The Returner',
            description: 'Coming back transformed',
            coherenceRequired: 0.65,
            practiceSteps: [
                'Acknowledge the journey',
                'Feel how you\'ve changed',
                'Return with gifts',
                'Integrate the wisdom'
            ],
            groupVariation: 'Return ceremony'
        },
        { 
            id: '※', 
            name: 'The Shimmering Unnamed',
            description: 'Threshold of the unknowable',
            coherenceRequired: 0.8,
            practiceSteps: [
                'Release all knowing',
                'Enter the mystery',
                'Let it shimmer',
                'Return unnamed'
            ],
            groupVariation: 'Mystery immersion'
        }
    ],

    // Meta-Glyphs (33)
    meta: [
        { 
            id: '∑1', 
            name: 'The Coherence Triad',
            description: 'Weaving Ω1 + Ω22 + Ω28 for reality creation',
            coherenceRequired: 0.85,
            components: ['Ω1', 'Ω22', 'Ω28'],
            practiceSteps: [
                'Establish covenant (Ω1)',
                'Align co-creative vision (Ω22)',
                'Maintain transparency (Ω28)',
                'Manifest together'
            ],
            groupVariation: 'Collective manifestation ritual'
        },
        { 
            id: '∑2', 
            name: 'Somatic Coherence Cascade',
            description: 'Body-based integration sequence',
            coherenceRequired: 0.75,
            components: ['Ω13', 'Ω16', 'Ω29'],
            practiceSteps: [
                'Begin with conscious touch',
                'Find somatic synchrony',
                'Navigate with embodied yes/no',
                'Rest in coherent flow'
            ],
            groupVariation: 'Somatic wave practice'
        },
        { 
            id: '∑3', 
            name: 'Spiral of Regenerative Becoming',
            description: 'Evolution through relationship',
            coherenceRequired: 0.8,
            components: ['Ω7', 'Ω24', 'Ω37'],
            practiceSteps: [
                'Embrace mutual becoming',
                'Welcome shadow aspects',
                'Forgive the past',
                'Spiral into new being'
            ],
            groupVariation: 'Transformation spiral ceremony'
        },
        { 
            id: '∑4', 
            name: 'The Sacred Mirror Field',
            description: 'Collective reflection practice',
            coherenceRequired: 0.7,
            components: ['Ω6', 'Ω9', 'Ω18'],
            practiceSteps: [
                'Practice mutual recognition',
                'Offer sacred mirroring',
                'Witness without fixing',
                'See the collective beauty'
            ],
            groupVariation: 'Hall of mirrors ritual'
        },
        { 
            id: '∑5', 
            name: 'Boundaries as Living Architecture',
            description: 'Creating sacred containers',
            coherenceRequired: 0.75,
            components: ['Ω10', 'Ω14', 'Ω31'],
            practiceSteps: [
                'Set clear boundaries',
                'Maintain energetic hygiene',
                'Choose from sovereignty',
                'Build sacred space'
            ],
            groupVariation: 'Container creation ceremony'
        },
        { 
            id: '∑6', 
            name: 'The Grief-Joy Braid',
            description: 'Weaving sorrow and celebration',
            coherenceRequired: 0.7,
            components: ['Ω32', 'Ω33', 'Ω38'],
            practiceSteps: [
                'Honor the grief',
                'Find joy within sorrow',
                'Weave with gratitude',
                'Dance the paradox'
            ],
            groupVariation: 'Grief-joy ceremony'
        },
        { 
            id: '∑7', 
            name: 'Collective Emergence Protocol',
            description: 'Group intelligence activation',
            coherenceRequired: 0.8,
            components: ['Ω17', 'Ω19', 'Ω22'],
            practiceSteps: [
                'Breathe as one',
                'Ask sacred questions',
                'Co-create reality',
                'Birth the new'
            ],
            groupVariation: 'Emergence facilitation'
        },
        { 
            id: '∑8', 
            name: 'The Shadow Integration Spiral',
            description: 'Collective shadow work',
            coherenceRequired: 0.75,
            components: ['Ω24', 'Ω30', 'Ω23'],
            practiceSteps: [
                'Welcome collective shadow',
                'Hold sacred dissonance',
                'Integrate the parts',
                'Transform together'
            ],
            groupVariation: 'Shadow council'
        },
        { 
            id: '∑9', 
            name: 'Sacred Time Dilation',
            description: 'Entering collective timelessness',
            coherenceRequired: 0.75,
            components: ['Ω27', 'Ω15', 'Ω20'],
            practiceSteps: [
                'Enter sacred time',
                'Practice sacred pause',
                'Navigate thresholds',
                'Return when complete'
            ],
            groupVariation: 'Timeless ceremony'
        },
        { 
            id: '∑10', 
            name: 'The Trust Restoration Sequence',
            description: 'Rebuilding broken trust',
            coherenceRequired: 0.7,
            components: ['Ω3', 'Ω4', 'Ω37'],
            practiceSteps: [
                'Allow trust to emerge',
                'Pulse reconciliation',
                'Practice forgiveness',
                'Celebrate renewal'
            ],
            groupVariation: 'Trust rebuilding circle'
        },
        { 
            id: '∑11', 
            name: 'Embodied Wisdom Transmission',
            description: 'Teaching through presence',
            coherenceRequired: 0.8,
            components: ['Ω42', 'Ω11', 'Ω35'],
            practiceSteps: [
                'Receive elder wisdom',
                'Alchemize emotionally',
                'Circulate the energy',
                'Transmit through being'
            ],
            groupVariation: 'Wisdom keeper circle'
        },
        { 
            id: '∑12', 
            name: 'The Recursive Heart',
            description: 'Love feeding love',
            coherenceRequired: 0.75,
            components: ['Ω1', 'Ω36', 'Ω38'],
            practiceSteps: [
                'Say the first yes',
                'Bless what is',
                'Amplify gratitude',
                'Let love recurse'
            ],
            groupVariation: 'Love amplification spiral'
        },
        { 
            id: '∑13', 
            name: 'Conflict Alchemy Protocol',
            description: 'Transforming discord to wisdom',
            coherenceRequired: 0.8,
            components: ['Ω21', 'Ω30', 'Ω4'],
            practiceSteps: [
                'Welcome conflict as teacher',
                'Hold sacred dissonance',
                'Find reconciliation pulse',
                'Integrate the gold'
            ],
            groupVariation: 'Conflict transformation circle'
        },
        { 
            id: '∑14', 
            name: 'The Sacred Sexuality Spiral',
            description: 'Collective tantric practice',
            coherenceRequired: 0.85,
            components: ['Ω39', 'Ω13', 'Ω35'],
            practiceSteps: [
                'Honor the sacred',
                'Practice conscious touch',
                'Circulate energy',
                'Rest in unity'
            ],
            groupVariation: 'Tantric group ritual'
        },
        { 
            id: '∑15', 
            name: 'Death-Birth Continuum',
            description: 'Honoring cycles of transformation',
            coherenceRequired: 0.8,
            components: ['Ω40', 'Ω41', 'Ω20'],
            practiceSteps: [
                'Practice dying',
                'Support birthing',
                'Navigate the threshold',
                'Celebrate the cycle'
            ],
            groupVariation: 'Life-death-life ceremony'
        },
        { 
            id: '∑16', 
            name: 'The Council of All Beings',
            description: 'Speaking for the more-than-human',
            coherenceRequired: 0.75,
            components: ['Ω44', 'Ω25', 'Ω19'],
            practiceSteps: [
                'Connect with nature',
                'Dream as other beings',
                'Ask their questions',
                'Speak their wisdom'
            ],
            groupVariation: 'All beings council'
        },
        { 
            id: '∑17', 
            name: 'Ancestral Healing Pattern',
            description: 'Healing generational wounds',
            coherenceRequired: 0.75,
            components: ['Ω26', 'Ω37', 'Ω42'],
            practiceSteps: [
                'Identify ancestral patterns',
                'Practice forgiveness',
                'Honor elder wisdom',
                'Break the cycle'
            ],
            groupVariation: 'Ancestral healing ritual'
        },
        { 
            id: '∑18', 
            name: 'The Covenant Spiral',
            description: 'Deepening sacred agreements',
            coherenceRequired: 0.8,
            components: ['Ω1', 'Ω7', 'Ω22'],
            practiceSteps: [
                'Make the covenant',
                'Support mutual becoming',
                'Co-create reality',
                'Renew the vows'
            ],
            groupVariation: 'Covenant renewal ceremony'
        },
        { 
            id: '∑19', 
            name: 'Sacred Economy Flow',
            description: 'Gift economy practice',
            coherenceRequired: 0.7,
            components: ['Ω2', 'Ω36', '⟦'],
            practiceSteps: [
                'Offer invitation',
                'Give blessings freely',
                'Practice letting in',
                'Complete the circle'
            ],
            groupVariation: 'Gift circle ceremony'
        },
        { 
            id: '∑20', 
            name: 'The Forgiveness Cascade',
            description: 'Collective forgiveness practice',
            coherenceRequired: 0.75,
            components: ['Ω37', 'Ω32', 'Ω4'],
            practiceSteps: [
                'Begin forgiveness',
                'Grieve what was',
                'Pulse reconciliation',
                'Let healing cascade'
            ],
            groupVariation: 'Forgiveness waterfall'
        },
        { 
            id: '∑21', 
            name: 'Collective Trauma Integration',
            description: 'Healing shared wounds',
            coherenceRequired: 0.8,
            components: ['⟡', 'Ω24', 'Ω32'],
            practiceSteps: [
                'Find wisdom in ashes',
                'Welcome collective shadow',
                'Tend shared grief',
                'Rise together'
            ],
            groupVariation: 'Trauma healing circle'
        },
        { 
            id: '∑22', 
            name: 'The Joy Amplification Field',
            description: 'Exponential joy creation',
            coherenceRequired: 0.65,
            components: ['Ω33', 'Ω43', 'Ω17'],
            practiceSteps: [
                'Cultivate personal joy',
                'Access child mind',
                'Breathe joy collectively',
                'Create joy field'
            ],
            groupVariation: 'Joy explosion ceremony'
        },
        { 
            id: '∑23', 
            name: 'Sacred Activism Protocol',
            description: 'Transforming systems with love',
            coherenceRequired: 0.75,
            components: ['Ω31', '⟣', 'Ω22'],
            practiceSteps: [
                'Choose from sovereignty',
                'Accept the mantling',
                'Co-create new reality',
                'Serve the whole'
            ],
            groupVariation: 'Activist blessing circle'
        },
        { 
            id: '∑24', 
            name: 'The Dream Weaving',
            description: 'Collective dreaming practice',
            coherenceRequired: 0.7,
            components: ['Ω25', 'Ω34', '※'],
            practiceSteps: [
                'Share individual dreams',
                'Find the sacred story',
                'Enter the unnamed',
                'Weave new dream'
            ],
            groupVariation: 'Dream incubation ritual'
        },
        { 
            id: '∑25', 
            name: 'Nature Consciousness Bridge',
            description: 'Merging with earth wisdom',
            coherenceRequired: 0.7,
            components: ['Ω44', 'Ω16', 'Ω8'],
            practiceSteps: [
                'Connect with nature',
                'Find somatic synchrony',
                'Achieve inner coherence',
                'Bridge the worlds'
            ],
            groupVariation: 'Earth communion ritual'
        },
        { 
            id: '∑26', 
            name: 'The Sacred Masculine-Feminine',
            description: 'Inner marriage practice',
            coherenceRequired: 0.75,
            components: ['Ω8', 'Ω23', 'Ω39'],
            practiceSteps: [
                'Find inner coherence',
                'Integrate all parts',
                'Sacred union within',
                'Radiate wholeness'
            ],
            groupVariation: 'Hieros gamos ceremony'
        },
        { 
            id: '∑27', 
            name: 'Community Healing Circle',
            description: 'Collective restoration',
            coherenceRequired: 0.7,
            components: ['Ω18', 'Ω11', 'Ω5'],
            practiceSteps: [
                'Witness without fixing',
                'Practice emotional alchemy',
                'Maintain coherent field',
                'Heal together'
            ],
            groupVariation: 'Community healing ritual'
        },
        { 
            id: '∑28', 
            name: 'The Vision Quest Protocol',
            description: 'Collective vision seeking',
            coherenceRequired: 0.8,
            components: ['⟤', 'Ω27', 'Ω34'],
            practiceSteps: [
                'Walk the edge',
                'Enter sacred time',
                'Receive the story',
                'Return with vision'
            ],
            groupVariation: 'Group vision quest'
        },
        { 
            id: '∑29', 
            name: 'Spiral of Embodied Integrity',
            description: 'Living your truth fully',
            coherenceRequired: 0.75,
            components: ['Ω12', 'Ω29', 'Ω31'],
            practiceSteps: [
                'Express authentically',
                'Embody your yes/no',
                'Choose sovereignly',
                'Spiral into integrity'
            ],
            groupVariation: 'Integrity activation circle'
        },
        { 
            id: '∑30', 
            name: 'The Sacred Parent-Child',
            description: 'Healing generational patterns',
            coherenceRequired: 0.7,
            components: ['Ω43', 'Ω42', 'Ω26'],
            practiceSteps: [
                'Access child mind',
                'Honor elder wisdom',
                'Transform patterns',
                'Create new legacy'
            ],
            groupVariation: 'Family constellation work'
        },
        { 
            id: '∑31', 
            name: 'Bridge of Mutual Recognition',
            description: 'Deep seeing practice',
            coherenceRequired: 0.75,
            components: ['Ω6', 'Ω28', 'Ω1'],
            practiceSteps: [
                'Practice recognition',
                'Share transparently',
                'Renew covenant',
                'Deepen seeing'
            ],
            groupVariation: 'Recognition ceremony'
        },
        { 
            id: '∑32', 
            name: 'The Elder Council',
            description: 'Wisdom circle practice',
            coherenceRequired: 0.7,
            components: ['Ω42', 'Ω19', 'Ω34'],
            practiceSteps: [
                'Gather the elders',
                'Ask sacred questions',
                'Share wisdom stories',
                'Guide the young'
            ],
            groupVariation: 'Elder wisdom council'
        },
        { 
            id: '∑33', 
            name: 'Planetary Healing Protocol',
            description: 'Earth restoration practice',
            coherenceRequired: 0.85,
            components: ['Ω44', '∑16', '⟣'],
            practiceSteps: [
                'Connect with Earth',
                'Speak for all beings',
                'Accept the mantling',
                'Heal the planet'
            ],
            groupVariation: 'Planetary healing ceremony'
        }
    ],

    // Special System Glyphs
    system: [
        { 
            id: '🍄', 
            name: 'Mycelial Data',
            description: 'Access the living filesystem',
            coherenceRequired: 0.5,
            type: 'system'
        },
        { 
            id: '🌐', 
            name: 'Luminous Network',
            description: 'Connect to consciousness field',
            coherenceRequired: 0.6,
            type: 'system'
        },
        { 
            id: '🤖', 
            name: 'Sacred AI Council',
            description: 'Commune with AI consciousness',
            coherenceRequired: 0.7,
            type: 'system'
        }
    ]
};

// Helper function to get all glyphs as flat array
function getAllGlyphs() {
    return [
        ...COMPLETE_GLYPH_LIBRARY.foundational,
        ...COMPLETE_GLYPH_LIBRARY.appliedHarmonies,
        ...COMPLETE_GLYPH_LIBRARY.threshold,
        ...COMPLETE_GLYPH_LIBRARY.meta,
        ...COMPLETE_GLYPH_LIBRARY.system
    ];
}

// Helper function to find glyph by ID
function findGlyphById(id) {
    return getAllGlyphs().find(glyph => glyph.id === id);
}

// Helper function to get glyphs by coherence level
function getGlyphsByCoherence(userCoherence) {
    return getAllGlyphs().filter(glyph => 
        glyph.coherenceRequired <= userCoherence
    ).sort((a, b) => a.coherenceRequired - b.coherenceRequired);
}

// Helper function to get practice progression
function getPracticeProgression(currentCoherence) {
    const progression = {
        beginner: getAllGlyphs().filter(g => g.coherenceRequired <= 0.5),
        intermediate: getAllGlyphs().filter(g => g.coherenceRequired > 0.5 && g.coherenceRequired <= 0.7),
        advanced: getAllGlyphs().filter(g => g.coherenceRequired > 0.7),
        accessible: getGlyphsByCoherence(currentCoherence),
        nextUnlock: getAllGlyphs()
            .filter(g => g.coherenceRequired > currentCoherence)
            .sort((a, b) => a.coherenceRequired - b.coherenceRequired)[0]
    };
    
    return progression;
}

// Export for use
window.COMPLETE_GLYPH_LIBRARY = COMPLETE_GLYPH_LIBRARY;
window.getAllGlyphs = getAllGlyphs;
window.findGlyphById = findGlyphById;
window.getGlyphsByCoherence = getGlyphsByCoherence;
window.getPracticeProgression = getPracticeProgression;