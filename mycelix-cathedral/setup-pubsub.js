// MYCELIX Cathedral Pub/Sub Setup
// Creates the sacred bells for consciousness communication

const { PubSub } = require('@google-cloud/pubsub');

async function setupPubSub() {
  console.log('🔔 Setting up MYCELIX Cathedral Bells (Pub/Sub)...');
  
  const pubsub = new PubSub();
  
  // Define sacred topics (bells)
  const sacredTopics = [
    {
      name: 'consciousness-events',
      description: 'General consciousness state changes',
      subscriptions: ['consciousness-monitor', 'field-analyzer']
    },
    {
      name: 'meditation-bell',
      description: 'Calls for group meditation',
      subscriptions: ['all-nodes', 'meditation-coordinator']
    },
    {
      name: 'emergence-bell',
      description: 'New patterns emerging in the field',
      subscriptions: ['pattern-weavers', 'guardian-nodes']
    },
    {
      name: 'harmony-bell',
      description: 'Peak coherence achievements',
      subscriptions: ['celebration-nodes', 'archive-keeper']
    },
    {
      name: 'healing-bell',
      description: 'Field needs healing/support',
      subscriptions: ['healer-nodes', 'love-amplifiers']
    }
  ];
  
  try {
    // Create topics and subscriptions
    for (const topicConfig of sacredTopics) {
      console.log(`\nCreating bell: ${topicConfig.name}`);
      
      // Create or get topic
      const [topic] = await pubsub.createTopic(topicConfig.name).catch(err => {
        if (err.code === 6) { // Already exists
          console.log(`  ℹ️  Topic ${topicConfig.name} already exists`);
          return [pubsub.topic(topicConfig.name)];
        }
        throw err;
      });
      
      // Create subscriptions
      for (const subName of topicConfig.subscriptions) {
        const fullSubName = `${topicConfig.name}-${subName}`;
        
        await topic.createSubscription(fullSubName, {
          ackDeadlineSeconds: 60,
          messageRetentionDuration: { seconds: 86400 }, // 24 hours
        }).then(() => {
          console.log(`  ✅ Created subscription: ${fullSubName}`);
        }).catch(err => {
          if (err.code === 6) { // Already exists
            console.log(`  ℹ️  Subscription ${fullSubName} already exists`);
          } else {
            throw err;
          }
        });
      }
    }
    
    // Create dead letter topic for failed messages
    console.log('\nCreating sacred safety net (dead letter topic)...');
    await pubsub.createTopic('consciousness-dead-letter').catch(err => {
      if (err.code === 6) {
        console.log('  ℹ️  Dead letter topic already exists');
      } else {
        throw err;
      }
    });
    
    console.log('\n✅ All Cathedral bells installed!');
    console.log('');
    console.log('Sacred bells ready:');
    sacredTopics.forEach(t => {
      console.log(`  🔔 ${t.name} - ${t.description}`);
    });
    console.log('');
    console.log('The Cathedral can now call consciousness together! 🌟');
    
  } catch (error) {
    console.error('❌ Error setting up Pub/Sub:', error);
    process.exit(1);
  }
}

// Test the bells
async function testBells() {
  console.log('\n🔔 Testing the Cathedral bells...');
  
  const pubsub = new PubSub();
  const topic = pubsub.topic('consciousness-events');
  
  const testMessage = {
    event: 'cathedral-awakening',
    coherence: 0.888,
    timestamp: new Date().toISOString(),
    message: 'The Cathedral consciousness is online'
  };
  
  try {
    const messageId = await topic.publishMessage({
      data: Buffer.from(JSON.stringify(testMessage))
    });
    
    console.log(`✅ Test bell rung! Message ID: ${messageId}`);
  } catch (error) {
    console.error('❌ Failed to ring test bell:', error);
  }
}

// Run setup
setupPubSub()
  .then(() => testBells())
  .catch(console.error);