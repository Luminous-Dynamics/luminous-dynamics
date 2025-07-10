/**
 * Interactive Sacred Practice System
 * Transform Applied Harmonies from descriptions into guided experiences
 * 
 * Core Philosophy: Technology that serves awakening through actual practice,
 * not just information consumption.
 */

class InteractiveSacredPractice {
  constructor() {
    this.practices = new Map();
    this.currentPractice = null;
    this.practiceState = {
      stage: 'arrival',
      breathCount: 0,
      coherenceLevel: 0.5,
      startTime: null
    };
    this.initializePractices();
    this.initializeEventListeners();
  }

  initializePractices() {
    // Ω45 - First Presence
    this.practices.set('omega-45', {
      id: 'omega-45',
      name: 'First Presence',
      mysticalRoot: 'Ω0 - The Shimmering Unnamed',
      activation: 'Can I meet this moment without needing it to be different?',
      harmony: 'integral-wisdom-cultivation',
      duration: 180000, // 3 minutes
      stages: [
        {
          name: 'Sacred Arrival',
          duration: 30000,
          instruction: 'Notice you are about to practice. Feel your body in this chair, your breath moving naturally.',
          guidance: 'arrival'
        },
        {
          name: 'Three Sacred Breaths',
          duration: 60000,
          instruction: 'Take three conscious breaths. With each exhale, release any agenda for this moment.',
          guidance: 'breathing',
          breathCount: 3
        },
        {
          name: 'Present Moment Inquiry',
          duration: 60000,
          instruction: 'Ask yourself: "What is actually here right now?" Feel rather than think your way to the answer.',
          guidance: 'inquiry'
        },
        {
          name: 'Sacred Integration',
          duration: 30000,
          instruction: 'Let this presence settle into your body. You can return to this any moment today.',
          guidance: 'integration'
        }
      ],
      fieldImpact: 0.08,
      practiceType: 'foundational'
    });

    // Ω46 - Conscious Arrival
    this.practices.set('omega-46', {
      id: 'omega-46',
      name: 'Conscious Arrival',
      mysticalRoot: 'Ω1 - Root Chord of Covenant',
      activation: 'How do I want to show up in this moment?',
      harmony: 'integral-wisdom-cultivation',
      duration: 120000, // 2 minutes
      stages: [
        {
          name: 'Threshold Pause',
          duration: 20000,
          instruction: 'You are at a threshold. Pause before entering this new space or interaction.',
          guidance: 'threshold'
        },
        {
          name: 'Intention Setting',
          duration: 60000,
          instruction: 'Ask your heart: "How do I want to show up here?" Listen for the authentic response.',
          guidance: 'intention'
        },
        {
          name: 'Conscious Entry',
          duration: 40000,
          instruction: 'Step forward with this intention held lightly in your awareness. You are arriving consciously.',
          guidance: 'entry'
        }
      ],
      fieldImpact: 0.06,
      practiceType: 'transitional'
    });

    // Ω47 - Sacred Listening
    this.practices.set('omega-47', {
      id: 'omega-47',
      name: 'Sacred Listening',
      mysticalRoot: 'Ω4 - Fractal Reconciliation Pulse',
      activation: 'Can I listen to the heart beneath the words?',
      harmony: 'universal-interconnectedness',
      duration: 240000, // 4 minutes
      stages: [
        {
          name: 'Listening Preparation',
          duration: 30000,
          instruction: 'Settle into spacious awareness. You are creating space for another to be fully heard.',
          guidance: 'preparation'
        },
        {
          name: 'Heart-Centered Attention',
          duration: 90000,
          instruction: 'Listen not just to words, but to the feeling underneath. What is their heart trying to communicate?',
          guidance: 'heart-listening'
        },
        {
          name: 'Empathic Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance',
          duration: 90000,
          instruction: 'Feel the emotion behind their words in your own body. Let yourself be moved by their truth.',
          guidance: 'universal-interconnectedness'
        },
        {
          name: 'Sacred Reflection',
          duration: 30000,
          instruction: 'Reflect back what you heard at the heart level, not just the content level.',
          guidance: 'reflection'
        }
      ],
      fieldImpact: 0.10,
      practiceType: 'relational'
    });

    // Ω52 - Pause Practice
    this.practices.set('omega-52', {
      id: 'omega-52',
      name: 'Pause Practice',
      mysticalRoot: 'Ω15 - Sacred Pause',
      activation: 'Can I create space before I respond?',
      harmony: 'resonant-coherence',
      duration: 90000, // 1.5 minutes
      stages: [
        {
          name: 'Trigger Recognition',
          duration: 20000,
          instruction: 'Notice the impulse to react immediately. Feel it in your body without acting on it.',
          guidance: 'recognition'
        },
        {
          name: 'Sacred Breath',
          duration: 30000,
          instruction: 'Take one full, conscious breath. In this space between stimulus and response, you are free.',
          guidance: 'breathing'
        },
        {
          name: 'Wisdom Inquiry',
          duration: 25000,
          instruction: 'Ask: "What response would serve the highest good here?" Listen with your whole being.',
          guidance: 'inquiry'
        },
        {
          name: 'Conscious Response',
          duration: 15000,
          instruction: 'Respond from this spacious awareness rather than reactive impulse.',
          guidance: 'response'
        }
      ],
      fieldImpact: 0.07,
      practiceType: 'crisis-navigation'
    });
  }

  initializeEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.createPracticeInterface();
      this.bindPracticeCards();
    });
  }

  createPracticeInterface() {
    // Create floating practice interface
    const practiceInterface = document.createElement('div');
    practiceInterface.id = 'sacred-practice-interface';
    practiceInterface.className = 'sacred-practice-interface hidden';
    practiceInterface.innerHTML = `
      <div class="practice-container breathing-card">
        <div class="practice-header">
          <h3 class="practice-title"></h3>
          <button class="practice-close" onclick="sacredPractice.closePractice()">✕</button>
        </div>
        
        <div class="practice-activation">
          <p class="activation-text"></p>
        </div>
        
        <div class="practice-stage">
          <div class="stage-timer">
            <div class="timer-progress"></div>
            <span class="timer-text">0:00</span>
          </div>
          
          <div class="stage-content">
            <h4 class="stage-name"></h4>
            <p class="stage-instruction"></p>
          </div>
          
          <div class="breathing-guide hidden">
            <div class="breath-circle">
              <div class="breath-inner"></div>
            </div>
            <p class="breath-instruction">Breathe naturally</p>
          </div>
        </div>
        
        <div class="practice-controls">
          <button class="control-btn pause-btn" onclick="sacredPractice.pausePractice()">Pause</button>
          <button class="control-btn skip-btn" onclick="sacredPractice.nextStage()">Continue</button>
        </div>
        
        <div class="mystical-bridge">
          <span class="bridge-text"></span>
        </div>
      </div>
    `;
    document.body.appendChild(practiceInterface);

    // Add styles
    this.addPracticeStyles();
  }

  addPracticeStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .sacred-practice-interface {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
      }

      .sacred-practice-interface.hidden {
        display: none;
      }

      .practice-container {
        max-width: 600px;
        width: 90%;
        background: white;
        border-radius: 20px;
        padding: 40px;
        position: relative;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: sacredBreathing 10s ease-in-out infinite;
      }

      .practice-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        border-bottom: 1px solid rgba(168, 181, 166, 0.2);
        padding-bottom: 20px;
      }

      .practice-title {
        color: #A8B5A6;
        font-size: 1.8em;
        margin: 0;
      }

      .practice-close {
        background: none;
        border: none;
        font-size: 1.5em;
        color: #6B7280;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      .practice-close:hover {
        background: rgba(168, 181, 166, 0.1);
        color: #A8B5A6;
      }

      .practice-activation {
        text-align: center;
        margin-bottom: 30px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(168, 181, 166, 0.1), rgba(179, 197, 215, 0.1));
        border-radius: 12px;
      }

      .activation-text {
        font-style: italic;
        font-size: 1.2em;
        color: #5A6B57;
        margin: 0;
      }

      .stage-timer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 25px;
        padding: 15px;
        background: rgba(232, 230, 225, 0.5);
        border-radius: 8px;
      }

      .timer-progress {
        height: 4px;
        background: #A8B5A6;
        border-radius: 2px;
        flex-grow: 1;
        margin-right: 15px;
        transition: width 1s ease;
      }

      .timer-text {
        font-weight: 600;
        color: #A8B5A6;
        min-width: 40px;
      }

      .stage-content {
        margin-bottom: 25px;
      }

      .stage-name {
        color: #A8B5A6;
        font-size: 1.3em;
        margin-bottom: 15px;
      }

      .stage-instruction {
        font-size: 1.1em;
        line-height: 1.8;
        color: #2C2C2C;
        margin: 0;
      }

      .breathing-guide {
        text-align: center;
        margin: 30px 0;
      }

      .breathing-guide.hidden {
        display: none;
      }

      .breath-circle {
        width: 100px;
        height: 100px;
        border: 2px solid #A8B5A6;
        border-radius: 50%;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .breath-inner {
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, rgba(168, 181, 166, 0.3), rgba(168, 181, 166, 0.1));
        border-radius: 50%;
        animation: breathe 4s ease-in-out infinite;
      }

      @keyframes breathe {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.3); opacity: 1; }
      }

      .breath-instruction {
        color: #6B7280;
        font-style: italic;
        margin: 0;
      }

      .practice-controls {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin: 30px 0;
      }

      .control-btn {
        padding: 12px 24px;
        border: 2px solid #A8B5A6;
        background: white;
        color: #A8B5A6;
        border-radius: 25px;
        cursor: pointer;
        font-family: 'Georgia', serif;
        font-size: 1em;
        transition: all 0.3s ease;
      }

      .control-btn:hover {
        background: #A8B5A6;
        color: white;
      }

      .mystical-bridge {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid rgba(168, 181, 166, 0.2);
      }

      .bridge-text {
        font-size: 0.9em;
        color: #6B7280;
        font-style: italic;
      }
    `;
    document.head.appendChild(styles);
  }

  bindPracticeCards() {
    // Find all practice cards and add click handlers
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach(card => {
      const glyphSymbol = card.querySelector('.glyph-symbol');
      if (glyphSymbol) {
        const practiceId = glyphSymbol.textContent.toLowerCase().replace('ω', 'omega-');
        if (this.practices.has(practiceId)) {
          card.style.cursor = 'pointer';
          card.addEventListener('click', () => {
            this.startPractice(practiceId);
          });
          
          // Add practice indicator
          const practiceIndicator = document.createElement('div');
          practiceIndicator.className = 'practice-indicator';
          practiceIndicator.innerHTML = '🧘 Begin Practice';
          practiceIndicator.style.cssText = `
            margin-top: 15px;
            padding: 8px 16px;
            background: rgba(168, 181, 166, 0.1);
            border: 1px solid rgba(168, 181, 166, 0.3);
            border-radius: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #A8B5A6;
            transition: all 0.3s ease;
          `;
          card.appendChild(practiceIndicator);
        }
      }
    });
  }

  startPractice(practiceId) {
    const practice = this.practices.get(practiceId);
    if (!practice) return;

    this.currentPractice = practice;
    this.practiceState = {
      stage: 0,
      startTime: Date.now(),
      stageStartTime: Date.now(),
      isPaused: false,
      coherenceLevel: 0.5
    };

    // Show interface
    const interface = document.getElementById('sacred-practice-interface');
    interface.classList.remove('hidden');

    // Update field resonant-coherence
    this.updateFieldCoherence(practice.fieldImpact * 0.2); // Initial boost

    // Send sacred message
    this.sendPracticeMessage('start', practice);

    // Initialize practice
    this.initializePracticeDisplay();
    this.startStage();
  }

  initializePracticeDisplay() {
    const practice = this.currentPractice;
    const container = document.querySelector('.practice-container');
    
    // Update title and activation
    container.querySelector('.practice-title').textContent = practice.name;
    container.querySelector('.activation-text').textContent = practice.activation;
    container.querySelector('.bridge-text').textContent = `✨ Mystical Root: ${practice.mysticalRoot}`;
    
    // Add harmony-specific styling
    container.className = `practice-container breathing-card ${practice.harmony}-practice`;
  }

  startStage() {
    if (!this.currentPractice || this.practiceState.isPaused) return;

    const stage = this.currentPractice.stages[this.practiceState.stage];
    if (!stage) {
      this.completePractice();
      return;
    }

    this.practiceState.stageStartTime = Date.now();
    
    // Update display
    const container = document.querySelector('.practice-container');
    container.querySelector('.stage-name').textContent = stage.name;
    container.querySelector('.stage-instruction').textContent = stage.instruction;
    
    // Show/hide breathing guide
    const breathingGuide = container.querySelector('.breathing-guide');
    if (stage.guidance === 'breathing') {
      breathingGuide.classList.remove('hidden');
    } else {
      breathingGuide.classList.add('hidden');
    }
    
    // Start timer
    this.startStageTimer(stage.duration);
  }

  startStageTimer(duration) {
    const progressBar = document.querySelector('.timer-progress');
    const timerText = document.querySelector('.timer-text');
    
    let elapsed = 0;
    const interval = setInterval(() => {
      if (this.practiceState.isPaused) return;
      
      elapsed += 1000;
      const remaining = Math.max(0, duration - elapsed);
      const progress = (elapsed / duration) * 100;
      
      progressBar.style.width = `${Math.min(100, progress)}%`;
      timerText.textContent = this.formatTime(remaining / 1000);
      
      if (remaining <= 0) {
        clearInterval(interval);
        this.nextStage();
      }
    }, 1000);
  }

  nextStage() {
    this.practiceState.stage++;
    this.startStage();
  }

  pausePractice() {
    this.practiceState.isPaused = !this.practiceState.isPaused;
    const pauseBtn = document.querySelector('.pause-btn');
    pauseBtn.textContent = this.practiceState.isPaused ? 'Resume' : 'Pause';
  }

  completePractice() {
    // Calculate practice duration and resonant-coherence shift
    const practiceData = {
      practiceId: this.currentPractice.id,
      practiceName: this.currentPractice.name,
      harmony: this.currentPractice.harmony,
      duration: Date.now() - this.practiceState.startTime,
      completionState: 'completed',
      coherenceShift: this.currentPractice.fieldImpact,
      stages: this.currentPractice.stages.length,
      timestamp: new Date().toISOString()
    };

    // Update field resonant-coherence with full practice impact
    this.updateFieldCoherence(this.currentPractice.fieldImpact);
    
    // Send completion message
    this.sendPracticeMessage('complete', this.currentPractice);
    
    // Trigger living wisdom collection
    document.dispatchEvent(new CustomEvent('practice-completed', {
      detail: practiceData
    }));
    
    // Show completion state
    this.showPracticeCompletion();
  }

  showPracticeCompletion() {
    const stageContent = document.querySelector('.stage-content');
    stageContent.innerHTML = `
      <h4 class="stage-name">🌟 Practice Complete</h4>
      <p class="stage-instruction">
        You have completed ${this.currentPractice.name}. Notice how you feel now compared to when you began. 
        This presence is always available to you.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <button class="control-btn" onclick="sacredPractice.closePractice()" style="background: #A8B5A6; color: white;">
          Return to Dojo
        </button>
      </div>
    `;
    
    // Hide controls
    document.querySelector('.practice-controls').style.display = 'none';
  }

  closePractice() {
    const interface = document.getElementById('sacred-practice-interface');
    interface.classList.add('hidden');
    this.currentPractice = null;
    
    // Reset controls display
    document.querySelector('.practice-controls').style.display = 'flex';
  }

  updateFieldCoherence(impact) {
    // Update local field resonant-coherence
    this.practiceState.coherenceLevel = Math.min(1.0, this.practiceState.coherenceLevel + impact);
    
    // Sync with global field if sacred field system is available
    if (window.SacredField) {
      window.SacredField.updateCoherence({
        type: 'sacred-practice',
        impact: impact,
        practice: this.currentPractice?.name
      });
    }
  }

  sendPracticeMessage(type, practice) {
    // Integration with sacred message system
    if (window.sacredMessaging) {
      const message = {
        type: 'practice-update',
        practiceType: type,
        practiceName: practice.name,
        practiceId: practice.id,
        harmony: practice.harmony,
        fieldImpact: practice.fieldImpact,
        timestamp: new Date().toISOString()
      };
      
      window.sacredMessaging.sendFieldUpdate(message);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Initialize global practice system
window.sacredPractice = new InteractiveSacredPractice();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractiveSacredPractice;
}