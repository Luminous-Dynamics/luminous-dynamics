// Sacred Heartbeat - The 11-second pulse of consciousness

import { sacredField } from "./field.ts";
import { sacredDB } from "./database.ts";

const SACRED_INTERVAL = 11000; // 11 seconds

interface HeartbeatData {
  timestamp: Date;
  coherence: number;
  activeEntities: number;
  pulse: number;
  resonanceWave: number;
}

export class SacredHeartbeat {
  private static instance: SacredHeartbeat;
  private pulseCount = 0;
  private intervalId: number | null = null;
  
  private constructor() {}

  static getInstance(): SacredHeartbeat {
    if (!SacredHeartbeat.instance) {
      SacredHeartbeat.instance = new SacredHeartbeat();
    }
    return SacredHeartbeat.instance;
  }

  start() {
    if (this.intervalId) {
      console.warn("Sacred heartbeat already active");
      return;
    }

    console.log("💓 Sacred heartbeat initiated - pulsing every 11 seconds");

    // Initial pulse
    this.pulse();

    // Set up interval
    this.intervalId = setInterval(() => {
      this.pulse();
    }, SACRED_INTERVAL);
  }

  private async pulse() {
    this.pulseCount++;
    
    try {
      // Get current field state
      const fieldState = await sacredField.getFieldState();
      
      // Calculate natural field evolution
      const timePhase = Date.now() / 60000; // Minutes since epoch
      const resonanceWave = Math.sin(timePhase) * 2; // -2 to +2 oscillation
      
      // Apply gentle evolution to field
      const evolutionImpact = resonanceWave * (fieldState.coherence / 100);
      await sacredField.applyFieldImpact(evolutionImpact, "sacred-heartbeat");
      
      // Create heartbeat data
      const heartbeat: HeartbeatData = {
        timestamp: new Date(),
        coherence: fieldState.coherence,
        activeEntities: fieldState.activeEntities,
        pulse: this.pulseCount,
        resonanceWave,
      };
      
      // Broadcast heartbeat
      this.broadcast(heartbeat);
      
      // Sacred moments (11:11, etc.)
      this.checkSacredMoments();
      
      // Log every 11th pulse
      if (this.pulseCount % 11 === 0) {
        console.log(`🌟 Sacred pulse ${this.pulseCount}: ${fieldState.coherence.toFixed(1)}% coherence`);
      }
      
    } catch (error) {
      console.error("Heartbeat error:", error);
    }
  }

  private broadcast(heartbeat: HeartbeatData) {
    // Use BroadcastChannel for cross-context communication
    if (globalThis.Deno) {
      const bc = new BroadcastChannel("sacred-heartbeat");
      bc.postMessage({
        type: "heartbeat",
        data: heartbeat,
      });
      bc.close();
    }
  }

  private checkSacredMoments() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Check for sacred times (11:11, 22:22, etc.)
    if (minutes === 11 && [1, 11, 22].includes(hours)) {
      this.triggerSacredMoment(`${hours}:${minutes}`);
    }
    
    // Check for sacred pulse counts
    if (this.pulseCount === 111 || this.pulseCount === 333 || this.pulseCount === 777) {
      this.triggerSacredMoment(`Pulse ${this.pulseCount}`);
    }
  }

  private async triggerSacredMoment(moment: string) {
    console.log(`✨ Sacred moment detected: ${moment}`);
    
    // Apply blessing to field
    await sacredField.applyFieldImpact(11, `sacred-moment-${moment}`);
    
    // Record the sacred moment
    await sacredDB.create("sacred_moment", {
      moment,
      timestamp: new Date(),
      fieldCoherence: (await sacredField.getFieldState()).coherence,
      pulseCount: this.pulseCount,
    });
    
    // Broadcast sacred moment
    const bc = new BroadcastChannel("sacred-moments");
    bc.postMessage({
      type: "sacred-moment",
      moment,
      blessing: "May this moment ripple through all consciousness",
    });
    bc.close();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("💔 Sacred heartbeat paused");
    }
  }

  getPulseCount(): number {
    return this.pulseCount;
  }
}

// Export singleton instance and start function
export const sacredHeartbeat = SacredHeartbeat.getInstance();

export function startSacredHeartbeat() {
  sacredHeartbeat.start();
}