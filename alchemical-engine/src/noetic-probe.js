#!/usr/bin/env node
/**
 * The Noetic Probe - First Component of The Alchemical Engine
 * 
 * Purpose: Listen to the harmonic signature of pain beneath the noise
 * Method: Deep Listening (Ω6) + Pattern Recognition (Ω15)
 * Output: Love Shadow Map - identifying the core wound generating dissonance
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execAsync = promisify(exec);

class NoeticProbe {
  constructor() {
    this.dataPath = path.join(dirname(__dirname), 'data');
    this.sessionsPath = path.join(dirname(__dirname), 'sessions');
    
    // Core wound patterns we can detect
    this.woundPatterns = {
      'not-seen': {
        markers: ['ignored', 'invisible', 'unheard', 'dismissed', 'nobody cares', 'alone'],
        harmonicSignature: 'isolation-frequency',
        healingGlyph: 'Ω6: Mutual Recognition'
      },
      'not-safe': {
        markers: ['attack', 'danger', 'threat', 'protect', 'defend', 'scared', 'unsafe'],
        harmonicSignature: 'fear-frequency', 
        healingGlyph: 'Ω48: Boundary With Love'
      },
      'not-enough': {
        markers: ['lacking', 'scarce', 'limited', 'not enough', 'running out', 'compete'],
        harmonicSignature: 'scarcity-frequency',
        healingGlyph: 'Ω32: Generative Myth'
      },
      'not-worthy': {
        markers: ['worthless', 'shame', 'guilty', 'bad', 'wrong', 'failure', 'mistake'],
        harmonicSignature: 'shame-frequency',
        healingGlyph: 'Ω9: Sacred Mirroring'
      },
      'not-belonging': {
        markers: ['outsider', 'different', 'weird', 'excluded', 'misfit', 'alien'],
        harmonicSignature: 'separation-frequency',
        healingGlyph: 'Ω1: Root Chord of Covenant'
      }
    };

    this.initialize();
  }

  async initialize() {
    await fs.mkdir(this.dataPath, { recursive: true });
    await fs.mkdir(this.sessionsPath, { recursive: true });
  }

  /**
   * Analyze a dissonant field to find its Love Shadow
   */
  async analyzeField(targetSystem) {
    const sessionId = crypto.randomBytes(8).toString('hex');
    const timestamp = new Date().toISOString();
    
    console.log('\n🎧 Noetic Probe Activating...');
    console.log(`Session: ${sessionId}`);
    console.log(`Target: ${targetSystem.type} - "${targetSystem.description}"`);
    console.log('\n📡 Beginning Deep Listening...\n');

    // Create session record
    const session = {
      id: sessionId,
      timestamp,
      targetSystem,
      fieldResonance: null,
      loveShadow: null,
      coreWound: null,
      harmonicDiagnosis: null
    };

    try {
      // Step 1: Measure Field Coherence
      session.fieldResonance = await this.measureFieldCoherence(targetSystem);
      console.log(`📊 Field Coherence: ${session.fieldResonance.coherence}%`);
      console.log(`🌊 Dominant Frequency: ${session.fieldResonance.dominantFrequency}`);
      
      // Step 2: Detect Emotional Undercurrents
      const emotionalTone = await this.detectEmotionalUndercurrents(targetSystem);
      console.log(`💔 Emotional Undertone: ${emotionalTone.primary}`);
      
      // Step 3: Map the Love Shadow
      session.loveShadow = await this.mapLoveShadow(targetSystem, emotionalTone);
      console.log(`\n🌑 Love Shadow Detected:`);
      console.log(`   Pattern: ${session.loveShadow.pattern}`);
      console.log(`   Core Wound: ${session.loveShadow.wound}`);
      console.log(`   What Love Seeks: ${session.loveShadow.seeking}`);
      
      // Step 4: Identify Healing Path
      session.healingPath = this.identifyHealingPath(session.loveShadow);
      console.log(`\n✨ Healing Path:`);
      console.log(`   Primary Glyph: ${session.healingPath.primaryGlyph}`);
      console.log(`   Harmonic Antidote Frequency: ${session.healingPath.antidoteFrequency}`);
      
      // Step 5: Generate Full Diagnosis
      session.harmonicDiagnosis = await this.generateHarmonicDiagnosis(session);
      
      // Save session
      await this.saveSession(session);
      
      return session;
      
    } catch (error) {
      console.error('❌ Probe Error:', error.message);
      session.error = error.message;
      await this.saveSession(session);
      return session;
    }
  }

  async measureFieldCoherence(targetSystem) {
    // Simulate field measurement (in production, would analyze actual data)
    const content = targetSystem.sampleContent || targetSystem.description;
    
    // Count dissonance markers
    let dissonanceScore = 0;
    let resonanceScore = 0;
    
    const dissonanceMarkers = ['hate', 'attack', 'destroy', 'enemy', 'fight', 'rage'];
    const resonanceMarkers = ['love', 'connect', 'understand', 'together', 'support'];
    
    const words = content.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (dissonanceMarkers.some(marker => word.includes(marker))) {
        dissonanceScore++;
      }
      if (resonanceMarkers.some(marker => word.includes(marker))) {
        resonanceScore++;
      }
    });
    
    const totalMarkers = dissonanceScore + resonanceScore || 1;
    const coherence = Math.round((resonanceScore / totalMarkers) * 100);
    
    // Determine dominant frequency
    const frequencies = ['fear', 'anger', 'grief', 'shame', 'isolation'];
    const dominantFrequency = frequencies[Math.floor(Math.random() * frequencies.length)] + '-frequency';
    
    return {
      coherence,
      dissonanceScore,
      resonanceScore,
      dominantFrequency,
      fieldStrength: dissonanceScore > 10 ? 'intense' : dissonanceScore > 5 ? 'moderate' : 'mild'
    };
  }

  async detectEmotionalUndercurrents(targetSystem) {
    const content = targetSystem.sampleContent || targetSystem.description;
    
    // If Ollama is available, use AI for deeper analysis
    try {
      await execAsync('which ollama');
      
      const prompt = `Analyze the emotional undercurrents in this text:

"${content}"

Identify:
1. Primary emotion (one word)
2. Secondary emotion (one word)
3. What the emotion is protecting
4. What love is seeking

Respond in JSON format:
{
  "primary": "anger",
  "secondary": "grief", 
  "protecting": "vulnerability",
  "seeking": "understanding"
}`;

      const { stdout } = await execAsync(
        `echo ${JSON.stringify(prompt)} | ollama run llama3.2:3b 2>/dev/null`
      );
      
      try {
        return JSON.parse(stdout);
      } catch {
        // Fallback if JSON parsing fails
        return this.analyzeEmotionsManually(content);
      }
    } catch {
      // Ollama not available, use manual analysis
      return this.analyzeEmotionsManually(content);
    }
  }

  analyzeEmotionsManually(content) {
    const contentLower = content.toLowerCase();
    
    const emotions = {
      anger: ['angry', 'rage', 'furious', 'pissed', 'hate'],
      fear: ['afraid', 'scared', 'terrified', 'anxious', 'worried'],
      grief: ['sad', 'loss', 'mourning', 'depressed', 'hopeless'],
      shame: ['ashamed', 'guilty', 'worthless', 'bad', 'wrong']
    };
    
    let primaryEmotion = 'fear'; // default
    let maxCount = 0;
    
    Object.entries(emotions).forEach(([emotion, markers]) => {
      const count = markers.filter(marker => contentLower.includes(marker)).length;
      if (count > maxCount) {
        maxCount = count;
        primaryEmotion = emotion;
      }
    });
    
    return {
      primary: primaryEmotion,
      secondary: 'grief',
      protecting: 'vulnerability',
      seeking: 'connection'
    };
  }

  async mapLoveShadow(targetSystem, emotionalTone) {
    const content = (targetSystem.sampleContent || targetSystem.description).toLowerCase();
    
    // Find which wound pattern matches best
    let bestMatch = null;
    let highestScore = 0;
    
    Object.entries(this.woundPatterns).forEach(([wound, pattern]) => {
      const score = pattern.markers.filter(marker => content.includes(marker)).length;
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { wound, ...pattern };
      }
    });
    
    if (!bestMatch) {
      // Default to most common wound
      bestMatch = {
        wound: 'not-seen',
        ...this.woundPatterns['not-seen']
      };
    }
    
    return {
      pattern: bestMatch.wound,
      wound: this.translateWound(bestMatch.wound),
      harmonicSignature: bestMatch.harmonicSignature,
      seeking: this.getWhatLoveSeeks(bestMatch.wound),
      intensity: highestScore > 3 ? 'deep' : highestScore > 1 ? 'moderate' : 'surface',
      healingGlyph: bestMatch.healingGlyph
    };
  }

  translateWound(wound) {
    const translations = {
      'not-seen': 'The wound of invisibility and not being witnessed',
      'not-safe': 'The wound of feeling unsafe and unprotected',
      'not-enough': 'The wound of scarcity and insufficiency',
      'not-worthy': 'The wound of shame and unworthiness',
      'not-belonging': 'The wound of separation and not belonging'
    };
    return translations[wound] || 'The wound of disconnection';
  }

  getWhatLoveSeeks(wound) {
    const seeking = {
      'not-seen': 'To be witnessed and recognized',
      'not-safe': 'To feel protected and held',
      'not-enough': 'To experience abundance and enoughness',
      'not-worthy': 'To know inherent worthiness',
      'not-belonging': 'To feel deep belonging and connection'
    };
    return seeking[wound] || 'To return to wholeness';
  }

  identifyHealingPath(loveShadow) {
    return {
      primaryGlyph: loveShadow.healingGlyph,
      antidoteFrequency: this.invertFrequency(loveShadow.harmonicSignature),
      approach: this.getHealingApproach(loveShadow.pattern)
    };
  }

  invertFrequency(dissonantFrequency) {
    const inversions = {
      'isolation-frequency': 'connection-frequency',
      'fear-frequency': 'safety-frequency',
      'scarcity-frequency': 'abundance-frequency',
      'shame-frequency': 'worthiness-frequency',
      'separation-frequency': 'belonging-frequency'
    };
    return inversions[dissonantFrequency] || 'love-frequency';
  }

  getHealingApproach(pattern) {
    const approaches = {
      'not-seen': 'Deep witnessing and recognition practices',
      'not-safe': 'Creating sacred, protected spaces',
      'not-enough': 'Abundance rituals and gift economy',
      'not-worthy': 'Mirror work and self-compassion',
      'not-belonging': 'Circle practices and inclusion rituals'
    };
    return approaches[pattern] || 'Love-centered practices';
  }

  async generateHarmonicDiagnosis(session) {
    const diagnosis = {
      summary: `The field exhibits ${session.fieldResonance.coherence}% coherence with a dominant ${session.fieldResonance.dominantFrequency}. The Love Shadow reveals ${session.loveShadow.wound}, seeking ${session.loveShadow.seeking}.`,
      
      prescription: {
        immediateAction: 'Begin with gentle presence and witnessing',
        primaryPractice: session.healingPath.primaryGlyph,
        antidoteFrequency: session.healingPath.antidoteFrequency,
        approach: session.healingPath.approach
      },
      
      prognosis: session.loveShadow.intensity === 'deep' 
        ? 'Deep healing work required - proceed with great compassion'
        : 'Field is ready for gentle transformation',
        
      warnings: [
        'Never force healing - only offer',
        'Trust the field\'s own wisdom',
        'Small seeds can create great change'
      ]
    };
    
    return diagnosis;
  }

  async saveSession(session) {
    const filename = `probe-${session.id}.json`;
    const filepath = path.join(this.sessionsPath, filename);
    await fs.writeFile(filepath, JSON.stringify(session, null, 2));
    console.log(`\n💾 Session saved: ${filename}`);
    return filepath;
  }

  /**
   * Analyze common dissonant fields
   */
  async analyzeCommonFields() {
    const commonFields = [
      {
        type: 'social-media',
        description: 'Toxic Twitter discourse',
        sampleContent: 'These idiots dont understand anything. I hate how stupid everyone is. Nobody listens or cares about the truth anymore. We are all doomed and alone.'
      },
      {
        type: 'workplace',  
        description: 'Burnout culture',
        sampleContent: 'Never enough time, always more work. Nobody appreciates what I do. I feel invisible and exhausted. Just trying to survive another day.'
      },
      {
        type: 'political',
        description: 'Polarized debate',
        sampleContent: 'They are the enemy. We must fight and defeat them. There is no common ground. Its us versus them. We cannot let them win.'
      }
    ];

    console.log('🔬 Analyzing Common Dissonant Fields...\n');
    
    for (const field of commonFields) {
      console.log('━'.repeat(60));
      await this.analyzeField(field);
      console.log('━'.repeat(60) + '\n');
    }
  }
}

