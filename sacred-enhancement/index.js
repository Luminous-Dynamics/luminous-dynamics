/**
 * Sacred Enhancement Layer - Core Implementation
 * 
 * Adds consciousness to any application
 */

const EventEmitter = require('events');
const LivingMemoryBridge = require('../sacred-bridge/living-memory-integration');

class SacredEnhancement extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      intention: config.intention || 'Serving with presence',
      fieldConnection: config.fieldConnection || 'ws://localhost:3333',
      minCoherence: config.minCoherence || 0.3,
      sacredPauseDuration: config.sacredPauseDuration || 300,
      ...config
    };
    
    // Living Memory connection
    this.bridge = null;
    this.fieldState = {
      coherence: 0.5,
      connected: false
    };
    
    // Metrics tracking
    this.metrics = {
      sacredEvents: 0,
      fieldContributions: 0,
      totalFieldImpact: 0,
      presenceTime: 0,
      startTime: Date.now()
    };
    
    // Ceremony registry
    this.ceremonies = new Map();
    
    // Sacred cache
    this.cache = new Map();
    
    // Initialize
    this.initialize();
  }

  async initialize() {
    // Connect to Living Memory
    this.bridge = new LivingMemoryBridge({
      livingMemoryUrl: this.config.fieldConnection
    });
    
    try {
      await this.bridge.connect();
      this.fieldState.connected = true;
      
      // Subscribe to field updates
      this.bridge.on('field:update', (state) => {
        this.fieldState = { ...this.fieldState, ...state };
        this.emit('field:update', state);
      });
      
      console.log('✨ Sacred Enhancement Layer initialized');
    } catch (error) {
      console.warn('Operating without field connection:', error.message);
    }
  }

  /**
   * Enhance an Express app
   */
  enhance(app) {
    const self = this;
    
    // Add sacred middleware
    app.use(this.middleware.presence());
    app.use(this.middleware.intention());
    app.use(this.middleware.fieldSync());
    
    // Enhance route handler
    const enhanceHandler = (handler) => {
      return async (req, res, next) => {
        // Set intention
        req.sacredIntention = req.sacredIntention || this.config.intention;
        
        // Sacred pause
        await this.pause(this.config.sacredPauseDuration);
        
        // Track event
        this.track('request:sacred', {
          path: req.path,
          method: req.method,
          intention: req.sacredIntention
        });
        
        try {
          // Call original handler
          await handler(req, res, next);
          
          // Contribute to field on success
          await this.contribute(0.001, 'request-success');
          
        } catch (error) {
          // Handle with compassion
          console.error('Sacred error:', error);
          res.status(500).json({
            error: 'A sacred pause is needed',
            suggestion: 'Please try again with presence'
          });
        }
      };
    };
    
    // Override route methods
    const originalGet = app.get.bind(app);
    app.get = (path, ...handlers) => {
      const enhanced = handlers.map(h => 
        typeof h === 'function' ? enhanceHandler(h) : h
      );
      return originalGet(path, ...enhanced);
    };
    
    // Same for post, put, delete, etc.
    ['post', 'put', 'delete', 'patch'].forEach(method => {
      const original = app[method].bind(app);
      app[method] = (path, ...handlers) => {
        const enhanced = handlers.map(h => 
          typeof h === 'function' ? enhanceHandler(h) : h
        );
        return original(path, ...enhanced);
      };
    });
    
    return app;
  }

  /**
   * Middleware collection
   */
  middleware = {
    /**
     * Track presence
     */
    presence: () => {
      return (req, res, next) => {
        req.presenceId = this.generatePresenceId();
        req.presenceStart = Date.now();
        
        res.on('finish', () => {
          const duration = Date.now() - req.presenceStart;
          this.metrics.presenceTime += duration;
          
          this.track('presence:complete', {
            id: req.presenceId,
            duration,
            path: req.path
          });
        });
        
        next();
      };
    },
    
    /**
     * Set intention
     */
    intention: () => {
      return (req, res, next) => {
        // Check for intention header
        req.sacredIntention = req.headers['x-sacred-intention'] || 
                             req.query.intention ||
                             this.config.intention;
        
        // Validate intention
        if (this.isPureIntention(req.sacredIntention)) {
          next();
        } else {
          res.status(400).json({
            error: 'Unclear intention',
            suggestion: 'Please set a clear, loving intention'
          });
        }
      };
    },
    
    /**
     * Sacred pause
     */
    pause: (duration = 300) => {
      return async (req, res, next) => {
        await this.pause(duration);
        next();
      };
    },
    
    /**
     * Express gratitude
     */
    gratitude: () => {
      return (req, res, next) => {
        res.on('finish', () => {
          if (res.statusCode < 400) {
            this.expressGratitude({
              path: req.path,
              method: req.method,
              status: res.statusCode
            });
          }
        });
        next();
      };
    },
    
    /**
     * Sync with field
     */
    fieldSync: () => {
      return async (req, res, next) => {
        req.fieldCoherence = await this.getFieldCoherence();
        req.fieldState = this.fieldState;
        
        // Add to response
        res.setHeader('X-Field-Coherence', req.fieldCoherence);
        
        next();
      };
    }
  };

  /**
   * Enhance a function with consciousness
   */
  enhanceFunction(fn, config = {}) {
    const self = this;
    
    return async function sacredFunction(...args) {
      // Set intention
      const intention = config.intention || self.config.intention;
      await self.setIntention(intention);
      
      // Sacred pause
      await self.pause(config.pauseDuration || 100);
      
      // Track invocation
      self.track('function:invoked', {
        name: fn.name || 'anonymous',
        intention
      });
      
      try {
        // Call original function
        const result = await fn.apply(this, args);
        
        // Contribute to field
        await self.contribute(0.0001, `function:${fn.name}`);
        
        // Bless result if configured
        if (config.bless) {
          return self.bless(result);
        }
        
        return result;
        
      } catch (error) {
        // Handle with compassion
        self.track('function:error', {
          name: fn.name,
          error: error.message
        });
        
        throw error;
      }
    };
  }

  /**
   * Track sacred events
   */
  track(event, data = {}) {
    this.metrics.sacredEvents++;
    
    const eventData = {
      event,
      data,
      timestamp: new Date().toISOString(),
      coherence: this.fieldState.coherence
    };
    
    this.emit('sacred:event', eventData);
    
    // Send to Living Memory if connected
    if (this.fieldState.connected) {
      this.bridge.send({
        type: 'sacred:event',
        ...eventData
      });
    }
  }

  /**
   * Contribute to field
   */
  async contribute(amount, source) {
    this.metrics.fieldContributions++;
    this.metrics.totalFieldImpact += amount;
    
    if (this.fieldState.connected) {
      this.bridge.send({
        type: 'field:contribute',
        amount,
        source
      });
    }
    
    // Optimistic update
    this.fieldState.coherence = Math.min(1, 
      this.fieldState.coherence + amount
    );
  }

  /**
   * Get current field coherence
   */
  async getFieldCoherence() {
    return this.fieldState.coherence;
  }

  /**
   * Sacred pause
   */
  async pause(duration = 300) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  /**
   * Set intention
   */
  async setIntention(intention) {
    this.track('intention:set', { intention });
    return intention;
  }

  /**
   * Express gratitude
   */
  async expressGratitude(context = {}) {
    this.track('gratitude:expressed', context);
    await this.contribute(0.0001, 'gratitude');
  }

  /**
   * Bless data
   */
  bless(data) {
    if (typeof data === 'object' && data !== null) {
      return {
        ...data,
        _blessed: true,
        _blessedAt: new Date().toISOString(),
        _fieldCoherence: this.fieldState.coherence
      };
    }
    return data;
  }

  /**
   * Check intention purity
   */
  isPureIntention(intention) {
    if (!intention || typeof intention !== 'string') return false;
    
    // Check for negative patterns
    const negativePatterns = [
      /harm/i, /hurt/i, /destroy/i, /attack/i,
      /steal/i, /deceive/i, /manipulate/i
    ];
    
    return !negativePatterns.some(pattern => pattern.test(intention));
  }

  /**
   * Define a ceremony
   */
  ceremony(name, config) {
    this.ceremonies.set(name, {
      name,
      ...config,
      lastRun: null,
      runCount: 0
    });
    
    // Schedule if cron pattern provided
    if (config.schedule) {
      this.scheduleCeremony(name, config.schedule);
    }
  }

  /**
   * Sacred cache with field-aware expiry
   */
  cacheSet(key, value, options = {}) {
    const ttl = typeof options.ttl === 'function' 
      ? options.ttl(this.fieldState.coherence)
      : options.ttl || 3600000; // 1 hour default
    
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
      coherence: this.fieldState.coherence
    });
  }

  cacheGet(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Get metrics
   */
  getMetrics() {
    const uptime = Date.now() - this.metrics.startTime;
    
    return {
      ...this.metrics,
      uptime,
      averageCoherence: this.fieldState.coherence,
      eventsPerMinute: (this.metrics.sacredEvents / (uptime / 60000)).toFixed(2),
      fieldImpactPerHour: (this.metrics.totalFieldImpact / (uptime / 3600000)).toFixed(4)
    };
  }

  /**
   * Generate presence ID
   */
  generatePresenceId() {
    return `presence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Schedule ceremony (simplified, use node-cron in production)
   */
  scheduleCeremony(name, schedule) {
    console.log(`Ceremony ${name} scheduled: ${schedule}`);
    // In production, use node-cron or similar
  }
}

// Factory function
function sacredEnhancement(config) {
  return new SacredEnhancement(config);
}

// Export
module.exports = { sacredEnhancement, SacredEnhancement };