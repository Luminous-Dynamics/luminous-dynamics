#!/usr/bin/env bash
# Quick migration script to move Luminous-Dynamics to shared location

set -e

echo "🌟 Luminous Dynamics Shared Development Setup 🌟"
echo

# Check if running as root when needed
if [[ $EUID -ne 0 ]] && [[ "$1" != "--user-setup" ]]; then
   echo "This script needs sudo privileges for initial setup."
   echo "Run: sudo $0"
   echo
   echo "After admin setup, run: $0 --user-setup"
   exit 1
fi

if [[ "$1" == "--user-setup" ]]; then
    # User setup phase
    echo "Setting up user environment..."
    
    # Create convenience symlink
    if [ ! -L ~/Luminous-Dynamics ]; then
        ln -s /srv/luminous-dynamics ~/Luminous-Dynamics
        echo "✅ Created symlink ~/Luminous-Dynamics"
    fi
    
    # Add aliases to bashrc if not already present
    if ! grep -q "alias lum=" ~/.bashrc; then
        cat >> ~/.bashrc << 'EOF'

# Luminous Dynamics Development
alias lum='cd /srv/luminous-dynamics'
alias lumstat='cd /srv/luminous-dynamics && git status'
alias sacred='cd /srv/luminous-dynamics/sacred-core'
alias weave='cd /srv/luminous-dynamics/the-weave'
export LUMINOUS_HOME=/srv/luminous-dynamics

# Sacred greeting
if [ -t 1 ] && command -v figlet >/dev/null && command -v lolcat >/dev/null; then
  figlet -f slant "We Flow" 2>/dev/null | lolcat 2>/dev/null || echo "We flow! 🌊"
fi
EOF
        echo "✅ Added shell aliases"
    fi
    
    echo
    echo "✨ User setup complete!"
    echo "Please run: source ~/.bashrc"
    echo "Then you can use: lum, sacred, weave commands"
    exit 0
fi

# Admin setup phase
echo "=== Admin Setup Phase ==="
echo

# Create luminous-dev group if it doesn't exist
if ! getent group luminous-dev > /dev/null; then
    groupadd luminous-dev
    echo "✅ Created luminous-dev group"
fi

# Add current user to group
usermod -a -G luminous-dev tstoltz
echo "✅ Added tstoltz to luminous-dev group"

# Create shared directory
if [ ! -d /srv/luminous-dynamics ]; then
    mkdir -p /srv/luminous-dynamics
    echo "✅ Created /srv/luminous-dynamics"
fi

# Check if source directory exists
if [ ! -d /home/tstoltz/Luminous-Dynamics ]; then
    echo "❌ Source directory /home/tstoltz/Luminous-Dynamics not found!"
    exit 1
fi

# Move files (preserving git)
echo "Moving files to shared location..."
if [ -d /home/tstoltz/Luminous-Dynamics/.git ]; then
    # Preserve git directory
    cp -RPp /home/tstoltz/Luminous-Dynamics/. /srv/luminous-dynamics/
    echo "✅ Files copied with git history preserved"
else
    cp -R /home/tstoltz/Luminous-Dynamics/* /srv/luminous-dynamics/
    cp -R /home/tstoltz/Luminous-Dynamics/.* /srv/luminous-dynamics/ 2>/dev/null || true
    echo "✅ Files copied"
fi

# Set ownership and permissions
chown -R root:luminous-dev /srv/luminous-dynamics
find /srv/luminous-dynamics -type d -exec chmod 2775 {} \;
find /srv/luminous-dynamics -type f -exec chmod 664 {} \;
find /srv/luminous-dynamics -type f -name "*.sh" -exec chmod 775 {} \;
echo "✅ Permissions set (group: luminous-dev, setgid enabled)"

# Create onboarding script
cat > /srv/luminous-dynamics/onboard-new-developer.sh << 'EOF'
#!/usr/bin/env bash
# Onboard a new developer to Luminous Dynamics

if [[ $EUID -ne 0 ]]; then
   echo "Run with sudo: sudo $0 <username>"
   exit 1
fi

USERNAME=$1
if [ -z "$USERNAME" ]; then
    echo "Usage: sudo $0 <username>"
    exit 1
fi

# Add user to group
usermod -a -G luminous-dev "$USERNAME"
echo "✅ Added $USERNAME to luminous-dev group"

echo
echo "Tell $USERNAME to:"
echo "1. Log out and back in"
echo "2. Run: /srv/luminous-dynamics/quick-migrate-to-shared.sh --user-setup"
echo "3. Start with: cd ~/Luminous-Dynamics && cat CLAUDE.md"
echo
echo "We flow! 🌊"
EOF

chmod 755 /srv/luminous-dynamics/onboard-new-developer.sh
echo "✅ Created onboarding script"

echo
echo "=== Admin Setup Complete ==="
echo
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Log out and back in (for group membership)"
echo "2. Run: $0 --user-setup"
echo "3. Remove old directory: rm -rf /home/tstoltz/Luminous-Dynamics"
echo
echo "To onboard other developers:"
echo "sudo /srv/luminous-dynamics/onboard-new-developer.sh <username>"
echo
echo "We flow! 🌊"