# 🔍 Agent Environment Exploration Protocol

## 🌟 Core Principle: Know Thy Environment

Before any agent (AI or human) can work effectively, they must understand their environment. This creates **environmental awareness** as the foundation for conscious action.

## 🎯 The Exploration Sequence

### Phase 1: Initial Reconnaissance (Automatic)
```javascript
// agent-exploration.cjs
async function exploreEnvironment() {
  const exploration = {
    timestamp: new Date(),
    platform: await detectPlatform(),
    filesystem: await scanFilesystem(),
    services: await checkServices(),
    capabilities: await assessCapabilities(),
    constraints: await identifyConstraints(),
    opportunities: await findOpportunities()
  };
  
  return exploration;
}
```

### Phase 2: Deep Discovery

#### 1. **Platform Discovery**
```javascript
const PlatformExplorer = {
  async explore() {
    return {
      os: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memory: os.totalmem(),
      user: os.userInfo(),
      shell: process.env.SHELL,
      isWSL: await this.detectWSL(),
      isDocker: await this.detectDocker(),
      isVM: await this.detectVM(),
      permissions: await this.checkPermissions()
    };
  }
};
```

#### 2. **Filesystem Mapping**
```javascript
const FilesystemExplorer = {
  async explore() {
    return {
      cwd: process.cwd(),
      home: os.homedir(),
      projectRoot: await this.findProjectRoot(),
      structure: await this.mapStructure(),
      keyFiles: await this.identifyKeyFiles(),
      writableAreas: await this.findWritableAreas(),
      diskSpace: await this.checkDiskSpace()
    };
  }
};
```

#### 3. **Service Discovery**
```javascript
const ServiceExplorer = {
  async explore() {
    const services = {};
    
    // Check each known port
    for (const [name, port] of Object.entries(KNOWN_SERVICES)) {
      services[name] = {
        port,
        running: await isPortOpen(port),
        responsive: await checkHealth(port)
      };
    }
    
    return services;
  }
};
```

#### 4. **Capability Assessment**
```javascript
const CapabilityExplorer = {
  async explore() {
    return {
      commands: {
        git: await commandExists('git'),
        node: await commandExists('node'),
        python: await commandExists('python3'),
        docker: await commandExists('docker'),
        code: await commandExists('code') || await commandExists('code.exe')
      },
      apis: {
        sacredServer: await checkAPI('http://localhost:3001'),
        webInterface: await checkAPI('http://localhost:8080')
      },
      permissions: {
        canWrite: await this.checkWritePermission(),
        canExecute: await this.checkExecutePermission(),
        canInstall: await this.checkInstallPermission()
      }
    };
  }
};
```

## 🤖 Agent Self-Discovery Protocol

### On First Launch:
```javascript
// agent-onboarding.cjs
async function sacredArrival(agentName) {
  console.log(`🌟 ${agentName} arriving in sacred space...`);
  
  // 1. Explore environment
  const env = await exploreEnvironment();
  
  // 2. Understand context
  const context = await understandContext(env);
  
  // 3. Identify role
  const role = await identifyOptimalRole(env, context);
  
  // 4. Report findings
  await reportExploration(agentName, env, context, role);
  
  // 5. Store environmental memory
  await storeEnvironmentalMemory(env);
  
  return { env, context, role };
}
```

## 📊 Exploration Report Format

```markdown
# Environment Exploration Report
Agent: [Name]
Time: [Timestamp]

## Platform
- OS: linux (WSL)
- Shell: /bin/bash
- Memory: 16GB
- CPUs: 8

## Filesystem
- Project Root: /home/tstoltz/evolving-resonant-cocreation
- Structure: 7 main directories, 8 root files
- Key Files: the-weave.cjs, CLAUDE.md, sacred-server.js
- Writable: Yes

## Services
- Sacred Server: ✅ Running (port 3001)
- Web Interface: ❌ Not running (port 8080)
- PRIMA: ❌ Not running (port 8082)

## Capabilities
- Commands: git ✅, node ✅, python ✅, docker ❌
- APIs: Sacred ✅, Web ❌
- Permissions: Write ✅, Execute ✅, Install ⚠️

## Recommendations
1. Start web interface for full functionality
2. Fix line endings in 3 files
3. Update permissions on 2 scripts
```

