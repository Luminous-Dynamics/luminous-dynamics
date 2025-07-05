// Database Service - Main entry point for database operations
import { getConnection } from './connection.js';
import { createRepositories } from './repositories/index.js';
import MigrationManager from './migrations/migration-manager.js';

class DatabaseService {
  constructor() {
    this.connection = getConnection();
    this.repositories = null;
    this.migrationManager = new MigrationManager();
    this.initialized = false;
  }

  async initialize(config = {}) {
    if (this.initialized) {
      return true;
    }

    try {
      // Connect to database
      const connected = await this.connection.connect(config);
      if (!connected) {
        throw new Error('Failed to connect to database');
      }

      // Run migrations
      if (config.runMigrations !== false) {
        await this.migrationManager.runMigrations();
      }

      // Create repositories
      this.repositories = createRepositories();
      
      this.initialized = true;
      console.log('✨ Database service initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize database service:', error);
      throw error;
    }
  }

  // Repository getters
  get users() {
    this.ensureInitialized();
    return this.repositories.users;
  }

  get coherence() {
    this.ensureInitialized();
    return this.repositories.coherence;
  }

  get glyphs() {
    this.ensureInitialized();
    return this.repositories.glyphs;
  }

  get ceremonies() {
    this.ensureInitialized();
    return this.repositories.ceremonies;
  }

  get messages() {
    this.ensureInitialized();
    return this.repositories.messages;
  }

  ensureInitialized() {
    if (!this.initialized) {
      throw new Error('Database service not initialized. Call initialize() first.');
    }
  }

  // Utility methods
  async transaction(operations) {
    this.ensureInitialized();
    return this.connection.transaction(operations);
  }

  async healthCheck() {
    if (!this.initialized) {
      return { healthy: false, message: 'Not initialized' };
    }

    try {
      const db = this.connection.getDb();
      await db.ping();
      
      return {
        healthy: true,
        connected: this.connection.isConnected(),
        message: 'Database healthy'
      };
    } catch (error) {
      return {
        healthy: false,
        connected: false,
        message: error.message
      };
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.disconnect();
      this.initialized = false;
    }
  }

  // Advanced queries
  async getUserDashboardData(userId) {
    this.ensureInitialized();
    
    const [
      user,
      stats,
      currentCoherence,
      recentPractices,
      activeCeremonies,
      unreadMessages,
      connections
    ] = await Promise.all([
      this.users.findById(userId),
      this.users.getUserStats(userId),
      this.coherence.getCurrentCoherence(userId),
      this.glyphs.getUserPracticeHistory(userId, 10),
      this.ceremonies.getActiveCeremonies(),
      this.messages.getUnreadMessages(userId),
      this.messages.getNetworkConnections(userId)
    ]);

    return {
      user,
      stats,
      currentCoherence,
      recentPractices,
      activeCeremonies,
      unreadMessageCount: unreadMessages.length,
      connectionCount: connections.length
    };
  }

  async getNetworkFieldState() {
    this.ensureInitialized();
    
    const [
      networkCoherence,
      fieldCoherence,
      activeUsers,
      activeCeremonies
    ] = await Promise.all([
      this.coherence.getNetworkCoherence(),
      this.coherence.getFieldCoherence(),
      this.users.getActiveUsers(20),
      this.ceremonies.getActiveCeremonies()
    ]);

    return {
      networkCoherence,
      fieldCoherence,
      activeUserCount: activeUsers.length,
      activeCeremonyCount: activeCeremonies.length,
      timestamp: new Date().toISOString()
    };
  }

  // Backup and restore
  async backup(filepath) {
    this.ensureInitialized();
    const db = this.connection.getDb();
    
    // Export all data
    const tables = ['user', 'glyph', 'coherence_reading', 'glyph_practice', 
                   'group_ceremony', 'sacred_message', 'network_connection'];
    
    const backup = {};
    
    for (const table of tables) {
      const result = await db.query(`SELECT * FROM ${table}`);
      backup[table] = result[0] || [];
    }
    
    // Write to file
    const { writeFile } = await import('fs/promises');
    await writeFile(filepath, JSON.stringify(backup, null, 2));
    
    console.log(`✓ Backup saved to ${filepath}`);
    return backup;
  }

  async restore(filepath) {
    this.ensureInitialized();
    const db = this.connection.getDb();
    
    // Read backup file
    const { readFile } = await import('fs/promises');
    const content = await readFile(filepath, 'utf-8');
    const backup = JSON.parse(content);
    
    // Restore each table
    for (const [table, records] of Object.entries(backup)) {
      // Clear existing data
      await db.query(`DELETE FROM ${table}`);
      
      // Insert backup data
      for (const record of records) {
        await db.create(table, record);
      }
      
      console.log(`✓ Restored ${records.length} records to ${table}`);
    }
    
    console.log('✓ Restore completed');
  }
}

// Singleton instance
let serviceInstance = null;

export function getDatabaseService() {
  if (!serviceInstance) {
    serviceInstance = new DatabaseService();
  }
  return serviceInstance;
}

// Named exports for convenience
export const db = getDatabaseService();
export default DatabaseService;