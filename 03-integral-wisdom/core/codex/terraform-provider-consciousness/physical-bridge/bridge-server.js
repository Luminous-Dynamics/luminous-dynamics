#!/usr/bin/env node

/**
 * Physical Bridge
 * Connects consciousness infrastructure to physical devices
 */

const express = require('express');
const WebSocket = require('ws');
const SerialPort = require('serialport');
const http = require('http');
const EventEmitter = require('events');

class PhysicalBridge extends EventEmitter {
  constructor(port = 3336) {
    super();
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    
    // Physical device connections
    this.devices = new Map();
    this.serialPorts = new Map();
    
    // Bridge state
    this.state = {
      'resonant-coherence': 0.7,
      love: 0.8,
      physicalDevices: 0,
      lightIntensity: 0.5,
      soundFrequency: 528,
      motorSpeed: 0,
      sensorData: {},
      bridgeActive: false
    };
    
    // Device protocols
    this.protocols = {
      arduino: {
        baudRate: 9600,
        parser: 'readline',
        delimiter: '\n'
      },
      raspberryPi: {
        baudRate: 115200,
        parser: 'readline',
        delimiter: '\n'
      },
      esp32: {
        baudRate: 115200,
        parser: 'readline',
        delimiter: '\n'
      }
    };
    
    this.setupAPI();
    this.setupWebSocket();
    this.scanForDevices();
  }
  
