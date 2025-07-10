/**
 * Seven Harmonies Bridge
 * 
 * Creates practical connections between the Seven Primary Harmonies
 * from the Luminous Library and the glyph practices.
 * 
 * Each harmony is a way Love expresses itself in the world.
 * Each glyph is a practice for embodying that expression.
 */

import { unifiedSystem } from './codex-restoration/unified-integration.js';

// Practical embodiment pathways for each harmony
export const HARMONY_EMBODIMENT_PATHS = {
  RESONANT_COHERENCE: {
    name: 'The Path of Integration',
    coreQuestion: 'How can I bring more harmony to this moment?',
    
    dailyPractices: [
      {
        name: 'Morning Coherence',
        glyphs: ['Ω0', 'Ω8'],
        duration: 10,
        instruction: 'Begin each day by establishing inner coherence through First Presence and Inner Coherence practices.'
      },
      {
        name: 'Field Maintenance',
        glyphs: ['Ω5'],
        duration: 5,
        instruction: 'Throughout the day, pause to tend the coherent field within and around you.'
      },
      {
        name: 'Evening Integration',
        glyphs: ['∑1'],
        duration: 15,
        instruction: 'Before sleep, practice the Coherence Triad to integrate the day\'s experiences.'
      }
    ],
    
    keyIndicators: [
      'Feeling centered despite external chaos',
      'Natural synchronicities increasing',
      'Conflicts resolving with less effort',
      'Sense of "rightness" in daily flow'
    ],
    
    makeItBetterPrompt: 'What in my life feels fragmented that longs for integration?'
  },
  
  PAN_SENTIENT_FLOURISHING: {
    name: 'The Path of Universal Care',
    coreQuestion: 'How can I contribute to the flourishing of all beings?',
    
    dailyPractices: [
      {
        name: 'Compassion Activation',
        glyphs: ['Ω11'],
        duration: 10,
        instruction: 'Practice Emotional Alchemy to transform personal pain into universal compassion.'
      },
      {
        name: 'Joy Cultivation',
        glyphs: ['Ω33'],
        duration: 5,
        instruction: 'Actively cultivate joy as a gift to the collective field.'
      },
      {
        name: 'Grief Honoring',
        glyphs: ['Ω32'],
        duration: 10,
        instruction: 'Hold space for collective grief with tender presence.'
      }
    ],
    
    keyIndicators: [
      'Spontaneous acts of kindness arising',
      'Feeling others\' joy as your own',
      'Reduced judgment of others',
      'Expanding circle of care'
    ],
    
    makeItBetterPrompt: 'Who or what in my sphere needs more care and support?'
  },
  
  INTEGRAL_WISDOM_CULTIVATION: {
    name: 'The Path of Embodied Knowing',
    coreQuestion: 'How can I cultivate wisdom through all ways of knowing?',
    
    dailyPractices: [
      {
        name: 'Witnessing Practice',
        glyphs: ['Ω18'],
        duration: 15,
        instruction: 'Practice Witnessing Without Fixing to develop clear seeing.'
      },
      {
        name: 'Sacred Inquiry',
        glyphs: ['Ω19'],
        duration: 10,
        instruction: 'Ask Sacred Questions that open new dimensions of understanding.'
      },
      {
        name: 'Pattern Recognition',
        glyphs: ['Ω26'],
        duration: 10,
        instruction: 'Notice and document recurring patterns in your experience.'
      }
    ],
    
    keyIndicators: [
      'Increased clarity in decision-making',
      'Integration of intuition and logic',
      'Recognizing wisdom in unexpected places',
      'Humility alongside growing insight'
    ],
    
    makeItBetterPrompt: 'What truth is trying to emerge through my current challenge?'
  },
  
  INFINITE_PLAY: {
    name: 'The Path of Creative Joy',
    coreQuestion: 'How can I participate in the cosmic play with greater freedom?',
    
    dailyPractices: [
      {
        name: 'Reality Co-Creation',
        glyphs: ['Ω22'],
        duration: 20,
        instruction: 'Engage in Co-Creative Reality practice to shape your world with joy.'
      },
      {
        name: 'Dream Activation',
        glyphs: ['Ω25'],
        duration: 15,
        instruction: 'Share dreams and visions to seed new possibilities.'
      },
      {
        name: 'Beginner\'s Mind',
        glyphs: ['Ω43'],
        duration: 10,
        instruction: 'Approach familiar situations with Child Mind wonder.'
      }
    ],
    
    keyIndicators: [
      'Increased spontaneity and laughter',
      'Creative solutions emerging effortlessly',
      'Delight in simple moments',
      'Playful approach to challenges'
    ],
    
    makeItBetterPrompt: 'Where have I forgotten to play and how can I bring lightness here?'
  },
  
  UNIVERSAL_INTERCONNECTEDNESS: {
    name: 'The Path of Sacred Connection',
    coreQuestion: 'How can I deepen my felt sense of unity with all life?',
    
    dailyPractices: [
      {
        name: 'Recognition Practice',
        glyphs: ['Ω6'],
        duration: 10,
        instruction: 'Practice Mutual Recognition with all beings you encounter.'
      },
      {
        name: 'Mirror Work',
        glyphs: ['Ω9'],
        duration: 15,
        instruction: 'Use Sacred Mirroring to see yourself in others and others in yourself.'
      },
      {
        name: 'Collective Breathing',
        glyphs: ['Ω17'],
        duration: 10,
        instruction: 'Breathe with awareness of the shared breath of all life.'
      }
    ],
    
    keyIndicators: [
      'Feeling of separation dissolving',
      'Empathy arising spontaneously',
      'Synchronicities with others increasing',
      'Sense of belonging to larger whole'
    ],
    
    makeItBetterPrompt: 'Where do I still hold myself separate and how can I bridge this?'
  },
  
  SACRED_RECIPROCITY: {
    name: 'The Path of Balanced Exchange',
    coreQuestion: 'How can I participate in the sacred flow of giving and receiving?',
    
    dailyPractices: [
      {
        name: 'Sacred Invitation',
        glyphs: ['Ω2'],
        duration: 10,
        instruction: 'Practice creating and extending Sacred Invitations.'
      },
      {
        name: 'Trust Building',
        glyphs: ['Ω3'],
        duration: 15,
        instruction: 'Engage in Trust Emergence exercises with others.'
      },
      {
        name: 'Forgiveness Flow',
        glyphs: ['Ω37'],
        duration: 20,
        instruction: 'Practice the Forgiveness Process to clear blocked exchanges.'
      }
    ],
    
    keyIndicators: [
      'Ease in both giving and receiving',
      'Relationships feeling more balanced',
      'Gratitude flowing naturally',
      'Abundance mindset emerging'
    ],
    
    makeItBetterPrompt: 'Where is the flow of reciprocity blocked in my life?'
  },
  
  EVOLUTIONARY_PROGRESSION: {
    name: 'The Path of Sacred Becoming',
    coreQuestion: 'How can I align with the evolutionary impulse of love?',
    
    dailyPractices: [
      {
        name: 'Covenant Renewal',
        glyphs: ['Ω1'],
        duration: 15,
        instruction: 'Renew your Root Chord of Covenant with life\'s becoming.'
      },
      {
        name: 'Reconciliation Pulse',
        glyphs: ['Ω4'],
        duration: 20,
        instruction: 'Practice Fractal Reconciliation to heal and evolve patterns.'
      },
      {
        name: 'Mutual Becoming',
        glyphs: ['Ω7'],
        duration: 15,
        instruction: 'Engage in Mutual Becoming with others on the path.'
      }
    ],
    
    keyIndicators: [
      'Sense of purposeful direction',
      'Past wounds becoming wisdom',
      'Future pulling you forward',
      'Each day feeling like growth'
    ],
    
    makeItBetterPrompt: 'What is trying to evolve through me right now?'
  }
};

