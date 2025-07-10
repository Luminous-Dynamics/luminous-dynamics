/**
 * LuminousOS Electron Preload Script
 * 
 * Bridges the gap between the web app and Electron APIs
 * while maintaining security through context isolation
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected APIs to the renderer process
contextBridge.exposeInMainWorld('luminousAPI', {
    // Coherence updates for system tray
    updateCoherence: (coherence) => {
        ipcRenderer.send('coherence-update', coherence);
    },

    // Glyph access logging
    logGlyphAccess: (glyphData) => {
        ipcRenderer.send('glyph-accessed', glyphData);
    },

    // Sacred data persistence
    saveData: async (data) => {
        return await ipcRenderer.invoke('save-sacred-data', data);
    },

    loadData: async () => {
        return await ipcRenderer.invoke('load-sacred-data');
    },

    // User data path
    getUserDataPath: async () => {
        return await ipcRenderer.invoke('get-user-data-path');
    },

    // Listen for main process commands
    onOpenGlyph: (callback) => {
        ipcRenderer.on('open-glyph', (event, glyphId) => callback(glyphId));
    },

    onConnectBiometric: (callback) => {
        ipcRenderer.on('connect-biometric', (event, type) => callback(type));
    },

    onOpenDashboard: (callback) => {
        ipcRenderer.on('open-dashboard', (event, type) => callback(type));
    },

    onOpenSacredAI: (callback) => {
        ipcRenderer.on('open-sacred-ai', (event, tool) => callback(tool));
    },

    onShowPreferences: (callback) => {
        ipcRenderer.on('show-preferences', () => callback());
    },

    onBlessingCeremony: (callback) => {
        ipcRenderer.on('blessing-ceremony', () => callback());
    },

    onRequestCoherence: (callback) => {
        ipcRenderer.on('request-coherence', () => callback());
    },

    // Platform info
    platform: process.platform,
    
    // App version
    version: '0.1.0'
});

// Override console methods to also log to main process in production
if (process.env.NODE_ENV === 'production') {
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
        originalLog(...args);
        ipcRenderer.send('console-log', args);
    };
    
    console.error = (...args) => {
        originalError(...args);
        ipcRenderer.send('console-error', args);
    };
}