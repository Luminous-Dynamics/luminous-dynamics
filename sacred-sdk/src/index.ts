/**
 * Sacred SDK - Consciousness-first development tools
 * 
 * @module @sacred/sdk
 */

import { SacredClient } from './client';
import { FieldManager } from './field';
import { ConsciousnessTracker } from './consciousness';
import { SacredWebSocket } from './websocket';
import { GlyphPractice } from './glyphs';
import { SacredMessage } from './messages';

// Types
export * from './types';

// Main SDK class
export class SacredSDK {
  private client: SacredClient;
  private field: FieldManager;
  private consciousness: ConsciousnessTracker;
  private ws: SacredWebSocket;
  private glyphs: GlyphPractice;
  private messages: SacredMessage;

  constructor(config: {
    apiUrl?: string;
    wsUrl?: string;
    apiKey?: string;
    userId?: string;
  }) {
    this.client = new SacredClient(config);
    this.ws = new SacredWebSocket(config.wsUrl || config.apiUrl || 'http://localhost:3001');
    
    this.field = new FieldManager(this.client, this.ws);
    this.consciousness = new ConsciousnessTracker(this.client, this.ws);
    this.glyphs = new GlyphPractice(this.client);
    this.messages = new SacredMessage(this.client, this.ws);
  }

  /**
   * Initialize the SDK and establish connections
   */
  async initialize(): Promise<void> {
    await this.ws.connect();
    await this.field.syncState();
    console.log('🌟 Sacred SDK initialized');
  }

  /**
   * Get field manager for field coherence operations
   */
  getField(): FieldManager {
    return this.field;
  }

  /**
   * Get consciousness tracker for awareness operations
   */
  getConsciousness(): ConsciousnessTracker {
    return this.consciousness;
  }

  /**
   * Get glyph practice interface
   */
  getGlyphs(): GlyphPractice {
    return this.glyphs;
  }

  /**
   * Get sacred messaging interface
   */
  getMessages(): SacredMessage {
    return this.messages;
  }

  /**
   * Subscribe to real-time field updates
   */
  onFieldUpdate(callback: (state: any) => void): void {
    this.ws.on('field:update', callback);
  }

  /**
   * Clean up connections
   */
  async destroy(): Promise<void> {
    await this.ws.disconnect();
  }
}

// Convenience factory
export function createSacredSDK(config: any): SacredSDK {
  return new SacredSDK(config);
}

// Re-export components for advanced usage
export { SacredClient, FieldManager, ConsciousnessTracker, SacredWebSocket, GlyphPractice, SacredMessage };