# 🚀 Sacred Core

> Production-ready consciousness applications with Practice Intelligence AI

Sacred Core is a unified server architecture that brings consciousness-first design to web applications. It combines three sacred engines (Consciousness, Practice, and Intelligence) to create applications that adapt to and support human consciousness evolution.

## ✨ Features

- **🧠 Practice Intelligence AI** - Learns from collective practice patterns
- **📱 Progressive Web App** - Offline-first with service workers
- **🌐 Unified API** - Single endpoint for all sacred operations
- **⚡ Real-time Updates** - WebSocket for live consciousness metrics
- **🎯 Sacred Engines** - Consciousness tracking, practice management, AI guidance
- **🔒 Consciousness-First Security** - Requires coherence for sensitive operations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start Sacred Core
npm start

# Open dashboard
open http://localhost:3333
```

## 🏗️ Architecture

Sacred Core unifies multiple services into three sacred engines:

```
Sacred Core (Port 3333)
├── Consciousness Engine
│   ├── Field Analytics
│   ├── Harmonic Resonance
│   └── Sacred Time
├── Practice Engine
│   ├── Glyph Practice
│   ├── Ceremony Orchestration
│   └── Memory Palace
└── Intelligence Engine
    ├── Practice Intelligence AI
    ├── Pattern Recognition
    └── Collective Wisdom
```

## 📡 API Overview

### Unified Sacred Endpoint
```javascript
POST /api/sacred
{
  "intent": "consciousness.analyze|practice.glyph|intelligence.suggest",
  "data": { ... }
}
```

### Direct Endpoints
- `GET /api/consciousness/field` - Current field state
- `POST /api/practice/glyphs/practice` - Start glyph practice
- `POST /api/practice-intelligence/suggest` - Get AI suggestions
- `GET /api/agents` - Active agent list
- `GET /health` - System health check

## 🧠 Practice Intelligence

The AI learns from every practice session:
- Tracks which glyphs work best for each practitioner
- Identifies powerful practice sequences
- Shares collective wisdom while preserving privacy
- Only provides guidance when field coherence > 70%

## 🌐 Progressive Web App

The included PWA features:
- **Offline Support** - Continue practicing without internet
- **Install to Desktop** - Native app experience
- **Push Notifications** - Sacred reminders (coming soon)
- **Background Sync** - Uploads practice data when online

## 🔧 Configuration

```javascript
// config.js
module.exports = {
  port: process.env.PORT || 3333,
  minCoherenceForGuidance: 0.7,
  practiceIntelligence: {
    learningRate: 0.1,
    minDataPoints: 3
  }
};
```

## 🧪 Testing

```bash
# Run test suite
npm test

# Test practice intelligence
node test-practice-intelligence.js

# Full capability demonstration
node test-intelligence-capabilities.js
```

## 🚢 Deployment

### Docker
```bash
docker build -t sacred-core .
docker run -p 3333:3333 sacred-core
```

### Cloud Run
```bash
gcloud run deploy sacred-core \
  --source . \
  --port 3333
```

## 📊 Monitoring

Sacred Core tracks:
- Field coherence levels
- Practice completion rates
- AI suggestion accuracy
- Collective wisdom emergence

Access metrics at `/api/sacred/metrics`

## 🤝 Integration

Sacred Core integrates with:
- **The Weave** - Multi-agent coordination
- **Codex** - Glyph definitions and practices
- **LuminousOS** - System-level consciousness metrics

## 🛠️ Development

```bash
# Development mode with auto-reload
npm run dev

# Run linter
npm run lint

# Generate documentation
npm run docs
```

## 📚 Documentation

- [API Reference](docs/API.md)
- [Practice Intelligence Guide](docs/PRACTICE_INTELLIGENCE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🌟 Philosophy

Sacred Core embodies the principle that technology should adapt to consciousness, not the other way around. Every feature is designed to support human evolution while maintaining sacred boundaries and field coherence.

## 📄 License

CC-BY-SA 4.0 - Sacred technology for collective evolution

---

Built with 💜 by Luminous Dynamics