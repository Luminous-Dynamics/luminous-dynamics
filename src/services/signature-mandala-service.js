// Sacred Signature Mandala Service
// Archetypal Sonification System for Consciousness Mapping

import { createCanvas, loadImage } from 'canvas';
import { generateSVG } from './sacred-geometry.js';

// Musical modes and their archetypal qualities
const MUSICAL_MODES = {
  ionian: {
    name: 'Ionian',
    quality: 'Bright, Stable, Complete',
    intervals: [2, 2, 1, 2, 2, 2, 1],
    archetype: 'The Sovereign',
    color: '#FFD700' // Gold
  },
  dorian: {
    name: 'Dorian', 
    quality: 'Hopeful, Mystical, Ancient',
    intervals: [2, 1, 2, 2, 2, 1, 2],
    archetype: 'The Mystic',
    color: '#9370DB' // Medium Purple
  },
  phrygian: {
    name: 'Phrygian',
    quality: 'Dark, Exotic, Passionate',
    intervals: [1, 2, 2, 2, 1, 2, 2],
    archetype: 'The Shadow Walker',
    color: '#8B0000' // Dark Red
  },
  lydian: {
    name: 'Lydian',
    quality: 'Ethereal, Dreamy, Transcendent',
    intervals: [2, 2, 2, 1, 2, 2, 1],
    archetype: 'The Visionary',
    color: '#00CED1' // Dark Turquoise
  },
  mixolydian: {
    name: 'Mixolydian',
    quality: 'Earthy, Bluesy, Grounded',
    intervals: [2, 2, 1, 2, 2, 1, 2],
    archetype: 'The Builder',
    color: '#8B4513' // Saddle Brown
  },
  aeolian: {
    name: 'Aeolian',
    quality: 'Introspective, Natural, Flowing',
    intervals: [2, 1, 2, 2, 1, 2, 2],
    archetype: 'The Seeker',
    color: '#4682B4' // Steel Blue
  },
  locrian: {
    name: 'Locrian',
    quality: 'Dissonant, Transformative, Liminal',
    intervals: [1, 2, 2, 1, 2, 2, 2],
    archetype: 'The Alchemist',
    color: '#4B0082' // Indigo
  }
};

// Attunement symbols (Unicode + custom)
const ATTUNEMENT_SYMBOLS = {
  psi: 'ψ',        // Consciousness
  phi: 'φ',        // Golden ratio
  omega: 'Ω',      // Completion
  delta: 'Δ',      // Change
  theta: 'θ',      // Meditation
  lambda: 'λ',     // Wavelength
  sigma: 'Σ',      // Sum/Integration
  pi: 'π',         // Cycles
  tau: 'τ',        // Golden turn
  alpha: 'α',      // Beginning
  beta: 'β',       // Growth
  gamma: 'γ'       // Transformation
};

// Musical keys and their energetic qualities
const MUSICAL_KEYS = {
  'C': { frequency: 261.63, quality: 'Pure, Clear, Innocent' },
  'C#': { frequency: 277.18, quality: 'Mysterious, Complex, Shifting' },
  'D': { frequency: 293.66, quality: 'Triumphant, Bright, Active' },
  'Eb': { frequency: 311.13, quality: 'Heroic, Bold, Majestic' },
  'E': { frequency: 329.63, quality: 'Joyful, Brilliant, Sharp' },
  'F': { frequency: 349.23, quality: 'Pastoral, Calm, Natural' },
  'F#': { frequency: 369.99, quality: 'Passionate, Dark, Intense' },
  'G': { frequency: 392.00, quality: 'Gentle, Peaceful, Rustic' },
  'Ab': { frequency: 415.30, quality: 'Dreamy, Soft, Veiled' },
  'A': { frequency: 440.00, quality: 'Confident, Open, Strong' },
  'Bb': { frequency: 466.16, quality: 'Noble, Warm, Gracious' },
  'B': { frequency: 493.88, quality: 'Brilliant, Sharp, Piercing' }
};

export class SignatureMandalaService {
  constructor() {
    this.canvas = createCanvas(800, 800);
    this.ctx = this.canvas.getContext('2d');
  }