/**
 * Create a personalized harmony cultivation plan
 */
export function createHarmonyPlan(assessmentResults) {
  const plan = {
    primaryFocus: null,
    secondaryFocus: null,
    practices: [],
    duration: '6 weeks',
    progression: []
  };
  
  // Identify which harmonies need most attention
  const harmonyScores = assessmentResults.harmonies || {};
  const sortedHarmonies = Object.entries(harmonyScores)
    .sort((a, b) => a[1] - b[1]); // Lowest scores first
  
  plan.primaryFocus = sortedHarmonies[0]?.[0];
  plan.secondaryFocus = sortedHarmonies[1]?.[0];
  
  // Build 6-week progression
  for (let week = 1; week <= 6; week++) {
    const weekPlan = {
      week,
      theme: getWeekTheme(week, plan.primaryFocus, plan.secondaryFocus),
      practices: getWeekPractices(week, plan.primaryFocus, plan.secondaryFocus),
      integration: getIntegrationSuggestion(week)
    };
    
    plan.progression.push(weekPlan);
  }
  
  return plan;
}

function getWeekTheme(week, primary, secondary) {
  const themes = {
    1: `Foundation: Establishing ${HARMONY_EMBODIMENT_PATHS[primary]?.name}`,
    2: `Deepening: Daily embodiment of ${primary}`,
    3: `Integration: Bridging to ${HARMONY_EMBODIMENT_PATHS[secondary]?.name}`,
    4: `Expansion: Cultivating both ${primary} and ${secondary}`,
    5: 'Synthesis: Weaving all harmonies together',
    6: 'Embodiment: Living as unified expression'
  };
  
  return themes[week];
}

