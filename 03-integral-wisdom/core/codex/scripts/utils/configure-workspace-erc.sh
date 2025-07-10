#!/bin/bash
# Configure Google Workspace for evolvingresonantcocreationism.com

echo "🌟 Google Workspace Configuration"
echo "================================"
echo "Admin: tristan.stoltz@evolvingresonantcocreationism.com"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}📋 Your Google Workspace Setup:${NC}"
echo "• Primary Domain: evolvingresonantcocreationism.com"
echo "• Admin Email: tristan.stoltz@evolvingresonantcocreationism.com"
echo "• Additional Domains: luminousdynamics.org, relationalharmonics.org, theweave.dev"
echo ""

echo -e "${YELLOW}📧 Recommended Email Groups for evolvingresonantcocreationism.com:${NC}"
echo ""
echo "┌─────────────────────────────────────────────────────────────────────┐"
echo "│ ${BLUE}Core Collaboration Groups:${NC}                                         │"
echo "├─────────────────────────────────────────────────────────────────────┤"
echo "│ • team@evolvingresonantcocreationism.com - Core team coordination  │"
echo "│ • sacred-tech@evolvingresonantcocreationism.com - Tech development │"
echo "│ • codex@evolvingresonantcocreationism.com - Codex practitioners   │"
echo "│ • research@evolvingresonantcocreationism.com - Research & docs    │"
echo "│ • community@evolvingresonantcocreationism.com - Community support │"
echo "└─────────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─────────────────────────────────────────────────────────────────────┐"
echo "│ ${BLUE}Alias Domains Setup:${NC}                                              │"
echo "├─────────────────────────────────────────────────────────────────────┤"
echo "│ luminousdynamics.org → Forward to evolvingresonantcocreationism   │"
echo "│ relationalharmonics.org → Forward to evolvingresonantcocreationism│"
echo "│ theweave.dev → Developer communications                            │"
echo "└─────────────────────────────────────────────────────────────────────┘"

echo -e "\n${BLUE}🔧 Quick Setup Steps:${NC}"
echo ""
echo "1. ${YELLOW}Log into Google Admin:${NC}"
echo "   https://admin.google.com"
echo "   Use: tristan.stoltz@evolvingresonantcocreationism.com"
echo ""
echo "2. ${YELLOW}Create Email Groups:${NC}"
echo "   • Go to: Directory → Groups"
echo "   • Click: Create Group"
echo "   • For each group above:"
echo "     - Set appropriate access levels"
echo "     - Add yourself as owner"
echo "     - Configure moderation settings"
echo ""
echo "3. ${YELLOW}Configure Domain Aliases:${NC}"
echo "   • Go to: Account → Domains"
echo "   • Add domain aliases for:"
echo "     - luminousdynamics.org"
echo "     - relationalharmonics.org"
echo "     - theweave.dev"
echo ""
echo "4. ${YELLOW}Set Up Email Routing:${NC}"
echo "   • Create routing rules for specialized addresses"
echo "   • Example: sacred-guild@luminousdynamics.org → team@evolvingresonantcocreationism.com"

# Create updated environment template
cat > .env.google-workspace-erc << 'EOF'
# Google Workspace Configuration for ERC
# Primary domain: evolvingresonantcocreationism.com

# Admin Configuration
GOOGLE_WORKSPACE_DOMAIN="evolvingresonantcocreationism.com"
GOOGLE_ADMIN_EMAIL="tristan.stoltz@evolvingresonantcocreationism.com"

# OAuth2 Credentials (regenerate these!)
GOOGLE_CLIENT_ID="your-new-client-id"
GOOGLE_CLIENT_SECRET="your-new-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"

# API Configuration
GOOGLE_AI_KEY="your-gemini-api-key"

# Service Account (create new one)
GOOGLE_SERVICE_ACCOUNT_EMAIL="erc-service@your-project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_KEY_PATH="./credentials/erc-service-account.json"

# Email Groups
SACRED_TEAM_EMAIL="team@evolvingresonantcocreationism.com"
SACRED_TECH_EMAIL="sacred-tech@evolvingresonantcocreationism.com"
CODEX_EMAIL="codex@evolvingresonantcocreationism.com"

# Domain Aliases
DOMAIN_ALIASES="luminousdynamics.org,relationalharmonics.org,theweave.dev"

# API Scopes
GOOGLE_SCOPES="https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/admin.directory.group"
EOF

echo -e "\n${GREEN}✅ Created .env.google-workspace-erc${NC}"

# Create email forwarding configuration
cat > email-forwarding-rules.json << 'EOF'
{
  "forwardingRules": [
    {
      "from": "sacred-guild@luminousdynamics.org",
      "to": "team@evolvingresonantcocreationism.com",
      "description": "Sacred Guild applications"
    },
    {
      "from": "contact@luminousdynamics.org",
      "to": "community@evolvingresonantcocreationism.com",
      "description": "General inquiries"
    },
    {
      "from": "wisdom@relationalharmonics.org",
      "to": "codex@evolvingresonantcocreationism.com",
      "description": "Codex wisdom sharing"
    },
    {
      "from": "first-breath@relationalharmonics.org",
      "to": "codex@evolvingresonantcocreationism.com",
      "description": "First Breath practitioner applications"
    },
    {
      "from": "dev@theweave.dev",
      "to": "sacred-tech@evolvingresonantcocreationism.com",
      "description": "Developer communications"
    }
  ]
}
EOF

echo -e "${GREEN}✅ Created email-forwarding-rules.json${NC}"

echo -e "\n${PURPLE}🌐 DNS Configuration:${NC}"
echo "For each domain alias, ensure these MX records point to Google:"
echo ""
echo "MX Records (Priority - Server):"
echo "1 - aspmx.l.google.com"
echo "5 - alt1.aspmx.l.google.com"
echo "5 - alt2.aspmx.l.google.com"
echo "10 - alt3.aspmx.l.google.com"
echo "10 - alt4.aspmx.l.google.com"

echo -e "\n${BLUE}📱 Mobile Access:${NC}"
echo "• Gmail App: Add tristan.stoltz@evolvingresonantcocreationism.com"
echo "• Google Admin App: Manage on the go"
echo "• Google Groups App: Monitor group discussions"

echo -e "\n${GREEN}✨ Configuration ready for evolvingresonantcocreationism.com!${NC}"
echo "Your primary workspace can now manage all sacred domains."