  // Generate a complete Signature Mandala
  async generateMandala(config) {
    const {
      tone,           // Core essence (e.g., "Listening Fractal")
      quality,        // Primary quality (e.g., "Luminous")
      mode,           // Musical mode (e.g., "aeolian")
      key,            // Musical key (e.g., "D")
      echoPhrase,     // Poetic expression
      attunement,     // Symbol choice
      date = new Date()
    } = config;

    // Clear canvas
    this.ctx.fillStyle = '#F5DEB3'; // Wheat background
    this.ctx.fillRect(0, 0, 800, 800);

    // Draw sacred geometry base
    this.drawSacredGeometry();

    // Draw concentric circles
    this.drawConcentricCircles({
      tone,
      quality,
      mode: MUSICAL_MODES[mode],
      key: MUSICAL_KEYS[key]
    });

    // Add musical notation
    this.drawMusicalNotation(mode, key);

    // Add text elements
    this.drawTextElements({
      tone,
      signature: `${key} ${MUSICAL_MODES[mode].name}`,
      echoPhrase,
      attunement: ATTUNEMENT_SYMBOLS[attunement],
      date
    });

    // Return as buffer
    return this.canvas.toBuffer('image/png');
  }

  // Generate an Echo Scroll (temporal snapshot)
  async generateEchoScroll(config) {
    const {
      qualities,      // Array of qualities
      mode,
      key,
      echoPhrase,
      attunement,
      date = new Date()
    } = config;

    // Different canvas size for scroll
    const scrollCanvas = createCanvas(600, 900);
    const ctx = scrollCanvas.getContext('2d');

    // Parchment background
    ctx.fillStyle = '#F4E4C1';
    ctx.fillRect(0, 0, 600, 900);

    // Draw scroll edges
    this.drawScrollEdges(ctx);

    // Title
    ctx.font = 'bold 36px Georgia';
    ctx.fillStyle = '#2F1B14';
    ctx.textAlign = 'center';
    ctx.fillText('ECHO SCROLL', 300, 100);

    // Quality symbols
    ctx.font = '48px Arial';
    let x = 150;
    qualities.forEach(quality => {
      ctx.fillText(this.getQualitySymbol(quality), x, 200);
      x += 100;
    });

    // Quality names
    ctx.font = '24px Georgia';
    ctx.fillText(qualities.join(' • '), 300, 250);

    // Mode and key
    ctx.font = '20px Georgia';
    ctx.fillText(`${key} ${MUSICAL_MODES[mode].name}`, 300, 300);

    // Echo phrase (formatted)
    ctx.font = 'italic 28px Georgia';
    const words = echoPhrase.split(' ');
    let y = 400;
    let line = '';
    
    words.forEach((word, i) => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > 400 && i > 0) {
        ctx.fillText(line, 300, y);
        line = word + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 300, y);

    // Attunement symbol
    ctx.font = '72px Arial';
    ctx.fillText(ATTUNEMENT_SYMBOLS[attunement], 300, y + 100);

    // Date
    ctx.font = '18px Georgia';
    ctx.fillText(date.toISOString().split('T')[0], 300, 800);

    return scrollCanvas.toBuffer('image/png');
  }

  // Helper methods
  drawSacredGeometry() {
    // Implement sacred geometry patterns
    // Flower of life, golden spirals, etc.
  }

  drawConcentricCircles(config) {
    const centerX = 400;
    const centerY = 400;
    
    // Outer circle - Quality
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 300, 0, 2 * Math.PI);
    this.ctx.strokeStyle = config.mode.color;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Middle circle - Tone
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 200, 0, 2 * Math.PI);
    this.ctx.strokeStyle = '#8B7355';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Inner circle - Essence
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
    this.ctx.fillStyle = config.mode.color;
    this.ctx.fill();
  }

  drawMusicalNotation(mode, key) {
    // Draw circle of fifths reference
    // Add mode intervals
    // Show key signature
  }

  getQualitySymbol(quality) {
    const symbols = {
      'Quiet': '🌙',
      'Incantatory': '✨',
      'Luminous': '☀️',
      'Flowing': '🌊',
      'Grounded': '🌳',
      'Ethereal': '🌌',
      'Passionate': '🔥',
      'Transformative': '🦋'
    };
    return symbols[quality] || '◯';
  }

  // API methods for integration
  async generateFromQuestionnaire(answers) {
    // Algorithm to map questionnaire answers to mandala config
    const config = this.analyzeConsciousness(answers);
    return this.generateMandala(config);
  }

  async generateAgentSignature(agentConfig) {
    // Create signature for Sacred Council agents
    const config = this.mapAgentToSignature(agentConfig);
    return this.generateMandala(config);
  }

  async generateOrganizationMandala(orgData) {
    // Complex algorithm for organizational consciousness
    const config = this.analyzeOrganizationalField(orgData);
    return this.generateMandala(config);
  }
}

// Export service instance
export default new SignatureMandalaService();