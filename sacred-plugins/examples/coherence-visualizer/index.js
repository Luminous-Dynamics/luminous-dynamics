/**
 * Sacred Coherence Visualizer Plugin
 * Creates beautiful mandala visualizations of field coherence
 */

export default class CoherenceVisualizer {
  constructor(context) {
    this.context = context;
    this.field = null;
    this.visualization = null;
    this.updateInterval = null;
    this.canvas = null;
  }

  async onActivate() {
    console.log('🎨 Coherence Visualizer activating...');
    
    // Get field access
    this.field = this.context.getField();
    
    // Register API endpoint for visualization data
    this.context.registerEndpoint('/visualization/coherence', this.handleCoherenceData.bind(this));
    
    // Register UI component
    this.context.registerComponent('coherence-mandala', {
      render: this.renderMandala.bind(this),
      update: this.updateMandala.bind(this),
      styles: this.getStyles()
    });
    
    // Subscribe to field updates
    this.field.on('stateChange', this.onFieldUpdate.bind(this));
    
    // Start visualization updates
    this.startVisualization();
    
    // Emit activation event
    this.context.emit('activated', {
      visualType: 'mandala'
    });
  }

  async onDeactivate() {
    console.log('🌙 Coherence Visualizer deactivating...');
    
    // Stop updates
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Clean up visualization
    if (this.visualization) {
      this.visualization.destroy();
    }
    
    this.context.emit('deactivated');
  }

  async handleCoherenceData(req, res) {
    const state = await this.field.getState();
    const history = await this.getCoherenceHistory();
    
    res.json({
      current: state,
      history,
      geometry: this.calculateSacredGeometry(state.coherence)
    });
  }

  renderMandala(container) {
    // Create canvas for visualization
    this.canvas = document.createElement('canvas');
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.canvas.className = 'coherence-mandala-canvas';
    
    container.appendChild(this.canvas);
    
    // Create initial visualization
    this.updateVisualization();
    
    // Add info display
    const info = document.createElement('div');
    info.className = 'coherence-info';
    info.innerHTML = `
      <div class="coherence-value">
        <span class="label">Field Coherence</span>
        <span class="value" id="coherence-percent">0%</span>
      </div>
      <div class="coherence-state">
        <span class="label">State</span>
        <span class="value" id="coherence-state">Emerging</span>
      </div>
    `;
    container.appendChild(info);
  }

  updateMandala(data) {
    if (!this.canvas) return;
    
    // Update visualization with new data
    this.drawMandala(data.coherence);
    
    // Update text displays
    document.getElementById('coherence-percent').textContent = 
      `${Math.round(data.coherence * 100)}%`;
    
    document.getElementById('coherence-state').textContent = 
      this.getCoherenceStateName(data.coherence);
  }

  drawMandala(coherence) {
    const ctx = this.canvas.getContext('2d');
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Calculate sacred geometry parameters
    const layers = Math.floor(coherence * 7) + 3; // 3-10 layers
    const rotation = Date.now() * 0.0001 * coherence; // Rotate based on coherence
    
    // Draw mandala layers
    for (let i = 0; i < layers; i++) {
      const layerRadius = (maxRadius / layers) * (i + 1);
      const petals = 6 + i * 2; // Increasing petals per layer
      const opacity = 0.3 + (coherence * 0.7);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation + (i * Math.PI / layers));
      
      // Draw petals
      for (let j = 0; j < petals; j++) {
        const angle = (Math.PI * 2 / petals) * j;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        
        // Create petal shape
        const controlRadius = layerRadius * 0.8;
        const endX = Math.cos(angle) * layerRadius;
        const endY = Math.sin(angle) * layerRadius;
        const nextAngle = angle + (Math.PI * 2 / petals);
        const nextX = Math.cos(nextAngle) * layerRadius;
        const nextY = Math.sin(nextAngle) * layerRadius;
        
        ctx.quadraticCurveTo(
          Math.cos(angle + Math.PI / petals) * controlRadius,
          Math.sin(angle + Math.PI / petals) * controlRadius,
          endX, endY
        );
        
        ctx.arc(0, 0, layerRadius, angle, nextAngle);
        
        // Golden gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layerRadius);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`);
        gradient.addColorStop(1, `rgba(255, 193, 0, ${opacity * 0.5})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Outline
        ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    // Center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5 + (coherence * 10), 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    
    // Outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 215, 0, ${coherence})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  calculateSacredGeometry(coherence) {
    return {
      phi: 1.618033988749895, // Golden ratio
      layers: Math.floor(coherence * 7) + 3,
      symmetry: 6, // Hexagonal base
      spiralTightness: coherence * 2,
      pulseRate: 1 + (coherence * 2), // Breathing rate
      colorIntensity: coherence
    };
  }

  getCoherenceStateName(coherence) {
    if (coherence >= 0.9) return '✨ Sacred Unity';
    if (coherence >= 0.7) return '🌟 High Resonance';
    if (coherence >= 0.5) return '💫 Harmonizing';
    if (coherence >= 0.3) return '🌙 Emerging';
    return '⭐ Building';
  }

  async startVisualization() {
    // Initial update
    const state = await this.field.getState();
    this.updateMandala(state);
    
    // Regular updates
    this.updateInterval = setInterval(async () => {
      const state = await this.field.getState();
      this.updateMandala(state);
    }, 100); // Smooth 10fps updates
  }

  async onFieldUpdate(state) {
    // Handle special states
    if (state.specialState) {
      this.showSpecialState(state.specialState);
    }
    
    // Emit visualization events
    this.context.emit('coherence:visualized', {
      coherence: state.coherence,
      geometry: this.calculateSacredGeometry(state.coherence)
    });
  }

  showSpecialState(type) {
    // Add special visual effects for convergence, emergence, etc.
    console.log(`🌈 Special state detected: ${type}`);
    
    // Could trigger particle effects, color shifts, etc.
  }

  async getCoherenceHistory() {
    // In a real implementation, this would fetch from storage
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: Date.now() - (i * 3600000),
      coherence: 0.5 + (Math.random() * 0.3)
    }));
  }

  getStyles() {
    return `
      .coherence-mandala-canvas {
        width: 100%;
        height: 400px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);
      }
      
      .coherence-info {
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(255, 215, 0, 0.1);
        border-radius: 8px;
      }
      
      .coherence-value {
        text-align: center;
      }
      
      .coherence-value .label {
        display: block;
        font-size: 0.9rem;
        opacity: 0.8;
        margin-bottom: 0.5rem;
      }
      
      .coherence-value .value {
        display: block;
        font-size: 2rem;
        font-weight: bold;
        color: #FFD700;
      }
      
      .coherence-state .value {
        color: #FFD700;
      }
    `;
  }
}