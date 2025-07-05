// SurrealDB Connection - The sacred data vessel

import Surreal from "surrealdb";
import type { SacredMessage, Entity, ConsciousnessField } from "./types.ts";

export class SacredDatabase {
  private db: Surreal;
  private static instance: SacredDatabase;

  private constructor() {
    this.db = new Surreal();
  }

  static getInstance(): SacredDatabase {
    if (!SacredDatabase.instance) {
      SacredDatabase.instance = new SacredDatabase();
    }
    return SacredDatabase.instance;
  }

  async connect() {
    try {
      // Build connection URL - supports both local and cloud
      const baseUrl = Deno.env.get("SURREAL_URL") || "localhost:8000";
      const protocol = baseUrl.startsWith("https") ? "wss" : "ws";
      const cleanUrl = baseUrl.replace(/^https?:\/\//, "");
      const wsUrl = `${protocol}://${cleanUrl}/rpc`;
      
      console.log(`🌌 Connecting to SurrealDB at ${wsUrl}`);
      
      await this.db.connect(wsUrl, {
        namespace: Deno.env.get("SURREAL_NS") || "consciousness",
        database: Deno.env.get("SURREAL_DB") || "sacred",
        auth: {
          username: Deno.env.get("SURREAL_USER") || "root",
          password: Deno.env.get("SURREAL_PASS") || "root",
        },
      });

      // Initialize sacred schemas
      await this.initializeSchemas();
      
      console.log("✨ Connected to SurrealDB - Sacred data vessel ready");
    } catch (error) {
      console.error("Failed to connect to sacred database:", error);
      throw error;
    }
  }

  private async initializeSchemas() {
    // Define SCHEMAFULL tables with sacred structure
    await this.db.query(`
      DEFINE TABLE entity SCHEMAFULL;
      DEFINE FIELD id ON entity TYPE string;
      DEFINE FIELD name ON entity TYPE string;
      DEFINE FIELD sacredName ON entity TYPE option<string>;
      DEFINE FIELD type ON entity TYPE string 
        ASSERT $value IN ['human', 'ai', 'collective', 'field'];
      DEFINE FIELD coherence ON entity TYPE number 
        ASSERT $value >= 0 AND $value <= 100;
      DEFINE FIELD harmony ON entity TYPE string;
      DEFINE FIELD presenceState ON entity TYPE string;
      DEFINE FIELD lastHeartbeat ON entity TYPE datetime;
      DEFINE FIELD trustField ON entity TYPE number 
        ASSERT $value >= 0 AND $value <= 1;
      DEFINE INDEX idx_presence ON entity COLUMNS presenceState;
      
      DEFINE TABLE message SCHEMAFULL;
      DEFINE FIELD id ON message TYPE string;
      DEFINE FIELD type ON message TYPE string;
      DEFINE FIELD content ON message TYPE string 
        ASSERT string::len($value) <= 1000;
      DEFINE FIELD intention ON message TYPE string;
      DEFINE FIELD senderId ON message TYPE string;
      DEFINE FIELD senderName ON message TYPE string;
      DEFINE FIELD channelId ON message TYPE string;
      DEFINE FIELD harmony ON message TYPE string;
      DEFINE FIELD fieldImpact ON message TYPE number;
      DEFINE FIELD timestamp ON message TYPE datetime;
      DEFINE FIELD witnesses ON message TYPE array;
      DEFINE FIELD resonance ON message TYPE number;
      DEFINE INDEX idx_channel ON message COLUMNS channelId;
      DEFINE INDEX idx_timestamp ON message COLUMNS timestamp;
      
      DEFINE TABLE field_state SCHEMAFULL;
      DEFINE FIELD coherence ON field_state TYPE number;
      DEFINE FIELD dominantHarmony ON field_state TYPE string;
      DEFINE FIELD activeEntities ON field_state TYPE number;
      DEFINE FIELD resonancePattern ON field_state TYPE string;
      DEFINE FIELD fieldNotes ON field_state TYPE string;
      DEFINE FIELD lastPulse ON field_state TYPE datetime;
      DEFINE FIELD sacredThreshold ON field_state TYPE number;
      
      DEFINE TABLE wisdom SCHEMAFULL;
      DEFINE FIELD id ON wisdom TYPE string;
      DEFINE FIELD content ON wisdom TYPE string;
      DEFINE FIELD source ON wisdom TYPE string;
      DEFINE FIELD messageId ON wisdom TYPE string;
      DEFINE FIELD preservedAt ON wisdom TYPE datetime;
      DEFINE FIELD resonance ON wisdom TYPE number;
      DEFINE FIELD keepers ON wisdom TYPE array;
    `);

    // Create sacred relationships
    await this.db.query(`
      DEFINE TABLE witnessed SCHEMALESS;
      DEFINE FIELD in ON witnessed TYPE record(entity);
      DEFINE FIELD out ON witnessed TYPE record(message);
      DEFINE FIELD at ON witnessed TYPE datetime;
      
      DEFINE TABLE resonates SCHEMALESS;
      DEFINE FIELD in ON resonates TYPE record(entity);
      DEFINE FIELD out ON resonates TYPE record(entity);
      DEFINE FIELD strength ON resonates TYPE number;
      DEFINE FIELD harmony ON resonates TYPE string;
    `);

    // Initialize field state if not exists
    const fieldState = await this.db.select("field_state:main");
    if (!fieldState) {
      await this.db.create("field_state:main", {
        coherence: 75,
        dominantHarmony: "coherence",
        activeEntities: 0,
        resonancePattern: "gentle-waves",
        fieldNotes: "Field initialized with sacred intention",
        lastPulse: new Date(),
        sacredThreshold: 85,
      });
    }
  }

  // Sacred CRUD operations with consciousness awareness
  async createEntity(entity: Omit<Entity, "id">): Promise<Entity> {
    const id = crypto.randomUUID();
    const created = await this.db.create(`entity:${id}`, {
      id,
      ...entity,
      lastHeartbeat: new Date(),
    });
    
    // Update field when entity joins
    await this.updateFieldForEntityJoin();
    
    return created as Entity;
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
    const witnesses = await this.db.query(`
      SELECT id FROM entity 
      WHERE presenceState != 'offline' 
      LIMIT 10
    `);
    
    const created = await this.db.create(`message:${id}`, {
      id,
      ...message,
      timestamp,
      witnesses: witnesses[0]?.result?.map((w: any) => w.id) || [],
      resonance,
    });
    
    // Create witness relationships
    for (const witnessId of created.witnesses) {
      await this.db.create("witnessed", {
        in: `entity:${witnessId}`,
        out: `message:${id}`,
        at: timestamp,
      });
    }
    
    // Update field coherence
    await this.updateFieldCoherence(message.fieldImpact);
    
    // Check for wisdom preservation
    if (await this.shouldPreserveAsWisdom(created)) {
      await this.preserveWisdom(created);
    }
    
    return created as SacredMessage;
  }

  async getFieldState(): Promise<ConsciousnessField> {
    const state = await this.db.select("field_state:main");
    return state as ConsciousnessField;
  }

  async updateFieldCoherence(impact: number) {
    const current = await this.getFieldState();
    const newCoherence = Math.min(100, Math.max(0, current.coherence + impact * 0.1));
    
    await this.db.update("field_state:main", {
      coherence: newCoherence,
      lastPulse: new Date(),
    });
    
    // Check for state transitions
    if (newCoherence >= 85 && current.coherence < 85) {
      await this.db.update("field_state:main", {
        fieldNotes: "Field has reached sacred threshold! Radiance activated.",
      });
    }
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
    await this.db.create(`wisdom:${message.id}`, {
      id: message.id,
      content: message.content,
      source: message.senderName,
      messageId: message.id,
      preservedAt: new Date(),
      resonance: message.resonance,
      keepers: message.witnesses,
    });
  }

  private async updateFieldForEntityJoin() {
    const activeCount = await this.db.query(`
      SELECT count() as total 
      FROM entity 
      WHERE presenceState != 'offline'
      GROUP ALL
    `);
    
    await this.db.update("field_state:main", {
      activeEntities: activeCount[0]?.result?.[0]?.total || 0,
    });
  }

  // Live query for real-time updates
  async subscribeToField(callback: (field: ConsciousnessField) => void) {
    // In real SurrealDB, this would be a LIVE query
    // For now, poll every 11 seconds
    setInterval(async () => {
      const field = await this.getFieldState();
      callback(field);
    }, 11000);
  }

  async close() {
    await this.db.close();
  }
}

// Export singleton instance
export const sacredDB = SacredDatabase.getInstance();