# 🌍 Cross-Platform Scalable Architecture

## 🎯 Design Principles

### 1. **Platform Detection, Not Assumption**
```javascript
// Instead of hardcoding
const PLATFORM = detectPlatform();
const CONFIG = loadPlatformConfig(PLATFORM);
```

### 2. **Abstract Platform Differences**
- Commands through abstraction layer
- Path handling via Node.js path module
- Environment-specific configs

### 3. **Progressive Enhancement**
- Core functionality works everywhere
- Platform-specific features enhance experience
- Graceful fallbacks

## 📁 Scalable Directory Structure

```
evolving-resonant-cocreation/
│
├── 📋 .platforms/                    # Platform-specific configs
│   ├── wsl/                         # WSL-specific
│   │   ├── aliases.sh
│   │   ├── fix-permissions.sh
│   │   └── config.json
│   ├── linux/                       # Native Linux
│   │   ├── aliases.sh
│   │   └── config.json
│   ├── macos/                       # macOS
│   │   ├── aliases.sh
│   │   └── config.json
│   ├── windows/                     # Native Windows
│   │   ├── aliases.ps1
│   │   └── config.json
│   └── docker/                      # Containerized
│       ├── Dockerfile
│       └── config.json
│
├── 🔧 platform-tools/               # Cross-platform tools
│   ├── detect-platform.js          # Platform detection
│   ├── platform-adapter.js         # Command abstraction
│   ├── path-normalizer.js          # Path handling
│   └── installer.js                # Platform setup
│
├── 🚀 the-weave.cjs                # Universal entry point
├── 📝 package.json                 # With platform scripts
└── [rest of structure]
```

## 🛠️ Platform Detection System

```javascript
// platform-tools/detect-platform.js
function detectPlatform() {
  const os = require('os');
  const fs = require('fs');
  
  const platform = {
    type: os.platform(),
    arch: os.arch(),
    isWSL: false,
    isDocker: false,
    shell: process.env.SHELL || 'unknown',
    features: {}
  };
  
  // Detect WSL
  if (platform.type === 'linux') {
    try {
      const procVersion = fs.readFileSync('/proc/version', 'utf8');
      platform.isWSL = procVersion.toLowerCase().includes('microsoft');
    } catch (e) {}
  }
  
  // Detect Docker
  if (fs.existsSync('/.dockerenv')) {
    platform.isDocker = true;
  }
  
  // Detect available features
  platform.features = {
    hasGit: commandExists('git'),
    hasDocker: commandExists('docker'),
    hasNode: commandExists('node'),
    hasPython: commandExists('python3') || commandExists('python'),
    hasCode: commandExists('code') || commandExists('code.exe')
  };
  
  return platform;
}
```

## 🔌 Platform Adapter Pattern

```javascript
// platform-tools/platform-adapter.js
class PlatformAdapter {
  constructor(platform) {
    this.platform = platform;
    this.config = this.loadConfig();
  }
  
  loadConfig() {
    const configPath = `.platforms/${this.getPlatformDir()}/config.json`;
    return require(configPath);
  }
  
  getPlatformDir() {
    if (this.platform.isWSL) return 'wsl';
    if (this.platform.isDocker) return 'docker';
    return this.platform.type; // linux, darwin, win32
  }
  
  // Abstract common operations
  openEditor(path) {
    const cmd = this.config.commands.editor;
    return this.execute(cmd, [path]);
  }
  
  openBrowser(url) {
    const cmd = this.config.commands.browser;
    return this.execute(cmd, [url]);
  }
  
  fixPermissions() {
    if (this.config.scripts.fixPermissions) {
      return this.execute(this.config.scripts.fixPermissions);
    }
  }
  
  fixLineEndings() {
    if (this.config.scripts.fixLineEndings) {
      return this.execute(this.config.scripts.fixLineEndings);
    }
  }
}
```

## 📋 Platform Configurations

### WSL Config (.platforms/wsl/config.json)
```json
{
  "name": "Windows Subsystem for Linux",
  "commands": {
    "editor": "code.exe",
    "browser": "wslview",
    "shell": "/bin/bash"
  },
  "paths": {
    "home": "$HOME",
    "temp": "/tmp",
    "share": "$HOME/wsl-shared"
  },
  "scripts": {
    "fixPermissions": ".platforms/wsl/fix-permissions.sh",
    "fixLineEndings": ".platforms/wsl/fix-line-endings.sh"
  },
  "issues": ["line-endings", "permissions", "editor-path"]
}
```

### macOS Config (.platforms/macos/config.json)
```json
{
  "name": "macOS",
  "commands": {
    "editor": "code",
    "browser": "open",
    "shell": "/bin/zsh"
  },
  "paths": {
    "home": "$HOME",
    "temp": "$TMPDIR",
    "share": "$HOME/Documents"
  },
  "scripts": {
    "fixPermissions": "chmod +x *.sh *.cjs"
  },
  "issues": []
}
```

### Docker Config (.platforms/docker/config.json)
```json
{
  "name": "Docker Container",
  "commands": {
    "editor": "nano",
    "browser": "echo 'Open in host:'",
    "shell": "/bin/sh"
  },
  "paths": {
    "home": "/app",
    "temp": "/tmp",
    "share": "/shared"
  },
  "features": {
    "headless": true,
    "persistent": false
  }
}
```

