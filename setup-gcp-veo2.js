#!/usr/bin/env node

/**
 * 🎬 GCP Veo 2 Setup & Test Script
 * 
 * Sets up and tests GCP Veo 2 video generation with your $300 free credits
 * Integrates with existing sacred video generation architecture
 */

const fs = require('fs').promises;
const path = require('path');

// Import existing architecture
const { VideoGenerationService } = require('./test-video-generation.js');

class GCPVeo2Setup {
    constructor() {
        this.projectId = null;
        this.apiKey = null;
        this.serviceAccountPath = null;
        this.setupComplete = false;
    }

    /**
     * Check current GCP setup status
     */
    async checkSetup() {
        console.log('🔍 Checking GCP Veo 2 setup status...\n');
        
        const checks = {
            'GCP Project ID': process.env.GCP_PROJECT_ID || null,
            'Google API Key': process.env.GOOGLE_API_KEY || null,
            'Service Account': process.env.GOOGLE_APPLICATION_CREDENTIALS || null,
            'Veo 2 Access': 'Unknown - requires testing'
        };
        
        console.log('📊 Current Setup:');
        Object.entries(checks).forEach(([key, value]) => {
            const status = value ? '✅' : '❌';
            const display = value ? (key.includes('Key') ? '[HIDDEN]' : value) : 'Not configured';
            console.log(`   ${status} ${key}: ${display}`);
        });
        
        const isConfigured = checks['GCP Project ID'] && 
                           (checks['Google API Key'] || checks['Service Account']);
        
        if (isConfigured) {
            console.log('\n✨ GCP is configured! Ready to test Veo 2.');
            this.setupComplete = true;
        } else {
            console.log('\n⚠️  GCP needs configuration. See setup instructions below.');
            this.displaySetupInstructions();
        }
        
        return isConfigured;
    }

    /**
     * Display setup instructions
     */
    displaySetupInstructions() {
        console.log('\n🚀 GCP Veo 2 Setup Instructions:');
        console.log('═'.repeat(60));
        
        console.log('\n1. 💳 Activate Your $300 Free Credit:');
        console.log('   • Visit: https://console.cloud.google.com/');
        console.log('   • Login with: tristan.stoltz@evolvingresonantcocreationism.com');
        console.log('   • Activate free trial ($300 credit)');
        
        console.log('\n2. 🏗️ Create Sacred Project:');
        console.log('   • Project Name: "The Weave Sacred"');
        console.log('   • Project ID: "the-weave-sacred-001"');
        console.log('   • Location: US Central');
        
        console.log('\n3. 🔧 Enable Required APIs:');
        console.log('   • Vertex AI API');
        console.log('   • AI Platform API');
        console.log('   • Cloud Storage API');
        
        console.log('\n4. 🔑 Authentication (Choose ONE method):');
        console.log('\n   Option A - API Key (Simpler):');
        console.log('   • Go to APIs & Services → Credentials');
        console.log('   • Create API Key');
        console.log('   • Restrict to Vertex AI API');
        console.log('   • Run: export GOOGLE_API_KEY="your-api-key"');
        
        console.log('\n   Option B - Service Account (More secure):');
        console.log('   • Go to IAM & Admin → Service Accounts');
        console.log('   • Create service account');
        console.log('   • Role: "Vertex AI User"');
        console.log('   • Download JSON key');
        console.log('   • Run: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"');
        
        console.log('\n5. 🌍 Set Project Environment:');
        console.log('   export GCP_PROJECT_ID="the-weave-sacred-001"');
        console.log('   export GCP_LOCATION="us-central1"');
        
        console.log('\n6. ✅ Test Setup:');
        console.log('   node setup-gcp-veo2.js test');
        
        console.log('\n💡 Pro Tips:');
        console.log('   • Use the $300 credit strategically');
        console.log('   • Start with short test videos (cheaper)');
        console.log('   • Your existing architecture handles everything else!');
    }

    /**
     * Test GCP Veo 2 access
     */
    async testVeo2Access() {
        console.log('🧪 Testing GCP Veo 2 access...\n');
        
        if (!this.setupComplete) {
            const isConfigured = await this.checkSetup();
            if (!isConfigured) {
                console.log('❌ Cannot test - GCP not configured');
                return false;
            }
        }
        
        try {
            // Test with existing VideoGenerationService
            const videoService = new VideoGenerationService();
            
            console.log('🎬 Testing sacred video generation...');
            
            // Create test prompt for First Presence glyph
            const sacredPrompt = this.createSacredPrompt('*45', 'First Presence');
            console.log(`📝 Sacred Prompt: "${sacredPrompt}"\n`);
            
            // Switch to Veo driver for testing
            videoService.setDriver('veo');
            
            console.log('🔄 Attempting Veo 2 generation...');
            
            // This will use your existing VeoDriver from test-video-generation.js
            const result = await videoService.generateVideo(sacredPrompt, {
                duration: 5, // Start with short test
                quality: 'standard',
                style: 'sacred_geometry'
            });
            
            if (result.success) {
                console.log('✅ Veo 2 test successful!');
                console.log(`   Video URL: ${result.videoUrl || 'Generated successfully'}`);
                console.log(`   Cost: ~$${result.estimatedCost || '2.00'}`);
                console.log(`   Remaining Credit: ~$${300 - (result.estimatedCost || 2)}`);
                
                // Save result for reference
                await this.saveTestResult(result, sacredPrompt);
                
                return true;
            } else {
                console.log('❌ Veo 2 test failed');
                console.log(`   Error: ${result.error}`);
                return false;
            }
            
        } catch (error) {
            console.log('❌ Veo 2 test error:', error.message);
            
            if (error.message.includes('quota') || error.message.includes('billing')) {
                console.log('\n💡 This might be a billing/quota issue. Make sure:');
                console.log('   • Your $300 credit is activated');
                console.log('   • Billing is enabled for the project');
                console.log('   • Vertex AI quota is sufficient');
            }
            
            if (error.message.includes('permission') || error.message.includes('auth')) {
                console.log('\n💡 This might be an authentication issue. Make sure:');
                console.log('   • Your API key or service account has correct permissions');
                console.log('   • The Vertex AI API is enabled');
                console.log('   • Your credentials are valid');
            }
            
            return false;
        }
    }

