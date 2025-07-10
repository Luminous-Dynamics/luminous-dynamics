module.exports = {
  apps: [{
    name: 'Sacred-Council-Oracle',
    script: './sacred-council-launcher.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    restart_delay: 5000,
    kill_timeout: 5000,
    listen_timeout: 10000,
    cron_restart: '0 4 * * *', // Daily restart at 4 AM
  }]
};