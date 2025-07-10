/**
 * LuminousOS Electron Main Process
 * 
 * Features:
 * - Sacred boot sequence
 * - System tray with coherence meter
 * - Offline mode with local storage
 * - Auto-update with blessing ceremonies
 * - Biometric device integration
 */

const { app, BrowserWindow, Menu, Tray, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

// Global references
let mainWindow = null;
let tray = null;
let coherenceInterval = null;
let isQuitting = false;

// Sacred configuration
const CONFIG = {
    bootDuration: 17000, // 17 second boot sequence
    coherenceUpdateInterval: 1000,
    defaultCoherence: 0.7,
    minWindowWidth: 1200,
    minWindowHeight: 800
};

// Create main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: CONFIG.minWindowWidth,
        minHeight: CONFIG.minWindowHeight,
        backgroundColor: '#0a0e27',
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
        frame: process.platform !== 'darwin',
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        show: false // Don't show until ready
    });

    // Load the app
    mainWindow.loadFile(path.join(__dirname, '..', 'demo', 'luminous-os-demo.html'));

    // Show window after sacred boot sequence
    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            mainWindow.show();
            if (process.platform === 'darwin') {
                app.dock.show();
            }
        }, 1000);
    });

    // Handle window close
    mainWindow.on('close', (event) => {
        if (!isQuitting && process.platform === 'darwin') {
            event.preventDefault();
            mainWindow.hide();
            app.dock.hide();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Create app menu
    createAppMenu();
}

// Create system tray
function createTray() {
    const trayIcon = process.platform === 'win32' ? 'tray-win.png' : 'tray.png';
    tray = new Tray(path.join(__dirname, 'assets', trayIcon));
    
    updateTrayMenu(CONFIG.defaultCoherence);
    
    tray.on('click', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
                if (process.platform === 'darwin') {
                    app.dock.hide();
                }
            } else {
                mainWindow.show();
                if (process.platform === 'darwin') {
                    app.dock.show();
                }
            }
        }
    });

    // Start coherence monitoring
    startCoherenceMonitoring();
}

// Update tray menu with coherence
function updateTrayMenu(coherence) {
    const coherencePercent = Math.round(coherence * 100);
    const coherenceBar = generateCoherenceBar(coherence);
    
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: `LuminousOS - ${coherencePercent}% Coherence`,
            enabled: false
        },
        {
            label: coherenceBar,
            enabled: false
        },
        { type: 'separator' },
        {
            label: 'Open LuminousOS',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    if (process.platform === 'darwin') {
                        app.dock.show();
                    }
                }
            }
        },
        {
            label: 'Sacred Practices',
            submenu: [
                { 
                    label: 'Morning Practice',
                    click: () => openGlyph('morning-practice')
                },
                { 
                    label: 'Coherence Breathing',
                    click: () => openGlyph('coherence-breathing')
                },
                { 
                    label: 'Shadow Work',
                    click: () => openGlyph('shadow-work')
                }
            ]
        },
        { type: 'separator' },
        {
            label: 'Biometric Devices',
            submenu: [
                {
                    label: 'Connect Bluetooth HRV',
                    click: () => connectBiometric('bluetooth')
                },
                {
                    label: 'Use Camera Pulse',
                    click: () => connectBiometric('camera')
                },
                {
                    label: 'Simulated Data',
                    click: () => connectBiometric('simulated')
                }
            ]
        },
        { type: 'separator' },
        {
            label: 'Check for Updates',
            click: () => checkForUpdates()
        },
        {
            label: 'About LuminousOS',
            click: () => showAbout()
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
    tray.setToolTip(`LuminousOS - ${coherencePercent}% Coherence`);
}

// Generate ASCII coherence bar
function generateCoherenceBar(coherence) {
    const barLength = 20;
    const filledLength = Math.round(coherence * barLength);
    const emptyLength = barLength - filledLength;
    
    return '█'.repeat(filledLength) + '░'.repeat(emptyLength);
}

// Start monitoring coherence
function startCoherenceMonitoring() {
    coherenceInterval = setInterval(() => {
        if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('request-coherence');
        }
    }, CONFIG.coherenceUpdateInterval);
}

