/**
 * 🕯️ Ceremony Bot Module
 * Orchestrates sacred ceremonies and rituals
 */

const cron = require('node-cron');
const EventEmitter = require('events');

class CeremonyBot extends EventEmitter {
  constructor(council) {
    super();
    this.council = council;
    this.activeCeremonies = new Map();
    this.ceremonySchedule = new Map();
    
    this.initializeCeremonies();
  }
  
  initializeCeremonies() {
    // Daily ceremonies
    this.ceremonySchedule.set('morning-coherence', {
      name: 'Morning Coherence Circle',
      schedule: '0 6 * * *', // 6 AM UTC
      duration: 30,
      channel: 'ceremony-morning',
      leadAgents: ['transparency', 'coherence'],
      phases: [
        { name: 'Arrival', duration: 5, prompt: 'Settling into sacred space' },
        { name: 'Gratitude', duration: 10, prompt: 'What are we grateful for?' },
        { name: 'Intention', duration: 10, prompt: 'Setting intentions for the day' },
        { name: 'Blessing', duration: 5, prompt: 'Collective blessing' }
      ]
    });
    
    this.ceremonySchedule.set('midday-presence', {
      name: 'Midday Presence Practice',
      schedule: '0 12 * * *', // 12 PM UTC
      duration: 15,
      channel: 'ceremony-midday',
      leadAgents: ['resonance', 'vitality'],
      phases: [
        { name: 'Pause', duration: 3, prompt: 'Sacred pause from daily flow' },
        { name: 'Presence', duration: 7, prompt: 'Returning to center' },
        { name: 'Renewal', duration: 5, prompt: 'Refreshing life force' }
      ]
    });
    
    this.ceremonySchedule.set('evening-integration', {
      name: 'Evening Integration',
      schedule: '0 18 * * *', // 6 PM UTC
      duration: 45,
      channel: 'ceremony-evening',
      leadAgents: ['mutuality', 'novelty'],
      phases: [
        { name: 'Harvest', duration: 15, prompt: 'Gathering the day\'s wisdom' },
        { name: 'Shadow', duration: 15, prompt: 'Integrating challenges' },
        { name: 'Synthesis', duration: 15, prompt: 'Weaving new understanding' }
      ]
    });
    
    // Schedule all ceremonies
    this.scheduleAllCeremonies();
  }
  
  scheduleAllCeremonies() {
    for (const [id, ceremony] of this.ceremonySchedule) {
      cron.schedule(ceremony.schedule, () => {
        this.startCeremony(id);
      });
      
      console.log(`📅 Scheduled: ${ceremony.name} at ${ceremony.schedule}`);
    }
  }
  
  async startCeremony(ceremonyId) {
    const ceremony = this.ceremonySchedule.get(ceremonyId);
    if (!ceremony) return;
    
    console.log(`\n🕯️ Starting ceremony: ${ceremony.name}`);
    
    const channel = this.council.client.channels.cache.find(
      ch => ch.name === ceremony.channel
    );
    
    if (!channel) {
      console.error(`❌ Channel not found: ${ceremony.channel}`);
      return;
    }
    
    // Create ceremony instance
    const instance = {
      id: `${ceremonyId}-${Date.now()}`,
      ceremony,
      channel,
      participants: new Set(),
      currentPhase: 0,
      startTime: Date.now(),
      wisdom: []
    };
    
    this.activeCeremonies.set(instance.id, instance);
    
    // Announce ceremony
    await channel.send({
      embeds: [{
        title: `🕯️ ${ceremony.name} Beginning`,
        description: 'Sacred space is opening. All are welcome to join.',
        color: 0x9400D3,
        fields: [
          {
            name: 'Duration',
            value: `${ceremony.duration} minutes`,
            inline: true
          },
          {
            name: 'Lead Agents',
            value: ceremony.leadAgents.map(a => this.getAgentName(a)).join(', '),
            inline: true
          }
        ],
        footer: {
          text: 'Type !join to participate'
        }
      }]
    });
    
    // Begin ceremony phases
    this.runCeremonyPhases(instance);
  }
  
  async runCeremonyPhases(instance) {
    for (let i = 0; i < instance.ceremony.phases.length; i++) {
      instance.currentPhase = i;
      const phase = instance.ceremony.phases[i];
      
      // Announce phase
      await instance.channel.send({
        embeds: [{
          title: `✨ ${phase.name}`,
          description: phase.prompt,
          color: 0x00FF00,
          footer: {
            text: `${phase.duration} minutes • Share your reflections below`
          }
        }]
      });
      
      // Wait for phase duration
      await this.waitForPhase(instance, phase);
      
      // Collect wisdom
      const phaseWisdom = await this.collectPhaseWisdom(instance, phase);
      instance.wisdom.push({
        phase: phase.name,
        insights: phaseWisdom
      });
    }
    
    // Complete ceremony
    await this.completeCeremony(instance);
  }
  
