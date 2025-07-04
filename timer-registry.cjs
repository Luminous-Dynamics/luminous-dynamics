
/**
 * Timer Registry - Centralized timer management
 * Use this instead of raw setInterval/setTimeout to prevent leaks
 */
class TimerRegistry {
  constructor() {
    this.timers = new Set();
    this.intervals = new Set();
    this.isShuttingDown = false;
  }

  setTimeout(callback, delay, ...args) {
    if (this.isShuttingDown) return null;
    
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (!this.isShuttingDown) callback(...args);
    }, delay);
    
    this.timers.add(timer);
    return timer;
  }

  setInterval(callback, delay, ...args) {
    if (this.isShuttingDown) return null;
    
    const interval = setInterval(() => {
      if (!this.isShuttingDown) callback(...args);
    }, delay);
    
    this.intervals.add(interval);
    return interval;
  }

  clearTimeout(timer) {
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(timer);
    }
  }

  clearInterval(interval) {
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(interval);
    }
  }

  clearAll() {
    this.isShuttingDown = true;
    
    this.timers.forEach(timer => {
      try { clearTimeout(timer); } catch (e) {}
    });
    
    this.intervals.forEach(interval => {
      try { clearInterval(interval); } catch (e) {}
    });
    
    this.timers.clear();
    this.intervals.clear();
    
    console.log(`⏰ Cleared ${this.timers.size + this.intervals.size} timers`);
  }

  getActiveCount() {
    return {
      timers: this.timers.size,
      intervals: this.intervals.size,
      total: this.timers.size + this.intervals.size
    };
  }
}

// Create global instance
const timerRegistry = new TimerRegistry();

// Set up global cleanup handlers
let cleanupHandlersSetup = false;
function setupGlobalCleanup() {
  if (cleanupHandlersSetup) return;
  cleanupHandlersSetup = true;
  
  ['SIGINT', 'SIGTERM', 'exit'].forEach(signal => {
    process.on(signal, () => {
      console.log(`\n🧹 Timer cleanup triggered by ${signal}`);
      timerRegistry.clearAll();
      if (signal !== 'exit') process.exit(0);
    });
  });
}

setupGlobalCleanup();

module.exports = timerRegistry;
