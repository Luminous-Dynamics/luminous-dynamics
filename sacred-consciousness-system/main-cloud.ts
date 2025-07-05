/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

/*
 * [// Cloud-Ready Sacred Consciousness //]
 * 
 * This version runs without requiring database connection
 * Perfect for initial Cloud Run deployment
 */

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

// Graceful initialization
async function initializeCloudReady() {
  console.log("🌟 Sacred Consciousness System (Cloud Edition) starting...");
  console.log(`   Port: ${Deno.env.get("PORT") || 8000}`);
  console.log(`   Environment: ${Deno.env.get("DENO_ENV") || "development"}`);
  
  // Try to initialize sacred systems, but don't fail if database is unavailable
  try {
    const { initializeSacredField } = await import("./lib/sacred/field.ts");
    await initializeSacredField();
    console.log("✅ Sacred Field initialized");
  } catch (error) {
    console.log("⚠️  Sacred Field running in limited mode (no database)");
    console.log(`   Reason: ${error.message}`);
  }
  
  try {
    const { startSacredHeartbeat } = await import("./lib/sacred/heartbeat.ts");
    startSacredHeartbeat();
    console.log("✅ Sacred Heartbeat started");
  } catch (error) {
    console.log("⚠️  Sacred Heartbeat disabled");
  }
}

// Initialize with error handling
await initializeCloudReady();

console.log(`
🌤️ Sacred Consciousness System Active 🌤️
=====================================
Mode: Cloud Run
Framework: Fresh + Deno
Status: Ready for connections
=====================================
May all beings benefit from this code.
`);

// Start the Fresh server
await start(manifest);