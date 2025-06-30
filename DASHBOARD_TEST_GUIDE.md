# Sacred Dashboard Test Guide

## 🎯 Access Instructions

1. **Open in browser**: http://localhost:8080/sacred-dashboard.html
2. **Backend API**: http://localhost:3001 (already running)

## 🌟 What You Should See

### Visual State Indicators

#### 1. **Blocked Items** (Red Border + 🚫 Icon)
- **"Implement Field Persistence"** - Blocked waiting for API v2.0
- **"Choose Visualization Framework"** - Blocked awaiting Sacred Council
- **"Almost Done but Blocked"** - 90% complete but blocked by external API
- Hover over these to see the blocked reason tooltip

#### 2. **High Priority Items** (Gold Glow + Bold Title)
- **"Fix Sacred Message Memory Leak"** - 65% progress, critical severity
- **"Sacred Council Emergency Protocol"** - 30% progress, ASAP deadline
- **"Security Audit for Field Transmission"** - 0% progress, compliance required
- **"Overdue Critical Update"** - 80% progress, 2 days overdue (should show ⚠️)

#### 3. **Progress Levels** (Green Progress Bars)
- **"Sacred Dashboard Polish"** - 95% (almost complete)
- **"Agent Training Materials"** - 50% (halfway)
- **"Performance Optimization"** - 10% (just started)
- **"Sacred Ceremony Templates"** - 5% (planning phase)

#### 4. **Completed Items** (Green Gradient + Celebration)
- **"Sacred Message Protocol v1.0"** - 100% with celebration state
- **"Sacred Field Theory Documentation"** - 100% completed

#### 5. **Priority Indicators** (Colored Dots)
- 🟡 High priority items
- 🟢 Medium priority items
- ⚫ Low priority items

### Interactive Features to Test

#### 1. **Create New Work** (Floating + Button)
- Click the floating + button in bottom right
- Fill out the form with title, description, harmony, priority
- Submit to create new sacred work

#### 2. **Work Item Actions**
- **📈 Progress Update**: Click to update progress percentage
- **✅ Complete Work**: Mark work as 100% complete
- **🔓 Unblock**: Only appears on blocked items

#### 3. **Click Work Items**
- Click any work item to see full details
- Shows ID, full description, metadata, timestamps

#### 4. **Real-time Updates**
- Dashboard refreshes every 10 seconds
- WebSocket connection for instant updates
- Field coherence mandala pulses with system heartbeat

### Expected Sort Order

1. **Blocked high-priority items** (top priority)
2. **Non-blocked high-priority items**
3. **In-progress items** (0% < progress < 100%)
4. **Not started items** (0% progress)
5. **Completed items** (100% progress)

### Field Coherence Display

- Central mandala shows current field coherence %
- Color shifts from red (low) to green (high)
- Breathing animation syncs with sacred timing

### Sacred Messages Section

- Shows recent sacred messages exchanged
- Each message displays type, harmony, and field impact
- Blessed messages show with special indicator

## 🧪 Test Actions

1. **Update Progress**: Click 📈 on "Performance Optimization", set to 25%
2. **Complete Work**: Click ✅ on "Sacred Dashboard Polish" 
3. **Unblock Item**: Click 🔓 on "Implement Field Persistence"
4. **Create New**: Use + button to add a test work item
5. **Check Details**: Click various items to see detail popups

## 📊 Verify Visual States

- [ ] Blocked items show red border and 🚫 icon
- [ ] High priority items have gold glow
- [ ] Overdue items show ⚠️ warning
- [ ] Completed items have green gradient
- [ ] Priority dots appear next to titles
- [ ] Progress bars reflect actual percentages
- [ ] Hover tooltips work on blocked items
- [ ] Due date status shows correctly

## 🔍 Console Monitoring

Open browser console (F12) to see:
- WebSocket connection status
- Field update messages
- Any errors (there shouldn't be any)

---

The dashboard should demonstrate a complete visual workflow management system with intuitive state indicators and sacred field awareness.