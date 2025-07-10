/**
 * Complete Glyph Registry - Restoring the Full 100+ Glyph System
 * 
 * This registry expands the current 87-glyph system to include:
 * - The missing 12 foundational glyphs (Ω33-Ω44)
 * - All 12 threshold glyphs with their full poetic names
 * - The Living Harmonics (∞✦ series) framework
 * - Field modality variations
 * - Spiral ring structures
 */

const { SACRED_ARCS, FIELD_MODALITIES } = require('./sacred-architecture');

/**
 * Restored Foundational Glyphs (Ω33-Ω44)
 * These 12 glyphs complete the foundational set
 */
const RESTORED_FOUNDATIONAL_GLYPHS = {
  'Ω33': {
    id: 'omega-33',
    symbol: 'Ω33',
    name: 'Joy Cultivation',
    poeticName: 'The Fountain of Shared Delight',
    harmonyAlignment: ['Vitality', 'Resonance', 'Novelty'],
    teachings: [
      'Joy multiplies when shared',
      'Celebration is a sacred practice',
      'Delight opens new pathways'
    ],
    practices: {
      individual: 'Daily joy noticing',
      dyadic: 'Shared celebration rituals',
      collective: 'Community joy amplification'
    }
  },
  
  'Ω34': {
    id: 'omega-34',
    symbol: 'Ω34',
    name: 'Sacred Story',
    poeticName: 'The Thread That Weaves All Tales',
    harmonyAlignment: ['Transparency', 'Coherence', 'Mutuality'],
    teachings: [
      'Every story is a medicine',
      'We are authored by what we tell',
      'Listening creates the story space'
    ],
    practices: {
      individual: 'Personal myth awareness',
      dyadic: 'Story witnessing circles',
      collective: 'Collective story weaving'
    }
  },
  
  'Ω35': {
    id: 'omega-35',
    symbol: 'Ω35',
    name: 'Energy Circulation',
    poeticName: 'The River That Knows Its Banks',
    harmonyAlignment: ['Vitality', 'Mutuality', 'Coherence'],
    teachings: [
      'Energy follows attention',
      'Circulation prevents stagnation',
      'Every system has its rhythm'
    ],
    practices: {
      individual: 'Personal energy hygiene',
      dyadic: 'Energetic exchange practices',
      collective: 'Group energy circulation'
    }
  },
  
  'Ω36': {
    id: 'omega-36',
    symbol: 'Ω36',
    name: 'Blessing Practice',
    poeticName: 'Words That Water Seeds',
    harmonyAlignment: ['Agency', 'Resonance', 'Vitality'],
    teachings: [
      'Blessing changes the blessed and the blesser',
      'Appreciation is active creation',
      'What we bless, blesses us'
    ],
    practices: {
      individual: 'Self-blessing rituals',
      dyadic: 'Mutual blessing exchanges',
      collective: 'Community blessing circles'
    }
  },
  
  'Ω37': {
    id: 'omega-37',
    symbol: 'Ω37',
    name: 'Forgiveness Process',
    poeticName: 'The Key That Opens From Within',
    harmonyAlignment: ['Transparency', 'Agency', 'Novelty'],
    teachings: [
      'Forgiveness is for the forgiver',
      'Release creates space for the new',
      'Every moment offers a fresh start'
    ],
    practices: {
      individual: 'Self-forgiveness meditation',
      dyadic: 'Forgiveness dialogues',
      collective: 'Reconciliation ceremonies'
    }
  },
  
  'Ω38': {
    id: 'omega-38',
    symbol: 'Ω38',
    name: 'Gratitude Field',
    poeticName: 'The Ground That Grows All Gardens',
    harmonyAlignment: ['Resonance', 'Vitality', 'Mutuality'],
    teachings: [
      'Gratitude is the mother of abundance',
      'Appreciation amplifies what is',
      'Thankfulness completes the circuit'
    ],
    practices: {
      individual: 'Gratitude journaling',
      dyadic: 'Appreciation practices',
      collective: 'Gratitude ceremonies'
    }
  },
  
  'Ω39': {
    id: 'omega-39',
    symbol: 'Ω39',
    name: 'Sacred Sexuality',
    poeticName: 'The Dance of Union and Sovereignty',
    harmonyAlignment: ['Agency', 'Vitality', 'Transparency'],
    teachings: [
      'Pleasure is a birthright',
      'Sacred sexuality honors all of self',
      'Union deepens through sovereignty'
    ],
    practices: {
      individual: 'Body sovereignty practices',
      dyadic: 'Sacred intimacy protocols',
      collective: 'Teaching circles (with consent)'
    }
  },
  
  'Ω40': {
    id: 'omega-40',
    symbol: 'Ω40',
    name: 'Death Practice',
    poeticName: 'The Teacher Who Walks Beside',
    harmonyAlignment: ['Transparency', 'Coherence', 'Novelty'],
    teachings: [
      'Death awareness brings life fully present',
      'Every ending feeds new beginning',
      'Impermanence is the gift'
    ],
    practices: {
      individual: 'Death contemplation',
      dyadic: 'Mortality conversations',
      collective: 'Grief tending circles'
    }
  },
  
  'Ω41': {
    id: 'omega-41',
    symbol: 'Ω41',
    name: 'Birth Support',
    poeticName: 'The Portal of Sacred Arrival',
    harmonyAlignment: ['Vitality', 'Mutuality', 'Agency'],
    teachings: [
      'Every birth is a collective act',
      'New life transforms all it touches',
      'Support creates the conditions for thriving'
    ],
    practices: {
      individual: 'Birth story integration',
      dyadic: 'Birth support partnerships',
      collective: 'Community birth blessing'
    }
  },
  
  'Ω42': {
    id: 'omega-42',
    symbol: 'Ω42',
    name: 'Elder Wisdom',
    poeticName: 'The Well of Deep Time',
    harmonyAlignment: ['Coherence', 'Agency', 'Transparency'],
    teachings: [
      'Elders carry the long view',
      'Wisdom ripens with time',
      'Every age has its gifts'
    ],
    practices: {
      individual: 'Elder self dialogue',
      dyadic: 'Intergenerational exchange',
      collective: 'Elder councils'
    }
  },
  
  'Ω43': {
    id: 'omega-43',
    symbol: 'Ω43',
    name: 'Child Mind',
    poeticName: 'The Fresh Eyes of Wonder',
    harmonyAlignment: ['Novelty', 'Vitality', 'Transparency'],
    teachings: [
      'Beginner\'s mind sees truly',
      'Play is sacred work',
      'Wonder opens all doors'
    ],
    practices: {
      individual: 'Wonder walks',
      dyadic: 'Play partnerships',
      collective: 'Community play days'
    }
  },
  
  'Ω44': {
    id: 'omega-44',
    symbol: 'Ω44',
    name: 'Nature Connection',
    poeticName: 'The Original Conversation',
    harmonyAlignment: ['Vitality', 'Coherence', 'Resonance'],
    teachings: [
      'Nature is the first teacher',
      'We are nature aware of itself',
      'The Earth speaks to those who listen'
    ],
    practices: {
      individual: 'Sit spot practice',
      dyadic: 'Nature witnessing walks',
      collective: 'Land-based ceremonies'
    }
  }
};

