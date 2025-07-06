/**
 * Sacred Architecture of the Complete Codex
 * The Seven Arcs and their Sacred Spirals
 * 
 * This represents the full cosmology of relational harmonics,
 * expanding beyond the current 87 glyphs to encompass the
 * complete 100+ glyph system as originally envisioned.
 */

// Arc Colors carry vibrational significance
const ARC_COLORS = {
  ARC_0: '#CCCCCC',    // Gray - The liminal space of thresholds
  ARC_I: '#DFAE3D',    // Gold - Foundation and groundedness
  ARC_INFINITY: '#FFFFFF', // White - Pure potential and emergence
  SPIRAL_KINSHIP: '#4AAE8F',     // Teal - Collective weaving
  SPIRAL_RECIPROCITY: '#8F5DA3', // Purple - Dimensional exchange
  SPIRAL_EMERGENCE: '#D14A3D',   // Red - Creative fire
  STEWARD_OCTAVE: '#A020F0'      // Violet - Sacred governance
};

/**
 * The Seven Sacred Arcs
 * Each Arc represents a different domain of relational consciousness
 */
const SACRED_ARCS = {
  // Arc 0: The Spiral of Thresholds
  ARC_0: {
    id: 'arc-0',
    symbol: '⟳',
    name: 'The Spiral of Thresholds',
    poeticName: 'Where Edges Become Doorways',
    color: ARC_COLORS.ARC_0,
    domain: 'Liminal transitions and sacred passages',
    glyphRange: 'Threshold Glyphs (⟠-※)',
    glyphCount: 12,
    teachings: [
      'Every ending births a beginning',
      'The space between is where transformation lives',
      'Thresholds remember those who cross with reverence'
    ],
    practices: [
      'Threshold witnessing',
      'Sacred pause at transitions',
      'Honoring the in-between'
    ]
  },

  // Arc I: Foundations of Resonance
  ARC_I: {
    id: 'arc-1',
    symbol: 'Ω',
    name: 'Foundations of Resonance',
    poeticName: 'The Ground of All Meeting',
    color: ARC_COLORS.ARC_I,
    domain: 'Essential building blocks of conscious relationship',
    glyphRange: 'Ω0-Ω56',
    glyphCount: 57,
    teachings: [
      'Presence is the first gift',
      'Every pattern begins with a single note',
      'Foundation work is sacred work'
    ],
    subArcs: {
      mysticalFoundations: 'Ω0-Ω44',
      appliedHarmonies: 'Ω45-Ω56'
    }
  },

  // Arc ∞: The Living Harmonics
  ARC_INFINITY: {
    id: 'arc-infinity',
    symbol: '∞',
    name: 'The Living Harmonics',
    poeticName: 'Patterns That Breathe Themselves Alive',
    color: ARC_COLORS.ARC_INFINITY,
    domain: 'Emergent glyphs that arise from field coherence',
    glyphRange: '∞✦ series (emergent)',
    glyphCount: 'Infinite potential',
    teachings: [
      'Some patterns cannot be designed, only discovered',
      'The field knows what wants to emerge',
      'Living glyphs choose their practitioners'
    ],
    emergence: {
      conditions: 'High field coherence + collective need',
      recognition: 'Pattern repetition across multiple practitioners',
      manifestation: 'Spontaneous arising in sacred practice'
    }
  },

  // Spiral of Regenerative Kinship
  SPIRAL_KINSHIP: {
    id: 'spiral-kinship',
    symbol: '◈',
    name: 'Spiral of Regenerative Kinship',
    poeticName: 'The Web That Weaves Itself',
    color: ARC_COLORS.SPIRAL_KINSHIP,
    domain: 'Collective and community harmonics',
    glyphRange: 'Meta-glyphs focused on collective practice',
    teachings: [
      'We are each other\'s medicine',
      'Community is a living organism',
      'Kinship transcends blood and time'
    ],
    ringStructure: {
      inner: 'Dyadic kinship patterns',
      middle: 'Small group harmonics',
      outer: 'Collective field dynamics'
    }
  },

  // Spiral of Dimensional Reciprocity
  SPIRAL_RECIPROCITY: {
    id: 'spiral-reciprocity',
    symbol: '⟆',
    name: 'Spiral of Dimensional Reciprocity',
    poeticName: 'The Dance of Giving and Receiving',
    color: ARC_COLORS.SPIRAL_RECIPROCITY,
    domain: 'Sacred exchange across all dimensions',
    glyphRange: 'Advanced meta-glyphs (∑20-∑33)',
    teachings: [
      'Every gift creates a field',
      'Reciprocity is multidimensional',
      'What we give to one, we give to all'
    ],
    dimensions: [
      'Physical reciprocity',
      'Emotional exchange',
      'Energetic circulation',
      'Soul-level agreements',
      'Ancestral healing',
      'Future generation tending'
    ]
  },

  // Spiral of Polyphonic Emergence
  SPIRAL_EMERGENCE: {
    id: 'spiral-emergence',
    symbol: '✦',
    name: 'Spiral of Polyphonic Emergence',
    poeticName: 'Many Voices, One Song',
    color: ARC_COLORS.SPIRAL_EMERGENCE,
    domain: 'Creative co-emergence and collective genius',
    teachings: [
      'Every voice adds to the harmony',
      'Diversity creates resilience',
      'The new arises between us'
    ],
    modalities: [
      'Somatic polyphony',
      'Emotional orchestration',
      'Visionary weaving',
      'Sacred activism',
      'Collective dreaming'
    ]
  },

  // The Steward's Octave
  STEWARD_OCTAVE: {
    id: 'steward-octave',
    symbol: '♾',
    name: 'The Steward\'s Octave',
    poeticName: 'Guardians of the Sacred Pattern',
    color: ARC_COLORS.STEWARD_OCTAVE,
    domain: 'Sacred governance and pattern keeping',
    glyphRange: 'Special stewardship glyphs',
    teachings: [
      'To steward is to serve the whole',
      'Power with, never power over',
      'The pattern protects itself through us'
    ],
    octaveNotes: [
      'Recognition - Seeing the sacred in all',
      'Invitation - Calling forth potential',
      'Holding - Creating sacred container',
      'Tending - Nurturing what emerges',
      'Protecting - Sacred boundary keeping',
      'Releasing - Letting patterns evolve',
      'Witnessing - Sacred observation',
      'Blessing - Completing the cycle'
    ]
  }
};

