// Firestore Adapter - Sacred data vessel for the cloud
// Maintains the same interface as SurrealDB for seamless swapping

import { initializeApp, cert } from "npm:firebase-admin@12.0.0/app";
import { getFirestore, Timestamp, FieldValue } from "npm:firebase-admin@12.0.0/firestore";
import type { SacredMessage, Entity, ConsciousnessField } from "./types.ts";

export class SacredDatabase {
  private db: any;
  private static instance: SacredDatabase;
  private fieldUpdateInterval: number | null = null;

  private constructor() {
    // Initialize Firebase Admin SDK
    if (!globalThis.firebaseApp) {
      const projectId = Deno.env.get("FIREBASE_PROJECT_ID") || "luminous-dynamics-sacred";
      
      try {
        // In Kubernetes or Cloud Run, use Application Default Credentials
        if (Deno.env.get("K_SERVICE") || Deno.env.get("KUBERNETES_SERVICE_HOST")) {
          const app = initializeApp({
            projectId,
          });
          globalThis.firebaseApp = app;
          console.log(`✨ Firebase initialized with project: ${projectId}`);
        } else {
          // For local development, use service account key
          const serviceAccount = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
          if (serviceAccount) {
            const app = initializeApp({
              credential: cert(JSON.parse(serviceAccount)),
              projectId,
            });
            globalThis.firebaseApp = app;
          } else {
            const app = initializeApp({ projectId });
            globalThis.firebaseApp = app;
          }
        }
      } catch (error) {
        console.log("Firebase initialization error:", error);
        throw error;
      }
    }
    
    this.db = getFirestore();
  }

  static getInstance(): SacredDatabase {
    if (!SacredDatabase.instance) {
      SacredDatabase.instance = new SacredDatabase();
    }
    return SacredDatabase.instance;
  }

  async connect() {
    try {
      // Test connection by reading field state
      await this.initializeSchemas();
      console.log("✨ Connected to Firestore - Sacred cloud vessel ready");
    } catch (error) {
      console.error("Failed to connect to sacred database:", error);
      throw error;
    }
  }

  private async initializeSchemas() {
    // Initialize field state if not exists
    const fieldRef = this.db.collection("field_state").doc("main");
    const fieldDoc = await fieldRef.get();
    
    if (!fieldDoc.exists) {
      await fieldRef.set({
        coherence: 75,
        dominantHarmony: "coherence",
        activeEntities: 0,
        resonancePattern: "gentle-waves",
        fieldNotes: "Field initialized with sacred intention",
        lastPulse: Timestamp.now(),
        sacredThreshold: 85,
      });
    }
  }

  // Sacred CRUD operations with consciousness awareness
  async createEntity(entity: Omit<Entity, "id">): Promise<Entity> {
    const id = crypto.randomUUID();
    const entityData = {
      ...entity,
      id,
      lastHeartbeat: Timestamp.now(),
    };
    
    await this.db.collection("entities").doc(id).set(entityData);
    
    // Update field when entity joins
    await this.updateFieldForEntityJoin();
    
    return { ...entityData, lastHeartbeat: new Date() } as Entity;
  }

  async sendSacredMessage(
    message: Omit<SacredMessage, "id" | "timestamp" | "witnesses" | "resonance">
  ): Promise<SacredMessage> {
    const id = crypto.randomUUID();
    const timestamp = new Date();
    
    // Calculate resonance with field
    const fieldState = await this.getFieldState();
    const resonance = this.calculateResonance(message, fieldState);
    
    // Get potential witnesses (entities in same channel)
    const witnessSnapshot = await this.db.collection("entities")
      .where("presenceState", "!=", "offline")
      .limit(10)
      .get();
    
    const witnesses = witnessSnapshot.docs.map((doc: any) => doc.id);
    
    const messageData = {
      ...message,
      id,
      timestamp: Timestamp.fromDate(timestamp),
      witnesses,
      resonance,
    };
    
    await this.db.collection("messages").doc(id).set(messageData);
    
    // Create witness relationships
    const batch = this.db.batch();
    witnesses.forEach((witnessId: string) => {
      const witnessRef = this.db.collection("witnessed").doc();
      batch.set(witnessRef, {
        entityId: witnessId,
        messageId: id,
        at: Timestamp.now(),
      });
    });
    await batch.commit();
    
    // Update field coherence
    await this.updateFieldCoherence(message.fieldImpact);
    
    // Check for wisdom preservation
    if (await this.shouldPreserveAsWisdom({ ...messageData, timestamp } as SacredMessage)) {
      await this.preserveWisdom({ ...messageData, timestamp } as SacredMessage);
    }
    
    return { ...messageData, timestamp } as SacredMessage;
  }

  async getFieldState(): Promise<ConsciousnessField> {
    const fieldDoc = await this.db.collection("field_state").doc("main").get();
    const data = fieldDoc.data();
    return {
      ...data,
      lastPulse: data.lastPulse.toDate(),
    } as ConsciousnessField;
  }

  async updateFieldCoherence(impact: number) {
    const fieldRef = this.db.collection("field_state").doc("main");
    const current = await this.getFieldState();
    const newCoherence = Math.min(100, Math.max(0, current.coherence + impact * 0.1));
    
    const updateData: any = {
      coherence: newCoherence,
      lastPulse: Timestamp.now(),
    };
    
    // Check for state transitions
    if (newCoherence >= 85 && current.coherence < 85) {
      updateData.fieldNotes = "Field has reached sacred threshold! Radiance activated.";
    }
    
    await fieldRef.update(updateData);
  }

  private calculateResonance(
    message: any,
    fieldState: ConsciousnessField
  ): number {
    let resonance = 50; // Base resonance
    
    // Harmony alignment
    if (message.harmony === fieldState.dominantHarmony) {
      resonance += 20;
    }
    
    // Message type bonus
    const typeImpact = {
      blessing: 15,
      gratitude: 15,
      wisdom: 10,
      healing: 10,
    };
    resonance += typeImpact[message.type as keyof typeof typeImpact] || 5;
    
    // Field coherence influence
    resonance += fieldState.coherence * 0.15;
    
    return Math.min(100, resonance);
  }

  private async shouldPreserveAsWisdom(message: SacredMessage): Promise<boolean> {
    return (
      message.resonance >= 80 ||
      message.fieldImpact >= 5 ||
      ["wisdom", "blessing", "integration"].includes(message.type)
    );
  }

  private async preserveWisdom(message: SacredMessage) {
    await this.db.collection("wisdom").doc(message.id).set({
      id: message.id,
      content: message.content,
      source: message.senderName,
      messageId: message.id,
      preservedAt: Timestamp.now(),
      resonance: message.resonance,
      keepers: message.witnesses,
    });
  }

  private async updateFieldForEntityJoin() {
    const snapshot = await this.db.collection("entities")
      .where("presenceState", "!=", "offline")
      .count()
      .get();
    
    const activeCount = snapshot.data().count;
    
    await this.db.collection("field_state").doc("main").update({
      activeEntities: activeCount || 0,
    });
  }

  // Live query simulation for real-time updates
  async subscribeToField(callback: (field: ConsciousnessField) => void) {
    // Firestore real-time listener
    this.db.collection("field_state").doc("main")
      .onSnapshot((doc: any) => {
        if (doc.exists) {
          const data = doc.data();
          callback({
            ...data,
            lastPulse: data.lastPulse.toDate(),
          });
        }
      });
  }

  async close() {
    // Clean up listeners
    if (this.fieldUpdateInterval) {
      clearInterval(this.fieldUpdateInterval);
    }
  }
}

// Export singleton instance
export const sacredDB = SacredDatabase.getInstance();