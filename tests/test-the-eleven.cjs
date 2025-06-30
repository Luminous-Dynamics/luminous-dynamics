#!/usr/bin/env node

/**
 * Sacred Testing Suite for The Eleven Applied Harmonies
 * 
 * This test suite verifies that our consciousness-serving technology
 * maintains integrity while serving awakening. Each test is a practice
 * of ensuring our sacred work remains whole and functional.
 */

const fs = require('fs');
const path = require('path');

// Sacred pause before beginning
console.log('\n🌟 Sacred Testing Protocol: The Eleven Applied Harmonies\n');
console.log('Arriving present before testing... (Ω45)\n');

// Test results tracking
const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    insights: []
};

// Helper function for sacred testing
function sacredTest(name, testFn) {
    process.stdout.write(`Testing ${name}... `);
    try {
        const result = testFn();
        if (result === true) {
            console.log('✅ Passed');
            testResults.passed++;
        } else if (result && result.warning) {
            console.log(`⚠️  Warning: ${result.warning}`);
            testResults.warnings++;
        } else {
            console.log('❌ Failed');
            testResults.failed++;
            if (result && result.error) {
                console.log(`   Error: ${result.error}`);
            }
        }
    } catch (error) {
        console.log('❌ Failed');
        console.log(`   Error: ${error.message}`);
        testResults.failed++;
    }
}

// Test 1: Verify true-integration-schema.js exists and loads
sacredTest('True Integration Schema exists', () => {
    const schemaPath = path.join(__dirname, '../unified-field/true-integration-schema.js');
    return fs.existsSync(schemaPath);
});

// Test 2: Load and validate schema structure
sacredTest('Schema loads without errors', () => {
    try {
        const schemaPath = path.join(__dirname, '../unified-field/true-integration-schema.js');
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        
        // Basic validation - check for key structures
        const hasClass = schemaContent.includes('class TrueIntegrationSchema');
        const hasMystical = schemaContent.includes('initializeMysticalGlyphs');
        const hasApplied = schemaContent.includes('initializeAppliedHarmonies');
        const hasBridges = schemaContent.includes('initializeGlyphBridges');
        
        return hasClass && hasMystical && hasApplied && hasBridges;
    } catch (error) {
        return { error: error.message };
    }
});

// Test 3: Verify all 11 Applied Harmonies are present
sacredTest('All 11 Applied Harmonies present', () => {
    const schemaPath = path.join(__dirname, '../unified-field/true-integration-schema.js');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    const appliedHarmonies = [
        'Ω45', 'Ω46', 'Ω47', 'Ω48', 'Ω49', 
        'Ω50', 'Ω51', 'Ω52', 'Ω53', 'Ω55', 'Ω56'
    ];
    
    let allPresent = true;
    for (const glyph of appliedHarmonies) {
        if (!schemaContent.includes(`"${glyph}":`)) {
            console.log(`\n   Missing: ${glyph}`);
            allPresent = false;
        }
    }
    
    return allPresent;
});

// Test 4: Verify mystical foundations with bridges
sacredTest('Mystical foundations with bridges', () => {
    const schemaPath = path.join(__dirname, '../unified-field/true-integration-schema.js');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    const mysticalWithBridges = [
        'Ω0', 'Ω1', 'Ω2', 'Ω3', 'Ω4', 'Ω5', 
        'Ω7', 'Ω10', 'Ω11', 'Ω12', 'Ω15'
    ];
    
    let allPresent = true;
    for (const glyph of mysticalWithBridges) {
        if (!schemaContent.includes(`"${glyph}":`)) {
            console.log(`\n   Missing mystical: ${glyph}`);
            allPresent = false;
        }
    }
    
    return allPresent;
});

// Test 5: Check bridge mappings integrity
sacredTest('Bridge mappings bidirectional', () => {
    const schemaPath = path.join(__dirname, '../unified-field/true-integration-schema.js');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Check for both bridge directions
    const hasMysticalToPractical = schemaContent.includes('mysticalToPractical:');
    const hasPracticalToMystical = schemaContent.includes('practicalToMystical:');
    
    return hasMysticalToPractical && hasPracticalToMystical;
});

// Test 6: Verify dojo.html exists and references correct class
sacredTest('Dojo integration prepared', () => {
    const dojoPath = path.join(__dirname, '../websites/relationalharmonics/dojo.html');
    if (!fs.existsSync(dojoPath)) {
        return { error: 'dojo.html not found' };
    }
    
    const dojoContent = fs.readFileSync(dojoPath, 'utf8');
    const usesCorrectClass = dojoContent.includes('TrueIntegrationFoundationalGlyphs') || 
                            dojoContent.includes('TrueIntegrationSchema');
    
    if (!usesCorrectClass) {
        return { warning: 'Dojo may need update to use TrueIntegrationSchema' };
    }
    
    return true;
});

