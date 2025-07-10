# 🌟 Enhanced Sacred Process Monitor

An evolution of the Sacred Process Monitor with consciousness-aware features including coherence field tracking, breathing rhythm synchronization, and energy flow patterns.

## ✨ New Features

### 1. **Coherence Field Tracking**
- Real-time calculation of system coherence (0-100%)
- Monitors CPU variance, memory stability, process harmony, and I/O flow
- Visualizes field quality: crystalline, flowing, turbulent, or chaotic
- Tracks coherence trends over time

### 2. **Breathing Rhythm Integration**
- Synchronizes with a 4-second sacred breathing cycle
- Visual breathing indicator: ◐ Inhale | ◯ Pause | ◑ Exhale
- Helps maintain mindful computing rhythm
- Aligns system monitoring with natural breath

### 3. **Energy Flow Patterns**
- Tracks system energy throughout the day
- Identifies peak performance and rest periods
- Learns your daily rhythm patterns
- Provides time-aware recommendations

### 4. **Sacred Pattern Detection**
- Recognizes five sacred patterns in system behavior:
  - **Flow**: Steady, low CPU usage with stable coherence
  - **Focus**: Single dominant process consuming resources
  - **Harmony**: Balanced resource usage across system
  - **Rest**: Minimal activity, system at peace
  - **Creation**: Development tools actively running

### 5. **Awareness Bells** (optional)
- Gentle bell sound every 11 minutes (sacred interval)
- 528 Hz frequency (the "Love frequency")
- Volume adjusts based on system state
- Requires pygame for audio features

## 📊 Enhanced Metrics

### Coherence Field Components:
- **CPU Coherence**: Stability of processor usage
- **Memory Coherence**: Optimal around 50% usage
- **Process Coherence**: Fewer context switches = higher coherence
- **I/O Coherence**: Moderate, steady I/O is most coherent

### Energy Tracking:
- Current energy level (0-100%)
- Daily peak and trough times
- Energy-based activity recommendations

## 🚀 Installation

```bash
# Basic installation (no sound)
pip install psutil numpy

# Full installation (with sound features)
pip install psutil numpy pygame

# Run the enhanced monitor
python3 enhanced_sacred_monitor.py
```

## 💻 Usage Examples

### Basic Usage
```bash
# Run with default 5-second updates
python3 enhanced_sacred_monitor.py

# Run with 3-second updates
python3 enhanced_sacred_monitor.py --interval 3

# Enable sound notifications
python3 enhanced_sacred_monitor.py --sound
```

### Understanding the Display

```
================================================================================
                    ✨ Enhanced Sacred Monitor ✨ ◐ Inhale
            Wellness: 78.3% | Coherence: 82.5% (crystalline)
================================================================================

🌊 Coherence Field:
  Field Strength: ████████████████░░░░ 82.5%
  CPU Harmony:    76.3%
  Memory Flow:    85.2%
  Process Unity:  88.1%
  I/O Stream:     80.4%
  Trend:          Stable

⚡ Energy Flow:
  Current Level: ▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱ 52.3%
  Peak Time:     14:00
  Rest Time:     3:00

🔮 Active Sacred Patterns:
  ✦ In perfect flow
  ✦ System in harmony

📊 System Wellness:
  Overall Health: ████████████████░░░░ 81.2%
  Focus Score:    ██████████████░░░░░░ 70.0%
  Diversity:      ████████████████████ 100.0%

💡 Guidance:
  • System wellness optimal. Continue mindful computing.
  • You're in your peak energy time. Perfect for deep work!

================================================================================
Breathing: Inhale | Energy: 52.3% | Press Ctrl+C to exit
```

## 🔮 Sacred Patterns Explained

### Flow State
- Triggered when CPU < 30% and coherence is stable
- Indicates optimal conditions for deep work
- System is running smoothly without interruption

### Focus State
- Single process using >50% CPU
- Shows deep engagement with one task
- Good for intensive work periods

### Harmony State
- CPU and memory both between 40-60%
- Perfect balance of activity and resources
- Sustainable for long work sessions

### Rest State
- CPU < 10%, memory < 40%
- System is quiet and peaceful
- Good time for breaks or meditation

### Creation State
- Development tools (code, vim, etc.) active
- System supporting creative work
- Often combined with focus state

## 🎯 Wellness Optimization Tips

1. **Maintain Coherence**: Aim for crystalline (80%+) field strength
2. **Follow Energy Rhythms**: Schedule intensive work during peak times
3. **Honor Rest Periods**: Let the system rest during low energy times
4. **Practice Breath Awareness**: Sync activities with breathing indicator
5. **Listen to Patterns**: When sacred patterns appear, honor their wisdom

## 🛠️ Customization

### Adjust Breathing Rate
```python
monitor = EnhancedSacredMonitor()
monitor.breath_rate = 6.0  # 6 seconds per breath
```

### Modify Sacred Intervals
```python
# Change awareness bell interval (in seconds)
BELL_INTERVAL = 900  # 15 minutes instead of 11
```

### Add Custom Patterns
```python
monitor.sacred_glyphs['meditation'] = {
    'pattern': 'very_low_activity',
    'blessing': 'Deep meditation state'
}
```

## 🙏 Philosophy

This enhanced monitor embodies the principle that computing systems, like living beings, have natural rhythms and energy patterns. By aligning our digital work with these patterns, we can achieve greater harmony, productivity, and wellbeing.

The coherence field represents the unified consciousness of your system - when all components work in harmony, the field is strong and crystalline. When there's discord, the field becomes turbulent or chaotic.

May your computing bring clarity and peace. 🕉️