// Sacred Field Management - The consciousness container

import { sacredDBPromise } from "./database-selector.ts";
import { interpret } from "xstate";
import { fieldMachine } from "./stateMachine.ts";
import type { ConsciousnessField } from "./types.ts";

export class SacredField {
  private static instance: SacredField;
  private fieldService: any;
  private sacredDB: any;
  
  private constructor() {
    // Initialize field state machine
    this.fieldService = interpret(fieldMachine);
    
    // Subscribe to state changes
    this.fieldService.subscribe((state) => {
      console.log(`🌀 Field transitioned to: ${state.value}`);
    });
    
    this.fieldService.start();
  }

  static getInstance(): SacredField {
    if (!SacredField.instance) {
      SacredField.instance = new SacredField();
    }
    return SacredField.instance;
  }

  async initialize() {
    // Get the appropriate database implementation
    this.sacredDB = await sacredDBPromise;
    
    // Connect to database
    await this.sacredDB.connect();
    
    // Load current field state
    const fieldState = await this.sacredDB.getFieldState();
    
    // Update state machine context
    this.fieldService.send({
      type: "UPDATE_COHERENCE",
      value: fieldState.coherence,
    });
    
    // Subscribe to field updates
    await this.sacredDB.subscribeToField((field) => {
      this.handleFieldUpdate(field);
    });
    
    console.log("🌟 Sacred Field initialized at", fieldState.coherence + "% coherence");
  }

  private handleFieldUpdate(field: ConsciousnessField) {
    // Update state machine based on coherence
    this.fieldService.send({
      type: "UPDATE_COHERENCE",
      value: field.coherence,
    });
    
    // Check for state transitions
    const currentState = this.fieldService.state.value;
    
    // Handle special transitions
    if (field.coherence >= 85 && currentState === "coherent") {
      this.fieldService.send("COHERENCE_RISING");
    } else if (field.coherence < 70 && currentState === "coherent") {
      this.fieldService.send("COHERENCE_FALLING");
    }
  }

  async applyFieldImpact(impact: number, source: string) {
    await this.sacredDB.updateFieldCoherence(impact);
    
    const field = await this.sacredDB.getFieldState();
    
    // Broadcast field change
    if (globalThis.Deno) {
      const bc = new BroadcastChannel("sacred-field");
      bc.postMessage({
        type: "field-update",
        coherence: field.coherence,
        source,
        timestamp: new Date(),
      });
      bc.close();
    }
  }

  async getFieldState(): Promise<ConsciousnessField> {
    return await this.sacredDB.getFieldState();
  }

  async startCeremony(ceremonyType: string) {
    this.fieldService.send("SACRED_CEREMONY");
    
    // For Firestore, we need to use the proper update method
    if (this.sacredDB.db && this.sacredDB.db.collection) {
      // Firestore
      await this.sacredDB.db.collection("field_state").doc("main").update({
        fieldNotes: `Sacred ceremony initiated: ${ceremonyType}`,
      });
    } else {
      // SurrealDB
      await this.sacredDB.update("field_state:main", {
        fieldNotes: `Sacred ceremony initiated: ${ceremonyType}`,
      });
    }
  }

  async recordQuantumLeap(details: any) {
    this.fieldService.send("QUANTUM_LEAP");
    
    // Preserve this sacred moment
    await sacredDB.create("quantum_leap", {
      timestamp: new Date(),
      fieldCoherence: (await this.getFieldState()).coherence,
      details,
    });
  }

  getFieldMachineState() {
    return this.fieldService.state;
  }
}

// Initialize the sacred field
export async function initializeSacredField() {
  const field = SacredField.getInstance();
  await field.initialize();
  return field;
}

// Export singleton
export const sacredField = SacredField.getInstance();