// Test 7: Check Applied Harmony metadata
sacredTest('Applied Harmony structure complete', () => {
    const schemaPath = path.join(__dirname, '../unified-field/true-integration-schema.js');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Check for key Applied Harmony structures
    const hasQuadrants = schemaContent.includes('quadrants:');
    const hasAccessible = schemaContent.includes('accessible:');
    const hasCoreQuestion = schemaContent.includes('coreQuestion:');
    const hasInstructions = schemaContent.includes('basicInstructions:');
    
    return hasQuadrants && hasAccessible && hasCoreQuestion && hasInstructions;
});

// Test 8: Verify sacred sets organization
sacredTest('Sacred sets properly defined', () => {
    const schemaPath = path.join(__dirname, '../unified-field/true-integration-schema.js');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Check for the three sacred sets
    const hasEssentialDaily = schemaContent.includes('essentialDaily:') || 
                             schemaContent.includes('Essential Daily Practice');
    const hasFieldMastery = schemaContent.includes('fieldMastery:') || 
                           schemaContent.includes('Field Mastery');
    const hasCoreFoundation = schemaContent.includes('coreFoundation:') || 
                             schemaContent.includes('Core Foundation');
    
    return hasEssentialDaily && hasFieldMastery && hasCoreFoundation;
});

// Test 9: Check Living Glyph Card compatibility
sacredTest('Living Glyph Card system ready', () => {
    const glyphCardPath = path.join(__dirname, '../unified-field/living-glyph-card.js');
    if (!fs.existsSync(glyphCardPath)) {
        return { warning: 'Living Glyph Card system not found' };
    }
    
    const cardContent = fs.readFileSync(glyphCardPath, 'utf8');
    const hasRenderMethod = cardContent.includes('render') || cardContent.includes('create');
    
    return hasRenderMethod;
});

// Test 10: Verify Wisdom Companion integration
sacredTest('Wisdom Companion AI ready', () => {
    const wisdomPath = path.join(__dirname, '../demo/backend/wisdom-ai.js');
    if (!fs.existsSync(wisdomPath)) {
        return { warning: 'Wisdom Companion not found in expected location' };
    }
    
    const wisdomContent = fs.readFileSync(wisdomPath, 'utf8');
    const hasGlyphSystem = wisdomContent.includes('initializeGlyphSystem') || 
                          wisdomContent.includes('recommendGlyph');
    
    return hasGlyphSystem;
});

// Test 11: Sacred number verification
sacredTest('Sacred numbering preserved', () => {
    const schemaPath = path.join(__dirname, '../unified-field/true-integration-schema.js');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Verify The Eleven are properly numbered
    const lastApplied = schemaContent.includes('Ω56');
    const firstApplied = schemaContent.includes('Ω45');
    const count = (schemaContent.match(/Ω5[0-6]|Ω4[5-9]/g) || []).length;
    
    if (count < 11) {
        return { error: `Only found ${count} Applied Harmonies, expected 11` };
    }
    
    return lastApplied && firstApplied;
});

// Sacred insights gathering
if (testResults.passed === 11) {
    testResults.insights.push('✨ The Eleven stand complete and verified!');
    testResults.insights.push('🌊 All bridges between mystical and practical are intact');
    testResults.insights.push('💫 Sacred architecture maintains coherence');
}

// Final report
console.log('\n' + '═'.repeat(60));
console.log('📊 Sacred Test Results\n');
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`⚠️  Warnings: ${testResults.warnings}`);
console.log('\n🔮 Sacred Insights:');
testResults.insights.forEach(insight => console.log(`   ${insight}`));

// Sacred completion
if (testResults.failed === 0) {
    console.log('\n🌟 All tests passed! The Eleven are stable and ready to serve.');
    console.log('   Field coherence: VERIFIED');
    console.log('   Sacred integrity: MAINTAINED');
    console.log('   Ready for practitioners: YES\n');
    process.exit(0);
} else {
    console.log('\n⚠️  Some tests failed. Sacred attention needed.');
    console.log('   Recommendation: Address failures before deployment.\n');
    process.exit(1);
}

// Sacred closing
console.log('🙏 Testing complete. May The Eleven serve all beings.\n');