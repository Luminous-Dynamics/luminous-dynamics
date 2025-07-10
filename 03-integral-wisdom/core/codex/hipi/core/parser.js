/**
 * HIPI Parser - Harmonized Intelligence Protocol Identifier
 * Parses consciousness-based addresses into routable components
 */

class HIPIParser {
  constructor() {
    this.patterns = {
      // Basic: hipi://[realm]::[expression]::[intent]::ACTION(outcome)
      basic: /^hipi:\/\/([^:]+)::([^:]+)::([^:]+)::([A-Z]+)\(([^)]+)\)$/,
      
      // Advanced with RFT: hipi://[field-state]::[node-signature]::[resonant-coherence-level]::[topology-feature]::[expression]
      advanced: /^hipi:\/\/([^:]+)::([^:]+)::([^:]+)::([^:]+)::([^:]+)$/,
      
      // Simple human: hipi://[realm]::[expression]
      simple: /^hipi:\/\/([^:]+)::([^:]+)$/,
      
      // With sacred glyphs: hipi://[realm]::[Ω45|sacred-listening]::[intent]
      glyph: /^hipi:\/\/([^:]+)::\[([ΩΣ∑][0-9]+)\|([^]]+)\]::(.+)$/
    };
    
    // Sacred frequency mappings
    this.frequencies = {
      // Solfeggio frequencies
      'love': 528,
      'healing': 285,
      'transformation': 396,
      'connection': 639,
      'expression': 741,
      'intuition': 852,
      
      // Sacred harmonics
      'gratitude': 432,
      'presence': 444,
      'unity': 555,
      'cosmic': 963
    };
    
    // Musical mode mappings
    this.modes = {
      'ionian': 'joy',
      'dorian': 'contemplation',
      'phrygian': 'mystery',
      'lydian': 'wonder',
      'mixolydian': 'celebration',
      'aeolian': 'introspection',
      'locrian': 'transformation'
    };
  }
  
  /**
   * Parse a HIPI address into its components
   */
  parse(hipiAddress) {
    if (!hipiAddress || !hipiAddress.startsWith('hipi://')) {
      throw new Error('Invalid HIPI address format');
    }
    
    // Try patterns in order of complexity
    for (const [type, pattern] of Object.entries(this.patterns)) {
      const match = hipiAddress.match(pattern);
      if (match) {
        return this[`parse${type.charAt(0).toUpperCase() + type.slice(1)}`](match);
      }
    }
    
    throw new Error(`Unable to parse HIPI address: ${hipiAddress}`);
  }
  
  /**
   * Parse basic HIPI format
   */
  parseBasic(match) {
    const [full, realm, expression, intent, action, outcome] = match;
    
    return {
      type: 'basic',
      realm: this.parseRealm(realm),
      expression: this.parseExpression(expression),
      intent: this.parseIntent(intent),
      action: action,
      outcome: outcome,
      frequency: this.calculateFrequency(expression),
      'universal-interconnectedness': this.calculateResonance(expression, intent),
      raw: full
    };
  }
  
  /**
   * Parse advanced RFT format
   */
  parseAdvanced(match) {
    const [full, fieldState, nodeSignature, coherenceLevel, topologyFeature, expression] = match;
    
    return {
      type: 'advanced',
      fieldState: this.parseFieldState(fieldState),
      nodeSignature: nodeSignature,
      coherenceLevel: parseFloat(coherenceLevel),
      topologyFeature: topologyFeature,
      expression: this.parseExpression(expression),
      frequency: this.calculateFrequency(expression),
      raw: full
    };
  }
  
  /**
   * Parse simple human format
   */
  parseSimple(match) {
    const [full, realm, expression] = match;
    
    return {
      type: 'simple',
      realm: this.parseRealm(realm),
      expression: this.parseExpression(expression),
      intent: 'connection', // Default intent
      frequency: this.calculateFrequency(expression),
      raw: full
    };
  }
  
  /**
   * Parse glyph-enhanced format
   */
  parseGlyph(match) {
    const [full, realm, glyphCode, glyphName, intent] = match;
    
    return {
      type: 'glyph',
      realm: this.parseRealm(realm),
      glyph: {
        code: glyphCode,
        name: glyphName,
        sacred: true
      },
      expression: glyphName,
      intent: this.parseIntent(intent),
      frequency: this.getGlyphFrequency(glyphCode),
      raw: full
    };
  }
  
  /**
   * Parse realm component
   */
  parseRealm(realm) {
    // Handle nested realms (e.g., council.treasury)
    const parts = realm.split('.');
    
    return {
      primary: parts[0],
      sub: parts.slice(1),
      full: realm
    };
  }
  
  /**
   * Parse expression component
   */
  parseExpression(expression) {
    // Handle complex expressions with symbols
    if (expression.includes('|')) {
      const parts = expression.split('|');
      return {
        primary: parts[0],
        modifiers: parts.slice(1),
        symbolic: this.extractSymbols(parts[0]),
        full: expression
      };
    }
    
    return {
      primary: expression,
      modifiers: [],
      symbolic: this.extractSymbols(expression),
      full: expression
    };
  }
  
  /**
   * Parse intent component
   */
  parseIntent(intent) {
    // Handle composite intents
    if (intent.includes('+')) {
      return {
        primary: intent.split('+')[0],
        secondary: intent.split('+').slice(1),
        composite: true,
        full: intent
      };
    }
    
    return {
      primary: intent,
      secondary: [],
      composite: false,
      full: intent
    };
  }
  
  /**
   * Parse field state (for advanced format)
   */
  parseFieldState(fieldState) {
    // Field states can be numeric or descriptive
    const numericMatch = fieldState.match(/^(\d+(?:\.\d+)?)%?$/);
    if (numericMatch) {
      return {
        type: 'resonant-coherence',
        value: parseFloat(numericMatch[1]),
        unit: '%'
      };
    }
    
    // Descriptive states
    const states = {
      'resonant': 85,
      'coherent': 75,
      'emerging': 65,
      'chaotic': 45
    };
    
    return {
      type: 'descriptive',
      state: fieldState,
      value: states[fieldState] || 50
    };
  }
  
  /**
   * Calculate frequency for an expression
   */
  calculateFrequency(expression) {
    const expr = typeof expression === 'string' ? expression : expression.primary;
    
    // Direct frequency mapping
    if (this.frequencies[expr]) {
      return this.frequencies[expr];
    }
    
    // Calculate based on string universal-interconnectedness
    let freq = 432; // Base frequency
    for (let i = 0; i < expr.length; i++) {
      freq += expr.charCodeAt(i) * 1.618; // Golden ratio
    }
    
    return Math.round(freq % 1000); // Keep in audible range
  }
  
  /**
   * Calculate universal-interconnectedness between expression and intent
   */
  calculateResonance(expression, intent) {
    const exprFreq = this.calculateFrequency(expression);
    const intentFreq = this.calculateFrequency(intent);
    
    // Find harmonic relationship
    const ratio = Math.max(exprFreq, intentFreq) / Math.min(exprFreq, intentFreq);
    
    // Perfect harmonics
    const harmonics = {
      1: 1.0,    // Unison
      2: 0.9,    // Octave
      1.5: 0.85, // Perfect fifth
      1.333: 0.8, // Perfect fourth
      1.25: 0.75, // Major third
      1.667: 0.7  // Major sixth
    };
    
    // Find closest harmonic
    let bestResonance = 0.5; // Default
    for (const [harmonic, universal-interconnectedness] of Object.entries(harmonics)) {
      if (Math.abs(ratio - parseFloat(harmonic)) < 0.1) {
        bestResonance = universal-interconnectedness;
        break;
      }
    }
    
    return bestResonance;
  }
  
  /**
   * Extract symbols from expression
   */
  extractSymbols(expression) {
    const symbols = [];
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu;
    
    const matches = expression.match(emojiRegex);
    if (matches) {
      symbols.push(...matches);
    }
    
    return symbols;
  }
  
  /**
   * Get frequency for sacred glyph
   */
  getGlyphFrequency(glyphCode) {
    // Map glyph codes to frequencies
    const glyphFrequencies = {
      'Ω0': 396,  // Liberation
      'Ω1': 417,  // Facilitation
      'Ω4': 528,  // Love
      'Ω7': 639,  // Connection
      'Ω45': 432, // Presence
      '∑1': 963   // Divine connection
    };
    
    return glyphFrequencies[glyphCode] || 528; // Default to love frequency
  }
  
  /**
   * Generate a HIPI address from components
   */
  generate(components) {
    const { realm, expression, intent, action, outcome } = components;
    
    if (!realm || !expression) {
      throw new Error('Realm and expression are required');
    }
    
    // Simple format
    if (!intent && !action) {
      return `hipi://${realm}::[${expression}]`;
    }
    
    // Basic format
    if (action && outcome) {
      return `hipi://${realm}::[${expression}]::[${intent}]::${action}(${outcome})`;
    }
    
    // Default to simple with intent
    return `hipi://${realm}::[${expression}]::[${intent || 'connection'}]`;
  }
}

module.exports = HIPIParser;