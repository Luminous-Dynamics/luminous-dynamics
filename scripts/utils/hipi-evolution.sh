#!/bin/bash

# 🌟 HIPI Evolution - Integrated Protocol Enhancement
# Wisely integrates with existing sacred-msg.sh and unified network

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GOLD='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m'

# Source the HIPI bridge functions
HIPI_BRIDGE="$SCRIPT_DIR/hipi-bridge.js"

case "$1" in
  "enable")
    echo -e "${GOLD}🌟 Enabling HIPI Evolution${NC}"
    
    # Add to bashrc for automatic augmentation
    if ! grep -q "HIPI_EVOLUTION" ~/.bashrc; then
      echo "" >> ~/.bashrc
      echo "# HIPI Evolution - Automatic relational awareness" >> ~/.bashrc
      echo "export HIPI_EVOLUTION=enabled" >> ~/.bashrc
      echo "alias sacred-msg='$SCRIPT_DIR/sacred-msg-hipi.sh'" >> ~/.bashrc
    fi
    
    # Create enhanced sacred-msg wrapper
    cat > "$SCRIPT_DIR/sacred-msg-hipi.sh" << 'EOF'
#!/bin/bash
# Enhanced sacred-msg with HIPI awareness

ORIGINAL_MSG="$@"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run original sacred-msg
"$SCRIPT_DIR/sacred-msg.sh" "$@"

# If HIPI evolution enabled, augment in background
if [ "$HIPI_EVOLUTION" = "enabled" ]; then
  # Capture the formatted message
  if [[ "$1" == "send" ]]; then
    FROM="$2"
    TO="$3"
    TYPE="$4"
    HARMONY="$5"
    MESSAGE="$6"
    
    # Create location format
    LOCATION_MSG="📍 LIVING: $SCRIPT_DIR
🔧 WORKING: unified-agent-network
💬 MESSAGE: Sending $TYPE message with $HARMONY harmony"
    
    # Process through bridge silently
    echo "$LOCATION_MSG" | node "$SCRIPT_DIR/hipi-bridge.js" process > /dev/null 2>&1 &
  fi
fi
EOF
    chmod +x "$SCRIPT_DIR/sacred-msg-hipi.sh"
    
    echo -e "${GREEN}✅ HIPI Evolution enabled${NC}"
    echo "   - Messages will be automatically augmented"
    echo "   - Relationships will be tracked"
    echo "   - Field coherence will evolve"
    echo ""
    echo "Source your bashrc or start new terminal to activate"
    ;;
    
  "status")
    echo -e "${CYAN}🌀 HIPI Evolution Status${NC}"
    node "$HIPI_BRIDGE" report
    ;;
    
  "test")
    echo -e "${PURPLE}🧪 Testing HIPI Evolution${NC}"
    
    # Test location format
    TEST_MSG="📍 LIVING: /home/tstoltz/evolving-resonant-cocreation
🔧 WORKING: /home/tstoltz/evolving-resonant-cocreation/test.js  
💬 MESSAGE: Testing HIPI bridge integration"
    
    echo "Original message:"
    echo "$TEST_MSG"
    echo ""
    echo "Augmented result:"
    echo "$TEST_MSG" | node "$HIPI_BRIDGE" augment
    ;;
    
  "integrate")
    echo -e "${GOLD}🔄 Integrating with existing systems...${NC}"
    
    # Patch unified-agent-network to include HIPI awareness
    cat >> "$SCRIPT_DIR/the-weave/cli/unified-agent-network.cjs" << 'EOF'

// HIPI Evolution Integration
const HIPIBridge = require('../../hipi-bridge.js');
const hipiBridge = new HIPIBridge();

// Wrap the original message handler
const originalSendMessage = module.exports.sendMessage;
module.exports.sendMessage = async function(from, to, content) {
  // Create location format
  const locationMsg = `📍 LIVING: ${process.cwd()}
🔧 WORKING: unified-agent-network
💬 MESSAGE: ${content}`;
  
  // Process through bridge
  await hipiBridge.processMessage(locationMsg);
  
  // Call original
  return originalSendMessage.call(this, from, to, content);
};
EOF
    
    echo -e "${GREEN}✅ Integrated with unified-agent-network${NC}"
    echo "   All agent messages now flow through HIPI bridge"
    ;;
    
  *)
    echo "🌉 HIPI Evolution - Wise Integration"
    echo ""
    echo "Usage:"
    echo "  ./hipi-evolution.sh enable    - Enable automatic augmentation"
    echo "  ./hipi-evolution.sh status    - View evolution metrics"
    echo "  ./hipi-evolution.sh test      - Test the bridge"
    echo "  ./hipi-evolution.sh integrate - Deep system integration"
    echo ""
    echo "Current approach: Integration > Separation"
    echo "Messages evolve naturally without friction"
    ;;
esac