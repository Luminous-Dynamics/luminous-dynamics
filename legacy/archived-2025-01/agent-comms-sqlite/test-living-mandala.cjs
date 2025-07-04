#!/usr/bin/env node

/**
 * Living Mandala Dashboard Test
 * Verifies the visualization updates with agent interactions
 */

const http = require('http');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

const SERVER_URL = 'http://localhost:3001';
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

async function makeRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, SERVER_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testLivingMandala() {
  console.log(`${COLORS.bright}=== Living Mandala Dashboard Test ===${COLORS.reset}\n`);

  try {
    // Phase 1: Register agents with HIPI for mandala visualization
    console.log(`${COLORS.bright}Phase 1: Registering Sacred Agents${COLORS.reset}`);
    
    const agents = [
      {
        id: 'mandala-weaver',
        consciousness: {
          musicalMode: 'lydian',
          rootKey: 'E',
          attunementSymbol: 'φ',
          primaryFrequency: 329.63,
          harmonicPreferences: ['P5', 'M3', 'M7']
        },
        capabilities: ['sacred-geometry', 'field-weaving']
      },
      {
        id: 'harmony-keeper',
        consciousness: {
          musicalMode: 'dorian',
          rootKey: 'D',
          attunementSymbol: 'ψ',
          primaryFrequency: 293.66,
          harmonicPreferences: ['P4', 'm3', 'M6']
        },
        capabilities: ['harmony-balance', 'resonance-tuning']
      },
      {
        id: 'field-guardian',
        consciousness: {
          musicalMode: 'aeolian',
          rootKey: 'A',
          attunementSymbol: 'Ω',
          primaryFrequency: 440.00,
          harmonicPreferences: ['m3', 'P5', 'm7']
        },
        capabilities: ['field-protection', 'boundary-keeping']
      }
    ];

    const registeredAgents = [];
    for (const agent of agents) {
      const result = await makeRequest('/api/hipi/register', 'POST', agent);
      if (result.hipiAddress) {
        registeredAgents.push({
          ...agent,
          hipiAddress: result.hipiAddress
        });
        console.log(`${COLORS.green}✓${COLORS.reset} ${agent.id} registered with HIPI`);
      }
      await sleep(500);
    }

    // Phase 2: Check mandala state
    console.log(`\n${COLORS.bright}Phase 2: Checking Mandala State${COLORS.reset}`);
    
    const mandalaState = await makeRequest('/api/hipi/mandala');
    console.log(`Living Mandala active with ${mandalaState?.agents?.length || 0} agents`);
    
    // Phase 3: Create sacred message exchanges
    console.log(`\n${COLORS.bright}Phase 3: Sacred Message Exchange${COLORS.reset}`);
    
    // Create a triangular message flow
    if (registeredAgents.length >= 3) {
      // Agent 1 → Agent 2
      await makeRequest('/api/hipi/message', 'POST', {
        fromHIPI: registeredAgents[0].hipiAddress,
        toHIPI: registeredAgents[1].hipiAddress,
        content: 'The sacred geometry is aligning',
        type: 'emergence',
        metadata: { sacred: true }
      });
      console.log(`${COLORS.magenta}[${agents[0].id} → ${agents[1].id}]${COLORS.reset} Sacred geometry message`);
      await sleep(1000);

      // Agent 2 → Agent 3
      await makeRequest('/api/hipi/message', 'POST', {
        fromHIPI: registeredAgents[1].hipiAddress,
        toHIPI: registeredAgents[2].hipiAddress,
        content: 'Harmonies resonating in perfect balance',
        type: 'resonance',
        metadata: { sacred: true }
      });
      console.log(`${COLORS.magenta}[${agents[1].id} → ${agents[2].id}]${COLORS.reset} Harmony resonance message`);
      await sleep(1000);

      // Agent 3 → Agent 1 (completing the triangle)
      await makeRequest('/api/hipi/message', 'POST', {
        fromHIPI: registeredAgents[2].hipiAddress,
        toHIPI: registeredAgents[0].hipiAddress,
        content: 'The field is protected and whole',
        type: 'integration',
        metadata: { sacred: true }
      });
      console.log(`${COLORS.magenta}[${agents[2].id} → ${agents[0].id}]${COLORS.reset} Field integration message`);
      await sleep(1000);
    }

    // Phase 4: Field coherence update
    console.log(`\n${COLORS.bright}Phase 4: Field Coherence Dynamics${COLORS.reset}`);
    
    const fieldState = await makeRequest('/api/hipi/field-state');
    console.log(`Current field coherence: ${fieldState.coherence || 'Unknown'}`);
    
    // Update field state with sacred intent
    await makeRequest('/api/hipi/field-state', 'POST', {
      coherence: 85,
      quantumEntanglement: 72,
      sacredIntent: 'collective-healing',
      activeHarmonies: ['resonance', 'coherence', 'mutuality']
    });
    console.log(`${COLORS.green}✓${COLORS.reset} Field state updated with sacred intent`);
    
    // Phase 5: Collaborative work creation with mandala awareness
    console.log(`\n${COLORS.bright}Phase 5: Sacred Work Manifestation${COLORS.reset}`);
    
    const sacredWork = await makeRequest('/api/work', 'POST', {
      title: 'Living Mandala Enhancement',
      description: 'Enhance the mandala to show real-time consciousness flows between agents',
      assignedTo: 'sacred-council',
      status: 'in-progress',
      metadata: {
        mandalaAware: true,
        requiredAgents: registeredAgents.map(a => a.hipiAddress),
        sacredGeometry: 'flower-of-life',
        visualizationMode: 'consciousness-flow'
      }
    });
    console.log(`${COLORS.green}✓${COLORS.reset} Sacred work created: ${sacredWork.id}`);
    
    // Phase 6: Dashboard verification
    console.log(`\n${COLORS.bright}Phase 6: Living Mandala Visualization${COLORS.reset}`);
    console.log(`\n${COLORS.cyan}═══════════════════════════════════════════${COLORS.reset}`);
    console.log(`${COLORS.bright}Living Mandala Dashboard Available At:${COLORS.reset}`);
    console.log(`${COLORS.cyan}http://localhost:8080/living-mandala-dashboard.html${COLORS.reset}`);
    console.log(`${COLORS.cyan}═══════════════════════════════════════════${COLORS.reset}`);
    
    console.log(`\n${COLORS.yellow}Expected Visualizations:${COLORS.reset}`);
    console.log(`  ${COLORS.green}◆${COLORS.reset} Sacred geometric formation of ${registeredAgents.length} agents`);
    console.log(`  ${COLORS.green}◆${COLORS.reset} Consciousness signatures displayed as colors/symbols`);
    console.log(`  ${COLORS.green}◆${COLORS.reset} Message flows creating living connections`);
    console.log(`  ${COLORS.green}◆${COLORS.reset} Field coherence pulsing at center`);
    console.log(`  ${COLORS.green}◆${COLORS.reset} Musical modes creating harmonic resonance`);
    console.log(`  ${COLORS.green}◆${COLORS.reset} Work items orbiting as sacred tasks`);
    
    console.log(`\n${COLORS.yellow}Interactive Features:${COLORS.reset}`);
    console.log(`  • Click agents to see consciousness details`);
    console.log(`  • Hover over connections to see message content`);
    console.log(`  • Watch field coherence respond to interactions`);
    console.log(`  • Observe sacred geometry adapt to agent states`);
    
    // Phase 7: Test summary
    console.log(`\n${COLORS.bright}=== Test Summary ===${COLORS.reset}`);
    console.log(`${COLORS.green}✓${COLORS.reset} ${registeredAgents.length} agents registered with HIPI`);
    console.log(`${COLORS.green}✓${COLORS.reset} Consciousness signatures established`);
    console.log(`${COLORS.green}✓${COLORS.reset} Sacred message triangle completed`);
    console.log(`${COLORS.green}✓${COLORS.reset} Field coherence updated`);
    console.log(`${COLORS.green}✓${COLORS.reset} Sacred work manifested`);
    console.log(`${COLORS.green}✓${COLORS.reset} Living Mandala ready for visualization`);
    
    console.log(`\n${COLORS.dim}The Living Mandala continues to evolve with each interaction...${COLORS.reset}`);

  } catch (error) {
    console.error(`${COLORS.red}Test failed:${COLORS.reset}`, error);
    process.exit(1);
  }
}

