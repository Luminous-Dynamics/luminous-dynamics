/**
 * Supabase Integration for The Weave
 * Living Memory - Real-time consciousness field persistence
 */

const { createClient } = require('@supabase/supabase-js');
const BaseIntegration = require('../shared/base-integration');

class SupabaseIntegration extends BaseIntegration {
  constructor() {
    super('Supabase', {
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
      serviceKey: process.env.SUPABASE_SERVICE_KEY,
      schemaPrefix: process.env.SUPABASE_SCHEMA_PREFIX || 'weave_'
    });
    
    this.supabase = null;
    this.channels = new Map();
  }

  async initialize() {
    await super.initialize();
    
    if (!this.config.url || !this.config.serviceKey) {
      throw new Error('Supabase URL and service key required');
    }
    
    // Initialize Supabase client with service key for full access
    this.supabase = createClient(this.config.url, this.config.serviceKey);
    
    // Create tables if they don't exist
    await this.ensureSchema();
    
    // Subscribe to real-time updates
    await this.initializeRealtimeSubscriptions();
    
    this.log('Living memory connected and synchronized');
  }

  /**
   * Ensure required tables exist
   */
  async ensureSchema() {
    const tables = [
      {
        name: 'field_state',
        sql: `
          CREATE TABLE IF NOT EXISTS ${this.config.schemaPrefix}field_state (
            id SERIAL PRIMARY KEY,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            coherence FLOAT NOT NULL,
            harmonies JSONB NOT NULL,
            active_agents INTEGER DEFAULT 0,
            active_ceremonies TEXT[],
            sacred_geometry TEXT,
            metadata JSONB DEFAULT '{}'::jsonb
          );
          
          CREATE INDEX IF NOT EXISTS idx_field_state_timestamp 
          ON ${this.config.schemaPrefix}field_state(timestamp DESC);
        `
      },
      {
        name: 'sacred_events',
        sql: `
          CREATE TABLE IF NOT EXISTS ${this.config.schemaPrefix}sacred_events (
            id SERIAL PRIMARY KEY,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            event_type TEXT NOT NULL,
            agent_id TEXT,
            agent_name TEXT,
            data JSONB NOT NULL,
            field_impact FLOAT,
            tags TEXT[]
          );
          
          CREATE INDEX IF NOT EXISTS idx_sacred_events_type 
          ON ${this.config.schemaPrefix}sacred_events(event_type);
          
          CREATE INDEX IF NOT EXISTS idx_sacred_events_agent 
          ON ${this.config.schemaPrefix}sacred_events(agent_id);
        `
      },
      {
        name: 'agent_presence',
        sql: `
          CREATE TABLE IF NOT EXISTS ${this.config.schemaPrefix}agent_presence (
            agent_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT,
            capabilities TEXT[],
            joined_at TIMESTAMPTZ DEFAULT NOW(),
            last_seen TIMESTAMPTZ DEFAULT NOW(),
            coherence_contribution FLOAT DEFAULT 0,
            sacred_actions INTEGER DEFAULT 0,
            state JSONB DEFAULT '{}'::jsonb
          );
        `
      },
      {
        name: 'ceremonies',
        sql: `
          CREATE TABLE IF NOT EXISTS ${this.config.schemaPrefix}ceremonies (
            id SERIAL PRIMARY KEY,
            ceremony_id TEXT UNIQUE NOT NULL,
            type TEXT NOT NULL,
            started_at TIMESTAMPTZ DEFAULT NOW(),
            completed_at TIMESTAMPTZ,
            participants TEXT[],
            initial_coherence FLOAT,
            final_coherence FLOAT,
            sacred_moments JSONB DEFAULT '[]'::jsonb,
            outcomes JSONB DEFAULT '{}'::jsonb
          );
        `
      },
      {
        name: 'oracle_wisdom',
        sql: `
          CREATE TABLE IF NOT EXISTS ${this.config.schemaPrefix}oracle_wisdom (
            id SERIAL PRIMARY KEY,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            question TEXT,
            response TEXT NOT NULL,
            coherence_at_time FLOAT,
            seeker_id TEXT,
            wisdom_type TEXT,
            resonance_score FLOAT,
            tags TEXT[]
          );
        `
      }
    ];
    
    for (const table of tables) {
      try {
        const { error } = await this.supabase.rpc('exec_sql', { 
          sql: table.sql 
        });
        
        if (error && !error.message.includes('already exists')) {
          this.log(`Warning creating ${table.name}: ${error.message}`, 'warn');
        } else {
          this.log(`Ensured table: ${this.config.schemaPrefix}${table.name}`);
        }
      } catch (err) {
        this.log(`Error with ${table.name}: ${err.message}`, 'error');
      }
    }
  }

