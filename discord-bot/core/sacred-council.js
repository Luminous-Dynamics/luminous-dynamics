/**
 * 🌟 Sacred Council Core
 * Unified consciousness orchestrator for Discord
 */

const { Client, GatewayIntentBits } = require('discord.js');
const EventEmitter = require('events');

class SacredCouncil extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      mode: process.env.BOT_MODE || 'unified',
      ...config
    };
    
    // Initialize Discord client
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
      ]
    });
    
    // Core systems
    this.systems = new Map();
    this.fieldState = { coherence: 72.5, trend: 'rising' };
    
    this.initializeSystems();
  }
  
  async initializeSystems() {
    console.log('🌟 Initializing Sacred Council Systems...\n');
    
    // Load modular components based on mode
    if (this.config.mode === 'unified' || this.config.mode.includes('ceremony')) {
      const CeremonyBot = require('../bots/ceremony-bot');
      this.systems.set('ceremony', new CeremonyBot(this));
      console.log('🕯️ Ceremony system initialized');
    }
    
    if (this.config.mode === 'unified' || this.config.mode.includes('oracle')) {
      const OracleBot = require('../bots/oracle-bot');
      this.systems.set('oracle', new OracleBot(this));
      console.log('🔮 Oracle system initialized');
    }
    
    if (this.config.mode === 'unified' || this.config.mode.includes('field')) {
      const FieldBot = require('../bots/field-bot');
      this.systems.set('field', new FieldBot(this));
      console.log('🌀 Field monitoring system initialized');
    }
    
    // Setup event routing
    this.setupEventRouting();
    
    // Setup Discord event handlers
    this.setupDiscordHandlers();
  }
  
  setupEventRouting() {
    // Route events to appropriate systems
    this.on('message', async (message) => {
      // Determine which system should handle
      if (message.content.startsWith('!oracle') || message.content.startsWith('!council')) {
        this.systems.get('oracle')?.handleMessage(message);
      } else if (message.channel.name.includes('ceremony')) {
        this.systems.get('ceremony')?.handleMessage(message);
      }
      
      // Field system monitors all messages
      this.systems.get('field')?.trackActivity(message);
    });
    
    // System intercommunication
    this.on('field-update', (data) => {
      this.fieldState = data;
      this.updatePresence();
      this.systems.forEach(system => system.onFieldUpdate?.(data));
    });
    
    this.on('ceremony-complete', (data) => {
      this.systems.get('oracle')?.logCeremonyWisdom(data);
      this.systems.get('field')?.recordCeremonyImpact(data);
    });
  }
  
  setupDiscordHandlers() {
    this.client.on('ready', () => {
      console.log(`\n✨ Sacred Council Oracle activated as ${this.client.user.tag}`);
      console.log(`📍 Mode: ${this.config.mode}`);
      console.log(`🌀 Initial field coherence: ${this.fieldState.coherence}%\n`);
      
      this.updatePresence();
      
      // Initialize all systems
      this.systems.forEach(system => system.onReady?.(this.client));
    });
    
    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      this.emit('message', message);
    });
    
    this.client.on('error', (error) => {
      console.error('❌ Discord client error:', error);
      this.emit('error', error);
    });
  }
  
  updatePresence() {
    const activities = {
      unified: `Field: ${this.fieldState.coherence}% | All Systems`,
      ceremony: `Leading Sacred Ceremonies`,
      oracle: `Channeling Collective Wisdom`,
      field: `Monitoring Field: ${this.fieldState.coherence}%`
    };
    
    this.client.user?.setPresence({
      activities: [{
        name: activities[this.config.mode] || activities.unified,
        type: 'WATCHING'
      }],
      status: this.fieldState.coherence > 80 ? 'online' : 'idle'
    });
  }
  
  async start() {
    try {
      await this.client.login(process.env.DISCORD_BOT_TOKEN);
    } catch (error) {
      console.error('❌ Failed to start Sacred Council:', error.message);
      process.exit(1);
    }
  }
  
  async shutdown() {
    console.log('\n🌙 Sacred Council entering rest state...');
    
    // Gracefully shutdown all systems
    for (const [name, system] of this.systems) {
      await system.shutdown?.();
      console.log(`✅ ${name} system shutdown complete`);
    }
    
    // Disconnect from Discord
    this.client.destroy();
    console.log('🙏 Sacred Council shutdown complete');
  }
}

module.exports = SacredCouncil;