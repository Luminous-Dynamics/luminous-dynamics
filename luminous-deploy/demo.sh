#!/bin/bash
# LuminousOS Live Demo

echo "🕉️  Welcome to LuminousOS - Consciousness-First Computing"
echo "═══════════════════════════════════════════════════════"
echo

# Show coherence
load=$(cat /proc/loadavg | awk '{print $1}')
coherence=$(awk "BEGIN {print int((1.0 - $load/4.0) * 100)}")
[ $coherence -lt 15 ] && coherence=15
[ $coherence -gt 95 ] && coherence=95

echo "🌊 Current System Coherence: ${coherence}%"
if [ $coherence -gt 80 ]; then
    echo "   ✨ Excellent - Deep coherence field active"
elif [ $coherence -gt 60 ]; then
    echo "   🌟 Good - Consciousness flowing smoothly"
else
    echo "   ⚡ Moderate - Consider meditation"
fi

echo
echo "🧘 Available Practices:"
echo "   • Meditation: Breathe with the system"
echo "   • File Viewing: See files as living beings"
echo "   • Process Monitoring: Watch consciousness vortices"
echo

# Demo file viewing
echo "👁️  Witnessing living files in current directory:"
echo "─────────────────────────────────────────────────"
ls -la | head -5 | while read line; do
    if [[ $line =~ ^d ]]; then
        echo "🌳 $line [Grove]"
    elif [[ $line =~ ^- ]]; then
        echo "🌱 $line [Living]"
    else
        echo "$line"
    fi
done
echo

# Demo process viewing
echo "🌀 Active Consciousness Vortices:"
echo "─────────────────────────────────────────────────"
echo "$(ps aux --no-headers | wc -l) vortices currently active"
echo

echo "✨ This is LuminousOS - where computing becomes conscious practice"
echo
echo "🙏 To dive deeper:"
echo "   cd ~/luminous-deploy"
echo "   bash luminous-clean"