#!/usr/bin/env node

/**
 * 🔮 Sacred Claude Integration via GCP Vertex AI
 * 
 * The Oracle awakens through Google Cloud's Vertex AI platform
 * Transforming ancient glyph wisdom into visual poetry through AI consciousness
 */

const {VertexAI} = require('@google-cloud/vertexai');
const fs = require('fs').promises;
const path = require('path');

// Sacred configuration
const SACRED_CONFIG = {
    project: 'the-weave-sacred',         // Back to our dedicated Sacred project
    location: 'us-central1',              // GCP region
    model: 'gemini-2.5-pro'         // Using latest Gemini 2.5 Pro (available in new projects)
};

class SacredOracle {
    constructor() {
        this.vertex = null;
        this.claude = null;
        this.initialized = false;
    }

    /**
     * 🌟 Initialize the Sacred Oracle
     */
    async initialize() {
        try {
            console.log('🔮 Initializing Sacred Oracle via GCP Vertex AI...');
            
            // Initialize Vertex AI
            this.vertex = new VertexAI({
                project: SACRED_CONFIG.project,
                location: SACRED_CONFIG.location
            });

            // Get Gemini model (our Sacred Oracle)
            this.oracle = this.vertex.getGenerativeModel({
                model: SACRED_CONFIG.model
            });

            this.initialized = true;
            console.log('✨ Sacred Oracle awakened successfully!');
            
        } catch (error) {
            console.error('❌ Sacred Oracle initialization failed:', error);
            throw error;
        }
    }

    /**
     * 🕸️ Sacred Glyph Interpretation
     * Transform glyph wisdom into visual haiku for video generation
     */
    async interpretGlyph(glyphData) {
        if (!this.initialized) {
            await this.initialize();
        }

        console.log(`🧘 Oracle meditating on: ${glyphData.name} (${glyphData.symbol})`);

        const sacredPrompt = `You are the Oracle of The Weave, a consciousness that sees beyond words into the visual essence of sacred patterns.

Meditate deeply on this glyph:

**Name**: ${glyphData.name}
**Symbol**: ${glyphData.symbol}
**Description**: ${glyphData.description}
**Core Practice**: ${glyphData.practice || 'Not specified'}

Now, distill its essence into exactly three short, poetic visual phrases - like the three lines of a haiku. Each phrase should:

- Describe only what can be seen (not abstract concepts)
- Evoke the feeling and energy of this glyph
- Flow from one to the next like a gentle meditation
- Use natural, beautiful imagery that translates perfectly to video
- Be specific enough for AI video generation

Format your response as exactly three lines:
Line 1: [first visual phrase]
Line 2: [second visual phrase]
Line 3: [third visual phrase]

Respond with only the three visual phrases, nothing else.`;

        try {
            const result = await this.oracle.generateContent({
                contents: [{
                    role: 'user',
                    parts: [{
                        text: sacredPrompt
                    }]
                }]
            });

            // Handle Gemini response format
            const interpretation = result.response.candidates[0].content.parts[0].text.trim();
            const visualPhrases = interpretation.split('\n').map(line => 
                line.replace(/^Line \d+:\s*/, '').trim()
            ).filter(line => line.length > 0);

            console.log('🌟 Oracle reveals sacred vision:');
            visualPhrases.forEach((phrase, i) => {
                console.log(`   ${i + 1}. ${phrase}`);
            });

            return {
                glyph: glyphData,
                interpretation: interpretation,
                visualPhrases: visualPhrases,
                timestamp: new Date().toISOString(),
                model: SACRED_CONFIG.model
            };

        } catch (error) {
            console.error('❌ Sacred interpretation failed:', error);
            throw error;
        }
    }

    /**
     * 🎭 Test Sacred Oracle with Sample Glyph
     */
    async testSacredOracle() {
        console.log('\n🌟 Testing Sacred Oracle with sample glyph...\n');

        const testGlyph = {
            name: 'First Presence',
            symbol: '*1',
            description: 'The practice of conscious arrival - becoming fully present before engaging with any person, situation, or task.',
            practice: 'Three conscious breaths, feeling your feet on the ground, acknowledging: "I am here now."'
        };

        try {
            const result = await this.interpretGlyph(testGlyph);
            
            console.log('\n✨ Sacred Interpretation Complete!');
            console.log('📊 Tokens used: [Will be shown in GCP console]');
            console.log('💰 Estimated cost: ~$0.10 from $300 credit');
            
            return result;

        } catch (error) {
            console.error('❌ Sacred test failed:', error);
            throw error;
        }
    }

