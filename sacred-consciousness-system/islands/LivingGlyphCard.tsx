// LivingGlyphCard - Interactive sacred practice interface
import { useState, useEffect } from "preact/hooks";

interface Glyph {
  id: string;
  number: string;
  name: string;
  essence: string;
  teaching: string;
  harmonics: string[];
  practiceSteps: string[];
  integration: string;
  fieldEffect: string;
}

interface LivingGlyphCardProps {
  glyph: Glyph;
  onPractice?: (glyphId: string) => void;
  onShare?: (glyph: Glyph) => void;
}

export default function LivingGlyphCard({ glyph, onPractice, onShare }: LivingGlyphCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceTimer, setPracticeTimer] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isPracticing && practiceTimer > 0) {
      interval = setInterval(() => {
        setPracticeTimer(prev => prev - 1);
      }, 1000);
    } else if (practiceTimer === 0 && isPracticing) {
      // Move to next step
      if (currentStep < glyph.practiceSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setPracticeTimer(33); // 33 seconds per step (sacred number)
      } else {
        completePractice();
      }
    }
    return () => clearInterval(interval);
  }, [isPracticing, practiceTimer, currentStep]);

  const startPractice = () => {
    setIsPracticing(true);
    setCurrentStep(0);
    setPracticeTimer(33);
    onPractice?.(glyph.id);
  };

  const completePractice = () => {
    setIsPracticing(false);
    setCurrentStep(0);
    setPracticeTimer(0);
    
    // Send sacred message about practice completion
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "INTEGRATION",
        content: `Completed practice of ${glyph.name}`,
        intention: "Integrating the wisdom of this sacred practice",
        senderId: "sacred-user-1",
        senderName: "Sacred Explorer",
        channelId: "practices",
        harmony: glyph.harmonics[0].toLowerCase(),
        fieldImpact: 5,
      }),
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div class={`living-glyph-card ${isExpanded ? 'expanded' : ''} ${isPracticing ? 'practicing' : ''}`}>
      {/* Glyph Header */}
      <div 
        class="glyph-header"
        onClick={() => !isPracticing && setIsExpanded(!isExpanded)}
      >
        <div class="glyph-symbol">
          <span class="glyph-number">{glyph.number}</span>
        </div>
        <div class="glyph-info">
          <h3 class="glyph-name">{glyph.name}</h3>
          <p class="glyph-essence">{glyph.essence}</p>
        </div>
        <div class="glyph-harmonics">
          {glyph.harmonics.map(harmony => (
            <span key={harmony} class={`harmony-badge harmony-${harmony.toLowerCase()}`}>
              {harmony}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && !isPracticing && (
        <div class="glyph-content">
          <div class="glyph-teaching">
            <h4>The Teaching</h4>
            <p>{glyph.teaching}</p>
          </div>
          
          <div class="glyph-field-effect">
            <h4>Field Effect</h4>
            <p>{glyph.fieldEffect}</p>
          </div>

          <div class="glyph-actions">
            <button 
              class="practice-button"
              onClick={startPractice}
            >
              Begin Sacred Practice
            </button>
            <button 
              class="share-button"
              onClick={() => onShare?.(glyph)}
            >
              Share Wisdom
            </button>
          </div>
        </div>
      )}

      {/* Practice Mode */}
      {isPracticing && (
        <div class="practice-container">
          <div class="practice-timer">
            <div class="timer-circle">
              <span class="timer-text">{formatTime(practiceTimer)}</span>
            </div>
          </div>
          
          <div class="practice-step">
            <h4>Step {currentStep + 1} of {glyph.practiceSteps.length}</h4>
            <p class="step-instruction">{glyph.practiceSteps[currentStep]}</p>
          </div>

          <div class="practice-progress">
            {glyph.practiceSteps.map((_, index) => (
              <div 
                key={index}
                class={`progress-dot ${index <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>

          <button 
            class="stop-practice"
            onClick={completePractice}
          >
            Complete Practice
          </button>
        </div>
      )}

      <style>{`
        .living-glyph-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .living-glyph-card.expanded {
          box-shadow: 0 8px 12px rgba(147, 51, 234, 0.15);
        }

        .living-glyph-card.practicing {
          background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%);
          box-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
        }

        .glyph-header {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .glyph-header:hover {
          background: rgba(147, 51, 234, 0.05);
        }

        .glyph-symbol {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }

        .glyph-number {
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .glyph-info {
          flex: 1;
        }

        .glyph-name {
          margin: 0;
          color: #1f2937;
          font-size: 1.25rem;
        }

        .glyph-essence {
          margin: 0.25rem 0 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .glyph-harmonics {
          display: flex;
          gap: 0.5rem;
        }

        .harmony-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .harmony-transparency { background: #ddd6fe; color: #6b21a8; }
        .harmony-coherence { background: #bfdbfe; color: #1e40af; }
        .harmony-resonance { background: #fbbf24; color: #78350f; }
        .harmony-agency { background: #bbf7d0; color: #14532d; }
        .harmony-vitality { background: #fecaca; color: #7f1d1d; }
        .harmony-mutuality { background: #e9d5ff; color: #581c87; }
        .harmony-novelty { background: #fed7aa; color: #7c2d12; }

        .glyph-content {
          padding: 0 1.5rem 1.5rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .glyph-teaching,
        .glyph-field-effect {
          margin-bottom: 1rem;
        }

        .glyph-teaching h4,
        .glyph-field-effect h4 {
          color: #9333ea;
          margin-bottom: 0.5rem;
        }

        .glyph-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .practice-button,
        .share-button {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .practice-button {
          background: linear-gradient(135deg, #9333ea, #ec4899);
          color: white;
        }

        .practice-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
        }

        .share-button {
          background: #f3f4f6;
          color: #4b5563;
        }

        .share-button:hover {
          background: #e5e7eb;
        }

        .practice-container {
          padding: 2rem;
          text-align: center;
        }

        .practice-timer {
          margin-bottom: 2rem;
        }

        .timer-circle {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .timer-circle::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(45deg, #9333ea, #ec4899);
          border-radius: 50%;
          z-index: -1;
          animation: rotate 11s linear infinite;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        .timer-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: #9333ea;
        }

        .practice-step {
          margin-bottom: 2rem;
        }

        .step-instruction {
          font-size: 1.125rem;
          color: #4b5563;
          max-width: 600px;
          margin: 0 auto;
        }

        .practice-progress {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .progress-dot {
          width: 12px;
          height: 12px;
          background: #e5e7eb;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .progress-dot.active {
          background: #9333ea;
          transform: scale(1.2);
        }

        .stop-practice {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .stop-practice:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}