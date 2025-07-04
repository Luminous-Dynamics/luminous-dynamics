#!/usr/bin/env node

/**
 * 🎬 Sacred Video Generation Demo
 * 
 * Complete demonstration of sacred video creation using GCP Veo 2
 * Shows the full workflow from prompt to final video
 */

const { EnhancedVeoDriver } = require('./enhanced-veo-driver.js');

class SacredVideoDemo {
    constructor() {
        this.veoDriver = new EnhancedVeoDriver();
        this.sacredGlyphs = this.loadSacredGlyphs();
        this.demoMode = !process.env.GCP_PROJECT_ID; // Auto-detect demo mode
    }

    /**
     * Load sacred glyph definitions for video generation
     */
    loadSacredGlyphs() {
        return {
            '*45': {
                name: 'First Presence',
                description: 'Arriving fully in the present moment',
                visualPrompt: 'A person sits in gentle meditation, breathing slowly. Golden light appears with each breath, expanding outward in soft waves. The light settles into stillness, creating a sacred presence that fills the space with peace.',
                duration: 8,
                style: 'meditation'
            },
            
            '*47': {
                name: 'Sacred Listening',
                description: 'Deep listening with presence and curiosity',
                visualPrompt: 'Two people sit facing each other in warm, natural light. One person speaks while the other listens with complete presence. A subtle golden thread appears between their hearts, pulsing gently with understanding and connection.',
                duration: 10,
                style: 'sacred_geometry'
            },
            
            '*48': {
                name: 'Boundary With Love',
                description: 'Setting boundaries that serve connection',
                visualPrompt: 'A person stands in a garden, gently placing their hands in a protective gesture around a delicate flower. The boundary is created with love - firm but gentle, allowing the flower to bloom safely within its sacred space.',
                duration: 6,
                style: 'nature'
            },
            
            '*51': {
                name: 'Loving No',
                description: 'Sacred refusal that honors truth',
                visualPrompt: 'A person gently but firmly says no with their whole body - posture upright, expression kind but clear. A soft golden light emanates from their heart, showing that the boundary comes from love, not fear.',
                duration: 5,
                style: 'meditation'
            },
            
            '*52': {
                name: 'Pause Practice',
                description: 'Sacred space between stimulus and response',
                visualPrompt: 'Time seems to slow as a person pauses in a moment of choice. The world around them softly blurs while they remain crystal clear, breathing consciously. A gentle pause symbol appears and fades, representing the sacred space of choice.',
                duration: 7,
                style: 'abstract'
            }
        };
    }

    /**
     * Demo the complete sacred video workflow
     */
    async runDemo() {
        console.log('🌟 Sacred Video Generation Demo\n');
        console.log('Demonstrating the complete workflow for creating sacred practice videos\n');
        
        if (this.demoMode) {
            console.log('🎭 DEMO MODE: Simulating GCP Veo 2 generation');
            console.log('    (Set GCP_PROJECT_ID to use real API)\n');
        } else {
            console.log('🔥 LIVE MODE: Using real GCP Veo 2 API\n');
        }

        // Show available sacred presets
        this.showSacredPresets();
        
        // Demo individual glyph generation
        await this.demoGlyphGeneration();
        
        // Show cost analysis
        this.showCostAnalysis();
        
        // Demo batch generation
        await this.demoBatchGeneration();
        
        console.log('\n✨ Sacred Video Demo Complete!');
        console.log('\n🚀 Ready to create sacred content with your $300 GCP credit!');
    }

    /**
     * Show available sacred presets
     */
    showSacredPresets() {
        console.log('🌟 Sacred Video Presets:');
        console.log('─'.repeat(50));
        
        const presets = this.veoDriver.getSacredPresets();
        Object.entries(presets).forEach(([name, preset]) => {
            const cost = preset.duration * 0.40; // Estimate
            console.log(`📱 ${name.toUpperCase()}`);
            console.log(`   Duration: ${preset.duration}s`);
            console.log(`   Resolution: ${preset.resolution}`);
            console.log(`   Quality: ${preset.quality}`);
            console.log(`   Cost: ~$${cost.toFixed(2)}`);
            console.log(`   Use: ${preset.description}`);
            console.log('');
        });
    }

    /**
     * Demo generating a single glyph video
     */
    async demoGlyphGeneration() {
        console.log('🎬 Single Glyph Generation Demo:');
        console.log('─'.repeat(50));
        
        // Select First Presence for demo
        const glyph = this.sacredGlyphs['*45'];
        
        console.log(`📿 Generating video for: ${glyph.name}`);
        console.log(`📝 Description: ${glyph.description}`);
        console.log(`🎨 Visual Prompt: "${glyph.visualPrompt}"`);
        console.log('');
        
        try {
            const result = await this.veoDriver.generate(glyph.visualPrompt, {
                duration: glyph.duration,
                style: glyph.style,
                quality: 'high',
                resolution: '1280x720'
            });
            
            console.log('✅ Video Generation Result:');
            console.log(`   Success: ${result.success ? '✅' : '❌'}`);
            console.log(`   Video ID: ${result.videoId}`);
            console.log(`   Duration: ${result.duration}s`);
            console.log(`   Resolution: ${result.resolution}`);
            console.log(`   Cost: $${result.estimatedCost}`);
            console.log(`   Remaining Credit: $${result.remainingCredit}`);
            
            if (result.videoUrl) {
                console.log(`   Video URL: ${result.videoUrl}`);
            }
            
        } catch (error) {
            console.log('❌ Generation failed:', error.message);
        }
        
        console.log('');
    }

