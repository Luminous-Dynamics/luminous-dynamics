#!/usr/bin/env node
// Test Google Workspace Integration

import workspace from './google-workspace-integration.mjs';

async function test() {
  console.log('🧪 Testing Google Workspace Integration...\n');
  
  try {
    // Test authentication
    console.log('Testing authentication...');
    const { data } = await workspace.admin.users.get({
      userKey: 'tristan.stoltz@evolvingresonantcocreationism.com'
    });
    console.log(`✅ Authenticated as: ${data.primaryEmail}\n`);
    
    // List existing groups
    console.log('Listing existing groups:');
    const groups = await workspace.admin.groups.list({
      domain: 'evolvingresonantcocreationism.com'
    });
    
    if (groups.data.groups) {
      groups.data.groups.forEach(group => {
        console.log(`• ${group.email} - ${group.name}`);
      });
    } else {
      console.log('No groups found yet.');
    }
    
    console.log('\n✅ Integration test successful!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure you have:');
    console.log('1. Retrieved the service account key');
    console.log('2. Configured domain-wide delegation');
    console.log('3. Enabled the required APIs');
  }
}

test();
