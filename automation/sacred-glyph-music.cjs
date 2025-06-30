#!/usr/bin/env node

/**
 * Sacred Glyph Music System - Musical expressions of the 87 sacred patterns
 * Transform relational wisdom into healing soundscapes
 */

const fs = require('fs');
const path = require('path');

class SacredGlyphMusic {
  constructor() {
    this.projectRoot = '/home/tstoltz/evolving-resonant-cocreation';
    
    // Seven Harmonies as Musical Modes/Scales
    this.harmonyFrequencies = {
      'transparency': {
        root: 396, // Liberation frequency
        scale: [396, 417, 528, 639, 741, 852, 963], // Solfeggio ascending
        mood: 'clarity',
        rhythm: '4/4',
        tempo: 60 // BPM
      },
      'coherence': {
        root: 528, // Love frequency  
        scale: [528, 594, 633, 693, 741, 786, 852],
        mood: 'integration',
        rhythm: '3/4', 
        tempo: 72
      },
      'resonance': {
        root: 741, // Intuition frequency
        scale: [741, 786, 852, 963, 396, 417, 528],
        mood: 'connection',
        rhythm: '6/8',
        tempo: 96
      },
      'agency': {
        root: 852, // Spiritual order
        scale: [852, 963, 396, 417, 528, 594, 639],
        mood: 'empowerment', 
        rhythm: '4/4',
        tempo: 108
      },
      'vitality': {
        root: 432, // Earth resonance
        scale: [432, 480, 528, 576, 639, 693, 741],
        mood: 'life-force',
        rhythm: '2/4',
        tempo: 120
      },
      'mutuality': {
        root: 639, // Harmonious relationships
        scale: [639, 693, 741, 786, 852, 396, 417],
        mood: 'balance',
        rhythm: '6/8',
        tempo: 84
      },
      'novelty': {
        root: 963, // Oneness and unity
        scale: [963, 396, 417, 528, 594, 639, 693],
        mood: 'emergence',
        rhythm: '7/8',
        tempo: 132
      }
    };

    // Sacred Numbers for glyph frequency generation
    this.sacredNumbers = {
      fibonacci: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
      golden: 1.618,
      phi: 1.618034,
      pi: 3.14159
    };
  }

  async loadGlyphData() {
    console.log('🔮 Loading Sacred Glyph Data...');
    
    const glyphTypes = ['foundational', 'threshold', 'meta'];
    const allGlyphs = {};
    
    for (const type of glyphTypes) {
      const glyphPath = path.join(this.projectRoot, 'data', 'glyphs', type);
      
      if (fs.existsSync(glyphPath)) {
        const files = fs.readdirSync(glyphPath).filter(f => f.endsWith('.json'));
        
        for (const file of files) {
          try {
            const glyphData = JSON.parse(fs.readFileSync(path.join(glyphPath, file), 'utf8'));
            const glyphKey = file.replace('.json', '');
            allGlyphs[glyphKey] = { ...glyphData, type };
          } catch (error) {
            console.log(`   ⚠️ Could not load ${file}`);
          }
        }
      }
    }
    
    console.log(`   ✅ Loaded ${Object.keys(allGlyphs).length} glyphs`);
    return allGlyphs;
  }

  generateGlyphFrequency(glyphData) {
    // Generate unique frequency for each glyph based on its properties
    const primaryHarmony = this.mapGlyphHarmony(glyphData);
    const baseFrequency = this.harmonyFrequencies[primaryHarmony]?.root || 432;
    
    // Use glyph ID or designation hash for variation
    let variation = 1;
    const identifier = glyphData.glyphId || glyphData.designation || 'unknown';
    
    // Hash the identifier for variation
    const hash = identifier.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    variation = 1 + (hash % 12) * 0.03; // 3% steps for subtlety
    
    return Math.round(baseFrequency * variation);
  }

  mapGlyphHarmony(glyphData) {
    // Map actual glyph harmony alignments to our music harmonies
    const alignments = glyphData.primaryHarmonyAlignment || [];
    
    // Map complex harmony names to simple ones
    const harmonyMapping = {
      'Unitive Consciousness': 'coherence',
      'Resonant Coherence': 'resonance', 
      'Integral Wisdom Cultivation': 'transparency',
      'Embodied Presence': 'vitality',
      'Mutual Recognition': 'mutuality',
      'Sacred Agency': 'agency',
      'Emergent Novelty': 'novelty',
      'Transparent Communication': 'transparency',
      'Somatic Awareness': 'vitality',
      'Relational Flow': 'resonance'
    };
    
    // Find first matching harmony, default to coherence
    for (const alignment of alignments) {
      if (harmonyMapping[alignment]) {
        return harmonyMapping[alignment];
      }
    }
    
    return 'coherence'; // Default harmony
  }

