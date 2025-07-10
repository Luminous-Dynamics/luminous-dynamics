#!/usr/bin/env node

/**
 * Verify Glyph Integration
 * Quick script to verify all 94 glyphs are properly formatted and loadable
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Glyph Integration...\n');

const dataPath = path.join(__dirname, 'data_temp_glyphs');
const categories = {
    foundational: [],
    'applied-harmonies': [],
    meta: [],
    threshold: []
};

let totalGlyphs = 0;
let validGlyphs = 0;
let errors = [];

// Check each category
Object.keys(categories).forEach(category => {
    const categoryPath = path.join(dataPath, category);
    
    try {
        const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.json'));
        console.log(`\n📁 ${category}: ${files.length} files`);
        
        files.forEach(file => {
            totalGlyphs++;
            const filePath = path.join(categoryPath, file);
            
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                // Verify required fields
                const required = ['glyphId', 'designation', 'functionalDefinition'];
                const missing = required.filter(field => !data[field]);
                
                if (missing.length > 0) {
                    errors.push(`${file}: Missing fields: ${missing.join(', ')}`);
                } else {
                    validGlyphs++;
                    categories[category].push({
                        id: data.glyphId,
                        name: data.designation,
                        file: file
                    });
                }
            } catch (e) {
                errors.push(`${file}: ${e.message}`);
            }
        });
        
        // Show some examples
        if (categories[category].length > 0) {
            console.log('  Examples:');
            categories[category].slice(0, 3).forEach(g => {
                console.log(`    - ${g.id}: ${g.name}`);
            });
            if (categories[category].length > 3) {
                console.log(`    ... and ${categories[category].length - 3} more`);
            }
        }
    } catch (e) {
        errors.push(`Category ${category}: ${e.message}`);
    }
});

// Summary
console.log('\n📊 Summary:');
console.log(`Total files: ${totalGlyphs}`);
console.log(`Valid glyphs: ${validGlyphs}`);
console.log(`Errors: ${errors.length}`);

if (errors.length > 0) {
    console.log('\n❌ Errors found:');
    errors.forEach(err => console.log(`  - ${err}`));
} else {
    console.log('\n✅ All glyphs validated successfully!');
}

// Check for expected counts
console.log('\n🎯 Expected vs Actual:');
console.log(`Foundational: Expected 48, Found ${categories.foundational.length}`);
console.log(`Applied Harmonies: Expected 4, Found ${categories['applied-harmonies'].length}`);
console.log(`Meta: Expected 33, Found ${categories.meta.length}`);
console.log(`Threshold: Expected 9, Found ${categories.threshold.length}`);

const expectedTotal = 48 + 4 + 33 + 9;
if (validGlyphs === expectedTotal) {
    console.log(`\n✨ Perfect! All ${expectedTotal} glyphs are ready for integration!`);
} else {
    console.log(`\n⚠️  Expected ${expectedTotal} glyphs but found ${validGlyphs}`);
}

// Export summary for other scripts
const summary = {
    total: totalGlyphs,
    valid: validGlyphs,
    categories: Object.keys(categories).reduce((acc, cat) => {
        acc[cat] = categories[cat].length;
        return acc;
    }, {}),
    errors: errors.length,
    timestamp: new Date().toISOString()
};

fs.writeFileSync(
    path.join(__dirname, 'glyph-integration-summary.json'),
    JSON.stringify(summary, null, 2)
);

console.log('\n📝 Summary saved to glyph-integration-summary.json');