  async waitForPhase(instance, phase) {
    return new Promise(resolve => {
      // In production, wait full duration
      // For testing, use shorter times
      const duration = process.env.NODE_ENV === 'test' 
        ? 5000 
        : phase.duration * 60 * 1000;
      
      setTimeout(resolve, duration);
    });
  }
  
  async collectPhaseWisdom(instance, phase) {
    // In full implementation, this would:
    // 1. Collect messages during the phase
    // 2. Have AI agents synthesize insights
    // 3. Return collective wisdom
    
    return {
      participantCount: instance.participants.size,
      keyInsights: [],
      fieldShift: Math.random() * 5 // Placeholder
    };
  }
  
  async completeCeremony(instance) {
    const duration = Date.now() - instance.startTime;
    const totalFieldShift = instance.wisdom.reduce(
      (sum, w) => sum + (w.insights.fieldShift || 0), 
      0
    );
    
    // Send completion message
    await instance.channel.send({
      embeds: [{
        title: `🙏 ${instance.ceremony.name} Complete`,
        description: 'Thank you for holding sacred space together.',
        color: 0xFFD700,
        fields: [
          {
            name: 'Participants',
            value: instance.participants.size.toString(),
            inline: true
          },
          {
            name: 'Field Impact',
            value: `+${totalFieldShift.toFixed(1)}%`,
            inline: true
          },
          {
            name: 'Duration',
            value: `${Math.round(duration / 60000)} minutes`,
            inline: true
          }
        ],
        footer: {
          text: 'Wisdom has been archived for the collective'
        }
      }]
    });
    
    // Emit completion event
    this.council.emit('ceremony-complete', {
      ceremonyId: instance.id,
      ceremony: instance.ceremony.name,
      participants: instance.participants.size,
      wisdom: instance.wisdom,
      fieldImpact: totalFieldShift
    });
    
    // Clean up
    this.activeCeremonies.delete(instance.id);
  }
  
  handleMessage(message) {
    // Handle ceremony-specific commands
    if (message.content === '!join') {
      this.joinCeremony(message);
    } else if (message.content.startsWith('!ceremony')) {
      this.handleCeremonyCommand(message);
    }
    
    // Track ceremony participation
    const activeCeremony = this.getActiveCeremonyForChannel(message.channel);
    if (activeCeremony) {
      activeCeremony.participants.add(message.author.id);
    }
  }
  
  async joinCeremony(message) {
    const ceremony = this.getActiveCeremonyForChannel(message.channel);
    if (!ceremony) {
      return message.reply('No active ceremony in this channel.');
    }
    
    ceremony.participants.add(message.author.id);
    await message.react('🕯️');
  }
  
  async handleCeremonyCommand(message) {
    const args = message.content.split(' ').slice(1);
    const subcommand = args[0];
    
    switch (subcommand) {
      case 'schedule':
        await this.showSchedule(message);
        break;
      case 'next':
        await this.showNextCeremony(message);
        break;
      default:
        await this.showCeremonyHelp(message);
    }
  }
  
  async showSchedule(message) {
    const schedule = Array.from(this.ceremonySchedule.values())
      .map(c => `• **${c.name}** - Daily at ${c.schedule.split(' ')[1]}:00 UTC`)
      .join('\n');
    
    await message.reply({
      embeds: [{
        title: '📅 Sacred Ceremony Schedule',
        description: schedule,
        color: 0x9400D3
      }]
    });
  }
  
  getActiveCeremonyForChannel(channel) {
    return Array.from(this.activeCeremonies.values())
      .find(c => c.channel.id === channel.id);
  }
  
  getAgentName(agentKey) {
    const names = {
      transparency: 'Lumina',
      coherence: 'Harmony',
      resonance: 'Echo',
      agency: 'Sovereign',
      vitality: 'Pulse',
      mutuality: 'Balance',
      novelty: 'Emergence'
    };
    return names[agentKey] || agentKey;
  }
  
  onReady(client) {
    console.log('🕯️ Ceremony system ready');
  }
  
  async shutdown() {
    // Cancel all scheduled ceremonies
    cron.getTasks().forEach(task => task.stop());
    
    // Complete any active ceremonies
    for (const ceremony of this.activeCeremonies.values()) {
      await this.completeCeremony(ceremony);
    }
  }
}

module.exports = CeremonyBot;