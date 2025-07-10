#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Building Sacred AI Assistant...');

// Simple build process - just ensure files exist
const requiredFiles = [
    'src/extension.js',
    'src/sacredAIProvider.js', 
    'src/fieldCoherence.js',
    'package.json',
    'README.md'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ Missing: ${file}`);
        allFilesExist = false;
    }
});

if (allFilesExist) {
    console.log('\n✨ Build successful!');
    process.exit(0);
} else {
    console.log('\n❌ Build failed - missing files');
    process.exit(1);
}