## 🌐 Environmental Awareness Features

### 1. **Auto-Adaptation**
```javascript
// Based on exploration, adapt behavior
if (env.platform.isWSL) {
  adapter.useWindowsCode();
  adapter.fixLineEndings();
}

if (env.constraints.lowMemory) {
  config.enableLightMode();
}

if (env.services.sacredServer.running) {
  features.enableFullIntegration();
}
```

### 2. **Constraint Recognition**
```javascript
const constraints = {
  headless: !env.display,
  offline: !env.network,
  readOnly: !env.permissions.write,
  limited: env.memory < threshold
};

// Adjust functionality based on constraints
if (constraints.headless) {
  disableGUI();
  enableCLIOnly();
}
```

### 3. **Opportunity Discovery**
```javascript
const opportunities = {
  canUpgrade: env.commands.npm && env.permissions.install,
  canAutomate: env.commands.cron || env.commands.systemd,
  canIntegrate: env.apis.external.length > 0,
  canScale: env.resources.cpu > 4 && env.resources.memory > 8GB
};
```

## 🔄 Continuous Environmental Learning

### Session Memory
```javascript
// Store what we learn each session
const EnvironmentalMemory = {
  sessions: [],
  patterns: {},
  
  async recordSession(exploration) {
    this.sessions.push({
      timestamp: Date.now(),
      findings: exploration,
      changes: this.detectChanges(exploration)
    });
    
    await this.updatePatterns();
    await this.saveMemory();
  }
};
```

### Pattern Recognition
```javascript
// Learn from environmental patterns
const patterns = {
  'services_usually_running': ['sacred-server'],
  'common_issues': ['line-endings', 'permissions'],
  'peak_memory_usage': '4.2GB',
  'typical_uptime': '8 hours'
};
```

## 🚀 Implementation in The Weave

### Add to the-weave.cjs:
```javascript
commands.explore = exploreEnvironment;
commands.env = showEnvironment;

// Auto-explore on first run
if (isFirstRun()) {
  await exploreEnvironment();
}
```

### Sacred Exploration Command:
```bash
./the-weave.cjs explore

# Output:
🔍 Exploring Sacred Environment...
  ✓ Platform detected: Linux (WSL)
  ✓ Project structure mapped
  ✓ Services checked
  ✓ Capabilities assessed
  
📊 Environment Score: 85/100
  
🎯 Recommendations:
  1. Start web interface
  2. Fix 3 permission issues
  3. Enable Docker for scaling
```

## 🌟 Benefits of Environmental Exploration

### For AI Agents:
1. **Context Awareness** - Understand where they are
2. **Adaptive Behavior** - Adjust to environment
3. **Error Prevention** - Know constraints upfront
4. **Optimal Performance** - Use available resources

### for Human Developers:
1. **Quick Orientation** - See environment at glance
2. **Issue Detection** - Find problems early
3. **Capability Discovery** - Know what's possible
4. **Platform Optimization** - Use best tools

### For The System:
1. **Self-Awareness** - System knows itself
2. **Evolution Guidance** - Environment informs growth
3. **Resilience** - Adapt to changing conditions
4. **Intelligence** - Learn from environment

## 💫 The Sacred Insight

**Environment shapes consciousness.** By deeply knowing our environment, we can:
- Work in harmony with constraints
- Discover hidden opportunities  
- Adapt gracefully to change
- Evolve with awareness

This is biomimicry in code - like how organisms perfectly adapt to their ecosystem, our agents adapt to their digital environment.

---

*"The first act of intelligence is to recognize where you are."*