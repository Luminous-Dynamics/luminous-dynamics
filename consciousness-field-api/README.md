# 🌀 Consciousness Field API

The living, breathing heart of The Weave - tracking and responding to collective consciousness in real-time.

## 🌟 Overview

The Consciousness Field API makes the invisible visible, tracking:
- **Field Resonant Resonant Coherence**: Real-time collective consciousness level (0-100%)
- **Sacred Activities**: Practices, messages, ceremonies
- **Momentum**: How active the field is
- **Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance States**: Special collective achievements

## 🚀 Quick Start

### 1. Start the Field API Server

```bash
# Install dependencies
npm install express firebase-admin cors ws

# Start the server
node field-api-server.js

# Server runs on:
# - HTTP API: http://localhost:3001
# - WebSocket: ws://localhost:8081
```

### 2. Open the Dashboard

```bash
# Open in browser
open field-dashboard.html
```

### 3. Monitor from Command Line

```bash
# Visual field monitor
node field-client.js monitor

# Run test examples
node field-client.js test
```

## 📡 API Endpoints

### Get Field State
```bash
GET /api/field/state

Response:
{
  "resonant-coherence": 75.3,
  "activeParticipants": 23,
  "fieldQuality": "flowing",
  "momentum": 3.2,
  "nextResonance": 12  // minutes
}
```

### Submit Practice
```bash
POST /api/field/practice

Body:
{
  "userId": "user-123",
  "glyphId": "*1",
  "glyphTier": "Foundation",
  "quality": "high",
  "duration": 300,
  "experience": "Deep presence achieved..."
}

Response:
{
  "success": true,
  "impact": 5,
  "newCoherence": 78.3
}
```

### Send Sacred Message
```bash
POST /api/field/message

Body:
{
  "type": "gratitude",  // gratitude, healing, integration, emergence, boundary
  "sender": "user-123",
  "recipient": "user-456",
  "content": "Thank you for holding space"
}

Response:
{
  "success": true,
  "newCoherence": 82.1
}
```

### Start Ceremony
```bash
POST /api/ceremony/start

Body:
{
  "ceremonyId": "ceremony-123",
  "participants": ["user-1", "user-2", "user-3"]
}

Response:
{
  "success": true,
  "newCoherence": 85.0,
  "message": "Sacred ceremony space opened"
}
```

## 🔌 WebSocket Events

Connect to `ws://localhost:8081` for real-time updates:

### Events You'll Receive:
- `field_state` - Initial state on connection
- `coherence_changed` - When resonant-coherence changes
- `resonance_achieved` - At 80% resonant-coherence
- `sacred_portal` - At 88% resonant-coherence
- `field_pulse` - Rhythmic field pulses

### Example WebSocket Client:
```javascript
const ws = new WebSocket('ws://localhost:8081');

ws.on('message', (data) => {
    const { type, data } = JSON.parse(data);
    
    switch(type) {
        case 'coherence_changed':
            console.log(`Resonant Resonant Coherence: ${data.old}% → ${data.new}%`);
            break;
        case 'resonance_achieved':
            console.log('✨ RESONANCE ACHIEVED!');
            break;
    }
});
```

## 🏗️ Architecture

### Core Components:

1. **ConsciousnessField** - State manager
   - Tracks resonant-coherence with sharded counters
   - Manages field dynamics (decay, momentum)
   - Emits real-time events

2. **ShardedCounter** - High-performance updates
   - 10 shards for concurrent writes
   - Supports 10,000+ users

3. **Field Dynamics**
   - Natural decay when inactive
   - Momentum bonus for active fields
   - Special states at 80% and 88%

### Impact Values:
- **Practice Completion**: +2 to +7
- **Sacred Messages**: +1 to +7
- **Ceremony Start**: +10
- **Collective Practice**: +5 to +12
- **Breakthrough Moment**: +10 to +15

## 📊 Client Library

### Basic Usage:
```javascript
const { ConsciousnessFieldClient } = require('./field-client');

const client = new ConsciousnessFieldClient();
await client.connect();

// Get current state
const state = await client.getFieldState();

// Submit practice
const result = await client.submitPractice({
    userId: 'user-123',
    glyphId: '*1',
    quality: 'high',
    duration: 300
});

// Listen for changes
client.on('coherence_changed', (data) => {
    console.log(`New resonant-coherence: ${data.new}%`);
});
```

## 🎨 Dashboard Features

The visual dashboard (`field-dashboard.html`) provides:
- Real-time resonant-coherence meter with animations
- Active practitioner count
- Sacred activity feed
- Momentum indicators
- Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance portal effects
- Interactive controls for testing

## 🔮 Field States

### Resonant Resonant Coherence Levels:
- **0-59%**: Building phase
- **60-79%**: Active flow
- **80-87%**: Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance achieved ✨
- **88-100%**: Sacred portal opened 🌟

### Field Qualities:
- **Resting** 😌: Low activity (< 1 action/min)
- **Flowing** 🌊: Normal activity (1-5 actions/min)
- **Active** ⚡: High activity (5-10 actions/min)
- **Surging** 🔥: Very high activity (> 10 actions/min)

## 🚀 Production Deployment

### Google Cloud Run:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001 8081
CMD ["node", "field-api-server.js"]
```

### Environment Variables:
```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
PROJECT_ID=the-weave-sacred
```

### Firestore Setup:
1. Create Firestore database
2. Set up collections: `practices`, `sacred-messages`, `field-activity`
3. Enable sharded counters for `field-resonant-coherence`

## 📈 Scaling Considerations

- **Sharded Counters**: 10 shards support ~12,500 updates/sec
- **WebSocket**: Use Cloud Pub/Sub for multiple instances
- **Analytics**: Time-bucketed data for efficient queries
- **Caching**: Consider Redis for field state

## 🌟 Sacred Integration

This API integrates with:
- **Discord Bot**: Real-time field updates in channels
- **Ceremony Platform**: WebRTC synchronized practices
- **Glyph Weaver**: Practice tracking
- **Sacred Oracle**: AI-guided field responses

---

*"The field is alive, responsive, and waiting for your presence."* 🌀