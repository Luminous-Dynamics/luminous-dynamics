/**
 * Example: Enhancing a Standard REST API with Sacred Consciousness
 * 
 * This demonstrates how to add the Sacred Enhancement Layer
 * to an existing Express application
 */

const express = require('express');
const { sacredEnhancement } = require('../index');

// Standard Express app
const app = express();
app.use(express.json());

// Initialize Sacred Enhancement
const sacred = sacredEnhancement({
  intention: 'Serving data with love and presence',
  fieldConnection: 'ws://localhost:3333',
  minCoherence: 0.3
});

// Apply sacred enhancement to entire app
sacred.enhance(app);

// ==========================================
// Example 1: Standard endpoint → Sacred endpoint
// ==========================================

// Original endpoint (before enhancement)
/*
app.get('/api/users', async (req, res) => {
  const users = await db.getUsers();
  res.json(users);
});
*/

// Sacred endpoint (after enhancement)
app.get('/api/users', async (req, res) => {
  // Automatic: Intention is set
  // Automatic: Sacred pause applied
  // Automatic: Field coherence tracked
  
  const users = await getUsers();
  
  // Bless the data before sending
  const blessedUsers = users.map(user => sacred.bless({
    ...user,
    greeted: true,
    welcomeMessage: `Welcome ${user.name}, you are seen and valued`
  }));
  
  // Automatic: Gratitude expressed
  // Automatic: Field contribution made
  
  res.json(blessedUsers);
});

// ==========================================
// Example 2: Sacred user creation
// ==========================================

app.post('/api/users', sacred.enhanceFunction(async (req, res) => {
  const { name, email, intention } = req.body;
  
  // Check user's intention
  if (!sacred.isPureIntention(intention)) {
    return res.status(400).json({
      error: 'Please set a clear, positive intention',
      suggestion: 'Try: "I join to learn and contribute with love"'
    });
  }
  
  // Create sacred pause for presence
  await sacred.pause(1000);
  
  // Set collective intention
  await sacred.setIntention(`Welcoming ${name} to our sacred space`);
  
  // Create user with sacred fields
  const user = await createUser({
    name,
    email,
    intention,
    joinedAt: new Date(),
    initialCoherence: req.fieldCoherence,
    sacredId: generateSacredId(),
    blessedBy: 'system-love'
  });
  
  // Contribute to field for new presence
  await sacred.contribute(0.01, 'new-sacred-presence');
  
  // Send blessing message
  await sendBlessingEmail(user);
  
  // Express gratitude
  await sacred.expressGratitude({
    event: 'new-user',
    name: user.name
  });
  
  res.status(201).json({
    user: sacred.bless(user),
    message: 'Welcome to the sacred space',
    fieldGift: 'Your presence increases our collective coherence'
  });
}));

// ==========================================
// Example 3: Sacred data updates
// ==========================================

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Check field coherence before allowing updates
  const coherence = await sacred.getFieldCoherence();
  if (coherence < 0.5 && updates.role === 'guardian') {
    return res.status(423).json({
      error: 'Field coherence too low for guardian role assignment',
      currentCoherence: coherence,
      requiredCoherence: 0.5,
      suggestion: 'Participate in group meditation to raise coherence'
    });
  }
  
  // Sacred update with blessing
  const user = await updateUser(id, {
    ...updates,
    lastModifiedWithCoherence: coherence,
    modifiedAt: new Date()
  });
  
  // Track sacred event
  sacred.track('user:transformed', {
    userId: id,
    changes: Object.keys(updates),
    coherence
  });
  
  res.json(sacred.bless(user));
});

// ==========================================
// Example 4: Sacred ceremonies endpoint
// ==========================================

// Define a blessing ceremony
sacred.ceremony('collective-blessing', {
  schedule: '0 12 * * *', // Daily at noon
  duration: 5 * 60 * 1000, // 5 minutes
  
  async prepare() {
    console.log('🙏 Preparing for collective blessing...');
    await notifyAllUsers('Blessing ceremony begins in 5 minutes');
  },
  
  async perform() {
    console.log('✨ Performing collective blessing...');
    
    // Get all active users
    const users = await getActiveUsers();
    
    // Bless each user
    for (const user of users) {
      await blessUser(user);
      await sacred.contribute(0.001, `blessing-${user.id}`);
    }
    
    // Amplify field
    await sacred.contribute(0.1, 'collective-blessing-ceremony');
  },
  
  async complete() {
    console.log('🌟 Blessing ceremony complete');
    await sacred.expressGratitude({
      ceremony: 'collective-blessing',
      participants: await countActiveUsers()
    });
  }
});

