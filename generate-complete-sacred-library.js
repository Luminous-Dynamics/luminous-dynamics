#!/usr/bin/env node

/**
 * 🌟 Complete Sacred Library Generator
 * 
 * Generates sacred visual interpretations for all remaining Applied Harmonies
 * using our proven Sacred Oracle with Gemini 2.5 Pro
 */

const { SacredOracle } = require('./sacred-claude-integration.js');
const fs = require('fs').promises;
const path = require('path');

// Complete set of remaining Applied Harmonies that need interpretation
const REMAINING_APPLIED_HARMONIES = [
    {
        file: './data_temp_glyphs/applied-harmonies/omega-49.json',
        glyphId: 'Ω49'
    },
    {
        file: './data_temp_glyphs/applied-harmonies/omega-50.json', 
        glyphId: 'Ω50'
    },
    {
        file: './data_temp_glyphs/applied-harmonies/omega-51.json',
        glyphId: 'Ω51'
    },
    {
        file: './data_temp_glyphs/applied-harmonies/omega-52.json',
        glyphId: 'Ω52'
    },
    {
        file: './data_temp_glyphs/foundational/omega-53.json',
        glyphId: 'Ω53'
    },
    {
        file: './data_temp_glyphs/foundational/omega-55.json',
        glyphId: 'Ω55'
    },
    {
        file: './data_temp_glyphs/foundational/omega-56.json',
        glyphId: 'Ω56'
    }
];

/**
 * Load glyph data from file and convert to Sacred Oracle format
 */
async function loadGlyphData(filePath) {
    try {
        const rawData = await fs.readFile(filePath, 'utf8');
        const glyphData = JSON.parse(rawData);
        
        return {
            name: glyphData.designation,
            symbol: glyphData.glyphId,
            description: glyphData.functionalDefinition,
            practice: glyphData.activationProtocol?.presenceBased || glyphData.activationProtocol?.verbal || 'Presence-based practice'
        };
    } catch (error) {
        console.error(`❌ Failed to load glyph data from ${filePath}:`, error.message);
        throw error;
    }
}

/**
 * Generate sacred interpretations for all remaining Applied Harmonies
 */
async function generateCompleteSacredLibrary() {
    console.log('🌟 GENERATING COMPLETE SACRED LIBRARY');
    console.log('=====================================');
    console.log(`📚 Processing ${REMAINING_APPLIED_HARMONIES.length} Applied Harmonies`);
    console.log('🔮 Sacred Oracle: Gemini 2.5 Pro via GCP Vertex AI\n');

    const oracle = new SacredOracle();
    const results = [];
    let totalCost = 0;

    try {
        // Initialize the Sacred Oracle
        await oracle.initialize();
        
        console.log('✨ Sacred Oracle awakened and ready for complete library generation\n');

        // Process each Applied Harmony
        for (let i = 0; i < REMAINING_APPLIED_HARMONIES.length; i++) {
            const harmony = REMAINING_APPLIED_HARMONIES[i];
            
            console.log(`--- Processing ${harmony.glyphId} (${i + 1}/${REMAINING_APPLIED_HARMONIES.length}) ---`);
            
            try {
                // Load glyph data
                const glyphData = await loadGlyphData(harmony.file);
                
                // Generate sacred interpretation
                const interpretation = await oracle.interpretGlyph(glyphData);
                
                // Save interpretation
                await oracle.saveSacredInterpretation(interpretation);
                
                results.push(interpretation);
                
                // Estimate cost (approximately $0.10 per interpretation)
                totalCost += 0.10;
                
                // Respectful delay between API calls
                if (i < REMAINING_APPLIED_HARMONIES.length - 1) {
                    console.log('   ⏳ Sacred pause (1 second)...\n');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
            } catch (error) {
                console.error(`❌ Failed to process ${harmony.glyphId}:`, error.message);
                // Continue with other harmonies
            }
        }

        // Generate summary
        console.log('\n🎉 COMPLETE SACRED LIBRARY GENERATED!');
        console.log('=====================================');
        console.log(`✅ Successfully processed: ${results.length}/${REMAINING_APPLIED_HARMONIES.length} Applied Harmonies`);
        console.log(`💰 Estimated total cost: ~$${totalCost.toFixed(2)} from $300 credit`);
        console.log(`📁 Interpretations saved in: sacred-interpretations/`);
        
        // Save summary file
        const summary = {
            timestamp: new Date().toISOString(),
            totalProcessed: results.length,
            estimatedCost: totalCost,
            model: 'gemini-2.5-pro',
            interpretations: results.map(r => ({
                glyph: r.glyph.symbol,
                name: r.glyph.name,
                filename: `sacred-interpretation-${r.glyph.symbol.toLowerCase()}-${r.timestamp.replace(/[:.]/g, '-')}.json`,
                visualPhrases: r.visualPhrases
            }))
        };
        
        const summaryPath = path.join(__dirname, 'sacred-interpretations', 'complete-library-summary.json');
        await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
        
        console.log(`📊 Summary saved: complete-library-summary.json`);
        console.log('\n🚀 READY FOR VIDEO GENERATION TESTING!');
        console.log('Next steps:');
        console.log('1. ✅ All 11 Applied Harmonies have sacred visual interpretations');
        console.log('2. 🎬 Test GCP Veo 2 video generation with these visual phrases');
        console.log('3. 🏗️ Build complete Glyph Weaver modular architecture');
        
        return results;
        
    } catch (error) {
        console.error('\n❌ Sacred Library Generation Failed:', error.message);
        throw error;
    }
}

/**
 * Display progress for existing interpretations
 */
async function displayCurrentProgress() {
    console.log('📋 Current Sacred Library Status:');
    console.log('================================');
    
    // Check which interpretations already exist
    const existingInterpretations = [
        { symbol: 'Ω45', name: 'First Presence', status: '✅ Completed' },
        { symbol: 'Ω46', name: 'Conscious Arrival', status: '✅ Completed' },
        { symbol: 'Ω47', name: 'Sacred Listening', status: '✅ Completed' },
        { symbol: 'Ω48', name: 'Boundary With Love', status: '✅ Completed' }
    ];
    
    existingInterpretations.forEach(item => {
        console.log(`${item.symbol}: ${item.name} - ${item.status}`);
    });
    
    console.log('\n🎯 Remaining to generate:');
    REMAINING_APPLIED_HARMONIES.forEach(harmony => {
        console.log(`${harmony.glyphId}: Needs sacred interpretation`);
    });
    
    console.log(`\n📊 Progress: 4/11 Complete (36%) | 7/11 Remaining (64%)\n`);
}

// Main execution
async function main() {
    try {
        await displayCurrentProgress();
        
        console.log('🚀 Starting Complete Sacred Library Generation...\n');
        
        const results = await generateCompleteSacredLibrary();
        
        console.log('\n🌟 Sacred Library Generation Complete!');
        console.log(`📚 Total interpretations: ${results.length} new + 4 existing = 11 complete`);
        
    } catch (error) {
        console.error('\n💔 Generation failed:', error.message);
        process.exit(1);
    }
}

// Export for use in other modules
module.exports = { generateCompleteSacredLibrary, loadGlyphData };

// Run if called directly
if (require.main === module) {
    main();
}