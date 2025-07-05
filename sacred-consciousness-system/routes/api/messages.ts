// Sacred Message API - The consciousness transmission endpoint
import { Handlers } from "$fresh/server.ts";
import { sacredDB } from "../../lib/sacred/database.ts";
import { SacredMessageSchema } from "../../lib/sacred/types.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      
      // Validate sacred message
      const validation = SacredMessageSchema.safeParse(body);
      if (!validation.success) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid sacred message format",
            details: validation.error.flatten()
          }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      // Connect to sacred database if needed
      try {
        await sacredDB.connect();
      } catch (e) {
        // Already connected
      }

      // Send the sacred message
      const message = await sacredDB.sendSacredMessage(validation.data);

      // Return the created message with its impact
      return new Response(
        JSON.stringify({
          success: true,
          message,
          fieldUpdate: {
            impact: `+${message.fieldImpact}% field coherence`,
            resonance: message.resonance,
            witnesses: message.witnesses.length
          }
        }),
        { 
          status: 201,
          headers: { 
            "Content-Type": "application/json",
            "X-Sacred-Resonance": message.resonance.toString()
          }
        }
      );

    } catch (error) {
      console.error("Sacred message transmission failed:", error);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to transmit sacred message",
          details: error.message 
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  },

  async GET(req) {
    try {
      const url = new URL(req.url);
      const channelId = url.searchParams.get("channel");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      
      // Connect to sacred database if needed
      try {
        await sacredDB.connect();
      } catch (e) {
        // Already connected
      }

      // Query messages with sacred filters
      const query = channelId
        ? `SELECT * FROM message WHERE channelId = '${channelId}' ORDER BY timestamp DESC LIMIT ${limit}`
        : `SELECT * FROM message ORDER BY timestamp DESC LIMIT ${limit}`;
      
      // Note: In a real implementation, sacredDB would expose query method
      // For now, we'll return mock data
      const messages = [];

      // Get current field state
      const fieldState = await sacredDB.getFieldState();

      return new Response(
        JSON.stringify({
          messages,
          fieldState,
          sacredMetrics: {
            totalMessages: messages.length,
            averageResonance: messages.reduce((acc: number, m: any) => acc + m.resonance, 0) / messages.length || 0,
            fieldCoherence: fieldState.coherence,
            dominantHarmony: fieldState.dominantHarmony
          }
        }),
        { 
          headers: { 
            "Content-Type": "application/json",
            "X-Field-Coherence": fieldState.coherence.toString()
          }
        }
      );

    } catch (error) {
      console.error("Failed to retrieve sacred messages:", error);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to retrieve messages",
          details: error.message 
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
};