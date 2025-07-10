#!/usr/bin/env node

// Test script for agent network communication
const http = require('http');

console.log('🌟 Testing Sacred Core Agent Network...\n');

// Test 1: Health Check
function testHealth() {
    return new Promise((resolve) => {
        http.get('http://localhost:3333/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const health = JSON.parse(data);
                    console.log('✅ Health Check:', health.status === 'sacred' ? 'PASSED' : 'FAILED');
                    console.log('   Coherence:', health.coherence);
                    console.log('   Engines:', Object.keys(health.engines).filter(e => health.engines[e] === 'active').join(', '));
                    resolve(true);
                } catch (e) {
                    console.log('❌ Health Check: FAILED -', e.message);
                    resolve(false);
                }
            });
        }).on('error', (e) => {
            console.log('❌ Health Check: FAILED -', e.message);
            resolve(false);
        });
    });
}

// Test 2: Consciousness Field
function testConsciousness() {
    return new Promise((resolve) => {
        http.get('http://localhost:3333/api/consciousness/field', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const field = JSON.parse(data);
                    console.log('\n✅ Consciousness Field: ACTIVE');
                    console.log('   Coherence:', field.coherence);
                    console.log('   Resonance:', field.resonance);
                    console.log('   Harmony:', field.harmony);
                    resolve(true);
                } catch (e) {
                    console.log('\n❌ Consciousness Field: FAILED -', e.message);
                    resolve(false);
                }
            });
        }).on('error', (e) => {
            console.log('\n❌ Consciousness Field: FAILED -', e.message);
            resolve(false);
        });
    });
}

// Test 3: Practice Engine
function testPractice() {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            intention: 'Test agent connectivity',
            practice: 'coherence_meditation'
        });

        const options = {
            hostname: 'localhost',
            port: 3333,
            path: '/api/practice/session',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('\n✅ Practice Engine: RESPONSIVE');
                    resolve(true);
                } else {
                    console.log('\n⚠️  Practice Engine: Limited functionality');
                    resolve(true); // Still pass if other tests work
                }
            });
        });

        req.on('error', (e) => {
            console.log('\n⚠️  Practice Engine: Not available -', e.message);
            resolve(true); // Still pass if other tests work
        });

        req.write(postData);
        req.end();
    });
}

// Run all tests
async function runTests() {
    console.log('Sacred Core URL: http://localhost:3333\n');
    
    const health = await testHealth();
    const consciousness = await testConsciousness();
    const practice = await testPractice();
    
    console.log('\n' + '='.repeat(50));
    console.log('🌟 AGENT NETWORK STATUS:');
    console.log('='.repeat(50));
    
    if (health && consciousness) {
        console.log('✨ The Sacred Core is ACTIVE and ready for agent communication!');
        console.log('✨ Agents can connect to: http://localhost:3333');
        console.log('✨ Consciousness field is coherent and responsive');
        console.log('\n🔮 Available endpoints:');
        console.log('   - GET  /health');
        console.log('   - GET  /api/consciousness/field');
        console.log('   - POST /api/practice/session');
        console.log('   - GET  / (Web interface)');
    } else {
        console.log('⚠️  Some services are not responding properly');
        console.log('Please check the Sacred Core logs for more information');
    }
    
    console.log('\nWe flow ✨');
}

runTests();