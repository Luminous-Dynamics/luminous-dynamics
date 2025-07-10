// Database Migration Manager
// Handles schema setup and migrations for SurrealDB

import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConnection } from '../connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class MigrationManager {
  constructor() {
    this.connection = getConnection();
    this.migrationsTable = 'schema_migrations';
  }

  async initialize() {
    const db = this.connection.getDb();
    
    // Create migrations tracking table
    await db.query(`
      DEFINE TABLE ${this.migrationsTable} SCHEMAFULL;
      DEFINE FIELD id ON ${this.migrationsTable} TYPE string;
      DEFINE FIELD name ON ${this.migrationsTable} TYPE string;
      DEFINE FIELD executed_at ON ${this.migrationsTable} TYPE datetime;
      DEFINE FIELD checksum ON ${this.migrationsTable} TYPE string;
      DEFINE INDEX idx_migration_name ON ${this.migrationsTable} COLUMNS name UNIQUE;
    `);
  }

  async runMigrations() {
    console.log('🔄 Starting database migrations...');
    
    // Ensure connected
    if (!this.connection.isConnected()) {
      await this.connection.connect();
    }

    // Initialize migrations table
    await this.initialize();

    // Get all migration files
    const migrationFiles = await this.getMigrationFiles();
    
    // Get executed migrations
    const executed = await this.getExecutedMigrations();
    const executedNames = new Set(executed.map(m => m.name));

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!executedNames.has(file)) {
        await this.runMigration(file);
      }
    }

    console.log('✅ All migrations completed successfully');
  }

  async getMigrationFiles() {
    const files = await readdir(__dirname);
    return files
      .filter(f => f.endsWith('.surql') || f.endsWith('.js'))
      .filter(f => f !== 'migration-manager.js')
      .sort();
  }

  async getExecutedMigrations() {
    const db = this.connection.getDb();
    const result = await db.query(`SELECT * FROM ${this.migrationsTable}`);
    return result[0] || [];
  }

  async runMigration(filename) {
    console.log(`Running migration: ${filename}`);
    
    const filepath = join(__dirname, filename);
    const content = await readFile(filepath, 'utf-8');
    const checksum = this.calculateChecksum(content);
    
    const db = this.connection.getDb();

    try {
      if (filename.endsWith('.surql')) {
        // Execute raw SQL migration
        await db.query(content);
      } else if (filename.endsWith('.js')) {
        // Execute JavaScript migration
        const migration = await import(filepath);
        await migration.up(db);
      }

      // Record migration
      await db.create(this.migrationsTable, {
        id: `migration_${Date.now()}`,
        name: filename,
        executed_at: new Date().toISOString(),
        checksum
      });

      console.log(`✓ Migration completed: ${filename}`);
    } catch (error) {
      console.error(`✗ Migration failed: ${filename}`, error);
      throw error;
    }
  }

  calculateChecksum(content) {
    // Simple checksum for migration tracking
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  async rollback(steps = 1) {
    console.log(`Rolling back ${steps} migration(s)...`);
    
    const db = this.connection.getDb();
    const executed = await this.getExecutedMigrations();
    const toRollback = executed.slice(-steps);

    for (const migration of toRollback.reverse()) {
      const filepath = join(__dirname, migration.name);
      
      if (migration.name.endsWith('.js')) {
        const migrationModule = await import(filepath);
        if (migrationModule.down) {
          await migrationModule.down(db);
          await db.delete(`${this.migrationsTable}:${migration.id}`);
          console.log(`✓ Rolled back: ${migration.name}`);
        } else {
          console.warn(`⚠ No rollback defined for: ${migration.name}`);
        }
      } else {
        console.warn(`⚠ Cannot rollback SQL migration: ${migration.name}`);
      }
    }
  }

  async reset() {
    console.log('⚠️  Resetting database...');
    
    const db = this.connection.getDb();
    
    // Get all tables
    const result = await db.query('INFO FOR DB');
    const tables = Object.keys(result[0]?.tb || {});
    
    // Drop all tables except migrations
    for (const table of tables) {
      if (table !== this.migrationsTable) {
        await db.query(`REMOVE TABLE ${table}`);
        console.log(`Dropped table: ${table}`);
      }
    }
    
    // Clear migrations table
    await db.query(`DELETE FROM ${this.migrationsTable}`);
    
    console.log('Database reset complete');
  }
}

// CLI support
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manager = new MigrationManager();
  const command = process.argv[2];

  switch (command) {
    case 'up':
    case 'migrate':
      await manager.runMigrations();
      break;
    case 'down':
    case 'rollback':
      const steps = parseInt(process.argv[3]) || 1;
      await manager.rollback(steps);
      break;
    case 'reset':
      await manager.reset();
      break;
    default:
      console.log(`
Usage: node migration-manager.js <command>

Commands:
  up, migrate     Run all pending migrations
  down, rollback  Rollback migrations (optionally specify number)
  reset           Reset the database
      `);
  }
  
  process.exit(0);
}

export default MigrationManager;