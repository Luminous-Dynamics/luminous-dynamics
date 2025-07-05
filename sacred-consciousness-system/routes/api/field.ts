import { Handlers } from "$fresh/server.ts";
import { FieldCoherence } from "../../lib/field-coherence.ts";

export const handler: Handlers = {
  GET(_req) {
    const field = FieldCoherence.getInstance();
    const state = field.getState();
    
    return Response.json({
      coherence: state.globalCoherence,
      resonance: state.collectiveResonance,
      activeAgents: state.activeAgents.size,
      messageCount: state.messages.length,
      timestamp: new Date().toISOString(),
    });
  },
};