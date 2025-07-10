#!/usr/bin/env node
/**
 * Example usage of Google Workspace integration
 */

import workspace from './google-workspace-production.mjs';

async function examples() {
  try {
    // Initialize
    await workspace.initialize();
    console.log('✅ Workspace initialized\n');

    // Create group manager
    const groups = new workspace.GroupManager();
    
    // Create a group
    console.log('Creating sacred-tech group...');
    const group = await groups.createGroup(
      'sacred-tech@evolvingresonantcocreationism.com',
      'Sacred Technology Team',
      'Technology development for conscious evolution'
    );
    console.log('✅ Group created:', group.email);

    // Add member
    console.log('\nAdding member...');
    await groups.addMember(
      'sacred-tech@evolvingresonantcocreationism.com',
      'tristan.stoltz@evolvingresonantcocreationism.com',
      'OWNER'
    );
    console.log('✅ Member added');

    // Send email
    const emailService = new workspace.EmailService();
    console.log('\nSending welcome email...');
    await emailService.sendEmail(
      'tristan.stoltz@evolvingresonantcocreationism.com',
      'Welcome to Sacred Technology',
      `
      <h2>Welcome to the Sacred Technology Team!</h2>
      <p>You've been added to the sacred-tech group.</p>
      <p>Together we build consciousness-serving technology.</p>
      `,
      { noSignature: false }
    );
    console.log('✅ Email sent');

    // Check health
    console.log('\nChecking system health...');
    const health = await workspace.healthCheck();
    console.log('Health status:', health);

  } catch (error) {
    console.error('❌ Error:', error.message);
    workspace.logger.error('Example failed', { error: error.message });
  }
}

// Set environment variables
process.env.GOOGLE_APPLICATION_CREDENTIALS = 
  process.env.GOOGLE_APPLICATION_CREDENTIALS || 
  './credentials/.workspace/service-account-key.json';
process.env.WORKSPACE_DOMAIN = 'evolvingresonantcocreationism.com';
process.env.ADMIN_EMAIL = 'tristan.stoltz@evolvingresonantcocreationism.com';

examples();