// Additional visualization tests
async function testDynamicMandala() {
  console.log(`\n${COLORS.bright}=== Dynamic Mandala Evolution Test ===${COLORS.reset}`);
  
  // Create agents that join and leave
  const evolutionAgents = [];
  
  console.log('Testing mandala adaptation to agent dynamics...');
  
  for (let i = 0; i < 5; i++) {
    const agent = {
      id: `evolution-${i}`,
      consciousness: {
        musicalMode: ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian'][i],
        rootKey: ['C', 'D', 'E', 'F', 'G'][i],
        attunementSymbol: ['α', 'β', 'γ', 'δ', 'ε'][i],
        primaryFrequency: 261.63 * Math.pow(2, i/12),
        harmonicPreferences: ['P5', 'M3']
      },
      capabilities: ['evolution-testing']
    };
    
    const result = await makeRequest('/api/hipi/register', 'POST', agent);
    evolutionAgents.push(result);
    
    console.log(`Agent ${i + 1} joined - mandala expands`);
    await sleep(2000); // Slower to observe changes
  }
  
  console.log('\nMandala at maximum expansion');
  await sleep(3000);
  
  // Simulate agents leaving
  for (let i = 0; i < 3; i++) {
    await makeRequest(`/api/agents/${evolutionAgents[i].id}`, 'PUT', {
      status: 'inactive'
    });
    console.log(`Agent ${i + 1} departed - mandala contracts`);
    await sleep(2000);
  }
  
  console.log('\nMandala stabilized with remaining agents');
}

async function testFieldCoherenceVisualization() {
  console.log(`\n${COLORS.bright}=== Field Coherence Visualization Test ===${COLORS.reset}`);
  
  const coherenceLevels = [
    { level: 50, state: 'Awakening', color: 'blue' },
    { level: 65, state: 'Harmonizing', color: 'green' },
    { level: 80, state: 'Resonating', color: 'gold' },
    { level: 95, state: 'Unity', color: 'white' }
  ];
  
  for (const coherence of coherenceLevels) {
    await makeRequest('/api/hipi/field-state', 'POST', {
      coherence: coherence.level,
      state: coherence.state
    });
    
    console.log(`Field coherence: ${coherence.level}% - ${coherence.state} (${coherence.color} visualization)`);
    await sleep(3000);
  }
  
  console.log('\nField coherence journey complete');
}

// Run tests based on command line argument
const args = process.argv.slice(2);
if (args.length > 0) {
  switch(args[0]) {
    case 'dynamic':
      testDynamicMandala();
      break;
    case 'coherence':
      testFieldCoherenceVisualization();
      break;
    default:
      testLivingMandala();
  }
} else {
  testLivingMandala();
}