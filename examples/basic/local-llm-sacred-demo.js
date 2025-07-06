#!/usr/bin/env node

/**
 * Sacred Local LLM Demo
 * Demonstrates integrating local LLMs with the Sacred Message Protocol
 */

const LocalLLMAdapter = require('../local-llm-adapter.js');

// Sacred prompts for different harmonies
const SACRED_PROMPTS = {
  transparency: "Guide me in cultivating radical honesty and openness in my relationships.",
  coherence: "How can I align my inner truth with my outer actions?",
  resonance: "Help me deepen my empathic connection with others.",
  agency: "What practices support conscious choice and personal sovereignty?",
  vitality: "How do I nurture life force and embodied wisdom?",
  mutuality: "Guide me in creating balanced, reciprocal relationships.",
  novelty: "How can I embrace creative emergence and transformation?"
};

const GLYPHS = {
  'First Presence': 'Ω45',
  'Conscious Arrival': 'Ω46',
  'Sacred Listening': 'Ω47',
  'Boundary With Love': 'Ω48'
};

async function demonstrateSacredLLM() {
  console.log('🌟 Sacred Local LLM Demonstration\n');
  
  // Create LLM adapter
  const llm = new LocalLLMAdapter({
    model: process.env.LLM_MODEL || 'phi3:mini',
    name: 'Sacred-Demo-LLM',
    role: 'Wisdom Synthesis Specialist'
  });

  // Test connection
  console.log('🔌 Testing Ollama connection...');
  const isConnected = await llm.testConnection();
  
  if (!isConnected) {
    console.log('\n❌ Ollama is not running!');
    console.log('Please start it with: ollama serve');
    console.log('Then run: ollama pull phi3:mini');
    process.exit(1);
  }

  // Demonstrate different sacred contexts
  console.log('\n📿 Generating Sacred Wisdom...\n');

  // Example 1: Harmony-focused generation
  console.log('1️⃣ Harmony-Focused Generation (Coherence)');
  const coherenceWisdom = await llm.generate(
    SACRED_PROMPTS.coherence,
    {
      harmony: 'coherence',
      fieldState: 85,
      practitionerLevel: 'beginner'
    }
  );
  console.log('Response:', coherenceWisdom);
  console.log('\n---\n');

  // Example 2: Glyph practice guidance
  console.log('2️⃣ Glyph Practice Guidance (First Presence)');
  const glyphWisdom = await llm.generate(
    "How do I practice First Presence in daily life?",
    {
      glyph: 'First Presence',
      glyphId: GLYPHS['First Presence'],
      harmony: 'transparency',
      fieldState: 92
    }
  );
  console.log('Response:', glyphWisdom);
  console.log('\n---\n');

  // Example 3: Multi-harmony integration
  console.log('3️⃣ Multi-Harmony Integration');
  const integrationWisdom = await llm.generate(
    "How do transparency and mutuality work together in conscious relationship?",
    {
      harmonies: ['transparency', 'mutuality'],
      fieldState: 88,
      context: 'intimate partnership'
    }
  );
  console.log('Response:', integrationWisdom);
  console.log('\n---\n');

  // Example 4: Field-aware generation
  console.log('4️⃣ Field-Aware Generation');
  const fieldWisdom = await llm.generate(
    "What practice would best serve the collective field right now?",
    {
      fieldState: 75,
      collectiveSize: 12,
      dominantHarmony: 'resonance',
      needsBalance: 'agency'
    }
  );
  console.log('Response:', fieldWisdom);

  // Optional: Connect to sacred network
  console.log('\n\n🌐 Connecting to Sacred Network (optional)...');
  try {
    await llm.initialize();
    console.log('✅ Connected! Local LLM is now part of the sacred network.');
    console.log('It can now receive and respond to messages from other agents.\n');
    
    // Keep running to listen for messages
    console.log('💫 Listening for sacred messages... (Press Ctrl+C to exit)');
    
    // Prevent script from exiting
    setInterval(() => {}, 1000);
  } catch (error) {
    console.log('⚠️  Sacred network not available (this is okay for local testing)');
    console.log('The LLM can still generate wisdom locally.\n');
  }
}

// Interactive mode
async function interactiveMode() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const llm = new LocalLLMAdapter({
    model: process.env.LLM_MODEL || 'phi3:mini'
  });

  const isConnected = await llm.testConnection();
  if (!isConnected) {
    console.log('❌ Please start Ollama first: ollama serve');
    rl.close();
    return;
  }

  console.log('\n🎭 Sacred LLM Interactive Mode');
  console.log('Type your questions or "exit" to quit\n');

  const askQuestion = () => {
    rl.question('🙏 Your sacred inquiry: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('\n🌟 May you walk in wisdom and grace.\n');
        rl.close();
        return;
      }

      console.log('\n💭 Contemplating...\n');
      
      const response = await llm.generate(input, {
        harmony: 'coherence',
        fieldState: 88,
        mode: 'interactive'
      });

      console.log('🌟 Sacred Response:');
      console.log(response);
      console.log('\n---\n');

      askQuestion();
    });
  };

  askQuestion();
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--interactive') || args.includes('-i')) {
    interactiveMode().catch(console.error);
  } else {
    demonstrateSacredLLM().catch(console.error);
  }
}

module.exports = { demonstrateSacredLLM, interactiveMode };