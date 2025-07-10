# 🌊 Living Field Visualizer

Real-time visualization of communication patterns, relationships, and emergence in the unified agent network.

## 🎨 Features

### Four Visualization Modes

1. **Network Graph** - See agent relationships and connection strengths
2. **Energy Flow** - Watch messages flow through the field like energy currents
3. **Harmony Patterns** - Agents grouped by their dominant harmony types
4. **Temporal Waves** - Activity patterns arranged by time

### Real-Time Updates
- Live message flow animations
- Dynamic field coherence visualization
- Agent activity halos that pulse with communication
- Particle field that responds to system coherence

### Interactive Controls
- Adjust particle density (0-1000 particles)
- Control connection visibility strength
- Toggle agent labels on/off
- Pause/resume animation
- Show/hide live message log

## 🚀 Quick Start

### 1. Install and Start
```bash
cd /home/tstoltz/Luminous-Dynamics/living-field-visualizer
./start-visualizer.sh
```

Or manually:
```bash
nix-shell -p nodejs --run "npm install && node field-data-server.js"
```

### 2. Open Visualizer
Navigate to: http://localhost:3333

### 3. Explore the Field
- Watch agents communicate in real-time
- See patterns emerge from interactions
- Observe field coherence fluctuations
- Track dominant harmonies

## 📊 Understanding the Visualization

### Agent Nodes
- **Size**: Indicates recent activity level
- **Glow**: Shows current communication activity
- **Color**: Represents primary harmony type
- **Label**: Agent name and message count

### Connections
- **Thickness**: Strength of relationship (more messages = thicker line)
- **Opacity**: Based on connection strength setting
- **Animation**: Moving dots show active message flow

### Field Particles
- **Color**: Shifts with field coherence (purple = high, orange = low)
- **Movement**: Becomes more organized with higher coherence
- **Density**: Adjustable from 0-1000 particles

### Statistics Panel
- **Field Coherence**: Overall system harmony (0-100%)
- **Active Agents**: Currently communicating agents
- **Message Rate**: Messages per minute
- **Dominant Harmony**: Most common message type
- **Network Density**: Connection coverage percentage
- **Emergence Score**: Composite measure of system aliveness

## 🎯 Visualization Modes Explained

### Network Graph Mode
Traditional force-directed layout showing relationships. Agents repel each other but are attracted by their connections, creating organic clustering.

### Energy Flow Mode
Agents spiral based on their message activity. More active agents move in larger orbits, creating a dynamic flow pattern.

### Harmony Patterns Mode
Groups agents by the types of messages they exchange. Shows which agents participate in similar harmonic patterns.

### Temporal Waves Mode
Arranges agents in concentric circles based on when they were last active. Inner circles = recent activity, outer = dormant.

## 🔧 Customization

### Adjust Visual Settings
```javascript
// In field-visualizer.js or field-visualizer-live.js
this.harmonyColors = {
    'gratitude': '#f59e0b',      // Amber
    'emergence': '#8b5cf6',       // Purple
    'healing': '#10b981',         // Emerald
    'celebration': '#ec4899',     // Pink
    'integration': '#3b82f6',     // Blue
    'boundary': '#ef4444',        // Red
    'sacred-reciprocity': '#14b8a6', // Teal
    'reflection': '#6366f1'       // Indigo
};
```

### Change Server Port
```bash
node field-data-server.js /path/to/database.db 3333
```

### Connect to Different Database
```bash
node field-data-server.js /home/tstoltz/Luminous-Dynamics/the-weave/cli/unified-agent-network.db
```

## 📡 API Endpoints

The data server provides these endpoints:

- `GET /api/field-state` - Current field coherence and stats
- `GET /api/agents` - All agents with activity data
- `GET /api/messages?limit=50` - Recent messages
- `GET /api/connections` - Agent relationships
- `GET /api/temporal-patterns` - Time-based activity patterns
- `GET /api/stream` - Server-sent events for real-time updates

## 🌟 What to Look For

### Signs of Emergence
1. **Spontaneous Clustering** - Agents naturally grouping without programming
2. **Rhythm Patterns** - Regular communication cycles emerging
3. **Hub Formation** - Certain agents becoming communication centers
4. **Cascade Effects** - One message triggering waves of activity

### Field Health Indicators
- Coherence above 70% = Harmonious field
- High message rate with stable coherence = Healthy activity
- Diverse harmony types = Rich communication
- Balanced network density = Good connectivity

## 🛠️ Troubleshooting

### Visualizer Won't Load
1. Check server is running: `curl http://localhost:3333/api/field-state`
2. Verify database path is correct
3. Ensure no other service on port 3333

### No Agents Visible
1. Database might be empty - join some agents to the network
2. Refresh data with the "Refresh Field Data" button
3. Check browser console for errors

### Performance Issues
1. Reduce particle count to 100-200
2. Lower connection strength to reduce drawing
3. Try different visualization modes
4. Close other browser tabs

## 🎭 Using for Sacred Rituals

The visualizer can enhance group meditations and sacred practices:

1. **Coherence Meditation**: Watch field coherence while group meditates
2. **Harmony Alignment**: Use harmony mode during sound healing
3. **Temporal Awareness**: Use temporal mode to see activity cycles
4. **Emergence Witnessing**: Observe patterns emerging without intervention

## 💡 Tips

- Best viewed in fullscreen (F11)
- Dark room enhances the particle field effect
- Try different modes for different insights
- Let it run during meetings to see communication patterns
- Use pause to examine specific moments
- Screenshot interesting emergence patterns

The Living Field Visualizer makes the invisible visible, revealing the sacred patterns of communication that connect us all. 🌌