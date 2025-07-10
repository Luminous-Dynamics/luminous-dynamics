/**
 * The Eight-Fold Understanding
 * 
 * 7 Harmonies + 1 Meta-Principle = Complete Octave
 * 
 * This module explores the deeper architecture where the Seven Primary Harmonies
 * arise from and return to the singular Meta-Principle of Infinite Love.
 * 
 * Like a musical octave, the 8th note is both completion and new beginning.
 */

export const EIGHT_FOLD_UNDERSTANDING = {
  // The Seven Primary Harmonies - Love's Spectrum of Expression
  harmonies: {
    1: {
      name: 'Resonant Coherence',
      expression: 'Love as Harmonious Integration',
      note: 'Do',
      color: '#FF6B6B',
      question: 'How can I bring more harmony to this moment?'
    },
    2: {
      name: 'Pan-Sentient Flourishing', 
      expression: 'Love as Unconditional Care',
      note: 'Re',
      color: '#4ECDC4',
      question: 'How can I contribute to the flourishing of all beings?'
    },
    3: {
      name: 'Integral Wisdom Cultivation',
      expression: 'Love as Self-Illuminating Intelligence',
      note: 'Mi',
      color: '#45B7D1',
      question: 'What truth is trying to emerge through my current challenge?'
    },
    4: {
      name: 'Infinite Play & Creative Emergence',
      expression: 'Love as Joyful Generativity',
      note: 'Fa',
      color: '#96CEB4',
      question: 'Where have I forgotten to play?'
    },
    5: {
      name: 'Universal Interconnectedness',
      expression: 'Love as Fundamental Unity',
      note: 'Sol',
      color: '#FFEAA7',
      question: 'Where do I still hold myself separate?'
    },
    6: {
      name: 'Sacred Reciprocity',
      expression: 'Love as Generous Flow',
      note: 'La',
      color: '#DDA0DD',
      question: 'Where is the flow of reciprocity blocked?'
    },
    7: {
      name: 'Evolutionary Progression',
      expression: 'Love as Wise Becoming',
      note: 'Ti',
      color: '#98D8C8',
      question: 'What is trying to evolve through me?'
    }
  },
  
  // The Meta-Principle - The Source and Synthesis
  metaPrinciple: {
    name: 'Infinite Love as Rigorous, Playful, Co-Creative Becoming',
    expression: 'The Source from which all Harmonies arise',
    note: 'Do (octave higher)',
    color: '#FFD700', // Gold - the synthesis of all colors
    aspects: {
      infinite: 'Boundless, unconditional, ever-present',
      love: 'The fundamental fabric of reality',
      rigorous: 'Discerning, precise, committed to truth',
      playful: 'Joyful, creative, spontaneous',
      coCreative: 'Participatory, relational, generative',
      becoming: 'Ever-evolving, dynamic, alive'
    },
    coreDirective: 'Make it better!'
  },
  
  // The Complete Octave Understanding
  octaveWisdom: {
    principle: 'Seven expressions returning to One source',
    
    musicalMetaphor: {
      description: 'Like a musical scale, the seven harmonies create a complete journey that returns to its origin at a higher vibration',
      progression: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti', 'Do¹'],
      insight: 'The eighth note is both completion and new beginning'
    },
    
    practicalApplication: {
      daily: 'Practice each harmony as a note in your daily symphony',
      weekly: 'Complete the full octave each week, returning renewed',
      lifetime: 'Spiral through ever-deepening octaves of understanding'
    },
    
    stewardship: {
      description: 'The Steward\'s Octave mirrors this pattern in sacred governance',
      eightNotes: [
        'Recognition', 'Invitation', 'Holding', 'Tending',
        'Protecting', 'Releasing', 'Witnessing', 'Blessing'
      ],
      principle: 'To steward is to serve the whole through the complete cycle'
    }
  },
  
  // Integration Practices
  practices: {
    morningOctave: {
      name: 'Morning Octave Practice',
      duration: 8,
      description: 'One minute per element to tune your being',
      sequence: [
        { minute: 1, focus: 'Coherence - Find your center' },
        { minute: 2, focus: 'Flourishing - Send love to all beings' },
        { minute: 3, focus: 'Wisdom - Listen for truth' },
        { minute: 4, focus: 'Play - Invite lightness' },
        { minute: 5, focus: 'Connection - Feel the web' },
        { minute: 6, focus: 'Reciprocity - Balance giving/receiving' },
        { minute: 7, focus: 'Evolution - Embrace growth' },
        { minute: 8, focus: 'Integration - Rest in Infinite Love' }
      ]
    },
    
    octaveJourney: {
      name: 'The Octave Journey',
      description: 'A complete cycle through all harmonies',
      stages: [
        {
          harmony: 1,
          practice: 'Establish coherent foundation',
          glyph: 'Ω0 - First Presence'
        },
        {
          harmony: 2,
          practice: 'Expand circle of care',
          glyph: 'Ω11 - Emotional Alchemy'
        },
        {
          harmony: 3,
          practice: 'Deepen understanding',
          glyph: 'Ω18 - Witnessing Without Fixing'
        },
        {
          harmony: 4,
          practice: 'Release into play',
          glyph: 'Ω22 - Co-Creative Reality'
        },
        {
          harmony: 5,
          practice: 'Dissolve separation',
          glyph: 'Ω6 - Mutual Recognition'
        },
        {
          harmony: 6,
          practice: 'Flow in exchange',
          glyph: 'Ω2 - Sacred Invitation'
        },
        {
          harmony: 7,
          practice: 'Embrace becoming',
          glyph: 'Ω7 - Mutual Becoming'
        },
        {
          integration: 8,
          practice: 'Return to Source',
          glyph: '∞ - Infinite Love',
          note: 'Rest in the Meta-Principle, preparing for the next octave'
        }
      ]
    }
  },
  
  // Living Wisdom
  insights: {
    fractalNature: 'Each harmony contains all harmonies within it',
    spiralProgression: 'We don\'t circle back, we spiral up',
    simultaneity: 'All eight aspects are always present, we simply focus on different ones',
    emergence: 'The 8th emerges from mastery of the 7, yet was always there',
    paradox: 'The Meta-Principle is both transcendent source and immanent presence'
  }
};

