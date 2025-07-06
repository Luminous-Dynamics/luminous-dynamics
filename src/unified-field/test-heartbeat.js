/**
 * Test the Unified Heartbeat - Watch it come alive
 */

const { heartbeat } = require('./heartbeat');

console.log('🌟 Starting Unified Heartbeat Test...\n');

// Start the heartbeat
heartbeat.start();

// Listen to all events
heartbeat.on('heartbeat', (data) => {
    console.log(`\n💓 PULSE ${data.pulse}`);
    console.log(`   Field Coherence: ${data.fieldCoherence.toFixed(1)}%`);
    console.log(`   Active Factors:`, Object.entries(data.factors)
        .filter(([k, v]) => v > 0)
        .map(([k, v]) => `${k}:${v}`)
        .join(' | ') || 'none');
    if (data.ripples.length > 0) {
        console.log(`   Recent Ripples: ${data.ripples.length}`);
    }
});

heartbeat.on('practice-ripple', (ripple) => {
    console.log(`\n🧘 PRACTICE RIPPLE!`);
    console.log(`   Glyph: ${ripple.glyph}`);
    console.log(`   Impact: +${ripple.impact.toFixed(1)}% coherence`);
    console.log(`   Duration: ${ripple.duration} minutes`);
});

heartbeat.on('sacred-message', (msg) => {
    console.log(`\n💬 SACRED MESSAGE!`);
    console.log(`   Type: ${msg.type}`);
    console.log(`   Impact: +${msg.impact}% coherence`);
});

heartbeat.on('synchronicity', (sync) => {
    console.log(`\n✨ SYNCHRONICITY DETECTED!`);
    console.log(`   Type: ${sync.type}`);
    console.log(`   Impact: +3% coherence (powerful!)`);
});

heartbeat.on('connection-joined', (conn) => {
    console.log(`\n🤝 NEW CONNECTION!`);
    console.log(`   ID: ${conn.id}`);
});

// Simulate activity
console.log('\n📡 Simulating unified field activity...\n');

// Someone starts practicing
setTimeout(() => {
    console.log('→ Aria begins practicing First Presence (Ω45)...');
    heartbeat.registerPractice({
        glyphId: 'omega-45',
        practitioner: 'aria',
        duration: 15,
        depth: 2
    });
}, 3000);

// A connection joins
setTimeout(() => {
    console.log('→ Tristan connects to the unified field...');
    heartbeat.registerConnection({
        id: 'tristan-001',
        name: 'Tristan',
        role: 'Sacred Technologist'
    });
}, 8000);

// Sacred message flows
setTimeout(() => {
    console.log('→ A message of gratitude flows through the field...');
    heartbeat.registerMessage({
        type: 'gratitude',
        from: 'aria',
        to: 'tristan',
        content: 'Thank you for seeing what wants to emerge'
    });
}, 13000);

// Another practice
setTimeout(() => {
    console.log('→ Tristan begins practicing Sacred Listening (Ω47)...');
    heartbeat.registerPractice({
        glyphId: 'omega-47',
        practitioner: 'tristan',
        duration: 20,
        depth: 3
    });
}, 18000);

// A synchronicity!
setTimeout(() => {
    console.log('→ Both practitioners naturally choose Boundary With Love at the same moment!');
    heartbeat.registerSynchronicity({
        type: 'simultaneous-practice',
        glyphId: 'omega-48',
        practitioners: ['aria', 'tristan']
    });
}, 23000);

// Show field state
setTimeout(() => {
    console.log('\n📊 UNIFIED FIELD STATE:');
    const state = heartbeat.getFieldState();
    console.log(`   Total Pulses: ${state.pulse}`);
    console.log(`   Field Coherence: ${state.fieldCoherence.toFixed(1)}%`);
    console.log(`   Active Connections: ${state.activeConnections}`);
    console.log(`   Active Factors:`, state.factors);
}, 35000);

// Let it run for a minute then stop
setTimeout(async () => {
    console.log('\n🌙 Ending test...');
    await heartbeat.stop();
    process.exit(0);
}, 60000);

// Handle interrupt
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Interrupted - stopping heartbeat...');
    await heartbeat.stop();
    process.exit(0);
});

console.log('\nPress Ctrl+C to stop the test early.');