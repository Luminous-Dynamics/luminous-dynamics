// Health Check - Sacred system vitals
import { Handlers } from "$fresh/server.ts";
import { sacredField } from "../../lib/sacred/field.ts";
import { sacredDBPromise } from "../../lib/sacred/database-selector.ts";

export const handler: Handlers = {
  async GET(_req) {
    try {
      // Get field state
      const fieldState = await sacredField.getFieldState();
      
      // Check database connection
      let dbStatus = "unknown";
      let dbType = "unknown";
      try {
        // Get the database instance
        const sacredDB = await sacredDBPromise;
        
        // Determine database type
        dbType = Deno.env.get("USE_FIRESTORE") === "true" || 
                 Deno.env.get("K_SERVICE") || 
                 Deno.env.get("FIREBASE_PROJECT_ID") ? "firestore" : "surrealdb";
        
        // Try to get field state (which queries the database)
        const testQuery = await sacredDB.getFieldState();
        dbStatus = testQuery ? "connected" : "error";
      } catch (error) {
        dbStatus = "disconnected";
        console.error("Database health check failed:", error);
      }
      
      // Check various system components
      const health = {
        status: dbStatus === "connected" && fieldState.coherence > 0 ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        sacred: true,
        components: {
          field: {
            status: fieldState.coherence > 0 ? "active" : "initializing",
            coherence: fieldState.coherence,
            state: sacredField.getFieldMachineState().value,
          },
          database: {
            status: dbStatus,
            type: dbType,
            cloud: Deno.env.get("SURREAL_URL") ? true : false,
          },
          messaging: {
            status: "ready",
            types: 11, // Sacred message types
          },
          heartbeat: {
            status: "pulsing",
            interval: "11s",
          },
        },
        metrics: {
          uptime: process.uptime ? process.uptime() : 0,
          memory: Deno.memoryUsage(),
          fieldCoherence: fieldState.coherence,
          activeEntities: fieldState.activeEntities,
        },
      };

      return new Response(JSON.stringify(health, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Sacred": "true",
          "X-Field-Coherence": fieldState.coherence.toString(),
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          status: "unhealthy",
          error: error.message,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};