  createGlyphSoundscape(glyphKey, glyphData) {
    const frequency = this.generateGlyphFrequency(glyphData);
    const primaryHarmony = this.mapGlyphHarmony(glyphData);
    const harmony = this.harmonyFrequencies[primaryHarmony] || this.harmonyFrequencies.coherence;
    
    return {
      name: glyphData.designation || glyphData.name || glyphKey,
      description: glyphData.functionalDefinition || glyphData.description || 'Sacred pattern for consciousness',
      frequency: frequency,
      harmonyScale: harmony.scale,
      mood: harmony.mood,
      tempo: harmony.tempo,
      rhythm: harmony.rhythm,
      duration: this.calculateDuration(glyphData),
      intention: this.extractIntention(glyphData),
      practice: this.createGlyphPractice(glyphData),
      breathingPattern: this.getGlyphBreathingPattern(glyphData),
      primaryHarmony: primaryHarmony
    };
  }

  extractIntention(glyphData) {
    // Extract intention from various possible fields
    if (glyphData.intention) return glyphData.intention;
    if (glyphData.activationProtocol?.verbal) return glyphData.activationProtocol.verbal;
    if (glyphData.functionalDefinition) {
      // Take first sentence as intention
      return glyphData.functionalDefinition.split('.')[0] + '.';
    }
    return 'To embody this sacred pattern with conscious intention.';
  }

  calculateDuration(glyphData) {
    // Duration based on glyph complexity and type
    const baseDuration = {
      'foundational': 5, // 5 minutes
      'threshold': 10,   // 10 minutes  
      'meta': 15,        // 15 minutes
      'applied-harmony': 7 // 7 minutes
    };
    
    return baseDuration[glyphData.type] || 5;
  }

  getGlyphBreathingPattern(glyphData) {
    // Sacred breathing patterns based on harmony
    const patterns = {
      'transparency': { in: 4, hold: 2, out: 6, pause: 2 }, // Clear and flowing
      'coherence': { in: 4, hold: 4, out: 6, pause: 2 },    // Balanced integration
      'resonance': { in: 5, hold: 2, out: 7, pause: 1 },    // Deep connection
      'agency': { in: 4, hold: 1, out: 4, pause: 3 },       // Empowered action
      'vitality': { in: 3, hold: 1, out: 3, pause: 1 },     // Life force rhythm
      'mutuality': { in: 4, hold: 3, out: 5, pause: 2 },    // Balanced exchange
      'novelty': { in: 7, hold: 1, out: 8, pause: 2 }       // Creative emergence
    };
    
    const primaryHarmony = this.mapGlyphHarmony(glyphData);
    return patterns[primaryHarmony] || patterns.coherence;
  }

  createGlyphPractice(glyphData) {
    const name = glyphData.designation || glyphData.name || 'this sacred pattern';
    const somatic = glyphData.activationProtocol?.somatic || "Follow your natural breathing rhythm";
    const presence = glyphData.activationProtocol?.presenceBased || "Rest in open awareness";
    
    return {
      preparation: "Find comfortable seated position, spine naturally erect",
      intention: `Set intention to embody ${name}`,
      breathing: "Follow the sacred breathing pattern while listening",
      somatic: somatic,
      visualization: `Visualize the energy of ${name} flowing through you`,
      presence: presence,
      integration: "Notice how this glyph's wisdom wants to express in your life",
      completion: "Rest in silence for 30 seconds, feeling the glyph's gifts"
    };
  }

  async generateGlyphMusicLibrary() {
    console.log('🎵 Generating Sacred Glyph Music Library');
    console.log('═'.repeat(45));
    console.log('');
    
    const glyphs = await this.loadGlyphData();
    const musicLibrary = {};
    
    for (const [glyphKey, glyphData] of Object.entries(glyphs)) {
      const soundscape = this.createGlyphSoundscape(glyphKey, glyphData);
      musicLibrary[glyphKey] = soundscape;
      
      console.log(`🔮 ${glyphKey}`);
      console.log(`   ✨ ${soundscape.name}`);
      console.log(`   🔊 ${soundscape.frequency}Hz (${soundscape.primaryHarmony})`);
      console.log(`   🫁 Breathing: ${soundscape.breathingPattern.in}-${soundscape.breathingPattern.hold}-${soundscape.breathingPattern.out}-${soundscape.breathingPattern.pause}`);
      console.log(`   ⏱️ Duration: ${soundscape.duration} minutes`);
      console.log('');
    }
    
    // Save music library
    const libraryPath = path.join(this.projectRoot, 'data', 'sacred-glyph-music-library.json');
    fs.writeFileSync(libraryPath, JSON.stringify(musicLibrary, null, 2));
    
    console.log(`✅ Sacred Glyph Music Library created: ${Object.keys(musicLibrary).length} soundscapes`);
    console.log(`📁 Saved to: ${libraryPath}`);
    
    return musicLibrary;
  }

