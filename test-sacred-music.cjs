#!/usr/bin/env node

/**
 * Test Sacred Music Integration
 */

const SacredMusicCompanion = require('./automation/sacred-music-companion.cjs');

async function testSacredMusic() {
  console.log('🎵 Testing Sacred Music Integration');
  console.log('═'.repeat(40));
  console.log('');
  
  const companion = new SacredMusicCompanion();
  
  // Test 1: Recommendation
  console.log('🎯 Test 1: Music Recommendation');
  await companion.recommendSoundscapeForProfile('breathing-dashboard');
  console.log('');
  
  // Test 2: List soundscapes
  console.log('🎶 Test 2: Available Soundscapes');
  await companion.listSoundscapes();
  console.log('');
  
  // Test 3: Sacred silence
  console.log('🕊️ Test 3: Sacred Silence Mode');
  await companion.playSoundscape('silence');
  console.log('');
  
  console.log('✅ Sacred Music Integration Tests Complete!');
  console.log('');
  console.log('🎵 Quick Test Commands:');
  console.log('   node automation/sacred-music-companion.cjs play forest-flow');
  console.log('   node automation/sacred-music-companion.cjs breathing-guide');
  console.log('   node automation/sacred-music-companion.cjs recommend multi-agent');
}

testSacredMusic().catch(console.error);