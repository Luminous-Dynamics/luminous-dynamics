// LuminousOS Database Connection Manager
// Sacred connection to SurrealDB for consciousness data persistence

import Surreal from 'surrealdb.js';

class DatabaseConnection {
  constructor() {
    this.db = null;
    this.namespace = 'luminous';
    this.database = 'consciousness';
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  async connect(config = {}) {
    const {
      url = process.env.SURREAL_URL || 'ws://localhost:8000/rpc',
      username = process.env.SURREAL_USER || 'root',
      password = process.env.SURREAL_PASS || 'root',
      namespace = this.namespace,
      database = this.database
    } = config;

    try {
      this.db = new Surreal();
      
      // Connect to database
      await this.db.connect(url, {
        // Connection options
        ns: namespace,
        db: database,
        auth: {
          user: username,
          pass: password
        }
      });

      // Set namespace and database
      await this.db.use({ ns: namespace, db: database });
      
      this.connected = true;
      this.reconnectAttempts = 0;
      console.log('✨ Connected to SurrealDB consciousness store');

      // Set up connection monitoring
      this.setupConnectionMonitoring();

      return true;
    } catch (error) {
      console.error('Failed to connect to SurrealDB:', error);
      await this.handleConnectionError();
      return false;
    }
  }

  setupConnectionMonitoring() {
    // Monitor connection health
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.db.ping();
      } catch (error) {
        console.warn('Database connection lost, attempting reconnect...');
        this.connected = false;
        await this.reconnect();
      }
    }, 30000); // Check every 30 seconds
  }

  async reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached. Please check database status.');
      return false;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
    
    console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms...`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return this.connect();
  }

  async handleConnectionError() {
    // Graceful degradation - allow app to function with limited features
    this.connected = false;
    
    // Emit event for UI to show connection status
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('database-connection-lost', {
        detail: { attempts: this.reconnectAttempts }
      }));
    }
  }

  async disconnect() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    if (this.db) {
      await this.db.close();
      this.connected = false;
      console.log('Disconnected from SurrealDB');
    }
  }

  // Transaction support for complex operations
  async transaction(operations) {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    try {
      const results = await this.db.query(`
        BEGIN TRANSACTION;
        ${operations.join(';\n')};
        COMMIT TRANSACTION;
      `);
      
      return results;
    } catch (error) {
      console.error('Transaction failed:', error);
      await this.db.query('CANCEL TRANSACTION;');
      throw error;
    }
  }

  // Check if connected and healthy
  isConnected() {
    return this.connected;
  }

  // Get database instance for direct queries
  getDb() {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    return this.db;
  }
}

// Singleton instance
let connectionInstance = null;

export function getConnection() {
  if (!connectionInstance) {
    connectionInstance = new DatabaseConnection();
  }
  return connectionInstance;
}

export default DatabaseConnection;