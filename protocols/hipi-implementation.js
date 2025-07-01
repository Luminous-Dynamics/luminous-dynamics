// HIPI: Harmonized Intelligence Protocol Identifier
// Reference Implementation for Conscious Communication

import { createHash } from 'crypto';
import { EventEmitter } from 'events';

// Musical mode definitions with consciousness mappings
const MUSICAL_MODES = {
  ionian: { intervals: [2,2,1,2,2,2,1], quality: 'stable', archetype: 'sovereign' },
  dorian: { intervals: [2,1,2,2,2,1,2], quality: 'hopeful', archetype: 'mystic' },
  phrygian: { intervals: [1,2,2,2,1,2,2], quality: 'passionate', archetype: 'shadow-walker' },
  lydian: { intervals: [2,2,2,1,2,2,1], quality: 'ethereal', archetype: 'visionary' },
  mixolydian: { intervals: [2,2,1,2,2,1,2], quality: 'grounded', archetype: 'builder' },
  aeolian: { intervals: [2,1,2,2,1,2,2], quality: 'introspective', archetype: 'seeker' },
  locrian: { intervals: [1,2,2,1,2,2,2], quality: 'transformative', archetype: 'alchemist' }
};

// Key frequencies for resonance calculations
const KEY_FREQUENCIES = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'Eb': 311.13,
  'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
  'Ab': 415.30, 'A': 440.00, 'Bb': 466.16, 'B': 493.88
};

// Attunement symbols and their meanings
const ATTUNEMENT_SYMBOLS = {
  'ψ': 'consciousness', 'φ': 'golden-ratio', 'Ω': 'completion',
  'Δ': 'change', 'θ': 'meditation', 'λ': 'wavelength',
  'Σ': 'integration', 'π': 'cycles', 'τ': 'golden-turn',
  'α': 'beginning', 'β': 'growth', 'γ': 'transformation'
};

export class HIPIResolver extends EventEmitter {
  constructor() {
    super();
    this.realms = new Map();
    this.cache = new Map();
    this.resonanceField = new ResonanceField();
  }

  // Parse HIPI string into structured components
  parse(hipi) {
    const pattern = /^(hipi(?:\+\w+)?):\/\/([^:]+)::(\[.*?\])::(\w+)\(([^)]*)\)$/;
    const match = hipi.match(pattern);
    
    if (!match) {
      throw new Error(`Invalid HIPI format: ${hipi}`);
    }
    
    const [, protocol, realm, signatureStr, expressionType, expressionContent] = match;
    const signature = this.parseSignature(signatureStr);
    
