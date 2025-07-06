#!/bin/bash
# Integrate Google Workspace with existing service account

echo "🔐 Google Workspace Integration with Existing Service Account"
echo "=========================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Existing configuration
SERVICE_ACCOUNT="sacred-council-sa@mycelix-network.iam.gserviceaccount.com"
PROJECT_ID="mycelix-network"
WORKSPACE_DOMAIN="evolvingresonantcocreationism.com"
ADMIN_EMAIL="tristan.stoltz@evolvingresonantcocreationism.com"

echo -e "${PURPLE}📋 Current Configuration:${NC}"
echo "• Service Account: $SERVICE_ACCOUNT"
echo "• Project ID: $PROJECT_ID"
echo "• Workspace Domain: $WORKSPACE_DOMAIN"
echo "• Admin: $ADMIN_EMAIL"
echo ""

echo -e "${YELLOW}🔧 Setting Up Workspace Integration:${NC}"
echo ""

# Step 1: Retrieve existing service account key
echo -e "${BLUE}Step 1: Retrieve Service Account Key${NC}"
if [ -f "$HOME/.sacred-credentials/gcp-key.json" ]; then
    echo -e "${GREEN}✅ Service account key already retrieved${NC}"
else
    echo "Running credential retrieval..."
    if [ -f "./scripts/retrieve-credentials.sh" ]; then
        ./scripts/retrieve-credentials.sh
    else
        echo -e "${YELLOW}⚠️  Please retrieve credentials manually:${NC}"
        echo "gcloud secrets versions access latest --secret=gcp-service-account-key > ~/.sacred-credentials/gcp-key.json"
    fi
fi

echo -e "\n${BLUE}Step 2: Configure Domain-Wide Delegation${NC}"
echo "You need to grant domain-wide delegation to your service account:"
echo ""
echo "1. Go to: https://admin.google.com"
echo "2. Login as: $ADMIN_EMAIL"
echo "3. Navigate to: Security → Access and data control → API controls"
echo "4. Click: Domain-wide delegation → Add new"
echo "5. Enter:"
echo "   Client ID: (find this in GCP Console for your service account)"
echo "   Scopes:"
echo "     https://www.googleapis.com/auth/admin.directory.group"
echo "     https://www.googleapis.com/auth/admin.directory.user.readonly"
echo "     https://www.googleapis.com/auth/gmail.send"
echo "     https://www.googleapis.com/auth/calendar"
echo "     https://www.googleapis.com/auth/drive"

echo -e "\n${BLUE}Step 3: Enable Required APIs${NC}"
cat > enable-workspace-apis.sh << 'EOF'
#!/bin/bash
# Enable Google Workspace APIs

echo "Enabling Google Workspace APIs..."

# Core Workspace APIs
gcloud services enable admin.googleapis.com \
  gmail.googleapis.com \
  calendar-json.googleapis.com \
  drive.googleapis.com \
  groupssettings.googleapis.com \
  --project=mycelix-network

echo "✅ APIs enabled"
EOF

chmod +x enable-workspace-apis.sh
echo -e "${GREEN}✅ Created enable-workspace-apis.sh${NC}"
echo "Run: ./enable-workspace-apis.sh"

echo -e "\n${BLUE}Step 4: Create Workspace Integration Module${NC}"

# Create the integration module
cat > google-workspace-integration.mjs << 'EOF'
// Google Workspace Integration using existing service account
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// Configuration
const WORKSPACE_DOMAIN = 'evolvingresonantcocreationism.com';
const ADMIN_EMAIL = 'tristan.stoltz@evolvingresonantcocreationism.com';
const SERVICE_ACCOUNT_PATH = join(homedir(), '.sacred-credentials', 'gcp-key.json');

// Load service account
let serviceAccountKey;
try {
  serviceAccountKey = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
} catch (error) {
  console.error('❌ Service account key not found. Run: ./scripts/retrieve-credentials.sh');
  process.exit(1);
}

// Create JWT client with domain-wide delegation
const authClient = new google.auth.JWT({
  email: serviceAccountKey.client_email,
  key: serviceAccountKey.private_key,
  scopes: [
    'https://www.googleapis.com/auth/admin.directory.group',
    'https://www.googleapis.com/auth/admin.directory.user.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar'
  ],
  subject: ADMIN_EMAIL // Impersonate admin for domain-wide access
});

// Initialize services
export const admin = google.admin({ version: 'directory_v1', auth: authClient });
export const gmail = google.gmail({ version: 'v1', auth: authClient });
export const calendar = google.calendar({ version: 'v3', auth: authClient });

// Helper functions
export async function createEmailGroup(email, name, description) {
  try {
    const response = await admin.groups.insert({
      requestBody: {
        email,
        name,
        description
      }
    });
    console.log(`✅ Created group: ${email}`);
    return response.data;
  } catch (error) {
    if (error.code === 409) {
      console.log(`ℹ️  Group already exists: ${email}`);
    } else {
      throw error;
    }
  }
}

export async function addGroupMember(groupEmail, memberEmail, role = 'MEMBER') {
  try {
    const response = await admin.members.insert({
      groupKey: groupEmail,
      requestBody: {
        email: memberEmail,
        role
      }
    });
    console.log(`✅ Added ${memberEmail} to ${groupEmail}`);
    return response.data;
  } catch (error) {
    console.error(`Error adding member: ${error.message}`);
    throw error;
  }
}

export async function sendEmail(to, subject, body, from = ADMIN_EMAIL) {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    body
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
    console.log(`✅ Email sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw error;
  }
}

// Quick setup function
export async function setupWorkspaceGroups() {
  console.log('🚀 Setting up Google Workspace groups...\n');
  
  const groups = [
    {
      email: 'team@evolvingresonantcocreationism.com',
      name: 'Sacred Team',
      description: 'Core team coordination for ERC'
    },
    {
      email: 'sacred-tech@evolvingresonantcocreationism.com',
      name: 'Sacred Technology',
      description: 'Technology development team'
    },
    {
      email: 'codex@evolvingresonantcocreationism.com',
      name: 'Codex Practitioners',
      description: 'Relational Harmonics Codex practitioners'
    },
    {
      email: 'research@evolvingresonantcocreationism.com',
      name: 'Research Team',
      description: 'Research and documentation team'
    },
    {
      email: 'community@evolvingresonantcocreationism.com',
      name: 'Community Support',
      description: 'Community support and engagement'
    }
  ];

  for (const group of groups) {
    await createEmailGroup(group.email, group.name, group.description);
  }
  
  console.log('\n✨ Workspace setup complete!');
}

// Export everything
export default {
  authClient,
  admin,
  gmail,
  calendar,
  createEmailGroup,
  addGroupMember,
  sendEmail,
  setupWorkspaceGroups
};
EOF

echo -e "${GREEN}✅ Created google-workspace-integration.mjs${NC}"

echo -e "\n${PURPLE}🎯 Quick Test Script:${NC}"

cat > test-workspace-integration.mjs << 'EOF'
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
EOF

chmod +x test-workspace-integration.mjs
echo -e "${GREEN}✅ Created test-workspace-integration.mjs${NC}"

echo -e "\n${GREEN}✨ Integration Ready!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: ./enable-workspace-apis.sh"
echo "2. Configure domain-wide delegation in Google Admin"
echo "3. Test: node test-workspace-integration.mjs"
echo "4. Create groups: node -e \"import('./google-workspace-integration.mjs').then(w => w.setupWorkspaceGroups())\""