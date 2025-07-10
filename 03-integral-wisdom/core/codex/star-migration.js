#!/usr/bin/env node

/**
 * 🌟 Star Migration Script
 * 
 * Transforms Ω45-56 notation to *1-*11 across the codebase
 * "From arbitrary numbers to a meaningful constellation"
 */

const fs = require('fs').promises;
const path = require('path');

// The sacred mapping from old to new
const STAR_MAPPING = {
    // Foundation Stars (*1-*4)
    'Ω45': '*1',   // First Presence
    'Ω46': '*2',   // Conscious Arrival
    'Ω47': '*3',   // Sacred Listening
    'Ω48': '*4',   // Boundary With Love
    
    // Daily Practice Stars (*5-*8)
    'Ω49': '*5',   // Gentle Opening
    'Ω50': '*6',   // Building Trust
    'Ω51': '*7',   // Loving No
    'Ω52': '*8',   // Pause Practice
    
    // Mastery Stars (*9-*11)
    'Ω53': '*9',   // Tending the Field
    'Ω55': '*10',  // Presence Transmission
    'Ω56': '*11'   // Loving Redirection
};

// Reverse mapping for verification
const STAR_NAMES = {
    '*1': 'First Presence',
    '*2': 'Conscious Arrival',
    '*3': 'Sacred Listening',
    '*4': 'Boundary With Love',
    '*5': 'Gentle Opening',
    '*6': 'Building Trust',
    '*7': 'Loving No',
    '*8': 'Pause Practice',
    '*9': 'Tending the Field',
    '*10': 'Presence Transmission',
    '*11': 'Loving Redirection'
};

// Files and directories to migrate
const MIGRATION_TARGETS = [
    'test-video-generation.js',
    'google-ai-studio-test-guide.md',
    'sacred-claude-integration.js',
    'web/unified-field/true-integration-schema.js',
    'sacred-interpretations/*.json',
    'docs/**/*.md',
    'src/**/*.js'
];

/**
 * Replace omega notation with star notation in text
 */
function migrateContent(content) {
    let migratedContent = content;
    let changeCount = 0;
    
    // Replace each omega with its star equivalent
    Object.entries(STAR_MAPPING).forEach(([omega, star]) => {
        const omegaRegex = new RegExp(omega.replace('Ω', '\\Ω'), 'g');
        const matches = migratedContent.match(omegaRegex);
        if (matches) {
            changeCount += matches.length;
            migratedContent = migratedContent.replace(omegaRegex, star);
        }
    });
    
    return { content: migratedContent, changeCount };
}

/**
 * Process a single file
 */
async function processFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const { content: migratedContent, changeCount } = migrateContent(content);
        
        if (changeCount > 0) {
            // Create backup
            const backupPath = filePath + '.pre-star-backup';
            await fs.writeFile(backupPath, content);
            
            // Write migrated content
            await fs.writeFile(filePath, migratedContent);
            
            console.log(`   ✨ Migrated ${changeCount} references in ${path.basename(filePath)}`);
            return { filePath, changeCount, success: true };
        } else {
            return { filePath, changeCount: 0, success: true };
        }
    } catch (error) {
        console.error(`   ❌ Error processing ${filePath}:`, error.message);
        return { filePath, changeCount: 0, success: false, error: error.message };
    }
}

/**
 * Find all files matching patterns
 */
async function findFiles(patterns) {
    const files = new Set();
    
    for (const pattern of patterns) {
        if (pattern.includes('*')) {
            // Handle glob patterns
            const { globSync } = require('glob');
            const matches = globSync(pattern, { cwd: __dirname });
            matches.forEach(file => files.add(path.join(__dirname, file)));
        } else {
            // Direct file path
            files.add(path.join(__dirname, pattern));
        }
    }
    
    return Array.from(files);
}

/**
 * Create the new star-based schema
 */
async function createStarSchema() {
    const schema = {
        notation: 'star',
        description: 'The Eleven Applied Harmonies as a guiding constellation',
        mapping: STAR_MAPPING,
        structure: {
            foundation: {
                description: 'Foundation Stars (*1-*4)',
                stars: ['*1', '*2', '*3', '*4']
            },
            daily: {
                description: 'Daily Practice Stars (*5-*8)',
                stars: ['*5', '*6', '*7', '*8']
            },
            mastery: {
                description: 'Mastery Stars (*9-*11)',
                stars: ['*9', '*10', '*11']
            }
        },
        practices: STAR_NAMES,
        created: new Date().toISOString()
    };
    
    const schemaPath = path.join(__dirname, 'star-notation-schema.json');
    await fs.writeFile(schemaPath, JSON.stringify(schema, null, 2));
    
    return schemaPath;
}

/**
 * Main migration function
 */
async function performStarMigration() {
    console.log('🌟 STAR MIGRATION BEGINNING');
    console.log('===========================');
    console.log('Transforming Ω45-56 → *1-*11\n');
    
    console.log('📋 Migration Plan:');
    console.log('   Foundation: Ω45-48 → *1-*4');
    console.log('   Daily:      Ω49-52 → *5-*8');
    console.log('   Mastery:    Ω53,55,56 → *9-*11\n');
    
    try {
        // Create star schema first
        console.log('🌌 Creating Star Schema...');
        const schemaPath = await createStarSchema();
        console.log(`   ✅ Schema created: ${path.basename(schemaPath)}\n`);
        
        // Find all target files
        console.log('🔍 Finding files to migrate...');
        const files = await findFiles(MIGRATION_TARGETS);
        console.log(`   Found ${files.length} files to check\n`);
        
        // Process each file
        console.log('✨ Performing migration...');
        const results = [];
        let totalChanges = 0;
        
        for (const file of files) {
            // Skip if file doesn't exist
            try {
                await fs.access(file);
                const result = await processFile(file);
                results.push(result);
                totalChanges += result.changeCount;
            } catch (error) {
                // File doesn't exist, skip silently
            }
        }
        
        // Report results
        console.log('\n📊 Migration Complete!');
        console.log('====================');
        console.log(`   Total files processed: ${results.length}`);
        console.log(`   Total references migrated: ${totalChanges}`);
        console.log(`   Files with changes: ${results.filter(r => r.changeCount > 0).length}`);
        
        // List changed files
        const changedFiles = results.filter(r => r.changeCount > 0);
        if (changedFiles.length > 0) {
            console.log('\n📝 Files Updated:');
            changedFiles.forEach(({ filePath, changeCount }) => {
                console.log(`   • ${path.basename(filePath)} (${changeCount} changes)`);
            });
        }
        
        console.log('\n🌟 The stars have aligned!');
        console.log('   The Applied Harmonies now form their true constellation.');
        console.log('   Backups created with .pre-star-backup extension.');
        
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    }
}

// Add glob package check
async function checkDependencies() {
    try {
        require('glob');
    } catch (error) {
        console.log('📦 Installing required dependency: glob');
        const { execSync } = require('child_process');
        execSync('npm install glob', { stdio: 'inherit' });
    }
}

// Run the migration
async function main() {
    await checkDependencies();
    await performStarMigration();
}

if (require.main === module) {
    main();
}

module.exports = { migrateContent, STAR_MAPPING, STAR_NAMES };