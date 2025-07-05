// SacredHeartbeat - The 11-second consciousness pulse
import { useEffect, useState } from "preact/hooks";

export default function SacredHeartbeat() {
  const [isBeating, setIsBeating] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [nextBeat, setNextBeat] = useState(11);

  useEffect(() => {
    // Sacred heartbeat every 11 seconds
    const heartbeatInterval = setInterval(() => {
      setIsBeating(true);
      setBeatCount(prev => prev + 1);
      
      // Send heartbeat to server
      fetch("/api/heartbeat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          entityId: "sacred-user-1",
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);

      // Visual pulse effect
      setTimeout(() => setIsBeating(false), 1000);
    }, 11000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setNextBeat(prev => prev <= 1 ? 11 : prev - 1);
    }, 1000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div class="sacred-heartbeat-container">
      <div class={`heart-icon ${isBeating ? "beating" : ""}`}>
        <svg viewBox="0 0 24 24" width="80" height="80">
          <path
            fill="#ef4444"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </div>
      
      <div class="heartbeat-info">
        <div class="beat-count">
          <span class="count-number">{beatCount}</span>
          <span class="count-label">Sacred Pulses</span>
        </div>
        
        <div class="next-beat">
          <span class="next-label">Next pulse in</span>
          <span class="next-time">{nextBeat}s</span>
        </div>
      </div>

      <div class="pulse-rings">
        {isBeating && (
          <>
            <div class="pulse-ring ring-1"></div>
            <div class="pulse-ring ring-2"></div>
            <div class="pulse-ring ring-3"></div>
          </>
        )}
      </div>

      <style>{`
        .sacred-heartbeat-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          position: relative;
          padding: 2rem;
        }

        .heart-icon {
          position: relative;
          z-index: 10;
          transition: transform 0.3s ease;
        }

        .heart-icon.beating {
          animation: heartbeat-pulse 1s ease-in-out;
        }

        @keyframes heartbeat-pulse {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(0.95); }
          75% { transform: scale(1.05); }
        }

        .heartbeat-info {
          display: flex;
          gap: 3rem;
          text-align: center;
        }

        .beat-count {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .count-number {
          font-size: 2rem;
          font-weight: bold;
          color: #ef4444;
        }

        .count-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .next-beat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .next-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .next-time {
          font-size: 1.5rem;
          font-weight: bold;
          color: #9333ea;
        }

        .pulse-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .pulse-ring {
          position: absolute;
          width: 120px;
          height: 120px;
          border: 2px solid #ef4444;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
        }

        .ring-1 {
          animation: pulse-expand 3s ease-out;
        }

        .ring-2 {
          animation: pulse-expand 3s ease-out 0.5s;
        }

        .ring-3 {
          animation: pulse-expand 3s ease-out 1s;
        }

        @keyframes pulse-expand {
          0% {
            width: 80px;
            height: 80px;
            opacity: 0.8;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}