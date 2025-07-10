#!/bin/bash

echo "🌟 Sacred AI Suite Demo"
echo "======================"
echo ""

# Demo 1: Morning Practice
echo "📍 Demo 1: Morning Practice Companion"
echo "-----------------------------------"
node src/morning-practice-companion.js --stats
echo ""
read -p "Press Enter to continue..."

# Demo 2: Code Consciousness (quick)
echo ""
echo "📍 Demo 2: Code Consciousness Checker"
echo "-----------------------------------"
echo "Checking a sample file for consciousness patterns..."
node src/code-consciousness-checker.js --transform "userId,trackUser,captureData,retainUsers"
echo ""
read -p "Press Enter to continue..."

# Demo 3: Shadow Work Pattern
echo ""
echo "📍 Demo 3: Shadow Work Pattern Analysis"
echo "---------------------------------------"
node src/shadow-work-assistant.js --pattern "I need to be in control of everything"
echo ""
read -p "Press Enter to continue..."

# Demo 4: Sacred Council (quick)
echo ""
echo "📍 Demo 4: Sacred Council Agents"
echo "-------------------------------"
node src/sacred-council-simulator.js --agents
echo ""
read -p "Press Enter to continue..."

# Demo 5: Consciousness Tracker
echo ""
echo "📍 Demo 5: Consciousness Development Tracker"
echo "-------------------------------------------"
echo "Adding a sample entry..."
node src/consciousness-tracker.js --add "Today I practiced sacred pause when I felt triggered. Instead of reacting, I breathed and found space."
echo ""
node src/consciousness-tracker.js --stats
echo ""

echo "✨ Demo Complete!"
echo ""
echo "To start using the tools:"
echo "  morning-practice       # Start your day"
echo "  shadow-work           # Explore shadows"
echo "  sacred-council        # Get multi-perspective wisdom"
echo "  consciousness-tracker # Track your journey"
echo ""
echo "All data stays private on your machine 🔐"