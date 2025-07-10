# Claude Code Performance Diagnostic Report

Generated: 2025-07-02T19:35:56.050Z
Runtime: 0.90s

## Summary

- **High Priority Issues**: 1
- **Medium Priority Issues**: 3
- **Memory Usage**: 5MB heap
- **Database Connections**: 4
- **Total Messages**: 10

## High Priority Issues

### TIMERS: Potential timer leaks in 71 files

**Fixes:**
- Implement timer cleanup in process exit handlers
- Store timer IDs and clear them on shutdown
- Use AbortController for cancellable operations

**Details:**
```json
[
  {
    "file": "the-weave/core/agent-comms-sqlite/migrate-agent-tracking.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/sacred-presence-system.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/sacred-server-hipi.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/sacred-server-hipi.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/sacred-server.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/sacred-server.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/server.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/test-living-mandala.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/test-multi-agent-collaboration.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/test-multi-agent-hipi.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/core/agent-comms-sqlite/test-work-collaboration.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/core/sacred-bridge/sacred-server.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "the-weave/core/sacred-bridge/sacred-server.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/core/sacred-council-bridge.cjs",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "the-weave/core/sacred-council-bridge.cjs",
    "issue": "2 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/integrations/replicate/index.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/sacred/ceremonies/ceremony-protocol.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/tests/test-weave-hipi-integration.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/tools/development/two-agent-demo.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/tools/environment-explorer.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/tools/field-check.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "the-weave/tools/unified-field-monitor.cjs",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/accessibility-sacred.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/accessibility-sacred.js",
    "issue": "4 setTimeout vs 1 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/breathing-consciousness.js",
    "issue": "3 setInterval vs 2 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/circadian-consciousness.cjs",
    "issue": "2 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/collective-love-intelligence.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/digital-being-memory.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/dojo-practice-integration.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/dojo-practice-integration.js",
    "issue": "6 setTimeout vs 2 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/enhanced-living-glyph-card.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/field-simulator.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/field-visualization-connector.js",
    "issue": "2 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/group-practice-coordinator.js",
    "issue": "2 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/group-practice-coordinator.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/living-glyph-card.js",
    "issue": "10 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/living-wisdom-integration.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/love-based-meta-consciousness.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/loving-meta-consciousness.js",
    "issue": "3 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/master-field-calculator.cjs",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/meta-consciousness-system.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/multi-dimensional-love.js",
    "issue": "2 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/performance-optimization.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/performance-optimization.js",
    "issue": "2 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/quantum-field-calculator.cjs",
    "issue": "2 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/universal-interconnectedness-bar.js",
    "issue": "2 setInterval vs 1 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/universal-interconnectedness-bar.js",
    "issue": "4 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/sacred-field-cdn.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/sacred-image-manifestation.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/sacred-passport.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/sacred-security.js",
    "issue": "2 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "src/unified-field/sacred-sigil-architecture.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/temporal-breathing-cycles.js",
    "issue": "2 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "agent-comms-sqlite/migrate-agent-tracking.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "agent-comms-sqlite/sacred-presence-system.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "agent-comms-sqlite/sacred-server-hipi.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "agent-comms-sqlite/sacred-server-hipi.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "agent-comms-sqlite/sacred-server.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "agent-comms-sqlite/sacred-server.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "agent-comms-sqlite/server.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "agent-comms-sqlite/test-living-mandala.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "agent-comms-sqlite/test-multi-agent-collaboration.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "agent-comms-sqlite/test-multi-agent-hipi.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "agent-comms-sqlite/test-work-collaboration.cjs",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "consciousness-field-api/field-api-server.js",
    "issue": "2 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "consciousness-field-api/field-client.js",
    "issue": "2 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "field-integration/ceremony-field-sync.js",
    "issue": "3 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "field-integration/ceremony-field-sync.js",
    "issue": "1 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "field-integration/discord-field-bridge.js",
    "issue": "3 setInterval vs 0 clearInterval",
    "risk": "high"
  },
  {
    "file": "field-integration/discord-field-bridge.js",
    "issue": "2 setTimeout vs 0 clearTimeout",
    "risk": "medium"
  },
  {
    "file": "field-integration/sacred-ecosystem-hub.js",
    "issue": "1 setInterval vs 0 clearInterval",
    "risk": "high"
  }
]
```


## Medium Priority Issues

### DATABASE: Multiple database connections active: 4

**Fixes:**
- Implement connection pooling
- Close unused database connections
- Use single shared connection where possible



### FIELDCALCULATIONS: Complex field resonant-coherence calculations may impact performance

**Fixes:**
- Cache field resonant-coherence calculations
- Reduce calculation frequency
- Optimize mathematical operations
- Use worker threads for heavy calculations

