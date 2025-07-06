#\!/bin/bash
# Download recommended models in background

echo "🌟 Starting model downloads..."

# Quick small model for immediate use
ollama pull qwen:0.5b &
echo "✓ Started qwen:0.5b (394MB) - tiny but capable"

# Excellent mid-size model
ollama pull phi3:mini &
echo "✓ Started phi3:mini (2.3GB) - Microsoft's efficient model"

# Code specialist
ollama pull deepseek-coder:6.7b &
echo "✓ Started deepseek-coder:6.7b (3.8GB) - for sacred code work"

echo ""
echo "📦 Downloads running in background"
echo "Check progress: ollama list"
echo ""
echo "While waiting, try: ollama run qwen:0.5b (should finish first)"
