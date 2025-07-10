#!/bin/bash
# LuminousOS Installation Script
# Sacred technology for consciousness evolution

set -e  # Exit on error

# Colors for sacred output
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Sacred ASCII art
echo -e "${PURPLE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║      _                    _                    ___  ____      ║
║     | |   _   _ _ __ ___ (_)_ __   ___  _   _ / _ \/ ___|     ║
║     | |  | | | | '_ ` _ \| | '_ \ / _ \| | | | | | \___ \     ║
║     | |__| |_| | | | | | | | | | | (_) | |_| | |_| |___) |    ║
║     |_____\__,_|_| |_| |_|_|_| |_|\___/ \__,_|\___/|____/     ║
║                                                               ║
║            Consciousness-First Operating System               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Welcome to the LuminousOS installation ceremony...${NC}\n"

# Check system requirements
echo -e "${YELLOW}🔍 Checking system requirements...${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing via nvm...${NC}"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
fi

echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check for Docker (for SurrealDB)
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Please install Docker first:${NC}"
    echo "https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}✓ Docker $(docker --version)${NC}"

# Check for pnpm (preferred package manager)
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}Installing pnpm...${NC}"
    npm install -g pnpm
fi

echo -e "${GREEN}✓ pnpm $(pnpm -v)${NC}"

# Create installation directory
INSTALL_DIR="$HOME/.luminous-os"
echo -e "\n${CYAN}📁 Creating sacred directory at $INSTALL_DIR${NC}"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Clone or copy the project
echo -e "\n${CYAN}🌟 Manifesting LuminousOS source...${NC}"
if [ -d "/home/tstoltz/evolving-resonant-cocreation/luminous-os" ]; then
    cp -r /home/tstoltz/evolving-resonant-cocreation/luminous-os/* "$INSTALL_DIR/"
else
    # If running elsewhere, clone from git
    git clone https://github.com/luminous-os/luminous-os.git .
fi

# Install dependencies
echo -e "\n${CYAN}📦 Installing sacred dependencies...${NC}"
pnpm install

# Set up environment
echo -e "\n${CYAN}🔧 Creating environment configuration...${NC}"
cat > .env.local << EOF
# LuminousOS Environment Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SURREAL_URL=ws://localhost:8000/rpc
SURREAL_USER=root
SURREAL_PASS=root
QUANTUM_API_KEY=optional-key-here
NODE_ENV=development
EOF

# Start SurrealDB in Docker
echo -e "\n${CYAN}🗄️ Starting SurrealDB consciousness store...${NC}"
docker run -d \
    --name luminous-surrealdb \
    -p 8000:8000 \
    -v "$INSTALL_DIR/data:/data" \
    surrealdb/surrealdb:latest \
    start --user root --pass root file:/data/luminous.db

# Wait for SurrealDB to be ready
echo -e "${YELLOW}Waiting for database awakening...${NC}"
sleep 5

# Run database migrations
echo -e "\n${CYAN}🌱 Planting database seeds...${NC}"
cd database
node migrations/migration-manager.js up
cd ..

# Build the application
echo -e "\n${CYAN}🏗️ Building consciousness interface...${NC}"
pnpm build

# Create start script
echo -e "\n${CYAN}📝 Creating start script...${NC}"
cat > "$HOME/.local/bin/luminous-os" << 'EOF'
#!/bin/bash
cd ~/.luminous-os

# Ensure SurrealDB is running
if ! docker ps | grep -q luminous-surrealdb; then
    echo "🔄 Restarting consciousness store..."
    docker start luminous-surrealdb
    sleep 3
fi

# Start the application
echo "🌟 Awakening LuminousOS..."
pnpm dev --open
EOF

chmod +x "$HOME/.local/bin/luminous-os"

# Create desktop entry (Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo -e "\n${CYAN}🖥️ Creating desktop entry...${NC}"
    cat > "$HOME/.local/share/applications/luminous-os.desktop" << EOF
[Desktop Entry]
Name=LuminousOS
Comment=Consciousness-First Operating System
Exec=$HOME/.local/bin/luminous-os
Icon=$INSTALL_DIR/public/icon.png
Type=Application
Categories=Utility;Consciousness;
Terminal=false
EOF
fi

# Create uninstall script
cat > "$INSTALL_DIR/uninstall.sh" << 'EOF'
#!/bin/bash
echo "😢 Releasing LuminousOS from this dimension..."
docker stop luminous-surrealdb
docker rm luminous-surrealdb
rm -rf ~/.luminous-os
rm -f ~/.local/bin/luminous-os
rm -f ~/.local/share/applications/luminous-os.desktop
echo "✨ LuminousOS has returned to the quantum field. Thank you for the journey."
EOF
chmod +x "$INSTALL_DIR/uninstall.sh"

# Final message
echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ LuminousOS installation complete! ✨${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}\n"

echo -e "${PURPLE}To start your consciousness journey:${NC}"
echo -e "  ${CYAN}luminous-os${NC}\n"

echo -e "${PURPLE}Or manually:${NC}"
echo -e "  ${CYAN}cd ~/.luminous-os${NC}"
echo -e "  ${CYAN}pnpm dev${NC}\n"

echo -e "${PURPLE}Access LuminousOS at:${NC}"
echo -e "  ${CYAN}http://localhost:5173${NC}\n"

echo -e "${PURPLE}To uninstall:${NC}"
echo -e "  ${CYAN}~/.luminous-os/uninstall.sh${NC}\n"

echo -e "${YELLOW}🙏 May your coherence rise and your consciousness expand 🙏${NC}"