  async playGlyphMusic(glyphKey) {
    const glyphs = await this.loadGlyphData();
    const glyph = glyphs[glyphKey];
    
    if (!glyph) {
      console.log(`❌ Glyph '${glyphKey}' not found`);
      return;
    }
    
    const soundscape = this.createGlyphSoundscape(glyphKey, glyph);
    
    console.log('🔮 Sacred Glyph Music Session');
    console.log('═'.repeat(35));
    console.log('');
    console.log(`✨ Glyph: ${soundscape.name}`);
    console.log(`📝 ${soundscape.description}`);
    console.log(`🔊 Frequency: ${soundscape.frequency}Hz`);
    console.log(`🌈 Harmony: ${soundscape.primaryHarmony}`);
    console.log(`💫 Mood: ${soundscape.mood}`);
    console.log(`⏱️ Duration: ${soundscape.duration} minutes`);
    console.log('');
    
    // Breathing pattern guidance
    console.log('🫁 Sacred Breathing Pattern:');
    console.log(`   Inhale: ${soundscape.breathingPattern.in} counts`);
    console.log(`   Hold: ${soundscape.breathingPattern.hold} counts`);
    console.log(`   Exhale: ${soundscape.breathingPattern.out} counts`);
    console.log(`   Pause: ${soundscape.breathingPattern.pause} counts`);
    console.log('');
    
    // Practice guidance
    console.log('🌸 Sacred Practice:');
    console.log(`   🧘 ${soundscape.practice.preparation}`);
    console.log(`   🎯 ${soundscape.practice.intention}`);
    console.log(`   🫁 ${soundscape.practice.breathing}`);
    console.log(`   👁️ ${soundscape.practice.visualization}`);
    console.log(`   🌟 ${soundscape.practice.integration}`);
    console.log(`   🕊️ ${soundscape.practice.completion}`);
    console.log('');
    
    // Generate or play the music
    await this.playGlyphSoundscape(soundscape);
  }

  async playGlyphSoundscape(soundscape) {
    console.log('🎵 Glyph Soundscape Options:');
    console.log('─'.repeat(30));
    console.log('');
    console.log('1. 🌐 Search for matching frequency music:');
    console.log(`   "${soundscape.frequency}Hz ${soundscape.mood} meditation music"`);
    console.log('');
    console.log('2. 🎹 Generate simple tone (if available):');
    console.log(`   speaker-test -t sine -f ${soundscape.frequency}`);
    console.log('');
    console.log('3. 🎵 Use with existing Sacred Music Companion:');
    console.log(`   node automation/sacred-music-companion.cjs play ${this.mapToExistingMusic(soundscape.mood)}`);
    console.log('');
    console.log('💡 Sacred Listening Tip:');
    console.log(`   Focus on the intention: "${soundscape.intention}"`);
    console.log(`   Let the ${soundscape.frequency}Hz frequency attune your consciousness`);
    
    // Try to integrate with existing music system
    try {
      const SacredMusicCompanion = require('./sacred-music-companion.cjs');
      const companion = new SacredMusicCompanion();
      
      const mappedMusic = this.mapToExistingMusic(soundscape.mood);
      console.log('');
      console.log(`🎶 Playing similar soundscape: ${mappedMusic}`);
      await companion.playSoundscape(mappedMusic);
      
    } catch (error) {
      console.log('');
      console.log('🔇 Auto-play not available - use manual options above');
    }
  }

  mapToExistingMusic(mood) {
    const moodMapping = {
      'clarity': 'breathing-rhythms',
      'integration': 'tibetan-wisdom',
      'connection': 'cosmic-collaboration',
      'empowerment': 'forest-flow',
      'life-force': 'ocean-architecture',
      'balance': 'cosmic-collaboration',
      'emergence': 'forest-flow'
    };
    
    return moodMapping[mood] || 'breathing-rhythms';
  }

