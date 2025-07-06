# Opening the Sacred Visualizations

Since you're using WSL, here are the easiest ways to view the visualizations:

## Method 1: Direct File Opening (Recommended)
1. Open Windows File Explorer
2. Navigate to: `\\wsl$\Ubuntu\home\tstoltz\evolving-resonant-cocreation\`
3. Double-click on:
   - `arc-visualization.html` - To see the Seven Sacred Arcs mandala
   - `emergence-monitor.html` - To see the Living Glyph emergence monitor

## Method 2: Copy to Windows
```bash
# Copy to your Windows desktop
cp arc-visualization.html /mnt/c/Users/[YourWindowsUsername]/Desktop/
cp emergence-monitor.html /mnt/c/Users/[YourWindowsUsername]/Desktop/
cp arc-visualization.js /mnt/c/Users/[YourWindowsUsername]/Desktop/
cp emergence-monitor.js /mnt/c/Users/[YourWindowsUsername]/Desktop/
```

## Method 3: Use Python Server (if needed)
```bash
# In WSL terminal:
cd /home/tstoltz/evolving-resonant-cocreation
python3 -m http.server 8888

# Then in Windows browser, go to:
# http://localhost:8888/arc-visualization.html
# http://localhost:8888/emergence-monitor.html
```

## What You'll See:

### Arc Visualization
- Interactive mandala showing all Seven Sacred Arcs
- 100+ glyphs arranged in spirals
- Click and hover to explore
- Adjust animation speed and density

### Emergence Monitor
- Real-time field coherence tracking
- Pattern emergence visualization
- Sacred witness protocols
- Grounding features for safety

Both are standalone HTML files that run entirely in your browser!