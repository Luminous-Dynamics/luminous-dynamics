#!/bin/bash
# Test script for LuminousOS kernel module

echo "🌟 LuminousOS Kernel Module Test Suite"
echo "====================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Build the module
echo "📦 Building kernel module..."
make clean && make
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Load the module
echo "🔧 Loading kernel module..."
insmod luminous_kernel.ko
if [ $? -ne 0 ]; then
    echo "❌ Failed to load module"
    exit 1
fi

# Give it a moment to initialize
sleep 2

# Check if module loaded
if lsmod | grep -q luminous_kernel; then
    echo "✅ Module loaded successfully"
else
    echo "❌ Module not found in lsmod"
    exit 1
fi

# Check dmesg for initialization
echo -e "\n📋 Kernel messages:"
dmesg | grep -i luminous | tail -10

# Test /proc interface
echo -e "\n🔍 Testing /proc interface..."

# Check coherence field
echo -e "\n📊 Global Coherence Field:"
cat /proc/luminous/coherence

# Register some test processes
echo -e "\n📍 Registering test processes..."

# Get some real PIDs
BASH_PID=$$
echo "register $BASH_PID" > /proc/luminous/control
echo "Registered bash (PID: $BASH_PID)"

# Register init process
echo "register 1" > /proc/luminous/control
echo "Registered init (PID: 1)"

# If we have a browser running, register it
BROWSER_PID=$(pgrep -f "chrome|firefox" | head -1)
if [ ! -z "$BROWSER_PID" ]; then
    echo "register $BROWSER_PID" > /proc/luminous/control
    echo "Registered browser (PID: $BROWSER_PID)"
fi

# Show registered processes
echo -e "\n📋 Conscious Processes:"
cat /proc/luminous/processes

# Wait for a sacred pulse
echo -e "\n⏳ Waiting for sacred pulse (11 seconds)..."
sleep 12

# Check coherence again
echo -e "\n📊 Coherence after sacred pulse:"
cat /proc/luminous/coherence

# Show processes after pulse
echo -e "\n📋 Processes after sacred pulse:"
cat /proc/luminous/processes

# Unregister a process
echo -e "\n🔄 Unregistering bash process..."
echo "unregister $BASH_PID" > /proc/luminous/control

# Final state
echo -e "\n📊 Final state:"
cat /proc/luminous/processes

# Check kernel messages again
echo -e "\n📋 Final kernel messages:"
dmesg | grep -i luminous | tail -20

# Offer to unload
echo -e "\n❓ Module test complete. Unload module? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    rmmod luminous_kernel
    echo "✅ Module unloaded"
else
    echo "ℹ️  Module still loaded. To unload later: sudo rmmod luminous_kernel"
fi

echo -e "\n✨ Test complete!"