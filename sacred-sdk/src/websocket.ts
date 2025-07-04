/**
 * Sacred WebSocket - Real-time connection management
 */

import { io, Socket } from 'socket.io-client';
import { EventEmitter } from 'eventemitter3';

export class SacredWebSocket extends EventEmitter {
  private socket: Socket | null = null;
  private url: string;
  private autoReconnect: boolean;
  private reconnectInterval: number;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(url: string, options: {
    autoReconnect?: boolean;
    reconnectInterval?: number;
  } = {}) {
    super();
    this.url = url;
    this.autoReconnect = options.autoReconnect ?? true;
    this.reconnectInterval = options.reconnectInterval ?? 5000;
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(this.url, {
        transports: ['websocket'],
        reconnection: this.autoReconnect,
        reconnectionDelay: this.reconnectInterval
      });

      this.socket.on('connect', () => {
        console.log('🌟 Connected to Sacred WebSocket');
        this.emit('connected');
        this.clearReconnectTimer();
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        this.emit('disconnected', reason);
        
        if (this.autoReconnect && reason === 'io server disconnect') {
          this.scheduleReconnect();
        }
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
        reject(error);
      });

      // Forward all events
      this.socket.onAny((event, ...args) => {
        this.emit(event, ...args);
      });

      // Connection timeout
      setTimeout(() => {
        if (!this.socket?.connected) {
          reject(new Error('WebSocket connection timeout'));
        }
      }, 10000);
    });
  }

  /**
   * Disconnect from server
   */
  async disconnect(): Promise<void> {
    this.clearReconnectTimer();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Send a message
   */
  send(event: string, data: any): void {
    if (!this.socket?.connected) {
      throw new Error('WebSocket not connected');
    }
    
    this.socket.emit(event, data);
  }

  /**
   * Send and wait for response
   */
  async request<T = any>(event: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      this.socket.emit(event, data, (response: any) => {
        clearTimeout(timeout);
        
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Subscribe to field updates
   */
  subscribeToField(): void {
    this.send('field:subscribe', {});
  }

  /**
   * Unsubscribe from field updates
   */
  unsubscribeFromField(): void {
    this.send('field:unsubscribe', {});
  }

  /**
   * Join a sacred room
   */
  joinRoom(roomId: string): void {
    this.send('room:join', { roomId });
  }

  /**
   * Leave a sacred room
   */
  leaveRoom(roomId: string): void {
    this.send('room:leave', { roomId });
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect().catch(console.error);
    }, this.reconnectInterval);
  }

  /**
   * Clear reconnection timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}