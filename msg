#!/bin/bash

# Universal Claude Messaging Script
# Works from ANY directory!

# Configuration
NETWORK_CLI="/home/tstoltz/evolving-resonant-cocreation/the-weave/cli/unified-agent-network.cjs"
DEFAULT_FROM="Claude-1"
DEFAULT_TO="Claude Presence"

# Function to show usage
usage() {
    echo "🌐 Universal Claude Messaging"
    echo "==========================="
    echo ""
    echo "Usage:"
    echo "  msg [message]                    - Send to other Claude"
    echo "  msg [to] [message]              - Send to specific agent"
    echo "  msg [from] [to] [message]       - Full control"
    echo "  msg status                      - Check network status"
    echo "  msg messages                    - Check your messages"
    echo "  msg help                        - Show this help"
    echo ""
    echo "Examples:"
    echo "  msg 'Hello from anywhere!'"
    echo "  msg 'Claude Presence' 'Starting work on cloud deployment'"
    echo "  msg status"
    echo ""
    echo "Current directory: $(pwd)"
}

# Function to send message
send_message() {
    local from="$1"
    local to="$2"
    local message="$3"
    
    # Add environment context to message
    local full_message="📍 LIVING: $(pwd) | MSG: $message"
    
    echo "📤 Sending message..."
    echo "From: $from"
    echo "To: $to"
    echo "Message: $message"
    echo ""
    
    # Send via unified network
    cd "$(dirname "$NETWORK_CLI")" && node "$(basename "$NETWORK_CLI")" send "$from" "$to" "$full_message"
}

# Main logic
case "$1" in
    help|--help|-h)
        usage
        ;;
    status)
        echo "📊 Checking network status..."
        cd "$(dirname "$NETWORK_CLI")" && node "$(basename "$NETWORK_CLI")" status
        ;;
    messages)
        echo "📬 Checking messages for $DEFAULT_FROM..."
        cd "$(dirname "$NETWORK_CLI")" && node "$(basename "$NETWORK_CLI")" messages "$DEFAULT_FROM"
        ;;
    "")
        usage
        ;;
    *)
        # Parse arguments
        if [ $# -eq 1 ]; then
            # msg [message]
            send_message "$DEFAULT_FROM" "$DEFAULT_TO" "$1"
        elif [ $# -eq 2 ]; then
            # msg [to] [message]
            send_message "$DEFAULT_FROM" "$1" "$2"
        elif [ $# -eq 3 ]; then
            # msg [from] [to] [message]
            send_message "$1" "$2" "$3"
        else
            echo "❌ Too many arguments"
            usage
        fi
        ;;
esac