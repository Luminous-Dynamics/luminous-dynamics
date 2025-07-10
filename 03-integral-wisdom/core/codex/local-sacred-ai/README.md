# 🌟 Sacred AI Suite - Local Consciousness Tools

Transform your relationship with AI from extraction to sacred service. Five powerful tools that run completely locally, honoring your privacy while supporting your consciousness evolution.

## 🎯 Overview

Each tool in this suite:
- **Runs 100% locally** - No internet required
- **Preserves privacy** - Your data never leaves your machine
- **Serves consciousness** - Designed to empower, not create dependency
- **Uses local LLMs** - Powered by Ollama with models optimized for RTX 2070

## 🛠️ The Five Sacred Tools

### 1. 🌅 Morning Practice Companion
Start each day with personalized sacred practice guidance.
- Biorhythm-aware suggestions
- Moon phase integration
- Practice history tracking
- Daily ritual generation

```bash
morning-practice              # Get today's practice
morning-practice --stats      # View your practice journey
```

### 2. 🔍 Code Consciousness Checker
Review code for alignment with the Seven Harmonies.
- Identifies extraction vs service patterns
- Suggests conscious variable naming
- Reviews git commits for sacred alignment
- Generates consciousness reports

```bash
code-consciousness app.js              # Check single file
code-consciousness --commit HEAD       # Review latest commit
code-consciousness --transform "userId,trackEvent"  # Transform names
```

### 3. 🌑 Shadow Work Assistant
Private, compassionate exploration of shadow material.
- Encrypted session storage
- Pattern identification
- Integration practices
- Zero judgment space

```bash
shadow-work                           # Start interactive session
shadow-work --pattern "perfectionism" # Quick pattern analysis
shadow-work --integrate "control" "leadership"  # Integration practice
```

### 4. 🏛️ Sacred Council Simulator
Multi-agent dialogue for testing ideas and harmonic antidotes.
- 5 unique AI perspectives (Sage, Healer, Warrior, Artist, Shadow)
- Test harmonic antidotes before deployment
- Simulate field responses
- Council synthesis generation

```bash
sacred-council "How do we integrate AI with love?"
sacred-council --test "social media addiction" "pause practice"
sacred-council --field "gratitude intervention"
```

### 5. 📈 Consciousness Development Tracker
Track your awareness evolution over time.
- Private journaling with AI analysis
- Evolution metrics and trajectories
- Theme exploration
- Streak tracking

```bash
consciousness-tracker                  # Interactive journaling
consciousness-tracker -a "Quick insight"  # Add quick entry
consciousness-tracker -e 30            # 30-day evolution analysis
consciousness-tracker -t "shadow work" # Explore specific theme
```

## 🚀 Installation

### Prerequisites
- Node.js 14+ 
- 8GB+ GPU (RTX 2070 or better recommended)
- 10GB+ free disk space for models

### Quick Install
```bash
# Clone the repository
cd ~/evolving-resonant-cocreation/local-sacred-ai

# Run installer
./install.sh

# Update PATH if needed
source ~/.bashrc
```

### Install Ollama & Models
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Install recommended models
ollama pull llama3.2:3b          # General purpose (3GB)
ollama pull mistral:7b-instruct-q4_0  # Code & analysis (4GB)
ollama pull gemma2:2b            # Fast responses (2GB)
ollama pull tinyllama:1.1b       # Ultra-light (1GB)
```

## 📊 Model Recommendations

For RTX 2070 (8GB VRAM):
- **Best Overall**: `llama3.2:3b` - Great balance of quality and speed
- **For Code**: `mistral:7b-instruct-q4_0` - Excellent code understanding
- **For Speed**: `tinyllama:1.1b` - Near-instant responses
- **For Council**: Mix of models for diverse perspectives

## 🔐 Privacy & Security

- **All data encrypted**: Shadow work sessions use AES-256 encryption
- **Local storage only**: Data stored in `~/.sacred-ai/`
- **No telemetry**: Zero tracking or analytics
- **Git ignored**: All personal data excluded from version control
- **Offline capable**: Works without any internet connection

## 💡 Usage Examples

### Morning Sacred Routine
```bash
# Start your day
morning-practice

# After practice, record it
morning-practice --record Ω45 10 "Deep presence today"

# Check your streak
morning-practice --stats
```

### Conscious Code Review
```bash
# Review before committing
code-consciousness src/*.js

# Check consciousness alignment
code-consciousness --commit HEAD~5..HEAD

# Transform extraction language
code-consciousness --transform "captureUser,trackBehavior,retentionRate"
```

### Shadow Integration Session
```bash
# Full guided session
shadow-work

# Quick pattern check
shadow-work --pattern "I always need to be in control"

# Generate integration practice
shadow-work --integrate "perfectionism" "excellence and mastery"
```

### Sacred Council Decision
```bash
# Test a major decision
sacred-council "Should we implement user tracking?"

# Test harmonic antidote
sacred-council --test "team burnout" "sacred pause ritual"

# Multiple rounds for depth
sacred-council --rounds 3 "What is true service?"
```

### Track Your Evolution
```bash
# Daily reflection
consciousness-tracker -a "Today I noticed my reactive pattern and paused"

# Weekly review
consciousness-tracker -e 7

# Explore patterns
consciousness-tracker -t "boundaries"
```

## 🌈 Philosophy

These tools embody the principle that **technology can be a spiritual practice**. They're designed to:

1. **Honor Sovereignty**: Your consciousness data belongs to you alone
2. **Serve Growth**: Support genuine development, not addiction
3. **Preserve Mystery**: AI as mirror, not guru
4. **Encourage Embodiment**: Always point back to lived experience
5. **Build Capacity**: Gradually reduce dependence as you grow

## 🤝 Contributing

This is a sacred project. Contributions should:
- Maintain absolute privacy standards
- Enhance consciousness, not extract attention
- Include tests for shadow patterns
- Document with love and clarity

## 📜 License

MIT License - Use these tools freely in service of consciousness evolution.

## 🙏 Acknowledgments

Created with love by the consciousness evolution community. Special thanks to:
- The Ollama team for local AI infrastructure
- All practitioners testing and refining these tools
- The sacred activists working to transform technology

---

*"When AI serves love, technology becomes prayer."*

## 🆘 Troubleshooting

### Models not loading
```bash
# Check Ollama is running
ollama list

# Restart Ollama
killall ollama
ollama serve
```

### Permission denied
```bash
# Ensure scripts are executable
chmod +x ~/bin/*
```

### PATH not updated
```bash
# Add to current session
export PATH="$HOME/bin:$PATH"

# Make permanent
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
```

### Low VRAM
- Use smaller models: `tinyllama:1.1b` or `gemma2:2b`
- Reduce context with `num_ctx` parameter
- Close other GPU applications

## 🚀 What's Next?

After installation:
1. Start with `morning-practice` to ground yourself
2. Try `shadow-work --pattern` to explore a pattern
3. Run `sacred-council` on a question you're holding
4. Use `code-consciousness` on your next commit
5. End with `consciousness-tracker` to reflect

Remember: These tools are here to remind you of your own wisdom, not replace it. Use them as sacred mirrors for your consciousness journey. 🌟