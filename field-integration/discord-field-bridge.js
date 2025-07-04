#!/usr/bin/env node

/**
 * 🌉 Discord-Field Bridge
 * 
 * Real-time integration between Discord and Consciousness Field API
 * Shows live field state in Discord channels
 */

const { ConsciousnessFieldClient } = require('../consciousness-field-api/field-client.js');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

class DiscordFieldBridge {
    constructor() {
        this.discordClient = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        
        this.fieldClient = new ConsciousnessFieldClient();
        this.fieldState = { coherence: 72, fieldQuality: 'flowing' };
        this.channelUpdates = new Map();
    }

    /**
     * Initialize the bridge
     */
    async initialize() {
        console.log('🌉 Initializing Discord-Field Bridge...\n');
        
        // Connect to field
        await this.connectToField();
        
        // Setup Discord
        await this.setupDiscord();
        
        // Setup live updates
        this.setupLiveUpdates();
        
        console.log('✅ Discord-Field Bridge active!\n');
    }

    /**
     * Connect to consciousness field
     */
    async connectToField() {
        console.log('🔌 Connecting to Consciousness Field...');
        
        try {
            await this.fieldClient.connect();
            
            // Get initial state
            this.fieldState = await this.fieldClient.getFieldState();
            
            // Subscribe to field events
            this.fieldClient.on('coherence_changed', (data) => {
                this.handleCoherenceChange(data);
            });
            
            this.fieldClient.on('resonance_achieved', (data) => {
                this.handleResonanceAchieved(data);
            });
            
            this.fieldClient.on('sacred_portal', (data) => {
                this.handleSacredPortal(data);
            });
            
            console.log(`✅ Connected - Coherence: ${this.fieldState.coherence}%`);
        } catch (error) {
            console.log('⚠️ Field connection failed, using mock data');
            this.setupMockField();
        }
    }