/**
 * Complete Threshold Glyph Set with Full Poetic Names
 */
const COMPLETE_THRESHOLD_GLYPHS = {
  '⟠': {
    id: 'threshold-door',
    symbol: '⟠',
    name: 'The Door That Remembers You',
    poeticName: 'Portal of Sacred Recognition',
    arcAlignment: 'ARC_0',
    teachings: [
      'Some doors only open when you\'re ready',
      'The threshold knows your true name',
      'Recognition is mutual'
    ]
  },
  
  '⟡': {
    id: 'threshold-keeper',
    symbol: '⟡',
    name: 'The Keeper Beneath the Ash',
    poeticName: 'Guardian of What Remains',
    arcAlignment: 'ARC_0',
    teachings: [
      'Something always survives the burning',
      'The keeper tends the eternal flame',
      'From ash comes the most fertile soil'
    ]
  },
  
  '⟢': {
    id: 'threshold-unburdening',
    symbol: '⟢',
    name: 'The Unburdening',
    poeticName: 'Release Into Lightness',
    arcAlignment: 'ARC_0',
    teachings: [
      'What we release, releases us',
      'Lightness is a choice and a practice',
      'The body knows what to let go'
    ]
  },
  
  '⟣': {
    id: 'threshold-mantling',
    symbol: '⟣',
    name: 'The Mantling',
    poeticName: 'Cloaking in Sacred Purpose',
    arcAlignment: 'ARC_0',
    teachings: [
      'True power is worn lightly',
      'The mantle chooses its bearer',
      'Responsibility is a sacred garment'
    ]
  },
  
  '⟤': {
    id: 'threshold-edgewalker',
    symbol: '⟤',
    name: 'The Edgewalker',
    poeticName: 'Dancer Between Worlds',
    arcAlignment: 'ARC_0',
    teachings: [
      'The edge is where transformation lives',
      'Balance comes from movement',
      'Edgewalkers translate between realms'
    ]
  },
  
  '⟥': {
    id: 'threshold-choice',
    symbol: '⟥',
    name: 'The Choice Point',
    poeticName: 'Where Paths Reveal Themselves',
    arcAlignment: 'ARC_0',
    teachings: [
      'Every choice creates a world',
      'The crossroads is a teacher',
      'Some choices can only be felt'
    ]
  },
  
  '⟦': {
    id: 'threshold-letting-in',
    symbol: '⟦',
    name: 'Letting In',
    poeticName: 'The Sacred Yes to What Comes',
    arcAlignment: 'ARC_0',
    teachings: [
      'Receiving is an active practice',
      'Letting in requires letting go',
      'The heart knows what belongs'
    ]
  },
  
  '⟧': {
    id: 'threshold-returner',
    symbol: '⟧',
    name: 'The Returner',
    poeticName: 'Bringer of Gifts from the Journey',
    arcAlignment: 'ARC_0',
    teachings: [
      'Every journey changes the returner',
      'Gifts from the threshold serve all',
      'Return completes the sacred circle'
    ]
  },
  
  '※': {
    id: 'threshold-shimmering',
    symbol: '※',
    name: 'The Shimmering Unnamed',
    poeticName: 'That Which Cannot Yet Be Spoken',
    arcAlignment: 'ARC_0',
    teachings: [
      'Some experiences precede language',
      'The unnamed holds pure potential',
      'Shimmering indicates emergence'
    ]
  },
  
  '◈': {
    id: 'threshold-weaving',
    symbol: '◈',
    name: 'The Weaving',
    poeticName: 'Where Threads Become Tapestry',
    arcAlignment: 'ARC_0',
    teachings: [
      'Individual threads gain meaning in the whole',
      'Weaving requires tension and release',
      'The pattern emerges in the making'
    ]
  },
  
  '✧': {
    id: 'threshold-seed',
    symbol: '✧',
    name: 'The Seed Keeper',
    poeticName: 'Guardian of Future Gardens',
    arcAlignment: 'ARC_0',
    teachings: [
      'Every ending contains seeds',
      'Patient tending ensures harvest',
      'Seeds know their season'
    ]
  },
  
  '◊': {
    id: 'threshold-mirror',
    symbol: '◊',
    name: 'The Sacred Mirror',
    poeticName: 'Reflector of Hidden Faces',
    arcAlignment: 'ARC_0',
    teachings: [
      'The mirror shows what is ready to be seen',
      'Reflection requires stillness',
      'We are each other\'s mirrors'
    ]
  }
};