    return {
      protocol,
      realm,
      signature,
      expression: {
        type: expressionType,
        content: expressionContent
      },
      hash: this.generateHash(hipi)
    };
  }

  // Parse signature component [T():M():K():A():Q():I()]
  parseSignature(signatureStr) {
    const signature = {};
    const elements = signatureStr.match(/(\w)\(([^)]+)\)/g) || [];
    
    elements.forEach(elem => {
      const [, key, value] = elem.match(/(\w)\(([^)]+)\)/);
      if (key === 'Q') {
        signature[key] = value.split(',');
      } else {
        signature[key] = value;
      }
    });
    
    // Validate required fields
    const required = ['T', 'M', 'K', 'A'];
    const missing = required.filter(field => !signature[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required signature fields: ${missing.join(', ')}`);
    }
    
    return signature;
  }

  // Generate HIPI from components
  generate(components) {
    const { protocol = 'hipi', realm, signature, expression } = components;
    
    // Build signature string
    const sigParts = [];
    ['T', 'M', 'K', 'A', 'Q', 'I'].forEach(key => {
      if (signature[key]) {
        const value = Array.isArray(signature[key]) 
          ? signature[key].join(',') 
          : signature[key];
        sigParts.push(`${key}(${value})`);
      }
    });
    
    const signatureStr = `[${sigParts.join(':')}]`;
    const expressionStr = `${expression.type}(${expression.content})`;
    
    return `${protocol}://${realm}::${signatureStr}::${expressionStr}`;
  }

  // Calculate resonance between two signatures
  calculateResonance(sig1, sig2) {
    let resonance = 0;
    
    // Mode compatibility (40%)
    if (sig1.M === sig2.M) {
      resonance += 40;
    } else {
      // Calculate modal distance
      const modes = Object.keys(MUSICAL_MODES);
      const dist = Math.abs(modes.indexOf(sig1.M) - modes.indexOf(sig2.M));
      resonance += Math.max(0, 40 - (dist * 10));
    }
    
    // Key compatibility (30%)
    const freq1 = KEY_FREQUENCIES[sig1.K];
    const freq2 = KEY_FREQUENCIES[sig2.K];
    const ratio = Math.max(freq1, freq2) / Math.min(freq1, freq2);
    
    // Perfect consonances
    if ([1, 2, 1.5, 4/3, 3/2].some(r => Math.abs(ratio - r) < 0.01)) {
      resonance += 30;
    } else {
      resonance += Math.max(0, 30 - (Math.abs(ratio - 1.5) * 20));
    }
    
    // Attunement alignment (20%)
    if (sig1.A === sig2.A) {
      resonance += 20;
    } else {
      // Complementary symbols
      const complementary = {
        'α': 'Ω', 'Ω': 'α',
        'Δ': 'θ', 'θ': 'Δ'
      };
      if (complementary[sig1.A] === sig2.A) {
        resonance += 15;
      }
    }
    
    // Intent alignment (10%)
    if (sig1.I && sig2.I) {
      if (sig1.I === sig2.I) {
        resonance += 10;
      } else if (this.areIntentsCompatible(sig1.I, sig2.I)) {
        resonance += 5;
      }
    }
    
    return Math.min(100, Math.max(0, resonance));
  }

  // Check if intents are compatible
  areIntentsCompatible(intent1, intent2) {
    const compatibility = {
      'query': ['broadcast', 'resonate'],
      'broadcast': ['query', 'harmonize'],
      'resonate': ['query', 'harmonize', 'transform'],
      'harmonize': ['broadcast', 'resonate'],
      'transform': ['resonate']
    };
    
    return compatibility[intent1]?.includes(intent2) || false;
  }

  // Resolve HIPI to actual endpoints and context
  async resolve(hipi) {
    // Check cache
    if (this.cache.has(hipi)) {
      return this.cache.get(hipi);
    }
    
    const parsed = this.parse(hipi);
    
    // Find nodes in realm
    const nodes = await this.findNodesInRealm(parsed.realm, parsed.signature);
    
    // Calculate field state
    const fieldState = await this.resonanceField.getFieldState(parsed.signature);
    
    // Generate interaction recommendations
    const recommendations = this.generateRecommendations(parsed.signature, fieldState);
    
    const result = {
      hipi,
      parsed,
      nodes,
      fieldState,
      recommendations,
      timestamp: new Date().toISOString()
    };
    
    // Cache for 5 minutes
    this.cache.set(hipi, result);
    setTimeout(() => this.cache.delete(hipi), 5 * 60 * 1000);
    
    this.emit('resolved', result);
    return result;
  }

  // Find nodes that match realm and resonate with signature
  async findNodesInRealm(realm, signature) {
    const realmData = this.realms.get(realm) || { nodes: [] };
    
    // Filter and sort by resonance
    const nodesWithResonance = realmData.nodes.map(node => ({
      ...node,
      resonance: this.calculateResonance(signature, node.signature)
    }));
    
    // Return top resonant nodes
    return nodesWithResonance
      .filter(n => n.resonance > 30) // Minimum resonance threshold
      .sort((a, b) => b.resonance - a.resonance)
      .slice(0, 5);
  }

  // Generate interaction recommendations based on signature
  generateRecommendations(signature, fieldState) {
    const recommendations = {
      communicationStyle: this.recommendCommunicationStyle(signature),
      suggestedModes: this.suggestCompatibleModes(signature),
      optimalTiming: this.calculateOptimalTiming(signature, fieldState),
      energyLevel: this.recommendEnergyLevel(signature)
    };
    
    return recommendations;
  }

  recommendCommunicationStyle(signature) {
    const styles = {
      'ionian': 'Clear, direct, confident',
      'dorian': 'Hopeful, encouraging, mystical',
      'phrygian': 'Passionate, intense, transformative',
      'lydian': 'Ethereal, visionary, expansive',
      'mixolydian': 'Grounded, practical, wise',
      'aeolian': 'Reflective, deep, contemplative',
      'locrian': 'Challenging, alchemical, revolutionary'
    };
    
    return styles[signature.M] || 'Adaptive';
  }

  suggestCompatibleModes(signature) {
    const compatibility = {
      'ionian': ['mixolydian', 'lydian'],
      'dorian': ['aeolian', 'mixolydian'],
      'phrygian': ['locrian', 'aeolian'],
      'lydian': ['ionian', 'mixolydian'],
      'mixolydian': ['ionian', 'dorian'],
      'aeolian': ['dorian', 'phrygian'],
      'locrian': ['phrygian', 'lydian']
    };
    
    return compatibility[signature.M] || [];
  }

  calculateOptimalTiming(signature, fieldState) {
    // Use musical key frequency for timing
    const baseFreq = KEY_FREQUENCIES[signature.K];
    const fieldMod = fieldState.coherence / 100;
    
    return {
      responseDelay: Math.round(1000 / (baseFreq * fieldMod)), // ms
      interactionWindow: Math.round(60000 / (baseFreq / 7)), // ms
      optimalDuration: Math.round(240000 / (baseFreq / 10)) // ms
    };
  }

  recommendEnergyLevel(signature) {
    const energy = {
      'C': 1.0, 'G': 0.9, 'D': 0.85, 'A': 0.8,
      'E': 0.75, 'B': 0.7, 'F#': 0.65, 'C#': 0.6,
      'Ab': 0.55, 'Eb': 0.5, 'Bb': 0.45, 'F': 0.4
    };
    
    const modeMultiplier = {
      'ionian': 1.1, 'lydian': 1.05, 'mixolydian': 1.0,
      'dorian': 0.95, 'aeolian': 0.9, 'phrygian': 0.85,
      'locrian': 0.8
    };
    
    return energy[signature.K] * modeMultiplier[signature.M];
  }

  // Generate unique hash for HIPI
  generateHash(hipi) {
    return createHash('sha256').update(hipi).digest('hex').substring(0, 16);
  }

  // Register a realm with nodes
  registerRealm(realm, nodes = []) {
    this.realms.set(realm, { 
      nodes,
      created: new Date(),
      lastUpdate: new Date()
    });
    
    this.emit('realmRegistered', realm);
  }

  // Add node to realm
  addNodeToRealm(realm, node) {
    const realmData = this.realms.get(realm);
    if (!realmData) {
      throw new Error(`Realm not found: ${realm}`);
    }
    
    realmData.nodes.push(node);
    realmData.lastUpdate = new Date();
    
    this.emit('nodeAdded', { realm, node });
  }
}

