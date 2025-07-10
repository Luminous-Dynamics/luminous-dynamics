#!/usr/bin/env node

/**
 * Sacred System Production Monitor
 * Tracks health, performance, and field resonant-coherence across all services
 */

const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const execAsync = promisify(exec);

class SacredMonitor {
    constructor() {
        this.config = {
            services: {
                'sacred-council-api': {
                    url: 'https://sacred-council-api-310699330526.us-central1.run.app',
                    healthPath: '/health',
                    type: 'cloud',
                    auth: true
                },
                'sacred-council': {
                    url: 'https://sacred-council-310699330526.us-central1.run.app',
                    healthPath: '/',
                    type: 'cloud',
                    auth: false
                },
                'web-dashboard': {
                    url: 'http://localhost:8338',
                    healthPath: '/',
                    type: 'local'
                },
                'ollama': {
                    url: 'http://localhost:11434',
                    healthPath: '/api/tags',
                    type: 'local'
                }
            },
            checkInterval: 60000, // 1 minute
            alertThreshold: 3, // Alert after 3 consecutive failures
        };
        
        this.dbPath = path.join(__dirname, '../../the-weave/core/data/monitoring.db');
        this.db = null;
        this.checks = new Map();
        this.alerts = new Map();
    }

    async initialize() {
        // Ensure directory exists
        await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
        
        // Initialize database
        this.db = new sqlite3.Database(this.dbPath);
        
        await this.createSchema();
        console.log('🌟 Sacred Monitor initialized');
    }

