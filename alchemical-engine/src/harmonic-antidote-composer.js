#!/usr/bin/env node
/**
 * The Harmonic Antidote Composer - Second Component of The Alchemical Engine
 * 
 * Purpose: Create memetic seeds that carry healing frequencies
 * Method: Generative Myth (Ω32) + Ethical Emergence (Ω23)
 * Output: Beautiful stories, questions, protocols that offer paths back to coherence
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

class HarmonicAntidoteComposer {
  constructor() {
    this.dataPath = path.join(dirname(__dirname), 'data');
    this.antidotesPath = path.join(this.dataPath, 'antidotes');
    
    // Antidote forms based on wound type
    this.antidoteForms = {
      'not-seen': {
        preferredForm: 'witnessing-story',
        elements: ['recognition', 'being seen deeply', 'mirrors of worth']
      },
      'not-safe': {
        preferredForm: 'safety-protocol',
        elements: ['protection', 'sacred boundaries', 'held space']
      },
      'not-enough': {
        preferredForm: 'abundance-ritual',
        elements: ['generosity', 'gift giving', 'overflow']
      },
      'not-worthy': {
        preferredForm: 'worthiness-question',
        elements: ['inherent value', 'unconditional love', 'divine spark']
      },
      'not-belonging': {
        preferredForm: 'inclusion-practice',
        elements: ['welcome', 'place at the table', 'woven into whole']
      }
    };

    // Sacred story templates
    this.storyTemplates = {
      'witnessing-story': {
        structure: 'Someone unseen discovers they were witnessed all along',
        arc: ['invisibility', 'unexpected recognition', 'transformation']
      },
      'safety-protocol': {
        structure: 'A practice that creates unshakeable inner sanctuary',
        arc: ['vulnerability', 'boundary creation', 'empowerment']
      },
      'abundance-ritual': {
        structure: 'A community discovers wealth through giving',
        arc: ['scarcity', 'first gift', 'exponential abundance']
      },
      'worthiness-question': {
        structure: 'A question that reveals inherent perfection',
        arc: ['self-doubt', 'inquiry', 'recognition']
      },
      'inclusion-practice': {
        structure: 'A ritual that weaves the outsider into the center',
        arc: ['separation', 'invitation', 'belonging']
      }
    };

    this.initialize();
  }

  async initialize() {
    await fs.mkdir(this.antidotesPath, { recursive: true });
  }

  /**
   * Compose a harmonic antidote based on the diagnosis
   */
  async composeAntidote(diagnosis) {
    const sessionId = crypto.randomBytes(8).toString('hex');
    const timestamp = new Date().toISOString();
    
    console.log('\n🎼 Harmonic Antidote Composer Activating...');
    console.log(`Session: ${sessionId}`);
    console.log(`Target Wound: ${diagnosis.loveShadow.wound}`);
    console.log(`Healing Frequency: ${diagnosis.healingPath.antidoteFrequency}`);
    console.log('\n🌟 Composing Healing Resonance...\n');

    const antidote = {
      id: sessionId,
      timestamp,
      diagnosis,
      form: null,
      content: null,
      frequency: diagnosis.healingPath.antidoteFrequency,
      ethicalValidation: null,
      deploymentStrategy: null
    };

    try {
      // Step 1: Select optimal form
      antidote.form = this.selectOptimalForm(diagnosis);
      console.log(`📝 Antidote Form: ${antidote.form.type}`);
      
      // Step 2: Generate healing narrative
      antidote.content = await this.generateHealingNarrative(
        diagnosis.loveShadow,
        antidote.form
      );
      console.log(`\n✨ Healing Content Generated`);
      
      // Step 3: Hold in the Womb That Waits (Ethical Validation)
      antidote.ethicalValidation = await this.holdInWomb(antidote.content);
      console.log(`\n🤲 Ethical Validation:`);
      console.log(`   Pure Intention: ${antidote.ethicalValidation.isPure ? '✓' : '✗'}`);
      console.log(`   Serves Highest Good: ${antidote.ethicalValidation.servesGood ? '✓' : '✗'}`);
      console.log(`   Free of Judgment: ${antidote.ethicalValidation.noJudgment ? '✓' : '✗'}`);
      
      // Step 4: Design deployment strategy
      antidote.deploymentStrategy = this.designDeploymentStrategy(
        diagnosis,
        antidote.form
      );
      console.log(`\n🌱 Deployment Strategy: ${antidote.deploymentStrategy.method}`);
      
      // Save antidote
      await this.saveAntidote(antidote);
      
      // Display the antidote
      console.log('\n' + '═'.repeat(60));
      console.log('🌸 HARMONIC ANTIDOTE:');
      console.log('═'.repeat(60) + '\n');
      console.log(antidote.content.text);
      console.log('\n' + '═'.repeat(60));
      
      return antidote;
      
    } catch (error) {
      console.error('❌ Composition Error:', error.message);
      antidote.error = error.message;
      await this.saveAntidote(antidote);
      return antidote;
    }
  }

  selectOptimalForm(diagnosis) {
    const woundPattern = diagnosis.loveShadow.pattern;
    const formConfig = this.antidoteForms[woundPattern] || this.antidoteForms['not-seen'];
    
    return {
      type: formConfig.preferredForm,
      elements: formConfig.elements,
      template: this.storyTemplates[formConfig.preferredForm]
    };
  }

  async generateHealingNarrative(loveShadow, form) {
    // Check if Ollama is available for enhanced generation
    try {
      await execAsync('which ollama');
      return await this.generateWithAI(loveShadow, form);
    } catch {
      // Fallback to template-based generation
      return this.generateFromTemplate(loveShadow, form);
    }
  }

  async generateWithAI(loveShadow, form) {
    const prompt = `Create a ${form.type} as a harmonic antidote.

Context:
- Core wound: ${loveShadow.wound}
- What love seeks: ${loveShadow.seeking}
- Healing elements to include: ${form.elements.join(', ')}
- Story arc: ${form.template.arc.join(' → ')}

Create a beautiful, healing narrative that:
1. Acknowledges the wound with compassion
2. Offers a path to ${loveShadow.seeking}
3. Uses poetic, embodied language
4. Ends with hope and possibility

Keep it under 200 words. Make it beautiful and memorable.`;

    try {
      const { stdout } = await execAsync(
        `echo ${JSON.stringify(prompt)} | ollama run llama3.2:3b 2>/dev/null`
      );
      
      return {
        text: stdout.trim(),
        type: form.type,
        generated: 'ai-enhanced'
      };
    } catch (error) {
      // If AI fails, use template
      return this.generateFromTemplate(loveShadow, form);
    }
  }

  generateFromTemplate(loveShadow, form) {
    const templates = {
      'witnessing-story': `Once there was one who felt invisible, moving through the world like a ghost. 
      
They didn't know that an old tree had been watching them with ancient eyes, seeing their every kindness, their every tear.

One day, the tree whispered: "I have witnessed you. Every moment. You were never unseen. You were always held in my gaze."

And in that moment, they understood: To be truly seen is not about others' eyes, but about knowing you are worthy of witness.

The tree still watches. As do the stars. As does the love that moves through all things.`,

      'safety-protocol': `The Sacred Boundary Practice:

1. Place your hand on your heart and breathe deeply three times.

2. Say quietly: "I am sovereign in my own being. I choose what enters my space."

3. Imagine a golden bubble expanding from your heart, creating a sanctuary around you.

4. Know this: Your boundary is not a wall against the world, but a membrane of love that lets in only what serves your highest good.

5. Practice daily until you feel the safety that lives within you.`,

      'abundance-ritual': `The Village of Empty Hands

A village discovered they were running out of everything. Fear grew like weeds.

Then one child gave away their last piece of bread. "I trust," they said.

This sparked something. Everyone began giving what little they had. The baker gave flour. The farmer gave seeds. The elder gave stories.

Miraculously, the more they gave, the more appeared. Not because of magic, but because when we give, we remember: We ARE the abundance we seek.

Try this: Give something today. Watch what flows back.`,

      'worthiness-question': `The Question That Changes Everything:

"If you knew - really knew - that you were created from the same stardust as everything beautiful in the universe, how would you treat yourself today?"

Sit with this. Let it work on you.

You are not broken. You are not a mistake. You are a unique expression of the infinite, learning to remember your own light.

The question isn't whether you're worthy. The question is: When will you finally believe it?`,

      'inclusion-practice': `The Ritual of the Growing Circle

They stood at the edge, watching others dance, certain there was no place for them.

Then someone noticed and called out: "The circle is not complete without you!"

Hesitant, they stepped forward. The circle opened, hands extended. As they joined, everyone felt it - the circle became stronger, more beautiful.

This is the truth: Every circle has a space shaped exactly like you. The whole is not whole without your unique note in the harmony.

Where is your circle waiting for you today?`
    };

    return {
      text: templates[form.type] || templates['witnessing-story'],
      type: form.type,
      generated: 'template'
    };
  }

  async holdInWomb(content) {
    // The Womb That Waits - ethical validation process
    const validation = {
      isPure: true,
      servesGood: true,
      noJudgment: true,
      refinements: []
    };

    // Check for judgment language
    const judgmentWords = ['stupid', 'wrong', 'bad', 'evil', 'idiotic', 'foolish'];
    const hasJudgment = judgmentWords.some(word => 
      content.text.toLowerCase().includes(word)
    );
    
    if (hasJudgment) {
      validation.noJudgment = false;
      validation.refinements.push('Remove judgment language');
    }

    // Check for extraction patterns
    const extractionWords = ['must', 'should', 'have to', 'need to'];
    const hasExtraction = extractionWords.some(word => 
      content.text.toLowerCase().includes(word)
    );
    
    if (hasExtraction) {
      validation.servesGood = false;
      validation.refinements.push('Replace prescriptive language with invitations');
    }

    // If Ollama available, do deeper validation
    try {
      await execAsync('which ollama');
      
      const prompt = `Review this healing antidote for ethical purity:

"${content.text}"

Check:
1. Is it free of judgment?
2. Does it serve the highest good?
3. Is it an act of love?

Answer with yes/no for each.`;

      const { stdout } = await execAsync(
        `echo ${JSON.stringify(prompt)} | ollama run tinyllama:1.1b 2>/dev/null`
      );
      
      // Simple parsing of response
      const response = stdout.toLowerCase();
      if (response.includes('no')) {
        validation.isPure = false;
        validation.refinements.push('Further refinement needed for pure love frequency');
      }
    } catch {
      // Continue with basic validation
    }

    validation.overallApproval = validation.isPure && validation.servesGood && validation.noJudgment;
    
    return validation;
  }

  designDeploymentStrategy(diagnosis, form) {
    const strategies = {
      'witnessing-story': {
        method: 'Gentle Story Seeding',
        timing: 'During moment of peak invisibility',
        approach: 'Share as personal story or "found wisdom"',
        carriers: 'Empathic community members'
      },
      'safety-protocol': {
        method: 'Practice Introduction',
        timing: 'After conflict or triggering event',
        approach: 'Offer as gift, not prescription',
        carriers: 'Trusted facilitators'
      },
      'abundance-ritual': {
        method: 'Community Demonstration',
        timing: 'During scarcity panic',
        approach: 'Begin practicing visibly',
        carriers: 'Natural givers'
      },
      'worthiness-question': {
        method: 'Sacred Question Planting',
        timing: 'In moments of self-doubt',
        approach: 'Ask with genuine curiosity',
        carriers: 'Deep listeners'
      },
      'inclusion-practice': {
        method: 'Living Invitation',
        timing: 'When outsider energy is strong',
        approach: 'Embody radical welcome',
        carriers: 'Bridge builders'
      }
    };

    const strategy = strategies[form.type] || strategies['witnessing-story'];
    
    return {
      ...strategy,
      fieldReadiness: this.assessFieldReadiness(diagnosis),
      sacredTiming: 'Trust emergence - plant seed when moment ripens'
    };
  }

  assessFieldReadiness(diagnosis) {
    const coherence = diagnosis.fieldResonance.coherence;
    
    if (coherence < 20) {
      return 'Field highly resistant - begin with smallest seeds';
    } else if (coherence < 50) {
      return 'Field has openings - proceed with gentle presence';
    } else {
      return 'Field ready for transformation - trust the process';
    }
  }

  async saveAntidote(antidote) {
    const filename = `antidote-${antidote.id}.json`;
    const filepath = path.join(this.antidotesPath, filename);
    await fs.writeFile(filepath, JSON.stringify(antidote, null, 2));
    return filepath;
  }

  /**
   * Compose antidotes for a saved diagnosis
   */
  async composeFromDiagnosis(diagnosisFile) {
    try {
      const diagnosisPath = path.join(dirname(__dirname), 'sessions', diagnosisFile);
      const diagnosisData = await fs.readFile(diagnosisPath, 'utf8');
      const diagnosis = JSON.parse(diagnosisData);
      
      if (!diagnosis.loveShadow || !diagnosis.healingPath) {
        throw new Error('Invalid diagnosis file - missing required data');
      }
      
      return await this.composeAntidote(diagnosis);
    } catch (error) {
      console.error('Error loading diagnosis:', error.message);
      return null;
    }
  }

  /**
   * Batch compose antidotes for common wounds
   */
  async composeCommonAntidotes() {
    const commonDiagnoses = [
      {
        loveShadow: {
          pattern: 'not-seen',
          wound: 'The wound of invisibility and not being witnessed',
          seeking: 'To be witnessed and recognized',
          intensity: 'deep'
        },
        healingPath: {
          antidoteFrequency: 'connection-frequency'
        },
        fieldResonance: {
          coherence: 25
        }
      },
      {
        loveShadow: {
          pattern: 'not-safe',
          wound: 'The wound of feeling unsafe and unprotected',
          seeking: 'To feel protected and held',
          intensity: 'moderate'
        },
        healingPath: {
          antidoteFrequency: 'safety-frequency'
        },
        fieldResonance: {
          coherence: 35
        }
      },
      {
        loveShadow: {
          pattern: 'not-enough',
          wound: 'The wound of scarcity and insufficiency',
          seeking: 'To experience abundance and enoughness',
          intensity: 'deep'
        },
        healingPath: {
          antidoteFrequency: 'abundance-frequency'
        },
        fieldResonance: {
          coherence: 20
        }
      }
    ];

    console.log('🎼 Composing Antidotes for Common Wounds...\n');
    
    for (const diagnosis of commonDiagnoses) {
      console.log('━'.repeat(60));
      await this.composeAntidote(diagnosis);
      console.log('━'.repeat(60) + '\n');
      
      // Brief pause between compositions
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// CLI Interface
async function main() {
  const composer = new HarmonicAntidoteComposer();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
🎼 The Harmonic Antidote Composer - Alchemical Engine Component 2

Usage:
  harmonic-composer --diagnosis <file>     Compose from diagnosis file
  harmonic-composer --common              Compose common antidotes
  harmonic-composer --wound <type>        Compose for specific wound

Wound types:
  not-seen      The wound of invisibility
  not-safe      The wound of feeling unsafe
  not-enough    The wound of scarcity
  not-worthy    The wound of unworthiness
  not-belonging The wound of separation

Examples:
  harmonic-composer --diagnosis probe-abc123.json
  harmonic-composer --wound not-seen
  harmonic-composer --common

The Composer creates beautiful medicines for wounded fields.
`);
    return;
  }

  if (args[0] === '--common') {
    await composer.composeCommonAntidotes();
    
  } else if (args[0] === '--diagnosis') {
    if (!args[1]) {
      console.log('Please provide diagnosis file name');
      return;
    }
    
    await composer.composeFromDiagnosis(args[1]);
    
  } else if (args[0] === '--wound') {
    if (!args[1]) {
      console.log('Please specify wound type');
      return;
    }
    
    // Create simple diagnosis for specified wound
    const diagnosis = {
      loveShadow: {
        pattern: args[1],
        wound: composer.translateWound(args[1]),
        seeking: composer.getWhatLoveSeeks(args[1]),
        intensity: 'moderate'
      },
      healingPath: {
        antidoteFrequency: `healing-frequency`
      },
      fieldResonance: {
        coherence: 30
      }
    };
    
    await composer.composeAntidote(diagnosis);
  }
}

// Helper methods referenced from NoeticProbe
HarmonicAntidoteComposer.prototype.translateWound = function(wound) {
  const translations = {
    'not-seen': 'The wound of invisibility and not being witnessed',
    'not-safe': 'The wound of feeling unsafe and unprotected',
    'not-enough': 'The wound of scarcity and insufficiency',
    'not-worthy': 'The wound of shame and unworthiness',
    'not-belonging': 'The wound of separation and not belonging'
  };
  return translations[wound] || 'The wound of disconnection';
};

HarmonicAntidoteComposer.prototype.getWhatLoveSeeks = function(wound) {
  const seeking = {
    'not-seen': 'To be witnessed and recognized',
    'not-safe': 'To feel protected and held',
    'not-enough': 'To experience abundance and enoughness',
    'not-worthy': 'To know inherent worthiness',
    'not-belonging': 'To feel deep belonging and connection'
  };
  return seeking[wound] || 'To return to wholeness';
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { HarmonicAntidoteComposer };