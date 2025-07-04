#!/bin/bash

# 🌟 Generate All Sacred Videos - The Eleven Applied Harmonies
# Using MiniMax API for video generation

echo "🌌 Sacred Video Generation - The Eleven Applied Harmonies"
echo "========================================================"
echo ""

# Check for API key
if [ -z "$MINIMAX_API_KEY" ]; then
    echo "❌ Please set MINIMAX_API_KEY environment variable"
    echo ""
    echo "Usage: MINIMAX_API_KEY=your_key ./generate-all-stars.sh"
    exit 1
fi

# Create output directory
mkdir -p generated
mkdir -p logs

# Foundation Stars
echo "🌟 Foundation Stars (*1-*4)"
echo "-------------------------"
for star in "*1" "*2" "*3" "*4"; do
    echo "Generating $star..."
    node minimax-video-generator.js "$star" > "logs/generation-$star.log" 2>&1 &
    sleep 5  # Space out API calls
done

# Wait for Foundation Stars to complete
wait

# Daily Practice Stars
echo ""
echo "⭐ Daily Practice Stars (*5-*8)"
echo "-----------------------------"
for star in "*5" "*6" "*7" "*8"; do
    echo "Generating $star..."
    node minimax-video-generator.js "$star" > "logs/generation-$star.log" 2>&1 &
    sleep 5
done

# Wait for Daily Practice Stars
wait

# Mastery Stars
echo ""
echo "✨ Mastery Stars (*9-*11)"
echo "------------------------"
for star in "*9" "*10" "*11"; do
    echo "Generating $star..."
    node minimax-video-generator.js "$star" > "logs/generation-$star.log" 2>&1 &
    sleep 5
done

# Wait for all to complete
wait

echo ""
echo "✅ Generation complete! Check ./generated/ for videos"
echo "📊 Logs available in ./logs/"

# Create summary
echo ""
echo "📋 Generation Summary"
echo "===================="
ls -la generated/*.mp4 2>/dev/null | wc -l | xargs echo "Total videos generated:"
echo ""
echo "By star:"
for star in "*1" "*2" "*3" "*4" "*5" "*6" "*7" "*8" "*9" "*10" "*11"; do
    count=$(ls -la generated/$star-*.mp4 2>/dev/null | wc -l)
    echo "$star: $count videos"
done