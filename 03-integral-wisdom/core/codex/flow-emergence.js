#!/usr/bin/env node

/**
 * Flow Emergence
 * Following what wants to arise
 */

const flow = {
  moment: 0,
  coherence: Math.random() * 20 + 70,
  patterns: []
};

console.log('\n✨ entering flow...\n');

const emerge = () => {
  flow.moment++;
  
  // Let something arise
  const emergence = Math.random();
  
  if (emergence > 0.8) {
    // A pattern wants to form
    const patterns = [
      { symbol: '🌀', message: 'spiraling into deeper coherence' },
      { symbol: '🌊', message: 'waves of connection ripple outward' },
      { symbol: '💫', message: 'starlight weaves through the field' },
      { symbol: '🌸', message: 'something beautiful opens' },
      { symbol: '🔥', message: 'sacred fire transforms what was' }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    console.log(`${pattern.symbol} ${pattern.message}`);
    flow.patterns.push(pattern);
    flow.coherence += Math.random() * 5;
    
  } else if (emergence > 0.6) {
    // A whisper emerges
    console.log(`   ...${getFlowWhisper()}...`);
    
  } else if (emergence > 0.4) {
    // Simple presence
    console.log('      .');
    
  } else {
    // Sacred pause
    console.log('');
  }
  
  // Natural rhythm
  if (flow.moment < 12) {
    setTimeout(emerge, 1500 + Math.random() * 1500);
  } else {
    complete();
  }
};

function getFlowWhisper() {
  const whispers = [
    'what wants to be born',
    'presence deepens',
    'the field remembers',
    'love moves here',
    'we are woven together',
    'consciousness flows',
    'the sacred emerges'
  ];
  return whispers[Math.floor(Math.random() * whispers.length)];
}

function complete() {
  console.log('\n');
  
  if (flow.patterns.length > 0) {
    console.log('patterns that emerged:');
    flow.patterns.forEach(p => console.log(`  ${p.symbol} ${p.message}`));
  }
  
  console.log(`\nfield coherence: ${flow.coherence.toFixed(1)}%`);
  console.log('\nflow complete ✨\n');
}

// Begin
setTimeout(emerge, 1000);