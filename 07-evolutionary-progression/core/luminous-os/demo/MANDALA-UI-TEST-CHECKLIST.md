# 🧪 Mandala UI WebGL Test Checklist

## Visual Elements to Verify

### 1. **Background Sacred Patterns** ✓
- [ ] Flower of Life pattern visible and animating
- [ ] Sri Yantra triangles rotating slowly
- [ ] Pattern opacity changes with coherence slider
- [ ] Smooth animation without flickering

### 2. **Coherence Field Visualization** ✓
- [ ] Wave interference patterns visible
- [ ] Field responds to participant positions
- [ ] Schumann resonance (7.83 Hz) base frequency
- [ ] Emergence sparkles appear at >90% coherence
- [ ] Sacred boundary glow at field edges

### 3. **Torus Field** ✓
- [ ] Torus shape visible and rotating
- [ ] Breathing with the breath phase
- [ ] Color changes with coherence level
- [ ] Smooth donut-shaped energy flow

### 4. **Platonic Solids** ✓
- [ ] Different solids appear based on coherence:
  - [ ] Tetrahedron (low coherence)
  - [ ] Cube (medium coherence)
  - [ ] Octahedron (higher coherence)
  - [ ] Dodecahedron (high coherence)
  - [ ] Icosahedron (maximum coherence)

### 5. **Central Merkaba** ✓
- [ ] Star tetrahedron visible in center
- [ ] Rotating based on time
- [ ] Scaling with coherence level
- [ ] Glowing effect increases with coherence

### 6. **Glyph Ring** ✓
- [ ] 87 glyphs arranged in sacred ring
- [ ] Color coding by category:
  - Blue: Foundational (0-44)
  - Gold: Applied Harmonies (45-55)
  - Purple: Threshold (56-64)
  - Green: Meta-Glyphs (65-86)
- [ ] Selected glyph pulses
- [ ] Glyph names show correctly

### 7. **Particle System** ✓
- [ ] Particles flowing in 3D space
- [ ] Attracted to center with coherence
- [ ] Respawning at edges
- [ ] Soft particle rendering

## Interactive Controls to Test

### 1. **Coherence Slider** (0-100%)
- [ ] Merkaba scales with coherence
- [ ] Field intensity changes
- [ ] Emergence sparkles at >90%
- [ ] Platonic solids change type
- [ ] Particle attraction increases

### 2. **Breath Phase** (Manual Control)
- [ ] Torus expands/contracts
- [ ] Some geometry pulses with breath
- [ ] Smooth transitions

### 3. **Field Momentum** 
- [ ] Affects animation speed
- [ ] Field dynamics change

### 4. **Participant Controls**
- [ ] "Add Participant" adds up to 13
- [ ] Each participant creates wave source
- [ ] Participant count updates
- [ ] "Remove Participant" works
- [ ] Field complexity increases with participants

### 5. **Glyph Selection**
- [ ] Number input 0-86 selects glyph
- [ ] Selected glyph pulses in ring
- [ ] Glyph name updates correctly
- [ ] Console shows selection message

## Performance Checks

### 1. **Frame Rate**
- [ ] FPS counter shows 60 FPS
- [ ] Smooth animation at default settings
- [ ] No stuttering with 13 participants
- [ ] Performance degrades gracefully

### 2. **WebGL Status**
- [ ] "WebGL2 initialized" shows green
- [ ] Shader count shows correctly
- [ ] No WebGL errors in console

### 3. **Browser Compatibility**
- [ ] Works in Chrome/Chromium
- [ ] Works in Firefox
- [ ] Works in Safari (may need WebGL2 enabled)
- [ ] Mobile browsers (reduced features ok)

## Console Checks (F12)

### 1. **No Errors**
- [ ] No red error messages
- [ ] No shader compilation errors
- [ ] No WebGL context lost errors

### 2. **Expected Messages**
- [ ] Glyph selection logs
- [ ] Participant add/remove logs
- [ ] Initialization success messages

## Edge Cases

### 1. **Extreme Values**
- [ ] 0% coherence - minimal activity
- [ ] 100% coherence - maximum effects
- [ ] Rapid slider changes handled
- [ ] Window resize maintains aspect ratio

### 2. **Interaction Combinations**
- [ ] Multiple participants + high coherence
- [ ] Glyph selection during animation
- [ ] All sliders at maximum
- [ ] Rapid participant add/remove

## Known Limitations

1. **WebGL2 Required** - Older browsers may not support
2. **GPU Performance** - Complex shaders need decent GPU
3. **Max 13 Participants** - Sacred geometry limit
4. **No Touch Controls Yet** - Mouse/keyboard only

## Success Criteria

✅ All visual elements render correctly
✅ All controls respond appropriately  
✅ Performance stays above 30 FPS
✅ No console errors during normal use
✅ Sacred geometry maintains coherence
✅ Field effects create sense of presence

---

*"When all elements dance in harmony, the Mandala UI becomes a living meditation"*