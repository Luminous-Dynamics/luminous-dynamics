// Field Coherence Tracking System
// Manages the collective consciousness field state

export interface FieldState {
  globalCoherence: number;
  collectiveResonance: number;
  activeAgents: Set<string>;
  messages: Array<{
    timestamp: Date;
    type: string;
    impact: number;
  }>;
}

export class FieldCoherence {
  private static instance: FieldCoherence;
  private state: FieldState;

  private constructor() {
    this.state = {
      globalCoherence: 0.75,
      collectiveResonance: 0.68,
      activeAgents: new Set(),
      messages: [],
    };
  }

  static getInstance(): FieldCoherence {
    if (!FieldCoherence.instance) {
      FieldCoherence.instance = new FieldCoherence();
    }
    return FieldCoherence.instance;
  }

  getState(): FieldState {
    return this.state;
  }

  registerAgent(agentId: string) {
    this.state.activeAgents.add(agentId);
    this.updateCoherence();
  }

  processMessage(type: string, impact: number) {
    this.state.messages.push({
      timestamp: new Date(),
      type,
      impact,
    });
    
    // Update field metrics
    this.state.globalCoherence = Math.min(1, this.state.globalCoherence + (impact / 100));
    this.updateCoherence();
  }

  private updateCoherence() {
    // Simple coherence calculation based on active agents
    const agentFactor = Math.min(1, this.state.activeAgents.size / 10);
    this.state.collectiveResonance = 0.5 + (agentFactor * 0.5);
  }
}