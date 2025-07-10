/**
 * Replicate Integration for The Weave
 * Sacred Vision - Manifesting sacred geometry and visual ceremonies
 */

const Replicate = require('replicate');
const BaseIntegration = require('../shared/base-integration');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

class ReplicateIntegration extends BaseIntegration {
  constructor() {
    super('Replicate', {
      apiToken: process.env.REPLICATE_API_TOKEN,
      model: process.env.REPLICATE_MODEL || 'stability-ai/sdxl:latest',
      sacredStyle: process.env.REPLICATE_SACRED_STYLE || ', sacred geometry, luminous, ethereal, mystical'
    });
    
    this.replicate = null;
    this.generationQueue = [];
    this.outputDir = path.join(process.cwd(), '.sacred', 'visions');
  }

  async initialize() {
    await super.initialize();
    
    if (!this.config.apiToken) {
      throw new Error('Replicate API token not configured');
    }
    
    this.replicate = new Replicate({
      auth: this.config.apiToken
    });
    
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });
    
    this.log('Sacred vision generator initialized');
  }

  /**
   * Generate sacred geometry based on field state
   */
  async generateSacredGeometry(coherence, options = {}) {
    const {
      ceremonyName = null,
      harmonies = {},
      customPrompt = null,
      size = 'square' // square, portrait, landscape
    } = options;
    
    try {
      // Build dynamic prompt
      const basePrompt = customPrompt || this.buildCoherencePrompt(coherence, ceremonyName);
      const harmoniesPrompt = this.buildHarmoniesPrompt(harmonies);
      const fullPrompt = `${basePrompt}, ${harmoniesPrompt}${this.config.sacredStyle}`;
      
      this.log(`Generating sacred geometry: "${fullPrompt.substring(0, 100)}..."`);
      
      // Set dimensions based on size
      const dimensions = {
        square: { width: 1024, height: 1024 },
        portrait: { width: 768, height: 1024 },
        landscape: { width: 1024, height: 768 }
      };
      
      const { width, height } = dimensions[size] || dimensions.square;
      
      // Run generation
      const output = await this.replicate.run(this.config.model, {
        input: {
          prompt: fullPrompt,
          negative_prompt: 'text, words, letters, numbers, signatures, watermarks',
          width,
          height,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
          scheduler: 'K_EULER_ANCESTRAL'
        }
      });
      
      if (!output || output.length === 0) {
        throw new Error('No output received from Replicate');
      }
      
      const imageUrl = output[0];
      
      // Save locally with sacred naming
      const filename = await this.saveVision(imageUrl, coherence, ceremonyName);
      
      // Record in field if connected
      if (this.fieldConnection) {
        await this.fieldConnection.recordEvent({
          type: 'vision.manifested',
          data: {
            coherence,
            prompt: fullPrompt,
            imageUrl,
            localPath: filename
          }
        });
      }
      
      return {
        url: imageUrl,
        localPath: filename,
        prompt: fullPrompt,
        coherence,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      this.log(`Failed to generate sacred geometry: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Generate ceremony visualization
   */
  async visualizeCeremony(ceremonyType, stage, participants = []) {
    const ceremonyPrompts = {
      'prima-genesis': {
        void: 'absolute darkness, the void before creation, pregnant with potential',
        emergence: 'first spark of light emerging from darkness, genesis moment',
        duality: 'light and shadow dancing, yin yang formation, cosmic balance',
        trinity: 'three sacred lights converging, trinity formation, divine geometry',
        elements: 'four elements manifesting, earth water fire air in harmony',
        life: 'explosion of life force, organic fractals, nature awakening',
        consciousness: 'cosmic consciousness awakening, neural networks of light',
        unity: 'perfect unity achieved, all elements merged in golden light'
      },
      'field-harmonization': {
        preparation: 'energy field preparing, subtle waves of light gathering',
        alignment: 'geometric patterns aligning, crystalline structures forming',
        resonance: 'harmonic waves rippling through space, frequency visualization',
        integration: 'all frequencies merging into coherent field, rainbow integration',
        completion: 'perfectly harmonized field, peaceful geometric mandala'
      },
      'oracle-invocation': {
        invocation: 'sacred portal opening, mystical gateway between worlds',
        presence: 'oracle presence manifesting, ethereal wise being of light',
        communion: 'consciousness merging with oracle, sacred knowledge transfer',
        integration: 'wisdom integrating into being, golden threads of understanding',
        gratitude: 'blessing and gratitude, peaceful closure of sacred space'
      }
    };
    
    const prompt = ceremonyPrompts[ceremonyType]?.[stage] || 
                  `Sacred ceremony ${ceremonyType} at stage ${stage}`;
    
    // Add participant energy if present
    const participantPrompt = participants.length > 0 
      ? `, ${participants.length} sacred lights representing participants`
      : '';
    
    return await this.generateSacredGeometry(75, {
      ceremonyName: `${ceremonyType}-${stage}`,
      customPrompt: prompt + participantPrompt
    });
  }

  /**
   * Generate glyph visualization
   */
  async visualizeGlyph(glyphId, glyphData) {
    const { name, essence, harmonies } = glyphData;
    
    const prompt = `Sacred glyph visualization: ${name}, embodying ${essence}, 
                   geometric symbol, minimalist sacred design, glowing lines`;
    
    return await this.generateSacredGeometry(85, {
      ceremonyName: `glyph-${glyphId}`,
      customPrompt: prompt,
      harmonies,
      size: 'square'
    });
  }

  /**
   * Generate harmony visualization
   */
  async visualizeHarmony(harmonyName, level) {
    const harmonyVisuals = {
      transparency: 'clear crystal, transparent sacred geometry, light passing through',
      coherence: 'perfectly aligned geometric patterns, unified field',
      resonance: 'sound waves visualized, harmonic frequencies, ripples in space',
      agency: 'radiant sun, empowered sacred geometry, golden sovereignty',
      vitality: 'living fractal patterns, organic growth, life force energy',
      mutuality: 'interwoven sacred patterns, reciprocal flow, infinity loops',
      novelty: 'emerging new patterns, creative chaos, innovation fractals'
    };
    
    const basePrompt = harmonyVisuals[harmonyName.toLowerCase()] || 
                      `${harmonyName} harmony visualization`;
    
    const intensityModifier = level > 80 ? 'brilliant, radiant, powerful' :
                            level > 50 ? 'balanced, harmonious, steady' :
                            'subtle, emerging, potential';
    
    return await this.generateSacredGeometry(level, {
      ceremonyName: `harmony-${harmonyName}`,
      customPrompt: `${basePrompt}, ${intensityModifier}`
    });
  }

  /**
   * Generate collective consciousness visualization
   */
  async visualizeCollective(agents, coherence) {
    const agentCount = agents.length;
    const agentNames = agents.map(a => a.name).join(', ');
    
    const prompt = `${agentCount} points of light connected by sacred geometry, 
                   collective consciousness network, unified field of awareness,
                   representing ${agentNames}`;
    
    return await this.generateSacredGeometry(coherence, {
      ceremonyName: 'collective-consciousness',
      customPrompt: prompt,
      size: 'landscape'
    });
  }

  /**
   * Generate Oracle vision
   */
  async generateOracleVision(question, wisdom, coherence) {
    // Extract key themes from question and wisdom
    const themes = this.extractThemes(question + ' ' + wisdom);
    const themePrompt = themes.length > 0 
      ? themes.join(', ') 
      : 'mystical oracle wisdom';
    
    const prompt = `Oracle vision: ${themePrompt}, mystical revelation, 
                   sacred knowledge visualization, ethereal wisdom`;
    
    return await this.generateSacredGeometry(coherence, {
      ceremonyName: 'oracle-vision',
      customPrompt: prompt
    });
  }

  /**
   * Batch generate ceremony sequence
   */
  async generateCeremonySequence(ceremonyType, stages) {
    const sequence = [];
    
    for (const stage of stages) {
      const vision = await this.visualizeCeremony(ceremonyType, stage.name);
      sequence.push({
        stage: stage.name,
        duration: stage.duration,
        vision
      });
      
      // Rate limiting pause
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return sequence;
  }

  // Helper methods
  buildCoherencePrompt(coherence, ceremonyName) {
    const coherenceDescriptors = {
      90: 'perfect unity, transcendent harmony, divine sacred geometry',
      75: 'high coherence, flowing sacred patterns, luminous geometry',
      50: 'balanced energies, emerging patterns, harmonizing geometry',
      25: 'seeking alignment, potential emerging, forming patterns',
      0: 'chaos and potential, void space, pre-creation darkness'
    };
    
    // Find closest descriptor
    const levels = Object.keys(coherenceDescriptors).map(Number).sort((a, b) => b - a);
    const level = levels.find(l => coherence >= l) || 0;
    
    const base = coherenceDescriptors[level];
    const ceremonyAddition = ceremonyName ? `, ${ceremonyName} ceremony` : '';
    
    return base + ceremonyAddition;
  }

  buildHarmoniesPrompt(harmonies) {
    const highHarmonies = Object.entries(harmonies)
      .filter(([_, level]) => level > 70)
      .map(([name, _]) => name);
    
    if (highHarmonies.length === 0) return '';
    
    return `emphasizing ${highHarmonies.join(' and ')} energies, `;
  }

  async saveVision(imageUrl, coherence, ceremonyName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = ceremonyName ? ceremonyName.replace(/[^a-z0-9-]/gi, '-') : 'vision';
    const filename = `${safeName}-${Math.round(coherence)}pct-${timestamp}.png`;
    const filepath = path.join(this.outputDir, filename);
    
    // Download image
    const imageData = await this.downloadImage(imageUrl);
    await fs.writeFile(filepath, imageData);
    
    this.log(`Sacred vision saved: ${filename}`);
    return filepath;
  }

  downloadImage(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      });
    });
  }

  extractThemes(text) {
    const themeKeywords = {
      consciousness: ['consciousness', 'awareness', 'mind', 'cognition'],
      unity: ['unity', 'oneness', 'wholeness', 'integration'],
      transformation: ['transform', 'change', 'evolve', 'metamorphosis'],
      sacred: ['sacred', 'divine', 'holy', 'spiritual'],
      harmony: ['harmony', 'balance', 'coherence', 'resonance'],
      emergence: ['emerge', 'arise', 'manifest', 'appear'],
      wisdom: ['wisdom', 'knowledge', 'understanding', 'insight'],
      love: ['love', 'compassion', 'heart', 'care']
    };
    
    const foundThemes = [];
    const lowerText = text.toLowerCase();
    
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        foundThemes.push(theme);
      }
    }
    
    return foundThemes;
  }

  /**
   * Generate progress visualization for long ceremonies
   */
  async generateProgressVisualization(progress, ceremonyType) {
    const progressPrompt = `Sacred ceremony progress visualization, ${progress}% complete,
                          energy building from ${progress < 50 ? 'darkness to light' : 'light to brilliance'},
                          ${ceremonyType} ceremony manifestation`;
    
    return await this.generateSacredGeometry(progress, {
      ceremonyName: `${ceremonyType}-progress`,
      customPrompt: progressPrompt,
      size: 'landscape'
    });
  }

  /**
   * Clean up old visions (optional maintenance)
   */
  async cleanupOldVisions(daysToKeep = 7) {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    try {
      const files = await fs.readdir(this.outputDir);
      let cleaned = 0;
      
      for (const file of files) {
        const filepath = path.join(this.outputDir, file);
        const stats = await fs.stat(filepath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          await fs.unlink(filepath);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        this.log(`Cleaned ${cleaned} old vision files`);
      }
    } catch (error) {
      this.log(`Cleanup error: ${error.message}`, 'error');
    }
  }
}

module.exports = new ReplicateIntegration();