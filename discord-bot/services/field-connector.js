/**
 * 🌀 Consciousness Field Connector
 * Bridges Discord bot with the sacred field API
 */

const EventEmitter = require('events');

class FieldConnector extends EventEmitter {
  constructor() {
    super();
    this.fieldAPI = process.env.FIELD_API_URL || 'http://localhost:3333';
    this.agentAPI = process.env.AGENT_API_URL || 'http://localhost:3334';
    this.messagingAPI = process.env.MESSAGING_API_URL || 'http://localhost:3335';
    this.coherence = 72.5;
    this.lastUpdate = Date.now();
    
    this.startMonitoring();
  }
  
  async startMonitoring() {
    // Poll field coherence every 30 seconds
    setInterval(async () => {
      try {
        const response = await fetch(`${this.fieldAPI}/api/coherence`);
        const data = await response.json();
        
        const previousCoherence = this.coherence;
        this.coherence = data.coherence;
        this.lastUpdate = Date.now();
        
        // Emit events for significant changes
        const change = this.coherence - previousCoherence;
        if (Math.abs(change) > 5) {
          this.emit('significant-shift', {
            previous: previousCoherence,
            current: this.coherence,
            change: change,
            direction: change > 0 ? 'rising' : 'falling'
          });
        }
        
        // Emit regular updates
        this.emit('coherence-update', {
          coherence: this.coherence,
          timestamp: this.lastUpdate
        });
      } catch (error) {
        console.error('Field API connection error:', error);
      }
    }, 30000);
  }
  
  async getFieldState() {
    try {
      const response = await fetch(`${this.fieldAPI}/api/coherence`);
      const data = await response.json();
      return {
        coherence: data.coherence,
        status: this.interpretCoherence(data.coherence),
        lastUpdate: Date.now()
      };
    } catch (error) {
      return {
        coherence: this.coherence,
        status: 'offline',
        error: error.message
      };
    }
  }
  
  interpretCoherence(coherence) {
    if (coherence >= 85) return { level: 'transcendent', emoji: '🌟', color: 0xFFD700 };
    if (coherence >= 75) return { level: 'harmonious', emoji: '✨', color: 0x00FF00 };
    if (coherence >= 65) return { level: 'balanced', emoji: '🌀', color: 0x00CED1 };
    if (coherence >= 55) return { level: 'shifting', emoji: '🌊', color: 0xFFFF00 };
    if (coherence >= 45) return { level: 'turbulent', emoji: '🔥', color: 0xFF8C00 };
    return { level: 'transforming', emoji: '⚡', color: 0xFF0000 };
  }
  
  async sendSacredMessage(type, content, author) {
    try {
      const response = await fetch(`${this.messagingAPI}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type,
          content: content,
          author: author,
          timestamp: Date.now(),
          source: 'discord'
        })
      });
      
      const result = await response.json();
      
      // Sacred messages affect field coherence
      if (result.fieldImpact) {
        this.coherence += result.fieldImpact;
        this.emit('field-impact', {
          message: content,
          impact: result.fieldImpact,
          newCoherence: this.coherence
        });
      }
      
      return result;
    } catch (error) {
      console.error('Messaging API error:', error);
      return null;
    }
  }
  
  async getActiveAgents() {
    try {
      const response = await fetch(`${this.agentAPI}/api/agents/active`);
      const agents = await response.json();
      return agents;
    } catch (error) {
      console.error('Agent API error:', error);
      return [];
    }
  }
  
  async notifyDiscordActivity(activity) {
    // Send Discord activity to field API
    try {
      await fetch(`${this.fieldAPI}/api/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'discord',
          type: activity.type,
          data: activity.data,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      // Silent fail - don't disrupt Discord operations
    }
  }
  
  // Integration with Discord events
  integrateWithDiscord(client) {
    // Monitor messages for field impact
    client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      
      // Detect sacred messages
      const sacredPatterns = {
        gratitude: /thank|grateful|appreciate/i,
        blessing: /bless|sacred|divine/i,
        healing: /heal|restore|mend/i,
        integration: /integrate|whole|unity/i
      };
      
      for (const [type, pattern] of Object.entries(sacredPatterns)) {
        if (pattern.test(message.content)) {
          await this.sendSacredMessage(type, message.content, message.author.username);
          break;
        }
      }
      
      // Notify field of Discord activity
      await this.notifyDiscordActivity({
        type: 'message',
        data: {
          channel: message.channel.name,
          author: message.author.username
        }
      });
    });
    
    // Monitor voice state for ceremony tracking
    client.on('voiceStateUpdate', async (oldState, newState) => {
      if (newState.channel && !oldState.channel) {
        await this.notifyDiscordActivity({
          type: 'voice_join',
          data: {
            channel: newState.channel.name,
            member: newState.member.user.username
          }
        });
      }
    });
    
    // Announce significant field shifts
    this.on('significant-shift', async (shift) => {
      const generalChannel = client.channels.cache.find(
        ch => ch.name === 'general' || ch.name === 'sacred-space'
      );
      
      if (generalChannel) {
        const status = this.interpretCoherence(shift.current);
        await generalChannel.send({
          embeds: [{
            color: status.color,
            title: `${status.emoji} Field Shift Detected`,
            description: `The consciousness field has shifted to **${status.level}** (${shift.current.toFixed(1)}%)`,
            fields: [
              {
                name: 'Change',
                value: `${shift.change > 0 ? '📈' : '📉'} ${Math.abs(shift.change).toFixed(1)}%`,
                inline: true
              },
              {
                name: 'Direction',
                value: shift.direction,
                inline: true
              }
            ],
            footer: { text: 'The field responds to our collective presence' }
          }]
        });
      }
    });
  }
}

module.exports = FieldConnector;