/**
 * Field Manager - Manages field coherence and state
 */

import { SacredClient } from './client';
import { SacredWebSocket } from './websocket';
import { FieldState, FieldUpdate, FieldAnalytics } from './types';
import { EventEmitter } from 'eventemitter3';

export class FieldManager extends EventEmitter {
  private client: SacredClient;
  private ws: SacredWebSocket;
  private state: FieldState | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(client: SacredClient, ws: SacredWebSocket) {
    super();
    this.client = client;
    this.ws = ws;

    // Subscribe to WebSocket field updates
    this.ws.on('field:update', (update: FieldUpdate) => {
      this.handleFieldUpdate(update);
    });

    this.ws.on('field:state', (state: FieldState) => {
      this.state = state;
      this.emit('stateChange', state);
    });
  }

  /**
   * Get current field state
   */
  async getState(): Promise<FieldState> {
    if (!this.state) {
      await this.syncState();
    }
    return this.state!;
  }

  /**
   * Sync field state from server
   */
  async syncState(): Promise<FieldState> {
    const state = await this.client.get<FieldState>('/api/field/state');
    this.state = state;
    this.emit('stateChange', state);
    return state;
  }

  /**
   * Contribute to field coherence
   */
  async contribute(amount: number = 1, source: string = 'practice'): Promise<FieldUpdate> {
    const update = await this.client.post<FieldUpdate>('/api/field/contribute', {
      amount,
      source,
      userId: this.client.getConfig().userId
    });
    
    return update;
  }

  /**
   * Start automatic field pulsing
   */
  startPulsing(intervalMs: number = 5000): void {
    this.stopPulsing();
    
    this.updateInterval = setInterval(async () => {
      try {
        await this.contribute(0.1, 'pulse');
      } catch (error) {
        console.error('Field pulse error:', error);
      }
    }, intervalMs);
  }

  /**
   * Stop automatic field pulsing
   */
  stopPulsing(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Get field analytics
   */
  async getAnalytics(timeRange: '1h' | '24h' | '7d' = '24h'): Promise<FieldAnalytics> {
    return await this.client.get<FieldAnalytics>(`/api/field/analytics?range=${timeRange}`);
  }

  /**
   * Check if field is in special state
   */
  isInSpecialState(): boolean {
    return !!this.state?.specialState;
  }

  /**
   * Get field coherence level
   */
  getCoherenceLevel(): 'low' | 'medium' | 'high' | 'sacred' {
    const coherence = this.state?.coherence || 0;
    
    if (coherence >= 0.9) return 'sacred';
    if (coherence >= 0.7) return 'high';
    if (coherence >= 0.4) return 'medium';
    return 'low';
  }

  /**
   * Subscribe to coherence thresholds
   */
  onThreshold(threshold: number, callback: (state: FieldState) => void): void {
    this.on('stateChange', (state: FieldState) => {
      if (state.coherence >= threshold) {
        callback(state);
      }
    });
  }

  /**
   * Get field participants
   */
  async getParticipants(): Promise<Array<{id: string, contribution: number}>> {
    return await this.client.get('/api/field/participants');
  }

  /**
   * Handle field update from WebSocket
   */
  private handleFieldUpdate(update: FieldUpdate): void {
    if (!this.state) return;

    // Apply update to local state
    switch (update.type) {
      case 'coherence':
        this.state.coherence = update.value;
        break;
      case 'resonance':
        this.state.resonance = update.value;
        break;
      case 'vitality':
        this.state.vitality = update.value;
        break;
      case 'participant':
        this.state.participants = update.value;
        break;
      case 'special':
        this.state.specialState = update.value as any;
        break;
    }

    this.state.lastUpdate = new Date(update.timestamp);
    this.emit('update', update);
    this.emit('stateChange', this.state);
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.stopPulsing();
    this.removeAllListeners();
  }
}