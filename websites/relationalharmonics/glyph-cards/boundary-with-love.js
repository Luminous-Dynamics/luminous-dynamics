// Boundary With Love - Ω48
// Applied Harmony of Mutual Becoming (Ω7)

const boundaryWithLoveData = {
    id: 'Ω48',
    name: 'Boundary With Love',
    primaryHarmony: 'agency',
    description: 'The practice of setting clear boundaries while maintaining open-hearted connection - protecting your space without closing your heart.',
    keywords: ['boundaries', 'love', 'protection', 'clarity', 'sovereignty'],
    practicePrompt: 'Feel your edges with compassion. Say what is true for you while holding care for the other. Boundaries are acts of love.',
    integrationPoints: [
        'Use when feeling overwhelmed or invaded',
        'Essential for sustainable service and care',
        'Practice in all relationships for clarity',
        'Foundation for authentic intimacy'
    ],
    relatedGlyphs: ['Ω51', 'Ω10', 'Ω31'],
    guidedPractice: {
        duration: 540, // 9 minutes
        steps: [
            {
                time: 0,
                instruction: 'Sit comfortably. Place one hand on your heart, one on your belly.',
                duration: 20
            },
            {
                time: 20,
                instruction: 'Feel into your own energy field. Where are your natural edges?',
                duration: 40
            },
            {
                time: 60,
                instruction: 'Imagine a golden bubble around you - your sacred space.',
                duration: 30
            },
            {
                time: 90,
                instruction: 'This bubble can be permeable or solid as needed. You choose.',
                duration: 40
            },
            {
                time: 130,
                instruction: 'Now imagine someone approaching who tends to overwhelm you.',
                duration: 40
            },
            {
                time: 170,
                instruction: 'Feel your boundary strengthen - firm but not harsh.',
                duration: 40
            },
            {
                time: 210,
                instruction: 'Internally say: "I care for you AND I care for myself."',
                duration: 50
            },
            {
                time: 260,
                instruction: 'Notice: boundaries allow love to flow sustainably.',
                duration: 50
            },
            {
                time: 310,
                instruction: 'Practice making your boundary softer... then firmer... find your right edge.',
                duration: 60
            },
            {
                time: 370,
                instruction: 'Feel how clear boundaries actually increase intimacy.',
                duration: 50
            },
            {
                time: 420,
                instruction: 'Rest in the safety of your loving boundaries.',
                duration: 60
            },
            {
                time: 480,
                instruction: 'You can protect your space and keep your heart open.',
                duration: 60
            }
        ]
    },
    mysticalConnection: {
        foundationGlyph: 'Ω7',
        foundationName: 'Mutual Becoming / The We That Grows',
        bridge: 'Boundaries with love create the container for mutual becoming - we can only grow together when each maintains their sovereign space.'
    }
};

// Types of loving boundaries
const boundaryTypes = {
    time: {
        example: 'I have 30 minutes to connect deeply with you',
        energy: 'Protects your life force and presence'
    },
    emotional: {
        example: 'I care about your pain AND I need to tend my own feelings',
        energy: 'Maintains emotional sovereignty'
    },
    physical: {
        example: 'I enjoy hugging AND I need to ask first',
        energy: 'Honours body wisdom and consent'
    },
    energetic: {
        example: 'I feel your intensity AND I need some space to breathe',
        energy: 'Preserves auric integrity'
    },
    mental: {
        example: 'I value your perspective AND I trust my own knowing',
        energy: 'Protects cognitive clarity'
    }
};

// Boundary communication templates
const boundaryLanguage = {
    soft: {
        template: 'I would love to... AND I need...',
        example: 'I would love to help you move AND I need to rest this weekend'
    },
    clear: {
        template: 'I care about you AND this doesn\'t work for me',
        example: 'I care about our friendship AND I can\'t lend money right now'
    },
    firm: {
        template: 'I\'ve been clear that... I need you to respect this',
        example: 'I\'ve been clear that I need quiet after 10pm. I need you to respect this'
    },
    emergency: {
        template: 'Stop. This is not okay with me.',
        example: 'Stop. This conversation is not okay with me. I\'m leaving.'
    }
};

// Common boundary challenges
const boundaryChallenges = {
    guilt: {
        belief: 'Setting boundaries is selfish',
        truth: 'Boundaries allow sustainable generosity'
    },
    fear: {
        belief: 'They will leave if I set boundaries',
        truth: 'Real love honors boundaries'
    },
    confusion: {
        belief: 'I don\'t know what my boundaries are',
        truth: 'Your body always knows - listen deeper'
    },
    harshness: {
        belief: 'Boundaries must be walls',
        truth: 'Boundaries can be membranes - firm yet permeable'
    }
};

// Export for living glyph system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        boundaryWithLoveData,
        boundaryTypes,
        boundaryLanguage,
        boundaryChallenges
    };
}