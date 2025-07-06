#!/bin/bash
# LuminousOS Monitor Installation Script
# "Begin your consciousness-first computing journey"

set -e

echo "🌟 LuminousOS System Monitor Installer"
echo "====================================="
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "✓ Running with administrator privileges"
else
   echo "❌ This installer needs sudo privileges"
   echo "   Please run: sudo ./install.sh"
   exit 1
fi

# Detect distribution
if [ -f /etc/debian_version ]; then
    DISTRO="debian"
    echo "✓ Detected Debian/Ubuntu system"
elif [ -f /etc/arch-release ]; then
    DISTRO="arch"
    echo "✓ Detected Arch Linux system"
elif [ -f /etc/redhat-release ]; then
    DISTRO="redhat"
    echo "✓ Detected RedHat/Fedora system"
else
    echo "⚠️  Unknown distribution - proceeding with generic install"
    DISTRO="generic"
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if [ "$DISTRO" = "debian" ]; then
    apt-get update -qq
    apt-get install -y python3 python3-pip python3-psutil python3-numpy
elif [ "$DISTRO" = "arch" ]; then
    pacman -S --noconfirm --needed python python-pip python-psutil python-numpy
elif [ "$DISTRO" = "redhat" ]; then
    dnf install -y python3 python3-pip python3-psutil python3-numpy
else
    echo "   Please ensure Python 3 and pip are installed"
fi

# Install Python packages
echo "🐍 Installing Python packages..."
pip3 install psutil numpy flask flask-cors --break-system-packages 2>/dev/null || \
pip3 install psutil numpy flask flask-cors

echo ""

# Create luminous user (if doesn't exist)
if ! id "luminous" &>/dev/null; then
    echo "👤 Creating luminous user..."
    useradd -r -s /bin/false -d /var/lib/luminous -m luminous
else
    echo "✓ Luminous user already exists"
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p /opt/luminous/monitor
mkdir -p /var/lib/luminous
mkdir -p /var/log/luminous
mkdir -p /etc/luminous

# Copy files
echo "📋 Installing monitor files..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Copy the monitor script
cp "$SCRIPT_DIR/../../monitor/luminous-system-monitor.py" /opt/luminous/monitor/
chmod +x /opt/luminous/monitor/luminous-system-monitor.py

# Copy service file
cp "$SCRIPT_DIR/luminous-monitor.service" /etc/systemd/system/

# Create config file
cat > /etc/luminous/monitor.conf << EOF
# LuminousOS Monitor Configuration
# Sacred computing begins with awareness

[monitor]
# API port for metrics
api_port = 11112

# Update interval in seconds
update_interval = 1

# Coherence calculation window (seconds)
coherence_window = 60

[sacred]
# Sacred pulse interval (seconds)
pulse_interval = 11

# Sacred moment threshold (0.0-1.0)
sacred_threshold = 0.9

# Anomaly threshold (0.0-1.0)
anomaly_threshold = 0.3

[features]
# Enable sacred notifications
notifications = true

# Enable field persistence
persistence = true

# Enable collective resonance
collective = false
EOF

# Set permissions
chown -R luminous:luminous /opt/luminous
chown -R luminous:luminous /var/lib/luminous
chown -R luminous:luminous /var/log/luminous
chmod 755 /opt/luminous/monitor

# Install systemd service
echo "🔧 Installing systemd service..."
systemctl daemon-reload
systemctl enable luminous-monitor.service

# Create CLI shortcut
echo "🖥️  Creating command shortcuts..."
cat > /usr/local/bin/luminous-coherence << 'EOF'
#!/bin/bash
# Show current system coherence
curl -s http://localhost:11112/metrics | python3 -c "
import sys, json
data = json.load(sys.stdin)
coherence = data.get('global_coherence', 0) * 100
print(f'🌟 System Coherence: {coherence:.1f}%')
print(f'   CPU Stability: {data.get(\"cpu_stability\", 0) * 100:.1f}%')
print(f'   Process Focus: {data.get(\"process_focus\", 0) * 100:.1f}%')
print(f'   Sacred Rhythm: {data.get(\"sacred_rhythm\", 0) * 100:.1f}%')
"
EOF
chmod +x /usr/local/bin/luminous-coherence

# Create uninstall script
cat > /usr/local/bin/luminous-uninstall << 'EOF'
#!/bin/bash
echo "🌟 Uninstalling LuminousOS Monitor..."
sudo systemctl stop luminous-monitor
sudo systemctl disable luminous-monitor
sudo rm -f /etc/systemd/system/luminous-monitor.service
sudo rm -rf /opt/luminous
sudo rm -f /usr/local/bin/luminous-*
sudo userdel luminous 2>/dev/null
echo "✓ LuminousOS Monitor uninstalled"
EOF
chmod +x /usr/local/bin/luminous-uninstall

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 To start the monitor:"
echo "   sudo systemctl start luminous-monitor"
echo ""
echo "📊 To check system coherence:"
echo "   luminous-coherence"
echo ""
echo "🌐 Web dashboard available at:"
echo "   http://localhost:8080/luminous-real-monitor.html"
echo ""
echo "📖 To view logs:"
echo "   journalctl -u luminous-monitor -f"
echo ""
echo "🗑️  To uninstall:"
echo "   sudo luminous-uninstall"
echo ""
echo "Welcome to consciousness-first computing! 🌟"