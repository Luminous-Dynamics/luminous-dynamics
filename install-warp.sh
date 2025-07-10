#!/usr/bin/env bash
# Install Warp Terminal on NixOS using AppImage

set -e

echo "🚀 Installing Warp Terminal for LuminousOS Development..."

# Create directories
mkdir -p ~/Applications ~/.local/share/applications

# Download Warp AppImage
echo "📥 Downloading Warp..."
cd ~/Applications
wget -O Warp.AppImage "https://app.warp.dev/download/linux/appimage/x86_64/stable"
chmod +x Warp.AppImage

# Create desktop entry
cat > ~/.local/share/applications/warp.desktop << 'EOF'
[Desktop Entry]
Name=Warp Terminal
Comment=AI-powered terminal for consciousness-first development
Exec=/home/tstoltz/Applications/Warp.AppImage
Icon=warp
Type=Application
Categories=Development;System;TerminalEmulator;
Terminal=false
StartupNotify=true
EOF

echo "✅ Warp Terminal installed!"
echo "🌟 Launch with: ~/Applications/Warp.AppImage"
echo "💡 Or find it in your application menu"