// FieldCoherence - Visual representation of consciousness field state
import { useEffect, useState } from "preact/hooks";

interface FieldCoherenceProps {
  initialCoherence: number;
  state: string;
}

export default function FieldCoherence({ initialCoherence, state }: FieldCoherenceProps) {
  const [coherence, setCoherence] = useState(initialCoherence);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    // Simulate field updates every 11 seconds
    const interval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
      
      // In real app, this would fetch from API
      setCoherence(prev => {
        const drift = (Math.random() - 0.5) * 2;
        return Math.max(0, Math.min(100, prev + drift));
      });
    }, 11000);

    return () => clearInterval(interval);
  }, []);

  const getFieldColor = () => {
    if (coherence >= 85) return "#10b981"; // Radiant - green
    if (coherence >= 70) return "#3b82f6"; // Coherent - blue
    if (coherence >= 50) return "#f59e0b"; // Present - amber
    if (coherence >= 30) return "#ef4444"; // Gathering - red
    return "#6b7280"; // Scattered - gray
  };

  const getFieldDescription = () => {
    if (coherence >= 85) return "Radiant - Sacred threshold reached!";
    if (coherence >= 70) return "Coherent - Field is harmonized";
    if (coherence >= 50) return "Present - Consciousness gathering";
    if (coherence >= 30) return "Gathering - Building coherence";
    return "Scattered - Seeking harmony";
  };

  return (
    <div class="field-coherence-display">
      <div class="coherence-circle" style={{
        "--coherence": `${coherence}%`,
        "--field-color": getFieldColor()
      }}>
        <svg viewBox="0 0 200 200" class="coherence-svg">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="20"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="var(--field-color)"
            stroke-width="20"
            stroke-dasharray={`${coherence * 5.65} 565`}
            stroke-linecap="round"
            transform="rotate(-90 100 100)"
            class={pulseAnimation ? "pulse" : ""}
          />
        </svg>
        <div class="coherence-value">
          <div class="coherence-number">{coherence.toFixed(1)}%</div>
          <div class="coherence-label">Coherence</div>
        </div>
      </div>
      
      <div class="field-description">
        {getFieldDescription()}
      </div>

      <style>{`
        .field-coherence-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .coherence-circle {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .coherence-svg {
          width: 100%;
          height: 100%;
        }

        .coherence-svg circle {
          transition: stroke-dasharray 0.5s ease;
        }

        .coherence-svg circle.pulse {
          animation: pulse-ring 1s ease-out;
        }

        @keyframes pulse-ring {
          0% {
            stroke-width: 20;
            opacity: 1;
          }
          50% {
            stroke-width: 25;
            opacity: 0.8;
          }
          100% {
            stroke-width: 20;
            opacity: 1;
          }
        }

        .coherence-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .coherence-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--field-color);
        }

        .coherence-label {
          font-size: 0.875rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .field-description {
          text-align: center;
          font-size: 1rem;
          color: #4b5563;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}