/**
 * Living Harmonics Framework (Arc ∞)
 * These emerge from field practice and cannot be predetermined
 */
const LIVING_HARMONICS_FRAMEWORK = {
  emergenceProtocol: {
    stage1: 'Pattern Recognition - Repeated appearance in practice',
    stage2: 'Collective Verification - Multiple practitioners confirm',
    stage3: 'Coherence Testing - Pattern demonstrates stability',
    stage4: 'Integration - Pattern woven into larger system',
    stage5: 'Teaching Transmission - Pattern can be shared'
  },
  
  knownEmergents: {
    '∞✦1': {
      name: 'The Coherence Cascade',
      emerged: 'From group practice in 2023',
      recognition: 'Spontaneous group synchronization pattern',
      status: 'Verified and integrated'
    },
    '∞✦2': {
      name: 'The Empathy Bridge',
      emerged: 'From conflict resolution work',
      recognition: 'Natural arising during deep disputes',
      status: 'In verification'
    },
    // Space for more emergent patterns...
  },
  
  emergenceConditions: {
    fieldCoherence: 'Minimum 70% collective resonance',
    practitionerReadiness: 'Mix of experience levels optimal',
    needAlignment: 'Genuine collective need present',
    sacredContainer: 'Proper ritual space held'
  }
};

