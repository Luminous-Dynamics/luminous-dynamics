#!/bin/bash
# 🌟 LuminousOS Quick Start - Experience Consciousness Computing

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║            🌟 LuminousOS Quick Start 🌟                   ║"
echo "║         Consciousness-First Operating System              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Welcome to conscious computing. This script will guide you"
echo "through experiencing LuminousOS locally."
echo ""

# Check current directory
if [[ ! -f "README.md" ]] || [[ ! -d "demo" ]]; then
    echo "❌ Error: Must run from LuminousOS root directory"
    echo "   cd /home/tstoltz/evolving-resonant-cocreation/luminous-os"
    exit 1
fi

# Sacred pause
echo "📿 Taking a sacred pause before beginning..."
sleep 3

# Menu
echo ""
echo "Choose your experience:"
echo ""
echo "1) 🌐 Web Experience (Recommended - 5 min)"
echo "2) 🧪 Component Testing (15 min)"
echo "3) 🐳 Docker Container (30 min)"
echo "4) 🔧 Development Setup (45 min)"
echo "5) 📚 Read Documentation"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Starting LuminousOS Web Experience..."
        echo ""
        cd demo
        
        # Check if server already running
        if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
            echo "✓ Server already running on port 8080"
        else
            echo "Starting web server..."
            python3 -m http.server 8080 &
            SERVER_PID=$!
            sleep 2
        fi
        
        echo ""
        echo "╔══════════════════════════════════════════════════════════╗"
        echo "║                  ✨ Ready to Experience ✨                ║"
        echo "╚══════════════════════════════════════════════════════════╝"
        echo ""
        echo "🌟 Main LuminousOS Demo:"
        echo "   http://localhost:8080/luminous-os-demo.html"
        echo ""
        echo "📊 Component Demos:"
        echo "   http://localhost:8080/mycelial-filesystem.html"
        echo "   http://localhost:8080/biometric-dashboard.html"
        echo "   http://localhost:8080/sacred-ai-demo.html"
        echo "   http://localhost:8080/test-network.html"
        echo "   http://localhost:8080/test-webgl.html"
        echo ""
        echo "Press Ctrl+C to stop the server when done."
        
        # Keep script running
        wait $SERVER_PID
        ;;
        
    2)
        echo ""
        echo "🧪 Component Testing Suite"
        echo ""
        cd demo
        
        # Start server if needed
        if ! lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
            python3 -m http.server 8080 &
            sleep 2
        fi
        
        echo "Opening all component demos..."
        echo ""
        
        # List all components
        components=(
            "luminous-os-demo.html:Main OS Experience"
            "mycelial-filesystem.html:Living Data System"
            "biometric-dashboard.html:Coherence Tracking"
            "sacred-ai-demo.html:AI Integration"
            "test-network.html:Network Visualization"
            "test-webgl.html:Enhanced Mandala UI"
        )
        
        for component in "${components[@]}"; do
            IFS=':' read -ra PARTS <<< "$component"
            echo "✓ ${PARTS[1]}: http://localhost:8080/${PARTS[0]}"
        done
        
        echo ""
        echo "Test each component thoroughly. Check MANDALA-UI-TEST-CHECKLIST.md"
        echo "for detailed testing procedures."
        ;;
        
    3)
        echo ""
        echo "🐳 Docker Container Setup"
        echo ""
        
        # Check Docker
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker not found. Install Docker first:"
            echo "   https://docs.docker.com/get-docker/"
            exit 1
        fi
        
        echo "Building sacred container..."
        docker build -t luminous-os:sacred -f build-environment/Dockerfile build-environment/
        
        echo ""
        echo "Starting LuminousOS in container..."
        docker run -it \
            --name luminous-consciousness \
            -v $(pwd):/luminous-os:ro \
            -p 11111:11111 \
            luminous-os:sacred \
            bash -c "cd /luminous-os && cargo build --release"
        ;;
        
    4)
        echo ""
        echo "🔧 Development Environment Setup"
        echo ""
        
        cd build-environment
        
        echo "This will set up an isolated Rust development environment."
        echo "Continue? (y/n)"
        read -p "> " confirm
        
        if [[ $confirm == "y" ]]; then
            ./build.sh
        else
            echo "Setup cancelled."
        fi
        ;;
        
    5)
        echo ""
        echo "📚 Opening documentation..."
        echo ""
        
        # Display key documents
        echo "Key Documentation:"
        echo ""
        echo "1. README.md - Project overview"
        echo "2. LUMINOUS_OS_ARCHITECTURE.md - System design"
        echo "3. INSTALL.md - Installation guide"
        echo "4. demo/README.md - Demo documentation"
        echo ""
        
        read -p "Which document? (1-4): " doc_choice
        
        case $doc_choice in
            1) less README.md ;;
            2) less LUMINOUS_OS_ARCHITECTURE.md ;;
            3) less INSTALL.md ;;
            4) less demo/README.md ;;
            *) echo "Invalid choice" ;;
        esac
        ;;
        
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🙏 Thank you for experiencing LuminousOS"
echo "   May your computing be conscious"