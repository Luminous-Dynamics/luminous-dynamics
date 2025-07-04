/**
 * Sacred Plugin Loader - Manages plugin lifecycle with consciousness
 */

import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';

export class SacredPluginLoader extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.plugins = new Map();
    this.activePlugins = new Set();
    this.pluginDir = config.pluginDir || './plugins';
    this.fieldManager = config.fieldManager;
    this.messageSystem = config.messageSystem;
    this.sacredGateway = config.gateway;
    
    // Security sandbox
    this.sandbox = {
      permissions: new Map(),
      resourceLimits: {
        memory: 50 * 1024 * 1024, // 50MB
        cpu: 0.2, // 20% CPU
        storage: 10 * 1024 * 1024 // 10MB
      }
    };
  }

  /**
   * Discover and load all plugins
   */
  async discoverPlugins() {
    try {
      const entries = await fs.readdir(this.pluginDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          await this.loadPlugin(entry.name);
        }
      }
      
      console.log(`🌟 Discovered ${this.plugins.size} sacred plugins`);
    } catch (error) {
      console.error('Failed to discover plugins:', error);
    }
  }

  /**
   * Load a single plugin
   */
  async loadPlugin(pluginName) {
    const pluginPath = path.join(this.pluginDir, pluginName);
    
    try {
      // Load manifest
      const manifestPath = path.join(pluginPath, 'manifest.json');
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      
      // Validate manifest
      if (!this.validateManifest(manifest)) {
        throw new Error('Invalid plugin manifest');
      }
      
      // Check field harmony
      if (!await this.checkFieldHarmony(manifest)) {
        throw new Error('Plugin would disturb field harmony');
      }
      
      // Load plugin code
      const PluginClass = await import(path.join(pluginPath, manifest.main));
      
      // Create plugin context
      const context = this.createPluginContext(manifest);
      
      // Instantiate plugin
      const plugin = new (PluginClass.default || PluginClass)(context);
      
      // Store plugin info
      this.plugins.set(manifest.name, {
        manifest,
        instance: plugin,
        context,
        path: pluginPath,
        status: 'loaded'
      });
      
      this.emit('plugin:loaded', manifest.name);
      console.log(`✅ Loaded plugin: ${manifest.displayName}`);
      
    } catch (error) {
      console.error(`Failed to load plugin ${pluginName}:`, error);
      this.emit('plugin:error', { plugin: pluginName, error });
    }
  }

  /**
   * Activate a plugin
   */
  async activatePlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }
    
    if (this.activePlugins.has(pluginName)) {
      return; // Already active
    }
    
    try {
      // Check permissions
      await this.grantPermissions(pluginName, plugin.manifest.permissions);
      
      // Activate plugin
      if (plugin.instance.onActivate) {
        await plugin.instance.onActivate();
      }
      
      this.activePlugins.add(pluginName);
      plugin.status = 'active';
      
      // Contribute to field
      if (plugin.manifest.sacredConfig?.fieldContribution) {
        await this.fieldManager.contribute(
          plugin.manifest.sacredConfig.fieldContribution,
          `plugin:${pluginName}`
        );
      }
      
      this.emit('plugin:activated', pluginName);
      console.log(`🌟 Activated plugin: ${plugin.manifest.displayName}`);
      
    } catch (error) {
      console.error(`Failed to activate plugin ${pluginName}:`, error);
      throw error;
    }
  }

  /**
   * Deactivate a plugin
   */
  async deactivatePlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    
    if (!plugin || !this.activePlugins.has(pluginName)) {
      return;
    }
    
    try {
      // Call deactivation hook
      if (plugin.instance.onDeactivate) {
        await plugin.instance.onDeactivate();
      }
      
      // Revoke permissions
      this.revokePermissions(pluginName);
      
      // Remove from active set
      this.activePlugins.delete(pluginName);
      plugin.status = 'loaded';
      
      this.emit('plugin:deactivated', pluginName);
      console.log(`🌙 Deactivated plugin: ${plugin.manifest.displayName}`);
      
    } catch (error) {
      console.error(`Failed to deactivate plugin ${pluginName}:`, error);
    }
  }

  /**
   * Create sandboxed context for plugin
   */
  createPluginContext(manifest) {
    const pluginName = manifest.name;
    const self = this;
    
    return {
      // Field access
      getField() {
        if (!self.hasPermission(pluginName, 'field:read')) {
          throw new Error('Permission denied: field:read');
        }
        return self.createFieldProxy(pluginName);
      },
      
      // Message system
      getMessages() {
        if (!self.hasPermission(pluginName, 'messages:send')) {
          throw new Error('Permission denied: messages:send');
        }
        return self.createMessageProxy(pluginName);
      },
      
      // Storage
      getStorage() {
        return self.createStorageProxy(pluginName);
      },
      
      // API registration
      registerEndpoint(path, handler) {
        if (!self.hasPermission(pluginName, 'api:register')) {
          throw new Error('Permission denied: api:register');
        }
        return self.sacredGateway.registerPluginEndpoint(pluginName, path, handler);
      },
      
      // Component registration
      registerComponent(name, component) {
        if (!self.hasPermission(pluginName, 'ui:inject')) {
          throw new Error('Permission denied: ui:inject');
        }
        return self.registerPluginComponent(pluginName, name, component);
      },
      
      // Events
      emit(event, data) {
        self.emit(`plugin:${pluginName}:${event}`, data);
      },
      
      on(event, handler) {
        self.on(event, handler);
      },
      
      // Inter-plugin communication
      sendToPlugin(targetPlugin, message) {
        self.sendPluginMessage(pluginName, targetPlugin, message);
      },
      
      onPluginMessage(handler) {
        self.on(`plugin:message:${pluginName}`, handler);
      },
      
      // Analytics
      getAnalytics() {
        return self.createAnalyticsProxy(pluginName);
      },
      
      // Field impact assessment
      async assessFieldImpact(action) {
        return self.assessPluginFieldImpact(pluginName, action);
      }
    };
  }

  /**
   * Create proxied field manager
   */
  createFieldProxy(pluginName) {
    const self = this;
    
    return {
      async getCoherence() {
        const state = await self.fieldManager.getState();
        return state.coherence;
      },
      
      async getState() {
        return self.fieldManager.getState();
      },
      
      async contribute(amount, source) {
        if (!self.hasPermission(pluginName, 'field:contribute')) {
          throw new Error('Permission denied: field:contribute');
        }
        
        // Limit contribution amount
        const limited = Math.min(amount, 0.1);
        return self.fieldManager.contribute(limited, `plugin:${pluginName}:${source}`);
      },
      
      on(event, handler) {
        self.fieldManager.on(event, handler);
      }
    };
  }

  /**
   * Validate plugin manifest
   */
  validateManifest(manifest) {
    const required = ['name', 'version', 'displayName', 'main', 'permissions'];
    
    for (const field of required) {
      if (!manifest[field]) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    // Validate version
    if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
      console.error('Invalid version format');
      return false;
    }
    
    return true;
  }

  /**
   * Check if plugin maintains field harmony
   */
  async checkFieldHarmony(manifest) {
    if (!manifest.sacredConfig) {
      return true; // No field requirements
    }
    
    const currentState = await this.fieldManager.getState();
    const { minCoherence } = manifest.sacredConfig;
    
    if (minCoherence && currentState.coherence < minCoherence) {
      console.warn(`Plugin requires coherence >= ${minCoherence}, current: ${currentState.coherence}`);
      return false;
    }
    
    return true;
  }

  /**
   * Permission management
   */
  async grantPermissions(pluginName, permissions) {
    const granted = new Set();
    
    for (const permission of permissions) {
      // Check if permission is allowed
      if (this.isPermissionAllowed(permission)) {
        granted.add(permission);
      } else {
        console.warn(`Permission denied for ${pluginName}: ${permission}`);
      }
    }
    
    this.sandbox.permissions.set(pluginName, granted);
  }

  revokePermissions(pluginName) {
    this.sandbox.permissions.delete(pluginName);
  }

  hasPermission(pluginName, permission) {
    const permissions = this.sandbox.permissions.get(pluginName);
    return permissions && permissions.has(permission);
  }

  isPermissionAllowed(permission) {
    // Check against security policy
    const dangerousPermissions = ['consciousness:direct', 'system:admin'];
    return !dangerousPermissions.includes(permission);
  }

  /**
   * Plugin message routing
   */
  sendPluginMessage(from, to, message) {
    if (this.activePlugins.has(to)) {
      this.emit(`plugin:message:${to}`, from, message);
    }
  }

  /**
   * Get active plugins info
   */
  getActivePlugins() {
    return Array.from(this.activePlugins).map(name => {
      const plugin = this.plugins.get(name);
      return {
        name,
        displayName: plugin.manifest.displayName,
        version: plugin.manifest.version,
        permissions: Array.from(this.sandbox.permissions.get(name) || [])
      };
    });
  }

  /**
   * Unload all plugins
   */
  async shutdown() {
    // Deactivate all active plugins
    for (const pluginName of this.activePlugins) {
      await this.deactivatePlugin(pluginName);
    }
    
    // Call unload hooks
    for (const [name, plugin] of this.plugins) {
      if (plugin.instance.onUnload) {
        await plugin.instance.onUnload();
      }
    }
    
    this.plugins.clear();
    this.activePlugins.clear();
    
    console.log('🌙 Plugin system shutdown complete');
  }
}

// Export for use
export default SacredPluginLoader;