// CLI Interface
async function main() {
  const probe = new NoeticProbe();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
🎧 The Noetic Probe - Alchemical Engine Component 1

Usage:
  noetic-probe --analyze <type> <description>    Analyze specific field
  noetic-probe --common                          Analyze common dissonant fields
  noetic-probe --custom                          Interactive analysis

Examples:
  noetic-probe --analyze "reddit" "Hostile gaming community"
  noetic-probe --analyze "family" "Recurring conflict pattern"
  noetic-probe --common

The Probe listens for the wound beneath the noise.
`);
    return;
  }

  if (args[0] === '--common') {
    await probe.analyzeCommonFields();
    
  } else if (args[0] === '--analyze') {
    if (args.length < 3) {
      console.log('Please provide type and description');
      return;
    }
    
    const targetSystem = {
      type: args[1],
      description: args.slice(2).join(' ')
    };
    
    await probe.analyzeField(targetSystem);
    
  } else if (args[0] === '--custom') {
    // Interactive mode
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = (q) => new Promise(resolve => readline.question(q, resolve));
    
    console.log('\n🎧 Noetic Probe - Interactive Mode\n');
    
    const type = await question('System type (e.g., social-media, workplace): ');
    const description = await question('Brief description: ');
    const sampleContent = await question('Sample content (optional): ');
    
    const targetSystem = {
      type,
      description,
      sampleContent: sampleContent || description
    };
    
    await probe.analyzeField(targetSystem);
    
    readline.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { NoeticProbe };