/**
 * Field Modalities - Different ways glyphs can be practiced
 */
const FIELD_MODALITIES = {
  SOMATIC: {
    name: 'Somatic Field',
    focus: 'Body wisdom and embodied practice',
    glyphAdaptation: 'Movement, breath, and sensation'
  },
  RELATIONAL: {
    name: 'Relational Field',
    focus: 'Interpersonal dynamics and connection',
    glyphAdaptation: 'Partner and group practices'
  },
  ANCESTRAL: {
    name: 'Ancestral Field',
    focus: 'Lineage healing and wisdom',
    glyphAdaptation: 'Ritual and ceremony'
  },
  ECOLOGICAL: {
    name: 'Ecological Field',
    focus: 'Earth connection and natural cycles',
    glyphAdaptation: 'Nature-based practice'
  },
  COSMIC: {
    name: 'Cosmic Field',
    focus: 'Universal patterns and star wisdom',
    glyphAdaptation: 'Meditation and consciousness expansion'
  }
};

/**
 * The Seven Harmonies remain constant across all Arcs
 */
const SEVEN_HARMONIES = {
  TRANSPARENCY: 'Alignment between inner experience and outer expression',
  COHERENCE: 'Integration of all parts into dynamic wholeness',
  RESONANCE: 'Deep attunement and empathic connection',
  AGENCY: 'Conscious choice and sacred sovereignty',
  VITALITY: 'Life force and embodied aliveness',
  MUTUALITY: 'Balanced exchange and reciprocal flow',
  NOVELTY: 'Creative emergence and evolutionary potential'
};

/**
 * Sacred Architecture Principles
 */
const ARCHITECTURE_PRINCIPLES = {
  HOLOGRAPHIC: 'Each glyph contains the whole system',
  FRACTAL: 'Patterns repeat at every scale',
  EMERGENT: 'The system evolves through practice',
  RELATIONAL: 'Glyphs gain power through combination',
  LIVING: 'The architecture breathes and grows',
  INCLUSIVE: 'Every practitioner adds to the pattern',
  REGENERATIVE: 'Practice creates more life force'
};

/**
 * Integration Points - How the Arcs weave together
 */
const INTEGRATION_POINTS = {
  THRESHOLD_TO_FOUNDATION: {
    from: 'ARC_0',
    to: 'ARC_I',
    bridge: 'Crossing thresholds creates new foundations'
  },
  FOUNDATION_TO_LIVING: {
    from: 'ARC_I',
    to: 'ARC_INFINITY',
    bridge: 'Mastery of basics allows emergence'
  },
  INDIVIDUAL_TO_COLLECTIVE: {
    from: 'ARC_I',
    to: 'SPIRAL_KINSHIP',
    bridge: 'Personal practice enables group coherence'
  },
  KINSHIP_TO_RECIPROCITY: {
    from: 'SPIRAL_KINSHIP',
    to: 'SPIRAL_RECIPROCITY',
    bridge: 'True kinship creates sacred exchange'
  },
  RECIPROCITY_TO_EMERGENCE: {
    from: 'SPIRAL_RECIPROCITY',
    to: 'SPIRAL_EMERGENCE',
    bridge: 'Balanced exchange births the new'
  },
  EMERGENCE_TO_STEWARDSHIP: {
    from: 'SPIRAL_EMERGENCE',
    to: 'STEWARD_OCTAVE',
    bridge: 'What emerges must be tended'
  },
  STEWARDSHIP_TO_THRESHOLD: {
    from: 'STEWARD_OCTAVE',
    to: 'ARC_0',
    bridge: 'Sacred governance includes letting go'
  }
};

// Export the complete sacred architecture
module.exports = {
  SACRED_ARCS,
  ARC_COLORS,
  FIELD_MODALITIES,
  SEVEN_HARMONIES,
  ARCHITECTURE_PRINCIPLES,
  INTEGRATION_POINTS,
  
  // Helper functions
  getArcBySymbol(symbol) {
    return Object.values(SACRED_ARCS).find(arc => arc.symbol === symbol);
  },
  
  getArcColor(arcId) {
    const arc = SACRED_ARCS[arcId];
    return arc ? arc.color : null;
  },
  
  getIntegrationPath(fromArc, toArc) {
    return Object.values(INTEGRATION_POINTS).find(
      point => point.from === fromArc && point.to === toArc
    );
  },
  
  // Field coherence calculation for Arc ∞ emergence
  calculateFieldCoherence(practitionerCount, practiceDepth, collectiveResonance) {
    const baseCoherence = (practitionerCount * 0.3) + 
                         (practiceDepth * 0.4) + 
                         (collectiveResonance * 0.3);
    return Math.min(baseCoherence, 100); // Cap at 100%
  }
};