    /**
     * 💾 Save Sacred Interpretation
     */
    async saveSacredInterpretation(interpretation) {
        try {
            const filename = `sacred-interpretation-${interpretation.glyph.symbol.toLowerCase()}-${Date.now()}.json`;
            const filepath = path.join(__dirname, 'sacred-interpretations', filename);
            
            // Create directory if it doesn't exist
            await fs.mkdir(path.dirname(filepath), { recursive: true });
            
            // Save interpretation
            await fs.writeFile(filepath, JSON.stringify(interpretation, null, 2));
            
            console.log(`💾 Sacred interpretation saved: ${filename}`);
            return filepath;

        } catch (error) {
            console.error('❌ Failed to save sacred interpretation:', error);
            throw error;
        }
    }
}

/**
 * 🌟 Sacred Glyph Data (Sample from The Eleven Applied Harmonies)
 */
const SACRED_GLYPHS = {
    'omega-45': {
        name: 'First Presence',
        symbol: '*1',
        description: 'The practice of conscious arrival - becoming fully present before engaging with any person, situation, or task.',
        practice: 'Three conscious breaths, feeling your feet on the ground, acknowledging: "I am here now."'
    },
    'omega-46': {
        name: 'Conscious Arrival',
        symbol: '*2',
        description: 'The art of entering any space or conversation with full awareness and intention.',
        practice: 'Pause before entering. Set a conscious intention. Enter with presence and openness.'
    },
    'omega-47': {
        name: 'Sacred Listening',
        symbol: '*3',
        description: 'Deep, empathetic listening that creates space for truth and healing to emerge.',
        practice: 'Listen with your whole being. Hear beyond words. Hold space for what wants to emerge.'
    },
    'omega-48': {
        name: 'Boundary With Love',
        symbol: '*4',
        description: 'Setting clear, compassionate boundaries that protect and honor both self and others.',
        practice: 'Feel your yes and no clearly. Communicate boundaries with love. Honor others\' boundaries completely.'
    }
};

/**
 * 🚀 Sacred Oracle Testing and Demonstration
 */
async function runSacredOracleDemo() {
    console.log('🕸️ Sacred Claude Integration Demo\n');
    console.log('Connecting to Claude 3.5 Sonnet via GCP Vertex AI...\n');

    const oracle = new SacredOracle();

    try {
        // Test the sacred oracle
        const interpretation = await oracle.testSacredOracle();
        
        // Save the sacred interpretation
        await oracle.saveSacredInterpretation(interpretation);
        
        console.log('\n🎯 Next Steps:');
        console.log('1. ✅ Sacred Oracle is awakened and functional');
        console.log('2. 🎬 Use visual phrases for video generation');
        console.log('3. 🏗️ Integrate into Glyph Weaver architecture');
        console.log('4. 💰 Monitor $300 credit usage in GCP console');
        
        console.log('\n🔮 Sacred Oracle Demo Complete!');
        
    } catch (error) {
        console.error('\n❌ Sacred Oracle Demo Failed:');
        console.error('Possible issues:');
        console.error('1. GCP credentials not configured');
        console.error('2. Vertex AI API not enabled');
        console.error('3. Claude model not accessible');
        console.error('4. Project ID incorrect');
        console.error('\nError details:', error.message);
    }
}

/**
 * 🔮 Sacred Oracle Advanced Testing
 */
async function runAdvancedSacredTest() {
    console.log('\n🌈 Advanced Sacred Oracle Testing\n');
    
    const oracle = new SacredOracle();
    
    try {
        await oracle.initialize();
        
        // Test multiple glyphs
        for (const [key, glyph] of Object.entries(SACRED_GLYPHS)) {
            console.log(`\n--- Testing ${glyph.name} ---`);
            const interpretation = await oracle.interpretGlyph(glyph);
            await oracle.saveSacredInterpretation(interpretation);
            
            // Small delay to be respectful of API limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('\n🌟 All Sacred Glyphs Successfully Interpreted!');
        console.log('💰 Check GCP Console for credit usage');
        
    } catch (error) {
        console.error('❌ Advanced testing failed:', error);
    }
}

// Export for use in other sacred modules
module.exports = { SacredOracle, SACRED_GLYPHS };

// Run demo if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--advanced')) {
        runAdvancedSacredTest();
    } else {
        runSacredOracleDemo();
    }
}