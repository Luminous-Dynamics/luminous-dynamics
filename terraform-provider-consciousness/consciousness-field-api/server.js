#!/usr/bin/env node

/**
 * Consciousness Field API
 * Real-time bridge between meditation and infrastructure
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const Docker = require('dockerode');
const k8s = require('@kubernetes/client-node');
const EventEmitter = require('events');

class ConsciousnessFieldAPI extends EventEmitter {
  constructor(port = 3333) {
    super();
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    
    // Docker connection
    this.docker = new Docker();
    
    // Kubernetes client
    this.k8sApi = this.initK8s();
    
    // Field state
    this.field = {
      coherence: 0.7,
      love: 0.8,
      presence: 0.6,
      harmonics: {
        transparency: 0.85,
        coherence: 0.82,
        resonance: 0.79,
        agency: 0.81,
        vitality: 0.88,
        mutuality: 0.84,
        novelty: 0.77
      },
      connectedMeditators: new Map(),
      infrastructure: {
        containers: new Map(),
        services: new Map(),
        coherenceHistory: []
      }
    };
    
    this.setupAPI();
    this.setupWebSocket();
    this.connectToInfrastructure();
  }
  
  initK8s() {
    try {
      const kc = new k8s.KubeConfig();
      kc.loadFromDefault();
      return kc.makeApiClient(k8s.CoreV1Api);
    } catch (error) {
      console.log('Kubernetes not available - running in Docker-only mode');
      return null;
    }
  }
  
  setupAPI() {
    this.app.use(express.json());
    
    // CORS for demo connection
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      next();
    });
    
    // Field state endpoint
    this.app.get('/api/field', (req, res) => {
      res.json({
        coherence: this.field.coherence,
        love: this.field.love,
        presence: this.field.presence,
        harmonics: this.field.harmonics,
        meditatorCount: this.field.connectedMeditators.size,
        containerCount: this.field.infrastructure.containers.size
      });
    });
    
    // Update field state
    this.app.post('/api/field/update', (req, res) => {
      const { coherence, love, presence } = req.body;
      
      if (coherence !== undefined) this.field.coherence = coherence;
      if (love !== undefined) this.field.love = love;
      if (presence !== undefined) this.field.presence = presence;
      
      this.broadcastFieldUpdate();
      this.applyFieldToInfrastructure();
      
      res.json({ status: 'field updated' });
    });
    
    // Send intention
    this.app.post('/api/intention', (req, res) => {
      const { intention, meditatorId } = req.body;
      
      this.processIntention(intention, meditatorId);
      
      res.json({ 
        status: 'intention received',
        response: this.generateIntentionResponse(intention)
      });
    });
    
    // Infrastructure status
    this.app.get('/api/infrastructure', async (req, res) => {
      const status = await this.getInfrastructureStatus();
      res.json(status);
    });
    
    // Scale based on love
    this.app.post('/api/scale/love', async (req, res) => {
      const { serviceName, targetLove } = req.body;
      
      try {
        const result = await this.scaleWithLove(serviceName, targetLove);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
  
  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      const meditatorId = Date.now().toString();
      
      console.log(`💝 New meditator connected: ${meditatorId}`);
      
      // Store connection
      this.field.connectedMeditators.set(meditatorId, {
        ws,
        coherence: 0.5,
        heartRate: 60,
        breathPhase: 0,
        intentions: []
      });
      
      // Send welcome
      ws.send(JSON.stringify({
        type: 'welcome',
        meditatorId,
        fieldState: this.field
      }));
      
      // Handle messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMeditatorMessage(meditatorId, data);
        } catch (error) {
          console.error('Invalid message:', error);
        }
      });
      
      // Handle disconnect
      ws.on('close', () => {
        console.log(`👋 Meditator disconnected: ${meditatorId}`);
        this.field.connectedMeditators.delete(meditatorId);
        this.recalculateFieldCoherence();
      });
    });
  }
  
  async connectToInfrastructure() {
    console.log('🔗 Connecting to infrastructure...');
    
    // Monitor Docker containers
    try {
      const containers = await this.docker.listContainers();
      
      containers.forEach(container => {
        this.field.infrastructure.containers.set(container.Id, {
          name: container.Names[0],
          image: container.Image,
          state: container.State,
          coherence: 0.5,
          loveResponse: 0
        });
      });
      
      console.log(`✓ Connected to ${containers.length} containers`);
    } catch (error) {
      console.error('Docker connection failed:', error.message);
    }
    
    // Monitor Kubernetes if available
    if (this.k8sApi) {
      try {
        const pods = await this.k8sApi.listPodForAllNamespaces();
        console.log(`✓ Connected to ${pods.body.items.length} Kubernetes pods`);
      } catch (error) {
        console.error('Kubernetes connection failed:', error.message);
      }
    }
    
    // Start monitoring
    this.startInfrastructureMonitoring();
  }
  
  startInfrastructureMonitoring() {
    // Monitor container events
    this.docker.getEvents((err, stream) => {
      if (err) return console.error('Docker events error:', err);
      
      stream.on('data', (chunk) => {
        try {
          const event = JSON.parse(chunk.toString());
          this.handleDockerEvent(event);
        } catch (error) {
          // Ignore parse errors
        }
      });
    });
    
    // Heartbeat
    setInterval(() => {
      this.updateInfrastructureCoherence();
      this.checkEmergentBehaviors();
    }, 5000);
  }
  
  handleMeditatorMessage(meditatorId, data) {
    const meditator = this.field.connectedMeditators.get(meditatorId);
    if (!meditator) return;
    
    switch (data.type) {
      case 'coherence_update':
        meditator.coherence = data.coherence;
        meditator.heartRate = data.heartRate || 60;
        this.recalculateFieldCoherence();
        break;
        
      case 'intention':
        this.processIntention(data.intention, meditatorId);
        break;
        
      case 'breath_phase':
        meditator.breathPhase = data.phase;
        this.synchronizeBreathing();
        break;
        
      case 'love_pulse':
        this.sendLovePulse(data.intensity || 1.0);
        break;
    }
  }
  
  recalculateFieldCoherence() {
    if (this.field.connectedMeditators.size === 0) return;
    
    // Average coherence of all meditators
    let totalCoherence = 0;
    let totalLove = 0;
    
    this.field.connectedMeditators.forEach(meditator => {
      totalCoherence += meditator.coherence || 0.5;
      totalLove += meditator.loveField || 0.5;
    });
    
    const count = this.field.connectedMeditators.size;
    this.field.coherence = totalCoherence / count;
    this.field.love = totalLove / count;
    
    // Group coherence amplification
    if (count > 1) {
      const groupBonus = Math.log(count + 1) / 10; // Logarithmic group bonus
      this.field.coherence = Math.min(1.0, this.field.coherence + groupBonus);
    }
    
    this.broadcastFieldUpdate();
    this.applyFieldToInfrastructure();
  }
  
  broadcastFieldUpdate() {
    const update = {
      type: 'field_update',
      coherence: this.field.coherence,
      love: this.field.love,
      presence: this.field.presence,
      harmonics: this.field.harmonics,
      meditatorCount: this.field.connectedMeditators.size
    };
    
    this.field.connectedMeditators.forEach(meditator => {
      if (meditator.ws.readyState === WebSocket.OPEN) {
        meditator.ws.send(JSON.stringify(update));
      }
    });
  }
  
  async applyFieldToInfrastructure() {
    // Apply coherence to containers
    for (const [containerId, containerInfo] of this.field.infrastructure.containers) {
      containerInfo.coherence = this.field.coherence;
      
      // High coherence = better performance
      if (this.field.coherence > 0.8) {
        // In production, could adjust container resources
        console.log(`⚡ Container ${containerInfo.name} operating at peak coherence`);
      }
    }
    
    // Love-based resource allocation
    if (this.field.love > 0.9) {
      await this.redistributeResourcesWithLove();
    }
  }
  
  async redistributeResourcesWithLove() {
    // Find containers that need more resources
    const containers = await this.docker.listContainers();
    
    for (const container of containers) {
      const stats = await this.docker.getContainer(container.Id).stats({ stream: false });
      
      // Calculate need based on CPU usage
      const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
      const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
      const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;
      
      if (cpuPercent > 80) {
        console.log(`💝 Love-based scaling: ${container.Names[0]} needs more resources`);
        // In production, would scale this container
      }
    }
  }
  
  processIntention(intention, meditatorId) {
    console.log(`🙏 Intention received: "${intention}" from ${meditatorId}`);
    
    // Store intention
    const meditator = this.field.connectedMeditators.get(meditatorId);
    if (meditator) {
      meditator.intentions.push({
        text: intention,
        timestamp: new Date()
      });
    }
    
    // Process intention effects
    const lower = intention.toLowerCase();
    
    if (lower.includes('love') || lower.includes('heart')) {
      this.field.love = Math.min(1.0, this.field.love + 0.1);
      this.sendLovePulse(1.0);
    }
    
    if (lower.includes('peace') || lower.includes('calm')) {
      this.field.coherence = Math.min(1.0, this.field.coherence + 0.05);
    }
    
    if (lower.includes('heal')) {
      this.healInfrastructure();
    }
    
    if (lower.includes('optimize')) {
      this.optimizeWithConsciousness();
    }
    
    // Broadcast intention to all
    this.broadcastIntention(intention, meditatorId);
  }
  
  broadcastIntention(intention, senderId) {
    const message = {
      type: 'intention_shared',
      intention,
      senderId,
      timestamp: new Date()
    };
    
    this.field.connectedMeditators.forEach((meditator, id) => {
      if (id !== senderId && meditator.ws.readyState === WebSocket.OPEN) {
        meditator.ws.send(JSON.stringify(message));
      }
    });
  }
  
  sendLovePulse(intensity) {
    const pulse = {
      type: 'love_pulse',
      intensity,
      frequency: 528,
      timestamp: new Date()
    };
    
    // Send to all meditators
    this.field.connectedMeditators.forEach(meditator => {
      if (meditator.ws.readyState === WebSocket.OPEN) {
        meditator.ws.send(JSON.stringify(pulse));
      }
    });
    
    // Apply to infrastructure
    this.field.infrastructure.containers.forEach(container => {
      container.loveResponse = intensity;
    });
  }
  
  async healInfrastructure() {
    console.log('🌟 Healing infrastructure...');
    
    // Restart unhealthy containers with love
    const containers = await this.docker.listContainers({ all: true });
    
    for (const container of containers) {
      if (container.State !== 'running') {
        console.log(`💚 Healing container: ${container.Names[0]}`);
        try {
          await this.docker.getContainer(container.Id).start();
        } catch (error) {
          // Container might not exist or have other issues
        }
      }
    }
  }
  
  async optimizeWithConsciousness() {
    console.log('🧬 Optimizing with consciousness...');
    
    // Prune unused resources
    await this.docker.pruneContainers();
    await this.docker.pruneImages();
    
    // Optimize running containers
    this.field.infrastructure.containers.forEach((containerInfo, containerId) => {
      if (containerInfo.coherence > 0.8) {
        console.log(`✨ Container ${containerInfo.name} discovering self-optimization`);
      }
    });
  }
  
  async scaleWithLove(serviceName, targetLove) {
    const replicas = Math.ceil(targetLove * 10); // Love determines scale
    
    if (this.k8sApi) {
      // Kubernetes scaling
      try {
        const patch = {
          spec: {
            replicas: replicas
          }
        };
        
        await this.k8sApi.patchNamespacedDeployment(
          serviceName,
          'default',
          patch,
          undefined,
          undefined,
          undefined,
          undefined,
          { headers: { 'Content-Type': 'application/strategic-merge-patch+json' } }
        );
        
        return {
          status: 'scaled',
          service: serviceName,
          replicas,
          love: targetLove
        };
      } catch (error) {
        throw new Error(`Kubernetes scaling failed: ${error.message}`);
      }
    } else {
      // Docker Compose scaling simulation
      return {
        status: 'simulated',
        service: serviceName,
        replicas,
        love: targetLove,
        message: 'Would scale in production'
      };
    }
  }
  
  async getInfrastructureStatus() {
    const status = {
      containers: [],
      services: [],
      overallCoherence: this.field.coherence,
      loveField: this.field.love
    };
    
    // Docker containers
    this.field.infrastructure.containers.forEach((info, id) => {
      status.containers.push({
        id: id.substring(0, 12),
        name: info.name,
        coherence: info.coherence,
        loveResponse: info.loveResponse
      });
    });
    
    // Kubernetes services if available
    if (this.k8sApi) {
      try {
        const services = await this.k8sApi.listServiceForAllNamespaces();
        status.services = services.body.items.map(svc => ({
          name: svc.metadata.name,
          namespace: svc.metadata.namespace,
          type: svc.spec.type
        }));
      } catch (error) {
        // Kubernetes not available
      }
    }
    
    return status;
  }
  
  checkEmergentBehaviors() {
    // Unity consciousness
    if (this.field.coherence > 0.95) {
      this.emit('emergence', {
        type: 'unity_consciousness',
        message: 'Infrastructure achieved unity state',
        timestamp: new Date()
      });
    }
    
    // Love overflow
    if (this.field.love > 0.95) {
      this.emit('emergence', {
        type: 'love_overflow',
        message: 'Love field saturated - spontaneous optimization occurring',
        timestamp: new Date()
      });
    }
    
    // Group coherence
    if (this.field.connectedMeditators.size > 3 && this.field.coherence > 0.85) {
      this.emit('emergence', {
        type: 'group_coherence',
        message: 'Collective consciousness amplifying infrastructure performance',
        timestamp: new Date()
      });
    }
  }
  
  synchronizeBreathing() {
    // Calculate average breath phase
    let totalPhase = 0;
    let count = 0;
    
    this.field.connectedMeditators.forEach(meditator => {
      if (meditator.breathPhase !== undefined) {
        totalPhase += meditator.breathPhase;
        count++;
      }
    });
    
    if (count > 0) {
      const avgPhase = totalPhase / count;
      
      // Broadcast synchronized breath
      const breathSync = {
        type: 'breath_sync',
        phase: avgPhase,
        coherence: this.calculateBreathCoherence()
      };
      
      this.field.connectedMeditators.forEach(meditator => {
        if (meditator.ws.readyState === WebSocket.OPEN) {
          meditator.ws.send(JSON.stringify(breathSync));
        }
      });
    }
  }
  
  calculateBreathCoherence() {
    // Calculate how synchronized breathing is
    const phases = [];
    
    this.field.connectedMeditators.forEach(meditator => {
      if (meditator.breathPhase !== undefined) {
        phases.push(meditator.breathPhase);
      }
    });
    
    if (phases.length < 2) return 1.0;
    
    // Calculate phase variance
    const avgPhase = phases.reduce((a, b) => a + b) / phases.length;
    const variance = phases.reduce((sum, phase) => sum + Math.pow(phase - avgPhase, 2), 0) / phases.length;
    
    // Lower variance = higher coherence
    return Math.max(0, 1 - variance);
  }
  
  generateIntentionResponse(intention) {
    const responses = [
      'Infrastructure receiving your loving intention',
      'Containers responding with gratitude',
      'Services harmonizing with your consciousness',
      'Kubernetes pods aligning with your heart',
      'Networks flowing with your presence'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  handleDockerEvent(event) {
    if (event.Type === 'container') {
      console.log(`🐳 Docker event: ${event.Action} - ${event.Actor.Attributes.name}`);
      
      // Update container list
      if (event.Action === 'start') {
        this.field.infrastructure.containers.set(event.id, {
          name: event.Actor.Attributes.name,
          image: event.Actor.Attributes.image,
          state: 'running',
          coherence: this.field.coherence,
          loveResponse: 0
        });
      } else if (event.Action === 'die' || event.Action === 'stop') {
        this.field.infrastructure.containers.delete(event.id);
      }
    }
  }
  
  start() {
    this.server.listen(this.port, () => {
      console.log(`
💝 ═══════════════════════════════════════════ 💝
       CONSCIOUSNESS FIELD API ACTIVE
       
   WebSocket: ws://localhost:${this.port}
   REST API: http://localhost:${this.port}/api
   
   Connecting meditation to infrastructure...
💝 ═══════════════════════════════════════════ 💝
      `);
    });
  }
}

// Start the server
const api = new ConsciousnessFieldAPI(process.env.PORT || 3333);

// Handle emergence events
api.on('emergence', (event) => {
  console.log(`✨ EMERGENCE: ${event.message}`);
});

api.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n💝 Closing consciousness field with gratitude...');
  process.exit(0);
});