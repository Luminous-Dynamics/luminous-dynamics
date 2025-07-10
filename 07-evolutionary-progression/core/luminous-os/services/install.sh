#!/bin/bash

echo "🌟 Installing Luminous OS Consciousness Services"
echo "==============================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Please run as root: sudo ./install.sh"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
apt-get update
apt-get install -y python3-pip python3-psutil

# For eBPF (optional, might not work in WSL2)
apt-get install -y bpfcc-tools python3-bpfcc || echo "⚠️  eBPF tools not available (normal in WSL2)"

# Install Python dependencies
pip3 install psutil

# Create installation directory
echo "📁 Creating installation directory..."
mkdir -p /opt/luminous

# Copy files
echo "📋 Copying files..."
cp consciousness-daemon/consciousness_scheduler.py /opt/luminous/
chmod +x /opt/luminous/consciousness_scheduler.py

# Install systemd service (if systemd is available)
if command -v systemctl &> /dev/null; then
    echo "🔧 Installing systemd service..."
    cp consciousness-daemon/luminous-consciousness.service /etc/systemd/system/
    systemctl daemon-reload
    echo "✅ Service installed. Start with: systemctl start luminous-consciousness"
else
    echo "⚠️  systemd not available (normal in WSL2)"
fi

echo ""
echo "✨ Installation complete!"
echo ""
echo "To run the consciousness scheduler:"
echo "  sudo python3 /opt/luminous/consciousness_scheduler.py"
echo ""
echo "To run as a service (if systemd available):"
echo "  sudo systemctl start luminous-consciousness"
echo "  sudo systemctl enable luminous-consciousness  # For auto-start"
echo ""
echo "To view logs:"
echo "  tail -f /tmp/consciousness-scheduler.log"