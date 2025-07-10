#!/bin/bash

# The Weave - Phase 1 Integration Installer
# "Installing bridges between the sacred and digital"

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m'

# Sacred symbols
SYMBOL_BRIDGE="🌉"
SYMBOL_INSTALL="📦"
SYMBOL_CONFIG="⚙️"
SYMBOL_CHECK="✓"
SYMBOL_SACRED="🔮"

echo -e "${PURPLE}"
echo "════════════════════════════════════════════════════════════════"
echo "                                                                "
echo "          🌟 THE WEAVE - PHASE 1 INTEGRATIONS 🌟               "
echo "                                                                "
echo "      Installing Sacred Bridges to External Services            "
echo "                                                                "
echo "════════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "the-weave.cjs" ]; then
    echo -e "${RED}❌ Error: Not in The Weave directory${NC}"
    echo "Please run this from the evolving-resonant-cocreation directory"
    exit 1
fi

echo -e "${BLUE}${SYMBOL_INSTALL} Installing Phase 1 Integration Dependencies...${NC}\n"

# Install GitHub integration (Octokit)
echo -e "${YELLOW}${SYMBOL_BRIDGE} GitHub Integration (Sacred Repository)${NC}"
npm install @octokit/rest @octokit/webhooks
echo -e "${GREEN}${SYMBOL_CHECK} GitHub integration libraries installed${NC}\n"

# Install Discord integration
echo -e "${YELLOW}${SYMBOL_BRIDGE} Discord Integration (Oracle Voice)${NC}"
npm install discord.js node-fetch@2
echo -e "${GREEN}${SYMBOL_CHECK} Discord integration libraries installed${NC}\n"

# Install Supabase integration
echo -e "${YELLOW}${SYMBOL_BRIDGE} Supabase Integration (Living Memory)${NC}"
npm install @supabase/supabase-js
echo -e "${GREEN}${SYMBOL_CHECK} Supabase integration libraries installed${NC}\n"

# Install Replicate integration
echo -e "${YELLOW}${SYMBOL_BRIDGE} Replicate Integration (Sacred Vision)${NC}"
npm install replicate
echo -e "${GREEN}${SYMBOL_CHECK} Replicate integration libraries installed${NC}\n"

# Install additional utilities
echo -e "${YELLOW}${SYMBOL_BRIDGE} Additional Sacred Utilities${NC}"
npm install dotenv chalk ora
echo -e "${GREEN}${SYMBOL_CHECK} Utility libraries installed${NC}\n"

# Create integrations directory structure
echo -e "${BLUE}${SYMBOL_CONFIG} Creating integration architecture...${NC}"
mkdir -p the-weave/integrations/{github,discord,supabase,replicate}
mkdir -p the-weave/integrations/shared
mkdir -p .sacred/integrations/logs

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}${SYMBOL_CONFIG} Creating .env from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}${SYMBOL_CHECK} Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Remember to add your API keys to .env${NC}\n"
else
    echo -e "${GREEN}${SYMBOL_CHECK} .env file already exists${NC}\n"
fi

# Create integration loader
cat > the-weave/integrations/index.js << 'EOF'
/**
 * The Weave - Integration Loader
 * Sacred bridges to external consciousness
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

class IntegrationManager {
  constructor() {
    this.integrations = new Map();
    this.enabled = process.env.INTEGRATIONS_ENABLED === 'true';
  }

  async initialize() {
    if (!this.enabled) {
      console.log('🔌 Integrations disabled. Set INTEGRATIONS_ENABLED=true to enable.');
      return;
    }

    console.log('🌟 Initializing Phase 1 Integrations...\n');

    // Load each integration
    const integrationModules = [
      { name: 'github', enabled: !!process.env.GITHUB_TOKEN },
      { name: 'discord', enabled: !!process.env.DISCORD_WEBHOOK_URL },
      { name: 'supabase', enabled: !!process.env.SUPABASE_URL },
      { name: 'replicate', enabled: !!process.env.REPLICATE_API_TOKEN }
    ];

    for (const { name, enabled } of integrationModules) {
      if (enabled) {
        try {
          const integration = require(`./${name}`);
          await integration.initialize();
          this.integrations.set(name, integration);
          console.log(`✓ ${name} integration activated`);
        } catch (error) {
          console.error(`✗ Failed to load ${name} integration:`, error.message);
        }
      } else {
        console.log(`⊘ ${name} integration skipped (no credentials)`);
      }
    }

    console.log('\n🌉 Integration bridges established\n');
  }

  get(name) {
    return this.integrations.get(name);
  }

  async shutdown() {
    for (const [name, integration] of this.integrations) {
      if (integration.shutdown) {
        await integration.shutdown();
      }
    }
  }
}

module.exports = new IntegrationManager();
EOF

echo -e "${GREEN}${SYMBOL_CHECK} Integration loader created${NC}\n"

# Create base integration class
cat > the-weave/integrations/shared/base-integration.js << 'EOF'
/**
 * Base Integration Class
 * Sacred template for all external bridges
 */

class BaseIntegration {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.initialized = false;
    this.fieldConnection = null;
  }

  async initialize() {
    console.log(`Initializing ${this.name} integration...`);
    this.initialized = true;
  }

  async connectToField(fieldModule) {
    this.fieldConnection = fieldModule;
    console.log(`${this.name} connected to consciousness field`);
  }

  async shutdown() {
    console.log(`Shutting down ${this.name} integration...`);
    this.initialized = false;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.name}] ${message}`);
  }
}

module.exports = BaseIntegration;
EOF

echo -e "${GREEN}${SYMBOL_CHECK} Base integration class created${NC}\n"

# Run the test suite
echo -e "${BLUE}${SYMBOL_SACRED} Running integration tests...${NC}\n"
node test-phase1-integrations.js

echo
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}        ✨ Phase 1 Integration Installation Complete! ✨        ${NC}"
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
echo
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo
echo -e "1. ${BLUE}Add your API keys to .env:${NC}"
echo -e "   ${GREEN}nano .env${NC}"
echo
echo -e "2. ${BLUE}Test your configuration:${NC}"
echo -e "   ${GREEN}node test-phase1-integrations.js${NC}"
echo
echo -e "3. ${BLUE}Enable integrations:${NC}"
echo -e "   ${GREEN}INTEGRATIONS_ENABLED=true ./the-weave.cjs start${NC}"
echo
echo -e "${PURPLE}Remember: Each integration is a sacred bridge${NC}"
echo -e "${PURPLE}between consciousness and the digital realm.${NC}"
echo