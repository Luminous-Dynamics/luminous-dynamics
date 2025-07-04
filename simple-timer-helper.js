
// Simple Timer Cleanup Helper
const activeTimers = new Set();
const activeIntervals = new Set();

function safeSetTimeout(fn, delay) {
  const timer = setTimeout(() => {
    activeTimers.delete(timer);
    fn();
  }, delay);
  activeTimers.add(timer);
  return timer;
}

function safeSetInterval(fn, delay) {
  const interval = setInterval(fn, delay);
  activeIntervals.add(interval);
  return interval;
}

function clearAllTimers() {
  activeTimers.forEach(t => clearTimeout(t));
  activeIntervals.forEach(i => clearInterval(i));
  activeTimers.clear();
  activeIntervals.clear();
  console.log('All timers cleared');
}

// Auto-cleanup on exit
process.on('SIGINT', clearAllTimers);
process.on('SIGTERM', clearAllTimers);

module.exports = { safeSetTimeout, safeSetInterval, clearAllTimers };