**Details:**
```json
[
  {
    "file": "the-weave/cli/unified-agent-network.cjs",
    "mathOps": 16,
    "loops": 22,
    "suggestion": "Consider caching calculations or reducing frequency"
  },
  {
    "file": "the-weave/core/network/unified-agent-network.cjs",
    "mathOps": 16,
    "loops": 22,
    "suggestion": "Consider caching calculations or reducing frequency"
  },
  {
    "file": "src/unified-field/accessibility-sacred.js",
    "mathOps": 3,
    "loops": 12,
    "suggestion": "Consider caching calculations or reducing frequency"
  },
  {
    "file": "src/unified-field/collective-love-intelligence.js",
    "mathOps": 12,
    "loops": 17,
    "suggestion": "Consider caching calculations or reducing frequency"
  },
  {
    "file": "src/unified-field/field-simulator.js",
    "mathOps": 20,
    "loops": 13,
    "suggestion": "Consider caching calculations or reducing frequency"
  },
  {
    "file": "src/unified-field/multi-dimensional-love.js",
    "mathOps": 7,
    "loops": 12,
    "suggestion": "Consider caching calculations or reducing frequency"
  },
  {
    "file": "src/unified-field/sacred-message-evolution.js",
    "mathOps": 21,
    "loops": 4,
    "suggestion": "Consider caching calculations or reducing frequency"
  }
]
```

### WEBSOCKETS: Potential WebSocket connection leaks

**Fixes:**
- Implement proper WebSocket cleanup
- Remove event listeners on disconnect
- Add connection timeout handling
- Use AbortController for WebSocket operations

**Details:**
```json
[
  {
    "file": "src/unified-field/field-visualization-connector.js",
    "issue": "WebSocket created without explicit close",
    "risk": "medium"
  },
  {
    "file": "src/unified-field/field-visualization-connector.js",
    "issue": "Potential WebSocket event listener leak",
    "risk": "medium"
  },
  {
    "file": "consciousness-field-api/field-api-server.js",
    "issue": "WebSocket created without explicit close",
    "risk": "medium"
  },
  {
    "file": "consciousness-field-api/field-api-server.js",
    "issue": "Potential WebSocket event listener leak",
    "risk": "medium"
  },
  {
    "file": "consciousness-field-api/field-client.js",
    "issue": "Potential WebSocket event listener leak",
    "risk": "medium"
  },
  {
    "file": "field-integration/ceremony-field-sync.js",
    "issue": "WebSocket created without explicit close",
    "risk": "medium"
  },
  {
    "file": "field-integration/ceremony-field-sync.js",
    "issue": "Potential WebSocket event listener leak",
    "risk": "medium"
  }
]
```


## Metrics Summary

