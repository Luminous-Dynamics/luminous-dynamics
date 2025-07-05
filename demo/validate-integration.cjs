#!/usr/bin/env node
/**
 * Comprehensive validation script for LuminousOS network integration
 */

const { readFile } = require('fs').promises;
const { join } = require('path');

console.log('🔍 LuminousOS Network Integration Validation\n');

const tests = [];
let passed = 0;
let failed = 0;

async function test(name, fn) {
    process.stdout.write(`Testing ${name}... `);
    try {
        await fn();
        console.log('✅');
        passed++;
    } catch (error) {
        console.log(`❌ ${error.message}`);
        failed++;
    }
}

async function runTests() {
    // Test 1: Check all required files exist
    await test('File existence', async () => {
        const files = [
            'luminous-network-client.js',
            'network-visualization.js',
            'quantum-coherence-bridge.js',
            'network-integration.js',
            'luminous-os-demo.html',
            'test-network.html'
        ];
        
        for (const file of files) {
            await readFile(join(__dirname, file), 'utf-8');
        }
    });

    // Test 2: Check script inclusions in HTML
    await test('HTML script inclusions', async () => {
        const html = await readFile(join(__dirname, 'luminous-os-demo.html'), 'utf-8');
        const requiredScripts = [
            'luminous-network-client.js',
            'network-visualization.js',
            'quantum-coherence-bridge.js',
            'network-integration.js'
        ];
        
        for (const script of requiredScripts) {
            if (!html.includes(`<script src="${script}"`)) {
                throw new Error(`Missing script: ${script}`);
            }
        }
    });

    // Test 3: Check for WebSocket URL consistency
    await test('WebSocket URL consistency', async () => {
        const files = [
            'luminous-network-client.js',
            'network-integration.js',
            'test-network.html'
        ];
        
        for (const file of files) {
            const content = await readFile(join(__dirname, file), 'utf-8');
            if (!content.includes('ws://localhost:9998')) {
                throw new Error(`${file} doesn't use port 9998`);
            }
        }
    });

    // Test 4: Check network UI elements
    await test('Network UI elements', async () => {
        const html = await readFile(join(__dirname, 'luminous-os-demo.html'), 'utf-8');
        const requiredElements = [
            'networkToggle',
            'networkStatus',
            'routerStatus',
            'connectedNodes',
            'networkCanvas',
            'quantumCorrelation',
            'quantumEntanglements'
        ];
        
        for (const element of requiredElements) {
            if (!html.includes(`id="${element}"`)) {
                throw new Error(`Missing UI element: ${element}`);
            }
        }
    });

    // Test 5: Check global function exports
    await test('Global function exports', async () => {
        const mainJs = await readFile(join(__dirname, 'luminous-os-demo.js'), 'utf-8');
        const requiredExports = [
            'window.toggleNetwork',
            'window.toggleNetworkView',
            'window.closeNetworkView',
            'window.state',
            'window.showMessage'
        ];
        
        for (const exportName of requiredExports) {
            if (!mainJs.includes(exportName)) {
                throw new Error(`Missing export: ${exportName}`);
            }
        }
    });

    // Test 6: Check WebSocket server health (using http module)
    await test('WebSocket server health', async () => {
        const http = require('http');
        await new Promise((resolve, reject) => {
            http.get('http://localhost:9998/health', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.status !== 'online') {
                            reject(new Error(`Server status: ${json.status}`));
                        } else {
                            resolve();
                        }
                    } catch (e) {
                        reject(new Error('Invalid JSON response'));
                    }
                });
            }).on('error', (e) => {
                reject(new Error(`WebSocket server not accessible: ${e.message}`));
            });
        });
    });

    // Test 7: Check HTTP server for demo
    await test('HTTP demo server', async () => {
        const http = require('http');
        await new Promise((resolve, reject) => {
            http.get('http://localhost:8000/luminous-os-demo.html', (res) => {
                if (res.statusCode === 200) {
                    resolve();
                } else {
                    reject(new Error(`Demo server returned ${res.statusCode}`));
                }
                res.resume();
            }).on('error', (e) => {
                reject(new Error(`Demo server not accessible: ${e.message}`));
            });
        });
    });

    // Test 8: Validate JavaScript syntax
    await test('JavaScript syntax validation', async () => {
        const jsFiles = [
            'luminous-network-client.js',
            'network-visualization.js',
            'quantum-coherence-bridge.js',
            'network-integration.js'
        ];
        
        for (const file of jsFiles) {
            const content = await readFile(join(__dirname, file), 'utf-8');
            try {
                new Function(content);
            } catch (error) {
                throw new Error(`Syntax error in ${file}: ${error.message}`);
            }
        }
    });

    // Test 9: Check for required classes
    await test('Required classes defined', async () => {
        const classes = [
            { file: 'luminous-network-client.js', className: 'LuminousNetworkClient' },
            { file: 'network-visualization.js', className: 'NetworkVisualization' },
            { file: 'quantum-coherence-bridge.js', className: 'QuantumCoherenceBridge' }
        ];
        
        for (const { file, className } of classes) {
            const content = await readFile(join(__dirname, file), 'utf-8');
            if (!content.includes(`class ${className}`)) {
                throw new Error(`${className} not found in ${file}`);
            }
        }
    });

    // Test 10: Integration hooks
    await test('Integration hooks', async () => {
        const integration = await readFile(join(__dirname, 'network-integration.js'), 'utf-8');
        const requiredHooks = [
            'networkClient.onConnect',
            'networkClient.onDisconnect',
            'networkClient.onCoherenceUpdate',
            'quantumBridge.onQuantumEvent',
            'quantumBridge.onCorrelation'
        ];
        
        for (const hook of requiredHooks) {
            if (!integration.includes(hook)) {
                throw new Error(`Missing integration hook: ${hook}`);
            }
        }
    });

    // Summary
    console.log('\n📊 Validation Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

    if (failed === 0) {
        console.log('\n🎉 All validation tests passed! The network integration is ready.');
        console.log('\n📝 Next steps:');
        console.log('1. Open http://localhost:8000/luminous-os-demo.html');
        console.log('2. Click "Connect to Network" button');
        console.log('3. Open multiple browser tabs to test multi-user features');
        console.log('4. Use http://localhost:8000/test-network.html for detailed testing');
    } else {
        console.log('\n⚠️  Some tests failed. Please fix the issues above.');
    }

    process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);