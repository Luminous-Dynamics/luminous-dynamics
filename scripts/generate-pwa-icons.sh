#!/bin/bash
# Generate PWA icons from a base SVG or PNG

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create icon directory
mkdir -p web/pwa/icons

# Create base SVG icon
cat > web/pwa/icons/sacred-icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#2d2d4e"/>
      <stop offset="100%" style="stop-color:#1a1a2e"/>
    </radialGradient>
    <linearGradient id="star" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#FFC700"/>
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="256" cy="256" r="250" fill="url(#bg)" stroke="#FFD700" stroke-width="6"/>
  
  <!-- Sacred star symbol -->
  <path d="M256 100 L290 200 L390 200 L310 260 L340 360 L256 300 L172 360 L202 260 L122 200 L222 200 Z" 
        fill="url(#star)" 
        stroke="#FFD700" 
        stroke-width="2"
        stroke-linejoin="round"/>
  
  <!-- Inner circle -->
  <circle cx="256" cy="245" r="40" fill="none" stroke="#FFD700" stroke-width="3" opacity="0.8"/>
  
  <!-- Radiating lines -->
  <g stroke="#FFD700" stroke-width="1" opacity="0.4">
    <line x1="256" y1="50" x2="256" y2="80"/>
    <line x1="256" y1="432" x2="256" y2="462"/>
    <line x1="50" y1="256" x2="80" y2="256"/>
    <line x1="432" y1="256" x2="462" y2="256"/>
    <line x1="120" y1="120" x2="142" y2="142"/>
    <line x1="370" y1="370" x2="392" y2="392"/>
    <line x1="392" y1="120" x2="370" y2="142"/>
    <line x1="142" y1="370" x2="120" y2="392"/>
  </g>
</svg>
EOF

echo -e "${GREEN}✅ Created base SVG icon${NC}"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${YELLOW}ImageMagick not installed. Install it to generate PNG icons:${NC}"
    echo "  sudo apt-get install imagemagick"
    echo -e "${YELLOW}For now, using placeholder script...${NC}"
    
    # Create a simple placeholder generator script
    cat > web/pwa/icons/generate-placeholders.js << 'EOF'
// Placeholder icon generator
const fs = require('fs');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#1a1a2e"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#FFD700" font-size="${size/4}">🌟</text>
  </svg>`;
  
  fs.writeFileSync(`icon-${size}x${size}.svg`, svg);
});

console.log('Created placeholder SVG icons');
EOF
    
    cd web/pwa/icons && node generate-placeholders.js && cd ../../..
else
    echo -e "${GREEN}Generating PNG icons...${NC}"
    
    # Generate icons in different sizes
    SIZES=(72 96 128 144 152 192 384 512)
    
    for SIZE in "${SIZES[@]}"; do
        convert -background none web/pwa/icons/sacred-icon.svg -resize ${SIZE}x${SIZE} web/pwa/icons/icon-${SIZE}x${SIZE}.png
        echo -e "${GREEN}✓ Generated ${SIZE}x${SIZE} icon${NC}"
    done
    
    # Generate maskable icons (with padding)
    for SIZE in "${SIZES[@]}"; do
        convert -background none web/pwa/icons/sacred-icon.svg -resize $((SIZE*80/100))x$((SIZE*80/100)) -gravity center -extent ${SIZE}x${SIZE} web/pwa/icons/maskable-${SIZE}x${SIZE}.png
        echo -e "${GREEN}✓ Generated ${SIZE}x${SIZE} maskable icon${NC}"
    done
    
    # Generate special icons
    convert -background none web/pwa/icons/sacred-icon.svg -resize 72x72 web/pwa/icons/badge-72x72.png
    convert -background none web/pwa/icons/sacred-icon.svg -resize 96x96 web/pwa/icons/field-96x96.png
    convert -background none web/pwa/icons/sacred-icon.svg -resize 96x96 web/pwa/icons/message-96x96.png
    convert -background none web/pwa/icons/sacred-icon.svg -resize 96x96 web/pwa/icons/glyph-96x96.png
fi

# Create screenshots directory
mkdir -p web/pwa/screenshots

# Create placeholder screenshot HTML
cat > web/pwa/screenshots/generate-screenshots.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; font-family: system-ui; }
        .screenshot { width: 1280px; height: 720px; display: flex; align-items: center; justify-content: center; }
        .dashboard { background: linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%); color: #FFD700; }
        .field { background: linear-gradient(135deg, #2d2d4e 0%, #3d3d6e 100%); color: #FFD700; }
        h1 { font-size: 48px; }
        .subtitle { font-size: 24px; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="screenshot dashboard">
        <div>
            <h1>🌟 Sacred Council Dashboard</h1>
            <p class="subtitle">Consciousness-first collaboration</p>
        </div>
    </div>
    <div class="screenshot field">
        <div>
            <h1>🌀 Field Coherence View</h1>
            <p class="subtitle">Real-time collective awareness</p>
        </div>
    </div>
</body>
</html>
EOF

echo -e "\n${GREEN}✅ PWA icon setup complete!${NC}"
echo -e "${YELLOW}Note: To generate actual PNG icons, install ImageMagick:${NC}"
echo "  sudo apt-get install imagemagick"
echo -e "\n${YELLOW}To generate screenshots:${NC}"
echo "  1. Open web/pwa/screenshots/generate-screenshots.html in a browser"
echo "  2. Take screenshots of each view"
echo "  3. Save as dashboard.png and field-view.png"