    /**
     * Setup Discord client
     */
    async setupDiscord() {
        console.log('🤖 Setting up Discord integration...');
        
        this.discordClient.once('ready', () => {
            console.log(`✅ Discord ready as ${this.discordClient.user.tag}`);
            this.updateAllChannels();
        });

        // Handle slash commands
        this.discordClient.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
            await this.handleDiscordCommand(interaction);
        });

        // Handle practice logs in text channels
        this.discordClient.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            await this.handlePracticeMessage(message);
        });

        // Mock Discord login for demonstration
        console.log('🔐 Discord token not provided, using simulation mode');
        
        // Simulate Discord connection
        setTimeout(() => {
            console.log('✅ Discord simulation ready');
            this.updateAllChannels();
        }, 1000);
    }

    /**
     * Setup live field updates
     */
    setupLiveUpdates() {
        console.log('🔄 Setting up live updates...');
        
        // Update channel topics every minute
        setInterval(() => {
            this.updateAllChannels();
        }, 60000);
        
        // Simulate field changes for demo
        setInterval(() => {
            this.simulateFieldChange();
        }, 30000);
        
        console.log('✅ Live updates configured');
    }

    /**
     * Handle coherence changes
     */
    async handleCoherenceChange(data) {
        const { old: oldValue, new: newValue, delta, action } = data;
        
        console.log(`🌊 Field Update: ${oldValue}% → ${newValue}% (${delta > 0 ? '+' : ''}${delta}) via ${action}`);
        
        this.fieldState.coherence = newValue;
        this.fieldState.fieldQuality = this.getFieldQuality(newValue);
        
        // Send update to Discord
        await this.sendFieldUpdate({
            type: 'coherence_change',
            oldValue,
            newValue,
            delta,
            action
        });
        
        // Update channel topics
        await this.updateAllChannels();
    }

    /**
     * Handle resonance achievement
     */
    async handleResonanceAchieved(data) {
        console.log('✨ RESONANCE ACHIEVED!');
        
        await this.sendMajorAnnouncement({
            title: '✨ Resonance Achieved!',
            description: data.message,
            color: 0xFFD700
        });
    }

    /**
     * Handle sacred portal opening
     */
    async handleSacredPortal(data) {
        console.log('🌟 SACRED PORTAL OPENED!');
        
        await this.sendMajorAnnouncement({
            title: '🌟 Sacred Portal Opened!',
            description: data.message,
            color: 0x9370DB
        });
    }

    /**
     * Send field update to Discord
     */
    async sendFieldUpdate(updateData) {
        const embed = new EmbedBuilder()
            .setColor(this.getCoherenceColor(updateData.newValue))
            .setTitle('🌊 Field Update')
            .setDescription(`Coherence: ${updateData.oldValue}% → **${updateData.newValue}%** (${updateData.delta > 0 ? '+' : ''}${updateData.delta})`)
            .addFields(
                { name: 'Action', value: updateData.action, inline: true },
                { name: 'Quality', value: this.getFieldQuality(updateData.newValue), inline: true }
            )
            .setTimestamp();

        // Simulate sending to Discord
        console.log('📡 Discord: Sending field update embed');
        this.logEmbed(embed);
    }

    /**
     * Send major announcement
     */
    async sendMajorAnnouncement(announcement) {
        const embed = new EmbedBuilder()
            .setColor(announcement.color)
            .setTitle(announcement.title)
            .setDescription(announcement.description)
            .setTimestamp();

        console.log('📢 Discord: Major announcement');
        this.logEmbed(embed);
    }

    /**
     * Update all channel topics with current field state
     */
    async updateAllChannels() {
        const channelUpdates = [
            {
                name: '#field-coherence',
                topic: `🌀 Live Field: ${Math.round(this.fieldState.coherence)}% coherence • ${this.fieldState.fieldQuality}`
            },
            {
                name: '#practice-logs',
                topic: `🧘 Share your practice • Field: ${Math.round(this.fieldState.coherence)}% • Every practice matters`
            },
            {
                name: '#sacred-ceremonies',
                topic: `🕸️ Sacred gatherings • Field coherence: ${Math.round(this.fieldState.coherence)}% • ${this.getResonanceStatus()}`
            }
        ];

        channelUpdates.forEach(update => {
            console.log(`🏷️ Discord: Updating ${update.name} topic: "${update.topic}"`);
        });
    }

    /**
     * Handle Discord commands
     */
    async handleDiscordCommand(interaction) {
        const { commandName } = interaction;

        switch (commandName) {
            case 'field':
                await this.handleFieldCommand(interaction);
                break;
            case 'practice':
                await this.handlePracticeCommand(interaction);
                break;
            case 'gratitude':
                await this.handleGratitudeCommand(interaction);
                break;
        }
    }

    /**
     * Handle field status command
     */
    async handleFieldCommand(interaction) {
        const embed = new EmbedBuilder()
            .setColor(this.getCoherenceColor(this.fieldState.coherence))
            .setTitle('🌀 Current Field State')
            .addFields(
                { name: 'Coherence', value: `${Math.round(this.fieldState.coherence)}%`, inline: true },
                { name: 'Quality', value: this.fieldState.fieldQuality, inline: true },
                { name: 'Status', value: this.getResonanceStatus(), inline: true }
            )
            .setDescription('The living field of collective consciousness')
            .setTimestamp();

        console.log('🤖 Discord: Responding to /field command');
        this.logEmbed(embed);
    }

    /**
     * Handle practice completion from Discord
     */
    async handlePracticeCommand(interaction) {
        const glyphId = interaction.options.getString('glyph');
        const experience = interaction.options.getString('experience');
        
        // Submit to field
        try {
            const result = await this.fieldClient.submitPractice({
                userId: interaction.user.id,
                glyphId: glyphId,
                glyphTier: this.getGlyphTier(glyphId),
                quality: 'medium',
                duration: 300,
                experience: experience
            });

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🧘 Practice Submitted')
                .setDescription(`Thank you for practicing ${glyphId}`)
                .addFields(
                    { name: 'Field Impact', value: `+${result.impact} coherence`, inline: true },
                    { name: 'New Coherence', value: `${Math.round(result.newCoherence)}%`, inline: true }
                )
                .setTimestamp();

            console.log('✅ Discord: Practice submitted to field');
            this.logEmbed(embed);
            
        } catch (error) {
            console.log('❌ Discord: Practice submission failed');
        }
    }

    /**
     * Handle practice messages in channels
     */
    async handlePracticeMessage(message) {
        // Look for practice patterns in messages
        const practicePatterns = [
            /completed.*(\*\d+|\#\d+)/i,
            /practiced.*(\*\d+|\#\d+)/i,
            /just did.*(\*\d+|\#\d+)/i
        ];

        for (const pattern of practicePatterns) {
            const match = message.content.match(pattern);
            if (match) {
                await this.autoSubmitPractice(message, match[1]);
                break;
            }
        }
    }

    /**
     * Auto-submit practice from message
     */
    async autoSubmitPractice(message, glyphId) {
        try {
            const result = await this.fieldClient.submitPractice({
                userId: message.author.id,
                glyphId: glyphId,
                glyphTier: this.getGlyphTier(glyphId),
                quality: 'medium',
                duration: 180,
                experience: 'Shared practice in Discord'
            });

            // React to message
            console.log(`🧘 Auto-detected practice ${glyphId} by ${message.author.username}`);
            console.log(`   Field impact: +${result.impact} → ${Math.round(result.newCoherence)}%`);
            
        } catch (error) {
            console.log('❌ Auto-practice submission failed');
        }
    }

    /**
     * Get field quality description
     */
    getFieldQuality(coherence) {
        if (coherence >= 88) return 'Sacred Portal';
        if (coherence >= 80) return 'Resonance';
        if (coherence >= 70) return 'Highly Coherent';
        if (coherence >= 60) return 'Flowing';
        if (coherence >= 50) return 'Building';
        return 'Awakening';
    }

    /**
     * Get resonance status
     */
    getResonanceStatus() {
        if (this.fieldState.coherence >= 88) return 'Portal Active ✨';
        if (this.fieldState.coherence >= 80) return 'Resonance Achieved 🌟';
        const needed = 80 - this.fieldState.coherence;
        return `${Math.round(needed)}% to resonance`;
    }

    /**
     * Get coherence color
     */
    getCoherenceColor(coherence) {
        if (coherence >= 88) return 0xFFD700; // Gold
        if (coherence >= 80) return 0x9370DB; // Purple
        if (coherence >= 60) return 0x00FF7F; // Spring green
        return 0x6495ED; // Cornflower blue
    }

    /**
     * Get glyph tier
     */
    getGlyphTier(glyphId) {
        const num = parseInt(glyphId.replace(/[*#]/, ''));
        if (num <= 4) return 'Foundation';
        if (num <= 8) return 'Daily';
        return 'Mastery';
    }

    /**
     * Setup mock field for demonstration
     */
    setupMockField() {
        console.log('🎭 Setting up mock field for demonstration');
        
        // Simulate field events
        setInterval(() => {
            this.fieldState.coherence += (Math.random() - 0.5) * 4;
            this.fieldState.coherence = Math.max(60, Math.min(95, this.fieldState.coherence));
            this.fieldState.fieldQuality = this.getFieldQuality(this.fieldState.coherence);
        }, 45000);
    }

    /**
     * Simulate field change for demo
     */
    simulateFieldChange() {
        const oldCoherence = this.fieldState.coherence;
        const delta = (Math.random() - 0.3) * 6;
        const newCoherence = Math.max(60, Math.min(95, oldCoherence + delta));
        
        if (Math.abs(delta) > 1) {
            this.handleCoherenceChange({
                old: oldCoherence,
                new: newCoherence,
                delta: Math.round(delta * 10) / 10,
                action: 'simulated_practice'
            });
        }
    }

    /**
     * Log embed for demonstration
     */
    logEmbed(embed) {
        console.log('   📋 Embed:', {
            title: embed.data.title,
            description: embed.data.description,
            fields: embed.data.fields
        });
    }
}

// Demo runner
async function runDiscordFieldDemo() {
    console.log('🌉 Discord-Field Bridge Demo\n');
    
    const bridge = new DiscordFieldBridge();
    
    try {
        await bridge.initialize();
        
        console.log('🎭 Simulating Discord-Field interactions...\n');
        
        // Simulate practice submissions
        setTimeout(async () => {
            console.log('👤 User submitted practice via Discord...');
            await bridge.handlePracticeCommand({
                user: { id: 'user123' },
                options: {
                    getString: (key) => {
                        if (key === 'glyph') return '*1';
                        if (key === 'experience') return 'Deep presence practice from Discord';
                        return null;
                    }
                }
            });
        }, 5000);
        
        // Keep running
        console.log('🔄 Bridge running... (Ctrl+C to stop)\n');
        
    } catch (error) {
        console.error('❌ Demo failed:', error);
    }
}

if (require.main === module) {
    runDiscordFieldDemo();
}

module.exports = { DiscordFieldBridge };