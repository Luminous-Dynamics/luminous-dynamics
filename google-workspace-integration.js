// Google Workspace Integration for Sacred Systems
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.google-workspace' });

// OAuth2 client for user authentication
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Service account for server operations
const serviceAuth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
  scopes: process.env.GOOGLE_SCOPES.split(' ')
});

// Email group management
export async function createSacredGroup(groupEmail, groupName, description) {
  const admin = google.admin({ version: 'directory_v1', auth: serviceAuth });
  
  try {
    const group = await admin.groups.insert({
      requestBody: {
        email: groupEmail,
        name: groupName,
        description: description
      }
    });
    
    console.log(`✅ Created sacred group: ${groupEmail}`);
    return group.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

// Send sacred communications
export async function sendSacredEmail(to, subject, body, from = 'sacred-guild@luminousdynamics.org') {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body
  ].join('\n');
  
  const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  
  try {
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
    
    console.log(`✅ Sacred message sent to ${to}`);
    return result.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// List group members
export async function listSacredGuildMembers() {
  const admin = google.admin({ version: 'directory_v1', auth: serviceAuth });
  
  try {
    const members = await admin.members.list({
      groupKey: 'sacred-guild@luminousdynamics.org'
    });
    
    return members.data.members || [];
  } catch (error) {
    console.error('Error listing members:', error);
    throw error;
  }
}

export default {
  oauth2Client,
  serviceAuth,
  createSacredGroup,
  sendSacredEmail,
  listSacredGuildMembers
};
