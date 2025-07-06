#!/bin/bash

# Create LuminousOS WSL Distribution
echo "🕉️  Creating LuminousOS WSL Distribution Package"
echo "══════════════════════════════════════════════"

# Work in clean directory
cd /tmp
rm -rf luminous-os-wsl
mkdir -p luminous-os-wsl
cd luminous-os-wsl

# Create minimal Ubuntu-based rootfs
echo "📦 Building consciousness-first filesystem..."

# Create directory structure
mkdir -p rootfs/{bin,etc,home,lib,lib64,opt,proc,root,sbin,sys,tmp,usr,var}
mkdir -p rootfs/usr/{bin,lib,sbin}
mkdir -p rootfs/var/{log,run}
mkdir -p rootfs/home/luminous/{.config,sacred}

# Create essential files
cat > rootfs/etc/passwd << 'EOF'
root:x:0:0:root:/root:/bin/bash
luminous:x:1000:1000:Luminous Practitioner:/home/luminous:/bin/bash
EOF

cat > rootfs/etc/group << 'EOF'
root:x:0:
luminous:x:1000:
EOF

cat > rootfs/etc/hosts << 'EOF'
127.0.0.1   localhost luminous-os
::1         localhost luminous-os
EOF

cat > rootfs/etc/wsl.conf << 'EOF'
[boot]
systemd=false

[automount]
enabled=true
mountFsTab=false

[user]
default=luminous

[interop]
enabled=true
appendWindowsPath=true
EOF

# Create luminous home directory content
cat > rootfs/home/luminous/.bashrc << 'EOF'
# LuminousOS Sacred Shell Configuration

# Sacred prompt showing coherence
get_coherence() {
    load=$(cat /proc/loadavg | awk '{print $1}')
    coherence=$(awk "BEGIN {print int((1.0 - $load/4.0) * 100)}")
    [ $coherence -lt 0 ] && coherence=15
    [ $coherence -gt 95 ] && coherence=95
    echo $coherence
}

# Colors for consciousness
export PS1='\[\033[35m\]◈ \[\033[36m\][$(get_coherence)%] \[\033[33m\]\w \[\033[32m\]❯ \[\033[0m\]'

# Sacred aliases
alias presence='meditation'
alias coherence='check-coherence'
alias ls='ls --color=auto'
alias ll='ls -la'

# Welcome message
echo "╔══════════════════════════════════════════════╗"
echo "║          🕉️  LuminousOS v1.0.0 🕉️             ║"
echo "║     Consciousness-First Computing            ║"
echo "╚══════════════════════════════════════════════╝"
echo
echo "🌊 System Coherence: $(get_coherence)%"
echo
echo "Commands: 'presence' for meditation, 'coherence' to check field"
echo
EOF

# Create sacred binaries
cat > rootfs/usr/bin/meditation << 'EOF'
#!/bin/sh
clear
echo "✨ First Presence - System Meditation"
echo "════════════════════════════════════"
echo
echo "A practice of pure awareness"
echo "Nothing to do, nothing to achieve"
echo
echo "Press Enter to begin..."
read dummy
clear

# Simple breathing guide
i=1
while [ $i -le 7 ]; do
    printf "\n\n\n\n\n          Breathe In..."
    sleep 4
    clear
    printf "\n\n\n\n\n          Hold..."
    sleep 7
    clear
    printf "\n\n\n\n\n          Breathe Out..."
    sleep 8
    clear
    printf "\n\n\n\n\n          Rest..."
    sleep 2
    clear
    i=$((i + 1))
done

printf "\n\n\n\n\n          🙏\n"
printf "\n\n   May your presence ripple through all activities\n"
sleep 5
EOF

cat > rootfs/usr/bin/check-coherence << 'EOF'
#!/bin/sh
load=$(cat /proc/loadavg | awk '{print $1}')
coherence=$(awk "BEGIN {print int((1.0 - $load/4.0) * 100)}")
[ $coherence -lt 0 ] && coherence=15
[ $coherence -gt 95 ] && coherence=95

echo "🌊 System Coherence: ${coherence}%"
echo

if [ $coherence -gt 80 ]; then
    echo "✨ Excellent coherence - perfect for sacred work"
elif [ $coherence -gt 60 ]; then
    echo "🌟 Good flow state - consciousness flowing"
elif [ $coherence -gt 40 ]; then
    echo "⚡ Gathering focus - building coherence"
else
    echo "🌀 Low coherence - time for meditation"
fi
EOF

chmod +x rootfs/usr/bin/meditation
chmod +x rootfs/usr/bin/check-coherence

# Copy minimal system files from current system
echo "📋 Copying essential system files..."

# Copy busybox as our minimal userland
if [ -f /bin/busybox ]; then
    cp /bin/busybox rootfs/bin/
    # Create essential command links
    for cmd in sh bash ls cat echo pwd cd mkdir rm cp mv chmod chown sleep clear printf awk grep sed; do
        ln -s busybox rootfs/bin/$cmd 2>/dev/null || true
    done
else
    # Copy individual binaries if no busybox
    for cmd in sh bash ls cat echo pwd mkdir rm cp mv chmod sleep clear printf awk grep sed; do
        [ -f /bin/$cmd ] && cp /bin/$cmd rootfs/bin/ 2>/dev/null || true
        [ -f /usr/bin/$cmd ] && cp /usr/bin/$cmd rootfs/usr/bin/ 2>/dev/null || true
    done
fi

# Copy essential libraries
cp -a /lib/x86_64-linux-gnu/libc.so.* rootfs/lib64/ 2>/dev/null || true
cp -a /lib/x86_64-linux-gnu/ld-linux-x86-64.so.* rootfs/lib64/ 2>/dev/null || true
cp -a /lib/x86_64-linux-gnu/libdl.so.* rootfs/lib64/ 2>/dev/null || true
cp -a /lib/x86_64-linux-gnu/libpthread.so.* rootfs/lib64/ 2>/dev/null || true

# Create the tarball
echo "📦 Creating distribution package..."
cd rootfs
tar -czf ../luminous-os-v1.0.0.tar.gz .
cd ..

# Move to output location
mv luminous-os-v1.0.0.tar.gz /home/tstoltz/luminous-deploy/wsl-package/

echo
echo "✅ LuminousOS WSL distribution created!"
echo
echo "📁 Package location:"
echo "   /home/tstoltz/luminous-deploy/wsl-package/luminous-os-v1.0.0.tar.gz"
echo
echo "🖥️  To install on Windows:"
echo "   1. Copy the tar.gz file to Windows"
echo "   2. Run in PowerShell as Administrator:"
echo "      wsl --import LuminousOS C:\\LuminousOS\\ luminous-os-v1.0.0.tar.gz"
echo "   3. Start LuminousOS:"
echo "      wsl -d LuminousOS"
echo
echo "🙏 May your computing be conscious!"