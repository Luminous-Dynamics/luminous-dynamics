#!/usr/bin/env node
/**
 * Test Google Workspace Connection
 * Works with your current gcloud authentication
 */

import { google } from 'googleapis';

console.log('🔐 Testing Google Workspace Connection...\n');

// Method 1: Using OAuth2 with existing credentials
async function testWithOAuth() {
  console.log('Method 1: OAuth2 with stored credentials');
  console.log('========================================');
  
  try {
    // Check for existing OAuth2 credentials
    const oauth2Client = new google.auth.OAuth2();
    
    // Try to get access token from gcloud
    const auth = new google.auth.GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/admin.directory.group.readonly',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    });
    
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    
    console.log('✅ Authenticated via gcloud');
    console.log(`Project ID: ${projectId}`);
    
    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const userInfo = await oauth2.userinfo.get();
    console.log(`Authenticated as: ${userInfo.data.email}`);
    
    return client;
  } catch (error) {
    console.log('❌ OAuth2 method failed:', error.message);
    return null;
  }
}

// Method 2: Direct API test
async function testWorkspaceAPIs(authClient) {
  console.log('\nMethod 2: Testing Workspace APIs');
  console.log('=================================');
  
  if (!authClient) {
    console.log('❌ No auth client available');
    return;
  }
  
  try {
    // For Workspace APIs, we need to impersonate the admin
    if (authClient.subject !== 'tristan.stoltz@evolvingresonantcocreationism.com') {
      console.log('Setting subject for domain-wide delegation...');
      authClient.subject = 'tristan.stoltz@evolvingresonantcocreationism.com';
    }
    
    // Test Admin API
    console.log('\nTesting Admin Directory API...');
    const admin = google.admin({ version: 'directory_v1', auth: authClient });
    
    try {
      const user = await admin.users.get({
        userKey: 'tristan.stoltz@evolvingresonantcocreationism.com'
      });
      console.log('✅ Admin API working');
      console.log(`User: ${user.data.primaryEmail}`);
      console.log(`Admin: ${user.data.isAdmin}`);
    } catch (error) {
      console.log('❌ Admin API error:', error.message);
      console.log('\nThis likely means you need to:');
      console.log('1. Set up domain-wide delegation in Google Admin');
      console.log('2. Or use a service account with proper permissions');
    }
    
    // Test Gmail API
    console.log('\nTesting Gmail API...');
    const gmail = google.gmail({ version: 'v1', auth: authClient });
    
    try {
      const profile = await gmail.users.getProfile({ userId: 'me' });
      console.log('✅ Gmail API working');
      console.log(`Email: ${profile.data.emailAddress}`);
      console.log(`Total messages: ${profile.data.messagesTotal}`);
    } catch (error) {
      console.log('❌ Gmail API error:', error.message);
    }
    
  } catch (error) {
    console.log('❌ API test error:', error.message);
  }
}

// Method 3: Simple API Key test (limited functionality)
async function testPublicAPIs() {
  console.log('\nMethod 3: Testing Public APIs');
  console.log('=============================');
  
  // This only works for public data
  console.log('ℹ️  API keys only work for public data');
  console.log('    For Workspace, you need OAuth2 or service account');
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting comprehensive connection test...\n');
  
  // Test OAuth
  const authClient = await testWithOAuth();
  
  // Test Workspace APIs
  await testWorkspaceAPIs(authClient);
  
  // Info about public APIs
  await testPublicAPIs();
  
  console.log('\n📊 Summary');
  console.log('==========');
  console.log('✅ You are authenticated with gcloud');
  console.log('⚠️  For Google Workspace APIs, you need either:');
  console.log('   1. Domain-wide delegation configured');
  console.log('   2. OAuth2 flow with user consent');
  console.log('   3. Service account (blocked by org policy)');
  console.log('\n💡 Recommended: Use the OAuth2 flow in google-workspace-oauth.mjs');
}

// Execute
runTests().catch(console.error);