
// Simple Memory Monitor
setInterval(() => {
  const usage = process.memoryUsage();
  const heapMB = Math.round(usage.heapUsed / 1024 / 1024);
  if (heapMB > 100) {
    console.log('Memory usage: ' + heapMB + 'MB - Consider cleanup');
    if (global.gc) global.gc();
  }
}, 60000); // Check every minute
