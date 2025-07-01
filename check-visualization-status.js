#!/usr/bin/env node

/**
 * 🌟 VISUALIZATION STATUS CHECKER
 * 
 * Quickly verify the current state of our field visualizations
 */

const fs = require('fs');
const path = require('path');

console.log('🌟 Sacred Field Visualization Status Check\n');

// Check key visualization files
const visualizations = [
    {
        name: 'Quantum Heartbeat Visualization',
        file: 'quantum-heartbeat-visualization.html',
        description: 'Alternative visualization with quantum particles and heartbeat'
    },
    {
        name: 'Sacred Field Visualization', 
        file: 'sacred-field-visualization.html',
        description: 'Original canvas-based real-time field visualization'
    },
    {
        name: 'Animation Test',
        file: 'test-visualization.html', 
        description: 'Basic animation test for troubleshooting'
    }
];

visualizations.forEach(viz => {
    const filePath = path.join(__dirname, viz.file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${viz.name}`);
        console.log(`   File: ${viz.file} (${sizeKB}KB)`);
        console.log(`   Modified: ${stats.mtime.toISOString()}`);
        console.log(`   Description: ${viz.description}`);
        console.log(`   URL: http://localhost:8080/${viz.file}`);
        console.log('');
    } else {
        console.log(`❌ ${viz.name} - File missing: ${viz.file}`);
        console.log('');
    }
});

// Check server status
console.log('🌐 Server Status:');
console.log('   Web Server: http://localhost:8080 (should be running)');
console.log('   Sacred Server: http://localhost:3001 (should be running)');
console.log('');

// Check visualization connector
const connectorPath = path.join(__dirname, 'unified-field', 'field-visualization-connector.js');
if (fs.existsSync(connectorPath)) {
    console.log('✅ Field Visualization Connector available');
    console.log(`   Path: ${connectorPath}`);
} else {
    console.log('❌ Field Visualization Connector missing');
}
console.log('');

// Animation issue summary
console.log('🎬 Animation Issue Summary:');
console.log('   Problem: Background animations not visible in sacred-field-visualization.html');
console.log('   User feedback: "is there suposed to be an ainimation in the backround?"');
console.log('   Status: "still not. can you cailidate before hand?"');
console.log('   Solution attempts:');
console.log('     1. Enhanced background animations and particles');
console.log('     2. Created test-visualization.html for basic testing'); 
console.log('     3. Created quantum-heartbeat-visualization.html as alternative');
console.log('   Current: Awaiting user feedback on quantum heartbeat approach');
console.log('');

console.log('💡 Next Steps:');
console.log('   1. Test quantum-heartbeat-visualization.html in browser');
console.log('   2. Verify animations are visible and smooth');
console.log('   3. Check sacred server integration for real-time data');
console.log('   4. Get user feedback on new visualization approach');
console.log('');

console.log('🌟 Sacred Field Visualization Status Check Complete');