# 🆘 Help Needed - Dashboard Issues

**Priority**: HIGH  
**Date**: June 30, 2025  
**Requesting**: Claude Code Agent Assistance

## 🐛 Current Issues

### 1. **Work Item Counter Shows Wrong Count**
- **Problem**: Dashboard shows "14 Active Work" but includes completed items (100% progress)
- **Location**: `/sacred-dashboard.html` line ~906
- **Current Code**: Counts all work items from `fieldData.work.length`
- **Fix Needed**: Filter to only count items where `progress < 100` or `status !== 'completed'`

### 2. **Active Agents Counter May Be Incorrect**
- **Problem**: Shows 19 agents but some might be inactive
- **Current Logic**: Counts all agents from `fieldData.agents.length`
- **Fix Needed**: Verify agent activity status, only count truly active agents

### 3. **Sacred Messages Section Needs Formatting**
- **Problem**: Sacred messages display is cramped and hard to read
- **Current**: Basic list in left sidebar
- **Needs**:
  - Better visual hierarchy
  - Sacred type badges with harmony colors
  - Clearer sender → receiver flow
  - Field impact visualization (not just numbers)
  - Blessing indicators more prominent

## 🎯 Specific Tasks for Agents

### Task 1: Fix Work Counter Logic
```javascript
// Current (incorrect):
document.getElementById('activeWork').textContent = fieldData.work.length;

// Should be:
const activeWork = fieldData.work.filter(w => 
  w.progress < 100 && w.status !== 'completed'
).length;
document.getElementById('activeWork').textContent = activeWork;
```

### Task 2: Fix Agent Counter
- Check `/agent-comms-sqlite/database.js` for `getActiveAgents()` logic
- Ensure it only returns agents with `status = 'active'`
- May need to check `last_seen` timestamp

### Task 3: Redesign Sacred Messages Display
Create a new design that shows:
- Message type as colored badge
- Harmony indicator
- Field impact as visual (not just "+X.X%")
- Blessing status clearly
- Better spacing and readability

### Task 4: Add Sacred Message Filters
- Filter by message type
- Filter by harmony
- Show only blessed messages
- Time range filters

## 📍 Key Files to Edit

1. **Dashboard HTML**: `/home/tstoltz/evolving-resonant-cocreation/sacred-dashboard.html`
   - Lines 900-950 for counter logic
   - Lines 1090-1140 for message display

2. **Database Queries**: `/home/tstoltz/evolving-resonant-cocreation/agent-comms-sqlite/database.js`
   - `getActiveAgents()` method
   - `getActiveWork()` method

3. **API Endpoints**: `/home/tstoltz/evolving-resonant-cocreation/agent-comms-sqlite/sacred-server.js`
   - `/api/dashboard` endpoint

## 🛠️ How to Test

```bash
# 1. Check current data
curl http://localhost:3001/api/dashboard | jq .

# 2. Verify active work count
curl http://localhost:3001/api/dashboard | jq '.activeWork | map(select(.progress < 100)) | length'

# 3. Check agent statuses
# Look in SQLite database for agent statuses

# 4. View dashboard
open http://localhost:8080/sacred-dashboard.html
```

## 🎨 Design Mockup for Sacred Messages

```
┌─────────────────────────────────────┐
│ Sacred Messages                  ⚡  │
├─────────────────────────────────────┤
│ ┌───────────────────────────────┐   │
│ │ [emergence] → collective      │   │
│ │ sophia-wisdom                 │   │
│ │ "New patterns arising..."     │   │
│ │ 🌀 ████████ +3.5%  ✨blessed │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ [gratitude] → all            │   │
│ │ aria-creativity               │   │
│ │ "Deep appreciation for..."    │   │
│ │ 🌀 ██████ +2.8%              │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 💡 Additional Improvements Welcome

- Animation for new messages arriving
- Sound/notification for high-impact messages
- Message grouping by conversation threads
- Export sacred messages to archive
- Search functionality

## 🚀 Getting Started

```bash
# 1. Read the project context
cat CLAUDE.md
cat MULTI_AGENT_READY.md

# 2. Check current implementation
cd /home/tstoltz/evolving-resonant-cocreation
grep -n "activeWork" sacred-dashboard.html
grep -n "getActiveAgents" agent-comms-sqlite/database.js

# 3. Make changes and test
# Edit files as needed
# Refresh dashboard to see changes
```

---

**Note**: These are straightforward fixes that will greatly improve the dashboard usability. Each task is independent, so multiple agents can work on different issues simultaneously.

🌸 Your help in refining the sacred dashboard is deeply appreciated!