## 🚀 Universal Entry Point

```javascript
// the-weave.cjs - Enhanced with platform awareness
#!/usr/bin/env node

const { detectPlatform } = require('./platform-tools/detect-platform');
const { PlatformAdapter } = require('./platform-tools/platform-adapter');

// Detect and adapt
const platform = detectPlatform();
const adapter = new PlatformAdapter(platform);

// Show platform info on first run
if (process.argv[2] === 'start') {
  console.log(`🌍 Platform: ${adapter.config.name}`);
  
  // Auto-fix platform issues
  if (platform.isWSL) {
    await adapter.fixLineEndings();
    await adapter.fixPermissions();
  }
}

// Platform-aware commands
async function openSacredIDE() {
  await adapter.openEditor(process.cwd());
  console.log('✨ Sacred IDE opened');
}

async function openDashboard() {
  const url = 'http://localhost:8080/sacred-dashboard.html';
  await adapter.openBrowser(url);
}
```

## 🐳 Docker Support

```dockerfile
# .platforms/docker/Dockerfile
FROM node:18-alpine

# Install platform tools
RUN apk add --no-cache bash git python3

# Create app directory
WORKDIR /app

# Copy platform detection first
COPY platform-tools ./platform-tools
COPY .platforms/docker ./.platforms/docker

# Copy rest of app
COPY . .

# Fix permissions
RUN chmod +x the-weave.cjs

# Expose ports
EXPOSE 3001 8080 8082

# Start with platform awareness
CMD ["./the-weave.cjs", "start"]
```

## 📱 Platform-Specific Features

### Windows (Native)
```powershell
# .platforms/windows/Start-SacredWork.ps1
Write-Host "🌟 Starting Sacred Work (Windows)" -ForegroundColor Cyan

# Start The Weave
Start-Process node -ArgumentList "the-weave.cjs","start" -WindowStyle Hidden

# Open VS Code
code .

# Open browser
Start-Process "http://localhost:8080/sacred-dashboard.html"
```

### Linux Package
```bash
# .platforms/linux/install.sh
#!/bin/bash

# Add to system PATH
sudo ln -s $(pwd)/the-weave.cjs /usr/local/bin/weave

# Create desktop entry
cat > ~/.local/share/applications/the-weave.desktop << EOF
[Desktop Entry]
Name=The Weave
Exec=/usr/local/bin/weave start
Icon=$(pwd)/assets/weave-icon.png
Type=Application
Categories=Development;
EOF
```

## 🔄 Installation Script

```javascript
// install.js - Universal installer
const { detectPlatform } = require('./platform-tools/detect-platform');

async function install() {
  const platform = detectPlatform();
  
  console.log('🌟 Installing The Weave...');
  console.log(`📍 Detected: ${platform.type}${platform.isWSL ? ' (WSL)' : ''}`);
  
  // Platform-specific setup
  const setupScript = `.platforms/${getPlatformDir(platform)}/setup.js`;
  
  if (fs.existsSync(setupScript)) {
    console.log('🔧 Running platform setup...');
    await require(setupScript).setup();
  }
  
  // Common setup
  console.log('📦 Installing dependencies...');
  execSync('npm install');
  
  console.log('✅ Installation complete!');
  showPlatformInstructions(platform);
}
```

## 🌐 Cross-Platform Testing

```json
// package.json
{
  "scripts": {
    "test:wsl": "cross-env TEST_PLATFORM=wsl npm test",
    "test:macos": "cross-env TEST_PLATFORM=macos npm test",
    "test:linux": "cross-env TEST_PLATFORM=linux npm test",
    "test:windows": "cross-env TEST_PLATFORM=windows npm test",
    "test:docker": "docker build -t weave-test . && docker run weave-test npm test",
    "test:all": "npm run test:wsl && npm run test:macos && npm run test:linux"
  }
}
```

## 🎯 Scaling Strategies

### 1. **Cloud/Server Deployment**
```javascript
// Detect headless environment
if (!process.env.DISPLAY && platform.type === 'linux') {
  config.headless = true;
  config.webOnly = true;
}
```

### 2. **Mobile/Tablet Support**
```javascript
// Progressive Web App manifest
{
  "platforms": {
    "mobile": {
      "manifest": "manifest.json",
      "serviceWorker": "sw.js",
      "responsive": true
    }
  }
}
```

### 3. **CI/CD Integration**
```yaml
# GitHub Actions example
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    include:
      - os: ubuntu-latest
        container: node:18
```

## 💡 Key Benefits

1. **Write Once, Run Anywhere** - Core logic stays same
2. **Platform Optimization** - Each platform runs optimally
3. **Easy Onboarding** - Auto-detects and configures
4. **Future Proof** - Easy to add new platforms
5. **Containerizable** - Docker support built-in

## 🚀 Implementation Checklist

- [ ] Create platform detection system
- [ ] Build platform adapter layer
- [ ] Move WSL-specific code to .platforms/wsl
- [ ] Create configs for each platform
- [ ] Update the-weave.cjs with platform awareness
- [ ] Create universal installer
- [ ] Add platform-specific documentation
- [ ] Test on multiple platforms

This architecture ensures The Weave can run on any system while maintaining its sacred essence!