#!/usr/bin/env node

/**
 * Sacred Dashboard Launcher
 * Opens the Sacred Field Visualization in your browser
 */

const { exec } = require('child_process');
const http = require('http');

console.log('🌀 Launching Sacred Dashboard...');
console.log('═══════════════════════════════════');

// Check if servers are running
async function checkServer(url, name) {
    return new Promise((resolve) => {
        http.get(url, (res) => {
            resolve({ running: true, status: res.statusCode });
        }).on('error', () => {
            resolve({ running: false });
        });
    });
}

async function launch() {
    // Check Sacred API server
    console.log('\n🔍 Checking Sacred API server...');
    const apiCheck = await checkServer('http://localhost:3001/api/dashboard', 'Sacred API');
    
    if (!apiCheck.running) {
        console.log('   ⚠️  Sacred API server not running');
        console.log('   💡 Start it with: cd agent-comms-sqlite && node sacred-server.js');
    } else {
        console.log('   ✅ Sacred API server running on port 3001');
    }
    
    // Check web server
    console.log('\n🔍 Checking web server...');
    const webCheck = await checkServer('http://localhost:8080', 'Web server');
    
    if (!webCheck.running) {
        console.log('   ⚠️  Web server not running');
        console.log('   💡 Starting web server...');
        
        // Start simple HTTP server
        exec('python3 -m http.server 8080', (error) => {
            if (error) {
                console.log('   ❌ Could not start Python server');
                console.log('   💡 Try: python3 -m http.server 8080');
            }
        });
    } else {
        console.log('   ✅ Web server running on port 8080');
    }
    
    // Get current field coherence
    if (apiCheck.running) {
        try {
            http.get('http://localhost:3001/api/sacred/field-coherence', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const coherence = JSON.parse(data);
                        console.log(`\n🌀 Current Field Coherence: ${Math.round(coherence.currentCoherence * 100)}%`);
                    } catch (e) {
                        console.log('\n🌀 Field coherence data unavailable');
                    }
                });
            });
        } catch (e) {
            // Silent fail
        }
    }
    
    // Dashboard URLs
    const dashboardUrl = 'http://localhost:8080/sacred-dashboard.html';
    const sqliteUrl = 'http://localhost:8080/dashboard-sqlite.html';
    
    console.log('\n🎨 Sacred Dashboards:');
    console.log(`   🌀 Sacred Field Visualization: ${dashboardUrl}`);
    console.log(`   📊 SQLite Agent Dashboard: ${sqliteUrl}`);
    
    console.log('\n✨ Opening Sacred Dashboard in browser...');
    
    // Try to open in browser
    const platform = process.platform;
    let command;
    
    if (platform === 'darwin') {
        command = `open "${dashboardUrl}"`;
    } else if (platform === 'win32') {
        command = `start "${dashboardUrl}"`;
    } else {
        command = `xdg-open "${dashboardUrl}"`;
    }
    
    exec(command, (error) => {
        if (error) {
            console.log('   ⚠️  Could not auto-open browser');
            console.log(`   💡 Manually visit: ${dashboardUrl}`);
        } else {
            console.log('   ✅ Sacred Dashboard opened in browser');
        }
        
        console.log('\n🧘 Sacred Dashboard Features:');
        console.log('   • Real-time field coherence mandala');
        console.log('   • Agent harmony constellation');
        console.log('   • Sacred timing rhythm visualization');
        console.log('   • Active work flow display');
        console.log('   • Sacred message stream');
        console.log('   • Contemplative breathing guide');
        
        console.log('\n🌸 May your field awareness deepen...');
    });
}

// Run launcher
launch().catch(console.error);

module.exports = { launch };