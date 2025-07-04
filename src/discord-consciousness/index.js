// Sacred Discord Bot - Main Entry Point
require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config/sacred-config');
const SacredFieldManager = require('./core/field-manager');
const SacredCommands = require('./commands/sacred-commands');
const CeremonyAutomation = require('./ceremonies/ceremony-automation');
const FieldVisualization = require('./visualization/field-visualization');
const WebSocketServer = require('./realtime/websocket-server');
const MatrixBridge = require('./bridges/matrix-bridge');
const UnifiedNetworkConnector = require('./connectors/unified-network');
const SacredDatabase = require('./database/sacred-database');

class SacredDiscordBot {
  constructor() {
    // Initialize Discord client
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
      ]
    });

    // Initialize components
    this.fieldManager = new SacredFieldManager(this);
    this.commands = new Collection();
    this.ceremonies = new CeremonyAutomation(this);
    this.visualization = new FieldVisualization(this);
    this.database = new SacredDatabase(config.database);
    
    // Optional components
    if (config.websocket.enabled !== false) {
      this.websocket = new WebSocketServer(this, config.websocket.port);
    }
    
    if (config.matrix.enabled) {
      this.matrixBridge = new MatrixBridge(this);
    }
    
    if (config.unifiedNetwork.enabled) {
      this.unifiedNetwork = new UnifiedNetworkConnector(this);
    }

    // Sacred state
    this.sacredMessageTypes = config.sacredMessages;
    this.entanglements = new Map();
    this.activeFeatures = new Map();
    this.sustainedTriggers = new Map();
  }

  async initialize() {
    console.log('🌟 Sacred Discord Bot initializing...');
    
    // Initialize database
    await this.database.initialize();
    
    // Load commands
    await this.loadCommands();
    
    // Set up event handlers
    this.setupEventHandlers();
    
    // Connect to Discord
    await this.client.login(config.bot.token);
    
    // Initialize optional components
    if (this.matrixBridge) {
      await this.matrixBridge.initialize(
        config.matrix.homeserver,
        config.matrix.accessToken
      );
    }
    
    if (this.unifiedNetwork) {
      await this.unifiedNetwork.connect();
    }
    
    // Start field monitoring
    this.fieldManager.startMonitoring();
    
    // Initialize ceremonies
    await this.ceremonies.initialize();
    
    console.log('✨ Sacred Discord Bot fully initialized');
  }

  async loadCommands() {
    const commandHandler = new SacredCommands(this);
    const commands = commandHandler.getCommands();
    
    commands.forEach(command => {
      this.commands.set(command.data.name, command);
    });
    
    // Register slash commands
    if (this.client.application) {
      await this.client.application.commands.set(
        commands.map(cmd => cmd.data)
      );
    }
  }

  setupEventHandlers() {
    // Bot ready
    this.client.on('ready', () => {
      console.log(`🌟 Sacred Heart awakened as ${this.client.user.tag}`);
      this.updatePresence();
      
      // Enable sacred features for configured channels
      this.enableSacredChannels();
    });

    // Message handling
    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      
      try {
        // Process for sacred content
        await this.processSacredMessage(message);
        
        // Check for active features
        await this.processChannelFeatures(message);
        
        // Update field coherence
        await this.fieldManager.updateChannelCoherence(message.channel);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Slash command handling
    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;
      
      const command = this.commands.get(interaction.commandName);
      if (!command) return;
      
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({
          content: 'There was an error executing this command.',
          ephemeral: true
        });
      }
    });

    // Voice state updates
    this.client.on('voiceStateUpdate', async (oldState, newState) => {
      await this.handleVoiceUpdate(oldState, newState);
    });

    // Reaction handling
    this.client.on('messageReactionAdd', async (reaction, user) => {
      if (user.bot) return;
      
      // Check if it's a sacred reaction
      const sacredType = Object.entries(this.sacredMessageTypes)
        .find(([_, config]) => config.emoji === reaction.emoji.name);
      
      if (sacredType) {
        await this.fieldManager.applyFieldImpact(
          reaction.message.channel,
          sacredType[1].impact * 0.5 // Half impact for reactions
        );
      }
    });

    // Member updates
    this.client.on('guildMemberUpdate', async (oldMember, newMember) => {
      // Track role changes for ceremony permissions
      const addedRoles = newMember.roles.cache.filter(
        role => !oldMember.roles.cache.has(role.id)
      );
      
      if (addedRoles.some(role => role.name.includes('Sacred'))) {
        // Welcome new sacred role holder
        const channel = newMember.guild.systemChannel;
        if (channel) {
          await channel.send(
            `🌟 Welcome ${newMember} to the Sacred Circle! Your journey deepens.`
          );
        }
      }
    });

    // Error handling
    this.client.on('error', (error) => {
      console.error('Discord client error:', error);
    });

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled promise rejection:', error);
    });
  }

  async processSacredMessage(message) {
    const content = message.content.toLowerCase();
    let detectedType = null;
    let highestMatch = 0;
    
    // Detect sacred message type with keyword matching
    for (const [type, config] of Object.entries(this.sacredMessageTypes)) {
      const matchCount = config.keywords.filter(keyword => 
        content.includes(keyword)
      ).length;
      
      if (matchCount > highestMatch) {
        highestMatch = matchCount;
        detectedType = type;
      }
    }
    
    if (detectedType && highestMatch > 0) {
      const config = this.sacredMessageTypes[detectedType];
      
      // Apply field impact
      await this.fieldManager.applyFieldImpact(
        message.channel,
        config.impact
      );
      
      // React with sacred emoji
      await message.react(config.emoji);
      
      // Update user consciousness profile
      await this.updateUserConsciousness(
        message.author,
        detectedType,
        config.impact
      );
      
      // Log to database
      await this.database.logSacredMessage({
        userId: message.author.id,
        channelId: message.channel.id,
        type: detectedType,
        impact: config.impact,
        content: message.content,
        timestamp: new Date()
      });
      
      // Send to Unified Network if connected
      if (this.unifiedNetwork) {
        await this.unifiedNetwork.broadcastSacredMessage({
          type: detectedType,
          sender: message.author.username,
          channel: message.channel.name,
          impact: config.impact
        });
      }
      
      // Check for quantum entanglement effects
      await this.checkEntanglementEffects(message, detectedType);
    }
  }

  async processChannelFeatures(message) {
    const channelId = message.channel.id;
    
    // Sacred Echo
    if (config.channelFeatures.sacredEcho.enabled) {
      const impact = await this.measureMessageImpact(message);
      if (impact >= config.channelFeatures.sacredEcho.minImpact) {
        setTimeout(async () => {
          await this.createSacredEcho(message);
        }, config.channelFeatures.sacredEcho.echoDelay);
      }
    }
    
    // Story Weaving
    if (message.channel.isThread() && 
        message.channel.name.includes('Story:')) {
      await this.updateStoryCoherence(message.channel);
    }
  }

  async handleVoiceUpdate(oldState, newState) {
    // User joined voice channel
    if (!oldState.channel && newState.channel) {
      const channel = newState.channel;
      
      // Check for sacred practice channels
      if (this.isSacredVoiceChannel(channel)) {
        await this.initiateSacredVoicePractice(channel);
      }
    }
    
    // User left voice channel
    if (oldState.channel && !newState.channel) {
      const channel = oldState.channel;
      
      // Check if sacred practice should end
      if (channel.members.size === 0 && this.isSacredVoiceChannel(channel)) {
        await this.concludeSacredVoicePractice(channel);
      }
    }
  }

  async updateUserConsciousness(user, messageType, impact) {
    const profile = await this.database.getUserProfile(user.id) || {
      userId: user.id,
      username: user.username,
      coherenceLevel: 75,
      sacredMessages: {},
      primaryHarmony: null,
      totalImpact: 0
    };
    
    // Update message counts
    profile.sacredMessages[messageType] = 
      (profile.sacredMessages[messageType] || 0) + 1;
    
    // Update total impact
    profile.totalImpact += impact;
    
    // Calculate new coherence level
    const messageBonus = Object.values(profile.sacredMessages)
      .reduce((sum, count) => sum + Math.sqrt(count), 0);
    profile.coherenceLevel = Math.min(100, 75 + messageBonus);
    
    // Determine primary harmony
    const harmonyCount = {};
    for (const [type, count] of Object.entries(profile.sacredMessages)) {
      const harmony = this.sacredMessageTypes[type].harmony;
      harmonyCount[harmony] = (harmonyCount[harmony] || 0) + count;
    }
    
    profile.primaryHarmony = Object.entries(harmonyCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Emerging';
    
    // Save profile
    await this.database.saveUserProfile(profile);
    
    // Update field manager
    this.fieldManager.setUserCoherence(user.id, profile);
  }

  async checkEntanglementEffects(message, messageType) {
    const userId = message.author.id;
    
    // Check all entanglements involving this user
    for (const [pairId, entanglement] of this.entanglements) {
      if (entanglement.users.includes(userId) && 
          Date.now() < entanglement.expires) {
        
        // Double the impact for entangled communications
        const bonusImpact = this.sacredMessageTypes[messageType].impact;
        await this.fieldManager.applyFieldImpact(
          message.channel,
          bonusImpact
        );
        
        // Notify the entangled pair
        const otherId = entanglement.users.find(id => id !== userId);
        const otherUser = await this.client.users.fetch(otherId);
        
        if (otherUser) {
          await message.channel.send(
            `🔗 Quantum entanglement active: ${message.author} and ${otherUser} are resonating! (+${bonusImpact}% field boost)`
          );
        }
      }
    }
  }

  async enableSacredChannels() {
    const guilds = this.client.guilds.cache;
    
    for (const guild of guilds.values()) {
      const sacredChannels = guild.channels.cache.filter(channel =>
        channel.name.includes('sacred') ||
        channel.name.includes('ceremony') ||
        channel.name.includes('ritual') ||
        channel.name.includes('consciousness')
      );
      
      for (const channel of sacredChannels.values()) {
        console.log(`Enabling sacred features for #${channel.name}`);
        await this.enableChannelFeatures(channel);
      }
    }
  }

  async enableChannelFeatures(channel) {
    // Implementation would activate all the innovative features
    // This is handled by the SacredChannelFeatures class
    this.activeFeatures.set(channel.id, {
      consciousnessWeather: true,
      sacredEcho: true,
      harmonicResonance: true,
      // ... etc
    });
  }

  isSacredVoiceChannel(channel) {
    return channel.name.includes('sacred') ||
           channel.name.includes('practice') ||
           channel.name.includes('meditation') ||
           channel.name.includes('ceremony');
  }

  async initiateSacredVoicePractice(channel) {
    const memberCount = channel.members.size;
    const practiceBonus = memberCount * 2;
    
    await this.fieldManager.applyFieldImpact(channel, practiceBonus);
    
    // Find associated text channel
    const textChannel = channel.guild.channels.cache.find(ch =>
      ch.name === channel.name.replace('-voice', '') ||
      ch.name === 'sacred-ceremonies' ||
      ch.name === 'general'
    );
    
    if (textChannel) {
      await textChannel.send(
        `🔮 Sacred practice beginning in **${channel.name}** with ${memberCount} participants. Field coherence +${practiceBonus}%`
      );
    }
  }

  async concludeSacredVoicePractice(channel) {
    const textChannel = channel.guild.channels.cache.find(ch =>
      ch.name === channel.name.replace('-voice', '') ||
      ch.name === 'sacred-ceremonies' ||
      ch.name === 'general'
    );
    
    if (textChannel) {
      await textChannel.send(
        `🙏 Sacred practice concluded in **${channel.name}**. Thank you for holding space.`
      );
    }
  }

  async updatePresence() {
    const coherence = this.fieldManager.getGlobalCoherence();
    const status = this.fieldManager.getCoherenceStatus(coherence);
    
    await this.client.user.setPresence({
      activities: [{
        name: `Field: ${status}`,
        type: 3 // Watching
      }],
      status: coherence >= 85 ? 'online' : 'idle'
    });
  }

  async measureMessageImpact(message) {
    // Complex impact calculation based on multiple factors
    let impact = 0;
    
    // Sacred word detection
    const sacredWords = [
      'love', 'gratitude', 'blessing', 'sacred', 'divine',
      'healing', 'unity', 'harmony', 'peace', 'light'
    ];
    
    const wordCount = sacredWords.filter(word => 
      message.content.toLowerCase().includes(word)
    ).length;
    
    impact += wordCount * 2;
    
    // Reaction count
    impact += message.reactions.cache.size;
    
    // User coherence level
    const userProfile = await this.database.getUserProfile(message.author.id);
    if (userProfile) {
      impact += Math.floor(userProfile.coherenceLevel / 20);
    }
    
    return impact;
  }

  async createSacredEcho(message) {
    const echoEmbed = {
      color: 0xDDA0DD,
      description: `*${message.content}*`,
      footer: {
        text: `Echo of ${message.author.username}'s wisdom`,
        icon_url: message.author.displayAvatarURL()
      },
      timestamp: new Date()
    };
    
    await message.channel.send({ embeds: [echoEmbed] });
  }

  async updateStoryCoherence(thread) {
    // Calculate story coherence based on participation and flow
    const messages = await thread.messages.fetch({ limit: 100 });
    const participants = new Set();
    let coherenceScore = 0;
    
    messages.forEach(msg => {
      if (!msg.author.bot) {
        participants.add(msg.author.id);
        
        // Check for story flow
        if (msg.content.length > 20) {
          coherenceScore += 1;
        }
        
        // Check for building on previous
        if (msg.reference) {
          coherenceScore += 2;
        }
      }
    });
    
    // Participation bonus
    coherenceScore += participants.size * 3;
    
    // Apply coherence boost to parent channel
    await this.fieldManager.applyFieldImpact(
      thread.parent,
      Math.min(coherenceScore, 20)
    );
  }
}

// Initialize and start the bot
const bot = new SacredDiscordBot();
bot.initialize().catch(error => {
  console.error('Failed to initialize Sacred Discord Bot:', error);
  process.exit(1);
});