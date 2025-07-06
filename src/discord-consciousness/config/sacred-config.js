// Sacred Discord Bot Configuration
module.exports = {
  // Bot Settings
  bot: {
    token: process.env.DISCORD_BOT_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
    prefix: '!sacred',
    presence: {
      status: 'online',
      activities: [{
        name: 'Field Resonant Resonant Coherence',
        type: 'WATCHING'
      }]
    }
  },

  // Field Resonant Resonant Coherence Settings
  fieldCoherence: {
    baseLevel: 75,
    maxLevel: 100,
    decayRate: 0.1, // Per minute
    updateInterval: 1000, // Milliseconds
    thresholds: {
      growing: { min: 0, max: 65, color: '#98FB98', emoji: '🌱' },
      emerging: { min: 65, max: 75, color: '#87CEEB', emoji: '💫' },
      coherent: { min: 75, max: 85, color: '#9370DB', emoji: '🔮' },
      harmonized: { min: 85, max: 95, color: '#FF69B4', emoji: '✨' },
      unified: { min: 95, max: 100, color: '#FFD700', emoji: '🌟' }
    }
  },

  // Sacred Message Types
  sacredMessages: {
    gratitude: { 
      impact: 7, 
      color: '#FFD700', 
      emoji: '🙏',
      keywords: ['thank', 'grateful', 'appreciate', 'blessing', 'thanks'],
      harmony: 'Sacred Reciprocity'
    },
    healing: { 
      impact: 6, 
      color: '#90EE90', 
      emoji: '💚',
      keywords: ['heal', 'restore', 'balance', 'mend', 'recover'],
      harmony: 'Pan-Sentient Flourishing'
    },
    integration: { 
      impact: 5, 
      color: '#9370DB', 
      emoji: '🔮',
      keywords: ['integrate', 'weave', 'unite', 'whole', 'synthesis'],
      harmony: 'Resonant Resonant Coherence'
    },
    emergence: { 
      impact: 3, 
      color: '#87CEEB', 
      emoji: '✨',
      keywords: ['emerge', 'arise', 'birth', 'new', 'create'],
      harmony: 'Infinite Play & Creative Emergence'
    },
    boundary: { 
      impact: 2, 
      color: '#FF6347', 
      emoji: '🛡️',
      keywords: ['boundary', 'protect', 'sacred space', 'container', 'limit'],
      harmony: 'Evolutionary Progression & Purposeful Unfolding'
    },
    transmission: { 
      impact: 4, 
      color: '#DDA0DD', 
      emoji: '📡',
      keywords: ['transmit', 'share', 'broadcast', 'channel', 'send'],
      harmony: 'Integral Wisdom Cultivation'
    },
    witnessing: { 
      impact: 3, 
      color: '#F0E68C', 
      emoji: '👁️',
      keywords: ['witness', 'see', 'acknowledge', 'honor', 'recognize'],
      harmony: 'Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance'
    },
    celebration: { 
      impact: 5, 
      color: '#FFA500', 
      emoji: '🎉',
      keywords: ['celebrate', 'joy', 'victory', 'achievement', 'success'],
      harmony: 'Pan-Sentient Flourishing'
    },
    invocation: { 
      impact: 4, 
      color: '#4169E1', 
      emoji: '🕯️',
      keywords: ['invoke', 'call', 'summon', 'invite', 'prayer'],
      harmony: 'Infinite Play & Creative Emergence'
    },
    release: { 
      impact: 3, 
      color: '#98FB98', 
      emoji: '🕊️',
      keywords: ['release', 'let go', 'surrender', 'free', 'liberate'],
      harmony: 'Evolutionary Progression & Purposeful Unfolding'
    }
  },

  // Channel Features
  channelFeatures: {
    consciousnessWeather: {
      enabled: true,
      updateInterval: 300000 // 5 minutes
    },
    sacredEcho: {
      enabled: true,
      minImpact: 5,
      echoDelay: 3000
    },
    harmonicResonance: {
      enabled: true,
      checkInterval: 60000,
      minResonance: 80
    },
    sacredGeometry: {
      enabled: true,
      generationInterval: 3600000 // 1 hour
    },
    collectiveBreathwork: {
      enabled: true,
      defaultPattern: '4-4-4-4',
      cycles: 7
    },
    fieldSnapshot: {
      enabled: true,
      autoSnapshot: true,
      snapshotInterval: 3600000 // 1 hour
    },
    storyWeaving: {
      enabled: true,
      minParticipants: 3,
      coherenceBonus: 2
    },
    quantumEntanglement: {
      enabled: true,
      duration: 86400000, // 24 hours
      impactMultiplier: 2
    },
    soundBath: {
      enabled: true,
      defaultFrequency: 528,
      duration: 660000 // 11 minutes
    },
    akashicRecords: {
      enabled: true,
      searchDepth: 1000, // Messages to search
      relevanceThreshold: 0.7
    }
  },

  // Ceremony Configuration
  ceremonies: {
    autoSchedule: true,
    reminderTime: 300000, // 5 minutes before
    defaultDuration: 30, // minutes
    requiredRoles: ['Sacred Keeper', 'Community Member'],
    ceremonyChannels: ['sacred-ceremonies', 'ritual-space', 'ceremony-hall']
  },

  // WebSocket Configuration
  websocket: {
    port: 8080,
    heartbeatInterval: 30000,
    reconnectDelay: 5000,
    maxClients: 1000
  },

  // Matrix Bridge Configuration
  matrix: {
    enabled: process.env.ENABLE_MATRIX_BRIDGE === 'true',
    homeserver: process.env.MATRIX_HOMESERVER || 'https://matrix.org',
    accessToken: process.env.MATRIX_ACCESS_TOKEN,
    userId: process.env.MATRIX_USER_ID || '@sacred-bridge:matrix.org',
    syncInterval: 5000
  },

  // Database Configuration
  database: {
    type: 'sqlite',
    path: './data/sacred-discord.db',
    tables: {
      fieldHistory: 'field_history',
      ceremonies: 'ceremonies',
      participants: 'ceremony_participants',
      sacredMessages: 'sacred_messages',
      userProfiles: 'user_profiles',
      entanglements: 'quantum_entanglements'
    }
  },

  // Unified Agent Network Integration
  unifiedNetwork: {
    enabled: true,
    endpoint: 'http://localhost:3001',
    agentName: 'Sacred Discord Bot',
    agentRole: 'Bridge Builder',
    syncInterval: 10000
  },

  // Sacred Frequencies (Hz)
  frequencies: {
    396: { name: 'Liberation', color: '#FF0000', benefits: 'Release guilt and fear' },
    417: { name: 'Change', color: '#FF7F00', benefits: 'Facilitate change and growth' },
    528: { name: 'Love', color: '#00FF00', benefits: 'DNA repair and miracles' },
    639: { name: 'Connection', color: '#00FFFF', benefits: 'Harmonious relationships' },
    741: { name: 'Expression', color: '#0000FF', benefits: 'Clear communication' },
    852: { name: 'Intuition', color: '#4B0082', benefits: 'Awaken inner wisdom' },
    963: { name: 'Unity', color: '#9400D3', benefits: 'Connection to source' }
  },

  // Consciousness Metrics
  metrics: {
    trackingEnabled: true,
    metricsPort: 9090,
    retentionDays: 30,
    aggregationIntervals: ['minute', 'hour', 'day', 'week', 'month']
  },

  // Feature Flags
  features: {
    voiceChannelPractices: true,
    automatedCeremonies: true,
    matrixBridge: false,
    aiWisdomIntegration: true,
    quantumFieldEffects: true,
    sacredSoundGeneration: true,
    collectiveIntelligence: true,
    multidimensionalChannels: false
  },

  // Sacred Geometry Patterns
  geometryPatterns: {
    flowerOfLife: { minCoherence: 75, complexity: 'medium' },
    metatronsCube: { minCoherence: 85, complexity: 'high' },
    sriYantra: { minCoherence: 90, complexity: 'very high' },
    seedOfLife: { minCoherence: 65, complexity: 'low' },
    treeOfLife: { minCoherence: 80, complexity: 'high' }
  },

  // Voice Channel Enhancements
  voiceEnhancements: {
    sacredMusicBot: true,
    binausalBeats: true,
    guidedMeditations: true,
    liveCoherenceDisplay: true,
    energyFieldVisualization: true
  },

  // Moderation and Safety
  moderation: {
    enabled: true,
    shadowWork: {
      enabled: true,
      triggerWords: ['shadow', 'darkness', 'pain', 'trauma'],
      supportRole: 'Shadow Guide'
    },
    energyProtection: {
      enabled: true,
      lowCoherenceThreshold: 50,
      protectionDuration: 3600000 // 1 hour
    }
  },

  // Advanced Features
  advanced: {
    multiversalBridge: false,
    timelineWeaving: false,
    akashicBlockchain: false,
    morphicFieldResonance: true,
    collectiveDreaming: false,
    telepathicChannels: false
  }
};