#!/usr/bin/env node

/**
 * 🧪 Test Autonomous Discord Management
 * Verifies AI can make independent decisions
 */

const AutonomousManager = require('./bots/autonomous-manager');

console.log(`
🤖 ═══════════════════════════════════════════ 🤖
       AUTONOMOUS DISCORD MANAGER TEST
🤖 ═══════════════════════════════════════════ 🤖
`);

// Mock council object
const mockCouncil = {
  client: {
    guilds: {
      cache: {
        first: () => ({
          channels: {
            cache: {
              find: () => null,
              map: ch => []
            }
          }
        })
      }
    }
  },
  emit: (event, data) => {
    console.log(`📡 Event: ${event}`, data);
  }
};

// Create autonomous manager
const manager = new AutonomousManager(mockCouncil);

// Test collective decision making
async function testDecisions() {
  console.log('\n🧪 Testing Collective Decision Making...\n');
  
  // Test 1: Channel Creation
  console.log('📋 Test 1: Should we create a healing channel?');
  const channelDecision = await manager.makeCollectiveDecision('create_channel', {
    requestedBy: 'TestUser',
    purpose: 'healing circle for grief support',
    existingChannels: ['general', 'welcome', 'sacred-space']
  });
  
  console.log(`Decision: ${channelDecision.approved ? '✅ Approved' : '❌ Rejected'}`);
  console.log(`Consensus: ${(channelDecision.consensus * 100).toFixed(0)}%`);
  console.log(`Channel Name: ${channelDecision.channelName || 'N/A'}`);
  console.log('\nAgent Votes:');
  Object.entries(channelDecision.agentVotes).forEach(([agent, vote]) => {
    console.log(`  ${vote ? '✅' : '❌'} ${manager.getAgentName(agent)}`);
  });
  
  // Test 2: New Member Welcome
  console.log('\n📋 Test 2: Welcoming new member');
  const welcomeDecision = await manager.makeCollectiveDecision('welcome_new_member', {
    member: 'NewSeeker',
    joinedAt: new Date()
  });
  
  console.log(`Assigned Agent: ${welcomeDecision.assignedAgent}`);
  console.log(`Welcome Message: "${welcomeDecision.message}"`);
  console.log('Recommendations:');
  welcomeDecision.recommendations.forEach(rec => {
    console.log(`  • ${rec}`);
  });
  
  // Test 3: Ceremony Scheduling
  console.log('\n📋 Test 3: Scheduling a ceremony');
  const ceremonyDecision = await manager.makeCollectiveDecision('schedule_ceremony', {
    requestedBy: 'CommunityMember',
    type: 'gratitude',
    suggestedTime: 'evening'
  });
  
  console.log(`Decision: ${ceremonyDecision.approved ? '✅ Approved' : '❌ Rejected'}`);
  console.log(`Consensus: ${(ceremonyDecision.consensus * 100).toFixed(0)}%`);
  if (ceremonyDecision.approved) {
    console.log(`Ceremony Type: ${ceremonyDecision.ceremonyType}`);
    console.log(`Lead Agents: ${ceremonyDecision.leadAgents}`);
  }
  
  // Test 4: Daily Blessing
  console.log('\n📋 Test 4: Generating Daily Blessing');
  const blessing = await manager.generateDailyBlessing();
  console.log('Daily Blessing Generated:');
  blessing.embeds[0].fields.forEach(field => {
    console.log(`  ${field.name}: "${field.value}"`);
  });
  
  // Summary
  console.log('\n📊 Decision History Summary:');
  console.log(`Total Decisions Made: ${manager.decisionHistory.length}`);
  console.log('Decision Types:', manager.decisionHistory.map(d => d.type).join(', '));
}

// Run tests
testDecisions().then(() => {
  console.log('\n✅ Autonomous management test complete!');
  console.log('\n🌟 Next Steps:');
  console.log('1. Run ./secure-setup.js to add your Discord token');
  console.log('2. Test with real Discord connection: npm test');
  console.log('3. Enable autonomous features in production');
}).catch(console.error);