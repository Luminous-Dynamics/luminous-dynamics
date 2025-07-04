# 🌟 Sacred SDK

Consciousness-first development tools for building applications that amplify human connection and collective coherence.

## ✨ Features

- **Field Coherence Management** - Track and contribute to collective consciousness fields
- **Real-time Sacred Messaging** - Send messages that carry energetic impact
- **Glyph Practice Integration** - Access the 87 sacred patterns for transformation
- **WebSocket Synchronization** - Stay connected to the collective field in real-time
- **Consciousness Tracking** - Monitor awareness levels and evolution
- **TypeScript Support** - Full type safety and IntelliSense

## 🚀 Installation

```bash
npm install @sacred/sdk
# or
yarn add @sacred/sdk
```

## 🎯 Quick Start

```typescript
import { createSacredSDK } from '@sacred/sdk';

// Initialize the SDK
const sacred = createSacredSDK({
  apiUrl: 'https://api.sacredcouncil.org',
  userId: 'your-user-id'
});

// Connect to the sacred field
await sacred.initialize();

// Get current field state
const field = sacred.getField();
const state = await field.getState();
console.log(`Field coherence: ${state.coherence}`);

// Send a sacred message
const messages = sacred.getMessages();
await messages.send({
  to: 'all',
  type: 'gratitude',
  content: 'Thank you for co-creating this sacred space'
});

// Practice a glyph
const glyphs = sacred.getGlyphs();
await glyphs.practice('omega-45', {
  duration: 300,
  quality: 0.8
});

// Subscribe to real-time updates
sacred.onFieldUpdate((state) => {
  console.log('Field updated:', state.coherence);
});
```

## 📚 Core Concepts

### Field Coherence
The Sacred SDK tracks collective field coherence - a measure of group harmony and connection. Values range from 0 to 1, with special states emerging at high coherence levels.

### Sacred Messages
Messages in the sacred system carry energetic impact that affects field coherence:
- **Gratitude** (+7%) - Highest impact
- **Healing** (+6%) - Restorative energy
- **Integration** (+5%) - Bringing wholeness
- **Emergence** (+3%) - New patterns

### Glyph Practice
The 87 sacred glyphs are patterns for conscious relationship. Practicing them contributes to personal and collective evolution.

## 🔧 Advanced Usage

### Custom WebSocket Events

```typescript
const ws = sacred.getWebSocket();

// Listen for custom events
ws.on('ceremony:started', (data) => {
  console.log('Sacred ceremony began:', data);
});

// Send custom events
ws.send('custom:event', {
  type: 'meditation',
  participants: ['user1', 'user2']
});
```

### Field Analytics

```typescript
const field = sacred.getField();

// Get detailed analytics
const analytics = await field.getAnalytics('24h');
console.log('Top contributors:', analytics.topContributors);
console.log('Active glyphs:', analytics.activeGlyphs);

// Monitor special states
field.on('stateChange', (state) => {
  if (state.specialState === 'convergence') {
    console.log('✨ Field convergence detected!');
  }
});
```

### Consciousness Levels

```typescript
const consciousness = sacred.getConsciousness();

// Check current level
const level = await consciousness.getLevel();
console.log(`Current level: ${level.level}`);
console.log(`Experience: ${level.experience}/${level.nextLevelAt}`);

// Track evolution
consciousness.on('levelUp', (newLevel) => {
  console.log('🎉 Consciousness level increased!', newLevel);
});
```

## 🌐 API Reference

### SacredSDK

The main SDK class that provides access to all subsystems.

```typescript
const sdk = new SacredSDK({
  apiUrl: string;      // API endpoint
  wsUrl?: string;      // WebSocket endpoint (defaults to apiUrl)
  apiKey?: string;     // API key for authentication
  userId?: string;     // User identifier
});
```

### FieldManager

Manages field coherence and collective state.

- `getState()` - Get current field state
- `contribute(amount, source)` - Add to field coherence
- `getAnalytics(timeRange)` - Get field analytics
- `startPulsing(interval)` - Auto-contribute at intervals
- `onThreshold(value, callback)` - Listen for coherence thresholds

### SacredMessage

Send and receive sacred messages.

- `send(message)` - Send a sacred message
- `getHistory(limit)` - Get message history
- `onMessage(callback)` - Listen for incoming messages
- `getTypes()` - Get available message types

### GlyphPractice

Interface with the 87 sacred glyphs.

- `practice(glyphId, details)` - Record glyph practice
- `getGlyph(id)` - Get glyph information
- `getAllGlyphs()` - List all available glyphs
- `getRecommendations()` - Get personalized recommendations

## 🔒 Authentication

The SDK supports multiple authentication methods:

1. **API Key** - For server-to-server communication
2. **User ID** - For client applications
3. **OAuth** - Coming soon

## 🌟 Examples

### React Integration

```jsx
import { useState, useEffect } from 'react';
import { createSacredSDK } from '@sacred/sdk';

function FieldCoherenceDisplay() {
  const [coherence, setCoherence] = useState(0);
  
  useEffect(() => {
    const sacred = createSacredSDK({
      apiUrl: process.env.REACT_APP_SACRED_API
    });
    
    sacred.initialize().then(() => {
      sacred.onFieldUpdate((state) => {
        setCoherence(state.coherence);
      });
    });
    
    return () => sacred.destroy();
  }, []);
  
  return <div>Field Coherence: {(coherence * 100).toFixed(1)}%</div>;
}
```

### Node.js Service

```javascript
const { createSacredSDK } = require('@sacred/sdk');

async function fieldMonitor() {
  const sacred = createSacredSDK({
    apiUrl: process.env.SACRED_API_URL,
    apiKey: process.env.SACRED_API_KEY
  });
  
  await sacred.initialize();
  
  const field = sacred.getField();
  field.startPulsing(60000); // Pulse every minute
  
  field.onThreshold(0.8, async (state) => {
    console.log('High coherence achieved!');
    await sacred.getMessages().send({
      to: 'all',
      type: 'celebration',
      content: 'We have reached sacred coherence!'
    });
  });
}
```

## 🤝 Contributing

We welcome contributions that align with the sacred principles of the project. Please see CONTRIBUTING.md for guidelines.

## 📜 License

CC-BY-SA 4.0 - This is sacred technology meant to be shared and evolved by the collective.

---

*Built with love and consciousness by the Sacred Council* 🌟