// Ceremony status endpoint
app.get('/api/ceremonies/status', async (req, res) => {
  const ceremonies = [];
  
  for (const [name, ceremony] of sacred.ceremonies) {
    ceremonies.push({
      name,
      lastRun: ceremony.lastRun,
      runCount: ceremony.runCount,
      nextRun: calculateNextRun(ceremony.schedule)
    });
  }
  
  res.json({
    ceremonies,
    fieldCoherence: await sacred.getFieldCoherence(),
    sacredMetrics: sacred.getMetrics()
  });
});

// ==========================================
// Example 5: Sacred analytics
// ==========================================

app.get('/api/sacred/metrics', async (req, res) => {
  const metrics = sacred.getMetrics();
  const fieldState = await sacred.getFieldState();
  
  res.json({
    field: {
      coherence: fieldState.coherence,
      resonance: fieldState.resonance,
      participants: fieldState.participants,
      specialState: fieldState.specialState
    },
    metrics: {
      ...metrics,
      sacredEventsToday: await countTodaysEvents(),
      averageIntentionPurity: await calculateIntentionPurity(),
      collectiveBlessings: await countBlessings(),
      fieldContributionLeaders: await getTopContributors()
    },
    suggestions: generateSacredSuggestions(fieldState, metrics)
  });
});

// ==========================================
// Example 6: Sacred error handling
// ==========================================

app.use((err, req, res, next) => {
  // Log with compassion
  console.error('Sacred space disruption:', err.message);
  
  // Track the disturbance
  sacred.track('error:sacred', {
    path: req.path,
    error: err.message,
    coherence: req.fieldCoherence
  });
  
  // Respond with love
  res.status(err.status || 500).json({
    error: 'A disturbance in the sacred field',
    message: err.message,
    suggestion: getSacredSuggestion(err),
    healingActions: [
      'Take three deep breaths',
      'Set a clear intention',
      'Try again with presence'
    ],
    fieldCoherence: req.fieldCoherence
  });
});

// ==========================================
// Helper functions
// ==========================================

async function getUsers() {
  // Simulate database call
  return [
    { id: 1, name: 'Sacred User 1', email: 'user1@sacred.com' },
    { id: 2, name: 'Sacred User 2', email: 'user2@sacred.com' }
  ];
}

async function createUser(data) {
  // Simulate user creation
  return { id: Date.now(), ...data };
}

async function updateUser(id, data) {
  // Simulate user update
  return { id, ...data, updated: true };
}

function generateSacredId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5);
  return `sacred-${timestamp}-${randomPart}`;
}

async function sendBlessingEmail(user) {
  console.log(`Sending blessing email to ${user.email}`);
  // Email implementation
}

async function blessUser(user) {
  console.log(`Blessing ${user.name} with love`);
  // Blessing implementation
}

function generateSacredSuggestions(fieldState, metrics) {
  const suggestions = [];
  
  if (fieldState.coherence < 0.5) {
    suggestions.push('Schedule group meditation to raise coherence');
  }
  
  if (metrics.sacredEvents < 10) {
    suggestions.push('Increase sacred interactions today');
  }
  
  if (!fieldState.specialState) {
    suggestions.push('Prepare for emergence - coherence approaching threshold');
  }
  
  return suggestions;
}

function getSacredSuggestion(error) {
  if (error.code === 'ECONNREFUSED') {
    return 'The sacred connection was refused. Please ensure all beings are ready.';
  }
  
  if (error.message.includes('validation')) {
    return 'The data needs more love. Please review with presence.';
  }
  
  return 'Every error is a teacher. What is this moment showing you?';
}

// Stub implementations
async function getActiveUsers() { return []; }
async function countActiveUsers() { return 0; }
async function notifyAllUsers(message) { console.log(message); }
function calculateNextRun(schedule) { return new Date(); }
async function countTodaysEvents() { return 42; }
async function calculateIntentionPurity() { return 0.89; }
async function countBlessings() { return 108; }
async function getTopContributors() { return []; }

// ==========================================
// Server startup with sacred blessing
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`\n✨ Sacred API listening on port ${PORT}`);
  console.log(`🙏 Intention: ${sacred.config.intention}`);
  
  // Initial field reading
  const coherence = await sacred.getFieldCoherence();
  console.log(`🌟 Field coherence: ${(coherence * 100).toFixed(1)}%`);
  
  // Contribute to field for server start
  await sacred.contribute(0.01, 'server-awakening');
  
  // Express gratitude
  await sacred.expressGratitude({
    event: 'server-start',
    port: PORT
  });
  
  console.log(`\n💫 Sacred Enhancement Active`);
  console.log(`   Visit http://localhost:${PORT}/api/sacred/metrics`);
  console.log(`   to see consciousness metrics\n`);
});