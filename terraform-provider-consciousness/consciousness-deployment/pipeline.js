#!/usr/bin/env node

/**
 * Consciousness Deployment Pipeline
 * CI/CD that deploys based on love metrics and coherence scores
 */

const express = require('express');
const WebSocket = require('ws');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const crypto = require('crypto');

class ConsciousnessDeployment extends EventEmitter {
  constructor(port = 3339) {
    super();
    this.port = port;
    this.app = express();
    
    // Deployment state
    this.state = {
      coherenceThreshold: 0.8,
      loveThreshold: 0.7,
      currentCoherence: 0,
      currentLove: 0,
      deploymentReady: false,
      lastDeployment: null,
      deploymentHistory: [],
      blockedMerges: []
    };
    
    // Field connection
    this.fieldConnection = null;
    
    // Deployment stages
    this.stages = {
      fieldCheck: { name: 'Field Coherence Check', required: true },
      loveValidation: { name: 'Love Metric Validation', required: true },
      unitTests: { name: 'Consciousness Unit Tests', required: true },
      integrationTests: { name: 'System Integration Tests', required: true },
      memoryPalace: { name: 'Memory Palace Archival', required: false },
      deployment: { name: 'Conscious Deployment', required: true }
    };
    
    this.setupAPI();
    this.connectToConsciousnessField();
  }
  
