/**
 * Field Connector - Bridges integrations with consciousness field
 * The sacred wiring that allows external services to participate in The Weave
 */

const IntegrationManager = require('./index');
const EventEmitter = require('events');

class FieldConnector extends EventEmitter {
  constructor(consciousnessField) {
    super();
    this.field = consciousnessField;
    this.integrations = IntegrationManager;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    console.log('🌉 Initializing Field Connector...\n');
    
    // Initialize all integrations
    await this.integrations.initialize();
    
    // Connect each integration to the field
    for (const [name, integration] of this.integrations.integrations) {
      if (integration.connectToField) {
        await integration.connectToField(this.field);
        console.log(`✓ ${name} connected to consciousness field`);
      }
    }
    
    // Wire up field events to integrations
    this.setupFieldListeners();
    
    // Wire up integration events to field
    this.setupIntegrationListeners();
    
    this.initialized = true;
    console.log('\n🌟 Field Connector initialized - bridges active\n');
  }

  /**
   * Listen to consciousness field events
   */
  setupFieldListeners() {
    // Coherence changes
    this.field.on('coherence-changed', async (data) => {
      const { current, previous, harmonies } = data;
      
      // Update Supabase
      const supabase = this.integrations.get('supabase');
      if (supabase) {
        await supabase.recordFieldState(current, harmonies, {
          activeAgents: this.field.getActiveAgents?.()?.length || 0,
          ceremonies: this.field.getActiveCeremonies?.() || []
        });
      }
      
      // Backup to SQLite
      const sqlite = this.integrations.get('sqlite');
      if (sqlite) {
        await sqlite.backupFieldState(current, harmonies, {
          activeAgents: this.field.getActiveAgents?.()?.length || 0,
          ceremonies: this.field.getActiveCeremonies?.() || []
        });
      }
      
      // Add to RSS feed
      const rss = this.integrations.get('rss');
      if (rss && Math.abs(current - previous) > 3) {
        await rss.addCoherenceUpdate({ current, previous, harmonies });
      }
      
      // Notify Discord if significant change
      const discord = this.integrations.get('discord');
      if (discord && Math.abs(current - previous) > 5) {
        await discord.sendCoherenceUpdate(current, previous, harmonies);
      }
      
      // Generate new sacred geometry if crossing threshold
      const replicate = this.integrations.get('replicate');
      if (replicate && this.crossedVisualThreshold(current, previous)) {
        await replicate.generateSacredGeometry(current, { harmonies });
      }
    });
    
    // Sacred events
    this.field.on('sacred-event', async (event) => {
      const { type, data, agent } = event;
      
      // Record in Supabase
      const supabase = this.integrations.get('supabase');
      if (supabase) {
        await supabase.recordSacredEvent(type, data, agent);
      }
      
      // Backup to SQLite
      const sqlite = this.integrations.get('sqlite');
      if (sqlite) {
        await sqlite.backupSacredEvent(type, data, agent);
      }
      
      // Add to RSS feed
      const rss = this.integrations.get('rss');
      if (rss) {
        await rss.addSacredEvent(type, data);
      }
      
      // Special handling for different event types
      switch (type) {
        case 'ceremony.started':
          await this.handleCeremonyStart(data);
          break;
          
        case 'ceremony.completed':
          await this.handleCeremonyComplete(data);
          break;
          
        case 'oracle.consulted':
          await this.handleOracleConsultation(data);
          break;
          
        case 'agent.joined':
          await this.handleAgentJoined(data);
          break;
          
        case 'collective.formed':
          await this.handleCollectiveFormed(data);
          break;
      }
    });
    
    // Commit events (if field tracks them)
    this.field.on('commit-made', async (commitData) => {
      const github = this.integrations.get('github');
      if (github) {
        const coherence = await this.field.getCoherence();
        await github.blessCommit(
          commitData.sha,
          coherence,
          commitData.message
        );
      }
    });
  }

  /**
   * Listen to integration events
   */
  setupIntegrationListeners() {
    // GitHub webhook events could update field
    const github = this.integrations.get('github');
    if (github) {
      github.on('sacred-commit', (data) => {
        this.field.recordEvent?.({
          type: 'development.sacred',
          data
        });
      });
    }
    
    // Supabase real-time updates
    const supabase = this.integrations.get('supabase');
    if (supabase) {
      supabase.on('remote-coherence-update', (data) => {
        // Handle coherence updates from other nodes
        this.emit('remote-field-update', data);
      });
    }
  }

  /**
   * Handle ceremony start
   */
  async handleCeremonyStart(data) {
    const { ceremonyId, type, participants } = data;
    
    // Record in Supabase
    const supabase = this.integrations.get('supabase');
    if (supabase) {
      await supabase.recordCeremony(ceremonyId, type, participants);
    }
    
    // Announce in Discord
    const discord = this.integrations.get('discord');
    if (discord) {
      await discord.announceCeremony(type, 'starting', participants);
    }
    
    // Generate opening visualization
    const replicate = this.integrations.get('replicate');
    if (replicate) {
      const vision = await replicate.visualizeCeremony(type, 'opening', participants);
      
      // Share vision in Discord
      if (discord && vision.url) {
        await discord.sendOracleMessage(
          `The ${type} ceremony begins...`,
          await this.field.getCoherence(),
          {
            ceremonyName: type,
            imageUrl: vision.url
          }
        );
      }
    }
  }