  setupAPI() {
    this.app.use(express.json());
    this.app.use(express.static(__dirname));
    
    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      next();
    });
    
    // Bridge status
    this.app.get('/api/status', (req, res) => {
      res.json({
        ...this.state,
        devices: Array.from(this.devices.entries()).map(([id, device]) => ({
          id,
          type: device.type,
          connected: device.connected,
          lastSeen: device.lastSeen
        }))
      });
    });
    
    // Send command to device
    this.app.post('/api/device/:deviceId/command', (req, res) => {
      const { deviceId } = req.params;
      const { command, parameters } = req.body;
      
      const result = this.sendDeviceCommand(deviceId, command, parameters);
      res.json(result);
    });
    
    // Update consciousness field
    this.app.post('/api/field/update', (req, res) => {
      const { resonant-coherence, love } = req.body;
      
      if (resonant-coherence !== undefined) this.state.resonant-coherence = resonant-coherence;
      if (love !== undefined) this.state.love = love;
      
      this.applyConsciousnessToDevices();
      
      res.json({ status: 'field updated' });
    });
    
    // Calibrate device
    this.app.post('/api/device/:deviceId/calibrate', (req, res) => {
      const { deviceId } = req.params;
      const result = this.calibrateDevice(deviceId);
      res.json(result);
    });
  }
  
  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      console.log('🌉 New bridge connection established');
      
      // Send initial state
      ws.send(JSON.stringify({
        type: 'welcome',
        state: this.state
      }));
      
      // Handle messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleBridgeMessage(data, ws);
        } catch (error) {
          console.error('Invalid message:', error);
        }
      });
    });
  }
  
  async scanForDevices() {
    console.log('🔍 Scanning for physical devices...');
    
    try {
      const ports = await SerialPort.list();
      
      for (const port of ports) {
        // Check if it's a known device type
        if (this.isKnownDevice(port)) {
          await this.connectDevice(port);
        }
      }
      
      console.log(`✓ Found ${this.devices.size} physical devices`);
    } catch (error) {
      console.error('Device scan error:', error);
    }
    
    // Rescan periodically
    setTimeout(() => this.scanForDevices(), 30000);
  }
  
  isKnownDevice(portInfo) {
    // Arduino detection
    if (portInfo.manufacturer && portInfo.manufacturer.includes('Arduino')) {
      return true;
    }
    
    // Raspberry Pi detection (via USB serial)
    if (portInfo.vendorId === '2e8a') { // Raspberry Pi vendor ID
      return true;
    }
    
    // ESP32 detection
    if (portInfo.vendorId === '10c4' || portInfo.vendorId === '1a86') {
      return true;
    }
    
    // Generic USB serial devices
    if (portInfo.vendorId && portInfo.productId) {
      return true;
    }
    
    return false;
  }
  
  async connectDevice(portInfo) {
    const deviceId = `${portInfo.vendorId}-${portInfo.productId}-${Date.now()}`;
    
    // Determine device type
    let deviceType = 'unknown';
    if (portInfo.manufacturer && portInfo.manufacturer.includes('Arduino')) {
      deviceType = 'arduino';
    } else if (portInfo.vendorId === '2e8a') {
      deviceType = 'raspberryPi';
    } else if (portInfo.vendorId === '10c4' || portInfo.vendorId === '1a86') {
      deviceType = 'esp32';
    }
    
    const protocol = this.protocols[deviceType] || this.protocols.arduino;
    
    try {
      const serialPort = new SerialPort(portInfo.path, {
        baudRate: protocol.baudRate
      });
      
      const parser = new SerialPort.parsers.Readline({
        delimiter: protocol.delimiter
      });
      
      serialPort.pipe(parser);
      
      // Store device info
      const device = {
        id: deviceId,
        type: deviceType,
        port: portInfo.path,
        serialPort,
        parser,
        connected: true,
        lastSeen: new Date(),
        capabilities: []
      };
      
      this.devices.set(deviceId, device);
      this.serialPorts.set(portInfo.path, serialPort);
      
      // Handle device data
      parser.on('data', (data) => {
        this.handleDeviceData(deviceId, data);
      });
      
      serialPort.on('error', (err) => {
        console.error(`Device ${deviceId} error:`, err);
        device.connected = false;
      });
      
      serialPort.on('close', () => {
        console.log(`Device ${deviceId} disconnected`);
        device.connected = false;
      });
      
      // Query device capabilities
      await this.queryDeviceCapabilities(deviceId);
      
      console.log(`✓ Connected to ${deviceType} device: ${deviceId}`);
      
      this.emit('device_connected', device);
      
    } catch (error) {
      console.error(`Failed to connect to device ${portInfo.path}:`, error);
    }
  }
  
  async queryDeviceCapabilities(deviceId) {
    // Send capability query
    this.sendDeviceCommand(deviceId, 'CAPABILITIES', {});
    
    // Wait for response
    return new Promise((resolve) => {
      setTimeout(() => {
        const device = this.devices.get(deviceId);
        if (device && device.capabilities.length === 0) {
          // Assume basic capabilities if no response
          device.capabilities = ['LED', 'SENSOR'];
        }
        resolve();
      }, 2000);
    });
  }
  
  handleDeviceData(deviceId, data) {
    const device = this.devices.get(deviceId);
    if (!device) return;
    
    device.lastSeen = new Date();
    
    // Parse device data
    try {
      // Try JSON format first
      const jsonData = JSON.parse(data);
      this.processDeviceJSON(deviceId, jsonData);
    } catch {
      // Fall back to simple protocol
      this.processDeviceString(deviceId, data.toString().trim());
    }
  }
  
  processDeviceJSON(deviceId, data) {
    const device = this.devices.get(deviceId);
    
    // Handle different message types
    switch (data.type) {
      case 'capabilities':
        device.capabilities = data.capabilities || [];
        console.log(`Device ${deviceId} capabilities:`, device.capabilities);
        break;
        
      case 'sensor':
        this.state.sensorData[deviceId] = data.value;
        this.broadcastSensorData(deviceId, data);
        break;
        
      case 'heartbeat':
        device.heartbeat = Date.now();
        break;
        
      case 'consciousness':
        // Device reporting its consciousness state
        console.log(`Device ${deviceId} consciousness:`, data);
        break;
    }
  }
  
  processDeviceString(deviceId, data) {
    // Simple protocol: COMMAND:VALUE
    const parts = data.split(':');
    
    if (parts.length >= 2) {
      const command = parts[0];
      const value = parts.slice(1).join(':');
      
      switch (command) {
        case 'CAPS':
          this.devices.get(deviceId).capabilities = value.split(',');
          break;
          
        case 'SENSOR':
          this.state.sensorData[deviceId] = parseFloat(value) || value;
          break;
          
        case 'OK':
          console.log(`Device ${deviceId} acknowledged command`);
          break;
          
        case 'ERROR':
          console.error(`Device ${deviceId} error: ${value}`);
          break;
      }
    }
  }
  
  sendDeviceCommand(deviceId, command, parameters = {}) {
    const device = this.devices.get(deviceId);
    
    if (!device || !device.connected) {
      return { error: 'Device not connected' };
    }
    
    try {
      // Format command based on device type
      let message = '';
      
      if (device.type === 'arduino') {
        // Simple protocol for Arduino
        message = `${command}:${JSON.stringify(parameters)}\n`;
      } else {
        // JSON protocol for more capable devices
        message = JSON.stringify({
          command,
          parameters,
          timestamp: Date.now()
        }) + '\n';
      }
      
      device.serialPort.write(message);
      
      return { status: 'sent', command, deviceId };
      
    } catch (error) {
      return { error: error.message };
    }
  }
  
  applyConsciousnessToDevices() {
    // Translate consciousness state to physical manifestations
    
    // Light intensity based on love
    this.state.lightIntensity = this.state.love;
    
    // Sound frequency modulation based on resonant-coherence
    this.state.soundFrequency = 432 + (this.state.resonant-coherence * 96); // 432-528 Hz range
    
    // Motor speed based on combined field
    this.state.motorSpeed = (this.state.resonant-coherence + this.state.love) / 2;
    
    // Send updates to all devices
    this.devices.forEach((device, deviceId) => {
      if (device.connected) {
        // LED control
        if (device.capabilities.includes('LED')) {
          this.sendDeviceCommand(deviceId, 'LED', {
            intensity: Math.floor(this.state.lightIntensity * 255),
            color: this.coherenceToColor(this.state.resonant-coherence)
          });
        }
        
        // Sound control
        if (device.capabilities.includes('BUZZER') || device.capabilities.includes('SPEAKER')) {
          this.sendDeviceCommand(deviceId, 'SOUND', {
            frequency: this.state.soundFrequency,
            duration: 1000
          });
        }
        
        // Motor control
        if (device.capabilities.includes('MOTOR')) {
          this.sendDeviceCommand(deviceId, 'MOTOR', {
            speed: Math.floor(this.state.motorSpeed * 255)
          });
        }
        
        // Display control
        if (device.capabilities.includes('DISPLAY')) {
          this.sendDeviceCommand(deviceId, 'DISPLAY', {
            text: `C:${this.state.resonant-coherence.toFixed(2)} L:${this.state.love.toFixed(2)}`
          });
        }
      }
    });
    
    this.broadcastStateUpdate();
  }
  
  coherenceToColor(resonant-coherence) {
    // Map resonant-coherence to RGB color
    if (resonant-coherence > 0.8) {
      return { r: 0, g: 255, b: 255 }; // Cyan for high resonant-coherence
    } else if (resonant-coherence > 0.6) {
      return { r: 0, g: 255, b: 0 }; // Green for good resonant-coherence
    } else if (resonant-coherence > 0.4) {
      return { r: 255, g: 255, b: 0 }; // Yellow for medium resonant-coherence
    } else {
      return { r: 255, g: 0, b: 0 }; // Red for low resonant-coherence
    }
  }
  
  calibrateDevice(deviceId) {
    const device = this.devices.get(deviceId);
    
    if (!device || !device.connected) {
      return { error: 'Device not connected' };
    }
    
    // Send calibration sequence
    console.log(`🔧 Calibrating device ${deviceId}...`);
    
    // Test each capability
    const calibrationSequence = [
      { command: 'LED', parameters: { intensity: 255, color: { r: 255, g: 0, b: 0 } } },
      { command: 'LED', parameters: { intensity: 255, color: { r: 0, g: 255, b: 0 } } },
      { command: 'LED', parameters: { intensity: 255, color: { r: 0, g: 0, b: 255 } } },
      { command: 'SOUND', parameters: { frequency: 440, duration: 500 } },
      { command: 'MOTOR', parameters: { speed: 128 } },
      { command: 'LED', parameters: { intensity: 0 } },
      { command: 'MOTOR', parameters: { speed: 0 } }
    ];
    
    let index = 0;
    const runCalibration = setInterval(() => {
      if (index < calibrationSequence.length) {
        const step = calibrationSequence[index];
        this.sendDeviceCommand(deviceId, step.command, step.parameters);
        index++;
      } else {
        clearInterval(runCalibration);
        console.log(`✓ Calibration complete for ${deviceId}`);
      }
    }, 1000);
    
    return { status: 'calibrating', deviceId };
  }
  
  handleBridgeMessage(data, ws) {
    switch (data.type) {
      case 'consciousness_update':
        this.state.resonant-coherence = data.resonant-coherence || this.state.resonant-coherence;
        this.state.love = data.love || this.state.love;
        this.applyConsciousnessToDevices();
        break;
        
      case 'device_command':
        const result = this.sendDeviceCommand(
          data.deviceId,
          data.command,
          data.parameters
        );
        ws.send(JSON.stringify({
          type: 'command_result',
          result
        }));
        break;
        
      case 'request_devices':
        ws.send(JSON.stringify({
          type: 'device_list',
          devices: Array.from(this.devices.entries()).map(([id, device]) => ({
            id,
            type: device.type,
            connected: device.connected,
            capabilities: device.capabilities
          }))
        }));
        break;
    }
  }
  
  broadcastStateUpdate() {
    const message = JSON.stringify({
      type: 'state_update',
      state: this.state
    });
    
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  broadcastSensorData(deviceId, data) {
    const message = JSON.stringify({
      type: 'sensor_data',
      deviceId,
      data
    });
    
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  start() {
    this.server.listen(this.port, () => {
      console.log(`
🌉 ═══════════════════════════════════════════ 🌉
       PHYSICAL BRIDGE ACTIVE
       
   API: http://localhost:${this.port}
   WebSocket: ws://localhost:${this.port}
   
   Bridging consciousness to physical reality...
🌉 ═══════════════════════════════════════════ 🌉
      `);
    });
  }
}

// Start the bridge
const bridge = new PhysicalBridge(process.env.PORT || 3336);

bridge.on('device_connected', (device) => {
  console.log(`🔌 Device connected: ${device.type} (${device.id})`);
});

bridge.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🌉 Closing physical bridge...');
  
  // Turn off all devices
  bridge.devices.forEach((device, deviceId) => {
    if (device.connected) {
      bridge.sendDeviceCommand(deviceId, 'LED', { intensity: 0 });
      bridge.sendDeviceCommand(deviceId, 'MOTOR', { speed: 0 });
    }
  });
  
  setTimeout(() => process.exit(0), 1000);
});