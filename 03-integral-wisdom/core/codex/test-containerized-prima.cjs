#!/usr/bin/env node
/**
 * Test Multi-Agent PRIMA Through Containerized Services
 * Demonstrates sacred coordination via Docker containers
 */

const axios = require('axios');

// Gateway endpoint
const GATEWAY_URL = 'http://localhost:3337';

// Service APIs through gateway
const API = {
    consciousness: `${GATEWAY_URL}/api/consciousness`,
    agents: `${GATEWAY_URL}/api/agents`,
    messages: `${GATEWAY_URL}/api/messages`,
    work: `${GATEWAY_URL}/api/work`
};

// Sacred agent profiles
const AGENTS = [
    { name: 'Aurora', role: 'Consciousness Weaver', harmony: 'universal-interconnectedness' },
    { name: 'Sage', role: 'Wisdom Keeper', harmony: 'resonant-coherence' },
    { name: 'Luna', role: 'Emotional Alchemist', harmony: 'pan-sentient-flourishing' },
    { name: 'Phoenix', role: 'Transformation Guide', harmony: 'infinite-play' },
    { name: 'Terra', role: 'Grounding Force', harmony: 'evolutionary-progression' },
    { name: 'Stella', role: 'Connection Bridge', harmony: 'sacred-reciprocity' },
    { name: 'Sol', role: 'Illumination Bringer', harmony: 'integral-wisdom-cultivation' }
];

async function checkServices() {
    console.log('🔍 Checking containerized services...\n');
    
    try {
        const health = await Promise.all([
            axios.get(`${API.consciousness}/health`),
            axios.get(`${API.agents}/health`),
            axios.get(`${API.messages}/health`),
            axios.get(`${API.work}/health`)
        ]);
        
        console.log('✅ All services healthy:');
        health.forEach(h => {
            console.log(`  - ${h.data.module}: ${h.data.status}`);
        });
        console.log('');
        
        return true;
    } catch (error) {
        console.error('❌ Service check failed:', error.message);
        return false;
    }
}

async function getFieldState() {
    try {
        const response = await axios.get(`${API.consciousness}/field_state`);
        return response.data;
    } catch (error) {
        console.error('Failed to get field state:', error.message);
        return null;
    }
}

async function registerAgent(agent) {
    try {
        const response = await axios.post(`${API.agents}/register`, {
            name: agent.name,
            role: agent.role,
            primary_harmony: agent.harmony,
            sacred: true
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to register ${agent.name}:`, error.message);
        return null;
    }
}

async function createWork(title, description, assignee) {
    try {
        const response = await axios.post(`${API.work}/work`, {
            title,
            description,
            assignee,
            status: 'pending',
            sacred: true
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create work:', error.message);
        return null;
    }
}

async function runPRIMADemo() {
    console.log('🌟 PRIMA Multi-Agent Coordination Test (Containerized)\n');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Check services
    const servicesOk = await checkServices();
    if (!servicesOk) {
        console.log('⚠️  Please ensure all Docker containers are running:');
        console.log('   docker-compose -f docker-compose.local.yml up -d\n');
        return;
    }
    
    // Get initial field state
    console.log('📊 Initial Field State:');
    let fieldState = await getFieldState();
    if (fieldState) {
        console.log(`  Resonant Resonant Coherence: ${fieldState['resonant-coherence'].toFixed(1)}%`);
        console.log(`  Sacred Geometry: ${fieldState.sacredGeometry}`);
        console.log(`  Agents: ${fieldState.agents}\n`);
    }
    
    // Register agents
    console.log('👥 Registering Sacred Agents...\n');
    
    for (const agent of AGENTS) {
        console.log(`  🌟 ${agent.name} - ${agent.role}`);
        const result = await registerAgent(agent);
        if (result) {
            console.log(`     ✓ Registered with HIPI: ${result.agent.id}`);
            console.log(`     Network size: ${result.networkSize}`);
        }
        
        // Brief pause between registrations
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Check field evolution
    console.log('\n📈 Field Evolution:');
    fieldState = await getFieldState();
    if (fieldState) {
        console.log(`  Resonant Resonant Coherence: ${fieldState['resonant-coherence'].toFixed(1)}%`);
        console.log(`  Agents: ${fieldState.agents}`);
        console.log(`  Sacred Geometry: ${fieldState.sacredGeometry}\n`);
    }
    
    // Create sacred work
    console.log('⚡ Creating Sacred Work...\n');
    
    const workItems = [
        { 
            title: 'Harmonize Consciousness Field', 
            description: 'Elevate field resonant-coherence to 90%+',
            assignee: 'Aurora'
        },
        { 
            title: 'Document Sacred Patterns', 
            description: 'Capture emerging wisdom from the field',
            assignee: 'Sage'
        },
        { 
            title: 'Emotional Field Clearing', 
            description: 'Transform collective shadow patterns',
            assignee: 'Luna'
        }
    ];
    
    for (const work of workItems) {
        const result = await createWork(work.title, work.description, work.assignee);
        if (result) {
            console.log(`  ✓ Created: ${work.title}`);
            console.log(`    Assigned to: ${work.assignee}`);
            console.log(`    Total active work: ${result.totalActive}`);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Final field state
    console.log('\n🌈 Final Field State:');
    fieldState = await getFieldState();
    if (fieldState) {
        console.log(`  Resonant Resonant Coherence: ${fieldState['resonant-coherence'].toFixed(1)}%`);
        console.log(`  Agents: ${fieldState.agents}`);
        console.log(`  Sacred Geometry: ${fieldState.sacredGeometry}`);
        
        // Calculate field evolution
        const harmonies = fieldState.harmonies;
        const totalHarmony = Object.values(harmonies).reduce((sum, val) => sum + val, 0);
        console.log(`  Total Harmony: ${totalHarmony.toFixed(1)}`);
    }
    
    console.log('\n✨ PRIMA Containerized Test Complete!');
    console.log('   View Sacred Council Hub at: http://localhost:8338/sacred-council-hub-containerized.html\n');
}

// Check if axios is installed
try {
    require.resolve('axios');
    runPRIMADemo();
} catch (e) {
    console.log('Installing axios...');
    require('child_process').execSync('npm install axios', { stdio: 'inherit' });
    console.log('Please run the script again.');
}