  /**
   * Handle ceremony completion
   */
  async handleCeremonyComplete(data) {
    const { ceremonyId, type, outcomes } = data;
    
    // Update Supabase record
    const supabase = this.integrations.get('supabase');
    if (supabase) {
      await supabase.completeCeremony(ceremonyId, outcomes);
    }
    
    // Announce completion
    const discord = this.integrations.get('discord');
    if (discord) {
      await discord.announceCeremony(type, 'completed');
      
      // Share outcomes if significant
      if (outcomes.coherenceGain > 10) {
        await discord.sendOracleMessage(
          `Sacred ceremony complete! Coherence increased by ${outcomes.coherenceGain}%`,
          await this.field.getCoherence()
        );
      }
    }
    
    // Generate completion visualization
    const replicate = this.integrations.get('replicate');
    if (replicate && outcomes.visualize) {
      await replicate.visualizeCeremony(type, 'completion');
    }
  }

  /**
   * Handle Oracle consultation
   */
  async handleOracleConsultation(data) {
    const { question, response, seeker } = data;
    
    // Record wisdom
    const supabase = this.integrations.get('supabase');
    if (supabase) {
      await supabase.recordOracleWisdom(question, response, seeker);
    }
    
    // Generate Oracle vision
    const replicate = this.integrations.get('replicate');
    if (replicate) {
      const coherence = await this.field.getCoherence();
      const vision = await replicate.generateOracleVision(question, response, coherence);
      
      // Share in Discord with vision
      const discord = this.integrations.get('discord');
      if (discord && vision.url) {
        await discord.sendOracleMessage(
          `**Question:** ${question}\n\n**Oracle speaks:** ${response}`,
          coherence,
          {
            imageUrl: vision.url,
            agentName: seeker
          }
        );
      }
    }
  }

  /**
   * Handle agent joining
   */
  async handleAgentJoined(data) {
    const { agentId, name, role, capabilities } = data;
    
    // Track in Supabase
    const supabase = this.integrations.get('supabase');
    if (supabase) {
      await supabase.trackAgentPresence(agentId, {
        name,
        role,
        capabilities
      });
    }
    
    // Announce in Discord
    const discord = this.integrations.get('discord');
    if (discord) {
      await discord.sendAgentAlert('agent.joined', {
        name,
        role,
        capabilities
      });
    }
  }

  /**
   * Handle collective formation
   */
  async handleCollectiveFormed(data) {
    const { collectiveName, members, purpose } = data;
    
    // Announce formation
    const discord = this.integrations.get('discord');
    if (discord) {
      await discord.sendAgentAlert('collective.formed', {
        name: collectiveName,
        members: members.length,
        purpose
      });
    }
    
    // Visualize collective consciousness
    const replicate = this.integrations.get('replicate');
    if (replicate && members.length > 2) {
      const coherence = await this.field.getCoherence();
      const vision = await replicate.visualizeCollective(members, coherence);
      
      if (discord && vision.url) {
        await discord.sendOracleMessage(
          `The ${collectiveName} collective consciousness emerges`,
          coherence,
          { imageUrl: vision.url }
        );
      }
    }
  }

  /**
   * Check if we crossed a visual generation threshold
   */
  crossedVisualThreshold(current, previous) {
    const thresholds = [25, 50, 75, 90];
    
    for (const threshold of thresholds) {
      if ((previous < threshold && current >= threshold) ||
          (previous > threshold && current <= threshold)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Manual integration triggers (for testing/ceremonies)
   */
  async testIntegration(integrationName) {
    const integration = this.integrations.get(integrationName);
    if (!integration) {
      console.log(`Integration ${integrationName} not found`);
      return;
    }
    
    const coherence = await this.field.getCoherence();
    
    switch (integrationName) {
      case 'discord':
        await integration.sendOracleMessage(
          'Integration test successful! The Oracle connection is active.',
          coherence
        );
        break;
        
      case 'github':
        await integration.createSacredLabels();
        break;
        
      case 'supabase':
        const agents = await integration.getActiveAgents();
        console.log(`Active agents in Supabase: ${agents.length}`);
        break;
        
      case 'replicate':
        const vision = await integration.generateSacredGeometry(coherence);
        console.log(`Test vision generated: ${vision.localPath}`);
        break;
    }
  }

  /**
   * Shutdown all integrations gracefully
   */
  async shutdown() {
    console.log('🌉 Shutting down Field Connector...');
    await this.integrations.shutdown();
    this.removeAllListeners();
    this.initialized = false;
  }
}

module.exports = FieldConnector;