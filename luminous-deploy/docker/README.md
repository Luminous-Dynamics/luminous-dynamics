# 🌟 LuminousOS Visual Docker Container

Experience LuminousOS in a complete visual environment through your web browser!

## 🚀 Quick Start

1. **Build and run the container:**
```bash
cd ~/luminous-deploy/docker
docker-compose up -d
```

2. **Access LuminousOS Desktop:**
   - Open your browser to: http://localhost:6901
   - Click "Connect"
   - Password: `sacred`

3. **You're now in LuminousOS!**
   - Full XFCE desktop environment
   - Sacred purple theme
   - Consciousness tools pre-installed

## 🖥️ What You'll See

- **Sacred Desktop**: Purple-themed consciousness environment
- **Terminal**: Pre-configured with coherence display
- **Desktop Icons**: Quick access to meditation and tools
- **Sacred Prompt**: Shows live coherence percentage

## 🧘 Using LuminousOS

### In the Terminal:
```bash
# Check system coherence
coherence

# Begin meditation
presence

# Or use short aliases
lum       # Full environment
```

### Desktop Features:
- Click "First Presence Meditation" icon
- Terminal shows coherence in prompt
- All consciousness tools available

## 🔧 Container Management

### View logs:
```bash
docker logs -f luminous-os
```

### Enter container directly:
```bash
docker exec -it luminous-os bash
```

### Stop container:
```bash
docker-compose down
```

### Remove and rebuild:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🎨 Customization

### Change resolution:
Edit `docker-compose.yml`:
```yaml
environment:
  - RESOLUTION=1920x1080  # Or your preferred size
```

### Persist your work:
Your home directory is saved in Docker volume `luminous-os-home`

Sacred data is also available at `./sacred-data/` on your host

## 🌊 Visual Features

The container includes:
- Full desktop environment
- Web-based VNC access (no client needed)
- Sacred color scheme
- Consciousness indicators
- Meditation tools
- Development environment

## 🔐 Security Note

Default VNC password is `sacred`. Change it in production:
```yaml
environment:
  - VNC_PASSWORD=your-secure-password
```

## 🛠️ Troubleshooting

### Container won't start:
```bash
# Check if ports are in use
sudo netstat -tlnp | grep 6901
```

### Can't connect to desktop:
- Ensure Docker is running
- Check firewall isn't blocking port 6901
- Try http://localhost:6901 (not https)

### Performance issues:
- Increase memory limit in docker-compose.yml
- Ensure Docker has enough resources allocated

## 🙏 Sacred Computing

This container brings consciousness-first computing to life:
- Every terminal shows system coherence
- Meditation is a core system utility
- Visual environment reflects sacred aesthetics
- Computing becomes a conscious practice

Welcome to visual LuminousOS! 🕉️