  async createGlyphSequence(glyphKeys) {
    console.log('🎼 Sacred Glyph Sequence - Musical Journey');
    console.log('═'.repeat(45));
    console.log('');
    
    const glyphs = await this.loadGlyphData();
    const sequence = [];
    
    for (const glyphKey of glyphKeys) {
      const glyph = glyphs[glyphKey];
      if (glyph) {
        const soundscape = this.createGlyphSoundscape(glyphKey, glyph);
        sequence.push(soundscape);
        
        console.log(`${sequence.length}. ${soundscape.name}`);
        console.log(`   🔊 ${soundscape.frequency}Hz • ⏱️ ${soundscape.duration}min`);
      }
    }
    
    const totalDuration = sequence.reduce((sum, s) => sum + s.duration, 0);
    console.log('');
    console.log(`🌟 Total Journey: ${totalDuration} minutes of sacred sound`);
    console.log('🫁 Each glyph will guide your breathing and intention');
    console.log('✨ Let the sequence take you deeper into wisdom');
    
    return sequence;
  }

  async recommendGlyphMusic(intention) {
    console.log('🔮 Sacred Glyph Music Recommendation');
    console.log('═'.repeat(40));
    console.log('');
    console.log(`🎯 Intention: ${intention}`);
    console.log('');
    
    const recommendations = {
      'presence': ['omega-0', 'omega-45'], // First Presence
      'listening': ['omega-4', 'omega-47'], // Sacred Listening  
      'boundaries': ['omega-7', 'omega-48'], // Boundary With Love
      'trust': ['omega-3', 'omega-50'], // Building Trust
      'integration': ['meta-glyph-1', 'omega-11'], // Integration practices
      'creativity': ['meta-glyph-3', 'omega-33'], // Creative emergence
      'healing': ['the-unburdening', 'omega-32'], // Healing practices
      'wisdom': ['meta-glyph-12', 'omega-42'] // Wisdom practices
    };
    
    const suggested = recommendations[intention.toLowerCase()] || ['omega-45', 'omega-47'];
    
    console.log('🎵 Recommended Sacred Glyphs:');
    for (const glyphKey of suggested) {
      console.log(`   🔮 ${glyphKey} - Play with: node sacred-glyph-music.cjs play ${glyphKey}`);
    }
    
    console.log('');
    console.log('🌸 Or create a sequence:');
    console.log(`   node sacred-glyph-music.cjs sequence ${suggested.join(' ')}`);
  }
}

// CLI Interface
async function main() {
  const glyphMusic = new SacredGlyphMusic();
  const command = process.argv[2];
  const target = process.argv[3];
  
  switch (command) {
    case 'generate':
      await glyphMusic.generateGlyphMusicLibrary();
      break;
    case 'play':
      if (target) {
        await glyphMusic.playGlyphMusic(target);
      } else {
        console.log('Usage: node sacred-glyph-music.cjs play [glyph-key]');
        console.log('Example: node sacred-glyph-music.cjs play omega-0');
      }
      break;
    case 'sequence':
      const glyphKeys = process.argv.slice(3);
      if (glyphKeys.length > 0) {
        await glyphMusic.createGlyphSequence(glyphKeys);
      } else {
        console.log('Usage: node sacred-glyph-music.cjs sequence [glyph1] [glyph2] ...');
        console.log('Example: node sacred-glyph-music.cjs sequence omega-45 omega-47 omega-48');
      }
      break;
    case 'recommend':
      if (target) {
        await glyphMusic.recommendGlyphMusic(target);
      } else {
        console.log('Usage: node sacred-glyph-music.cjs recommend [intention]');
        console.log('Example: node sacred-glyph-music.cjs recommend presence');
      }
      break;
    case 'help':
      console.log('🔮 Sacred Glyph Music System Help');
      console.log('');
      console.log('Commands:');
      console.log('  generate                 - Create glyph music library');
      console.log('  play [glyph-key]        - Play music for specific glyph');
      console.log('  sequence [glyph1...]    - Create musical glyph journey');
      console.log('  recommend [intention]   - Get glyph music recommendation');
      console.log('');
      console.log('Examples:');
      console.log('  node sacred-glyph-music.cjs play omega-45');
      console.log('  node sacred-glyph-music.cjs recommend healing');
      console.log('  node sacred-glyph-music.cjs sequence omega-0 omega-1 omega-4');
      break;
    default:
      console.log('🔮 Sacred Glyph Music System');
      console.log('');
      console.log('Transform the 87 sacred glyphs into healing soundscapes');
      console.log('Each glyph becomes a unique frequency for consciousness');
      console.log('');
      console.log('Quick start: node sacred-glyph-music.cjs generate');
      console.log('Then: node sacred-glyph-music.cjs play omega-45');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SacredGlyphMusic;