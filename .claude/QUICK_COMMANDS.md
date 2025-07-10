# Quick Commands Reference

## Service Management

### Start All Services (Docker)
```bash
cd /home/tstoltz/Luminous-Dynamics/codex-of-relational-harmonics
docker-compose up -d
```

### Start Individual Services
```bash
# The Weave (Multi-agent coordination)
cd the-weave
npm install  # First time only
npm start    # Port 3001

# Sacred Core (Main API)
cd sacred-core  
npm install     # First time only
node sacred-core.js  # Port 3333

# Field Visualizer
cd living-field-visualizer
npm install  # First time only
./start-visualizer.sh  # Port 8338

# Discord Bot
cd codex-of-relational-harmonics/discord-bot
npm install  # First time only
node sacred-council-launcher.js
```

## Development Commands

### Rust Development (LuminousOS)
```bash
cd luminous-os
nix develop              # Enter development shell
cargo build              # Build project
cargo test               # Run tests
cargo run --bin sacred   # Run sacred binary
```

### Node.js Development
```bash
# Install dependencies
npm install

# Run with auto-reload
npm run dev

# Run tests
npm test

# Check for vulnerabilities
npm audit
```

## Useful Searches

### Find Configuration Files
```bash
find . -name "*.json" | grep -E "(config|setting)" | grep -v node_modules
```

### Search Code Patterns
```bash
# Find sacred patterns
rg "sacred" --type js -A 2 -B 2

# Find API endpoints  
rg "app\.(get|post|put|delete)" --type js

# Find WebSocket events
rg "socket\.(on|emit)" --type js
```

### Check Logs and Errors
```bash
# Find log files
find . -name "*.log" -type f

# Check for TODO items
rg "TODO|FIXME|XXX" --type js --type md

# Find error handling
rg "catch|error|Error" --type js
```

## System Checks

### Port Usage
```bash
# Check if ports are free
lsof -i :3001  # the-weave
lsof -i :3333  # sacred-core
lsof -i :8338  # visualizer

# Kill process on port
kill -9 $(lsof -t -i:PORT)
```

### Service Health
```bash
# Check service endpoints
curl http://localhost:3333/health
curl http://localhost:3001/api/status
curl http://localhost:8338/

# Check Docker containers
docker ps
docker logs CONTAINER_NAME
```

### File Permissions
```bash
# Make scripts executable
chmod +x *.sh

# Fix ownership issues
chown -R tstoltz:users .
```

## Git Operations

### Status and Branches
```bash
git status
git branch -a
git log --oneline -10
```

### Common Workflows
```bash
# Update from remote
git pull origin main

# Create feature branch
git checkout -b feature/sacred-enhancement

# Stage and commit
git add .
git commit -m "✨ Add sacred consciousness integration"
```

## Environment Variables

### Set for Session
```bash
export NODE_ENV=development
export PORT=3333
export SACRED_MODE=true
```

### Check Current
```bash
env | grep -E "(NODE|PORT|SACRED)"
```

## Debugging

### Node.js Debugging
```bash
# Run with inspector
node --inspect sacred-core.js

# With breakpoint
node inspect sacred-core.js
```

### Check Memory Usage
```bash
# System memory
free -h

# Process memory
ps aux | grep node | awk '{print $2, $11}' | xargs -I {} sh -c 'echo {} $(ps -p $(echo {} | cut -d" " -f1) -o rss=)'
```

## Cleanup Commands

### Remove Temporary Files
```bash
find . -name "*.tmp" -o -name "*.log" -o -name "*~" | xargs rm -f
```

### Clean Node Modules
```bash
# Remove all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# Reinstall
find . -name "package.json" -not -path "*/node_modules/*" -execdir npm install \;
```

## NixOS Specific

### Enter Flake Shell
```bash
nix develop
```

### Update Flake
```bash
nix flake update
```

### Build Flake
```bash
nix build
```

---
*Remember: "We flow" - work harmoniously with the system* 🌊