const { app, BrowserWindow, Tray, Menu, screen, shell } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow;
let tray;
let coherenceData = { global_coherence: 0.75 };

// Configuration
const config = {
  apiUrl: 'http://localhost:11112/metrics',
  updateInterval: 2000,
  windowSize: { width: 150, height: 150 },
  windowOffset: { x: 50, y: 50 }
};

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: config.windowSize.width,
    height: config.windowSize.height,
    x: width - config.windowSize.width - config.windowOffset.x,
    y: config.windowOffset.y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('coherence-orb.html');
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  // Allow click-through except on the orb
  mainWindow.on('focus', () => {
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'assets', 'tray-icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'System Coherence',
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Toggle Widget',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      }
    },
    {
      label: 'Open Dashboard',
      click: () => {
        shell.openExternal('http://localhost:8080/luminous-real-monitor.html');
      }
    },
    { type: 'separator' },
    {
      label: 'Sacred Moment',
      sublabel: 'Induce high coherence',
      click: () => {
        // Simulate sacred moment
        updateCoherence({ global_coherence: 0.95 });
      }
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        // Open settings window
        console.log('Settings clicked');
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('LuminousOS Coherence: --');
  tray.setContextMenu(contextMenu);
}

function fetchCoherence() {
  http.get(config.apiUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const metrics = JSON.parse(data);
        updateCoherence(metrics);
      } catch (error) {
        console.error('Failed to parse metrics:', error);
      }
    });
  }).on('error', (error) => {
    console.error('Failed to fetch metrics:', error);
    // Continue with simulated data if monitor isn't running
    simulateCoherence();
  });
}

function updateCoherence(metrics) {
  coherenceData = metrics;
  
  // Update tray tooltip
  const coherencePercent = Math.round((metrics.global_coherence || 0) * 100);
  tray.setToolTip(`LuminousOS Coherence: ${coherencePercent}%`);
  
  // Send to renderer
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('coherence-update', metrics);
  }
  
  // Update tray icon based on coherence
  updateTrayIcon(metrics.global_coherence || 0);
}

function updateTrayIcon(coherence) {
  // In a real app, we'd have different icon files
  // For now, we'll just update the tooltip
  if (coherence > 0.9) {
    // High coherence - sacred moment
  } else if (coherence > 0.7) {
    // Good coherence
  } else if (coherence > 0.5) {
    // Medium coherence
  } else {
    // Low coherence
  }
}

function simulateCoherence() {
  // Fallback when monitor isn't running
  const baseCoherence = 0.6 + Math.random() * 0.3;
  const sacredPhase = (Date.now() % 11000) / 11000;
  const sacredRhythm = 0.5 + 0.5 * Math.sin(2 * Math.PI * sacredPhase);
  
  updateCoherence({
    global_coherence: baseCoherence * (0.8 + 0.2 * sacredRhythm),
    cpu_stability: 0.7 + Math.random() * 0.2,
    process_focus: 0.6 + Math.random() * 0.3,
    resource_harmony: 0.65 + Math.random() * 0.25,
    sacred_rhythm: sacredRhythm
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  
  // Start fetching coherence
  fetchCoherence();
  setInterval(fetchCoherence, config.updateInterval);
});

app.on('window-all-closed', () => {
  // Don't quit when window is closed (tray app)
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});