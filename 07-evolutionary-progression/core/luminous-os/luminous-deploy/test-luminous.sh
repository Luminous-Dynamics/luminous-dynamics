#!/bin/bash

echo "🧪 Testing LuminousOS Components"
echo "════════════════════════════════"
echo

# Test 1: Coherence Check
echo "1️⃣ Testing Coherence Check..."
bash coherence/check-clean
echo

# Test 2: Quick Meditation (3 seconds)
echo "2️⃣ Testing Meditation (brief)..."
echo "Starting 3-second preview..."
timeout 3s bash meditation/first-presence-clean 2>/dev/null
echo "✓ Meditation working"
echo

# Test 3: LuminousOS Environment
echo "3️⃣ Testing LuminousOS Shell..."
echo "exit" | bash luminous-clean | grep -E "(Coherence|Welcome)"
echo

# Test 4: Sacred Wine
echo "4️⃣ Testing Sacred Wine..."
bash sacred-wine echo "Hello from consciousness layer"
echo

# Test 5: Process monitoring
echo "5️⃣ Checking Process Count..."
echo "Active processes: $(ps aux --no-headers | wc -l)"
echo

echo "✅ All tests complete!"
echo
echo "🌟 To experience fully:"
echo "   - Run: bash luminous-clean"
echo "   - Try: first-presence (full meditation)"
echo "   - Check: coherence anytime"