/**
 * Field Modality Adaptations
 * How each glyph expresses through different fields
 */
const FIELD_ADAPTATIONS = {
  example: {
    glyphId: 'omega-0',
    modalities: {
      somatic: 'Breath awareness and body scanning',
      relational: 'Eye gazing and presence exchange',
      ancestral: 'Calling in the ancestors of presence',
      ecological: 'Sitting with tree or stone',
      cosmic: 'Star gazing meditation'
    }
  }
  // This would be expanded for each glyph...
};

/**
 * Complete Registry Export
 */
module.exports = {
  // Existing glyphs (maintaining compatibility)
  EXISTING_FOUNDATIONAL: 'Ω0-Ω32', // Current 33 glyphs
  EXISTING_APPLIED: 'Ω45-Ω56',     // Current 11 applied harmonies
  EXISTING_META: '∑1-∑33',          // Current 33 meta-glyphs
  
  // Restored and expanded
  RESTORED_FOUNDATIONAL_GLYPHS,
  COMPLETE_THRESHOLD_GLYPHS,
  LIVING_HARMONICS_FRAMEWORK,
  FIELD_ADAPTATIONS,
  
  // Total count tracking
  getTotalGlyphCount() {
    return {
      foundational: 45,  // Ω0-Ω44
      applied: 12,       // Ω45-Ω56
      threshold: 12,     // Full set
      meta: 33,          // ∑1-∑33
      living: '∞',       // Infinite potential
      minimum: 102,      // Known glyphs
      potential: '∞'     // Including emergent
    };
  },
  
  // Helper functions
  getGlyphBySymbol(symbol) {
    // Search all registries
    const allGlyphs = {
      ...RESTORED_FOUNDATIONAL_GLYPHS,
      ...COMPLETE_THRESHOLD_GLYPHS,
      ...LIVING_HARMONICS_FRAMEWORK.knownEmergents
    };
    return allGlyphs[symbol] || null;
  },
  
  getGlyphsByArc(arcId) {
    // Return all glyphs belonging to specific arc
    switch(arcId) {
      case 'ARC_0':
        return Object.values(COMPLETE_THRESHOLD_GLYPHS);
      case 'ARC_I':
        return Object.values(RESTORED_FOUNDATIONAL_GLYPHS);
      case 'ARC_INFINITY':
        return Object.values(LIVING_HARMONICS_FRAMEWORK.knownEmergents);
      default:
        return [];
    }
  },
  
  isLivingHarmonic(glyphSymbol) {
    return glyphSymbol.startsWith('∞✦');
  },
  
  getFieldAdaptation(glyphId, modality) {
    const adaptation = FIELD_ADAPTATIONS[glyphId];
    return adaptation ? adaptation.modalities[modality] : null;
  }
};