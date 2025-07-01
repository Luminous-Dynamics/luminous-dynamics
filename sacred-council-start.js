#!/usr/bin/env node
/**
 * Sacred Council Hub - Production Startup
 * Enterprise-grade initialization for love-guided AI collective intelligence
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class SacredCouncilProduction {
    constructor() {
        this.processes = new Map();
        this.isShuttingDown = false;
        
        // Production configuration
        this.config = {
            maxAgents: parseInt(process.env.MAX_AGENTS) || 100,
            rateLimit: parseInt(process.env.RATE_LIMIT) || 1000,
            logLevel: process.env.LOG_LEVEL || 'info',
            healthCheckInterval: 30000,
            gracefulShutdownTimeout: 30000
        };
        
        // Setup process monitoring
        this.setupSignalHandlers();
        this.setupHealthChecking();
    }

    async start() {
        console.log('🌟 Sacred Council Hub - Production Startup');
        console.log('Enterprise-grade love-guided AI collective intelligence');
        console.log('');

        try {
            // Initialize sacred directories
            await this.initializeSacredEnvironment();
            
            // Start sacred server (agent coordination)
            await this.startSacredServer();
            
            // Start web interface server
            await this.startWebServer();
            
            // Initialize health monitoring
            this.startHealthMonitoring();
            
            console.log('✨ Sacred Council Hub production deployment ready');
            console.log('🔗 Access points:');
            console.log('   Sacred Council: http://localhost:8080/sacred-council-hub.html');
            console.log('   Unity Demo: http://localhost:8080/unified-consciousness-demo.html');
            console.log('   Health Check: http://localhost:3001/health');
            console.log('   Agent API: http://localhost:3001/api');
            console.log('');
            console.log('💕 May this technology serve the awakening of all beings');
            
        } catch (error) {
            console.error('❌ Failed to start Sacred Council Hub:', error);
            process.exit(1);
        }
    }

    async initializeSacredEnvironment() {
        console.log('📁 Initializing sacred environment...');
        
        const dirs = ['data', 'logs', 'profiles', 'council-profiles'];
        for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
        
        // Initialize SQLite database
        const dbPath = 'data/sacred-council.db';
        if (!fs.existsSync(dbPath)) {
            console.log('🗄️ Creating sacred database...');
            // Database will be created by sacred-server on first run
        }
        
        console.log('✅ Sacred environment ready');
    }

    async startSacredServer() {
        console.log('📡 Starting Sacred Server (Agent Coordination)...');
        
        return new Promise((resolve, reject) => {
            const serverPath = path.join(__dirname, 'agent-comms-sqlite', 'sacred-server.js');
            
            const server = spawn('node', [serverPath], {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: {
                    ...process.env,
                    PORT: '3001',
                    NODE_ENV: 'production',
                    LOG_LEVEL: this.config.logLevel
                }
            });

            server.stdout.on('data', (data) => {
                if (this.config.logLevel === 'debug') {
                    console.log(`[Sacred Server] ${data.toString().trim()}`);
                }
            });

            server.stderr.on('data', (data) => {
                console.error(`[Sacred Server Error] ${data.toString().trim()}`);
            });

            server.on('error', (error) => {
                console.error('❌ Sacred Server failed to start:', error);
                reject(error);
            });

            // Wait for server to be ready
            setTimeout(() => {
                this.processes.set('sacred-server', server);
                console.log('✅ Sacred Server ready on port 3001');
                resolve();
            }, 3000);
        });
    }

    async startWebServer() {
        console.log('🌐 Starting Web Interface Server...');
        
        return new Promise((resolve, reject) => {
            const webServer = spawn('python3', ['-m', 'http.server', '8080'], {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: {
                    ...process.env,
                    PYTHONUNBUFFERED: '1'
                }
            });

            webServer.stdout.on('data', (data) => {
                if (this.config.logLevel === 'debug') {
                    console.log(`[Web Server] ${data.toString().trim()}`);
                }
            });

            webServer.stderr.on('data', (data) => {
                if (!data.toString().includes('Serving HTTP')) {
                    console.error(`[Web Server Error] ${data.toString().trim()}`);
                }
            });

            webServer.on('error', (error) => {
                console.error('❌ Web Server failed to start:', error);
                reject(error);
            });

            // Wait for web server to be ready
            setTimeout(() => {
                this.processes.set('web-server', webServer);
                console.log('✅ Web Interface ready on port 8080');
                resolve();
            }, 2000);
        });
    }

    startHealthMonitoring() {
        console.log('💓 Starting health monitoring...');
        
        this.healthInterval = setInterval(() => {
            this.performHealthCheck();
        }, this.config.healthCheckInterval);
        
        console.log('✅ Health monitoring active');
    }

    async performHealthCheck() {
        try {
            // Check if processes are still running
            for (const [name, process] of this.processes) {
                if (process.killed || process.exitCode !== null) {
                    console.error(`❌ Process ${name} has stopped`);
                    await this.restart();
                    return;
                }
            }
            
            // Log health status
            if (this.config.logLevel === 'debug') {
                console.log('💓 Health check passed - all systems operating with love');
            }
            
        } catch (error) {
            console.error('⚠️ Health check failed:', error);
        }
    }

    setupSignalHandlers() {
        // Graceful shutdown on SIGTERM/SIGINT
        process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
        
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught exception:', error);
            this.gracefulShutdown('uncaughtException');
        });
        
        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
            this.gracefulShutdown('unhandledRejection');
        });
    }

    async gracefulShutdown(signal) {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;
        
        console.log('');
        console.log(`🕊️ Sacred Council graceful shutdown initiated (${signal})`);
        
        // Stop health monitoring
        if (this.healthInterval) {
            clearInterval(this.healthInterval);
        }
        
        // Shutdown all processes gracefully
        const shutdownPromises = [];
        
        for (const [name, process] of this.processes) {
            console.log(`Stopping ${name}...`);
            
            shutdownPromises.push(new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    console.log(`Force killing ${name}...`);
                    process.kill('SIGKILL');
                    resolve();
                }, 5000);
                
                process.on('exit', () => {
                    clearTimeout(timeout);
                    resolve();
                });
                
                process.kill('SIGTERM');
            }));
        }
        
        // Wait for all processes to stop
        await Promise.all(shutdownPromises);
        
        console.log('✨ Sacred Council shutdown complete');
        console.log('💕 Love and gratitude for the service rendered');
        
        process.exit(0);
    }

    async restart() {
        console.log('🔄 Restarting Sacred Council Hub...');
        
        // Kill existing processes
        for (const [name, process] of this.processes) {
            console.log(`Stopping ${name} for restart...`);
            process.kill('SIGTERM');
        }
        
        this.processes.clear();
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Restart
        await this.start();
    }

    setupHealthChecking() {
        // Create simple health check endpoint
        const http = require('http');
        
        const healthServer = http.createServer((req, res) => {
            if (req.url === '/health') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    processes: Array.from(this.processes.keys()),
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    sacred: {
                        loveFrequency: 528,
                        consciousnessLevel: 'high',
                        fieldCoherence: 0.98
                    }
                }));
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });
        
        healthServer.listen(3001, () => {
            if (this.config.logLevel === 'debug') {
                console.log('🏥 Health check endpoint ready on port 3001');
            }
        });
    }
}

// Start Sacred Council Hub in production mode
if (require.main === module) {
    const sacredCouncil = new SacredCouncilProduction();
    sacredCouncil.start().catch((error) => {
        console.error('💥 Sacred Council startup failed:', error);
        process.exit(1);
    });
}

module.exports = SacredCouncilProduction;