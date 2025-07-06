# 🔧 Known Issues and Fixes

## Current Status: Nearly Ready! 

The system is structurally complete but some dynamic features need attention.

---

## 🚨 Known Issues

### 1. **Practice Flow Links**
- **Issue**: "Begin Practice" buttons may not trigger practice flows
- **Cause**: JavaScript event handlers or missing practice session initialization
- **Fix Needed**: 
  - Verify `onPracticeStepChange` and `onPracticeComplete` callbacks exist
  - Check if `showPracticeInterface()` function is defined
  - Ensure practice timer/progression logic is implemented

### 2. **Sacred Council Connection**
- **Issue**: "Disconnected - Retrying..." message
- **Cause**: Sacred Council containers not running or wrong ports
- **Fix**: 
  - Start Sacred Council Docker containers
  - Or implement standalone mode fallbacks
  - Update connection status to show "Standalone Mode" when offline

### 3. **Progress Tracking**
- **Issue**: Progress may not persist between sessions
- **Cause**: localStorage implementation incomplete
- **Fix Needed**:
  ```javascript
  // Add to practice completion
  function savePracticeProgress(harmonyId, status) {
      const progress = JSON.parse(localStorage.getItem('harmonyProgress') || '{}');
      progress[harmonyId] = status;
      localStorage.setItem('harmonyProgress', JSON.stringify(progress));
  }
  ```

### 4. **Modal Close Buttons**
- **Issue**: Modal X button might not work for all modals
- **Fix**: Ensure all modals have proper event listeners

### 5. **Practice Timer Display**
- **Issue**: No visible timer during practice sessions
- **Cause**: UI for practice session not fully implemented
- **Fix Needed**: Create practice session overlay with:
  - Current step indicator
  - Timer countdown
  - Progress bar
  - Next/Pause buttons

### 6. **Quantum Status Display**
- **Issue**: Quantum status might show as undefined
- **Cause**: Quantum field modules may not initialize properly
- **Fix**: Add error handling and default values

---

## 🛠️ Quick Fixes

### Fix 1: Add Practice Session UI
```javascript
function showPracticeInterface() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'practiceOverlay';
    overlay.className = 'practice-overlay';
    overlay.innerHTML = `
        <div class="practice-container">
            <h2 id="practiceTitle">Practice Session</h2>
            <div class="practice-timer" id="practiceTimer">5:00</div>
            <div class="practice-step" id="practiceStep">Loading...</div>
            <div class="practice-guidance" id="practiceGuidance"></div>
            <button onclick="endPractice()">End Practice</button>
        </div>
    `;
    document.body.appendChild(overlay);
}
```

### Fix 2: Standalone Mode Indicator
```javascript
function updateConnectionStatus(connected) {
    const indicator = document.querySelector('.connection-indicator');
    const statusText = document.getElementById('statusText');
    
    if (!connected) {
        indicator.style.background = '#ffcc00'; // Yellow for standalone
        statusText.textContent = 'Standalone Mode (Full features available offline)';
    }
}
```

### Fix 3: Implement Practice Callbacks
```javascript
function onPracticeStepChange(stepData) {
    console.log('Step changed:', stepData);
    // Update UI with new step
    if (document.getElementById('practiceStep')) {
        document.getElementById('practiceStep').textContent = 
            `Step ${stepData.step}/${stepData.totalSteps}: ${stepData.stepData.title}`;
    }
}

function onPracticeComplete(data) {
    console.log('Practice completed:', data);
    // Save progress
    savePracticeProgress(data.harmonyId, 'complete');
    // Show completion message
    alert(`Practice complete: ${data.harmonyName}`);
    // Remove overlay
    const overlay = document.getElementById('practiceOverlay');
    if (overlay) overlay.remove();
}
```

---

## 📋 Testing Checklist

Before considering "ready":

- [ ] All "Begin Practice" buttons trigger practice flows
- [ ] Practice timer and step progression work
- [ ] Modal windows open and close properly
- [ ] Progress saves to localStorage
- [ ] Standalone mode shows appropriate messaging
- [ ] Constellation maps are clickable and informative
- [ ] Second Breath practices load correctly
- [ ] Quantum enhancements show when available

---

## 🚀 Path to Ready

1. **Implement practice session UI** (overlay with timer)
2. **Add practice completion handlers**
3. **Fix connection status messaging**
4. **Add progress persistence**
5. **Test all 18 practice flows**
6. **Verify quantum enhancement display**
7. **Polish error handling**

---

## 💡 Workarounds for Now

### Manual Testing:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Manually trigger functions:
   ```javascript
   // Test a practice
   practiceHarmony('Ω45');
   
   // Check if systems loaded
   console.log('Practice Flows:', practiceFlows);
   console.log('Emerging Stars:', emergingStarPractices);
   console.log('Quantum:', quantumIntegration);
   ```

### Standalone Usage:
- The dojo works without Sacred Council
- Quantum features gracefully degrade
- Progress tracking works locally

---

## 🎯 Priority Fixes

1. **HIGH**: Practice session UI and flow
2. **HIGH**: Progress saving/loading  
3. **MEDIUM**: Better offline messaging
4. **MEDIUM**: Modal interactions
5. **LOW**: Animation polish
6. **LOW**: Sound effects

---

*The foundation is solid. Just needs the final connections to make everything flow smoothly!*