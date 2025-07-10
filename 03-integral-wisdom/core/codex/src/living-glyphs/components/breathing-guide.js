/**
 * Breathing Guide Component - Sacred Breath Awareness
 * 
 * Interactive breathing component with sacred geometry visualizations,
 * customizable patterns per glyph, and coherence feedback.
 */

export class BreathingGuide {
  constructor(options = {}) {
    this.options = {
      pattern: options.pattern || { inhale: 4, hold: 0, exhale: 4, pause: 0 },
      harmony: options.harmony || 'integral-wisdom-cultivation',
      visualStyle: options.visualStyle || 'sacred-geometry',
      audioEnabled: options.audioEnabled || false,
      hapticEnabled: options.hapticEnabled || false,
      onBreathComplete: options.onBreathComplete || (() => {}),
      onCycleComplete: options.onCycleComplete || (() => {}),
      sacredTimings: options.sacredTimings || {},
      ...options
    };
    
    // Component State
    this.state = 'idle'; // idle, breathing, paused, complete
    this.currentPhase = 'prepare'; // prepare, inhale, hold, exhale, pause
    this.cycleCount = 0;
    this.targetCycles = options.targetCycles || 3;
    this.breathTimer = null;
    this.animationFrame = null;
    
    // Visual Elements
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    
    // Sacred Geometry Properties
    this.geometry = {
      centerX: 0,
      centerY: 0,
      baseRadius: 60,
      currentRadius: 60,
      targetRadius: 60,
      petals: this.getPetalCount(),
      rotation: 0,
      breathProgress: 0,
      phaseColors: this.getPhaseColors(),
      particleSystem: []
    };
    
    // Audio Context (if enabled)
    this.audioContext = null;
    this.breathSounds = null;
  }
  
  // === INITIALIZATION ===
  
  mount(container) {
    this.container = container;
    this.createStructure();
    this.initializeCanvas();
    this.setupEventListeners();
    this.startIdleAnimation();
  }
  
  createStructure() {
    this.container.innerHTML = `
      <div class="breathing-guide-component">
        <div class="breath-visualization">
          <canvas class="breath-canvas"></canvas>
          <div class="breath-overlay">
            <div class="phase-indicator"></div>
            <div class="breath-instruction"></div>
            <div class="breath-counter"></div>
          </div>
        </div>
        
        <div class="breath-controls">
          <button class="breath-start-btn">Begin Sacred Breathing</button>
          <button class="breath-pause-btn hidden">Pause</button>
          <button class="breath-settings-btn" title="Adjust Pattern">⚙️</button>
        </div>
        
        <div class="breath-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="cycle-dots">
            ${this.renderCycleDots()}
          </div>
        </div>
        
        <div class="coherence-feedback hidden">
          <div class="coherence-label">Heart-Breath Coherence</div>
          <div class="coherence-meter">
            <div class="coherence-fill"></div>
          </div>
          <div class="coherence-value">0%</div>
        </div>
      </div>
    `;
    
    // Cache elements
    this.elements = {
      canvas: this.container.querySelector('.breath-canvas'),
      phaseIndicator: this.container.querySelector('.phase-indicator'),
      instruction: this.container.querySelector('.breath-instruction'),
      counter: this.container.querySelector('.breath-counter'),
      startBtn: this.container.querySelector('.breath-start-btn'),
      pauseBtn: this.container.querySelector('.breath-pause-btn'),
      settingsBtn: this.container.querySelector('.breath-settings-btn'),
      progressFill: this.container.querySelector('.progress-fill'),
      cycleDots: this.container.querySelectorAll('.cycle-dot'),
      coherenceFeedback: this.container.querySelector('.coherence-feedback'),
      coherenceFill: this.container.querySelector('.coherence-fill'),
      coherenceValue: this.container.querySelector('.coherence-value')
    };
  }
  
