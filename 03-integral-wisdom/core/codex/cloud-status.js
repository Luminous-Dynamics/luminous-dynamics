#!/usr/bin/env node
/**
 * 🌤️ Cloud Status Dashboard - Terminal Version
 * Shows current work status and next steps
 */

const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class CloudStatusDashboard {
  constructor() {
    this.tasks = {
      completed: [
        { name: 'Firebase Hosting Deployed', icon: '✅', detail: '131 files live' },
        { name: 'Cloud Run Services Created', icon: '✅', detail: '3 services' },
        { name: 'Authentication Scripts', icon: '✅', detail: 'fix-cloud-auth.sh' },
        { name: 'Test Scripts Created', icon: '✅', detail: 'test-cloud-websocket.js' }
      ],
      inProgress: [
        { name: 'Fix Cloud Run Auth', icon: '🔧', detail: 'Run ./fix-cloud-auth.sh' },
        { name: 'Enable Missing APIs', icon: '🔧', detail: 'Firestore, Cloud Build' }
      ],
      blocked: [
        { name: 'WebSocket Connections', icon: '🚫', detail: 'Waiting for auth fix' }
      ],
      upcoming: [
        { name: 'Cloud Shell Setup', icon: '🔮', detail: '1 hour' },
        { name: 'Cloud-Native Bridge', icon: '🔮', detail: '2 hours' },
        { name: 'First Cloud Practice', icon: '🔮', detail: 'Tomorrow' }
      ]
    };
  }

  async run() {
    console.clear();
    await this.showHeader();
    await this.showProgress();
    await this.showTasks();
    await this.checkLiveStatus();
    await this.showNextSteps();
    await this.showQuickCommands();
  }

  async showHeader() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║           🌤️  CLOUD WORK DASHBOARD - SACRED TECHNOLOGY       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    const now = new Date();
    console.log(`📅 ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
    console.log(`🎯 Sprint Goal: Cloud-Native Development Ready`);
    console.log(`⏱️  Time to Goal: 2-3 hours\n`);
  }

  async showProgress() {
    const total = this.tasks.completed.length + this.tasks.inProgress.length + 
                  this.tasks.blocked.length + this.tasks.upcoming.length;
    const done = this.tasks.completed.length;
    const percent = Math.round((done / total) * 100);
    
    console.log('📊 OVERALL PROGRESS');
    console.log('─'.repeat(60));
    
    const filled = Math.round((percent / 100) * 40);
    const empty = 40 - filled;
    const progressBar = '█'.repeat(filled) + '░'.repeat(empty);
    
    console.log(`[${progressBar}] ${percent}%`);
    console.log(`Completed: ${done}/${total} tasks\n`);
  }

  async showTasks() {
    console.log('📋 TASK STATUS');
    console.log('─'.repeat(60));
    
    // Completed
    if (this.tasks.completed.length > 0) {
      console.log('\n✅ Completed:');
      this.tasks.completed.forEach(task => {
        console.log(`   ${task.icon} ${task.name} - ${task.detail}`);
      });
    }
    
    // In Progress
    if (this.tasks.inProgress.length > 0) {
      console.log('\n🔧 In Progress:');
      this.tasks.inProgress.forEach(task => {
        console.log(`   ${task.icon} ${task.name} - ${task.detail}`);
      });
    }
    
    // Blocked
    if (this.tasks.blocked.length > 0) {
      console.log('\n🚫 Blocked:');
      this.tasks.blocked.forEach(task => {
        console.log(`   ${task.icon} ${task.name} - ${task.detail}`);
      });
    }
    
    // Upcoming
    if (this.tasks.upcoming.length > 0) {
      console.log('\n🔮 Upcoming:');
      this.tasks.upcoming.forEach(task => {
        console.log(`   ${task.icon} ${task.name} - ${task.detail}`);
      });
    }
    
    console.log('');
  }

  async checkLiveStatus() {
    console.log('🌐 LIVE SERVICES');
    console.log('─'.repeat(60));
    
    const services = [
      { 
        name: 'Firebase Hosting', 
        url: 'https://mycelix-network.web.app',
        expected: 200
      },
      {
        name: 'Sacred Council Hub',
        url: 'https://mycelix-network.web.app/sacred-council-hub.html',
        expected: 200
      },
      {
        name: 'Cloud Function (Ping)',
        url: 'https://us-central1-mycelix-network.cloudfunctions.net/sacredPing',
        expected: 200
      }
    ];
    
    for (const service of services) {
      await this.checkService(service);
    }
    
    console.log('');
  }

  async checkService(service) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      https.get(service.url, (res) => {
        const responseTime = Date.now() - startTime;
        const status = res.statusCode === service.expected ? '✅' : '❌';
        const statusText = res.statusCode === service.expected ? 'LIVE' : `ERROR (${res.statusCode})`;
        
        console.log(`${status} ${service.name}: ${statusText} (${responseTime}ms)`);
        res.resume();
        resolve();
      }).on('error', (err) => {
        console.log(`❌ ${service.name}: CONNECTION FAILED`);
        resolve();
      });
    });
  }

  async showNextSteps() {
    console.log('🚀 NEXT STEPS');
    console.log('─'.repeat(60));
    console.log('\n1. Fix Authentication (Required):');
    console.log('   $ ./fix-cloud-auth.sh');
    console.log('\n2. Test Connections:');
    console.log('   $ node test-cloud-websocket.js');
    console.log('\n3. Open Cloud Shell:');
    console.log('   $ open https://shell.cloud.google.com');
    console.log('\n4. Deploy from Cloud:');
    console.log('   $ firebase deploy --only hosting\n');
  }

  async showQuickCommands() {
    console.log('⚡ QUICK COMMANDS');
    console.log('─'.repeat(60));
    console.log('\nAuthentication & Setup:');
    console.log('  fix-auth    → ./fix-cloud-auth.sh');
    console.log('  test-ws     → node test-cloud-websocket.js');
    console.log('  practice    → node cloud-native-practice.js');
    console.log('\nCloud Console:');
    console.log('  shell       → open https://shell.cloud.google.com');
    console.log('  console     → open https://console.cloud.google.com');
    console.log('  firebase    → open https://console.firebase.google.com');
    console.log('\nMonitoring:');
    console.log('  logs        → gcloud logging read --limit 50');
    console.log('  services    → gcloud run services list');
    console.log('  functions   → gcloud functions list\n');
    
    console.log('─'.repeat(60));
    console.log('💡 Run "node cloud-status.js watch" for live updates');
    console.log('✨ Ready to go cloud-native!\n');
  }
}

// Run dashboard
if (require.main === module) {
  const dashboard = new CloudStatusDashboard();
  
  if (process.argv[2] === 'watch') {
    // Watch mode - refresh every 30 seconds
    const runDashboard = () => dashboard.run().catch(console.error);
    runDashboard();
    setInterval(runDashboard, 30000);
  } else {
    // Single run
    dashboard.run().catch(console.error);
  }
}

module.exports = CloudStatusDashboard;