#!/usr/bin/env node
/**
 * Test Sacred Practice Intelligence
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';

async function testPracticeIntelligence() {
  console.log('\n🧪 Testing Sacred Practice Intelligence');
  console.log('=====================================\n');
  
  try {
    // Test 1: Get intelligence stats
    console.log('1. Getting intelligence stats...');
    const stats = await axios.get(`${BASE_URL}/api/practice-intelligence/stats`);
    console.log('   Stats:', stats.data);
    
    // Test 2: Get practice suggestion
    console.log('\n2. Getting practice suggestion...');
    const suggestion = await axios.post(`${BASE_URL}/api/practice-intelligence/suggest`, {
      practitionerId: 'test-user',
      intention: 'grounding and presence'
    });
    console.log('   Suggestion:', suggestion.data);
    
    // Test 3: Start a practice
    console.log('\n3. Starting suggested practice...');
    const practiceStart = await axios.post(`${BASE_URL}/api/practice/glyphs/practice`, {
      glyphId: suggestion.data.suggestion?.glyphId || 'omega-45',
      practitioner: { id: 'test-user', name: 'Test Practitioner' }
    });
    console.log('   Practice started:', practiceStart.data);
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 4: Complete practice with insights
    console.log('\n4. Completing practice with insights...');
    const practiceComplete = await axios.post(`${BASE_URL}/api/practice/glyphs/complete`, {
      practiceId: practiceStart.data.id,
      insights: 'Felt a deep sense of grounding and presence'
    });
    console.log('   Practice completed:', practiceComplete.data);
    
    // Test 5: Get updated suggestion (should learn from previous)
    console.log('\n5. Getting new suggestion after learning...');
    const newSuggestion = await axios.post(`${BASE_URL}/api/practice-intelligence/suggest`, {
      practitionerId: 'test-user',
      intention: 'deeper connection'
    });
    console.log('   New suggestion:', newSuggestion.data);
    
    // Test 6: Get practitioner profile
    console.log('\n6. Getting practitioner profile...');
    const profile = await axios.get(`${BASE_URL}/api/practice-intelligence/profile/test-user`);
    console.log('   Profile:', profile.data);
    
    // Test 7: Get collective insight
    console.log('\n7. Getting collective insight for omega-45...');
    const insight = await axios.get(`${BASE_URL}/api/practice-intelligence/insight/omega-45`);
    console.log('   Collective insight:', insight.data);
    
    console.log('\n✨ Practice Intelligence test complete!');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run test
testPracticeIntelligence();