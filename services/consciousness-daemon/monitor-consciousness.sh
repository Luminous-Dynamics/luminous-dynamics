#!/bin/bash
# Monitor LuminousOS Consciousness Field

echo "LuminousOS Consciousness Field Monitor"
echo "====================================="
echo

while true; do
    if [ -f /var/run/luminous-field-state.json ]; then
        clear
        echo "LuminousOS Consciousness Field Monitor"
        echo "====================================="
        echo
        cat /var/run/luminous-field-state.json | python3 -m json.tool
    else
        echo "Waiting for consciousness data..."
    fi
    sleep 2
done
