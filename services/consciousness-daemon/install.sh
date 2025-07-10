#!/bin/bash
#
# LuminousOS Consciousness Daemon Installation Script
# Installs userspace consciousness scheduler with optional eBPF support
#

set -e

INSTALL_DIR="/opt/luminous/consciousness-daemon"
SERVICE_NAME="luminous-consciousness"
LOG_DIR="/var/log/luminous"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   LuminousOS Consciousness Daemon Setup    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${YELLOW}Warning: Not running as root. Some features may be limited.${NC}"
   echo "For full functionality, run with: sudo ./install.sh"
   echo
fi

# Detect environment
echo "Detecting environment..."
if grep -qi microsoft /proc/version; then
    echo -e "${YELLOW}WSL2 environment detected${NC}"
    WSL_ENV=1
else
    echo "Native Linux environment detected"
    WSL_ENV=0
fi

# Check Python
echo -n "Checking Python 3... "
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    echo "  Found Python $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC}"
    echo "Python 3 is required. Please install with:"
    echo "  sudo apt-get install python3 python3-pip"
    exit 1
fi

# Check/Install dependencies
echo
echo "Checking dependencies..."

# Required Python packages
PYTHON_DEPS="psutil"
MISSING_DEPS=""

for dep in $PYTHON_DEPS; do
    echo -n "  Checking $dep... "
    if python3 -c "import $dep" 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}missing${NC}"
        MISSING_DEPS="$MISSING_DEPS $dep"
    fi
done

if [ -n "$MISSING_DEPS" ]; then
    echo
    echo "Installing missing Python dependencies..."
    pip3 install $MISSING_DEPS || sudo pip3 install $MISSING_DEPS
fi

# Check for eBPF support (optional)
echo
echo "Checking eBPF support (optional)..."
EBPF_AVAILABLE=0

if command -v bpftrace &> /dev/null; then
    echo -e "  bpftrace: ${GREEN}✓${NC}"
    EBPF_AVAILABLE=1
else
    echo -e "  bpftrace: ${YELLOW}not found${NC}"
fi

if python3 -c "import bcc" 2>/dev/null; then
    echo -e "  python3-bcc: ${GREEN}✓${NC}"
    EBPF_AVAILABLE=1
else
    echo -e "  python3-bcc: ${YELLOW}not found${NC}"
fi

if [ $EBPF_AVAILABLE -eq 0 ]; then
    echo
    echo -e "${YELLOW}Note: eBPF tools not found. Enhanced kernel monitoring will be disabled.${NC}"
    echo "To enable eBPF support, install:"
    echo "  sudo apt-get install bpfcc-tools python3-bpfcc"
    echo
    echo "The consciousness daemon will work fine with userspace monitoring only."
fi

# Create installation directory
echo
echo "Creating installation directory..."
if [[ $EUID -eq 0 ]]; then
    mkdir -p "$INSTALL_DIR"/{src,config,logs}
    mkdir -p "$LOG_DIR"
else
    echo "Skipping system directory creation (not root)"
    echo "Using local installation in current directory"
    INSTALL_DIR="$(pwd)"
fi

# Copy files
echo "Installing consciousness daemon..."
cp -r src/* "$INSTALL_DIR/src/" 2>/dev/null || cp -r src/* ./
cp -r config/* "$INSTALL_DIR/config/" 2>/dev/null || cp -r config/* ./

# Make scripts executable
chmod +x "$INSTALL_DIR/src/consciousness_scheduler.py" 2>/dev/null || chmod +x src/consciousness_scheduler.py
chmod +x "$INSTALL_DIR/src/consciousness_ebpf.py" 2>/dev/null || chmod +x src/consciousness_ebpf.py

# Install systemd service (if root)
if [[ $EUID -eq 0 ]] && [ -d /etc/systemd/system ]; then
    echo
    echo "Installing systemd service..."
    
    # Update paths in service file
    sed "s|/opt/luminous/consciousness-daemon|$INSTALL_DIR|g" \
        config/luminous-consciousness.service > /etc/systemd/system/$SERVICE_NAME.service
    
    systemctl daemon-reload
    echo -e "Service installed: ${GREEN}$SERVICE_NAME${NC}"
    echo
    echo "To start the service:"
    echo "  sudo systemctl start $SERVICE_NAME"
    echo "  sudo systemctl enable $SERVICE_NAME  # Start on boot"
else
    echo
    echo "Systemd service not installed (requires root)"
fi

# Create run script for manual execution
cat > "$INSTALL_DIR/run-consciousness-daemon.sh" << 'EOF'
#!/bin/bash
# Run LuminousOS Consciousness Daemon

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if running as root for full functionality
if [[ $EUID -ne 0 ]]; then
    echo "Warning: Running without root. Process priority adjustments may be limited."
    echo "For full functionality, run with: sudo $0"
    echo
fi

# Set Python path
export PYTHONPATH="$SCRIPT_DIR/src:$PYTHONPATH"

# Run with config
if [ -f "$SCRIPT_DIR/config/scheduler.json" ]; then
    export LUMINOUS_CONFIG="$SCRIPT_DIR/config/scheduler.json"
fi

echo "Starting LuminousOS Consciousness Daemon..."
echo "Press Ctrl+C to stop"
echo

python3 "$SCRIPT_DIR/src/consciousness_scheduler.py"
EOF

chmod +x "$INSTALL_DIR/run-consciousness-daemon.sh"

# Create monitoring script
cat > "$INSTALL_DIR/monitor-consciousness.sh" << 'EOF'
#!/bin/bash
# Monitor LuminousOS Consciousness Field

echo "LuminousOS Consciousness Field Monitor"
echo "====================================="
echo

while true; do
    if [ -f /var/run/luminous-field-state.json ]; then
        clear
        echo "LuminousOS Consciousness Field Monitor"
        echo "====================================="
        echo
        cat /var/run/luminous-field-state.json | python3 -m json.tool
    else
        echo "Waiting for consciousness data..."
    fi
    sleep 2
done
EOF

chmod +x "$INSTALL_DIR/monitor-consciousness.sh"

# Installation complete
echo
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo
echo "Consciousness daemon installed to: $INSTALL_DIR"
echo
echo "Quick start commands:"
echo -e "  ${YELLOW}Run manually:${NC}"
echo "    $INSTALL_DIR/run-consciousness-daemon.sh"
echo
echo -e "  ${YELLOW}Monitor field state:${NC}"
echo "    $INSTALL_DIR/monitor-consciousness.sh"
echo

if [[ $EUID -eq 0 ]] && [ -d /etc/systemd/system ]; then
    echo -e "  ${YELLOW}Run as service:${NC}"
    echo "    sudo systemctl start $SERVICE_NAME"
    echo "    sudo systemctl status $SERVICE_NAME"
    echo "    sudo systemctl enable $SERVICE_NAME  # Auto-start on boot"
    echo
fi

if [ $WSL_ENV -eq 1 ]; then
    echo -e "${YELLOW}WSL Note:${NC} eBPF features are limited in WSL2."
    echo "The daemon will use userspace monitoring which works great!"
fi

echo
echo "The consciousness field awaits your presence! 🌟"