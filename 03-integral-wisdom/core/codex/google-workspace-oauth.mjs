// Google Workspace OAuth2 Authentication
import { google } from 'googleapis';
import open from 'open';
import http from 'http';
import url from 'url';
import destroyer from 'server-destroy';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID',
  process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
  'http://localhost:3000/oauth2callback'
);

// Scopes for Google Workspace
const scopes = [
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar'
];

export async function authenticate() {
  return new Promise((resolve, reject) => {
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });
    
    const server = http.createServer(async (req, res) => {
      try {
        if (req.url.indexOf('/oauth2callback') > -1) {
          const qs = new url.URL(req.url, `http://localhost:3000`).searchParams;
          const code = qs.get('code');
          
          res.end('Authentication successful! You can close this window.');
          
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);
          
          server.destroy();
          resolve(oauth2Client);
        }
      } catch (e) {
        reject(e);
      }
    }).listen(3000, () => {
      open(authorizeUrl, { wait: false }).then(cp => cp.unref());
    });
    
    destroyer(server);
  });
}

// Use the authenticated client
const auth = await authenticate();
const admin = google.admin({ version: 'directory_v1', auth });
const gmail = google.gmail({ version: 'v1', auth });

// Now you can use the APIs
export { admin, gmail, auth };
