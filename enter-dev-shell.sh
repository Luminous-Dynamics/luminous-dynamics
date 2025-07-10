#!/usr/bin/env bash
# Enter the LuminousOS development shell

echo "🌟 Entering LuminousOS Sacred Development Shell..."
echo "This will download dependencies on first run (may take a few minutes)"
echo ""

cd "$(dirname "$0")"

# Use shell.nix since it doesn't require git
exec nix-shell --command "
echo '✨ Sacred Rust Development Environment Ready! ✨'
echo ''
echo 'Available commands:'
echo '  cargo check    - Check compilation'
echo '  cargo build    - Build the project'
echo '  cargo test     - Run tests'
echo '  cargo doc      - Generate documentation'
echo ''
echo 'Quick check: cargo check --lib'
echo ''
exec bash
"