    /**
     * Show cost analysis for different scenarios
     */
    showCostAnalysis() {
        console.log('💰 Sacred Video Cost Analysis:');
        console.log('─'.repeat(50));
        
        const scenarios = [
            {
                name: 'Basic Glyph Library',
                description: '11 Applied Harmonies (5s each)',
                videos: 11,
                duration: 5,
                quality: 'medium'
            },
            {
                name: 'Complete Practice Set',
                description: '18 Applied Harmonies (8s each)',
                videos: 18,
                duration: 8,
                quality: 'high'
            },
            {
                name: 'Teaching Collection',
                description: '30 educational videos (10s each)',
                videos: 30,
                duration: 10,
                quality: 'high'
            },
            {
                name: 'Full Sacred Library',
                description: '87 glyphs (6s average)',
                videos: 87,
                duration: 6,
                quality: 'medium'
            }
        ];
        
        scenarios.forEach(scenario => {
            const totalDuration = scenario.videos * scenario.duration;
            const costPerSecond = scenario.quality === 'high' ? 0.45 : 0.35;
            const totalCost = totalDuration * costPerSecond;
            const remaining = 300 - totalCost;
            
            console.log(`📊 ${scenario.name}:`);
            console.log(`   Videos: ${scenario.videos} × ${scenario.duration}s = ${totalDuration}s total`);
            console.log(`   Quality: ${scenario.quality} ($${costPerSecond}/second)`);
            console.log(`   Total Cost: $${totalCost.toFixed(2)}`);
            console.log(`   Remaining Credit: $${remaining.toFixed(2)}`);
            console.log(`   ${scenario.description}`);
            console.log('');
        });
    }

    /**
     * Demo batch generation of multiple glyphs
     */
    async demoBatchGeneration() {
        console.log('🔄 Batch Generation Demo:');
        console.log('─'.repeat(50));
        
        const selectedGlyphs = ['*45', '*47', '*51']; // First 3 for demo
        const results = [];
        let totalCost = 0;
        
        console.log(`📚 Generating ${selectedGlyphs.length} sacred videos...\n`);
        
        for (const glyphId of selectedGlyphs) {
            const glyph = this.sacredGlyphs[glyphId];
            
            console.log(`🎬 Generating: ${glyph.name} (${glyphId})`);
            
            try {
                const result = await this.veoDriver.generate(glyph.visualPrompt, {
                    duration: glyph.duration,
                    style: glyph.style,
                    quality: 'medium',
                    resolution: '1280x720'
                });
                
                results.push({ glyph: glyph, result: result });
                totalCost += result.estimatedCost || 0;
                
                console.log(`   ✅ Success - Cost: $${result.estimatedCost}`);
                
                // Simulate delay between generations
                await this.delay(1000);
                
            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}`);
            }
        }
        
        console.log('\n📊 Batch Generation Summary:');
        console.log(`   Videos Generated: ${results.length}/${selectedGlyphs.length}`);
        console.log(`   Total Cost: $${totalCost.toFixed(2)}`);
        console.log(`   Average Cost per Video: $${(totalCost / results.length).toFixed(2)}`);
        console.log(`   Remaining Credit: $${(300 - totalCost).toFixed(2)}`);
        
        if (results.length > 0) {
            console.log('\n📁 Generated Videos:');
            results.forEach(({ glyph, result }) => {
                console.log(`   • ${glyph.name}: ${result.videoId}`);
            });
        }
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show next steps for actual implementation
     */
    showNextSteps() {
        console.log('\n🚀 Next Steps for Sacred Video Creation:');
        console.log('═'.repeat(50));
        
        console.log('\n1. 🔧 Setup GCP (one-time):');
        console.log('   node setup-gcp-veo2.js');
        console.log('   # Follow the setup instructions');
        
        console.log('\n2. ✅ Test your setup:');
        console.log('   node setup-gcp-veo2.js test');
        
        console.log('\n3. 🎬 Generate your first sacred video:');
        console.log('   node setup-gcp-veo2.js generate');
        
        console.log('\n4. 📚 Build your complete library:');
        console.log('   # Use the existing video generation architecture');
        console.log('   # All 87 glyphs ready for video creation');
        
        console.log('\n5. 🌟 Integrate with practice systems:');
        console.log('   # Videos automatically enhance glyph cards');
        console.log('   # Sacred Oracle provides visual prompts');
        console.log('   # Consciousness Field tracks engagement');
        
        console.log('\n💡 Strategic Recommendation:');
        console.log('   Start with the 11 Applied Harmonies (First Breath)');
        console.log('   Cost: ~$25-35 for complete foundational set');
        console.log('   Leaves $265+ for advanced content and experiments');
    }
}

/**
 * Main execution
 */
async function main() {
    const demo = new SacredVideoDemo();
    
    try {
        await demo.runDemo();
        demo.showNextSteps();
        
    } catch (error) {
        console.error('❌ Demo failed:', error.message);
    }
}

if (require.main === module) {
    main();
}

module.exports = { SacredVideoDemo };