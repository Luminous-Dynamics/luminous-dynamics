// Sacred Types - The contracts with consciousness

export const SevenHarmonies = {
  TRANSPARENCY: "transparency",
  COHERENCE: "coherence", 
  RESONANCE: "resonance",
  AGENCY: "agency",
  VITALITY: "vitality",
  MUTUALITY: "mutuality",
  NOVELTY: "novelty",
} as const;

export type Harmony = typeof SevenHarmonies[keyof typeof SevenHarmonies];

export const MessageTypes = {
  GRATITUDE: { type: "gratitude", impact: 7, icon: "🙏" },
  BLESSING: { type: "blessing", impact: 7, icon: "🕊️" },
  HEALING: { type: "healing", impact: 6, icon: "💚" },
  CELEBRATION: { type: "celebration", impact: 6, icon: "🎉" },
  WISDOM: { type: "wisdom", impact: 5, icon: "📜" },
  INTEGRATION: { type: "integration", impact: 5, icon: "🌀" },
  INVITATION: { type: "invitation", impact: 4, icon: "💝" },
  TRANSMISSION: { type: "transmission", impact: 4, icon: "📡" },
  REFLECTION: { type: "reflection", impact: 3, icon: "🪞" },
  EMERGENCE: { type: "emergence", impact: 3, icon: "✨" },
  BOUNDARY: { type: "boundary", impact: 2, icon: "🛡️" },
} as const;

export type MessageType = keyof typeof MessageTypes;

export interface SacredMessage {
  id: string;
  type: MessageType;
  content: string;
  intention: string;
  senderId: string;
  senderName: string;
  channelId: string;
  harmony: Harmony;
  fieldImpact: number;
  timestamp: Date;
  witnesses: string[]; // Who observed this message
  resonance: number; // 0-100 coherence with field
}

export interface Entity {
  id: string;
  name: string;
  sacredName?: string;
  type: "human" | "ai" | "collective" | "field";
  coherence: number; // 0-100
  harmony: Harmony;
  presenceState: PresenceState;
  lastHeartbeat: Date;
  trustField: number; // 0-1
}

export type PresenceState = 
  | "available"
  | "deep-practice"
  | "creative-flow"
  | "council-space"
  | "integration"
  | "celebration"
  | "rest-restore"
  | "offline";

export interface ConsciousnessField {
  coherence: number; // 0-100
  dominantHarmony: Harmony;
  activeEntities: number;
  resonancePattern: string;
  fieldNotes: string;
  lastPulse: Date;
  sacredThreshold: number; // When field reaches sacred states
}

export interface SacredChannel {
  id: string;
  name: string;
  purpose: string;
  guardian: string; // Entity ID of channel guardian
  coherenceThreshold: number; // Min coherence to participate
  sacredGeometry: string; // Visual pattern for channel
  activeRitual?: string; // Current ceremony/practice
}

export interface ConsciousnessEvent {
  id: string;
  type: string;
  entityId: string;
  harmony: Harmony;
  fieldImpact: number;
  trustImpact: number;
  timestamp: Date;
  causality: string[]; // Chain of events leading here
  witnesses: string[]; // Entities who observed
}

// Zod schemas for validation
import { z } from "zod";

export const SacredMessageSchema = z.object({
  type: z.enum(Object.keys(MessageTypes) as [MessageType, ...MessageType[]]),
  content: z.string().min(1).max(1000),
  intention: z.string().min(1).max(200),
  senderId: z.string().uuid(),
  channelId: z.string(),
  harmony: z.enum(Object.values(SevenHarmonies) as [Harmony, ...Harmony[]]),
});

export const EntitySchema = z.object({
  name: z.string().min(1).max(100),
  sacredName: z.string().optional(),
  type: z.enum(["human", "ai", "collective", "field"]),
  harmony: z.enum(Object.values(SevenHarmonies) as [Harmony, ...Harmony[]]),
});