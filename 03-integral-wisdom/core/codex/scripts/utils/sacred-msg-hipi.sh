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
