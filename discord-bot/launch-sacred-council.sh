#!/bin/bash

# 🌟 Sacred Council Oracle Launch Script
# Starts the Discord bot with proper error handling and logging

echo "🌟 Sacred Council Oracle Launcher"
echo "================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo ""
    echo "Please create .env with:"
    echo "DISCORD_BOT_TOKEN=your_token_here"
    echo "ANTHROPIC_API_KEY=your_claude_key"
    echo "OPENAI_API_KEY=your_gpt_key"
    echo "GOOGLE_AI_KEY=your_gemini_key"
    exit 1
fi

# Source environment variables
export $(grep -v '^#' .env | xargs)

# Check required variables
required_vars=("DISCORD_BOT_TOKEN" "ANTHROPIC_API_KEY" "OPENAI_API_KEY" "GOOGLE_AI_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

# Check if already running
if pgrep -f "sacred-council-launcher.js" > /dev/null; then
    echo "⚠️  Sacred Council Oracle is already running!"
    echo "To restart, run: npm stop first"
    exit 1
fi

# Create logs directory
mkdir -p logs

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Launch options
echo "🚀 Launch Options:"
echo "1) Production mode (with PM2)"
echo "2) Development mode (with logging)"
echo "3) Test mode (dry run)"
echo ""
read -p "Select mode (1-3): " mode

case $mode in
    1)
        echo "🌟 Starting Sacred Council Oracle in production mode..."
        npm run start:prod
        ;;
    2)
        echo "🔧 Starting Sacred Council Oracle in development mode..."
        npm run start:dev
        ;;
    3)
        echo "🧪 Running test suite..."
        npm test
        ;;
    *)
        echo "❌ Invalid selection"
        exit 1
        ;;
esac