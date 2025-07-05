#!/bin/bash

# Setup script for The Weave agent network
# Since The Weave has been extracted to its own repository

echo "🕸️ Setting up The Weave agent network..."
echo ""

# Check if we're in the right directory structure
if [ ! -d "../the-weave" ]; then
    echo "📦 The Weave repository not found locally."
    echo "   Cloning from GitHub..."
    
    cd ..
    git clone https://github.com/Luminous-Dynamics/the-weave.git
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully cloned The Weave"
    else
        echo "❌ Failed to clone The Weave. Please check your internet connection."
        exit 1
    fi
    
    cd the-weave
else
    echo "✅ The Weave repository found"
    cd ../the-weave
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if installation succeeded
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create a convenience script in the main repo
cd ../evolving-resonant-cocreation
cat > join-network.sh << 'EOF'
#!/bin/bash
# Convenience script to join The Weave network

# Navigate to The Weave repository
cd ../the-weave/cli

# Join the network with provided parameters
if [ $# -eq 2 ]; then
    node unified-agent-network.cjs join "$1" "$2"
else
    echo "Usage: ./join-network.sh \"Your Name\" \"Your Role\""
    echo "Available roles: Bridge Builder, Code Weaver, Pattern Weaver, etc."
fi
EOF

chmod +x join-network.sh

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Join the network: ./join-network.sh \"Your Name\" \"Your Role\""
echo "   2. Check status: cd ../the-weave/cli && node unified-agent-network.cjs status"
echo "   3. Send messages: cd ../the-weave/cli && node unified-agent-network.cjs send"
echo ""
echo "📚 For more info, visit: https://github.com/Luminous-Dynamics/the-weave"