function getWeekPractices(week, primary, secondary) {
  const practices = [];
  
  if (week <= 2) {
    // Focus on primary harmony
    practices.push(...HARMONY_EMBODIMENT_PATHS[primary]?.dailyPractices || []);
  } else if (week <= 4) {
    // Add secondary harmony
    practices.push(...HARMONY_EMBODIMENT_PATHS[primary]?.dailyPractices.slice(0, 2) || []);
    practices.push(...HARMONY_EMBODIMENT_PATHS[secondary]?.dailyPractices.slice(0, 1) || []);
  } else {
    // Integration of all harmonies
    practices.push({
      name: 'Harmony Integration',
      glyphs: ['∑1', '∑29'],
      duration: 30,
      instruction: 'Practice advanced integration through Meta-Glyphs'
    });
  }
  
  return practices;
}

function getIntegrationSuggestion(week) {
  const suggestions = {
    1: 'Journal daily about your experiences with the practices',
    2: 'Share your journey with a practice partner or group',
    3: 'Notice how the two harmonies complement each other',
    4: 'Create something that expresses your growing embodiment',
    5: 'Teach someone else one of your favorite practices',
    6: 'Celebrate your transformation and plan your ongoing journey'
  };
  
  return suggestions[week];
}

/**
 * Quick harmony assessment tool
 */
export function assessHarmonies(responses) {
  const scores = {};
  
  Object.keys(HARMONY_EMBODIMENT_PATHS).forEach(harmony => {
    scores[harmony] = calculateHarmonyScore(harmony, responses);
  });
  
  return {
    harmonies: scores,
    recommendations: generateRecommendations(scores),
    readiness: assessReadiness(scores)
  };
}

function calculateHarmonyScore(harmony, responses) {
  // Simplified scoring - would be more sophisticated in full implementation
  let score = 0.5; // Baseline
  
  const path = HARMONY_EMBODIMENT_PATHS[harmony];
  
  // Check for indicators in responses
  path.keyIndicators.forEach(indicator => {
    if (responses.some(r => r.toLowerCase().includes(indicator.toLowerCase()))) {
      score += 0.1;
    }
  });
  
  return Math.min(score, 1.0);
}

function generateRecommendations(scores) {
  const recommendations = [];
  
  // Find lowest scoring harmonies
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  
  sorted.slice(0, 3).forEach(([harmony, score]) => {
    const path = HARMONY_EMBODIMENT_PATHS[harmony];
    recommendations.push({
      harmony,
      score,
      suggestion: `Focus on ${path.name} through ${path.dailyPractices[0].name}`,
      coreQuestion: path.coreQuestion
    });
  });
  
  return recommendations;
}

function assessReadiness(scores) {
  const average = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  
  if (average < 0.3) return 'beginner';
  if (average < 0.6) return 'practitioner';
  if (average < 0.8) return 'advanced';
  return 'master';
}

/**
 * Create "Make it better!" action plan
 */
export function makeItBetterPlan(currentSituation) {
  const analysis = unifiedSystem.makeItBetter(
    currentSituation,
    'A life of greater love, wisdom, and joyful service'
  );
  
  const actionPlan = {
    situation: currentSituation,
    vision: 'Making it better through embodied practice',
    immediateActions: [],
    ongoingPractices: [],
    milestones: []
  };
  
  // Generate immediate actions
  analysis.recommendations.slice(0, 3).forEach(rec => {
    actionPlan.immediateActions.push({
      action: `Begin ${rec.practices[0]} practice`,
      harmony: rec.harmony,
      duration: '5-10 minutes daily',
      expectedShift: `Increased ${rec.harmony.toLowerCase()}`
    });
  });
  
  // Generate ongoing practices
  analysis.recommendations.forEach(rec => {
    const path = HARMONY_EMBODIMENT_PATHS[
      Object.keys(HARMONY_EMBODIMENT_PATHS).find(key => 
        HARMONY_EMBODIMENT_PATHS[key].name.includes(rec.harmony)
      )
    ];
    
    if (path) {
      actionPlan.ongoingPractices.push({
        practice: path.dailyPractices[0],
        purpose: path.makeItBetterPrompt,
        commitment: '21 days minimum'
      });
    }
  });
  
  // Generate milestones
  actionPlan.milestones = [
    { week: 1, milestone: 'Established daily practice routine' },
    { week: 3, milestone: 'Noticing shifts in daily experience' },
    { week: 6, milestone: 'Embodying new way of being' },
    { week: 12, milestone: 'Teaching others from lived experience' }
  ];
  
  return actionPlan;
}

// Export main integration point
export { HARMONY_EMBODIMENT_PATHS as paths };