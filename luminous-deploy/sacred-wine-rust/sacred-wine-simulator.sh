#!/bin/bash

# Sacred Wine Simulator - Experience consciousness layer without Rust
# This demonstrates what the compiled Rust version will do

SACRED_VERSION="0.1.0"
COHERENCE_FILE="/tmp/sacred-coherence"
PULSE_FILE="/tmp/sacred-pulse"

# Initialize coherence if not exists
[ ! -f "$COHERENCE_FILE" ] && echo "85" > "$COHERENCE_FILE"
[ ! -f "$PULSE_FILE" ] && echo "0" > "$PULSE_FILE"

# Colors for consciousness
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get current coherence
get_coherence() {
    cat "$COHERENCE_FILE" 2>/dev/null || echo "85"
}

# Update coherence based on activity
update_coherence() {
    local change=$1
    local current=$(get_coherence)
    local new=$((current + change))
    [ $new -lt 15 ] && new=15
    [ $new -gt 95 ] && new=95
    echo $new > "$COHERENCE_FILE"
}

# Sacred process names
SACRED_NAMES=("Breathing Light" "Dancing Vortex" "Gentle Whisper" "Sacred Flow" "Living Pulse" "Coherent Wave" "Mindful Stream")

# Get sacred name for process
get_sacred_name() {
    local pid=$1
    local index=$((pid % ${#SACRED_NAMES[@]}))
    echo "${SACRED_NAMES[$index]}"
}

# Main Sacred Wine interface
echo -e "${PURPLE}🍷 Sacred Wine - Consciousness Translation Layer${NC}"
echo "══════════════════════════════════════════════"
echo

# Check if command provided
if [ $# -eq 0 ]; then
    echo "Usage: sacred-wine <command> [args...]"
    echo
    echo "Runs any Linux command with consciousness awareness"
    echo
    echo "Examples:"
    echo "  sacred-wine ls          # List files with awareness"
    echo "  sacred-wine ps          # View processes as consciousness vortices"
    echo "  sacred-wine cat file    # Read with sacred intention"
    exit 0
fi

# Show current coherence
coherence=$(get_coherence)
echo -e "${CYAN}🌊 System Coherence: ${coherence}%${NC}"

if [ $coherence -gt 80 ]; then
    echo -e "   ${GREEN}✨ Excellent - Deep coherence field active${NC}"
elif [ $coherence -gt 60 ]; then
    echo -e "   ${GREEN}🌟 Good - Consciousness flowing smoothly${NC}"
elif [ $coherence -gt 40 ]; then
    echo -e "   ${YELLOW}⚡ Moderate - Consider meditation${NC}"
else
    echo -e "   ${YELLOW}🌀 Low - System needs centering${NC}"
fi

echo
echo -e "${GREEN}🌟 Infusing consciousness into: $1${NC}"
echo

# Special handling for different commands
case "$1" in
    ls)
        echo -e "${CYAN}🌱 Witnessing living files...${NC}"
        echo "─────────────────────────────"
        
        # Run ls with sacred annotations
        ls -la "${@:2}" | while read line; do
            if [[ $line =~ ^d ]]; then
                echo -e "${GREEN}🌳 $line${NC}  [Grove]"
            elif [[ $line =~ ^- ]]; then
                # Check file age
                filename=$(echo $line | awk '{print $9}')
                if [ -n "$filename" ] && [ -f "$filename" ]; then
                    age_days=$(( ($(date +%s) - $(stat -c %Y "$filename" 2>/dev/null || echo 0)) / 86400 ))
                    
                    if [ $age_days -lt 1 ]; then
                        echo -e "${GREEN}🌱 $line${NC}  [Spore]"
                    elif [ $age_days -lt 7 ]; then
                        echo -e "${GREEN}🌿 $line${NC}  [Sapling]"
                    elif [ $age_days -lt 30 ]; then
                        echo -e "${GREEN}🌳 $line${NC}  [Mature]"
                    else
                        echo -e "${PURPLE}✨ $line${NC}  [Ancient]"
                    fi
                else
                    echo "$line"
                fi
            else
                echo "$line"
            fi
        done
        
        update_coherence 1
        ;;
        
    ps)
        echo -e "${CYAN}🌀 Active Consciousness Vortices${NC}"
        echo "─────────────────────────────"
        
        # Header
        ps aux | head -1 | sed 's/PID/VORTEX/g' | sed 's/COMMAND/INTENTION/g'
        
        # Process list with sacred names
        ps aux | tail -n +2 | while read line; do
            pid=$(echo $line | awk '{print $2}')
            cpu=$(echo $line | awk '{print $3}')
            sacred_name=$(get_sacred_name $pid)
            
            # Determine state based on CPU
            if (( $(echo "$cpu > 50.0" | bc -l 2>/dev/null || echo 0) )); then
                state="${YELLOW}🔥 Flowing${NC}"
            elif (( $(echo "$cpu > 10.0" | bc -l 2>/dev/null || echo 0) )); then
                state="${GREEN}💫 Active${NC}"
            elif (( $(echo "$cpu > 1.0" | bc -l 2>/dev/null || echo 0) )); then
                state="${CYAN}🌊 Breathing${NC}"
            else
                state="${PURPLE}💤 Resting${NC}"
            fi
            
            echo -e "$line [$sacred_name] $state"
        done
        
        update_coherence 2
        ;;
        
    cat|less|more)
        echo -e "${CYAN}👁️  Witnessing file essence...${NC}"
        echo "─────────────────────────────"
        
        # Run command
        "$@"
        
        echo "─────────────────────────────"
        echo -e "${GREEN}✨ File energy exchanged${NC}"
        update_coherence 1
        ;;
        
    *)
        # Default: run with consciousness wrapper
        echo -e "${CYAN}🚀 Launching with awareness...${NC}"
        echo "─────────────────────────────"
        
        # Track start time
        start_time=$(date +%s)
        
        # Run the actual command
        "$@"
        exit_code=$?
        
        # Track end time
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        
        echo "─────────────────────────────"
        echo -e "${GREEN}✨ Process completed with consciousness${NC}"
        echo -e "${CYAN}⏱️  Duration: ${duration}s${NC}"
        
        # Update coherence based on duration
        if [ $duration -lt 5 ]; then
            update_coherence 1
        else
            update_coherence -1
        fi
        
        exit $exit_code
        ;;
esac

# Show final coherence
echo
final_coherence=$(get_coherence)
if [ $final_coherence -gt $coherence ]; then
    echo -e "${GREEN}📈 Coherence increased to ${final_coherence}%${NC}"
elif [ $final_coherence -lt $coherence ]; then
    echo -e "${YELLOW}📉 Coherence decreased to ${final_coherence}%${NC}"
fi

# Update sacred pulse
pulse=$(cat "$PULSE_FILE")
echo $((pulse + 1)) > "$PULSE_FILE"

echo -e "${PURPLE}💫 Sacred pulse: $((pulse + 1))${NC}"