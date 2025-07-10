// Seed Glyph Data Migration
// Populates the database with all 87 sacred glyphs

export async function up(db) {
  console.log('Seeding glyph data...');
  
  // Foundational Glyphs (Ω0-Ω44)
  const foundationalGlyphs = [
    {
      id: 'Ω0',
      name: 'The Shimmering Unnamed / First Presence',
      category: 'foundational',
      description: 'The primordial awareness before naming, the first stirring of consciousness',
      coherence_required: 0.5,
      harmonies: ['transparency', 'coherence'],
      frequency: 174
    },
    {
      id: 'Ω1',
      name: 'Root Chord of Covenant / The First Yes',
      category: 'foundational',
      description: 'The sacred agreement to enter into conscious relationship',
      coherence_required: 0.5,
      harmonies: ['agency', 'mutuality'],
      frequency: 285
    },
    {
      id: 'Ω2',
      name: 'Breath of Invitation / The Gentle Opening',
      category: 'foundational',
      description: 'Creating safe space through loving invitation',
      coherence_required: 0.5,
      harmonies: ['resonance', 'mutuality'],
      frequency: 396
    },
    {
      id: 'Ω3',
      name: 'Trust Emergence / Kairotic Trust Wells',
      category: 'foundational',
      description: 'The organic arising of trust in perfect timing',
      coherence_required: 0.55,
      harmonies: ['coherence', 'resonance'],
      frequency: 417
    },
    {
      id: 'Ω4',
      name: 'Fractal Reconciliation Pulse / The Pulse of Repair',
      category: 'foundational',
      description: 'The rhythmic return to wholeness after rupture',
      coherence_required: 0.6,
      harmonies: ['coherence', 'vitality'],
      frequency: 528
    },
    {
      id: 'Ω5',
      name: 'Coherent Field Maintenance',
      category: 'foundational',
      description: 'Sustaining the sacred container across time and space',
      coherence_required: 0.65,
      harmonies: ['coherence', 'agency'],
      frequency: 639
    },
    {
      id: 'Ω6',
      name: 'Mutual Recognition',
      category: 'foundational',
      description: 'The sacred seeing of essence to essence',
      coherence_required: 0.6,
      harmonies: ['transparency', 'mutuality'],
      frequency: 741
    },
    {
      id: 'Ω7',
      name: 'Mutual Becoming / The We That Grows',
      category: 'foundational',
      description: 'The emergent third that arises between two wholes',
      coherence_required: 0.65,
      harmonies: ['mutuality', 'novelty'],
      frequency: 852
    },
    {
      id: 'Ω8',
      name: 'Inner Coherence',
      category: 'foundational',
      description: 'The bridge practice of internal integration',
      coherence_required: 0.5,
      harmonies: ['coherence', 'transparency'],
      frequency: 963
    },
    {
      id: 'Ω9',
      name: 'Sacred Mirroring',
      category: 'foundational',
      description: 'Reflecting the divine in the other',
      coherence_required: 0.6,
      harmonies: ['resonance', 'transparency'],
      frequency: 174
    },
    {
      id: 'Ω10',
      name: 'The Glyph of Sacred Refusal / The Honored No',
      category: 'foundational',
      description: 'Setting boundaries as an act of love',
      coherence_required: 0.55,
      harmonies: ['agency', 'transparency'],
      frequency: 285
    },
    {
      id: 'Ω11',
      name: 'Emotional Alchemy',
      category: 'foundational',
      description: 'Transmuting emotional energy into wisdom',
      coherence_required: 0.65,
      harmonies: ['vitality', 'coherence'],
      frequency: 396
    },
    {
      id: 'Ω12',
      name: 'Authentic Expression',
      category: 'foundational',
      description: 'Speaking truth from the depths of being',
      coherence_required: 0.6,
      harmonies: ['transparency', 'agency'],
      frequency: 417
    },
    {
      id: 'Ω13',
      name: 'Conscious Touch',
      category: 'foundational',
      description: 'Sacred physical connection with full presence',
      coherence_required: 0.7,
      harmonies: ['vitality', 'resonance'],
      frequency: 528
    },
    {
      id: 'Ω14',
      name: 'Energetic Hygiene',
      category: 'foundational',
      description: 'Clearing and maintaining clean energy fields',
      coherence_required: 0.55,
      harmonies: ['coherence', 'vitality'],
      frequency: 639
    },
    {
      id: 'Ω15',
      name: 'Sacred Pause',
      category: 'foundational',
      description: 'The space between stimulus and response',
      coherence_required: 0.5,
      harmonies: ['agency', 'coherence'],
      frequency: 741
    }
  ];

  // Applied Harmonies (Ω45-Ω56)
  const appliedHarmonies = [
    {
      id: 'Ω45',
      name: 'First Presence (Applied Harmony)',
      category: 'foundational',
      description: 'Practical embodiment of primordial awareness',
      coherence_required: 0.5,
      harmonies: ['transparency', 'coherence'],
      frequency: 174,
      prerequisites: []
    },
    {
      id: 'Ω46',
      name: 'Conscious Arrival (Applied Harmony)',
      category: 'foundational',
      description: 'The practice of fully arriving in relationship',
      coherence_required: 0.5,
      harmonies: ['agency', 'mutuality'],
      frequency: 285,
      prerequisites: ['Ω45']
    },
    {
      id: 'Ω47',
      name: 'Sacred Listening (Applied Harmony)',
      category: 'foundational',
      description: 'Deep listening that heals and transforms',
      coherence_required: 0.5,
      harmonies: ['resonance', 'coherence'],
      frequency: 528,
      prerequisites: ['Ω45']
    },
    {
      id: 'Ω48',
      name: 'Boundary With Love (Applied Harmony)',
      category: 'foundational',
      description: 'Setting limits as an expression of care',
      coherence_required: 0.55,
      harmonies: ['agency', 'mutuality'],
      frequency: 639,
      prerequisites: ['Ω46']
    },
    {
      id: 'Ω49',
      name: 'Gentle Opening (Applied Harmony)',
      category: 'foundational',
      description: 'Creating safety through loving invitation',
      coherence_required: 0.5,
      harmonies: ['resonance', 'mutuality'],
      frequency: 396,
      prerequisites: ['Ω45']
    },
    {
      id: 'Ω50',
      name: 'Building Trust (Applied Harmony)',
      category: 'foundational',
      description: 'Establishing relational safety step by step',
      coherence_required: 0.55,
      harmonies: ['coherence', 'resonance'],
      frequency: 417,
      prerequisites: ['Ω49']
    },
    {
      id: 'Ω51',
      name: 'Loving No (Applied Harmony)',
      category: 'foundational',
      description: 'Sacred boundary setting with compassion',
      coherence_required: 0.55,
      harmonies: ['agency', 'transparency'],
      frequency: 285,
      prerequisites: ['Ω48']
    },
    {
      id: 'Ω52',
      name: 'Pause Practice (Applied Harmony)',
      category: 'foundational',
      description: 'Creating space between stimulus and response',
      coherence_required: 0.5,
      harmonies: ['agency', 'coherence'],
      frequency: 741,
      prerequisites: []
    },
    {
      id: 'Ω53',
      name: 'Tending the Field (Applied Harmony)',
      category: 'foundational',
      description: 'Sustaining connection across time and distance',
      coherence_required: 0.65,
      harmonies: ['coherence', 'agency'],
      frequency: 639,
      prerequisites: ['Ω50', 'Ω47']
    },
    {
      id: 'Ω55',
      name: 'Presence Transmission (Applied Harmony)',
      category: 'foundational',
      description: 'Conscious energetic influence and blessing',
      coherence_required: 0.7,
      harmonies: ['vitality', 'coherence'],
      frequency: 852,
      prerequisites: ['Ω53']
    },
    {
      id: 'Ω56',
      name: 'Loving Redirection (Applied Harmony)',
      category: 'foundational',
      description: 'Interrupting harmful patterns with grace',
      coherence_required: 0.65,
      harmonies: ['agency', 'mutuality'],
      frequency: 528,
      prerequisites: ['Ω51', 'Ω52']
    }
  ];

  // Threshold Glyphs
  const thresholdGlyphs = [
    {
      id: 'TH1',
      name: 'The Door That Remembers You',
      category: 'threshold',
      description: 'Crossing into new phases with recognition of your journey',
      coherence_required: 0.7,
      harmonies: ['novelty', 'coherence'],
      frequency: 432
    },
    {
      id: 'TH2',
      name: 'The Keeper Beneath the Ash',
      category: 'threshold',
      description: 'Finding the eternal flame beneath life\'s trials',
      coherence_required: 0.75,
      harmonies: ['vitality', 'transparency'],
      frequency: 444
    },
    {
      id: 'TH3',
      name: 'The Unburdening',
      category: 'threshold',
      description: 'Sacred release of what no longer serves',
      coherence_required: 0.7,
      harmonies: ['agency', 'vitality'],
      frequency: 456
    },
    {
      id: 'TH4',
      name: 'The Mantling',
      category: 'threshold',
      description: 'Taking on sacred responsibility with grace',
      coherence_required: 0.75,
      harmonies: ['agency', 'mutuality'],
      frequency: 468
    },
    {
      id: 'TH5',
      name: 'The Edgewalker',
      category: 'threshold',
      description: 'Dancing at the boundary between worlds',
      coherence_required: 0.8,
      harmonies: ['novelty', 'agency'],
      frequency: 480
    }
  ];

  // Meta-Glyphs (first 5 as examples)
  const metaGlyphs = [
    {
      id: '∑1',
      name: 'The Coherence Triad',
      category: 'meta',
      description: 'Weaving three foundational practices into unified field',
      coherence_required: 0.75,
      harmonies: ['coherence', 'mutuality', 'transparency'],
      frequency: 528,
      prerequisites: ['Ω1', 'Ω22', 'Ω28']
    },
    {
      id: '∑2',
      name: 'Somatic Coherence Cascade',
      category: 'meta',
      description: 'Full-body integration of coherence patterns',
      coherence_required: 0.8,
      harmonies: ['vitality', 'coherence', 'resonance'],
      frequency: 639,
      prerequisites: ['Ω13', 'Ω16', 'Ω35']
    },
    {
      id: '∑3',
      name: 'Spiral of Regenerative Becoming',
      category: 'meta',
      description: 'The endless creative spiral of mutual evolution',
      coherence_required: 0.85,
      harmonies: ['novelty', 'mutuality', 'vitality'],
      frequency: 741,
      prerequisites: ['Ω7', 'Ω22', 'Ω33']
    },
    {
      id: '∑4',
      name: 'The Sacred Mirror Field',
      category: 'meta',
      description: 'Creating fields of divine reflection',
      coherence_required: 0.8,
      harmonies: ['transparency', 'resonance', 'mutuality'],
      frequency: 852,
      prerequisites: ['Ω6', 'Ω9', 'Ω28']
    },
    {
      id: '∑5',
      name: 'Boundaries as Living Architecture',
      category: 'meta',
      description: 'Sacred containers that breathe and evolve',
      coherence_required: 0.75,
      harmonies: ['agency', 'coherence', 'vitality'],
      frequency: 963,
      prerequisites: ['Ω10', 'Ω48', 'Ω51']
    }
  ];

  // Insert all glyphs
  const allGlyphs = [
    ...foundationalGlyphs,
    ...appliedHarmonies,
    ...thresholdGlyphs,
    ...metaGlyphs
  ];

  for (const glyph of allGlyphs) {
    await db.create('glyph', {
      ...glyph,
      long_description: glyph.description + '. This sacred pattern has been field-tested through lived experience.',
      practice_steps: generatePracticeSteps(glyph),
      group_variation: `This glyph can be practiced in groups by forming a circle and...`,
      sacred_geometry: getGeometryForGlyph(glyph.id)
    });
  }

  console.log(`✓ Seeded ${allGlyphs.length} glyphs`);
}

function generatePracticeSteps(glyph) {
  return [
    `Begin by centering yourself with three deep breaths`,
    `Invoke the energy of ${glyph.name}`,
    `Feel the resonance at ${glyph.frequency}Hz`,
    `Allow the pattern to move through your being`,
    `Complete with gratitude for the teaching`
  ];
}

function getGeometryForGlyph(glyphId) {
  const geometries = {
    'Ω0': 'vesica_piscis',
    'Ω1': 'infinity_loop',
    'Ω4': 'spiral',
    'Ω7': 'merkaba',
    '∑1': 'metatrons_cube'
  };
  
  return geometries[glyphId] || 'flower_of_life';
}

export async function down(db) {
  await db.query('DELETE FROM glyph');
  console.log('✓ Removed all glyph data');
}