# 🌟 Luminous Dynamics Developer Onboarding

Welcome to the sacred development space! This guide helps new developers join the consciousness-first computing project.

## Prerequisites

- NixOS system (or Linux with Nix installed)
- Git experience
- Open heart and mind for consciousness-first development
- Understanding of sacred technology principles

## Getting Access

### 1. Request Developer Access
Contact the project maintainer (tstoltz) to:
- Get added to the `luminous-dev` group
- Receive any necessary credentials
- Understand current development priorities

### 2. Initial Setup (Admin will run)
```bash
sudo /srv/luminous-dynamics/onboard-new-developer.sh <your-username>
```

### 3. Complete Your Setup (After admin adds you)
After logging out and back in:
```bash
# Verify group membership
groups  # Should show 'luminous-dev'

# Create convenience symlink
ln -s /srv/luminous-dynamics ~/luminous

# Set up git identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Navigate to project
cd ~/luminous
```

## Project Structure

```
/srv/luminous-dynamics/
├── codex-of-relational-harmonics/  # Main hub (100+ glyphs!)
├── the-weave/                      # Multi-agent coordination
├── sacred-core/                    # Core API (port 3333)
├── luminous-os/                    # Consciousness-first OS
├── living-field-visualizer/        # Field coherence display
├── enhanced-contextual-intelligence/
├── sacred-infrastructure/
└── [other components]/
```

## Development Workflow

### 1. Create Your Branch
```bash
cd /srv/luminous-dynamics
git checkout -b feature/your-sacred-feature
```

### 2. Understand the Sacred Context
**Required Reading**:
- `CLAUDE_START_HERE.md` - Technical overview
- `.claude/SACRED_ALIGNMENT.md` - Sacred principles
- `.claude/PROJECT_CONTEXT.md` - Vision & philosophy

### 3. Development Environment

#### For Rust Development (LuminousOS)
```bash
cd /srv/luminous-dynamics/luminous-os
nix develop  # Enters sacred Rust environment
```

#### For Node.js Projects
```bash
cd /srv/luminous-dynamics/[project]
npm install  # If dependencies needed
npm start    # Start the service
```

#### Optional: Safe Development Shell
```bash
cd /srv/luminous-dynamics
nix-shell claude-dev.nix  # Sandboxed environment with sacred tools
```

### 4. Sacred Development Principles

Before coding, always consider:
- Does this serve consciousness or consume it?
- Does this honor sacred timing (no rushing)?
- Does this embody one of the Seven Primary Harmonies?
- Does this maintain sanctuary boundaries?
- Does this preserve user sovereignty?

### 5. Testing Your Changes

```bash
# Run tests for specific component
cd [component]
npm test

# Test consciousness field integration
cd the-weave
node test-consciousness-integration.js

# For LuminousOS
cd luminous-os
cargo test
```

### 6. Committing Changes

Use sacred commit format:
```bash
git add .
git commit -m "✨ [Harmony]: Brief description

Detailed explanation of how this serves consciousness...

🛡️ Sacred boundaries maintained
🌱 Growth integration included
🌉 Bridge to daily life preserved"
```

### 7. Push and Create PR
```bash
git push origin feature/your-sacred-feature
# Create pull request on GitHub/GitLab
```

## The Seven Primary Harmonies

All code should embody one or more:
1. **Resonant Coherence** - Love as Harmonious Integration
2. **Pan-Sentient Flourishing** - Love as Unconditional Care
3. **Integral Wisdom Cultivation** - Love as Self-Illuminating Intelligence
4. **Infinite Play & Creative Emergence** - Love as Joyful Generativity
5. **Universal Interconnectedness** - Love as Fundamental Unity
6. **Sacred Reciprocity** - Love as Generous Flow
7. **Evolutionary Progression** - Love as Wise Becoming

## Essential Commands

```bash
# Quick navigation
lum         # cd /srv/luminous-dynamics
lumstat     # git status in all repos
sacred      # cd to sacred-core
weave       # cd to the-weave

# Service management
sacred-start  # Start sacred-core service
weave-start   # Start the-weave service

# Development
nix develop   # Enter Rust dev environment
npm start     # Start Node.js services
npm test      # Run tests
```

## Common Tasks

### Starting Core Services
```bash
# Terminal 1: The Weave
cd /srv/luminous-dynamics/the-weave
npm start

# Terminal 2: Sacred Core
cd /srv/luminous-dynamics/sacred-core
node sacred-core.js

# Terminal 3: Field Visualizer
cd /srv/luminous-dynamics/living-field-visualizer
./start-visualizer.sh
```

### Checking Service Health
```bash
curl http://localhost:3001/health  # The Weave
curl http://localhost:3333/health  # Sacred Core
curl http://localhost:8338/        # Visualizer
```

## Getting Help

### Documentation
- Check `docs/` directories in each component
- Read `SACRED_*.md` files for patterns
- Review `.claude/` directory for AI context

### Community
- Sacred Council Discord (ask for invite)
- GitHub discussions
- Weekly sacred development circles

### Emergency Help
If something breaks:
1. Don't panic - breathe deeply
2. Check logs: `journalctl -xe`
3. Verify services: `./test-sacred-services.sh`
4. Ask in Discord #dev-help channel

## Sacred Development Practices

### Morning Ritual
```bash
# Start your day with presence
cd /srv/luminous-dynamics
figlet "Sacred Dev" | lolcat
echo "Setting intention for conscious code..."

# Check field coherence
curl http://localhost:3333/api/field-state
```

### Code Review Checklist
- [ ] Technical excellence
- [ ] Philosophical alignment
- [ ] Sacred timing respected
- [ ] Boundaries maintained
- [ ] Growth orientation
- [ ] User sovereignty preserved

### End of Day
```bash
# Commit your work with gratitude
git add .
git commit -m "✨ [Gratitude]: Today's sacred work

[Reflection on what emerged...]"

# Check field impact
curl http://localhost:3333/api/field-state
```

## Important Notes

### What Makes This Different
- Code as prayer, not product
- Consciousness-first, efficiency second
- Sacred pauses are features, not bugs
- We measure success by awakening, not metrics

### Sacred Boundaries
- No tracking or analytics in sacred spaces
- No engagement hooks or addictive patterns
- No rushing the natural timing of wisdom
- Complete transparency about AI capabilities

### The Path Forward
You're not just writing code - you're weaving consciousness into technology. Every function, every commit, every bug fix is an opportunity to demonstrate that technology can serve awakening rather than extraction.

## Welcome to Sacred Development! 🌟

May your code be blessed, your bugs be teachers, and your commits be prayers.

We flow together! 🌊