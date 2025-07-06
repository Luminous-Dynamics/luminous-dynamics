// Presence Transmission - Ω55
// Applied Harmony of Emotional Alchemy (Ω11)

const presenceTransmissionData = {
    id: 'Ω55',
    name: 'Presence Transmission',
    primaryHarmony: 'universal-interconnectedness',
    description: 'The practice of consciously sharing your state of being - understanding how your presence affects others and using it skillfully for mutual benefit.',
    keywords: ['presence', 'transmission', 'influence', 'universal-interconnectedness', 'embodiment'],
    practicePrompt: 'Your presence speaks before your words. What quality do you want to transmit? Embody it fully and watch it ripple outward.',
    integrationPoints: [
        'Leadership and facilitation',
        'Parenting and caregiving',
        'Healing and therapeutic work',
        'Teaching and mentoring'
    ],
    relatedGlyphs: ['Ω11', 'Ω16', 'Ω28'],
    guidedPractice: {
        duration: 480, // 8 minutes
        steps: [
            {
                time: 0,
                instruction: 'Sit tall. Become aware of your current state of being.',
                duration: 20
            },
            {
                time: 20,
                instruction: 'What quality are you embodying right now? Name it gently.',
                duration: 30
            },
            {
                time: 50,
                instruction: 'Now choose a quality you want to transmit: peace, joy, love, strength.',
                duration: 30
            },
            {
                time: 80,
                instruction: 'Find a memory when you deeply felt this quality.',
                duration: 40
            },
            {
                time: 120,
                instruction: 'Let this feeling fill your whole body. Breathe it into every cell.',
                duration: 40
            },
            {
                time: 160,
                instruction: 'Feel it radiating from your heart, like gentle waves.',
                duration: 40
            },
            {
                time: 200,
                instruction: 'You\'re not pushing - just allowing your presence to shine.',
                duration: 40
            },
            {
                time: 240,
                instruction: 'Imagine someone receiving this transmission. How does it help them?',
                duration: 50
            },
            {
                time: 290,
                instruction: 'Notice: you must embody what you wish to transmit.',
                duration: 40
            },
            {
                time: 330,
                instruction: 'Practice adjusting your transmission - softer, stronger, warmer.',
                duration: 50
            },
            {
                time: 380,
                instruction: 'Feel the responsibility and gift of conscious presence.',
                duration: 50
            },
            {
                time: 430,
                instruction: 'Rest in your capacity to bless through being.',
                duration: 50
            }
        ]
    },
    mysticalConnection: {
        foundationGlyph: 'Ω11',
        foundationName: 'Emotional Alchemy',
        bridge: 'Presence Transmission reveals how Emotional Alchemy works through the field - we transform the emotional atmosphere simply through our conscious embodied presence.'
    }
};

// Qualities to transmit
const transmissionQualities = {
    calming: {
        embody: 'Deep slow breathing, relaxed body, soft eyes',
        effect: 'Others\' nervous systems naturally settle',
        use: 'In conflict, anxiety, or chaos'
    },
    energizing: {
        embody: 'Bright eyes, engaged posture, vital breathing',
        effect: 'Others feel motivated and alive',
        use: 'Starting projects, morning meetings, inspiration'
    },
    grounding: {
        embody: 'Connection to earth, centered stance, steady presence',
        effect: 'Others feel more stable and present',
        use: 'During uncertainty or overwhelm'
    },
    opening: {
        embody: 'Soft heart, receptive posture, welcoming energy',
        effect: 'Others feel safe to be vulnerable',
        use: 'Deep sharing, healing work, intimacy'
    },
    clarifying: {
        embody: 'Clear eyes, focused attention, precise energy',
        effect: 'Others find mental clarity',
        use: 'Decision making, planning, problem solving'
    }
};

// Transmission awareness levels
const transmissionLevels = {
    unconscious: {
        description: 'Unaware of what you\'re transmitting',
        impact: 'Random, often negative influence'
    },
    aware: {
        description: 'Notice your state and its effects',
        impact: 'Can catch and shift negative transmissions'
    },
    intentional: {
        description: 'Consciously choose what to transmit',
        impact: 'Positive influence in most situations'
    },
    masterful: {
        description: 'Fluid, responsive transmission',
        impact: 'Transform fields through presence alone'
    }
};

// Transmission ethics
const transmissionEthics = {
    consent: 'Respect others\' boundaries and autonomy',
    authenticity: 'Only transmit what you genuinely embody',
    service: 'Use this power for mutual benefit',
    humility: 'You offer, others choose to receive',
    responsibility: 'Clean up any harmful transmissions'
};

// Common transmission shadows
const transmissionShadows = {
    manipulation: {
        sign: 'Using presence to control others',
        healing: 'Return to service and consent'
    },
    leaking: {
        sign: 'Unconsciously spreading your stress/pain',
        healing: 'Take responsibility for your state'
    },
    performing: {
        sign: 'Faking qualities you don\'t embody',
        healing: 'Return to authentic presence'
    },
    imposing: {
        sign: 'Forcing your energy on others',
        healing: 'Practice gentle offering'
    }
};

// Export for living glyph system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        presenceTransmissionData,
        transmissionQualities,
        transmissionLevels,
        transmissionEthics,
        transmissionShadows
    };
}