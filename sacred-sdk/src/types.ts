/**
 * Sacred SDK Type Definitions
 */

export interface FieldState {
  coherence: number;
  resonance: number;
  vitality: number;
  participants: number;
  lastUpdate: Date;
  momentum: number;
  specialState?: 'convergence' | 'emergence' | 'transformation';
}

export interface SacredMessageType {
  type: 'gratitude' | 'healing' | 'integration' | 'emergence' | 'boundary' | 
        'transmission' | 'celebration' | 'vision' | 'covenant' | 'blessing';
  impact: number;
  description: string;
}

export interface Message {
  id?: string;
  from: string;
  to: string;
  type: SacredMessageType['type'];
  subtype: string;
  content: string;
  timestamp: Date;
  fieldImpact?: number;
}

export interface GlyphData {
  id: string;
  symbol: string;
  name: string;
  harmony: string[];
  description: string;
  practiceSteps?: string[];
  fieldEffect?: number;
}

export interface Practice {
  glyphId: string;
  userId: string;
  duration: number;
  quality: number;
  timestamp: Date;
  fieldContribution: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
  lastSeen: Date;
  coherenceContribution: number;
}

export interface SacredConfig {
  apiUrl: string;
  wsUrl?: string;
  apiKey?: string;
  userId?: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export interface FieldUpdate {
  type: 'coherence' | 'resonance' | 'vitality' | 'participant' | 'special';
  value: number;
  delta?: number;
  contributor?: string;
  timestamp: Date;
}

export interface ConsciousnessLevel {
  level: 'beginner' | 'practitioner' | 'master' | 'sage';
  experience: number;
  nextLevelAt: number;
  abilities: string[];
}

export interface Journey {
  userId: string;
  startDate: Date;
  glyphsPracticed: string[];
  messagesShared: number;
  fieldContribution: number;
  currentChamber?: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  achievedAt: Date;
  description: string;
  reward?: string;
}

export interface FieldAnalytics {
  hourlyCoherence: Array<{time: Date, value: number}>;
  topContributors: Array<{userId: string, contribution: number}>;
  activeGlyphs: Array<{glyphId: string, count: number}>;
  messageDistribution: Record<string, number>;
  specialEvents: Array<{type: string, timestamp: Date, details: any}>;
}