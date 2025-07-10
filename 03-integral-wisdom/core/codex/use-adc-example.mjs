// Using Application Default Credentials
import { google } from 'googleapis';

// This will use your gcloud credentials automatically
const auth = new google.auth.GoogleAuth({
  scopes: [
    'https://www.googleapis.com/auth/admin.directory.group',
    'https://www.googleapis.com/auth/gmail.send'
  ]
});

const authClient = await auth.getClient();

// For domain-wide delegation, impersonate the admin
authClient.subject = 'tristan.stoltz@evolvingresonantcocreationism.com';

const admin = google.admin({ version: 'directory_v1', auth: authClient });
const gmail = google.gmail({ version: 'v1', auth: authClient });

// Test it
try {
  const groups = await admin.groups.list({
    domain: 'evolvingresonantcocreationism.com'
  });
  console.log('Groups:', groups.data);
} catch (error) {
  console.error('Error:', error.message);
}