    /**
     * Create sacred video prompt
     */
    createSacredPrompt(glyphId, glyphName) {
        const sacredPrompts = {
            '*45': 'A person sits in gentle meditation, breathing slowly. Golden light appears with each breath, expanding outward in soft waves. The light settles into stillness, creating a sacred presence that fills the space with peace.',
            
            '*47': 'Two people sit facing each other in warm, natural light. One person speaks while the other listens with complete presence. A subtle golden thread appears between their hearts, pulsing gently with understanding and connection.',
            
            '*48': 'A person stands in a garden, gently placing their hands in a protective gesture around a delicate flower. The boundary is created with love - firm but gentle, allowing the flower to bloom safely within its sacred space.',
            
            '*51': 'A person gently but firmly says no with their whole body - posture upright, expression kind but clear. A soft golden light emanates from their heart, showing that the boundary comes from love, not fear.',
            
            'default': 'Sacred geometry patterns slowly form and dissolve in golden light, creating a sense of deep peace and harmony. The patterns breathe with life, embodying the essence of conscious relationship.'
        };
        
        return sacredPrompts[glyphId] || sacredPrompts['default'];
    }

    /**
     * Save test result
     */
    async saveTestResult(result, prompt) {
        const testData = {
            timestamp: new Date().toISOString(),
            prompt: prompt,
            result: result,
            cost: result.estimatedCost || 2.0,
            remainingCredit: 300 - (result.estimatedCost || 2.0)
        };
        
        try {
            await fs.writeFile(
                path.join(__dirname, 'gcp-veo2-test-result.json'),
                JSON.stringify(testData, null, 2)
            );
            console.log('📄 Test result saved to gcp-veo2-test-result.json');
        } catch (error) {
            console.log('⚠️ Could not save test result:', error.message);
        }
    }

    /**
     * Generate sacred video collection
     */
    async generateSacredCollection() {
        console.log('🌟 Generating Sacred Video Collection...\n');
        
        const sacredGlyphs = [
            { id: '*45', name: 'First Presence' },
            { id: '*47', name: 'Sacred Listening' },
            { id: '*48', name: 'Boundary With Love' },
            { id: '*51', name: 'Loving No' },
            { id: '*52', name: 'Pause Practice' }
        ];
        
        const videoService = new VideoGenerationService();
        videoService.setDriver('veo');
        
        const results = [];
        let totalCost = 0;
        
        for (const glyph of sacredGlyphs) {
            console.log(`🎬 Generating video for ${glyph.name} (${glyph.id})...`);
            
            const prompt = this.createSacredPrompt(glyph.id, glyph.name);
            
            try {
                const result = await videoService.generateVideo(prompt, {
                    duration: 10, // 10-second videos
                    quality: 'high',
                    style: 'sacred_cinematic',
                    outputPath: `sacred-videos/${glyph.id}-${glyph.name.replace(/\s+/g, '-').toLowerCase()}.mp4`
                });
                
                results.push({
                    glyph: glyph,
                    result: result,
                    cost: result.estimatedCost || 3.0
                });
                
                totalCost += result.estimatedCost || 3.0;
                
                console.log(`   ✅ Generated ${glyph.name} (+$${result.estimatedCost || 3.0})`);
                
                // Pause between generations to avoid rate limits
                await this.delay(5000);
                
            } catch (error) {
                console.log(`   ❌ Failed to generate ${glyph.name}: ${error.message}`);
            }
        }
        
        console.log('\n📊 Sacred Collection Summary:');
        console.log(`   Videos Generated: ${results.length}/${sacredGlyphs.length}`);
        console.log(`   Total Cost: ~$${totalCost.toFixed(2)}`);
        console.log(`   Remaining Credit: ~$${(300 - totalCost).toFixed(2)}`);
        
        // Save collection results
        await fs.writeFile(
            path.join(__dirname, 'sacred-video-collection-results.json'),
            JSON.stringify({
                timestamp: new Date().toISOString(),
                results: results,
                totalCost: totalCost,
                remainingCredit: 300 - totalCost
            }, null, 2)
        );
        
        return results;
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Main execution
 */
async function main() {
    const args = process.argv.slice(2);
    const setup = new GCPVeo2Setup();
    
    console.log('🎬 GCP Veo 2 Sacred Video Generator\n');
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log('Usage:');
        console.log('  node setup-gcp-veo2.js              # Check setup status');
        console.log('  node setup-gcp-veo2.js test         # Test Veo 2 access');
        console.log('  node setup-gcp-veo2.js generate     # Generate sacred collection');
        console.log('  node setup-gcp-veo2.js --help       # Show this help');
        return;
    }
    
    if (args.includes('test')) {
        const success = await setup.testVeo2Access();
        process.exit(success ? 0 : 1);
    }
    
    if (args.includes('generate')) {
        const isConfigured = await setup.checkSetup();
        if (isConfigured) {
            await setup.generateSacredCollection();
        } else {
            console.log('❌ Cannot generate - please configure GCP first');
            process.exit(1);
        }
        return;
    }
    
    // Default: check setup
    await setup.checkSetup();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { GCPVeo2Setup };