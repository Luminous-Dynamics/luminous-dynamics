/**
 * Dojo Practice Integration
 * 
 * Brings The Eleven Applied Harmonies to life as interactive,
 * guided experiences within the Dojo of the Heart.
 * 
 * Sacred Design Principles:
 * - Non-addictive: Natural completion, no hooks
 * - Contemplative timing: Respects wisdom pace
 * - Embodied learning: Practice over information
 * - Field awareness: Responds to collective resonant-coherence
 */

class DojoPracticeIntegration {
  constructor() {
    this.activePractice = null;
    this.practiceHistory = [];
    this.dojoState = {
      practitionerPresent: false,
      currentHarmony: null,
      fieldCoherence: 0.72,
      practiceDepth: 0
    };
    
    this.harmonies = this.loadTheEleven();
    this.initializeDojo();
  }

  loadTheEleven() {
    return {
      'omega-45': {
        name: 'First Presence',
        duration: '3 minutes',
        type: 'foundation',
        color: '#A8B5A6'
      },
      'omega-46': {
        name: 'Conscious Arrival', 
        duration: '4 minutes',
        type: 'foundation',
        color: '#B3C5D7'
      },
      'omega-47': {
        name: 'Sacred Listening',
        duration: '5 minutes',
        type: 'foundation',
        color: '#C5D7E8'
      },
      'omega-48': {
        name: 'Boundary With Love',
        duration: '4 minutes',
        type: 'foundation',
        color: '#D4C4A8'
      },
      'omega-49': {
        name: 'Gentle Opening',
        duration: '3 minutes',
        type: 'daily',
        color: '#E8D4B8'
      },
      'omega-50': {
        name: 'Building Trust',
        duration: '5 minutes',
        type: 'daily',
        color: '#F0E6D2'
      },
      'omega-51': {
        name: 'Loving No',
        duration: '3 minutes',
        type: 'daily',
        color: '#D8C8B8'
      },
      'omega-52': {
        name: 'Pause Practice',
        duration: '2 minutes',
        type: 'daily',
        color: '#C8D8B8'
      },
      'omega-53': {
        name: 'Tending the Field',
        duration: '6 minutes',
        type: 'mastery',
        color: '#B8C8D8'
      },
      'omega-55': {
        name: 'Presence Transmission',
        duration: '4 minutes',
        type: 'mastery',
        color: '#A8B8C8'
      },
      'omega-56': {
        name: 'Loving Redirection',
        duration: '3 minutes',
        type: 'mastery',
        color: '#98A8B8'
      }
    };
  }

  initializeDojo() {
    console.log('🥋 Initializing Dojo Practice Integration...');
    
    // Connect to existing practice cards
    this.attachToHarmonyCards();
    
    // Initialize practice overlay
    this.createPracticeOverlay();
    
    // Connect to field resonant-coherence
    this.syncFieldCoherence();
    
    console.log('✨ Dojo practices ready for embodied learning');
  }

