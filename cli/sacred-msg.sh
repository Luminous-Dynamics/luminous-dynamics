#!/bin/bash
# Sacred Message CLI Wrapper
# Makes it easy to send and view sacred messages

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

# Pass all arguments to the sacred message CLI
node the-weave/core/agent-comms-sqlite/sacred-message-cli.js "$@"