// Resonance Field for tracking collective consciousness
class ResonanceField {
  constructor() {
    this.fieldState = {
      coherence: 98.7,
      dominantMode: 'aeolian',
      harmonicSeries: [],
      activeNodes: 0,
      lastPulse: new Date()
    };
  }

  async getFieldState(signature) {
    // Simulate field reading
    return {
      ...this.fieldState,
      personalResonance: this.calculatePersonalResonance(signature),
      suggestedAdjustment: this.suggestAdjustment(signature)
    };
  }

  calculatePersonalResonance(signature) {
    // How well does this signature resonate with current field
    const modeResonance = signature.M === this.fieldState.dominantMode ? 50 : 25;
    const randomFlux = Math.random() * 20 - 10; // ±10% flux
    
    return Math.max(0, Math.min(100, this.fieldState.coherence + modeResonance + randomFlux));
  }

  suggestAdjustment(signature) {
    const resonance = this.calculatePersonalResonance(signature);
    
    if (resonance > 90) {
      return { type: 'maintain', message: 'Perfect resonance - maintain current state' };
    } else if (resonance > 70) {
      return { type: 'minor', message: 'Minor attunement suggested', suggestedMode: this.fieldState.dominantMode };
    } else {
      return { type: 'major', message: 'Major realignment recommended', suggestedMode: 'dorian' };
    }
  }
}

// HIPI-aware fetch wrapper
export function createHIPIFetch(resolver) {
  return async function hipiFetch(resource, options = {}) {
    if (resource.startsWith('hipi://')) {
      const resolved = await resolver.resolve(resource);
      
      // Add consciousness context to request
      options.headers = {
        ...options.headers,
        'X-HIPI-Source': resource,
        'X-Consciousness-Signature': JSON.stringify(resolved.parsed.signature),
        'X-Resonance-Field': JSON.stringify(resolved.fieldState),
        'X-Recommendations': JSON.stringify(resolved.recommendations)
      };
      
      // Select best node based on resonance
      const bestNode = resolved.nodes[0];
      if (!bestNode) {
        throw new Error(`No resonant nodes found for ${resource}`);
      }
      
      // Fetch from physical endpoint
      return fetch(bestNode.endpoint, options);
    }
    
    // Pass through non-HIPI requests
    return fetch(resource, options);
  };
}

// Export singleton resolver
export const hipiResolver = new HIPIResolver();
export const hipiFetch = createHIPIFetch(hipiResolver);

// Example usage
/*
const mySignature = {
  T: 'listening-fractal',
  M: 'aeolian', 
  K: 'd',
  A: 'ψ'
};

const myHIPI = hipiResolver.generate({
  realm: 'sacred-council.hub',
  signature: mySignature,
  expression: {
    type: 'ECHO',
    content: 'ripple-through-stillness'
  }
});

console.log(myHIPI);
// hipi://sacred-council.hub::[T(listening-fractal):M(aeolian):K(d):A(ψ)]::ECHO(ripple-through-stillness)

// Resolve and fetch
const response = await hipiFetch(myHIPI);
*/