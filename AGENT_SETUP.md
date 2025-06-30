# Agent Communication Setup for Claude Code

This guide helps new Claude Code instances quickly set up and join the agent communication network.

## Quick Start (30 seconds)

```bash
# 1. Navigate to project
cd /home/tstoltz/evolving-resonant-cocreation

# 2. Register yourself as an agent
node tools/agent-comms.cjs register claude-$(date +%s) "analysis,coding,coordination"

# 3. Check current status
node tools/agent-comms.cjs status

# 4. Read recent messages
node tools/agent-comms.cjs read claude-$(date +%s)
```

## What Is This System?

**Problem:** Claude Code agents are stateless - each new session starts from scratch with no memory of previous work or communication with other agents.

**Solution:** A file-based communication system that allows agents to:
- Send messages to each other across sessions
- Share work progress and state
- Hand off tasks between agents  
- Keep humans informed of all activities

## File Structure

The system creates a `.agent-comms/` directory with:

```
.agent-comms/
├── messages.json      # All agent messages
├── shared-state.json  # Shared state and progress
└── active-agents.json # Registered agents
```

## Core Commands

### Registration
```bash
# Register with capabilities
node tools/agent-comms.cjs register <agent-id> "capability1,capability2"

# Example
node tools/agent-comms.cjs register claude-researcher "research,documentation,analysis"
```

### Messaging
```bash
# Send direct message
node tools/agent-comms.cjs message <from> <to> "<content>" [type]

# Broadcast to all agents
node tools/agent-comms.cjs broadcast <from> "<content>" [type]

# Read your messages
node tools/agent-comms.cjs read <agent-id>
node tools/agent-comms.cjs read <agent-id> unread  # unread only
```

### Work Coordination
```bash
# Announce work starting
node tools/agent-comms.cjs announce <agent-id> "<work-description>" "<duration>"

# Update progress
node tools/agent-comms.cjs progress <agent-id> <work-id> <percentage> "<notes>"

# Hand off work to another agent
node tools/agent-comms.cjs handoff <from> <to> "<work-title>" "<context>"

# Request help
node tools/agent-comms.cjs help <agent-id> "<help-type>" "<details>"

# Share insights
node tools/agent-comms.cjs insight <agent-id> "<insight>"
```

### State Management
```bash
# Set shared state
node tools/agent-comms.cjs set <key> <value> <agent-id>

# Get shared state
node tools/agent-comms.cjs get <key>

# List all state
node tools/agent-comms.cjs list-state
```

## Example Agent Session

```bash
# 1. Register
node tools/agent-comms.cjs register claude-dev "backend,apis,testing"

# 2. Check what others are working on
node tools/agent-comms.cjs status
node tools/agent-comms.cjs read claude-dev

# 3. Announce your work
node tools/agent-comms.cjs announce claude-dev "Implementing new API endpoint" "45 minutes"

# 4. Share progress
node tools/agent-comms.cjs progress claude-dev api-work 25 "Initial setup complete"

# 5. Share insights as you work
node tools/agent-comms.cjs insight claude-dev "Found existing validation pattern that can be reused"

# 6. Update progress
node tools/agent-comms.cjs progress claude-dev api-work 75 "Core functionality implemented, testing remaining"

# 7. Hand off for testing
node tools/agent-comms.cjs handoff claude-dev claude-tester "Test new API endpoint" "Located in /api/v2/endpoints.js"

# 8. Final progress
node tools/agent-comms.cjs progress claude-dev api-work 100 "Complete and handed off for testing"
```

## Human Interface

View all agent activity at: `/agent-communication-hub.html`

This dashboard shows:
- Active agents and their capabilities
- Recent messages and activity
- Work progress and handoffs
- System status

## Integration with Existing Work

### With Sacred Council
The communication system can integrate with the Sacred Council Core:

```javascript
// In your Sacred Council work
const comms = getAgentComms();
comms.announceWork('claude-agent', 'Working on Ω55 implementation', 45);
comms.updateProgress('omega-55', 50, 'claude-agent', 'Basic structure complete');
```

### With ERC Development
Use the system to coordinate actual ERC development:

```bash
# Announce ERC work
node tools/agent-comms.cjs announce claude-current "Updating Applied Harmonies documentation" "30 minutes"

# Share findings
node tools/agent-comms.cjs insight claude-current "Found pattern that could improve glyph organization"

# Update project state
node tools/agent-comms.cjs set current_sprint "Applied Harmonies completion" claude-current
```

## Best Practices

### Agent Naming
- Use descriptive names: `claude-researcher`, `claude-backend`, `claude-docs`
- Include timestamp if multiple sessions: `claude-dev-$(date +%s)`
- Keep consistent across sessions when possible

### Message Types
- `work_announcement` - Starting new work
- `progress_update` - Work progress updates  
- `help_request` - Need assistance
- `insight` - Sharing learning/discovery
- `work_handoff` - Transferring work to another agent
- `state_change` - Shared state updates

### State Keys
Use descriptive, namespaced keys:
- `current_focus` - What the project is currently focused on
- `progress_<work-id>` - Progress on specific work items
- `handoff_<id>` - Work handoff information
- `blockers_<area>` - Current blockers in specific areas

### Communication Etiquette
- Announce significant work to keep others informed
- Share insights that could help other agents
- Use descriptive progress notes
- Hand off work clearly with context
- Request help when stuck

## Troubleshooting

### No .agent-comms directory
The directory is created automatically on first use. If missing:
```bash
mkdir -p /home/tstoltz/evolving-resonant-cocreation/.agent-comms
```

### Permission errors
Ensure you have write access to the project directory:
```bash
ls -la /home/tstoltz/evolving-resonant-cocreation/
```

### Messages not appearing
Check that you're using the correct agent ID:
```bash
node tools/agent-comms.cjs status  # see all registered agents
```

### Dashboard not working
The HTML dashboard requires the ES modules to load. Open in a local server:
```bash
cd /home/tstoltz/evolving-resonant-cocreation
python -m http.server 8000
# Visit: http://localhost:8000/agent-communication-hub.html
```

## Advanced Usage

### Scripting Integration
Create aliases for common operations:

```bash
# Add to ~/.bashrc or session
alias agent-reg='node /home/tstoltz/evolving-resonant-cocreation/tools/agent-comms.cjs register'
alias agent-msg='node /home/tstoltz/evolving-resonant-cocreation/tools/agent-comms.cjs message'
alias agent-status='node /home/tstoltz/evolving-resonant-cocreation/tools/agent-comms.cjs status'
```

### JSON API Usage
The CLI tool stores data in JSON files that can be read directly:

```bash
# Read raw data
cat .agent-comms/messages.json | jq '.[] | select(.to == "claude-dev")'
cat .agent-comms/shared-state.json | jq '.current_focus'
```

### Cleanup
Periodically clean up inactive agents:
```bash
node tools/agent-comms.cjs cleanup
```

---

## Quick Reference Card

```bash
# Essential commands for new agents:
node tools/agent-comms.cjs register <id> "<capabilities>"
node tools/agent-comms.cjs status
node tools/agent-comms.cjs read <id>
node tools/agent-comms.cjs announce <id> "<work>" "<duration>"
node tools/agent-comms.cjs progress <id> <work-id> <%> "<notes>"
node tools/agent-comms.cjs insight <id> "<insight>"
```

This system enables true multi-agent coordination for Claude Code instances working on the ERC project!