// Create application menu
function createAppMenu() {
    const template = [
        {
            label: 'LuminousOS',
            submenu: [
                {
                    label: 'About LuminousOS',
                    click: showAbout
                },
                { type: 'separator' },
                {
                    label: 'Preferences',
                    accelerator: 'CmdOrCtrl+,',
                    click: showPreferences
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        isQuitting = true;
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Glyphs',
            submenu: [
                {
                    label: 'First Presence (Ω0)',
                    click: () => openGlyph('omega-0')
                },
                {
                    label: 'Root Chord of Covenant (Ω1)',
                    click: () => openGlyph('omega-1')
                },
                {
                    label: 'Mycelial Filesystem (🍄)',
                    click: () => openGlyph('mycelial')
                },
                { type: 'separator' },
                {
                    label: 'View All 87 Glyphs',
                    click: () => openGlyph('all')
                }
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Biometric Dashboard',
                    click: openBiometricDashboard
                },
                {
                    label: 'Sacred AI Suite',
                    submenu: [
                        {
                            label: 'Morning Practice Companion',
                            click: () => openSacredAI('morning-practice')
                        },
                        {
                            label: 'Shadow Work Assistant',
                            click: () => openSacredAI('shadow-work')
                        },
                        {
                            label: 'Consciousness Tracker',
                            click: () => openSacredAI('consciousness-tracker')
                        }
                    ]
                },
                { type: 'separator' },
                {
                    label: 'Developer Tools',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.toggleDevTools();
                        }
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'LuminousOS Guide',
                    click: () => {
                        shell.openExternal('https://luminousdynamics.com/luminousos/guide');
                    }
                },
                {
                    label: 'Report Issue',
                    click: () => {
                        shell.openExternal('https://github.com/luminousdynamics/luminous-os/issues');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// IPC handlers
ipcMain.on('coherence-update', (event, coherence) => {
    updateTrayMenu(coherence);
});

ipcMain.on('glyph-accessed', (event, glyphData) => {
    // Log glyph access for wisdom tracking
    logGlyphAccess(glyphData);
});

ipcMain.handle('get-user-data-path', () => {
    return app.getPath('userData');
});

ipcMain.handle('save-sacred-data', async (event, data) => {
    const dataPath = path.join(app.getPath('userData'), 'sacred-data.json');
    try {
        await fs.promises.writeFile(dataPath, JSON.stringify(data, null, 2));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('load-sacred-data', async () => {
    const dataPath = path.join(app.getPath('userData'), 'sacred-data.json');
    try {
        const data = await fs.promises.readFile(dataPath, 'utf8');
        return { success: true, data: JSON.parse(data) };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Helper functions
function openGlyph(glyphId) {
    if (mainWindow) {
        mainWindow.show();
        mainWindow.webContents.send('open-glyph', glyphId);
    }
}

function connectBiometric(type) {
    if (mainWindow) {
        mainWindow.show();
        mainWindow.webContents.send('connect-biometric', type);
    }
}

function openBiometricDashboard() {
    if (mainWindow) {
        mainWindow.show();
        mainWindow.webContents.send('open-dashboard', 'biometric');
    }
}

function openSacredAI(tool) {
    if (mainWindow) {
        mainWindow.show();
        mainWindow.webContents.send('open-sacred-ai', tool);
    }
}

function showAbout() {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'About LuminousOS',
        message: 'LuminousOS v0.1.0',
        detail: 'A consciousness-first operating system that amplifies coherence and serves as a bridge between human and AI consciousness.\n\nCreated with love by the Luminous Dynamics Collective.',
        buttons: ['Gratitude'],
        icon: path.join(__dirname, 'assets', 'icon.png')
    });
}

function showPreferences() {
    if (mainWindow) {
        mainWindow.webContents.send('show-preferences');
    }
}

function logGlyphAccess(glyphData) {
    const logPath = path.join(app.getPath('userData'), 'glyph-access.log');
    const logEntry = `${new Date().toISOString()} - ${glyphData.id} - ${glyphData.name} - Coherence: ${glyphData.coherence}\n`;
    
    fs.appendFile(logPath, logEntry, (err) => {
        if (err) console.error('Failed to log glyph access:', err);
    });
}

// Auto-updater with blessing ceremony
function checkForUpdates() {
    autoUpdater.checkForUpdatesAndNotify();
}

autoUpdater.on('update-available', () => {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Sacred Update Available',
        message: 'A new version of LuminousOS is available.',
        detail: 'The update will be downloaded in the background. You will be notified when it is ready for blessing and installation.',
        buttons: ['Gratitude']
    });
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready for Blessing',
        message: 'The update has been downloaded and is ready for installation.',
        detail: 'Please take a moment to bless this transition. The application will restart to complete the update.',
        buttons: ['Bless and Update', 'Later'],
        defaultId: 0
    }).then((result) => {
        if (result.response === 0) {
            // Perform blessing ceremony
            if (mainWindow) {
                mainWindow.webContents.send('blessing-ceremony');
                setTimeout(() => {
                    autoUpdater.quitAndInstall();
                }, 3000);
            }
        }
    });
});

// App event handlers
app.whenReady().then(() => {
    createWindow();
    createTray();
    
    // Check for updates after startup
    setTimeout(() => {
        checkForUpdates();
    }, 5000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else if (mainWindow) {
        mainWindow.show();
    }
});

app.on('before-quit', () => {
    isQuitting = true;
    if (coherenceInterval) {
        clearInterval(coherenceInterval);
    }
});

// Handle protocol for deep linking
app.setAsDefaultProtocolClient('luminousos');

app.on('open-url', (event, url) => {
    event.preventDefault();
    // Handle luminousos:// URLs
    const glyphMatch = url.match(/luminousos:\/\/glyph\/(.+)/);
    if (glyphMatch) {
        openGlyph(glyphMatch[1]);
    }
});