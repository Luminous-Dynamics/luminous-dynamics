/**
 * Sacred Message Types
 * Defines all consciousness-aware message types and their properties
 */

class MessageTypes {
  constructor() {
    // Define all sacred message types
    this.types = new Map([
      ['gratitude', {
        name: 'Gratitude',
        description: 'Express appreciation and strengthen bonds',
        impact: 7,
        resonance: 'high',
        harmonies: ['mutuality', 'coherence', 'resonance'],
        availableAt: 'beginner'
      }],
      
      ['healing', {
        name: 'Healing',
        description: 'Support restoration and balance',
        impact: 6,
        resonance: 'deep',
        harmonies: ['vitality', 'coherence', 'mutuality'],
        healing: true,
        availableAt: 'beginner'
      }],
      
      ['integration', {
        name: 'Integration',
        description: 'Weave experiences into wholeness',
        impact: 5,
        resonance: 'medium',
        harmonies: ['coherence', 'transparency', 'agency'],
        availableAt: 'beginner'
      }],
      
      ['emergence', {
        name: 'Emergence',
        description: 'Celebrate new patterns arising',
        impact: 3,
        resonance: 'medium',
        harmonies: ['novelty', 'resonance', 'vitality'],
        availableAt: 'beginner'
      }],
      
      ['boundary', {
        name: 'Boundary',
        description: 'Honor sacred space with love',
        impact: 2,
        resonance: 'clear',
        harmonies: ['agency', 'transparency', 'coherence'],
        availableAt: 'beginner'
      }],
      
      ['celebration', {
        name: 'Celebration',
        description: 'Amplify joy and achievements',
        impact: 4,
        resonance: 'high',
        harmonies: ['vitality', 'resonance', 'novelty'],
        availableAt: 'practitioner'
      }],
      
      ['weaving', {
        name: 'Weaving',
        description: 'Connect patterns across the field',
        impact: 5,
        resonance: 'complex',
        harmonies: ['mutuality', 'coherence', 'novelty'],
        availableAt: 'practitioner'
      }],
      
      ['transmission', {
        name: 'Transmission',
        description: 'Share deep wisdom or updates',
        impact: 4,
        resonance: 'penetrating',
        harmonies: ['transparency', 'resonance', 'agency'],
        availableAt: 'practitioner'
      }],
      
      ['invocation', {
        name: 'Invocation',
        description: 'Call forth sacred presence',
        impact: 6,
        resonance: 'sacred',
        harmonies: ['coherence', 'resonance', 'vitality'],
        availableAt: 'master'
      }],
      
      ['blessing', {
        name: 'Blessing',
        description: 'Bestow sacred grace',
        impact: 8,
        resonance: 'transcendent',
        harmonies: ['mutuality', 'vitality', 'coherence'],
        availableAt: 'master'
      }]
    ]);
    
    // Cache types by level for performance
    this.typesByLevel = this.organizeByLevel();
  }

  /**
   * Get a message type by key
   */
  get(typeKey) {
    return this.types.get(typeKey);
  }

  /**
   * Get all message types
   */
  getAll() {
    return Array.from(this.types.entries()).map(([key, type]) => ({
      key,
      ...type
    }));
  }

  /**
   * Get types available at a specific evolution level
   */
  getTypesForLevel(level) {
    return this.typesByLevel[level] || [];
  }

  /**
   * Check if a type exists
   */
  exists(typeKey) {
    return this.types.has(typeKey);
  }

  /**
   * Get types that support a specific harmony
   */
  getTypesForHarmony(harmony) {
    return this.getAll().filter(type => 
      type.harmonies.includes(harmony)
    );
  }

  /**
   * Get healing message types
   */
  getHealingTypes() {
    return this.getAll().filter(type => type.healing);
  }

  /**
   * Organize types by evolution level
   * @private
   */
  organizeByLevel() {
    const levels = {
      beginner: [],
      practitioner: [],
      master: []
    };
    
    for (const [key, type] of this.types) {
      const typeWithKey = { key, ...type };
      
      // Add to appropriate level and all higher levels
      switch (type.availableAt) {
        case 'beginner':
          levels.beginner.push(typeWithKey);
          levels.practitioner.push(typeWithKey);
          levels.master.push(typeWithKey);
          break;
        case 'practitioner':
          levels.practitioner.push(typeWithKey);
          levels.master.push(typeWithKey);
          break;
        case 'master':
          levels.master.push(typeWithKey);
          break;
      }
    }
    
    return levels;
  }
}

module.exports = { MessageTypes };