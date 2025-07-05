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