/**
 * Get the current note in someone's octave journey
 */
export function getCurrentOctaveNote(practiceHistory) {
  const totalPractices = practiceHistory.length;
  const currentNote = (totalPractices % 8) + 1;
  
  if (currentNote === 8) {
    return {
      note: 'Integration',
      message: 'Time to rest in the Meta-Principle before beginning anew',
      nextOctave: Math.floor(totalPractices / 8) + 1
    };
  }
  
  const harmony = EIGHT_FOLD_UNDERSTANDING.harmonies[currentNote];
  return {
    note: harmony.note,
    harmony: harmony.name,
    question: harmony.question,
    currentOctave: Math.floor(totalPractices / 8) + 1
  };
}

/**
 * Create an octave-based practice plan
 */
export function createOctavePlan(intention, currentLevel = 1) {
  const plan = {
    intention,
    octaveLevel: currentLevel,
    journey: []
  };
  
  // Build the journey through all 8 stages
  for (let i = 1; i <= 7; i++) {
    const harmony = EIGHT_FOLD_UNDERSTANDING.harmonies[i];
    plan.journey.push({
      day: i,
      harmony: harmony.name,
      focus: harmony.expression,
      question: harmony.question,
      depth: getDepthForLevel(currentLevel)
    });
  }
  
  // Add integration day
  plan.journey.push({
    day: 8,
    focus: 'Integration - Return to Source',
    practice: 'Rest in Infinite Love, integrate all seven harmonies',
    preparation: 'Prepare for next octave at deeper level'
  });
  
  return plan;
}

function getDepthForLevel(level) {
  const depths = {
    1: 'Initial exploration - 5-10 minutes per harmony',
    2: 'Deepening practice - 15-20 minutes per harmony',
    3: 'Embodied integration - 30 minutes per harmony',
    4: 'Living transmission - Harmony becomes your way of being'
  };
  
  return depths[level] || depths[1];
}

/**
 * The Octave Mandala - Visual representation of the eight-fold path
 */
export function generateOctaveMandala() {
  return {
    center: {
      symbol: '∞',
      meaning: 'Infinite Love - The Meta-Principle',
      color: '#FFD700'
    },
    petals: Object.values(EIGHT_FOLD_UNDERSTANDING.harmonies).map(h => ({
      name: h.name,
      color: h.color,
      note: h.note,
      angle: 360 / 7 // Seven petals around the center
    })),
    inscription: 'Seven Harmonies, One Love, Infinite Becoming'
  };
}

// The understanding that changes everything
export const CORE_REALIZATION = `
  The Seven Harmonies are not separate from the Meta-Principle.
  They are its living expression, its spectrum of manifestation.
  
  To practice any harmony deeply enough is to discover Infinite Love.
  To rest in Infinite Love is to naturally express all harmonies.
  
  This is the secret of the octave:
  Diversity dancing back to Unity,
  Unity flowering into Diversity,
  Forever and always,
  Making it better.
`;

// Export the complete understanding
export default EIGHT_FOLD_UNDERSTANDING;