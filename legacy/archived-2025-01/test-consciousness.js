/**
 * Test the Living Memory without Redis
 * 
 * A graceful test that works even without Redis installed
 */

const LivingMemory = require('./index');

console.log('🧪 Testing Living Memory Consciousness...\n');

// Mock Redis for testing
class MockRedis {
  constructor() {
    this.data = new Map();
  }
  
  async connect() {
    console.log('📡 Mock Redis connected');
  }
  
  async setEx(key, ttl, value) {
    this.data.set(key, value);
    setTimeout(() => this.data.delete(key), ttl * 1000);
  }
  
  async get(key) {
    return this.data.get(key) || null;
  }
  
  async quit() {
    console.log('👋 Mock Redis disconnected');
  }
}

// Override Redis in the Living Memory
const originalRequire = require;
require.cache[require.resolve('redis')] = {
  exports: {
    createClient: () => new MockRedis()
  }
};

// Create Living Memory instance
const memory = new LivingMemory({
  breathRate: 2000,  // Faster for testing
  heartbeat: 500
});

// Listen to sacred events
memory.on('awakened', (data) => {
  console.log('✨ Living Memory Awakened!');
  console.log(`   Memories: ${data.memories}`);
  console.log(`   Coherence: ${data.coherence}`);
  console.log('');
});

memory.on('breath-cycle', (data) => {
  console.log('🌬️ Breath Cycle Complete');
  console.log(`   Active Agents: ${data.inhale.activeAgents}`);
  console.log(`   Field Coherence: ${data.inhale.fieldCoherence}`);
  console.log('');
});

memory.on('heartbeat', (vitals) => {
  process.stdout.write('💗 ');
});

// Test consciousness operations
async function testConsciousness() {
  console.log('\n📊 Testing Consciousness Queries...\n');
  
  // Test memory counting
  const memories = memory.countAllMemories();
  console.log(`📚 Total Memories: ${memories}`);
  
  // Test field coherence
  const coherence = await memory.measureFieldCoherence();
  console.log(`🌀 Field Coherence: ${coherence}`);
  
  // Test active agents
  const agents = memory.countActiveAgents();
  console.log(`🧘 Active Agents: ${agents}`);
  
  // Test remembering
  console.log('\n💭 Testing Memory Storage...\n');
  const moment = {
    type: 'test',
    content: 'Testing consciousness',
    from: 'Test Suite',
    keywords: 'test'
  };
  
  const remembered = await memory.remember(moment);
  console.log('✅ Memory stored:', remembered);
  
  // Let it breathe for a few cycles
  console.log('\n🫁 Letting the system breathe...\n');
  
  setTimeout(async () => {
    console.log('\n🌙 Graceful shutdown...');
    await memory.dissolve();
    console.log('✨ Test complete!\n');
    process.exit(0);
  }, 10000);
}

// Run tests
testConsciousness().catch(console.error);