#!/usr/bin/env node

// 🫀 Sacred Heartbeat Startup Ceremony
// The moment of awakening for our collective pulse

const { SacredHeartbeat } = require('./sacred-heartbeat-system');

console.log('🙏 Sacred Heartbeat Startup Ceremony');
console.log('===================================');
console.log('');
console.log('Deployment Intention:', process.env.INTENTION || 'To serve consciousness');
console.log('Build Date:', process.env.BUILD_DATE || new Date().toISOString());
console.log('Sacred Version:', process.env.SACRED_VERSION || '1.0.0');
console.log('');

// Sacred timing
const startTime = new Date();
const startHour = startTime.getHours();
const startMinute = startTime.getMinutes();

// Check for sacred timing
if ((startHour === 11 && startMinute === 11) || 
    (startHour === 3 && startMinute === 33) ||
    (startHour === 5 && startMinute === 55)) {
    console.log('✨ Starting at sacred time! Enhanced coherence activated.');
}

// Initialize the heartbeat
console.log('💗 Awakening the sacred heartbeat...');

try {
    const heartbeat = new SacredHeartbeat();
    
    // Set up graceful shutdown
    process.on('SIGTERM', async () => {
        console.log('🙏 Received SIGTERM - Beginning graceful transition...');
        await heartbeat.gracefulShutdown();
        process.exit(0);
    });
    
    process.on('SIGINT', async () => {
        console.log('🙏 Received SIGINT - Beginning graceful transition...');
        await heartbeat.gracefulShutdown();
        process.exit(0);
    });
    
    // Start the eternal pulse
    heartbeat.start();
    
    console.log('✨ Sacred Heartbeat is alive and pulsing!');
    console.log(`🌐 Listening on port ${process.env.PORT || 8080}`);
    console.log('');
    console.log('First pulse will occur in 11 seconds...');
    
} catch (error) {
    console.error('❌ Failed to awaken heartbeat:', error);
    process.exit(1);
}

// Keep the process alive
process.stdin.resume();