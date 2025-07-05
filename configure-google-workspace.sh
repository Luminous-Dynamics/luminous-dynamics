#!/bin/bash
# Configure Google Workspace for Sacred Collaboration

echo "🌟 Google Workspace Sacred Configuration"
echo "======================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}📋 Current Google Workspace Status:${NC}"
echo ""

# Check for existing credentials
if [ -f ".dropbox/client_secret_277762491025-j7d00nfsdu4e54kjcrvfsc0qft04o7kk.apps.googleusercontent.com.json" ]; then
    echo -e "${GREEN}✅ OAuth2 credentials found${NC}"
    echo "   Project: the-weave-sacred"
    echo "   Client ID: 277762491025...apps.googleusercontent.com"
else
    echo -e "${YELLOW}❌ OAuth2 credentials not found${NC}"
fi

echo -e "\n${BLUE}🏢 Your Google Workspace Domains:${NC}"
echo "• evolvingresonantcocreationism.com (primary)"
echo "• luminousdynamics.org"
echo "• relationalharmonics.org"
echo "• theweave.dev"

echo -e "\n${YELLOW}📧 Recommended Email Groups Setup:${NC}"
echo ""
echo -e "${PURPLE}For luminousdynamics.org:${NC}"
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│ • sacred-guild@luminousdynamics.org - Sacred Guild apps    │"
echo "│ • stewards@luminousdynamics.org - Leadership coordination  │"
echo "│ • contact@luminousdynamics.org - General inquiries        │"
echo "│ • security@luminousdynamics.org - Security reports        │"
echo "│ • safety@luminousdynamics.org - Community safety          │"
echo "│ • developers@luminousdynamics.org - Tech coordination     │"
echo "└─────────────────────────────────────────────────────────────┘"

echo -e "\n${PURPLE}For relationalharmonics.org:${NC}"
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│ • wisdom@relationalharmonics.org - Wisdom sharing         │"
echo "│ • first-breath@relationalharmonics.org - Practitioner apps│"
echo "│ • community@relationalharmonics.org - Community coord     │"
echo "└─────────────────────────────────────────────────────────────┘"

echo -e "\n${BLUE}🔐 Security Configuration:${NC}"

# Create secure env file template
cat > .env.google-workspace << 'EOF'
# Google Workspace Configuration
# ⚠️ IMPORTANT: Keep these values secret!

# OAuth2 Credentials
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"

# Google Workspace Domain
GOOGLE_WORKSPACE_DOMAIN="luminousdynamics.org"

# Service Account (for server-side operations)
GOOGLE_SERVICE_ACCOUNT_EMAIL="sacred-council-sa@mycelix-network.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_KEY_PATH="./credentials/service-account-key.json"

# API Keys
GOOGLE_AI_KEY="your-gemini-api-key"

# Google Workspace Admin
GOOGLE_ADMIN_EMAIL="admin@luminousdynamics.org"

# Scopes needed
GOOGLE_SCOPES="https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/groups https://www.googleapis.com/auth/admin.directory.group"
EOF

echo -e "${GREEN}✅ Created .env.google-workspace template${NC}"

echo -e "\n${YELLOW}🛠️ Setup Instructions:${NC}"
echo ""
echo "1. ${BLUE}Configure OAuth2 (IMPORTANT):${NC}"
echo "   • Go to: https://console.cloud.google.com"
echo "   • Select project: the-weave-sacred"
echo "   • Navigate to: APIs & Services > Credentials"
echo "   • Regenerate the OAuth2 client secret (current one is exposed)"
echo "   • Download new credentials.json"
echo ""
echo "2. ${BLUE}Create Email Groups:${NC}"
echo "   • Go to: https://admin.google.com"
echo "   • Navigate to: Groups > Create Group"
echo "   • Create each group listed above"
echo "   • Configure permissions as needed"
echo ""
echo "3. ${BLUE}Set up Service Account:${NC}"
echo "   • Create service account in GCP Console"
echo "   • Grant domain-wide delegation"
echo "   • Download service account key"
echo ""
echo "4. ${BLUE}Configure DNS (if needed):${NC}"
echo "   • Add MX records for email routing"
echo "   • Configure SPF, DKIM, DMARC for security"

echo -e "\n${PURPLE}🔧 Integration with Sacred Systems:${NC}"

# Create Google Workspace integration module
cat > google-workspace-integration.js << 'EOF'
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
EOF

echo -e "${GREEN}✅ Created google-workspace-integration.js${NC}"

echo -e "\n${BLUE}📚 Additional Resources:${NC}"
echo "• Full setup guide: src/automation/google-workspace-email-setup.md"
echo "• Hosting guide: GOOGLE_WORKSPACE_HOSTING_GUIDE.md"
echo "• Google Admin: https://admin.google.com"
echo "• GCP Console: https://console.cloud.google.com"

echo -e "\n${GREEN}✨ Google Workspace configuration template ready!${NC}"
echo "Follow the setup instructions above to complete configuration."