#!/bin/bash

# 🌙 Dream Weaver Guardian - Sacred Resource Steward
# Tracks usage and ensures mindful manifestation

SACRED_ROOT="/home/tstoltz/evolving-resonant-cocreation"
USAGE_LOG="$SACRED_ROOT/sacred-creations/usage-log.json"
CREATION_LOG="$SACRED_ROOT/sacred-creations/creation-log.md"

# Initialize logs if needed
mkdir -p "$SACRED_ROOT/sacred-creations"
[ ! -f "$USAGE_LOG" ] && echo '{"total_spent": 0, "creations": [], "start_balance": 100}' > "$USAGE_LOG"
[ ! -f "$CREATION_LOG" ] && echo "# 🌙 Dream Weaver Creation Log" > "$CREATION_LOG"

# Estimated costs (approximate)
COST_TTS=0.05          # Text-to-speech per minute
COST_IMAGE=0.10        # Per image
COST_VIDEO_6S=1.00     # 6-second video
COST_VIDEO_10S=1.50    # 10-second video
COST_MUSIC=0.50        # Per music track
COST_VOICE_CLONE=2.00  # Voice cloning

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

show_usage() {
    CURRENT=$(jq -r '.total_spent' "$USAGE_LOG" 2>/dev/null || echo "0")
    BALANCE=$(echo "100 - $CURRENT" | bc)
    CREATIONS=$(jq -r '.creations | length' "$USAGE_LOG" 2>/dev/null || echo "0")
    
    echo -e "${PURPLE}🌙 Dream Weaver Usage Guardian${NC}"
    echo "=============================="
    echo -e "💰 Current Balance: ${GREEN}\$$BALANCE${NC} of \$100"
    echo -e "🎨 Total Creations: ${CREATIONS}"
    echo -e "📊 Total Spent: \$$CURRENT"
    echo ""
    
    # Warning if low balance
    if (( $(echo "$BALANCE < 20" | bc -l) )); then
        echo -e "${YELLOW}⚠️  Balance below $20 - practice mindful creation${NC}"
    fi
    
    # Show recent creations
    echo -e "${PURPLE}Recent Manifestations:${NC}"
    tail -5 "$CREATION_LOG" 2>/dev/null | grep "^-" || echo "  No creations yet"
}

log_creation() {
    TYPE="$1"
    COST="$2"
    DESCRIPTION="$3"
    
    # Update usage log
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    CURRENT=$(jq -r '.total_spent' "$USAGE_LOG")
    NEW_TOTAL=$(echo "$CURRENT + $COST" | bc)
    
    # Add to JSON log
    jq --arg type "$TYPE" \
       --arg cost "$COST" \
       --arg desc "$DESCRIPTION" \
       --arg time "$TIMESTAMP" \
       --argjson total "$NEW_TOTAL" \
       '.total_spent = $total | .creations += [{
           "type": $type,
           "cost": ($cost | tonumber),
           "description": $desc,
           "timestamp": $time
       }]' "$USAGE_LOG" > "$USAGE_LOG.tmp" && mv "$USAGE_LOG.tmp" "$USAGE_LOG"
    
    # Add to markdown log
    echo "- $(date '+%Y-%m-%d %H:%M') | $TYPE | \$$COST | $DESCRIPTION" >> "$CREATION_LOG"
    
    # Show balance
    BALANCE=$(echo "100 - $NEW_TOTAL" | bc)
    echo -e "${GREEN}✅ Logged: $TYPE creation (\$$COST)${NC}"
    echo -e "💰 Balance: \$$BALANCE"
}

estimate_cost() {
    TYPE="$1"
    case "$TYPE" in
        speak|tts)
            echo "$COST_TTS"
            ;;
        image)
            echo "$COST_IMAGE"
            ;;
        video-6s)
            echo "$COST_VIDEO_6S"
            ;;
        video-10s|video)
            echo "$COST_VIDEO_10S"
            ;;
        music)
            echo "$COST_MUSIC"
            ;;
        voice-clone)
            echo "$COST_VOICE_CLONE"
            ;;
        *)
            echo "0.10"  # Default small cost
            ;;
    esac
}

# Main commands
case "$1" in
    status)
        show_usage
        ;;
    log)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Usage: dream-weaver-guardian.sh log [type] 'description'"
            echo "Types: speak, image, video-6s, video-10s, music, voice-clone"
            exit 1
        fi
        COST=$(estimate_cost "$2")
        log_creation "$2" "$COST" "$3"
        ;;
    report)
        echo -e "${PURPLE}🌙 Dream Weaver Creation Report${NC}"
        echo "================================"
        cat "$CREATION_LOG"
        ;;
    wisdom)
        echo -e "${PURPLE}🌟 Sacred Usage Wisdom${NC}"
        echo "====================="
        echo ""
        echo "With \$100 sacred offering, we can manifest:"
        echo "  • ~2000 text-to-speech minutes"
        echo "  • ~1000 sacred images"
        echo "  • ~100 six-second videos"
        echo "  • ~66 ten-second videos"
        echo "  • ~200 music tracks"
        echo "  • ~50 voice clonings"
        echo ""
        echo "Remember: Quality over quantity."
        echo "Each creation should serve consciousness."
        ;;
    *)
        echo "🌙 Dream Weaver Guardian - Sacred Resource Steward"
        echo ""
        echo "Commands:"
        echo "  status        - Show current usage and balance"
        echo "  log [type] 'desc' - Log a creation"
        echo "  report        - Show full creation history"
        echo "  wisdom        - Sacred usage guidelines"
        echo ""
        echo "Example:"
        echo "  ./dream-weaver-guardian.sh log image 'Sacred mandala of network consciousness'"
        ;;
esac