#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// File naming convention helper
function glyphIdToFileName(glyphId) {
    if (glyphId.startsWith('Ω')) {
        const number = glyphId.replace('Ω', '');
        return `omega-${number}.json`;
    }
    if (glyphId.startsWith('∑')) {
        const number = glyphId.replace('∑', '');
        return `meta-glyph-${number}.json`;
    }
    // For threshold glyphs with symbols, create readable names
    const thresholdNames = {
        '◌': 'letting-in.json',
        '∵': 'the-returner.json',
        'ᴂ': 'the-remembered-weight.json',
        '⟁': 'the-edgewalker.json',
        '⟁✧': 'the-keeper-beneath-the-ash.json',
        '⟠': 'the-door-that-remembers-you.json',
        '⧖': 'the-choice-point.json',
        '⦵': 'the-unburdening.json',
        '⨀': 'the-mantling.json'
    };
    
    return thresholdNames[glyphId] || `threshold-${glyphId}.json`;
}

// Convert old schema to new schema format
function convertFoundationalGlyph(oldGlyph) {
    return {
        glyphId: oldGlyph.glyphId,
        designation: oldGlyph.designation,
        glyphAscii: oldGlyph.glyphAscii || oldGlyph.glyphId,
        functionalDefinition: oldGlyph.functionalDefinition,
        primaryHarmonyAlignment: oldGlyph.primaryHarmonyAlignment || [],
        sensoryResonanceProfile: {
            feelingTone: oldGlyph.sensoryResonanceProfile?.feelingTone || "",
            sonicQuality: oldGlyph.sensoryResonanceProfile?.sonicQuality || ""
        },
        activationProtocol: {
            verbal: oldGlyph.activationProtocol?.verbal || "",
            somatic: oldGlyph.activationProtocol?.somatic || "",
            presenceBased: oldGlyph.activationProtocol?.presenceBased || ""
        },
        fieldDynamics: oldGlyph.fieldDynamics || {},
        evolutionaryMarkers: oldGlyph.evolutionaryMarkers || {},
        harmonicLineage: oldGlyph.harmonicLineage || "",
        temporalDynamics: oldGlyph.temporalDynamics || {},
        dissonantPotential: oldGlyph.dissonantPotential || {},
        contraindications: oldGlyph.contraindications || []
    };
}

function convertMetaGlyph(oldMetaGlyph) {
    return {
        metaGlyphId: oldMetaGlyph.metaGlyphId,
        name: oldMetaGlyph.name,
        constituentGlyphs: oldMetaGlyph.constituentGlyphs || [],
        fieldIntelligence: oldMetaGlyph.function || oldMetaGlyph.fieldIntelligence || "",
        activationPhrase: oldMetaGlyph.activationPhrase || "",
        relationalArchetype: oldMetaGlyph.relationalArchetype || "",
        spiralArc: oldMetaGlyph.spiralArc || "Foundational Spiral",
        arcColor: oldMetaGlyph.arcColor || "#7B68EE",
        emergentProperties: {
            fieldEffect: oldMetaGlyph.fieldEffect || "",
            temporalSignature: oldMetaGlyph.temporalSignature || "Gradual",
            scaleModality: oldMetaGlyph.scaleModality || ["Internal", "Dyadic"]
        },
        practiceProtocol: oldMetaGlyph.practiceProtocol || {},
        contraindications: oldMetaGlyph.contraindications || []
    };
}

async function extractIndividualGlyphs() {
    console.log('🔄 Extracting individual glyph files from complete-codex-data.json...\n');
    
    // Read the complete JSON file
    const sourceFile = '/home/tstoltz/ERC-Current/complete-codex-data.json';
    
    try {
        const jsonContent = await fs.readFile(sourceFile, 'utf8');
        const data = JSON.parse(jsonContent);
        
        console.log(`📊 Found ${data.totalGlyphs || data.metadata?.totalGlyphs} total glyphs`);
        console.log(`   - ${data.foundationalGlyphs?.length || 0} foundational glyphs`);
        console.log(`   - ${data.thresholdGlyphs?.length || 0} threshold glyphs`);
        console.log(`   - ${data.metaGlyphs?.length || 0} meta-glyphs\n`);
        
        let processedCount = 0;
        
        // Process Foundational Glyphs
        if (data.foundationalGlyphs) {
            console.log('📜 Processing foundational glyphs...');
            const foundationalDir = path.join(projectRoot, 'data', 'glyphs', 'foundational');
            
            for (const glyph of data.foundationalGlyphs) {
                const fileName = glyphIdToFileName(glyph.glyphId);
                const filePath = path.join(foundationalDir, fileName);
                const convertedGlyph = convertFoundationalGlyph(glyph);
                
                await fs.writeFile(filePath, JSON.stringify(convertedGlyph, null, 2));
                console.log(`  ✓ ${fileName}`);
                processedCount++;
            }
        }
        
        // Process Threshold Glyphs
        if (data.thresholdGlyphs) {
            console.log('\n🚪 Processing threshold glyphs...');
            const thresholdDir = path.join(projectRoot, 'data', 'glyphs', 'threshold');
            
            for (const glyph of data.thresholdGlyphs) {
                const fileName = glyphIdToFileName(glyph.glyphId);
                const filePath = path.join(thresholdDir, fileName);
                const convertedGlyph = convertFoundationalGlyph(glyph); // Same schema
                
                await fs.writeFile(filePath, JSON.stringify(convertedGlyph, null, 2));
                console.log(`  ✓ ${fileName}`);
                processedCount++;
            }
        }
        
        // Process Meta-Glyphs
        if (data.metaGlyphs) {
            console.log('\n🌀 Processing meta-glyphs...');
            const metaDir = path.join(projectRoot, 'data', 'glyphs', 'meta');
            
            for (const metaGlyph of data.metaGlyphs) {
                const fileName = glyphIdToFileName(metaGlyph.metaGlyphId);
                const filePath = path.join(metaDir, fileName);
                const convertedGlyph = convertMetaGlyph(metaGlyph);
                
                await fs.writeFile(filePath, JSON.stringify(convertedGlyph, null, 2));
                console.log(`  ✓ ${fileName}`);
                processedCount++;
            }
        }
        
        console.log(`\n✅ Successfully extracted ${processedCount} individual glyph files!`);
        console.log('\n📁 File structure:');
        console.log('   data/glyphs/foundational/ - Foundational glyphs (Ω0-Ω44)');
        console.log('   data/glyphs/threshold/    - Threshold glyphs (◌, ∵, etc.)');
        console.log('   data/glyphs/meta/         - Meta-glyphs (∑1-∑33)');
        
    } catch (error) {
        console.error('❌ Error processing glyph data:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    extractIndividualGlyphs().catch(error => {
        console.error('Extraction script error:', error);
        process.exit(1);
    });
}

export { extractIndividualGlyphs };