#!/usr/bin/env node
/**
 * Field Data Server
 * Provides real-time data from the unified network database to the visualizer
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

class FieldDataServer {
    constructor(dbPath, port = 3333) {
        this.db = new sqlite3.Database(dbPath);
        this.app = express();
        this.port = port;
        
        // Setup middleware
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname)));
        
        // Setup routes
        this.setupRoutes();
        
        // Cache for performance
        this.cache = {
            agents: new Map(),
            lastUpdate: 0
        };
    }
    
    setupRoutes() {
        // Serve the visualizer
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });
        
        // Get current field state
        this.app.get('/api/field-state', async (req, res) => {
            try {
                const fieldState = await this.getFieldState();
                res.json(fieldState);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        // Get agents and their relationships
        this.app.get('/api/agents', async (req, res) => {
            try {
                const agents = await this.getAgents();
                res.json(agents);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        // Get recent messages
        this.app.get('/api/messages', async (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 50;
                const messages = await this.getRecentMessages(limit);
                res.json(messages);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        // Get connections between agents
        this.app.get('/api/connections', async (req, res) => {
            try {
                const connections = await this.getConnections();
                res.json(connections);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        // Get temporal patterns
        this.app.get('/api/temporal-patterns', async (req, res) => {
            try {
                const patterns = await this.getTemporalPatterns();
                res.json(patterns);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        // WebSocket endpoint for real-time updates
        this.app.get('/api/stream', (req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });
            
            // Send updates every 2 seconds
            const interval = setInterval(async () => {
                try {
                    const update = await this.getRealtimeUpdate();
                    res.write(`data: ${JSON.stringify(update)}\n\n`);
                } catch (error) {
                    console.error('Stream error:', error);
                }
            }, 2000);
            
            // Clean up on disconnect
            req.on('close', () => {
                clearInterval(interval);
            });
        });
    }
    
    async getFieldState() {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT 
                    COUNT(DISTINCT from_agent) as active_agents,
                    COUNT(*) as total_messages,
                    AVG(field_impact) as avg_field_impact,
                    MAX(field_impact) as max_field_impact,
                    GROUP_CONCAT(DISTINCT harmony) as harmonies
                FROM unified_messages
                WHERE created_at > ?
            `, [Date.now() - 3600000], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const fieldData = result[0];
                const coherence = Math.min(1, Math.max(0, (fieldData.avg_field_impact || 0) * 2));
                
                // Count harmony frequencies
                const harmonies = (fieldData.harmonies || '').split(',').filter(h => h);
                const harmonyCount = {};
                harmonies.forEach(h => {
                    harmonyCount[h] = (harmonyCount[h] || 0) + 1;
                });
                
                // Find dominant harmony
                const dominantHarmony = Object.entries(harmonyCount)
                    .sort((a, b) => b[1] - a[1])[0];
                
                resolve({
                    coherence: coherence,
                    activeAgents: fieldData.active_agents || 0,
                    messageRate: Math.floor(fieldData.total_messages / 60) || 0,
                    dominantHarmony: dominantHarmony ? dominantHarmony[0] : 'emergence',
                    resonance: fieldData.max_field_impact > 0.4 ? 'harmonious' :
                              fieldData.avg_field_impact < 0 ? 'dissonant' : 'neutral',
                    timestamp: Date.now()
                });
            });
        });
    }
    
    async getAgents() {
        return new Promise((resolve, reject) => {
            // Get all agents
            this.db.all(`
                SELECT 
                    id,
                    name,
                    role,
                    created_at
                FROM unified_agents
            `, (err, agents) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Get message counts for each agent
                const agentPromises = agents.map(agent => {
                    return new Promise((resolveAgent) => {
                        this.db.all(`
                            SELECT 
                                COUNT(*) as message_count,
                                MAX(created_at) as last_active,
                                AVG(field_impact) as avg_impact
                            FROM unified_messages
                            WHERE from_agent = ? OR to_agent = ?
                        `, [agent.id, agent.id], (err, stats) => {
                            if (err) {
                                resolveAgent(agent);
                                return;
                            }
                            
                            const stat = stats[0];
                            resolveAgent({
                                ...agent,
                                messages: stat.message_count || 0,
                                lastActive: stat.last_active || agent.created_at,
                                avgImpact: stat.avg_impact || 0,
                                activity: this.calculateActivity(stat.last_active)
                            });
                        });
                    });
                });
                
                Promise.all(agentPromises).then(resolve).catch(reject);
            });
        });
    }
    
    async getRecentMessages(limit = 50) {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT 
                    m.id,
                    m.from_agent,
                    m.to_agent,
                    m.content,
                    m.message_type,
                    m.harmony,
                    m.field_impact,
                    m.created_at,
                    fa.name as from_name,
                    ta.name as to_name
                FROM unified_messages m
                LEFT JOIN unified_agents fa ON m.from_agent = fa.id
                LEFT JOIN unified_agents ta ON m.to_agent = ta.id
                ORDER BY m.created_at DESC
                LIMIT ?
            `, [limit], (err, messages) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(messages.map(msg => ({
                        ...msg,
                        from_display: msg.from_name || msg.from_agent,
                        to_display: msg.to_name || msg.to_agent
                    })));
                }
            });
        });
    }
    
    async getConnections() {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT 
                    from_agent,
                    to_agent,
                    COUNT(*) as message_count,
                    AVG(field_impact) as avg_impact,
                    MAX(created_at) as last_interaction,
                    GROUP_CONCAT(DISTINCT harmony) as harmonies
                FROM unified_messages
                GROUP BY from_agent, to_agent
                HAVING message_count > 1
                ORDER BY message_count DESC
            `, (err, connections) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Calculate connection strength
                const maxMessages = Math.max(...connections.map(c => c.message_count));
                
                resolve(connections.map(conn => ({
                    from: conn.from_agent,
                    to: conn.to_agent,
                    strength: conn.message_count / maxMessages,
                    messages: conn.message_count,
                    avgImpact: conn.avg_impact,
                    lastInteraction: conn.last_interaction,
                    harmonies: (conn.harmonies || '').split(',').filter(h => h)
                })));
            });
        });
    }
    
    async getTemporalPatterns() {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT 
                    strftime('%H', datetime(created_at/1000, 'unixepoch')) as hour,
                    COUNT(*) as message_count,
                    AVG(field_impact) as avg_impact
                FROM unified_messages
                WHERE created_at > ?
                GROUP BY hour
                ORDER BY hour
            `, [Date.now() - 86400000], (err, hourly) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Get day of week patterns
                this.db.all(`
                    SELECT 
                        strftime('%w', datetime(created_at/1000, 'unixepoch')) as day,
                        COUNT(*) as message_count
                    FROM unified_messages
                    WHERE created_at > ?
                    GROUP BY day
                `, [Date.now() - 604800000], (err, daily) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    resolve({
                        hourly: hourly.map(h => ({
                            hour: parseInt(h.hour),
                            messages: h.message_count,
                            avgImpact: h.avg_impact
                        })),
                        daily: daily.map(d => ({
                            day: parseInt(d.day),
                            messages: d.message_count
                        })),
                        peakHour: hourly.reduce((max, h) => 
                            h.message_count > (max.message_count || 0) ? h : max, {}).hour,
                        quietHour: hourly.reduce((min, h) => 
                            h.message_count < (min.message_count || Infinity) ? h : min, {}).hour
                    });
                });
            });
        });
    }
    
    async getRealtimeUpdate() {
        // Get latest messages since last update
        const newMessages = await new Promise((resolve, reject) => {
            this.db.all(`
                SELECT * FROM unified_messages
                WHERE created_at > ?
                ORDER BY created_at DESC
                LIMIT 10
            `, [this.cache.lastUpdate], (err, messages) => {
                if (err) reject(err);
                else resolve(messages);
            });
        });
        
        if (newMessages.length > 0) {
            this.cache.lastUpdate = newMessages[0].created_at;
        }
        
        // Get current field state
        const fieldState = await this.getFieldState();
        
        // Get agent updates
        const agentUpdates = new Map();
        for (const msg of newMessages) {
            if (!agentUpdates.has(msg.from_agent)) {
                agentUpdates.set(msg.from_agent, { messages: 0, activity: 0 });
            }
            if (!agentUpdates.has(msg.to_agent)) {
                agentUpdates.set(msg.to_agent, { messages: 0, activity: 0 });
            }
            
            agentUpdates.get(msg.from_agent).messages++;
            agentUpdates.get(msg.from_agent).activity += 0.1;
            agentUpdates.get(msg.to_agent).messages++;
            agentUpdates.get(msg.to_agent).activity += 0.05;
        }
        
        return {
            fieldState,
            newMessages: newMessages.map(msg => ({
                from: msg.from_agent,
                to: msg.to_agent,
                harmony: msg.harmony,
                content: msg.content,
                timestamp: msg.created_at
            })),
            agentUpdates: Object.fromEntries(agentUpdates),
            timestamp: Date.now()
        };
    }
    
    calculateActivity(lastActive) {
        if (!lastActive) return 0;
        const timeSince = Date.now() - lastActive;
        const minutes = timeSince / 60000;
        
        // Activity decays over time
        return Math.max(0, Math.min(1, 1 - (minutes / 60)));
    }
    
    start() {
        this.app.listen(this.port, () => {
            console.log(`🌟 Living Field Data Server running on http://localhost:${this.port}`);
            console.log(`📊 Open http://localhost:${this.port} to view the visualizer`);
            console.log(`🔌 API endpoints:`);
            console.log(`   - GET /api/field-state`);
            console.log(`   - GET /api/agents`);
            console.log(`   - GET /api/messages`);
            console.log(`   - GET /api/connections`);
            console.log(`   - GET /api/temporal-patterns`);
            console.log(`   - GET /api/stream (Server-Sent Events)`);
        });
    }
}

// Run server if called directly
if (require.main === module) {
    const dbPath = process.argv[2] || '/home/tstoltz/Luminous-Dynamics/the-weave/cli/unified-agent-network.db';
    const port = process.argv[3] || 3333;
    
    const server = new FieldDataServer(dbPath, port);
    server.start();
}

module.exports = FieldDataServer;