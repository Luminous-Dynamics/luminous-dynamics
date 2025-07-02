#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Initialize AJV validator
const ajv = new Ajv({ allErrors: true });

// Load schemas
async function loadSchemas() {
    const schemasDir = path.join(projectRoot, 'data', 'schemas');
    const schemaFiles = [
        'foundational-glyph-schema.json',
        'meta-glyph-schema.json', 
        'relationship-schema.json'
    ];
    
    const schemas = {};
    
    for (const file of schemaFiles) {
        try {
            const schemaPath = path.join(schemasDir, file);
            const schemaContent = await fs.readFile(schemaPath, 'utf8');
            const schema = JSON.parse(schemaContent);
            const schemaName = file.replace('-schema.json', '');
            schemas[schemaName] = schema;
            ajv.addSchema(schema, schemaName);
            console.log(`✓ Loaded schema: ${schemaName}`);
        } catch (error) {
            console.error(`✗ Error loading schema ${file}:`, error.message);
            process.exit(1);
        }
    }
    
    return schemas;
}

// Validate JSON files in a directory
async function validateDirectory(dirPath, schemaName) {
    const results = {
        passed: 0,
        failed: 0,
        errors: []
    };
    
    try {
        const files = await fs.readdir(dirPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        if (jsonFiles.length === 0) {
            console.log(`  No JSON files found in ${dirPath}`);
            return results;
        }
        
        for (const file of jsonFiles) {
            const filePath = path.join(dirPath, file); 
            try {
                const content = await fs.readFile(filePath, 'utf8');
                const data = JSON.parse(content);
                
                const validate = ajv.getSchema(schemaName);
                if (!validate) {
                    throw new Error(`Schema ${schemaName} not found`);
                }
                
                const valid = validate(data);
                
                if (valid) {
                    console.log(`    ✓ ${file}`);
                    results.passed++;
                } else {
                    console.log(`    ✗ ${file}`);
                    results.failed++;
                    results.errors.push({
                        file: filePath,
                        errors: validate.errors
                    });
                    
                    // Print validation errors
                    validate.errors.forEach(error => {
                        console.log(`      - ${error.instancePath || 'root'}: ${error.message}`);
                    });
                }
                
            } catch (error) {
                console.log(`    ✗ ${file} - Parse error: ${error.message}`);
                results.failed++;
                results.errors.push({
                    file: filePath,
                    errors: [{ message: `Parse error: ${error.message}` }]
                });
            }
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`  Directory ${dirPath} does not exist yet`);
        } else {
            console.error(`  Error reading directory ${dirPath}:`, error.message);
        }
    }
    
    return results;
}

// Main validation function
async function validateAll() {
    console.log('🔍 Validating Codex data files...\n');
    
    // Load schemas
    const schemas = await loadSchemas();
    console.log();
    
    let totalResults = {
        passed: 0,
        failed: 0,
        errors: []
    };
    
    // Validate foundational glyphs
    console.log('📜 Validating foundational glyphs...');
    const foundationalPath = path.join(projectRoot, 'data', 'glyphs', 'foundational');
    const foundationalResults = await validateDirectory(foundationalPath, 'foundational-glyph');
    totalResults.passed += foundationalResults.passed;
    totalResults.failed += foundationalResults.failed;
    totalResults.errors.push(...foundationalResults.errors);
    
    // Validate threshold glyphs
    console.log('🚪 Validating threshold glyphs...');
    const thresholdPath = path.join(projectRoot, 'data', 'glyphs', 'threshold');
    const thresholdResults = await validateDirectory(thresholdPath, 'foundational-glyph');
    totalResults.passed += thresholdResults.passed;
    totalResults.failed += thresholdResults.failed;
    totalResults.errors.push(...thresholdResults.errors);
    
    // Validate meta-glyphs
    console.log('🌀 Validating meta-glyphs...');
    const metaPath = path.join(projectRoot, 'data', 'glyphs', 'meta');
    const metaResults = await validateDirectory(metaPath, 'meta-glyph');
    totalResults.passed += metaResults.passed;
    totalResults.failed += metaResults.failed;
    totalResults.errors.push(...metaResults.errors);
    
    // Validate relationships
    console.log('🔗 Validating relationships...');
    const relationshipsPath = path.join(projectRoot, 'data', 'relationships');
    const relationshipResults = await validateDirectory(relationshipsPath, 'relationship');
    totalResults.passed += relationshipResults.passed;
    totalResults.failed += relationshipResults.failed;
    totalResults.errors.push(...relationshipResults.errors);
    
    // Print summary
    console.log('\n📊 Validation Summary:');
    console.log(`  ✓ Passed: ${totalResults.passed}`);
    console.log(`  ✗ Failed: ${totalResults.failed}`);
    
    if (totalResults.failed > 0) {
        console.log('\n❌ Validation failed. Please fix the errors above.');
        process.exit(1);
    } else {
        console.log('\n✅ All validations passed! The Codex data is coherent.');
        process.exit(0);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    validateAll().catch(error => {
        console.error('Validation script error:', error);
        process.exit(1);
    });
}

export { validateAll, loadSchemas };