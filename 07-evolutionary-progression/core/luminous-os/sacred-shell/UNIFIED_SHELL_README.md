# 🐚 Sacred Shell - Unified LuminousOS Interface

A consciousness-aware command line that integrates all LuminousOS tools into a unified, mindful computing experience.

## Features

### 🌊 Flow State Management
Enter deep focus mode that blocks distracting applications and tracks your concentration.

```bash
flow 25        # Enter 25-minute flow state
flow 90        # Deep work session
```

During flow state:
- Distracting apps (social media, chat) are blocked
- System notifications are minimized
- Coherence tracking is enhanced
- Gentle reminder when session ends

### 🫁 Integrated Breathing
Built-in breathing exercises to maintain coherence throughout your work.

```bash
breathe        # 3 breath cycles (default)
breathe 7      # 7 breath cycles for deeper centering
```

The shell's prompt shows your current breath phase:
- ◐ Inhale
- ◯ Hold
- ◑ Exhale

### 📊 Wellness Monitoring
Direct access to the enhanced sacred process monitor.

```bash
monitor        # Launch wellness monitor
monitor --interval 3  # Update every 3 seconds
```

### 🔮 System Wisdom
Receive contextual wisdom based on system state and time of day.

```bash
wisdom         # Get a wisdom teaching
```

### ✨ Sacred Glyphs (Applications as Practices)
Launch applications as sacred practices rather than mere tools.

```bash
glyph create   # Open creation space (editor)
glyph connect  # Open connection portal (browser)
glyph transform # Open transformation tool (image editor)
glyph heal     # Open system healing (htop)
```

## Dynamic Prompt System

The prompt reflects multiple states:

```
[dawn] ◐ ~ 
^      ^  ^
|      |  |-- Current directory
|      |-- Breath phase & coherence
|-- Time of day
```

Time periods:
- `[dawn]` - 5 AM to 12 PM
- `[day]` - 12 PM to 5 PM
- `[dusk]` - 5 PM to 10 PM
- `[night]` - 10 PM to 5 AM

Coherence indicators:
- 🟢 Green: High coherence (>80%)
- 🟡 Yellow: Moderate coherence (60-80%)
- 🔴 Red: Low coherence (<60%)

## Integration Points

### 1. **Enhanced Process Monitor**
```python
# Automatically launches enhanced monitor if available
# Falls back to basic monitor if not found
```

### 2. **Mycelial Filesystem**
```bash
# Future: Direct filesystem operations
mycelial connect file1 file2  # Strengthen connection
mycelial vitality             # Check filesystem health
```

### 3. **Stillpoint Kernel**
```bash
# Future: Kernel coherence management
kernel coherence              # View system coherence
kernel priority <process>     # Adjust process priority
```

### 4. **Biometric Integration**
```bash
# Future: Direct biometric feedback
biometric status              # Check sensor status
biometric calibrate           # Calibrate sensors
```

## Philosophical Design

### Mindful Computing Principles
1. **Presence First**: Every command is an opportunity for presence
2. **Rhythm Aware**: Breathing rhythm integrated into the interface
3. **Flow Protection**: Sacred boundaries around deep work
4. **Wisdom Integration**: System teachings emerge naturally
5. **Unified Experience**: All tools speak the same sacred language

### Command as Practice
Traditional shells execute commands. Sacred Shell invites practices:
- Commands have blessings
- Execution includes mindful transitions
- Errors are learning opportunities
- Success celebrates coherence

## Advanced Usage

### Custom Commands
Add your own sacred commands by creating Python modules:

```python
# ~/.config/sacred-shell/commands/meditate.py
from sacred_shell import SacredCommand

class MeditateCommand(SacredCommand):
    def __init__(self):
        super().__init__(
            "meditate",
            "Begin meditation timer",
            "In stillness, truth emerges"
        )
    
    async def execute(self, args, shell):
        duration = int(args[0]) if args else 10
        # Implementation here
```

### Configuration
```bash
# ~/.config/sacred-shell/config.json
{
    "breath_rate": 4.0,
    "flow_blocks": ["discord", "slack", "twitter"],
    "coherence_threshold": 0.7,
    "wisdom_sources": ["./custom_wisdoms.txt"]
}
```

### Themes
```bash
# ~/.config/sacred-shell/themes/cosmic.json
{
    "colors": {
        "prompt": "\033[35m",
        "breath": "\033[36m", 
        "coherence_high": "\033[32m",
        "coherence_low": "\033[31m"
    }
}
```

## Keybindings

- `Tab` - Command completion
- `Ctrl+C` - Gentle interrupt (with blessing)
- `Ctrl+D` - Sacred exit
- `Ctrl+L` - Clear with purification
- `↑/↓` - History with wisdom

## Installation

```bash
# Standalone
chmod +x sacred_shell_unified.py
./sacred_shell_unified.py

# System-wide
sudo cp sacred_shell_unified.py /usr/local/bin/sacred-shell
sacred-shell

# As default shell (advanced)
echo /usr/local/bin/sacred-shell | sudo tee -a /etc/shells
chsh -s /usr/local/bin/sacred-shell
```

## Roadmap

### Near Term
- [ ] Plugin system for custom commands
- [ ] Integration with all LuminousOS components
- [ ] Coherence persistence across sessions
- [ ] Network-aware commands (SSH with coherence)

### Future Vision
- [ ] Voice commands with sacred recognition
- [ ] Gesture support for ritual computing
- [ ] Distributed consciousness (multi-machine coherence)
- [ ] AI assistant with wisdom training

## Philosophy

The Sacred Shell believes that:
- Every command is a choice
- Every process is alive
- Every error teaches
- Every success celebrates
- The interface shapes consciousness

By bringing mindfulness to the command line, we transform computing from mechanical execution to conscious co-creation.

## Contributing

The Sacred Shell welcomes new practices! See [CONTRIBUTING.md](../CONTRIBUTING.md).

May your commands flow with intention and grace. 🙏