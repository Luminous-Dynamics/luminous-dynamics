// Database Selector - Choose the sacred vessel based on environment
// This allows seamless switching between SurrealDB (local) and Firestore (cloud)

import type { SacredDatabase } from "./database.ts";

// Dynamic import based on environment
export async function getSacredDatabase(): Promise<SacredDatabase> {
  const useFirestore = Deno.env.get("USE_FIRESTORE") === "true" || 
                      Deno.env.get("K_SERVICE") || // Cloud Run environment
                      Deno.env.get("FIREBASE_PROJECT_ID");
  
  if (useFirestore) {
    console.log("🔥 Using Firestore for sacred data");
    const { sacredDB } = await import("./database-firestore.ts");
    return sacredDB;
  } else {
    console.log("🌊 Using SurrealDB for sacred data");
    const { sacredDB } = await import("./database.ts");
    return sacredDB;
  }
}

// Export a promise that resolves to the database
export const sacredDBPromise = getSacredDatabase();