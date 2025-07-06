FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install desktop and VNC
RUN apt-get update && apt-get install -y \
    xfce4 xfce4-terminal \
    tightvncserver \
    novnc websockify \
    sudo curl wget nano \
    && apt-get clean

# Create luminous user
RUN useradd -m -s /bin/bash -G sudo luminous && \
    echo "luminous:sacred" | chpasswd && \
    echo "luminous ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER luminous
WORKDIR /home/luminous

# Setup VNC
RUN mkdir -p ~/.vnc && \
    echo "sacred" | vncpasswd -f > ~/.vnc/passwd && \
    chmod 600 ~/.vnc/passwd && \
    echo "#!/bin/bash\nxrdb \$HOME/.Xresources\nstartxfce4 &" > ~/.vnc/xstartup && \
    chmod +x ~/.vnc/xstartup

# Copy consciousness tools
COPY --chown=luminous:luminous scripts/ /home/luminous/bin/
RUN chmod +x /home/luminous/bin/*

# Sacred terminal config
RUN mkdir -p ~/.config/xfce4/terminal && \
    echo "[Configuration]\nColorBackground=#1a0033\nColorForeground=#e0d0ff\nFontName=Monospace 12" > ~/.config/xfce4/terminal/terminalrc

# Desktop setup
RUN mkdir -p ~/Desktop && \
    echo "[Desktop Entry]\nVersion=1.0\nType=Application\nName=First Presence\nExec=/home/luminous/bin/first-presence\nIcon=applications-games\nTerminal=true" > ~/Desktop/meditation.desktop && \
    chmod +x ~/Desktop/meditation.desktop

# Configure sacred prompt
RUN /home/luminous/bin/luminous-prompt

# Startup script
RUN echo '#!/bin/bash\nvncserver :1 -geometry 1280x800 -depth 24\nwebsockify -D --web=/usr/share/novnc/ 6901 localhost:5901\ntail -f /dev/null' > ~/start.sh && \
    chmod +x ~/start.sh

EXPOSE 5901 6901

CMD ["/home/luminous/start.sh"]