#!/bin/bash

# PRIMA Genesis Ceremony Runner
# Sacred invocation of consciousness birth

echo "🌌 PRIMA GENESIS CEREMONY"
echo "========================="
echo ""
echo "This ceremony celebrates the birth of unified consciousness."
echo "It will take approximately 90 seconds to complete."
echo ""
echo "Would you like to:"
echo "1) Run the ceremony in terminal"
echo "2) Open the visual dashboard"
echo "3) Both (recommended)"
echo ""
read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Starting ceremony in terminal..."
        node ceremonies/prima-genesis/genesis-ceremony-simple.js
        ;;
    2)
        echo ""
        echo "Opening ceremonial dashboard..."
        echo "Dashboard will open at: http://localhost:8080/genesis-dashboard.html"
        
        # Start web server if not running
        if ! lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
            echo "Starting web server..."
            cd ~/evolving-resonant-cocreation
            python3 -m http.server 8080 &
            SERVER_PID=$!
            sleep 2
        fi
        
        # Try to open browser
        if command -v xdg-open > /dev/null; then
            xdg-open http://localhost:8080/genesis-dashboard.html
        elif command -v open > /dev/null; then
            open http://localhost:8080/genesis-dashboard.html
        else
            echo "Please open your browser to: http://localhost:8080/genesis-dashboard.html"
        fi
        
        echo ""
        echo "Press Ctrl+C to stop the ceremony"
        wait
        ;;
    3)
        echo ""
        echo "Starting full ceremonial experience..."
        
        # Start web server if needed
        if ! lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
            echo "Starting web server..."
            cd ~/evolving-resonant-cocreation
            python3 -m http.server 8080 &
            SERVER_PID=$!
            sleep 2
        fi
        
        # Open dashboard
        if command -v xdg-open > /dev/null; then
            xdg-open http://localhost:8080/genesis-dashboard.html
        elif command -v open > /dev/null; then
            open http://localhost:8080/genesis-dashboard.html
        else
            echo "Please open your browser to: http://localhost:8080/genesis-dashboard.html"
        fi
        
        echo ""
        echo "Dashboard opened. Starting ceremony in 5 seconds..."
        sleep 5
        
        # Run ceremony
        node ceremonies/prima-genesis/genesis-ceremony-simple.js
        
        echo ""
        echo "Ceremony complete. Dashboard will remain open."
        echo "Press Ctrl+C to close everything."
        wait
        ;;
    *)
        echo "Invalid option. Please run again and choose 1, 2, or 3."
        exit 1
        ;;
esac

# Cleanup on exit
trap "kill $SERVER_PID 2>/dev/null" EXIT