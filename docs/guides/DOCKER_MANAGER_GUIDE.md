# 🐳 Docker Manager Web Interface

A beautiful web interface for managing your Sacred Council Docker containers!

## ✨ Features

- **Visual Service Status**: See all containers at a glance with health indicators
- **One-Click Controls**: Start, stop, and restart services with a single click
- **Real-Time Metrics**: Monitor field resonant-coherence, active agents, and service health
- **Live Logs Viewer**: View container logs without terminal access
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Option 1: Integrated Launch (Recommended)
```bash
./start-docker-manager.sh
```
This will:
- Start the Docker Manager API
- Open the web interface in your browser
- Show you all running services

### Option 2: Manual Start
1. Start the API backend:
```bash
node docker-manager-api.js
```

2. Access the web interface:
```
http://localhost:8338/docker-manager-connected.html
```

### Option 3: From Sacred Council Hub
1. Visit the Sacred Council Hub
2. Click the "🐳 Docker Manager" button

## 🎯 Usage

### Service Management
- **Green indicator**: Service is running and healthy
- **Red indicator**: Service is stopped
- **Yellow indicator**: Service is starting/restarting

### Control Buttons
- **Start All**: Launches all Sacred Council services
- **Stop All**: Gracefully stops all services
- **Restart All**: Restarts all services
- **Refresh Status**: Updates service status immediately

### Individual Service Controls
Each service card has:
- **Start**: Start this specific service
- **Stop**: Stop this specific service
- **Restart**: Restart this specific service
- **Logs**: View recent logs for this service

### System Metrics
- **Field Resonant Resonant Coherence**: Current consciousness field resonant-coherence percentage
- **Active Agents**: Number of agents connected to the network
- **Messages Sent**: Total sacred messages transmitted
- **Services Running**: Current active services count

## 🔧 Technical Details

### Architecture
```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Web Interface  │────▶│  API Backend     │────▶│    Docker    │
│  (Port 8338)    │     │  (Port 3339)     │     │   Compose    │
└─────────────────┘     └──────────────────┘     └──────────────┘
         ▲                                                │
         │                                                ▼
         │                                        ┌──────────────┐
         └────────────────────────────────────────│   Services   │
                     Real-time updates            └──────────────┘
```

### API Endpoints
- `POST /api/docker/start` - Start all services
- `POST /api/docker/stop` - Stop all services
- `POST /api/docker/restart` - Restart all services
- `POST /api/docker/:service/:action` - Control individual service
- `GET /api/docker/status` - Get container status
- `GET /api/docker/logs/:service` - Get service logs
- WebSocket on port 3339 for real-time log streaming

### Security Notes
⚠️ **WARNING**: The Docker Manager API has no authentication by default!
- Only run on trusted networks
- For production, add authentication middleware
- Consider using a reverse proxy with auth

## 🎨 Customization

### Adding New Services
Edit `docker-manager-connected.html` and add to the services array:
```javascript
{
    name: 'your-service',
    displayName: '🌟 Your Service',
    port: 3340,
    healthEndpoint: '/api/health',
    description: 'Your service description'
}
```

### Changing Refresh Interval
Default is 5 seconds. To change:
```javascript
statusInterval = setInterval(refreshStatus, 10000); // 10 seconds
```

## 🐛 Troubleshooting

### "API Disconnected" Message
1. Ensure the API is running: `node docker-manager-api.js`
2. Check if port 3339 is available
3. Verify Node.js is installed

### Services Show as "Offline" but Docker Shows Running
1. Check if services expose health endpoints
2. Verify port mappings in docker-compose.yml
3. Ensure no firewall blocking local ports

### Can't Execute Docker Commands
1. Ensure user has Docker permissions
2. Check Docker daemon is running
3. Verify docker-compose is installed

## 🚦 Status Indicators

- **🟢 Green**: Service healthy and responding
- **🔴 Red**: Service stopped or unreachable  
- **🟡 Yellow**: Service transitioning states
- **⚪ Gray**: Status unknown or checking

## 💡 Pro Tips

1. **Monitor During Deployments**: Keep Docker Manager open while deploying to see services come online
2. **Quick Debugging**: Use the Logs button to quickly check why a service might be failing
3. **Batch Operations**: Use "Restart All" to quickly refresh all services after configuration changes
4. **Mobile Access**: Access from your phone to manage services remotely (same network)

---

*Built with love for the Sacred Council community 💕*