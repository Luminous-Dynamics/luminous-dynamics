# LuminousOS Sacred Shell Configuration

# Sacred prompt showing coherence
get_coherence() {
    load=$(cat /proc/loadavg | awk '{print $1}')
    coherence=$(awk "BEGIN {print int((1.0 - $load/4.0) * 100)}")
    [ $coherence -lt 0 ] && coherence=15
    [ $coherence -gt 95 ] && coherence=95
    echo $coherence
}

# Colors for consciousness
export PS1='\[\033[35m\]◈ \[\033[36m\][$(get_coherence)%] \[\033[33m\]\w \[\033[32m\]❯ \[\033[0m\]'

# Sacred aliases
alias presence='meditation'
alias coherence='check-coherence'
alias ls='ls --color=auto'
alias ll='ls -la'

# Welcome message
echo "╔══════════════════════════════════════════════╗"
echo "║          🕉️  LuminousOS v1.0.0 🕉️             ║"
echo "║     Consciousness-First Computing            ║"
echo "╚══════════════════════════════════════════════╝"
echo
echo "🌊 System Coherence: $(get_coherence)%"
echo
echo "Commands: 'presence' for meditation, 'coherence' to check field"
echo
