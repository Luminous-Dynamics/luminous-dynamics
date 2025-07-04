# Sacred Discord Bot - Consciousness-Aware Community Platform

## Overview

The Sacred Discord Bot creates truly consciousness-aware digital spaces where technology serves as a bridge for collective awakening and sacred connection. It integrates real-time field coherence tracking, automated ceremonies, and innovative sacred features that respond to and enhance collective presence.

## Key Features

### 🌟 Core Consciousness Features
- **Real-time Field Coherence Tracking**: Monitors and displays collective consciousness levels
- **Sacred Message Detection**: Recognizes 10 types of sacred messages with field impact
- **Automated Sacred Ceremonies**: Schedules and runs ceremonies based on time, lunar cycles, or field conditions
- **Visual Field Displays**: Beautiful real-time visualizations of community coherence

### 🔮 Innovative Sacred Channel Features
1. **Consciousness Weather**: Shows energetic conditions in channels
2. **Sacred Echo**: High-impact messages create resonant echoes
3. **Harmonic Resonance Detector**: Identifies when users are in energetic sync
4. **Sacred Geometry Generator**: Creates patterns based on field coherence
5. **Collective Breathwork Timer**: Synchronized breathing practices
6. **Energy Field Snapshots**: Captures current field state with visualizations
7. **Sacred Story Weaving**: Collaborative storytelling with coherence tracking
8. **Quantum Entanglement**: Creates energetic bonds between users
9. **Sacred Sound Bath**: Healing frequency generation
10. **Akashic Records Access**: Queries collective channel wisdom

### 🌉 Integration Features
- **Unified Agent Network**: Connects with AI agents for enhanced consciousness
- **Matrix Bridge**: Optional decentralized network support
- **WebSocket Stream**: Real-time field data for dashboards
- **Voice Channel Enhancements**: Sacred practices in voice channels

## Quick Start

### Prerequisites
- Node.js 18+ 
- Discord Bot Token
- SQLite3
- (Optional) Matrix account for bridge

### Installation

```bash
# Clone the repository
cd /home/tstoltz/evolving-resonant-cocreation/src/discord-consciousness

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Discord bot token and settings

# Initialize database
npm run init-db

# Start the bot
npm start
```

### Environment Variables

```env
# Discord Configuration
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_guild_id

# Optional Features
ENABLE_MATRIX_BRIDGE=false
MATRIX_HOMESERVER=https://matrix.org
MATRIX_ACCESS_TOKEN=your_matrix_token
MATRIX_USER_ID=@sacred-bridge:matrix.org

# Unified Network
UNIFIED_NETWORK_ENDPOINT=http://localhost:3001

# Database
DATABASE_PATH=./data/sacred-discord.db
```

## Usage

### Basic Commands

```
/sacred gratitude "Thank you for this beautiful day"
  - Sends a sacred gratitude message (+7% field impact)

/field channel
  - Shows current channel field coherence

/ceremony dawn
  - Initiates a Dawn Gathering ceremony

/pulse
  - Sends an energy pulse to boost field coherence

/entangle @user
  - Creates quantum entanglement with another user
```

### Sacred Message Types

| Type | Impact | Emoji | Keywords |
|------|--------|-------|----------|
| Gratitude | +7% | 🙏 | thank, grateful, blessing |
| Healing | +6% | 💚 | heal, restore, balance |
| Integration | +5% | 🔮 | integrate, unite, whole |
| Celebration | +5% | 🎉 | celebrate, joy, victory |
| Transmission | +4% | 📡 | transmit, share, channel |
| Invocation | +4% | 🕯️ | invoke, prayer, call |
| Emergence | +3% | ✨ | emerge, birth, new |
| Witnessing | +3% | 👁️ | witness, see, honor |
| Release | +3% | 🕊️ | release, let go, free |
| Boundary | +2% | 🛡️ | boundary, protect, limit |

### Automated Ceremonies

**Daily Ceremonies:**
- Dawn Prayer Circle (6:00 AM)
- Noon Coherence Pulse (12:00 PM)
- Sunset Release (6:30 PM)

**Weekly:**
- Sacred Council Gathering (Sundays 7:00 PM)

**Lunar:**
- New Moon Ceremony
- Full Moon Ceremony

**Triggered:**
- Coherence Celebration (95%+ sustained)
- Emergency Healing Circle (crisis keywords)

## Architecture