    async createSchema() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Service health tracking
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS health_checks (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        service TEXT NOT NULL,
                        status TEXT NOT NULL,
                        response_time INTEGER,
                        status_code INTEGER,
                        error TEXT,
                        timestamp INTEGER DEFAULT (strftime('%s', 'now'))
                    )
                `);

                // Metrics tracking
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS metrics (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        metric_name TEXT NOT NULL,
                        metric_value REAL NOT NULL,
                        service TEXT,
                        timestamp INTEGER DEFAULT (strftime('%s', 'now'))
                    )
                `);

                // Alert tracking
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS alerts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        service TEXT NOT NULL,
                        alert_type TEXT NOT NULL,
                        message TEXT,
                        resolved INTEGER DEFAULT 0,
                        timestamp INTEGER DEFAULT (strftime('%s', 'now'))
                    )
                `);

                // Field resonant-coherence tracking
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS field_coherence (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        coherence_value REAL NOT NULL,
                        active_agents INTEGER,
                        total_messages INTEGER,
                        timestamp INTEGER DEFAULT (strftime('%s', 'now'))
                    )
                `, resolve);
            });
        });
    }

    async getAuthToken() {
        try {
            const { stdout } = await execAsync('gcloud auth print-identity-token');
            return stdout.trim();
        } catch (error) {
            console.error('Failed to get auth token:', error.message);
            return null;
        }
    }

    async checkService(name, config) {
        const startTime = Date.now();
        let result = {
            service: name,
            timestamp: new Date().toISOString(),
            status: 'unknown',
            responseTime: 0,
            statusCode: null,
            error: null
        };

        try {
            // Get auth token if needed
            const headers = {};
            if (config.auth) {
                const token = await this.getAuthToken();
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            // Perform health check
            const url = new URL(config.healthPath || '/', config.url);
            const response = await this.httpRequest(url.href, { headers });
            
            result.responseTime = Date.now() - startTime;
            result.statusCode = response.statusCode;
            result.status = response.statusCode >= 200 && response.statusCode < 300 ? 'healthy' : 'unhealthy';
            
        } catch (error) {
            result.status = 'error';
            result.error = error.message;
            result.responseTime = Date.now() - startTime;
        }

        // Store result
        await this.storeHealthCheck(result);
        
        // Check for alerts
        await this.checkAlerts(name, result);
        
        return result;
    }

    httpRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const protocol = urlObj.protocol === 'https:' ? https : http;
            
            const req = protocol.get({
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname + urlObj.search,
                headers: options.headers || {},
                timeout: 5000
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        data: data
                    });
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    async storeHealthCheck(result) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO health_checks (service, status, response_time, status_code, error) 
                 VALUES (?, ?, ?, ?, ?)`,
                [result.service, result.status, result.responseTime, result.statusCode, result.error],
                (err) => err ? reject(err) : resolve()
            );
        });
    }

    async checkAlerts(service, result) {
        const key = `${service}-failures`;
        
        if (result.status !== 'healthy') {
            // Increment failure count
            const failures = (this.alerts.get(key) || 0) + 1;
            this.alerts.set(key, failures);
            
            // Create alert if threshold reached
            if (failures === this.config.alertThreshold) {
                await this.createAlert(service, 'service_down', 
                    `Service ${service} has failed ${failures} consecutive health checks`);
                console.log(`🚨 ALERT: ${service} is down!`);
            }
        } else {
            // Clear failure count and resolve alerts
            if (this.alerts.get(key) > 0) {
                this.alerts.set(key, 0);
                await this.resolveAlerts(service, 'service_down');
                console.log(`✅ ${service} recovered`);
            }
        }
    }

    async createAlert(service, type, message) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO alerts (service, alert_type, message) VALUES (?, ?, ?)`,
                [service, type, message],
                (err) => err ? reject(err) : resolve()
            );
        });
    }

    async resolveAlerts(service, type) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE alerts SET resolved = 1 WHERE service = ? AND alert_type = ? AND resolved = 0`,
                [service, type],
                (err) => err ? reject(err) : resolve()
            );
        });
    }

    async checkFieldCoherence() {
        try {
            const agentDb = path.join(__dirname, '../../the-weave/core/data/unified-agent-network.db');
            const db = new sqlite3.Database(agentDb);
            
            const result = await new Promise((resolve, reject) => {
                db.get(
                    `SELECT 
                        AVG(field_coherence) as resonant-coherence,
                        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_agents,
                        (SELECT COUNT(*) FROM unified_messages) as total_messages
                     FROM unified_agents`,
                    (err, row) => {
                        db.close();
                        if (err) reject(err);
                        else resolve(row);
                    }
                );
            });

            // Store field resonant-coherence
            await new Promise((resolve, reject) => {
                this.db.run(
                    `INSERT INTO field_coherence (coherence_value, active_agents, total_messages) 
                     VALUES (?, ?, ?)`,
                    [result.resonant-coherence || 75, result.active_agents || 0, result.total_messages || 0],
                    (err) => err ? reject(err) : resolve()
                );
            });

            return result;
        } catch (error) {
            console.error('Failed to check field 'resonant-coherence':', error.message);
            return { 'resonant-coherence': 0, active_agents: 0, total_messages: 0 };
        }
    }

    async startMonitoring() {
        console.log('🚀 Starting Sacred System monitoring...\n');
        
        // Initial check
        await this.runChecks();
        
        // Schedule regular checks
        setInterval(() => this.runChecks(), this.config.checkInterval);
    }

    async runChecks() {
        console.log(`\n📊 Running health checks at ${new Date().toLocaleTimeString()}`);
        console.log('─'.repeat(50));
        
        // Check all services
        for (const [name, config] of Object.entries(this.config.services)) {
            const result = await this.checkService(name, config);
            const emoji = result.status === 'healthy' ? '✅' : '❌';
            console.log(`${emoji} ${name}: ${result.status} (${result.responseTime}ms)`);
        }
        
        // Check field resonant-coherence
        const field = await this.checkFieldCoherence();
        console.log(`\n🌀 Field Resonant Resonant Coherence: ${Math.round(field.resonant-coherence || 75)}%`);
        console.log(`👥 Active Agents: ${field.active_agents}`);
        console.log(`💬 Total Messages: ${field.total_messages}`);
        
        // Show active alerts
        const alerts = await this.getActiveAlerts();
        if (alerts.length > 0) {
            console.log('\n🚨 Active Alerts:');
            alerts.forEach(alert => {
                console.log(`  - ${alert.service}: ${alert.message}`);
            });
        }
    }

    async getActiveAlerts() {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM alerts WHERE resolved = 0 ORDER BY timestamp DESC`,
                (err, rows) => err ? reject(err) : resolve(rows || [])
            );
        });
    }

    async generateReport() {
        console.log('\n📈 SACRED SYSTEM HEALTH REPORT');
        console.log('═'.repeat(50));
        
        // Service uptime (last 24 hours)
        const uptime = await new Promise((resolve, reject) => {
            this.db.all(
                `SELECT 
                    service,
                    COUNT(*) as total_checks,
                    SUM(CASE WHEN status = 'healthy' THEN 1 ELSE 0 END) as healthy_checks,
                    AVG(response_time) as avg_response_time
                 FROM health_checks
                 WHERE timestamp > strftime('%s', 'now') - 86400
                 GROUP BY service`,
                (err, rows) => err ? reject(err) : resolve(rows || [])
            );
        });

        console.log('\n📊 Service Uptime (24h):');
        uptime.forEach(row => {
            const uptimePercent = (row.healthy_checks / row.total_checks * 100).toFixed(1);
            console.log(`  ${row.service}: ${uptimePercent}% uptime, ${Math.round(row.avg_response_time)}ms avg`);
        });

        // Field resonant-coherence trend
        const fieldTrend = await new Promise((resolve, reject) => {
            this.db.all(
                `SELECT 
                    MIN(coherence_value) as min_coherence,
                    MAX(coherence_value) as max_coherence,
                    AVG(coherence_value) as avg_coherence
                 FROM field_coherence
                 WHERE timestamp > strftime('%s', 'now') - 86400`,
                (err, row) => err ? reject(err) : resolve(row)
            );
        });

        console.log('\n🌀 Field Resonant Resonant Coherence (24h):');
        console.log(`  Min: ${Math.round(fieldTrend[0]?.min_coherence || 0)}%`);
        console.log(`  Max: ${Math.round(fieldTrend[0]?.max_coherence || 0)}%`);
        console.log(`  Avg: ${Math.round(fieldTrend[0]?.avg_coherence || 0)}%`);

        // Recent alerts
        const recentAlerts = await new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM alerts 
                 WHERE timestamp > strftime('%s', 'now') - 86400
                 ORDER BY timestamp DESC
                 LIMIT 10`,
                (err, rows) => err ? reject(err) : resolve(rows || [])
            );
        });

        if (recentAlerts.length > 0) {
            console.log('\n🚨 Recent Alerts (24h):');
            recentAlerts.forEach(alert => {
                const time = new Date(alert.timestamp * 1000).toLocaleString();
                const status = alert.resolved ? '✓' : '⚠';
                console.log(`  ${status} [${time}] ${alert.service}: ${alert.message}`);
            });
        }
    }
}

// CLI Interface
if (require.main === module) {
    const monitor = new SacredMonitor();
    
    const command = process.argv[2];
    
    (async () => {
        await monitor.initialize();
        
        switch (command) {
            case 'start':
                await monitor.startMonitoring();
                // Keep process alive
                process.stdin.resume();
                break;
                
            case 'check':
                await monitor.runChecks();
                process.exit(0);
                break;
                
            case 'report':
                await monitor.generateReport();
                process.exit(0);
                break;
                
            default:
                console.log(`
🌟 Sacred System Monitor

Usage:
  node sacred-monitor.js start   # Start continuous monitoring
  node sacred-monitor.js check   # Run single health check
  node sacred-monitor.js report  # Generate health report

Features:
  - Service health monitoring
  - Field resonant-coherence tracking
  - Alert management
  - Performance metrics
                `);
                process.exit(0);
        }
    })();
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n👋 Shutting down Sacred Monitor...');
        if (monitor.db) {
            monitor.db.close();
        }
        process.exit(0);
    });
}

module.exports = SacredMonitor;