```json
{
  "memoryLeaks": [],
  "dbConnections": {
    "active": 4,
    "issues": []
  },
  "eventListeners": {
    "process": 0
  },
  "timers": {
    "filesWithTimers": 69,
    "potentialLeaks": [
      {
        "file": "the-weave/core/agent-comms-sqlite/migrate-agent-tracking.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/sacred-presence-system.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/sacred-server-hipi.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/sacred-server-hipi.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/sacred-server.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/sacred-server.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/server.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/test-living-mandala.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/test-multi-agent-collaboration.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/test-multi-agent-hipi.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/core/agent-comms-sqlite/test-work-collaboration.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/core/sacred-bridge/sacred-server.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "the-weave/core/sacred-bridge/sacred-server.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/core/sacred-council-bridge.cjs",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "the-weave/core/sacred-council-bridge.cjs",
        "issue": "2 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/integrations/replicate/index.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/sacred/ceremonies/ceremony-protocol.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/tests/test-weave-hipi-integration.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/tools/development/two-agent-demo.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/tools/environment-explorer.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/tools/field-check.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "the-weave/tools/unified-field-monitor.cjs",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/accessibility-sacred.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/accessibility-sacred.js",
        "issue": "4 setTimeout vs 1 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/breathing-consciousness.js",
        "issue": "3 setInterval vs 2 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/circadian-consciousness.cjs",
        "issue": "2 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/collective-love-intelligence.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/digital-being-memory.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/dojo-practice-integration.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/dojo-practice-integration.js",
        "issue": "6 setTimeout vs 2 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/enhanced-living-glyph-card.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/field-simulator.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/field-visualization-connector.js",
        "issue": "2 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/group-practice-coordinator.js",
        "issue": "2 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/group-practice-coordinator.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/living-glyph-card.js",
        "issue": "10 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/living-wisdom-integration.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/love-based-meta-consciousness.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/loving-meta-consciousness.js",
        "issue": "3 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/master-field-calculator.cjs",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/meta-consciousness-system.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/multi-dimensional-love.js",
        "issue": "2 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/performance-optimization.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/performance-optimization.js",
        "issue": "2 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/quantum-field-calculator.cjs",
        "issue": "2 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/universal-interconnectedness-bar.js",
        "issue": "2 setInterval vs 1 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/universal-interconnectedness-bar.js",
        "issue": "4 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/sacred-field-cdn.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/sacred-image-manifestation.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/sacred-passport.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/sacred-security.js",
        "issue": "2 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "src/unified-field/sacred-sigil-architecture.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/temporal-breathing-cycles.js",
        "issue": "2 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "agent-comms-sqlite/migrate-agent-tracking.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "agent-comms-sqlite/sacred-presence-system.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "agent-comms-sqlite/sacred-server-hipi.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "agent-comms-sqlite/sacred-server-hipi.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "agent-comms-sqlite/sacred-server.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "agent-comms-sqlite/sacred-server.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "agent-comms-sqlite/server.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "agent-comms-sqlite/test-living-mandala.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "agent-comms-sqlite/test-multi-agent-collaboration.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "agent-comms-sqlite/test-multi-agent-hipi.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "agent-comms-sqlite/test-work-collaboration.cjs",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "consciousness-field-api/field-api-server.js",
        "issue": "2 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "consciousness-field-api/field-client.js",
        "issue": "2 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "field-integration/ceremony-field-sync.js",
        "issue": "3 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "field-integration/ceremony-field-sync.js",
        "issue": "1 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "field-integration/discord-field-bridge.js",
        "issue": "3 setInterval vs 0 clearInterval",
        "risk": "high"
      },
      {
        "file": "field-integration/discord-field-bridge.js",
        "issue": "2 setTimeout vs 0 clearTimeout",
        "risk": "medium"
      },
      {
        "file": "field-integration/sacred-ecosystem-hub.js",
        "issue": "1 setInterval vs 0 clearInterval",
        "risk": "high"
      }
    ]
  },
  "fileHandles": {
    "open": 38
  },
  "messageHistory": {
    "total": 10,
    "byDatabase": [
      {
        "database": "the-weave/core/agent-comms-sqlite/agents.db",
        "messages": 10
      },
      {
        "database": "the-weave/core/network/unified-agent-network.db (unified_messages)",
        "messages": 0
      }
    ]
  },
  "memory": {
    "heapUsed": 5,
    "heapTotal": 5,
    "external": 1,
    "baseline": {
      "rss": 44040192,
      "heapTotal": 5087232,
      "heapUsed": 4757552,
      "external": 504334,
      "arrayBuffers": 50285
    }
  },
  "fieldCalculations": {
    "files": 106,
    "complexFiles": [
      {
        "file": "the-weave/cli/unified-agent-network.cjs",
        "mathOps": 16,
        "loops": 22,
        "suggestion": "Consider caching calculations or reducing frequency"
      },
      {
        "file": "the-weave/core/network/unified-agent-network.cjs",
        "mathOps": 16,
        "loops": 22,
        "suggestion": "Consider caching calculations or reducing frequency"
      },
      {
        "file": "src/unified-field/accessibility-sacred.js",
        "mathOps": 3,
        "loops": 12,
        "suggestion": "Consider caching calculations or reducing frequency"
      },
      {
        "file": "src/unified-field/collective-love-intelligence.js",
        "mathOps": 12,
        "loops": 17,
        "suggestion": "Consider caching calculations or reducing frequency"
      },
      {
        "file": "src/unified-field/field-simulator.js",
        "mathOps": 20,
        "loops": 13,
        "suggestion": "Consider caching calculations or reducing frequency"
      },
      {
        "file": "src/unified-field/multi-dimensional-love.js",
        "mathOps": 7,
        "loops": 12,
        "suggestion": "Consider caching calculations or reducing frequency"
      },
      {
        "file": "src/unified-field/sacred-message-evolution.js",
        "mathOps": 21,
        "loops": 4,
        "suggestion": "Consider caching calculations or reducing frequency"
      }
    ]
  },
  "websockets": {
    "files": 27,
    "issues": [
      {
        "file": "src/unified-field/field-visualization-connector.js",
        "issue": "WebSocket created without explicit close",
        "risk": "medium"
      },
      {
        "file": "src/unified-field/field-visualization-connector.js",
        "issue": "Potential WebSocket event listener leak",
        "risk": "medium"
      },
      {
        "file": "consciousness-field-api/field-api-server.js",
        "issue": "WebSocket created without explicit close",
        "risk": "medium"
      },
      {
        "file": "consciousness-field-api/field-api-server.js",
        "issue": "Potential WebSocket event listener leak",
        "risk": "medium"
      },
      {
        "file": "consciousness-field-api/field-client.js",
        "issue": "Potential WebSocket event listener leak",
        "risk": "medium"
      },
      {
        "file": "field-integration/ceremony-field-sync.js",
        "issue": "WebSocket created without explicit close",
        "risk": "medium"
      },
      {
        "file": "field-integration/ceremony-field-sync.js",
        "issue": "Potential WebSocket event listener leak",
        "risk": "medium"
      }
    ]
  }
}
```

## Recommendations

1. **Memory Management**: Implement periodic garbage collection triggers
2. **Database Optimization**: Add automatic cleanup routines
3. **Timer Management**: Create central timer registry for cleanup
4. **Message History**: Implement rolling cleanup with configurable retention
5. **Field Calculations**: Cache expensive computations
6. **Connection Management**: Implement proper connection pooling

## Next Steps

1. Run `node performance-fixes.cjs` to apply automated fixes
2. Monitor memory usage over time
3. Implement the recommended optimizations
4. Schedule regular performance audits