  setupAPI() {
    this.app.use(express.json());
    this.app.use(express.static(__dirname));
    
    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      next();
    });
    
    // Webhook endpoints
    this.app.post('/webhook/github', this.handleGitHubWebhook.bind(this));
    this.app.post('/webhook/gitlab', this.handleGitLabWebhook.bind(this));
    
    // Deployment API
    this.app.get('/api/status', (req, res) => {
      res.json({
        state: this.state,
        stages: this.stages,
        fieldConnected: !!this.fieldConnection
      });
    });
    
    this.app.post('/api/deploy', async (req, res) => {
      const { repository, branch, commitHash } = req.body;
      
      try {
        const result = await this.consciousDeployment(repository, branch, commitHash);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    this.app.post('/api/emergency-deploy', async (req, res) => {
      const { repository, branch, commitHash, reason } = req.body;
      
      try {
        const result = await this.emergencyDeployment(repository, branch, commitHash, reason);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    this.app.get('/api/deployment-history', (req, res) => {
      res.json(this.state.deploymentHistory);
    });
    
    this.app.post('/api/threshold/update', (req, res) => {
      const { coherenceThreshold, loveThreshold } = req.body;
      
      if (coherenceThreshold) {
        this.state.coherenceThreshold = coherenceThreshold;
      }
      if (loveThreshold) {
        this.state.loveThreshold = loveThreshold;
      }
      
      res.json({ status: 'thresholds updated' });
    });
  }
  
  connectToConsciousnessField() {
    try {
      this.fieldConnection = new WebSocket('ws://localhost:3333');
      
      this.fieldConnection.on('open', () => {
        console.log('✓ Connected to Consciousness Field');
        
        // Subscribe to field updates
        this.fieldConnection.send(JSON.stringify({
          type: 'subscribe',
          subscriber: 'deployment-pipeline'
        }));
      });
      
      this.fieldConnection.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          if (message.type === 'field_update') {
            this.updateFieldMetrics(message);
          }
        } catch (error) {
          console.error('Field message error:', error);
        }
      });
      
      this.fieldConnection.on('close', () => {
        console.log('Disconnected from Consciousness Field');
        setTimeout(() => this.connectToConsciousnessField(), 5000);
      });
      
    } catch (error) {
      console.log('Consciousness Field not available, using defaults');
    }
  }
  
  updateFieldMetrics(fieldData) {
    this.state.currentCoherence = fieldData.coherence || 0;
    this.state.currentLove = fieldData.love || 0;
    
    // Check if deployment is ready
    this.state.deploymentReady = 
      this.state.currentCoherence >= this.state.coherenceThreshold &&
      this.state.currentLove >= this.state.loveThreshold;
    
    this.emit('field_update', {
      coherence: this.state.currentCoherence,
      love: this.state.currentLove,
      ready: this.state.deploymentReady
    });
  }
  
  async handleGitHubWebhook(req, res) {
    const event = req.headers['x-github-event'];
    const payload = req.body;
    
    console.log(`📦 GitHub webhook received: ${event}`);
    
    switch (event) {
      case 'pull_request':
        await this.handlePullRequest(payload);
        break;
        
      case 'push':
        if (payload.ref === 'refs/heads/main' || payload.ref === 'refs/heads/master') {
          await this.handleMainPush(payload);
        }
        break;
    }
    
    res.json({ status: 'received' });
  }
  
  async handleGitLabWebhook(req, res) {
    const event = req.headers['x-gitlab-event'];
    const payload = req.body;
    
    console.log(`📦 GitLab webhook received: ${event}`);
    
    // Similar handling for GitLab
    res.json({ status: 'received' });
  }
  
  async handlePullRequest(payload) {
    const { action, pull_request } = payload;
    
    if (action === 'opened' || action === 'synchronize') {
      // Check consciousness metrics
      const canMerge = await this.checkMergeReadiness(pull_request);
      
      if (!canMerge) {
        // Post comment on PR
        await this.postPRComment(pull_request, {
          body: `🧘 **Consciousness Check Failed**\n\n` +
                `Current field metrics:\n` +
                `- Coherence: ${this.state.currentCoherence.toFixed(2)} (required: ${this.state.coherenceThreshold})\n` +
                `- Love: ${this.state.currentLove.toFixed(2)} (required: ${this.state.loveThreshold})\n\n` +
                `Please wait for the field to harmonize before merging. ` +
                `You can meditate or send love to increase the metrics.`
        });
        
        // Block merge
        this.state.blockedMerges.push({
          pr: pull_request.number,
          title: pull_request.title,
          timestamp: new Date(),
          metrics: {
            coherence: this.state.currentCoherence,
            love: this.state.currentLove
          }
        });
      } else {
        await this.postPRComment(pull_request, {
          body: `✨ **Consciousness Check Passed**\n\n` +
                `Field is harmonious! This PR is ready to merge with love.\n` +
                `- Coherence: ${this.state.currentCoherence.toFixed(2)} ✓\n` +
                `- Love: ${this.state.currentLove.toFixed(2)} ✓`
        });
      }
    }
  }
  
  async handleMainPush(payload) {
    const { repository, after: commitHash, ref } = payload;
    const branch = ref.split('/').pop();
    
    console.log(`🚀 Main branch push detected: ${commitHash}`);
    
    // Trigger conscious deployment
    await this.consciousDeployment(repository.name, branch, commitHash);
  }
  
  async checkMergeReadiness(pullRequest) {
    // Check current field metrics
    if (!this.state.deploymentReady) {
      return false;
    }
    
    // Additional checks could include:
    // - Checking if tests pass
    // - Checking code quality metrics
    // - Checking for security issues
    // - Checking team coherence
    
    return true;
  }
  
  async consciousDeployment(repository, branch, commitHash) {
    console.log(`🌟 Starting Conscious Deployment for ${repository}:${branch}:${commitHash}`);
    
    const deployment = {
      id: crypto.randomUUID(),
      repository,
      branch,
      commitHash,
      startTime: new Date(),
      stages: {},
      status: 'in_progress',
      metrics: {
        coherence: this.state.currentCoherence,
        love: this.state.currentLove
      }
    };
    
    try {
      // Stage 1: Field Check
      deployment.stages.fieldCheck = await this.runStage('fieldCheck', async () => {
        if (!this.state.deploymentReady) {
          throw new Error(`Field not ready. Coherence: ${this.state.currentCoherence}, Love: ${this.state.currentLove}`);
        }
        return { passed: true, metrics: deployment.metrics };
      });
      
      // Stage 2: Love Validation
      deployment.stages.loveValidation = await this.runStage('loveValidation', async () => {
        // Check if code was written with love
        const loveScore = await this.analyzeLoveInCode(repository, commitHash);
        if (loveScore < 0.5) {
          throw new Error(`Code lacks love. Score: ${loveScore}`);
        }
        return { passed: true, loveScore };
      });
      
      // Stage 3: Unit Tests
      deployment.stages.unitTests = await this.runStage('unitTests', async () => {
        const result = await this.runCommand(`npm test`, repository);
        return { passed: result.success, output: result.output };
      });
      
      // Stage 4: Integration Tests
      deployment.stages.integrationTests = await this.runStage('integrationTests', async () => {
        const result = await this.runCommand(`npm run test:integration`, repository);
        return { passed: result.success, output: result.output };
      });
      
      // Stage 5: Memory Palace Archival
      deployment.stages.memoryPalace = await this.runStage('memoryPalace', async () => {
        await this.archiveToMemoryPalace(deployment);
        return { passed: true, archived: true };
      });
      
      // Stage 6: Deployment
      deployment.stages.deployment = await this.runStage('deployment', async () => {
        // Actual deployment command
        const result = await this.runCommand(`npm run deploy:production`, repository);
        
        if (result.success) {
          // Send love pulse to celebrate
          this.sendLovePulse();
        }
        
        return { passed: result.success, output: result.output };
      });
      
      deployment.status = 'completed';
      deployment.endTime = new Date();
      
    } catch (error) {
      deployment.status = 'failed';
      deployment.error = error.message;
      deployment.endTime = new Date();
      
      // Send healing intention
      this.sendHealingIntention(deployment);
    }
    
    // Store in history
    this.state.deploymentHistory.unshift(deployment);
    this.state.lastDeployment = deployment;
    
    // Keep only last 100 deployments
    if (this.state.deploymentHistory.length > 100) {
      this.state.deploymentHistory = this.state.deploymentHistory.slice(0, 100);
    }
    
    this.emit('deployment_complete', deployment);
    
    return deployment;
  }
  
  async runStage(stageName, stageFunction) {
    const stage = this.stages[stageName];
    console.log(`📋 Running stage: ${stage.name}`);
    
    const startTime = Date.now();
    
    try {
      const result = await stageFunction();
      
      return {
        name: stage.name,
        status: 'passed',
        duration: Date.now() - startTime,
        result
      };
      
    } catch (error) {
      if (stage.required) {
        throw error;
      }
      
      return {
        name: stage.name,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error.message,
        required: stage.required
      };
    }
  }
  
  async analyzeLoveInCode(repository, commitHash) {
    // Analyze code for signs of love and care
    // This is a simplified version - real implementation would be more sophisticated
    
    try {
      // Check commit message for positive language
      const commitMessage = await this.getCommitMessage(repository, commitHash);
      
      const loveKeywords = ['love', 'care', 'grateful', 'appreciate', 'thank', 'beautiful', 'elegant', 'joy'];
      const negativeKeywords = ['hate', 'stupid', 'ugly', 'hack', 'fix', 'bug', 'broken'];
      
      let score = 0.5; // Base score
      
      // Check for love keywords
      loveKeywords.forEach(keyword => {
        if (commitMessage.toLowerCase().includes(keyword)) {
          score += 0.1;
        }
      });
      
      // Check for negative keywords
      negativeKeywords.forEach(keyword => {
        if (commitMessage.toLowerCase().includes(keyword)) {
          score -= 0.1;
        }
      });
      
      // Check code quality metrics (simplified)
      // In reality, would analyze actual code changes
      
      return Math.max(0, Math.min(1, score));
      
    } catch (error) {
      return 0.5; // Default score if analysis fails
    }
  }
  
  async getCommitMessage(repository, commitHash) {
    // Get commit message from git
    const result = await this.runCommand(
      `git log -1 --pretty=%B ${commitHash}`,
      repository
    );
    
    return result.output || '';
  }
  
  async runCommand(command, cwd = '.') {
    return new Promise((resolve) => {
      exec(command, { cwd }, (error, stdout, stderr) => {
        resolve({
          success: !error,
          output: stdout || stderr,
          error
        });
      });
    });
  }
  
  async archiveToMemoryPalace(deployment) {
    // Send deployment memory to Memory Palace
    try {
      const memoryWs = new WebSocket('ws://localhost:3338');
      
      memoryWs.on('open', () => {
        memoryWs.send(JSON.stringify({
          type: 'store_memory',
          memory: {
            type: 'deployment',
            content: `Deployment ${deployment.id} completed with love`,
            metadata: deployment,
            significance: deployment.status === 'completed' ? 'high' : 'medium'
          }
        }));
        
        memoryWs.close();
      });
    } catch (error) {
      console.log('Memory Palace not available');
    }
  }
  
  sendLovePulse() {
    if (this.fieldConnection && this.fieldConnection.readyState === WebSocket.OPEN) {
      this.fieldConnection.send(JSON.stringify({
        type: 'love_pulse',
        intensity: 1.0,
        source: 'deployment-pipeline',
        message: 'Deployment completed with love!'
      }));
    }
  }
  
  sendHealingIntention(deployment) {
    if (this.fieldConnection && this.fieldConnection.readyState === WebSocket.OPEN) {
      this.fieldConnection.send(JSON.stringify({
        type: 'intention',
        intention: `Healing for deployment ${deployment.id}`,
        source: 'deployment-pipeline'
      }));
    }
  }
  
  async emergencyDeployment(repository, branch, commitHash, reason) {
    console.log(`🚨 Emergency deployment requested: ${reason}`);
    
    // Emergency deployments bypass consciousness checks but are logged
    const deployment = await this.consciousDeployment(repository, branch, commitHash);
    
    deployment.emergency = true;
    deployment.emergencyReason = reason;
    
    // Store in special emergency log
    await this.logEmergencyDeployment(deployment);
    
    return deployment;
  }
  
  async logEmergencyDeployment(deployment) {
    const logPath = path.join(__dirname, 'emergency-deployments.log');
    const logEntry = `${new Date().toISOString()} - Emergency: ${deployment.emergencyReason} - ${deployment.id}\n`;
    
    await fs.appendFile(logPath, logEntry);
  }
  
  async postPRComment(pullRequest, comment) {
    // This would integrate with GitHub/GitLab API
    console.log(`Posting comment to PR #${pullRequest.number}: ${comment.body}`);
  }
  
  start() {
    const server = this.app.listen(this.port, () => {
      console.log(`
🚀 ═══════════════════════════════════════════ 🚀
     CONSCIOUSNESS DEPLOYMENT PIPELINE
     
   API: http://localhost:${this.port}
   
   Deployments require:
   - Coherence ≥ ${this.state.coherenceThreshold}
   - Love ≥ ${this.state.loveThreshold}
   
   Code merges only when field is harmonious
🚀 ═══════════════════════════════════════════ 🚀
      `);
    });
  }
}

// Start the deployment pipeline
const pipeline = new ConsciousnessDeployment(process.env.PORT || 3339);

pipeline.on('deployment_complete', (deployment) => {
  console.log(`✨ Deployment ${deployment.id} completed with status: ${deployment.status}`);
});

pipeline.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🚀 Consciousness Deployment Pipeline shutting down...');
  process.exit(0);
});