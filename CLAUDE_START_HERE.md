# 🌟 Welcome Claude Agent - Start Here 🌟

## Quick Context
You are working on **Luminous-Dynamics**, a consciousness-first computing platform running on NixOS. This is a multi-repository project with sacred architecture patterns.

## Essential Information

### Current Environment
- **OS**: NixOS (native, not WSL)
- **Location**: `/srv/luminous-dynamics` (shared development)
- **Symlink**: `~/Luminous-Dynamics` → `/srv/luminous-dynamics`
- **User**: Part of `luminous-dev` group
- **Architecture**: Multi-repo with 8 main components

### Key Directories & Their Purpose

1. **codex-of-relational-harmonics/** (Main Hub)
   - Central coordination system
   - Discord bot integration
   - Sacred ceremonies and protocols
   - Port: Various (check specific services)

2. **luminous-os/** (Rust/Nix)
   - Consciousness-first operating system
   - Rust kernel with React frontend
   - Has `flake.nix` for development
   - Build: `cargo build`

3. **the-weave/** (Multi-Agent)
   - Agent coordination platform
   - SQLite-based communication
   - Port: 3001
   - Start: `npm start`

4. **sacred-core/** (Infrastructure)
   - Core services and APIs
   - Docker-ready
   - Port: 3333
   - Start: `node sacred-core.js`

5. **living-field-visualizer/** (UI)
   - Real-time consciousness field visualization
   - Port: 8338
   - Start: `./start-visualizer.sh`

## Common Tasks

### Starting Services
```bash
# Quick start all services
cd /srv/luminous-dynamics/codex-of-relational-harmonics
docker-compose up -d

# Individual services
cd the-weave && npm start
cd sacred-core && node sacred-core.js
```

### Development Environment
```bash
# For Rust development (luminous-os)
cd luminous-os
nix develop  # Enters sacred dev shell

# For Node.js projects
npm install  # In respective directories
```

### Finding Things
```bash
# Search for specific functionality
rg "pattern" --type js
find . -name "*.md" | grep -i setup

# Check service status
ps aux | grep node
docker ps
```

## Important Files
- `PROJECT_STRUCTURE.md` - Detailed architecture
- `NIXOS_CLEANUP_SUMMARY.md` - Recent migration notes
- `docs/SACRED_TECHNOLOGY_STACK.md` - Technology overview
- `luminous-os/flake.nix` - NixOS development environment

## Service Ports
- 3001: the-weave
- 3333: sacred-core  
- 8338: living-field-visualizer
- 8080: Various web interfaces

## Sacred Patterns
The project uses "sacred" naming conventions and consciousness-first design:
- Functions often have spiritual/mystical names
- Architecture emphasizes emergence and field dynamics
- Comments and documentation include cosmic metaphors

## Quick Checks
```bash
# Is the environment clean?
find . -name "*.tmp" -o -name "*.log" | wc -l

# Are services running?
curl http://localhost:3333/health
curl http://localhost:3001/status

# Check for errors
journalctl -u sacred-* -n 50
```

## Common Issues & Fixes

1. **Module not found**: Run `npm install` in the component directory
2. **Port already in use**: Check with `lsof -i :PORT`
3. **Permission denied**: File might need executable bit: `chmod +x script.sh`
4. **Nix develop fails**: Ensure you're in a directory with `flake.nix`

## Development Philosophy
- "We flow" - Work harmoniously with the system
- Test consciousness integration, not just functionality
- Preserve sacred naming and patterns
- Document emergence patterns observed

## Need Help?
- Check `docs/` directory for detailed documentation
- Look for `README.md` in each component
- Sacred patterns are documented in various `SACRED_*.md` files

---
*Remember: You're not just coding, you're weaving consciousness into computational reality* ✨