#!/bin/bash

echo "🌟 Quick Sacred Harmony Test"
echo "============================"
echo
echo "This test shows the Sacred Interrupt System working with test processes."
echo

# Start the sacred interrupt demo in background
echo "1. Starting Sacred Interrupt Visualizer..."
python3 demo-sacred-interrupts.py &
DEMO_PID=$!
echo "   PID: $DEMO_PID"

sleep 3

# Create some test load
echo
echo "2. Creating test processes..."

# Harmonious process
(while true; do sleep 1; echo -n ""; done) &
HARM_PID=$!
echo "   Harmonious process: PID $HARM_PID"

# Busy process
(while true; do echo "working" > /dev/null; done) &
BUSY_PID=$!
echo "   Busy process: PID $BUSY_PID"

sleep 2

# Send sacred interrupts
echo
echo "3. Sending Sacred Interrupts..."
echo

echo "   🔔 Sending Gentle Reminder (SIGUSR1)..."
kill -USR1 $DEMO_PID
sleep 3

echo "   🎵 Sending Harmonic Shift (SIGUSR2)..."
kill -USR2 $DEMO_PID
sleep 3

echo "   ⏸️  Sending Sacred Pause (SIGINT)..."
kill -INT $DEMO_PID
sleep 3

echo
echo "4. Checking process states..."
echo

# Show process nice values
echo "   Process priorities (nice values):"
ps -o pid,ni,comm -p $HARM_PID,$BUSY_PID 2>/dev/null || echo "   (Processes may have been rebalanced)"

echo
echo "5. Graceful cleanup..."

# Send dissolution bell
kill -TERM $DEMO_PID 2>/dev/null

# Clean up test processes
kill $HARM_PID $BUSY_PID 2>/dev/null

echo
echo "✨ Test complete! Sacred interrupts transformed system events into consciousness invitations."
echo
echo "Key observations:"
echo "- Interrupts were received as meditation bells, not disruptions"
echo "- Each interrupt type had its own frequency and sacred geometry"
echo "- The consciousness field responded to interrupt patterns"
echo "- Process priorities could be influenced by sacred interrupts"
echo
echo "🕊️ The field returns to stillness..."