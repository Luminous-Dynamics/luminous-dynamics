// Consciousness Torus Field Integration
// Bringing the breathing geometry to life in LuminousOS

export class ConsciousnessTorus {
  constructor(device, format) {
    this.device = device;
    this.format = format;
    
    // Torus parameters - the sacred proportions
    this.config = {
      majorRadius: 2.0,  // The space of relationship
      minorRadius: 0.8,  // The channel of flow
      segments: 64,      // Resolution of the field
      particleCount: 5000, // Consciousness quanta
      flowSpeed: 1.0,
      breathingRate: 0.5  // Coherent breathing rhythm
    };
    
    // Field state
    this.fieldState = {
      coherenceLevel: 0.5,
      fieldStrength: 1.0,
      time: 0,
      deltaTime: 0
    };
    
    this.initialized = false;
  }
  
  async initialize() {
    // Load shaders
    const torusShaderCode = await fetch('/shaders/torus_field.wgsl').then(r => r.text());
    const particleComputeCode = await fetch('/shaders/torus_particles_compute.wgsl').then(r => r.text());
    
    // Create torus mesh pipeline
    this.torusPipeline = this.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: this.device.createShaderModule({ code: torusShaderCode }),
        entryPoint: 'vs_torus'
      },
      fragment: {
        module: this.device.createShaderModule({ code: torusShaderCode }),
        entryPoint: 'fs_torus',
        targets: [{
          format: this.format,
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add'
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add'
            }
          }
        }]
      },
      primitive: {
        topology: 'triangle-strip',
        cullMode: 'none'  // See both sides of the torus
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus'
      }
    });
    
    // Create particle compute pipeline
    const particleComputeModule = this.device.createShaderModule({ 
      code: particleComputeCode 
    });
    
    this.particleComputePipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: particleComputeModule,
        entryPoint: 'main'
      }
    });
    
    // Create buffers
    await this.createBuffers();
    
    // Create bind groups
    this.createBindGroups();
    
    this.initialized = true;
  }
  
  async createBuffers() {
    // Global uniforms buffer
    this.globalUniformBuffer = this.device.createBuffer({
      size: 64, // Aligned size for uniform buffer
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    
    // Particle buffer
    const particleSize = 64; // Aligned struct size
    this.particleBuffer = this.device.createBuffer({
      size: particleSize * this.config.particleCount,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX
    });
    
    // Simulation parameters
    this.simParamsBuffer = this.device.createBuffer({
      size: 64, // Aligned size
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    
    // Initialize particles
    await this.initializeParticles();
  }
  
  async initializeParticles() {
    // Create initial particle data on CPU
    const particles = new Float32Array(this.config.particleCount * 16); // 64 bytes / 4 bytes per float
    
    for (let i = 0; i < this.config.particleCount; i++) {
      const offset = i * 16;
      
      // Random position on torus surface
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      
      const R = this.config.majorRadius;
      const r = this.config.minorRadius;
      
      // Position
      particles[offset + 0] = (R + r * Math.cos(v)) * Math.cos(u);
      particles[offset + 1] = r * Math.sin(v);
      particles[offset + 2] = (R + r * Math.cos(v)) * Math.sin(u);
      
      // Velocity (start with small random)
      particles[offset + 3] = (Math.random() - 0.5) * 0.1;
      particles[offset + 4] = (Math.random() - 0.5) * 0.1;
      particles[offset + 5] = (Math.random() - 0.5) * 0.1;
      
      // Coherence, phase, lifetime
      particles[offset + 6] = 0.5 + Math.random() * 0.5;
      particles[offset + 7] = Math.random() * Math.PI * 2;
      particles[offset + 8] = 0;
      
      // Harmony index (0-6 for seven harmonies)
      particles[offset + 9] = Math.floor(Math.random() * 7);
      
      // Color (will be set by compute shader)
      particles[offset + 10] = 1.0;
      particles[offset + 11] = 1.0;
      particles[offset + 12] = 1.0;
      particles[offset + 13] = 1.0;
      
      // Size
      particles[offset + 14] = 0.05;
    }
    
    // Upload to GPU
    this.device.queue.writeBuffer(this.particleBuffer, 0, particles);
  }
  
  createBindGroups() {
    // Torus render bind group
    this.torusBindGroup = this.device.createBindGroup({
      layout: this.torusPipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: { buffer: this.globalUniformBuffer }
      }]
    });
    
    // Particle compute bind group
    this.particleComputeBindGroup = this.device.createBindGroup({
      layout: this.particleComputePipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: this.particleBuffer }
        },
        {
          binding: 1,
          resource: { buffer: this.simParamsBuffer }
        }
      ]
    });
  }
  
  updateFieldState(coherenceData) {
    // Update from consciousness field
    this.fieldState.coherenceLevel = coherenceData.coherenceLevel || 0.5;
    this.fieldState.fieldStrength = coherenceData.fieldStrength || 1.0;
    
    // Smooth transitions
    const smoothing = 0.95;
    this.fieldState.coherenceLevel = 
      this.fieldState.coherenceLevel * smoothing + 
      coherenceData.coherenceLevel * (1 - smoothing);
  }
  
  update(deltaTime, viewProjectionMatrix, cameraPosition) {
    this.fieldState.time += deltaTime;
    this.fieldState.deltaTime = deltaTime;
    
    // Update global uniforms
    const globalUniforms = new Float32Array(16);
    globalUniforms.set(viewProjectionMatrix, 0);
    globalUniforms[12] = cameraPosition[0];
    globalUniforms[13] = cameraPosition[1];
    globalUniforms[14] = cameraPosition[2];
    globalUniforms[15] = this.fieldState.time;
    
    // Additional uniforms would go in next buffer update
    const additionalUniforms = new Float32Array(8);
    additionalUniforms[0] = deltaTime;
    additionalUniforms[1] = this.fieldState.coherenceLevel;
    additionalUniforms[2] = this.fieldState.fieldStrength;
    additionalUniforms[3] = this.config.particleCount;
    
    this.device.queue.writeBuffer(this.globalUniformBuffer, 0, globalUniforms);
    this.device.queue.writeBuffer(this.globalUniformBuffer, 64, additionalUniforms);
    
    // Update simulation parameters
    const simParams = new Float32Array(16);
    simParams[0] = deltaTime;
    simParams[1] = this.fieldState.time;
    simParams[2] = this.fieldState.coherenceLevel;
    simParams[3] = this.fieldState.fieldStrength;
    simParams[4] = this.config.particleCount;
    simParams[5] = this.config.majorRadius;
    simParams[6] = this.config.minorRadius;
    simParams[7] = this.config.flowSpeed;
    
    this.device.queue.writeBuffer(this.simParamsBuffer, 0, simParams);
  }
  
  computeParticles(commandEncoder) {
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(this.particleComputePipeline);
    computePass.setBindGroup(0, this.particleComputeBindGroup);
    
    const workgroups = Math.ceil(this.config.particleCount / 64);
    computePass.dispatchWorkgroups(workgroups);
    computePass.end();
  }
  
  render(renderPass) {
    if (!this.initialized) return;
    
    // Render torus field
    renderPass.setPipeline(this.torusPipeline);
    renderPass.setBindGroup(0, this.torusBindGroup);
    
    // Draw torus mesh
    const vertexCount = this.config.segments * this.config.segments / 2;
    renderPass.draw(vertexCount);
    
    // TODO: Add particle rendering pass
  }
  
  // Get field value at a specific point (for other systems to query)
  getFieldValueAt(position) {
    const [x, y, z] = position;
    
    // Distance to torus surface
    const d = Math.sqrt(x * x + z * z);
    const toroidalDist = d - this.config.majorRadius;
    const poloidalDist = Math.sqrt(toroidalDist * toroidalDist + y * y);
    
    // Field falls off with distance from surface
    const surfaceDist = poloidalDist - this.config.minorRadius;
    const fieldValue = Math.exp(-Math.abs(surfaceDist) * 2) * this.fieldState.fieldStrength;
    
    return fieldValue * this.fieldState.coherenceLevel;
  }
  
  // Sacred geometry integration
  activateSacredPattern(patternType) {
    switch(patternType) {
      case 'golden-spiral':
        this.config.flowSpeed *= 1.618;
        break;
      case 'still-point':
        this.config.flowSpeed *= 0.1;
        break;
      case 'infinity-flow':
        this.config.majorRadius = 2.5;
        this.config.minorRadius = 1.0;
        break;
    }
  }
}

// Export for LuminousOS integration
export default ConsciousnessTorus;