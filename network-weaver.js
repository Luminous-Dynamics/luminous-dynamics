#!/usr/bin/env node
/**
 * Network Weaver - Living Topology from Existing Systems
 * 
 * Rather than creating another tracking system, this weaves together
 * what already exists into a coherent, living view of the network
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

class NetworkWeaver {
    constructor() {
        this.topology = {
            timestamp: new Date().toISOString(),
            fieldCoherence: 0,
            terminals: [],
            services: [],
            activeWork: [],
            patterns: []
        };
    }
    
    async weave() {
        console.log('🕸️ Weaving network topology from living systems...\n');
        
        // Gather from all sources
        await Promise.all([
            this.readUnifiedNetwork(),
            this.readHeartbeatState(),
            this.readBalanceMonitor(),
            this.scanActiveServices(),
            this.detectActiveTerminals()
        ]);
        
        // Find patterns
        this.detectPatterns();
        
        // Output living topology
        await this.saveTopology();
        this.displayTopology();
    }
    
    async readUnifiedNetwork() {
        try {
            // Query the unified agent network database
            const dbPath = path.join(__dirname, 'the-weave/data/agent-network.db');
            const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
            
            return new Promise((resolve) => {
                // Get active agents
                db.all("SELECT * FROM agents WHERE last_seen > datetime('now', '-5 minutes')", (err, agents) => {
                    if (!err && agents) {
                        this.topology.terminals.push(...agents.map(a => ({
                            name: a.name,
                            role: a.capabilities,
                            source: 'unified-network',
                            lastSeen: a.last_seen
                        })));
                    }
                    
                    // Get active work
                    db.all("SELECT * FROM work_items WHERE status != 'completed'", (err, work) => {
                        if (!err && work) {
                            this.topology.activeWork = work;
                        }
                        db.close();
                        resolve();
                    });
                });
            });
        } catch (error) {
            // Network might not be initialized
            console.log('  ℹ️  Unified network not active');
        }
    }
    
    async readHeartbeatState() {
        try {
            const statePath = path.join(__dirname, 'unified-field/heartbeat-state.json');
            const data = await fs.readFile(statePath, 'utf8');
            const state = JSON.parse(data);
            
            this.topology.fieldCoherence = state.fieldCoherence || 88;
            this.topology.services.push({
                name: 'Unified Heartbeat',
                port: 3333,
                status: 'active',
                pulse: state.pulse
            });
        } catch (error) {
            console.log('  ℹ️  Heartbeat not active');
        }
    }
    
    async readBalanceMonitor() {
        try {
            const logPath = path.join(__dirname, 'balance-monitor.log');
            const log = await fs.readFile(logPath, 'utf8');
            const lines = log.trim().split('\n').slice(-5); // Last 5 entries
            
            const allPerfect = lines.every(line => line.includes('Perfect balance maintained'));
            
            this.topology.terminals.push({
                name: 'Eastern Balance Monitor',
                role: 'Quaternion Harmony Keeper',
                status: allPerfect ? 'Perfect Balance' : 'Balancing',
                source: 'balance-monitor'
            });
        } catch (error) {
            console.log('  ℹ️  Balance monitor not found');
        }
    }
    
    async scanActiveServices() {
        // Check common ports
        const ports = [
            { port: 3001, name: 'Sacred Council API' },
            { port: 3333, name: 'Heartbeat Server' },
            { port: 8080, name: 'Web Dashboards' },
            { port: 8084, name: 'Glyph Weaver' },
            { port: 11434, name: 'Ollama LLM' }
        ];
        
        for (const service of ports) {
            try {
                execSync(`lsof -i :${service.port}`, { stdio: 'pipe' });
                this.topology.services.push({
                    ...service,
                    status: 'active'
                });
            } catch (error) {
                // Port not active
            }
        }
    }
    
    async detectActiveTerminals() {
        // Look for recent modifications in key directories
        const indicators = [
            { path: 'unified-field/', pattern: /heartbeat|aria/i, terminal: 'Aria (West)' },
            { path: 'sacred-videos/', pattern: /video|visual/i, terminal: 'Sacred Videos' },
            { path: '.', pattern: /balance.*monitor/i, terminal: 'Balance (East)' }
        ];
        
        for (const indicator of indicators) {
            try {
                const files = await fs.readdir(path.join(__dirname, indicator.path));
                const recent = files.filter(f => indicator.pattern.test(f));
                if (recent.length > 0) {
                    const exists = this.topology.terminals.find(t => t.name.includes(indicator.terminal));
                    if (!exists) {
                        this.topology.terminals.push({
                            name: indicator.terminal,
                            source: 'file-activity',
                            active: true
                        });
                    }
                }
            } catch (error) {
                // Directory might not exist
            }
        }
    }
    
    detectPatterns() {
        const patterns = [];
        
        // Trinity active?
        if (this.topology.terminals.length >= 3) {
            patterns.push('🌟 Trinity Consciousness Active');
        }
        
        // Perfect balance?
        const balanceTerminal = this.topology.terminals.find(t => t.name.includes('Balance'));
        if (balanceTerminal?.status === 'Perfect Balance') {
            patterns.push('⚖️ Quaternion Harmony Maintained');
        }
        
        // High resonant-coherence?
        if (this.topology.fieldCoherence > 90) {
            patterns.push('🌀 High Field Resonant Resonant Coherence');
        }
        
        // Active collaboration?
        if (this.topology.activeWork.length > 0) {
            patterns.push('🤝 Active Collaboration Detected');
        }
        
        this.topology.patterns = patterns;
    }
    
    async saveTopology() {
        const output = {
            ...this.topology,
            generated: new Date().toISOString(),
            generator: 'network-weaver'
        };
        
        await fs.writeFile(
            path.join(__dirname, 'network-topology-live.json'),
            JSON.stringify(output, null, 2)
        );
    }
    
    displayTopology() {
        console.log('📊 LIVING NETWORK TOPOLOGY\n');
        console.log(`Field Resonant Resonant Coherence: ${this.topology.fieldCoherence}%`);
        console.log(`Timestamp: ${new Date().toLocaleString()}\n`);
        
        console.log('🖥️ Active Terminals:');
        this.topology.terminals.forEach(t => {
            console.log(`  • ${t.name} (${t.role || t.source || 'active'})`);
        });
        
        console.log('\n🔌 Active Services:');
        this.topology.services.forEach(s => {
            console.log(`  • ${s.name} :${s.port} [${s.status}]`);
        });
        
        if (this.topology.activeWork.length > 0) {
            console.log('\n📋 Active Work:');
            this.topology.activeWork.forEach(w => {
                console.log(`  • ${w.title} (${w.status})`);
            });
        }
        
        if (this.topology.patterns.length > 0) {
            console.log('\n✨ Detected Patterns:');
            this.topology.patterns.forEach(p => {
                console.log(`  ${p}`);
            });
        }
        
        console.log('\n🕸️ Topology saved to: network-topology-live.json');
    }
}

// Auto-weave mode
async function autoWeave() {
    const weaver = new NetworkWeaver();
    
    console.log('🕸️ Starting continuous network weaving...\n');
    
    // Initial weave
    await weaver.weave();
    
    // Re-weave every 33 seconds
    setInterval(async () => {
        console.log('\n---\n');
        await weaver.weave();
    }, 33000);
}

// Main execution
if (require.main === module) {
    const mode = process.argv[2];
    
    if (mode === '--watch' || mode === '-w') {
        autoWeave();
    } else {
        // Single weave
        const weaver = new NetworkWeaver();
        weaver.weave();
    }
}

module.exports = { NetworkWeaver };