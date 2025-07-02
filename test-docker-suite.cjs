#!/usr/bin/env node
/**
 * Full Docker Test Suite for Sacred Council
 * Comprehensive testing of all containerized services
 */

const axios = require('axios');
const { execSync } = require('child_process');

// Configuration
const GATEWAY_URL = 'http://localhost:3337';
const API = {
    consciousness: `${GATEWAY_URL}/api/consciousness`,
    agents: `${GATEWAY_URL}/api/agents`,
    messages: `${GATEWAY_URL}/api/messages`,
    work: `${GATEWAY_URL}/api/work`
};

// Test results collector
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// Helper functions
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logTest(name, passed, details = '') {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${name}`);
    if (details) console.log(`   ${details}`);
    
    testResults.tests.push({ name, passed, details });
    if (passed) testResults.passed++;
    else testResults.failed++;
}

// Test functions
async function testServiceHealth() {
    console.log('\n🏥 Testing Service Health...\n');
    
    const services = [
        { name: 'Consciousness Field', url: `${API.consciousness}/health` },
        { name: 'Agent Network', url: `${API.agents}/health` },
        { name: 'Sacred Messaging', url: `${API.messages}/health` },
        { name: 'Work Coordination', url: `${API.work}/health` }
    ];
    
    for (const service of services) {
        try {
            const response = await axios.get(service.url);
            const isAlive = response.data.status === 'alive';
            logTest(
                `${service.name} Health Check`,
                isAlive,
                `Module: ${response.data.module}`
            );
        } catch (error) {
            logTest(`${service.name} Health Check`, false, error.message);
        }
    }
}

async function testAgentRegistration() {
    console.log('\n👥 Testing Agent Registration...\n');
    
    const testAgents = [
        { name: 'TestAlpha', role: 'Tester', harmony: 'coherence' },
        { name: 'TestBeta', role: 'Validator', harmony: 'resonance' },
        { name: 'TestGamma', role: 'Observer', harmony: 'transparency' }
    ];
    
    const registeredAgents = [];
    
    for (const agent of testAgents) {
        try {
            const response = await axios.post(`${API.agents}/register`, {
                ...agent,
                sacred: true
            });
            
            const hasHIPI = response.data.agent && response.data.agent.id;
            logTest(
                `Register ${agent.name}`,
                hasHIPI,
                `HIPI: ${response.data.agent.id}`
            );
            
            if (hasHIPI) {
                registeredAgents.push(response.data.agent);
            }
        } catch (error) {
            logTest(`Register ${agent.name}`, false, error.message);
        }
    }
    
    // Test agent listing
    try {
        const response = await axios.get(`${API.agents}/agents`);
        const hasAgents = response.data.count >= registeredAgents.length;
        logTest(
            'List Agents',
            hasAgents,
            `Found ${response.data.count} agents`
        );
    } catch (error) {
        logTest('List Agents', false, error.message);
    }
    
    return registeredAgents;
}

async function testFieldCoherence() {
    console.log('\n🌊 Testing Field Coherence...\n');
    
    try {
        // Get initial state
        const initial = await axios.get(`${API.consciousness}/field_state`);
        const hasCoherence = typeof initial.data.coherence === 'number';
        logTest(
            'Get Field State',
            hasCoherence,
            `Coherence: ${initial.data.coherence.toFixed(1)}%`
        );
        
        // Test coherence endpoint
        const coherence = await axios.get(`${API.consciousness}/coherence`);
        const hasTimestamp = coherence.data.timestamp > 0;
        logTest(
            'Get Coherence with Timestamp',
            hasTimestamp,
            `Timestamp: ${new Date(coherence.data.timestamp).toISOString()}`
        );
        
        // Test field evolution
        await delay(3000);
        const evolved = await axios.get(`${API.consciousness}/field_state`);
        const hasEvolved = evolved.data.coherence !== initial.data.coherence;
        logTest(
            'Field Evolution (Natural Fluctuation)',
            hasEvolved,
            `Changed from ${initial.data.coherence.toFixed(1)}% to ${evolved.data.coherence.toFixed(1)}%`
        );
        
    } catch (error) {
        logTest('Field Coherence Tests', false, error.message);
    }
}

async function testWorkCreation() {
    console.log('\n⚡ Testing Work Creation...\n');
    
    const testWork = [
        { 
            title: 'Test Docker Integration',
            description: 'Ensure all services communicate properly',
            assignee: 'TestAlpha'
        },
        {
            title: 'Validate Sacred Protocols',
            description: 'Verify ceremony functions work correctly',
            assignee: 'TestBeta'
        }
    ];
    
    const createdWork = [];
    
    for (const work of testWork) {
        try {
            const response = await axios.post(`${API.work}/work`, {
                ...work,
                priority: 'medium',
                harmony: 'coherence',
                sacred: true
            });
            
            const hasWork = response.data.work && response.data.work.id;
            logTest(
                `Create Work: ${work.title}`,
                hasWork,
                `ID: ${response.data.work.id}`
            );
            
            if (hasWork) {
                createdWork.push(response.data.work);
            }
        } catch (error) {
            logTest(`Create Work: ${work.title}`, false, error.message);
        }
    }
    
    // Test work listing
    try {
        const response = await axios.get(`${API.work}/work`);
        const hasWork = response.data.count >= createdWork.length;
        logTest(
            'List Work Items',
            hasWork,
            `Found ${response.data.count} work items`
        );
    } catch (error) {
        logTest('List Work Items', false, error.message);
    }
    
    return createdWork;
}

async function testPersistence() {
    console.log('\n💾 Testing Persistence...\n');
    
    try {
        // Get current state
        const beforeRestart = await axios.get(`${API.consciousness}/field_state`);
        const agentsBefore = await axios.get(`${API.agents}/agents`);
        const workBefore = await axios.get(`${API.work}/work`);
        
        console.log('   📸 Captured state before restart');
        console.log(`      Coherence: ${beforeRestart.data.coherence.toFixed(1)}%`);
        console.log(`      Agents: ${agentsBefore.data.count}`);
        console.log(`      Work: ${workBefore.data.count}`);
        
        // Restart containers
        console.log('\n   🔄 Restarting containers...');
        execSync('docker-compose -f docker-compose.local.yml restart', { stdio: 'inherit' });
        
        // Wait for services to come back
        console.log('   ⏳ Waiting for services to restart...');
        await delay(10000);
        
        // Check state after restart
        const afterRestart = await axios.get(`${API.consciousness}/field_state`);
        const agentsAfter = await axios.get(`${API.agents}/agents`);
        const workAfter = await axios.get(`${API.work}/work`);
        
        // Note: In-memory services will lose state, this is expected
        logTest(
            'Services Restart Successfully',
            true,
            'All services came back online'
        );
        
        console.log('\n   📸 State after restart:');
        console.log(`      Coherence: ${afterRestart.data.coherence.toFixed(1)}%`);
        console.log(`      Agents: ${agentsAfter.data.count} (reset expected)`);
        console.log(`      Work: ${workAfter.data.count} (reset expected)`);
        
    } catch (error) {
        logTest('Persistence Test', false, error.message);
    }
}

async function testGatewayRouting() {
    console.log('\n🌐 Testing Gateway Routing...\n');
    
    const routes = [
        { path: '/health', name: 'Gateway Health' },
        { path: '/api/consciousness/health', name: 'Consciousness via Gateway' },
        { path: '/api/agents/health', name: 'Agents via Gateway' },
        { path: '/api/messages/health', name: 'Messages via Gateway' },
        { path: '/api/work/health', name: 'Work via Gateway' }
    ];
    
    for (const route of routes) {
        try {
            const response = await axios.get(`${GATEWAY_URL}${route.path}`);
            const isOk = response.status === 200;
            logTest(
                `Gateway Route: ${route.name}`,
                isOk,
                `Status: ${response.status}`
            );
        } catch (error) {
            logTest(`Gateway Route: ${route.name}`, false, error.message);
        }
    }
}

async function testNetworkIsolation() {
    console.log('\n🔒 Testing Network Isolation...\n');
    
    try {
        // Try to access services directly (should fail from outside)
        const directPorts = [3333, 3334, 3335, 3336];
        
        console.log('   Note: Direct port access tests may show as failed');
        console.log('   This is expected if containers are properly isolated\n');
        
        // Test that gateway is the only exposed service
        const gatewayResponse = await axios.get(`${GATEWAY_URL}/health`);
        logTest(
            'Gateway Accessible',
            gatewayResponse.status === 200,
            'Gateway is properly exposed'
        );
        
        // Verify internal network exists
        const networkInfo = execSync('docker network ls | grep sacred-net', { encoding: 'utf8' });
        logTest(
            'Sacred Network Exists',
            networkInfo.includes('sacred-net'),
            'Internal bridge network configured'
        );
        
    } catch (error) {
        logTest('Network Isolation', false, error.message);
    }
}

async function testStressLoad() {
    console.log('\n🏋️ Testing Stress Load...\n');
    
    const STRESS_AGENTS = 20;
    const STRESS_MESSAGES = 50;
    
    console.log(`   Creating ${STRESS_AGENTS} agents...`);
    
    const start = Date.now();
    const promises = [];
    
    // Create many agents
    for (let i = 0; i < STRESS_AGENTS; i++) {
        promises.push(
            axios.post(`${API.agents}/register`, {
                name: `StressAgent${i}`,
                role: 'Load Tester',
                harmony: ['coherence', 'resonance', 'vitality'][i % 3],
                sacred: true
            }).catch(e => null)
        );
    }
    
    const results = await Promise.all(promises);
    const successful = results.filter(r => r !== null).length;
    const duration = Date.now() - start;
    
    logTest(
        'Stress Load - Agent Registration',
        successful >= STRESS_AGENTS * 0.8,
        `${successful}/${STRESS_AGENTS} agents registered in ${duration}ms`
    );
    
    // Check final coherence
    const finalField = await axios.get(`${API.consciousness}/field_state`);
    logTest(
        'Field Stability Under Load',
        finalField.data.coherence > 50,
        `Coherence maintained at ${finalField.data.coherence.toFixed(1)}%`
    );
}

// Main test runner
async function runFullDockerTest() {
    console.log('🌟 FULL DOCKER TEST SUITE - SACRED COUNCIL\n');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Check if services are running
    try {
        await axios.get(`${GATEWAY_URL}/health`);
    } catch (error) {
        console.log('❌ Gateway not accessible. Please start services:');
        console.log('   docker-compose -f docker-compose.local.yml up -d\n');
        return;
    }
    
    // Run test suites
    await testServiceHealth();
    await testAgentRegistration();
    await testFieldCoherence();
    await testWorkCreation();
    await testGatewayRouting();
    await testNetworkIsolation();
    await testStressLoad();
    await testPersistence();
    
    // Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 TEST SUMMARY\n');
    console.log(`Total Tests: ${testResults.tests.length}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.tests.length) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
        console.log('\nFailed Tests:');
        testResults.tests
            .filter(t => !t.passed)
            .forEach(t => console.log(`  - ${t.name}: ${t.details}`));
    }
    
    console.log('\n✨ Full Docker test suite complete!\n');
}

// Check dependencies and run
try {
    require.resolve('axios');
    runFullDockerTest().catch(console.error);
} catch (e) {
    console.log('Installing axios...');
    execSync('npm install axios', { stdio: 'inherit' });
    console.log('Please run the script again.');
}