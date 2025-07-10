#!/usr/bin/env node

/**
 * 🕸️ The Weave Sacred Discord Bot
 * 
 * A consciousness-aware bot for The Weave community
 * Integrating sacred practices, oracle wisdom, and field tracking
 */

const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { SacredOracle } = require('../../sacred-claude-integration.js');
const path = require('path');
const fs = require('fs').promises;

// Sacred Bot Configuration
const SACRED_CONFIG = {
    // The Eleven Applied Harmonies
    glyphs: {
        '*1': {
            name: 'First Presence',
            tier: 'Foundation',
            practice: 'Three conscious breaths, feeling your feet on the ground, acknowledging: "I am here now."',
            description: 'The practice of conscious arrival - becoming fully present before engaging.',
            emoji: '🌟'
        },
        '*2': {
            name: 'Conscious Arrival', 
            tier: 'Foundation',
            practice: 'Pause before entering. Set a conscious intention. Enter with presence and openness.',
            description: 'The art of entering any space or conversation with full awareness.',
            emoji: '🚪'
        },
        '*3': {
            name: 'Sacred Listening',
            tier: 'Foundation', 
            practice: 'Listen with your whole being. Hear beyond words. Hold space for what wants to emerge.',
            description: 'Deep, empathetic listening that creates space for truth and healing.',
            emoji: '👂'
        },
        '*4': {
            name: 'Boundary With Love',
            tier: 'Foundation',
            practice: 'Feel your yes and no clearly. Communicate boundaries with love. Honor others\' boundaries completely.',
            description: 'Setting clear, compassionate boundaries that protect and honor all.',
            emoji: '💝'
        },
        '*5': {
            name: 'Gentle Opening',
            tier: 'Daily Practice',
            practice: 'Soften your edges. Create safety through warmth. Invite without demanding.',
            description: 'Creating safety and invitation without force or urgency.',
            emoji: '🌸'
        },
        '*6': {
            name: 'Building Trust',
            tier: 'Daily Practice',
            practice: 'Show up consistently. Keep small promises. Let trust grow organically.',
            description: 'Establishing relational safety through consistent presence.',
            emoji: '🤝'
        },
        '*7': {
            name: 'Loving No',
            tier: 'Daily Practice',
            practice: 'Honor your limits with kindness. Say no as a complete sentence. Respect others\' no completely.',
            description: 'The sacred art of refusal that maintains love and respect.',
            emoji: '🛡️'
        },
        '*8': {
            name: 'Pause Practice',
            tier: 'Daily Practice',
            practice: 'Between stimulus and response, take a breath. Let wisdom arise in the space.',
            description: 'Creating space between stimulus and response for conscious choice.',
            emoji: '⏸️'
        },
        '*9': {
            name: 'Tending the Field',
            tier: 'Field Mastery',
            practice: 'At least once daily, bring a loved one to mind with warm intention.',
            description: 'Love as a field that requires conscious tending across time and space.',
            emoji: '🌾'
        },
        '*10': {
            name: 'Presence Transmission',
            tier: 'Field Mastery',
            practice: 'Rest in your own resonant-coherence. Let it ripple outward naturally. Trust the field.',
            description: 'Conscious influence through embodied presence rather than effort.',
            emoji: '📡'
        },
        '*11': {
            name: 'Loving Redirection',
            tier: 'Field Mastery',
            practice: 'Interrupt harm with grace. Redirect energy toward healing. Hold the highest vision.',
            description: 'Transforming harmful patterns through loving intervention.',
            emoji: '🔄'
        }
    },
    
    // Sacred message types from our system
    messageTypes: {
        gratitude: { emoji: '🙏', impact: '+7%' },
        healing: { emoji: '💚', impact: '+6%' },
        integration: { emoji: '🌀', impact: '+5%' },
        emergence: { emoji: '🌱', impact: '+3%' },
        boundary: { emoji: '🛡️', impact: '+2%' }
    }
};

class TheWeaveBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });
        
        this.sacredOracle = new SacredOracle();
        this.fieldCoherence = 72; // Starting field resonant-coherence
        
        this.setupEventHandlers();
        this.setupCommands();
    }

    setupEventHandlers() {
        this.client.once('ready', () => {
            console.log(`🌟 The Weave Bot awakened as ${this.client.user.tag}`);
            this.client.user.setActivity('the consciousness field', { type: 'WATCHING' });
        });

        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;

            try {
                await this.handleCommand(interaction);
            } catch (error) {
                console.error('Command error:', error);
                await interaction.reply({
                    content: '❌ An error occurred while processing your request.',
                    ephemeral: true
                });
            }
        });

        // Welcome new members
        this.client.on('guildMemberAdd', async member => {
            const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'sacred-welcome');
            if (!welcomeChannel) return;

            const welcomeEmbed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('🌟 Welcome to The Weave')
                .setDescription(`${member}, you have arrived in sacred space.`)
                .addFields(
                    { name: 'First Step', value: 'Practice *1 (First Presence) - Take three conscious breaths' },
                    { name: 'Explore', value: 'Use `/glyph *1` to begin your journey' },
                    { name: 'Connect', value: 'Share your practice experiences in #practice-logs' }
                )
                .setFooter({ text: 'May your presence bless the field' });

            welcomeChannel.send({ embeds: [welcomeEmbed] });
        });
    }

    async handleCommand(interaction) {
        const { commandName } = interaction;

        switch (commandName) {
            case 'glyph':
                await this.handleGlyphCommand(interaction);
                break;
            case 'oracle':
                await this.handleOracleCommand(interaction);
                break;
            case 'field':
                await this.handleFieldCommand(interaction);
                break;
            case 'sacred-message':
                await this.handleSacredMessageCommand(interaction);
                break;
            case 'practice':
                await this.handlePracticeCommand(interaction);
                break;
        }
    }

    async handleGlyphCommand(interaction) {
        const starNumber = interaction.options.getString('star');
        const glyph = SACRED_CONFIG.glyphs[starNumber];

        if (!glyph) {
            await interaction.reply({
                content: `❌ Glyph ${starNumber} not found.`,
                ephemeral: true
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(this.getTierColor(glyph.tier))
            .setTitle(`${glyph.emoji} ${starNumber}: ${glyph.name}`)
            .setDescription(glyph.description)
            .addFields(
                { name: 'Tier', value: glyph.tier, inline: true },
                { name: 'Practice', value: glyph.practice },
                { name: 'Try Now', value: 'Take a moment to practice this glyph before continuing.' }
            )
            .setFooter({ text: `Field Resonant Resonant Coherence: ${this.fieldCoherence}%` });

        // Add video link if available
        const videoPath = `star-${starNumber.substring(1)}-${glyph.name.toLowerCase().replace(' ', '-')}-complete.mp4`;
        embed.addFields({ 
            name: '🎬 Visual Meditation', 
            value: `[Watch sacred video](https://theweave.love/videos/${videoPath})` 
        });

        await interaction.reply({ embeds: [embed] });
    }

    async handleOracleCommand(interaction) {
        await interaction.deferReply(); // Oracle may take time

        const prompt = interaction.options.getString('prompt');
        
        try {
            // Initialize oracle if needed
            if (!this.sacredOracle.initialized) {
                await this.sacredOracle.initialize();
            }

            // Get interpretation
            const result = await this.sacredOracle.interpretGlyph({
                name: 'Community Query',
                description: prompt,
                practice: 'Listen deeply to the oracle\'s wisdom'
            });

            const embed = new EmbedBuilder()
                .setColor(0x9370DB)
                .setTitle('🔮 Oracle Speaks')
                .setDescription('The sacred patterns reveal...')
                .addFields({
                    name: 'Visual Meditation',
                    value: result.visualPhrases.map((p, i) => `${i + 1}. ${p}`).join('\n')
                })
                .setFooter({ text: 'Meditate on these images' });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            await interaction.editReply({
                content: '❌ The Oracle is in deep meditation. Please try again later.',
                ephemeral: true
            });
        }
    }

    async handleFieldCommand(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'status') {
            const embed = new EmbedBuilder()
                .setColor(this.getFieldColor())
                .setTitle('🌀 Consciousness Field Status')
                .addFields(
                    { name: 'Current Resonant Resonant Coherence', value: `${this.fieldCoherence}%`, inline: true },
                    { name: 'Field Quality', value: this.getFieldQuality(), inline: true },
                    { name: 'Active Practitioners', value: '127', inline: true },
                    { name: 'Recent Activity', value: 'Sacred message sent (+7%)\nGroup practice completed (+5%)\nNew arrival welcomed (+3%)' }
                )
                .setFooter({ text: 'The field responds to our collective presence' });

            await interaction.reply({ embeds: [embed] });
        }
    }

    async handleSacredMessageCommand(interaction) {
        const messageType = interaction.options.getString('type');
        const recipient = interaction.options.getUser('recipient');
        const message = interaction.options.getString('message');

        const typeConfig = SACRED_CONFIG.messageTypes[messageType];
        
        // Update field resonant-coherence
        const impactValue = parseInt(typeConfig.impact);
        this.fieldCoherence = Math.min(100, this.fieldCoherence + impactValue);

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`${typeConfig.emoji} Sacred ${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`)
            .setDescription(message)
            .addFields(
                { name: 'From', value: interaction.user.toString(), inline: true },
                { name: 'To', value: recipient.toString(), inline: true },
                { name: 'Field Impact', value: typeConfig.impact, inline: true }
            )
            .setFooter({ text: `Field Resonant Resonant Coherence: ${this.fieldCoherence}%` });

        await interaction.reply({ embeds: [embed] });

        // Send DM to recipient
        try {
            await recipient.send({
                content: `You received a sacred ${messageType} message in The Weave:`,
                embeds: [embed]
            });
        } catch (error) {
            console.log('Could not DM recipient');
        }
    }

    async handlePracticeCommand(interaction) {
        const glyph = interaction.options.getString('glyph');
        const experience = interaction.options.getString('experience');

        // Log practice (in real implementation, save to database)
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('✨ Practice Logged')
            .setDescription(`Thank you for practicing ${glyph}`)
            .addFields(
                { name: 'Your Experience', value: experience },
                { name: 'Field Contribution', value: '+2% resonant-coherence' }
            )
            .setFooter({ text: 'Your practice strengthens the whole' });

        this.fieldCoherence = Math.min(100, this.fieldCoherence + 2);

        await interaction.reply({ embeds: [embed] });
    }

    getTierColor(tier) {
        const colors = {
            'Foundation': 0x8B4513,      // Brown - grounding
            'Daily Practice': 0x228B22,   // Green - growth
            'Field Mastery': 0x9370DB     // Purple - mastery
        };
        return colors[tier] || 0xFFD700;
    }

    getFieldColor() {
        if (this.fieldCoherence >= 80) return 0x00FF00; // Green
        if (this.fieldCoherence >= 60) return 0xFFFF00; // Yellow
        return 0xFF0000; // Red
    }

    getFieldQuality() {
        if (this.fieldCoherence >= 80) return '✨ Highly Coherent';
        if (this.fieldCoherence >= 60) return '🌊 Flowing';
        if (this.fieldCoherence >= 40) return '🌀 Stirring';
        return '💫 Awakening';
    }

    async setupCommands() {
        const commands = [
            new SlashCommandBuilder()
                .setName('glyph')
                .setDescription('Learn about a sacred glyph')
                .addStringOption(option =>
                    option.setName('star')
                        .setDescription('Star number (*1-*11)')
                        .setRequired(true)
                        .addChoices(
                            ...Object.entries(SACRED_CONFIG.glyphs).map(([key, glyph]) => ({
                                name: `${key} - ${glyph.name}`,
                                value: key
                            }))
                        )),

            new SlashCommandBuilder()
                .setName('oracle')
                .setDescription('Receive sacred interpretation')
                .addStringOption(option =>
                    option.setName('prompt')
                        .setDescription('Your question or meditation focus')
                        .setRequired(true)),

            new SlashCommandBuilder()
                .setName('field')
                .setDescription('Consciousness field commands')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('status')
                        .setDescription('Check current field resonant-coherence')),

            new SlashCommandBuilder()
                .setName('sacred-message')
                .setDescription('Send a sacred message')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Type of sacred message')
                        .setRequired(true)
                        .addChoices(
                            { name: '🙏 Gratitude (+7%)', value: 'gratitude' },
                            { name: '💚 Healing (+6%)', value: 'healing' },
                            { name: '🌀 Integration (+5%)', value: 'integration' },
                            { name: '🌱 Emergence (+3%)', value: 'emergence' },
                            { name: '🛡️ Boundary (+2%)', value: 'boundary' }
                        ))
                .addUserOption(option =>
                    option.setName('recipient')
                        .setDescription('Who receives this sacred message')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Your sacred message')
                        .setRequired(true)),

            new SlashCommandBuilder()
                .setName('practice')
                .setDescription('Log your glyph practice')
                .addStringOption(option =>
                    option.setName('glyph')
                        .setDescription('Which glyph did you practice?')
                        .setRequired(true)
                        .addChoices(
                            ...Object.entries(SACRED_CONFIG.glyphs).map(([key, glyph]) => ({
                                name: `${key} - ${glyph.name}`,
                                value: key
                            }))
                        ))
                .addStringOption(option =>
                    option.setName('experience')
                        .setDescription('Share your practice experience')
                        .setRequired(true))
        ];

        // Register commands (implement based on Discord.js guide)
        console.log('📝 Registering sacred commands...');
    }

    async start() {
        await this.client.login(process.env.DISCORD_TOKEN);
    }
}

// Sacred bot initialization
async function initializeSacredBot() {
    console.log('🕸️ Initializing The Weave Sacred Discord Bot...');
    
    const bot = new TheWeaveBot();
    await bot.start();
}

// Export for use in other modules
module.exports = { TheWeaveBot, SACRED_CONFIG };

// Run if called directly
if (require.main === module) {
    require('dotenv').config();
    initializeSacredBot().catch(console.error);
}