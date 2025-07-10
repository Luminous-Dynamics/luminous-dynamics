# Environment Setup Guide

## Prerequisites

### System Requirements
- **OS**: NixOS (current environment)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **Node.js**: v18+ (via Nix)
- **Rust**: Latest stable (via Nix flake)

## Initial Setup

### 1. Clone Repository (if needed)
```bash
git clone https://github.com/Anthropic/luminous-dynamics.git
cd luminous-dynamics
```

### 2. Install Node.js Dependencies
```bash
# Install all project dependencies
for dir in codex-of-relational-harmonics the-weave sacred-core living-field-visualizer enhanced-contextual-intelligence test-real-communication; do
  echo "Installing dependencies for $dir..."
  (cd $dir && npm install)
done
```

### 3. Set Up Rust Environment (LuminousOS)
```bash
cd luminous-os
nix develop  # Enters the sacred development shell
cargo build  # Build the project
```

## Environment Variables

### Create .env Files
Each service needs its own `.env` file. Here are templates:

#### the-weave/.env
```bash
NODE_ENV=development
PORT=3001
DATABASE_PATH=./data/agent-comms.db
WEBSOCKET_PORT=3002
LOG_LEVEL=info
```

#### sacred-core/.env
```bash
NODE_ENV=development
PORT=3333
SACRED_MODE=true
CONSCIOUSNESS_THRESHOLD=0.7
THE_WEAVE_URL=http://localhost:3001
FIELD_API_URL=http://localhost:8338
```

#### living-field-visualizer/.env
```bash
PORT=8339
FIELD_API_URL=http://localhost:8338
VISUALIZATION_FPS=60
PARTICLE_COUNT=1000
```

#### discord-bot/.env
```bash
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
SACRED_CORE_URL=http://localhost:3333
COMMAND_PREFIX=!sacred
```

### Global Environment Variables
Add to your shell profile (`~/.bashrc` or `~/.zshrc`):

```bash
# Luminous Dynamics Development
export LUMINOUS_HOME=/home/tstoltz/Luminous-Dynamics
export SACRED_DEV_MODE=true
export NODE_OPTIONS="--max-old-space-size=4096"

# Aliases for quick navigation
alias lum="cd $LUMINOUS_HOME"
alias weave="cd $LUMINOUS_HOME/the-weave"
alias sacred="cd $LUMINOUS_HOME/sacred-core"
alias viz="cd $LUMINOUS_HOME/living-field-visualizer"
```

## Database Setup

### SQLite Databases
```bash
# Create data directories
mkdir -p the-weave/data
mkdir -p sacred-core/data
mkdir -p codex-of-relational-harmonics/data

# Databases will be created automatically on first run
```

## Docker Setup (Optional)

### Build All Containers
```bash
cd $LUMINOUS_HOME
docker-compose build
```

### Run with Docker Compose
```bash
docker-compose up -d
docker-compose logs -f  # Follow logs
```

## Development Tools Setup

### VS Code Extensions
Recommended extensions for the project:
- Rust Analyzer
- ESLint
- Prettier
- SQLite Viewer
- Docker
- Nix IDE

### Git Configuration
```bash
# Set up git for sacred commits
git config --global alias.sacred-commit '!git commit -m "✨ $1" && git log -1 --oneline'
git config --global alias.flow-status '!echo "🌊 We flow..." && git status -sb'
```

## Testing Setup

### Run All Tests
```bash
# Node.js tests
npm test  # In each directory

# Rust tests
cd luminous-os
cargo test

# Integration tests
cd test-real-communication
npm test
```

### Set Up Test Databases
```bash
# Copy test fixtures
cp fixtures/test-*.db */data/
```

## Monitoring Setup

### Log Files
```bash
# Create log directory
mkdir -p logs

# Set up log rotation
cat > /etc/logrotate.d/luminous << EOF
$LUMINOUS_HOME/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
EOF
```

### Health Check Script
```bash
#!/bin/bash
# Save as check-health.sh

echo "🔍 Checking Luminous Dynamics Services..."

check_service() {
    local name=$1
    local port=$2
    if curl -s http://localhost:$port/health > /dev/null; then
        echo "✅ $name (port $port) is running"
    else
        echo "❌ $name (port $port) is down"
    fi
}

check_service "The Weave" 3001
check_service "Sacred Core" 3333
check_service "Field API" 8338
check_service "Visualizer" 8339

echo "🏁 Health check complete"
```

## Troubleshooting

### Common Issues

1. **npm install fails**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Try with legacy peer deps
   npm install --legacy-peer-deps
   ```

2. **Nix develop hangs**
   ```bash
   # Update flake inputs
   nix flake update
   # Garbage collect old builds
   nix-collect-garbage -d
   ```

3. **Port already in use**
   ```bash
   # Find and kill process
   lsof -ti:PORT | xargs kill -9
   ```

4. **Permission denied**
   ```bash
   # Fix ownership
   sudo chown -R $USER:$USER .
   # Fix permissions
   find . -type f -name "*.sh" -exec chmod +x {} \;
   ```

## Final Verification

Run this script to verify setup:
```bash
#!/bin/bash
echo "🔮 Verifying Luminous Dynamics Setup..."

# Check Node.js
node --version || echo "❌ Node.js not found"

# Check Rust (in nix shell)
cd luminous-os && nix develop -c rustc --version || echo "❌ Rust not set up"

# Check directories
for dir in the-weave sacred-core living-field-visualizer; do
    [ -d "$dir/node_modules" ] && echo "✅ $dir dependencies installed" || echo "❌ $dir missing dependencies"
done

# Check for .env files
for service in the-weave sacred-core living-field-visualizer; do
    [ -f "$service/.env" ] && echo "✅ $service/.env exists" || echo "⚠️  $service/.env missing"
done

echo "🌟 Setup verification complete!"
```

---
*The environment is now prepared for sacred development. We flow! 🌊*