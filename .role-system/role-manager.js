#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROLES_FILE = path.join(__dirname, 'roles.json');
const SESSION_ID = crypto.randomBytes(8).toString('hex');

class RoleManager {
  constructor() {
    this.ensureRolesFile();
  }

  ensureRolesFile() {
    if (!fs.existsSync(__dirname)) {
      fs.mkdirSync(__dirname, { recursive: true });
    }
    if (!fs.existsSync(ROLES_FILE)) {
      console.log('Roles file not found. Please create it first.');
      process.exit(1);
    }
  }

  getRoles() {
    const data = fs.readFileSync(ROLES_FILE, 'utf8');
    return JSON.parse(data);
  }

  saveRoles(roles) {
    fs.writeFileSync(ROLES_FILE, JSON.stringify(roles, null, 2));
  }

  listAvailable() {
    const roles = this.getRoles();
    console.log('\n🎯 Available Roles:\n');
    
    Object.entries(roles.roles).forEach(([key, role]) => {
      const status = role.taken ? '🔒 TAKEN' : '✅ AVAILABLE';
      const session = role.taken ? ` (${role.sessionId})` : '';
      console.log(`${key.padEnd(10)} ${status}${session}`);
      console.log(`           ${role.description}`);
      console.log(`           Working in: ${role.workingDir}`);
      console.log('');
    });
  }

  claimRole(roleKey) {
    const roles = this.getRoles();
    const role = roles.roles[roleKey];
    
    if (!role) {
      console.log(`❌ Role '${roleKey}' not found`);
      return false;
    }

    // Check if role is taken and session is still active
    if (role.taken) {
      const timeSince = Date.now() - role.lastHeartbeat;
      if (timeSince < roles.config.heartbeatTimeout * 1000) {
        console.log(`❌ Role '${roleKey}' is taken by ${role.sessionId}`);
        return false;
      } else {
        console.log(`♻️ Releasing stale session for ${roleKey}`);
      }
    }

    // Claim the role
    role.taken = true;
    role.sessionId = SESSION_ID;
    role.lastHeartbeat = Date.now();
    
    this.saveRoles(roles);
    
    console.log(`✅ Claimed role: ${role.name}`);
    console.log(`📁 Working directory: ${role.workingDir}`);
    console.log(`🆔 Session ID: ${SESSION_ID}`);
    
    // Change to working directory
    process.chdir(role.workingDir);
    
    return true;
  }

  releaseRole(roleKey) {
    const roles = this.getRoles();
    const role = roles.roles[roleKey];
    
    if (!role || !role.taken || role.sessionId !== SESSION_ID) {
      console.log(`❌ Cannot release role '${roleKey}' - not owned by this session`);
      return false;
    }

    role.taken = false;
    role.sessionId = null;
    role.lastHeartbeat = null;
    
    this.saveRoles(roles);
    console.log(`✅ Released role: ${role.name}`);
    return true;
  }

  heartbeat(roleKey) {
    const roles = this.getRoles();
    const role = roles.roles[roleKey];
    
    if (!role || !role.taken || role.sessionId !== SESSION_ID) {
      return false;
    }

    role.lastHeartbeat = Date.now();
    this.saveRoles(roles);
    return true;
  }

  status() {
    const roles = this.getRoles();
    console.log('\n📊 Role Status:\n');
    
    Object.entries(roles.roles).forEach(([key, role]) => {
      if (role.taken) {
        const timeSince = Math.floor((Date.now() - role.lastHeartbeat) / 1000);
        const isStale = timeSince > roles.config.heartbeatTimeout;
        const statusIcon = isStale ? '⚠️ STALE' : '🟢 ACTIVE';
        console.log(`${key}: ${statusIcon} (${role.sessionId}) - ${timeSince}s ago`);
      } else {
        console.log(`${key}: 🔵 FREE`);
      }
    });
    console.log('');
  }
}

// CLI Interface
const manager = new RoleManager();
const command = process.argv[2];
const roleKey = process.argv[3];

switch (command) {
  case 'list':
    manager.listAvailable();
    break;
  case 'claim':
    if (!roleKey) {
      console.log('Usage: node role-manager.js claim <role>');
      process.exit(1);
    }
    if (manager.claimRole(roleKey)) {
      // Set up heartbeat
      setInterval(() => manager.heartbeat(roleKey), 30000);
      console.log('\n💓 Heartbeat started. Press Ctrl+C to release role.');
      process.on('SIGINT', () => {
        manager.releaseRole(roleKey);
        process.exit(0);
      });
    }
    break;
  case 'release':
    if (!roleKey) {
      console.log('Usage: node role-manager.js release <role>');
      process.exit(1);
    }
    manager.releaseRole(roleKey);
    break;
  case 'status':
    manager.status();
    break;
  default:
    console.log('Usage: node role-manager.js <list|claim|release|status> [role]');
    console.log('');
    console.log('Examples:');
    console.log('  node role-manager.js list');
    console.log('  node role-manager.js claim backend');
    console.log('  node role-manager.js status');
    console.log('  node role-manager.js release backend');
}