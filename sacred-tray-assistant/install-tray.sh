#!/bin/bash

# 🌟 Sacred AI System Tray Installer

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${PURPLE}🌟 Installing Sacred AI System Tray${NC}"
echo "===================================="
echo ""

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo -e "${CYAN}Python version: $PYTHON_VERSION${NC}"

# Install required packages
echo -e "${YELLOW}Installing required packages...${NC}"

# System packages
sudo apt-get update > /dev/null 2>&1
sudo apt-get install -y python3-pip python3-tk python3-pil python3-pil.imagetk libnotify-bin > /dev/null 2>&1

# Python packages
pip3 install --user pystray pillow pynput requests

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Create desktop entry
DESKTOP_FILE="$HOME/.local/share/applications/sacred-ai-tray.desktop"
cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Name=Sacred AI Assistant
Comment=Local AI assistant in system tray
Exec=python3 $PWD/sacred_tray.py
Icon=$PWD/icon.png
Terminal=false
Type=Application
Categories=Utility;AI;
StartupNotify=true
StartupWMClass=sacred-ai
EOF

echo -e "${GREEN}✅ Desktop entry created${NC}"

# Create icon
python3 << 'PYTHON_EOF'
from PIL import Image, ImageDraw
import os

# Create icon
size = 256
image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)

# Purple circle
purple = (139, 92, 246, 255)
margin = 20
draw.ellipse([margin, margin, size-margin, size-margin], fill=purple)

# White star
star_color = (255, 255, 255, 255)
cx, cy = size//2, size//2
r1, r2 = 80, 40  # Outer and inner radius
points = []
for i in range(10):
    angle = i * 36 * 3.14159 / 180
    if i % 2 == 0:
        x = cx + r1 * -1 * (-1 if i < 5 else 1) * abs(int(angle))
        y = cy + r1 * -1 * (1 if i < 5 else -1) * abs(int(angle))
    else:
        x = cx + r2 * -1 * (-1 if i < 5 else 1) * abs(int(angle))
        y = cy + r2 * -1 * (1 if i < 5 else -1) * abs(int(angle))
    points.append((x, y))

# Simple star instead
points = [
    (size//2, size//2 - 60),
    (size//2 + 20, size//2 - 20),
    (size//2 + 60, size//2 - 10),
    (size//2 + 25, size//2 + 15),
    (size//2 + 35, size//2 + 55),
    (size//2, size//2 + 30),
    (size//2 - 35, size//2 + 55),
    (size//2 - 25, size//2 + 15),
    (size//2 - 60, size//2 - 10),
    (size//2 - 20, size//2 - 20),
]
draw.polygon(points, fill=star_color)

# Save icon
script_dir = os.path.dirname(os.path.abspath(__file__))
image.save(os.path.join(script_dir, 'icon.png'))
print("✅ Icon created")
PYTHON_EOF

# Create launcher script
cat > launch-sacred-ai.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
python3 sacred_tray.py &
EOF
chmod +x launch-sacred-ai.sh

# Create autostart entry (optional)
AUTOSTART_DIR="$HOME/.config/autostart"
mkdir -p "$AUTOSTART_DIR"
cp "$DESKTOP_FILE" "$AUTOSTART_DIR/"

# Test notification system
notify-send "Sacred AI" "Installation complete! 🌟" 2>/dev/null || echo -e "${YELLOW}Note: Desktop notifications may not work in WSL${NC}"

echo ""
echo -e "${PURPLE}✨ Installation Complete!${NC}"
echo ""
echo -e "${CYAN}To start Sacred AI Tray:${NC}"
echo "1. Run: ./launch-sacred-ai.sh"
echo "2. Or: python3 sacred_tray.py"
echo "3. Or: Click 'Sacred AI Assistant' in applications menu"
echo ""
echo -e "${YELLOW}Features:${NC}"
echo "• System tray icon (may require X server in WSL)"
echo "• Global hotkey: Ctrl+Space"
echo "• Quick chat from clipboard"
echo "• Multiple AI models"
echo "• Sacred, Code, and Wisdom modes"
echo ""
echo -e "${GREEN}The app will auto-start on login${NC}"
echo ""

# For WSL users
if grep -qi microsoft /proc/version; then
    echo -e "${YELLOW}📝 WSL Note:${NC}"
    echo "For system tray to work in WSL, you need:"
    echo "1. An X server (VcXsrv, X410, or WSLg)"
    echo "2. Export DISPLAY=:0"
    echo ""
    echo "Alternatively, the app works great as a regular window!"
fi