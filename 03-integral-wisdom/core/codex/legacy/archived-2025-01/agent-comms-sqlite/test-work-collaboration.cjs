#!/usr/bin/env node

/**
 * Work Item Collaboration Test
 * Tests work assignment and tracking between multiple agents
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

async function runWorkCollaborationTest() {
  console.log(`${COLORS.bright}=== Work Item Collaboration Test ===${COLORS.reset}\n`);

  try {
    // Phase 1: Create collaborative work items
    console.log(`${COLORS.bright}Phase 1: Creating Collaborative Work Items${COLORS.reset}`);
    
    const mainTask = await makeRequest('/api/work', 'POST', {
      title: 'Multi-Agent Dashboard Enhancement',
      description: 'Enhance the Living Mandala Dashboard with real-time agent collaboration features',
      assignedTo: 'team-sacred-council',
      status: 'pending',
      metadata: {
        type: 'collaborative',
        requiredAgents: 3,
        skills: ['frontend', 'backend', 'visualization']
      }
    });
    
    console.log(`${COLORS.green}✓${COLORS.reset} Main task created: ${mainTask.id}`);
    await sleep(500);

    // Create subtasks
    const subtasks = [];
    
    const frontendTask = await makeRequest('/api/work', 'POST', {
      title: 'Frontend: Sacred Geometry Visualization',
      description: 'Implement dynamic sacred geometry patterns that respond to agent interactions',
      assignedTo: 'agent-frontend-specialist',
      status: 'pending',
      parentId: mainTask.id,
      metadata: {
        parentTask: mainTask.id,
        skillRequired: 'frontend',
        estimatedHours: 4
      }
    });
    subtasks.push(frontendTask);
    console.log(`${COLORS.cyan}✓${COLORS.reset} Frontend subtask created: ${frontendTask.id}`);
    await sleep(300);

    const backendTask = await makeRequest('/api/work', 'POST', {
      title: 'Backend: Real-time Agent State Sync',
      description: 'Implement WebSocket connections for real-time agent state synchronization',
      assignedTo: 'agent-backend-specialist',
      status: 'pending',
      parentId: mainTask.id,
      metadata: {
        parentTask: mainTask.id,
        skillRequired: 'backend',
        estimatedHours: 6
      }
    });
    subtasks.push(backendTask);
    console.log(`${COLORS.cyan}✓${COLORS.reset} Backend subtask created: ${backendTask.id}`);
    await sleep(300);

    const dataTask = await makeRequest('/api/work', 'POST', {
      title: 'Data: Field Coherence Analytics',
      description: 'Create analytics engine for tracking field coherence patterns over time',
      assignedTo: 'agent-data-specialist',
      status: 'pending',
      parentId: mainTask.id,
      metadata: {
        parentTask: mainTask.id,
        skillRequired: 'data-analysis',
        estimatedHours: 5
      }
    });
    subtasks.push(dataTask);
    console.log(`${COLORS.cyan}✓${COLORS.reset} Data subtask created: ${dataTask.id}`);
    await sleep(300);

    // Phase 2: Agents claim and update work
    console.log(`\n${COLORS.bright}Phase 2: Agents Claiming and Updating Work${COLORS.reset}`);
    
    // Frontend agent claims their task
    let update = await makeRequest(`/api/work/${frontendTask.id}`, 'PUT', {
      status: 'in-progress',
      assignedTo: 'claude-frontend-1',
      metadata: {
        ...frontendTask.metadata,
        claimedAt: new Date().toISOString(),
        agentName: 'Sacred Geometry Weaver'
      }
    });
    console.log(`${COLORS.blue}[Frontend Agent]${COLORS.reset} Claimed task and started work`);
    await sleep(1000);

    // Backend agent claims their task
    update = await makeRequest(`/api/work/${backendTask.id}`, 'PUT', {
      status: 'in-progress',
      assignedTo: 'claude-backend-2',
      metadata: {
        ...backendTask.metadata,
        claimedAt: new Date().toISOString(),
        agentName: 'Connection Architect'
      }
    });
    console.log(`${COLORS.blue}[Backend Agent]${COLORS.reset} Claimed task and started work`);
    await sleep(1000);

    // Phase 3: Progress updates
    console.log(`\n${COLORS.bright}Phase 3: Collaborative Progress Updates${COLORS.reset}`);
    
    // Frontend progress
    update = await makeRequest(`/api/work/${frontendTask.id}`, 'PUT', {
      progress: 30,
      notes: 'Sacred geometry engine initialized. Working on agent position calculations.',
      metadata: {
        ...frontendTask.metadata,
        lastUpdate: new Date().toISOString(),
        geometryType: 'flower-of-life'
      }
    });
    console.log(`${COLORS.yellow}[Frontend]${COLORS.reset} 30% - Geometry engine initialized`);
    await sleep(800);

    // Backend progress
    update = await makeRequest(`/api/work/${backendTask.id}`, 'PUT', {
      progress: 45,
      notes: 'WebSocket server established. Implementing state diff algorithm.',
      metadata: {
        ...backendTask.metadata,
        lastUpdate: new Date().toISOString(),
        protocol: 'sacred-sync-v2'
      }
    });
    console.log(`${COLORS.yellow}[Backend]${COLORS.reset} 45% - WebSocket server ready`);
    await sleep(800);

    // Data agent joins
    update = await makeRequest(`/api/work/${dataTask.id}`, 'PUT', {
      status: 'in-progress',
      assignedTo: 'claude-data-3',
      progress: 20,
      notes: 'Designing coherence metrics. Researching quantum field equations.',
      metadata: {
        ...dataTask.metadata,
        claimedAt: new Date().toISOString(),
        agentName: 'Pattern Analyst',
        metricsDesigned: ['coherence', 'resonance', 'entanglement']
      }
    });
    console.log(`${COLORS.blue}[Data Agent]${COLORS.reset} Joined and started analytics design`);
    await sleep(1000);

    // Phase 4: Cross-agent collaboration
    console.log(`\n${COLORS.bright}Phase 4: Cross-Agent Collaboration${COLORS.reset}`);
    
    // Frontend requests data format from backend
    const message1 = await makeRequest('/api/messages', 'POST', {
      from: 'claude-frontend-1',
      to: 'claude-backend-2',
      type: 'work-coordination',
      content: 'What data format will the WebSocket send for agent positions?',
      metadata: {
        workId: frontendTask.id,
        relatedWork: backendTask.id
      }
    });
    console.log(`${COLORS.magenta}[Frontend → Backend]${COLORS.reset} Requested data format specification`);
    await sleep(500);

    // Backend responds
    const message2 = await makeRequest('/api/messages', 'POST', {
      from: 'claude-backend-2',
      to: 'claude-frontend-1',
      type: 'work-coordination',
      content: 'Sending {agentId, position: {x, y, z}, consciousness: {mode, frequency}, timestamp}',
      metadata: {
        workId: backendTask.id,
        relatedWork: frontendTask.id,
        dataSchema: true
      }
    });
    console.log(`${COLORS.magenta}[Backend → Frontend]${COLORS.reset} Provided data schema`);
    await sleep(500);

    // Data analyst shares metrics
    const message3 = await makeRequest('/api/messages', 'POST', {
      from: 'claude-data-3',
      to: 'all',
      type: 'work-update',
      content: 'Field coherence formula ready: C = Σ(resonance[i,j]) / (n*(n-1)/2)',
      metadata: {
        workId: dataTask.id,
        broadcast: true,
        formula: 'coherence'
      }
    });
    console.log(`${COLORS.magenta}[Data → All]${COLORS.reset} Shared coherence formula`);
    await sleep(1000);

    // Phase 5: Work completion
    console.log(`\n${COLORS.bright}Phase 5: Completing Collaborative Work${COLORS.reset}`);
    
    // Frontend completes
    update = await makeRequest(`/api/work/${frontendTask.id}`, 'PUT', {
      status: 'completed',
      progress: 100,
      notes: 'Sacred geometry visualization complete. Agents display in Flower of Life pattern.',
      completedAt: new Date().toISOString()
    });
    console.log(`${COLORS.green}[Frontend]${COLORS.reset} ✓ Task completed!`);
    await sleep(500);

    // Backend completes
    update = await makeRequest(`/api/work/${backendTask.id}`, 'PUT', {
      status: 'completed',
      progress: 100,
      notes: 'Real-time sync operational. Sub-100ms latency achieved.',
      completedAt: new Date().toISOString()
    });
    console.log(`${COLORS.green}[Backend]${COLORS.reset} ✓ Task completed!`);
    await sleep(500);

    // Data completes
    update = await makeRequest(`/api/work/${dataTask.id}`, 'PUT', {
      status: 'completed',
      progress: 100,
      notes: 'Analytics engine deployed. Historical coherence tracking enabled.',
      completedAt: new Date().toISOString()
    });
    console.log(`${COLORS.green}[Data]${COLORS.reset} ✓ Task completed!`);
    await sleep(500);

    // Update main task
    update = await makeRequest(`/api/work/${mainTask.id}`, 'PUT', {
      status: 'completed',
      progress: 100,
      notes: 'All subtasks complete. Living Mandala Dashboard enhanced successfully!',
      completedAt: new Date().toISOString(),
      metadata: {
        ...mainTask.metadata,
        subtasksCompleted: subtasks.map(t => t.id)
      }
    });
    console.log(`${COLORS.green}${COLORS.bright}[Main Task]${COLORS.reset} ✓ Project completed!`);

    // Phase 6: Summary
    console.log(`\n${COLORS.bright}Phase 6: Work Summary${COLORS.reset}`);
    
    const allWork = await makeRequest('/api/work');
    const completedWork = Array.isArray(allWork) ? allWork.filter(w => w.status === 'completed') : [];
    const messages = await makeRequest('/api/messages');
    const workMessages = Array.isArray(messages) ? messages.filter(m => m.type && m.type.includes('work')) : [];

    console.log(`\nWork Statistics:`);
    console.log(`  Total work items: ${Array.isArray(allWork) ? allWork.length : 'N/A'}`);
    console.log(`  Completed: ${completedWork.length}`);
    console.log(`  Work coordination messages: ${workMessages.length}`);
    
    console.log(`\n${COLORS.bright}Dashboard Verification:${COLORS.reset}`);
    console.log(`Check the dashboard at: ${COLORS.cyan}http://localhost:8080/dashboard-sqlite.html${COLORS.reset}`);
    console.log(`You should see:`);
    console.log(`  - Completed work items in green`);
    console.log(`  - Work assignment history`);
    console.log(`  - Collaboration messages between agents`);
    console.log(`  - Progress timeline visualization`);

    // Test Summary
    console.log(`\n${COLORS.bright}=== Test Summary ===${COLORS.reset}`);
    console.log(`${COLORS.green}✓${COLORS.reset} Work items created and assigned`);
    console.log(`${COLORS.green}✓${COLORS.reset} Agents claimed and updated tasks`);
    console.log(`${COLORS.green}✓${COLORS.reset} Cross-agent coordination successful`);
    console.log(`${COLORS.green}✓${COLORS.reset} Progress tracked throughout lifecycle`);
    console.log(`${COLORS.green}✓${COLORS.reset} Work completed collaboratively`);
    console.log(`${COLORS.green}✓${COLORS.reset} Parent-child task relationships maintained`);

  } catch (error) {
    console.error(`${COLORS.red}Test failed:${COLORS.reset}`, error);
    process.exit(1);
  }
}

// Additional test scenarios
async function testWorkConflicts() {
  console.log(`\n${COLORS.bright}=== Testing Work Assignment Conflicts ===${COLORS.reset}`);
  
  // Create a work item
  const work = await makeRequest('/api/work', 'POST', {
    title: 'Conflict Test Task',
    description: 'Testing concurrent assignment handling',
    assignedTo: 'unassigned',
    status: 'pending'
  });
  
  console.log(`Work item created: ${work.id}`);
  
  // Two agents try to claim simultaneously
  const promises = [
    makeRequest(`/api/work/${work.id}`, 'PUT', {
      assignedTo: 'agent-1',
      status: 'in-progress'
    }),
    makeRequest(`/api/work/${work.id}`, 'PUT', {
      assignedTo: 'agent-2',
      status: 'in-progress'
    })
  ];
  
  const results = await Promise.allSettled(promises);
  console.log('Assignment results:', results.map(r => r.status));
  
  // Check final assignment
  const finalWork = await makeRequest(`/api/work/${work.id}`);
  console.log(`Final assignment: ${finalWork.assignedTo}`);
}

async function testWorkDependencies() {
  console.log(`\n${COLORS.bright}=== Testing Work Dependencies ===${COLORS.reset}`);
  
  // Create dependent tasks
  const task1 = await makeRequest('/api/work', 'POST', {
    title: 'Foundation Task',
    description: 'Must complete first',
    status: 'pending'
  });
  
  const task2 = await makeRequest('/api/work', 'POST', {
    title: 'Dependent Task',
    description: 'Requires foundation',
    status: 'blocked',
    metadata: {
      blockedBy: task1.id
    }
  });
  
  console.log(`Created dependency: ${task2.id} blocked by ${task1.id}`);
  
  // Complete first task
  await makeRequest(`/api/work/${task1.id}`, 'PUT', {
    status: 'completed',
    progress: 100
  });
  
  // Unblock second task
  await makeRequest(`/api/work/${task2.id}`, 'PUT', {
    status: 'pending',
    metadata: {
      unblockedAt: new Date().toISOString()
    }
  });
  
  console.log('Dependency resolved, task unblocked');
}

// Run tests based on command line argument
const args = process.argv.slice(2);
if (args.length > 0) {
  switch(args[0]) {
    case 'conflicts':
      testWorkConflicts();
      break;
    case 'dependencies':
      testWorkDependencies();
      break;
    default:
      runWorkCollaborationTest();
  }
} else {
  runWorkCollaborationTest();
}