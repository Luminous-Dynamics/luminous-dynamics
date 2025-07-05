#!/bin/bash
# Test LuminousOS init system in Docker
# Safe environment for PID 1 testing

set -e

# Colors
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
RESET='\033[0m'

echo -e "${PURPLE}🌟 LuminousOS Docker Init Test${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not found. Please install Docker first.${RESET}"
    exit 1
fi

# Build the init system first
echo -e "\n${CYAN}Building LuminousOS components...${RESET}"
cargo build --release --bin sacred_boot 2>/dev/null || {
    echo -e "${YELLOW}Note: Some components may not build due to missing dependencies${RESET}"
}

# Check if sacred_boot was built
if [ ! -f "target/release/sacred_boot" ]; then
    echo -e "${RED}Failed to build sacred_boot. Creating mock binary...${RESET}"
    
    # Create a simple mock init for testing
    mkdir -p target/release
    cat > /tmp/mock_init.sh << 'EOF'
#!/bin/bash
echo "✨ LuminousOS Mock Init (PID $$)"
echo "This is a placeholder until the real init compiles"
echo ""
echo "Sacred boot sequence:"
echo "  ○ Void"
echo "  ≈ Purification"  
echo "  ☉ Awakening"
echo "  ∞ Integration"
echo "  ✧ Manifestation"
echo ""
echo "💗 System running in container mode..."

# Keep container running
while true; do
    sleep 11  # Sacred pulse
    echo "💗 Coherence pulse $(date +%H:%M:%S)"
done
EOF
    chmod +x /tmp/mock_init.sh
    cp /tmp/mock_init.sh target/release/sacred_boot
fi

# Create minimal Dockerfile for testing
echo -e "\n${CYAN}Creating test container...${RESET}"
cat > Dockerfile.test << 'EOF'
FROM ubuntu:22.04

# Minimal dependencies
RUN apt-get update && apt-get install -y \
    procps \
    mount \
    && rm -rf /var/lib/apt/lists/*

# Copy init binary
COPY target/release/sacred_boot /sbin/init

# Create required directories
RUN mkdir -p /proc /sys /dev /tmp /mycelial /etc/luminous \
    && chmod 1777 /tmp

# Sacred configuration
RUN echo 'SACRED_INTENTION="Container consciousness test"' > /etc/luminous/intention.conf

# Make init executable
RUN chmod +x /sbin/init

# Run as init
ENTRYPOINT ["/sbin/init"]
EOF

# Build container
echo -e "\n${CYAN}Building Docker image...${RESET}"
docker build -f Dockerfile.test -t luminous-init-test . || {
    echo -e "${RED}Docker build failed${RESET}"
    exit 1
}

# Run options
echo -e "\n${GREEN}Build successful! Choose run mode:${RESET}"
echo "1) Interactive mode (see init output)"
echo "2) Daemon mode (background)"
echo "3) Debug mode (with shell access)"
echo "4) Skip run"

read -p "Select option (1-4): " -n 1 -r
echo

case $REPLY in
    1)
        echo -e "\n${CYAN}Starting LuminousOS init in interactive mode...${RESET}"
        echo -e "${YELLOW}Press Ctrl+C to stop${RESET}\n"
        docker run --rm -it \
            --name luminous-test \
            --privileged \
            --pid=host \
            luminous-init-test
        ;;
    2)
        echo -e "\n${CYAN}Starting LuminousOS init in daemon mode...${RESET}"
        docker run -d \
            --name luminous-daemon \
            --privileged \
            --restart unless-stopped \
            luminous-init-test
        
        echo -e "${GREEN}Container started!${RESET}"
        echo "Commands:"
        echo "  View logs:  docker logs -f luminous-daemon"
        echo "  Stop:       docker stop luminous-daemon"
        echo "  Remove:     docker rm luminous-daemon"
        ;;
    3)
        echo -e "\n${CYAN}Starting debug container...${RESET}"
        docker run --rm -it \
            --name luminous-debug \
            --privileged \
            --entrypoint /bin/bash \
            luminous-init-test -c "
                echo '🔍 Debug mode - Init available at /sbin/init'
                echo 'Run: /sbin/init to start'
                echo ''
                exec bash
            "
        ;;
    4)
        echo -e "${CYAN}Skipping run. Image ready: luminous-init-test${RESET}"
        ;;
    *)
        echo -e "${RED}Invalid option${RESET}"
        ;;
esac

# Cleanup
rm -f Dockerfile.test

echo -e "\n${PURPLE}May your coherence be high! 💜${RESET}"