  initializeCanvas() {
    this.canvas = this.elements.canvas;
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size
    this.resizeCanvas();
    
    // Initialize geometry center
    this.geometry.centerX = this.canvas.width / 2;
    this.geometry.centerY = this.canvas.height / 2;
    
    // Initialize particle system if enabled
    if (this.options.particles) {
      this.initializeParticles();
    }
  }
  
  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  
  setupEventListeners() {
    // Control buttons
    this.elements.startBtn.addEventListener('click', () => this.start());
    this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
    this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
    
    // Window resize
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.state === 'breathing') {
        e.preventDefault();
        this.togglePause();
      }
    });
  }
  
  // === BREATHING CONTROL ===
  
  async start() {
    if (this.state === 'breathing') return;
    
    this.state = 'breathing';
    this.cycleCount = 0;
    this.currentPhase = 'prepare';
    
    // Update UI
    this.elements.startBtn.classList.add('hidden');
    this.elements.pauseBtn.classList.remove('hidden');
    this.elements.coherenceFeedback.classList.remove('hidden');
    
    // Start preparation phase
    await this.preparePhase();
    
    // Begin breathing cycles
    this.breathingLoop();
  }
  
  async preparePhase() {
    this.updateInstruction('Settle into your sacred space...');
    this.elements.phaseIndicator.textContent = 'Preparing';
    
    // Gentle expansion animation
    await this.animateRadius(this.geometry.baseRadius * 1.1, 2000);
    await this.animateRadius(this.geometry.baseRadius, 1000);
  }
  
  async breathingLoop() {
    while (this.state === 'breathing' && this.cycleCount < this.targetCycles) {
      // Inhale
      await this.performPhase('inhale');
      
      // Hold (if specified)
      if (this.options.pattern.hold > 0) {
        await this.performPhase('hold');
      }
      
      // Exhale
      await this.performPhase('exhale');
      
      // Pause (if specified)
      if (this.options.pattern.pause > 0) {
        await this.performPhase('pause');
      }
      
      // Complete cycle
      this.cycleCount++;
      this.updateCycleProgress();
      this.options.onBreathComplete();
      
      // Check if complete
      if (this.cycleCount >= this.targetCycles) {
        this.complete();
      }
    }
  }
  
  async performPhase(phase) {
    if (this.state !== 'breathing') return;
    
    this.currentPhase = phase;
    const duration = this.options.pattern[phase] * 1000;
    
    // Update UI
    this.updatePhaseUI(phase);
    
    // Perform phase animation
    switch (phase) {
      case 'inhale':
        await this.animateInhale(duration);
        break;
      case 'hold':
        await this.animateHold(duration);
        break;
      case 'exhale':
        await this.animateExhale(duration);
        break;
      case 'pause':
        await this.animatePause(duration);
        break;
    }
  }
  
  updatePhaseUI(phase) {
    const phaseInfo = {
      inhale: {
        instruction: 'Breathe in slowly...',
        indicator: 'Inhaling',
        color: this.geometry.phaseColors.inhale
      },
      hold: {
        instruction: 'Hold gently...',
        indicator: 'Holding',
        color: this.geometry.phaseColors.hold
      },
      exhale: {
        instruction: 'Release completely...',
        indicator: 'Exhaling',
        color: this.geometry.phaseColors.exhale
      },
      pause: {
        instruction: 'Rest in emptiness...',
        indicator: 'Pausing',
        color: this.geometry.phaseColors.pause
      }
    };
    
    const info = phaseInfo[phase];
    this.updateInstruction(info.instruction);
    this.elements.phaseIndicator.textContent = info.indicator;
    this.elements.phaseIndicator.style.color = info.color;
  }
  
  // === ANIMATIONS ===
  
  async animateInhale(duration) {
    const targetRadius = this.geometry.baseRadius * 1.5;
    await this.animateRadius(targetRadius, duration, 'easeInOut');
    
    // Update coherence
    this.updateCoherence(0.02);
  }
  
  async animateHold(duration) {
    // Subtle pulsing during hold
    const pulseCount = Math.floor(duration / 500);
    for (let i = 0; i < pulseCount; i++) {
      await this.animateRadius(this.geometry.currentRadius * 1.02, 250);
      await this.animateRadius(this.geometry.currentRadius * 0.98, 250);
    }
  }
  
  async animateExhale(duration) {
    await this.animateRadius(this.geometry.baseRadius * 0.7, duration, 'easeInOut');
    
    // Update coherence
    this.updateCoherence(0.02);
  }
  
  async animatePause(duration) {
    // Stillness with gentle rotation
    const startRotation = this.geometry.rotation;
    const endRotation = startRotation + Math.PI / 8;
    await this.animateRotation(endRotation, duration);
  }
  
  async animateRadius(targetRadius, duration, easing = 'linear') {
    return new Promise(resolve => {
      const startRadius = this.geometry.currentRadius;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = this.ease(progress, easing);
        
        this.geometry.currentRadius = startRadius + (targetRadius - startRadius) * easedProgress;
        this.geometry.targetRadius = targetRadius;
        this.geometry.breathProgress = progress;
        
        if (progress < 1) {
          this.animationFrame = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  }
  
  async animateRotation(targetRotation, duration) {
    return new Promise(resolve => {
      const startRotation = this.geometry.rotation;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        this.geometry.rotation = startRotation + (targetRotation - startRotation) * progress;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  }
  
  ease(t, type) {
    switch (type) {
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'easeOut':
        return t * (2 - t);
      case 'easeIn':
        return t * t;
      default:
        return t;
    }
  }
  
  // === VISUAL RENDERING ===
  
  startIdleAnimation() {
    const render = () => {
      this.clearCanvas();
      this.drawBreathVisualization();
      
      if (this.state === 'idle') {
        // Gentle idle animation
        this.geometry.rotation += 0.002;
        this.geometry.currentRadius = this.geometry.baseRadius + 
          Math.sin(Date.now() * 0.001) * 5;
      }
      
      this.animationFrame = requestAnimationFrame(render);
    };
    
    render();
  }
  
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  drawBreathVisualization() {
    const { centerX, centerY, currentRadius, rotation, petals } = this.geometry;
    
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(rotation);
    
    switch (this.options.visualStyle) {
      case 'sacred-geometry':
        this.drawSacredGeometry();
        break;
      case 'mandala':
        this.drawMandala();
        break;
      case 'flower-of-life':
        this.drawFlowerOfLife();
        break;
      default:
        this.drawSimpleCircle();
    }
    
    this.ctx.restore();
    
    // Draw particles if enabled
    if (this.geometry.particleSystem.length > 0) {
      this.updateAndDrawParticles();
    }
  }
  
  drawSacredGeometry() {
    const { currentRadius, petals } = this.geometry;
    const phaseColor = this.getCurrentPhaseColor();
    
    // Outer petals
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const petalRadius = currentRadius * 0.6;
      const x = Math.cos(angle) * currentRadius * 0.7;
      const y = Math.sin(angle) * currentRadius * 0.7;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, petalRadius, 0, Math.PI * 2);
      this.ctx.strokeStyle = phaseColor + '40';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Inner connections
      if (i % 2 === 0) {
        const nextAngle = ((i + 2) / petals) * Math.PI * 2;
        const nextX = Math.cos(nextAngle) * currentRadius * 0.7;
        const nextY = Math.sin(nextAngle) * currentRadius * 0.7;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(nextX, nextY);
        this.ctx.strokeStyle = phaseColor + '20';
        this.ctx.stroke();
      }
    }
    
    // Center circle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, currentRadius * 0.3, 0, Math.PI * 2);
    this.ctx.fillStyle = phaseColor + '30';
    this.ctx.fill();
    this.ctx.strokeStyle = phaseColor + '80';
    this.ctx.stroke();
  }
  
  drawMandala() {
    const { currentRadius } = this.geometry;
    const layers = 5;
    const phaseColor = this.getCurrentPhaseColor();
    
    for (let layer = 0; layer < layers; layer++) {
      const layerRadius = currentRadius * (1 - layer * 0.15);
      const segments = 8 + layer * 4;
      
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const nextAngle = ((i + 1) / segments) * Math.PI * 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.arc(0, 0, layerRadius, angle, nextAngle);
        this.ctx.closePath();
        
        const alpha = (0.3 - layer * 0.05) * (i % 2 === 0 ? 1 : 0.5);
        this.ctx.fillStyle = phaseColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        this.ctx.fill();
      }
    }
  }
  
  drawFlowerOfLife() {
    const { currentRadius } = this.geometry;
    const circles = 7;
    const phaseColor = this.getCurrentPhaseColor();
    
    // Center circle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = phaseColor + '60';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * currentRadius;
      const y = Math.sin(angle) * currentRadius;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
      this.ctx.strokeStyle = phaseColor + '40';
      this.ctx.stroke();
    }
  }
  
  drawSimpleCircle() {
    const { currentRadius } = this.geometry;
    const phaseColor = this.getCurrentPhaseColor();
    
    this.ctx.beginPath();
    this.ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = phaseColor;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Inner glow
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
    gradient.addColorStop(0, phaseColor + '40');
    gradient.addColorStop(1, phaseColor + '00');
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }
  
  getCurrentPhaseColor() {
    return this.geometry.phaseColors[this.currentPhase] || this.geometry.phaseColors.idle;
  }
  
  // === PARTICLE SYSTEM ===
  
  initializeParticles() {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      this.geometry.particleSystem.push({
        x: (Math.random() - 0.5) * this.canvas.width,
        y: (Math.random() - 0.5) * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.5,
        life: 1
      });
    }
  }
  
  updateAndDrawParticles() {
    const phaseColor = this.getCurrentPhaseColor();
    
    this.geometry.particleSystem.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Apply breath influence
      const distance = Math.sqrt(particle.x * particle.x + particle.y * particle.y);
      const influence = (this.geometry.currentRadius - this.geometry.baseRadius) * 0.01;
      
      particle.vx += (particle.x / distance) * influence;
      particle.vy += (particle.y / distance) * influence;
      
      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Life decay
      particle.life -= 0.005;
      
      // Respawn if dead
      if (particle.life <= 0) {
        particle.x = (Math.random() - 0.5) * this.canvas.width;
        particle.y = (Math.random() - 0.5) * this.canvas.height;
        particle.life = 1;
      }
      
      // Draw particle
      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha * particle.life;
      this.ctx.fillStyle = phaseColor;
      this.ctx.beginPath();
      this.ctx.arc(
        this.geometry.centerX + particle.x,
        this.geometry.centerY + particle.y,
        particle.size,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
      this.ctx.restore();
    });
  }
  
  // === UI UPDATES ===
  
  updateInstruction(text) {
    this.elements.instruction.textContent = text;
  }
  
  updateCycleProgress() {
    // Update progress bar
    const progress = (this.cycleCount / this.targetCycles) * 100;
    this.elements.progressFill.style.width = `${progress}%`;
    
    // Update cycle dots
    this.elements.cycleDots.forEach((dot, index) => {
      dot.classList.toggle('completed', index < this.cycleCount);
    });
    
    // Update counter
    this.elements.counter.textContent = 
      `${this.cycleCount} of ${this.targetCycles} cycles complete`;
  }
  
  updateCoherence(delta) {
    this.coherenceLevel = Math.min(1, (this.coherenceLevel || 0) + delta);
    const percentage = Math.round(this.coherenceLevel * 100);
    
    this.elements.coherenceFill.style.width = `${percentage}%`;
    this.elements.coherenceValue.textContent = `${percentage}%`;
    
    // Update color based on level
    const hue = 120 * this.coherenceLevel; // Red to green
    this.elements.coherenceFill.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
  }
  
  renderCycleDots() {
    let dots = '';
    for (let i = 0; i < this.targetCycles; i++) {
      dots += `<div class="cycle-dot" data-cycle="${i}"></div>`;
    }
    return dots;
  }
  
  // === CONTROLS ===
  
  togglePause() {
    if (this.state === 'breathing') {
      this.state = 'paused';
      this.elements.pauseBtn.textContent = 'Resume';
      this.updateInstruction('Paused - Press to resume');
    } else if (this.state === 'paused') {
      this.state = 'breathing';
      this.elements.pauseBtn.textContent = 'Pause';
      this.breathingLoop(); // Resume
    }
  }
  
  openSettings() {
    // Would open a modal to adjust breathing pattern
    console.log('Settings would open here');
  }
  
  complete() {
    this.state = 'complete';
    this.updateInstruction('Beautiful practice! Rest in this sacred space.');
    
    // Update UI
    this.elements.pauseBtn.classList.add('hidden');
    this.elements.startBtn.classList.remove('hidden');
    this.elements.startBtn.textContent = 'Practice Again';
    
    // Callback
    this.options.onCycleComplete({
      cycles: this.cycleCount,
      coherence: this.coherenceLevel || 0
    });
  }
  
  stop() {
    this.state = 'idle';
    
    if (this.breathTimer) {
      clearTimeout(this.breathTimer);
      this.breathTimer = null;
    }
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Reset UI
    this.elements.startBtn.classList.remove('hidden');
    this.elements.pauseBtn.classList.add('hidden');
    this.elements.coherenceFeedback.classList.add('hidden');
    this.updateInstruction('');
    this.elements.phaseIndicator.textContent = '';
  }
  
  // === HELPER METHODS ===
  
  getPetalCount() {
    const harmonyPetals = {
      'integral-wisdom-cultivation': 8,
      'resonant-coherence': 6,
      'universal-interconnectedness': 12,
      'evolutionary-progression': 7,
      'pan-sentient-flourishing': 9,
      'sacred-reciprocity': 10,
      'infinite-play': 5
    };
    
    return harmonyPetals[this.options.harmony] || 8;
  }
  
  getPhaseColors() {
    const baseColors = {
      'integral-wisdom-cultivation': '#A8B5A6',
      'resonant-coherence': '#B3C5D7',
      'universal-interconnectedness': '#D4A574',
      'evolutionary-progression': '#C4A5A0',
      'pan-sentient-flourishing': '#A6C4A6',
      'sacred-reciprocity': '#B5A6C4',
      'infinite-play': '#C4B5A6'
    };
    
    const base = baseColors[this.options.harmony] || '#A8B5A6';
    
    return {
      idle: base,
      inhale: this.lightenColor(base, 20),
      hold: base,
      exhale: this.darkenColor(base, 20),
      pause: this.darkenColor(base, 40)
    };
  }
  
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }
  
  darkenColor(color, percent) {
    return this.lightenColor(color, -percent);
  }
  
  // === CLEANUP ===
  
  destroy() {
    this.stop();
    
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.resizeCanvas);
  }
}