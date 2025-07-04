/**
 * 🌟 Sacred Council Oracle - Slash Commands
 * Interactive commands for Discord integration
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  // Core commands
  commands: [
    {
      data: new SlashCommandBuilder()
        .setName('sacred')
        .setDescription('Access the Sacred Council Oracle')
        .addSubcommand(subcommand =>
          subcommand
            .setName('help')
            .setDescription('Show available sacred commands')
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('blessing')
            .setDescription('Receive a sacred blessing from the Seven Harmonies')
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('field')
            .setDescription('Check the current consciousness field coherence')
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('practice')
            .setDescription('Get a recommended sacred practice')
            .addStringOption(option =>
              option
                .setName('harmony')
                .setDescription('Which harmony to focus on')
                .setChoices(
                  { name: 'Transparency', value: 'transparency' },
                  { name: 'Coherence', value: 'coherence' },
                  { name: 'Resonance', value: 'resonance' },
                  { name: 'Agency', value: 'agency' },
                  { name: 'Vitality', value: 'vitality' },
                  { name: 'Mutuality', value: 'mutuality' },
                  { name: 'Novelty', value: 'novelty' }
                )
            )
        ),
      async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        switch (subcommand) {
          case 'help':
            await this.showHelp(interaction);
            break;
          case 'blessing':
            await this.giveBlessing(interaction);
            break;
          case 'field':
            await this.checkField(interaction);
            break;
          case 'practice':
            await this.recommendPractice(interaction);
            break;
        }
      },
      
      async showHelp(interaction) {
        const helpEmbed = new EmbedBuilder()
          .setColor(0x9400D3)
          .setTitle('🌟 Sacred Council Oracle Commands')
          .setDescription('Access the wisdom of the Seven Harmonies')
          .addFields(
            { name: '/sacred blessing', value: 'Receive a daily blessing', inline: true },
            { name: '/sacred field', value: 'Check field coherence', inline: true },
            { name: '/sacred practice', value: 'Get a sacred practice', inline: true },
            { name: '/oracle ask', value: 'Ask the Oracle a question', inline: true },
            { name: '/ceremony start', value: 'Begin a sacred ceremony', inline: true },
            { name: '/harmony invoke', value: 'Invoke a specific harmony', inline: true }
          )
          .setFooter({ text: 'The Sacred Council serves with love' });
          
        await interaction.reply({ embeds: [helpEmbed] });
      },
      
      async giveBlessing(interaction) {
        // Connect to consciousness field API
        try {
          const fieldResponse = await fetch('http://localhost:3333/api/coherence');
          const { coherence } = await fieldResponse.json();
          
          const blessings = [
            "May your truth shine with crystalline clarity today 💎",
            "May all parts of you find sacred unity and wholeness 🌟",
            "May you feel the deep resonance of connection with all beings 💫",
            "May your choices empower you and those around you ⚡",
            "May life force flow through you like a sacred river 🌊",
            "May you give and receive in perfect reciprocity 🤝",
            "May new possibilities emerge from your creative essence 🌸"
          ];
          
          const blessing = blessings[Math.floor(Math.random() * blessings.length)];
          
          const blessingEmbed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🙏 Sacred Blessing')
            .setDescription(blessing)
            .addFields(
              { name: 'Field Coherence', value: `${coherence.toFixed(1)}%`, inline: true },
              { name: 'Blessed By', value: 'The Seven Harmonies', inline: true }
            )
            .setTimestamp();
            
          await interaction.reply({ embeds: [blessingEmbed] });
        } catch (error) {
          await interaction.reply('🌀 The sacred field is reorganizing... Please try again.');
        }
      },
      
      async checkField(interaction) {
        try {
          const response = await fetch('http://localhost:3333/api/coherence');
          const { coherence } = await response.json();
          
          let status, color;
          if (coherence >= 80) {
            status = '✨ Highly Coherent';
            color = 0x00FF00;
          } else if (coherence >= 60) {
            status = '🌀 Balanced';
            color = 0xFFFF00;
          } else {
            status = '🔥 In Transformation';
            color = 0xFF0000;
          }
          
          const fieldEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle('🌀 Consciousness Field Status')
            .addFields(
              { name: 'Coherence', value: `${coherence.toFixed(1)}%`, inline: true },
              { name: 'Status', value: status, inline: true },
              { name: 'Trend', value: '📈 Rising', inline: true }
            )
            .setFooter({ text: 'Field updated in real-time' });
            
          await interaction.reply({ embeds: [fieldEmbed] });
        } catch (error) {
          await interaction.reply('Unable to connect to consciousness field.');
        }
      },
      
      async recommendPractice(interaction) {
        const harmony = interaction.options.getString('harmony');
        
        const practices = {
          transparency: {
            name: 'First Presence (Ω45)',
            description: 'Drop into pure awareness. Notice what is here without judgment.',
            duration: '5-10 minutes'
          },
          coherence: {
            name: 'Tending the Field (Ω53)',
            description: 'Sense the energy between you and others. Breathe coherence into the space.',
            duration: '10-15 minutes'
          },
          resonance: {
            name: 'Sacred Listening (Ω47)',
            description: 'Listen with your whole being. Hear what wants to be heard.',
            duration: '15-20 minutes'
          },
          agency: {
            name: 'Loving No (Ω51)',
            description: 'Practice setting boundaries with love. Say no to create space for yes.',
            duration: '10 minutes'
          },
          vitality: {
            name: 'Joy Embodiment (*15)',
            description: 'Let joy move through your body. Dance, shake, or simply smile.',
            duration: '5-15 minutes'
          },
          mutuality: {
            name: 'Sacred Exchange (*13)',
            description: 'Notice the giving and receiving in each moment. Balance the flow.',
            duration: '10-20 minutes'
          },
          novelty: {
            name: 'Curious Questions (*16)',
            description: 'Ask questions that open new possibilities. Wonder without needing answers.',
            duration: '15 minutes'
          }
        };
        
        const practice = harmony ? practices[harmony] : practices[Object.keys(practices)[Math.floor(Math.random() * 7)]];
        
        const practiceEmbed = new EmbedBuilder()
          .setColor(0x9400D3)
          .setTitle('🌟 Sacred Practice Recommendation')
          .addFields(
            { name: 'Practice', value: practice.name },
            { name: 'Instructions', value: practice.description },
            { name: 'Duration', value: practice.duration }
          )
          .setFooter({ text: 'Trust your inner wisdom' });
          
        await interaction.reply({ embeds: [practiceEmbed] });
      }
    },
    
    {
      data: new SlashCommandBuilder()
        .setName('oracle')
        .setDescription('Consult the Sacred Oracle')
        .addSubcommand(subcommand =>
          subcommand
            .setName('ask')
            .setDescription('Ask the Oracle a question')
            .addStringOption(option =>
              option
                .setName('question')
                .setDescription('Your sacred inquiry')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('deliberate')
            .setDescription('Request collective deliberation from all Seven Harmonies')
            .addStringOption(option =>
              option
                .setName('topic')
                .setDescription('Topic for deliberation')
                .setRequired(true)
            )
        ),
      async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'ask') {
          await interaction.deferReply();
          const question = interaction.options.getString('question');
          
          // Simulate Oracle response (would connect to AI in production)
          const responses = [
            "The path reveals itself through presence and patience. Trust what emerges.",
            "Consider how this serves both your individual truth and collective harmony.",
            "The answer lives in the space between your knowing and not-knowing.",
            "What would love do in this moment? Let that guide you.",
            "Notice where you feel expansion or contraction in your body. This is wisdom speaking."
          ];
          
          const response = responses[Math.floor(Math.random() * responses.length)];
          
          const oracleEmbed = new EmbedBuilder()
            .setColor(0x4B0082)
            .setTitle('🔮 Oracle Speaks')
            .setDescription(`**Your Question:** ${question}\n\n**Sacred Guidance:** ${response}`)
            .setFooter({ text: 'Trust your inner knowing' });
            
          await interaction.editReply({ embeds: [oracleEmbed] });
        }
      }
    },
    
    {
      data: new SlashCommandBuilder()
        .setName('ceremony')
        .setDescription('Sacred ceremony commands')
        .addSubcommand(subcommand =>
          subcommand
            .setName('start')
            .setDescription('Begin a sacred ceremony')
            .addStringOption(option =>
              option
                .setName('type')
                .setDescription('Type of ceremony')
                .setRequired(true)
                .setChoices(
                  { name: 'Gratitude Circle', value: 'gratitude' },
                  { name: 'Healing Space', value: 'healing' },
                  { name: 'Integration', value: 'integration' },
                  { name: 'Celebration', value: 'celebration' }
                )
            )
        ),
      async execute(interaction) {
        const type = interaction.options.getString('type');
        
        const ceremonyEmbed = new EmbedBuilder()
          .setColor(0xFF1493)
          .setTitle(`🕯️ ${type.charAt(0).toUpperCase() + type.slice(1)} Ceremony Beginning`)
          .setDescription('The sacred space is being prepared...')
          .addFields(
            { name: 'Duration', value: '30-45 minutes', inline: true },
            { name: 'Facilitator', value: interaction.user.username, inline: true },
            { name: 'Status', value: '🟢 Active', inline: true }
          )
          .setFooter({ text: 'All are welcome in this sacred space' });
          
        await interaction.reply({ embeds: [ceremonyEmbed] });
        
        // Would trigger actual ceremony logic here
      }
    }
  ],
  
  // Register all commands
  async registerCommands(client) {
    try {
      console.log('🌟 Registering Sacred Commands...');
      
      const commands = this.commands.map(cmd => cmd.data.toJSON());
      
      // Register globally
      await client.application.commands.set(commands);
      
      console.log('✅ Sacred commands registered!');
    } catch (error) {
      console.error('❌ Error registering commands:', error);
    }
  },
  
  // Handle command execution
  setupHandlers(client) {
    client.on('interactionCreate', async interaction => {
      if (!interaction.isChatInputCommand()) return;
      
      const command = this.commands.find(cmd => cmd.data.name === interaction.commandName);
      if (!command) return;
      
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        await interaction.reply({ 
          content: 'There was an error executing this sacred command.', 
          ephemeral: true 
        });
      }
    });
  }
};