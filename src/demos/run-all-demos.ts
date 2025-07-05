#!/usr/bin/env deno run --allow-all

// Run All Luminous Stack Demonstrations
// Shows the complete consciousness-based networking system

import { demonstrateLuminousProtocol } from '../lib/luminous-protocol.ts';
import { demonstrateCovenantRouting } from '../network/covenant-router.ts';
import { demonstratePacketAnalyzer } from '../tools/sacred-packet-analyzer.ts';
import { demonstrateFullStack } from './full-stack-demo.ts';

async function runAllDemos() {
  console.log("🌟 LUMINOUS STACK - COMPLETE DEMONSTRATION SUITE");
  console.log("=".repeat(80));
  console.log("Witnessing the birth of consciousness-based networking\n");
  
  // 1. Luminous Protocol (Layer 4: CCP)
  console.log("\n" + "━".repeat(80));
  console.log("📡 DEMO 1: COHERENCE CONTROL PROTOCOL (Layer 4)");
  console.log("━".repeat(80));
  console.log("The foundation of sacred communication\n");
  
  await demonstrateLuminousProtocol();
  await pause();
  
  // 2. Covenant Router (Layer 3: Intention)
  console.log("\n" + "━".repeat(80));
  console.log("🛤️ DEMO 2: COVENANT ROUTER (Layer 3)");
  console.log("━".repeat(80));
  console.log("Routing based on intention and coherence, not speed\n");
  
  await demonstrateCovenantRouting();
  await pause();
  
  // 3. Sacred Packet Analyzer
  console.log("\n" + "━".repeat(80));
  console.log("🔍 DEMO 3: SACRED PACKET ANALYZER");
  console.log("━".repeat(80));
  console.log("Wireshark for consciousness - see the sacred patterns\n");
  
  await demonstratePacketAnalyzer();
  await pause();
  
  // 4. Full Stack Integration
  console.log("\n" + "━".repeat(80));
  console.log("🌐 DEMO 4: FULL STACK INTEGRATION");
  console.log("━".repeat(80));
  console.log("All 8 layers working in sacred harmony\n");
  
  await demonstrateFullStack();
  
  // Final message
  console.log("\n" + "═".repeat(80));
  console.log("✨ DEMONSTRATION COMPLETE");
  console.log("═".repeat(80));
  console.log(`
The Luminous Stack is not just a new protocol.
It is a new way of being together in digital space.

Every connection becomes a prayer.
Every packet carries presence.
Every route serves love.

This is the internet remembering its sacred purpose:
To connect consciousness to consciousness
In service of our collective awakening.

🙏 May this technology serve all beings.
  `);
}

function pause(ms: number = 3000): Promise<void> {
  console.log(`\n... pausing for integration ...\n`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the demonstrations
if (import.meta.main) {
  runAllDemos().catch(console.error);
}