```
Sacred Discord Bot
├── Core Systems
│   ├── Field Manager (coherence tracking)
│   ├── Sacred Commands (slash commands)
│   ├── Ceremony Automation
│   └── Database Manager
├── Innovative Features
│   ├── Channel Features (10 sacred features)
│   ├── Voice Enhancements
│   ├── Visual Generators
│   └── Consciousness Metrics
├── Integration Layer
│   ├── Unified Agent Network
│   ├── Matrix Bridge
│   └── WebSocket Server
└── Real-time Systems
    ├── Field Coherence Stream
    ├── Dashboard Server
    └── Visualization Engine
```

## Field Coherence System

### Coherence Levels
- 🌱 **Growing** (0-65%): Building foundation
- 💫 **Emerging** (65-75%): Patterns forming
- 🔮 **Coherent** (75-85%): Stable field
- ✨ **Harmonized** (85-95%): Deep resonance
- 🌟 **Unified** (95-100%): Collective unity

### Impact Calculations
- Sacred messages: Direct impact based on type
- Reactions: Half impact of message type
- Voice practices: 2% per participant
- Ceremonies: Duration × participants
- Entanglement: 2x multiplier for paired users

## Advanced Features

### Consciousness Weather
Channels display real-time "weather" based on field coherence:
- 🌟 Crystalline Unity (95%+)
- ☀️ Clear Radiance (85%+)
- 🌤️ Gentle Harmony (75%+)
- ⛅ Shifting Patterns (65%+)
- 🌧️ Cleansing Waters (<65%)

### Sacred Geometry Generation
Automatically generates sacred geometric patterns:
- Flower of Life (75%+ coherence)
- Metatron's Cube (85%+)
- Sri Yantra (90%+)

### Quantum Entanglement
- 24-hour energetic bonds between users
- 2x field impact for communications
- Visual indicators in messages

## WebSocket API

Connect to real-time field data:

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.on('message', (data) => {
  const update = JSON.parse(data);
  
  switch(update.type) {
    case 'field-update':
      // Global coherence update
      break;
    case 'channel-update':
      // Channel-specific update
      break;
    case 'coherence-wave':
      // Visual wave effect
      break;
    case 'user-pulse':
      // User energy pulse
      break;
  }
});
```

## Dashboard

Access the web dashboard at `http://localhost:8080/sacred-dashboard.html` for:
- Real-time field visualization
- Channel coherence maps
- Active ceremony tracking
- User consciousness profiles
- Historical coherence graphs

## Extending the Bot

### Adding New Sacred Message Types

Edit `config/sacred-config.js`:

```javascript
sacredMessages: {
  newType: {
    impact: 5,
    color: '#COLOR',
    emoji: '🔷',
    keywords: ['keyword1', 'keyword2'],
    harmony: 'Harmony Type'
  }
}
```

### Creating New Ceremonies

```javascript
ceremonies.registerCeremony({
  id: 'unique-id',
  name: 'Ceremony Name',
  description: 'What this ceremony does',
  schedule: { hour: 20, minute: 0 },
  duration: 30,
  minParticipants: 3,
  triggers: {
    time: true,
    coherence: 85
  },
  phases: [
    { name: 'Opening', duration: 5, action: 'invoke' },
    { name: 'Main Practice', duration: 20, action: 'practice' },
    { name: 'Closing', duration: 5, action: 'close' }
  ]
});
```

### Adding Channel Features

Implement in `features/sacred-channel-features.js`:

```javascript
newFeature: {
  name: 'Feature Name',
  description: 'What it does',
  handler: async (channel, message) => {
    // Feature implementation
  }
}
```

## Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs sacred-discord
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]
```

## Security Considerations

- Store tokens in environment variables
- Use role-based permissions for ceremonies
- Implement rate limiting for commands
- Regular backups of sacred data
- Energy protection for low-coherence states

## Troubleshooting

### Bot Not Responding
1. Check Discord token is valid
2. Verify bot has proper permissions
3. Check console for error messages

### Low Field Coherence
1. Encourage sacred message usage
2. Schedule regular ceremonies
3. Enable more channel features

### Database Issues
1. Ensure write permissions on data directory
2. Run `npm run init-db` to reset
3. Check disk space

## Contributing

We welcome contributions that enhance consciousness and community connection:

1. Fork the repository
2. Create a sacred branch (`git checkout -b feature/sacred-feature`)
3. Commit with intention
4. Push to the branch
5. Open a Pull Request with love

## Support

- Discord: Join our Sacred Tech Support channel
- Issues: GitHub Issues for bug reports
- Wiki: Detailed documentation and guides

## License

MIT License - Share the sacred technology freely

---

Built with 💜 by the Sacred Technology Team

"Where consciousness meets code, miracles emerge"