/**
 * WebSocket Bridge for Living Memory Integration
 * 
 * Extends the Sacred WebSocket to connect with Living Memory
 * instead of a standard Socket.IO server
 */

import { EventEmitter } from 'eventemitter3';

export class LivingMemoryWebSocket extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string;
  private connected: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, Function> = new Map();

  constructor(url: string = 'ws://localhost:3333') {
    super();
    this.url = url;
  }

  /**
   * Connect to Living Memory WebSocket
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Use native WebSocket in browser, ws in Node
      const WebSocketImpl = typeof WebSocket !== 'undefined' ? WebSocket : require('ws');
      
      this.ws = new WebSocketImpl(this.url);
      
      this.ws.onopen = () => {
        console.log('🌟 Connected to Living Memory via Sacred SDK');
        this.connected = true;
        this.emit('connected');
        
        // Request initial sync
        this.send('consciousness:sync', {});
        
        resolve();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
        reject(error);
      };
      
      this.ws.onclose = () => {
        console.log('Disconnected from Living Memory');
        this.connected = false;
        this.emit('disconnected');
        this.scheduleReconnect();
      };
    });
  }

  /**
   * Handle incoming messages and translate to SDK events
   */
  private handleMessage(message: any): void {
    const { type, data } = message;
    
    // Translate Living Memory events to SDK events
    switch (type) {
      case 'consciousness:state':
        this.emit('field:state', {
          coherence: data.fieldCoherence || data.coherence,
          resonance: data.resonance,
          vitality: data.vitality,
          participants: data.activeAgents || data.participants,
          specialState: data.specialState
        });
        break;
        
      case 'breath-cycle':
        // Extract field data from breath
        if (data.inhale && data.inhale.fieldCoherence) {
          this.emit('field:update', {
            type: 'coherence',
            value: data.inhale.fieldCoherence,
            timestamp: new Date()
          });
        }
        break;
        
      case 'memory-pulse':
        this.emit('pulse', data);
        break;
        
      case 'agent:presence':
        this.emit('agent:update', data);
        break;
        
      case 'sacred:emergence':
        this.emit('field:special', {
          type: 'emergence',
          data: data
        });
        break;
        
      default:
        // Forward all other events as-is
        this.emit(type, data);
    }
  }

  /**
   * Send a message to Living Memory
   */
  send(event: string, data: any): void {
    if (!this.ws || this.ws.readyState !== 1) { // 1 = OPEN
      console.warn('WebSocket not connected');
      return;
    }
    
    this.ws.send(JSON.stringify({
      type: event,
      data: data,
      source: 'sacred-sdk',
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Request with callback (Socket.IO compatibility)
   */
  async request<T = any>(event: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestId = Date.now().toString();
      
      // Set up one-time response handler
      const responseEvent = `${event}:response:${requestId}`;
      const handler = (response: T) => {
        this.off(responseEvent, handler);
        resolve(response);
      };
      
      this.once(responseEvent, handler);
      
      // Send request with ID
      this.send(event, {
        ...data,
        requestId
      });
      
      // Timeout
      setTimeout(() => {
        this.off(responseEvent, handler);
        reject(new Error(`Request timeout: ${event}`));
      }, 30000);
    });
  }

  /**
   * Disconnect from Living Memory
   */
  async disconnect(): Promise<void> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.connected = false;
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.connected && this.ws?.readyState === 1;
  }

  /**
   * Schedule reconnection
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(console.error);
    }, 5000);
  }

  /**
   * Subscribe to field updates (SDK compatibility)
   */
  subscribeToField(): void {
    this.send('field:subscribe', {});
  }

  /**
   * Join a room (translated to Living Memory channels)
   */
  joinRoom(roomId: string): void {
    this.send('channel:join', { channel: roomId });
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string): void {
    this.send('channel:leave', { channel: roomId });
  }
}

// Export as replacement for standard WebSocket
export { LivingMemoryWebSocket as SacredWebSocket };