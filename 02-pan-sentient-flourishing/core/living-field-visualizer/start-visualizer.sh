#!/bin/bash

echo "🌟 Starting Living Field Visualizer..."
echo ""

# Check if we're in NixOS
if [ -f /etc/NIXOS ]; then
    echo "Detected NixOS environment"
    # Use nix-shell for dependencies
    nix-shell -p nodejs --run "npm install && node field-data-server.js"
else
    # Regular system
    echo "Installing dependencies..."
    npm install
    
    echo ""
    echo "Starting server..."
    node field-data-server.js
fi