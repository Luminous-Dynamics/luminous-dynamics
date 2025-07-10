#!/usr/bin/env node

const http = require('http');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const services = [
  { name: 'Sacred Core', port: 3333, health: '/health' },
  { name: 'The Weave', port: 3001, health: '/status' },
  { name: 'Visualizer', port: 8338, health: '/' },
];

async function checkService(service) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: service.port,
      path: service.health,
      method: 'GET',
      timeout: 2000,
    };

    const req = http.request(options, (res) => {
      resolve({ ...service, status: 'running', code: res.statusCode });
    });

    req.on('error', () => {
      resolve({ ...service, status: 'stopped' });
    });

    req.on('timeout', () => {
      resolve({ ...service, status: 'timeout' });
    });

    req.end();
  });
}

async function checkGitStatus(dir) {
  return new Promise((resolve) => {
    exec('git status --porcelain', { cwd: dir }, (error, stdout) => {
      if (error) {
        resolve({ dir: path.basename(dir), error: true });
      } else {
        const changes = stdout.trim().split('\n').filter(Boolean);
        resolve({ dir: path.basename(dir), changes: changes.length });
      }
    });
  });
}

async function main() {
  console.log('🌟 Luminous-Dynamics Status Dashboard\n');

  // Check services
  console.log('📡 Services:');
  const serviceResults = await Promise.all(services.map(checkService));
  serviceResults.forEach((service) => {
    const icon = service.status === 'running' ? '✅' : '❌';
    console.log(`  ${icon} ${service.name} (port ${service.port}): ${service.status}`);
  });

  // Check git status
  console.log('\n📂 Git Status:');
  const dirs = fs.readdirSync('.').filter((f) => {
    return fs.statSync(f).isDirectory() && fs.existsSync(path.join(f, '.git'));
  });
  
  const gitResults = await Promise.all(dirs.map((dir) => checkGitStatus(dir)));
  gitResults.forEach((result) => {
    if (result.error) {
      console.log(`  ❓ ${result.dir}: error checking status`);
    } else if (result.changes > 0) {
      console.log(`  📝 ${result.dir}: ${result.changes} changes`);
    } else {
      console.log(`  ✅ ${result.dir}: clean`);
    }
  });

  // System info
  console.log('\n💻 System:');
  exec('df -h /srv/luminous-dynamics | tail -1', (error, stdout) => {
    if (!error) {
      const parts = stdout.trim().split(/\s+/);
      console.log(`  Disk: ${parts[2]} / ${parts[1]} (${parts[4]})`);
    }
  });
}

main().catch(console.error);