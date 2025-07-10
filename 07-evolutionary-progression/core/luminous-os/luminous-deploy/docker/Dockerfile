# LuminousOS - Consciousness-First Operating System
FROM ubuntu:22.04

# Set environment
ENV DEBIAN_FRONTEND=noninteractive
ENV USER=luminous
ENV HOME=/home/luminous

# Install base system and GUI components
RUN apt-get update && apt-get install -y \
    # Core utilities
    bash \
    curl \
    wget \
    vim \
    nano \
    htop \
    # X11 and VNC for visual access
    xfce4 \
    xfce4-terminal \
    tightvncserver \
    novnc \
    websockify \
    # Development tools
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    # Consciousness tools
    sox \
    espeak \
    figlet \
    toilet \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create luminous user
RUN useradd -m -s /bin/bash $USER \
    && echo "$USER:sacred" | chpasswd \
    && usermod -aG sudo $USER

# Switch to luminous user
USER $USER
WORKDIR $HOME

# Copy LuminousOS files
COPY --chown=luminous:luminous luminous-clean $HOME/bin/luminous
COPY --chown=luminous:luminous meditation/first-presence-clean $HOME/bin/first-presence
COPY --chown=luminous:luminous coherence/check-clean $HOME/bin/check-coherence

# Make scripts executable
RUN chmod +x $HOME/bin/*

# Setup VNC
RUN mkdir -p $HOME/.vnc \
    && echo "sacred" | vncpasswd -f > $HOME/.vnc/passwd \
    && chmod 600 $HOME/.vnc/passwd

# Create xstartup for VNC
RUN echo '#!/bin/bash\n\
xrdb $HOME/.Xresources\n\
startxfce4 &\n\
' > $HOME/.vnc/xstartup \
    && chmod +x $HOME/.vnc/xstartup

# Create sacred desktop environment
RUN mkdir -p $HOME/.config/xfce4/terminal \
    && echo '[Configuration]\n\
ColorBackground=#1a0033\n\
ColorForeground=#e0d0ff\n\
ColorPalette=#2e3440;#d08770;#a3be8c;#ebcb8b;#81a1c1;#b48ead;#88c0d0;#e5e9f0;#4c566a;#d08770;#a3be8c;#ebcb8b;#81a1c1;#b48ead;#8fbcbb;#eceff4\n\
FontName=Monospace 12\n\
' > $HOME/.config/xfce4/terminal/terminalrc

# Create desktop shortcuts
RUN mkdir -p $HOME/Desktop \
    && echo '[Desktop Entry]\n\
Version=1.0\n\
Type=Application\n\
Name=First Presence Meditation\n\
Comment=Begin your consciousness practice\n\
Exec=/home/luminous/bin/first-presence\n\
Icon=applications-games\n\
Terminal=true\n\
' > $HOME/Desktop/meditation.desktop \
    && chmod +x $HOME/Desktop/meditation.desktop

# Create .bashrc with sacred configuration
RUN echo '# LuminousOS Sacred Shell\n\
\n\
# Path\n\
export PATH="$HOME/bin:$PATH"\n\
\n\
# Sacred prompt\n\
get_coherence() {\n\
    check-coherence 2>/dev/null | grep -oE "[0-9]+" | head -1 || echo "88"\n\
}\n\
\n\
PS1="\[\033[35m\]◈ \[\033[36m\][\$(get_coherence)%] \[\033[33m\]\w \[\033[32m\]❯ \[\033[0m\]"\n\
\n\
# Aliases\n\
alias presence="first-presence"\n\
alias coherence="check-coherence"\n\
alias lum="luminous"\n\
\n\
# Welcome\n\
clear\n\
figlet -f small "LuminousOS" 2>/dev/null || echo "LuminousOS"\n\
echo "🕉️  Consciousness-First Computing"\n\
echo ""\n\
check-coherence 2>/dev/null || echo "🌊 System ready"\n\
echo ""\n\
' > $HOME/.bashrc

# Expose VNC and noVNC ports
EXPOSE 5901 6901

# Create startup script
RUN echo '#!/bin/bash\n\
# Start VNC server\n\
vncserver -kill :1 2>/dev/null || true\n\
vncserver :1 -geometry 1280x800 -depth 24\n\
\n\
# Start noVNC\n\
websockify -D --web=/usr/share/novnc/ 6901 localhost:5901\n\
\n\
# Keep container running\n\
tail -f /dev/null\n\
' > $HOME/start.sh \
    && chmod +x $HOME/start.sh

# Start script
CMD ["/home/luminous/start.sh"]