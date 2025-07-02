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
      { name: 'replicate', enabled: !!process.env.REPLICATE_API_TOKEN },
      { name: 'sqlite', enabled: true }, // Always enabled for local backup
      { name: 'rss', enabled: true } // Always enabled for open sharing
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
