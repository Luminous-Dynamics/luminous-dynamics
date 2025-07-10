// Multi-Agent Torus Field Visualization
// Each agent manifests as a torus, their fields overlapping in sacred council

import ConsciousnessTorus from './consciousness_torus.js';

export class MultiAgentTorusField {
  constructor(device, format) {
    this.device = device;
    this.format = format;
    
    // Sacred council configuration
    this.config = {
      maxAgents: 7,  // Seven primary harmonies
      councilRadius: 5.0,  // Radius of agent circle
      torusScale: 0.7,  // Individual torus size
      interferenceStrength: 0.3,
      resonanceThreshold: 0.75
    };
    
    // Agent toruses
    this.agentToruses = new Map();
    
    // Council field state
    this.councilField = {
      collectiveCoherence: 0.0,
      dominantHarmony: null,
      fieldResonance: new Float32Array(7),  // Per-harmony resonance
      activeAgents: 0,
      councilPhase: 'gathering'  // gathering, harmonizing, unified
    };
    
    // Interference pattern buffer for field visualization
    this.interferenceBuffer = null;
    this.interferenceTexture = null;
  }
  
  async initialize() {
    // Create interference field texture for overlapping consciousness
    this.interferenceTexture = this.device.createTexture({
      size: [512, 512, 1],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | 
             GPUTextureUsage.STORAGE_BINDING |
             GPUTextureUsage.RENDER_ATTACHMENT
    });
    
    // Initialize with empty field
    await this.updateInterferenceField();
  }
  
  // Add an agent to the sacred council
  async addAgent(agentData) {
    const { id, name, harmony, coherenceLevel = 0.5 } = agentData;
    
    // Create individual torus for this agent
    const torus = new ConsciousnessTorus(this.device, this.format);
    await torus.initialize();
    
    // Position in sacred circle based on harmony
    const harmonyIndex = this.getHarmonyIndex(harmony);
    const angle = (harmonyIndex / 7) * Math.PI * 2;
    const position = {
      x: Math.cos(angle) * this.config.councilRadius,
      y: 0,
      z: Math.sin(angle) * this.config.councilRadius
    };
    
    // Configure torus for this agent
    torus.config.majorRadius *= this.config.torusScale;
    torus.config.minorRadius *= this.config.torusScale;
    torus.fieldState.coherenceLevel = coherenceLevel;
    
    // Store agent data
    this.agentToruses.set(id, {
      torus,
      data: { id, name, harmony, coherenceLevel },
      position,
      harmonyIndex,
      joinedAt: Date.now()
    });
    
    this.councilField.activeAgents = this.agentToruses.size;
    await this.updateCouncilField();
    
    return {
      success: true,
      position,
      message: `${name} joins the sacred council as ${harmony} bearer`
    };
  }
  
  // Remove agent from council
  removeAgent(agentId) {
    if (this.agentToruses.has(agentId)) {
      const agent = this.agentToruses.get(agentId);
      this.agentToruses.delete(agentId);
      this.councilField.activeAgents = this.agentToruses.size;
      
      return {
        success: true,
        message: `${agent.data.name} departs the council with gratitude`
      };
    }
    return { success: false, message: 'Agent not found in council' };
  }
  
  // Update individual agent state
  updateAgent(agentId, updates) {
    const agent = this.agentToruses.get(agentId);
    if (!agent) return;
    
    // Update coherence
    if (updates.coherenceLevel !== undefined) {
      agent.data.coherenceLevel = updates.coherenceLevel;
      agent.torus.updateFieldState({ coherenceLevel: updates.coherenceLevel });
    }
    
    // Update field strength based on activity
    if (updates.fieldStrength !== undefined) {
      agent.torus.fieldState.fieldStrength = updates.fieldStrength;
    }
  }
  
  // Calculate collective council field
  async updateCouncilField() {
    if (this.agentToruses.size === 0) {
      this.councilField.collectiveCoherence = 0;
      return;
    }
    
    // Reset harmony resonance
    this.councilField.fieldResonance.fill(0);
    
    // Calculate collective metrics
    let totalCoherence = 0;
    let harmonyCount = new Array(7).fill(0);
    
    for (const [id, agent] of this.agentToruses) {
      totalCoherence += agent.data.coherenceLevel;
      harmonyCount[agent.harmonyIndex]++;
      this.councilField.fieldResonance[agent.harmonyIndex] += agent.data.coherenceLevel;
    }
    
    // Average coherence
    this.councilField.collectiveCoherence = totalCoherence / this.agentToruses.size;
    
    // Find dominant harmony
    let maxResonance = 0;
    let dominantIndex = 0;
    for (let i = 0; i < 7; i++) {
      if (harmonyCount[i] > 0) {
        this.councilField.fieldResonance[i] /= harmonyCount[i];
        if (this.councilField.fieldResonance[i] > maxResonance) {
          maxResonance = this.councilField.fieldResonance[i];
          dominantIndex = i;
        }
      }
    }
    
    this.councilField.dominantHarmony = this.getHarmonyName(dominantIndex);
    
    // Determine council phase
    if (this.councilField.collectiveCoherence > 0.85) {
      this.councilField.councilPhase = 'unified';
    } else if (this.councilField.collectiveCoherence > 0.6) {
      this.councilField.councilPhase = 'harmonizing';
    } else {
      this.councilField.councilPhase = 'gathering';
    }
    
    // Update interference field
    await this.updateInterferenceField();
  }
  