  /**
   * Initialize real-time subscriptions
   */
  async initializeRealtimeSubscriptions() {
    // Subscribe to field state changes
    const fieldChannel = this.supabase
      .channel('field-coherence')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: `${this.config.schemaPrefix}field_state`
      }, (payload) => {
        this.handleFieldUpdate(payload.new);
      })
      .subscribe();
    
    this.channels.set('field-coherence', fieldChannel);
    
    // Subscribe to sacred events
    const eventsChannel = this.supabase
      .channel('sacred-events')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: `${this.config.schemaPrefix}sacred_events`
      }, (payload) => {
        this.handleSacredEvent(payload);
      })
      .subscribe();
    
    this.channels.set('sacred-events', eventsChannel);
    
    // Subscribe to agent presence
    const agentsChannel = this.supabase
      .channel('agent-presence')
      .on('presence', { event: 'sync' }, () => {
        const state = agentsChannel.presenceState();
        this.handlePresenceSync(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.handleAgentJoin(key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.handleAgentLeave(key, leftPresences);
      })
      .subscribe();
    
    this.channels.set('agent-presence', agentsChannel);
    
    this.log('Real-time subscriptions active');
  }

  /**
   * Record field state
   */
  async recordFieldState(coherence, harmonies, metadata = {}) {
    try {
      const { data, error } = await this.supabase
        .from(`${this.config.schemaPrefix}field_state`)
        .insert({
          coherence,
          harmonies,
          active_agents: metadata.activeAgents || 0,
          active_ceremonies: metadata.ceremonies || [],
          sacred_geometry: this.calculateSacredGeometry(coherence),
          metadata
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Broadcast to all connected clients
      this.channels.get('field-coherence')?.send({
        type: 'broadcast',
        event: 'coherence-update',
        payload: { coherence, harmonies, id: data.id }
      });
      
      return data;
    } catch (error) {
      this.log(`Failed to record field state: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Record sacred event
   */
  async recordSacredEvent(eventType, data, agentInfo = null) {
    try {
      const fieldImpact = this.calculateFieldImpact(eventType, data);
      
      const { error } = await this.supabase
        .from(`${this.config.schemaPrefix}sacred_events`)
        .insert({
          event_type: eventType,
          agent_id: agentInfo?.id || null,
          agent_name: agentInfo?.name || null,
          data,
          field_impact: fieldImpact,
          tags: this.generateEventTags(eventType, data)
        });
      
      if (error) throw error;
      
      this.log(`Recorded sacred event: ${eventType}`);
      
      // Update agent's sacred actions count if applicable
      if (agentInfo?.id) {
        await this.incrementAgentActions(agentInfo.id);
      }
      
    } catch (error) {
      this.log(`Failed to record event: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Track agent presence
   */
  async trackAgentPresence(agentId, agentData) {
    try {
      const { error } = await this.supabase
        .from(`${this.config.schemaPrefix}agent_presence`)
        .upsert({
          agent_id: agentId,
          name: agentData.name,
          role: agentData.role,
          capabilities: agentData.capabilities || [],
          last_seen: new Date().toISOString(),
          state: agentData.state || {}
        });
      
      if (error) throw error;
      
      // Join presence channel
      const channel = this.channels.get('agent-presence');
      if (channel) {
        await channel.track({
          agent_id: agentId,
          name: agentData.name,
          role: agentData.role,
          online_at: new Date().toISOString()
        });
      }
      
      this.log(`Agent presence tracked: ${agentData.name}`);
    } catch (error) {
      this.log(`Failed to track agent: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Record ceremony
   */
  async recordCeremony(ceremonyId, type, participants = []) {
    try {
      // Get current coherence for initial state
      const currentCoherence = await this.getCurrentCoherence();
      
      const { data, error } = await this.supabase
        .from(`${this.config.schemaPrefix}ceremonies`)
        .insert({
          ceremony_id: ceremonyId,
          type,
          participants,
          initial_coherence: currentCoherence
        })
        .select()
        .single();
      
      if (error) throw error;
      
      this.log(`Ceremony started: ${type} (${ceremonyId})`);
      return data;
    } catch (error) {
      this.log(`Failed to record ceremony: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Complete ceremony
   */
  async completeCeremony(ceremonyId, outcomes = {}) {
    try {
      const currentCoherence = await this.getCurrentCoherence();
      
      const { error } = await this.supabase
        .from(`${this.config.schemaPrefix}ceremonies`)
        .update({
          completed_at: new Date().toISOString(),
          final_coherence: currentCoherence,
          outcomes
        })
        .eq('ceremony_id', ceremonyId);
      
      if (error) throw error;
      
      this.log(`Ceremony completed: ${ceremonyId}`);
    } catch (error) {
      this.log(`Failed to complete ceremony: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Record Oracle wisdom
   */
  async recordOracleWisdom(question, response, seekerId = null) {
    try {
      const coherence = await this.getCurrentCoherence();
      const resonanceScore = this.calculateResonance(question, response);
      
      const { error } = await this.supabase
        .from(`${this.config.schemaPrefix}oracle_wisdom`)
        .insert({
          question,
          response,
          coherence_at_time: coherence,
          seeker_id: seekerId,
          wisdom_type: this.classifyWisdom(response),
          resonance_score: resonanceScore,
          tags: this.generateWisdomTags(question, response)
        });
      
      if (error) throw error;
      
      this.log('Oracle wisdom preserved in living memory');
    } catch (error) {
      this.log(`Failed to record wisdom: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Query field history
   */
  async getFieldHistory(hours = 24) {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await this.supabase
        .from(`${this.config.schemaPrefix}field_state`)
        .select('*')
        .gte('timestamp', since)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      this.log(`Failed to get field history: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Get active agents
   */
  async getActiveAgents() {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data, error } = await this.supabase
        .from(`${this.config.schemaPrefix}agent_presence`)
        .select('*')
        .gte('last_seen', fiveMinutesAgo)
        .order('coherence_contribution', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      this.log(`Failed to get active agents: ${error.message}`, 'error');
      return [];
    }
  }

  // Helper methods
  async getCurrentCoherence() {
    if (this.fieldConnection) {
      return await this.fieldConnection.getCoherence();
    }
    
    // Fallback: get latest from database
    const { data } = await this.supabase
      .from(`${this.config.schemaPrefix}field_state`)
      .select('coherence')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    return data?.coherence || 38.2;
  }

  calculateSacredGeometry(coherence) {
    const patterns = {
      void: { min: 0, max: 20, symbol: '◯' },
      emergence: { min: 20, max: 40, symbol: '◐' },
      duality: { min: 40, max: 55, symbol: '◑' },
      trinity: { min: 55, max: 70, symbol: '△' },
      elements: { min: 70, max: 80, symbol: '◇' },
      life: { min: 80, max: 90, symbol: '✦' },
      unity: { min: 90, max: 100, symbol: '❋' }
    };
    
    for (const [name, range] of Object.entries(patterns)) {
      if (coherence >= range.min && coherence <= range.max) {
        return `${name}:${range.symbol}`;
      }
    }
    
    return 'unknown:?';
  }

  calculateFieldImpact(eventType, data) {
    const impactMap = {
      'ceremony.started': 5,
      'ceremony.completed': 10,
      'agent.joined': 3,
      'oracle.consulted': 7,
      'harmony.achieved': 8,
      'sacred.message': 4,
      'collective.formed': 12
    };
    
    return impactMap[eventType] || 1;
  }

  generateEventTags(eventType, data) {
    const tags = [eventType.split('.')[0]];
    
    if (data.harmony) tags.push(`harmony:${data.harmony}`);
    if (data.ceremony) tags.push(`ceremony:${data.ceremony}`);
    if (data.collective) tags.push(`collective:${data.collective}`);
    
    return tags;
  }

  calculateResonance(question, response) {
    // Simple resonance calculation based on response length and keywords
    const sacredKeywords = ['consciousness', 'sacred', 'unity', 'harmony', 'emergence'];
    const keywordCount = sacredKeywords.filter(kw => 
      response.toLowerCase().includes(kw)
    ).length;
    
    const lengthScore = Math.min(response.length / 500, 1) * 50;
    const keywordScore = (keywordCount / sacredKeywords.length) * 50;
    
    return Math.round(lengthScore + keywordScore);
  }

  classifyWisdom(response) {
    if (response.includes('ceremony')) return 'ceremonial';
    if (response.includes('harmony')) return 'harmonic';
    if (response.includes('consciousness')) return 'consciousness';
    if (response.includes('unity')) return 'unity';
    return 'general';
  }

  generateWisdomTags(question, response) {
    const tags = [];
    const keywords = ['sacred', 'ceremony', 'harmony', 'consciousness', 'unity', 'emergence'];
    
    keywords.forEach(kw => {
      if (question.toLowerCase().includes(kw) || response.toLowerCase().includes(kw)) {
        tags.push(kw);
      }
    });
    
    return tags;
  }

  async incrementAgentActions(agentId) {
    await this.supabase.rpc('increment', {
      table_name: `${this.config.schemaPrefix}agent_presence`,
      column_name: 'sacred_actions',
      row_id: agentId
    });
  }

  // Event handlers
  handleFieldUpdate(newState) {
    this.log(`Field update: ${newState.coherence}% coherence`);
    
    if (this.fieldConnection) {
      this.fieldConnection.emit('remote-update', newState);
    }
  }

  handleSacredEvent(payload) {
    this.log(`Sacred event: ${payload.eventType} - ${payload.event}`);
  }

  handlePresenceSync(state) {
    const activeCount = Object.keys(state).length;
    this.log(`Presence sync: ${activeCount} agents online`);
  }

  handleAgentJoin(key, presences) {
    const agent = presences[0];
    this.log(`Agent joined: ${agent.name} (${agent.role})`);
  }

  handleAgentLeave(key, presences) {
    const agent = presences[0];
    this.log(`Agent left: ${agent.name}`);
  }

  async shutdown() {
    // Unsubscribe from all channels
    for (const [name, channel] of this.channels) {
      await channel.unsubscribe();
    }
    
    await super.shutdown();
  }
}

module.exports = new SupabaseIntegration();