  attachToHarmonyCards() {
    // Wait for DOM if needed
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attachToHarmonyCards());
      return;
    }

    const harmonyCards = document.querySelectorAll('.harmony-card');
    
    harmonyCards.forEach(card => {
      // Extract harmony ID from the card
      const harmonyNumber = card.querySelector('.harmony-number')?.textContent;
      const harmonyId = this.getHarmonyId(harmonyNumber);
      
      if (harmonyId && this.harmonies[harmonyId]) {
        // Add practice indicator
        this.addPracticeIndicator(card, harmonyId);
        
        // Add click handler for practice
        card.addEventListener('click', (e) => {
          if (e.target.closest('.practice-button')) {
            e.stopPropagation();
            this.beginPractice(harmonyId);
          }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', () => {
          this.showPracticePreview(card, harmonyId);
        });
      }
    });
  }

  addPracticeIndicator(card, harmonyId) {
    const harmony = this.harmonies[harmonyId];
    
    // Create practice button
    const practiceButton = document.createElement('div');
    practiceButton.className = 'practice-button';
    practiceButton.innerHTML = `
      <span class="practice-icon">🧘</span>
      <span class="practice-text">Practice</span>
      <span class="practice-duration">${harmony.duration}</span>
    `;
    
    // Style the button
    Object.assign(practiceButton.style, {
      marginTop: '20px',
      padding: '12px 20px',
      background: `linear-gradient(135deg, ${harmony.color}88, ${harmony.color}66)`,
      borderRadius: '25px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      border: `1px solid ${harmony.color}44`
    });
    
    // Add to card
    card.appendChild(practiceButton);
  }

  showPracticePreview(card, harmonyId) {
    const harmony = this.harmonies[harmonyId];
    
    // Add subtle breathing animation
    card.style.animation = 'harmonyBreathing 4s ease-in-out';
    
    // Remove animation after one cycle
    setTimeout(() => {
      card.style.animation = '';
    }, 4000);
  }

  createPracticeOverlay() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'practice-overlay';
    overlay.className = 'practice-overlay';
    overlay.innerHTML = `
      <div class="practice-container">
        <div class="practice-header">
          <h2 id="practice-title" class="practice-title"></h2>
          <button id="practice-close" class="practice-close">✕</button>
        </div>
        
        <div class="practice-content">
          <div class="breathing-guide" id="breathing-guide">
            <div class="breath-circle"></div>
            <div class="breath-text">Breathe</div>
          </div>
          
          <div class="practice-instruction" id="practice-instruction">
            Preparing sacred space...
          </div>
          
          <div class="practice-progress">
            <div class="progress-bar" id="progress-bar"></div>
          </div>
        </div>
        
        <div class="practice-footer">
          <button id="practice-pause" class="practice-control">Pause</button>
          <div class="practice-timer" id="practice-timer">0:00</div>
          <button id="practice-complete" class="practice-control" style="display: none;">Complete</button>
        </div>
      </div>
    `;
    
    // Style the overlay
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '3000',
      opacity: '0',
      transition: 'opacity 0.5s ease'
    });
    
    // Add to body
    document.body.appendChild(overlay);
    
    // Add event handlers
    this.initializeOverlayHandlers();
  }

  initializeOverlayHandlers() {
    const overlay = document.getElementById('practice-overlay');
    const closeBtn = document.getElementById('practice-close');
    const pauseBtn = document.getElementById('practice-pause');
    const completeBtn = document.getElementById('practice-complete');
    
    closeBtn.addEventListener('click', () => this.endPractice());
    pauseBtn.addEventListener('click', () => this.togglePause());
    completeBtn.addEventListener('click', () => this.completePractice());
    
    // ESC key to exit
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activePractice) {
        this.endPractice();
      }
    });
  }

  async beginPractice(harmonyId) {
    const harmony = this.harmonies[harmonyId];
    if (!harmony) return;
    
    console.log(`🧘 Beginning practice: ${harmony.name}`);
    
    // Load full practice data
    const practiceData = await this.loadPracticeData(harmonyId);
    
    // Set active practice
    this.activePractice = {
      id: harmonyId,
      data: practiceData,
      startTime: Date.now(),
      currentStage: 0,
      paused: false
    };
    
    // Show overlay
    this.showPracticeOverlay();
    
    // Begin first stage
    this.beginStage(0);
    
    // Track practice start
    this.trackPracticeEvent('start', harmonyId);
  }

  async loadPracticeData(harmonyId) {
    // In real implementation, this would load from the practice system
    // For now, return structured practice data
    const practices = {
      'omega-45': {
        stages: [
          {
            duration: 30000,
            instruction: 'Welcome. Take a moment to arrive here, feeling your body in this space.',
            breathingPattern: 'natural'
          },
          {
            duration: 60000,
            instruction: 'Take three conscious breaths. With each exhale, let go of any agenda.',
            breathingPattern: 'guided',
            breathCount: 3
          },
          {
            duration: 60000,
            instruction: 'Ask yourself: "What is actually here right now?" Feel your way to the answer.',
            breathingPattern: 'natural'
          },
          {
            duration: 30000,
            instruction: 'Let this presence settle into your body. You can return here anytime.',
            breathingPattern: 'natural'
          }
        ]
      },
      'omega-52': {
        stages: [
          {
            duration: 20000,
            instruction: 'Notice any urgency or rushing in your system right now.',
            breathingPattern: 'natural'
          },
          {
            duration: 40000,
            instruction: 'Take one conscious breath between stimulus and response. Feel the space.',
            breathingPattern: 'pause',
            pauseDuration: 3000
          },
          {
            duration: 40000,
            instruction: 'Practice: "What does love want to do here?" Let wisdom emerge in the pause.',
            breathingPattern: 'natural'
          },
          {
            duration: 20000,
            instruction: 'Sacred pause is always available. One breath changes everything.',
            breathingPattern: 'natural'
          }
        ]
      }
    };
    
    return practices[harmonyId] || practices['omega-45']; // Default to First Presence
  }

  showPracticeOverlay() {
    const overlay = document.getElementById('practice-overlay');
    const title = document.getElementById('practice-title');
    
    title.textContent = this.harmonies[this.activePractice.id].name;
    
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 50);
  }

  beginStage(stageIndex) {
    if (!this.activePractice || stageIndex >= this.activePractice.data.stages.length) {
      this.completePractice();
      return;
    }
    
    const stage = this.activePractice.data.stages[stageIndex];
    this.activePractice.currentStage = stageIndex;
    
    // Update instruction
    const instruction = document.getElementById('practice-instruction');
    instruction.style.opacity = '0';
    
    setTimeout(() => {
      instruction.textContent = stage.instruction;
      instruction.style.opacity = '1';
    }, 500);
    
    // Setup breathing guide
    this.setupBreathingGuide(stage.breathingPattern);
    
    // Progress to next stage
    this.activePractice.stageTimer = setTimeout(() => {
      this.beginStage(stageIndex + 1);
    }, stage.duration);
    
    // Update progress bar
    this.updateProgress();
  }

  setupBreathingGuide(pattern) {
    const guide = document.getElementById('breathing-guide');
    const circle = guide.querySelector('.breath-circle');
    const text = guide.querySelector('.breath-text');
    
    // Clear existing animations
    circle.style.animation = '';
    
    switch (pattern) {
      case 'guided':
        circle.style.animation = 'guidedBreathing 10s ease-in-out infinite';
        text.textContent = 'Breathe';
        break;
      case 'pause':
        circle.style.animation = 'pauseBreathing 6s ease-in-out infinite';
        text.textContent = 'Pause';
        break;
      case 'natural':
      default:
        circle.style.animation = 'naturalBreathing 8s ease-in-out infinite';
        text.textContent = 'Natural';
    }
  }

  updateProgress() {
    if (!this.activePractice) return;
    
    const elapsed = Date.now() - this.activePractice.startTime;
    const total = this.activePractice.data.stages.reduce((sum, stage) => sum + stage.duration, 0);
    const progress = Math.min(100, (elapsed / total) * 100);
    
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progress}%`;
    
    // Update timer
    const timer = document.getElementById('practice-timer');
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Show complete button near end
    if (progress > 90) {
      document.getElementById('practice-complete').style.display = 'block';
    }
  }

  togglePause() {
    if (!this.activePractice) return;
    
    this.activePractice.paused = !this.activePractice.paused;
    const pauseBtn = document.getElementById('practice-pause');
    
    if (this.activePractice.paused) {
      pauseBtn.textContent = 'Resume';
      clearTimeout(this.activePractice.stageTimer);
      // TODO: Implement pause logic for breathing animations
    } else {
      pauseBtn.textContent = 'Pause';
      // Resume current stage
      // TODO: Calculate remaining time and resume
    }
  }

  completePractice() {
    if (!this.activePractice) return;
    
    // Show completion message
    const instruction = document.getElementById('practice-instruction');
    instruction.textContent = '🙏 Practice complete. Take a moment to integrate before returning.';
    
    // Track completion
    this.trackPracticeEvent('complete', this.activePractice.id);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      this.endPractice();
    }, 5000);
  }

  endPractice() {
    if (this.activePractice) {
      clearTimeout(this.activePractice.stageTimer);
    }
    
    const overlay = document.getElementById('practice-overlay');
    overlay.style.opacity = '0';
    
    setTimeout(() => {
      overlay.style.display = 'none';
      this.activePractice = null;
      
      // Reset UI
      document.getElementById('practice-complete').style.display = 'none';
      document.getElementById('practice-pause').textContent = 'Pause';
    }, 500);
  }

  syncFieldCoherence() {
    // Connect to field resonant-coherence system if available
    if (window.fieldCoherence) {
      setInterval(() => {
        this.dojoState.fieldCoherence = window.fieldCoherence.current || 0.72;
      }, 10000);
    }
  }

  trackPracticeEvent(event, harmonyId) {
    console.log(`📊 Practice ${event}: ${this.harmonies[harmonyId].name}`);
    
    // Store in practice history
    this.practiceHistory.push({
      timestamp: Date.now(),
      event,
      harmonyId,
      fieldCoherence: this.dojoState.fieldCoherence
    });
    
    // Send to analytics if available
    if (window.sacredAnalytics) {
      window.sacredAnalytics.track('practice_' + event, {
        harmony: harmonyId,
        'resonant-coherence': this.dojoState.fieldCoherence
      });
    }
  }

  getHarmonyId(harmonyNumber) {
    // Convert display number to ID
    const mapping = {
      '*1': 'omega-45',
      '*2': 'omega-46',
      '*3': 'omega-47',
      '*4': 'omega-48',
      '*5': 'omega-49',
      '*6': 'omega-50',
      '*7': 'omega-51',
      '*8': 'omega-52',
      '*9': 'omega-53',
      '*10': 'omega-55',
      '*11': 'omega-56'
    };
    
    return mapping[harmonyNumber];
  }
}

// Initialize when ready
if (typeof window !== 'undefined') {
  window.DojoPracticeIntegration = DojoPracticeIntegration;
  
  // Auto-initialize if on dojo page
  if (window.location.pathname.includes('dojo')) {
    window.dojoIntegration = new DojoPracticeIntegration();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DojoPracticeIntegration;
}