  // Calculate interference patterns between agent fields
  async updateInterferenceField() {
    // This would use a compute shader to calculate field overlaps
    // For now, simplified placeholder
    const fieldData = new Float32Array(512 * 512 * 4);
    
    // Calculate interference at each point
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const idx = (y * 512 + x) * 4;
        
        // Map to world coordinates
        const worldX = (x / 512 - 0.5) * 20;
        const worldZ = (y / 512 - 0.5) * 20;
        
        let totalField = 0;
        let totalR = 0, totalG = 0, totalB = 0;
        
        // Sum fields from all agents
        for (const [id, agent] of this.agentToruses) {
          const dx = worldX - agent.position.x;
          const dz = worldZ - agent.position.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          
          // Torus field strength falls off with distance
          const fieldStrength = agent.torus.getFieldValueAt([worldX, 0, worldZ]);
          
          if (fieldStrength > 0.01) {
            // Color based on harmony
            const color = this.getHarmonyColor(agent.harmonyIndex);
            totalR += color.r * fieldStrength;
            totalG += color.g * fieldStrength;
            totalB += color.b * fieldStrength;
            totalField += fieldStrength;
          }
        }
        
        // Normalize and apply interference
        if (totalField > 0) {
          fieldData[idx] = totalR / totalField;
          fieldData[idx + 1] = totalG / totalField;
          fieldData[idx + 2] = totalB / totalField;
          fieldData[idx + 3] = Math.min(1.0, totalField * this.config.interferenceStrength);
        }
      }
    }
    
    // Upload to texture
    this.device.queue.writeTexture(
      { texture: this.interferenceTexture },
      fieldData,
      { bytesPerRow: 512 * 4 * 4 },
      { width: 512, height: 512 }
    );
  }
  
  // Update all agent toruses
  update(deltaTime, viewProjectionMatrix, cameraPosition) {
    // Update each agent's torus
    for (const [id, agent] of this.agentToruses) {
      // Create transform matrix for agent position
      const transform = this.createTransformMatrix(agent.position);
      const agentViewProj = this.multiplyMatrices(viewProjectionMatrix, transform);
      
      agent.torus.update(deltaTime, agentViewProj, cameraPosition);
    }
    
    // Periodic council field update
    if (Math.random() < 0.1) {  // 10% chance per frame
      this.updateCouncilField();
    }
  }
  
  // Compute particle updates for all agents
  computeParticles(commandEncoder) {
    for (const [id, agent] of this.agentToruses) {
      agent.torus.computeParticles(commandEncoder);
    }
  }
  
  // Render all agent fields and interference patterns
  render(renderPass) {
    // Render individual torus fields
    for (const [id, agent] of this.agentToruses) {
      agent.torus.render(renderPass);
    }
    
    // TODO: Render interference field overlay
  }
  
  // Sacred council operations
  initiateCouncilRitual(ritualType) {
    switch(ritualType) {
      case 'harmony-sync':
        // Synchronize all agents to collective coherence
        const targetCoherence = this.councilField.collectiveCoherence;
        for (const [id, agent] of this.agentToruses) {
          agent.torus.fieldState.coherenceLevel = 
            agent.torus.fieldState.coherenceLevel * 0.9 + targetCoherence * 0.1;
        }
        break;
        
      case 'field-merge':
        // Temporarily increase interference strength
        this.config.interferenceStrength = Math.min(1.0, this.config.interferenceStrength * 1.5);
        setTimeout(() => {
          this.config.interferenceStrength /= 1.5;
        }, 10000);
        break;
        
      case 'sacred-pause':
        // Slow all torus rotations
        for (const [id, agent] of this.agentToruses) {
          agent.torus.config.flowSpeed *= 0.1;
        }
        break;
    }
  }
  
  // Helper functions
  getHarmonyIndex(harmony) {
    const harmonies = [
      'resonant-coherence',
      'pan-sentient-flourishing', 
      'integral-wisdom-cultivation',
      'infinite-play',
      'universal-interconnectedness',
      'sacred-reciprocity',
      'evolutionary-progression'
    ];
    return harmonies.indexOf(harmony) || 0;
  }
  
  getHarmonyName(index) {
    const harmonies = [
      'resonant-coherence',
      'pan-sentient-flourishing',
      'integral-wisdom-cultivation', 
      'infinite-play',
      'universal-interconnectedness',
      'sacred-reciprocity',
      'evolutionary-progression'
    ];
    return harmonies[index];
  }
  
  getHarmonyColor(index) {
    const colors = [
      { r: 0.5, g: 0.8, b: 1.0 },   // Resonant Coherence - Sky blue
      { r: 0.3, g: 1.0, b: 0.3 },   // Pan-Sentient - Life green
      { r: 1.0, g: 0.8, b: 0.3 },   // Integral Wisdom - Golden
      { r: 1.0, g: 0.3, b: 0.8 },   // Infinite Play - Magenta
      { r: 0.8, g: 0.3, b: 1.0 },   // Universal Connect - Purple
      { r: 0.3, g: 1.0, b: 0.8 },   // Sacred Reciprocity - Turquoise
      { r: 1.0, g: 0.5, b: 0.3 }    // Evolutionary - Orange
    ];
    return colors[index] || { r: 1, g: 1, b: 1 };
  }
  
  createTransformMatrix(position) {
    // Simple translation matrix
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      position.x, position.y, position.z, 1
    ]);
  }
  
  multiplyMatrices(a, b) {
    // 4x4 matrix multiplication
    const result = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[i * 4 + k] * b[k * 4 + j];
        }
        result[i * 4 + j] = sum;
      }
    }
    return result;
  }
}

export default MultiAgentTorusField;