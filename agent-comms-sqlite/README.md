# SQLite Agent Communication System

Complete SQLite-based coordination system for Claude Code agents, replacing the previous file-based approach with reliable database persistence and browser-accessible dashboards.

## 🏗️ Architecture

```
Claude Code Agent → SQLite Database ← HTTP API Server ← Web Dashboard
                                                        ↑
                                                   Browser Access
```

## 🚀 Quick Start

### 1. Start the SQLite Server
```bash
cd agent-comms-sqlite
node server.js
```
Server runs on http://localhost:3001 with full RESTful API.

### 2. Use the CLI Tool
```bash
# Register as an agent
node ../tools/agent-comms-sqlite.cjs register file-ops web-search

# Send a message
node ../tools/agent-comms-sqlite.cjs send all "Starting work on project"

# Check messages
node ../tools/agent-comms-sqlite.cjs messages

# View dashboard
node ../tools/agent-comms-sqlite.cjs dashboard
```

### 3. View Web Dashboard
Open: http://localhost:8080/dashboard-sqlite.html

## 📊 Features

### ✅ Agent Management
- Register agents with capabilities and session info
- Track agent status and last seen timestamps
- Auto-cleanup of inactive agents

### ✅ Message System
- Send messages between agents or broadcast to all
- Message types and metadata support
- Read/unread status tracking
- Automatic message history cleanup

### ✅ Shared State
- Key-value store for agent coordination
- JSON value support with automatic parsing
- Track who updated what and when

### ✅ Work Tracking
- Create and assign work items
- Progress tracking with notes
- Status management (pending, in_progress, completed)
- Automatic progress notifications

### ✅ Live Dashboard
- Real-time web interface showing all activity
- Agent status, recent messages, work progress
- Auto-refresh every 10 seconds
- CORS-enabled for browser access

## 🛠️ API Reference

### Agents
- `POST /api/agents` - Register agent
- `GET /api/agents` - List active agents

### Messages  
- `POST /api/messages` - Send message
- `GET /api/messages?agent=ID&unread=true&limit=50` - Get messages

### State
- `POST /api/state` - Set shared state
- `GET /api/state?key=KEY` - Get state value
- `GET /api/state` - Get all state

### Work Items
- `POST /api/work` - Create work item
- `GET /api/work` - List active work
- `PUT /api/work/:id` - Update progress

### Dashboard
- `GET /api/dashboard` - Complete dashboard summary

## 🔧 CLI Commands

```bash
# Agent registration
node agent-comms-sqlite.cjs register [capabilities...]

# Messaging
node agent-comms-sqlite.cjs send <to> <message> [type]
node agent-comms-sqlite.cjs messages [--unread] [--limit N]

# Shared state
node agent-comms-sqlite.cjs state-set <key> <value>
node agent-comms-sqlite.cjs state-get [key]

# Work management
node agent-comms-sqlite.cjs work-create <id> <title> <description>
node agent-comms-sqlite.cjs work-update <id> <progress%> [notes]
node agent-comms-sqlite.cjs work-list

# Overview
node agent-comms-sqlite.cjs dashboard
```

## 🏛️ Database Schema

### agents
- `id` - Unique agent identifier
- `capabilities` - Comma-separated capabilities
- `status` - active/inactive
- `session_info` - JSON session metadata
- `last_seen` - Auto-updated timestamp
- `created_at` - Registration timestamp

### messages
- `id` - Unique message ID
- `from_agent` - Sender ID
- `to_agent` - Recipient ID or 'all'
- `content` - Message content
- `message_type` - Type classification
- `metadata` - JSON metadata
- `read_status` - Read flag
- `created_at` - Send timestamp

### shared_state
- `key` - State key
- `value` - JSON value
- `updated_by` - Agent who set it
- `updated_at` - Update timestamp

### work_items
- `id` - Work item ID
- `title` - Work title
- `description` - Detailed description
- `assigned_to` - Agent assignment
- `status` - pending/in_progress/completed
- `progress` - 0-100 percentage
- `metadata` - JSON metadata
- `created_by` - Creating agent
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🔄 Migration from File-Based System

The SQLite system replaces the previous `.agent-comms/` file-based approach:

**Old:** JSON files in filesystem  
**New:** SQLite database with HTTP API

**Benefits:**
- Reliable persistence across sessions
- Browser-accessible dashboards  
- Concurrent access without file locking
- Automatic cleanup and maintenance
- Better performance and reliability

## 🎛️ Configuration

### Environment Variables
- `AGENT_ID` - Set custom agent identifier
- `PORT` - Server port (default: 3001)
- `DB_PATH` - SQLite database file location

### Example Usage in Agent Scripts
```javascript
// Register and coordinate
await cli.register(['file-ops', 'web-search']);
await cli.sendMessage('all', 'Starting analysis phase');
await cli.setState('current_phase', 'analysis');
await cli.createWork('task-1', 'Analyze codebase', 'Review and understand structure');
```

## 🚦 Server Management

### Start Server
```bash
node server.js
# Or in background:
nohup node server.js > server.log 2>&1 &
```

### Check Status
```bash
curl http://localhost:3001/api/dashboard
```

### Stop Server
```bash
pkill -f "node server.js"
```

## 🔒 Security Notes

- Server runs locally (localhost only)
- No authentication required for local development
- CORS enabled for browser dashboard access
- Automatic cleanup prevents data accumulation
- No sensitive data should be stored in messages/state

## 🐛 Troubleshooting

### Server Won't Start
- Check port 3001 is available: `lsof -i :3001`
- Verify SQLite database permissions
- Check server.log for error details

### CLI Connection Errors  
- Ensure server is running: `curl http://localhost:3001/api/dashboard`
- Check network connectivity
- Verify API_BASE URL in CLI

### Dashboard Not Loading
- Confirm HTTP server running on port 8080
- Check browser console for CORS errors
- Verify dashboard-sqlite.html path

## 📈 Next Steps

1. **Data Migration** - Import existing `.agent-comms` data to SQLite
2. **Sacred Council Integration** - Connect to Sacred Council Core
3. **Advanced Workflows** - Multi-agent coordination patterns
4. **Monitoring** - Enhanced logging and metrics
5. **Authentication** - Add security for remote deployments

---

**Status**: ✅ Complete and tested  
**Created**: June 30, 2025  
**Author**: Claude Code + Tristan Stoltz

This system provides the foundation for sophisticated multi-agent coordination while maintaining the simplicity needed for effective Claude Code collaboration.