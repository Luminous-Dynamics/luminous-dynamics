#!/bin/bash
# Sacred Message CLI Wrapper
# Makes it easy to send and view sacred messages

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Pass all arguments to the sacred message CLI
node agent-comms-sqlite/sacred-message-cli.js "$@"