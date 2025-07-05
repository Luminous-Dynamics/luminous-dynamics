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
