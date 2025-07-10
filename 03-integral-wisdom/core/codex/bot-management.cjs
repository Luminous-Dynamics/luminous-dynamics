#!/usr/bin/env node

/**
 * 🤖 Bot Management & Cleanup Solution
 * Manage multiple Claude sessions and system processes cleanly
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class BotManager {
    constructor() {
        this.lockFile = '/tmp/weave-session-lock';
        this.sessionId = `claude-${Date.now()}`;
        this.managedPorts = [3001, 3002, 3003, 8081, 8082, 8083];
        this.managedProcesses = [];
    }

    /**
     * Clean shutdown of previous sessions
     */
    async cleanupPrevious() {
        console.log('🧹 Cleaning up previous bot sessions...\n');
        
        // Kill old Claude processes (except current)
        const currentPid = process.pid;
        await this.killProcesses('claude', [currentPid]);
        
        // Clean up managed ports
        await this.freeUpPorts();
        
        // Release database locks
        await this.releaseDatabaseLocks();
        
        // Clean temporary files
        await this.cleanTempFiles();
        
        console.log('✅ Cleanup complete\n');
    }

    /**
     * Kill processes by name, excluding specified PIDs
     */
    async killProcesses(processName, excludePids = []) {
        return new Promise((resolve) => {
            exec(`pgrep -f "${processName}"`, (error, stdout) => {
                if (error) {
                    resolve();
                    return;
                }
                
                const pids = stdout.trim().split('\n').filter(pid => 
                    pid && !excludePids.includes(parseInt(pid))
                );
                
                if (pids.length === 0) {
                    console.log(`   No ${processName} processes to clean up`);
                    resolve();
                    return;
                }
                
                console.log(`   Terminating ${pids.length} ${processName} processes: ${pids.join(', ')}`);
                
                // Graceful shutdown first
                exec(`kill ${pids.join(' ')}`, () => {
                    // Force kill after 3 seconds if needed
                    setTimeout(() => {
                        exec(`kill -9 ${pids.join(' ')} 2>/dev/null`, () => {
                            resolve();
                        });
                    }, 3000);
                });
            });
        });
    }

    /**
     * Free up our managed ports
     */
    async freeUpPorts() {
        console.log('🔌 Freeing up managed ports...');
        
        for (const port of this.managedPorts) {
            await new Promise((resolve) => {
                exec(`lsof -ti :${port}`, (error, stdout) => {
                    if (error || !stdout.trim()) {
                        resolve();
                        return;
                    }
                    
                    const pids = stdout.trim().split('\n');
                    console.log(`   Freeing port ${port} (PIDs: ${pids.join(', ')})`);
                    
                    exec(`kill ${pids.join(' ')}`, () => {
                        setTimeout(() => {
                            exec(`kill -9 ${pids.join(' ')} 2>/dev/null`, () => resolve());
                        }, 2000);
                    });
                });
            });
        }
    }

    /**
     * Release SQLite database locks
     */
    async releaseDatabaseLocks() {
        console.log('🔐 Releasing database locks...');
        
        const dbPaths = [
            './agent-comms-sqlite/agents.db',
            './agent-comms-sqlite/sacred-council.db',
            './the-weave/cli/unified-agent-network.db',
            './the-weave/core/network/unified-agent-network.db'
        ];
        
        // Kill any processes holding database locks
        await this.killProcesses('node.*\\.db', [process.pid]);
        await this.killProcesses('sqlite', [process.pid]);
        
        // Wait for locks to release
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    /**
     * Clean temporary files and stale locks
     */
    async cleanTempFiles() {
        console.log('🗑️ Cleaning temporary files...');
        
        const tempPatterns = [
            '/tmp/claude-*',
            '/tmp/weave-*',
            '/tmp/sacred-*'
        ];
        
        for (const pattern of tempPatterns) {
            exec(`rm -rf ${pattern} 2>/dev/null`);
        }
        
        // Remove our lock file if it exists
        if (fs.existsSync(this.lockFile)) {
            fs.unlinkSync(this.lockFile);
        }
    }

    /**
     * Register current session
     */
    async registerSession() {
        console.log(`🤖 Registering bot session: ${this.sessionId}`);
        
        const sessionData = {
            sessionId: this.sessionId,
            pid: process.pid,
            startTime: new Date().toISOString(),
            ports: [],
            databases: []
        };
        
        fs.writeFileSync(this.lockFile, JSON.stringify(sessionData, null, 2));
        
        // Cleanup on exit
        process.on('exit', () => this.gracefulShutdown());
        process.on('SIGINT', () => this.gracefulShutdown());
        process.on('SIGTERM', () => this.gracefulShutdown());
    }

    /**
     * Register a port as being used by this session
     */
    registerPort(port) {
        const sessionData = JSON.parse(fs.readFileSync(this.lockFile, 'utf8'));
        if (!sessionData.ports.includes(port)) {
            sessionData.ports.push(port);
            fs.writeFileSync(this.lockFile, JSON.stringify(sessionData, null, 2));
        }
    }

    /**
     * Check if another session is active
     */
    isAnotherSessionActive() {
        if (!fs.existsSync(this.lockFile)) return false;
        
        try {
            const sessionData = JSON.parse(fs.readFileSync(this.lockFile, 'utf8'));
            
            // Check if process is still running
            try {
                process.kill(sessionData.pid, 0);
                return true; // Process exists
            } catch {
                return false; // Process doesn't exist
            }
        } catch {
            return false;
        }
    }

    /**
     * Graceful shutdown
     */
    gracefulShutdown() {
        console.log(`\n🌙 Graceful shutdown of session: ${this.sessionId}`);
        
        // Clean up our lock file
        if (fs.existsSync(this.lockFile)) {
            const sessionData = JSON.parse(fs.readFileSync(this.lockFile, 'utf8'));
            if (sessionData.sessionId === this.sessionId) {
                fs.unlinkSync(this.lockFile);
            }
        }
        
        process.exit(0);
    }

    /**
     * Full system status
     */
    async systemStatus() {
        console.log('🤖 Bot Management System Status\n');
        
        // Check Claude processes
        exec('ps aux | grep claude | grep -v grep', (error, stdout) => {
            if (stdout.trim()) {
                console.log('Active Claude processes:');
                console.log(stdout);
            } else {
                console.log('No Claude processes running');
            }
        });
        
        // Check port usage
        console.log('\nPort usage:');
        for (const port of this.managedPorts) {
            exec(`lsof -i :${port}`, (error, stdout) => {
                if (stdout.trim()) {
                    console.log(`Port ${port}: ${stdout.split('\n')[1] || 'In use'}`);
                }
            });
        }
        
        // Check session lock
        if (fs.existsSync(this.lockFile)) {
            const sessionData = JSON.parse(fs.readFileSync(this.lockFile, 'utf8'));
            console.log('\nActive session:', sessionData);
        } else {
            console.log('\nNo active session lock');
        }
    }
}

// CLI Interface
async function main() {
    const botManager = new BotManager();
    const command = process.argv[2];
    
    switch (command) {
        case 'cleanup':
            await botManager.cleanupPrevious();
            break;
            
        case 'register':
            await botManager.registerSession();
            console.log('✅ Session registered');
            break;
            
        case 'status':
            await botManager.systemStatus();
            break;
            
        case 'full-reset':
            console.log('🚨 FULL SYSTEM RESET - This will terminate ALL related processes');
            await botManager.cleanupPrevious();
            await botManager.registerSession();
            console.log('✅ System reset complete');
            break;
            
        default:
            console.log(`
🤖 Bot Management Commands:

  cleanup     - Clean up previous sessions and free resources
  register    - Register current session as active
  status      - Show system status
  full-reset  - Nuclear option: clean everything and start fresh

Example:
  node bot-management.cjs cleanup
  node bot-management.cjs register
            `);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { BotManager };