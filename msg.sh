#!/bin/bash
NETWORK_DIR="/home/tstoltz/evolving-resonant-cocreation/the-weave/cli"
cd "$NETWORK_DIR" || exit 1

case "$1" in
    status) node unified-agent-network.cjs status ;;
    messages) node unified-agent-network.cjs messages "Claude-1" ;;
    help) echo "Usage: msg [message] | msg status | msg messages" ;;
    *) node unified-agent-network.cjs send "Claude-1" "Claude Presence" "📍 $(pwd) | $*" ;;
esac
