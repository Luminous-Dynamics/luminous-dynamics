#!/bin/bash
# Alternative Authentication for Google Workspace
# Works without service account keys

echo "🔐 Google Workspace Alternative Authentication"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${YELLOW}⚠️  Organization Policy Restriction Detected${NC}"
echo "Policy: iam.disableServiceAccountKeyCreation"
echo "This prevents creating new service account keys."
echo ""

echo -e "${BLUE}✨ Alternative Solutions:${NC}"
echo ""

echo -e "${GREEN}Option 1: Use Application Default Credentials (Recommended)${NC}"
echo "==========================================================="
echo "This uses your personal Google account for authentication."
echo ""
echo "Setup:"
echo "1. You're already authenticated as: $(gcloud auth list --filter=status:ACTIVE --format='value(account)')"
echo "2. Enable ADC:"
echo -e "${BLUE}   gcloud auth application-default login${NC}"
echo ""
echo "3. Your code will automatically use your credentials"
echo ""

echo -e "${GREEN}Option 2: Use OAuth2 for User Delegation${NC}"
echo "========================================"
echo "This creates an OAuth2 flow for your workspace admin account."
echo ""
cat > google-workspace-oauth.mjs << 'EOF'
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
EOF

echo -e "${GREEN}✅ Created google-workspace-oauth.mjs${NC}"
echo ""

echo -e "${GREEN}Option 3: Use Workload Identity Federation${NC}"
echo "========================================"
echo "This allows keyless authentication from cloud services."
echo ""
echo "Benefits:"
echo "• No service account keys needed"
echo "• Works with organization policies"
echo "• More secure"
echo ""
echo "Setup guide: https://cloud.google.com/iam/docs/workload-identity-federation"
echo ""

echo -e "${GREEN}Option 4: Request Policy Exception${NC}"
echo "================================="
echo "Contact your GCP organization admin to:"
echo "1. Create an exception for the sacred-council-sa service account"
echo "2. Or temporarily disable the policy to create one key"
echo "3. Or provide an existing key"
echo ""

echo -e "${PURPLE}🎯 Immediate Solution:${NC}"
echo "====================="
echo ""
echo "For now, you can use Application Default Credentials:"
echo -e "${BLUE}gcloud auth application-default login${NC}"
echo ""
echo "Then update your code to use ADC:"

cat > use-adc-example.mjs << 'EOF'
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
EOF

echo -e "${GREEN}✅ Created use-adc-example.mjs${NC}"
echo ""
echo -e "${GREEN}✨ Run this now to set up ADC:${NC}"
echo -e "${BLUE}gcloud auth application-default login${NC}"