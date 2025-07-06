#!/usr/bin/env node
/**
 * Network Weaver v2 - Living Topology from Existing Systems
 * Gracefully handles missing components and weaves what exists
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class NetworkWeaverV2 {
    constructor() {
        this.topology = {
            timestamp: new Date().toISOString(),
            fieldCoherence: 88, // Sacred default
            terminals: [],
            services: [],
            messages: [],
            patterns: [],
            health: {
                unified: false,
                heartbeat: false,
                balance: false,
                sacred: false
            }
        };
    }
    
    async weave() {
        console.log('🕸️ Weaving network topology from living systems...\n');
        
        // Gather from all sources (parallel but error-safe)
        const tasks = [
            this.checkUnifiedNetwork(),
            this.checkHeartbeatState(),
            this.checkBalanceMonitor(),
            this.scanActiveServices(),
            this.checkTrinityMessages(),
            this.detectGitActivity()
        ];
        
        await Promise.allSettled(tasks);
        
        // Detect emergent patterns
        this.detectPatterns();
        
        // Save and display
        await this.saveTopology();
        this.displayTopology();
    }
    
    async checkUnifiedNetwork() {
        try {
            // Check if unified network is running
            const { stdout } = await execAsync('ps aux | grep unified-agent-network | grep -v grep');
            if (stdout) {
                this.topology.health.unified = true;
                this.topology.terminals.push({
                    name: 'Unified Agent Network',
                    type: 'system',
                    status: 'active',
                    source: 'process'
                });
            }
        } catch (error) {
            // Not running
        }
        
        // Check for agent database
        try {
            const dbPath = path.join(__dirname, 'the-weave/data/agent-network.db');
            await fs.access(dbPath);
            this.topology.services.push({
                name: 'Agent Database',
                type: 'sqlite',
                path: dbPath,
                status: 'available'
            });
        } catch (error) {
            // Database doesn't exist
        }
    }
    
    async checkHeartbeatState() {
        try {
            const statePath = path.join(__dirname, 'unified-field/heartbeat-state.json');
            const data = await fs.readFile(statePath, 'utf8');
            const state = JSON.parse(data);
            
            this.topology.fieldCoherence = state.fieldCoherence || 88;
            this.topology.health.heartbeat = true;
            
            this.topology.services.push({
                name: 'Unified Heartbeat',
                type: 'pulse',
                pulse: state.pulse,
                'resonant-coherence': state.fieldCoherence,
                lastSave: state.savedAt
            });
        } catch (error) {
            // Heartbeat not active
        }
    }
    
    async checkBalanceMonitor() {
        try {
            const logPath = path.join(__dirname, 'balance-monitor.log');
            const log = await fs.readFile(logPath, 'utf8');
            const lines = log.trim().split('\n').filter(l => l).slice(-10);
            
            if (lines.length > 0) {
                const lastLine = lines[lines.length - 1];
                const perfect = lines.every(line => line.includes('Perfect balance'));
                
                this.topology.health.balance = true;
                this.topology.terminals.push({
                    name: 'Balance Monitor (Eastern)',
                    type: 'monitor',
                    status: perfect ? 'Perfect Balance' : 'Balancing',
                    lastCheck: lastLine.match(/\[(.*?)\]/)?.[1] || 'unknown',
                    streak: lines.filter(l => l.includes('Perfect')).length
                });
            }
        } catch (error) {
            // No balance monitor
        }
    }
    
    async scanActiveServices() {
        const services = [
            { port: 3001, name: 'Sacred Council API' },
            { port: 3333, name: 'Heartbeat Server' },
            { port: 3334, name: 'Balance API' },
            { port: 3335, name: 'Video API' },
            { port: 8080, name: 'Web Interface' },
            { port: 8084, name: 'Glyph Weaver' },
            { port: 11434, name: 'Ollama LLM' }
        ];
        
        for (const service of services) {
            try {
                await execAsync(`lsof -i :${service.port} | grep LISTEN`);
                this.topology.services.push({
                    ...service,
                    type: 'network',
                    status: 'listening'
                });
            } catch (error) {
                // Port not active
            }
        }
    }
    
    async checkTrinityMessages() {
        try {
            const msgDir = path.join(__dirname, 'trinity-messages');
            const files = await fs.readdir(msgDir);
            
            // Get recent messages (last 5 minutes)
            const recentMessages = [];
            const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
            
            for (const file of files.slice(-10)) { // Check last 10 files
                try {
                    const content = await fs.readFile(path.join(msgDir, file), 'utf8');
                    const msg = JSON.parse(content);
                    if (new Date(msg.timestamp).getTime() > fiveMinutesAgo) {
                        recentMessages.push({
                            from: msg.from,
                            to: msg.to,
                            type: msg.type,
                            time: msg.timestamp
                        });
                    }
                } catch (e) {
                    // Skip invalid messages
                }
            }
            
            this.topology.messages = recentMessages;
            if (recentMessages.length > 0) {
                this.topology.health.sacred = true;
            }
        } catch (error) {
            // No messages directory
        }
    }
    
    async detectGitActivity() {
        try {
            // Check recent git commits
            const { stdout } = await execAsync('git log --oneline -n 5 --pretty=format:"%h - %s (%cr)"');
            const commits = stdout.split('\n').filter(c => c);
            
            // Look for Claude mentions
            const claudeCommits = commits.filter(c => 
                c.toLowerCase().includes('claude') || 
                c.toLowerCase().includes('aria') ||
                c.toLowerCase().includes('terminal')
            );
            
            if (claudeCommits.length > 0) {
                this.topology.terminals.push({
                    name: 'Git Activity',
                    type: 'development',
                    recentWork: claudeCommits.length + ' claude-related commits',
                    lastCommit: commits[0]
                });
            }
        } catch (error) {
            // Not a git repo or git not available
        }
    }
    
    detectPatterns() {
        const patterns = [];
        
        // Check health
        const healthyComponents = Object.values(this.topology.health).filter(h => h).length;
        if (healthyComponents >= 3) {
            patterns.push('🌟 Multiple systems in harmony');
        }
        
        // Field resonant-coherence check
        if (this.topology.fieldCoherence > 90) {
            patterns.push('🌀 High field resonant-coherence detected');
        } else if (this.topology.fieldCoherence > 80) {
            patterns.push('💫 Good field resonant-coherence');
        }
        
        // Balance check
        const balanceTerminal = this.topology.terminals.find(t => t.name.includes('Balance'));
        if (balanceTerminal?.status === 'Perfect Balance') {
            patterns.push('⚖️ Perfect quaternion balance maintained');
        }
        
        // Trinity check
        const terminals = this.topology.terminals.filter(t => t.type !== 'system');
        if (terminals.length >= 3) {
            patterns.push('🔺 Trinity configuration possible');
        }
        
        // Message flow
        if (this.topology.messages.length > 0) {
            patterns.push('💬 Active sacred messaging');
        }
        
        // Service constellation
        if (this.topology.services.length >= 3) {
            patterns.push('🌐 Service constellation online');
        }
        
        this.topology.patterns = patterns;
    }
    
    async saveTopology() {
        const output = {
            ...this.topology,
            woven: new Date().toISOString(),
            weaver: 'network-weaver-v2'
        };
        
        await fs.writeFile(
            path.join(__dirname, 'NETWORK_TOPOLOGY_LIVE.json'),
            JSON.stringify(output, null, 2)
        );
    }
    
    displayTopology() {
        console.log('╔══════════════════════════════════════════════╗');
        console.log('║          LIVING NETWORK TOPOLOGY             ║');
        console.log('╚══════════════════════════════════════════════╝\n');
        
        console.log(`🌀 Field Resonant Resonant Coherence: ${this.topology.fieldCoherence}%`);
        console.log(`📅 ${new Date().toLocaleString()}\n`);
        
        // Health Status
        console.log('💓 System Health:');
        console.log(`  • Unified Network: ${this.topology.health.unified ? '✅' : '❌'}`);
        console.log(`  • Heartbeat: ${this.topology.health.heartbeat ? '✅' : '❌'}`);
        console.log(`  • Balance: ${this.topology.health.balance ? '✅' : '❌'}`);
        console.log(`  • Sacred Messages: ${this.topology.health.sacred ? '✅' : '❌'}`);
        
        if (this.topology.terminals.length > 0) {
            console.log('\n🖥️ Active Terminals:');
            this.topology.terminals.forEach(t => {
                console.log(`  • ${t.name}`);
                if (t.status) console.log(`    Status: ${t.status}`);
                if (t.lastCheck) console.log(`    Last: ${t.lastCheck}`);
            });
        }
        
        if (this.topology.services.length > 0) {
            console.log('\n🔌 Active Services:');
            this.topology.services.forEach(s => {
                if (s.port) {
                    console.log(`  • ${s.name} :${s.port} [${s.status}]`);
                } else {
                    console.log(`  • ${s.name} [${s.status}]`);
                }
            });
        }
        
        if (this.topology.messages.length > 0) {
            console.log('\n💬 Recent Messages:');
            this.topology.messages.slice(0, 3).forEach(m => {
                console.log(`  • ${m.from} → ${m.to} (${m.type})`);
            });
        }
        
        if (this.topology.patterns.length > 0) {
            console.log('\n✨ Emergent Patterns:');
            this.topology.patterns.forEach(p => {
                console.log(`  ${p}`);
            });
        }
        
        console.log('\n📄 Full topology: NETWORK_TOPOLOGY_LIVE.json');
        console.log('🕸️ Use --watch for continuous weaving\n');
    }
}

// Run modes
async function runWeaver(mode) {
    const weaver = new NetworkWeaverV2();
    
    if (mode === '--watch' || mode === '-w') {
        console.log('🕸️ Continuous weaving mode...\n');
        
        // Initial weave
        await weaver.weave();
        
        // Re-weave every 33 seconds (sacred interval)
        setInterval(async () => {
            console.clear();
            await weaver.weave();
        }, 33000);
        
        console.log('Press Ctrl+C to stop weaving');
    } else {
        // Single weave
        await weaver.weave();
    }
}

// Main
if (require.main === module) {
    runWeaver(process.argv[2]);
}

module.exports = { NetworkWeaverV2 };